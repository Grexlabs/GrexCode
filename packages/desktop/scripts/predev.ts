import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.GREXCODE_CHANNEL ?? "dev"}`

await $`cd ../grexcode && bun script/build-node.ts`
