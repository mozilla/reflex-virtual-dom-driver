/* @flow */

import * as SpinSquarePair from "./spin-square-pair"
import {start, Effects} from "reflex"

const restore =
  _ =>
  [ window.app.model.value
  , Effects.none
  ]

export const app = start
  ( { flags: void(0)
    , init: ( window.app != null
            ? restore
            : SpinSquarePair.init
            )
    , update: SpinSquarePair.update
    , view: SpinSquarePair.view
    }
  )
window.app = app
