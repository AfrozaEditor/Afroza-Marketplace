<?php

namespace App\Providers;

use App\Listeners\SendWelcomeOnRegistered;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;

use App\Models\Category;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(Registered::class, SendWelcomeOnRegistered::class);

        Inertia::share('categories', function () {
            return Category::all(['id', 'name']);
        });
    }
}
