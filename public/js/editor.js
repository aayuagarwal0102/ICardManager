// This script assumes that 'template' and 'selectedStudentsData' variables
// are globally available, passed from the EJS file.

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT SELECTIONS ---
    const canvasFront = document.getElementById('canvas-front');
    const canvasContainer = document.querySelector('.canvas-area');
    const addTextBtn = document.querySelector('[data-tooltip="Add Text"]');
    const addImageBtn = document.getElementById('add-image-btn');
    const addFieldSelect = document.getElementById('add-field-select');
    const propertiesPanel = document.getElementById('properties-panel');
    const fontFamilySelect = document.getElementById('font-family-select');
    const fontSizeInput = document.getElementById('font-size-input');
    const colorInput = document.getElementById('color-input');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const proceedButton = document.querySelector('.btn-proceed');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomDisplay = document.getElementById('zoom-display');
    const bestFitBtn = document.getElementById('best-fit-btn');

    // --- 2. STATE VARIABLES ---
    let selectedElement = null;
    let currentZoom = 1;
    const ZOOM_STEP = 0.1, MIN_ZOOM = 0.2, MAX_ZOOM = 3.0;

    // --- 3. ZOOM FUNCTIONS ---
    function updateZoom() {
        const transform = `scale(${currentZoom})`;
        canvasFront.style.transform = transform;
        zoomDisplay.textContent = `ZOOM: ${Math.round(currentZoom * 100)}%`;
    }

    function applyBestFit() {
        setTimeout(() => {
            if (!canvasContainer || !canvasFront) return;
            const scale = Math.min(canvasContainer.clientWidth / canvasFront.offsetWidth, canvasContainer.clientHeight / canvasFront.offsetHeight) * 0.9;
            currentZoom = Math.max(MIN_ZOOM, scale);
            updateZoom();
        }, 50);
    }
    
    // --- 4. CORE FUNCTIONS ---
    // Apni file mein is function ko dhundhein aur isse replace karein

function collectDesignData() {
    const elements = canvasFront.querySelectorAll('.draggable-element');
    const elementsData = Array.from(elements).map(el => {
        const x = parseFloat(el.getAttribute('data-x')) || 0;
        const y = parseFloat(el.getAttribute('data-y')) || 0;
        const baseData = { id: el.id, x, y, width: el.style.width, height: el.style.height };
        
        if (el.dataset.type === 'image') {
            const img = el.querySelector('img');
            const shape = img.classList.contains('is-circular') ? 'circle' : 'rectangle';
            return { ...baseData, type: 'image', content: img.getAttribute('data-placeholder'), shape: shape };
        } else { // Text element
            return {
                ...baseData,
                type: 'text',
                content: el.querySelector('.text-content').getAttribute('data-placeholder'),
                // ✨ FIX: Send the stored label, not the preview text ✨
                label: el.dataset.label || '', 
                fontFamily: el.style.fontFamily,
                fontSize: el.style.fontSize,
                color: el.style.color,
                fontWeight: el.style.fontWeight,
                fontStyle: el.style.fontStyle,
                textDecoration: el.style.textDecoration
            };
        }
    });
    return { backgroundImage: canvasFront.style.backgroundImage, elements: elementsData };
}

    // --- 5. ELEMENT CREATION ---
   function createTextElement(options = {}) {
    // We add a 'label' property to the config
    const config = { id: `element-${Date.now()}`, displayText: 'New Text', placeholder: '{{custom.new_text}}', label: '', fontSize: '12px', fontFamily: 'Roboto', color: '#000000', x: 20, y: 20, ...options };
    const element = document.createElement('div');
    element.className = 'draggable-element';
    element.id = config.id;
    element.dataset.type = 'text';
    // Store the label in a data-attribute for later retrieval
    element.dataset.label = config.label;
    
    element.style.transform = `translate(${config.x}px, ${config.y}px)`;
    element.style.fontFamily = config.fontFamily;
    element.style.fontSize = config.fontSize;
    element.style.color = config.color;
    element.style.fontWeight = config.fontWeight || 'normal';
    element.style.fontStyle = config.fontStyle || 'normal';
    element.style.textDecoration = config.textDecoration || 'none';
    element.innerHTML = `<div class="selection-box"></div><div class="text-content" data-placeholder="${config.placeholder}">${config.displayText}</div><div class="floating-toolbar"><button class="toolbar-btn delete-btn" title="Delete"><span class="material-symbols-outlined">delete</span></button></div>`;
    element.setAttribute('data-x', config.x);
    element.setAttribute('data-y', config.y);
    canvasFront.appendChild(element);
    makeElementInteractive(element);
    addToolbarListeners(element);
}

    // Apni file mein is function ko dhundhein aur isse replace karein

function createImageElement(options = {}) {
    const config = { id: `element-${Date.now()}`, placeholder: '{{student.photo}}', width: '90px', height: '110px', x: 250, y: 30, ...options };
    const element = document.createElement('div');
    element.className = 'draggable-element';
    element.id = config.id;
    element.dataset.type = 'image';
    element.style.transform = `translate(${config.x}px, ${config.y}px)`;
    element.style.width = config.width;
    element.style.height = config.height;
    element.style.border = '1px dashed #999';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';

    // ===== ✨ FIX YAHAN HAI: Hum image ka source (URL) check kar rahe hain =====
    let imageSrc = '/images/placeholder-image.png'; // Default placeholder
    
    // Check karo ki kya placeholder school logo ka hai
    if (config.placeholder === '{{school.logo}}') {
        // Agar haan, to 'school' object (jo ejs se aa raha hai) se asli logo ka URL use karo
        // Agar school object mein logo nahi hai, to default placeholder use karo
        imageSrc = school.logo || '/images/placeholder-image.png';
    }
    // =========================================================================
    
    element.innerHTML = `
        <div class="selection-box"></div>
        <img src="${imageSrc}" data-placeholder="${config.placeholder}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
        <div class="floating-toolbar">
            <button class="toolbar-btn shape-toggle-btn" title="Change Shape"><span class="material-symbols-outlined">pentagon</span></button>
            <button class="toolbar-btn delete-btn" title="Delete"><span class="material-symbols-outlined">delete</span></button>
        </div>
    `;

    element.setAttribute('data-x', config.x);
    element.setAttribute('data-y', config.y);
    canvasFront.appendChild(element);
    makeElementInteractive(element);
    addToolbarListeners(element);
}
    
    // --- 6. SELECTION & INTERACTIVITY ---
    function selectElement(element) {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
            if (selectedElement.dataset.type === 'text') {
                const prevTextContent = selectedElement.querySelector('.text-content');
                if (prevTextContent) prevTextContent.setAttribute('contenteditable', 'false');
            }
        }
        selectedElement = element;
        if (selectedElement) {
            selectedElement.classList.add('selected');
            if (element.dataset.type === 'text') {
                propertiesPanel.classList.remove('hidden');
                updatePanelFromElement();
            } else {
                propertiesPanel.classList.add('hidden');
            }
        } else {
            propertiesPanel.classList.add('hidden');
        }
    }

    // Find this function in your public/js/editor.js and replace it.

// Apni file mein is function ko dhundhein aur isse replace karein

 function makeElementInteractive(element) {
        interact(element).draggable({
            listeners: {
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.dx / currentZoom);
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.dy / currentZoom);
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        }).resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    const target = event.target;
                    target.style.width = `${event.rect.width}px`;
                    target.style.height = `${event.rect.height}px`;
                    const x = parseFloat(target.getAttribute('data-x')) || 0;
                    const y = parseFloat(target.getAttribute('data-y')) || 0;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                }
            }
        }).on('tap', (event) => {
            if (!event.target.closest('.floating-toolbar')) {
                selectElement(event.currentTarget);
            }
            event.stopPropagation();
        }).on('doubletap', (event) => {
            const target = event.currentTarget;
            if (target.dataset.type === 'image') return;
            const textContent = target.querySelector('.text-content');
            textContent.setAttribute('contenteditable', 'true');
            textContent.focus();
            event.stopPropagation();
        });
    }

    function addToolbarListeners(element) {
    // Delete button ka logic
    const deleteBtn = element.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedElement === element) selectElement(null);
            element.remove();
        });
    }

    // ✨ FIX: "Change Shape" button ka naya logic ✨
    const shapeToggleBtn = element.querySelector('.shape-toggle-btn');
    if (shapeToggleBtn) {
        shapeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Event ko aage badhne se roko
            const img = element.querySelector('img');
            if (img) {
                // 'is-circular' class ko add ya remove karo (toggle)
                img.classList.toggle('is-circular');
            }
        });
    }
}

    // --- 7. EVENT LISTENERS ---
    addTextBtn.addEventListener('click', () => createTextElement());
    addImageBtn.addEventListener('click', () => createImageElement());
    // Apni file mein is poore event listener ko dhundhein aur replace karein

// Apni file mein is poore event listener ko dhundhein aur isse replace karein

addFieldSelect.addEventListener('change', () => {
    const selectedOption = addFieldSelect.options[addFieldSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) return;

    const placeholder = selectedOption.value;
    const friendlyName = selectedOption.text;

    if (placeholder.includes('school.logo')) {
        createImageElement({ placeholder: placeholder, width: '50px', height: '50px', x: 150, y: 10 });
        addFieldSelect.selectedIndex = 0;
        return;
    }

    let previewText = friendlyName;
    if (selectedStudentsData && selectedStudentsData.length > 0) {
        const firstStudent = selectedStudentsData[0];
        const keyMatch = placeholder.match(/student\.(\w+)/);
        if (keyMatch) {
            const key = keyMatch[1];
            let studentData = '';
            if (key === 'dob' && firstStudent.dob) {
                try {
                    const date = new Date(firstStudent.dob);
                    studentData = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
                } catch (e) { studentData = 'Invalid Date'; }
            } else if (firstStudent[key]) {
                studentData = firstStudent[key];
            }
            if (studentData) {
                previewText += ` - ${studentData}`;
            }
        }
    }

    // Pass the 'label' to the create function
    createTextElement({
        displayText: previewText,
        placeholder: placeholder,
        label: friendlyName, // <-- This is the important part
        x: 40,
        y: 40
    });

    addFieldSelect.selectedIndex = 0;
});
    canvasFront.addEventListener('click', (e) => { if(e.target === canvasFront) selectElement(null); });
    zoomInBtn.addEventListener('click', () => { currentZoom = Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP); updateZoom(); });
    zoomOutBtn.addEventListener('click', () => { currentZoom = Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP); updateZoom(); });
    bestFitBtn.addEventListener('click', applyBestFit);
    window.addEventListener('resize', applyBestFit);
    
    [fontFamilySelect, fontSizeInput, colorInput].forEach(el => el.addEventListener('input', updateElementFromPanel));
    [boldBtn, italicBtn, underlineBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            updateElementFromPanel();
        });
    });

    proceedButton.addEventListener('click', async () => {
        proceedButton.disabled = true;
        proceedButton.innerText = 'Generating...';
        const designData = collectDesignData();
        const payload = { design: designData, students: selectedStudentsData };
        try {
            const response = await fetch('/admin/generate-cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
            const finalHtml = await response.text();
            const newTab = window.open();
            newTab.document.open();
            newTab.document.write(finalHtml);
            newTab.document.close();
        } catch (error) {
            console.error('Failed to generate cards:', error);
            alert('Could not generate ID cards. Please check the console for details.');
        } finally {
            proceedButton.disabled = false;
            proceedButton.innerText = 'PROCEED';
        }
    });

    // --- 8. INITIALIZATION ---
    function initializeEditor() {
        if (template.backgroundImage) { canvasFront.style.backgroundImage = `url('${template.backgroundImage}')`; }
        if (template.elements && template.elements.length > 0) {
            template.elements.forEach(el => el.type === 'image' ? createImageElement(el) : createTextElement(el));
        } else {
            createTextElement({ displayText: 'Student Name', placeholder: '{{student.name}}', x: 20, y: 80, fontSize: '14px', fontWeight: 'bold' });
            createTextElement({ displayText: 'Class: X', placeholder: '{{student.class}}', x: 20, y: 110 });
            createTextElement({ displayText: 'Roll No: 123', placeholder: '{{student.rollNo}}', x: 20, y: 130 });
            createImageElement({ placeholder: '{{student.photo}}', x: 250, y: 30 });
        }
        applyBestFit();
    }

    // Helper functions needed by other parts of the code
    function updatePanelFromElement() {
        if (!selectedElement || selectedElement.dataset.type !== 'text') return;
        fontFamilySelect.value = selectedElement.style.fontFamily;
        fontSizeInput.value = parseFloat(selectedElement.style.fontSize);
        colorInput.value = rgbToHex(selectedElement.style.color);
        boldBtn.classList.toggle('active', selectedElement.style.fontWeight === 'bold');
        italicBtn.classList.toggle('active', selectedElement.style.fontStyle === 'italic');
        underlineBtn.classList.toggle('active', selectedElement.style.textDecoration === 'underline');
    }
    function updateElementFromPanel() {
        if (!selectedElement || selectedElement.dataset.type !== 'text') return;
        selectedElement.style.fontFamily = fontFamilySelect.value;
        selectedElement.style.fontSize = `${fontSizeInput.value}px`;
        selectedElement.style.color = colorInput.value;
        selectedElement.style.fontWeight = boldBtn.classList.contains('active') ? 'bold' : 'normal';
        selectedElement.style.fontStyle = italicBtn.classList.contains('active') ? 'italic' : 'normal';
        selectedElement.style.textDecoration = underlineBtn.classList.contains('active') ? 'underline' : 'none';
    }
    const rgbToHex = (rgb) => {
        if (!rgb || !rgb.includes('rgb')) return rgb;
        let [r, g, b] = rgb.match(/\d+/g).map(Number);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    };

    initializeEditor();
});