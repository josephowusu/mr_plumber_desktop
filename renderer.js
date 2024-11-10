const { ipcRenderer } = require('electron')
const Swal = require('sweetalert2')
const { storeData, fetchData, clearStorage, clearCookies, deleteData } = require('./lib/Helper')
const sqlite3 = require('sqlite3').verbose()
const path = require('node:path')
const fs = require('node:fs')

const page_component = {
    login: "<login-component></login-component>",
    register: "<register-component></register-component>",
    dashboard: "<dashboard-component></dashboard-component>",
    productCategory: "<product-category-component></product-category-component>",
    customer: "<customer-component></customer-component>",
    stock: "<product-stock-component></product-stock-component>",
    product: "<product-component></product-component>",
    sales: "<sales-component></sales-component>",
    invoice: "<proforma-invoice-component></proforma-invoice-component>",
    productList: "<product-list-component></product-list-component>"
}

const dbDirectory = 'C:\\database';

if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true })
}

const dbPath = path.join(dbDirectory, 'mr_plumber_shop.sqlite')


function loadPage(page) {
    let session = fetchData('session')
    document.getElementById('logout').style.display = session ? "block" : 'none'
    const contentDiv = document.getElementById('contentWorkingArea')
    if (contentDiv && page_component[page]) {
        contentDiv.innerHTML = page_component[page]
    } else {
        console.log('Error', 'loading page:', 'Redering page not found')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logout').style.display = "none"
    let session = fetchData('session')
    let lastPage = fetchData('lastPage')
    if (session) {
        document.getElementById('logout').style.display = "block"
        loadPage(lastPage ? lastPage : 'dashboard')
    } else {
        document.getElementById('logout').style.display = "none"
        loadPage('login')
    }
})

document.getElementById('minimize').addEventListener('click', () => {
    ipcRenderer.send('minimize-window')
})
  
document.getElementById('maximize').addEventListener('click', () => {
    ipcRenderer.send('maximize-window')
})
  
document.getElementById('close').addEventListener('click', () => {
    ipcRenderer.send('close-window')
})

ipcRenderer.on('window-maximized', () => {
    document.getElementById('maximize').innerHTML = '<i class="fa-solid fa-minimize"></i>';
})

ipcRenderer.on('window-unmaximized', () => {
    document.getElementById('maximize').innerHTML = '<i class="fa-solid fa-maximize"></i>';
})

const loginUserButtonAction = async (username, password) => {
    ipcRenderer.send('login-user-account', {username, password})
}

ipcRenderer.on('login-user-account-status', (event, account) => {
    Swal.fire({
        title: 'Login',
        text: account.message,
        icon: account.status
    })
    if (account.status == "success") {
        storeData('session', account.data)
        setTimeout(() => {
            loadPage('dashboard')
        }, 500)
    }
})

function exportDatabase() {
    ipcRenderer.send('export-db')
}

document.getElementById('exportButton').addEventListener('click', () => {
    exportDatabase()
    Swal.fire({
        title: 'Exporting...',
        text: 'Your database is being exported.',
        icon: 'info',
        showConfirmButton: false,
        timer: 1500,
    });
});


ipcRenderer.on('export-success', () => {
    Swal.fire({
        title: 'Success!',
        text: 'Database exported successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    })
})

document.getElementById('logout').addEventListener('click', () => {
    document.getElementById('logout').style.display = "none"
    clearCookies()
    deleteData('session')
    clearStorage()
    loadPage('login')
})


const database = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log("error: ", "Connection:", err.message);
    } else {
        console.log('Database Connected')
    }
})

const getProducts = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT productCategory.*, products.*, productCategory.name AS productCategoryName 
            FROM products 
            LEFT JOIN productCategory ON productCategory.id = products.productCategoryID
        `;
        database.all(query, [], (err, rows) => {
            if (err) {
                reject({ success: false, message: err.message });
            } else {
                resolve({ success: true, data: rows });
            }
        })
    })
}

const fetchProductById = (productId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT productCategory.*, products.*, productCategory.name AS productCategoryName
            FROM products 
            LEFT JOIN productCategory ON productCategory.id = products.productCategoryID
            WHERE products.id = ?`;
        database.get(query, [productId], (err, row) => {
            if (err) {
                console.log('Error fetching product by ID: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Product fetched successfully!', row);
                resolve({ success: true, data: row });
            }
        });
    });
}

const fetchProductByProductCategory = (productCategoryId) => {
    console.log({productCategoryId})
    return new Promise((resolve, reject) => {
        const query = `SELECT productCategory.*, products.*, productCategory.name AS productCategoryName
            FROM products 
            LEFT JOIN productCategory ON productCategory.id = products.productCategoryID
            WHERE products.productCategoryID = ?`;
        database.all(query, [productCategoryId], (err, row) => {
            if (err) {
                console.log('Error fetching product by ID: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Product fetched successfully!', row);
                resolve({ success: true, data: row });
            }
        })
    })
}

const deleteProduct = (productId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM products WHERE id = ?`;

        database.run(query, [productId], function (err) {
            if (err) {
                console.log('Error deleting product: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Product deleted successfully!');
                resolve({ success: true });
            }
        })
    })
}

const saveProduct = (data) => {
    return new Promise((resolve, reject) => {
        const query = data.productID 
            ? `UPDATE products SET name = ?, description = ?, productCategoryID = ? WHERE products.id = ?`
            : `INSERT INTO products (name, quantity, description, productCategoryID, purchasePrice, sellingPrice, status, createdAt) VALUES (?, 0, ?, ?, 0, 0, 'active', CURRENT_TIMESTAMP)`;
        
        const params = data.productID 
            ? [data.name, data.description || '', data.category || null, data.productID]
            : [data.name, data.description || '', data.category || null]

        database.run(query, params, function (err) {
            if (err) {
                console.log(`Error ${data.productID ? 'updating' : 'inserting'} product: `, err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log(`Product ${data.productID ? 'updated' : 'inserted'} successfully!`);
                resolve({ success: true, lastID: this.lastID });
            }
        })
    })
}

const updateProduct = (data) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE products SET name = ?, description = ?, productCategoryID = ?, quantity = ?, purchasePrice = ?, sellingPrice = ? WHERE products.id = ?`
        const params = [data.name, data.description || '', data.category || null, data.quantity || 0, data.price || 0, data.sellingPrice || 0, data.productID]
        database.run(query, params, function (err) {
            if (err) {
                console.log(`Error ${data.productID ? 'updating' : 'inserting'} product: `, err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log(`Product ${data.productID ? 'updated' : 'inserted'} successfully!`);
                resolve({ success: true, lastID: this.lastID });
            }
        })
    })
}

const saveProductCategory = (data) => {
    return new Promise((resolve, reject) => {
        if (data.categoryID) {
            // If categoryID is provided, update the existing category
            const updateQuery = `UPDATE productCategory 
                                 SET name = ?, description = ?, manufacturer = ?, status = ?
                                 WHERE id = ?`;

            database.run(updateQuery, [data.categoryName || '', data.categoryDescription || '', data.manufacturerName || '', data.status || 'active', data.categoryID], function (err) {
                if (err) {
                    console.log('Error updating product category: ', err.message);
                    reject({ success: false, error: err.message });
                } else {
                    console.log('Product category updated successfully!');
                    resolve({ success: true });
                }
            });
        } else {
            // If no categoryID, insert a new category
            const insertQuery = `INSERT INTO productCategory (name, description, manufacturer, status, createdAt) 
                                 VALUES (?, ?, ?, 'active', CURRENT_TIMESTAMP)`;

            database.run(insertQuery, [data.categoryName || '', data.categoryDescription || '', data.manufacturerName || ''], function (err) {
                if (err) {
                    console.log('Error inserting product category: ', err.message);
                    reject({ success: false, error: err.message });
                } else {
                    console.log('Product category inserted successfully!');
                    resolve({ success: true, lastID: this.lastID });
                }
            });
        }
    });
}

const fetchProductCategories = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM productCategory`;
        database.all(query, [], (err, rows) => {
            if (err) {
                console.log('Error fetching product categories: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Product categories fetched successfully!');
                resolve({ success: true, data: rows });
            }
        });
    });
};

const fetchProductCategoryById = (productCategoryID) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM productCategory WHERE id = ?`;

        database.get(query, [productCategoryID], (err, row) => {
            if (err) {
                console.log('Error fetching product category by ID: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Product category fetched successfully!', row);
                resolve({ success: true, data: row });
            }
        });
    });
};

const deleteProductCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM productCategory WHERE id = ?`;

        database.run(query, [categoryId], function (err) {
            if (err) {
                console.log('Error deleting product category: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Product category deleted successfully!');
                resolve({ success: true });
            }
        });
    });
};

// const deleteProductStock = (stockID) => {
//     return new Promise((resolve, reject) => {
//         const query = `DELETE FROM productStock WHERE id = ?`;

//         database.run(query, [stockID], function (err) {
//             if (err) {
//                 console.log('Error deleting product stock: ', err.message);
//                 reject({ success: false, error: err.message });
//             } else {
//                 console.log('Product stock deleted successfully!');
//                 resolve({ success: true });
//             }
//         });
//     });
// };

const deleteProductStock = (stockID) => {
    return new Promise((resolve, reject) => {
        const fetchStockQuery = `SELECT productID, quantity FROM productStock WHERE id = ?`
        database.get(fetchStockQuery, [stockID], (err, stock) => {
            if (err) {
                console.log('Error fetching product stock: ', err.message)
                reject({ success: false, error: err.message })
            } else if (stock) {
                const { productID, quantity } = stock
                const updateProductQuery = `UPDATE products SET quantity = quantity - ? WHERE id = ?`
                database.run(updateProductQuery, [quantity, productID], function (err) {
                    if (err) {
                        console.log('Error updating product quantity: ', err.message)
                        reject({ success: false, error: err.message })
                    } else {
                        const deleteStockQuery = `DELETE FROM productStock WHERE id = ?`
                        database.run(deleteStockQuery, [stockID], function (err) {
                            if (err) {
                                console.log('Error deleting product stock: ', err.message)
                                reject({ success: false, error: err.message })
                            } else {
                                console.log('Product stock deleted successfully!')
                                resolve({ success: true })
                            }
                        })
                    }
                })
            } else {
                reject({ success: false, error: "Stock entry not found." })
            }
        })
    })
}


const saveCustomer = (data) => {
    return new Promise((resolve, reject) => {
        if (data.customerID) {
            const updateQuery = `UPDATE customers 
                                 SET name = ?, phone = ?, email = ?, status = ?
                                 WHERE id = ?`;
            database.run(updateQuery, [data.customerName || '', data.customerPhone || '', data.customerEmail || '', data.status || 'active', data.customerID], function (err) {
                if (err) {
                    console.log('Error updating customer: ', err.message);
                    reject({ success: false, error: err.message });
                } else {
                    console.log('Customer updated successfully!');
                    resolve({ success: true });
                }
            });
        } else {
            // If no customerID is provided, insert a new customer
            const insertQuery = `INSERT INTO customers (name, phone, email, status, createdAt) 
                                 VALUES (?, ?, ?, 'active', CURRENT_TIMESTAMP)`;

            database.run(insertQuery, [data.customerName || '', data.customerPhone || '', data.customerEmail || ''], function (err) {
                if (err) {
                    console.log('Error inserting customer: ', err.message);
                    reject({ success: false, error: err.message });
                } else {
                    console.log('Customer inserted successfully!');
                    resolve({ success: true, lastID: this.lastID });
                }
            });
        }
    });
}

const fetchCustomers = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM customers`;
        database.all(query, [], (err, rows) => {
            console.log(rows)
            if (err) {
                console.log('Error fetching customers: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Customers fetched successfully!');
                resolve({ success: true, data: rows });
            }
        });
    });
};

const fetchCustomerById = (customerID) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM customers WHERE id = ?`;
        database.get(query, [customerID], (err, row) => {
            if (err) {
                console.log('Error fetching customer by ID: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Customer fetched successfully!', row);
                resolve({ success: true, data: row });
            }
        });
    });
};

const deleteCustomer = (customerID) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM customers WHERE id = ?`;

        database.run(query, [customerID], function (err) {
            if (err) {
                console.log('Error deleting customer: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('customer deleted successfully!');
                resolve({ success: true });
            }
        });
    });
};

const fetchProductStockById = (stockID) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM productStock WHERE id = ?`;

        database.get(query, [stockID], (err, row) => {
            if (err) {
                console.log('Error fetching product stock by ID: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Product stock fetched successfully!', row);
                resolve({ success: true, data: row });
            }
        });
    });
};

const saveProductStock = (data) => {
    return new Promise((resolve, reject) => {
        if (data.stockID) {
            const fetchStockQuery = `SELECT productID, quantity FROM productStock WHERE id = ?`;
            database.get(fetchStockQuery, [data.stockID], (err, stock) => {
                if (err) {
                    console.log('Error fetching product stock: ', err.message);
                    reject({ success: false, error: err.message });
                } else if (stock) {
                    const oldQuantity = stock.quantity;
                    const productID = stock.productID;
                    const updateProductQuery = `UPDATE products SET quantity = quantity - ? + ?, purchasePrice = ?, sellingPrice = ? WHERE id = ?`;
                    database.run(updateProductQuery, [oldQuantity, data.quantity, data.price, data.sellingPrice, productID], function (err) {
                        if (err) {
                            console.log('Error updating product quantity: ', err.message);
                            reject({ success: false, error: err.message });
                        } else {
                            const updateStockQuery = `UPDATE productStock SET quantity = ?, supplier = ?, purchasePrice = ?, sellingPrice = ? WHERE id = ?`;
                            database.run(updateStockQuery, [data.quantity, data.supplier, data.price, data.sellingPrice, data.productID], function (err) {
                                if (err) {
                                    console.log('Error updating product stock: ', err.message)
                                    reject({ success: false, error: err.message })
                                } else {
                                    console.log('Product stock updated successfully!')
                                    resolve({ success: true })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            const insertStockQuery = `INSERT INTO productStock (productID, quantity, supplier, purchasePrice, sellingPrice, status, createdAt) 
                                      VALUES (?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)`
            database.run(insertStockQuery, [data.productID, data.quantity, data.supplier, data.price, data.sellingPrice], function (err) {
                if (err) {
                    console.log('Error inserting product stock: ', err.message)
                    reject({ success: false, error: err.message })
                } else {
                    const updateProductQuery = `UPDATE products SET quantity = quantity + ?, purchasePrice = ?, sellingPrice = ? WHERE id = ?`;
                    database.run(updateProductQuery, [data.quantity, data.price, data.sellingPrice, data.productID], function (err) {
                        if (err) {
                            console.log('Error updating product quantity: ', err.message)
                            reject({ success: false, error: err.message })
                        } else {
                            console.log('Product stock and quantity updated successfully!')
                            resolve({ success: true, lastID: this.lastID })
                        }
                    });
                }
            });
        }
    });
};

// const saveProductStock = (data) => {
//     return new Promise((resolve, reject) => {
//         if (data.stockID) {
//             const fetchStockQuery = `SELECT productID, quantity FROM productStock WHERE id = ?`
//             database.get(fetchStockQuery, [data.stockID], (err, stock) => {
//                 if (err) {
//                     console.log('Error fetching product stock: ', err.message);
//                     reject({ success: false, error: err.message });
//                 } else if (stock) {
//                     const oldQuantity = stock.quantity
//                     const productID = stock.productID
//                     const updateProductQuery = `UPDATE products SET quantity = quantity - ? + ? WHERE id = ?`;
//                     database.run(updateProductQuery, [oldQuantity, data.quantity, productID], function (err) {
//                         if (err) {
//                             console.log('Error updating product quantity: ', err.message);
//                             reject({ success: false, error: err.message });
//                         } else {
//                             // Update the stock quantity
//                             const updateStockQuery = `UPDATE productStock SET quantity = ? WHERE id = ?`;
//                             database.run(updateStockQuery, [data.quantity, data.stockID], function (err) {
//                                 if (err) {
//                                     console.log('Error updating product stock: ', err.message);
//                                     reject({ success: false, error: err.message });
//                                 } else {
//                                     console.log('Product stock updated successfully!');
//                                     resolve({ success: true });
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         } else {
//             // No stockID means this is a new stock, so we insert it
//             const insertStockQuery = `INSERT INTO productStock (productID, quantity, status, createdAt) 
//                                       VALUES (?, ?, 'active', CURRENT_TIMESTAMP)`;
//             database.run(insertStockQuery, [data.productID, data.quantity], function (err) {
//                 if (err) {
//                     console.log('Error inserting product stock: ', err.message);
//                     reject({ success: false, error: err.message });
//                 } else {
//                     // Update product quantity by adding the new stock quantity
//                     const updateProductQuery = `UPDATE products SET quantity = quantity + ? WHERE id = ?`;
//                     database.run(updateProductQuery, [data.quantity, data.productID], function (err) {
//                         if (err) {
//                             console.log('Error updating product quantity: ', err.message);
//                             reject({ success: false, error: err.message });
//                         } else {
//                             console.log('Product stock and quantity updated successfully!');
//                             resolve({ success: true, lastID: this.lastID });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// }

const fetchProductStock = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT productCategory.*, products.*, productCategory.name AS productCategoryName, productStock.* 
                       FROM productStock 
                       LEFT JOIN products ON products.id = productStock.productID
                       LEFT JOIN productCategory ON productCategory.id = products.productCategoryID
                    ORDER BY productStock.id DESC`
        database.all(query, [], (err, rows) => {
            if (err) {
                console.log('Error fetching product stock: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Product stock fetched successfully!');
                resolve({ success: true, data: rows });
            }
        });
    });
};

const fetchSaleById = (saleID) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT productCategory.*, products.*, productCategory.name AS productCategoryName, sales.quantity AS saleQuantity, sales.* 
                       FROM sales 
                       LEFT JOIN products ON products.id = sales.productID
                       LEFT JOIN productCategory ON productCategory.id = products.productCategoryID WHERE sales.id = ?`;
        database.get(query, [saleID], (err, row) => {
            if (err) {
                console.log('Error fetching sale by ID: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Sale fetched successfully!', row);
                resolve({ success: true, data: row });
            }
        });
    });
};

const fetchSales = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT productCategory.*, products.*, productCategory.name AS productCategoryName, sales.quantity AS saleQuantity, sales.* 
                       FROM sales 
                       LEFT JOIN products ON products.id = sales.productID
                       LEFT JOIN productCategory ON productCategory.id = products.productCategoryID
                       ORDER BY sales.id DESC`
        database.all(query, [], (err, rows) => {
            if (err) {
                console.log('Error fetching sales: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Sales fetched successfully!');
                resolve({ success: true, data: rows });
            }
        });
    });
};

const saveSale = (data) => {
    return new Promise((resolve, reject) => {
        if (data.saleID) {
            const fetchSaleQuery = `SELECT productID, quantity, sellingPriceAtSale FROM sales WHERE id = ?`;
            database.get(fetchSaleQuery, [data.saleID], (err, sale) => {
                if (err) {
                    console.log('Error fetching sale: ', err.message)
                    reject({ success: false, error: err.message })
                } else if (sale) {
                    const oldQuantity = sale.quantity
                    const productID = sale.productID
                    const updateProductQuery = `UPDATE products SET quantity = quantity + ? - ? WHERE id = ?`;
                    database.run(updateProductQuery, [oldQuantity, data.quantity, productID], function (err) {
                        if (err) {
                            console.log('Error updating product quantity: ', err.message);
                            reject({ success: false, error: err.message });
                        } else {
                            const updateSaleQuery = `UPDATE sales SET quantity = ?, totalPrice = ?, sellingPriceAtSale = ? WHERE id = ?`;
                            database.run(updateSaleQuery, [data.quantity, data.totalPrice, data.sellingPriceAtSale, data.saleID], function (err) {
                                if (err) {
                                    console.log('Error updating sale: ', err.message);
                                    reject({ success: false, error: err.message });
                                } else {
                                    console.log('Sale updated successfully!');
                                    resolve({ success: true });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            // No saleID means this is a new sale, so we insert it
            const insertSaleQuery = `INSERT INTO sales (productID, quantity, totalPrice, sellingPriceAtSale, createdAt) 
                                     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
            database.run(insertSaleQuery, [data.productID, data.quantity, data.totalPrice, data.sellingPriceAtSale], function (err) {
                if (err) {
                    console.log('Error inserting sale: ', err.message);
                    reject({ success: false, error: err.message });
                } else {
                    // Update product quantity by subtracting the sale quantity
                    const updateProductQuery = `UPDATE products SET quantity = quantity - ? WHERE id = ?`;
                    database.run(updateProductQuery, [data.quantity, data.productID], function (err) {
                        if (err) {
                            console.log('Error updating product quantity: ', err.message);
                            reject({ success: false, error: err.message });
                        } else {
                            console.log('Sale and product quantity updated successfully!');
                            resolve({ success: true, lastID: this.lastID });
                        }
                    });
                }
            });
        }
    });
};


const deleteSale = (salesID) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM sales WHERE id = ?`;

        database.run(query, [salesID], function (err) {
            if (err) {
                console.log('Error deleting sale: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Sale deleted successfully!');
                resolve({ success: true });
            }
        });
    });
};

function formatCurrency(amount, locale = 'en-US', currency = 'GHS') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount);
}


const fetchInvoices = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT customers.name AS customerName, invoices.* FROM invoices 
                       LEFT JOIN customers ON customers.id = invoices.customerID
                       ORDER BY invoices.id DESC`;
        database.all(query, [], (err, rows) => {
            if (err) {
                console.log('Error fetching invoices: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Invoices fetched successfully!');
                resolve({ success: true, data: rows });
            }
        });
    });
};

const fetchInvoiceById = (invoiceID) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT customers.name AS customerName, invoices.* FROM invoices 
                       LEFT JOIN customers ON customers.id = invoices.customerID WHERE invoices.id = ?`;
        database.get(query, [invoiceID], (err, row) => {
            if (err) {
                console.log('Error fetching sale by ID: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('invoice fetched successfully!', row);
                resolve({ success: true, data: row });
            }
        });
    });
};

const deleteInvoice = (invoiceID) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM invoices WHERE id = ?`;

        database.run(query, [invoiceID], function (err) {
            if (err) {
                console.log('Error deleting invoice: ', err.message);
                reject({ success: false, error: err.message });
            } else {
                console.log('Invoice deleted successfully!');
                resolve({ success: true });
            }
        });
    });
};

const saveInvoice = (data) => {
    return new Promise((resolve, reject) => {
        const itemsJson = JSON.stringify(data.items)
        if (data.invoiceID) {
            const updateInvoiceQuery = `UPDATE invoices SET customerID = ?, items = ?, status = ? WHERE id = ?`;
            database.run(updateInvoiceQuery, [data.customerID, itemsJson, data.status, data.invoiceID], function (err) {
                if (err) {
                    console.log('Error updating invoice: ', err.message);
                    reject({ success: false, error: err.message });
                } else {
                    console.log('Invoice updated successfully!');
                    resolve({ success: true });
                }
            });
        } else {
            const insertInvoiceQuery = `INSERT INTO invoices (customerID, items, status, createdAt) 
                                        VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
            database.run(insertInvoiceQuery, [data.customerID, itemsJson, data.status], function (err) {
                if (err) {
                    console.log('Error inserting invoice: ', err.message);
                    reject({ success: false, error: err.message });
                } else {
                    console.log('Invoice created successfully!');
                    resolve({ success: true, lastID: this.lastID });
                }
            });
        }
    });
};