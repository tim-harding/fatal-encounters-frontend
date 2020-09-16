import fromTemplate from "./fromTemplate"

export default class Spinner extends HTMLElement {

    static readonly TAG = "fe-spinner"

    constructor() {
        super()
        fromTemplate.bind(this)(Spinner.TAG)
    }

}