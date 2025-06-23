/* js/script.js - Relevant code for index.html */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Mummy Meals Website Loaded - Relevant index.html scripts running');

    // ------------------ Image Card Animation on Scroll (index.html) ------------------
    const imageCards = document.querySelectorAll('.image-card'); // Select all cards
    if (imageCards.length > 0) {
        console.log(`Found ${imageCards.length} image cards for animation.`);
        const checkSlideAnimation = () => {
            const triggerBottom = window.innerHeight * 0.85; // Point at which animation triggers
            imageCards.forEach((card, index) => {
                const cardTop = card.getBoundingClientRect().top; // Get card position relative to viewport
                // If card is scrolled into view and hasn't been shown yet
                if (cardTop < triggerBottom && !card.classList.contains('show')) {
                    card.classList.add('show'); // Add 'show' class (defined in CSS for transition)
                    card.style.transitionDelay = `${index * 0.15}s`; // Stagger the animation
                }
            });
        };
        checkSlideAnimation(); // Check on page load
        window.addEventListener('scroll', checkSlideAnimation); // Check again on scroll
    } else {
        console.log('No image cards (.image-card) found for animation.');
    }

    // ------------------ Modal Functionality (index.html Image Cards) ------------------
    const modal = document.getElementById('cardModal'); // Get the modal element
    const imageCardsForModal = document.querySelectorAll('.image-card'); // Reuse card selector

    if (modal && imageCardsForModal.length > 0) {
        console.log('Found modal (#cardModal) and cards. Setting up modal listeners.');
        const modalTitle = document.getElementById('modalTitle'); // Modal title element
        const modalText = document.getElementById('modalText');   // Modal text element
        const closeBtn = modal.querySelector('.close');          // Modal close (X) button

        // Predefined details for each card (matched by the card's h3 text)
        const cardDetails = {
            'Daily Fresh Meals': `At Mummy Meals, every dish is prepared fresh daily with love and care by experienced home cooks—our mummys. We use locally sourced, high-quality ingredients to ensure every tiffin is packed with nutrition and authentic flavour. Our rotating menu offers variety, bringing you different tastes of home cooking every day, delivered right on time.`,
            'Hygienic Packaging': 'Our commitment to hygiene is evident in every aspect of Mummy Meals. Meals are prepared in meticulously clean home kitchens following strict hygiene protocols. We use food-grade, tamper-proof, and often reusable containers to pack your food, ensuring it remains safe, fresh, and uncontaminated from our kitchen to your doorstep.',
            'Doorstep Delivery': 'Mummy Meals is dedicated to bringing the warmth of home-cooked food directly to you without hassle. Our reliable delivery partners ensure your tiffin arrives hot and fresh, exactly when you expect it. Track your delivery in real-time through our app and enjoy the convenience of delicious, homemade meals delivered daily to your home or office.'
        };

        // Function to open the modal and populate it with content
        const openModal = (title) => {
            if (!modalTitle || !modalText) { // Safety check
                 console.error("Modal title or text element not found!");
                 return;
            }
            modalTitle.textContent = title; // Set the modal title
            modalText.textContent = cardDetails[title] || "Details coming soon."; // Set the modal text from cardDetails object
            modal.style.display = 'block'; // Make the modal visible
            document.body.style.overflow = 'hidden'; // Prevent background scrolling when modal is open
            console.log(`Modal opened for: ${title}`);
        };

        // Function to close the modal
        const closeModal = () => {
            modal.style.display = 'none'; // Hide the modal
            document.body.style.overflow = 'auto'; // Restore background scrolling
            console.log('Modal closed.');
        };

        // Add click listeners to each image card
        imageCardsForModal.forEach(card => {
            const titleElement = card.querySelector('h3'); // Find the h3 inside the card
            if (titleElement) {
                // When a card is clicked, call openModal with the card's h3 text
                card.addEventListener('click', () => openModal(titleElement.textContent.trim()));
            }
        });

        // Add click listener to the close (X) button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Add click listener to the modal background (to close if clicked outside the content)
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { // Check if the click target is the modal background itself
                closeModal();
            }
        });

        // Add keyboard listener to close the modal with the Escape key
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') { // Check if Escape is pressed and modal is open
                closeModal();
            }
        });

    } else {
        if (!modal) console.log('Modal (#cardModal) not found.');
        if (imageCardsForModal.length === 0) console.log('No image cards found for modal interaction.');
    }

}); // End DOMContentLoaded
