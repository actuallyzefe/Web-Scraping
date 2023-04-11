const axios = require('axios');
const { JSDOM } = require('jsdom');
const { html } = require('parse5');

const getProductUrl = (country, product_id) =>
  `https://www.amazon.${country}/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${product_id}&m=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-6&pc=dp&experienceId=aodAjaxMain`;

async function getPrices(country, product_id) {
  /*if (country !== 'ca') {
    return console.log(new Error('SOMETHING WRONG'));
  }*/
  const productUrl = getProductUrl(country, product_id);

  const { data: html } = await axios.get(productUrl, {
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Host: `www.amazon.${country}`,
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
    country,
    product_id,
    title,
    pinned,
    offers: [],
  };

  console.log(result);
}

getPrices('com.tr', 'B0B4SBPDC8'); // Baseus Hızlı Şarj Adaptörü 65W

getPrices('com.tr', 'B08NGQDBWX') // Apple 2020 MacBook Air Laptop M1

/* Amazon Country List - Source: https://en.wikipedia.org/wiki/Amazon_(company)
 *
 * Australia -> amazon.com.au
 * Austria -> amazon.at
 * Belgium -> amazon.com.be
 * Brazil -> amazon.com.br
 * Canada -> amazon.ca
 * China -> amazon.cn
 * Czech Republic -> amazon.cz
 * Egypt -> amazon.eg
 * France -> amazon.fr
 * Germany -> amazon.de
 * India -> amazon.in
 * Italy -> amazon.it
 * Japan -> amazon.co.jp
 * Mexico -> amazon.com.mx
 * Netherlands -> amazon.nl
 * Poland -> amazon.pl
 * Saudi Arabia -> amazon.sa
 * Singapore -> amazon.sg
 * Spain -> amazon.es
 * Sweden -> amazon.se
 * Turkey -> amazon.com.tr
 * United Arab Emirates (UAE) -> amazon.ae
 * United Kingdom (UK) / Ireland -> amazon.co.uk
 * United State (US) -> amazon.com
 */