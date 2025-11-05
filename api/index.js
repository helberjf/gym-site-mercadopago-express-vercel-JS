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

// SDK do Mercado Pago - Seguindo padrão oficial do SDK
import { MercadoPagoConfig, Preference } from "mercadopago";

// Inicializar cliente do Mercado Pago
// Seguindo padrão do SDK oficial: https://github.com/mercadopago/sdk-nodejs
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: {
    timeout: 5000, // Timeout de 5 segundos (padrão recomendado)
    integratorId: process.env.MP_INTEGRATOR_ID || 'dev_24c65fb163bf11ea96500242ac130004',
  },
});

// Inicializar API de Preference
const preference = new Preference(client);

// Routes Ping -- útil para monitoring.
app.get("/ping", (req, res) => { 
  res.send("pong");
});

// Rota de teste para verificar se a API está funcionando
app.get("/test", (req, res) => {
  res.json({
    status: "OK",
    message: "API está funcionando!",
    timestamp: new Date().toISOString(),
    endpoints: {
      "POST /create-preference": "Cria uma preferência de pagamento no Mercado Pago",
      "GET /ping": "Health check",
      "POST /webhook": "Webhook do Mercado Pago"
    }
  });
});

// Route to create preference mp
// Add GET route for testing/info
app.get("/create-preference", (req, res) => {
  res.status(405).json({ 
    error: "Method Not Allowed",
    message: "Esta rota aceita apenas requisições POST. Use o método POST para criar uma preferência de pagamento.",
    allowedMethods: ["POST"]
  });
});

app.post("/create-preference", (req, res) => {
  try {
    const {
      product_id,
      title,
      description,
      picture_url,
      quantity,
      unit_price,
      max_installments=6,
      excluded_payment_methods='visa',
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
     // ---- MAX INSTALLMENTS: authoritative backend rule, forced between 1 and 6 ----
     const ENV_MAX = Number(process.env.MP_MAX_INSTALLMENTS || 6);
     const requestedMax = Number(max_installments || ENV_MAX || 6);
     const MAX_INSTALLMENTS = Math.max(1, Math.min(Math.floor(requestedMax || 6), 6)); // integer 1..6
     console.log('MAX_INSTALLMENTS:', MAX_INSTALLMENTS);

    
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
    const excludedMethods = (excluded_payment_methods || process.env.MP_EXCLUDED_PAYMENT_METHODS || 'visa')
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

    // Criar body da preferência seguindo padrão do SDK oficial
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
      payment_methods: {
        default_payment_method_id: 'master',
        excluded_payment_types: [
          {
            id: 'ticket'
          },
        ],
        excluded_payment_methods: [
          {
            id: 'visa',
          },
        ],
        installments: 6,
        default_installments: 1,
      },
      back_urls: {
        success: process.env.MP_BACK_URL_SUCCESS || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/front-end/success.html` : 'https://site-gym-weld.vercel.app/front-end/success.html'),
        failure: process.env.MP_BACK_URL_FAILURE || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/front-end/failure.html` : 'https://site-gym-weld.vercel.app/front-end/failure.html'),
        pending: process.env.MP_BACK_URL_PENDING || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/front-end/pending.html` : 'https://site-gym-weld.vercel.app/front-end/pending.html')
      },
      notification_url: process.env.MP_NOTIFICATION_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/webhook` : `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/webhook`),
      auto_return: 'approved',
    };

    if (excludedMethods.length) {
      preferenceBody.payment_methods.excluded_payment_methods = excludedMethods;
    }
    if (excludedTypes.length) {
      preferenceBody.payment_methods.excluded_payment_types = excludedTypes;
    }

    // Criar preferência usando SDK oficial
    // Seguindo padrão: preference.create({ body })
    // O Integrator ID já está configurado no client, será enviado automaticamente
    preference.create({ body: preferenceBody })
      .then((response) => {
        // Response do SDK segue estrutura: { id, init_point, ... }
        console.log('Preference created successfully', { id: response.id });
        res.status(200).json({
          preference_id: response.id,
          preference_url: response.init_point, // URL para redirecionamento
        });
      })
      .catch((err) => {
        console.error('Error creating preference:', err);
        const errorMessage = err?.message || String(err);
        res.status(500).json({ 
          error: 'error creating preference', 
          details: errorMessage,
          // Log adicional para debug no Vercel
          ...(process.env.NODE_ENV === 'development' && { stack: err?.stack })
        });
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


// Handler for Vercel serverless functions
// When using @vercel/node with a single file routing multiple paths,
// we need to export a function that handles the request
function handler(req, res) {
  // Remove /api prefix from path for internal routing
  // Vercel routes /api/* to this file, but Express routes expect /create-preference
  const originalUrl = req.url;
  if (originalUrl.startsWith('/api/')) {
    req.url = originalUrl.replace('/api', '');
  }
  
  // Use Express app to handle the request
  app(req, res);
}

// Export handler for Vercel (must be at top level)
export default handler;

// Start server for local development (only runs if not in Vercel environment)
// Check if we're running in a serverless environment (Vercel)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

if (!isVercel) {
  // Start server for local development
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`The server is now running on Port ${port}`);
    console.log(`Test endpoints:`);
    console.log(`  GET  http://localhost:${port}/ping`);
    console.log(`  POST http://localhost:${port}/create-preference`);
  });
}
