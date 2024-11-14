class ProformaInvoiceComponent extends HTMLElement {
    constructor() {
        super();
        this.invoiceID = null;
        this.invoiceItems = []; // Initialize an array to store invoice items
        this.#__init();
    }

    #__init() {
        const template = document.createElement('template')
        template.innerHTML = (String.raw`
            <sidebar-component></sidebar-component>
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style="margin-left: 17.125rem;">
                <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
                    <div class="container-fluid py-1 px-3">
                        <h6 class="font-weight-bolder mb-0" style="font-family: monRegular !important; font-size: 14pt">Proforma Invoice Management</h6>
                        <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                            <button class="btn btn-success" style="margin-top: 10px;" id="addInvoiceButton">Add Proforma Invoice</button>
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
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7">Invoice Number</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7">Customer</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7">Date</th>
                                                    <th class="text-secondary opacity-7"></th>
                                                </tr>
                                            </thead>
                                            <tbody id="tableBodyInvoice"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade mt-5" id="invoiceModal" tabindex="-1" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Proforma Invoice Form</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form class="modal-body" id="modalInvoiceForm">
                                <div class="row">
                                    <div class="col-12 mb-3">
                                        <label for="customerSelect" class="form-label">Select Customer</label>
                                        <select id="customerSelect" class="form-control">
                                            <option selected disabled>Choose a customer</option>
                                        </select>
                                    </div>

                                    <div class="col-12 mb-3">
                                        <label for="productSelect" class="form-label">Select Product</label>
                                        <select id="productSelect" class="form-control">
                                            <option selected disabled>Choose a product</option>
                                        </select>
                                    </div>

                                    <div class="col-12 mb-3">
                                        <label for="quantityInput" class="form-label">Quantity</label>
                                        <input type="number" id="quantityInput" class="form-control" placeholder="Enter quantity" min="1">
                                    </div>
                                    <div class="col-12 mb-3">
                                        <button type="button" class="btn btn-primary w-100" id="addItemButton">Add Item</button>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-12">
                                        <h6 class="font-weight-bolder mb-3">Invoice Items</h6>
                                        <table class="table align-items-center">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="invoiceItemsTableBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </form>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-success" id="saveUpdateButtonInvoice">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `)
        this.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.#_bindEventHandlers()
        this.#_fetchInvoices()
        this.#_fetchProducts()
        this.#_fetchCustomers()
    }

    #_bindEventHandlers() {
        const addInvoiceButton = this.querySelector('#addInvoiceButton');
        const saveUpdateButton = this.querySelector('#saveUpdateButtonInvoice');
        const addItemButton = this.querySelector('#addItemButton');

        // Event listener for adding a new invoice
        addInvoiceButton.addEventListener('click', () => {
            this.invoiceID = null; // Reset the invoice ID for a new invoice
            this.invoiceItems = []; // Reset the invoice items
            this.#_resetForm();
            const modal = new bootstrap.Modal(document.getElementById('invoiceModal'));
            modal.show();
        });

        // Event listener for saving or updating an invoice
        saveUpdateButton.addEventListener('click', async () => {
            const customerID = this.querySelector('#customerSelect').value;
            if (!customerID) {
                Swal.fire('Error', 'Please select a customer.', 'error');
                return;
            }

            if (this.invoiceItems.length === 0) {
                Swal.fire('Error', 'Please add at least one item to the invoice.', 'error');
                return;
            }

            const data = {
                invoiceID: this.invoiceID,
                customerID: customerID,
                items: this.invoiceItems ? this.invoiceItems : [],
                status: 'draft',
            }

            const result = await saveInvoice(data)
            if (result.success) {
                Swal.fire('Success', 'Invoice saved successfully!', 'success')
                this.#_fetchInvoices()
                const modal = bootstrap.Modal.getInstance(document.getElementById('invoiceModal'))
                modal.hide()
            } else {
                Swal.fire('Error', 'Failed to save invoice: ' + result.error, 'error')
            }
        })

        addItemButton.addEventListener('click', () => {
            const productSelect = this.querySelector('#productSelect');
            const quantityInput = this.querySelector('#quantityInput');
            const selectedOption = productSelect.options[productSelect.selectedIndex]
            const productname = selectedOption ? selectedOption.getAttribute('productname') : '';
            const productprice = selectedOption ? selectedOption.getAttribute('productprice') : 0;
            const product = productSelect.value
            const quantity = parseInt(quantityInput.value)
            if (product && quantity && productname && productprice) {
                this.invoiceItems.push({ product, quantity, productname, productprice })
                this.#_renderInvoiceItems()
                this.#_resetItemInputs()
            } else {
                Swal.fire('Error', 'Please select a product and enter a quantity.', 'error');
            }
        })
    }

    async #_fetchInvoices() {
        const tableBody = this.querySelector('#tableBodyInvoice')
        tableBody.innerHTML = ''
        const result = await fetchInvoices()
        if (result.success && result.data.length > 0) {
            result.data.forEach((invoice) => {
                const row = document.createElement('tr')
                const items = invoice.items && Array.isArray(invoice.items) ? invoice.items : JSON.parse(invoice.items)
                row.innerHTML = String.raw`
                    <td>${invoice.id}</td>
                    <td>${invoice.customerName}</td>
                    <td>${Array.isArray(items) ? this.#_renderItems(items) : ''}</td>
                    <td>${invoice.createdAt}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-button" data-id="${invoice.id}">Delete</button>
                    </td>
                `
                tableBody.appendChild(row)
            })
            this.#_bindRowEventHandlers()
        }
    }

    #_renderItems(items) {
        let html = '<ol>'
        let totalAmount = 0
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            let total = Number(item.productprice) * Number(item.quantity)
            totalAmount += total
            html += String.raw`
                <li style="font-family: monRegular">${item.productname} - Quantity: (${item.quantity}) = <span style="font-family: monBold">Total: ${formatCurrency(total)}</span></li>
            `
        }
        html += '</ol>'
        html += String.raw`<h4 style="font-family: monRegular">TOTAL AMOUNT: ${formatCurrency(totalAmount)}</h4>`
        return html
    }

    #_bindRowEventHandlers() {
        const editButtons = this.querySelectorAll('.edit-button')
        const deleteButtons = this.querySelectorAll('.delete-button')
        editButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const invoiceID = button.getAttribute('data-id')
                const invoice = await fetchInvoiceById(invoiceID)
                if (invoice) {
                    this.invoiceID = invoice.id
                    document.getElementById('customerSelect').value = invoice.customerID
                    const modal = new bootstrap.Modal(document.getElementById('invoiceModal'))
                    modal.show()
                }
            })
        })

        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const invoiceID = button.getAttribute('data-id')
                const result = await deleteInvoice(invoiceID)
                if (result.success) {
                    Swal.fire('Success', 'Invoice deleted successfully!', 'success')
                    this.#_fetchInvoices()
                } else {
                    Swal.fire('Error', 'Failed to delete invoice: ' + result.error, 'error')
                }
            })
        })
    }

    async #_fetchProducts() {
        try {
            let data = await getProducts();
            if (data.success) {
                let options = '<option>Select product</option>';
                for (let i = 0; i < data.data.length; i++) {
                    const product = data.data[i];
                    options += String.raw`
                        <option value="${product.id}" productname="${product.name}" productprice="${product.sellingPrice}">
                            ${product.name} - ${product.productCategoryName} (${product.quantity})
                        </option>
                    `
                }
                const productSelect = this.querySelector(`#productSelect`);
                if (productSelect) {
                    productSelect.innerHTML = options
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
    
    #_resetForm() {
        this.querySelector('#customerSelect').value = '';
        this.querySelector('#productSelect').value = '';
        this.querySelector('#quantityInput').value = '';
        this.invoiceItems = [];
        this.#_renderInvoiceItems();
    }

    #_resetItemInputs() {
        this.querySelector('#productSelect').value = '';
        this.querySelector('#quantityInput').value = '';
    }

    #_renderInvoiceItems() {
        const invoiceItemsTableBody = this.querySelector('#invoiceItemsTableBody')
        invoiceItemsTableBody.innerHTML = ''
        this.invoiceItems.forEach((item, index) => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${item.productname}</td>
                <td>${item.quantity}</td>
                <td>
                    <button class="btn btn-danger btn-sm" data-index="${index}">Remove</button>
                </td>
            `
            invoiceItemsTableBody.appendChild(row)
        })

        const removeButtons = invoiceItemsTableBody.querySelectorAll('button')
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index')
                this.invoiceItems.splice(index, 1)
                this.#_renderInvoiceItems()
            })
        })
    }

    disConnectedCallback() {
        
    }

}

customElements.define('proforma-invoice-component', ProformaInvoiceComponent)
