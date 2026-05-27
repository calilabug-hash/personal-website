// Outfit Builder Camera and Upload Processing
// Run this function automatically as soon as the page loads
window.addEventListener('DOMContentLoaded', () => {
    loadSavedImages();
});

// 1. Outfit Builder Camera and Upload Processing
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Display the image on screen
        displayImageOnCanvas(imageData);
        
        // Save the image to the browser's memory
        saveImageToStorage(imageData);
    };
    reader.readAsDataURL(file);
}

// Helper function to build the image HTML component
function displayImageOnCanvas(imageSrc) {
    const canvas = document.getElementById('closet-canvas');
    if (!canvas) return;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'clothing-item';
    
    const img = document.createElement('img');
    img.src = imageSrc;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = '✕';
    
    // Updated delete logic to also remove from localStorage
    deleteBtn.onclick = function() { 
        itemDiv.remove(); 
        removeImageFromStorage(imageSrc);
    };

    itemDiv.appendChild(img);
    itemDiv.appendChild(deleteBtn);
    canvas.appendChild(itemDiv);
}

// 2. LocalStorage Functions to Keep Data Alive On Refresh

function saveImageToStorage(imageData) {
    // Get existing saved images, or create an empty array if none exist
    let currentImages = JSON.parse(localStorage.getItem('digiClosetImages')) || [];
    currentImages.push(imageData);
    
    try {
        localStorage.setItem('digiClosetImages', JSON.stringify(currentImages));
    } catch (error) {
        // LocalStorage has a limit of around 5MB. If images are too massive, show a warning.
        alert("Your browser's local memory is full! Try uploading smaller images or clearing old ones.");
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
    // Filter out the deleted image
    currentImages = currentImages.filter(img => img !== imageSrc);
    localStorage.setItem('digiClosetImages', JSON.stringify(currentImages));
}

// Wishlist Logic and State Controller
let wishlistItems = [];

function addWishlistItem(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('item-name');
    const costInput = document.getElementById('item-cost');
    const notesInput = document.getElementById('item-notes');

    if(!nameInput || !costInput) return;

    const item = {
        id: Date.now(),
        name: nameInput.value,
        cost: parseFloat(costInput.value),
        notes: notesInput.value || "No notes added."
    };

    wishlistItems.push(item);
    renderWishlist();

    nameInput.value = '';
    costInput.value = '';
    notesInput.value = '';
}

function removeWishlistItem(id) {
    wishlistItems = wishlistItems.filter(item => item.id !== id);
    renderWishlist();
}

function renderWishlist() {
    const display = document.getElementById('wishlist-display');
    if(!display) return;
    
    display.innerHTML = '';
    let accumulatedCost = 0;

    wishlistItems.forEach(item => {
        accumulatedCost += item.cost;

        const card = document.createElement('div');
        card.style.background = "white";
        card.style.border = "1px solid #D1D9E6";
        card.style.borderRadius = "8px";
        card.style.padding = "15px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.justify = "space-between";
        
        card.innerHTML = `
            <div>
                <h4 style="font-weight:bold; margin-bottom:5px;">${item.name}</h4>
                <p style="font-weight:bold; color:#F897BF; margin:5px 0;">$${item.cost.toFixed(2)}</p>
                <p style="font-size:0.9rem; color:#666; background:#f9f9f9; padding:5px; border-radius:4px;">${item.notes}</p>
            </div>
            <button onclick="removeWishlistItem(${item.id})" style="margin-top:10px; background:#ef4444; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Remove</button>
        `;
        display.appendChild(card);
    });

    document.getElementById('total-items').innerText = wishlistItems.length;
    document.getElementById('total-budget').innerText = accumulatedCost.toFixed(2);
}