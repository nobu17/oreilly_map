export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject("位置情報未対応");
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const result = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                resolve(result);
            },
            (err) => {
                console.error(err);
                reject(err);
            });
    });
}