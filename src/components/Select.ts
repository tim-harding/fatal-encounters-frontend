import { baseUrl, mod } from "../misc"
import Store from "../store"
import fromTemplate from "./fromTemplate"

export default class Select extends HTMLElement {

    static readonly TAG = "fe-select"

    private dropdown: HTMLDivElement
    private search: HTMLInputElement
    private searchTerms: HTMLUListElement
    private results: HTMLUListElement

    store: Store | null = null

    private dirty: boolean = false
    private fetching: boolean = false

    private selection: number = 0

    // List of the IDs
    private options: number[] = []

    private _name: string = ""

    query: { (): string } | null = null
    storeValue: { (value: any): void } | null = null
    nameForId: { (id: number): any } | null = null

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
        this.results = this.shadowElement("results") as HTMLUListElement
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
        const options = this.options
        if (options.length > 0) {
            const option = options[this.selection]
            this.store?.filter.race.push(option)
            this.createNewPill(option)
            this.search.value = ""
        }
    }

    private createNewPill(id: number): void {
        if (!this.nameForId) {
            return
        }
        const name = this.nameForId(id)
        if (name) {
            const pill = document.createElement("fe-select-pill")
            const span = document.createElement("span")
            const li = document.createElement("li")
            span.innerText = name
            span.slot = "content"
            pill.appendChild(span)
            li.appendChild(pill)
            const searchTerms = this.searchTerms
            const children = searchTerms.children
            searchTerms.insertBefore(li, children[children.length - 1])
        }
    }

    private handleSearchFocus(): void {
        this.dropdown.classList.add("show")
    }

    private handleSearchBlur(): void {
        this.dropdown.classList.remove("show")
    }

    private handleSearchInput(): void {
        this.updateResults()
    }

    get term(): string {
        return this.search.value
    }

    private async updateResults(): Promise<void> {
        console.log("Update")
        if (this.fetching || !this.query || !this.storeValue) {
            console.log("Bailed")
            return
        }
        this.fetching = true
        const response = await fetch(this.query())
        const json = await response.json()
        this.clearResults()
        for (const row of json.rows) {
            this.storeValue(row)
            this.options.push(row.id)
            const option = this.optionElement(row.name)
            this.results.appendChild(option)
        }
        this.offsetSelection(0)
        this.fetching = false
        if (this.dirty) {
            this.dirty = false
            this.updateResults()
        }
    }

    private offsetSelection(amount: number): void {
        const optionCount = this.options.length
        if (optionCount > 0) {
            this.selection = mod(this.selection + amount, this.options.length)
        }
        const SELECTED = "selected"
        const children = this.results.children
        for (const child of children) {
            child.classList.remove(SELECTED)
        }
        children[this.selection].classList.add(SELECTED)
    }

    private clearResults(): void {
        this.options = []
        const results = this.results
        while (results.lastChild) {
            results.removeChild(results.lastChild)
        }
    }

    private optionElement(text: string): HTMLLIElement {
        const li = document.createElement("li")
        const button = document.createElement("button")
        button.innerText = text
        li.appendChild(button)
        return li
    }

}