import type { APIEvent } from "@solidjs/start/server"
import { ZenData } from "@grexlabs/console-core/model.js"
import { and, Database, eq, isNull } from "@grexlabs/console-core/drizzle/index.js"
import { KeyTable } from "@grexlabs/console-core/schema/key.sql.js"
import { WorkspaceTable } from "@grexlabs/console-core/schema/workspace.sql.js"
import { ModelTable } from "@grexlabs/console-core/schema/model.sql.js"
import { buildOptionsResponse, buildModelsResponse } from "~/routes/zen/util/modelsHandler"

export async function OPTIONS(_input: APIEvent) {
  return buildOptionsResponse()
}

export async function GET(input: APIEvent) {
  const disabledModels = await (() => {
    const apiKey = input.request.headers.get("authorization")?.split(" ")[1]
    if (!apiKey) return [] as string[]

    return Database.use((tx) =>
      tx
        .select({
          model: ModelTable.model,
        })
        .from(KeyTable)
        .innerJoin(WorkspaceTable, eq(WorkspaceTable.id, KeyTable.workspaceID))
        .innerJoin(ModelTable, and(eq(ModelTable.workspaceID, KeyTable.workspaceID), isNull(ModelTable.timeDeleted)))
        .where(and(eq(KeyTable.key, apiKey), isNull(KeyTable.timeDeleted)))
        .then((rows) => rows.map((row) => row.model)),
    )
  })()

  const models = Object.keys(ZenData.list("full").models)
    .filter((id) => !id.endsWith(":global"))
    .filter((id) => !disabledModels.includes(id))

  return buildModelsResponse(models)
}
