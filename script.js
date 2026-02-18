// State
let draggedElement = null;
let fieldCounter = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    initSearch();
    initScrollTop();
    initPreview();
    initFieldActions();
});

// Drag and Drop
function initDragAndDrop() {
    const elements = document.querySelectorAll('.element-item');
    const formContent = document.querySelector('.form-content');

    elements.forEach(element => {
        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        element.addEventListener('click', handleElementClick);
    });

    formContent.addEventListener('dragover', handleDragOver);
    formContent.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    return false;
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedElement) return;
    
    const type = draggedElement.dataset.type;
    addFieldToForm(type);
    
    draggedElement = null;
    return false;
}

function handleElementClick(e) {
    const type = this.dataset.type;
    addFieldToForm(type);
}

function addFieldToForm(type) {
    const field = createField(type);
    const formContent = document.querySelector('.form-content');
    formContent.appendChild(field);
}

// Create Field
function createField(type) {
    fieldCounter++;
    const fieldId = `${type}-${fieldCounter}`;
    const div = document.createElement('div');
    div.className = 'form-field field-item';
    div.dataset.fieldId = fieldId;
    
    let content = '';
    
    switch(type) {
        case 'heading':
            content = `
                <input type="text" placeholder="Enter heading text" style="font-size: 20px; font-weight: 600;">
            `;
            break;
            
        case 'name':
            content = `
                <label>Full Name</label>
                <div class="name-group">
                    <input type="text" placeholder="First Name">
                    <input type="text" placeholder="Last Name">
                </div>
            `;
            break;
            
        case 'address':
            content = `
                <label>Address</label>
                <textarea rows="3" placeholder="Enter address"></textarea>
            `;
            break;
            
        case 'email':
            content = `
                <label>Email Address</label>
                <input type="email" placeholder="email@example.com">
            `;
            break;
            
        case 'phone':
            content = `
                <label>Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000">
            `;
            break;
            
        case 'dob':
            content = `
                <label>Date of Birth<span class="required">*</span></label>
                <div class="dob-group">
                    <select>
                        <option>Date</option>
                        ${Array.from({length: 31}, (_, i) => `<option>${i + 1}</option>`).join('')}
                    </select>
                    <select>
                        <option>Month</option>
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                    </select>
                    <select>
                        <option>Year</option>
                        ${Array.from({length: 100}, (_, i) => `<option>${2024 - i}</option>`).join('')}
                    </select>
                </div>
            `;
            break;
            
        case 'image-upload':
            content = `
                <label>Upload Image<span class="required">*</span></label>
                <div class="upload-area" onclick="document.getElementById('file-${fieldId}').click()">
                    <input type="file" id="file-${fieldId}" accept="image/*,.pdf" style="display: none;" onchange="handleFileSelect(this)">
                    <p>📎 Drag and Drop file here or <a href="#">Choose file</a></p>
                    <small>Supported formats: JPEG, PNG, PDF.</small>
                    <small>Maximum size: 2 MB</small>
                </div>
            `;
            break;
            
        case 'image-caption':
            content = `
                <label>Image Caption</label>
                <input type="text" placeholder="Enter caption">
            `;
            break;
            
        case 'signature':
            content = `
                <label>Signature<span class="required">*</span></label>
                <div class="upload-area" style="min-height: 120px; background: #f9fafb;">
                    <p>✍️ Click to sign</p>
                </div>
            `;
            break;
            
        case 'dropdown':
            content = `
                <label>Select Option</label>
                <select>
                    <option>Choose an option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                </select>
            `;
            break;
            
        case 'rating':
            content = `
                <label>Rating</label>
                <div style="font-size: 24px; color: #fbbf24;">
                    <span class="star" onclick="setRating(this, 1)">☆</span>
                    <span class="star" onclick="setRating(this, 2)">☆</span>
                    <span class="star" onclick="setRating(this, 3)">☆</span>
                    <span class="star" onclick="setRating(this, 4)">☆</span>
                    <span class="star" onclick="setRating(this, 5)">☆</span>
                </div>
            `;
            break;
            
        case 'radio':
            content = `
                <label>Choose One</label>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                        <input type="radio" name="radio-${fieldId}">
                        <span>Option 1</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                        <input type="radio" name="radio-${fieldId}">
                        <span>Option 2</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; font-weight: normal;">
                        <input type="radio" name="radio-${fieldId}">
                        <span>Option 3</span>
                    </label>
                </div>
            `;
            break;
    }
    
    div.innerHTML = content + `
        <div class="field-actions">
            <button class="action-btn settings-btn" onclick="editField('${fieldId}')" title="Settings">⚙️</button>
            <button class="action-btn copy-btn" onclick="copyField('${fieldId}')" title="Copy">📋</button>
            <button class="action-btn delete-btn" onclick="deleteField('${fieldId}')" title="Delete">🗑️</button>
        </div>
    `;
    
    return div;
}

// Field Actions
function initFieldActions() {
    // Already handled in createField function
}

function editField(fieldId) {
    const field = document.querySelector(`[data-field-id="${fieldId}"]`);
    const label = field.querySelector('label');
    if (label) {
        const newLabel = prompt('Enter new label:', label.textContent.replace('*', ''));
        if (newLabel) {
            label.innerHTML = newLabel + (label.innerHTML.includes('*') ? '<span class="required">*</span>' : '');
        }
    }
}

function copyField(fieldId) {
    const field = document.querySelector(`[data-field-id="${fieldId}"]`);
    const clone = field.cloneNode(true);
    fieldCounter++;
    const newId = `${fieldId.split('-')[0]}-${fieldCounter}`;
    clone.dataset.fieldId = newId;
    field.parentNode.insertBefore(clone, field.nextSibling);
}

function deleteField(fieldId) {
    if (confirm('Are you sure you want to delete this field?')) {
        const field = document.querySelector(`[data-field-id="${fieldId}"]`);
        field.remove();
    }
}

// Search
function initSearch() {
    const searchInput = document.getElementById('searchElements');
    const elements = document.querySelectorAll('.element-item');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        elements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });
    });
}

// Scroll to Top
function initScrollTop() {
    const scrollBtn = document.getElementById('scrollTop');
    const canvas = document.getElementById('formCanvas');
    
    scrollBtn.addEventListener('click', () => {
        canvas.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    canvas.addEventListener('scroll', () => {
        if (canvas.scrollTop > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
}

// Preview
function initPreview() {
    const previewBtn = document.querySelector('.preview-btn');
    
    previewBtn.addEventListener('click', () => {
        const formContent = document.querySelector('.form-content').cloneNode(true);
        
        // Remove field actions from preview
        formContent.querySelectorAll('.field-actions').forEach(el => el.remove());
        formContent.querySelectorAll('.field-item').forEach(el => {
            el.style.border = 'none';
            el.style.padding = '0';
        });
        
        const previewWindow = window.open('', 'Preview', 'width=800,height=600');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Form Preview</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        padding: 40px;
                        background: #f9fafb;
                    }
                    .form-content {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    h2 { margin-bottom: 8px; }
                    .subtitle { color: #6b7280; margin-bottom: 30px; }
                    .form-field { margin-bottom: 25px; }
                    label { display: block; margin-bottom: 8px; font-weight: 500; }
                    input, select, textarea {
                        width: 100%;
                        padding: 10px 12px;
                        border: 1px solid #d1d5db;
                        border-radius: 6px;
                        font-size: 14px;
                        font-family: inherit;
                    }
                    .name-group, .dob-group {
                        display: grid;
                        gap: 15px;
                    }
                    .name-group { grid-template-columns: 1fr 1fr; }
                    .dob-group { grid-template-columns: repeat(3, 1fr); }
                    .required { color: #ef4444; }
                    .upload-area {
                        border: 2px dashed #d1d5db;
                        padding: 40px;
                        text-align: center;
                        border-radius: 8px;
                    }
                </style>
            </head>
            <body>
                ${formContent.outerHTML}
            </body>
            </html>
        `);
        previewWindow.document.close();
    });
}

// File Upload Handler
function handleFileSelect(input) {
    const file = input.files[0];
    if (file) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            alert('File size exceeds 2 MB limit');
            input.value = '';
            return;
        }
        
        const uploadArea = input.parentElement;
        uploadArea.innerHTML = `
            <p>✓ ${file.name}</p>
            <small>${(file.size / 1024).toFixed(2)} KB</small>
            <br><br>
            <button onclick="this.parentElement.parentElement.querySelector('input[type=file]').click()" 
                    style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;">
                Change File
            </button>
        `;
    }
}

// Rating Handler
function setRating(star, rating) {
    const stars = star.parentElement.querySelectorAll('.star');
    stars.forEach((s, index) => {
        s.textContent = index < rating ? '★' : '☆';
    });
}

// Layout Toggle
document.querySelectorAll('input[name="layout"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const formContent = document.querySelector('.form-content');
        if (e.target.value === 'card') {
            formContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            formContent.style.maxWidth = '600px';
            formContent.style.margin = '0 auto';
        } else {
            formContent.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            formContent.style.maxWidth = 'none';
            formContent.style.margin = '0';
        }
    });
});

// Add New Page
document.querySelector('.add-page').addEventListener('click', () => {
    const newPage = document.createElement('div');
    newPage.className = 'form-content';
    newPage.style.marginTop = '30px';
    newPage.innerHTML = `
        <h2>New Page</h2>
        <p class="subtitle">Add your content here</p>
    `;
    
    const canvas = document.getElementById('formCanvas');
    const addPageBtn = document.querySelector('.add-page');
    canvas.insertBefore(newPage, addPageBtn);
});

// Logo Upload
document.querySelector('.logo-upload').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const logoUpload = document.querySelector('.logo-upload');
                logoUpload.innerHTML = `<img src="${event.target.result}" style="max-height: 80px;">`;
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});
