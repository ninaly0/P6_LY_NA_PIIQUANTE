const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String },
  manufacturer: { type: String },
  description: { type: String },
  mainPepper: { type: String },
  imageUrl: { type: String },
  heat: { type: Number },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array }, // les identifiants des gens qui ont aimé la sauce
  usersDisliked: { type: Array } // les identifiants des gens qui n'ont pas aimé la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);
