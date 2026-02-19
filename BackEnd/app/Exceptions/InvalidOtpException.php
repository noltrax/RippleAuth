<?php

namespace App\Exceptions;
use Exception;

class InvalidOtpException Extends Exception
{
    protected $message = 'The provided Otp is not valid.';
    protected $code = 401;// Unauthorized

}
