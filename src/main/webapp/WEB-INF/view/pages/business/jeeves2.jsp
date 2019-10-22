<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>占道信息管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="../../../../url.jsp"%>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>
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
		
		.top-div {
		    width: 550px;
		    height: 60px;
		    line-height: 60px;
		    top: 0px;
		    left: 0px;
		    padding-bottom: 10px;
		}
		
		.div-cell {
		    width: 150px;
		    padding-top: 10px;
		    float: left;
		    text-align: center;
		}
		
		.cell {
			width: 80%;
			height: 50px;
			line-height: 50px;
			border: 1px solid #C9C9C9;
		    color: #555;
		}
		
		.cell1 {
		    height: 15px;
		    line-height: 15px;
		    padding: 5px 0px;
		}
	</style>

</head>
<body>
<div class="layui-fluid" style="padding-top: 20px;">
    <div class="layui-row">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    占道信息
                </div>
                <div class="layui-card-body">
                    <div class="top-div">
                    	<div class="div-cell">
					    	<div class="cell">
					    		<div class="cell1" id="count1">10</div>
					    		<div class="cell1">占道中</div>
					    	</div>
					    </div>
					    <div class="div-cell">
					    	<div class="cell">
					    		<div class="cell1" id="count2">10</div>
					    		<div class="cell1">待占道</div>
					    	</div>
					    </div>
					    <div class="div-cell">
					    	<div class="cell">
					    		<div class="cell1" id="count3">10</div>
					    		<div class="cell1">累计占道任务</div>
					    	</div>
					    </div>
                    </div>
                    <table id="jeevesTable" lay-filter="jeevesTable"></table>
                </div>
            </div>
        </div>
    </div>

</div>

<script type="text/html" id="stateTmp">
    {{#  if(d.state ==0 ){ }}
        <span>未开始</span>
    {{#  }else if(d.state == 1) { }}
        <span>占道中</span>
    {{#  } else if(d.state == 2) { }}
 		<span>已完成</span>
    {{#  } }}
</script>

<script type="text/html" id="opBar">
    <a class="layui-btn layui-btn-xs" lay-event="detail">查看详情</a>
</script>
<!-- 
<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
 -->
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

<script type="text/javascript" src="<%=basePath%>/resources/js/business/jeeves.js"></script>

</body>
</html>