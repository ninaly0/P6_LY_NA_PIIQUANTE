const Sauce = require('../models/Sauce_model');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  // on récupère la string sauce avec req.body.sauce, et on la parse en Object
  // JSON.parse transforme un objet stringifié en un objet JS exploitable
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject._id;

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    // req.protocol = http, req.get('host') récupère le port
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
    .then(() => res.status(201).json({ message: 'La sauce a bien été ajouté' }))
    .catch( error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
  //Est ce qu'on a reçu une image ? Si oui, on la remplace, si non, on garde la même image
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
  Sauce.updateOne({_id: req.params.id}, { sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'La sauce a été modifié' }))
    .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id}).then(
    (sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error("Il n'y a pas de sauce")
        });
      }
      // permet de vérifier si l'utilisateur connecté peut supprimer la sauce ou pas
      if(sauce.userId !== req.auth.userId) {
        return res.status(400).json({
          error: new Error("Vous n'êtes pas autorisée!")
        });
      }
      const filename = sauce.imageUrl.split('/images')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce a été supprimé' }))
        .catch(error => res.status(400).json({ error }))
      })
    }
  )
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json( sauce ))
    .catch(error => res.status(400).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json( sauces ))
    .catch(error => res.status(400).json({ message: "echec" }));
}
