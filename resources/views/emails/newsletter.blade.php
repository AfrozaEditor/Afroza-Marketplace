<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $newsletter->subject }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f0faf9;
        }
        .container {
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 196, 188, 0.15);
        }
        .header {
            background: linear-gradient(135deg, #00C4BC 0%, #00A89D 50%, #008F87 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }
        .header .logo {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header .tagline {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 8px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 25px;
            color: #1a1a1a;
            font-weight: 500;
        }
        .newsletter-content {
            color: #4a5568;
            font-size: 15px;
        }
        .newsletter-content h2 {
            color: #00C4BC;
            font-size: 22px;
            margin-top: 30px;
            margin-bottom: 15px;
            font-weight: 700;
        }
        .newsletter-content h3 {
            color: #1a1a1a;
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        .newsletter-content p {
            margin: 15px 0;
            line-height: 1.8;
        }
        .newsletter-content a {
            color: #00C4BC;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
        }
        .newsletter-content a:hover {
            border-bottom-color: #00C4BC;
        }
        .newsletter-content img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .newsletter-content ul, .newsletter-content ol {
            padding-left: 20px;
            margin: 15px 0;
        }
        .newsletter-content li {
            margin: 8px 0;
        }
        .highlight-box {
            background: linear-gradient(135deg, rgba(0, 196, 188, 0.1) 0%, rgba(0, 168, 157, 0.1) 100%);
            border-left: 4px solid #00C4BC;
            padding: 20px;
            border-radius: 0 12px 12px 0;
            margin: 25px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #00C4BC 0%, #00A89D 100%);
            color: white !important;
            padding: 14px 35px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(0, 196, 188, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 196, 188, 0.5);
        }
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #00C4BC, transparent);
            margin: 30px 0;
            border: none;
        }
        .footer {
            background: linear-gradient(180deg, #f8fffe 0%, #f0faf9 100%);
            padding: 30px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
            border-top: 1px solid rgba(0, 196, 188, 0.2);
        }
        .footer a {
            color: #00C4BC;
            text-decoration: none;
            font-weight: 500;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            margin: 0 8px;
            background: linear-gradient(135deg, #00C4BC 0%, #00A89D 100%);
            color: white !important;
            border-radius: 50%;
            font-size: 14px;
            text-decoration: none;
        }
        .social-links a:hover {
            transform: scale(1.1);
        }
        .footer-links {
            margin: 15px 0;
        }
        .footer-links a {
            margin: 0 10px;
            padding: 5px 0;
        }
        .preview-text {
            color: #6b7280;
            font-style: italic;
            margin-bottom: 25px;
            padding: 15px 20px;
            background-color: #f8fffe;
            border-radius: 8px;
            border-left: 3px solid #00C4BC;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 25px 20px;
            }
            .header {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 20px;
            }
            .header .logo {
                font-size: 26px;
            }
            .cta-button {
                padding: 12px 25px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{ config('app.name') }}</div>
            <h1>{{ $newsletter->subject }}</h1>
            <p class="tagline">Votre marketplace mode & lifestyle</p>
        </div>
        
        <div class="content">
            <p class="greeting">
                @if(isset($subscriber->name) && $subscriber->name)
                    Bonjour {{ $subscriber->name }} 👋
                @else
                    Bonjour 👋
                @endif
            </p>
            
            @if($newsletter->preview_text)
                <p class="preview-text">
                    {{ $newsletter->preview_text }}
                </p>
            @endif

            <div class="newsletter-content">
                {!! $newsletter->content !!}
            </div>

            <div class="divider"></div>

            <p style="text-align: center;">
                <a href="{{ url('/') }}" class="cta-button">🛍️ Découvrir nos articles</a>
            </p>
        </div>
        
        <div class="footer">
            <p style="font-size: 14px; color: #1a1a1a; margin-bottom: 15px;">
                <strong>Merci de faire partie de notre communauté !</strong>
            </p>
            <p>
                Vous recevez cet email car vous êtes inscrit à la newsletter de {{ config('app.name') }}.
            </p>
            <div class="footer-links">
                <a href="{{ $viewInBrowserUrl ?? '#' }}">📧 Voir dans le navigateur</a> 
                <span style="color: #ddd;">|</span>
                <a href="{{ $unsubscribeUrl }}">Se désinscrire</a>
            </div>
            <div class="social-links">
                <a href="#" title="Facebook">f</a>
                <a href="#" title="Instagram">📷</a>
                <a href="#" title="Twitter">𝕏</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.<br>
                <span style="font-size: 11px;">Made with 💚 in Africa</span>
            </p>
        </div>
    </div>
</body>
</html>
