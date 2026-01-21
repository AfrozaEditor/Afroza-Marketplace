<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\NewsletterSubscriber;

class SubscribeAllUsersToNewsletter extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:subscribe-all-users-to-newsletter';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::all();
        $count = 0;

        foreach ($users as $user) {
            // Vérifie si l'email est déjà abonné
            $alreadySubscribed = NewsletterSubscriber::where('email', $user->email)->exists();
            if (!$alreadySubscribed) {
                NewsletterSubscriber::create([
                    'email' => $user->email,
                    // Ajoutez d'autres champs si nécessaire
                ]);
                $count++;
            }
        }

        $this->info("{$count} utilisateurs ajoutés à la newsletter.");
    }
}
