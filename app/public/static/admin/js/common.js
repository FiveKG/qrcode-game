layui.use(['form', 'jquery', 'laydate', 'layer', 'laypage', 'element'], function() {
	var form = layui.form,
		layer = layui.layer,
		table = layui.table;
		$ = layui.jquery;

	const active = {

	}

	//顶部添加
	$('.delBtn').click(function () {
		let url = $(this).attr('data-url');
		let tableId = $(this).attr('data-table-id');
		let data = (table.checkStatus(tableId)).data;
		if (data.length > 0) {
			let ids = [];
			$.each(data, function (i, tem) {
				ids.push(tem['user_id']);
			});
			console.log(ids);
		} else {
			layer.msg('没有选中行');
		}
	});
});