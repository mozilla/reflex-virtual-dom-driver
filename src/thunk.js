/* @flow */

import { VirtualThunk, VirtualText, VirtualNode, Widget } from "./virtual-dom"
import type { VNode } from "./virtual-dom"
import { Driver, Node } from "reflex-driver"

type Address<a> = (input: a) => void

const redirect = (addressBook, index) => action => addressBook[index](action)

export class Thunk implements VirtualThunk {
  type: "Thunk" = "Thunk"
  key: string
  view: (...args: Array<*>) => *
  args: Array<*>

  addressBook: ?Array<Address<mixed>>
  value: ?VNode
  vnode: ?VNode

  constructor(key: string, view: (...args: Array<*>) => *, args: Array<*>) {
    this.key = key
    this.view = view
    this.args = args
    this.addressBook = null
    this.value = null
  }
  renderWith<node: Node>(driver: Driver<node>): node {
    return driver.createThunk(this.key, this.view, (this.args: any))
  }
  render(previous: ?VNode): VNode {
    this.onCompare(this)

    if (
      previous instanceof Thunk &&
      previous.value != null &&
      previous.addressBook != null
    ) {
      const { view, args: passed, key } = this
      const { args, value, addressBook } = previous
      this.addressBook = addressBook
      this.args = args
      this.value = value

      const count = passed.length
      let index = 0
      let isUpdated = view !== previous.view || key !== previous.key

      if (args.length !== count) {
        isUpdated = true
        args.length = count
        addressBook.length = count
      }

      while (index < count) {
        const next = passed[index]
        const arg = args[index]

        if (next !== arg) {
          const isNextAddress = typeof next === "function"
          const isCurrentAddress = typeof arg === "function"

          if (isNextAddress && isCurrentAddress) {
            // Update adrress book with a new address.
            addressBook[index] = next
          } else {
            isUpdated = true

            if (isNextAddress) {
              addressBook[index] = next
              args[index] = redirect(addressBook, index)
            } else {
              args[index] = next
            }
          }
        }

        index = index + 1
      }

      this.onCompared(this)

      if (isUpdated) {
        this.onCompute(this)

        this.value = view(...args)
        const value = this.value

        this.onComputed(this)

        return value
      } else {
        return value
      }
    } else {
      this.onCompared(this)

      const addressBook = []
      const { args, view, key } = this
      const count = args.length

      let index = 0
      while (index < count) {
        const arg = args[index]
        if (typeof arg === "function") {
          addressBook[index] = arg
          args[index] = redirect(addressBook, index)
        } else {
          args[index] = arg
        }
        index = index + 1
      }

      this.addressBook = addressBook

      this.onCompute(this)
      this.value = view(...args)
      const value = this.value
      this.onComputed(this)
      return value
    }
  }
  // Profiler
  onCompare: (thunk: Thunk) => void
  onCompared: (thunk: Thunk) => void
  onCompute: (thunk: Thunk) => void
  onComputed: (thunk: Thunk) => void

  onCompare(thunk: Thunk): void {}
  onCompared(thunk: Thunk): void {}
  onCompute(thunk: Thunk): void {}
  onComputed(thunk: Thunk): void {}
}

let profile = null
