 const photoInput = document.getElementById('signature');
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
                aspectRatio: 4/1,  // Passport size ratio
                viewMode: 1,
                autoCropArea: 1,
                movable: true,
                zoomable: true,
                rotatable: false,
                scalable: false,
                minContainerWidth: 400,
                minContainerHeight: 100,
            });
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('cropButton').addEventListener('click', function () {
        const canvas = cropper.getCroppedCanvas({
            width: 400,
            height: 100,
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

// code for next button
document.getElementById("nextBtn").addEventListener("click", function (e) {
    

    // Get form values
    let schoolName = document.getElementById("Schoolname").value.trim();
    let mobileNumber = document.getElementById("number").value.trim();
    let email = document.getElementById("email").value.trim();

    // Basic empty validation
    if (schoolName === "" || mobileNumber === "" || email === "") {
        showError("Please fill in all fields before proceeding.");
        return;
    }

    // Email format validation
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError("Please enter a valid email address.");
        return;
    }

    let mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobileNumber)) {
        showError("Please enter a valid 10-digit mobile number.");
        return;
    }

    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");

});
document.getElementById("number").addEventListener("input", function (e) {
    // Remove any non-digit characters
    this.value = this.value.replace(/\D/g, '');
});


document.getElementById("verifybtn").addEventListener("click", function () {
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");

});

// <------------------------------------------------->
// <----------------code for otp timer--------------->
// <------------------------------------------------->


let timeLeft = 120; // 2 minutes = 120 seconds
let timerId;

function startTimer() {
    const timerDisplay = document.getElementById('timer');

    timerId = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        timerDisplay.textContent = `Time remaining: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerDisplay.textContent = "OTP expired. Please resend OTP.";
            document.getElementById('verifybtn').disabled = true;
        }

        timeLeft--;
    }, 1000);
};

function resendOtp() {
    // Optionally show a loading spinner or disable the button
    fetch('/resend-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.ok) {
            alert('OTP resent successfully!');
            timeLeft = 120;
            document.getElementById('verifybtn').disabled = false;
            startTimer(); // Restart timer
        } else {
            alert('Failed to resend OTP');
        }
    })
    .catch(err => {
        console.error(err);
        alert('An error occurred while resending OTP.');
    });
}

function validateInput(input, index) {
    const inputs = document.querySelectorAll('.otp-input input');
    if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
    }
}

// Start timer when page loads
// window.onload = startTimer;
// function validateInput(input, index) {
//     const inputs = document.querySelectorAll('.otp-input input');
//     input.value = input.value.replace(/\D/g, ''); // Allow only digits
//     if (input.value && index < inputs.length - 1) {
//         inputs[index + 1].focus();
//     }
// }

// let countdown = 60;
// const timer = document.getElementById("timer");
// const interval = setInterval(() => {
//   countdown--;
//   timer.textContent = `Time remaining: 00:${countdown < 10 ? "0" : ""}${countdown}`;
//   if (countdown <= 0) {
//     clearInterval(interval);
//     timer.textContent = "OTP expired!";
//   }
// }, 1000);

// function startTimer(durationInSeconds) {
//     let timer = durationInSeconds;
//     const display = document.getElementById('timer');

//     const interval = setInterval(() => {
//         let minutes = Math.floor(timer / 60);
//         let seconds = timer % 60;

//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;

//         display.textContent = `Time remaining: ${minutes}:${seconds}`;

//         if (timer <= 0) {
//             clearInterval(interval);
//             display.textContent = "OTP expired";
//         }
//         timer--;
//     }, 1000);
// }

// document.addEventListener("DOMContentLoaded", () => {
//     startTimer(60); // 300 seconds countdown
// });





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

// <---------------           ---------------->
// <---------------  PASSWORD MATCH ---------------->
// <---------------           ---------------->
function validateForm() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return false;
    }
    return true;
  } 

//   <--------------------                --------------------->
//   <-------------------- SHOW ERROR MESSAGE--------------------->
//   <--------------------                --------------------->
function showError(message) {
    const errorBox = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorTxt');

    errorText.innerText = message;

    // Show the box
    errorBox.classList.remove('hide');
    errorBox.style.display = 'block'; // make sure it's visible

    // Optional: Auto-hide after 5 seconds
    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 5000);

    // Close button
    document.getElementById('close').onclick = function () {
        errorBox.style.display = 'none';
    };
}








