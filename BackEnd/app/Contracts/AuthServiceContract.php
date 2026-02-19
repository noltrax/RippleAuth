<?php
namespace App\Contracts;
interface AuthServiceContract{
    public function identify(array $credentials): string;
    public function verify(array $data): string;
}
