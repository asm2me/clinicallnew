<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

class CleanupExpiredSlotLocks implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Redis TTL handles expiry automatically; this job logs orphaned keys
        $keys = Redis::keys('slot_lock:*');
        \Log::debug('Active slot locks', ['count' => count($keys)]);
    }
}
