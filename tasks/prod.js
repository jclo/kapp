// ESLint declarations:
/* eslint one-var: 0, semi-style: 0 */


// -- Vendor Modules
const shell = require('shelljs');


// -- Local Modules


// -- Local Constants
const PK = './package.json';


// -- Local Variables


// -- Public -------------------------------------------------------------------

const prod = process.argv[2];

const json = shell.cat(PK);
const pk = JSON.parse(json.stdout);
const npk = { ...pk };

npk.scripts = {};
npk.scripts.general = pk.scripts.general;
npk.scripts.start = pk.scripts.start;
npk.scripts.kustart = pk.scripts.kustart;

npk.bin = {};
npk.repository = {};
npk.keywords = [];
npk.author = {};
npk.bugs = {};

// Optional.
// (if you need to start the app with kustart in prod,
// uncomment the next two lines)
// npk.dependencies['cross-env'] = pk.devDependencies['cross-env'];
// npk.dependencies['js-yaml'] = pk.devDependencies['js-yaml'];
npk.devDependencies = {};

process.stdout.write('  updated package.json\n');
json.stdout = JSON.stringify(npk, null, 2);
json.to(`./${prod}/package.json`);


// -- oOo ---
