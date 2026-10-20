// Helper function to format currency
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
};

// State to keep track of variable row counts to manage delete button disabled state
function updateDeleteButtons() {
    const rows = document.querySelectorAll('.variabel-row');
    const deleteBtns = document.querySelectorAll('.btn-delete');
    
    if (rows.length <= 1) {
        deleteBtns[0].disabled = true;
    } else {
        deleteBtns.forEach(btn => btn.disabled = false);
    }
}

// Function to add a new variable cost row
function tambahBaris() {
    const container = document.getElementById('variabel-container');
    const newRow = document.createElement('div');
    newRow.className = 'variabel-row';
    
    newRow.innerHTML = `
        <div class="input-group flex-2">
            <label class="mobile-hidden">Nama Biaya</label>
            <input type="text" class="var-nama" placeholder="Contoh: Plastik Kemasan">
        </div>
        <div class="input-group flex-2">
            <label class="mobile-hidden">Total Biaya (Rp)</label>
            <input type="number" class="var-nominal" placeholder="Contoh: 25000" min="0">
        </div>
        <div class="input-action">
            <label class="mobile-hidden">&nbsp;</label>
            <button type="button" class="btn-icon btn-delete" onclick="hapusBaris(this)">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    
    container.appendChild(newRow);
    
    // Hide labels on mobile for appended rows if needed, or rely on CSS
    const labels = newRow.querySelectorAll('.mobile-hidden');
    if (window.innerWidth <= 600) {
        labels.forEach(l => l.style.display = 'none');
    }

    updateDeleteButtons();
}

// Function to remove a variable cost row
function hapusBaris(btnElement) {
    const rows = document.querySelectorAll('.variabel-row');
    if (rows.length > 1) {
        const row = btnElement.closest('.variabel-row');
        row.remove();
        updateDeleteButtons();
    }
}

// Main calculate function
function hitungHPP() {
    // 1. Get Fixed Costs
    const penyusutan = parseFloat(document.getElementById('penyusutan').value) || 0;
    const sewa = parseFloat(document.getElementById('sewa').value) || 0;
    const totalTetap = penyusutan + sewa;

    // 2. Get Variable Costs
    let totalVariabel = 0;
    const varInputs = document.querySelectorAll('.var-nominal');
    varInputs.forEach(input => {
        totalVariabel += parseFloat(input.value) || 0;
    });

    // 3. Total Cost
    const totalBiaya = totalTetap + totalVariabel;

    // 4. Production Qty
    const jumlahProduksi = parseFloat(document.getElementById('jumlah-produksi').value) || 0;

    // Validation
    if (jumlahProduksi <= 0) {
        alert("Mohon masukkan Jumlah Produksi yang valid (lebih dari 0)!");
        document.getElementById('jumlah-produksi').focus();
        return;
    }

    // 5. Calculate HPP per Unit
    const hppPerUnit = totalBiaya / jumlahProduksi;

    // 6. Update UI
    document.getElementById('res-tetap').innerText = formatRupiah(totalTetap);
    document.getElementById('res-variabel').innerText = formatRupiah(totalVariabel);
    document.getElementById('res-total').innerText = formatRupiah(totalBiaya);
    document.getElementById('res-qty').innerText = `${jumlahProduksi} Unit`;
    document.getElementById('res-hpp').innerText = formatRupiah(hppPerUnit);

    // Show Result Card with animation
    const resultCard = document.getElementById('hasil-container');
    resultCard.classList.remove('hidden');
    
    // Scroll to result smoothly
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Add brief highlight animation
    resultCard.classList.remove('animate-pulse-once');
    // trigger reflow
    void resultCard.offsetWidth;
    resultCard.classList.add('animate-pulse-once');
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    updateDeleteButtons();
});
