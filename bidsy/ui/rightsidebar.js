
goog.provide('bidsy.ui.RightSidebar');

goog.require('goog.ui.Component');
goog.require('bidsy.ui.Upcoming');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bidsy.ui.RightSidebar = function() {
  goog.base(this);

  /**
   * @type {bidsy.ui.Upcoming}
   * @private
   */
   this.upcoming_ = new bidsy.ui.Upcoming();
};
goog.inherits(bidsy.ui.RightSidebar, goog.ui.Component);


/** @inheritDoc */
bidsy.ui.RightSidebar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.upcoming_.decorate(goog.dom.getElementByClass('upcoming'));
  goog.events.listen(this.upcoming_, bidsy.ui.EventType.UPCOMING,
                     this.onUpcoming_, false, this);
};


/**
 * Displays the queue of upcoming auctions.
 * @param {Array} auctions Map representations of the auctions to show.
 */
bidsy.ui.RightSidebar.prototype.show = function(auctions) {
  this.upcoming_.show(auctions);
};


/**
 * Wipes the right sidebar.
 */
bidsy.ui.RightSidebar.prototype.wipe = function() {
  this.upcoming_.wipe();
};


/**
 * @param {goog.events.Event} e The UPCOMING event.
 * @private
 */
bidsy.ui.RightSidebar.prototype.onUpcoming_ = function(e) {
  this.dispatchEvent(e);
};
