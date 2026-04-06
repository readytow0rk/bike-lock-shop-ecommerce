<?php
// ─── STRIPE SECRET KEY ────────────────────────────────────────────────────────
// Paste your Stripe SECRET key here (starts with sk_live_ or sk_test_)
// Find it at: https://dashboard.stripe.com/apikeys
define('STRIPE_SECRET_KEY', 'sk_live_YOUR_SECRET_KEY_HERE');
// ─────────────────────────────────────────────────────────────────────────────

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
// JS sends amount already in pence — do NOT multiply by 100
$amount = isset($input['amount']) ? intval($input['amount']) : 0;

if ($amount < 30) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amount']);
    exit;
}

$ch = curl_init('https://api.stripe.com/v1/payment_intents');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query([
        'amount'                                => $amount,
        'currency'                              => 'gbp',
        'automatic_payment_methods[enabled]'    => 'true',
        'automatic_payment_methods[allow_redirects]' => 'never',
    ]),
    CURLOPT_USERPWD        => STRIPE_SECRET_KEY . ':',
    CURLOPT_HTTPHEADER     => ['Stripe-Version: 2024-06-20'],
]);

$response = curl_exec($ch);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(500);
    echo json_encode(['error' => $curlErr]);
    exit;
}

$data = json_decode($response, true);

if (isset($data['error'])) {
    http_response_code(400);
    echo json_encode(['error' => $data['error']['message']]);
    exit;
}

echo json_encode(['clientSecret' => $data['client_secret']]);
