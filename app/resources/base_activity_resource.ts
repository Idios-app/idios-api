import logger from '@adonisjs/core/services/logger'
import ReferenceInterface from '../interfaces/reference_interface.js'
import Reference from '#models/reference'
import { ModelObject } from '@adonisjs/lucid/types/model'

enum Props {
  dialogs = 'dialogs',
  background = 'background',
  items = 'items',
  canCreate = 'canCreate',
}

const SLICE_DATA_PROPS = [Props.dialogs, Props.items, Props.canCreate]

type SliceData = {
  [key: string]: SliceData | any
}

export abstract class BaseActivityResource {
  protected schema: Array<object> = []
  protected activityInfo: { id: string; title: string }
  protected references: ReferenceInterface | undefined
  readonly #arrayKey: string | undefined
  readonly #data: any

  constructor(data: any, references?: ReferenceInterface) {
    this.activityInfo = { id: data.id, title: data.attributes.title }
    this.references = references
    this.#data = data
    if (this.#data && this.#data.attributes) {
      this.#arrayKey = Object.keys(this.#data.attributes).find((key) =>
        Array.isArray(this.#data.attributes[key])
      )
    }
  }

  abstract additionalProperties(): {}

  async init() {
    if (this.#arrayKey) {
      await this.parser(this.#data.attributes[this.#arrayKey])
      return this.schema
    }
  }

  private async parser(obj: any, parentData: SliceData = {}) {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue

      const value = obj[key]

      if (Props.hasOwnProperty(key)) {
        await this.handleEnum(key, value, parentData, obj)
      } else if (key === '__component') {
        await this.handleComponent(obj)
      } else if (this.isObject(value)) {
        await this.handleObject(value, parentData)
      } else {
        this.handleScalar(key, value, parentData)
      }
    }
    return parentData
  }

  private isObject(value: any): boolean {
    return typeof value === 'object' && value !== null
  }

  private async handleEnum(key: string, value: any, parentData: SliceData, obj: any) {
    const enumValue = Props[key as keyof typeof Props]
    const methodName = Props[key as keyof typeof Props]

    if (typeof this[methodName] === 'function') {
      await this[methodName].call(this, value, parentData)

      if (SLICE_DATA_PROPS.includes(enumValue) && !parentData.sliceData) {
        parentData.sliceData = {}
      }

      if (parentData[key] && SLICE_DATA_PROPS.includes(enumValue) && parentData.sliceData) {
        parentData.sliceData[key] = parentData[key]
        delete parentData[key]
      }

      delete obj[key]
    }
  }

  private async handleComponent(obj: any) {
    const componentName = obj['__component'].match(/\w+$/)[0]
    delete obj['__component']

    const componentData = await this.parser(obj, { slice: componentName })

    if (Object.keys(componentData).length > 0) {
      this.schema = [...this.schema, componentData]
    }
  }

  private async handleObject(value: any, parentData: SliceData) {
    if (Array.isArray(value)) {
      for (const item of value) {
        await this.parser(item, parentData)
      }
    } else {
      await this.parser(value, parentData)
    }
  }

  private handleScalar(key: string, value: any, parentData: SliceData) {
    if (!parentData.sliceData) {
      parentData.sliceData = {}
    }

    parentData.sliceData[key] = value
  }

  private async dialogs(obj: any, parentData: SliceData) {
    for (const dialog of obj) {
      const string = await this.detectVariable(dialog.text)
      if (string) dialog.text = string
    }
    parentData[Props.dialogs] = obj
  }

  private async items(obj: any, parentData: SliceData) {
    for (const item of obj) {
      const string = await this.detectVariable(item.text)
      if (string) item.text = string
    }
    parentData[Props.items] = obj
  }

  private async background(obj: any, parentData: SliceData) {
    parentData[Props.background] = obj
  }

  private async canCreate(obj: any, parentData: SliceData) {
    parentData[Props.canCreate] = obj
  }

  protected async detectVariable(string: string) {
    if (!this.references) return
    if (!string.includes('{{') || !string.includes('}}')) return

    const regex = /{{\s*(\S+)\s*}}/g
    let matches
    const variables = []

    while ((matches = regex.exec(string)) !== null) {
      const reference = await Reference.findBy('key', matches[1].toLowerCase())
      if (reference) {
        const pathKey = reference.key.split('.')
        variables.push({ key: matches[0], path: reference.path, pathKey: pathKey })
      } else {
        logger.fatal(
          `Error: detectVariable -> Variable "${matches[1]}" not found -> Activity "${this.activityInfo.title}"(${this.activityInfo.id})`
        )
      }
    }

    if (variables.length === 0) return string
    let resultString = string
    for (const variable of variables) {
      const models = await this.pathFinder(variable.path, this.references.adventure)
      if (Array.isArray(models)) {
        this.references.custom = {
          ...this.references.custom,
          [`${variable.key}`]: 3,
        }
      } else if (typeof models === 'object' && models !== null) {
        const replacementValue = models[variable.pathKey[variable.pathKey.length - 1]]
        resultString = resultString.replace(variable.key, replacementValue)
      }
    }

    return resultString
  }

  protected async pathFinder(
    path: object,
    model: ModelObject | Array<ModelObject>
  ): Promise<ModelObject | Array<ModelObject>> {
    for (const key in path) {
      if (path.hasOwnProperty(key)) {
        const deep = path[key as keyof typeof path]
        if (Object.keys(deep).length === 0) {
          return model
        }

        if (Array.isArray(model)) {
          logger.fatal(
            `Error : pathFinder -> ${JSON.stringify(path)} / ${JSON.stringify(deep)} -> Activity "${this.activityInfo.title}"(${this.activityInfo.id})`
          )
          return model
        }

        const result: ModelObject | Array<ModelObject> = await this.pathFinder(
          deep,
          await model.related(Object.keys(deep)[0]).query()
        )

        if (result) {
          return result
        }
      }
    }

    return model
  }
}
