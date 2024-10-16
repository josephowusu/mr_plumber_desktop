const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { ipcMain } = require('electron')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(path.join(__dirname, 'mr_plumber_shop.sqlite'), (err) => {
    if (err) {
        console.log("error: ", "Connection:", err.message);
    } else {
        console.log("success", "Connection")
        db.run(`CREATE TABLE IF NOT EXISTS account (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            password TEXT
        )`)
    }
})

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools()
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

ipcMain.on('export-db', () => {
    exportDatabase();
});

ipcMain.on('add-user', (event, user) => {
    const { name, email } = user;
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function(err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`A user has been inserted with id ${this.lastID}`);
        }
    });
});