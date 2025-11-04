// server.js
import 'dotenv/config'; // carrega variáveis do .env em process.env (apenas em dev)
import express from "express";
import cors from "cors";

// Create a new express application instance
const app = express();

// App configuration
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

// Adicione credenciais e integrator id (se fornecido)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // ← Troque por sua chave privada
});

// Routes Ping -- útil para monitoring.
app.get("/ping", (req, res) => { 
  res.send("pong");
});

// Route to create preference mp

app.post ("/create-preference", (req, res) => {
  try {
    const {
      product_id,
      title,
      description,
      picture_url,
      quantity,
      unit_price,
      max_installments,
      excluded_payment_methods,
      excluded_payment_types,
      external_reference,
    } = req.body || {};

    // Defaults (use env vars when possible)
    const PROD_ID = product_id || process.env.PRODUCT_ID || 'prod_site_gym_001';
    const TITLE = title || process.env.PRODUCT_TITLE || 'Plano Academia - Mensal';
    const DESC = description || process.env.PRODUCT_DESCRIPTION || 'Acesso mensal completo à academia';
    // If frontend sent a plan id like "plan_1" we map it to an authoritative total price here
    const PLAN_PRICES = {
      'plan_1': 129.00,
      'plan_2': 159.00,
      'plan_3': 179.00,
      'plan_4': 714.00,
      'plan_5': 858.00,
      'plan_6': 978.00,
      'plan_7': 1308.00,
      'plan_8': 1428.00,
      'plan_9': 1788.00,
      'plan_10': 250.00,
      'plan_11': 185.00,
    };

    let PRICE = Number(unit_price || process.env.PRODUCT_PRICE || 2000);
    if (PROD_ID && PLAN_PRICES[PROD_ID]) {
      PRICE = PLAN_PRICES[PROD_ID];
    }
    const QTY = Number(quantity || 1);
    const PICTURE = picture_url || process.env.PRODUCT_IMAGE_URL || 'https://site-gym-weld.vercel.app/logo512.png';
    const MAX_INSTALLMENTS = Number(max_installments || process.env.MP_MAX_INSTALLMENTS || 1);

    // Validar picture_url simples (https)
    const isValidUrl = (url) => {
      try {
        const u = new URL(url);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch (e) {
        return false;
      }
    };

    if (!isValidUrl(PICTURE)) {
      console.warn('Product picture URL is not valid, falling back to placeholder');
    }

    // Payment method exclusions (comma separated ids)
    const excludedMethods = (excluded_payment_methods || process.env.MP_EXCLUDED_PAYMENT_METHODS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(id => ({ id }));

    const excludedTypes = (excluded_payment_types || process.env.MP_EXCLUDED_PAYMENT_TYPES || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(id => ({ id }));

    // external_reference: use provided or generate one
    const externalRef = external_reference || process.env.MP_EXTERNAL_REFERENCE || `site-gym-${PROD_ID}-${Date.now()}`;

    const preference = new Preference(client);

    const preferenceBody = {
      items: [
        {
          id: PROD_ID,
          title: TITLE,
          description: DESC,
          picture_url: isValidUrl(PICTURE) ? PICTURE : undefined,
          quantity: QTY,
          unit_price: PRICE,
        }
      ],
      external_reference: externalRef,
      payment_methods: {},
      installments: MAX_INSTALLMENTS,
      back_urls: {
        success: process.env.MP_BACK_URL_SUCCESS || 'https://site-gym-weld.vercel.app/success',
        failure: process.env.MP_BACK_URL_FAILURE || 'https://site-gym-weld.vercel.app/failure',
        pending: process.env.MP_BACK_URL_PENDING || 'https://site-gym-weld.vercel.app/pending'
      },
      notification_url: process.env.MP_NOTIFICATION_URL || `${process.env.BACKEND_URL || 'http://localhost:8080'}/webhook`,
      auto_return: 'approved',
    };

    if (excludedMethods.length) {
      preferenceBody.payment_methods.excluded_payment_methods = excludedMethods;
    }
    if (excludedTypes.length) {
      preferenceBody.payment_methods.excluded_payment_types = excludedTypes;
    }

    // Create preference
    preference.create({ body: preferenceBody })
      .then((data) => {
        console.log('Preference created', { id: data.id });
        res.status(200).json({
          preference_id: data.id,
          preference_url: data.init_point,
        });
      })
      .catch((err) => {
        console.error('Error creating preference', err);
        res.status(500).json({ error: 'error creating preference', details: err?.message || err });
      });

  } catch (err) {
    console.error('Unexpected error in /create-preference', err);
    res.status(500).json({ error: 'internal server error' });
  }

});

// Webhook endpoint to receive notifications from Mercado Pago
app.post('/webhook', (req, res) => {
  try {
    console.log('Received MP notification:', JSON.stringify(req.body));
    // TODO: validate notification signature if possible and process according to business logic
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error processing webhook', err);
    res.status(500).send('ERROR');
  }
});


// Export handler for Vercel serverless functions
// Vercel expects a function that receives (req, res) and handles routing
export default function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Use Express app to handle the request
  app(req, res);
}

// Start server for local development (only runs if not in Vercel environment)
if (process.env.VERCEL !== '1' && typeof require !== 'undefined') {
  // Only run in Node.js environment (not Vercel serverless)
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`The server is now running on Port ${port}`);
  });
}
