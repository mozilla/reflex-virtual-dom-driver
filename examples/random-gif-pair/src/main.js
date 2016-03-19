/* @flow */

import * as RandomGifPair from "./random-gif-pair"
import {start, Effects} from "reflex"

const restore =
  _ =>
  [ window.app.model.value
  , Effects.none
  ]

export const app = start
  ( { flags:
      [ "funny cats"
      , "funny dogs"
      ]
    , init: ( window.app != null
            ? restore
            : RandomGifPair.init
            )
    , update: RandomGifPair.update
    , view: RandomGifPair.view
    }
  )
window.app = app
