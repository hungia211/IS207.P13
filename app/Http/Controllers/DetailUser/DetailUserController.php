<?php

namespace App\Http\Controllers\DetailUser;

use App\Models\DetailUser;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Business\DetailUserBiz\DetailUserBusiness;
use App\Business\PermissionBiz\PermissionBusiness;
use Illuminate\Support\Facades\Hash;

class DetailUserController extends Controller
{
    protected DetailUserBusiness $detailUserBusiness;
    protected PermissionBusiness $permissionBiz;

    public function __construct()
    {
        $this->detailUserBusiness = new DetailUserBusiness();
        $this->permissionBiz = new PermissionBusiness();
    }

    // Thêm mới 1 người dùng
    public function createUser(Request $request)
    {
        try {
            // Lấy thông tin người dùng hiện tại từ token
            $user = Auth::user();

            // Kiểm tra nếu người dùng không tồn tại (token không hợp lệ hoặc đã hết hạn)
            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.', 'debug' => Auth::user()], 401);
            }

            $userId = $user->id;                // Lấy ID từ token
            $pageName = "User Management";      // Tên trang quản lý

            // Lấy thông tin quyền từ PermissionBiz
            $canAdd = $this->permissionBiz->checkAddPermission($pageName, $userId);

            // Kiểm tra quyền can_add
            if (!$canAdd) {
                return response()->json(['message' => 'Bạn không có quyền thêm người dùng.'], 403);
            }
            // Bước 1: Lấy thông tin được gửi về
            // Validate request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
                'gender' => 'required|in:Nam,Nữ',
                'birthday' => 'required|date',
                'phone' => 'required|string|max:15',
                'address' => 'nullable|string',
                'role_name' => 'required|string',
            ]);

            // Bước 2: Nếu thông tin không hợp lệ thì trả về lỗi
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            // Bước 3: Tạo người dùng mới trong bảng Users
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Bước 4: Lấy user_id từ người dùng vừa tạo và truyền vào business logic
            // Lấy thông tin chi tiết người dùng và tạo mới trong bảng Detail_Users
            $detailUser = $this->detailUserBusiness->createUser([
                'user_id' => $user->id, // Lấy ID tự động từ $user
                'name' => $request->name,
                'gender' => $request->gender,
                'birthday' => $request->birthday,
                'phone' => $request->phone,
                'address' => $request->address,
                'role_name' => $request->role_name,
            ]);

            return response()->json([
                'message' => 'Thêm thành công một người dùng',
                'detail_user' => $detailUser,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Xem thông tin khách hàng
    public function viewAllDetailUser()
    {
        try {
            // Lấy thông tin người dùng hiện tại từ token
            $user = Auth::user();

            // Kiểm tra nếu người dùng không tồn tại (token không hợp lệ hoặc đã hết hạn)
            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.', 'debug' => Auth::user()], 401);
            }

            $userId = $user->id;                // Lấy ID từ token
            $pageName = "User Management";      // Tên trang quản lý

            // Lấy thông tin quyền từ PermissionBiz
            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            // Kiểm tra quyền can_view
            if ($canView) {
                // Có quyền xem, thực hiện lấy thông tin khách hàng
                $detail_user = $this->detailUserBusiness->viewAllDetailUser();
                return response()->json($detail_user);
            } else {
                // Không có quyền xem
                return response()->json(['message' => 'Bạn không có quyền xem thông tin khách hàng.'], 403);
            }
        } catch (\Exception $e) {
            // Trả về lỗi hệ thống
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    // Xem thông tin khách hàng
    public function viewUserByName(string $name)
    {
        try {
            // Lấy thông tin người dùng hiện tại từ token
            $user = Auth::user();

            // Kiểm tra nếu người dùng không tồn tại (token không hợp lệ hoặc đã hết hạn)
            if (!$user) {
                return response()->json([
                    'message' => 'Token không hợp lệ hoặc đã hết hạn.',
                ], 401);
            }

            $userId = $user->id; // Lấy ID từ token
            $pageName = "User Management"; // Tên trang quản lý

            // Kiểm tra quyền xem (can_view)
            $canView = $this->permissionBiz->checkViewPermission($pageName, $userId);

            if (!$canView) {
                return response()->json([
                    'message' => 'Bạn không có quyền xem thông tin khách hàng.',
                ], 403);
            }

            // Lấy thông tin chi tiết khách hàng bằng tên
            $detail_user = $this->detailUserBusiness->viewUserByName($name);

            if (!$detail_user) {
                return response()->json([
                    'message' => 'Không tìm thấy thông tin khách hàng.',
                ], 404);
            }

            return response()->json($detail_user, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Xem thông tin khách hàng theo user_id
    public function viewUserById(int $userId)
    {
        try {
            // Lấy thông tin người dùng hiện tại từ token
            $user = Auth::user();

            // Kiểm tra nếu người dùng không tồn tại (token không hợp lệ hoặc đã hết hạn)
            if (!$user) {
                return response()->json([
                    'message' => 'Token không hợp lệ hoặc đã hết hạn.',
                ], 401);
            }

            $currentUserId = $user->id; // Lấy ID từ token
            $pageName = "User Management"; // Tên trang quản lý

            // Kiểm tra quyền xem (can_view)
            $canView = $this->permissionBiz->checkViewPermission($pageName, $currentUserId);

            if (!$canView) {
                return response()->json([
                    'message' => 'Bạn không có quyền xem thông tin khách hàng.',
                ], 403);
            }

            // Lấy thông tin chi tiết khách hàng bằng user_id
            $detail_user = $this->detailUserBusiness->viewUserById($userId);

            if (!$detail_user) {
                return response()->json([
                    'message' => 'Không tìm thấy thông tin khách hàng.',
                ], 404);
            }

            return response()->json($detail_user, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateUser(Request $request, int $userId)
    {
        try {
            // Lấy thông tin người dùng hiện tại từ token
            $user = Auth::user();

            // Kiểm tra nếu người dùng không tồn tại (token không hợp lệ hoặc đã hết hạn)
            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $crrentUserId = $user->id;                // Lấy ID từ token
            $pageName = "User Management";  // Tên trang quản lý

            // Lấy thông tin quyền từ PermissionBiz
            $canEdit = $this->permissionBiz->checkEditPermission($pageName, $crrentUserId);

            // Kiểm tra quyền can_edit
            if ($canEdit) {
                // Có quyền sửa, thực hiện cập nhật
                $this->detailUserBusiness->updateUser($request->all(), $userId);
                return response()->json(['message' => 'Cập nhật khách hàng thành công'], 200);
            } else {
                // Không có quyền sửa
                return response()->json(['message' => 'Bạn không có quyền cập nhật khách hàng.'], 403);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi', 'error' => $e->getMessage()], 500);
        }
    }

    public function deleteUser(int $userId)
    {
        try {
            // Lấy thông tin người dùng hiện tại từ token
            $user = Auth::user();

            // Kiểm tra nếu người dùng không tồn tại (token không hợp lệ hoặc đã hết hạn)
            if (!$user) {
                return response()->json(['message' => 'Token không hợp lệ hoặc đã hết hạn.'], 401);
            }

            $currentUserId = $user->id; // Lấy ID từ token
            $pageName = "User Management"; // Tên trang quản lý

            // Kiểm tra quyền xóa (can_delete)
            $canDelete = $this->permissionBiz->checkDeletePermission($pageName, $currentUserId);

            if (!$canDelete) {
                return response()->json([
                    'message' => 'Bạn không có quyền xóa thông tin khách hàng.',
                ], 403);
            }

            // Xóa thông tin khách hàng
            $this->detailUserBusiness->deleteUser($userId);

            return response()->json([
                'message' => 'Xóa thông tin khách hàng thành công.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
