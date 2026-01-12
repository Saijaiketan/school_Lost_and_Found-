// Data Storage
let items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];
let claims = JSON.parse(localStorage.getItem('lostFoundClaims')) || [];
let isAdminLoggedIn = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigationListeners();
    setupFormListeners();
    setupModalListeners();
    setupSearchAndFilter();
    updateStats();
    renderItems();
    setDefaultDate();
}

// Navigation
function setupNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            navigateTo(target);
        });
    });
}

function navigateTo(sectionId) {
    // Update sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // Update nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Refresh content based on section
    if (sectionId === 'browse') {
        renderItems();
    } else if (sectionId === 'admin') {
        if (isAdminLoggedIn) {
            renderAdminPanel();
        }
    } else if (sectionId === 'home') {
        updateStats();
    }
}

// Form Listeners
function setupFormListeners() {
    // Report Item Form
    const reportForm = document.getElementById('reportForm');
    reportForm.addEventListener('submit', handleReportSubmit);

    // Photo Preview
    const photoInput = document.getElementById('itemPhoto');
    photoInput.addEventListener('change', handlePhotoPreview);

    // Admin Login
    const adminLoginForm = document.getElementById('adminLoginForm');
    adminLoginForm.addEventListener('submit', handleAdminLogin);

    // Claim Form
    const claimForm = document.getElementById('claimForm');
    claimForm.addEventListener('submit', handleClaimSubmit);
}

function setDefaultDate() {
    const dateInput = document.getElementById('dateFound');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.max = today;
}

function handlePhotoPreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('photoPreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
}

function handleReportSubmit(e) {
    e.preventDefault();

    const photoInput = document.getElementById('itemPhoto');
    const photoFile = photoInput.files[0];

    const newItem = {
        id: Date.now().toString(),
        name: document.getElementById('itemName').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        location: document.getElementById('location').value,
        dateFound: document.getElementById('dateFound').value,
        finderName: document.getElementById('finderName').value,
        finderContact: document.getElementById('finderContact').value,
        photo: null,
        status: 'Pending',
        dateReported: new Date().toISOString(),
        claims: []
    };

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newItem.photo = event.target.result;
            saveItem(newItem);
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveItem(newItem);
    }
}

function saveItem(item) {
    items.push(item);
    localStorage.setItem('lostFoundItems', JSON.stringify(items));

    showAlert('success', 'Item reported successfully! It will be visible after admin approval.');
    document.getElementById('reportForm').reset();
    document.getElementById('photoPreview').innerHTML = '';
    setDefaultDate();
    updateStats();

    setTimeout(() => {
        navigateTo('browse');
    }, 2000);
}

// Search and Filter
function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    searchInput.addEventListener('input', renderItems);
    categoryFilter.addEventListener('change', renderItems);
    statusFilter.addEventListener('change', renderItems);
}

function renderItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const approvedItems = items.filter(item => item.status === 'Available' || item.status === 'Claimed');

    let filteredItems = approvedItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                            item.description.toLowerCase().includes(searchTerm) ||
                            item.location.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        const matchesStatus = !statusFilter || item.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const grid = document.getElementById('itemsGrid');
    const noItems = document.getElementById('noItems');

    if (filteredItems.length === 0) {
        grid.innerHTML = '';
        noItems.style.display = 'block';
    } else {
        noItems.style.display = 'none';
        grid.innerHTML = filteredItems.map(item => createItemCard(item)).join('');
    }
}

function createItemCard(item) {
    const photoDisplay = item.photo
        ? `<img src="${item.photo}" alt="${item.name}">`
        : 'ðŸ“¦';

    const statusClass = item.status === 'Available' ? 'status-available' : 'status-claimed';

    return `
        <div class="item-card" onclick="showItemDetails('${item.id}')">
            <div class="item-image">
                ${photoDisplay}
            </div>
            <div class="item-content">
                <div class="item-header">
                    <div>
                        <h3 class="item-title">${item.name}</h3>
                        <span class="item-category">${item.category}</span>
                    </div>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-details-list">
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Date Found:</strong> ${formatDate(item.dateFound)}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${item.status}</span></p>
                </div>
                ${item.status === 'Available' ? '<div class="item-actions"><button class="btn btn-primary btn-small" onclick="event.stopPropagation(); openClaimModal(\'' + item.id + '\')">Claim This Item</button></div>' : ''}
            </div>
        </div>
    `;
}

// Item Details Modal
function showItemDetails(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const photoDisplay = item.photo
        ? `<img src="${item.photo}" alt="${item.name}" style="max-width: 100%; border-radius: 5px; margin-bottom: 1rem;">`
        : '<div style="font-size: 5rem; text-align: center; margin-bottom: 1rem;">ðŸ“¦</div>';

    const statusClass = item.status === 'Available' ? 'status-available' : 'status-claimed';

    const detailsHTML = `
        <h2>${item.name}</h2>
        ${photoDisplay}
        <p><span class="item-category">${item.category}</span> <span class="status-badge ${statusClass}">${item.status}</span></p>
        <div style="margin-top: 1.5rem;">
            <h3>Description</h3>
            <p>${item.description}</p>

            <h3 style="margin-top: 1.5rem;">Details</h3>
            <p><strong>Location Found:</strong> ${item.location}</p>
            <p><strong>Date Found:</strong> ${formatDate(item.dateFound)}</p>
            <p><strong>Reported By:</strong> ${item.finderName}</p>
            <p><strong>Contact:</strong> ${item.finderContact}</p>

            ${item.status === 'Available' ? `
                <button class="btn btn-primary" style="margin-top: 1.5rem; width: 100%;" onclick="closeModal('itemModal'); openClaimModal('${item.id}')">Claim This Item</button>
            ` : ''}
        </div>
    `;

    document.getElementById('itemDetails').innerHTML = detailsHTML;
    document.getElementById('itemModal').classList.add('active');
}

// Claim Modal and Form
function openClaimModal(itemId) {
    document.getElementById('claimItemId').value = itemId;
    document.getElementById('claimModal').classList.add('active');
}

function handleClaimSubmit(e) {
    e.preventDefault();

    const itemId = document.getElementById('claimItemId').value;
    const claim = {
        id: Date.now().toString(),
        itemId: itemId,
        claimantName: document.getElementById('claimantName').value,
        claimantContact: document.getElementById('claimantContact').value,
        description: document.getElementById('claimDescription').value,
        dateSubmitted: new Date().toISOString(),
        status: 'Pending'
    };

    claims.push(claim);
    localStorage.setItem('lostFoundClaims', JSON.stringify(claims));

    const item = items.find(i => i.id === itemId);
    if (item) {
        item.claims = item.claims || [];
        item.claims.push(claim.id);
        localStorage.setItem('lostFoundItems', JSON.stringify(items));
    }

    showAlert('success', 'Your claim has been submitted! The finder will be notified and will contact you if approved.');
    document.getElementById('claimForm').reset();
    closeModal('claimModal');
    updateStats();
}

// Modal Controls
function setupModalListeners() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Admin Panel
function handleAdminLogin(e) {
    e.preventDefault();

    const password = document.getElementById('adminPassword').value;

    // Simple password check (in production, use proper authentication)
    if (password === 'admin123') {
        isAdminLoggedIn = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        renderAdminPanel();
        showAlert('success', 'Admin login successful!');
    } else {
        showAlert('danger', 'Incorrect password!');
    }
}

function logout() {
    isAdminLoggedIn = false;
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${tabName}Tab`).classList.add('active');
    event.target.classList.add('active');
}

function renderAdminPanel() {
    const pendingItems = items.filter(item => item.status === 'Pending');
    const approvedItems = items.filter(item => item.status === 'Available' || item.status === 'Claimed');
    const pendingClaims = claims.filter(claim => claim.status === 'Pending');

    document.getElementById('pendingCount').textContent = pendingItems.length;
    document.getElementById('approvedCount').textContent = approvedItems.length;
    document.getElementById('claimsCount').textContent = pendingClaims.length;

    renderAdminItems('pendingItems', pendingItems, 'pending');
    renderAdminItems('approvedItems', approvedItems, 'approved');
    renderAdminClaims();
}

function renderAdminItems(containerId, itemsList, type) {
    const container = document.getElementById(containerId);

    if (itemsList.length === 0) {
        container.innerHTML = '<p class="no-items">No items to display.</p>';
        return;
    }

    container.innerHTML = itemsList.map(item => createAdminItemCard(item, type)).join('');
}

function createAdminItemCard(item, type) {
    const photoDisplay = item.photo
        ? `<img src="${item.photo}" alt="${item.name}">`
        : 'ðŸ“¦';

    const actions = type === 'pending'
        ? `
            <button class="btn btn-secondary btn-small" onclick="approveItem('${item.id}')">Approve</button>
            <button class="btn btn-danger btn-small" onclick="deleteItem('${item.id}')">Reject</button>
        `
        : `
            <button class="btn btn-warning btn-small" onclick="markAsClaimed('${item.id}')">${item.status === 'Claimed' ? 'Mark Available' : 'Mark Claimed'}</button>
            <button class="btn btn-danger btn-small" onclick="deleteItem('${item.id}')">Delete</button>
        `;

    return `
        <div class="admin-item-card">
            <div class="admin-item-image">${photoDisplay}</div>
            <div class="admin-item-info">
                <h3>${item.name} <span class="item-category">${item.category}</span></h3>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>Location:</strong> ${item.location} | <strong>Date Found:</strong> ${formatDate(item.dateFound)}</p>
                <p><strong>Reported By:</strong> ${item.finderName} | <strong>Contact:</strong> ${item.finderContact}</p>
                <p><strong>Status:</strong> ${item.status} | <strong>Claims:</strong> ${(item.claims || []).length}</p>
                <div class="admin-item-actions">
                    ${actions}
                </div>
            </div>
        </div>
    `;
}

function renderAdminClaims() {
    const container = document.getElementById('claimsItems');
    const pendingClaims = claims.filter(claim => claim.status === 'Pending');

    if (pendingClaims.length === 0) {
        container.innerHTML = '<p class="no-items">No pending claims.</p>';
        return;
    }

    container.innerHTML = pendingClaims.map(claim => {
        const item = items.find(i => i.id === claim.itemId);
        if (!item) return '';

        return `
            <div class="admin-item-card">
                <div class="admin-item-info">
                    <h3>Claim for: ${item.name}</h3>
                    <p><strong>Claimant:</strong> ${claim.claimantName} | <strong>Contact:</strong> ${claim.claimantContact}</p>
                    <p><strong>Reason:</strong> ${claim.description}</p>
                    <p><strong>Date Submitted:</strong> ${formatDate(claim.dateSubmitted.split('T')[0])}</p>
                    <div class="admin-item-actions">
                        <button class="btn btn-secondary btn-small" onclick="approveClaim('${claim.id}')">Approve Claim</button>
                        <button class="btn btn-danger btn-small" onclick="rejectClaim('${claim.id}')">Reject Claim</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Admin Actions
function approveItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.status = 'Available';
        localStorage.setItem('lostFoundItems', JSON.stringify(items));
        renderAdminPanel();
        updateStats();
        renderItems();
        showAlert('success', 'Item approved successfully!');
    }
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(i => i.id !== itemId);
        localStorage.setItem('lostFoundItems', JSON.stringify(items));
        renderAdminPanel();
        updateStats();
        renderItems();
        showAlert('success', 'Item deleted successfully!');
    }
}

function markAsClaimed(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.status = item.status === 'Claimed' ? 'Available' : 'Claimed';
        localStorage.setItem('lostFoundItems', JSON.stringify(items));
        renderAdminPanel();
        updateStats();
        renderItems();
        showAlert('success', `Item marked as ${item.status.toLowerCase()}!`);
    }
}

function approveClaim(claimId) {
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
        claim.status = 'Approved';
        const item = items.find(i => i.id === claim.itemId);
        if (item) {
            item.status = 'Claimed';
        }
        localStorage.setItem('lostFoundClaims', JSON.stringify(claims));
        localStorage.setItem('lostFoundItems', JSON.stringify(items));
        renderAdminPanel();
        updateStats();
        renderItems();
        showAlert('success', 'Claim approved! Item marked as claimed.');
    }
}

function rejectClaim(claimId) {
    if (confirm('Are you sure you want to reject this claim?')) {
        claims = claims.filter(c => c.id !== claimId);
        localStorage.setItem('lostFoundClaims', JSON.stringify(claims));
        renderAdminPanel();
        updateStats();
        showAlert('success', 'Claim rejected.');
    }
}

// Statistics
function updateStats() {
    const approvedItems = items.filter(item => item.status === 'Available' || item.status === 'Claimed');
    const claimedItems = items.filter(item => item.status === 'Claimed');
    const pendingClaims = claims.filter(claim => claim.status === 'Pending');

    document.getElementById('totalItems').textContent = approvedItems.length;
    document.getElementById('claimedItems').textContent = claimedItems.length;
    document.getElementById('pendingClaims').textContent = pendingClaims.length;
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '100px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '10000';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.animation = 'slideIn 0.3s';

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

/* ================= CONTACT US ================= */

let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const message = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            message: document.getElementById('contactMessage').value,
            date: new Date().toLocaleString()
        };

        contactMessages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(contactMessages));

        alert('Thank you! Your message has been sent.');
        contactForm.reset();
    });
}
