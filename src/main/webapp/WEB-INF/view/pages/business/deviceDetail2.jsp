<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>设备管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="../../../../url.jsp"%>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>
<head>
	<style type="text/css">
		p {
			height: 30px;
		}
	</style>
</head>
<body>

<div id="detail" class="layui-fluid">
	<input type="hidden" id="id" value="${id}">
	<input type="hidden" id="number" value="${number}">
	<input type="hidden" id="img" value="${img}">
	<input type="hidden" id="msg" value="${msg}">
	<c:if test="${msg != '1' }">
		<div class="layui-row" style="padding-top: 10px;">
			<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">
				<img id="img2" src="../../../resources/images/unknown.png" width="120" height="120">
			</div>
			<div class="layui-col-xs3 layui-col-sm3 layui-col-md3" style="">
				<p>设备编号：<span id="deviceId1"></span></p>
				<p>设备类型：<span id="deviceType"></span>所属团队：<span id="term">XX高速</span></p>
				<p>使用状态：<span id="state"></span></p>
			</div>
		</div>
		<div class="layui-row">
			<div class="layui-card">
				<div class="layui-card-header">实时状态</div>
	        	<div class="layui-card-body">
	        		<div class="layui-row">
	        			<div class="layui-col-xs6 layui-col-sm6 layui-col-md6">
	        				设备状态:在线
	        			</div>
	        			<div class="layui-col-xs6 layui-col-sm6 layui-col-md6">
	        				设备位置:深圳市福田区下沙
	        			</div>
	        		</div>
	        		<div class="layui-row">
	        			<div class="layui-col-xs12 layui-col-sm12 layui-col-md12">
	        				剩余电量:85%      200mA,    预计可用15分钟
	        			</div>
	        		</div>
	        	</div>
	        </div>
	        <hr class="layui-bg-gray">
	        <div class="layui-card">
				<div class="layui-card-header">使用记录</div>
	        	<div class="layui-card-body" style="">
	        		<div class="layui-row">
	        			<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">累计使用时长：30分</div>
	        			<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">使用次数：30</div>
	        		</div>
	        		<div class="layui-row">
	        			<table id="useTable" lay-filter="useTable"></table>
	        		</div>
	        	</div>
	        </div>
	        <hr class="layui-bg-gray">
	        <div class="layui-card">
				<div class="layui-card-header">维修记录</div>
	        	<div class="layui-card-body">
	        		<table id="repairTable" lay-filter="repairTable"></table>
	        	</div>
	        </div>
		</div>
	</c:if>
	<c:if test="${msg == '1' }">
		 <div style="text-align:center;font-size:18px;padding-top:10px;color:red;">未查询到设备信息</div>
	</c:if>
</div>

<script type="text/javascript" src="<%=basePath%>/resources/js/business/deviceDetail.js"></script>

</body>
</html>