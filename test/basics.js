/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { start, Task, Effects, Application, html } from "reflex"
import * as profiler from "../profiler"
import { Renderer } from "../"
import test from "blue-tape"

// TODO: Consider https://github.com/Raynos/min-document instead
import { JSDOM } from "jsdom"

test("render list", async test => {
  const { window } = new JSDOM("<html><body>/body></html>")

  const flags = null
  const init = () => [
    ["Buy Milk", "Write Tests", "Asses Results"],
    Effects.none
  ]

  const update = (model, action) => [model, Effects.none]

  const view = model =>
    html.ul(
      {
        id: "main"
      },
      model.map(title => html.li({ key: title }, [title]))
    )

  const renderer = new Renderer({ target: window.document.body })
  const app = start({ flags, init, update, view }, ({ view, task }) => {
    renderer.render(view)
    Task.perform(task)
  })

  await onRender(renderer)

  test.equal(
    window.document.body.innerHTML,
    `<ul id="main"><li>Buy Milk</li><li>Write Tests</li><li>Asses Results</li></ul>`,
    "content was rendered into body"
  )
})

test("re-render list", async test => {
  const { window } = new JSDOM("<html><body>/body></html>")

  const flags = null
  const init = () => [
    ["Buy Milk", "Write Tests", "Asses Results"],
    Effects.none
  ]

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
    html.ul(
      {
        id: "main"
      },
      model.map(title => html.li({ key: title }, [title]))
    )

  const renderer = new Renderer({ target: window.document.body })
  const app = start({ flags, init, update, view }, ({ view, task }) => {
    renderer.render(view)
    Task.perform(task)
  })

  await onRender(renderer)
  test.equal(
    `<ul id="main"><li>Buy Milk</li><li>Write Tests</li><li>Asses Results</li></ul>`,
    window.document.body.innerHTML,
    "items were rendered"
  )

  app.send({ type: "sort" })

  await onRender(renderer)
  test.equal(
    `<ul id="main"><li>Asses Results</li><li>Buy Milk</li><li>Write Tests</li></ul>`,
    window.document.body.innerHTML,
    "items were sorted"
  )
  app.send({ type: "reverse" })

  await onRender(renderer)
  test.equal(
    `<ul id="main"><li>Write Tests</li><li>Buy Milk</li><li>Asses Results</li></ul>`,
    window.document.body.innerHTML,
    "items were reversed"
  )
})

test("rendering is batched", async test => {
  const { window } = new JSDOM("<html><body>/body></html>")

  const flags = null
  const init = () => [
    ["Buy Milk", "Write Tests", "Asses Results"],
    Effects.none
  ]

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
    html.ul(
      {
        id: "main"
      },
      model.map(title => html.li({ key: title }, [title]))
    )

  const renderer = new Renderer({ target: window.document.body })
  const app = start({ flags, init, update, view }, ({ view, task }) => {
    renderer.render(view)
    Task.perform(task)
  })

  await onRender(renderer)
  test.equal(
    window.document.body.innerHTML,
    `<ul id="main"><li>Buy Milk</li><li>Write Tests</li><li>Asses Results</li></ul>`,
    "items were rendered"
  )

  const nextRender = onRender(renderer)

  app.send({ type: "sort" })
  app.send({ type: "reverse" })

  await nextRender

  test.equal(
    window.document.body.innerHTML,
    `<ul id="main"><li>Write Tests</li><li>Buy Milk</li><li>Asses Results</li></ul>`,
    "items were sorted & reversed"
  )
})

const onRender = renderer =>
  new Promise(resolve => (renderer.onRender = resolve))
