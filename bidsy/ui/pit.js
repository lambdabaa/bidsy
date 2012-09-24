
goog.provide('bidsy.ui.Pit');

goog.require('bidsy.ui.Bidder');
goog.require('bidsy.ui.Toolbar');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bidsy.ui.Pit = function() {
  goog.base(this);

  /**
   * @type {bidsy.ui.Toolbar}
   * @private
   */
  this.toolbar_ = new bidsy.ui.Toolbar();

  /**
   * Map from bidders to socket ids in the room.
   * @type {Object}
   * @private
   */
  this.socketIdToBidder_ = {};
};
goog.inherits(bidsy.ui.Pit, goog.ui.Component);


/** @inheritDoc */
bidsy.ui.Pit.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.toolbar_.decorate(goog.dom.getElementByClass('toolbar'));
};


/**
 * Shows the pit.
 * @param {Object} auction A map representation of the auction to show.
 */
bidsy.ui.Pit.prototype.show = function(auction) {
  this.toolbar_.show(auction);
};


/**
 * Wipes the pit.
 */
bidsy.ui.Pit.prototype.wipe = function() {
  this.toolbar_.wipe();
  this.removeChildren(true);
};


/**
 * Wipes the main container of all elements related to the current auction.
 */
bidsy.ui.Pit.prototype.wipeAuction = function() {
  this.toolbar_.wipe();
};


/**
 * @param {Array} deltas An array of user join/leaves.
 */
bidsy.ui.Pit.prototype.onUserDeltas = function(deltas) {
  goog.array.forEach(deltas, function(delta) {
    switch (delta['sign']) {
      case '+':
        var bidder = new bidsy.ui.Bidder(delta['user']);
        this.addChild(bidder, true);
        this.socketIdToBidder_[delta['id']] = bidder;
        break;
      case '-':
        var bidder = this.socketIdToBidder_[delta['id']];
        this.removeChild(bidder, true);
        delete this.socketIdToBidder_[delta['id']];
        break;
      default:
        break;
    }
  }, this);
};
