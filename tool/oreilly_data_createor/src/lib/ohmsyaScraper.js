const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const urlbase = 'https://www.ohmsha.co.jp/bookstore/?catid=70&cmid=748&pno_747=';

async function getStoreListAsync() {
  let storeList = [];
  let currentPage = 1;

  let stores = [];
  do {
    console.log('currentpage:', currentPage);
    stores = await getStoreInfoByPageAsync(currentPage);
    storeList = storeList.concat(stores);
    currentPage++;
  } while (stores.length > 0 && currentPage < 20);

  return storeList;
}

async function getStoreInfoByPageAsync(pageNo) {
  const storeList = [];
  const res = await axios.get(urlbase + pageNo.toString());
  const dom = new JSDOM(res.data);
  const currentPage = dom.window.document.querySelector('.Current').textContent;
  console.log('ScrapedPage:', currentPage);
  // if current page is not match it means that final page
  if (pageNo.toString() !== currentPage) {
    console.log('no match!!!!');
    return storeList;
  }
  const stores = dom.window.document.querySelectorAll('.storeBox');
  for (const store of stores) {
    const name = store.querySelector('h3').textContent;
    const post = store.querySelector('.post').textContent;
    const address = store.querySelector('.address').textContent;
    const tel = store.querySelector('.spTel').textContent;
    let mapUrl = store.querySelector('.mapLink');
    if (mapUrl) {
      mapUrl = mapUrl.getAttribute('href');
    } else {
      mapUrl = '';
    }
    let storeUrl = store.querySelector('.externalLink');
    if (storeUrl) {
      storeUrl = storeUrl.getAttribute('href');
    } else {
      storeUrl = '';
    }

    const info = {
      name: name,
      post: post,
      address: address,
      tel: tel,
      mapUrl: mapUrl,
      storeUrl: storeUrl,
    };
    //console.log(info);
    storeList.push(info);
  }
  return storeList;
}

exports.getStoreListAsync = getStoreListAsync;
