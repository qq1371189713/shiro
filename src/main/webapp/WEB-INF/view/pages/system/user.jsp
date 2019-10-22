<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.persistence.entity.system.UserEntity" %>
<!DOCTYPE html>
<html>
<head>
<title>用户管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="../../../../url.jsp"%>
<%@include file="../../../../jquery.jsp"%>
<%@include file="../../../../layui.jsp"%>
<%@include file="../../../../ztree.jsp"%>
<script type="text/javascript" src="/resources/tools/rsa/jsbn.js"></script>
<script type="text/javascript" src="/resources/tools/rsa/prng4.js"></script>
<script type="text/javascript" src="/resources/tools/rsa/rng.js"></script>
<script type="text/javascript" src="/resources/tools/rsa/rsa.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/system/menuTree.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/check.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/system/user.js"></script>
<script type="text/javascript">
	 if(history.pushState && history.replaceState) {
		history.pushState(null, null, document.URL);
	    window.addEventListener('popstate', function () {
	        history.pushState(null, null, document.URL);
	    });
	}
</script>
	<style type="text/css">
		.imp-star::before {
			content: '*';
			color: red;
			margin-right: 3px;
		}
	</style>
</head>
<body>
	<input type="hidden" id="curUserId" value="${user.id}">
	<input type="hidden" id="curTeamId" value="${user.teamIds}">
	<div class="layui-fluid" style="padding-top: 20px;">
		<div class="layui-row">
			<div class="layui-col-md12">
				<div class="layui-card">
					<div class="layui-card-header">用户信息</div>
					<div class="layui-card-body">
						<div>
							账号:
							<div class="layui-inline">
								<input type="text" id="name" name="name" placeholder="请输入账号" autocomplete="off" class="layui-input">
							</div>
							<button class="hack-btn layui-btn" id="searchBtn">查询</button>
							<button class="hack-btn layui-btn" id="addBtn">添加</button>
						</div>
						<table id="userTab" lay-filter="userTab" lay-data="{id: 'userTab'}"></table>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div id="operate" style="display: none; margin-top: 20px; margin-right: 40px;">
		<form id="form" class="layui-form" lay-filter="user">
			<input type="hidden" id="id" name="id">
			<div class="layui-form-item">
				<label class="layui-form-label imp-star">账号</label>
				<div class="layui-input-block">
					<input type="text" id="account" name="account" lay-verify="required" maxlength="20"
						placeholder="请输入账号" autocomplete="off" class="layui-input" readonly="readonly">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label imp-star">密码</label>
				<div class="layui-input-block">
					<input type="password" id="password" name="password" lay-verify="password" maxlength="16"
						placeholder="请输入密码" autocomplete="new-password" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label imp-star">姓名</label>
				<div class="layui-input-block">
					<input type="text" name="name" lay-verify="required|name" maxlength="20"
						placeholder="请输入姓名" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label imp-star">角色分配</label>
				<div class="layui-input-block">
					<input type="text" id="roleName" name="roleName" maxlength="20" placeholder="请选择角色"
						   autocomplete="off" class="layui-input" readonly>
					<input type="hidden" name="roleId" id="rId">
				</div>
			</div>
			<div class="layui-form-item">
				<label type="checkbox" class="layui-form-label imp-star" >团队</label>
				<div class="layui-input-block" id="teamIds"></div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">电话号码</label>
				<div class="layui-input-block">
					<input type="text" name="phone" maxlength="11"
						placeholder="请输入电话号码" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">邮箱</label>
				<div class="layui-input-block">
						<input type="text" id="email" name="email"
						placeholder="请输入邮箱" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<div class="layui-input-block">
					<button class="layui-btn" lay-submit="" lay-filter="sub">保存</button>
					<button type="reset" id="reset1" class="layui-btn layui-btn-primary">重置</button>
				</div>
			</div>
		</form>
	</div>
	
	<div id="roleSelectPanel" style="display: none;">
		<form id="from0" class="layui-form">
			<div class="layui-form-item">
				<div id="roleSelect" class="ztree"></div>
			</div>
		</form>
	</div>

	<div id="rolePanel" style="display: none;">
		<form id="from1" class="layui-form">
			<div class="layui-form-item">
				<div id="roleTree" class="ztree"></div>
				<input type="hidden" id="userId" name="id">
				<input type="hidden" id="roleId" name="roleId">
			</div>
			<div class="layui-form-item">
				<div class="layui-input-block">
					<button class="layui-btn" lay-submit="" lay-filter="subTree">保存</button>
					<button id="roleReset" type="button"  class="layui-btn layui-btn-primary">重置</button>
				</div>
			</div>
		</form>
	</div>

	<div id="pwdPanel" style="padding:20px 40px 0 20px;display:none;">
		<form id="pwdForm" class="layui-form">
			<input type="hidden" name="id" id="uId"/>
			<div class="layui-form-item">
				<label class="layui-form-label">原密码</label>
				<div class="layui-input-block">
					<input name="password" type="password" lay-verify="password" maxlength="16" placeholder="请输入原密码" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">设置密码</label>
				<div class="layui-input-block">
					<input type="password" name="password_new" lay-verify="password" maxlength="16" placeholder="请设置密码" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">确认密码</label>
				<div class="layui-input-block">
					<input type="password" name="password_two" lay-verify="password" maxlength="16" placeholder="请再次确认密码" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<div class="layui-input-block">
					<button class="layui-btn" lay-submit lay-filter="subPwd">保存</button>
					<button type="button" class="layui-btn layui-btn-primary cancel-btn">取消</button>
				</div>
			</div>
		</form>
	</div>
	
</body>
</html>