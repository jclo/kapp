/** ****************************************************************************
 *
 * Returns the avatar pictures.
 *
 * avatars.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . _load                       loads the avatar pictures,
 *
 *
 * Public Methods:
 *  . load                        returns the avatar pictures,
 *
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
const fs = require('fs')
    ;


// -- Local Modules


// -- Local Constants
const PATH  = './server/_kadmin/admin/dbi/_avatars/pictures'
    , HFILES = ['neutral', 'man-1', 'woman-1', 'man-2', 'man-3', 'woman-2', 'woman-3', 'woman-4']
    , HNAMES = ['neutral', 'man', 'woman', 'man alt 1', 'man alt 2', 'woman alt 1', 'woman alt 2', 'woman alt 3']
    , AFILES = ['lion', 'tiger-1', 'eagle-1', 'wolf', 'unicorn-1', 'tiger-2', 'tiger-3', 'eagle-2', 'unicorn-2', 'unicorn-3']
    , ANAMES = ['lion', 'tiger', 'eagle', 'wolf', 'unicorn', 'tiger alt 1', 'tiger alt 2', 'eagle alt 1', 'unicorn alt 1', 'unicorn alt 2']
    , SFILES = ['seed-1', 'seed-2', 'seed-3']
    , SNAMES = ['seed', 'seed alt 1', 'seed alt 2']
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Loads the avatar pictures.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Array}         returns the avatar pictures,
 * @since 0.0.0
 */
// function _load() {
//   const list = fs.readdirSync(PATH);
//
//   const avatars = [];
//   for (let i = 0; i < list.length; i++) {
//     avatars.push({
//       name: NAMES[i],
//       picture: fs.readFileSync(`${PATH}/${list[i]}`),
//     });
//   }
//   return avatars;
// }
function _load(type) {
  const avatars = [];
  let files
    , names
    ;

  switch (type) {
    case 'humans': files = HFILES; names = HNAMES; break;
    case 'animals': files = AFILES; names = ANAMES; break;
    case 'symbols': files = SFILES; names = SNAMES; break;
    default: throw new Error('You must specify a valid type!');
  }

  for (let i = 0; i < files.length; i++) {
    avatars.push({
      name: names[i],
      picture: fs.readFileSync(`${PATH}/${type}/${files[i]}.svg`),
    });
  }
  return avatars;
}


// -- Public Methods -----------------------------------------------------------

const Ava = {

  /**
   * Returns the avatar pictures.
   *
   * @method ()
   * @public
   * @param {}              -,
   * @return {Array}        returns the avatar pictures,
   * @since 0.0.0
   */
  load(type) {
    return _load(type);
  },
};


// -- Export
module.exports = Ava;
