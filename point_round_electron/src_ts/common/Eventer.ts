export default class Eventer <T> {
    
    private _seed = 0;

    private _mapIdToCB = new Map <number, (t: T) => void> ();

    on (cb: (t: T) => void) {
        let id = ++this._seed;
        this._mapIdToCB.set (id, cb);
        return id;
    }

    off (id: number) {
        this._mapIdToCB.delete (id);
    }

    call (t: T) {
        this._mapIdToCB.forEach ((val, id) => {
            val (t);
        });
    }
}