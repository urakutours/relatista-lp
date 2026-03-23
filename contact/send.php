<?php
// Relatista Contact Form Handler

// Honeypot check
if (!empty($_POST['website'])) {
    header('Location: /contact/?error=spam');
    exit;
}

// Get form data
$name     = isset($_POST['name']) ? trim($_POST['name']) : '';
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$category = isset($_POST['category']) ? trim($_POST['category']) : 'その他';
$content  = isset($_POST['content']) ? trim($_POST['content']) : '';

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /contact/?error=email');
    exit;
}

// Validate content
if (empty($content)) {
    header('Location: /contact/?error=content');
    exit;
}

// Sanitize
$name     = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email    = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$category = htmlspecialchars($category, ENT_QUOTES, 'UTF-8');
$content  = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');

// Build email
$to      = 'support@relatista.com';
$subject = "【Relatista】お問い合わせ: {$category}";

$body  = "Relatistaお問い合わせフォームより送信されました。\n\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "お名前: " . ($name ?: '（未入力）') . "\n";
$body .= "メールアドレス: {$email}\n";
$body .= "お問い合わせ種別: {$category}\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
$body .= "【お問い合わせ内容】\n";
$body .= $content . "\n";

$headers  = "From: noreply@relatista.com\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: Relatista Contact Form\r\n";

// Send
$result = mail($to, $subject, $body, $headers);

if ($result) {
    header('Location: /contact/?sent=1');
} else {
    header('Location: /contact/?error=send');
}
exit;
