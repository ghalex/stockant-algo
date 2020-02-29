import algo from '../lib'

const init = async () => {
  const prices = await algo.getPrices(['MSFT', 'AAPL'])
  console.log(prices)
}

document.body.onload = async () => {
  init()
}
