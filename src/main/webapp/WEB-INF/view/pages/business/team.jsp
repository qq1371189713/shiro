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
<script type="text/javascript" src="<%=basePath%>/resources/js/check.js"></script>
<script type="text/javascript" src="<%=basePath%>/resources/js/business/team.js"></script>
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

		#map {
			position: absolute;
			top: 0;
			left: 0;
			right: 50%;
			bottom: 0;
			width: 100%;
			height: 100%;
		}

</style>
</head>
<body>

<div id = "map" class="layui-container">
	<div class="layui-fluid" style="padding-top: 20px;">
		<div class="layui-row">
			<div class="layui-col-md12">
				<div class="layui-card">
					<input type="hidden" id="tIds" value="${user.teamIds}"/>
					<div class="layui-card-header">团队信息</div>
					<div class="layui-card-body">
						<div>
							团队名称:
							<div class="layui-inline">
								<input type="text" id="name" name="name" placeholder="请输入团队名称"
									autocomplete="off" class="layui-input">
							</div>
							<button class="hack-btn layui-btn" id="searchBtn">查询</button>
							<button class="hack-btn layui-btn" id="addBtn">添加</button>
						</div>


							<div class="layui-row">
								<div class="layui-col-md2">
									<div id="allTeam" name="allTeam">所有团队</div>
									<div id="menuTeamTree" style="display: block;" class="ztree"></div>
								</div>
								<div class="layui-col-md10">
									<table id="teamTab" lay-filter="teamTab" lay-data="{id: 'teamTab'}"></table>
								</div>
							</div>
						</div>


				</div>
			</div>
		</div>
	</div>

	<div id="operate" style="display: none; margin-top: 20px; margin-right: 40px;">
		<form id="form" class="layui-form" lay-filter="team">
			<input type="hidden" id="id" name="id">
			<input type="hidden" id="parentid" name="parentid" value="0">
			<input type="hidden" id="type" name="type" value="0">
			<input type="hidden" id="level" name="level" value="0">
			<div id="p" class="layui-form-item">
				<label class="layui-form-label imp-star">所属上级团队</label>
				<div class="layui-input-block">
					<input type="text" id="pName" name="pName" lay-verify="required|name" placeholder="请选择所属上级团队"
						   autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label imp-star">团队名称</label>
				<div class="layui-input-block">
					<input type="text" name="name" lay-verify="required|name" placeholder="请输入团队名称" maxlength="20" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">团队管理员</label>
				<div class="layui-input-block">
					<input type="text" name="managerName" placeholder="请输入团队管理员" lay-verify="managerName" maxlength="20" autocomplete="off" class="layui-input">
				</div>
			</div>
			<div class="layui-form-item">
				<label class="layui-form-label">团队管理员联系方式</label>
				<div class="layui-input-block">
					<input type="text" name="managerPhone" lay-verify="phone" placeholder="请输入团队管理员联系方式" maxlength="11" autocomplete="off" class="layui-input">
				</div>
			</div>
			<%--<div class="layui-form-item">--%>
				<%--<label class="layui-form-label imp-star">序列</label>--%>
				<%--<div class="layui-input-block">--%>
					<%--<input type="text" name="seq"  lay-verify="required|seq" placeholder="请输入团队管理员联系方式" maxlength="11" autocomplete="off" class="layui-input">--%>
				<%--</div>--%>
			<%--</div>--%>
			<div class="layui-form-item">
				<div class="layui-input-block">
					<button class="layui-btn" lay-submit="" lay-filter="sub">保存</button>
					<button type="reset" class="layui-btn layui-btn-primary">重置</button>
				</div>
			</div>
		</form>
	</div>
	</div>
<div id="menuTree" style="display: none;" class="ztree"></div>
</body>
</html>