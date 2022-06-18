import { packages, functions } from "../packages/metadata/metadata";
import {updateImport} from "./utils";

async function run() {
  await Promise.all([
    updateImport(packages, functions)
  ])
}

run()
