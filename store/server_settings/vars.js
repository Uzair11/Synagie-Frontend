import state from './state'

const readFieldNames = state().readFields.map((fieldSchema) => {
  let name = fieldSchema.substr(0, fieldSchema.indexOf(':')).toLowerCase()
  //   if (name == "managed_by") {
  //     return `${name} {
  //   uid
  //   first_name
  //   last_name
  // }`
  //   }

  return name
})

export { readFieldNames }
