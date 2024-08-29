// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCoBltexm1qRohBMC_xe6v7Ji21fOyNBIo",
    authDomain: "filtering-casn.firebaseapp.com",
    databaseURL: "https://filtering-casn-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "filtering-casn",
    storageBucket: "filtering-casn.appspot.com",
    messagingSenderId: "1087248260231",
    appId: "1:1087248260231:web:1a4ac6c3ceb25ee543ac22",
    measurementId: "G-XSTV1EFGZV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Global variables
let data = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 10;

// Fetch data from Firebase
const dataBody = document.getElementById('dataBody');

database.ref('data/data').once('value', snapshot => {
    data = snapshot.val();
    applyFilters();
});

// Function to format salary as millions without decimal
function formatSalary(salary) {
    if (!salary) return '0 Jt';
    const salaryInMillions = Math.round(parseInt(salary) / 1000000);
    return `${salaryInMillions} Jt`;
}

// Display data in table
function displayData(page) {
    dataBody.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = page * rowsPerPage;
    const pageData = filteredData.slice(start, end);

    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Institution">${item.ins_nm}</td>
            <td data-label="Job">${item.jabatan_nm}</td>
            <td data-label="Formation">${item.formasi_nm}</td>
            <td data-label="Location">${item.lokasi_nm}</td>
            <td data-label="Range Salary">${formatSalary(item.gaji_min)} - ${formatSalary(item.gaji_max)}</td>
            <td data-label="Jumlah Formasi">${item.jumlah_formasi}</td>
        `;
        dataBody.appendChild(row);
    });

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = Math.ceil(filteredData.length / rowsPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= filteredData.length;
}


// Apply filters to each column
const filters = {
    institution: '',
    job: '',
    formation: '',
    location: '',
    salaryRange: '',
    formasiJumlah: ''
};

document.getElementById('filterInstitution').addEventListener('input', function() {
    filters.institution = this.value.toLowerCase();
    applyFilters();
});

document.getElementById('filterJob').addEventListener('input', function() {
    filters.job = this.value.toLowerCase();
    applyFilters();
});

document.getElementById('filterFormation').addEventListener('input', function() {
    filters.formation = this.value.toLowerCase();
    applyFilters();
});

document.getElementById('filterLocation').addEventListener('input', function() {
    filters.location = this.value.toLowerCase();
    applyFilters();
});

document.getElementById('filterSalaryRange').addEventListener('change', function() {
    filters.salaryRange = this.value;
    applyFilters();
});

document.getElementById('filterFormasiJumlah').addEventListener('change', function() {
    filters.formasiJumlah = this.value;
    applyFilters();
});

function applyFilters() {
    filteredData = data.filter(item => {
        return (
            item.ins_nm.toLowerCase().includes(filters.institution) &&
            item.jabatan_nm.toLowerCase().includes(filters.job) &&
            item.formasi_nm.toLowerCase().includes(filters.formation) &&
            item.lokasi_nm.toLowerCase().includes(filters.location)
        );
    });

    // Sorting berdasarkan Range Salary
    if (filters.salaryRange === 'lowest') {
        filteredData.sort((a, b) => parseInt(a.gaji_max) - parseInt(b.gaji_max));
    } else if (filters.salaryRange === 'highest') {
        filteredData.sort((a, b) => parseInt(b.gaji_max) - parseInt(a.gaji_max));
    }

    // Sorting berdasarkan Jumlah Formasi
    if (filters.formasiJumlah === 'lowest') {
        filteredData.sort((a, b) => a.jumlah_formasi - b.jumlah_formasi);
    } else if (filters.formasiJumlah === 'highest') {
        filteredData.sort((a, b) => b.jumlah_formasi - a.jumlah_formasi);
    }

    currentPage = 1;
    displayData(currentPage);
}


// Pagination controls
document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        displayData(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    if ((currentPage * rowsPerPage) < filteredData.length) {
        currentPage++;
        displayData(currentPage);
    }
});
