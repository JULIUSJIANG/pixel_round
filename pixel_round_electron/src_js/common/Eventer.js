export default class Eventer {
    constructor() {
        this._seed = 0;
        this._mapIdToCB = new Map();
    }
    on(cb) {
        let id = ++this._seed;
        this._mapIdToCB.set(id, cb);
        return id;
    }
    off(id) {
        this._mapIdToCB.delete(id);
    }
    call(t) {
        this._mapIdToCB.forEach((val, id) => {
            val(t);
        });
    }
}
