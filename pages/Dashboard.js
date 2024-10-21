class DashboardComponent extends HTMLElement {

    constructor() {
        super()
        this.#__init__()
    }
    
    #__init__() {
        const template = document.createElement('template')
        template.innerHTML = (String.raw`
            <sidebar-component></sidebar-component>
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg" style="margin-left: 17.125rem;">
               <div class="container-fluid py-4">
                    <div class="row">
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Product Category</p>
                                                <h5 class="font-weight-bolder mb-0" id="productCategory">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-th-list" style="font-size: 20pt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Product</p>
                                                <h5 class="font-weight-bolder mb-0" id="product">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-box" style="font-size: 20pt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Stock</p>
                                                <h5 class="font-weight-bolder mb-0" id="stocking">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-cart-arrow-down" style="font-size: 20pt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Customers</p>
                                                <h5 class="font-weight-bolder mb-0" id="customers">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-user" style="font-size: 20pt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-3">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Total Sales</p>
                                                <h5 class="font-weight-bolder mb-0" id="totalSales">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-shopping-cart" style="font-size: 20pt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-3">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Total Sales Amount</p>
                                                <h5 class="font-weight-bolder mb-0" id="totalPurchasePrice">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-line-chart" style="font-size: 20pt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-3">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Total Profit Amount</p>
                                                <h5 class="font-weight-bolder mb-0" id="totalProfit">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-arrow-up" style="font-size: 20pt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-3">
                            <div class="card">
                                <div class="card-body p-3">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Total Loss Amount</p>
                                                <h5 class="font-weight-bolder mb-0" id="totalLoss">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-arrow-down" style="font-size: 20pt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-5" style="height: 500px; width: 100%">
                        <canvas id="profitLossChart" width="500" height="200"></canvas>
                    </div>
                </div>
            </main>
        `)
        this.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.#_addEvents()
        this.#_loadDashboardData()
        this.#_renderSalesChart()
    }

    #_addEvents(){
        // Add additional event listeners here
    }

    async #_fetchSalesData() {
        try {
            // Fetch all sales
            const salesResult = await fetchSales(); // Adjust this to your actual sales fetch function
            if (!salesResult.success) {
                throw new Error('Failed to fetch sales data');
            }
    
            const productsData = await getProducts();
            const productsMap = {}; // Create a map for quick access to product data
    
            for (let i = 0; i < productsData.data.length; i++) {
                const product = productsData.data[i];
                productsMap[product.id] = product;
            }
            const profitLossData = {}

            for (let j = 0; j < salesResult.data.length; j++) {
                const sale = salesResult.data[j];
                const product = productsMap[sale.productID];
    
                if (product) {
                    const month = new Date(sale.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
                    const total = product.purchasePrice * sale.quantity;
    
                    if (!profitLossData[month]) {
                        profitLossData[month] = { profit: 0, loss: 0 };
                    }
    
                    if (sale.totalPrice > total) {
                        profitLossData[month].profit += Number(sale.totalPrice - total);
                    } else {
                        profitLossData[month].loss += Number(total - sale.totalPrice);
                    }
                }
            }
    
            return profitLossData; // Return the structured profitLossData
        } catch (error) {
            console.error('Error fetching sales data: ', error.message);
            return {}; // Return an empty object in case of error
        }
    }
    

    async #_loadDashboardData() {
        try {
            // Fetch product categories
            const productCategoriesResult = await fetchProductCategories()
            if (productCategoriesResult.success) {
                document.getElementById('productCategory').textContent = productCategoriesResult.data.length || 0
            }

            // Fetch products
            const productsResult = await getProducts()
            if (productsResult.success) {
                document.getElementById('product').textContent = productsResult.data.length || 0
            }

            // Fetch stock
            const stockResult = await fetchProductStock()
            if (stockResult.success) {
                document.getElementById('stocking').textContent = stockResult.data.length || 0
            }

            // Fetch customers
            const customersResult = await fetchCustomers()
            if (customersResult.success) {
                document.getElementById('customers').textContent = customersResult.data.length || 0
            }

            const salesResultC = await fetchSales()
            if (salesResultC.success) {
                document.getElementById('totalSales').textContent = salesResultC.data.length || 0
            }

            const salesResult = await fetchSales(); // Adjust this to your actual sales fetch function
            if (salesResult.success) {
                const totalSales = salesResult.data.length || 0;
                document.getElementById('totalSales').textContent = totalSales;

                // Calculate total profit and loss
                let totalProfit = 0;
                let totalLoss = 0;

                for (let i = 0; i < salesResult.data.length; i++) {
                    const sale = salesResult.data[i];
                    let total = sale.purchasePrice * sale.quantity
                    if (sale.totalPrice > total) {
                        totalProfit += Number(sale.totalPrice - total)
                    } else {
                        totalLoss += Number(total - sale.totalPrice)
                    }
                }

                document.getElementById('totalProfit').textContent = totalProfit.toFixed(2);
                document.getElementById('totalLoss').textContent = totalLoss.toFixed(2);
            }


            const salesResult2 = await fetchSales(); // Adjust this to your actual sales fetch function
            if (salesResult2.success) {
                const totalSales = salesResult2.data.length || 0;
                document.getElementById('totalSales').textContent = totalSales

                const totalRevenue = salesResult2.data.reduce((sum, sale) => sum + sale.totalPrice, 0);
                document.getElementById('totalPurchasePrice').textContent = totalRevenue.toFixed(2); // Make sure to create an element with this ID
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        }
    }

    async #_renderSalesChart() {
        const profitLossData = await this.#_fetchSalesData();
    
        // Prepare data for the chart
        const labels = Object.keys(profitLossData); // Months
        const profits = labels.map(month => profitLossData[month].profit);
        const losses = labels.map(month => profitLossData[month].loss);

        // Create the line chart
        const ctx = document.getElementById('profitLossChart').getContext('2d');
        const profitLossChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Profit',
                        data: profits,
                        borderColor: 'green',
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: 'Loss',
                        data: losses,
                        borderColor: 'red',
                        fill: false,
                        tension: 0.1,
                    }
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });
    }

    disconnectedCallback() {
        // Clean up, if needed
    }

}

customElements.define('dashboard-component', DashboardComponent)
