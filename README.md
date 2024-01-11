# KApp

[![NPM version][npm-image]][npm-url]
[![GitHub last commit][commit-image]][commit-url]
[![Github workflow][ci-image]][ci-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![License][license-image]](LICENSE.md)

**KApp** is a boilerplate to build a slim Node.js App server that serves a web App and responds to api requests from the web App.


## Quick Startup

You can easily get your first **KApp Server** running in a couple of minutes by just typing a few command lines. But first, you need to create an empty folder. It will contain your project.

Then, you just need to create a **package.json** file that contains:

```json
{
  "name": "NameOfYourProject",
  "scripts": {
    "create": "npm install @mobilabs/kapp && npm run populate",
    "populate": "kapp populate --name $npm_package_name --author $npm_package_config_name --acronym $npm_package_config_acronym --email $npm_package_config_email --url $npm_package_config_url && npm install"
  },
  "config": {
    "name": "John Doe",
    "acronym": "jdo",
    "email": "jdo@johndoe.com",
    "url": "http://www.johndoe.com/"
  }
}
```
Replace **NameOfYourProject** by your project name and fill **config** with your credentials.

And finally, type in the terminal:

```bash
npm run create.
```

Your project is almost ready. As, **KApp** relies on **https**, you have to add your certificates in the folder **server/ssl** or you can disable **https** (not recommended) in **server/config.js**.

Now you can starts your server by typing:

```bash
npm run app
```

### Access through a browser

Open your browser and connect to your server with the url **http://localhost:1080** or **https://localhost:1443**.


### Through Node.js

Open a terminal and type:

```bash
node examples/node/test.js
```


### Through Curl

Open a terminal and type:

```bash
sh examples/curl/curl.sh
```

or:

```bash
sh examples/curl/curl_cookie_login.sh
```

## Extend KApp

You can easily add new **APIs** to **KApp** by filling the **_custom** folder.

The `_custom/api` folder contains your new **APIs**, the folder **_custom/controllers** contains the **APIs** implementation and the **_custom/dbi** folder contains the methods to fill/read the **database**.


That's all.


## License

[MIT](LICENSE.md).

<!--- URls -->

[npm-image]: https://img.shields.io/npm/v/@mobilabs/kapp.svg?logo=npm&logoColor=fff&label=NPM+package
[release-image]: https://img.shields.io/github/release/jclo/kapp.svg?include_prereleases
[commit-image]: https://img.shields.io/github/last-commit/jclo/kapp.svg?logo=github
[ci-image]: https://github.com/jclo/kapp/actions/workflows/ci.yml/badge.svg
[coveralls-image]: https://img.shields.io/coveralls/jclo/kapp/master.svg?&logo=coveralls
[npm-bundle-size-image]: https://img.shields.io/bundlephobia/minzip/@mobilabs/kapp.svg
[license-image]: https://img.shields.io/npm/l/@mobilabs/kapp.svg

[npm-url]: https://www.npmjs.com/package/@mobilabs/kapp
[release-url]: https://github.com/jclo/kapp/tags
[commit-url]: https://github.com/jclo/kapp/commits/master
[ci-url]: https://github.com/jclo/kapp/actions/workflows/ci.yml
[coveralls-url]: https://coveralls.io/github/jclo/kapp?branch=master
[npm-bundle-size-url]: https://img.shields.io/bundlephobia/minzip/@mobilabs/kapp
[license-url]: http://opensource.org/licenses/MIT


-- oOo ---
