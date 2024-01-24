interface JwtOptions {
    signKey: string | Buffer | Object, 
    expiresIn: number | string,
    reSign: {
        enable: boolean, 
        deadline: number | string
    }
}

class Jwt {
    sign(...any) {}
    verify(...any) {}
    decode(...any) {}
}

export abstract class BaseJwt {
    options: JwtOptions;
    jwt: Jwt;

    abstract sign(payload: Record<string, any>): Promise<any>

    abstract verify(token: string): Promise<Record<string, any> | Error>

    abstract decode(token: string): any

    abstract reSign(decoded: Record<string, any>): boolean

    abstract getInstance(): BaseJwt

    abstract init(): void
}