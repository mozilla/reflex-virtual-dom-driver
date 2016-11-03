/* @flow */

import {Thunk} from "./thunk"
import {Renderer} from "./index"

/*::
import {performance} from "./performance"
*/

class Measurements {
  timeline: Array<number>;
  events: Array<string>;
  constructor(timeline:Array<number>, events:Array<string>) {
    this.timeline = timeline
    this.events = events
  }
}

const defaults = {
  onRender: Renderer.prototype.onRender,
  onRendered: Renderer.prototype.onRendered,
  onDiff: Renderer.prototype.onDiff,
  onDiffed: Renderer.prototype.onDiffed,
  onPatch: Renderer.prototype.onPatch,
  onPatched: Renderer.prototype.onPatched,
  onMount: Renderer.prototype.onMount,
  onMounted: Renderer.prototype.onMounted,

  onCompare: Thunk.prototype.onCompare,
  onCompared: Thunk.prototype.onCompared,
  onCompute: Thunk.prototype.onCompute,
  onComputed: Thunk.prototype.onComputed
}

const log =
  (event, mesurements) => {
    mesurements.timeline.push(performance.now())
    mesurements.events.push(event)
  }


const profiler = {
  mesurements: new Measurements([], []),
  onRender(renderer) {
    log('render', profiler.mesurements)
  },
  onRendered(renderer) {
    log('rendered', profiler.mesurements)
  },
  onDiff(renderer) {
    log('diff', profiler.mesurements)
  },
  onDiffed(renderer) {
    log('diffed', profiler.mesurements)
  },
  onPatch(renderer) {
    log('patch', profiler.mesurements)
  },
  onPatched(renderer) {
    log('patched', profiler.mesurements)
  },
  onMount(renderer) {
    log('mount', profiler.mesurements)
  },
  onMounted(renderer) {
    log('mounted', profiler.mesurements)
  },
  onCompare(thunk) {
    log(`compare:${thunk.key}`, profiler.mesurements)
  },
  onCompared(thunk) {
    log(`compared:${thunk.key}`, profiler.mesurements)
  },
  onCompute(thunk) {
    log(`compute:${thunk.key}`, profiler.mesurements)
  },
  onComputed(thunk) {
    log(`computed:${thunk.key}`, profiler.mesurements)
  }
}

export const start = () => {
  profiler.mesurements = new Measurements([], [])

  Renderer.prototype.onRender = profiler.onRender
  Renderer.prototype.onRendered = profiler.onRendered
  Renderer.prototype.onDiff = profiler.onDiff
  Renderer.prototype.onDiffed = profiler.onDiffed
  Renderer.prototype.onPatch = profiler.onPatch
  Renderer.prototype.onPatched = profiler.onPatched
  Renderer.prototype.onMount = profiler.onMount
  Renderer.prototype.onMounted = profiler.onMounted

  Thunk.prototype.onCompare = profiler.onCompare
  Thunk.prototype.onCompared = profiler.onCompared
  Thunk.prototype.onCompute = profiler.onCompute
  Thunk.prototype.onComputed = profiler.onComputed
}

export const stop = () => {
  Renderer.prototype.onRender = defaults.onRender
  Renderer.prototype.onRendered = defaults.onRendered
  Renderer.prototype.onDiff = defaults.onDiff
  Renderer.prototype.onDiffed = defaults.onDiffed
  Renderer.prototype.onPatch = defaults.onPatch
  Renderer.prototype.onPatched = defaults.onPatched
  Renderer.prototype.onMount = defaults.onMount
  Renderer.prototype.onMounted = defaults.onMounted

  Thunk.prototype.onCompare = defaults.onCompare
  Thunk.prototype.onCompared = defaults.onCompared
  Thunk.prototype.onCompute = defaults.onCompute
  Thunk.prototype.onComputed = defaults.onComputed
}


export const getLastMeasurements =
  () =>
  profiler.mesurements

class Report {
  result: {[key:string]: number};
  pending: Array<string>;
  timestamps: Array<number>;
  constructor(result, pending, timestamps) {
    this.result = result
    this.pending = pending
    this.timestamps = timestamps
  }
  log(key, time) {
    if (key in this.result) {
      this.result[key] += time
    } else {
      this.result[key] = time
    }
  }
  start(key, time) {
    this.pending.push(key)
    this.timestamps.push(time)
  }
  end(key, time) {
    const index = this.pending.indexOf(key)
    if (index >= 0 && this.timestamps.length < index) {
      const elapsed = time - this.timestamps[index]
      this.pending.splice(index, 1)
      this.timestamps.splice(index, 1)
      this.log(key, elapsed)
    }
  }
}

export const printInclusive =
  ({timeline, events}:Measurements) => {
    const report = new Report({}, [], [])
    let index = 0
    while (index < timeline.length && index < events.length) {
      const [time, event] = [timeline[0], events[0]]
      if (event.startsWith("compare:")) {
        const key = event.replace("compare:", "")
        report.start(key, time)
      } else if (event.startsWith("compared:")) {
        const key = event.replace("compared:", "")
        report.end(key, time)
      } else if (event.startsWith("compute:")) {
        const key = event.replace("compute:", "")
        report.start(key, time)
      } else if (event.startsWith("computed:")) {
        const key = event.replace("compared:", "")
        report.end(key, time)
      } else {
        continue
      }
    }

    console.table(report.result)
  }
