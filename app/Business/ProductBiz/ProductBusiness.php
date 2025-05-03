<?php

namespace App\Business\ProductBiz;

use App\Business\ProductBiz\ProductDAO;
use Exception;
use App\Models\Product;

class ProductBusiness
{
    protected ProductDAO $productDAO;

    public function __construct()
    {
        $this->productDAO = new ProductDAO();
    }

    // Thêm mới sản phẩm
    public function createProduct(array $data)
    {
        try {
            $product = new Product(
                null,                     // ID sản phẩm sẽ được tự động sinh bởi database
                $data['product_name'],
                $data['price'],
                $data['stock_quantity'],
                $data['description'],
                $data['image'],
                $data['category_name']
            );

            return $this->productDAO->createProduct($product);
        } catch (Exception $e) {
            throw new Exception("Không thể thêm sản phẩm: " . $e->getMessage());
        }
    }

    // Xem tất cả sản phẩm
    public function viewAllProducts()
    {
        try {
            return $this->productDAO->getAllProducts();
        } catch (Exception $e) {
            return response()->json(['message' => 'Không tìm thấy sản phẩm', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin sản phẩm theo ID
    public function viewProductById(int $productId)
    {
        try {
            $product = $this->productDAO->getProductById($productId);

            if ($product) {
                return $product->toArray();
            }
        } catch (Exception $e) {
            throw new Exception("Không tìm thấy sản phẩm: " . $e->getMessage());
        }
    }

    // Xem chi tiết đơn hàng theo ID
    public function viewOrderDetailById(int $orderId)
    {
        try {
            return $this->productDAO->getOrderDetailById($orderId);
        } catch (Exception $e) {
            throw new Exception("Không tìm thấy chi tiết đơn hàng: " . $e->getMessage());
        }
    }

    // Xem sản phẩm theo tên danh mục
    public function viewProductsByCategoryName(string $categoryName)
    {
        try {
            return $this->productDAO->getProductsByCategoryName($categoryName);
        } catch (Exception $e) {
            throw new Exception("Không tìm thấy sản phẩm: " . $e->getMessage());
        }
    }

    // Cập nhật thông tin sản phẩm
    public function updateProduct(array $data, int $productId)
    {
        try {
            $product = new Product(
                $productId,               // ID sản phẩm cần cập nhật
                $data['product_name'],
                $data['price'],
                $data['stock_quantity'],
                $data['description'],
                $data['image'],
                $data['category_name']
            );

            $updatedRows = $this->productDAO->updateProduct($product);
            if ($updatedRows === 0) {
                throw new Exception("Cập nhật thất bại hoặc không tìm thấy sản phẩm");
            }
        } catch (Exception $e) {
            throw new Exception("Lỗi khi cập nhật sản phẩm: " . $e->getMessage());
        }
    }

    // Xóa sản phẩm
    public function deleteProduct(int $productId)
    {
        try {
            return $this->productDAO->deleteProduct($productId);
        } catch (Exception $e) {
            throw new Exception("Không thể xóa sản phẩm: " . $e->getMessage());
        }
    }
}
