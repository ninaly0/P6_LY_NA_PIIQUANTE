const multer = require('multer');

const MIME_TYPE = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// muler.diskStorage configure le chemin et le nom de l'image à enregistrer
const storage = multer.diskStorage({
  // on dit a multer d'enregistrer les images dans le dossier /images
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  // on dit a multer de sauvegarder le nom du fichier d'origine avec extension
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPE[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
})

module.exports = multer({ storage }).single('image');
