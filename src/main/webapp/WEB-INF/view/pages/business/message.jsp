<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
<title>设备管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="../../../../url.jsp"%>
<script src="https://webapi.amap.com/maps?v=1.4.13&key=aac358a9f0f4fe77c099995c0b79f59d&&plugin=AMap.Geocoder,AMap.LngLat"></script>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>
    </head>
    <style type="text/css">
    	
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
		
		.p {
		
		}
		
		.p1{
			font-weight: bold;
		}
		
		.p2 {
			color: #6669;
		}
		
		.footer {
		    position: absolute;
		    bottom: 10px;
		    height: 50px;
		    border: 1px solid #e6e6e6;
		    padding: 0px 10px;
		    clear: both;
		}
		
    </style>
<body id="container" class="layui-fluid" style="top: 15px;">
<fieldset class="layui-elem-field">
  <div class="layui-field-box">
    通知
  </div>
</fieldset>
<div class="layui-form" lay-filter="search">
	<div class="layui-form-item">
		<div class="layui-input-inline" style="width: 180px;">
			<input type="text" id="time" name="time" class="layui-input" placeholder="全部时间">
		</div>
		<div class="layui-input-inline text1">
		  	<select id="msgId" name="msgId">
		  		<option value="">全部通知类型</option>
		  		<option value="1002">新预警信息</option>
		  		<option value="1003">解除预警信息</option>
		  		<option value="">新占道任务</option>
		  	</select>
 		</div>
	 	<div class="layui-input-inline" style="width: 250px;">
	 		<!-- <button class="layui-btn layui-btn-primary layui-btn-sm" id="clearBtn">重置</button> -->
	 		<button class="layui-btn layui-btn-primary layui-btn-sm" id="searchBtn">查询</button>
	 	</div>
	 	<div class="rdiv">
	 		<button class="layui-btn layui-btn-primary layui-btn-sm" id="readBtn">全部标记为已读</button>		 
	 	</div>
 	</div>
</div>
<div class="layui-tab layui-tab-brief" style="background-color: white; " lay-filter="change">
    <ul class="layui-tab-title" style="">
        <li class="layui-this" lay-id="1">全部</li>
        <li lay-id="2">未读</li>
        <li lay-id="3">已读</li>
    </ul>
    <div class="layui-tab-content">
        <div class="layui-tab-item layui-show" id="msgContent1">
           <div style="margin-top: 10px;" id="msg-1">
           </div>
           <div style="text-align: center;" class="footer">
               <div id="page1"></div>
           </div>
        </div>
        <div class="layui-tab-item" id="msgContent2">
            <div style="margin-top: 10px;" id="msg-2">
            </div>
            <div style="text-align: center;" class="footer">
                <div id="page2"></div>
            </div>
        </div>
        <div class="layui-tab-item" id="msgContent3">
            <div style="margin-top: 10px;" id="msg-3">
            </div>
            <div style="text-align: center;" class="footer">
                <div id="page3"></div>
            </div>
        </div>
    </div>
</div>

<script>
	var layer;
	var element;
	var laypage;
	var geocoder;
	var totalHeight;
	var layid = 1;
	var height = 75;
	var count = 0;
    $(function () {
    	totalHeight = $(window).height();
    	$("#container").css("height", (totalHeight - 15)+"px");
    	geocoder = new AMap.Geocoder();
    	
        //注意：选项卡 依赖 element 模块，否则无法进行功能性操作
        layui.use(['layer', 'form', 'element', 'laypage', 'laydate'], function(){
            layer = layui.layer;
            element = layui.element;
            laypage = layui.laypage;
            var laydate = layui.laydate;
            laydate.render({
    	        elem: '#time',
    	    });
            var data = {status: 1, page: 1, limit: 10};
            sub(data, layid);
            render(layid, count);
            element.on('tab(change)', function(){
            	layid = this.getAttribute('lay-id');
            	var data = {status: 1, page: 1, limit: 10};
            	sub(data, layid);
            	render(layid, count);
            });
            
        });
        
        $("#readBtn").click(function() {
        	if(layid == 1|| layid == 2) {
        		console.log("count:" + layid)
        		unread();
        	}
        });
        
        $("#searchBtn").click(function() {
        	var data = {status: 1, page: 1, limit: 10};
        	data.msgId = $("#msgId").val();
        	var time = $("#time").val();
        	var startTime;
        	var endTime;
        	if(time.length > 0) {
        		startTime = time + " 00:00:00";
            	endTime = time + " 23:59:59";
        	}
        	data.startTime = startTime;
        	data.endTime = endTime;
        	sub(data, layid);
        	render(layid, count);
        });
        
    });
    
    function sub(data, ind) {
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
                    height = 110 +  height * data.length;
                    for(var i = 0, leg = data.length; i < leg; i++) {
                        var address = getAddress(data[i]);
                        var type = data[i].type;
                        if(type == 0) {
                        	type = "侧方闯入";
                        } else if(type == 1) {
                        	type = "后方闯入";
                        }
                        var p1 = "p1";
                        if(data[i].status == 0) {
                        	p1 = "p2";
                        }
	                    content += '<p class="p ' + p1 + '">' + data[i].msgTxt + '</p>';
                        content += '<p class="p ' + p1 + '" onclick=warnDetail("' + data[i].deviceNum + '")>';
                        var deviceNumTxt = data[i].deviceNum + "-" + ind + "-" + i;
                        data[i].deviceNumTxt = deviceNumTxt;
                        content += '<a><span class="p ' + p1 + '">' + type + '</span>&nbsp;&nbsp;<span class="p ' + p1 + '" id="' + deviceNumTxt + '">' + address + '</span></a><br>';
                        content += '<span class="p ' + p1 + '"> ' + new Date(data[i].startTime).format() + '</span>';
                        content += '</p><hr>';
                    }
                    document.getElementById("msg-" + ind).innerHTML = content;
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
   			var subLoadIndex = layer.load(2);
   			$.ajax({
   				url : act,
   				type : 'post',
   				async : false,
   				data : {status: 1},
   				dataType : 'json',
   				success : function(res) {
   					if (0 == res.code) {
   						layer.msg(res.msg,{icon: 6});
   						var data = {page: 1, limit: 10};
   						sub(data, 1);
   						render(1, count);
   					}  else if("2001" != res.code) {
   						layer.msg(res.msg, {anim : 6,icon: 5});
   					}
   					layer.close(subLoadIndex);
   				},
   				error : function(xhr, e1, e2) {
   				}
   			}); 
   		});
    }
    
    function render(ind, count) {
    	var page = 'page' + ind;
    	$("#" + page).css("margin-bottom: ", "0px");
    	laypage.render({
            elem: page,
            height: totalHeight - 50,
            limit: 10,
            limits: [10, 20],
            count: count,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
            jump: function(obj, first){
                data = {status: 1, page: obj.curr, limit: obj.limit};
                if(!first) {
                	sub(data, layid);
                }
            }
        });
    }
    
    function getAddress(data) {
    	var lnglat = new AMap.LngLat(data.lng, data.lat);
    	geocoder.getAddress(lnglat, function(status, result) {
    		if (status === 'complete' && result.regeocode) {
    			var address = result.regeocode.formattedAddress;
    			$("#" + data.deviceNumTxt).text(address);
    			return address;
    		} 
    	});
    }
    
    function warnDetail(deviceNum) {
    	var url = '/business/warn/index.action?value=' + deviceNum;
    	$("#content-iframe").attr("src", url);
    	/* $.each(menuArr, function(index, value, array){
    		
    		 console.log(value)
    		 /* if($(this).hasClass('warnManage')) {
    			 console.log(value)
    		 } else {
    			 console.log("Aaa")
    		 } 
    		 
    	}); */
    }
    
</script>
</body>
</html>
