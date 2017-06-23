/* @flow */

// vtext

export interface VirtualText {
  type: "VirtualText",
  version: string,
  text: string
}

// vnode

export type HookTarget<extension> = Element & EventTarget & extension

export interface Hook<extension> {
  hook: (node: HookTarget<extension>, key: string, previous: any) => void,
  unhook: (node: HookTarget<extension>, key: string, next: any) => void
}

export type HookDictionary<extension> = { [key: string]: Hook<extension> }

export interface AttributeDictionary {
  [key: string]: string | number | boolean
}

export interface StyleDictionary {
  [key: string]: string | number | boolean
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

export interface VirtualNode {
  type: "VirtualNode",
  version: string,

  tagName: string,
  properties: VirtualProperties,
  children: Array<Entity>,
  hooks: ?HookDictionary<any>,

  count: number,
  hasWidgets: boolean,
  hasThunks: boolean,
  descendantHooks: boolean
}

// thunk

export interface Thunk {
  type: "Thunk",
  vnode: ?VNode,
  render(previous: ?Entity): VNode
}

// widget

export interface Widget {
  type: "Widget",
  init(): HTMLElement,
  update(previous: Widget, element: HTMLElement): ?HTMLElement,
  destroy(element: HTMLElement): void
}

export type VNode = VirtualText | VirtualNode | Widget

export type Entity = VirtualText | VirtualNode | Thunk | Widget

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
> = { type: type, vnode: Entity, patch: any }

export type Delta = {
  a: Entity,
  [key: number]: VirtualPatch<any> | Array<VirtualPatch<any>>
}

export type diff = (left: Entity, right: Entity) => Delta

// virtual-dom/create-element

export type createElement = (left: Entity) => HTMLElement

// virtual-dom/patch
export type patch = (target: HTMLElement, delta: Delta) => void
