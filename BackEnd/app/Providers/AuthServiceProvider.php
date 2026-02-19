<?php

namespace App\Providers;

use App\Contracts\AuthServiceContract;
use App\Services\EmailLoginServiceContract;
use App\Services\OtpLoginServiceContract;
use Illuminate\Http\Request; //
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(AuthServiceContract::class, function ($app) {
            /** @var Request $request */
            $request = $app->make(Request::class);
            $method = $request->input('method', 'otp'); // default to OTP

            return $method === 'email'
                ? new EmailLoginServiceContract()
                : new OtpLoginServiceContract();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
