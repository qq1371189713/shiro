<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>设备管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="../../../../url.jsp"%>
<script src="https://webapi.amap.com/maps?v=1.4.13&key=aac358a9f0f4fe77c099995c0b79f59d&&plugin=AMap.Geocoder,AMap.LngLat"></script>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>
<head>
	<style type="text/css">
		.layui-layer-title {
		    font-size: 20px;
		    color: #1361ff;
		}
	    
	    .layui-card-header {
		    color: #575b63;
		    font-size: 16px;
		}
		
		.content {
			font-size: 14px;
		    color: #777777;
		}
		
		.warnCount, .warnCount1, .warnCount2, .device, .device1, .device2 {
			color: #2691ff;
		}
		
		.layui-tab-brief > .layui-tab-title .layui-this {
		    color: #fff;
		    border-radius: 100px;
		    background-color: #1E9FFF;
		}
		
		.layui-tab-title {
		    border-bottom-style: none;
		    color: #777777;
		}
		
		.layui-tab-brief > .layui-tab-more li.layui-this::after, .layui-tab-brief > .layui-tab-title .layui-this::after {
		    border-bottom: 0px solid #eee;
		}
		/* body {
			font-size: 14px;
		    color: #777777;
		} */
	</style>
</head>
<body>

<script type="text/html" id="startTimeTmp">
    {{#  if(d.startTime == undefined){ }}
        <span>--</span>
    {{#  }else if(d.startTime != undefined) { }}
       {{ new Date(d.startTime).format() }}
    {{#  } }}
</script>

<script type="text/html" id="endTimeTmp">
    {{#  if(d.endTime == undefined){ }}
        <span>--</span>
    {{#  }else if(d.endTime != undefined) { }}
       {{ new Date(d.endTime).format() }}
    {{#  } }}
</script>

<script type="text/html" id="warnStateTmp">
    {{#  if(d.state == 0 ){ }}
        <span>未预警</span>
    {{#  }else if(d.state == 1) { }}
        <span>预警中</span>
	{{#  }else if(d.state == 2) { }}
 		<span>已解除</span>
    {{#  } }}
</script>

<script type="text/html" id="warnTypeTmp">
    {{#  if(d.type == 0 ){ }}
        <span>侧方闯入</span>
    {{#  }else if(d.type == 1) { }}
        <span>后方闯入</span>
    {{#  } }}
</script>

<script type="text/html" id="addressTmp">
    <a class="layui-btn layui-btn-xs" lay-event="address">查看地址</a>
</script>

<script type="text/html" id="typeTmp">
    {{#  if(d.type == 1 ){ }}
        <span>中间设备</span>
    {{#  }else if(d.type == 2) { }}
        <span>起点设备</span>
    {{#  }else if(d.type == 3) { }}
        <span>终点设备</span>
    {{#  } }}
</script>

<script type="text/html" id="battTmp">
    {{#  if(d.batt == undefined ){ }}
        <span>--</span>
    {{#  }else if(d.batt != undefined) { }}
        <span><img alt="" src="{{d.battImg}}" style="width:60%;"></span>
    {{#  } }}
</script>

<script type="text/html" id="expStateTmp">
    {{# if(d.expState == undefined ){ }}
        <span>正常</span>
    {{# } else if(d.expState != undefined) { }}
        <span>异常</span>
	{{# } }}
</script>

<script type="text/html" id="keyStateTmp">
    {{# if(d.keyState == undefined ){ }}
        <span>--</span>
    {{# } else if(d.keyState == 1) { }}
        <span>占道</span>
    {{# } else if(d.keyState == 2) { }}
        <span>封路</span>
	{{# } else if(d.keyState == 0) { }}
        <span>关闭</span>
	{{# } else if(d.keyState == 4) { }}
		<span>正常使用中</span>
	{{# } }}
</script>

<div id="detail" class="layui-fluid">
	<input type="hidden" id="data" value='${data}'>
	<input type="hidden" id="msg" value="${msg}">
	<c:if test="${msg != '1' }">
		<div class="layui-row" style="padding-top: 20px; padding-bottom: 10px;">
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4 content">
				占道任务编号:<span id="number"></span>
			</div>
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4 content">
				占道任务发布时间：<span id="releaseTime"></span>
			</div>
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4 content">
				占道任务发布人：<span id="releaseName"></span>
			</div>
		</div>
		<div class="layui-row" style="padding-top: 10px;padding-bottom: 20px;">
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4 content">
				占道状态: &nbsp;<span id="state"></span>
			</div>
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4 content">
				预警次数:&nbsp;
				<span id="count" class="warnCount">4</span>（侧方闯入预警
				<span class="warnCount1"></span> 次；后方闯入预警 
				<span class="warnCount2"></span> 次）
			</div>
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4 content">
				占道设备:&nbsp;
				<span id="device" class="device"></span>（中间设备
				<span id="device1" class="device1"></span>；起/终点设备
				<span id="device2" class="device2"></span>）
			</div>
		</div>
		<div class="layui-row">
			<div class="layui-card">
	        	<div class="layui-card-body">
	        		<div class="layui-tab layui-tab-brief" lay-filter="change">
					  <ul class="layui-tab-title">
					    <li lay-id="1" class="layui-this ">占道申请</li>
					    <li lay-id="2" class="">预警信息</li>
					    <li lay-id="3" class="">占道设备</li>
					  </ul>
					  <div class="layui-tab-content">
					  	<div class="layui-tab-item layui-show">
					  		<div style="padding: 5px 15px;color: #3d58f4;font-size: 16px;">占道申请</div>
					  		<div style="padding: 5px 15px; font-size: 14px; color: black;"><span style="color: #3d58f4;padding:0px 2px;">|</span>&nbsp;负责人及联系方式</div>
							  <div class="layui-field-box">
							  	  <div class="layui-row">
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">管理单位:<span id="">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">管理单位负责人:<span id="">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">管理单位联系电话:<span id="tel">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">管理单位联系地址:<span id="">-</span></div>
							  	  </div>
							  	  <div class="layui-row">
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">施工单位:<span id="company">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">施工单位负责人:<span id="chargeName">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">施工单位联系电话:<span id="chargePhone">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">施工单位联系地址:<span id="">-</span></div>
							  	  </div>
							  	  <div class="layui-row">
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">现场安全员:<span id="safeName">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">现场安全员联系方式:<span id="safePhone">-</span></div>
							  	  </div>
							  </div>
							  <div style="padding: 5px 15px; font-size: 14px; color: black;"><span style="color: #3d58f4;padding:0px 2px;">|</span>&nbsp;占道详情</div>
							  <div class="layui-field-box">
							    <div class="layui-row">
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">占道路段名称:<span id="roadName">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">路线编码:<span id="lxName">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">方向:<span id="direction">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">占道情况:<span id="useLane">-</span></div>
							  	  </div>
							  	  <div class="layui-row">
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">起点桩号:<span id="bsTake">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">起点桩号坐标:<span id="bsTakeAddr">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">终点桩号:<span id="esTake">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">终点桩号坐标:<span id="esTakeAddr">-</span></div>
							  	  </div>
							  	  <div class="layui-row">
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">占道开始时间:<span id="prebTime">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">占道结束时间:<span id="preeTime">-</span></div>
							  	  </div>
							  	  <div class="layui-row">
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">施工作业方式:<span id="taskMode">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">施工作业设备:<span id="">-</span></div>
							  	  	  <div class="layui-col-xs3 layui-col-sm3 layui-col-md3 content">施工作业人数:<span id="personNum">-</span></div>
							  	  </div>
							  	  <div class="layui-row">
							  	  	  <div class="layui-col-xs12 layui-col-sm12 layui-col-md12 content">占道原因描述:<span id="zdContent">-</span></div>
							  	  </div>
							  </div>
					  	</div>
					  	<div class="layui-tab-item">
					  		<div class="" style="padding: 5px 15px;color: #3d58f4;font-size: 16px;">预警信息</div>
					  		<div class="layui-row content">
			        			预警次数:&nbsp;
			        			<span id="count" class="warnCount">4</span>（侧方闯入预警
								<span class="warnCount1"></span> 次；后方闯入预警 
								<span class="warnCount2"></span> 次）
			        		</div>
			        		<div class="layui-row">
			        			<table id="warnTable" lay-filter="warnTable"></table>
			        		</div>
					  	</div>
					  	<div class="layui-tab-item">
					  		<div class="" style="padding: 5px 15px;color: #3d58f4;font-size: 16px;">占道设备</div>
					  		<div class="layui-row content">
			        			占道设备:&nbsp;
								<span id="device" class="device"></span>（中间设备
								<span id="device1" class="device1"></span>；起/终点设备
								<span id="device2" class="device2"></span>）
			        		</div>
			        		<table id="repairTable" lay-filter="repairTable"></table>
					  	</div>
					  </div>
					 </div>
	        	</div>
	        </div>
		</div>
	</c:if>
	<c:if test="${msg == '1' }">
		 <div style="text-align:center;font-size:18px;padding-top:10px;color:red;">未查询到占道信息</div>
	</c:if>
</div>

<div id="container" style="display: none; width:100%; height:100%"></div>

<script type="text/html" id="deviceTypeTmp">
    {{#  if(d.deviceType == 1 ){ }}
        <span>中间设备</span>
    {{#  }else if(d.deviceType == 2) { }}
        <span>起点设备</span>
    {{#  }else if(d.deviceType == 3) { }}
        <span>终点设备</span>
    {{#  } }}
</script>
<script type="text/javascript" src="<%=basePath%>/resources/js/business/jeevesDetail.js"></script>

</body>
</html>