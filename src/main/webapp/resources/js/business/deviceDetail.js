
var layer;
var form;
var tableInfo;
var tableIns;
var tableIns1;
var tableIns2;
var tableIns3;
var tableIns4;
var tableIns5;
var tableIns6;
var subIndex;
var act;
var upload;
var element;

var map;
var geocoder;

var zuwangDeviceNum;
$(function() {
	
	map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:11, //初始化地图层级
    });
	
	geocoder = new AMap.Geocoder();
	var data = $("#data").val();
    data = JSON.parse(data);
    var id = data.id;
    var deviceNum = data.number;
    $("#deviceId1").text(deviceNum);
    if(data.img != "" && data.img != undefined) {
   	  $("#img2").attr("src", requestUrl + data.img);
    }
	//$("#img2").attr("src", requestUrl + data.img);
	var type = data.type;
	var nType = type;
	if(type == 1) {
		type = "中间设备";
	} else if(type == 2) {
		type = "起点设备";
	} else if(type == 3) {
		type = "终点设备";
	}
	var state = data.state;
	if(state == 0) {
		state = "离线";
	} else if(state == 1){
		state = "在线";
	}  else if(state == 2){
		state = "维修中";
	}  else if(state == 3){
		state = "已报废";
	}  else if(state == 4){
		state = "正常使用中";
	}
	var expState = data.expRemark;
	expState = expState == undefined ? "正常" : expState;
	$("#state").text(expState);
	$("#deviceType").text(type);
	var buyTime = data.buyTime;
	if(buyTime == undefined) {
		buyTime = "--";
	} else {
		buyTime = new Date(data.buyTime).format();
	}
	$("#buyTime").text(buyTime);
	$("#team").text(data.teamName);
	var leida = data.leida;
	if(leida == undefined) {
		leida = "正常";
	} else {
		leida = "异常";
	}
	$("#leida").text(leida);
	var gps = data.gps;
	if(gps == undefined) {
		gps = "正常";
	} else {
		gps = "异常";
	}
	$("#gps").text(gps);
    layui.use(['layer', 'table', 'laytpl', 'element'], function () {
        layer = layui.layer;
        tableInfo = layui.table;
        element = layui.element;
        
        tableIns3 = tableInfo.render({
            elem: '#onlineTable',
            height: 315,
            method: 'post',
            page: true, //开启分页
            limit: 20,
            limits: [10, 20, 30],
            cols: [[ //表头
            	{type: 'numbers', title: '序号', minWidth: 60, width : '20%',},	
            	{field: '',  title: '开机时间', minWidth: 100, width : '40%',templet: '<div>{{ new Date(d.startTime).format() }}</div>'},			
                {field: '', title: '开机地点', minWidth: 100, width: '40%',templet: '#addressTmp'},
            ]],
            done: function (res, curr, count) {
            	
            }
        });
        var marker;
        tableInfo.on('tool(onlineTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event;
            if("address" == layEvent) {
            	if(data.lng == undefined && data.lat == undefined) {
            		layer.msg("该设备没有位置信息");
					return;
				}
            	var lnglat = new AMap.LngLat(data.lng, data.lat);
            	/*geocoder.getAddress(lnglat, function(status, result) {
            		if (status === 'complete' && result.regeocode) {
            			var address = result.regeocode.formattedAddress;
            			layer.alert(address);   
            		} 
            	});*/
            	map.remove(map.getAllOverlays('marker'));
            	marker = createMarker(data.lng, data.lat, nType);
            	map.add(marker);
            	open("设备开机地点", $("#container"), ['40%', '50%']);
            }
        });
        
        tableIns4 = tableInfo.render({
        	elem: '#softVerTable',
        	height: 315,
        	method: 'post',
        	page: true, //开启分页
        	limit: 20,
        	limits: [10, 20, 30],
        	cols: [[ //表头
        		{field: 'version',  title: '当前版本', minWidth: 60, width : '20%'},			
        		{field: 'createTime', title: '升级时间', minWidth: 200, width: '40%',templet: '<div>{{ new Date(d.createTime).format() }}</div>'},
        		{field: 'preVersion', title: '升级前版本', minWidth: 200, width: '40%'},
    		]],
    		data: [{
				"version": "1.0",
				"createTime": 1552298400000,
				"preVersion": "0.9"
			}],
    		done: function (res, curr, count) {
    		}
        });
        
        var tableIns5 = tableInfo.render({
        	elem: '#hardVerTable',
        	height: 315,
        	method: 'post',
        	page: true, //开启分页
        	limit: 20,
        	limits: [10, 20, 30],
        	cols: [[ //表头
        		{field: 'version',  title: '当前版本',  minWidth: 60, width : '20%'},			
        		{field: 'createTime', title: '升级时间',  minWidth: 200, width : '40%',templet: '<div>{{ new Date(d.createTime).format() }}</div>'},
        		{field: 'preVersion', title: '升级前版本',  minWidth: 200, width : '40%'},
    		]],
    		data: [{
				"version": "1.0",
				"createTime": 1552298400000,
				"preVersion": "0.9"
			}],
    		done: function (res, curr, count) {
    		}
        });
        
        tableIns6 = tableInfo.render({
        	elem: '#jeevesTable',
        	height: 315,
        	method: 'post',
        	page: true, //开启分页
        	limit: 20,
        	limits: [10, 20, 30],
        	cols: [[ //表头
        		{type: 'numbers', title: '序号', minWidth: 60, width : '8%',},	
        		{field: 'deviceNum',  title: '设备编号',  minWidth: 140, width : '15%'},			
        		{field: 'number', title: '占道任务编号',  minWidth: 140, width : '13%'},
        		{field: 'road', title: '占道路段',  minWidth: 200, width : '10%'},
        		{field: 'startTime', title: '任务开始时间',  minWidth: 160, width : '17%',templet: '#startTmp'},
        		{field: 'endTime', title: '任务结束时间',  minWidth: 160, width : '17%',templet: '#endTmp'},
        		{field: 'timeRemark', title: '任务时长',  minWidth: 60, width : '10%'},
        		{field: 'count', title: '预警次数',  minWidth: 60, width : '10%'},
    		]],
    		data: [{
				"version": "1.0",
				"createTime": 1552298400000,
				"preVersion": "0.9"
			}],
    		done: function (res, curr, count) {
    			var data = res.data[0];
    			if(data != undefined) {
    				var startTime = data.startTime;
    				if(data.startTime == undefined) {
    					startTime = "--";
    				} else {
    					startTime = new Date(startTime).format()
    				}
    				$("#startTime").text(startTime);
    				var endTime = data.endTime;
    				if(endTime != undefined) {
    					endTime = new Date(endTime).format();
    				} else {
    					endTime = "--";
    				}
    				$("#endTime").text(endTime);
    			}
    		}
        });
        
        element.on('tab(change)', function(){
        	var layid = this.getAttribute('lay-id');
			$("#detail").siblings("div[type='tips']").remove();
        	if(layid == 2) {
        		tableIns3.reload({
        			url: '/business/online/queries.action',
            		where: {
            			deviceNum: deviceNum,
            		},
            	});
        	} else if(layid == 4) {
        		var data = [{
    				"version": "1.0",
    				"createTime": 1552298400000,
    				"preVersion": "0.9"
    			}];
        		tableIns4.reload({
        			data: data
        		});
        		tableIns5.reload({
        			data: data
        		});
        	} else if(layid == 3) {
        		tableIns6.reload({
        			url: '/business/jeeves/queries.action',
            		where: {
            			deviceNum: deviceNum,
            			dataReturnType: 3
            		},
        		});
        	}
        });
        tableIns6.reload({
    		url: '/business/jeeves/queries.action',
    		where: {
    			deviceNum: deviceNum,
    			dataReturnType: 3
    		},
    	})
        getLora(deviceNum, data.type);
        getKey(deviceNum);
    	queryOnline(data.number);
    });
    
    $("#zuwang, #zuwang1").click(function(){
    	layer.msg(zuwangDeviceNum);
    });
    
});

function open(title, dom, area) {
    if(undefined == area) area = ['300px', '200px'];
    layer.open({
        title: title,
        type: 1,
        shade: 0,
        content: dom,
        area: area,
        zIndex: 20000000,
    });
}

function queryOnline(deviceNum) {
	var act = '/business/online/queries.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		data: {
			deviceNum: deviceNum,
			dataReturnType: 1
		},
		dataType : 'json',
		success : function(res) {
			if (0 == res.code) {
				var data = res.data[0];
				if(data == undefined) {
					return;
				}
				var online = data.online;
				online = online == 1 ? "在线" : "离线";
				$("#online").text(online);
				var timeRemark = data.timeRemark;
				if(timeRemark == undefined) {
					timeRemark = "";
				}
				$("#timeRemark").text(data.timeRemark);
				var batt = data.batt;
				var battImg = "--";
				if(batt != undefined) {
					if(batt > 66) {
						battImg = 'batt1.png';
					} else if(batt > 33) {
						battImg = 'batt2.png';
					} else {
						battImg = 'bate3.png';
					}
					battImg = '<img alt="" src="../../../../resources/images/'+battImg+'" style="width:25%;">';
					$("#batt").append(battImg);
				} else {
					$("#batt").text(battImg);
				}
				var startTime = data.startTime;
				if(startTime != undefined) {
					startTime = new Date(startTime).format();
				} else {
					startTime = "--";
				}
				$("#onlineTime").text(startTime);
				if(data.lng == undefined && data.lat == undefined) {
					return;
				}
				var lnglat = new AMap.LngLat(data.lng, data.lat);
				geocoder.getAddress(lnglat, function(status, result) {
					if (status === 'complete' && result.regeocode) {
						var address = " " + result.regeocode.formattedAddress;
						if(data.pileNum) address += "("+data.pileNum+")";
						$("#location").text(address + "(" + data.lng + ", " + data.lat + ")");
					} 
				});
			}  else if("2001" != res.code) {
				layer.msg(res.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}

function getKey(deviceNum) {
	var act = '/business/device/queries.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		data: {
			number: deviceNum,
			dataReturnType: -1
		},
		dataType : 'json',
		success : function(res) {
			if (0 == res.code) {
				var data = res.data[0];
				if(data == undefined) {
					return;
				}
				var state = data.state;
				if(state == 1) {
					state = "占道"
				} else if(state == 2) {
					state = "封路"
				} else {
					state = "--";
				}
				$("#key").text(state);
			}  else if("2001" != res.code) {
				layer.msg(res.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}

function getLora(deviceNum, type) {
	var act = '/business/device/queries.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		data: {
			number: deviceNum,
			dataReturnType: -2
		},
		dataType : 'json',
		success : function(res) {
			if (0 == res.code) {
				var data = res.data;
				if(data == undefined) {
					return;
				}
				var loraText = "未组网";
				var deviceNum = "";
				zuwangDeviceNum = "";
				for(var i = 0, leg = data.length; i < leg; i++) {
					if(data[i].deviceType == 2) {
						deviceNum = data[i].deviceNum;
					}
					zuwangDeviceNum += data[i].deviceNum;
					if(i < leg - 1) {
						zuwangDeviceNum += ",";
					}
				}
				if(data.length > 0 && type == 2) {
					loraText = data.length;
					$("#zuwang").show();
				} else if(data.length > 0 && type != 2) {
					$("#zuwang").hide();
					loraText = "已组网,组网号:" + deviceNum;
				}
				$("#zuwang1").show();
				$("#lora").text(loraText);
				if(data.length > 0) {
					$("#zw").text("已组网,组网号:" + deviceNum + "，组网数量:" + data.length);
				} else {
					$("#zw").text(loraText);
					$("#zuwang1").hide();
				}
			}  else if("2001" != res.code) {
				layer.msg(res.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}
function getNoLora() {
	var loraText = "未组网";
	$("#zw").text(loraText);
	$("#zuwang1").hide();
	$("#lora").text(loraText);

}

function createMarker(lng, lat, type) {
	var icon = imgUrl + "/jeeves/";
	if(type == 1) {
		icon += "one_alarm_green.png";
	} else if(type == 2 || type == 3) {
		icon += "two_alarm_green.png";
	}
	map.setCenter([lng, lat]);
	var marker = new AMap.Marker({
		icon: icon,
		position: [lng, lat]
	});
	return marker;
}

