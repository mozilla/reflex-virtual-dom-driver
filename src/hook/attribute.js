/* @flow */

import { dictionary } from "object-as-dictionary"

import type { Dictionary } from "object-as-dictionary"

const nameOverrides: Dictionary<string> = dictionary({
  className: "class",
  htmlFor: "for",
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv",
  clipPath: "clip-path",
  fillOpacity: "fill-opacity",
  fontFamily: "font-family",
  fontSize: "font-size",
  markerEnd: "marker-end",
  markerMid: "marker-mid",
  markerStart: "marker-start",
  stopColor: "stop-color",
  stopOpacity: "stop-opacity",
  strokeDasharray: "stroke-dasharray",
  strokeLinecap: "stroke-linecap",
  strokeOpacity: "stroke-opacity",
  strokeWidth: "stroke-width",
  textAnchor: "text-anchor",
  xlinkActuate: "xlink:actuate",
  xlinkArcrole: "xlink:arcrole",
  xlinkHref: "xlink:href",
  xlinkRole: "xlink:role",
  xlinkShow: "xlink:show",
  xlinkTitle: "xlink:title",
  xlinkType: "xlink:type",
  xmlBase: "xml:base",
  xmlLang: "xml:lang",
  xmlSpace: "xml:space"
})

export const supportedAttributes: Dictionary<
  string
> = `allowFullScreen allowTransparency capture cellPadding cellSpacing charSet
challenge classID className cols colSpan contentEditable contextMenu
dir encType  form formAction formEncType formMethod formTarget frameBorder
height hidden inputMode is keyParams keyType list loop manifest marginHeight
marginWidth maxLength media method nonce role rows rowSpan scrolling seamless
size sizes span srcSet start width wmode wrap about datatype inlist prefix
property resource typeof vocab autoCapitalize autoCorrect itemProp
itemProp itemScope itemType itemRef itemID security unselectable

clipPath cx cy d dx dy fill fillOpacity fontFamily
fontSize fx fy gradientTransform gradientUnits markerEnd
markerMid markerStart offset opacity patternContentUnits
patternUnits points preserveAspectRatio r rx ry spreadMethod
stopColor stopOpacity stroke  strokeDasharray strokeLinecap
strokeOpacity strokeWidth textAnchor transform version
viewBox x1 x2 x xlinkActuate xlinkArcrole xlinkHref xlinkRole
xlinkShow xlinkTitle xlinkType xmlBase xmlLang xmlSpace y1 y2 y`
  .split(/\s+/)
  .reduce((table, name) => {
    table[name] = nameOverrides[name] != null
      ? nameOverrides[name]
      : name.toLowerCase()
    return table
  }, Object.create(null))
