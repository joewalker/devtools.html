
"use strict";

/**
 * Define a getter property on the given object that requires the given
 * module. This enables delaying importing modules until the module is
 * actually used.
 *
 * @param Object obj
 *    The object to define the property on.
 * @param String property
 *    The property name.
 * @param String|Function module
 *    The module path or a function that returns a module evaluated once.
 * @param Boolean destructure
 *    Pass true if the property name is a member of the module's exports.
 */
function lazyRequire (obj, property, module, destructure) {
  Object.defineProperty(obj, property, {
    get: () => {
      // Redefine this accessor property as a data property.
      // Delete it first, to rule out "too much recursion" in case obj is
      // a proxy whose defineProperty handler might unwittingly trigger this
      // getter again.
      delete obj[property];

      let value;

      if (typeof module === "function") {
        value = module();
      }
      else {
        value = destructure
          ? require(module)[property]
          : require(module || property);
      }

      Object.defineProperty(obj, property, {
        value,
        writable: true,
        configurable: true,
        enumerable: true
      });
      
      return value;
    },
    configurable: true,
    enumerable: true
  });
}

var loader = {
  lazyGetter: function(aObject, aName, aLambda) {
    Object.defineProperty(aObject, aName, {
      get: function () {
        delete aObject[aName];
        return aObject[aName] = aLambda.apply(aObject);
      },
      configurable: true,
      enumerable: true
    });
  }
}
