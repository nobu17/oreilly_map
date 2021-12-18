const googleMapScraper = require('./lib/googleMapScraper');
const plusCodesScraper = require('./lib/plusCodesScraper');
const ohmsyaScraper = require('./lib/ohmsyaScraper');
const fs = require('fs').promises;
const filePath = './files/stores.json';

async function main() {
  let storeList = [];
  try {
    storeList = await readStores();
  } catch (err) {
    console.error('read stores error', err);
    process.exitCode = 1;
    return;
  }

  try {
    // storeList = await googleMapScraper.getPositionListAsync(storeList);
    storeList = await plusCodesScraper.getPositionListAsync(storeList);
    storeList = getConcatStoreList(storeList);
  } catch (err) {
    console.error('scraping google map is error', err);
    return;
  }

  await writeStoreList(storeList);
  console.log('finished');
}

async function writeStoreList(storeList) {
  try {
    await fs.writeFile(filePath, JSON.stringify(storeList));
  } catch (err) {
    console.error('file write is failed', err);
  }
}

function getConcatStoreList(storeList) {
  console.log('failedStores:', storeList.failList);
  const stores = storeList.successList.concat(storeList.failList);
  return {
    updateDate: getNowDateString(),
    stores: stores,
  };
}

async function readStores() {
  let storeList = [];
  const isFileExists = await isFilExists(filePath);
  if (isFileExists) {
    storeList = JSON.parse(await fs.readFile(filePath)).stores;
    // merge info
    storeList = await ohmsyaScraper.updateStoreListAsync(storeList);
  } else {
    storeList = await ohmsyaScraper.getStoreListAsync();
  }
  return storeList;
}

async function isFilExists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

function getNowDateString() {
  // get jst
  const dt = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000);
  const y = dt.getFullYear();
  const m = ('00' + (dt.getMonth() + 1)).slice(-2);
  const d = ('00' + dt.getDate()).slice(-2);
  const h = ('00' + dt.getHours()).slice(-2);
  const min = ('00' + dt.getMinutes()).slice(-2);
  var result = y + '/' + m + '/' + d + ' ' + h + ':' + min;
  return result;
}

main();
