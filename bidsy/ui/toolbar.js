
goog.provide('bidsy.ui.Toolbar');

goog.require('bidsy.ui.toolbar');
goog.require('goog.events');
goog.require('goog.Timer');
goog.require('goog.ui.Component');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bidsy.ui.Toolbar = function() {
  goog.base(this);

  /**
   * @type {goog.ui.Component}
   * @private
   */
  this.bid_ = null;

  /**
   * @type {goog.ui.Component}
   * @private
   */
  this.bidInput_ = null;

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

  this.bid_ = new goog.ui.Component();
  this.bid_.decorate(goog.dom.getElementByClass('btn-bid'));
  goog.events.listen(this.bid_.getElement(), goog.events.EventType.CLICK,
                     this.onBidClick_, false, this);

  this.bidInput_ = new goog.ui.Component();
  this.bidInput_.decorate(goog.dom.getElement('item-bid'));
  goog.events.listen(this.bidInput_.getElement(),
                     goog.events.EventType.CHANGE,
                     this.onBidInputChange_, false, this);

  this.timer_ = new goog.Timer(100);
  this.timer_.addEventListener(goog.Timer.TICK,
                               goog.bind(this.showTimeRemaining_, this));
  this.timer_.start();
};


/**
 * Wipes the toolbar.
 */
bidsy.ui.Toolbar.prototype.wipe = function() {
  if (this.bid_) {
    goog.events.unlisten(this.bid_.getElement(), goog.events.EventType.CLICK,
                         this.onBidClick_);
    this.bid_.exitDocument();
    this.bid_ = null;
  }

  if (this.timer_) {
    this.timer_.stop();
    this.timer_.dispose();
  }

  this.getElement().innerHTML = '';
};


/**
 * @param {goog.events.Event} e The CLICK event.
 * @private
 */
bidsy.ui.Toolbar.prototype.onBidClick_ = function(e) {
  var amount = parseFloat(this.bidInput_.getElement().value);
  var auction = bidsy.Info.getInstance().getAuction();
  bidsy.Client.getInstance().bid({
      amount: amount
    , auction: auction['_id']
  }, function(response) {
    // TODO(gareth)
    console.log('Got bid response!');
    console.log(response);
  }); 
};


/**
 * @param {goog.events.Event} e The CHANGE event.
 * @private
 */
bidsy.ui.Toolbar.prototype.onBidInputChange_ = function(e) {
  // TODO(gareth): Validate this
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

  var daysToSeconds = 60 * 60 * 24;
  var days = Math.floor(remaining / daysToSeconds);
  remaining -= days * daysToSeconds;

  var hoursToSeconds = 60 * 60;
  var hours = Math.floor(remaining / hoursToSeconds);
  remaining -= hours * hoursToSeconds;

  var minutesToSeconds = 60;
  var minutes = Math.floor(remaining / minutesToSeconds);
  remaining -= minutes * minutesToSeconds;

  return {
      days: days
    , hours: hours
    , minutes: minutes
    , seconds: remaining
  };
};


/**
 * @private
 */
bidsy.ui.Toolbar.prototype.showTimeRemaining_ = function() {
  var r = this.getTimeRemaining_(this.expiration_);
  var units = [];
  if (r['days'] > 0) {
    units.push(r['days'] + 'd');
  }
  if (units.length > 0 || r['hours'] > 0) {
    units.push(r['hours'] + 'h');
  }
  if (units.length > 0 || r['minutes'] > 0) {
    units.push(r['minutes'] + 'm');
  }
  if (r['days'] == 0) {
    units.push(r['seconds'] + 's');
  }
  
  goog.dom.getElementByClass('bid-timer').innerHTML = units.join(' ');
};
