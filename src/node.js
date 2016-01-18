/* @flow */

/*::
import * as type from "../type"
*/

import isVirtualNode from "virtual-dom/vnode/is-vnode"
import isWidget from "virtual-dom/vnode/is-widget"
import isThunk from "virtual-dom/vnode/is-thunk"
import isHook from "virtual-dom/vnode/is-vhook"
import version from "virtual-dom/vnode/version"
import SoftSetHook from "virtual-dom/virtual-hyperscript/hooks/soft-set-hook"
import {VirtualText} from "./text"
import {empty} from "blanks/lib/array"
import {blank} from "blanks/lib/object"


import {supportedEvents, eventHandler} from "./hooks/event-handler"
import {supportedAttributes} from "./hooks/attribute"
import {supportedProperties} from "./hooks/property"

export class VirtualNode {
  /*::

  $type: "VirtualNode";
  type: "VirtualNode";
  version: number;


  tagName: type.TagName;
  namespace: ?string;
  key: ?string;
  properties: type.PropertyDictionary;
  children: Array<type.VirtualTree>;
  count: number;
  descendants: number;
  hasWidgets: boolean;
  hasThunks: boolean;
  hooks: ?type.HookDictionary;
  */
  constructor(tagName/*:string*/, namespace/*:?string*/, properties/*:type.PropertyDictionary*/, children/*:Array<type.VirtualTree>*/) {
    this.tagName = tagName
    this.namespace = namespace
    this.key = properties.key != null ? String(properties.key) : null
    this.children = children


    let count = children.length || 0
    let descendants = 0
    let hasWidgets = false
    let hasThunks = false
    let descendantHooks = false

    let hooks = null
    let attributes = properties.attributes != null ? properties.attributes : null

    for (let key in properties) {
      if (properties.hasOwnProperty(key)) {
        const property = properties[key]
        if (isHook(property)) {
          if (hooks == null) {
            hooks = {}
          }

          hooks[key] = property
        } else {
          // Event handlers
          if (supportedEvents[key] != null) {
            if (hooks == null) {
              hooks = {}
            }

            // TODO: Find out why flow did not cought that proprety
            // could be void here
            if (property != null) {
              const handler = eventHandler(property)
              hooks[key] = handler
              properties[key] = handler
            }
          }
          // Special handlind of input.value
          else if
            ( key === 'value' &&
              property != null &&
              ( tagName.toLowerCase() === 'input' ||
                tagName.toLowerCase() === 'textarea'
              )
            )
          {
            if (hooks == null) {
              hooks = {}
            }

            const hook = new SoftSetHook(property)
            hooks[key] = hook
            properties[key] = hook
          }
          // Attributes
          else if (supportedAttributes[key] != null) {
            if (attributes == null) {
              attributes = {}
            }

            // If attribute value is `null` omit it so that virtual-dom
            // will actually remove that attribute. If attribute value is
            // boolean than treate attribute as a flag if `true` just set
            // attribute with no value otherwise omit to remove it.
            if (property !== null && property !== false) {
              attributes[supportedAttributes[key]] =
                ( property === true
                ? ""
                : property
                )
            }

            delete properties[key]
          }
          else if (supportedProperties[key] != null) {
            properties[supportedProperties[key]] = property
            delete properties[key]
          }
          else if (key.indexOf('data-') === 0 || key.indexOf('aria-') === 0) {
            if (attributes == null) {
              attributes = {}
            }

            attributes[key] = property
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

      if (typeof(child) === "string") {
        children[index] = new VirtualText(child)
      }
      else if (child.$type === "LazyTree") {
        children[index] = child.force()
        index = index - 1
      } else if (child instanceof VirtualNode) {
        descendants += child.count

        if (!hasWidgets && child.hasWidgets) {
          hasWidgets = true
        }

        if (!hasThunks && child.hasThunks) {
          hasThunks = true
        }

        if (!descendantHooks && (child.hooks != null || child.descendantHooks)) {
          descendantHooks = true
        }
      }
      else if (!hasWidgets && isWidget(child)) {
        hasWidgets = true
      }
      else if (!hasThunks && isThunk(child)) {
        hasThunks = true
      }

      index = index + 1
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.properties = properties
    this.hooks = hooks
  }
}
VirtualNode.prototype.$type = "VirtualNode"
VirtualNode.prototype.type = "VirtualNode"
VirtualNode.prototype.version = version


export const node/*:type.node*/ = (tagName, properties, children) =>
  new VirtualNode(tagName,
                  null,
                  properties == null ? blank : properties,
                  children == null ? empty : children)
