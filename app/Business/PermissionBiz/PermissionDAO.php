<?php
namespace App\Business\PermissionBiz;

use Illuminate\Support\Facades\DB;

/**
 * Sql Permission
 * 
 * @auth: Nguyen Minh Nhut
 */
class PermissionDAO
{
    // Get All Students
    public function getPermission(string $permissionName, int $userId)
    {
        // Query
        $query = 
            " SELECT PermissionName".
            " FROM".
                " users".
            " INNER JOIN UserRoles".
                " ON UserRoles.UserID = users.id".
            " INNER JOIN Roles".
                " ON UserRoles.RoleID = Roles.RoleID".
            " INNER JOIN RolePermissions".
                " ON RolePermissions.RoleID = Roles.RoleID".
            " INNER JOIN Permissions".
                " ON Permissions.PermissionID = RolePermissions.PermissionID".
            " WHERE users.id = :userId".
                " AND Permissions.PermissionName = :permissionName";

        // Bindings cho các tham số
        $bindings = [
            'userId' => $userId,
            'permissionName' => $permissionName,
        ];

        // Thực thi câu lệnh SQL và trả về kết quả
        $result = DB::select($query, $bindings);
        
        return $result;  
    }

    // Check Profile Permission (Kiểm tra quyền khách hàng của khách hàng)
    public function checkPermission(string $pageName, int $userId)
    {
        $query = " SELECT p.can_view, p.can_add, p.can_edit, p.can_delete, p.can_import, p.can_export "
                ." FROM Permissions p "
                    ." JOIN Functions f ON p.function_id = f.function_id "
                    ." JOIN RolePermissions rp ON p.permission_id = rp.permission_id "
                    ." JOIN Roles r ON rp.role_id = r.role_id "
                    ." JOIN UserRoles ur on r.role_id = ur.role_id "
                ." WHERE f.function_name = :pageName AND ur.user_id = :userId AND p.is_active = 1;";

        // Thực hiện truy vấn
        $result = DB::selectOne($query, ['pageName' => $pageName, 'userId' => $userId]);

        // Trả về kết quả (đảm bảo là object hoặc null)
        return $result;
    }  

}