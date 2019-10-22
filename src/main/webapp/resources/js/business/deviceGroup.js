
var layer;
var form;
var tableInfo;
var tabInfo
var subIndex;
var act;

$(function(){

    var height = $(window).height() - 75;

    layui.use(['layer', 'form', 'table', 'laytpl'], function(){
        layer = layui.layer;
        form = layui.form;
        tableInfo = layui.table;

        //第一个实例
        tabInfo = tableInfo.render({
            elem: '#groupTab',
            height: height - 90,
            method: 'post',
            url: '/business/devicegroup/queries.action', //数据接口
            page: true, //开启分页
            limit: 20,
            limits: [10, 20, 30],
            cols: [[ //表头
                {field: 'groupId', title: '序号', width : 160},
                {field: 'groupName', title: '分组名称', width:160},
                {field: '', title: '添加时间', width: 160, templet: '<div>{{ new Date(d.createTime).format() }}</div>'},
                {field: 'id', title: '操作', width: 200, templet: opBar}
            ]],
            done: function (res, curr, count) {
            }
        });

        //监听工具条
        tableInfo.on('tool(groupTab)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                form.val("devicegroup", data);
                console.log("编辑",data);
                act = 1;
                open("分组编辑", $("#operate"));

            } else if (layEvent === 'del') {
                act = 2;
                console.log("删除",data);
                sub(act, {id : data.id});
            }
        });

        form.verify({
            groupId: function(value, item) {
                return name(value, '分组编号输入有误');
            },
            groupName: function(value, item) {
                return name(value, '分组名称输入有误');
            }
        });

        form.on('submit(sub)', function(data){
            sub(act, data.field);
            return false;
        });

    });

    $("#searchBtn").click(function() {
        var gName = $("#gName").val();
        tableInfo.reload('groupTab', {
            where: { //设定异步数据接口的额外参数，任意设
                groupName: gName
            }
        });
    });

    $("#addBtn").click(function() {
        open("分组新增", $("#operate"));
        act = 0;
    });

});

function sub(act, data) {
    var url = "/business/devicegroup/"
    var msg = "";
    if(act == 0) {
        url += "inserts.action";
        msg = "确定新增吗?";
    } else if(act == 1) {
        url += "updates.action";
        msg = "确定修改吗?";
    } else if(act == 2) {
        url += "deletes.action";
        msg = "确定删除吗?";
    }
    layer.confirm(msg, {icon: 3, title:'提示'}, function(index){
        var subLoadIndex = layer.load(2);
        $.ajax({
            url: url,
            type: "post",
            data: data,
            success:function(res){
                layer.msg(res.msg);
                layer.close(subIndex);
                layer.close(subLoadIndex);
                if(res.code == 0) {
                    tabInfo.reload();
                }
            },
            error:function(e){
                layer.msg("错误！！");
                layer.close(subLoadIndex);
            }
        });
    });
}

function open(title, dom, area) {
    if(undefined == area) area = ['500px', '400px'];
    subIndex = layer.open({
        title: title,
        type: 1,
        //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
        content: dom,
        area: area,
        end: function() {
            $("#form")[0].reset();
        }
    });
}

