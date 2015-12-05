
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

  /*
  Object.defineProperty(obj, property, {
    get: () => {
      // Redefine this accessor property as a data property.
      // Delete it first, to rule out "too much recursion" in case obj is
      // a proxy whose defineProperty handler might unwittingly trigger this
      // getter again.
      delete obj[property];

      var value;

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
  */
}

// Shim out these lazy getters, as they can all be implemented
// with lazyRequire
function lazyGetter (obj, name, fn) {
  return lazyRequire(obj, name, fn);
}

function lazyImporter (obj, name, path) {
  return lazyRequire(obj, name, path, true);
}

function lazyServiceGetter (obj, name, fn) {
  throw new Error("`lazyServiceGetter` cannot be implemented in content.");
}

var loader = {
  lazyGetter: lazyGetter,
  lazyImporter: lazyImporter,
  lazyRequireGetter: lazyRequire,
  lazyServiceGetter: lazyServiceGetter,
};
