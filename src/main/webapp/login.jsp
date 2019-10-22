<%--<%@ page import="com.broadsense.entity.UserEntity" %>--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
    <%@include file="url.jsp"%>
    <%@include file="jquery.jsp"%>
    <%@include file="layui.jsp"%>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/lib/newLogin/newLogin.css">
</head>
<body class="">
<div id="react-wraper">
    <div id="app-wraper" data-reactroot="">
        <div>
            <div id="container" class="login-container">
                <div class="container">
                    <div>
                        <div class="login-title" style="opacity: 1; transform: translate(0px, 0px);"></div>
                        <form class="login-form" id="form" action="login.do" method="get" style="opacity: 1; transform: translate(0px, 0px);" >
                            <div class="login-wrap">
                                <div class="logo"></div>
                                <fieldset class="fieldset ">
                                    <div class="form-group form-group-depth-1 form-group-userName">
                                        <label for="tfid-0-0" class="control-label">
                                            <i class=" icon icon-user">账号</i>
                                        </label>
                                        <input placeholder="" id="tfid-0-0" name="username" type="text" class="form-control username" value="" maxlength="20">
                                    </div>
                                    <div class="form-group form-group-depth-1 form-group-password">
                                        <label for="tfid-0-1" class="control-label">
                                            <i class=" icon icon-password">密码</i>
                                        </label>
                                        <input placeholder="" id="tfid-0-1" name="password" type="password" class="form-control password" value="" maxlength="20">
                                    </div>
                                    <div class="form-group form-group-depth-1 checkboxFour">
                                        <input type="checkbox" id="checkboxFourInput" name="remember" style="border: 1px solid #FFFFFF;display: none;"/>
                                        <label for="checkboxFourInput"></label>
                                        <div style="float: left;height: 19px;line-height: 19px;margin-left: 10px;">记住用户名</div>
                                    </div>
                                </fieldset>

                                <div>

                                    <div class="form-group btn-group" style="opacity: 1; transform: translate(0px, 0px);padding-bottom: 100px;">
                                        <button type="submit" class="ant-btn ant-col-24 login-btn ant-btn-primary loginBtn">
                                            <span>登录</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<h4 class="text-center" style="color:red">${error}</h4>
</body>
<script  src="<%=basePath %>/resources/lib/layui/layui.js"></script>

</html>
