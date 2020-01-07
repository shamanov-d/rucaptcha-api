/**
 * репитор...
 * повторяет f n раз если внутри f выкинуло исключение
 * работает как с обычными f так и с f возвращающимим промис
 * @param f
 * @param n
 */

export default async (f: () => any | Promise<any>, n = 5) => {
    let repet;
    let repetitions = 0;
    let err;
    let ret;
    do {
        repetitions++;
        repet = false;
        err = undefined;
        try {
            ret = f();
            if (ret instanceof Promise) {
                ret = await ret;
            }
        } catch (e) {
            err = e;
            repet = true;
        }
    } while (repet && repetitions < n);
    if (err) throw err;
    return ret;
}
