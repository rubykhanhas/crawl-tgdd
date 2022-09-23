import {EXPORT_FILENAME} from "../vars";
import path from "path";
import fs from "fs";
import logger from "./logger";

export async function saveToJSON(
  data: any,
  filename = EXPORT_FILENAME,
  dir = path.resolve("export")
) {
  const parsed = JSON.stringify(data);
  const export_json = path.join(dir, `${filename}.json`);

  fs.mkdir(
    dir,
    {recursive: true},
    (err) => err && logger.log(err.message, {caller: "saveToJSON() mkdir"})
  );

  fs.writeFile(
    export_json,
    parsed,
    "utf8",
    (err) => err && logger.log(err.message, {caller: `saveToJSON(${export_json}) writeFile`})
  );
}
