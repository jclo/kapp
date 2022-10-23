/** ****************************************************************************
 *
 * Listens for the users APIs.
 *
 * users.js is just a literal object that contains a set of functions.
 * It can't be instantiated.
 *
 * Private Functions:
 *  . none,
 *
 *
 * Public Function:
 *  . Users                                   starts listening for the calls,
 *
 *
 * GET Api(s):
 *  . /api/v1/admin/users/one/:id             returns the requested user,
 *  . /api/v1/admin/users/one/?query          returns the requested user,
 *  . /api/v1/admin/users/many?query          returns a list of users,
 *  . /api/v1/admin/users/count/?query        returns the number of valid users,
 *  . /api/v1/admin/users/username?query      returns if the username is taken,
 *
 *
 * POST Api(s):
 *  . /api/v1/admin/users/one                 adds or update an user,
 *  . /api/v1/admin/users/emails/one          adds or updates one user email,
 *
 *
 * DELETE Api(s):
 *  . /api/v1/admin/users/one/:id             deletes the requested user,
 *  . /api/v1/admin/users/one/?query          deletes the requested user,
 *  . /api/v1/admin/users/emails/one/:id      deletes the requested user email,
 *  . /api/v1/admin/users/emails/one/?query   deletes the requested user email,
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
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0,
  global-require: 0, import/no-dynamic-require: 0 */


// -- Vendor Modules
const KZlog = require('@mobilabs/kzlog')
    ;


// -- Local Modules
const config = require('../../../../../config')
    , MAuth  = require('../../../../../middlewares/auth/main')
    , CUse   = require('../../../controllers/v1/users')
    ;


// -- Local Constants
const { level } = config
    , log       = KZlog('_kadmin/admin/api/v1/admin/users.js', level, false)
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------
// none,


// -- Public -------------------------------------------------------------------

/**
 * Starts listening for the users APIs.
 *
 * @function (arg1, arg2, arg3)
 * @public
 * @param {Object}          the express.js app,
 * @param {Object}          the message translator,
 * @param {Object}          the db interface object,
 * @returns {}              -,
 * @since 0.0.0
 */
function Users(app, i18n, dbi, dbn) {
  // Gets the middleware that check if the client is
  // connected by opening a session through a login or by requesting
  // a token.
  const auth = MAuth(dbi, dbn);

  /**
   * GET api/v1/admin/users/one/:id
   * (returns the requested user)
   */
  app.get('/api/v1/admin/users/one/:id', auth, (req, res) => {
    CUse.getOne(dbi, dbn, req, req.params, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused GET api: "api/v1/admin/users/one/:id".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted GET api: "api/v1/admin/users/one/:id".');
        log.info(resp);
      }
    });
  });

  /**
   * GET api/v1/admin/users/one/?id=''&user_name=''
   * (returns the requested user)
   */
  app.get('/api/v1/admin/users/one', auth, (req, res) => {
    CUse.getOne(dbi, dbn, req, req.query, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused GET api: "api/v1/admin/users/one/?query".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted GET api: "api/v1/admin/users/one/?query".');
        log.info(resp);
      }
    });
  });

  /**
   * GET api/v1/admin/users/many?query
   * (returns a list of users from the defined offset)
   */
  app.get('/api/v1/admin/users/many', auth, (req, res) => {
    CUse.getMany(dbi, dbn, req, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused GET api: "api/v1/admin/users/many/?query".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted GET api: "api/v1/admin/users/list/?query".');
        log.info(resp);
      }
    });
  });

  /**
   * GET api/v1/admin/users/count:
   * (counts the number of items)
   */
  app.get('/api/v1/admin/users/count', auth, (req, res) => {
    CUse.count(dbi, dbn, req, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused GET api: "api/v1/admin/users/count/?query".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted GET api: "api/v1/admin/users/count/?query".');
        log.info(resp);
      }
    });
  });

  /**
   * GET /api/v1/admin/users/username?query:
   * (returns if the username is taken)
   */
  app.get('/api/v1/admin/users/username', auth, (req, res) => {
    CUse.isUsernameTaken(dbi, dbn, req, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused GET api: "api/v1/admin/users/username/?query".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted GET api: "api/v1/admin/users/username/?query".');
        log.info(resp);
      }
    });
  });

  /**
   * POST api/v1/admin/users/one
   * (adds or update an user)
   */
  app.post('/api/v1/admin/users/one', auth, (req, res) => {
    CUse.addOrUpdateOne(dbi, dbn, req, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused POST api: "api/v1/admin/users/one".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted POST api: "api/v1/admin/users/one".');
        log.info(resp);
      }
    });
  });

  /**
   * POST api/v1/admin/users/emails/one
   * (adds or updates an email)
   */
  app.post('/api/v1/admin/users/emails/one', auth, (req, res) => {
    CUse.addOrUpdateEmailsOne(dbi, dbn, req, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused POST api: "api/v1/admin/users/emails/one".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted POST api: "api/v1/admin/users/emails/one".');
        log.info(resp);
      }
    });
  });

  /**
   * DELETE api/v1/admin/users/one/:id
   * (deletes an user)
   */
  app.delete('/api/v1/admin/users/one/:id', auth, (req, res) => {
    CUse.deleteOne(dbi, dbn, req, req.params, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused DELETE api: "api/v1/admin/users/one/:id".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted DELETE api: "api/v1/admin/users/one/:id".');
        log.info(resp);
      }
    });
  });

  /**
   * DELETE api/v1/admin/users/one/?id=''
   * (deletes an user)
   */
  app.delete('/api/v1/admin/users/one', auth, (req, res) => {
    CUse.deleteOne(dbi, dbn, req, req.query, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused DELETE api: "api/v1/admin/users/one/?query".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted DELETE api: "api/v1/admin/users/one/?query".');
        log.info(resp);
      }
    });
  });

  /**
   * DELETE api/v1/admin/users/many/?ids=''
   * (deletes many users)
   */
  app.delete('/api/v1/admin/users/many', auth, (req, res) => {
    CUse.deleteMany(dbi, dbn, req, req.query, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused DELETE api: "api/v1/admin/users/many/?ids=x,y,z".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted DELETE api: "api/v1/admin/users/many/?ids=x,y,z".');
        log.info(resp);
      }
    });
  });

  /**
   * DELETE api/v1/admin/users/emails/one/:id
   * (deletes an user email)
   */
  app.delete('/api/v1/admin/users/emails/one/:id', auth, (req, res) => {
    CUse.deleteEmailsOne(dbi, dbn, req, req.params, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused DELETE api: "api/v1/admin/users/emails/one/:id".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted DELETE api: "api/v1/admin/users/emails/one/:id".');
        log.info(resp);
      }
    });
  });

  /**
   * DELETE api/v1/admin/users/emails/one/?id=''
   * (deletes an user email)
   */
  app.delete('/api/v1/admin/users/emails/one', auth, (req, res) => {
    CUse.deleteEmailsOne(dbi, dbn, req, req.query, (err, resp) => {
      if (err) {
        res.statusMessage = err;
        res.status(401).send(err);
        log.trace('Refused DELETE api: "api/v1/admin/users/emails/one".');
        log.info(err);
      } else {
        res.status(200).send(resp);
        log.trace('Accepted DELETE api: "api/v1/admin/users/emails/one".');
        log.info(resp);
      }
    });
  });
}


// -- Export
module.exports = Users;
