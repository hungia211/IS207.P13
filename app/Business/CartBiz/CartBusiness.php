<?php

namespace App\Business\CartBiz;

use App\Business\CartBiz\CartDAO;
use Exception;
use App\Models\Cart;

class CartBusiness
{
    protected CartDAO $cartDAO;

    public function __construct()
    {
        $this->cartDAO = new CartDAO();
    }

    // Lấy tất cả sản phẩm trong giỏ hàng của người dùng
    public function getAllCartProduct(int $userId)
    {
        if ($userId <= 0) {
            throw new Exception("ID người dùng không hợp lệ");
        }

        try {
            // Gọi phương thức của CartDAO để lấy thông tin tất cả sản phẩm trong giỏ hàng
            return $this->cartDAO->getAllCartProduct($userId);
        } catch (Exception $e) {
            throw new Exception("Không thể lấy thông tin giỏ hàng: " . $e->getMessage());
        }
    }


    // Thêm sản phẩm vào giỏ hàng
    public function addProductToCart(int $userId, int $productId, int $quantity)
    {
        if ($userId <= 0 || $productId <= 0 || $quantity <= 0) {
            throw new Exception("Thông tin không hợp lệ");
        }

        try {
            // Lấy ID giỏ hàng theo ID người dùng
            $cartId = $this->cartDAO->getCartIdByUserId($userId);

            if (!$cartId) {
                throw new Exception("Không tìm thấy giỏ hàng");
            }

            // Thêm sản phẩm vào giỏ hàng
            return $this->cartDAO->addProductToCart($cartId, $productId, $quantity);
        } catch (Exception $e) {
            throw new Exception("Không thể thêm sản phẩm vào giỏ hàng: " . $e->getMessage());
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function deleteProductFromCart(int $userId, int $productId)
    {
        if ($userId <= 0 || $productId <= 0) {
            throw new Exception("Thông tin không hợp lệ");
        }

        try {
            // Lấy ID giỏ hàng theo ID người dùng
            $cartId = $this->cartDAO->getCartIdByUserId($userId);

            if (!$cartId) {
                throw new Exception("Không tìm thấy giỏ hàng");
            }

            // Xóa sản phẩm khỏi giỏ hàng
            return $this->cartDAO->deleteProductFromCart($cartId, $productId);
        } catch (Exception $e) {
            throw new Exception("Không thể xóa sản phẩm khỏi giỏ hàng: " . $e->getMessage());
        }
    }

    // Tính tổng tiền của giỏ hàng
    public function calculateCartTotalAmount(int $userId): float
    {
        if ($userId <= 0) {
            throw new Exception("ID người dùng không hợp lệ");
        }

        try {
            return $this->cartDAO->calculateCartTotalAmount($userId);
        } catch (Exception $e) {
            throw new Exception("Không thể tính tổng tiền của giỏ hàng: " . $e->getMessage());
        }
    }
}
