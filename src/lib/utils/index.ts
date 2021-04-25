import * as r from 'ramda'

export const getCol = r.curry((col: string | number, df: any[]): any[] => {
  if (r.is(Number)) {
    return r.uniq(r.map((v) => r.nth(col as number, v) || '', df)).filter((x) => x !== '')
  }

  return r.map(r.prop(col as string), df)
})
