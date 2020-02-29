class Algo {
  prices = []
  version = '1.0.0'

  public hello(name: string): void {
    console.log(name)
  }

  public async getPrices(ticks: string[], date: string = '2020-01-01') {
    const result: { [key: string]: Array<any> } = {}
    const url = 'https://financialmodelingprep.com/api/v3/historical-price-full/'

    for (let tick of ticks) {
      const data = await (await fetch(url + tick + '?from=' + date)).json()
      result[tick] = data.historical
    }

    return result
  }
}

export default Algo
