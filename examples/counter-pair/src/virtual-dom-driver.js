/* @flow */

import {app} from "./main"
import {Renderer} from "reflex-virtual-dom-driver"

const renderer = new Renderer
  ( { target: document.body
    }
  )

app.view.subscribe
  ( renderer.address
  )
