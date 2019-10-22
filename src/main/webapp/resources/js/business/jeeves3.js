
var layer;
var form;
var tableInfo;
var tableIns;
var subIndex;
var act;

var map = null;
var map1 = null;
var district;
var polygons = [];

var markerMap = new Map();
var onlineMap = new Map();
var geocoder;
var pileList = new Array();
var pileArr = [];
var devTypeMap = new Map();

$(function() {
	var pile1 = {
		lng: 114.024492,
		lat: 22.555402,
		state: "其他路况"
	};
	pileArr.push(pile1);
	pile1 = {
		lng: 113.973165,
		lat: 22.555561,
		state: "交通管制"
	};
	pileArr.push(pile1);
	pile1 = {
		lng: 113.948446,
		lat: 22.5749,
		state: "交通事故"
	};
	pileArr.push(pile1);
	pile1 = {
		lng: 114.047667,
		lat: 22.550488, 
		state: "道路施工"
	};
	pileArr.push(pile1);
	
	geocoder = new AMap.Geocoder();
	map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 16, //初始化地图层级
    });
	
	map1 = new AMap.Map('container1', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 16, //初始化地图层级
    });

    layui.use(['layer', 'form', 'table', 'laydate', 'laytpl'], function () {
        layer = layui.layer;
        form = layui.form;
        tableInfo = layui.table;
        var laydate = layui.laydate;
        laydate.render({
	        elem: '#time',
	        //range: true,
	    });
        //执行一个laydate实例
        laydate.render({
          elem: '#startTime',
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss'
        });
        laydate.render({
		    elem: '#endTime',
		    type: 'datetime',
		    format: 'yyyy-MM-dd HH:mm:ss'
		});
        //第一个实例
        tableIns = tableInfo.render({
            elem: '#jeevesTable',
            height: 'full-185',
            method: 'post',
            url: '/business/jeeves/queries.action', //数据接口
            page: true, //开启分页
            limit: 20,
            limits: [10, 20, 30],
            cols: [[ //表头
            	{field: 'number', title: '占道编号', width: '15%'},
            	{field: 'road', title: '占道路段', width: '14%'},
            	{field: 'type', title: '占道类型', width: '11%', templet:'#typeTmp' },
                {field: 'state', title: '占道状态', width: '12%', templet:'#stateTmp' },
                {field: '', title: '开始时间', width: '14%' ,templet: '<div>{{ new Date(d.startTime).format() }}</div>'},
                {field: '', title: '结束时间', width: '14%' ,templet: '<div>{{ new Date(d.endTime).format() }}</div>'},
                {field: 'address', title: '预警', width: '10%'},
                {field: 'id', title: '操作', width: '10%', templet: opBar}
            ]],
            //skin: 'nob',
            done: function (res, curr, count) {
            	var jeeIds = "";
            	var data = res.data;
            	for(var i = 0, leg = data.length; i < leg; i++) {
            		jeeIds += data[i].number;
            		if(i < leg - 1) {
            			jeeIds += ",";
            		}
            	}
            	queryDevice(jeeIds);
            	queryWarn(jeeIds);
            }
        });
        //tableIns.resize('jeevesTable');
        //监听工具条
        tableInfo.on('tool(jeevesTable)', function (obj) { //注：tool是工具条事件名，test是tabl的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event;
            if("edit" == layEvent) {
                form.val("jeeves", data);
                $("#startTime").val(new Date(data.startTime).format());
                $("#endTime").val(new Date(data.endTime).format());
                open("占道记录编辑", $("#operate"));
                act = 1;
            } else if("del" == layEvent) {
            	act = 2;
            	var data = {id: data.id};
            	sub(act, data);
            } else if('detail' == layEvent) {
            	layer.open({
					type : 2,
					closeBtn : 2,
					title : '占道详情',
					anim : 0,
					area : ['98%', '97%'],
					content : '/business/jeeves/detail.action?id=' + data.id
				});
            }
        });
        
      //验证格式
		form.verify({
			IMEI : [/^\d{15}$/,'IMEI输入有误，IMEI为15位数字'],
			blank: [/^[^\s]*$/,'不能出现空格'],
			normal : [/^$|^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,'不能输入_以外的特殊字符且不能以_开头或结尾'],
			mac: [/[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/, 'MAC地址输入有误']
		});

        form.on('submit(submit)', function(data){
            sub(act, data.field);
            return false;
        });

    });
    
    $("#searchBtn").click(function() {
    	var time = $("#time").val();
    	var startTime;
    	var endTime;
    	if(time.length > 0) {
    		startTime = time + " 00:00:00";
        	endTime = time + " 23:59:59";
    	}
    	
    	tableIns.reload({where : {
    		number: $("#searchText").val(),
    		startTime: startTime,
    		endTime: endTime,
    		state : $('#state').val(),
    		type : $('#type1').val(),
    		warnState : $('#warnState').val(),
		},page: {
		    curr: 1 //重新从第 1 页开始
		  }
		});
    });

    $("#addBtn").click(function() {
        open("占道记录新增", $("#operate"));
        act = 0;
    });
    
    queryCount();
    
    var opts = {
		subdistrict: 0,   //获取边界不需要返回下级行政区
	    extensions: 'all',  //返回行政区边界坐标组等具体信息
	    level: 'city'  //查询行政级别为 市
	};
	district = new AMap.DistrictSearch(opts);
	drawBounds('深圳市', 17, map);
        
	queryPile(pileArr);
	
	var jCount = 0;
	var wCount = 0;
	var fCount = 0;
	
	$(".up-map-div").click(function() {
        $(this).toggleClass("up-map-div1");
    });
	
	$(".jeeves1").click(function() {
        $(this).toggleClass("jeeves2");
    });
	
	$(".warn1").click(function() {
        $(this).toggleClass("warn2");
    });
	
	$("#jeeves").click(function(){
		jCount++;
		if(jCount % 2 == 1) {
			if(pileList.length > 0) {
				map.remove(pileList);
			}
		} else {
			queryPile(pileArr);
		}
	});
	
	$("#warn").click(function(){
		wCount++;
		if(wCount % 2 == 1) {
			var markers = markerMap.values();
			if(markers.length > 0) {
				map.remove(markers);
			}
		} else {
			var markers = markerMap.values();
			for(var i = 0, leg = markers.length; i < leg; i++) {
				var marker = markers[i];
				addMarker(marker);
			}
		}
	});
	
	$("#full, #full1").click(function(){
		fCount++;
		if(fCount % 2 == 1) {
			$("#map").hide();
			$("#container1").show();
			drawBounds('深圳市', 16, map1);
			$("#up-map-div").hide();
			$("#up-map-div1").show();
		} else {
			$("#map").show();
			$("#container1").hide();
			$("#up-map-div").show();
			$("#up-map-div1").hide();
		}
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
            $("#subDiv").show();
        }
    });
}

function queryDevice(ids) {
	var act = '/business/device/queries.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		data: {
			jeevesNums: ids,
			dataReturnType: 1
		},
		dataType : 'json',
		success : function(res) {
			if (0 == res.code) {
				var deviceNumArr = "";
				var data = res.data;
				if(devTypeMap.size > 0) {
					devTypeMap.clear();
				}
	    		for(var i = 0, leg = data.length; i < leg; i++) {
	    			deviceNumArr += data[i].number;
	        		if(i < leg - 1) {
	        			deviceNumArr += ",";
	        		}
	        		devTypeMap.put(data[i].number, data[i].type);
	        	}
	    		queryOnline(deviceNumArr);
			}  else if("2001" != res.code) {
				layer.msg(res.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}

function queryWarn(jeevesNum) {
	var act = '/business/warn/queries.action';
	var data;
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		data: {
			jeevesNums: jeevesNum,
			dataReturnType: 2
		},
		dataType : 'json',
		success : function(res) {
			if (0 == res.code) {
				var data = res.data;
				var removeMke = [];
				for(var i = 0, leg = data.length; i < leg; i++) {
					var track = data[i];
					console.log(track)
					var marker = markerMap.get(track.deviceNum);
					markerMap.remove(track.deviceNum);
					removeMke.push(marker);
					marker = createMarker(track.lng, track.lat, devTypeMap.get(track.deviceNum), true);
					marker.deviceNum = track.deviceNum;
					marker.lng = track.lng;
					marker.lat = track.lat;
					markerMap.put(track.deviceNum, marker);
					addMarker(marker);
					marker.on('click', function(event) {
						createInfo(this).open(map, [track.lng, track.lat]);
					});
				}
				map.remove(removeMke);
			}  else if("2001" != res.code) {
				layer.msg(res.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}

function queryOnline(deviceNumArr) {
	var act = '/business/online/queries.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		data: {
			deviceNumArr: deviceNumArr,
			dataReturnType: 2
		},
		dataType : 'json',
		success : function(res) {
			if (0 == res.code) {
				var markers = markerMap.values();
				if(markers.length > 0) {
					map.remove(markers);
					markerMap.clear();
				}
				var data = res.data;
				for(var i = 0, leg = data.length; i < leg; i++) {
					var track = data[i];
					var marker = createMarker(track.lng, track.lat, devTypeMap.get(track.deviceNum), false);
					marker.deviceNum = track.deviceNum;
					marker.lng = track.lng;
					marker.lat = track.lat;
					marker.devType = devTypeMap.get(track.deviceNum);
					markerMap.put(track.deviceNum, marker);
					addMarker(marker);
					marker.on('click', function(event) {
						createInfo(this).open(map, [track.lng, track.lat]);
					});
				}
				var onlines = onlineMap.values();
				if(onlines.length > 0) {
					onlineMap.clear();
				}
				for(var i = 0; i < leg; i++) {
					var online = data[i];
					onlineMap.put(online.deviceNum, online);
				}
			}  else if("2001" != res.code) {
				layer.msg(res.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}

function queryPile(pileArr) {
	if(pileList.length > 0) {
		map.remove(pileList);
	}
	for(var i = 0, leg = pileArr.length; i < leg; i++) {
		var data = pileArr[i];
		var pileMarker = createPileMarker(data.lng, data.lat);
		pileMarker.data = data;
		pileList.push(pileMarker);
		addMarker(pileMarker);
		pileMarker.on('click', function(event) {
			createPileInfo(this.data).open(map, [data.lng, data.lat]);
		});
	}
}


function queryCount() {
	var date = new Date();
	var prebTime = date.format();
	var startTime = date.format("yyyy-MM-dd");
	var endTime = startTime + " 23:59:59";
	startTime += " 00:00:00";
	var act = '/business/jeeves/queryCount.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		data: {
			prebTime: prebTime,
			startTime: startTime,
			endTime: endTime
		},
		dataType : 'json',
		success : function(res) {
			if (0 == res.code) {
				$("#count1").text(res.count1);
			    $("#count2").text(res.count2 - res.count1);
			    $("#count3").text(res.count3);
			}  else if("2001" != res.code) {
				layer.msg(res.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}

function sub(subFlag, data) {
	var act = "";
	var msg = "确认新增吗?";
	if (0 == subFlag) {
		//后台校验重复提交标示
		act = '/business/jeeves/inserts.action';
	} else if(1 == subFlag){
		act = '/business/jeeves/updates.action';
		msg = "确认修改吗?";
	} else if(2 == subFlag){
		act = '/business/jeeves/deletes.action';
		msg = "确认删除吗?";
	}
	layer.confirm(msg, {icon: 3, title:'提示'}, function(index){
		var subLoadIndex = layer.load(2);
		$.ajax({
			url : act,
			type : 'post',
			async : false,
			data : data,
			dataType : 'json',
			success : function(res) {
				if (0 == res.code) {
					if (0 == subFlag) {
						tableIns.reload({page: {curr: 1}});
					} else {
						tableIns.reload();
					}
					layer.msg(res.msg,{icon: 6});
					layer.close(subIndex);
				}  else if("2001" != res.code) {
					layer.msg(res.msg, {anim : 6,icon: 5});
				}
				layer.close(subLoadIndex);
			},
			error : function(xhr, e1, e2) {
				layer.close(subLoadIndex);
			}
		}); 
	});
}

function drawBounds(name, level, map) {
	if(level != undefined) {
		district.setLevel(level);
	}
    district.search(name, function(status, result) {
        map.remove(polygons)//清除上次结果
        polygons = [];
        var bounds = result.districtList[0].boundaries;
        if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
                //生成行政区划polygon
                var polygon = new AMap.Polygon({
                    strokeWeight: 1,
                    path: bounds[i],
                    fillOpacity: 0.4,
                    fillColor: '#80d8ff',
                    strokeColor: '#0091ea'
                });
                polygons.push(polygon);
            }
        }
        map.add(polygons)
        map.setFitView(polygons);//视口自适应
    });
}

function createMarker(lng, lat, type, warning) {
	var icon = imgUrl;
	if(type == 1) {
		if(warning) {
			icon += "jeeves/one_alarm_red.png";
		} else {
			icon += "jeeves/one_alarm_green.png";
		}
	} else if(type == 2) {
		if(warning) {
			icon += "jeeves/two_alarm_red.png";
		} else {
			icon += "jeeves/two_alarm_green.png";
		}
	}
	var marker = new AMap.Marker({
		icon: icon,
		position: [lng, lat]
	});
	return marker;
}

function createPileMarker(lng, lat) {
	var marker = new AMap.Marker({
		icon: imgUrl + "jeeves/icon_build.png",
		position: [lng, lat]
	});
	return marker;
}

function addMarker(marker) {
	map.add(marker);
}

function createInfo(data) {
	var deviceNum = data.deviceNum;
	var track = markerMap.get(deviceNum)
	var lnglat = new AMap.LngLat(track.lng, track.lat);
	geocoder.getAddress(lnglat, function(status, result) {
		if (status === 'complete' && result.regeocode) {
			var address = result.regeocode.formattedAddress;
			$("#location").text(address);
		} 
	});
	var online = onlineMap.get(deviceNum);
	var onlineText = online.status == 1 ? "在线" : "离线";
	var content = "";
	content += "<div><div style='padding-top:15px;'>";
	content += "<span style='color:red'>预警中(侧方撞倒)</span><br><br>";
	content += "设备编号: " + deviceNum + "<br>";
	content += "当前状态: " + onlineText + "<br>";
	content += "设备位置: <span id='location'></span><br>";
	content += "设备电量：" + online.batt + "%<br>";
	content += "使用时长：" + online.timeRemark + "<br>";
	content += "预警记录：5<br>";
	var imei = "123456789100000";
	content += "<a href='javascript:void(0)' style='color: #01AAED;' onclick='detail(\"" + deviceNum + "\")'>查看设备详情</a><br>";
	content += "维修记录：5<br>";
	content += "</div></div>";
	var info = new AMap.InfoWindow({
		content: content,
		offset: new AMap.Pixel(0, -30),
		size: new AMap.Size(350, 260)
	});
	return info;
}

function createPileInfo(data) {
	var state = data.state;
	var content = "";
	content += "<div><div style='padding-top:15px;'>";
	content += "占道:" + state + "<br>";
	content += "</div></div>";
	var info = new AMap.InfoWindow({
		content: content,
		offset: new AMap.Pixel(0, -30),
		size: new AMap.Size(160, 80)
	});
	return info;
}

function detail(deviceNum) {
	layer.open({
		type : 2,
		closeBtn : 2,
		title : '设备详情',
		anim : 0,
		area : ['800px', '600px'],
		content : '/business/device/detail.action?number=' + deviceNum
	});
}
