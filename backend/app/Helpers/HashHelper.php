<?php

use Vinkla\Hashids\Facades\Hashids;

if (!function_exists('encodeId')) {
    function encodeId($id)
    {
        return Hashids::encode($id);
    }
}

if (!function_exists('decodeId')) {
    function decodeId($hash)
    {
        $decoded = Hashids::decode($hash);
        return !empty($decoded) ? $decoded[0] : null;
    }
}
