/* Inline JS Block 1 */
(() => {
  function u() {
    function n(t, e, i) {
      let r = document.createElement("a");
      r.href = t, r.target = i, r.rel = e, document.body.appendChild(r), r.click(), r.remove()
    }

    function o(t) {
      if (this.dataset.hydrated) {
        this.removeEventListener("click", o);
        return
      }
      t.preventDefault(), t.stopPropagation();
      let e = this.getAttribute("href");
      if (!e) return;
      if (/Mac|iPod|iPhone|iPad/u.test(navigator.userAgent) ? t.metaKey : t.ctrlKey) return n(e, "", "_blank");
      let r = this.getAttribute("rel") ?? "",
        c = this.getAttribute("target") ?? "";
      n(e, r, c)
    }

    function a(t) {
      if (this.dataset.hydrated) {
        this.removeEventListener("auxclick", o);
        return
      }
      t.preventDefault(), t.stopPropagation();
      let e = this.getAttribute("href");
      e && n(e, "", "_blank")
    }

    function s(t) {
      if (this.dataset.hydrated) {
        this.removeEventListener("keydown", s);
        return
      }
      if (t.key !== "Enter") return;
      t.preventDefault(), t.stopPropagation();
      let e = this.getAttribute("href");
      if (!e) return;
      let i = this.getAttribute("rel") ?? "",
        r = this.getAttribute("target") ?? "";
      n(e, i, r)
    }
    document.querySelectorAll("[data-nested-link]")
      .forEach(t => {
        t instanceof HTMLElement && (t.addEventListener("click", o), t.addEventListener("auxclick", a), t.addEventListener("keydown", s))
      })
  }
  return u
})()()

/* Inline JS Block 2 */
(() => {
  function i() {
    for (let e of document.querySelectorAll("[data-framer-original-sizes]")) {
      let t = e.getAttribute("data-framer-original-sizes");
      t === "" ? e.removeAttribute("sizes") : e.setAttribute("sizes", t), e.removeAttribute("data-framer-original-sizes")
    }
  }

  function a() {
    window.__framer_onRewriteBreakpoints = i
  }
  return a
})()()

/* Inline JS Block 3 */
var animator = (() => {
  var k = (e, t, r) => r > t ? t : r < e ? e : r;
  var F = () => {};

  function W(e) {
    let t;
    return () => (t === void 0 && (t = e()), t)
  }
  var j = e => e;
  var w = e => e * 1e3,
    v = e => e / 1e3;

  function X(e, t) {
    return t ? e * (1e3 / t) : 0
  }
  var Y = e => Array.isArray(e) && typeof e[0] == "number";
  var q = {
    value: null,
    addProjectionMetrics: null
  };
  var Z = {
    layout: 0,
    mainThread: 0,
    waapi: 0
  };
  var z = (e, t, r = 10) => {
    let o = "",
      s = Math.max(Math.round(t / r), 2);
    for (let n = 0; n < s; n++) o += e(n / (s - 1)) + ", ";
    return `linear(${o.substring(0,o.length-2)})`
  };

  function G(e) {
    let t = 0,
      r = 50,
      o = e.next(t);
    for (; !o.done && t < 2e4;) t += r, o = e.next(t);
    return t >= 2e4 ? 1 / 0 : t
  }

  function pe(e, t = 100, r) {
    let o = r({
        ...e,
        keyframes: [0, t]
      }),
      s = Math.min(G(o), 2e4);
    return {
      type: "keyframes",
      ease: n => o.next(s * n)
        .value / t,
      duration: v(s)
    }
  }
  var Pe = 5;

  function me(e, t, r) {
    let o = Math.max(t - Pe, 0);
    return X(r - e(o), t - o)
  }
  var l = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: .3,
    visualDuration: .3,
    restSpeed: {
      granular: .01,
      default: 2
    },
    restDelta: {
      granular: .005,
      default: .5
    },
    minDuration: .01,
    maxDuration: 10,
    minDamping: .05,
    maxDamping: 1
  };
  var H = .001;

  function fe({
    duration: e = l.duration,
    bounce: t = l.bounce,
    velocity: r = l.velocity,
    mass: o = l.mass
  }) {
    let s, n;
    F(e <= w(l.maxDuration), "Spring duration must be 10 seconds or less");
    let i = 1 - t;
    i = k(l.minDamping, l.maxDamping, i), e = k(l.minDuration, l.maxDuration, v(e)), i < 1 ? (s = m => {
      let p = m * i,
        c = p * e,
        u = p - r,
        d = $(m, i),
        g = Math.exp(-c);
      return H - u / d * g
    }, n = m => {
      let c = m * i * e,
        u = c * r + r,
        d = Math.pow(i, 2) * Math.pow(m, 2) * e,
        g = Math.exp(-c),
        y = $(Math.pow(m, 2), i);
      return (-s(m) + H > 0 ? -1 : 1) * ((u - d) * g) / y
    }) : (s = m => {
      let p = Math.exp(-m * e),
        c = (m - r) * e + 1;
      return -H + p * c
    }, n = m => {
      let p = Math.exp(-m * e),
        c = (r - m) * (e * e);
      return p * c
    });
    let f = 5 / e,
      a = Ce(s, n, f);
    if (e = w(e), isNaN(a)) return {
      stiffness: l.stiffness,
      damping: l.damping,
      duration: e
    };
    {
      let m = Math.pow(a, 2) * o;
      return {
        stiffness: m,
        damping: i * 2 * Math.sqrt(o * m),
        duration: e
      }
    }
  }
  var Ee = 12;

  function Ce(e, t, r) {
    let o = r;
    for (let s = 1; s < Ee; s++) o = o - e(o) / t(o);
    return o
  }

  function $(e, t) {
    return e * Math.sqrt(1 - t * t)
  }
  var Ie = ["duration", "bounce"],
    Ke = ["stiffness", "damping", "mass"];

  function ce(e, t) {
    return t.some(r => e[r] !== void 0)
  }

  function Be(e) {
    let t = {
      velocity: l.velocity,
      stiffness: l.stiffness,
      damping: l.damping,
      mass: l.mass,
      isResolvedFromDuration: !1,
      ...e
    };
    if (!ce(e, Ke) && ce(e, Ie))
      if (e.visualDuration) {
        let r = e.visualDuration,
          o = 2 * Math.PI / (r * 1.2),
          s = o * o,
          n = 2 * k(.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(s);
        t = {
          ...t,
          mass: l.mass,
          stiffness: s,
          damping: n
        }
      } else {
        let r = fe(e);
        t = {
          ...t,
          ...r,
          mass: l.mass
        }, t.isResolvedFromDuration = !0
      } return t
  }

  function D(e = l.visualDuration, t = l.bounce) {
    let r = typeof e != "object" ? {
        visualDuration: e,
        keyframes: [0, 1],
        bounce: t
      } : e,
      {
        restSpeed: o,
        restDelta: s
      } = r,
      n = r.keyframes[0],
      i = r.keyframes[r.keyframes.length - 1],
      f = {
        done: !1,
        value: n
      },
      {
        stiffness: a,
        damping: m,
        mass: p,
        duration: c,
        velocity: u,
        isResolvedFromDuration: d
      } = Be({
        ...r,
        velocity: -v(r.velocity || 0)
      }),
      g = u || 0,
      y = m / (2 * Math.sqrt(a * p)),
      h = i - n,
      T = v(Math.sqrt(a / p)),
      K = Math.abs(h) < 5;
    o || (o = K ? l.restSpeed.granular : l.restSpeed.default), s || (s = K ? l.restDelta.granular : l.restDelta.default);
    let M;
    if (y < 1) {
      let x = $(T, y);
      M = A => {
        let S = Math.exp(-y * T * A);
        return i - S * ((g + y * T * h) / x * Math.sin(x * A) + h * Math.cos(x * A))
      }
    } else if (y === 1) M = x => i - Math.exp(-T * x) * (h + (g + T * h) * x);
    else {
      let x = T * Math.sqrt(y * y - 1);
      M = A => {
        let S = Math.exp(-y * T * A),
          B = Math.min(x * A, 300);
        return i - S * ((g + y * T * h) * Math.sinh(B) + x * h * Math.cosh(B)) / x
      }
    }
    let V = {
      calculatedDuration: d && c || null,
      next: x => {
        let A = M(x);
        if (d) f.done = x >= c;
        else {
          let S = x === 0 ? g : 0;
          y < 1 && (S = x === 0 ? w(g) : me(M, x, A));
          let B = Math.abs(S) <= o,
            ke = Math.abs(i - A) <= s;
          f.done = B && ke
        }
        return f.value = f.done ? i : A, f
      },
      toString: () => {
        let x = Math.min(G(V), 2e4),
          A = z(S => V.next(x * S)
            .value, x, 30);
        return x + "ms " + A
      },
      toTransition: () => {}
    };
    return V
  }
  D.applyToOptions = e => {
    let t = pe(e, 100, D);
    return e.ease = t.ease, e.duration = w(t.duration), e.type = "keyframes", e
  };
  var ue = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"],
    _ = new Set(ue);
  var le = {};

  function de(e, t) {
    let r = W(e);
    return () => le[t] ?? r()
  }
  var xe = de(() => {
    try {
      document.createElement("div")
        .animate({
          opacity: 0
        }, {
          easing: "linear(0, 1)"
        })
    } catch {
      return !1
    }
    return !0
  }, "linearEasing");
  var O = ([e, t, r, o]) => `cubic-bezier(${e}, ${t}, ${r}, ${o})`;
  var Q = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: O([0, .65, .55, 1]),
    circOut: O([.55, 0, 1, .45]),
    backIn: O([.31, .01, .66, -.59]),
    backOut: O([.33, 1.53, .69, .99])
  };

  function J(e, t) {
    if (e) return typeof e == "function" ? xe() ? z(e, t) : "ease-out" : Y(e) ? O(e) : Array.isArray(e) ? e.map(r => J(r, t) || Q.easeOut) : Q[e]
  }

  function L(e, t, r, {
    delay: o = 0,
    duration: s = 300,
    repeat: n = 0,
    repeatType: i = "loop",
    ease: f = "easeOut",
    times: a
  } = {}, m = void 0) {
    let p = {
      [t]: r
    };
    a && (p.offset = a);
    let c = J(f, s);
    Array.isArray(c) && (p.easing = c), q.value && Z.waapi++;
    let u = {
      delay: o,
      duration: s,
      easing: Array.isArray(c) ? "linear" : c,
      fill: "both",
      iterations: n + 1,
      direction: i === "reverse" ? "alternate" : "normal"
    };
    m && (u.pseudoElement = m);
    let d = e.animate(p, u);
    return q.value && d.finished.finally(() => {
      Z.waapi--
    }), d
  }
  var ge = e => e.replace(/([a-z])([A-Z])/gu, "$1-$2")
    .toLowerCase();
  var ee = "framerAppearId",
    ye = "data-" + ge(ee);

  function Ae(e) {
    return e.props[ye]
  }
  var b = new Map,
    P = new Map;
  var E = (e, t) => {
    let r = _.has(t) ? "transform" : t;
    return `${e}: ${r}`
  };

  function te(e, t, r) {
    let o = E(e, t),
      s = b.get(o);
    if (!s) return null;
    let {
      animation: n,
      startTime: i
    } = s;

    function f() {
      window.MotionCancelOptimisedAnimation?.(e, t, r)
    }
    return n.onfinish = f, i === null || window.MotionHandoffIsComplete?.(e) ? (f(), null) : i
  }
  var R, C, re = new Set;

  function ze() {
    re.forEach(e => {
      e.animation.play(), e.animation.startTime = e.startTime
    }), re.clear()
  }

  function oe(e, t, r, o, s) {
    if (window.MotionIsMounted) return;
    let n = e.dataset[ee];
    if (!n) return;
    window.MotionHandoffAnimation = te;
    let i = E(n, t);
    C || (C = L(e, t, [r[0], r[0]], {
      duration: 1e4,
      ease: "linear"
    }), b.set(i, {
      animation: C,
      startTime: null
    }), window.MotionHandoffAnimation = te, window.MotionHasOptimisedAnimation = (a, m) => {
      if (!a) return !1;
      if (!m) return P.has(a);
      let p = E(a, m);
      return !!b.get(p)
    }, window.MotionHandoffMarkAsComplete = a => {
      P.has(a) && P.set(a, !0)
    }, window.MotionHandoffIsComplete = a => P.get(a) === !0, window.MotionCancelOptimisedAnimation = (a, m, p, c) => {
      let u = E(a, m),
        d = b.get(u);
      d && (p && c === void 0 ? p.postRender(() => {
        p.postRender(() => {
          d.animation.cancel()
        })
      }) : d.animation.cancel(), p && c ? (re.add(d), p.render(ze)) : (b.delete(u), b.size || (window.MotionCancelOptimisedAnimation = void 0)))
    }, window.MotionCheckAppearSync = (a, m, p) => {
      let c = Ae(a);
      if (!c) return;
      let u = window.MotionHasOptimisedAnimation?.(c, m),
        d = a.props.values?.[m];
      if (!u || !d) return;
      let g = p.on("change", y => {
        d.get() !== y && (window.MotionCancelOptimisedAnimation?.(c, m), g())
      });
      return g
    });
    let f = () => {
      C.cancel();
      let a = L(e, t, r, o);
      R === void 0 && (R = performance.now()), a.startTime = R, b.set(i, {
        animation: a,
        startTime: R
      }), s && s(a)
    };
    P.set(n, !1), C.ready ? C.ready.then(f)
      .catch(j) : f()
  }
  var ne = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"],
    Ge = {
      x: "translateX",
      y: "translateY",
      z: "translateZ",
      transformPerspective: "perspective"
    },
    $e = {
      translateX: "px",
      translateY: "px",
      translateZ: "px",
      x: "px",
      y: "px",
      z: "px",
      perspective: "px",
      transformPerspective: "px",
      rotate: "deg",
      rotateX: "deg",
      rotateY: "deg"
    };

  function he(e, t) {
    let r = $e[e];
    return !r || typeof t == "string" && t.endsWith(r) ? t : `${t}${r}`
  }

  function ie(e) {
    return ne.includes(e)
  }
  var Le = (e, t) => ne.indexOf(e) - ne.indexOf(t);

  function Te({
    transform: e,
    transformKeys: t
  }, r) {
    let o = {},
      s = !0,
      n = "";
    t.sort(Le);
    for (let i of t) {
      let f = e[i],
        a = !0;
      typeof f == "number" ? a = f === (i.startsWith("scale") ? 1 : 0) : a = parseFloat(f) === 0, a || (s = !1, n += `${Ge[i]||i}(${e[i]}) `), r && (o[i] = e[i])
    }
    return n = n.trim(), r ? n = r(o, n) : s && (n = "none"), n
  }

  function ae(e, t) {
    let r = new Set(Object.keys(e));
    for (let o in t) r.add(o);
    return Array.from(r)
  }

  function se(e, t) {
    let r = t - e.length;
    if (r <= 0) return e;
    let o = new Array(r)
      .fill(e[e.length - 1]);
    return e.concat(o)
  }

  function I(e) {
    return e * 1e3
  }
  var Se = {
      duration: .001
    },
    N = {
      opacity: 1,
      scale: 1,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      x: 0,
      y: 0,
      z: 0,
      rotate: 0,
      rotateX: 0,
      rotateY: 0
    };

  function ve(e, t, r, o, s) {
    return r.delay && (r.delay = I(r.delay)), r.type === "spring" ? Ne(e, t, r, o, s) : We(e, t, r, o, s)
  }

  function Re(e, t, r) {
    let o = {},
      s = 0,
      n = 0;
    for (let i of ae(e, t)) {
      let f = e[i] ?? N[i],
        a = t[i] ?? N[i];
      if (f === void 0 || a === void 0 || i !== "transformPerspective" && f === a) continue;
      i === "transformPerspective" && (o[i] = [f, a]);
      let m = Ze(f, a, r),
        {
          duration: p,
          keyframes: c
        } = m;
      p === void 0 || c === void 0 || (p > s && (s = p, n = c.length), o[i] = c)
    }
    return {
      keyframeValuesByProps: o,
      longestDuration: s,
      longestLength: n
    }
  }

  function Ne(e, t, r, o, s) {
    let n = {},
      {
        keyframeValuesByProps: i,
        longestDuration: f,
        longestLength: a
      } = Re(e, t, r);
    if (!a) return n;
    let m = {
        ease: "linear",
        duration: f,
        delay: r.delay
      },
      p = s ? Se : m,
      c = {};
    for (let [d, g] of Object.entries(i)) ie(d) ? c[d] = se(g, a) : n[d] = {
      keyframes: se(g, a),
      options: d === "opacity" ? m : p
    };
    let u = De(c, o);
    return u && (n.transform = {
      keyframes: u,
      options: p
    }), n
  }

  function Fe(e) {
    let {
      type: t,
      duration: r,
      ...o
    } = e;
    return {
      duration: I(r),
      ...o
    }
  }

  function We(e, t, r, o, s) {
    let n = Fe(r);
    if (!n) return;
    let i = {},
      f = s ? Se : n,
      a = {};
    for (let p of ae(e, t)) {
      let c = e[p] ?? N[p],
        u = t[p] ?? N[p];
      c === void 0 || u === void 0 || p !== "transformPerspective" && c === u || (ie(p) ? a[p] = [c, u] : i[p] = {
        keyframes: [c, u],
        options: p === "opacity" ? n : f
      })
    }
    let m = De(a, o);
    return m && (i.transform = {
      keyframes: m,
      options: f
    }), i
  }
  var je = ["duration", "bounce"],
    Xe = ["stiffness", "damping", "mass"];

  function we(e) {
    return Xe.some(t => t in e) ? !1 : je.some(t => t in e)
  }

  function Ye(e, t, r) {
    return we(r) ? `${e}-${t}-${r.duration}-${r.bounce}` : `${e}-${t}-${r.damping}-${r.stiffness}-${r.mass}`
  }

  function qe(e) {
    return we(e) ? {
      ...e,
      duration: I(e.duration)
    } : e
  }
  var be = new Map,
    Me = 10;

  function Ze(e, t, r) {
    let o = Ye(e, t, r),
      s = be.get(o);
    if (s) return s;
    let n = [e, t],
      i = D({
        ...qe(r),
        keyframes: n
      }),
      f = {
        done: !1,
        value: n[0]
      },
      a = [],
      m = 0;
    for (; !f.done && m < I(10);) f = i.next(m), a.push(f.value), m += Me;
    n = a;
    let p = m - Me,
      u = {
        keyframes: n,
        duration: p,
        ease: "linear"
      };
    return be.set(o, u), u
  }

  function De(e, t) {
    let r = [],
      o = Object.values(e)[0]?.length;
    if (!o) return;
    let s = Object.keys(e);
    for (let n = 0; n < o; n++) {
      let i = {};
      for (let [a, m] of Object.entries(e)) {
        let p = m[n];
        p !== void 0 && (i[a] = he(a, p))
      }
      let f = Te({
        transform: i,
        transformKeys: s
      }, t);
      r.push(f)
    }
    return r
  }

  function Ue(e, t) {
    if (!t)
      for (let r in e) {
        let o = e[r];
        return o?.legacy === !0 ? o : void 0
      }
  }

  function Oe(e, t, r, o, s, n) {
    for (let [i, f] of Object.entries(e)) {
      let a = n ? f[n] : void 0;
      if (a === null || !a && f.default === null) continue;
      let m = a ?? f.default ?? Ue(f, n);
      if (!m) continue;
      let {
        initial: p,
        animate: c,
        transformTemplate: u
      } = m;
      if (!p || !c) continue;
      let {
        transition: d,
        ...g
      } = c, y = ve(p, g, d, He(u, o), s);
      if (!y) continue;
      let h = {},
        T = {};
      for (let [M, V] of Object.entries(y)) h[M] = V.keyframes, T[M] = V.options;
      let K = n ? `:not(.hidden-${n}) ` : "";
      t(`${K}[${r}="${i}"]`, h, T)
    }
  }

  function He(e, t) {
    if (!(!e || !t)) return (r, o) => e.replace(t, o)
  }

  function Ve(e) {
    return e ? e.find(r => r.mediaQuery ? window.matchMedia(r.mediaQuery)
        .matches === !0 : !1)
      ?.hash : void 0
  }
  var Lr = {
    animateAppearEffects: Oe,
    getActiveVariantHash: Ve,
    spring: D,
    startOptimizedAppearAnimation: oe
  };
  return Lr
})()

/* Inline JS Block 4 */
{
  "1qu1f36": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "wgljk8": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0.5,
          "duration": 1,
          "ease": [0.5, 1, 0.89, 1],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    },
    "9ip0ly": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0.5,
          "duration": 1,
          "ease": [0.5, 1, 0.89, 1],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    },
    "57keop": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0.5,
          "duration": 1,
          "ease": [0.5, 1, 0.89, 1],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "xjcdrk": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "ceobpu": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "iok8vc": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "78gpn3": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "7ag529": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "roab4s": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "tdrsk2": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "1dp1pmp": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "1lcp6bd": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    },
    "1r1q3e1": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    },
    "1auuoho": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "x": 0,
        "y": 0
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transformPerspective": 1200,
        "transition": {
          "delay": 0,
          "duration": 0.5,
          "ease": [0.5, 0, 0.88, 0.77],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "gqopxx": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "x": 0,
        "y": 10
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transition": {
          "delay": 1.2,
          "duration": 0.4,
          "ease": [0.44, 0, 0.56, 1],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  },
  "1wwcyo4": {
    "default": {
      "initial": {
        "opacity": 0.001,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "x": 0,
        "y": 10
      },
      "animate": {
        "opacity": 1,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1,
        "skewX": 0,
        "skewY": 0,
        "transition": {
          "delay": 1,
          "duration": 0.4,
          "ease": [0.44, 0, 0.56, 1],
          "type": "tween"
        },
        "x": 0,
        "y": 0
      }
    }
  }
}

/* Inline JS Block 5 */
[{
  "hash": "rgtgs2",
  "mediaQuery": "(min-width: 1200px)"
}, {
  "hash": "57keop",
  "mediaQuery": "(min-width: 810px) and (max-width: 1199px)"
}, {
  "hash": "9ip0ly",
  "mediaQuery": "(max-width: 809px)"
}, {
  "hash": "zclkw6",
  "mediaQuery": "(min-width: 1200px)"
}, {
  "hash": "1r1q3e1",
  "mediaQuery": "(min-width: 810px) and (max-width: 1199px)"
}, {
  "hash": "1auuoho",
  "mediaQuery": "(max-width: 809px)"
}]

/* Inline JS Block 6 */
(() => {
  function c(i, o, m) {
    if (window.__framer_disable_appear_effects_optimization__ || typeof animator > "u") return;
    let e = {
      detail: {
        bg: document.hidden
      }
    };
    requestAnimationFrame(() => {
      let a = "framer-appear-start";
      performance.mark(a, e), animator.animateAppearEffects(JSON.parse(window.__framer__appearAnimationsContent.text), (s, p, d) => {
          let t = document.querySelector(s);
          if (t)
            for (let [r, f] of Object.entries(p)) animator.startOptimizedAppearAnimation(t, r, f, d[r])
        }, i, o, m && window.matchMedia("(prefers-reduced-motion:reduce)")
        .matches === !0, animator.getActiveVariantHash(JSON.parse(window.__framer__breakpoints.text)));
      let n = "framer-appear-end";
      performance.mark(n, e), performance.measure("framer-appear", {
        start: a,
        end: n,
        detail: e.detail
      })
    })
  }
  return c
})()("data-framer-appear-id", "__Appear_Animation_Transform__", false)

/* Inline JS Block 7 */
import {
  a as Se
} from "./chunk-ULM2G2QM.mjs";
import {
  g as ze
} from "./chunk-BSYDCOZL.mjs";
import "./chunk-42U43NKG.mjs";
import {
  $ as dt,
  Aa as xt,
  B as i,
  Ba as Y,
  Da as bt,
  Ea as ce,
  Ga as re,
  H as rt,
  Ha as vt,
  I as xe,
  Ia as wt,
  J as be,
  Ja as It,
  K,
  L as ve,
  M as at,
  Ma as B,
  Na as Ie,
  P as ot,
  Pa as Ce,
  Q as nt,
  Qa as te,
  R,
  T as it,
  Ta as ke,
  U as st,
  Ua as S,
  Va as X,
  W as lt,
  Wa as Ue,
  X as Pe,
  Xa as Ct,
  Y as Me,
  Z as ct,
  _ as G,
  ba as W,
  c as y,
  d as Je,
  da as mt,
  f as ee,
  fa as I,
  g as N,
  ga as ft,
  h as Ze,
  i as Ke,
  ia as U,
  j as De,
  ja as se,
  k as Qe,
  l as j,
  la as we,
  m as $e,
  n as P,
  pa as pt,
  q as T,
  qa as ut,
  r as k,
  ra as A,
  s as et,
  sa as H,
  ta as ne,
  u as Ne,
  ua as ht,
  v as e,
  va as yt,
  w as L,
  wa as gt,
  x as w,
  y as tt,
  z as M
} from "./chunk-JVUCOR3Y.mjs";
import "./chunk-HZL4YIMB.mjs";
import {
  b as O,
  c as p
} from "./chunk-A3IIQ6X3.mjs";
var At = "default" in be ? rt : be,
  Re = {},
  kt = At;
Re.createRoot = kt.createRoot;
Re.hydrateRoot = kt.hydrateRoot;
var Ee = Re.createRoot,
  Rt = Re.hydrateRoot;
Ie.loadFonts([]);
var Ft = [{
    explicitInter: !0,
    fonts: []
  }],
  Vt = [".framer-Ov6PI .framer-styles-preset-d12qnh:not(.rich-text-wrapper), .framer-Ov6PI .framer-styles-preset-d12qnh.rich-text-wrapper a { --framer-link-current-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #efe7d2); --framer-link-current-text-decoration: none; --framer-link-hover-text-color: var(--token-ba35ffdc-68bb-41bc-880c-4aa29d4488ec, #cfbe91); --framer-link-hover-text-decoration: none; --framer-link-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #efe7d2); --framer-link-text-decoration: none; transition: color 0.3s cubic-bezier(0.5, 0, 0.88, 0.77) 0s; }"],
  _t = "framer-Ov6PI";
Ie.loadFonts(["GF;Forum-regular"]);
var Lt = [{
    explicitInter: !0,
    fonts: [{
      family: "Forum",
      source: "google",
      style: "normal",
      url: "https://fonts.gstatic.com/s/forum/v18/6aey4Ky-Vb8Ew_ITMJMa3mnT.woff2",
      weight: "400"
    }]
  }],
  Dt = ['.framer-KCbCf .framer-styles-preset-6pfvm8:not(.rich-text-wrapper), .framer-KCbCf .framer-styles-preset-6pfvm8.rich-text-wrapper p { --framer-font-family: "Forum", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 64px; --framer-font-style: normal; --framer-font-weight: 400; --framer-letter-spacing: 2px; --framer-line-height: 110%; --framer-paragraph-spacing: 20px; --framer-text-alignment: center; --framer-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #dac5a7); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: uppercase; }', '@media (max-width: 1399px) and (min-width: 1200px) { .framer-KCbCf .framer-styles-preset-6pfvm8:not(.rich-text-wrapper), .framer-KCbCf .framer-styles-preset-6pfvm8.rich-text-wrapper p { --framer-font-family: "Forum", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 56px; --framer-font-style: normal; --framer-font-weight: 400; --framer-letter-spacing: 2px; --framer-line-height: 110%; --framer-paragraph-spacing: 20px; --framer-text-alignment: center; --framer-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #dac5a7); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: uppercase; } }', '@media (max-width: 1199px) and (min-width: 810px) { .framer-KCbCf .framer-styles-preset-6pfvm8:not(.rich-text-wrapper), .framer-KCbCf .framer-styles-preset-6pfvm8.rich-text-wrapper p { --framer-font-family: "Forum", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 48px; --framer-font-style: normal; --framer-font-weight: 400; --framer-letter-spacing: 2px; --framer-line-height: 110%; --framer-paragraph-spacing: 20px; --framer-text-alignment: center; --framer-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #dac5a7); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: uppercase; } }', '@media (max-width: 809px) and (min-width: 0px) { .framer-KCbCf .framer-styles-preset-6pfvm8:not(.rich-text-wrapper), .framer-KCbCf .framer-styles-preset-6pfvm8.rich-text-wrapper p { --framer-font-family: "Forum", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 32px; --framer-font-style: normal; --framer-font-weight: 400; --framer-letter-spacing: 2px; --framer-line-height: 110%; --framer-paragraph-spacing: 20px; --framer-text-alignment: center; --framer-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #dac5a7); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: uppercase; } }'],
  Nt = "framer-KCbCf";
var Ht = {
    k8UcUQKux: {
      hover: !0
    }
  },
  qt = "framer-Vs8AD",
  Yt = {
    k8UcUQKux: "framer-v-1eodogi"
  };

function Xt(t, ...r) {
  let a = {};
  return r?.forEach(o => o && Object.assign(a, t[o])), a
}
var Jt = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  Zt = ({
    value: t,
    children: r
  }) => {
    let a = j(w),
      o = t ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(w.Provider, {
      value: n,
      children: r
    })
  },
  Kt = i.create(y),
  Qt = ({
    height: t,
    id: r,
    tap2: a,
    width: o,
    ...n
  }) => ({
    ...n,
    UdJC1_vBf: a ?? n.UdJC1_vBf
  }),
  $t = (t, r) => t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  er = N(function(t, r) {
    let {
      activeLocale: a,
      setLocale: o
    } = R(), {
      style: n,
      className: l,
      layoutId: s,
      variant: u,
      UdJC1_vBf: x,
      ...d
    } = Qt(t), {
      baseVariant: g,
      classNames: C,
      clearLoadingGesture: F,
      gestureHandlers: z,
      gestureVariant: h,
      isLoading: J,
      setGestureState: V,
      setVariant: D,
      variants: b
    } = B({
      defaultVariant: "k8UcUQKux",
      enabledGestures: Ht,
      variant: u,
      variantClassNames: Yt
    }), f = $t(t, b), {
      activeVariantCallback: E,
      delay: Z
    } = re(g), v = E(async (...ie) => {
      if (V({
          isPressed: !1
        }), x && await x(...ie) === !1) return !1
    }), c = k(null), _ = P(), ae = [], $ = A();
    return e(M, {
      id: s ?? _,
      children: e(Kt, {
        animate: b,
        initial: !1,
        children: e(Zt, {
          value: Jt,
          children: e(i.div, {
            ...d,
            ...z,
            className: I(qt, ...ae, "framer-1eodogi", l, C),
            "data-border": !0,
            "data-framer-name": "Variant 1",
            "data-highlight": !0,
            layoutDependency: f,
            layoutId: "k8UcUQKux",
            onTap: v,
            ref: r ?? c,
            style: {
              "--border-bottom-width": "1px",
              "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))",
              "--border-left-width": "1px",
              "--border-right-width": "1px",
              "--border-style": "solid",
              "--border-top-width": "1px",
              backgroundColor: "var(--token-cd2934a7-4e35-4347-a32c-9650fca4db23, rgba(24, 24, 24, 0.5))",
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              ...n
            },
            variants: {
              "k8UcUQKux-hover": {
                "--border-color": "var(--token-52eaa3b2-9b53-4c12-9790-fce4171dff3e, rgb(78, 76, 71))",
                backgroundColor: "var(--token-c18e5c55-e670-494b-9afe-b018358f3867, rgb(30, 30, 30))"
              }
            },
            ...Xt({
              "k8UcUQKux-hover": {
                "data-framer-name": void 0
              }
            }, g, h),
            children: L(i.div, {
              className: "framer-fwto7e",
              layoutDependency: f,
              layoutId: "hiDyxaPYs",
              children: [e(i.div, {
                className: "framer-lovqnv",
                "data-framer-name": "Line",
                layoutDependency: f,
                layoutId: "cbaVqhxUS",
                style: {
                  backgroundColor: "rgb(239, 230, 210)",
                  rotate: -45
                },
                variants: {
                  "k8UcUQKux-hover": {
                    rotate: 0
                  }
                }
              }), e(i.div, {
                className: "framer-gk5npz",
                "data-framer-name": "Line",
                layoutDependency: f,
                layoutId: "BWtZjtq2h",
                style: {
                  backgroundColor: "rgb(239, 230, 210)",
                  rotate: 45
                },
                variants: {
                  "k8UcUQKux-hover": {
                    rotate: 0
                  }
                }
              })]
            })
          })
        })
      })
    })
  }),
  tr = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-Vs8AD.framer-1jvsus0, .framer-Vs8AD .framer-1jvsus0 { display: block; }", ".framer-Vs8AD.framer-1eodogi { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 5px; height: 41px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 41px; will-change: var(--framer-will-change-override, transform); }", ".framer-Vs8AD .framer-fwto7e { flex: none; height: 13px; overflow: visible; position: relative; width: 20px; }", ".framer-Vs8AD .framer-lovqnv, .framer-Vs8AD .framer-gk5npz { flex: none; height: 1px; left: 0px; position: absolute; right: 0px; top: calc(46.15384615384618% - 1px / 2); z-index: 1; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-Vs8AD.framer-1eodogi { gap: 0px; } .framer-Vs8AD.framer-1eodogi > * { margin: 0px; margin-bottom: calc(5px / 2); margin-top: calc(5px / 2); } .framer-Vs8AD.framer-1eodogi > :first-child { margin-top: 0px; } .framer-Vs8AD.framer-1eodogi > :last-child { margin-bottom: 0px; } }", '.framer-Vs8AD[data-border="true"]::after, .framer-Vs8AD [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  de = U(er, tr, "framer-Vs8AD"),
  Ge = de;
de.displayName = "Menu/Menu Nav Close Toggle";
de.defaultProps = {
  height: 41,
  width: 41
};
W(de, {
  UdJC1_vBf: {
    title: "Tap 2",
    type: G.EventHandler
  }
});
S(de, [{
  explicitInter: !0,
  fonts: []
}], {
  supportsExplicitInterCodegen: !0
});
var rr = X(Ge),
  ar = ["EGqK4uSJI", "ysPOVDWMi", "kQwlISGHm"],
  or = "framer-lbxxG",
  nr = {
    EGqK4uSJI: "framer-v-1ejo7hz",
    kQwlISGHm: "framer-v-14abo59",
    ysPOVDWMi: "framer-v-1u9ksd2"
  };

function Pt(t, ...r) {
  let a = {};
  return r?.forEach(o => o && Object.assign(a, t[o])), a
}
var ir = {
    duration: 0,
    type: "tween"
  },
  sr = ({
    value: t,
    children: r
  }) => {
    let a = j(w),
      o = t ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(w.Provider, {
      value: n,
      children: r
    })
  },
  lr = i.create(y),
  cr = {
    Desktop: "EGqK4uSJI",
    Phone: "kQwlISGHm",
    Tablet: "ysPOVDWMi"
  },
  dr = ({
    height: t,
    id: r,
    menuClose: a,
    width: o,
    ...n
  }) => ({
    ...n,
    variant: cr[n.variant] ?? n.variant ?? "EGqK4uSJI",
    woAUVjEwf: a ?? n.woAUVjEwf
  }),
  mr = (t, r) => t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  fr = N(function(t, r) {
    let a = k(null),
      o = r ?? a,
      n = P(),
      {
        activeLocale: l,
        setLocale: s
      } = R(),
      u = A(),
      {
        style: x,
        className: d,
        layoutId: g,
        variant: C,
        woAUVjEwf: F,
        ...z
      } = dr(t),
      {
        baseVariant: h,
        classNames: J,
        clearLoadingGesture: V,
        gestureHandlers: D,
        gestureVariant: b,
        isLoading: f,
        setGestureState: E,
        setVariant: Z,
        variants: v
      } = B({
        cycleOrder: ar,
        defaultVariant: "EGqK4uSJI",
        ref: o,
        variant: C,
        variantClassNames: nr
      }),
      c = mr(t, v),
      {
        activeVariantCallback: _,
        delay: ae
      } = re(h),
      $ = _(async (...ge) => {
        if (F && await F(...ge) === !1) return !1
      }),
      ie = _(async (...ge) => {
        if (F && await F(...ge) === !1) return !1
      }),
      q = I(or, ...[Nt, _t]);
    return e(M, {
      id: g ?? n,
      children: e(lr, {
        animate: v,
        initial: !1,
        children: e(sr, {
          value: ir,
          children: e(i.div, {
            ...z,
            ...D,
            className: I(q, "framer-1ejo7hz", d, J),
            "data-framer-name": "Desktop",
            layoutDependency: c,
            layoutId: "EGqK4uSJI",
            ref: o,
            style: {
              ...x
            },
            ...Pt({
              kQwlISGHm: {
                "data-framer-name": "Phone"
              },
              ysPOVDWMi: {
                "data-framer-name": "Tablet"
              }
            }, h, b),
            children: L(i.div, {
              className: "framer-2vbwoo",
              "data-border": !0,
              "data-framer-name": "Menu",
              layoutDependency: c,
              layoutId: "dU_Zutn05",
              style: {
                "--border-bottom-width": "1px",
                "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))",
                "--border-left-width": "1px",
                "--border-right-width": "1px",
                "--border-style": "solid",
                "--border-top-width": "1px",
                backgroundColor: "rgb(17, 17, 17)",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16
              },
              children: [L(i.div, {
                className: "framer-b4teiz",
                "data-framer-name": "Menu Inner",
                layoutDependency: c,
                layoutId: "K4ZFiAL65",
                children: [L(i.div, {
                  className: "framer-1j5lppg",
                  layoutDependency: c,
                  layoutId: "s6n7TK5jU",
                  children: [e(i.div, {
                    className: "framer-5oscp7",
                    "data-border": !0,
                    "data-framer-name": "Icon",
                    layoutDependency: c,
                    layoutId: "t1Ito7YeZ",
                    style: {
                      "--border-bottom-width": "1px",
                      "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))",
                      "--border-left-width": "1px",
                      "--border-right-width": "1px",
                      "--border-style": "solid",
                      "--border-top-width": "1px",
                      rotate: -45
                    }
                  }), e(i.div, {
                    className: "framer-1xm3t8i",
                    "data-framer-name": "Line",
                    layoutDependency: c,
                    layoutId: "AkZZ33Z5w",
                    style: {
                      backgroundColor: "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))"
                    }
                  }), e(i.div, {
                    className: "framer-1st33s4",
                    "data-border": !0,
                    "data-framer-name": "Icon",
                    layoutDependency: c,
                    layoutId: "FOdAgfYsC",
                    style: {
                      "--border-bottom-width": "1px",
                      "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))",
                      "--border-left-width": "1px",
                      "--border-right-width": "1px",
                      "--border-style": "solid",
                      "--border-top-width": "1px",
                      rotate: -45
                    }
                  })]
                }), e(te, {
                  __fromCanvasComponent: !0,
                  children: e(y, {
                    children: e(i.p, {
                      className: "framer-styles-preset-6pfvm8",
                      "data-styles-preset": "VmwLWH22Z",
                      children: e(Y, {
                        href: {
                          webPageId: "W61OseJy9"
                        },
                        motionChild: !0,
                        nodeId: "ySIwIlu6J",
                        openInNewTab: !1,
                        scopeId: "ey9RMFL0A",
                        smoothScroll: !1,
                        children: e(i.a, {
                          className: "framer-styles-preset-d12qnh",
                          "data-styles-preset": "j7pNHSisc",
                          children: "Menu"
                        })
                      })
                    })
                  }),
                  className: "framer-1ryfvtr",
                  "data-highlight": !0,
                  fonts: ["Inter"],
                  layoutDependency: c,
                  layoutId: "ySIwIlu6J",
                  onTap: $,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), e(te, {
                  __fromCanvasComponent: !0,
                  children: e(y, {
                    children: e(i.p, {
                      className: "framer-styles-preset-6pfvm8",
                      "data-styles-preset": "VmwLWH22Z",
                      children: e(Y, {
                        href: {
                          webPageId: "YCbNyRkzE"
                        },
                        motionChild: !0,
                        nodeId: "zYNdZsQs0",
                        openInNewTab: !1,
                        scopeId: "ey9RMFL0A",
                        smoothScroll: !1,
                        children: e(i.a, {
                          className: "framer-styles-preset-d12qnh",
                          "data-styles-preset": "j7pNHSisc",
                          children: "Reservation"
                        })
                      })
                    })
                  }),
                  className: "framer-1fhc25u",
                  "data-highlight": !0,
                  fonts: ["Inter"],
                  layoutDependency: c,
                  layoutId: "zYNdZsQs0",
                  onTap: $,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), e(te, {
                  __fromCanvasComponent: !0,
                  children: e(y, {
                    children: e(i.p, {
                      className: "framer-styles-preset-6pfvm8",
                      "data-styles-preset": "VmwLWH22Z",
                      children: e(Y, {
                        href: {
                          webPageId: "OFVwkEg7d"
                        },
                        motionChild: !0,
                        nodeId: "ddAFYVnus",
                        openInNewTab: !1,
                        scopeId: "ey9RMFL0A",
                        smoothScroll: !1,
                        children: e(i.a, {
                          className: "framer-styles-preset-d12qnh",
                          "data-styles-preset": "j7pNHSisc",
                          children: "About"
                        })
                      })
                    })
                  }),
                  className: "framer-1s8wozh",
                  "data-highlight": !0,
                  fonts: ["Inter"],
                  layoutDependency: c,
                  layoutId: "ddAFYVnus",
                  onTap: $,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), e(te, {
                  __fromCanvasComponent: !0,
                  children: e(y, {
                    children: e(i.p, {
                      className: "framer-styles-preset-6pfvm8",
                      "data-styles-preset": "VmwLWH22Z",
                      children: e(Y, {
                        href: {
                          webPageId: "xZrfMWLUB"
                        },
                        motionChild: !0,
                        nodeId: "CZY77IS8a",
                        openInNewTab: !1,
                        scopeId: "ey9RMFL0A",
                        smoothScroll: !1,
                        children: e(i.a, {
                          className: "framer-styles-preset-d12qnh",
                          "data-styles-preset": "j7pNHSisc",
                          children: "Contact"
                        })
                      })
                    })
                  }),
                  className: "framer-1isjnk2",
                  "data-highlight": !0,
                  fonts: ["Inter"],
                  layoutDependency: c,
                  layoutId: "CZY77IS8a",
                  onTap: $,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), e(te, {
                  __fromCanvasComponent: !0,
                  children: e(y, {
                    children: e(i.p, {
                      className: "framer-styles-preset-6pfvm8",
                      "data-styles-preset": "VmwLWH22Z",
                      children: e(Y, {
                        href: {
                          webPageId: "BBWv5VG0V"
                        },
                        motionChild: !0,
                        nodeId: "qZwqLsZoN",
                        openInNewTab: !1,
                        scopeId: "ey9RMFL0A",
                        smoothScroll: !1,
                        children: e(i.a, {
                          className: "framer-styles-preset-d12qnh",
                          "data-styles-preset": "j7pNHSisc",
                          children: "Blog"
                        })
                      })
                    })
                  }),
                  className: "framer-gzom6o",
                  "data-highlight": !0,
                  fonts: ["Inter"],
                  layoutDependency: c,
                  layoutId: "qZwqLsZoN",
                  onTap: $,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), L(i.div, {
                  className: "framer-9c353n",
                  layoutDependency: c,
                  layoutId: "CE0LeouLD",
                  children: [e(i.div, {
                    className: "framer-1kgg8ta",
                    "data-border": !0,
                    "data-framer-name": "Icon",
                    layoutDependency: c,
                    layoutId: "VbZr0PDOw",
                    style: {
                      "--border-bottom-width": "1px",
                      "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))",
                      "--border-left-width": "1px",
                      "--border-right-width": "1px",
                      "--border-style": "solid",
                      "--border-top-width": "1px",
                      rotate: -45
                    }
                  }), e(i.div, {
                    className: "framer-1srcj8",
                    "data-framer-name": "Line",
                    layoutDependency: c,
                    layoutId: "DPCI1QDTP",
                    style: {
                      backgroundColor: "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))"
                    }
                  }), e(i.div, {
                    className: "framer-198odx",
                    "data-border": !0,
                    "data-framer-name": "Icon",
                    layoutDependency: c,
                    layoutId: "y1OtsH8q8",
                    style: {
                      "--border-bottom-width": "1px",
                      "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))",
                      "--border-left-width": "1px",
                      "--border-right-width": "1px",
                      "--border-style": "solid",
                      "--border-top-width": "1px",
                      rotate: -45
                    }
                  })]
                })]
              }), e(H, {
                height: 41,
                width: "41px",
                y: (u?.y || 0) + (16 + ((u?.height || 960) - 32 - ((u?.height || 960) - 32) * 1) / 2) + 32,
                ...Pt({
                  kQwlISGHm: {
                    y: (u?.y || 0) + (12 + ((u?.height || 960) - 24 - ((u?.height || 960) - 24) * 1) / 2) + 24
                  }
                }, h, b),
                children: e(ht, {
                  className: "framer-mxaewn-container",
                  layoutDependency: c,
                  layoutId: "N8O34hDAj-container",
                  nodeId: "N8O34hDAj",
                  rendersWithMotion: !0,
                  scopeId: "ey9RMFL0A",
                  children: e(Ge, {
                    height: "100%",
                    id: "N8O34hDAj",
                    layoutId: "N8O34hDAj",
                    style: {
                      height: "100%",
                      width: "100%"
                    },
                    UdJC1_vBf: ie,
                    width: "100%"
                  })
                })
              })]
            })
          })
        })
      })
    })
  }),
  pr = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-lbxxG.framer-1v7nap9, .framer-lbxxG .framer-1v7nap9 { display: block; }", ".framer-lbxxG.framer-1ejo7hz { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 16px; height: 960px; justify-content: center; overflow: hidden; padding: 16px; position: relative; width: 1200px; }", ".framer-lbxxG .framer-2vbwoo { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 24px; height: 100%; justify-content: center; overflow: visible; padding: 64px; position: relative; width: 1px; z-index: 10; }", ".framer-lbxxG .framer-b4teiz { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px; position: relative; width: 100%; }", ".framer-lbxxG .framer-1j5lppg, .framer-lbxxG .framer-9c353n { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: visible; padding: 7px 0px 7px 0px; position: relative; width: min-content; }", ".framer-lbxxG .framer-5oscp7, .framer-lbxxG .framer-1st33s4, .framer-lbxxG .framer-1kgg8ta, .framer-lbxxG .framer-198odx { aspect-ratio: 1 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 8px); position: relative; width: 8px; }", ".framer-lbxxG .framer-1xm3t8i, .framer-lbxxG .framer-1srcj8 { flex: none; height: 1px; position: relative; width: 20px; }", ".framer-lbxxG .framer-1ryfvtr, .framer-lbxxG .framer-1fhc25u, .framer-lbxxG .framer-1s8wozh, .framer-lbxxG .framer-1isjnk2, .framer-lbxxG .framer-gzom6o { cursor: pointer; flex: none; height: auto; position: relative; white-space: pre; width: auto; }", ".framer-lbxxG .framer-mxaewn-container { flex: none; height: 41px; left: 32px; position: absolute; top: 32px; width: 41px; z-index: 1; }", ".framer-lbxxG.framer-v-1u9ksd2.framer-1ejo7hz { gap: 12px; width: 810px; }", ".framer-lbxxG.framer-v-1u9ksd2 .framer-2vbwoo, .framer-lbxxG.framer-v-14abo59 .framer-2vbwoo { padding: 32px; }", ".framer-lbxxG.framer-v-14abo59.framer-1ejo7hz { gap: 12px; padding: 12px; width: 390px; }", ".framer-lbxxG.framer-v-14abo59 .framer-b4teiz { gap: 12px; }", ".framer-lbxxG.framer-v-14abo59 .framer-mxaewn-container { left: unset; right: 24px; top: 24px; }", ...Dt, ...Vt, '.framer-lbxxG[data-border="true"]::after, .framer-lbxxG [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  me = U(fr, pr, "framer-lbxxG"),
  je = me;
me.displayName = "Menu";
me.defaultProps = {
  height: 960,
  width: 1200
};
W(me, {
  variant: {
    options: ["EGqK4uSJI", "ysPOVDWMi", "kQwlISGHm"],
    optionTitles: ["Desktop", "Tablet", "Phone"],
    title: "Variant",
    type: G.Enum
  },
  woAUVjEwf: {
    title: "Menu Close",
    type: G.EventHandler
  }
});
S(me, [{
  explicitInter: !0,
  fonts: [{
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
    url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2",
    weight: "400"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
    url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2",
    weight: "400"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+1F00-1FFF",
    url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2",
    weight: "400"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0370-03FF",
    url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2",
    weight: "400"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
    url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2",
    weight: "400"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    url: "https://framerusercontent.com/assets/vQyevYAyHtARFwPqUzQGpnDs.woff2",
    weight: "400"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB",
    url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2",
    weight: "400"
  }]
}, ...rr, ...Ue(Lt), ...Ue(Ft)], {
  supportsExplicitInterCodegen: !0
});
var ur = "framer-B37TV",
  hr = {
    RTbTyDf3l: "framer-v-5tsxk7"
  };
var yr = {
    bounce: .2,
    delay: 0,
    duration: .4,
    type: "spring"
  },
  gr = ({
    value: t,
    children: r
  }) => {
    let a = j(w),
      o = t ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(w.Provider, {
      value: n,
      children: r
    })
  },
  xr = i.create(y),
  br = ({
    height: t,
    id: r,
    width: a,
    ...o
  }) => ({
    ...o
  }),
  vr = (t, r) => t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  wr = N(function(t, r) {
    let {
      activeLocale: a,
      setLocale: o
    } = R(), {
      style: n,
      className: l,
      layoutId: s,
      variant: u,
      ...x
    } = br(t), {
      baseVariant: d,
      classNames: g,
      clearLoadingGesture: C,
      gestureHandlers: F,
      gestureVariant: z,
      isLoading: h,
      setGestureState: J,
      setVariant: V,
      variants: D
    } = B({
      defaultVariant: "RTbTyDf3l",
      variant: u,
      variantClassNames: hr
    }), b = vr(t, D), f = k(null), E = P(), Z = [], v = A();
    return e(M, {
      id: s ?? E,
      children: e(xr, {
        animate: D,
        initial: !1,
        children: e(gr, {
          value: yr,
          children: e(Ce, {
            ...x,
            ...F,
            background: {
              alt: "",
              fit: "fill",
              intrinsicHeight: 1100,
              intrinsicWidth: 1920,
              loading: ke(v?.y || 0),
              pixelHeight: 1100,
              pixelWidth: 1920,
              sizes: v?.width || "100vw",
              src: "https://framerusercontent.com/images/8G8Y8b1ZHwFvDzVUQQlr4waN1DI.jpg",
              srcSet: "https://framerusercontent.com/images/8G8Y8b1ZHwFvDzVUQQlr4waN1DI.jpg?scale-down-to=512 512w,https://framerusercontent.com/images/8G8Y8b1ZHwFvDzVUQQlr4waN1DI.jpg?scale-down-to=1024 1024w,https://framerusercontent.com/images/8G8Y8b1ZHwFvDzVUQQlr4waN1DI.jpg 1920w"
            },
            className: I(ur, ...Z, "framer-5tsxk7", l, g),
            "data-framer-name": "Desktop",
            layoutDependency: b,
            layoutId: "RTbTyDf3l",
            ref: r ?? f,
            style: {
              opacity: .08,
              ...n
            }
          })
        })
      })
    })
  }),
  Ir = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-B37TV.framer-qx318g, .framer-B37TV .framer-qx318g { display: block; }", ".framer-B37TV.framer-5tsxk7 { height: 960px; overflow: hidden; position: relative; width: 1200px; }"],
  Fe = U(wr, Ir, "framer-B37TV"),
  Te = Fe;
Fe.displayName = "Layout/Body Background Image";
Fe.defaultProps = {
  height: 960,
  width: 1200
};
S(Fe, [{
  explicitInter: !0,
  fonts: []
}], {
  supportsExplicitInterCodegen: !0
});
var Cr = "framer-WP7ej",
  kr = {
    CpeSohLeF: "framer-v-6xtryv"
  };
var Rr = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  Fr = ({
    value: t,
    children: r
  }) => {
    let a = j(w),
      o = t ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(w.Provider, {
      value: n,
      children: r
    })
  },
  Vr = i.create(y),
  _r = ({
    height: t,
    id: r,
    link: a,
    width: o,
    ...n
  }) => ({
    ...n,
    a28gi3Ahz: a ?? n.a28gi3Ahz
  }),
  Lr = (t, r) => t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  Dr = N(function(t, r) {
    let {
      activeLocale: a,
      setLocale: o
    } = R(), {
      style: n,
      className: l,
      layoutId: s,
      variant: u,
      a28gi3Ahz: x,
      ...d
    } = _r(t), {
      baseVariant: g,
      classNames: C,
      clearLoadingGesture: F,
      gestureHandlers: z,
      gestureVariant: h,
      isLoading: J,
      setGestureState: V,
      setVariant: D,
      variants: b
    } = B({
      defaultVariant: "CpeSohLeF",
      variant: u,
      variantClassNames: kr
    }), f = Lr(t, b), E = k(null), Z = P(), v = [], c = A();
    return e(M, {
      id: s ?? Z,
      children: e(Vr, {
        animate: b,
        initial: !1,
        children: e(Fr, {
          value: Rr,
          children: e(Y, {
            href: x,
            children: e(i.a, {
              ...d,
              ...z,
              className: `${I(Cr,...v,"framer-6xtryv",l,C)} framer-1ypskfr`,
              "data-framer-name": "Default",
              layoutDependency: f,
              layoutId: "CpeSohLeF",
              ref: r ?? E,
              style: {
                ...n
              },
              children: e(Ce, {
                background: {
                  alt: "",
                  fit: "fill",
                  intrinsicHeight: 31.5,
                  intrinsicWidth: 118.5,
                  loading: ke((c?.y || 0) + (4 + ((c?.height || 30.5) - 4 - 32) / 2)),
                  pixelHeight: 63,
                  pixelWidth: 237,
                  src: "https://framerusercontent.com/images/x0JzSofUJm2jTIMMg5jbgdRYVzU.webp"
                },
                className: "framer-493dzc",
                "data-framer-name": "Logo",
                layoutDependency: f,
                layoutId: "sEe24pmCc"
              })
            })
          })
        })
      })
    })
  }),
  Nr = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-WP7ej.framer-1ypskfr, .framer-WP7ej .framer-1ypskfr { display: block; }", ".framer-WP7ej.framer-6xtryv { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; overflow: visible; padding: 4px 0px 0px 0px; position: relative; text-decoration: none; width: 100px; }", ".framer-WP7ej .framer-493dzc { aspect-ratio: 3.761904761904762 / 1; flex: 1 0 0px; height: var(--framer-aspect-ratio-supported, 27px); overflow: visible; position: relative; width: 1px; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-WP7ej.framer-6xtryv { gap: 0px; } .framer-WP7ej.framer-6xtryv > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-WP7ej.framer-6xtryv > :first-child { margin-left: 0px; } .framer-WP7ej.framer-6xtryv > :last-child { margin-right: 0px; } }"],
  fe = U(Dr, Nr, "framer-WP7ej"),
  Ae = fe;
fe.displayName = "Layout/Logo";
fe.defaultProps = {
  height: 30.5,
  width: 100
};
W(fe, {
  a28gi3Ahz: {
    title: "Link",
    type: G.Link
  }
});
S(fe, [{
  explicitInter: !0,
  fonts: []
}], {
  supportsExplicitInterCodegen: !0
});
var Pr = {
    "I2847:4028;2843:3487": {
      hover: !0
    }
  },
  Mr = "framer-28Mcz",
  Ur = {
    "I2847:4028;2843:3487": "framer-v-136wxrw"
  };

function Sr(t, ...r) {
  let a = {};
  return r?.forEach(o => o && Object.assign(a, t[o])), a
}
var zr = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  Er = ({
    value: t,
    children: r
  }) => {
    let a = j(w),
      o = t ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(w.Provider, {
      value: n,
      children: r
    })
  },
  Gr = i.create(y),
  jr = ({
    height: t,
    id: r,
    link: a,
    title: o,
    width: n,
    ...l
  }) => {
    var s;
    return {
      ...l,
      i0H2fEiAL: (s = o ?? l.i0H2fEiAL) !== null && s !== void 0 ? s : "Menu",
      zELeGxU0d: a ?? l.zELeGxU0d
    }
  },
  Tr = (t, r) => t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  Ar = N(function(t, r) {
    let {
      activeLocale: a,
      setLocale: o
    } = R(), {
      style: n,
      className: l,
      layoutId: s,
      variant: u,
      zELeGxU0d: x,
      i0H2fEiAL: d,
      ...g
    } = jr(t), {
      baseVariant: C,
      classNames: F,
      clearLoadingGesture: z,
      gestureHandlers: h,
      gestureVariant: J,
      isLoading: V,
      setGestureState: D,
      setVariant: b,
      variants: f
    } = B({
      defaultVariant: "I2847:4028;2843:3487",
      enabledGestures: Pr,
      variant: u,
      variantClassNames: Ur
    }), E = Tr(t, f), Z = k(null), v = P(), c = [], _ = A();
    return e(M, {
      id: s ?? v,
      children: e(Gr, {
        animate: f,
        initial: !1,
        children: e(Er, {
          value: zr,
          children: e(Y, {
            href: x,
            children: e(i.a, {
              ...g,
              ...h,
              className: `${I(Mr,...c,"framer-136wxrw",l,F)} framer-1s4epyd`,
              "data-border": !0,
              "data-framer-name": "Variant 1",
              layoutDependency: E,
              layoutId: "I2847:4028;2843:3487",
              ref: r ?? Z,
              style: {
                "--border-bottom-width": "1px",
                "--border-color": "rgba(51, 51, 48, 0)",
                "--border-left-width": "1px",
                "--border-right-width": "1px",
                "--border-style": "solid",
                "--border-top-width": "1px",
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                ...n
              },
              variants: {
                "I2847:4028;2843:3487-hover": {
                  "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))",
                  backgroundColor: "var(--token-cd2934a7-4e35-4347-a32c-9650fca4db23, rgba(24, 24, 24, 0.5))"
                }
              },
              ...Sr({
                "I2847:4028;2843:3487-hover": {
                  "data-framer-name": void 0
                }
              }, C, J),
              children: e(te, {
                __fromCanvasComponent: !0,
                children: e(y, {
                  children: e(i.p, {
                    style: {
                      "--font-selector": "RlM7U2F0b3NoaS1yZWd1bGFy",
                      "--framer-font-family": '"Satoshi", "Satoshi Placeholder", sans-serif',
                      "--framer-font-size": "12px",
                      "--framer-letter-spacing": "1px",
                      "--framer-line-height": "130%",
                      "--framer-text-color": "var(--extracted-r6o4lv, var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, rgb(239, 231, 210)))",
                      "--framer-text-transform": "uppercase"
                    },
                    children: "Menu"
                  })
                }),
                className: "framer-uml6xa",
                "data-framer-name": "Menu",
                fonts: ["FS;Satoshi-regular"],
                layoutDependency: E,
                layoutId: "I2847:4028;2843:3488",
                style: {
                  "--extracted-r6o4lv": "var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, rgb(239, 231, 210))"
                },
                text: d,
                verticalAlignment: "top",
                withExternalLayout: !0
              })
            })
          })
        })
      })
    })
  }),
  Br = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-28Mcz.framer-1s4epyd, .framer-28Mcz .framer-1s4epyd { display: block; }", ".framer-28Mcz.framer-136wxrw { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: hidden; padding: 12px; position: relative; text-decoration: none; width: min-content; will-change: var(--framer-will-change-override, transform); }", ".framer-28Mcz .framer-uml6xa { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-28Mcz.framer-136wxrw { gap: 0px; } .framer-28Mcz.framer-136wxrw > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-28Mcz.framer-136wxrw > :first-child { margin-left: 0px; } .framer-28Mcz.framer-136wxrw > :last-child { margin-right: 0px; } }", '.framer-28Mcz[data-border="true"]::after, .framer-28Mcz [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  pe = U(Ar, Br, "framer-28Mcz"),
  Ve = pe;
pe.displayName = "Components/Navbar Item";
pe.defaultProps = {
  height: 39.5,
  width: 62
};
W(pe, {
  zELeGxU0d: {
    title: "Link",
    type: G.Link
  },
  i0H2fEiAL: {
    defaultValue: "Menu",
    displayTextArea: !1,
    title: "Title",
    type: G.String
  }
});
S(pe, [{
  explicitInter: !0,
  fonts: [{
    family: "Satoshi",
    source: "fontshare",
    style: "normal",
    url: "https://framerusercontent.com/third-party-assets/fontshare/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.woff2",
    weight: "400"
  }]
}], {
  supportsExplicitInterCodegen: !0
});
var Or = {
    "I2847:4028;2843:3479": {
      hover: !0
    }
  },
  Wr = "framer-1pwiS",
  Hr = {
    "I2847:4028;2843:3479": "framer-v-ef9byx"
  };

function qr(t, ...r) {
  let a = {};
  return r?.forEach(o => o && Object.assign(a, t[o])), a
}
var Yr = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  Xr = ({
    value: t,
    children: r
  }) => {
    let a = j(w),
      o = t ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(w.Provider, {
      value: n,
      children: r
    })
  },
  Jr = i.create(y),
  Zr = ({
    height: t,
    id: r,
    tap: a,
    width: o,
    ...n
  }) => ({
    ...n,
    MKKuqG1x5: a ?? n.MKKuqG1x5
  }),
  Kr = (t, r) => t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  Qr = N(function(t, r) {
    let {
      activeLocale: a,
      setLocale: o
    } = R(), {
      style: n,
      className: l,
      layoutId: s,
      variant: u,
      MKKuqG1x5: x,
      ...d
    } = Zr(t), {
      baseVariant: g,
      classNames: C,
      clearLoadingGesture: F,
      gestureHandlers: z,
      gestureVariant: h,
      isLoading: J,
      setGestureState: V,
      setVariant: D,
      variants: b
    } = B({
      defaultVariant: "I2847:4028;2843:3479",
      enabledGestures: Or,
      variant: u,
      variantClassNames: Hr
    }), f = Kr(t, b), {
      activeVariantCallback: E,
      delay: Z
    } = re(g), v = E(async (...ie) => {
      if (V({
          isPressed: !1
        }), x && await x(...ie) === !1) return !1
    }), c = k(null), _ = P(), ae = [], $ = A();
    return e(M, {
      id: s ?? _,
      children: e(Jr, {
        animate: b,
        initial: !1,
        children: e(Xr, {
          value: Yr,
          children: e(i.div, {
            ...d,
            ...z,
            className: I(Wr, ...ae, "framer-ef9byx", l, C),
            "data-border": !0,
            "data-framer-name": "Variant 1",
            "data-highlight": !0,
            layoutDependency: f,
            layoutId: "I2847:4028;2843:3479",
            onTap: v,
            ref: r ?? c,
            style: {
              "--border-bottom-width": "1px",
              "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))",
              "--border-left-width": "1px",
              "--border-right-width": "1px",
              "--border-style": "solid",
              "--border-top-width": "1px",
              backgroundColor: "var(--token-cd2934a7-4e35-4347-a32c-9650fca4db23, rgba(24, 24, 24, 0.5))",
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              ...n
            },
            variants: {
              "I2847:4028;2843:3479-hover": {
                "--border-color": "var(--token-52eaa3b2-9b53-4c12-9790-fce4171dff3e, rgba(239, 231, 210, 0.2))",
                backgroundColor: "var(--token-c18e5c55-e670-494b-9afe-b018358f3867, rgb(30, 30, 30))"
              }
            },
            ...qr({
              "I2847:4028;2843:3479-hover": {
                "data-framer-name": void 0
              }
            }, g, h),
            children: L(i.div, {
              className: "framer-1jrpmsy",
              layoutDependency: f,
              layoutId: "fdWBRV5Xi",
              children: [e(i.div, {
                className: "framer-1nickyg",
                "data-framer-name": "Menu Toggle Line",
                layoutDependency: f,
                layoutId: "I2847:4028;2843:3480",
                style: {
                  backgroundColor: "rgb(239, 230, 210)"
                }
              }), e(i.div, {
                className: "framer-15qmgh6",
                "data-framer-name": "Menu Toggle Line",
                layoutDependency: f,
                layoutId: "I2847:4028;2843:3481",
                style: {
                  backgroundColor: "rgb(239, 230, 210)"
                }
              }), e(i.div, {
                className: "framer-1kctzd1",
                "data-framer-name": "Menu Toggle Line",
                layoutDependency: f,
                layoutId: "I2847:4028;2843:3482",
                style: {
                  backgroundColor: "rgb(239, 230, 210)"
                }
              })]
            })
          })
        })
      })
    })
  }),
  $r = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-1pwiS.framer-1u5izhy, .framer-1pwiS .framer-1u5izhy { display: block; }", ".framer-1pwiS.framer-ef9byx { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 5px; height: 41px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 41px; will-change: var(--framer-will-change-override, transform); }", ".framer-1pwiS .framer-1jrpmsy { flex: none; height: 13px; overflow: visible; position: relative; width: 20px; }", ".framer-1pwiS .framer-1nickyg { flex: none; height: 1px; left: 0px; position: absolute; right: 0px; top: 0px; z-index: 1; }", ".framer-1pwiS .framer-15qmgh6 { flex: none; height: 1px; left: 0px; position: absolute; right: 0px; top: calc(48.78048780487807% - 1px / 2); z-index: 1; }", ".framer-1pwiS .framer-1kctzd1 { bottom: 0px; flex: none; height: 1px; left: 0px; position: absolute; right: 0px; z-index: 1; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-1pwiS.framer-ef9byx { gap: 0px; } .framer-1pwiS.framer-ef9byx > * { margin: 0px; margin-bottom: calc(5px / 2); margin-top: calc(5px / 2); } .framer-1pwiS.framer-ef9byx > :first-child { margin-top: 0px; } .framer-1pwiS.framer-ef9byx > :last-child { margin-bottom: 0px; } }", ".framer-1pwiS.framer-v-ef9byx.hover .framer-1nickyg { top: calc(46.15384615384618% - 1px / 2); }", ".framer-1pwiS.framer-v-ef9byx.hover .framer-1kctzd1 { bottom: unset; top: calc(46.15384615384618% - 1px / 2); }", '.framer-1pwiS[data-border="true"]::after, .framer-1pwiS [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  ue = U(Qr, $r, "framer-1pwiS"),
  Be = ue;
ue.displayName = "Menu/Menu Nav Toggle";
ue.defaultProps = {
  height: 41,
  width: 41
};
W(ue, {
  MKKuqG1x5: {
    title: "Tap",
    type: G.EventHandler
  }
});
S(ue, [{
  explicitInter: !0,
  fonts: []
}], {
  supportsExplicitInterCodegen: !0
});
var ea = X(Be),
  ta = X(Ae),
  ra = X(Ve),
  aa = X(Se),
  oa = ["sMX5M2Uqr", "iYWmBinwv"],
  na = "framer-ppkPa",
  ia = {
    iYWmBinwv: "framer-v-1ja1fot",
    sMX5M2Uqr: "framer-v-x917yn"
  };

function _e(t, ...r) {
  let a = {};
  return r?.forEach(o => o && Object.assign(a, t[o])), a
}
var sa = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  la = ({
    value: t,
    children: r
  }) => {
    let a = j(w),
      o = t ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(w.Provider, {
      value: n,
      children: r
    })
  },
  ca = i.create(y),
  da = {
    Desktop: "sMX5M2Uqr",
    Phone: "iYWmBinwv"
  },
  ma = ({
    height: t,
    id: r,
    menuToggle: a,
    width: o,
    ...n
  }) => {
    var l, s;
    return {
      ...n,
      OokibawIE: a ?? n.OokibawIE,
      variant: (s = (l = da[n.variant]) !== null && l !== void 0 ? l : n.variant) !== null && s !== void 0 ? s : "sMX5M2Uqr"
    }
  },
  fa = (t, r) => t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  pa = N(function(t, r) {
    let {
      activeLocale: a,
      setLocale: o
    } = R(), {
      style: n,
      className: l,
      layoutId: s,
      variant: u,
      OokibawIE: x,
      ...d
    } = ma(t), {
      baseVariant: g,
      classNames: C,
      clearLoadingGesture: F,
      gestureHandlers: z,
      gestureVariant: h,
      isLoading: J,
      setGestureState: V,
      setVariant: D,
      variants: b
    } = B({
      cycleOrder: oa,
      defaultVariant: "sMX5M2Uqr",
      variant: u,
      variantClassNames: ia
    }), f = fa(t, b), {
      activeVariantCallback: E,
      delay: Z
    } = re(g), v = E(async (...q) => {
      if (x && await x(...q) === !1) return !1
    }), c = k(null), _ = ve(), ae = () => g !== "iYWmBinwv", $ = P(), ie = [], m = A();
    return e(M, {
      id: s ?? $,
      children: e(ca, {
        animate: b,
        initial: !1,
        children: e(la, {
          value: sa,
          children: L(i.div, {
            ...d,
            ...z,
            className: I(na, ...ie, "framer-x917yn", l, C),
            "data-framer-name": "Desktop",
            layoutDependency: f,
            layoutId: "sMX5M2Uqr",
            ref: r ?? c,
            style: {
              backgroundColor: "rgb(10, 11, 10)",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              ...n
            },
            ..._e({
              iYWmBinwv: {
                "data-framer-name": "Phone"
              }
            }, g, h),
            children: [e(H, {
              height: 41,
              width: "41px",
              y: (m?.y || 0) + (8 + ((m?.height || 57) - 16 - 41) / 2),
              children: e(i.div, {
                className: "framer-1xr4r8t-container",
                layoutDependency: f,
                layoutId: "zKNLyiq_0-container",
                children: e(Be, {
                  height: "100%",
                  id: "zKNLyiq_0",
                  layoutId: "zKNLyiq_0",
                  MKKuqG1x5: v,
                  style: {
                    height: "100%",
                    width: "100%"
                  },
                  width: "100%"
                })
              })
            }), e(ce, {
              links: [{
                href: {
                  webPageId: "augiA20Il"
                },
                implicitPathVariables: void 0
              }, {
                href: {
                  webPageId: "augiA20Il"
                },
                implicitPathVariables: void 0
              }],
              children: q => e(H, {
                height: 30,
                y: (m?.y || 0) + (8 + ((m?.height || 57) - 16 - 30) / 2),
                ..._e({
                  iYWmBinwv: {
                    width: "90px"
                  }
                }, g, h),
                children: e(i.div, {
                  className: "framer-1un38sm-container",
                  layoutDependency: f,
                  layoutId: "SMpgKPRwU-container",
                  children: e(Ae, {
                    a28gi3Ahz: q[0],
                    height: "100%",
                    id: "SMpgKPRwU",
                    layoutId: "SMpgKPRwU",
                    width: "100%",
                    ..._e({
                      iYWmBinwv: {
                        a28gi3Ahz: q[1],
                        style: {
                          width: "100%"
                        }
                      }
                    }, g, h)
                  })
                })
              })
            }), L(i.div, {
              className: "framer-uw18uo",
              "data-framer-name": "Menu",
              layoutDependency: f,
              layoutId: "I2847:4028;2843:3484",
              children: [ae() && e(ce, {
                links: [{
                  href: {
                    webPageId: "W61OseJy9"
                  },
                  implicitPathVariables: void 0
                }],
                children: q => e(H, {
                  height: 39,
                  y: (m?.y || 0) + (8 + ((m?.height || 57) - 16 - 41) / 2) + 1,
                  children: e(i.div, {
                    className: "framer-1e6q382-container",
                    layoutDependency: f,
                    layoutId: "iKkIWZoJ0-container",
                    children: e(Ve, {
                      height: "100%",
                      i0H2fEiAL: "Menu",
                      id: "iKkIWZoJ0",
                      layoutId: "iKkIWZoJ0",
                      width: "100%",
                      zELeGxU0d: q[0]
                    })
                  })
                })
              }), ae() && e(ce, {
                links: [{
                  href: {
                    webPageId: "OFVwkEg7d"
                  },
                  implicitPathVariables: void 0
                }],
                children: q => e(H, {
                  height: 39,
                  y: (m?.y || 0) + (8 + ((m?.height || 57) - 16 - 41) / 2) + 1,
                  children: e(i.div, {
                    className: "framer-1rkkrfi-container",
                    layoutDependency: f,
                    layoutId: "HCB8r5_0f-container",
                    children: e(Ve, {
                      height: "100%",
                      i0H2fEiAL: "About",
                      id: "HCB8r5_0f",
                      layoutId: "HCB8r5_0f",
                      width: "100%",
                      zELeGxU0d: q[0]
                    })
                  })
                })
              }), e(ce, {
                links: [{
                  href: {
                    webPageId: "YCbNyRkzE"
                  },
                  implicitPathVariables: void 0
                }, {
                  href: {
                    webPageId: "YCbNyRkzE"
                  },
                  implicitPathVariables: void 0
                }],
                children: q => e(H, {
                  height: 41,
                  y: (m?.y || 0) + (8 + ((m?.height || 57) - 16 - 41) / 2) + 0,
                  children: e(i.div, {
                    className: "framer-1h58hyq-container",
                    layoutDependency: f,
                    layoutId: "JbkncrvJZ-container",
                    children: e(Se, {
                      amWyVdppW: !1,
                      ApxukoHYo: "Book a Table",
                      height: "100%",
                      id: "JbkncrvJZ",
                      layoutId: "JbkncrvJZ",
                      QkE8o0HIe: q[0],
                      variant: "AzhqezM_b",
                      width: "100%",
                      ..._e({
                        iYWmBinwv: {
                          QkE8o0HIe: q[1]
                        }
                      }, g, h)
                    })
                  })
                })
              })]
            })]
          })
        })
      })
    })
  }),
  ua = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-ppkPa.framer-16hkge3, .framer-ppkPa .framer-16hkge3 { display: block; }", ".framer-ppkPa.framer-x917yn { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 12px; height: min-content; justify-content: center; overflow: hidden; padding: 8px; position: relative; width: min-content; will-change: var(--framer-will-change-override, transform); }", ".framer-ppkPa .framer-1xr4r8t-container { flex: none; height: 41px; position: relative; width: 41px; }", ".framer-ppkPa .framer-1un38sm-container, .framer-ppkPa .framer-1e6q382-container, .framer-ppkPa .framer-1rkkrfi-container, .framer-ppkPa .framer-1h58hyq-container { flex: none; height: auto; position: relative; width: auto; }", ".framer-ppkPa .framer-uw18uo { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 4px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-ppkPa.framer-x917yn, .framer-ppkPa .framer-uw18uo { gap: 0px; } .framer-ppkPa.framer-x917yn > * { margin: 0px; margin-left: calc(12px / 2); margin-right: calc(12px / 2); } .framer-ppkPa.framer-x917yn > :first-child, .framer-ppkPa .framer-uw18uo > :first-child { margin-left: 0px; } .framer-ppkPa.framer-x917yn > :last-child, .framer-ppkPa .framer-uw18uo > :last-child { margin-right: 0px; } .framer-ppkPa .framer-uw18uo > * { margin: 0px; margin-left: calc(4px / 2); margin-right: calc(4px / 2); } }", ".framer-ppkPa.framer-v-1ja1fot .framer-1un38sm-container { width: 90px; }"],
  he = U(pa, ua, "framer-ppkPa"),
  Oe = he;
he.displayName = "Layout/Header";
he.defaultProps = {
  height: 57,
  width: 445
};
W(he, {
  variant: {
    options: ["sMX5M2Uqr", "iYWmBinwv"],
    optionTitles: ["Desktop", "Phone"],
    title: "Variant",
    type: G.Enum
  },
  OokibawIE: {
    title: "Menu Toggle",
    type: G.EventHandler
  }
});
S(he, [{
  explicitInter: !0,
  fonts: []
}, ...ea, ...ta, ...ra, ...aa], {
  supportsExplicitInterCodegen: !0
});
var Mt = we(pt(i.a)),
  ha = "framer-4GnLc",
  ya = {
    LCuIJRbSV: "framer-v-aoxxaw"
  };
var ga = {
    bounce: .2,
    delay: 0,
    duration: .4,
    type: "spring"
  },
  xa = {
    delay: 1.2,
    duration: .4,
    ease: [.44, 0, .56, 1],
    type: "tween"
  },
  ba = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: xa,
    x: 0,
    y: 0
  },
  Ut = {
    opacity: .001,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 10
  },
  va = {
    delay: 1,
    duration: .4,
    ease: [.44, 0, .56, 1],
    type: "tween"
  },
  wa = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: va,
    x: 0,
    y: 0
  },
  Ia = ({
    value: t,
    children: r
  }) => {
    let a = j(w),
      o = t ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(w.Provider, {
      value: n,
      children: r
    })
  },
  Ca = i.create(y),
  ka = ({
    height: t,
    id: r,
    width: a,
    ...o
  }) => ({
    ...o
  }),
  Ra = (t, r) => t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  Fa = N(function(t, r) {
    let {
      activeLocale: a,
      setLocale: o
    } = R(), {
      style: n,
      className: l,
      layoutId: s,
      variant: u,
      ...x
    } = ka(t), {
      baseVariant: d,
      classNames: g,
      clearLoadingGesture: C,
      gestureHandlers: F,
      gestureVariant: z,
      isLoading: h,
      setGestureState: J,
      setVariant: V,
      variants: D
    } = B({
      defaultVariant: "LCuIJRbSV",
      variant: u,
      variantClassNames: ya
    }), b = Ra(t, D), f = k(null), E = P(), Z = [], v = A();
    return e(M, {
      id: s ?? E,
      children: e(Ca, {
        animate: D,
        initial: !1,
        children: e(Ia, {
          value: ga,
          children: L(i.div, {
            ...x,
            ...F,
            className: I(ha, ...Z, "framer-aoxxaw", l, g),
            "data-framer-name": "Desktop",
            layoutDependency: b,
            layoutId: "LCuIJRbSV",
            ref: r ?? f,
            style: {
              ...n
            },
            children: [e(Y, {
              href: "https://gola.io/qitchen",
              openInNewTab: !0,
              children: e(Mt, {
                __perspectiveFX: !1,
                __smartComponentFX: !0,
                __targetOpacity: 1,
                animate: ba,
                className: "framer-gqopxx framer-10e8mc9",
                "data-framer-appear-id": "gqopxx",
                "data-framer-name": "Badge",
                initial: Ut,
                layoutDependency: b,
                layoutId: "WLLJOfmgt",
                optimized: !0,
                style: {
                  backgroundColor: "rgb(255, 255, 255)",
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.25)"
                },
                children: e(te, {
                  __fromCanvasComponent: !0,
                  children: e(y, {
                    children: e(i.p, {
                      style: {
                        "--font-selector": "SW50ZXItU2VtaUJvbGQ=",
                        "--framer-font-family": '"Inter", "Inter Placeholder", sans-serif',
                        "--framer-font-size": "13px",
                        "--framer-font-weight": "600",
                        "--framer-letter-spacing": "0px",
                        "--framer-line-height": "100%",
                        "--framer-text-transform": "inherit"
                      },
                      children: "Use for FREE"
                    })
                  }),
                  className: "framer-be93h5",
                  fonts: ["Inter-SemiBold"],
                  layoutDependency: b,
                  layoutId: "KRn31Bk9K",
                  verticalAlignment: "top",
                  withExternalLayout: !0
                })
              })
            }), e(Y, {
              href: "https://www.framer.com/marketplace/creator/pawel-gola?via=pawelgola",
              openInNewTab: !0,
              children: e(Mt, {
                __perspectiveFX: !1,
                __smartComponentFX: !0,
                __targetOpacity: 1,
                animate: wa,
                className: "framer-1wwcyo4 framer-10e8mc9",
                "data-framer-appear-id": "1wwcyo4",
                "data-framer-name": "Badge",
                initial: Ut,
                layoutDependency: b,
                layoutId: "DtpgIkbDh",
                optimized: !0,
                style: {
                  backgroundColor: "rgb(255, 255, 255)",
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.25)"
                },
                children: e(te, {
                  __fromCanvasComponent: !0,
                  children: e(y, {
                    children: e(i.p, {
                      style: {
                        "--font-selector": "SW50ZXItU2VtaUJvbGQ=",
                        "--framer-font-family": '"Inter", "Inter Placeholder", sans-serif',
                        "--framer-font-size": "13px",
                        "--framer-font-weight": "600",
                        "--framer-letter-spacing": "0px",
                        "--framer-line-height": "100%",
                        "--framer-text-transform": "inherit"
                      },
                      children: "More Templates"
                    })
                  }),
                  className: "framer-o8qce8",
                  fonts: ["Inter-SemiBold"],
                  layoutDependency: b,
                  layoutId: "VSeDN4xmP",
                  verticalAlignment: "top",
                  withExternalLayout: !0
                })
              })
            })]
          })
        })
      })
    })
  }),
  Va = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-4GnLc.framer-10e8mc9, .framer-4GnLc .framer-10e8mc9 { display: block; }", ".framer-4GnLc.framer-aoxxaw { align-content: flex-end; align-items: flex-end; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: flex-end; overflow: visible; padding: 0px; position: relative; width: min-content; }", ".framer-4GnLc .framer-gqopxx, .framer-4GnLc .framer-1wwcyo4 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 36px; justify-content: center; overflow: visible; padding: 10px; position: relative; text-decoration: none; width: 142px; }", ".framer-4GnLc .framer-be93h5, .framer-4GnLc .framer-o8qce8 { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-4GnLc.framer-aoxxaw, .framer-4GnLc .framer-gqopxx, .framer-4GnLc .framer-1wwcyo4 { gap: 0px; } .framer-4GnLc.framer-aoxxaw > * { margin: 0px; margin-bottom: calc(8px / 2); margin-top: calc(8px / 2); } .framer-4GnLc.framer-aoxxaw > :first-child { margin-top: 0px; } .framer-4GnLc.framer-aoxxaw > :last-child { margin-bottom: 0px; } .framer-4GnLc .framer-gqopxx > *, .framer-4GnLc .framer-1wwcyo4 > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-4GnLc .framer-gqopxx > :first-child, .framer-4GnLc .framer-1wwcyo4 > :first-child { margin-left: 0px; } .framer-4GnLc .framer-gqopxx > :last-child, .framer-4GnLc .framer-1wwcyo4 > :last-child { margin-right: 0px; } }"],
  Le = U(Fa, Va, "framer-4GnLc"),
  We = Le;
Le.displayName = "Buy Badges";
Le.defaultProps = {
  height: 80,
  width: 142
};
S(Le, [{
  explicitInter: !0,
  fonts: [{
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
    url: "https://framerusercontent.com/assets/hyOgCu0Xnghbimh0pE8QTvtt2AU.woff2",
    weight: "600"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
    url: "https://framerusercontent.com/assets/NeGmSOXrPBfEFIy5YZeHq17LEDA.woff2",
    weight: "600"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+1F00-1FFF",
    url: "https://framerusercontent.com/assets/oYaAX5himiTPYuN8vLWnqBbfD2s.woff2",
    weight: "600"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0370-03FF",
    url: "https://framerusercontent.com/assets/lEJLP4R0yuCaMCjSXYHtJw72M.woff2",
    weight: "600"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
    url: "https://framerusercontent.com/assets/cRJyLNuTJR5jbyKzGi33wU9cqIQ.woff2",
    weight: "600"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    url: "https://framerusercontent.com/assets/1ZFS7N918ojhhd0nQWdj3jz4w.woff2",
    weight: "600"
  }, {
    family: "Inter",
    source: "framer",
    style: "normal",
    unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB",
    url: "https://framerusercontent.com/assets/A0Wcc7NgXMjUuFdquHDrIZpzZw0.woff2",
    weight: "600"
  }]
}], {
  supportsExplicitInterCodegen: !0
});
var _a = X(Oe),
  La = X(je),
  Da = X(ze),
  Na = we(ne),
  Pa = X(Te),
  Ma = X(We),
  Ua = {
    bjsAPPVHQ: "(min-width: 1200px)",
    kX65qxOg4: "(min-width: 810px) and (max-width: 1199px)",
    XTiylWl8M: "(max-width: 809px)"
  },
  Sa = () => typeof document < "u",
  za = "framer-azYRI",
  Ea = {
    bjsAPPVHQ: "framer-v-zclkw6",
    kX65qxOg4: "framer-v-1r1q3e1",
    XTiylWl8M: "framer-v-1auuoho"
  },
  Ga = {
    bounce: .2,
    delay: .1,
    duration: .5,
    type: "spring"
  },
  ja = {
    opacity: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: Ga,
    x: 0,
    y: 0
  },
  Ta = {
    bounce: .2,
    delay: 0,
    duration: .5,
    type: "spring"
  },
  Aa = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: Ta,
    x: 0,
    y: 0
  },
  Ba = {
    opacity: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0
  },
  Oa = () => document.querySelector("#template-overlay") ?? document.querySelector("#overlay") ?? document.body,
  Wa = ({
    children: t,
    blockDocumentScrolling: r,
    enabled: a = !0
  }) => {
    let [o, n] = It({
      blockDocumentScrolling: r
    });
    return t({
      hide: () => n(!1),
      show: () => n(!0),
      toggle: () => n(!o),
      visible: a && o
    })
  },
  Ha = {
    delay: 0,
    duration: .5,
    ease: [.5, 0, .88, .77],
    type: "tween"
  },
  qa = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    transition: Ha,
    x: 0,
    y: 0
  },
  Ya = {
    opacity: .001,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    x: 0,
    y: 0
  },
  He = {
    kX65qxOg4: [".framer-azYRI.framer-zclkw6 { padding: 16px; }", ".framer-azYRI .framer-1yvaye5-container { left: 50%; top: 40px; transform: translateX(-50%); }"],
    XTiylWl8M: [".framer-azYRI.framer-zclkw6 { gap: 12px; padding: 12px; }", ".framer-azYRI .framer-1yvaye5-container { left: 50%; top: 24px; transform: translateX(-50%); }", '.framer-azYRI .framer-1q2yd07, [data-layout-template="true"] > #overlay { margin-bottom: -12px; }']
  },
  St = Object.keys(He),
  Xa = {
    kX65qxOg4: ".framer-1r1q3e1-override",
    XTiylWl8M: ".framer-1auuoho-override"
  },
  zt = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-azYRI.framer-2or2yz, .framer-azYRI .framer-2or2yz { display: block; }", ".framer-azYRI.framer-zclkw6 { align-content: center; align-items: center; background-color: var(--token-4321a524-8651-4268-85f9-e884d8cb6223, #ffffff); display: flex; flex-direction: column; flex-wrap: nowrap; gap: 16px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px 16px 0px 16px; position: relative; width: 100%; }", ".framer-azYRI .framer-1yvaye5-container { flex: none; height: auto; left: 72px; position: var(--framer-canvas-fixed-position, fixed); top: 72px; width: auto; z-index: 10; }", ".framer-azYRI.framer-k3je0g { background-color: var(--token-4321a524-8651-4268-85f9-e884d8cb6223, #0a0b0a); inset: 0px; position: fixed; user-select: none; z-index: 10; }", ".framer-azYRI.framer-1isoj6h-container { flex: none; height: 100%; left: 0px; position: fixed; top: 0px; width: 100%; will-change: var(--framer-will-change-effect-override, transform); z-index: 10; }", ".framer-azYRI .framer-1q2yd07 { background: transparent; flex-grow: 1; height: 0px; margin: 0px; margin-bottom: -16px; position: relative; width: 0px; }", ".framer-azYRI .framer-1lcp6bd-container { flex: none; height: auto; order: 1002; position: relative; width: 100%; will-change: var(--framer-will-change-effect-override, transform); }", ".framer-azYRI .framer-xyw2qg-container { flex: none; height: calc(min(var(--framer-viewport-height, 100vh), 100%) * 1); left: 0px; order: 1003; position: var(--framer-canvas-fixed-position, fixed); top: 0px; width: 100%; z-index: 1; }", ".framer-azYRI .framer-1jyvgay-container { bottom: calc(calc(100% - min(var(--framer-viewport-height, 100%), 100%)) + 64px); flex: none; height: auto; order: 1004; position: var(--framer-canvas-fixed-position, fixed); right: 20px; width: auto; z-index: 9; }", '[data-layout-template="true"] > #overlay { margin-bottom: -16px; }'],
  Ja = {
    bjsAPPVHQ: "(min-width: 1200px)",
    kX65qxOg4: "(min-width: 810px) and (max-width: 1199px)",
    XTiylWl8M: "(max-width: 809px)"
  },
  Za = ({
    value: t
  }) => xt() ? null : e("style", {
    dangerouslySetInnerHTML: {
      __html: t
    },
    "data-framer-html-style": ""
  }),
  Ka = {
    Desktop: "bjsAPPVHQ",
    Phone: "XTiylWl8M",
    Tablet: "kX65qxOg4"
  },
  Qa = ({
    height: t,
    id: r,
    showFooter: a,
    width: o,
    ...n
  }) => ({
    ...n,
    JyRc5iZM_: a ?? n.JyRc5iZM_ ?? !0,
    variant: Ka[n.variant] ?? n.variant ?? "bjsAPPVHQ"
  }),
  $a = N(function(t, r) {
    let a = k(null),
      o = r ?? a,
      n = P(),
      {
        activeLocale: l,
        setLocale: s
      } = R(),
      {
        style: u,
        className: x,
        layoutId: d,
        variant: g,
        JyRc5iZM_: C,
        children: F,
        ...z
      } = Qa(t),
      [h, J] = vt(g, Ua, !1),
      V = void 0,
      {
        activeVariantCallback: D,
        delay: b
      } = re(void 0),
      f = ({
        overlay: _,
        loadMore: ae
      }) => D(async (...$) => {
        _.toggle()
      }),
      E = ({
        overlay: _,
        loadMore: ae
      }) => D(async (...$) => {
        _.hide()
      }),
      v = I(za, ...[]),
      c = _ => Sa() ? ["kX65qxOg4", "XTiylWl8M"].includes(h) ? _ : !1 : !0;
    return yt({}), e(ft.Provider, {
      value: {
        isLayoutTemplate: !0,
        primaryVariantId: "bjsAPPVHQ",
        variantClassNames: Ea
      },
      children: L(M, {
        id: d ?? n,
        children: [e(Za, {
          value: ":root body { background: var(--token-4321a524-8651-4268-85f9-e884d8cb6223, rgb(255, 255, 255)); }"
        }), L(i.div, {
          ...z,
          className: I(v, "framer-zclkw6", x),
          "data-layout-template": !0,
          ref: o,
          style: {
            ...u
          },
          children: [e(Wa, {
            children: _ => e(Ne, {
              children: e(se, {
                breakpoint: h,
                overrides: {
                  kX65qxOg4: {
                    y: 40
                  },
                  XTiylWl8M: {
                    y: 24
                  }
                },
                children: e(H, {
                  height: 57,
                  y: 72,
                  children: e(se, {
                    breakpoint: h,
                    overrides: {
                      kX65qxOg4: {
                        "data-framer-layout-hint-center-x": !0
                      },
                      XTiylWl8M: {
                        "data-framer-layout-hint-center-x": !0
                      }
                    },
                    children: L(ne, {
                      className: "framer-1yvaye5-container",
                      layoutScroll: !0,
                      nodeId: "X5uwbANM2",
                      scopeId: "yLpxGubdL",
                      children: [e(se, {
                        breakpoint: h,
                        overrides: {
                          XTiylWl8M: {
                            variant: "iYWmBinwv"
                          }
                        },
                        children: e(Oe, {
                          height: "100%",
                          id: "X5uwbANM2",
                          layoutId: "X5uwbANM2",
                          OokibawIE: f({
                            overlay: _
                          }),
                          variant: "sMX5M2Uqr",
                          width: "100%"
                        })
                      }), e(tt, {
                        children: _.visible && e(Ne, {
                          children: xe(L(y, {
                            children: [e(i.div, {
                              animate: {
                                opacity: 1
                              },
                              className: I(v, "framer-k3je0g"),
                              exit: {
                                opacity: 0
                              },
                              initial: {
                                opacity: 0
                              },
                              onTap: () => _.hide(),
                              transition: {
                                delay: 0,
                                duration: 0,
                                ease: [.5, 0, .88, .77],
                                type: "tween"
                              }
                            }, "bBi1ZekB1"), e(H, {
                              width: "100vw",
                              children: e(ne, {
                                animate: Aa,
                                className: I(v, "framer-1isoj6h-container"),
                                exit: ja,
                                inComponentSlot: !0,
                                initial: Ba,
                                nodeId: "o4jOMc7R7",
                                rendersWithMotion: !0,
                                scopeId: "yLpxGubdL",
                                children: e(je, {
                                  height: "100%",
                                  id: "o4jOMc7R7",
                                  layoutId: "o4jOMc7R7",
                                  style: {
                                    height: "100%",
                                    width: "100%"
                                  },
                                  variant: "EGqK4uSJI",
                                  width: "100%",
                                  woAUVjEwf: E({
                                    overlay: _
                                  })
                                })
                              })
                            })]
                          }), Oa())
                        })
                      })]
                    })
                  })
                })
              })
            })
          }), F, e("div", {
            className: "framer-1q2yd07"
          }), c(C) && e(se, {
            breakpoint: h,
            overrides: {
              kX65qxOg4: {
                height: 62,
                width: "calc(100vw - 32px)",
                y: 1016
              },
              XTiylWl8M: {
                height: 62,
                width: "calc(100vw - 24px)",
                y: 1012
              }
            },
            children: e(H, {
              children: e(Na, {
                animate: qa,
                className: I("framer-1lcp6bd-container", "hidden-zclkw6", !C && "hidden-1r1q3e1", !C && "hidden-1auuoho"),
                "data-framer-appear-id": "1lcp6bd",
                initial: Ya,
                nodeId: "tKGgNfGFD",
                optimized: !0,
                rendersWithMotion: !0,
                scopeId: "yLpxGubdL",
                style: {
                  transformPerspective: 1200
                },
                children: e(se, {
                  breakpoint: h,
                  overrides: {
                    XTiylWl8M: {
                      variant: "JD6pMfzso"
                    }
                  },
                  children: e(ze, {
                    height: "100%",
                    id: "tKGgNfGFD",
                    layoutId: "tKGgNfGFD",
                    style: {
                      width: "100%"
                    },
                    variant: "hEIfSvQFz",
                    width: "100%"
                  })
                })
              })
            })
          }), e(H, {
            height: 1e3,
            width: "100vw",
            y: 0,
            children: e(ne, {
              className: "framer-xyw2qg-container",
              layoutScroll: !0,
              nodeId: "r9m388FsC",
              scopeId: "yLpxGubdL",
              children: e(Te, {
                height: "100%",
                id: "r9m388FsC",
                layoutId: "r9m388FsC",
                style: {
                  height: "100%",
                  width: "100%"
                },
                width: "100%"
              })
            })
          }), e(H, {
            height: 80,
            y: 856,
            children: e(ne, {
              className: "framer-1jyvgay-container",
              layoutScroll: !0,
              nodeId: "JGdTTvmcj",
              scopeId: "yLpxGubdL",
              children: e(We, {
                height: "100%",
                id: "JGdTTvmcj",
                layoutId: "JGdTTvmcj",
                width: "100%"
              })
            })
          })]
        }), e("div", {
          id: "template-overlay"
        })]
      })
    })
  }),
  eo = t => t === Me.canvas || t === Me.export ? [...zt, ...St.flatMap(a => {
    let o = Xa[a];
    return He[a].map(n => `${o} {${n}}`)
  })] : [...zt, ...St.map(a => `@media ${Ja[a]} { ${He[a].join(" ")} }`)],
  ye = U($a, eo, "framer-azYRI"),
  Et = ye;
ye.displayName = "Default";
ye.defaultProps = {
  height: 1e3,
  width: 1200
};
W(ye, {
  JyRc5iZM_: {
    defaultValue: !0,
    title: "Show Footer",
    type: G.Boolean
  }
});
S(ye, [{
  explicitInter: !0,
  fonts: []
}, ..._a, ...La, ...Da, ...Pa, ...Ma], {
  supportsExplicitInterCodegen: !0
});
var le = {
    augiA20Il: {
      elements: {},
      page: K(() => import("./23Q7LZsijkzN9Jrt4jPKyOGgnWURquBnUBazhEnjusA.BDFDHIPG.mjs")),
      path: "/"
    },
    W61OseJy9: {
      elements: {
        Hhkwd75jM: "urmaki",
        lDOg3SbvG: "special",
        o4gBkUJE6: "maki"
      },
      page: K(() => import("./f7aG6z_JHYlAyqWuvhAe64U0LUBjSDUjBERnprzEE4g.ZOMYQJRM.mjs")),
      path: "/menu"
    },
    YCbNyRkzE: {
      elements: {
        q2liDXL_s: "special"
      },
      page: K(() => import("./s9Cqxd25XX18qrSTGkM9m_g5cVfUJyIAsXSLX0fw_kU.FODVOVAB.mjs")),
      path: "/reservation"
    },
    OFVwkEg7d: {
      elements: {},
      page: K(() => import("./L4YjTc60uUL5TffRUxTowE7Nj9Xxl8vUZph78Qf93zg.4ICYYGRA.mjs")),
      path: "/about"
    },
    xZrfMWLUB: {
      elements: {},
      page: K(() => import("./we_cYlHyRX2Qt8IThgRhFBN3lKXezaEGlBjfdnUetvc.BVZDOJOH.mjs")),
      path: "/contact"
    },
    BBWv5VG0V: {
      elements: {},
      page: K(() => import("./LnRVihZjYzp09oiMkAhc8oi1vwTlg5VXG1F_ODP8CfM.N3LKIYPB.mjs")),
      path: "/blog"
    },
    xv1cdgcl0: {
      elements: {},
      page: K(() => import("./jdvl5MN4LCMkX5V--ZK5dayzCSMO8GTS5wWg2-82YyU.NV4Y4IVW.mjs")),
      path: "/licensing"
    },
    XmJJGmprU: {
      elements: {},
      page: K(() => import("./Us0ZCIEGAQVMQNuJdjC_YLjPU8Hev8nxejM50GkgHGo.ARVPFTRA.mjs")),
      path: "/404"
    },
    gO2m9BuWR: {
      elements: {},
      page: K(() => import("./QcaxGKWr34AEidGqVpwLyrf7J_zoDibv-yQMKxIi0J4.GJNFVKZR.mjs")),
      path: "/blog/:q6wyKlkO2"
    }
  },
  qe = [{
    code: "en",
    id: "default",
    name: "English",
    slug: ""
  }],
  Ye = {},
  jt = "7d439509e22ab81b6db7b9932d708ea6b4e2cd36d21e205ef813a94772f68d1a";

function to({
  routeId: t,
  children: r,
  style: a,
  ...o
}) {
  let n = {
      JyRc5iZM_: !0
    },
    l = {
      ...n,
      JyRc5iZM_: !1
    },
    u = {
      augiA20Il: n,
      BBWv5VG0V: n,
      gO2m9BuWR: n,
      OFVwkEg7d: n,
      W61OseJy9: n,
      XmJJGmprU: l,
      xv1cdgcl0: n,
      xZrfMWLUB: n,
      YCbNyRkzE: n
    } [t] ?? {};
  switch (t) {
    case "augiA20Il":
    case "W61OseJy9":
    case "YCbNyRkzE":
    case "OFVwkEg7d":
    case "xZrfMWLUB":
    case "BBWv5VG0V":
    case "xv1cdgcl0":
    case "XmJJGmprU":
    case "gO2m9BuWR":
      return ee(Et, {
        ...u,
        key: "Default",
        routeId: t,
        style: a
      }, r(!0));
    default:
      return r(!1)
  }
}

function gn(t) {
  switch (t) {
    case "augiA20Il":
    case "W61OseJy9":
    case "YCbNyRkzE":
    case "OFVwkEg7d":
    case "xZrfMWLUB":
    case "BBWv5VG0V":
    case "xv1cdgcl0":
    case "XmJJGmprU":
    case "gO2m9BuWR":
      return [{
        hash: "zclkw6",
        mediaQuery: "(min-width: 1200px)"
      }, {
        hash: "1r1q3e1",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)"
      }, {
        hash: "1auuoho",
        mediaQuery: "(max-width: 809px)"
      }];
    default:
      return
  }
}
async function ro({
  routeId: t,
  pathVariables: r,
  localeId: a
}) {
  let o = le[t].page.preload(),
    n = ee(bt, {
      isWebsite: !0,
      routeId: t,
      pathVariables: r,
      routes: le,
      collectionUtils: Ye,
      framerSiteId: jt,
      notFoundPage: K(() => import("./Us0ZCIEGAQVMQNuJdjC_YLjPU8Hev8nxejM50GkgHGo.ARVPFTRA.mjs")),
      isReducedMotion: void 0,
      localeId: a,
      locales: qe,
      preserveQueryParams: void 0,
      siteCanonicalURL: "https://qitchen-template.framer.website",
      EditorBar: typeof p > "u" ? void 0 : (() => {
        if (!/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(O.userAgent)) return K(async () => {
          let {
            createEditorBar: d
          } = await import("https://edit.framer.com/init.mjs");
          return {
            default: d({
              dependencies: {
                __version: 1,
                framer: {
                  useCurrentRoute: at,
                  useLocaleInfo: R,
                  useRouter: ve
                },
                react: {
                  createElement: ee,
                  memo: Ke,
                  useCallback: Qe,
                  useEffect: $e,
                  useRef: k,
                  useState: et
                },
                "react-dom": {
                  createPortal: xe
                }
              }
            })
          }
        })
      })(),
      LayoutTemplate: to
    }),
    l = ee(mt, {
      children: n,
      value: {
        editorBarOnPageEditing: !1,
        motionDivToDiv: !1,
        pauseOffscreen: !0,
        replaceNestedLinks: !0,
        yieldOnTap: !1
      }
    }),
    s = ee(gt, {
      children: l
    }),
    u = ee(nt, {
      children: s,
      value: {
        global: {
          enter: {
            mask: {
              angle: 180,
              type: "wipe",
              width: "100%"
            },
            opacity: 1,
            rotate: 0,
            rotate3d: !1,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            transition: {
              damping: 30,
              delay: 0,
              duration: .4,
              ease: [.27, 0, .51, 1],
              mass: 1,
              stiffness: 400,
              type: "tween"
            },
            x: "0px",
            y: "0px"
          }
        },
        routes: {}
      }
    });
  return await o, u
}
var Xe = typeof document < "u";
if (Xe) {
  p.__framer_importFromPackage = (r, a) => () => ee(ct, {
    error: 'Package component not supported: "' + a + '" in "' + r + '"'
  }), p.process = {
    ...p.process,
    env: {
      ...p.process ? p.process.env : void 0,
      NODE_ENV: "production"
    }
  }, p.__framer_events = p.__framer_events || [], dt();
  let t = document.getElementById("main");
  "framerHydrateV2" in t.dataset ? Gt(!0, t) : Gt(!1, t)
}

function ao() {
  Xe && p.__framer_events.push(arguments)
}
async function Gt(t, r) {
  function a(o, n, l = !0) {
    if (o.caught || p.__framer_hadFatalError) return;
    let s = n?.componentStack;
    if (l) {
      if (console.warn(`Recoverable error has happened. Please check any custom code or code overrides to fix server/client mismatches:
`, o, s), Math.random() > .01) return
    } else console.error(`Fatal crash has happened. If you are the author of this website, please report this issue to the Framer team via https://www.framer.community/:
`, o, s);
    ao(l ? "published_site_load_recoverable_error" : "published_site_load_error", {
      message: String(o),
      componentStack: s,
      stack: s ? void 0 : o instanceof Error && typeof o.stack == "string" ? o.stack : null
    })
  }
  try {
    let o, n, l, s;
    if (t) {
      let d = JSON.parse(r.dataset.framerHydrateV2);
      o = d.routeId, n = d.localeId, l = d.pathVariables, s = d.breakpoints, o = Pe(le, o)
    } else {
      Pe(le, void 0);
      let d = lt(le, decodeURIComponent(location.pathname), !0, qe);
      o = d.routeId, n = d.localeId, l = d.pathVariables
    }
    let u = ro({
      routeId: o,
      localeId: n,
      pathVariables: l
    });
    typeof p < "u" && (async () => {
      let d = le[o],
        g = "default",
        C = qe.find(({
          id: V
        }) => n ? V === n : V === g)
        .code,
        F = null;
      if (d?.collectionId && Ye) {
        let V = await Ye[d.collectionId]?.(),
          [D] = Object.values(l);
        V && typeof D == "string" && (F = await V.getRecordIdBySlug(D, C || void 0) ?? null)
      }
      let z = Intl.DateTimeFormat()
        .resolvedOptions(),
        h = z.timeZone,
        J = z.locale;
      await new Promise(V => {
        document.prerendering ? document.addEventListener("prerenderingchange", V, {
          once: !0
        }) : V()
      }), p.__framer_events.push(["published_site_pageview", {
        framerSiteId: jt ?? null,
        routePath: d?.path || "/",
        collectionItemId: F,
        framerLocale: C || null,
        webPageId: d?.abTestingVariantId ?? o,
        abTestId: d?.abTestId,
        referrer: document.referrer || null,
        url: p.location.href,
        hostname: p.location.hostname || null,
        pathname: p.location.pathname || null,
        hash: p.location.hash || null,
        search: p.location.search || null,
        timezone: h,
        locale: J
      }, "eager"]), await ot({
        priority: "background",
        ensureContinueBeforeUnload: !0,
        continueAfter: "paint"
      }), document.dispatchEvent(new CustomEvent("framer:pageview", {
        detail: {
          framerLocale: C || null
        }
      }))
    })();
    let x = await u;
    t ? (Ct("framer-rewrite-breakpoints", () => {
        wt(s), p.__framer_onRewriteBreakpoints?.(s)
      }), De(() => {
        st(), it(), Rt(r, x, {
          onRecoverableError: a
        })
      })) : Ee(r, {
        onRecoverableError: a
      })
      .render(x)
  } catch (o) {
    throw a(o, void 0, !1), o
  }
}(function() {
  Xe && De(() => {
    Ee(document.getElementById("__framer-badge-container"))
      .render(ee(Je, {}, ee(ut(ne), {
        className: "__framer-badge",
        __framer__threshold: .5,
        __framer__animateOnce: !0,
        __framer__opacity: 0,
        __framer__targetOpacity: 1,
        __framer__rotate: 0,
        __framer__x: 0,
        __framer__y: 10,
        __framer__scale: 1,
        __framer__transition: {
          type: "spring",
          ease: [.44, 0, .56, 1],
          duration: .3,
          delay: 1,
          stiffness: 350,
          damping: 40,
          mass: 1.5
        },
        __framer__rotateX: 0,
        __framer__rotateY: 0,
        __framer__perspective: 1200
      }, ee(Ze(() => import("./PX9hIOIVM-UVPRYH5Y.mjs"))))))
  })
})();
export {
  gn as getLayoutTemplateBreakpoints, ro as getPageRoot
};
//# sourceMappingURL=script_main.LIBSCCCG.mjs.map