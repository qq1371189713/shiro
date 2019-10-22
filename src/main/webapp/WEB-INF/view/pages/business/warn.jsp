<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>占道信息管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="../../../../url.jsp"%>
<script src="https://webapi.amap.com/maps?v=1.4.13&key=aac358a9f0f4fe77c099995c0b79f59d&&plugin=AMap.Geocoder,AMap.LngLat"></script>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>
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
		    margin-right: 10px;
		}
		
		.layui-table td, .layui-table th {
		    position: relative;
		    min-height: 20px;
		    line-height: 20px;
		    font-size: 12px;
		    padding: 9px 15px;
		}
		
		.layui-table-cell{
		   height:auto;
		   overflow:visible;
		   text-overflow:inherit;
		   white-space:normal;
		   padding: 0px 5px;
		   line-height: 15px;
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
		    margin-bottom: 30px;
		}
		
		.div-cell {
		    width: 33%;
		    float: left;
		    text-align: center;
		}
		
		.cell {
			width: 80%;
			height: 60px;
			line-height: 50px;
		    color: #555;
		    margin: 0 auto;
		}
		
		.cell1 {
		    height: 30px;
    		line-height: 30px;
    		margin: 15px 0px;
		}
		.layui-form-item {
		    margin-bottom: 0px;
		    clear: both;
		}
		.text1 {
			color:grey;font-size:12px;
		}
		.bs-address-text-box {
            position: absolute;
            top: 5px;
            right: 10px;
            background-color: rgba(0, 0, 0, .6);
            color: #fff;
            z-index: 5;
            line-height: 34px;
            padding: 0 10px;
            border-radius: 20px;
        }
	</style>

</head>
<body>
<input type="hidden" id="jeevesNum" value="${value}">
<input type="hidden" id="num-state" value="${value}">
<div class="layui-fluid" style="padding-top: 20px;">
    <div class="layui-row" id="">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                	<div class="top">
	                    <div class="top-div">
	                    	<div class="div-cell">
						    	<div class="cell">
						    		<div class="cell1"><span id="count1" style="color:#2a85e8;font-size:36px;"></span></div>
						    		<div class="cell1" style="color:#6d6f79;">预警中的设备</div>
						    	</div>
						    </div>
						    <div class="div-cell">
						    	<div class="cell">
						    		<div class="cell1"><span id="count2" style="color:#2cd49e;font-size:36px;"></span></div>
						    		<div class="cell1" style="color:#6d6f79;">预警中的占道任务</div>
						    	</div>
						    </div>
						    <div class="div-cell">
						    	<div class="cell">
						    		<div class="cell1"> <span id="count3" style="color:#dc6858;font-size:36px;">0</span></div>
						    		<div class="cell1" style="color:#6d6f79;">异常报警设备</div>
						    	</div>
						    </div>
	                    </div>
                    </div> 
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-form" lay-filter="search">
                		<div class="layui-form-item">
                			<div class="layui-input-inline" style="width: 255px;">
                				<input type="text" id="searchText" name="searchText" class="layui-input text1" maxlength="" placeholder="设备编号/任务编号/地址/安全员联系方式">
                                <input type="hidden" id="noarea"/>
                			</div>
                			<div class="layui-input-inline text1">
			                	<select id="state" name="state">
			                		<option value="">预警状态</option>
			                		<option value="1">预警中</option>
			                		<option value="2">已解除</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline text1">
			                	<select id="type" name="type">
			                		<option value="">预警类型</option>
			                		<option value="0">侧方闯入</option>
			                		<option value="1">后方闯入</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline" style="width: 180px;">
                				<input type="text" id="time" name="time" class="layui-input text1" placeholder="全部时间 ~ " autocomplete="off">
                			</div>
		                	<div class="layui-input-inline" style="width: 120px;">
		                		<button class="layui-btn layui-btn-radius layui-btn-primary layui-btn-sm" id="searchBtn">查询</button>	
		                		<button class="layui-btn layui-btn-radius layui-btn-primary layui-btn-sm" id="clearBtn">重置</button>
		                	</div>
                		</div>
                	</div>
                    <table id="warnTable" lay-filter="warnTable"></table>
                </div>
            </div>
        </div>
    </div>

</div>

<div id="container" style="display: none; width:100%; height:100%"><div class="bs-address-text-box"></div></div>

<script type="text/html" id="typeTmp">
    {{#  if(d.type == 0 ){ }}
        <span>侧方闯入</span>
    {{#  }else if(d.type == 1) { }}
        <span>后方闯入</span>
    {{#  } }}
</script>

<script type="text/html" id="stateTmp">
    {{#  if(d.state == 2 ){ }}
        <span>已解除</span>
    {{#  }else if(d.state == 1) { }}
        <span style="color:red">预警中</span>
	{{#  }else if(d.state == 0) { }}		
		 <span>未预警</span>
    {{#  } }}
</script>

<script type="text/html" id="timeTmp">
    {{#  if(d.time != undefined ){ }}
        <span>{{d.time}}秒</span>
    {{#  }else { }}
        <span>------</span>
    {{#  } }}
</script>

<script type="text/html" id="endTimeTmp">
    {{#  if(d.endTime == undefined ){ }}
        <span>--</span>
    {{#  }else if(d.endTime != undefined) { }}
        <span>{{ new Date(d.endTime).format() }}</span>
    {{#  } }}
</script>

<script type="text/html" id="addressTmp">
    <a class="" style="color:#1890ff" lay-event="address">查看位置</a>
</script>

<script type="text/html" id="opBar">
	{{#  if(d.state ==2 ){ }}
		<a href="javascript:void(0)" style="color: #f8be34;padding: 0px 5px;">已解除&nbsp;</a>
    {{#  }else if(d.state != 2) { }}
        <a href="javascript:void(0)" lay-event="relieve" class="" style="color:#1890ff;padding: 0px 5px;">&nbsp;&nbsp;解除&nbsp;&nbsp;&nbsp;</a>
    {{#  } }}
    <a class="" style="color:#1890ff;padding: 0px 5px;" lay-event="jeeDetail">占道详情</a>
	<a class="" style="color:#1890ff;padding: 0px 5px;" lay-event="devDetail">设备详情</a>
</script>

<div id="operate" style="display: none;">
    <div class="layui-card">
        <div class="layui-card-body">
            <form id="form" class="layui-form layui-form-pane" lay-filter="jeeves">
            	<input type="hidden" id="id" name="id">
                <div class="layui-form-item">
                    <div class="layui-form-label">施工单位</div>
                    <div class="layui-input-block">
                        <input type="text" id="company" name="company" maxlength="15" lay-verify="blank|normal" autocomplete="off"  placeholder="请输入施工单位" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工原因</div>
                    <div class="layui-input-block">
                        <input type="text" id="reason" name="reason" maxlength="17" lay-verify="blank|normal" autocomplete="off"  placeholder="请输入施工原因" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工开始时间</div>
                    <div class="layui-input-block">
                        <input type="text" id="startTime" name="startTime" maxlength="17" lay-verify="required" autocomplete="off"  placeholder="请输入开始时间" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工结束时间</div>
                    <div class="layui-input-block">
                        <input type="text" id="endTime" name="endTime" maxlength="17" lay-verify="required" autocomplete="off"  placeholder="请输入结束时间" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工作业地点</div>
                    <div class="layui-input-block">
                        <input type="text" id="address" name="address" maxlength="17" lay-verify="blank|normal" autocomplete="off"  placeholder="请输入施工作业地点" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工路面种类</div>
                    <div class="layui-input-block">
                        <input type="text" id="lineType" name="lineType" maxlength="17" lay-verify="blank|normal" autocomplete="off"  placeholder="请输入施工路面种类" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工作业方式</div>
                    <div class="layui-input-block">
                        <input type="text" id="taskMode" name="taskMode" maxlength="17" lay-verify="blank|normal" autocomplete="off"  placeholder="请输入施工作业方式" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工作业设备</div>
                    <div class="layui-input-block">
                        <input type="text" id="taskDevice" name="taskDevice" maxlength="17" lay-verify="blank|normal" autocomplete="off"  placeholder="请输入施工作业设备" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工人数</div>
                    <div class="layui-input-block">
                        <input type="text" id="personNum" name="personNum" maxlength="17" lay-verify="number" autocomplete="off"  placeholder="请输入施工人数" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工单位负责人姓名</div>
                    <div class="layui-input-block">
                        <input type="text" id="chargeName" name="chargeName" maxlength="10" lay-verify="blank|normal" autocomplete="off"  placeholder="请输入施工单位负责人姓名" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">施工负责人联系方式</div>
                    <div class="layui-input-block">
                        <input type="text" id="chargePhone" name="chargePhone" maxlength="11" lay-verify="phone" autocomplete="off"  placeholder="请输入施工负责人联系方式" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">现场安全员姓名</div>
                    <div class="layui-input-block">
                        <input type="text" id="safeName" name="safeName" maxlength="10" lay-verify="blank|normal" autocomplete="off"  placeholder="请输入现场安全员姓名" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">现场安全员联系电话</div>
                    <div class="layui-input-block">
                        <input type="text" id="safePhone" name="safePhone" maxlength="11" lay-verify="phone" autocomplete="off"  placeholder="请输入现场安全员联系电话" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item" id="subDiv">
                    <div class="layui-input-block">
                        <button id="operate-sub" class="layui-btn" lay-submit lay-filter="submit">确定</button>
                        <button class="layui-btn layui-btn-primary">取消</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<script type="text/javascript" src="<%=basePath%>/resources/js/business/warn.js"></script>

</body>
</html>