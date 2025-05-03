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

// Bắt sự kiện khi nhấn vào liên kết giỏ hàng
document.getElementById('cartlink').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn chuyển trang
    document.getElementById('cartLoginModal').classList.add('active'); // Thêm lớp active để mở modal
});

// Bắt sự kiện khi nhấn vào nút đóng modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('cartLoginModal').classList.remove('active'); // Loại bỏ lớp active để đóng modal
});

// Đóng modal khi click ra ngoài modal content
window.onclick = function(event) {
    if (event.target == document.getElementById('cartLoginModal')) {
        document.getElementById('cartLoginModal').classList.remove('active'); // Loại bỏ lớp active khi click ra ngoài
    }
}


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

