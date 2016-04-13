/* @flow */

/*::
import type {Response} from "./fetch"
*/

export const fetch =
  ( window.fetch != null
  ? window.fetch
  : (uri/*:string*/)/*:Promise<Response>*/ =>
    new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open("GET", uri, true)
      request.onload = () => {
        const status = request.status === 1223 ? 204 : request.status
        if (status < 100 || status > 599) {
          reject(Error("Network request failed"))
        } else {
          resolve({
            status,
            statusText: request.statusText,
            json() {
              return new Promise(resolve => {
                resolve(JSON.parse(request.responseText))
              })
            }
          })
        }
      }
      request.onerror = () => {
        reject(Error("Network request failed"))
      }
      request.send()
    })
  )
