class SalesComponent extends HTMLElement {
    constructor() {
        super();
        this.saleID = null;
        this.selectedProductPrice = 0
        this.selectedProductQuantity = 0
        this.#__init__();
    }

    #__init__() {
        const template = document.createElement('template');
        template.innerHTML = String.raw`
            <sidebar-component></sidebar-component>
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style="margin-left: 17.125rem;">
                <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
                    <div class="container-fluid py-1 px-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                <li class="breadcrumb-item text-sm" style="font-family: monRegular !important; color: #0275d8">Pages</li>
                                <li class="breadcrumb-item text-sm active" aria-current="page" style="font-family: monRegular !important; color: #0275d8">Sales</li>
                            </ol>
                            <h6 class="font-weight-bolder mb-0" style="font-family: monRegular !important; font-size: 14pt">Manage Sales</h6>
                        </nav>
                        <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                            <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                                <button class="btn btn-success w-100" id="addSaleButton" style="margin-top: 10px; margin-left: 10px">Add Sale</button>
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
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Product Name</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Selling Price</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2" style="font-family: monRegular !important; font-size: 8pt">Quantity</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2" style="font-family: monRegular !important; font-size: 8pt">Total Price</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2" style="font-family: monRegular !important; font-size: 8pt">Date</th>
                                                    <th class="text-secondary opacity-7"></th>
                                                </tr>
                                            </thead>
                                            <tbody id="salesTableBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade mt-5" id="salesModal" tabindex="-1" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Sales Form</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark" style="color: #000; font-size: 12px;"></i></button>
                            </div>
                            <form class="modal-body" id="modalSalesForm">
                                <div class="row">
                                    <div class="col-12 mb-3">
                                        <label class="form-label" style="font-size: 10pt">Product</label>
                                        <select id="productID" class="form-select p-3">
										</select>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label class="form-label" style="font-size: 10pt">Quantity</label>
                                        <input type="number" id="quantity" class="form-control p-3" placeholder="Enter quantity">
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label class="form-label" style="font-size: 10pt">Total Price</label>
                                        <h2 id="totalPrice">0.00</h2>
                                        
                                    </div>
                                </div>
                            </form>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-success" id="saveSaleButton">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `;
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.#_addEvents()
        this.#_fetchProduct()
        this.#_fetchSales()
    }

    #_addEvents() {
        const addSaleButton = document.querySelector('#addSaleButton');
        if (addSaleButton) {
            addSaleButton.addEventListener('click', () => {
                const modalForm = document.getElementById('modalSalesForm');
                if (modalForm) modalForm.reset();
                this.saleID = null;
                const modal = new bootstrap.Modal(document.getElementById('salesModal'));
                modal.show();
            });
        }
        

        const saveSaleButton = document.getElementById('saveSaleButton')
        if (saveSaleButton) {
            saveSaleButton.addEventListener('click', async (e) => {
                e.preventDefault()
                const productID = document.getElementById('productID').value
                const quantity = document.getElementById('quantity').value
                const totalPrice = document.getElementById('totalPrice').innerHTML
                if (this.selectedProductQuantity < quantity) {
                    Swal.fire('Sales!', 'Product is out of stock', 'error')
                    return
                }
                if (productID && quantity) {
                    try {
                        let result = await saveSale({ productID, quantity, totalPrice: totalPrice, sellingPriceAtSale: this.selectedProductPrice, saleID: this.saleID });
                        if (result.success) {
                            Swal.fire('Sales', 'Sale saved successfully', 'success')
                            const modal = bootstrap.Modal.getInstance(document.getElementById('salesModal'))
                            modal.hide()
                            this.#_fetchSales()
                        } else {
                            Swal.fire('Sales', 'Error saving sale', 'error')
                        }
                    } catch (err) {
                        console.error(err.message)
                    }
                }
            })
        }

        const productSelect = document.getElementById('productID');
        if (productSelect) {
            productSelect.addEventListener('change', async (e) => {
                const selectedProduct = e.target.value;
                const productPrice = await fetchProductById(selectedProduct)
                this.selectedProductPrice = Number(productPrice.data.sellingPrice)
                this.selectedProductQuantity = Number(productPrice.data.quantity)
                this.#_calculateTotalPrice();
            })
        }


        const quantityInput = document.getElementById('quantity')
        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.#_calculateTotalPrice()
            })
        }

        const tableBody = document.querySelector('#salesTableBody');
        if (tableBody) {
            tableBody.addEventListener('click', (e) => {
                const target = e.target;
                const salesID = target.getAttribute('data-id');
                const action = target.getAttribute('data-action');
                if (action === 'edit') {
                    this.#_editSale(salesID);
                } else if (action === 'delete') {
                    this.#_deleteSale(salesID);
                }
            });
        }
    }


    async #_calculateTotalPrice() {
        const quantity = document.getElementById('quantity').value
        if (this.selectedProductQuantity > quantity) {
            const totalPrice = this.selectedProductPrice * Number(quantity)
            document.getElementById('totalPrice').innerHTML = totalPrice.toFixed(2)
        } else {
            Swal.fire('Sales!', 'Product is out of stock', 'error')
        }
    }
    

    async #_fetchSales() {
        try {
            let data = await fetchSales()
            if (data.success) {
                let html = ''
                data.data.forEach(sale => {
                    html += String.raw`
                        <tr>
                            <td>${sale.name}</td>
                            <td>${sale.sellingPriceAtSale}</td>
                            <td>${sale.saleQuantity}</td>
                            <td>${sale.totalPrice}</td>
                            <td>${new Date(sale.createdAt).toLocaleDateString()}</td>
                            <td class="text-end">
                                <button class="btn btn-secondary btn-sm" data-id="${sale.id}" data-action="edit">Edit</button>
                                <button class="btn btn-danger btn-sm" data-id="${sale.id}" data-action="delete">Delete</button>
                            </td>
                        </tr>`
                })
                document.getElementById('salesTableBody').innerHTML = html
            }
        } catch (error) {
            console.log('Error fetching sales: ', error.message)
        }
    }

    async #_fetchProduct() {
        try {
            let data = await getProducts()
            if (data.success) {
                let options = `<option value="" disabled selected>Select a product</option>`
                for (let i = 0; i < data.data.length; i++) {
                    options += `<option value="${data.data[i].id}">${data.data[i].name}</option>`
                }
                document.getElementById('productID').innerHTML = options
            }
        }  catch (err) {
            console.error(err.message)
        }
    }

    async #_editSale(saleID) {
        try {
            const salesData = await fetchSaleById(saleID);
            if (salesData.success) {
                const modalForm = document.getElementById('modalSalesForm');
                if (modalForm) {
                    document.getElementById('productID').value = salesData.data.productID;
                    document.getElementById('quantity').value = salesData.data.saleQuantity;
                    const productPrice = await fetchProductById(salesData.data.productID);
                    this.selectedProductPrice = Number(productPrice.data.sellingPrice);
                    const totalPrice = this.selectedProductPrice * Number(salesData.data.saleQuantity);
                    document.getElementById('totalPrice').innerHTML = totalPrice.toFixed(2);
                    this.saleID = salesData.data.id;
                    const modal = new bootstrap.Modal(document.getElementById('salesModal'));
                    modal.show();
                }
            }
        } catch (err) {
            console.error(err.message);
        }
    }
    
    
    async #_deleteSale(saleID) {
        try {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
            });
    
            if (confirmation.isConfirmed) {
                const result = await deleteSale(saleID)
                if (result.success) {
                    Swal.fire('Deleted!', 'Product sale has been deleted.', 'success');
                    this.#_fetchSales()
                } else {
                    Swal.fire('Error!', 'Failed to delete product sale.', 'error');
                }
            }
        } catch (err) {
            console.error(err.message);
        }
    }
}

customElements.define('sales-component', SalesComponent);
