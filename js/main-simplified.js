// Urban Hideout - Simplified Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set a small delay to ensure everything is rendered properly
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // Initialize all functionality with simpler animations
        setupClassicScrollAnimations();
        setupSmoothScrolling();
        setupNavigationEffects();
        setupHoverEffects();
        
        // Move the floating capture form to the body element for correct positioning
        const floatingForm = document.querySelector('.floating-capture-form');
        if (floatingForm && floatingForm.parentElement !== document.body) {
            // Store the original position to restore it later
            floatingForm.dataset.originalParent = floatingForm.parentElement.tagName;
            floatingForm.dataset.originalPosition = Array.from(floatingForm.parentElement.children).indexOf(floatingForm);
            
            // Move to body
            document.body.appendChild(floatingForm);
        }
        
        // Initialize the floating capture form
        setupCaptureForm();
    }, 300);
});

/**
 * Fallback animations without GSAP
 */
function setupClassicScrollAnimations() {
    // Create a Set to track elements that have already been animated
    const animatedElements = new Set();
    
    // Transform circles to pills on scroll using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the active class to show the element
                entry.target.classList.add('active');
                
                // Add this element to our tracked set
                animatedElements.add(entry.target);
            } else {
                // Only remove active class if this element hasn't been animated before
                if (!animatedElements.has(entry.target)) {
                    entry.target.classList.remove('active');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px'
    });
    
    // Observe elements that need to animate on scroll
    document.querySelectorAll('.circle-to-pill, .section-header, .feature-card, .metric').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Sets up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    // Get all links that have a hash (#) in their href
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each anchor link
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor click behavior
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            
            // Skip empty or just '#' links
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            // If target element exists, scroll to it
            if (targetElement) {
                // Update active link status manually
                document.querySelectorAll('.nav-links a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
                
                // Native smooth scrolling
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Setup navigation effects
 */
function setupNavigationEffects() {
    const navPill = document.querySelector('.nav-pill');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    const logo = document.querySelector('.logo-container');
    
    // Check if we need to change the navigation style on scroll
    window.addEventListener('scroll', throttle(function() {
        const scrollY = window.scrollY;
        
        // Change nav background after scrolling down
        if (scrollY > 50) {
            navPill.classList.add('scrolled');
        } else {
            navPill.classList.remove('scrolled');
        }
        
        // Update logo color based on its position relative to dark sections
        updateLogoColor();
        
        // Update active link based on visible section
        const currentSection = getCurrentSection();
        updateActiveNavLink(currentSection);
    }, 100));
    
    // Function to update logo color based on its position
    function updateLogoColor() {
        const logoRect = logo.getBoundingClientRect();
        const logoCenter = {
            x: logoRect.left + logoRect.width / 2,
            y: logoRect.top + logoRect.height / 2
        };
        
        // Check if the logo is over a dark section
        const isOverDarkSection = Array.from(document.querySelectorAll('.section-dark')).some(section => {
            const sectionRect = section.getBoundingClientRect();
            return (
                logoCenter.y >= sectionRect.top &&
                logoCenter.y <= sectionRect.bottom
            );
        });
        
        // Update logo class to change its color
        if (isOverDarkSection) {
            logo.classList.add('over-dark-section');
        } else {
            logo.classList.remove('over-dark-section');
        }
    }
    
    // Initialize logo color on page load
    updateLogoColor();
    
    // Helper function to get the current section
    function getCurrentSection() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        return currentSection;
    }
    
    // Update active navigation link
    function updateActiveNavLink(currentSection) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Set initial active link
    updateActiveNavLink(getCurrentSection());
}

/**
 * Setup hover effects
 */
function setupHoverEffects() {
    // Subtle hover effect for buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', e => {
            // Calculate position of mouse relative to the button
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update the pseudo-element's position
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });
    
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle transform
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            // Add subtle glow effect
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
    
    // Solution cards hover effect
    const solutionCards = document.querySelectorAll('.solution-card');
    
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Footer links hover effect - lateral movement
    const footerLinks = document.querySelectorAll('.footer-links a');
    
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // Create pill effect by adding a pseudo-element
            link.style.paddingLeft = '12px';
            link.style.transition = 'padding-left 0.3s ease';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.paddingLeft = '0';
        });
    });
}

/**
 * Setup floating capture form
 */
function setupCaptureForm() {
    const floatingForm = document.querySelector('.floating-capture-form');
    const expandBtn = floatingForm.querySelector('.expand-form-btn');
    const formFields = floatingForm.querySelector('.capture-form-fields');
    const expandedArea = floatingForm.querySelector('.capture-form-expanded');
    const messageInput = floatingForm.querySelector('textarea');
    const submitButton = floatingForm.querySelector('.submit-form-btn');

    // Track form states
    let isExpanded = false;
    let isFullyExpanded = false;
    let isDetached = false;

    // Get sections for positioning
    const heroSection = document.getElementById('hero');
    const problemSection = document.getElementById('problem');
    const captureSection = document.getElementById('connect');
    const ctaForm = document.querySelector('.contact-form');

    // Initially hide the floating form
    floatingForm.style.opacity = '0';
    floatingForm.style.visibility = 'hidden';

    // Handle button click to expand or collapse the form
    expandBtn.addEventListener('click', () => {
        if (isFullyExpanded) {
            // Collapse back to pill state
            collapseFloatingForm();
        } else {
            // Expand the form
            expandCaptureForm();
        }
    });

    // Double click on the dot also expands the form
    const captureDot = document.querySelector('.capture-dot');
    captureDot.addEventListener('dblclick', () => {
        expandCaptureForm();
    });

    // Scroll event listener to handle form behavior
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Show floating form after hero section
        if (heroSection && scrollY > heroSection.offsetTop + (heroSection.offsetHeight * 0.5)) {
            if (floatingForm.style.opacity === '0') {
                floatingForm.style.opacity = '1';
                floatingForm.style.visibility = 'visible';
            }
        } else {
            // Hide the form when at the top of the page
            floatingForm.style.opacity = '0';
            floatingForm.style.visibility = 'hidden';
            
            // Also reset its state
            if (isExpanded || isFullyExpanded) {
                resetCaptureForm();
            }
        }
        
        // Transform dot to pill after problem section
        if (problemSection && scrollY > problemSection.offsetTop + 100) {
            floatingForm.classList.add('pill');
            
            // Ensure dot is visible
            captureDot.style.opacity = '0';
            
            // Make form fields visible in pill state
            formFields.style.display = 'flex';
            formFields.style.visibility = 'visible';
            formFields.style.opacity = '1';
            
            // Add expanded class without triggering full expansion
            if (!isExpanded) {
                isExpanded = true;
                floatingForm.classList.add('expanded');
            }
        } else {
            floatingForm.classList.remove('pill');
            floatingForm.classList.remove('expanded');
            
            // Show dot when not in pill form
            captureDot.style.opacity = '1';
            
            // Reset form if we scroll back up
            if (isExpanded) {
                resetCaptureForm();
            }
        }
        
        // Handle capture section interaction (CTA section)
        if (captureSection) {
            const captureRect = captureSection.getBoundingClientRect();
            
            // Check if we're approaching or inside the capture section
            const isApproachingCapture = captureRect.top < window.innerHeight * 1.2;
            const isInCapture = captureRect.top < window.innerHeight * 0.3 && captureRect.bottom > 0;
            
            if (isInCapture) {
                // We've entered the capture section - transform the form
                if (!isDetached) {
                    detachCaptureForm();
                }
                
                // Hide the original CTA form as our floating form takes its place
                if (ctaForm) {
                    ctaForm.style.display = 'none';
                }
                
                // Ensure the form is fully expanded
                if (!isFullyExpanded) {
                    toggleFullExpansion();
                }
                
            } else if (isDetached) {
                // We've scrolled away from the capture section
                reattachCaptureForm();
                
                // Show the original CTA form again
                if (ctaForm) {
                    ctaForm.style.display = 'block';
                }
            } else if (isApproachingCapture && !isExpanded) {
                // As we approach the capture section, start expanding the form
                expandCaptureForm();
            }
        }
    });

    // Function to expand the capture form
    function expandCaptureForm() {
        isExpanded = true;
        floatingForm.classList.add('expanded');
        
        // Make sure form fields are visible
        formFields.style.display = 'flex';
        formFields.style.visibility = 'visible';
        formFields.style.opacity = '1';
        
        // Hide the dot
        captureDot.style.opacity = '0';
        captureDot.style.transform = 'scale(0)';
        
        // If not fully expanded, show message textarea after a delay
        if (!isFullyExpanded) {
            setTimeout(toggleFullExpansion, 600);
        }
    }

    // Toggle full expansion of the form
    function toggleFullExpansion() {
        isFullyExpanded = !isFullyExpanded;
        
        if (isFullyExpanded) {
            floatingForm.classList.add('expanded-full');
            expandedArea.style.display = 'block';
            expandedArea.style.visibility = 'visible';
            expandedArea.style.opacity = '1';
            messageInput.style.visibility = 'visible';
            messageInput.style.opacity = '1';
            submitButton.style.visibility = 'visible';
            submitButton.style.opacity = '1';
        } else {
            floatingForm.classList.remove('expanded-full');
            expandedArea.style.display = 'none';
            expandedArea.style.visibility = 'hidden';
            expandedArea.style.opacity = '0';
            messageInput.style.visibility = 'hidden';
            messageInput.style.opacity = '0';
            submitButton.style.visibility = 'hidden';
            submitButton.style.opacity = '0';
        }
    }

    // Function to detach the capture form
    function detachCaptureForm() {
        isDetached = true;
        floatingForm.classList.add('detached');
        
        // When detached, the floating form should take over as the CTA form
        if (ctaForm) {
            ctaForm.style.display = 'none'; // Hide the original form
        }
        
        // Place the form within the CTA section container
        const ctaContainer = captureSection.querySelector('.container');
        if (ctaContainer) {
            // Get a reference to the inner pill form
            const capturePillForm = floatingForm.querySelector('.capture-pill-form');
            
            // Set the form to be positioned relative to the container with clean centering
            floatingForm.style.position = 'relative';
            floatingForm.style.top = 'auto';
            floatingForm.style.bottom = 'auto';
            floatingForm.style.left = 'auto';
            floatingForm.style.right = 'auto';
            floatingForm.style.transform = 'none';
            floatingForm.style.width = '90%';
            floatingForm.style.maxWidth = '800px';
            floatingForm.style.margin = '20px auto';
            floatingForm.style.boxSizing = 'border-box';
            
            // Make sure the inner pill form takes the full width of its container
            if (capturePillForm) {
                capturePillForm.style.width = '100%';
                capturePillForm.style.maxWidth = '100%';
                capturePillForm.style.margin = '0 auto';
                capturePillForm.style.boxSizing = 'border-box';
            }
            
            // If not already appended to container, move it there
            if (floatingForm.parentElement !== ctaContainer) {
                ctaContainer.appendChild(floatingForm);
            }
        }
        
        // Fully expand the form
        isExpanded = true;
        isFullyExpanded = true;
        floatingForm.classList.add('expanded', 'expanded-full');
        
        // Ensure all form elements are fully visible
        formFields.style.display = 'flex';
        formFields.style.visibility = 'visible';
        formFields.style.opacity = '1';
        expandedArea.style.display = 'block';
        expandedArea.style.visibility = 'visible';
        expandedArea.style.opacity = '1';
        messageInput.style.visibility = 'visible';
        messageInput.style.opacity = '1';
        submitButton.style.visibility = 'visible';
        submitButton.style.opacity = '1';
    }

    // Function to reattach the capture form
    function reattachCaptureForm() {
        isDetached = false;
        floatingForm.classList.remove('detached');
        
        // Move the floating form back to the body if it was in the CTA container
        if (floatingForm.parentElement !== document.body) {
            document.body.appendChild(floatingForm);
        }
        
        // Reset position to fixed at bottom
        floatingForm.style.position = 'fixed';
        floatingForm.style.top = 'auto';
        floatingForm.style.bottom = '20px';
        floatingForm.style.left = '50%';
        floatingForm.style.transform = 'translateX(-50%)';
        floatingForm.style.margin = '0';
        floatingForm.style.width = 'auto';
        floatingForm.style.maxWidth = 'none';
        
        // Show the original CTA form again
        if (ctaForm) {
            ctaForm.style.display = 'block';
        }
        
        // Keep expanded state but not full expansion
        if (isFullyExpanded) {
            isFullyExpanded = false;
            floatingForm.classList.remove('expanded-full');
            expandedArea.style.display = 'none';
            expandedArea.style.visibility = 'hidden';
            expandedArea.style.opacity = '0';
        }
    }

    // Function to reset the capture form
    function resetCaptureForm() {
        isExpanded = false;
        isFullyExpanded = false;
        floatingForm.classList.remove('expanded', 'expanded-full');
        
        // Show the dot
        captureDot.style.opacity = '1';
        captureDot.style.transform = 'scale(1)';
        
        // Hide form fields
        formFields.style.display = 'none';
        formFields.style.visibility = 'hidden';
        formFields.style.opacity = '0';
        
        // Hide expanded area
        expandedArea.style.display = 'none';
        expandedArea.style.visibility = 'hidden';
        expandedArea.style.opacity = '0';
        
        // Hide message and submit button
        messageInput.style.visibility = 'hidden';
        messageInput.style.opacity = '0';
        submitButton.style.visibility = 'hidden';
        submitButton.style.opacity = '0';
    }

    // Function to collapse the floating form back to pill state
    function collapseFloatingForm() {
        isFullyExpanded = false;
        isExpanded = false;
        
        // Remove expanded classes
        floatingForm.classList.remove('expanded-full');
        floatingForm.classList.remove('expanded');
        
        // Hide expanded area
        expandedArea.style.display = 'none';
        expandedArea.style.visibility = 'hidden';
        expandedArea.style.opacity = '0';
        messageInput.style.visibility = 'hidden';
        messageInput.style.opacity = '0';
        submitButton.style.visibility = 'hidden';
        submitButton.style.opacity = '0';
        
        // Reset arrow rotation
        expandBtn.querySelector('svg').style.transform = 'rotate(0deg)';
        
        // Show the dot again if not in pill state
        if (!floatingForm.classList.contains('pill')) {
            captureDot.style.opacity = '1';
            captureDot.style.transform = 'scale(1)';
            
            // Hide form fields
            formFields.style.display = 'none';
            formFields.style.visibility = 'hidden';
            formFields.style.opacity = '0';
        }
    }
}

/**
 * Throttle function to limit how often a function can be called
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
} 