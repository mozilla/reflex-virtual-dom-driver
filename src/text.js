/* @flow */

import version from "virtual-dom/vnode/version"

/*::
import * as type from "../type"
*/

export class TextNode {
  /*::
  $$typeof: "TextNode";
  type: "VirtualText";
  version: string;
  text: string;
  */

  constructor(text/*:string*/) {
    this.text = text
    this.$$typeof = "TextNode"
    this.type = "VirtualText"
    this.version = version
  }
}

TextNode.prototype.$$typeof = "TextNode"
TextNode.prototype.type = "VirtualText"
TextNode.prototype.version = version

export const text/*:type.text*/ = text => new TextNode(text)
