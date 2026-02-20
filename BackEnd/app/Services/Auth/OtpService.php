<?php
namespace App\Services\Auth;
use App\Exceptions\InvalidCredentialsException;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class OtpService{
    public function generateOtp(User $user): string
    {
        $otp = rand(100000, 999999);

        Otp::create([
            'phone' => $user->phone,
            'otp_hash' => Hash::make($otp),
            'expires_at' => now()->addMinutes(5),
        ]);
        return $otp;

        // In real app, send SMS here
    }

    /**
     * @throws InvalidCredentialsException
     */
    public function validateOtp(User $user, ?string $otp):void
    {
        if (!$otp) {
            throw new InvalidCredentialsException('OTP required.');
        }

        $record = Otp::where('phone', $user->phone)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$record) {
            throw new InvalidCredentialsException('Invalid OTP.');
        }

        $isValid = Hash::check($otp, $record->otp_hash);

        if (!$isValid) {
            throw new InvalidCredentialsException('Invalid OTP.');
        }


        $record->delete();

    }

}

