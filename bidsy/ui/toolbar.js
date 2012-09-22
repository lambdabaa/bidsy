
goog.provide('bidsy.ui.Toolbar');

goog.require('bidsy.ui.toolbar');
goog.require('goog.Timer');
goog.require('goog.ui.Component');
goog.require('soy');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bidsy.ui.Toolbar = function() {
  goog.base(this);

  /**
   * @type {goog.Timer}
   * @private
   */
  this.timer_ = null;

  /**
   * Time at which the currently shown auction expires.
   * @type {?number}
   * @private
   */
  this.expiration_ = null;
};
goog.inherits(bidsy.ui.Toolbar, goog.ui.Component);


/**
 * Shows the auction on the toolbar.
 * @param {Object} auction A map of auction data.
 */
bidsy.ui.Toolbar.prototype.show = function(auction) {
  this.expiration_ = auction['expiration'];
  var fragment = soy.renderAsFragment(bidsy.ui.toolbar.main, {
      bid: this.getBid_(auction)
    , timeRemaining: this.getTimeRemaining_(this.expiration_)
  });
  goog.dom.appendChild(this.getElement(), /** @type {Node} */ (fragment));

  this.timer_ = new goog.Timer(100);
  this.timer_.addEventListener(goog.Timer.TICK,
                               goog.bind(this.showTimeRemaining_, this));
  this.timer_.start();
};


/**
 * Wipes the toolbar.
 */
bidsy.ui.Toolbar.prototype.wipe = function() {
  if (this.timer_) {
    this.timer_.stop();
    this.timer_.dispose();
  }

  this.getElement().innerHTML = '';
};


/**
 * @param {Object} auction A map of auction data.
 * @return {string} string A representation of the auction's high bid.
 * @private
 */
bidsy.ui.Toolbar.prototype.getBid_ = function(auction) {
  var highbid = null;
  var high = auction['minimum'];
  goog.array.forEach(auction['bids'], function(bid) {
    if (!high || bid['amount'] > high) {
      high = bid['amount'];
      highbid = bid;
    }
  }, this);

  high = high.toString() || '0.0';
  if (high.indexOf('\.') == -1) {
    high += '.00';
  } else if (high.split('\.')[1].length == 1) {
    high += '0';
  }

  return high;
};


/**
 * @param {?number} expiration A unix timestamp for when auction expires.
 * @return {Object} A map of different time components.
 * @private
 */
bidsy.ui.Toolbar.prototype.getTimeRemaining_ = function(expiration) {
  var remaining = expiration - Math.floor(goog.now() / 1000);
  var hours = Math.floor(remaining / 3600);
  remaining -= hours * 3600;
  hours = hours.toString();
  while (hours.length < 2) {
    hours = '0' + hours;
  }

  var minutes = Math.floor(remaining / 60);
  remaining -= minutes * 60;
  minutes = minutes.toString();
  while (minutes.length < 2) {
    minutes = '0' + minutes;
  }

  var seconds = Math.floor(remaining);
  seconds = seconds.toString();
  while (seconds.length < 2) {
    seconds = '0' + seconds;
  }

  return {
      'hours': hours
    , 'minutes': minutes
    , 'seconds': seconds
  };
};


/**
 * @private
 */
bidsy.ui.Toolbar.prototype.showTimeRemaining_ = function() {
  var r = this.getTimeRemaining_(this.expiration_);
  goog.dom.getElementByClass('bid-timer').innerHTML =
      r['hours'] + ':' + r['minutes'] + ':' + r['seconds'];
};
