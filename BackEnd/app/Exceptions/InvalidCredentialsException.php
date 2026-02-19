<?php

namespace App\Exceptions;

use Exception;

class InvalidCredentialsException extends Exception
{
    protected $message = 'The provided credentials are invalid.';
    protected $code = 401; // HTTP Unauthorized
}
