class ProductStockComponent extends HTMLElement {

    constructor() {
        super();
        this.#__init__();
    }

    #__init__() {
        const template = document.createElement('template');
        template.innerHTML = (String.raw`
            <sidebar-component></sidebar-component>
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style="margin-left: 17.125rem;">
                <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
                    <div class="container-fluid py-1 px-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                <li class="breadcrumb-item text-sm" style="font-family: monRegular !important; color: #0275d8">Pages</li>
                                <li class="breadcrumb-item text-sm active" aria-current="page" style="font-family: monRegular !important; color: #0275d8">Product Stock</li>
                            </ol>
                            <h6 class="font-weight-bolder mb-0" style="font-family: monRegular !important; font-size: 14pt">Product Stock</h6>
                        </nav>
                        <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                            <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                                <button class="btn btn-success" style="margin-top: 10px; margin-left: 10px" id="addProductStockButton">Add Stock</button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="container-fluid py-4">
                    <div class="row">
                        <div class="col-12">
                            <div class="card mb-4">
                                <div class="card-body px-0 pt-0 pb-2">
                                    <div class="table-responsive p-0">
                                        <table class="table align-items-center mb-0">
                                            <thead>
                                                <tr>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Product</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2" style="font-family: monRegular !important; font-size: 8pt">Quantity</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Status</th>
                                                    <th class="text-secondary opacity-7"></th>
                                                </tr>
                                            </thead>
                                            <tbody id="tableBodyProductStock"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade mt-5" id="productStockModal" tabindex="-1" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel1">Product Stock Form</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark" style="color: #000; font-size: 12px;"></i></button>
                            </div>
                            <form class="modal-body" id="modalProductStockForm">
                                <div class="row">
                                    <div class="col-12 mb-3">
                                        <label for="productID" class="form-label" style="font-size: 10pt">Product</label>
                                        <select id="productID" class="form-select p-3">
										</select>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label for="quantity" class="form-label" style="font-size: 10pt">Quantity</label>
                                        <input type="number" id="quantity" class="form-control p-3" placeholder="Enter quantity">
                                    </div>
                                </div>
                            </form>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-success" id="saveUpdateButtonProductStock">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `);
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.#_addEvents()
        this.#_fetchStock()
        this.#_fetchProduct()
    }

    #_addEvents() {
        const addButton = document.querySelector(`#addProductStockButton`);
        if (addButton) {
            addButton.addEventListener('click', (e) => {
                e.preventDefault();
                const modalForm = document.getElementById('modalProductStockForm');
                if (modalForm) modalForm.reset();
                const modal = new bootstrap.Modal(document.getElementById('productStockModal'));
                modal.show();
            });
        }

        const saveUpdateButton = document.getElementById('saveUpdateButtonProductStock');
        if (saveUpdateButton) {
            saveUpdateButton.addEventListener('click', (e) => {
                e.preventDefault();
                const productID = document.getElementById('productID').value
                const quantity = document.getElementById('quantity').value

                if (productID && quantity) {
                    ipcRenderer.send('saveProductStock', { productID, quantity });
                }
            })
        }

        ipcRenderer.on('saveProductStockResponse', (event, response) => {
            if (response.success) {
                Swal.fire({
                    title: 'Product Stock',
                    text: 'Stock added successfully',
                    icon: 'success'
                })
                const modal = bootstrap.Modal.getInstance(document.getElementById('productStockModal'))
                modal.hide()
                this.#_fetchStock()
            } else {
                Swal.fire({
                    title: 'Product Stock',
                    text: 'Error saving stock',
                    icon: 'error'
                })
            }
        })

        ipcRenderer.on('fetchProductStockResponse', (event, response) => {
            if (response.success) {
                let html = ``;
                response.data.forEach((stock) => {
                    html += `
                        <tr>
                            <td style="font-family: monRegular !important; font-size: 8pt">${stock.name}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt">${stock.quantity}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt">${stock.status == "active" ? 'Active' : 'Inactive'}</td>
                            <td class="text-end">
                                <button class="btn btn-secondary btn-sm" style="font-family: monRegular !important; font-size: 8pt" data-id="${stock.id}" onclick="">Edit</button>
                                <button class="btn btn-danger btn-sm" style="font-family: monRegular !important; font-size: 8pt" data-id="${stock.id}" onclick="">Delete</button>
                            </td>
                        </tr>
                    `
                })
                document.querySelector(`#tableBodyProductStock`).innerHTML = html
            }
        })
    }

    #_fetchStock() {
        ipcRenderer.send('fetchProductStock');
    }

    #_fetchProduct() {
        ipcRenderer.send('fetchProducts')
        ipcRenderer.on('fetchProductsResponse', (event, response) => {
            if (response.success) {
                let options = `<option value="" disabled selected>Select a category</option>`
                for (let i = 0; i < response.data.length; i++) {
                    options += `<option value="${response.data[i].id}">${response.data[i].name}</option>`
                }
                document.getElementById('productID').innerHTML = options
            }
        })
    }
}


customElements.define('product-stock-component', ProductStockComponent);
