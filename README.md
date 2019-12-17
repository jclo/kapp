# Kapp

Kapp is a boilerplate to build a slim Node.js App server that serves a web App and responds to api requests from the web App.


## Quick Startup

You need to create a folder that contains your project. Then, at the root level of your project, type:

```bash
npm install http://localhost/~dev/privatenpm/kapp/<version>/kapp.tgz
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

MIT.
