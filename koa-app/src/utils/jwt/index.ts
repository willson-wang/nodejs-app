import { JsonwebtokenJwt } from './jsonwebtokenJwt';

let jwtInstance;

export function useJwt(options) {
    return jwtInstance = new JsonwebtokenJwt(options)
}

export function useFastJwt() {

}

export function getJwtInstance() {
    if (!jwtInstance) {
        throw new Error('请先使用useJwt or useFastJwt初始化jwt实例')
    }
    return jwtInstance
}

export function injectToken(token, ctx) {
    const jwtInstance = getJwtInstance()
    if (!token) {
        throw new Error('token不能为空')
    }
    const { jwt: { inject } } = ctx.config

    const { type, key, ...rest} = inject

    switch (type) {
        case 'header':
            ctx.set(`Set-${key}`, token)
            break;
        case 'cookie':
            ctx.cookies.set(key, token, {...rest})
            break;
        default:
            console.log(`暂不支持${key}该种注入方式`);
            break;
    }
}