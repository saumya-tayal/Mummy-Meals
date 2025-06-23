document.addEventListener('DOMContentLoaded', () => {
    // Function to extract district
    function extractDistrict(address) {
      if (!address) return "";
      let parts = address.split(",");
      return parts.length > 2 ? parts[parts.length - 2].trim() : address.trim();
    }
  
    // Get user data
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserMobile = localStorage.getItem('currentUserMobile');
    const customer = users.find(u => u.mobile === currentUserMobile);
  
    // Display customer info
    if (customer) {
      document.getElementById('customer-address').textContent = customer.address;
      document.getElementById('profile-name').textContent = customer.firstName;
      document.getElementById('profile-pic').src = customer.profilePicture || "resources/images1/avatar1.png";
    }
  
    // Set subtitle
    const district = extractDistrict(customer?.address || "");
    document.getElementById('district-title').textContent = `mummy's packing tiffin in "${district}"`;
  
    // Filter mummys
    const mummys = users.filter(
      u => u.role === 'mummy' && u.pincode === customer?.pincode
    );
  
    const mummyList = document.getElementById('mummy-list');
    mummyList.innerHTML = mummys.length ? '' : `<div class="no-mummys">No mummys available in your area</div>`;
    mummys.forEach(mummy => {
      const card = document.createElement('div');
      card.className = 'mummy-card';
      card.innerHTML = `
        <img class="mummy-pic" src="${mummy.profilePicture || "resources/images1/avatar1.png"}" />
        <div class="mummy-name">${mummy.firstName}</div>
        <div class="mummy-district">${district}</div>
      `;
      card.onclick = () => showMummyModal(mummy);
      mummyList.appendChild(card);
    });
  
    // Modal logic
    const modal = document.getElementById('mummy-modal');
    const closeModal = document.getElementById('close-modal');
    closeModal.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (event) => {
      if (event.target === modal) modal.style.display = 'none';
    };
  
    function showMummyModal(mummy) {
      document.getElementById('modal-mummy-pic').src = mummy.profilePicture || "resources/images1/avatar1.png";
      document.getElementById('modal-mummy-name').textContent = mummy.firstName;
      document.getElementById('modal-mummy-district').textContent = district;
      document.getElementById('modal-mummy-menu').textContent = mummy.menuTomorrow || "Aloo Paratha, Dal, Rice";
      document.getElementById('modal-mummy-closing').textContent = mummy.closingTimeTomorrow || "8:00 PM";
      document.getElementById('modal-mummy-max').textContent = mummy.maxOrdersTomorrow || "10";
  
      document.getElementById('order-qty').max = mummy.maxOrdersTomorrow || "10";
      document.getElementById('order-qty').value = 1;
  
      document.getElementById('move-to-cart').onclick = () => {
        const cart = {
          mummyMobile: mummy.mobile,
          mummyName: mummy.firstName,
          mummyPic: mummy.profilePicture,
          menu: mummy.menuTomorrow || "Aloo Paratha, Dal, Rice",
          closingTime: mummy.closingTimeTomorrow || "8:00 PM",
          maxOrders: mummy.maxOrdersTomorrow || "10",
          qty: document.getElementById('order-qty').value
        };
        localStorage.setItem('mycart', JSON.stringify(cart));
        alert('Added to cart!');
        modal.style.display = 'none';
      };
  
      document.getElementById('mummy-modal').style.display = 'flex';
    }
  
    // Cart icon click
    document.getElementById('cart-icon').onclick = () => {
      const cartData = JSON.parse(localStorage.getItem('mycart')) || {};
      if (!cartData.mummyName) {
        alert('Your cart is empty.');
        return;
      }
      document.getElementById('modal-mummy-name-display').textContent = cartData.mummyName || '';
      document.getElementById('modal-food-display').textContent = cartData.menu || '';
      document.getElementById('modal-qty-display').textContent = cartData.qty || '1';
      document.getElementById('cart-modal').style.display = 'flex';
    };
  
    // Close cart modal
    document.querySelector('.close-cart-modal').onclick = () => {
      document.getElementById('cart-modal').style.display = 'none';
    };
  
    window.onclick = (event) => {
      if (event.target === document.getElementById('cart-modal')) {
        document.getElementById('cart-modal').style.display = 'none';
      }
    };
  
    // Place order
    document.getElementById('place-order-btn').onclick = () => {
      const cartData = JSON.parse(localStorage.getItem('mycart')) || {};
      if (!cartData.mummyName) {
        alert('No order to place.');
        return;
      }
      const order = {
        id: Date.now(),
        mummyMobile: cartData.mummyMobile,
        mummyName: cartData.mummyName,
        customerMobile: localStorage.getItem('currentUserMobile'),
        customerName: (users.find(u => u.mobile === localStorage.getItem('currentUserMobile')) || {}).firstName,
        food: cartData.menu,
        quantity: cartData.qty,
        orderDate: new Date().toISOString(),
        status: 'pending',
        paymentMethod: 'Cash'
      };
      let orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.removeItem('mycart');
      alert('Order placed successfully!');
      document.getElementById('cart-modal').style.display = 'none';
    };
  });
  