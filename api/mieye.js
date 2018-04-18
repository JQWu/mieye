const Promise = require("../api/es6-promise.min.js");

const mapUrl = 'https://api.map.baidu.com/place/v2/search'
const akey = 'R6X0iYA4CkHqAi1swGquhDVuYFhOse0G'

function getNearRestaurants(lat, lng) {
    var filter = '&filter=industry_type: cater | sort_name:price | price_section:20, 80'
    var radius = 1500;
    if (new Date().getDay() == 5) {
        filter = '&filter=industry_type: cater | sort_name:price | price_section:50,200'
        radius = 2500
    }

    var location = lat + ',' + lng;
    var requestUrl = mapUrl + '?query=中餐厅,外国餐厅,小吃快餐店&output=json&scope=2&page_size=20&radius=' + radius + '&location=' + location + filter + "&ak=" + akey + "&page_num=";

    var promises = []
    for (var i = 0; i < 1; i++) {
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