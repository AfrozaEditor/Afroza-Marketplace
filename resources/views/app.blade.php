<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Afroza Marketplace est une marketplace généraliste africaine pour acheter et vendre facilement des produits neufs ou d’occasion : électronique, mode, maison, services et plus.">
        <meta name="keywords" content="afroza, afroza marketplace, marketplace africaine, marketplace généraliste, e-commerce Afrique, acheter en ligne Afrique, vendre en ligne Afrique, produits neufs, produits d’occasion">
        <meta name="author" content="{{ config('app.name', 'Afroza Marketplace') }}">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Afroza Marketplace">
        <meta property="og:locale" content="fr_FR">
        <meta property="og:title" content="Afroza Marketplace – Achetez & vendez tout en Afrique">
        <meta property="og:description" content="Téléphones, mode, maison, services… Achetez et vendez facilement sur Afroza Marketplace, la marketplace généraliste africaine.">
        <meta property="og:url" content="https://afrozamarketplace.app">
        <meta property="og:image" content="{{ asset('android-chrome-512x512.png') }}">
        <meta property="og:image:width" content="512">
        <meta property="og:image:height" content="512">
        <meta property="og:image:alt" content="Afroza Marketplace Logo">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@afrozamarket">
        <meta name="twitter:title" content="Afroza Marketplace – Achetez & vendez tout en Afrique">
        <meta name="twitter:description" content="Téléphones, mode, maison, services… Achetez et vendez facilement sur Afroza Marketplace, la marketplace généraliste africaine.">
        <meta name="twitter:image" content="{{ asset('android-chrome-512x512.png') }}">
        <meta name="twitter:image:alt" content="Afroza Marketplace Logo">

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

        <title>Afroza Marketplace – Marketplace généraliste africaine</title>

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
