const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify( token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    // on récupère le userId du token pour pouvoir le comparer dans le delete Sauce
    req.auth = { userId }
    if (req.body.userId && req.body.userId !== userId) {
      throw "L'Id de l'utilisateur est non valable";
    } else {
      next();
    }
  } catch(error) {
    res.status(401).json({ error: error | 'Requête non identifié' })
  }
};
