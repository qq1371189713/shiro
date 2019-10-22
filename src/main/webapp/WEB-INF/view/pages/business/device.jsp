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
<script type="text/javascript" src="<%=basePath%>/resources/lib/echarts/echarts.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/lib/echarts/echarts.min.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/lib/echarts/china.js"></script>
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
		.top-div {
		    width: 850px;
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
		
		.layui-form-item .layui-input-inline {
		    float: left;
		    width: 130px;
		    margin-right: 5px;
		    font-size: 12px;
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
		
		.layui-form-pane .layui-form-label {
		    width: 110px;
		    padding: 8px 15px;
		    height: 30px;
		    line-height: 10px;
		    border-width: 1px;
		    border-style: solid;
		    border-radius: 2px 0 0 2px;
		    text-align: center;
		    background-color: #FBFBFB;
		    overflow: hidden;
		    box-sizing: border-box;
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
<style type="text/css">
        .imp-star::before {
            content: '*';
            color: red;
            margin-right: 3px;
        }
</style>
</head>
<body>
<div class="layui-fluid" style="padding-top: 20px;">
    <div class="layui-row">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                	<div class="layui-row layui-col-space30">
	                	<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">
	                		<div id="deviceTitle" style="font-size: 14px;color:#6d6f79;">设备总数</div>
	                		<div id="deviceCount" style="width: 100%; height: 110px;"></div>
	                	</div>
	                	<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">
	                		<div id="deviceTitle2" style="font-size: 14px;color:#6d6f79;"></div>
	                		<div id="deviceCount2" style="width: 100%; height: 110px;"></div>
	                	</div>
	                	<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">
	                		<div id="deviceTitle1" style="font-size: 14px;color:#6d6f79;"></div>
	                		<div id="deviceCount1" style="width: 100%; height: 110px;"></div>
	                	</div>
	                	<div class="layui-col-xs3 layui-col-sm3 layui-col-md3">
	                		<div id="deviceTitle3" style="font-size: 14px;color:#6d6f79;"></div>
	                		<div id="deviceCount3" style="width: 100%; height: 110px;"></div>
	                	</div>
                	</div>
                </div>
            </div>
            <div class="layui-card">
            	<div class="layui-card-body">
            		<input type="hidden" id="expState" value="${value}">
            		<div class="layui-form" lay-filter="search">
                		<div class="layui-form-item" style="margin-bottom: 0;">
                			<div class="layui-input-inline" style="width: 180px;">
                				 <input type="text" id="number1" name="number1" class="layui-input" value="" maxlength="15" placeholder="设备编号">
                			</div>
                			<div class="layui-input-inline" style="width:120px;">
		                		<select id="type1" name="type1">
			                		<option value="">所有类型</option>
			                		<option value="1">中间设备</option>
			                		<option value="2">起点设备</option>
			                		<option value="3">终点设备</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline"  style="width:120px;">
			                	<select id="state2" name="state2">
			                		<option value="">全部在线状态</option>
			                		<option value="1">在线</option>
			                		<option value="0">离线</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline"  style="width:120px;">
			                	<select id="state1" name="expState">
			                		<option value="">全部设备状态</option>
			                		<option value="1">正常</option>
			                		<option value="2">异常</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline"  style="width:100px;">
			                	<select id="team1" name="team1" class="team">
			                		<option value="">所有团队</option>
			                		<option value="1">安徽总团队</option>
			                	</select>
		                	</div>
		                	<div class="layui-input-inline" style="width: 180px;">
		                		<button class="layui-btn layui-btn-radius layui-btn-primary layui-btn-sm" id="searchBtn">查询</button>	
		                		<button class="layui-btn layui-btn-radius layui-btn-primary layui-btn-sm" id="clearBtn">重置</button>
		                		<c:if test="${user.account eq 'bsiotadmin'}">
		                		<button class="layui-btn layui-btn-radius layui-btn-primary layui-btn-sm" id="addBtn">添加</button>
		                		</c:if>
		                	</div>
                		</div>
                	</div>
                    <table id="deviceTable" lay-filter="deviceTable"></table>
            	</div>
            </div>
        </div>
    </div>

</div>

<div id="container" style="display: none; width:100%; height:100%"><div class="bs-address-text-box"></div></div>
<script type="text/html" id="teamNumberTmp">
    {{#  if(d.teamNumber == undefined ){ }}
    <span>--</span>
    {{#  }else if(d.teamNumber != undefined) { }}
    {{d.teamNumber}}组
    {{#  } }}
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
        <span><img alt="" src="{{d.battImg}}" style="width:30%;"></span>
    {{#  } }}
</script>

<script type="text/html" id="createTimeTmp">
    {{#  if(d.createTime == undefined ){ }}
        <span>--</span>
    {{#  }else if(d.createTime != undefined) { }}
       {{new Date(d.createTime).format()}}
    {{#  } }}
</script>

<script type="text/html" id="updateTimeTmp">
    {{#  if(d.updateTime == undefined ){ }}
        <span>--</span>
    {{#  }else if(d.updateTime != undefined) { }}
        {{new Date(d.updateTime).format()}}
    {{#  } }}
</script>

<script type="text/html" id="stateTmp">
    {{# if(d.state == 1 ){ }}
        <span>在线</span>
    {{# } else if(d.state == 2) { }}
        <span>维修中</span>
    {{# } else if(d.state == 3) { }}
        <span>已报废</span>
	{{# } else if(d.state == 0) { }}
        <span>离线</span>
	{{# } else if(d.state == 4) { }}
		<span>正常使用中</span>
	{{# } }}
</script>

<script type="text/html" id="expStateTmp">
    {{# if(d.state != 1) { }}
        <span>--</span>
    {{# } else if(d.expState == undefined || d.expState == 0){ }}
        <span>正常</span>
    {{# } else if(d.expState == 1) { }}
        <span><a lay-event="detail" style="color:red;">异常</a></span>
	{{# } else { }}
		<span>--</span>
	{{# } }}
</script>


<script type="text/html" id="keyStateTmp">
    {{# if(d.state != 1) { }}
        <span>--</span>
    {{# } else if(d.keyState == undefined ){ }}
        <span>--</span>
    {{# } else if(d.keyState == 1) { }}
        <span>占道</span>
    {{# } else if(d.keyState == 2) { }}
        <span>封路</span>
	{{# } else if(d.keyState == 0) { }}
        <span>无任务</span>
	{{# } else if(d.keyState == 4) { }}
		<span>正常使用中</span>
	{{# } }}
</script>

<script type="text/html" id="addressTmp">
    <a class="" style="color:#1890ff" lay-event="address">查看位置</a>
</script>

<script type="text/html" id="opBar">
	<a class="" style="color:#1890ff;padding: 0px 5px;" lay-event="detail">设备详情</a>
    <a class="" style="color:#1890ff;padding: 0px 5px;" lay-event="edit">编辑</a>
	<c:if test="${user.account eq 'bsiotadmin'}">
	    <a id="del" class="" style="color:#fe3434;padding: 0px 5px;" lay-event="del">删除</a>
	</c:if>
</script>
<div id="operate" style="display: none;">
	<input type="hidden" id="teamId" value="${teamId}">
    <div class="layui-card">
        <div class="layui-card-body">
            <form id="form" class="layui-form layui-form-pane" lay-filter="device">
            	<input type="hidden" id="id" name="id">
                <input type="hidden" name="state" value="4">
                <div class="layui-form-item">
                    <div class="layui-form-label imp-star">设备编号</div>
                    <div class="layui-input-block">
                        <input type="text" id="number" name="number" maxlength="15" lay-verify="required|blank|normal|IMEI" autocomplete="off"  placeholder="请输入设备编号" class="layui-input"/>
                    </div>
                </div>
                <!-- <div class="layui-form-item">
                    <div class="layui-form-label">MAC地址</div>
                    <div class="layui-input-block">
                        <input type="text" id="mac" name="mac" maxlength="17" lay-verify="required|mac" autocomplete="off"  placeholder="请输入MAC地址" class="layui-input"/>
                    </div>
                </div> -->
                <div class="layui-form-item">
                    <div class="layui-form-label imp-star">设备类型</div>
                    <div class="layui-input-block">
                        <select id="type" name="type" lay-verify="">
						  <option value="1" selected>中间设备</option>
						  <option value="2">起点设备</option>
			              <option value="3">终点设备</option>
						</select>  
                    </div>
                </div>
            <!--     <div class="layui-form-item">
                    <div class="layui-form-label">设备组</div>
                    <div class="layui-input-block">
                        <select id="teamNumber" name="teamNumber" lay-verify="">
                        </select>
                    </div>
                </div> -->
                <div class="layui-form-item">
                    <div class="layui-form-label imp-star">所属团队</div>
                    <div class="layui-input-block">
                        <select name="teamId" class="team" lay-filter="teamId" lay-verify="required|blank|normal">
	                		<option>所有团队</option>
	                	</select>
                    </div>
                </div>
               <%-- <div class="layui-form-item">
                    <div class="layui-form-label">使用状态</div>
                    <div class="layui-input-block">
                        <select name="state">
	                		<option value="">所有状态</option>
	                		<option value="4">正常使用中</option>
	                	</select>
                    </div>
                </div>--%>
                <div class="layui-form-item hide">
                    <div class="layui-form-label" id="rtxt">购买时间</div>
                    <div class="layui-input-block">
                        <input type="text" id="buyTime" name="buyTime" maxlength="17" autocomplete="off"  placeholder="请选择购买时间" class="layui-input"/>
                    </div>
                </div>

                <!-- <div class="layui-form-item">
                    <div class="layui-form-label">设备图片</div>
                    <div class="layui-input-block layui-upload">
                        <img id="img1" src="../../../resources/images/unknown.png" width="160" height="160" style="margin-left: 10px;">
                        <input type="hidden" id="img" name="img">
                        <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="uploadImg">
                            <i class="layui-icon">&#xe67c;</i>上传图片
                        </button>
                    </div>
                </div> -->
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button class="layui-btn layui-btn-primary layui-btn-sm" lay-submit lay-filter="submit">确定</button>
                        <button class="layui-btn layui-btn-primary layui-btn-sm cancelBtn" type="button">取消</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<div id="repairOperate" style="display: none;">
	<div class="layui-card">
        <div class="layui-card-body">
            <form id="form1" class="layui-form layui-form-pane" lay-filter="repair">
            	<input type="hidden" id="deviceId" name="deviceId">
                <div class="layui-form-item">
                    <div class="layui-form-label">设备编号</div>
                    <div class="layui-input-block">
                        <input type="text" id="number1" name="number" maxlength="15" lay-verify="required|blank|normal|IMEI" autocomplete="off"  placeholder="请输入设备编号" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label" id="rtxt">维修原因</div>
                    <div class="layui-input-block">
                        <input type="text" id="reason" name="reason" maxlength="17" lay-verify="required|blank|normal" autocomplete="off"  placeholder="请输入维修原因" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item hide">
                    <div class="layui-form-label" id="rtxt">维修开始时间</div>
                    <div class="layui-input-block">
                        <input type="text" id="startTime" name="startTime" maxlength="17" autocomplete="off"  placeholder="请选择维修开始时间" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item hide">
                    <div class="layui-form-label" id="rtxt">维修预计结束时间</div>
                    <div class="layui-input-block">
                        <input type="text" id="endTime" name="endTime" maxlength="17" autocomplete="off"  placeholder="请选择修预计结束时间" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label" id="atxt">维修申请人</div>
                    <div class="layui-input-block">
                        <input type="text" id="applyName" name="applyName" maxlength="17" lay-verify="required|blank|normal" autocomplete="off"  placeholder="请输入维修申请人" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">联系方式</div>
                    <div class="layui-input-block">
                        <input type="text" id="applyPhone" name="applyPhone" maxlength="11" lay-verify="required|phone" autocomplete="off"  placeholder="请输入联系方式" class="layui-input"/>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button id="operate-sub" class="layui-btn layui-btn-primary layui-btn-sm" lay-submit lay-filter="repairSub">确定</button>
                        <button id="operate-cancel" class="layui-btn layui-btn-primary layui-btn-sm cancelBtn">取消</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script type="text/javascript" src="<%=basePath%>/resources/tools/Map.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/business/device.js"></script>
</body>
</html>