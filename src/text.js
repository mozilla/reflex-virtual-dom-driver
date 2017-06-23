/* @flow */

import version from "virtual-dom/vnode/version"
import { VirtualText } from "reflex"

export class TextNode implements VirtualText {
  $type: "VirtualText" = "VirtualText"
  type: "VirtualText" = "VirtualText"
  version: string = version
  text: string

  constructor(text: string) {
    this.text = text
  }
}

export const text = (text: string): TextNode => new TextNode(text)
