
var layer;
var form;
var tableInfo;
var tableIns;
var subIndex;
var act;
var upload;
var map = null;

$(function() {
	
	 layui.use(['layer'], function () {
		 layer = layui.layer;
	 });

	map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:11, //初始化地图层级
    });
	
	//获取并展示当前城市信息
//    function logMapinfo(){
//      map.getCity(function(info){
//    	  console.log(info)
//      });
//    }
//
//    logMapinfo();

    //绑定地图移动事件
    //map.on('moveend', logMapinfo);
    
    $("#searchBtn").click(function() {
    	var imei = $('#imei1').val();
    	search(imei);
    });

});

function open(title, dom, area) {
    if(undefined == area) area = ['500px', '450px'];
    subIndex = layer.open({
        title: title,
        type: 1,
        content: dom,
        area: area,
        end: function() {
            $("#form")[0].reset();
        }
    });
}

function search(imei) {
	var subLoadIndex = layer.load(2);
	$.ajax({
		url : '/business/online/queries.action',
		type : 'post',
		async : false,
		data : {deviceNum: imei, dataReturnType: 1},
		dataType : 'json',
		success : function(res) {
			layer.close(subLoadIndex);
			if (0 == res.code) {
				var data = res.data[0];
				var marker = createMarker(data.lng, data.lat);
				addMarker(marker);
				marker.on('click', function(event) {
					createInfo(data).open(map, [data.lng, data.lat]);
				});
			} 
		},
		error : function(xhr, e1, e2) {
			layer.close(subLoadIndex);
		}
	}); 
}

function createMarker(lng, lat) {
	var marker = new AMap.Marker({
		icon: imgUrl + "car/Offcar.png",
		position: [lng, lat]
	});
	return marker;
}

function addMarker(marker) {
	map.add(marker);
} 

function createInfo(data) {
	var content = "";
	content += '<div id="seat" class="layui-card">';
	content += '<div class="layui-card-header">位置信息</div>';
	content += '<div class="layui-card-body">';
	content += '设备编号:<span id="imei2">' + data.deviceNum + '</span><br>';
	content += '位置信息:<span id="seat2"></span><br>';
	content += '时间:<span id="time2">' + new Date(data.startTime).format() + '</span><br>';
	content += '</div>';
	content += '</div>';
	getSeat(data.lng, data.lat);
	var info = new AMap.InfoWindow({
		content: content,
		offset: new AMap.Pixel(0, -30),
		size: new AMap.Size(450, 150)
	});
	return info;
}

function getSeat(lng, lat) {
	AMap.plugin('AMap.Geocoder', function() {
		var geocoder = new AMap.Geocoder({});
		var lnglat = [lng, lat]
		geocoder.getAddress(lnglat, function(status, result) {
		    if (status === 'complete' && result.info === 'OK') {
		       seat = result.regeocode.formattedAddress;
		       $("#seat2").text(seat);
		    } 
		});
	});
}

