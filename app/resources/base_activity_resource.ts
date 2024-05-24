import logger from '@adonisjs/core/services/logger'
import CustomVariableReferences from '../enums/custom_variable_references.js'

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

  constructor(data: any) {
    this.activityInfo = { id: data.id, title: data.attributes.title }
    if (data && data.attributes) {
      const arrayKey = Object.keys(data.attributes).find((key) =>
        Array.isArray(data.attributes[key])
      )
      if (arrayKey) {
        this.parser(data.attributes[arrayKey])
      }
    }
  }

  abstract additionalProperties(): {}

  private parser(obj: any, parentData: SliceData = {}): SliceData {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue

      const value = obj[key]

      if (Props.hasOwnProperty(key)) {
        this.handleEnum(key, value, parentData, obj)
      } else if (key === '__component') {
        this.handleComponent(obj)
      } else if (this.isObject(value)) {
        this.handleObject(value, parentData)
      } else {
        this.handleScalar(key, value, parentData)
      }
    }
    return parentData
  }

  private isObject(value: any): boolean {
    return typeof value === 'object' && value !== null
  }

  private handleEnum(key: string, value: any, parentData: SliceData, obj: any): void {
    const enumValue = Props[key as keyof typeof Props]
    const methodName = Props[key as keyof typeof Props]

    if (typeof this[methodName] === 'function') {
      this[methodName].call(this, value, parentData)

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

  private handleComponent(obj: any): void {
    const componentName = obj['__component'].match(/\w+$/)[0]
    delete obj['__component']

    const componentData = this.parser(obj, { slice: componentName })

    if (Object.keys(componentData).length > 0) {
      this.schema = [...this.schema, componentData]
    }
  }

  private handleObject(value: any, parentData: SliceData): void {
    if (Array.isArray(value)) {
      for (const item of value) {
        this.parser(item, parentData)
      }
    } else {
      this.parser(value, parentData)
    }
  }

  private handleScalar(key: string, value: any, parentData: SliceData): void {
    if (!parentData.sliceData) {
      parentData.sliceData = {}
    }

    parentData.sliceData[key] = value
  }

  private dialogs(obj: any, parentData: SliceData) {
    if (Array.isArray(obj)) {
      obj.forEach((dialog: any) => {
        delete dialog.id
      })
      parentData[Props.dialogs] = obj
    } else if (typeof obj === 'object') {
      delete obj.id
      parentData[Props.dialogs] = obj
    }
  }

  private items(obj: any, parentData: SliceData) {
    obj.forEach((item: any) => {
      this.detectVariable(item.text)
    })
    parentData[Props.items] = obj
  }

  private background(obj: any, parentData: SliceData) {
    parentData[Props.background] = obj
  }

  private canCreate(obj: any, parentData: SliceData) {
    parentData[Props.canCreate] = obj
  }

  protected detectVariable(string: string): boolean {
    if (string.includes('{{') && string.includes('}}')) {
      const regex = /{{\s*(\S+)\s*}}/
      const match = string.match(regex)
      if (!match) {
        logger.fatal(
          `Error : detectVariable -> ${string} -> Activity "${this.activityInfo.title}"(${this.activityInfo.id})`
        )
        return false
      }

      const variable = match[1].split('.')

      const model =
        CustomVariableReferences[variable[1].toUpperCase() as keyof typeof CustomVariableReferences]

      console.log(model)

      //TODO : Bring up auth related info (adventure id, collaborator id)
      //const targetedModel

      //const mediumVal = CustomVariableReferences[test as keyof typeof CustomVariableReferences]
    }

    return false
  }
}
