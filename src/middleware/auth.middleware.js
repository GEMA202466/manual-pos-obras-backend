const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }

      req.userId = decoded.userId;
      req.userType = decoded.userType;

      return next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Falha na autenticação' });
  }
};

const checkUserType = (...allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.userType)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Você não tem permissão para acessar este recurso.' 
      });
    }
    next();
  };
};

module.exports = { authMiddleware, checkUserType };

