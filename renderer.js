const { ipcRenderer } = require('electron')
const Swal = require('sweetalert2')
const { storeData, fetchData } = require('./lib/Helper')

const page_component = {
    login: "<login-component></login-component>",
    register: "<register-component></register-component>",
    dashboard: "<dashboard-component></dashboard-component>",
    productCategory: "<product-category-component></product-category-component>",
    customer: "<customer-component></customer-component>",
    stock: "<product-stock-component></product-stock-component>",
    product: "<product-component></product-component>",
}

function loadPage(page) {
    const contentDiv = document.getElementById('contentWorkingArea')
    if (contentDiv && page_component[page]) {
        contentDiv.innerHTML = page_component[page]
    } else {
        console.log('Error', 'loading page:', 'Redering page not found')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let session = fetchData('session')
    let lastPage = fetchData('lastPage')
    if (session) {
        loadPage(lastPage ? lastPage : 'dashboard')
    } else {
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
        setInterval(() => {
            loadPage('dashboard')
        }, 500)
    }
})

function exportDatabase() {
    ipcRenderer.send('export-db')
}

// document.getElementById('exportButton').addEventListener('click', () => {
//     exportDatabase()
//     Swal.fire({
//         title: 'Exporting...',
//         text: 'Your database is being exported.',
//         icon: 'info',
//         showConfirmButton: false,
//         timer: 1500,
//     });
// });


ipcRenderer.on('export-success', () => {
    Swal.fire({
        title: 'Success!',
        text: 'Database exported successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    })
})