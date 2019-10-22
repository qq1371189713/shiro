<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>角色管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="../../../../url.jsp"%>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>
<%@include file="../../../../ztree.jsp"%>
<script type="text/javascript" src="<%=basePath%>/resources/js/system/menuTree.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/tools/Set.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/check.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/system/role.js"></script>
<script type="text/javascript">
	 if(history.pushState && history.replaceState) {
		history.pushState(null, null, document.URL);
	    window.addEventListener('popstate', function () {
	        history.pushState(null, null, document.URL);
	    });
	}
	var rId = '${user.roleId}';
</script>
</head>
<body>

	<div class="layui-fluid" style="padding-top: 20px;">
		<div class="layui-row">
			<div class="layui-col-md12">
				<div class="layui-card">
					<div class="layui-card-header">角色信息</div>
					<div class="layui-card-body">
						<div>
							角色名称:
							<div class="layui-inline">
								<input type="text" id="name" name="name" placeholder="请输入角色名称"
									autocomplete="off" class="layui-input">
							</div>
							<button class="hack-btn layui-btn" id="searchBtn">查询</button>
							<button class="hack-btn layui-btn" id="addBtn">添加</button>
						</div>
						<table id="roleTab" lay-filter="roleTab" lay-data="{id: 'roleTab'}"></table>
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
    {{#  } else if(d.useType == 1){ }}
		数据操作
    {{#  } }}
	</script>

	<script type="text/html" id="opBar">
  		<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  		<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
		<a class="layui-btn layui-btn-xs" lay-event="permAssig">权限分配</a>
	</script>

	<div id="operate" style="display: none; margin-top: 20px; margin-right: 40px;">
		<form id="form" class="layui-form" lay-filter="role">
			<input type="hidden" id="id" name="id">
			<input type="hidden" id="pId" name="pId" value="0">
			<div id="p" class="layui-form-item">
				<label class="layui-form-label">父角色名称</label>
				<div class="layui-input-block">
					<input type="text" id="pName" name="pName"
						placeholder="请选择父角色" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">角色名称</label>
				<div class="layui-input-block">
					<input type="text" name="name" lay-verify="required|name" maxlength="20"
						placeholder="请输入角色名称" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">角色描述</label>
				<div class="layui-input-block">
					<input type="text" name="remark" maxlength="40"
						placeholder="请输入菜单描述" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<div class="layui-input-block">
					<button class="layui-btn" lay-submit="" lay-filter="sub">保存</button>
					<button id="roleReset" type="reset" class="layui-btn layui-btn-primary">重置</button>
				</div>
			</div>
		</form>
	</div>
	<div id="roleTree" class="ztree" style="display: none;"></div>
	
	<div id="menuPanel" style="display: none;">
		<form id="from1" class="layui-form">
			<div class="layui-form-item">
				<div id="menuTree" class="ztree"></div>
				<input type="hidden" id="roleId" name="roleId">
				<input type="hidden" id="menuIds" name="menuIds">
			</div>
			<div class="layui-form-item" style="display:none;">
				<div class="layui-input-block">
					<button class="layui-btn" lay-submit lay-filter="subTree" id="subPri">保存</button>
				</div>
			</div>
		</form>
	</div>
	
</body>
</html>