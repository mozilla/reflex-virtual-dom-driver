/* @flow */

import diff from "virtual-dom/diff"
import createElement from "virtual-dom/create-element"
import patch from "virtual-dom/patch"
import {VirtualText, text} from "./text"
import {VirtualNode, node} from "./node"
import {Thunk, thunk} from "./thunk"

/*::
import * as Driver from "reflex/type/driver"
import * as Signal from "reflex/type/signal"
import * as DOM from "reflex/type/dom"
*/

export class Renderer {
  /*::
  target: Element;
  mount: ?(Element & {reflexTree?: DOM.VirtualTree});
  value: Driver.VirtualRoot;
  isScheduled: boolean;
  version: number;
  address: Signal.Address<Driver.VirtualRoot>;
  execute: () => void;
  timeGroupName: ?string;

  render: Driver.render;
  node: Driver.node;
  thunk: Driver.thunk;
  // Note this must be optional in order to satisfy flow (see facebook/flow#952)
  text: ?Driver.text;
  */
  constructor({target, timeGroupName}/*:{target: Element, timeGroupName?:string}*/) {
    this.target = target
    this.mount = (target.children.length === 1 &&
                  target.children[0].reflexTree != null) ?
      target.children[0] :
      null

    this.address = this.receive.bind(this)
    this.execute = this.execute.bind(this)
    this.timeGroupName = timeGroupName == null ? null : timeGroupName

    this.node = node
    this.thunk = thunk
    this.text = text
  }
  toString()/*:string*/{
    return `Renderer({target: ${this.target}})`
  }
  receive(value/*:Driver.VirtualRoot*/) {
    this.value = value
    this.schedule()
  }
  schedule() {
    if (!this.isScheduled) {
      this.isScheduled = true
      this.version = requestAnimationFrame(this.execute)
    }
  }
  execute(_/*:number*/) {
    const {timeGroupName} = this
    if (timeGroupName != null) {
      console.time(`render ${timeGroupName}`)
    }

    const start = performance.now()

    // It is important to mark `isScheduled` as `false` before doing actual
    // rendering since state changes in effect of reflecting current state
    // won't be handled by this render cycle. For example rendering a state
    // with updated focus will cause `blur` & `focus` events to be dispatched
    // that happen synchronously, and there for another render cycle may be
    // scheduled for which `isScheduled` must be `false`. Attempt to render
    // this state may also cause a runtime exception but even then we would
    // rather attempt to render updated states that end up being blocked
    // forever.
    this.isScheduled = false

    this.value.renderWith(this)

    const end = performance.now()
    const time = end - start

    if (time > 16) {
      console.warn(`Render took ${time}ms & will cause frame drop`)
    }

    if (timeGroupName != null) {
      console.time(`render ${timeGroupName}`)
    }
  }
  render(tree/*:DOM.VirtualTree*/) {
    const {mount, target} = this
    if (mount) {
      patch(mount, diff(mount.reflexTree, tree))
      mount.reflexTree = tree
    } else {
      const mount = createElement(tree)
      mount.reflexTree = tree
      target.innerHTML = ""
      this.mount = mount
      target.appendChild(mount)
    }
  }
}
