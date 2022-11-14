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
const npk = JSON.parse(json.stdout);

npk.scripts.start = npk.scripts.app;

delete npk.scripts.app;
delete npk.scripts.test;
delete npk.scripts['display-coverage'];
delete npk.scripts['check-coverage'];
delete npk.scripts['report-coverage'];
delete npk.scripts.report;
delete npk.scripts.makeprod;
delete npk.scripts.prepare;
delete npk.scripts.doc;
delete npk.nyc;
npk.devDependencies = {};

process.stdout.write('  updated package.json\n');
json.stdout = JSON.stringify(npk, null, 2);
json.to(`./${prod}/package.json`);


// -- oOo ---
