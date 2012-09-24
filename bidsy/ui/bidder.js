
goog.provide('bidsy.ui.Bidder');

goog.require('bidsy.ui.bidder');



/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {Object} user A map of user attrs.
 */
bidsy.ui.Bidder = function(user) {
  goog.base(this);

  /**
   * @type {Object} map of user attrs.
   * @private
   */
  this.user_ = user;
};
goog.inherits(bidsy.ui.Bidder, goog.ui.Component);


/** @inheritDoc */
bidsy.ui.Bidder.prototype.createDom = function() {
  this.decorateInternal(this.dom_.createElement('div'));
};


/** @inheritDoc */
bidsy.ui.Bidder.prototype.decorateInternal = function(element) {
  this.setElementInternal(element);
  goog.dom.classes.add(element, 'bidder');
  soy.renderElement(element, bidsy.ui.bidder.main, {
      'avatar': (this.user_ ?
          'http://graph.facebook.com/' + this.user_['fbuid'] + '/picture' :
          'images/noprofilepicture.jpeg')
  });
};
