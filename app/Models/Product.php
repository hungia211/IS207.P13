<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product
{

    // Các thuộc tính công khai (public)
    protected $product_id;        // Mã sản phẩm
    protected $product_name;      // Tên sản phẩm
    protected $price;             // Giá sản phẩm
    protected $stock_quantity;    // Số lượng tồn kho
    protected $description;       // Mô tả sản phẩm
    protected $image;             // Link ảnh sản phẩm
    protected $category_name;     // Tên loại sản phẩm

    // Constructor
    public function __construct($product_id = null, $product_name = null, $price = null, $stock_quantity = null, $description = null, $image = null, $category_name = null)
    {
        $this->product_id = $product_id;
        $this->product_name = $product_name;
        $this->price = $price;
        $this->stock_quantity = $stock_quantity;
        $this->description = $description;
        $this->image = $image;
        $this->category_name = $category_name;
    }

    // Các phương thức truy xuất (Getters)
    public function getProductId() {
        return $this->product_id;
    }

    public function getProductName() {
        return $this->product_name;
    }

    public function getPrice() {
        return $this->price;
    }

    public function getStockQuantity() {
        return $this->stock_quantity;
    }

    public function getDescription() {
        return $this->description;
    }

    public function getImage() {
        return $this->image;
    }
    
    public function getCategoryName() {
        return $this->category_name;
    }

    // Các phương thức gán giá trị (Setters)
    public function setProductId($product_id) {
        $this->product_id = $product_id;
    }

    public function setProductName($product_name) {
        $this->product_name = $product_name;
    }

    public function setPrice($price) {
        $this->price = $price;
    }

    public function setStockQuantity($stock_quantity) {
        $this->stock_quantity = $stock_quantity;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function setImage($image) {
        $this->image = $image;
    }

    public function setCategoryName($category_name) {
        $this->category_name = $category_name;
    }

    // Phương thức chuyển đổi sang mảng (chứa các thuộc tính của sản phẩm)
    public function toArray() {
        return [
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'description' => $this->description,
            'image' => $this->image,
            'category_name' => $this->category_name,
        ];
    }
    
}
