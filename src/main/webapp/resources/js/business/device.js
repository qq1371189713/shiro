
var layer;
var form;
var tableInfo;
var tableIns;
var subIndex;
var act;
var upload;

var map;
var geocoder;
var currPage = 1;

$(function() {
	//添加团队选项框监听事件
  // layui.use(['form','layedit','laydate'],function () {
  // 	var form = layui.form,
	// 	layer = layui.layer,
	// 	layedit = layui.layedit,
	// 	laydate = layui.laydate;
  //     form.on('select(teamId)', function(data){
  //         if(data.value == 0){
  //             var url = '/business/team/index.action';
  //             window.location.href = url;
  //             var href = "/business/team/index.action";
  //             window.parent.menuSet(href);
	// 	  }
  //
  //     });
  //
  //
  // })




    //异步查询设备组数据字典 --start
    var act = '/business/devicegroup/queries.action';
    $.ajax({
        url :act,
        type:'post',
        async: false,
        dataType: 'json',
        success: function (res) {
			if(res.code == -3) return false;
            $("#teamNumber").empty();
            var option = document.createElement("option");
            $(option).val("");
            $(option).text("请选择设备组");
            $('#teamNumber').append(option);
            for (var i = 0; i < res.data.length; i++) {
                var option = document.createElement("option");
                $(option).val(res.data[i].groupId);
                $(option).text(res.data[i].groupName);
                $('#teamNumber').append(option);
            }
        }
    });
	//异步查询设备组数据字典 --end
	var height = $(window).height() - 105;
	map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:13, //初始化地图层级
    });
	geocoder = new AMap.Geocoder();
    layui.use(['layer', 'form', 'table', 'laydate', 'laytpl', 'upload'], function () {
        layer = layui.layer;
        form = layui.form;
        tableInfo = layui.table;
        upload = layui.upload;
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
        	elem: '#buyTime',
        	type: 'datetime',
        	format: 'yyyy-MM-dd HH:mm:ss',
			max: new Date().format('yyyy-MM-dd')
        });
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
		var timeOutInstance = null;
        tableIns = tableInfo.render({
            elem: '#deviceTable',
            height: height - 193,
            method: 'post',
            url: '/business/device/queries.action', //数据接口
            where: {
            	join: 1,
            	expState : $("#expState").val(),
            },
            loading: false,
            page: true, //开启分页
            limit: 20,
            limits: [10, 20, 30],
            cols: [[ //表头
                {field: 'number', title: '设备编号', align: 'center', width: '10%'},
                {field: 'type', title: '设备类型', align: 'center', width: '7%', templet:'#typeTmp' },
            //    {field: '', title: '设备组', align: 'center', width: '5%',templet:'#teamNumberTmp'},
                {field: '', title: '在线状态', align: 'center', width: '6%', templet:'#stateTmp' },
                {field: '', title: '设备状态', align: 'center', width: '6%', templet:'#expStateTmp' },
                {field: '', title: '电量', align: 'center', width: '8%', templet: '#battTmp'},
                {field: '', title: '按键状态', align: 'center', width: '6%', templet:'#keyStateTmp' },
                {field: 'createTime', title: '开机时间', align: 'center', width: '10%',templet: '#createTimeTmp'},
                {field: '', title: '位置', width: '8%', align: 'center', templet: '#addressTmp'},
                // {field: '', title: '百米桩号', width: '5%', align: 'center', templet: '#number'},
                {field: '', title: '最后更新时间', align: 'center', width: '10%',templet: '#updateTimeTmp'},
                {field: 'teamName', title: '所属团队', align: 'center', width: '8%'},
                {field: 'id', title: '操作', align: 'center', width: '15%', templet: opBar}
            ]],
            parseData: function(res){ 
            	var data = res.data;
            	for(var i = 0, leg = data.length; i < leg; i++) {
            		var d = data[i];
            		var batt = d.batt;
            		if(batt != undefined) {
            			if(batt <= 33) {
            				d.battImg = "../../../../resources/images/batt3.png";
            			} else if(batt > 33 && batt <= 66) {
            				d.battImg = "../../../../resources/images/batt2.png";
            			} else if(batt > 66) {
            				d.battImg = "../../../../resources/images/batt1.png";
            			}
            		}
            	}
            	return res;
            },
            done: function (res, curr, count) {
                currPage = curr;
				clearInterval(timeOutInstance);
				timeOutInstance = setInterval(() => {
					// queryCount();
					// search();
				}, 1000 * 10);
            }
        });
        
        //监听工具条
        tableInfo.on('tool(deviceTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event;
            if("edit" == layEvent) {
                form.val("device", data);
                if(data.img != "" && data.img != undefined) {
                	 $("#img1").attr("src", requestUrl + data.img);
                }
                open("设备编辑", $("#operate"));
                act = 1;
            } else if("del" == layEvent) {
            	act = 2;
            	var data = {id: data.id};
            	sub(act, data);
            } else if("repair" == layEvent) {
            	act = 3;
            	form.val("repair", data);
            	$("#deviceId").val(data.id);
            	$("#rtxt").text('维修原因');
            	$("#atxt").text('维修申请人');
            	$("#reason").attr("placeholder", "请输入维修原因");
            	$("#applyName").attr("placeholder", "请输入维修申请人");
            	open("设备维修", $("#repairOperate"));
            	$(".hide").show();
            } else if("scrap" == layEvent) {
            	act = 4;
            	form.val("repair", data);
            	$("#deviceId").val(data.id);
            	$("#rtxt").text('报废原因');
            	$("#atxt").text('报废申请人');
            	$("#reason").attr("placeholder", "请输入报废原因");
            	$("#applyName").attr("placeholder", "请输入报废申请人");
            	open("设备报废", $("#repairOperate"));
            	$(".hide").hide();
            } else if("use" == layEvent) {
            	act = 5;
            	var data = {id: data.id, state: 0};
            	sub(act, data);
            } else if("detail" == layEvent) {
            	layer.open({
					type : 2,
					closeBtn : 1,
					title : '设备详情',
					anim : 0,
					area : ['80%', '60%'],
					content : '/business/device/detail.action?id=' + data.id
				});
            } else if("address" == layEvent) {
            	if(!data.lng || !data.lat) {
            		layer.msg("该设备没有位置信息");
            		return;
            	}
                var lnglat = new AMap.LngLat(data.lng, data.lat);
                geocoder.getAddress(lnglat, function(status, result) {
                    if (status === 'complete' && result.regeocode) {
                        var address = result.regeocode.formattedAddress;
                        if(data.remark) {
                        	address += '('+data.remark+')';
						}
                        $(".bs-address-text-box").text(address);
                    }
                });
            	map.remove(map.getAllOverlays('marker'));
            	var marker = createMarker(data.lng, data.lat, data.type);
            	map.add(marker);
            	open("设备位置", $("#container"), ['40%', '50%']);
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
        
        form.on('submit(repairSub)', function(data){
        	sub(act, data.field);
        	return false;
        });
        
        $(".cancelBtn").click(function(){
        	layer.close(subIndex);
        });

        upload.render({
            elem: '#uploadImg',
            exts: 'jpg|jpeg|png|bmp',
            url: '/business/upload/upload.action',
            size: 1000 * 3, //限制文件大小，单位 KB
            drag: true,
            dataType: 'json',
            done: function(res){
                $("#img").val(res.data);
                $("#img1").attr("src", requestUrl + res.data);
            }
        });
        
        queryCount();
        
        var expState = $("#expState").val();
    	if(expState == 2) {
    		var data = {
    			expState: "2",
        	}
        	form.val("search", data);
    	}
        
    });
    
    $("#clearBtn").click(function() {
    	var data = {
    		number1: "",
    		type1: "",
    		expState: "",
    		team1: "",
    		state2: ""
    	}
    	form.val("search", data);
    });
    
    $("#searchBtn").click(function() {
    	search();
    });
    
    initTeam();
    $("#addBtn").click(function() {
        open("设备新增", $("#operate"));
        act = 0;
    });
});

function search() {
	tableIns.reloadExt({where : {
		join: 1,
		number : $('#number1').val(),
		type : $("#type1").val(),
		state : $("#state2").val(),
		expState : $("#state1").val(),
		queryTeamId : $("#team1").val()
	},page: {
	    curr: currPage //重新从第 x 页开始
	  }
	});
}

function open(title, dom, area) {
    if(undefined == area) area = ['500px', '450px'];
    subIndex = layer.open({
        title: title,
        type: 1,
        closeBtn : 1,
        content: dom,
        area: area,
        end: function() {
            $("#form")[0].reset();
            $("#img1").attr("src", "../../../resources/images/unknown.png");
        },
        success : function(layero) {
        	if(title =="设备编辑"){
        		$("#number").attr('disabled', '');
        		$("#type").attr('disabled', '');
        		$("#buyTime").attr('disabled', '');
        		layui.form.render();
        	}
        }
    });
}

function queryCount() {
	var act = '/business/device/queryCount.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		data: {
			teamId: $("#teamId").val()
		},
		dataType : 'json',
		success : function(res) {
			if (0 == res.code) {
				var dCount = res.count1 + res.count2 + res.count3;
				var deviceCount = echarts.init(document.getElementById("deviceCount"));
				var datas = [{
				    value: res.count1,
				    name: '中间设备'
				}, {
				    value: res.count2,
				    name: '起点设备'
				}, {
				    value: res.count3,
				    name: '终点设备'
				}];
				var scale = 1;
				var option = {
				    tooltip: {
				        trigger: 'item',
				        formatter: "{b}: {c} ({d}%)"
				    },
				    color : ['#dc6758', '#2a85e8', '#dcac58'],
				    legend: {
				    	orient: 'vertical',
				        x: 'left',
				        y: '30',
				        itemWidth:20,
				        itemHeight:10,
						selectedMode: false,
				        data:[{
				        	name:'中间设备',
				        	textStyle: {
				                fontSize: 12
				            }
				        }, {
				        	name:'起点设备',
				        	textStyle: {
				                fontSize: 12
				            }
				        },{name:'终点设备',
			            	textStyle: {
			                    fontSize: 12
			                }
				        }],
				    },
				    series: [{
				            type:'pie',
				            center: ['50%', '50%'],
                        	radius: ['50%', '80%'],
				            avoidLabelOverlap: false,
				            label: {
				                normal: {
				                    show: true,
				                    align: 'right',
				                    position: 'center',
			                    	formatter: [
					                    '{b| ' + dCount + '}'
					                ].join('\n'),
					                rich: {
					                    b: {
					                        color: '#3e59f5',
					                        fontSize: 15,
					                        align:'center'
					                    },
					                },
				                },
				                emphasis: {
				                    show: false,
				                    textStyle: {
				                        fontSize: '30',
				                        fontWeight: 'bold'
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    show: false
				                }
				            },
				            data:datas
				        }
				    ]
				};
				deviceCount.setOption(option);
				var name = "起点设备(" + res.count2 + ")";
				$("#deviceTitle2").text(name);
				var option2 = {
					    tooltip: {
					        trigger: 'item',
					        formatter: "{b}: {c} ({d}%)"
					    },
					    color: ['#2a85e8', '#bad2eb'],
					    legend: {
					        orient: 'vertical',
					        x: 'left',
					        y: '30',
					        itemWidth:20,
					        itemHeight:10,
							selectedMode: false,
					        data: [{
					            name: '在线',
					            textStyle: {
					                fontSize: 10
					            }
					        }, {
					            name: '离线',
					            textStyle: {
					                fontSize: 10
					            }
					        }],
					    },
					    series: [{
					        name: '访问来源',
					        type: 'pie',
					        radius: ['50%', '80%'],
					        avoidLabelOverlap: false,
					        label: {
					            normal: {
					                show: true,
					                position: 'center',
					                formatter: [
					                    '{a|在线}',
					                    '{b| ' + res.count5 + '}'
					                ].join('\n'),
					                rich: {
					                    a: {
					                        color: '#3e59f5',
					                        fontSize: 12,
					                    },
					                    b: {
					                        color: '#3e59f5',
					                        fontSize: 15,
					                    },
					                },
					            },
					        },
					        labelLine: {
					            normal: {
					                show: false
					            }
					        },
					        data:[
				                {value:res.count5, name:'在线'},
				                {value:res.count2 - res.count5, name:'离线'},
				            ]
					    }]
					};
				var deviceCount2 = echarts.init(document.getElementById("deviceCount2"));
				deviceCount2.setOption(option2);
				var name = "中间设备(" + res.count1 + ")";
				$("#deviceTitle1").text(name);
				var option1 = {
					    tooltip: {
					        trigger: 'item',
					        formatter: "{b}: {c} ({d}%)"
					    },
					    color: ['#dc6758', '#e9a9a1'],
					    legend: {
					    	orient: 'vertical',
					        x: 'left',
					        y: '30',
					        itemWidth:20,
					        itemHeight:10,
							selectedMode: false,
					        data: [{
					            name: '在线',
					            textStyle: {
					                fontSize: 10
					            }
					        }, {
					            name: '离线',
					            textStyle: {
					                fontSize: 10
					            }
					        }],
					    },
					    series: [{
					        name: '访问来源',
					        type: 'pie',
                            radius: ['50%', '80%'],
					        avoidLabelOverlap: false,
					        label: {
					            normal: {
					                show: true,
					                position: 'center',
					                formatter: [
					                    '{a|在线}',
					                    '{b| ' + res.count4 + '}'
					                ].join('\n'),
					                rich: {
					                    a: {
					                        color: '#dc6858',
					                        fontSize: 12,
					                    },
					                    b: {
					                        color: '#dc6858',
					                        fontSize: 15,
					                    },
					                },
					            },
					        },
					        labelLine: {
					            normal: {
					                show: false
					            }
					        },
					        data:[
				                {value:res.count4, name:'在线'},
				                {value:res.count1 - res.count4, name:'离线'},
				            ]
					    }]
					};
				var deviceCount1 = echarts.init(document.getElementById("deviceCount1"));
				deviceCount1.setOption(option1);
				var name = "终点设备(" + res.count3 + ")";
				$("#deviceTitle3").text(name);
				var option3 = {
					    tooltip: {
					        trigger: 'item',
					        formatter: "{b}: {c} ({d}%)"
					    },
					    color: ['#dcac58', '#ebd4ad'],
					    legend: {
					    	orient: 'vertical',
					        x: 'left',
					        y: '30',
					        itemWidth:20,
					        itemHeight:10,
							selectedMode: false,
					        data: [{
					            name: '在线',
					            textStyle: {
					                fontSize: 10
					            }
					        }, {
					            name: '离线',
					            textStyle: {
					                fontSize: 10
					            }
					        }],
					    },
					    series: [{
					        name: '访问来源',
					        type: 'pie',
                            radius: ['50%', '80%'],
					        avoidLabelOverlap: false,
					        label: {
					            normal: {
					                show: true,
					                position: 'center',
					                formatter: [
					                    '{a|在线}',
					                    '{b| ' + res.count6 + '}'
					                ].join('\n'),
					                rich: {
					                    a: {
					                        color: '#dcac58',
					                        fontSize: 12,
					                    },
					                    b: {
					                        color: '#dcac58',
					                        fontSize: 15,
					                    },
					                },
					            },
					        },
					        labelLine: {
					            normal: {
					                show: false
					            }
					        },
					        data:[
				                {value:res.count6, name:'在线'},
				                {value:res.count3 - res.count6, name:'离线'},
				            ]
					    }]
					};
				var deviceCount3 = echarts.init(document.getElementById("deviceCount3"));
				deviceCount3.setOption(option3);
			}  else if("2001" != res.code) {
				layer.msg(res.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}

function sub(subFlag, data) {
	if(data.buyTime == "") {
		data.buyTime = undefined;
	}
	var act = "";
	var msg = "确认新增吗?";
	if (0 == subFlag) {
		//后台校验重复提交标示
		act = '/business/device/inserts.action';
	} else if(1 == subFlag){
		act = '/business/device/updates.action';
		msg = "确认修改吗?";
	} else if(2 == subFlag){
		act = '/business/device/deletes.action';
		msg = "确认删除吗?";
	} else if(3 == subFlag){
		act = '/business/repair/inserts.action';
		msg = "确认修改吗?";
	} else if(4 == subFlag){
		act = '/business/repair/inserts.action';
		msg = "确认报废吗?";
		data.type = 1;
		var dFmt = new Date().format();
		data.startTime = dFmt;
		data.endTime = dFmt;
	} else if(5 == subFlag){
		act = '/business/device/updates.action';
		msg = "确认恢复吗?";
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
						tableIns.reload({page: {curr: currPage}});
					}
					layer.close(subIndex);
					layer.msg(data.msg,{icon: 6});
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

function initTeam(userId) {
	var url = "/business/team/queries.action";
	$.ajax({
        url: url,
        type: "post",
        async: false,
        data: {
        	dataReturnType: 1
        },
        success:function(res){
        	if(res.code == 0) {
        		var data = res.data;
        		var option = '<option value="">所有团队</option>';
        		for(var i = 0, leg = data.length; i < leg; i++) {
        			option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
        		}
        		$(".team").empty();
        		$(".team").append(option);
        	}
        },
        error:function(e){
            layer.msg("错误！！");
        }
    });  
}

