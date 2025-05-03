// Hàm định dạng giá
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND', 
        minimumFractionDigits: 0 
    }).format(price).replace('₫', 'VNĐ');
}

// Hàm lấy danh sách sản phẩm trong giỏ hàng
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
        const cartContainer = document.getElementById("cart-container"); // Giả sử đây là div chứa danh sách sản phẩm

        // Xóa các sản phẩm cũ trong giỏ hàng (nếu cần)
        cartContainer.innerHTML = "";

        // Thêm sản phẩm mới vào giỏ hàng
        products.forEach(product => {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "show-img";

            // Phần hình ảnh
            const imgElement = document.createElement("img");
            imgElement.src = product.image || "image/default.jpg"; // Hình ảnh mặc định nếu không có
            cartItemDiv.appendChild(imgElement);

            // Phần thông tin sản phẩm
            const infoDiv = document.createElement("div");
            infoDiv.className = "show-img-info";

            const nameParagraph = document.createElement("p");
            nameParagraph.innerHTML = `<b>${product.product_name}</b>`;
            infoDiv.appendChild(nameParagraph);

            const quantityParagraph = document.createElement("p");
            quantityParagraph.textContent = `Số lượng (${product.quantity})`;
            infoDiv.appendChild(quantityParagraph);

            cartItemDiv.appendChild(infoDiv);

            // Phần giá sản phẩm
            const costDiv = document.createElement("div");
            costDiv.className = "show-img-cost";

            const costParagraph = document.createElement("p");
            costParagraph.textContent = formatPrice(product.price); // Sử dụng hàm formatPrice
            costDiv.appendChild(costParagraph);

            cartItemDiv.appendChild(costDiv);

            // Chèn phần tử vào container
            cartContainer.appendChild(cartItemDiv);

            console.log(`Đã thêm sản phẩm: ${product.product_name} vào giỏ hàng.`);
        });

        console.log("Dữ liệu từ server:", products);

    } catch (error) {
        console.error("Lỗi khi gọi API hoặc thêm sản phẩm vào giỏ hàng:", error);
    }
}

// Hàm lấy tổng giá tiền hóa đơn
async function fetchCartTotal() {
    try {
        // Lấy thông tin server IP và token từ localStorage
        const serverIp = localStorage.getItem('serverIP');
        const serverPort = "8000";
        const authToken = localStorage.getItem('auth_token');

        if (!serverIp || !authToken) {
            throw new Error("Thiếu server IP hoặc token xác thực.");
        }

        // Xây dựng URL
        const totalUrl = `http://${serverIp}:${serverPort}/api/cart/total`;

        // Gọi API
        const response = await fetch(totalUrl, {
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

        const totalData = await response.json();
        const totalAmount = totalData.total_amount; // Giá trị tổng tiền hàng

        // Hiển thị tổng tiền hàng và tổng tiền thanh toán
        document.getElementById("cost-subtotal").textContent = formatPrice(totalAmount);
        document.getElementById("cost-total-amount").textContent = formatPrice(totalAmount);

        console.log("Tổng giá tiền từ server:", totalAmount);

    } catch (error) {
        console.error("Lỗi khi gọi API lấy tổng giá tiền hóa đơn:", error);
    }
}

// Gọi hàm khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    fetchCartItems();
    fetchCartTotal();
});

// Hàm xác nhận mua hàng
async function confirmOrder() {
    try {
        // Lấy thông tin server IP và token từ localStorage
        const serverIp = localStorage.getItem('serverIP');
        const serverPort = "8000";
        const authToken = localStorage.getItem('auth_token');

        if (!serverIp || !authToken) {
            throw new Error("Thiếu server IP hoặc token xác thực.");
        }


        // Xây dựng URL API
        const orderUrl = `http://${serverIp}:${serverPort}/api/order`;

        // Gọi API
        const response = await fetch(orderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Xử lý phản hồi
        if (!response.ok) {
            throw new Error(`API trả về lỗi: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Đơn hàng đã được tạo thành công:", result);

        // Hiển thị thông báo thành công
        alert("Đơn hàng của bạn đã được xác nhận thành công!");
        // Tùy chọn: Điều hướng người dùng đến trang lịch sử đơn hàng
        window.location.href = "../Home/Home.html";

    } catch (error) {
        console.error("Lỗi khi xác nhận đơn hàng:", error);
        alert("Có lỗi xảy ra khi xác nhận đơn hàng. Vui lòng thử lại sau.");
    }
}


