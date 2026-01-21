import Stripe from 'stripe';
import http from 'http';
import 'dotenv/config';

// Initialize Stripe with your Secret Key (to generate signature)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// 1. Construct a mock payload matching what Stripe sends
// Using the IDs you provided in your error message
const payload = {
    id: 'evt_test_webhook_' + Date.now(),
    object: 'event',
    type: 'checkout.session.completed',
    created: Math.floor(Date.now() / 1000),
    data: {
        object: {
            id: 'cs_test_session_' + Date.now(),
            object: 'checkout.session',
            metadata: {
                // IDs from your request
                purchaseId: '696f800cb3805812af54d2d0',
                userId: '696f62612e9bf982579d2265',
                carId: '696f6ea65c489a40dac49617',
                bookingId: '696f800cb3805812af54d2d1',
                ownerId: '696f62612e9bf982579d2265', // Using userId as owner for test
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
            },
            payment_status: 'paid'
        }
    }
};

const payloadString = JSON.stringify(payload, null, 2);

// 2. Generate a valid Stripe Signature for this payload
const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: webhookSecret,
});

console.log("Generated Signature:", header);
console.log("Sending Mock Webhook to http://localhost:3000/stripe...");

// 3. Send the request
const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/stripe',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': header,
        'Content-Length': Buffer.byteLength(payloadString)
    }
}, (res) => {
    console.log(`RESPONSE STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`RESPONSE BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(payloadString);
req.end();
