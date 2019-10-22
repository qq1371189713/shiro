

function loadTreeData() {
	var data;
	$.ajax({
        url: "/system/menu/queries.action",
        type: "post",
        async: false,
        data: {
        	dataReturnType: 1,
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
function loadTeamTreeData() {
    var data;
    $.ajax({
        url: "/business/team/queries.action",
        type: "post",
        async: false,
        data: {
            dataReturnType: 1,
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

function loadRoleTreeData() {
	var data;
	$.ajax({
        url: "/system/role/queries.action",
        type: "post",
        async: false,
        data: {
        	dataReturnType: 1,
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

var zTreeObj;
var rzTreeObj;

function initTree(setting) {
	var zNodes = loadTreeData();
	zTreeObj = $.fn.zTree.init($("#menuTree"), setting, zNodes);
	zTreeObj.expandAll(true);
}
function initTeamTree(setting, id) {
    var zNodes = loadTeamTreeData();
    if($.fn.zTree.getZTreeObj(id)) $.fn.zTree.getZTreeObj(id).destroy();
    var tzTreeObj = $.fn.zTree.init($("#"+id), setting, zNodes);
    tzTreeObj.expandAll(true);
    return tzTreeObj;
}

function initRoleTree(setting, id) {
	var zNodes = loadRoleTreeData();
	var domId = id?id:'roleTree';
	rzTreeObj = $.fn.zTree.init($("#"+domId), setting, zNodes);
	rzTreeObj.expandAll(true);
	return rzTreeObj;
}

function checkTree(checked, ids) {
	var nodes = zTreeObj.transformToArray(zTreeObj.getNodes());
	for(var i = 0, leg = nodes.length; i < leg; i++) {
		if(checked) {
			for(var j = 0, leg1 = ids.length; j < leg1; j++) {
				if(nodes[i].id == ids[j]) {
					nodes[i].checked = true;
				}
			}
		} else {
			nodes[i].checked = false;
		}
		zTreeObj.updateNode(nodes[i]);
	}
}