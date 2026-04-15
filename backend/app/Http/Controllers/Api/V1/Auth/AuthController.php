<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function __construct(private readonly NotificationService $notificationService) {}

    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone'    => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
        ]);

        $user->assignRole('patient');

        Patient::create([
            'user_id' => $user->id,
            'gender'  => $request->gender ?? null,
        ]);

        $token = JWTAuth::fromUser($user);

        $this->notificationService->sendWelcome($user, '');

        return response()->json([
            'user'         => $this->userResource($user),
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['message' => 'Invalid credentials.'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['message' => 'Could not create token.'], 500);
        }

        $user = auth()->user();

        if (! $user->is_active) {
            return response()->json(['message' => 'Your account has been suspended.'], 403);
        }

        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
            'fcm_token'     => $request->fcm_token ?? $user->fcm_token,
        ]);

        return $this->respondWithToken($token, $user);
    }

    public function me(Request $request): JsonResponse
    {
        $user = auth()->user()->load(['roles', 'permissions']);
        return response()->json(['user' => $this->userResource($user)]);
    }

    public function refresh(): JsonResponse
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());
            return $this->respondWithToken($token, auth()->user());
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token cannot be refreshed.'], 401);
        }
    }

    public function logout(): JsonResponse
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Successfully logged out.']);
    }

    public function updateFcmToken(Request $request): JsonResponse
    {
        $request->validate(['fcm_token' => 'required|string']);
        auth()->user()->update(['fcm_token' => $request->fcm_token]);
        return response()->json(['message' => 'FCM token updated.']);
    }

    private function respondWithToken(string $token, User $user): JsonResponse
    {
        return response()->json([
            'user'         => $this->userResource($user),
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
        ]);
    }

    private function userResource(User $user): array
    {
        return [
            'id'       => $user->id,
            'name'     => $user->name,
            'email'    => $user->email,
            'phone'    => $user->phone,
            'avatar'   => $user->avatar,
            'role'     => $user->getRoleNames()->first(),
            'roles'    => $user->getRoleNames(),
            'is_active'=> $user->is_active,
            'language' => $user->preferred_language ?? 'en',
        ];
    }
}
