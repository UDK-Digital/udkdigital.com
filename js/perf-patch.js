(function(){
  var originalAdd = EventTarget.prototype.addEventListener;
  var originalRemove = EventTarget.prototype.removeEventListener;
  var wrappedMap = new WeakMap();

  function toPassiveOptions(options, fallbackPassive) {
    if (options == null) return { passive: fallbackPassive };
    if (typeof options === 'boolean') return { capture: options, passive: fallbackPassive };
    if (typeof options === 'object') return Object.assign({ passive: fallbackPassive }, options);
    return options;
  }

  function rafWrap(fn, ctx) {
    var ticking = false;
    var lastEvent;
    return function(e){
      lastEvent = e;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function(){ ticking = false; fn.call(ctx, lastEvent); });
      }
    };
  }

  EventTarget.prototype.addEventListener = function(type, listener, options){
    try {
      if (typeof listener === 'function') {
        // rAF throttle scroll/resize to avoid forced reflow storms
        if (type === 'scroll' || type === 'resize') {
          var wrapped = rafWrap(listener, this);
          wrappedMap.set(listener, wrapped);
          return originalAdd.call(this, type, wrapped, toPassiveOptions(options, true));
        }
        // make wheel/touch passive by default
        if (type === 'touchstart' || type === 'touchmove' || type === 'wheel') {
          return originalAdd.call(this, type, listener, toPassiveOptions(options, true));
        }
      }
    } catch(_){}
    return originalAdd.call(this, type, listener, options);
  };

  EventTarget.prototype.removeEventListener = function(type, listener, options){
    var wrapped = wrappedMap.get(listener);
    if (wrapped) {
      wrappedMap.delete(listener);
      return originalRemove.call(this, type, wrapped, options);
    }
    return originalRemove.call(this, type, listener, options);
  };
})();


