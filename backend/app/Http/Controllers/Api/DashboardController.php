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
            $year = $request->input('year', date('Y'));

            // 1. Mail Trend (Monthly)
            // Initialize months array with 0
            $months = collect(range(1, 12))->mapWithKeys(fn($m) => [$m => 0]);

            $incomingTrend = \App\Models\Workspace\Mails\IncomingMail::selectRaw('MONTH(date) as month, COUNT(*) as count')
                ->whereYear('date', $year)
                ->groupBy('month')
                ->pluck('count', 'month');

            $outgoingTrend = \App\Models\Workspace\Mails\OutgoingMail::selectRaw('MONTH(date) as month, COUNT(*) as count')
                ->whereYear('date', $year)
                ->groupBy('month')
                ->pluck('count', 'month');

            $decisionTrend = \App\Models\Workspace\Mails\DecisionLetter::selectRaw('MONTH(date) as month, COUNT(*) as count')
                ->whereYear('date', $year)
                ->groupBy('month')
                ->pluck('count', 'month');

            // Merge with defaults to ensure all months exist
            $formatTrend = function ($trend) use ($months) {
                return $months->replace($trend)->values()->toArray();
            };

            $data = [
                'mail_trend' => [
                    'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                    'incoming' => $formatTrend($incomingTrend),
                    'outgoing' => $formatTrend($outgoingTrend),
                    'decision' => $formatTrend($decisionTrend),
                ],
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
