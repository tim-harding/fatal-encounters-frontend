export default class SelectPill extends HTMLElement {
    constructor() {
        super()
        this.createContent()
    }

    static get tag() {
        return "fe-select-pill"
    }

    createContent() {
        const shadow = this.attachShadow({
            mode: "open",
        })
        const template = document.getElementById(`${SelectPill.tag}-template`) as HTMLTemplateElement
        const content = template.content.cloneNode(true)
        shadow.appendChild(content)
    }
}