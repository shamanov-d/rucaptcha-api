import СhunkRepetition from './../../helpers/ChunkRepetition';


describe('СhunkRepetition', function () {
    describe('consistently', () => {
        it('success', (done) => {
            let f = async () => {
                let ret = await СhunkRepetition(() => true)
                if (ret) done();
            };
            f();
        });
        it('failAll', (done) => {
            let f = async () => {
                try {
                    await СhunkRepetition(() => {
                        throw 'fail'
                    });
                } catch (e) {
                    done();
                    return;
                }
                done('ошибка несработала');
            };
            f();
        });
        it('fail-3', (done) => {
            let f = async () => {
                try {
                    let n = 0;
                    if (await СhunkRepetition(() => {
                        n++;
                        if (n < 3) throw 'fail';
                        return true;
                    })) done();
                } catch (e) {
                    done('Ошибки быть не должно');
                }
            };
            f();
        });
        it('fail-22', (done) => {
            let f = async () => {
                try {
                    let n = 0;
                    if (await СhunkRepetition(() => {
                        n++;
                        if (n < 1) throw 'fail';
                        return true;
                    }, 22)) done();
                } catch (e) {
                    done('Ошибки быть не должно');
                }
            };
            f();
        });
    })
    describe('async', () => {
        it('success', (done) => {
            let f = async () => {
                let ret = await СhunkRepetition(async () => true)
                if (ret) done();
            };
            f();
        });
        it('failAll', (done) => {
            let f = async () => {
                try {
                    await СhunkRepetition(async () => {
                        throw 'fail'
                    });
                } catch (e) {
                    done();
                    return;
                }
                done('ошибка несработала');
            };
            f();
        });
        it('fail-3', (done) => {
            let f = async () => {
                try {
                    let n = 0;
                    if (await СhunkRepetition(async () => {
                        n++;
                        if (n < 3) throw 'fail';
                        return true;
                    })) done();
                } catch (e) {
                    done('Ошибки быть не должно');
                }
            };
            f();
        });
        it('fail-22', (done) => {
            let f = async () => {
                try {
                    let n = 0;
                    if (await СhunkRepetition(async () => {
                        n++;
                        if (n < 1) throw 'fail';
                        return true;
                    }, 22)) done();
                } catch (e) {
                    done('Ошибки быть не должно');
                }
            };
            f();
        });
    })
});
