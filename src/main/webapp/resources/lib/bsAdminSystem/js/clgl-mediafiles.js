$(function(){
    layui.laydate.render({
        elem: '#timeSelect',
        type: 'datetime',
        range: '到',
        format: 'yyyy年M月d日H时m分s秒'
    });

    var $mediaFileHead = $('#mediaFileHead a');
    var $mediaFileBody = $('#mediaFileBody .fn-box');
    $mediaFileHead.click(function(){
        var index = $(this).index();
        $(this).addClass('cur').siblings().removeClass('cur');
        $mediaFileBody.eq(index).addClass('cur').siblings().removeClass('cur');
    });
});