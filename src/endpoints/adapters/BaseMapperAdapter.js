
export class BaseMapperAdapter {

    adapt(valuesToAdapt){
        return this._reduce(valuesToAdapt, this._valueAt);
    }

    valuesFrom(valuesToUndoAdapt){
        const values = this._valuesOf(valuesToUndoAdapt);
        return this._reduce(values, this._keyOf);
    }

    _reduce(valuesToUndoAdapt, changeKeyFunction) {
        const values = this._valuesOf(valuesToUndoAdapt);
        const mapping = this.mapping();
        return Object
            .entries(values)
            .reduce((values, [key, value]) => {
                const newKey = changeKeyFunction(key, mapping);
                values[newKey] = value
                return values
            }, {})
    }

    _keyOf(value, aJson) {
        return Object.keys(aJson).find(key => aJson[key] === value);
    }

    _valueAt(aKey, aJson) {
        return aJson[aKey]
    }

    _valuesOf(aJson) {
        return aJson
    }

    mapping() {
        throw new Error("Subclass responsibility");
    }

}
