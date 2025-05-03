// Hữu nghĩa code
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');
let authToken = null;


document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------- Dữ liệu ảnh ----------------------------
    const imageList = [
        "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2fe557aa5d3ba27763_63a5f9fb760c9d06faccac1f_rue-de-la-rosiere-en.jpeg",
        "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2fe557aa83f4a27761_63c1be434fdd780f5a73a04f_rue-de-la-rosiere-en%25202.jpeg",
        "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2fe557aa36fea27762_63c1be44b4194ec7f00443c8_rue-de-la-rosiere-en.jpeg",
        "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2fe557aaa3d5a27764_63c1be435558a64974e2ba2d_rue-de-la-rosiere-en3.jpeg"
    ];

    let currentImageIndex = 0;

    // ---------------------------- Lightbox ----------------------------
    const openLightbox = document.getElementById("open-lightbox");
    const lightbox = document.getElementById("product-lightbox");
    const closeLightbox = document.getElementById("close-lightbox");
    const lightboxMainImg = document.getElementById("lightbox-main-img");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const thumbnailGallery = document.getElementById("thumbnail-gallery");

    openLightbox?.addEventListener("click", () => {
        currentImageIndex = 0;
        lightboxMainImg.src = imageList[currentImageIndex];
        lightbox.style.display = "flex";

        thumbnailGallery.innerHTML = "";
        imageList.forEach((imgSrc, index) => {
            const thumbnail = document.createElement("img");
            thumbnail.src = imgSrc;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.addEventListener("click", () => {
                currentImageIndex = index;
                lightboxMainImg.src = imageList[currentImageIndex];
            });
            thumbnailGallery.appendChild(thumbnail);
        });
    });

    closeLightbox?.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    prevBtn?.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
        lightboxMainImg.src = imageList[currentImageIndex];
    });

    nextBtn?.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % imageList.length;
        lightboxMainImg.src = imageList[currentImageIndex];
    });

    // --------------------------- Carousel ---------------------------
    const carousel = document.getElementById("carousel");
    const leftBtn = document.getElementById("left-btn");
    const rightBtn = document.getElementById("right-btn");

    leftBtn?.addEventListener("click", () => {
        carousel.scrollBy({ left: -150, behavior: "smooth" });
    });

    rightBtn?.addEventListener("click", () => {
        carousel.scrollBy({ left: 150, behavior: "smooth" });
    });

    // ------------------------ Quantity Control -----------------------
    const increaseBtn = document.getElementById("increase-btn");
    const decreaseBtn = document.getElementById("decrease-btn");
    const quantityInput = document.querySelector(".quantity-input");

    increaseBtn?.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value, 10);
        quantityInput.value = currentValue + 1;
    });

    decreaseBtn?.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value, 10);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    // Hàm định dạng giá
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price).replace('₫', 'VNĐ');
    }

    // ------------------------ Lấy thông tin sản phẩm theo id -----------------------
    const serverIp = localStorage.getItem('serverIP');
    const serverPort = "8000";
    const productUrl = `http://${serverIp}:${serverPort}/api/product/view/${productId}`;
    authToken = localStorage.getItem('auth_token');

    fetch(productUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API trả về lỗi: ${response.status}`);
            }
            return response.json();
        })
        .then(product => {
            // Cập nhật breadcrumb
            const breadcrumbCategory = document.querySelector('.breadcrumb .breadcrumb-link');

            // Kiểm tra category_name và đặt đường dẫn phù hợp
            switch (product.category_name) {
                case 'Hoa tươi':
                    breadcrumbCategory.href = '../Category/FreshFlower.html';
                    break;
                case 'Hoa khô':
                    breadcrumbCategory.href = '../Category/DriedFlower.html';
                    break;
                case 'Cây xanh':
                    breadcrumbCategory.href = '../Category/LivePlant.html';
                    break;
                case 'Nến thơm':
                    breadcrumbCategory.href = '../Category/Candle.html';
                    break;
                case 'Phụ kiện':
                    breadcrumbCategory.href = '../Category/Accessory.html';
                    break;
                default:
                    breadcrumbCategory.href = '#'; // Đường dẫn mặc định nếu category_name không khớp
                    break;
            }
            
            // Gán tên của category vào breadcrumb
            breadcrumbCategory.textContent = product.category_name;

            
            const breadcrumbActive = document.querySelector('.breadcrumb .breadcrumb-link.active');
            breadcrumbActive.textContent = product.product_name;

            // Format price as currency
            const formattedPrice = formatPrice(product.price)

            // Cập nhật thông tin sản phẩm
            document.querySelector('.product-name').textContent = product.product_name;
            document.querySelector('.product-price').textContent = formattedPrice;
            document.querySelector('.description').textContent = product.description;

            // Cập nhật ảnh sản phẩm
            const productImage = document.querySelector('.image-product img');
            productImage.src = product.image;
            productImage.alt = product.product_name;

            const lightboxMainImg = document.getElementById('lightbox-main-img');
            lightboxMainImg.src = product.image;
            lightboxMainImg.alt = product.product_name;
        })
        .catch(error => {
            console.error('Lỗi khi lấy thông tin sản phẩm:', error);
            alert('Không thể tải thông tin sản phẩm!');
        });


    // ------------------------ Lấy sản phẩm đi kèm lên -----------------------
    
    const category = 'Phụ kiện';
    const countUrl = `http://${serverIp}:${serverPort}/api/product/category?category_name=${encodeURIComponent(category)}`;

    fetch(countUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('Response status:', response.status); // Kiểm tra trạng thái phản hồi
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // Kiểm tra dữ liệu nhận được
            const carousel = document.getElementById('carousel'); // Đảm bảo phần tử carousel tồn tại
            if (!carousel) {
                console.error('Carousel element not found');
                return;
            }
            data.forEach(product => {
                const item = document.createElement('div');
                item.className = 'carousel-item';
                item.setAttribute('data-product-id', product.product_id); // Add data attribute for product ID

                // Format price as currency
                const formattedPrice = formatPrice(product.price);


                item.innerHTML = `
                    <img src="${product.image}" alt="${product.product_name}">
                    <p>${product.product_name}</p>
                    <div>${formattedPrice}</div>
                `;
                carousel.appendChild(item);
            });
        })
        .catch(error => console.error('Error fetching products:', error));

});

// ------------------------ Thêm sản phẩm vào giỏ hàng -----------------------
async function addToCart() {
    try {
        // Lấy server IP và token từ localStorage
        const serverIp = localStorage.getItem('serverIP');
        const serverPort = "8000";
        const authToken = localStorage.getItem('auth_token');

        if (!serverIp || !authToken) {
            throw new Error("Thiếu server IP hoặc token xác thực.");
        }

        // Lấy giá trị số lượng từ ô input
        const quantityInput = document.querySelector(".quantity-input");
        const quantity = parseInt(quantityInput.value, 10);

        if (isNaN(quantity) || quantity <= 0) {
            alert("Số lượng không hợp lệ.");
            return;
        }

        // Xây dựng URL và payload
        const addCartUrl = `http://${serverIp}:${serverPort}/api/cart/add`;
        const payload = {
            product_id: productId,
            quantity: quantity,
        };

        // Gọi API
        const response = await fetch(addCartUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        // Kiểm tra phản hồi
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `API trả về lỗi: ${response.status}`);
        }

        // Thông báo thành công
        document.querySelector(".quantity-input").value = 1;
        const responseData = await response.json();
        console.log("Thêm sản phẩm vào giỏ hàng thành công:", responseData);
        alert("Sản phẩm đã được thêm vào giỏ hàng.");
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
    }
}

