/* @flow */

export const find =
  ( Array.prototype.find != null
  ? /*::<a>*/ (array/*:Array<a>*/, p/*:(a:a) => boolean*/)/*:?a*/ =>
      array.find(p)
  : /*::<a>*/ (array/*:Array<a>*/, p/*:(a:a) => boolean*/)/*:?a*/ => {
      let index = 0
      while (index < array.length) {
        if (p(array[index])) {
          return array[index]
        }
        index = index + 1
      }
    }
  )

export const set = /*::<a>*/
  ( index/*:number*/
  , element/*:a*/
  , array/*:Array<a>*/
  )/*:Array<a>*/ => {
    if (array[index] === element) {
      return array
    }
    else {
      const next = array.slice(0)
      next[index] = element
      return next
    }
  }
