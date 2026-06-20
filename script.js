// ==========================================================================
// 🛒 جلب كافة عناصر الـ DOM اللازمة من الواجهة
// ==========================================================================
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartContainer = document.getElementById('cartContainer');
const cartCount = document.getElementById('cartCount');
const totalPriceValue = document.getElementById('totalPriceValue');
const addToCartButtons = document.querySelectorAll('.add-to-cart-trigger');
const wishlistButtons = document.querySelectorAll('.card-wishlist');

// 🛍️ زر الشراء النهائي الجديد
const checkoutBtn = document.getElementById('checkoutBtn'); 

// مصفوفة ديناميكية لتخزين مشتريات السلة
let globalCart = [];

// =========================================
// 1) وظائف التحكم في فتح وإغلاق السلة الجانبية
// =========================================
function toggleCartMenu(open) {
    if (open) {
        cartPanel.classList.add('open');
        cartOverlay.classList.add('show');
    } else {
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('show');
    }
}

cartToggle.addEventListener('click', () => toggleCartMenu(true));
closeCart.addEventListener('click', () => toggleCartMenu(false));
cartOverlay.addEventListener('click', () => toggleCartMenu(false));

// =========================================
// 2) إدارة السلة وإضافة المنتجات ديناميكياً
// =========================================
addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const pName = btn.getAttribute('data-name');
        const pPrice = parseFloat(btn.getAttribute('data-price'));

        // إضافة المنتج الحالي للمصفوفة
        globalCart.push({ name: pName, price: pPrice });

        // تحديث الواجهة فورياً واظهار قائمة المشتريات
        refreshCartUI();
        toggleCartMenu(true);
    });
});

function refreshCartUI() {
    // تحديث عداد السلة في الهيدر العلوي
    cartCount.textContent = globalCart.length;

    // تفريغ محتوى السلة لإعادة البناء بدون تكرار
    cartContainer.innerHTML = '';

    if (globalCart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-text">Your cart is empty.</p>';
        totalPriceValue.textContent = '$0.00';
        return;
    }

    let runningTotal = 0;

    // بناء الصفوف وحساب الإجمالي النهائي
    globalCart.forEach(item => {
        runningTotal += item.price;

        const row = document.createElement('div');
        row.classList.add('cart-item-row');
        row.innerHTML = `
            <span>${item.name}</span>
            <span style="font-weight: 700; color: #4ca2be;">$${item.price.toFixed(2)}</span>
        `;
        cartContainer.appendChild(row);
    });

    totalPriceValue.textContent = `$${runningTotal.toFixed(2)}`;
}

// =========================================
// 🚀 نظام الشراء المحاكي والربط بالمتجر الرسمي
// =========================================
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        // إذا كانت السلة فارغة
        if (globalCart.length === 0) {
            Swal.fire({
                title: 'Your cart is empty!',
                text: 'Please add some items before checking out.',
                icon: 'warning',
                confirmButtonColor: '#5ebad9'
            });
            return;
        }

        // حساب الإجمالي الفعلي للمنتجات الموجودة في المصفوفة
        let finalTotal = globalCart.reduce((sum, item) => sum + item.price, 0);

        // إغلاق السلة الجانبية لفتح الفاتورة بوضوح
        toggleCartMenu(false);

        // إظهار نافذة الفاتورة الاحترافية المتناسقة مع ألوان موقعك
        Swal.fire({
            title: '🛍️ Simulated Checkout',
            html: `
                <div style="text-align: center; color: #fff;">
                    <p>Your order has been compiled successfully inside the site!</p>
                    <h3 style="color: #5ebad9; margin: 15px 0; font-size: 24px;">Total Price: $${finalTotal.toFixed(2)}</h3>
                    <p style="font-size: 13px; color: #a3b8be;">To complete the real purchase and pay, you will be redirected to the official Sky Shop.</p>
                </div>
            `,
            icon: 'success',
            background: '#162a31', // لون الخلفية الداكنة المتناسقة مع مشروعك
            showCancelButton: true,
            confirmButtonText: 'Go to Official Sky Shop 🚀',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#5ebad9', // لون التركواز المميز عندك
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                // فتح متجر اللعبة الحقيقي في صفحة جديدة
                window.open('https://thatskyshop.com/', '_blank');
            }
        });
    });
}

// =========================================
// 3) ❤️ خاصية الإعجاب والتفاعل مع القلوب (Wishlist)
// =========================================
wishlistButtons.forEach(heartBtn => {
    heartBtn.addEventListener('click', () => {
        const icon = heartBtn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas'); 
            heartBtn.style.color = '#e74c3c'; 
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far'); 
            heartBtn.style.color = '#a3b8be'; 
        }
    });
});

// 🔄 دالة التبديل الذكي بين فورم الـ Login وفورم الـ Sign In
function switchAuth(mode) {
    const loginForm = document.getElementById('form-login');
    const signinForm = document.getElementById('form-signin');
    const loginBtn = document.getElementById('btn-login');
    const signinBtn = document.getElementById('btn-signin');

    if (mode === 'login') {
        signinForm.classList.remove('active');
        setTimeout(() => {
            loginForm.classList.add('active');
        }, 100);
        loginBtn.classList.add('active');
        signinBtn.classList.remove('active');
    } else if (mode === 'signin') {
        loginForm.classList.remove('active');
        setTimeout(() => {
            signinForm.classList.add('active');
        }, 100);
        signinBtn.classList.add('active');
        loginBtn.classList.remove('active');
    }
}

// ==========================================================================
// 🔐 سيستم تسجيل الدخول المطور بـ SweetAlert2 و LocalStorage
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('form-login');
    const signinForm = document.getElementById('form-signin');
    const forgotPassBtn = document.getElementById('forgot-pass');

    // 1️⃣ كود إنشاء حساب جديد (SIGN IN)
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const fullName = signinForm.querySelector('input[type="text"]').value;
            const email = signinForm.querySelector('input[type="email"]').value;
            const password = signinForm.querySelector('input[type="password"]').value;

            let users = JSON.parse(localStorage.getItem('sky_users')) || [];
            const userExists = users.some(user => user.email === email);

            if (userExists) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Sorry, the email is already registered. Try again.',
                    icon: 'error',
                    confirmButtonColor: '#5ebad9'
                });
                return;
            }

            users.push({ name: fullName, email: email, password: password });
            localStorage.setItem('sky_users', JSON.stringify(users));

            Swal.fire({
                title: 'Success!',
                text: 'Successfully logged in, enjoy your own world!',
                icon: 'success',
                confirmButtonColor: '#5ebad9'
            });
            
            signinForm.reset();
            switchAuth('login'); 
        });
    }

    // 2️⃣ كود تسجيل الدخول (LOGIN)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            let users = JSON.parse(localStorage.getItem('sky_users')) || [];
            const foundUser = users.find(user => user.email === email && user.password === password);

            if (foundUser) {
                Swal.fire({
                    title: 'Welcome Back!',
                    text: `Welcome back to sky world, ${foundUser.name}!`,
                    icon: 'success',
                    confirmButtonColor: '#5ebad9'
                });
            } else {
                Swal.fire({
                    title: 'Access Denied',
                    text: 'Error in the password or email, try again.',
                    icon: 'error',
                    confirmButtonColor: '#5ebad9'
                });
            }
        });
    }

    // 3️⃣ كود استرجاع كلمة المرور المطور بالكامل (Forgot Password)
    if (forgotPassBtn) {
        forgotPassBtn.addEventListener('click', (e) => {
            e.preventDefault(); 

            // استخدام نافذة إدخال فخمة من SweetAlert2 بدل prompt المتصفح البدائي
            Swal.fire({
                title: 'Reset Password',
                text: 'Please enter your email address:',
                input: 'email',
                inputPlaceholder: 'example@gmail.com',
                showCancelButton: true,
                confirmButtonColor: '#5ebad9',
                cancelButtonColor: '#d33',
                background: '#162a31',
                customClass: {
                    input: 'swal-custom-input'
                }
            }).then((result) => {
                if (result.value) {
                    const emailInput = result.value;
                    let users = JSON.parse(localStorage.getItem('sky_users')) || [];
                    const foundUser = users.find(user => user.email.toLowerCase() === emailInput.trim().toLowerCase());

                    if (foundUser) {
                        Swal.fire({
                            title: 'Account Found! 🔑',
                            html: `<p style="color:#fff;">The password for <b>${foundUser.name}</b> is:</p>
                                   <h3 style="color:#5ebad9; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px;">${foundUser.password}</h3>`,
                            icon: 'success',
                            confirmButtonColor: '#5ebad9',
                            background: '#162a31'
                        });
                    } else {
                        Swal.fire({
                            title: 'Not Found',
                            text: 'Sorry, this email does not exist.',
                            icon: 'error',
                            confirmButtonColor: '#5ebad9',
                            background: '#162a31'
                        });
                    }
                }
            });
        });
    }
});