<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\OAuth;

use League\OAuth2\Client\Provider\Google;

date_default_timezone_set('etc/UTC');

require '../vendor/autoload.php';

$mail = new PHPMailer;
$mail->isSMTP();

//Enable SMTP debugging
// 0 = off (for production use)
// 1 = client messages
// 2 = client and server messages
$mail->SMTPDebug = 0;

$mail->Host = 'smtp.gmail.com';
$mail->Port = 587;
$mail->SMTPSecure = 'tls';
$mail->SMTPAuth = true;
$mail->AuthType = 'XOAUTH2';

$fromEmail = 'joel.jdesignera.dev@gmail.com';
$clientId = '517904509908-qs8a53c1mo1b1gnkhkisrll0h955dp6o.apps.googleusercontent.com';
$clientSecret = '0QM1xvhwhiEJunBtyYZqOmG7';

//Obtained by configuring and running get_oauth_token.php
//after setting up an app in Google Developer Console.
$refreshToken = '1/c7b2rRza1G5w0u57SDJpV2J0lTeVIH6DIq78SZozAqIT3B4pOrehJAwNGqLULu9F';

//Create a new OAuth2 provider instance
$provider = new Google(
    [
        'clientId' => $clientId,
        'clientSecret' => $clientSecret,
    ]
);

//Pass the OAuth provider instance to PHPMailer
$mail->setOAuth(
    new OAuth(
        [
            'provider' => $provider,
            'clientId' => $clientId,
            'clientSecret' => $clientSecret,
            'refreshToken' => $refreshToken,
            'userName' => $fromEmail,
        ]
    )
);

$mail->setFrom($fromEmail, 'EcoSplash');
?>
