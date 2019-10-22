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
		body {
			font-size: 14px;
		    color: #777777;
		}
		p {
			height: 30px;
		}
		.layui-elem-quote {
		    margin-bottom: 10px;
		    padding: 5px;
		    line-height: 22px;
		    border-left: 5px solid #445ef5;
		    border-radius: 0 2px 2px 0;
		    background-color: #f2f2f2;
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
		
		.title {
			color: black;
			font-size: 14px;
		}
		.tb {
			padding: 2.5px 0px;
		}
	</style>
</head>
<body>

<script type="text/html" id="endTmp">
    {{#  if(d.endTime == undefined ){ }}
        <span>---</span>
    {{#  }else if(d.endTime != undefined) { }}
		{{ new Date(d.endTime).format() }}
    {{#  } }}
</script>
<script type="text/html" id="startTmp">
    {{#  if(d.startTime == undefined ){ }}
        <span>---</span>
    {{#  }else if(d.startTime != undefined) { }}
		{{ new Date(d.startTime).format() }}
    {{#  } }}
</script>


<script type="text/html" id="addressTmp">
    <a class="layui-btn layui-btn-xs" lay-event="address">查看开机地点</a>
</script>

<div id="detail" class="layui-fluid">
	<input type="hidden" id="data" value='${data}'>
	<c:if test="${msg != '1' }">
		<div class="layui-row" style="padding-top: 10px;">
			<!-- <div class="layui-col-xs3 layui-col-sm3 layui-col-md3">
				<img id="img2" src="../../../resources/images/unknown.png" width="120" height="120">
			</div> -->
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4" style="padding-top: 10px;">
				<p>设备编号：<span id="deviceId1">--</span>&nbsp;&nbsp;</p>
			</div>
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4" style="padding-top: 10px;">
				<p>设备状态：<span id="state">--</span></p>
			</div>
		</div>
		<div class="layui-row">
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4" style="padding-top: 10px;">
				<p>设备类型：<span id="deviceType">--</span>&nbsp;&nbsp;</p>
			</div>
			<div class="layui-col-xs4 layui-col-sm4 layui-col-md4" style="padding-top: 10px;">
				<p>所属团队：<span id="team">--</span>&nbsp;&nbsp;</p>
			</div>
		</div>
		<div class="layui-row">
			<div class="layui-col-xs6 layui-col-sm6 layui-col-md6" style="padding-top: 10px;">
				<p>购买时间：<span id="buyTime">--</span></p>
			</div>
		</div>
		<div class="layui-row">
			<div class="layui-card">
	        	<div class="layui-card-body" style="padding-top: 20px;">
	        		<div class="layui-tab layui-tab-brief" lay-filter="change">
					  <ul class="layui-tab-title">
					    <li lay-id="1" class="layui-this">实时状态</li>
					    <li lay-id="3">任务记录</li>
					    <li lay-id="2">上下线记录</li>
					    <!-- <li>设备基本信息</li> -->
					    <li lay-id="4">版本记录</li>
					    <!-- <li lay-id="5">维修/报废</li> -->
					  </ul>
					  <div class="layui-tab-content">
					  	<div class="layui-tab-item layui-show">
					  		<div class="layui-row tb">
					  			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
					  				<div class="title"><span style="color: #3d58f4;padding:0px 2px;">|</span>&nbsp;基本信息</div>
					  			</div>
					  		</div>
					  		<div class="layui-row tb">
					  			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
					  				初始组网情况：<span id="zw">--</span>&nbsp;&nbsp;
					  				<img id="zuwang1" src="../../../../resources/images/zuwang.png" style="display: none;">
					  			</div>
					  		</div>
					  		<div class="layui-row tb">
					  			<div class="layui-col-xs6 layui-col-sm6 layui-col-md6">
					  				设备状态：<span id="online">--</span>
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				剩余电量：<span id="batt"></span>
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				GPS: <span id="gps">--</span>
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达: <span id="leida">--</span>
					  			</div>
					  		</div>
					  		<div class="layui-row tb">
					  			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
					  				设备位置: <span id="location">--</span>
					  			</div>
					  		</div>
					  		<div class="layui-row tb">
					  			<div class="layui-col-xs6 layui-col-sm6 layui-col-md6">
					  				上线时间：<span id="onlineTime">--</span>
					  			</div>
					  			<div class="layui-col-xs6 layui-col-sm6 layui-col-md6">
					  				在线时长：<span id="timeRemark">--</span>
					  			</div>
					  		</div>
					  		<div class="layui-row tb" style="padding: 10px 0px;">
					  			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
					  				<div class="title"><span style="color: #3d58f4;padding:0px 2px;">|</span>&nbsp;任务信息</div>
					  			</div>
					  		</div>
					  		<div class="layui-row tb">
					  			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
					  				按键状态：<span id="key">--</span>
					  			</div>
					  		</div>
					  		<div class="layui-row tb">
					  			<div class="layui-col-xs6 layui-col-sm6 layui-col-md6">
					  				开始时间：<span id="startTime">--</span>
					  			</div>
					  			<div class="layui-col-xs6 layui-col-sm6 layui-col-md6">
					  				结束时间：<span id="endTime">--</span>
					  			</div>
					  		</div>
					  		<%--<div class="layui-row tb">--%>
					  			<%--<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">--%>
					  				<%----%>
					  			<%--</div>--%>
					  			<%--<div class="layui-col-xs6 layui-col-sm6 layui-col-md6">--%>
					  				<%--LORA(在组网设备数量):&nbsp;<span id="lora">--</span>&nbsp;&nbsp;--%>
					  				<%--<img id="zuwang" src="../../../../resources/images/zuwang.png" style="display: none;">--%>
					  			<%--</div>--%>
					  			<%--<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">--%>
					  				<%----%>
					  			<%--</div>--%>
					  		<%--</div>--%>
					  	</div>
					    <div class="layui-tab-item">
					    	<div class="layui-row">
					  			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
					  				<table id="jeevesTable" lay-filter="jeevesTable"></table>
					  			</div>
					  		</div>
						</div>
					    <div class="layui-tab-item">
					    	<div class="layui-row">
					  			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
					  				<table id="onlineTable" lay-filter="onlineTable"></table>
					  			</div>
					  		</div>
						</div>
					    <!-- <div class="layui-tab-item">
					    	<div class="layui-row">
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				硬件版本号:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				软件版本号:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				操作系统:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				平台:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				主频:
					  			</div>
					  		</div>
					  		<div class="layui-row">
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				内存:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				网络模式:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				GPS芯片:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				LORA芯片:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				地磁（兼容）:
					  			</div>
					  		</div>
					  		<div class="layui-row">
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				G-SENSOR:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				显示屏（选配）:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				工作环境:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				摄像头（选配）:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				接口:
					  			</div>
					  		</div>
					  		<div class="layui-row">
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				喇叭:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				LED灯:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				卡座:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				按键:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				开关:
					  			</div>
					  		</div>
					  		<div class="layui-row">
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				MIC（选配）:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				PA:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				GPS天线:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				2G天线:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				LORA:
					  			</div>
					  		</div>
					  		<div class="layui-row">
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达探测距离:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达探测距离精度:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达测速范围:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达测速精度:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达波束覆盖角度:
					  			</div>
					  		</div>
					  		<div class="layui-row">
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达响应时间:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达工作温度:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达防护等级:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达安装高度:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达供电电压:
					  			</div>
					  		</div>
					  		<div class="layui-row">
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达功率:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达发射频率:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达发射功率:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达带宽:
					  			</div>
					  			<div class="layui-col-xs2 layui-col-sm2 layui-col-md2">
					  				雷达通讯接口:
					  			</div>
					  		</div>
					    </div> -->
					    <div class="layui-tab-item">
					    	<div class="layui-row">
					  			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
					  				软件版本信息
					  				<table id="softVerTable" lay-filter="softVerTable"></table>
					  			<!-- 	硬件版本信息
					  				<table id="hardVerTable" lay-filter="hardVerTable"></table> -->
					  			</div>
					  		</div>
					    </div>
					    <!-- <div class="layui-tab-item">
					    	<div class="layui-card">
								<div class="layui-card-header">维修记录</div>
					        	<div class="layui-card-body">
					        		<table id="repairTable" lay-filter="repairTable"></table>
					        	</div>
					        </div>
					        <div class="layui-card">
								<div class="layui-card-header">报废记录</div>
					        	<div class="layui-card-body">
					        		<table id="scrapTable" lay-filter="scrapTable"></table>
					        	</div>
					        </div>
					    </div> -->
					  </div>
					</div>      
	        	</div>
	        </div>
		</div>
	</c:if>
	<c:if test="${msg == '1' }">
		 <div style="text-align:center;font-size:18px;padding-top:10px;color:red;">未查询到设备信息</div>
	</c:if>
</div>

<div id="container" style="display: none; width:100%; height:100%"></div>


<script type="text/javascript" src="<%=basePath%>/resources/js/business/deviceDetail.js"></script>

</body>
</html>