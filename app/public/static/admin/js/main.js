layui.use(['layer', 'form', 'element', 'jquery'], function() {
    var element = layui.element;
    var $ = layui.jquery;

    var active = {
        tabAdd: function (id, url, text) {
            element.tabAdd('main-tab', {
                title: text,
                content: '<iframe data-frameid="'+id+'" scrolling="auto" frameborder="0" src="'+url+'" width="100%" height="100%" name="iframe" class="iframe"></iframe>',
                id: id
            })
            active.tabChange(id,true);
        },
        tabChange: function (id, flag) {
            if (!flag) {
                let url = $(`[data-frameid='${id}']`).attr('src');
                $(`[data-frameid='${id}']`).attr('src', url);
            }
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