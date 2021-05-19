import * as r from 'ramda'
import { Order, Bar, RunContext, Trade, OrderInput } from '@/types'
import Activity from './Activity'

class Strategy {
  private $activity: Activity

  constructor(activity: Activity) {
    this.$activity = activity
  }

  public get positionSize(): number {
    return this.$activity.positionSize
  }

  public order(data: OrderInput) {
    this.$activity.addOrder({ long: true, ...data }, 'open')
  }

  public close(data: OrderInput) {
    this.$activity.addOrder({ ...data }, 'close')
  }

  public closeAll() {
    console.log('not implemented')
  }
}

export default Strategy
