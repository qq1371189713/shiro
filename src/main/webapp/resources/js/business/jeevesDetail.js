
var layer;
var form;
var tableInfo;
var tableIns;
var tableIns1;
var tableIns2;
var subIndex;
var act;
var upload;
var map;
var geocoder;
var element;
$(function() {
	
	map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:11, //初始化地图层级
    });
	
	geocoder = new AMap.Geocoder();
	var data = $("#data").val();
	data = JSON.parse(data);
	console.log(data)
	init(data);

    layui.use(['layer', 'table', 'laytpl', 'element'], function () {
        layer = layui.layer;
        tableInfo = layui.table;
        element = layui.element;
        tableIns1 = tableInfo.render({
            elem: '#warnTable',
            height: 315,
            method: 'post',
            page: true, //开启分页
            limit: 20,
            limits: [10, 20, 30],
            cols: [[ //表头
            	{field: 'deviceNum', title: '设备编号', minWidth: 150, width: '14%'},
            	{field: '', title: '设备类型', minWidth: 120, width: '12%', templet: '#deviceTypeTmp'},
            	{field: 'state', title: '预警状态', minWidth: 120, width: '8%', templet: '#warnStateTmp'},
                {field: '', title: '预警开始时间', minWidth: 100, width: '12%',templet: '#startTimeTmp'},
                {field: '', title: '预警解除时间', minWidth: 100, width: '13%',templet: '#endTimeTmp'},
                {field: 'timeRemark', title: '预警持续时间', minWidth: 100, width: '13%'},
                {field: 'type', title: '预警类型', minWidth: 100, width: '8%', templet: '#warnTypeTmp'},
                {field: 'address', title: '预警地址', minWidth: 100, width: '8%', templet: '#addressTmp'},
                {field: 'safePhone', title: '安全员联系方式', minWidth: 100, width: '12%'}
            ]],
            parseData: function(res){ 
            	var data = res.data;
            	var warnCount1 = 0;
            	var warnCount2 = 0;
            	for(var i = 0, leg = data.length; i < leg; i++) {
            		var d = data[i];
            		if(d.type == 0) {
            			warnCount1++;
            		} else {
            			warnCount2++;
            		}
            	}
            	$(".warnCount").text(res.count);
            	$(".warnCount1").text(warnCount1);
            	$(".warnCount2").text(warnCount2);
            },
            done: function (res, curr, count) {
            }
        });
        
        tableInfo.on('tool(warnTable)', function (obj) { //注：to
        	  var data = obj.data; //获得当前行数据
              var layEvent = obj.event;
              if("address" == layEvent) {
            	console.log(data)
            	if(data.lng == undefined || data.lat == undefined) {
            		layer.msg("该预警信息没有位置信息");
            		return;
            	}
            	map.remove(map.getAllOverlays('marker'));
            	var marker = createMarker(data.lng, data.lat, data.deviceType);
            	map.add(marker);
            	open("设备预警位置", $("#container"), ['40%', '50%']);
              }
        });
        
        tableIns2 = tableInfo.render({
            elem: '#repairTable',
            height: 315,
            method: 'post',
            page: true, //开启分页
            limit: 20,
            data: [],
            limits: [10, 20, 30],
            cols: [[ //表头
            	{field: 'number', title: '设备编号', width: '15%'},
            	{field: '', title: '设备类型', width: '15%', templet:'#typeTmp'},
            	{field: '', title: '设备状态', width: '10%', templet:'#expStateTmp' },
                {field: 'reason', title: '按键状态', width: '10%', templet:'#keyStateTmp' },
                {field: '', title: '电量', width: '10%', templet: '#battTmp'},
                {field: 'gps', title: 'GPS', width: '10%'},
                {field: 'leida', title: '雷达', width: '15%'},
                {field: 'teamName', title: '所属团队', width: '15%'},
            ]],
            parseData: function(res){ 
            	var data = res.data;
            	var devCount1 = 0;
            	var devCount2 = 0;
            	for(var i = 0, leg = data.length; i < leg; i++) {
            		var d = data[i];
            		var batt = d.batt;
            		if(d.type == 1) {
            			devCount1++;
            		} else {
            			devCount2++;
            		}
            		if(batt != undefined) {
            			if(batt <= 33) {
            				d.battImg = "../../../../resources/images/batt3.png";
            			} else if(batt > 33 && batt <= 66) {
            				d.battImg = "../../../../resources/images/batt2.png";
            			} else if(batt > 66) {
            				d.battImg = "../../../../resources/images/batt1.png";
            			}
            		}
            		var leida = d.leida;
            		if(leida == undefined) {
            			d.leida = "正常";
            		} else {
            			d.leida = "异常";
            		}
            		var gps = d.gps;
            		if(gps == undefined) {
            			d.gps = "正常";
            		} else {
            			d.gps = "异常";
            		}
            		console.log(d.number + " " + leida + " " + gps)
            	}
            	$(".device").text(res.count);
            	$(".device1").text(devCount1);
            	$(".device2").text(devCount2);
            	return res;
            },
            done: function (res, curr, count) {
            }
        });
        
        var id = $("#id").val();
    	var imei = $("#imei").val();
    	var img = $("#img").val();
        $("#deviceId1").text(imei);
    	$("#img2").attr("src", requestUrl + img);
    	
    	tableIns1.reload({
    		url: '/business/warn/queries.action',
    		where: {
    			jeevesNum: data.number,
    			dataReturnType: 1,
    		}
    	});
    	tableIns2.reload({
    		url: '/business/device/queries.action',
    		where: {
    			jeevesNum: data.number,
    			dataReturnType: 4
    		}
    	});
    	
    	 element.on('tab(change)', function(){
         	var layid = this.getAttribute('lay-id');
         	
    	 });

    });
    
});

function init(data) {
	$("#number").text(data.number);
	$("#company").text(data.company);
	$("#reason").text(data.reason);
	$("#chargeName").text(data.chargeName);
	$("#chargePhone").text(data.chargePhone);
	$("#personNum").text(data.personNum);
	$("#taskMode").text(data.taskMode);
	$("#safeName").text(data.safeName);
	$("#safePhone").text(data.safePhone);
	var state = data.state;
	var color = state == 1 ? "green":"red";
	$("#state").css("color", color);
	state = state == 1 ? "在线" : "离线";
	$("#state").text(state);
	if(undefined != data.opTime) {
		$("#releaseTime").text(new Date(data.opTime).format());
	}
	$("#releaseName").text(data.opUser);
}

function open(title, dom, area) {
    if(undefined == area) area = ['500px', '450px'];
    subIndex = layer.open({
        title: title,
        type: 1,
        shade: 0,
        content: dom,
        area: area,
        end: function() {
            $("#form")[0].reset();
            $("#subDiv").show();
        }
    });
}

function createMarker(lng, lat, type) {
	var icon = imgUrl + "/jeeves/";
	if(type == 1) {
		icon += "one_alarm_red.png";
	} else if(type == 2 || type == 3) {
		icon += "two_alarm_red.png";
	}
	map.setCenter([lng, lat]);
	var marker = new AMap.Marker({
		icon: icon,
		position: [lng, lat]
	});
	return marker;
}

