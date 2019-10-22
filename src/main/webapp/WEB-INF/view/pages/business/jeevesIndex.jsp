<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>占道信息管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <%@include file="../../../../url.jsp"%>
  <%@include file="../../../../jquery.jsp"%>
  <%@include file="../../../../layui.jsp"%>
  <link rel="stylesheet" href="/resources/css/jeevesIndex.css">
  <script src="https://webapi.amap.com/maps?v=1.4.13&key=aac358a9f0f4fe77c099995c0b79f59d&&plugin=AMap.Driving,AMap.DistrictSearch,AMap.Geocoder,AMap.LngLat,AMap.MarkerClusterer"></script>
  <script type="text/javascript">
	 if(history.pushState && history.replaceState) {
		history.pushState(null, null, document.URL);
	    window.addEventListener('popstate', function () {
	        history.pushState(null, null, document.URL);
	    });
	}
  </script> 
</head>
<body>
	<div id="container"></div>
	<div class="task-no-loc-box"></div>
	<form class="layui-form search-box" lay-filter="search">
   		<div class="layui-form-item">
   			<div class="layui-input-inline">
   				<input type="text" name="searchText" class="layui-input" maxlength="20" placeholder="搜索路段/任务编号" autocomplete="off">
   			</div>
   			<div class="layui-input-inline" style="width:110px;">
   				<input type="text" id="time" name="time" class="layui-input"  placeholder="-时间-" autocomplete="off">
			</div>
   			<div class="layui-input-inline" style="width:130px;">
	     		<select name="jeevesState">
		      		<option value="">全部任务状态</option>
		      		<option value="1" selected="selected">在线</option>
		      		<option value="0">离线</option>
		      	</select>
	     	</div>
   			<div class="layui-input-inline" style="width:130px;">
	     		<select name="jeevesType">
		      		<option value="">全部任务类型</option>
		      		<option value="1">占道</option>
		      		<option value="2">封路</option>
		      	</select>
	     	</div>
	     	<div class="layui-input-inline" style="width: 130px;">
				<select name="warnState">
					<option value="">全部预警状态</option>
					<option value="1">预警中</option>
					<option value="2">已解除</option>
				</select>
			</div>
	     	<div class="layui-input-inline" style="width:130px;">
	      	<select name="warnType">
	      		<option value="">全部预警类型</option>
	      		<option value="0">侧方闯入</option>
	      		<option value="1">后方闯入</option>
	      	</select>
	     	</div>
	     	<div class="layui-input-inline">
	     		<button class="layui-btn layui-btn-radius layui-btn-primary" lay-submit lay-filter="sub" id="searchBtn">查询</button>	
	     		<button class="layui-btn layui-btn-radius layui-btn-primary" id="clearBtn">重置</button>
	     	</div>
	     	<div class="layui-input-inline">
	     		<input type="checkbox" title="自动刷新" lay-skin="primary" lay-filter="interval" checked>
	     	</div>
		</div>
	</form>
	<div class="right-panel">
		<div class="content-box task-box">
			<div class="header">
				<div class="title task left">占道任务（<span class="total-sum">--</span>）</div>
				<div class="tab-box right" style="display: none;">
					<div class="left active" data-field='state' data-value=''>全部</div>
					<div class="left" data-field='state' data-value='1'>在线</div>
					<div class="left" data-field='state' data-value='0'>离线</div>
				</div>
			</div>
			<div class="tbody">
				<p class="load">数据加载中 •••</p>
			</div>
			<div class="footbar">
				<p class="right"></p>
			</div>
		</div>
		<div class="content-box warn-box">
			<div class="header">
				<div class="title warn left">预警信息（<span class="total-sum">--</span>）</div>
				<div class="tab-box right" style="display: none;">
					<div class="left active" data-field='' data-value=''>全部</div>
					<div class="left" data-field='warnState' data-value='1'>预警中</div>
					<div class="left" data-field='warnState' data-value='2'>已解除</div>
				</div>
			</div>
			<div class="tbody">
				<p class="load">数据加载中 •••</p>
			</div>
			<div class="footbar">
				<p class="right"></p>
			</div>
		</div>
	</div>
	<div style="display:none;" id="no-data-template">
		<div class="no-data-box">
			<div class="no-data"></div>
		</div>
	</div>
  <script type="text/javascript" src="<%=basePath%>/resources/js/business/jeevesIndex.js"></script>
</body>
</html>