<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html>

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
  <%@include file="../../../../url.jsp"%>
  <%@include file="../../../../layui.jsp"%>
  <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" />
  <link rel="stylesheet" type="text/css" href="https://a.amap.com/jsapi_demos/static/demo-center/css/prety-json.css">
  <script src="https://webapi.amap.com/maps?v=1.4.13&key=aac358a9f0f4fe77c099995c0b79f59d"></script>
  <%@include file="../../../../jquery.jsp"%>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js" ></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/underscore-min.js" ></script>
  <script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/backbone-min.js" ></script>
  <script type="text/javascript" src='https://a.amap.com/jsapi_demos/static/demo-center/js/prety-json.js'></script>
  
  <style>
    html,
    body,
    #container {
      width: 100%;
      height: 100%;
    }
    
    #up-map-div {
    	background-color: white;
		width: 340px;
		height: 100px;
		line-height: 100px;
		top: 30px;
		left: 30px;
		position: absolute;
		z-index: 9999;
	}
	
	.amap-info-content {
	    position: relative;
	    background: #fff;
	    line-height: 1.4;
	    padding: 0px 0px;
	    overflow: auto;
	}
  </style>
  <title>获取地图当前行政区</title>
</head>

<body>
  <div id="container"></div>
  <div id="up-map-div" class="layui-fluid">
	设备编号:
    <div class="layui-inline">
        <input type="text" id="imei1" class="layui-input" value="123456789100000">
    </div>
    <button class="hack-btn layui-btn layui-btn-sm" id="searchBtn">查询</button>
  </div>
  <script type="text/javascript" src="<%=basePath%>/resources/js/business/seat.js"></script>

</body>
</html>