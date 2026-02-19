<?php
namespace App\Exceptions;

use Exception;
class OtpRateLimitException extends Exception{
    protected $message = 'Too many requests from this IP/Phone. Try later.';
    protected $code = 500;
}
