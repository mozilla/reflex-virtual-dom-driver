// @flow

import * as Counter from "./counter";
import {html, forward} from "reflex";

/*::
import type {Address, DOM} from "reflex"
import type {Action, Model} from "./counter-pair"
*/


const Top =
  (action) =>
  ( { type: "Top"
    , source: action
    }
  )

const Bottom =
  (action) =>
  ( { type: "Bottom"
    , source: action
    }
  )

const Reset =
  () =>
  ( { type: "Reset"
    }
  )

export const init =
  (top/*:number*/, bottom/*:number*/)/*:Model*/ =>
  ( { top: Counter.init(top)
    , bottom: Counter.init(bottom)
    }
  )

export const update =
  (model/*:Model*/, action/*:Action*/)/*:Model*/ =>
  ( action.type === "Top"
  ? { top: Counter.update(model.top, action.source)
    , bottom: model.bottom
    }
  : action.type === "Bottom"
  ? { top: model.top
    , bottom: Counter.update(model.bottom, action.source)
    }
  : action.type === "Reset"
  ? init(0, 0)
  : model
  )


export const view =
  ( model/*:Model*/
  , address/*:Address<Action>*/
  )/*:DOM*/ =>
  html.div
  ( { key: "counter-pair"
    }
  , [ html.div
      ( { key: "top"
        }
      , [ Counter.view
          ( model.top
          , forward(address, Top)
          )
        ]
      )
    , html.div
      ( { key: "bottom"
        }
      , [ Counter.view
          ( model.bottom
          , forward(address, Bottom)
          )
        ]
      )
    , html.div
      ( { key: "controls"
        }
      , [ html.button
          ( { key: "reset"
            , onClick: forward(address, Reset)
            }
          , ["Reset"]
          )
        ]
      )
    ]
  )
