    const photoInput = document.getElementById('photo');
    const cropperModal = document.getElementById('cropperModal');
    const imageToCrop = document.getElementById('imageToCrop');
    let cropper;

    photoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            imageToCrop.src = event.target.result;
            cropperModal.style.display = 'block';

            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(imageToCrop, {
                aspectRatio: 3/4,  // Passport size ratio
                viewMode: 1,
                autoCropArea: 1,
                movable: true,
                zoomable: true,
                rotatable: false,
                scalable: false,
                minContainerWidth: 300,
                minContainerHeight: 400,
            });
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('cropButton').addEventListener('click', function () {
        const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 400,
        });

        canvas.toBlob(function (blob) {
            const newFile = new File([blob], "cropped_photo.jpg", { type: 'image/jpeg' });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(newFile);
            photoInput.files = dataTransfer.files;

            cropperModal.style.display = 'none';
        }, 'image/jpeg');
    });

    document.getElementById('cancelCrop').addEventListener('click', function () {
        cropperModal.style.display = 'none';
        photoInput.value = ''; // Reset input if cancel
    });


    function showAddForm() {
        document.getElementById("addStudentForm").style.display = "block";
        document.getElementById("studentTable").style.display = "none";
        document.getElementById("stat").style.display = "none";

    }

    function hideAddForm() {
        document.getElementById("addStudentForm").style.display = "none";
    }

    function showAllStudents() {
        document.getElementById("studentTable").style.display = "block";
        document.getElementById("addStudentForm").style.display = "none";
        document.getElementById("stat").style.display = "none";
    }

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


// 🔍 Search Filter Logic
const searchInput = document.getElementById("searchInput");
const rows = document.querySelectorAll("#studentsDataTable tbody tr");

searchInput.addEventListener("keyup", function () {
const searchValue = this.value.toLowerCase();
rows.forEach(row => {
const name = row.cells[2].textContent.toLowerCase();
const rollNo = row.cells[1].textContent.toLowerCase();
if (name.includes(searchValue) || rollNo.includes(searchValue)) {
  row.style.display = "";
} else {
  row.style.display = "none";
}
});
});

