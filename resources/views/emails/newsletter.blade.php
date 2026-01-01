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
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px 20px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #444;
        }
        .newsletter-content {
            color: #555;
        }
        .newsletter-content h2 {
            color: #333;
            font-size: 20px;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        .newsletter-content p {
            margin: 15px 0;
        }
        .newsletter-content a {
            color: #667eea;
            text-decoration: none;
        }
        .newsletter-content a:hover {
            text-decoration: underline;
        }
        .newsletter-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 15px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 12px 30px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #eee;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .social-links {
            margin: 15px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
        }
        .divider {
            height: 1px;
            background-color: #eee;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 20px 15px;
            }
            .header h1 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{ config('app.name') }}</div>
            <h1>{{ $newsletter->subject }}</h1>
        </div>
        
        <div class="content">
            <p class="greeting">
                @if(isset($subscriber->name) && $subscriber->name)
                    Bonjour {{ $subscriber->name }},
                @else
                    Bonjour,
                @endif
            </p>
            
            @if($newsletter->preview_text)
                <p style="color: #6b7280; font-style: italic; margin-bottom: 20px;">
                    {{ $newsletter->preview_text }}
                </p>
            @endif

            <div class="newsletter-content">
                {!! $newsletter->content !!}
            </div>

            <div class="divider"></div>

            <p style="text-align: center;">
                <a href="{{ url('/') }}" class="cta-button">Visiter notre site</a>
            </p>
        </div>
        
        <div class="footer">
            <p>
                Vous recevez cet email car vous êtes inscrit à la newsletter de {{ config('app.name') }}.
            </p>
            <p>
                <a href="{{ $viewInBrowserUrl ?? '#' }}">Voir dans le navigateur</a> | 
                <a href="{{ $unsubscribeUrl }}">Se désinscrire</a>
            </p>
            <div class="social-links">
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
            </div>
            <p style="margin-top: 15px;">
                © {{ date('Y') }} {{ config('app.name') }}. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
