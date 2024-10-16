const { app, BrowserWindow, screen } = require('electron')
const path = require('node:path')
const { ipcMain } = require('electron')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(path.join(__dirname, 'mr_plumber_shop.sqlite'), (err) => {
    if (err) {
        console.log("error: ", "Connection:", err.message);
    } else {
        console.log("success", "Connection")
        // db.run(`CREATE TABLE IF NOT EXISTS account (
        //     id INTEGER PRIMARY KEY AUTOINCREMENT,
        //     name TEXT,
        //     password TEXT
        // )`)
        db.run(`CREATE TABLE IF NOT EXISTS account (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            password TEXT
        )`, (err) => {
            if (err) {
                console.log("Error creating table:", err.message);
            } else {
                // Insert default account if the table was just created
                db.get("SELECT COUNT(*) AS count FROM account", [], (err, row) => {
                    if (err) {
                        console.log("Error checking account count:", err.message);
                    } else if (row.count === 0) {
                        // If no accounts exist, insert a default account
                        const defaultName = 'admin';
                        const defaultPassword = 'password123'; // Change to a secure password in production
                        
                        db.run(`INSERT INTO account (name, password) VALUES (?, ?)`, [defaultName, defaultPassword], function(err) {
                            if (err) {
                                console.log("Error inserting default account:", err.message);
                            } else {
                                console.log(`Default account created with id: ${this.lastID}`);
                            }
                        });
                    }
                });
            }
        });
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

    // ipcMain.on('add-user', (event, user) => {
    //     const { name, email } = user;
    //     db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function(err) {
    //         if (err) {
    //             console.error(err.message);
    //         } else {
    //             console.log(`A user has been inserted with id ${this.lastID}`);
    //         }
    //     })
    // })

    //   mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function exportDatabase() {
    const source = path.join(__dirname, 'mr_plumber_shop.sqlite');
    const destination = path.join(app.getPath('desktop'), 'mr_plumber_shop_exported_db.sqlite'); // Change the path as needed

    fs.copyFile(source, destination, (err) => {
        if (err) {
            console.error('Error exporting database:', err);
        } else {
            console.log('Database exported successfully to:', destination);
        }
    });
}