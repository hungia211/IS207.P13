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

//----------------------------------------------Giao diện phân loại----------------------------------------------

// Hàm định dạng giá
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VND';
}

// Hàm tạo các dòng sản phẩm
function generateProductRows(products) {
    const container = document.getElementById("product-container");
    let productCount = products.length;
    let rows = Math.floor(productCount / 2);

    // Nếu sản phẩm lẻ, cộng thêm 1 hàng
    if (productCount % 2 !== 0) {
        rows += 1;
    }

    // Tạo các dòng sản phẩm
    let productIndex = 0;
    for (let i = 0; i < rows; i++) {
        // Tạo div product-wrapper
        const productWrapper = document.createElement("div");
        productWrapper.classList.add("product-wrapper");

        // Tạo 2 div cho 2 sản phẩm
        for (let j = 0; j < 2; j++) {
            // Kiểm tra nếu đây là sản phẩm cuối cùng (trong trường hợp số lượng sản phẩm là lẻ)
            if (productIndex >= productCount) {
                // Nếu là sản phẩm lẻ và chưa có sản phẩm ở bên phải
                const productSide = document.createElement("div");
                productSide.classList.add("product-right");
                // Thêm div trống vào product-right
                const emptyDiv = document.createElement("div");
                emptyDiv.classList.add("product-image");
                emptyDiv.style.backgroundColor = "#fff";  
                productSide.appendChild(emptyDiv);
                productWrapper.appendChild(productSide);
                break;
            }

            // Tạo div cho sản phẩm
            const productSide = document.createElement("div");
            productSide.classList.add(j === 0 ? "product-left" : "product-right");

            // Tạo div image và text cho mỗi sản phẩm
            const productImageDiv = document.createElement("div");
            productImageDiv.classList.add("product-image");
            const productTextDiv = document.createElement("div");
            productTextDiv.classList.add("product-text");

            // Lấy thông tin sản phẩm từ mảng
            const product = products[productIndex];
            const productImg = document.createElement("img");
            productImg.src = product.image;

            // Tạo phần tử text-name và text-price
            const productNameDiv = document.createElement("div");
            productNameDiv.classList.add("text-name");
            const productNameText = document.createElement("p");
            productNameText.innerHTML = product.name;
            productNameDiv.appendChild(productNameText);

            const productPriceDiv = document.createElement("div");
            productPriceDiv.classList.add("text-price");
            const productPriceText = document.createElement("p");
            productPriceText.innerHTML = formatPrice(product.price);  // Định dạng giá
            productPriceDiv.appendChild(productPriceText);

            // Thêm thông tin vào sản phẩm
            productImageDiv.appendChild(productImg);
            productTextDiv.appendChild(productNameDiv);
            productTextDiv.appendChild(productPriceDiv);
            productSide.appendChild(productImageDiv);
            productSide.appendChild(productTextDiv);

            // Thêm vào product-wrapper
            productWrapper.appendChild(productSide);

            // Tăng chỉ số sản phẩm
            productIndex++;
        }

        // Thêm product-wrapper vào container
        container.appendChild(productWrapper);
    }

    // Kiểm tra nếu có ít nhất 1 product-wrapper, thêm lớp để bỏ gạch chân cho phần tử cuối cùng
    if (container.children.length >= 2) {
        const productWrappers = container.querySelectorAll(".product-wrapper");
        productWrappers[productWrappers.length - 1].classList.add("remove-border-bottom");
    }
}

// Hàm lấy sản phẩm từ API Laravel
function fetchProducts() {
    fetch('http://your-laravel-app.test/api/products')
        .then(response => response.json())
        .then(data => {
            generateProductRows(data);  // Gọi hàm tạo các dòng sản phẩm
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Nếu chưa kết nối với backend, sử dụng dữ liệu giả lập
const isBackendConnected = false;  // Thay đổi giá trị này khi kết nối với backend

if (isBackendConnected) {
    fetchProducts();  // Gọi API khi backend đã kết nối
} else {
    // Dữ liệu giả lập
    const products = [
        { "name": "Nến Thơm Lavender Relax", "price": 150000, "image": "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f3194363fa747f2647b_6408c2888ca916190bf375ca_nestnewyork_wellness_himalayansaltrosewater_candle_3wick_1_720x.webp" },
        { "name": "Nến Thơm Vanilla Sweet", "price": 180000, "image": "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f32e6dcecbc89f1519a_6408c011b8c50c3437263eb4_nestnewyork_rattan_grapefruit_candle_classic_1_540x.webp" },
        { "name": "Nến Thơm Rose Romantic", "price": 200000, "image": "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f31620f2b53066da61c_640a14a8a46e68073be0f597_nestnewyork_wellness_himalayansaltrosewater_reeddiffuser_1_540x%2520copy.webp" },
        { "name": "Nến Thơm Sandalwood Classic", "price": 220000, "image": "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2dedb324b76a587a45_6408c2f98739bfa8d0f7a0cd_nestnewyork_wilderness_charcoalwoods_candle_3wick_1_720x%2520copy-p-800.webp" },
        { "name": "Nến Thơm Lemongrass Refresh", "price": 130000, "image": "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2d3919512281f29d8b_6408c027635ca62bba32f82e_NEST01LZM002_LimeZest_Classic_wBox_2000x2000_371dceb6-99e5-4784-aded-fd42decc0c26_720x.webp" },
        { "name": "Nến Thơm Ocean Breeze", "price": 170000, "image": "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2d9bdb21b8a5542dbb_6408c2cd7a302656024c5b49_nestnewyork_bamboo_candle_classic_1_720x.webp" },
        { "name": "Nến Thơm Eucalyptus Calm", "price": 160000, "image": "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2d8e29761f0ec24531_6408c18d95246d743cd0108a_nestnewyork_wellness_driftwoodchamomile_candle_3wick_1_540x.webp" },
        { "name": "Nến Thơm Citrus Energy", "price": 140000, "image": "https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f3253b60dff794e8c8e_640a14c4f6e4026c4b5ea553_nestnewyork_rattan_cedarleaflavender_reeddiffuser_1_720x%2520copy-p-800.webp" },
        { "name": "Nến Thơm Jasmine Bliss", "price": 190000, "image": "https://b2b.affariofsweden.com/storage/8FF95812EF7C3A980DE9C705FADD473FBA9A82808B73EDECA80377F6FBD0A545/ca915e9d328545d1aaaf4ef4626c85ad/520-520-0-png.Png/media/39a13b3ff8f14e399c6f4ee65a4129e9/420-062-08.png" },
        { "name": "Nến Thơm Cinnamon Cozy", "price": 200000, "image": "https://simplynorthwest.com/cdn/shop/products/image_7fff78e5-6549-436a-a9c9-7e908d68fa74_grande.jpg?v=1618165733" }
      ]
      ;
    generateProductRows(products);  // Gọi hàm tạo các dòng sản phẩm với dữ liệu giả lập
}
