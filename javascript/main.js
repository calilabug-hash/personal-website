// Navigation Router Controller 
function switchView(viewId) {
    // Hide all view panels
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(section => section.classList.remove('active-view'));
    
    // Show requested view panel
    const targetSection = document.getElementById(viewId);
    if(targetSection) targetSection.classList.add('active-view');

    // Toggle Highlight indicator links on navigation bars
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${viewId}`) {
            link.classList.add('active');
        }
    });
}

// Outfit Builder / Photo Upload Logic
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const canvas = document.getElementById('closet-canvas');
        
        // Construct fresh wardrobe canvas component element
        const itemDiv = document.createElement('div');
        itemDiv.className = 'clothing-item';
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = "User Wardrobe Upload";

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerText = '✕';
        deleteBtn.onclick = function() { itemDiv.remove(); };

        itemDiv.appendChild(img);
        itemDiv.appendChild(deleteBtn);
        canvas.appendChild(itemDiv);
    };
    reader.readAsDataURL(file);
}

// Wishlist State Tracker
let wishlistItems = [];

function addWishlistItem(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('item-name');
    const costInput = document.getElementById('item-cost');
    const notesInput = document.getElementById('item-notes');

    const item = {
        id: Date.now(),
        name: nameInput.value,
        cost: parseFloat(costInput.value),
        notes: notesInput.value || "No extra notes details added."
    };

    wishlistItems.push(item);
    renderWishlist();

    // Clear Input Form Elements
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

    // Update Budget Summarization Metrics on View UI
    document.getElementById('total-items').innerText = wishlistItems.length;
    document.getElementById('total-budget').innerText = accumulatedCost.toFixed(2);
}