import { isArray, isObject, mixin } from 'lodash';

function each(elements, func) {
  if (!elements) {
      return;
  }
  var rst;
  if (isArray(elements)) {
      for (var i = 0, len = elements.length; i < len; i++) {
          rst = func(elements[i], i);
          if (rst === false) {
              break;
          }
      }
  }
  else if (isObject(elements)) {
      for (var k in elements) {
          if (elements.hasOwnProperty(k)) {
              rst = func(elements[k], k);
              if (rst === false) {
                  break;
              }
          }
      }
  }
}

function wrapBehavior(obj, action) {
  if (obj['_wrap_' + action]) {
      return obj['_wrap_' + action];
  }
  var method = function (e) {
      obj[action](e);
  };
  obj['_wrap_' + action] = method;
  return method;
}

class PluginBase {
  constructor(cfgs) {
    this._cfgs = mixin(this.getDefaultCfgs(), cfgs);
  }
  getDefaultCfgs() {
    return {};
  }
  initPlugin(graph) {
    const self = this;
    self.set('graph', graph);
    const events = self.getEvents();
    const bindEvents = {};
    each(events, (v, k) => {
      const event = wrapBehavior(self, v);
      bindEvents[k] = event;
      graph.on(k, event);
    });
    this._events = bindEvents;
    this.init();
  }
  init() {}
  getEvents() {
    return {};
  }
  get(key) {
    return this._cfgs[key];
  }
  set(key, val) {
    this._cfgs[key] = val;
  }
  destroy() {}
  destroyPlugin() {
    this.destroy();
    const graph = this.get('graph');
    const events = this._events;
    each(events, (v, k) => {
      graph.off(k, v);
    });
    this._events = null;
    this._cfgs = null;
    this.destroyed = true;
  }
}

export default PluginBase;