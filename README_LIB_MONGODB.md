# README

To test `server/libs/mongodb/main.js`, do the following:

`package.json`:
```bash
# replace
"test": "cross-env NODE_ENV=test nyc --reporter=lcov mocha ./test/main.js --exit",

#by
"test": "cross-env NODE_ENV=test nyc --reporter=lcov mocha ./test/_mdbmain.js --exit",
```

And you need a MongoDB server running with a `vulcain_test` database containing at least a `catalog` collection.


That's all!

-- oOo --
