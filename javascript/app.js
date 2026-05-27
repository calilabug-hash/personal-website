// ==========================================
// 1. INITIALIZATION & APP LAUNCH
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    loadSavedImages();  // Restore closet images from browser storage
    loadWishlist();     // Restore wishlist rows from browser storage
});


// ==========================================
// 2. OUTFIT BUILDER (IMAGES & DATA PERSISTENCE)
// ==========================================

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result; 
        displayImageOnCanvas(imageData);
        saveImageToStorage(imageData);
    };
    reader.readAsDataURL(file);
}

function displayImageOnCanvas(imageSrc) {
    const canvas = document.getElementById('closet-canvas');
    if (!canvas) return; // Safely exit if on a page without a closet canvas
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'clothing-item';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = "User Wardrobe Upload";

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = '✕';
    
    deleteBtn.onclick = function() { 
        itemDiv.remove(); 
        removeImageFromStorage(imageSrc);
    };

    itemDiv.appendChild(img);
    itemDiv.appendChild(deleteBtn);
    canvas.appendChild(itemDiv);
}

function saveImageToStorage(imageData) {
    let currentImages = JSON.parse(localStorage.getItem('digiClosetImages')) || [];
    currentImages.push(imageData);
    try {
        localStorage.setItem('digiClosetImages', JSON.stringify(currentImages));
    } catch (error) {
        alert("Your local browser storage is full! Try uploading smaller images.");
    }
}

function loadSavedImages() {
    let savedImages = JSON.parse(localStorage.getItem('digiClosetImages')) || [];
    savedImages.forEach(imageData => {
        displayImageOnCanvas(imageData);
    });
}

function removeImageFromStorage(imageSrc) {
    let currentImages = JSON.parse(localStorage.getItem('digiClosetImages')) || [];
    currentImages = currentImages.filter(img => img !== imageSrc);
    localStorage.setItem('digiClosetImages', JSON.stringify(currentImages));
}


// ==========================================
// 3. WISHLIST TRACKER LOGIC (RE-ADDED HERE)
// ==========================================

let wishlistItems = [];

function addWishlistItem(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('item-name');
    const costInput = document.getElementById('item-cost');
    const notesInput = document.getElementById('item-notes');

    if (!nameInput || !costInput) return;

    const item = {
        id: Date.now(),
        name: nameInput.value.trim(),
        cost: parseFloat(costInput.value),
        notes: notesInput.value.trim() || "No extra notes details added."
    };

    wishlistItems.push(item);
    
    syncWishlistToStorage();
    renderWishlist();

    nameInput.value = '';
    costInput.value = '';
    notesInput.value = '';
}

function removeWishlistItem(id) {
    wishlistItems = wishlistItems.filter(item => item.id !== id);
    syncWishlistToStorage();
    renderWishlist();
}

function syncWishlistToStorage() {
    localStorage.setItem('digiClosetWishlist', JSON.stringify(wishlistItems));
}

function loadWishlist() {
    wishlistItems = JSON.parse(localStorage.getItem('digiClosetWishlist')) || [];
    renderWishlist();
}

function renderWishlist() {
    const display = document.getElementById('wishlist-display');
    if (!display) return; // Safely exit if currently viewing a page without a wishlist display
    
    display.innerHTML = '';
    let accumulatedCost = 0;

    wishlistItems.forEach(item => {
        accumulatedCost += item.cost;

        const card = document.createElement('div');
        card.className = 'wishlist-card';
        
        card.innerHTML = `
            <div>
                <h4 style="font-weight:bold; margin-bottom:5px;">${item.name}</h4>
                <p class="wishlist-cost">$${item.cost.toFixed(2)}</p>
                <p class="wishlist-notes">${item.notes}</p>
            </div>
            <button onclick="removeWishlistItem(${item.id})" style="margin-top:10px; background:#ef4444; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Remove</button>
        `;
        display.appendChild(card);
    });

    const totalItemsEl = document.getElementById('total-items');
    const totalBudgetEl = document.getElementById('total-budget');
    
    if (totalItemsEl) totalItemsEl.innerText = wishlistItems.length;
    if (totalBudgetEl) totalBudgetEl.innerText = accumulatedCost.toFixed(2);
}