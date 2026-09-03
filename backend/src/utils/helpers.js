const crypto = require('crypto');

// wraps async route handlers so errors go to express error handler
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// generates a random password for newly created admin accounts
function generateRandomPassword(length = 12) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // skip I/O, easy to confuse
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*';
  const all = upper + lower + digits + symbols;

  const pick = (charset) => charset[crypto.randomInt(0, charset.length)];

  const chars = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  for (let i = chars.length; i < length; i += 1) {
    chars.push(pick(all));
  }

  // shuffle so the fixed positions above aren't predictable
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

module.exports = { asyncHandler, generateRandomPassword };
