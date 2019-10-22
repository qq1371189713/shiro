$(function () {


    //临时变量，随便删除。
    var tmpBoolean = true;


    /*
        流量管理-首页
    */
    if (pageId === 'tmHome') {



        /*
            计算.section-box的高度
        */
        var $tmRow2SectionEle = $('#tmRow2 .section-box');
        var tmRow2SectionEleH = 0;
        $tmRow2SectionEle.each(function (index, ele) {
            var height = $(ele).outerHeight();
            if (height > tmRow2SectionEleH) {
                tmRow2SectionEleH = height;
            }
        });
        $tmRow2SectionEle.outerHeight(tmRow2SectionEleH);

        layui.use(['form'], function () {
        });

        /*
            物联网卡状态统计
            Internet of Things card status statistics
            itcss 
        */
        var $itcssEle = $('#itcss');
        var itcssOption = {
            color: ['#445ef5', '#6279f1', '#44adff', '#82f3ff', '#dadade'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c}台 ({d}%)"
            },
            series: [
                {
                    name: '物联网卡状态统计',
                    type: 'pie',
                    radius: ['60%', '85%'],
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        { value: 335, name: '正常' },
                        { value: 310, name: '待激活' },
                        { value: 234, name: '停机' },
                        { value: 135, name: '销户' },
                        { value: 1548, name: '其他' }
                    ]
                }
            ]
        };
        var itcssChart = echarts.init($itcssEle[0]);
        itcssChart.setOption(itcssOption);



        /*
            生命周期 
            Life cycle
            lc
        */
        var $lcEle = $('#lc');
        var lcOption = {
            color: ['#445ef5', '#6279f1', '#44adff', '#dadade'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c}台 ({d}%)"
            },
            series: [
                {
                    name: '生命周期',
                    type: 'pie',
                    radius: ['60%', '85%'],
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        { value: 335, name: '正式期' },
                        { value: 310, name: '沉默期' },
                        { value: 234, name: '测试期' },
                        { value: 1548, name: '其他' }
                    ]
                }
            ]
        };
        var lcChart = echarts.init($lcEle[0]);
        lcChart.setOption(lcOption);



        /*
            运营商
            Telecom operators
            to
        */
        var $toEle = $('#to');
        var toOption = {
            color: ['#445ef5', '#6279f1', '#44adff'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c}台 ({d}%)"
            },
            series: [
                {
                    name: '运营商',
                    type: 'pie',
                    radius: ['60%', '85%'],
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        { value: 335, name: '中国移动' },
                        { value: 310, name: '中国联通' },
                        { value: 234, name: '中国电信' }
                    ]
                }
            ]
        };
        var toChart = echarts.init($toEle[0]);
        toChart.setOption(toOption);



        /*
            流量使用趋势
            Traffic usage trends
            tut
        */
        var $tutEle = $('#tut');
        var tutOption = {
            grid: {
                left: '0.5%',
                right: '1%',
                top: '3%',
                bottom: '0%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} G'
                },
                axisPointer: {
                    snap: true
                }
            },
            series: [
                {
                    name: '流量使用',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#445ef5'
                        }
                    },
                    data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400]
                }
            ]
        };
        var tutChart = echarts.init($tutEle[0]);
        tutChart.setOption(tutOption);



        /*
            终端在线情况统计
            Terminal online statistics
            tos
        */
        var $tosEle = $('#tos');
        var tosOption = {
            color: ['#445ef5', '#dadade'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c}台 ({d}%)"
            },
            series: [
                {
                    name: '终端在线情况统计',
                    type: 'pie',
                    radius: ['60%', '85%'],
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        { value: 335, name: '在线' },
                        { value: 310, name: '离线' }
                    ]
                }
            ]
        };
        var tosChart = echarts.init($tosEle[0]);
        tosChart.setOption(tosOption);



        /*
            流量卡分布
            Traffic card distribution
            tcd
        */
        function randomData() {
            return Math.round(Math.random() * 1000);
        }
        var $tcdEle = $('#tcd');
        var tcdOption = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var res = params.name + '：';
                    res += params.value + '人<br>全国占比：10%';
                    return res;
                }
            },
            visualMap: {
                type: 'piecewise',
                pieces: [
                    { min: 0, max: 100, label: '低', color: '#e4e9f0' },
                    { min: 101, max: 500, label: '中', color: '#c9cfd7' },
                    { min: 501, max: 10000, label: '高', color: '#445ef5' },
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
                    layoutSize: '130%',
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: [
                        { name: '北京', value: randomData() },
                        { name: '天津', value: randomData() },
                        { name: '上海', value: randomData() },
                        { name: '重庆', value: randomData() },
                        { name: '河北', value: randomData() },
                        { name: '河南', value: randomData() },
                        { name: '云南', value: randomData() },
                        { name: '辽宁', value: randomData() },
                        { name: '黑龙江', value: randomData() },
                        { name: '湖南', value: randomData() },
                        { name: '安徽', value: randomData() },
                        { name: '山东', value: randomData() },
                        { name: '新疆', value: randomData() },
                        { name: '江苏', value: randomData() },
                        { name: '浙江', value: randomData() },
                        { name: '江西', value: randomData() },
                        { name: '湖北', value: randomData() },
                        { name: '广西', value: randomData() },
                        { name: '甘肃', value: randomData() },
                        { name: '山西', value: randomData() },
                        { name: '内蒙古', value: randomData() },
                        { name: '陕西', value: randomData() },
                        { name: '吉林', value: randomData() },
                        { name: '福建', value: randomData() },
                        { name: '贵州', value: randomData() },
                        { name: '广东', value: randomData() },
                        { name: '青海', value: randomData() },
                        { name: '西藏', value: randomData() },
                        { name: '四川', value: randomData() },
                        { name: '宁夏', value: randomData() },
                        { name: '海南', value: randomData() },
                        { name: '台湾', value: randomData() },
                        { name: '香港', value: randomData() },
                        { name: '澳门', value: randomData() }
                    ]
                }
            ]
        };
        var tcdChart = echarts.init($tcdEle[0]);
        tcdChart.setOption(tcdOption);



        /*
            套餐订购及使用情况 
            Package ordering and usage
            poau
        */
        var $poauEle = $('#poau');
        var poauOption = {
            color: ['#445ef5', '#d9d9d9'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['实际使用流量', '套餐剩余流量', '购买人数']
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '3%',
                top: '8%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['套餐一', '套餐二', '套餐三', '套餐四', '套餐五', '套餐六', '套餐七']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '实际使用流量',
                    type: 'bar',
                    stack: '套餐订购及使用情况',
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 0, 10, 10]
                        }
                    },
                    barWidth: '20',
                    data: [30, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '套餐剩余流量',
                    type: 'bar',
                    stack: '套餐订购及使用情况',
                    itemStyle: {
                        normal: {
                            barBorderRadius: [10, 10, 0, 0]
                        }
                    },
                    barWidth: '20',
                    data: [70, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '购买人数',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: '#00d8c6'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 216, 198, 0.5)'
                            }, {
                                offset: 1,
                                color: 'rgba(255, 255, 255, 0.3)'
                            }])
                        }
                    },
                    data: [930, 551, 646, 465, 250, 792, 397]
                }
            ]
        };
        var poauChart = echarts.init($poauEle[0]);
        poauChart.setOption(poauOption);



        /*
            套餐订购情况
            Package ordering situation
            pos
        */
        var $posEle = $('#pos');
        var posOption = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.name +
                        '<br>订购次数: ' + params.data.value +
                        '<br>人均订购次数：' + params.data.value2;
                }
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: '10%',
                top: 20,
                bottom: 20,
                data: ['套餐一', '套餐二', '套餐三', '套餐四', '套餐五', '套餐六', '套餐七', '套餐八', '套餐九', '套餐十', '套餐十一', '套餐十二', '套餐十三']
            },
            series: [
                {
                    name: '套餐订购情况',
                    type: 'pie',
                    radius: ['60%', '85%'],
                    center: ['45%', '50%'],
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        { value: 335, value2: 555, name: '套餐一' },
                        { value: 310, value2: 555, name: '套餐二' },
                        { value: 234, value2: 555, name: '套餐三' },
                        { value: 135, value2: 555, name: '套餐四' },
                        { value: 135, value2: 555, name: '套餐五' },
                        { value: 1548, value2: 555, name: '套餐六' },
                        { value: 1548, value2: 555, name: '套餐七' },
                        { value: 1548, value2: 555, name: '套餐八' },
                        { value: 1548, value2: 555, name: '套餐九' },
                        { value: 1548, value2: 555, name: '套餐十' },
                        { value: 1548, value2: 555, name: '套餐十一' },
                        { value: 1548, value2: 555, name: '套餐十二' },
                        { value: 1548, value2: 555, name: '套餐十三' }
                    ]
                }
            ]
        };
        var posChart = echarts.init($posEle[0]);
        posChart.setOption(posOption);



    }





    /* 
        流量管理-流量卡管理
    */
    if (pageId === 'tmTrafficCardManagement') {




        layui.use(['layer', 'form', 'table', 'laydate'], function () {




            layui.table.render({
                elem: '#tmHomepageTable',
                cols: [
                    [
                        { field: 'id', title: '序号', width: 60 },
                        { field: 'username', title: '客户类型', width: 180 },
                        { field: 'sex', title: 'ICCID', width: 180 },
                        { field: 'city', title: '服务号码', width: 180 },
                        { field: 'sign', title: '终端编号', width: 180 },
                        { field: 'experience', title: '运营商', width: 100 },
                        { field: 'score', title: '网络制式', width: 90 },
                        { field: 'classify', title: '基础套餐', width: 250 },
                        { field: 'wealth1', title: '卡状态', width: 100 },
                        { field: 'wealth2', title: '本月已使用流量', width: 130 },
                        { field: 'wealth3', title: '本月剩余流量', width: 130 },
                        { field: 'wealth4', title: '超流量自动停机', width: 130 },
                        { field: 'wealth5', title: '超时自动停机', width: 130 },
                        { title: '操作', fixed: 'right', width: 300, align: 'center', toolbar: '#barDemo' }
                    ]
                ],
                data: [
                    { 'id': 1, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 2, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 3, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 4, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 5, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 6, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 7, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 8, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 9, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 10, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' }
                ]
            });



            layui.table.on('tool(tmHomepageTable)', function (obj) {
                var data = obj.data;
                var event = obj.event;

                if (event === 'edit') {
                    layer.open({
                        type: 1,
                        title: '编辑流量卡',
                        area: ['600px', '545px'],
                        content: $('#editTrafficCard')
                    });
                }
                else if (event === 'active') {
                    layer.alert('是否确定激活？', {
                        icon: 3,
                        title: ' ',
                        btn: ['确定', '取消'],
                        btn1: function () {
                            if (tmpBoolean) {
                                layer.alert('激活成功', {
                                    icon: 1,
                                    title: false
                                });
                            }
                            else {
                                layer.alert('激活失败，请稍后再试', {
                                    icon: 2,
                                    title: false
                                });
                            }
                            tmpBoolean = !tmpBoolean;
                        }
                    });
                }
                else if (event === 'shutdown') {
                    layer.alert('是否停机？', {
                        icon: 3,
                        title: ' ',
                        btn: ['确定', '取消'],
                        btn1: function () {
                            if (tmpBoolean) {
                                layer.alert('停机操作成功', {
                                    icon: 1,
                                    title: false
                                });
                            }
                            else {
                                layer.alert('停机操作失败，请稍后再试', {
                                    icon: 2,
                                    title: false
                                });
                            }
                            tmpBoolean = !tmpBoolean;
                        }
                    });
                }
                else if (event === 'restore') {
                    layer.alert('是否复机？', {
                        icon: 3,
                        title: ' ',
                        btn: ['确定', '取消'],
                        btn1: function () {
                            if (tmpBoolean) {
                                layer.alert('复机操作成功', {
                                    icon: 1,
                                    title: false
                                });
                            }
                            else {
                                layer.alert('复机操作失败，请稍后再试', {
                                    icon: 2,
                                    title: false
                                });
                            }
                            tmpBoolean = !tmpBoolean;
                        }
                    });
                }
                else if (event === 'details') {
                    // alert('查看详情的逻辑');
                    $('#tmIndex').removeClass('show');
                    $('#tmDetails').addClass('show');

                }
            });

            var $addTrafficCardBtn = $('#addTrafficCardBtn');
            $addTrafficCardBtn.click(function () {
                layer.open({
                    type: 1,
                    title: '新增流量卡',
                    area: ['600px', '545px'],
                    content: $('#editTrafficCard')
                });
            });

            var $exportTrafficCardBtn = $('#exportTrafficCardBtn');
            $exportTrafficCardBtn.click(function () {
                if (tmpBoolean) {
                    layer.alert('导出成功', {
                        icon: 1,
                        title: false
                    });
                }
                else {
                    layer.alert('导出失败，请稍后再试', {
                        icon: 2,
                        title: false
                    });
                }
                tmpBoolean = !tmpBoolean;
            });

            $importTrafficCardBtn = $('#importTrafficCardBtn');
            $importTrafficCardBtn.click(function () {
                layer.open({
                    type: 1,
                    title: '批量导入流量卡',
                    area: '600px',
                    content: $('#importTrafficCard')
                });
            });


            var $tmDetailsTabHeader = $('#tmDetailsTab .tabheader-item');
            var $tmDetailsTabBodyer = $('#tmDetailsTab .tabbodyer-item');
            $tmDetailsTabHeader.click(function () {
                var index = $(this).index();
                $(this).addClass('cur').siblings().removeClass('cur');
                $tmDetailsTabBodyer.eq(index).addClass('show').siblings().removeClass('show');
            });


            $('.toidetailsBtn').click(function () {
                $('#tmDetails').removeClass('show');
                $('#tmInternetdetails').addClass('show');
            });


            $('.backBtn').click(function () {
                if ($(this).hasClass('backToIndex')) {
                    $('#tmIndex').addClass('show');
                    $('#tmDetails').removeClass('show');
                }
                else if ($(this).hasClass('backToDetails')) {
                    $('#tmDetails').addClass('show');
                    $('#tmInternetdetails').removeClass('show');
                }
            });



        /*
            历史月账单
            History monthly bill
            hmb
        */
        var $hmbEle = $('#hmb');
        var hmbOption = {
            color: ['#445ef5'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '3%',
                top: '8%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['七月', '八月', '九月', '十月', '十一月', '十二月']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '历史月账单',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 10
                        }
                    },
                    barWidth: '15',
                    data: [132, 101, 134, 90, 230, 210]
                }
            ]
        };
        var hmbChart = echarts.init($hmbEle[0]);
        hmbChart.setOption(hmbOption);

        /*
            流量使用情况
            Traffic usage
            tu
        */
        var $tuEle = $('#tu');
        var tuOption = {
            color: ['#445ef5'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '3%',
                top: '8%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['七月', '八月', '九月', '十月', '十一月', '十二月']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '历史月账单',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 10
                        }
                    },
                    barWidth: '15',
                    data: [132, 101, 134, 90, 230, 210]
                }
            ]
        };
        var tuChart = echarts.init($tuEle[0]);
        tuChart.setOption(tuOption);


        $('#tud dt').click(function(){
            $(this).parent('dl').toggleClass('show');
        });


        layui.laydate.render({
            elem: '#trafficUsageTime',
            type: 'datetime',
            range: true
        });


        layui.table.render({
            elem: '#tmTrafficUsageTable',
            cols: [
                [
                    { field: 'id', title: '序号', width: 60 },
                    { field: 'username', title: '订单号', width: 180 },
                    { field: 'sex', title: '购买时间', width: 180 },
                    { field: 'city', title: '套餐名称', width: 180 },
                    { field: 'sign', title: '套餐流量', width: 180 },
                    { field: 'experience', title: '单价（元）', width: 100 },
                    { field: 'score', title: '有效期', width: 90 },
                    { field: 'classify', title: '备注', width: 250 },
                    { field: 'wealth6', title: '交易状态', width: 130 }
                ]
            ],
            data: [
                { 'id': 1, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 2, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 3, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 4, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 5, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 6, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 7, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 8, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 9, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 10, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 11, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 12, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 13, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 14, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 15, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                { 'id': 16, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' }
            ]
        });


        layui.table.render({
            elem: '#tmInternetdetailsTable',
            cols: [
                [
                    { field: 'id', title: '开始时间'},
                    { field: 'time', title: '时长' },
                    { field: 'count', title: '消耗流量' },
                    { field: 'type', title: '网络类型' },
                    { field: 'ip', title: 'IP' },
                ]
            ],
            data: [
                { 'id': 1, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 2, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 3, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 4, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 5, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 6, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 7, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 8, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 9, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'},
                { 'id': 10, 'time': '集团--东风', 'count': '12345678912345', 'type': '12345678912345', 'ip': '12345678912345'}
            ]
        });


        });
    }




    /*
        流量管理-流量套餐
    */
    if (pageId === 'tmTrafficPackage') {
        layui.use(['layer', 'form', 'table', 'laydate'], function () {


            layui.table.render({
                elem: '#tmTrafficPackageTable',
                cols: [
                    [
                        { field: 'id', title: '序号', width: 60 },
                        { field: 'username', title: '套餐编号', width: 180 },
                        { field: 'sex', title: '套餐类型', width: 180 },
                        { field: 'city', title: '套餐名称', width: 180 },
                        { field: 'sign', title: '套餐总流量（M）', width: 180 },
                        { field: 'experience', title: '套餐零售价（元）', width: 100 },
                        { field: 'score', title: '数量', width: 90 },
                        { field: 'classify', title: '折扣（折）', width: 250 },
                        { field: 'wealth1', title: '实际售价', width: 100 },
                        { field: 'wealth2', title: '生效时间', width: 130 },
                        { field: 'wealth3', title: '结束时间', width: 130 },
                        { field: 'wealth4', title: '订购数', width: 130 },
                        { field: 'wealth5', title: '销售开始时间', width: 130 },
                        { field: 'wealth6', title: '销售结束时间', width: 130 },
                        { field: 'wealth7', title: '是否生效', width: 130 },
                        { field: 'wealth8', title: '备注', width: 130 },
                        { title: '操作', fixed: 'right', width: 300, align: 'center', toolbar: '#barDemo' }
                    ]
                ],
                data: [
                    { 'id': 1, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 2, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 3, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 4, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 5, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 6, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 7, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 8, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 9, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 10, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 11, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 12, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 13, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 14, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 15, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 16, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' }
                ]
            });

            layui.table.on('tool(tmTrafficPackageTable)', function (obj) {
                var data = obj.data;
                var event = obj.event;

                if (event === 'edit') {
                    layer.open({
                        type: 1,
                        title: '编辑套餐信息',
                        area: ['600px', '545px'],
                        content: $('#editPackageInfo')
                    });
                }
                else if (event === 'delete') {
                    layer.alert('是否确定删除？', {
                        icon: 3,
                        title: ' ',
                        btn: ['确定', '取消'],
                        btn1: function () {
                            if (tmpBoolean) {
                                layer.alert('删除操作成功', {
                                    icon: 1,
                                    title: false
                                });
                            }
                            else {
                                layer.alert('删除操作失败，请稍后再试', {
                                    icon: 2,
                                    title: false
                                });
                            }
                            tmpBoolean = !tmpBoolean;
                        }
                    });
                }
            });

            var $addPackageInfoBtn = $('#addPackageInfoBtn');
            $addPackageInfoBtn.click(function () {
                layer.open({
                    type: 1,
                    title: '添加套餐信息',
                    area: ['600px', '545px'],
                    content: $('#editPackageInfo')
                });
            });


            var $importPackageInfoBtn = $('#importPackageInfoBtn');
            $importPackageInfoBtn.click(function () {
                layer.open({
                    type: 1,
                    title: '批量导入套餐信息',
                    area: '600px',
                    content: $('#importPackageInfo')
                });
            });

            var $exportPackageInfoBtn = $('#exportPackageInfoBtn');
            $exportPackageInfoBtn.click(function () {
                if (tmpBoolean) {
                    layer.alert('导出成功', {
                        icon: 1,
                        title: false
                    });
                }
                else {
                    layer.alert('导出失败，请稍后再试', {
                        icon: 2,
                        title: false
                    });
                }
                tmpBoolean = !tmpBoolean;
            });

            layui.laydate.render({
                elem: '#packageEffectiveTime',
                type: 'datetime',
                range: true
            });

            layui.laydate.render({
                elem: '#packageSalesTime',
                type: 'datetime',
                range: true
            });

            



        });
    }



    /*
        订单与结算
        tmOrderSettlement
    */
    if (pageId === 'tmOrderSettlement') {

        layui.use(['layer', 'form', 'table', 'laydate'], function () {

            layui.laydate.render({
                elem: '#orderTransactionTime',
                type: 'datetime',
                range: true
            });

            var $exportOrderInfoBtn = $('#exportOrderInfoBtn');
            $exportOrderInfoBtn.click(function () {
                if (tmpBoolean) {
                    layer.alert('导出成功', {
                        icon: 1,
                        title: false
                    });
                }
                else {
                    layer.alert('导出失败，请稍后再试', {
                        icon: 2,
                        title: false
                    });
                }
                tmpBoolean = !tmpBoolean;
            });



            layui.table.render({
                elem: '#tmOrderSettlementTable',
                cols: [
                    [
                        { field: 'id', title: '序号', width: 60 },
                        { field: 'username', title: '交易流水号', width: 180 },
                        { field: 'sex', title: '交易时间', width: 180 },
                        { field: 'city', title: '交易类型', width: 180 },
                        { field: 'sign', title: '费用类型', width: 180 },
                        { field: 'experience', title: '订单编号', width: 100 },
                        { field: 'score', title: 'ICCID', width: 90 },
                        { field: 'classify', title: '商品名称', width: 250 },
                        { field: 'wealth1', title: '资金渠道', width: 100 },
                        { field: 'wealth2', title: '支付账号', width: 130 },
                        { field: 'wealth3', title: '金额（元）', width: 130 },
                        { field: 'wealth4', title: '服务费（元）', width: 130 },
                        { field: 'wealth5', title: '备注', width: 130 },
                        { field: 'wealth6', title: '交易状态', width: 130 }
                    ]
                ],
                data: [
                    { 'id': 1, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 2, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 3, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 4, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 5, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 6, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 7, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 8, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 9, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 10, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 11, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 12, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 13, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 14, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 15, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' },
                    { 'id': 16, 'username': '集团--东风', 'sex': '12345678912345', 'city': '12345678912345', 'sign': '12345678912345', 'experience': '中国移动', 'score': '2G', 'classify': '3个月长期通用流量25元套餐国内', 'wealth1': '已停机', 'wealth2': '1024M', 'wealth3': '1024M', 'wealth4': '未开通', 'wealth5': '未开通' }
                ]
            });

            

        });

    }

});