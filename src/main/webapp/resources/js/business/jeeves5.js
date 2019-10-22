

	
	


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
var jeevesMap = new Map();
var jeevesDeviceMap = new Map();
var devTypeMap = new Map();
var pileMap = new Map();
var newJeeMap = new Map();


var geocoder;
var driving;
var pileList = new Array();
var pileArr = [];


var queryAll = 0;


var jeevesSet = new Set();
var allTask = [];
var newTask=[];
var reload = false;

$(function() {
	
	var pile1 = {
		lng: 114.024492,
		lat: 22.555402,
		state: "其他路况",
		type: 0
	};
	pileArr.push(pile1);
	pile1 = {
		lng: 113.973165,
		lat: 22.555561,
		state: "交通管制",
		type: 0
	};
	pileArr.push(pile1);
	pile1 = {
		lng: 114.160858,
		lat: 22.606039,
		state: "交通事故",
		type: 1
	};
	pileArr.push(pile1);
	pileMap.put("1", pile1);
	pile1 = {
		lng: 114.159469,
		lat: 22.60641, 
		state: "道路施工",
		type: 1
	};
	pileArr.push(pile1);
	pileMap.put("2", pile1);
	//localStorage.removeItem("jeeves");
	geocoder = new AMap.Geocoder();
	initMap('container');
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
            where: {
            	state : $('#state').val()
            },
            cols: [[ //表头
            	{field: 'number', title: '占道编号', width: '15%'},
            	{field: 'road', title: '占道路段', width: '14%'},
            	{field: 'type', title: '占道类型', width: '10%', templet:'#typeTmp' },
                {field: 'state', title: '占道状态', width: '10%', templet:'#stateTmp' },
                {field: '', title: '开始时间', width: '14%' ,templet: '<div>{{ new Date(d.startTime).format() }}</div>'},
                {field: '', title: '结束时间', width: '14%' ,templet: '#endTimeTmp'},
                {field: 'warnType', title: '预警', width: '6%', templet: '#warnTypeTmp'},
                {field: 'id', title: '操作', width: '17%', templet: opBar}
            ]],
            done: function (res, curr, count) {
            	queryCount();
            	var jeeIds = "";
            	var data = res.data;
            	var jeevesStore = localStorage.getItem("jeeves");
            	console.log(jeevesStore)
            	for(var i = 0, leg = data.length; i < leg; i++) {
            		if(data[i].state == 1) {
            			if(jeevesStore == null) {
            				jeevesStore = "";
            			} 
            			var isNew = 0;
            			console.log(data[i].number)
            			console.log(jeevesStore.indexOf(data[i].number))
            			if(jeevesStore.indexOf(data[i].number) == -1) {
            				jeevesStore += data[i].number + ",";
                			localStorage.setItem("jeeves", jeevesStore);
                			isNew = 1;
            			}
            			jeeIds += data[i].number;
                		if(i < leg - 1) {
                			jeeIds += ",";
                		}
                		console.log(jeevesStore)
                		jeevesMap.put(data[i].number, data[i].type);
                		console.log(data[i].number + " " + isNew)
                		newJeeMap.put(data[i].number, isNew)
            		}
            	}
            	queryDevice(jeeIds);
            	setTimeout(function() {
            		queryWarn(jeeIds);
            	}, 1000);
            }
        });
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
            } else if("unjeeves" == layEvent) {
            	act = 3;
            	var data = {id: data.id, number: data.number, state: 0, endTime: new Date().format()};
            	//sub(act, data);
            	var markers = markerMap.values();
            	console.log(markers.length)
            	/*for(var i = 0; i < markers.length; i++) {
            		console.log(markers[i])
            		console.log(markers[i])
            		map.remove(markers[i]);
            	}*/
            
            }
        });
        
        tableInfo.on('row(jeevesTable)', function (obj){
        	var data = obj.data; //获得当前行数据
        	var layEvent = obj.event;
        	if("detail" == layEvent || "unjeeves" == layEvent) {
        		return;
        	}
        	var set = jeevesDeviceMap.get(data.number);
        	if(set.size() < 2) {
        		return;
        	}
        	var dataStore = set.dataStore;
        	var lng1 = dataStore[0].lng;
        	var lat1 = dataStore[0].lat;
        	var lng2 = dataStore[dataStore.length - 1].lng;
        	var lat2 = dataStore[dataStore.length - 1].lat;
        	var point1 = new AMap.LngLat(lng1, lat1);
        	var point2 = new AMap.LngLat(lng2, lat2);
        	var cPoint = new AMap.LngLat((lng1 + lng2) / 2, (lat1 + lat2) / 2);
          	map.setCenter(cPoint);
          	map.setZoom(13);
          	driving = new AMap.Driving({
                map: map,
                panel: "panel"
            }); 
          	driving.search(point1, point2, function(status, result) {
                // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                if (status === 'complete') {
        			console.log(result)
                    console.log('绘制驾车路线完成')
                } else {
                	console.log('获取驾车数据失败：' + result)
                }
            });
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
    
    /*setInterval("search()", 5000);*/
    
    $("#searchBtn, #searchBtn1").click(function() {
    	search();
    });

    $("#addBtn").click(function() {
        open("占道记录新增", $("#operate"));
        act = 0;
    });
    
    //queryCount();
    
	var jCount = 0;
	var wCount = 0;
	var jCount1 = 0;
	var wCount1 = 0;
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
	
	$("#jeeves1").click(function(){
		jCount1++;
		if(jCount1 % 2 == 1) {
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
	
	$("#warn1").click(function(){
		wCount1++;
		if(wCount1 % 2 == 1) {
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
		$(".jeeves1").removeClass("jeeves2");
		$(".warn1").removeClass("warn2");
		if(fCount % 2 == 1) {
			$("#map").hide();
			$("#container1").show();
			$("#top1").show();
			$("#up-map-div").hide();
			$("#up-map-div1").show();
			initMap('container1');
			drawBounds('深圳市', 16, map);
			queryAll = 1;
			search();
			queryPile(pileArr);
			jCount1 = 0;
			wCount1 = 0;
		} else {
			$("#map").show();
			$("#container1").hide();
			$("#top1").hide();
			$("#up-map-div").show();
			$("#up-map-div1").hide();
			initMap('container');
			drawBounds('深圳市', 16, map);
			queryAll = 0;
			search();
			queryPile(pileArr);
			jCount = 0;
			wCount = 0;
		}
	});
	
});

function search() {
	var time = $("#time").val();
	var startTime;
	var endTime;
	if(time.length > 0) {
		startTime = time + " 00:00:00";
    	endTime = time + " 23:59:59";
	}
	var where = {
		number: $("#searchText").val(),
		startTime: startTime,
		endTime: endTime,
		state : $('#state').val(),
		type : $('#type1').val(),
		warnState : $('#warnState').val(),
		
	};
	if(queryAll == 1) {
		where.page = 0;
		where.limit = 0;
	}
	tableIns.reload({where : where, page: {
	    curr: 1 //重新从第 1 页开始
	  }
	});
}

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
				if(data.length <= 0) {
					return;
				}
				if(devTypeMap.size > 0) {
					devTypeMap.clear();
				}
				var devices = new Array();
				var leg = data.length;
				devices.push(data[0].number);
				devTypeMap.put(data[0].number, data[0]);
				if(leg > 1) {
					devices.push(data[leg - 1].number);
					devTypeMap.put(data[leg - 1].number, data[leg - 1]);
				}
	    		for(var i = 0, leg = devices.length; i < leg; i++) {
	    			deviceNumArr += devices[i];
	        		if(i < leg - 1) {
	        			deviceNumArr += ",";
	        		}
	        		var set = jeevesDeviceMap.get(data[i].jeevesNum);
		    		if(set == null) {
		    			set = new Set();
		    			jeevesDeviceMap.put(data[i].jeevesNum, set);
		    		}
		    		set.add(data[i].number);
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
				var leg = data.length;
				var isNJee = null;
				for(var i = 0; i < leg; i++) {
					var track = data[i];
					console.log(track.deviceNum)
					var device = devTypeMap.get(track.deviceNum);
					var jeevesType = jeevesMap.get(device.jeevesNum);
					isNJee = newJeeMap.get(device.jeevesNum);
					console.log("isNJee" + isNJee + " " + track.deviceNum)
				    console.log("a0 " + markerMap.size());
					var marker = markerMap.get(track.deviceNum);
					console.log("marker1:" + marker)
					console.log("marker != null && track.deviceNum != marker.deviceNum" + (marker != null && track.deviceNum != marker.deviceNum))
					/*if((marker != undefined || marker != null) && track.deviceNum != marker.deviceNum) {
						console.log("isNJee" + isNJee + " " + marker.deviceNum)
						map.remove(marker);
						markerMap.remove(track.deviceNum);
					}*/
				
					if(isNJee == 1) {
						marker = createDyMarker(track.lng, track.lat, jeevesType);
					} else {
						marker = createNoDyMarker(track.lng, track.lat, jeevesType);
					}
					console.log("isNJee:" + isNJee + " " + track.deviceNum)
					marker.jeevesNum = device.jeevesNum;
					marker.deviceNum = track.deviceNum;
					console.log("marker3:" + marker)
					marker.isNJee = isNJee;
					marker.lng = track.lng;
					marker.lat = track.lat;
					marker.jeevesType = jeevesType;
					marker.devType = devTypeMap.get(track.deviceNum);
					marker.warning = false;
					markerMap.put(track.deviceNum, marker);
					console.log(markerMap.get(track.deviceNum))
					console.log("a2 " + markerMap.size());
					map.add(marker);
					marker.on('click', function(event) {
						createInfo(this).open(map, [marker.lng, marker.lat]);
					});
				}
				setTimeout(function(){
					var markers = markerMap.values();
					for(var i = 0; i < leg; i++) {
						var track = data[i];
						var device = devTypeMap.get(track.deviceNum);
						var jeevesType = jeevesMap.get(device.jeevesNum);
						var isNJee = newJeeMap.get(device.jeevesNum);
						console.log("isNJee2:" + isNJee)
						if(i == 0 && isNJee == 1) {
							markerMap.clear();
						}
						if(isNJee == 1) {
							console.log("------")
							var marker = createNoDyMarker(track.lng, track.lat, jeevesType);
							marker.jeevesNum = device.jeevesNum;
							marker.deviceNum = track.deviceNum;
							marker.isNJee = newJeeMap.get(device.jeevesNum);
							marker.lng = track.lng;
							marker.lat = track.lat;
							marker.jeevesType = jeevesType;
							marker.devType = devTypeMap.get(track.deviceNum);
							marker.warning = false;
							markerMap.put(track.deviceNum, marker);
							console.log("a4 " + markerMap.size());
							map.add(marker);
							marker.on('click', function(event) {
								createInfo(this).open(map, [marker.lng, marker.lat]);
							});
						}
						newJeeMap.remove(device.jeevesNum);
					}
					if(isNJee == 1) {
						//map.remove(markers);
					}
				}, 2000);
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

function setMark(){
	
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
				var leg = data.length;
				if(leg > 0) {
					var markers = markerMap.values();
					map.remove(markers);
					markerMap.clear();
					console.log(markers.length)
					for(var i = 0, leg = markers.length; i < leg; i++) {
						var marker = markers[i];
						if(marker != null) {
							map.remove(marker);
						}
						var marker1 = createWnMarker(marker.lng, marker.lat);
						marker1.deviceNum = marker.deviceNum;
						marker1.lng = marker.lng;
						marker1.lat = marker.lat;
						marker1.isNJee = marker.isNJee;
						marker1.jeevesNum = marker.jeevesNum;
						marker1.jeevesType = marker.jeevesType;
						markerMap.put(marker1.deviceNum, marker1);
						map.add(marker1);
						marker1.on('click', function(event) {
							createInfo(this).open(map, [marker1.lng, marker1.lat]);
						});
					}
					/*setTimeout(function() {
						var markers = markerMap.values();
						map.remove(markers);
						markerMap.clear();
						for(var i = 0, leg = markers.length; i < leg; i++) {
							var marker = markers[i];
							var jeevesType = marker.jeevesType;
							var marker1 = createNoDyMarker(marker.lng, marker.lat, jeevesType);
							marker1.deviceNum = marker.deviceNum;
							marker1.lng = marker.lng;
							marker1.lat = marker.lat;
							marker1.isNJee = marker.isNJee;
							marker1.jeevesNum = marker.jeevesNum;
							marker1.jeevesType = marker.jeevesType;
							markerMap.put(marker1.deviceNum, marker1);
							map.add(marker1);
							marker1.on('click', function(event) {
								createInfo(this).open(map, [marker1.lng, marker1.lat]);
							});
						}
					}, 1000);*/
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
	console.log(pileArr[0])
	if(pileList.length > 0) {
		map.remove(pileList);
	}
	for(var i = 0, leg = pileArr.length; i < leg; i++) {
		var data = pileArr[i];
		var pile1 = pileMap.get(data.bsTake);
    	var pileMarker = createPileMarker(pile1.lng, pile1.lat, data.type);
		pileMarker.data = data;
		pileList.push(pileMarker);
		addMarker(pileMarker);
		pileMarker.on('click', function(event) {
			createPileInfo(this.data).open(map, [pile1.lng, pile1.lat]);
		});
    	var pile2 = pileMap.get(data.esTake);
		pileMarker = createPileMarker(pile2.lng, pile2.lat, data.type);
		pileMarker.data = data;
		pileList.push(pileMarker);
		addMarker(pileMarker);
		pileMarker.on('click', function(event) {
			createPileInfo(this.data).open(map, [pile2.lng, pile2.lat]);
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
	} else if(3 == subFlag){
		act = '/business/jeeves/updates.action';
		msg = "确认解除吗?";
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

function initMap(container) {
	if(null != map) {
		map.destroy();
	}
	map = new AMap.Map(container, {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 16, //初始化地图层级
    });
	/*var styleName = "amap://styles/dark";
	map.setMapStyle(styleName);*/
	var opts = {
		subdistrict: 0,   //获取边界不需要返回下级行政区
	    extensions: 'all',  //返回行政区边界坐标组等具体信息
	    level: 'city'  //查询行政级别为 市
	};
	district = new AMap.DistrictSearch(opts);
	drawBounds('深圳市', 17, map);
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
                    fillColor: '#f2f2f2',
                    strokeColor: '#0091ea'
                });
                polygons.push(polygon);
            }
        }
        map.add(polygons)
        map.setFitView(polygons);//视口自适应
    });
}

function createDyMarker(lng, lat, type) {
	var icon = imgUrl;
	if(type == 0) {
		icon += "jeeves/02.gif";
	} else if(type == 1) {
		icon += "jeeves/01.gif";
	}
	//icon += "jeeves/01.gif";
	var marker = new AMap.Marker({
		icon: icon,
		position: [lng, lat],
		offset: {x: -25,y: -25}
	});
	return marker;
}

function createNoDyMarker(lng, lat, type) {
	var icon = imgUrl;
	if(type == 0 || type == 3) {
		icon += "jeeves/icon_seal.png";
	} else if(type == 1 || type == 4) {
		icon += "jeeves/icon_build.png";
	}
	var marker = new AMap.Marker({
		icon: icon,
		position: [lng, lat],
		offset: {x: -12,y: -12}
	});
	return marker;
}

function createWnMarker(lng, lat) {
	var icon = imgUrl;
	icon += "jeeves/04.gif";
	var marker = new AMap.Marker({
		icon: icon,
		position: [lng, lat],
		offset: {x: -24,y: -24}
	});
	return marker;
}

function createMarker(lng, lat, type, warning) {
	var icon = imgUrl;
	if(type == 0) {
		icon += "jeeves/02.gif";
	} else if(type == 1) {
		icon += "jeeves/01.gif";
	} else if(type == 3) {
		icon += "jeeves/icon_build.png";
	} else if(type == 4) {
		icon += "jeeves/icon_seal.png";
	} else if(type == 5) {
		icon += "jeeves/icon_seal.png";
	} else if(type == 6) {
		icon += "jeeves/03.gif";
	}
	var marker = new AMap.Marker({
		icon: icon,
		position: [lng, lat],
		offset: {x: -12,y: -12}
	});
	return marker;
}

function createPileMarker(lng, lat, type) {
	var icon = imgUrl;
	if(type == 0) {
		icon += "jeeves/icon_build.png";
	} else if(type == 1) {
		icon += "jeeves/icon_seal.png";
	}
	var marker = new AMap.Marker({
		icon: icon,
		position: [lng, lat],
		offset: {x: -12,y: -12}
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
	if(data.warning) {
		var type = data.warnType;
		if(type == 0) {
			type = "侧方闯入";
		} else if(type == 1) {
			type = "后方闯入";
		}
		content += '<span style="color:red">预警中(' + type + ')</span><br><br>';
	}
	content += "设备编号: " + deviceNum + "<br>";
	content += "当前状态: " + onlineText + "<br>";
	content += "设备位置: <span id='location'></span><br>";
	content += "设备电量：" + online.batt + "%<br>";
	content += "使用时长：" + online.timeRemark + "<br>";
	content += "预警记录：5<br>";
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
	console.log(data)
	var content = "";
	content += "<div><div style='padding-top:15px;'>";
	var devices = jeevesDeviceMap.get(data.number).dataStore;
	var size = devices.length;
	for(var i = 0; i < size; i++) {
		var markder = markerMap.get(devices[i]);
		if(undefined != markder.warning && markder.warning) {
			var type = markder.warnType;
			if(type == 0) {
				type = "侧方闯入";
			} else if(type == 1) {
				type = "后方闯入";
			}
			content += '<span style="color:red">预警中(' + type + ')</span><br><br>';
			break;
		}
	}
	var type = data.type;
	if(type == 0) {
		type = "施工封闭"
	} else if(type == 1) {
		type = "施工占道"
	} else if(type == 2) {
		type = "事故占道"
	} else if(type == 3) {
		type = "事故封闭"
	}
	var state = data.state;
	if(state == 0) {
		state = "已结束";
	} else if(state == 1) {
		state = "占道中";
	} else if(state == 2) {
		state = "未占道";
	}
	content += "占道类型:" + type + "<br>";
	content += "占道状态:" + state + "<br>";
	content += "占道编号:" + data.number + "<br>";
	content += "占道路段:" + data.road + "<br>";
	content += "开始时间:" + data.prebTime.substr(0, data.prebTime.length - 2) + "<br>";
	content += "结束时间:" + data.preeTime.substr(0, data.preeTime.length - 2) + "<br>";
	/*content += "占道设备:" + size + "<br>";*/
	content += "<a href='javascript:void(0)' style='color: #01AAED;' onclick='jeevesDetail(\"" + data.id + "\")'>查看占道详情</a><br>";
	content += "</div></div>";
	var info = new AMap.InfoWindow({
		content: content,
		offset: new AMap.Pixel(0, -30),
		size: new AMap.Size(300, 220)
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

function jeevesDetail(id) {
	layer.open({
		type : 2,
		closeBtn : 2,
		title : '占道详情',
		anim : 0,
		area : ['98%', '97%'],
		content : '/business/jeeves/detail.action?id=' + id
	});
}
