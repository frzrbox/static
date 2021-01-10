const flexGapPolyfill = require('flex-gap-polyfill');
const autoprefixer = require('autoprefixer');
const easyImport = require('postcss-easy-import');
const flexboxFixes = require('postcss-flexbugs-fixes');

module.exports = {
  // Keep easyImport first in the array
  plugins: [easyImport, autoprefixer, flexboxFixes, flexGapPolyfill],
};