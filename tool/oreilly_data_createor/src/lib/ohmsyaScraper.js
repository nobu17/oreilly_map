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
  } while (stores.length > 0 && currentPage < 30);

  return storeList;
}

async function updateStoreListAsync(baseStoreList) {
  const newStoreList = await getStoreListAsync();
  // if basestore list has position info, merge info
  for (const store of newStoreList) {
    const matchedStore = baseStoreList.find((s) => s.name === store.name && s.address === store.address);
    if (matchedStore && !(matchedStore.position === null || typeof matchedStore.position === 'undefined')) {
      store.position = matchedStore.position;
    }
  }
  return newStoreList;
}

async function getStoreInfoByPageAsync(pageNo) {
  console.log('Start scrape:', pageNo);
  const storeList = [];
  const res = await axios.get(urlbase + pageNo.toString());
  const dom = new JSDOM(res.data);
  const currentPage = dom.window.document.querySelector('.Current').textContent;
  console.log('ScrapedPage No:', currentPage);
  // if current page is not match it means that final page
  if (pageNo.toString() !== currentPage) {
    console.log('no store info found');
    return storeList;
  }
  const stores = dom.window.document.querySelectorAll('.storeBox');
  for (const store of stores) {
    const name = store.querySelector('h3')?.textContent ?? '';
    const post = store.querySelector('.post')?.textContent ?? '';
    const address = store.querySelector('.address')?.textContent ?? '';
    const tel = store.querySelector('.spTel')?.textContent ?? '';
    let mapUrl = store.querySelector('.mapLink') ?? '';
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
exports.updateStoreListAsync = updateStoreListAsync;
