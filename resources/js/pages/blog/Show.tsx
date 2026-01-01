import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Article, BreadcrumbItem } from '@/types';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    Eye, 
    Facebook, 
    Linkedin, 
    Share2, 
    Twitter,
    Tag,
    ChevronRight
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import NewsLetter from '@/components/home/news-letter';

interface Props {
    blog: Article;
    relatedBlogs: Article[];
}

export default function Show({ blog, relatedBlogs }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Accueil', href: '/' },
        { title: 'Blog', href: '/blog' },
        { title: blog.title, href: `/blog/${blog.slug}` },
    ];

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = blog.title;

    const handleShare = (platform: string) => {
        let url = '';
        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
                break;
            default:
                if (navigator.share) {
                    navigator.share({ title: shareTitle, url: shareUrl });
                    return;
                }
        }
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    };

    return (
        <AppLayout>
            <Head title={blog.title} />

            <article className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/blog">
                        <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="h-4 w-4" />
                            Retour au blog
                        </Button>
                    </Link>
                </div>

                {/* Header */}
                <header className="max-w-4xl mx-auto mb-8">
                    {/* Category & Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        {blog.category && (
                            <Link href={`/blog?category=${blog.category}`}>
                                <Badge variant="secondary" className="hover:bg-secondary/80">
                                    {blog.category}
                                </Badge>
                            </Link>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(blog.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {blog.read_time} min de lecture
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {blog.views} vues
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-xl text-muted-foreground mb-6">
                        {blog.excerpt}
                    </p>

                    {/* Author */}
                    {blog.author && (
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                                <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{blog.author.name}</p>
                                <p className="text-sm text-muted-foreground">Auteur</p>
                            </div>
                        </div>
                    )}
                </header>

                {/* Featured Image */}
                {blog.featured_image && (
                    <div className="max-w-5xl mx-auto mb-10">
                        <div className="aspect-video relative rounded-xl overflow-hidden">
                            <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8">
                        {/* Main Content */}
                        <div 
                            className="prose prose-lg dark:prose-invert max-w-none
                                prose-headings:font-bold prose-headings:tracking-tight
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-muted-foreground prose-p:leading-relaxed
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-lg prose-img:shadow-md
                                prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                                prose-pre:bg-muted prose-pre:border
                                prose-ul:list-disc prose-ol:list-decimal
                                prose-li:text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Sidebar - Share & TOC */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 space-y-6">
                                {/* Share */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Share2 className="h-4 w-4" />
                                            Partager
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('facebook')}
                                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('twitter')}
                                            className="hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200"
                                        >
                                            <Twitter className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('linkedin')}
                                            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </aside>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                {blog.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mobile Share */}
                    <div className="mt-8 lg:hidden">
                        <Card>
                            <CardContent className="py-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <Share2 className="h-4 w-4" />
                                        Partager cet article
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('facebook')}
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('twitter')}
                                        >
                                            <Twitter className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('linkedin')}
                                        >
                                            <Linkedin className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleShare('native')}
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Author Bio */}
                    {blog.author && (
                        <Card className="mt-10">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                                        <AvatarFallback className="text-xl">{blog.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">
                                            À propos de {blog.author.name}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            Rédacteur passionné par la mode durable et l'économie circulaire. 
                                            Partage régulièrement des conseils et tendances sur Vide Dressing.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Related Articles */}
                {relatedBlogs.length > 0 && (
                    <section className="max-w-5xl mx-auto mt-16">
                        <Separator className="mb-10" />
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Articles similaires</h2>
                            <Link href="/blog">
                                <Button variant="ghost" className="gap-1">
                                    Voir tous les articles
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedBlogs.map((article) => (
                                <Link key={article.id} href={`/blog/${article.slug}`}>
                                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                                        <div className="aspect-video relative overflow-hidden">
                                            <img
                                                src={article.featured_image || '/placeholder-blog.jpg'}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {article.category && (
                                                <Badge className="absolute top-3 left-3" variant="secondary">
                                                    {article.category}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(article.published_at)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {article.read_time} min
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Newsletter */}
                <div className="mt-16">
                    <NewsLetter />
                </div>
            </article>
        </AppLayout>
    );
}
