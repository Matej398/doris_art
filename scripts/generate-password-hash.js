#!/usr/bin/env node

/**
 * Generate a bcrypt password hash for the admin panel
 *
 * Usage: node scripts/generate-password-hash.js <password>
 *
 * Then add the output to your .env.local file as:
 * ADMIN_PASSWORD_HASH=<the generated hash>
 */

const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.js <password>');
  console.error('Example: node scripts/generate-password-hash.js mysecretpassword');
  process.exit(1);
}

bcrypt.hash(password, 12, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }

  // Escape $ characters for .env files
  const escapedHash = hash.replace(/\$/g, '\\$');

  console.log('\nGenerated password hash:\n');
  console.log(hash);
  console.log('\nAdd this to your .env.local file ($ escaped for dotenv):');
  console.log(`ADMIN_PASSWORD_HASH=${escapedHash}`);
  console.log('\nAlso add a session secret (32+ random characters):');
  console.log(`ADMIN_SESSION_SECRET=${require('crypto').randomBytes(32).toString('hex')}`);
});
