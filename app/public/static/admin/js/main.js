layui.use(['layer', 'form', 'element', 'jquery'], function() {
    var element = layui.element;
    var $ = layui.jquery;

    var active = {
        tabAdd: function (id, url, text) {
            element.tabAdd('main-tab', {
                title: text,
                content: '<iframe data-frameid="'+id+'" scrolling="auto" frameborder="0" src="'+url+'.html" style="width:100%;"></iframe>',
                id: id
            })
            active.tabChange(id);
        },
        tabChange: function (id) {
            element.tabChange('main-tab', id);
        },
        tabDelete: function (id) {

        },
        tabDeleteAll: function (ids) {
            $.each(ids, function (i,item) {//main-tab

            })
        }
    }

    // 监听导航点击
    element.on('nav(main-menu)', function(elem){
        let id = elem.attr('data-id');
        let url = elem.attr('data-url');
        let text = elem.attr('data-text');
        if (!url) {
            return;
        }
        let isActive = $('.main-layout-tab .layui-tab-title').find("li[lay-id=" + id + "]");
        if (isActive.length > 0) {
            active.tabChange(id);
        } else {
            active.tabAdd(id, url, text);
        }
    });
});