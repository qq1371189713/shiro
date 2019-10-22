
var layer;
var form;
var tableInfo;
var tableIns;
var subIndex;
var act;
var upload;

$(function() {

    layui.use(['layer', 'form', 'table', 'laydate', 'laytpl'], function () {
        layer = layui.layer;
        form = layui.form;
        tableInfo = layui.table;
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
          elem: '#startTime',
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss'
        });
        laydate.render({
		    elem: '#endTime',
		    type: 'datetime',
		    format: 'yyyy-MM-dd HH:mm:ss'
		});
        //第一个实例
        tableIns = tableInfo.render({
            elem: '#jeevesTable',
            height: 315,
            method: 'post',
            url: '/business/jeeves/queries.action', //数据接口
            page: true, //开启分页
            limit: 20,
            limits: [10, 20, 30],
            cols: [[ //表头
                {field: 'state', title: '任务状态', width: '8%', templet:'#stateTmp' },
                {field: 'reason', title: '施工原因', width: '10%'},
                {field: '', title: '施工时间', width: '10%' ,templet: '<div>{{ new Date(d.startTime).format() }} - {{ new Date(d.endTime).format() }}</div>'},
                {field: 'address', title: '施工作业地点', width: '10%'},
                {field: 'lineType', title: '施工路面类型', width: '10%'},
                {field: 'taskMode', title: '施工工作方式', width: '10%'},
                {field: 'personNum', title: '施工人数', width: '8%'},
                {field: 'address', title: '安全设备及数量', width: '8%'},
                {field: 'safePhone', title: '现场安全员联系方式', width: '8%'},
                {field: 'chargePhone', title: '施工负责人联系方式', width:'9%'},
                {field: 'id', title: '操作', width: '11%', templet: opBar}
            ]],
            done: function (res, curr, count) {
            }
        });

        //监听工具条
        tableInfo.on('tool(jeevesTable)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event;
            console.log(data)
            if("edit" == layEvent) {
                form.val("jeeves", data);
                $("#startTime").val(new Date(data.startTime).format());
                $("#endTime").val(new Date(data.endTime).format());
                open("占道记录编辑", $("#operate"));
                act = 1;
            } else if("del" == layEvent) {
            	act = 2;
            	var data = {id: data.id};
            	sub(act, data);
            } else if('detail' == layEvent) {
            	form.val("jeeves", data);
            	$("#startTime").val(new Date(data.startTime).format());
                $("#endTime").val(new Date(data.endTime).format());
            	open("占道记录详情", $("#operate"));
            	$("#subDiv").hide();
            }
        });
        
      //验证格式
		form.verify({
			IMEI : [/^\d{15}$/,'IMEI输入有误，IMEI为15位数字'],
			blank: [/^[^\s]*$/,'不能出现空格'],
			normal : [/^$|^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,'不能输入_以外的特殊字符且不能以_开头或结尾'],
			mac: [/[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/, 'MAC地址输入有误']
		});

        form.on('submit(submit)', function(data){
            sub(act, data.field);
            return false;
        });

    });
    
    $("#searchBtn").click(function() {
    	tableIns.reload({where : {
		    imei : $('#imei1').val(),
		},page: {
		    curr: 1 //重新从第 1 页开始
		  }
		});
    });

    $("#addBtn").click(function() {
        open("占道记录新增", $("#operate"));
        act = 0;
    });
    
    queryCount();
});

function open(title, dom, area) {
    if(undefined == area) area = ['500px', '450px'];
    subIndex = layer.open({
        title: title,
        type: 1,
        content: dom,
        area: area,
        end: function() {
            $("#form")[0].reset();
            $("#subDiv").show();
        }
    });
}

function queryCount() {
	var act = '/business/jeeves/queryCount.action';
	$.ajax({
		url : act,
		type : 'post',
		async : false,
		dataType : 'json',
		success : function(data) {
			if (0 == data.code) {
				$("#count1").text(data.count1);
			    $("#count2").text(data.count2);
			    $("#count3").text(data.count3);
			}  else if("2001" != data.code) {
				layer.msg(data.msg, {anim : 6,icon: 5});
			}
		},
		error : function(xhr, e1, e2) {
		}
	}); 
}

function sub(subFlag, data) {
	var act = "";
	var msg = "确认新增吗?";
	if (0 == subFlag) {
		//后台校验重复提交标示
		act = '/business/jeeves/inserts.action';
	} else if(1 == subFlag){
		act = '/business/jeeves/updates.action';
		msg = "确认修改吗?";
	} else if(2 == subFlag){
		act = '/business/jeeves/deletes.action';
		msg = "确认删除吗?";
	}
	layer.confirm(msg, {icon: 3, title:'提示'}, function(index){
		var subLoadIndex = layer.load(2);
		$.ajax({
			url : act,
			type : 'post',
			async : false,
			data : data,
			dataType : 'json',
			success : function(data) {
				if (0 == data.code) {
					if (0 == subFlag) {
						tableIns.reload({page: {curr: 1}});
					} else {
						tableIns.reload();
					}
					layer.msg(data.msg,{icon: 6});
					layer.close(subIndex);
				}  else if("2001" != data.code) {
					layer.msg(data.msg, {anim : 6,icon: 5});
				}
				layer.close(subLoadIndex);
			},
			error : function(xhr, e1, e2) {
				layer.close(subLoadIndex);
			}
		}); 
	});
}


