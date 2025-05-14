
// <-----------------               ---------------------->
// <-----------------SIDE-BAR EXPANSION---------------------->
// <-----------------               ---------------------->
function toggleSubMenu(id, element) {
  const submenu = document.getElementById(id);
  submenu.classList.toggle('show');

  const arrow = element.querySelector('.arrow');
  if (arrow) {
    arrow.classList.toggle('rotate');
  }
}


// <---------------------------                ----------------------->
// <--------------------------- DROPDOWN- MY PROFILE----------------------->
// <---------------------------                ----------------------->
function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("show");
}
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
      let dropdowns = document.getElementsByClassName("dropdown-menu");
      for (let i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
              openDropdown.classList.remove("show");
          }
      }
  }
}

document.querySelector('.menu-toggle').addEventListener('click', function () {
  document.querySelector('.sidebar').classList.toggle('show');
});

const holidays = {
 
};

// <---------------------------               ----------------------------->
// <---------------------------   CELENDAR    ----------------------------->
// <---------------------------               ----------------------------->

function generateCalendar(month, year) {
    const calendarDays = document.getElementById("calendarDays");
    const currentMonthYear = document.getElementById("currentMonthYear");
    calendarDays.innerHTML = "";

    const date = new Date(year, month);
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    currentMonthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

    // Blank days before the 1st
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        calendarDays.appendChild(emptyDiv);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        dayDiv.classList.add("day");

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add("today");
        }

        if (holidays[dateString]) {
            dayDiv.classList.add("holiday");
            dayDiv.textContent = `${day} (${holidays[dateString]})`;
        } else {
            dayDiv.textContent = day;
        }

        calendarDays.appendChild(dayDiv);
    }
}

// Default month/year
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

generateCalendar(currentMonth, currentYear);

// Navigation
document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

// <-------------------------------                   ------------------------>
// <-------------------------------ADD TEACHER FORM------------------------>
// <-------------------------------                   ------------------------>
function showAddTeacherForm() {
  document.getElementById('dashboard').style.display = 'none'; // Hide dashboard
  document.getElementById('teacher-table').style.display = 'none'; // Hide dashboard
  document.getElementById('student-table').style.display = 'none';

  document.getElementById('add-teacher-form').style.display = 'block'; // Show form
}


//<--------------------                 --------------------------> 
//<--------------------TEACHER TABLE--------------------------> 
//<--------------------                 --------------------------> 
const searchInput = document.getElementById('searchInput');
const sectionFilter = document.getElementById('sectionFilter');

function filterTable() {
const searchText = searchInput.value.toLowerCase();
const sectionValue = sectionFilter.value.toLowerCase();
const rows = document.querySelectorAll('#teacherTableBody tr');

rows.forEach(row => {
  const firstName = row.children[0].textContent.toLowerCase();
  const lastName = row.children[1].textContent.toLowerCase();
  const classAssigned = row.children[3].textContent.toLowerCase();
  const section = row.children[4].textContent.toLowerCase();

  const matchesSearch = firstName.includes(searchText) || lastName.includes(searchText) || classAssigned.includes(searchText);
  const matchesSection = sectionValue === '' || section.includes(sectionValue);

  row.style.display = (matchesSearch && matchesSection) ? '' : 'none';
});
}

searchInput.addEventListener('keyup', filterTable);
sectionFilter.addEventListener('change', filterTable);

function showTeacherTable() {
  document.getElementById('dashboard').style.display = 'none'; // Hide dashboard
  document.getElementById('add-teacher-form').style.display = 'none'; // Hide dashboard
  document.getElementById('student-table').style.display = 'none'; // Hide dashboard

  document.getElementById('teacher-table').style.display = 'block'; // Show form
  document.getElementById('update-teacher-details').style.display = 'none'; // Show form
}

function showUpdateForm() {
  document.getElementById('dashboard').style.display = 'none'; // Hide dashboard
  document.getElementById('add-teacher-form').style.display = 'none'; // Hide dashboard
  document.getElementById('student-table').style.display = 'none'; // Hide dashboard

  document.getElementById('teacher-table').style.display = 'none'; // Show form
  document.getElementById('update-teacher-details').style.display = 'block'; // Show form
}

// <--------------------student table------------------------>

const searchInput1 = document.getElementById('searchInput1');
  const sectionFilter1 = document.getElementById('sectionFilter1');
  const tableRows = document.querySelectorAll('#teacherTableBody tr');

  function filterTable() {
    const searchTerm = searchInput1.value.toLowerCase();
    const selectedSection = sectionFilter1.value;

    tableRows.forEach(row => {
      const name = row.children[1].textContent.toLowerCase();  // Full Name
      const rollNo = row.children[3].textContent.toLowerCase(); // Roll No
      const section = row.children[5].textContent.trim();       // Section

      const matchesSearch = name.includes(searchTerm) || rollNo.includes(searchTerm);
      const matchesSection = selectedSection === "" || section === selectedSection;

      if (matchesSearch && matchesSection) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  searchInput1.addEventListener('input', filterTable);
  sectionFilter1.addEventListener('change', filterTable);



function showStudents(){
document.getElementById('dashboard').style.display = 'none'; // Hide dashboard
document.getElementById('student-table').style.display = 'block'; // Hide dashboard
document.getElementById('teacher-table').style.display = 'none'; // Show form
document.getElementById('update-teacher-details').style.display = 'none'; // Show form
document.getElementById('add-teacher-form').style.display = 'none'; // Hide dashboard



}

// <-------------------------------               -------------------------->
// <-------------------------------STUDENT IMAGE POP-UP-------------------------->
// <-------------------------------               -------------------------->
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


//<--------------------                ------------------------->
//<-------------------- FOR PAGINATION ------------------------->
//<--------------------                ------------------------->

const rowsPerPage = 15;
let currentPage = 1;

const tableBody = document.getElementById('teacherTableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function renderTable() {
  tableBody.innerHTML = "";
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageStudents = students.slice(start, end);

  pageStudents.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.srNo}</td>
      <td>${student.name}</td>
      <td><a onclick="openModal('${student.image}')">View Image</a></td>
      <td>${student.rollNo}</td>
      <td>${student.class}</td>
      <td>${student.section}</td>
      <td>${student.fatherName}</td>
      <td>${student.mobile}</td>
      <td>${student.address}</td>
      <td>${student.status}</td>
    `;
    tableBody.appendChild(row);
  });

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = end >= students.length;
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage * rowsPerPage < students.length) {
    currentPage++;
    renderTable();
  }
});

// <---------------------                     ------------------->
// <--------------------- MY PROFILE SECTION------------------->
// <---------------------                     ------------------->

function openProfilePopup() {
  document.getElementById('profilePopup').classList.remove('hidden');
}

function closeProfilePopup() {
  document.getElementById('profilePopup').classList.add('hidden');
}

function closeProfilePopup() {
  document.getElementById('profilePopup').classList.add('hidden');
}


window.addEventListener('click', function (e) {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.menu-toggle');

  // If sidebar is open, and click is outside sidebar and toggle button
  if (window.innerWidth <= 768 && sidebar.classList.contains('show') && !sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
      sidebar.classList.remove('show');
  }
});

// validates the size of img
function validateSignature(input) {
const file = input.files[0];
if (file && file.size > 200 * 1024) {
  alert("File too large! Please upload a signature under 200 KB.");
  input.value = ""; // Reset the input
}
}


// sometthing for form actions
function openEditForm(id, name, className, schoolId, username, section) {

  document.getElementById("teacher-table").style.display="none";

   // Show the popup
 document.getElementById("update-teacher-details").style.display="block";

// Set form action dynamically
const form = document.getElementById("editTeacherForm");
form.action = `/schools/${schoolId}/edit-class-teacher/${id}`;

// Fill values
// document.getElementById("editTeacherId").value = id;
document.getElementById("editFullName").value = name;
document.getElementById("username").value = username;

document.getElementById("class").value = className;
document.getElementById("section").value =section;





}





 // Variables
let cropper;
let currentInput = null;

// Select elements
const cropperModal = document.getElementById('cropperModal');
const cropperImage = document.getElementById('cropperImage');
const cropButton = document.getElementById('cropButton');
const cancelCrop = document.getElementById('cancelCrop');

// Input fields
const signatureInput = document.getElementById('signature');
const updateSignatureInput = document.getElementById('updateSignature');

// Function to open cropper modal
function openCropper(file, inputElement) {
    const reader = new FileReader();
    reader.onload = function (e) {
        cropperImage.src = e.target.result;
        cropperModal.style.display = 'block';

        // Destroy previous cropper if exists
        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(cropperImage, {
            aspectRatio: 4 / 1,  // Signature is usually wide (you can tweak)
            viewMode: 1,
            minContainerWidth: 400,
            minContainerHeight: 200,
            background: false,
        });

        currentInput = inputElement;
    };
    reader.readAsDataURL(file);
}

// Signature upload listener
signatureInput.addEventListener('change', function (e) {
    if (e.target.files.length > 0) {
        openCropper(e.target.files[0], signatureInput);
    }
});

// Update Signature upload listener
updateSignatureInput.addEventListener('change', function (e) {
    if (e.target.files.length > 0) {
        openCropper(e.target.files[0], updateSignatureInput);
    }
});

// Crop button click
cropButton.addEventListener('click', function () {
    if (cropper) {
        cropper.getCroppedCanvas({
            width: 400,
            height: 100,
        }).toBlob((blob) => {
            const file = new File([blob], "cropped-signature.png", { type: "image/png" });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            currentInput.files = dataTransfer.files;
            cropperModal.style.display = 'none';
            cropper.destroy();
        }, "image/png");
    }
});

// Cancel Crop
cancelCrop.addEventListener('click', function () {
    cropperModal.style.display = 'none';
    if (cropper) {
        cropper.destroy();
    }
});

// for confirm delete
function confirmDelete(teacherId, schoolId) {
    const confirmed = confirm("Are you sure you want to delete this teacher?");
    if (confirmed) {
      const form = document.getElementById("deleteForm");
      form.action = `/schools/delete-class-teacher/${teacherId}?schoolId=${schoolId}`;
      form.submit();
    }
  }






 // Session duration in milliseconds (same as backend)
 const sessionDuration = 1000 * 60 * 120; // 120 minutes
 const warningBefore = 1000 * 60 * 1; // 1 minute before expiry

 // Show warning 1 minute before expiry
 setTimeout(() => {
     alert("⚠️ Your session will expire in 1 minute. Please save your work or stay active.");
 }, sessionDuration - warningBefore);

 // Auto logout after session expiry
 setTimeout(() => {
     alert("⏰ Session expired. Logging you out...");
     window.location.href = "/loginS";
 }, sessionDuration);
