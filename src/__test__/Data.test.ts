import Data from '../lib/classes/Data'
import axios from 'axios'
import { keys } from 'lodash'

let mockAxios: any

beforeEach(() => {
  const data = {
    historical: [
      { date: '2020-01-02', open: 158.78, high: 160.73, low: 158.33, close: 160.62 },
      { date: '2020-02-03', open: 158.32, high: 159.95, low: 158.06, close: 158.62 },
      { date: '2020-03-01', open: 157.08, high: 159.1, low: 156.51, close: 159.03 }
    ]
  }

  mockAxios = jest.spyOn(axios, 'get')
  mockAxios.mockReturnValueOnce({ data })
})

afterEach(() => {
  mockAxios.mockRestore()
})

test('it loads prices', async () => {
  const prices = new Data()
  const data = await prices.fetch(['AAPL', 'MSFT'])

  expect(keys(data).length).toEqual(2)
  expect(keys(data)).toEqual(['AAPL', 'MSFT'])
})
