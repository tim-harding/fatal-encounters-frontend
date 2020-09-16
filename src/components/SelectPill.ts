import fromTemplate from "./fromTemplate"

export default class SelectPill extends HTMLElement {

    static readonly TAG = "fe-select-pill"

    constructor() {
        super()
        fromTemplate.bind(this)(SelectPill.TAG)
    }

}