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
        { "name": "Cây Lưỡi Hổ Mini", "price": 120000, "image": "https://img.freepik.com/premium-psd/white-vase-with-flower-it-that-is-shaped-like-flower_904424-34.jpg" },
        { "name": "Cây Kim Tiền Phong Thủy", "price": 250000, "image": "https://www.tbmitchell.co.uk/uploads/images/products/verylarge/tb-mitchell-georg-jensen-georg-jensen-living-stainless-steel-bloom-botanica-flower-pot-small-10019580-171802191810019580-2.png" },
        { "name": "Cây Xương Rồng Chậu Trắng", "price": 90000, "image": "https://www.2modern.com/cdn/shop/products/georg-jensen-bloom-botanica-flower-pot-view-add03_580x.jpg?v=1655101209" },
        { "name": "Cây Monstera Mini", "price": 180000, "image": "https://www.nordicnest.com/assets/blobs/georg-jensen-bloom-botanica-flower-pot-12-cm/510594-01_2_ProductImageExtra-04c23d5eb9.jpg" },
        { "name": "Cây Ngũ Gia Bì Chậu Sứ", "price": 200000, "image": "https://mobileimages.lowes.com/productimages/20018687-dfe1-4d3c-9f90-d9e8f3ecb4fa/66298933.jpeg?size=pdhism" },
        { "name": "Cây Trầu Bà Lá Xẻ", "price": 220000, "image": "https://static.vecteezy.com/system/resources/thumbnails/024/859/837/small_2x/monstera-plant-in-ceramic-pot-illustration-ai-generative-png.png" },
        { "name": "Cây Lan Ý Thanh Lọc Không Khí", "price": 190000, "image": "https://hugaplant.com/cdn/shop/products/1MAIN_8162b27b-a16d-42a3-b780-c529d249bc12.png?v=1680073885" },
        { "name": "Cây Sen Đá Ngọc", "price": 80000, "image": "https://static.vecteezy.com/system/resources/previews/041/290/451/non_2x/ai-generated-aglaonema-plant-isolated-on-transparent-background-free-png.png" },
        { "name": "Cây Cọ Nhật Mini", "price": 250000, "image": "https://static.vecteezy.com/system/resources/thumbnails/024/859/837/small_2x/monstera-plant-in-ceramic-pot-illustration-ai-generative-png.png" },
        { "name": "Cây Phát Tài", "price": 300000, "image": "https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-home-plant-in-pot-cutout-png-image_11899655.png" },
        { "name": "Cây Cau Cảnh", "price": 270000, "image": "https://png.pngtree.com/png-vector/20241203/ourmid/pngtree-modern-indoor-plant-isolated-png-image_14570068.png" },
        { "name": "Cây Đuôi Công Tím", "price": 240000, "image": "https://static.vecteezy.com/system/resources/previews/045/545/614/non_2x/transparent-indoor-plants-free-png.png" }
      ]
      ;
    generateProductRows(products);  // Gọi hàm tạo các dòng sản phẩm với dữ liệu giả lập
}
