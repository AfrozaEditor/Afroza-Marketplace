<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Afroza Marketplace est une marketplace généraliste africaine pour acheter et vendre facilement des produits neufs ou d’occasion : électronique, mode, maison, services et plus.">
        <meta name="keywords" content="afroza, afroza marketplace, marketplace africaine, marketplace généraliste, e-commerce Afrique, acheter en ligne Afrique, vendre en ligne Afrique, produits neufs, produits d’occasion">
        <meta name="author" content="{{ config('app.name', 'Afroza Marketplace') }}">

        <meta property="og:title" content="Afroza Marketplace – Achetez & vendez tout en Afrique">
        <meta property="og:description" content="Téléphones, mode, maison, services… Achetez et vendez facilement sur Afroza Marketplace, la marketplace généraliste africaine.">
        <meta property="og:url" content="https://afrozamarketplace.app">
        <meta property="og:image" content="{{ asset('logo_vd.png') }}">

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

        <link rel="icon" href={{asset('favicon.ico')}}>
        <!-- <link rel="icon" href="/favicon.svg" type="image/svg+xml"> -->
        <!-- <link rel="apple-touch-icon" href="/apple-touch-icon.png"> -->

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
