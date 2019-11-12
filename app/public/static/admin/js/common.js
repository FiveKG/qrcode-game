layui.config({
	base: '/static/admin/js/module/'
}).extend({
	dialog: 'dialog',
});

layui.use(['form', 'jquery', 'laydate', 'layer', 'laypage', 'element', 'dialog'], function() {
	var form = layui.form,
		layer = layui.layer,
		table = layui.table,
		dialog = layui.dialog,
		$ = layui.jquery;

	const active = {
		//批量删除
		delBatch: function (ids, url) {

		},
		//删除
		del: function (id, url) {

		},
		//修改
		modify: function (params, url) {

		},
		//新增
		add: function (params, url) {

		}
	}

	//顶部左边批量删除
	$('.delBtn').click(function () {
		let url = $(this).attr('data-url');
		let tableId = $(this).attr('data-table-id');
		let data = (table.checkStatus(tableId)).data;
		if (data.length > 0) {
			let ids = [];
			$.each(data, function (i, tem) {
				ids.push(tem['user_id']);
			});
			dialog.confirm({
				message:'您确定要删除选中项',
				success:function(){
					active.delBatch(ids, url);
					layer.msg('删除了')
				},
				cancel:function(){
					layer.msg('取消了')
				}
			})
			return false;
		} else {
			layer.msg('没有选中行');
		}
	});
});