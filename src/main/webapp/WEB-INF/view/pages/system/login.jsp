<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>占道预警管理平台</title>
    <%@include file="../../../../url.jsp"%>
    <%@include file="../../../../jquery.jsp"%>
    <%@include file="../../../../layui.jsp"%>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/resources/lib/newLogin/newLogin.css">
</head>
<body>
<div id="container" class="login-container">
    <div class="container">
        <form class="login-form" id="form" action="login.do" method="get">
            <div class="login-wrap">
                <div class="logo"></div>
                <fieldset class="fieldset ">
                    <div class="form-group form-group-depth-1 form-group-userName">
                        <label for="tfid-0-0" class="control-label">
                            <i class=" icon icon-user">账号</i>
                        </label>
                        <input placeholder="" id="tfid-0-0" name="account" type="text" class="form-control username" value="" maxlength="20">
                    </div>
                    <div class="form-group form-group-depth-1 form-group-password">
                        <label for="tfid-0-1" class="control-label">
                            <i class=" icon icon-password">密码</i>
                        </label>
                        <input placeholder="" id="tfid-0-1" type="password" class="form-control password" value="" maxlength="20">
                        <input type="hidden" id="tfid-0-2" name="password" value="">
                    </div>
                    <div class="form-group form-group-depth-1 checkboxFour">
                        <input type="checkbox" id="checkboxFourInput" name="check" style="border: 1px solid #FFFFFF;display: none;"/>
                        <label for="checkboxFourInput"></label>
                        <div style="float: left;height: 19px;line-height: 19px;margin-left: 10px;">记住用户名</div>
                        <div style="float: right;"><a onclick="forget()">忘记密码？</a></div>
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
</body>
<script type="text/javascript">
    var message = '${message}';
    function forget(){
        layer.open({
            title: false
            ,closeBtn: 0
            ,btnAlign: 'c'
            ,btn: '我知道了'
            ,content: '请联系管理员进行密码重置'
            ,area: ['260px', '130px']
        });
    }
</script>

 <script  type="text/javascript" src="/resources/tools/rsa/jsbn.js"></script>
 <script  type="text/javascript" src="/resources/tools/rsa/prng4.js"></script>
 <script  type="text/javascript" src="/resources/tools/rsa/rng.js"></script>
 <script  type="text/javascript" src="/resources/tools/rsa/rsa.js"></script>

 <!-- <script  type="text/javascript" src="http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn2.js"></script>-->
 <!-- <script  type="text/javascript" src="http://www-cs-students.stanford.edu/~tjw/jsbn/rsa2.js"></script> -->

<script type="text/javascript" src="<%=basePath%>/resources/js/system/login.js?v=0.02"></script>

</html>
