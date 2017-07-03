# reflex-react-driver
[![NPM version][version.icon]][version.url]
[![Build Status][travis.icon]][travis.url]
[![Gitter][gitter.icon]][gitter.url]
[![styled with prettier][prettier.icon]][prettier.url]

This is a [reflex][] application view driver that uses [virtual-dom][] library for rendering into a DOM.

## Usage

```js
import * as App from "./app"
import {start} from "reflex"
import {Renderer} from "reflex-virtual-dom-driver"

const renderer = new Renderer({target: document.body})
const app = start({
  initial: App.initialize(),
  update: App.update,
  view: App.view
}, ({view}) => {
  renderer.render(view)
})
```

[reflex]:https://github.com/mozilla/reflex
[virtual-dom]:https://github.com/Matt-Esch/virtual-dom

[version.url]: https://npmjs.org/package/reflex-virtual-dom-driver
[version.icon]: https://img.shields.io/npm/v/reflex-virtual-dom-driver.svg?style=flat

[travis.url]: https://travis-ci.org/mozilla/reflex-virtual-dom-driver
[travis.icon]: https://img.shields.io/travis/mozilla/reflex-virtual-dom-driver.svg?style=flat


[gitter.url]: https://gitter.im/mozilla/reflex?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[gitter.icon]: https://badges.gitter.im/Join%20Chat.svg

[prettier.url]:https://github.com/prettier/prettier
[prettier.icon]:https://img.shields.io/badge/styled_with-prettier-ff69b4.svg