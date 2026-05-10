const openpgp = require('openpgp');
const fs = require('fs');
const path = require('path');

async function generateKeys() {
  console.log('🗝️ Generating PGP Key Pair (this may take a few seconds)...');

  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'eCommerce Platform', email: 'admin@ecommerce.local' }],
    passphrase: 'dev_passphrase_change_me',
  });

  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Helper to escape newlines for .env
  const formatKey = (key) => key.replace(/\n/g, '\\n');

  const pgpConfigs = `
# PGP Encryption Keys (Generated at ${new Date().toISOString()})
PGP_PUBLIC_KEY="${formatKey(publicKey)}"
PGP_PRIVATE_KEY="${formatKey(privateKey)}"
PGP_PASSPHRASE="dev_passphrase_change_me"
`;

  fs.appendFileSync(envPath, pgpConfigs);

  console.log('✅ PGP keys generated and appended to .env');
  console.log('⚠️ Remember to restart your services to apply the new environment variables.');
}

generateKeys().catch(console.error);
