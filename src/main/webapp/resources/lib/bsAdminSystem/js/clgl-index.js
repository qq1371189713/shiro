$(function () {
	// 百度地图API功能
	var map = new BMap.Map("allmap");    // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放


	var testData = [
		{
			id: 35,
			info: "渤海钻探第二固井",
			children: [
				{
					info: "张大三/粤B44445/864221030209626",
					imei: "864221030209626",
					driverName: "张大三",
					id: 188,
					carLicense: "粤B44445"
				},
				{
					info: "李小四/粤B44446/864221030209629",
					imei: "864221030209629",
					driverName: "李小四",
					id: 189,
					carLicense: "粤B44446"
				},
				{
					info: "王东五/粤B44447/864221030209630",
					imei: "864221030209630",
					driverName: "王东五",
					id: 190,
					carLicense: "粤B44447"
				}
			]
		},
		{
			id: 63,
			info: "丰登1号",
			children: [
				{
					info: "赵南六/粤BQQ446/864221030209631",
					imei: "864221030209631",
					driverName: "赵南六",
					id: 191,
					carLicense: "粤BQQ446"
				},
				{
					info: "孙西七/湘F45596/301234567899860",
					imei: "301234567899860",
					driverName: "孙西七",
					id: 196,
					carLicense: "湘F45596"
				},
				{
					info: "周北八/湘F57449/301234567899838",
					imei: "301234567899838",
					driverName: "周北八",
					id: 199,
					carLicense: "湘F57449"
				}
			]
		},
		{
			id: 55,
			info: "测试车队没有车",
			children: [
			]
		}
	];

	var test = new bsSelectorPlugin('#testSelector', testData);

});