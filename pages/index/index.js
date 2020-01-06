//index.js
//获取应用实例
const app = getApp();

Page({
	data: {
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse("button.open-type.getUserInfo"),
		imageUrl: null
	},
	/**
	 * 更改图片大小
	 * @param {String} url 微信头像的路径
	 */
	changeAvatarSize: function(url) {
		let urlArray = url.split("/");
		let index = urlArray.indexOf("132");
		if (index > -1) urlArray[index] = 0;
		return urlArray.join("/");
	},
	onLoad: function() {
		if (app.globalData.userInfo) {
			let userInfo = app.globalData.userInfo;
			let { avatarUrl } = userInfo;
			if (avatarUrl) {
				this.addProfileImage(this.changeAvatarSize(avatarUrl));
			}
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			});
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				});
			};
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo;
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					});
				}
			});
		}
	},

	addProfileImage: function(imageUrl) {
		wx.downloadFile({
			url: imageUrl,
			success: res => {
				// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
				if (res.statusCode === 200) {
					wx.getImageInfo({
						src: res.tempFilePath,
						success: res => {
							const ctx = wx.createCanvasContext("myCanvas");
							ctx.drawImage(res.path, 0, 0, 300, 300);
							ctx.draw();
							this.setData({
								imageUrl: res.path
							});
						},
						fail: e => console.log(e)
					});
				}
			},
			fail: res => console.log(res)
		});
	},

	getUserInfo: function(e) {
		app.globalData.userInfo = e.detail.userInfo;
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		});
		let { avatarUrl } = e.detail.userInfo;
		this.addProfileImage(this.changeAvatarSize(avatarUrl));
	},
	addNationalFlag: function() {
		const ctx = wx.createCanvasContext("myCanvas");
		ctx.drawImage(this.data.imageUrl, 0, 0, 300, 300);
		ctx.drawImage("../../images/national-flag.jpg", 300, 300, -100, -60);

		ctx.draw();
	},
	addChristmas: function() {
		const ctx = wx.createCanvasContext("myCanvas");
		ctx.drawImage(this.data.imageUrl, 0, 0, 300, 300);
		ctx.drawImage("../../images/christmas.jpg", 300, 300, -80, -60);

		ctx.draw();
	},
	saveToAlbum: function() {
		wx.canvasToTempFilePath({
			canvasId: "myCanvas",
			fileType: "png",
			quality: 1.0,
			success: res => {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: res => {
						console.log("save Ok");
						wx.showToast({
							title: "已保存到本地相册"
						});
					}
				});
			}
		});
	}
});
