
if(typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {
  var Backbone = require('backbone')
    , _ = require('underscore');

  /**
   * View
   *
   * @constructor
   */

  var Constructor = Backbone.View.extend({

    /**
     * We create a noop of this element if on server. Because it requires the DOM
     * to be run.
     *
     * @overrides _ensureElement
     */

    _ensureElement: function() {
      if(inClient) {
        Backbone.View.prototype._ensureElement.call(this, arguments);
      }
    },

    /**
     * fingerIsOutOfRangeRange checks if a finger is out of range for firing a release event.
     * For usage, when touch events and finger is released too far away from the button.
     * Pls. set global constants for how far the finger can be in TOUCH_OUT_OF_RANGE
     *
     * @param {HammerJSEvent=}
     *
     * @return {Boolean}
     */

    fingerIsOutOfButtonRange: function(event) {
      var isOutOfRange = false;

      if(typeof event !== 'undefined'
      && typeof event.gesture !== 'undefined') {
        if(typeof event.gesture.deltaX === 'number'
        && Math.abs(event.gesture.deltaX) > cf.TOUCH_OUT_OF_RANGE) {
          isOutOfRange = true;
        }
        if(typeof event.gesture.deltaX === 'number'
        && Math.abs(event.gesture.deltaY) > cf.TOUCH_OUT_OF_RANGE) {
          isOutOfRange = true;
        }
      }

      return isOutOfRange;
    },

    /**
     * Bind DOM. This method is automatically called be the `Composer`
     * object. The user need to define the method body and its purpose
     * is to bind event from DOM with delegates from the `View` object.
     * It should also set `Boolean boundDOM` to true after executed.
     *
     * @return {void}
     * @api public
     * @autocalled
     */

    bindDOM: function() {
      this.setElements();
      this.addMouseInteractions();
      this.addTouchInteractions();
    },

    /**
     * Bind method handlers
     *
     * @return {void}
     * @api private
     */

    bindMethods: function() {
      _.bindAll(this, 'addTouchInteractions', 'addMouseInteractions');
    },

    /**
     * Set relevant view elements
     *
     * @api public
     * @autocalled
     */

    setElements: function() {},

    /**
     * Add mouse interactions
     *
     * @return {void}
     * @api private
     */

    addMouseInteractions: function() {},

    /**
     * Add touch interactions
     *
     * @return {void}
     * @api private
     */

    addTouchInteractions: function() {},

    /**
     * Bind model. This method should be used to bind the view to model events. This method
     * is called by the composer directly after the DOM have been created.
     *
     * @return {void}
     * @api public
     * @autocalled
     */

    bindModel: function() {},

    /**
     * Render noop.
     *
     * @return {void}
     * @api public
     */

    toHTML: function() {},

    /**
     * Show is called by the composer if `should()` returns 'keep'.
     *
     * @return {void}
     * @api public
     * @autocalled
     */

    show: function() {},

    /**
     * A method for deciding if a view should render, keep or remove itself.
     * The composer object
     *
     * @return {String} (keep|update|remove)
     * @api public
     * @autocalled
     */

    should: function() {
      return 'keep';
    }
  });

  /**
   * Export
   */

  return Constructor;

});
