/* @flow */

import type { Dictionary } from "object-as-dictionary"

export interface Hook<target> {
  hook(node: target, name: string, previous: mixed): void,
  unhook(node: target, name: string, next: mixed): void
}

export type HookDictionary<target> = Dictionary<Hook<target>>
