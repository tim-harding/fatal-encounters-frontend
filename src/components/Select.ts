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

    constructor() {
        super()
        fromTemplate.bind(this)(Select.TAG)
        this.dropdown = this.shadowElement("dropdown") as HTMLDivElement
        this.search = this.shadowElement("search") as HTMLInputElement
        this.searchTerms = this.shadowElement("search-terms") as HTMLUListElement
        this.results = this.shadowElement("results") as HTMLUListElement
        this.prepareRespondToInput()
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
        const name = this.store?.races.get(id)
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

    private get term(): string {
        return this.search.value
    }

    private async updateResults(): Promise<void> {
        if (this.fetching) {
            return
        }
        this.fetching = true
        const response = await fetch(this.query)
        const json = await response.json()
        this.clearResults()
        for (const row of json.rows) {
            this.store?.races.set(row.id, row.name)
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

    private get query(): string {
        const url = new URL("/api/race", baseUrl())
        const params = url.searchParams
        params.append("search", this.term)
        params.append("count", "6")
        const href = url.href
        return href
    }

}