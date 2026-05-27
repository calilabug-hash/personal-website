document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('outfitUploadForm');
    const photoInput = document.getElementById('clothingPhoto'); 
    const canvasPreview = document.querySelector('.preview-box'); 
    
    // Track the current image data string globally in this session
    let currentImageData = "";

    // 1. Load any previously saved closet items when the page opens
    loadSavedCloset();
    
    if (photoInput) {
        photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    // Store the text string version of the image globally
                    currentImageData = reader.result;

                    // Clear the old layout placeholder and show the preview image
                    canvasPreview.innerHTML = '';
                    
                    const img = document.createElement('img');
                    img.src = currentImageData;
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '100%';
                    img.style.objectFit = 'contain';
                    img.style.borderRadius = '8px';
                    
                    canvasPreview.appendChild(img);
                });
                
                reader.readAsDataURL(file);
            }
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const itemName = document.getElementById('clothingItemName').value;
            const itemCategory = document.getElementById('categorySelect').value;
            
            if (!currentImageData) {
                alert("Please select or take a photo before inserting!");
                return;
            }

            // Create a structured item object
            const clothingItem = {
                id: Date.now(), // Unique identifier
                name: itemName,
                category: itemCategory,
                image: currentImageData
            };

            // Save this item into our persistent localStorage array
            saveItemToStorage(clothingItem);

            alert(`Success! "${itemName}" was successfully locked to your digital closet workspace!`);
        });
    }

    // Helper Function: Save item data into the browser memory array
    function saveItemToStorage(item) {
        // Fetch existing items or start a blank list if empty
        let closet = JSON.parse(localStorage.getItem('myDigitalCloset')) || [];
        closet.push(item);
        
        // Convert the updated array back to a string and store it
        localStorage.setItem('myDigitalCloset', JSON.stringify(closet));
    }

    // Helper Function: Look up stored items and reconstruct them on screen load
    function loadSavedCloset() {
        let closet = JSON.parse(localStorage.getItem('myDigitalCloset')) || [];
        
        // If there are saved items, display the most recent one on your active canvas workspace
        if (closet.length > 0) {
            const lastItem = closet[closet.length - 1];
            
            // Set the form inputs to match the last item saved
            document.getElementById('clothingItemName').value = lastItem.name;
            document.getElementById('categorySelect').value = lastItem.category;
            
            // Auto-populate the active preview canvas frame
            canvasPreview.innerHTML = '';
            const img = document.createElement('img');
            img.src = lastItem.image;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain';
            img.style.borderRadius = '8px';
            
            canvasPreview.appendChild(img);
            
            // Keep the text reference live
            currentImageData = lastItem.image;
        }
    }
});