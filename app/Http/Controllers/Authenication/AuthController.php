<?php

namespace App\Http\Controllers\Authenication;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Business\CustomerBiz\CustomerBusiness;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessTokenResult;
use Illuminate\Support\Facades\DB;

use App\Business\AuthBiz\AuthBusiness;

class AuthController extends Controller
{
    protected CustomerBusiness $customerBusiness;

    public function __construct()
    {
        $this->customerBusiness = new CustomerBusiness();
    }

    // Đăng ký là một khách hàng mới
    public function register(Request $request)
    {
        try {
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
            $detailUser = $this->customerBusiness->createCustomer([
                'user_id' => $user->id, // Lấy ID tự động từ $user
                'name' => $request->name,
                'gender' => $request->gender,
                'birthday' => $request->birthday,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            // Tạo token khi đăng ký thành công
            $token = $user->createToken('YourAppName')->plainTextToken;

            return response()->json([
                'message' => 'Đăng ký thành công',
                'token' => $token,
                'detail_user' => $detailUser,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    // Đăng nhập
    public function login(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Kiểm tra thông tin đăng nhập
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $role = DB::table('UserRoles')
            ->join('Roles', 'UserRoles.role_id', '=', 'Roles.role_id')
            ->where('UserRoles.user_id', $user->id)
            ->where('UserRoles.IsDeleted', 0)
            ->value('Roles.role_name');

        if (!$role) {
            $role = 'Unknown'; // Nếu không tìm thấy role, đặt giá trị mặc định
        }

        // Tạo token khi đăng nhập thành công
        $token = $user->createToken('YourAppName')->plainTextToken;

        

        return response()->json([
            'token' => $token, 
            'role' => $role,
            'user_id' => $user->id,
        ], 200);
    }

    // Lấy thông tin người dùng đã đăng nhập
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
