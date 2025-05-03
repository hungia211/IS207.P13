<?php

namespace App\Business\OrderBiz;

use App\Business\CartBiz\CartDAO;
use App\Business\OrderBiz\OrderDAO;
use App\Business\CustomerBiz\CustomerDAO;
use Exception;
use App\Models\Order;

class OrderBusiness
{
    protected OrderDAO $orderDAO;
    protected CartDAO $cartDAO;
    protected CustomerDAO $customerDAO;

    public function __construct()
    {
        $this->orderDAO = new OrderDAO();
        $this->cartDAO = new CartDAO();
        $this->customerDAO = new CustomerDAO();
    }

    // Thêm mới đơn hàng
    public function createOrder(int $userId)
    {
        try {
            // Lấy detail_user_id theo user_id
            $detailUserId = $this->customerDAO->getDetailUserIdByUserId($userId);

            if (!$detailUserId) {
                throw new Exception("Không tìm thấy thông tin khách hàng");
            }

            // Gọi phương thức của OrderDAO để thêm đơn hàng
            $orderId = $this->orderDAO->createOrder($detailUserId);

            // Thêm các sản phẩm từ giỏ hàng vào đơn hàng
            $this->addProductsFromCartToOrder($userId, $orderId);

            return $orderId; // Trả về ID của đơn hàng vừa tạo
        } catch (Exception $e) {
            throw new Exception("Không thể tạo đơn hàng: " . $e->getMessage());
        }
    }

    // Xem tất cả đơn hàng
    public function viewAllOrders()
    {
        try {
            return $this->orderDAO->getAllOrders();
        } catch (Exception $e) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin đơn hàng theo ID
    public function viewOrderById(int $orderId)
    {
        try {
            $order = $this->orderDAO->getOrderById($orderId);

            if ($order) {
                return $order->toArray();
            }
        } catch (Exception $e) {
            throw new Exception("Không tìm thấy đơn hàng: " . $e->getMessage());
        }
    }

    // Xem thông tin đơn hàng theo ID khách hàng
    public function viewOrderByUserId(int $userId)
    {
        try {
            return $this->orderDAO->getOrderByUserId($userId);
        } catch (Exception $e) {
            throw new Exception("Không tìm thấy đơn hàng: " . $e->getMessage());
        }
    }

    // Cập nhật thông tin đơn hàng
    public function updateOrder(array $data, int $orderId)
    {
        try {
            $order = new Order(
                $orderId,               // ID đơn hàng cần cập nhật
                null,
                null,
                $data['status'],
                null,
                null
            );

            $updatedRows = $this->orderDAO->updateOrder($order);
            if ($updatedRows === 0) {
                throw new Exception("Cập nhật thất bại hoặc không tìm thấy đơn hàng");
            }
        } catch (Exception $e) {
            throw new Exception("Lỗi khi cập nhật đơn hàng: " . $e->getMessage());
        }
    }

    // Xóa đơn hàng
    public function deleteOrder(int $orderId)
    {
        try {
            return $this->orderDAO->deleteOrder($orderId);
        } catch (Exception $e) {
            throw new Exception("Không thể xóa đơn hàng: " . $e->getMessage());
        }
    }

    // Thêm các sản phẩm ở giỏ hàng vào đơn hàng
    public function addProductsFromCartToOrder(int $userId, int $orderId)
    {
        try {
            // Lấy ID giỏ hàng theo ID người dùng
            $cartId = $this->cartDAO->getCartIdByUserId($userId);

            if (!$cartId) {
                throw new Exception("Không tìm thấy giỏ hàng");
            }

            // Lấy thông tin sản phẩm và số lượng theo cart_id
            $products = $this->cartDAO->getProductDetailsByCartId($cartId);

            // Thêm sản phẩm vào đơn hàng
            foreach ($products as $product) {
                $this->orderDAO->addProductToOrder($orderId, $product->product_id, $product->quantity);
            }

            // Xóa tất cả sản phẩm trong giỏ hàng sau khi đặt hàng
            $this->cartDAO->deleteAllProductFromCart($cartId);
        } catch (Exception $e) {
            throw new Exception("Không thể thêm sản phẩm từ giỏ hàng vào đơn hàng: " . $e->getMessage());
        }
    }

    // Tính tổng tiền của đơn hàng
    public function calculateTotalAmount(int $orderId): float
    {
        try {
            return $this->orderDAO->calculateTotalAmount($orderId);
        } catch (Exception $e) {
            throw new Exception("Không thể tính tổng tiền của đơn hàng: " . $e->getMessage());
        }
    }

    // Tính tổng tiền của đơn hàng khi áp dụng mã giảm giá
    public function calculateTotalAmountWithDiscount(int $orderId, string $discountCode): float
    {
        try {
            // Tính tổng tiền của đơn hàng
            $totalAmount = $this->calculateTotalAmount($orderId);

            // Lấy phần trăm giảm giá dựa vào mã giảm giá
            $discountPercentage = $this->orderDAO->getDiscountPercentageByCode($discountCode);

            if ($discountPercentage === null) {
                throw new Exception("Mã giảm giá không hợp lệ");
            }

            // Tính tổng tiền sau khi áp dụng giảm giá
            $discountedAmount = $totalAmount - ($totalAmount * ($discountPercentage));

            return $discountedAmount;
        } catch (Exception $e) {
            throw new Exception("Không thể tính tổng tiền của đơn hàng với mã giảm giá: " . $e->getMessage());
        }
    }
}
