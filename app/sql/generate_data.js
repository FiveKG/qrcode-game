//@ts-check
var pg = require('pg');
// 数据库配置
var config = { 
    user:"qrcode_game",
    database:"qrcode_game_db",
    password:"pass_2019",
    host:'121.9.227.91',
    port:12432,
    
    // 扩展属性
    max:20, // 连接池最大连接数
    idleTimeoutMillis:3000, // 连接最大空闲时间 3s
   }
const pool = new pg.Pool(config);
const sql_amount = {    
    game:6,
    shop_group:6,
    agent:6,
    shop:6,
    agent_staff:6,
    qrcode:6,
    coupon:6,
    game_coupon_rule:6,
    shop_staff:6,
    user_recharge:6,
    pay_order:6,
    balance_log:6,

}

/**
 * 用户表
 */
function sys_user(){
    const task = [];
    let insert_sys_user1= `
        INSERT INTO public."sys_user"
        ("user_id"
        ,"user_name"
        ,"user_pwd"
        ,"user_type"
        ,"phone_num")
        VALUES
        ('user_id1'
        ,'admin1'
        ,'$argon2id$v=19$t=3,m=4096,p=1$VLQboM9o8eL1EZsijr0Dtg$JGitsHPT4bKJQj6HTjVwqsOlYHQDy6RLnvH936VyLgE'
        ,'admin'
        ,'18814140170')
    `
    let insert_sys_user2= `
        INSERT INTO public."sys_user"
        ("user_id"
        ,"user_name"
        ,"user_pwd"
        ,"user_type"
        ,"phone_num")
        VALUES
        ('user_id2'
        ,'admin2'
        ,'$argon2id$v=19$t=3,m=4096,p=1$TogJgTdm5+LY4QT2BS5mJA$N/QgJ9BOCY5IPK8tZ/v0awyKbkWOmCnJOvK1PBcG7ps'
        ,'admin'
        ,'18814140170')
    `

    let insert_sys_user3= `
        INSERT INTO public."sys_user"
        ("user_id"
        ,"user_name"
        ,"user_pwd"
        ,"user_type"
        ,"phone_num")
        VALUES
        ('user_id3'
        ,'admin3'
        ,'$argon2id$v=19$t=3,m=4096,p=1$P2YoJrB5gl2gqHrhU0CKWQ$JU4v+noIKiUap29bbfXIqygknVlI0XId/Ub9Daod268'
        ,'admin'
        ,'18814140170')
        `
        task.push(pool.query(insert_sys_user1))
        task.push(pool.query(insert_sys_user2))
        task.push(pool.query(insert_sys_user3))
    
        Promise.all(task)
        .then((rows)=>{
            console.log(...rows)
        })
        .catch(err=>{
            console.log(err)
        })
}

/**
 * 游戏表
 */
function game(){
        const task = []
        for(let i=1;i<sql_amount.game;i++){
            let insert_game_sql = `
            INSERT INTO public."game"
            ("game_id"
            ,"game_name"
            ,"game_img"
            ,"game_img_small"
            ,"price"
            ,"game_url"
            ,"game_type"
            ,"game_desc"
            ,"add_user_id")
            VALUES
            ('game_id${i}'
            ,'game_name${i}'
            ,'game_img${i}'
            ,'game_img_small${i}'
            ,${i}
            ,'game_url${i}'
            ,1
            ,'game_desc${i}'
            ,'user_id1')
            `
            task.push(pool.query(insert_game_sql))
        }
        Promise.all(task)
        .then((rows)=>{
            console.log(...rows)
        })
        .catch(err=>{
            console.log(err)
        })
}

/**
 * 品牌表
 */
function shop_group(){
    const task = []
    for(let i=1;i<sql_amount.shop_group;i++){
        let insert_shop_group_sql = `
        INSERT INTO public."shop_group"
        ("group_id"
        ,"group_name"
        ,"parent_id"
        ,"add_user_id")
        VALUES
        ('group_id${i}'
        ,'group_name${i}'
        ,''
        ,'user_id1')
        `
        task.push(pool.query(insert_shop_group_sql))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

function agent(){
    const  task=[]
    for(let i =1;i<sql_amount.agent;i++){
        let insert_agent_sql = `
        INSERT INTO public."agent"
            ("agent_id"
            ,"name"
            ,"license"
            ,"p_c_a_id"
            ,"p_c_a_text"
            ,"local_address"
            ,"is_enable"
            ,"add_user_id"
            ,"gain_rate"
            ,"balance")
        VALUES
            ('agent_id${i}'
            ,'name${i}'
            ,'license${i}'
            ,'{"11","1101","110102"}'
            ,'{"北京市","市辖区","西城区"}'
            ,'local_address${i}'
            ,true
            ,'user_id1'
            ,'50'
            ,0)
        `
        task.push(pool.query(insert_agent_sql))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

function shop(){
    const task= []
    for(let i=1;i<sql_amount.shop;i++){
        const insert_shop_sql = `
        INSERT INTO public."shop"
		("shop_id"
		,"name"
		,"p_c_a_id"
		,"p_c_a_text"
		,"local_address"
		,"shop_manager"
		,"mobile"
		,"group_id"
		,"license"
		,"longitude"
		,"latitude"
		,"add_user_id")
	VALUES
		('shop_id${i}'
		,'name${i}'
		,'{"11","1101","110102"}'
		,'{"北京市","市辖区","西城区"}'
		,'local_address${i}'
		,'shop_manager${i}'
		,'18814140170'
		,'group_id${i}'
		,'license${i}'
		,'15'
		,'15'
		,'user_id${i}')
        `
        task.push(pool.query(insert_shop_sql))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
    
}

function agent_staff(){
    const task = []
    for(let i =1;i<sql_amount.agent_staff;i++){
        const insert_agent_staff = `
        INSERT INTO public."agent_staff"
		("agent_staff_id"
		,"user_id"
		,"agent_id"
		,"agent_staff_type"
		,"can_withdraw"
		,"is_enable"
		,"add_user_id")
	VALUES
		('agent_staff_id${i}'
		,'user_id${i}'
		,'agent_id${i}'
		,10
		,true
		,true
		,'user_id1')
        `   
        task.push(pool.query(insert_agent_staff))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

function qrcode(){
    const task = []
    for(let i=1;i<sql_amount.qrcode;i++){
        const insert_qrcode_sql = `
        INSERT INTO public."qrcode"
		("qrcode_id"
		,"scan_action"
		,"download_url"
		,"agent_id"
		,"shop_id"
		,"group_id"
		,"hash_str"
		,"add_user_id"
		,"seq")
	VALUES
		('qrcode_id${i}'
		,'{"redirct":"nothing"}'
		,'download_url${i}'
		,'agent_id${i}'
		,'shop_id${i}'
		,'group_id${i}'
		,'hash_str${i}'
		,'user_id1'
		,1)
        `
        task.push(pool.query(insert_qrcode_sql))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

function coupon(){
    const task = []
    for(let i=1;i<sql_amount.coupon;i++){
        const insert_coupon_sql = `
        INSERT INTO public."coupon"
		("coupon_id"
		,"coupon_name"
		,"coupon_remark"
		,"logo"
		,"coupon_type"
		,"amount"
		,"add_user_id"
		)
        VALUES
        ('coupon_id${i}'
        ,'coupon_name${i}'
        ,'coupon_remark${i}'
        ,'logo${i}'
        ,10
        ,10
        ,'user_id1'
        )
        `
        task.push(pool.query(insert_coupon_sql))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

function game_coupon_rule(){
    const task = []
    for(let i=1;i<sql_amount.game_coupon_rule;i++){
        let insert_game_coupon_rule=`
        INSERT INTO public."game_coupon_rule"
		("id"
		,"game_id"
		,"coupon_id"
		,"score"
		,"play_count_range"
		,"add_user_id")
	    VALUES
		('id${i}'
		,'game_id${i}'
		,'coupon_id${i}'
		,27
		,'[1,10]'
		,'user_id1')
        `
        task.push(pool.query(insert_game_coupon_rule))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

function shop_staff(){
    const task = []
    for(let i=1;i<sql_amount.shop_staff;i++){
        let insert_shop_staff_sql = `
        INSERT INTO public."shop_staff"
		("shop_staff_id"
		,"staff_name"
		,"user_id"
		,"shop_staff_type"
		,"is_enable"
		,"add_user_id"
		,"shop_id")
	VALUES
		('shop_staff_id${i}'
		,'staff_name${i}'
		,'user_id${i}'
		,20
		,true
		,'user_id1'
		,'shop_id${i}')
        `
        task.push(pool.query(insert_shop_staff_sql))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

function user_recharge(){
    const task = []
    for(let i=1;i<sql_amount.user_recharge;i++){
        let insert_user_recharge_sql = `
        INSERT INTO public."user_recharge"
		("recharge_id"
		,"user_id"
		,"recharge_amount")
	VALUES
		('recharge_id${i}'
		,'user_id${i}'
		,1)
        `
        task.push(pool.query(insert_user_recharge_sql))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

function pay_order(){
    const task = []
    for(let i=1;i<sql_amount.pay_order;i++){
        let insert_pay_order_sql1 = `
        INSERT INTO public."pay_order"
		("pay_order_id"
		,"wx_open_id"
		,"pay_type"
		,"source_id"
		,"pay_state"
		,"pay_way"
		,"pay_way_order_id"
		,"amount")
	VALUES
		('pay_order_id${i}'
		,'wx_open_id${i}'
		,'10'
		,'source_id${i}'
		,'10'
		,'10'
		,'pay_way_order_id${i}'
		,'10')
        `
        task.push(pool.query(insert_pay_order_sql1))
    }
    for(let i=1;i<sql_amount.pay_order;i++){
        let insert_pay_order_sql2 = `
        INSERT INTO public."pay_order"
		("pay_order_id"
		,"wx_open_id"
		,"pay_type"
		,"source_id"
		,"pay_state"
		,"pay_way"
		,"pay_way_order_id"
		,"amount")
	VALUES
		('pay_order_id${i}'
		,'wx_open_id${i}'
		,'20'
		,'source_id${i}'
		,'20'
		,'20'
		,'pay_way_order_id${i}'
		,'20')
        `
        task.push(pool.query(insert_pay_order_sql2))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })

}

function balance_log(){
    const task = []
    for(let i=1;i<sql_amount.balance_log;i++){
        let insert_balance_log_sql = `
        INSERT INTO public."balance_log"
		("id"
		,"user_id"
		,"before"
		,"after"
		,"change_reason"
		,"remark"
		,"add_time")
	VALUES
		('id${i}'
		,'user_id${i}'
		,'0'
		,'10'
		,'1'
		,'remark${i}')
        `
        task.push(pool.query(insert_balance_log_sql))
    }
    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}
function main(){
    // sys_user();
    // game();
    // shop_group();
    // agent();
    // shop();
    agent_staff();
    // qrcode();
    // coupon();
    // game_coupon_rule();
    // shop_staff();
    // user_recharge();
    // pay_order();
    // balance_log();
}

main()