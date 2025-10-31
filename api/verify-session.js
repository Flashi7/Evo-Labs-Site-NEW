// STRIPE SESSION VERIFICATION API
// Vérifie une session Stripe après paiement pour sécurité supplémentaire
//
// IMPORTANT: Ajoutez votre clé secrète Stripe dans les variables d'environnement Vercel:
// - STRIPE_SECRET_KEY=sk_test_... (ou sk_live_... pour la production)

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // Gérer les requêtes CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vérifier que Stripe est configuré
    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Stripe secret key is not configured' });
    }

    try {
        const sessionId = req.query.session_id || req.body.session_id;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Récupérer la session Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent', 'customer']
        });

        // Vérifier que le paiement a réussi
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ 
                error: 'Payment not completed',
                payment_status: session.payment_status 
            });
        }

        // Retourner les informations de la session
        res.status(200).json({
            success: true,
            session_id: session.id,
            payment_status: session.payment_status,
            customer_email: session.customer_email || session.customer_details?.email,
            amount_total: session.amount_total,
            currency: session.currency,
            metadata: session.metadata,
            payment_intent: session.payment_intent?.id || null,
        });
    } catch (error) {
        console.error('Erreur lors de la vérification de la session Stripe:', error);
        
        // Gérer les erreurs spécifiques de Stripe
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({ 
                error: 'Invalid session ID',
                message: error.message 
            });
        }

        res.status(500).json({ 
            error: error.message || 'Erreur lors de la vérification de la session',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

