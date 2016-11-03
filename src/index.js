/* @flow */

import diff from "virtual-dom/diff"
import createElement from "virtual-dom/create-element"
import patch from "virtual-dom/patch"
import {text} from "./text"
import {node} from "./node"
import {thunk} from "./thunk"

/*::
import type {Address, VirtualTree, VirtualRoot} from "reflex"
import {Driver} from "reflex"
import {performance} from "./performance"
*/

// Invariants:
// 1. In the NO_REQUEST state, there is never a scheduled animation frame.
// 2. In the PENDING_REQUEST and EXTRA_REQUEST states, there is always exactly
// one scheduled animation frame.
const NO_REQUEST = 0
const PENDING_REQUEST = 1
const EXTRA_REQUEST = 2


/*::
type Time = number
type State = 0 | 1 | 2
*/
class AnimationScheduler {
  /*::
  state: State;
  requests: Array<(time:Time) => any>;
  execute: (time:Time) => void;
  request: (callback:(time:number) => void) => number
  cancel: (id:number) => void
  */
  constructor() {
    this.state = NO_REQUEST
    this.requests = []
    this.execute = this.execute.bind(this)
  }
  schedule(request) {
    if (this.requests.indexOf(request) === -1) {
      if (this.state === NO_REQUEST) {
        requestAnimationFrame(this.execute)
      }

      this.requests.push(request)
      this.state = PENDING_REQUEST
    }
  }
  execute(time/*:Time*/)/*:void*/ {
    switch (this.state) {
      case NO_REQUEST:
        // This state should not be possible. How can there be no
        // request, yet somehow we are actively fulfilling a
        // request?
        throw Error(`Unexpected frame request`)
      case PENDING_REQUEST:
        // At this point, we do not *know* that another frame is
        // needed, but we make an extra frame request just in
        // case. It's possible to drop a frame if frame is requested
        // too late, so we just do it preemptively.
        requestAnimationFrame(this.execute)
        this.state = EXTRA_REQUEST
        this.dispatch(this.requests.splice(0), 0, time)
        break
      case EXTRA_REQUEST:
        // Turns out the extra request was not needed, so we will
        // stop requesting. No reason to call it all the time if
        // no one needs it.
        this.state = NO_REQUEST
        break
    }
  }
  dispatch(requests, index, time) {
    const count = requests.length
    try {
      while (index < count) {
        const request = requests[index]
        index = index + 1
        request(time)
      }
    } finally {
      if (index < count) {
        this.dispatch(requests, index, time)
      }
    }
  }
}

let requestAnimationFrameTime = 0

const requestAnimationFrame =
  (typeof(window) != "undefined" && window.requestAnimationFrame != null) ?
    window.requestAnimationFrame
  : callback => {
      const now = Date.now()
      const delta = Math.max(0, 16 - (now - requestAnimationFrameTime))
      requestAnimationFrameTime = now + delta
      return setTimeout(callback, delta, requestAnimationFrameTime)
    }

const cancelAnimationFrame =
  (typeof(window) != "undefined" && window.cancelAnimationFrame != null) ?
    window.cancelAnimationFrame
  : clearTimeout


const animationScheduler = new AnimationScheduler()

export class Renderer {
  /*::
  target: Element;
  mount: ?(Element & {reflexTree?: VirtualTree});
  value: VirtualRoot;
  state: number;
  version: number;
  address: Address<VirtualRoot>;
  options: {document:Document};

  onRender: (renderer:Renderer) => void;
  onRendered: (renderer:Renderer) => void;
  onDiff: (renderer:Renderer) => void;
  onDiffed: (renderer:Renderer) => void;
  onPatch: (renderer:Renderer) => void;
  onPatched: (renderer:Renderer) => void;
  onMount: (renderer:Renderer) => void;
  onMounted: (renderer:Renderer) => void;

  execute: (time:Time) => void;
  render: Driver.render;
  node: Driver.node;
  thunk: Driver.thunk;
  // Note this must be optional in order to satisfy flow (see facebook/flow#952)
  text: ?Driver.text;
  */
  constructor({target}/*:{target: Element}*/) {
    this.state = NO_REQUEST
    this.target = target
    this.mount =
      ( target.children.length !== 1
      ? null
      : target.children[0].reflexTree == null
      ? null
      : target.children[0]
      )

    this.address = this.receive.bind(this)
    this.execute = this.execute.bind(this)

    this.node = node
    this.thunk = thunk
    this.text = text
    this.options = { document: target.ownerDocument }
  }
  toString()/*:string*/{
    return `Renderer({target: ${String(this.target)}})`
  }
  receive(value/*:VirtualRoot*/) {
    if (this.value !== value) {
      this.value = value
      animationScheduler.schedule(this.execute)
    }
  }
  onRender() {}
  onRendered() {}
  onDiff() {}
  onDiffed() {}
  onPatch() {}
  onPatched() {}
  onMount() {}
  onMounted() {}
  execute(_/*:number*/) {
    this.onRender(this)
    this.value.renderWith(this)
    this.onRendered(this)
  }
  render(tree/*:VirtualTree*/) {
    const {mount, target} = this
    if (mount) {
      this.onDiff(this)
      const delta = diff(mount.reflexTree, tree)
      this.onDiffed(this)
      this.onPatch(this)
      patch(mount, delta)
      mount.reflexTree = tree
      this.onPatched(this)
    } else {
      this.onMount(this)
      const mount = createElement(tree, this.options)
      mount.reflexTree = tree
      target.innerHTML = ""
      this.mount = mount
      target.appendChild(mount)
      this.onMounted(this)
    }
  }
}
