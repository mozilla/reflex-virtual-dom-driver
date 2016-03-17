/* @flow */

import * as Counter from "./counter";
import {html, forward, thunk} from "reflex";
import {always} from "./util";

/*::
import type {ID, Tagged, ByName, Model, Action} from "./counter-list"
import type {Address, VirtualTree} from "reflex";
*/

const Add =
  { type: "Add"
  , source: void(0)
  , create: () => Add
  }

const Remove =
  { type: "Remove"
  , source: void(0)
  , create: () => Remove
  }

export const Modify =
  (name/*:ID*/, action/*:Counter.Action*/)/*:Tagged<"Modify", ByName<Counter.Action>>*/ =>
  ( { type: "Modify"
    , source: {name, action}
    }
  )

const by =
  (name/*:ID*/)/*:(action:Counter.Action) => Tagged<"Modify", ByName<Counter.Action>>*/ =>
  (action/*:Counter.Action*/) =>
  Modify(name, action)

export const init =
  ()/*:Model*/ =>
  ( { nextID: 1
    , counters: []
    }
  )

const add =
  model =>
  ( { nextID: model.nextID + 1
    , counters:
      [ ...model.counters
      , { name: model.nextID
        , counter: Counter.init(0)
        }
      ]
    }
  )

const remove =
  model =>
  ( { nextID: model.nextID
    , counters: model.counters.slice(1)
    }
  )

const modify =
  (model, {name, action}) =>
  ( { nextID: model.nextID
    , counters:
      model.counters.map
      ( ( named ) =>
        ( named.name === name
        ? { name
          , counter: Counter.update(named.counter, action)
          }
        : named
        )
      )
    }
  )

export const update =
  (model/*:Model*/, action/*:Action*/)/*:Model*/ =>
  ( action.type === "Add"
  ? add(model)
  : action.type === "Remove"
  ? remove(model)
  : action.type === "Modify"
  ? modify(model, action.source)
  : model
  );


// View
const viewNamed =
  (model, address) =>
  thunk
  ( String(model.name)
  , Counter.view
  , model.counter
  , forward(address, by(model.name))
  )

export const view =
  (model/*:Model*/, address/*:Address<Action>*/)/*:VirtualTree*/ =>
  html.div
  ( { key: "CounterList"
    }
  , [ html.div
      ( { key: "controls"
        }
      , [ html.button
          ( { key: "remove"
            , onClick: forward(address, Remove.create)
            }
          , ["Remove"]
          )
        , html.button
          ( { key: "add"
            , onClick: forward(address, Add.create)
            }
          , ["Add"]
          )
        ]
      )
    , html.div
      ( { key: "counters"
        }
      , model.counters.map
        ( named => viewNamed(named, address)
        )
      )
    ]
  )
