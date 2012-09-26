
goog.provide('bidsy.Client');
goog.provide('bidsy.Client.EventType');

goog.require('goog.events');
goog.require('goog.events.EventTarget');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 * @export
 */
bidsy.Client = function() {
  goog.base(this);
};
goog.inherits(bidsy.Client, goog.events.EventTarget);
goog.addSingletonGetter(bidsy.Client);
goog.exportSymbol('bidsy.Client.getInstance', bidsy.Client.getInstance);


/**
 * Establishes a connection to the socket.io server.
 * @param {string} env One of 'dev' or 'prod'.
 * @export
 */
bidsy.Client.prototype.init = function(env) {
  /**
   * @type {io.SocketNamespace}
   * @private
   */
  this.socket_ = io.connect(
      'http://' +
      (env.replace(/\s+/, '') == 'prod' ? 'staging.auctet.com' : 'localhost')
    , { 'sync disconnect on unload': true }
  );

  this.socket_.on('bid', goog.bind(this.onBid_, this));
  this.socket_.on('userDeltas', goog.bind(this.onUserDeltas_, this));
  this.socket_.on('whoami', goog.bind(this.onWhoami_, this));
};


/**
 * @param {Object} data The newly entered bid.
 * @param {Function} callback The function to execute when we get server ACK.
 */
bidsy.Client.prototype.bid = function(data, callback) {
  this.socket_.emit('bid', data, callback);
};


/**
 * Writes a new auction to the database.
 * @param {Object} data The new auction.
 * @param {Function} callback A function to call once we get a response.
 */
bidsy.Client.prototype.createAuction = function(data, callback) {
  data['expiration'] = this.parseExpiration_(data['duration']);
  this.socket_.emit('createAuction', data, callback);
};


/**
 * Deletes an existing auction from the database.
 * @param {Object} data Attributes identifying the auction to be deleted.
 * @param {Function} callback A function to call once we get a response.
 */
bidsy.Client.prototype.deleteAuction = function(data, callback) {
  // TODO(gareth)
  // this.socket_.emit('deleteAuction', data, callback);
};


/**
 * Edits an existing auction in the database.
 * @param {Object} data A delta to apply to the auction.
 * @param {Function} callback A function to call once we get a response.
 */
bidsy.Client.prototype.editAuction = function(data, callback) {
  // TODO(gareth)
  // this.socket_.emit('editAuction', data, callback);
};


/**
 * Tell the server that we're joining a room.
 * @param {Object} data Attributes identifying the room we're joining.
 * @param {Function} callback A function to call once we get a response.
 */
bidsy.Client.prototype.joinRoom = function(data, callback) {
  this.socket_.emit('joinRoom', data, callback);
};


/**
 * @param {Object} data A new bid in a room we're listening to.
 * @private
 */
bidsy.Client.prototype.onBid_ = function(data) {
  this.dispatchEvent({
      type: bidsy.Client.EventType.BID
    , data: data
  });
};


/**
 * @param {Array} data The collection of user delta objects.
 * @private
 */
bidsy.Client.prototype.onUserDeltas_ = function(data) {
  this.dispatchEvent({
      type: bidsy.Client.EventType.USER_DELTAS
    , data: data
  });
};


/**
 * @param {Object} data Data on the current logged in user.
 * @private
 */
bidsy.Client.prototype.onWhoami_ = function(data) {
  this.dispatchEvent({
      type: bidsy.Client.EventType.WHOAMI
    , data: data
  });
};


/**
 * @param {string} duration Number of days until the auction expires.
 * @return {number} A unix timestamp for when the auction will expire.
 * @private
 */
bidsy.Client.prototype.parseExpiration_ = function(duration) {
  return Math.floor(goog.now() / 1000) + duration * 24 * 60 * 60;
};


/** @enum {string} */
bidsy.Client.EventType = {
    BID: 'bid'
  , USER_DELTAS: 'user_deltas'
  , WHOAMI: 'whoami'
};
