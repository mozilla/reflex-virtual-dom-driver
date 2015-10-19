/* @flow */

import version from "virtual-dom/vnode/version"

/*::
import * as type from "../type"
*/

export class VirtualText {
  /*::
  $type: "VirtualText";
  type: "VirtualText";
  version: string;
  text: type.Text;
  */

  constructor(text/*:type.Text*/) {
    this.text = text
  }
}

VirtualText.prototype.$type = "VirtualText"
VirtualText.prototype.type = "VirtualText"
VirtualText.prototype.version = version

export const text/*:type.text*/ = text => new VirtualText(text)
