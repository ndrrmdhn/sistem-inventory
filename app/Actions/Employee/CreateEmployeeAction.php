<?php

namespace App\Actions\Employee;

use App\Mail\VerifyEmailMail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class CreateEmployeeAction
{
    /**
     * Create a new employee.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): User
    {
        return DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'phone_number' => $input['phone_number'],
                'password' => Hash::make($input['password']),
            ]);

            if (isset($input['role']) && in_array($input['role'], ['admin', 'viewer'])) {
                $user->assignRole($input['role']);
            }

            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                ['id' => $user->getKey(), 'hash' => sha1($user->getEmailForVerification())]
            );

            Mail::to($user->email)->queue(new VerifyEmailMail($user->name, $verificationUrl));

            return $user;
        });
    }
}
