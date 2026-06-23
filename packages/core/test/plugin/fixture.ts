import { Credential } from "@grexlabs/core/credential"
import { EventV2 } from "@grexlabs/core/event"
import { FileSystem } from "@grexlabs/core/filesystem"
import { FSUtil } from "@grexlabs/core/fs-util"
import { Global } from "@grexlabs/core/global"
import { Npm } from "@grexlabs/core/npm"
import { PluginV2 } from "@grexlabs/core/plugin"
import { RepositoryCache } from "@grexlabs/core/repository-cache"
import { Ripgrep } from "@grexlabs/core/ripgrep"
import { SkillDiscovery } from "@grexlabs/core/skill/discovery"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"

export const PluginTestLayer = Layer.mergeAll(FileSystem.locationLayer, PluginV2.locationLayer).pipe(
  Layer.provideMerge(
    Layer.mergeAll(
      Credential.defaultLayer,
      EventV2.defaultLayer,
      FSUtil.defaultLayer,
      Global.defaultLayer,
      Layer.succeed(
        Npm.Service,
        Npm.Service.of({
          add: () => Effect.succeed({ directory: "", entrypoint: undefined }),
          install: () => Effect.void,
          which: () => Effect.succeed(undefined),
        }),
      ),
      RepositoryCache.defaultLayer,
      SkillDiscovery.defaultLayer,
      Ripgrep.defaultLayer,
      tempLocationLayer,
    ),
  ),
)
