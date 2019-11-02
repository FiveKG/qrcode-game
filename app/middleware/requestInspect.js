//@ts-check
'use strict'

module.exports = options => {
    return async function requestInspect(ctx, next) {
        let uri = await ctx.helper.getUri();
        ctx.logger.debug('uri: ', uri);
        if ('/api/common/generate_key' === uri) {
            await next();
            return;
        }

        let token = ctx.header.token;
        if (!token) {
            ctx.status = 403;
            ctx.body = await ctx.helper.renderError(403, 'token invalid', '');
            return;
        }
        try {
            let user = await ctx.helper.decodeToken(token);
            ctx.logger.debug('user: ', user);
            if (!user['is_enable']) {
                ctx.body = await ctx.helper.renderError(500001, '用户状态不可用', '');
                return;
            }
            if ('admin' != user['user_type']) {
                ctx.body = await ctx.helper.renderError(500002, '权限不足', '');
                return;
            }
            await next();
            return;
        } catch (e) {
            ctx.status = 403;
            ctx.body = await ctx.helper.renderError(403, 'token invalid', '');
        }
    }
}