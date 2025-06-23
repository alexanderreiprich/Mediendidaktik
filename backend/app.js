const express = require('express');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();
const httpsPort = 3000;
const httpPort = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// In-Memory Storage (für Development)
let platforms = {};
let keys = {};
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

const keyPair = generateKeyPair();
const keyId = 'key-' + Date.now()

// SSL-Optionen laden
let sslOptions;
try {
  sslOptions = {
    key: fs.readFileSync('/etc/ssl/private/lti-app.key'),
    cert: fs.readFileSync('/etc/ssl/certs/lti-app.crt')
  };
  console.log('✅ SSL-Zertifikate gefunden');
} catch (error) {
  console.log('❌ SSL-Zertifikate nicht gefunden:', error.message);
  console.log('💡 Erstelle sie mit:');
  console.log('sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\');
  console.log('    -keyout /etc/ssl/private/lti-app.key \\');
  console.log('    -out /etc/ssl/certs/lti-app.crt \\');
  console.log('    -subj "/C=DE/ST=Berlin/L=Berlin/O=LTI-App/CN=hci-lti-lernapp.imn.htwk-leipzig.de"');
  process.exit(1);
}

const httpsServer = https.createServer(sslOptions, app);
let publicKey = "";

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
    
    res.send(`Hallo ${decoded.name}!
	E-Mail: ${decoded.email}
	    `);
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

// Root Route
app.get('/', (req, res) => {
  res.send(`
    <h1>LTI Test App</h1>
    <p>Die App läuft! 🚀</p>
    <ul>
      <li><a href="/health">Health Check</a></li>
      <li><a href="/debug">Debug Info</a></li>
      <li><a href="/keys">Public Keys (JWKS)</a></li>
    </ul>
  `);
});

// HTTPS Server starten
httpsServer.listen(httpsPort, '0.0.0.0', () => {
  console.log('🚀 LTI App mit HTTPS gestartet!');
  console.log(`📍 HTTPS Server läuft auf: https://hci-lti-lernapp.imn.htwk-leipzig.de:${httpsPort}`);
  console.log('\n📋 LTI-Konfiguration für dein LMS:');
  console.log(`Login URL:  https://hci-lti-lernapp.imn.htwk-leipzig.de:${httpsPort}/login`);
  console.log(`Launch URL: https://hci-lti-lernapp.imn.htwk-leipzig.de:${httpsPort}/launch`);
  console.log(`Keyset URL: https://hci-lti-lernapp.imn.htwk-leipzig.de:${httpsPort}/keys`);
  console.log(`Health:     https://hci-lti-lernapp.imn.htwk-leipzig.de:${httpsPort}/health`);
  console.log('\n🎉 Bereit für LTI-Integration!');
});

process.on('SIGTERM', () => {
  console.log('Server wird heruntergefahren...');
  process.exit(0);
});
