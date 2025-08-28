(function(){
  var originalGetRect = Element.prototype.getBoundingClientRect;
  if (!originalGetRect) return;

  var frameId = -1;
  var rectCache = new WeakMap();

  function resetCache(){
    rectCache = new WeakMap();
    frameId = -1;
  }

  function onFrame(){
    resetCache();
    requestAnimationFrame(onFrame);
  }
  requestAnimationFrame(onFrame);

  Element.prototype.getBoundingClientRect = function(){
    var cached = rectCache.get(this);
    if (cached && cached.id === frameId) return cached.rect;
    // compute once per frame
    var rect = originalGetRect.call(this);
    // clone to decouple from live DOMRect objects in some browsers
    var copy = {top:rect.top,right:rect.right,bottom:rect.bottom,left:rect.left,width:rect.width,height:rect.height,x:rect.x,y:rect.y,toJSON:function(){return this;}};
    if (frameId === -1) frameId = 0; else frameId++;
    rectCache.set(this, { id: frameId, rect: copy });
    return copy;
  };
})();


