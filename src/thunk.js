/* @flow */

import type { DOM, Address, Thunk } from "reflex"

const redirect = (addressBook, index) => action => addressBook[index](action)

export class ThunkNode implements Thunk {
  $type: "Thunk" = "Thunk"
  type: "Thunk" = "Thunk"
  key: string
  view: (...args: Array<*>) => DOM
  args: Array<*>

  addressBook: ?Array<Address<mixed>>
  value: ?DOM

  constructor(
    key: string,
    view: (...args: Array<*>) => DOM,
    ...args: Array<*>
  ) {
    this.key = key
    this.view = view
    this.args = args
    this.addressBook = null
    this.value = null
  }
  render(previous: ?DOM): DOM {
    this.onCompare(this)

    if (
      previous instanceof ThunkNode &&
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

export const thunk = <a, b, c, d, e, f, g, h, i, j>(
  key: string,
  view: (
    a0: a,
    a1: b,
    a2: c,
    a3: d,
    a4: e,
    a5: f,
    a6: g,
    a7: h,
    a8: i,
    a9: j
  ) => DOM,
  a0: a,
  a1: b,
  a2: c,
  a3: d,
  a4: e,
  a5: f,
  a6: g,
  a7: h,
  a8: i,
  a9: j
): ThunkNode => new ThunkNode(key, view, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9)
