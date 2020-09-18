import fromTemplate from "./fromTemplate"

export default class SelectPill extends HTMLElement {

    static readonly TAG = "fe-select-pill"

    constructor() {
        super()
        fromTemplate.bind(this)(SelectPill.TAG)
        const button = this.shadowRoot?.getElementById("remove-button") as HTMLButtonElement
        button.addEventListener("click", this.handleRemoveButtonClick.bind(this))
    }

    handleRemoveButtonClick() {
        const event = new Event("remove")
        this.dispatchEvent(event)
    }

}