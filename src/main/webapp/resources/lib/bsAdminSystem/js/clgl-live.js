$(function () {
    //	console.log(location.search.match(/imei=(\d{15})/));
        
        function autoCreatePlayer(){
            var result = location.search.match(/imei=(\d{15})/);
            
            if(!result){
                return;
            }
            
            var imei = result[1];
    
            checkInlineOutline(imei, checkInlineOutlineCb, $('.play-btn[data-imei=' + imei + ']').parents('.live-box'));
        }
        
        function createLiveListitem(arrList){
            var frag = document.createDocumentFragment();
    
            $.each(arrList, function(index, value){
                var itemHtml = [
                    '<div class="livetest-list-item">',
                        '<div class="live-box ' + (value.online_type ? 'on' : 'off') + '">',
                            '<div class="live-imgbox">',
                                '<div class="live-imgcont">',
                                    '<img src="/Iov_Background/staticResource/live/Broadstatic/images/1.png">',
                                    '<div class="playbtn-box">',
                                        '<a data-imei="' + value.c_imei + '" class="play-btn">' + (value.online_type ? '点击查看直播' : '车辆已离线') + '</a>',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div class="live-infobox">',
                                '<p>IMEI号：' + value.c_imei + '</p>',
                            '</div>',
                            '<i class="live-status"></i>',
                        '</div>',
                    '</div>'
                ].join('');
    
                var liveListitemEle = $(itemHtml);
                frag.appendChild(liveListitemEle[0]);
            });
    
            $liveList.append($(frag));
            
            autoCreatePlayer();
        }
    
        function checkInlineOutline(imei, cb, parentEle) {
            // 1001代表开始直播，1002代表结束直播，1003代表imei有误，1004代表用户不在线，1005后台异常，1008该IMEI未授权。
    
            $.ajax({
                type: 'get',
                async: false,
                url: 'http://112.33.19.160:9090/showCode.action?type=1001&imei=' + imei,
                dataType: 'jsonp',
                jsonp: 'callback',
                success: function (data) {
                    cb(data, parentEle, imei);
                },
                error: function () {
                    console.warn('服务器连接错误失败，请重试');
                }
            });
            // cb({code: "1001"});
        };
        
        function checkInlineOutlineCb(codeStatus, parentEle, imei){
            switch (codeStatus.code) {
                case '1004':
                    layer.open({
                        title: false,
                        icon: 2,
                        content: '该设备不在线'
                    });
                    parentEle.addClass('off').removeClass('on');
                    break;
                case '1008':
                    layer.open({
                        title: false,
                        icon: 2,
                        content: '该设备未授权'
                    });
                    break;
                case '1001':
                    parentEle.addClass('on').removeClass('off');
                    createPlayerInstance(imei);
                    break;
            }
        }
    
        function createPlayerInstance(imei) {
            if (imei in playerSet) {
                showPlayerInstance(imei);
                return;
            }
    
            var tabheadhtml = [
                '<li data-imei="' + imei + '">',
                '<span>直播画面</span>',
                '<i data-imei="' + imei + '" class="close-btn"></i>',
                '</li>'
            ].join('');
            var tabhead = $(tabheadhtml);
    
            var tabbodyhtml = [
                '<div data-imei="' + imei + '" class="liveplay-box">',
                    '<div class="liveplay-mainbox">',
                        '<p class="liveplay-imei fl">IMEI号：' + imei + '</p>',
                        '<p class="liveplay-djs fr"><span>30</span>秒后允许切换摄像头</p>',
                        '<div style="clear: both;"></div>',
                        '<div class="liveplay-ctrl">',
                            '<span class="careama-status">车前直播画面</span>',
                            '<i data-imei="' + imei + '" class="conversion-icon"></i>',
                        '</div>',
                        '<div class="liveplay-videobox">',
                            '<div id="bsplay' + imei + '" class="liveplay-video"></div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');
            var tabbody = $(tabbodyhtml);
    
            $tabhead.append(tabhead);
            $tabbody.append(tabbody);
    
            playerSet[imei] = {};
            playerSet[imei].tabhead = tabhead;
            playerSet[imei].tabbody = tabbody;
    
            var player = new BroadsenseLive('bsplay' + imei);
            player.play(imei);
            playerSet[imei].player = player;
    
            playerSet[imei].careamaTimer = setInterval(function () {
                var states = playerSet[imei].player.getBsLiveStateus().camera == 1 ? '车前直播画面' : '车内直播画面';
                playerSet[imei].tabbody.find('.careama-status').html(states);
            }, 3000);
    
            showPlayerInstance(imei);
        }
    
    
        function destroyPlayerInstance(imei) {
            playerSet[imei].player.stop();
            clearInterval(playerSet[imei].careamaTimer);
            clearInterval(playerSet[imei].djsTimer);
            playerSet[imei].djsTimer = null;
    
            setTimeout(function () {
                playerSet[imei].tabhead.remove();
                playerSet[imei].tabbody.remove();
                playerSet[imei].player = null;
                delete playerSet[imei];
                showPlayerInstance();
            }, 500);
        }
    
    
        function showPlayerInstance(imei) {
            $tabhead.find('li').removeClass('cur');
            $tabbody.find('.liveplay-box').addClass('hide');
            $liveList.addClass('hide');
    
            if (imei === null || imei == undefined) {
                $tabhead.find('li').eq(0).addClass('cur');
                $liveList.removeClass('hide');
                return;
            }
    
            if (playerSet[imei]) {
                playerSet[imei].tabhead.addClass('cur');
                playerSet[imei].tabbody.removeClass('hide');
                return;
            }
        }
    
        //当前打开的播放记录集合
        var playerSet = {};
        
        var $tabhead = $('#tabhead');
        var $tabbody = $('#tabbody');
        var $liveList = $('#liveList');
    
    
        $.get('../blive.action', {
            Type: 1
        }, function (data) {
            createLiveListitem(data.imeilist);
        }, 'json');
    
        $(document).on('click', '.play-btn', function () {
            // var parentsListitem = $(this).parents('.livetest-list-item');
            var parentsLivebox = $(this).parents('.live-box');
    
            var imei = $(this).data('imei');
    
            checkInlineOutline(imei, checkInlineOutlineCb, parentsLivebox);
        });
    
        $(document).on('click', '#tabhead li', function () {
            var imei = $(this).data('imei');
            showPlayerInstance(imei);
        });
    
    
        $(document).on('click', '.close-btn', function () {
            var imei = $(this).data('imei');
            destroyPlayerInstance(imei);
        });
    
        $(document).on('click', '.conversion-icon', function () {
            var imei = $(this).data('imei');
    
            if (playerSet[imei].djsTimer) {
                return;
            }
    
            playerSet[imei].player.switchCamera();
    
            playerSet[imei].djsNum = 30;
            playerSet[imei].djsTimer = setInterval(function () {
                if (playerSet[imei].djsNum == 0) {
                    clearInterval(playerSet[imei].djsTimer);
                    playerSet[imei].djsTimer = null;
                    playerSet[imei].tabbody.find('.liveplay-djs').hide();
                    return;
                }
                playerSet[imei].tabbody.find('.liveplay-djs').show().html(playerSet[imei].djsNum + '秒后允许切换摄像头');
                playerSet[imei].djsNum--;
            }, 1000);
        });
    });