
type Lang = 'en' | 'ru' | 'es' | 'pt' | 'uk' | 'vi' | 'fr' | 'id' | 'ar' | 'ja' | 'tr' | 'de' | 'zh' | 'fil' | 'pl' | 'th' | 'it' | 'nl' | 'sk' | 'bg' | 'ro' | 'hu' | 'ko' | 'cs' | 'az' | 'fa' | 'bn' | 'el' | 'lt' | 'lv' | 'sv' | 'sr' | 'hr' | 'he' | 'hi' | 'nb' | 'sl' | 'da' | 'uz' | 'fi' | 'ca' | 'ka' | 'ms' | 'te' | 'et' | 'ml' | 'be' | 'kk' | 'mr' | 'ne' | 'my' | 'bs' | 'hy' | 'mk' | 'pa';
type ProxyType = 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';

interface BaseOptions {
    key: string //30 символов
    debug_dump?: boolean | 0 | 1
}

export interface RequestBaseOptionsIN extends BaseOptions {
    soft_id?: number
    pingback?: string
    json?: boolean | 0 | 1
    header_acao?: number
}


/**
 * https://rucaptcha.com/api-rucaptcha#solving_normal_captcha
 */
export interface RequestNormalCaptcha extends RequestBaseOptionsIN {
    method: 'post' | 'base64'
    phrase?: boolean | 0 | 1
    regsense?: boolean | 0 | 1
    numeric?: boolean | 0 | 1 | 2 | 3 | 4
    calc?: boolean | 0 | 1
    min_len?: number //1..20
    max_len?: number //1..20
    language?: boolean | 0 | 1 | 2
    lang?: Lang
    textinstructions?: string // ..140
    imginstructions?: string
    body?: string // в доке он явно не указан но это картинка при method in bas64
}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_text_captcha
 */
export interface RequestTextCaptcha extends RequestBaseOptionsIN {
    language?: boolean | 0 | 1 | 2
    lang?: Lang
    textcaptcha: string
}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_recaptchav2_new
 */
export interface RequestReCaptchaV2 extends RequestBaseOptionsIN {
    method: 'userrecaptcha'
    googlekey: string
    pageurl: string
    invisible?: number
    proxy?: string
    proxytype?: ProxyType

}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_recaptchav3
 */
export interface RequestReCaptchaV3 extends RequestBaseOptionsIN {
    method?: 'userrecaptcha'
    version?: 'v3'
    googlekey?: string
    pageurl?: string
    action: string
    min_score: number
    proxy?: string
    proxytype?: ProxyType
}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_clickcaptcha
 */
export interface RequestClickCaptcha extends RequestBaseOptionsIN {
    method: 'post' | 'base64'
    coordinatescaptcha: 1
    textinstructions: string
    imginstructions?: string
    language?: boolean | 0 | 1 | 2
    lang?: Lang
}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_rotatecaptcha
 */
export interface RequestRotateCaptcha extends RequestBaseOptionsIN {
    method: 'rotatecaptcha'
    angle?: number
    [key: string]: any //file_n
}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_funcaptcha_new
 */
export interface RequestFunCaptcha extends RequestBaseOptionsIN {
    method: 'funcaptcha'
    publickey: string
    surl?: string
    pageurl: string
    nojs?: number
    userAgent?: string
    proxy?: string
    proxytype?: ProxyType
}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_keycaptcha
 */
export interface RequestKeyCaptcha extends RequestBaseOptionsIN {
    method: 'keycaptcha'
    s_s_c_user_id: string
    s_s_c_session_id: string
    s_s_c_web_server_sign: string
    s_s_c_web_server_sign2: string
    pageurl: string
}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_geetest
 */
export interface RequestGeeTest extends RequestBaseOptionsIN {
    method: 'geetest'
    gt: string
    challenge: string
    api_server?: string
    pageurl: string
}

/**
 * https://rucaptcha.com/api-rucaptcha#solving_hcaptcha
 */
export interface RequesthCaptcha extends RequestBaseOptionsIN {
    method: 'hcaptcha'
    sitekey: string
    pageurl: string
    proxy?: string
    proxytype?: ProxyType
}

/**
 * ответ сервера
 * универсальная форма в неё ложатся все запросы
 */
export interface Response {
    status: number //1 все ок, 0 ошибка
    request: string
}

/**
 * запрос на получение разгадонной капчи 
 * одиинаков для всех типов каптч
 */
export interface RequestRes extends BaseOptions {
    action: 'get' | 'get2' | 'getbalance'
    id?: string
    json?: boolean | 0 | 1
    ids?: string
    header_acao?: boolean | 0 | 1
}




