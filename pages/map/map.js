Page({
    data: {
        longitude: null,
        latitude: null,
        markers: []
    },

    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.title
        });
        this.setData({
            longitude: options.longitude,
            latitude: options.latitude,
            markers: [
                {
                    id: 0,
                    longitude: options.longitude,
                    latitude: options.latitude
                }
            ]
        });
    }
})
