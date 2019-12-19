#!/usr/bin/env node
/* *****************************************************************************
 * kapp.js creates an App Server.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 jclo <jclo@mobilabs.fr> (http://www.mobilabs.fr)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ************************************************************************** */
/* eslint one-var: 0,semi-style: 0, no-underscore-dangle: 0 */

// -- Node modules
const fs           = require('fs')
    , nopt         = require('nopt')
    , path         = require('path')
    , shell        = require('shelljs')
    ;


// -- Local modules

// -- Local constants
const thisscript  = 'kapp'
    /* eslint-disable-next-line object-curly-newline */
    , author = { name: 'John Doe', acronym: 'jdo', email: 'jdo@johndoe.com', url: 'http://www.johndoe.com' }
    , copyright   = 'Copyright (c) 2019 {{author:name}} <{{author:email}}> ({{author:url}})'
    , baseapp     = process.cwd()
    , basemodel   = __dirname.replace('/bin', '')
    , { version } = require('../package.json')
    , publicdir   = 'public'
    , serverdir   = 'server'
    , test        = 'test'
    , tasks       = 'tasks'
    // Command line Options
    , opts = {
      help: [Boolean, false],
      version: [String, null],
      path,
      name: [String, null],
    }
    , shortOpts = {
      h: ['--help'],
      v: ['--version', version],
    }
    , parsed = nopt(opts, shortOpts, process.argv, 2)
    ;

// -- Templates
const readme = [
  '# {{lib:name}}',
  ' ',
  'Bla bla ...',
  ' ',
  '## License',
  ' ',
  'MIT.',
  '',
].join('\n');

const license = [
  'The MIT License (MIT)',
  '',
  '{{lib:copyright}}',
  '',
  'Permission is hereby granted, free of charge, to any person obtaining a copy',
  'of this software and associated documentation files (the "Software"), to deal',
  'in the Software without restriction, including without limitation the rights',
  'to use, copy, modify, merge, publish, distribute, sublicense, and/or sell',
  'copies of the Software, and to permit persons to whom the Software is',
  'furnished to do so, subject to the following conditions:',
  '',
  'The above copyright notice and this permission notice shall be included in',
  'all copies or substantial portions of the Software.',
  '',
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
  'IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,',
  'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE',
  'AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER',
  'LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,',
  'OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN',
  'THE SOFTWARE.',
  '',
].join('\n');

const changelog = [
  '### HEAD',
  '',
  '### 0.0.0 (Month Day, Year)',
  '',
  '  * Initial build.',
  ''].join('\n');

const gitignore = '';
const eslintignore = '';


// -- Local variables


// -- Private functions --------------------------------------------------------

/**
 * Dispays the help message.
 *
 * @function ()
 * @private
 * @param {}           -,
 * @returns {}         -,
 * @since 0.0.0
 */
function _help() {
  const message = ['',
    'Usage: command [options]',
    '',
    'create             creates the App Server',
    '',
    'Options:',
    '',
    '-h, --help         output usage information',
    '-v, --version      output the version number',
    '',
  ].join('\n');

  process.stdout.write(`${message}\n`);
  process.exit(0);
}

/**
 * Dispays the howto message.
 *
 * @function ()
 * @private
 * @param {}           -,
 * @returns {}         -,
 * @since 0.0.0
 */
function _usage() {
  const message = ['',
    'Congratulations you have created your Kapp\'s App Server!',
    '',
    'Before you can run it, execute the commands:',
    '  . npm install (it installs the project dependencies),',
    '',
    'Ok it\'s done! Now you are ready to launch your App Server by typing:',
    '  . npm run app.',
    '',
    'That\'s all!',
  ].join('\n');

  process.stdout.write(`${message}\n`);
}

/**
 * Removes the cached files and returns the array.
 *
 * @function (arg1)
 * @private
 * @param {Array}     an array of files,
 * @returns {Array}   returns the filtered array,
 */
function _filter(files) {
  const filtered = []
    ;

  for (let i = 0; i < files.length; i++) {
    if (!files[i].match(/^\./)) {
      filtered.push(files[i]);
    }
  }

  return filtered;
}

/**
 * Checks if the application folder is empty.
 *
 * @function (arg1)
 * @private
 * @param {String}          the folder path,
 * @returns {Boolean}       returns true if empty,
 */
function _isFolderEmpty(folder) {
  const authFiles = ['etc', 'package.json', 'package-lock.json', 'node_modules'];

  let files = _filter(fs.readdirSync(folder));
  files = files.filter((file) => authFiles.indexOf(file) === -1);
  return !files.length;
}

/**
 * Creates the App skeleton.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {String}          the source path,
 * @param {String}          the App name,
 * @param {Object}          the author credentials,
 * @param {String}          the copyright text,
 * @returns {}              -,
 */
function _addSkeleton(base, app, owner, cright) {
  const newFiles = [
    [readme, license, changelog, gitignore, eslintignore],
    ['README.md', 'LICENSE.md', 'CHANGELOG.md', '.gitignore', '.eslintignore'],
  ];

  let input;
  let s;
  for (let i = 0; i < newFiles[0].length; i++) {
    input = newFiles[0][i]
      .replace('{{lib:name}}', app)
      .replace('{{lib:lowname}}', app.toLowerCase())
      .replace('{{lib:copyright}}', cright)
      .replace('{{author:name}}', owner.name)
      .replace('{{author:email}}', owner.email)
      .replace('{{author:url}}', owner.url)
    ;

    process.stdout.write(`  added ${newFiles[1][i]}\n`);
    s = new shell.ShellString(input);
    s.to(`${base}/${newFiles[1][i]}`);
  }
}

/**
 * Duplicates generic files.
 *
 * @function (arg1, arg2)
 * @private
 * @param {String}          the source path,
 * @param {String}          the destination path,
 * @returns {}              -,
 */
function _duplicate(source, dest) {
  const dupFiles = ['.eslintrc', '.travis.yml'];

  for (let i = 0; i < dupFiles.length; i++) {
    process.stdout.write(`  copied ${dupFiles[i]}\n`);
    shell.cp(`${source}/${dupFiles[i]}`, `${dest}/.`);
  }
}

/**
 * Customizes 'Package.json'.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {String}          the source path,
 * @param {String}          the destination path,
 * @param {Object}          the author credentials,
 * @returns {}              -,
 */
function _customize(source, dest, app, owner) {
  const npm = 'package.json';

  const json = shell.cat(`${source}/${npm}`);
  const obj = JSON.parse(json.stdout);

  const pack = {};
  pack.name = app.toLowerCase();
  pack.version = '0.0.0';
  pack.description = `${app} ...`;
  pack.main = '';
  pack.bin = {};
  pack.scripts = obj.scripts;
  pack.repository = obj.repository;
  pack.repository.url = `https://github.com/${owner.acronym}/${app.toLowerCase()}.git`;
  pack.keywords = [];
  pack.author = obj.author;
  pack.author.name = owner.name;
  pack.author.email = owner.email;
  pack.author.url = owner.url;
  pack.license = obj.license;
  pack.bugs = obj.bugs;
  pack.bugs.url = `https://github.com/${owner.acronym}/${app.toLowerCase()}/issues`;
  pack.homepage = `https://github.com/${owner.acronym}/${app.toLowerCase()}`;
  pack.dependencies = obj.dependencies;
  pack.devDependencies = obj.devDependencies;
  pack.publishConfig = obj.publishConfig;
  pack.private = obj.private;
  pack.husky = obj.husky;

  delete pack.scripts.makeprivate;
  delete pack.dependencies.nopt;
  delete pack.dependencies.path;
  delete pack.dependencies.shelljs;

  process.stdout.write(`  updated ${npm}\n`);
  json.stdout = JSON.stringify(pack, null, 2);
  json.to(`${baseapp}/${npm}`);
}

/**
 * Fills the public folder.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {String}          the source path,
 * @param {String}          the destination path,
 * @param {String}          the destination folder,
 * @returns {}              -,
 */
function _addPublic(source, dest, folder) {
  shell.mkdir('-p', `${dest}/${folder}`);

  process.stdout.write(`  duplicated the contents of ${folder}\n`);
  shell.cp('-r', `${source}/${folder}/*`, `${dest}/${folder}/.`);
}

/**
 * Adds the test files.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {String}          the source path,
 * @param {String}          the destination path,
 * @param {String}          the destination folder,
 * @returns {}              -,
 */
function _addTest(source, dest, folder) {
  const exclude = [];

  process.stdout.write(`  duplicated the contents of ${folder}\n`);
  shell.mkdir('-p', `${dest}/${folder}`);
  shell.cp('-r', `${source}/${folder}/*`, `${dest}/${folder}/.`);

  for (let i = 0; i < exclude.length; i++) {
    shell.rm('-f', `${dest}/${folder}/${exclude[i]}`);
  }
}

/**
 * Adds the server files.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @private
 * @param {String}          the source path,
 * @param {String}          the destination path,
 * @param {String}          the destination folder,
 * @param {String}          the name of the app,
 * @returns {}              -,
 */
function _addServer(source, dest, folder, app) {
  process.stdout.write(`  duplicated the contents of ${folder}\n`);
  shell.mkdir('-p', `${dest}/${folder}`);

  shell.cp('-r', `${source}/${folder}/*`, `${dest}/${folder}/.`);
  shell.rm(`${dest}/${folder}/ssl/*.pem`);

  // Replace '{{app:name}}' by 'app' to app.js and start.js:
  shell.sed('-i', '{{app:name}}', app, `${dest}/${folder}/app.js`);
  shell.sed('-i', '{{app:name}}', app, `${dest}/${folder}/start.js`);

  shell.sed('-i', '{{kapp:version}}', version, `${dest}/${folder}/api/system.js`);
}

/**
 * Creates the API Server.
 *
 * @function ()
 * @private
 * @param {}           -,
 * @returns {}         -,
 * @since 0.0.0
 */
function _create(options) {
  const app = options.name || 'myApp';

  const resp = _isFolderEmpty(baseapp);
  if (!resp) {
    process.stdout.write('This folder already contains files and/or folders. Clean it up first! Process aborted...\n');
    process.exit(1);
  }

  // Create README.md, LICENSE.md, CHANGELOG.md, etc.:
  process.stdout.write('Ok, the folder is empty\n');
  _addSkeleton(baseapp, app, author, copyright);

  // Copy files:
  _duplicate(basemodel, baseapp);

  // Add and customize package.json:
  _customize(basemodel, baseapp, app, author);

  // Copy Public folder:
  _addPublic(basemodel, baseapp, publicdir);

  // Copy Server folder:
  _addServer(basemodel, baseapp, serverdir, app);

  // Add tasks:
  // none,

  // Copy Test Files:
  _addTest(basemodel, baseapp, test);

  _usage();
  //
}


// -- Where the script starts --------------------------------------------------

if (parsed.help) {
  _help();
}

if (parsed.version) {
  process.stdout.write(`${thisscript} version: ${parsed.version}\n`);
  process.exit(0);
}

if (parsed.argv.remain[0] === 'create') {
  _create(parsed);
} else {
  _help();
}
