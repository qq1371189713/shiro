<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>占道信息管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />

<%@include file="../../../../url.jsp"%>
<%@include file="../../../../layui.jsp"%>

<!--   <link rel="stylesheet" type="text/css" href="https://a.amap.com/jsapi_demos/static/demo-center/css/prety-json.css"> -->
  <script src="https://webapi.amap.com/maps?v=1.4.13&key=aac358a9f0f4fe77c099995c0b79f59d&&plugin=AMap.Driving,AMap.DistrictSearch,AMap.Geocoder,AMap.LngLat,AMap.MarkerClusterer"></script>
  <script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script>
  <%@include file="../../../../jquery.jsp"%>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js" ></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/underscore-min.js" ></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/backbone-min.js" ></script>
  <script type="text/javascript" src='https://a.amap.com/jsapi_demos/static/demo-center/js/prety-json.js'></script>
  <script type="text/javascript">
	 if(history.pushState && history.replaceState) {
		history.pushState(null, null, document.URL);
	    window.addEventListener('popstate', function () {
	        history.pushState(null, null, document.URL);
	    });
	}
  </script> 
<head>

	<style type="text/css">
		html, body {
			width: 100%;
			height: 100%;
			background-color: #fff;
		}
		.layui-btn-radius {
			border-radius: 5px;
		}
		.map {
			position: absolute;
			top: 0;
			left: 0;
			right: 50%;
			bottom: 0;
			z-index: 5;
		}
		.full-map {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 5;
		}
		.map .scale {
			position: absolute;
			top: 15px;
			right: 20px;
			width: 38px;
			height: 38px;
			background-image: url(../../../../resources/images/jeeves/icon_unfold.png);
			-webkit-background-size: 100% 100%;
			background-size: 185% 185%;
			background-position: 50% 50%;
			z-index: 99;
			cursor: pointer;
		}
		.full-map .scale {
			background-image: url(../../../../resources/images/jeeves/icon_shrink.png);
		}
		.map .search-panel {
			position: absolute;
			top: 10px;
			right: 50px;
			z-index: 99;
		}
		.full-map .search-panel {
			right: 70px;
		}
		.search-panel .layui-form-item {
			margin-left: 20px;
		}
		.search-panel .layui-form-item .layui-input-inline {
			margin-top: 5px;
		}
		.right-panel {
			position: absolute;
			left: 50%;
			right: 0;
			top: 0;
			bottom: 50px;
			z-index: 4;
		}
		.right-panel .layui-card {
			height: 100%;
		}
		.layui-card-body.table-main {
			padding: 0 0 0 5px;
			overflow-y: auto;
			height: 100%;
		}
		.layui-card-body .page-component {
			position: fixed;
			left: 50%;
			right: 0;
			bottom: 0;
			background-color: #fff;
			border: 1px solid #e6e6e6;
			margin-left: 5px;
			padding-left: 10px;
		}
		.layui-card-body .page-component .layui-laypage {
			margin: 10px 0 5px 0;
		}
		table.bs-table {
			font-family: verdana,arial,sans-serif;
			font-size: 11px;
			line-height: 16px;
			color: #333333;
			border-width: 1px;
			border-color: #999999;
			border-collapse: collapse;
			width: 100%;
		}
		table.bs-table th {
			background-color:#F2F2F2;
			border-width: 1px;
			padding: 8px;
			border-style: solid;
			border-color: #e6e6e6;
		}
		table.bs-table td {
			border-width: 1px;
			padding: 8px;
			border-style: solid;
			border-color: #e6e6e6;
		}
		.bs-table-hover td{
			background: #F2F2F2;
		}
		.amap-info-contentContainer .amap-info-content {
			padding: 0;
		}
		.amap-info-content .bs-info-box {
			width: 400px;
		}
		.amap-info-content .bs-info-box .bs-title {
			height: 35px;
			line-height: 35px;
			padding: 0 15px;
			color: #fff;
		}
		.amap-info-content .bs-info-box .bs-info-conent {
			margin: 15px 25px;
			line-height: 24px;
		}
		.amap-info-content .bs-info-box .bs-info-toolbar {
			margin-top: 10px;
		}
        .amap-info-content .bs-info-box a {
        	color: #01AAED;
        	margin-right: 40px;
        }

	</style>

</head>
<body>
<input type="hidden" id="value" value="${value}">
<input type="hidden" id="wState">
<div id="mapcontainer" class="map" >
	<div class="layui-form search-panel" lay-filter="searchPanel">
		<div class="layui-form-item">
			<div class="layui-input-inline" style="width: 165px;">
				<input type="text" id="searchText" name="searchText" class="layui-input" maxlength="15" placeholder="占道编号/路段" value="${value}">
			</div>
			<div class="layui-input-inline" style="width: 120px;">
				<input type="text" id="time" name="time" class="layui-input" autocomplete="off" placeholder="-时间-">
			</div>
			<div class="layui-input-inline" style="width: 120px;">
				<select id="state" name="state">
					<option value="">-任务状态-</option>
					<option value="1">在线</option>
					<option value="0">离线</option>
				</select>
			</div>
			<div class="layui-input-inline" style="width: 120px;">
				<select id="type" name="type">
					<option value="">-占道类型-</option>
					<option value="1">占道</option>
					<option value="2">封路</option>
				</select>
			</div>
			<div class="layui-input-inline" style="width: 120px;">
				<select id="warnState" name="warnState">
					<option value="">-预警状态-</option>
					<option value="1">预警中</option>
					<option value="0">未预警</option>
					<option value="2">已解除</option>
				</select>
			</div>
			<div class="layui-input-inline" style="width: 150px;">
				<button class="layui-btn layui-btn-radius layui-btn-primary " id="searchBtn">查询</button>
				<button class="layui-btn layui-btn-radius layui-btn-primary clearBtn" id="clearBtn">重置</button>
			</div>
		</div>
	</div>
	<div id="scaleMAP" class="scale scale-normal"></div>
</div>
<div id="right-panel" class="right-panel">
	<div class="layui-card">
		<div class="layui-card-body table-main">
			<table id="jeevesTable" lay-filter="jeevesTable" style="width:100%;"></table>
			<!-- <div id="jeevesTable" style=""></div> -->
			<div id="page" class="page-component"></div>
		</div>
	</div>
</div>


<%--<div id="up-map-div">
	<div class="cen full1" id="full"></div>
</div>
 <div id="map" class="container">
	<div class="layui-form search-box" lay-filter="search">
		<div class="layui-form-item">
			<div class="layui-input-inline" style="width:165px;">
			<input type="text" id="searchText1" name="searchText" class="layui-input" maxlength="20" placeholder="占道编号/路段">
			</div>
			<div class="layui-input-inline" style="width: 120px;">
				<input type="text" id="time1" name="time" class="layui-input" placeholder="-时间-">
			</div>
			<div class="layui-input-inline" style="width:120px;">
				<select id="state1" name="state">
					<option value="">-任务状态-</option>
					<option value="1">在线</option>
					<option value="0">离线</option>
				</select>
			</div>
			<div class="layui-input-inline" style="width:120px;">
				<select id="type1" name="type">
					<option value="">-占道类型-</option>
					<option value="1">占道</option>
					<option value="2">封路</option>
				</select>
			</div>
			<div class="layui-input-inline" style="width:120px;">
				<select id="warnState1" name="warnState">
					<option value="">-预警状态-</option>
					<option value="1">预警中</option>
					<option value="0">未预警</option>
					<option value="2">已解除</option>
				</select>
			</div>
			<div class="layui-input-inline">
				<button class="layui-btn layui-btn-radius layui-btn-primary" id="searchBtn">查询</button>
				<button class="layui-btn layui-btn-radius layui-btn-primary" id="clearBtn">重置</button>
			</div>
		</div>
	</div>
	<div id="container" class="l map height" ></div>
	<div id="right" class="r">
		<div class="layui-card">
               <div class="layui-card-body" class="height">
               	<table id="jeevesTable" lay-filter="jeevesTable" style="width:100%;"></table>
               	<!-- <div id="jeevesTable" style=""></div> -->
               	<div id="page" style="border:1px solid #e6e6e6;"></div>
               </div>
           </div>
	</div>
</div>--%>
<%--<div id="up-map-div1" style="display: none;">
	<div class="cen full2" id="full1"></div>
	<!-- <div class="cen jeeves1" id="jeeves1"></div>
	<div class="cen warn1" id="warn1"></div> -->
</div>--%>

	<%--<div class="top1" id="top1" style="display: none;">
		<div class="layui-form" lay-filter="search1" style="float:right;margin-top: 20px; margin-right:70px;">
			<div class="layui-form-item">
				<div class="layui-input-inline" style="width: 120px;">
					<input type="text" id="searchText2" name="searchText" class="layui-input" maxlength="15" placeholder="占道编号/路段" value="${value}">
				</div>
				<div class="layui-input-inline" style="width: 90px;">
					<input type="text" id="time2" name="time" class="layui-input" autocomplete="off" placeholder="-时间-">
				</div>
				<div class="layui-input-inline" style="width: 120px;">
					<select id="state2" name="state">
						<option value="">-任务状态-</option>
						<option value="1">在线</option>
						<option value="0">离线</option>
					</select>
				</div>
				<div class="layui-input-inline" style="width: 120px;">
					<select id="type2" name="type">
						<option value="">-占道类型-</option>
						<option value="1">占道</option>
						<option value="2">封路</option>
					</select>
				</div>
				<div class="layui-input-inline" style="width: 120px;">
					<select id="warnState2" name="warnState">
						<option value="">-预警状态-</option>
						<option value="1">预警中</option>
						<option value="0">未预警</option>
						<option value="2">已解除</option>
					</select>
				</div>
				<div class="layui-input-inline" style="width: 150px;">
					<button class="layui-btn layui-btn-primary " id="searchBtn1">查询</button>
					<button class="layui-btn layui-btn-primary clearBtn" id="clearBtn1">重置</button>
				</div>
			</div>
		</div>
	</div>

	<div id="container1" style="display: none;"></div>--%>


<script type="text/html" id="opBar">
    <a class="layui-btn layui-btn-xs" lay-event="detail">详情</a>
     {{#  if(d.state == 0 ){ }}
        <a class="layui-btn layui-btn-xs" style="background-color: #777" lay-event="">结束</a>
    {{#  }else if(d.state == 1) { }}
        <a class="layui-btn layui-btn-xs" lay-event="unjeeves">结束</a>
    {{#  } }}
</script>

<script type="text/html" id="stateTmp">
    {{#  if(d.state == 0 ){ }}
        <span>已结束</span>
    {{#  }else if(d.state == 1) { }}
        <span>占道中</span>
    {{#  } }}
</script>

<!-- {{#  if(d.type == 0 ){ }}
        <span>封闭</span>
    {{#  }else if(d.type == 1) { }}
        <span>占道</span>
    {{#  } }} -->
<script type="text/html" id="typeTmp">
    --
</script>

<script type="text/html" id="warnTypeTmp">
    {{#  if(d.warnType == undefined ){ }}
        <span>--</span>
    {{#  }else if(d.type == 1) { }}
        <span>占道</span>
    {{#  } }}
</script>

<script type="text/html" id="endTimeTmp">
    {{#  if(d.endTime == undefined ){ }}
        <span>--</span>
    {{#  }else if(d.endTime != undefined) { }}
        <span>{{ new Date(d.endTime).format() }}</span>
    {{#  } }}
</script>

<script type="text/javascript" src="<%=basePath%>/resources/tools/Map.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/tools/Set.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/business/jeeves.js"></script>
</body>

</html>