$(function(){
    layui.laydate.render({
        elem: '#timeSelect',
        type: 'datetime',
        range: '到',
        format: 'yyyy年M月d日H时m分s秒'
    });
});