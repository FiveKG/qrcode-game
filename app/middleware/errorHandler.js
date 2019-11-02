//@ts-check

module.exports = () => {
    return async function errorHandler(ctx, next) {
        try {
            await next();
        } catch (err) {
            ctx.status = status;
        }
    };
};