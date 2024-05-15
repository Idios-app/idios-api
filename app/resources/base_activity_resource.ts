enum List {
  dialogs = 'dialogs',
}

export abstract class BaseActivityResource {
  protected activity: any
  protected resource: {}

  constructor(activitySchema: JSON) {
    this.activity = activitySchema
    this.resource = this.toJson()
    this.mapping()
  }

  abstract toJson(): {}

  mapping() {
    const slices = {}

    this.jsonParser(this.activity.attributes)

    this.resource = {
      id: this.activity.id,
      title: this.activity.attributes.title,
      ...this.resource,
      ...slices,
    }
  }

  //TODO : remove logs
  jsonParser(obj: any, depth: number = 0) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const enumValue = List[key as keyof typeof List]
        if (enumValue) {
          console.log(`${'-'.repeat(depth)}Key: ${key} / found ${enumValue}`)
          const methodName = List[key as keyof typeof List]
          const method = this[methodName]
          if (typeof method === 'function') {
            method.call(this, obj[key])
          }
        } else {
          console.log(`${'-'.repeat(depth)}Key: ${key}`)
        }

        if (key === '__component') {
          console.log(`${'-'.repeat(depth)}Component: ${obj[key]}`)
        }

        const value = obj[key]

        // Check for array
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            for (const item of value) {
              this.jsonParser(item, depth + 1)
            }
          } else {
            this.jsonParser(value, depth + 1)
          }
        }
      }
    }
  }

  protected dialogs(obj: any) {
    console.log(obj)
    // let dialogs = {}
    // for (const key in obj) {
    //   if (obj.hasOwnProperty(key)) {
    //     const dialogData = obj[key as keyof typeof obj]
    //     dialogs = {
    //       ...dialogs,
    //       [key]: {
    //         animation: dialogData.animation,
    //         text: dialogData.text,
    //       },
    //     }
    //   }
    // }
  }
}
