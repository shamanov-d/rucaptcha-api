import axios from 'axios';
import * as fs from 'fs';
import { CfgError, ListApiErrors, NetworkError } from './types/Error';
import { RequestNormalCaptcha, RequestRes, Response, RequestBaseOptionsIN } from './types';
import ChunkRepetition from './helpers/ChunkRepetition';

export interface Cfg {
    key: string
    sleepTimeRes?: number
    debug?: boolean
    callbackNullBalance?: () => any //callback при пустом балансе, внимание если есть callback ошибка проглатывается и резолверы вернут null!! 
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

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


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
     * приводит к единому формату ответы не зависимо от флага json
     * @param res 
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

    public async in<T extends RequestBaseOptionsIN>(option: T): Promise<Response | false> {
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
     * вернем null если капча еще неготова
     * @param option 
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
     * решаем капчу по картинке
     * @param file  - картинка в base64 или адрес для её скачивания
     */
    async resolveNormalCaptcha(param: { url?: string, path?: string, base64?: string }) {
        let body = "";
        if (param.base64)
            body = param.base64
        else if (param.url)
            body = await this.getBase64ImgFromUrl(param.url)
        else if (param.path)
            body = fs.readFileSync(param.path).toString('base64')
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



