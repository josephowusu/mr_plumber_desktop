const Swal = require('sweetalert2')
const { ipcRenderer } = require('electron')


function loadPage(page) {
    const contentDiv = document.getElementById('content')
    if (contentDiv) {
        fetch(`pages/${page}.html`)
            .then(response => response.text())
            .then(html => {
                contentDiv.innerHTML = html
            })
            .catch(error => {
                console.log('Error', 'loading page:', error)
            })
    } else {
        console.log('Error', 'loading page:', 'Redering page not found')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPage('dashboard')
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