class DashboardComponent extends HTMLElement {

    constructor() {
        super()
        this.#__init__()
    }
    
    #__init__() {
        const template = document.createElement('template')
        template.innerHTML = (String.raw`
            <sidebar-component></sidebar-component>
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

customElements.define('dashboard-component', DashboardComponent)
