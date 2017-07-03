/* @flow */

import type { Properties, Attributes } from "reflex-driver"
import { VirtualNode, version } from "./virtual-dom"
import type { VNode } from "./virtual-dom"
import { Driver, Node } from "reflex-driver"

import isVirtualNode from "virtual-dom/vnode/is-vnode"
import isWidget from "virtual-dom/vnode/is-widget"
import isThunk from "virtual-dom/vnode/is-thunk"
import isHook from "virtual-dom/vnode/is-vhook"
import SoftSetHook from "virtual-dom/virtual-hyperscript/hooks/soft-set-hook"
import { Text } from "./text"
import { empty } from "blanks/array"
import { blank } from "blanks/object"
import { Hook } from "./hook"
import type { Dictionary } from "object-as-dictionary"
import type { HookDictionary } from "./hook"

import { supportedEvents, eventHandler } from "./hook/event-handler"
import { supportedAttributes } from "./hook/attribute"
import { supportedProperties } from "./hook/property"

const noProperties: Properties = (blank: any)
export class Element implements VirtualNode {
  type = "VirtualNode"
  version = version
  namespaceURI: ?string

  tagName: string
  namespace: ?string
  key: ?string
  properties: Properties
  children: Array<VNode>
  count: number
  descendants: number
  hasWidgets: boolean
  hasThunks: boolean
  hooks: ?HookDictionary<*>
  descendantHooks: boolean

  constructor(
    namespaceURI: ?string,
    tagName: string,
    maybeProperties: ?Properties,
    maybeChildren: ?Array<string | VNode>
  ) {
    const properties = maybeProperties || noProperties
    const children = ((maybeChildren: any): ?Array<VNode>) || empty
    this.tagName = tagName
    this.namespace = this.namespaceURI = namespaceURI
    this.key = properties.key != null ? String(properties.key) : null
    this.children = children

    let count = children.length || 0
    let descendants = 0
    let hasWidgets = false
    let hasThunks = false
    let descendantHooks = false

    let hooks: HookDictionary<*> | null = null
    let attributes: null | Attributes =
      properties.attributes != null ? properties.attributes : null

    for (let key in properties) {
      if (properties.hasOwnProperty(key)) {
        const property = properties[key]
        if (isHook(property)) {
          if (hooks == null) {
            hooks = {}
          }

          hooks[key] = (property: any)
        } else {
          // Event handlers
          if (supportedEvents[key] != null) {
            if (hooks == null) {
              hooks = {}
            }

            // TODO: Find out why flow did not cought that proprety
            // could be void here
            if (property != null) {
              const handler = eventHandler((property: any))
              hooks[key] = handler
              properties[key] = handler
            }
          } else if (
            key === "value" &&
            property != null &&
            (tagName.toLowerCase() === "input" ||
              tagName.toLowerCase() === "textarea")
          ) {
            // Special handlind of input.value
            if (hooks == null) {
              hooks = {}
            }

            const hook = new SoftSetHook(property)
            hooks[key] = hook
            properties[key] = hook
          } else if (supportedAttributes[key] != null) {
            // Attributes
            if (attributes == null) {
              attributes = ({}: any)
            }

            // If attribute value is `null` omit it so that virtual-dom
            // will actually remove that attribute. If attribute value is
            // boolean than treate attribute as a flag if `true` just set
            // attribute with no value otherwise omit to remove it.
            if (property !== null && property !== false) {
              attributes[supportedAttributes[key]] =
                property === true ? "" : ((property: any): string)
            }

            delete properties[key]
          } else if (supportedProperties[key] != null) {
            properties[supportedProperties[key]] = property
            delete properties[key]
          } else if (key.indexOf("data-") === 0 || key.indexOf("aria-") === 0) {
            if (attributes == null) {
              attributes = ({}: any)
            }

            attributes[key] = ((property: any): string)
            delete properties[key]
          }
        }
      }
    }

    if (attributes != null) {
      properties.attributes = attributes
    }

    let index = 0
    while (index < count) {
      const child = children[index]

      if (typeof child === "string") {
        children[index] = new Text(child)
      } else if (child instanceof Element) {
        descendants += child.count

        if (!hasWidgets && child.hasWidgets) {
          hasWidgets = true
        }

        if (!hasThunks && child.hasThunks) {
          hasThunks = true
        }

        if (
          !descendantHooks &&
          (child.hooks != null || child.descendantHooks)
        ) {
          descendantHooks = true
        }
      } else if (!hasWidgets && isWidget(child)) {
        hasWidgets = true
      } else if (!hasThunks && isThunk(child)) {
        hasThunks = true
      }

      index = index + 1
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.properties = properties
    this.hooks = hooks
    this.descendantHooks = descendantHooks
  }
  renderWith<node: Node>(driver: Driver<node>): node {
    return driver.createElement(
      this.tagName,
      this.properties,
      this.children.map((child: Node): node => child.renderWith(driver))
    )
  }
}
