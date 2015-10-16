/* @flow */

import {dictionary} from "object-as-dictionary"
/*::
import * as type from "../../type/index"
*/

const nameOverrides/*:type.nameOverrides*/ = dictionary({
  className: 'class',
  htmlFor: 'for'
})

export const supportedAttributes/*:type.supportedAttributes*/ =
 `accept acceptCharset accessKey action allowFullScreen allowTransparency alt
async autoComplete autoFocus autoPlay capture cellPadding cellSpacing charSet
challenge checked classID className cols colSpan content contentEditable contextMenu
controls coords crossOrigin data dateTime defer dir disabled download draggable
encType form formAction formEncType formMethod formNoValidate formTarget frameBorder
headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode
keyParams keyType label lang list loop low manifest marginHeight marginWidth max
maxLength media mediaGroup method min minlength multiple muted name noValidate open
optimum pattern placeholder poster preload radioGroup readOnly rel required role
rows rowSpan sandbox scope scoped scrolling seamless selected shape size sizes
span spellCheck src srcDoc srcSet start step summary tabIndex target title
type useMap value width wmode wrap

autoCapitalize autoCorrect

property

itemProp itemScope itemType itemRef itemID

unselectable

results autoSave

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
    table[name] = nameOverrides[name] != null ?
                    nameOverrides[name] :
                    name.toLowerCase()
    return table
  }, dictionary())
