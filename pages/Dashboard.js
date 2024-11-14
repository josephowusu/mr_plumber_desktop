class DashboardComponent extends HTMLElement {

    constructor() {
        super()
        this.#__init__()
    }
    
    #__init__() {
        const template = document.createElement('template')
        template.innerHTML = (String.raw`
            <sidebar-component></sidebar-component>
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg scrollable-container" style="margin-left: 17.125rem;height: 85vh!important">
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
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Total Revenue (GHS)</p>
                                                <h5 class="font-weight-bolder mb-0" id="totalRevenue">
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
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Total Cost (GHC)</p>
                                                <h5 class="font-weight-bolder mb-0" id="totalCost">
                                                    0
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="fa-solid fa-arrow-right" style="font-size: 20pt"></i>
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
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" style="font-family: monRegular !important; color: #0275d8">Total Profit (GHS)</p>
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
                    </div>
                    <div class="mt-5" style="height: 500px; width: 100%">
                        <div class="row">
                            <div class="col-8">
                                <canvas id="profitLossChart" width="1000" height="400"></canvas>
                            </div>
                            <div class="col">
                                <table id="profitLossTable" class="table table-striped table-bordered mt-4">
                                    <thead>
                                        <tr>
                                        <th>Date</th>
                                        <th>Revenue</th>
                                        <th>Cost</th>
                                        <th>Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                    </tbody>
                                </table>
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
        this.#_loadDashboardData()
        this.#_renderSalesChart()
    }

    #_addEvents(){
        // Add additional event listeners here
    }

    // async #_fetchSalesData() {
    //     try {
    //         // Fetch all sales
    //         const salesResult = await fetchSales(); // Adjust this to your actual sales fetch function
    //         if (!salesResult.success) {
    //             throw new Error('Failed to fetch sales data');
    //         }
    
    //         const productsData = await getProducts();
    //         const productsMap = {}; // Create a map for quick access to product data
    
    //         for (let i = 0; i < productsData.data.length; i++) {
    //             const product = productsData.data[i];
    //             productsMap[product.id] = product;
    //         }
    //         const profitLossData = {}

    //         for (let j = 0; j < salesResult.data.length; j++) {
    //             const sale = salesResult.data[j];
    //             const product = productsMap[sale.productID];
    
    //             if (product) {
    //                 const month = new Date(sale.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
    //                 const total = product.purchasePrice * sale.quantity;
    
    //                 if (!profitLossData[month]) {
    //                     profitLossData[month] = { profit: 0, loss: 0 };
    //                 }
    
    //                 if (sale.totalPrice > total) {
    //                     profitLossData[month].profit += Number(sale.totalPrice - total);
    //                 } else {
    //                     profitLossData[month].loss += Number(total - sale.totalPrice);
    //                 }
    //             }
    //         }
    
    //         return profitLossData; // Return the structured profitLossData
    //     } catch (error) {
    //         console.error('Error fetching sales data: ', error.message);
    //         return {}; // Return an empty object in case of error
    //     }
    // }

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
            
            const profitLossData = {};
    
            for (let j = 0; j < salesResult.data.length; j++) {
                const sale = salesResult.data[j];
                const product = productsMap[sale.productID];
    
                if (product) {
                    const date = new Date(sale.createdAt).toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
                    const total = product.purchasePrice * sale.quantity;
    
                    if (!profitLossData[date]) {
                        profitLossData[date] = { profit: 0, loss: 0 };
                    }
    
                    if (sale.totalPrice > total) {
                        profitLossData[date].profit += Number(sale.totalPrice - total);
                    } else {
                        profitLossData[date].loss += Number(total - sale.totalPrice);
                    }
                }
            }
    
            return profitLossData; // Return the structured profitLossData
        } catch (error) {
            console.error('Error fetching sales data: ', error.message);
            return {}; // Return an empty object in case of error
        }
    }

    async #_fetchSalesDataForChart() {
        try {
            const salesResult = await fetchSales();
            if (!salesResult.success) throw new Error('Failed to fetch sales data');
    
            const productsMap = (await getProducts()).data.reduce((map, product) => {
                map[product.id] = product;
                return map;
            }, {});
    
            const profitLossData = {};
    
            for (const sale of salesResult.data) {
                const items = JSON.parse(sale.items);
                const date = new Date(sale.createdAt).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    
                if (!profitLossData[date]) profitLossData[date] = { revenue: 0, cost: 0 };
    
                for (const item of items) {
                    const saleRevenue = Number(item.productprice) * Number(item.quantity);
                    const product = productsMap[item.product];
                    const saleCost = product ? product.purchasePrice * item.quantity : 0;
    
                    profitLossData[date].revenue += saleRevenue;
                    profitLossData[date].cost += saleCost;
                }
            }
            return profitLossData;
        } catch (error) {
            console.error('Error fetching sales data for chart:', error.message);
            return {};
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

            const salesResult = await fetchSales()
            if (salesResult.success) {
                let totalRevenue = 0
                let totalCost = 0
                let totalProfit = 0
                for (let i = 0; i < salesResult.data.length; i++) {
                    const sale = salesResult.data[i]
                    const items = JSON.parse(sale.items)
                    for (let j = 0; j < items.length; j++) {
                        const item = items[j]
                        const saleRevenue = Number(item.productprice) * Number(item.quantity)
                        const productResult = await fetchProductCostPrice(item.product)
                        const productCostPrice = productResult.success ? productResult.data.purchasePrice : 0
                        const saleCost = productCostPrice * item.quantity
                        totalRevenue += saleRevenue
                        totalCost += saleCost
                    }
                }
                
                // Calculate total profit
                totalProfit = totalRevenue - totalCost;
                
                // Display total revenue, total cost, and total profit
                // console.log('Total Revenue: ', totalRevenue.toFixed(2))
                // console.log('Total Cost: ', totalCost.toFixed(2))
                // console.log('Total Profit: ', totalProfit.toFixed(2))
                
                // You can also display it in your dashboard if needed
                document.getElementById('totalRevenue').textContent = totalRevenue.toFixed(2);
                document.getElementById('totalCost').textContent = totalCost.toFixed(2);
                document.getElementById('totalProfit').textContent = totalProfit.toFixed(2);
            }

        } catch (error) {
            console.error('Error loading dashboard data:', error)
        }
    }

    // async #_renderSalesChart() {
    //     const profitLossData = await this.#_fetchSalesData();
    
    //     // Prepare data for the chart
    //     const labels = Object.keys(profitLossData); // Months
    //     const profits = labels.map(month => profitLossData[month].profit);
    //     const losses = labels.map(month => profitLossData[month].loss);
    
    //     // Create the line chart
    //     const ctx = document.getElementById('profitLossChart').getContext('2d');
    //     const profitLossChart = new Chart(ctx, {
    //         type: 'line',
    //         data: {
    //             labels: labels,
    //             datasets: [
    //                 {
    //                     label: 'Profit',
    //                     data: profits,
    //                     borderColor: '#5cb85c',
    //                     fill: false,
    //                     tension: 0.1,
    //                 },
    //                 {
    //                     label: 'Loss',
    //                     data: losses,
    //                     borderColor: '#d9534f',
    //                     fill: false,
    //                     tension: 0.1,
    //                 }
    //             ],
    //         },
    //         options: {
    //             scales: {
    //                 y: {
    //                     beginAtZero: true,
    //                 }
    //             },
    //             plugins: {
    //                 legend: {
    //                     display: true,
    //                 },
    //                 tooltip: {
    //                     enabled: true,
    //                     mode: 'index', // This shows the tooltip for all datasets at the hovered index
    //                     intersect: false, // Tooltips will show on hover without needing to be directly over a point
    //                     callbacks: {
    //                         label: function(tooltipItem) {
    //                             const label = tooltipItem.dataset.label || '';
    //                             const value = tooltipItem.raw || 0;
    //                             return `${label}: GHC ${value.toFixed(2)}`; // Format the tooltip
    //                         }
    //                     }
    //                 },
    //             },
    //         }
    //     });
    //     this.#_populateProfitLossTable(profitLossData)
    // }

    async #_renderSalesChart() {
        const profitLossData = await this.#_fetchSalesDataForChart();
        const labels = Object.keys(profitLossData);
        const revenueData = labels.map(date => profitLossData[date].revenue);
        const costData = labels.map(date => profitLossData[date].cost);
    
        const ctx = document.getElementById('profitLossChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: revenueData,
                        borderColor: '#5cb85c',
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: 'Cost',
                        data: costData,
                        borderColor: '#d9534f',
                        fill: false,
                        tension: 0.1,
                    }
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Amount (GHC)' }
                    },
                    x: {
                        title: { display: true, text: 'Date' }
                    }
                },
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(tooltipItem) {
                                const label = tooltipItem.dataset.label || '';
                                const value = tooltipItem.raw || 0;
                                return `${label}: GHC ${value.toFixed(2)}`;
                            }
                        }
                    },
                },
            }
        });
        this.#_populateProfitLossTable(profitLossData)
    }
    

    // #_populateProfitLossTable(profitLossData) {
    //     const tableBody = document.querySelector('#profitLossTable tbody');
    //     tableBody.innerHTML = ''; // Clear previous data
    
    //     // Populate the table rows
    //     for (const date in profitLossData) {
    //         const row = document.createElement('tr');
    
    //         const dateCell = document.createElement('td');
    //         dateCell.textContent = date; // Date in format 'MM/DD/YYYY'
    //         row.appendChild(dateCell);
    
    //         const profitCell = document.createElement('td');
    //         profitCell.textContent = `$${profitLossData[date].profit.toFixed(2)}`;
    //         row.appendChild(profitCell);
    
    //         const lossCell = document.createElement('td');
    //         lossCell.textContent = `$${profitLossData[date].loss.toFixed(2)}`;
    //         row.appendChild(lossCell);
    
    //         tableBody.appendChild(row);
    //     }
    // }

    #_populateProfitLossTable(profitLossData) {
        const tableBody = document.querySelector('#profitLossTable tbody');
        tableBody.innerHTML = ''; // Clear previous data
    
        // Populate the table rows
        for (const date in profitLossData) {
            const row = document.createElement('tr');
    
            const dateCell = document.createElement('td');
            dateCell.textContent = date; // Date in format 'YYYY-MM-DD'
            row.appendChild(dateCell);
    
            const revenueCell = document.createElement('td');
            revenueCell.textContent = `GHC ${profitLossData[date].revenue.toFixed(2)}`;
            row.appendChild(revenueCell);
    
            const costCell = document.createElement('td');
            costCell.textContent = `GHC ${profitLossData[date].cost.toFixed(2)}`;
            row.appendChild(costCell);
    
            const profitCell = document.createElement('td');
            const profit = profitLossData[date].revenue - profitLossData[date].cost;
            profitCell.textContent = `GHC ${profit.toFixed(2)}`;
            row.appendChild(profitCell);
    
            tableBody.appendChild(row);
        }
    }
    
    

    disconnectedCallback() {
        // Clean up, if needed
    }

}

customElements.define('dashboard-component', DashboardComponent)
