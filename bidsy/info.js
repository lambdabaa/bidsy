
goog.provide('bidsy.Info');



/**
 * @constructor
 */
bidsy.Info = function() {
};
goog.addSingletonGetter(bidsy.Info);


/**
 * @return {Object} auction
 */
bidsy.Info.prototype.getAuction = function() {
  return this.auction_;
};


/**
 * @param {Object} auction
 */
bidsy.Info.prototype.setAuction = function(auction) {
  this.auction_ = auction;
}


/**
 * @return {Object} user
 */
bidsy.Info.prototype.getUser = function() {
  return this.user_;
};


/**
 * @param {Object} user
 */
bidsy.Info.prototype.setUser = function(user) {
  this.user_ = user;
}
