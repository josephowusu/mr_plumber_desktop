const Swal = require('sweetalert2')
const { ipcRenderer } = require('electron')
// Swal.fire({
//     title: "Error",
//     text: error.message,
//     icon: "error"
// })
const page_component = {
    login: "<login-component></login-component>",
    register: "<register-component></register-component>",
}
function loadPage(page) {
    const contentDiv = document.getElementById('contentWorkingArea')
    if (contentDiv) {
        contentDiv.innerHTML = page_component[page]
    } else {
        console.log('Error', 'loading page:', 'Redering page not found')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPage('login')
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

document.addEventListener('DOMContentLoaded', () => {
    const signInButton = document.getElementById('signInButton')
    if (signInButton) {
        signInButton.addEventListener('click', () => {
            ipcRenderer.send('login-user')
        })
    } else {
        console.log('button not found')
    }
})


ipcRenderer.on('window-maximized', () => {
    document.getElementById('maximize').innerHTML = '<i class="fa-solid fa-minimize"></i>';
})

ipcRenderer.on('window-unmaximized', () => {
    document.getElementById('maximize').innerHTML = '<i class="fa-solid fa-maximize"></i>';
})

// // Function to export the database
// function exportDatabase() {
//     ipcRenderer.send('export-db');
// }

// Add an event listener to a button for exporting
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

// // Listen for a response from the main process
// ipcRenderer.on('export-success', () => {
//     Swal.fire({
//         title: 'Success!',
//         text: 'Database exported successfully!',
//         icon: 'success',
//         confirmButtonText: 'OK'
//     });
// });