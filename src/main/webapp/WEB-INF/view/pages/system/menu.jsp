<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>菜单管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="../../../../url.jsp"%>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>
<%@include file="../../../../ztree.jsp"%>
<script type="text/javascript" src="<%=basePath%>/resources/js/system/menuTree.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/check.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/system/menu.js"></script>
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

	<div class="layui-fluid" style="padding-top: 20px;">
		<div class="layui-row">
			<div class="layui-col-md12">
				<div class="layui-card">
					<div class="layui-card-header">菜单信息</div>
					<div class="layui-card-body">
						<div>
							菜单名称:
							<div class="layui-inline">
								<input type="text" id="name" name="name" placeholder="请输入菜单名称"
									autocomplete="off" class="layui-input">
							</div>
							<button class="hack-btn layui-btn" id="searchBtn">查询</button>
							<button class="hack-btn layui-btn" id="addBtn">添加</button>
						</div>
						<table id="menuTab" lay-filter="menuTab" lay-data="{id: 'menuTab'}"></table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script type="text/html" id="useTypeTmp">
    {{#  if(d.useType == 0){ }}
    	空目录
    {{#  } else if(d.useType == 1){ }}
    	页面跳转
    {{#  } else if(d.useType == 2){ }}
		数据操作
    {{#  } }}
	</script>

	<script type="text/html" id="opBar">
  		<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  		<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
	</script>

	<div id="operate"
		style="display: none; margin-top: 20px; margin-right: 40px;">
		<form id="form" class="layui-form" lay-filter="menu">
			<input type="hidden" id="id" name="id"> <input type="hidden"
				id="pId" name="pId" value="0"> <input type="hidden"
				id="type" name="type" value="0"> <input type="hidden"
				id="level" name="level" value="0">
			<div id="p" class="layui-form-item">
				<label class="layui-form-label">父菜单名称</label>
				<div class="layui-input-block">
					<input type="text" id="pName" name="pName" placeholder="请选择父菜单"
						autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">菜单名称</label>
				<div class="layui-input-block">
					<input type="text" name="name" lay-verify="required|name" maxlength="20"
						placeholder="请输入菜单名称" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">菜单URL</label>
				<div class="layui-input-block">
					<input type="text" name="value" lay-verify="required" maxlength="70"
						placeholder="请输入菜单URL" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">菜单类型</label>
				<div class="layui-input-block">
					<select name="useType" lay-filter="useType">
						<option value="0">空目录</option>
						<option value="1" selected="">页面跳转</option>
						<option value="2">数据操作</option>
					</select>
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">菜单序列</label>
				<div class="layui-input-block">
					<input type="text" name="seq" lay-verify="seq" maxlength="3" placeholder="请输入菜单序列" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">菜单描述</label>
				<div class="layui-input-block">
					<input type="text" name="remark" placeholder="请输入菜单描述" maxlength="30"
						autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<div class="layui-input-block">
					<button class="layui-btn" lay-submit="" lay-filter="sub">保存</button>
					<button type="reset" class="layui-btn layui-btn-primary">重置</button>
				</div>
			</div>
		</form>
	</div>

	<div id="menuTree" style="display: none;" class="ztree">aaa</div>

</body>
</html>