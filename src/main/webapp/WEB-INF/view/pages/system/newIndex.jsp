<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html >
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>占道预警管理平台</title>
    <%@include file="../../../../url.jsp"%>
    <script src="https://webapi.amap.com/maps?v=1.4.13&key=aac358a9f0f4fe77c099995c0b79f59d&&plugin=AMap.DistrictSearch,AMap.Geocoder,AMap.LngLat"></script>
    <%@include file="../../../../jquery.jsp"%>
    <%@include file="../../../../layui.jsp"%>

    <link rel="stylesheet" href="../../resources/lib/bsAdminSystem/css/bsAdminSystem-base.css">
    <link rel="stylesheet" href="../../resources/lib/bsAdminSystem/css/vehicle-management.css">
    <style type="text/css">
        .title-message{
            padding: 2px 5px;
            font-size: 12px;
            text-align: center;
            font-weight: normal;
            color: #ffffff;
            background-color: #f22052;
            border-radius: 10px;
            z-index: 30;
        }

        .layui-layer-title {
            background: #fff;
            color: #333;
            border: none;
            text-align: center;
        }

        .p {
           margin-left: 10px;
        }
        
        .p a {
        	padding: 5px 0;
		    font-size: 12px;
		    color: #445ef5;
        }

		.p1 {
			font-size: 14px;
			font-weight: bold;
			margin-bottom: 10px;
		}
		
		.sp {
		    margin: 20px 0;
		    height: 25px;
    		line-height: 25px;
    		color: #000000;
    		font-size: 12px;
		}
		
		.p3{
			font-weight: bold;
		}
		
		.p4 {
			color: #6669 !important;
		}

        #up-map-div {
            width: 300px;
            height: 90px;
            top: 30px;
            left: 78%;
            position: absolute;
            z-index: 9999;
            border:1px solid red;
        }
        
        .layui-input, .layui-select, .layui-textarea {
		    height: 30px;
		    line-height: 1.3;
		    line-height: 38px\9;
		    border-width: 1px;
		    border-style: solid;
		    background-color: #fff;
		    border-radius: 2px;
		}
		
		.rdiv {
			top: 50px;
	    	left: -260px;
	   		position: relative;
		}
		
		.layui-tab-title {
		    position: relative;
		    left: 0;
		    height: 40px;
		    white-space: nowrap;
		    font-size: 0;
		    border-bottom-width: 1px;
		    border-bottom-style: solid;
		    transition: all .2s;
		    -webkit-transition: all .2s;
		    width: 380px;
		}
		
		/* .footer {
		    position: absolute;
		    bottom: 10px;
		    height: 50px;
		    border: 1px solid #e6e6e6;
		    padding: 0px 10px;
		    clear: both;
		} */
		
		.footer {
			position: absolute;
			/*border: 1px solid #e6e6e6;*/
			padding: 0px 10px;
    		/*height: 50px;*/
		}
		
		.layui-tab-brief > .layui-tab-title .layui-this {
		    color: #fff;
		    border-radius: 100px;
		    background-color: #1E9FFF;
		}
		
		.layui-tab-title {
		    border-bottom-style: none;
		}
		
		.layui-tab-brief > .layui-tab-more li.layui-this::after, .layui-tab-brief > .layui-tab-title .layui-this::after {
		    border-bottom: 0px solid #eee;
		}
		
		.tab {
			font-size: 18px;
		    color: #b7b8ba;
		}
		
		.title {
			font-size: 16px;
		    color: #646464;
		    padding: 2px 0px;
		}
		
		.content {
			font-size: 12px;
		    color: #646464;
		    padding: 2px 0px;
		}
    </style>
</head>
<body>
<div class="header">
    <div class="logo">
        <!-- <img src="../../resources/images/zjhnlogo.png" style="height:60px"> -->
        <img src="/resources/lib/newLogin/img/logo_1.png" style="height:30px">
    </div>

    <div id="headerMenu" class="header-menu clearfix">
        <div class="usercenter-menu">
            <ul class="clearfix">
                <li class="child">
                    <a href="javascript:void(0)">${user.account}</a>
                    <ul class="child-menu">
                        <li>
                            <a href="/system/user/logout.action">退出</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <div class="nav-menu" id="msg">
            <ul class="clearfix">
                <li class="child">
                    <a href="javascript:void(0)">
                        <b class="title-message" id="msgCount"></b>
                        消息中心
                    </a>
                   <%-- <ul class="child-menu">
                        <li>
                            <a href="#">消息通知</a>
                        </li>
                        <li>
                            <a href="#">
                                <span>2018-01-01 12:09:30</span><br>
                                王大达的费用申请：通行费用225元
                            </a>
                        </li>
                    </ul>--%>
                </li>

            </ul>
        </div>
    </div>

    <div id="hmenuToggleBtn" class="headermenu-phone-icon"></div>
</div>


<div id="sidebarBodyer" class="sidebar-bodyer toggleSidebar clearfix">
    <div id="sidebar" class="sidebar">
        <ul id="sidebarMenu" class="first-menu">
            <!--<li class='child clearfix'>
                <a id='indexId' target='content-iframe' href='http://119.23.248.41:28013/feature/web?key=KxvqexBlIlqZa0dC'>
                 	<i class='newIndex'></i>
                    <span>首页</span>
                </a>
            </li>
           <li class='child clearfix'>
                <a target='content-iframe' >
                	<i class='controlService'></i>
                	<span>设备管理</span>
                </a>
                <ul class='second-menu'>
                    <li class=carMode><a  target="content-iframe" href='/business/device/index.action'>设备报备</a></li>
                    <li class=carMode><a  target="content-iframe" href='/business/seat/index.action'>设备位置信息</a></li>
                </ul>
            </li>
            <li class='child clearfix'>
                <a target='content-iframe' >
                	<i class='controlService'></i>
                	<span>系统管理</span>
                </a>
                <ul class='second-menu'>
                    <li class=carMode><a  target="content-iframe" href='/system/menu/index.action'>菜单管理</a></li>
                    <li class=carMode><a  target="content-iframe" href='/system/role/index.action'>角色管理</a></li>
                    <li class=carMode><a  target="content-iframe" href='/system/user/index.action'>用户管理</a></li>
                </ul>
            </li> -->
        </ul>
        <div id="sidebarBtn" class="sidebarbtn-box">
            <i></i>
        </div>
    </div>

    <div class="main">
        <iframe  id="content-iframe" name="content-iframe" frameborder="0"></iframe>
    </div>
</div>

<div id="allMsg" class="layui-fluid" style="display: none;">
	<div class="layui-tab layui-tab-brief tab" style="background-color: white; " lay-filter="change">
	    <ul class="layui-tab-title">
	        <li class="layui-this" lay-id="1">全部</li>
	        <li lay-id="2">未读</li>
	        <li lay-id="3">已读</li>
	        <li lay-id="4">全部标记为已读</li>
	    </ul>
	    <div class="layui-tab-content">
	        <div class="layui-tab-item layui-show" id="msgContent1">
	           <div style="margin-top: 10px;" id="msg-2-1">
	           </div>
	           <div class="footer">
	               <div id="page1"></div>
	           </div>
	        </div>
	        <div class="layui-tab-item" id="msgContent2">
	            <div style="margin-top: 10px;" id="msg-2-2">
	            </div>
	            <div class="footer">
	                <div id="page2"></div>
	            </div>
	        </div>
	        <div class="layui-tab-item" id="msgContent3">
	            <div style="margin-top: 10px;" id="msg-2-3">
	            </div>
	            <div class="footer">
	                <div id="page3"></div>
	            </div>
	        </div>
	    </div>
	</div>
</div>

<script src="../../resources/lib/bsAdminSystem/lib/jquery/jquery.js"></script>
<script src="../../resources/lib/bsAdminSystem/lib/mousewheel/jquery.mousewheel.js"></script>
<script src="../../resources/lib/bsAdminSystem/js/bsAdminSystem-base.js?v=0.03"></script>
<script type="text/javascript">
 if(history.pushState && history.replaceState) {
	history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
}
</script> 

<script type="text/javascript">
	
	var layer;
	var element;
	var laypage;
	var cIndex = 0;
	var geocoder = null;
	var height = 75;
	var height1 = 105;
	var laydate;
	var layid = 1;
	var count = 0;
	var msgCount = 0;
	var totalHeight;
	var panelOpenHeight;
	var subIndex = 0;
    var invIndex = -1;
    var subIndex1 = 0;
    var menuArr;
    $(function(){
    	totalHeight = $(window).height();
        //localStorage为本地存储。 在login.jsp中将获得的菜单html存储在localStorage中，进入主页后再取出并动态拼接
//        var headMenu = localStorage.getItem("headMenu");
        $('#sidebarMenu').append("${menuStr}");
        var secondMenu = $("#sidebarMenu");
       
        var span = secondMenu.find("span").eq(0).text();
        var href = "";
        secondMenu.eq(0).find("li").eq(0).attr("class", "child clearfix toggleSecondmenu cur");
        if(span == "首页") {
            href = secondMenu.eq(0).find("a").eq(0).attr("href");
        } else {
            href = secondMenu.eq(0).find("ul").eq(0).find("a").attr("href");
        }
        href = sessionStorage.getItem("curMenu");
        if(href == undefined) {
        	 href = "/business/jeeves/jeevesIndex.action";
        }
        //iframe默认加载首页
        setTimeout(function(){
            $('#content-iframe').attr('src', href);
        },100);

        //侧边栏点击展开二级菜单
        var $sidebarMenuLi = $('#sidebarMenu li');
        menuArr = $sidebarMenuLi;
        $sidebarMenuLi.click(function(ev){
            var curMenu = $(this).find("a").attr("href");
            if(curMenu) {
                sessionStorage.setItem("curMenu", curMenu);
            }
            if($(this).hasClass('child')){
                $(this).toggleClass('toggleSecondmenu');
                //return;
            }
            $sidebarMenuLi.removeClass('cur');
            $(this).addClass('cur');

            if($(this).parent().hasClass('second-menu')){
                $(this).parents('li').addClass('cur');
                ev.stopPropagation();
            }
        }); 
        $.each(menuArr, function(index, value, array){
      		 var curHref = $(this).find('a').attr("href");
      		 if(curHref == href) {
      			 $(this).toggleClass('toggleSecondmenu');
      			 $(this).addClass('cur');
      		 } else {
      			 $(this).removeClass('cur');
      		 }
      	}); 

        geocoder = new AMap.Geocoder();
        var data = {status: 1, dataReturnType: 1};
        sub(data);
        setInterval (function () {
            sub(data);
        }, 1000 * 60 * 5);
        
        layui.use(['layer', 'jquery', 'form', 'element', 'laypage', 'laydate'], function () {
            layer = layui.layer;
            element = layui.element;
            laypage = layui.laypage;
            laydate = layui.laydate;
            laydate.render({
    	        elem: '#time',
    	    });
            
            element.on('tab(change)', function(){
                var tabId = this.getAttribute('lay-id');
                if(tabId != 4) {
                    layid = tabId;
                }
            	var height = totalHeight * 0.7 - 285;
            	if(height < 200) {
            		height = 200;
            	}
            	// $("#msg-" + layid).css("height", (height) + "px");
            	var status = "";
            	if(tabId == 2) {
            		status = 1;
            	} else if(tabId == 3) {
            		status = 0;
            	} else if(tabId == 4) {
            		unread();
            		return;
            	}
            	var data = {status: status, page: 1, limit: 5};
            	sub1(data, layid);
            	render(layid, count);
            });
            
            $("#msg").hover(function(){
                if(subIndex != 0) {
                    return;
                }
                panelOpen(title, $("#msgContent"));
                cIndex = 0;
            },function() {
                cIndex = 1;
                invIndex = setInterval(function () {
                	if(cIndex == 1) {
                        layer.close(subIndex);
                        cIndex = 0;
                        clearInterval(invIndex);
                    }
                }, 1000);
            });
            $("#msgContent").hover(function(){
                cIndex = 0;
            }, function () {
                layer.close(subIndex);
                clearInterval(invIndex);
                cIndex = 0; 
            });
            
        });

        
    });
    
    function panelOpen(title, content) {
        if(panelOpenHeight > totalHeight*0.78) panelOpenHeight = totalHeight*0.78;
        var offsetX = $(window).width() - ($("#msgContent").width()+75) - $(".usercenter-menu").width();
        subIndex = layer.open({
            type : 1,
            offset:  ['55px', offsetX],
            shade: 0,
            title : title,
            anim : 0,
            area : ["auto", panelOpenHeight + "px"],
            content : content,
            end : function(){
                subIndex = 0;
            },
        });
    }

    var title = "";
    function viewInfo(url) {
        $("#content-iframe").attr("src", "/" + url);
    }

    function sub(data) {
        $.ajax({
            url: '../../business/message/queries.action',
            type: 'post',
            async: false,
            data: data,
            dataType: 'json',
            success: function (res) {
                if (0 == res.code) {
                    var data = res.data;
                	panelOpenHeight = 100 +  height * data.length;
                    var content = '<div style="margin-top: 10px;" id="msg-1-1">';
                    for(var i = 0, leg = data.length; i < leg; i++) {
                        if(i > 4) break;
                        var address = getAddress(data[i]);
                        var type = data[i].type;
                        if(type == 0) {
                        	type = "侧方闯入";
                        } else if(type == 1) {
                        	type = "后方闯入";
                        }
                       // if(i == 0) {
	                        content += '<p class="p p1">' + data[i].msgTxt + '</p>';
                      //  }
                        content += '<p class="p" onclick="warnDetail(\'' + data[i].deviceNum + '\', '+ data[i].id +')" style="cursor:pointer;">';
                        content += '<span class="sp" style="color:red;">' + type + '</span><br><span class="sp" id="' + data[i].deviceNum + '-'+data[i].id+'">' + address + '</span><br>';
                        content += '<span class="sp"> ' + new Date(data[i].startTime).format() + '</span>';
                        content += '</p><hr>';
                    }
                    content += '</div>';
                    content += '<div style="height: 40px;line-height:30px;text-align: center;text-align: center;">';
                    content += ' <a href="javascript:void(0)" id="all" style="font-size:12px;" onclick="allMsg()">查看全部>></a>';
                    content += '</div>';
                    document.getElementById("msgContent").innerHTML = content;
                    document.getElementById("msgCount").innerHTML = res.count;
                    msgCount = res.count;
                } else if ("2001" != res.code) {

                } 
            },
            error: function (xhr, e1, e2) {

            }
        });
    }
    
    function getAddress(data) {
        if(data.lng == 0 || data.lat == 0) {
            var lnglat = data.location;
            if(lnglat == undefined || 0 == lnglat.length || '未知路段' == lnglat) {
                return "未知路段";
            }
            var ll = lnglat.split(",");
            data.lng = ll[0];
            data.lat = ll[1];
        }
    	var lnglat = new AMap.LngLat(data.lng, data.lat);
    	geocoder.getAddress(lnglat, function(status, result) {
    		if (status === 'complete' && result.regeocode) {
    			var address = result.regeocode.formattedAddress;
    			$("#" + data.deviceNum+'-'+data.id).text(address);
    			return address;
    		} 
    	});
    }
    
    function getAddress1(data) {
    	if(data.lng == 0 || data.lat == 0) {
    		var lnglat = data.location;
    		if(lnglat == undefined || 0 == lnglat.length || '未知路段' == lnglat) {
    			return "未知路段";
    		}
        	var ll = lnglat.split(",");
        	data.lng = ll[0];
        	data.lat = ll[1];
    	}
    	var lnglat = new AMap.LngLat(data.lng, data.lat);
    	geocoder.getAddress(lnglat, function(status, result) {
    		if (status === 'complete' && result.regeocode) {
    			var address = result.regeocode.formattedAddress;
    			$("#" + data.deviceNumTxt).text(address);
    			return address;
    		} 
    	});
    }
    
    function warnDetail(deviceNum, mid) {
        $.post('/business/message/updates.action', {id: mid, status:1});//标记为已读
    	var url = '/business/warn/index.action?value=' + deviceNum;
    	layer.close(subIndex1);
    	$("#content-iframe").attr("src", url);
    	$.each(menuArr, function(index, value, array){
    		 var span = $(this).find('span').eq(0).text();
    		 if(span == "预警信息") {
    			 $(this).toggleClass('toggleSecondmenu');
    			 $(this).addClass('cur');
    		 } else {
    			 $(this).removeClass('cur');
    		 }
    	}); 
    }
    
    function jeevesDetail(jeevesNum, mid) {
        $.post('/business/message/updates.action', {id: mid, status:1});//标记为已读
        // return;
    	var url = '/business/jeeves/index.action?value=' + jeevesNum;
    	layer.close(subIndex1);
    	$("#content-iframe").attr("src", url);
    	$.each(menuArr, function(index, value, array){
    		 var span = $(this).find('span').eq(0).text();
    		 if(span == "占道管理") {
    			 $(this).toggleClass('toggleSecondmenu');
    			 $(this).addClass('cur');
    		 } else {
    			 $(this).removeClass('cur');
    		 }
    	}); 
    }
    
    function sub1(data, ind) {
    	var msgId = $("#msgId").val();
    	var time = $("#time").val();
    	var status = "";
    	if(ind == 2) {
    		status = 1;
    	} else if(ind == 3) {
    		status = 0;
    	}
    	data.msgId = msgId;
    	data.status = status;
        $.ajax({
            url: '/business/message/queries.action',
            type: 'post',
            async: false,
            data: data,
            dataType: 'json',
            success: function (res) {
                if (0 == res.code) {
                    var data = res.data;
                    count = res.count;
                    var content = '';
                    height = 110 +  height1 * data.length;
                    for(var i = 0, leg = data.length; i < leg; i++) {
                    	var address = null;
                    	if(data[i].msgId >= 2001) {
                    		 address = data[i].location;
                    	} else {
                    		 address = getAddress1(data[i]);
                    	} 
                        var type = data[i].type;
                        if(type == 0) {
                        	type = "侧方闯入";
                        } else if(type == 1) {
                        	type = "后方闯入";
                        }
                        var p1 = "p3";
                        if(data[i].status == 0) {
                        	p1 = "p4";
                        } 
                        var deviceNumTxt = data[i].deviceNum + "-" + ind + "-" + i;
                        data[i].deviceNumTxt = deviceNumTxt;
                        var warnState = 0;
                        content += '<div class="bs-msg">';
                        if(data[i].msgId == 1002) {
                       		content += '<p class="p ' + p1 + ' title"> 预警中</p>';
                       		content += '<p class="p ' + p1 + ' content"> 预警时间：' + new Date(data[i].startTime).format() + '</p>';
                       		warnState = 1;
                       	    content += '<p class="p ' + p1 + ' content">预警类型：' + type + '</p>';
                            content += '<p class="p ' + p1 + ' content">路段：<span id="' + deviceNumTxt + '">' + address + '</span>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="warnDetail(\'' + data[i].deviceNum + "-" + warnState + '\', '+ data[i].id +')" style="margin-left:10px;">查看预警信息</a>';
                        } else if(data[i].msgId == 1003) {
                        	content += '<p class="p ' + p1 + ' title"> 预警解除</p>';
                        	content += '<p class="p ' + p1 + ' content"> 预警时间：' + new Date(data[i].startTime).format() + '</p>';
                        	var endTime = data[i].endTime;
                        	if(endTime == undefined) {
                        		endTime = "";
                        	} else {
                        		endTime = new Date(data[i].endTime).format();
                        	}
                        	content += '<p class="p ' + p1 + ' content"> 预警解除时间：' + endTime + '</p>';
                        	warnState = 2;
                        	content += '<p class="p ' + p1 + ' content">预警类型：' + type + '</p>';
                            content += '<p class="p ' + p1 + ' content">占道路段：<span id="' + deviceNumTxt + '">' + address + '</span>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="warnDetail(\'' + data[i].deviceNum + "-" + warnState + '\', '+ data[i].id +')" style="margin-left:10px;">查看预警信息</a>';
                        } else if(data[i].msgId == 2001 || data[i].msgId == 2003) {
                            var name = (data[i].msgId == 2001?'封路':'占道')+'开始';
                       		content += '<p class="p ' + p1 + ' title"> '+name+'</p>';
                           	content += '<p class="p ' + p1 + ' content"> 开始时间：' + new Date(data[i].startTime).format() + '</p>';
                           	content += '<p class="p ' + p1 + ' content"> 任务路段：<span id="' + deviceNumTxt + '">' + address + '</span>&nbsp;&nbsp;';
                        } else if(data[i].msgId == 2002 || data[i].msgId == 2004) {
                            var name = (data[i].msgId == 2002?'封路':'占道')+'结束';
                        	var endTime = data[i].endTime?new Date(data[i].endTime).format():'--';
                    		content += '<p class="p ' + p1 + ' title"> '+name+'</p>';
                        	content += '<p class="p ' + p1 + ' content"> 开始时间：' + new Date(data[i].startTime).format() + '</p>';
                        	content += '<p class="p ' + p1 + ' content"> 结束时间：' + endTime + '</p>';
                        	content += '<p class="p ' + p1 + ' content"> 任务路段：<span id="' + deviceNumTxt + '">' + address + '</span>&nbsp;&nbsp;';
                        }
                        content += '<a href="javascript:void(0)" onclick="jeevesDetail(\'' + data[i].jeevesNum + '\', '+ data[i].id +')" style="margin-left:10px;">查看占道信息</a></p>';
                        content += '</div><hr>';
                    }
                    if(!content) {
                        content = '<img src="../../../resources/images/none.png" style="margin: 0 auto;display:block;">'
                    }
                    document.getElementById("msg-2-" + ind).innerHTML = content;

                    if(ind == 2) {
                        //document.getElementById("undoTitle").innerHTML = "未处理&nbsp;&nbsp;&nbsp;&nbsp;(" + count + ")";
                    }
                } else if ("2001" != res.code) {

                }
            },
            error: function (xhr, e1, e2) {

            }
        });
    }
    
    function unread() {
   		var act = "/business/message/updates.action";
   		var msg = "确认全部标记为已读吗?";
   		layer.confirm(msg, {icon: 3, title:'提示'}, function(index){
   			$.ajax({
   				url : act,
   				type : 'post',
   				async : false,
   				data : {status: 1},
   				dataType : 'json',
   				success : function(res) {
   					if (0 == res.code) {
   						layer.msg(res.msg,{icon: 6});
   						var data = {page: 1, limit: 5};
   						sub1(data, 1);
   						render(1, count);
   						element.tabChange('change', 1);
   						var data = {status: 1, dataReturnType: 1};
   						sub(data);
   					}  else if("2001" != res.code) {
   						layer.msg(res.msg, {anim : 6,icon: 5});
   					}
   				},
   				error : function(xhr, e1, e2) {
   				}
   			}); 
   		}, function(){
            element.tabChange('change', layid);
        });
    }
    
    function render(ind, count) {
        if(!$("#msg-2-"+ind).children(".bs-msg").length) {
            $("#msg-2-"+ind).html('<img src="../../../resources/images/none.png" style="margin: 0 auto;display:block;">');
            return;
        }
    	var page = 'page' + ind;
    	$("#" + page).css("margin-bottom: ", "0px");
    	laypage.render({
            elem: page,
          // height: totalHeight - 50,
            limit: 5,
            count: count,
            groups: 3,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first){
                data = {status: 1, page: obj.curr, limit: obj.limit};
                if(!first) {
                	sub1(data, layid);
                }
            }
        });
    }
    
    function allMsg() {
    	open("全部消息", ['45%', '70%']);
    }
    
    function open(title, area) {
        if(undefined == area) area = ['500px', '450px'];
        var data = {page: 1, limit: 5};
    	sub1(data, layid);
    	render(layid, count);
    	subIndex1 = layer.open({
            title: title,
            type: 1,
            closeBtn : 2,
            anim : 0,
            content : $("#allMsg"),
            area: area
        });
    }
    
    function menuSet(href) {
   		 $.each(menuArr, function(index, value, array){
   	  		 var curHref = $(this).find('a').attr("href");
   	  		 if(curHref == href) {
   	  			 $(this).toggleClass('toggleSecondmenu');
   	  			 $(this).addClass('cur');
   	  		 } else {
   	  			 $(this).removeClass('cur');
   	  		 }
   	  	}); 
    }

</script>

<div id="msgContent" style="display: none; margin: 0 25px;"></div>

</body>
</html>