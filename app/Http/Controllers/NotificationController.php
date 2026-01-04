<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display notifications page (Inertia)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $filter = $request->get('filter', 'all');
        
        $query = $user->notifications()->orderBy('created_at', 'desc');
        
        if ($filter === 'unread') {
            $query->whereNull('read_at');
        } elseif ($filter === 'read') {
            $query->whereNotNull('read_at');
        }
        
        $notifications = $query->paginate(20);

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
            'filter' => $filter,
        ]);
    }

    /**
     * Mark a notification as read (Inertia redirect)
     */
    public function markAsRead(Request $request, string $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return back();
    }

    /**
     * Mark all notifications as read (Inertia redirect)
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return back();
    }

    /**
     * Delete a notification (Inertia redirect)
     */
    public function destroy(Request $request, string $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if ($notification) {
            $notification->delete();
        }

        return back();
    }

    /**
     * Delete all notifications (Inertia redirect)
     */
    public function destroyAll(Request $request)
    {
        $request->user()->notifications()->delete();

        return back();
    }

    // ========================================
    // API Methods (for AJAX calls from dropdown)
    // ========================================

    /**
     * Get notifications via API (JSON response)
     */
    public function apiIndex(Request $request)
    {
        $user = $request->user();
        
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark a notification as read via API
     */
    public function apiMarkAsRead(Request $request, string $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json([
            'message' => 'Notification marquée comme lue.',
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark all notifications as read via API
     */
    public function apiMarkAllAsRead(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Non authentifié.',
                'unread_count' => 0,
            ], 401);
        }

        $unreadNotifications = $user->unreadNotifications;
        
        if ($unreadNotifications->isNotEmpty()) {
            $unreadNotifications->markAsRead();
        }

        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues.',
            'unread_count' => 0,
        ]);
    }

    /**
     * Delete a notification via API
     */
    public function apiDestroy(Request $request, string $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if ($notification) {
            $notification->delete();
        }

        return response()->json([
            'message' => 'Notification supprimée.',
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    /**
     * Get only the unread notifications count via API
     */
    public function apiUnreadCount(Request $request)
    {
        return response()->json([
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }
}
