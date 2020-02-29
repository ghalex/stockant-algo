import Algo from './Algo'

test('Algo', () => {
  const algo = new Algo()
  expect(algo.version).toBe('1.0.0')
})

test('getPrices', async () => {
  const algo = new Algo()
  const prices = await algo.getPrices(['AAPL'])

  expect(prices.length).toBe(10)
})
