const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User_model');

exports.signup = (req, res, next) => {
  // crypte le mdp
  bcrypt.hash(req.body.password, 10)
      // prendre ce nouveau mdp créé et qui va l'injecter dans ce nouveau user
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // Enregistrement de l'utilisateur user dans la base de données
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
  // on récupère l'utilisateur de la base qui correspond à l'email entré par l'user
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        return res.status(401).json({ message: "Nom d'utilisateur incorrect" })
      }
      // on compare le mot de passe entré dans le champ et le mot de passe dans la base de donnée
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // si la comparaison n'est pas bonne, on renvoie une erreur
          if (!valid) {
            return res.status(401).json({ error: "Le mot de passe est erroné" });
          }
          // si la comparaison est bonne, on renvoie le user id et le token
          return res.status(201).json({
            userId: user.id,
            token: jwt.sign(
              { userId: user._id},
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h'}
            )
          });
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}
