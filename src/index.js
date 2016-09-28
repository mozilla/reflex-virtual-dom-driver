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
  */
  constructor() {
    this.state = NO_REQUEST
    this.requests = []
    this.execute = this.execute.bind(this)
  }
  schedule(request) {
    if (this.requests.indexOf(request) === -1) {
      if (this.state === NO_REQUEST) {
        window.requestAnimationFrame(this.execute)
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
        window.requestAnimationFrame(this.execute)
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
const animationScheduler = new AnimationScheduler()

export class Renderer {
  /*::
  target: Element;
  mount: ?(Element & {reflexTree?: VirtualTree});
  value: VirtualRoot;
  state: number;
  version: number;
  address: Address<VirtualRoot>;

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
    this.onRender()
    this.value.renderWith(this)
    this.onRendered()
  }
  render(tree/*:VirtualTree*/) {
    const {mount, target} = this
    if (mount) {
      this.onDiff()
      const delta = diff(mount.reflexTree, tree)
      this.onDiffed()
      this.onPatch()
      patch(mount, delta)
      mount.reflexTree = tree
      this.onPatched()
    } else {
      this.onMount()
      const mount = createElement(tree)
      mount.reflexTree = tree
      target.innerHTML = ""
      this.mount = mount
      target.appendChild(mount)
      this.onMounted()
    }
  }
}

export class Profiler extends Renderer {
  /*::
  log: Array<[string, number]>
  */
  constructor(options/*:{target: Element}*/) {
    super(options)
    this.log = []
  }
  onRender() {
    this.log.push(['begin render', performance.now()])
  }
  onRendered() {
    this.log.push(['end render', performance.now()])
  }
  onDiff() {
    this.log.push(['begin diff', performance.now()])
  }
  onDiffed() {
    this.log.push(['end diff', performance.now()])
  }
  onPatch() {
    this.log.push(['begin patch', performance.now()])
  }
  onPatched() {
    this.log.push(['end patch', performance.now()])
  }
  onMount() {
    this.log.push(['begin mount', performance.now()])
  }
  onMounted() {
    this.log.push(['end mount', performance.now()])
  }
  clearLog() {
    this.log.splice(0)
  }
}
