const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fileController = require('./fileController');
const jwksClient = require("jwks-rsa");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// In-Memory Storage (für Development)
let issuerString = "";

const client = jwksClient({
  jwksUri: 'https://bildungsportal.sachsen.de/opal/restapi/lti/keys',
  requestHeaders: {},
  timeout: 30000,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('Key fetch error:', err);
      return callback(err);
    }
    console.log(key);
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// RSA Key Pair generieren
function generateKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
}

let publicKey = "";
const keyPair = generateKeyPair();
const keyId = 'key-' + Date.now()

// JWKS Endpoint (Keyset URL)
app.get('/keys', (req, res) => {
  console.log('📋 Keyset URL aufgerufen');

  // Öffentlichen Schlüssel in JWK Format konvertieren
  publicKey = crypto.createPublicKey(keyPair.publicKey);
  const jwk = publicKey.export({ format: 'jwk' });

  const jwks = {
    keys: [{
      ...jwk,
      kid: keyId,
      alg: 'RS256',
      use: 'sig'
    }]
  };

  res.json(jwks);
});

// Login Initiation Endpoint (Login URL)
app.post('/login', (req, res) => {
  console.log('🔐 Login-Anfrage:', req.query);
  console.log(req.headers);
  console.log(req.body);

  const {
    iss,           // Platform (LMS) URL
    login_hint,    // User identifier
    target_link_uri, // Launch URL
    client_id      // Client ID
  } = req.body;

  console.log('Platform:', iss);
  console.log('Client ID:', client_id);
  console.log('Target:', target_link_uri);

  issuerString = iss;

  // Einfache Weiterleitung zur Launch URL
  const authUrl = new URL(`${iss}/ltiauth/`); // OPAL-spezifischer Pfad
  authUrl.searchParams.set('response_type', 'id_token');
  authUrl.searchParams.set('client_id', client_id);
  authUrl.searchParams.set('redirect_uri', target_link_uri);
  authUrl.searchParams.set('login_hint', login_hint);
  authUrl.searchParams.set('state', Math.random().toString(36));
  authUrl.searchParams.set('response_mode', 'form_post');
  authUrl.searchParams.set('nonce', Math.random().toString(36));
  authUrl.searchParams.set('scope', 'openid');

  console.log('Redirecting to:', authUrl.toString());

  // Browser-Redirect zum LMS
  res.redirect(authUrl.toString());

});

// Launch Endpoint (Launch URL)
app.all('/launch', (req, res) => {
  console.log('🚀 Launch-Anfrage');
  console.log('Query:', req.query);
  const token = req.body.id_token;

  jwt.verify(token, getKey, {
    algorithms: ['RS256'],
    issuer: issuerString,
    audience: '12345'
  }, (err, decoded) => {
    if (err) {
      console.error('JWT validation failed:', err);
      return res.status(401).send('Invalid token');
    }

    // Token ist gültig
    console.log('User ID:', decoded.sub);
    console.log('User Name:', decoded.name);
    console.log('User Email:', decoded.email);
    console.log('Roles:', decoded['https://purl.imsglobal.org/spec/lti/claim/roles']);

    const user = { sub: decoded.sub, name: decoded.name, email: decoded.email };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.cookie('token', token, { httpOnly: true, secure: true });
    res.redirect('https://hci-lti-lernapp.imn.htwk-leipzig.de/'); // oder React-Route
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Simple LTI App',
    endpoints: {
      login: `/login`,
      launch: `/launch`,
      keyset: `/keys`
    }
  });
});

// 🔐 JWT Middleware
function authenticateJWT(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// API Routen für Datei lesen/schreiben
app.use('/api', authenticateJWT, fileController);

app.set('trust proxy', 1); // wichtig für korrekte Erkennung von HTTPS via Proxy

app.listen(process.env.PORT || 3000, () => {
  console.log('🌐 Express server läuft auf Port ' + (process.env.PORT || 3000));
});
