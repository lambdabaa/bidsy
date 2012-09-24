
goog.provide('bidsy.Client');



/**
 * @constructor
 * @export
 */
bidsy.Client = function() {
};
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

  this.socket_.on('userDeltas', goog.bind(this.onUserDeltas_, this));
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
 * @param {Array} data The collection of user delta objects.
 * @private
 */
bidsy.Client.prototype.onUserDeltas_ = function(data) {
  console.log(data);
};


/**
 * @param {string} duration Number of days until the auction expires.
 * @return {number} A unix timestamp for when the auction will expire.
 * @private
 */
bidsy.Client.prototype.parseExpiration_ = function(duration) {
  return Math.floor(goog.now() / 1000) + duration * 24 * 60 * 60;
};
