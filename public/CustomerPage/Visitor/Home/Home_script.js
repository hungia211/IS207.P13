//----------------------------------------------Google Review----------------------------------------------

const reviews = document.querySelectorAll('.review');
const prevArrow = document.querySelector('.prev');
const nextArrow = document.querySelector('.next');
let currentIndex = 0;

function updateReviews() {
    reviews.forEach((review, index) => {
        review.classList.remove('active');
        if (index === currentIndex) {
            review.classList.add('active');
        }
    });
}

prevArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    updateReviews();
});

nextArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % reviews.length;
    updateReviews();
});

updateReviews();
 

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




