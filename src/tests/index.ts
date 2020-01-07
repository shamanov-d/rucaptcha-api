import 'assert';
import express from 'express';

import Api from './../index';
import { CfgError, ApiError } from './../types/Error'
import { expect as $ } from 'chai';

import './helpers/ChunkRepetition';

describe('Rucaptcha', function () {
    const UrlCaptcha = 'http://localhost:3000/img/t1.jpg'
    let listen: any;
    before(() => {
        let server = express();
        server.use('/img', express.static(__dirname + '/img'));
        listen = server.listen(3000);
    });
    after(() => listen.close());
    this.timeout(60000);


    it('fail key', done => {
        try {
            new Api({ key: '123' })
        } catch (e) {
            $(e instanceof CfgError).to.be.true
            done();
        }
    })
    it('responseResolver', done => {
        (async _ => {
            let api = new Api({ key: '1abc234de56fab7c89012d34e56fa7b8' });
            $(api.responseResolver({ status: 0, request: 'ERROR_WRONG_USER_KEY' }))
                .to.have.property('status', 0);
            $(api.responseResolver('ERROR_WRONG_USER_KEY'))
                .to.have.property('status', 0);
            done();
        })().catch(done)
    })
    it('getBase64ImgFromUrl', done => {
        (async _ => {
            let api = new Api({ key: '1abc234de56fab7c89012d34e56fa7b8' });
            $(await api.getBase64ImgFromUrl(UrlCaptcha)).to.be.a('string');
            done();
        })().catch(done)
    })
    it('in ApiError', done => {
        (async _ => {
            try {
                let api = new Api({ key: '1abc234de56fab7c89012d34e56fa7b8' });
                await api.in({ key: '1abc234de56fab7c89012d34e56fa7b8', method: 'base64' })
            } catch (e) {
                $(e instanceof ApiError).to.be.true
                done();
            }
        })().catch(done)
    })
    it('res ApiError', done => {
        (async _ => {
            try {
                let api = new Api({ key: '1abc234de56fab7c89012d34e56fa7b8' });
                await api.res({ key: '1abc234de56fab7c89012d34e56fa7b8', id: 123, action: 'get' });
            } catch (e) {
                $(e instanceof ApiError).to.be.true
                done();
            }
        })().catch(done)
    })
    let api = new Api({ key: '82fd1cd0ebb82665e774b3776b5aba0b' });//ключ от аккаунта с пустым балансом, пополнять не собираюсь =)
    it('resolveImg ERROR_ZERO_BALANCE', done => {
        (async _ => {
            try {
                let ret = await api.resolveNormalCaptcha({ url: UrlCaptcha });
            } catch (e) {
                $(e instanceof ApiError).to.be.true
                $(e).to.have.property('code', 'ERROR_ZERO_BALANCE');
                done();
            }
        })().catch(done)
    })
    it('resolveImg callbackNullBalance', done => {
        let api = new Api({ key: '82fd1cd0ebb82665e774b3776b5aba0b', callbackNullBalance: done });
        (async _ => {
            let ret = await api.resolveNormalCaptcha({ url: UrlCaptcha });
        })().catch(done)
    })
    it('resolveImg callbackNullBalance async ', done => {
        let api = new Api({ key: '82fd1cd0ebb82665e774b3776b5aba0b', callbackNullBalance: async () => done()});
        (async _ => {
            let ret = await api.resolveNormalCaptcha({ url: UrlCaptcha });
        })().catch(done)
    })



    if (process.env.test_key) {
        const testKey = process.env.test_key;
        let api = new Api({ key: testKey });
        it('getBalance', done => {
            (async _ => {
                $(await api.getBalance()).be.not.null;
                done();
            })().catch(done)
        })
        it('resolveImg url', done => {
            (async _ => {
                let ret = await api.resolveNormalCaptcha({ url: UrlCaptcha });
                $(ret).to.be.a('string');
                done();
            })().catch(done)
        })
        it('resolveImg base64', done => {
            (async _ => {
                let ret = await api.resolveNormalCaptcha({ base64: await api.getBase64ImgFromUrl(UrlCaptcha) });
                $(ret).to.be.a('string');
                done();
            })().catch(done)
        })
        it('resolveImg file from disk', done => {
            (async _ => {
                let ret = await api.resolveNormalCaptcha({ path: __dirname + '/img/t1.jpg' });
                $(ret).to.be.a('string');
                done();
            })().catch(done)
        })
    } else console.log('Для проведения остальных тестов необходим ключ доступа в переменной окружения "test_key"\n')
});