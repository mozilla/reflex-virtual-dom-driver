/* @flow */

import * as RandomGif from "./random-gif"
import * as array from "./array"
import {html, forward, thunk, Effects} from "reflex"


/*::
import type {ID, Action, Model} from "./random-gif-list"
import type {Address, DOM} from "reflex"
*/

const Create =
  () =>
  ( { type: "Create"
    }
  )

const Topic =
  (subject:string) =>
  ( { type: "Topic"
    , source: subject
    }
  )

const Modify =
  (name/*:ID*/) =>
  (action/*:RandomGif.Action*/)/*:Action*/ =>
  ( { type: "Modify"
    , source:
      { name
      , action
      }
    }
  )

const nofx =
  model =>
  [ model
  , Effects.none
  ]

export const init =
  ()/*:[Model, Effects<Action>]*/ =>
  nofx
  ( { topic: ""
    , nextID: 0
    , viewers: []
    }
  )



export const update =
  (model/*:Model*/, action/*:Action*/)/*:[Model, Effects<Action>]*/ =>
  ( action.type === "Create"
  ? createViewer(model)
  : action.type === "Topic"
  ? updateTopic(model, action.source)
  : action.type === "Modify"
  ? updateNamed(model, action.source)
  : nofx(model)
  )

const updateTopic =
  (model, topic) =>
  nofx
  ( { topic
    , nextID: model.nextID
    , viewers: model.viewers
    }
  )

const createViewer =
  (model) => {
    const [viewer, fx] = RandomGif.init(model.topic)
    const next =
      { topic: ""
      , nextID: model.nextID + 1
      , viewers:
        [ ...model.viewers
        , { name: model.nextID
          , viewer
          }
        ]
      }

    const result =
      [ next
      , fx.map(Modify(model.nextID))
      ]

    return result
  }

const updateNamed =
  (model, {name, action}) => {
    const named = array.find
      ( model.viewers
      , viewer => viewer.name === name
      )

    if (named != null) {
      const [viewer, fx] = RandomGif.update
        ( named.viewer
        , action
        )

      const viewers = array.set
        ( model.viewers.indexOf(named)
        , { name: named.name
          , viewer
          }
        , model.viewers
        )

      const next =
        [ { topic: model.topic
          , nextID: model.nextID
          , viewers
          }
        , fx.map(Modify(named.name))
        ]

      return next
    }

    return nofx(model)
  }

export const view =
  (model/*:Model*/, address/*:Address<Action>*/)/*:DOM*/ =>
  html.main
  ( { key: "random-gif-list"
    }
  , [ html.form
      ( { onSubmit: forward(address, decodeSubmit)
        }
      , [ html.input
          ( { style: style.input
            , placeholder: "What kind of gifs do you want?"
            , value: model.topic
            , onChange: forward(address, decodeTopicChange)
            //, onChange: forward(address, event => Topic(event.target.value))
            // , onKeyUp: event => {
            //   if (event.keyCode === 13) {
            //     address(asCreate())
            //   }
            }
          )
        ]
      )
    , html.div
      ( { key: "random-gifs-list-box"
        , style: style.container
        }
      , model.viewers.map(named => viewNamed(named, address))
      )
    ]
  )

const decodeSubmit =
  event =>
  Create(event.preventDefault())

const decodeTopicChange =
  event =>
  Topic(event.target.value)


const style = {
  input: {
    width: "100%",
    height: "40px",
    margin: "10px 0",
    fontSize: "2em",
    textAlign: "center"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  }
}

const viewNamed =
  (model, address) =>
  thunk
  ( String(model.name)
  , RandomGif.view
  , model.viewer
  , forward(address, Modify(model.name))
  )
