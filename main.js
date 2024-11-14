const { app, BrowserWindow, screen } = require('electron')
const path = require('node:path')
const { ipcMain } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const dbController = require('./controller/dbController')
const fs = require('node:fs')

const dbDirectory = 'C:\\database';

if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true })
}

const dbPath = path.join(dbDirectory, 'mr_plumber_shop.sqlite')

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log("error: ", "Connection:", err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS account (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT,
            privs TEXT
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
                        const privs = ['assignPrivs']
                        db.run(`INSERT INTO account (username, password, privs) VALUES (?, ?, ?)`, [defaultName, defaultPassword, JSON.stringify(privs)], function(err) {
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
        new sqlite3.Database(dbPath, (err) => {
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
                        mainWindow.webContents.send('login-user-account-status', {status: 'info', message: `Invalid User`})
                    }
                })
            }
        })
    })

    function exportDatabase() {
        const source = dbPath;
        const destination = path.join(app.getPath('desktop'), 'mr_plumber_shop_exported_db.sqlite');
    
        fs.copyFile(source, destination, (err) => {
            if (err) {
                console.error('Error exporting database:', err)
                mainWindow.webContents.send('export-error', err.message);
            } else {
                console.log('Database exported successfully to:', destination)
                mainWindow.webContents.send('export-success');
            }
        });
    }

    //   mainWindow.webContents.openDevTools()
}

app.disableHardwareAcceleration()

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

// function exportDatabase() {
//     const source = dbPath
//     const destination = path.join(app.getPath('desktop'), 'mr_plumber_shop_exported_db.sqlite')

//     fs.copyFile(source, destination, (err) => {
//         if (err) {
//             console.error('Error exporting database:', err)
//         } else {
//             console.log('Database exported successfully to:', destination)
//         }
//     })
// }

