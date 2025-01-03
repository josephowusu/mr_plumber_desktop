class SalesComponent extends HTMLElement {
    constructor() {
        super()
        this.saleID = null
        this.selectedProductPrice = 0
        this.selectedProductQuantity = 0
        this.saleItems = []
        this.#__init__()
    }

    #__init__() {
        const template = document.createElement('template')
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
                <div class="container-fluid py-4 scrollable-container">
                    <div class="row">
                        <div class="col-12">
                            <div class="card mb-4">
                                <div class="card-body px-0 pt-0 pb-2">
                                    <div class="table-responsive p-0">
                                        <table class="table align-items-center mb-0">
                                            <thead>
                                                <tr>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Customer Name</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Products</th>
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
                                        <label class="form-label" style="font-size: 10pt">Select Customer</label>
                                        <select id="customerSelect" class="form-select p-3">
										</select>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label class="form-label" style="font-size: 10pt">Product Category</label>
                                        <select id="productCategoryID" class="form-select p-3">
										</select>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label class="form-label" style="font-size: 10pt">Product</label>
                                        <select id="productID" class="form-select p-3">
										</select>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label class="form-label" style="font-size: 10pt">Quantity</label>
                                        <input type="number" step="0.01" id="quantity" class="form-control p-3" placeholder="Enter quantity">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <h6 class="font-weight-bolder mb-3">Sales List</h6>
                                        <table class="table align-items-center">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="salesItemsTableBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="col-12 mb-3">
                                    <button type="button" class="btn btn-primary w-100" id="addItemButton">Add Item</button>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label" style="font-size: 10pt">Total Price</label>
                                    <h2 id="totalPrice">0.00</h2>
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
        this.#_fetchCustomers()
        this.#_fetchProductCategory()
        // fetchProductByProductCategory
        const productCategoryID = document.getElementById('productCategoryID')
        if (productCategoryID) {
            productCategoryID.addEventListener('change', async (e) => {
                e.preventDefault()
                let id = e.target.value
                try {
                    let data = await fetchProductByProductCategory(id)
                    if (data.success) {
                        let options = `<option value="" disabled selected>Select a product</option>`
                        for (let i = 0; i < data.data.length; i++) {
                            let product = data.data[i]
                            options += String.raw`<option value="${product.id}" productname="${product.name}" productprice="${product.sellingPrice}">
                                ${product.name} - ${product.productCategoryName} (${product.quantity})
                            </option>`
                        }
                        document.getElementById('productID').innerHTML = options
                    }
                }  catch (err) {
                    console.error(err.message)
                }
            })
        }
    }

    #_addEvents() {
        const addSaleButton = document.querySelector('#addSaleButton')
        const addItemButton = this.querySelector('#addItemButton')

        if (addSaleButton) {
            addSaleButton.addEventListener('click', () => {
                const modalForm = document.getElementById('modalSalesForm');
                if (modalForm) modalForm.reset();
                this.saleID = null;
                const modal = new bootstrap.Modal(document.getElementById('salesModal'));
                modal.show()
            })
        }
        
        const saveSaleButton = document.getElementById('saveSaleButton')
        if (saveSaleButton) {
            saveSaleButton.addEventListener('click', async (e) => {
                e.preventDefault()
                const customerID = document.getElementById('customerSelect').value
                const totalPrice = parseFloat(document.getElementById('totalPrice').innerText)
                if (!customerID || this.saleItems.length === 0) {
                    Swal.fire('Sales', 'Please select a customer and add at least one item', 'error');
                    return
                }
                try {
                    let result = await saveSale({
                        customerID, items: JSON.stringify(this.saleItems),
                        totalPrice: totalPrice, status: 'completed',
                        saleID: this.saleID
                    })
                    if (result.success) {
                        Swal.fire('Sales', 'Sale saved successfully', 'success')
                        const modal = bootstrap.Modal.getInstance(document.getElementById('salesModal'))
                        modal.hide()
                        this.#_fetchSales()
                        this.saleID == null
                    } else {
                        Swal.fire('Sales', 'Error saving sale', 'error')
                    }
                } catch (err) {
                    console.error(err.message)
                    Swal.fire('Sales', err.message, 'error')
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
                    this.#_editSale(salesID)
                } else if (action === 'delete') {
                    this.#_deleteSale(salesID)
                }
            })
        }

        addItemButton.addEventListener('click', () => {
            const productSelect = this.querySelector('#productID')
            const quantityInput = this.querySelector('#quantity')
            const selectedOption = productSelect.options[productSelect.selectedIndex]
            const productname = selectedOption ? selectedOption.getAttribute('productname') : '';
            const productprice = selectedOption ? selectedOption.getAttribute('productprice') : 0;
            const product = productSelect.value
            const quantity = parseFloat(quantityInput.value)
            if (product && quantity && productname && productprice) {
                this.saleItems.push({ product, quantity, productname, productprice })
                this.#_renderSalesItems()
                this.#_resetItemInputs()
                this.#_calculateTotalPrice2()
            } else {
                Swal.fire('Error', 'Please select a product and enter a quantity.', 'error');
            }
        })
    }

    #_resetItemInputs() {
        this.querySelector('#productID').value = '';
        this.querySelector('#quantity').value = '';
        this.saleItems = []
    }

    #_renderSalesItems() {
        const salesItemsTableBody = this.querySelector('#salesItemsTableBody')
        salesItemsTableBody.innerHTML = ''
        this.saleItems.forEach((item, index) => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${item.productname}</td>
                <td>${item.quantity}</td>
                <td>${Number(item.quantity) * Number(item.productprice || 0)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" data-index="${index}">Remove</button>
                </td>
            `
            salesItemsTableBody.appendChild(row)
        })

        const removeButtons = salesItemsTableBody.querySelectorAll('button')
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index')
                this.saleItems.splice(index, 1)
                this.#_renderSalesItems()
                this.#_calculateTotalPrice2()
            })
        })
    }


    async #_calculateTotalPrice() {
        const quantity = document.getElementById('quantity').value
        if (this.selectedProductQuantity >= quantity) {
            // const totalPrice = this.selectedProductPrice * Number(quantity)
            // document.getElementById('totalPrice').innerHTML = totalPrice.toFixed(2)
        } else {
            Swal.fire('Sales!', 'Product is out of stock', 'error')
        }
    }

    async #_calculateTotalPrice2() {
        let total = 0
        for (let i = 0; i < this.saleItems.length; i++) {
            const item = this.saleItems[i]
            total += Number(item.quantity) * Number(item.productprice || 0)
        }
        document.getElementById('totalPrice').innerHTML = total.toFixed(2)
    }
    

    async #_fetchSales() {
        try {
            let data = await fetchSales()
            if (data.success) {
                let html = ''
                data.data.forEach(sale => {
                    const items = sale.items && Array.isArray(sale.items) ? sale.items : JSON.parse(sale.items)
                    html += String.raw`
                        <tr>
                            <td style="font-family: monRegular">${sale.name ? sale.name : 'No name'}</td>
                            <td style="font-family: monRegular">${Array.isArray(items) ? this.#_renderItems(items) : ''}</td>
                            <td style="font-family: monRegular">${new Date(sale.createdAt).toLocaleDateString()}</td>
                            <td class="text-end">
                                <button style="font-family: monRegular" class="btn btn-secondary btn-sm" data-id="${sale.id}" data-action="edit">Edit</button>
                                <button style="font-family: monRegular" class="btn btn-danger btn-sm" data-id="${sale.id}" data-action="delete">Delete</button>
                            </td>
                        </tr>`
                })
                document.getElementById('salesTableBody').innerHTML = html
            }
        } catch (error) {
            console.log('Error fetching sales: ', error.message)
        }
    }

    #_renderItems(items) {
        let html = '<ol>';
        let totalAmount = 0
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let total = Number(item.productprice) * Number(item.quantity);
            totalAmount += total;
            html += String.raw`
                <li style="font-family: monRegular">
                    ${item.productname} - Quantity: (${item.quantity}) = 
                    <span style="font-family: monBold">Total: ${formatCurrency(total)}</span>
                </li>
            `
        }
        const vatAmount = totalAmount * 0.15;
        const finalAmount = totalAmount + vatAmount;
        html += '</ol>';
        html += String.raw`
            <h6 style="font-family: monRegular">TOTAL AMOUNT: ${formatCurrency(totalAmount)}</h6>
            <h6 style="font-family: monRegular">VAT (15%): ${formatCurrency(vatAmount)}</h6>
            <h6 style="font-family: monRegular">FINAL AMOUNT: ${formatCurrency(finalAmount)}</h6>
        `
        return html
    }

    async #_fetchProduct() {
        try {
            let data = await getProducts();
            if (data.success) {
                let options = '<option>Select product</option>';
                for (let i = 0; i < data.data.length; i++) {
                    const product = data.data[i]
                    options += String.raw`
                        <option value="${product.id}" productname="${product.name}" productprice="${product.sellingPrice}">
                            ${product.name} - ${product.productCategoryName} (${product.quantity})
                        </option>
                    `
                }
                const productSelect = this.querySelector(`#productID`)
                if (productSelect) {
                    productSelect.innerHTML = options
                }
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    async #_fetchProductCategory() {
        try {
            let data = await fetchProductCategories()
            if (data.success) {
                let options = `<option value="" disabled selected>Filter by category</option>`
                for (let i = 0; i < data.data.length; i++) {
                    options += `<option value="${data.data[i].id}">${data.data[i].name}</option>`
                }
                document.getElementById('productCategoryID').innerHTML = options
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

    async #_fetchCustomers() {
        try {
            let data = await fetchCustomers();
            if (data.success) {
                let options = '<option>Select customer</option>';
                for (let i = 0; i < data.data.length; i++) {
                    const customer = data.data[i];
                    options += String.raw`
                        <option value="${customer.id}">${customer.name} (${customer.email || '~'}, ${customer.phone || '~'})</option>
                    `;
                }
                const customerSelect = this.querySelector(`#customerSelect`);
                if (customerSelect) {
                    customerSelect.innerHTML = options
                }
            }
        } catch (error) {
            console.error('Error fetching customers: ', error.message);
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
