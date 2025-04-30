document.addEventListener("DOMContentLoaded", function () {
    const textContainer = document.querySelector(".text-container");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                textContainer.classList.add("active"); // Add animation class
            } else {
                textContainer.classList.remove("active"); // Remove when out of view
            }
        });
    }, { threshold: 0.5 }); // Triggers when 50% of the element is visible

    observer.observe(textContainer);
});
document.addEventListener("DOMContentLoaded", function () {
    const textContainer = document.querySelector(".text-container2");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                textContainer.classList.add("active"); // Add animation class
            } else {
                textContainer.classList.remove("active"); // Remove when out of view
            }
        });
    }, { threshold: 0.8 }); // Triggers when 50% of the element is visible

    observer.observe(textContainer);
});

document.addEventListener("DOMContentLoaded", function () {
    const textContainer = document.querySelector(".text-container3");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                textContainer.classList.add("active"); // Add animation class
            } else {
                textContainer.classList.remove("active"); // Remove when out of view
            }
        });
    }, { threshold: 0.8 }); // Triggers when 50% of the element is visible

    observer.observe(textContainer);
});
document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".service");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                } else {
                    entry.target.classList.remove("show"); // Remove class when out of view
                }
            });
        },
        {
            threshold: 0.1 // Trigger when 20% of the card is visible
        }
    );

    cards.forEach((service) => {
        observer.observe(service);
    });
});


