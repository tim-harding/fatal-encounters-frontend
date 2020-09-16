export default function fromTemplate(this: any, tag: string) {
    const shadow = this.attachShadow({
        mode: "open",
    })
    const id = `${tag}-template`
    const template = document.getElementById(id) as HTMLTemplateElement
    const content = template.content.cloneNode(true)
    shadow.appendChild(content)
}