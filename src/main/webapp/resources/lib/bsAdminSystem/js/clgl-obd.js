$(function(){
    var $obdTabHead = $('#obdTabHead li');
    var $obdTabBody = $('#obdTabBody .info-box');

    $obdTabHead.click(function(){
        var index = $(this).index();
        $(this).addClass('cur').siblings().removeClass('cur');
        $obdTabBody.removeClass('cur').eq(index).addClass('cur');
    });
});