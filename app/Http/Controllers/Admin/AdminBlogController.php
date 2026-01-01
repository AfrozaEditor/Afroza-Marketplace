<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminBlogController extends Controller
{
    /**
     * Display a listing of all blogs
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');
        
        $query = Blog::with('author')
            ->orderBy('created_at', 'desc');
        
        if ($status !== 'all') {
            $query->where('status', $status);
        }
        
        $blogs = $query->paginate(10)->withQueryString();
        
        $statusCounts = [
            'all' => Blog::count(),
            'draft' => Blog::where('status', 'draft')->count(),
            'published' => Blog::where('status', 'published')->count(),
            'archived' => Blog::where('status', 'archived')->count(),
        ];
        
        return Inertia::render('admin/blogs/index', [
            'blogs' => $blogs,
            'statusCounts' => $statusCounts,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Show the form for creating a new blog
     */
    public function create()
    {
        return Inertia::render('admin/blogs/create');
    }

    /**
     * Store a newly created blog
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:5120', // 5MB max
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,published,archived',
            'featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Handle image upload
        if ($request->hasFile('featured_image')) {
            $imagePath = $request->file('featured_image')->storePublicly('blogs', 's3');
            $validated['featured_image'] = Storage::disk('s3')->url($imagePath);
        }

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Set author
        $validated['author_id'] = auth()->id();

        // Set published_at if publishing
        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $blog = Blog::create($validated);

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Article créé avec succès.');
    }

    /**
     * Show the form for editing a blog
     */
    public function edit(Blog $blog)
    {
        return Inertia::render('admin/blogs/edit', [
            'blog' => $blog->load('author'),
        ]);
    }

    /**
     * Update the specified blog
     */
    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug,' . $blog->id,
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:5120',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,published,archived',
            'featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Handle image upload
        if ($request->hasFile('featured_image')) {
            // Delete old image if exists
            if ($blog->featured_image) {
                $oldPath = parse_url($blog->featured_image, PHP_URL_PATH);
                Storage::disk('s3')->delete(ltrim($oldPath, '/'));
            }
            
            $imagePath = $request->file('featured_image')->storePublicly('blogs', 's3');
            $validated['featured_image'] = Storage::disk('s3')->url($imagePath);
        }

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Set published_at if publishing for first time
        if ($validated['status'] === 'published' && $blog->status !== 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Article mis à jour avec succès.');
    }

    /**
     * Remove the specified blog
     */
    public function destroy(Blog $blog)
    {
        // Delete featured image if exists
        if ($blog->featured_image) {
            $oldPath = parse_url($blog->featured_image, PHP_URL_PATH);
            Storage::disk('s3')->delete(ltrim($oldPath, '/'));
        }

        $blog->delete();

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Article supprimé avec succès.');
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(Blog $blog)
    {
        $blog->update(['featured' => !$blog->featured]);

        return redirect()->back()
            ->with('success', $blog->featured ? 'Article mis en avant.' : 'Article retiré des articles en avant.');
    }

    /**
     * Publish a draft
     */
    public function publish(Blog $blog)
    {
        $blog->update([
            'status' => 'published',
            'published_at' => $blog->published_at ?? now(),
        ]);

        return redirect()->back()
            ->with('success', 'Article publié avec succès.');
    }

    /**
     * Unpublish (archive) a blog
     */
    public function archive(Blog $blog)
    {
        $blog->update(['status' => 'archived']);

        return redirect()->back()
            ->with('success', 'Article archivé.');
    }

    /**
     * Upload image for TipTap editor
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->storePublicly('blogs/content', 's3');
        $url = Storage::disk('s3')->url($path);

        return response()->json(['url' => $url]);
    }
}
