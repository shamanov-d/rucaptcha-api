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