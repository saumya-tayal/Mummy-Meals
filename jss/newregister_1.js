/* js/script.js - Relevant sections for register_options.html */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Mummy Meals Website Loaded'); // Runs on all pages

    // ------------------ OTP Simulation (Conditional: Only if .btn-otp exists) ------------------
    // Included in case register_options.html has an OTP button
    const handleOTPSimulation = (event) => {
        alert('OTP sent! (This is a demo - no real OTP sent)');
        if (event.target.tagName === 'BUTTON') {
            event.target.disabled = true;
            setTimeout(() => { event.target.disabled = false; }, 5000);
        }
    };
    const otpButtons = document.querySelectorAll('.btn-otp');
    if (otpButtons.length > 0) {
        console.log(`Found ${otpButtons.length} OTP button(s) on the page.`);
        otpButtons.forEach(button => { button.addEventListener('click', handleOTPSimulation); });
    } else {
        console.log('No OTP buttons (.btn-otp) found on this page.');
    }

    // ------------------ Smooth Scrolling (Conditional: Only if a.smooth-scroll exists) ------------------
    // Included in case register_options.html has smooth scroll links
    const handleSmoothScroll = (event) => {
        const targetId = event.currentTarget.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            event.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) { targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }
        // Let default behavior handle non-hash links
    };
    const scrollLinks = document.querySelectorAll('a.smooth-scroll');
    if (scrollLinks.length > 0) {
        console.log(`Found ${scrollLinks.length} smooth scroll links on the page.`);
        scrollLinks.forEach(link => { link.addEventListener('click', handleSmoothScroll); });
    } else {
        console.log('No smooth scroll links (.smooth-scroll) found on this page.');
    }


    // ------------------ Infinite Image Slider Logic (register_options.html) ------------------
    console.log('Attempting to initialize Infinite Slider...');
    const sliderContainer = document.querySelector('.image-slider-container'); // Targets the container specific to the slider
    if (sliderContainer) {
        console.log('Found slider container (.image-slider-container).');
        const sliderTrack = sliderContainer.querySelector('.slider-track');
        const prevButton = sliderContainer.querySelector('#slider-prev');
        const nextButton = sliderContainer.querySelector('#slider-next');
        let originalSlides = sliderTrack ? Array.from(sliderTrack.children).filter(el => el.classList.contains('slide') && !el.classList.contains('clone')) : [];

        if (sliderTrack && prevButton && nextButton && originalSlides.length > 0) {
            console.log(`Found ${originalSlides.length} original slides for infinite slider.`);
            const slideInterval = 4000; // Time (ms) between slides
            const transitionSpeed = 500; // Animation speed (ms)

            // Clone first and last slides for infinite effect
            const firstClone = originalSlides[0].cloneNode(true);
            firstClone.classList.add('clone');
            const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
            lastClone.classList.add('clone');

            sliderTrack.appendChild(firstClone);
            sliderTrack.insertBefore(lastClone, originalSlides[0]);

            let allSlides = sliderTrack.querySelectorAll('.slide'); // Get all slides including clones
            const totalSlidesIncludingClones = allSlides.length;
            console.log(`Total elements in track: ${totalSlidesIncludingClones}`);

            let currentIndex = 1; // Start at the first actual slide (after the last clone)
            let slideTimer = null;
            let isTransitioning = false;

            // Set up track width and individual slide widths
            sliderTrack.style.width = `${totalSlidesIncludingClones * 100}%`;
            allSlides.forEach(slide => {
                slide.style.width = `${100 / totalSlidesIncludingClones}%`;
            });

            // Initial positioning without transition
            sliderTrack.style.transition = 'none';
            sliderTrack.style.transform = `translateX(-${currentIndex * (100 / totalSlidesIncludingClones)}%)`;

            // Function to move to a specific slide index
            function moveToSlide(index, useTransition = true) {
                if (isTransitioning) return;
                isTransitioning = true;
                console.log(`Slider moving to index: ${index}`);
                const offset = -(index * (100 / totalSlidesIncludingClones));
                sliderTrack.style.transition = useTransition ? `transform ${transitionSpeed / 1000}s ease-in-out` : 'none';
                sliderTrack.style.transform = `translateX(${offset}%)`;
                currentIndex = index;

                // Handle jump after transition completes (if needed)
                setTimeout(() => {
                    handleCloneJump();
                    isTransitioning = false;
                }, useTransition ? transitionSpeed : 0);
            }

            // Function to handle jumping from clones to real slides seamlessly
            function handleCloneJump() {
                if (currentIndex === 0) { // If moved to the last clone (before the first slide)
                    console.log('Slider Jump: Last clone -> Actual last');
                    sliderTrack.style.transition = 'none'; // Turn off transition for the jump
                    currentIndex = totalSlidesIncludingClones - 2; // Set index to the actual last slide
                    sliderTrack.style.transform = `translateX(-${currentIndex * (100 / totalSlidesIncludingClones)}%)`;
                } else if (currentIndex === totalSlidesIncludingClones - 1) { // If moved to the first clone (after the last slide)
                    console.log('Slider Jump: First clone -> Actual first');
                    sliderTrack.style.transition = 'none'; // Turn off transition for the jump
                    currentIndex = 1; // Set index to the actual first slide
                    sliderTrack.style.transform = `translateX(-${currentIndex * (100 / totalSlidesIncludingClones)}%)`;
                }
            }

            // Functions for manual navigation and auto-play
            function nextSlide() { if (!isTransitioning) moveToSlide(currentIndex + 1); }
            function prevSlide() { if (!isTransitioning) moveToSlide(currentIndex - 1); }
            function startSlider() { stopSlider(); slideTimer = setInterval(nextSlide, slideInterval); console.log("Slider interval started."); }
            function stopSlider() { clearInterval(slideTimer); console.log("Slider interval stopped."); }

            // Attach event listeners for buttons and hover
            nextButton.addEventListener('click', () => { stopSlider(); nextSlide(); startSlider(); });
            prevButton.addEventListener('click', () => { stopSlider(); prevSlide(); startSlider(); });
            sliderContainer.addEventListener('mouseenter', stopSlider); // Pause on hover
            sliderContainer.addEventListener('mouseleave', startSlider); // Resume on mouse leave

            // Apply initial transition shortly after load and start the slider
            setTimeout(() => {
                 sliderTrack.style.transition = `transform ${transitionSpeed / 1000}s ease-in-out`;
                 startSlider();
            }, 50); // Small delay to ensure initial positioning is applied

        } else {
            console.error("Infinite Slider Error: Required elements missing (track, buttons, or slides). Check HTML structure.");
        }
    } else {
        console.log("Slider container (.image-slider-container) not found. Skipping infinite slider setup.");
    }
    // ------------------ End Infinite Image Slider Logic ------------------


    // --- Other sections (Old Register, Login, Image Cards, Modal, Multi-step Signup, Profile Dropdown) ---
    // --- are omitted as they target elements specific to other pages (index, login, redirect1, loggedin). ---


}); // End DOMContentLoaded
