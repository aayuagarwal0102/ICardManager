document.addEventListener("DOMContentLoaded", function () {
    // Sidebar collapse
    const toggleButton = document.querySelector('.expnd');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const arrowIcon = document.querySelector('.toggle-arrow');

    function toggleCollapse() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('collapsed');
        arrowIcon.textContent = sidebar.classList.contains('collapsed')
            ? 'keyboard_double_arrow_right'
            : 'keyboard_double_arrow_left';
    }

    toggleButton.addEventListener('click', toggleCollapse);

    // Dark mode
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeSwitch.checked = true;
    }

    darkModeSwitch.addEventListener('change', () => {
        if (darkModeSwitch.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
        }
    });

    // Section switching
  
      

    // School row handling
    const schoolRows = document.querySelectorAll('.school-row');
    const viewButtons = document.querySelectorAll('.view-image-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');

    schoolRows.forEach(row => {
        row.addEventListener('click', () => {
            const schoolId = row.getAttribute('data-school-id');
            window.location.href = `/admin/schools/${schoolId}/classes`;
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // show image logic...
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // remove logic...
        });
    });



    // -----------------------
    // 💡 EDIT ID CARD SECTION
 

})


//  image popup

function closeImagePopup() {
    document.getElementById('imagePopup').style.display = 'none';
    document.getElementById('popupStudentImage').src = ''; // Clear image on close
    }
    
    
    
    document.addEventListener("DOMContentLoaded", function () {
    const imageBtns = document.querySelectorAll(".view-image-btn");
    const imagePopup = document.getElementById("imagePopup");
    const imageElement = document.getElementById("popupStudentImage");
    
    imageBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const imgPath = btn.getAttribute("data-img");
      imageElement.src = imgPath.startsWith("http") ? imgPath : `/${imgPath}`;
      imagePopup.style.display = "flex";
    });
    });
    });

    // for print button in student.ejs 

    document.addEventListener('DOMContentLoaded', () => {
        const selectAllCheckbox = document.getElementById('selectAll');
        const studentCheckboxes = document.querySelectorAll('.student-checkbox');
        const printButton = document.getElementById('printButton');
        const maxSelection = 50;
        
        function toggleSelectAll() {
            const isChecked = selectAllCheckbox.checked;
            studentCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updatePrintButtonState();
        }

        function updatePrintButtonState() {
            const selectedCount = document.querySelectorAll('.student-checkbox:checked').length;
            printButton.disabled = selectedCount === 0;
            printButton.classList.toggle('disabled', selectedCount === 0);
        }

        selectAllCheckbox.addEventListener('change', toggleSelectAll);
        studentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updatePrintButtonState);
        });
    });
        
        // search logic for schools

    const searchInput = document.getElementById('searchSchool');
    const tableBody = document.getElementById('schoolTableBody');

    searchInput.addEventListener('keyup', function () {
        const searchTerm = this.value.toLowerCase();
        const rows = tableBody.querySelectorAll('.school-row');

        rows.forEach(row => {
            const schoolName = row.children[2].textContent.toLowerCase(); // 3rd <td> is school name
            if (schoolName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
        