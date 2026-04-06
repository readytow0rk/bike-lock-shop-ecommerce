const https    = require('https');
const qs       = require('querystring');

exports.handler = async (event) => {
  const cors = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.indexOf('sk_') !== 0) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'Stripe secret key not configured' }) };
  }

  let amount;
  try {
    amount = parseInt(JSON.parse(event.body).amount, 10);
  } catch (e) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!amount || amount < 30) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Amount too small (minimum 30p)' }) };
  }

  const postData = qs.stringify({
    amount:                                  String(amount),
    currency:                                'gbp',
    'automatic_payment_methods[enabled]':        'true',
    'automatic_payment_methods[allow_redirects]': 'never'
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.stripe.com',
      path:     '/v1/payment_intents',
      method:   'POST',
      headers: {
        'Authorization':  'Basic ' + Buffer.from(secretKey + ':').toString('base64'),
        'Content-Type':   'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Stripe-Version': '2024-06-20'
      }
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            resolve({ statusCode: 400, headers: cors, body: JSON.stringify({ error: parsed.error.message }) });
          } else {
            resolve({ statusCode: 200, headers: cors, body: JSON.stringify({ clientSecret: parsed.client_secret }) });
          }
        } catch (e) {
          resolve({ statusCode: 500, headers: cors, body: JSON.stringify({ error: 'Stripe parse error' }) });
        }
      });
    });
    req.on('error', (e) => resolve({ statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) }));
    req.write(postData);
    req.end();
  });
};
