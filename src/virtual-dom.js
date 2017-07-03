/* @flow */

import { Node } from "reflex-driver"
import currentVersion from "virtual-dom/vnode/version"

// vtext

export const version: string = currentVersion

export interface VirtualText extends Node {
  type: "VirtualText",
  version: string,
  text: string
}

// vnode

export type HookTarget<extension> = Element & EventTarget & extension

export interface Hook<extension> {
  hook(node: HookTarget<extension>, key: string, previous: any): void,
  unhook(node: HookTarget<extension>, key: string, next: any): void
}

export type HookDictionary<extension> = { [key: string]: Hook<extension> }

export interface AttributeDictionary {
  [key: string]: void | null | string | number | boolean
}

export interface StyleDictionary {
  [key: string]: null | string | number | boolean
}

export interface VirtualProperties {
  attributes: ?Hook<any> | AttributeDictionary,
  style: ?StyleDictionary,
  [key: string]:
    | Hook<any>
    | Function
    | string
    | number
    | boolean
    | EventListener
}

export interface VirtualNode extends Node {
  type: "VirtualNode",
  version: string,

  tagName: string,
  // properties: VirtualProperties,
  children: Array<VNode>,
  hooks: ?HookDictionary<*>,

  count: number,
  hasWidgets: boolean,
  hasThunks: boolean,
  descendantHooks: boolean
}

// thunk

export interface VirtualThunk extends Node {
  type: "Thunk",
  vnode: ?VNode,
  render(previous: ?VNode): VNode
}

// widget

export interface Widget extends Node {
  type: "Widget",
  init(): HTMLElement,
  update(previous: Widget, element: HTMLElement): ?HTMLElement,
  destroy(element: HTMLElement): void
}

export type VNode = VirtualText | VirtualNode | VirtualThunk | Widget

// virtual-dom/diff

export type NONE = 0
export type VTEXT = 1
export type VNODE = 2
export type WIDGET = 3
export type PROPS = 4
export type ORDER = 5
export type INSERT = 6
export type REMOVE = 7
export type THUNK = 8

export type VirtualPatch<
  type: NONE | VTEXT | VNODE | WIDGET | PROPS | ORDER | INSERT | REMOVE | THUNK
> = { type: type, vnode: VNode, patch: any }

export type Delta = {
  a: VNode,
  [key: number]: VirtualPatch<*> | Array<VirtualPatch<*>>
}

export type diff = (left: VNode, right: VNode) => Delta

// virtual-dom/create-element

export type createElement = (left: VNode) => HTMLElement

// virtual-dom/patch
export type patch = (target: HTMLElement, delta: Delta) => void
