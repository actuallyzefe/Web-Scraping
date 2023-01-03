const axios = require('axios');
const { JSDOM } = require('jsdom');
const { html } = require('parse5');

const getProductUrl = (product_id) =>
  `https://www.amazon.com/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${product_id}&m=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-6&pc=dp&experienceId=aodAjaxMain`;

async function getPrices(product_id) {
  const productUrl = getProductUrl(product_id);
  const { data: html } = await axios.get(productUrl, {
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Host: 'www.amazon.com',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      pragma: 'no - cache',
      TE: 'Trailers',
      'Ugrade-Insecure-Requests': 1,
    },
  });
  const dom = new JSDOM(html);
  const $ = (selector) => dom.window.document.querySelector(selector);
  // console.log(
  //   dom.window.document.querySelector('.a-price .a-offscreen').textContent
  // );
  const title = $('#aod-asin-title-text').textContent.trim();
  const pinnedElement = $('#pinned-de-id');
  const pinnedPrice = pinnedElement.querySelector(
    '.a-price .a-offscreen'
  ).textContent;

  // const pinnedOfferId = pinnedElement
  //   .querySelector('input[name="offeringID.1"]')
  //   .getAttribute('value');

  const pinnedShippedFrom = pinnedElement
    .querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small')
    .textContent.trim();

  const pinnedSoldBy = pinnedElement
    .querySelector('#aod-offer-soldBy .a-col-right .a-size-small')
    .textContent.trim();

  const pinned = {
    price: pinnedPrice,
    // offer_id: pinnedOfferId,
    ships_from: pinnedShippedFrom,
    sold_by: pinnedSoldBy,
  };

  const result = {
    title,
    pinned,
    offers: [],
  };

  console.log(result);
}

getPrices('B09FJDTX41');
