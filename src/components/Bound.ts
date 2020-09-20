import fromTemplate from "./fromTemplate"

interface BoundCallbacks {
    setMin(value: string): void
    setMax(value: string): void
}

export default class Bound extends HTMLElement {

    callbacks: BoundCallbacks | null = null

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

    static get observedAttributes() {
        return [
            "type",
        ]
    }

    constructor() {
        super()
        fromTemplate.bind(this)(Bound.TAG)
        this.minInput = this.shadowRoot?.getElementById("min") as HTMLInputElement
        this.maxInput = this.shadowRoot?.getElementById("max") as HTMLInputElement
        this.prepareHandlers()
    }

    private prepareHandlers(): void {
        this.minInput.addEventListener("change", this.handleMinInputChange.bind(this))
        this.maxInput.addEventListener("change", this.handleMaxInputChange.bind(this))
    }

    private handleMinInputChange(): void {
        this.callbacks?.setMin(this.minInput.value)
    }

    private handleMaxInputChange(): void {
        this.callbacks?.setMax(this.maxInput.value)
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        switch (name) {
            case "type": {
                this.type = newValue
                break
            }
        }
    }

}