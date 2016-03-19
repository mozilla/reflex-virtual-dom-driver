/* @flow */

import {html, forward, Effects, Task} from "reflex"
import * as Easing from "eased"

/*::
import type {Float, Time} from "eased"
import type {Address, DOM} from "reflex"
import type {Model, Action} from "./spin-square"

*/

export const init =
  ()/*:[Model, Effects<Action>]*/ =>
  nofx
  ( { angle: 0
    , animation: null
    }
  )

const nofx =
  model =>
  [ model
  , Effects.none
  ]


export const update =
  (model/*:Model*/, action/*:Action*/)/*:[Model, Effects<Action>]*/ =>
  ( action.type === "Spin"
  ? spin(model)
  : action.type === "Tick"
  ? animate(model, action.source)
  : nofx(model)
  )


const spin =
  model =>
  ( model.animation == null
  ? [ model
    , Effects.tick(Tick)
    ]
  : nofx(model)
  )

const animate =
  (model, time) => {
    const {animation, angle} = model
    const elapsedTime =
      ( animation == null
      ? 0
      : animation.elapsedTime + (time - animation.lastTime)
      )

    const next =
      ( elapsedTime > duration
      ? nofx
        ( { angle: angle + rotateStep
          , animation: null
          }
        )
      : [ { angle
          , animation:
            { elapsedTime
            , lastTime: time
            }
          }
        , Effects.tick(Tick)
        ]
      )

    return next
  }


const Spin =
  () =>
  ( { type: "Spin"
    }
  )


const Tick =
  time =>
  ( { type: "Tick"
    , source: time
    }
  )


// View

export const view =
  (model/*:Model*/, address/*:Address<Action>*/)/*:DOM*/ =>
  html.figure
  ( { key: "spin-square"
    , style: style.spinSquare(model)
    , onClick: forward(address, Spin)
    }
  , ["Click me!"]
  )

const style = {
  spinSquare: ({angle, animation}) =>
    ( { width: "200px"
      , height: "200px"
      , display: "flex"
      , alignItems: "center"
      , justifyContent: "center"
      , backgroundColor: "#60B5CC"
      , color: "#fff"
      , cursor: "pointer"
      , borderRadius: "30px"
      , transform: `translate(100px, 100px) rotate(${angle + toOffset(animation)}deg)`
      }
    )
}



const toOffset =
  animation =>
  ( animation == null
  ? 0
  : Easing.ease
    ( Easing.easeOutBounce
    , Easing.float
    , 0
    , rotateStep
    , duration
    , animation.elapsedTime
    )
  )

const rotateStep = 90
const ms = 1
const second = 1000 * ms
const duration = second
