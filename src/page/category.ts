import {IProduct, IProductGenerated, IProductKey, IProductPreview} from "@/schema";
import logger from "@/utils/logger";
import {saveToJSON} from "@/utils/save";
import {BASE_URL} from "@/vars";
import {merge} from "lodash";
import {Browser, Page} from "puppeteer";
import {productDetailTab} from "./detailProduct";

export async function categoryTab($browser: Browser, slug: string) {
  try {
    const $page = await $browser.newPage();
    await $page.goto(BASE_URL + "/" + slug);
    await viewFullPage($page);
    const keys = await getProductsKey($page);
    let products: IProduct[] = [];
    for (const key of keys) {
      const preview = await getProductPreview($page, key.productID);
      const detail = await productDetailTab($browser, key.href);
      const generate: IProductGenerated = {
        _generated_remain: Math.floor(Math.random() * 200 + 1), // from 0->200
        _generated_sold: Math.floor(Math.random() * 200 + 1),
        _generated_preorder: detail == undefined,
      };
      const product: IProduct = Object.assign(merge(preview, detail)!, generate);
      products.push(product);
    }
    saveToJSON(products, slug);
    await $page.close();
  } catch (error) {
    logger.error(error.message, {caller: `newCategoryTab(${slug})`});
  }
}

async function viewFullPage($page: Page) {
  try {
    let pageCount = 0;
    /* stop trying to click if viewmore button was disabled */
    while ($page.waitForSelector(".view-more a", {hidden: true})) {
      await $page.waitForSelector(".view-more a:not([class='prevent'])");
      await $page.click(".view-more a");
      pageCount++;
      logger.info(`clicked viewmore button ${pageCount} times`);
    }
  } catch (error) {
    logger.error(error.message, {caller: `viewFullPage(${$page.url()})`});
  }
}

async function getProductsKey($page: Page) {
  return await $page.$$eval(".main-contain", (MainContains) =>
    MainContains.map(
      (MainContain) =>
        ({
          productID: MainContain.getAttribute("data-id"),
          href: MainContain.getAttribute("href"),
        } as IProductKey)
    )
  );
}

async function getProductPreview($page: Page, productID: string) {
  try {
    return await $page.$eval(`.main-contain[data-id='${productID}']`, (MainContain) => {
      const Heading = MainContain.querySelector("h3");
      const ThumbImage = MainContain.querySelector("img.thumb");
      const IconImage = MainContain.querySelector("img.lbliconimg");
      const SectionCategory = MainContain.parentElement?.parentElement?.parentElement
        ?.parentElement as HTMLDivElement;
      const mainCategory = SectionCategory.getAttribute("data-name");
      const subCategory = MainContain.getAttribute("data-cate");
      return {
        productID: MainContain.getAttribute("data-id"),
        name: Heading?.textContent?.trim(),
        brand: MainContain.getAttribute("data-brand"),
        image: {
          main: ThumbImage?.getAttribute("src") ?? ThumbImage?.getAttribute("data-src"),
          icons: IconImage?.getAttribute("src"),
        },
        category: {
          main: mainCategory,
          sub: subCategory != mainCategory ? subCategory : undefined,
        },
      } as IProductPreview;
    });
  } catch (error) {
    logger.error(error, {caller: `getProductPreview(${productID})`});
  }
}
