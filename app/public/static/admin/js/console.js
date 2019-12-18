"use strict";
layui.use(["okUtils", "table", "countUp", "okMock"], function () {
    var countUp = layui.countUp;
    var $ = layui.jquery;

    /**
     * 收入、商品、博客、用户
     */
    function get_index_sum(){
		return new Promise((resolve,reject)=>{
			$.ajax({
			url     : '/data/welcome_sum_view',
			type    : "GET",
			dataType: "json",
			success:function(result){
				resolve(result)
			},
			error:function(err){
				console.error(err)
				reject(err)
			}
		})
		})
    }

    
    function statText() {
        get_index_sum()
        .then(resolve=>{
            $(".verifying-num").text(resolve[0].verifying_sum);
            $(".user-num").text(resolve[0].count_sys_user);
            $(".agent-num").text(resolve[0].count_agent);  
            $(".shop-num").text(resolve[0].count_shop);  

            var elem_nums = $(".stat-text");
            elem_nums.each(function(i, j) {
                !new countUp({
                    target: j,
                }).start();
            });
        })
        
    }

    statText();
});


