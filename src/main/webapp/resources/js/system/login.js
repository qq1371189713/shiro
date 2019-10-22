
var pubKey = "b58605f4d8ec22e58816afb482779ace72d033a32045303e891405978b0b2f5f4559ceee07b43121349b1743339965685305e5b70293b72105912d37483174c0c4bb866f75b65da77177caba931f3f514f9bb8f6c38f0fe7a868b2096cf2a64b75d4ae920d3036103367dae3ebeb77d8c4841a6b3d4edc0d062f93c4a16eaa6b";
var exponent = "10001";

function encryption(str){
    var rsa = new RSAKey()
    rsa.setPublic(pubKey, exponent);
    var encryptStr = rsa.encrypt(str);
    return encryptStr;
}

$(function () {
	
	sessionStorage.removeItem("curMenu");
	sessionStorage.removeItem("curTaskNum");

    layui.use(['layer', 'jquery'], function () {
        var layer = layui.layer;

        if ('00' === message) {
            parent.location.href = '/system/user/toLogin.action';
        } else if("01" == message) {
        	 layer.msg('用户名或密码错误！',  { anim: 6, time: 5000, area: ['300px', '50px']});
        } else if("02" == message) {
        	layer.msg('密码有误，请重新登录！',  { anim: 6, time: 5000, area: ['300px', '50px']});
        }
        // document.getElementById("btn").onclick = function () {
        //     // 获取img元素
        //     // 为了让浏览器发送请求到servlet, 所以一定要改变src
        //     document.getElementsByTagName("img")[0].src =
        //         "/verificationCode.action?act=index&v=" + new Date().getTime();
        // };

        // 回车登录
        $(document).keydown(function (event) {
            if (event.keyCode === 13) { //绑定回车
                $(".loginBtn").trigger("click");
            }
        });

        $('.loginBtn').click(function () {
            var username = $('.username').val();
            var password = $('.password').val();
            var verificationCode = $('.VerificationCode').val();
            if (username === '' || password === '') {
                layer.msg('用户名和密码不能为空！',  { anim: 6, time: 5000, area: ['300px', '50px']});
                //panelOpen($("#img"));
                return false;
            }
            $("#tfid-0-2").val(encryption(password));
            $("#form").submit();
            /*$.ajax({
                type: 'post',
                url: '/system/lo',
                dataType: 'json',
                data: {username: username, password: password, verificationCode: verificationCode},
                success: function (res) {
                    if (res.code === 2000) {
                        console.log("headMenu", res.headMenu);
                        localStorage.setItem("headMenu", res.headMenu);
                        window.location = "/user.action?act=entrance";
                    } else {
                        layer.msg(res.msg, {anim: 6});
                    }
                }

            });*/
            return false;
        });
    });

});