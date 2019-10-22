<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>设备分组管理</title>
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
    <script type="text/javascript" src="<%=basePath%>/resources/js/business/deviceGroup.js"></script>
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
                <div class="layui-card-header">设备分组信息</div>
                <div class="layui-card-body">
                    <div>
                        分组名称:
                        <div class="layui-inline">
                            <input type="text" id="name" name="name" placeholder="请输入分组名称"
                                   autocomplete="off" class="layui-input">
                        </div>
                        <button class="hack-btn layui-btn" id="searchBtn">查询</button>
                        <button class="hack-btn layui-btn" id="addBtn">添加</button>
                    </div>
                    <table id="groupTab" lay-filter="groupTab" lay-data="{id: 'groupTab'}"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="opBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>

<div id="operate" style="display: none; margin-top: 20px; margin-right: 40px;">
    <form id="form" class="layui-form" lay-filter="devicegroup">
        <input type="hidden" id="id" name="id">
        <div class="layui-form-item">
            <label class="layui-form-label">分组编号</label>
            <div class="layui-input-block">
                <input type="text" name="groupId" lay-verify="required|groupId" placeholder="请输入分组编号" maxlength="20" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">分组编号名称</label>
            <div class="layui-input-block">
                <input type="text" name="groupName" placeholder="请输入分组名称" lay-verify="groupName" maxlength="20" autocomplete="off" class="layui-input">
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

</body>
</html>