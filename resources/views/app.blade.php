<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        @php
            $defaultTitle = 'Afroza Marketplace – Achetez & vendez tout en Afrique';
            $defaultDescription = 'Téléphones, mode, maison, services… Achetez et vendez facilement sur Afroza Marketplace, la marketplace généraliste africaine.';
            $defaultImage = asset('android-chrome-512x512.png');

            $metaTitle = $defaultTitle;
            $metaDescription = $defaultDescription;
            $metaImage = $defaultImage;
            $metaUrl = request()->fullUrl();

            $component = data_get($page ?? [], 'component');
            $props = data_get($page ?? [], 'props', []);

            if ($component === 'product/Show') {
                $productName = data_get($props, 'product.name');
                $productDescription = data_get($props, 'product.description');
                $productImage = data_get($props, 'images.0');

                if (!empty($productName)) {
                    $metaTitle = $productName . ' – Afroza Marketplace';
                }

                if (!empty($productDescription)) {
                    $metaDescription = \Illuminate\Support\Str::limit(strip_tags($productDescription), 180);
                }

                if (!empty($productImage)) {
                    $metaImage = $productImage;
                }
            } elseif ($component === 'blog/Show') {
                $blogTitle = data_get($props, 'blog.title');
                $blogExcerpt = data_get($props, 'blog.excerpt');
                $blogImage = data_get($props, 'blog.featured_image_url') ?: data_get($props, 'blog.featured_image');

                if (!empty($blogTitle)) {
                    $metaTitle = $blogTitle . ' – Blog Afroza Marketplace';
                }

                if (!empty($blogExcerpt)) {
                    $metaDescription = \Illuminate\Support\Str::limit(strip_tags($blogExcerpt), 180);
                }

                if (!empty($blogImage)) {
                    $metaImage = $blogImage;
                }
            } elseif ($component === 'marketplace/Show') {
                $shopName = data_get($props, 'shop.name');
                $shopDescription = data_get($props, 'shop.description');
                $shopImage = data_get($props, 'shop.cover_image_url')
                    ?: data_get($props, 'shop.cover_image')
                    ?: data_get($props, 'shop.logo_url')
                    ?: data_get($props, 'shop.logo');

                if (!empty($shopName)) {
                    $metaTitle = $shopName . ' – Boutique Afroza Marketplace';
                }

                if (!empty($shopDescription)) {
                    $metaDescription = \Illuminate\Support\Str::limit(strip_tags($shopDescription), 180);
                }

                if (!empty($shopImage)) {
                    $metaImage = $shopImage;
                }
            }
        @endphp

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="{{ $metaDescription }}">
        <meta name="keywords" content="afroza, afroza marketplace, marketplace africaine, marketplace généraliste, e-commerce Afrique, acheter en ligne Afrique, vendre en ligne Afrique, produits neufs, produits d’occasion">
        <meta name="author" content="{{ config('app.name', 'Afroza Marketplace') }}">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Afroza Marketplace">
        <meta property="og:locale" content="fr_FR">
        <meta property="og:title" content="{{ $metaTitle }}">
        <meta property="og:description" content="{{ $metaDescription }}">
        <meta property="og:url" content="{{ $metaUrl }}">
        <meta property="og:image" content="{{ $metaImage }}">
        <meta property="og:image:width" content="512">
        <meta property="og:image:height" content="512">
        <meta property="og:image:alt" content="{{ $metaTitle }}">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@afrozamarketplace">
        <meta name="twitter:title" content="{{ $metaTitle }}">
        <meta name="twitter:description" content="{{ $metaDescription }}">
        <meta name="twitter:image" content="{{ $metaImage }}">
        <meta name="twitter:image:alt" content="{{ $metaTitle }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title>{{ $metaTitle }}</title>

        <!-- <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any"> -->
        <!-- <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml"> -->
        <!-- <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32x32.png') }}"> -->
        <!-- <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon-16x16.png') }}"> -->
        <link rel="icon" type="image/png" sizes="48x48" href="{{ asset('favicon-48x48.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
        <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('apple-touch-icon-152x152.png') }}">
        <link rel="apple-touch-icon" sizes="167x167" href="{{ asset('apple-touch-icon-167x167.png') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon-180x180.png') }}">
        <link rel="mask-icon" href="{{ asset('safari-pinned-tab.svg') }}" color="#10b981">
        <link rel="manifest" href="{{ asset('site.webmanifest') }}">
        <meta name="theme-color" content="#10b981">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
