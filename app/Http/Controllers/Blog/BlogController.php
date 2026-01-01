<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of published blogs.
     */
    public function index(Request $request)
    {
        $category = $request->get('category');
        
        $query = Blog::with('author')
            ->published()
            ->orderBy('published_at', 'desc');
        
        if ($category) {
            $query->where('category', $category);
        }
        
        $blogs = $query->paginate(12)->withQueryString();
        $featuredBlogs = Blog::published()->featured()->take(3)->get();
        $cats = Blog::published()
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');
        
        foreach ($blogs as $blog) {
            if ($blog->featured_image) {
                $featured_image_url = Storage::disk('s3')->temporaryUrl($blog->featured_image, now()->addMinutes(5));
                $blog->featured_image = $featured_image_url;
            }
        }

        
        return Inertia::render('blog/Index', [
            'blogs' => $blogs,
            'featuredBlogs' => $featuredBlogs,
            'cats' => $cats,
            'currentCategory' => $category,
        ]);
    }

    /**
     * Display the specified blog.
     */
    public function show(string $slug)
    {
        $blog = Blog::with('author')
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();
        
        // Increment views
        $blog->increment('views');
        
        // Get related blogs
        $relatedBlogs = Blog::published()
            ->where('id', '!=', $blog->id)
            ->when($blog->category, function ($query) use ($blog) {
                return $query->where('category', $blog->category);
            })
            ->take(3)
            ->get();
        
        if ($blog->featured_image) {
            $blog->featured_image_url = Storage::disk('s3')->temporaryUrl($blog->featured_image, now()->addMinutes(5));
        }
        
        return Inertia::render('blog/Show', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
        ]);
    }
}
