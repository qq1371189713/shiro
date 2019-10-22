
var layer;
var form;
var tableInfo;
var tabInfo
var subIndex;
var act;
//var addMenuSet = new Set();
//var delMenuSet = new Set();

var menuSetting = {
	check: {
		enable: true,
		chkStyle: "checkbox",
		chkboxType: { "Y": "p", "N": "" }
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
		beforeCheck: function(event, treeId, treeNode) {
//			console.log(treeId)
		},
		onCheck: function(event, treeId, treeNode) {
//			console.log(treeNode.checked);
		}
	}
};

var roleSetting = {
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
			beforeCheck: function(treeId, treeNode) {
				if(treeNode.id == $("#id").val()) {
					layer.msg('不能选择本身作为父节点', {zIndex:20000000});
					return false;
				}
				rzTreeObj.checkAllNodes(false);
				return true;
			},
			onCheck: function(event, treeId, treeNode) {
				if(treeNode.checked == true) {
					$("#pId").val(treeNode.id);
					$("#pName").val(treeNode.name);
				} else {
					$("#pId").val("");
					$("#pName").val("");
				}
			}
		}
	};

$(function(){
	
	var height = $(window).height() - 75;
	
	initTree(menuSetting);
	
	initRoleTree(roleSetting);
	
	layui.use(['layer', 'form', 'table', 'laytpl'], function(){
		layer = layui.layer;
		form = layui.form;
		tableInfo = layui.table;
		  
		  //第一个实例
		tabInfo = tableInfo.render({
		    elem: '#roleTab',
		    height: height - 90,
		    method: 'post',
		    url: '/system/role/queries.action', //数据接口
		    page: true, //开启分页
		    limit: 20,
		    limits: [10, 20, 30],
		    cols: [[ //表头
              {type: 'numbers', title: '序号', width : '40'},
		      {field: 'name', title: '角色名称', width:160},
		      {field: 'remark', title: '描述', width: 160},
		      {field: 'id', title: '操作', width: 200, templet:
		      	function (d) {
		      		if(d.id != rId) {
		      			return '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>' +
                            '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>' +
                            '<a class="layui-btn layui-btn-xs" lay-event="permAssig">权限分配</a>';
					} else if(d.id === 7) {
		      			return '<a class="layui-btn layui-btn-xs" lay-event="permAssig">权限分配</a>';
					}
		      		return '';
                }
		      }
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
		tableInfo.on('tool(roleTab)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; 
			if (layEvent === 'edit') {
			    if(data.pId == 0) {
			    	$("#p").hide();
			    } else {
			    	$("#p").show();
			    	rzTreeObj.checkAllNodes(false);
			    	node = rzTreeObj.getNodeByParam("id", data.pId, null);
			    	node.checked = true;
			    	$("#pName").val(node.name);
			    	rzTreeObj.updateNode(node);
			    }
			    form.val("role", data);
			    open("角色编辑", $("#operate"), ['500px', '320px']);
			    act = 1;
		    } else if (layEvent === 'del') {
		    	act = 2;
		    	sub(act, {id : data.id});
		    } else if (layEvent === 'permAssig') {
		    	act = 3;
		    	$("#roleId").val(data.id);
		    	var data = getPermsByRoleId(data.id);
		    	var size = data.length;
		    	if(size > 0) {
		    		var arr = new Array();
		    		for(var i = 0, leg = data.length; i < leg; i++) {
		    			arr.push(data[i].menuId);
		    		}
		    		checkTree(true, arr);
		    	}
		    	// open("请选择菜单", $("#menuPanel"), ['400px', '90%']);
				subIndex = layer.open({
					type: 1
					,title: '请选择菜单'
					,area: ['390px', '90%']
					,content: $("#menuPanel")
					,btn: ['保存', '重置', '关闭'] //只是为了演示
					,yes: function(){
						$("#subPri").trigger('click');
					}
					,btn2: function(){
						$.fn.zTree.getZTreeObj("menuTree").checkAllNodes(false);
						return false;
					}
					,end: function () {
						checkTree(false, null);
					}
				});
		    }
		});
		
		form.verify({
			name: function(value, item) {
				return name(value, '角色名称输入有误');
			},
		});
		
		form.on('submit(sub)', function(data){
			if(!$("#pName").val() || !$("#pId").val()) {
				layer.msg("请先选择父角色");
				return false;
			}
			sub(act, data.field);
		    return false;
		});
		
		form.on('submit(subTree)', function(data){
			var nodes = zTreeObj.getCheckedNodes(true);
			var menuIds = "";
			for(var i = 0, leg = nodes.length; i < leg; i++) {
				menuIds += nodes[i].id;
				if(i < leg - 1) {
					menuIds += ",";
				}
			}
			data.field.menuIds = menuIds;
			sub(act, data.field);
		    return false;
		});
		  
	});

	$("#roleReset").click(function () {
		$("#pId").val('');
		$.fn.zTree.getZTreeObj("roleTree").checkAllNodes(false);
	});
	
	$("#pName").click(function() {
		var index = layer.open({
			title: "请选择父角色",
			type: 1,
			zIndex: 20000000,
			 //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
			content: $("#roleTree"),
			area:  ['400px', '300px']
		});
		
	});
	
	$("#searchBtn").click(function() {
		var name = $("#name").val();
		tableInfo.reload('roleTab', {
		  where: { //设定异步数据接口的额外参数，任意设
			  name: name
		  }
		});
	});
	
	$("#addBtn").click(function() {
		open("角色新增", $("#operate"), ['500px', '320px']);
		$("#id").val('');
		$("#roleReset").trigger('click');
		act = 0;
	});
	
});

function sub(act, data) {
	var url = "/system/role/"
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
	} else if(act == 3) {
		url = "/system/privilege/inserts.action";
		msg = "确定分配权限吗?";
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

function getPermsByRoleId(roleId) {
	var url = "/system/privilege/queries.action";
	var data = null;
	$.ajax({
        url: url,
        type: "post",
        async: false,
        data: {roleId: roleId, status: 1},
        success:function(res){
        	data = res.data;
        },
        error:function(e){
            layer.msg("错误！！");
        }
    });  
	return data;
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

