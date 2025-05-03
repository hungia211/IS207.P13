function register(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>

    // Lấy dữ liệu từ các trường input
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('password_confirmation').value;
    const gender = document.getElementById('gender').value;
    const birthday = document.getElementById('birthday').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    const serverIp = localStorage.getItem('serverIP'); // Đổi IP thành địa chỉ server API của bạn
    const serverPort = "8000";

    fetch(`http://${serverIp}:${serverPort}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
            gender: gender,
            birthday: birthday,
            phone: phone,
            address: address
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Đăng ký thất bại.');
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Đăng ký thành công! Chào mừng, ' + name);
        // Chuyển hướng đến trang đăng nhập
        window.location.href = "login.html";
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Đăng ký thất bại: ' + error.message);
    });
}