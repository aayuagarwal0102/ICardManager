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
    const dashboardSection = document.getElementById('dashboard');
    const allSchoolsSection = document.querySelector('.all-schools');
    const cardDesignsSection = document.querySelector('.card-designs');

    function hideAllSections() {
        dashboardSection.style.display = 'none';
        allSchoolsSection.style.display = 'none';
        cardDesignsSection.style.display = 'none';
    }

    document.querySelector('a[href="#card-designs"]').addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        cardDesignsSection.style.display = 'block';
      
        // Rebind the edit button now that it's in the DOM
        document.querySelectorAll(".editCardBtn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const template = e.target.closest(".template-1"); // wrapper
            activeCard = template.querySelector(".id-card"); // find card inside it
            if (activeCard) {
              document.getElementById("editCardModal").style.display = "block";
            }
          });
        });
      });
      

    document.querySelector('a[href="#school"]').addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        allSchoolsSection.style.display = 'block';
    });

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
        const checkboxes = document.querySelectorAll('.student-checkbox');
        const printButton = document.getElementById('printButton');
        const maxSelection = 50;
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const selected = document.querySelectorAll('.student-checkbox:checked').length;
        
                if (selected > 0 && selected <= maxSelection) {
                    printButton.disabled = false;
                    printButton.classList.remove('disabled');
                } else {
                    printButton.disabled = true;
                    printButton.classList.add('disabled');
                }
        
                if (selected >= maxSelection) {
                    checkboxes.forEach(box => {
                        if (!box.checked) box.disabled = true;
                    });
                } else {
                    checkboxes.forEach(box => box.disabled = false);
                }
            });
        });
        });
        
        