 emailjs.init('ts-Fq9pfLF4zrjo8j');
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu
        const burger = document.getElementById('burger');
        const navLinks = document.getElementById('navLinks');
        
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            }
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
            }
        });

        // Check for events and show message if none exist
        function checkEvents() {
            const eventsContainer = document.getElementById('eventsContainer');
            const noEventsMessage = document.getElementById('noEvents');
           const eventCards = eventsContainer.querySelectorAll('.event-card');

            
            if (eventCards.length === 0) {
                eventsContainer.style.display = 'none';
                noEventsMessage.style.display = 'block';
            } else {
                eventsContainer.style.display = 'block';
                noEventsMessage.style.display = 'none';
            }
            
        }

        // Run check on page load
        checkEvents();

        // Brotherhood Join Modal functionality
        const joinBtn = document.getElementById('joinBtn');
        const joinModal = document.getElementById('joinModal');
        const closeModal = document.getElementById('closeModal');

        // Open modal
        joinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            joinModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close modal
        closeModal.addEventListener('click', () => {
            joinModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal when clicking outside
        joinModal.addEventListener('click', (e) => {
            if (e.target === joinModal) {
                joinModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && joinModal.classList.contains('active')) {
                joinModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Event Registration Functions
        function openRegistration(eventName, eventDate) {
            const modal = document.getElementById('registrationModal');
            const eventTitle = document.getElementById('eventTitle');
            const eventNameInput = document.getElementById('eventName');
            const eventDateInput = document.getElementById('eventDate');
            
            eventTitle.textContent = `${eventName} - ${eventDate}`;
            eventNameInput.value = eventName;
            eventDateInput.value = eventDate;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeRegistration() {
            const modal = document.getElementById('registrationModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            document.getElementById('registrationForm').reset();
            document.getElementById('formMessage').innerHTML = '';
        }

        // Close registration modal when clicking outside
        document.getElementById('registrationModal').addEventListener('click', (e) => {
            if (e.target.id === 'registrationModal') {
                closeRegistration();
            }
        });

        // Handle form submission
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const formMessage = document.getElementById('formMessage');
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
           
            emailjs.sendForm('YUKIN', 'YUKIN', this)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    formMessage.innerHTML = '<div class="form-success"><i class="fas fa-check-circle"></i> Registration successful! Check your email for confirmation.</div>';
                    document.getElementById('registrationForm').reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Register Now';
                    
                    // Close modal after 3 seconds
                    setTimeout(() => {
                        closeRegistration();
                    }, 3000);
                }, function(error) {
                    console.log('FAILED...', error);
                    formMessage.innerHTML = '<div class="form-error"><i class="fas fa-exclamation-circle"></i> Registration failed. Please try again.</div>';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Register Now';
                });
        });

        // Close registration modal with Escape key
        document.addEventListener('keydown', (e) => {
            const regModal = document.getElementById('registrationModal');
            if (e.key === 'Escape' && regModal.classList.contains('active')) {
                closeRegistration();
            }
        });
        

        // Ride Memories Data
const rideMemories = [
  {
    title: "Mailung, Nuwakot Ride",
    photos: [
      "/images/nuwakot.png",
      "images/nagarkot2.jpg",
      "images/nagarkot3.jpg"
    ]
  },
  {
    title: "Pokhara Adventure Ride",
    photos: [
      "images/pokhara1.jpg",
      "images/pokhara2.jpg",
      "images/pokhara3.jpg",
      "images/pokhara4.jpg"
    ]
  }
];

// Open Memory Modal
function viewMemory(index) {
  const modal = document.getElementById("memoryModal");
  const title = document.getElementById("memoryTitle");
  const photosContainer = document.getElementById("memoryPhotos");

  title.textContent = rideMemories[index].title;
  photosContainer.innerHTML = rideMemories[index].photos
    .map(photo => `<img src="${photo}" alt="Ride photo">`)
    .join("");

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Memory Modal
function closeMemory() {
  const modal = document.getElementById("memoryModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Close when clicking outside
document.getElementById("memoryModal").addEventListener("click", (e) => {
  if (e.target.id === "memoryModal") closeMemory();
});
