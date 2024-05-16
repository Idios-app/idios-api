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
    this.jsonParser(data.attributes[type])
  }

  abstract additionalProperties(): {}

  private jsonParser(obj: any, depth: number = 0, parentData: SliceData = {}) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const enumValue = List[key as keyof typeof List]

        if (enumValue) {
          const methodName = List[key as keyof typeof List]
          const method = this[methodName]
          if (typeof method === 'function') {
            method.call(this, obj[key], parentData)
            if (SLICE_DATA_PROPS.includes(enumValue) && !parentData.sliceData) {
              parentData.sliceData = {}
            }
            if (parentData[key]) {
              if (SLICE_DATA_PROPS.includes(enumValue) && parentData.sliceData) {
                parentData.sliceData[key] = parentData[key]
                delete parentData[key]
              }
            }
          }
        } else if (key === '__component') {
          const componentName = obj[key].match(/\w+$/)[0]
          delete obj[key]
          const componentData = this.jsonParser(obj, depth, { slice: componentName })
          if (Object.keys(componentData).length > 0) {
            this.schema = [...this.schema, componentData]
          }
        } else {
          const value = obj[key]

          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              for (const item of value) {
                this.jsonParser(item, depth + 1, parentData)
              }
            } else {
              this.jsonParser(value, depth + 1, parentData)
            }
          } else {
            if (!parentData.sliceData) {
              parentData.sliceData = {}
            }
            parentData.sliceData[key] = value
          }
        }
      }
    }
    return parentData
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
    if (Array.isArray(obj)) {
      obj.forEach((item: any) => {
        delete item.id
      })
      parentData[List.items] = obj
    } else if (typeof obj === 'object') {
      delete obj.id
      parentData[List.items] = obj
    }
  }

  protected background(obj: any, parentData: SliceData) {
    parentData[List.background] = obj
  }
}
