
var layer;
var form;
var tableInfo;
var subIndex;
var act;

var zTreeObj;
var setting = {
	check: {
		enable: true,
		chkStyle: "checkbox",
		chkboxType: { "Y": "", "N": "" }
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
			pIdKey: "pId",
			rootPId: 0,
			level: 0
		}
	},
	callback: {
		onClick: function(event, treeId, treeNode, clickFlag) {
			console.log(treeNode)
			$("#pId").val(treeNode.pId);
			$("#pName").val(treeNode.name);
			$("#level").val(treeNode.level + 1);
		},
		beforeCheck: function(treeId, treeNode) {
			if(treeNode.useType == 2) {
				return false;
			}
			var nodes = zTreeObj.getCheckedNodes(true);
			for(var i = 0, leg = nodes.length; i < leg; i++) {
				zTreeObj.checkNode(nodes[i], false, false, false);
			}
			return true;
		},
		onCheck: function(event, treeId, treeNode) {
			treeNode.checked = true;
			zTreeObj.updateNode(treeNode);
			$("#pId").val(treeNode.id);
			$("#pName").val(treeNode.name);
			$("#level").val(treeNode.level + 1);
		}
	}
};

var memuTreeData = [];

$(function(){
	
	initTree();
	
	layui.use(['layer', 'form', 'table', 'laytpl'], function(){
		layer = layui.layer;
		form = layui.form;
		tableInfo = layui.table;
		  
		  //第一个实例
		tableInfo.render({
		    elem: '#menuTab',
		    height: 315,
		    method: 'post',
		    url: '/system/menu/queries.action', //数据接口
		    page: true, //开启分页
		    limit: 20,
		    limits: [10, 20, 30],
		    cols: [[ //表头
		      {field: 'name', title: '菜单名称', width:160},
		      {field: 'value', title: 'URL', width:200},
		      {field: 'useType', title: '菜单类型', width:160, templet: useTypeTmp},
		      {field: 'level', title: '层级', width:160},
		      {field: 'seq', title: '序列', width: 160},
		      {field: 'description', title: '描述', width: 160},
		      {field: 'id', title: '操作', width: 160, templet: opBar}
		    ]],
		    done: function (res, curr, count) {
		    	if(count > 0) {
		    		$("#p").show();
		    	} else {
		    		$("#p").hidde();
		    	}
		    }
		  });
		
		//监听工具条
		tableInfo.on('tool(menuTab)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; 
		    if (layEvent === 'del') {
		    	act = 2;
		    	sub(act, {id : data.id});
		    } else if (layEvent === 'edit') {
		    	if(data.pId == 0) {
		    		$("#p").hidde();
		    	} else {
		    		var nodes = zTreeObj.getCheckedNodes(true);
		    		for(var i = 0, leg = nodes.length; i < leg; i++) {
		    			zTreeObj.checkNode(nodes[i], false, false, false);
		    		}
		    		node = zTreeObj.getNodeByParam("id", data.pId, null); 
					node.checked = true;
					zTreeObj.updateNode(node);
					console.log(node)
					data.pName = node.name;
		    	}
			    form.val("menu", data);
			    open("菜单编辑", $("#operate"));
			    act = 1;
		   }
		});
		
		form.on('submit(sub)', function(data){
			sub(act, data.field);
		    return false;
		});
		  
	});
	
	$("#qryBtn").click(function() {
		var name = $("#name").val();
		tableInfo.reload('menuTab', {
		  where: { //设定异步数据接口的额外参数，任意设
			  name: name
		  }
		});
	});
	
	$("#addBtn").click(function() {
		open("菜单新增", $("#operate"));
		act = 0;
	});
	
	$("#pName").click(function() {
		var index = layer.open({
			title: "请选择父菜单",
			type: 1,
			zIndex: 20000000,
			 //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			content: $("#menuTree"),
			area:  ['400px', '600px']
		});
		
	});
	
});

function initTree() {
	var zNodes = loadTreeData();
	zTreeObj = $.fn.zTree.init($("#menuTree"), setting, zNodes);
	zTreeObj.expandAll(true);
}

function sub(act, data) {
	var url = "/system/menu/"
	if(act == 0) {
		url += "inserts.action";
	} else if(act == 1) {
		url += "updates.action";
	} else if(act == 2) {
		url += "deletes.action";
	}
	$.ajax({
        url: url,
        type: "post",
        data: data,
        success:function(res){
        	layer.msg(res.msg);
        	layer.close(subIndex);
        	if(res.code == 1) {
        		tableInfo.reload();
        	}
        },
        error:function(e){
            layer.msg("错误！！");
           
        }
    });  
}

function open(title, dom, area) {
	if(undefined == area) area = ['500px', '450px'];
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

function loadTreeData() {
	var data;
	$.ajax({
        url: "/system/menu/queries.action",
        type: "post",
        async: false,
        data: {
        	dataReturnType: 1
        },
        success:function(res){
        	data = res.data;
        },
        error:function(e){
            layer.msg("错误！！");
           
        }
    }); 
	return data;
}

