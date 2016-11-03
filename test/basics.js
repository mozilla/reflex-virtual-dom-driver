/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {start, Effects, html} from "reflex"
import * as profiler from "../lib/profiler"
import {Renderer} from "../"
import test from "tape"

// TODO: Consider https://github.com/Raynos/min-document instead
import * as DOM from "jsdom"

test('render list', test => {
  const document = DOM.jsdom('<html><body>/body></html>')

  const flags = null
  const init = () =>
    [["Buy Milk", "Write Tests", "Asses Results"], Effects.none]

  const update = (model, action) =>
    [model, Effects.none]

  const view = model =>
    html.ul({
      id: "main",
    }, model.map(title => html.li({ key: title }, [title])))

  const app = start({flags, init, update, view })
  const renderer = new Renderer({ target: document.body })
  app.view.subscribe(renderer.address)
  app.task.subscribe(Effects.driver(app.address))

  renderer.onRendered = () => {
    test.equal(document.body.innerHTML,
                `<ul id="main"><li>Buy Milk</li><li>Write Tests</li><li>Asses Results</li></ul>`,
                'content was rendered into body')
    test.end()
  }
})


test('re-render list', test => {
  const document = DOM.jsdom('<html><body>/body></html>')

  const flags = null
  const init = () =>
    [["Buy Milk", "Write Tests", "Asses Results"], Effects.none]

  const update = (model, message) => {
    switch (message.type) {
      case "reverse":
        return [model.slice(0).reverse(), Effects.none]
      case "sort":
      default:
        return [model.slice(0).sort(), Effects.none]
    }
  }

  const view = model =>
    html.ul({
      id: "main",
    }, model.map(title => html.li({ key: title }, [title])))

  const app = start({flags, init, update, view })
  const renderer = new Renderer({ target: document.body })
  app.view.subscribe(renderer.address)
  app.task.subscribe(Effects.driver(app.address))

  const steps = [
    () => {
      test.equal(document.body.innerHTML,
                  `<ul id="main"><li>Buy Milk</li><li>Write Tests</li><li>Asses Results</li></ul>`,
                  'items were rendered')

      app.address({ type: "sort" })
    },
    () => {
      test.equal(document.body.innerHTML,
                  `<ul id="main"><li>Asses Results</li><li>Buy Milk</li><li>Write Tests</li></ul>`,
                  'items were sorted')
      app.address({ type: "reverse" })
    },
    () => {
      test.equal(document.body.innerHTML,
                  `<ul id="main"><li>Write Tests</li><li>Buy Milk</li><li>Asses Results</li></ul>`,
                  'items were reversed')
    }
  ]

  renderer.onRendered = () => {
    steps.shift()()
    if (steps.length === 0) {
      test.end()
    }
  }
})


test('rendering is batched', test => {
  const document = DOM.jsdom('<html><body>/body></html>')

  const flags = null
  const init = () =>
    [["Buy Milk", "Write Tests", "Asses Results"], Effects.none]

  const update = (model, message) => {
    switch (message.type) {
      case "reverse":
        return [model.slice(0).reverse(), Effects.none]
      case "sort":
      default:
        return [model.slice(0).sort(), Effects.none]
    }
  }

  const view = model =>
    html.ul({
      id: "main",
    }, model.map(title => html.li({ key: title }, [title])))

  const app = start({flags, init, update, view })
  const renderer = new Renderer({ target: document.body })
  app.view.subscribe(renderer.address)
  app.task.subscribe(Effects.driver(app.address))

  const steps = [
    () => {
      test.equal(document.body.innerHTML,
                  `<ul id="main"><li>Buy Milk</li><li>Write Tests</li><li>Asses Results</li></ul>`,
                  'items were rendered')

      app.address({ type: "sort" })
      app.address({ type: "reverse" })
    },
    () => {
      test.equal(document.body.innerHTML,
                  `<ul id="main"><li>Write Tests</li><li>Buy Milk</li><li>Asses Results</li></ul>`,
                  'items were sorted & reversed')
    }
  ]

  renderer.onRendered = () => {
    steps.shift()()
    if (steps.length === 0) {
      test.end()
    }
  }
})
