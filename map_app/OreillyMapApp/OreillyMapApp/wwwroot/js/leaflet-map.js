let map;
let dotnet;
export function initMap(dotNetHelper, viewPoint) {
    dotnet = dotNetHelper;
    map = getMap();
    //座標の指定
    let mpoint = [35.6809591, 139.7673068];
    setViewPointLevel(mpoint, viewPoint);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(map);
}

export function setPosition(initPoint, viewPoint) {
    if (initPoint) {
        const mpoint = [initPoint.latitude, initPoint.longitude];
        setViewPointLevel(mpoint, viewPoint);
    }
}

function setViewPointLevel(startPos, viewPoint) {
    let setPoint = 9;
    if (
        navigator.userAgent.indexOf("iPhone") > 0 ||
        navigator.userAgent.indexOf("iPod") > 0 ||
        navigator.userAgent.indexOf("Android") > 0
    ) {
        if (viewPoint) {
            setPoint = viewPoint;
        } else {
            setPoint = 9;
        }
    } else {
        if (viewPoint) {
            setPoint = viewPoint;
        } else {
            setPoint = 11;
        }
    }
    console.log("set zoom level", setPoint);
    map.setView(startPos, setPoint);
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
        // layer = addMakerWithPopup(layer, store);
        layer = addMakerWithClickEvent(layer, store);
    });
    map.addLayer(layer);
}

function getMap() {
    return L.map("mapcontainer", { zoomControl: true, tap: false });
}

function addMakerWithPopup(layer, storeData) {
    try {
        let sucontents = `<h4>${storeData.storeName}</h4><a target="_blank" rel="noopener noreferrer" href="${storeData.storeUrl}">Link</a>`;
        const popup1 = L.popup({ maxWidth: 250 }).setContent(sucontents);
        const maker = L.marker([storeData.position.latitude, storeData.position.longitude], {
            draggable: false,
        }).bindPopup(popup1);
        layer.addLayer(maker);
        return layer;
    } catch (err) {
        console.error("add error", err);
    }
}

function addMakerWithClickEvent(layer, storeData) {
    try {
        const maker = L.marker([storeData.position.latitude, storeData.position.longitude], {
            draggable: false,
        }).on('click', function (e) { onMarkerClicked(storeData); });
        layer.addLayer(maker);
        return layer;
    } catch (err) {
        console.error("add error", err);
    }
}

function onMarkerClicked(store) {
    dotnet.invokeMethodAsync('OnStoreMarkerClicked', store);
    // DotNet.invokeMethodAsync('OreillyMapApp', 'OnStoreMarkerClicked', store);
}

