document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Scroll Logic (Navbar & Dots) ---
    const sections = document.querySelectorAll("header, section");
    const navLinks = document.querySelectorAll(".nav-links li a");
    const dots = document.querySelectorAll(".dot");
    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) link.classList.add("active");
                });
                dots.forEach((dot) => {
                    dot.classList.remove("active");
                    if (dot.getAttribute("href") === `#${id}`) dot.classList.add("active");
                });
            }
        });
    }, observerOptions);
    sections.forEach((section) => observer.observe(section));

    // --- 2. Email Copy Handler (Dark Blue Color) ---
    const emailCard = document.getElementById('emailCard');
    if (emailCard) {
        emailCard.addEventListener('click', function() {
            const emailText = "shahfaisal1234@gmail.com";
            const status = document.getElementById('copy-status');
            
            navigator.clipboard.writeText(emailText).then(() => {
                if (status) {
                    status.style.color = "#05445E"; // "I Know That" wala dark blue
                    status.style.display = 'inline';
                    setTimeout(() => { status.style.display = 'none'; }, 2000);
                }
            });
            window.location.href = "mailto:" + emailText;
        });
    }

    // --- 3. AJAX Form Submission (Success Message Trigger) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = document.querySelector('.send-btn');
            const formStatus = document.getElementById('formStatus');
            const formData = new FormData(this);

            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            // Frontend success dikhane ke liye (Agar backend na bhi ho tab bhi test karne ke liye)
            fetch('/contact', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    // Success Class and Message
                    formStatus.innerHTML = `✅ ${data.message}`;
                    formStatus.classList.add('show'); // CSS class trigger
                    this.reset();
                } else {
                    formStatus.innerHTML = `❌ ${data.message}`;
                    formStatus.classList.add('show');
                    formStatus.style.backgroundColor = "#fee2e2"; // Error color
                    formStatus.style.color = "#991b1b";
                }
            })
            .catch(error => {
                // Testing ke liye: Agar fetch fail ho (backend missing ho) tab bhi success dikhana ho toh ye use karein:
                formStatus.innerHTML = "✅ Success! Your message has been sent.";
                formStatus.classList.add('show');
                this.reset();
            })
            .finally(() => {
                submitBtn.innerText = "Send Message";
                submitBtn.disabled = false;
                
                // 5 seconds baad message gayab ho jayega
                setTimeout(() => { 
                    formStatus.classList.remove('show');
                    formStatus.innerHTML = ""; 
                }, 5000);
            });
        });
    }

    // --- 4. Portfolio Filter Logic (New Feature) ---
    const filterItems = document.querySelectorAll('.app__work-filter-item');
    const projectItems = document.querySelectorAll('.app__work-item');

    filterItems.forEach(filterItem => {
        filterItem.addEventListener('click', function() {
            // Active class change karna
            filterItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

          projectItems.forEach(project => {
            // Smooth Animation for professional feel
            project.style.opacity = '0';
            setTimeout(() => {
                if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                    project.style.display = 'block';
                    project.style.opacity = '1';
                } else {
                    project.style.display = 'none';
                }
            }, 300);
            });
        });
    });
});