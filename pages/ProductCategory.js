class ProductCategoryComponent extends HTMLElement {
    constructor() {
        super();
        this.productCategoryID = null;
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
                                <li class="breadcrumb-item text-sm active" aria-current="page" style="font-family: monRegular !important; color: #0275d8">Product Category</li>
                            </ol>
                            <h6 class="font-weight-bolder mb-0" style="font-family: monRegular !important; font-size: 14pt">Product Category</h6>
                        </nav>
                        <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                            <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                                <div class="input-group">
                                    <span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span>
                                    <input type="text" class="form-control" placeholder="Type here...">
                                </div>
                                <button class="btn btn-success w-100" style="margin-top: 10px; margin-left: 10px" id="addProductCategoryButton">Add Category</button>
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
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Category Name</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2" style="font-family: monRegular !important; font-size: 8pt">Description</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Manufacturer</th>
                                                    <th class="text-uppercase text-secondary font-weight-bolder opacity-7" style="font-family: monRegular !important; font-size: 8pt">Status</th>
                                                    <th class="text-secondary opacity-7"></th>
                                                </tr>
                                            </thead>
                                            <tbody id="tableBodyProductCategory"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade mt-5" id="productCategoryModal" tabindex="-1" style="display: none;" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel1">Product Category Form</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark" style="color: #000; font-size: 12px;"></i></button>
                            </div>
                            <form class="modal-body" id="modalproductCategoryForm">
                                <div class="row">
                                    <div class="col-12 mb-3">
                                        <label for="categoryName" class="form-label" style="font-size: 10pt">Category Name</label>
                                        <input type="text" id="categoryName" class="form-control p-3" placeholder="Enter category name">
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label for="categoryDescription" class="form-label" style="font-size: 10pt">Description</label>
                                        <input type="text" id="categoryDescription" class="form-control p-3" placeholder="Description">
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label for="manufacturerName" class="form-label" style="font-size: 10pt">Manufacturer</label>
                                        <input type="text" id="manufacturerName" class="form-control p-3" placeholder="Enter manufacturer name">
                                    </div>
                                </div>
                            </form>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-success" id="saveUpdateButtonProductCategory">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `);
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.#_addEvents();
        this.#_fetchCategory();
    }

    #_addEvents() {
        const addButton = document.querySelector(`#addProductCategoryButton`);
        if (addButton) {
            addButton.addEventListener('click', (e) => {
                e.preventDefault();
                const modalForm = document.getElementById('modalproductCategoryForm');
                if (modalForm) modalForm.reset();
                this.productCategoryID = null; // Reset category ID for new entry
                const modal = new bootstrap.Modal(document.getElementById('productCategoryModal'));
                modal.show();
            });
        }

        const saveUpdateButton = document.getElementById('saveUpdateButtonProductCategory');
        if (saveUpdateButton) {
            saveUpdateButton.addEventListener('click', async (e) => {
                e.preventDefault();
                const categoryName = document.getElementById('categoryName').value;
                const categoryDescription = document.getElementById('categoryDescription').value;
                const manufacturerName = document.getElementById('manufacturerName').value;
                if (categoryName) {
                    try {
                        let save = await saveProductCategory({ categoryID: this.productCategoryID, categoryName, categoryDescription, manufacturerName });
                        if (save.success) {
                            Swal.fire({
                                title: 'Product Category',
                                text: 'Product category added/updated successfully',
                                icon: 'success'
                            });
                            const modal = bootstrap.Modal.getInstance(document.getElementById('productCategoryModal'));
                            modal.hide();
                            this.#_fetchCategory();
                        } else {
                            Swal.fire({
                                title: 'Product Category',
                                text: 'Error saving product category',
                                icon: 'error'
                            });
                        }
                    } catch (err) {
                        console.error(err.message);
                    }
                }
            });
        }

        const tableBody = document.querySelector(`#tableBodyProductCategory`);
        if (tableBody) {
            tableBody.addEventListener('click', (e) => {
                const target = e.target;
                const categoryId = target.getAttribute('data-id');
                const action = target.getAttribute('data-action');

                if (action === 'edit') {
                    this.#_editCategory(categoryId);
                } else if (action === 'delete') {
                    this.#_deleteCategory(categoryId);
                }
            });
        }
    }

    async #_fetchCategory() {
        try {
            let data = await fetchProductCategories();
            if (data.success) {
                let html = ``;
                for (let i = 0; i < data.data.length; i++) {
                    const category = data.data[i];
                    html += String.raw`
                        <tr>
                            <td style="font-family: monRegular !important; font-size: 8pt; color: #000">${category.name}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt; color: #000">${category.description}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt; color: #000">${category.manufacturer}</td>
                            <td style="font-family: monRegular !important; font-size: 8pt; color: #000">${category.status === "active" ? 'Active' : 'Inactive'}</td>
                            <td class="text-end">
                                <button class="btn btn-secondary btn-sm" style="font-family: monRegular !important; font-size: 8pt" data-id="${category.id}" data-action="edit">Edit</button>
                                <button class="btn btn-danger btn-sm" style="font-family: monRegular !important; font-size: 8pt" data-id="${category.id}" data-action="delete">Delete</button>
                            </td>
                        </tr>
                    `;
                }
                const tableBody = document.querySelector(`#tableBodyProductCategory`);
                if (tableBody) tableBody.innerHTML = '';
                const template = document.createElement('template');
                template.innerHTML = html;
                if (tableBody) tableBody.append(template.content.cloneNode(true));
            }
        } catch (error) {
            console.log('Error fetching product categories: ', error.message);
        }
    }

    async #_editCategory(categoryId) {
        try {
            const data = await fetchProductCategoryById(categoryId);
            if (data.success) {
                const { name, description, manufacturer } = data.data;
                document.getElementById('categoryName').value = name;
                document.getElementById('categoryDescription').value = description;
                document.getElementById('manufacturerName').value = manufacturer;
                this.productCategoryID = categoryId; // Set the current category ID for updates
                const modal = new bootstrap.Modal(document.getElementById('productCategoryModal'));
                modal.show();
            }
        } catch (error) {
            console.log('Error fetching category: ', error.message);
        }
    }

    async #_deleteCategory(categoryId) {
        const confirmDelete = await Swal.fire({
            title: 'Delete Category',
            text: 'Are you sure you want to delete this category?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmDelete.isConfirmed) {
            try {
                const deleteResponse = await deleteProductCategory(categoryId);
                if (deleteResponse.success) {
                    Swal.fire('Deleted!', 'Product category has been deleted.', 'success');
                    this.#_fetchCategory();
                } else {
                    Swal.fire('Error!', 'Failed to delete product category.', 'error');
                }
            } catch (error) {
                console.error('Error deleting category: ', error.message);
            }
        }
    }

    disconnectedCallback() {}
}

customElements.define('product-category-component', ProductCategoryComponent);
