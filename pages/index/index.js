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

        var  that = this
        var BMap = new bmap.BMapWX({ ak: 'XHFmncp2hARho4HuVz2VfCC1xxm7fr8a' });
        BMap.regeocoding({
            success: function(data){
                wxMarkerData = data.wxMarkerData;
                that.setData({
                    markers: wxMarkerData
                });
                that.setData({
                    latitude: wxMarkerData[0].latitude
                });
                that.setData({
                    longitude: wxMarkerData[0].longitude
                }); 
            },
            iconPath: '../../images/marker.png',
            iconTapPath: '../../images/marker.png'
        }); 

        wx.onAccelerometerChange(function (e) {
            if (e.x > 1 || e.y > 1 || e.z > 1) {
                findRestaurant()
            }
        })
    },

    findRestaurant: function () {
        var self = this;
        if (!this.data.isRun) {
            var res = wx.getSystemInfoSync()
            var width = res.windowWidth;
            var height = res.windowHeight;

            var restaurants = this.data.restaurants
            var pick = this.data.pick
            pick.show = false
            this.setData({
                pick: pick
            });

            var timer = setInterval(function () {
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

            this.setData({
                timer: timer
            });
        } else {
            clearInterval(this.data.timer)
            var restaurants = this.data.restaurants
            for (var i = 0; i < restaurants.length; i++) {
                restaurants[i].show = false
            }

            var index = Math.floor(Math.random() * restaurants.length);
            var pick = JSON.parse(JSON.stringify(restaurants[index]));
            pick.show = true

            self.setData({
                pick: pick,
                restaurants: restaurants
            });
        }
        this.setData({
            isRun: !this.data.isRun
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

})