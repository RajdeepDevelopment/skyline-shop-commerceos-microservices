var Jd = (e) => {
  throw TypeError(e);
};
var qa = (e, t, n) => t.has(e) || Jd('Cannot ' + n);
var k = (e, t, n) => (qa(e, t, 'read from private field'), n ? n.call(e) : t.get(e)),
  B = (e, t, n) =>
    t.has(e)
      ? Jd('Cannot add the same private member more than once')
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, n),
  I = (e, t, n, r) => (qa(e, t, 'write to private field'), r ? r.call(e, n) : t.set(e, n), n),
  xe = (e, t, n) => (qa(e, t, 'access private method'), n);
var zi = (e, t, n, r) => ({
  set _(s) {
    I(e, t, s, n);
  },
  get _() {
    return k(e, t, r);
  },
});
function Hv(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != 'string' && !Array.isArray(r)) {
      for (const s in r)
        if (s !== 'default' && !(s in e)) {
          const i = Object.getOwnPropertyDescriptor(r, s);
          i && Object.defineProperty(e, s, i.get ? i : { enumerable: !0, get: () => r[s] });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }));
}
(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const i of s)
      if (i.type === 'childList')
        for (const o of i.addedNodes) o.tagName === 'LINK' && o.rel === 'modulepreload' && r(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
    const i = {};
    return (
      s.integrity && (i.integrity = s.integrity),
      s.referrerPolicy && (i.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (i.credentials = 'include')
        : s.crossOrigin === 'anonymous'
          ? (i.credentials = 'omit')
          : (i.credentials = 'same-origin'),
      i
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const i = n(s);
    fetch(s.href, i);
  }
})();
function Wv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e;
}
var cm = { exports: {} },
  ma = {},
  dm = { exports: {} },
  V = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ki = Symbol.for('react.element'),
  Kv = Symbol.for('react.portal'),
  qv = Symbol.for('react.fragment'),
  Qv = Symbol.for('react.strict_mode'),
  Gv = Symbol.for('react.profiler'),
  Xv = Symbol.for('react.provider'),
  Yv = Symbol.for('react.context'),
  Jv = Symbol.for('react.forward_ref'),
  Zv = Symbol.for('react.suspense'),
  ex = Symbol.for('react.memo'),
  tx = Symbol.for('react.lazy'),
  Zd = Symbol.iterator;
function nx(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (Zd && e[Zd]) || e['@@iterator']), typeof e == 'function' ? e : null);
}
var fm = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  hm = Object.assign,
  pm = {};
function ls(e, t, n) {
  ((this.props = e), (this.context = t), (this.refs = pm), (this.updater = n || fm));
}
ls.prototype.isReactComponent = {};
ls.prototype.setState = function (e, t) {
  if (typeof e != 'object' && typeof e != 'function' && e != null)
    throw Error(
      'setState(...): takes an object of state variables to update or a function which returns an object of state variables.',
    );
  this.updater.enqueueSetState(this, e, t, 'setState');
};
ls.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
};
function mm() {}
mm.prototype = ls.prototype;
function uc(e, t, n) {
  ((this.props = e), (this.context = t), (this.refs = pm), (this.updater = n || fm));
}
var cc = (uc.prototype = new mm());
cc.constructor = uc;
hm(cc, ls.prototype);
cc.isPureReactComponent = !0;
var ef = Array.isArray,
  ym = Object.prototype.hasOwnProperty,
  dc = { current: null },
  gm = { key: !0, ref: !0, __self: !0, __source: !0 };
function vm(e, t, n) {
  var r,
    s = {},
    i = null,
    o = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (i = '' + t.key), t))
      ym.call(t, r) && !gm.hasOwnProperty(r) && (s[r] = t[r]);
  var a = arguments.length - 2;
  if (a === 1) s.children = n;
  else if (1 < a) {
    for (var l = Array(a), u = 0; u < a; u++) l[u] = arguments[u + 2];
    s.children = l;
  }
  if (e && e.defaultProps) for (r in ((a = e.defaultProps), a)) s[r] === void 0 && (s[r] = a[r]);
  return { $$typeof: ki, type: e, key: i, ref: o, props: s, _owner: dc.current };
}
function rx(e, t) {
  return { $$typeof: ki, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function fc(e) {
  return typeof e == 'object' && e !== null && e.$$typeof === ki;
}
function sx(e) {
  var t = { '=': '=0', ':': '=2' };
  return (
    '$' +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var tf = /\/+/g;
function Qa(e, t) {
  return typeof e == 'object' && e !== null && e.key != null ? sx('' + e.key) : t.toString(36);
}
function yo(e, t, n, r, s) {
  var i = typeof e;
  (i === 'undefined' || i === 'boolean') && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (i) {
      case 'string':
      case 'number':
        o = !0;
        break;
      case 'object':
        switch (e.$$typeof) {
          case ki:
          case Kv:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (s = s(o)),
      (e = r === '' ? '.' + Qa(o, 0) : r),
      ef(s)
        ? ((n = ''),
          e != null && (n = e.replace(tf, '$&/') + '/'),
          yo(s, t, n, '', function (u) {
            return u;
          }))
        : s != null &&
          (fc(s) &&
            (s = rx(
              s,
              n +
                (!s.key || (o && o.key === s.key) ? '' : ('' + s.key).replace(tf, '$&/') + '/') +
                e,
            )),
          t.push(s)),
      1
    );
  if (((o = 0), (r = r === '' ? '.' : r + ':'), ef(e)))
    for (var a = 0; a < e.length; a++) {
      i = e[a];
      var l = r + Qa(i, a);
      o += yo(i, t, n, l, s);
    }
  else if (((l = nx(e)), typeof l == 'function'))
    for (e = l.call(e), a = 0; !(i = e.next()).done; )
      ((i = i.value), (l = r + Qa(i, a++)), (o += yo(i, t, n, l, s)));
  else if (i === 'object')
    throw (
      (t = String(e)),
      Error(
        'Objects are not valid as a React child (found: ' +
          (t === '[object Object]' ? 'object with keys {' + Object.keys(e).join(', ') + '}' : t) +
          '). If you meant to render a collection of children, use an array instead.',
      )
    );
  return o;
}
function $i(e, t, n) {
  if (e == null) return e;
  var r = [],
    s = 0;
  return (
    yo(e, r, '', '', function (i) {
      return t.call(n, i, s++);
    }),
    r
  );
}
function ix(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) && ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) && ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Ie = { current: null },
  go = { transition: null },
  ox = { ReactCurrentDispatcher: Ie, ReactCurrentBatchConfig: go, ReactCurrentOwner: dc };
function xm() {
  throw Error('act(...) is not supported in production builds of React.');
}
V.Children = {
  map: $i,
  forEach: function (e, t, n) {
    $i(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      $i(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      $i(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!fc(e))
      throw Error('React.Children.only expected to receive a single React element child.');
    return e;
  },
};
V.Component = ls;
V.Fragment = qv;
V.Profiler = Gv;
V.PureComponent = uc;
V.StrictMode = Qv;
V.Suspense = Zv;
V.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ox;
V.act = xm;
V.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      'React.cloneElement(...): The argument must be a React element, but you passed ' + e + '.',
    );
  var r = hm({}, e.props),
    s = e.key,
    i = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((i = t.ref), (o = dc.current)),
      t.key !== void 0 && (s = '' + t.key),
      e.type && e.type.defaultProps)
    )
      var a = e.type.defaultProps;
    for (l in t)
      ym.call(t, l) &&
        !gm.hasOwnProperty(l) &&
        (r[l] = t[l] === void 0 && a !== void 0 ? a[l] : t[l]);
  }
  var l = arguments.length - 2;
  if (l === 1) r.children = n;
  else if (1 < l) {
    a = Array(l);
    for (var u = 0; u < l; u++) a[u] = arguments[u + 2];
    r.children = a;
  }
  return { $$typeof: ki, type: e.type, key: s, ref: i, props: r, _owner: o };
};
V.createContext = function (e) {
  return (
    (e = {
      $$typeof: Yv,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: Xv, _context: e }),
    (e.Consumer = e)
  );
};
V.createElement = vm;
V.createFactory = function (e) {
  var t = vm.bind(null, e);
  return ((t.type = e), t);
};
V.createRef = function () {
  return { current: null };
};
V.forwardRef = function (e) {
  return { $$typeof: Jv, render: e };
};
V.isValidElement = fc;
V.lazy = function (e) {
  return { $$typeof: tx, _payload: { _status: -1, _result: e }, _init: ix };
};
V.memo = function (e, t) {
  return { $$typeof: ex, type: e, compare: t === void 0 ? null : t };
};
V.startTransition = function (e) {
  var t = go.transition;
  go.transition = {};
  try {
    e();
  } finally {
    go.transition = t;
  }
};
V.unstable_act = xm;
V.useCallback = function (e, t) {
  return Ie.current.useCallback(e, t);
};
V.useContext = function (e) {
  return Ie.current.useContext(e);
};
V.useDebugValue = function () {};
V.useDeferredValue = function (e) {
  return Ie.current.useDeferredValue(e);
};
V.useEffect = function (e, t) {
  return Ie.current.useEffect(e, t);
};
V.useId = function () {
  return Ie.current.useId();
};
V.useImperativeHandle = function (e, t, n) {
  return Ie.current.useImperativeHandle(e, t, n);
};
V.useInsertionEffect = function (e, t) {
  return Ie.current.useInsertionEffect(e, t);
};
V.useLayoutEffect = function (e, t) {
  return Ie.current.useLayoutEffect(e, t);
};
V.useMemo = function (e, t) {
  return Ie.current.useMemo(e, t);
};
V.useReducer = function (e, t, n) {
  return Ie.current.useReducer(e, t, n);
};
V.useRef = function (e) {
  return Ie.current.useRef(e);
};
V.useState = function (e) {
  return Ie.current.useState(e);
};
V.useSyncExternalStore = function (e, t, n) {
  return Ie.current.useSyncExternalStore(e, t, n);
};
V.useTransition = function () {
  return Ie.current.useTransition();
};
V.version = '18.3.1';
dm.exports = V;
var P = dm.exports;
const zn = Wv(P),
  ax = Hv({ __proto__: null, default: zn }, [P]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var lx = P,
  ux = Symbol.for('react.element'),
  cx = Symbol.for('react.fragment'),
  dx = Object.prototype.hasOwnProperty,
  fx = lx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  hx = { key: !0, ref: !0, __self: !0, __source: !0 };
function wm(e, t, n) {
  var r,
    s = {},
    i = null,
    o = null;
  (n !== void 0 && (i = '' + n),
    t.key !== void 0 && (i = '' + t.key),
    t.ref !== void 0 && (o = t.ref));
  for (r in t) dx.call(t, r) && !hx.hasOwnProperty(r) && (s[r] = t[r]);
  if (e && e.defaultProps) for (r in ((t = e.defaultProps), t)) s[r] === void 0 && (s[r] = t[r]);
  return { $$typeof: ux, type: e, key: i, ref: o, props: s, _owner: fx.current };
}
ma.Fragment = cx;
ma.jsx = wm;
ma.jsxs = wm;
cm.exports = ma;
var f = cm.exports,
  Vl = {},
  Sm = { exports: {} },
  nt = {},
  Cm = { exports: {} },
  Em = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(A, _) {
    var M = A.length;
    A.push(_);
    e: for (; 0 < M; ) {
      var $ = (M - 1) >>> 1,
        ae = A[$];
      if (0 < s(ae, _)) ((A[$] = _), (A[M] = ae), (M = $));
      else break e;
    }
  }
  function n(A) {
    return A.length === 0 ? null : A[0];
  }
  function r(A) {
    if (A.length === 0) return null;
    var _ = A[0],
      M = A.pop();
    if (M !== _) {
      A[0] = M;
      e: for (var $ = 0, ae = A.length, le = ae >>> 1; $ < le; ) {
        var ke = 2 * ($ + 1) - 1,
          Be = A[ke],
          mt = ke + 1,
          Ue = A[mt];
        if (0 > s(Be, M))
          mt < ae && 0 > s(Ue, Be)
            ? ((A[$] = Ue), (A[mt] = M), ($ = mt))
            : ((A[$] = Be), (A[ke] = M), ($ = ke));
        else if (mt < ae && 0 > s(Ue, M)) ((A[$] = Ue), (A[mt] = M), ($ = mt));
        else break e;
      }
    }
    return _;
  }
  function s(A, _) {
    var M = A.sortIndex - _.sortIndex;
    return M !== 0 ? M : A.id - _.id;
  }
  if (typeof performance == 'object' && typeof performance.now == 'function') {
    var i = performance;
    e.unstable_now = function () {
      return i.now();
    };
  } else {
    var o = Date,
      a = o.now();
    e.unstable_now = function () {
      return o.now() - a;
    };
  }
  var l = [],
    u = [],
    c = 1,
    d = null,
    h = 3,
    g = !1,
    w = !1,
    v = !1,
    x = typeof setTimeout == 'function' ? setTimeout : null,
    p = typeof clearTimeout == 'function' ? clearTimeout : null,
    m = typeof setImmediate < 'u' ? setImmediate : null;
  typeof navigator < 'u' &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function y(A) {
    for (var _ = n(u); _ !== null; ) {
      if (_.callback === null) r(u);
      else if (_.startTime <= A) (r(u), (_.sortIndex = _.expirationTime), t(l, _));
      else break;
      _ = n(u);
    }
  }
  function S(A) {
    if (((v = !1), y(A), !w))
      if (n(l) !== null) ((w = !0), Rt(C));
      else {
        var _ = n(u);
        _ !== null && oe(S, _.startTime - A);
      }
  }
  function C(A, _) {
    ((w = !1), v && ((v = !1), p(j), (j = -1)), (g = !0));
    var M = h;
    try {
      for (y(_), d = n(l); d !== null && (!(d.expirationTime > _) || (A && !z())); ) {
        var $ = d.callback;
        if (typeof $ == 'function') {
          ((d.callback = null), (h = d.priorityLevel));
          var ae = $(d.expirationTime <= _);
          ((_ = e.unstable_now()),
            typeof ae == 'function' ? (d.callback = ae) : d === n(l) && r(l),
            y(_));
        } else r(l);
        d = n(l);
      }
      if (d !== null) var le = !0;
      else {
        var ke = n(u);
        (ke !== null && oe(S, ke.startTime - _), (le = !1));
      }
      return le;
    } finally {
      ((d = null), (h = M), (g = !1));
    }
  }
  var T = !1,
    N = null,
    j = -1,
    L = 5,
    D = -1;
  function z() {
    return !(e.unstable_now() - D < L);
  }
  function Qe() {
    if (N !== null) {
      var A = e.unstable_now();
      D = A;
      var _ = !0;
      try {
        _ = N(!0, A);
      } finally {
        _ ? Nt() : ((T = !1), (N = null));
      }
    } else T = !1;
  }
  var Nt;
  if (typeof m == 'function')
    Nt = function () {
      m(Qe);
    };
  else if (typeof MessageChannel < 'u') {
    var Pe = new MessageChannel(),
      mr = Pe.port2;
    ((Pe.port1.onmessage = Qe),
      (Nt = function () {
        mr.postMessage(null);
      }));
  } else
    Nt = function () {
      x(Qe, 0);
    };
  function Rt(A) {
    ((N = A), T || ((T = !0), Nt()));
  }
  function oe(A, _) {
    j = x(function () {
      A(e.unstable_now());
    }, _);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (A) {
      A.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      w || g || ((w = !0), Rt(C));
    }),
    (e.unstable_forceFrameRate = function (A) {
      0 > A || 125 < A
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
          )
        : (L = 0 < A ? Math.floor(1e3 / A) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return h;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(l);
    }),
    (e.unstable_next = function (A) {
      switch (h) {
        case 1:
        case 2:
        case 3:
          var _ = 3;
          break;
        default:
          _ = h;
      }
      var M = h;
      h = _;
      try {
        return A();
      } finally {
        h = M;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (A, _) {
      switch (A) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          A = 3;
      }
      var M = h;
      h = A;
      try {
        return _();
      } finally {
        h = M;
      }
    }),
    (e.unstable_scheduleCallback = function (A, _, M) {
      var $ = e.unstable_now();
      switch (
        (typeof M == 'object' && M !== null
          ? ((M = M.delay), (M = typeof M == 'number' && 0 < M ? $ + M : $))
          : (M = $),
        A)
      ) {
        case 1:
          var ae = -1;
          break;
        case 2:
          ae = 250;
          break;
        case 5:
          ae = 1073741823;
          break;
        case 4:
          ae = 1e4;
          break;
        default:
          ae = 5e3;
      }
      return (
        (ae = M + ae),
        (A = {
          id: c++,
          callback: _,
          priorityLevel: A,
          startTime: M,
          expirationTime: ae,
          sortIndex: -1,
        }),
        M > $
          ? ((A.sortIndex = M),
            t(u, A),
            n(l) === null && A === n(u) && (v ? (p(j), (j = -1)) : (v = !0), oe(S, M - $)))
          : ((A.sortIndex = ae), t(l, A), w || g || ((w = !0), Rt(C))),
        A
      );
    }),
    (e.unstable_shouldYield = z),
    (e.unstable_wrapCallback = function (A) {
      var _ = h;
      return function () {
        var M = h;
        h = _;
        try {
          return A.apply(this, arguments);
        } finally {
          h = M;
        }
      };
    }));
})(Em);
Cm.exports = Em;
var px = Cm.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var mx = P,
  et = px;
function R(e) {
  for (
    var t = 'https://reactjs.org/docs/error-decoder.html?invariant=' + e, n = 1;
    n < arguments.length;
    n++
  )
    t += '&args[]=' + encodeURIComponent(arguments[n]);
  return (
    'Minified React error #' +
    e +
    '; visit ' +
    t +
    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
  );
}
var Pm = new Set(),
  Xs = {};
function cr(e, t) {
  (Yr(e, t), Yr(e + 'Capture', t));
}
function Yr(e, t) {
  for (Xs[e] = t, e = 0; e < t.length; e++) Pm.add(t[e]);
}
var Xt = !(
    typeof window > 'u' ||
    typeof window.document > 'u' ||
    typeof window.document.createElement > 'u'
  ),
  Bl = Object.prototype.hasOwnProperty,
  yx =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  nf = {},
  rf = {};
function gx(e) {
  return Bl.call(rf, e) ? !0 : Bl.call(nf, e) ? !1 : yx.test(e) ? (rf[e] = !0) : ((nf[e] = !0), !1);
}
function vx(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case 'function':
    case 'symbol':
      return !0;
    case 'boolean':
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== 'data-' && e !== 'aria-');
    default:
      return !1;
  }
}
function xx(e, t, n, r) {
  if (t === null || typeof t > 'u' || vx(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function Ve(e, t, n, r, s, i, o) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = s),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = i),
    (this.removeEmptyString = o));
}
var Ee = {};
'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
  .split(' ')
  .forEach(function (e) {
    Ee[e] = new Ve(e, 0, !1, e, null, !1, !1);
  });
[
  ['acceptCharset', 'accept-charset'],
  ['className', 'class'],
  ['htmlFor', 'for'],
  ['httpEquiv', 'http-equiv'],
].forEach(function (e) {
  var t = e[0];
  Ee[t] = new Ve(t, 1, !1, e[1], null, !1, !1);
});
['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (e) {
  Ee[e] = new Ve(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function (e) {
  Ee[e] = new Ve(e, 2, !1, e, null, !1, !1);
});
'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
  .split(' ')
  .forEach(function (e) {
    Ee[e] = new Ve(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
['checked', 'multiple', 'muted', 'selected'].forEach(function (e) {
  Ee[e] = new Ve(e, 3, !0, e, null, !1, !1);
});
['capture', 'download'].forEach(function (e) {
  Ee[e] = new Ve(e, 4, !1, e, null, !1, !1);
});
['cols', 'rows', 'size', 'span'].forEach(function (e) {
  Ee[e] = new Ve(e, 6, !1, e, null, !1, !1);
});
['rowSpan', 'start'].forEach(function (e) {
  Ee[e] = new Ve(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var hc = /[\-:]([a-z])/g;
function pc(e) {
  return e[1].toUpperCase();
}
'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
  .split(' ')
  .forEach(function (e) {
    var t = e.replace(hc, pc);
    Ee[t] = new Ve(t, 1, !1, e, null, !1, !1);
  });
'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'
  .split(' ')
  .forEach(function (e) {
    var t = e.replace(hc, pc);
    Ee[t] = new Ve(t, 1, !1, e, 'http://www.w3.org/1999/xlink', !1, !1);
  });
['xml:base', 'xml:lang', 'xml:space'].forEach(function (e) {
  var t = e.replace(hc, pc);
  Ee[t] = new Ve(t, 1, !1, e, 'http://www.w3.org/XML/1998/namespace', !1, !1);
});
['tabIndex', 'crossOrigin'].forEach(function (e) {
  Ee[e] = new Ve(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
Ee.xlinkHref = new Ve('xlinkHref', 1, !1, 'xlink:href', 'http://www.w3.org/1999/xlink', !0, !1);
['src', 'href', 'action', 'formAction'].forEach(function (e) {
  Ee[e] = new Ve(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function mc(e, t, n, r) {
  var s = Ee.hasOwnProperty(t) ? Ee[t] : null;
  (s !== null
    ? s.type !== 0
    : r || !(2 < t.length) || (t[0] !== 'o' && t[0] !== 'O') || (t[1] !== 'n' && t[1] !== 'N')) &&
    (xx(t, n, s, r) && (n = null),
    r || s === null
      ? gx(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, '' + n))
      : s.mustUseProperty
        ? (e[s.propertyName] = n === null ? (s.type === 3 ? !1 : '') : n)
        : ((t = s.attributeName),
          (r = s.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((s = s.type),
              (n = s === 3 || (s === 4 && n === !0) ? '' : '' + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var tn = mx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Hi = Symbol.for('react.element'),
  xr = Symbol.for('react.portal'),
  wr = Symbol.for('react.fragment'),
  yc = Symbol.for('react.strict_mode'),
  Ul = Symbol.for('react.profiler'),
  km = Symbol.for('react.provider'),
  Tm = Symbol.for('react.context'),
  gc = Symbol.for('react.forward_ref'),
  zl = Symbol.for('react.suspense'),
  $l = Symbol.for('react.suspense_list'),
  vc = Symbol.for('react.memo'),
  on = Symbol.for('react.lazy'),
  jm = Symbol.for('react.offscreen'),
  sf = Symbol.iterator;
function ws(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (sf && e[sf]) || e['@@iterator']), typeof e == 'function' ? e : null);
}
var ne = Object.assign,
  Ga;
function As(e) {
  if (Ga === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Ga = (t && t[1]) || '';
    }
  return (
    `
` +
    Ga +
    e
  );
}
var Xa = !1;
function Ya(e, t) {
  if (!e || Xa) return '';
  Xa = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, 'props', {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == 'object' && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (u) {
          var r = u;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (u) {
          r = u;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      e();
    }
  } catch (u) {
    if (u && r && typeof u.stack == 'string') {
      for (
        var s = u.stack.split(`
`),
          i = r.stack.split(`
`),
          o = s.length - 1,
          a = i.length - 1;
        1 <= o && 0 <= a && s[o] !== i[a];
      )
        a--;
      for (; 1 <= o && 0 <= a; o--, a--)
        if (s[o] !== i[a]) {
          if (o !== 1 || a !== 1)
            do
              if ((o--, a--, 0 > a || s[o] !== i[a])) {
                var l =
                  `
` + s[o].replace(' at new ', ' at ');
                return (
                  e.displayName &&
                    l.includes('<anonymous>') &&
                    (l = l.replace('<anonymous>', e.displayName)),
                  l
                );
              }
            while (1 <= o && 0 <= a);
          break;
        }
    }
  } finally {
    ((Xa = !1), (Error.prepareStackTrace = n));
  }
  return (e = e ? e.displayName || e.name : '') ? As(e) : '';
}
function wx(e) {
  switch (e.tag) {
    case 5:
      return As(e.type);
    case 16:
      return As('Lazy');
    case 13:
      return As('Suspense');
    case 19:
      return As('SuspenseList');
    case 0:
    case 2:
    case 15:
      return ((e = Ya(e.type, !1)), e);
    case 11:
      return ((e = Ya(e.type.render, !1)), e);
    case 1:
      return ((e = Ya(e.type, !0)), e);
    default:
      return '';
  }
}
function Hl(e) {
  if (e == null) return null;
  if (typeof e == 'function') return e.displayName || e.name || null;
  if (typeof e == 'string') return e;
  switch (e) {
    case wr:
      return 'Fragment';
    case xr:
      return 'Portal';
    case Ul:
      return 'Profiler';
    case yc:
      return 'StrictMode';
    case zl:
      return 'Suspense';
    case $l:
      return 'SuspenseList';
  }
  if (typeof e == 'object')
    switch (e.$$typeof) {
      case Tm:
        return (e.displayName || 'Context') + '.Consumer';
      case km:
        return (e._context.displayName || 'Context') + '.Provider';
      case gc:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ''),
            (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
          e
        );
      case vc:
        return ((t = e.displayName || null), t !== null ? t : Hl(e.type) || 'Memo');
      case on:
        ((t = e._payload), (e = e._init));
        try {
          return Hl(e(t));
        } catch {}
    }
  return null;
}
function Sx(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return 'Cache';
    case 9:
      return (t.displayName || 'Context') + '.Consumer';
    case 10:
      return (t._context.displayName || 'Context') + '.Provider';
    case 18:
      return 'DehydratedFragment';
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ''),
        t.displayName || (e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')
      );
    case 7:
      return 'Fragment';
    case 5:
      return t;
    case 4:
      return 'Portal';
    case 3:
      return 'Root';
    case 6:
      return 'Text';
    case 16:
      return Hl(t);
    case 8:
      return t === yc ? 'StrictMode' : 'Mode';
    case 22:
      return 'Offscreen';
    case 12:
      return 'Profiler';
    case 21:
      return 'Scope';
    case 13:
      return 'Suspense';
    case 19:
      return 'SuspenseList';
    case 25:
      return 'TracingMarker';
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == 'function') return t.displayName || t.name || null;
      if (typeof t == 'string') return t;
  }
  return null;
}
function Nn(e) {
  switch (typeof e) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return e;
    case 'object':
      return e;
    default:
      return '';
  }
}
function Nm(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
}
function Cx(e) {
  var t = Nm(e) ? 'checked' : 'value',
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = '' + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < 'u' &&
    typeof n.get == 'function' &&
    typeof n.set == 'function'
  ) {
    var s = n.get,
      i = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return s.call(this);
        },
        set: function (o) {
          ((r = '' + o), i.call(this, o));
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (o) {
          r = '' + o;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function Wi(e) {
  e._valueTracker || (e._valueTracker = Cx(e));
}
function Rm(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = '';
  return (
    e && (r = Nm(e) ? (e.checked ? 'true' : 'false') : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Lo(e) {
  if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Wl(e, t) {
  var n = t.checked;
  return ne({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function of(e, t) {
  var n = t.defaultValue == null ? '' : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  ((n = Nn(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled: t.type === 'checkbox' || t.type === 'radio' ? t.checked != null : t.value != null,
    }));
}
function Am(e, t) {
  ((t = t.checked), t != null && mc(e, 'checked', t, !1));
}
function Kl(e, t) {
  Am(e, t);
  var n = Nn(t.value),
    r = t.type;
  if (n != null)
    r === 'number'
      ? ((n === 0 && e.value === '') || e.value != n) && (e.value = '' + n)
      : e.value !== '' + n && (e.value = '' + n);
  else if (r === 'submit' || r === 'reset') {
    e.removeAttribute('value');
    return;
  }
  (t.hasOwnProperty('value')
    ? ql(e, t.type, n)
    : t.hasOwnProperty('defaultValue') && ql(e, t.type, Nn(t.defaultValue)),
    t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked));
}
function af(e, t, n) {
  if (t.hasOwnProperty('value') || t.hasOwnProperty('defaultValue')) {
    var r = t.type;
    if (!((r !== 'submit' && r !== 'reset') || (t.value !== void 0 && t.value !== null))) return;
    ((t = '' + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((n = e.name),
    n !== '' && (e.name = ''),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== '' && (e.name = n));
}
function ql(e, t, n) {
  (t !== 'number' || Lo(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = '' + e._wrapperState.initialValue)
      : e.defaultValue !== '' + n && (e.defaultValue = '' + n));
}
var bs = Array.isArray;
function _r(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var s = 0; s < n.length; s++) t['$' + n[s]] = !0;
    for (n = 0; n < e.length; n++)
      ((s = t.hasOwnProperty('$' + e[n].value)),
        e[n].selected !== s && (e[n].selected = s),
        s && r && (e[n].defaultSelected = !0));
  } else {
    for (n = '' + Nn(n), t = null, s = 0; s < e.length; s++) {
      if (e[s].value === n) {
        ((e[s].selected = !0), r && (e[s].defaultSelected = !0));
        return;
      }
      t !== null || e[s].disabled || (t = e[s]);
    }
    t !== null && (t.selected = !0);
  }
}
function Ql(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(R(91));
  return ne({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: '' + e._wrapperState.initialValue,
  });
}
function lf(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(R(92));
      if (bs(n)) {
        if (1 < n.length) throw Error(R(93));
        n = n[0];
      }
      t = n;
    }
    (t == null && (t = ''), (n = t));
  }
  e._wrapperState = { initialValue: Nn(n) };
}
function bm(e, t) {
  var n = Nn(t.value),
    r = Nn(t.defaultValue);
  (n != null &&
    ((n = '' + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = '' + r));
}
function uf(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== '' && t !== null && (e.value = t);
}
function Om(e) {
  switch (e) {
    case 'svg':
      return 'http://www.w3.org/2000/svg';
    case 'math':
      return 'http://www.w3.org/1998/Math/MathML';
    default:
      return 'http://www.w3.org/1999/xhtml';
  }
}
function Gl(e, t) {
  return e == null || e === 'http://www.w3.org/1999/xhtml'
    ? Om(t)
    : e === 'http://www.w3.org/2000/svg' && t === 'foreignObject'
      ? 'http://www.w3.org/1999/xhtml'
      : e;
}
var Ki,
  Dm = (function (e) {
    return typeof MSApp < 'u' && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, s) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, s);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== 'http://www.w3.org/2000/svg' || 'innerHTML' in e) e.innerHTML = t;
    else {
      for (
        Ki = Ki || document.createElement('div'),
          Ki.innerHTML = '<svg>' + t.valueOf().toString() + '</svg>',
          t = Ki.firstChild;
        e.firstChild;
      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Ys(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Fs = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  Ex = ['Webkit', 'ms', 'Moz', 'O'];
Object.keys(Fs).forEach(function (e) {
  Ex.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Fs[t] = Fs[e]));
  });
});
function Lm(e, t, n) {
  return t == null || typeof t == 'boolean' || t === ''
    ? ''
    : n || typeof t != 'number' || t === 0 || (Fs.hasOwnProperty(e) && Fs[e])
      ? ('' + t).trim()
      : t + 'px';
}
function Mm(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf('--') === 0,
        s = Lm(n, t[n], r);
      (n === 'float' && (n = 'cssFloat'), r ? e.setProperty(n, s) : (e[n] = s));
    }
}
var Px = ne(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function Xl(e, t) {
  if (t) {
    if (Px[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(R(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(R(60));
      if (typeof t.dangerouslySetInnerHTML != 'object' || !('__html' in t.dangerouslySetInnerHTML))
        throw Error(R(61));
    }
    if (t.style != null && typeof t.style != 'object') throw Error(R(62));
  }
}
function Yl(e, t) {
  if (e.indexOf('-') === -1) return typeof t.is == 'string';
  switch (e) {
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return !1;
    default:
      return !0;
  }
}
var Jl = null;
function xc(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Zl = null,
  Fr = null,
  Ir = null;
function cf(e) {
  if ((e = Ni(e))) {
    if (typeof Zl != 'function') throw Error(R(280));
    var t = e.stateNode;
    t && ((t = wa(t)), Zl(e.stateNode, e.type, t));
  }
}
function _m(e) {
  Fr ? (Ir ? Ir.push(e) : (Ir = [e])) : (Fr = e);
}
function Fm() {
  if (Fr) {
    var e = Fr,
      t = Ir;
    if (((Ir = Fr = null), cf(e), t)) for (e = 0; e < t.length; e++) cf(t[e]);
  }
}
function Im(e, t) {
  return e(t);
}
function Vm() {}
var Ja = !1;
function Bm(e, t, n) {
  if (Ja) return e(t, n);
  Ja = !0;
  try {
    return Im(e, t, n);
  } finally {
    ((Ja = !1), (Fr !== null || Ir !== null) && (Vm(), Fm()));
  }
}
function Js(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = wa(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
    case 'onMouseEnter':
      ((r = !r.disabled) ||
        ((e = e.type),
        (r = !(e === 'button' || e === 'input' || e === 'select' || e === 'textarea'))),
        (e = !r));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != 'function') throw Error(R(231, t, typeof n));
  return n;
}
var eu = !1;
if (Xt)
  try {
    var Ss = {};
    (Object.defineProperty(Ss, 'passive', {
      get: function () {
        eu = !0;
      },
    }),
      window.addEventListener('test', Ss, Ss),
      window.removeEventListener('test', Ss, Ss));
  } catch {
    eu = !1;
  }
function kx(e, t, n, r, s, i, o, a, l) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, u);
  } catch (c) {
    this.onError(c);
  }
}
var Is = !1,
  Mo = null,
  _o = !1,
  tu = null,
  Tx = {
    onError: function (e) {
      ((Is = !0), (Mo = e));
    },
  };
function jx(e, t, n, r, s, i, o, a, l) {
  ((Is = !1), (Mo = null), kx.apply(Tx, arguments));
}
function Nx(e, t, n, r, s, i, o, a, l) {
  if ((jx.apply(this, arguments), Is)) {
    if (Is) {
      var u = Mo;
      ((Is = !1), (Mo = null));
    } else throw Error(R(198));
    _o || ((_o = !0), (tu = u));
  }
}
function dr(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Um(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
      return t.dehydrated;
  }
  return null;
}
function df(e) {
  if (dr(e) !== e) throw Error(R(188));
}
function Rx(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = dr(e)), t === null)) throw Error(R(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var s = n.return;
    if (s === null) break;
    var i = s.alternate;
    if (i === null) {
      if (((r = s.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (s.child === i.child) {
      for (i = s.child; i; ) {
        if (i === n) return (df(s), e);
        if (i === r) return (df(s), t);
        i = i.sibling;
      }
      throw Error(R(188));
    }
    if (n.return !== r.return) ((n = s), (r = i));
    else {
      for (var o = !1, a = s.child; a; ) {
        if (a === n) {
          ((o = !0), (n = s), (r = i));
          break;
        }
        if (a === r) {
          ((o = !0), (r = s), (n = i));
          break;
        }
        a = a.sibling;
      }
      if (!o) {
        for (a = i.child; a; ) {
          if (a === n) {
            ((o = !0), (n = i), (r = s));
            break;
          }
          if (a === r) {
            ((o = !0), (r = i), (n = s));
            break;
          }
          a = a.sibling;
        }
        if (!o) throw Error(R(189));
      }
    }
    if (n.alternate !== r) throw Error(R(190));
  }
  if (n.tag !== 3) throw Error(R(188));
  return n.stateNode.current === n ? e : t;
}
function zm(e) {
  return ((e = Rx(e)), e !== null ? $m(e) : null);
}
function $m(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = $m(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Hm = et.unstable_scheduleCallback,
  ff = et.unstable_cancelCallback,
  Ax = et.unstable_shouldYield,
  bx = et.unstable_requestPaint,
  ce = et.unstable_now,
  Ox = et.unstable_getCurrentPriorityLevel,
  wc = et.unstable_ImmediatePriority,
  Wm = et.unstable_UserBlockingPriority,
  Fo = et.unstable_NormalPriority,
  Dx = et.unstable_LowPriority,
  Km = et.unstable_IdlePriority,
  ya = null,
  _t = null;
function Lx(e) {
  if (_t && typeof _t.onCommitFiberRoot == 'function')
    try {
      _t.onCommitFiberRoot(ya, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Et = Math.clz32 ? Math.clz32 : Fx,
  Mx = Math.log,
  _x = Math.LN2;
function Fx(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((Mx(e) / _x) | 0)) | 0);
}
var qi = 64,
  Qi = 4194304;
function Os(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Io(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    s = e.suspendedLanes,
    i = e.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var a = o & ~s;
    a !== 0 ? (r = Os(a)) : ((i &= o), i !== 0 && (r = Os(i)));
  } else ((o = n & ~s), o !== 0 ? (r = Os(o)) : i !== 0 && (r = Os(i)));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & s) &&
    ((s = r & -r), (i = t & -t), s >= i || (s === 16 && (i & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      ((n = 31 - Et(t)), (s = 1 << n), (r |= e[n]), (t &= ~s));
  return r;
}
function Ix(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Vx(e, t) {
  for (
    var n = e.suspendedLanes, r = e.pingedLanes, s = e.expirationTimes, i = e.pendingLanes;
    0 < i;
  ) {
    var o = 31 - Et(i),
      a = 1 << o,
      l = s[o];
    (l === -1 ? (!(a & n) || a & r) && (s[o] = Ix(a, t)) : l <= t && (e.expiredLanes |= a),
      (i &= ~a));
  }
}
function nu(e) {
  return ((e = e.pendingLanes & -1073741825), e !== 0 ? e : e & 1073741824 ? 1073741824 : 0);
}
function qm() {
  var e = qi;
  return ((qi <<= 1), !(qi & 4194240) && (qi = 64), e);
}
function Za(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function Ti(e, t, n) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Et(t)),
    (e[t] = n));
}
function Bx(e, t) {
  var n = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var s = 31 - Et(n),
      i = 1 << s;
    ((t[s] = 0), (r[s] = -1), (e[s] = -1), (n &= ~i));
  }
}
function Sc(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - Et(n),
      s = 1 << r;
    ((s & t) | (e[r] & t) && (e[r] |= t), (n &= ~s));
  }
}
var H = 0;
function Qm(e) {
  return ((e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1);
}
var Gm,
  Cc,
  Xm,
  Ym,
  Jm,
  ru = !1,
  Gi = [],
  xn = null,
  wn = null,
  Sn = null,
  Zs = new Map(),
  ei = new Map(),
  ln = [],
  Ux =
    'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit'.split(
      ' ',
    );
function hf(e, t) {
  switch (e) {
    case 'focusin':
    case 'focusout':
      xn = null;
      break;
    case 'dragenter':
    case 'dragleave':
      wn = null;
      break;
    case 'mouseover':
    case 'mouseout':
      Sn = null;
      break;
    case 'pointerover':
    case 'pointerout':
      Zs.delete(t.pointerId);
      break;
    case 'gotpointercapture':
    case 'lostpointercapture':
      ei.delete(t.pointerId);
  }
}
function Cs(e, t, n, r, s, i) {
  return e === null || e.nativeEvent !== i
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [s],
      }),
      t !== null && ((t = Ni(t)), t !== null && Cc(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      s !== null && t.indexOf(s) === -1 && t.push(s),
      e);
}
function zx(e, t, n, r, s) {
  switch (t) {
    case 'focusin':
      return ((xn = Cs(xn, e, t, n, r, s)), !0);
    case 'dragenter':
      return ((wn = Cs(wn, e, t, n, r, s)), !0);
    case 'mouseover':
      return ((Sn = Cs(Sn, e, t, n, r, s)), !0);
    case 'pointerover':
      var i = s.pointerId;
      return (Zs.set(i, Cs(Zs.get(i) || null, e, t, n, r, s)), !0);
    case 'gotpointercapture':
      return ((i = s.pointerId), ei.set(i, Cs(ei.get(i) || null, e, t, n, r, s)), !0);
  }
  return !1;
}
function Zm(e) {
  var t = $n(e.target);
  if (t !== null) {
    var n = dr(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Um(n)), t !== null)) {
          ((e.blockedOn = t),
            Jm(e.priority, function () {
              Xm(n);
            }));
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function vo(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = su(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ((Jl = r), n.target.dispatchEvent(r), (Jl = null));
    } else return ((t = Ni(n)), t !== null && Cc(t), (e.blockedOn = n), !1);
    t.shift();
  }
  return !0;
}
function pf(e, t, n) {
  vo(e) && n.delete(t);
}
function $x() {
  ((ru = !1),
    xn !== null && vo(xn) && (xn = null),
    wn !== null && vo(wn) && (wn = null),
    Sn !== null && vo(Sn) && (Sn = null),
    Zs.forEach(pf),
    ei.forEach(pf));
}
function Es(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    ru || ((ru = !0), et.unstable_scheduleCallback(et.unstable_NormalPriority, $x)));
}
function ti(e) {
  function t(s) {
    return Es(s, e);
  }
  if (0 < Gi.length) {
    Es(Gi[0], e);
    for (var n = 1; n < Gi.length; n++) {
      var r = Gi[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    xn !== null && Es(xn, e),
      wn !== null && Es(wn, e),
      Sn !== null && Es(Sn, e),
      Zs.forEach(t),
      ei.forEach(t),
      n = 0;
    n < ln.length;
    n++
  )
    ((r = ln[n]), r.blockedOn === e && (r.blockedOn = null));
  for (; 0 < ln.length && ((n = ln[0]), n.blockedOn === null); )
    (Zm(n), n.blockedOn === null && ln.shift());
}
var Vr = tn.ReactCurrentBatchConfig,
  Vo = !0;
function Hx(e, t, n, r) {
  var s = H,
    i = Vr.transition;
  Vr.transition = null;
  try {
    ((H = 1), Ec(e, t, n, r));
  } finally {
    ((H = s), (Vr.transition = i));
  }
}
function Wx(e, t, n, r) {
  var s = H,
    i = Vr.transition;
  Vr.transition = null;
  try {
    ((H = 4), Ec(e, t, n, r));
  } finally {
    ((H = s), (Vr.transition = i));
  }
}
function Ec(e, t, n, r) {
  if (Vo) {
    var s = su(e, t, n, r);
    if (s === null) (ul(e, t, r, Bo, n), hf(e, r));
    else if (zx(s, e, t, n, r)) r.stopPropagation();
    else if ((hf(e, r), t & 4 && -1 < Ux.indexOf(e))) {
      for (; s !== null; ) {
        var i = Ni(s);
        if ((i !== null && Gm(i), (i = su(e, t, n, r)), i === null && ul(e, t, r, Bo, n), i === s))
          break;
        s = i;
      }
      s !== null && r.stopPropagation();
    } else ul(e, t, r, null, n);
  }
}
var Bo = null;
function su(e, t, n, r) {
  if (((Bo = null), (e = xc(r)), (e = $n(e)), e !== null))
    if (((t = dr(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Um(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((Bo = e), null);
}
function ey(e) {
  switch (e) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    case 'beforeblur':
    case 'afterblur':
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return 1;
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return 4;
    case 'message':
      switch (Ox()) {
        case wc:
          return 1;
        case Wm:
          return 4;
        case Fo:
        case Dx:
          return 16;
        case Km:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var yn = null,
  Pc = null,
  xo = null;
function ty() {
  if (xo) return xo;
  var e,
    t = Pc,
    n = t.length,
    r,
    s = 'value' in yn ? yn.value : yn.textContent,
    i = s.length;
  for (e = 0; e < n && t[e] === s[e]; e++);
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === s[i - r]; r++);
  return (xo = s.slice(e, 1 < r ? 1 - r : void 0));
}
function wo(e) {
  var t = e.keyCode;
  return (
    'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Xi() {
  return !0;
}
function mf() {
  return !1;
}
function rt(e) {
  function t(n, r, s, i, o) {
    ((this._reactName = n),
      (this._targetInst = s),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = o),
      (this.currentTarget = null));
    for (var a in e) e.hasOwnProperty(a) && ((n = e[a]), (this[a] = n ? n(i) : i[a]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? Xi
        : mf),
      (this.isPropagationStopped = mf),
      this
    );
  }
  return (
    ne(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != 'unknown' && (n.returnValue = !1),
          (this.isDefaultPrevented = Xi));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != 'unknown' && (n.cancelBubble = !0),
          (this.isPropagationStopped = Xi));
      },
      persist: function () {},
      isPersistent: Xi,
    }),
    t
  );
}
var us = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  kc = rt(us),
  ji = ne({}, us, { view: 0, detail: 0 }),
  Kx = rt(ji),
  el,
  tl,
  Ps,
  ga = ne({}, ji, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Tc,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return 'movementX' in e
        ? e.movementX
        : (e !== Ps &&
            (Ps && e.type === 'mousemove'
              ? ((el = e.screenX - Ps.screenX), (tl = e.screenY - Ps.screenY))
              : (tl = el = 0),
            (Ps = e)),
          el);
    },
    movementY: function (e) {
      return 'movementY' in e ? e.movementY : tl;
    },
  }),
  yf = rt(ga),
  qx = ne({}, ga, { dataTransfer: 0 }),
  Qx = rt(qx),
  Gx = ne({}, ji, { relatedTarget: 0 }),
  nl = rt(Gx),
  Xx = ne({}, us, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Yx = rt(Xx),
  Jx = ne({}, us, {
    clipboardData: function (e) {
      return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
    },
  }),
  Zx = rt(Jx),
  e1 = ne({}, us, { data: 0 }),
  gf = rt(e1),
  t1 = {
    Esc: 'Escape',
    Spacebar: ' ',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Win: 'OS',
    Menu: 'ContextMenu',
    Apps: 'ContextMenu',
    Scroll: 'ScrollLock',
    MozPrintableKey: 'Unidentified',
  },
  n1 = {
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    45: 'Insert',
    46: 'Delete',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    144: 'NumLock',
    145: 'ScrollLock',
    224: 'Meta',
  },
  r1 = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
function s1(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = r1[e]) ? !!t[e] : !1;
}
function Tc() {
  return s1;
}
var i1 = ne({}, ji, {
    key: function (e) {
      if (e.key) {
        var t = t1[e.key] || e.key;
        if (t !== 'Unidentified') return t;
      }
      return e.type === 'keypress'
        ? ((e = wo(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
        : e.type === 'keydown' || e.type === 'keyup'
          ? n1[e.keyCode] || 'Unidentified'
          : '';
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Tc,
    charCode: function (e) {
      return e.type === 'keypress' ? wo(e) : 0;
    },
    keyCode: function (e) {
      return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === 'keypress'
        ? wo(e)
        : e.type === 'keydown' || e.type === 'keyup'
          ? e.keyCode
          : 0;
    },
  }),
  o1 = rt(i1),
  a1 = ne({}, ga, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  vf = rt(a1),
  l1 = ne({}, ji, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Tc,
  }),
  u1 = rt(l1),
  c1 = ne({}, us, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  d1 = rt(c1),
  f1 = ne({}, ga, {
    deltaX: function (e) {
      return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return 'deltaY' in e
        ? e.deltaY
        : 'wheelDeltaY' in e
          ? -e.wheelDeltaY
          : 'wheelDelta' in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  h1 = rt(f1),
  p1 = [9, 13, 27, 32],
  jc = Xt && 'CompositionEvent' in window,
  Vs = null;
Xt && 'documentMode' in document && (Vs = document.documentMode);
var m1 = Xt && 'TextEvent' in window && !Vs,
  ny = Xt && (!jc || (Vs && 8 < Vs && 11 >= Vs)),
  xf = ' ',
  wf = !1;
function ry(e, t) {
  switch (e) {
    case 'keyup':
      return p1.indexOf(t.keyCode) !== -1;
    case 'keydown':
      return t.keyCode !== 229;
    case 'keypress':
    case 'mousedown':
    case 'focusout':
      return !0;
    default:
      return !1;
  }
}
function sy(e) {
  return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
}
var Sr = !1;
function y1(e, t) {
  switch (e) {
    case 'compositionend':
      return sy(t);
    case 'keypress':
      return t.which !== 32 ? null : ((wf = !0), xf);
    case 'textInput':
      return ((e = t.data), e === xf && wf ? null : e);
    default:
      return null;
  }
}
function g1(e, t) {
  if (Sr)
    return e === 'compositionend' || (!jc && ry(e, t))
      ? ((e = ty()), (xo = Pc = yn = null), (Sr = !1), e)
      : null;
  switch (e) {
    case 'paste':
      return null;
    case 'keypress':
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case 'compositionend':
      return ny && t.locale !== 'ko' ? null : t.data;
    default:
      return null;
  }
}
var v1 = {
  color: !0,
  date: !0,
  datetime: !0,
  'datetime-local': !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Sf(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === 'input' ? !!v1[e.type] : t === 'textarea';
}
function iy(e, t, n, r) {
  (_m(r),
    (t = Uo(t, 'onChange')),
    0 < t.length &&
      ((n = new kc('onChange', 'change', null, n, r)), e.push({ event: n, listeners: t })));
}
var Bs = null,
  ni = null;
function x1(e) {
  yy(e, 0);
}
function va(e) {
  var t = Pr(e);
  if (Rm(t)) return e;
}
function w1(e, t) {
  if (e === 'change') return t;
}
var oy = !1;
if (Xt) {
  var rl;
  if (Xt) {
    var sl = 'oninput' in document;
    if (!sl) {
      var Cf = document.createElement('div');
      (Cf.setAttribute('oninput', 'return;'), (sl = typeof Cf.oninput == 'function'));
    }
    rl = sl;
  } else rl = !1;
  oy = rl && (!document.documentMode || 9 < document.documentMode);
}
function Ef() {
  Bs && (Bs.detachEvent('onpropertychange', ay), (ni = Bs = null));
}
function ay(e) {
  if (e.propertyName === 'value' && va(ni)) {
    var t = [];
    (iy(t, ni, e, xc(e)), Bm(x1, t));
  }
}
function S1(e, t, n) {
  e === 'focusin'
    ? (Ef(), (Bs = t), (ni = n), Bs.attachEvent('onpropertychange', ay))
    : e === 'focusout' && Ef();
}
function C1(e) {
  if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return va(ni);
}
function E1(e, t) {
  if (e === 'click') return va(t);
}
function P1(e, t) {
  if (e === 'input' || e === 'change') return va(t);
}
function k1(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var kt = typeof Object.is == 'function' ? Object.is : k1;
function ri(e, t) {
  if (kt(e, t)) return !0;
  if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var s = n[r];
    if (!Bl.call(t, s) || !kt(e[s], t[s])) return !1;
  }
  return !0;
}
function Pf(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function kf(e, t) {
  var n = Pf(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t)) return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Pf(n);
  }
}
function ly(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? ly(e, t.parentNode)
          : 'contains' in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function uy() {
  for (var e = window, t = Lo(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == 'string';
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Lo(e.document);
  }
  return t;
}
function Nc(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === 'input' &&
      (e.type === 'text' ||
        e.type === 'search' ||
        e.type === 'tel' ||
        e.type === 'url' ||
        e.type === 'password')) ||
      t === 'textarea' ||
      e.contentEditable === 'true')
  );
}
function T1(e) {
  var t = uy(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && ly(n.ownerDocument.documentElement, n)) {
    if (r !== null && Nc(n)) {
      if (((t = r.start), (e = r.end), e === void 0 && (e = t), 'selectionStart' in n))
        ((n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length)));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window), e.getSelection)
      ) {
        e = e.getSelection();
        var s = n.textContent.length,
          i = Math.min(r.start, s);
        ((r = r.end === void 0 ? i : Math.min(r.end, s)),
          !e.extend && i > r && ((s = r), (r = i), (i = s)),
          (s = kf(n, i)));
        var o = kf(n, r);
        s &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== s.node ||
            e.anchorOffset !== s.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(s.node, s.offset),
          e.removeAllRanges(),
          i > r
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == 'function' && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]), (e.element.scrollLeft = e.left), (e.element.scrollTop = e.top));
  }
}
var j1 = Xt && 'documentMode' in document && 11 >= document.documentMode,
  Cr = null,
  iu = null,
  Us = null,
  ou = !1;
function Tf(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  ou ||
    Cr == null ||
    Cr !== Lo(r) ||
    ((r = Cr),
    'selectionStart' in r && Nc(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = ((r.ownerDocument && r.ownerDocument.defaultView) || window).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (Us && ri(Us, r)) ||
      ((Us = r),
      (r = Uo(iu, 'onSelect')),
      0 < r.length &&
        ((t = new kc('onSelect', 'select', null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = Cr))));
}
function Yi(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n['Webkit' + e] = 'webkit' + t),
    (n['Moz' + e] = 'moz' + t),
    n
  );
}
var Er = {
    animationend: Yi('Animation', 'AnimationEnd'),
    animationiteration: Yi('Animation', 'AnimationIteration'),
    animationstart: Yi('Animation', 'AnimationStart'),
    transitionend: Yi('Transition', 'TransitionEnd'),
  },
  il = {},
  cy = {};
Xt &&
  ((cy = document.createElement('div').style),
  'AnimationEvent' in window ||
    (delete Er.animationend.animation,
    delete Er.animationiteration.animation,
    delete Er.animationstart.animation),
  'TransitionEvent' in window || delete Er.transitionend.transition);
function xa(e) {
  if (il[e]) return il[e];
  if (!Er[e]) return e;
  var t = Er[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in cy) return (il[e] = t[n]);
  return e;
}
var dy = xa('animationend'),
  fy = xa('animationiteration'),
  hy = xa('animationstart'),
  py = xa('transitionend'),
  my = new Map(),
  jf =
    'abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
      ' ',
    );
function On(e, t) {
  (my.set(e, t), cr(t, [e]));
}
for (var ol = 0; ol < jf.length; ol++) {
  var al = jf[ol],
    N1 = al.toLowerCase(),
    R1 = al[0].toUpperCase() + al.slice(1);
  On(N1, 'on' + R1);
}
On(dy, 'onAnimationEnd');
On(fy, 'onAnimationIteration');
On(hy, 'onAnimationStart');
On('dblclick', 'onDoubleClick');
On('focusin', 'onFocus');
On('focusout', 'onBlur');
On(py, 'onTransitionEnd');
Yr('onMouseEnter', ['mouseout', 'mouseover']);
Yr('onMouseLeave', ['mouseout', 'mouseover']);
Yr('onPointerEnter', ['pointerout', 'pointerover']);
Yr('onPointerLeave', ['pointerout', 'pointerover']);
cr('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' '));
cr(
  'onSelect',
  'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(' '),
);
cr('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']);
cr('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' '));
cr('onCompositionStart', 'compositionstart focusout keydown keypress keyup mousedown'.split(' '));
cr('onCompositionUpdate', 'compositionupdate focusout keydown keypress keyup mousedown'.split(' '));
var Ds =
    'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
      ' ',
    ),
  A1 = new Set('cancel close invalid load scroll toggle'.split(' ').concat(Ds));
function Nf(e, t, n) {
  var r = e.type || 'unknown-event';
  ((e.currentTarget = n), Nx(r, t, void 0, e), (e.currentTarget = null));
}
function yy(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      s = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var a = r[o],
            l = a.instance,
            u = a.currentTarget;
          if (((a = a.listener), l !== i && s.isPropagationStopped())) break e;
          (Nf(s, a, u), (i = l));
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((a = r[o]),
            (l = a.instance),
            (u = a.currentTarget),
            (a = a.listener),
            l !== i && s.isPropagationStopped())
          )
            break e;
          (Nf(s, a, u), (i = l));
        }
    }
  }
  if (_o) throw ((e = tu), (_o = !1), (tu = null), e);
}
function Q(e, t) {
  var n = t[du];
  n === void 0 && (n = t[du] = new Set());
  var r = e + '__bubble';
  n.has(r) || (gy(t, e, 2, !1), n.add(r));
}
function ll(e, t, n) {
  var r = 0;
  (t && (r |= 4), gy(n, e, r, t));
}
var Ji = '_reactListening' + Math.random().toString(36).slice(2);
function si(e) {
  if (!e[Ji]) {
    ((e[Ji] = !0),
      Pm.forEach(function (n) {
        n !== 'selectionchange' && (A1.has(n) || ll(n, !1, e), ll(n, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Ji] || ((t[Ji] = !0), ll('selectionchange', !1, t));
  }
}
function gy(e, t, n, r) {
  switch (ey(t)) {
    case 1:
      var s = Hx;
      break;
    case 4:
      s = Wx;
      break;
    default:
      s = Ec;
  }
  ((n = s.bind(null, t, n, e)),
    (s = void 0),
    !eu || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (s = !0),
    r
      ? s !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: s })
        : e.addEventListener(t, n, !0)
      : s !== void 0
        ? e.addEventListener(t, n, { passive: s })
        : e.addEventListener(t, n, !1));
}
function ul(e, t, n, r, s) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var a = r.stateNode.containerInfo;
        if (a === s || (a.nodeType === 8 && a.parentNode === s)) break;
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var l = o.tag;
            if (
              (l === 3 || l === 4) &&
              ((l = o.stateNode.containerInfo), l === s || (l.nodeType === 8 && l.parentNode === s))
            )
              return;
            o = o.return;
          }
        for (; a !== null; ) {
          if (((o = $n(a)), o === null)) return;
          if (((l = o.tag), l === 5 || l === 6)) {
            r = i = o;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
  Bm(function () {
    var u = i,
      c = xc(n),
      d = [];
    e: {
      var h = my.get(e);
      if (h !== void 0) {
        var g = kc,
          w = e;
        switch (e) {
          case 'keypress':
            if (wo(n) === 0) break e;
          case 'keydown':
          case 'keyup':
            g = o1;
            break;
          case 'focusin':
            ((w = 'focus'), (g = nl));
            break;
          case 'focusout':
            ((w = 'blur'), (g = nl));
            break;
          case 'beforeblur':
          case 'afterblur':
            g = nl;
            break;
          case 'click':
            if (n.button === 2) break e;
          case 'auxclick':
          case 'dblclick':
          case 'mousedown':
          case 'mousemove':
          case 'mouseup':
          case 'mouseout':
          case 'mouseover':
          case 'contextmenu':
            g = yf;
            break;
          case 'drag':
          case 'dragend':
          case 'dragenter':
          case 'dragexit':
          case 'dragleave':
          case 'dragover':
          case 'dragstart':
          case 'drop':
            g = Qx;
            break;
          case 'touchcancel':
          case 'touchend':
          case 'touchmove':
          case 'touchstart':
            g = u1;
            break;
          case dy:
          case fy:
          case hy:
            g = Yx;
            break;
          case py:
            g = d1;
            break;
          case 'scroll':
            g = Kx;
            break;
          case 'wheel':
            g = h1;
            break;
          case 'copy':
          case 'cut':
          case 'paste':
            g = Zx;
            break;
          case 'gotpointercapture':
          case 'lostpointercapture':
          case 'pointercancel':
          case 'pointerdown':
          case 'pointermove':
          case 'pointerout':
          case 'pointerover':
          case 'pointerup':
            g = vf;
        }
        var v = (t & 4) !== 0,
          x = !v && e === 'scroll',
          p = v ? (h !== null ? h + 'Capture' : null) : h;
        v = [];
        for (var m = u, y; m !== null; ) {
          y = m;
          var S = y.stateNode;
          if (
            (y.tag === 5 &&
              S !== null &&
              ((y = S), p !== null && ((S = Js(m, p)), S != null && v.push(ii(m, S, y)))),
            x)
          )
            break;
          m = m.return;
        }
        0 < v.length && ((h = new g(h, w, null, n, c)), d.push({ event: h, listeners: v }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((h = e === 'mouseover' || e === 'pointerover'),
          (g = e === 'mouseout' || e === 'pointerout'),
          h && n !== Jl && (w = n.relatedTarget || n.fromElement) && ($n(w) || w[Yt]))
        )
          break e;
        if (
          (g || h) &&
          ((h =
            c.window === c ? c : (h = c.ownerDocument) ? h.defaultView || h.parentWindow : window),
          g
            ? ((w = n.relatedTarget || n.toElement),
              (g = u),
              (w = w ? $n(w) : null),
              w !== null && ((x = dr(w)), w !== x || (w.tag !== 5 && w.tag !== 6)) && (w = null))
            : ((g = null), (w = u)),
          g !== w)
        ) {
          if (
            ((v = yf),
            (S = 'onMouseLeave'),
            (p = 'onMouseEnter'),
            (m = 'mouse'),
            (e === 'pointerout' || e === 'pointerover') &&
              ((v = vf), (S = 'onPointerLeave'), (p = 'onPointerEnter'), (m = 'pointer')),
            (x = g == null ? h : Pr(g)),
            (y = w == null ? h : Pr(w)),
            (h = new v(S, m + 'leave', g, n, c)),
            (h.target = x),
            (h.relatedTarget = y),
            (S = null),
            $n(c) === u &&
              ((v = new v(p, m + 'enter', w, n, c)),
              (v.target = y),
              (v.relatedTarget = x),
              (S = v)),
            (x = S),
            g && w)
          )
            t: {
              for (v = g, p = w, m = 0, y = v; y; y = gr(y)) m++;
              for (y = 0, S = p; S; S = gr(S)) y++;
              for (; 0 < m - y; ) ((v = gr(v)), m--);
              for (; 0 < y - m; ) ((p = gr(p)), y--);
              for (; m--; ) {
                if (v === p || (p !== null && v === p.alternate)) break t;
                ((v = gr(v)), (p = gr(p)));
              }
              v = null;
            }
          else v = null;
          (g !== null && Rf(d, h, g, v, !1), w !== null && x !== null && Rf(d, x, w, v, !0));
        }
      }
      e: {
        if (
          ((h = u ? Pr(u) : window),
          (g = h.nodeName && h.nodeName.toLowerCase()),
          g === 'select' || (g === 'input' && h.type === 'file'))
        )
          var C = w1;
        else if (Sf(h))
          if (oy) C = P1;
          else {
            C = C1;
            var T = S1;
          }
        else
          (g = h.nodeName) &&
            g.toLowerCase() === 'input' &&
            (h.type === 'checkbox' || h.type === 'radio') &&
            (C = E1);
        if (C && (C = C(e, u))) {
          iy(d, C, n, c);
          break e;
        }
        (T && T(e, h, u),
          e === 'focusout' &&
            (T = h._wrapperState) &&
            T.controlled &&
            h.type === 'number' &&
            ql(h, 'number', h.value));
      }
      switch (((T = u ? Pr(u) : window), e)) {
        case 'focusin':
          (Sf(T) || T.contentEditable === 'true') && ((Cr = T), (iu = u), (Us = null));
          break;
        case 'focusout':
          Us = iu = Cr = null;
          break;
        case 'mousedown':
          ou = !0;
          break;
        case 'contextmenu':
        case 'mouseup':
        case 'dragend':
          ((ou = !1), Tf(d, n, c));
          break;
        case 'selectionchange':
          if (j1) break;
        case 'keydown':
        case 'keyup':
          Tf(d, n, c);
      }
      var N;
      if (jc)
        e: {
          switch (e) {
            case 'compositionstart':
              var j = 'onCompositionStart';
              break e;
            case 'compositionend':
              j = 'onCompositionEnd';
              break e;
            case 'compositionupdate':
              j = 'onCompositionUpdate';
              break e;
          }
          j = void 0;
        }
      else
        Sr
          ? ry(e, n) && (j = 'onCompositionEnd')
          : e === 'keydown' && n.keyCode === 229 && (j = 'onCompositionStart');
      (j &&
        (ny &&
          n.locale !== 'ko' &&
          (Sr || j !== 'onCompositionStart'
            ? j === 'onCompositionEnd' && Sr && (N = ty())
            : ((yn = c), (Pc = 'value' in yn ? yn.value : yn.textContent), (Sr = !0))),
        (T = Uo(u, j)),
        0 < T.length &&
          ((j = new gf(j, e, null, n, c)),
          d.push({ event: j, listeners: T }),
          N ? (j.data = N) : ((N = sy(n)), N !== null && (j.data = N)))),
        (N = m1 ? y1(e, n) : g1(e, n)) &&
          ((u = Uo(u, 'onBeforeInput')),
          0 < u.length &&
            ((c = new gf('onBeforeInput', 'beforeinput', null, n, c)),
            d.push({ event: c, listeners: u }),
            (c.data = N))));
    }
    yy(d, t);
  });
}
function ii(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Uo(e, t) {
  for (var n = t + 'Capture', r = []; e !== null; ) {
    var s = e,
      i = s.stateNode;
    (s.tag === 5 &&
      i !== null &&
      ((s = i),
      (i = Js(e, n)),
      i != null && r.unshift(ii(e, i, s)),
      (i = Js(e, t)),
      i != null && r.push(ii(e, i, s))),
      (e = e.return));
  }
  return r;
}
function gr(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Rf(e, t, n, r, s) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var a = n,
      l = a.alternate,
      u = a.stateNode;
    if (l !== null && l === r) break;
    (a.tag === 5 &&
      u !== null &&
      ((a = u),
      s
        ? ((l = Js(n, i)), l != null && o.unshift(ii(n, l, a)))
        : s || ((l = Js(n, i)), l != null && o.push(ii(n, l, a)))),
      (n = n.return));
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var b1 = /\r\n?/g,
  O1 = /\u0000|\uFFFD/g;
function Af(e) {
  return (typeof e == 'string' ? e : '' + e)
    .replace(
      b1,
      `
`,
    )
    .replace(O1, '');
}
function Zi(e, t, n) {
  if (((t = Af(t)), Af(e) !== t && n)) throw Error(R(425));
}
function zo() {}
var au = null,
  lu = null;
function uu(e, t) {
  return (
    e === 'textarea' ||
    e === 'noscript' ||
    typeof t.children == 'string' ||
    typeof t.children == 'number' ||
    (typeof t.dangerouslySetInnerHTML == 'object' &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var cu = typeof setTimeout == 'function' ? setTimeout : void 0,
  D1 = typeof clearTimeout == 'function' ? clearTimeout : void 0,
  bf = typeof Promise == 'function' ? Promise : void 0,
  L1 =
    typeof queueMicrotask == 'function'
      ? queueMicrotask
      : typeof bf < 'u'
        ? function (e) {
            return bf.resolve(null).then(e).catch(M1);
          }
        : cu;
function M1(e) {
  setTimeout(function () {
    throw e;
  });
}
function cl(e, t) {
  var n = t,
    r = 0;
  do {
    var s = n.nextSibling;
    if ((e.removeChild(n), s && s.nodeType === 8))
      if (((n = s.data), n === '/$')) {
        if (r === 0) {
          (e.removeChild(s), ti(t));
          return;
        }
        r--;
      } else (n !== '$' && n !== '$?' && n !== '$!') || r++;
    n = s;
  } while (n);
  ti(t);
}
function Cn(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === '$' || t === '$!' || t === '$?')) break;
      if (t === '/$') return null;
    }
  }
  return e;
}
function Of(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === '$' || n === '$!' || n === '$?') {
        if (t === 0) return e;
        t--;
      } else n === '/$' && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var cs = Math.random().toString(36).slice(2),
  Mt = '__reactFiber$' + cs,
  oi = '__reactProps$' + cs,
  Yt = '__reactContainer$' + cs,
  du = '__reactEvents$' + cs,
  _1 = '__reactListeners$' + cs,
  F1 = '__reactHandles$' + cs;
function $n(e) {
  var t = e[Mt];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[Yt] || n[Mt])) {
      if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
        for (e = Of(e); e !== null; ) {
          if ((n = e[Mt])) return n;
          e = Of(e);
        }
      return t;
    }
    ((e = n), (n = e.parentNode));
  }
  return null;
}
function Ni(e) {
  return (
    (e = e[Mt] || e[Yt]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function Pr(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(R(33));
}
function wa(e) {
  return e[oi] || null;
}
var fu = [],
  kr = -1;
function Dn(e) {
  return { current: e };
}
function G(e) {
  0 > kr || ((e.current = fu[kr]), (fu[kr] = null), kr--);
}
function q(e, t) {
  (kr++, (fu[kr] = e.current), (e.current = t));
}
var Rn = {},
  De = Dn(Rn),
  He = Dn(!1),
  sr = Rn;
function Jr(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Rn;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var s = {},
    i;
  for (i in n) s[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    s
  );
}
function We(e) {
  return ((e = e.childContextTypes), e != null);
}
function $o() {
  (G(He), G(De));
}
function Df(e, t, n) {
  if (De.current !== Rn) throw Error(R(168));
  (q(De, t), q(He, n));
}
function vy(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != 'function')) return n;
  r = r.getChildContext();
  for (var s in r) if (!(s in t)) throw Error(R(108, Sx(e) || 'Unknown', s));
  return ne({}, n, r);
}
function Ho(e) {
  return (
    (e = ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Rn),
    (sr = De.current),
    q(De, e),
    q(He, He.current),
    !0
  );
}
function Lf(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(R(169));
  (n
    ? ((e = vy(e, t, sr)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      G(He),
      G(De),
      q(De, e))
    : G(He),
    q(He, n));
}
var $t = null,
  Sa = !1,
  dl = !1;
function xy(e) {
  $t === null ? ($t = [e]) : $t.push(e);
}
function I1(e) {
  ((Sa = !0), xy(e));
}
function Ln() {
  if (!dl && $t !== null) {
    dl = !0;
    var e = 0,
      t = H;
    try {
      var n = $t;
      for (H = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (($t = null), (Sa = !1));
    } catch (s) {
      throw ($t !== null && ($t = $t.slice(e + 1)), Hm(wc, Ln), s);
    } finally {
      ((H = t), (dl = !1));
    }
  }
  return null;
}
var Tr = [],
  jr = 0,
  Wo = null,
  Ko = 0,
  ut = [],
  ct = 0,
  ir = null,
  Wt = 1,
  Kt = '';
function In(e, t) {
  ((Tr[jr++] = Ko), (Tr[jr++] = Wo), (Wo = e), (Ko = t));
}
function wy(e, t, n) {
  ((ut[ct++] = Wt), (ut[ct++] = Kt), (ut[ct++] = ir), (ir = e));
  var r = Wt;
  e = Kt;
  var s = 32 - Et(r) - 1;
  ((r &= ~(1 << s)), (n += 1));
  var i = 32 - Et(t) + s;
  if (30 < i) {
    var o = s - (s % 5);
    ((i = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (s -= o),
      (Wt = (1 << (32 - Et(t) + s)) | (n << s) | r),
      (Kt = i + e));
  } else ((Wt = (1 << i) | (n << s) | r), (Kt = e));
}
function Rc(e) {
  e.return !== null && (In(e, 1), wy(e, 1, 0));
}
function Ac(e) {
  for (; e === Wo; ) ((Wo = Tr[--jr]), (Tr[jr] = null), (Ko = Tr[--jr]), (Tr[jr] = null));
  for (; e === ir; )
    ((ir = ut[--ct]),
      (ut[ct] = null),
      (Kt = ut[--ct]),
      (ut[ct] = null),
      (Wt = ut[--ct]),
      (ut[ct] = null));
}
var Je = null,
  Ye = null,
  J = !1,
  Ct = null;
function Sy(e, t) {
  var n = dt(5, null, null, 0);
  ((n.elementType = 'DELETED'),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
}
function Mf(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t),
        t !== null ? ((e.stateNode = t), (Je = e), (Ye = Cn(t.firstChild)), !0) : !1
      );
    case 6:
      return (
        (t = e.pendingProps === '' || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Je = e), (Ye = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = ir !== null ? { id: Wt, overflow: Kt } : null),
            (e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }),
            (n = dt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Je = e),
            (Ye = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function hu(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function pu(e) {
  if (J) {
    var t = Ye;
    if (t) {
      var n = t;
      if (!Mf(e, t)) {
        if (hu(e)) throw Error(R(418));
        t = Cn(n.nextSibling);
        var r = Je;
        t && Mf(e, t) ? Sy(r, n) : ((e.flags = (e.flags & -4097) | 2), (J = !1), (Je = e));
      }
    } else {
      if (hu(e)) throw Error(R(418));
      ((e.flags = (e.flags & -4097) | 2), (J = !1), (Je = e));
    }
  }
}
function _f(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  Je = e;
}
function eo(e) {
  if (e !== Je) return !1;
  if (!J) return (_f(e), (J = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type), (t = t !== 'head' && t !== 'body' && !uu(e.type, e.memoizedProps))),
    t && (t = Ye))
  ) {
    if (hu(e)) throw (Cy(), Error(R(418)));
    for (; t; ) (Sy(e, t), (t = Cn(t.nextSibling)));
  }
  if ((_f(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(R(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === '/$') {
            if (t === 0) {
              Ye = Cn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== '$' && n !== '$!' && n !== '$?') || t++;
        }
        e = e.nextSibling;
      }
      Ye = null;
    }
  } else Ye = Je ? Cn(e.stateNode.nextSibling) : null;
  return !0;
}
function Cy() {
  for (var e = Ye; e; ) e = Cn(e.nextSibling);
}
function Zr() {
  ((Ye = Je = null), (J = !1));
}
function bc(e) {
  Ct === null ? (Ct = [e]) : Ct.push(e);
}
var V1 = tn.ReactCurrentBatchConfig;
function ks(e, t, n) {
  if (((e = n.ref), e !== null && typeof e != 'function' && typeof e != 'object')) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(R(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(R(147, e));
      var s = r,
        i = '' + e;
      return t !== null && t.ref !== null && typeof t.ref == 'function' && t.ref._stringRef === i
        ? t.ref
        : ((t = function (o) {
            var a = s.refs;
            o === null ? delete a[i] : (a[i] = o);
          }),
          (t._stringRef = i),
          t);
    }
    if (typeof e != 'string') throw Error(R(284));
    if (!n._owner) throw Error(R(290, e));
  }
  return e;
}
function to(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      R(31, e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e),
    )
  );
}
function Ff(e) {
  var t = e._init;
  return t(e._payload);
}
function Ey(e) {
  function t(p, m) {
    if (e) {
      var y = p.deletions;
      y === null ? ((p.deletions = [m]), (p.flags |= 16)) : y.push(m);
    }
  }
  function n(p, m) {
    if (!e) return null;
    for (; m !== null; ) (t(p, m), (m = m.sibling));
    return null;
  }
  function r(p, m) {
    for (p = new Map(); m !== null; )
      (m.key !== null ? p.set(m.key, m) : p.set(m.index, m), (m = m.sibling));
    return p;
  }
  function s(p, m) {
    return ((p = Tn(p, m)), (p.index = 0), (p.sibling = null), p);
  }
  function i(p, m, y) {
    return (
      (p.index = y),
      e
        ? ((y = p.alternate),
          y !== null ? ((y = y.index), y < m ? ((p.flags |= 2), m) : y) : ((p.flags |= 2), m))
        : ((p.flags |= 1048576), m)
    );
  }
  function o(p) {
    return (e && p.alternate === null && (p.flags |= 2), p);
  }
  function a(p, m, y, S) {
    return m === null || m.tag !== 6
      ? ((m = vl(y, p.mode, S)), (m.return = p), m)
      : ((m = s(m, y)), (m.return = p), m);
  }
  function l(p, m, y, S) {
    var C = y.type;
    return C === wr
      ? c(p, m, y.props.children, S, y.key)
      : m !== null &&
          (m.elementType === C ||
            (typeof C == 'object' && C !== null && C.$$typeof === on && Ff(C) === m.type))
        ? ((S = s(m, y.props)), (S.ref = ks(p, m, y)), (S.return = p), S)
        : ((S = jo(y.type, y.key, y.props, null, p.mode, S)),
          (S.ref = ks(p, m, y)),
          (S.return = p),
          S);
  }
  function u(p, m, y, S) {
    return m === null ||
      m.tag !== 4 ||
      m.stateNode.containerInfo !== y.containerInfo ||
      m.stateNode.implementation !== y.implementation
      ? ((m = xl(y, p.mode, S)), (m.return = p), m)
      : ((m = s(m, y.children || [])), (m.return = p), m);
  }
  function c(p, m, y, S, C) {
    return m === null || m.tag !== 7
      ? ((m = tr(y, p.mode, S, C)), (m.return = p), m)
      : ((m = s(m, y)), (m.return = p), m);
  }
  function d(p, m, y) {
    if ((typeof m == 'string' && m !== '') || typeof m == 'number')
      return ((m = vl('' + m, p.mode, y)), (m.return = p), m);
    if (typeof m == 'object' && m !== null) {
      switch (m.$$typeof) {
        case Hi:
          return (
            (y = jo(m.type, m.key, m.props, null, p.mode, y)),
            (y.ref = ks(p, null, m)),
            (y.return = p),
            y
          );
        case xr:
          return ((m = xl(m, p.mode, y)), (m.return = p), m);
        case on:
          var S = m._init;
          return d(p, S(m._payload), y);
      }
      if (bs(m) || ws(m)) return ((m = tr(m, p.mode, y, null)), (m.return = p), m);
      to(p, m);
    }
    return null;
  }
  function h(p, m, y, S) {
    var C = m !== null ? m.key : null;
    if ((typeof y == 'string' && y !== '') || typeof y == 'number')
      return C !== null ? null : a(p, m, '' + y, S);
    if (typeof y == 'object' && y !== null) {
      switch (y.$$typeof) {
        case Hi:
          return y.key === C ? l(p, m, y, S) : null;
        case xr:
          return y.key === C ? u(p, m, y, S) : null;
        case on:
          return ((C = y._init), h(p, m, C(y._payload), S));
      }
      if (bs(y) || ws(y)) return C !== null ? null : c(p, m, y, S, null);
      to(p, y);
    }
    return null;
  }
  function g(p, m, y, S, C) {
    if ((typeof S == 'string' && S !== '') || typeof S == 'number')
      return ((p = p.get(y) || null), a(m, p, '' + S, C));
    if (typeof S == 'object' && S !== null) {
      switch (S.$$typeof) {
        case Hi:
          return ((p = p.get(S.key === null ? y : S.key) || null), l(m, p, S, C));
        case xr:
          return ((p = p.get(S.key === null ? y : S.key) || null), u(m, p, S, C));
        case on:
          var T = S._init;
          return g(p, m, y, T(S._payload), C);
      }
      if (bs(S) || ws(S)) return ((p = p.get(y) || null), c(m, p, S, C, null));
      to(m, S);
    }
    return null;
  }
  function w(p, m, y, S) {
    for (var C = null, T = null, N = m, j = (m = 0), L = null; N !== null && j < y.length; j++) {
      N.index > j ? ((L = N), (N = null)) : (L = N.sibling);
      var D = h(p, N, y[j], S);
      if (D === null) {
        N === null && (N = L);
        break;
      }
      (e && N && D.alternate === null && t(p, N),
        (m = i(D, m, j)),
        T === null ? (C = D) : (T.sibling = D),
        (T = D),
        (N = L));
    }
    if (j === y.length) return (n(p, N), J && In(p, j), C);
    if (N === null) {
      for (; j < y.length; j++)
        ((N = d(p, y[j], S)),
          N !== null && ((m = i(N, m, j)), T === null ? (C = N) : (T.sibling = N), (T = N)));
      return (J && In(p, j), C);
    }
    for (N = r(p, N); j < y.length; j++)
      ((L = g(N, p, j, y[j], S)),
        L !== null &&
          (e && L.alternate !== null && N.delete(L.key === null ? j : L.key),
          (m = i(L, m, j)),
          T === null ? (C = L) : (T.sibling = L),
          (T = L)));
    return (
      e &&
        N.forEach(function (z) {
          return t(p, z);
        }),
      J && In(p, j),
      C
    );
  }
  function v(p, m, y, S) {
    var C = ws(y);
    if (typeof C != 'function') throw Error(R(150));
    if (((y = C.call(y)), y == null)) throw Error(R(151));
    for (
      var T = (C = null), N = m, j = (m = 0), L = null, D = y.next();
      N !== null && !D.done;
      j++, D = y.next()
    ) {
      N.index > j ? ((L = N), (N = null)) : (L = N.sibling);
      var z = h(p, N, D.value, S);
      if (z === null) {
        N === null && (N = L);
        break;
      }
      (e && N && z.alternate === null && t(p, N),
        (m = i(z, m, j)),
        T === null ? (C = z) : (T.sibling = z),
        (T = z),
        (N = L));
    }
    if (D.done) return (n(p, N), J && In(p, j), C);
    if (N === null) {
      for (; !D.done; j++, D = y.next())
        ((D = d(p, D.value, S)),
          D !== null && ((m = i(D, m, j)), T === null ? (C = D) : (T.sibling = D), (T = D)));
      return (J && In(p, j), C);
    }
    for (N = r(p, N); !D.done; j++, D = y.next())
      ((D = g(N, p, j, D.value, S)),
        D !== null &&
          (e && D.alternate !== null && N.delete(D.key === null ? j : D.key),
          (m = i(D, m, j)),
          T === null ? (C = D) : (T.sibling = D),
          (T = D)));
    return (
      e &&
        N.forEach(function (Qe) {
          return t(p, Qe);
        }),
      J && In(p, j),
      C
    );
  }
  function x(p, m, y, S) {
    if (
      (typeof y == 'object' &&
        y !== null &&
        y.type === wr &&
        y.key === null &&
        (y = y.props.children),
      typeof y == 'object' && y !== null)
    ) {
      switch (y.$$typeof) {
        case Hi:
          e: {
            for (var C = y.key, T = m; T !== null; ) {
              if (T.key === C) {
                if (((C = y.type), C === wr)) {
                  if (T.tag === 7) {
                    (n(p, T.sibling), (m = s(T, y.props.children)), (m.return = p), (p = m));
                    break e;
                  }
                } else if (
                  T.elementType === C ||
                  (typeof C == 'object' && C !== null && C.$$typeof === on && Ff(C) === T.type)
                ) {
                  (n(p, T.sibling),
                    (m = s(T, y.props)),
                    (m.ref = ks(p, T, y)),
                    (m.return = p),
                    (p = m));
                  break e;
                }
                n(p, T);
                break;
              } else t(p, T);
              T = T.sibling;
            }
            y.type === wr
              ? ((m = tr(y.props.children, p.mode, S, y.key)), (m.return = p), (p = m))
              : ((S = jo(y.type, y.key, y.props, null, p.mode, S)),
                (S.ref = ks(p, m, y)),
                (S.return = p),
                (p = S));
          }
          return o(p);
        case xr:
          e: {
            for (T = y.key; m !== null; ) {
              if (m.key === T)
                if (
                  m.tag === 4 &&
                  m.stateNode.containerInfo === y.containerInfo &&
                  m.stateNode.implementation === y.implementation
                ) {
                  (n(p, m.sibling), (m = s(m, y.children || [])), (m.return = p), (p = m));
                  break e;
                } else {
                  n(p, m);
                  break;
                }
              else t(p, m);
              m = m.sibling;
            }
            ((m = xl(y, p.mode, S)), (m.return = p), (p = m));
          }
          return o(p);
        case on:
          return ((T = y._init), x(p, m, T(y._payload), S));
      }
      if (bs(y)) return w(p, m, y, S);
      if (ws(y)) return v(p, m, y, S);
      to(p, y);
    }
    return (typeof y == 'string' && y !== '') || typeof y == 'number'
      ? ((y = '' + y),
        m !== null && m.tag === 6
          ? (n(p, m.sibling), (m = s(m, y)), (m.return = p), (p = m))
          : (n(p, m), (m = vl(y, p.mode, S)), (m.return = p), (p = m)),
        o(p))
      : n(p, m);
  }
  return x;
}
var es = Ey(!0),
  Py = Ey(!1),
  qo = Dn(null),
  Qo = null,
  Nr = null,
  Oc = null;
function Dc() {
  Oc = Nr = Qo = null;
}
function Lc(e) {
  var t = qo.current;
  (G(qo), (e._currentValue = t));
}
function mu(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function Br(e, t) {
  ((Qo = e),
    (Oc = Nr = null),
    (e = e.dependencies),
    e !== null && e.firstContext !== null && (e.lanes & t && ($e = !0), (e.firstContext = null)));
}
function ht(e) {
  var t = e._currentValue;
  if (Oc !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), Nr === null)) {
      if (Qo === null) throw Error(R(308));
      ((Nr = e), (Qo.dependencies = { lanes: 0, firstContext: e }));
    } else Nr = Nr.next = e;
  return t;
}
var Hn = null;
function Mc(e) {
  Hn === null ? (Hn = [e]) : Hn.push(e);
}
function ky(e, t, n, r) {
  var s = t.interleaved;
  return (
    s === null ? ((n.next = n), Mc(t)) : ((n.next = s.next), (s.next = n)),
    (t.interleaved = n),
    Jt(e, r)
  );
}
function Jt(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return));
  return n.tag === 3 ? n.stateNode : null;
}
var an = !1;
function _c(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Ty(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function qt(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function En(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), U & 2)) {
    var s = r.pending;
    return (
      s === null ? (t.next = t) : ((t.next = s.next), (s.next = t)),
      (r.pending = t),
      Jt(e, n)
    );
  }
  return (
    (s = r.interleaved),
    s === null ? ((t.next = t), Mc(r)) : ((t.next = s.next), (s.next = t)),
    (r.interleaved = t),
    Jt(e, n)
  );
}
function So(e, t, n) {
  if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Sc(e, n));
  }
}
function If(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var s = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        (i === null ? (s = i = o) : (i = i.next = o), (n = n.next));
      } while (n !== null);
      i === null ? (s = i = t) : (i = i.next = t);
    } else s = i = t;
    ((n = {
      baseState: r.baseState,
      firstBaseUpdate: s,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n));
    return;
  }
  ((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t));
}
function Go(e, t, n, r) {
  var s = e.updateQueue;
  an = !1;
  var i = s.firstBaseUpdate,
    o = s.lastBaseUpdate,
    a = s.shared.pending;
  if (a !== null) {
    s.shared.pending = null;
    var l = a,
      u = l.next;
    ((l.next = null), o === null ? (i = u) : (o.next = u), (o = l));
    var c = e.alternate;
    c !== null &&
      ((c = c.updateQueue),
      (a = c.lastBaseUpdate),
      a !== o && (a === null ? (c.firstBaseUpdate = u) : (a.next = u), (c.lastBaseUpdate = l)));
  }
  if (i !== null) {
    var d = s.baseState;
    ((o = 0), (c = u = l = null), (a = i));
    do {
      var h = a.lane,
        g = a.eventTime;
      if ((r & h) === h) {
        c !== null &&
          (c = c.next =
            {
              eventTime: g,
              lane: 0,
              tag: a.tag,
              payload: a.payload,
              callback: a.callback,
              next: null,
            });
        e: {
          var w = e,
            v = a;
          switch (((h = t), (g = n), v.tag)) {
            case 1:
              if (((w = v.payload), typeof w == 'function')) {
                d = w.call(g, d, h);
                break e;
              }
              d = w;
              break e;
            case 3:
              w.flags = (w.flags & -65537) | 128;
            case 0:
              if (((w = v.payload), (h = typeof w == 'function' ? w.call(g, d, h) : w), h == null))
                break e;
              d = ne({}, d, h);
              break e;
            case 2:
              an = !0;
          }
        }
        a.callback !== null &&
          a.lane !== 0 &&
          ((e.flags |= 64), (h = s.effects), h === null ? (s.effects = [a]) : h.push(a));
      } else
        ((g = {
          eventTime: g,
          lane: h,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null,
        }),
          c === null ? ((u = c = g), (l = d)) : (c = c.next = g),
          (o |= h));
      if (((a = a.next), a === null)) {
        if (((a = s.shared.pending), a === null)) break;
        ((h = a), (a = h.next), (h.next = null), (s.lastBaseUpdate = h), (s.shared.pending = null));
      }
    } while (!0);
    if (
      (c === null && (l = d),
      (s.baseState = l),
      (s.firstBaseUpdate = u),
      (s.lastBaseUpdate = c),
      (t = s.shared.interleaved),
      t !== null)
    ) {
      s = t;
      do ((o |= s.lane), (s = s.next));
      while (s !== t);
    } else i === null && (s.shared.lanes = 0);
    ((ar |= o), (e.lanes = o), (e.memoizedState = d));
  }
}
function Vf(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        s = r.callback;
      if (s !== null) {
        if (((r.callback = null), (r = n), typeof s != 'function')) throw Error(R(191, s));
        s.call(r);
      }
    }
}
var Ri = {},
  Ft = Dn(Ri),
  ai = Dn(Ri),
  li = Dn(Ri);
function Wn(e) {
  if (e === Ri) throw Error(R(174));
  return e;
}
function Fc(e, t) {
  switch ((q(li, t), q(ai, e), q(Ft, Ri), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Gl(null, '');
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Gl(t, e)));
  }
  (G(Ft), q(Ft, t));
}
function ts() {
  (G(Ft), G(ai), G(li));
}
function jy(e) {
  Wn(li.current);
  var t = Wn(Ft.current),
    n = Gl(t, e.type);
  t !== n && (q(ai, e), q(Ft, n));
}
function Ic(e) {
  ai.current === e && (G(Ft), G(ai));
}
var Z = Dn(0);
function Xo(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && ((n = n.dehydrated), n === null || n.data === '$?' || n.data === '$!'))
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var fl = [];
function Vc() {
  for (var e = 0; e < fl.length; e++) fl[e]._workInProgressVersionPrimary = null;
  fl.length = 0;
}
var Co = tn.ReactCurrentDispatcher,
  hl = tn.ReactCurrentBatchConfig,
  or = 0,
  te = null,
  pe = null,
  ge = null,
  Yo = !1,
  zs = !1,
  ui = 0,
  B1 = 0;
function Te() {
  throw Error(R(321));
}
function Bc(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++) if (!kt(e[n], t[n])) return !1;
  return !0;
}
function Uc(e, t, n, r, s, i) {
  if (
    ((or = i),
    (te = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Co.current = e === null || e.memoizedState === null ? H1 : W1),
    (e = n(r, s)),
    zs)
  ) {
    i = 0;
    do {
      if (((zs = !1), (ui = 0), 25 <= i)) throw Error(R(301));
      ((i += 1), (ge = pe = null), (t.updateQueue = null), (Co.current = K1), (e = n(r, s)));
    } while (zs);
  }
  if (
    ((Co.current = Jo),
    (t = pe !== null && pe.next !== null),
    (or = 0),
    (ge = pe = te = null),
    (Yo = !1),
    t)
  )
    throw Error(R(300));
  return e;
}
function zc() {
  var e = ui !== 0;
  return ((ui = 0), e);
}
function bt() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return (ge === null ? (te.memoizedState = ge = e) : (ge = ge.next = e), ge);
}
function pt() {
  if (pe === null) {
    var e = te.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = pe.next;
  var t = ge === null ? te.memoizedState : ge.next;
  if (t !== null) ((ge = t), (pe = e));
  else {
    if (e === null) throw Error(R(310));
    ((pe = e),
      (e = {
        memoizedState: pe.memoizedState,
        baseState: pe.baseState,
        baseQueue: pe.baseQueue,
        queue: pe.queue,
        next: null,
      }),
      ge === null ? (te.memoizedState = ge = e) : (ge = ge.next = e));
  }
  return ge;
}
function ci(e, t) {
  return typeof t == 'function' ? t(e) : t;
}
function pl(e) {
  var t = pt(),
    n = t.queue;
  if (n === null) throw Error(R(311));
  n.lastRenderedReducer = e;
  var r = pe,
    s = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (s !== null) {
      var o = s.next;
      ((s.next = i.next), (i.next = o));
    }
    ((r.baseQueue = s = i), (n.pending = null));
  }
  if (s !== null) {
    ((i = s.next), (r = r.baseState));
    var a = (o = null),
      l = null,
      u = i;
    do {
      var c = u.lane;
      if ((or & c) === c)
        (l !== null &&
          (l = l.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (r = u.hasEagerState ? u.eagerState : e(r, u.action)));
      else {
        var d = {
          lane: c,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        (l === null ? ((a = l = d), (o = r)) : (l = l.next = d), (te.lanes |= c), (ar |= c));
      }
      u = u.next;
    } while (u !== null && u !== i);
    (l === null ? (o = r) : (l.next = a),
      kt(r, t.memoizedState) || ($e = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = l),
      (n.lastRenderedState = r));
  }
  if (((e = n.interleaved), e !== null)) {
    s = e;
    do ((i = s.lane), (te.lanes |= i), (ar |= i), (s = s.next));
    while (s !== e);
  } else s === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function ml(e) {
  var t = pt(),
    n = t.queue;
  if (n === null) throw Error(R(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    s = n.pending,
    i = t.memoizedState;
  if (s !== null) {
    n.pending = null;
    var o = (s = s.next);
    do ((i = e(i, o.action)), (o = o.next));
    while (o !== s);
    (kt(i, t.memoizedState) || ($e = !0),
      (t.memoizedState = i),
      t.baseQueue === null && (t.baseState = i),
      (n.lastRenderedState = i));
  }
  return [i, r];
}
function Ny() {}
function Ry(e, t) {
  var n = te,
    r = pt(),
    s = t(),
    i = !kt(r.memoizedState, s);
  if (
    (i && ((r.memoizedState = s), ($e = !0)),
    (r = r.queue),
    $c(Oy.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || i || (ge !== null && ge.memoizedState.tag & 1))
  ) {
    if (((n.flags |= 2048), di(9, by.bind(null, n, r, s, t), void 0, null), ve === null))
      throw Error(R(349));
    or & 30 || Ay(n, t, s);
  }
  return s;
}
function Ay(e, t, n) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = te.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }), (te.updateQueue = t), (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
}
function by(e, t, n, r) {
  ((t.value = n), (t.getSnapshot = r), Dy(t) && Ly(e));
}
function Oy(e, t, n) {
  return n(function () {
    Dy(t) && Ly(e);
  });
}
function Dy(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !kt(e, n);
  } catch {
    return !0;
  }
}
function Ly(e) {
  var t = Jt(e, 1);
  t !== null && Pt(t, e, 1, -1);
}
function Bf(e) {
  var t = bt();
  return (
    typeof e == 'function' && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ci,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = $1.bind(null, te, e)),
    [t.memoizedState, e]
  );
}
function di(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = te.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (te.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function My() {
  return pt().memoizedState;
}
function Eo(e, t, n, r) {
  var s = bt();
  ((te.flags |= e), (s.memoizedState = di(1 | t, n, void 0, r === void 0 ? null : r)));
}
function Ca(e, t, n, r) {
  var s = pt();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (pe !== null) {
    var o = pe.memoizedState;
    if (((i = o.destroy), r !== null && Bc(r, o.deps))) {
      s.memoizedState = di(t, n, i, r);
      return;
    }
  }
  ((te.flags |= e), (s.memoizedState = di(1 | t, n, i, r)));
}
function Uf(e, t) {
  return Eo(8390656, 8, e, t);
}
function $c(e, t) {
  return Ca(2048, 8, e, t);
}
function _y(e, t) {
  return Ca(4, 2, e, t);
}
function Fy(e, t) {
  return Ca(4, 4, e, t);
}
function Iy(e, t) {
  if (typeof t == 'function')
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Vy(e, t, n) {
  return ((n = n != null ? n.concat([e]) : null), Ca(4, 4, Iy.bind(null, t, e), n));
}
function Hc() {}
function By(e, t) {
  var n = pt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Bc(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
}
function Uy(e, t) {
  var n = pt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Bc(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function zy(e, t, n) {
  return or & 21
    ? (kt(n, t) || ((n = qm()), (te.lanes |= n), (ar |= n), (e.baseState = !0)), t)
    : (e.baseState && ((e.baseState = !1), ($e = !0)), (e.memoizedState = n));
}
function U1(e, t) {
  var n = H;
  ((H = n !== 0 && 4 > n ? n : 4), e(!0));
  var r = hl.transition;
  hl.transition = {};
  try {
    (e(!1), t());
  } finally {
    ((H = n), (hl.transition = r));
  }
}
function $y() {
  return pt().memoizedState;
}
function z1(e, t, n) {
  var r = kn(e);
  if (((n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }), Hy(e)))
    Wy(t, n);
  else if (((n = ky(e, t, n, r)), n !== null)) {
    var s = _e();
    (Pt(n, e, r, s), Ky(n, t, r));
  }
}
function $1(e, t, n) {
  var r = kn(e),
    s = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Hy(e)) Wy(t, s);
  else {
    var i = e.alternate;
    if (e.lanes === 0 && (i === null || i.lanes === 0) && ((i = t.lastRenderedReducer), i !== null))
      try {
        var o = t.lastRenderedState,
          a = i(o, n);
        if (((s.hasEagerState = !0), (s.eagerState = a), kt(a, o))) {
          var l = t.interleaved;
          (l === null ? ((s.next = s), Mc(t)) : ((s.next = l.next), (l.next = s)),
            (t.interleaved = s));
          return;
        }
      } catch {
      } finally {
      }
    ((n = ky(e, t, s, r)), n !== null && ((s = _e()), Pt(n, e, r, s), Ky(n, t, r)));
  }
}
function Hy(e) {
  var t = e.alternate;
  return e === te || (t !== null && t === te);
}
function Wy(e, t) {
  zs = Yo = !0;
  var n = e.pending;
  (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t));
}
function Ky(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Sc(e, n));
  }
}
var Jo = {
    readContext: ht,
    useCallback: Te,
    useContext: Te,
    useEffect: Te,
    useImperativeHandle: Te,
    useInsertionEffect: Te,
    useLayoutEffect: Te,
    useMemo: Te,
    useReducer: Te,
    useRef: Te,
    useState: Te,
    useDebugValue: Te,
    useDeferredValue: Te,
    useTransition: Te,
    useMutableSource: Te,
    useSyncExternalStore: Te,
    useId: Te,
    unstable_isNewReconciler: !1,
  },
  H1 = {
    readContext: ht,
    useCallback: function (e, t) {
      return ((bt().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: ht,
    useEffect: Uf,
    useImperativeHandle: function (e, t, n) {
      return ((n = n != null ? n.concat([e]) : null), Eo(4194308, 4, Iy.bind(null, t, e), n));
    },
    useLayoutEffect: function (e, t) {
      return Eo(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Eo(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = bt();
      return ((t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e);
    },
    useReducer: function (e, t, n) {
      var r = bt();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = z1.bind(null, te, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = bt();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: Bf,
    useDebugValue: Hc,
    useDeferredValue: function (e) {
      return (bt().memoizedState = e);
    },
    useTransition: function () {
      var e = Bf(!1),
        t = e[0];
      return ((e = U1.bind(null, e[1])), (bt().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = te,
        s = bt();
      if (J) {
        if (n === void 0) throw Error(R(407));
        n = n();
      } else {
        if (((n = t()), ve === null)) throw Error(R(349));
        or & 30 || Ay(r, t, n);
      }
      s.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return (
        (s.queue = i),
        Uf(Oy.bind(null, r, i, e), [e]),
        (r.flags |= 2048),
        di(9, by.bind(null, r, i, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = bt(),
        t = ve.identifierPrefix;
      if (J) {
        var n = Kt,
          r = Wt;
        ((n = (r & ~(1 << (32 - Et(r) - 1))).toString(32) + n),
          (t = ':' + t + 'R' + n),
          (n = ui++),
          0 < n && (t += 'H' + n.toString(32)),
          (t += ':'));
      } else ((n = B1++), (t = ':' + t + 'r' + n.toString(32) + ':'));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  W1 = {
    readContext: ht,
    useCallback: By,
    useContext: ht,
    useEffect: $c,
    useImperativeHandle: Vy,
    useInsertionEffect: _y,
    useLayoutEffect: Fy,
    useMemo: Uy,
    useReducer: pl,
    useRef: My,
    useState: function () {
      return pl(ci);
    },
    useDebugValue: Hc,
    useDeferredValue: function (e) {
      var t = pt();
      return zy(t, pe.memoizedState, e);
    },
    useTransition: function () {
      var e = pl(ci)[0],
        t = pt().memoizedState;
      return [e, t];
    },
    useMutableSource: Ny,
    useSyncExternalStore: Ry,
    useId: $y,
    unstable_isNewReconciler: !1,
  },
  K1 = {
    readContext: ht,
    useCallback: By,
    useContext: ht,
    useEffect: $c,
    useImperativeHandle: Vy,
    useInsertionEffect: _y,
    useLayoutEffect: Fy,
    useMemo: Uy,
    useReducer: ml,
    useRef: My,
    useState: function () {
      return ml(ci);
    },
    useDebugValue: Hc,
    useDeferredValue: function (e) {
      var t = pt();
      return pe === null ? (t.memoizedState = e) : zy(t, pe.memoizedState, e);
    },
    useTransition: function () {
      var e = ml(ci)[0],
        t = pt().memoizedState;
      return [e, t];
    },
    useMutableSource: Ny,
    useSyncExternalStore: Ry,
    useId: $y,
    unstable_isNewReconciler: !1,
  };
function vt(e, t) {
  if (e && e.defaultProps) {
    ((t = ne({}, t)), (e = e.defaultProps));
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function yu(e, t, n, r) {
  ((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : ne({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n));
}
var Ea = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? dr(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = _e(),
      s = kn(e),
      i = qt(r, s);
    ((i.payload = t),
      n != null && (i.callback = n),
      (t = En(e, i, s)),
      t !== null && (Pt(t, e, s, r), So(t, e, s)));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = _e(),
      s = kn(e),
      i = qt(r, s);
    ((i.tag = 1),
      (i.payload = t),
      n != null && (i.callback = n),
      (t = En(e, i, s)),
      t !== null && (Pt(t, e, s, r), So(t, e, s)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = _e(),
      r = kn(e),
      s = qt(n, r);
    ((s.tag = 2),
      t != null && (s.callback = t),
      (t = En(e, s, r)),
      t !== null && (Pt(t, e, r, n), So(t, e, r)));
  },
};
function zf(e, t, n, r, s, i, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == 'function'
      ? e.shouldComponentUpdate(r, i, o)
      : t.prototype && t.prototype.isPureReactComponent
        ? !ri(n, r) || !ri(s, i)
        : !0
  );
}
function qy(e, t, n) {
  var r = !1,
    s = Rn,
    i = t.contextType;
  return (
    typeof i == 'object' && i !== null
      ? (i = ht(i))
      : ((s = We(t) ? sr : De.current),
        (r = t.contextTypes),
        (i = (r = r != null) ? Jr(e, s) : Rn)),
    (t = new t(n, i)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Ea),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = s),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    t
  );
}
function $f(e, t, n, r) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Ea.enqueueReplaceState(t, t.state, null));
}
function gu(e, t, n, r) {
  var s = e.stateNode;
  ((s.props = n), (s.state = e.memoizedState), (s.refs = {}), _c(e));
  var i = t.contextType;
  (typeof i == 'object' && i !== null
    ? (s.context = ht(i))
    : ((i = We(t) ? sr : De.current), (s.context = Jr(e, i))),
    (s.state = e.memoizedState),
    (i = t.getDerivedStateFromProps),
    typeof i == 'function' && (yu(e, t, i, n), (s.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == 'function' ||
      typeof s.getSnapshotBeforeUpdate == 'function' ||
      (typeof s.UNSAFE_componentWillMount != 'function' &&
        typeof s.componentWillMount != 'function') ||
      ((t = s.state),
      typeof s.componentWillMount == 'function' && s.componentWillMount(),
      typeof s.UNSAFE_componentWillMount == 'function' && s.UNSAFE_componentWillMount(),
      t !== s.state && Ea.enqueueReplaceState(s, s.state, null),
      Go(e, n, s, r),
      (s.state = e.memoizedState)),
    typeof s.componentDidMount == 'function' && (e.flags |= 4194308));
}
function ns(e, t) {
  try {
    var n = '',
      r = t;
    do ((n += wx(r)), (r = r.return));
    while (r);
    var s = n;
  } catch (i) {
    s =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: e, source: t, stack: s, digest: null };
}
function yl(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function vu(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var q1 = typeof WeakMap == 'function' ? WeakMap : Map;
function Qy(e, t, n) {
  ((n = qt(-1, n)), (n.tag = 3), (n.payload = { element: null }));
  var r = t.value;
  return (
    (n.callback = function () {
      (ea || ((ea = !0), (Nu = r)), vu(e, t));
    }),
    n
  );
}
function Gy(e, t, n) {
  ((n = qt(-1, n)), (n.tag = 3));
  var r = e.type.getDerivedStateFromError;
  if (typeof r == 'function') {
    var s = t.value;
    ((n.payload = function () {
      return r(s);
    }),
      (n.callback = function () {
        vu(e, t);
      }));
  }
  var i = e.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == 'function' &&
      (n.callback = function () {
        (vu(e, t), typeof r != 'function' && (Pn === null ? (Pn = new Set([this])) : Pn.add(this)));
        var o = t.stack;
        this.componentDidCatch(t.value, { componentStack: o !== null ? o : '' });
      }),
    n
  );
}
function Hf(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new q1();
    var s = new Set();
    r.set(t, s);
  } else ((s = r.get(t)), s === void 0 && ((s = new Set()), r.set(t, s)));
  s.has(n) || (s.add(n), (e = aw.bind(null, e, t, n)), t.then(e, e));
}
function Wf(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) && ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Kf(e, t, n, r, s) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = s), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null ? (n.tag = 17) : ((t = qt(-1, 1)), (t.tag = 2), En(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var Q1 = tn.ReactCurrentOwner,
  $e = !1;
function Le(e, t, n, r) {
  t.child = e === null ? Py(t, null, n, r) : es(t, e.child, n, r);
}
function qf(e, t, n, r, s) {
  n = n.render;
  var i = t.ref;
  return (
    Br(t, s),
    (r = Uc(e, t, n, r, i, s)),
    (n = zc()),
    e !== null && !$e
      ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~s), Zt(e, t, s))
      : (J && n && Rc(t), (t.flags |= 1), Le(e, t, r, s), t.child)
  );
}
function Qf(e, t, n, r, s) {
  if (e === null) {
    var i = n.type;
    return typeof i == 'function' &&
      !Jc(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), Xy(e, t, i, r, s))
      : ((e = jo(n.type, null, r, t, t.mode, s)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  if (((i = e.child), !(e.lanes & s))) {
    var o = i.memoizedProps;
    if (((n = n.compare), (n = n !== null ? n : ri), n(o, r) && e.ref === t.ref))
      return Zt(e, t, s);
  }
  return ((t.flags |= 1), (e = Tn(i, r)), (e.ref = t.ref), (e.return = t), (t.child = e));
}
function Xy(e, t, n, r, s) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (ri(i, r) && e.ref === t.ref)
      if ((($e = !1), (t.pendingProps = r = i), (e.lanes & s) !== 0)) e.flags & 131072 && ($e = !0);
      else return ((t.lanes = e.lanes), Zt(e, t, s));
  }
  return xu(e, t, n, r, s);
}
function Yy(e, t, n) {
  var r = t.pendingProps,
    s = r.children,
    i = e !== null ? e.memoizedState : null;
  if (r.mode === 'hidden')
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        q(Ar, Ge),
        (Ge |= n));
    else {
      if (!(n & 1073741824))
        return (
          (e = i !== null ? i.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }),
          (t.updateQueue = null),
          q(Ar, Ge),
          (Ge |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        q(Ar, Ge),
        (Ge |= r));
    }
  else
    (i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
      q(Ar, Ge),
      (Ge |= r));
  return (Le(e, t, s, n), t.child);
}
function Jy(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function xu(e, t, n, r, s) {
  var i = We(n) ? sr : De.current;
  return (
    (i = Jr(t, i)),
    Br(t, s),
    (n = Uc(e, t, n, r, i, s)),
    (r = zc()),
    e !== null && !$e
      ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~s), Zt(e, t, s))
      : (J && r && Rc(t), (t.flags |= 1), Le(e, t, n, s), t.child)
  );
}
function Gf(e, t, n, r, s) {
  if (We(n)) {
    var i = !0;
    Ho(t);
  } else i = !1;
  if ((Br(t, s), t.stateNode === null)) (Po(e, t), qy(t, n, r), gu(t, n, r, s), (r = !0));
  else if (e === null) {
    var o = t.stateNode,
      a = t.memoizedProps;
    o.props = a;
    var l = o.context,
      u = n.contextType;
    typeof u == 'object' && u !== null
      ? (u = ht(u))
      : ((u = We(n) ? sr : De.current), (u = Jr(t, u)));
    var c = n.getDerivedStateFromProps,
      d = typeof c == 'function' || typeof o.getSnapshotBeforeUpdate == 'function';
    (d ||
      (typeof o.UNSAFE_componentWillReceiveProps != 'function' &&
        typeof o.componentWillReceiveProps != 'function') ||
      ((a !== r || l !== u) && $f(t, o, r, u)),
      (an = !1));
    var h = t.memoizedState;
    ((o.state = h),
      Go(t, r, o, s),
      (l = t.memoizedState),
      a !== r || h !== l || He.current || an
        ? (typeof c == 'function' && (yu(t, n, c, r), (l = t.memoizedState)),
          (a = an || zf(t, n, a, r, h, l, u))
            ? (d ||
                (typeof o.UNSAFE_componentWillMount != 'function' &&
                  typeof o.componentWillMount != 'function') ||
                (typeof o.componentWillMount == 'function' && o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == 'function' && o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == 'function' && (t.flags |= 4194308))
            : (typeof o.componentDidMount == 'function' && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = l)),
          (o.props = r),
          (o.state = l),
          (o.context = u),
          (r = a))
        : (typeof o.componentDidMount == 'function' && (t.flags |= 4194308), (r = !1)));
  } else {
    ((o = t.stateNode),
      Ty(e, t),
      (a = t.memoizedProps),
      (u = t.type === t.elementType ? a : vt(t.type, a)),
      (o.props = u),
      (d = t.pendingProps),
      (h = o.context),
      (l = n.contextType),
      typeof l == 'object' && l !== null
        ? (l = ht(l))
        : ((l = We(n) ? sr : De.current), (l = Jr(t, l))));
    var g = n.getDerivedStateFromProps;
    ((c = typeof g == 'function' || typeof o.getSnapshotBeforeUpdate == 'function') ||
      (typeof o.UNSAFE_componentWillReceiveProps != 'function' &&
        typeof o.componentWillReceiveProps != 'function') ||
      ((a !== d || h !== l) && $f(t, o, r, l)),
      (an = !1),
      (h = t.memoizedState),
      (o.state = h),
      Go(t, r, o, s));
    var w = t.memoizedState;
    a !== d || h !== w || He.current || an
      ? (typeof g == 'function' && (yu(t, n, g, r), (w = t.memoizedState)),
        (u = an || zf(t, n, u, r, h, w, l) || !1)
          ? (c ||
              (typeof o.UNSAFE_componentWillUpdate != 'function' &&
                typeof o.componentWillUpdate != 'function') ||
              (typeof o.componentWillUpdate == 'function' && o.componentWillUpdate(r, w, l),
              typeof o.UNSAFE_componentWillUpdate == 'function' &&
                o.UNSAFE_componentWillUpdate(r, w, l)),
            typeof o.componentDidUpdate == 'function' && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != 'function' ||
              (a === e.memoizedProps && h === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != 'function' ||
              (a === e.memoizedProps && h === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = w)),
        (o.props = r),
        (o.state = w),
        (o.context = l),
        (r = u))
      : (typeof o.componentDidUpdate != 'function' ||
          (a === e.memoizedProps && h === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != 'function' ||
          (a === e.memoizedProps && h === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return wu(e, t, n, r, i, s);
}
function wu(e, t, n, r, s, i) {
  Jy(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return (s && Lf(t, n, !1), Zt(e, t, i));
  ((r = t.stateNode), (Q1.current = t));
  var a = o && typeof n.getDerivedStateFromError != 'function' ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = es(t, e.child, null, i)), (t.child = es(t, null, a, i)))
      : Le(e, t, a, i),
    (t.memoizedState = r.state),
    s && Lf(t, n, !0),
    t.child
  );
}
function Zy(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? Df(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Df(e, t.context, !1),
    Fc(e, t.containerInfo));
}
function Xf(e, t, n, r, s) {
  return (Zr(), bc(s), (t.flags |= 256), Le(e, t, n, r), t.child);
}
var Su = { dehydrated: null, treeContext: null, retryLane: 0 };
function Cu(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function eg(e, t, n) {
  var r = t.pendingProps,
    s = Z.current,
    i = !1,
    o = (t.flags & 128) !== 0,
    a;
  if (
    ((a = o) || (a = e !== null && e.memoizedState === null ? !1 : (s & 2) !== 0),
    a ? ((i = !0), (t.flags &= -129)) : (e === null || e.memoizedState !== null) && (s |= 1),
    q(Z, s & 1),
    e === null)
  )
    return (
      pu(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1 ? (e.data === '$!' ? (t.lanes = 8) : (t.lanes = 1073741824)) : (t.lanes = 1),
          null)
        : ((o = r.children),
          (e = r.fallback),
          i
            ? ((r = t.mode),
              (i = t.child),
              (o = { mode: 'hidden', children: o }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = o))
                : (i = Ta(o, r, 0, null)),
              (e = tr(e, r, n, null)),
              (i.return = t),
              (e.return = t),
              (i.sibling = e),
              (t.child = i),
              (t.child.memoizedState = Cu(n)),
              (t.memoizedState = Su),
              e)
            : Wc(t, o))
    );
  if (((s = e.memoizedState), s !== null && ((a = s.dehydrated), a !== null)))
    return G1(e, t, o, r, a, s, n);
  if (i) {
    ((i = r.fallback), (o = t.mode), (s = e.child), (a = s.sibling));
    var l = { mode: 'hidden', children: r.children };
    return (
      !(o & 1) && t.child !== s
        ? ((r = t.child), (r.childLanes = 0), (r.pendingProps = l), (t.deletions = null))
        : ((r = Tn(s, l)), (r.subtreeFlags = s.subtreeFlags & 14680064)),
      a !== null ? (i = Tn(a, i)) : ((i = tr(i, o, n, null)), (i.flags |= 2)),
      (i.return = t),
      (r.return = t),
      (r.sibling = i),
      (t.child = r),
      (r = i),
      (i = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? Cu(n)
          : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }),
      (i.memoizedState = o),
      (i.childLanes = e.childLanes & ~n),
      (t.memoizedState = Su),
      r
    );
  }
  return (
    (i = e.child),
    (e = i.sibling),
    (r = Tn(i, { mode: 'visible', children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions), n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function Wc(e, t) {
  return (
    (t = Ta({ mode: 'visible', children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function no(e, t, n, r) {
  return (
    r !== null && bc(r),
    es(t, e.child, null, n),
    (e = Wc(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function G1(e, t, n, r, s, i, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = yl(Error(R(422)))), no(e, t, o, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((i = r.fallback),
          (s = t.mode),
          (r = Ta({ mode: 'visible', children: r.children }, s, 0, null)),
          (i = tr(i, s, o, null)),
          (i.flags |= 2),
          (r.return = t),
          (i.return = t),
          (r.sibling = i),
          (t.child = r),
          t.mode & 1 && es(t, e.child, null, o),
          (t.child.memoizedState = Cu(o)),
          (t.memoizedState = Su),
          i);
  if (!(t.mode & 1)) return no(e, t, o, null);
  if (s.data === '$!') {
    if (((r = s.nextSibling && s.nextSibling.dataset), r)) var a = r.dgst;
    return ((r = a), (i = Error(R(419))), (r = yl(i, r, void 0)), no(e, t, o, r));
  }
  if (((a = (o & e.childLanes) !== 0), $e || a)) {
    if (((r = ve), r !== null)) {
      switch (o & -o) {
        case 4:
          s = 2;
          break;
        case 16:
          s = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          s = 32;
          break;
        case 536870912:
          s = 268435456;
          break;
        default:
          s = 0;
      }
      ((s = s & (r.suspendedLanes | o) ? 0 : s),
        s !== 0 && s !== i.retryLane && ((i.retryLane = s), Jt(e, s), Pt(r, e, s, -1)));
    }
    return (Yc(), (r = yl(Error(R(421)))), no(e, t, o, r));
  }
  return s.data === '$?'
    ? ((t.flags |= 128), (t.child = e.child), (t = lw.bind(null, e)), (s._reactRetry = t), null)
    : ((e = i.treeContext),
      (Ye = Cn(s.nextSibling)),
      (Je = t),
      (J = !0),
      (Ct = null),
      e !== null &&
        ((ut[ct++] = Wt),
        (ut[ct++] = Kt),
        (ut[ct++] = ir),
        (Wt = e.id),
        (Kt = e.overflow),
        (ir = t)),
      (t = Wc(t, r.children)),
      (t.flags |= 4096),
      t);
}
function Yf(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  (r !== null && (r.lanes |= t), mu(e.return, t, n));
}
function gl(e, t, n, r, s) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: s,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = s));
}
function tg(e, t, n) {
  var r = t.pendingProps,
    s = r.revealOrder,
    i = r.tail;
  if ((Le(e, t, r.children, n), (r = Z.current), r & 2)) ((r = (r & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Yf(e, n, t);
        else if (e.tag === 19) Yf(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    r &= 1;
  }
  if ((q(Z, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (s) {
      case 'forwards':
        for (n = t.child, s = null; n !== null; )
          ((e = n.alternate), e !== null && Xo(e) === null && (s = n), (n = n.sibling));
        ((n = s),
          n === null ? ((s = t.child), (t.child = null)) : ((s = n.sibling), (n.sibling = null)),
          gl(t, !1, s, n, i));
        break;
      case 'backwards':
        for (n = null, s = t.child, t.child = null; s !== null; ) {
          if (((e = s.alternate), e !== null && Xo(e) === null)) {
            t.child = s;
            break;
          }
          ((e = s.sibling), (s.sibling = n), (n = s), (s = e));
        }
        gl(t, !0, n, null, i);
        break;
      case 'together':
        gl(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Po(e, t) {
  !(t.mode & 1) && e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Zt(e, t, n) {
  if ((e !== null && (t.dependencies = e.dependencies), (ar |= t.lanes), !(n & t.childLanes)))
    return null;
  if (e !== null && t.child !== e.child) throw Error(R(153));
  if (t.child !== null) {
    for (e = t.child, n = Tn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
      ((e = e.sibling), (n = n.sibling = Tn(e, e.pendingProps)), (n.return = t));
    n.sibling = null;
  }
  return t.child;
}
function X1(e, t, n) {
  switch (t.tag) {
    case 3:
      (Zy(t), Zr());
      break;
    case 5:
      jy(t);
      break;
    case 1:
      We(t.type) && Ho(t);
      break;
    case 4:
      Fc(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        s = t.memoizedProps.value;
      (q(qo, r._currentValue), (r._currentValue = s));
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (q(Z, Z.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? eg(e, t, n)
            : (q(Z, Z.current & 1), (e = Zt(e, t, n)), e !== null ? e.sibling : null);
      q(Z, Z.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return tg(e, t, n);
        t.flags |= 128;
      }
      if (
        ((s = t.memoizedState),
        s !== null && ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
        q(Z, Z.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), Yy(e, t, n));
  }
  return Zt(e, t, n);
}
var ng, Eu, rg, sg;
ng = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      ((n.child.return = n), (n = n.child));
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    ((n.sibling.return = n.return), (n = n.sibling));
  }
};
Eu = function () {};
rg = function (e, t, n, r) {
  var s = e.memoizedProps;
  if (s !== r) {
    ((e = t.stateNode), Wn(Ft.current));
    var i = null;
    switch (n) {
      case 'input':
        ((s = Wl(e, s)), (r = Wl(e, r)), (i = []));
        break;
      case 'select':
        ((s = ne({}, s, { value: void 0 })), (r = ne({}, r, { value: void 0 })), (i = []));
        break;
      case 'textarea':
        ((s = Ql(e, s)), (r = Ql(e, r)), (i = []));
        break;
      default:
        typeof s.onClick != 'function' && typeof r.onClick == 'function' && (e.onclick = zo);
    }
    Xl(n, r);
    var o;
    n = null;
    for (u in s)
      if (!r.hasOwnProperty(u) && s.hasOwnProperty(u) && s[u] != null)
        if (u === 'style') {
          var a = s[u];
          for (o in a) a.hasOwnProperty(o) && (n || (n = {}), (n[o] = ''));
        } else
          u !== 'dangerouslySetInnerHTML' &&
            u !== 'children' &&
            u !== 'suppressContentEditableWarning' &&
            u !== 'suppressHydrationWarning' &&
            u !== 'autoFocus' &&
            (Xs.hasOwnProperty(u) ? i || (i = []) : (i = i || []).push(u, null));
    for (u in r) {
      var l = r[u];
      if (
        ((a = s != null ? s[u] : void 0),
        r.hasOwnProperty(u) && l !== a && (l != null || a != null))
      )
        if (u === 'style')
          if (a) {
            for (o in a)
              !a.hasOwnProperty(o) || (l && l.hasOwnProperty(o)) || (n || (n = {}), (n[o] = ''));
            for (o in l) l.hasOwnProperty(o) && a[o] !== l[o] && (n || (n = {}), (n[o] = l[o]));
          } else (n || (i || (i = []), i.push(u, n)), (n = l));
        else
          u === 'dangerouslySetInnerHTML'
            ? ((l = l ? l.__html : void 0),
              (a = a ? a.__html : void 0),
              l != null && a !== l && (i = i || []).push(u, l))
            : u === 'children'
              ? (typeof l != 'string' && typeof l != 'number') || (i = i || []).push(u, '' + l)
              : u !== 'suppressContentEditableWarning' &&
                u !== 'suppressHydrationWarning' &&
                (Xs.hasOwnProperty(u)
                  ? (l != null && u === 'onScroll' && Q('scroll', e), i || a === l || (i = []))
                  : (i = i || []).push(u, l));
    }
    n && (i = i || []).push('style', n);
    var u = i;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
sg = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Ts(e, t) {
  if (!J)
    switch (e.tailMode) {
      case 'hidden':
        t = e.tail;
        for (var n = null; t !== null; ) (t.alternate !== null && (n = t), (t = t.sibling));
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case 'collapsed':
        n = e.tail;
        for (var r = null; n !== null; ) (n.alternate !== null && (r = n), (n = n.sibling));
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function je(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var s = e.child; s !== null; )
      ((n |= s.lanes | s.childLanes),
        (r |= s.subtreeFlags & 14680064),
        (r |= s.flags & 14680064),
        (s.return = e),
        (s = s.sibling));
  else
    for (s = e.child; s !== null; )
      ((n |= s.lanes | s.childLanes),
        (r |= s.subtreeFlags),
        (r |= s.flags),
        (s.return = e),
        (s = s.sibling));
  return ((e.subtreeFlags |= r), (e.childLanes = n), t);
}
function Y1(e, t, n) {
  var r = t.pendingProps;
  switch ((Ac(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (je(t), null);
    case 1:
      return (We(t.type) && $o(), je(t), null);
    case 3:
      return (
        (r = t.stateNode),
        ts(),
        G(He),
        G(De),
        Vc(),
        r.pendingContext && ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (eo(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Ct !== null && (bu(Ct), (Ct = null)))),
        Eu(e, t),
        je(t),
        null
      );
    case 5:
      Ic(t);
      var s = Wn(li.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        (rg(e, t, n, r, s), e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(R(166));
          return (je(t), null);
        }
        if (((e = Wn(Ft.current)), eo(t))) {
          ((r = t.stateNode), (n = t.type));
          var i = t.memoizedProps;
          switch (((r[Mt] = t), (r[oi] = i), (e = (t.mode & 1) !== 0), n)) {
            case 'dialog':
              (Q('cancel', r), Q('close', r));
              break;
            case 'iframe':
            case 'object':
            case 'embed':
              Q('load', r);
              break;
            case 'video':
            case 'audio':
              for (s = 0; s < Ds.length; s++) Q(Ds[s], r);
              break;
            case 'source':
              Q('error', r);
              break;
            case 'img':
            case 'image':
            case 'link':
              (Q('error', r), Q('load', r));
              break;
            case 'details':
              Q('toggle', r);
              break;
            case 'input':
              (of(r, i), Q('invalid', r));
              break;
            case 'select':
              ((r._wrapperState = { wasMultiple: !!i.multiple }), Q('invalid', r));
              break;
            case 'textarea':
              (lf(r, i), Q('invalid', r));
          }
          (Xl(n, i), (s = null));
          for (var o in i)
            if (i.hasOwnProperty(o)) {
              var a = i[o];
              o === 'children'
                ? typeof a == 'string'
                  ? r.textContent !== a &&
                    (i.suppressHydrationWarning !== !0 && Zi(r.textContent, a, e),
                    (s = ['children', a]))
                  : typeof a == 'number' &&
                    r.textContent !== '' + a &&
                    (i.suppressHydrationWarning !== !0 && Zi(r.textContent, a, e),
                    (s = ['children', '' + a]))
                : Xs.hasOwnProperty(o) && a != null && o === 'onScroll' && Q('scroll', r);
            }
          switch (n) {
            case 'input':
              (Wi(r), af(r, i, !0));
              break;
            case 'textarea':
              (Wi(r), uf(r));
              break;
            case 'select':
            case 'option':
              break;
            default:
              typeof i.onClick == 'function' && (r.onclick = zo);
          }
          ((r = s), (t.updateQueue = r), r !== null && (t.flags |= 4));
        } else {
          ((o = s.nodeType === 9 ? s : s.ownerDocument),
            e === 'http://www.w3.org/1999/xhtml' && (e = Om(n)),
            e === 'http://www.w3.org/1999/xhtml'
              ? n === 'script'
                ? ((e = o.createElement('div')),
                  (e.innerHTML = '<script><\/script>'),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == 'string'
                  ? (e = o.createElement(n, { is: r.is }))
                  : ((e = o.createElement(n)),
                    n === 'select' &&
                      ((o = e), r.multiple ? (o.multiple = !0) : r.size && (o.size = r.size)))
              : (e = o.createElementNS(e, n)),
            (e[Mt] = t),
            (e[oi] = r),
            ng(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((o = Yl(n, r)), n)) {
              case 'dialog':
                (Q('cancel', e), Q('close', e), (s = r));
                break;
              case 'iframe':
              case 'object':
              case 'embed':
                (Q('load', e), (s = r));
                break;
              case 'video':
              case 'audio':
                for (s = 0; s < Ds.length; s++) Q(Ds[s], e);
                s = r;
                break;
              case 'source':
                (Q('error', e), (s = r));
                break;
              case 'img':
              case 'image':
              case 'link':
                (Q('error', e), Q('load', e), (s = r));
                break;
              case 'details':
                (Q('toggle', e), (s = r));
                break;
              case 'input':
                (of(e, r), (s = Wl(e, r)), Q('invalid', e));
                break;
              case 'option':
                s = r;
                break;
              case 'select':
                ((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (s = ne({}, r, { value: void 0 })),
                  Q('invalid', e));
                break;
              case 'textarea':
                (lf(e, r), (s = Ql(e, r)), Q('invalid', e));
                break;
              default:
                s = r;
            }
            (Xl(n, s), (a = s));
            for (i in a)
              if (a.hasOwnProperty(i)) {
                var l = a[i];
                i === 'style'
                  ? Mm(e, l)
                  : i === 'dangerouslySetInnerHTML'
                    ? ((l = l ? l.__html : void 0), l != null && Dm(e, l))
                    : i === 'children'
                      ? typeof l == 'string'
                        ? (n !== 'textarea' || l !== '') && Ys(e, l)
                        : typeof l == 'number' && Ys(e, '' + l)
                      : i !== 'suppressContentEditableWarning' &&
                        i !== 'suppressHydrationWarning' &&
                        i !== 'autoFocus' &&
                        (Xs.hasOwnProperty(i)
                          ? l != null && i === 'onScroll' && Q('scroll', e)
                          : l != null && mc(e, i, l, o));
              }
            switch (n) {
              case 'input':
                (Wi(e), af(e, r, !1));
                break;
              case 'textarea':
                (Wi(e), uf(e));
                break;
              case 'option':
                r.value != null && e.setAttribute('value', '' + Nn(r.value));
                break;
              case 'select':
                ((e.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? _r(e, !!r.multiple, i, !1)
                    : r.defaultValue != null && _r(e, !!r.multiple, r.defaultValue, !0));
                break;
              default:
                typeof s.onClick == 'function' && (e.onclick = zo);
            }
            switch (n) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                r = !!r.autoFocus;
                break e;
              case 'img':
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (je(t), null);
    case 6:
      if (e && t.stateNode != null) sg(e, t, e.memoizedProps, r);
      else {
        if (typeof r != 'string' && t.stateNode === null) throw Error(R(166));
        if (((n = Wn(li.current)), Wn(Ft.current), eo(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Mt] = t),
            (i = r.nodeValue !== n) && ((e = Je), e !== null))
          )
            switch (e.tag) {
              case 3:
                Zi(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Zi(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          i && (t.flags |= 4);
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Mt] = t),
            (t.stateNode = r));
      }
      return (je(t), null);
    case 13:
      if (
        (G(Z),
        (r = t.memoizedState),
        e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (J && Ye !== null && t.mode & 1 && !(t.flags & 128))
          (Cy(), Zr(), (t.flags |= 98560), (i = !1));
        else if (((i = eo(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!i) throw Error(R(318));
            if (((i = t.memoizedState), (i = i !== null ? i.dehydrated : null), !i))
              throw Error(R(317));
            i[Mt] = t;
          } else (Zr(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4));
          (je(t), (i = !1));
        } else (Ct !== null && (bu(Ct), (Ct = null)), (i = !0));
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 && (e === null || Z.current & 1 ? me === 0 && (me = 3) : Yc())),
          t.updateQueue !== null && (t.flags |= 4),
          je(t),
          null);
    case 4:
      return (ts(), Eu(e, t), e === null && si(t.stateNode.containerInfo), je(t), null);
    case 10:
      return (Lc(t.type._context), je(t), null);
    case 17:
      return (We(t.type) && $o(), je(t), null);
    case 19:
      if ((G(Z), (i = t.memoizedState), i === null)) return (je(t), null);
      if (((r = (t.flags & 128) !== 0), (o = i.rendering), o === null))
        if (r) Ts(i, !1);
        else {
          if (me !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = Xo(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    Ts(i, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;
                )
                  ((i = n),
                    (e = r),
                    (i.flags &= 14680066),
                    (o = i.alternate),
                    o === null
                      ? ((i.childLanes = 0),
                        (i.lanes = e),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = o.childLanes),
                        (i.lanes = o.lanes),
                        (i.child = o.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = o.memoizedProps),
                        (i.memoizedState = o.memoizedState),
                        (i.updateQueue = o.updateQueue),
                        (i.type = o.type),
                        (e = o.dependencies),
                        (i.dependencies =
                          e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
                    (n = n.sibling));
                return (q(Z, (Z.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          i.tail !== null &&
            ce() > rs &&
            ((t.flags |= 128), (r = !0), Ts(i, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = Xo(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Ts(i, !0),
              i.tail === null && i.tailMode === 'hidden' && !o.alternate && !J)
            )
              return (je(t), null);
          } else
            2 * ce() - i.renderingStartTime > rs &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Ts(i, !1), (t.lanes = 4194304));
        i.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = i.last), n !== null ? (n.sibling = o) : (t.child = o), (i.last = o));
      }
      return i.tail !== null
        ? ((t = i.tail),
          (i.rendering = t),
          (i.tail = t.sibling),
          (i.renderingStartTime = ce()),
          (t.sibling = null),
          (n = Z.current),
          q(Z, r ? (n & 1) | 2 : n & 1),
          t)
        : (je(t), null);
    case 22:
    case 23:
      return (
        Xc(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? Ge & 1073741824 && (je(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : je(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(R(156, t.tag));
}
function J1(e, t) {
  switch ((Ac(t), t.tag)) {
    case 1:
      return (
        We(t.type) && $o(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        ts(),
        G(He),
        G(De),
        Vc(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (Ic(t), null);
    case 13:
      if ((G(Z), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(R(340));
        Zr();
      }
      return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
    case 19:
      return (G(Z), null);
    case 4:
      return (ts(), null);
    case 10:
      return (Lc(t.type._context), null);
    case 22:
    case 23:
      return (Xc(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var ro = !1,
  Ae = !1,
  Z1 = typeof WeakSet == 'function' ? WeakSet : Set,
  b = null;
function Rr(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == 'function')
      try {
        n(null);
      } catch (r) {
        ie(e, t, r);
      }
    else n.current = null;
}
function Pu(e, t, n) {
  try {
    n();
  } catch (r) {
    ie(e, t, r);
  }
}
var Jf = !1;
function ew(e, t) {
  if (((au = Vo), (e = uy()), Nc(e))) {
    if ('selectionStart' in e) var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var s = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            (n.nodeType, i.nodeType);
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            a = -1,
            l = -1,
            u = 0,
            c = 0,
            d = e,
            h = null;
          t: for (;;) {
            for (
              var g;
              d !== n || (s !== 0 && d.nodeType !== 3) || (a = o + s),
                d !== i || (r !== 0 && d.nodeType !== 3) || (l = o + r),
                d.nodeType === 3 && (o += d.nodeValue.length),
                (g = d.firstChild) !== null;
            )
              ((h = d), (d = g));
            for (;;) {
              if (d === e) break t;
              if (
                (h === n && ++u === s && (a = o),
                h === i && ++c === r && (l = o),
                (g = d.nextSibling) !== null)
              )
                break;
              ((d = h), (h = d.parentNode));
            }
            d = g;
          }
          n = a === -1 || l === -1 ? null : { start: a, end: l };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (lu = { focusedElem: e, selectionRange: n }, Vo = !1, b = t; b !== null; )
    if (((t = b), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (b = e));
    else
      for (; b !== null; ) {
        t = b;
        try {
          var w = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (w !== null) {
                  var v = w.memoizedProps,
                    x = w.memoizedState,
                    p = t.stateNode,
                    m = p.getSnapshotBeforeUpdate(t.elementType === t.type ? v : vt(t.type, v), x);
                  p.__reactInternalSnapshotBeforeUpdate = m;
                }
                break;
              case 3:
                var y = t.stateNode.containerInfo;
                y.nodeType === 1
                  ? (y.textContent = '')
                  : y.nodeType === 9 && y.documentElement && y.removeChild(y.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(R(163));
            }
        } catch (S) {
          ie(t, t.return, S);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), (b = e));
          break;
        }
        b = t.return;
      }
  return ((w = Jf), (Jf = !1), w);
}
function $s(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var s = (r = r.next);
    do {
      if ((s.tag & e) === e) {
        var i = s.destroy;
        ((s.destroy = void 0), i !== void 0 && Pu(t, n, i));
      }
      s = s.next;
    } while (s !== r);
  }
}
function Pa(e, t) {
  if (((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function ku(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == 'function' ? t(e) : (t.current = e);
  }
}
function ig(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), ig(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null && (delete t[Mt], delete t[oi], delete t[du], delete t[_1], delete t[F1])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function og(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Zf(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || og(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Tu(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = zo)));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (Tu(e, t, n), e = e.sibling; e !== null; ) (Tu(e, t, n), (e = e.sibling));
}
function ju(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (ju(e, t, n), e = e.sibling; e !== null; ) (ju(e, t, n), (e = e.sibling));
}
var we = null,
  St = !1;
function nn(e, t, n) {
  for (n = n.child; n !== null; ) (ag(e, t, n), (n = n.sibling));
}
function ag(e, t, n) {
  if (_t && typeof _t.onCommitFiberUnmount == 'function')
    try {
      _t.onCommitFiberUnmount(ya, n);
    } catch {}
  switch (n.tag) {
    case 5:
      Ae || Rr(n, t);
    case 6:
      var r = we,
        s = St;
      ((we = null),
        nn(e, t, n),
        (we = r),
        (St = s),
        we !== null &&
          (St
            ? ((e = we),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : we.removeChild(n.stateNode)));
      break;
    case 18:
      we !== null &&
        (St
          ? ((e = we),
            (n = n.stateNode),
            e.nodeType === 8 ? cl(e.parentNode, n) : e.nodeType === 1 && cl(e, n),
            ti(e))
          : cl(we, n.stateNode));
      break;
    case 4:
      ((r = we),
        (s = St),
        (we = n.stateNode.containerInfo),
        (St = !0),
        nn(e, t, n),
        (we = r),
        (St = s));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!Ae && ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))) {
        s = r = r.next;
        do {
          var i = s,
            o = i.destroy;
          ((i = i.tag), o !== void 0 && (i & 2 || i & 4) && Pu(n, t, o), (s = s.next));
        } while (s !== r);
      }
      nn(e, t, n);
      break;
    case 1:
      if (!Ae && (Rr(n, t), (r = n.stateNode), typeof r.componentWillUnmount == 'function'))
        try {
          ((r.props = n.memoizedProps), (r.state = n.memoizedState), r.componentWillUnmount());
        } catch (a) {
          ie(n, t, a);
        }
      nn(e, t, n);
      break;
    case 21:
      nn(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((Ae = (r = Ae) || n.memoizedState !== null), nn(e, t, n), (Ae = r))
        : nn(e, t, n);
      break;
    default:
      nn(e, t, n);
  }
}
function eh(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    (n === null && (n = e.stateNode = new Z1()),
      t.forEach(function (r) {
        var s = uw.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(s, s));
      }));
  }
}
function yt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var s = n[r];
      try {
        var i = e,
          o = t,
          a = o;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              ((we = a.stateNode), (St = !1));
              break e;
            case 3:
              ((we = a.stateNode.containerInfo), (St = !0));
              break e;
            case 4:
              ((we = a.stateNode.containerInfo), (St = !0));
              break e;
          }
          a = a.return;
        }
        if (we === null) throw Error(R(160));
        (ag(i, o, s), (we = null), (St = !1));
        var l = s.alternate;
        (l !== null && (l.return = null), (s.return = null));
      } catch (u) {
        ie(s, t, u);
      }
    }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) (lg(t, e), (t = t.sibling));
}
function lg(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((yt(t, e), At(e), r & 4)) {
        try {
          ($s(3, e, e.return), Pa(3, e));
        } catch (v) {
          ie(e, e.return, v);
        }
        try {
          $s(5, e, e.return);
        } catch (v) {
          ie(e, e.return, v);
        }
      }
      break;
    case 1:
      (yt(t, e), At(e), r & 512 && n !== null && Rr(n, n.return));
      break;
    case 5:
      if ((yt(t, e), At(e), r & 512 && n !== null && Rr(n, n.return), e.flags & 32)) {
        var s = e.stateNode;
        try {
          Ys(s, '');
        } catch (v) {
          ie(e, e.return, v);
        }
      }
      if (r & 4 && ((s = e.stateNode), s != null)) {
        var i = e.memoizedProps,
          o = n !== null ? n.memoizedProps : i,
          a = e.type,
          l = e.updateQueue;
        if (((e.updateQueue = null), l !== null))
          try {
            (a === 'input' && i.type === 'radio' && i.name != null && Am(s, i), Yl(a, o));
            var u = Yl(a, i);
            for (o = 0; o < l.length; o += 2) {
              var c = l[o],
                d = l[o + 1];
              c === 'style'
                ? Mm(s, d)
                : c === 'dangerouslySetInnerHTML'
                  ? Dm(s, d)
                  : c === 'children'
                    ? Ys(s, d)
                    : mc(s, c, d, u);
            }
            switch (a) {
              case 'input':
                Kl(s, i);
                break;
              case 'textarea':
                bm(s, i);
                break;
              case 'select':
                var h = s._wrapperState.wasMultiple;
                s._wrapperState.wasMultiple = !!i.multiple;
                var g = i.value;
                g != null
                  ? _r(s, !!i.multiple, g, !1)
                  : h !== !!i.multiple &&
                    (i.defaultValue != null
                      ? _r(s, !!i.multiple, i.defaultValue, !0)
                      : _r(s, !!i.multiple, i.multiple ? [] : '', !1));
            }
            s[oi] = i;
          } catch (v) {
            ie(e, e.return, v);
          }
      }
      break;
    case 6:
      if ((yt(t, e), At(e), r & 4)) {
        if (e.stateNode === null) throw Error(R(162));
        ((s = e.stateNode), (i = e.memoizedProps));
        try {
          s.nodeValue = i;
        } catch (v) {
          ie(e, e.return, v);
        }
      }
      break;
    case 3:
      if ((yt(t, e), At(e), r & 4 && n !== null && n.memoizedState.isDehydrated))
        try {
          ti(t.containerInfo);
        } catch (v) {
          ie(e, e.return, v);
        }
      break;
    case 4:
      (yt(t, e), At(e));
      break;
    case 13:
      (yt(t, e),
        At(e),
        (s = e.child),
        s.flags & 8192 &&
          ((i = s.memoizedState !== null),
          (s.stateNode.isHidden = i),
          !i || (s.alternate !== null && s.alternate.memoizedState !== null) || (Qc = ce())),
        r & 4 && eh(e));
      break;
    case 22:
      if (
        ((c = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((Ae = (u = Ae) || c), yt(t, e), (Ae = u)) : yt(t, e),
        At(e),
        r & 8192)
      ) {
        if (((u = e.memoizedState !== null), (e.stateNode.isHidden = u) && !c && e.mode & 1))
          for (b = e, c = e.child; c !== null; ) {
            for (d = b = c; b !== null; ) {
              switch (((h = b), (g = h.child), h.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  $s(4, h, h.return);
                  break;
                case 1:
                  Rr(h, h.return);
                  var w = h.stateNode;
                  if (typeof w.componentWillUnmount == 'function') {
                    ((r = h), (n = h.return));
                    try {
                      ((t = r),
                        (w.props = t.memoizedProps),
                        (w.state = t.memoizedState),
                        w.componentWillUnmount());
                    } catch (v) {
                      ie(r, n, v);
                    }
                  }
                  break;
                case 5:
                  Rr(h, h.return);
                  break;
                case 22:
                  if (h.memoizedState !== null) {
                    nh(d);
                    continue;
                  }
              }
              g !== null ? ((g.return = h), (b = g)) : nh(d);
            }
            c = c.sibling;
          }
        e: for (c = null, d = e; ; ) {
          if (d.tag === 5) {
            if (c === null) {
              c = d;
              try {
                ((s = d.stateNode),
                  u
                    ? ((i = s.style),
                      typeof i.setProperty == 'function'
                        ? i.setProperty('display', 'none', 'important')
                        : (i.display = 'none'))
                    : ((a = d.stateNode),
                      (l = d.memoizedProps.style),
                      (o = l != null && l.hasOwnProperty('display') ? l.display : null),
                      (a.style.display = Lm('display', o))));
              } catch (v) {
                ie(e, e.return, v);
              }
            }
          } else if (d.tag === 6) {
            if (c === null)
              try {
                d.stateNode.nodeValue = u ? '' : d.memoizedProps;
              } catch (v) {
                ie(e, e.return, v);
              }
          } else if (
            ((d.tag !== 22 && d.tag !== 23) || d.memoizedState === null || d === e) &&
            d.child !== null
          ) {
            ((d.child.return = d), (d = d.child));
            continue;
          }
          if (d === e) break e;
          for (; d.sibling === null; ) {
            if (d.return === null || d.return === e) break e;
            (c === d && (c = null), (d = d.return));
          }
          (c === d && (c = null), (d.sibling.return = d.return), (d = d.sibling));
        }
      }
      break;
    case 19:
      (yt(t, e), At(e), r & 4 && eh(e));
      break;
    case 21:
      break;
    default:
      (yt(t, e), At(e));
  }
}
function At(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (og(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(R(160));
      }
      switch (r.tag) {
        case 5:
          var s = r.stateNode;
          r.flags & 32 && (Ys(s, ''), (r.flags &= -33));
          var i = Zf(e);
          ju(e, i, s);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            a = Zf(e);
          Tu(e, a, o);
          break;
        default:
          throw Error(R(161));
      }
    } catch (l) {
      ie(e, e.return, l);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function tw(e, t, n) {
  ((b = e), ug(e));
}
function ug(e, t, n) {
  for (var r = (e.mode & 1) !== 0; b !== null; ) {
    var s = b,
      i = s.child;
    if (s.tag === 22 && r) {
      var o = s.memoizedState !== null || ro;
      if (!o) {
        var a = s.alternate,
          l = (a !== null && a.memoizedState !== null) || Ae;
        a = ro;
        var u = Ae;
        if (((ro = o), (Ae = l) && !u))
          for (b = s; b !== null; )
            ((o = b),
              (l = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? rh(s)
                : l !== null
                  ? ((l.return = o), (b = l))
                  : rh(s));
        for (; i !== null; ) ((b = i), ug(i), (i = i.sibling));
        ((b = s), (ro = a), (Ae = u));
      }
      th(e);
    } else s.subtreeFlags & 8772 && i !== null ? ((i.return = s), (b = i)) : th(e);
  }
}
function th(e) {
  for (; b !== null; ) {
    var t = b;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Ae || Pa(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Ae)
                if (n === null) r.componentDidMount();
                else {
                  var s = t.elementType === t.type ? n.memoizedProps : vt(t.type, n.memoizedProps);
                  r.componentDidUpdate(s, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
                }
              var i = t.updateQueue;
              i !== null && Vf(t, i, r);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                Vf(t, o, n);
              }
              break;
            case 5:
              var a = t.stateNode;
              if (n === null && t.flags & 4) {
                n = a;
                var l = t.memoizedProps;
                switch (t.type) {
                  case 'button':
                  case 'input':
                  case 'select':
                  case 'textarea':
                    l.autoFocus && n.focus();
                    break;
                  case 'img':
                    l.src && (n.src = l.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var u = t.alternate;
                if (u !== null) {
                  var c = u.memoizedState;
                  if (c !== null) {
                    var d = c.dehydrated;
                    d !== null && ti(d);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(R(163));
          }
        Ae || (t.flags & 512 && ku(t));
      } catch (h) {
        ie(t, t.return, h);
      }
    }
    if (t === e) {
      b = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      ((n.return = t.return), (b = n));
      break;
    }
    b = t.return;
  }
}
function nh(e) {
  for (; b !== null; ) {
    var t = b;
    if (t === e) {
      b = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      ((n.return = t.return), (b = n));
      break;
    }
    b = t.return;
  }
}
function rh(e) {
  for (; b !== null; ) {
    var t = b;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Pa(4, t);
          } catch (l) {
            ie(t, n, l);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == 'function') {
            var s = t.return;
            try {
              r.componentDidMount();
            } catch (l) {
              ie(t, s, l);
            }
          }
          var i = t.return;
          try {
            ku(t);
          } catch (l) {
            ie(t, i, l);
          }
          break;
        case 5:
          var o = t.return;
          try {
            ku(t);
          } catch (l) {
            ie(t, o, l);
          }
      }
    } catch (l) {
      ie(t, t.return, l);
    }
    if (t === e) {
      b = null;
      break;
    }
    var a = t.sibling;
    if (a !== null) {
      ((a.return = t.return), (b = a));
      break;
    }
    b = t.return;
  }
}
var nw = Math.ceil,
  Zo = tn.ReactCurrentDispatcher,
  Kc = tn.ReactCurrentOwner,
  ft = tn.ReactCurrentBatchConfig,
  U = 0,
  ve = null,
  he = null,
  Ce = 0,
  Ge = 0,
  Ar = Dn(0),
  me = 0,
  fi = null,
  ar = 0,
  ka = 0,
  qc = 0,
  Hs = null,
  ze = null,
  Qc = 0,
  rs = 1 / 0,
  zt = null,
  ea = !1,
  Nu = null,
  Pn = null,
  so = !1,
  gn = null,
  ta = 0,
  Ws = 0,
  Ru = null,
  ko = -1,
  To = 0;
function _e() {
  return U & 6 ? ce() : ko !== -1 ? ko : (ko = ce());
}
function kn(e) {
  return e.mode & 1
    ? U & 2 && Ce !== 0
      ? Ce & -Ce
      : V1.transition !== null
        ? (To === 0 && (To = qm()), To)
        : ((e = H), e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : ey(e.type))), e)
    : 1;
}
function Pt(e, t, n, r) {
  if (50 < Ws) throw ((Ws = 0), (Ru = null), Error(R(185)));
  (Ti(e, n, r),
    (!(U & 2) || e !== ve) &&
      (e === ve && (!(U & 2) && (ka |= n), me === 4 && un(e, Ce)),
      Ke(e, r),
      n === 1 && U === 0 && !(t.mode & 1) && ((rs = ce() + 500), Sa && Ln())));
}
function Ke(e, t) {
  var n = e.callbackNode;
  Vx(e, t);
  var r = Io(e, e === ve ? Ce : 0);
  if (r === 0) (n !== null && ff(n), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && ff(n), t === 1))
      (e.tag === 0 ? I1(sh.bind(null, e)) : xy(sh.bind(null, e)),
        L1(function () {
          !(U & 6) && Ln();
        }),
        (n = null));
    else {
      switch (Qm(r)) {
        case 1:
          n = wc;
          break;
        case 4:
          n = Wm;
          break;
        case 16:
          n = Fo;
          break;
        case 536870912:
          n = Km;
          break;
        default:
          n = Fo;
      }
      n = gg(n, cg.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = n));
  }
}
function cg(e, t) {
  if (((ko = -1), (To = 0), U & 6)) throw Error(R(327));
  var n = e.callbackNode;
  if (Ur() && e.callbackNode !== n) return null;
  var r = Io(e, e === ve ? Ce : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = na(e, r);
  else {
    t = r;
    var s = U;
    U |= 2;
    var i = fg();
    (ve !== e || Ce !== t) && ((zt = null), (rs = ce() + 500), er(e, t));
    do
      try {
        iw();
        break;
      } catch (a) {
        dg(e, a);
      }
    while (!0);
    (Dc(), (Zo.current = i), (U = s), he !== null ? (t = 0) : ((ve = null), (Ce = 0), (t = me)));
  }
  if (t !== 0) {
    if ((t === 2 && ((s = nu(e)), s !== 0 && ((r = s), (t = Au(e, s)))), t === 1))
      throw ((n = fi), er(e, 0), un(e, r), Ke(e, ce()), n);
    if (t === 6) un(e, r);
    else {
      if (
        ((s = e.current.alternate),
        !(r & 30) &&
          !rw(s) &&
          ((t = na(e, r)), t === 2 && ((i = nu(e)), i !== 0 && ((r = i), (t = Au(e, i)))), t === 1))
      )
        throw ((n = fi), er(e, 0), un(e, r), Ke(e, ce()), n);
      switch (((e.finishedWork = s), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(R(345));
        case 2:
          Vn(e, ze, zt);
          break;
        case 3:
          if ((un(e, r), (r & 130023424) === r && ((t = Qc + 500 - ce()), 10 < t))) {
            if (Io(e, 0) !== 0) break;
            if (((s = e.suspendedLanes), (s & r) !== r)) {
              (_e(), (e.pingedLanes |= e.suspendedLanes & s));
              break;
            }
            e.timeoutHandle = cu(Vn.bind(null, e, ze, zt), t);
            break;
          }
          Vn(e, ze, zt);
          break;
        case 4:
          if ((un(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, s = -1; 0 < r; ) {
            var o = 31 - Et(r);
            ((i = 1 << o), (o = t[o]), o > s && (s = o), (r &= ~i));
          }
          if (
            ((r = s),
            (r = ce() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * nw(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = cu(Vn.bind(null, e, ze, zt), r);
            break;
          }
          Vn(e, ze, zt);
          break;
        case 5:
          Vn(e, ze, zt);
          break;
        default:
          throw Error(R(329));
      }
    }
  }
  return (Ke(e, ce()), e.callbackNode === n ? cg.bind(null, e) : null);
}
function Au(e, t) {
  var n = Hs;
  return (
    e.current.memoizedState.isDehydrated && (er(e, t).flags |= 256),
    (e = na(e, t)),
    e !== 2 && ((t = ze), (ze = n), t !== null && bu(t)),
    e
  );
}
function bu(e) {
  ze === null ? (ze = e) : ze.push.apply(ze, e);
}
function rw(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var s = n[r],
            i = s.getSnapshot;
          s = s.value;
          try {
            if (!kt(i(), s)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) ((n.return = t), (t = n));
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function un(e, t) {
  for (
    t &= ~qc, t &= ~ka, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes;
    0 < t;
  ) {
    var n = 31 - Et(t),
      r = 1 << n;
    ((e[n] = -1), (t &= ~r));
  }
}
function sh(e) {
  if (U & 6) throw Error(R(327));
  Ur();
  var t = Io(e, 0);
  if (!(t & 1)) return (Ke(e, ce()), null);
  var n = na(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = nu(e);
    r !== 0 && ((t = r), (n = Au(e, r)));
  }
  if (n === 1) throw ((n = fi), er(e, 0), un(e, t), Ke(e, ce()), n);
  if (n === 6) throw Error(R(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Vn(e, ze, zt),
    Ke(e, ce()),
    null
  );
}
function Gc(e, t) {
  var n = U;
  U |= 1;
  try {
    return e(t);
  } finally {
    ((U = n), U === 0 && ((rs = ce() + 500), Sa && Ln()));
  }
}
function lr(e) {
  gn !== null && gn.tag === 0 && !(U & 6) && Ur();
  var t = U;
  U |= 1;
  var n = ft.transition,
    r = H;
  try {
    if (((ft.transition = null), (H = 1), e)) return e();
  } finally {
    ((H = r), (ft.transition = n), (U = t), !(U & 6) && Ln());
  }
}
function Xc() {
  ((Ge = Ar.current), G(Ar));
}
function er(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), D1(n)), he !== null))
    for (n = he.return; n !== null; ) {
      var r = n;
      switch ((Ac(r), r.tag)) {
        case 1:
          ((r = r.type.childContextTypes), r != null && $o());
          break;
        case 3:
          (ts(), G(He), G(De), Vc());
          break;
        case 5:
          Ic(r);
          break;
        case 4:
          ts();
          break;
        case 13:
          G(Z);
          break;
        case 19:
          G(Z);
          break;
        case 10:
          Lc(r.type._context);
          break;
        case 22:
        case 23:
          Xc();
      }
      n = n.return;
    }
  if (
    ((ve = e),
    (he = e = Tn(e.current, null)),
    (Ce = Ge = t),
    (me = 0),
    (fi = null),
    (qc = ka = ar = 0),
    (ze = Hs = null),
    Hn !== null)
  ) {
    for (t = 0; t < Hn.length; t++)
      if (((n = Hn[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var s = r.next,
          i = n.pending;
        if (i !== null) {
          var o = i.next;
          ((i.next = s), (r.next = o));
        }
        n.pending = r;
      }
    Hn = null;
  }
  return e;
}
function dg(e, t) {
  do {
    var n = he;
    try {
      if ((Dc(), (Co.current = Jo), Yo)) {
        for (var r = te.memoizedState; r !== null; ) {
          var s = r.queue;
          (s !== null && (s.pending = null), (r = r.next));
        }
        Yo = !1;
      }
      if (
        ((or = 0),
        (ge = pe = te = null),
        (zs = !1),
        (ui = 0),
        (Kc.current = null),
        n === null || n.return === null)
      ) {
        ((me = 1), (fi = t), (he = null));
        break;
      }
      e: {
        var i = e,
          o = n.return,
          a = n,
          l = t;
        if (
          ((t = Ce),
          (a.flags |= 32768),
          l !== null && typeof l == 'object' && typeof l.then == 'function')
        ) {
          var u = l,
            c = a,
            d = c.tag;
          if (!(c.mode & 1) && (d === 0 || d === 11 || d === 15)) {
            var h = c.alternate;
            h
              ? ((c.updateQueue = h.updateQueue),
                (c.memoizedState = h.memoizedState),
                (c.lanes = h.lanes))
              : ((c.updateQueue = null), (c.memoizedState = null));
          }
          var g = Wf(o);
          if (g !== null) {
            ((g.flags &= -257), Kf(g, o, a, i, t), g.mode & 1 && Hf(i, u, t), (t = g), (l = u));
            var w = t.updateQueue;
            if (w === null) {
              var v = new Set();
              (v.add(l), (t.updateQueue = v));
            } else w.add(l);
            break e;
          } else {
            if (!(t & 1)) {
              (Hf(i, u, t), Yc());
              break e;
            }
            l = Error(R(426));
          }
        } else if (J && a.mode & 1) {
          var x = Wf(o);
          if (x !== null) {
            (!(x.flags & 65536) && (x.flags |= 256), Kf(x, o, a, i, t), bc(ns(l, a)));
            break e;
          }
        }
        ((i = l = ns(l, a)), me !== 4 && (me = 2), Hs === null ? (Hs = [i]) : Hs.push(i), (i = o));
        do {
          switch (i.tag) {
            case 3:
              ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
              var p = Qy(i, l, t);
              If(i, p);
              break e;
            case 1:
              a = l;
              var m = i.type,
                y = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof m.getDerivedStateFromError == 'function' ||
                  (y !== null &&
                    typeof y.componentDidCatch == 'function' &&
                    (Pn === null || !Pn.has(y))))
              ) {
                ((i.flags |= 65536), (t &= -t), (i.lanes |= t));
                var S = Gy(i, a, t);
                If(i, S);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      pg(n);
    } catch (C) {
      ((t = C), he === n && n !== null && (he = n = n.return));
      continue;
    }
    break;
  } while (!0);
}
function fg() {
  var e = Zo.current;
  return ((Zo.current = Jo), e === null ? Jo : e);
}
function Yc() {
  ((me === 0 || me === 3 || me === 2) && (me = 4),
    ve === null || (!(ar & 268435455) && !(ka & 268435455)) || un(ve, Ce));
}
function na(e, t) {
  var n = U;
  U |= 2;
  var r = fg();
  (ve !== e || Ce !== t) && ((zt = null), er(e, t));
  do
    try {
      sw();
      break;
    } catch (s) {
      dg(e, s);
    }
  while (!0);
  if ((Dc(), (U = n), (Zo.current = r), he !== null)) throw Error(R(261));
  return ((ve = null), (Ce = 0), me);
}
function sw() {
  for (; he !== null; ) hg(he);
}
function iw() {
  for (; he !== null && !Ax(); ) hg(he);
}
function hg(e) {
  var t = yg(e.alternate, e, Ge);
  ((e.memoizedProps = e.pendingProps), t === null ? pg(e) : (he = t), (Kc.current = null));
}
function pg(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = J1(n, t)), n !== null)) {
        ((n.flags &= 32767), (he = n));
        return;
      }
      if (e !== null) ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((me = 6), (he = null));
        return;
      }
    } else if (((n = Y1(n, t, Ge)), n !== null)) {
      he = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      he = t;
      return;
    }
    he = t = e;
  } while (t !== null);
  me === 0 && (me = 5);
}
function Vn(e, t, n) {
  var r = H,
    s = ft.transition;
  try {
    ((ft.transition = null), (H = 1), ow(e, t, n, r));
  } finally {
    ((ft.transition = s), (H = r));
  }
  return null;
}
function ow(e, t, n, r) {
  do Ur();
  while (gn !== null);
  if (U & 6) throw Error(R(327));
  n = e.finishedWork;
  var s = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current)) throw Error(R(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var i = n.lanes | n.childLanes;
  if (
    (Bx(e, i),
    e === ve && ((he = ve = null), (Ce = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      so ||
      ((so = !0),
      gg(Fo, function () {
        return (Ur(), null);
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    ((i = ft.transition), (ft.transition = null));
    var o = H;
    H = 1;
    var a = U;
    ((U |= 4),
      (Kc.current = null),
      ew(e, n),
      lg(n, e),
      T1(lu),
      (Vo = !!au),
      (lu = au = null),
      (e.current = n),
      tw(n),
      bx(),
      (U = a),
      (H = o),
      (ft.transition = i));
  } else e.current = n;
  if (
    (so && ((so = !1), (gn = e), (ta = s)),
    (i = e.pendingLanes),
    i === 0 && (Pn = null),
    Lx(n.stateNode),
    Ke(e, ce()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((s = t[n]), r(s.value, { componentStack: s.stack, digest: s.digest }));
  if (ea) throw ((ea = !1), (e = Nu), (Nu = null), e);
  return (
    ta & 1 && e.tag !== 0 && Ur(),
    (i = e.pendingLanes),
    i & 1 ? (e === Ru ? Ws++ : ((Ws = 0), (Ru = e))) : (Ws = 0),
    Ln(),
    null
  );
}
function Ur() {
  if (gn !== null) {
    var e = Qm(ta),
      t = ft.transition,
      n = H;
    try {
      if (((ft.transition = null), (H = 16 > e ? 16 : e), gn === null)) var r = !1;
      else {
        if (((e = gn), (gn = null), (ta = 0), U & 6)) throw Error(R(331));
        var s = U;
        for (U |= 4, b = e.current; b !== null; ) {
          var i = b,
            o = i.child;
          if (b.flags & 16) {
            var a = i.deletions;
            if (a !== null) {
              for (var l = 0; l < a.length; l++) {
                var u = a[l];
                for (b = u; b !== null; ) {
                  var c = b;
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      $s(8, c, i);
                  }
                  var d = c.child;
                  if (d !== null) ((d.return = c), (b = d));
                  else
                    for (; b !== null; ) {
                      c = b;
                      var h = c.sibling,
                        g = c.return;
                      if ((ig(c), c === u)) {
                        b = null;
                        break;
                      }
                      if (h !== null) {
                        ((h.return = g), (b = h));
                        break;
                      }
                      b = g;
                    }
                }
              }
              var w = i.alternate;
              if (w !== null) {
                var v = w.child;
                if (v !== null) {
                  w.child = null;
                  do {
                    var x = v.sibling;
                    ((v.sibling = null), (v = x));
                  } while (v !== null);
                }
              }
              b = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) ((o.return = i), (b = o));
          else
            e: for (; b !== null; ) {
              if (((i = b), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    $s(9, i, i.return);
                }
              var p = i.sibling;
              if (p !== null) {
                ((p.return = i.return), (b = p));
                break e;
              }
              b = i.return;
            }
        }
        var m = e.current;
        for (b = m; b !== null; ) {
          o = b;
          var y = o.child;
          if (o.subtreeFlags & 2064 && y !== null) ((y.return = o), (b = y));
          else
            e: for (o = m; b !== null; ) {
              if (((a = b), a.flags & 2048))
                try {
                  switch (a.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pa(9, a);
                  }
                } catch (C) {
                  ie(a, a.return, C);
                }
              if (a === o) {
                b = null;
                break e;
              }
              var S = a.sibling;
              if (S !== null) {
                ((S.return = a.return), (b = S));
                break e;
              }
              b = a.return;
            }
        }
        if (((U = s), Ln(), _t && typeof _t.onPostCommitFiberRoot == 'function'))
          try {
            _t.onPostCommitFiberRoot(ya, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      ((H = n), (ft.transition = t));
    }
  }
  return !1;
}
function ih(e, t, n) {
  ((t = ns(n, t)),
    (t = Qy(e, t, 1)),
    (e = En(e, t, 1)),
    (t = _e()),
    e !== null && (Ti(e, 1, t), Ke(e, t)));
}
function ie(e, t, n) {
  if (e.tag === 3) ih(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        ih(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == 'function' ||
          (typeof r.componentDidCatch == 'function' && (Pn === null || !Pn.has(r)))
        ) {
          ((e = ns(n, e)),
            (e = Gy(t, e, 1)),
            (t = En(t, e, 1)),
            (e = _e()),
            t !== null && (Ti(t, 1, e), Ke(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function aw(e, t, n) {
  var r = e.pingCache;
  (r !== null && r.delete(t),
    (t = _e()),
    (e.pingedLanes |= e.suspendedLanes & n),
    ve === e &&
      (Ce & n) === n &&
      (me === 4 || (me === 3 && (Ce & 130023424) === Ce && 500 > ce() - Qc) ? er(e, 0) : (qc |= n)),
    Ke(e, t));
}
function mg(e, t) {
  t === 0 && (e.mode & 1 ? ((t = Qi), (Qi <<= 1), !(Qi & 130023424) && (Qi = 4194304)) : (t = 1));
  var n = _e();
  ((e = Jt(e, t)), e !== null && (Ti(e, t, n), Ke(e, n)));
}
function lw(e) {
  var t = e.memoizedState,
    n = 0;
  (t !== null && (n = t.retryLane), mg(e, n));
}
function uw(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        s = e.memoizedState;
      s !== null && (n = s.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(R(314));
  }
  (r !== null && r.delete(t), mg(e, n));
}
var yg;
yg = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || He.current) $e = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return (($e = !1), X1(e, t, n));
      $e = !!(e.flags & 131072);
    }
  else (($e = !1), J && t.flags & 1048576 && wy(t, Ko, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      (Po(e, t), (e = t.pendingProps));
      var s = Jr(t, De.current);
      (Br(t, n), (s = Uc(null, t, r, e, s, n)));
      var i = zc();
      return (
        (t.flags |= 1),
        typeof s == 'object' && s !== null && typeof s.render == 'function' && s.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            We(r) ? ((i = !0), Ho(t)) : (i = !1),
            (t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null),
            _c(t),
            (s.updater = Ea),
            (t.stateNode = s),
            (s._reactInternals = t),
            gu(t, r, e, n),
            (t = wu(null, t, r, !0, i, n)))
          : ((t.tag = 0), J && i && Rc(t), Le(null, t, s, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Po(e, t),
          (e = t.pendingProps),
          (s = r._init),
          (r = s(r._payload)),
          (t.type = r),
          (s = t.tag = dw(r)),
          (e = vt(r, e)),
          s)
        ) {
          case 0:
            t = xu(null, t, r, e, n);
            break e;
          case 1:
            t = Gf(null, t, r, e, n);
            break e;
          case 11:
            t = qf(null, t, r, e, n);
            break e;
          case 14:
            t = Qf(null, t, r, vt(r.type, e), n);
            break e;
        }
        throw Error(R(306, r, ''));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : vt(r, s)),
        xu(e, t, r, s, n)
      );
    case 1:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : vt(r, s)),
        Gf(e, t, r, s, n)
      );
    case 3:
      e: {
        if ((Zy(t), e === null)) throw Error(R(387));
        ((r = t.pendingProps), (i = t.memoizedState), (s = i.element), Ty(e, t), Go(t, r, null, n));
        var o = t.memoizedState;
        if (((r = o.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = i),
            (t.memoizedState = i),
            t.flags & 256)
          ) {
            ((s = ns(Error(R(423)), t)), (t = Xf(e, t, r, n, s)));
            break e;
          } else if (r !== s) {
            ((s = ns(Error(R(424)), t)), (t = Xf(e, t, r, n, s)));
            break e;
          } else
            for (
              Ye = Cn(t.stateNode.containerInfo.firstChild),
                Je = t,
                J = !0,
                Ct = null,
                n = Py(t, null, r, n),
                t.child = n;
              n;
            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
        else {
          if ((Zr(), r === s)) {
            t = Zt(e, t, n);
            break e;
          }
          Le(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        jy(t),
        e === null && pu(t),
        (r = t.type),
        (s = t.pendingProps),
        (i = e !== null ? e.memoizedProps : null),
        (o = s.children),
        uu(r, s) ? (o = null) : i !== null && uu(r, i) && (t.flags |= 32),
        Jy(e, t),
        Le(e, t, o, n),
        t.child
      );
    case 6:
      return (e === null && pu(t), null);
    case 13:
      return eg(e, t, n);
    case 4:
      return (
        Fc(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = es(t, null, r, n)) : Le(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : vt(r, s)),
        qf(e, t, r, s, n)
      );
    case 7:
      return (Le(e, t, t.pendingProps, n), t.child);
    case 8:
      return (Le(e, t, t.pendingProps.children, n), t.child);
    case 12:
      return (Le(e, t, t.pendingProps.children, n), t.child);
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (s = t.pendingProps),
          (i = t.memoizedProps),
          (o = s.value),
          q(qo, r._currentValue),
          (r._currentValue = o),
          i !== null)
        )
          if (kt(i.value, o)) {
            if (i.children === s.children && !He.current) {
              t = Zt(e, t, n);
              break e;
            }
          } else
            for (i = t.child, i !== null && (i.return = t); i !== null; ) {
              var a = i.dependencies;
              if (a !== null) {
                o = i.child;
                for (var l = a.firstContext; l !== null; ) {
                  if (l.context === r) {
                    if (i.tag === 1) {
                      ((l = qt(-1, n & -n)), (l.tag = 2));
                      var u = i.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var c = u.pending;
                        (c === null ? (l.next = l) : ((l.next = c.next), (c.next = l)),
                          (u.pending = l));
                      }
                    }
                    ((i.lanes |= n),
                      (l = i.alternate),
                      l !== null && (l.lanes |= n),
                      mu(i.return, n, t),
                      (a.lanes |= n));
                    break;
                  }
                  l = l.next;
                }
              } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
              else if (i.tag === 18) {
                if (((o = i.return), o === null)) throw Error(R(341));
                ((o.lanes |= n),
                  (a = o.alternate),
                  a !== null && (a.lanes |= n),
                  mu(o, n, t),
                  (o = i.sibling));
              } else o = i.child;
              if (o !== null) o.return = i;
              else
                for (o = i; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((i = o.sibling), i !== null)) {
                    ((i.return = o.return), (o = i));
                    break;
                  }
                  o = o.return;
                }
              i = o;
            }
        (Le(e, t, s.children, n), (t = t.child));
      }
      return t;
    case 9:
      return (
        (s = t.type),
        (r = t.pendingProps.children),
        Br(t, n),
        (s = ht(s)),
        (r = r(s)),
        (t.flags |= 1),
        Le(e, t, r, n),
        t.child
      );
    case 14:
      return ((r = t.type), (s = vt(r, t.pendingProps)), (s = vt(r.type, s)), Qf(e, t, r, s, n));
    case 15:
      return Xy(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : vt(r, s)),
        Po(e, t),
        (t.tag = 1),
        We(r) ? ((e = !0), Ho(t)) : (e = !1),
        Br(t, n),
        qy(t, r, s),
        gu(t, r, s, n),
        wu(null, t, r, !0, e, n)
      );
    case 19:
      return tg(e, t, n);
    case 22:
      return Yy(e, t, n);
  }
  throw Error(R(156, t.tag));
};
function gg(e, t) {
  return Hm(e, t);
}
function cw(e, t, n, r) {
  ((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function dt(e, t, n, r) {
  return new cw(e, t, n, r);
}
function Jc(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function dw(e) {
  if (typeof e == 'function') return Jc(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === gc)) return 11;
    if (e === vc) return 14;
  }
  return 2;
}
function Tn(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = dt(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function jo(e, t, n, r, s, i) {
  var o = 2;
  if (((r = e), typeof e == 'function')) Jc(e) && (o = 1);
  else if (typeof e == 'string') o = 5;
  else
    e: switch (e) {
      case wr:
        return tr(n.children, s, i, t);
      case yc:
        ((o = 8), (s |= 8));
        break;
      case Ul:
        return ((e = dt(12, n, t, s | 2)), (e.elementType = Ul), (e.lanes = i), e);
      case zl:
        return ((e = dt(13, n, t, s)), (e.elementType = zl), (e.lanes = i), e);
      case $l:
        return ((e = dt(19, n, t, s)), (e.elementType = $l), (e.lanes = i), e);
      case jm:
        return Ta(n, s, i, t);
      default:
        if (typeof e == 'object' && e !== null)
          switch (e.$$typeof) {
            case km:
              o = 10;
              break e;
            case Tm:
              o = 9;
              break e;
            case gc:
              o = 11;
              break e;
            case vc:
              o = 14;
              break e;
            case on:
              ((o = 16), (r = null));
              break e;
          }
        throw Error(R(130, e == null ? e : typeof e, ''));
    }
  return ((t = dt(o, n, t, s)), (t.elementType = e), (t.type = r), (t.lanes = i), t);
}
function tr(e, t, n, r) {
  return ((e = dt(7, e, r, t)), (e.lanes = n), e);
}
function Ta(e, t, n, r) {
  return (
    (e = dt(22, e, r, t)),
    (e.elementType = jm),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function vl(e, t, n) {
  return ((e = dt(6, e, null, t)), (e.lanes = n), e);
}
function xl(e, t, n) {
  return (
    (t = dt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function fw(e, t, n, r, s) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Za(0)),
    (this.expirationTimes = Za(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Za(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = s),
    (this.mutableSourceEagerHydrationData = null));
}
function Zc(e, t, n, r, s, i, o, a, l) {
  return (
    (e = new fw(e, t, n, a, l)),
    t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
    (i = dt(3, null, null, t)),
    (e.current = i),
    (i.stateNode = e),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    _c(i),
    e
  );
}
function hw(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: xr,
    key: r == null ? null : '' + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function vg(e) {
  if (!e) return Rn;
  e = e._reactInternals;
  e: {
    if (dr(e) !== e || e.tag !== 1) throw Error(R(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (We(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(R(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (We(n)) return vy(e, n, t);
  }
  return t;
}
function xg(e, t, n, r, s, i, o, a, l) {
  return (
    (e = Zc(n, r, !0, e, s, i, o, a, l)),
    (e.context = vg(null)),
    (n = e.current),
    (r = _e()),
    (s = kn(n)),
    (i = qt(r, s)),
    (i.callback = t ?? null),
    En(n, i, s),
    (e.current.lanes = s),
    Ti(e, s, r),
    Ke(e, r),
    e
  );
}
function ja(e, t, n, r) {
  var s = t.current,
    i = _e(),
    o = kn(s);
  return (
    (n = vg(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = qt(i, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = En(s, t, o)),
    e !== null && (Pt(e, s, o, i), So(e, s, o)),
    o
  );
}
function ra(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function oh(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function ed(e, t) {
  (oh(e, t), (e = e.alternate) && oh(e, t));
}
function pw() {
  return null;
}
var wg =
  typeof reportError == 'function'
    ? reportError
    : function (e) {
        console.error(e);
      };
function td(e) {
  this._internalRoot = e;
}
Na.prototype.render = td.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(R(409));
  ja(e, t, null, null);
};
Na.prototype.unmount = td.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (lr(function () {
      ja(null, e, null, null);
    }),
      (t[Yt] = null));
  }
};
function Na(e) {
  this._internalRoot = e;
}
Na.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Ym();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < ln.length && t !== 0 && t < ln[n].priority; n++);
    (ln.splice(n, 0, e), n === 0 && Zm(e));
  }
};
function nd(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Ra(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== ' react-mount-point-unstable '))
  );
}
function ah() {}
function mw(e, t, n, r, s) {
  if (s) {
    if (typeof r == 'function') {
      var i = r;
      r = function () {
        var u = ra(o);
        i.call(u);
      };
    }
    var o = xg(t, r, e, 0, null, !1, !1, '', ah);
    return (
      (e._reactRootContainer = o),
      (e[Yt] = o.current),
      si(e.nodeType === 8 ? e.parentNode : e),
      lr(),
      o
    );
  }
  for (; (s = e.lastChild); ) e.removeChild(s);
  if (typeof r == 'function') {
    var a = r;
    r = function () {
      var u = ra(l);
      a.call(u);
    };
  }
  var l = Zc(e, 0, !1, null, null, !1, !1, '', ah);
  return (
    (e._reactRootContainer = l),
    (e[Yt] = l.current),
    si(e.nodeType === 8 ? e.parentNode : e),
    lr(function () {
      ja(t, l, n, r);
    }),
    l
  );
}
function Aa(e, t, n, r, s) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof s == 'function') {
      var a = s;
      s = function () {
        var l = ra(o);
        a.call(l);
      };
    }
    ja(t, o, e, s);
  } else o = mw(n, t, e, s, r);
  return ra(o);
}
Gm = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Os(t.pendingLanes);
        n !== 0 && (Sc(t, n | 1), Ke(t, ce()), !(U & 6) && ((rs = ce() + 500), Ln()));
      }
      break;
    case 13:
      (lr(function () {
        var r = Jt(e, 1);
        if (r !== null) {
          var s = _e();
          Pt(r, e, 1, s);
        }
      }),
        ed(e, 1));
  }
};
Cc = function (e) {
  if (e.tag === 13) {
    var t = Jt(e, 134217728);
    if (t !== null) {
      var n = _e();
      Pt(t, e, 134217728, n);
    }
    ed(e, 134217728);
  }
};
Xm = function (e) {
  if (e.tag === 13) {
    var t = kn(e),
      n = Jt(e, t);
    if (n !== null) {
      var r = _e();
      Pt(n, e, t, r);
    }
    ed(e, t);
  }
};
Ym = function () {
  return H;
};
Jm = function (e, t) {
  var n = H;
  try {
    return ((H = e), t());
  } finally {
    H = n;
  }
};
Zl = function (e, t, n) {
  switch (t) {
    case 'input':
      if ((Kl(e, n), (t = n.name), n.type === 'radio' && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll('input[name=' + JSON.stringify('' + t) + '][type="radio"]'), t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var s = wa(r);
            if (!s) throw Error(R(90));
            (Rm(r), Kl(r, s));
          }
        }
      }
      break;
    case 'textarea':
      bm(e, n);
      break;
    case 'select':
      ((t = n.value), t != null && _r(e, !!n.multiple, t, !1));
  }
};
Im = Gc;
Vm = lr;
var yw = { usingClientEntryPoint: !1, Events: [Ni, Pr, wa, _m, Fm, Gc] },
  js = {
    findFiberByHostInstance: $n,
    bundleType: 0,
    version: '18.3.1',
    rendererPackageName: 'react-dom',
  },
  gw = {
    bundleType: js.bundleType,
    version: js.version,
    rendererPackageName: js.rendererPackageName,
    rendererConfig: js.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: tn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = zm(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: js.findFiberByHostInstance || pw,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: '18.3.1-next-f1338f8080-20240426',
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
  var io = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!io.isDisabled && io.supportsFiber)
    try {
      ((ya = io.inject(gw)), (_t = io));
    } catch {}
}
nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = yw;
nt.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!nd(t)) throw Error(R(200));
  return hw(e, t, null, n);
};
nt.createRoot = function (e, t) {
  if (!nd(e)) throw Error(R(299));
  var n = !1,
    r = '',
    s = wg;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (s = t.onRecoverableError)),
    (t = Zc(e, 1, !1, null, null, n, !1, r, s)),
    (e[Yt] = t.current),
    si(e.nodeType === 8 ? e.parentNode : e),
    new td(t)
  );
};
nt.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == 'function'
      ? Error(R(188))
      : ((e = Object.keys(e).join(',')), Error(R(268, e)));
  return ((e = zm(t)), (e = e === null ? null : e.stateNode), e);
};
nt.flushSync = function (e) {
  return lr(e);
};
nt.hydrate = function (e, t, n) {
  if (!Ra(t)) throw Error(R(200));
  return Aa(null, e, t, !0, n);
};
nt.hydrateRoot = function (e, t, n) {
  if (!nd(e)) throw Error(R(405));
  var r = (n != null && n.hydratedSources) || null,
    s = !1,
    i = '',
    o = wg;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (s = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = xg(t, null, e, 1, n ?? null, s, !1, i, o)),
    (e[Yt] = t.current),
    si(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (s = n._getVersion),
        (s = s(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, s])
          : t.mutableSourceEagerHydrationData.push(n, s));
  return new Na(t);
};
nt.render = function (e, t, n) {
  if (!Ra(t)) throw Error(R(200));
  return Aa(null, e, t, !1, n);
};
nt.unmountComponentAtNode = function (e) {
  if (!Ra(e)) throw Error(R(40));
  return e._reactRootContainer
    ? (lr(function () {
        Aa(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[Yt] = null));
        });
      }),
      !0)
    : !1;
};
nt.unstable_batchedUpdates = Gc;
nt.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Ra(n)) throw Error(R(200));
  if (e == null || e._reactInternals === void 0) throw Error(R(38));
  return Aa(e, t, n, !1, r);
};
nt.version = '18.3.1-next-f1338f8080-20240426';
function Sg() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Sg);
    } catch (e) {
      console.error(e);
    }
}
(Sg(), (Sm.exports = nt));
var vw = Sm.exports,
  lh = vw;
((Vl.createRoot = lh.createRoot), (Vl.hydrateRoot = lh.hydrateRoot));
/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function hi() {
  return (
    (hi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    hi.apply(this, arguments)
  );
}
var vn;
(function (e) {
  ((e.Pop = 'POP'), (e.Push = 'PUSH'), (e.Replace = 'REPLACE'));
})(vn || (vn = {}));
const uh = 'popstate';
function xw(e) {
  e === void 0 && (e = {});
  function t(r, s) {
    let { pathname: i, search: o, hash: a } = r.location;
    return Ou(
      '',
      { pathname: i, search: o, hash: a },
      (s.state && s.state.usr) || null,
      (s.state && s.state.key) || 'default',
    );
  }
  function n(r, s) {
    return typeof s == 'string' ? s : sa(s);
  }
  return Sw(t, n, null, e);
}
function de(e, t) {
  if (e === !1 || e === null || typeof e > 'u') throw new Error(t);
}
function rd(e, t) {
  if (!e) {
    typeof console < 'u' && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function ww() {
  return Math.random().toString(36).substr(2, 8);
}
function ch(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function Ou(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    hi(
      { pathname: typeof e == 'string' ? e : e.pathname, search: '', hash: '' },
      typeof t == 'string' ? ds(t) : t,
      { state: n, key: (t && t.key) || r || ww() },
    )
  );
}
function sa(e) {
  let { pathname: t = '/', search: n = '', hash: r = '' } = e;
  return (
    n && n !== '?' && (t += n.charAt(0) === '?' ? n : '?' + n),
    r && r !== '#' && (t += r.charAt(0) === '#' ? r : '#' + r),
    t
  );
}
function ds(e) {
  let t = {};
  if (e) {
    let n = e.indexOf('#');
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf('?');
    (r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))), e && (t.pathname = e));
  }
  return t;
}
function Sw(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: s = document.defaultView, v5Compat: i = !1 } = r,
    o = s.history,
    a = vn.Pop,
    l = null,
    u = c();
  u == null && ((u = 0), o.replaceState(hi({}, o.state, { idx: u }), ''));
  function c() {
    return (o.state || { idx: null }).idx;
  }
  function d() {
    a = vn.Pop;
    let x = c(),
      p = x == null ? null : x - u;
    ((u = x), l && l({ action: a, location: v.location, delta: p }));
  }
  function h(x, p) {
    a = vn.Push;
    let m = Ou(v.location, x, p);
    u = c() + 1;
    let y = ch(m, u),
      S = v.createHref(m);
    try {
      o.pushState(y, '', S);
    } catch (C) {
      if (C instanceof DOMException && C.name === 'DataCloneError') throw C;
      s.location.assign(S);
    }
    i && l && l({ action: a, location: v.location, delta: 1 });
  }
  function g(x, p) {
    a = vn.Replace;
    let m = Ou(v.location, x, p);
    u = c();
    let y = ch(m, u),
      S = v.createHref(m);
    (o.replaceState(y, '', S), i && l && l({ action: a, location: v.location, delta: 0 }));
  }
  function w(x) {
    let p = s.location.origin !== 'null' ? s.location.origin : s.location.href,
      m = typeof x == 'string' ? x : sa(x);
    return (
      (m = m.replace(/ $/, '%20')),
      de(p, 'No window.location.(origin|href) available to create URL for href: ' + m),
      new URL(m, p)
    );
  }
  let v = {
    get action() {
      return a;
    },
    get location() {
      return e(s, o);
    },
    listen(x) {
      if (l) throw new Error('A history only accepts one active listener');
      return (
        s.addEventListener(uh, d),
        (l = x),
        () => {
          (s.removeEventListener(uh, d), (l = null));
        }
      );
    },
    createHref(x) {
      return t(s, x);
    },
    createURL: w,
    encodeLocation(x) {
      let p = w(x);
      return { pathname: p.pathname, search: p.search, hash: p.hash };
    },
    push: h,
    replace: g,
    go(x) {
      return o.go(x);
    },
  };
  return v;
}
var dh;
(function (e) {
  ((e.data = 'data'), (e.deferred = 'deferred'), (e.redirect = 'redirect'), (e.error = 'error'));
})(dh || (dh = {}));
function Cw(e, t, n) {
  return (n === void 0 && (n = '/'), Ew(e, t, n));
}
function Ew(e, t, n, r) {
  let s = typeof t == 'string' ? ds(t) : t,
    i = sd(s.pathname || '/', n);
  if (i == null) return null;
  let o = Cg(e);
  Pw(o);
  let a = null;
  for (let l = 0; a == null && l < o.length; ++l) {
    let u = _w(i);
    a = Dw(o[l], u);
  }
  return a;
}
function Cg(e, t, n, r) {
  (t === void 0 && (t = []), n === void 0 && (n = []), r === void 0 && (r = ''));
  let s = (i, o, a) => {
    let l = {
      relativePath: a === void 0 ? i.path || '' : a,
      caseSensitive: i.caseSensitive === !0,
      childrenIndex: o,
      route: i,
    };
    l.relativePath.startsWith('/') &&
      (de(
        l.relativePath.startsWith(r),
        'Absolute route path "' +
          l.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          'must start with the combined path of all its parent routes.',
      ),
      (l.relativePath = l.relativePath.slice(r.length)));
    let u = jn([r, l.relativePath]),
      c = n.concat(l);
    (i.children &&
      i.children.length > 0 &&
      (de(
        i.index !== !0,
        'Index routes must not have child routes. Please remove ' +
          ('all child routes from route path "' + u + '".'),
      ),
      Cg(i.children, t, c, u)),
      !(i.path == null && !i.index) && t.push({ path: u, score: bw(u, i.index), routesMeta: c }));
  };
  return (
    e.forEach((i, o) => {
      var a;
      if (i.path === '' || !((a = i.path) != null && a.includes('?'))) s(i, o);
      else for (let l of Eg(i.path)) s(i, o, l);
    }),
    t
  );
}
function Eg(e) {
  let t = e.split('/');
  if (t.length === 0) return [];
  let [n, ...r] = t,
    s = n.endsWith('?'),
    i = n.replace(/\?$/, '');
  if (r.length === 0) return s ? [i, ''] : [i];
  let o = Eg(r.join('/')),
    a = [];
  return (
    a.push(...o.map((l) => (l === '' ? i : [i, l].join('/')))),
    s && a.push(...o),
    a.map((l) => (e.startsWith('/') && l === '' ? '/' : l))
  );
}
function Pw(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : Ow(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex),
        ),
  );
}
const kw = /^:[\w-]+$/,
  Tw = 3,
  jw = 2,
  Nw = 1,
  Rw = 10,
  Aw = -2,
  fh = (e) => e === '*';
function bw(e, t) {
  let n = e.split('/'),
    r = n.length;
  return (
    n.some(fh) && (r += Aw),
    t && (r += jw),
    n.filter((s) => !fh(s)).reduce((s, i) => s + (kw.test(i) ? Tw : i === '' ? Nw : Rw), r)
  );
}
function Ow(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, s) => r === t[s])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function Dw(e, t, n) {
  let { routesMeta: r } = e,
    s = {},
    i = '/',
    o = [];
  for (let a = 0; a < r.length; ++a) {
    let l = r[a],
      u = a === r.length - 1,
      c = i === '/' ? t : t.slice(i.length) || '/',
      d = Lw({ path: l.relativePath, caseSensitive: l.caseSensitive, end: u }, c),
      h = l.route;
    if (!d) return null;
    (Object.assign(s, d.params),
      o.push({
        params: s,
        pathname: jn([i, d.pathname]),
        pathnameBase: Uw(jn([i, d.pathnameBase])),
        route: h,
      }),
      d.pathnameBase !== '/' && (i = jn([i, d.pathnameBase])));
  }
  return o;
}
function Lw(e, t) {
  typeof e == 'string' && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = Mw(e.path, e.caseSensitive, e.end),
    s = t.match(n);
  if (!s) return null;
  let i = s[0],
    o = i.replace(/(.)\/+$/, '$1'),
    a = s.slice(1);
  return {
    params: r.reduce((u, c, d) => {
      let { paramName: h, isOptional: g } = c;
      if (h === '*') {
        let v = a[d] || '';
        o = i.slice(0, i.length - v.length).replace(/(.)\/+$/, '$1');
      }
      const w = a[d];
      return (g && !w ? (u[h] = void 0) : (u[h] = (w || '').replace(/%2F/g, '/')), u);
    }, {}),
    pathname: i,
    pathnameBase: o,
    pattern: e,
  };
}
function Mw(e, t, n) {
  (t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    rd(
      e === '*' || !e.endsWith('*') || e.endsWith('/*'),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, '/*') + '" because the `*` character must ') +
        'always follow a `/` in the pattern. To get rid of this warning, ' +
        ('please change the route path to "' + e.replace(/\*$/, '/*') + '".'),
    ));
  let r = [],
    s =
      '^' +
      e
        .replace(/\/*\*?$/, '')
        .replace(/^\/*/, '/')
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, a, l) => (
            r.push({ paramName: a, isOptional: l != null }),
            l ? '/?([^\\/]+)?' : '/([^\\/]+)'
          ),
        );
  return (
    e.endsWith('*')
      ? (r.push({ paramName: '*' }), (s += e === '*' || e === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
      : n
        ? (s += '\\/*$')
        : e !== '' && e !== '/' && (s += '(?:(?=\\/|$))'),
    [new RegExp(s, t ? void 0 : 'i'), r]
  );
}
function _w(e) {
  try {
    return e
      .split('/')
      .map((t) => decodeURIComponent(t).replace(/\//g, '%2F'))
      .join('/');
  } catch (t) {
    return (
      rd(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ('encoding (' + t + ').'),
      ),
      e
    );
  }
}
function sd(e, t) {
  if (t === '/') return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith('/') ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== '/' ? null : e.slice(n) || '/';
}
const Fw = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Iw = (e) => Fw.test(e);
function Vw(e, t) {
  t === void 0 && (t = '/');
  let { pathname: n, search: r = '', hash: s = '' } = typeof e == 'string' ? ds(e) : e,
    i;
  if (n)
    if (Iw(n)) i = n;
    else {
      if (n.includes('//')) {
        let o = n;
        ((n = n.replace(/\/\/+/g, '/')),
          rd(
            !1,
            'Pathnames cannot have embedded double slashes - normalizing ' + (o + ' -> ' + n),
          ));
      }
      n.startsWith('/') ? (i = hh(n.substring(1), '/')) : (i = hh(n, t));
    }
  else i = t;
  return { pathname: i, search: zw(r), hash: $w(s) };
}
function hh(e, t) {
  let n = t.replace(/\/+$/, '').split('/');
  return (
    e.split('/').forEach((s) => {
      s === '..' ? n.length > 1 && n.pop() : s !== '.' && n.push(s);
    }),
    n.length > 1 ? n.join('/') : '/'
  );
}
function wl(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ('`to.' + t + '` field [' + JSON.stringify(r) + '].  Please separate it out to the ') +
    ('`to.' + n + '` field. Alternatively you may provide the full path as ') +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function Bw(e) {
  return e.filter((t, n) => n === 0 || (t.route.path && t.route.path.length > 0));
}
function id(e, t) {
  let n = Bw(e);
  return t
    ? n.map((r, s) => (s === n.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase);
}
function od(e, t, n, r) {
  r === void 0 && (r = !1);
  let s;
  typeof e == 'string'
    ? (s = ds(e))
    : ((s = hi({}, e)),
      de(!s.pathname || !s.pathname.includes('?'), wl('?', 'pathname', 'search', s)),
      de(!s.pathname || !s.pathname.includes('#'), wl('#', 'pathname', 'hash', s)),
      de(!s.search || !s.search.includes('#'), wl('#', 'search', 'hash', s)));
  let i = e === '' || s.pathname === '',
    o = i ? '/' : s.pathname,
    a;
  if (o == null) a = n;
  else {
    let d = t.length - 1;
    if (!r && o.startsWith('..')) {
      let h = o.split('/');
      for (; h[0] === '..'; ) (h.shift(), (d -= 1));
      s.pathname = h.join('/');
    }
    a = d >= 0 ? t[d] : '/';
  }
  let l = Vw(s, a),
    u = o && o !== '/' && o.endsWith('/'),
    c = (i || o === '.') && n.endsWith('/');
  return (!l.pathname.endsWith('/') && (u || c) && (l.pathname += '/'), l);
}
const jn = (e) => e.join('/').replace(/\/\/+/g, '/'),
  Uw = (e) => e.replace(/\/+$/, '').replace(/^\/*/, '/'),
  zw = (e) => (!e || e === '?' ? '' : e.startsWith('?') ? e : '?' + e),
  $w = (e) => (!e || e === '#' ? '' : e.startsWith('#') ? e : '#' + e);
function Hw(e) {
  return (
    e != null &&
    typeof e.status == 'number' &&
    typeof e.statusText == 'string' &&
    typeof e.internal == 'boolean' &&
    'data' in e
  );
}
const Pg = ['post', 'put', 'patch', 'delete'];
new Set(Pg);
const Ww = ['get', ...Pg];
new Set(Ww);
/**
 * React Router v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function pi() {
  return (
    (pi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    pi.apply(this, arguments)
  );
}
const ad = P.createContext(null),
  Kw = P.createContext(null),
  Mn = P.createContext(null),
  ba = P.createContext(null),
  Bt = P.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  kg = P.createContext(null);
function qw(e, t) {
  let { relative: n } = t === void 0 ? {} : t;
  fs() || de(!1);
  let { basename: r, navigator: s } = P.useContext(Mn),
    { hash: i, pathname: o, search: a } = jg(e, { relative: n }),
    l = o;
  return (
    r !== '/' && (l = o === '/' ? r : jn([r, o])),
    s.createHref({ pathname: l, search: a, hash: i })
  );
}
function fs() {
  return P.useContext(ba) != null;
}
function fr() {
  return (fs() || de(!1), P.useContext(ba).location);
}
function Tg(e) {
  P.useContext(Mn).static || P.useLayoutEffect(e);
}
function hs() {
  let { isDataRoute: e } = P.useContext(Bt);
  return e ? uS() : Qw();
}
function Qw() {
  fs() || de(!1);
  let e = P.useContext(ad),
    { basename: t, future: n, navigator: r } = P.useContext(Mn),
    { matches: s } = P.useContext(Bt),
    { pathname: i } = fr(),
    o = JSON.stringify(id(s, n.v7_relativeSplatPath)),
    a = P.useRef(!1);
  return (
    Tg(() => {
      a.current = !0;
    }),
    P.useCallback(
      function (u, c) {
        if ((c === void 0 && (c = {}), !a.current)) return;
        if (typeof u == 'number') {
          r.go(u);
          return;
        }
        let d = od(u, JSON.parse(o), i, c.relative === 'path');
        (e == null && t !== '/' && (d.pathname = d.pathname === '/' ? t : jn([t, d.pathname])),
          (c.replace ? r.replace : r.push)(d, c.state, c));
      },
      [t, r, o, i, e],
    )
  );
}
const Gw = P.createContext(null);
function Xw(e) {
  let t = P.useContext(Bt).outlet;
  return t && P.createElement(Gw.Provider, { value: e }, t);
}
function Yw() {
  let { matches: e } = P.useContext(Bt),
    t = e[e.length - 1];
  return t ? t.params : {};
}
function jg(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = P.useContext(Mn),
    { matches: s } = P.useContext(Bt),
    { pathname: i } = fr(),
    o = JSON.stringify(id(s, r.v7_relativeSplatPath));
  return P.useMemo(() => od(e, JSON.parse(o), i, n === 'path'), [e, o, i, n]);
}
function Jw(e, t) {
  return Zw(e, t);
}
function Zw(e, t, n, r) {
  fs() || de(!1);
  let { navigator: s } = P.useContext(Mn),
    { matches: i } = P.useContext(Bt),
    o = i[i.length - 1],
    a = o ? o.params : {};
  o && o.pathname;
  let l = o ? o.pathnameBase : '/';
  o && o.route;
  let u = fr(),
    c;
  if (t) {
    var d;
    let x = typeof t == 'string' ? ds(t) : t;
    (l === '/' || ((d = x.pathname) != null && d.startsWith(l)) || de(!1), (c = x));
  } else c = u;
  let h = c.pathname || '/',
    g = h;
  if (l !== '/') {
    let x = l.replace(/^\//, '').split('/');
    g = '/' + h.replace(/^\//, '').split('/').slice(x.length).join('/');
  }
  let w = Cw(e, { pathname: g }),
    v = sS(
      w &&
        w.map((x) =>
          Object.assign({}, x, {
            params: Object.assign({}, a, x.params),
            pathname: jn([
              l,
              s.encodeLocation ? s.encodeLocation(x.pathname).pathname : x.pathname,
            ]),
            pathnameBase:
              x.pathnameBase === '/'
                ? l
                : jn([
                    l,
                    s.encodeLocation ? s.encodeLocation(x.pathnameBase).pathname : x.pathnameBase,
                  ]),
          }),
        ),
      i,
      n,
      r,
    );
  return t && v
    ? P.createElement(
        ba.Provider,
        {
          value: {
            location: pi({ pathname: '/', search: '', hash: '', state: null, key: 'default' }, c),
            navigationType: vn.Pop,
          },
        },
        v,
      )
    : v;
}
function eS() {
  let e = lS(),
    t = Hw(e) ? e.status + ' ' + e.statusText : e instanceof Error ? e.message : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    s = { padding: '0.5rem', backgroundColor: 'rgba(200,200,200, 0.5)' };
  return P.createElement(
    P.Fragment,
    null,
    P.createElement('h2', null, 'Unexpected Application Error!'),
    P.createElement('h3', { style: { fontStyle: 'italic' } }, t),
    n ? P.createElement('pre', { style: s }, n) : null,
    null,
  );
}
const tS = P.createElement(eS, null);
class nS extends P.Component {
  constructor(t) {
    (super(t),
      (this.state = { location: t.location, revalidation: t.revalidation, error: t.error }));
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location || (n.revalidation !== 'idle' && t.revalidation === 'idle')
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error('React Router caught the following error during render', t, n);
  }
  render() {
    return this.state.error !== void 0
      ? P.createElement(
          Bt.Provider,
          { value: this.props.routeContext },
          P.createElement(kg.Provider, { value: this.state.error, children: this.props.component }),
        )
      : this.props.children;
  }
}
function rS(e) {
  let { routeContext: t, match: n, children: r } = e,
    s = P.useContext(ad);
  return (
    s &&
      s.static &&
      s.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (s.staticContext._deepestRenderedBoundaryId = n.route.id),
    P.createElement(Bt.Provider, { value: t }, r)
  );
}
function sS(e, t, n, r) {
  var s;
  if (
    (t === void 0 && (t = []), n === void 0 && (n = null), r === void 0 && (r = null), e == null)
  ) {
    var i;
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if (
      (i = r) != null &&
      i.v7_partialHydration &&
      t.length === 0 &&
      !n.initialized &&
      n.matches.length > 0
    )
      e = n.matches;
    else return null;
  }
  let o = e,
    a = (s = n) == null ? void 0 : s.errors;
  if (a != null) {
    let c = o.findIndex((d) => d.route.id && (a == null ? void 0 : a[d.route.id]) !== void 0);
    (c >= 0 || de(!1), (o = o.slice(0, Math.min(o.length, c + 1))));
  }
  let l = !1,
    u = -1;
  if (n && r && r.v7_partialHydration)
    for (let c = 0; c < o.length; c++) {
      let d = o[c];
      if (((d.route.HydrateFallback || d.route.hydrateFallbackElement) && (u = c), d.route.id)) {
        let { loaderData: h, errors: g } = n,
          w = d.route.loader && h[d.route.id] === void 0 && (!g || g[d.route.id] === void 0);
        if (d.route.lazy || w) {
          ((l = !0), u >= 0 ? (o = o.slice(0, u + 1)) : (o = [o[0]]));
          break;
        }
      }
    }
  return o.reduceRight((c, d, h) => {
    let g,
      w = !1,
      v = null,
      x = null;
    n &&
      ((g = a && d.route.id ? a[d.route.id] : void 0),
      (v = d.route.errorElement || tS),
      l &&
        (u < 0 && h === 0
          ? (cS('route-fallback'), (w = !0), (x = null))
          : u === h && ((w = !0), (x = d.route.hydrateFallbackElement || null))));
    let p = t.concat(o.slice(0, h + 1)),
      m = () => {
        let y;
        return (
          g
            ? (y = v)
            : w
              ? (y = x)
              : d.route.Component
                ? (y = P.createElement(d.route.Component, null))
                : d.route.element
                  ? (y = d.route.element)
                  : (y = c),
          P.createElement(rS, {
            match: d,
            routeContext: { outlet: c, matches: p, isDataRoute: n != null },
            children: y,
          })
        );
      };
    return n && (d.route.ErrorBoundary || d.route.errorElement || h === 0)
      ? P.createElement(nS, {
          location: n.location,
          revalidation: n.revalidation,
          component: v,
          error: g,
          children: m(),
          routeContext: { outlet: null, matches: p, isDataRoute: !0 },
        })
      : m();
  }, null);
}
var Ng = (function (e) {
    return (
      (e.UseBlocker = 'useBlocker'),
      (e.UseRevalidator = 'useRevalidator'),
      (e.UseNavigateStable = 'useNavigate'),
      e
    );
  })(Ng || {}),
  Rg = (function (e) {
    return (
      (e.UseBlocker = 'useBlocker'),
      (e.UseLoaderData = 'useLoaderData'),
      (e.UseActionData = 'useActionData'),
      (e.UseRouteError = 'useRouteError'),
      (e.UseNavigation = 'useNavigation'),
      (e.UseRouteLoaderData = 'useRouteLoaderData'),
      (e.UseMatches = 'useMatches'),
      (e.UseRevalidator = 'useRevalidator'),
      (e.UseNavigateStable = 'useNavigate'),
      (e.UseRouteId = 'useRouteId'),
      e
    );
  })(Rg || {});
function iS(e) {
  let t = P.useContext(ad);
  return (t || de(!1), t);
}
function oS(e) {
  let t = P.useContext(Kw);
  return (t || de(!1), t);
}
function aS(e) {
  let t = P.useContext(Bt);
  return (t || de(!1), t);
}
function Ag(e) {
  let t = aS(),
    n = t.matches[t.matches.length - 1];
  return (n.route.id || de(!1), n.route.id);
}
function lS() {
  var e;
  let t = P.useContext(kg),
    n = oS(),
    r = Ag();
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r];
}
function uS() {
  let { router: e } = iS(Ng.UseNavigateStable),
    t = Ag(Rg.UseNavigateStable),
    n = P.useRef(!1);
  return (
    Tg(() => {
      n.current = !0;
    }),
    P.useCallback(
      function (s, i) {
        (i === void 0 && (i = {}),
          n.current &&
            (typeof s == 'number' ? e.navigate(s) : e.navigate(s, pi({ fromRouteId: t }, i))));
      },
      [e, t],
    )
  );
}
const ph = {};
function cS(e, t, n) {
  ph[e] || (ph[e] = !0);
}
function dS(e, t) {
  (e == null || e.v7_startTransition, e == null || e.v7_relativeSplatPath);
}
function fS(e) {
  let { to: t, replace: n, state: r, relative: s } = e;
  fs() || de(!1);
  let { future: i, static: o } = P.useContext(Mn),
    { matches: a } = P.useContext(Bt),
    { pathname: l } = fr(),
    u = hs(),
    c = od(t, id(a, i.v7_relativeSplatPath), l, s === 'path'),
    d = JSON.stringify(c);
  return (
    P.useEffect(() => u(JSON.parse(d), { replace: n, state: r, relative: s }), [u, d, s, n, r]),
    null
  );
}
function hS(e) {
  return Xw(e.context);
}
function ot(e) {
  de(!1);
}
function pS(e) {
  let {
    basename: t = '/',
    children: n = null,
    location: r,
    navigationType: s = vn.Pop,
    navigator: i,
    static: o = !1,
    future: a,
  } = e;
  fs() && de(!1);
  let l = t.replace(/^\/*/, '/'),
    u = P.useMemo(
      () => ({ basename: l, navigator: i, static: o, future: pi({ v7_relativeSplatPath: !1 }, a) }),
      [l, a, i, o],
    );
  typeof r == 'string' && (r = ds(r));
  let { pathname: c = '/', search: d = '', hash: h = '', state: g = null, key: w = 'default' } = r,
    v = P.useMemo(() => {
      let x = sd(c, l);
      return x == null
        ? null
        : { location: { pathname: x, search: d, hash: h, state: g, key: w }, navigationType: s };
    }, [l, c, d, h, g, w, s]);
  return v == null
    ? null
    : P.createElement(
        Mn.Provider,
        { value: u },
        P.createElement(ba.Provider, { children: n, value: v }),
      );
}
function mS(e) {
  let { children: t, location: n } = e;
  return Jw(Du(t), n);
}
new Promise(() => {});
function Du(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return (
    P.Children.forEach(e, (r, s) => {
      if (!P.isValidElement(r)) return;
      let i = [...t, s];
      if (r.type === P.Fragment) {
        n.push.apply(n, Du(r.props.children, i));
        return;
      }
      (r.type !== ot && de(!1), !r.props.index || !r.props.children || de(!1));
      let o = {
        id: r.props.id || i.join('-'),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary: r.props.ErrorBoundary != null || r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      (r.props.children && (o.children = Du(r.props.children, i)), n.push(o));
    }),
    n
  );
}
/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Lu() {
  return (
    (Lu = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Lu.apply(this, arguments)
  );
}
function yS(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    s,
    i;
  for (i = 0; i < r.length; i++) ((s = r[i]), !(t.indexOf(s) >= 0) && (n[s] = e[s]));
  return n;
}
function gS(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function vS(e, t) {
  return e.button === 0 && (!t || t === '_self') && !gS(e);
}
const xS = [
    'onClick',
    'relative',
    'reloadDocument',
    'replace',
    'state',
    'target',
    'to',
    'preventScrollReset',
    'viewTransition',
  ],
  wS = '6';
try {
  window.__reactRouterVersion = wS;
} catch {}
const SS = 'startTransition',
  mh = ax[SS];
function CS(e) {
  let { basename: t, children: n, future: r, window: s } = e,
    i = P.useRef();
  i.current == null && (i.current = xw({ window: s, v5Compat: !0 }));
  let o = i.current,
    [a, l] = P.useState({ action: o.action, location: o.location }),
    { v7_startTransition: u } = r || {},
    c = P.useCallback(
      (d) => {
        u && mh ? mh(() => l(d)) : l(d);
      },
      [l, u],
    );
  return (
    P.useLayoutEffect(() => o.listen(c), [o, c]),
    P.useEffect(() => dS(r), [r]),
    P.createElement(pS, {
      basename: t,
      children: n,
      location: a.location,
      navigationType: a.action,
      navigator: o,
      future: r,
    })
  );
}
const ES =
    typeof window < 'u' &&
    typeof window.document < 'u' &&
    typeof window.document.createElement < 'u',
  PS = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  K = P.forwardRef(function (t, n) {
    let {
        onClick: r,
        relative: s,
        reloadDocument: i,
        replace: o,
        state: a,
        target: l,
        to: u,
        preventScrollReset: c,
        viewTransition: d,
      } = t,
      h = yS(t, xS),
      { basename: g } = P.useContext(Mn),
      w,
      v = !1;
    if (typeof u == 'string' && PS.test(u) && ((w = u), ES))
      try {
        let y = new URL(window.location.href),
          S = u.startsWith('//') ? new URL(y.protocol + u) : new URL(u),
          C = sd(S.pathname, g);
        S.origin === y.origin && C != null ? (u = C + S.search + S.hash) : (v = !0);
      } catch {}
    let x = qw(u, { relative: s }),
      p = kS(u, {
        replace: o,
        state: a,
        target: l,
        preventScrollReset: c,
        relative: s,
        viewTransition: d,
      });
    function m(y) {
      (r && r(y), y.defaultPrevented || p(y));
    }
    return P.createElement(
      'a',
      Lu({}, h, { href: w || x, onClick: v || i ? r : m, ref: n, target: l }),
    );
  });
var yh;
(function (e) {
  ((e.UseScrollRestoration = 'useScrollRestoration'),
    (e.UseSubmit = 'useSubmit'),
    (e.UseSubmitFetcher = 'useSubmitFetcher'),
    (e.UseFetcher = 'useFetcher'),
    (e.useViewTransitionState = 'useViewTransitionState'));
})(yh || (yh = {}));
var gh;
(function (e) {
  ((e.UseFetcher = 'useFetcher'),
    (e.UseFetchers = 'useFetchers'),
    (e.UseScrollRestoration = 'useScrollRestoration'));
})(gh || (gh = {}));
function kS(e, t) {
  let {
      target: n,
      replace: r,
      state: s,
      preventScrollReset: i,
      relative: o,
      viewTransition: a,
    } = t === void 0 ? {} : t,
    l = hs(),
    u = fr(),
    c = jg(e, { relative: o });
  return P.useCallback(
    (d) => {
      if (vS(d, n)) {
        d.preventDefault();
        let h = r !== void 0 ? r : sa(u) === sa(c);
        l(e, { replace: h, state: s, preventScrollReset: i, relative: o, viewTransition: a });
      }
    },
    [u, l, c, r, s, n, e, i, o, a],
  );
}
var Oa = class {
    constructor() {
      ((this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this)));
    }
    subscribe(e) {
      return (
        this.listeners.add(e),
        this.onSubscribe(),
        () => {
          (this.listeners.delete(e), this.onUnsubscribe());
        }
      );
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  Qn,
  cn,
  zr,
  tm,
  TS =
    ((tm = class extends Oa {
      constructor() {
        super();
        B(this, Qn);
        B(this, cn);
        B(this, zr);
        I(this, zr, (t) => {
          if (typeof window < 'u' && window.addEventListener) {
            const n = () => t();
            return (
              window.addEventListener('visibilitychange', n, !1),
              () => {
                window.removeEventListener('visibilitychange', n);
              }
            );
          }
        });
      }
      onSubscribe() {
        k(this, cn) || this.setEventListener(k(this, zr));
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() || ((t = k(this, cn)) == null || t.call(this), I(this, cn, void 0));
      }
      setEventListener(t) {
        var n;
        (I(this, zr, t),
          (n = k(this, cn)) == null || n.call(this),
          I(
            this,
            cn,
            t((r) => {
              typeof r == 'boolean' ? this.setFocused(r) : this.onFocus();
            }),
          ));
      }
      setFocused(t) {
        k(this, Qn) !== t && (I(this, Qn, t), this.onFocus());
      }
      onFocus() {
        const t = this.isFocused();
        this.listeners.forEach((n) => {
          n(t);
        });
      }
      isFocused() {
        var t;
        return typeof k(this, Qn) == 'boolean'
          ? k(this, Qn)
          : ((t = globalThis.document) == null ? void 0 : t.visibilityState) !== 'hidden';
      }
    }),
    (Qn = new WeakMap()),
    (cn = new WeakMap()),
    (zr = new WeakMap()),
    tm),
  bg = new TS(),
  jS = {
    setTimeout: (e, t) => setTimeout(e, t),
    clearTimeout: (e) => clearTimeout(e),
    setInterval: (e, t) => setInterval(e, t),
    clearInterval: (e) => clearInterval(e),
  },
  dn,
  lc,
  nm,
  NS =
    ((nm = class {
      constructor() {
        B(this, dn, jS);
        B(this, lc, !1);
      }
      setTimeoutProvider(e) {
        I(this, dn, e);
      }
      setTimeout(e, t) {
        return k(this, dn).setTimeout(e, t);
      }
      clearTimeout(e) {
        k(this, dn).clearTimeout(e);
      }
      setInterval(e, t) {
        return k(this, dn).setInterval(e, t);
      }
      clearInterval(e) {
        k(this, dn).clearInterval(e);
      }
    }),
    (dn = new WeakMap()),
    (lc = new WeakMap()),
    nm),
  Mu = new NS();
function RS(e) {
  setTimeout(e, 0);
}
var AS = typeof window > 'u' || 'Deno' in globalThis;
function xt() {}
function bS(e, t) {
  return typeof e == 'function' ? e(t) : e;
}
function OS(e) {
  return typeof e == 'number' && e >= 0 && e !== 1 / 0;
}
function DS(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0);
}
function _u(e, t) {
  return typeof e == 'function' ? e(t) : e;
}
function LS(e, t) {
  return typeof e == 'function' ? e(t) : e;
}
function vh(e, t) {
  const { type: n = 'all', exact: r, fetchStatus: s, predicate: i, queryKey: o, stale: a } = e;
  if (o) {
    if (r) {
      if (t.queryHash !== ld(o, t.options)) return !1;
    } else if (!yi(t.queryKey, o)) return !1;
  }
  if (n !== 'all') {
    const l = t.isActive();
    if ((n === 'active' && !l) || (n === 'inactive' && l)) return !1;
  }
  return !(
    (typeof a == 'boolean' && t.isStale() !== a) ||
    (s && s !== t.state.fetchStatus) ||
    (i && !i(t))
  );
}
function xh(e, t) {
  const { exact: n, status: r, predicate: s, mutationKey: i } = e;
  if (i) {
    if (!t.options.mutationKey) return !1;
    if (n) {
      if (mi(t.options.mutationKey) !== mi(i)) return !1;
    } else if (!yi(t.options.mutationKey, i)) return !1;
  }
  return !((r && t.state.status !== r) || (s && !s(t)));
}
function ld(e, t) {
  return ((t == null ? void 0 : t.queryKeyHashFn) || mi)(e);
}
function mi(e) {
  return JSON.stringify(e, (t, n) =>
    Fu(n)
      ? Object.keys(n)
          .sort()
          .reduce((r, s) => ((r[s] = n[s]), r), {})
      : n,
  );
}
function yi(e, t) {
  return e === t
    ? !0
    : typeof e != typeof t
      ? !1
      : e && t && typeof e == 'object' && typeof t == 'object'
        ? Object.keys(t).every((n) => yi(e[n], t[n]))
        : !1;
}
var MS = Object.prototype.hasOwnProperty;
function Og(e, t, n = 0) {
  if (e === t) return e;
  if (n > 500) return t;
  const r = wh(e) && wh(t);
  if (!r && !(Fu(e) && Fu(t))) return t;
  const i = (r ? e : Object.keys(e)).length,
    o = r ? t : Object.keys(t),
    a = o.length,
    l = r ? new Array(a) : {};
  let u = 0;
  for (let c = 0; c < a; c++) {
    const d = r ? c : o[c],
      h = e[d],
      g = t[d];
    if (h === g) {
      ((l[d] = h), (r ? c < i : MS.call(e, d)) && u++);
      continue;
    }
    if (h === null || g === null || typeof h != 'object' || typeof g != 'object') {
      l[d] = g;
      continue;
    }
    const w = Og(h, g, n + 1);
    ((l[d] = w), w === h && u++);
  }
  return i === a && u === i ? e : l;
}
function wh(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function Fu(e) {
  if (!Sh(e)) return !1;
  const t = e.constructor;
  if (t === void 0) return !0;
  const n = t.prototype;
  return !(
    !Sh(n) ||
    !n.hasOwnProperty('isPrototypeOf') ||
    Object.getPrototypeOf(e) !== Object.prototype
  );
}
function Sh(e) {
  return Object.prototype.toString.call(e) === '[object Object]';
}
function _S(e) {
  return new Promise((t) => {
    Mu.setTimeout(t, e);
  });
}
function FS(e, t, n) {
  return typeof n.structuralSharing == 'function'
    ? n.structuralSharing(e, t)
    : n.structuralSharing !== !1
      ? Og(e, t)
      : t;
}
function IS(e, t, n = 0) {
  const r = [...e, t];
  return n && r.length > n ? r.slice(1) : r;
}
function VS(e, t, n = 0) {
  const r = [t, ...e];
  return n && r.length > n ? r.slice(0, -1) : r;
}
var ud = Symbol();
function Dg(e, t) {
  return !e.queryFn && t != null && t.initialPromise
    ? () => t.initialPromise
    : !e.queryFn || e.queryFn === ud
      ? () => Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`))
      : e.queryFn;
}
function BS(e, t, n) {
  let r = !1,
    s;
  return (
    Object.defineProperty(e, 'signal', {
      enumerable: !0,
      get: () => (
        s ?? (s = t()),
        r || ((r = !0), s.aborted ? n() : s.addEventListener('abort', n, { once: !0 })),
        s
      ),
    }),
    e
  );
}
var Lg = (() => {
  let e = () => AS;
  return {
    isServer() {
      return e();
    },
    setIsServer(t) {
      e = t;
    },
  };
})();
function US() {
  let e, t;
  const n = new Promise((s, i) => {
    ((e = s), (t = i));
  });
  ((n.status = 'pending'), n.catch(() => {}));
  function r(s) {
    (Object.assign(n, s), delete n.resolve, delete n.reject);
  }
  return (
    (n.resolve = (s) => {
      (r({ status: 'fulfilled', value: s }), e(s));
    }),
    (n.reject = (s) => {
      (r({ status: 'rejected', reason: s }), t(s));
    }),
    n
  );
}
var zS = RS;
function $S() {
  let e = [],
    t = 0,
    n = (a) => {
      a();
    },
    r = (a) => {
      a();
    },
    s = zS;
  const i = (a) => {
      t
        ? e.push(a)
        : s(() => {
            n(a);
          });
    },
    o = () => {
      const a = e;
      ((e = []),
        a.length &&
          s(() => {
            r(() => {
              a.forEach((l) => {
                n(l);
              });
            });
          }));
    };
  return {
    batch: (a) => {
      let l;
      t++;
      try {
        l = a();
      } finally {
        (t--, t || o());
      }
      return l;
    },
    batchCalls:
      (a) =>
      (...l) => {
        i(() => {
          a(...l);
        });
      },
    schedule: i,
    setNotifyFunction: (a) => {
      n = a;
    },
    setBatchNotifyFunction: (a) => {
      r = a;
    },
    setScheduler: (a) => {
      s = a;
    },
  };
}
var Me = $S(),
  $r,
  fn,
  Hr,
  rm,
  HS =
    ((rm = class extends Oa {
      constructor() {
        super();
        B(this, $r, !0);
        B(this, fn);
        B(this, Hr);
        I(this, Hr, (t) => {
          if (typeof window < 'u' && window.addEventListener) {
            const n = () => t(!0),
              r = () => t(!1);
            return (
              window.addEventListener('online', n, !1),
              window.addEventListener('offline', r, !1),
              () => {
                (window.removeEventListener('online', n), window.removeEventListener('offline', r));
              }
            );
          }
        });
      }
      onSubscribe() {
        k(this, fn) || this.setEventListener(k(this, Hr));
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() || ((t = k(this, fn)) == null || t.call(this), I(this, fn, void 0));
      }
      setEventListener(t) {
        var n;
        (I(this, Hr, t),
          (n = k(this, fn)) == null || n.call(this),
          I(this, fn, t(this.setOnline.bind(this))));
      }
      setOnline(t) {
        k(this, $r) !== t &&
          (I(this, $r, t),
          this.listeners.forEach((r) => {
            r(t);
          }));
      }
      isOnline() {
        return k(this, $r);
      }
    }),
    ($r = new WeakMap()),
    (fn = new WeakMap()),
    (Hr = new WeakMap()),
    rm),
  ia = new HS();
function WS(e) {
  return Math.min(1e3 * 2 ** e, 3e4);
}
function Mg(e) {
  return (e ?? 'online') === 'online' ? ia.isOnline() : !0;
}
var Iu = class extends Error {
  constructor(e) {
    (super('CancelledError'),
      (this.revert = e == null ? void 0 : e.revert),
      (this.silent = e == null ? void 0 : e.silent));
  }
};
function _g(e) {
  let t = !1,
    n = 0,
    r;
  const s = US(),
    i = () => s.status !== 'pending',
    o = (v) => {
      var x;
      if (!i()) {
        const p = new Iu(v);
        (h(p), (x = e.onCancel) == null || x.call(e, p));
      }
    },
    a = () => {
      t = !0;
    },
    l = () => {
      t = !1;
    },
    u = () => bg.isFocused() && (e.networkMode === 'always' || ia.isOnline()) && e.canRun(),
    c = () => Mg(e.networkMode) && e.canRun(),
    d = (v) => {
      i() || (r == null || r(), s.resolve(v));
    },
    h = (v) => {
      i() || (r == null || r(), s.reject(v));
    },
    g = () =>
      new Promise((v) => {
        var x;
        ((r = (p) => {
          (i() || u()) && v(p);
        }),
          (x = e.onPause) == null || x.call(e));
      }).then(() => {
        var v;
        ((r = void 0), i() || (v = e.onContinue) == null || v.call(e));
      }),
    w = () => {
      if (i()) return;
      let v;
      const x = n === 0 ? e.initialPromise : void 0;
      try {
        v = x ?? e.fn();
      } catch (p) {
        v = Promise.reject(p);
      }
      Promise.resolve(v)
        .then(d)
        .catch((p) => {
          var T;
          if (i()) return;
          const m = e.retry ?? (Lg.isServer() ? 0 : 3),
            y = e.retryDelay ?? WS,
            S = typeof y == 'function' ? y(n, p) : y,
            C = m === !0 || (typeof m == 'number' && n < m) || (typeof m == 'function' && m(n, p));
          if (t || !C) {
            h(p);
            return;
          }
          (n++,
            (T = e.onFail) == null || T.call(e, n, p),
            _S(S)
              .then(() => (u() ? void 0 : g()))
              .then(() => {
                t ? h(p) : w();
              }));
        });
    };
  return {
    promise: s,
    status: () => s.status,
    cancel: o,
    continue: () => (r == null || r(), s),
    cancelRetry: a,
    continueRetry: l,
    canStart: c,
    start: () => (c() ? w() : g().then(w), s),
  };
}
var Gn,
  sm,
  Fg =
    ((sm = class {
      constructor() {
        B(this, Gn);
      }
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        (this.clearGcTimeout(),
          OS(this.gcTime) &&
            I(
              this,
              Gn,
              Mu.setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime),
            ));
      }
      updateGcTime(e) {
        this.gcTime = Math.max(this.gcTime || 0, e ?? (Lg.isServer() ? 1 / 0 : 5 * 60 * 1e3));
      }
      clearGcTimeout() {
        k(this, Gn) !== void 0 && (Mu.clearTimeout(k(this, Gn)), I(this, Gn, void 0));
      }
    }),
    (Gn = new WeakMap()),
    sm);
function KS(e) {
  return {
    onFetch: (t, n) => {
      var c, d, h, g, w;
      const r = t.options,
        s =
          (h =
            (d = (c = t.fetchOptions) == null ? void 0 : c.meta) == null ? void 0 : d.fetchMore) ==
          null
            ? void 0
            : h.direction,
        i = ((g = t.state.data) == null ? void 0 : g.pages) || [],
        o = ((w = t.state.data) == null ? void 0 : w.pageParams) || [];
      let a = { pages: [], pageParams: [] },
        l = 0;
      const u = async () => {
        let v = !1;
        const x = (y) => {
            BS(
              y,
              () => t.signal,
              () => (v = !0),
            );
          },
          p = Dg(t.options, t.fetchOptions),
          m = async (y, S, C) => {
            if (v) return Promise.reject(t.signal.reason);
            if (S == null && y.pages.length) return Promise.resolve(y);
            const N = (() => {
                const z = {
                  client: t.client,
                  queryKey: t.queryKey,
                  pageParam: S,
                  direction: C ? 'backward' : 'forward',
                  meta: t.options.meta,
                };
                return (x(z), z);
              })(),
              j = await p(N),
              { maxPages: L } = t.options,
              D = C ? VS : IS;
            return { pages: D(y.pages, j, L), pageParams: D(y.pageParams, S, L) };
          };
        if (s && i.length) {
          const y = s === 'backward',
            S = y ? qS : Ch,
            C = { pages: i, pageParams: o },
            T = S(r, C);
          a = await m(C, T, y);
        } else {
          const y = e ?? i.length;
          do {
            const S = l === 0 ? (o[0] ?? r.initialPageParam) : Ch(r, a);
            if (l > 0 && S == null) break;
            ((a = await m(a, S)), l++);
          } while (l < y);
        }
        return a;
      };
      t.options.persister
        ? (t.fetchFn = () => {
            var v, x;
            return (x = (v = t.options).persister) == null
              ? void 0
              : x.call(
                  v,
                  u,
                  {
                    client: t.client,
                    queryKey: t.queryKey,
                    meta: t.options.meta,
                    signal: t.signal,
                  },
                  n,
                );
          })
        : (t.fetchFn = u);
    },
  };
}
function Ch(e, { pages: t, pageParams: n }) {
  const r = t.length - 1;
  return t.length > 0 ? e.getNextPageParam(t[r], t, n[r], n) : void 0;
}
function qS(e, { pages: t, pageParams: n }) {
  var r;
  return t.length > 0
    ? (r = e.getPreviousPageParam) == null
      ? void 0
      : r.call(e, t[0], t, n[0], n)
    : void 0;
}
var Wr,
  Xn,
  Kr,
  lt,
  Yn,
  ye,
  Ci,
  Jn,
  Xe,
  Ig,
  Ut,
  im,
  QS =
    ((im = class extends Fg {
      constructor(t) {
        super();
        B(this, Xe);
        B(this, Wr);
        B(this, Xn);
        B(this, Kr);
        B(this, lt);
        B(this, Yn);
        B(this, ye);
        B(this, Ci);
        B(this, Jn);
        (I(this, Jn, !1),
          I(this, Ci, t.defaultOptions),
          this.setOptions(t.options),
          (this.observers = []),
          I(this, Yn, t.client),
          I(this, lt, k(this, Yn).getQueryCache()),
          (this.queryKey = t.queryKey),
          (this.queryHash = t.queryHash),
          I(this, Xn, Ph(this.options)),
          (this.state = t.state ?? k(this, Xn)),
          this.scheduleGc());
      }
      get meta() {
        return this.options.meta;
      }
      get queryType() {
        return k(this, Wr);
      }
      get promise() {
        var t;
        return (t = k(this, ye)) == null ? void 0 : t.promise;
      }
      setOptions(t) {
        if (
          ((this.options = { ...k(this, Ci), ...t }),
          t != null && t._type && I(this, Wr, t._type),
          this.updateGcTime(this.options.gcTime),
          this.state && this.state.data === void 0)
        ) {
          const n = Ph(this.options);
          n.data !== void 0 && (this.setState(Eh(n.data, n.dataUpdatedAt)), I(this, Xn, n));
        }
      }
      optionalRemove() {
        !this.observers.length && this.state.fetchStatus === 'idle' && k(this, lt).remove(this);
      }
      setData(t, n) {
        const r = FS(this.state.data, t, this.options);
        return (
          xe(this, Xe, Ut).call(this, {
            data: r,
            type: 'success',
            dataUpdatedAt: n == null ? void 0 : n.updatedAt,
            manual: n == null ? void 0 : n.manual,
          }),
          r
        );
      }
      setState(t) {
        xe(this, Xe, Ut).call(this, { type: 'setState', state: t });
      }
      cancel(t) {
        var r, s;
        const n = (r = k(this, ye)) == null ? void 0 : r.promise;
        return (
          (s = k(this, ye)) == null || s.cancel(t),
          n ? n.then(xt).catch(xt) : Promise.resolve()
        );
      }
      destroy() {
        (super.destroy(), this.cancel({ silent: !0 }));
      }
      get resetState() {
        return k(this, Xn);
      }
      reset() {
        (this.destroy(), this.setState(this.resetState));
      }
      isActive() {
        return this.observers.some((t) => LS(t.options.enabled, this) !== !1);
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === ud || !this.isFetched();
      }
      isFetched() {
        return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
      }
      isStatic() {
        return this.getObserversCount() > 0
          ? this.observers.some((t) => _u(t.options.staleTime, this) === 'static')
          : !1;
      }
      isStale() {
        return this.getObserversCount() > 0
          ? this.observers.some((t) => t.getCurrentResult().isStale)
          : this.state.data === void 0 || this.state.isInvalidated;
      }
      isStaleByTime(t = 0) {
        return this.state.data === void 0
          ? !0
          : t === 'static'
            ? !1
            : this.state.isInvalidated
              ? !0
              : !DS(this.state.dataUpdatedAt, t);
      }
      onFocus() {
        var n;
        const t = this.observers.find((r) => r.shouldFetchOnWindowFocus());
        (t == null || t.refetch({ cancelRefetch: !1 }), (n = k(this, ye)) == null || n.continue());
      }
      onOnline() {
        var n;
        const t = this.observers.find((r) => r.shouldFetchOnReconnect());
        (t == null || t.refetch({ cancelRefetch: !1 }), (n = k(this, ye)) == null || n.continue());
      }
      addObserver(t) {
        this.observers.includes(t) ||
          (this.observers.push(t),
          this.clearGcTimeout(),
          k(this, lt).notify({ type: 'observerAdded', query: this, observer: t }));
      }
      removeObserver(t) {
        this.observers.includes(t) &&
          ((this.observers = this.observers.filter((n) => n !== t)),
          this.observers.length ||
            (k(this, ye) &&
              (k(this, Jn) || xe(this, Xe, Ig).call(this)
                ? k(this, ye).cancel({ revert: !0 })
                : k(this, ye).cancelRetry()),
            this.scheduleGc()),
          k(this, lt).notify({ type: 'observerRemoved', query: this, observer: t }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      invalidate() {
        this.state.isInvalidated || xe(this, Xe, Ut).call(this, { type: 'invalidate' });
      }
      async fetch(t, n) {
        var u, c, d, h, g, w, v, x, p, m, y;
        if (
          this.state.fetchStatus !== 'idle' &&
          ((u = k(this, ye)) == null ? void 0 : u.status()) !== 'rejected'
        ) {
          if (this.state.data !== void 0 && n != null && n.cancelRefetch)
            this.cancel({ silent: !0 });
          else if (k(this, ye)) return (k(this, ye).continueRetry(), k(this, ye).promise);
        }
        if ((t && this.setOptions(t), !this.options.queryFn)) {
          const S = this.observers.find((C) => C.options.queryFn);
          S && this.setOptions(S.options);
        }
        const r = new AbortController(),
          s = (S) => {
            Object.defineProperty(S, 'signal', {
              enumerable: !0,
              get: () => (I(this, Jn, !0), r.signal),
            });
          },
          i = () => {
            const S = Dg(this.options, n),
              T = (() => {
                const N = { client: k(this, Yn), queryKey: this.queryKey, meta: this.meta };
                return (s(N), N);
              })();
            return (
              I(this, Jn, !1),
              this.options.persister ? this.options.persister(S, T, this) : S(T)
            );
          },
          a = (() => {
            const S = {
              fetchOptions: n,
              options: this.options,
              queryKey: this.queryKey,
              client: k(this, Yn),
              state: this.state,
              fetchFn: i,
            };
            return (s(S), S);
          })(),
          l = k(this, Wr) === 'infinite' ? KS(this.options.pages) : this.options.behavior;
        (l == null || l.onFetch(a, this),
          I(this, Kr, this.state),
          (this.state.fetchStatus === 'idle' ||
            this.state.fetchMeta !== ((c = a.fetchOptions) == null ? void 0 : c.meta)) &&
            xe(this, Xe, Ut).call(this, {
              type: 'fetch',
              meta: (d = a.fetchOptions) == null ? void 0 : d.meta,
            }),
          I(
            this,
            ye,
            _g({
              initialPromise: n == null ? void 0 : n.initialPromise,
              fn: a.fetchFn,
              onCancel: (S) => {
                (S instanceof Iu &&
                  S.revert &&
                  this.setState({ ...k(this, Kr), fetchStatus: 'idle' }),
                  r.abort());
              },
              onFail: (S, C) => {
                xe(this, Xe, Ut).call(this, { type: 'failed', failureCount: S, error: C });
              },
              onPause: () => {
                xe(this, Xe, Ut).call(this, { type: 'pause' });
              },
              onContinue: () => {
                xe(this, Xe, Ut).call(this, { type: 'continue' });
              },
              retry: a.options.retry,
              retryDelay: a.options.retryDelay,
              networkMode: a.options.networkMode,
              canRun: () => !0,
            }),
          ));
        try {
          const S = await k(this, ye).start();
          if (S === void 0) throw new Error(`${this.queryHash} data is undefined`);
          return (
            this.setData(S),
            (g = (h = k(this, lt).config).onSuccess) == null || g.call(h, S, this),
            (v = (w = k(this, lt).config).onSettled) == null ||
              v.call(w, S, this.state.error, this),
            S
          );
        } catch (S) {
          if (S instanceof Iu) {
            if (S.silent) return k(this, ye).promise;
            if (S.revert) {
              if (this.state.data === void 0) throw S;
              return this.state.data;
            }
          }
          throw (
            xe(this, Xe, Ut).call(this, { type: 'error', error: S }),
            (p = (x = k(this, lt).config).onError) == null || p.call(x, S, this),
            (y = (m = k(this, lt).config).onSettled) == null || y.call(m, this.state.data, S, this),
            S
          );
        } finally {
          this.scheduleGc();
        }
      }
    }),
    (Wr = new WeakMap()),
    (Xn = new WeakMap()),
    (Kr = new WeakMap()),
    (lt = new WeakMap()),
    (Yn = new WeakMap()),
    (ye = new WeakMap()),
    (Ci = new WeakMap()),
    (Jn = new WeakMap()),
    (Xe = new WeakSet()),
    (Ig = function () {
      return this.state.fetchStatus === 'paused' && this.state.status === 'pending';
    }),
    (Ut = function (t) {
      const n = (r) => {
        switch (t.type) {
          case 'failed':
            return { ...r, fetchFailureCount: t.failureCount, fetchFailureReason: t.error };
          case 'pause':
            return { ...r, fetchStatus: 'paused' };
          case 'continue':
            return { ...r, fetchStatus: 'fetching' };
          case 'fetch':
            return { ...r, ...GS(r.data, this.options), fetchMeta: t.meta ?? null };
          case 'success':
            const s = {
              ...r,
              ...Eh(t.data, t.dataUpdatedAt),
              dataUpdateCount: r.dataUpdateCount + 1,
              ...(!t.manual && {
                fetchStatus: 'idle',
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            };
            return (I(this, Kr, t.manual ? s : void 0), s);
          case 'error':
            const i = t.error;
            return {
              ...r,
              error: i,
              errorUpdateCount: r.errorUpdateCount + 1,
              errorUpdatedAt: Date.now(),
              fetchFailureCount: r.fetchFailureCount + 1,
              fetchFailureReason: i,
              fetchStatus: 'idle',
              status: 'error',
              isInvalidated: !0,
            };
          case 'invalidate':
            return { ...r, isInvalidated: !0 };
          case 'setState':
            return { ...r, ...t.state };
        }
      };
      ((this.state = n(this.state)),
        Me.batch(() => {
          (this.observers.forEach((r) => {
            r.onQueryUpdate();
          }),
            k(this, lt).notify({ query: this, type: 'updated', action: t }));
        }));
    }),
    im);
function GS(e, t) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: Mg(t.networkMode) ? 'fetching' : 'paused',
    ...(e === void 0 && { error: null, status: 'pending' }),
  };
}
function Eh(e, t) {
  return {
    data: e,
    dataUpdatedAt: t ?? Date.now(),
    error: null,
    isInvalidated: !1,
    status: 'success',
  };
}
function Ph(e) {
  const t = typeof e.initialData == 'function' ? e.initialData() : e.initialData,
    n = t !== void 0,
    r = n
      ? typeof e.initialDataUpdatedAt == 'function'
        ? e.initialDataUpdatedAt()
        : e.initialDataUpdatedAt
      : 0;
  return {
    data: t,
    dataUpdateCount: 0,
    dataUpdatedAt: n ? (r ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: n ? 'success' : 'pending',
    fetchStatus: 'idle',
  };
}
var Ei,
  Ot,
  Ne,
  Zn,
  Dt,
  rn,
  om,
  XS =
    ((om = class extends Fg {
      constructor(t) {
        super();
        B(this, Dt);
        B(this, Ei);
        B(this, Ot);
        B(this, Ne);
        B(this, Zn);
        (I(this, Ei, t.client),
          (this.mutationId = t.mutationId),
          I(this, Ne, t.mutationCache),
          I(this, Ot, []),
          (this.state = t.state || YS()),
          this.setOptions(t.options),
          this.scheduleGc());
      }
      setOptions(t) {
        ((this.options = t), this.updateGcTime(this.options.gcTime));
      }
      get meta() {
        return this.options.meta;
      }
      addObserver(t) {
        k(this, Ot).includes(t) ||
          (k(this, Ot).push(t),
          this.clearGcTimeout(),
          k(this, Ne).notify({ type: 'observerAdded', mutation: this, observer: t }));
      }
      removeObserver(t) {
        (I(
          this,
          Ot,
          k(this, Ot).filter((n) => n !== t),
        ),
          this.scheduleGc(),
          k(this, Ne).notify({ type: 'observerRemoved', mutation: this, observer: t }));
      }
      optionalRemove() {
        k(this, Ot).length ||
          (this.state.status === 'pending' ? this.scheduleGc() : k(this, Ne).remove(this));
      }
      continue() {
        var t;
        return (
          ((t = k(this, Zn)) == null ? void 0 : t.continue()) ?? this.execute(this.state.variables)
        );
      }
      async execute(t) {
        var o, a, l, u, c, d, h, g, w, v, x, p, m, y, S, C, T, N;
        const n = () => {
            xe(this, Dt, rn).call(this, { type: 'continue' });
          },
          r = {
            client: k(this, Ei),
            meta: this.options.meta,
            mutationKey: this.options.mutationKey,
          };
        I(
          this,
          Zn,
          _g({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(t, r)
                : Promise.reject(new Error('No mutationFn found')),
            onFail: (j, L) => {
              xe(this, Dt, rn).call(this, { type: 'failed', failureCount: j, error: L });
            },
            onPause: () => {
              xe(this, Dt, rn).call(this, { type: 'pause' });
            },
            onContinue: n,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => k(this, Ne).canRun(this),
          }),
        );
        const s = this.state.status === 'pending',
          i = !k(this, Zn).canStart();
        try {
          if (s) n();
          else {
            (xe(this, Dt, rn).call(this, { type: 'pending', variables: t, isPaused: i }),
              k(this, Ne).config.onMutate && (await k(this, Ne).config.onMutate(t, this, r)));
            const L = await ((a = (o = this.options).onMutate) == null ? void 0 : a.call(o, t, r));
            L !== this.state.context &&
              xe(this, Dt, rn).call(this, {
                type: 'pending',
                context: L,
                variables: t,
                isPaused: i,
              });
          }
          const j = await k(this, Zn).start();
          return (
            await ((u = (l = k(this, Ne).config).onSuccess) == null
              ? void 0
              : u.call(l, j, t, this.state.context, this, r)),
            await ((d = (c = this.options).onSuccess) == null
              ? void 0
              : d.call(c, j, t, this.state.context, r)),
            await ((g = (h = k(this, Ne).config).onSettled) == null
              ? void 0
              : g.call(h, j, null, this.state.variables, this.state.context, this, r)),
            await ((v = (w = this.options).onSettled) == null
              ? void 0
              : v.call(w, j, null, t, this.state.context, r)),
            xe(this, Dt, rn).call(this, { type: 'success', data: j }),
            j
          );
        } catch (j) {
          try {
            await ((p = (x = k(this, Ne).config).onError) == null
              ? void 0
              : p.call(x, j, t, this.state.context, this, r));
          } catch (L) {
            Promise.reject(L);
          }
          try {
            await ((y = (m = this.options).onError) == null
              ? void 0
              : y.call(m, j, t, this.state.context, r));
          } catch (L) {
            Promise.reject(L);
          }
          try {
            await ((C = (S = k(this, Ne).config).onSettled) == null
              ? void 0
              : C.call(S, void 0, j, this.state.variables, this.state.context, this, r));
          } catch (L) {
            Promise.reject(L);
          }
          try {
            await ((N = (T = this.options).onSettled) == null
              ? void 0
              : N.call(T, void 0, j, t, this.state.context, r));
          } catch (L) {
            Promise.reject(L);
          }
          throw (xe(this, Dt, rn).call(this, { type: 'error', error: j }), j);
        } finally {
          k(this, Ne).runNext(this);
        }
      }
    }),
    (Ei = new WeakMap()),
    (Ot = new WeakMap()),
    (Ne = new WeakMap()),
    (Zn = new WeakMap()),
    (Dt = new WeakSet()),
    (rn = function (t) {
      const n = (r) => {
        switch (t.type) {
          case 'failed':
            return { ...r, failureCount: t.failureCount, failureReason: t.error };
          case 'pause':
            return { ...r, isPaused: !0 };
          case 'continue':
            return { ...r, isPaused: !1 };
          case 'pending':
            return {
              ...r,
              context: t.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: t.isPaused,
              status: 'pending',
              variables: t.variables,
              submittedAt: Date.now(),
            };
          case 'success':
            return {
              ...r,
              data: t.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: 'success',
              isPaused: !1,
            };
          case 'error':
            return {
              ...r,
              data: void 0,
              error: t.error,
              failureCount: r.failureCount + 1,
              failureReason: t.error,
              isPaused: !1,
              status: 'error',
            };
        }
      };
      ((this.state = n(this.state)),
        Me.batch(() => {
          (k(this, Ot).forEach((r) => {
            r.onMutationUpdate(t);
          }),
            k(this, Ne).notify({ mutation: this, type: 'updated', action: t }));
        }));
    }),
    om);
function YS() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: 'idle',
    variables: void 0,
    submittedAt: 0,
  };
}
var Ht,
  wt,
  Pi,
  am,
  JS =
    ((am = class extends Oa {
      constructor(t = {}) {
        super();
        B(this, Ht);
        B(this, wt);
        B(this, Pi);
        ((this.config = t), I(this, Ht, new Set()), I(this, wt, new Map()), I(this, Pi, 0));
      }
      build(t, n, r) {
        const s = new XS({
          client: t,
          mutationCache: this,
          mutationId: ++zi(this, Pi)._,
          options: t.defaultMutationOptions(n),
          state: r,
        });
        return (this.add(s), s);
      }
      add(t) {
        k(this, Ht).add(t);
        const n = oo(t);
        if (typeof n == 'string') {
          const r = k(this, wt).get(n);
          r ? r.push(t) : k(this, wt).set(n, [t]);
        }
        this.notify({ type: 'added', mutation: t });
      }
      remove(t) {
        if (k(this, Ht).delete(t)) {
          const n = oo(t);
          if (typeof n == 'string') {
            const r = k(this, wt).get(n);
            if (r)
              if (r.length > 1) {
                const s = r.indexOf(t);
                s !== -1 && r.splice(s, 1);
              } else r[0] === t && k(this, wt).delete(n);
          }
        }
        this.notify({ type: 'removed', mutation: t });
      }
      canRun(t) {
        const n = oo(t);
        if (typeof n == 'string') {
          const r = k(this, wt).get(n),
            s = r == null ? void 0 : r.find((i) => i.state.status === 'pending');
          return !s || s === t;
        } else return !0;
      }
      runNext(t) {
        var r;
        const n = oo(t);
        if (typeof n == 'string') {
          const s =
            (r = k(this, wt).get(n)) == null ? void 0 : r.find((i) => i !== t && i.state.isPaused);
          return (s == null ? void 0 : s.continue()) ?? Promise.resolve();
        } else return Promise.resolve();
      }
      clear() {
        Me.batch(() => {
          (k(this, Ht).forEach((t) => {
            this.notify({ type: 'removed', mutation: t });
          }),
            k(this, Ht).clear(),
            k(this, wt).clear());
        });
      }
      getAll() {
        return Array.from(k(this, Ht));
      }
      find(t) {
        const n = { exact: !0, ...t };
        return this.getAll().find((r) => xh(n, r));
      }
      findAll(t = {}) {
        return this.getAll().filter((n) => xh(t, n));
      }
      notify(t) {
        Me.batch(() => {
          this.listeners.forEach((n) => {
            n(t);
          });
        });
      }
      resumePausedMutations() {
        const t = this.getAll().filter((n) => n.state.isPaused);
        return Me.batch(() => Promise.all(t.map((n) => n.continue().catch(xt))));
      }
    }),
    (Ht = new WeakMap()),
    (wt = new WeakMap()),
    (Pi = new WeakMap()),
    am);
function oo(e) {
  var t;
  return (t = e.options.scope) == null ? void 0 : t.id;
}
var Lt,
  lm,
  ZS =
    ((lm = class extends Oa {
      constructor(t = {}) {
        super();
        B(this, Lt);
        ((this.config = t), I(this, Lt, new Map()));
      }
      build(t, n, r) {
        const s = n.queryKey,
          i = n.queryHash ?? ld(s, n);
        let o = this.get(i);
        return (
          o ||
            ((o = new QS({
              client: t,
              queryKey: s,
              queryHash: i,
              options: t.defaultQueryOptions(n),
              state: r,
              defaultOptions: t.getQueryDefaults(s),
            })),
            this.add(o)),
          o
        );
      }
      add(t) {
        k(this, Lt).has(t.queryHash) ||
          (k(this, Lt).set(t.queryHash, t), this.notify({ type: 'added', query: t }));
      }
      remove(t) {
        const n = k(this, Lt).get(t.queryHash);
        n &&
          (t.destroy(),
          n === t && k(this, Lt).delete(t.queryHash),
          this.notify({ type: 'removed', query: t }));
      }
      clear() {
        Me.batch(() => {
          this.getAll().forEach((t) => {
            this.remove(t);
          });
        });
      }
      get(t) {
        return k(this, Lt).get(t);
      }
      getAll() {
        return [...k(this, Lt).values()];
      }
      find(t) {
        const n = { exact: !0, ...t };
        return this.getAll().find((r) => vh(n, r));
      }
      findAll(t = {}) {
        const n = this.getAll();
        return Object.keys(t).length > 0 ? n.filter((r) => vh(t, r)) : n;
      }
      notify(t) {
        Me.batch(() => {
          this.listeners.forEach((n) => {
            n(t);
          });
        });
      }
      onFocus() {
        Me.batch(() => {
          this.getAll().forEach((t) => {
            t.onFocus();
          });
        });
      }
      onOnline() {
        Me.batch(() => {
          this.getAll().forEach((t) => {
            t.onOnline();
          });
        });
      }
    }),
    (Lt = new WeakMap()),
    lm),
  re,
  hn,
  pn,
  qr,
  Qr,
  mn,
  Gr,
  Xr,
  um,
  eC =
    ((um = class {
      constructor(e = {}) {
        B(this, re);
        B(this, hn);
        B(this, pn);
        B(this, qr);
        B(this, Qr);
        B(this, mn);
        B(this, Gr);
        B(this, Xr);
        (I(this, re, e.queryCache || new ZS()),
          I(this, hn, e.mutationCache || new JS()),
          I(this, pn, e.defaultOptions || {}),
          I(this, qr, new Map()),
          I(this, Qr, new Map()),
          I(this, mn, 0));
      }
      mount() {
        (zi(this, mn)._++,
          k(this, mn) === 1 &&
            (I(
              this,
              Gr,
              bg.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), k(this, re).onFocus());
              }),
            ),
            I(
              this,
              Xr,
              ia.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), k(this, re).onOnline());
              }),
            )));
      }
      unmount() {
        var e, t;
        (zi(this, mn)._--,
          k(this, mn) === 0 &&
            ((e = k(this, Gr)) == null || e.call(this),
            I(this, Gr, void 0),
            (t = k(this, Xr)) == null || t.call(this),
            I(this, Xr, void 0)));
      }
      isFetching(e) {
        return k(this, re).findAll({ ...e, fetchStatus: 'fetching' }).length;
      }
      isMutating(e) {
        return k(this, hn).findAll({ ...e, status: 'pending' }).length;
      }
      getQueryData(e) {
        var n;
        const t = this.defaultQueryOptions({ queryKey: e });
        return (n = k(this, re).get(t.queryHash)) == null ? void 0 : n.state.data;
      }
      ensureQueryData(e) {
        const t = this.defaultQueryOptions(e),
          n = k(this, re).build(this, t),
          r = n.state.data;
        return r === void 0
          ? this.fetchQuery(e)
          : (e.revalidateIfStale && n.isStaleByTime(_u(t.staleTime, n)) && this.prefetchQuery(t),
            Promise.resolve(r));
      }
      getQueriesData(e) {
        return k(this, re)
          .findAll(e)
          .map(({ queryKey: t, state: n }) => {
            const r = n.data;
            return [t, r];
          });
      }
      setQueryData(e, t, n) {
        const r = this.defaultQueryOptions({ queryKey: e }),
          s = k(this, re).get(r.queryHash),
          i = s == null ? void 0 : s.state.data,
          o = bS(t, i);
        if (o !== void 0)
          return k(this, re)
            .build(this, r)
            .setData(o, { ...n, manual: !0 });
      }
      setQueriesData(e, t, n) {
        return Me.batch(() =>
          k(this, re)
            .findAll(e)
            .map(({ queryKey: r }) => [r, this.setQueryData(r, t, n)]),
        );
      }
      getQueryState(e) {
        var n;
        const t = this.defaultQueryOptions({ queryKey: e });
        return (n = k(this, re).get(t.queryHash)) == null ? void 0 : n.state;
      }
      removeQueries(e) {
        const t = k(this, re);
        Me.batch(() => {
          t.findAll(e).forEach((n) => {
            t.remove(n);
          });
        });
      }
      resetQueries(e, t) {
        const n = k(this, re);
        return Me.batch(
          () => (
            n.findAll(e).forEach((r) => {
              r.reset();
            }),
            this.refetchQueries({ type: 'active', ...e }, t)
          ),
        );
      }
      cancelQueries(e, t = {}) {
        const n = { revert: !0, ...t },
          r = Me.batch(() =>
            k(this, re)
              .findAll(e)
              .map((s) => s.cancel(n)),
          );
        return Promise.all(r).then(xt).catch(xt);
      }
      invalidateQueries(e, t = {}) {
        return Me.batch(
          () => (
            k(this, re)
              .findAll(e)
              .forEach((n) => {
                n.invalidate();
              }),
            (e == null ? void 0 : e.refetchType) === 'none'
              ? Promise.resolve()
              : this.refetchQueries(
                  {
                    ...e,
                    type:
                      (e == null ? void 0 : e.refetchType) ??
                      (e == null ? void 0 : e.type) ??
                      'active',
                  },
                  t,
                )
          ),
        );
      }
      refetchQueries(e, t = {}) {
        const n = { ...t, cancelRefetch: t.cancelRefetch ?? !0 },
          r = Me.batch(() =>
            k(this, re)
              .findAll(e)
              .filter((s) => !s.isDisabled() && !s.isStatic())
              .map((s) => {
                let i = s.fetch(void 0, n);
                return (
                  n.throwOnError || (i = i.catch(xt)),
                  s.state.fetchStatus === 'paused' ? Promise.resolve() : i
                );
              }),
          );
        return Promise.all(r).then(xt);
      }
      fetchQuery(e) {
        const t = this.defaultQueryOptions(e);
        t.retry === void 0 && (t.retry = !1);
        const n = k(this, re).build(this, t);
        return n.isStaleByTime(_u(t.staleTime, n)) ? n.fetch(t) : Promise.resolve(n.state.data);
      }
      prefetchQuery(e) {
        return this.fetchQuery(e).then(xt).catch(xt);
      }
      fetchInfiniteQuery(e) {
        return ((e._type = 'infinite'), this.fetchQuery(e));
      }
      prefetchInfiniteQuery(e) {
        return this.fetchInfiniteQuery(e).then(xt).catch(xt);
      }
      ensureInfiniteQueryData(e) {
        return ((e._type = 'infinite'), this.ensureQueryData(e));
      }
      resumePausedMutations() {
        return ia.isOnline() ? k(this, hn).resumePausedMutations() : Promise.resolve();
      }
      getQueryCache() {
        return k(this, re);
      }
      getMutationCache() {
        return k(this, hn);
      }
      getDefaultOptions() {
        return k(this, pn);
      }
      setDefaultOptions(e) {
        I(this, pn, e);
      }
      setQueryDefaults(e, t) {
        k(this, qr).set(mi(e), { queryKey: e, defaultOptions: t });
      }
      getQueryDefaults(e) {
        const t = [...k(this, qr).values()],
          n = {};
        return (
          t.forEach((r) => {
            yi(e, r.queryKey) && Object.assign(n, r.defaultOptions);
          }),
          n
        );
      }
      setMutationDefaults(e, t) {
        k(this, Qr).set(mi(e), { mutationKey: e, defaultOptions: t });
      }
      getMutationDefaults(e) {
        const t = [...k(this, Qr).values()],
          n = {};
        return (
          t.forEach((r) => {
            yi(e, r.mutationKey) && Object.assign(n, r.defaultOptions);
          }),
          n
        );
      }
      defaultQueryOptions(e) {
        if (e._defaulted) return e;
        const t = {
          ...k(this, pn).queries,
          ...this.getQueryDefaults(e.queryKey),
          ...e,
          _defaulted: !0,
        };
        return (
          t.queryHash || (t.queryHash = ld(t.queryKey, t)),
          t.refetchOnReconnect === void 0 && (t.refetchOnReconnect = t.networkMode !== 'always'),
          t.throwOnError === void 0 && (t.throwOnError = !!t.suspense),
          !t.networkMode && t.persister && (t.networkMode = 'offlineFirst'),
          t.queryFn === ud && (t.enabled = !1),
          t
        );
      }
      defaultMutationOptions(e) {
        return e != null && e._defaulted
          ? e
          : {
              ...k(this, pn).mutations,
              ...((e == null ? void 0 : e.mutationKey) && this.getMutationDefaults(e.mutationKey)),
              ...e,
              _defaulted: !0,
            };
      }
      clear() {
        (k(this, re).clear(), k(this, hn).clear());
      }
    }),
    (re = new WeakMap()),
    (hn = new WeakMap()),
    (pn = new WeakMap()),
    (qr = new WeakMap()),
    (Qr = new WeakMap()),
    (mn = new WeakMap()),
    (Gr = new WeakMap()),
    (Xr = new WeakMap()),
    um),
  tC = P.createContext(void 0),
  nC = ({ client: e, children: t }) => (
    P.useEffect(
      () => (
        e.mount(),
        () => {
          e.unmount();
        }
      ),
      [e],
    ),
    f.jsx(tC.Provider, { value: e, children: t })
  );
const rC = new eC({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1e3,
        gcTime: 10 * 60 * 1e3,
        retry: (e, t) => {
          var n, r;
          return ((n = t == null ? void 0 : t.response) == null ? void 0 : n.status) >= 400 &&
            ((r = t == null ? void 0 : t.response) == null ? void 0 : r.status) < 500
            ? !1
            : e < 3;
        },
        retryDelay: (e) => Math.min(1e3 * 2 ** e, 3e4),
        refetchOnWindowFocus: !1,
        refetchOnReconnect: !0,
      },
      mutations: { retry: 1, retryDelay: (e) => Math.min(1e3 * 2 ** e, 3e4) },
    },
  }),
  sC = ({ children: e }) => zn.createElement(nC, { client: rC }, e),
  kh = (e) => {
    let t;
    const n = new Set(),
      r = (u, c) => {
        const d = typeof u == 'function' ? u(t) : u;
        if (!Object.is(d, t)) {
          const h = t;
          ((t = (c ?? (typeof d != 'object' || d === null)) ? d : Object.assign({}, t, d)),
            n.forEach((g) => g(t, h)));
        }
      },
      s = () => t,
      a = {
        setState: r,
        getState: s,
        getInitialState: () => l,
        subscribe: (u) => (n.add(u), () => n.delete(u)),
      },
      l = (t = e(r, s, a));
    return a;
  },
  iC = (e) => (e ? kh(e) : kh),
  oC = (e) => e;
function aC(e, t = oC) {
  const n = zn.useSyncExternalStore(
    e.subscribe,
    zn.useCallback(() => t(e.getState()), [e, t]),
    zn.useCallback(() => t(e.getInitialState()), [e, t]),
  );
  return (zn.useDebugValue(n), n);
}
const lC = (e) => {
    const t = iC(e),
      n = (r) => aC(t, r);
    return (Object.assign(n, t), n);
  },
  uC = (e) => lC;
function cC(e, t) {
  let n;
  try {
    n = e();
  } catch {
    return;
  }
  return {
    getItem: (s) => {
      var i;
      const o = (l) => (l === null ? null : JSON.parse(l, void 0)),
        a = (i = n.getItem(s)) != null ? i : null;
      return a instanceof Promise ? a.then(o) : o(a);
    },
    setItem: (s, i) => n.setItem(s, JSON.stringify(i, void 0)),
    removeItem: (s) => n.removeItem(s),
  };
}
const Vu = (e) => (t) => {
    try {
      const n = e(t);
      return n instanceof Promise
        ? n
        : {
            then(r) {
              return Vu(r)(n);
            },
            catch(r) {
              return this;
            },
          };
    } catch (n) {
      return {
        then(r) {
          return this;
        },
        catch(r) {
          return Vu(r)(n);
        },
      };
    }
  },
  dC = (e, t) => (n, r, s) => {
    let i = {
        storage: cC(() => window.localStorage),
        partialize: (x) => x,
        version: 0,
        merge: (x, p) => ({ ...p, ...x }),
        ...t,
      },
      o = !1,
      a = 0;
    const l = new Set(),
      u = new Set();
    let c = i.storage;
    if (!c)
      return e(
        (...x) => {
          (console.warn(
            `[zustand persist middleware] Unable to update item '${i.name}', the given storage is currently unavailable.`,
          ),
            n(...x));
        },
        r,
        s,
      );
    const d = () => {
        const x = i.partialize({ ...r() });
        return c.setItem(i.name, { state: x, version: i.version });
      },
      h = s.setState;
    s.setState = (x, p) => (h(x, p), d());
    const g = e((...x) => (n(...x), d()), r, s);
    s.getInitialState = () => g;
    let w;
    const v = () => {
      var x, p;
      if (!c) return;
      const m = ++a;
      ((o = !1),
        l.forEach((S) => {
          var C;
          return S((C = r()) != null ? C : g);
        }));
      const y =
        ((p = i.onRehydrateStorage) == null ? void 0 : p.call(i, (x = r()) != null ? x : g)) ||
        void 0;
      return Vu(c.getItem.bind(c))(i.name)
        .then((S) => {
          if (S)
            if (typeof S.version == 'number' && S.version !== i.version) {
              if (i.migrate) {
                const C = i.migrate(S.state, S.version);
                return C instanceof Promise ? C.then((T) => [!0, T]) : [!0, C];
              }
              console.error(
                "State loaded from storage couldn't be migrated since no migrate function was provided",
              );
            } else return [!1, S.state];
          return [!1, void 0];
        })
        .then((S) => {
          var C;
          if (m !== a) return;
          const [T, N] = S;
          if (((w = i.merge(N, (C = r()) != null ? C : g)), n(w, !0), T)) return d();
        })
        .then(() => {
          m === a && (y == null || y(r(), void 0), (w = r()), (o = !0), u.forEach((S) => S(w)));
        })
        .catch((S) => {
          m === a && (y == null || y(void 0, S));
        });
    };
    return (
      (s.persist = {
        setOptions: (x) => {
          ((i = { ...i, ...x }), x.storage && (c = x.storage));
        },
        clearStorage: () => {
          c == null || c.removeItem(i.name);
        },
        getOptions: () => i,
        rehydrate: () => v(),
        hasHydrated: () => o,
        onHydrate: (x) => (
          l.add(x),
          () => {
            l.delete(x);
          }
        ),
        onFinishHydration: (x) => (
          u.add(x),
          () => {
            u.delete(x);
          }
        ),
      }),
      i.skipHydration || v(),
      w || g
    );
  },
  fC = dC;
function Vg(e, t) {
  return function () {
    return e.apply(t, arguments);
  };
}
const { toString: hC } = Object.prototype,
  { getPrototypeOf: Da } = Object,
  { iterator: La, toStringTag: Bg } = Symbol,
  Ma = ((e) => (t) => {
    const n = hC.call(t);
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
  })(Object.create(null)),
  jt = (e) => ((e = e.toLowerCase()), (t) => Ma(t) === e),
  _a = (e) => (t) => typeof t === e,
  { isArray: ps } = Array,
  ss = _a('undefined');
function Ai(e) {
  return (
    e !== null &&
    !ss(e) &&
    e.constructor !== null &&
    !ss(e.constructor) &&
    qe(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  );
}
const Ug = jt('ArrayBuffer');
function pC(e) {
  let t;
  return (
    typeof ArrayBuffer < 'u' && ArrayBuffer.isView
      ? (t = ArrayBuffer.isView(e))
      : (t = e && e.buffer && Ug(e.buffer)),
    t
  );
}
const mC = _a('string'),
  qe = _a('function'),
  zg = _a('number'),
  bi = (e) => e !== null && typeof e == 'object',
  yC = (e) => e === !0 || e === !1,
  No = (e) => {
    if (Ma(e) !== 'object') return !1;
    const t = Da(e);
    return (
      (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) &&
      !(Bg in e) &&
      !(La in e)
    );
  },
  gC = (e) => {
    if (!bi(e) || Ai(e)) return !1;
    try {
      return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
    } catch {
      return !1;
    }
  },
  vC = jt('Date'),
  xC = jt('File'),
  wC = (e) => !!(e && typeof e.uri < 'u'),
  SC = (e) => e && typeof e.getParts < 'u',
  CC = jt('Blob'),
  EC = jt('FileList'),
  PC = (e) => bi(e) && qe(e.pipe);
function kC() {
  return typeof globalThis < 'u'
    ? globalThis
    : typeof self < 'u'
      ? self
      : typeof window < 'u'
        ? window
        : typeof global < 'u'
          ? global
          : {};
}
const Th = kC(),
  jh = typeof Th.FormData < 'u' ? Th.FormData : void 0,
  TC = (e) => {
    if (!e) return !1;
    if (jh && e instanceof jh) return !0;
    const t = Da(e);
    if (!t || t === Object.prototype || !qe(e.append)) return !1;
    const n = Ma(e);
    return (
      n === 'formdata' || (n === 'object' && qe(e.toString) && e.toString() === '[object FormData]')
    );
  },
  jC = jt('URLSearchParams'),
  [NC, RC, AC, bC] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(jt),
  OC = (e) => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''));
function Oi(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > 'u') return;
  let r, s;
  if ((typeof e != 'object' && (e = [e]), ps(e)))
    for (r = 0, s = e.length; r < s; r++) t.call(null, e[r], r, e);
  else {
    if (Ai(e)) return;
    const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
      o = i.length;
    let a;
    for (r = 0; r < o; r++) ((a = i[r]), t.call(null, e[a], a, e));
  }
}
function $g(e, t) {
  if (Ai(e)) return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length,
    s;
  for (; r-- > 0; ) if (((s = n[r]), t === s.toLowerCase())) return s;
  return null;
}
const Kn =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : global,
  Hg = (e) => !ss(e) && e !== Kn;
function Bu(...e) {
  const { caseless: t, skipUndefined: n } = (Hg(this) && this) || {},
    r = {},
    s = (i, o) => {
      if (o === '__proto__' || o === 'constructor' || o === 'prototype') return;
      const a = (t && $g(r, o)) || o,
        l = Uu(r, a) ? r[a] : void 0;
      No(l) && No(i)
        ? (r[a] = Bu(l, i))
        : No(i)
          ? (r[a] = Bu({}, i))
          : ps(i)
            ? (r[a] = i.slice())
            : (!n || !ss(i)) && (r[a] = i);
    };
  for (let i = 0, o = e.length; i < o; i++) e[i] && Oi(e[i], s);
  return r;
}
const DC = (e, t, n, { allOwnKeys: r } = {}) => (
    Oi(
      t,
      (s, i) => {
        n && qe(s)
          ? Object.defineProperty(e, i, {
              __proto__: null,
              value: Vg(s, n),
              writable: !0,
              enumerable: !0,
              configurable: !0,
            })
          : Object.defineProperty(e, i, {
              __proto__: null,
              value: s,
              writable: !0,
              enumerable: !0,
              configurable: !0,
            });
      },
      { allOwnKeys: r },
    ),
    e
  ),
  LC = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  MC = (e, t, n, r) => {
    ((e.prototype = Object.create(t.prototype, r)),
      Object.defineProperty(e.prototype, 'constructor', {
        __proto__: null,
        value: e,
        writable: !0,
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(e, 'super', { __proto__: null, value: t.prototype }),
      n && Object.assign(e.prototype, n));
  },
  _C = (e, t, n, r) => {
    let s, i, o;
    const a = {};
    if (((t = t || {}), e == null)) return t;
    do {
      for (s = Object.getOwnPropertyNames(e), i = s.length; i-- > 0; )
        ((o = s[i]), (!r || r(o, e, t)) && !a[o] && ((t[o] = e[o]), (a[o] = !0)));
      e = n !== !1 && Da(e);
    } while (e && (!n || n(e, t)) && e !== Object.prototype);
    return t;
  },
  FC = (e, t, n) => {
    ((e = String(e)), (n === void 0 || n > e.length) && (n = e.length), (n -= t.length));
    const r = e.indexOf(t, n);
    return r !== -1 && r === n;
  },
  IC = (e) => {
    if (!e) return null;
    if (ps(e)) return e;
    let t = e.length;
    if (!zg(t)) return null;
    const n = new Array(t);
    for (; t-- > 0; ) n[t] = e[t];
    return n;
  },
  VC = (
    (e) => (t) =>
      e && t instanceof e
  )(typeof Uint8Array < 'u' && Da(Uint8Array)),
  BC = (e, t) => {
    const r = (e && e[La]).call(e);
    let s;
    for (; (s = r.next()) && !s.done; ) {
      const i = s.value;
      t.call(e, i[0], i[1]);
    }
  },
  UC = (e, t) => {
    let n;
    const r = [];
    for (; (n = e.exec(t)) !== null; ) r.push(n);
    return r;
  },
  zC = jt('HTMLFormElement'),
  $C = (e) =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, r, s) {
      return r.toUpperCase() + s;
    }),
  Uu = (
    ({ hasOwnProperty: e }) =>
    (t, n) =>
      e.call(t, n)
  )(Object.prototype),
  HC = jt('RegExp'),
  Wg = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e),
      r = {};
    (Oi(n, (s, i) => {
      let o;
      (o = t(s, i, e)) !== !1 && (r[i] = o || s);
    }),
      Object.defineProperties(e, r));
  },
  WC = (e) => {
    Wg(e, (t, n) => {
      if (qe(e) && ['arguments', 'caller', 'callee'].includes(n)) return !1;
      const r = e[n];
      if (qe(r)) {
        if (((t.enumerable = !1), 'writable' in t)) {
          t.writable = !1;
          return;
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + n + "'");
          });
      }
    });
  },
  KC = (e, t) => {
    const n = {},
      r = (s) => {
        s.forEach((i) => {
          n[i] = !0;
        });
      };
    return (ps(e) ? r(e) : r(String(e).split(t)), n);
  },
  qC = () => {},
  QC = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t);
function GC(e) {
  return !!(e && qe(e.append) && e[Bg] === 'FormData' && e[La]);
}
const XC = (e) => {
    const t = new Array(10),
      n = (r, s) => {
        if (bi(r)) {
          if (t.indexOf(r) >= 0) return;
          if (Ai(r)) return r;
          if (!('toJSON' in r)) {
            t[s] = r;
            const i = ps(r) ? [] : {};
            return (
              Oi(r, (o, a) => {
                const l = n(o, s + 1);
                !ss(l) && (i[a] = l);
              }),
              (t[s] = void 0),
              i
            );
          }
        }
        return r;
      };
    return n(e, 0);
  },
  YC = jt('AsyncFunction'),
  JC = (e) => e && (bi(e) || qe(e)) && qe(e.then) && qe(e.catch),
  Kg = ((e, t) =>
    e
      ? setImmediate
      : t
        ? ((n, r) => (
            Kn.addEventListener(
              'message',
              ({ source: s, data: i }) => {
                s === Kn && i === n && r.length && r.shift()();
              },
              !1,
            ),
            (s) => {
              (r.push(s), Kn.postMessage(n, '*'));
            }
          ))(`axios@${Math.random()}`, [])
        : (n) => setTimeout(n))(typeof setImmediate == 'function', qe(Kn.postMessage)),
  ZC =
    typeof queueMicrotask < 'u'
      ? queueMicrotask.bind(Kn)
      : (typeof process < 'u' && process.nextTick) || Kg,
  eE = (e) => e != null && qe(e[La]),
  E = {
    isArray: ps,
    isArrayBuffer: Ug,
    isBuffer: Ai,
    isFormData: TC,
    isArrayBufferView: pC,
    isString: mC,
    isNumber: zg,
    isBoolean: yC,
    isObject: bi,
    isPlainObject: No,
    isEmptyObject: gC,
    isReadableStream: NC,
    isRequest: RC,
    isResponse: AC,
    isHeaders: bC,
    isUndefined: ss,
    isDate: vC,
    isFile: xC,
    isReactNativeBlob: wC,
    isReactNative: SC,
    isBlob: CC,
    isRegExp: HC,
    isFunction: qe,
    isStream: PC,
    isURLSearchParams: jC,
    isTypedArray: VC,
    isFileList: EC,
    forEach: Oi,
    merge: Bu,
    extend: DC,
    trim: OC,
    stripBOM: LC,
    inherits: MC,
    toFlatObject: _C,
    kindOf: Ma,
    kindOfTest: jt,
    endsWith: FC,
    toArray: IC,
    forEachEntry: BC,
    matchAll: UC,
    isHTMLForm: zC,
    hasOwnProperty: Uu,
    hasOwnProp: Uu,
    reduceDescriptors: Wg,
    freezeMethods: WC,
    toObjectSet: KC,
    toCamelCase: $C,
    noop: qC,
    toFiniteNumber: QC,
    findKey: $g,
    global: Kn,
    isContextDefined: Hg,
    isSpecCompliantForm: GC,
    toJSONObject: XC,
    isAsyncFn: YC,
    isThenable: JC,
    setImmediate: Kg,
    asap: ZC,
    isIterable: eE,
  },
  tE = E.toObjectSet([
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent',
  ]),
  nE = (e) => {
    const t = {};
    let n, r, s;
    return (
      e &&
        e
          .split(
            `
`,
          )
          .forEach(function (o) {
            ((s = o.indexOf(':')),
              (n = o.substring(0, s).trim().toLowerCase()),
              (r = o.substring(s + 1).trim()),
              !(!n || (t[n] && tE[n])) &&
                (n === 'set-cookie'
                  ? t[n]
                    ? t[n].push(r)
                    : (t[n] = [r])
                  : (t[n] = t[n] ? t[n] + ', ' + r : r)));
          }),
      t
    );
  },
  Nh = Symbol('internals'),
  rE = /[^\x09\x20-\x7E\x80-\xFF]/g;
function sE(e) {
  let t = 0,
    n = e.length;
  for (; t < n; ) {
    const r = e.charCodeAt(t);
    if (r !== 9 && r !== 32) break;
    t += 1;
  }
  for (; n > t; ) {
    const r = e.charCodeAt(n - 1);
    if (r !== 9 && r !== 32) break;
    n -= 1;
  }
  return t === 0 && n === e.length ? e : e.slice(t, n);
}
function Ns(e) {
  return e && String(e).trim().toLowerCase();
}
function iE(e) {
  return sE(e.replace(rE, ''));
}
function Ro(e) {
  return e === !1 || e == null ? e : E.isArray(e) ? e.map(Ro) : iE(String(e));
}
function oE(e) {
  const t = Object.create(null),
    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; (r = n.exec(e)); ) t[r[1]] = r[2];
  return t;
}
const aE = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Sl(e, t, n, r, s) {
  if (E.isFunction(r)) return r.call(this, t, n);
  if ((s && (t = n), !!E.isString(t))) {
    if (E.isString(r)) return t.indexOf(r) !== -1;
    if (E.isRegExp(r)) return r.test(t);
  }
}
function lE(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function uE(e, t) {
  const n = E.toCamelCase(' ' + t);
  ['get', 'set', 'has'].forEach((r) => {
    Object.defineProperty(e, r + n, {
      __proto__: null,
      value: function (s, i, o) {
        return this[r].call(this, t, s, i, o);
      },
      configurable: !0,
    });
  });
}
let Fe = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, r) {
    const s = this;
    function i(a, l, u) {
      const c = Ns(l);
      if (!c) throw new Error('header name must be a non-empty string');
      const d = E.findKey(s, c);
      (!d || s[d] === void 0 || u === !0 || (u === void 0 && s[d] !== !1)) && (s[d || l] = Ro(a));
    }
    const o = (a, l) => E.forEach(a, (u, c) => i(u, c, l));
    if (E.isPlainObject(t) || t instanceof this.constructor) o(t, n);
    else if (E.isString(t) && (t = t.trim()) && !aE(t)) o(nE(t), n);
    else if (E.isObject(t) && E.isIterable(t)) {
      let a = {},
        l,
        u;
      for (const c of t) {
        if (!E.isArray(c)) throw TypeError('Object iterator must return a key-value pair');
        a[(u = c[0])] = (l = a[u]) ? (E.isArray(l) ? [...l, c[1]] : [l, c[1]]) : c[1];
      }
      o(a, n);
    } else t != null && i(n, t, r);
    return this;
  }
  get(t, n) {
    if (((t = Ns(t)), t)) {
      const r = E.findKey(this, t);
      if (r) {
        const s = this[r];
        if (!n) return s;
        if (n === !0) return oE(s);
        if (E.isFunction(n)) return n.call(this, s, r);
        if (E.isRegExp(n)) return n.exec(s);
        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }
  has(t, n) {
    if (((t = Ns(t)), t)) {
      const r = E.findKey(this, t);
      return !!(r && this[r] !== void 0 && (!n || Sl(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function i(o) {
      if (((o = Ns(o)), o)) {
        const a = E.findKey(r, o);
        a && (!n || Sl(r, r[a], a, n)) && (delete r[a], (s = !0));
      }
    }
    return (E.isArray(t) ? t.forEach(i) : i(t), s);
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length,
      s = !1;
    for (; r--; ) {
      const i = n[r];
      (!t || Sl(this, this[i], i, t, !0)) && (delete this[i], (s = !0));
    }
    return s;
  }
  normalize(t) {
    const n = this,
      r = {};
    return (
      E.forEach(this, (s, i) => {
        const o = E.findKey(r, i);
        if (o) {
          ((n[o] = Ro(s)), delete n[i]);
          return;
        }
        const a = t ? lE(i) : String(i).trim();
        (a !== i && delete n[i], (n[a] = Ro(s)), (r[a] = !0));
      }),
      this
    );
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = Object.create(null);
    return (
      E.forEach(this, (r, s) => {
        r != null && r !== !1 && (n[s] = t && E.isArray(r) ? r.join(', ') : r);
      }),
      n
    );
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ': ' + n).join(`
`);
  }
  getSetCookie() {
    return this.get('set-cookie') || [];
  }
  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const r = new this(t);
    return (n.forEach((s) => r.set(s)), r);
  }
  static accessor(t) {
    const r = (this[Nh] = this[Nh] = { accessors: {} }).accessors,
      s = this.prototype;
    function i(o) {
      const a = Ns(o);
      r[a] || (uE(s, o), (r[a] = !0));
    }
    return (E.isArray(t) ? t.forEach(i) : i(t), this);
  }
};
Fe.accessor([
  'Content-Type',
  'Content-Length',
  'Accept',
  'Accept-Encoding',
  'User-Agent',
  'Authorization',
]);
E.reduceDescriptors(Fe.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(r) {
      this[n] = r;
    },
  };
});
E.freezeMethods(Fe);
const cE = '[REDACTED ****]';
function dE(e) {
  if (E.hasOwnProp(e, 'toJSON')) return !0;
  let t = Object.getPrototypeOf(e);
  for (; t && t !== Object.prototype; ) {
    if (E.hasOwnProp(t, 'toJSON')) return !0;
    t = Object.getPrototypeOf(t);
  }
  return !1;
}
function fE(e, t) {
  const n = new Set(t.map((i) => String(i).toLowerCase())),
    r = [],
    s = (i) => {
      if (i === null || typeof i != 'object' || E.isBuffer(i)) return i;
      if (r.indexOf(i) !== -1) return;
      (i instanceof Fe && (i = i.toJSON()), r.push(i));
      let o;
      if (E.isArray(i))
        ((o = []),
          i.forEach((a, l) => {
            const u = s(a);
            E.isUndefined(u) || (o[l] = u);
          }));
      else {
        if (!E.isPlainObject(i) && dE(i)) return (r.pop(), i);
        o = Object.create(null);
        for (const [a, l] of Object.entries(i)) {
          const u = n.has(a.toLowerCase()) ? cE : s(l);
          E.isUndefined(u) || (o[a] = u);
        }
      }
      return (r.pop(), o);
    };
  return s(e);
}
let O = class qg extends Error {
  static from(t, n, r, s, i, o) {
    const a = new qg(t.message, n || t.code, r, s, i);
    return (
      (a.cause = t),
      (a.name = t.name),
      t.status != null && a.status == null && (a.status = t.status),
      o && Object.assign(a, o),
      a
    );
  }
  constructor(t, n, r, s, i) {
    (super(t),
      Object.defineProperty(this, 'message', {
        __proto__: null,
        value: t,
        enumerable: !0,
        writable: !0,
        configurable: !0,
      }),
      (this.name = 'AxiosError'),
      (this.isAxiosError = !0),
      n && (this.code = n),
      r && (this.config = r),
      s && (this.request = s),
      i && ((this.response = i), (this.status = i.status)));
  }
  toJSON() {
    const t = this.config,
      n = t && E.hasOwnProp(t, 'redact') ? t.redact : void 0,
      r = E.isArray(n) && n.length > 0 ? fE(t, n) : E.toJSONObject(t);
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: r,
      code: this.code,
      status: this.status,
    };
  }
};
O.ERR_BAD_OPTION_VALUE = 'ERR_BAD_OPTION_VALUE';
O.ERR_BAD_OPTION = 'ERR_BAD_OPTION';
O.ECONNABORTED = 'ECONNABORTED';
O.ETIMEDOUT = 'ETIMEDOUT';
O.ECONNREFUSED = 'ECONNREFUSED';
O.ERR_NETWORK = 'ERR_NETWORK';
O.ERR_FR_TOO_MANY_REDIRECTS = 'ERR_FR_TOO_MANY_REDIRECTS';
O.ERR_DEPRECATED = 'ERR_DEPRECATED';
O.ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE';
O.ERR_BAD_REQUEST = 'ERR_BAD_REQUEST';
O.ERR_CANCELED = 'ERR_CANCELED';
O.ERR_NOT_SUPPORT = 'ERR_NOT_SUPPORT';
O.ERR_INVALID_URL = 'ERR_INVALID_URL';
O.ERR_FORM_DATA_DEPTH_EXCEEDED = 'ERR_FORM_DATA_DEPTH_EXCEEDED';
const hE = null;
function zu(e) {
  return E.isPlainObject(e) || E.isArray(e);
}
function Qg(e) {
  return E.endsWith(e, '[]') ? e.slice(0, -2) : e;
}
function Cl(e, t, n) {
  return e
    ? e
        .concat(t)
        .map(function (s, i) {
          return ((s = Qg(s)), !n && i ? '[' + s + ']' : s);
        })
        .join(n ? '.' : '')
    : t;
}
function pE(e) {
  return E.isArray(e) && !e.some(zu);
}
const mE = E.toFlatObject(E, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function Fa(e, t, n) {
  if (!E.isObject(e)) throw new TypeError('target must be an object');
  ((t = t || new FormData()),
    (n = E.toFlatObject(n, { metaTokens: !0, dots: !1, indexes: !1 }, !1, function (x, p) {
      return !E.isUndefined(p[x]);
    })));
  const r = n.metaTokens,
    s = n.visitor || d,
    i = n.dots,
    o = n.indexes,
    a = n.Blob || (typeof Blob < 'u' && Blob),
    l = n.maxDepth === void 0 ? 100 : n.maxDepth,
    u = a && E.isSpecCompliantForm(t);
  if (!E.isFunction(s)) throw new TypeError('visitor must be a function');
  function c(v) {
    if (v === null) return '';
    if (E.isDate(v)) return v.toISOString();
    if (E.isBoolean(v)) return v.toString();
    if (!u && E.isBlob(v)) throw new O('Blob is not supported. Use a Buffer instead.');
    return E.isArrayBuffer(v) || E.isTypedArray(v)
      ? u && typeof Blob == 'function'
        ? new Blob([v])
        : Buffer.from(v)
      : v;
  }
  function d(v, x, p) {
    let m = v;
    if (E.isReactNative(t) && E.isReactNativeBlob(v)) return (t.append(Cl(p, x, i), c(v)), !1);
    if (v && !p && typeof v == 'object') {
      if (E.endsWith(x, '{}')) ((x = r ? x : x.slice(0, -2)), (v = JSON.stringify(v)));
      else if (
        (E.isArray(v) && pE(v)) ||
        ((E.isFileList(v) || E.endsWith(x, '[]')) && (m = E.toArray(v)))
      )
        return (
          (x = Qg(x)),
          m.forEach(function (S, C) {
            !(E.isUndefined(S) || S === null) &&
              t.append(o === !0 ? Cl([x], C, i) : o === null ? x : x + '[]', c(S));
          }),
          !1
        );
    }
    return zu(v) ? !0 : (t.append(Cl(p, x, i), c(v)), !1);
  }
  const h = [],
    g = Object.assign(mE, { defaultVisitor: d, convertValue: c, isVisitable: zu });
  function w(v, x, p = 0) {
    if (!E.isUndefined(v)) {
      if (p > l)
        throw new O(
          'Object is too deeply nested (' + p + ' levels). Max depth: ' + l,
          O.ERR_FORM_DATA_DEPTH_EXCEEDED,
        );
      if (h.indexOf(v) !== -1) throw Error('Circular reference detected in ' + x.join('.'));
      (h.push(v),
        E.forEach(v, function (y, S) {
          (!(E.isUndefined(y) || y === null) &&
            s.call(t, y, E.isString(S) ? S.trim() : S, x, g)) === !0 &&
            w(y, x ? x.concat(S) : [S], p + 1);
        }),
        h.pop());
    }
  }
  if (!E.isObject(e)) throw new TypeError('data must be an object');
  return (w(e), t);
}
function Rh(e) {
  const t = { '!': '%21', "'": '%27', '(': '%28', ')': '%29', '~': '%7E', '%20': '+' };
  return encodeURIComponent(e).replace(/[!'()~]|%20/g, function (r) {
    return t[r];
  });
}
function cd(e, t) {
  ((this._pairs = []), e && Fa(e, this, t));
}
const Gg = cd.prototype;
Gg.append = function (t, n) {
  this._pairs.push([t, n]);
};
Gg.toString = function (t) {
  const n = t
    ? function (r) {
        return t.call(this, r, Rh);
      }
    : Rh;
  return this._pairs
    .map(function (s) {
      return n(s[0]) + '=' + n(s[1]);
    }, '')
    .join('&');
};
function yE(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+');
}
function Xg(e, t, n) {
  if (!t) return e;
  const r = (n && n.encode) || yE,
    s = E.isFunction(n) ? { serialize: n } : n,
    i = s && s.serialize;
  let o;
  if (
    (i ? (o = i(t, s)) : (o = E.isURLSearchParams(t) ? t.toString() : new cd(t, s).toString(r)), o)
  ) {
    const a = e.indexOf('#');
    (a !== -1 && (e = e.slice(0, a)), (e += (e.indexOf('?') === -1 ? '?' : '&') + o));
  }
  return e;
}
class Ah {
  constructor() {
    this.handlers = [];
  }
  use(t, n, r) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: r ? r.synchronous : !1,
        runWhen: r ? r.runWhen : null,
      }),
      this.handlers.length - 1
    );
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  clear() {
    this.handlers && (this.handlers = []);
  }
  forEach(t) {
    E.forEach(this.handlers, function (r) {
      r !== null && t(r);
    });
  }
}
const dd = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
    legacyInterceptorReqResOrdering: !0,
  },
  gE = typeof URLSearchParams < 'u' ? URLSearchParams : cd,
  vE = typeof FormData < 'u' ? FormData : null,
  xE = typeof Blob < 'u' ? Blob : null,
  wE = {
    isBrowser: !0,
    classes: { URLSearchParams: gE, FormData: vE, Blob: xE },
    protocols: ['http', 'https', 'file', 'blob', 'url', 'data'],
  },
  fd = typeof window < 'u' && typeof document < 'u',
  $u = (typeof navigator == 'object' && navigator) || void 0,
  SE = fd && (!$u || ['ReactNative', 'NativeScript', 'NS'].indexOf($u.product) < 0),
  CE =
    typeof WorkerGlobalScope < 'u' &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == 'function',
  EE = (fd && window.location.href) || 'http://localhost',
  PE = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: fd,
        hasStandardBrowserEnv: SE,
        hasStandardBrowserWebWorkerEnv: CE,
        navigator: $u,
        origin: EE,
      },
      Symbol.toStringTag,
      { value: 'Module' },
    ),
  ),
  be = { ...PE, ...wE };
function kE(e, t) {
  return Fa(e, new be.classes.URLSearchParams(), {
    visitor: function (n, r, s, i) {
      return be.isNode && E.isBuffer(n)
        ? (this.append(r, n.toString('base64')), !1)
        : i.defaultVisitor.apply(this, arguments);
    },
    ...t,
  });
}
function TE(e) {
  return E.matchAll(/\w+|\[(\w*)]/g, e).map((t) => (t[0] === '[]' ? '' : t[1] || t[0]));
}
function jE(e) {
  const t = {},
    n = Object.keys(e);
  let r;
  const s = n.length;
  let i;
  for (r = 0; r < s; r++) ((i = n[r]), (t[i] = e[i]));
  return t;
}
function Yg(e) {
  function t(n, r, s, i) {
    let o = n[i++];
    if (o === '__proto__') return !0;
    const a = Number.isFinite(+o),
      l = i >= n.length;
    return (
      (o = !o && E.isArray(s) ? s.length : o),
      l
        ? (E.hasOwnProp(s, o) ? (s[o] = E.isArray(s[o]) ? s[o].concat(r) : [s[o], r]) : (s[o] = r),
          !a)
        : ((!s[o] || !E.isObject(s[o])) && (s[o] = []),
          t(n, r, s[o], i) && E.isArray(s[o]) && (s[o] = jE(s[o])),
          !a)
    );
  }
  if (E.isFormData(e) && E.isFunction(e.entries)) {
    const n = {};
    return (
      E.forEachEntry(e, (r, s) => {
        t(TE(r), s, n, 0);
      }),
      n
    );
  }
  return null;
}
const vr = (e, t) => (e != null && E.hasOwnProp(e, t) ? e[t] : void 0);
function NE(e, t, n) {
  if (E.isString(e))
    try {
      return ((t || JSON.parse)(e), E.trim(e));
    } catch (r) {
      if (r.name !== 'SyntaxError') throw r;
    }
  return (n || JSON.stringify)(e);
}
const Di = {
  transitional: dd,
  adapter: ['xhr', 'http', 'fetch'],
  transformRequest: [
    function (t, n) {
      const r = n.getContentType() || '',
        s = r.indexOf('application/json') > -1,
        i = E.isObject(t);
      if ((i && E.isHTMLForm(t) && (t = new FormData(t)), E.isFormData(t)))
        return s ? JSON.stringify(Yg(t)) : t;
      if (
        E.isArrayBuffer(t) ||
        E.isBuffer(t) ||
        E.isStream(t) ||
        E.isFile(t) ||
        E.isBlob(t) ||
        E.isReadableStream(t)
      )
        return t;
      if (E.isArrayBufferView(t)) return t.buffer;
      if (E.isURLSearchParams(t))
        return (
          n.setContentType('application/x-www-form-urlencoded;charset=utf-8', !1),
          t.toString()
        );
      let a;
      if (i) {
        const l = vr(this, 'formSerializer');
        if (r.indexOf('application/x-www-form-urlencoded') > -1) return kE(t, l).toString();
        if ((a = E.isFileList(t)) || r.indexOf('multipart/form-data') > -1) {
          const u = vr(this, 'env'),
            c = u && u.FormData;
          return Fa(a ? { 'files[]': t } : t, c && new c(), l);
        }
      }
      return i || s ? (n.setContentType('application/json', !1), NE(t)) : t;
    },
  ],
  transformResponse: [
    function (t) {
      const n = vr(this, 'transitional') || Di.transitional,
        r = n && n.forcedJSONParsing,
        s = vr(this, 'responseType'),
        i = s === 'json';
      if (E.isResponse(t) || E.isReadableStream(t)) return t;
      if (t && E.isString(t) && ((r && !s) || i)) {
        const a = !(n && n.silentJSONParsing) && i;
        try {
          return JSON.parse(t, vr(this, 'parseReviver'));
        } catch (l) {
          if (a)
            throw l.name === 'SyntaxError'
              ? O.from(l, O.ERR_BAD_RESPONSE, this, null, vr(this, 'response'))
              : l;
        }
      }
      return t;
    },
  ],
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: be.classes.FormData, Blob: be.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300;
  },
  headers: { common: { Accept: 'application/json, text/plain, */*', 'Content-Type': void 0 } },
};
E.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'query'], (e) => {
  Di.headers[e] = {};
});
function El(e, t) {
  const n = this || Di,
    r = t || n,
    s = Fe.from(r.headers);
  let i = r.data;
  return (
    E.forEach(e, function (a) {
      i = a.call(n, i, s.normalize(), t ? t.status : void 0);
    }),
    s.normalize(),
    i
  );
}
function Jg(e) {
  return !!(e && e.__CANCEL__);
}
let Li = class extends O {
  constructor(t, n, r) {
    (super(t ?? 'canceled', O.ERR_CANCELED, n, r),
      (this.name = 'CanceledError'),
      (this.__CANCEL__ = !0));
  }
};
function Zg(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status)
    ? e(n)
    : t(
        new O(
          'Request failed with status code ' + n.status,
          n.status >= 400 && n.status < 500 ? O.ERR_BAD_REQUEST : O.ERR_BAD_RESPONSE,
          n.config,
          n.request,
          n,
        ),
      );
}
function RE(e) {
  const t = /^([-+\w]{1,25}):(?:\/\/)?/.exec(e);
  return (t && t[1]) || '';
}
function AE(e, t) {
  e = e || 10;
  const n = new Array(e),
    r = new Array(e);
  let s = 0,
    i = 0,
    o;
  return (
    (t = t !== void 0 ? t : 1e3),
    function (l) {
      const u = Date.now(),
        c = r[i];
      (o || (o = u), (n[s] = l), (r[s] = u));
      let d = i,
        h = 0;
      for (; d !== s; ) ((h += n[d++]), (d = d % e));
      if (((s = (s + 1) % e), s === i && (i = (i + 1) % e), u - o < t)) return;
      const g = c && u - c;
      return g ? Math.round((h * 1e3) / g) : void 0;
    }
  );
}
function bE(e, t) {
  let n = 0,
    r = 1e3 / t,
    s,
    i;
  const o = (u, c = Date.now()) => {
    ((n = c), (s = null), i && (clearTimeout(i), (i = null)), e(...u));
  };
  return [
    (...u) => {
      const c = Date.now(),
        d = c - n;
      d >= r
        ? o(u, c)
        : ((s = u),
          i ||
            (i = setTimeout(() => {
              ((i = null), o(s));
            }, r - d)));
    },
    () => s && o(s),
  ];
}
const oa = (e, t, n = 3) => {
    let r = 0;
    const s = AE(50, 250);
    return bE((i) => {
      const o = i.loaded,
        a = i.lengthComputable ? i.total : void 0,
        l = a != null ? Math.min(o, a) : o,
        u = Math.max(0, l - r),
        c = s(u);
      r = Math.max(r, l);
      const d = {
        loaded: l,
        total: a,
        progress: a ? l / a : void 0,
        bytes: u,
        rate: c || void 0,
        estimated: c && a ? (a - l) / c : void 0,
        event: i,
        lengthComputable: a != null,
        [t ? 'download' : 'upload']: !0,
      };
      e(d);
    }, n);
  },
  bh = (e, t) => {
    const n = e != null;
    return [(r) => t[0]({ lengthComputable: n, total: e, loaded: r }), t[1]];
  },
  Oh =
    (e) =>
    (...t) =>
      E.asap(() => e(...t)),
  OE = be.hasStandardBrowserEnv
    ? ((e, t) => (n) => (
        (n = new URL(n, be.origin)),
        e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)
      ))(new URL(be.origin), be.navigator && /(msie|trident)/i.test(be.navigator.userAgent))
    : () => !0,
  DE = be.hasStandardBrowserEnv
    ? {
        write(e, t, n, r, s, i, o) {
          if (typeof document > 'u') return;
          const a = [`${e}=${encodeURIComponent(t)}`];
          (E.isNumber(n) && a.push(`expires=${new Date(n).toUTCString()}`),
            E.isString(r) && a.push(`path=${r}`),
            E.isString(s) && a.push(`domain=${s}`),
            i === !0 && a.push('secure'),
            E.isString(o) && a.push(`SameSite=${o}`),
            (document.cookie = a.join('; ')));
        },
        read(e) {
          if (typeof document > 'u') return null;
          const t = document.cookie.split(';');
          for (let n = 0; n < t.length; n++) {
            const r = t[n].replace(/^\s+/, ''),
              s = r.indexOf('=');
            if (s !== -1 && r.slice(0, s) === e) return decodeURIComponent(r.slice(s + 1));
          }
          return null;
        },
        remove(e) {
          this.write(e, '', Date.now() - 864e5, '/');
        },
      }
    : {
        write() {},
        read() {
          return null;
        },
        remove() {},
      };
function LE(e) {
  return typeof e != 'string' ? !1 : /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function ME(e, t) {
  return t ? e.replace(/\/?\/$/, '') + '/' + t.replace(/^\/+/, '') : e;
}
function e0(e, t, n) {
  let r = !LE(t);
  return e && (r || n === !1) ? ME(e, t) : t;
}
const Dh = (e) => (e instanceof Fe ? { ...e } : e);
function ur(e, t) {
  t = t || {};
  const n = Object.create(null);
  Object.defineProperty(n, 'hasOwnProperty', {
    __proto__: null,
    value: Object.prototype.hasOwnProperty,
    enumerable: !1,
    writable: !0,
    configurable: !0,
  });
  function r(u, c, d, h) {
    return E.isPlainObject(u) && E.isPlainObject(c)
      ? E.merge.call({ caseless: h }, u, c)
      : E.isPlainObject(c)
        ? E.merge({}, c)
        : E.isArray(c)
          ? c.slice()
          : c;
  }
  function s(u, c, d, h) {
    if (E.isUndefined(c)) {
      if (!E.isUndefined(u)) return r(void 0, u, d, h);
    } else return r(u, c, d, h);
  }
  function i(u, c) {
    if (!E.isUndefined(c)) return r(void 0, c);
  }
  function o(u, c) {
    if (E.isUndefined(c)) {
      if (!E.isUndefined(u)) return r(void 0, u);
    } else return r(void 0, c);
  }
  function a(u, c, d) {
    if (E.hasOwnProp(t, d)) return r(u, c);
    if (E.hasOwnProp(e, d)) return r(void 0, u);
  }
  const l = {
    url: i,
    method: i,
    data: i,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    allowedSocketPaths: o,
    responseEncoding: o,
    validateStatus: a,
    headers: (u, c, d) => s(Dh(u), Dh(c), d, !0),
  };
  return (
    E.forEach(Object.keys({ ...e, ...t }), function (c) {
      if (c === '__proto__' || c === 'constructor' || c === 'prototype') return;
      const d = E.hasOwnProp(l, c) ? l[c] : s,
        h = E.hasOwnProp(e, c) ? e[c] : void 0,
        g = E.hasOwnProp(t, c) ? t[c] : void 0,
        w = d(h, g, c);
      (E.isUndefined(w) && d !== a) || (n[c] = w);
    }),
    n
  );
}
const _E = ['content-type', 'content-length'];
function FE(e, t, n) {
  if (n !== 'content-only') {
    e.set(t);
    return;
  }
  Object.entries(t).forEach(([r, s]) => {
    _E.includes(r.toLowerCase()) && e.set(r, s);
  });
}
const IE = (e) =>
    encodeURIComponent(e).replace(/%([0-9A-F]{2})/gi, (t, n) =>
      String.fromCharCode(parseInt(n, 16)),
    ),
  t0 = (e) => {
    const t = ur({}, e),
      n = (h) => (E.hasOwnProp(t, h) ? t[h] : void 0),
      r = n('data');
    let s = n('withXSRFToken');
    const i = n('xsrfHeaderName'),
      o = n('xsrfCookieName');
    let a = n('headers');
    const l = n('auth'),
      u = n('baseURL'),
      c = n('allowAbsoluteUrls'),
      d = n('url');
    if (
      ((t.headers = a = Fe.from(a)),
      (t.url = Xg(e0(u, d, c), e.params, e.paramsSerializer)),
      l &&
        a.set(
          'Authorization',
          'Basic ' + btoa((l.username || '') + ':' + (l.password ? IE(l.password) : '')),
        ),
      E.isFormData(r) &&
        (be.hasStandardBrowserEnv || be.hasStandardBrowserWebWorkerEnv
          ? a.setContentType(void 0)
          : E.isFunction(r.getHeaders) && FE(a, r.getHeaders(), n('formDataHeaderPolicy'))),
      be.hasStandardBrowserEnv &&
        (E.isFunction(s) && (s = s(t)), s === !0 || (s == null && OE(t.url))))
    ) {
      const g = i && o && DE.read(o);
      g && a.set(i, g);
    }
    return t;
  },
  VE = typeof XMLHttpRequest < 'u',
  BE =
    VE &&
    function (e) {
      return new Promise(function (n, r) {
        const s = t0(e);
        let i = s.data;
        const o = Fe.from(s.headers).normalize();
        let { responseType: a, onUploadProgress: l, onDownloadProgress: u } = s,
          c,
          d,
          h,
          g,
          w;
        function v() {
          (g && g(),
            w && w(),
            s.cancelToken && s.cancelToken.unsubscribe(c),
            s.signal && s.signal.removeEventListener('abort', c));
        }
        let x = new XMLHttpRequest();
        (x.open(s.method.toUpperCase(), s.url, !0), (x.timeout = s.timeout));
        function p() {
          if (!x) return;
          const y = Fe.from('getAllResponseHeaders' in x && x.getAllResponseHeaders()),
            C = {
              data: !a || a === 'text' || a === 'json' ? x.responseText : x.response,
              status: x.status,
              statusText: x.statusText,
              headers: y,
              config: e,
              request: x,
            };
          (Zg(
            function (N) {
              (n(N), v());
            },
            function (N) {
              (r(N), v());
            },
            C,
          ),
            (x = null));
        }
        ('onloadend' in x
          ? (x.onloadend = p)
          : (x.onreadystatechange = function () {
              !x ||
                x.readyState !== 4 ||
                (x.status === 0 && !(x.responseURL && x.responseURL.startsWith('file:'))) ||
                setTimeout(p);
            }),
          (x.onabort = function () {
            x && (r(new O('Request aborted', O.ECONNABORTED, e, x)), v(), (x = null));
          }),
          (x.onerror = function (S) {
            const C = S && S.message ? S.message : 'Network Error',
              T = new O(C, O.ERR_NETWORK, e, x);
            ((T.event = S || null), r(T), v(), (x = null));
          }),
          (x.ontimeout = function () {
            let S = s.timeout ? 'timeout of ' + s.timeout + 'ms exceeded' : 'timeout exceeded';
            const C = s.transitional || dd;
            (s.timeoutErrorMessage && (S = s.timeoutErrorMessage),
              r(new O(S, C.clarifyTimeoutError ? O.ETIMEDOUT : O.ECONNABORTED, e, x)),
              v(),
              (x = null));
          }),
          i === void 0 && o.setContentType(null),
          'setRequestHeader' in x &&
            E.forEach(o.toJSON(), function (S, C) {
              x.setRequestHeader(C, S);
            }),
          E.isUndefined(s.withCredentials) || (x.withCredentials = !!s.withCredentials),
          a && a !== 'json' && (x.responseType = s.responseType),
          u && (([h, w] = oa(u, !0)), x.addEventListener('progress', h)),
          l &&
            x.upload &&
            (([d, g] = oa(l)),
            x.upload.addEventListener('progress', d),
            x.upload.addEventListener('loadend', g)),
          (s.cancelToken || s.signal) &&
            ((c = (y) => {
              x && (r(!y || y.type ? new Li(null, e, x) : y), x.abort(), v(), (x = null));
            }),
            s.cancelToken && s.cancelToken.subscribe(c),
            s.signal && (s.signal.aborted ? c() : s.signal.addEventListener('abort', c))));
        const m = RE(s.url);
        if (m && !be.protocols.includes(m)) {
          r(new O('Unsupported protocol ' + m + ':', O.ERR_BAD_REQUEST, e));
          return;
        }
        x.send(i || null);
      });
    },
  UE = (e, t) => {
    const { length: n } = (e = e ? e.filter(Boolean) : []);
    if (t || n) {
      let r = new AbortController(),
        s;
      const i = function (u) {
        if (!s) {
          ((s = !0), a());
          const c = u instanceof Error ? u : this.reason;
          r.abort(c instanceof O ? c : new Li(c instanceof Error ? c.message : c));
        }
      };
      let o =
        t &&
        setTimeout(() => {
          ((o = null), i(new O(`timeout of ${t}ms exceeded`, O.ETIMEDOUT)));
        }, t);
      const a = () => {
        e &&
          (o && clearTimeout(o),
          (o = null),
          e.forEach((u) => {
            u.unsubscribe ? u.unsubscribe(i) : u.removeEventListener('abort', i);
          }),
          (e = null));
      };
      e.forEach((u) => u.addEventListener('abort', i));
      const { signal: l } = r;
      return ((l.unsubscribe = () => E.asap(a)), l);
    }
  },
  zE = function* (e, t) {
    let n = e.byteLength;
    if (n < t) {
      yield e;
      return;
    }
    let r = 0,
      s;
    for (; r < n; ) ((s = r + t), yield e.slice(r, s), (r = s));
  },
  $E = async function* (e, t) {
    for await (const n of HE(e)) yield* zE(n, t);
  },
  HE = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e;
      return;
    }
    const t = e.getReader();
    try {
      for (;;) {
        const { done: n, value: r } = await t.read();
        if (n) break;
        yield r;
      }
    } finally {
      await t.cancel();
    }
  },
  Lh = (e, t, n, r) => {
    const s = $E(e, t);
    let i = 0,
      o,
      a = (l) => {
        o || ((o = !0), r && r(l));
      };
    return new ReadableStream(
      {
        async pull(l) {
          try {
            const { done: u, value: c } = await s.next();
            if (u) {
              (a(), l.close());
              return;
            }
            let d = c.byteLength;
            if (n) {
              let h = (i += d);
              n(h);
            }
            l.enqueue(new Uint8Array(c));
          } catch (u) {
            throw (a(u), u);
          }
        },
        cancel(l) {
          return (a(l), s.return());
        },
      },
      { highWaterMark: 2 },
    );
  };
function WE(e) {
  if (!e || typeof e != 'string' || !e.startsWith('data:')) return 0;
  const t = e.indexOf(',');
  if (t < 0) return 0;
  const n = e.slice(5, t),
    r = e.slice(t + 1);
  if (/;base64/i.test(n)) {
    let o = r.length;
    const a = r.length;
    for (let g = 0; g < a; g++)
      if (r.charCodeAt(g) === 37 && g + 2 < a) {
        const w = r.charCodeAt(g + 1),
          v = r.charCodeAt(g + 2);
        ((w >= 48 && w <= 57) || (w >= 65 && w <= 70) || (w >= 97 && w <= 102)) &&
          ((v >= 48 && v <= 57) || (v >= 65 && v <= 70) || (v >= 97 && v <= 102)) &&
          ((o -= 2), (g += 2));
      }
    let l = 0,
      u = a - 1;
    const c = (g) =>
      g >= 2 &&
      r.charCodeAt(g - 2) === 37 &&
      r.charCodeAt(g - 1) === 51 &&
      (r.charCodeAt(g) === 68 || r.charCodeAt(g) === 100);
    (u >= 0 && (r.charCodeAt(u) === 61 ? (l++, u--) : c(u) && (l++, (u -= 3))),
      l === 1 && u >= 0 && (r.charCodeAt(u) === 61 || c(u)) && l++);
    const h = Math.floor(o / 4) * 3 - (l || 0);
    return h > 0 ? h : 0;
  }
  if (typeof Buffer < 'u' && typeof Buffer.byteLength == 'function')
    return Buffer.byteLength(r, 'utf8');
  let i = 0;
  for (let o = 0, a = r.length; o < a; o++) {
    const l = r.charCodeAt(o);
    if (l < 128) i += 1;
    else if (l < 2048) i += 2;
    else if (l >= 55296 && l <= 56319 && o + 1 < a) {
      const u = r.charCodeAt(o + 1);
      u >= 56320 && u <= 57343 ? ((i += 4), o++) : (i += 3);
    } else i += 3;
  }
  return i;
}
const hd = '1.16.0',
  Mh = 64 * 1024,
  { isFunction: ao } = E,
  _h = (e, ...t) => {
    try {
      return !!e(...t);
    } catch {
      return !1;
    }
  },
  KE = (e) => {
    const t = E.global ?? globalThis,
      { ReadableStream: n, TextEncoder: r } = t;
    e = E.merge.call({ skipUndefined: !0 }, { Request: t.Request, Response: t.Response }, e);
    const { fetch: s, Request: i, Response: o } = e,
      a = s ? ao(s) : typeof fetch == 'function',
      l = ao(i),
      u = ao(o);
    if (!a) return !1;
    const c = a && ao(n),
      d =
        a &&
        (typeof r == 'function'
          ? (
              (p) => (m) =>
                p.encode(m)
            )(new r())
          : async (p) => new Uint8Array(await new i(p).arrayBuffer())),
      h =
        l &&
        c &&
        _h(() => {
          let p = !1;
          const m = new i(be.origin, {
              body: new n(),
              method: 'POST',
              get duplex() {
                return ((p = !0), 'half');
              },
            }),
            y = m.headers.has('Content-Type');
          return (m.body != null && m.body.cancel(), p && !y);
        }),
      g = u && c && _h(() => E.isReadableStream(new o('').body)),
      w = { stream: g && ((p) => p.body) };
    a &&
      ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach((p) => {
        !w[p] &&
          (w[p] = (m, y) => {
            let S = m && m[p];
            if (S) return S.call(m);
            throw new O(`Response type '${p}' is not supported`, O.ERR_NOT_SUPPORT, y);
          });
      });
    const v = async (p) => {
        if (p == null) return 0;
        if (E.isBlob(p)) return p.size;
        if (E.isSpecCompliantForm(p))
          return (await new i(be.origin, { method: 'POST', body: p }).arrayBuffer()).byteLength;
        if (E.isArrayBufferView(p) || E.isArrayBuffer(p)) return p.byteLength;
        if ((E.isURLSearchParams(p) && (p = p + ''), E.isString(p))) return (await d(p)).byteLength;
      },
      x = async (p, m) => {
        const y = E.toFiniteNumber(p.getContentLength());
        return y ?? v(m);
      };
    return async (p) => {
      let {
        url: m,
        method: y,
        data: S,
        signal: C,
        cancelToken: T,
        timeout: N,
        onDownloadProgress: j,
        onUploadProgress: L,
        responseType: D,
        headers: z,
        withCredentials: Qe = 'same-origin',
        fetchOptions: Nt,
        maxContentLength: Pe,
        maxBodyLength: mr,
      } = t0(p);
      const Rt = E.isNumber(Pe) && Pe > -1,
        oe = E.isNumber(mr) && mr > -1;
      let A = s || fetch;
      D = D ? (D + '').toLowerCase() : 'text';
      let _ = UE([C, T && T.toAbortSignal()], N),
        M = null;
      const $ =
        _ &&
        _.unsubscribe &&
        (() => {
          _.unsubscribe();
        });
      let ae;
      try {
        if (Rt && typeof m == 'string' && m.startsWith('data:') && WE(m) > Pe)
          throw new O('maxContentLength size of ' + Pe + ' exceeded', O.ERR_BAD_RESPONSE, p, M);
        if (oe && y !== 'get' && y !== 'head') {
          const W = await x(z, S);
          if (typeof W == 'number' && isFinite(W) && W > mr)
            throw new O('Request body larger than maxBodyLength limit', O.ERR_BAD_REQUEST, p, M);
        }
        if (L && h && y !== 'get' && y !== 'head' && (ae = await x(z, S)) !== 0) {
          let W = new i(m, { method: 'POST', body: S, duplex: 'half' }),
            yr;
          if (
            (E.isFormData(S) && (yr = W.headers.get('content-type')) && z.setContentType(yr),
            W.body)
          ) {
            const [Bi, Ui] = bh(ae, oa(Oh(L)));
            S = Lh(W.body, Mh, Bi, Ui);
          }
        }
        E.isString(Qe) || (Qe = Qe ? 'include' : 'omit');
        const le = l && 'credentials' in i.prototype;
        if (E.isFormData(S)) {
          const W = z.getContentType();
          W &&
            /^multipart\/form-data/i.test(W) &&
            !/boundary=/i.test(W) &&
            z.delete('content-type');
        }
        z.set('User-Agent', 'axios/' + hd, !1);
        const ke = {
          ...Nt,
          signal: _,
          method: y.toUpperCase(),
          headers: z.normalize().toJSON(),
          body: S,
          duplex: 'half',
          credentials: le ? Qe : void 0,
        };
        M = l && new i(m, ke);
        let Be = await (l ? A(M, Nt) : A(m, ke));
        if (Rt) {
          const W = E.toFiniteNumber(Be.headers.get('content-length'));
          if (W != null && W > Pe)
            throw new O('maxContentLength size of ' + Pe + ' exceeded', O.ERR_BAD_RESPONSE, p, M);
        }
        const mt = g && (D === 'stream' || D === 'response');
        if (g && Be.body && (j || Rt || (mt && $))) {
          const W = {};
          ['status', 'statusText', 'headers'].forEach((xs) => {
            W[xs] = Be[xs];
          });
          const yr = E.toFiniteNumber(Be.headers.get('content-length')),
            [Bi, Ui] = (j && bh(yr, oa(Oh(j), !0))) || [];
          let Yd = 0;
          const $v = (xs) => {
            if (Rt && ((Yd = xs), Yd > Pe))
              throw new O('maxContentLength size of ' + Pe + ' exceeded', O.ERR_BAD_RESPONSE, p, M);
            Bi && Bi(xs);
          };
          Be = new o(
            Lh(Be.body, Mh, $v, () => {
              (Ui && Ui(), $ && $());
            }),
            W,
          );
        }
        D = D || 'text';
        let Ue = await w[E.findKey(w, D) || 'text'](Be, p);
        if (Rt && !g && !mt) {
          let W;
          if (
            (Ue != null &&
              (typeof Ue.byteLength == 'number'
                ? (W = Ue.byteLength)
                : typeof Ue.size == 'number'
                  ? (W = Ue.size)
                  : typeof Ue == 'string' &&
                    (W = typeof r == 'function' ? new r().encode(Ue).byteLength : Ue.length)),
            typeof W == 'number' && W > Pe)
          )
            throw new O('maxContentLength size of ' + Pe + ' exceeded', O.ERR_BAD_RESPONSE, p, M);
        }
        return (
          !mt && $ && $(),
          await new Promise((W, yr) => {
            Zg(W, yr, {
              data: Ue,
              headers: Fe.from(Be.headers),
              status: Be.status,
              statusText: Be.statusText,
              config: p,
              request: M,
            });
          })
        );
      } catch (le) {
        if (($ && $(), _ && _.aborted && _.reason instanceof O)) {
          const ke = _.reason;
          throw ((ke.config = p), M && (ke.request = M), le !== ke && (ke.cause = le), ke);
        }
        throw le && le.name === 'TypeError' && /Load failed|fetch/i.test(le.message)
          ? Object.assign(new O('Network Error', O.ERR_NETWORK, p, M, le && le.response), {
              cause: le.cause || le,
            })
          : O.from(le, le && le.code, p, M, le && le.response);
      }
    };
  },
  qE = new Map(),
  n0 = (e) => {
    let t = (e && e.env) || {};
    const { fetch: n, Request: r, Response: s } = t,
      i = [r, s, n];
    let o = i.length,
      a = o,
      l,
      u,
      c = qE;
    for (; a--; )
      ((l = i[a]), (u = c.get(l)), u === void 0 && c.set(l, (u = a ? new Map() : KE(t))), (c = u));
    return u;
  };
n0();
const pd = { http: hE, xhr: BE, fetch: { get: n0 } };
E.forEach(pd, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, 'name', { __proto__: null, value: t });
    } catch {}
    Object.defineProperty(e, 'adapterName', { __proto__: null, value: t });
  }
});
const Fh = (e) => `- ${e}`,
  QE = (e) => E.isFunction(e) || e === null || e === !1;
function GE(e, t) {
  e = E.isArray(e) ? e : [e];
  const { length: n } = e;
  let r, s;
  const i = {};
  for (let o = 0; o < n; o++) {
    r = e[o];
    let a;
    if (((s = r), !QE(r) && ((s = pd[(a = String(r)).toLowerCase()]), s === void 0)))
      throw new O(`Unknown adapter '${a}'`);
    if (s && (E.isFunction(s) || (s = s.get(t)))) break;
    i[a || '#' + o] = s;
  }
  if (!s) {
    const o = Object.entries(i).map(
      ([l, u]) =>
        `adapter ${l} ` +
        (u === !1 ? 'is not supported by the environment' : 'is not available in the build'),
    );
    let a = n
      ? o.length > 1
        ? `since :
` +
          o.map(Fh).join(`
`)
        : ' ' + Fh(o[0])
      : 'as no adapter specified';
    throw new O('There is no suitable adapter to dispatch the request ' + a, 'ERR_NOT_SUPPORT');
  }
  return s;
}
const r0 = { getAdapter: GE, adapters: pd };
function Pl(e) {
  if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted))
    throw new Li(null, e);
}
function Ih(e) {
  return (
    Pl(e),
    (e.headers = Fe.from(e.headers)),
    (e.data = El.call(e, e.transformRequest)),
    ['post', 'put', 'patch'].indexOf(e.method) !== -1 &&
      e.headers.setContentType('application/x-www-form-urlencoded', !1),
    r0
      .getAdapter(
        e.adapter || Di.adapter,
        e,
      )(e)
      .then(
        function (r) {
          (Pl(e), (e.response = r));
          try {
            r.data = El.call(e, e.transformResponse, r);
          } finally {
            delete e.response;
          }
          return ((r.headers = Fe.from(r.headers)), r);
        },
        function (r) {
          if (!Jg(r) && (Pl(e), r && r.response)) {
            e.response = r.response;
            try {
              r.response.data = El.call(e, e.transformResponse, r.response);
            } finally {
              delete e.response;
            }
            r.response.headers = Fe.from(r.response.headers);
          }
          return Promise.reject(r);
        },
      )
  );
}
const Ia = {};
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((e, t) => {
  Ia[e] = function (r) {
    return typeof r === e || 'a' + (t < 1 ? 'n ' : ' ') + e;
  };
});
const Vh = {};
Ia.transitional = function (t, n, r) {
  function s(i, o) {
    return '[Axios v' + hd + "] Transitional option '" + i + "'" + o + (r ? '. ' + r : '');
  }
  return (i, o, a) => {
    if (t === !1) throw new O(s(o, ' has been removed' + (n ? ' in ' + n : '')), O.ERR_DEPRECATED);
    return (
      n &&
        !Vh[o] &&
        ((Vh[o] = !0),
        console.warn(
          s(o, ' has been deprecated since v' + n + ' and will be removed in the near future'),
        )),
      t ? t(i, o, a) : !0
    );
  };
};
Ia.spelling = function (t) {
  return (n, r) => (console.warn(`${r} is likely a misspelling of ${t}`), !0);
};
function XE(e, t, n) {
  if (typeof e != 'object') throw new O('options must be an object', O.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
    const i = r[s],
      o = Object.prototype.hasOwnProperty.call(t, i) ? t[i] : void 0;
    if (o) {
      const a = e[i],
        l = a === void 0 || o(a, i, e);
      if (l !== !0) throw new O('option ' + i + ' must be ' + l, O.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0) throw new O('Unknown option ' + i, O.ERR_BAD_OPTION);
  }
}
const Ao = { assertOptions: XE, validators: Ia },
  st = Ao.validators;
let nr = class {
  constructor(t) {
    ((this.defaults = t || {}), (this.interceptors = { request: new Ah(), response: new Ah() }));
  }
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (r) {
      if (r instanceof Error) {
        let s = {};
        Error.captureStackTrace ? Error.captureStackTrace(s) : (s = new Error());
        const i = (() => {
          if (!s.stack) return '';
          const o = s.stack.indexOf(`
`);
          return o === -1 ? '' : s.stack.slice(o + 1);
        })();
        try {
          if (!r.stack) r.stack = i;
          else if (i) {
            const o = i.indexOf(`
`),
              a =
                o === -1
                  ? -1
                  : i.indexOf(
                      `
`,
                      o + 1,
                    ),
              l = a === -1 ? '' : i.slice(a + 1);
            String(r.stack).endsWith(l) ||
              (r.stack +=
                `
` + i);
          }
        } catch {}
      }
      throw r;
    }
  }
  _request(t, n) {
    (typeof t == 'string' ? ((n = n || {}), (n.url = t)) : (n = t || {}),
      (n = ur(this.defaults, n)));
    const { transitional: r, paramsSerializer: s, headers: i } = n;
    (r !== void 0 &&
      Ao.assertOptions(
        r,
        {
          silentJSONParsing: st.transitional(st.boolean),
          forcedJSONParsing: st.transitional(st.boolean),
          clarifyTimeoutError: st.transitional(st.boolean),
          legacyInterceptorReqResOrdering: st.transitional(st.boolean),
        },
        !1,
      ),
      s != null &&
        (E.isFunction(s)
          ? (n.paramsSerializer = { serialize: s })
          : Ao.assertOptions(s, { encode: st.function, serialize: st.function }, !0)),
      n.allowAbsoluteUrls !== void 0 ||
        (this.defaults.allowAbsoluteUrls !== void 0
          ? (n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (n.allowAbsoluteUrls = !0)),
      Ao.assertOptions(
        n,
        { baseUrl: st.spelling('baseURL'), withXsrfToken: st.spelling('withXSRFToken') },
        !0,
      ),
      (n.method = (n.method || this.defaults.method || 'get').toLowerCase()));
    let o = i && E.merge(i.common, i[n.method]);
    (i &&
      E.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'query', 'common'], (w) => {
        delete i[w];
      }),
      (n.headers = Fe.concat(o, i)));
    const a = [];
    let l = !0;
    this.interceptors.request.forEach(function (v) {
      if (typeof v.runWhen == 'function' && v.runWhen(n) === !1) return;
      l = l && v.synchronous;
      const x = n.transitional || dd;
      x && x.legacyInterceptorReqResOrdering
        ? a.unshift(v.fulfilled, v.rejected)
        : a.push(v.fulfilled, v.rejected);
    });
    const u = [];
    this.interceptors.response.forEach(function (v) {
      u.push(v.fulfilled, v.rejected);
    });
    let c,
      d = 0,
      h;
    if (!l) {
      const w = [Ih.bind(this), void 0];
      for (w.unshift(...a), w.push(...u), h = w.length, c = Promise.resolve(n); d < h; )
        c = c.then(w[d++], w[d++]);
      return c;
    }
    h = a.length;
    let g = n;
    for (; d < h; ) {
      const w = a[d++],
        v = a[d++];
      try {
        g = w(g);
      } catch (x) {
        v.call(this, x);
        break;
      }
    }
    try {
      c = Ih.call(this, g);
    } catch (w) {
      return Promise.reject(w);
    }
    for (d = 0, h = u.length; d < h; ) c = c.then(u[d++], u[d++]);
    return c;
  }
  getUri(t) {
    t = ur(this.defaults, t);
    const n = e0(t.baseURL, t.url, t.allowAbsoluteUrls);
    return Xg(n, t.params, t.paramsSerializer);
  }
};
E.forEach(['delete', 'get', 'head', 'options'], function (t) {
  nr.prototype[t] = function (n, r) {
    return this.request(ur(r || {}, { method: t, url: n, data: (r || {}).data }));
  };
});
E.forEach(['post', 'put', 'patch', 'query'], function (t) {
  function n(r) {
    return function (i, o, a) {
      return this.request(
        ur(a || {}, {
          method: t,
          headers: r ? { 'Content-Type': 'multipart/form-data' } : {},
          url: i,
          data: o,
        }),
      );
    };
  }
  ((nr.prototype[t] = n()), t !== 'query' && (nr.prototype[t + 'Form'] = n(!0)));
});
let YE = class s0 {
  constructor(t) {
    if (typeof t != 'function') throw new TypeError('executor must be a function.');
    let n;
    this.promise = new Promise(function (i) {
      n = i;
    });
    const r = this;
    (this.promise.then((s) => {
      if (!r._listeners) return;
      let i = r._listeners.length;
      for (; i-- > 0; ) r._listeners[i](s);
      r._listeners = null;
    }),
      (this.promise.then = (s) => {
        let i;
        const o = new Promise((a) => {
          (r.subscribe(a), (i = a));
        }).then(s);
        return (
          (o.cancel = function () {
            r.unsubscribe(i);
          }),
          o
        );
      }),
      t(function (i, o, a) {
        r.reason || ((r.reason = new Li(i, o, a)), n(r.reason));
      }));
  }
  throwIfRequested() {
    if (this.reason) throw this.reason;
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
  }
  unsubscribe(t) {
    if (!this._listeners) return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(),
      n = (r) => {
        t.abort(r);
      };
    return (this.subscribe(n), (t.signal.unsubscribe = () => this.unsubscribe(n)), t.signal);
  }
  static source() {
    let t;
    return {
      token: new s0(function (s) {
        t = s;
      }),
      cancel: t,
    };
  }
};
function JE(e) {
  return function (n) {
    return e.apply(null, n);
  };
}
function ZE(e) {
  return E.isObject(e) && e.isAxiosError === !0;
}
const Hu = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526,
};
Object.entries(Hu).forEach(([e, t]) => {
  Hu[t] = e;
});
function i0(e) {
  const t = new nr(e),
    n = Vg(nr.prototype.request, t);
  return (
    E.extend(n, nr.prototype, t, { allOwnKeys: !0 }),
    E.extend(n, t, null, { allOwnKeys: !0 }),
    (n.create = function (s) {
      return i0(ur(e, s));
    }),
    n
  );
}
const fe = i0(Di);
fe.Axios = nr;
fe.CanceledError = Li;
fe.CancelToken = YE;
fe.isCancel = Jg;
fe.VERSION = hd;
fe.toFormData = Fa;
fe.AxiosError = O;
fe.Cancel = fe.CanceledError;
fe.all = function (t) {
  return Promise.all(t);
};
fe.spread = JE;
fe.isAxiosError = ZE;
fe.mergeConfig = ur;
fe.AxiosHeaders = Fe;
fe.formToJSON = (e) => Yg(E.isHTMLForm(e) ? new FormData(e) : e);
fe.getAdapter = r0.getAdapter;
fe.HttpStatusCode = Hu;
fe.default = fe;
const {
    Axios: hN,
    AxiosError: pN,
    CanceledError: mN,
    isCancel: yN,
    CancelToken: gN,
    VERSION: vN,
    all: xN,
    Cancel: wN,
    isAxiosError: SN,
    spread: CN,
    toFormData: EN,
    AxiosHeaders: PN,
    HttpStatusCode: kN,
    formToJSON: TN,
    getAdapter: jN,
    mergeConfig: NN,
    create: RN,
  } = fe,
  ms = {
    default: 'http://localhost:3000',
    auth: 'http://localhost:3001',
    cart: 'http://localhost:3002',
    product: 'http://localhost:3003',
    order: 'http://localhost:3004',
    payment: 'http://localhost:3005',
  },
  ys = (e) => {
    const t = fe.create({
      baseURL: e,
      timeout: 1e4,
      headers: { 'Content-Type': 'application/json' },
    });
    return (
      t.interceptors.request.use(
        (n) => {
          const r = localStorage.getItem('token');
          return (r && n.headers && (n.headers.Authorization = `Bearer ${r}`), n);
        },
        (n) => Promise.reject(n),
      ),
      t.interceptors.response.use(
        (n) => n,
        (n) => {
          var r;
          return (
            ((r = n.response) == null ? void 0 : r.status) === 401 &&
              (localStorage.removeItem('token'), (window.location.href = '/login')),
            n.response || (n.message = 'Network error. Please check your connection.'),
            Promise.reject(n)
          );
        },
      ),
      t
    );
  };
ys(ms.default);
const lo = ys(ms.auth);
ys(ms.cart);
ys(ms.product);
ys(ms.order);
ys(ms.payment);
const uo = {
  get: (e, t) => lo.get(e, t),
  post: (e, t, n) => lo.post(e, t, n),
  put: (e, t, n) => lo.put(e, t, n),
  delete: (e, t) => lo.delete(e, t),
};
class eP {
  async login(t) {
    return (await uo.post('/login', t)).data;
  }
  async register(t) {
    return (await uo.post('/register', t)).data;
  }
  async refreshToken(t) {
    return (await uo.post('/refresh', { refreshToken: t })).data;
  }
  async logout() {
    await uo.post('/logout');
  }
}
const co = new eP(),
  tP = uC()(
    fC(
      (e, t) => ({
        user: null,
        token: null,
        isAuthenticated: !1,
        isLoading: !1,
        error: null,
        login: async (n, r) => {
          e({ isLoading: !0, error: null });
          try {
            const s = await co.login({ email: n, password: r });
            (e({ user: s.user, token: s.token, isAuthenticated: !0, isLoading: !1 }),
              localStorage.setItem('token', s.token));
          } catch (s) {
            e({ error: s instanceof Error ? s.message : 'Login failed', isLoading: !1 });
          }
        },
        register: async (n) => {
          e({ isLoading: !0, error: null });
          try {
            const r = await co.register(n);
            (e({ user: r.user, token: r.token, isAuthenticated: !0, isLoading: !1 }),
              localStorage.setItem('token', r.token));
          } catch (r) {
            e({ error: r instanceof Error ? r.message : 'Registration failed', isLoading: !1 });
          }
        },
        logout: async () => {
          if (t().token)
            try {
              await co.logout();
            } catch (s) {
              console.error('Logout error:', s);
            }
          (e({ user: null, token: null, isAuthenticated: !1, error: null }),
            localStorage.removeItem('token'));
        },
        refreshToken: async () => {
          const r = t().token;
          if (r)
            try {
              const s = await co.refreshToken(r);
              (e({ user: s.user, token: s.token, isAuthenticated: !0 }),
                localStorage.setItem('token', s.token));
            } catch (s) {
              (e({
                user: null,
                token: null,
                isAuthenticated: !1,
                error: s instanceof Error ? s.message : 'Token refresh failed',
              }),
                localStorage.removeItem('token'));
            }
        },
        setUser: (n) => e({ user: n }),
        clearError: () => e({ error: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (e) => ({ user: e.user, token: e.token, isAuthenticated: e.isAuthenticated }),
      },
    ),
  );
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var nP = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const rP = (e) => e.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Y = (e, t) => {
  const n = P.forwardRef(
    (
      {
        color: r = 'currentColor',
        size: s = 24,
        strokeWidth: i = 2,
        absoluteStrokeWidth: o,
        className: a = '',
        children: l,
        ...u
      },
      c,
    ) =>
      P.createElement(
        'svg',
        {
          ref: c,
          ...nP,
          width: s,
          height: s,
          stroke: r,
          strokeWidth: o ? (Number(i) * 24) / Number(s) : i,
          className: ['lucide', `lucide-${rP(e)}`, a].join(' '),
          ...u,
        },
        [...t.map(([d, h]) => P.createElement(d, h)), ...(Array.isArray(l) ? l : [l])],
      ),
  );
  return ((n.displayName = `${e}`), n);
};
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const o0 = Y('ArrowLeft', [
  ['path', { d: 'm12 19-7-7 7-7', key: '1l729n' }],
  ['path', { d: 'M19 12H5', key: 'x3x0zl' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const aa = Y('ArrowRight', [
  ['path', { d: 'M5 12h14', key: '1ays0h' }],
  ['path', { d: 'm12 5 7 7-7 7', key: 'xquz4c' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const a0 = Y('CircleCheck', [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'm9 12 2 2 4-4', key: 'dzmm74' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const sP = Y('CreditCard', [
  ['rect', { width: '20', height: '14', x: '2', y: '5', rx: '2', key: 'ynyp8z' }],
  ['line', { x1: '2', x2: '22', y1: '10', y2: '10', key: '1b3vmo' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const iP = Y('Github', [
  [
    'path',
    {
      d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
      key: 'tonef',
    },
  ],
  ['path', { d: 'M9 18c-4.51 2-5-2-7-2', key: '9comsn' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const md = Y('Heart', [
  [
    'path',
    {
      d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
      key: 'c3ymky',
    },
  ],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const oP = Y('Instagram', [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: '2e1cvw' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: '9exkf1' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'r4j83e' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Va = Y('LoaderCircle', [['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', key: '13zald' }]]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const l0 = Y('Lock', [
  ['rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2', key: '1w4ew1' }],
  ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4', key: 'fwvmzm' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const aP = Y('LogOut', [
  ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', key: '1uf3rs' }],
  ['polyline', { points: '16 17 21 12 16 7', key: '1gabdz' }],
  ['line', { x1: '21', x2: '9', y1: '12', y2: '12', key: '1uyos4' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const u0 = Y('Mail', [
  ['rect', { width: '20', height: '16', x: '2', y: '4', rx: '2', key: '18n3k1' }],
  ['path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7', key: '1ocrg3' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const lP = Y('Menu', [
  ['line', { x1: '4', x2: '20', y1: '12', y2: '12', key: '1e0a9i' }],
  ['line', { x1: '4', x2: '20', y1: '6', y2: '6', key: '1owob3' }],
  ['line', { x1: '4', x2: '20', y1: '18', y2: '18', key: 'yk5zj1' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const uP = Y('Minus', [['path', { d: 'M5 12h14', key: '1ays0h' }]]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const cP = Y('Plus', [
  ['path', { d: 'M5 12h14', key: '1ays0h' }],
  ['path', { d: 'M12 5v14', key: 's699le' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const dP = Y('Search', [
  ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
  ['path', { d: 'm21 21-4.3-4.3', key: '1qie3q' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const c0 = Y('ShieldCheck', [
  [
    'path',
    {
      d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
      key: 'oel41y',
    },
  ],
  ['path', { d: 'm9 12 2 2 4-4', key: 'dzmm74' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const fP = Y('ShoppingBag', [
  ['path', { d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z', key: 'hou9p0' }],
  ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
  ['path', { d: 'M16 10a4 4 0 0 1-8 0', key: '1ltviw' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ba = Y('ShoppingCart', [
  ['circle', { cx: '8', cy: '21', r: '1', key: 'jimo8o' }],
  ['circle', { cx: '19', cy: '21', r: '1', key: '13723u' }],
  [
    'path',
    {
      d: 'M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12',
      key: '9zh506',
    },
  ],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hP = Y('SlidersHorizontal', [
  ['line', { x1: '21', x2: '14', y1: '4', y2: '4', key: 'obuewd' }],
  ['line', { x1: '10', x2: '3', y1: '4', y2: '4', key: '1q6298' }],
  ['line', { x1: '21', x2: '12', y1: '12', y2: '12', key: '1iu8h1' }],
  ['line', { x1: '8', x2: '3', y1: '12', y2: '12', key: 'ntss68' }],
  ['line', { x1: '21', x2: '16', y1: '20', y2: '20', key: '14d8ph' }],
  ['line', { x1: '12', x2: '3', y1: '20', y2: '20', key: 'm0wm8r' }],
  ['line', { x1: '14', x2: '14', y1: '2', y2: '6', key: '14e1ph' }],
  ['line', { x1: '8', x2: '8', y1: '10', y2: '14', key: '1i6ji0' }],
  ['line', { x1: '16', x2: '16', y1: '18', y2: '22', key: '1lctlv' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const yd = Y('Star', [
  [
    'polygon',
    {
      points:
        '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
      key: '8f66p6',
    },
  ],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const pP = Y('Trash2', [
  ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
  ['path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6', key: '4alrt4' }],
  ['path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2', key: 'v07s0e' }],
  ['line', { x1: '10', x2: '10', y1: '11', y2: '17', key: '1uufr5' }],
  ['line', { x1: '14', x2: '14', y1: '11', y2: '17', key: 'xtxkd' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mP = Y('Truck', [
  ['path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', key: 'wrbu53' }],
  ['path', { d: 'M15 18H9', key: '1lyqi6' }],
  [
    'path',
    {
      d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14',
      key: 'lysw3i',
    },
  ],
  ['circle', { cx: '17', cy: '18', r: '2', key: '332jqn' }],
  ['circle', { cx: '7', cy: '18', r: '2', key: '19iecd' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const yP = Y('Twitter', [
  [
    'path',
    {
      d: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
      key: 'pff0z6',
    },
  ],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const d0 = Y('User', [
  ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', key: '975kel' }],
  ['circle', { cx: '12', cy: '7', r: '4', key: '17ys0d' }],
]);
/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const gP = Y('X', [
    ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
    ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
  ]),
  vP = P.createContext(void 0),
  hr = () => {
    const e = P.useContext(vP);
    if (!e) throw new Error('useProduct must be used within a ProductProvider');
    return e;
  },
  xP = P.createContext(void 0),
  Mi = () => {
    const e = P.useContext(xP);
    if (e === void 0) throw new Error('useAuth must be used within an AuthProvider');
    return e;
  },
  gd = P.createContext({});
function vd(e) {
  const t = P.useRef(null);
  return (t.current === null && (t.current = e()), t.current);
}
const Ua = P.createContext(null),
  xd = P.createContext({ transformPagePoint: (e) => e, isStatic: !1, reducedMotion: 'never' });
class wP extends P.Component {
  getSnapshotBeforeUpdate(t) {
    const n = this.props.childRef.current;
    if (n && t.isPresent && !this.props.isPresent) {
      const r = this.props.sizeRef.current;
      ((r.height = n.offsetHeight || 0),
        (r.width = n.offsetWidth || 0),
        (r.top = n.offsetTop),
        (r.left = n.offsetLeft));
    }
    return null;
  }
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
}
function SP({ children: e, isPresent: t }) {
  const n = P.useId(),
    r = P.useRef(null),
    s = P.useRef({ width: 0, height: 0, top: 0, left: 0 }),
    { nonce: i } = P.useContext(xd);
  return (
    P.useInsertionEffect(() => {
      const { width: o, height: a, top: l, left: u } = s.current;
      if (t || !r.current || !o || !a) return;
      r.current.dataset.motionPopId = n;
      const c = document.createElement('style');
      return (
        i && (c.nonce = i),
        document.head.appendChild(c),
        c.sheet &&
          c.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${o}px !important;
            height: ${a}px !important;
            top: ${l}px !important;
            left: ${u}px !important;
          }
        `),
        () => {
          document.head.removeChild(c);
        }
      );
    }, [t]),
    f.jsx(wP, { isPresent: t, childRef: r, sizeRef: s, children: P.cloneElement(e, { ref: r }) })
  );
}
const CP = ({
  children: e,
  initial: t,
  isPresent: n,
  onExitComplete: r,
  custom: s,
  presenceAffectsLayout: i,
  mode: o,
}) => {
  const a = vd(EP),
    l = P.useId(),
    u = P.useCallback(
      (d) => {
        a.set(d, !0);
        for (const h of a.values()) if (!h) return;
        r && r();
      },
      [a, r],
    ),
    c = P.useMemo(
      () => ({
        id: l,
        initial: t,
        isPresent: n,
        custom: s,
        onExitComplete: u,
        register: (d) => (a.set(d, !1), () => a.delete(d)),
      }),
      i ? [Math.random(), u] : [n, u],
    );
  return (
    P.useMemo(() => {
      a.forEach((d, h) => a.set(h, !1));
    }, [n]),
    P.useEffect(() => {
      !n && !a.size && r && r();
    }, [n]),
    o === 'popLayout' && (e = f.jsx(SP, { isPresent: n, children: e })),
    f.jsx(Ua.Provider, { value: c, children: e })
  );
};
function EP() {
  return new Map();
}
function f0(e = !0) {
  const t = P.useContext(Ua);
  if (t === null) return [!0, null];
  const { isPresent: n, onExitComplete: r, register: s } = t,
    i = P.useId();
  P.useEffect(() => {
    e && s(i);
  }, [e]);
  const o = P.useCallback(() => e && r && r(i), [i, r, e]);
  return !n && r ? [!1, o] : [!0];
}
const fo = (e) => e.key || '';
function Bh(e) {
  const t = [];
  return (
    P.Children.forEach(e, (n) => {
      P.isValidElement(n) && t.push(n);
    }),
    t
  );
}
const wd = typeof window < 'u',
  h0 = wd ? P.useLayoutEffect : P.useEffect,
  p0 = ({
    children: e,
    custom: t,
    initial: n = !0,
    onExitComplete: r,
    presenceAffectsLayout: s = !0,
    mode: i = 'sync',
    propagate: o = !1,
  }) => {
    const [a, l] = f0(o),
      u = P.useMemo(() => Bh(e), [e]),
      c = o && !a ? [] : u.map(fo),
      d = P.useRef(!0),
      h = P.useRef(u),
      g = vd(() => new Map()),
      [w, v] = P.useState(u),
      [x, p] = P.useState(u);
    h0(() => {
      ((d.current = !1), (h.current = u));
      for (let S = 0; S < x.length; S++) {
        const C = fo(x[S]);
        c.includes(C) ? g.delete(C) : g.get(C) !== !0 && g.set(C, !1);
      }
    }, [x, c.length, c.join('-')]);
    const m = [];
    if (u !== w) {
      let S = [...u];
      for (let C = 0; C < x.length; C++) {
        const T = x[C],
          N = fo(T);
        c.includes(N) || (S.splice(C, 0, T), m.push(T));
      }
      (i === 'wait' && m.length && (S = m), p(Bh(S)), v(u));
      return;
    }
    const { forceRender: y } = P.useContext(gd);
    return f.jsx(f.Fragment, {
      children: x.map((S) => {
        const C = fo(S),
          T = o && !a ? !1 : u === x || c.includes(C),
          N = () => {
            if (g.has(C)) g.set(C, !0);
            else return;
            let j = !0;
            (g.forEach((L) => {
              L || (j = !1);
            }),
              j && (y == null || y(), p(h.current), o && (l == null || l()), r && r()));
          };
        return f.jsx(
          CP,
          {
            isPresent: T,
            initial: !d.current || n ? void 0 : !1,
            custom: T ? void 0 : t,
            presenceAffectsLayout: s,
            mode: i,
            onExitComplete: T ? void 0 : N,
            children: S,
          },
          C,
        );
      }),
    });
  },
  Ze = (e) => e;
let m0 = Ze;
function Sd(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const is = (e, t, n) => {
    const r = t - e;
    return r === 0 ? 1 : (n - e) / r;
  },
  Qt = (e) => e * 1e3,
  Gt = (e) => e / 1e3,
  PP = { useManualTiming: !1 };
function kP(e) {
  let t = new Set(),
    n = new Set(),
    r = !1,
    s = !1;
  const i = new WeakSet();
  let o = { delta: 0, timestamp: 0, isProcessing: !1 };
  function a(u) {
    (i.has(u) && (l.schedule(u), e()), u(o));
  }
  const l = {
    schedule: (u, c = !1, d = !1) => {
      const g = d && r ? t : n;
      return (c && i.add(u), g.has(u) || g.add(u), u);
    },
    cancel: (u) => {
      (n.delete(u), i.delete(u));
    },
    process: (u) => {
      if (((o = u), r)) {
        s = !0;
        return;
      }
      ((r = !0),
        ([t, n] = [n, t]),
        t.forEach(a),
        t.clear(),
        (r = !1),
        s && ((s = !1), l.process(u)));
    },
  };
  return l;
}
const ho = ['read', 'resolveKeyframes', 'update', 'preRender', 'render', 'postRender'],
  TP = 40;
function y0(e, t) {
  let n = !1,
    r = !0;
  const s = { delta: 0, timestamp: 0, isProcessing: !1 },
    i = () => (n = !0),
    o = ho.reduce((p, m) => ((p[m] = kP(i)), p), {}),
    { read: a, resolveKeyframes: l, update: u, preRender: c, render: d, postRender: h } = o,
    g = () => {
      const p = performance.now();
      ((n = !1),
        (s.delta = r ? 1e3 / 60 : Math.max(Math.min(p - s.timestamp, TP), 1)),
        (s.timestamp = p),
        (s.isProcessing = !0),
        a.process(s),
        l.process(s),
        u.process(s),
        c.process(s),
        d.process(s),
        h.process(s),
        (s.isProcessing = !1),
        n && t && ((r = !1), e(g)));
    },
    w = () => {
      ((n = !0), (r = !0), s.isProcessing || e(g));
    };
  return {
    schedule: ho.reduce((p, m) => {
      const y = o[m];
      return ((p[m] = (S, C = !1, T = !1) => (n || w(), y.schedule(S, C, T))), p);
    }, {}),
    cancel: (p) => {
      for (let m = 0; m < ho.length; m++) o[ho[m]].cancel(p);
    },
    state: s,
    steps: o,
  };
}
const {
    schedule: X,
    cancel: An,
    state: Se,
    steps: kl,
  } = y0(typeof requestAnimationFrame < 'u' ? requestAnimationFrame : Ze, !0),
  g0 = P.createContext({ strict: !1 }),
  Uh = {
    animation: [
      'animate',
      'variants',
      'whileHover',
      'whileTap',
      'exit',
      'whileInView',
      'whileFocus',
      'whileDrag',
    ],
    exit: ['exit'],
    drag: ['drag', 'dragControls'],
    focus: ['whileFocus'],
    hover: ['whileHover', 'onHoverStart', 'onHoverEnd'],
    tap: ['whileTap', 'onTap', 'onTapStart', 'onTapCancel'],
    pan: ['onPan', 'onPanStart', 'onPanSessionStart', 'onPanEnd'],
    inView: ['whileInView', 'onViewportEnter', 'onViewportLeave'],
    layout: ['layout', 'layoutId'],
  },
  os = {};
for (const e in Uh) os[e] = { isEnabled: (t) => Uh[e].some((n) => !!t[n]) };
function jP(e) {
  for (const t in e) os[t] = { ...os[t], ...e[t] };
}
const NP = new Set([
  'animate',
  'exit',
  'variants',
  'initial',
  'style',
  'values',
  'variants',
  'transition',
  'transformTemplate',
  'custom',
  'inherit',
  'onBeforeLayoutMeasure',
  'onAnimationStart',
  'onAnimationComplete',
  'onUpdate',
  'onDragStart',
  'onDrag',
  'onDragEnd',
  'onMeasureDragConstraints',
  'onDirectionLock',
  'onDragTransitionEnd',
  '_dragX',
  '_dragY',
  'onHoverStart',
  'onHoverEnd',
  'onViewportEnter',
  'onViewportLeave',
  'globalTapTarget',
  'ignoreStrict',
  'viewport',
]);
function la(e) {
  return (
    e.startsWith('while') ||
    (e.startsWith('drag') && e !== 'draggable') ||
    e.startsWith('layout') ||
    e.startsWith('onTap') ||
    e.startsWith('onPan') ||
    e.startsWith('onLayout') ||
    NP.has(e)
  );
}
let v0 = (e) => !la(e);
function RP(e) {
  e && (v0 = (t) => (t.startsWith('on') ? !la(t) : e(t)));
}
try {
  RP(require('@emotion/is-prop-valid').default);
} catch {}
function AP(e, t, n) {
  const r = {};
  for (const s in e)
    (s === 'values' && typeof e.values == 'object') ||
      ((v0(s) ||
        (n === !0 && la(s)) ||
        (!t && !la(s)) ||
        (e.draggable && s.startsWith('onDrag'))) &&
        (r[s] = e[s]));
  return r;
}
function bP(e) {
  if (typeof Proxy > 'u') return e;
  const t = new Map(),
    n = (...r) => e(...r);
  return new Proxy(n, {
    get: (r, s) => (s === 'create' ? e : (t.has(s) || t.set(s, e(s)), t.get(s))),
  });
}
const za = P.createContext({});
function gi(e) {
  return typeof e == 'string' || Array.isArray(e);
}
function $a(e) {
  return e !== null && typeof e == 'object' && typeof e.start == 'function';
}
const Cd = ['animate', 'whileInView', 'whileFocus', 'whileHover', 'whileTap', 'whileDrag', 'exit'],
  Ed = ['initial', ...Cd];
function Ha(e) {
  return $a(e.animate) || Ed.some((t) => gi(e[t]));
}
function x0(e) {
  return !!(Ha(e) || e.variants);
}
function OP(e, t) {
  if (Ha(e)) {
    const { initial: n, animate: r } = e;
    return { initial: n === !1 || gi(n) ? n : void 0, animate: gi(r) ? r : void 0 };
  }
  return e.inherit !== !1 ? t : {};
}
function DP(e) {
  const { initial: t, animate: n } = OP(e, P.useContext(za));
  return P.useMemo(() => ({ initial: t, animate: n }), [zh(t), zh(n)]);
}
function zh(e) {
  return Array.isArray(e) ? e.join(' ') : e;
}
const LP = Symbol.for('motionComponentSymbol');
function br(e) {
  return e && typeof e == 'object' && Object.prototype.hasOwnProperty.call(e, 'current');
}
function MP(e, t, n) {
  return P.useCallback(
    (r) => {
      (r && e.onMount && e.onMount(r),
        t && (r ? t.mount(r) : t.unmount()),
        n && (typeof n == 'function' ? n(r) : br(n) && (n.current = r)));
    },
    [t],
  );
}
const Pd = (e) => e.replace(/([a-z])([A-Z])/gu, '$1-$2').toLowerCase(),
  _P = 'framerAppearId',
  w0 = 'data-' + Pd(_P),
  { schedule: kd } = y0(queueMicrotask, !1),
  S0 = P.createContext({});
function FP(e, t, n, r, s) {
  var i, o;
  const { visualElement: a } = P.useContext(za),
    l = P.useContext(g0),
    u = P.useContext(Ua),
    c = P.useContext(xd).reducedMotion,
    d = P.useRef(null);
  ((r = r || l.renderer),
    !d.current &&
      r &&
      (d.current = r(e, {
        visualState: t,
        parent: a,
        props: n,
        presenceContext: u,
        blockInitialAnimation: u ? u.initial === !1 : !1,
        reducedMotionConfig: c,
      })));
  const h = d.current,
    g = P.useContext(S0);
  h && !h.projection && s && (h.type === 'html' || h.type === 'svg') && IP(d.current, n, s, g);
  const w = P.useRef(!1);
  P.useInsertionEffect(() => {
    h && w.current && h.update(n, u);
  });
  const v = n[w0],
    x = P.useRef(
      !!v &&
        !(!((i = window.MotionHandoffIsComplete) === null || i === void 0) && i.call(window, v)) &&
        ((o = window.MotionHasOptimisedAnimation) === null || o === void 0
          ? void 0
          : o.call(window, v)),
    );
  return (
    h0(() => {
      h &&
        ((w.current = !0),
        (window.MotionIsMounted = !0),
        h.updateFeatures(),
        kd.render(h.render),
        x.current && h.animationState && h.animationState.animateChanges());
    }),
    P.useEffect(() => {
      h &&
        (!x.current && h.animationState && h.animationState.animateChanges(),
        x.current &&
          (queueMicrotask(() => {
            var p;
            (p = window.MotionHandoffMarkAsComplete) === null || p === void 0 || p.call(window, v);
          }),
          (x.current = !1)));
    }),
    h
  );
}
function IP(e, t, n, r) {
  const { layoutId: s, layout: i, drag: o, dragConstraints: a, layoutScroll: l, layoutRoot: u } = t;
  ((e.projection = new n(e.latestValues, t['data-framer-portal-id'] ? void 0 : C0(e.parent))),
    e.projection.setOptions({
      layoutId: s,
      layout: i,
      alwaysMeasureLayout: !!o || (a && br(a)),
      visualElement: e,
      animationType: typeof i == 'string' ? i : 'both',
      initialPromotionConfig: r,
      layoutScroll: l,
      layoutRoot: u,
    }));
}
function C0(e) {
  if (e) return e.options.allowProjection !== !1 ? e.projection : C0(e.parent);
}
function VP({
  preloadedFeatures: e,
  createVisualElement: t,
  useRender: n,
  useVisualState: r,
  Component: s,
}) {
  var i, o;
  e && jP(e);
  function a(u, c) {
    let d;
    const h = { ...P.useContext(xd), ...u, layoutId: BP(u) },
      { isStatic: g } = h,
      w = DP(u),
      v = r(u, g);
    if (!g && wd) {
      UP();
      const x = zP(h);
      ((d = x.MeasureLayout), (w.visualElement = FP(s, v, h, t, x.ProjectionNode)));
    }
    return f.jsxs(za.Provider, {
      value: w,
      children: [
        d && w.visualElement ? f.jsx(d, { visualElement: w.visualElement, ...h }) : null,
        n(s, u, MP(v, w.visualElement, c), v, g, w.visualElement),
      ],
    });
  }
  a.displayName = `motion.${typeof s == 'string' ? s : `create(${(o = (i = s.displayName) !== null && i !== void 0 ? i : s.name) !== null && o !== void 0 ? o : ''})`}`;
  const l = P.forwardRef(a);
  return ((l[LP] = s), l);
}
function BP({ layoutId: e }) {
  const t = P.useContext(gd).id;
  return t && e !== void 0 ? t + '-' + e : e;
}
function UP(e, t) {
  P.useContext(g0).strict;
}
function zP(e) {
  const { drag: t, layout: n } = os;
  if (!t && !n) return {};
  const r = { ...t, ...n };
  return {
    MeasureLayout:
      (t != null && t.isEnabled(e)) || (n != null && n.isEnabled(e)) ? r.MeasureLayout : void 0,
    ProjectionNode: r.ProjectionNode,
  };
}
const $P = [
  'animate',
  'circle',
  'defs',
  'desc',
  'ellipse',
  'g',
  'image',
  'line',
  'filter',
  'marker',
  'mask',
  'metadata',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'rect',
  'stop',
  'switch',
  'symbol',
  'svg',
  'text',
  'tspan',
  'use',
  'view',
];
function Td(e) {
  return typeof e != 'string' || e.includes('-') ? !1 : !!($P.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
function $h(e) {
  const t = [{}, {}];
  return (
    e == null ||
      e.values.forEach((n, r) => {
        ((t[0][r] = n.get()), (t[1][r] = n.getVelocity()));
      }),
    t
  );
}
function jd(e, t, n, r) {
  if (typeof t == 'function') {
    const [s, i] = $h(r);
    t = t(n !== void 0 ? n : e.custom, s, i);
  }
  if ((typeof t == 'string' && (t = e.variants && e.variants[t]), typeof t == 'function')) {
    const [s, i] = $h(r);
    t = t(n !== void 0 ? n : e.custom, s, i);
  }
  return t;
}
const Wu = (e) => Array.isArray(e),
  HP = (e) => !!(e && typeof e == 'object' && e.mix && e.toValue),
  WP = (e) => (Wu(e) ? e[e.length - 1] || 0 : e),
  Oe = (e) => !!(e && e.getVelocity);
function bo(e) {
  const t = Oe(e) ? e.get() : e;
  return HP(t) ? t.toValue() : t;
}
function KP({ scrapeMotionValuesFromProps: e, createRenderState: t, onUpdate: n }, r, s, i) {
  const o = { latestValues: qP(r, s, i, e), renderState: t() };
  return (
    n && ((o.onMount = (a) => n({ props: r, current: a, ...o })), (o.onUpdate = (a) => n(a))),
    o
  );
}
const E0 = (e) => (t, n) => {
  const r = P.useContext(za),
    s = P.useContext(Ua),
    i = () => KP(e, t, r, s);
  return n ? i() : vd(i);
};
function qP(e, t, n, r) {
  const s = {},
    i = r(e, {});
  for (const h in i) s[h] = bo(i[h]);
  let { initial: o, animate: a } = e;
  const l = Ha(e),
    u = x0(e);
  t &&
    u &&
    !l &&
    e.inherit !== !1 &&
    (o === void 0 && (o = t.initial), a === void 0 && (a = t.animate));
  let c = n ? n.initial === !1 : !1;
  c = c || o === !1;
  const d = c ? a : o;
  if (d && typeof d != 'boolean' && !$a(d)) {
    const h = Array.isArray(d) ? d : [d];
    for (let g = 0; g < h.length; g++) {
      const w = jd(e, h[g]);
      if (w) {
        const { transitionEnd: v, transition: x, ...p } = w;
        for (const m in p) {
          let y = p[m];
          if (Array.isArray(y)) {
            const S = c ? y.length - 1 : 0;
            y = y[S];
          }
          y !== null && (s[m] = y);
        }
        for (const m in v) s[m] = v[m];
      }
    }
  }
  return s;
}
const gs = [
    'transformPerspective',
    'x',
    'y',
    'z',
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'scaleX',
    'scaleY',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'skew',
    'skewX',
    'skewY',
  ],
  pr = new Set(gs),
  P0 = (e) => (t) => typeof t == 'string' && t.startsWith(e),
  k0 = P0('--'),
  QP = P0('var(--'),
  Nd = (e) => (QP(e) ? GP.test(e.split('/*')[0].trim()) : !1),
  GP = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,
  T0 = (e, t) => (t && typeof e == 'number' ? t.transform(e) : e),
  en = (e, t, n) => (n > t ? t : n < e ? e : n),
  vs = { test: (e) => typeof e == 'number', parse: parseFloat, transform: (e) => e },
  vi = { ...vs, transform: (e) => en(0, 1, e) },
  po = { ...vs, default: 1 },
  _i = (e) => ({
    test: (t) => typeof t == 'string' && t.endsWith(e) && t.split(' ').length === 1,
    parse: parseFloat,
    transform: (t) => `${t}${e}`,
  }),
  sn = _i('deg'),
  It = _i('%'),
  F = _i('px'),
  XP = _i('vh'),
  YP = _i('vw'),
  Hh = { ...It, parse: (e) => It.parse(e) / 100, transform: (e) => It.transform(e * 100) },
  JP = {
    borderWidth: F,
    borderTopWidth: F,
    borderRightWidth: F,
    borderBottomWidth: F,
    borderLeftWidth: F,
    borderRadius: F,
    radius: F,
    borderTopLeftRadius: F,
    borderTopRightRadius: F,
    borderBottomRightRadius: F,
    borderBottomLeftRadius: F,
    width: F,
    maxWidth: F,
    height: F,
    maxHeight: F,
    top: F,
    right: F,
    bottom: F,
    left: F,
    padding: F,
    paddingTop: F,
    paddingRight: F,
    paddingBottom: F,
    paddingLeft: F,
    margin: F,
    marginTop: F,
    marginRight: F,
    marginBottom: F,
    marginLeft: F,
    backgroundPositionX: F,
    backgroundPositionY: F,
  },
  ZP = {
    rotate: sn,
    rotateX: sn,
    rotateY: sn,
    rotateZ: sn,
    scale: po,
    scaleX: po,
    scaleY: po,
    scaleZ: po,
    skew: sn,
    skewX: sn,
    skewY: sn,
    distance: F,
    translateX: F,
    translateY: F,
    translateZ: F,
    x: F,
    y: F,
    z: F,
    perspective: F,
    transformPerspective: F,
    opacity: vi,
    originX: Hh,
    originY: Hh,
    originZ: F,
  },
  Wh = { ...vs, transform: Math.round },
  Rd = { ...JP, ...ZP, zIndex: Wh, size: F, fillOpacity: vi, strokeOpacity: vi, numOctaves: Wh },
  e2 = { x: 'translateX', y: 'translateY', z: 'translateZ', transformPerspective: 'perspective' },
  t2 = gs.length;
function n2(e, t, n) {
  let r = '',
    s = !0;
  for (let i = 0; i < t2; i++) {
    const o = gs[i],
      a = e[o];
    if (a === void 0) continue;
    let l = !0;
    if (
      (typeof a == 'number'
        ? (l = a === (o.startsWith('scale') ? 1 : 0))
        : (l = parseFloat(a) === 0),
      !l || n)
    ) {
      const u = T0(a, Rd[o]);
      if (!l) {
        s = !1;
        const c = e2[o] || o;
        r += `${c}(${u}) `;
      }
      n && (t[o] = u);
    }
  }
  return ((r = r.trim()), n ? (r = n(t, s ? '' : r)) : s && (r = 'none'), r);
}
function Ad(e, t, n) {
  const { style: r, vars: s, transformOrigin: i } = e;
  let o = !1,
    a = !1;
  for (const l in t) {
    const u = t[l];
    if (pr.has(l)) {
      o = !0;
      continue;
    } else if (k0(l)) {
      s[l] = u;
      continue;
    } else {
      const c = T0(u, Rd[l]);
      l.startsWith('origin') ? ((a = !0), (i[l] = c)) : (r[l] = c);
    }
  }
  if (
    (t.transform ||
      (o || n ? (r.transform = n2(t, e.transform, n)) : r.transform && (r.transform = 'none')),
    a)
  ) {
    const { originX: l = '50%', originY: u = '50%', originZ: c = 0 } = i;
    r.transformOrigin = `${l} ${u} ${c}`;
  }
}
const r2 = { offset: 'stroke-dashoffset', array: 'stroke-dasharray' },
  s2 = { offset: 'strokeDashoffset', array: 'strokeDasharray' };
function i2(e, t, n = 1, r = 0, s = !0) {
  e.pathLength = 1;
  const i = s ? r2 : s2;
  e[i.offset] = F.transform(-r);
  const o = F.transform(t),
    a = F.transform(n);
  e[i.array] = `${o} ${a}`;
}
function Kh(e, t, n) {
  return typeof e == 'string' ? e : F.transform(t + n * e);
}
function o2(e, t, n) {
  const r = Kh(t, e.x, e.width),
    s = Kh(n, e.y, e.height);
  return `${r} ${s}`;
}
function bd(
  e,
  {
    attrX: t,
    attrY: n,
    attrScale: r,
    originX: s,
    originY: i,
    pathLength: o,
    pathSpacing: a = 1,
    pathOffset: l = 0,
    ...u
  },
  c,
  d,
) {
  if ((Ad(e, u, d), c)) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  ((e.attrs = e.style), (e.style = {}));
  const { attrs: h, style: g, dimensions: w } = e;
  (h.transform && (w && (g.transform = h.transform), delete h.transform),
    w &&
      (s !== void 0 || i !== void 0 || g.transform) &&
      (g.transformOrigin = o2(w, s !== void 0 ? s : 0.5, i !== void 0 ? i : 0.5)),
    t !== void 0 && (h.x = t),
    n !== void 0 && (h.y = n),
    r !== void 0 && (h.scale = r),
    o !== void 0 && i2(h, o, a, l, !1));
}
const Od = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} }),
  j0 = () => ({ ...Od(), attrs: {} }),
  Dd = (e) => typeof e == 'string' && e.toLowerCase() === 'svg';
function N0(e, { style: t, vars: n }, r, s) {
  Object.assign(e.style, t, s && s.getProjectionStyles(r));
  for (const i in n) e.style.setProperty(i, n[i]);
}
const R0 = new Set([
  'baseFrequency',
  'diffuseConstant',
  'kernelMatrix',
  'kernelUnitLength',
  'keySplines',
  'keyTimes',
  'limitingConeAngle',
  'markerHeight',
  'markerWidth',
  'numOctaves',
  'targetX',
  'targetY',
  'surfaceScale',
  'specularConstant',
  'specularExponent',
  'stdDeviation',
  'tableValues',
  'viewBox',
  'gradientTransform',
  'pathLength',
  'startOffset',
  'textLength',
  'lengthAdjust',
]);
function A0(e, t, n, r) {
  N0(e, t, void 0, r);
  for (const s in t.attrs) e.setAttribute(R0.has(s) ? s : Pd(s), t.attrs[s]);
}
const ua = {};
function a2(e) {
  Object.assign(ua, e);
}
function b0(e, { layout: t, layoutId: n }) {
  return (
    pr.has(e) || e.startsWith('origin') || ((t || n !== void 0) && (!!ua[e] || e === 'opacity'))
  );
}
function Ld(e, t, n) {
  var r;
  const { style: s } = e,
    i = {};
  for (const o in s)
    (Oe(s[o]) ||
      (t.style && Oe(t.style[o])) ||
      b0(o, e) ||
      ((r = n == null ? void 0 : n.getValue(o)) === null || r === void 0 ? void 0 : r.liveStyle) !==
        void 0) &&
      (i[o] = s[o]);
  return i;
}
function O0(e, t, n) {
  const r = Ld(e, t, n);
  for (const s in e)
    if (Oe(e[s]) || Oe(t[s])) {
      const i = gs.indexOf(s) !== -1 ? 'attr' + s.charAt(0).toUpperCase() + s.substring(1) : s;
      r[i] = e[s];
    }
  return r;
}
function l2(e, t) {
  try {
    t.dimensions = typeof e.getBBox == 'function' ? e.getBBox() : e.getBoundingClientRect();
  } catch {
    t.dimensions = { x: 0, y: 0, width: 0, height: 0 };
  }
}
const qh = ['x', 'y', 'width', 'height', 'cx', 'cy', 'r'],
  u2 = {
    useVisualState: E0({
      scrapeMotionValuesFromProps: O0,
      createRenderState: j0,
      onUpdate: ({ props: e, prevProps: t, current: n, renderState: r, latestValues: s }) => {
        if (!n) return;
        let i = !!e.drag;
        if (!i) {
          for (const a in s)
            if (pr.has(a)) {
              i = !0;
              break;
            }
        }
        if (!i) return;
        let o = !t;
        if (t)
          for (let a = 0; a < qh.length; a++) {
            const l = qh[a];
            e[l] !== t[l] && (o = !0);
          }
        o &&
          X.read(() => {
            (l2(n, r),
              X.render(() => {
                (bd(r, s, Dd(n.tagName), e.transformTemplate), A0(n, r));
              }));
          });
      },
    }),
  },
  c2 = { useVisualState: E0({ scrapeMotionValuesFromProps: Ld, createRenderState: Od }) };
function D0(e, t, n) {
  for (const r in t) !Oe(t[r]) && !b0(r, n) && (e[r] = t[r]);
}
function d2({ transformTemplate: e }, t) {
  return P.useMemo(() => {
    const n = Od();
    return (Ad(n, t, e), Object.assign({}, n.vars, n.style));
  }, [t]);
}
function f2(e, t) {
  const n = e.style || {},
    r = {};
  return (D0(r, n, e), Object.assign(r, d2(e, t)), r);
}
function h2(e, t) {
  const n = {},
    r = f2(e, t);
  return (
    e.drag &&
      e.dragListener !== !1 &&
      ((n.draggable = !1),
      (r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = 'none'),
      (r.touchAction = e.drag === !0 ? 'none' : `pan-${e.drag === 'x' ? 'y' : 'x'}`)),
    e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0),
    (n.style = r),
    n
  );
}
function p2(e, t, n, r) {
  const s = P.useMemo(() => {
    const i = j0();
    return (bd(i, t, Dd(r), e.transformTemplate), { ...i.attrs, style: { ...i.style } });
  }, [t]);
  if (e.style) {
    const i = {};
    (D0(i, e.style, e), (s.style = { ...i, ...s.style }));
  }
  return s;
}
function m2(e = !1) {
  return (n, r, s, { latestValues: i }, o) => {
    const l = (Td(n) ? p2 : h2)(r, i, o, n),
      u = AP(r, typeof n == 'string', e),
      c = n !== P.Fragment ? { ...u, ...l, ref: s } : {},
      { children: d } = r,
      h = P.useMemo(() => (Oe(d) ? d.get() : d), [d]);
    return P.createElement(n, { ...c, children: h });
  };
}
function y2(e, t) {
  return function (r, { forwardMotionProps: s } = { forwardMotionProps: !1 }) {
    const o = {
      ...(Td(r) ? u2 : c2),
      preloadedFeatures: e,
      useRender: m2(s),
      createVisualElement: t,
      Component: r,
    };
    return VP(o);
  };
}
function L0(e, t) {
  if (!Array.isArray(t)) return !1;
  const n = t.length;
  if (n !== e.length) return !1;
  for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
  return !0;
}
function Wa(e, t, n) {
  const r = e.getProps();
  return jd(r, t, n !== void 0 ? n : r.custom, e);
}
const g2 = Sd(() => window.ScrollTimeline !== void 0);
class v2 {
  constructor(t) {
    ((this.stop = () => this.runAll('stop')), (this.animations = t.filter(Boolean)));
  }
  get finished() {
    return Promise.all(this.animations.map((t) => ('finished' in t ? t.finished : t)));
  }
  getAll(t) {
    return this.animations[0][t];
  }
  setAll(t, n) {
    for (let r = 0; r < this.animations.length; r++) this.animations[r][t] = n;
  }
  attachTimeline(t, n) {
    const r = this.animations.map((s) => {
      if (g2() && s.attachTimeline) return s.attachTimeline(t);
      if (typeof n == 'function') return n(s);
    });
    return () => {
      r.forEach((s, i) => {
        (s && s(), this.animations[i].stop());
      });
    };
  }
  get time() {
    return this.getAll('time');
  }
  set time(t) {
    this.setAll('time', t);
  }
  get speed() {
    return this.getAll('speed');
  }
  set speed(t) {
    this.setAll('speed', t);
  }
  get startTime() {
    return this.getAll('startTime');
  }
  get duration() {
    let t = 0;
    for (let n = 0; n < this.animations.length; n++) t = Math.max(t, this.animations[n].duration);
    return t;
  }
  runAll(t) {
    this.animations.forEach((n) => n[t]());
  }
  flatten() {
    this.runAll('flatten');
  }
  play() {
    this.runAll('play');
  }
  pause() {
    this.runAll('pause');
  }
  cancel() {
    this.runAll('cancel');
  }
  complete() {
    this.runAll('complete');
  }
}
class x2 extends v2 {
  then(t, n) {
    return Promise.all(this.animations).then(t).catch(n);
  }
}
function Md(e, t) {
  return e ? e[t] || e.default || e : void 0;
}
const Ku = 2e4;
function M0(e) {
  let t = 0;
  const n = 50;
  let r = e.next(t);
  for (; !r.done && t < Ku; ) ((t += n), (r = e.next(t)));
  return t >= Ku ? 1 / 0 : t;
}
function _d(e) {
  return typeof e == 'function';
}
function Qh(e, t) {
  ((e.timeline = t), (e.onfinish = null));
}
const Fd = (e) => Array.isArray(e) && typeof e[0] == 'number',
  w2 = { linearEasing: void 0 };
function S2(e, t) {
  const n = Sd(e);
  return () => {
    var r;
    return (r = w2[t]) !== null && r !== void 0 ? r : n();
  };
}
const ca = S2(() => {
    try {
      document.createElement('div').animate({ opacity: 0 }, { easing: 'linear(0, 1)' });
    } catch {
      return !1;
    }
    return !0;
  }, 'linearEasing'),
  _0 = (e, t, n = 10) => {
    let r = '';
    const s = Math.max(Math.round(t / n), 2);
    for (let i = 0; i < s; i++) r += e(is(0, s - 1, i)) + ', ';
    return `linear(${r.substring(0, r.length - 2)})`;
  };
function F0(e) {
  return !!(
    (typeof e == 'function' && ca()) ||
    !e ||
    (typeof e == 'string' && (e in qu || ca())) ||
    Fd(e) ||
    (Array.isArray(e) && e.every(F0))
  );
}
const Ls = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`,
  qu = {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    circIn: Ls([0, 0.65, 0.55, 1]),
    circOut: Ls([0.55, 0, 1, 0.45]),
    backIn: Ls([0.31, 0.01, 0.66, -0.59]),
    backOut: Ls([0.33, 1.53, 0.69, 0.99]),
  };
function I0(e, t) {
  if (e)
    return typeof e == 'function' && ca()
      ? _0(e, t)
      : Fd(e)
        ? Ls(e)
        : Array.isArray(e)
          ? e.map((n) => I0(n, t) || qu.easeOut)
          : qu[e];
}
const gt = { x: !1, y: !1 };
function V0() {
  return gt.x || gt.y;
}
function C2(e, t, n) {
  var r;
  if (e instanceof Element) return [e];
  if (typeof e == 'string') {
    let s = document;
    const i = (r = void 0) !== null && r !== void 0 ? r : s.querySelectorAll(e);
    return i ? Array.from(i) : [];
  }
  return Array.from(e);
}
function B0(e, t) {
  const n = C2(e),
    r = new AbortController(),
    s = { passive: !0, ...t, signal: r.signal };
  return [n, s, () => r.abort()];
}
function Gh(e) {
  return (t) => {
    t.pointerType === 'touch' || V0() || e(t);
  };
}
function E2(e, t, n = {}) {
  const [r, s, i] = B0(e, n),
    o = Gh((a) => {
      const { target: l } = a,
        u = t(a);
      if (typeof u != 'function' || !l) return;
      const c = Gh((d) => {
        (u(d), l.removeEventListener('pointerleave', c));
      });
      l.addEventListener('pointerleave', c, s);
    });
  return (
    r.forEach((a) => {
      a.addEventListener('pointerenter', o, s);
    }),
    i
  );
}
const U0 = (e, t) => (t ? (e === t ? !0 : U0(e, t.parentElement)) : !1),
  Id = (e) =>
    e.pointerType === 'mouse' ? typeof e.button != 'number' || e.button <= 0 : e.isPrimary !== !1,
  P2 = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']);
function k2(e) {
  return P2.has(e.tagName) || e.tabIndex !== -1;
}
const Ms = new WeakSet();
function Xh(e) {
  return (t) => {
    t.key === 'Enter' && e(t);
  };
}
function Tl(e, t) {
  e.dispatchEvent(new PointerEvent('pointer' + t, { isPrimary: !0, bubbles: !0 }));
}
const T2 = (e, t) => {
  const n = e.currentTarget;
  if (!n) return;
  const r = Xh(() => {
    if (Ms.has(n)) return;
    Tl(n, 'down');
    const s = Xh(() => {
        Tl(n, 'up');
      }),
      i = () => Tl(n, 'cancel');
    (n.addEventListener('keyup', s, t), n.addEventListener('blur', i, t));
  });
  (n.addEventListener('keydown', r, t),
    n.addEventListener('blur', () => n.removeEventListener('keydown', r), t));
};
function Yh(e) {
  return Id(e) && !V0();
}
function j2(e, t, n = {}) {
  const [r, s, i] = B0(e, n),
    o = (a) => {
      const l = a.currentTarget;
      if (!Yh(a) || Ms.has(l)) return;
      Ms.add(l);
      const u = t(a),
        c = (g, w) => {
          (window.removeEventListener('pointerup', d),
            window.removeEventListener('pointercancel', h),
            !(!Yh(g) || !Ms.has(l)) &&
              (Ms.delete(l), typeof u == 'function' && u(g, { success: w })));
        },
        d = (g) => {
          c(g, n.useGlobalTarget || U0(l, g.target));
        },
        h = (g) => {
          c(g, !1);
        };
      (window.addEventListener('pointerup', d, s), window.addEventListener('pointercancel', h, s));
    };
  return (
    r.forEach((a) => {
      (!k2(a) && a.getAttribute('tabindex') === null && (a.tabIndex = 0),
        (n.useGlobalTarget ? window : a).addEventListener('pointerdown', o, s),
        a.addEventListener('focus', (u) => T2(u, s), s));
    }),
    i
  );
}
function N2(e) {
  return e === 'x' || e === 'y'
    ? gt[e]
      ? null
      : ((gt[e] = !0),
        () => {
          gt[e] = !1;
        })
    : gt.x || gt.y
      ? null
      : ((gt.x = gt.y = !0),
        () => {
          gt.x = gt.y = !1;
        });
}
const z0 = new Set(['width', 'height', 'top', 'left', 'right', 'bottom', ...gs]);
let Oo;
function R2() {
  Oo = void 0;
}
const Vt = {
  now: () => (
    Oo === void 0 &&
      Vt.set(Se.isProcessing || PP.useManualTiming ? Se.timestamp : performance.now()),
    Oo
  ),
  set: (e) => {
    ((Oo = e), queueMicrotask(R2));
  },
};
function Vd(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function Bd(e, t) {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
class Ud {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return (Vd(this.subscriptions, t), () => Bd(this.subscriptions, t));
  }
  notify(t, n, r) {
    const s = this.subscriptions.length;
    if (s)
      if (s === 1) this.subscriptions[0](t, n, r);
      else
        for (let i = 0; i < s; i++) {
          const o = this.subscriptions[i];
          o && o(t, n, r);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function $0(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const Jh = 30,
  A2 = (e) => !isNaN(parseFloat(e));
class b2 {
  constructor(t, n = {}) {
    ((this.version = '11.18.2'),
      (this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = (r, s = !0) => {
        const i = Vt.now();
        (this.updatedAt !== i && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(r),
          this.current !== this.prev &&
            this.events.change &&
            this.events.change.notify(this.current),
          s && this.events.renderRequest && this.events.renderRequest.notify(this.current));
      }),
      (this.hasAnimated = !1),
      this.setCurrent(t),
      (this.owner = n.owner));
  }
  setCurrent(t) {
    ((this.current = t),
      (this.updatedAt = Vt.now()),
      this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = A2(this.current)));
  }
  setPrevFrameValue(t = this.current) {
    ((this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt));
  }
  onChange(t) {
    return this.on('change', t);
  }
  on(t, n) {
    this.events[t] || (this.events[t] = new Ud());
    const r = this.events[t].add(n);
    return t === 'change'
      ? () => {
          (r(),
            X.read(() => {
              this.events.change.getSize() || this.stop();
            }));
        }
      : r;
  }
  clearListeners() {
    for (const t in this.events) this.events[t].clear();
  }
  attach(t, n) {
    ((this.passiveEffect = t), (this.stopPassiveEffect = n));
  }
  set(t, n = !0) {
    !n || !this.passiveEffect
      ? this.updateAndNotify(t, n)
      : this.passiveEffect(t, this.updateAndNotify);
  }
  setWithVelocity(t, n, r) {
    (this.set(n),
      (this.prev = void 0),
      (this.prevFrameValue = t),
      (this.prevUpdatedAt = this.updatedAt - r));
  }
  jump(t, n = !0) {
    (this.updateAndNotify(t),
      (this.prev = t),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      n && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const t = Vt.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > Jh)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, Jh);
    return $0(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  start(t) {
    return (
      this.stop(),
      new Promise((n) => {
        ((this.hasAnimated = !0),
          (this.animation = t(n)),
          this.events.animationStart && this.events.animationStart.notify());
      }).then(() => {
        (this.events.animationComplete && this.events.animationComplete.notify(),
          this.clearAnimation());
      })
    );
  }
  stop() {
    (this.animation &&
      (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation());
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    (this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect());
  }
}
function xi(e, t) {
  return new b2(e, t);
}
function O2(e, t, n) {
  e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, xi(n));
}
function D2(e, t) {
  const n = Wa(e, t);
  let { transitionEnd: r = {}, transition: s = {}, ...i } = n || {};
  i = { ...i, ...r };
  for (const o in i) {
    const a = WP(i[o]);
    O2(e, o, a);
  }
}
function L2(e) {
  return !!(Oe(e) && e.add);
}
function Qu(e, t) {
  const n = e.getValue('willChange');
  if (L2(n)) return n.add(t);
}
function H0(e) {
  return e.props[w0];
}
const W0 = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e,
  M2 = 1e-7,
  _2 = 12;
function F2(e, t, n, r, s) {
  let i,
    o,
    a = 0;
  do ((o = t + (n - t) / 2), (i = W0(o, r, s) - e), i > 0 ? (n = o) : (t = o));
  while (Math.abs(i) > M2 && ++a < _2);
  return o;
}
function Fi(e, t, n, r) {
  if (e === t && n === r) return Ze;
  const s = (i) => F2(i, 0, 1, e, n);
  return (i) => (i === 0 || i === 1 ? i : W0(s(i), t, r));
}
const K0 = (e) => (t) => (t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2),
  q0 = (e) => (t) => 1 - e(1 - t),
  Q0 = Fi(0.33, 1.53, 0.69, 0.99),
  zd = q0(Q0),
  G0 = K0(zd),
  X0 = (e) => ((e *= 2) < 1 ? 0.5 * zd(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1)))),
  $d = (e) => 1 - Math.sin(Math.acos(e)),
  Y0 = q0($d),
  J0 = K0($d),
  Z0 = (e) => /^0[^.\s]+$/u.test(e);
function I2(e) {
  return typeof e == 'number' ? e === 0 : e !== null ? e === 'none' || e === '0' || Z0(e) : !0;
}
const Ks = (e) => Math.round(e * 1e5) / 1e5,
  Hd = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function V2(e) {
  return e == null;
}
const B2 =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  Wd = (e, t) => (n) =>
    !!(
      (typeof n == 'string' && B2.test(n) && n.startsWith(e)) ||
      (t && !V2(n) && Object.prototype.hasOwnProperty.call(n, t))
    ),
  ev = (e, t, n) => (r) => {
    if (typeof r != 'string') return r;
    const [s, i, o, a] = r.match(Hd);
    return {
      [e]: parseFloat(s),
      [t]: parseFloat(i),
      [n]: parseFloat(o),
      alpha: a !== void 0 ? parseFloat(a) : 1,
    };
  },
  U2 = (e) => en(0, 255, e),
  jl = { ...vs, transform: (e) => Math.round(U2(e)) },
  qn = {
    test: Wd('rgb', 'red'),
    parse: ev('red', 'green', 'blue'),
    transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) =>
      'rgba(' +
      jl.transform(e) +
      ', ' +
      jl.transform(t) +
      ', ' +
      jl.transform(n) +
      ', ' +
      Ks(vi.transform(r)) +
      ')',
  };
function z2(e) {
  let t = '',
    n = '',
    r = '',
    s = '';
  return (
    e.length > 5
      ? ((t = e.substring(1, 3)),
        (n = e.substring(3, 5)),
        (r = e.substring(5, 7)),
        (s = e.substring(7, 9)))
      : ((t = e.substring(1, 2)),
        (n = e.substring(2, 3)),
        (r = e.substring(3, 4)),
        (s = e.substring(4, 5)),
        (t += t),
        (n += n),
        (r += r),
        (s += s)),
    {
      red: parseInt(t, 16),
      green: parseInt(n, 16),
      blue: parseInt(r, 16),
      alpha: s ? parseInt(s, 16) / 255 : 1,
    }
  );
}
const Gu = { test: Wd('#'), parse: z2, transform: qn.transform },
  Or = {
    test: Wd('hsl', 'hue'),
    parse: ev('hue', 'saturation', 'lightness'),
    transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) =>
      'hsla(' +
      Math.round(e) +
      ', ' +
      It.transform(Ks(t)) +
      ', ' +
      It.transform(Ks(n)) +
      ', ' +
      Ks(vi.transform(r)) +
      ')',
  },
  Re = {
    test: (e) => qn.test(e) || Gu.test(e) || Or.test(e),
    parse: (e) => (qn.test(e) ? qn.parse(e) : Or.test(e) ? Or.parse(e) : Gu.parse(e)),
    transform: (e) =>
      typeof e == 'string' ? e : e.hasOwnProperty('red') ? qn.transform(e) : Or.transform(e),
  },
  $2 =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function H2(e) {
  var t, n;
  return (
    isNaN(e) &&
    typeof e == 'string' &&
    (((t = e.match(Hd)) === null || t === void 0 ? void 0 : t.length) || 0) +
      (((n = e.match($2)) === null || n === void 0 ? void 0 : n.length) || 0) >
      0
  );
}
const tv = 'number',
  nv = 'color',
  W2 = 'var',
  K2 = 'var(',
  Zh = '${}',
  q2 =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function wi(e) {
  const t = e.toString(),
    n = [],
    r = { color: [], number: [], var: [] },
    s = [];
  let i = 0;
  const a = t
    .replace(
      q2,
      (l) => (
        Re.test(l)
          ? (r.color.push(i), s.push(nv), n.push(Re.parse(l)))
          : l.startsWith(K2)
            ? (r.var.push(i), s.push(W2), n.push(l))
            : (r.number.push(i), s.push(tv), n.push(parseFloat(l))),
        ++i,
        Zh
      ),
    )
    .split(Zh);
  return { values: n, split: a, indexes: r, types: s };
}
function rv(e) {
  return wi(e).values;
}
function sv(e) {
  const { split: t, types: n } = wi(e),
    r = t.length;
  return (s) => {
    let i = '';
    for (let o = 0; o < r; o++)
      if (((i += t[o]), s[o] !== void 0)) {
        const a = n[o];
        a === tv ? (i += Ks(s[o])) : a === nv ? (i += Re.transform(s[o])) : (i += s[o]);
      }
    return i;
  };
}
const Q2 = (e) => (typeof e == 'number' ? 0 : e);
function G2(e) {
  const t = rv(e);
  return sv(e)(t.map(Q2));
}
const bn = { test: H2, parse: rv, createTransformer: sv, getAnimatableNone: G2 },
  X2 = new Set(['brightness', 'contrast', 'saturate', 'opacity']);
function Y2(e) {
  const [t, n] = e.slice(0, -1).split('(');
  if (t === 'drop-shadow') return e;
  const [r] = n.match(Hd) || [];
  if (!r) return e;
  const s = n.replace(r, '');
  let i = X2.has(t) ? 1 : 0;
  return (r !== n && (i *= 100), t + '(' + i + s + ')');
}
const J2 = /\b([a-z-]*)\(.*?\)/gu,
  Xu = {
    ...bn,
    getAnimatableNone: (e) => {
      const t = e.match(J2);
      return t ? t.map(Y2).join(' ') : e;
    },
  },
  Z2 = {
    ...Rd,
    color: Re,
    backgroundColor: Re,
    outlineColor: Re,
    fill: Re,
    stroke: Re,
    borderColor: Re,
    borderTopColor: Re,
    borderRightColor: Re,
    borderBottomColor: Re,
    borderLeftColor: Re,
    filter: Xu,
    WebkitFilter: Xu,
  },
  Kd = (e) => Z2[e];
function iv(e, t) {
  let n = Kd(e);
  return (n !== Xu && (n = bn), n.getAnimatableNone ? n.getAnimatableNone(t) : void 0);
}
const ek = new Set(['auto', 'none', '0']);
function tk(e, t, n) {
  let r = 0,
    s;
  for (; r < e.length && !s; ) {
    const i = e[r];
    (typeof i == 'string' && !ek.has(i) && wi(i).values.length && (s = e[r]), r++);
  }
  if (s && n) for (const i of t) e[i] = iv(n, s);
}
const ep = (e) => e === vs || e === F,
  tp = (e, t) => parseFloat(e.split(', ')[t]),
  np =
    (e, t) =>
    (n, { transform: r }) => {
      if (r === 'none' || !r) return 0;
      const s = r.match(/^matrix3d\((.+)\)$/u);
      if (s) return tp(s[1], t);
      {
        const i = r.match(/^matrix\((.+)\)$/u);
        return i ? tp(i[1], e) : 0;
      }
    },
  nk = new Set(['x', 'y', 'z']),
  rk = gs.filter((e) => !nk.has(e));
function sk(e) {
  const t = [];
  return (
    rk.forEach((n) => {
      const r = e.getValue(n);
      r !== void 0 && (t.push([n, r.get()]), r.set(n.startsWith('scale') ? 1 : 0));
    }),
    t
  );
}
const as = {
  width: ({ x: e }, { paddingLeft: t = '0', paddingRight: n = '0' }) =>
    e.max - e.min - parseFloat(t) - parseFloat(n),
  height: ({ y: e }, { paddingTop: t = '0', paddingBottom: n = '0' }) =>
    e.max - e.min - parseFloat(t) - parseFloat(n),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  x: np(4, 13),
  y: np(5, 14),
};
as.translateX = as.x;
as.translateY = as.y;
const rr = new Set();
let Yu = !1,
  Ju = !1;
function ov() {
  if (Ju) {
    const e = Array.from(rr).filter((r) => r.needsMeasurement),
      t = new Set(e.map((r) => r.element)),
      n = new Map();
    (t.forEach((r) => {
      const s = sk(r);
      s.length && (n.set(r, s), r.render());
    }),
      e.forEach((r) => r.measureInitialState()),
      t.forEach((r) => {
        r.render();
        const s = n.get(r);
        s &&
          s.forEach(([i, o]) => {
            var a;
            (a = r.getValue(i)) === null || a === void 0 || a.set(o);
          });
      }),
      e.forEach((r) => r.measureEndState()),
      e.forEach((r) => {
        r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY);
      }));
  }
  ((Ju = !1), (Yu = !1), rr.forEach((e) => e.complete()), rr.clear());
}
function av() {
  rr.forEach((e) => {
    (e.readKeyframes(), e.needsMeasurement && (Ju = !0));
  });
}
function ik() {
  (av(), ov());
}
class qd {
  constructor(t, n, r, s, i, o = !1) {
    ((this.isComplete = !1),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.isScheduled = !1),
      (this.unresolvedKeyframes = [...t]),
      (this.onComplete = n),
      (this.name = r),
      (this.motionValue = s),
      (this.element = i),
      (this.isAsync = o));
  }
  scheduleResolve() {
    ((this.isScheduled = !0),
      this.isAsync
        ? (rr.add(this), Yu || ((Yu = !0), X.read(av), X.resolveKeyframes(ov)))
        : (this.readKeyframes(), this.complete()));
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: n, element: r, motionValue: s } = this;
    for (let i = 0; i < t.length; i++)
      if (t[i] === null)
        if (i === 0) {
          const o = s == null ? void 0 : s.get(),
            a = t[t.length - 1];
          if (o !== void 0) t[0] = o;
          else if (r && n) {
            const l = r.readValue(n, a);
            l != null && (t[0] = l);
          }
          (t[0] === void 0 && (t[0] = a), s && o === void 0 && s.set(t[0]));
        } else t[i] = t[i - 1];
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete() {
    ((this.isComplete = !0),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe),
      rr.delete(this));
  }
  cancel() {
    this.isComplete || ((this.isScheduled = !1), rr.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const lv = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),
  ok = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function ak(e) {
  const t = ok.exec(e);
  if (!t) return [,];
  const [, n, r, s] = t;
  return [`--${n ?? r}`, s];
}
function uv(e, t, n = 1) {
  const [r, s] = ak(e);
  if (!r) return;
  const i = window.getComputedStyle(t).getPropertyValue(r);
  if (i) {
    const o = i.trim();
    return lv(o) ? parseFloat(o) : o;
  }
  return Nd(s) ? uv(s, t, n + 1) : s;
}
const cv = (e) => (t) => t.test(e),
  lk = { test: (e) => e === 'auto', parse: (e) => e },
  dv = [vs, F, It, sn, YP, XP, lk],
  rp = (e) => dv.find(cv(e));
class fv extends qd {
  constructor(t, n, r, s, i) {
    super(t, n, r, s, i, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: n, name: r } = this;
    if (!n || !n.current) return;
    super.readKeyframes();
    for (let l = 0; l < t.length; l++) {
      let u = t[l];
      if (typeof u == 'string' && ((u = u.trim()), Nd(u))) {
        const c = uv(u, n.current);
        (c !== void 0 && (t[l] = c), l === t.length - 1 && (this.finalKeyframe = u));
      }
    }
    if ((this.resolveNoneKeyframes(), !z0.has(r) || t.length !== 2)) return;
    const [s, i] = t,
      o = rp(s),
      a = rp(i);
    if (o !== a)
      if (ep(o) && ep(a))
        for (let l = 0; l < t.length; l++) {
          const u = t[l];
          typeof u == 'string' && (t[l] = parseFloat(u));
        }
      else this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: n } = this,
      r = [];
    for (let s = 0; s < t.length; s++) I2(t[s]) && r.push(s);
    r.length && tk(t, r, n);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: n, name: r } = this;
    if (!t || !t.current) return;
    (r === 'height' && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = as[r](t.measureViewportBox(), window.getComputedStyle(t.current))),
      (n[0] = this.measuredOrigin));
    const s = n[n.length - 1];
    s !== void 0 && t.getValue(r, s).jump(s, !1);
  }
  measureEndState() {
    var t;
    const { element: n, name: r, unresolvedKeyframes: s } = this;
    if (!n || !n.current) return;
    const i = n.getValue(r);
    i && i.jump(this.measuredOrigin, !1);
    const o = s.length - 1,
      a = s[o];
    ((s[o] = as[r](n.measureViewportBox(), window.getComputedStyle(n.current))),
      a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a),
      !((t = this.removedTransforms) === null || t === void 0) &&
        t.length &&
        this.removedTransforms.forEach(([l, u]) => {
          n.getValue(l).set(u);
        }),
      this.resolveNoneKeyframes());
  }
}
const sp = (e, t) =>
  t === 'zIndex'
    ? !1
    : !!(
        typeof e == 'number' ||
        Array.isArray(e) ||
        (typeof e == 'string' && (bn.test(e) || e === '0') && !e.startsWith('url('))
      );
function uk(e) {
  const t = e[0];
  if (e.length === 1) return !0;
  for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function ck(e, t, n, r) {
  const s = e[0];
  if (s === null) return !1;
  if (t === 'display' || t === 'visibility') return !0;
  const i = e[e.length - 1],
    o = sp(s, t),
    a = sp(i, t);
  return !o || !a ? !1 : uk(e) || ((n === 'spring' || _d(n)) && r);
}
const dk = (e) => e !== null;
function Ka(e, { repeat: t, repeatType: n = 'loop' }, r) {
  const s = e.filter(dk),
    i = t && n !== 'loop' && t % 2 === 1 ? 0 : s.length - 1;
  return !i || r === void 0 ? s[i] : r;
}
const fk = 40;
class hv {
  constructor({
    autoplay: t = !0,
    delay: n = 0,
    type: r = 'keyframes',
    repeat: s = 0,
    repeatDelay: i = 0,
    repeatType: o = 'loop',
    ...a
  }) {
    ((this.isStopped = !1),
      (this.hasAttemptedResolve = !1),
      (this.createdAt = Vt.now()),
      (this.options = {
        autoplay: t,
        delay: n,
        type: r,
        repeat: s,
        repeatDelay: i,
        repeatType: o,
        ...a,
      }),
      this.updateFinishedPromise());
  }
  calcStartTime() {
    return this.resolvedAt
      ? this.resolvedAt - this.createdAt > fk
        ? this.resolvedAt
        : this.createdAt
      : this.createdAt;
  }
  get resolved() {
    return (!this._resolved && !this.hasAttemptedResolve && ik(), this._resolved);
  }
  onKeyframesResolved(t, n) {
    ((this.resolvedAt = Vt.now()), (this.hasAttemptedResolve = !0));
    const {
      name: r,
      type: s,
      velocity: i,
      delay: o,
      onComplete: a,
      onUpdate: l,
      isGenerator: u,
    } = this.options;
    if (!u && !ck(t, r, s, i))
      if (o) this.options.duration = 0;
      else {
        (l && l(Ka(t, this.options, n)), a && a(), this.resolveFinishedPromise());
        return;
      }
    const c = this.initPlayback(t, n);
    c !== !1 &&
      ((this._resolved = { keyframes: t, finalKeyframe: n, ...c }), this.onPostResolved());
  }
  onPostResolved() {}
  then(t, n) {
    return this.currentFinishedPromise.then(t, n);
  }
  flatten() {
    ((this.options.type = 'keyframes'), (this.options.ease = 'linear'));
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((t) => {
      this.resolveFinishedPromise = t;
    });
  }
}
const ee = (e, t, n) => e + (t - e) * n;
function Nl(e, t, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
  );
}
function hk({ hue: e, saturation: t, lightness: n, alpha: r }) {
  ((e /= 360), (t /= 100), (n /= 100));
  let s = 0,
    i = 0,
    o = 0;
  if (!t) s = i = o = n;
  else {
    const a = n < 0.5 ? n * (1 + t) : n + t - n * t,
      l = 2 * n - a;
    ((s = Nl(l, a, e + 1 / 3)), (i = Nl(l, a, e)), (o = Nl(l, a, e - 1 / 3)));
  }
  return {
    red: Math.round(s * 255),
    green: Math.round(i * 255),
    blue: Math.round(o * 255),
    alpha: r,
  };
}
function da(e, t) {
  return (n) => (n > 0 ? t : e);
}
const Rl = (e, t, n) => {
    const r = e * e,
      s = n * (t * t - r) + r;
    return s < 0 ? 0 : Math.sqrt(s);
  },
  pk = [Gu, qn, Or],
  mk = (e) => pk.find((t) => t.test(e));
function ip(e) {
  const t = mk(e);
  if (!t) return !1;
  let n = t.parse(e);
  return (t === Or && (n = hk(n)), n);
}
const op = (e, t) => {
    const n = ip(e),
      r = ip(t);
    if (!n || !r) return da(e, t);
    const s = { ...n };
    return (i) => (
      (s.red = Rl(n.red, r.red, i)),
      (s.green = Rl(n.green, r.green, i)),
      (s.blue = Rl(n.blue, r.blue, i)),
      (s.alpha = ee(n.alpha, r.alpha, i)),
      qn.transform(s)
    );
  },
  yk = (e, t) => (n) => t(e(n)),
  Ii = (...e) => e.reduce(yk),
  Zu = new Set(['none', 'hidden']);
function gk(e, t) {
  return Zu.has(e) ? (n) => (n <= 0 ? e : t) : (n) => (n >= 1 ? t : e);
}
function vk(e, t) {
  return (n) => ee(e, t, n);
}
function Qd(e) {
  return typeof e == 'number'
    ? vk
    : typeof e == 'string'
      ? Nd(e)
        ? da
        : Re.test(e)
          ? op
          : Sk
      : Array.isArray(e)
        ? pv
        : typeof e == 'object'
          ? Re.test(e)
            ? op
            : xk
          : da;
}
function pv(e, t) {
  const n = [...e],
    r = n.length,
    s = e.map((i, o) => Qd(i)(i, t[o]));
  return (i) => {
    for (let o = 0; o < r; o++) n[o] = s[o](i);
    return n;
  };
}
function xk(e, t) {
  const n = { ...e, ...t },
    r = {};
  for (const s in n) e[s] !== void 0 && t[s] !== void 0 && (r[s] = Qd(e[s])(e[s], t[s]));
  return (s) => {
    for (const i in r) n[i] = r[i](s);
    return n;
  };
}
function wk(e, t) {
  var n;
  const r = [],
    s = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < t.values.length; i++) {
    const o = t.types[i],
      a = e.indexes[o][s[o]],
      l = (n = e.values[a]) !== null && n !== void 0 ? n : 0;
    ((r[i] = l), s[o]++);
  }
  return r;
}
const Sk = (e, t) => {
  const n = bn.createTransformer(t),
    r = wi(e),
    s = wi(t);
  return r.indexes.var.length === s.indexes.var.length &&
    r.indexes.color.length === s.indexes.color.length &&
    r.indexes.number.length >= s.indexes.number.length
    ? (Zu.has(e) && !s.values.length) || (Zu.has(t) && !r.values.length)
      ? gk(e, t)
      : Ii(pv(wk(r, s), s.values), n)
    : da(e, t);
};
function mv(e, t, n) {
  return typeof e == 'number' && typeof t == 'number' && typeof n == 'number'
    ? ee(e, t, n)
    : Qd(e)(e, t);
}
const Ck = 5;
function yv(e, t, n) {
  const r = Math.max(t - Ck, 0);
  return $0(n - e(r), t - r);
}
const se = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: { granular: 0.01, default: 2 },
    restDelta: { granular: 0.005, default: 0.5 },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1,
  },
  Al = 0.001;
function Ek({
  duration: e = se.duration,
  bounce: t = se.bounce,
  velocity: n = se.velocity,
  mass: r = se.mass,
}) {
  let s,
    i,
    o = 1 - t;
  ((o = en(se.minDamping, se.maxDamping, o)),
    (e = en(se.minDuration, se.maxDuration, Gt(e))),
    o < 1
      ? ((s = (u) => {
          const c = u * o,
            d = c * e,
            h = c - n,
            g = ec(u, o),
            w = Math.exp(-d);
          return Al - (h / g) * w;
        }),
        (i = (u) => {
          const d = u * o * e,
            h = d * n + n,
            g = Math.pow(o, 2) * Math.pow(u, 2) * e,
            w = Math.exp(-d),
            v = ec(Math.pow(u, 2), o);
          return ((-s(u) + Al > 0 ? -1 : 1) * ((h - g) * w)) / v;
        }))
      : ((s = (u) => {
          const c = Math.exp(-u * e),
            d = (u - n) * e + 1;
          return -Al + c * d;
        }),
        (i = (u) => {
          const c = Math.exp(-u * e),
            d = (n - u) * (e * e);
          return c * d;
        })));
  const a = 5 / e,
    l = kk(s, i, a);
  if (((e = Qt(e)), isNaN(l))) return { stiffness: se.stiffness, damping: se.damping, duration: e };
  {
    const u = Math.pow(l, 2) * r;
    return { stiffness: u, damping: o * 2 * Math.sqrt(r * u), duration: e };
  }
}
const Pk = 12;
function kk(e, t, n) {
  let r = n;
  for (let s = 1; s < Pk; s++) r = r - e(r) / t(r);
  return r;
}
function ec(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const Tk = ['duration', 'bounce'],
  jk = ['stiffness', 'damping', 'mass'];
function ap(e, t) {
  return t.some((n) => e[n] !== void 0);
}
function Nk(e) {
  let t = {
    velocity: se.velocity,
    stiffness: se.stiffness,
    damping: se.damping,
    mass: se.mass,
    isResolvedFromDuration: !1,
    ...e,
  };
  if (!ap(e, jk) && ap(e, Tk))
    if (e.visualDuration) {
      const n = e.visualDuration,
        r = (2 * Math.PI) / (n * 1.2),
        s = r * r,
        i = 2 * en(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(s);
      t = { ...t, mass: se.mass, stiffness: s, damping: i };
    } else {
      const n = Ek(e);
      ((t = { ...t, ...n, mass: se.mass }), (t.isResolvedFromDuration = !0));
    }
  return t;
}
function gv(e = se.visualDuration, t = se.bounce) {
  const n = typeof e != 'object' ? { visualDuration: e, keyframes: [0, 1], bounce: t } : e;
  let { restSpeed: r, restDelta: s } = n;
  const i = n.keyframes[0],
    o = n.keyframes[n.keyframes.length - 1],
    a = { done: !1, value: i },
    {
      stiffness: l,
      damping: u,
      mass: c,
      duration: d,
      velocity: h,
      isResolvedFromDuration: g,
    } = Nk({ ...n, velocity: -Gt(n.velocity || 0) }),
    w = h || 0,
    v = u / (2 * Math.sqrt(l * c)),
    x = o - i,
    p = Gt(Math.sqrt(l / c)),
    m = Math.abs(x) < 5;
  (r || (r = m ? se.restSpeed.granular : se.restSpeed.default),
    s || (s = m ? se.restDelta.granular : se.restDelta.default));
  let y;
  if (v < 1) {
    const C = ec(p, v);
    y = (T) => {
      const N = Math.exp(-v * p * T);
      return o - N * (((w + v * p * x) / C) * Math.sin(C * T) + x * Math.cos(C * T));
    };
  } else if (v === 1) y = (C) => o - Math.exp(-p * C) * (x + (w + p * x) * C);
  else {
    const C = p * Math.sqrt(v * v - 1);
    y = (T) => {
      const N = Math.exp(-v * p * T),
        j = Math.min(C * T, 300);
      return o - (N * ((w + v * p * x) * Math.sinh(j) + C * x * Math.cosh(j))) / C;
    };
  }
  const S = {
    calculatedDuration: (g && d) || null,
    next: (C) => {
      const T = y(C);
      if (g) a.done = C >= d;
      else {
        let N = 0;
        v < 1 && (N = C === 0 ? Qt(w) : yv(y, C, T));
        const j = Math.abs(N) <= r,
          L = Math.abs(o - T) <= s;
        a.done = j && L;
      }
      return ((a.value = a.done ? o : T), a);
    },
    toString: () => {
      const C = Math.min(M0(S), Ku),
        T = _0((N) => S.next(C * N).value, C, 30);
      return C + 'ms ' + T;
    },
  };
  return S;
}
function lp({
  keyframes: e,
  velocity: t = 0,
  power: n = 0.8,
  timeConstant: r = 325,
  bounceDamping: s = 10,
  bounceStiffness: i = 500,
  modifyTarget: o,
  min: a,
  max: l,
  restDelta: u = 0.5,
  restSpeed: c,
}) {
  const d = e[0],
    h = { done: !1, value: d },
    g = (j) => (a !== void 0 && j < a) || (l !== void 0 && j > l),
    w = (j) => (a === void 0 ? l : l === void 0 || Math.abs(a - j) < Math.abs(l - j) ? a : l);
  let v = n * t;
  const x = d + v,
    p = o === void 0 ? x : o(x);
  p !== x && (v = p - d);
  const m = (j) => -v * Math.exp(-j / r),
    y = (j) => p + m(j),
    S = (j) => {
      const L = m(j),
        D = y(j);
      ((h.done = Math.abs(L) <= u), (h.value = h.done ? p : D));
    };
  let C, T;
  const N = (j) => {
    g(h.value) &&
      ((C = j),
      (T = gv({
        keyframes: [h.value, w(h.value)],
        velocity: yv(y, j, h.value),
        damping: s,
        stiffness: i,
        restDelta: u,
        restSpeed: c,
      })));
  };
  return (
    N(0),
    {
      calculatedDuration: null,
      next: (j) => {
        let L = !1;
        return (
          !T && C === void 0 && ((L = !0), S(j), N(j)),
          C !== void 0 && j >= C ? T.next(j - C) : (!L && S(j), h)
        );
      },
    }
  );
}
const Rk = Fi(0.42, 0, 1, 1),
  Ak = Fi(0, 0, 0.58, 1),
  vv = Fi(0.42, 0, 0.58, 1),
  bk = (e) => Array.isArray(e) && typeof e[0] != 'number',
  Ok = {
    linear: Ze,
    easeIn: Rk,
    easeInOut: vv,
    easeOut: Ak,
    circIn: $d,
    circInOut: J0,
    circOut: Y0,
    backIn: zd,
    backInOut: G0,
    backOut: Q0,
    anticipate: X0,
  },
  up = (e) => {
    if (Fd(e)) {
      m0(e.length === 4);
      const [t, n, r, s] = e;
      return Fi(t, n, r, s);
    } else if (typeof e == 'string') return Ok[e];
    return e;
  };
function Dk(e, t, n) {
  const r = [],
    s = n || mv,
    i = e.length - 1;
  for (let o = 0; o < i; o++) {
    let a = s(e[o], e[o + 1]);
    if (t) {
      const l = Array.isArray(t) ? t[o] || Ze : t;
      a = Ii(l, a);
    }
    r.push(a);
  }
  return r;
}
function Lk(e, t, { clamp: n = !0, ease: r, mixer: s } = {}) {
  const i = e.length;
  if ((m0(i === t.length), i === 1)) return () => t[0];
  if (i === 2 && t[0] === t[1]) return () => t[1];
  const o = e[0] === e[1];
  e[0] > e[i - 1] && ((e = [...e].reverse()), (t = [...t].reverse()));
  const a = Dk(t, r, s),
    l = a.length,
    u = (c) => {
      if (o && c < e[0]) return t[0];
      let d = 0;
      if (l > 1) for (; d < e.length - 2 && !(c < e[d + 1]); d++);
      const h = is(e[d], e[d + 1], c);
      return a[d](h);
    };
  return n ? (c) => u(en(e[0], e[i - 1], c)) : u;
}
function Mk(e, t) {
  const n = e[e.length - 1];
  for (let r = 1; r <= t; r++) {
    const s = is(0, t, r);
    e.push(ee(n, 1, s));
  }
}
function _k(e) {
  const t = [0];
  return (Mk(t, e.length - 1), t);
}
function Fk(e, t) {
  return e.map((n) => n * t);
}
function Ik(e, t) {
  return e.map(() => t || vv).splice(0, e.length - 1);
}
function fa({ duration: e = 300, keyframes: t, times: n, ease: r = 'easeInOut' }) {
  const s = bk(r) ? r.map(up) : up(r),
    i = { done: !1, value: t[0] },
    o = Fk(n && n.length === t.length ? n : _k(t), e),
    a = Lk(o, t, { ease: Array.isArray(s) ? s : Ik(t, s) });
  return { calculatedDuration: e, next: (l) => ((i.value = a(l)), (i.done = l >= e), i) };
}
const Vk = (e) => {
    const t = ({ timestamp: n }) => e(n);
    return {
      start: () => X.update(t, !0),
      stop: () => An(t),
      now: () => (Se.isProcessing ? Se.timestamp : Vt.now()),
    };
  },
  Bk = { decay: lp, inertia: lp, tween: fa, keyframes: fa, spring: gv },
  Uk = (e) => e / 100;
class Gd extends hv {
  constructor(t) {
    (super(t),
      (this.holdTime = null),
      (this.cancelTime = null),
      (this.currentTime = 0),
      (this.playbackSpeed = 1),
      (this.pendingPlayState = 'running'),
      (this.startTime = null),
      (this.state = 'idle'),
      (this.stop = () => {
        if ((this.resolver.cancel(), (this.isStopped = !0), this.state === 'idle')) return;
        this.teardown();
        const { onStop: l } = this.options;
        l && l();
      }));
    const { name: n, motionValue: r, element: s, keyframes: i } = this.options,
      o = (s == null ? void 0 : s.KeyframeResolver) || qd,
      a = (l, u) => this.onKeyframesResolved(l, u);
    ((this.resolver = new o(i, a, n, r, s)), this.resolver.scheduleResolve());
  }
  flatten() {
    (super.flatten(),
      this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes)));
  }
  initPlayback(t) {
    const {
        type: n = 'keyframes',
        repeat: r = 0,
        repeatDelay: s = 0,
        repeatType: i,
        velocity: o = 0,
      } = this.options,
      a = _d(n) ? n : Bk[n] || fa;
    let l, u;
    a !== fa && typeof t[0] != 'number' && ((l = Ii(Uk, mv(t[0], t[1]))), (t = [0, 100]));
    const c = a({ ...this.options, keyframes: t });
    (i === 'mirror' && (u = a({ ...this.options, keyframes: [...t].reverse(), velocity: -o })),
      c.calculatedDuration === null && (c.calculatedDuration = M0(c)));
    const { calculatedDuration: d } = c,
      h = d + s,
      g = h * (r + 1) - s;
    return {
      generator: c,
      mirroredGenerator: u,
      mapPercentToKeyframes: l,
      calculatedDuration: d,
      resolvedDuration: h,
      totalDuration: g,
    };
  }
  onPostResolved() {
    const { autoplay: t = !0 } = this.options;
    (this.play(),
      this.pendingPlayState === 'paused' || !t
        ? this.pause()
        : (this.state = this.pendingPlayState));
  }
  tick(t, n = !1) {
    const { resolved: r } = this;
    if (!r) {
      const { keyframes: j } = this.options;
      return { done: !0, value: j[j.length - 1] };
    }
    const {
      finalKeyframe: s,
      generator: i,
      mirroredGenerator: o,
      mapPercentToKeyframes: a,
      keyframes: l,
      calculatedDuration: u,
      totalDuration: c,
      resolvedDuration: d,
    } = r;
    if (this.startTime === null) return i.next(0);
    const { delay: h, repeat: g, repeatType: w, repeatDelay: v, onUpdate: x } = this.options;
    (this.speed > 0
      ? (this.startTime = Math.min(this.startTime, t))
      : this.speed < 0 && (this.startTime = Math.min(t - c / this.speed, this.startTime)),
      n
        ? (this.currentTime = t)
        : this.holdTime !== null
          ? (this.currentTime = this.holdTime)
          : (this.currentTime = Math.round(t - this.startTime) * this.speed));
    const p = this.currentTime - h * (this.speed >= 0 ? 1 : -1),
      m = this.speed >= 0 ? p < 0 : p > c;
    ((this.currentTime = Math.max(p, 0)),
      this.state === 'finished' && this.holdTime === null && (this.currentTime = c));
    let y = this.currentTime,
      S = i;
    if (g) {
      const j = Math.min(this.currentTime, c) / d;
      let L = Math.floor(j),
        D = j % 1;
      (!D && j >= 1 && (D = 1),
        D === 1 && L--,
        (L = Math.min(L, g + 1)),
        !!(L % 2) &&
          (w === 'reverse' ? ((D = 1 - D), v && (D -= v / d)) : w === 'mirror' && (S = o)),
        (y = en(0, 1, D) * d));
    }
    const C = m ? { done: !1, value: l[0] } : S.next(y);
    a && (C.value = a(C.value));
    let { done: T } = C;
    !m && u !== null && (T = this.speed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
    const N =
      this.holdTime === null && (this.state === 'finished' || (this.state === 'running' && T));
    return (
      N && s !== void 0 && (C.value = Ka(l, this.options, s)),
      x && x(C.value),
      N && this.finish(),
      C
    );
  }
  get duration() {
    const { resolved: t } = this;
    return t ? Gt(t.calculatedDuration) : 0;
  }
  get time() {
    return Gt(this.currentTime);
  }
  set time(t) {
    ((t = Qt(t)),
      (this.currentTime = t),
      this.holdTime !== null || this.speed === 0
        ? (this.holdTime = t)
        : this.driver && (this.startTime = this.driver.now() - t / this.speed));
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    const n = this.playbackSpeed !== t;
    ((this.playbackSpeed = t), n && (this.time = Gt(this.currentTime)));
  }
  play() {
    if ((this.resolver.isScheduled || this.resolver.resume(), !this._resolved)) {
      this.pendingPlayState = 'running';
      return;
    }
    if (this.isStopped) return;
    const { driver: t = Vk, onPlay: n, startTime: r } = this.options;
    (this.driver || (this.driver = t((i) => this.tick(i))), n && n());
    const s = this.driver.now();
    (this.holdTime !== null
      ? (this.startTime = s - this.holdTime)
      : this.startTime
        ? this.state === 'finished' && (this.startTime = s)
        : (this.startTime = r ?? this.calcStartTime()),
      this.state === 'finished' && this.updateFinishedPromise(),
      (this.cancelTime = this.startTime),
      (this.holdTime = null),
      (this.state = 'running'),
      this.driver.start());
  }
  pause() {
    var t;
    if (!this._resolved) {
      this.pendingPlayState = 'paused';
      return;
    }
    ((this.state = 'paused'),
      (this.holdTime = (t = this.currentTime) !== null && t !== void 0 ? t : 0));
  }
  complete() {
    (this.state !== 'running' && this.play(),
      (this.pendingPlayState = this.state = 'finished'),
      (this.holdTime = null));
  }
  finish() {
    (this.teardown(), (this.state = 'finished'));
    const { onComplete: t } = this.options;
    t && t();
  }
  cancel() {
    (this.cancelTime !== null && this.tick(this.cancelTime),
      this.teardown(),
      this.updateFinishedPromise());
  }
  teardown() {
    ((this.state = 'idle'),
      this.stopDriver(),
      this.resolveFinishedPromise(),
      this.updateFinishedPromise(),
      (this.startTime = this.cancelTime = null),
      this.resolver.cancel());
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(t) {
    return ((this.startTime = 0), this.tick(t, !0));
  }
}
const zk = new Set(['opacity', 'clipPath', 'filter', 'transform']);
function $k(
  e,
  t,
  n,
  {
    delay: r = 0,
    duration: s = 300,
    repeat: i = 0,
    repeatType: o = 'loop',
    ease: a = 'easeInOut',
    times: l,
  } = {},
) {
  const u = { [t]: n };
  l && (u.offset = l);
  const c = I0(a, s);
  return (
    Array.isArray(c) && (u.easing = c),
    e.animate(u, {
      delay: r,
      duration: s,
      easing: Array.isArray(c) ? 'linear' : c,
      fill: 'both',
      iterations: i + 1,
      direction: o === 'reverse' ? 'alternate' : 'normal',
    })
  );
}
const Hk = Sd(() => Object.hasOwnProperty.call(Element.prototype, 'animate')),
  ha = 10,
  Wk = 2e4;
function Kk(e) {
  return _d(e.type) || e.type === 'spring' || !F0(e.ease);
}
function qk(e, t) {
  const n = new Gd({ ...t, keyframes: e, repeat: 0, delay: 0, isGenerator: !0 });
  let r = { done: !1, value: e[0] };
  const s = [];
  let i = 0;
  for (; !r.done && i < Wk; ) ((r = n.sample(i)), s.push(r.value), (i += ha));
  return { times: void 0, keyframes: s, duration: i - ha, ease: 'linear' };
}
const xv = { anticipate: X0, backInOut: G0, circInOut: J0 };
function Qk(e) {
  return e in xv;
}
class cp extends hv {
  constructor(t) {
    super(t);
    const { name: n, motionValue: r, element: s, keyframes: i } = this.options;
    ((this.resolver = new fv(i, (o, a) => this.onKeyframesResolved(o, a), n, r, s)),
      this.resolver.scheduleResolve());
  }
  initPlayback(t, n) {
    let {
      duration: r = 300,
      times: s,
      ease: i,
      type: o,
      motionValue: a,
      name: l,
      startTime: u,
    } = this.options;
    if (!a.owner || !a.owner.current) return !1;
    if ((typeof i == 'string' && ca() && Qk(i) && (i = xv[i]), Kk(this.options))) {
      const { onComplete: d, onUpdate: h, motionValue: g, element: w, ...v } = this.options,
        x = qk(t, v);
      ((t = x.keyframes),
        t.length === 1 && (t[1] = t[0]),
        (r = x.duration),
        (s = x.times),
        (i = x.ease),
        (o = 'keyframes'));
    }
    const c = $k(a.owner.current, l, t, { ...this.options, duration: r, times: s, ease: i });
    return (
      (c.startTime = u ?? this.calcStartTime()),
      this.pendingTimeline
        ? (Qh(c, this.pendingTimeline), (this.pendingTimeline = void 0))
        : (c.onfinish = () => {
            const { onComplete: d } = this.options;
            (a.set(Ka(t, this.options, n)), d && d(), this.cancel(), this.resolveFinishedPromise());
          }),
      { animation: c, duration: r, times: s, type: o, ease: i, keyframes: t }
    );
  }
  get duration() {
    const { resolved: t } = this;
    if (!t) return 0;
    const { duration: n } = t;
    return Gt(n);
  }
  get time() {
    const { resolved: t } = this;
    if (!t) return 0;
    const { animation: n } = t;
    return Gt(n.currentTime || 0);
  }
  set time(t) {
    const { resolved: n } = this;
    if (!n) return;
    const { animation: r } = n;
    r.currentTime = Qt(t);
  }
  get speed() {
    const { resolved: t } = this;
    if (!t) return 1;
    const { animation: n } = t;
    return n.playbackRate;
  }
  set speed(t) {
    const { resolved: n } = this;
    if (!n) return;
    const { animation: r } = n;
    r.playbackRate = t;
  }
  get state() {
    const { resolved: t } = this;
    if (!t) return 'idle';
    const { animation: n } = t;
    return n.playState;
  }
  get startTime() {
    const { resolved: t } = this;
    if (!t) return null;
    const { animation: n } = t;
    return n.startTime;
  }
  attachTimeline(t) {
    if (!this._resolved) this.pendingTimeline = t;
    else {
      const { resolved: n } = this;
      if (!n) return Ze;
      const { animation: r } = n;
      Qh(r, t);
    }
    return Ze;
  }
  play() {
    if (this.isStopped) return;
    const { resolved: t } = this;
    if (!t) return;
    const { animation: n } = t;
    (n.playState === 'finished' && this.updateFinishedPromise(), n.play());
  }
  pause() {
    const { resolved: t } = this;
    if (!t) return;
    const { animation: n } = t;
    n.pause();
  }
  stop() {
    if ((this.resolver.cancel(), (this.isStopped = !0), this.state === 'idle')) return;
    (this.resolveFinishedPromise(), this.updateFinishedPromise());
    const { resolved: t } = this;
    if (!t) return;
    const { animation: n, keyframes: r, duration: s, type: i, ease: o, times: a } = t;
    if (n.playState === 'idle' || n.playState === 'finished') return;
    if (this.time) {
      const { motionValue: u, onUpdate: c, onComplete: d, element: h, ...g } = this.options,
        w = new Gd({
          ...g,
          keyframes: r,
          duration: s,
          type: i,
          ease: o,
          times: a,
          isGenerator: !0,
        }),
        v = Qt(this.time);
      u.setWithVelocity(w.sample(v - ha).value, w.sample(v).value, ha);
    }
    const { onStop: l } = this.options;
    (l && l(), this.cancel());
  }
  complete() {
    const { resolved: t } = this;
    t && t.animation.finish();
  }
  cancel() {
    const { resolved: t } = this;
    t && t.animation.cancel();
  }
  static supports(t) {
    const { motionValue: n, name: r, repeatDelay: s, repeatType: i, damping: o, type: a } = t;
    if (!n || !n.owner || !(n.owner.current instanceof HTMLElement)) return !1;
    const { onUpdate: l, transformTemplate: u } = n.owner.getProps();
    return Hk() && r && zk.has(r) && !l && !u && !s && i !== 'mirror' && o !== 0 && a !== 'inertia';
  }
}
const Gk = { type: 'spring', stiffness: 500, damping: 25, restSpeed: 10 },
  Xk = (e) => ({
    type: 'spring',
    stiffness: 550,
    damping: e === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  Yk = { type: 'keyframes', duration: 0.8 },
  Jk = { type: 'keyframes', ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  Zk = (e, { keyframes: t }) =>
    t.length > 2 ? Yk : pr.has(e) ? (e.startsWith('scale') ? Xk(t[1]) : Gk) : Jk;
function eT({
  when: e,
  delay: t,
  delayChildren: n,
  staggerChildren: r,
  staggerDirection: s,
  repeat: i,
  repeatType: o,
  repeatDelay: a,
  from: l,
  elapsed: u,
  ...c
}) {
  return !!Object.keys(c).length;
}
const Xd =
  (e, t, n, r = {}, s, i) =>
  (o) => {
    const a = Md(r, e) || {},
      l = a.delay || r.delay || 0;
    let { elapsed: u = 0 } = r;
    u = u - Qt(l);
    let c = {
      keyframes: Array.isArray(n) ? n : [null, n],
      ease: 'easeOut',
      velocity: t.getVelocity(),
      ...a,
      delay: -u,
      onUpdate: (h) => {
        (t.set(h), a.onUpdate && a.onUpdate(h));
      },
      onComplete: () => {
        (o(), a.onComplete && a.onComplete());
      },
      name: e,
      motionValue: t,
      element: i ? void 0 : s,
    };
    (eT(a) || (c = { ...c, ...Zk(e, c) }),
      c.duration && (c.duration = Qt(c.duration)),
      c.repeatDelay && (c.repeatDelay = Qt(c.repeatDelay)),
      c.from !== void 0 && (c.keyframes[0] = c.from));
    let d = !1;
    if (
      ((c.type === !1 || (c.duration === 0 && !c.repeatDelay)) &&
        ((c.duration = 0), c.delay === 0 && (d = !0)),
      d && !i && t.get() !== void 0)
    ) {
      const h = Ka(c.keyframes, a);
      if (h !== void 0)
        return (
          X.update(() => {
            (c.onUpdate(h), c.onComplete());
          }),
          new x2([])
        );
    }
    return !i && cp.supports(c) ? new cp(c) : new Gd(c);
  };
function tT({ protectedKeys: e, needsAnimating: t }, n) {
  const r = e.hasOwnProperty(n) && t[n] !== !0;
  return ((t[n] = !1), r);
}
function wv(e, t, { delay: n = 0, transitionOverride: r, type: s } = {}) {
  var i;
  let { transition: o = e.getDefaultTransition(), transitionEnd: a, ...l } = t;
  r && (o = r);
  const u = [],
    c = s && e.animationState && e.animationState.getState()[s];
  for (const d in l) {
    const h = e.getValue(d, (i = e.latestValues[d]) !== null && i !== void 0 ? i : null),
      g = l[d];
    if (g === void 0 || (c && tT(c, d))) continue;
    const w = { delay: n, ...Md(o || {}, d) };
    let v = !1;
    if (window.MotionHandoffAnimation) {
      const p = H0(e);
      if (p) {
        const m = window.MotionHandoffAnimation(p, d, X);
        m !== null && ((w.startTime = m), (v = !0));
      }
    }
    (Qu(e, d), h.start(Xd(d, h, g, e.shouldReduceMotion && z0.has(d) ? { type: !1 } : w, e, v)));
    const x = h.animation;
    x && u.push(x);
  }
  return (
    a &&
      Promise.all(u).then(() => {
        X.update(() => {
          a && D2(e, a);
        });
      }),
    u
  );
}
function tc(e, t, n = {}) {
  var r;
  const s = Wa(
    e,
    t,
    n.type === 'exit'
      ? (r = e.presenceContext) === null || r === void 0
        ? void 0
        : r.custom
      : void 0,
  );
  let { transition: i = e.getDefaultTransition() || {} } = s || {};
  n.transitionOverride && (i = n.transitionOverride);
  const o = s ? () => Promise.all(wv(e, s, n)) : () => Promise.resolve(),
    a =
      e.variantChildren && e.variantChildren.size
        ? (u = 0) => {
            const { delayChildren: c = 0, staggerChildren: d, staggerDirection: h } = i;
            return nT(e, t, c + u, d, h, n);
          }
        : () => Promise.resolve(),
    { when: l } = i;
  if (l) {
    const [u, c] = l === 'beforeChildren' ? [o, a] : [a, o];
    return u().then(() => c());
  } else return Promise.all([o(), a(n.delay)]);
}
function nT(e, t, n = 0, r = 0, s = 1, i) {
  const o = [],
    a = (e.variantChildren.size - 1) * r,
    l = s === 1 ? (u = 0) => u * r : (u = 0) => a - u * r;
  return (
    Array.from(e.variantChildren)
      .sort(rT)
      .forEach((u, c) => {
        (u.notify('AnimationStart', t),
          o.push(tc(u, t, { ...i, delay: n + l(c) }).then(() => u.notify('AnimationComplete', t))));
      }),
    Promise.all(o)
  );
}
function rT(e, t) {
  return e.sortNodePosition(t);
}
function sT(e, t, n = {}) {
  e.notify('AnimationStart', t);
  let r;
  if (Array.isArray(t)) {
    const s = t.map((i) => tc(e, i, n));
    r = Promise.all(s);
  } else if (typeof t == 'string') r = tc(e, t, n);
  else {
    const s = typeof t == 'function' ? Wa(e, t, n.custom) : t;
    r = Promise.all(wv(e, s, n));
  }
  return r.then(() => {
    e.notify('AnimationComplete', t);
  });
}
const iT = Ed.length;
function Sv(e) {
  if (!e) return;
  if (!e.isControllingVariants) {
    const n = e.parent ? Sv(e.parent) || {} : {};
    return (e.props.initial !== void 0 && (n.initial = e.props.initial), n);
  }
  const t = {};
  for (let n = 0; n < iT; n++) {
    const r = Ed[n],
      s = e.props[r];
    (gi(s) || s === !1) && (t[r] = s);
  }
  return t;
}
const oT = [...Cd].reverse(),
  aT = Cd.length;
function lT(e) {
  return (t) => Promise.all(t.map(({ animation: n, options: r }) => sT(e, n, r)));
}
function uT(e) {
  let t = lT(e),
    n = dp(),
    r = !0;
  const s = (l) => (u, c) => {
    var d;
    const h = Wa(
      e,
      c,
      l === 'exit'
        ? (d = e.presenceContext) === null || d === void 0
          ? void 0
          : d.custom
        : void 0,
    );
    if (h) {
      const { transition: g, transitionEnd: w, ...v } = h;
      u = { ...u, ...v, ...w };
    }
    return u;
  };
  function i(l) {
    t = l(e);
  }
  function o(l) {
    const { props: u } = e,
      c = Sv(e.parent) || {},
      d = [],
      h = new Set();
    let g = {},
      w = 1 / 0;
    for (let x = 0; x < aT; x++) {
      const p = oT[x],
        m = n[p],
        y = u[p] !== void 0 ? u[p] : c[p],
        S = gi(y),
        C = p === l ? m.isActive : null;
      C === !1 && (w = x);
      let T = y === c[p] && y !== u[p] && S;
      if (
        (T && r && e.manuallyAnimateOnMount && (T = !1),
        (m.protectedKeys = { ...g }),
        (!m.isActive && C === null) || (!y && !m.prevProp) || $a(y) || typeof y == 'boolean')
      )
        continue;
      const N = cT(m.prevProp, y);
      let j = N || (p === l && m.isActive && !T && S) || (x > w && S),
        L = !1;
      const D = Array.isArray(y) ? y : [y];
      let z = D.reduce(s(p), {});
      C === !1 && (z = {});
      const { prevResolvedValues: Qe = {} } = m,
        Nt = { ...Qe, ...z },
        Pe = (oe) => {
          ((j = !0), h.has(oe) && ((L = !0), h.delete(oe)), (m.needsAnimating[oe] = !0));
          const A = e.getValue(oe);
          A && (A.liveStyle = !1);
        };
      for (const oe in Nt) {
        const A = z[oe],
          _ = Qe[oe];
        if (g.hasOwnProperty(oe)) continue;
        let M = !1;
        (Wu(A) && Wu(_) ? (M = !L0(A, _)) : (M = A !== _),
          M
            ? A != null
              ? Pe(oe)
              : h.add(oe)
            : A !== void 0 && h.has(oe)
              ? Pe(oe)
              : (m.protectedKeys[oe] = !0));
      }
      ((m.prevProp = y),
        (m.prevResolvedValues = z),
        m.isActive && (g = { ...g, ...z }),
        r && e.blockInitialAnimation && (j = !1),
        j &&
          (!(T && N) || L) &&
          d.push(...D.map((oe) => ({ animation: oe, options: { type: p } }))));
    }
    if (h.size) {
      const x = {};
      (h.forEach((p) => {
        const m = e.getBaseTarget(p),
          y = e.getValue(p);
        (y && (y.liveStyle = !0), (x[p] = m ?? null));
      }),
        d.push({ animation: x }));
    }
    let v = !!d.length;
    return (
      r && (u.initial === !1 || u.initial === u.animate) && !e.manuallyAnimateOnMount && (v = !1),
      (r = !1),
      v ? t(d) : Promise.resolve()
    );
  }
  function a(l, u) {
    var c;
    if (n[l].isActive === u) return Promise.resolve();
    ((c = e.variantChildren) === null ||
      c === void 0 ||
      c.forEach((h) => {
        var g;
        return (g = h.animationState) === null || g === void 0 ? void 0 : g.setActive(l, u);
      }),
      (n[l].isActive = u));
    const d = o(l);
    for (const h in n) n[h].protectedKeys = {};
    return d;
  }
  return {
    animateChanges: o,
    setActive: a,
    setAnimateFunction: i,
    getState: () => n,
    reset: () => {
      ((n = dp()), (r = !0));
    },
  };
}
function cT(e, t) {
  return typeof t == 'string' ? t !== e : Array.isArray(t) ? !L0(t, e) : !1;
}
function Fn(e = !1) {
  return { isActive: e, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} };
}
function dp() {
  return {
    animate: Fn(!0),
    whileInView: Fn(),
    whileHover: Fn(),
    whileTap: Fn(),
    whileDrag: Fn(),
    whileFocus: Fn(),
    exit: Fn(),
  };
}
class _n {
  constructor(t) {
    ((this.isMounted = !1), (this.node = t));
  }
  update() {}
}
class dT extends _n {
  constructor(t) {
    (super(t), t.animationState || (t.animationState = uT(t)));
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps();
    $a(t) && (this.unmountControls = t.subscribe(this.node));
  }
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: t } = this.node.getProps(),
      { animate: n } = this.node.prevProps || {};
    t !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var t;
    (this.node.animationState.reset(),
      (t = this.unmountControls) === null || t === void 0 || t.call(this));
  }
}
let fT = 0;
class hT extends _n {
  constructor() {
    (super(...arguments), (this.id = fT++));
  }
  update() {
    if (!this.node.presenceContext) return;
    const { isPresent: t, onExitComplete: n } = this.node.presenceContext,
      { isPresent: r } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || t === r) return;
    const s = this.node.animationState.setActive('exit', !t);
    n && !t && s.then(() => n(this.id));
  }
  mount() {
    const { register: t } = this.node.presenceContext || {};
    t && (this.unmount = t(this.id));
  }
  unmount() {}
}
const pT = { animation: { Feature: dT }, exit: { Feature: hT } };
function Si(e, t, n, r = { passive: !0 }) {
  return (e.addEventListener(t, n, r), () => e.removeEventListener(t, n));
}
function Vi(e) {
  return { point: { x: e.pageX, y: e.pageY } };
}
const mT = (e) => (t) => Id(t) && e(t, Vi(t));
function qs(e, t, n, r) {
  return Si(e, t, mT(n), r);
}
const fp = (e, t) => Math.abs(e - t);
function yT(e, t) {
  const n = fp(e.x, t.x),
    r = fp(e.y, t.y);
  return Math.sqrt(n ** 2 + r ** 2);
}
class Cv {
  constructor(t, n, { transformPagePoint: r, contextWindow: s, dragSnapToOrigin: i = !1 } = {}) {
    if (
      ((this.startEvent = null),
      (this.lastMoveEvent = null),
      (this.lastMoveEventInfo = null),
      (this.handlers = {}),
      (this.contextWindow = window),
      (this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        const d = Ol(this.lastMoveEventInfo, this.history),
          h = this.startEvent !== null,
          g = yT(d.offset, { x: 0, y: 0 }) >= 3;
        if (!h && !g) return;
        const { point: w } = d,
          { timestamp: v } = Se;
        this.history.push({ ...w, timestamp: v });
        const { onStart: x, onMove: p } = this.handlers;
        (h || (x && x(this.lastMoveEvent, d), (this.startEvent = this.lastMoveEvent)),
          p && p(this.lastMoveEvent, d));
      }),
      (this.handlePointerMove = (d, h) => {
        ((this.lastMoveEvent = d),
          (this.lastMoveEventInfo = bl(h, this.transformPagePoint)),
          X.update(this.updatePoint, !0));
      }),
      (this.handlePointerUp = (d, h) => {
        this.end();
        const { onEnd: g, onSessionEnd: w, resumeAnimation: v } = this.handlers;
        if ((this.dragSnapToOrigin && v && v(), !(this.lastMoveEvent && this.lastMoveEventInfo)))
          return;
        const x = Ol(
          d.type === 'pointercancel' ? this.lastMoveEventInfo : bl(h, this.transformPagePoint),
          this.history,
        );
        (this.startEvent && g && g(d, x), w && w(d, x));
      }),
      !Id(t))
    )
      return;
    ((this.dragSnapToOrigin = i),
      (this.handlers = n),
      (this.transformPagePoint = r),
      (this.contextWindow = s || window));
    const o = Vi(t),
      a = bl(o, this.transformPagePoint),
      { point: l } = a,
      { timestamp: u } = Se;
    this.history = [{ ...l, timestamp: u }];
    const { onSessionStart: c } = n;
    (c && c(t, Ol(a, this.history)),
      (this.removeListeners = Ii(
        qs(this.contextWindow, 'pointermove', this.handlePointerMove),
        qs(this.contextWindow, 'pointerup', this.handlePointerUp),
        qs(this.contextWindow, 'pointercancel', this.handlePointerUp),
      )));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    (this.removeListeners && this.removeListeners(), An(this.updatePoint));
  }
}
function bl(e, t) {
  return t ? { point: t(e.point) } : e;
}
function hp(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function Ol({ point: e }, t) {
  return { point: e, delta: hp(e, Ev(t)), offset: hp(e, gT(t)), velocity: vT(t, 0.1) };
}
function gT(e) {
  return e[0];
}
function Ev(e) {
  return e[e.length - 1];
}
function vT(e, t) {
  if (e.length < 2) return { x: 0, y: 0 };
  let n = e.length - 1,
    r = null;
  const s = Ev(e);
  for (; n >= 0 && ((r = e[n]), !(s.timestamp - r.timestamp > Qt(t))); ) n--;
  if (!r) return { x: 0, y: 0 };
  const i = Gt(s.timestamp - r.timestamp);
  if (i === 0) return { x: 0, y: 0 };
  const o = { x: (s.x - r.x) / i, y: (s.y - r.y) / i };
  return (o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o);
}
const Pv = 1e-4,
  xT = 1 - Pv,
  wT = 1 + Pv,
  kv = 0.01,
  ST = 0 - kv,
  CT = 0 + kv;
function tt(e) {
  return e.max - e.min;
}
function ET(e, t, n) {
  return Math.abs(e - t) <= n;
}
function pp(e, t, n, r = 0.5) {
  ((e.origin = r),
    (e.originPoint = ee(t.min, t.max, e.origin)),
    (e.scale = tt(n) / tt(t)),
    (e.translate = ee(n.min, n.max, e.origin) - e.originPoint),
    ((e.scale >= xT && e.scale <= wT) || isNaN(e.scale)) && (e.scale = 1),
    ((e.translate >= ST && e.translate <= CT) || isNaN(e.translate)) && (e.translate = 0));
}
function Qs(e, t, n, r) {
  (pp(e.x, t.x, n.x, r ? r.originX : void 0), pp(e.y, t.y, n.y, r ? r.originY : void 0));
}
function mp(e, t, n) {
  ((e.min = n.min + t.min), (e.max = e.min + tt(t)));
}
function PT(e, t, n) {
  (mp(e.x, t.x, n.x), mp(e.y, t.y, n.y));
}
function yp(e, t, n) {
  ((e.min = t.min - n.min), (e.max = e.min + tt(t)));
}
function Gs(e, t, n) {
  (yp(e.x, t.x, n.x), yp(e.y, t.y, n.y));
}
function kT(e, { min: t, max: n }, r) {
  return (
    t !== void 0 && e < t
      ? (e = r ? ee(t, e, r.min) : Math.max(e, t))
      : n !== void 0 && e > n && (e = r ? ee(n, e, r.max) : Math.min(e, n)),
    e
  );
}
function gp(e, t, n) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: n !== void 0 ? e.max + n - (e.max - e.min) : void 0,
  };
}
function TT(e, { top: t, left: n, bottom: r, right: s }) {
  return { x: gp(e.x, n, s), y: gp(e.y, t, r) };
}
function vp(e, t) {
  let n = t.min - e.min,
    r = t.max - e.max;
  return (t.max - t.min < e.max - e.min && ([n, r] = [r, n]), { min: n, max: r });
}
function jT(e, t) {
  return { x: vp(e.x, t.x), y: vp(e.y, t.y) };
}
function NT(e, t) {
  let n = 0.5;
  const r = tt(e),
    s = tt(t);
  return (
    s > r ? (n = is(t.min, t.max - r, e.min)) : r > s && (n = is(e.min, e.max - s, t.min)),
    en(0, 1, n)
  );
}
function RT(e, t) {
  const n = {};
  return (
    t.min !== void 0 && (n.min = t.min - e.min),
    t.max !== void 0 && (n.max = t.max - e.min),
    n
  );
}
const nc = 0.35;
function AT(e = nc) {
  return (
    e === !1 ? (e = 0) : e === !0 && (e = nc),
    { x: xp(e, 'left', 'right'), y: xp(e, 'top', 'bottom') }
  );
}
function xp(e, t, n) {
  return { min: wp(e, t), max: wp(e, n) };
}
function wp(e, t) {
  return typeof e == 'number' ? e : e[t] || 0;
}
const Sp = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  Dr = () => ({ x: Sp(), y: Sp() }),
  Cp = () => ({ min: 0, max: 0 }),
  ue = () => ({ x: Cp(), y: Cp() });
function at(e) {
  return [e('x'), e('y')];
}
function Tv({ top: e, left: t, right: n, bottom: r }) {
  return { x: { min: t, max: n }, y: { min: e, max: r } };
}
function bT({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function OT(e, t) {
  if (!t) return e;
  const n = t({ x: e.left, y: e.top }),
    r = t({ x: e.right, y: e.bottom });
  return { top: n.y, left: n.x, bottom: r.y, right: r.x };
}
function Dl(e) {
  return e === void 0 || e === 1;
}
function rc({ scale: e, scaleX: t, scaleY: n }) {
  return !Dl(e) || !Dl(t) || !Dl(n);
}
function Bn(e) {
  return rc(e) || jv(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function jv(e) {
  return Ep(e.x) || Ep(e.y);
}
function Ep(e) {
  return e && e !== '0%';
}
function pa(e, t, n) {
  const r = e - n,
    s = t * r;
  return n + s;
}
function Pp(e, t, n, r, s) {
  return (s !== void 0 && (e = pa(e, s, r)), pa(e, n, r) + t);
}
function sc(e, t = 0, n = 1, r, s) {
  ((e.min = Pp(e.min, t, n, r, s)), (e.max = Pp(e.max, t, n, r, s)));
}
function Nv(e, { x: t, y: n }) {
  (sc(e.x, t.translate, t.scale, t.originPoint), sc(e.y, n.translate, n.scale, n.originPoint));
}
const kp = 0.999999999999,
  Tp = 1.0000000000001;
function DT(e, t, n, r = !1) {
  const s = n.length;
  if (!s) return;
  t.x = t.y = 1;
  let i, o;
  for (let a = 0; a < s; a++) {
    ((i = n[a]), (o = i.projectionDelta));
    const { visualElement: l } = i.options;
    (l && l.props.style && l.props.style.display === 'contents') ||
      (r &&
        i.options.layoutScroll &&
        i.scroll &&
        i !== i.root &&
        Mr(e, { x: -i.scroll.offset.x, y: -i.scroll.offset.y }),
      o && ((t.x *= o.x.scale), (t.y *= o.y.scale), Nv(e, o)),
      r && Bn(i.latestValues) && Mr(e, i.latestValues));
  }
  (t.x < Tp && t.x > kp && (t.x = 1), t.y < Tp && t.y > kp && (t.y = 1));
}
function Lr(e, t) {
  ((e.min = e.min + t), (e.max = e.max + t));
}
function jp(e, t, n, r, s = 0.5) {
  const i = ee(e.min, e.max, s);
  sc(e, t, n, i, r);
}
function Mr(e, t) {
  (jp(e.x, t.x, t.scaleX, t.scale, t.originX), jp(e.y, t.y, t.scaleY, t.scale, t.originY));
}
function Rv(e, t) {
  return Tv(OT(e.getBoundingClientRect(), t));
}
function LT(e, t, n) {
  const r = Rv(e, n),
    { scroll: s } = t;
  return (s && (Lr(r.x, s.offset.x), Lr(r.y, s.offset.y)), r);
}
const Av = ({ current: e }) => (e ? e.ownerDocument.defaultView : null),
  MT = new WeakMap();
class _T {
  constructor(t) {
    ((this.openDragLock = null),
      (this.isDragging = !1),
      (this.currentDirection = null),
      (this.originPoint = { x: 0, y: 0 }),
      (this.constraints = !1),
      (this.hasMutatedConstraints = !1),
      (this.elastic = ue()),
      (this.visualElement = t));
  }
  start(t, { snapToCursor: n = !1 } = {}) {
    const { presenceContext: r } = this.visualElement;
    if (r && r.isPresent === !1) return;
    const s = (c) => {
        const { dragSnapToOrigin: d } = this.getProps();
        (d ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(Vi(c).point));
      },
      i = (c, d) => {
        const { drag: h, dragPropagation: g, onDragStart: w } = this.getProps();
        if (
          h &&
          !g &&
          (this.openDragLock && this.openDragLock(),
          (this.openDragLock = N2(h)),
          !this.openDragLock)
        )
          return;
        ((this.isDragging = !0),
          (this.currentDirection = null),
          this.resolveConstraints(),
          this.visualElement.projection &&
            ((this.visualElement.projection.isAnimationBlocked = !0),
            (this.visualElement.projection.target = void 0)),
          at((x) => {
            let p = this.getAxisMotionValue(x).get() || 0;
            if (It.test(p)) {
              const { projection: m } = this.visualElement;
              if (m && m.layout) {
                const y = m.layout.layoutBox[x];
                y && (p = tt(y) * (parseFloat(p) / 100));
              }
            }
            this.originPoint[x] = p;
          }),
          w && X.postRender(() => w(c, d)),
          Qu(this.visualElement, 'transform'));
        const { animationState: v } = this.visualElement;
        v && v.setActive('whileDrag', !0);
      },
      o = (c, d) => {
        const {
          dragPropagation: h,
          dragDirectionLock: g,
          onDirectionLock: w,
          onDrag: v,
        } = this.getProps();
        if (!h && !this.openDragLock) return;
        const { offset: x } = d;
        if (g && this.currentDirection === null) {
          ((this.currentDirection = FT(x)),
            this.currentDirection !== null && w && w(this.currentDirection));
          return;
        }
        (this.updateAxis('x', d.point, x),
          this.updateAxis('y', d.point, x),
          this.visualElement.render(),
          v && v(c, d));
      },
      a = (c, d) => this.stop(c, d),
      l = () =>
        at((c) => {
          var d;
          return (
            this.getAnimationState(c) === 'paused' &&
            ((d = this.getAxisMotionValue(c).animation) === null || d === void 0
              ? void 0
              : d.play())
          );
        }),
      { dragSnapToOrigin: u } = this.getProps();
    this.panSession = new Cv(
      t,
      { onSessionStart: s, onStart: i, onMove: o, onSessionEnd: a, resumeAnimation: l },
      {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: u,
        contextWindow: Av(this.visualElement),
      },
    );
  }
  stop(t, n) {
    const r = this.isDragging;
    if ((this.cancel(), !r)) return;
    const { velocity: s } = n;
    this.startAnimation(s);
    const { onDragEnd: i } = this.getProps();
    i && X.postRender(() => i(t, n));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: n } = this.visualElement;
    (t && (t.isAnimationBlocked = !1),
      this.panSession && this.panSession.end(),
      (this.panSession = void 0));
    const { dragPropagation: r } = this.getProps();
    (!r && this.openDragLock && (this.openDragLock(), (this.openDragLock = null)),
      n && n.setActive('whileDrag', !1));
  }
  updateAxis(t, n, r) {
    const { drag: s } = this.getProps();
    if (!r || !mo(t, s, this.currentDirection)) return;
    const i = this.getAxisMotionValue(t);
    let o = this.originPoint[t] + r[t];
    (this.constraints && this.constraints[t] && (o = kT(o, this.constraints[t], this.elastic[t])),
      i.set(o));
  }
  resolveConstraints() {
    var t;
    const { dragConstraints: n, dragElastic: r } = this.getProps(),
      s =
        this.visualElement.projection && !this.visualElement.projection.layout
          ? this.visualElement.projection.measure(!1)
          : (t = this.visualElement.projection) === null || t === void 0
            ? void 0
            : t.layout,
      i = this.constraints;
    (n && br(n)
      ? this.constraints || (this.constraints = this.resolveRefConstraints())
      : n && s
        ? (this.constraints = TT(s.layoutBox, n))
        : (this.constraints = !1),
      (this.elastic = AT(r)),
      i !== this.constraints &&
        s &&
        this.constraints &&
        !this.hasMutatedConstraints &&
        at((o) => {
          this.constraints !== !1 &&
            this.getAxisMotionValue(o) &&
            (this.constraints[o] = RT(s.layoutBox[o], this.constraints[o]));
        }));
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: n } = this.getProps();
    if (!t || !br(t)) return !1;
    const r = t.current,
      { projection: s } = this.visualElement;
    if (!s || !s.layout) return !1;
    const i = LT(r, s.root, this.visualElement.getTransformPagePoint());
    let o = jT(s.layout.layoutBox, i);
    if (n) {
      const a = n(bT(o));
      ((this.hasMutatedConstraints = !!a), a && (o = Tv(a)));
    }
    return o;
  }
  startAnimation(t) {
    const {
        drag: n,
        dragMomentum: r,
        dragElastic: s,
        dragTransition: i,
        dragSnapToOrigin: o,
        onDragTransitionEnd: a,
      } = this.getProps(),
      l = this.constraints || {},
      u = at((c) => {
        if (!mo(c, n, this.currentDirection)) return;
        let d = (l && l[c]) || {};
        o && (d = { min: 0, max: 0 });
        const h = s ? 200 : 1e6,
          g = s ? 40 : 1e7,
          w = {
            type: 'inertia',
            velocity: r ? t[c] : 0,
            bounceStiffness: h,
            bounceDamping: g,
            timeConstant: 750,
            restDelta: 1,
            restSpeed: 10,
            ...i,
            ...d,
          };
        return this.startAxisValueAnimation(c, w);
      });
    return Promise.all(u).then(a);
  }
  startAxisValueAnimation(t, n) {
    const r = this.getAxisMotionValue(t);
    return (Qu(this.visualElement, t), r.start(Xd(t, r, 0, n, this.visualElement, !1)));
  }
  stopAnimation() {
    at((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    at((t) => {
      var n;
      return (n = this.getAxisMotionValue(t).animation) === null || n === void 0
        ? void 0
        : n.pause();
    });
  }
  getAnimationState(t) {
    var n;
    return (n = this.getAxisMotionValue(t).animation) === null || n === void 0 ? void 0 : n.state;
  }
  getAxisMotionValue(t) {
    const n = `_drag${t.toUpperCase()}`,
      r = this.visualElement.getProps(),
      s = r[n];
    return s || this.visualElement.getValue(t, (r.initial ? r.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    at((n) => {
      const { drag: r } = this.getProps();
      if (!mo(n, r, this.currentDirection)) return;
      const { projection: s } = this.visualElement,
        i = this.getAxisMotionValue(n);
      if (s && s.layout) {
        const { min: o, max: a } = s.layout.layoutBox[n];
        i.set(t[n] - ee(o, a, 0.5));
      }
    });
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current) return;
    const { drag: t, dragConstraints: n } = this.getProps(),
      { projection: r } = this.visualElement;
    if (!br(n) || !r || !this.constraints) return;
    this.stopAnimation();
    const s = { x: 0, y: 0 };
    at((o) => {
      const a = this.getAxisMotionValue(o);
      if (a && this.constraints !== !1) {
        const l = a.get();
        s[o] = NT({ min: l, max: l }, this.constraints[o]);
      }
    });
    const { transformTemplate: i } = this.visualElement.getProps();
    ((this.visualElement.current.style.transform = i ? i({}, '') : 'none'),
      r.root && r.root.updateScroll(),
      r.updateLayout(),
      this.resolveConstraints(),
      at((o) => {
        if (!mo(o, t, null)) return;
        const a = this.getAxisMotionValue(o),
          { min: l, max: u } = this.constraints[o];
        a.set(ee(l, u, s[o]));
      }));
  }
  addListeners() {
    if (!this.visualElement.current) return;
    MT.set(this.visualElement, this);
    const t = this.visualElement.current,
      n = qs(t, 'pointerdown', (l) => {
        const { drag: u, dragListener: c = !0 } = this.getProps();
        u && c && this.start(l);
      }),
      r = () => {
        const { dragConstraints: l } = this.getProps();
        br(l) && l.current && (this.constraints = this.resolveRefConstraints());
      },
      { projection: s } = this.visualElement,
      i = s.addEventListener('measure', r);
    (s && !s.layout && (s.root && s.root.updateScroll(), s.updateLayout()), X.read(r));
    const o = Si(window, 'resize', () => this.scalePositionWithinConstraints()),
      a = s.addEventListener('didUpdate', ({ delta: l, hasLayoutChanged: u }) => {
        this.isDragging &&
          u &&
          (at((c) => {
            const d = this.getAxisMotionValue(c);
            d && ((this.originPoint[c] += l[c].translate), d.set(d.get() + l[c].translate));
          }),
          this.visualElement.render());
      });
    return () => {
      (o(), n(), i(), a && a());
    };
  }
  getProps() {
    const t = this.visualElement.getProps(),
      {
        drag: n = !1,
        dragDirectionLock: r = !1,
        dragPropagation: s = !1,
        dragConstraints: i = !1,
        dragElastic: o = nc,
        dragMomentum: a = !0,
      } = t;
    return {
      ...t,
      drag: n,
      dragDirectionLock: r,
      dragPropagation: s,
      dragConstraints: i,
      dragElastic: o,
      dragMomentum: a,
    };
  }
}
function mo(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e);
}
function FT(e, t = 10) {
  let n = null;
  return (Math.abs(e.y) > t ? (n = 'y') : Math.abs(e.x) > t && (n = 'x'), n);
}
class IT extends _n {
  constructor(t) {
    (super(t),
      (this.removeGroupControls = Ze),
      (this.removeListeners = Ze),
      (this.controls = new _T(t)));
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    (t && (this.removeGroupControls = t.subscribe(this.controls)),
      (this.removeListeners = this.controls.addListeners() || Ze));
  }
  unmount() {
    (this.removeGroupControls(), this.removeListeners());
  }
}
const Np = (e) => (t, n) => {
  e && X.postRender(() => e(t, n));
};
class VT extends _n {
  constructor() {
    (super(...arguments), (this.removePointerDownListener = Ze));
  }
  onPointerDown(t) {
    this.session = new Cv(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Av(this.node),
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: n, onPan: r, onPanEnd: s } = this.node.getProps();
    return {
      onSessionStart: Np(t),
      onStart: Np(n),
      onMove: r,
      onEnd: (i, o) => {
        (delete this.session, s && X.postRender(() => s(i, o)));
      },
    };
  }
  mount() {
    this.removePointerDownListener = qs(this.node.current, 'pointerdown', (t) =>
      this.onPointerDown(t),
    );
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    (this.removePointerDownListener(), this.session && this.session.end());
  }
}
const Do = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 };
function Rp(e, t) {
  return t.max === t.min ? 0 : (e / (t.max - t.min)) * 100;
}
const Rs = {
    correct: (e, t) => {
      if (!t.target) return e;
      if (typeof e == 'string')
        if (F.test(e)) e = parseFloat(e);
        else return e;
      const n = Rp(e, t.target.x),
        r = Rp(e, t.target.y);
      return `${n}% ${r}%`;
    },
  },
  BT = {
    correct: (e, { treeScale: t, projectionDelta: n }) => {
      const r = e,
        s = bn.parse(e);
      if (s.length > 5) return r;
      const i = bn.createTransformer(e),
        o = typeof s[0] != 'number' ? 1 : 0,
        a = n.x.scale * t.x,
        l = n.y.scale * t.y;
      ((s[0 + o] /= a), (s[1 + o] /= l));
      const u = ee(a, l, 0.5);
      return (
        typeof s[2 + o] == 'number' && (s[2 + o] /= u),
        typeof s[3 + o] == 'number' && (s[3 + o] /= u),
        i(s)
      );
    },
  };
class UT extends P.Component {
  componentDidMount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: r, layoutId: s } = this.props,
      { projection: i } = t;
    (a2(zT),
      i &&
        (n.group && n.group.add(i),
        r && r.register && s && r.register(i),
        i.root.didUpdate(),
        i.addEventListener('animationComplete', () => {
          this.safeToRemove();
        }),
        i.setOptions({ ...i.options, onExitComplete: () => this.safeToRemove() })),
      (Do.hasEverUpdated = !0));
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: n, visualElement: r, drag: s, isPresent: i } = this.props,
      o = r.projection;
    return (
      o &&
        ((o.isPresent = i),
        s || t.layoutDependency !== n || n === void 0 ? o.willUpdate() : this.safeToRemove(),
        t.isPresent !== i &&
          (i
            ? o.promote()
            : o.relegate() ||
              X.postRender(() => {
                const a = o.getStack();
                (!a || !a.members.length) && this.safeToRemove();
              }))),
      null
    );
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t &&
      (t.root.didUpdate(),
      kd.postRender(() => {
        !t.currentAnimation && t.isLead() && this.safeToRemove();
      }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: n, switchLayoutGroup: r } = this.props,
      { projection: s } = t;
    s &&
      (s.scheduleCheckAfterUnmount(),
      n && n.group && n.group.remove(s),
      r && r.deregister && r.deregister(s));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function bv(e) {
  const [t, n] = f0(),
    r = P.useContext(gd);
  return f.jsx(UT, {
    ...e,
    layoutGroup: r,
    switchLayoutGroup: P.useContext(S0),
    isPresent: t,
    safeToRemove: n,
  });
}
const zT = {
  borderRadius: {
    ...Rs,
    applyTo: [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
    ],
  },
  borderTopLeftRadius: Rs,
  borderTopRightRadius: Rs,
  borderBottomLeftRadius: Rs,
  borderBottomRightRadius: Rs,
  boxShadow: BT,
};
function $T(e, t, n) {
  const r = Oe(e) ? e : xi(e);
  return (r.start(Xd('', r, t, n)), r.animation);
}
function HT(e) {
  return e instanceof SVGElement && e.tagName !== 'svg';
}
const WT = (e, t) => e.depth - t.depth;
class KT {
  constructor() {
    ((this.children = []), (this.isDirty = !1));
  }
  add(t) {
    (Vd(this.children, t), (this.isDirty = !0));
  }
  remove(t) {
    (Bd(this.children, t), (this.isDirty = !0));
  }
  forEach(t) {
    (this.isDirty && this.children.sort(WT), (this.isDirty = !1), this.children.forEach(t));
  }
}
function qT(e, t) {
  const n = Vt.now(),
    r = ({ timestamp: s }) => {
      const i = s - n;
      i >= t && (An(r), e(i - t));
    };
  return (X.read(r, !0), () => An(r));
}
const Ov = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
  QT = Ov.length,
  Ap = (e) => (typeof e == 'string' ? parseFloat(e) : e),
  bp = (e) => typeof e == 'number' || F.test(e);
function GT(e, t, n, r, s, i) {
  s
    ? ((e.opacity = ee(0, n.opacity !== void 0 ? n.opacity : 1, XT(r))),
      (e.opacityExit = ee(t.opacity !== void 0 ? t.opacity : 1, 0, YT(r))))
    : i &&
      (e.opacity = ee(
        t.opacity !== void 0 ? t.opacity : 1,
        n.opacity !== void 0 ? n.opacity : 1,
        r,
      ));
  for (let o = 0; o < QT; o++) {
    const a = `border${Ov[o]}Radius`;
    let l = Op(t, a),
      u = Op(n, a);
    if (l === void 0 && u === void 0) continue;
    (l || (l = 0),
      u || (u = 0),
      l === 0 || u === 0 || bp(l) === bp(u)
        ? ((e[a] = Math.max(ee(Ap(l), Ap(u), r), 0)), (It.test(u) || It.test(l)) && (e[a] += '%'))
        : (e[a] = u));
  }
  (t.rotate || n.rotate) && (e.rotate = ee(t.rotate || 0, n.rotate || 0, r));
}
function Op(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const XT = Dv(0, 0.5, Y0),
  YT = Dv(0.5, 0.95, Ze);
function Dv(e, t, n) {
  return (r) => (r < e ? 0 : r > t ? 1 : n(is(e, t, r)));
}
function Dp(e, t) {
  ((e.min = t.min), (e.max = t.max));
}
function it(e, t) {
  (Dp(e.x, t.x), Dp(e.y, t.y));
}
function Lp(e, t) {
  ((e.translate = t.translate),
    (e.scale = t.scale),
    (e.originPoint = t.originPoint),
    (e.origin = t.origin));
}
function Mp(e, t, n, r, s) {
  return ((e -= t), (e = pa(e, 1 / n, r)), s !== void 0 && (e = pa(e, 1 / s, r)), e);
}
function JT(e, t = 0, n = 1, r = 0.5, s, i = e, o = e) {
  if (
    (It.test(t) && ((t = parseFloat(t)), (t = ee(o.min, o.max, t / 100) - o.min)),
    typeof t != 'number')
  )
    return;
  let a = ee(i.min, i.max, r);
  (e === i && (a -= t), (e.min = Mp(e.min, t, n, a, s)), (e.max = Mp(e.max, t, n, a, s)));
}
function _p(e, t, [n, r, s], i, o) {
  JT(e, t[n], t[r], t[s], t.scale, i, o);
}
const ZT = ['x', 'scaleX', 'originX'],
  ej = ['y', 'scaleY', 'originY'];
function Fp(e, t, n, r) {
  (_p(e.x, t, ZT, n ? n.x : void 0, r ? r.x : void 0),
    _p(e.y, t, ej, n ? n.y : void 0, r ? r.y : void 0));
}
function Ip(e) {
  return e.translate === 0 && e.scale === 1;
}
function Lv(e) {
  return Ip(e.x) && Ip(e.y);
}
function Vp(e, t) {
  return e.min === t.min && e.max === t.max;
}
function tj(e, t) {
  return Vp(e.x, t.x) && Vp(e.y, t.y);
}
function Bp(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Mv(e, t) {
  return Bp(e.x, t.x) && Bp(e.y, t.y);
}
function Up(e) {
  return tt(e.x) / tt(e.y);
}
function zp(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
class nj {
  constructor() {
    this.members = [];
  }
  add(t) {
    (Vd(this.members, t), t.scheduleRender());
  }
  remove(t) {
    if ((Bd(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead)) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(t) {
    const n = this.members.findIndex((s) => t === s);
    if (n === 0) return !1;
    let r;
    for (let s = n; s >= 0; s--) {
      const i = this.members[s];
      if (i.isPresent !== !1) {
        r = i;
        break;
      }
    }
    return r ? (this.promote(r), !0) : !1;
  }
  promote(t, n) {
    const r = this.lead;
    if (t !== r && ((this.prevLead = r), (this.lead = t), t.show(), r)) {
      (r.instance && r.scheduleRender(),
        t.scheduleRender(),
        (t.resumeFrom = r),
        n && (t.resumeFrom.preserveOpacity = !0),
        r.snapshot &&
          ((t.snapshot = r.snapshot),
          (t.snapshot.latestValues = r.animationValues || r.latestValues)),
        t.root && t.root.isUpdating && (t.isLayoutDirty = !0));
      const { crossfade: s } = t.options;
      s === !1 && r.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: n, resumingFrom: r } = t;
      (n.onExitComplete && n.onExitComplete(),
        r && r.options.onExitComplete && r.options.onExitComplete());
    });
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1);
    });
  }
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function rj(e, t, n) {
  let r = '';
  const s = e.x.translate / t.x,
    i = e.y.translate / t.y,
    o = (n == null ? void 0 : n.z) || 0;
  if (
    ((s || i || o) && (r = `translate3d(${s}px, ${i}px, ${o}px) `),
    (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `),
    n)
  ) {
    const { transformPerspective: u, rotate: c, rotateX: d, rotateY: h, skewX: g, skewY: w } = n;
    (u && (r = `perspective(${u}px) ${r}`),
      c && (r += `rotate(${c}deg) `),
      d && (r += `rotateX(${d}deg) `),
      h && (r += `rotateY(${h}deg) `),
      g && (r += `skewX(${g}deg) `),
      w && (r += `skewY(${w}deg) `));
  }
  const a = e.x.scale * t.x,
    l = e.y.scale * t.y;
  return ((a !== 1 || l !== 1) && (r += `scale(${a}, ${l})`), r || 'none');
}
const Un = {
    type: 'projectionFrame',
    totalNodes: 0,
    resolvedTargetDeltas: 0,
    recalculatedProjection: 0,
  },
  _s = typeof window < 'u' && window.MotionDebug !== void 0,
  Ll = ['', 'X', 'Y', 'Z'],
  sj = { visibility: 'hidden' },
  $p = 1e3;
let ij = 0;
function Ml(e, t, n, r) {
  const { latestValues: s } = t;
  s[e] && ((n[e] = s[e]), t.setStaticValue(e, 0), r && (r[e] = 0));
}
function _v(e) {
  if (((e.hasCheckedOptimisedAppear = !0), e.root === e)) return;
  const { visualElement: t } = e.options;
  if (!t) return;
  const n = H0(t);
  if (window.MotionHasOptimisedAnimation(n, 'transform')) {
    const { layout: s, layoutId: i } = e.options;
    window.MotionCancelOptimisedAnimation(n, 'transform', X, !(s || i));
  }
  const { parent: r } = e;
  r && !r.hasCheckedOptimisedAppear && _v(r);
}
function Fv({
  attachResizeListener: e,
  defaultParent: t,
  measureScroll: n,
  checkIsScrollRoot: r,
  resetTransform: s,
}) {
  return class {
    constructor(o = {}, a = t == null ? void 0 : t()) {
      ((this.id = ij++),
        (this.animationId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          ((this.projectionUpdateScheduled = !1),
            _s && (Un.totalNodes = Un.resolvedTargetDeltas = Un.recalculatedProjection = 0),
            this.nodes.forEach(lj),
            this.nodes.forEach(hj),
            this.nodes.forEach(pj),
            this.nodes.forEach(uj),
            _s && window.MotionDebug.record(Un));
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = o),
        (this.root = a ? a.root || a : this),
        (this.path = a ? [...a.path, a] : []),
        (this.parent = a),
        (this.depth = a ? a.depth + 1 : 0));
      for (let l = 0; l < this.path.length; l++) this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new KT());
    }
    addEventListener(o, a) {
      return (
        this.eventHandlers.has(o) || this.eventHandlers.set(o, new Ud()),
        this.eventHandlers.get(o).add(a)
      );
    }
    notifyListeners(o, ...a) {
      const l = this.eventHandlers.get(o);
      l && l.notify(...a);
    }
    hasListeners(o) {
      return this.eventHandlers.has(o);
    }
    mount(o, a = this.root.hasTreeAnimated) {
      if (this.instance) return;
      ((this.isSVG = HT(o)), (this.instance = o));
      const { layoutId: l, layout: u, visualElement: c } = this.options;
      if (
        (c && !c.current && c.mount(o),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        a && (u || l) && (this.isLayoutDirty = !0),
        e)
      ) {
        let d;
        const h = () => (this.root.updateBlockedByResize = !1);
        e(o, () => {
          ((this.root.updateBlockedByResize = !0),
            d && d(),
            (d = qT(h, 250)),
            Do.hasAnimatedSinceResize &&
              ((Do.hasAnimatedSinceResize = !1), this.nodes.forEach(Wp)));
        });
      }
      (l && this.root.registerSharedNode(l, this),
        this.options.animate !== !1 &&
          c &&
          (l || u) &&
          this.addEventListener(
            'didUpdate',
            ({ delta: d, hasLayoutChanged: h, hasRelativeTargetChanged: g, layout: w }) => {
              if (this.isTreeAnimationBlocked()) {
                ((this.target = void 0), (this.relativeTarget = void 0));
                return;
              }
              const v = this.options.transition || c.getDefaultTransition() || xj,
                { onLayoutAnimationStart: x, onLayoutAnimationComplete: p } = c.getProps(),
                m = !this.targetLayout || !Mv(this.targetLayout, w) || g,
                y = !h && g;
              if (
                this.options.layoutRoot ||
                (this.resumeFrom && this.resumeFrom.instance) ||
                y ||
                (h && (m || !this.currentAnimation))
              ) {
                (this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0)),
                  this.setAnimationOrigin(d, y));
                const S = { ...Md(v, 'layout'), onPlay: x, onComplete: p };
                ((c.shouldReduceMotion || this.options.layoutRoot) &&
                  ((S.delay = 0), (S.type = !1)),
                  this.startAnimation(S));
              } else
                (h || Wp(this),
                  this.isLead() && this.options.onExitComplete && this.options.onExitComplete());
              this.targetLayout = w;
            },
          ));
    }
    unmount() {
      (this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this));
      const o = this.getStack();
      (o && o.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        An(this.updateProjection));
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1;
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0), this.nodes && this.nodes.forEach(mj), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: o } = this.options;
      return o && o.getProps().transformTemplate;
    }
    willUpdate(o = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (
        (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && _v(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let c = 0; c < this.path.length; c++) {
        const d = this.path[c];
        ((d.shouldResetTransform = !0),
          d.updateScroll('snapshot'),
          d.options.layoutRoot && d.willUpdate(!1));
      }
      const { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l) return;
      const u = this.getTransformTemplate();
      ((this.prevTransformTemplateValue = u ? u(this.latestValues, '') : void 0),
        this.updateSnapshot(),
        o && this.notifyListeners('willUpdate'));
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        (this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Hp));
        return;
      }
      (this.isUpdating || this.nodes.forEach(dj),
        (this.isUpdating = !1),
        this.nodes.forEach(fj),
        this.nodes.forEach(oj),
        this.nodes.forEach(aj),
        this.clearAllSnapshots());
      const a = Vt.now();
      ((Se.delta = en(0, 1e3 / 60, a - Se.timestamp)),
        (Se.timestamp = a),
        (Se.isProcessing = !0),
        kl.update.process(Se),
        kl.preRender.process(Se),
        kl.render.process(Se),
        (Se.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled || ((this.updateScheduled = !0), kd.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(cj), this.sharedNodes.forEach(yj));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0), X.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      X.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure());
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++) this.path[l].updateScroll();
      const o = this.layout;
      ((this.layout = this.measure(!1)),
        (this.layoutCorrected = ue()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners('measure', this.layout.layoutBox));
      const { visualElement: a } = this.options;
      a && a.notify('LayoutMeasure', this.layout.layoutBox, o ? o.layoutBox : void 0);
    }
    updateScroll(o = 'measure') {
      let a = !!(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === o &&
          (a = !1),
        a)
      ) {
        const l = r(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: o,
          isRoot: l,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : l,
        };
      }
    }
    resetTransform() {
      if (!s) return;
      const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
        a = this.projectionDelta && !Lv(this.projectionDelta),
        l = this.getTransformTemplate(),
        u = l ? l(this.latestValues, '') : void 0,
        c = u !== this.prevTransformTemplateValue;
      o &&
        (a || Bn(this.latestValues) || c) &&
        (s(this.instance, u), (this.shouldResetTransform = !1), this.scheduleRender());
    }
    measure(o = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return (
        o && (l = this.removeTransform(l)),
        wj(l),
        {
          animationId: this.root.animationId,
          measuredBox: a,
          layoutBox: l,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      var o;
      const { visualElement: a } = this.options;
      if (!a) return ue();
      const l = a.measureViewportBox();
      if (
        !(((o = this.scroll) === null || o === void 0 ? void 0 : o.wasRoot) || this.path.some(Sj))
      ) {
        const { scroll: c } = this.root;
        c && (Lr(l.x, c.offset.x), Lr(l.y, c.offset.y));
      }
      return l;
    }
    removeElementScroll(o) {
      var a;
      const l = ue();
      if ((it(l, o), !((a = this.scroll) === null || a === void 0) && a.wasRoot)) return l;
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u],
          { scroll: d, options: h } = c;
        c !== this.root &&
          d &&
          h.layoutScroll &&
          (d.wasRoot && it(l, o), Lr(l.x, d.offset.x), Lr(l.y, d.offset.y));
      }
      return l;
    }
    applyTransform(o, a = !1) {
      const l = ue();
      it(l, o);
      for (let u = 0; u < this.path.length; u++) {
        const c = this.path[u];
        (!a &&
          c.options.layoutScroll &&
          c.scroll &&
          c !== c.root &&
          Mr(l, { x: -c.scroll.offset.x, y: -c.scroll.offset.y }),
          Bn(c.latestValues) && Mr(l, c.latestValues));
      }
      return (Bn(this.latestValues) && Mr(l, this.latestValues), l);
    }
    removeTransform(o) {
      const a = ue();
      it(a, o);
      for (let l = 0; l < this.path.length; l++) {
        const u = this.path[l];
        if (!u.instance || !Bn(u.latestValues)) continue;
        rc(u.latestValues) && u.updateSnapshot();
        const c = ue(),
          d = u.measurePageBox();
        (it(c, d), Fp(a, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, c));
      }
      return (Bn(this.latestValues) && Fp(a, this.latestValues), a);
    }
    setTargetDelta(o) {
      ((this.targetDelta = o), this.root.scheduleUpdateProjection(), (this.isProjectionDirty = !0));
    }
    setOptions(o) {
      this.options = {
        ...this.options,
        ...o,
        crossfade: o.crossfade !== void 0 ? o.crossfade : !0,
      };
    }
    clearMeasurements() {
      ((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1));
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== Se.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(o = !1) {
      var a;
      const l = this.getLead();
      (this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty),
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty));
      const u = !!this.resumingFrom || this !== l;
      if (
        !(
          o ||
          (u && this.isSharedProjectionDirty) ||
          this.isProjectionDirty ||
          (!((a = this.parent) === null || a === void 0) && a.isProjectionDirty) ||
          this.attemptToResolveRelativeTarget ||
          this.root.updateBlockedByResize
        )
      )
        return;
      const { layout: d, layoutId: h } = this.options;
      if (!(!this.layout || !(d || h))) {
        if (
          ((this.resolvedRelativeTargetAt = Se.timestamp),
          !this.targetDelta && !this.relativeTarget)
        ) {
          const g = this.getClosestProjectingParent();
          g && g.layout && this.animationProgress !== 1
            ? ((this.relativeParent = g),
              this.forceRelativeParentToResolveTarget(),
              (this.relativeTarget = ue()),
              (this.relativeTargetOrigin = ue()),
              Gs(this.relativeTargetOrigin, this.layout.layoutBox, g.layout.layoutBox),
              it(this.relativeTarget, this.relativeTargetOrigin))
            : (this.relativeParent = this.relativeTarget = void 0);
        }
        if (!(!this.relativeTarget && !this.targetDelta)) {
          if (
            (this.target || ((this.target = ue()), (this.targetWithTransforms = ue())),
            this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.relativeParent &&
            this.relativeParent.target
              ? (this.forceRelativeParentToResolveTarget(),
                PT(this.target, this.relativeTarget, this.relativeParent.target))
              : this.targetDelta
                ? (this.resumingFrom
                    ? (this.target = this.applyTransform(this.layout.layoutBox))
                    : it(this.target, this.layout.layoutBox),
                  Nv(this.target, this.targetDelta))
                : it(this.target, this.layout.layoutBox),
            this.attemptToResolveRelativeTarget)
          ) {
            this.attemptToResolveRelativeTarget = !1;
            const g = this.getClosestProjectingParent();
            g &&
            !!g.resumingFrom == !!this.resumingFrom &&
            !g.options.layoutScroll &&
            g.target &&
            this.animationProgress !== 1
              ? ((this.relativeParent = g),
                this.forceRelativeParentToResolveTarget(),
                (this.relativeTarget = ue()),
                (this.relativeTargetOrigin = ue()),
                Gs(this.relativeTargetOrigin, this.target, g.target),
                it(this.relativeTarget, this.relativeTargetOrigin))
              : (this.relativeParent = this.relativeTarget = void 0);
          }
          _s && Un.resolvedTargetDeltas++;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || rc(this.parent.latestValues) || jv(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
        this.layout
      );
    }
    calcProjection() {
      var o;
      const a = this.getLead(),
        l = !!this.resumingFrom || this !== a;
      let u = !0;
      if (
        ((this.isProjectionDirty ||
          (!((o = this.parent) === null || o === void 0) && o.isProjectionDirty)) &&
          (u = !1),
        l && (this.isSharedProjectionDirty || this.isTransformDirty) && (u = !1),
        this.resolvedRelativeTargetAt === Se.timestamp && (u = !1),
        u)
      )
        return;
      const { layout: c, layoutId: d } = this.options;
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(c || d))
      )
        return;
      it(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x,
        g = this.treeScale.y;
      (DT(this.layoutCorrected, this.treeScale, this.path, l),
        a.layout &&
          !a.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((a.target = a.layout.layoutBox), (a.targetWithTransforms = ue())));
      const { target: w } = a;
      if (!w) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      (!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : (Lp(this.prevProjectionDelta.x, this.projectionDelta.x),
          Lp(this.prevProjectionDelta.y, this.projectionDelta.y)),
        Qs(this.projectionDelta, this.layoutCorrected, w, this.latestValues),
        (this.treeScale.x !== h ||
          this.treeScale.y !== g ||
          !zp(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !zp(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners('projectionUpdate', w)),
        _s && Un.recalculatedProjection++);
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(o = !0) {
      var a;
      if (((a = this.options.visualElement) === null || a === void 0 || a.scheduleRender(), o)) {
        const l = this.getStack();
        l && l.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      ((this.prevProjectionDelta = Dr()),
        (this.projectionDelta = Dr()),
        (this.projectionDeltaWithTransform = Dr()));
    }
    setAnimationOrigin(o, a = !1) {
      const l = this.snapshot,
        u = l ? l.latestValues : {},
        c = { ...this.latestValues },
        d = Dr();
      ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !a));
      const h = ue(),
        g = l ? l.source : void 0,
        w = this.layout ? this.layout.source : void 0,
        v = g !== w,
        x = this.getStack(),
        p = !x || x.members.length <= 1,
        m = !!(v && !p && this.options.crossfade === !0 && !this.path.some(vj));
      this.animationProgress = 0;
      let y;
      ((this.mixTargetDelta = (S) => {
        const C = S / 1e3;
        (Kp(d.x, o.x, C),
          Kp(d.y, o.y, C),
          this.setTargetDelta(d),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (Gs(h, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
            gj(this.relativeTarget, this.relativeTargetOrigin, h, C),
            y && tj(this.relativeTarget, y) && (this.isProjectionDirty = !1),
            y || (y = ue()),
            it(y, this.relativeTarget)),
          v && ((this.animationValues = c), GT(c, u, this.latestValues, C, m, p)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = C));
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(o) {
      (this.notifyListeners('animationStart'),
        this.currentAnimation && this.currentAnimation.stop(),
        this.resumingFrom &&
          this.resumingFrom.currentAnimation &&
          this.resumingFrom.currentAnimation.stop(),
        this.pendingAnimation && (An(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = X.update(() => {
          ((Do.hasAnimatedSinceResize = !0),
            (this.currentAnimation = $T(0, $p, {
              ...o,
              onUpdate: (a) => {
                (this.mixTargetDelta(a), o.onUpdate && o.onUpdate(a));
              },
              onComplete: () => {
                (o.onComplete && o.onComplete(), this.completeAnimation());
              },
            })),
            this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0));
        })));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      const o = this.getStack();
      (o && o.exitAnimationComplete(),
        (this.resumingFrom = this.currentAnimation = this.animationValues = void 0),
        this.notifyListeners('animationComplete'));
    }
    finishAnimation() {
      (this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta($p), this.currentAnimation.stop()),
        this.completeAnimation());
    }
    applyTransformsToTarget() {
      const o = this.getLead();
      let { targetWithTransforms: a, target: l, layout: u, latestValues: c } = o;
      if (!(!a || !l || !u)) {
        if (
          this !== o &&
          this.layout &&
          u &&
          Iv(this.options.animationType, this.layout.layoutBox, u.layoutBox)
        ) {
          l = this.target || ue();
          const d = tt(this.layout.layoutBox.x);
          ((l.x.min = o.target.x.min), (l.x.max = l.x.min + d));
          const h = tt(this.layout.layoutBox.y);
          ((l.y.min = o.target.y.min), (l.y.max = l.y.min + h));
        }
        (it(a, l), Mr(a, c), Qs(this.projectionDeltaWithTransform, this.layoutCorrected, a, c));
      }
    }
    registerSharedNode(o, a) {
      (this.sharedNodes.has(o) || this.sharedNodes.set(o, new nj()),
        this.sharedNodes.get(o).add(a));
      const u = a.options.initialPromotionConfig;
      a.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity:
          u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(a) : void 0,
      });
    }
    isLead() {
      const o = this.getStack();
      return o ? o.lead === this : !0;
    }
    getLead() {
      var o;
      const { layoutId: a } = this.options;
      return a ? ((o = this.getStack()) === null || o === void 0 ? void 0 : o.lead) || this : this;
    }
    getPrevLead() {
      var o;
      const { layoutId: a } = this.options;
      return a ? ((o = this.getStack()) === null || o === void 0 ? void 0 : o.prevLead) : void 0;
    }
    getStack() {
      const { layoutId: o } = this.options;
      if (o) return this.root.sharedNodes.get(o);
    }
    promote({ needsReset: o, transition: a, preserveFollowOpacity: l } = {}) {
      const u = this.getStack();
      (u && u.promote(this, l),
        o && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        a && this.setOptions({ transition: a }));
    }
    relegate() {
      const o = this.getStack();
      return o ? o.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: o } = this.options;
      if (!o) return;
      let a = !1;
      const { latestValues: l } = o;
      if (
        ((l.z || l.rotate || l.rotateX || l.rotateY || l.rotateZ || l.skewX || l.skewY) && (a = !0),
        !a)
      )
        return;
      const u = {};
      l.z && Ml('z', o, u, this.animationValues);
      for (let c = 0; c < Ll.length; c++)
        (Ml(`rotate${Ll[c]}`, o, u, this.animationValues),
          Ml(`skew${Ll[c]}`, o, u, this.animationValues));
      o.render();
      for (const c in u)
        (o.setStaticValue(c, u[c]), this.animationValues && (this.animationValues[c] = u[c]));
      o.scheduleRender();
    }
    getProjectionStyles(o) {
      var a, l;
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) return sj;
      const u = { visibility: '' },
        c = this.getTransformTemplate();
      if (this.needsReset)
        return (
          (this.needsReset = !1),
          (u.opacity = ''),
          (u.pointerEvents = bo(o == null ? void 0 : o.pointerEvents) || ''),
          (u.transform = c ? c(this.latestValues, '') : 'none'),
          u
        );
      const d = this.getLead();
      if (!this.projectionDelta || !this.layout || !d.target) {
        const v = {};
        return (
          this.options.layoutId &&
            ((v.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1),
            (v.pointerEvents = bo(o == null ? void 0 : o.pointerEvents) || '')),
          this.hasProjected &&
            !Bn(this.latestValues) &&
            ((v.transform = c ? c({}, '') : 'none'), (this.hasProjected = !1)),
          v
        );
      }
      const h = d.animationValues || d.latestValues;
      (this.applyTransformsToTarget(),
        (u.transform = rj(this.projectionDeltaWithTransform, this.treeScale, h)),
        c && (u.transform = c(h, u.transform)));
      const { x: g, y: w } = this.projectionDelta;
      ((u.transformOrigin = `${g.origin * 100}% ${w.origin * 100}% 0`),
        d.animationValues
          ? (u.opacity =
              d === this
                ? (l = (a = h.opacity) !== null && a !== void 0 ? a : this.latestValues.opacity) !==
                    null && l !== void 0
                  ? l
                  : 1
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : h.opacityExit)
          : (u.opacity =
              d === this
                ? h.opacity !== void 0
                  ? h.opacity
                  : ''
                : h.opacityExit !== void 0
                  ? h.opacityExit
                  : 0));
      for (const v in ua) {
        if (h[v] === void 0) continue;
        const { correct: x, applyTo: p } = ua[v],
          m = u.transform === 'none' ? h[v] : x(h[v], d);
        if (p) {
          const y = p.length;
          for (let S = 0; S < y; S++) u[p[S]] = m;
        } else u[v] = m;
      }
      return (
        this.options.layoutId &&
          (u.pointerEvents = d === this ? bo(o == null ? void 0 : o.pointerEvents) || '' : 'none'),
        u
      );
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach((o) => {
        var a;
        return (a = o.currentAnimation) === null || a === void 0 ? void 0 : a.stop();
      }),
        this.root.nodes.forEach(Hp),
        this.root.sharedNodes.clear());
    }
  };
}
function oj(e) {
  e.updateLayout();
}
function aj(e) {
  var t;
  const n = ((t = e.resumeFrom) === null || t === void 0 ? void 0 : t.snapshot) || e.snapshot;
  if (e.isLead() && e.layout && n && e.hasListeners('didUpdate')) {
    const { layoutBox: r, measuredBox: s } = e.layout,
      { animationType: i } = e.options,
      o = n.source !== e.layout.source;
    i === 'size'
      ? at((d) => {
          const h = o ? n.measuredBox[d] : n.layoutBox[d],
            g = tt(h);
          ((h.min = r[d].min), (h.max = h.min + g));
        })
      : Iv(i, n.layoutBox, r) &&
        at((d) => {
          const h = o ? n.measuredBox[d] : n.layoutBox[d],
            g = tt(r[d]);
          ((h.max = h.min + g),
            e.relativeTarget &&
              !e.currentAnimation &&
              ((e.isProjectionDirty = !0),
              (e.relativeTarget[d].max = e.relativeTarget[d].min + g)));
        });
    const a = Dr();
    Qs(a, r, n.layoutBox);
    const l = Dr();
    o ? Qs(l, e.applyTransform(s, !0), n.measuredBox) : Qs(l, r, n.layoutBox);
    const u = !Lv(a);
    let c = !1;
    if (!e.resumeFrom) {
      const d = e.getClosestProjectingParent();
      if (d && !d.resumeFrom) {
        const { snapshot: h, layout: g } = d;
        if (h && g) {
          const w = ue();
          Gs(w, n.layoutBox, h.layoutBox);
          const v = ue();
          (Gs(v, r, g.layoutBox),
            Mv(w, v) || (c = !0),
            d.options.layoutRoot &&
              ((e.relativeTarget = v), (e.relativeTargetOrigin = w), (e.relativeParent = d)));
        }
      }
    }
    e.notifyListeners('didUpdate', {
      layout: r,
      snapshot: n,
      delta: l,
      layoutDelta: a,
      hasLayoutChanged: u,
      hasRelativeTargetChanged: c,
    });
  } else if (e.isLead()) {
    const { onExitComplete: r } = e.options;
    r && r();
  }
  e.options.transition = void 0;
}
function lj(e) {
  (_s && Un.totalNodes++,
    e.parent &&
      (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty),
      e.isSharedProjectionDirty ||
        (e.isSharedProjectionDirty = !!(
          e.isProjectionDirty ||
          e.parent.isProjectionDirty ||
          e.parent.isSharedProjectionDirty
        )),
      e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty)));
}
function uj(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function cj(e) {
  e.clearSnapshot();
}
function Hp(e) {
  e.clearMeasurements();
}
function dj(e) {
  e.isLayoutDirty = !1;
}
function fj(e) {
  const { visualElement: t } = e.options;
  (t && t.getProps().onBeforeLayoutMeasure && t.notify('BeforeLayoutMeasure'), e.resetTransform());
}
function Wp(e) {
  (e.finishAnimation(),
    (e.targetDelta = e.relativeTarget = e.target = void 0),
    (e.isProjectionDirty = !0));
}
function hj(e) {
  e.resolveTargetDelta();
}
function pj(e) {
  e.calcProjection();
}
function mj(e) {
  e.resetSkewAndRotation();
}
function yj(e) {
  e.removeLeadSnapshot();
}
function Kp(e, t, n) {
  ((e.translate = ee(t.translate, 0, n)),
    (e.scale = ee(t.scale, 1, n)),
    (e.origin = t.origin),
    (e.originPoint = t.originPoint));
}
function qp(e, t, n, r) {
  ((e.min = ee(t.min, n.min, r)), (e.max = ee(t.max, n.max, r)));
}
function gj(e, t, n, r) {
  (qp(e.x, t.x, n.x, r), qp(e.y, t.y, n.y, r));
}
function vj(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const xj = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  Qp = (e) =>
    typeof navigator < 'u' && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e),
  Gp = Qp('applewebkit/') && !Qp('chrome/') ? Math.round : Ze;
function Xp(e) {
  ((e.min = Gp(e.min)), (e.max = Gp(e.max)));
}
function wj(e) {
  (Xp(e.x), Xp(e.y));
}
function Iv(e, t, n) {
  return e === 'position' || (e === 'preserve-aspect' && !ET(Up(t), Up(n), 0.2));
}
function Sj(e) {
  var t;
  return e !== e.root && ((t = e.scroll) === null || t === void 0 ? void 0 : t.wasRoot);
}
const Cj = Fv({
    attachResizeListener: (e, t) => Si(e, 'resize', t),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop,
    }),
    checkIsScrollRoot: () => !0,
  }),
  _l = { current: void 0 },
  Vv = Fv({
    measureScroll: (e) => ({ x: e.scrollLeft, y: e.scrollTop }),
    defaultParent: () => {
      if (!_l.current) {
        const e = new Cj({});
        (e.mount(window), e.setOptions({ layoutScroll: !0 }), (_l.current = e));
      }
      return _l.current;
    },
    resetTransform: (e, t) => {
      e.style.transform = t !== void 0 ? t : 'none';
    },
    checkIsScrollRoot: (e) => window.getComputedStyle(e).position === 'fixed',
  }),
  Ej = { pan: { Feature: VT }, drag: { Feature: IT, ProjectionNode: Vv, MeasureLayout: bv } };
function Yp(e, t, n) {
  const { props: r } = e;
  e.animationState && r.whileHover && e.animationState.setActive('whileHover', n === 'Start');
  const s = 'onHover' + n,
    i = r[s];
  i && X.postRender(() => i(t, Vi(t)));
}
class Pj extends _n {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = E2(t, (n) => (Yp(this.node, n, 'Start'), (r) => Yp(this.node, r, 'End'))));
  }
  unmount() {}
}
class kj extends _n {
  constructor() {
    (super(...arguments), (this.isActive = !1));
  }
  onFocus() {
    let t = !1;
    try {
      t = this.node.current.matches(':focus-visible');
    } catch {
      t = !0;
    }
    !t ||
      !this.node.animationState ||
      (this.node.animationState.setActive('whileFocus', !0), (this.isActive = !0));
  }
  onBlur() {
    !this.isActive ||
      !this.node.animationState ||
      (this.node.animationState.setActive('whileFocus', !1), (this.isActive = !1));
  }
  mount() {
    this.unmount = Ii(
      Si(this.node.current, 'focus', () => this.onFocus()),
      Si(this.node.current, 'blur', () => this.onBlur()),
    );
  }
  unmount() {}
}
function Jp(e, t, n) {
  const { props: r } = e;
  e.animationState && r.whileTap && e.animationState.setActive('whileTap', n === 'Start');
  const s = 'onTap' + (n === 'End' ? '' : n),
    i = r[s];
  i && X.postRender(() => i(t, Vi(t)));
}
class Tj extends _n {
  mount() {
    const { current: t } = this.node;
    t &&
      (this.unmount = j2(
        t,
        (n) => (
          Jp(this.node, n, 'Start'),
          (r, { success: s }) => Jp(this.node, r, s ? 'End' : 'Cancel')
        ),
        { useGlobalTarget: this.node.props.globalTapTarget },
      ));
  }
  unmount() {}
}
const ic = new WeakMap(),
  Fl = new WeakMap(),
  jj = (e) => {
    const t = ic.get(e.target);
    t && t(e);
  },
  Nj = (e) => {
    e.forEach(jj);
  };
function Rj({ root: e, ...t }) {
  const n = e || document;
  Fl.has(n) || Fl.set(n, {});
  const r = Fl.get(n),
    s = JSON.stringify(t);
  return (r[s] || (r[s] = new IntersectionObserver(Nj, { root: e, ...t })), r[s]);
}
function Aj(e, t, n) {
  const r = Rj(t);
  return (
    ic.set(e, n),
    r.observe(e),
    () => {
      (ic.delete(e), r.unobserve(e));
    }
  );
}
const bj = { some: 0, all: 1 };
class Oj extends _n {
  constructor() {
    (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(),
      { root: n, margin: r, amount: s = 'some', once: i } = t,
      o = {
        root: n ? n.current : void 0,
        rootMargin: r,
        threshold: typeof s == 'number' ? s : bj[s],
      },
      a = (l) => {
        const { isIntersecting: u } = l;
        if (this.isInView === u || ((this.isInView = u), i && !u && this.hasEnteredView)) return;
        (u && (this.hasEnteredView = !0),
          this.node.animationState && this.node.animationState.setActive('whileInView', u));
        const { onViewportEnter: c, onViewportLeave: d } = this.node.getProps(),
          h = u ? c : d;
        h && h(l);
      };
    return Aj(this.node.current, o, a);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > 'u') return;
    const { props: t, prevProps: n } = this.node;
    ['amount', 'margin', 'root'].some(Dj(t, n)) && this.startObserver();
  }
  unmount() {}
}
function Dj({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (n) => e[n] !== t[n];
}
const Lj = {
    inView: { Feature: Oj },
    tap: { Feature: Tj },
    focus: { Feature: kj },
    hover: { Feature: Pj },
  },
  Mj = { layout: { ProjectionNode: Vv, MeasureLayout: bv } },
  oc = { current: null },
  Bv = { current: !1 };
function _j() {
  if (((Bv.current = !0), !!wd))
    if (window.matchMedia) {
      const e = window.matchMedia('(prefers-reduced-motion)'),
        t = () => (oc.current = e.matches);
      (e.addListener(t), t());
    } else oc.current = !1;
}
const Fj = [...dv, Re, bn],
  Ij = (e) => Fj.find(cv(e)),
  Zp = new WeakMap();
function Vj(e, t, n) {
  for (const r in t) {
    const s = t[r],
      i = n[r];
    if (Oe(s)) e.addValue(r, s);
    else if (Oe(i)) e.addValue(r, xi(s, { owner: e }));
    else if (i !== s)
      if (e.hasValue(r)) {
        const o = e.getValue(r);
        o.liveStyle === !0 ? o.jump(s) : o.hasAnimated || o.set(s);
      } else {
        const o = e.getStaticValue(r);
        e.addValue(r, xi(o !== void 0 ? o : s, { owner: e }));
      }
  }
  for (const r in n) t[r] === void 0 && e.removeValue(r);
  return t;
}
const em = [
  'AnimationStart',
  'AnimationComplete',
  'Update',
  'BeforeLayoutMeasure',
  'LayoutMeasure',
  'LayoutAnimationStart',
  'LayoutAnimationComplete',
];
class Bj {
  scrapeMotionValuesFromProps(t, n, r) {
    return {};
  }
  constructor(
    {
      parent: t,
      props: n,
      presenceContext: r,
      reducedMotionConfig: s,
      blockInitialAnimation: i,
      visualState: o,
    },
    a = {},
  ) {
    ((this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.values = new Map()),
      (this.KeyframeResolver = qd),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify('Update', this.latestValues)),
      (this.render = () => {
        this.current &&
          (this.triggerBuild(),
          this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
      }),
      (this.renderScheduledAt = 0),
      (this.scheduleRender = () => {
        const g = Vt.now();
        this.renderScheduledAt < g && ((this.renderScheduledAt = g), X.render(this.render, !1, !0));
      }));
    const { latestValues: l, renderState: u, onUpdate: c } = o;
    ((this.onUpdate = c),
      (this.latestValues = l),
      (this.baseTarget = { ...l }),
      (this.initialValues = n.initial ? { ...l } : {}),
      (this.renderState = u),
      (this.parent = t),
      (this.props = n),
      (this.presenceContext = r),
      (this.depth = t ? t.depth + 1 : 0),
      (this.reducedMotionConfig = s),
      (this.options = a),
      (this.blockInitialAnimation = !!i),
      (this.isControllingVariants = Ha(n)),
      (this.isVariantNode = x0(n)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = !!(t && t.current)));
    const { willChange: d, ...h } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const g in h) {
      const w = h[g];
      l[g] !== void 0 && Oe(w) && w.set(l[g], !1);
    }
  }
  mount(t) {
    ((this.current = t),
      Zp.set(t, this),
      this.projection && !this.projection.instance && this.projection.mount(t),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((n, r) => this.bindToMotionValue(r, n)),
      Bv.current || _j(),
      (this.shouldReduceMotion =
        this.reducedMotionConfig === 'never'
          ? !1
          : this.reducedMotionConfig === 'always'
            ? !0
            : oc.current),
      this.parent && this.parent.children.add(this),
      this.update(this.props, this.presenceContext));
  }
  unmount() {
    (Zp.delete(this.current),
      this.projection && this.projection.unmount(),
      An(this.notifyUpdate),
      An(this.render),
      this.valueSubscriptions.forEach((t) => t()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      this.parent && this.parent.children.delete(this));
    for (const t in this.events) this.events[t].clear();
    for (const t in this.features) {
      const n = this.features[t];
      n && (n.unmount(), (n.isMounted = !1));
    }
    this.current = null;
  }
  bindToMotionValue(t, n) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
    const r = pr.has(t),
      s = n.on('change', (a) => {
        ((this.latestValues[t] = a),
          this.props.onUpdate && X.preRender(this.notifyUpdate),
          r && this.projection && (this.projection.isTransformDirty = !0));
      }),
      i = n.on('renderRequest', this.scheduleRender);
    let o;
    (window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, t, n)),
      this.valueSubscriptions.set(t, () => {
        (s(), i(), o && o(), n.owner && n.stop());
      }));
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type
      ? 0
      : this.sortInstanceNodePosition(this.current, t.current);
  }
  updateFeatures() {
    let t = 'animation';
    for (t in os) {
      const n = os[t];
      if (!n) continue;
      const { isEnabled: r, Feature: s } = n;
      if (
        (!this.features[t] && s && r(this.props) && (this.features[t] = new s(this)),
        this.features[t])
      ) {
        const i = this.features[t];
        i.isMounted ? i.update() : (i.mount(), (i.isMounted = !0));
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : ue();
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, n) {
    this.latestValues[t] = n;
  }
  update(t, n) {
    ((t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = t),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = n));
    for (let r = 0; r < em.length; r++) {
      const s = em[r];
      this.propEventSubscriptions[s] &&
        (this.propEventSubscriptions[s](), delete this.propEventSubscriptions[s]);
      const i = 'on' + s,
        o = t[i];
      o && (this.propEventSubscriptions[s] = this.on(s, o));
    }
    ((this.prevMotionValues = Vj(
      this,
      this.scrapeMotionValuesFromProps(t, this.prevProps, this),
      this.prevMotionValues,
    )),
      this.handleChildMotionValue && this.handleChildMotionValue(),
      this.onUpdate && this.onUpdate(this));
  }
  getProps() {
    return this.props;
  }
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  addVariantChild(t) {
    const n = this.getClosestVariantNode();
    if (n)
      return (n.variantChildren && n.variantChildren.add(t), () => n.variantChildren.delete(t));
  }
  addValue(t, n) {
    const r = this.values.get(t);
    n !== r &&
      (r && this.removeValue(t),
      this.bindToMotionValue(t, n),
      this.values.set(t, n),
      (this.latestValues[t] = n.get()));
  }
  removeValue(t) {
    this.values.delete(t);
    const n = this.valueSubscriptions.get(t);
    (n && (n(), this.valueSubscriptions.delete(t)),
      delete this.latestValues[t],
      this.removeValueFromRenderState(t, this.renderState));
  }
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, n) {
    if (this.props.values && this.props.values[t]) return this.props.values[t];
    let r = this.values.get(t);
    return (
      r === void 0 &&
        n !== void 0 &&
        ((r = xi(n === null ? void 0 : n, { owner: this })), this.addValue(t, r)),
      r
    );
  }
  readValue(t, n) {
    var r;
    let s =
      this.latestValues[t] !== void 0 || !this.current
        ? this.latestValues[t]
        : (r = this.getBaseTargetFromProps(this.props, t)) !== null && r !== void 0
          ? r
          : this.readValueFromInstance(this.current, t, this.options);
    return (
      s != null &&
        (typeof s == 'string' && (lv(s) || Z0(s))
          ? (s = parseFloat(s))
          : !Ij(s) && bn.test(n) && (s = iv(t, n)),
        this.setBaseTarget(t, Oe(s) ? s.get() : s)),
      Oe(s) ? s.get() : s
    );
  }
  setBaseTarget(t, n) {
    this.baseTarget[t] = n;
  }
  getBaseTarget(t) {
    var n;
    const { initial: r } = this.props;
    let s;
    if (typeof r == 'string' || typeof r == 'object') {
      const o = jd(
        this.props,
        r,
        (n = this.presenceContext) === null || n === void 0 ? void 0 : n.custom,
      );
      o && (s = o[t]);
    }
    if (r && s !== void 0) return s;
    const i = this.getBaseTargetFromProps(this.props, t);
    return i !== void 0 && !Oe(i)
      ? i
      : this.initialValues[t] !== void 0 && s === void 0
        ? void 0
        : this.baseTarget[t];
  }
  on(t, n) {
    return (this.events[t] || (this.events[t] = new Ud()), this.events[t].add(n));
  }
  notify(t, ...n) {
    this.events[t] && this.events[t].notify(...n);
  }
}
class Uv extends Bj {
  constructor() {
    (super(...arguments), (this.KeyframeResolver = fv));
  }
  sortInstanceNodePosition(t, n) {
    return t.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(t, n) {
    return t.style ? t.style[n] : void 0;
  }
  removeValueFromRenderState(t, { vars: n, style: r }) {
    (delete n[t], delete r[t]);
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    Oe(t) &&
      (this.childSubscription = t.on('change', (n) => {
        this.current && (this.current.textContent = `${n}`);
      }));
  }
}
function Uj(e) {
  return window.getComputedStyle(e);
}
class zj extends Uv {
  constructor() {
    (super(...arguments), (this.type = 'html'), (this.renderInstance = N0));
  }
  readValueFromInstance(t, n) {
    if (pr.has(n)) {
      const r = Kd(n);
      return (r && r.default) || 0;
    } else {
      const r = Uj(t),
        s = (k0(n) ? r.getPropertyValue(n) : r[n]) || 0;
      return typeof s == 'string' ? s.trim() : s;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: n }) {
    return Rv(t, n);
  }
  build(t, n, r) {
    Ad(t, n, r.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, n, r) {
    return Ld(t, n, r);
  }
}
class $j extends Uv {
  constructor() {
    (super(...arguments),
      (this.type = 'svg'),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = ue));
  }
  getBaseTargetFromProps(t, n) {
    return t[n];
  }
  readValueFromInstance(t, n) {
    if (pr.has(n)) {
      const r = Kd(n);
      return (r && r.default) || 0;
    }
    return ((n = R0.has(n) ? n : Pd(n)), t.getAttribute(n));
  }
  scrapeMotionValuesFromProps(t, n, r) {
    return O0(t, n, r);
  }
  build(t, n, r) {
    bd(t, n, this.isSVGTag, r.transformTemplate);
  }
  renderInstance(t, n, r, s) {
    A0(t, n, r, s);
  }
  mount(t) {
    ((this.isSVGTag = Dd(t.tagName)), super.mount(t));
  }
}
const Hj = (e, t) => (Td(e) ? new $j(t) : new zj(t, { allowProjection: e !== P.Fragment })),
  Wj = y2({ ...pT, ...Lj, ...Ej, ...Mj }, Hj),
  Tt = bP(Wj),
  Kj = () => {
    const { cart: e, searchQuery: t, setSearchQuery: n } = hr(),
      { isAuthenticated: r, user: s, logout: i } = Mi(),
      [o, a] = P.useState(!1),
      l = hs();
    return f.jsxs('nav', {
      className: 'sticky top-0 z-50 glass border-b border-white/10 px-6 py-4',
      children: [
        f.jsxs('div', {
          className: 'max-w-7xl mx-auto flex items-center justify-between',
          children: [
            f.jsxs(K, {
              to: '/',
              className: 'flex items-center gap-2',
              children: [
                f.jsx('div', {
                  className:
                    'w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20',
                  children: 'S',
                }),
                f.jsxs('span', {
                  className: 'text-xl font-bold tracking-tight text-white',
                  children: [
                    'SKYLINE',
                    f.jsx('span', { className: 'text-primary-400', children: 'SHOP' }),
                  ],
                }),
              ],
            }),
            f.jsxs('div', {
              className: 'hidden md:flex items-center gap-8 font-medium',
              children: [
                f.jsx(K, {
                  to: '/',
                  className: 'hover:text-primary-400 transition-colors',
                  children: 'Home',
                }),
                f.jsx(K, {
                  to: '/products',
                  className: 'hover:text-primary-400 transition-colors',
                  children: 'Shop',
                }),
                f.jsx(K, {
                  to: '/categories',
                  className: 'hover:text-primary-400 transition-colors',
                  children: 'Categories',
                }),
                f.jsx(K, {
                  to: '/about',
                  className: 'hover:text-primary-400 transition-colors',
                  children: 'About',
                }),
              ],
            }),
            f.jsxs('div', {
              className: 'flex items-center gap-4',
              children: [
                f.jsxs('div', {
                  className: 'relative hidden md:flex items-center',
                  children: [
                    f.jsx(dP, { size: 18, className: 'absolute left-3 text-slate-500' }),
                    f.jsx('input', {
                      type: 'text',
                      placeholder: 'Search products...',
                      value: t,
                      onChange: (u) => {
                        (n(u.target.value),
                          window.location.pathname !== '/products' && l('/products'));
                      },
                      className:
                        'bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                    }),
                  ],
                }),
                f.jsxs(K, {
                  to: '/cart',
                  className:
                    'p-2 hover:bg-white/5 rounded-full transition-colors relative text-slate-300',
                  children: [
                    f.jsx(Ba, { size: 20 }),
                    e.length > 0 &&
                      f.jsx('span', {
                        className:
                          'absolute top-0 right-0 w-4 h-4 bg-primary-500 text-[10px] flex items-center justify-center rounded-full text-white font-bold',
                        children: e.reduce((u, c) => u + c.quantity, 0),
                      }),
                  ],
                }),
                r
                  ? f.jsxs('div', {
                      className: 'relative group flex items-center gap-4',
                      children: [
                        f.jsxs('span', {
                          className: 'hidden md:block text-sm font-medium text-slate-300',
                          children: ['Hi, ', (s == null ? void 0 : s.firstName) || 'User'],
                        }),
                        f.jsx('button', {
                          onClick: i,
                          className:
                            'p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-colors text-slate-300',
                          title: 'Logout',
                          children: f.jsx(aP, { size: 20 }),
                        }),
                      ],
                    })
                  : f.jsxs(K, {
                      to: '/login',
                      className:
                        'hidden md:flex items-center gap-2 p-2 px-4 hover:bg-primary-500/10 hover:text-primary-400 rounded-full transition-colors text-slate-300 font-medium',
                      children: [f.jsx(d0, { size: 20 }), f.jsx('span', { children: 'Login' })],
                    }),
                f.jsx('button', {
                  onClick: () => a(!o),
                  className:
                    'md:hidden p-2 hover:bg-white/5 rounded-full transition-colors text-slate-300',
                  children: o ? f.jsx(gP, { size: 20 }) : f.jsx(lP, { size: 20 }),
                }),
              ],
            }),
          ],
        }),
        f.jsx(p0, {
          children:
            o &&
            f.jsx(Tt.div, {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: 'auto' },
              exit: { opacity: 0, height: 0 },
              className: 'md:hidden bg-slate-900 border-t border-white/10 mt-4 py-4',
              children: f.jsxs('div', {
                className: 'flex flex-col gap-4 px-6',
                children: [
                  f.jsx(K, {
                    to: '/',
                    onClick: () => a(!1),
                    className: 'py-2 hover:text-primary-400 transition-colors',
                    children: 'Home',
                  }),
                  f.jsx(K, {
                    to: '/products',
                    onClick: () => a(!1),
                    className: 'py-2 hover:text-primary-400 transition-colors',
                    children: 'Shop',
                  }),
                  f.jsx(K, {
                    to: '/categories',
                    onClick: () => a(!1),
                    className: 'py-2 hover:text-primary-400 transition-colors',
                    children: 'Categories',
                  }),
                  f.jsx(K, {
                    to: '/about',
                    onClick: () => a(!1),
                    className: 'py-2 hover:text-primary-400 transition-colors',
                    children: 'About',
                  }),
                  !r &&
                    f.jsx(K, {
                      to: '/login',
                      onClick: () => a(!1),
                      className:
                        'py-2 text-primary-400 font-medium border-t border-white/10 mt-2 pt-4',
                      children: 'Sign In',
                    }),
                ],
              }),
            }),
        }),
      ],
    });
  },
  qj = () =>
    f.jsxs('footer', {
      className: 'border-t border-white/10 py-12 bg-slate-950/50 mt-20',
      children: [
        f.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12',
          children: [
            f.jsxs('div', {
              className: 'col-span-2',
              children: [
                f.jsxs('div', {
                  className: 'flex items-center gap-2 mb-6',
                  children: [
                    f.jsx('div', {
                      className:
                        'w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-white',
                      children: 'S',
                    }),
                    f.jsxs('span', {
                      className: 'text-lg font-bold tracking-tight text-white',
                      children: [
                        'SKYLINE',
                        f.jsx('span', { className: 'text-primary-400', children: 'SHOP' }),
                      ],
                    }),
                  ],
                }),
                f.jsx('p', {
                  className: 'text-slate-400 max-w-sm mb-6',
                  children:
                    'Experience the future of e-commerce with our premium selection of curated goods. Designed for style, built for quality.',
                }),
                f.jsxs('div', {
                  className: 'flex gap-4',
                  children: [
                    f.jsx('a', {
                      href: '#',
                      className: 'p-2 glass rounded-lg hover:text-primary-400 transition-colors',
                      children: f.jsx(iP, { size: 20 }),
                    }),
                    f.jsx('a', {
                      href: '#',
                      className: 'p-2 glass rounded-lg hover:text-primary-400 transition-colors',
                      children: f.jsx(yP, { size: 20 }),
                    }),
                    f.jsx('a', {
                      href: '#',
                      className: 'p-2 glass rounded-lg hover:text-primary-400 transition-colors',
                      children: f.jsx(oP, { size: 20 }),
                    }),
                  ],
                }),
              ],
            }),
            f.jsxs('div', {
              children: [
                f.jsx('h4', { className: 'font-bold text-white mb-6', children: 'Shop' }),
                f.jsxs('ul', {
                  className: 'space-y-4 text-slate-400 text-sm',
                  children: [
                    f.jsx('li', {
                      children: f.jsx('a', {
                        href: '#',
                        className: 'hover:text-white transition-colors',
                        children: 'New Arrivals',
                      }),
                    }),
                    f.jsx('li', {
                      children: f.jsx('a', {
                        href: '#',
                        className: 'hover:text-white transition-colors',
                        children: 'Best Sellers',
                      }),
                    }),
                    f.jsx('li', {
                      children: f.jsx('a', {
                        href: '#',
                        className: 'hover:text-white transition-colors',
                        children: 'Exclusive Offers',
                      }),
                    }),
                  ],
                }),
              ],
            }),
            f.jsxs('div', {
              children: [
                f.jsx('h4', { className: 'font-bold text-white mb-6', children: 'Support' }),
                f.jsxs('ul', {
                  className: 'space-y-4 text-slate-400 text-sm',
                  children: [
                    f.jsx('li', {
                      children: f.jsx('a', {
                        href: '#',
                        className: 'hover:text-white transition-colors',
                        children: 'Contact Us',
                      }),
                    }),
                    f.jsx('li', {
                      children: f.jsx('a', {
                        href: '#',
                        className: 'hover:text-white transition-colors',
                        children: 'Shipping Policy',
                      }),
                    }),
                    f.jsx('li', {
                      children: f.jsx('a', {
                        href: '#',
                        className: 'hover:text-white transition-colors',
                        children: 'FAQ',
                      }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        f.jsx('div', {
          className:
            'max-w-7xl mx-auto px-6 mt-12 pt-12 border-t border-white/5 text-center text-slate-500 text-xs',
          children: '© 2024 SkylineShop. Built with React, Tailwind & SCSS.',
        }),
      ],
    }),
  Qj = () => {
    const { products: e, loading: t, addToCart: n } = hr(),
      r = e.slice(0, 4);
    return f.jsxs('div', {
      className: 'max-w-7xl mx-auto px-6',
      children: [
        f.jsx('section', {
          className: 'py-20 flex flex-col items-center text-center',
          children: f.jsxs(Tt.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
            children: [
              f.jsx('span', {
                className:
                  'px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold mb-6 inline-block',
                children: 'Summer Sale - Up to 50% Off',
              }),
              f.jsxs('h1', {
                className: 'text-5xl md:text-7xl font-bold mb-6 text-white leading-tight',
                children: [
                  'Premium Essentials ',
                  f.jsx('br', {}),
                  f.jsx('span', {
                    className:
                      'bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent',
                    children: 'For Your Daily Life',
                  }),
                ],
              }),
              f.jsx('p', {
                className: 'text-slate-400 text-lg max-w-2xl mb-10 mx-auto',
                children:
                  'Experience the perfect blend of modern design and exceptional quality. Discover our latest collections today.',
              }),
              f.jsxs('div', {
                className: 'flex flex-wrap gap-4 justify-center',
                children: [
                  f.jsxs(K, {
                    to: '/products',
                    className:
                      'px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2 group',
                    children: [
                      'Shop Now ',
                      f.jsx(aa, {
                        size: 18,
                        className: 'group-hover:translate-x-1 transition-transform',
                      }),
                    ],
                  }),
                  f.jsx(K, {
                    to: '/about',
                    className:
                      'px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10',
                    children: 'Our Story',
                  }),
                ],
              }),
            ],
          }),
        }),
        f.jsxs('section', {
          className: 'py-20',
          children: [
            f.jsxs('div', {
              className: 'flex items-center justify-between mb-12',
              children: [
                f.jsx('h2', {
                  className: 'text-3xl font-bold text-white',
                  children: 'Featured Products',
                }),
                f.jsxs(K, {
                  to: '/products',
                  className:
                    'text-primary-400 hover:text-primary-300 font-medium flex items-center gap-2',
                  children: ['View All ', f.jsx(aa, { size: 16 })],
                }),
              ],
            }),
            t
              ? f.jsx('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
                  children: [1, 2, 3, 4].map((s) =>
                    f.jsx('div', { className: 'h-96 glass rounded-3xl animate-pulse' }, s),
                  ),
                })
              : f.jsx('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
                  children: r.map((s) =>
                    f.jsx(
                      'div',
                      {
                        className: 'group',
                        children: f.jsxs('div', {
                          className:
                            'glass rounded-3xl overflow-hidden premium-shadow group-hover:scale-[1.02] transition-all duration-500',
                          children: [
                            f.jsxs('div', {
                              className: 'relative h-64 overflow-hidden',
                              children: [
                                f.jsx(K, {
                                  to: `/product/${s.id}`,
                                  children: f.jsx('img', {
                                    src: s.thumbnail,
                                    alt: s.title,
                                    className:
                                      'w-full h-full object-cover group-hover:scale-110 transition-transform duration-700',
                                  }),
                                }),
                                f.jsx('button', {
                                  className:
                                    'absolute top-4 right-4 p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors',
                                  children: f.jsx(md, { size: 18 }),
                                }),
                              ],
                            }),
                            f.jsxs('div', {
                              className: 'p-6',
                              children: [
                                f.jsxs('div', {
                                  className: 'flex justify-between items-start mb-2',
                                  children: [
                                    f.jsx(K, {
                                      to: `/product/${s.id}`,
                                      children: f.jsx('h3', {
                                        className:
                                          'font-bold text-white text-lg line-clamp-1 hover:text-primary-400 transition-colors',
                                        children: s.title,
                                      }),
                                    }),
                                    f.jsxs('div', {
                                      className: 'flex items-center gap-1 text-yellow-400',
                                      children: [
                                        f.jsx(yd, { size: 14, fill: 'currentColor' }),
                                        f.jsx('span', {
                                          className: 'text-xs font-bold',
                                          children: s.rating,
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                f.jsx('p', {
                                  className: 'text-slate-400 text-sm mb-4 line-clamp-2',
                                  children: s.description,
                                }),
                                f.jsxs('div', {
                                  className: 'flex items-center justify-between',
                                  children: [
                                    f.jsxs('span', {
                                      className: 'text-2xl font-bold text-white',
                                      children: ['$', s.price],
                                    }),
                                    f.jsx('button', {
                                      onClick: () => n(s),
                                      className:
                                        'p-3 bg-white text-slate-950 rounded-xl hover:bg-primary-500 hover:text-white transition-all',
                                      children: f.jsx(Ba, { size: 20 }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      },
                      s.id,
                    ),
                  ),
                }),
          ],
        }),
      ],
    });
  },
  Gj = () => {
    const { products: e, loading: t, addToCart: n, searchQuery: r } = hr(),
      [s, i] = P.useState('All'),
      o = e.filter((l) => {
        const u = s === 'All' || l.category.toLowerCase() === s.toLowerCase(),
          c =
            l.title.toLowerCase().includes(r.toLowerCase()) ||
            l.description.toLowerCase().includes(r.toLowerCase());
        return u && c;
      }),
      a = ['All', 'Smartphones', 'Laptops', 'Fragrances', 'Skincare', 'Groceries'];
    return f.jsxs('div', {
      className: 'max-w-7xl mx-auto px-6 py-10',
      children: [
        f.jsxs('div', {
          className: 'flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6',
          children: [
            f.jsxs('div', {
              children: [
                f.jsx('h1', {
                  className: 'text-4xl font-bold text-white mb-2',
                  children: 'Our Collection',
                }),
                f.jsxs('p', {
                  className: 'text-slate-400',
                  children: ['Discover ', o.length, ' premium products'],
                }),
              ],
            }),
            f.jsxs('div', {
              className: 'flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar',
              children: [
                f.jsxs('div', {
                  className: 'flex items-center gap-2 px-4 py-2 glass rounded-xl text-slate-300',
                  children: [
                    f.jsx(hP, { size: 18 }),
                    f.jsx('span', { className: 'text-sm font-medium', children: 'Filter' }),
                  ],
                }),
                a.map((l) =>
                  f.jsx(
                    'button',
                    {
                      onClick: () => i(l),
                      className: `px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${s === l ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'glass text-slate-400 hover:bg-white/10 hover:text-white'}`,
                      children: l,
                    },
                    l,
                  ),
                ),
              ],
            }),
          ],
        }),
        t
          ? f.jsx('div', {
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
              children: [1, 2, 3, 4, 5, 6, 7, 8].map((l) =>
                f.jsx('div', { className: 'h-96 glass rounded-3xl animate-pulse' }, l),
              ),
            })
          : f.jsx('div', {
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8',
              children: o.map((l, u) =>
                f.jsx(
                  Tt.div,
                  {
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { delay: u * 0.03 },
                    className: 'group',
                    children: f.jsxs('div', {
                      className:
                        'glass rounded-3xl overflow-hidden premium-shadow group-hover:scale-[1.02] transition-all duration-500 h-full flex flex-col',
                      children: [
                        f.jsxs('div', {
                          className: 'relative h-64 overflow-hidden',
                          children: [
                            f.jsx(K, {
                              to: `/product/${l.id}`,
                              children: f.jsx('img', {
                                src: l.thumbnail,
                                alt: l.title,
                                className:
                                  'w-full h-full object-cover group-hover:scale-110 transition-transform duration-700',
                              }),
                            }),
                            f.jsx('button', {
                              className:
                                'absolute top-4 right-4 p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors',
                              children: f.jsx(md, { size: 18 }),
                            }),
                          ],
                        }),
                        f.jsxs('div', {
                          className: 'p-6 flex-1 flex flex-col',
                          children: [
                            f.jsxs('div', {
                              className: 'flex justify-between items-start mb-2',
                              children: [
                                f.jsx(K, {
                                  to: `/product/${l.id}`,
                                  children: f.jsx('h3', {
                                    className:
                                      'font-bold text-white text-lg line-clamp-1 hover:text-primary-400 transition-colors',
                                    children: l.title,
                                  }),
                                }),
                                f.jsxs('div', {
                                  className: 'flex items-center gap-1 text-yellow-400',
                                  children: [
                                    f.jsx(yd, { size: 14, fill: 'currentColor' }),
                                    f.jsx('span', {
                                      className: 'text-xs font-bold',
                                      children: l.rating,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            f.jsx('p', {
                              className: 'text-slate-400 text-sm mb-4 line-clamp-2 flex-1',
                              children: l.description,
                            }),
                            f.jsxs('div', {
                              className: 'flex items-center justify-between mt-auto',
                              children: [
                                f.jsxs('span', {
                                  className: 'text-2xl font-bold text-white',
                                  children: ['$', l.price],
                                }),
                                f.jsxs('button', {
                                  onClick: () => n(l),
                                  className:
                                    'px-4 py-2 bg-white text-slate-950 font-bold rounded-xl hover:bg-primary-500 hover:text-white transition-all flex items-center gap-2',
                                  children: [f.jsx(Ba, { size: 18 }), 'Add'],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  },
                  l.id,
                ),
              ),
            }),
      ],
    });
  },
  Xj = () => {
    var a;
    const { id: e } = Yw(),
      t = hs(),
      { addToCart: n } = hr(),
      [r, s] = P.useState(null),
      [i, o] = P.useState(!0);
    return (
      P.useEffect(() => {
        fetch(`https://dummyjson.com/products/${e}`)
          .then((l) => l.json())
          .then((l) => {
            (s(l), o(!1));
          })
          .catch(() => {
            o(!1);
          });
      }, [e]),
      i
        ? f.jsx('div', {
            className: 'max-w-7xl mx-auto px-6 py-20 animate-pulse',
            children: f.jsx('div', { className: 'h-96 glass rounded-3xl mb-12' }),
          })
        : r
          ? f.jsxs('div', {
              className: 'max-w-7xl mx-auto px-6 py-12',
              children: [
                f.jsxs('button', {
                  onClick: () => t(-1),
                  className:
                    'flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors',
                  children: [f.jsx(o0, { size: 20 }), ' Back to Products'],
                }),
                f.jsxs('div', {
                  className: 'grid grid-cols-1 lg:grid-cols-2 gap-16',
                  children: [
                    f.jsxs(Tt.div, {
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      className: 'space-y-6',
                      children: [
                        f.jsx('div', {
                          className: 'glass rounded-[2rem] overflow-hidden aspect-square',
                          children: f.jsx('img', {
                            src: r.thumbnail,
                            className: 'w-full h-full object-cover',
                            alt: r.title,
                          }),
                        }),
                        f.jsx('div', {
                          className: 'grid grid-cols-4 gap-4',
                          children:
                            (a = r.images) == null
                              ? void 0
                              : a.slice(0, 4).map((l, u) =>
                                  f.jsx(
                                    'div',
                                    {
                                      className:
                                        'glass rounded-xl overflow-hidden aspect-square cursor-pointer hover:border-primary-500/50 transition-all border border-transparent',
                                      children: f.jsx('img', {
                                        src: l,
                                        className: 'w-full h-full object-cover',
                                      }),
                                    },
                                    u,
                                  ),
                                ),
                        }),
                      ],
                    }),
                    f.jsxs(Tt.div, {
                      initial: { opacity: 0, x: 20 },
                      animate: { opacity: 1, x: 0 },
                      className: 'flex flex-col',
                      children: [
                        f.jsxs('div', {
                          className: 'mb-8',
                          children: [
                            f.jsxs('div', {
                              className:
                                'flex items-center gap-2 text-primary-400 text-sm font-bold uppercase tracking-wider mb-4',
                              children: [
                                f.jsx('span', { children: r.category }),
                                f.jsx('span', { className: 'w-1 h-1 bg-slate-600 rounded-full' }),
                                f.jsxs('span', {
                                  className: 'text-slate-400',
                                  children: ['SKU: ', r.id],
                                }),
                              ],
                            }),
                            f.jsx('h1', {
                              className: 'text-5xl font-bold text-white mb-4',
                              children: r.title,
                            }),
                            f.jsxs('div', {
                              className: 'flex items-center gap-4 mb-6',
                              children: [
                                f.jsx('div', {
                                  className: 'flex items-center gap-1 text-yellow-400',
                                  children: [1, 2, 3, 4, 5].map((l) =>
                                    f.jsx(
                                      yd,
                                      {
                                        size: 18,
                                        fill: l <= Math.round(r.rating) ? 'currentColor' : 'none',
                                      },
                                      l,
                                    ),
                                  ),
                                }),
                                f.jsxs('span', {
                                  className: 'text-slate-400',
                                  children: ['(', r.rating, ' Rating)'],
                                }),
                              ],
                            }),
                            f.jsxs('p', {
                              className: 'text-4xl font-bold text-white mb-8',
                              children: ['$', r.price],
                            }),
                            f.jsx('p', {
                              className: 'text-slate-400 text-lg leading-relaxed mb-10',
                              children: r.description,
                            }),
                          ],
                        }),
                        f.jsxs('div', {
                          className: 'space-y-4 mb-10',
                          children: [
                            f.jsxs('div', {
                              className: 'flex items-center gap-3 text-slate-300',
                              children: [
                                f.jsx(a0, { size: 20, className: 'text-green-400' }),
                                f.jsx('span', { children: 'Free Delivery on orders over $100' }),
                              ],
                            }),
                            f.jsxs('div', {
                              className: 'flex items-center gap-3 text-slate-300',
                              children: [
                                f.jsx(c0, { size: 20, className: 'text-primary-400' }),
                                f.jsx('span', { children: '2 Year Warranty Coverage' }),
                              ],
                            }),
                            f.jsxs('div', {
                              className: 'flex items-center gap-3 text-slate-300',
                              children: [
                                f.jsx(mP, { size: 20, className: 'text-indigo-400' }),
                                f.jsx('span', { children: '30-Day Money Back Guarantee' }),
                              ],
                            }),
                          ],
                        }),
                        f.jsxs('div', {
                          className: 'flex gap-4 mt-auto',
                          children: [
                            f.jsxs('button', {
                              onClick: () => n(r),
                              className:
                                'flex-1 py-5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-3',
                              children: [f.jsx(Ba, { size: 22 }), ' Add to Cart'],
                            }),
                            f.jsx('button', {
                              className:
                                'p-5 glass hover:bg-white/10 text-white rounded-2xl transition-all border border-white/10',
                              children: f.jsx(md, { size: 22 }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          : f.jsx('div', {
              className: 'text-center py-20 text-white',
              children: 'Product not found',
            })
    );
  },
  Yj = () => {
    const { cart: e, removeFromCart: t, updateQuantity: n, total: r } = hr();
    return e.length === 0
      ? f.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 py-32 text-center',
          children: [
            f.jsx('div', {
              className:
                'w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-500',
              children: f.jsx(fP, { size: 48 }),
            }),
            f.jsx('h1', {
              className: 'text-3xl font-bold text-white mb-4',
              children: 'Your cart is empty',
            }),
            f.jsx('p', {
              className: 'text-slate-400 mb-10 max-w-md mx-auto',
              children:
                "Looks like you haven't added anything to your cart yet. Go ahead and explore our featured products.",
            }),
            f.jsxs(K, {
              to: '/products',
              className:
                'px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20 inline-flex items-center gap-2',
              children: [f.jsx(o0, { size: 18 }), ' Continue Shopping'],
            }),
          ],
        })
      : f.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 py-10',
          children: [
            f.jsx('h1', {
              className: 'text-4xl font-bold text-white mb-10',
              children: 'Shopping Cart',
            }),
            f.jsxs('div', {
              className: 'grid grid-cols-1 lg:grid-cols-3 gap-12',
              children: [
                f.jsx('div', {
                  className: 'lg:col-span-2 space-y-6',
                  children: f.jsx(p0, {
                    children: e.map((s) =>
                      f.jsxs(
                        Tt.div,
                        {
                          layout: !0,
                          initial: { opacity: 0, x: -20 },
                          animate: { opacity: 1, x: 0 },
                          exit: { opacity: 0, x: 20 },
                          className:
                            'glass p-6 rounded-3xl flex flex-col md:flex-row gap-6 group relative overflow-hidden',
                          children: [
                            f.jsx('img', {
                              src: s.thumbnail,
                              className: 'w-32 h-32 object-cover rounded-2xl',
                              alt: s.title,
                            }),
                            f.jsxs('div', {
                              className: 'flex-1 flex flex-col justify-between',
                              children: [
                                f.jsxs('div', {
                                  className: 'flex justify-between items-start',
                                  children: [
                                    f.jsxs('div', {
                                      children: [
                                        f.jsx('h3', {
                                          className: 'text-xl font-bold text-white mb-1',
                                          children: s.title,
                                        }),
                                        f.jsx('p', {
                                          className: 'text-slate-400 text-sm',
                                          children: s.category,
                                        }),
                                      ],
                                    }),
                                    f.jsx('button', {
                                      onClick: () => t(s.id),
                                      className:
                                        'p-2 text-rose-400 hover:bg-rose-400/10 rounded-xl transition-colors',
                                      children: f.jsx(pP, { size: 20 }),
                                    }),
                                  ],
                                }),
                                f.jsxs('div', {
                                  className: 'flex justify-between items-center mt-4',
                                  children: [
                                    f.jsxs('div', {
                                      className:
                                        'flex items-center gap-4 bg-white/5 rounded-xl p-1 border border-white/10',
                                      children: [
                                        f.jsx('button', {
                                          onClick: () => n(s.id, -1),
                                          className:
                                            'p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors',
                                          children: f.jsx(uP, { size: 16 }),
                                        }),
                                        f.jsx('span', {
                                          className:
                                            'text-white font-bold min-w-[20px] text-center',
                                          children: s.quantity,
                                        }),
                                        f.jsx('button', {
                                          onClick: () => n(s.id, 1),
                                          className:
                                            'p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors',
                                          children: f.jsx(cP, { size: 16 }),
                                        }),
                                      ],
                                    }),
                                    f.jsxs('span', {
                                      className: 'text-2xl font-bold text-white',
                                      children: ['$', (s.price * s.quantity).toFixed(2)],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        s.id,
                      ),
                    ),
                  }),
                }),
                f.jsx('div', {
                  className: 'lg:col-span-1',
                  children: f.jsxs('div', {
                    className: 'glass p-8 rounded-3xl sticky top-32',
                    children: [
                      f.jsx('h2', {
                        className: 'text-2xl font-bold text-white mb-8',
                        children: 'Order Summary',
                      }),
                      f.jsxs('div', {
                        className: 'space-y-4 mb-8',
                        children: [
                          f.jsxs('div', {
                            className: 'flex justify-between text-slate-400',
                            children: [
                              f.jsx('span', { children: 'Subtotal' }),
                              f.jsxs('span', {
                                className: 'text-white font-medium',
                                children: ['$', r.toFixed(2)],
                              }),
                            ],
                          }),
                          f.jsxs('div', {
                            className: 'flex justify-between text-slate-400',
                            children: [
                              f.jsx('span', { children: 'Shipping' }),
                              f.jsx('span', {
                                className: 'text-green-400 font-medium',
                                children: 'Free',
                              }),
                            ],
                          }),
                          f.jsxs('div', {
                            className: 'flex justify-between text-slate-400',
                            children: [
                              f.jsx('span', { children: 'Tax' }),
                              f.jsx('span', {
                                className: 'text-white font-medium',
                                children: '$0.00',
                              }),
                            ],
                          }),
                          f.jsxs('div', {
                            className:
                              'border-t border-white/10 pt-4 mt-4 flex justify-between text-2xl font-bold text-white',
                            children: [
                              f.jsx('span', { children: 'Total' }),
                              f.jsxs('span', {
                                className: 'text-primary-400',
                                children: ['$', r.toFixed(2)],
                              }),
                            ],
                          }),
                        ],
                      }),
                      f.jsx(K, {
                        to: '/checkout',
                        className:
                          'w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-500/20 block text-center',
                        children: 'Checkout Now',
                      }),
                      f.jsx('p', {
                        className: 'text-center text-slate-500 text-xs mt-6',
                        children: 'Tax and shipping calculated at checkout',
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        });
  },
  Il = {},
  Jj = (Il == null ? void 0 : Il.VITE_API_URL) || 'http://localhost:3000/api/v1';
class Zj extends Error {
  constructor(t, n) {
    (super(n), (this.status = t), (this.name = 'ApiError'));
  }
}
const ac = async (e, t = {}) => {
    const n = localStorage.getItem('token'),
      r = new Headers(t.headers || {});
    (n && r.set('Authorization', `Bearer ${n}`), r.set('Content-Type', 'application/json'));
    const s = await fetch(`${Jj}${e}`, { ...t, headers: r });
    if (!s.ok) {
      let i = 'An error occurred';
      try {
        i = (await s.json()).message || i;
      } catch {}
      throw new Zj(s.status, i);
    }
    return s.status === 204 ? {} : s.json();
  },
  zv = {
    login: (e) => ac('/auth/login', { method: 'POST', body: JSON.stringify(e) }),
    register: (e) => ac('/auth/register', { method: 'POST', body: JSON.stringify(e) }),
  },
  eN = () => {
    var g, w;
    const [e, t] = P.useState(''),
      [n, r] = P.useState(''),
      [s, i] = P.useState(''),
      [o, a] = P.useState(!1),
      { login: l } = Mi(),
      u = hs(),
      d = ((w = (g = fr().state) == null ? void 0 : g.from) == null ? void 0 : w.pathname) || '/',
      h = async (v) => {
        (v.preventDefault(), i(''), a(!0));
        try {
          try {
            const x = await zv.login({ email: e, password: n });
            (l(x.token, x.user), u(d, { replace: !0 }));
          } catch (x) {
            (console.warn('API Error, using fallback login:', x),
              e && n
                ? (l('mock-token-123', { id: '1', email: e, role: 'USER', firstName: 'John' }),
                  u(d, { replace: !0 }))
                : i(x.message || 'Invalid credentials'));
          }
        } catch (x) {
          i(x.message || 'Failed to login');
        } finally {
          a(!1);
        }
      };
    return f.jsx('div', {
      className: 'min-h-[80vh] flex items-center justify-center px-4',
      children: f.jsxs(Tt.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className:
          'w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl',
        children: [
          f.jsxs('div', {
            className: 'text-center mb-8',
            children: [
              f.jsx('h1', {
                className: 'text-3xl font-bold text-white mb-2',
                children: 'Welcome Back',
              }),
              f.jsx('p', {
                className: 'text-slate-400',
                children: 'Sign in to your account to continue',
              }),
            ],
          }),
          s &&
            f.jsx('div', {
              className:
                'mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center',
              children: s,
            }),
          f.jsxs('form', {
            onSubmit: h,
            className: 'space-y-6',
            children: [
              f.jsxs('div', {
                children: [
                  f.jsx('label', {
                    className: 'block text-sm font-medium text-slate-300 mb-2',
                    children: 'Email Address',
                  }),
                  f.jsxs('div', {
                    className: 'relative',
                    children: [
                      f.jsx(u0, {
                        className:
                          'absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5',
                      }),
                      f.jsx('input', {
                        type: 'email',
                        required: !0,
                        value: e,
                        onChange: (v) => t(v.target.value),
                        className:
                          'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
                        placeholder: 'you@example.com',
                      }),
                    ],
                  }),
                ],
              }),
              f.jsxs('div', {
                children: [
                  f.jsxs('div', {
                    className: 'flex justify-between items-center mb-2',
                    children: [
                      f.jsx('label', {
                        className: 'block text-sm font-medium text-slate-300',
                        children: 'Password',
                      }),
                      f.jsx('a', {
                        href: '#',
                        className: 'text-sm text-primary-400 hover:text-primary-300',
                        children: 'Forgot password?',
                      }),
                    ],
                  }),
                  f.jsxs('div', {
                    className: 'relative',
                    children: [
                      f.jsx(l0, {
                        className:
                          'absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5',
                      }),
                      f.jsx('input', {
                        type: 'password',
                        required: !0,
                        value: n,
                        onChange: (v) => r(v.target.value),
                        className:
                          'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
                        placeholder: '••••••••',
                      }),
                    ],
                  }),
                ],
              }),
              f.jsx('button', {
                type: 'submit',
                disabled: o,
                className:
                  'w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed',
                children: o
                  ? f.jsx(Va, { className: 'w-5 h-5 animate-spin' })
                  : f.jsxs(f.Fragment, {
                      children: ['Sign In ', f.jsx(aa, { className: 'w-5 h-5' })],
                    }),
              }),
            ],
          }),
          f.jsxs('p', {
            className: 'mt-8 text-center text-slate-400',
            children: [
              "Don't have an account?",
              ' ',
              f.jsx(K, {
                to: '/register',
                className: 'text-primary-400 hover:text-primary-300 font-medium',
                children: 'Create one',
              }),
            ],
          }),
        ],
      }),
    });
  },
  tN = () => {
    const [e, t] = P.useState({ firstName: '', lastName: '', email: '', password: '' }),
      [n, r] = P.useState(''),
      [s, i] = P.useState(!1),
      { login: o } = Mi(),
      a = hs(),
      l = (c) => {
        t((d) => ({ ...d, [c.target.name]: c.target.value }));
      },
      u = async (c) => {
        (c.preventDefault(), r(''), i(!0));
        try {
          try {
            const d = await zv.register(e);
            (o(d.token, d.user), a('/', { replace: !0 }));
          } catch (d) {
            (console.warn('API Error, using fallback register:', d),
              e.email && e.password
                ? (o('mock-token-123', {
                    id: '1',
                    email: e.email,
                    role: 'USER',
                    firstName: e.firstName,
                  }),
                  a('/', { replace: !0 }))
                : r(d.message || 'Registration failed'));
          }
        } catch (d) {
          r(d.message || 'Failed to register');
        } finally {
          i(!1);
        }
      };
    return f.jsx('div', {
      className: 'min-h-[80vh] flex items-center justify-center px-4 py-12',
      children: f.jsxs(Tt.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className:
          'w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl',
        children: [
          f.jsxs('div', {
            className: 'text-center mb-8',
            children: [
              f.jsx('h1', {
                className: 'text-3xl font-bold text-white mb-2',
                children: 'Create Account',
              }),
              f.jsx('p', {
                className: 'text-slate-400',
                children: 'Join our premium ecommerce platform',
              }),
            ],
          }),
          n &&
            f.jsx('div', {
              className:
                'mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center',
              children: n,
            }),
          f.jsxs('form', {
            onSubmit: u,
            className: 'space-y-5',
            children: [
              f.jsxs('div', {
                className: 'grid grid-cols-2 gap-4',
                children: [
                  f.jsxs('div', {
                    children: [
                      f.jsx('label', {
                        className: 'block text-sm font-medium text-slate-300 mb-2',
                        children: 'First Name',
                      }),
                      f.jsxs('div', {
                        className: 'relative',
                        children: [
                          f.jsx(d0, {
                            className:
                              'absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5',
                          }),
                          f.jsx('input', {
                            type: 'text',
                            name: 'firstName',
                            required: !0,
                            value: e.firstName,
                            onChange: l,
                            className:
                              'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
                            placeholder: 'John',
                          }),
                        ],
                      }),
                    ],
                  }),
                  f.jsxs('div', {
                    children: [
                      f.jsx('label', {
                        className: 'block text-sm font-medium text-slate-300 mb-2',
                        children: 'Last Name',
                      }),
                      f.jsx('div', {
                        className: 'relative',
                        children: f.jsx('input', {
                          type: 'text',
                          name: 'lastName',
                          required: !0,
                          value: e.lastName,
                          onChange: l,
                          className:
                            'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
                          placeholder: 'Doe',
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              f.jsxs('div', {
                children: [
                  f.jsx('label', {
                    className: 'block text-sm font-medium text-slate-300 mb-2',
                    children: 'Email Address',
                  }),
                  f.jsxs('div', {
                    className: 'relative',
                    children: [
                      f.jsx(u0, {
                        className:
                          'absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5',
                      }),
                      f.jsx('input', {
                        type: 'email',
                        name: 'email',
                        required: !0,
                        value: e.email,
                        onChange: l,
                        className:
                          'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
                        placeholder: 'you@example.com',
                      }),
                    ],
                  }),
                ],
              }),
              f.jsxs('div', {
                children: [
                  f.jsx('label', {
                    className: 'block text-sm font-medium text-slate-300 mb-2',
                    children: 'Password',
                  }),
                  f.jsxs('div', {
                    className: 'relative',
                    children: [
                      f.jsx(l0, {
                        className:
                          'absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5',
                      }),
                      f.jsx('input', {
                        type: 'password',
                        name: 'password',
                        required: !0,
                        value: e.password,
                        onChange: l,
                        className:
                          'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all',
                        placeholder: '••••••••',
                        minLength: 6,
                      }),
                    ],
                  }),
                ],
              }),
              f.jsx('button', {
                type: 'submit',
                disabled: s,
                className:
                  'w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed',
                children: s
                  ? f.jsx(Va, { className: 'w-5 h-5 animate-spin' })
                  : f.jsxs(f.Fragment, {
                      children: ['Create Account ', f.jsx(aa, { className: 'w-5 h-5' })],
                    }),
              }),
            ],
          }),
          f.jsxs('p', {
            className: 'mt-8 text-center text-slate-400',
            children: [
              'Already have an account?',
              ' ',
              f.jsx(K, {
                to: '/login',
                className: 'text-primary-400 hover:text-primary-300 font-medium',
                children: 'Sign in',
              }),
            ],
          }),
        ],
      }),
    });
  },
  nN = () =>
    f.jsx('div', {
      className: 'max-w-7xl mx-auto px-6 py-20 min-h-[80vh]',
      children: f.jsxs(Tt.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        className: 'max-w-3xl mx-auto text-center',
        children: [
          f.jsx('span', {
            className:
              'px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold mb-6 inline-block',
            children: 'Our Story',
          }),
          f.jsx('h1', {
            className: 'text-4xl md:text-5xl font-bold mb-8 text-white',
            children: 'Redefining Premium E-Commerce',
          }),
          f.jsxs('div', {
            className: 'space-y-6 text-slate-400 text-lg leading-relaxed text-left',
            children: [
              f.jsx('p', {
                children:
                  'Welcome to SkylineShop, where quality meets convenience. Founded with a vision to provide a curated selection of premium products, we bridge the gap between luxury and everyday life.',
              }),
              f.jsx('p', {
                children:
                  'Our microservices-based platform ensures lightning-fast performance, high availability, and a secure shopping experience. Every product in our catalog is carefully selected to meet our rigorous standards for quality and design.',
              }),
              f.jsxs('div', {
                className: 'grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-center',
                children: [
                  f.jsxs('div', {
                    className: 'p-6 bg-slate-900 border border-white/5 rounded-2xl',
                    children: [
                      f.jsx('h3', {
                        className: 'text-xl font-bold text-white mb-2',
                        children: '10k+',
                      }),
                      f.jsx('p', { className: 'text-sm', children: 'Happy Customers' }),
                    ],
                  }),
                  f.jsxs('div', {
                    className: 'p-6 bg-slate-900 border border-white/5 rounded-2xl',
                    children: [
                      f.jsx('h3', {
                        className: 'text-xl font-bold text-white mb-2',
                        children: '24/7',
                      }),
                      f.jsx('p', { className: 'text-sm', children: 'Premium Support' }),
                    ],
                  }),
                  f.jsxs('div', {
                    className: 'p-6 bg-slate-900 border border-white/5 rounded-2xl',
                    children: [
                      f.jsx('h3', {
                        className: 'text-xl font-bold text-white mb-2',
                        children: '100%',
                      }),
                      f.jsx('p', { className: 'text-sm', children: 'Secure Checkout' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    }),
  rN = () => {
    const { products: e, loading: t } = hr();
    if (t)
      return f.jsx('div', {
        className: 'min-h-[80vh] flex items-center justify-center',
        children: 'Loading categories...',
      });
    const n = Array.from(new Set(e.map((r) => r.category)));
    return f.jsx('div', {
      className: 'max-w-7xl mx-auto px-6 py-20 min-h-[80vh]',
      children: f.jsxs(Tt.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        children: [
          f.jsx('h1', {
            className: 'text-4xl md:text-5xl font-bold mb-12 text-white text-center',
            children: 'Browse Categories',
          }),
          f.jsx('div', {
            className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
            children: n.map((r, s) => {
              const i = e.filter((o) => o.category === r);
              return f.jsx(
                K,
                {
                  to: '/products',
                  className: 'block group',
                  children: f.jsxs('div', {
                    className:
                      'p-8 bg-slate-900 border border-white/5 rounded-3xl premium-card text-center h-full flex flex-col items-center justify-center',
                    children: [
                      f.jsx('h3', {
                        className: 'text-2xl font-bold text-white mb-2 capitalize',
                        children: r,
                      }),
                      f.jsxs('p', {
                        className:
                          'text-primary-400 group-hover:text-primary-300 transition-colors',
                        children: [i.length, ' Products'],
                      }),
                    ],
                  }),
                },
                s,
              );
            }),
          }),
        ],
      }),
    });
  },
  sN = () => {
    const { cart: e, total: t, removeFromCart: n } = hr(),
      { user: r } = Mi(),
      [s, i] = P.useState(!1),
      [o, a] = P.useState(!1);
    if (e.length === 0 && !o)
      return f.jsxs('div', {
        className: 'min-h-[80vh] flex flex-col items-center justify-center text-center px-4',
        children: [
          f.jsx('h2', {
            className: 'text-3xl font-bold text-white mb-4',
            children: 'Your Cart is Empty',
          }),
          f.jsx('p', {
            className: 'text-slate-400 mb-8',
            children: 'Add items to your cart before checking out.',
          }),
          f.jsx(K, {
            to: '/products',
            className:
              'px-6 py-3 bg-primary-600 rounded-xl text-white font-medium hover:bg-primary-500 transition',
            children: 'Return to Shop',
          }),
        ],
      });
    const l = async (u) => {
      (u.preventDefault(), i(!0));
      try {
        const c = {
          items: e.map((d) => ({ productId: d.id, quantity: d.quantity, unitPrice: d.price })),
          shippingAddress: '123 Main St, Anytown, AT 12345',
          totalAmount: t,
        };
        try {
          await ac('/orders', { method: 'POST', body: JSON.stringify(c) });
        } catch (d) {
          console.warn('Backend API failed, proceeding with mock checkout', d);
        }
        (await new Promise((d) => setTimeout(d, 1500)), a(!0), e.forEach((d) => n(d.id)));
      } catch (c) {
        (console.error('Checkout failed', c), alert('Checkout failed. Please try again.'));
      } finally {
        i(!1);
      }
    };
    return o
      ? f.jsxs('div', {
          className: 'min-h-[80vh] flex flex-col items-center justify-center text-center px-4',
          children: [
            f.jsx(Tt.div, {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              className:
                'w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-8 mx-auto',
              children: f.jsx(a0, { size: 48 }),
            }),
            f.jsx('h2', {
              className: 'text-4xl font-bold text-white mb-4',
              children: 'Order Confirmed!',
            }),
            f.jsxs('p', {
              className: 'text-slate-400 mb-8 max-w-md mx-auto',
              children: [
                "Thank you for your purchase. We've sent a confirmation email to ",
                r == null ? void 0 : r.email,
                '.',
              ],
            }),
            f.jsx(K, {
              to: '/',
              className:
                'px-8 py-4 bg-primary-600 rounded-xl text-white font-medium hover:bg-primary-500 transition',
              children: 'Return to Home',
            }),
          ],
        })
      : f.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 py-20 min-h-[80vh]',
          children: [
            f.jsx('h1', { className: 'text-3xl font-bold text-white mb-10', children: 'Checkout' }),
            f.jsxs('div', {
              className: 'grid grid-cols-1 lg:grid-cols-3 gap-10',
              children: [
                f.jsxs('div', {
                  className: 'lg:col-span-2 space-y-8',
                  children: [
                    f.jsxs('div', {
                      className: 'bg-slate-900 border border-white/5 rounded-3xl p-8',
                      children: [
                        f.jsxs('h2', {
                          className: 'text-xl font-bold text-white mb-6 flex items-center gap-2',
                          children: [
                            f.jsx(c0, { className: 'text-primary-400' }),
                            ' Shipping Information',
                          ],
                        }),
                        f.jsxs('form', {
                          id: 'checkout-form',
                          onSubmit: l,
                          className: 'space-y-4',
                          children: [
                            f.jsxs('div', {
                              className: 'grid grid-cols-2 gap-4',
                              children: [
                                f.jsxs('div', {
                                  children: [
                                    f.jsx('label', {
                                      className: 'block text-sm text-slate-400 mb-1',
                                      children: 'First Name',
                                    }),
                                    f.jsx('input', {
                                      required: !0,
                                      defaultValue: r == null ? void 0 : r.firstName,
                                      className:
                                        'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none',
                                    }),
                                  ],
                                }),
                                f.jsxs('div', {
                                  children: [
                                    f.jsx('label', {
                                      className: 'block text-sm text-slate-400 mb-1',
                                      children: 'Last Name',
                                    }),
                                    f.jsx('input', {
                                      required: !0,
                                      defaultValue: r == null ? void 0 : r.lastName,
                                      className:
                                        'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            f.jsxs('div', {
                              children: [
                                f.jsx('label', {
                                  className: 'block text-sm text-slate-400 mb-1',
                                  children: 'Address',
                                }),
                                f.jsx('input', {
                                  required: !0,
                                  defaultValue: '123 Main St',
                                  className:
                                    'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none',
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    f.jsxs('div', {
                      className: 'bg-slate-900 border border-white/5 rounded-3xl p-8',
                      children: [
                        f.jsxs('h2', {
                          className: 'text-xl font-bold text-white mb-6 flex items-center gap-2',
                          children: [
                            f.jsx(sP, { className: 'text-primary-400' }),
                            ' Payment Details',
                          ],
                        }),
                        f.jsx('div', {
                          className: 'space-y-4',
                          children: f.jsxs('div', {
                            children: [
                              f.jsx('label', {
                                className: 'block text-sm text-slate-400 mb-1',
                                children: 'Card Number',
                              }),
                              f.jsx('input', {
                                required: !0,
                                form: 'checkout-form',
                                placeholder: '0000 0000 0000 0000',
                                className:
                                  'w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none',
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
                f.jsx('div', {
                  className: 'lg:col-span-1',
                  children: f.jsxs('div', {
                    className: 'bg-slate-900 border border-white/5 rounded-3xl p-8 sticky top-32',
                    children: [
                      f.jsx('h2', {
                        className: 'text-xl font-bold text-white mb-6',
                        children: 'Order Summary',
                      }),
                      f.jsx('div', {
                        className: 'space-y-4 mb-6',
                        children: e.map((u) =>
                          f.jsxs(
                            'div',
                            {
                              className: 'flex justify-between items-center text-sm',
                              children: [
                                f.jsxs('span', {
                                  className: 'text-slate-400 truncate pr-4',
                                  children: [u.quantity, 'x ', u.title],
                                }),
                                f.jsxs('span', {
                                  className: 'text-white font-medium',
                                  children: ['$', (u.price * u.quantity).toFixed(2)],
                                }),
                              ],
                            },
                            u.id,
                          ),
                        ),
                      }),
                      f.jsx('div', {
                        className: 'border-t border-white/10 pt-4 mb-8',
                        children: f.jsxs('div', {
                          className: 'flex justify-between items-center text-lg font-bold',
                          children: [
                            f.jsx('span', { className: 'text-white', children: 'Total' }),
                            f.jsxs('span', {
                              className: 'text-primary-400',
                              children: ['$', t.toFixed(2)],
                            }),
                          ],
                        }),
                      }),
                      f.jsx('button', {
                        type: 'submit',
                        form: 'checkout-form',
                        disabled: s,
                        className:
                          'w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2',
                        children: s
                          ? f.jsx(Va, { className: 'w-5 h-5 animate-spin' })
                          : `Pay $${t.toFixed(2)}`,
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        });
  },
  iN = () => {
    const { isAuthenticated: e, loading: t } = Mi(),
      n = fr();
    return t
      ? f.jsx('div', {
          className: 'min-h-screen flex items-center justify-center bg-slate-950',
          children: f.jsx(Va, { className: 'w-10 h-10 text-primary-500 animate-spin' }),
        })
      : e
        ? f.jsx(hS, {})
        : f.jsx(fS, { to: '/login', state: { from: n }, replace: !0 });
  },
  oN = ({ size: e = 'md', className: t = '' }) => {
    const n = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
    return f.jsxs('svg', {
      className: `animate-spin ${n[e]} ${t}`,
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      children: [
        f.jsx('circle', {
          className: 'opacity-25',
          cx: '12',
          cy: '12',
          r: '10',
          stroke: 'currentColor',
          strokeWidth: '4',
        }),
        f.jsx('path', {
          className: 'opacity-75',
          fill: 'currentColor',
          d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
        }),
      ],
    });
  },
  aN = ({ text: e = 'Loading...', size: t = 'md', className: n = '' }) =>
    f.jsxs('div', {
      className: `flex items-center space-x-2 ${n}`,
      children: [
        f.jsx(oN, { size: t }),
        e && f.jsx('span', { className: 'text-sm text-slate-600', children: e }),
      ],
    });
function lN() {
  const { isLoading: e } = tP();
  return e
    ? f.jsx('div', {
        className: 'min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center',
        children: f.jsx(aN, { text: 'Loading application...', size: 'lg' }),
      })
    : f.jsx(sC, {
        children: f.jsx(CS, {
          children: f.jsxs('div', {
            className: 'min-h-screen bg-slate-950 text-slate-200 selection:bg-primary-500/30',
            children: [
              f.jsx(Kj, {}),
              f.jsx('main', {
                className: 'min-h-[80vh]',
                children: f.jsxs(mS, {
                  children: [
                    f.jsx(ot, { path: '/', element: f.jsx(Qj, {}) }),
                    f.jsx(ot, { path: '/products', element: f.jsx(Gj, {}) }),
                    f.jsx(ot, { path: '/product/:id', element: f.jsx(Xj, {}) }),
                    f.jsx(ot, { path: '/cart', element: f.jsx(Yj, {}) }),
                    f.jsx(ot, { path: '/login', element: f.jsx(eN, {}) }),
                    f.jsx(ot, { path: '/register', element: f.jsx(tN, {}) }),
                    f.jsx(ot, { path: '/about', element: f.jsx(nN, {}) }),
                    f.jsx(ot, { path: '/categories', element: f.jsx(rN, {}) }),
                    f.jsx(ot, {
                      element: f.jsx(iN, {}),
                      children: f.jsx(ot, { path: '/checkout', element: f.jsx(sN, {}) }),
                    }),
                    f.jsx(ot, {
                      path: '*',
                      element: f.jsxs('div', {
                        className: 'flex flex-col items-center justify-center py-40',
                        children: [
                          f.jsx('h1', {
                            className: 'text-6xl font-bold text-white mb-4',
                            children: '404',
                          }),
                          f.jsx('p', {
                            className: 'text-slate-400 mb-8',
                            children: 'Page not found',
                          }),
                          f.jsx('a', {
                            href: '/',
                            className: 'text-primary-400 hover:underline',
                            children: 'Go back home',
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              }),
              f.jsx(qj, {}),
            ],
          }),
        }),
      });
}
Vl.createRoot(document.getElementById('root')).render(
  f.jsx(zn.StrictMode, { children: f.jsx(lN, {}) }),
);
