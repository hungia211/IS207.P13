<?php

namespace App\Business\OrderBiz;

use Illuminate\Support\Facades\DB;
use App\Models\Order;

class OrderDAO
{
    // Lấy tất cả đơn hàng
    public function getAllOrders()
    {
        $query = "SELECT "
            . "    order_id, "
            . "    O.detail_user_id, "
            . "    name, "
            . "    status, "
            . "    created_at, "
            . "    updated_at "
            . " FROM Orders O "
            . "     JOIN Detail_Users DU ON O.detail_user_id = DU.detail_user_id "
            . " WHERE DU.IsDeleted = 0";

        return DB::select($query); // Trả về danh sách đơn hàng
    }

    // Lấy thông tin đơn hàng theo ID
    public function getOrderById(int $orderId): ?Order
    {
        $query = "SELECT "
            . "    order_id, "
            . "    O.detail_user_id, "
            . "    name, "
            . "    status, "
            . "    created_at, "
            . "    updated_at "
            . " FROM Orders O "
            . "     JOIN Detail_Users DU ON O.detail_user_id = DU.detail_user_id "
            . " WHERE DU.IsDeleted = 0 AND order_id = :order_id";

        $result = DB::selectOne($query, ['order_id' => $orderId]);

        if (!$result) {
            return null;
        }

        return new Order(
            $result->order_id,
            $result->detail_user_id,
            $result->name,
            $result->status,
            $result->created_at,
            $result->updated_at
        );
    }

    // Lấy thông tin đơn hàng theo ID người dùng
    public function getOrderByUserId(int $userId)
    {
        $query = "SELECT "
            . "    order_id, "
            . "    O.detail_user_id, "
            . "    status, "
            . "    O.created_at, "
            . "    O.updated_at "
            . " FROM Orders O "
            . "     JOIN Detail_Users DU ON O.detail_user_id = DU.detail_user_id "
            . "     JOIN users U ON DU.user_id = U.id "
            . " WHERE DU.IsDeleted = 0 AND user_id = :user_id AND O.IsDeleted = 0";

        return DB::select($query, ['user_id' => $userId]);  // Trả về danh sách đơn hàng
    }

    // Thêm mới đơn hàng
    public function createOrder(int $detailUserId)
    {
        try {
            DB::beginTransaction();

            $query = "INSERT INTO Orders (detail_user_id, status, IsDeleted) "
                . " VALUES (:detail_user_id, 'Pending', 0)";

            DB::insert($query, [
                'detail_user_id' => $detailUserId,
            ]);

            // Lấy Id của đơn hàng vừa được tạo
            $orderId = DB::getPdo()->lastInsertId();

            // Xác nhận transaction
            DB::commit();

            return (int) $orderId; // Thành công

        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Không thể thêm đơn hàng: ' . $e->getMessage());
        }
    }

    // Thêm mới các sản phẩm trong đơn hàng
    public function createOrderDetail(int $orderId, int $productId, int $quantity)
    {
        $query = "INSERT INTO Order_Details (order_id, product_id, quantity) "
            . " VALUES (:order_id, :product_id, :quantity)";

        return DB::insert($query, [
            'order_id' => $orderId,
            'product_id' => $productId,
            'quantity' => $quantity,
        ]);
    }

    // Cập nhật thông tin đơn hàng
    public function updateOrder(Order $order)
    {
        $query = "UPDATE Orders "
            . " SET "
            . " status = :status "
            . " WHERE order_id = :order_id AND IsDeleted = 0";

        return DB::update($query, [
            'status' => $order->getStatus(),
            'order_id' => $order->getOrderId(),
        ]);
    }

    // Xóa đơn hàng theo ID
    public function deleteOrder(int $orderId)
    {
        $query = "UPDATE Orders SET IsDeleted = 1 WHERE order_id = :order_id";
        return DB::update($query, ['order_id' => $orderId]);
    }

    // Thêm sản phẩm vào đơn hàng
    public function addProductToOrder(int $orderID, int $productId, int $quantity)
    {
        $query = "INSERT INTO Order_Details (order_id, product_id, quantity) VALUES (:order_id, :product_id, :quantity);";
        return DB::insert($query, ['order_id' => $orderID, 'product_id' => $productId, 'quantity' => $quantity]);
    }

    // Tính tổng tiền của hóa đơn dựa vào sản phẩm trong chi tiết đơn hàng và số lượng
    public function calculateTotalAmount(int $orderId): float
    {
        $query = "SELECT SUM(P.price * OD.quantity) as total_amount "
            . " FROM Order_Details OD "
            . " JOIN Products P ON OD.product_id = P.product_id "
            . " WHERE OD.order_id = :order_id";

        $result = DB::selectOne($query, ['order_id' => $orderId]);

        if ($result) {
            return (float) $result->total_amount;
        }

        return 0.0;
    }

    // Lấy phần trăm giảm giá dựa vào mã giảm giá
    public function getDiscountPercentageByCode(string $discountCode): ?float
    {
        $query = "SELECT discount_percentage "
            . " FROM Promotions "
            . " WHERE name = :discount_code";

        $result = DB::selectOne($query, ['discount_code' => $discountCode]);

        if ($result) {
            return (float) $result->discount_percentage;
        }

        return null;
    }
}
