/* @flow */

import {app} from "./main"
import {Renderer} from "reflex-virtual-dom-driver"
import {Effects} from "reflex"

const renderer = new Renderer
  ( { target: document.body
    }
  )

app.view.subscribe
  ( renderer.address
  )

app.task.subscribe
  ( Effects.driver(app.address)
  )
