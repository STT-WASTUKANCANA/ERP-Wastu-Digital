<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function index(Request $request)
    {
        try {
            // Placeholder for data
            $data = [
                'mail_trend' => [],
                'mail_status' => [],
                'mail_category' => [],
                'entity_counts' => [
                    'users' => 0,
                    'divisions' => 0
                ]
            ];

            return response()->json([
                'status' => true,
                'data' => $data
            ]);
        } catch (Throwable $e) {
            Log::error('[DASHBOARD] Failed to fetch stats: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch dashboard statistics'
            ], 500);
        }
    }
}
