<?php

namespace App\Business\CartBiz;

use Illuminate\Support\Facades\DB;
use App\Models\Cart;

class CartDAO
{
    // Tạo giỏ hàng cho khách hàng
    public function createCart(int $detailUserId)
    {
        $query = "INSERT INTO Carts (detail_user_id, IsDeleted) VALUES (:detail_user_id, 0);";
        return DB::insert($query, ['detail_user_id' => $detailUserId]);
    }

    // Lấy tất cả sản phẩm trong giỏ hàng
    public function getAllCartProduct(int $userId)
    {
        $query = "SELECT P.product_id, product_name, price, image, quantity "
            . " FROM Carts C "
            . "     JOIN Cart_Products CP on C.cart_id = CP.cart_id "
            . "     JOIN Products P on P.product_id = CP.product_id "
            . "     JOIN Detail_Users DU on C.detail_user_id = DU.detail_user_id "
            . " WHERE DU.IsDeleted = 0 AND user_id = :user_id";

        return DB::select($query, ['user_id' => $userId]); // Trả về danh sách giỏ hàng
    }

    // Lấy id giỏ hàng theo id người dùng
    public function getCartIdByUserId(int $userId)
    {
        $query = "SELECT cart_id "
            . " FROM Carts C "
            . "     JOIN Detail_Users DU on C.detail_user_id = DU.detail_user_id "
            . " WHERE DU.IsDeleted = 0 AND user_id = :user_id";

        $result = DB::selectOne($query, ['user_id' => $userId]);

        if (!$result) {
            return null;
        }

        return $result->cart_id;
    }

    // Thêm sản phẩm vào giỏ hàng
    public function addProductToCart(int $cartId, int $productId, int $quantity)
    {
        $query = "INSERT INTO Cart_Products (cart_id, product_id, quantity) VALUES (:cart_id, :product_id, :quantity);";
        return DB::insert($query, ['cart_id' => $cartId, 'product_id' => $productId, 'quantity' => $quantity]);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function deleteProductFromCart(int $cartId, int $productId)
    {
        $query = "DELETE FROM Cart_Products WHERE cart_id = :cart_id AND product_id = :product_id";
        return DB::delete($query, ['cart_id' => $cartId, 'product_id' => $productId]);
    }

    // Xóa tất cả sản phẩm trong giỏ hàng khi đặt hàng
    public function deleteAllProductFromCart(int $cartId)
    {
        $query = "DELETE FROM Cart_Products WHERE cart_id = :cart_id";
        return DB::delete($query, ['cart_id' => $cartId]);
    }

    // Lấy thông tin product_id và quantity theo cart_id
    public function getProductDetailsByCartId(int $cartId)
    {
        $query = "SELECT product_id, quantity "
            . " FROM Cart_Products "
            . " WHERE cart_id = :cart_id";

        return DB::select($query, ['cart_id' => $cartId]);
    }

    // Tính tổng tiền của giỏ hàng dựa vào sản phẩm trong giỏ hàng và số lượng
    public function calculateCartTotalAmount(int $userId): float
    {
        $query = "SELECT SUM(P.price * CP.quantity) as total_amount "
            . " FROM Cart_Products CP "
            . " JOIN Products P ON CP.product_id = P.product_id "
            . " JOIN Carts C ON CP.cart_id = C.cart_id "
            . " JOIN Detail_Users DU ON C.detail_user_id = DU.detail_user_id "
            . " WHERE DU.user_id = :user_id";

        $result = DB::selectOne($query, ['user_id' => $userId]);

        if ($result) {
            return (float) $result->total_amount;
        }

        return 0.0;
    }
}
