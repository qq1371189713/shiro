var layer;
var form;
var laypage;
var laydate;
var subIndex;

var map = null;
var driving;
var zoom = 15;

var reload = false;
var IMGURL="../../resources/images/";
var tpage = 1;

var refreshTaskTimer;
var jeevesMap;

var allTaskV2=[];
var allMarkerV2=[];

$(function() {
	sessionStorage.removeItem("curTaskNum");
	var value = $("#value").val();
	if(value != 1) {
		$("#searchText").val(value);
	} else {
		$("#wState").val(1);
	}
	
    layui.use(['layer', 'form', 'laypage', 'laydate'], function () {
        layer = layui.layer;
        laypage = layui.laypage;
        form = layui.form;
        laydate = layui.laydate;
        laydate.render({
	        elem: '#time'
	        //,range: true,
	    });
        if(value == 1) {
        	var data = {
        		warnState: "1",
        	}
        	form.val("searchPanel", data);
        }

		initMap('mapcontainer');
		var demo = $("#jeevesTable");
		var index = 1;
		demo.append(createTable());

		$(document).on("click", ".detail-info", function (e) {
			var taskId = $(e.target).data("id");
			layer.open({
				type : 2,
				closeBtn : 2,
				title : '占道详情',
				anim : 0,
				area : ['80%', '60%'],
				content : '/business/jeeves/detail.action?id='+taskId
			});
		});
		$(document).on("click", ".lift", function (e) {
			console.log("解除...");
			var taskNum = $(e.target).data("number");
			var taskId = $(e.target).data("id");
			var data = {id: taskId, number: taskNum, state: 4, endTime: new Date().format()};
			sub(0, data);
		});

		$(document).on("click", ".taskTr", function (obj) {
			var taskNum = $(obj.target).parent().data("number"); //获得当前行数据
			var layEvent = $(obj.target).data("event");
			if("detail" == layEvent || "unjeeves" == layEvent) {
				return;
			}
			sessionStorage.setItem("curTaskNum", taskNum);
			selectMarkline(taskNum);
		});

		search();
		refreshTaskTimer = setInterval(function () {
			search();
		}, 1000 * 10);

		$("#searchBtn").click(function() {
			search();
		});

		$("#searchBtn1").click(function() {
			search();
		});

		function fullSearch(){
			var searchs = {
				searchText: $('#searchText').val(),
				time: $("#time").val(),
				type: $('#type').val(),
				state: $('#state').val(),
				warnState: $('#warnState').val()
			};
			form.val('searchPanel', searchs);
		}

		$("#clearBtn").click(function() {
			var data = {
				searchText: "",
				time: "",
				type: "",
				state: "",
				warnState: "",
			}
			form.val("searchPanel", data);
			$("#value").val("");
			$("#wState").val("");
		});

		$("#scaleMAP").click(function () {
            $("#mapcontainer").toggleClass("full-map");
        });

		function getAllTaskData(conditions){
			var data = {
				state : $('#state').val(),
				page: 1,
				limit: 10
			};
			if(arguments.length>0){
				data = conditions;
			}
			$.ajax({
				url : '/business/jeeves/queries.action',
				type : 'post',
				async : false,
				data: data,
				dataType : 'json',
				success : function(res) {
					//添加表格数据
					var pg = Math.ceil(res.count/10);
					tpage = tpage > pg?pg:tpage;
					render(res.count);
					addTableinfo(res);
					//添加地图数据
					addMapTaskMarker(res);
		//			markerLine();
					if(res.count <= 0) {
						return;
					}
					var taskNum = sessionStorage.getItem("curTaskNum");
					if(taskNum == undefined || taskNum == null) {
						taskNum = res.data[0].number;
					}
					selectMarkline(taskNum);
				},
				error : function(xhr, e1, e2) {
				}
			});
		}

		function addTableinfo(res){
			var tr = "";
			var isadd = false;
			var taskData = res.data;
			jeevesMap = {};
			if( taskData.length !== undefined && taskData.length>=1){
				for(var i=0;i<taskData.length;i++){
					var tmp = taskData[i];
					if(allTaskV2.indexOf(tmp.number) == -1){
						allTaskV2.push(tmp.number);
					}
					var startTime = tmp.startTime;
					if(undefined != startTime) {
						startTime = new Date(startTime).format();
					} else {
						startTime = "--";
					}
					var endTime = tmp.endTime;
					if(undefined != endTime) {
						endTime = new Date(endTime).format();
					} else {
						endTime = "--";
					}
					var road = tmp.road;
					if(undefined == road) road = "--";
					var stateColor = tmp.state == 0?'red':(tmp.state == 3?'#f8be34':(tmp.state == 1?'green':'#f8be34'));
					var state = tmp.state == 0?'离线':(tmp.state == 3?'已完成':(tmp.state == 1?'在线':'已结束'));
					var type = tmp.type == 1?'占道':(tmp.type == 2?'封路':'未知');
					var warnColor = tmp.warnState == 1?'red':(tmp.warnState == 2?'#f8be34':'');
					var warnState = tmp.warnState == 1?'预警中':(tmp.warnState == 2?'已解除':'未预警');
					tr += "<tr data-number=\""+tmp.number+"\" class=\"taskTr\" onmouseover=\"this.style.backgroundColor='#F2F2F2';\" onmouseout=\"this.style.backgroundColor='#FFFFFF';\">" +
					"    <td>"+tmp.number+"</td><td>"+road+"</td><td style=\"text-align: center;\">"+type+"</td><td style=\"text-align: center;color:" + stateColor+ "\">"+state+"</td>"+
					"<td>"+startTime+"</td><td>"+endTime+"</td><td style=\"color:" + warnColor+ ";\">"+warnState+"</td>"+
					"<td style=\"text-align: center;\"> <a class=\"detail-info\" style=\"color:#1890ff;padding: 0px 5px;\" data-event=\"detail\" data-id=\""+tmp.id+"\">查看详情</a>";
					if(tmp.state == 1) tr += " <a class=\"lift\" style=\"color:#1890ff;padding: 0px 5px;\" data-event=\"unjeeves\" data-id=\""+tmp.id+"\" data-number=\""+tmp.number+"\">结束占道</a>";
					tr += "</td></tr>";
					isadd = true;

					var jee_info = {};
					jee_info.road = road;
					jee_info.type = tmp.type;
					jee_info.warnCount = tmp.count;
					jeevesMap[tmp.number] = jee_info;
				}
			}else{
				//删除所有task
				allTaskV2 = [];
				isadd = true;
				tr += '<tr><td colspan="9" style="text-align:center;padding:15px;"><img src="../../../resources/images/none.png"/></td></tr>'
			}
			if(isadd) $(".bs-table tbody").html(tr);
		}

		function render(count) {
			laypage.render({
				elem: 'page',
				height: 250,
				count: count,
				curr: tpage,
				layout: ['count', 'prev', 'page', 'next', 'skip'],
				jump: function(obj, first){
					if(!first) {
						var time = $("#time").val();
						var startTime;
						var endTime;
						if(time.length > 0) {
							startTime = time + " 00:00:00";
							endTime = time + " 23:59:59";
						}
						tpage = obj.curr;
						var where = {
							number: $('#searchText').val(),
							state : $('#state').val(),
							type : $('#type').val(),
							warnState : $('#warnState').val(),
							page: obj.curr,
							limit: obj.limit
						};
						if(time) {
							where.startTime = startTime;
							where.endTime = endTime;
						}
						getAllTaskData(where);
					}
				}
			});
		}

		function addMapTaskMarker(res){
			var taskData = res.data;
			if( taskData.length !== undefined && taskData.length>=1){

				var warnData = res.addData;
				if(warnData != undefined && warnData.length !== undefined && warnData.length>=1){
					var taskWarn={};
					for(var i=0;i<warnData.length;i++){
						var tmpTaskNum = warnData[i].jeevesNum;
						var tmpWarnState = warnData[i].warn;
						if(taskWarn[tmpTaskNum] !== undefined){
							var oldWarnState = taskWarn.tmpTaskNum;
							if(oldWarnState != tmpWarnState){
								if(tmpWarnState == 1){
									taskWarn[tmpTaskNum] = tmpWarnState;
								}
							}
						}else{
							taskWarn[tmpTaskNum] = tmpWarnState;
						}
					}
					for(var i=0;i<warnData.length;i++){
						var tmp = warnData[i];
						var deviceType = warnData[i].deviceType;
						if(deviceType == undefined || deviceType == 1) {
							continue;
						}
						var iswarn = taskWarn[warnData[i].jeevesNum] == 1?true:false;
						if(tmp.lat && tmp.lng)setMarkerV2(tmp.lat,tmp.lng,tmp.deviceNum,iswarn,tmp);
					}
				}else{
					//清除所有警报层，替换成占道层
					clearMarkerV2(false,true);
				}
			}else{
				//清除所有层
				clearMarkerV2(true);
			}
		}

		function clearMarkerV2(isall,iswarn){
			if(isall){
				for(var i=0;i<allMarkerV2.length;i++){
					var tmpMaker = allMarkerV2[i];
					map.remove(tmpMaker);
				}
				allMarkerV2 = [];
			}
		}

		function setMarkerV2(lat,lng,devId,iswarn,tmp){
			//map.remove(circleMarker);
			var color;
			var icon = IMGURL+"jeeves/icon_build.png";
			var offset = -12;
			if(tmp.jeevesType == 2) {
				icon = IMGURL+"jeeves/icon_seal.png";
				if(iswarn){
					color = "red"
					icon = IMGURL+"jeeves/04.gif";
					offset = -25;
				}
			} else{
				color="green";
				icon = IMGURL+"jeeves/icon_build.png";
				if(iswarn){
					color = "red"
					icon = IMGURL+"jeeves/04.gif";
					offset = -25;
				}
			}
			if(reload){
				console.log("reload...");

			}else{
				console.log("no reload...");
				//检查对应的图标是否一致
				var hasWarn;
				var hasIndex;
				var hasMark = false;
				var isReplace = false;
				for(var i=0;i<allMarkerV2.length;i++){
					var tmpMaker = allMarkerV2[i];
					var tmpDeviceId = tmpMaker.devId;
					var tmpJeevesNum = tmpMaker.taskNum;
					var tmpWarn = tmpMaker.state;
					if(tmpDeviceId == tmp.deviceNum && tmpJeevesNum == tmp.jeevesNum){
						hasMark = true;
						if(tmpWarn != tmp.warn){
							isReplace = true;
							hasIndex = i;
						}
					}
				}
				if(hasMark && isReplace){
					//替换
					//删除之前
					var oldMarker = allMarkerV2[hasIndex];
					console.log("replace..."+hasIndex);
					console.log(allMarkerV2);
					console.log(oldMarker);
					map.remove(oldMarker);
					var circleMarker = new AMap.Marker({
						icon: icon,
						position: [lng, lat],
						offset: {x: offset,y: offset}
					 });

					 circleMarker.devId = tmp.deviceNum;
					 circleMarker.taskNum = tmp.jeevesNum;
					 circleMarker.lat = tmp.lat;
					 circleMarker.lng = tmp.lng;
					 circleMarker.state = tmp.warn;
					 circleMarker.type = tmp.deviceType;
					 circleMarker.iswarn = tmp.warn;
					 circleMarker.warnType = tmp.warnType;
					 circleMarker.jeevesType = jeevesMap[tmp.jeevesNum].type;//tmp.jeevesType;
					 circleMarker.jeevesState = tmp.jeevesState;
					 circleMarker.warnStartTime = tmp.warnStartTime;
					 circleMarker.warnState = tmp.warnState;
					 circleMarker.warnCount = jeevesMap[tmp.jeevesNum].warnCount;//tmp.warnCount;
					 circleMarker.netCount = tmp.netCount;
					 circleMarker.expState = tmp.expState;
					 circleMarker.road = jeevesMap[tmp.jeevesNum].road;
					 allMarkerV2[hasIndex] = circleMarker;

					 map.add(circleMarker);
					 circleMarker.on('click', function(event) {
						createPileInfo(this).open(map, [lng, lat]);
					});
				}else if(hasMark && !isReplace){
					//不需要替换

				}else{
					//新增
					var circleMarker = new AMap.Marker({
						icon: icon,
						position: [lng, lat],
						offset: {x: offset,y: offset}
					 });

					 circleMarker.devId = tmp.deviceNum;
					 circleMarker.taskNum = tmp.jeevesNum;
					 circleMarker.lat = tmp.lat;
					 circleMarker.lng = tmp.lng;
					 circleMarker.state = tmp.warn;
					 circleMarker.type = tmp.deviceType;
					 circleMarker.iswarn = tmp.warn;
					 circleMarker.warnType = tmp.warnType;
					 circleMarker.jeevesType = jeevesMap[tmp.jeevesNum].type;//tmp.jeevesType;
					 circleMarker.jeevesState = tmp.jeevesState;
					 circleMarker.warnStartTime = tmp.warnStartTime;
					 circleMarker.warnState = tmp.warnState;
					 circleMarker.warnCount = jeevesMap[tmp.jeevesNum].warnCount;//tmp.warnCount;
					 circleMarker.netCount = tmp.netCount;
					 circleMarker.expState = tmp.expState;
					 circleMarker.road = jeevesMap[tmp.jeevesNum].road;
					 allMarkerV2.push(circleMarker);

					 map.add(circleMarker);
					 circleMarker.on('click', function(event) {
						createPileInfo(this).open(map, [lng, lat]);
					});
				}
			}
		}

		function createTable(){
			var table="<table class=\"bs-table\">" +
			"<thead>" +
			"<tr>" +
			"    <th>占道任务编号</th><th style='width:20%'>占道路段</th><th>占道类型</th><th>占道状态</th><th>开始时间</th><th>结束时间</th><th>是否预警</th><th style='width:12%;'>操作</th>" +
			"</tr>" +
			"</thead>" +
			"<tbody>" +
			"</tbody>" +
			"</table>";
			return table;
		}

		function search() {
			fullSearch();
			var time = $("#time").val();
			var startTime;
			var endTime;
			if(time.length > 0) {
				startTime = time + " 00:00:00";
				endTime = time + " 23:59:59";
			}
			var warnState = $("#wState").val();
			if(warnState == undefined|| warnState == null || warnState == "") {
				warnState = $('#warnState').val();
			}
			var where = {
				number: $('#searchText').val(),
				state : $('#state').val(),
				type : $('#type').val(),
				warnState : warnState,
				page: tpage,
				limit: 10
			};
			if(time) {
				where.startTime = startTime;
				where.endTime = endTime;
			}
			getAllTaskData(where);
		}

		function sub(subFlag, data) {
			var request = "";
			var msg = "";
			if(0 == subFlag){
				request = '/business/jeeves/updates.action';
				msg = "是否确定结束占道？</br>注意：结束后不可恢复";
			}
			layer.confirm(msg, {icon: 3, title:'提示'}, function(index){
				var subLoadIndex = layer.load();
				$.ajax({
					url : request,
					type : 'post',
					async : false,
					data : data,
					dataType : 'json',
					success : function(res) {
						layer.close(subLoadIndex);
						if (0 == res.code) {
							layer.msg(res.msg,{icon: 6});
						}  else if("2001" != res.code) {
							layer.msg(res.msg, {anim : 6,icon: 5});
						}
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
				zoom: zoom, //初始化地图层级
                resizeEnable: true
			});
			/*var styleName = "amap://styles/dark";
			map.setMapStyle(styleName);*/
			map.add(allMarkerV2)
		//	markerLine();
		}

		function createPileInfo(data) {
			var content = "";

			var jeevesState = data.jeevesState;
			var bgcolor = jeevesState == 0 ? "gray" : "green";
			var jeeState = jeevesState == 1 ? "在线" : "离线";
			content += "<div style=\"background-color:" + bgcolor+ ";height:35px;line-height:35px;padding:0 15px;color:#fff;\">占道任务状态:" + jeeState + "</div>";
			content += "<div>";
			content += "<div style=\"padding: 10px 20px;\">";
			var height = 150;
			if(data.iswarn == 1) {
				height = 200;
				var type = data.warnType;
				if(type == 0) {
					type = "侧方闯入";
				} else if(type == 1) {
					type = "后方闯入";
				}
				content += '<span style="color:red">预警中(' + type + ')</span><br>';
				var startTime = data.warnStartTime;
				if(null != startTime) {
					startTime = new Date(startTime).format();
				}
				content += "预警时间:" + startTime + "<br>";
			}
			content += "占道路段: "+data.road+"<br>";
			var jeevesType = data.jeevesType;
			jeevesType = jeevesType == 1?'占道':(jeevesType == 2?'封路':'未知');
			content += "预警次数: " + data.warnCount + "<br>";
			content += "占道类型: " + jeevesType + "<br>";
			content += "占道任务编号: " + data.taskNum + "<br>";
			content += "设备编号:" + data.devId + "<br>";
			if(jeevesState == 1) {
				var netCount = data.netCount;
				if(!netCount) netCount = 0;
				content += "组网设备:" + netCount + "<br>";
				content += "设备状态:" + (data.expState != undefined ? "异常" : "正常")   + "<br>";
			}
			//content += "<a href='javascript:void(0)' style='color: #01AAED;' onclick='jeevesDetail(\"" + data.id + "\")'>查看占道详情</a><br>";
			if(data.iswarn) {
				content += "<a href='javascript:void(0)' style='color: #01AAED;' onclick='warnDetail(\"" + data.taskNum + "\")'>预警详情</a>&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			content += "<a href='javascript:void(0)' style='color: #01AAED;' onclick='deviceDetail(\"" + data.devId + "\")'>设备详情</a><br>";
			content += "</div></div>";

			var info = new AMap.InfoWindow({
				content: content,
				offset: new AMap.Pixel(0, -10),
			});
			return info;
		}

		function markerLine(jeevesNum) {
			var leg = allMarkerV2.length;
			var makers = [];
			if(driving) {
				driving.clear();
			}
			if(leg > 0) {
				for(var i = 0; i < leg; i++) {
					/*for(var j = i + 1; j < leg; j++) {
						if(allMarkerV2[i].devId != allMarkerV2[j].devId && allMarkerV2[i].taskNum == allMarkerV2[j].taskNum) {
							makers.push(allMarkerV2[i]);
							makers.push(allMarkerV2[j]);
							break;
						}
					}*/
					if(allMarkerV2[i].taskNum == jeevesNum) {
						makers.push(allMarkerV2[i]);
					}
				}
			}
			var size = makers.length;
			if(size < 2) {
				return;
			}
			var lng1 = 0;
			var lat1 = 0;
			var lng2 = 0;
			var lat2 = 0;
			var count = 0;
			var ind = 0;
			var taskNum = "";
			for(var i = 0; i < size; i++) {
				var type = makers[i].type;
				if("" == taskNum) {
					taskNum = makers[i].taskNum;
				}
				if(type == 2 && taskNum == makers[i].taskNum) {
					lng1 = makers[i].lng
					lat1 = makers[i].lat;
					count++;
				}
				if(type == 3 && taskNum == makers[i].taskNum) {
					lng2 = makers[i].lng;
					lat2 = makers[i].lat;
					count++;
				}
				if(count == 2) {
					var point1 = new AMap.LngLat(lng1, lat1);
					var point2 = new AMap.LngLat(lng2, lat2);
					var cPoint = new AMap.LngLat((lng1 + lng2) / 2, (lat1 + lat2) / 2);
					if(driving == null) {
						driving = new AMap.Driving({
							map: map,
							hideMarkers: true,
							showTraffic: false,
							autoFitView: false
						});
					}
					if(driving != null) {
						driving.clear();
					}
					driving.search(point1, point2, function(status, result) {
						if (status === 'complete') {
							console.log('绘制驾车路线完成')
						} else {
							console.log('获取驾车数据失败：' + result)
						}
					});
					count = 0;
					for(var j = 0; j < size; j++) {
						if(taskNum == makers[j].taskNum) {
							makers[j].line = 1;
							makers[j].cPoint = cPoint;
							ind++;
							if(ind == 2) {
								taskNum = "";
								ind = 0;
							}
						}
					}
				}
			}
		}

		function selectMarkline(taskNum) {
			var leg = allMarkerV2.length;
			var maker = null;
			var count = 0;
			var index = -1;
			for(var i = 0; i < leg; i++) {
				var marker = allMarkerV2[i];
				if(marker.taskNum == taskNum) {
					count++;
					if(-1 == index) {
						index = i;
					}
					map.add(marker);
				} else {
					map.remove(marker);
				}
			}
			markerLine(taskNum);
			if(index != -1) {
				map.setCenter([allMarkerV2[index].lng,allMarkerV2[index].lat]);
				// map.setZoom(zoom);
			}
		}
	});

});

function warnDetail(jeevesNum) {
	window.location.href = '/business/warn/index.action?value=' + jeevesNum;
	var href = "/business/warn/index.action";
	window.parent.menuSet(href);
}

function deviceDetail(deviceNum) {
	layer.open({
		type : 2,
		closeBtn : 2,
		title : '设备详情',
		anim : 0,
		area : ['80%', '60%'],
		content : '/business/device/detail.action?number=' + deviceNum
	});
}