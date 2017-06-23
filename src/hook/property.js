/* @flow */

import { dictionary } from "object-as-dictionary"
import type { Dictionary } from "object-as-dictionary"

export const supportedProperties: Dictionary<string> = dictionary({
  autoComplete: "autocomplete",
  autoFocus: "autofocus",
  autoPlay: "autoplay",
  autoSave: "autoSave",
  hrefLang: "hreflang",
  radioGroup: "radiogroup",
  spellCheck: "spellcheck",
  srcDoc: "srcdoc",
  srcSet: "srcset"
})
