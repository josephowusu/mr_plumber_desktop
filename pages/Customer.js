class CustomerComponent extends HTMLElement {

    constructor() {
        super()
        this.editingCustomerId = null
        this.#__init__()
    }
    
    #__init__() {
        const template = document.createElement('template')
        template.innerHTML = (String.raw`
            <sidebar-component></sidebar-component>
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style="margin-left: 17.125rem;">
                <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
                    <div class="container-fluid py-1 px-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                <li class="breadcrumb-item text-sm" style="font-family: monRegular !important; color: #0275d8">Pages</a></li>
                                <li class="breadcrumb-item text-sm active" aria-current="page" style="font-family: monRegular !important; color: #0275d8">Customer</li>
                            </ol>
                            <h6 class="font-weight-bolder mb-0" style="font-family: monRegular !important; font-size: 14pt">Customer Management</h6>
                        </nav>
                        <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                            <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                                <div class="input-group">
                                    <span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span>
                                    <input type="text" class="form-control" placeholder="Type here...">
                                </div>
                                <button class="btn btn-success" style="margin-top: 10px; margin-left: 10px" id="addCustomerButton">Add</button>
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
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Name</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Phone</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2" style="font-family: monRegular !important; font-size: 8pt">Email</th>
                                                    <th class="text-secondary opacity-7"></th>
                                                </tr>
                                            </thead>
                                            <tbody id="tableBodyCustomer"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade mt-5" id="customerModal" tabindex="-1" style="display: none;" aria-hidden="true">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalLabel1">Customer Form</h5>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark" style="color: #000; font-size: 12px;"></i></button>
							</div>
                            <form class="modal-body" id="modalCustomerForm">
								<div class="row">
									<div class="col-12 mb-3">
										<label for="customerName" class="form-label" style="font-size: 10pt">Customer Name</label>
										<input type="text" id="customerName" class="form-control p-3" placeholder="Enter customer name">
									</div>
                                    <div class="col-12 mb-3">
                                        <label for="customerPhone" class="form-label" style="font-size: 10pt">Phone</label>
                                        <input type="text" id="customerPhone" class="form-control p-3" placeholder="Enter phone number">
                                    </div>
                                    <div class="col-12 mb-3">
										<label for="customerEmail" class="form-label" style="font-size: 10pt">Email</label>
										<input type="email" id="customerEmail" class="form-control p-3" placeholder="Enter email">
									</div>
                                </div>
                            </form>
                            <div class="modal-footer">
								<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
									Close
								</button>
								<button type="button" class="btn btn-success" id="saveUpdateButtonCustomer">Save</button>
							</div>
                        </div>
                    </div>
                </div>
            </main>
        `)
        this.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.#_addEvents()
        this.#_fetchCustomers()
    }

    #_addEvents(){
        const addButton = document.querySelector(`#addCustomerButton`)
		if (addButton) {
			addButton.addEventListener('click', (e) => {
				e.preventDefault()
				const modalForm = document.getElementById('modalCustomerForm')
				if (modalForm) modalForm.reset()
				this.editingCustomerId = null
				const modal = new bootstrap.Modal(document.getElementById('customerModal'));
				modal.show()
			})
		}

        const saveUpdateButton = document.getElementById('saveUpdateButtonCustomer');
        if (saveUpdateButton) {
            saveUpdateButton.addEventListener('click', (e) => {
                e.preventDefault()
                const customerName = document.getElementById('customerName').value;
                const customerEmail = document.getElementById('customerEmail').value;
                const customerPhone = document.getElementById('customerPhone').value;
                if (customerName) {
                    ipcRenderer.send('saveCustomer', {customerName, customerEmail, customerPhone})
                }
            })
        }

        ipcRenderer.on('saveCustomerResponse', (event, response) => {
            if (response.success) {
                Swal.fire({
                    title: 'Customer',
                    text: 'Customer added successfully',
                    icon: 'success'
                })
                const modal = bootstrap.Modal.getInstance(document.getElementById('customerModal'));
                modal.hide()
                this.#_fetchCustomers()
            } else {
                Swal.fire({
                    title: 'Customer',
                    text: 'Error saving customer',
                    icon: 'error'
                })
            }
        })

        ipcRenderer.on('fetchCustomerResponse', (event, response) => {
            if (response.success) {
                let html = ``
                for (let i = 0; i < response.data.length; i++) {
                    const customer = response.data[i]
                    html += String.raw`
                        <tr>
                            <td style="font-family: monRegular !important; font-size: 8pt">${customer.name}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt">${customer.email}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt">${customer.phone}</td>
                            <td class="text-end">
                                <button class="btn btn-secondary btn-sm" style="font-family: monRegular !important; font-size: 8pt" data-id="${customer.id}" onclick="">Edit</button>
                                <button class="btn btn-danger btn-sm" style="font-family: monRegular !important; font-size: 8pt" data-id="${customer.id}" onclick="">Delete</button>
                            </td>
                        </tr>
                    `
                    const tableBody = document.querySelector(`#tableBodyCustomer`)
                    if (tableBody) tableBody.innerHTML = ''
                    const template = document.createElement('template')
                    template.innerHTML = html
					if (tableBody) tableBody.append(template.content.cloneNode(true))
                }
            } else {
                console.log('Error fetching customers: ', response.error);
            }
        })
    }

    #_fetchCustomers() {
        ipcRenderer.send('fetchCustomers')
    }

    disconnectedCallback() {
        
    }

}

customElements.define('customer-component', CustomerComponent)
