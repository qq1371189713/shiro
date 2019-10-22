
var layer;
var form;
var tableInfo;
var tabInfo
var subIndex;
var act;
var leftTree;
var formTree;

var setting = {
    check: {
        enable: false,
        chkStyle: "checkbox",
        chkboxType: { "Y": "", "N": "" }
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentid",
            rootPId: 0,
            level: 0
        }
    },
    callback: {
        onClick: function(event, treeId, treeNode, clickFlag) {
            var id = treeNode.id;
            tableInfo.reload('teamTab', {
                where: { //设定异步数据接口的额外参数，任意设
                    id: id
                }
            });
        }
    }
};
var settings = {
    check: {
        enable: true,
        chkStyle: "checkbox",
        chkboxType: { "Y": "", "N": "" }
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentid",
            rootPId: 0,
            level: 0
        }
    },
    callback: {
        onClick: function(event, treeId, treeNode, clickFlag) {
            $("#parentid").val(treeNode.parentid);
            $("#pName").val(treeNode.name);
            $("#level").val(treeNode.level + 1);
        },
        beforeCheck: function(treeId, treeNode) {
            if(treeNode.useType == 2) {
                return false;
            }
            unCheckNode();
            return true;
        },
        onCheck: function(event, treeId, treeNode) {
            treeNode.checked = true;
            formTree.updateNode(treeNode);
            $("#parentid").val(treeNode.id);
            $("#pName").val(treeNode.name);
            $("#level").val(treeNode.level + 1);
        }
    }
};

$(function(){
	
	var height = $(window).height() - 75;
    leftTree = initTeamTree(setting, 'menuTeamTree');
    formTree = initTeamTree(settings, 'menuTree');
	layui.use(['layer', 'form', 'table', 'laytpl'], function(){
		layer = layui.layer;
		form = layui.form;
		tableInfo = layui.table;
		  
		  //第一个实例
		tabInfo = tableInfo.render({
		    elem: '#teamTab',
		    height: height - 90,
		    method: 'post',
		    url: '/business/team/queries.action', //数据接口
		    page: true, //开启分页
		    limit: 20,
		    limits: [10, 20, 30],
		    cols: [[ //表头
              {type: 'numbers', title: '序号', width : '40'},
		      {field: 'name', title: '团队名称', width:180},
		      {field: 'managerName', title: '团队管理员', width:160},
		      {field: 'managerPhone', title: '团队管理员联系方式', width:160},
		      {field: 'userName', title: '添加人', width: 100},
                // {field: 'level', title: '层级', width: 160},
                // {field: 'seq', title: '序号', width: 160},
		      {field: '', title: '添加时间', width: 160, templet: '<div>{{ new Date(d.createTime).format() }}</div>'},
		      {field: '', title: '操作', width: 140, templet: function(d){
                    if(d.id == $("#tIds").val()) return '';
                    return '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>' +
                           '<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>';
                  }
		      }
		    ]],
		    done: function (res, curr, count) {
		    }
		  });
		
		//监听工具条
		tableInfo.on('tool(teamTab)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; 
			if (layEvent === 'edit') {


                if(data.parentid == 0) {
                    $("#p").hide();
                } else {
                    $("#p").show();
                    unCheckNode();
                    node = formTree.getNodeByParam("id", data.parentid, null);
                    node.checked = true;
                    formTree.updateNode(node);
                    data.pName = node.name;
                }
                form.val("team", data);
                open("团队编辑", $("#operate"));
                act = 1;
		    } else if (layEvent === 'del') {
		    	act = 2;
		    	sub(act, {id : data.id});
		    } else if (layEvent === 'selbranch') {
                var id = data.id;
                tableInfo.reload('teamTab', {
                    where: { //设定异步数据接口的额外参数，任意设
                        id: id
                    }
                });
            }
        });
		
		form.verify({
			name: function(value, item) {
				return name(value, '团队名称输入有误');
			},
			managerName: function(value, item) {
				return name(value, '团队管理员输入有误');
			},
			phone: function(value, item) {
				return phone(value, '联系方式输入有误');
			}
		});
		
		form.on('submit(sub)', function(data){
			sub(act, data.field);
		    return false;
		});
		
	});
	
	$("#searchBtn").click(function() {
		var name = $("#name").val();
		tableInfo.reload('teamTab', {
		  where: { //设定异步数据接口的额外参数，任意设
			  name: name,
			  id: ""
		  }
		});
	});
	
	$("#addBtn").click(function() {
		open("团队新增", $("#operate"));
		act = 0;
	});

    $("#pName").click(function() {
        var index = layer.open({
            title: "请选择父团队",
            type: 1,
            zIndex: 20000000,
            //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            content: $("#menuTree"),
            area:  ['400px', '90%']
        });
    });
	
});

function sub(act, data) {
	var url = "/business/team/"
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
                    leftTree = initTeamTree(setting, 'menuTeamTree');
                    formTree = initTeamTree(settings, 'menuTree');
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
	if(undefined == area) area = ['500px', '420px'];
	subIndex = layer.open({
		title: title,
		type: 1,
		 //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		content: dom,
		area: area,
		end: function() {
			$("#form")[0].reset();
            unCheckNode();
		}
	});
}




function unCheckNode() {
    var nodes = formTree.getCheckedNodes(true);
    for(var i = 0, leg = nodes.length; i < leg; i++) {
        formTree.checkNode(nodes[i], false, false, false);
    }
}
