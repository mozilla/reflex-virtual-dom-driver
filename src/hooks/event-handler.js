/* @flow */

import {dictionary} from "object-as-dictionary"

/*::
import * as type from "../../type"
*/

const nameOverrides/*:type.nameOverrides*/ = dictionary({
  DoubleClick: 'dblclick',
})

export const supportedEvents/*:type.supportedEvents*/ = [
  // Clipboard Events
  'Copy',
  'Cut',
  'Paste',
  // Keyboard Events
  'KeyDown',
  'KeyPress',
  'KeyUp',
  // Focus Events
  'Focus',
  'Blur',
  // Form Events
  'Change',
  'Input',
  'Submit',
  // Mouse Events
  'Click',
  'ContextMenu',
  'DoubleClick',
  'Drag',
  'DragEnd',
  'DragEnter',
  'DragExit',
  'DragLeave',
  'DragOver',
  'DragStart',
  'Drop',
  'MouseDown',
  'MouseEnter',
  'MouseLeave',
  'MouseMove',
  'MouseOut',
  'MouseOver',
  'MouseUp',
  // Touch events
  'TouchStart',
  'TouchMove',
  'TouchCancel',
  'TouchEnd',
  // UI Events
  'Scroll',
  // Wheel Events
  'Wheel',
  // Media Events
  'Abort',
  'CanPlay',
  'CanPlayThrough',
  'DurationChange',
  'Emptied',
  'Encrypted',
  'Ended',
  'Error',
  'LoadedData',
  'LoadedMetadata',
  'LoadStart',
  'Pause',
  'Play',
  'Playing',
  'Progress',
  'RateChange',
  'Seeked',
  'Seeking',
  'Stalled',
  'Suspend',
  'TimeUpdate',
  'VolumeChange',
  'Waiting',
  // Image Events
  'Load',
  'Error',
  // Composition ?

  'BeforeInput',
  'CompositionEnd',
  'CompositionStart',
  'CompositionUpdate'
].reduce((table, name) => {
  const type = nameOverrides[name] == null ? name.toLowerCase() :
               nameOverrides[name]

  table[`on${name}`] = {type, capture:false}
  table[`on${name}Capture`] = {type, capture:true}

  return table
}, dictionary())


const handleEvent/*:type.handleEvent*/ = phase => event => {
  const {currentTarget, type} = event
  const handler = currentTarget[`on${type}${phase}`]

  if (typeof(handler) === 'function') {
    handler(event)
  }

  if (handler != null && typeof(handler.handleEvent) === 'function') {
    handler.handleEvent(event)
  }
}

const handleCapturing = handleEvent('capture')
const handleBubbling = handleEvent('bubble')

export class EventHandler {
  /*::
  handler: type.EventListener;
  */
  constructor(handler/*:type.EventListener*/) {
    this.handler = handler
  }
  hook(node/*:type.EventTarget*/, name/*:string*/, previous/*:any*/) {
    const config = supportedEvents[name]
    if (config != null) {
      const {type, capture} = config
      const phase = capture ? 'capture' : 'bubble'

      if (!(previous instanceof EventHandler)) {
        const handler = capture ? handleCapturing : handleBubbling
        node.addEventListener(type, handler, capture)
      }

      node[`on${type}${phase}`] = this.handler
    }
  }
  unhook(node/*:type.EventTarget*/, name/*:string*/, next/*:any*/) {
    const config = supportedEvents[name]

    if (config != null) {
      if (!(next instanceof EventHandler)) {
        const {type, capture} = config
        const phase = capture ? 'capture' : 'bubble'
        const id = `on${type}${phase}`
        const handler = node[id]
        if (handler != null) {
          node.removeEventListener(type, handler, capture)
        }
        delete node[id]
      }
    }
  }
}

export const eventHandler/*:type.eventHandler*/ = address => {
  const handler = address.reflexEventListener
  if (handler == null) {
    const handler = new EventHandler(address)
    address.reflexEventListener = handler
    return handler
  } else {
    return handler
  }
}
