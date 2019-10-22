
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
$(function() {

	var height = $(window).height() - 75;
	$(".layui-fluid").css("height", height+"px");
	map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
    });
	geocoder = new AMap.Geocoder();
	
    layui.use(['layer', 'form', 'table', 'laydate', 'laytpl'], function () {
        layer = layui.layer;
        form = layui.form;
        tableInfo = layui.table;
        var laydate = layui.laydate;
        var numState = $("#num-state").val();
        var isGenric = false;
    	if(numState != undefined) {
    		if(numState.startsWith('key')) {
				numState = numState.substr(3);
				isGenric = true;
			}
    		var arr = numState.split("-");
    		if(!isGenric)$("#searchText").val(arr[0]);
    		$("#noarea").val(arr[0]);
    		$("#state").val(arr[1]);
    		form.render("select");
    	}
        laydate.render({
	        elem: '#time',
	        range: '~',
	    });
        //第一个实例
		var timeOutInstance = null;
        tableIns = tableInfo.render({
            elem: '#warnTable',
            height: height - 180,
            method: 'post',
            url: '/business/warn/queries.action', //数据接口
            page: true, //开启分页
            limit: 20,
            where: {
            	deviceNum: $("#noarea").val(),
            	state: $("#state").val()
            },
            limits: [10, 20, 30],
            cols: [[ //表头
                {type: 'numbers', title: '预警编号', width : '60'},
            	{field: 'jeevesNum', title: '占道任务编号', align: 'center', width: '13%'},
            	{field: 'deviceNum', title: '设备编号', align: 'center', width: '12%'},
                {field: 'state', title: '预警状态', align: 'center', width: '6%', templet:'#stateTmp' },
                {field: '', title: '预警类型', align: 'center', width: '6%', templet:'#typeTmp' },
                {field: 'address', title: '预警位置', align: 'center', width: '7%', templet: '#addressTmp'},
                {field: 'startTime', title: '预警开始时间', align: 'center', width: '11%' ,templet: '<div>{{ new Date(d.startTime).format() }}</div>'},
                {field: 'endTime', title: '预警结束时间', align: 'center', width: '11%' ,templet: '#endTimeTmp'},
                {field: 'safePhone', title: '安全员联系方式', align: 'center', width: '8%'},
                {field: 'id', title: '操作', align: 'center', width: '18%', templet: opBar}
            ]],
            done: function (res, curr, count) {
            	clearInterval(timeOutInstance);
            	timeOutInstance = setInterval(() => {
					queryCount();
					search();
				}, 1000 * 10);
            }
        });

        //监听工具条
        tableInfo.on('tool(warnTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
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
            } else if('relieve' == layEvent) {
            	act = 3;
            	var data = {id: data.id, jeevesNums: data.jeevesNum, state: 2, endTime: new Date().format()};
            	sub(act, data);
            } else if('devDetail' == layEvent) {
            	layer.open({
					type : 2,
					closeBtn : 1,
					title : '设备详情',
					anim : 0,
					area : ['80%', '60%'],
					content : '/business/device/detail.action?number=' + data.deviceNum
				});
            } else if('jeeDetail' == layEvent) {
            	layer.open({
					type : 2,
					closeBtn : 1,
					title : '占道详情',
					anim : 0,
					area : ['80%', '60%'],
					content : '/business/jeeves/detail.action?number=' + data.jeevesNum
				});
            } else if("address" == layEvent) {
            	if(!data.lng || !data.lat) {
            		layer.msg("该预警没有位置信息");
            		return;
            	}
            	var lnglat = new AMap.LngLat(data.lng, data.lat);
            	geocoder.getAddress(lnglat, function(status, result) {
            		if (status === 'complete' && result.regeocode) {
            			var address = result.regeocode.formattedAddress;
            			if(data.address) address += '('+data.address+')';
            			$(".bs-address-text-box").text(address);
            		}
            	});
            	map.remove(map.getAllOverlays('marker'));
            	var marker = createMarker(data.lng, data.lat, data.deviceType);
            	map.add(marker);
            	open("设备预警位置", $("#container"), ['40%', '50%']);
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
    
    queryCount();
    
    $("#searchBtn").click(function() {
		$("#noarea").val('');
    	search();
    });

    $("#addBtn").click(function() {
        open("占道记录新增", $("#operate"));
        act = 0;
    });
    
    $("#clearBtn").click(function() {
    	$("#noarea").val('');
    	var data = {
    		searchText: "",
    		time: "",
    		type: "",
    		state: "",
    	}
    	form.val("search", data);
    });
    
    $("#count1").click(function(){
    	var data = {
    		state: "1",
    	}
    	form.val("search", data);
    	search();
    });
    
    $("#count2").click(function(){
    	var url = '/business/jeeves/index.action?value=' + 1;
    	window.location.href = url;
    	var href = "/business/jeeves/index.action";
		sessionStorage.setItem("curMenu", href);
    	window.parent.menuSet(href);
    });
    
    $("#count3").click(function(){
    	var url = '/business/device/index.action?value=' + 2;
    	window.location.href = url;
    	var href = "/business/device/index.action";
		sessionStorage.setItem("curMenu", href);
    	window.parent.menuSet(href);
    });
    
});

function search() {
	var time = $("#time").val();
	var noVal = $("#noarea").val();
	var startTime;
	var endTime;
	if(time.length > 0) {
		var str = time.split("~");
		startTime = str[0] + "00:00:00";
    	endTime = str[1] + " 23:59:59";
//    	console.log(startTime + " " + endTime)
	}
	tableIns.reloadExt({where : {
		deviceNum: noVal?noVal:$("#searchText").val(),
		startTime: startTime,
		endTime: endTime,
	    state : $('#state').val(),
	    type : $('#type').val(),
	},page: {
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

function queryCount() {
	var act = '/business/warn/queryCount.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		dataType : 'json',
		success : function(data) {
			if (0 == data.code) {
				$("#count1").text(data.count1);
			    $("#count2").text(data.count2);
			    $("#count3").text(data.count3);
			}  else if("2001" != data.code) {
				layer.msg(data.msg, {anim : 6,icon: 5});
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
		act = '/business/warn/inserts.action';
	} else if(1 == subFlag){
		act = '/business/warn/updates.action';
		msg = "确认修改吗?";
	} else if(2 == subFlag){
		act = '/business/warn/deletes.action';
		msg = "确认删除吗?";
	} else if(3 == subFlag){
		act = '/business/warn/updates.action';
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
			success : function(data) {
				if (0 == data.code) {
					if (0 == subFlag) {
						tableIns.reload({page: {curr: 1}});
					} else {
						tableIns.reload();
					}
					layer.msg(data.msg,{icon: 6});
					layer.close(subIndex);
				}  else if("2001" != data.code) {
					layer.msg(data.msg, {anim : 6,icon: 5});
				}
				layer.close(subLoadIndex);
			},
			error : function(xhr, e1, e2) {
				layer.close(subLoadIndex);
			}
		}); 
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
