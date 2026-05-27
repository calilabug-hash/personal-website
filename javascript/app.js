// ==========================================
// 1. INITIALIZATION & APP LAUNCH
// ==========================================

// Run automatically as soon as the HTML document finishes loading
window.addEventListener('DOMContentLoaded', () => {
    loadSavedImages();  // Restore closet images from browser storage
    loadWishlist();     // Restore wishlist rows from browser storage
});


// ==========================================
// 2. OUTFIT BUILDER (IMAGES & DATA PERSISTENCE)
// ==========================================

/**
 * Handles incoming file streams from desktop files or mobile cameras
 */
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result; // Base64 raw image string
        
        // 1. Instantly display the item inside the workspace canvas
        displayImageOnCanvas(imageData);
        
        // 2. Commit the asset safely to LocalStorage
        saveImageToStorage(imageData);
    };
    reader.readAsDataURL(file);
}

/**
 * Constructs structural HTML elements for custom wardrobe uploads
 */
function displayImageOnCanvas(imageSrc) {
    const canvas = document.getElementById('closet-canvas');
    if (!canvas) return;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'clothing-item';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = "User Wardrobe Upload";

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = '✕';
    
    // Wire delete button to clean both the UI interface and LocalStorage state
    deleteBtn.onclick = function() { 
        itemDiv.remove(); 
        removeImageFromStorage(imageSrc);
    };

    itemDiv.appendChild(img);
    itemDiv.appendChild(deleteBtn);
    canvas.appendChild(itemDiv);
}

/**
 * Commits a data image reference array string directly into browser memory
 */
function saveImageToStorage(imageData) {
    let currentImages = JSON.parse(localStorage.getItem('digiClosetImages')) || [];
    currentImages.push(imageData);
    
    try {
        localStorage.setItem('digiClosetImages', JSON.stringify(currentImages));
    } catch (error) {
        alert("Your local browser storage is full! Try uploading smaller images or deleting older ones.");
    }
}

/**
 * Pulls stored image string collection sets to rebuild user canvas on initialization
 */
function loadSavedImages() {
    let savedImages = JSON.parse(localStorage.getItem('digiClosetImages')) || [];
    savedImages.forEach(imageData => {
        displayImageOnCanvas(imageData);
    });
}

/**
 * Drops matching targets from local array storage allocations
 */
function removeImageFromStorage(imageSrc) {
    let currentImages = JSON.parse(localStorage.getItem('digiClosetImages')) || [];
}