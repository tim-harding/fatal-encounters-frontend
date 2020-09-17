import { baseUrl } from "../baseUrl"
import Store from "../store"
import fromTemplate from "./fromTemplate"

export default class Select extends HTMLElement {

    static readonly TAG = "fe-select"

    private dropdown: HTMLDivElement
    private search: HTMLInputElement
    private results: HTMLUListElement

    store: Store | null = null

    private dirty: boolean = false
    private fetching: boolean = false

    constructor() {
        super()
        fromTemplate.bind(this)(Select.TAG)
        this.dropdown = this.shadowElement("dropdown") as HTMLDivElement
        this.search = this.shadowElement("search") as HTMLInputElement
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
            const li = document.createElement("li")
            const button = document.createElement("button")
            button.innerText = row.name
            li.appendChild(button)
            this.results.appendChild(li)
        }
        this.fetching = false
        if (this.dirty) {
            this.dirty = false
            this.updateResults()
        }
    }

    private clearResults(): void {
        const results = this.results
        while (results.lastChild) {
            results.removeChild(results.lastChild)
        }
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