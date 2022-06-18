import { packages, functions } from "../packages/metadata/metadata";
import {updateImport, updateFunctionREADME} from "./utils";

async function run() {
  await Promise.all([
    updateImport(packages, functions),
    updateFunctionREADME(functions),
  ])
}

run()
