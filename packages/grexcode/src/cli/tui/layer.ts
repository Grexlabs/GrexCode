import { run as runTui, type TuiInput } from "@grexlabs/tui"
import { Global } from "@grexlabs/core/global"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(Global.defaultLayer))
}
