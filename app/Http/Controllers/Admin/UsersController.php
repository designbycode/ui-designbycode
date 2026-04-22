<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('admin/users/index', [
            'page' => 'index',
            'users' => $users,
        ]);
    }

    public function show(string $id): Response
    {
        $user = User::with(['roles', 'permissions'])->findOrFail($id);

        return Inertia::render('admin/users/show', [
            'page' => 'show',
            'user' => $user,
        ]);
    }

    public function edit(string $id): Response
    {
        $user = User::with(['roles', 'permissions'])->findOrFail($id);

        return Inertia::render('admin/users/edit', [
            'page' => 'edit',
            'user' => $user,
        ]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => $request->input('password')]);
        }

        if ($request->has('roles')) {
            $user->syncRoles($request->input('roles'));
        }

        return to_route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        if ($user->trashed()) {
            $user->forceDelete();
        } else {
            $user->delete();
        }

        return to_route('admin.users.index')->with('success', 'User deleted successfully.');
    }

    public function restore(string $id): RedirectResponse
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return to_route('admin.users.index')->with('success', 'User restored successfully.');
    }
}
