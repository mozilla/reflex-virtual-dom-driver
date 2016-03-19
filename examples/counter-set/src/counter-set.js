/* @flow */

import * as CounterList from "./counter-list";
import * as Counter from "./counter";
import {html, forward, thunk} from "reflex";

/*::
import type {ID, Model, Action} from "./counter-set"
import type {DOM, Address} from "reflex"
*/

const Add =
  () =>
  ( { type: "Add"
    }
  )

const Remove =
  (name) =>
  () =>
  ( { type: "Remove"
    , source: name
    }
  )

const Modify =
  (name) =>
  (action) =>
  ( { type: "Modify"
    , source: {name, action}
    }
  )

const remove =
  (model/*:Model*/, name/*:ID*/)/*:Model*/ =>
  ( { nextID: model.nextID
    , counters:
      model.counters.filter
      ( named => named.name !== name )
    }
  )

const modify =
  (model, {name, action}) =>
  ( { nextID: model.nextID
    , counters:
      model.counters.map
      ( named =>
        ( named.name === name
        ? { name
          , counter: Counter.update(named.counter, action)
          }
        : named
        )
      )
    }
  )

export const init = CounterList.init

export const update =
  ( model/*:Model*/, action/*:Action*/)/*:Model*/ =>
  ( action.type === "Add"
  ? CounterList.update(model, action)
  : action.type === "Remove"
  ? remove(model, action.source)
  : action.type === "Modify"
  ? modify(model, action.source)
  : model
  )

const viewNamed =
  (model, address) =>
  thunk
  ( String(model.name)
  , renderNamed
  , model
  , address
  )

const renderNamed =
  (model, address) =>
  html.div
  ( { key: model.name
    }
  , [ Counter.view
      ( model.counter
      , forward(address, Modify(model.name))
      )
    , html.button
      ( { key: "remove"
        , onClick: forward(address, Remove(model.name))
        }
      , ["x"]
      )
    ]
  )

export const view =
  ( model/*:Model*/
  , address/*:Address<Action>*/
  )/*:DOM*/ =>
  html.div
  ( { key: "CounterList"
    }
  , [ html.div
      ( { key: "controls"
        }
      , [ html.button
          ( { key: "add"
            , onClick: forward(address, Add)
            }
          , ["Add"]
          )
        ]
      )
    , html.div
      ( { key: "counters"
        }
      , model.counters.map
        ( named =>
          viewNamed(named, address)
        )
      )
    ]
  )
