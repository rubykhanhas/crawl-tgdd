import "../paths.config";
import Puppeteer from "puppeteer";
import {categoryTab} from "./page/category";
import logger from "./utils/logger";
import {SLUGS} from "./vars";

async function main() {
  try {
    const $browser = await Puppeteer.launch({headless: true});
    for (const slug of SLUGS) {
      await categoryTab($browser, slug);
    }
    await $browser.close();
  } catch (error) {
    logger.error("error", error.message);
  }
}
main();
