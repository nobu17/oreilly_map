let map;
export function initMap(initPoint) {
    map = getMap();
    //座標の指定
    let mpoint = [35.6809591, 139.7673068];
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0 ||
        navigator.userAgent.indexOf("Android") > 0
    ) {
        map.setView(mpoint, 9);
    } else {
        map.setView(mpoint, 11);
    }
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(map);
}

export function setPosition(initPoint) {
    if (initPoint) {
        const mpoint = [initPoint.latitude, initPoint.longitude];
        if (
            navigator.userAgent.indexOf("iPhone") > 0 ||
            navigator.userAgent.indexOf("iPod") > 0 ||
            navigator.userAgent.indexOf("Android") > 0
        ) {
            map.setView(mpoint, 9);
        } else {
            map.setView(mpoint, 11);
        }
    }
}

let layer;
export function setData(storeList) {
    if (layer == null) {
        layer = L.layerGroup();
    } else {
        map.removeLayer(layer);
        layer = L.layerGroup();
    }

    storeList.forEach((store) => {
        // addMaker(store);
        layer = addMaker2(layer, store);
    });
    map.addLayer(layer);
}

function getMap() {
    return L.map("mapcontainer", { zoomControl: true, tap: false });
}

function addMaker(storeData) {
    try {
        let sucontents = `<a target="_blank" rel="noopener noreferrer" href="${storeData.storeUrl}"><h5>${storeData.storeName}</h5></a>`;
        const popup1 = L.popup({ maxWidth: 250 }).setContent(sucontents);
        L.marker([storeData.position.latitude, storeData.position.longitude], {
            draggable: false,
        }).bindPopup(popup1).bindTooltip(storeData.storeName).addTo(map);;
    } catch (err) {
        console.error("add error", err);
    }
}

function addMaker2(layer, storeData) {
    try {
        let sucontents = `<h4>${storeData.storeName}</h4><a target="_blank" rel="noopener noreferrer" href="${storeData.storeUrl}">Link</a>`;
        const popup1 = L.popup({ maxWidth: 250 }).setContent(sucontents);
        const maker = L.marker([storeData.position.latitude, storeData.position.longitude], {
            draggable: false,
        }).bindPopup(popup1).openPopup();
        layer.addLayer(maker);
        return layer;
    } catch (err) {
        console.error("add error", err);
    }
}
