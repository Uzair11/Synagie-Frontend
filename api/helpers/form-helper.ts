let inputNo = 0

export const generateInputID = (prefix) => {
  let r = (((1 + Math.random()) * 0x10000) | 0).toString(6).substring(1)

  return (prefix || 'input-') + inputNo++ + '-' + r
}

// ensureFields(hashmap, field, field2, field3...)
export const ensureFields = (values, ...args) => {
  // console.log("ensure", args)
  for (let i = 0; i < args.length; i++) {
    if (values[args[i]] === undefined) {
      values[args[i]] = null
    }
  }
  return values
}
