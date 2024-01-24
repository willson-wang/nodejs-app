import { BaseJwt } from './baseJwt'

export class JsonwebtokenJwt extends BaseJwt {
    constructor(options) {
        super()
        this.options = options
        this.init()
    }

    init() {
        this.jwt = this.getInstance()
    }

    getInstance() {
        return require('jsonwebtoken')
    }

    sign(payload: Record<string, any>) {
        return new Promise((resolve, reject) => {
            const { signKey, expiresIn } = this.options;
            if (!payload) {
                return reject(new Error('payload 不能为空'))
            }
            if (!signKey) {
                return reject(new Error('signKey 不能为空'))
            }
            this.jwt.sign(payload, signKey, { expiresIn }, function (err, token) {
                if (err) {
                    reject(err)
                } else {
                    resolve(token)
                }
            })
        })
    }

    verify(token: string) {
        const { signKey } = this.options
        return new Promise((resolve, reject) => {
            if (!token) {
                return reject(new Error('token 不能为空'))
            }
            if (!signKey) {
                return reject(new Error('signKey 不能为空'))
            }
            this.jwt.verify(token, signKey, function (err, decoded) {
                if (err) {
                    reject(err)
                } else {
                    resolve(decoded)
                }
            })
        })
    }


    decode(token: string) {
        const { signKey } = this.options
        if (!token) {
            return new Error('token 不能为空')
        }
        if (!signKey) {
            return new Error('signKey 不能为空')
        }
        return this.jwt.decode(token, signKey)
    }

    reSign(decoded: Record<string, any>) {
        // reSignTime 离过期还有多久的时候，需要续签jwt，时间也是s
        const { reSign: { enable = true, deadline = 60 * 10 } } = this.options
        if (!enable) {
            return false
        }
        const { iat, exp, ...payload } = decoded
        const remainExpireTime = exp - iat; // 离过期还有多少s
        // 当过期时间小于等于beforeDeadline规定的时间，则进行续签
        if (remainExpireTime <= +deadline) {
           return true
        }
        return false
    }
}