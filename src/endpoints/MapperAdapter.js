
export class MapperAdapter {

    adapt(valuesToAdapt){
        return this._reduce(valuesToAdapt, this._valueAt);
    }

    valuesFrom(valuesToUndoAdapt){
        return this._reduce(valuesToUndoAdapt, this._keyOf);
    }

    _reduce(valuesToUndoAdapt, changeKeyFunction) {
        const mapping = this.mapping();
        return Object
            .entries(valuesToUndoAdapt)
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

    mapping() {
        throw new Error("Subclass responsibility");
    }

}
