import Activities from '../enums/activities.js'

enum List {
  dialogs = 'dialogs',
  background = 'background',
  items = 'items',
}

const SLICE_DATA_PROPS = [List.dialogs, List.items]

type SliceData = {
  [key: string]: SliceData | any
  slice?: string
}

export abstract class BaseActivityResource {
  protected schema: Array<object> = []

  constructor(data: any, type: Activities) {
    this.parseJson(data.attributes[type])
  }

  abstract additionalProperties(): {}

  private parseJson(obj: any, parentData: SliceData = {}): SliceData {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue

      const value = obj[key]

      if (this.isEnum(key)) {
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

  private isEnum(key: string): boolean {
    return List.hasOwnProperty(key)
  }

  private isObject(value: any): boolean {
    return typeof value === 'object' && value !== null
  }

  private handleEnum(key: string, value: any, parentData: SliceData, obj: any): void {
    const enumValue = List[key as keyof typeof List]
    const methodName = List[key as keyof typeof List]

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

    const componentData = this.parseJson(obj, { slice: componentName })

    if (Object.keys(componentData).length > 0) {
      this.schema = [...this.schema, componentData]
    }
  }

  private handleObject(value: any, parentData: SliceData): void {
    if (Array.isArray(value)) {
      for (const item of value) {
        this.parseJson(item, parentData)
      }
    } else {
      this.parseJson(value, parentData)
    }
  }

  private handleScalar(key: string, value: any, parentData: SliceData): void {
    if (!parentData.sliceData) {
      parentData.sliceData = {}
    }

    parentData.sliceData[key] = value
  }

  protected dialogs(obj: any, parentData: SliceData) {
    if (Array.isArray(obj)) {
      obj.forEach((dialog: any) => {
        delete dialog.id
      })
      parentData[List.dialogs] = obj
    } else if (typeof obj === 'object') {
      delete obj.id
      parentData[List.dialogs] = obj
    }
  }

  protected items(obj: any, parentData: SliceData) {
    if (obj[0].references) {
      //console.log(obj[0].references, obj[0].id)
    }
    parentData[List.items] = obj
  }

  protected background(obj: any, parentData: SliceData) {
    parentData[List.background] = obj
  }
}
