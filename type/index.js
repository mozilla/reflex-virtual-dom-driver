/* @flow */

import {Dictionary} from "object-as-dictionary"
import * as Signal from "reflex/type/signal"
import * as DOM from "./dom"
import * as Driver from "reflex/type/driver"
import * as VirtualDOM from "reflex/type/dom"

// hooks

export type Hook <target> = {
  hook: (node:target, name:string, previous:any) => void,
  unhook: (node:target, name:string, next:any) => void
}


export type nameOverrides = Dictionary<string>
export type supportedProperties = Dictionary<string>
export type supportedAttributes = Dictionary<string>
export type HookDictionary = Dictionary<Hook<any>>


// hooks/event-handler

export type EventConfig = {type:string, capture:boolean}
export type supportedEvents = Dictionary<EventConfig>

export type EventHandler = DOM.EventHandler
export type EventListener = DOM.EventListener

export type EventPhaseName
  = 'capture'
  | 'bubble'

export type EventTarget
  = DOM.EventTarget
  & {[key:string]: EventListener}

export type DOMEvent = Event
export type Event
  = DOM.Event
  & {currentTarget: EventTarget}

export type handleEvent = (phase:EventPhaseName) =>
  (event:Event) => void

export type Address <message>
  = Signal.Address <message>
  & {reflexEventListener?: EventHandler}


export type eventHandler = (address:Address) =>
  Hook<EventTarget>

export type AddressBook <message>
  = Array<Address<message>>

export type redirect <message>
  = (addressBook:AddressBook<message>, index:number) => Address<message>

export type Key = VirtualDOM.Key
export type TagName = VirtualDOM.TagName
export type AttributeDictionary = VirtualDOM.AttributeDictionary
export type StyleDictionary = VirtualDOM.StyleDictionary
export type PropertyDictionary = VirtualDOM.PropertyDictionary
export type VirtualNode = VirtualDOM.VirtualNode
export type VirtualText = VirtualDOM.VirtualText
export type Text = VirtualDOM.Text
export type VirtualTree = VirtualDOM.VirtualTree
export type Thunk = VirtualDOM.Thunk
export type View = VirtualDOM.View
export type text = Driver.text
export type node = Driver.node
export type thunk = Driver.thunk
