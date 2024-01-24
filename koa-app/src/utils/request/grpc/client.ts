import path from 'path'
import { credentials, Client, Metadata } from "@grpc/grpc-js";
import type { ClientWritableStream } from "@grpc/grpc-js"

interface GrpcOptions {
    deadline: number;
    timeoutExitCount: number;
    clientOptions: {
        [key: string]: any
    } | ((opts) => Record<string, any>);
    reStartCount: number | undefined
}

export class BaseGrpcClient {
    deadline: number;
    client: Client;
    grpcOptions: GrpcOptions;
    requestCount: number = 0;
    ClientClass: any;
    reStarting: boolean;
    clientId: number;
    customTimeoutCount: number = 0;
    call: ClientWritableStream<any>;
    promise: Promise<any>
    logger: Console

    getGrpcOptions() {
        this.grpcOptions = require(path.join(process.cwd(), 'grpc-client-config.js'))
    }

    checkStarting(resolve) {
        let timer;
        const fn = () => {
            if (!this.reStarting) {
                clearTimeout(timer)
                resolve(1)
            } else {
                timer = setTimeout(fn, 200)
            }
        }

        timer = setTimeout(fn, 200)
    }

    reStartClient() {
        const { reStartCount } = this.grpcOptions
        if (reStartCount && this.requestCount >= reStartCount) {
            return new Promise((resolve, reject) => {
                try {
                    if (!this.reStarting) {
                        this.reStarting = true;
                        const newClient = this.getGrpcClient() as Client;
                        newClient.waitForReady(this.deadline || this.grpcOptions.deadline, (err) => {
                            if (err) {
                                this.reStarting = false;
                                reject(err)
                            } else {
                                this.client.close();
                                // 新的client成功，然后才赋值，让后面的rpc请求使用新的client
                                this.requestCount = 0;
                                this.client = newClient;
                                this.reStarting = false;
                                resolve(1)
                            }
                        })
                    } else {
                        this.checkStarting(resolve)
                    }
                } catch (error) {
                    reject(error)
                }
            })
        }
    }

    getClientOptions() {
        const defaultOptions = {
            'grpc.ssl_target_name_override': 'serverName',
            'grpc.use_local_subchannel_pool': 1
        };

        const { clientOptions } = this.grpcOptions

        let options;
        if (typeof clientOptions === 'function') {
            options = clientOptions(defaultOptions);
        } else {
            options = Object.assign(defaultOptions, clientOptions);
        }

        return options
    }

    getGrpcClient() {
        const options = this.getClientOptions();
        const client = new this.ClientClass(
            "localhost:50051",
            credentials.createInsecure(),
            options
        );
        this.clientId += 1;
        return client;
    }

    init(Client) {
        this.getGrpcOptions()

        this.ClientClass = Client;

        this.client = this.getGrpcClient()
    }

    clientWaitForReady() {
        return new Promise((resolve, reject) => {
            this.client.waitForReady(Date.now() + (this.deadline || this.grpcOptions.deadline), (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(1)
                }

            });
        })
    }

    raceRequest(opts) {
        return Promise.race([this._request(opts), this.raceTimeout()])
    }

    raceTimeout() {
        return new Promise((_resolve, reject) => {
            const { timeoutExitCount } = this.grpcOptions
            if (this.customTimeoutCount >= timeoutExitCount) {
                console.error(`rpc触发自定义超时超过${timeoutExitCount},说明当前rpc client无法正常请求，关闭服务进程，以待重启`)
                process.exit(1)
            }
            setTimeout(() => {
                this.customTimeoutCount += 1;
                reject('rpc触发自定义超时');
            }, (this.deadline || this.grpcOptions.deadline) + 5000)
        })
    }

    handleMetadata(metadata) {
        return metadata || new Metadata()
    }

    handleOptions(options) {
        return options || {}
    }

    handleSucc<TResp>({ action }) {
        return (result): { response: TResp, metadata: Metadata } => {
            // 打印日志
            // 上报统计数据
            console.log({
                act: 'grpc end',
                url: `${action}`,
            })
            return result;
        }
    }

    handleError({ action }) {
        return (error) => {
            // 打印日志
            // 上报统计数据
            console.error({
                act: 'grpc error',
                url: `${action}`,
            })
            throw error
        }
    }

    requestBefore(opts) {
        const {
            action,
            payload,
            metadata,
            options
        } = opts
        return new Promise((resolve, reject) => {
            // 打印日志
            // 添加trace-id，metadata中添加一些公共属性
            console.log({
                act: 'grpc begin',
                url: `${action}`,
                payload,
                metadata
            })
            try {
                const newMetadata = this.handleMetadata(metadata);
                const newOptions = this.handleOptions(options);
                resolve({
                    ...opts,
                    metadata: newMetadata,
                    options: newOptions
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    _request({
        action,
        payload,
        options,
        metadata
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.reStartClient()
                await this.clientWaitForReady()
                this.requestCount += 1
                this.call = this.client[action](payload, metadata, options, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({
                            response: result,
                            metadata
                        })
                    }
                })
            } catch (error) {
                // 捕获grpc的同步错误
                reject(error)
            }
        })
    }

    request<TResp>(opts): Promise<{ response: TResp, metadata: Metadata }> {
        return this.requestBefore(opts)
            .then((args) => this.raceRequest(args))
            .then(this.handleSucc<TResp>(opts))
            .catch(this.handleError(opts))
    }

    requestStream<TResp>({action, metadata, options}) {
        let _resolve;
        let _reject;
        console.log({
            act: 'grpc begin',
            url: `${action}`,
            metadata
        })
        const call = this.client[action](this.handleMetadata(metadata), this.handleOptions(options), (err, response) => {
            if (err) {
                _reject(this.handleError({action})(err))
            } else {
                _resolve(this.handleSucc<TResp>({action})({response, metadata}))
            }
        });
        // callback: (error: grpc.ServiceError | null, response: route_guide_pb.RouteSummary) => void
        call.callback = new Promise<TResp>((resolve, reject) => {
            _resolve = resolve;
            _reject = reject;
        });
        return call
    }

    responseStream<TResp>({action, payload, metadata, options}):Promise<{ response: TResp, metadata: Metadata }> {
        return new Promise((resolve, reject) => {
            console.log({
                act: 'grpc begin',
                url: `${action}`,
                payload: `${payload}`,
                metadata
            })
            const result = [] as Buffer[];
            const call = this.client[action](payload, this.handleMetadata(metadata), this.handleOptions(options));

            call.on('error', (error) => {
                this.handleError({action})(error)
                reject(error)
            })

            call.on('data', (data) => {
                result.push(data)
            })

            call.on('end', () => {
                resolve(this.handleSucc<TResp>({action})({
                    response: result,
                    metadata
                }))
            })
        })
    }

    bidirectionalStream<TResp>({action, metadata, options}) {

        let _resolve;
        let _reject;
        let result = [];
        console.log({
            act: 'grpc begin',
            url: `${action}`,
            metadata
        });

        const call = this.client[action](this.handleMetadata(metadata), this.handleOptions(options));

        call.callback = new Promise<TResp>((resolve, reject) => {
            _resolve = resolve;
            _reject = reject;
        });

        call.on('error', (error) => {
            this.handleError({action})(error)
            _reject(error)
        })

        call.on('data', (data) => {
            result.push(data)
        })

        call.on('end', () => {
            _resolve(this.handleSucc<TResp>({action})({
                response: result,
                metadata
            }))
        })
        return call
    }
}        