// ESLint declarations:
/* global describe, it */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0 */


// -- Vendor Modules
const { expect } = require('chai')
    ;

// -- Local Modules
const Radio = require('../../server/libs/radio/main');


// -- Local Constants


// -- Local Variables


// -- Main section -
module.exports = () => {
  describe('Test the Radio lib:', () => {
    it('Expects Radio._db to be an object.', () => {
      expect(Radio._db).to.be.an('object');
    });

    // Test listeners:
    it('Expects "Radio.listen("channel:test1" ..." to insert the property "channel:test1" to Radio._db.', () => {
      Radio.listen('channel:test1', () => {});
      expect(Radio._db).to.own.property('channel:test1');
    });

    it('Expects "channel:test1" to own two properties.', () => {
      expect(Object.keys(Radio._db['channel:test1'])).to.be.an('array').that.has.lengthOf(2);
    });

    it('Expects "channel:test1" to own the property "listeners" that is an array.', () => {
      expect(Radio._db['channel:test1']).to.own.property('listeners').that.is.an('array');
    });
    it('Expects this array to have one element.', () => {
      expect(Radio._db['channel:test1'].listeners).to.have.lengthOf(1);
    });
    it('Expects this this element to be a function.', () => {
      expect(Radio._db['channel:test1'].listeners[0]).to.be.a('function');
    });

    it('Expects "channel:test1" to own the property "listenersOnce" that is an empty array.', () => {
      expect(Radio._db['channel:test1']).to.own.property('listenersOnce').that.is.an('array').that.has.lengthOf(0);
    });

    let listen2;
    it('Expects "Radio.listen("channel:test2" ..." to insert the property "channel:test2" to Radio._db.', () => {
      listen2 = function() {};
      Radio.listen('channel:test2', listen2);
      expect(Radio._db).to.own.property('channel:test2');
    });

    it('Expects "Radio.unlisten("channel:test2" ..." to empty "listeners" array.', () => {
      Radio.unlisten('channel:test2', listen2);
      expect(Radio._db['channel:test2']).to.own.property('listeners').that.is.an('array').that.has.lengthOf(0);
    });

    it('Expects "Radio.publish("channel:test3", "Hi!")" to send the message "Hi!" to the listener.', () => {
      let message;
      Radio.listen('channel:test3', (res) => {
        message = res;
      });
      Radio.publish('channel:test3', 'Hi!');
      expect(message).to.be.a('string').that.is.equal('Hi!');
    });

    it('Expects "Radio.publish("channel:test4", "Hi!")" to send the message "Hi!" to the listeners.', () => {
      let message = '';
      Radio.listen('channel:test4', (res) => {
        message += res;
      });
      Radio.listen('channel:test4', (res) => {
        message += res;
      });
      Radio.publish('channel:test4', 'Hi!');
      expect(message).to.be.a('string').that.is.equal('Hi!Hi!');
    });


    // Test listenersOnce:
    it('Expects "Radio.listenOnce("channel:test10" ..." to add one function to "listenersOnce".', () => {
      Radio.listenOnce('channel:test10', () => {});
      expect(Radio._db['channel:test10']).to.own.property('listeners').that.is.an('array').that.has.lengthOf(0);
      expect(Radio._db['channel:test10']).to.own.property('listenersOnce').that.is.an('array').that.has.lengthOf(1);
      expect(Radio._db['channel:test10'].listenersOnce[0]).to.be.a('function');
    });

    it('Expects "Radio.publish("channel:test10", "Hi!")" to send the message "Hi!" to the listenerOnce.', () => {
      let message;
      Radio.listenOnce('channel:test10', (res) => {
        message = res;
      });
      Radio.publish('channel:test10', 'Hi!');
      expect(message).to.be.a('string').that.is.equal('Hi!');
    });

    it('Expects "channel:test10" to have "listeners" and "listenerOnce" empty.', () => {
      expect(Radio._db['channel:test10']).to.own.property('listeners').that.is.an('array').that.has.lengthOf(0);
      expect(Radio._db['channel:test10']).to.own.property('listenersOnce').that.is.an('array').that.has.lengthOf(0);
    });

    it('Expects "Radio.publish("channel:test11", "Hi!")" to send the message "Hi!" to the listenersOnce.', () => {
      let message = '';
      Radio.listenOnce('channel:test11', (res) => {
        message += res;
      });
      Radio.listenOnce('channel:test11', (res) => {
        message += res;
      });
      Radio.publish('channel:test11', 'Hi!');
      expect(message).to.be.a('string').that.is.equal('Hi!Hi!');
    });

    it('Expects "Radio.unlisten("channel:test12" ..." to empty "listenersOnce" array.', () => {
      function listen() {}
      Radio.listenOnce('channel:test12', listen);
      Radio.unlisten('channel:test12', listen);
      expect(Radio._db['channel:test12']).to.own.property('listenersOnce').that.is.an('array').that.has.lengthOf(0);
    });


    // Test aliases:
    it('Expects "Radio.fire("channel:test20", "Hi!")" to send the message "Hi!" to the listener.', () => {
      let message = '';
      Radio.on('channel:test20', (res) => {
        message += res;
      });
      Radio.one('channel:test20', (res) => {
        message += res;
      });
      Radio.fire('channel:test20', 'Hi!');
      expect(message).to.be.a('string').that.is.equal('Hi!Hi!');
    });

    it('Expects "Radio.off("channel:test21" ..." to empty "listenersOnce" array.', () => {
      function listen() {}
      Radio.one('channel:test21', listen);
      Radio.off('channel:test21', listen);
      expect(Radio._db['channel:test21']).to.own.property('listenersOnce').that.is.an('array').that.has.lengthOf(0);
    });

    it('Expects "Radio.fire(123, "Hi!")" not to fire anything.', () => {
      let message = '';
      Radio.on(123, (res) => {
        message += res;
      });
      Radio.one(123, (res) => {
        message += res;
      });
      Radio.fire(123, 'Hi!');
      expect(message).to.be.a('string').that.is.equal('');
    });

    it('Expects "Radio.off(456 ..." not to do anything.', () => {
      function listen() {}
      Radio.listen(456, listen);
      Radio.unlisten(456, listen);
      expect(Radio._db[456]).to.be.an('undefined');
    });
  });
};
