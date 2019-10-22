<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>占道信息管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />

<%@include file="../../../../url.jsp"%>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>

  <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" />
  <link rel="stylesheet" type="text/css" href="https://a.amap.com/jsapi_demos/static/demo-center/css/prety-json.css">
  <script src="https://webapi.amap.com/maps?v=1.4.13&key=aac358a9f0f4fe77c099995c0b79f59d&&plugin=AMap.DistrictSearch,AMap.Geocoder,AMap.LngLat,AMap.Driving"></script>
  <script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script>
   <script type="text/javascript" src="https://cache.amap.com/lbs/static/addToolbar.js"></script>
  <%@include file="../../../../jquery.jsp"%>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js" ></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/underscore-min.js" ></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/backbone-min.js" ></script>
  <script type="text/javascript" src='https://a.amap.com/jsapi_demos/static/demo-center/js/prety-json.js'></script>
<head>

	<style type="text/css">
		#up-map-div {
		    width: 80px;
		    top: 90px;
		    right: 50%;
		    position: absolute;
		    z-index: 9999;
		    text-align: center;
		}
		
		#up-map-div1 {
		    width: 80px;
		    top: 90px;
		    right: 0%;
		    position: absolute;
		    z-index: 9999;
		    text-align: center;
		}
		
		.cen {
			padding: 10px;
			height: 70px;
		}
		
		.layui-form-pane .layui-form-label {
		    width: 160px;
		    padding: 8px 15px;
		    height: 38px;
		    line-height: 20px;
		    border-width: 1px;
		    border-style: solid;
		    border-radius: 2px 0 0 2px;
		    text-align: right; 
		    background-color: #FBFBFB;
		    overflow: hidden;
		    white-space: nowrap;
		    text-overflow: ellipsis;
		    box-sizing: border-box;
		}
		
		.layui-form-pane .layui-input-block {
		    margin-left: 160px;
		    left: -1px;
		}
		
		.layui-form-item .layui-input-inline {
		    float: left;
		    width: 130px;
		    margin-right: 5px;
		    font-size: 12px;
		}
		
		.top-div {
		    width: 80%;
		    height: 60px;
		    line-height: 60px;
		    top: 0px;
		    left: 0px;
		    padding-bottom: 10px;
		    padding-left: 10px;
		    margin: 0 auto;
		    min-width: 960px;
		}
		
		.div-cell {
		    width: 33%;
		    padding-top: 10px;
		    float: left;
		    text-align: center;
		}
		
		.cell {
			width: 80%;
			height: 50px;
			line-height: 50px;
		    color: #555;
		    margin: 0 auto;
		}
		
		.cell1 {
		   /*  height: 15px;
		    line-height: 15px;
		    padding: 5px 0px; */
		}
		
		.container {
			width: 99%;
			height: 99%;
			margin: 10px;
		}
		
		.top {
			height: 70px; 
			margin-bottom: 10px;
			background-color: white;
		}
		
		.top1 {
			height: 70px; 
			margin-bottom: 10px;
			background-color: white;
			position: absolute;
		    z-index: 9999;
		    width: 100%;
		}
		
		.l {
			position: relative;
			float: left;
			width: 50%;
			min-width: 300px;
			background-color: white;
		}
		
		.r {
			position: relative;
			float: right;
			width: 50%;
			min-width: 300px;
			background-color: white;
		}
		
		.map {
	    	height: 800px;
	    	position: absolute;
	    }
	    
	    .layui-table td, .layui-table th {
		    position: relative;
		    min-height: 20px;
		    line-height: 20px;
		    font-size: 12px;
		    padding: 9px 15px;
		}
		
		.layui-card-body {
		    position: relative;
		    padding: 10px 5px;
		    line-height: 24px;
		}
		
		.layui-table-cell{
		   height:auto;
		   overflow:visible;
		   text-overflow:inherit;
		   white-space:normal;
		   padding: 0px 5px;
		   line-height: 15px;
		}
		
		.layui-btn+.layui-btn {
		    margin-left: 5px;
		}
		
		.layui-btn-sm {
		    height: 28px;
		    line-height: 28px;
		    padding: 0 5px;
		    font-size: 10px;
		}
		
		.height {
			overflow: hidden;
		}
		@media screen and (max-height: 700px) {
		    .map {
		        height:520px;
		    }
		}
		
		html,
        body,
        #container1 {
          width: 100%;
          height: 100%;
        }
		
	</style>

</head>
<body>
 <div id="up-map-div">
	<div class="cen full1" id="full"></div>
	<div class="cen jeeves1" id="jeeves"></div>
	<div class="cen warn1" id="warn"></div>
</div> 
 <div id="map" class="container">
	<div class="top" id="top">
		<div class="top-div">
		    <div class="div-cell">
		    	<div class="cell">
		    		<div class="cell1" style="background-color: #8bffff;">占道中任务 <span id="count1">10</span></div>
		    	</div>
		    </div>
		    <div class="div-cell">
		    	<div class="cell">
		    		<div class="cell1" style="background-color: #ffe0a3;">今日待占道任务 <span id="count2">10</span></div>
		    	</div>
		    </div>
		    <div class="div-cell">
		    	<div class="cell">
		    		<div class="cell1" style="background-color: #ffa1ac;">预警中的任务 <span id="count3">10</span></div>
		    	</div>
		    </div>
		 </div>
	</div>
	<div id="bottom">
		<div id="container" class="l map height" ></div>
		<div id="right" class="r">
			<div class="layui-card">
                <div class="layui-card-body" class="height">
                	<div class="layui-form">
                		<div class="layui-form-item">
                			<div class="layui-input-inline" style="width:120px;">
                				<input type="text" id="searchText" name="searchText" class="layui-input" maxlength="15" placeholder=" ">
                			</div>
                			<div class="layui-input-inline" style="width: 90px;">
                				<input type="text" id="time" name="time" class="layui-input" placeholder="-时间-">
                			</div>
                			<div class="layui-input-inline" style="width:78px;">
		                		<select id="state">
			                		<option value="">-状态-</option>
			                		<option value="1">占道中</option>
			                		<option value="0">已结束</option>
			                		<option value="2">未占道</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline" style="width:88px;">
			                	<select id="type1">
			                		<option value="">-类型-</option>
			                		<option value="1">施工占道</option>
			                		<option value="0">施工封闭</option>
			                		<option value="2">事故占道</option>
			                		<option value="3">事故封闭</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline" style="width:78px;">
			                	<select id="warnState">
			                		<option value="">-预警-</option>
			                		<option value="1">预警中</option>
			                		<option value="0">未预警</option>
			                		<option value="2">已解除</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline" style="width:90px;">
		                		<button class="layui-btn layui-btn-primary layui-btn-sm" id="clearBtn">重置</button>
		                		<button class="layui-btn layui-btn-primary layui-btn-sm" id="searchBtn">查询</button>	
		                	</div>
                		</div>
                	</div>
                	<table id="jeevesTable" lay-filter="jeevesTable"></table>
                </div>
            </div>
		</div>
	</div>
</div>

<div id="up-map-div1" style="display: none;">
	<div class="cen full2" id="full1"></div>
	<div class="cen jeeves1" id="jeeves1"></div>
	<div class="cen warn1" id="warn1"></div>
</div>

	<div class="top1" id="top1">
		<div class="layui-form" style="margin: 20px;">
			<div class="layui-form-item">
				<div class="layui-input-inline" style="width: 120px;">
					<input type="text" id="searchText" name="searchText"
						class="layui-input" maxlength="15" placeholder=" ">
				</div>
				<div class="layui-input-inline" style="width: 90px;">
					<input type="text" id="time" name="time" class="layui-input"
						placeholder="-时间-">
				</div>
				<div class="layui-input-inline" style="width: 78px;">
					<select id="state">
						<option value="">-状态-</option>
						<option value="1">占道中</option>
						<option value="0">已结束</option>
						<option value="2">未占道</option>
					</select>
				</div>
				<div class="layui-input-inline" style="width: 88px;">
					<select id="type1">
						<option value="">-类型-</option>
						<option value="1">施工占道</option>
						<option value="0">施工封闭</option>
						<option value="2">事故占道</option>
						<option value="3">事故封闭</option>
					</select>
				</div>
				<div class="layui-input-inline" style="width: 78px;">
					<select id="warnState">
						<option value="">-预警-</option>
						<option value="1">预警中</option>
						<option value="0">未预警</option>
						<option value="2">已解除</option>
					</select>
				</div>
				<div class="layui-input-inline" style="width: 90px;">
					<button class="layui-btn layui-btn-primary layui-btn-sm" id="clearBtn1">重置</button>
					<button class="layui-btn layui-btn-primary layui-btn-sm" id="searchBtn1">查询</button>
				</div>
			</div>
		</div>
	</div>

	<div id="container1" style="display: none;"></div>


<script type="text/html" id="opBar">
    <a class="layui-btn layui-btn-xs" lay-event="detail">详情</a>
</script>

<script type="text/html" id="stateTmp">
    {{#  if(d.state == 0 ){ }}
        <span>已结束</span>
    {{#  }else if(d.state == 1) { }}
        <span>占道中</span>
    {{#  } }}
</script>

<script type="text/html" id="typeTmp">
    {{#  if(d.type == 0 ){ }}
        <span>封路</span>
    {{#  }else if(d.type == 1) { }}
        <span>占道</span>
    {{#  } }}
</script>
<script type="text/javascript" src="<%=basePath%>/resources/tools/Map.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/tools/Set.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/business/jeeves4.js"></script>

</body>
</html>