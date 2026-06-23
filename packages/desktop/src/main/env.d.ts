interface ImportMetaEnv {
  readonly GREXCODE_CHANNEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "virtual:grexcode-server" {
  export namespace Server {
    export const listen: typeof import("../../../grexcode/dist/types/src/node").Server.listen
    export type Listener = import("../../../grexcode/dist/types/src/node").Server.Listener
  }
  export namespace Config {
    export const get: typeof import("../../../grexcode/dist/types/src/node").Config.get
    export type Info = import("../../../grexcode/dist/types/src/node").Config.Info
  }
  export const bootstrap: typeof import("../../../grexcode/dist/types/src/node").bootstrap
}
