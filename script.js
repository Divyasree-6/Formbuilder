let formFields = [];
let formId = null;

document.addEventListener('DOMContentLoaded', () => {
    checkIfFormFillMode();
    setupEventListeners();
});

function setupEventListeners() {
    document.querySelectorAll('.element-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            addFieldToForm(type);
        });
    });
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

function addFieldToForm(type) {
    document.querySelector('.empty-canvas').style.display = 'none';
    document.getElementById('formBuilder').style.display = 'block';
    
    const fieldId = Date.now();
    let label = '';
    let required = false;
    
    if (type === 'heading') {
        label = prompt('Enter heading text:') || 'Heading';
    } else {
        label = prompt(`Enter label for ${type}:`) || type.charAt(0).toUpperCase() + type.slice(1);
        required = confirm('Is this field required?');
    }
    
    const field = { id: fieldId, type, label, required };
    formFields.push(field);
    renderForm();
}

function renderForm() {
    const formBuilder = document.getElementById('formBuilder');
    formBuilder.innerHTML = formFields.map(field => {
        let html = `<div class="form-field" data-id="${field.id}">`;
        
        if (field.type === 'heading') {
            html += `<h2 class="field-heading">${field.label}</h2>`;
        } else {
            html += `<label class="field-label">${field.label}${field.required ? '<span class="required">*</span>' : ''}</label>`;
            
            switch(field.type) {
                case 'name':
                    html += `<input type="text" class="field-input" placeholder="Enter ${field.label}">`;
                    break;
                case 'address':
                    html += `<textarea class="field-textarea" placeholder="Enter address"></textarea>`;
                    break;
                case 'email':
                    html += `<input type="email" class="field-input" placeholder="Enter email">`;
                    break;
                case 'phone':
                    html += `<input type="tel" class="field-input" placeholder="Enter phone number">`;
                    break;
                case 'dob':
                    html += `<input type="date" class="field-input">`;
                    break;
                case 'dropdown':
                    html += `<select class="field-select">
                        <option>Select option</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                    </select>`;
                    break;
                case 'radio':
                    html += `<div class="radio-group">
                        <label><input type="radio" name="radio${field.id}"> Option 1</label>
                        <label><input type="radio" name="radio${field.id}"> Option 2</label>
                    </div>`;
                    break;
            }
        }
        
        html += `<button class="delete-field-btn" onclick="deleteField(${field.id})">🗑️ Delete</button>`;
        html += `</div>`;
        return html;
    }).join('');
    
    formBuilder.innerHTML += `<button class="generate-form-btn" id="generateFormBtn" onclick="generateFormLink()">Generate Form</button>`;
}

function deleteField(id) {
    if (confirm('Delete this field?')) {
        formFields = formFields.filter(f => f.id !== id);
        if (formFields.length === 0) {
            document.querySelector('.empty-canvas').style.display = 'flex';
            document.getElementById('formBuilder').style.display = 'none';
        } else {
            renderForm();
        }
    }
}

function generateFormLink() {
    if (formFields.length === 0) {
        alert('Please add at least one field to your form!');
        return;
    }
    
    formId = 'form_' + Date.now();
    const formName = document.getElementById('formTitle').textContent;
    const formLink = `${window.location.origin}${window.location.pathname}?form=${formId}`;
    
    const formData = {
        name: formName,
        fields: formFields,
        responses: []
    };
    
    localStorage.setItem(formId, JSON.stringify(formData));
    
    document.getElementById('formLink').value = formLink;
    document.getElementById('linkModal').style.display = 'flex';
}

function copyLink() {
    const linkInput = document.getElementById('formLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function closeModal() {
    document.getElementById('linkModal').style.display = 'none';
}

function checkIfFormFillMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const formParam = urlParams.get('form');
    
    if (formParam) {
        const savedForm = localStorage.getItem(formParam);
        if (savedForm) {
            const formData = JSON.parse(savedForm);
            displayFormForFilling(formData, formParam);
        } else {
            alert('Form not found!');
        }
    }
}

function displayFormForFilling(formData, formId) {
    document.querySelector('.sidebar').style.display = 'none';
    document.querySelector('.header').style.display = 'none';
    
    const formCanvas = document.getElementById('formCanvas');
    formCanvas.innerHTML = `
        <div class="fill-form-container">
            <h1 class="form-fill-title">${formData.name}</h1>
            <form id="responseForm" class="response-form">
                ${formData.fields.map(field => {
                    if (field.type === 'heading') {
                        return `<h2 class="form-section-heading">${field.label}</h2>`;
                    }
                    
                    let inputHtml = '';
                    switch(field.type) {
                        case 'name':
                            inputHtml = `<input type="text" name="field_${field.id}" class="response-input" ${field.required ? 'required' : ''}>`;
                            break;
                        case 'address':
                            inputHtml = `<textarea name="field_${field.id}" class="response-textarea" ${field.required ? 'required' : ''}></textarea>`;
                            break;
                        case 'email':
                            inputHtml = `<input type="email" name="field_${field.id}" class="response-input" ${field.required ? 'required' : ''}>`;
                            break;
                        case 'phone':
                            inputHtml = `<input type="tel" name="field_${field.id}" class="response-input" ${field.required ? 'required' : ''}>`;
                            break;
                        case 'dob':
                            inputHtml = `<input type="date" name="field_${field.id}" class="response-input" ${field.required ? 'required' : ''}>`;
                            break;
                        case 'dropdown':
                            inputHtml = `<select name="field_${field.id}" class="response-select" ${field.required ? 'required' : ''}>
                                <option value="">Select option</option>
                                <option>Option 1</option>
                                <option>Option 2</option>
                            </select>`;
                            break;
                        case 'radio':
                            inputHtml = `<div class="response-radio-group">
                                <label><input type="radio" name="field_${field.id}" value="Option 1" ${field.required ? 'required' : ''}> Option 1</label>
                                <label><input type="radio" name="field_${field.id}" value="Option 2"> Option 2</label>
                            </div>`;
                            break;
                    }
                    
                    return `
                        <div class="response-field">
                            <label class="response-label">${field.label}${field.required ? '<span class="required">*</span>' : ''}</label>
                            ${inputHtml}
                        </div>
                    `;
                }).join('')}
                <button type="submit" class="submit-form-btn">Submit Form</button>
            </form>
        </div>
    `;
    
    document.getElementById('responseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const response = {};
        
        formData.forEach((value, key) => {
            response[key] = value;
        });
        
        saveResponse(formId, response);
        alert('Form submitted successfully! Thank you.');
        e.target.reset();
    });
}

function saveResponse(formId, response) {
    const savedForm = JSON.parse(localStorage.getItem(formId));
    savedForm.responses.push({
        ...response,
        timestamp: new Date().toISOString(),
        submittedAt: new Date().toLocaleString()
    });
    localStorage.setItem(formId, JSON.stringify(savedForm));
    console.log('Response saved:', response);
}
