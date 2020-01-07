export class CfgError extends Error {
    constructor(message: string) {
        super()
        this.message = message;
        this.name = "CFG";
    }
}

/**
 * ошибки сети
 * что то отличное от кода 200 или иное..
 */
export class NetworkError extends Error {
    constructor(message: string) {
        super()
        this.message = message;
        this.name = "Network";
    }
}


/**
 * ошибки api 
 * https://rucaptcha.com/api-rucaptcha#error_handling
 */
export class ApiError extends Error {
    public option: any;
    public code: any;
    constructor(message: string, code: any, option?: any) {
        super()
        this.code = code;
        this.option = option;
        // TODO: совмесимость с sentry
        this.message = message + (option ? `\n option: \n${JSON.stringify(option, null, '\t')}` : '');
        this.name = "Api";
    }
}

/**
 * https://rucaptcha.com/api-rucaptcha#limits
 */
const ListLimitError: any = {
    help: `\nБолее подробную информацию можно найти по ссылке https://rucaptcha.com/api-rucaptcha#limits`,
    'ERROR: 1001': `Аккаунт заблокирован на 10 минут`,
    'ERROR: 1002': `Аккаунт заблокирован на 5 минут`,
    'ERROR: 1003': `Аккаунт заблокирован на 30 секунд`,
    'ERROR: 1004': `Аккаунт заблокирован на 10 минут`,
    'ERROR: 1005': `Аккаунт заблокирован на 5 минут`,
    MAX_USER_TURN: `Аккаунт заблокирован на 10 секунд`

}

const listInErrors: any = {
    help: `\nБолее подробную информацию можно найти по ссылке https://rucaptcha.com/api-rucaptcha#in_errors`,
    ERROR_WRONG_USER_KEY: `Вы указали значение параметра key в неверном формате, ключ должен содержать 32 символа`,
    ERROR_KEY_DOES_NOT_EXIST: `Ключ, который вы указали, не существует`,
    ERROR_ZERO_BALANCE: `На вашем счету недостаточно средств`,
    ERROR_PAGEURL: `Параметр pageurl не задан в запросе`,
    ERROR_NO_SLOT_AVAILABLE: `Вы можете получить данную ошибку в двух случаях:
1. Очередь ваших капч, которые ещё не распределены на работников, слишком длинная. Длина очереди зависит от общего числа капч, которые ждут распределения, и может иметь значения от 50 до 100 капч.
2. Максимальная ставка, которую вы указали в настройках вашего аккаунта ниже текущей ставки на сервере.
Вы можете повысить вашу максимальную ставку`,
    ERROR_ZERO_CAPTCHA_FILESIZE: `Размер вашего изображения менее 100 байт`,
    ERROR_TOO_BIG_CAPTCHA_FILESIZE: `Размер вашего изображения более 100 Кбайт`,
    ERROR_WRONG_FILE_EXTENSION: `Файл имеет неподдерживаемое расширение. Допустимые расширения: jpg, jpeg, gif, png`,
    ERROR_IMAGE_TYPE_NOT_SUPPORTED: `Сервер не может опознать тип вашего файла`,
    ERROR_UPLOAD: `Сервер не может прочитать файл из вашего POST-запроса.
Это происходит, если POST-запрос некорректно сформирован в части отправки файла, либо содержит невалидный base64`,
    ERROR_IP_NOT_ALLOWED: `Запрос отправлен с IP-адреса, который не добавлен в список разрешённых вами IP-адресов`,
    IP_BANNED: `Ваш IP-адрес заблокирован за чрезмерное количество попыток авторизации с неверным ключем авторизации`,
    ERROR_BAD_TOKEN_OR_PAGEURL: `Вы можете получить эту ошибку, если отправляете нам ReCaptcha V2. Ошибка возвращается если вы прислали невалидную пару значений googlekey и pageurl. Обычно так бывает, если ReCaptcha подгружается в iframe с другого домена или поддомена`,
    ERROR_GOOGLEKEY: `Вы можете получить эту ошибку, если отправляете нам ReCaptcha V2. Ошибка возвращается если sitekey в вашем запросе пустой или имеет некорректный формат`,
    ERROR_CAPTCHAIMAGE_BLOCKED: `Вы отправили изображение, которые помечено в нашей базе данных как нераспознаваемое.
Обычно это происходит, если сайт, на котором вы решаете капчу, прекратил отдавать вам капчу и вместо этого выдает изображение с информацией о блокировке`,
    MAX_USER_TURN: `Вы делаете больше 60 обращений к in.php в течение 3 секунд.
Ваш ключ API заблокирован на 10 секунд. Блокировка будет снята автоматически`,
    ERROR_BAD_PARAMETERS: `Код ошибки возвращается если вы присылаете ReCaptcha в виде картинок без инструкции для работников`,
}

const listResError: any = {
    help: `\nБолее подробную информацию можно найти по ссылке https://rucaptcha.com/api-rucaptcha#res_errors`,
    CAPCHA_NOT_READY: `Ваша капча ещё не решена`,
    ERROR_CAPTCHA_UNSOLVABLE: `Мы не можем решить вашу капчу — три наших работника не смогли её решить, либо мы не получили ответ в течение 90 секунд.
	Мы не спишем с вас деньги за этот запрос`,
    ERROR_WRONG_USER_KEY: `Вы указали значение параметра key в неверном формате, ключ должен содержать 32 символа`,
    ERROR_KEY_DOES_NOT_EXIST: `Ключ, который вы указали, не существует`,
    ERROR_WRONG_ID_FORMAT: `Вы отправили ID капчи в неправильном формате. ID состоит только из цифр`,
    ERROR_WRONG_CAPTCHA_ID: `Вы отправили неверный ID капчи`,
    ERROR_BAD_DUPLICATES: `Ошибка возвращается, если вы используете функцию 100% распознавания. Ошибка означает, что мы достигли максимального числа попыток, но требуемое количество совпадений достигнуто не было`,
    REPORT_NOT_RECORDED: `Ошибка возвращается при отправке жалобы на неверный ответ если вы уже пожаловались на большое количество верно решённых капч`,
    ERROR_IP_ADDRES: `Ошибка возвращается при добавлении домена или IP для pingback (callback).
	Это происходит, если вы отправляете запрос на добавление IP или домена с IP адреса, не совпадающего с вашим IP или доменом для pingback`,
    ERROR_TOKEN_EXPIRED: `Вы можете получить эту ошибку, если решаете капчу GeeTest.
	Этот код ошибки означает, что истек срок действия значения challenge из вашего запроса`,
    ERROR_EMPTY_ACTION: `Параметр action не был передан или передан без значения`
}

export const ListApiErrors = {
    in: function (name: string, option?: any): ApiError {
        if (listInErrors[name]) return new ApiError(`${name} - ${listInErrors[name]} ${listInErrors.help}`, name, option);
        if (ListLimitError[name]) return new ApiError(`${name} - ${ListLimitError[name]} ${ListLimitError.help}`, name, option);
        return new ApiError(`${name}`, name, option);
    },
    res: function (name: string, option?: any): ApiError {
        if (listResError[name]) return new ApiError(`${name} - ${listResError[name]} ${listResError.help}`, name, option);
        if (ListLimitError[name]) return new ApiError(`${name} - ${ListLimitError[name]} ${ListLimitError.help}`, name, option);
        return new ApiError(`${name}`, name, option);
    }
}



