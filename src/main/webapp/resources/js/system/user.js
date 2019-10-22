
var pubKey = "b58605f4d8ec22e58816afb482779ace72d033a32045303e891405978b0b2f5f4559ceee07b43121349b1743339965685305e5b70293b72105912d37483174c0c4bb866f75b65da77177caba931f3f514f9bb8f6c38f0fe7a868b2096cf2a64b75d4ae920d3036103367dae3ebeb77d8c4841a6b3d4edc0d062f93c4a16eaa6b";
var exponent = "10001";

function encryption(str){
    var rsa = new RSAKey()
    rsa.setPublic(pubKey, exponent);
    var encryptStr = rsa.encrypt(str);
    return encryptStr;
}

var layer;
var form;
var tableInfo;
var tabInfo;
var laydate;
var subIndex;
var panelIndex;
var act;
var selectM;

var teamM;
var roleTree;

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
		beforeCheck: function(treeId, treeNode) {
			if(!rzTreeObj.getNodeByParam('id', treeNode.pId)){
				layer.msg('只能分配下级角色');
				return false;
			}
			var nodes = rzTreeObj.getCheckedNodes(true);
			for(var i = 0, leg = nodes.length; i < leg; i++) {
				rzTreeObj.checkNode(nodes[i], false, false, false);
			}
			return true;
		},
		onCheck: function(event, treeId, treeNode) {
			if(treeNode.checked == true) {
				$("#roleId").val(treeNode.id);
			} else {
				$("#roleId").val("");
			}
		}
	}
};
var formSetting = {
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
			if(!roleTree.getNodeByParam('id', treeNode.pId)){
				layer.msg('只能分配下级角色');
				return false;
			}
			var nodes = roleTree.getCheckedNodes(true);
			for(var i = 0, leg = nodes.length; i < leg; i++) {
				roleTree.checkNode(nodes[i], false, false, false);
			}
			return true;
		},
		onCheck: function(event, treeId, treeNode) {
			if(treeNode.checked == true) {
				$("#rId").val(treeNode.id);
				$("#roleName").val(treeNode.name);
				layer.close(panelIndex);
			} else {
				$("#roleId").val("");
				$("#roleName").val('');
			}
		}
	}
};

$(function(){

	var height = $(window).height() - 75;

	roleTree = initRoleTree(formSetting, 'roleSelect');
	initRoleTree(setting);

	layui.config({
	    base : '../../resources/tools/layui/'
	  }).extend({
	    selectM: './selectM',
	  }).use(['layer', 'form', 'table', 'laytpl', 'laydate', 'selectM'], function(){
		layer = layui.layer;
		form = layui.form;
		laydate = layui.laydate;
		tableInfo = layui.table;
		selectM = layui.selectM;
		
		laydate.render({
		    elem: '#birthday' //指定元素
		});
		  
		  //第一个实例
		tabInfo = tableInfo.render({
		    elem: '#userTab',
		    height: height - 90,
		    method: 'post',
		    url: '/system/user/queries.action', //数据接口
		    page: true, //开启分页
		    limit: 20,
		    limits: [10, 20, 30],
		    cols: [[ //表头
              {type: 'numbers', title: '序号'},
              {field: 'account', title: '账号', width:160},
		      {field: 'name', title: '姓名', width:120},
		      {field: 'roleName', title: '角色名称', width:140},
		      {field: 'teamName', title: '所属团队', width:120},
		      {field: 'phone', title: '电话', width: 150},
		      {field: 'email', title: '邮箱', width: 180},
		      {field: '', title: '操作', width: 300,
				  templet: function (d) {
					  var bar = '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>';
					  if(d.id == $("#curUserId").val()) {
					  	bar += '<a class="layui-btn layui-btn-xs" lay-event="changepwd">修改密码</a>';
					  } else {
						bar += '<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>' +
							   '<a class="layui-btn layui-btn-xs" lay-event="permAssig">角色分配</a>' +
					  		   '<a class="layui-btn layui-btn-xs" lay-event="restore">重置密码</a>';
					  }
					  return bar;
				  } 
		      }
		    ]]
		  });
		
		//监听工具条
		tableInfo.on('tool(userTab)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
			var data = obj.data; //获得当前行数据
			var layEvent = obj.event; 
		    if (layEvent === 'del') {
		    	act = 2;
		    	sub(act, {id : data.id});
		    } else if (layEvent === 'edit') {
		    	isAdd = false;
			    form.val("user", data);
			    teamM.set([data.teamIds]);
			    // $("#password").addClass('input-disabled').attr('disabled', 'disabled').removeAttr('lay-verify');
				$("#password").closest(".layui-form-item").hide();
				if(data.id == $("#curUserId").val()) {
					$("#teamIds").closest('.layui-form-item').hide();
					$("#roleName").closest('.layui-form-item').hide();
				} else {
					$("#teamIds").closest('.layui-form-item').show();
					$("#roleName").closest('.layui-form-item').show();
				}
				$("#account").attr('readonly', 'readonly');
			    open("用户编辑", $("#operate"));
			    act = 1;
		    } else if(layEvent == 'permAssig') {
		    	$("#userId").val(data.id);
		    	$("#roleId").val(data.roleId);
		    	act = 3;
		    	if(undefined != data.roleId) {
		    		var node = rzTreeObj.getNodeByParam("id", data.roleId, null); 
			    	node.checked = true;
			    	rzTreeObj.updateNode(node);
		    	}
		    	open("请选择角色", $("#rolePanel"), ['500px', '300px']);
		    } else if(layEvent == 'changepwd') {
		    	act = 4;
		    	$("#pwdForm")[0].reset();
		    	$("#uId").val(data.id);
				open("修改密码", $("#pwdPanel"), ['500px', '320px']);
			} else if(layEvent == 'restore') {
				layer.confirm('确认要对该用户进行重置密码操作？', {icon: 3, title:'提示'}, function(index){
					layer.close(index);
					var loading = layer.load(2);
					$.post('/system/user/restore.action', {id:data.id}, function (data, status) {
						layer.close(loading);
						if(status == 'success') {
							if(data.code == 0) {
								layer.open({
									title: '密码重置成功'
									,content: '用户新密码为：'+data.msg
								});
							} else {
								data = eval('('+data+')');
								layer.msg(data.msg, {icon: 5, anim: 6});
							}
						} else {
							layer.msg("错误！！");
						}
					});
				});

			}
		});
		
		form.verify({
			name: function(value, item) {
				return name(value, '姓名输入有误');
			},
			phone: function(value, item) {
				return phone(value, '电话号码输入有误');
			},
			password: function(value, item) {
				return password(value, "密码至少8个字符，包括数字和字母");
			}
		});
		
		form.on('submit(sub)', function(data){
			if(!data.field.teamIds && $("#curUserId").val() != $("#id").val()) {
				layer.msg('所属团队必选');
				return false;
			}
			if(isAdd) {
				if(!data.field.password) {
					layer.msg('密码至少8个字符，包括数字和字母');
					return false;
				}
				var validMsg = password(data.field.password, '密码至少8个字符，包括数字和字母');
				if(validMsg){
					layer.msg(validMsg);
					return false;
				}
			}
			if(data.field.phone) {
				var validMsg = phone(data.field.phone, '电话号码输入有误');
				if(validMsg){
					layer.msg(validMsg);
					return false;
				}
			}
			if(!data.field.roleName || !data.field.roleId) {
				layer.msg('请先分配用户角色');
				return false;
			}
			sub(act, data.field);
		    return false;
		});
		
		form.on('submit(subTree)', function(data){
			if(!data.field.roleId) {
				layer.msg('请先选择角色，再进行保存操作');
				return false;
			}
			sub(act, data.field);
			return false;
		});

		form.on('submit(subPwd)', function(data){
			var jsonData = data.field;
			if(jsonData.password_new && jsonData.password_new === jsonData.password_two) {
				jsonData.password = encryption(jsonData.password);
				jsonData['password_new'] = encryption(jsonData['password_new']);
				jsonData['password_two'] = encryption(jsonData['password_two']);
				layer.confirm('确认要修改密码？', {icon: 3, title:'提示'}, function(index){
					var subLoadIndex = layer.load(2);
					$.ajax({
						url: '/system/user/changepwd.action',
						type: "post",
						data: jsonData,
						success:function(res){
							layer.close(subLoadIndex);
							layer.msg(res.msg);
							if(res.code == 0) {
								layer.close(subIndex);
							}
						},
						error:function(e){
							layer.msg("错误！！");
							layer.close(subLoadIndex);
						}
					});
				});
			} else {
				layer.msg('新密码与确认密码必须相同！');
			}
			return false;
		});
		
		initTeam($("#curUserId").val());
		  
	});
	
	$("#searchBtn").click(function() {
		var name = $("#name").val();
		tableInfo.reload('userTab', {
		  where: { //设定异步数据接口的额外参数，任意设
			  name: name
		  }
		});
	});

	var isAdd = true;
	$("#addBtn").click(function() {
		isAdd = true;
		$("#password").closest(".layui-form-item").show();
		$("#teamIds").closest('.layui-form-item').show();
		$("#roleName").closest('.layui-form-item').show();
		open("用户新增", $("#operate"));
		setTimeout(function(){
	        $("#account").removeAttr("readonly");
	        $("#password").removeAttr("readonly");
	    }, 50);
		act = 0;
	});

	$(".cancel-btn").click(function () {
		layer.close(subIndex);
	});

    $("#reset1").click(function () {
		teamM.set([])

    });
    $("#roleReset").click(function () {
		$.fn.zTree.getZTreeObj("roleTree").checkAllNodes(false);
	});

    $("#roleName").click(function () {
		roleTree.checkAllNodes(false);
		roleTree.cancelSelectedNode();
		if($("#rId").val() && !isAdd) {
			var node = roleTree.getNodeByParam('id', $("#rId").val(), null);
			if(node) {
				node.checked = true;
				roleTree.updateNode(node);
			}
		}
		panelIndex = layer.open({
			title: '角色分配',
			type: 1,
			content: $("#roleSelectPanel"),
			area: ['500px']
		});
	});

	
});

function sub(act, data) {
	var url = "/system/user/";
	var msg = "";
    if(act == 0) {
        url += "inserts.action";
        data.password = encryption(data.password);
        msg = "确定新增吗?";
    } else if(act == 1 || act == 3) {
        url += "updates.action";
        msg = "确定修改吗?";
    }else if(act == 2) {
        url += "deletes.action";
        msg = "确定删除吗?";
    } else if(act == 4) {
    	url += 'changepwd.action';
    	msg = "确认要修改密码？";
    	data.password = encryption(data.password);
    	data['password_new'] = encryption(data['password_new']);
		data['password_two'] = encryption(data['password_two']);
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
	if(undefined == area) area = ['500px', '500px'];
	subIndex = layer.open({
		title: title,
		type: 1,
		 //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
		content: dom,
		area: area,
		end: function() {
			$("#form")[0].reset();
			$("#from1")[0].reset();
			unCheckNode();
			teamM.set();
		}
	});
}

function getRoleByUserId(userId) {
	var url = "/system/role/queries.action";
	var data = null;
	$.ajax({
        url: url,
        type: "post",
        async: false,
        data: {userId: userId},
        success:function(res){
        	data = res.data;
        },
        error:function(e){
            layer.msg("错误！！");
        }
    });  
	return data;
}

function unCheckNode() {
	var nodes = rzTreeObj.getCheckedNodes(true);
	for(var i = 0, leg = nodes.length; i < leg; i++) {
		rzTreeObj.checkNode(nodes[i], false, false, false);
	}
}

function initTeam(userId) {
	var url = "/business/team/queries.action";
	$.ajax({
        url: url,
        type: "post",
        async: false,
        data: {
        	dataReturnType: 1
        },
        success:function(res){
        	if(res.code == 0) {
        		var data = [];
        		for(let t of res.data) {
        			if(t.id != $("#curTeamId").val()){
        				data.push(t);
					}
				}
        		teamM = selectM({
        		      //元素容器【必填】
        		      elem: '#teamIds',
        		      //候选数据【必填】
        		      data: data,
        		      //默认值
        		      selected: [],			
        		      //最多选中个数，默认5
					  max : 1,
					  //input的name 不设置与选择器相同(去#.)
					  name: 'teamIds',
					  //值的分隔符
					  delimiter: ',',
					  //候选项数据的键名
					  field: {idName:'id',titleName:'name'}
        		});
        	}
        },
        error:function(e){
            layer.msg("错误！！");
        }
    });  
}




