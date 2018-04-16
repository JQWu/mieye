const Promise = require("../api/es6-promise.min.js");

const mapUrl = 'https://api.map.baidu.com/place/v2/search'
const akey = 'R6X0iYA4CkHqAi1swGquhDVuYFhOse0G'

function getNearRestaurants(lat, lng, radius) {
    var location = lat + ',' + lng;
    var requestUrl = mapUrl + '?query=中餐厅,外国餐厅,小吃快餐店&output=json&scope=2&page_size=20 ' + '&location=' + location + "&ak=" + akey + "&page_num=";

    var promises = []
    for (var i = 0; i < 2; i++) {
        var promise = new Promise(function (resolve, reject) {
            wx.request({
                url: requestUrl + i,
                method: "GET",
                success: function (res) {
                    resolve(res.data);
                },
                fail: function (res) {
                    reject(res.data);
                }
            })
        });
        promises.push(promise);
    }

    var allPromise = Promise.all(promises);
    allPromise = allPromise.then(function (results) {
        var restaurants = []
        for (var i = 0; i < results.length; i++) {
            Array.prototype.push.apply(restaurants, results[i].results);
        }
        return restaurants;
    });
    return allPromise;
}

module.exports = {
    getNearRestaurants: getNearRestaurants
}