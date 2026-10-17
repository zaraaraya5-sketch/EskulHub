<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserPrivilegeEscalationSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function getOrCreateUser(string $id, string $role): User
    {
        return User::firstOrCreate(
            ['id' => $id],
            [
                'name' => "Test User {$role}",
                'email' => "test_{$id}@smkn1ciomas.sch.id",
                'role' => $role,
                'password' => Hash::make('password123'),
                'is_active' => true,
            ]
        );
    }

    public function test_student_cannot_manage_users(): void
    {
        $student = $this->getOrCreateUser('test-student-1', 'student');
        $token = $student->createToken('test-token')->plainTextToken;

        // Attempt to create a user
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/users', [
                'name' => 'Fake User',
                'email' => 'fake@test.com',
                'role' => 'pengurus',
                'password' => 'secret123',
            ]);

        $response->assertStatus(403);

        // Attempt to modify a pengurus
        $pengurus = $this->getOrCreateUser('usr-pengurus-1', 'pengurus');
        $responseUpdate = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/users/{$pengurus->id}", [
                'role' => 'student',
            ]);

        $responseUpdate->assertStatus(403);

        // Attempt to delete a pengurus
        $responseDelete = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/users/{$pengurus->id}");

        $responseDelete->assertStatus(403);
    }

    public function test_student_cannot_edit_other_user_profile(): void
    {
        $student = $this->getOrCreateUser('test-student-2', 'student');
        $pengurus = $this->getOrCreateUser('usr-pengurus-1', 'pengurus');
        $token = $student->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/auth/profile/{$pengurus->id}", [
                'name' => 'Tampered Pengurus Name',
            ]);

        $response->assertStatus(403);
    }

    public function test_pengurus_can_manage_users(): void
    {
        $pengurus = $this->getOrCreateUser('usr-pengurus-1', 'pengurus');
        $token = $pengurus->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/users', [
                'name' => 'Siswa Baru',
                'email' => 'siswa.baru@smkn1ciomas.sch.id',
                'role' => 'student',
                'password' => 'password123',
            ]);

        $response->assertStatus(201);
    }

    public function test_pengurus_cannot_delete_themselves(): void
    {
        $pengurus = $this->getOrCreateUser('usr-pengurus-1', 'pengurus');
        $token = $pengurus->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/users/{$pengurus->id}");

        $response->assertStatus(400);
    }
}
