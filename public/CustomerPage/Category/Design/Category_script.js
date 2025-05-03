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

    // Lấy tên file HTML hiện tại từ URL
    const currentPage = window.location.pathname.split("/").pop();


    // Hàm gọi API theo category_name
    function fetchProductsByCategory(categoryName) {
        const serverIp = localStorage.getItem('serverIP'); // Đổi IP thành địa chỉ server API của bạn
        const serverPort = "8000";

        // Sử dụng GET, truyền category_name vào query string
        fetch(`http://${serverIp}:${serverPort}/api/product/category?category_name=${encodeURIComponent(categoryName)}`, {
            method: "GET", // Sửa thành GET
            headers: {
                "Content-Type": "application/json", // Với GET, dòng này không cần thiết, nhưng không gây lỗi nếu giữ lại
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Gọi hàm generateProductRows để hiển thị sản phẩm
                generateProductRows(data);
            })
            .catch(error => console.error(`Lỗi khi lấy sản phẩm ${categoryName}:`, error));
    }

    switch (currentPage) {
        case "FreshFlower.html":
            fetchProductsByCategory("Hoa tươi");
            break;
        case "DriedFlower.html":
            fetchProductsByCategory("Hoa khô");
            break;
        case "LivePlant.html":
            fetchProductsByCategory("Cây xanh");
            break;
        case "Candle.html":
            fetchProductsByCategory("Nến thơm");
            break;
        case "Accessory.html":
            fetchProductsByCategory("Phụ kiện");
            break;
        default:
            console.error("Trang không hợp lệ.");
    }
});


//----------------------------------------------Giao diện phân loại----------------------------------------------

// Hàm định dạng giá
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price).replace('₫', 'VNĐ');
}


// Hàm tạo các dòng sản phẩm
function generateProductRows(products) {
    const container = document.getElementById("product-container");
    let productCount = products.length;
    let rows = Math.floor(productCount / 2);

    // Nếu số sản phẩm lẻ, thêm 1 hàng
    if (productCount % 2 !== 0) {
        rows += 1;
    }

    let productIndex = 0;
    for (let i = 0; i < rows; i++) {
        const productWrapper = document.createElement("div");
        productWrapper.classList.add("product-wrapper");

        for (let j = 0; j < 2; j++) {
            if (productIndex >= productCount) {
                break; // Nếu không còn sản phẩm, dừng lại
            }

            const product = products[productIndex];
            const productSide = document.createElement("div");
            productSide.classList.add(j === 0 ? "product-left" : "product-right");

            // Tạo thẻ <a> bọc nội dung sản phẩm
            const productLink = document.createElement("a");
            productLink.href = `../Product/Product.html?product_id=${product.product_id}`; // Gắn product_id vào URL
            productLink.classList.add("product-link");

            // Tạo div ảnh sản phẩm
            const productImageDiv = document.createElement("div");
            productImageDiv.classList.add("product-image");
            const productImg = document.createElement("img");
            productImg.src = product.image; // URL ảnh sản phẩm
            productImageDiv.appendChild(productImg);

            // Tạo div thông tin sản phẩm
            const productTextDiv = document.createElement("div");
            productTextDiv.classList.add("product-text");

            const productNameDiv = document.createElement("div");
            productNameDiv.classList.add("text-name");
            const productNameText = document.createElement("p");
            productNameText.innerHTML = product.product_name;
            productNameDiv.appendChild(productNameText);

            const productPriceDiv = document.createElement("div");
            productPriceDiv.classList.add("text-price");
            const productPriceText = document.createElement("p");
            productPriceText.innerHTML = formatPrice(product.price); // Định dạng giá
            productPriceDiv.appendChild(productPriceText);

            // Thêm vào product-text
            productTextDiv.appendChild(productNameDiv);
            productTextDiv.appendChild(productPriceDiv);

            // Thêm tất cả vào thẻ <a>
            productLink.appendChild(productImageDiv);
            productLink.appendChild(productTextDiv);

            // Thêm thẻ <a> vào product-side
            productSide.appendChild(productLink);
            

            // Thêm product-side vào product-wrapper
            productWrapper.appendChild(productSide);

            productIndex++;
        }

        // Thêm product-wrapper vào container
        container.appendChild(productWrapper);
    }


    // Kiểm tra nếu có ít nhất 1 product-wrapper, thêm lớp để bỏ gạch chân cho phần tử cuối cùng
    if (container.children.length >= 2) {
        const productWrappers = container.querySelectorAll("    .product-wrapper");
        productWrappers[productWrappers.length - 1].classList.add("remove-border-bottom");
    }
}

