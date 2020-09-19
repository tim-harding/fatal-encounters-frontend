import { mod } from "../misc"
import fromTemplate from "./fromTemplate"

interface SelectDelegate {
    query: { (): string } 
    storeValue: { (value: any): void } 
    addToFilter: { (id: number): void } 
    removeFromFilter: { (id: number): void } 
    nameForId: { (id: number): any } 
}

export default class Select extends HTMLElement {

    static readonly TAG = "fe-select"

    private dropdown: HTMLDivElement
    private search: HTMLInputElement
    private searchTerms: HTMLUListElement
    private options: HTMLUListElement
    private container: HTMLDivElement

    private dirty: boolean = false
    private fetching: boolean = false

    private selection: number = 0

    private optionIds: number[] = []
    private pillIds: number[] = []

    private _name: string = ""

    delegate: SelectDelegate | null = null

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
        this.updateLabel()
    }

    static get observedAttributes() {
        return [
            "name",
        ]
    }

    constructor() {
        super()
        fromTemplate.bind(this)(Select.TAG)
        this.dropdown = this.shadowElement("dropdown") as HTMLDivElement
        this.search = this.shadowElement("search") as HTMLInputElement
        this.searchTerms = this.shadowElement("search-terms") as HTMLUListElement
        this.options = this.shadowElement("options") as HTMLUListElement
        this.container = this.shadowElement("root-container") as HTMLDivElement
        this.prepareRespondToInput()
    }

    private updateLabel(): void {
        const label = this.shadowRoot?.querySelector("label") as HTMLLabelElement
        label.innerText = this.prettyName()
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case "name": {
                this.name = newValue
                break
            }
        }
    }

    private prettyName(): string {
        const nameParts = this.name.split("-")
        const firstPart = nameParts[0]
        const firstLetter = firstPart[0].toUpperCase()
        const rest = firstPart.slice(1)
        nameParts[0] = `${firstLetter}${rest}`
        const name = nameParts.join(" ")
        return name
    }

    private shadowElement(id: string): HTMLElement {
        return this.shadowRoot?.getElementById(id) as HTMLDivElement
    }

    private prepareRespondToInput(): void {
        this.search?.addEventListener("focusin", this.handleSearchFocus.bind(this))
        this.search?.addEventListener("focusout", this.handleSearchBlur.bind(this))
        this.search?.addEventListener("input", this.handleSearchInput.bind(this))
        this.shadowRoot?.addEventListener("keydown", this.handleKeydownWrapper.bind(this))
    }

    // Required for Typescript :P
    private handleKeydownWrapper(e: Event): void {
        this.handleKeydown(e as KeyboardEvent)
    }

    private handleKeydown(e: KeyboardEvent): void {
        switch (e.key) {
            case "ArrowDown": {
                this.offsetSelection(1)
                break
            }
            case "ArrowUp": {
                this.offsetSelection(-1)
                break
            }
            case "Enter": {
                this.commit()
                break
            }
        }
    }

    private commit(): void {
        const optionIds = this.optionIds
        if (optionIds.length > 0) {
            const id = optionIds[this.selection]
            this.pillIds.push(id)
            this.delegate?.addToFilter(id)
            this.createNewPill(id)
            this.search.value = ""
            this.updateResults()
        }
    }

    private createNewPill(id: number): void {
        const name = this.delegate?.nameForId(id)
        if (name) {
            const pill = document.createElement("fe-select-pill")
            const span = document.createElement("span")
            const li = document.createElement("li")
            span.innerText = name
            span.slot = "content"
            pill.appendChild(span)
            pill.addEventListener("remove", this.handleRemovePillFactory(id))
            li.appendChild(pill)
            const searchTerms = this.searchTerms
            const children = searchTerms.children
            searchTerms.insertBefore(li, children[children.length - 1])
        }
    }

    private handleRemovePillFactory(id: number): { (): void } {
        return () => {
            this.delegate?.removeFromFilter(id)
            const pillIds = this.pillIds
            let i = 0;
            for (; i < pillIds.length; i++) {
                if (pillIds[i] == id) {
                    break
                }
            }
            pillIds.splice(i, 1)[0]
            const searchTerms = this.searchTerms
            const pill = searchTerms.children[i]
            searchTerms.removeChild(pill)
        }
    }

    private handleSearchFocus(): void {
        this.dropdown.classList.add("show")
        this.container.classList.add("forefront")
    }

    private handleSearchBlur(): void {
        this.dropdown.classList.remove("show")
        this.container.classList.remove("forefront")
    }

    private handleSearchInput(): void {
        this.updateResults()
    }

    get term(): string {
        return this.search.value
    }

    private async updateResults(): Promise<void> {
        if (this.fetching || !this.delegate) {
            return
        }
        this.fetching = true
        const response = await fetch(this.delegate.query())
        const json = await response.json()
        this.clearResults()
        for (const row of json.rows) {
            this.delegate.storeValue(row)
            this.optionIds.push(row.id)
            const option = optionElement(row.name)
            this.options.appendChild(option)
        }
        this.offsetSelection(0)
        this.fetching = false
        if (this.dirty) {
            this.dirty = false
            this.updateResults()
        }
    }

    private offsetSelection(amount: number): void {
        const optionCount = this.optionIds.length
        if (optionCount > 0) {
            this.selection = mod(this.selection + amount, this.optionIds.length)
        }
        const SELECTED = "selected"
        const children = this.options.children
        for (const child of children) {
            child.classList.remove(SELECTED)
        }
        const selection = children[this.selection]
        selection?.classList.add(SELECTED)
    }

    private clearResults(): void {
        this.optionIds = []
        const results = this.options
        while (results.lastChild) {
            results.removeChild(results.lastChild)
        }
    }

}

function optionElement(text: string): HTMLLIElement {
    const li = document.createElement("li")
    const button = document.createElement("button")
    button.innerText = text
    li.appendChild(button)
    return li
}