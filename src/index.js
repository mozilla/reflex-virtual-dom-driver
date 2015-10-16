/* @flow */

import diff from "virtual-dom/diff"
import createElement from "virtual-dom/create-element"
import patch from "virtual-dom/patch"
import {TextNode, text} from "./text"
import {VirtualNode, node} from "./node"
import {ThunkNode, thunk} from "./thunk"

/*::
import * as renderer from "reflex/type/renderer"
import * as signal from "reflex/type/signal"
*/

export class Renderer {
  /*::
  target: Element;
  mount: ?(Element & {reflexTree?: renderer.ChildNode});
  value: renderer.RootNode;
  isScheduled: boolean;
  version: number;
  address: signal.Address<renderer.ChildNode>;
  execute: () => void;

  node: renderer.node;
  thunk: renderer.thunk;
  text: renderer.text;
  */
  constructor({target}/*:{target: Element}*/) {
    this.target = target
    this.mount = (target.children.length === 1 &&
                  target.children[0].reflexTree != null) ?
      target.children[0] :
      null

    this.address = this.receive.bind(this)
    this.execute = this.execute.bind(this)

    this.node = node
    this.thunk = thunk
    this.text = text
  }
  toString()/*:string*/{
    return `Renderer({target: ${this.target}})`
  }
  receive(value/*:renderer.RootNode*/) {
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
    if (profile) {
      console.time('render')
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
    if (profile) {
      console.time('render')
    }

    this.value.renderWith(this)

    const end = performance.now()
    const time = end - start

    if (time > 16) {
      console.warn(`Render took ${time}ms & will cause frame drop`)
    }

    if (profile) {
      console.timeEnd('render')
    }
  }
  render(tree/*:renderer.ChildNode*/) {
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

let profile = null
export const time = (name/*:string*/)/*:void*/ =>
  void(profile = `${name == null ? "" : name} `)

export const timeEnd = () =>
  void(profile = null)
