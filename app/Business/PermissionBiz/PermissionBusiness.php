<?php

namespace App\Business\PermissionBiz;

use App\Business\PermissionBiz\PermissionDAO;
use Exception;

/**
 * Persmission Business
 * 
 */
class PermissionBusiness
{
    protected PermissionDAO $permissionDAO;

    /**
     * Contructor
     * 
     */
    public function __construct()
    {
        $this->permissionDAO = new PermissionDAO();
    }

    
    public function getPermission(string $permissionName, int $userId): array
    {
        try {
            $result = $this->permissionDAO->getPermission($permissionName, $userId);
        } catch (Exception $e) {
        }

        return $result;
    }

    // Kiểm tra quyên xem
    public function checkViewPermission(string $pageName, int $userId): bool
    {
        $permission = $this->permissionDAO->checkPermission($pageName, $userId);

        if (is_object($permission) && $permission->can_view == 1) {
            return true;
        } else {
            return false;
        }
    }

    // Kiểm tra quyên thêm 
    public function checkAddPermission(string $pageName, int $userId): bool
    {
        $permission = $this->permissionDAO->checkPermission($pageName, $userId);

        if (is_object($permission) && $permission->can_add == 1) {
            return true;
        } else {
            return false;
        }
    }
    
    // Kiểm tra quyên cập nhật
    public function checkEditPermission(string $pageName, int $userId): bool
    {
        // Lấy thông tin quyền từ database
        $permission = $this->permissionDAO->checkPermission($pageName, $userId);

        // Kiểm tra quyền `can_edit`
        if (is_object($permission) && $permission->can_edit == 1) {
            return true; // Có quyền sửa
        } else {
            return false; // Không có quyền sửa
        }
    }

    // Kiểm tra quyên xóa
    public function checkDeletePermission(string $pageName, int $userId): bool
    {
        $permission = $this->permissionDAO->checkPermission($pageName, $userId);

        if (is_object($permission) && $permission->can_delete == 1) {
            return true;
        } else {
            return false;
        }
    }
}
