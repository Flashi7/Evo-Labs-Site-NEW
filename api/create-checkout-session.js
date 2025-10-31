// STRIPE CHECKOUT SESSION API
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Stripe secret key is not configured' });
    }

    try {
        const { items, customer, shipping, orderId, metadata, successUrl, cancelUrl } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items are required' });
        }

        if (!customer || !customer.email) {
            return res.status(400).json({ error: 'Customer email is required' });
        }

        const subtotal = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
        const shippingAmount = 0; // Gratuit pour les tests

        const lineItems = items.map(item => ({
            price_data: {
                currency: item.currency || 'eur',
                product_data: {
                    name: item.name,
                    description: item.description || `${item.name} - ${item.size || ''}`,
                },
                unit_amount: item.amount,
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customer.email,
            shipping_address_collection: {
                allowed_countries: ['FR', 'BE', 'LU', 'CH', 'DE', 'AT', 'ES', 'IT', 'PT', 'NL', 'GB', 'IE', 'DK', 'SE', 'FI', 'NO', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT', 'MT', 'CY'],
            },
            metadata: {
                orderId: orderId || metadata?.orderId || `order_${Date.now()}`,
                customerEmail: customer.email,
                customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
                ...metadata
            },
            success_url: successUrl || `${req.headers.origin || 'https://evo-labs.fr'}${req.headers.referer?.split('?')[0] || '/'}?session_id={CHECKOUT_SESSION_ID}&payment=success`,
            cancel_url: cancelUrl || req.headers.origin || 'https://evo-labs.fr',
            locale: 'auto',
            allow_promotion_codes: true,
        });

        res.status(200).json({
            id: session.id,
            url: session.url
        });
    } catch (error) {
        console.error('Erreur Stripe:', error);
        res.status(500).json({
            error: error.message || 'Erreur lors de la création de la session de paiement',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
