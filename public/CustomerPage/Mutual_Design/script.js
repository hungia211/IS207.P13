//----------------------------------------------Xử lý menu (Responsive)----------------------------------------------

const menuButton = document.getElementById('menu-non-desktop');
const menu = document.querySelector('.hide-2');
const overlay = document.createElement('div');
overlay.className = 'menu-overlay';
document.body.appendChild(overlay);

const toggleMenu = (event) => {
    event.stopPropagation();
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', !isExpanded);
    menu.classList.toggle('active');
    overlay.classList.toggle('active');

    if (menu.classList.contains('active')) {
        menu.style.transform = 'translateY(0)';
        document.body.style.overflow = 'hidden'; // Ngăn cuộn khi menu mở
    } else {
        menu.style.transform = 'translateY(-100%)';
        document.body.style.overflow = 'auto'; // Khôi phục cuộn khi menu đóng
    }
};

const closeMenu = () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    menuButton.setAttribute('aria-expanded', false);
    menu.style.transform = 'translateY(-100%)';
    document.body.style.overflow = 'auto';
};

const resetMenuOnResize = () => {
    if (window.innerWidth > 991) {
        closeMenu();
    }
};

menuButton.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);
window.addEventListener('resize', resetMenuOnResize);

document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
    }
});

const transportSelect = document.getElementById('transport-type');
if (transportSelect) {
    transportSelect.addEventListener('focus', () => {
        const defaultOption = transportSelect.querySelector('option[value=""]');
        if (defaultOption) {
            defaultOption.remove();
        }
    });
}

const bankSelect = document.getElementById('type-bank');
if (bankSelect) {
    bankSelect.addEventListener('focus', () => {
        const defaultOption = bankSelect.querySelector('option[value=""]');
        if (defaultOption) {
            defaultOption.remove();
        }
    });
}

document.head.insertAdjacentHTML('beforeend', `
<style>
    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: none;
    }
    .menu-overlay.active {
        display: block;
    }
</style>
`);

//----------------------------------------------Giỏ hàng----------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    document.body.appendChild(overlay);

    const cartElement = document.querySelector(".detail-of-cart");
    const cartLink = document.getElementById("cartlink");
    const closeCartBtn = document.getElementById("closeCartBtn");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const subtotalValue = document.getElementById("subtotal-value");

    let cartItems = []; // Mảng chứa sản phẩm trong giỏ hàng

    // Hàm mở giỏ hàng
    async function openCart() {
        overlay.classList.add("active");
        cartElement.classList.add("active");
        document.body.classList.add("blurred");

        cartItemsContainer.innerHTML = "<p>Đang tải dữ liệu...</p>";

        // Gọi API để lấy dữ liệu giỏ hàng
        await fetchCartItems();

        // Hiển thị sản phẩm
        displayCartItems();
    }

    // Hàm đóng giỏ hàng
    function closeCart() {
        overlay.classList.remove("active");
        cartElement.classList.remove("active");
        document.body.classList.remove("blurred");
    }


    // Hàm định dạng giá
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price).replace('₫', 'VNĐ');
    }

    // Hàm hiển thị sản phẩm trong giỏ
    function displayCartItems() {
        cartItemsContainer.innerHTML = ""; // Làm trống danh sách sản phẩm

        let total = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>Giỏ hàng của bạn trống.</p>";
        }

        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
            itemDiv.setAttribute("data-id", item.product_id); // Gắn product_id vào thuộc tính data-id

            const price = formatPrice(item.price);

            itemDiv.innerHTML = `
                <div class="image">
                    <img src="${item.imageUrl}" alt="${item.name}">
                </div>
                <div class="main-infor">
                    <div class="cart-item-details">
                        <p class="name-product">${item.name}</p>
                        <p class="price"> ${price} </p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-button decrease" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-button increase" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-remove">
                        <button class="remove-link" data-index="${index}">Xóa</button>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(itemDiv);

            total += item.price * item.quantity; // Tính tổng giá trị


        });

        // Cập nhật tổng giá trị
        subtotalValue.textContent = total.toLocaleString() + " VND";
    }




    async function fetchCartItems() {
        try {
            // Lấy thông tin server IP và token từ localStorage
            const serverIp = localStorage.getItem('serverIP');
            const serverPort = "8000";
            const authToken = localStorage.getItem('auth_token');

            if (!serverIp || !authToken) {
                throw new Error("Thiếu server IP hoặc token xác thực.");
            }

            // Xây dựng URL
            const cartUrl = `http://${serverIp}:${serverPort}/api/cart/view`;

            // Gọi API
            const response = await fetch(cartUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Kiểm tra phản hồi
            if (!response.ok) {
                throw new Error(`API trả về lỗi: ${response.status}`);
            }

            const products = await response.json();
            cartItems = []; // Xóa dữ liệu cũ
            products.forEach(product => {
                const cartProduct = {
                    product_id: product.product_id,
                    name: product.product_name,
                    price: parseInt(product.price, 10),
                    quantity: product.quantity,
                    imageUrl: product.image
                };
                cartItems.push(cartProduct);
                console.log(`Đã thêm sản phẩm: ${product.product_name} vào giỏ hàng.`);
            });

            console.log("Dữ liệu từ server:", products);

        } catch (error) {
            console.error("Lỗi khi gọi API hoặc thêm sản phẩm vào giỏ hàng:", error);
        }
    }

    // Thêm sự kiện click để xử lý xóa sản phẩm
    cartItemsContainer.addEventListener("click", (event) => {
        const target = event.target;

        if (target.classList.contains("remove-link")) {
            // Tìm phần tử cha có chứa data-id
            const parentItem = target.closest(".item");
            const productId = parentItem?.getAttribute("data-id"); // Lấy data-id từ phần tử cha

            if (productId) {
                console.log(`Product ID cần xóa: ${productId}`);
                // Gọi API xóa sản phẩm với productId
                deleteCartItem(productId);
            } else {
                console.error("Không tìm thấy productId.");
            }
        }
    });


    // Hàm gọi API xóa sản phẩm
    async function deleteCartItem(productId) {
        try {
            const serverIp = localStorage.getItem("serverIP");
            const serverPort = "8000";
            const authToken = localStorage.getItem("auth_token");

            if (!serverIp || !authToken) {
                throw new Error("Thiếu server IP hoặc token xác thực.");
            }

            const deleteUrl = `http://${serverIp}:${serverPort}/api/cart/delete/${productId}`;
            console.log(deleteUrl);

            const response = await fetch(deleteUrl, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`API trả về lỗi: ${response.status}`);
            }

            // Nếu xóa thành công, bạn có thể cập nhật lại giao diện
            console.log(`Sản phẩm với ID ${productId} đã được xóa.`);
            cartItems = cartItems.filter(item => item.product_id !== parseInt(productId, 10));
            displayCartItems();
            alert("Sản phẩm đã được xóa khỏi giỏ hàng.");
        } catch (error) {
            console.error("Lỗi khi gọi API xóa sản phẩm:", error);
        }
    }

    // Sự kiện mở giỏ hàng
    cartLink?.addEventListener("click", (event) => {
        event.preventDefault();
        openCart();
    });

    // Sự kiện đóng giỏ hàng
    closeCartBtn?.addEventListener("click", closeCart);
    overlay?.addEventListener("click", closeCart);
});


//----------------------------------------------Điều hướng----------------------------------------------Ss

document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Ngăn hành vi mặc định của form
    window.location.href = "../TrangChu_Category/TrangChu_Category.html"; // Điều hướng đến trang khác
});

//----------------------------------------------Nút tài khoản----------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const accountMenu = document.querySelector("#account-menu");

    // Đảm bảo menu bị ẩn khi trang load
    if (!accountMenu.classList.contains("hidden")) {
        accountMenu.classList.add("hidden");
    }

    const accountLink = document.querySelector("#info-link");

    // Toggle menu khi bấm vào nút "Tài khoản"
    accountLink.addEventListener("click", function (e) {
        e.preventDefault(); // Ngăn điều hướng mặc định
        accountMenu.classList.toggle("hidden");
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener("click", function (e) {
        if (!accountMenu.contains(e.target) && !accountLink.contains(e.target)) {
            accountMenu.classList.add("hidden");
        }
    });
});

//----------------------------------------------Xử lý trạng thái Đăng nhập/ Đăng xuất (Chưa test được)----------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const accountDiv = document.getElementById("info-link"); // Div tài khoản
    const loginDiv = document.getElementById("login-link"); // Div đăng nhập

    async function checkLoginStatus() {
        try {
            const response = await fetch('/api/check-login-status'); // Đường dẫn API Laravel
            const data = await response.json();

            if (data.loggedIn) {
                // Nếu đã đăng nhập
                accountDiv.style.display = "block"; // Hiển thị tài khoản
                loginDiv.style.display = "none"; // Ẩn đăng nhập
            } else {
                // Nếu chưa đăng nhập
                accountDiv.style.display = "none"; // Ẩn tài khoản
                loginDiv.style.display = "block"; // Hiển thị đăng nhập
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
        }
    }

    // Gọi hàm kiểm tra trạng thái ngay khi trang tải
    checkLoginStatus();
});

//----------------------------------------------Thanh Search----------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const suggestionsList = document.getElementById('search-suggestions');

    // Ánh xạ tên danh mục với URL
    const categoryUrls = {
        'Hoa tươi': '../Category/FreshFlower.html',
        'Hoa khô': '../Category/DriedFlower.html',
        'Cây Xanh': '../Category/LivePlant.html',
        'Nến Thơm': '../Category/Candle.html',
        'Phụ Kiện': '../Category/Accessory.html',
    };

    // Danh mục mặc định
    const defaultCategories = Object.keys(categoryUrls);

    // Hiển thị danh mục mặc định ngay khi nhấn vào thanh tìm kiếm
    searchInput.addEventListener('focus', function () {
        displaySuggestions(
            defaultCategories.map(category => ({
                type: 'category',
                name: category,
                id: category,
            }))
        );
    });

    // Xử lý khi người dùng gõ vào thanh tìm kiếm
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim();

        if (!query) {
            // Hiển thị danh mục mặc định khi không có từ khóa
            displaySuggestions(
                defaultCategories.map(category => ({
                    type: 'category',
                    name: category,
                    id: category,
                }))
            );
            return;
        }

        // Hiển thị gợi ý danh mục mặc định khi có từ khóa
        displaySuggestions(
            defaultCategories.map(category => ({
                type: 'category',
                name: category,
                id: category,
            }))
        );
    });

    // Hiển thị các gợi ý lên giao diện
    function displaySuggestions(suggestions) {
        suggestionsList.innerHTML = ''; // Xóa gợi ý cũ
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion.type === 'category' ? `Danh mục: ${suggestion.name}` : suggestion.name;
            li.dataset.type = suggestion.type;
            li.dataset.id = suggestion.id;
            li.addEventListener('click', function () {
                searchInput.value = suggestion.name; // Điền gợi ý vào thanh tìm kiếm
                suggestionsList.style.display = 'none'; // Ẩn gợi ý

                if (suggestion.type === 'category') {
                    // Điều hướng tới trang danh mục khi người dùng chọn một danh mục
                    const categoryUrl = categoryUrls[suggestion.name];
                    if (categoryUrl) {
                        window.location.href = categoryUrl; // Điều hướng đến URL của danh mục
                    }
                }
            });
            suggestionsList.appendChild(li);
        });
        suggestionsList.style.display = 'block';
    }

    // Ẩn gợi ý khi nhấp ra ngoài
    document.addEventListener('click', function (event) {
        if (!suggestionsList.contains(event.target) && event.target !== searchInput) {
            suggestionsList.style.display = 'none';
        }
    });
});



