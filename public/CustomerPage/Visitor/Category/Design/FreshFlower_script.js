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
        { "name": "Hoa Cẩm Tú Cầu Trắng", "price": 200000, "image": "https://assets.wfcdn.com/im/50606989/compr-r85/2892/289288453/blue-and-green-hydrangea-arrangement.jpg" },
        { "name": "Hoa Mai Trắng", "price": 250000, "image": "https://static.vecteezy.com/system/resources/previews/052/388/541/non_2x/elegant-transparent-flowers-arranged-in-a-simple-vase-against-a-clean-transparent-background-vase-with-beautiful-transparent-flowers-file-of-isolated-object-with-shadow-on-transparent-background-free-png.png" },
        { "name": "Hoa Lan", "price": 300000, "image": "https://png.pngtree.com/png-vector/20240315/ourmid/pngtree-vase-with-a-beautiful-flowers-on-transparent-generated-ai-png-image_11941254.png" },
        { "name": "Hoa Hồng Trắng", "price": 150000, "image": "https://www.eg2i.com/uploads/product_image/product_75_2.jpg" },
        { "name": "Hoa Thập Cẩm", "price": 350000, "image": "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1623979967/vendor/8284/catalog/product/t/e/teleflora_s_fresh_flourish_bouquet_60cb954a8e0e2._60cb954cbb71e..jpg" },
        { "name": "Hoa Hồng Tím", "price": 200000, "image": "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1623978394/vendor/8284/catalog/product/t/e/teleflora_s_dream_of_roses_60cb8f2456600._60cb8f273dee9..jpg" },
        { "name": "Hoa Hồng Tím Lớn", "price": 400000, "image": "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1674525750/vendor/6397/catalog/product/t/e/teleflora_s_morning_melody_18_1_195.jpg" },
        { "name": "Hoa Hồng và Hoa Ly, Hoa cẩm tú cầu", "price": 500000, "image": "https://fleuristeladiva.ca/boutique/image/cache/catalog/Funerals/Fleuriste-la-diva-fun%C3%A9raille-Laval-bouquet-arrangement-fun%C3%A9raire-beautiful-in-blue-980x980.jpg" },
        { "name": "Hoa Hồng và Hoa Ly Trắng", "price": 300000, "image": "https://png.pngtree.com/png-vector/20241117/ourmid/pngtree-remembrance-bouquet-white-lilly-and-rose-png-image_14466362.png" },
        { "name": "Hoa Hồng và hoa Ly Đỏ", "price": 320000, "image": "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1705631438/vendor/7361/catalog/product/t/e/teleflora_s_happy_in_love_bouquet_5e3c60caa0f3e_5e3c60cce34c5.jpg" },
        { "name": "Hoa Ly Trắng", "price": 280000, "image": "https://cdn.efwh.net/public/bf/3c/0ecdeaa47bf5e2ac60a50b7e96446f1b0298.jpg" },
        { "name": "Hoa Loa Kèn Trắng", "price": 250000, "image": "https://cdn11.bigcommerce.com/s-pg5h85hqc1/images/stencil/590x590/products/549/2157/FL-0145-Vase-1__64886.1687127207.jpg?c=1" },
        { "name": "Hoa Loa Kèn kết Hợp Với Hoa Bi Trắng", "price": 260000, "image": "https://cdn11.bigcommerce.com/s-pg5h85hqc1/images/stencil/590x590/products/677/3083/FL-0166-WH-Vase-1__54821.1730567284.jpg?c=1" },
        { "name": "Hoa Hồng Đỏ", "price": 220000, "image": "https://www.floravietnam.com/images/thumbnails/465/465/product/1/red-and-pink-roses-in-glass-vase-floravietnam.jpg" },
        { "name": "Hoa Tulip", "price": 350000, "image": "https://png.pngtree.com/png-vector/20240506/ourmid/pngtree-whispering-winds-yellow-and-white-tulips-adorned-with-greenery-png-image_12286754.png" },
        { "name": "Hoa valentine loại 1", "price": 300000, "image": "https://cdn.globalrose.com/assets/img/prod/fresh-red-bouquets-flowers-for-valentines-day-globalrose.png" },
        { "name": "Hoa valentine loại 2", "price": 320000, "image": "https://cdn.globalrose.com/assets/img/prod/beautiful-bouquets-valentines-day-fresh-flowers-globalrose.png" },
        { "name": "Hoa valentine loại 3", "price": 350000, "image": "https://cdn.globalrose.com/assets/img/prod/bouquets-for-valentines-day-red-roses-delivery-globalrose.png" },
        { "name": "Hoa Hồng", "price": 250000, "image": "https://www.hbloom.com/cdn/shop/products/HB_product_1dozenRedRoses_2048x.jpg?v=1580859392" },
        { "name": "Hoa Hướng Dương", "price": 300000, "image": "https://img.pikbest.com/origin/10/07/46/74MpIkbEsTENF.png!sw800" }
      ]
      ;
    generateProductRows(products);  // Gọi hàm tạo các dòng sản phẩm với dữ liệu giả lập
}
