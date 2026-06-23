import path from "path"

process.env.GREXCODE_DB = ":memory:"
process.env.GREXCODE_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.GREXCODE_DISABLE_MODELS_FETCH = "true"
