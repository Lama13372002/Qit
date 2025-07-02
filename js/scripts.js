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
! function() {
  function c(t, r) {
    let e = r.indexOf("#"),
      n = e === -1 ? r : r.substring(0, e),
      o = e === -1 ? "" : r.substring(e),
      a = n.indexOf("?");
    if (a === -1) return n + t + o;
    let d = new URLSearchParams(t),
      h = n.substring(a + 1),
      s = new URLSearchParams(h);
    for (let [i, m] of d) s.has(i) || s.append(i, m);
    return n.substring(0, a + 1) + s.toString() + o
  }
  var l = 'div#main a[href^="#"],div#main a[href^="/"],div#main a[href^="."]',
    u = "div#main a[data-framer-preserve-params]",
    f, g = (f = document.currentScript) == null ? void 0 : f.hasAttribute("data-preserve-internal-params");
  if (window.location.search && !/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(navigator.userAgent)) {
    let t = document.querySelectorAll(g ? `${l},${u}` : u);
    for (let r of t) {
      let e = c(window.location.search, r.href);
      r.setAttribute("href", e)
    }
  }
}()

/* Inline JS Block 4 */
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
  var G = (e, t, r = 10) => {
    let o = "",
      s = Math.max(Math.round(t / r), 2);
    for (let n = 0; n < s; n++) o += e(n / (s - 1)) + ", ";
    return `linear(${o.substring(0,o.length-2)})`
  };

  function $(e) {
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
      s = Math.min($(o), 2e4);
    return {
      type: "keyframes",
      ease: n => o.next(s * n)
        .value / t,
      duration: v(s)
    }
  }
  var Ee = 5;

  function me(e, t, r) {
    let o = Math.max(t - Ee, 0);
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
        d = L(m, i),
        g = Math.exp(-c);
      return H - u / d * g
    }, n = m => {
      let c = m * i * e,
        u = c * r + r,
        d = Math.pow(i, 2) * Math.pow(m, 2) * e,
        g = Math.exp(-c),
        y = L(Math.pow(m, 2), i);
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
  var Pe = 12;

  function Ce(e, t, r) {
    let o = r;
    for (let s = 1; s < Pe; s++) o = o - e(o) / t(o);
    return o
  }

  function L(e, t) {
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
      B = Math.abs(h) < 5;
    o || (o = B ? l.restSpeed.granular : l.restSpeed.default), s || (s = B ? l.restDelta.granular : l.restDelta.default);
    let S;
    if (y < 1) {
      let x = L(T, y);
      S = A => {
        let M = Math.exp(-y * T * A);
        return i - M * ((g + y * T * h) / x * Math.sin(x * A) + h * Math.cos(x * A))
      }
    } else if (y === 1) S = x => i - Math.exp(-T * x) * (h + (g + T * h) * x);
    else {
      let x = T * Math.sqrt(y * y - 1);
      S = A => {
        let M = Math.exp(-y * T * A),
          z = Math.min(x * A, 300);
        return i - M * ((g + y * T * h) * Math.sinh(z) + x * h * Math.cosh(z)) / x
      }
    }
    let V = {
      calculatedDuration: d && c || null,
      next: x => {
        let A = S(x);
        if (d) f.done = x >= c;
        else {
          let M = x === 0 ? g : 0;
          y < 1 && (M = x === 0 ? w(g) : me(S, x, A));
          let z = Math.abs(M) <= o,
            ke = Math.abs(i - A) <= s;
          f.done = z && ke
        }
        return f.value = f.done ? i : A, f
      },
      toString: () => {
        let x = Math.min($(V), 2e4),
          A = G(M => V.next(x * M)
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
    if (e) return typeof e == "function" ? xe() ? G(e, t) : "ease-out" : Y(e) ? O(e) : Array.isArray(e) ? e.map(r => J(r, t) || Q.easeOut) : Q[e]
  }

  function R(e, t, r, {
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
    E = new Map;
  var P = (e, t) => {
    let r = _.has(t) ? "transform" : t;
    return `${e}: ${r}`
  };

  function te(e, t, r) {
    let o = P(e, t),
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
  var N, C, re = new Set;

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
    let i = P(n, t);
    C || (C = R(e, t, [r[0], r[0]], {
      duration: 1e4,
      ease: "linear"
    }), b.set(i, {
      animation: C,
      startTime: null
    }), window.MotionHandoffAnimation = te, window.MotionHasOptimisedAnimation = (a, m) => {
      if (!a) return !1;
      if (!m) return E.has(a);
      let p = P(a, m);
      return !!b.get(p)
    }, window.MotionHandoffMarkAsComplete = a => {
      E.has(a) && E.set(a, !0)
    }, window.MotionHandoffIsComplete = a => E.get(a) === !0, window.MotionCancelOptimisedAnimation = (a, m, p, c) => {
      let u = P(a, m),
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
      let a = R(e, t, r, o);
      N === void 0 && (N = performance.now()), a.startTime = N, b.set(i, {
        animation: a,
        startTime: N
      }), s && s(a)
    };
    E.set(n, !1), C.ready ? C.ready.then(f)
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
  var Me = {
      duration: .001
    },
    K = {
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
      let f = e[i] ?? K[i],
        a = t[i] ?? K[i];
      if (f === void 0 || a === void 0 || i !== "transformPerspective" && f === a && f === K[i]) continue;
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
      p = s ? Me : m,
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
      f = s ? Me : n,
      a = {};
    for (let p of ae(e, t)) {
      let c = e[p] ?? K[p],
        u = t[p] ?? K[p];
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
    Se = 10;

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
    for (; !f.done && m < I(10);) f = i.next(m), a.push(f.value), m += Se;
    n = a;
    let p = m - Se,
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
      for (let [S, V] of Object.entries(y)) h[S] = V.keyframes, T[S] = V.options;
      let B = n ? `:not(.hidden-${n}) ` : "";
      t(`${B}[${r}="${i}"]`, h, T)
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

/* Inline JS Block 5 */
{
  "1om2fo9": {
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
  "1d395yu": {
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
    "1vb5nd8": {
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
    "1g6n99x": {
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
  "eo2q79": {
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
    "1vb5nd8": {
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
    "1g6n99x": {
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
  "1kve1qe": {
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
    "1vb5nd8": {
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
    "1g6n99x": {
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
  "xnpm2y": {
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
    "1vb5nd8": {
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
    "1g6n99x": {
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

/* Inline JS Block 6 */
[{
  "hash": "72rtr7",
  "mediaQuery": "(min-width: 1200px)"
}, {
  "hash": "1g6n99x",
  "mediaQuery": "(min-width: 810px) and (max-width: 1199px)"
}, {
  "hash": "1vb5nd8",
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

/* Inline JS Block 7 */
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

/* Inline JS Block 8 */
import {
  d as Ue
} from "./chunk-ROSELVJL.mjs";
import "./chunk-42U43NKG.mjs";
import {
  $ as mr,
  A as P,
  Aa as br,
  B as i,
  Ba as Y,
  Da as vr,
  Ea as ce,
  Ga as ae,
  H as ar,
  Ha as wr,
  I as be,
  Ia as Ir,
  J as ve,
  Ja as Cr,
  K as $,
  L as we,
  M as or,
  Ma as G,
  Na as Ce,
  P as nr,
  Pa as ke,
  Q as ir,
  Qa as Z,
  R as F,
  T as sr,
  Ta as Re,
  U as lr,
  Ua as z,
  Va as Q,
  W as cr,
  Wa as ze,
  X as Pe,
  Xa as kr,
  Y as Se,
  Z as dr,
  _,
  ba as O,
  c as y,
  d as Ze,
  da as fr,
  f as re,
  fa as I,
  g as N,
  ga as pr,
  h as Qe,
  i as Ke,
  ia as S,
  j as Ne,
  ja as se,
  k as $e,
  l as E,
  la as Ie,
  m as er,
  n as D,
  pa as ur,
  q as T,
  qa as hr,
  r as V,
  ra as A,
  s as rr,
  sa as J,
  ta as ne,
  u as De,
  ua as yr,
  v as e,
  va as gr,
  w as j,
  wa as xr,
  y as b,
  z as tr
} from "./chunk-YCB5WALT.mjs";
import "./chunk-HZL4YIMB.mjs";
import {
  b as H,
  c as p
} from "./chunk-A3IIQ6X3.mjs";
var Or = "default" in ve ? ar : ve,
  Ve = {},
  Rr = Or;
Ve.createRoot = Rr.createRoot;
Ve.hydrateRoot = Rr.hydrateRoot;
var Be = Ve.createRoot,
  Vr = Ve.hydrateRoot;
Ce.loadFonts([]);
var Fr = [{
    explicitInter: !0,
    fonts: []
  }],
  _r = [".framer-Ov6PI .framer-styles-preset-d12qnh:not(.rich-text-wrapper), .framer-Ov6PI .framer-styles-preset-d12qnh.rich-text-wrapper a { --framer-link-current-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #efe7d2); --framer-link-current-text-decoration: none; --framer-link-hover-text-color: var(--token-ba35ffdc-68bb-41bc-880c-4aa29d4488ec, #cfbe91); --framer-link-hover-text-decoration: none; --framer-link-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #efe7d2); --framer-link-text-decoration: none; transition: color 0.3s cubic-bezier(0.5, 0, 0.88, 0.77) 0s; }"],
  Lr = "framer-Ov6PI";
Ce.loadFonts(["GF;Forum-regular"]);
var Mr = [{
    explicitInter: !0,
    fonts: [{
      family: "Forum",
      source: "google",
      style: "normal",
      url: "https://fonts.gstatic.com/s/forum/v18/6aey4Ky-Vb8Ew_ITMJMa3mnT.woff2",
      weight: "400"
    }]
  }],
  Nr = ['.framer-KCbCf .framer-styles-preset-6pfvm8:not(.rich-text-wrapper), .framer-KCbCf .framer-styles-preset-6pfvm8.rich-text-wrapper p { --framer-font-family: "Forum", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 64px; --framer-font-style: normal; --framer-font-weight: 400; --framer-letter-spacing: 2px; --framer-line-height: 110%; --framer-paragraph-spacing: 20px; --framer-text-alignment: center; --framer-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #dac5a7); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: uppercase; }', '@media (max-width: 1399px) and (min-width: 1200px) { .framer-KCbCf .framer-styles-preset-6pfvm8:not(.rich-text-wrapper), .framer-KCbCf .framer-styles-preset-6pfvm8.rich-text-wrapper p { --framer-font-family: "Forum", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 56px; --framer-font-style: normal; --framer-font-weight: 400; --framer-letter-spacing: 2px; --framer-line-height: 110%; --framer-paragraph-spacing: 20px; --framer-text-alignment: center; --framer-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #dac5a7); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: uppercase; } }', '@media (max-width: 1199px) and (min-width: 810px) { .framer-KCbCf .framer-styles-preset-6pfvm8:not(.rich-text-wrapper), .framer-KCbCf .framer-styles-preset-6pfvm8.rich-text-wrapper p { --framer-font-family: "Forum", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 48px; --framer-font-style: normal; --framer-font-weight: 400; --framer-letter-spacing: 2px; --framer-line-height: 110%; --framer-paragraph-spacing: 20px; --framer-text-alignment: center; --framer-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #dac5a7); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: uppercase; } }', '@media (max-width: 809px) and (min-width: 0px) { .framer-KCbCf .framer-styles-preset-6pfvm8:not(.rich-text-wrapper), .framer-KCbCf .framer-styles-preset-6pfvm8.rich-text-wrapper p { --framer-font-family: "Forum", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 32px; --framer-font-style: normal; --framer-font-weight: 400; --framer-letter-spacing: 2px; --framer-line-height: 110%; --framer-paragraph-spacing: 20px; --framer-text-alignment: center; --framer-text-color: var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, #dac5a7); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: uppercase; } }'],
  Dr = "framer-KCbCf";
var qr = {
    k8UcUQKux: {
      hover: !0
    }
  },
  Jr = "framer-Vs8AD",
  Xr = {
    k8UcUQKux: "framer-v-1eodogi"
  };

function Zr(r, ...t) {
  let a = {};
  return t?.forEach(o => o && Object.assign(a, r[o])), a
}
var Qr = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  Kr = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  $r = i.create(y),
  et = ({
    height: r,
    id: t,
    tap2: a,
    width: o,
    ...n
  }) => ({
    ...n,
    UdJC1_vBf: a ?? n.UdJC1_vBf
  }),
  rt = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  tt = N(function(r, t) {
    let {
      activeLocale: a,
      setLocale: o
    } = F(), {
      style: n,
      className: c,
      layoutId: s,
      variant: m,
      UdJC1_vBf: h,
      ...l
    } = et(r), {
      baseVariant: g,
      classNames: C,
      clearLoadingGesture: k,
      gestureHandlers: U,
      gestureVariant: x,
      isLoading: q,
      setGestureState: R,
      setVariant: B,
      variants: w
    } = G({
      defaultVariant: "k8UcUQKux",
      enabledGestures: qr,
      variant: m,
      variantClassNames: Xr
    }), u = rt(r, w), {
      activeVariantCallback: M,
      delay: W
    } = ae(g), v = M(async (...ie) => {
      if (R({
          isPressed: !1
        }), h && await h(...ie) === !1) return !1
    }), d = V(null), L = D(), te = [], ee = A();
    return e(P, {
      id: s ?? L,
      children: e($r, {
        animate: w,
        initial: !1,
        children: e(Kr, {
          value: Qr,
          children: e(i.div, {
            ...l,
            ...U,
            className: I(Jr, ...te, "framer-1eodogi", c, C),
            "data-border": !0,
            "data-framer-name": "Variant 1",
            "data-highlight": !0,
            layoutDependency: u,
            layoutId: "k8UcUQKux",
            onTap: v,
            ref: t ?? d,
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
            ...Zr({
              "k8UcUQKux-hover": {
                "data-framer-name": void 0
              }
            }, g, x),
            children: j(i.div, {
              className: "framer-fwto7e",
              layoutDependency: u,
              layoutId: "hiDyxaPYs",
              children: [e(i.div, {
                className: "framer-lovqnv",
                "data-framer-name": "Line",
                layoutDependency: u,
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
                layoutDependency: u,
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
  at = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-Vs8AD.framer-1jvsus0, .framer-Vs8AD .framer-1jvsus0 { display: block; }", ".framer-Vs8AD.framer-1eodogi { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 5px; height: 41px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 41px; will-change: var(--framer-will-change-override, transform); }", ".framer-Vs8AD .framer-fwto7e { flex: none; height: 13px; overflow: visible; position: relative; width: 20px; }", ".framer-Vs8AD .framer-lovqnv, .framer-Vs8AD .framer-gk5npz { flex: none; height: 1px; left: 0px; position: absolute; right: 0px; top: calc(46.15384615384618% - 1px / 2); z-index: 1; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-Vs8AD.framer-1eodogi { gap: 0px; } .framer-Vs8AD.framer-1eodogi > * { margin: 0px; margin-bottom: calc(5px / 2); margin-top: calc(5px / 2); } .framer-Vs8AD.framer-1eodogi > :first-child { margin-top: 0px; } .framer-Vs8AD.framer-1eodogi > :last-child { margin-bottom: 0px; } }", '.framer-Vs8AD[data-border="true"]::after, .framer-Vs8AD [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  de = S(tt, at, "framer-Vs8AD"),
  je = de;
de.displayName = "Menu/Menu Nav Close Toggle";
de.defaultProps = {
  height: 41,
  width: 41
};
O(de, {
  UdJC1_vBf: {
    title: "Tap 2",
    type: _.EventHandler
  }
});
z(de, [{
  explicitInter: !0,
  fonts: []
}], {
  supportsExplicitInterCodegen: !0
});
var ot = Q(je),
  nt = ["EGqK4uSJI", "ysPOVDWMi", "kQwlISGHm"],
  it = "framer-lbxxG",
  st = {
    EGqK4uSJI: "framer-v-1ejo7hz",
    kQwlISGHm: "framer-v-14abo59",
    ysPOVDWMi: "framer-v-1u9ksd2"
  };

function Pr(r, ...t) {
  let a = {};
  return t?.forEach(o => o && Object.assign(a, r[o])), a
}
var lt = {
    duration: 0,
    type: "tween"
  },
  ct = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  dt = i.create(y),
  mt = {
    Desktop: "EGqK4uSJI",
    Phone: "kQwlISGHm",
    Tablet: "ysPOVDWMi"
  },
  ft = ({
    height: r,
    id: t,
    menuClose: a,
    width: o,
    ...n
  }) => ({
    ...n,
    variant: mt[n.variant] ?? n.variant ?? "EGqK4uSJI",
    woAUVjEwf: a ?? n.woAUVjEwf
  }),
  pt = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  ut = N(function(r, t) {
    let a = V(null),
      o = t ?? a,
      n = D(),
      {
        activeLocale: c,
        setLocale: s
      } = F(),
      m = A(),
      {
        style: h,
        className: l,
        layoutId: g,
        variant: C,
        woAUVjEwf: k,
        ...U
      } = ft(r),
      {
        baseVariant: x,
        classNames: q,
        clearLoadingGesture: R,
        gestureHandlers: B,
        gestureVariant: w,
        isLoading: u,
        setGestureState: M,
        setVariant: W,
        variants: v
      } = G({
        cycleOrder: nt,
        defaultVariant: "EGqK4uSJI",
        ref: o,
        variant: C,
        variantClassNames: st
      }),
      d = pt(r, v),
      {
        activeVariantCallback: L,
        delay: te
      } = ae(x),
      ee = L(async (...xe) => {
        if (k && await k(...xe) === !1) return !1
      }),
      ie = L(async (...xe) => {
        if (k && await k(...xe) === !1) return !1
      }),
      X = I(it, ...[Dr, Lr]);
    return e(P, {
      id: g ?? n,
      children: e(dt, {
        animate: v,
        initial: !1,
        children: e(ct, {
          value: lt,
          children: e(i.div, {
            ...U,
            ...B,
            className: I(X, "framer-1ejo7hz", l, q),
            "data-framer-name": "Desktop",
            layoutDependency: d,
            layoutId: "EGqK4uSJI",
            ref: o,
            style: {
              ...h
            },
            ...Pr({
              kQwlISGHm: {
                "data-framer-name": "Phone"
              },
              ysPOVDWMi: {
                "data-framer-name": "Tablet"
              }
            }, x, w),
            children: j(i.div, {
              className: "framer-2vbwoo",
              "data-border": !0,
              "data-framer-name": "Menu",
              layoutDependency: d,
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
              children: [j(i.div, {
                className: "framer-b4teiz",
                "data-framer-name": "Menu Inner",
                layoutDependency: d,
                layoutId: "K4ZFiAL65",
                children: [j(i.div, {
                  className: "framer-1j5lppg",
                  layoutDependency: d,
                  layoutId: "s6n7TK5jU",
                  children: [e(i.div, {
                    className: "framer-5oscp7",
                    "data-border": !0,
                    "data-framer-name": "Icon",
                    layoutDependency: d,
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
                    layoutDependency: d,
                    layoutId: "AkZZ33Z5w",
                    style: {
                      backgroundColor: "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))"
                    }
                  }), e(i.div, {
                    className: "framer-1st33s4",
                    "data-border": !0,
                    "data-framer-name": "Icon",
                    layoutDependency: d,
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
                }), e(Z, {
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
                  layoutDependency: d,
                  layoutId: "ySIwIlu6J",
                  onTap: ee,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), e(Z, {
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
                  layoutDependency: d,
                  layoutId: "zYNdZsQs0",
                  onTap: ee,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), e(Z, {
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
                  layoutDependency: d,
                  layoutId: "ddAFYVnus",
                  onTap: ee,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), e(Z, {
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
                  layoutDependency: d,
                  layoutId: "CZY77IS8a",
                  onTap: ee,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), e(Z, {
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
                  layoutDependency: d,
                  layoutId: "qZwqLsZoN",
                  onTap: ee,
                  verticalAlignment: "top",
                  withExternalLayout: !0
                }), j(i.div, {
                  className: "framer-9c353n",
                  layoutDependency: d,
                  layoutId: "CE0LeouLD",
                  children: [e(i.div, {
                    className: "framer-1kgg8ta",
                    "data-border": !0,
                    "data-framer-name": "Icon",
                    layoutDependency: d,
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
                    layoutDependency: d,
                    layoutId: "DPCI1QDTP",
                    style: {
                      backgroundColor: "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgb(51, 51, 48))"
                    }
                  }), e(i.div, {
                    className: "framer-198odx",
                    "data-border": !0,
                    "data-framer-name": "Icon",
                    layoutDependency: d,
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
              }), e(J, {
                height: 41,
                width: "41px",
                y: (m?.y || 0) + (16 + ((m?.height || 960) - 32 - ((m?.height || 960) - 32) * 1) / 2) + 32,
                ...Pr({
                  kQwlISGHm: {
                    y: (m?.y || 0) + (12 + ((m?.height || 960) - 24 - ((m?.height || 960) - 24) * 1) / 2) + 24
                  }
                }, x, w),
                children: e(yr, {
                  className: "framer-mxaewn-container",
                  layoutDependency: d,
                  layoutId: "N8O34hDAj-container",
                  nodeId: "N8O34hDAj",
                  rendersWithMotion: !0,
                  scopeId: "ey9RMFL0A",
                  children: e(je, {
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
  ht = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-lbxxG.framer-1v7nap9, .framer-lbxxG .framer-1v7nap9 { display: block; }", ".framer-lbxxG.framer-1ejo7hz { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 16px; height: 960px; justify-content: center; overflow: hidden; padding: 16px; position: relative; width: 1200px; }", ".framer-lbxxG .framer-2vbwoo { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 24px; height: 100%; justify-content: center; overflow: visible; padding: 64px; position: relative; width: 1px; z-index: 10; }", ".framer-lbxxG .framer-b4teiz { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px; position: relative; width: 100%; }", ".framer-lbxxG .framer-1j5lppg, .framer-lbxxG .framer-9c353n { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: visible; padding: 7px 0px 7px 0px; position: relative; width: min-content; }", ".framer-lbxxG .framer-5oscp7, .framer-lbxxG .framer-1st33s4, .framer-lbxxG .framer-1kgg8ta, .framer-lbxxG .framer-198odx { aspect-ratio: 1 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 8px); position: relative; width: 8px; }", ".framer-lbxxG .framer-1xm3t8i, .framer-lbxxG .framer-1srcj8 { flex: none; height: 1px; position: relative; width: 20px; }", ".framer-lbxxG .framer-1ryfvtr, .framer-lbxxG .framer-1fhc25u, .framer-lbxxG .framer-1s8wozh, .framer-lbxxG .framer-1isjnk2, .framer-lbxxG .framer-gzom6o { cursor: pointer; flex: none; height: auto; position: relative; white-space: pre; width: auto; }", ".framer-lbxxG .framer-mxaewn-container { flex: none; height: 41px; left: 32px; position: absolute; top: 32px; width: 41px; z-index: 1; }", ".framer-lbxxG.framer-v-1u9ksd2.framer-1ejo7hz { gap: 12px; width: 810px; }", ".framer-lbxxG.framer-v-1u9ksd2 .framer-2vbwoo, .framer-lbxxG.framer-v-14abo59 .framer-2vbwoo { padding: 32px; }", ".framer-lbxxG.framer-v-14abo59.framer-1ejo7hz { gap: 12px; padding: 12px; width: 390px; }", ".framer-lbxxG.framer-v-14abo59 .framer-b4teiz { gap: 12px; }", ".framer-lbxxG.framer-v-14abo59 .framer-mxaewn-container { left: unset; right: 24px; top: 24px; }", ...Nr, ..._r, '.framer-lbxxG[data-border="true"]::after, .framer-lbxxG [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  me = S(ut, ht, "framer-lbxxG"),
  Ee = me;
me.displayName = "Menu";
me.defaultProps = {
  height: 960,
  width: 1200
};
O(me, {
  variant: {
    options: ["EGqK4uSJI", "ysPOVDWMi", "kQwlISGHm"],
    optionTitles: ["Desktop", "Tablet", "Phone"],
    title: "Variant",
    type: _.Enum
  },
  woAUVjEwf: {
    title: "Menu Close",
    type: _.EventHandler
  }
});
z(me, [{
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
}, ...ot, ...ze(Mr), ...ze(Fr)], {
  supportsExplicitInterCodegen: !0
});
var yt = "framer-B37TV",
  gt = {
    RTbTyDf3l: "framer-v-5tsxk7"
  };
var xt = {
    bounce: .2,
    delay: 0,
    duration: .4,
    type: "spring"
  },
  bt = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  vt = i.create(y),
  wt = ({
    height: r,
    id: t,
    width: a,
    ...o
  }) => ({
    ...o
  }),
  It = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  Ct = N(function(r, t) {
    let {
      activeLocale: a,
      setLocale: o
    } = F(), {
      style: n,
      className: c,
      layoutId: s,
      variant: m,
      ...h
    } = wt(r), {
      baseVariant: l,
      classNames: g,
      clearLoadingGesture: C,
      gestureHandlers: k,
      gestureVariant: U,
      isLoading: x,
      setGestureState: q,
      setVariant: R,
      variants: B
    } = G({
      defaultVariant: "RTbTyDf3l",
      variant: m,
      variantClassNames: gt
    }), w = It(r, B), u = V(null), M = D(), W = [], v = A();
    return e(P, {
      id: s ?? M,
      children: e(vt, {
        animate: B,
        initial: !1,
        children: e(bt, {
          value: xt,
          children: e(ke, {
            ...h,
            ...k,
            background: {
              alt: "",
              fit: "fill",
              intrinsicHeight: 1100,
              intrinsicWidth: 1920,
              loading: Re(v?.y || 0),
              pixelHeight: 1100,
              pixelWidth: 1920,
              sizes: v?.width || "100vw",
              src: "https://framerusercontent.com/images/8G8Y8b1ZHwFvDzVUQQlr4waN1DI.jpg",
              srcSet: "https://framerusercontent.com/images/8G8Y8b1ZHwFvDzVUQQlr4waN1DI.jpg?scale-down-to=512 512w,https://framerusercontent.com/images/8G8Y8b1ZHwFvDzVUQQlr4waN1DI.jpg?scale-down-to=1024 1024w,https://framerusercontent.com/images/8G8Y8b1ZHwFvDzVUQQlr4waN1DI.jpg 1920w"
            },
            className: I(yt, ...W, "framer-5tsxk7", c, g),
            "data-framer-name": "Desktop",
            layoutDependency: w,
            layoutId: "RTbTyDf3l",
            ref: t ?? u,
            style: {
              opacity: .08,
              ...n
            }
          })
        })
      })
    })
  }),
  kt = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-B37TV.framer-qx318g, .framer-B37TV .framer-qx318g { display: block; }", ".framer-B37TV.framer-5tsxk7 { height: 960px; overflow: hidden; position: relative; width: 1200px; }"],
  Fe = S(Ct, kt, "framer-B37TV"),
  Te = Fe;
Fe.displayName = "Layout/Body Background Image";
Fe.defaultProps = {
  height: 960,
  width: 1200
};
z(Fe, [{
  explicitInter: !0,
  fonts: []
}], {
  supportsExplicitInterCodegen: !0
});
var Rt = "framer-WP7ej",
  Vt = {
    CpeSohLeF: "framer-v-6xtryv"
  };
var Ft = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  _t = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  Lt = i.create(y),
  Mt = ({
    height: r,
    id: t,
    link: a,
    width: o,
    ...n
  }) => ({
    ...n,
    a28gi3Ahz: a ?? n.a28gi3Ahz
  }),
  Nt = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  Dt = N(function(r, t) {
    let {
      activeLocale: a,
      setLocale: o
    } = F(), {
      style: n,
      className: c,
      layoutId: s,
      variant: m,
      a28gi3Ahz: h,
      ...l
    } = Mt(r), {
      baseVariant: g,
      classNames: C,
      clearLoadingGesture: k,
      gestureHandlers: U,
      gestureVariant: x,
      isLoading: q,
      setGestureState: R,
      setVariant: B,
      variants: w
    } = G({
      defaultVariant: "CpeSohLeF",
      variant: m,
      variantClassNames: Vt
    }), u = Nt(r, w), M = V(null), W = D(), v = [], d = A();
    return e(P, {
      id: s ?? W,
      children: e(Lt, {
        animate: w,
        initial: !1,
        children: e(_t, {
          value: Ft,
          children: e(Y, {
            href: h,
            children: e(i.a, {
              ...l,
              ...U,
              className: `${I(Rt,...v,"framer-6xtryv",c,C)} framer-1ypskfr`,
              "data-framer-name": "Default",
              layoutDependency: u,
              layoutId: "CpeSohLeF",
              ref: t ?? M,
              style: {
                ...n
              },
              children: e(ke, {
                background: {
                  alt: "",
                  fit: "fill",
                  intrinsicHeight: 31.5,
                  intrinsicWidth: 118.5,
                  loading: Re((d?.y || 0) + (4 + ((d?.height || 30.5) - 4 - 32) / 2)),
                  pixelHeight: 63,
                  pixelWidth: 237,
                  src: "https://framerusercontent.com/images/x0JzSofUJm2jTIMMg5jbgdRYVzU.webp"
                },
                className: "framer-493dzc",
                "data-framer-name": "Logo",
                layoutDependency: u,
                layoutId: "sEe24pmCc"
              })
            })
          })
        })
      })
    })
  }),
  Pt = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-WP7ej.framer-1ypskfr, .framer-WP7ej .framer-1ypskfr { display: block; }", ".framer-WP7ej.framer-6xtryv { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; overflow: visible; padding: 4px 0px 0px 0px; position: relative; text-decoration: none; width: 100px; }", ".framer-WP7ej .framer-493dzc { aspect-ratio: 3.761904761904762 / 1; flex: 1 0 0px; height: var(--framer-aspect-ratio-supported, 27px); overflow: visible; position: relative; width: 1px; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-WP7ej.framer-6xtryv { gap: 0px; } .framer-WP7ej.framer-6xtryv > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-WP7ej.framer-6xtryv > :first-child { margin-left: 0px; } .framer-WP7ej.framer-6xtryv > :last-child { margin-right: 0px; } }"],
  fe = S(Dt, Pt, "framer-WP7ej"),
  Ae = fe;
fe.displayName = "Layout/Logo";
fe.defaultProps = {
  height: 30.5,
  width: 100
};
O(fe, {
  a28gi3Ahz: {
    title: "Link",
    type: _.Link
  }
});
z(fe, [{
  explicitInter: !0,
  fonts: []
}], {
  supportsExplicitInterCodegen: !0
});
var St = {
    AzhqezM_b: {
      hover: !0
    },
    MblpBuNJI: {
      hover: !0
    },
    Sj4YIbMBa: {
      hover: !0
    }
  },
  zt = ["Sj4YIbMBa", "AzhqezM_b", "MblpBuNJI"],
  Ut = "framer-ic0ZY",
  Bt = {
    AzhqezM_b: "framer-v-makjb1",
    MblpBuNJI: "framer-v-e705y3",
    Sj4YIbMBa: "framer-v-1twnrr8"
  };

function Sr(r, ...t) {
  let a = {};
  return t?.forEach(o => o && Object.assign(a, r[o])), a
}
var jt = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  Et = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  Tt = i.create(y),
  At = {
    Default: "Sj4YIbMBa",
    Muted: "AzhqezM_b",
    Primary: "MblpBuNJI"
  },
  Gt = ({
    height: r,
    id: t,
    link: a,
    newTab: o,
    title: n,
    width: c,
    ...s
  }) => {
    var m, h, l;
    return {
      ...s,
      amWyVdppW: o ?? s.amWyVdppW,
      ApxukoHYo: (m = n ?? s.ApxukoHYo) !== null && m !== void 0 ? m : "Button",
      QkE8o0HIe: a ?? s.QkE8o0HIe,
      variant: (l = (h = At[s.variant]) !== null && h !== void 0 ? h : s.variant) !== null && l !== void 0 ? l : "Sj4YIbMBa"
    }
  },
  Ot = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  Wt = N(function(r, t) {
    let {
      activeLocale: a,
      setLocale: o
    } = F(), {
      style: n,
      className: c,
      layoutId: s,
      variant: m,
      ApxukoHYo: h,
      QkE8o0HIe: l,
      amWyVdppW: g,
      ...C
    } = Gt(r), {
      baseVariant: k,
      classNames: U,
      clearLoadingGesture: x,
      gestureHandlers: q,
      gestureVariant: R,
      isLoading: B,
      setGestureState: w,
      setVariant: u,
      variants: M
    } = G({
      cycleOrder: zt,
      defaultVariant: "Sj4YIbMBa",
      enabledGestures: St,
      variant: m,
      variantClassNames: Bt
    }), W = Ot(r, M), v = V(null), d = D(), L = [], te = A();
    return e(P, {
      id: s ?? d,
      children: e(Tt, {
        animate: M,
        initial: !1,
        children: e(Et, {
          value: jt,
          children: e(Y, {
            href: l,
            openInNewTab: g,
            children: e(i.a, {
              ...C,
              ...q,
              className: `${I(Ut,...L,"framer-1twnrr8",c,U)} framer-w44gnw`,
              "data-border": !0,
              "data-framer-name": "Default",
              layoutDependency: W,
              layoutId: "Sj4YIbMBa",
              ref: t ?? v,
              style: {
                "--border-bottom-width": "1px",
                "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgba(218, 197, 167, 0.15))",
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
                "AzhqezM_b-hover": {
                  "--border-color": "var(--token-52eaa3b2-9b53-4c12-9790-fce4171dff3e, rgb(78, 76, 71))",
                  backgroundColor: "var(--token-c18e5c55-e670-494b-9afe-b018358f3867, rgb(17, 17, 17))"
                },
                "MblpBuNJI-hover": {
                  "--border-bottom-width": "0px",
                  "--border-left-width": "0px",
                  "--border-right-width": "0px",
                  "--border-top-width": "0px",
                  backgroundColor: "var(--token-ba35ffdc-68bb-41bc-880c-4aa29d4488ec, rgb(20, 20, 19))"
                },
                "Sj4YIbMBa-hover": {
                  "--border-color": "var(--token-52eaa3b2-9b53-4c12-9790-fce4171dff3e, rgb(78, 76, 71))"
                },
                AzhqezM_b: {
                  "--border-color": "var(--token-68c05b50-ca7b-4173-82aa-ed42aea1a9b4, rgba(239, 231, 210, 0.15))",
                  backgroundColor: "var(--token-cd2934a7-4e35-4347-a32c-9650fca4db23, rgb(242, 242, 242))"
                },
                MblpBuNJI: {
                  "--border-bottom-width": "0px",
                  "--border-left-width": "0px",
                  "--border-right-width": "0px",
                  "--border-top-width": "0px",
                  backgroundColor: "var(--token-dca875b7-f855-43c1-bf73-97596e452266, rgb(203, 251, 69))"
                }
              },
              ...Sr({
                "AzhqezM_b-hover": {
                  "data-framer-name": void 0
                },
                "MblpBuNJI-hover": {
                  "data-framer-name": void 0
                },
                "Sj4YIbMBa-hover": {
                  "data-framer-name": void 0
                },
                AzhqezM_b: {
                  "data-framer-name": "Muted"
                },
                MblpBuNJI: {
                  "data-framer-name": "Primary"
                }
              }, k, R),
              children: e(Z, {
                __fromCanvasComponent: !0,
                children: e(y, {
                  children: e(i.p, {
                    style: {
                      "--font-selector": "RlM7U2F0b3NoaS1yZWd1bGFy",
                      "--framer-font-family": '"Satoshi", "Satoshi Placeholder", sans-serif',
                      "--framer-font-size": "12px",
                      "--framer-letter-spacing": "1px",
                      "--framer-line-height": "110%",
                      "--framer-text-alignment": "left",
                      "--framer-text-color": "var(--extracted-r6o4lv, var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, rgb(218, 197, 167)))",
                      "--framer-text-transform": "uppercase"
                    },
                    children: "Button"
                  })
                }),
                className: "framer-189euxk",
                "data-framer-name": "Button",
                fonts: ["FS;Satoshi-regular"],
                layoutDependency: W,
                layoutId: "EtsprDx5u",
                style: {
                  "--extracted-r6o4lv": "var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, rgb(218, 197, 167))"
                },
                text: h,
                variants: {
                  MblpBuNJI: {
                    "--extracted-r6o4lv": "var(--token-c5446a54-80de-4f79-b24b-55997bf1fe5e, rgb(255, 255, 255))"
                  }
                },
                verticalAlignment: "top",
                withExternalLayout: !0,
                ...Sr({
                  MblpBuNJI: {
                    children: e(y, {
                      children: e(i.p, {
                        style: {
                          "--font-selector": "RlM7U2F0b3NoaS1yZWd1bGFy",
                          "--framer-font-family": '"Satoshi", "Satoshi Placeholder", sans-serif',
                          "--framer-font-size": "12px",
                          "--framer-letter-spacing": "1px",
                          "--framer-line-height": "110%",
                          "--framer-text-alignment": "left",
                          "--framer-text-color": "var(--extracted-r6o4lv, var(--token-c5446a54-80de-4f79-b24b-55997bf1fe5e, rgb(255, 255, 255)))",
                          "--framer-text-transform": "uppercase"
                        },
                        children: "Button"
                      })
                    })
                  }
                }, k, R)
              })
            })
          })
        })
      })
    })
  }),
  Ht = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-ic0ZY.framer-w44gnw, .framer-ic0ZY .framer-w44gnw { display: block; }", ".framer-ic0ZY.framer-1twnrr8 { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: center; overflow: visible; padding: 14px 16px 14px 16px; position: relative; text-decoration: none; width: min-content; }", ".framer-ic0ZY .framer-189euxk { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-ic0ZY.framer-1twnrr8 { gap: 0px; } .framer-ic0ZY.framer-1twnrr8 > * { margin: 0px; margin-left: calc(8px / 2); margin-right: calc(8px / 2); } .framer-ic0ZY.framer-1twnrr8 > :first-child { margin-left: 0px; } .framer-ic0ZY.framer-1twnrr8 > :last-child { margin-right: 0px; } }", '.framer-ic0ZY[data-border="true"]::after, .framer-ic0ZY [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  pe = S(Wt, Ht, "framer-ic0ZY"),
  Ge = pe;
pe.displayName = "Components/Button";
pe.defaultProps = {
  height: 41,
  width: 84.5
};
O(pe, {
  variant: {
    options: ["Sj4YIbMBa", "AzhqezM_b", "MblpBuNJI"],
    optionTitles: ["Default", "Muted", "Primary"],
    title: "Variant",
    type: _.Enum
  },
  ApxukoHYo: {
    defaultValue: "Button",
    displayTextArea: !1,
    title: "Title",
    type: _.String
  },
  QkE8o0HIe: {
    title: "Link",
    type: _.Link
  },
  amWyVdppW: {
    defaultValue: !1,
    title: "New Tab",
    type: _.Boolean
  }
});
z(pe, [{
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
var Yt = {
    "I2847:4028;2843:3487": {
      hover: !0
    }
  },
  qt = "framer-28Mcz",
  Jt = {
    "I2847:4028;2843:3487": "framer-v-136wxrw"
  };

function Xt(r, ...t) {
  let a = {};
  return t?.forEach(o => o && Object.assign(a, r[o])), a
}
var Zt = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  Qt = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  Kt = i.create(y),
  $t = ({
    height: r,
    id: t,
    link: a,
    title: o,
    width: n,
    ...c
  }) => {
    var s;
    return {
      ...c,
      i0H2fEiAL: (s = o ?? c.i0H2fEiAL) !== null && s !== void 0 ? s : "Menu",
      zELeGxU0d: a ?? c.zELeGxU0d
    }
  },
  ea = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  ra = N(function(r, t) {
    let {
      activeLocale: a,
      setLocale: o
    } = F(), {
      style: n,
      className: c,
      layoutId: s,
      variant: m,
      zELeGxU0d: h,
      i0H2fEiAL: l,
      ...g
    } = $t(r), {
      baseVariant: C,
      classNames: k,
      clearLoadingGesture: U,
      gestureHandlers: x,
      gestureVariant: q,
      isLoading: R,
      setGestureState: B,
      setVariant: w,
      variants: u
    } = G({
      defaultVariant: "I2847:4028;2843:3487",
      enabledGestures: Yt,
      variant: m,
      variantClassNames: Jt
    }), M = ea(r, u), W = V(null), v = D(), d = [], L = A();
    return e(P, {
      id: s ?? v,
      children: e(Kt, {
        animate: u,
        initial: !1,
        children: e(Qt, {
          value: Zt,
          children: e(Y, {
            href: h,
            children: e(i.a, {
              ...g,
              ...x,
              className: `${I(qt,...d,"framer-136wxrw",c,k)} framer-1s4epyd`,
              "data-border": !0,
              "data-framer-name": "Variant 1",
              layoutDependency: M,
              layoutId: "I2847:4028;2843:3487",
              ref: t ?? W,
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
              ...Xt({
                "I2847:4028;2843:3487-hover": {
                  "data-framer-name": void 0
                }
              }, C, q),
              children: e(Z, {
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
                layoutDependency: M,
                layoutId: "I2847:4028;2843:3488",
                style: {
                  "--extracted-r6o4lv": "var(--token-c5c4fdcb-9482-48bb-aedf-353188472aae, rgb(239, 231, 210))"
                },
                text: l,
                verticalAlignment: "top",
                withExternalLayout: !0
              })
            })
          })
        })
      })
    })
  }),
  ta = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-28Mcz.framer-1s4epyd, .framer-28Mcz .framer-1s4epyd { display: block; }", ".framer-28Mcz.framer-136wxrw { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: hidden; padding: 12px; position: relative; text-decoration: none; width: min-content; will-change: var(--framer-will-change-override, transform); }", ".framer-28Mcz .framer-uml6xa { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-28Mcz.framer-136wxrw { gap: 0px; } .framer-28Mcz.framer-136wxrw > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-28Mcz.framer-136wxrw > :first-child { margin-left: 0px; } .framer-28Mcz.framer-136wxrw > :last-child { margin-right: 0px; } }", '.framer-28Mcz[data-border="true"]::after, .framer-28Mcz [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  ue = S(ra, ta, "framer-28Mcz"),
  _e = ue;
ue.displayName = "Components/Navbar Item";
ue.defaultProps = {
  height: 39.5,
  width: 62
};
O(ue, {
  zELeGxU0d: {
    title: "Link",
    type: _.Link
  },
  i0H2fEiAL: {
    defaultValue: "Menu",
    displayTextArea: !1,
    title: "Title",
    type: _.String
  }
});
z(ue, [{
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
var aa = {
    "I2847:4028;2843:3479": {
      hover: !0
    }
  },
  oa = "framer-1pwiS",
  na = {
    "I2847:4028;2843:3479": "framer-v-ef9byx"
  };

function ia(r, ...t) {
  let a = {};
  return t?.forEach(o => o && Object.assign(a, r[o])), a
}
var sa = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  la = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  ca = i.create(y),
  da = ({
    height: r,
    id: t,
    tap: a,
    width: o,
    ...n
  }) => ({
    ...n,
    MKKuqG1x5: a ?? n.MKKuqG1x5
  }),
  ma = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  fa = N(function(r, t) {
    let {
      activeLocale: a,
      setLocale: o
    } = F(), {
      style: n,
      className: c,
      layoutId: s,
      variant: m,
      MKKuqG1x5: h,
      ...l
    } = da(r), {
      baseVariant: g,
      classNames: C,
      clearLoadingGesture: k,
      gestureHandlers: U,
      gestureVariant: x,
      isLoading: q,
      setGestureState: R,
      setVariant: B,
      variants: w
    } = G({
      defaultVariant: "I2847:4028;2843:3479",
      enabledGestures: aa,
      variant: m,
      variantClassNames: na
    }), u = ma(r, w), {
      activeVariantCallback: M,
      delay: W
    } = ae(g), v = M(async (...ie) => {
      if (R({
          isPressed: !1
        }), h && await h(...ie) === !1) return !1
    }), d = V(null), L = D(), te = [], ee = A();
    return e(P, {
      id: s ?? L,
      children: e(ca, {
        animate: w,
        initial: !1,
        children: e(la, {
          value: sa,
          children: e(i.div, {
            ...l,
            ...U,
            className: I(oa, ...te, "framer-ef9byx", c, C),
            "data-border": !0,
            "data-framer-name": "Variant 1",
            "data-highlight": !0,
            layoutDependency: u,
            layoutId: "I2847:4028;2843:3479",
            onTap: v,
            ref: t ?? d,
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
            ...ia({
              "I2847:4028;2843:3479-hover": {
                "data-framer-name": void 0
              }
            }, g, x),
            children: j(i.div, {
              className: "framer-1jrpmsy",
              layoutDependency: u,
              layoutId: "fdWBRV5Xi",
              children: [e(i.div, {
                className: "framer-1nickyg",
                "data-framer-name": "Menu Toggle Line",
                layoutDependency: u,
                layoutId: "I2847:4028;2843:3480",
                style: {
                  backgroundColor: "rgb(239, 230, 210)"
                }
              }), e(i.div, {
                className: "framer-15qmgh6",
                "data-framer-name": "Menu Toggle Line",
                layoutDependency: u,
                layoutId: "I2847:4028;2843:3481",
                style: {
                  backgroundColor: "rgb(239, 230, 210)"
                }
              }), e(i.div, {
                className: "framer-1kctzd1",
                "data-framer-name": "Menu Toggle Line",
                layoutDependency: u,
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
  pa = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-1pwiS.framer-1u5izhy, .framer-1pwiS .framer-1u5izhy { display: block; }", ".framer-1pwiS.framer-ef9byx { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 5px; height: 41px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 41px; will-change: var(--framer-will-change-override, transform); }", ".framer-1pwiS .framer-1jrpmsy { flex: none; height: 13px; overflow: visible; position: relative; width: 20px; }", ".framer-1pwiS .framer-1nickyg { flex: none; height: 1px; left: 0px; position: absolute; right: 0px; top: 0px; z-index: 1; }", ".framer-1pwiS .framer-15qmgh6 { flex: none; height: 1px; left: 0px; position: absolute; right: 0px; top: calc(48.78048780487807% - 1px / 2); z-index: 1; }", ".framer-1pwiS .framer-1kctzd1 { bottom: 0px; flex: none; height: 1px; left: 0px; position: absolute; right: 0px; z-index: 1; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-1pwiS.framer-ef9byx { gap: 0px; } .framer-1pwiS.framer-ef9byx > * { margin: 0px; margin-bottom: calc(5px / 2); margin-top: calc(5px / 2); } .framer-1pwiS.framer-ef9byx > :first-child { margin-top: 0px; } .framer-1pwiS.framer-ef9byx > :last-child { margin-bottom: 0px; } }", ".framer-1pwiS.framer-v-ef9byx.hover .framer-1nickyg { top: calc(46.15384615384618% - 1px / 2); }", ".framer-1pwiS.framer-v-ef9byx.hover .framer-1kctzd1 { bottom: unset; top: calc(46.15384615384618% - 1px / 2); }", '.framer-1pwiS[data-border="true"]::after, .framer-1pwiS [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }'],
  he = S(fa, pa, "framer-1pwiS"),
  Oe = he;
he.displayName = "Menu/Menu Nav Toggle";
he.defaultProps = {
  height: 41,
  width: 41
};
O(he, {
  MKKuqG1x5: {
    title: "Tap",
    type: _.EventHandler
  }
});
z(he, [{
  explicitInter: !0,
  fonts: []
}], {
  supportsExplicitInterCodegen: !0
});
var ua = Q(Oe),
  ha = Q(Ae),
  ya = Q(_e),
  ga = Q(Ge),
  xa = ["sMX5M2Uqr", "iYWmBinwv"],
  ba = "framer-ppkPa",
  va = {
    iYWmBinwv: "framer-v-1ja1fot",
    sMX5M2Uqr: "framer-v-x917yn"
  };

function Le(r, ...t) {
  let a = {};
  return t?.forEach(o => o && Object.assign(a, r[o])), a
}
var wa = {
    damping: 60,
    delay: 0,
    mass: 1,
    stiffness: 500,
    type: "spring"
  },
  Ia = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  Ca = i.create(y),
  ka = {
    Desktop: "sMX5M2Uqr",
    Phone: "iYWmBinwv"
  },
  Ra = ({
    height: r,
    id: t,
    menuToggle: a,
    width: o,
    ...n
  }) => {
    var c, s;
    return {
      ...n,
      OokibawIE: a ?? n.OokibawIE,
      variant: (s = (c = ka[n.variant]) !== null && c !== void 0 ? c : n.variant) !== null && s !== void 0 ? s : "sMX5M2Uqr"
    }
  },
  Va = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  Fa = N(function(r, t) {
    let {
      activeLocale: a,
      setLocale: o
    } = F(), {
      style: n,
      className: c,
      layoutId: s,
      variant: m,
      OokibawIE: h,
      ...l
    } = Ra(r), {
      baseVariant: g,
      classNames: C,
      clearLoadingGesture: k,
      gestureHandlers: U,
      gestureVariant: x,
      isLoading: q,
      setGestureState: R,
      setVariant: B,
      variants: w
    } = G({
      cycleOrder: xa,
      defaultVariant: "sMX5M2Uqr",
      variant: m,
      variantClassNames: va
    }), u = Va(r, w), {
      activeVariantCallback: M,
      delay: W
    } = ae(g), v = M(async (...X) => {
      if (h && await h(...X) === !1) return !1
    }), d = V(null), L = we(), te = () => g !== "iYWmBinwv", ee = D(), ie = [], f = A();
    return e(P, {
      id: s ?? ee,
      children: e(Ca, {
        animate: w,
        initial: !1,
        children: e(Ia, {
          value: wa,
          children: j(i.div, {
            ...l,
            ...U,
            className: I(ba, ...ie, "framer-x917yn", c, C),
            "data-framer-name": "Desktop",
            layoutDependency: u,
            layoutId: "sMX5M2Uqr",
            ref: t ?? d,
            style: {
              backgroundColor: "rgb(10, 11, 10)",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              ...n
            },
            ...Le({
              iYWmBinwv: {
                "data-framer-name": "Phone"
              }
            }, g, x),
            children: [e(J, {
              height: 41,
              width: "41px",
              y: (f?.y || 0) + (8 + ((f?.height || 57) - 16 - 41) / 2),
              children: e(i.div, {
                className: "framer-1xr4r8t-container",
                layoutDependency: u,
                layoutId: "zKNLyiq_0-container",
                children: e(Oe, {
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
              children: X => e(J, {
                height: 30,
                y: (f?.y || 0) + (8 + ((f?.height || 57) - 16 - 30) / 2),
                ...Le({
                  iYWmBinwv: {
                    width: "90px"
                  }
                }, g, x),
                children: e(i.div, {
                  className: "framer-1un38sm-container",
                  layoutDependency: u,
                  layoutId: "SMpgKPRwU-container",
                  children: e(Ae, {
                    a28gi3Ahz: X[0],
                    height: "100%",
                    id: "SMpgKPRwU",
                    layoutId: "SMpgKPRwU",
                    width: "100%",
                    ...Le({
                      iYWmBinwv: {
                        a28gi3Ahz: X[1],
                        style: {
                          width: "100%"
                        }
                      }
                    }, g, x)
                  })
                })
              })
            }), j(i.div, {
              className: "framer-uw18uo",
              "data-framer-name": "Menu",
              layoutDependency: u,
              layoutId: "I2847:4028;2843:3484",
              children: [te() && e(ce, {
                links: [{
                  href: {
                    webPageId: "W61OseJy9"
                  },
                  implicitPathVariables: void 0
                }],
                children: X => e(J, {
                  height: 39,
                  y: (f?.y || 0) + (8 + ((f?.height || 57) - 16 - 41) / 2) + 1,
                  children: e(i.div, {
                    className: "framer-1e6q382-container",
                    layoutDependency: u,
                    layoutId: "iKkIWZoJ0-container",
                    children: e(_e, {
                      height: "100%",
                      i0H2fEiAL: "Menu",
                      id: "iKkIWZoJ0",
                      layoutId: "iKkIWZoJ0",
                      width: "100%",
                      zELeGxU0d: X[0]
                    })
                  })
                })
              }), te() && e(ce, {
                links: [{
                  href: {
                    webPageId: "OFVwkEg7d"
                  },
                  implicitPathVariables: void 0
                }],
                children: X => e(J, {
                  height: 39,
                  y: (f?.y || 0) + (8 + ((f?.height || 57) - 16 - 41) / 2) + 1,
                  children: e(i.div, {
                    className: "framer-1rkkrfi-container",
                    layoutDependency: u,
                    layoutId: "HCB8r5_0f-container",
                    children: e(_e, {
                      height: "100%",
                      i0H2fEiAL: "About",
                      id: "HCB8r5_0f",
                      layoutId: "HCB8r5_0f",
                      width: "100%",
                      zELeGxU0d: X[0]
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
                children: X => e(J, {
                  height: 41,
                  y: (f?.y || 0) + (8 + ((f?.height || 57) - 16 - 41) / 2) + 0,
                  children: e(i.div, {
                    className: "framer-1h58hyq-container",
                    layoutDependency: u,
                    layoutId: "JbkncrvJZ-container",
                    children: e(Ge, {
                      amWyVdppW: !1,
                      ApxukoHYo: "Book a Table",
                      height: "100%",
                      id: "JbkncrvJZ",
                      layoutId: "JbkncrvJZ",
                      QkE8o0HIe: X[0],
                      variant: "AzhqezM_b",
                      width: "100%",
                      ...Le({
                        iYWmBinwv: {
                          QkE8o0HIe: X[1]
                        }
                      }, g, x)
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
  _a = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-ppkPa.framer-16hkge3, .framer-ppkPa .framer-16hkge3 { display: block; }", ".framer-ppkPa.framer-x917yn { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 12px; height: min-content; justify-content: center; overflow: hidden; padding: 8px; position: relative; width: min-content; will-change: var(--framer-will-change-override, transform); }", ".framer-ppkPa .framer-1xr4r8t-container { flex: none; height: 41px; position: relative; width: 41px; }", ".framer-ppkPa .framer-1un38sm-container, .framer-ppkPa .framer-1e6q382-container, .framer-ppkPa .framer-1rkkrfi-container, .framer-ppkPa .framer-1h58hyq-container { flex: none; height: auto; position: relative; width: auto; }", ".framer-ppkPa .framer-uw18uo { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 4px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-ppkPa.framer-x917yn, .framer-ppkPa .framer-uw18uo { gap: 0px; } .framer-ppkPa.framer-x917yn > * { margin: 0px; margin-left: calc(12px / 2); margin-right: calc(12px / 2); } .framer-ppkPa.framer-x917yn > :first-child, .framer-ppkPa .framer-uw18uo > :first-child { margin-left: 0px; } .framer-ppkPa.framer-x917yn > :last-child, .framer-ppkPa .framer-uw18uo > :last-child { margin-right: 0px; } .framer-ppkPa .framer-uw18uo > * { margin: 0px; margin-left: calc(4px / 2); margin-right: calc(4px / 2); } }", ".framer-ppkPa.framer-v-1ja1fot .framer-1un38sm-container { width: 90px; }"],
  ye = S(Fa, _a, "framer-ppkPa"),
  We = ye;
ye.displayName = "Layout/Header";
ye.defaultProps = {
  height: 57,
  width: 445
};
O(ye, {
  variant: {
    options: ["sMX5M2Uqr", "iYWmBinwv"],
    optionTitles: ["Desktop", "Phone"],
    title: "Variant",
    type: _.Enum
  },
  OokibawIE: {
    title: "Menu Toggle",
    type: _.EventHandler
  }
});
z(ye, [{
  explicitInter: !0,
  fonts: []
}, ...ua, ...ha, ...ya, ...ga], {
  supportsExplicitInterCodegen: !0
});
var zr = Ie(ur(i.a)),
  La = "framer-4GnLc",
  Ma = {
    LCuIJRbSV: "framer-v-aoxxaw"
  };
var Na = {
    bounce: .2,
    delay: 0,
    duration: .4,
    type: "spring"
  },
  Da = {
    delay: 1.2,
    duration: .4,
    ease: [.44, 0, .56, 1],
    type: "tween"
  },
  Pa = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: Da,
    x: 0,
    y: 0
  },
  Ur = {
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
  Sa = {
    delay: 1,
    duration: .4,
    ease: [.44, 0, .56, 1],
    type: "tween"
  },
  za = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: Sa,
    x: 0,
    y: 0
  },
  Ua = ({
    value: r,
    children: t
  }) => {
    let a = E(b),
      o = r ?? a.transition,
      n = T(() => ({
        ...a,
        transition: o
      }), [JSON.stringify(o)]);
    return e(b.Provider, {
      value: n,
      children: t
    })
  },
  Ba = i.create(y),
  ja = ({
    height: r,
    id: t,
    width: a,
    ...o
  }) => ({
    ...o
  }),
  Ea = (r, t) => r.layoutDependency ? t.join("-") + r.layoutDependency : t.join("-"),
  Ta = N(function(r, t) {
    let {
      activeLocale: a,
      setLocale: o
    } = F(), {
      style: n,
      className: c,
      layoutId: s,
      variant: m,
      ...h
    } = ja(r), {
      baseVariant: l,
      classNames: g,
      clearLoadingGesture: C,
      gestureHandlers: k,
      gestureVariant: U,
      isLoading: x,
      setGestureState: q,
      setVariant: R,
      variants: B
    } = G({
      defaultVariant: "LCuIJRbSV",
      variant: m,
      variantClassNames: Ma
    }), w = Ea(r, B), u = V(null), M = D(), W = [], v = A();
    return e(P, {
      id: s ?? M,
      children: e(Ba, {
        animate: B,
        initial: !1,
        children: e(Ua, {
          value: Na,
          children: j(i.div, {
            ...h,
            ...k,
            className: I(La, ...W, "framer-aoxxaw", c, g),
            "data-framer-name": "Desktop",
            layoutDependency: w,
            layoutId: "LCuIJRbSV",
            ref: t ?? u,
            style: {
              ...n
            },
            children: [e(Y, {
              href: "https://gola.io/qitchen",
              openInNewTab: !0,
              children: e(zr, {
                __perspectiveFX: !1,
                __smartComponentFX: !0,
                __targetOpacity: 1,
                animate: Pa,
                className: "framer-gqopxx framer-10e8mc9",
                "data-framer-appear-id": "gqopxx",
                "data-framer-name": "Badge",
                initial: Ur,
                layoutDependency: w,
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
                children: e(Z, {
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
                  layoutDependency: w,
                  layoutId: "KRn31Bk9K",
                  verticalAlignment: "top",
                  withExternalLayout: !0
                })
              })
            }), e(Y, {
              href: "https://www.framer.com/marketplace/creator/pawel-gola?via=pawelgola",
              openInNewTab: !0,
              children: e(zr, {
                __perspectiveFX: !1,
                __smartComponentFX: !0,
                __targetOpacity: 1,
                animate: za,
                className: "framer-1wwcyo4 framer-10e8mc9",
                "data-framer-appear-id": "1wwcyo4",
                "data-framer-name": "Badge",
                initial: Ur,
                layoutDependency: w,
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
                children: e(Z, {
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
                  layoutDependency: w,
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
  Aa = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-4GnLc.framer-10e8mc9, .framer-4GnLc .framer-10e8mc9 { display: block; }", ".framer-4GnLc.framer-aoxxaw { align-content: flex-end; align-items: flex-end; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: flex-end; overflow: visible; padding: 0px; position: relative; width: min-content; }", ".framer-4GnLc .framer-gqopxx, .framer-4GnLc .framer-1wwcyo4 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 36px; justify-content: center; overflow: visible; padding: 10px; position: relative; text-decoration: none; width: 142px; }", ".framer-4GnLc .framer-be93h5, .framer-4GnLc .framer-o8qce8 { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-4GnLc.framer-aoxxaw, .framer-4GnLc .framer-gqopxx, .framer-4GnLc .framer-1wwcyo4 { gap: 0px; } .framer-4GnLc.framer-aoxxaw > * { margin: 0px; margin-bottom: calc(8px / 2); margin-top: calc(8px / 2); } .framer-4GnLc.framer-aoxxaw > :first-child { margin-top: 0px; } .framer-4GnLc.framer-aoxxaw > :last-child { margin-bottom: 0px; } .framer-4GnLc .framer-gqopxx > *, .framer-4GnLc .framer-1wwcyo4 > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-4GnLc .framer-gqopxx > :first-child, .framer-4GnLc .framer-1wwcyo4 > :first-child { margin-left: 0px; } .framer-4GnLc .framer-gqopxx > :last-child, .framer-4GnLc .framer-1wwcyo4 > :last-child { margin-right: 0px; } }"],
  Me = S(Ta, Aa, "framer-4GnLc"),
  He = Me;
Me.displayName = "Buy Badges";
Me.defaultProps = {
  height: 80,
  width: 142
};
z(Me, [{
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
var Ga = Q(We),
  Oa = Q(Ee),
  Wa = Q(Ue),
  Ha = Ie(ne),
  Ya = Q(Te),
  qa = Q(He),
  Ja = {
    bjsAPPVHQ: "(min-width: 1200px)",
    kX65qxOg4: "(min-width: 810px) and (max-width: 1199px)",
    XTiylWl8M: "(max-width: 809px)"
  },
  Xa = () => typeof document < "u",
  Za = "framer-azYRI",
  Qa = {
    bjsAPPVHQ: "framer-v-zclkw6",
    kX65qxOg4: "framer-v-1r1q3e1",
    XTiylWl8M: "framer-v-1auuoho"
  },
  Ka = {
    bounce: .2,
    delay: .1,
    duration: .5,
    type: "spring"
  },
  $a = {
    opacity: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: Ka,
    x: 0,
    y: 0
  },
  eo = {
    bounce: .2,
    delay: 0,
    duration: .5,
    type: "spring"
  },
  ro = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: eo,
    x: 0,
    y: 0
  },
  to = {
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
  ao = () => document.querySelector("#template-overlay") ?? document.querySelector("#overlay") ?? document.body,
  oo = ({
    children: r,
    blockDocumentScrolling: t,
    enabled: a = !0
  }) => {
    let [o, n] = Cr({
      blockDocumentScrolling: t
    });
    return r({
      hide: () => n(!1),
      show: () => n(!0),
      toggle: () => n(!o),
      visible: a && o
    })
  },
  no = {
    delay: 0,
    duration: .5,
    ease: [.5, 0, .88, .77],
    type: "tween"
  },
  io = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    transition: no,
    x: 0,
    y: 0
  },
  so = {
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
  Ye = {
    kX65qxOg4: [".framer-azYRI.framer-zclkw6 { padding: 16px; }", ".framer-azYRI .framer-1yvaye5-container { left: 50%; top: 40px; transform: translateX(-50%); }"],
    XTiylWl8M: [".framer-azYRI.framer-zclkw6 { gap: 12px; padding: 12px; }", ".framer-azYRI .framer-1yvaye5-container { left: 50%; top: 24px; transform: translateX(-50%); }", '.framer-azYRI .framer-1q2yd07, [data-layout-template="true"] > #overlay { margin-bottom: -12px; }']
  },
  Br = Object.keys(Ye),
  lo = {
    kX65qxOg4: ".framer-1r1q3e1-override",
    XTiylWl8M: ".framer-1auuoho-override"
  },
  jr = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-azYRI.framer-2or2yz, .framer-azYRI .framer-2or2yz { display: block; }", ".framer-azYRI.framer-zclkw6 { align-content: center; align-items: center; background-color: var(--token-4321a524-8651-4268-85f9-e884d8cb6223, #ffffff); display: flex; flex-direction: column; flex-wrap: nowrap; gap: 16px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px 16px 0px 16px; position: relative; width: 100%; }", ".framer-azYRI .framer-1yvaye5-container { flex: none; height: auto; left: 72px; position: var(--framer-canvas-fixed-position, fixed); top: 72px; width: auto; z-index: 10; }", ".framer-azYRI.framer-k3je0g { background-color: var(--token-4321a524-8651-4268-85f9-e884d8cb6223, #0a0b0a); inset: 0px; position: fixed; user-select: none; z-index: 10; }", ".framer-azYRI.framer-1isoj6h-container { flex: none; height: 100%; left: 0px; position: fixed; top: 0px; width: 100%; will-change: var(--framer-will-change-effect-override, transform); z-index: 10; }", ".framer-azYRI .framer-1q2yd07 { background: transparent; flex-grow: 1; height: 0px; margin: 0px; margin-bottom: -16px; position: relative; width: 0px; }", ".framer-azYRI .framer-1lcp6bd-container { flex: none; height: auto; order: 1002; position: relative; width: 100%; will-change: var(--framer-will-change-effect-override, transform); }", ".framer-azYRI .framer-xyw2qg-container { flex: none; height: calc(min(var(--framer-viewport-height, 100vh), 100%) * 1); left: 0px; order: 1003; position: var(--framer-canvas-fixed-position, fixed); top: 0px; width: 100%; z-index: 1; }", ".framer-azYRI .framer-1jyvgay-container { bottom: calc(calc(100% - min(var(--framer-viewport-height, 100%), 100%)) + 64px); flex: none; height: auto; order: 1004; position: var(--framer-canvas-fixed-position, fixed); right: 20px; width: auto; z-index: 9; }", '[data-layout-template="true"] > #overlay { margin-bottom: -16px; }'],
  co = {
    bjsAPPVHQ: "(min-width: 1200px)",
    kX65qxOg4: "(min-width: 810px) and (max-width: 1199px)",
    XTiylWl8M: "(max-width: 809px)"
  },
  mo = ({
    value: r
  }) => br() ? null : e("style", {
    dangerouslySetInnerHTML: {
      __html: r
    },
    "data-framer-html-style": ""
  }),
  fo = {
    Desktop: "bjsAPPVHQ",
    Phone: "XTiylWl8M",
    Tablet: "kX65qxOg4"
  },
  po = ({
    height: r,
    id: t,
    showFooter: a,
    width: o,
    ...n
  }) => ({
    ...n,
    JyRc5iZM_: a ?? n.JyRc5iZM_ ?? !0,
    variant: fo[n.variant] ?? n.variant ?? "bjsAPPVHQ"
  }),
  uo = N(function(r, t) {
    let a = V(null),
      o = t ?? a,
      n = D(),
      {
        activeLocale: c,
        setLocale: s
      } = F(),
      {
        style: m,
        className: h,
        layoutId: l,
        variant: g,
        JyRc5iZM_: C,
        children: k,
        ...U
      } = po(r),
      [x, q] = wr(g, Ja, !1),
      R = void 0,
      {
        activeVariantCallback: B,
        delay: w
      } = ae(void 0),
      u = ({
        overlay: L,
        loadMore: te
      }) => B(async (...ee) => {
        L.toggle()
      }),
      M = ({
        overlay: L,
        loadMore: te
      }) => B(async (...ee) => {
        L.hide()
      }),
      v = I(Za, ...[]),
      d = L => Xa() ? ["kX65qxOg4", "XTiylWl8M"].includes(x) ? L : !1 : !0;
    return gr({}), e(pr.Provider, {
      value: {
        isLayoutTemplate: !0,
        primaryVariantId: "bjsAPPVHQ",
        variantClassNames: Qa
      },
      children: j(P, {
        id: l ?? n,
        children: [e(mo, {
          value: ":root body { background: var(--token-4321a524-8651-4268-85f9-e884d8cb6223, rgb(255, 255, 255)); }"
        }), j(i.div, {
          ...U,
          className: I(v, "framer-zclkw6", h),
          "data-layout-template": !0,
          ref: o,
          style: {
            ...m
          },
          children: [e(oo, {
            children: L => e(De, {
              children: e(se, {
                breakpoint: x,
                overrides: {
                  kX65qxOg4: {
                    y: 40
                  },
                  XTiylWl8M: {
                    y: 24
                  }
                },
                children: e(J, {
                  height: 57,
                  y: 72,
                  children: e(se, {
                    breakpoint: x,
                    overrides: {
                      kX65qxOg4: {
                        "data-framer-layout-hint-center-x": !0
                      },
                      XTiylWl8M: {
                        "data-framer-layout-hint-center-x": !0
                      }
                    },
                    children: j(ne, {
                      className: "framer-1yvaye5-container",
                      layoutScroll: !0,
                      nodeId: "X5uwbANM2",
                      scopeId: "yLpxGubdL",
                      children: [e(se, {
                        breakpoint: x,
                        overrides: {
                          XTiylWl8M: {
                            variant: "iYWmBinwv"
                          }
                        },
                        children: e(We, {
                          height: "100%",
                          id: "X5uwbANM2",
                          layoutId: "X5uwbANM2",
                          OokibawIE: u({
                            overlay: L
                          }),
                          variant: "sMX5M2Uqr",
                          width: "100%"
                        })
                      }), e(tr, {
                        children: L.visible && e(De, {
                          children: be(j(y, {
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
                              onTap: () => L.hide(),
                              transition: {
                                delay: 0,
                                duration: 0,
                                ease: [.5, 0, .88, .77],
                                type: "tween"
                              }
                            }, "bBi1ZekB1"), e(J, {
                              width: "100vw",
                              children: e(ne, {
                                animate: ro,
                                className: I(v, "framer-1isoj6h-container"),
                                exit: $a,
                                inComponentSlot: !0,
                                initial: to,
                                nodeId: "o4jOMc7R7",
                                rendersWithMotion: !0,
                                scopeId: "yLpxGubdL",
                                children: e(Ee, {
                                  height: "100%",
                                  id: "o4jOMc7R7",
                                  layoutId: "o4jOMc7R7",
                                  style: {
                                    height: "100%",
                                    width: "100%"
                                  },
                                  variant: "EGqK4uSJI",
                                  width: "100%",
                                  woAUVjEwf: M({
                                    overlay: L
                                  })
                                })
                              })
                            })]
                          }), ao())
                        })
                      })]
                    })
                  })
                })
              })
            })
          }), k, e("div", {
            className: "framer-1q2yd07"
          }), d(C) && e(se, {
            breakpoint: x,
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
            children: e(J, {
              children: e(Ha, {
                animate: io,
                className: I("framer-1lcp6bd-container", "hidden-zclkw6", !C && "hidden-1r1q3e1", !C && "hidden-1auuoho"),
                "data-framer-appear-id": "1lcp6bd",
                initial: so,
                nodeId: "tKGgNfGFD",
                optimized: !0,
                rendersWithMotion: !0,
                scopeId: "yLpxGubdL",
                style: {
                  transformPerspective: 1200
                },
                children: e(se, {
                  breakpoint: x,
                  overrides: {
                    XTiylWl8M: {
                      variant: "JD6pMfzso"
                    }
                  },
                  children: e(Ue, {
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
          }), e(J, {
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
          }), e(J, {
            height: 80,
            y: 856,
            children: e(ne, {
              className: "framer-1jyvgay-container",
              layoutScroll: !0,
              nodeId: "JGdTTvmcj",
              scopeId: "yLpxGubdL",
              children: e(He, {
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
  ho = r => r === Se.canvas || r === Se.export ? [...jr, ...Br.flatMap(a => {
    let o = lo[a];
    return Ye[a].map(n => `${o} {${n}}`)
  })] : [...jr, ...Br.map(a => `@media ${co[a]} { ${Ye[a].join(" ")} }`)],
  ge = S(uo, ho, "framer-azYRI"),
  Er = ge;
ge.displayName = "Default";
ge.defaultProps = {
  height: 1e3,
  width: 1200
};
O(ge, {
  JyRc5iZM_: {
    defaultValue: !0,
    title: "Show Footer",
    type: _.Boolean
  }
});
z(ge, [{
  explicitInter: !0,
  fonts: []
}, ...Ga, ...Oa, ...Wa, ...Ya, ...qa], {
  supportsExplicitInterCodegen: !0
});
var le = {
    augiA20Il: {
      elements: {},
      page: $(() => import("./H43A040d_cry0mI3UHtRsDcylgU9Ah2evsz-HkAknTQ.RUKXJFF5.mjs")),
      path: "/"
    },
    W61OseJy9: {
      elements: {
        Hhkwd75jM: "urmaki",
        lDOg3SbvG: "special",
        o4gBkUJE6: "maki"
      },
      page: $(() => import("./FqhxfBmmEMYxGn-kfvMwJaIoneFjUOIJvVz0l7wNme4.EJKFKUD5.mjs")),
      path: "/menu"
    },
    YCbNyRkzE: {
      elements: {
        q2liDXL_s: "special"
      },
      page: $(() => import("./_8STToifVgzVfSWt2YjQwKBpkuDgF6_uTpoA073KNZU.RGNZCVDI.mjs")),
      path: "/reservation"
    },
    OFVwkEg7d: {
      elements: {},
      page: $(() => import("./Xk6M4jotoUbhuF6JG0jvaLVtC31fJbHTLaMhKgc0o4E.DBWS4EYL.mjs")),
      path: "/about"
    },
    xZrfMWLUB: {
      elements: {},
      page: $(() => import("./XJMJ1tCGksAZV1BxGy1y5iXpvCDMrARo4NJLx6oXr5s.GEAWKB6A.mjs")),
      path: "/contact"
    },
    BBWv5VG0V: {
      elements: {},
      page: $(() => import("./Rv31btwl3ruyeH27-i-JizDLSMLZ_NlmzWXKMidqjUs.22OIN63C.mjs")),
      path: "/blog"
    },
    xv1cdgcl0: {
      elements: {},
      page: $(() => import("./oUzMWamQHR6MQffRBl4LtefqyABhh4zfDZS4ztI7T3o.EBFIA2R2.mjs")),
      path: "/licensing"
    },
    XmJJGmprU: {
      elements: {},
      page: $(() => import("./RoOSXLkDpH3rIGFvGkmPEghmCaWHnfgzLfxZRHGKGtk.FRX2RWYS.mjs")),
      path: "/404"
    },
    gO2m9BuWR: {
      elements: {},
      page: $(() => import("./LIHMrKSyLc_YRASzGeyarXy5F64k_N2uWos_NzM3PT4.XFDLH4DZ.mjs")),
      path: "/blog/:q6wyKlkO2"
    }
  },
  qe = [{
    code: "en",
    id: "default",
    name: "English",
    slug: ""
  }],
  Je = {},
  Ar = "6a56fb0315ce29318e502463af8949778730c2853d33d57ee75535a147962b10";

function yo({
  routeId: r,
  children: t,
  style: a,
  ...o
}) {
  let n = {
      JyRc5iZM_: !0
    },
    c = {
      ...n,
      JyRc5iZM_: !1
    },
    m = {
      augiA20Il: n,
      BBWv5VG0V: n,
      gO2m9BuWR: n,
      OFVwkEg7d: n,
      W61OseJy9: n,
      XmJJGmprU: c,
      xv1cdgcl0: n,
      xZrfMWLUB: n,
      YCbNyRkzE: n
    } [r] ?? {};
  switch (r) {
    case "augiA20Il":
    case "W61OseJy9":
    case "YCbNyRkzE":
    case "OFVwkEg7d":
    case "xZrfMWLUB":
    case "BBWv5VG0V":
    case "xv1cdgcl0":
    case "XmJJGmprU":
    case "gO2m9BuWR":
      return re(Er, {
        ...m,
        key: "Default",
        routeId: r,
        style: a
      }, t(!0));
    default:
      return t(!1)
  }
}

function Un(r) {
  switch (r) {
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
async function go({
  routeId: r,
  pathVariables: t,
  localeId: a
}) {
  let o = le[r].page.preload(),
    n = re(vr, {
      isWebsite: !0,
      routeId: r,
      pathVariables: t,
      routes: le,
      collectionUtils: Je,
      framerSiteId: Ar,
      notFoundPage: $(() => import("./RoOSXLkDpH3rIGFvGkmPEghmCaWHnfgzLfxZRHGKGtk.FRX2RWYS.mjs")),
      isReducedMotion: void 0,
      localeId: a,
      locales: qe,
      preserveQueryParams: void 0,
      siteCanonicalURL: void 0,
      EditorBar: typeof p < "u" ? (() => {
        if (!/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(H.userAgent)) return $(async () => {
          let l = {
            __version: 1,
            framer: {
              useCurrentRoute: or,
              useLocaleInfo: F,
              useRouter: we
            },
            react: {
              createElement: re,
              memo: Ke,
              useCallback: $e,
              useEffect: er,
              useRef: V,
              useState: rr
            },
            "react-dom": {
              createPortal: be
            }
          };
          p.__framer_editorBarDependencies = l;
          let {
            createEditorBar: g
          } = await import("https://edit.framer.com/init.mjs");
          return {
            default: g({
              dependencies: l
            })
          }
        })
      })() : void 0,
      LayoutTemplate: yo
    }),
    c = re(fr, {
      children: n,
      value: {
        editorBarDisableFrameAncestorsSecurity: !1,
        editorBarOnPageEditing: !1,
        motionDivToDiv: !1,
        motionDivToDivBackgroundImage: !1,
        pauseOffscreen: !0,
        replaceNestedLinks: !0,
        yieldOnTap: !1
      }
    }),
    s = re(xr, {
      children: c
    }),
    m = re(ir, {
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
  return await o, m
}
var Xe = typeof document < "u";
if (Xe) {
  p.__framer_importFromPackage = (t, a) => () => re(dr, {
    error: 'Package component not supported: "' + a + '" in "' + t + '"'
  }), p.process = {
    ...p.process,
    env: {
      ...p.process ? p.process.env : void 0,
      NODE_ENV: "production"
    }
  }, p.__framer_events = p.__framer_events || [], mr();
  let r = document.getElementById("main");
  "framerHydrateV2" in r.dataset ? Tr(!0, r) : Tr(!1, r)
}

function xo() {
  Xe && p.__framer_events.push(arguments)
}
async function Tr(r, t) {
  function a(o, n, c = !0) {
    if (o.caught || p.__framer_hadFatalError) return;
    let s = n?.componentStack;
    if (c) {
      if (console.warn(`Recoverable error has happened. Please check any custom code or code overrides to fix server/client mismatches:
`, o, s), Math.random() > .01) return
    } else console.error(`Fatal crash has happened. If you are the author of this website, please report this issue to the Framer team via https://www.framer.community/:
`, o, s);
    xo(c ? "published_site_load_recoverable_error" : "published_site_load_error", {
      message: String(o),
      componentStack: s,
      stack: s ? void 0 : o instanceof Error && typeof o.stack == "string" ? o.stack : null
    })
  }
  try {
    let o, n, c, s;
    if (r) {
      let l = JSON.parse(t.dataset.framerHydrateV2);
      o = l.routeId, n = l.localeId, c = l.pathVariables, s = l.breakpoints, o = Pe(le, o)
    } else {
      Pe(le, void 0);
      let l = cr(le, decodeURIComponent(location.pathname), !0, qe);
      o = l.routeId, n = l.localeId, c = l.pathVariables
    }
    let m = go({
      routeId: o,
      localeId: n,
      pathVariables: c
    });
    typeof p < "u" && (async () => {
      let l = le[o],
        g = "default",
        C = qe.find(({
          id: R
        }) => n ? R === n : R === g)
        .code,
        k = null;
      if (l?.collectionId && Je) {
        let R = await Je[l.collectionId]?.(),
          [B] = Object.values(c);
        R && typeof B == "string" && (k = await R.getRecordIdBySlug(B, C || void 0) ?? null)
      }
      let U = Intl.DateTimeFormat()
        .resolvedOptions(),
        x = U.timeZone,
        q = U.locale;
      await new Promise(R => {
        document.prerendering ? document.addEventListener("prerenderingchange", R, {
          once: !0
        }) : R()
      }), p.__framer_events.push(["published_site_pageview", {
        framerSiteId: Ar ?? null,
        routePath: l?.path || "/",
        collectionItemId: k,
        framerLocale: C || null,
        webPageId: l?.abTestingVariantId ?? o,
        abTestId: l?.abTestId,
        referrer: document.referrer || null,
        url: p.location.href,
        hostname: p.location.hostname || null,
        pathname: p.location.pathname || null,
        hash: p.location.hash || null,
        search: p.location.search || null,
        timezone: x,
        locale: q
      }, "eager"]), await nr({
        priority: "background",
        ensureContinueBeforeUnload: !0,
        continueAfter: "paint"
      }), document.dispatchEvent(new CustomEvent("framer:pageview", {
        detail: {
          framerLocale: C || null
        }
      }))
    })();
    let h = await m;
    r ? (kr("framer-rewrite-breakpoints", () => {
        Ir(s), p.__framer_onRewriteBreakpoints?.(s)
      }), Ne(() => {
        lr(), sr(), Vr(t, h, {
          onRecoverableError: a
        })
      })) : Be(t, {
        onRecoverableError: a
      })
      .render(h)
  } catch (o) {
    throw a(o, void 0, !1), o
  }
}(function() {
  Xe && Ne(() => {
    Be(document.getElementById("__framer-badge-container"))
      .render(re(Ze, {}, re(hr(ne), {
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
      }, re(Qe(() => import("./PX9hIOIVM-EDSGE5MF.mjs"))))))
  })
})();
export {
  Un as getLayoutTemplateBreakpoints, go as getPageRoot
};
//# sourceMappingURL=script_main.7D7NQE3D.mjs.map