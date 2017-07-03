/* @flow */

import { VirtualText, version } from "./virtual-dom"
import { Driver, Node } from "reflex-driver"

export class Text implements VirtualText {
  version = version
  type: "VirtualText" = "VirtualText"
  text: string

  constructor(text: string) {
    this.text = text
  }
  renderWith<node: Node>(driver: Driver<node>): node {
    return driver.createTextNode(this.text)
  }
}
