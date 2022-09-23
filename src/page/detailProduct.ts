import {IProductDetail, TParameter} from "@/schema";
import logger from "@/utils/logger";
import {BASE_URL} from "@/vars";
import {Browser, Page} from "puppeteer";

export async function productDetailTab($browser: Browser, href: string) {
  try {
    const $page = await $browser.newPage();
    await $page.goto(BASE_URL + href);
    const detail = await getProductDetail($page);
    await $page.close();
    return detail;
  } catch (error) {
    logger.error(error, {caller: `productDetailTab(${href})`});
  }
}

async function getProductDetail($page: Page) {
  try {
    return await $page.$eval("section.detail", (Detail) => {
      const Heading = Detail.querySelector("h1");
      const PriceCurrent = Detail.querySelector(".box-price-present");
      const PriceOld = Detail.querySelector(".box-price-old");
      const PriceSalePercent = Detail.querySelector(".box-price-percent");
      const GalleryImages = Array.from(Detail.querySelectorAll(".slider-item img"));
      const Parameters = Array.from(Detail.querySelectorAll("ul.parameter__list li"));
      const RatingPoint = Detail.querySelector(".rating-top .point");
      const RatingCount = Detail.querySelector(".rating-top .rating-total");
      const RelatedProducts = Array.from(Detail.querySelectorAll(".related .main-contain"));
      const ArticleContents = Array.from(Detail.querySelectorAll(".content-article > *"));
      const DescriptionDetailButton = Detail.querySelector(".btn-detail") as HTMLAnchorElement;
      const _formatRemoveText = (currencyText: string) =>
        parseFloat(currencyText.replace(/[^0-9]+/gi, ""));

      const gallery = GalleryImages.map(
        (Image) => Image.getAttribute("src") ?? Image.getAttribute("data-src")
      ).filter((notTheLast2, index) => index <= GalleryImages.length - 1 - 2);
      const parameters: TParameter[] = Parameters.map((Parameter) => {
        const k = Parameter.firstElementChild!.textContent!.trim();
        const v = Parameter.lastElementChild!.textContent!.trim().replace(/[\r\n][\s{2,}]+/g, "; ");
        return {k, v};
      });
      const relatedProducts = RelatedProducts.map((product) => product.getAttribute("data-id"));
      let articleElements;
      if (DescriptionDetailButton) {
        DescriptionDetailButton.click();
        articleElements = ArticleContents.map((Element) => {
          const image = Element.querySelector("img");
          if (image) return image.getAttribute("src") ?? image.getAttribute("data-src");
          return Element.textContent?.trim();
        });
      }

      return {
        fullname: Heading?.textContent?.trim(),
        price: {
          current: _formatRemoveText(PriceCurrent?.textContent!),
          old: PriceOld?.textContent ? _formatRemoveText(PriceOld.textContent) : undefined,
          sale: PriceSalePercent?.textContent
            ? _formatRemoveText(PriceSalePercent.textContent)
            : undefined,
        },
        image: {
          gallery,
        },
        rating: {
          point: _formatRemoveText(RatingPoint?.textContent || "0") / 10,
          count: _formatRemoveText(RatingCount?.textContent || "0"),
        },
        parameters,
        relatedProducts,
        articleElements,
      } as IProductDetail;
    });
  } catch (error) {
    logger.error(error, {caller: `getProductDetail(${$page.url()})`});
  }
}
