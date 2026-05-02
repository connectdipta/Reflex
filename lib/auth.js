import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'reflex_super_secret_jwt_key_2024';

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check cookies
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const tokenCookie = cookieHeader
      .split(';')
      .find((c) => c.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1].trim();
    }
  }

  return null;
}
