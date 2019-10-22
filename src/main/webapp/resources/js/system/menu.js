
var layer;
var form;
var table;
var tabInfo;
var subIndex;
var act;

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
			unCheckNode();
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
	
	var height = $(window).height() - 75;
	
	initTree(setting);
	
	layui.use(['layer', 'form', 'table', 'laytpl'], function(){
		layer = layui.layer;
		form = layui.form;
		table = layui.table;
		  
		  //第一个实例
		tabInfo = table.render({
		    elem: '#menuTab',
		    height: height - 90,
		    method: 'post',
		    url: '/system/menu/queries.action', //数据接口
		    page: true, //开启分页
		    limit: 20,
		    limits: [10, 20, 30],
		    cols: [[ //表头
              {type: 'numbers', title: '序号', width : '40'},
		      {field: 'name', title: '菜单名称', width:180},
		      {field: 'value', title: 'URL', width:300},
		      {field: 'useType', title: '菜单类型', width:160, templet: useTypeTmp},
		      {field: 'level', title: '层级', width:80},
		      {field: 'seq', title: '序列', width: 80},
		      {field: 'remark', title: '描述', width: 200},
		      {field: '', title: '操作', width: 160, templet: opBar}
		    ]],
		    done: function (res, curr, count) {
		    	if(count > 0) {
		    		$("#p").show();
		    	} else {
		    		$("#p").hide();
		    	}
		    }
		  });
		
		//监听工具条
		table.on('tool(menuTab)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; 
		    if (layEvent === 'del') {
		    	act = 2;
		    	sub(act, {id : data.id});
		    } else if (layEvent === 'edit') {
		    	if(data.pId == 0) {
		    		$("#p").hide();
		    	} else {
		    		$("#p").show();
		    		unCheckNode();
		    		node = zTreeObj.getNodeByParam("id", data.pId, null); 
					node.checked = true;
					zTreeObj.updateNode(node);
					data.pName = node.name;
		    	}
			    form.val("menu", data);
			    open("菜单编辑", $("#operate"));
			    act = 1;
		   }
		});
		
		form.verify({
			name: function(value, item) {
				return name(value, '菜单名称输入有误');
			},
			url: function(value, item) {
				if("" != value) {
					if(!/^[a-z.]+$/.test(value)) {
						return '菜单URL输入有误';
					}
				}
			},
			seq: function(value, item) {
				return seq(value, '菜单序列输入有误');
			},
		});
		
		form.on('submit(sub)', function(data){
			sub(act, data.field);
		    return false;
		});
		  
	});
	
	$("#searchBtn").click(function() {
		var name = $("#name").val();
		tabInfo.reload({
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
			area:  ['400px', '90%']
		});
	});
	
});

function sub(act, data) {
	var url = "/system/menu/"
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
	if(undefined == area) area = ['500px', '450px'];
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
	var nodes = zTreeObj.getCheckedNodes(true);
	for(var i = 0, leg = nodes.length; i < leg; i++) {
		zTreeObj.checkNode(nodes[i], false, false, false);
	}
}

