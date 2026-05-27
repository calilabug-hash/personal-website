document.addEventListener('DOMContentLoaded', () => {
    // 1. Match the IDs on your HTML form
    const photoInput = document.getElementById('clothingPhoto'); 
    const canvasPreview = document.querySelector('.preview-box'); // The white dashed box container
    
    // 2. Check if the element exists before adding listeners
    if (photoInput) {
        photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    // Clear the "No photo uploaded yet." text
                    canvasPreview.innerHTML = '';
                    
                    // Create and style the uploaded image
                    const img = document.createElement('img');
                    img.src = reader.result;
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '100%';
                    img.style.objectFit = 'contain';
                    img.style.borderRadius = '8px';
                    
                    // Insert the image into your pink canvas preview area
                    canvasPreview.appendChild(img);
                });
                
                reader.readAsDataURL(file);
            }
        });
    }

    // 3. Handle the form submit action
    const uploadForm = document.getElementById('outfitUploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const itemName = document.getElementById('clothingItemName').value;
            const itemCategory = document.getElementById('categorySelect').value;
            
            alert(`Success! "${itemName}" was successfully added to your ${itemCategory} slot.`);
        });
    }
});