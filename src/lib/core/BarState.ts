import { Bar } from '@/types'

class BarState {
  private $nbOfBars
  private $index = -1
  private $data = {
    date: 0,
    open: 0,
    close: 0,
    high: 0,
    low: 0
  }

  constructor(nbOfBars: number) {
    this.$nbOfBars = nbOfBars
  }

  get index() {
    return this.$index
  }

  get isFirst() {
    return this.$index === 0
  }

  get isLast() {
    return this.$index === this.$nbOfBars - 1
  }

  get data() {
    return { ...this.$data }
  }

  public next(data: Bar[]): number {
    if (this.$index < data.length - 1) {
      this.$index += 1
      this.$data = { ...data[this.$index] }
    }
    return this.$index
  }

  public toString() {
    return `index: ${this.$index}, data: ${JSON.stringify(this.$data)}`
  }
}

export default BarState
