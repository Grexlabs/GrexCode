// @ts-nocheck

import { GrexCode } from "@grexlabs/core"
import { ReadTool } from "@grexlabs/core/tools"

const grexcode = GrexCode.make({})

grexcode.tool.add(ReadTool)

grexcode.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

grexcode.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

grexcode.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await grexcode.session.create({
  agent: "build",
})

grexcode.subscribe((event) => {
  console.log(event)
})

await grexcode.session.prompt({
  sessionID,
  text: "hey what is up",
})

await grexcode.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await grexcode.session.wait()

console.log(await grexcode.session.messages(sessionID))
