<?php

namespace App\Business\ProductBiz;

use Illuminate\Support\Facades\DB;
use App\Models\Product;

class ProductDAO
{
    // Lấy tất cả sản phẩm
    public function getAllProducts()
    {
        $query = "SELECT "
            . "    product_id, "
            . "    product_name, "
            . "    price, "
            . "    stock_quantity, "
            . "    description, "
            . "    image, "
            . "    category_name "
            . " FROM Products "
            . "     JOIN Categories ON Products.category_id = Categories.category_id "
            . " WHERE Products.IsDeleted = 0";

        return DB::select($query); // Trả về danh sách sản phẩm
    }

    // Lấy thông tin sản phẩm theo ID
    public function getProductById(int $productId): ?Product
    {
        $query = "SELECT "
            . "    product_id, "
            . "    product_name, "
            . "    price, "
            . "    stock_quantity, "
            . "    description, "
            . "    image, "
            . "    category_name "
            . " FROM Products "
            . "     JOIN Categories ON Products.category_id = Categories.category_id "
            . " WHERE Products.IsDeleted = 0 AND product_id = :product_id";

        $result = DB::selectOne($query, ['product_id' => $productId]);

        if (!$result) {
            return null;
        }

        return new Product(
            $result->product_id,
            $result->product_name,
            $result->price,
            $result->stock_quantity,
            $result->description,
            $result->image,
            $result->category_name
        );
    }

    // Lấy danh sách sản phẩm trong đơn hàng theo ID
    public function getOrderDetailById(int $orderId)
    {
        $query = "SELECT "
            . "    P.product_name, "
            . "    P.price, "
            . "    P.image "
            . " FROM Order_Details OD "
            . "     JOIN Products P ON OD.product_id = P.product_id "
            . " WHERE P.IsDeleted = 0 AND OD.order_id = :order_id";

        return DB::select($query, ['order_id' => $orderId]); // Trả về danh sách sản phẩm trong đơn hàng
    }

    public function getProductsByCategoryName(string $categoryName)
    {
        $query = "SELECT "
            . "    product_id, "
            . "    product_name, "
            . "    price, "
            . "    stock_quantity, "
            . "    description, "
            . "    image, "
            . "    category_name "
            . " FROM Products "
            . "     JOIN Categories ON Products.category_id = Categories.category_id "
            . " WHERE Products.IsDeleted = 0 AND category_name = :category_name";

        return DB::select($query, ['category_name' => $categoryName]);
    }

    // Thêm mới sản phẩm
    public function createProduct(Product $product)
    {
        try {
            DB::beginTransaction();

            $categoryName = $product->getCategoryName();
            $category_id = 0;

            switch ($categoryName) {
                case 'Hoa tươi':
                    $category_id = 1;
                    break;
                case 'Hoa khô':
                    $category_id = 2;
                    break;
                case 'Cây xanh':
                    $category_id = 3;
                    break;
                case 'Nến thơm':
                    $category_id = 4;
                    break;
                case 'Phụ kiện':
                    $category_id = 5;
                    break;
            }

            $query = "INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) "
                . " VALUES (:category_id, :product_name, :price, :stock_quantity, :description, :image, 0)";

            DB::insert($query, [
                'category_id' => $category_id,
                'product_name' => $product->getProductName(),
                'price' => $product->getPrice(),
                'stock_quantity' => $product->getStockQuantity(),
                'description' => $product->getDescription(),
                'image' => $product->getImage(),
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Không thể thêm sản phẩm: ' . $e->getMessage());
        }
    }

    // Cập nhật thông tin sản phẩm
    public function updateProduct(Product $product)
    {
        switch ($product->getCategoryName()) {
            case 'Hoa tươi':
                $category_id = 1;
                break;
            case 'Hoa khô':
                $category_id = 2;
                break;
            case 'Cây xanh':
                $category_id = 3;
                break;
            case 'Nến thơm':
                $category_id = 4;
                break;
            case 'Phụ kiện':
                $category_id = 5;
                break;
            default:
                throw new \Exception('Danh mục sản phẩm không hợp lệ');
        }


        $query = "UPDATE Products "
            . " SET "
            . " category_id = :category_id, "
            . " product_name = :product_name, "
            . " price = :price, "
            . " stock_quantity = :stock_quantity, "
            . " description = :description, "
            . " image = :image "
            . " WHERE product_id = :product_id AND IsDeleted = 0";

        return DB::update($query, [
            'category_id'    => $category_id,
            'product_name'   => $product->getProductName(),
            'price'          => $product->getPrice(),
            'stock_quantity' => $product->getStockQuantity(),
            'description'    => $product->getDescription(),
            'image'          => $product->getImage(),
            'product_id'     => $product->getProductId(),
        ]);
    }

    // Xóa sản phẩm theo ID
    public function deleteProduct(int $productId)
    {
        $query = "UPDATE Products SET IsDeleted = 1 WHERE product_id = :product_id";
        return DB::update($query, ['product_id' => $productId]);
    }
}
