import type { WslGrexcodeCheck, WslServerRuntime } from "./types"

export const wslRuntimeRetryable = (runtime: WslServerRuntime) =>
  runtime.kind === "failed" || runtime.kind === "stopped"

export async function enterWslOpencodeStep(
  distro: string,
  probe: (distro: string) => Promise<unknown>,
  select: (step: "grexcode") => void,
) {
  await probe(distro)
  select("grexcode")
}

export function wslOpencodeAction(check?: WslGrexcodeCheck) {
  if (!check) return
  if (!check.resolvedPath) return "Install GrexCode"
  if (check.matchesDesktop === false) return "Update GrexCode"
}
