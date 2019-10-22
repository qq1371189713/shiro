$(function(){
    var $verdistrEcharts = $('#verdistrEcharts');

    var myChart = echarts.init($verdistrEcharts[0]);

    var option = option = {
        title : {
            text: 'R611已经激活XXX台',
            x: 'center',
            top: '0'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series : [
            {
                name: '设备数量总览',
                type: 'pie',
                radius: ['55%', '75%'],
                center: ['50%', '55%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ]
            }
        ]
    };

    myChart.setOption(option);

    var resizeTimer = null;
    $(window).resize(function(){
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function(){
            myChart.resize();
        }, 50);
    });
});