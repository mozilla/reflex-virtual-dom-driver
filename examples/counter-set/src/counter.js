/* @flow */

import {html, forward} from "reflex"

/*::
import type {Model, Action} from "./counter"
import type {Address, DOM} from "reflex"
*/

const Increment =
  () =>
  ( { type: "Increment"
    }
  )

const Decrement =
  () =>
  ( { type: "Decrement"
    }
  )

export const init =
  (value/*:number*/)/*:Model*/ =>
  ({ value })

export const update =
  ( model/*:Model*/
  , action/*:Action*/
  )/*:Model*/ =>
  ( action.type === "Increment"
  ? { value: model.value + 1 }
  : action.type === "Decrement"
  ? { value: model.value - 1 }
  : model
  )

const counterStyle =
  { value:
    { fontWeight: "bold"
    }
  }


export const view =
  ( model/*:Model*/
  , address/*:Address<Action>*/
  )/*:DOM*/ =>
  html.span
  ( { key: "counter"
    }
  , [ html.button
      ( { key: "decrement"
        , onClick: forward(address, Decrement)
        }
      , ["-"]
      )
    , html.span
      ( { key: "value"
        , style: counterStyle.value
        }
      , [ `${model.value}` ]
      )
    , html.button
      ( { key: "increment"
        , onClick: forward(address, Increment)
        }
      , ["+"]
      )
    ]
  )
