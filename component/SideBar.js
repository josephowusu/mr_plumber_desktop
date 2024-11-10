// const { storeData } = require("../lib/Helper")

class SideBarComponent extends HTMLElement {

    constructor() {
        super()
        this.#__init__()
    }
    
    #__init__() {
        const template = document.createElement('template')
        template.innerHTML = (String.raw`
            <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-0 mt-0 border-radius-xl my-3 fixed-start ms-3 " id="sidenav-main">
                <div class="sidenav-header mt-5">
                    <i class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
                    <span class="navbar-brand m-0">
                        <!-- <img src="assets/images/logo.png" class="navbar-brand-img h-100" alt="main_logo"> -->
                        <span class="ms-1 font-weight-bold" style="font-family: monRegular !important; font-size: 12pt">Mr. Plumber v.1.0.0</span>
                    </span>
                    <p class="text-center" style="width: 100%">-------------------------------</p>
                </div>
                <hr class="horizontal mt-4">
                <div class="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link navNavigationSidebar" href="#" page="dashboard">
                                <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i class="fa-solid fa-maximize" style="color: #555; font-size: 12px"></i>
                                </div>
                                <span class="nav-link-text ms-1" style="font-family: monRegular !important; font-size: 9pt">Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link navNavigationSidebar" href="#" page="stock">
                                <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i class="fa-solid fa-maximize" style="color: #555; font-size: 12px"></i>
                                </div>
                                <span class="nav-link-text ms-1" style="font-family: monRegular !important; font-size: 9pt">Stock History</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link navNavigationSidebar" href="#" page="sales">
                                <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i class="fa-solid fa-maximize" style="color: #555; font-size: 12px"></i>
                                </div>
                                <span class="nav-link-text ms-1" style="font-family: monRegular !important; font-size: 9pt">Sales</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link navNavigationSidebar" href="#" page="productList">
                                <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i class="fa-solid fa-maximize" style="color: #555; font-size: 12px"></i>
                                </div>
                                <span class="nav-link-text ms-1" style="font-family: monRegular !important; font-size: 9pt">Products</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link navNavigationSidebar" href="#" page="productCategory">
                                <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i class="fa-solid fa-maximize" style="color: #555; font-size: 12px"></i>
                                </div>
                                <span class="nav-link-text ms-1" style="font-family: monRegular !important; font-size: 9pt">Product Category</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link navNavigationSidebar" href="#" page="product">
                                <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i class="fa-solid fa-maximize" style="color: #555; font-size: 12px"></i>
                                </div>
                                <span class="nav-link-text ms-1" style="font-family: monRegular !important; font-size: 9pt">Stock</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link navNavigationSidebar" href="#" page="invoice">
                                <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i class="fa-solid fa-maximize" style="color: #555; font-size: 12px"></i>
                                </div>
                                <span class="nav-link-text ms-1" style="font-family: monRegular !important; font-size: 9pt">Invoice</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link navNavigationSidebar" href="#" page="customer">
                                <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                    <i class="fa-solid fa-maximize" style="color: #555; font-size: 12px"></i>
                                </div>
                                <span class="nav-link-text ms-1" style="font-family: monRegular !important; font-size: 9pt">Customer</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        `)
        this.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.#_addEvents()
    }

    #_addEvents(){
        const navButtons = document.querySelectorAll('.navNavigationSidebar')
        if (navButtons) {
            for (let i = 0; i < navButtons.length; i++) {
                const navButton = navButtons[i]
                navButton.addEventListener('click', (e) => {
                    e.preventDefault()
                    let page = e.target.getAttribute('page')
                    storeData('lastPage', page ? page : 'dashboard')
                    loadPage(page ? page : 'dashboard')
                })
            }
        }
    }

    disconnectedCallback() {
        
    }

}

customElements.define('sidebar-component', SideBarComponent)
