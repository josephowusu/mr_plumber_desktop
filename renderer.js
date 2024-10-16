const Swal = require('sweetalert2')
const { ipcRenderer } = require('electron')

function loadPage(page) {
    const contentDiv = document.getElementById('contentWorkingArea')
    if (contentDiv) {
        fetch(`pages/${page}.html`)
            .then(response => response.text())
            .then(html => {
                contentDiv.innerHTML = html
            })
            .catch(error => {
                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error"
                })
                console.log('Error', 'loading page:', error)
            })
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

const signInButton = document.getElementById('signInButton')
if (signInButton) {
    signInButton.addEventListener('click', () => {
        ipcRenderer.send('login-user')
    })
} else {
    console.log('button not found')
}


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