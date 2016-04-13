/* @flow */

import {html, forward, thunk, Effects} from "reflex"
import * as SpinSquare from "./spin-square"

/*::
import type {Float, Time} from "eased"
import type {Address, DOM} from "reflex"
import type {Model, Action} from "./spin-square-pair"
*/

export const init =
  ()/*:[Model, Effects<Action>]*/ => {
    const [left, leftFX] = SpinSquare.init()
    const [right, rightFX] = SpinSquare.init()
    const model = {left, right}
    const fx = Effects.batch
      ( [ leftFX.map(Left)
        , rightFX.map(Right)
        ]
      )

    return [model, fx]
  }

const Left =
  action =>
  ( { type: "Left"
    , source: action
    }
  )

const Right =
  action =>
  ( { type: "Right"
    , source: action
    }
  )


export const update =
  (model/*:Model*/, action/*:Action*/)/*:[Model, Effects<Action>]*/ =>
  ( action.type === "Left"
  ? updateLeft(model, action.source)
  : action.type === "Right"
  ? updateRight(model, action.source)
  : nofx(model)
  )

const updateLeft =
  (model, action) => {
    const [left, fx] = SpinSquare.update
      ( model.left
      , action
      )

    const next =
      [ { left
        , right: model.right
        }
      , fx.map(Left)
      ]

    return next
  }

const updateRight =
  (model, action) => {
    const [right, fx] = SpinSquare.update
      ( model.right
      , action
      )

    const next =
      [ { left: model.left
        , right
        }
      , fx.map(Right)
      ]

    return next
  }

const nofx =
  model =>
  [ model
  , Effects.none
  ]


export const view =
  (model/*:Model*/, address/*:Address<Action>*/)/*:DOM*/ =>
  html.main
  ( { key: "spin-square-pair"
    , style: { display: "flex" }
    }
  , [ thunk
      ( "left"
      , SpinSquare.view
      , model.left
      , forward(address, Left)
      )
    , thunk
      ( "right"
      , SpinSquare.view
      , model.right
      , forward(address, Right)
      )
    ]
  )
