export * from "./client.js"
export * from "./server.js"

import { createGrexcodeClient } from "./client.js"
import { createGrexcodeServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createGrexcode(options?: ServerOptions) {
  const server = await createGrexcodeServer({
    ...options,
  })

  const client = createGrexcodeClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
