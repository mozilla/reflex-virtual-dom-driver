# reflex-react-driver [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

This is a [reflex][] application view driver that uses [virtual-dom][] library for rendering into a DOM.

## Usage

```js
import * as App from "./app"
import {start} from "reflex"
import {Renderer} from "reflex-virtual-dom-driver"

const app = start({
  initial: App.initialize(),
  update: App.update,
  view: App.view
})

app.view.subscribe(new Renderer({target: document.body}))
```

[reflex]:https://github.com/mozilla/reflex
[virtual-dom]:https://github.com/Matt-Esch/virtual-dom

[npm-url]: https://npmjs.org/package/reflex-virtual-dom-driver
[npm-image]: https://img.shields.io/npm/v/reflex-virtual-dom-driver.svg?style=flat

[travis-url]: https://travis-ci.org/mozilla/reflex-virtual-dom-driver
[travis-image]: https://img.shields.io/travis/mozilla/reflex-virtual-dom-driver.svg?style=flat
