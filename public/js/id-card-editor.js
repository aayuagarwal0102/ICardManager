document.addEventListener('DOMContentLoaded', function() {
    const draggableElements = document.querySelectorAll('.draggable');
    let selectedElement = null;
    let initialX = 0;
    let initialY = 0;
    let currentX = 0;
    let currentY = 0;

    // Make elements draggable
    draggableElements.forEach(element => {
        element.style.position = 'absolute';
        element.style.cursor = 'move';
        
        // Add drag handles
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        element.appendChild(dragHandle);

        element.addEventListener('mousedown', startDragging);
        element.addEventListener('touchstart', startDragging, { passive: false });
    });

    function startDragging(e) {
        if (!e.target.closest('.drag-handle')) return;
        
        selectedElement = this;
        
        // Get initial positions
        if (e.type === 'mousedown') {
            initialX = e.clientX - selectedElement.offsetLeft;
            initialY = e.clientY - selectedElement.offsetTop;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDragging);
        } else if (e.type === 'touchstart') {
            e.preventDefault();
            initialX = e.touches[0].clientX - selectedElement.offsetLeft;
            initialY = e.touches[0].clientY - selectedElement.offsetTop;
            
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', stopDragging);
        }

        // Add active class
        selectedElement.classList.add('dragging');
    }

    function drag(e) {
        if (!selectedElement) return;
        
        e.preventDefault();

        if (e.type === 'mousemove') {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        } else if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        }

        // Get parent card boundaries
        const card = selectedElement.closest('.id-card');
        const cardRect = card.getBoundingClientRect();
        const elementRect = selectedElement.getBoundingClientRect();

        // Constrain movement within card boundaries
        currentX = Math.max(0, Math.min(currentX, cardRect.width - elementRect.width));
        currentY = Math.max(0, Math.min(currentY, cardRect.height - elementRect.height));

        // Update element position
        selectedElement.style.left = currentX + 'px';
        selectedElement.style.top = currentY + 'px';

        // Save position
        saveElementPosition(selectedElement);
    }

    function stopDragging() {
        if (!selectedElement) return;

        selectedElement.classList.remove('dragging');
        selectedElement = null;

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('touchend', stopDragging);
    }

    async function saveElementPosition(element) {
        // Get all draggable elements positions
        const positions = {};
        draggableElements.forEach(el => {
            positions[el.dataset.field] = {
                left: el.style.left,
                top: el.style.top
            };
        });

        try {
            const selectedTemplate = document.querySelector('#templateSelect')?.value || 'template1';
            const response = await fetch('/admin/select-template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedTemplate,
                    layout: positions
                })
            });

            if (!response.ok) {
                console.error('Failed to save template layout');
            }
        } catch (error) {
            console.error('Error saving template layout:', error);
        }
    }

    // Load saved positions on page load
    async function loadSavedPositions() {
        try {
            const response = await fetch('/admin/template-layout');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.layout) {
                    draggableElements.forEach(element => {
                        const field = element.dataset.field;
                        if (data.layout[field]) {
                            element.style.left = data.layout[field].left;
                            element.style.top = data.layout[field].top;
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading template layout:', error);
        }
    }

    loadSavedPositions();

    // Handle save button click
    document.getElementById('saveTemplate')?.addEventListener('click', async function() {
        await saveElementPosition();
        alert('Template layout saved successfully!');
    });

    // Handle reset button click
    document.getElementById('resetTemplate')?.addEventListener('click', function() {
        draggableElements.forEach(element => {
            element.style.left = '0';
            element.style.top = '0';
        });
        saveElementPosition();
    });
}); 