/* @flow */

import {html, forward, Effects, Task} from "reflex"
import {fetch} from "./fetch"


/*::
import type {URI, Model, Action} from "./random-gif"
import type {Address, DOM, Never} from "reflex"
*/

const RequestMore =
  () =>
  ( { type: "RequestMore"
    }
  )

const ReceiveNewGif =
  (uri) =>
  ( { type: "ReceiveNewGif"
    , source: uri
    }
  )

export const init =
  (topic/*:string*/)/*:[Model, Effects<Action>]*/ =>
  requestMore
  ( { topic
    , uri: "assets/waiting.gif"
    }
  )

const nofx =
  (model/*:Model*/)/*:[Model, Effects<Action>]*/ =>
  [ model
  , Effects.none
  ]

const makeRandomURI =
  topic =>
  `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`


const decodeResponseBody =
  body =>
  ( body == null
  ? null
  : ( body.data == null
    ? null
    : ( body.data.image_url == null
      ? null
      : String(body.data.image_url)
      )
    )
  )


const getRandomGif =
  (topic) =>
  Task.future
  ( () =>
    fetch(makeRandomURI(topic))
    .then(response => response.json())
    .then(decodeResponseBody)
  )



const requestMore =
  model =>
  [ model
  , Effects.task(getRandomGif(model.topic))
    .map(ReceiveNewGif)
  ]

const receivedNewGif =
  (model, uri) =>
  nofx
  ( { topic: model.topic
    , uri:
      ( uri == null
      ? model.uri
      : uri
      )
    }
  )

export const update =
  ( model/*:Model*/, action/*:Action*/)/*:[Model, Effects<Action>]*/ =>
  ( action.type === "ReceiveNewGif"
  ? receivedNewGif(model, action.source)
  : action.type === "RequestMore"
  ? requestMore(model)
  : nofx(model)
  )


const style =
  { viewer:
    { width: "200px"
    }
  , header:
    { width: "200px"
    , textAlign: "center"
    }
  , image: (uri) =>
    ( { display: "inline-block"
      , width: "200px"
      , height: "200px"
      , backgroundPosition: "center center"
      , backgroundSize: "cover"
      , backgroundImage: `url("${uri}")`
      }
    )
  }

export const view =
  (model/*:Model*/, address/*:Address<Action>*/)/*:DOM*/ =>
  html.main
  ( { key: "gif-viewer"
    , style: style.viewer
    }
  , [ html.h2
      ( { key: "header"
        , style: style.header
        }
      , [ model.topic ]
      )
    , html.div
      ( { key: "image"
        , style: style.image(model.uri)
        }
      )
    , html.button
      ( { key: "button"
        , onClick: forward(address, RequestMore)
        }
      , [ "More please!" ]
      )
    ]
  )
