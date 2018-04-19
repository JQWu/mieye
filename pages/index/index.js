var mieye = require('../../api/mieye.js');
var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = [];

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        restaurants: [],
        isRun: false,
        timer: null,
        markers: [],
        latitude: '',
        longitude: '',
        pick: { show: false }
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onLoad: function () {
        wx.getUserInfo({
            success: res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },

    findRestaurantStart: function () {
        var self = this;
        var res = wx.getSystemInfoSync()
        var width = res.windowWidth;
        var height = res.windowHeight;

        var restaurants = self.data.restaurants
        var pick = self.data.pick
        pick.show = false
        self.setData({
            pick: pick
        });

        var timer = setInterval(function () {
            wx.vibrateShort({
            });
            for (var i = 0; i < restaurants.length; i++) {
                restaurants[i].show = false
            }

            var index = Math.floor(Math.random() * restaurants.length);

            restaurants[index].top = (150 + Math.ceil(Math.random() / 2 * height)) + "px";
            restaurants[index].left = Math.ceil(Math.random() * (width - 150)) + "px";
            if (restaurants[index].left + 100 > width) {
                restaurants[index].left = Math.ceil(restaurants[index].left * 0.4)
            }
            restaurants[index].fontSize = Math.ceil(Math.random() * (40 - 14) + 14) + "px";
            restaurants[index].color = "rgba(0,0,0,." + Math.random() + ")";
            restaurants[index].show = true;

            self.setData({
                restaurants: restaurants
            });
        }, 100);

        self.setData({
            timer: timer
        });
    },


    findRestaurantEnd: function () {
        var self = this;
        wx.vibrateLong({

        });
        clearInterval(self.data.timer)
        var restaurants = self.data.restaurants
        for (var i = 0; i < restaurants.length; i++) {
            restaurants[i].show = false
        }

        var index = Math.floor(Math.random() * restaurants.length);
        var pick = JSON.parse(JSON.stringify(restaurants[index]));
        if (pick.name > 10) {
            pick.name = pick.name.substring(0, 10) + "..."
        }
        if (pick.address.length > 15) {
            pick.address = "...." + pick.address.substring(pick.address.length - 15, pick.address.length)
        }
        if (pick.detail_info.tag) {
            pick.detail_info.tag = pick.detail_info.tag.substring("美食;".length, pick.detail_info.tag.length)
        }
        pick.show = true

        self.setData({
            pick: pick,
            restaurants: restaurants
        });
    },

    onShow: function () {
        var self = this;
        wx.getLocation({
            altitude: true,
            success: function (res) {
                var results = mieye.getNearRestaurants(res.latitude, res.longitude);
                results.then(function (restaurants) {
                    for (var i = 0; i < restaurants.length; i++) {
                        restaurants[i].show = false
                    }

                    self.setData({
                        restaurants: restaurants
                    });
                });
            }
        })
    },

    getUserInfo: function (e) {
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    gotoViewMap: function (e) {
        var pick = this.data.pick;
        wx.navigateTo({
            url: '/pages/map/map?longitude=' + pick.location.lng + '&latitude=' + pick.location.lat + '&title=' + pick.name,
        })
    }
})