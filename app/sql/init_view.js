//@ts-check
var pg = require('pg');
// 数据库配置
var config = { 
    user:"DB_USER",
    database:"DB_USER_db",
    password:"DB_PWD",
    host:'DB_HOST',
    port:12432,
    
    // 扩展属性
    max:20, // 连接池最大连接数
    idleTimeoutMillis:3000, // 连接最大空闲时间 3s
   }
const pool = new pg.Pool(config);

function create_view(){
    const task = [];
    const shop_view = `
    CREATE VIEW shop_view AS
    SELECT 
      shop.shop_id,
        shop.name,
        shop.p_c_a_id,
        shop.p_c_a_text,
        shop.local_address,
        shop.shop_manager,
        shop.mobile,
        shop.group_id,
        shop.license,
        shop.longitude,
        shop.latitude,
        shop.add_user_id,
        shop.add_time,
        shop.is_enable,
        sys_user.user_name as add_user_name,
        shop_group.group_name
        FROM
     ("public".shop as shop inner join "public".sys_user as sys_user on sys_user.user_id = shop.add_user_id)
    left join "public".shop_group as shop_group on shop_group.group_id=shop.group_id;  
    `
    task.push(pool.query(shop_view))

    const agent_staff_view=`
    CREATE VIEW agent_staff_view  AS
    SELECT
        agent_staff.agent_staff_id,
        agent_staff.user_id,
        agent_staff.agent_id,
        agent_staff.agent_staff_type,
        agent_staff.can_withdraw,
        agent_staff.is_enable,
        agent_staff.add_user_id,
        agent_staff.add_time,
        add_user.user_name as add_user_name,
        agent_user.user_name as user_name,
        agent.name as agent_name
        
     FROM 
     ((public."agent_staff" as agent_staff inner join public."sys_user" as agent_user on  agent_staff.user_id=agent_user.user_id)
     inner join "public".agent as agent on agent_staff.agent_id = agent.agent_id)
     left join "public".sys_user as add_user on  agent_staff.add_user_id=add_user.user_id;
    `
    task.push(pool.query(agent_staff_view))

    const qrcode_view = `
    CREATE VIEW qrcode_view AS 
    SELECT
       qrcode.qrcode_id,
       qrcode.scan_action,
       qrcode.download_url,
       qrcode.agent_id,
       qrcode.shop_id,
       qrcode.group_id,
       qrcode.hash_str,
       qrcode.seq,
       qrcode.is_enable,
       qrcode.add_time,
       qrcode.add_user_id,
       sys_user.user_name as add_user_name,
       agent.name as agent_name,
       shop.name as shop_name,
       shop_group.group_name as group_name
   FROM
   ((("public".qrcode as qrcode left join "public".sys_user as sys_user on  qrcode.add_user_id=sys_user.user_id)
   inner join "public".agent as agent on qrcode.agent_id = agent.agent_id AND agent.is_enable=true )
   inner join "public".shop as shop on qrcode.shop_id = shop.shop_id AND shop.is_enable=true)
   left join "public".shop_group as shop_group on qrcode.group_id = shop_group.group_id AND shop_group.is_enable=true;
   
    `
    task.push(pool.query(qrcode_view))


    const coupon_view=`
    CREATE VIEW coupon_view AS 
    SELECT 
        coupon.coupon_id,
        coupon.coupon_name,
        coupon.coupon_remark,
        coupon.logo,
        coupon.coupon_type,
        coupon.shop_id,
        coupon.group_id,
        coupon.validity_period,
        coupon.amount,
        coupon.add_user_id,
        coupon.add_time,
        coupon.is_enable,
           sys_user.user_name as add_user_name,
           shop.name as shop_name,
           shop_group.group_name as group_name
    FROM
    (("public".coupon as coupon left join "public".sys_user as sys_user on  coupon.add_user_id=sys_user.user_id)
    left join "public".shop as shop on coupon.shop_id=shop.shop_id AND shop.is_enable=true )
    left join "public".shop_group as shop_group on coupon.group_id=shop_group.group_id AND shop_group.is_enable=true;
    `
    task.push(pool.query(coupon_view))

    const game_coupon_rule_view = `
    CREATE VIEW game_coupon_rule_view AS 
    SELECT 
        game_coupon_rule.id,
        game_coupon_rule.rule_name,
        game_coupon_rule.game_id,
        game_coupon_rule.coupon_id,
        game_coupon_rule.score,
        game_coupon_rule.play_count_range,
        game_coupon_rule.add_user_id,
        game_coupon_rule.add_time,
        game_coupon_rule.is_enable,
        sys_user.user_name as add_user_name,
        game.game_name,
        coupon.coupon_name
    FROM
    (("public".game_coupon_rule as game_coupon_rule left join "public".sys_user as sys_user on  game_coupon_rule.add_user_id=sys_user.user_id)
    inner join "public".game as game on  game_coupon_rule.game_id=game.game_id AND game.is_enable=true)
    inner join "public".coupon as coupon on game_coupon_rule.coupon_id = coupon.coupon_id AND coupon.is_enable=true;
    `
    task.push(pool.query(game_coupon_rule_view))

    const shop_staff_view =`
    CREATE VIEW shop_staff_view AS
    SELECT 
        shop_staff.shop_staff_id,
        shop_staff.staff_name,
        shop_staff.user_id,
        shop_staff.shop_id,
        shop_staff.shop_staff_type,
        shop_staff.is_enable,
        shop_staff.add_time,
        shop_staff.add_user_id,
        shop.name as shop_name,
        sys_user.user_name as add_user_name
        --sys_user.user_name as add_user_name
    FROM
    ("public".shop_staff as shop_staff inner join "public".shop as shop on  shop_staff.shop_id=shop.shop_id AND shop.is_enable = true)
    left join "public".sys_user as sys_user on shop_staff.add_user_id = sys_user.user_id;    
    `
    task.push(pool.query(shop_staff_view))

    const welcome_sum_view =`
    CREATE VIEW welcome_sum_view AS
    SELECT
        sum(verifying_record.amount) as verifying_sum,
        count(sys_user.user_id) as count_sys_user,
        count(shop.shop_id) as count_shop,
        count(agent.agent_id) as count_agent
    FROM
    (("public".verifying_record as verifying_record FULL JOIN "public".sys_user as sys_user on verifying_record.id=sys_user.user_id)
    full join "public".shop as shop on verifying_record.id = shop.shop_id)
    full join "public".agent as agent on verifying_record.id = agent.agent_id;
    `
    task.push(pool.query(welcome_sum_view))

    Promise.all(task)
    .then((rows)=>{
        console.log(...rows)
    })
    .catch(err=>{
        console.log(err)
    })
}

create_view();