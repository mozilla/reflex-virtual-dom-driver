/* @flow */

import {Dictionary} from "object-as-dictionary"
import * as Signal from "reflex/type/signal"
import * as DOM from "./dom"
import * as Renderer from "reflex/type/renderer"
import * as VirtualDOM from "./virtual-dom"

// hooks

export type Hook <target> = {
  hook: (node:target, name:string, previous:any) => void,
  unhook: (node:target, name:string, next:any) => void
}


export type nameOverrides = Dictionary<string>
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

export type Key = Renderer.Key
export type TagName = Renderer.TagName
export type AttributeDictionary = Renderer.AttributeDictionary
export type StyleDictionary = Renderer.StyleDictionary
export type PropertyDictionary = Renderer.PropertyDictionary
export type VirtualNode = Renderer.VirtualNode
export type TextNode = Renderer.TextNode
export type Text = Renderer.Text
export type ChildNode = Renderer.ChildNode
export type ThunkNode = Renderer.ThunkNode
export type View = Renderer.View
export type text = Renderer.text
export type node = Renderer.node
export type thunk = Renderer.thunk
