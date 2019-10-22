
var layer;
var form;
var tableInfo;
var tableIns;
var tableIns1;
var tableIns2;
var subIndex;
var act;
var upload;

$(function() {

    layui.use(['layer', 'table', 'laytpl'], function () {
        layer = layui.layer;
        tableInfo = layui.table;
      
        tableIns1 = tableInfo.render({
            elem: '#useTable',
            height: 315,
            method: 'post',
            page: true, //开启分页
            limit: 20,
            limits: [10, 20, 30],
            cols: [[ //表头
            	{ type: 'numbers',  title: '序号', width : '8%',},			
                {field: '', title: '开始使用时间', width: '12%',templet: '<div>{{ new Date(d.createTime).format() }}</div>'},
                {field: '', title: '结束使用时间', width: '12%'},
                {field: '', title: '使用时长', width: '13%'},
                {field: '', title: '预警记录', width: '13%'},
                {field: '', title: '消耗电量', width: '13%'},
                {field: '', title: '剩余电量', width: '13%'},
                {field: '', title: '使用位置', width: '13%'},
            ]],
            done: function (res, curr, count) {
            }
        });
        
        tableIns2 = tableInfo.render({
            elem: '#repairTable',
            height: 315,
            method: 'post',
            page: true, //开启分页
            limit: 20,
            limits: [10, 20, 30],
            cols: [[ //表头
            	{ type: 'numbers',  title: '序号', width : '15%',},			
                {field: '', title: '维修申请时间', width: '20%',templet: '<div>{{ new Date(d.createTime).format() }}</div>'},
                {field: 'reason', title: '维修原因', width: '20%'},
                {field: 'applyName', title: '维修申请人', width: '20%'},
                {field: 'applyPhone', title: '联系方式', width: '20%'},
            ]],
            done: function (res, curr, count) {
            }
        });
        
        var id = $("#id").val();
    	var number = $("#number").val();
    	var img = $("#img").val();
        $("#deviceId1").text(number);
    	$("#img2").attr("src", requestUrl + img);
    	
    	tableIns1.reload({
    		url: '/business/repair/queries.action',
    		where: {
    			deviceId: id,
    			type: 0
    		}
    	});
    	tableIns2.reload({
    		url: '/business/repair/queries.action',
    		where: {
    			deviceId: id,
    			type: 0
    		}
    	});

    });
    
});
