import { describe, expect } from "bun:test"
import { Effect, Layer } from "effect"
import { AgentV2 } from "@grexlabs/core/agent"
import { FSUtil } from "@grexlabs/core/fs-util"
import { SkillPlugin } from "@grexlabs/core/plugin/skill"
import { SkillV2 } from "@grexlabs/core/skill"
import { SkillDiscovery } from "@grexlabs/core/skill/discovery"
import { testEffect } from "../lib/effect"
import { host } from "./host"

const it = testEffect(
  SkillV2.layer.pipe(
    Layer.provide(FSUtil.defaultLayer),
    Layer.provide(SkillDiscovery.defaultLayer),
    Layer.provideMerge(AgentV2.locationLayer),
  ),
)

describe("SkillPlugin.Plugin", () => {
  it.effect("registers the built-in customize-grexcode skill", () =>
    Effect.gen(function* () {
      const skill = yield* SkillV2.Service
      yield* SkillPlugin.Plugin.effect(host({ skill: { ...skill, reload: skill.reload } }))

      expect(yield* skill.list()).toContainEqual(
        expect.objectContaining({
          name: "customize-grexcode",
          description: expect.stringContaining("grexcode's own configuration"),
        }),
      )
    }),
  )
})
