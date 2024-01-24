export default {
    jwt: {
        signKey: 'mysecritkey',
        // expiresIn: '3d',
        expiresIn: 1000 * 60 * 12, // 12min钟
        inject: {
            type: 'cookie',
            key: 'authorization'
        },
        reSign: {
            enable: true,
        },
        unVerifyUrls: ['/main/get-token']
    }
}