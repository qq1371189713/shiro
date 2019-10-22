
var layer;
var form;
var map = null;
var district;
var geocoder;
var polygons = [];

$(function() {
	
	var provinceLnglat = [];
	var winData = {};
	var taskDataObj = {'0':[],'1':[]}, warnDataObj = {'1':[],'2':[]};
	var jpage = 1, wpage = 1;
	var opts = {
			subdistrict: 0,   //获取边界不需要返回下级行政区
	        extensions: 'all',  //返回行政区边界坐标组等具体信息
	        level: 'province'  //查询行政级别为 市
		};
	district = new AMap.DistrictSearch(opts);
	geocoder = new AMap.Geocoder();
	var STATECONFIG = {
		'jeevesState': {0:"离线",1:"在线",3:"离线",4:"离线"},//任务状态
		'jeevesType':{1:"占道",2:"封路"},
		'warnType':{0:"侧方闯入",1:"后方闯入"},
		'warnState':{1:"预警中",2:"已解除"},
		'jeevesWarnState':{0:"未预警",1:"预警中",2:"已解除"}
	};
	
	$(".tab-box .left").click(function(){
		if($(this).hasClass('active'))return;
		var $tbody = $(this).closest('.header').siblings('.tbody'); 
		$(this).addClass('active').siblings(".left").removeClass("active");
		var showItems = [];
		if($(this).data('value') === ''){
			if($tbody.parent().hasClass('warn-box')){
				showItems = warnDataObj['1'].concat(warnDataObj['2']);
			} else if($tbody.parent().hasClass('task-box')){
				showItems = taskDataObj['1'].concat(taskDataObj['0']);
			}
		} else {
			if($tbody.parent().hasClass('warn-box')){
				showItems = warnDataObj[$(this).data('value')];
			} else if($tbody.parent().hasClass('task-box')){
				showItems = taskDataObj[$(this).data('value')];
			}
		}
		setPageBar(1, showItems, $tbody);
	});
	
	$(".footbar").on("click", 'a.btn', function(){
		if(!$(this).hasClass('disable')) {
			var $tbody = $(this).closest('.footbar').siblings('.tbody');
			var page = $(this).siblings('a.current').data('page')+$(this).data('plus');
			var targetValue = $(this).closest('.content-box').find('.tab-box .active').data('value');
			var data = [];
			if($tbody.parent().hasClass('warn-box')){
				data = targetValue === ''?warnDataObj['1'].concat(warnDataObj['2']):warnDataObj[targetValue];
				wpage = page;
			} else if($tbody.parent().hasClass('task-box')){
				data = targetValue === ''?taskDataObj['1'].concat(taskDataObj['0']):taskDataObj[targetValue];
				jpage = page;
			}
			setPageBar(page, data, $tbody);
		}
	});
	
	$(".footbar").on('click', '.page', function(){
		if(!$(this).hasClass("current")){
			var $tbody = $(this).closest('.footbar').siblings('.tbody');
			var page = $(this).data('page');
			var targetValue = $(this).closest('.content-box').find('.tab-box .active').data('value');
			var data = [];
			if($tbody.parent().hasClass('warn-box')){
				data = targetValue === ''?warnDataObj['1'].concat(warnDataObj['2']):warnDataObj[targetValue];
				wpage = page;
			} else if($tbody.parent().hasClass('task-box')){
				data = targetValue === ''?taskDataObj['1'].concat(taskDataObj['0']):taskDataObj[targetValue];
				jpage = page;
			}
			setPageBar(page, data, $tbody);
		}
	});
	
	$(".task-no-loc-box").on("click", ".item", function(){
		var data = winData[$(this).data('jn')];
		var isOnline = data.jeeState == getAdapter('jeevesState', 1);
		var isWarn = data.jeeState == getAdapter('jeevesState', 1) && data.warnState == 1;
		var contentHTML = 
			//占道任务状态：'+data.jeeState+'
			'<div class="bs-info-box">'+
				'<div class="bs-title" style="background-color:'+(isOnline?(data.warnState?'red':'green'):'gray')+';">'+(isWarn?('预警中（'+data.warnType+'）'):('占道任务状态：'+data.jeeState))+'</div>' +
				'<div class="bs-info-conent">'+
					(isWarn?'<span>预警类型：'+data.warnType+'</span></br>'+
							'<span>预警时间：'+data.warnTime.format()+'</span></br>':'') +
					'<span>预警次数：'+(data.warnCount?data.warnCount:0)+'次<a style="margin-left:20px;" href="javascript:void(0);" onclick="warnDetail(\''+data.jeevesNum+'\')">查看></a></span></br>' +
					'<span>占道任务编号：'+data.jeevesNum+'</br>' +
					'<span>占道类型：'+data.jeevesType+'</span></br>' +
					'<span>占道路段：--</span></br>' +
					'<span>设备位置：--</span></br>' +
					'<div class="bs-info-toolbar">' +
						(isWarn?'<a href="javascript:void(0);" onclick="warnDetail(\''+data.jeevesNum+'\')">预警信息</a>':'')+'<a href="javascript:void(0);" onclick="getJeevesDetail(\''+data.id+'\')">占道详情</a>' +
					'</div>' +
				'</div>' +
			'</div>';
		
		layer.open({
			type: 1,
			title: false,
			area: ['400px'],
			content: contentHTML
		});
	});
	
	$(".content-box").on('click', '.table-row[data-pos]', function(){
		var ll = null;
		if($(this).closest('.content-box.task-box').length){
			ll = winData[$(this).data('pos')].slnglat?winData[$(this).data('pos')].slnglat:ll;
		} else if($(this).closest('.content-box.warn-box').length){
			ll = $(this).data('pos').split(',');
		}
		if(ll)map.setCenter(new AMap.LngLat(ll[0], ll[1]));
	});
	
	map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        center: new AMap.LngLat(108.801299,34.406743),
        zoom: 4, //初始化地图层级
    });

	layui.use(['layer', 'form', 'laydate'], function () {
        layer = layui.layer;
        form = layui.form;
        var laydate = layui.laydate;
        laydate.render({
	        elem: '#time',
//	        value: new Date().format('yyyy-MM-dd') + ' ~ ' + new Date().format('yyyy-MM-dd'),
	        range: '~'
	    });
        
        form.on('submit(sub)', function(data){
        	loadData(data.field);
        	return false;
        });
        //定时
        var timer = setInterval(loadData, 1000*10);
        
        form.on('checkbox(interval)', function(data){
    	  	if(data.elem.checked){
    	  		loadData();
    	  		timer = setInterval(loadData, 1000*10);
    	  	} else {
    	  		clearInterval(timer);
    	  	}
    	});
        
        //数据请求
        function loadData(param)  {
        	if(!param){
        		param = {
    				searchText: $("input[name='searchText']").val(),
    				jeevesState: $("select[name='jeevesState']").val(),
    				jeevesType: $("select[name='jeevesType']").val(),
    				warnState: $("select[name='warnState']").val(),
    				warnType: $("select[name='warnType']").val(),
    				time: $("#time").val()
        		};
        	}
        	var jeevemObj = {
    			number: param.searchText,
				state: param.jeevesState,
				type: param.jeevesType
        	};
        	//预警信息参数
        	var warnObj = {
        		dataReturnType: 6,
				deviceNum: param.searchText,
				state: param.warnState,
				type: param.warnType
        	};
        	var time = $.trim(param.time);
        	if(time) {
        		time = time.split('~');
        		jeevemObj.startTime = $.trim(time[0]) + " 00:00:00";
        		jeevemObj.endTime = $.trim(time[1]) + " 23:59:59";
        		warnObj.startTime = $.trim(time[0]) + " 00:00:00";
        		warnObj.endTime = $.trim(time[1]) + " 23:59:59";
        	}
        	initData(jeevemObj, warnObj);
        }
        
        initData({state:$("select[name='jeevesState']").val()}, {dataReturnType:6});//初始化查询
        
        //查询
        function initData(jObj, wObj){
        	request(jObj, '/business/jeeves/queries.action', forTaskTable);
        	request(wObj, '/business/warn/queries.action', forWarnTable);
        }
        
        $("#clearBtn").click(function() {
        	var data = {
    			searchText: "",
        		time: "",
        		warnType: "",
        		jeevesState: "1",
        		jeevesType: "",
        		warnState: "",
        	}
        	form.val("search", data);
        	return false;
        });
        
        //查询请求方法
    	function request(data, url, callback){
    		$.ajax({
    			url : url,
    			type : 'post',
    			async : false,
    			data: data,
    			dataType : 'json',
    			success : function(res) {
    				provinceLnglat.length = 0;
    				callback(res);
    			},
    			error : function(xhr, e1, e2) {
    			}
    		});
    	}
    	
    	//右侧信息栏任务列表查询
    	function forTaskTable(res){
    		var data = res.data;
    		var htmlStr = '', taskType = '', taskOnline = '';
    		taskDataObj = {'0':[],'1':[]};
    		for(var i = 0; i < data.length; i++) {
    			taskDataObj[data[i].state == 1?'1':'0'].push(data[i]);
    			taskType = getAdapter('jeevesType', data[i].type);
    			taskOnline = getAdapter('jeevesState', data[i].state);
    			winData[data[i].number] = 
					{
						id: data[i].id,
						road: data[i].road,
						jeevesType: taskType, 
						jeeState: taskOnline, 
						jeevesNum: data[i].number, 
						warnCount: data[i].count
					}; 
    		}
    		$(".task-box .total-sum").text(data.length);
    		setPageBar(jpage, taskDataObj['1'].concat(taskDataObj['0']), $(".task-box .tbody"));
    		if($.isArray(res.addData) && res.addData.length > 0){
    			putWarnInfoData(res.addData);
    		}
    		addMapMarkers(data);
    	}
    	
    	//右侧信息栏预警列表查询
    	function forWarnTable(res){
    		var data = res.data;
    		var htmlStr = '', warnType = '', cRoad = '';
    		warnDataObj = {'1':[],'2':[]};
    		for(var i = 0; i < data.length; i++) {
    			warnDataObj[data[i].state == 1?'1':'2'].push(data[i]);
    			//独立设备报警（无关联任务）
    			if(!data[i].jeevesNum && data[i].state == 1){
    				var marker = new AMap.Marker({
        				icon: imgUrl + '/jeeves/two_alarm_red.png',
        				position: [data[i].lng, data[i].lat]
        			});
    				marker.windowData = data[i];
    				
    				marker.on('click', function(e){
    					//地址
    					var lnglat = this.getPosition();
    					geocoder.getAddress(lnglat, function(status, result) {
    						if (status === 'complete' && result.regeocode) {
    							var address = result.regeocode.formattedAddress;
    							$("#location").text(address+'('+lnglat+')');
    						} 
    					});
    					createInfoWindow('alone', this).open(map, lnglat);
        			});
    				map.add(marker);
//    				getProvinceNameByLL(data[i].lng, data[i].lat);//设置省份覆盖物
    			}
    		}
    		$(".warn-box .total-sum").text(data.length);
    		setPageBar(wpage, warnDataObj['1'].concat(warnDataObj['2']), $(".warn-box .tbody"));
    	}
    	
    	function putWarnInfoData(warnData){
    		var key_opt = '', key_devicenum = '';
    		for(let w of warnData) {
    			if(w.deviceType == 2){
    				key_opt = 'slnglat';
    				key_devicenum = 'sdeviceNum';
    			} else if(w.deviceType == 3){
    				key_opt = 'elnglat';
    				key_devicenum = 'edeviceNum';
    			} else {
    				key_opt = '', key_devicenum = '';
    			}
    			if(key_opt && w.lng*w.lat)winData[w.jeevesNum][key_opt] = [w.lng, w.lat];
    			if(key_devicenum)winData[w.jeevesNum][key_devicenum] = w.deviceNum;
    			winData[w.jeevesNum]['netCount'] = w.netCount?w.netCount:0;
    			winData[w.jeevesNum]['expState'] = ((winData[w.jeevesNum]['expState']?winData[w.jeevesNum]['expState']:'') + (w.expState?w.expState:''));
    			
    			if(w.warn == 1){
    				winData[w.jeevesNum]['warnState'] = w.warn;
    				if(!winData[w.jeevesNum]['warnTime'] || new Date(w.warnStartTime) > winData[w.jeevesNum]['warnTime']){
    					winData[w.jeevesNum]['warnTime'] = new Date(w.warnStartTime);
    					winData[w.jeevesNum]['warnType'] = getAdapter('warnType', w.warnType);
    				}
    			}
//    			getProvinceNameByLL(w.lng, w.lat);//设置省份覆盖物
    		}
    	}
    	
    	//添加地图marker标记
    	function addMapMarkers(data){
    		map.clearMap();
    		var item = null;
    		var htmlStr = '', tempClass = '';
    		for(let jee of data) {
    			item = createMarker(jee.number);
    			if(item.length > 0){
    				addMarker(item);
    			} else {
    				tempClass = jee.state==1 && jee.warnState==1?'warn':(jee.type == 1?'jeeves':(jee.type == 2?'closed':''));
    				htmlStr += '<div class="item '+tempClass+'" data-jn="'+jee.number+'" title="任务类型：'+getAdapter('jeevesType', jee.type)+'，任务编号：'+jee.number+'">' +
    						   '</div>';
    			}
    		}
    		$(".task-no-loc-box").html(htmlStr);
    	}

    });
	
	function drawBounds(name, level) {
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
	
	function createMarker(jeevesNum) {
		var dataObj = winData[jeevesNum];
		var markerGroup = [];
		var imgSufx;
		if(dataObj.warnState == 1){
			imgSufx = '04.gif';
		} else {
			imgSufx = dataObj.jeevesType == getAdapter('jeevesType', 1)?'icon_build.png':(dataObj.jeevesType == getAdapter('jeevesType', 2)?'icon_seal.png':'icon_unknow');
		}
		if(dataObj.slnglat){
			var smarker = new AMap.Marker({
				icon: imgUrl + '/jeeves/' + imgSufx,
				position: [dataObj.slnglat[0], dataObj.slnglat[1]]
			});
			smarker.jeevesNum = jeevesNum;
			smarker.deviceType = 2;
			markerGroup.push(smarker);
		}
		if(dataObj.elnglat){
			var emarker = new AMap.Marker({
				icon: imgUrl + '/jeeves/' + imgSufx,
				position: [dataObj.elnglat[0], dataObj.elnglat[1]]
			});
			emarker.jeevesNum = jeevesNum;
			emarker.deviceType = 3;
			markerGroup.push(emarker);
		}
		return markerGroup;
	}
	
	function addMarker(markers) {
		var dataObj = winData[markers[0].jeevesNum];
		for(let mk of markers) {
			mk.windowData = dataObj;
			mk.on('click', function(e){
				//地址解析
				var lnglat = this.getPosition();
				geocoder.getAddress(lnglat, function(status, result) {
					if (status === 'complete' && result.regeocode) {
						var address = result.regeocode.formattedAddress;
						$("#location").text(address+'('+lnglat+')');
					} 
				});
				var openWin = null;
				if(dataObj.warnState == 1){
					openWin = createInfoWindow('warn', this);
				} else if(dataObj.jeeState == getAdapter('jeevesState', 1)) {
					openWin = createInfoWindow('normal', this);
				} else {
					openWin = createInfoWindow('off', this);
				}
				openWin.open(map, lnglat);
			});
			map.add(mk);
		}
		//添加路线并 表明方向
		if(markers.length == 2){
			driving = new AMap.Driving({
				map: map,
				hideMarkers: true,
				showTraffic: false,
				autoFitView: false
			}); 
			driving.search(markers[0].getPosition(), markers[1].getPosition(), function(status, result) {
				if (status === 'complete') {
					console.log('绘制驾车路线完成');
					console.log(result);
				} else {
					console.log('获取驾车数据失败：');
					console.log(result);
				}
			});
			
		}
	} 
	
	function createInfoWindow(type, marker) {
		var data = marker.windowData;
		var contentHTML = '';
		var deviceNum = marker.deviceType == 3?data.edeviceNum:data.sdeviceNum;
		console.log(marker)
		console.log(data)
		switch(type) {
			case 'off'://离线任务信息窗口
				contentHTML = 
					'<div class="bs-info-box">'+
		        		'<div class="bs-title" style="background-color:gray;">占道任务状态：'+data.jeeState+'</div>' +
		        		'<div class="bs-info-conent">'+
		        			'<span>占道路段：'+data.road+'</span></br>' +
		        			'<span>预警次数：'+(data.warnCount?data.warnCount:0)+'次<a style="margin-left:20px;" href="javascript:void(0);" onclick="warnDetail(\''+data.jeevesNum+'\')">查看></a></span></br>' +
		        			'<span>占道类型：'+data.jeevesType+'</span></br>' +
		        			'<span>占道任务编号：'+data.jeevesNum+'</span></br>' +
		        			'<span>设备位置：<span id="location"></span></span></br>' +
		        			'<span>设备编号：'+deviceNum+'</span></br>' +
		        			'<div class="bs-info-toolbar">' +
		        				'<a href="javascript:void(0);" onclick="getJeevesDetail(\''+data.id+'\')">占道详情</a><a href="javascript:void(0);" onclick="deviceDetail(\''+deviceNum+'\')">设备信息</a>' +
		        			'</div>' +
		        		'</div>' +
		        	'</div>';
				break;
			case 'normal'://在线状态任务信息窗口
				contentHTML = 
					'<div class="bs-info-box">'+
						'<div class="bs-title" style="background-color:green;">占道任务状态：'+data.jeeState+'</div>' +
						'<div class="bs-info-conent">'+
							'<span>占道路段：'+data.road+'</span></br>' +
							'<span>预警次数：'+(data.warnCount?data.warnCount:0)+'次<a style="margin-left:20px;" href="javascript:void(0);" onclick="warnDetail(\''+data.jeevesNum+'\')">查看></a></span></br>' +
							'<span>占道类型：'+data.jeevesType+'</span></br>' +
							'<span>占道任务编号：'+data.jeevesNum+'</span></br>' +
							'<span>位置：<span id="location"></span></span></br>' +
							'<span>组网设备：'+data.netCount+'</span></br>' +
							'<span>设备状态：'+(data.expState.length>0?'异常':'正常')+'</span></br>' +
						'<div class="bs-info-toolbar">' +
							'<a href="javascript:void(0);" onclick="getJeevesDetail(\''+data.id+'\')">占道详情</a><a href="javascript:void(0);" onclick="deviceDetail(\''+deviceNum+'\')">设备信息</a>' +
						'</div>' +
						'</div>' +
					'</div>';
				break;
			case 'warn'://在线预警任务信息窗口
				contentHTML = 
					'<div class="bs-info-box">'+
						'<div class="bs-title" style="background-color:red;">预警中 ('+data.warnType+')</div>' +
						'<div class="bs-info-conent">'+
							'<span>预警类型：'+data.warnType+'</span></br>' +
							'<span>预警时间：'+data.warnTime.format()+'</span></br>' +
							'<span>占道路段：'+data.road+'</span></br>' +
							'<span>占道类型：'+data.jeevesType+'</span></br>' +
							'<span>占道任务编号：'+data.jeevesNum+'</span></br>' +
							'<span>设备位置：<span id="location"></span></span></br>' +
							'<span>设备编号：'+deviceNum+'</span></br>' +
							'<div class="bs-info-toolbar">' +
								'<a href="javascript:void(0);" onclick="warnDetail(\''+data.jeevesNum+'\')">预警信息</a><a href="javascript:void(0);" onclick="getJeevesDetail(\''+data.id+'\')">占道详情</a><a href="javascript:void(0);" onclick="deviceDetail(\''+deviceNum+'\')">设备信息</a>' +
							'</div>' +
						'</div>' +
					'</div>';
				break;
			case 'alone'://独立设备（无任务）预警任务信息窗口
				contentHTML = 
					'<div class="bs-info-box">'+
						'<div class="bs-title" style="background-color:red;">单独设备预警中</div>' +
						'<div class="bs-info-conent">'+
							'<span>预警类型：'+getAdapter('warnType', data.type)+'</span></br>' +
							'<span>预警时间：'+new Date(data.startTime).format()+'</span></br>' +
							'<span>设备位置：<span id="location"></span></span></br>' +
							'<span>设备编号：'+data.deviceNum+'</span></br>' +
							'<div class="bs-info-toolbar">' +
								'<a href="javascript:void(0);" onclick="deviceDetail(\''+data.deviceNum+'\')">设备信息</a><a href="javascript:void(0);" onclick="warnDetail(\''+data.deviceNum+'\')">预警信息</a>' +
							'</div>' +
						'</div>' +
					'</div>';
				break;
		}
		return new AMap.InfoWindow({
			content: contentHTML,
			offset: new AMap.Pixel(0, -20)
		});
	}
	
	//类型转换
	function getAdapter(key, value, notfoundValue){
		var name = STATECONFIG[key][value];
		notfoundValue = notfoundValue?notfoundValue:"未知";
		return name == undefined?notfoundValue:name;
	}
	
	//获取经纬度省份
	function getProvinceNameByLL(lng, lat) {
		if(lng < 136 && lng > 73 && lat < 54 && lat > 3 && provinceLnglat.length == 0){
			provinceLnglat = [lng, lat];
			var ll = new AMap.LngLat(lng, lat);
			geocoder.getAddress(ll, function(status, result) {
				if (status === 'complete' && result.regeocode) {
					var districtName = '全国';
					try{
						districtName = result.regeocode.addressComponent.province;
						drawBounds(districtName);
					} catch(e){
						drawBounds(districtName, 'country');
					}
				} 
			});
		}
	}
	
	
	//动态生成分页栏
	function setPageBar(page, data, $tbody) {
		var totalPage = Math.ceil(data.length/3);
		totalPage = totalPage == 0?1:totalPage;
		page = totalPage < page?totalPage:page;
		var prevBtnCls = page == 1?'btn-p-dis disable':'btn-p';
		var nextBtnCls = page == totalPage?'btn-n-dis disable':'btn-n';
		var pagerHTML = '<a href="javascript:void(0);" class="btn '+prevBtnCls+' left" data-plus="-1"></a>';
		var startIndex = 1, endIndex = totalPage;
		if(totalPage > 5) {
			if(page < 3){
				endIndex = 5;
			} else if(page > totalPage-2) {
				startIndex = totalPage - 4;
			} else {
				startIndex = page - 2;
				endIndex = page + 2;
			}
		}
		for( var i = startIndex; i <= endIndex; i++) {
			pagerHTML += '<a href="javascript:void(0);" class="left page'+(page == i?' current':'')+'" data-page="'+i+'">'+i+'</a>';
		}
		pagerHTML += '<a href="javascript:void(0);" class="btn '+nextBtnCls+' left" data-plus="1"></a><span style="margin-left:18px;">共 '+data.length+' 条，共'+totalPage+'页</span>';
		$tbody.siblings('.footbar').find('.right').html(pagerHTML);
		//展示对应页数的信息
		var htmlStr = '', pos = '';
		if($tbody.closest('.content-box').hasClass('task-box')) {
    		for(var i = (page-1)*3; i < (data.length<page*3?data.length:page*3); i++) {
    			pos = data[i].number;
    			htmlStr += 
    				'<div class="table-row" data-filter='+(data[i].state == 1?1:0)+' data-pos="'+pos+'">' + 
    					'<div class="icon left '+(data[i].state == 1?'on':'off')+'"></div>' +
	    				'<div class="line left">' + 
	    					'<p class="road">'+(i+1)+'. '+data[i].road+' ('+getAdapter('jeevesType', data[i].type)+') </p>' +
	    					'<p>'+new Date(data[i].startTime).format()+(data[i].endTime && data[i].state != 1?(' 至 '+new Date(data[i].endTime).format()):'')+'</p>' +
	    				'</div>' + 
	    				'<div class="operation"><a style="color:#1890ff;" href="javascript:void(0);" onclick="getJeevesDetail('+data[i].id+')">占道详情</a></div>' +
    				'</div>';
    		}
		} else if($tbody.closest('.content-box').hasClass('warn-box')) {
			var cRoad = '', warnType = '';
			for(var i = (page-1)*3; i < (data.length<page*3?data.length:page*3); i++) {
				cRoad = data[i].jeevesNum?data[i].road:(data[i].state == 1?'单独设备预警中':data[i].deviceNum);
				cRoad = cRoad?cRoad:'未知路段';
				warnType = getAdapter('warnType', data[i].type);
				pos = data[i].state == 1 && data[i].lng*data[i].lat?'data-pos="'+data[i].lng+','+data[i].lat:"";
    			htmlStr +=
    				'<div class="table-row" data-filter='+data[i].state+' '+pos+'">' +
    					'<div class="tips '+(data[i].state == 1?'warn':'free')+'">'+getAdapter('warnState', data[i].state)+'</div>' +
	    				'<div class="line">' + 
	    					'<p class="road">'+(i+1)+'. '+warnType+'_'+cRoad+'</p>' +
	    					'<p>预警时间：'+new Date(data[i].startTime).format()+'</p>' +
	    					'<p>解除预警时间：'+(data[i].endTime?new Date(data[i].endTime).format():'--')+'</p>' +
	    				'</div>' + 
	    				'<div class="operation"><a style="color:#1890ff;" href="javascript:void(0);" onclick="warnDetail(\'key'+data[i].id+'\')">预警信息</a></div>' +
    				'</div>';
    		}
		}
		if(!htmlStr) htmlStr = $("#no-data-template").html();
		$tbody.html(htmlStr);
	}
	
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

function getJeevesDetail(taskId) {
	layer.open({
		type : 2,
		closeBtn : 2,
		title : '占道详情',
		anim : 0,
		area : ['80%', '60%'],
		content : '/business/jeeves/detail.action?id='+taskId
	});
}