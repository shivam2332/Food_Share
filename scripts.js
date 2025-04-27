// scripts.js

// Firebase Configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "AIzaSyCg_37p_y9uLGORgo_ehRR7f5Umn9mZbPQ",
    authDomain: "myauthapp-c9005.firebaseapp.com",
    projectId: "myauthapp-c9005",
    storageBucket: "myauthapp-c9005.firebasestorage.app",
    messagingSenderId: "875841739794",
    appId: "1:875841739794:web:85a508dcd8dded2f88cccb"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // MongoDB API endpoint (to be implemented with backend)
  const MONGODB_API_URL = '/api/data';
  
  // DOM Elements
  const donateBtn = document.getElementById('donateBtn');
  const heroDonateBtnRestaurant = document.getElementById('heroDonateBtnRestaurant');
  const heroDonateBtnNGO = document.getElementById('heroDonateBtnNGO');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const donationModal = document.getElementById('donationModal');
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  const closeButtons = document.querySelectorAll('.close');
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');
  
  // Form Elements
  const donationForm = document.getElementById('donationForm');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const contactForm = document.getElementById('contactForm');
  
  // Background Animation
  function updateBackgroundAnimation() {
    const scrollPercentage = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
    const hue = 120 - scrollPercentage * 60; // Shift from green to blue
    document.querySelector('.background-animation').style.background = 
      `linear-gradient(135deg, hsl(${hue}, 40%, 90%) 0%, hsl(${hue + 30}, 40%, 96%) 100%)`;
  }
  
  // Initialize dynamic background
  window.addEventListener('scroll', updateBackgroundAnimation);
  updateBackgroundAnimation();
  
  // Mobile Navigation Toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
  
  // Close mobile nav when clicking links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
  
  // Modal Functions
  function openModal(modal) {
    modal.style.display = 'block';
  }
  
  function closeModal(modal) {
    modal.style.display = 'none';
  }
  
  function closeAllModals() {
    donationModal.style.display = 'none';
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
  }
  
  // Modal Event Listeners
  donateBtn.addEventListener('click', () => {
    // Check if user is logged in before showing donation form
    const user = auth.currentUser;
    if (user) {
      openModal(donationModal);
    } else {
      openModal(loginModal);
      alert('Please log in to donate food.');
    }
  });
  
  heroDonateBtnRestaurant.addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
      openModal(donationModal);
    } else {
      openModal(signupModal);
      // Pre-select restaurant option
      document.getElementById('userType').value = 'restaurant';
    }
  });
  
  heroDonateBtnNGO.addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
      // Redirect to available donations page (to be implemented)
      // window.location.href = '/available-donations.html';
      alert('Feature coming soon: View available donations');
    } else {
      openModal(signupModal);
      // Pre-select NGO option
      document.getElementById('userType').value = 'ngo';
    }
  });
  
  loginBtn.addEventListener('click', () => openModal(loginModal));
  signupBtn.addEventListener('click', () => openModal(signupModal));
  
  // Close modals with "X" button
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      closeAllModals();
    });
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === donationModal || e.target === loginModal || e.target === signupModal) {
      closeAllModals();
    }
  });
  
  // Switch between login and signup modals
  switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
  });
  
  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
  });
  
  // Firebase Auth State Observer
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      loginBtn.style.display = 'none';
      signupBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      
      // Update donation form with user info if available
      fetchUserData(user.uid);
    } else {
      // User is signed out
      loginBtn.style.display = 'inline-block';
      signupBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
    }
  });
  
  // Logout functionality
  logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
      console.log('User signed out');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  });
  
  // Form Submissions
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Firebase Authentication
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        closeAllModals();
        console.log('User logged in: ', user.uid);
      })
      .catch((error) => {
        console.error('Login error: ', error.message);
        alert(`Login failed: ${error.message}`);
      });
  });
  
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value;
    const userType = document.getElementById('userType').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    // Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log('User created: ', user.uid);
        
        // Store additional user data in MongoDB via API
        const userData = {
          uid: user.uid,
          name: name,
          email: email,
          userType: userType,
          phone: phone,
          address: address,
          createdAt: new Date().toISOString()
        };
        
        saveUserData(userData);
        closeAllModals();
      })
      .catch((error) => {
        console.error('Signup error: ', error.message);
        alert(`Signup failed: ${error.message}`);
      });
  });
  
  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to donate food.');
      closeAllModals();
      openModal(loginModal);
      return;
    }
    
    const foodType = document.getElementById('foodType').value;
    const quantity = document.getElementById('quantity').value;
    const expiry = document.getElementById('expiry').value;
    const pickupAddress = document.getElementById('pickupAddress').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    // Create donation object
    const donationData = {
      userId: user.uid,
      foodType: foodType,
      quantity: quantity,
      expiry: expiry,
      pickupAddress: pickupAddress,
      pickupTime: pickupTime,
      additionalInfo: additionalInfo,
      status: 'available',
      createdAt: new Date().toISOString()
    };
    
    saveDonationData(donationData);
  });
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Create contact message object
    const contactData = {
      name: name,
      email: email,
      message: message,
      createdAt: new Date().toISOString()
    };
    
    saveContactData(contactData);
    
    // Reset form and show confirmation
    contactForm.reset();
    alert('Thank you for your message! We will get back to you soon.');
  });
  
  // API Functions for MongoDB Atlas Integration
  async function saveUserData(userData) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
      
      const data = await response.json();
      console.log('User data saved: ', data);
    } catch (error) {
      console.error('Error saving user data: ', error);
      // For demo, save to localStorage as fallback
      localStorage.setItem(`user_${userData.uid}`, JSON.stringify(userData));
    }
  }
  
  async function fetchUserData(uid) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/users/${uid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      console.log('User data fetched: ', userData);
      
      // Use user data to pre-fill forms if needed
      if (document.getElementById('pickupAddress')) {
        document.getElementById('pickupAddress').value = userData.address || '';
      }
      
    } catch (error) {
      console.error('Error fetching user data: ', error);
      // For demo, try localStorage as fallback
      const storedUserData = localStorage.getItem(`user_${uid}`);
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        console.log('User data from localStorage: ', userData);
      }
    }
  }
  
  async function saveDonationData(donationData) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save donation data');
      }
      
      const data = await response.json();
      console.log('Donation data saved: ', data);
      
      // Show success message and close modal
      alert('Thank you for your donation! NGOs in your area will be notified.');
      closeAllModals();
      donationForm.reset();
      
    } catch (error) {
      console.error('Error saving donation data: ', error);
      // For demo, save to localStorage as fallback
      const donationId = `donation_${Date.now()}`;
      localStorage.setItem(donationId, JSON.stringify(donationData));
      alert('Your donation has been recorded locally. Thank you!');
      closeAllModals();
      donationForm.reset();
    }
  }
  
  async function saveContactData(contactData) {
    try {
      const response = await fetch(`${MONGODB_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save contact data');
      }
      
      const data = await response.json();
      console.log('Contact data saved: ', data);
      
    } catch (error) {
      console.error('Error saving contact data: ', error);
      // For demo, save to localStorage as fallback
      const contactId = `contact_${Date.now()}`;
      localStorage.setItem(contactId, JSON.stringify(contactData));
    }
  }
  
  // Initialize all tooltips and popovers (if you add them later)
  document.addEventListener('DOMContentLoaded', function() {
    // Any initialization code that should run when the page loads
    console.log('FoodShare platform initialized');
  });