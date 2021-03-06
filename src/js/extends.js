import * as Lib from './lib';

/**
 * A combination of node inherits and babel's inherits (after transpile).
 * Both work the same but node adds `super_` to the subClass
 * and Bable adds the superClass as __proto__. Both seem useful.
 */
const _inherits = function (subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (superClass) {
    // node
    subClass.super_ = superClass;
  }
};

/**
 * Function for subclassing using the same inheritance that
 * videojs uses internally
 *
 * ```
 * var Button = videojs.getComponent('Button');
 *
 * var MyButton = videojs.extends(Button, {
 *   constructor: function(player, options) {
 *     Button.call(this, player, options);
 *   },
 *
 *   onClick: function() {
 *     // doSomething
 *   }
 * });
 * ```
 */
const extendsFn = function(superClass, subClassMethods={}) {
  let subClass = function() {
    superClass.apply(this, arguments);
  };
  let methods = {};

  if (subClassMethods.constructor !== Object.prototype.constructor) {
    subClass = subClassMethods.constructor;
    methods = subClassMethods;
  } else if (typeof subClassMethods === 'function') {
    subClass = subClassMethods;
  }

  _inherits(subClass, superClass);

  // Extend subObj's prototype with functions and other properties from props
  for (var name in methods) {
    if (methods.hasOwnProperty(name)) {
      subClass.prototype[name] = methods[name];
    }
  }

  return subClass;
};

export default extendsFn;
