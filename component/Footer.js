class FooterComponent extends HTMLElement {

    constructor() {
        super()
        this.#__init__()
    }
    
    #__init__() {
        const template = document.createElement('template')
        template.innerHTML = (String.raw`
            <h1>Footer</h1>
        `)
        this.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.#_addEvents()
    }

    #_addEvents(){
        
    }

    disconnectedCallback() {
        
    }

}

customElements.define('footer-component', FooterComponent)
