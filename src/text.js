/* @flow */

import version from "virtual-dom/vnode/version"

/*::
import type {Text} from "./text"
*/

export class VirtualText {
  /*::
  $type: "VirtualText";
  type: "VirtualText";
  version: string;
  text: Text;
  */

  constructor(text/*:Text*/) {
    this.text = text
  }
}

VirtualText.prototype.$type = "VirtualText"
VirtualText.prototype.type = "VirtualText"
VirtualText.prototype.version = version

export const text =
  (text/*:string*/)/*:VirtualText*/ =>
  new VirtualText(text)
