/* @flow */

import {html, forward, Task, Effects} from "reflex"
import * as RandomGif from "./random-gif"


/*::
import type {DOM, Address} from "reflex"
import type {Model, Action} from "./random-gif-pair"
*/

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

export const init =
  ([leftTopic, rightTopic]/*:[string, string]*/)/*:[Model, Effects<Action>]*/ => {
    const [left, leftFx] = RandomGif.init(leftTopic)
    const [right, rightFx] = RandomGif.init(rightTopic)
    const model = { left, right }
    const fx = Effects.batch
      ( [ leftFx.map(Left)
        , rightFx.map(Right)
        ]
      )

    return [model, fx]
  }

const nofx =
  model =>
  [ model
  , Effects.none
  ]

const updateLeft =
  (model, action) => {
    const [left, fx] = RandomGif.update(model.left, action)
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
    const [right, fx] = RandomGif.update(model.right, action)
    const next =
      [ { left: model.left
        , right
        }
      , fx.map(Right)
      ]
    return next
  }

export const update =
  (model/*:Model*/, action/*:Action*/)/*:[Model, Effects<Action>]*/ =>
  ( action.type === "Left"
  ? updateLeft(model, action.source)
  : action.type === "Right"
  ? updateRight(model, action.source)
  : nofx(model)
  )

export const view =
  (model/*:Model*/, address/*:Address<Action>*/)/*:DOM*/ =>
  html.div
  ( { key: "random-gif-pair"
    , style: {display: "flex"}
    }
  , [ html.div
      ( { key: "left"
        }
      , [ RandomGif.view
          ( model.left
          , forward(address, Left)
          )
        ]
      )
    , html.div
      ( { key: "right"
        }
      , [ RandomGif.view
          ( model.right
          , forward(address, Right)
          )
        ]
      )
    ]
  )
