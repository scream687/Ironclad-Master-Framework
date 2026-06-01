export class ValueObject {
    props;
    constructor(props) {
        this.props = Object.freeze(props);
    }
    equals(object) {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        return JSON.stringify(this.props) === JSON.stringify(object.props);
    }
    get value() {
        return this.props;
    }
}
