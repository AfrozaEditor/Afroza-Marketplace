<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Désinscription - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f9fafb;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1 {
            color: #111827;
            font-size: 24px;
            margin-bottom: 16px;
        }
        p {
            color: #6b7280;
            font-size: 16px;
            line-height: 1.6;
        }
        .icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 20px;
        }
        .btn:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📧</div>
        <h1>Vous avez été désinscrit</h1>
        <p>
            Votre adresse email <strong>{{ $subscriber->email }}</strong> a été retirée de notre liste de diffusion.
        </p>
        <p>
            Vous ne recevrez plus nos newsletters. Si vous changez d'avis, vous pouvez vous réinscrire à tout moment depuis notre site.
        </p>
        <a href="{{ url('/') }}" class="btn">Retour au site</a>
    </div>
</body>
</html>
