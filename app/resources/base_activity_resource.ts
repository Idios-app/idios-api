enum Components {
  dialogs = 'dialogs',
  background = 'background',
  items = 'items',
}

const SLICE_DATA_PROPS = [Components.dialogs, Components.items]

type SliceData = {
  [key: string]: SliceData | any
}

export abstract class BaseActivityResource {
  protected schema: Array<object> = []

  constructor(data: any) {
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
    return Components.hasOwnProperty(key)
  }

  private isObject(value: any): boolean {
    return typeof value === 'object' && value !== null
  }

  private handleEnum(key: string, value: any, parentData: SliceData, obj: any): void {
    const enumValue = Components[key as keyof typeof Components]
    const methodName = Components[key as keyof typeof Components]

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
      parentData[Components.dialogs] = obj
    } else if (typeof obj === 'object') {
      delete obj.id
      parentData[Components.dialogs] = obj
    }
  }

  private items(obj: any, parentData: SliceData) {
    parentData[Components.items] = obj
  }

  private background(obj: any, parentData: SliceData) {
    parentData[Components.background] = obj
  }
}
