const puppeteer = require('puppeteer');
const OpenLocationCode = require('open-location-code').OpenLocationCode;
const waitTime = 500;
const urlBase = 'https://plus.codes/';

async function getPositionListAsync(storeInfoList) {
  const storeList = [];
  const faileStoreList = [];
  let counter = 0;
  for (const store of storeInfoList) {
    if (store === null || typeof store === 'undefined') {
      continue;
    }
    try {
      if (store.position === null || typeof store.position === 'undefined') {
        const url = getUrl(store);
        if (!url) {
          console.error('can not get url', store);
          failList.push(store);
          continue;
        }
        //console.log(url);
        const pos = await getPositionAsync(url);
        store.position = pos;
      } else {
        console.log('it is already having a position:', counter);
      }
      storeList.push(store);
    } catch (err) {
      console.error(err);
      faileStoreList.push(store);
    } finally {
      counter++;
      console.log('finishedCount:', counter);
    }
  }

  return { successList: storeList, failList: faileStoreList };
}

function getUrl(store) {
  if (store.address) {
    return urlBase + encodeURIComponent(store.address);
  }
  return null;
}

async function getPositionAsync(mapUrl) {
  if (!mapUrl) {
    throw new Error('mapUrl is needed');
  }
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(mapUrl, { waitUntil: 'networkidle0' });
    let currentUrl = page.url();
    console.log(currentUrl);
    let plusCode = currentUrl.replace(urlBase, '');
    const openLocationCode = new OpenLocationCode();
    const coord = openLocationCode.decode(plusCode);
    const msg = 'Center is ' + coord.latitudeCenter + ',' + coord.longitudeCenter;
    console.log(msg);
    // get lat and long
    while (!coord) {
      // console.log(currentUrl);
      await new Promise((resolve) => {
        setTimeout(resolve, waitTime);
      });
      currentUrl = page.url();
    }
    return {
      lat: coord.latitudeCenter,
      long: coord.longitudeCenter,
    };
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await browser.close();
  }
}

exports.getPositionListAsync = getPositionListAsync;
