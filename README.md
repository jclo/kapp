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

You can easily get your first Kapp Server running in a couple of minutes by just typing a few command lines. But first, you need to create an empty folder. It will contain your project.

Then, you just need to create a `package.json` file that contains:

```json
{
  "name": "NameOfYourProject",
  "scripts": {
    "create": "npm install @mobilabs/kapp && npm run populate",
    "populate": "kapp populate --name ${npm_package_name} --author \"${npm_package_writer_name}\" --acronym ${npm_package_writer_acronym} --email ${npm_package_writer_email} --url ${npm_package_writer_url} && npm install"
  },
  "writer": {
    "name": "John Doe",
    "acronym": "jdo",
    "email": "jdo@johndoe.com",
    "url": "http://www.johndoe.com/"
  }
}
```
Replace `NameOfYourProject` by your project name and fill `writer` with your credentials.

And finally, type in the terminal:

```bash
npm run create.
```

Your project is almost ready. As, Kapp relies on `https`, you have to add your certificates in the folder `server/ssl` or you can disable `https` (not recommended) in `server/config.js`.

Now you can starts your server by typing:

```bash
npm run app
```

### Access through a browser

Open your browser and connect to your server with the url `http://localhost:1080` or `https://localhost:1443`.


### Through Node.js

Open a terminal and type:

```bash
node test/test.js
```


### Through Curl

Open a terminal and type:

```bash
sh test/curl.sh
```

or:

```bash
sh test/login.sh
```

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
[travis-url]: https://travis-ci.com/jclo/kapp
[coveralls-url]: https://coveralls.io/github/jclo/kapp?branch=master
[dependencies-url]: https://david-dm.org/jclo/kapp
[devdependencies-url]: https://david-dm.org/jclo/kapp?type=dev
[license-url]: http://opensource.org/licenses/MIT
[npm-bundle-size-url]: https://img.shields.io/bundlephobia/minzip/@mobilabs/kapp
