const puppeteer = require('puppeteer');
const waitTime = 500;

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
    // get lat and long
    while (!currentUrl.includes('@')) {
      // console.log(currentUrl);
      await new Promise((resolve) => {
        setTimeout(resolve, waitTime);
      });
      currentUrl = page.url();
    }
    // console.log(currentUrl);
    return getPosionFromUrl(currentUrl);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await browser.close();
  }
}

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
        const pos = await getPositionAsync(store.mapUrl);
        store.position = pos;
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

function getPosionFromUrl(mapUrl) {
  const pos = mapUrl.split('@')[1].split(',');
  return {
    lat: pos[0],
    long: pos[1],
  };
}

exports.getPositionAsync = getPositionAsync;
exports.getPositionListAsync = getPositionListAsync;
