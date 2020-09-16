import fromTemplate from "./fromTemplate"

export default class Select extends HTMLElement {

    static readonly TAG = "fe-select"

    constructor() {
        super()
        fromTemplate.bind(this)(Select.TAG)
    }

}