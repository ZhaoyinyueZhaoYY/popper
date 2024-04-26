const scrollHandler = function(entries) {
  // console.log(entries);
  if (!window._scollListeners) return;
  window._scollListeners.forEach(fn => {
    fn();
  });
};

export const addScrollListener = function(fn) {
  if (!window._scollListeners) {
    window._scollListeners = [];
  }
  if (!window._scollListeners.includes(fn)) {
    window._scollListeners.push(fn);
  }
};

export const removeScrollListener = function(fn) {
  if (!window._scollListeners) return;
  const index = window._scollListeners.indexOf(fn);
  if (index !== -1) {
    window._scollListeners.splice(index, 1);
  }
};

if (!window._scrollEventInstalled) {
  window._scrollEventInstalled = true;
  document.addEventListener('scroll', scrollHandler, true);
}
