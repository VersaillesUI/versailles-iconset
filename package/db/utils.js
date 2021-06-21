function replace (str) {
  return str.toLowerCase().replace(/_([a-z])/, match => match.replace('_', '').toUpperCase())
}

export const serializeRow = (dbrow) => {
  const result = {}
  try {
    for (const key in dbrow) {
      result[replace(key)] = dbrow[key]
    }
  } catch (err) {
    console.log(err)
  }
  return result
}