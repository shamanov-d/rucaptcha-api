Собственно смысла уже не имеет по причине того что `2captcha` [взялись нормально за api](https://www.npmjs.com/package/@2captcha/captcha-solver) наконец то.🙈

<p align="center">
<a href="https://www.npmjs.com/package/rucaptcha-api"><img src="https://img.shields.io/npm/v/rucaptcha-api.svg?style=flat-square" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/rucaptcha-api"><img src="https://img.shields.io/npm/dt/rucaptcha-api.svg?style=flat-square" alt="NPM downloads"></a>
</p>

Простенький [Node.js](https://nodejs.org) модуль для работы с rucaptcha API.

## Installation

### NPM
```
npm i rucaptcha-api
```

## Example usage
```js
import Rucaptcha from 'rucaptcha-api';

let api = new Api({ key: process.env.key });

(asycn ()=>{
    let resolvedCaptcha = await api.resolveNormalCaptcha({ url: '/1.jpg' });
    console.log(resolveCaptcha)
})()

```

Функция resolveNormalCaptcha поддерживает разные варианты загрузки изображения [см.](https://github.com/shamanov-d/rucaptcha-api/blob/3db142be5cdaae9213b737085138c97494581bd3/src/index.ts#L19)
