/* @flow */

import * as RandomGifList from "./random-gif-list"
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
            : RandomGifList.init
            )
    , update: RandomGifList.update
    , view: RandomGifList.view
    }
  )
window.app = app
