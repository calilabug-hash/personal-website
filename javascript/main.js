JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('outfitUploadForm');
    const photoInput = document.getElementById('clothingPhoto');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const outputCanvasImage = document.getElementById('outputCanvasImage');
    const outputItemTitle = document.getElementById('outputItemTitle');

    if (uploadForm && photoInput) {
        photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                // Parse file stream data content
                reader.addEventListener('load', function() {
                    // Hide placeholder text container
                    imagePlaceholder.classList.add('hidden');
                    
                    // Populate target template element path parameters with live data stream
                    outputCanvasImage.setAttribute('src', this.result);
                    outputCanvasImage.classList.remove('hidden');
                });
                
                reader.readAsDataURL(file);
            }
        });

        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const itemName = document.getElementById('clothingItemName').value;
            const itemCategory = document.getElementById('categorySelect').value;
            
            // Map text details over canvas block frame
            outputItemTitle.textContent = `${itemName} [Slot: ${itemCategory.toUpperCase()}]`;
            alert(`Success! "${itemName}" was successfully locked to your digital closet canvas data tree.`);
        });
    }
});

// Get references to our HTML elements
const fileInput = document.getElementById('clothing-upload');
const canvasPreview = document.getElementById('canvas-preview');
const placeholderText = document.getElementById('placeholder-text');

// Listen for when a user selects a file
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
        const reader = new FileReader();

        // When the file is done reading, create an image element
        reader.onload = function(e) {
            // Remove the placeholder text if it exists
            if (placeholderText) {
                placeholderText.style.display = 'none';
            }

            // Check if an image is already there, remove it to update with the new one
            const existingImg = canvasPreview.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }

            // Create and style the new image element
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.borderRadius = '8px';

            // Drop the image right into the canvas preview container
            canvasPreview.appendChild(img);
        };

        // Read the image file as a data URL
        reader.readAsDataURL(file);
    }
});