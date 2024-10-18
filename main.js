const { app, BrowserWindow, screen } = require('electron')
const path = require('node:path')
const { ipcMain } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const dbController = require('./controller/dbController')

const db = new sqlite3.Database(path.join(__dirname, 'mr_plumber_shop.sqlite'), (err) => {
    if (err) {
        console.log("error: ", "Connection:", err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS account (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )`, (err) => {
            if (err) {
                console.log("Error creating table:", err.message)
            } else {
                db.get("SELECT COUNT(*) AS count FROM account", [], (err, row) => {
                    if (err) {
                        console.log("Error checking account count:", err.message)
                    } else if (row.count === 0) {
                        const defaultName = 'admin'
                        const defaultPassword = 'password123'
                        db.run(`INSERT INTO account (username, password) VALUES (?, ?)`, [defaultName, defaultPassword], function(err) {
                            if (err) {
                                console.log("Error inserting default account:", err.message);
                            } else {
                                console.log(`Default account created with id: ${this.lastID}`);
                            }
                        })
                    }
                })
            }
        })
    }
})


const createWindow = () => {
    let windowWidth = screen.getPrimaryDisplay().workAreaSize.width
    let windowHeight = screen.getPrimaryDisplay().workAreaSize.height

    const mainWindow = new BrowserWindow({
        title: 'Mr Plumber ~ v1.0.0',
        width: windowWidth - 100,
        height: windowHeight - 50,
        minWidth: windowWidth - 100,
        minHeight: windowHeight - 50,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
        }
    })
    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, 'index.html'))
    }

    ipcMain.on('minimize-window', () => {
        mainWindow.minimize()
    })

    ipcMain.on('maximize-window', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize()
        } else {
            mainWindow.maximize()
        }
    })

    ipcMain.on('close-window', () => {
        mainWindow.close()
    })

    ipcMain.on('export-db', () => {
        exportDatabase();
    })

    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('window-maximized')
    })

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('window-unmaximized')
    })
 
    ipcMain.on('login-user-account', (event, account) => {
        let username = account.username || ""
        let password = account.password || ""
        new sqlite3.Database(path.join(__dirname, 'mr_plumber_shop.sqlite'), (err) => {
            if (err) {
                console.log("Error creating table:", err.message)
            } else {
                db.get("SELECT * FROM account WHERE username = ? and password = ?", [username, password], (err, row) => {
                    if (err) {
                        mainWindow.webContents.send('login-user-account-status', {status: 'error', message: err.message})
                    }
                    if (row) {
                        mainWindow.webContents.send('login-user-account-status', {status: 'success', message: 'Login was successful', data: row})
                    } else {
                        mainWindow.webContents.send('login-user-account-status', {status: 'info', message: `Invalid User - ${password}`})
                    }
                })
            }
        })
    })

    

    //   mainWindow.webContents.openDevTools()
}

ipcMain.on('saveProductCategory', (event, data) => {
    const query = `INSERT INTO productCategory (name, description, manufacturer, status, createdAt) VALUES (?, ?, ?, 'active', 'CURRENT_TIMESTAMP()')`;

    db.run(query, [data.categoryName, data.categoryDescription, data.manufacturerName], function (err) {
        if (err) {
            console.log('Error inserting product category: ', err.message);
            event.reply('saveProductCategoryResponse', { success: false, error: err.message });
        } else {
            console.log('Product category inserted successfully!');
            event.reply('saveProductCategoryResponse', { success: true, lastID: this.lastID });
        }
    });
})

ipcMain.on('fetchProductCategories', (event) => {
    const query = `SELECT * FROM productCategory`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.log('Error fetching product categories: ', err.message);
            event.reply('fetchProductCategoriesResponse', { success: false, error: err.message });
        } else {
            console.log('Product categories fetched successfully!');
            event.reply('fetchProductCategoriesResponse', { success: true, data: rows });
        }
    });
})

ipcMain.on('saveCustomer', (event, data) => {
    const query = `INSERT INTO customers (name, phone, email, status, createdAt) VALUES (?, ?, ?, 'active', 'CURRENT_TIMESTAMP()')`;

    db.run(query, [data.customerName, data.customerEmail, data.customerPhone], function (err) {
        if (err) {
            console.log('Error inserting customer: ', err.message);
            event.reply('saveCustomerResponse', { success: false, error: err.message });
        } else {
            console.log('Customer inserted successfully!');
            event.reply('saveCustomerResponse', { success: true, lastID: this.lastID });
        }
    })
})

ipcMain.on('fetchCustomers', (event) => {
    const query = `SELECT * FROM customers`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.log('Error fetching product categories: ', err.message);
            event.reply('fetchCustomerResponse', { success: false, error: err.message });
        } else {
            console.log('Product categories fetched successfully!');
            event.reply('fetchCustomerResponse', { success: true, data: rows });
        }
    });
})

// Save Product
ipcMain.on('saveProduct', (event, data) => {
    const query = `
        INSERT INTO products 
        (name, quantity, description, productCategoryID, purchasePrice, sellingPrice, status, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)`;

    db.run(query, [data.productName, 0, data.productDescription, data.productCategoryID, data.purchasePrice, data.sellingPrice, data.status], function (err) {
        if (err) {
            console.log('Error inserting product: ', err.message);
            event.reply('saveProductResponse', { success: false, error: err.message });
        } else {
            console.log('Product inserted successfully!');
            event.reply('saveProductResponse', { success: true, lastID: this.lastID });
        }
    });
});

// Fetch Products
ipcMain.on('fetchProducts', (event) => {
    const query = `SELECT productCategory.*, products.*, productCategory.name AS productCategoryName FROM products LEFT JOIN productCategory ON productCategory.id = products.id`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.log('Error fetching products: ', err.message);
            event.reply('fetchProductsResponse', { success: false, error: err.message });
        } else {
            console.log('Products fetched successfully!');
            event.reply('fetchProductsResponse', { success: true, data: rows });
        }
    })
})

// ipcMain.on('saveProductStock', (event, data) => {
//     const query = `
//         INSERT INTO productStock 
//         (productID, quantity, status, createdAt) VALUES (?, ?, 'active', CURRENT_TIMESTAMP)`;
//     db.run(query, [data.productID, data.quantity], function (err) {
//         if (err) {
//             console.log('Error inserting product: ', err.message);
//             event.reply('saveProductStockResponse', { success: false, error: err.message });
//         } else {
//             const query = `UPDATE products SET products.quantity = products.quantity + ?`;
//             db.run(query, [data.quantity], function (err) {
//                 if (err) {
//                     console.log('Error inserting product: ', err.message);
//                     event.reply('saveProductResponse', { success: false, error: err.message });
//                 } else {
//                     console.log('Product inserted successfully!');
//                     event.reply('saveProductResponse', { success: true, lastID: this.lastID });
//                 }
//             });
//             console.log('Product inserted successfully!');
//             event.reply('saveProductStockResponse', { success: true, lastID: this.lastID });
//         }
//     })
// })

ipcMain.on('saveProductStock', (event, data) => {
    const insertStockQuery = `
        INSERT INTO productStock 
        (productID, quantity, status, createdAt) VALUES (?, ?, 'active', CURRENT_TIMESTAMP)`;

    // Insert the stock entry into productStock table
    db.run(insertStockQuery, [data.productID, data.quantity], function (err) {
        if (err) {
            console.log('Error inserting product stock: ', err.message);
            event.reply('saveProductStockResponse', { success: false, error: err.message });
        } else {
            // After stock entry, update the quantity in products table
            const updateProductQuery = `
                UPDATE products 
                SET quantity = quantity + ? 
                WHERE id = ?`; 
            db.run(updateProductQuery, [data.quantity, data.productID], function (err) {
                if (err) {
                    console.log('Error updating product quantity: ', err.message);
                    event.reply('saveProductResponse', { success: false, error: err.message });
                } else {
                    console.log('Product quantity updated successfully!');
                    event.reply('saveProductResponse', { success: true, lastID: this.lastID });
                }
            });
            console.log('Product stock inserted successfully!');
            event.reply('saveProductStockResponse', { success: true, lastID: this.lastID });
        }
    });
});


ipcMain.on('fetchProductStock', (event) => {
    const query = `SELECT productCategory.*, products.*, productCategory.name AS productCategoryName, productStock.* 
        FROM productStock 
        LEFT JOIN products ON products.id = productStock.productID
        LEFT JOIN productCategory ON productCategory.id = products.productCategoryID
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.log('Error fetching products: ', err.message);
            event.reply('fetchProductStockResponse', { success: false, error: err.message });
        } else {
            console.log('Products fetched successfully!');
            event.reply('fetchProductStockResponse', { success: true, data: rows });
        }
    })
})

app.whenReady().then(() => {
    createWindow()

    dbController.initDatabase()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function exportDatabase() {
    const source = path.join(__dirname, 'mr_plumber_shop.sqlite')
    const destination = path.join(app.getPath('desktop'), 'mr_plumber_shop_exported_db.sqlite')

    fs.copyFile(source, destination, (err) => {
        if (err) {
            console.error('Error exporting database:', err)
        } else {
            console.log('Database exported successfully to:', destination)
        }
    })
}