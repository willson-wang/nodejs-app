
export interface MetaData {
  'orgcode'?: string;
  'appid'?: string;
  'trace-id'?: string;
  [propname: string]: any;
}


export interface AnyOptions {
  [propsname: string]: any;
}


export interface RpcServiceResponse {
  error?: any;
  response: AnyOptions;
  error_details?: string;
  metadata?: MetaData;
}

export enum AuthenticationMethod {
  /** 未使用 */
  NotUsed = 0,
  /** 短信登录 */
  SMSLogin = 1,
  /** 账号登录 */
  AccountLogin = 2,
  /** 微信登录 */
  WeChatScanCodeLogin = 3,
  /** 企微登录 */
  WeComLogin = 4,
  /** 微信公众号授权登录 */
  WeChatOfficialAccountsLogin = 6,
  /** 微信小程序授权登录 */
  WeChatMiniProgramLogin = 7,
  /** 企业微信扫码授权登录 */
  WeComScanCodeLogin = 8,
  /** 钉钉登录 */
  DingDingLogin = 9,
  /** 天迹idaas */
  TianJiIDAAS = 51,
  /** 凯德 SAML */
  KAI_DE_SAML = 52,
  /** 荣盛 私有 */
  RONG_SHENG_PRIVATE = 53,
  /** 超级工作台 */
  SuperWorkTable = 54,
  /** 建业 */
  JianYeLogin = 55,
  /** 云链客服 */
  YunLian = 56,
}

export enum timeTypeEnum {
  TIME_TODAY = 'today',
  TIME_YESTERDAY = 'yesterday',
  TIME_7D = '7d',
  TIME_30D = '30d',
  TIME_ALL = 'all',
}

export type Page = 'big' | 'small' | 'middle'
export enum Page2 {
  'big' = 'big',
  'small' = 'small',
  'middle' = 'middle'
}


export interface dateSource {
  id?: string;
  name?: string;
  code?: number;
  app_id?: string
}

export type newTimeTypeEnum = timeTypeEnum

export interface QP {
  id: string;
  name: string;
  code: number;
  app_id: string
}