document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider animation
    const sliderTrack = document.querySelector('.slider-track');
    
    // Smooth infinite loop
    sliderTrack.addEventListener('animationiteration', () => {
        sliderTrack.style.animation = 'none';
        void sliderTrack.offsetWidth; // Trigger reflow
        sliderTrack.style.animation = 'slide 20s linear infinite';
    });

    // Get current mummy data
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserMobile = localStorage.getItem('currentUserMobile');
    const mummy = users.find(u => u.mobile === currentUserMobile);

    // Set profile info
    if (mummy) {
        document.getElementById('profile-name').textContent = mummy.firstName;
        document.getElementById('profile-pic').src = mummy.profilePicture || "resources/images1/avatar1.png";
        document.getElementById('tomorrow-menu').value = mummy.menuTomorrow || '';
    }

    // Orders Modal
    const ordersModal = document.getElementById('orders-modal');
    document.getElementById('orders-tab').addEventListener('click', () => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const todayOrders = orders.filter(order => 
            order.mummyMobile === currentUserMobile &&
            new Date(order.orderDate).toDateString() === new Date().toDateString()
        );

        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = todayOrders.length ? 
            todayOrders.map(order => `
                <div class="order-item">
                    <p><strong>Order #${order.id}</strong></p>
                    <p>Customer: ${order.customerName}</p>
                    <p>Menu: ${order.food}</p>
                    <p>Quantity: ${order.quantity}</p>
                    <p>Status: ${order.status}</p>
                </div>
            `).join('') : 
            '<p>No orders for today</p>';
        
        ordersModal.style.display = 'flex';
    });

    // Close modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        ordersModal.style.display = 'none';
    });

    window.onclick = (e) => {
        if (e.target === ordersModal) {
            ordersModal.style.display = 'none';
        }
    };

    // Save menu
    document.getElementById('menu-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const menu = document.getElementById('tomorrow-menu').value.trim();
        
        const updatedUsers = users.map(user => {
            if (user.mobile === currentUserMobile) {
                return {...user, menuTomorrow: menu};
            }
            return user;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        alert('Menu saved successfully!');
    });
});
