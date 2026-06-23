/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { define } from "./internal"
import { Effect } from "effect"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizeOpencodeContent from "./skill/customize-grexcode.md" with { type: "text" }

export const CustomizeOpencodeContent = customizeOpencodeContent

export const Plugin = define({
  id: "skill",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.skill.transform((draft) => {
      draft.source(
        new SkillV2.EmbeddedSource({
          type: "embedded",
          skill: new SkillV2.Info({
            name: "customize-grexcode",
            description:
              "Use ONLY when the user is editing or creating grexcode's own configuration: grexcode.json, grexcode.jsonc, files under .grexcode/, or files under ~/.config/grexcode/. Also use when creating or fixing grexcode agents, subagents, commands, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring grexcode itself.",
            location: AbsolutePath.make("/builtin/customize-grexcode.md"),
            content: CustomizeOpencodeContent,
          }),
        }),
      )
    })
  }),
})
