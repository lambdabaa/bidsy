
goog.provide('bidsy.ui.Toolbar');

goog.require('bidsy.ui.toolbar');
goog.require('goog.ui.Component');
goog.require('goog.Timer');
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


bidsy.ui.Toolbar.prototype.show = function(auction) {
  var fragment = soy.renderAsFragment(bidsy.ui.toolbar.main, {
      bid: this.getBid_(auction)
  });
  goog.dom.appendChild(this.getElement(), /** @type {Node} */ (fragment));

  this.timer_ = new goog.Timer(100);
  this.timer_.addEventListener(goog.Timer.TICK, 
                               goog.bind(this.setTimeRemaining_, this));
  this.timer_.start();

  this.expiration_ = auction['expiration'];
};


bidsy.ui.Toolbar.prototype.wipe = function() {
  if (this.timer_) {
    this.timer_.stop();
    this.timer_.dispose();
  }

  this.getElement().innerHTML = '';
};


/**
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
 * @private
 */
bidsy.ui.Toolbar.prototype.setTimeRemaining_ = function() {
  var now = goog.now() / 1000;
  var remaining = this.expiration_ - now;

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

  goog.dom.getElementByClass('bid-timer').innerHTML =
      hours + ':' + minutes + ':' + seconds;
};
