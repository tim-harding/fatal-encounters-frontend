import fromTemplate from "./fromTemplate"

export default class Bound extends HTMLElement {

    private minInput: HTMLInputElement
    private maxInput: HTMLInputElement

    static TAG: string = "fe-bound"

    private get type(): string {
        return this.minInput.type
    }

    private set type(value: string) {
        this.minInput.type = value
        this.maxInput.type = value
    }

    constructor() {
        super()
        fromTemplate.bind(this)(Bound.TAG)
        this.minInput = this.shadowRoot?.getElementById("min") as HTMLInputElement
        this.maxInput = this.shadowRoot?.getElementById("max") as HTMLInputElement
    }

    static get observedAttributes() {
        return [
            "type",
        ]
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case "type": {
                this.type = newValue
                break
            }
        }
    }

}