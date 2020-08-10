# Kapp

[![NPM version][npm-image]][npm-url]
[![GitHub last commit][commit-image]][commit-url]
[![Travis CI][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependencies status][dependencies-image]][dependencies-url]
[![Dev Dependencies status][devdependencies-image]][devdependencies-url]
[![License][license-image]](LICENSE.md)

Kapp is a boilerplate to build a slim Node.js App server that serves a web App and responds to api requests from the web App.


## Quick Startup

You need to create a folder that contains your project. Then, at the root level of your project, type:

```bash
npm install @mobilabs/kapp
```

Once installed, type:

```bash
./node_modules/.bin/kapp create -n <name_of_your_app>
```

It populates your project with a minimal Node.js server. When it is done, type:

```bash
npm install
```

And finally:

```bash
npm run app
```

The file `public/index.html` is displayed in your browser at the address `http://localhost:1080`.

That's all.


## License

[MIT](LICENSE.md).

<!--- URls -->

[npm-image]: https://img.shields.io/npm/v/@mobilabs/kapp.svg?style=flat-square
[release-image]: https://img.shields.io/github/release/jclo/kapp.svg?include_prereleases&style=flat-square
[commit-image]: https://img.shields.io/github/last-commit/jclo/kapp.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/jclo/kapp.svg?style=flat-square
[coveralls-image]: https://img.shields.io/coveralls/jclo/kapp/master.svg?style=flat-square
[dependencies-image]: https://david-dm.org/jclo/kapp/status.svg?theme=shields.io
[devdependencies-image]: https://david-dm.org/jclo/kapp/dev-status.svg?theme=shields.io
[npm-bundle-size-image]: https://img.shields.io/bundlephobia/minzip/@mobilabs/kapp.svg?style=flat-square
[license-image]: https://img.shields.io/npm/l/@mobilabs/kapp.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/@mobilabs/kapp
[release-url]: https://github.com/jclo/kapp/tags
[commit-url]: https://github.com/jclo/kapp/commits/master
[travis-url]: https://travis-ci.org/jclo/kapp
[coveralls-url]: https://coveralls.io/github/jclo/kapp?branch=master
[dependencies-url]: https://david-dm.org/jclo/kapp
[devdependencies-url]: https://david-dm.org/jclo/kapp?type=dev
[license-url]: http://opensource.org/licenses/MIT
[npm-bundle-size-url]: https://img.shields.io/bundlephobia/minzip/@mobilabs/kapp
