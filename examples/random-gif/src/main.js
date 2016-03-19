/* @flow */

import * as RandomGif from "./random-gif"
import {start, Effects} from "reflex"

const restore =
  _ =>
  [ window.app.model.value
  , Effects.none
  ]

export const app = start
  ( { flags: "funny cats"
    , init: ( window.app != null
            ? restore
            : RandomGif.init
            )
    , update: RandomGif.update
    , view: RandomGif.view
    }
  )
window.app = app
