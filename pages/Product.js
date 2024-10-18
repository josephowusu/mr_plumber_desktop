class ProductComponent extends HTMLElement {

    constructor() {
        super()
        this.editingProductId = null
        this.#__init__();
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
                                <li class="breadcrumb-item text-sm" style="font-family: monRegular !important; color: #0275d8">Pages</li>
                                <li class="breadcrumb-item text-sm active" aria-current="page" style="font-family: monRegular !important; color: #0275d8">Products</li>
                            </ol>
                            <h6 class="font-weight-bolder mb-0" style="font-family: monRegular !important; font-size: 14pt">Products</h6>
                        </nav>
                        <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                            <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                                <div class="input-group">
                                    <span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span>
                                    <input type="text" class="form-control" placeholder="Type here...">
                                </div>
                                <button class="btn btn-success" style="margin-top: 10px; margin-left: 10px" id="addProductButton">Add</button>
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
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Image</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Product Name</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Category</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Quantity</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Status</th>
                                                    <th class="text-secondary opacity-7"></th>
                                                </tr>
                                            </thead>
                                            <tbody id="tableBodyProduct"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade mt-5" id="productModal" tabindex="-1" style="display: none;" aria-hidden="true">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalLabel1">Product Form</h5>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark" style="color: #000; font-size: 12px;"></i></button>
							</div>
                            <form class="modal-body" id="modalProductForm">
								<div class="row">
									<div class="col-12 mb-3">
										<label for="nameBasic" class="form-label" style="font-size: 10pt">Product Name</label>
										<input type="text" id="productName" class="form-control p-3" placeholder="Enter product name">
									</div>
                                    <div class="col-12 mb-3">
										<label for="productDescription" class="form-label" style="font-size: 10pt">Description</label>
										<input type="text" id="productDescription" class="form-control p-3" placeholder="Enter product description">
									</div>
                                    <div class="col-12 mb-3">
										<label for="productCategory" class="form-label" style="font-size: 10pt">Category</label>
										<select id="productCategory" class="form-select p-3">
										</select>
									</div>
                                    <div class="col-12 mb-3">
										<label for="purchasePrice" class="form-label" style="font-size: 10pt">Purchase Price</label>
										<input type="number" id="purchasePrice" class="form-control p-3" placeholder="Enter purchase price">
									</div>
                                    <div class="col-12 mb-3">
										<label for="sellingPrice" class="form-label" style="font-size: 10pt">Selling Price</label>
										<input type="number" id="sellingPrice" class="form-control p-3" placeholder="Enter selling price">
									</div>
                                </div>
                            </form>
                            <div class="modal-footer">
								<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
								<button type="button" class="btn btn-success" id="saveUpdateButtonProduct">Save</button>
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
        this.#_fetchProducts()
        this.#_fetchCategories() // To populate product category dropdown
    }

    #_addEvents() {
        const addButton = document.querySelector(`#addProductButton`)
		if (addButton) {
			addButton.addEventListener('click', (e) => {
				e.preventDefault()
				const modalForm = document.getElementById('modalProductForm')
				if (modalForm) modalForm.reset()
				this.editingProductId = null
				const modal = new bootstrap.Modal(document.getElementById('productModal'))
				modal.show()
			})
		}

        const saveUpdateButton = document.getElementById('saveUpdateButtonProduct')
        if (saveUpdateButton) {
            saveUpdateButton.addEventListener('click', (e) => {
                e.preventDefault()
                const productName = document.getElementById('productName').value
                const productDescription = document.getElementById('productDescription').value
                const productCategoryID = document.getElementById('productCategory').value
                const purchasePrice = document.getElementById('purchasePrice').value
                const sellingPrice = document.getElementById('sellingPrice').value
                if (productName && productCategoryID) {
                    ipcRenderer.send('saveProduct', { productName, productDescription, productCategoryID, purchasePrice, sellingPrice })
                }
            })
        }

        ipcRenderer.on('saveProductResponse', (event, response) => {
            if (response.success) {
                Swal.fire({
                    title: 'Product',
                    text: 'Product added successfully',
                    icon: 'success'
                })
                const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'))
                modal.hide()
                this.#_fetchProducts()
            } else {
                Swal.fire({
                    title: 'Product',
                    text: 'Error saving product',
                    icon: 'error'
                })
            }
        })

        

        ipcRenderer.on('fetchProductsResponse', (event, response) => {
            if (response.success) {
                let html = ``
                for (let i = 0; i < response.data.length; i++) {
                    const product = response.data[i]
                    console.log(product)
                    html += String.raw`
                        <tr>
                            <td style="font-family: monRegular !important; font-size: 8pt"><img src="${product.image}" alt="${product.name}" width="50"></td>
                            <td style="font-family: monRegular !important; font-size: 8pt">${product.name}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt">${product.productCategoryName}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt">${product.quantity}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt">${product.status}</td>
                            <td class="text-right">
                                <button class="btn btn-warning btn-sm" onclick="editProduct('${product.id}')">Edit</button>
                            </td>
                        </tr>
                    `
                }
                document.getElementById('tableBodyProduct').innerHTML = html
            }
        })
    }

    #_fetchProducts() {
        ipcRenderer.send('fetchProducts')
    }

    #_fetchCategories() {
        ipcRenderer.send('fetchProductCategories')
        ipcRenderer.on('fetchProductCategoriesResponse', (event, response) => {
            if (response.success) {
                let options = `<option value="" disabled selected>Select a category</option>`
                for (let i = 0; i < response.data.length; i++) {
                    options += `<option value="${response.data[i].id}">${response.data[i].name}</option>`
                }
                document.getElementById('productCategory').innerHTML = options
            }
        })
    }
}

customElements.define('product-component', ProductComponent)
