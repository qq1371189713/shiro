$(function(){
    // var resizeTimer = null;
    // $(window).resize(function(){
    //     clearTimeout(resizeTimer);

    //     resizeTimer = setTimeout(function(){
    //         myChart.resize();
    //     }, 50);
    // });


    var $sbslzlEcharts = $('#sbslzlEcharts');
    var sbslzlEcharts = echarts.init($sbslzlEcharts[0]);
    var sbslzlOption = {
        title : {
            text: '33.33%',
            textStyle: {
                fontSize: 60,
                color: '#445ef5',
                fontWeight: 'normal'
            },
            top: '38%',
            left: '27.5%',
            subtext: '已激活设备占比',
            subtextStyle: {
                align: 'center',
                fontSize: 18,
                color: '#989ba2'
            }
        },
        color:['#445ef5', '#ff673f'],  
        series : [
            {
                name: '设备数量总览',
                type: 'pie',
                label: {
                    normal: {
                        show: false,
                    },
                    emphasis: {
                        show: false,
                    }
                },
                radius: ['85%', '90%'],
                center: ['50%', '50%'],
                data:[
                    {value:300, name:'已激活设备'},
                    {value:600, name:'未激活设备'}
                ]
            }
        ]
    };
    sbslzlEcharts.setOption(sbslzlOption);
    
    
    

    var $mzjhslEcharts = $('#mzjhslEcharts');
    var mzjhslEcharts = echarts.init($mzjhslEcharts[0]);
    var mzjhslOption = {
        tooltip : {
            // trigger: 'axis',
            // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            // }
            trigger: 'axis',
            formatter: function(params){
                return params[0].axisValue + '：' + params[0].value + '台';
            },
            backgroundColor: '#ffffff',
            borderColor: '#d7dae3',
            borderWidth: '2',
            textStyle: {
                color: '#637492'
            },
            padding: 15,
            extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'
        },
        grid: {
            top: '5%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['第一周', '第二周', '第三周', '第四周'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'设备每周激活数量',
                type:'bar',
                barWidth: '5%',
                data:[276, 152, 200, 334],
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#d0d7fc'},
                                {offset: 0.5, color: '#a1aefa'},
                                {offset: 1, color: '#445ef5'}
                            ]
                        ),
                        barBorderRadius: 10
                    }
                },
                // markPoint: {
                //     symbolSize: 1,
                //     symbolOffset: [0, '50%'],
                //     label: {
                //        normal: {
                //             show: true,
                //             formatter: '{a|{a}\n}{b|{b} }{c|{c}}',
                //             backgroundColor: 'rgb(242,242,242)',
                //             borderColor: '#aaa',
                //             borderWidth: 1,
                //             borderRadius: 4,
                //             padding: [4, 10],
                //             lineHeight: 26,
                //             // shadowBlur: 5,
                //             // shadowColor: '#000',
                //             // shadowOffsetX: 0,
                //             // shadowOffsetY: 1,
                //             position: 'center',
                //             distance: 0,
                //             rich: {
                //                 a: {
                //                     align: 'center',
                //                     color: '#fff',
                //                     fontSize: 18,
                //                     textShadowBlur: 2,
                //                     textShadowColor: '#000',
                //                     textShadowOffsetX: 0,
                //                     textShadowOffsetY: 1,
                //                     textBorderColor: '#333',
                //                     textBorderWidth: 2
                //                 },
                //                 b: {
                //                      color: '#333'
                //                 },
                //                 c: {
                //                     color: '#ff8811',
                //                     textBorderColor: '#000',
                //                     textBorderWidth: 1,
                //                     fontSize: 22
                //                 }
                //             }
                //        },
                //        emphasis: {
                //            show: true
                //        }
                //     },
                //     data: [
                //         {type: 'max', name: 'max days: '},
                //         {type: 'min', name: 'min days: '}
                //     ]
                // }
            }
        ]
    };
    mzjhslEcharts.setOption(mzjhslOption);




    var $rhsbEcharts = $('#rhsbEcharts');
    var rhsbEcharts = echarts.init($rhsbEcharts[0]);

    var date = [];
    var data = [];
    for(var i = 1; i <= 31; i++){
        data.push(Math.ceil(Math.random()*100));
        var time = i < 10 ? ('0' + 1) : i;
        date.push(i);
    }
    
    var rhsbOption = {
        grid: {
            top: '5%',
            left: '0%',
            right: '1%',
            bottom: '0%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            },
            formatter: function(params){
                return params[0].axisValue + '日：' + params[0].value + '台';
            },
            backgroundColor: '#ffffff',
            borderColor: '#d7dae3',
            borderWidth: '2',
            textStyle: {
                color: '#637492'
            },
            padding: 15,
            extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'
        },
        
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '50%']
        },
        series: [
            {
                name: '日活设备',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(68, 94, 245)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(92, 105, 255)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 255, 255)'
                        }])
                    }
                },
                data: data
            }
        ]
    };
    rhsbEcharts.setOption(rhsbOption);


    function randomData() {
        return Math.round(Math.random()*1000);
    }
    var $jhsbslfbEcharts = $('#jhsbslfbEcharts');
    var jhsbslfbEcharts = echarts.init($jhsbslfbEcharts[0]);
    var jhsbslfbOption = {
        title: {
            text: '用户数量分布',
            left: 'center',
            bottom: '0',
            textStyle: {
                color: '#989ba2',
                fontWeight: 'normal',
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params){
                var res = params.name+'<br/>';
                res += '已激活：' + params.value + '人<br>全国占比：10%';
                return res;
            }
        },
        visualMap: {
            type: 'piecewise',
            pieces: [
                {min: 0, max: 100, label: '0<= 低 <=100', color: '#e4e9f0'},
                {min: 101, max: 500, label: '101<= 中 <=500', color: '#cad0d8'},
                {min: 501, max: 10000, label: '501<= 高 <= ~', color: '#445ef5'},
            ],
            top: 0
        },
        series: [
            {
                name: '激活设备数量分布',
                type: 'map',
                mapType: 'china',
                roam: false,
                layoutCenter: ['50%', '50%'],
                layoutSize: '120%',
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data:[
                    {name: '北京',value: randomData() },
                    {name: '天津',value: randomData() },
                    {name: '上海',value: randomData() },
                    {name: '重庆',value: randomData() },
                    {name: '河北',value: randomData() },
                    {name: '河南',value: randomData() },
                    {name: '云南',value: randomData() },
                    {name: '辽宁',value: randomData() },
                    {name: '黑龙江',value: randomData() },
                    {name: '湖南',value: randomData() },
                    {name: '安徽',value: randomData() },
                    {name: '山东',value: randomData() },
                    {name: '新疆',value: randomData() },
                    {name: '江苏',value: randomData() },
                    {name: '浙江',value: randomData() },
                    {name: '江西',value: randomData() },
                    {name: '湖北',value: randomData() },
                    {name: '广西',value: randomData() },
                    {name: '甘肃',value: randomData() },
                    {name: '山西',value: randomData() },
                    {name: '内蒙古',value: randomData() },
                    {name: '陕西',value: randomData() },
                    {name: '吉林',value: randomData() },
                    {name: '福建',value: randomData() },
                    {name: '贵州',value: randomData() },
                    {name: '广东',value: randomData() },
                    {name: '青海',value: randomData() },
                    {name: '西藏',value: randomData() },
                    {name: '四川',value: randomData() },
                    {name: '宁夏',value: randomData() },
                    {name: '海南',value: randomData() },
                    {name: '台湾',value: randomData() },
                    {name: '香港',value: randomData() },
                    {name: '澳门',value: randomData() }
                ]
            }
        ]
    };
    jhsbslfbEcharts.setOption(jhsbslfbOption);


    var $yhsbfbBottomleftEcharts = $('#yhsbfbBottomleftEcharts');
    var yhsbfbBottomleftEcharts = echarts.init($yhsbfbBottomleftEcharts[0]);
    var yhsbfbBottomleftOption = {
        title: {
            text: '月活设备分布',
            left: 'center',
            bottom: '0',
            textStyle: {
                color: '#989ba2',
                fontWeight: 'normal',
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params){
                var res = params.name+'<br/>';
                res += '已激活：' + params.value + '人<br>全国占比：10%';
                return res;
            }
        },
        visualMap: {
            type: 'piecewise',
            pieces: [
                {min: 0, max: 100, label: '0<= 低 <=100', color: '#e4e9f0'},
                {min: 101, max: 500, label: '101<= 中 <=500', color: '#cad0d8'},
                {min: 501, max: 10000, label: '501<= 高 <= ~', color: '#445ef5'},
            ],
            top: 0
        },
        series: [
            {
                name: '激活设备数量分布',
                type: 'map',
                mapType: 'china',
                roam: false,
                layoutCenter: ['50%', '50%'],
                layoutSize: '120%',
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                data:[
                    {name: '北京',value: randomData() },
                    {name: '天津',value: randomData() },
                    {name: '上海',value: randomData() },
                    {name: '重庆',value: randomData() },
                    {name: '河北',value: randomData() },
                    {name: '河南',value: randomData() },
                    {name: '云南',value: randomData() },
                    {name: '辽宁',value: randomData() },
                    {name: '黑龙江',value: randomData() },
                    {name: '湖南',value: randomData() },
                    {name: '安徽',value: randomData() },
                    {name: '山东',value: randomData() },
                    {name: '新疆',value: randomData() },
                    {name: '江苏',value: randomData() },
                    {name: '浙江',value: randomData() },
                    {name: '江西',value: randomData() },
                    {name: '湖北',value: randomData() },
                    {name: '广西',value: randomData() },
                    {name: '甘肃',value: randomData() },
                    {name: '山西',value: randomData() },
                    {name: '内蒙古',value: randomData() },
                    {name: '陕西',value: randomData() },
                    {name: '吉林',value: randomData() },
                    {name: '福建',value: randomData() },
                    {name: '贵州',value: randomData() },
                    {name: '广东',value: randomData() },
                    {name: '青海',value: randomData() },
                    {name: '西藏',value: randomData() },
                    {name: '四川',value: randomData() },
                    {name: '宁夏',value: randomData() },
                    {name: '海南',value: randomData() },
                    {name: '台湾',value: randomData() },
                    {name: '香港',value: randomData() },
                    {name: '澳门',value: randomData() }
                ]
            }
        ]
    };
    yhsbfbBottomleftEcharts.setOption(yhsbfbBottomleftOption);




    var $wxsjtjEcharts = $('#wxsjtjEcharts');
    var wxsjtjEcharts = echarts.init($wxsjtjEcharts[0]);
    var wxsjtjOption = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['微信用户量', '绑定微信设备量', '报备数量']
        },
        grid: {
            top: '5%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                data: ['R611', 'R621', 'R821']
            }
        ],
        // xAxis : [
        //     {
        //         type : 'category',
        //         data : ['第一周', '第二周', '第三周', '第四周'],
        //         axisTick: {
        //             alignWithLabel: true
        //         }
        //     }
        // ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series: [
            {
                name: '微信用户量',
                type: 'bar',
                barGap: 0,
                data: [320, 332, 301],
                barWidth: '3%',
                barGap: '150%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#ffe1df'},
                                {offset: 0.5, color: '#ffb7a9'},
                                {offset: 1, color: '#fd7a4c'}
                            ]
                        ),
                        barBorderRadius: 10
                    }
                }
            },
            {
                name: '绑定微信设备量',
                type: 'bar',
                data: [220, 182, 191],
                barWidth: '3%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#c4e6ff'},
                                {offset: 0.5, color: '#81c9ff'},
                                {offset: 1, color: '#009dff'}
                            ]
                        ),
                        barBorderRadius: 10
                    }
                }
            },
            {
                name: '报备数量',
                type: 'bar',
                data: [150, 232, 20],
                barWidth: '3%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#8cf2ef'},
                                {offset: 0.5, color: '#00e8df'},
                                {offset: 1, color: '#00d8c6'}
                            ]
                        ),
                        barBorderRadius: 10
                    }
                }
            }
        ]
    };
    wxsjtjEcharts.setOption(wxsjtjOption);
});