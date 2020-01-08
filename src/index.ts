import axios from 'axios';
import * as fs from 'fs';
import { CfgError, ListApiErrors, NetworkError } from './types/Error';
import { RequestNormalCaptcha, RequestRes, Response } from './types';
import ChunkRepetition from './helpers/ChunkRepetition';

export interface Cfg {
    key: string //ключ доступа к api
    sleepTimeRes?: number //задержка между запросами на разрешенную капчу
    debug?: boolean //отладка, ошибки будут дополнены параметрами запроса(options)
    callbackNullBalance?: () => any //callback при пустом балансе, внимание если есть callback ошибка проглатывается и резолверы вернут null!! 
}

/**
 * тип источника картинки
 * описывает все возможные методы получения картинки
 * должен быть описан хотя бы 1 вид источника
 */
type sourceImg = {
    url?: string, //загрузить картинку по url
    path?: string, //загрузить с диска по адресу path
    base64?: string //просто картинка в base64
}

export default class Rucaptcha {
    private cfg: Cfg;

    constructor(cfg: Cfg) {
        if (cfg.key.length < 32) throw new CfgError(`Invalid key shape`);
        // BaseCfg
        this.cfg = {
            sleepTimeRes: 5000,
            ...cfg
        }
    }

    /**
     * задержка
     * @param ms - время задержки в мс
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    /**
     * прерабатываем запрос 
     * rucaptcha не допускает bool все должно быть в number
     * ну, а по мне это ни разу не канон, флаги локаничней...
     * @param options - обрабатываемые опции
     */
    private redesingRequest(options: { [key: string]: any }): any {
        for (let key in options)
            if (typeof options[key] === 'boolean')
                options[key] = Number(options[key]);
        return options;
    }

    /**
     * скачать картинку по адресу
     * на выходе base64
     * @param url адрес картинки 
     */
    public async getBase64ImgFromUrl(url: string): Promise<string> {
        let response = await axios.get(url, { responseType: 'arraybuffer' });
        return `data:${response.headers['content-type']};base64,${Buffer.from(String.fromCharCode(...new Uint8Array(response.data)), 'binary').toString('base64')}`;
    }

    /**
     * приводит к единому формату ответы независимо от флага json
     * @param res - данные ответа
     */
    public responseResolver(res: any): Response {
        if (typeof res === 'string') {
            let arr = res.split('|')
            if (arr.length === 2)
                return {
                    status: 1,
                    request: arr[1]
                };
            return {
                status: 0,
                request: arr[0]
            };
        } else return res;
    }

    /**
     * запрос к адресу "\in.php"
     * @param option - параметры запроса
     */
    public async in<T>(option: T): Promise<Response | false> {
        option = this.redesingRequest(option);
        let ret = await ChunkRepetition(() => axios.post('https://rucaptcha.com/in.php', option));
        if (ret.status !== 200) throw new NetworkError(`Code:${ret.status}`);
        const ApiRet: Response = this.responseResolver(ret.data);
        if (!ApiRet.status) {
            if (ApiRet.request === 'ERROR_ZERO_BALANCE')
                if (this.cfg.callbackNullBalance) {
                    let pr = this.cfg.callbackNullBalance();
                    if (pr instanceof Promise) await pr;
                    return false;
                }
            throw ListApiErrors.in(ApiRet.request, this.cfg.debug ? option : undefined);
        }
        return ApiRet;
    }

    /**
     * запрос к адресу "\res.php"
     * вернем null если капча еще не готова
     * @param option - параметры запроса
     */
    public async res<T>(option: T): Promise<Response | null | boolean> {
        option = this.redesingRequest(option);
        let ret = await ChunkRepetition(() => axios.get('https://rucaptcha.com/res.php', { params: option }));
        if (ret.status !== 200) throw new NetworkError(`Code:${ret.status}`);
        const ApiRet: Response = this.responseResolver(ret.data);
        if (!ApiRet.status) {
            if (ApiRet.request === 'CAPCHA_NOT_READY') return null;
            throw ListApiErrors.res(ApiRet.request, this.cfg.debug ? option : undefined);
        }
        return ApiRet;
    }

    /**
     * решаем капчу 
     * "Обыкновенную" - картинка
     * Вернем string - решение капти, 
     * null - если недостаточно баланса и есть обработчик callbackNullBalance
     * @param source - источника картинки
     */
    async resolveNormalCaptcha(source: sourceImg): Promise<string | null> {
        let body = "";
        if (source.base64)
            body = source.base64
        else if (source.url)
            body = await this.getBase64ImgFromUrl(source.url)
        else if (source.path)
            body = fs.readFileSync(source.path).toString('base64')
        else throw 'Не указан источник картинки';
        let retIn = <Response>await this.in<RequestNormalCaptcha>({
            key: this.cfg.key,
            method: 'base64',
            json: 1,
            body,
        });
        if (!retIn) return null;
        let retRes;
        do {
            retRes = await this.res<RequestRes>({
                key: this.cfg.key,
                action: 'get',
                id: retIn.request
            });
            this.sleep(<number>this.cfg.sleepTimeRes);
        } while (!retRes)
        return (retRes as Response).request;
    }

    async getBalance(): Promise<number | null> {
        let retRes = <Response>await this.res<RequestRes>({
            key: this.cfg.key,
            action: 'getbalance',
            json: true
        });
        return retRes ? Number(retRes.request) : null;
    }


}



