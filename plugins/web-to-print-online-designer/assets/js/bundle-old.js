var fabric = fabric || {
    version: "1.6.4"
};
"undefined" != typeof exports && (exports.fabric = fabric), "undefined" != typeof document && "undefined" != typeof window ? (fabric.document = document, fabric.window = window, window.fabric = fabric) : (fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>"), fabric.document.createWindow ? fabric.window = fabric.document.createWindow() : fabric.window = fabric.document.parentWindow), fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement, fabric.isLikelyNode = "undefined" != typeof Buffer && "undefined" == typeof window, fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id"], fabric.DPI = 96, fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)", fabric.fontPaths = {}, fabric.charWidthsCache = {}, fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1,
    function() {
        function t(t, e) {
            if (this.__eventListeners[t]) {
                var i = this.__eventListeners[t];
                e ? i[i.indexOf(e)] = !1 : fabric.util.array.fill(i, !1)
            }
        }

        function e(t, e) {
            if (this.__eventListeners || (this.__eventListeners = {}), 1 === arguments.length)
                for (var i in t) this.on(i, t[i]);
            else this.__eventListeners[t] || (this.__eventListeners[t] = []), this.__eventListeners[t].push(e);
            return this
        }

        function i(e, i) {
            if (this.__eventListeners) {
                if (0 === arguments.length)
                    for (e in this.__eventListeners) t.call(this, e);
                else if (1 === arguments.length && "object" == typeof arguments[0])
                    for (var r in e) t.call(this, r, e[r]);
                else t.call(this, e, i);
                return this
            }
        }

        function r(t, e) {
            if (this.__eventListeners) {
                var i = this.__eventListeners[t];
                if (i) {
                    for (var r = 0, n = i.length; r < n; r++) i[r] && i[r].call(this, e || {});
                    return this.__eventListeners[t] = i.filter(function(t) {
                        return t !== !1
                    }), this
                }
            }
        }
        fabric.Observable = {
            observe: e,
            stopObserving: i,
            fire: r,
            on: e,
            off: i,
            trigger: r
        }
    }(), fabric.Collection = {
        _objects: [],
        add: function() {
            if (this._objects.push.apply(this._objects, arguments), this._onObjectAdded)
                for (var t = 0, e = arguments.length; t < e; t++) this._onObjectAdded(arguments[t]);
            return this.renderOnAddRemove && this.renderAll(), this
        },
        insertAt: function(t, e, i) {
            var r = this.getObjects();
            return i ? r[e] = t : r.splice(e, 0, t), this._onObjectAdded && this._onObjectAdded(t), this.renderOnAddRemove && this.renderAll(), this
        },
        remove: function() {
            for (var t, e = this.getObjects(), i = !1, r = 0, n = arguments.length; r < n; r++) t = e.indexOf(arguments[r]), t !== -1 && (i = !0, e.splice(t, 1), this._onObjectRemoved && this._onObjectRemoved(arguments[r]));
            return this.renderOnAddRemove && i && this.renderAll(), this
        },
        forEachObject: function(t, e) {
            for (var i = this.getObjects(), r = 0, n = i.length; r < n; r++) t.call(e, i[r], r, i);
            return this
        },
        getObjects: function(t) {
            return "undefined" == typeof t ? this._objects : this._objects.filter(function(e) {
                return e.type === t
            })
        },
        item: function(t) {
            return this.getObjects()[t]
        },
        isEmpty: function() {
            return 0 === this.getObjects().length
        },
        size: function() {
            return this.getObjects().length
        },
        contains: function(t) {
            return this.getObjects().indexOf(t) > -1
        },
        complexity: function() {
            return this.getObjects().reduce(function(t, e) {
                return t += e.complexity ? e.complexity() : 0
            }, 0)
        }
    },
    function(t) {
        var e = Math.sqrt,
            i = Math.atan2,
            r = Math.pow,
            n = Math.abs,
            s = Math.PI / 180;
        fabric.util = {
            removeFromArray: function(t, e) {
                var i = t.indexOf(e);
                return i !== -1 && t.splice(i, 1), t
            },
            getRandomInt: function(t, e) {
                return Math.floor(Math.random() * (e - t + 1)) + t
            },
            degreesToRadians: function(t) {
                return t * s
            },
            radiansToDegrees: function(t) {
                return t / s
            },
            rotatePoint: function(t, e, i) {
                t.subtractEquals(e);
                var r = fabric.util.rotateVector(t, i);
                return new fabric.Point(r.x, r.y).addEquals(e)
            },
            rotateVector: function(t, e) {
                var i = Math.sin(e),
                    r = Math.cos(e),
                    n = t.x * r - t.y * i,
                    s = t.x * i + t.y * r;
                return {
                    x: n,
                    y: s
                }
            },
            transformPoint: function(t, e, i) {
                return i ? new fabric.Point(e[0] * t.x + e[2] * t.y, e[1] * t.x + e[3] * t.y) : new fabric.Point(e[0] * t.x + e[2] * t.y + e[4], e[1] * t.x + e[3] * t.y + e[5])
            },
            makeBoundingBoxFromPoints: function(t) {
                var e = [t[0].x, t[1].x, t[2].x, t[3].x],
                    i = fabric.util.array.min(e),
                    r = fabric.util.array.max(e),
                    n = Math.abs(i - r),
                    s = [t[0].y, t[1].y, t[2].y, t[3].y],
                    o = fabric.util.array.min(s),
                    a = fabric.util.array.max(s),
                    h = Math.abs(o - a);
                return {
                    left: i,
                    top: o,
                    width: n,
                    height: h
                }
            },
            invertTransform: function(t) {
                var e = 1 / (t[0] * t[3] - t[1] * t[2]),
                    i = [e * t[3], -e * t[1], -e * t[2], e * t[0]],
                    r = fabric.util.transformPoint({
                        x: t[4],
                        y: t[5]
                    }, i, !0);
                return i[4] = -r.x, i[5] = -r.y, i
            },
            toFixed: function(t, e) {
                return parseFloat(Number(t).toFixed(e))
            },
            parseUnit: function(t, e) {
                var i = /\D{0,2}$/.exec(t),
                    r = parseFloat(t);
                switch (e || (e = fabric.Text.DEFAULT_SVG_FONT_SIZE), i[0]) {
                    case "mm":
                        return r * fabric.DPI / 25.4;
                    case "cm":
                        return r * fabric.DPI / 2.54;
                    case "in":
                        return r * fabric.DPI;
                    case "pt":
                        return r * fabric.DPI / 72;
                    case "pc":
                        return r * fabric.DPI / 72 * 12;
                    case "em":
                        return r * e;
                    default:
                        return r
                }
            },
            falseFunction: function() {
                return !1
            },
            getKlass: function(t, e) {
                return t = fabric.util.string.camelize(t.charAt(0).toUpperCase() + t.slice(1)), fabric.util.resolveNamespace(e)[t]
            },
            resolveNamespace: function(e) {
                if (!e) return fabric;
                for (var i = e.split("."), r = i.length, n = t || fabric.window, s = 0; s < r; ++s) n = n[i[s]];
                return n
            },
            loadImage: function(t, e, i, r) {
                if (!t) return void(e && e.call(i, t));
                var n = fabric.util.createImage();
                n.onload = function() {
                    e && e.call(i, n), n = n.onload = n.onerror = null
                }, n.onerror = function() {
                    fabric.log("Error loading " + n.src), e && e.call(i, null, !0), n = n.onload = n.onerror = null
                }, 0 !== t.indexOf("data") && r && (n.crossOrigin = r), n.src = t
            },
            enlivenObjects: function(t, e, i, r) {
                function n() {
                    ++o === a && e && e(s)
                }
                t = t || [];
                var s = [],
                    o = 0,
                    a = t.length;
                return a ? void t.forEach(function(t, e) {
                    if (!t || !t.type) return void n();
                    var o = fabric.util.getKlass(t.type, i);
                    o.async ? o.fromObject(t, function(i, o) {
                        o || (s[e] = i, r && r(t, s[e])), n()
                    }) : (s[e] = o.fromObject(t), r && r(t, s[e]), n())
                }) : void(e && e(s))
            },
            groupSVGElements: function(t, e, i) {
                var r;
                return r = new fabric.PathGroup(t, e), "undefined" != typeof i && r.setSourcePath(i), r
            },
            populateWithProperties: function(t, e, i) {
                if (i && "[object Array]" === Object.prototype.toString.call(i))
                    for (var r = 0, n = i.length; r < n; r++) i[r] in t && (e[i[r]] = t[i[r]])
            },
            drawDashedLine: function(t, r, n, s, o, a) {
                var h = s - r,
                    c = o - n,
                    l = e(h * h + c * c),
                    u = i(c, h),
                    f = a.length,
                    d = 0,
                    g = !0;
                for (t.save(), t.translate(r, n), t.moveTo(0, 0), t.rotate(u), r = 0; l > r;) r += a[d++ % f], r > l && (r = l), t[g ? "lineTo" : "moveTo"](r, 0), g = !g;
                t.restore()
            },
            createCanvasElement: function(t) {
                return t || (t = fabric.document.createElement("canvas")), t.getContext || "undefined" == typeof G_vmlCanvasManager || G_vmlCanvasManager.initElement(t), t
            },
            createImage: function() {
                return fabric.isLikelyNode ? new(require("canvas").Image) : fabric.document.createElement("img")
            },
            createAccessors: function(t) {
                for (var e = t.prototype, i = e.stateProperties.length; i--;) {
                    var r = e.stateProperties[i],
                        n = r.charAt(0).toUpperCase() + r.slice(1),
                        s = "set" + n,
                        o = "get" + n;
                    e[o] || (e[o] = function(t) {
                        return new Function('return this.get("' + t + '")')
                    }(r)), e[s] || (e[s] = function(t) {
                        return new Function("value", 'return this.set("' + t + '", value)')
                    }(r))
                }
            },
            clipContext: function(t, e) {
                e.save(), e.beginPath(), t.clipTo(e), e.clip()
            },
            multiplyTransformMatrices: function(t, e, i) {
                return [t[0] * e[0] + t[2] * e[1], t[1] * e[0] + t[3] * e[1], t[0] * e[2] + t[2] * e[3], t[1] * e[2] + t[3] * e[3], i ? 0 : t[0] * e[4] + t[2] * e[5] + t[4], i ? 0 : t[1] * e[4] + t[3] * e[5] + t[5]]
            },
            qrDecompose: function(t) {
                var n = i(t[1], t[0]),
                    o = r(t[0], 2) + r(t[1], 2),
                    a = e(o),
                    h = (t[0] * t[3] - t[2] * t[1]) / a,
                    c = i(t[0] * t[2] + t[1] * t[3], o);
                return {
                    angle: n / s,
                    scaleX: a,
                    scaleY: h,
                    skewX: c / s,
                    skewY: 0,
                    translateX: t[4],
                    translateY: t[5]
                }
            },
            customTransformMatrix: function(t, e, i) {
                var r = [1, 0, n(Math.tan(i * s)), 1],
                    o = [n(t), 0, 0, n(e)];
                return fabric.util.multiplyTransformMatrices(o, r, !0)
            },
            resetObjectTransform: function(t) {
                t.scaleX = 1, t.scaleY = 1, t.skewX = 0, t.skewY = 0, t.flipX = !1, t.flipY = !1, t.setAngle(0)
            },
            getFunctionBody: function(t) {
                return (String(t).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
            },
            isTransparent: function(t, e, i, r) {
                r > 0 && (e > r ? e -= r : e = 0, i > r ? i -= r : i = 0);
                for (var n = !0, s = t.getImageData(e, i, 2 * r || 1, 2 * r || 1), o = 3, a = s.data.length; o < a; o += 4) {
                    var h = s.data[o];
                    if (n = h <= 0, n === !1) break
                }
                return s = null, n
            },
            parsePreserveAspectRatioAttribute: function(t) {
                var e, i = "meet",
                    r = "Mid",
                    n = "Mid",
                    s = t.split(" ");
                return s && s.length && (i = s.pop(), "meet" !== i && "slice" !== i ? (e = i, i = "meet") : s.length && (e = s.pop())), r = "none" !== e ? e.slice(1, 4) : "none", n = "none" !== e ? e.slice(5, 8) : "none", {
                    meetOrSlice: i,
                    alignX: r,
                    alignY: n
                }
            },
            clearFabricFontCache: function(t) {
                t ? fabric.charWidthsCache[t] && delete fabric.charWidthsCache[t] : fabric.charWidthsCache = {}
            }
        }
    }("undefined" != typeof exports ? exports : this),
    function() {
        function t(t, r, s, o, h, c, l) {
            var u = a.call(arguments);
            if (n[u]) return n[u];
            var f = Math.PI,
                d = l * f / 180,
                g = Math.sin(d),
                p = Math.cos(d),
                v = 0,
                b = 0;
            s = Math.abs(s), o = Math.abs(o);
            var m = -p * t * .5 - g * r * .5,
                y = -p * r * .5 + g * t * .5,
                _ = s * s,
                x = o * o,
                S = y * y,
                C = m * m,
                w = _ * x - _ * S - x * C,
                O = 0;
            if (w < 0) {
                var T = Math.sqrt(1 - w / (_ * x));
                s *= T, o *= T
            } else O = (h === c ? -1 : 1) * Math.sqrt(w / (_ * S + x * C));
            var k = O * s * y / o,
                j = -O * o * m / s,
                A = p * k - g * j + .5 * t,
                M = g * k + p * j + .5 * r,
                P = i(1, 0, (m - k) / s, (y - j) / o),
                I = i((m - k) / s, (y - j) / o, (-m - k) / s, (-y - j) / o);
            0 === c && I > 0 ? I -= 2 * f : 1 === c && I < 0 && (I += 2 * f);
            for (var L = Math.ceil(Math.abs(I / f * 2)), E = [], D = I / L, R = 8 / 3 * Math.sin(D / 4) * Math.sin(D / 4) / Math.sin(D / 2), F = P + D, B = 0; B < L; B++) E[B] = e(P, F, p, g, s, o, A, M, R, v, b), v = E[B][4], b = E[B][5], P = F, F += D;
            return n[u] = E, E
        }

        function e(t, e, i, r, n, o, h, c, l, u, f) {
            var d = a.call(arguments);
            if (s[d]) return s[d];
            var g = Math.cos(t),
                p = Math.sin(t),
                v = Math.cos(e),
                b = Math.sin(e),
                m = i * n * v - r * o * b + h,
                y = r * n * v + i * o * b + c,
                _ = u + l * (-i * n * p - r * o * g),
                x = f + l * (-r * n * p + i * o * g),
                S = m + l * (i * n * b + r * o * v),
                C = y + l * (r * n * b - i * o * v);
            return s[d] = [_, x, S, C, m, y], s[d]
        }

        function i(t, e, i, r) {
            var n = Math.atan2(e, t),
                s = Math.atan2(r, i);
            return s >= n ? s - n : 2 * Math.PI - (n - s)
        }

        function r(t, e, i, r, n, s, h, c) {
            var l = a.call(arguments);
            if (o[l]) return o[l];
            var u, f, d, g, p, v, b, m, y = Math.sqrt,
                _ = Math.min,
                x = Math.max,
                S = Math.abs,
                C = [],
                w = [
                    [],
                    []
                ];
            f = 6 * t - 12 * i + 6 * n, u = -3 * t + 9 * i - 9 * n + 3 * h, d = 3 * i - 3 * t;
            for (var O = 0; O < 2; ++O)
                if (O > 0 && (f = 6 * e - 12 * r + 6 * s, u = -3 * e + 9 * r - 9 * s + 3 * c, d = 3 * r - 3 * e), S(u) < 1e-12) {
                    if (S(f) < 1e-12) continue;
                    g = -d / f, 0 < g && g < 1 && C.push(g)
                } else b = f * f - 4 * d * u, b < 0 || (m = y(b), p = (-f + m) / (2 * u), 0 < p && p < 1 && C.push(p), v = (-f - m) / (2 * u), 0 < v && v < 1 && C.push(v));
            for (var T, k, j, A = C.length, M = A; A--;) g = C[A], j = 1 - g, T = j * j * j * t + 3 * j * j * g * i + 3 * j * g * g * n + g * g * g * h, w[0][A] = T, k = j * j * j * e + 3 * j * j * g * r + 3 * j * g * g * s + g * g * g * c, w[1][A] = k;
            w[0][M] = t, w[1][M] = e, w[0][M + 1] = h, w[1][M + 1] = c;
            var P = [{
                x: _.apply(null, w[0]),
                y: _.apply(null, w[1])
            }, {
                x: x.apply(null, w[0]),
                y: x.apply(null, w[1])
            }];
            return o[l] = P, P
        }
        var n = {},
            s = {},
            o = {},
            a = Array.prototype.join;
        fabric.util.drawArc = function(e, i, r, n) {
            for (var s = n[0], o = n[1], a = n[2], h = n[3], c = n[4], l = n[5], u = n[6], f = [
                    [],
                    [],
                    [],
                    []
                ], d = t(l - i, u - r, s, o, h, c, a), g = 0, p = d.length; g < p; g++) f[g][0] = d[g][0] + i, f[g][1] = d[g][1] + r, f[g][2] = d[g][2] + i, f[g][3] = d[g][3] + r, f[g][4] = d[g][4] + i, f[g][5] = d[g][5] + r, e.bezierCurveTo.apply(e, f[g])
        }, fabric.util.getBoundsOfArc = function(e, i, n, s, o, a, h, c, l) {
            for (var u = 0, f = 0, d = [], g = [], p = t(c - e, l - i, n, s, a, h, o), v = [
                    [],
                    []
                ], b = 0, m = p.length; b < m; b++) d = r(u, f, p[b][0], p[b][1], p[b][2], p[b][3], p[b][4], p[b][5]), v[0].x = d[0].x + e, v[0].y = d[0].y + i, v[1].x = d[1].x + e, v[1].y = d[1].y + i, g.push(v[0]), g.push(v[1]), u = p[b][4], f = p[b][5];
            return g
        }, fabric.util.getBoundsOfCurve = r
    }(),
    function() {
        function t(t, e) {
            for (var i = s.call(arguments, 2), r = [], n = 0, o = t.length; n < o; n++) r[n] = i.length ? t[n][e].apply(t[n], i) : t[n][e].call(t[n]);
            return r
        }

        function e(t, e) {
            return n(t, e, function(t, e) {
                return t >= e
            })
        }

        function i(t, e) {
            return n(t, e, function(t, e) {
                return t < e
            })
        }

        function r(t, e) {
            for (var i = t.length; i--;) t[i] = e;
            return t
        }

        function n(t, e, i) {
            if (t && 0 !== t.length) {
                var r = t.length - 1,
                    n = e ? t[r][e] : t[r];
                if (e)
                    for (; r--;) i(t[r][e], n) && (n = t[r][e]);
                else
                    for (; r--;) i(t[r], n) && (n = t[r]);
                return n
            }
        }
        var s = Array.prototype.slice;
        Array.prototype.indexOf || (Array.prototype.indexOf = function(t) {
            if (void 0 === this || null === this) throw new TypeError;
            var e = Object(this),
                i = e.length >>> 0;
            if (0 === i) return -1;
            var r = 0;
            if (arguments.length > 0 && (r = Number(arguments[1]), r !== r ? r = 0 : 0 !== r && r !== Number.POSITIVE_INFINITY && r !== Number.NEGATIVE_INFINITY && (r = (r > 0 || -1) * Math.floor(Math.abs(r)))), r >= i) return -1;
            for (var n = r >= 0 ? r : Math.max(i - Math.abs(r), 0); n < i; n++)
                if (n in e && e[n] === t) return n;
            return -1
        }), Array.prototype.forEach || (Array.prototype.forEach = function(t, e) {
            for (var i = 0, r = this.length >>> 0; i < r; i++) i in this && t.call(e, this[i], i, this)
        }), Array.prototype.map || (Array.prototype.map = function(t, e) {
            for (var i = [], r = 0, n = this.length >>> 0; r < n; r++) r in this && (i[r] = t.call(e, this[r], r, this));
            return i
        }), Array.prototype.every || (Array.prototype.every = function(t, e) {
            for (var i = 0, r = this.length >>> 0; i < r; i++)
                if (i in this && !t.call(e, this[i], i, this)) return !1;
            return !0
        }), Array.prototype.some || (Array.prototype.some = function(t, e) {
            for (var i = 0, r = this.length >>> 0; i < r; i++)
                if (i in this && t.call(e, this[i], i, this)) return !0;
            return !1
        }), Array.prototype.filter || (Array.prototype.filter = function(t, e) {
            for (var i, r = [], n = 0, s = this.length >>> 0; n < s; n++) n in this && (i = this[n], t.call(e, i, n, this) && r.push(i));
            return r
        }), Array.prototype.reduce || (Array.prototype.reduce = function(t) {
            var e, i = this.length >>> 0,
                r = 0;
            if (arguments.length > 1) e = arguments[1];
            else
                for (;;) {
                    if (r in this) {
                        e = this[r++];
                        break
                    }
                    if (++r >= i) throw new TypeError
                }
            for (; r < i; r++) r in this && (e = t.call(null, e, this[r], r, this));
            return e
        }), fabric.util.array = {
            fill: r,
            invoke: t,
            min: i,
            max: e
        }
    }(),
    function() {
        function t(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function e(e) {
            return t({}, e)
        }
        fabric.util.object = {
            extend: t,
            clone: e
        }
    }(),
    function() {
        function t(t) {
            return t.replace(/-+(.)?/g, function(t, e) {
                return e ? e.toUpperCase() : ""
            })
        }

        function e(t, e) {
            return t.charAt(0).toUpperCase() + (e ? t.slice(1) : t.slice(1).toLowerCase())
        }

        function i(t) {
            return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        String.prototype.trim || (String.prototype.trim = function() {
            return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")
        }), fabric.util.string = {
            camelize: t,
            capitalize: e,
            escapeXml: i
        }
    }(),
    function() {
        var t = Array.prototype.slice,
            e = Function.prototype.apply,
            i = function() {};
        Function.prototype.bind || (Function.prototype.bind = function(r) {
            var n, s = this,
                o = t.call(arguments, 1);
            return n = o.length ? function() {
                return e.call(s, this instanceof i ? this : r, o.concat(t.call(arguments)))
            } : function() {
                return e.call(s, this instanceof i ? this : r, arguments)
            }, i.prototype = this.prototype, n.prototype = new i, n
        })
    }(),
    function() {
        function t() {}

        function e(t) {
            var e = this.constructor.superclass.prototype[t];
            return arguments.length > 1 ? e.apply(this, r.call(arguments, 1)) : e.call(this)
        }

        function i() {
            function i() {
                this.initialize.apply(this, arguments)
            }
            var s = null,
                a = r.call(arguments, 0);
            "function" == typeof a[0] && (s = a.shift()), i.superclass = s, i.subclasses = [], s && (t.prototype = s.prototype, i.prototype = new t, s.subclasses.push(i));
            for (var h = 0, c = a.length; h < c; h++) o(i, a[h], s);
            return i.prototype.initialize || (i.prototype.initialize = n), i.prototype.constructor = i, i.prototype.callSuper = e, i
        }
        var r = Array.prototype.slice,
            n = function() {},
            s = function() {
                for (var t in {
                        toString: 1
                    })
                    if ("toString" === t) return !1;
                return !0
            }(),
            o = function(t, e, i) {
                for (var r in e) r in t.prototype && "function" == typeof t.prototype[r] && (e[r] + "").indexOf("callSuper") > -1 ? t.prototype[r] = function(t) {
                    return function() {
                        var r = this.constructor.superclass;
                        this.constructor.superclass = i;
                        var n = e[t].apply(this, arguments);
                        if (this.constructor.superclass = r, "initialize" !== t) return n
                    }
                }(r) : t.prototype[r] = e[r], s && (e.toString !== Object.prototype.toString && (t.prototype.toString = e.toString), e.valueOf !== Object.prototype.valueOf && (t.prototype.valueOf = e.valueOf))
            };
        fabric.util.createClass = i
    }(),
    function() {
        function t(t) {
            var e, i, r = Array.prototype.slice.call(arguments, 1),
                n = r.length;
            for (i = 0; i < n; i++)
                if (e = typeof t[r[i]], !/^(?:function|object|unknown)$/.test(e)) return !1;
            return !0
        }

        function e(t, e) {
            return {
                handler: e,
                wrappedHandler: i(t, e)
            }
        }

        function i(t, e) {
            return function(i) {
                e.call(o(t), i || fabric.window.event)
            }
        }

        function r(t, e) {
            return function(i) {
                if (p[t] && p[t][e])
                    for (var r = p[t][e], n = 0, s = r.length; n < s; n++) r[n].call(this, i || fabric.window.event)
            }
        }

        function n(t) {
            t || (t = fabric.window.event);
            var e = t.target || (typeof t.srcElement !== h ? t.srcElement : null),
                i = fabric.util.getScrollLeftTop(e);
            return {
                x: v(t) + i.left,
                y: b(t) + i.top
            }
        }

        function s(t, e, i) {
            var r = "touchend" === t.type ? "changedTouches" : "touches";
            return t[r] && t[r][0] ? t[r][0][e] - (t[r][0][e] - t[r][0][i]) || t[i] : t[i]
        }
        var o, a, h = "unknown",
            c = function() {
                var t = 0;
                return function(e) {
                    return e.__uniqueID || (e.__uniqueID = "uniqueID__" + t++)
                }
            }();
        ! function() {
            var t = {};
            o = function(e) {
                return t[e]
            }, a = function(e, i) {
                t[e] = i
            }
        }();
        var l, u, f = t(fabric.document.documentElement, "addEventListener", "removeEventListener") && t(fabric.window, "addEventListener", "removeEventListener"),
            d = t(fabric.document.documentElement, "attachEvent", "detachEvent") && t(fabric.window, "attachEvent", "detachEvent"),
            g = {},
            p = {};
        f ? (l = function(t, e, i) {
            t.addEventListener(e, i, !1)
        }, u = function(t, e, i) {
            t.removeEventListener(e, i, !1)
        }) : d ? (l = function(t, i, r) {
            var n = c(t);
            a(n, t), g[n] || (g[n] = {}), g[n][i] || (g[n][i] = []);
            var s = e(n, r);
            g[n][i].push(s), t.attachEvent("on" + i, s.wrappedHandler)
        }, u = function(t, e, i) {
            var r, n = c(t);
            if (g[n] && g[n][e])
                for (var s = 0, o = g[n][e].length; s < o; s++) r = g[n][e][s], r && r.handler === i && (t.detachEvent("on" + e, r.wrappedHandler), g[n][e][s] = null)
        }) : (l = function(t, e, i) {
            var n = c(t);
            if (p[n] || (p[n] = {}), !p[n][e]) {
                p[n][e] = [];
                var s = t["on" + e];
                s && p[n][e].push(s), t["on" + e] = r(n, e)
            }
            p[n][e].push(i)
        }, u = function(t, e, i) {
            var r = c(t);
            if (p[r] && p[r][e])
                for (var n = p[r][e], s = 0, o = n.length; s < o; s++) n[s] === i && n.splice(s, 1)
        }), fabric.util.addListener = l, fabric.util.removeListener = u;
        var v = function(t) {
                return typeof t.clientX !== h ? t.clientX : 0
            },
            b = function(t) {
                return typeof t.clientY !== h ? t.clientY : 0
            };
        fabric.isTouchSupported && (v = function(t) {
            return s(t, "pageX", "clientX")
        }, b = function(t) {
            return s(t, "pageY", "clientY")
        }), fabric.util.getPointer = n, fabric.util.object.extend(fabric.util, fabric.Observable)
    }(),
    function() {
        function t(t, e) {
            var i = t.style;
            if (!i) return t;
            if ("string" == typeof e) return t.style.cssText += ";" + e, e.indexOf("opacity") > -1 ? s(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1]) : t;
            for (var r in e)
                if ("opacity" === r) s(t, e[r]);
                else {
                    var n = "float" === r || "cssFloat" === r ? "undefined" == typeof i.styleFloat ? "cssFloat" : "styleFloat" : r;
                    i[n] = e[r]
                }
            return t
        }
        var e = fabric.document.createElement("div"),
            i = "string" == typeof e.style.opacity,
            r = "string" == typeof e.style.filter,
            n = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
            s = function(t) {
                return t
            };
        i ? s = function(t, e) {
            return t.style.opacity = e, t
        } : r && (s = function(t, e) {
            var i = t.style;
            return t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1), n.test(i.filter) ? (e = e >= .9999 ? "" : "alpha(opacity=" + 100 * e + ")", i.filter = i.filter.replace(n, e)) : i.filter += " alpha(opacity=" + 100 * e + ")", t
        }), fabric.util.setStyle = t
    }(),
    function() {
        function t(t) {
            return "string" == typeof t ? fabric.document.getElementById(t) : t
        }

        function e(t, e) {
            var i = fabric.document.createElement(t);
            for (var r in e) "class" === r ? i.className = e[r] : "for" === r ? i.htmlFor = e[r] : i.setAttribute(r, e[r]);
            return i
        }

        function i(t, e) {
            t && (" " + t.className + " ").indexOf(" " + e + " ") === -1 && (t.className += (t.className ? " " : "") + e)
        }

        function r(t, i, r) {
            return "string" == typeof i && (i = e(i, r)), t.parentNode && t.parentNode.replaceChild(i, t), i.appendChild(t), i
        }

        function n(t) {
            for (var e = 0, i = 0, r = fabric.document.documentElement, n = fabric.document.body || {
                    scrollLeft: 0,
                    scrollTop: 0
                }; t && (t.parentNode || t.host) && (t = t.parentNode || t.host, t === fabric.document ? (e = n.scrollLeft || r.scrollLeft || 0, i = n.scrollTop || r.scrollTop || 0) : (e += t.scrollLeft || 0, i += t.scrollTop || 0), 1 !== t.nodeType || "fixed" !== fabric.util.getElementStyle(t, "position")););
            return {
                left: e,
                top: i
            }
        }

        function s(t) {
            var e, i, r = t && t.ownerDocument,
                s = {
                    left: 0,
                    top: 0
                },
                o = {
                    left: 0,
                    top: 0
                },
                a = {
                    borderLeftWidth: "left",
                    borderTopWidth: "top",
                    paddingLeft: "left",
                    paddingTop: "top"
                };
            if (!r) return o;
            for (var h in a) o[a[h]] += parseInt(c(t, h), 10) || 0;
            return e = r.documentElement, "undefined" != typeof t.getBoundingClientRect && (s = t.getBoundingClientRect()), i = n(t), {
                left: s.left + i.left - (e.clientLeft || 0) + o.left,
                top: s.top + i.top - (e.clientTop || 0) + o.top
            }
        }
        var o, a = Array.prototype.slice,
            h = function(t) {
                return a.call(t, 0)
            };
        try {
            o = h(fabric.document.childNodes) instanceof Array
        } catch (t) {}
        o || (h = function(t) {
            for (var e = new Array(t.length), i = t.length; i--;) e[i] = t[i];
            return e
        });
        var c;
        c = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? function(t, e) {
                var i = fabric.document.defaultView.getComputedStyle(t, null);
                return i ? i[e] : void 0
            } : function(t, e) {
                var i = t.style[e];
                return !i && t.currentStyle && (i = t.currentStyle[e]), i
            },
            function() {
                function t(t) {
                    return "undefined" != typeof t.onselectstart && (t.onselectstart = fabric.util.falseFunction), r ? t.style[r] = "none" : "string" == typeof t.unselectable && (t.unselectable = "on"), t
                }

                function e(t) {
                    return "undefined" != typeof t.onselectstart && (t.onselectstart = null), r ? t.style[r] = "" : "string" == typeof t.unselectable && (t.unselectable = ""), t
                }
                var i = fabric.document.documentElement.style,
                    r = "userSelect" in i ? "userSelect" : "MozUserSelect" in i ? "MozUserSelect" : "WebkitUserSelect" in i ? "WebkitUserSelect" : "KhtmlUserSelect" in i ? "KhtmlUserSelect" : "";
                fabric.util.makeElementUnselectable = t, fabric.util.makeElementSelectable = e
            }(),
            function() {
                function t(t, e) {
                    var i = fabric.document.getElementsByTagName("head")[0],
                        r = fabric.document.createElement("script"),
                        n = !0;
                    r.onload = r.onreadystatechange = function(t) {
                        if (n) {
                            if ("string" == typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState) return;
                            n = !1, e(t || fabric.window.event), r = r.onload = r.onreadystatechange = null
                        }
                    }, r.src = t, i.appendChild(r)
                }
                fabric.util.getScript = t
            }(), fabric.util.getById = t, fabric.util.toArray = h, fabric.util.makeElement = e, fabric.util.addClass = i, fabric.util.wrapElement = r, fabric.util.getScrollLeftTop = n, fabric.util.getElementOffset = s, fabric.util.getElementStyle = c
    }(),
    function() {
        function t(t, e) {
            return t + (/\?/.test(t) ? "&" : "?") + e
        }

        function e() {}

        function i(i, n) {
            n || (n = {});
            var s = n.method ? n.method.toUpperCase() : "GET",
                o = n.onComplete || function() {},
                a = r(),
                h = n.body || n.parameters;
            return a.onreadystatechange = function() {
                4 === a.readyState && (o(a), a.onreadystatechange = e)
            }, "GET" === s && (h = null, "string" == typeof n.parameters && (i = t(i, n.parameters))), a.open(s, i, !0), "POST" !== s && "PUT" !== s || a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), a.send(h), a
        }
        var r = function() {
            for (var t = [function() {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }, function() {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                }, function() {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0")
                }, function() {
                    return new XMLHttpRequest
                }], e = t.length; e--;) try {
                var i = t[e]();
                if (i) return t[e]
            } catch (t) {}
        }();
        fabric.util.request = i
    }(), fabric.log = function() {}, fabric.warn = function() {}, "undefined" != typeof console && ["log", "warn"].forEach(function(t) {
        "undefined" != typeof console[t] && "function" == typeof console[t].apply && (fabric[t] = function() {
            return console[t].apply(console, arguments)
        })
    }),
    function() {
        function t(t) {
            e(function(i) {
                t || (t = {});
                var r, n = i || +new Date,
                    s = t.duration || 500,
                    o = n + s,
                    a = t.onChange || function() {},
                    h = t.abort || function() {
                        return !1
                    },
                    c = t.easing || function(t, e, i, r) {
                        return -i * Math.cos(t / r * (Math.PI / 2)) + i + e
                    },
                    l = "startValue" in t ? t.startValue : 0,
                    u = "endValue" in t ? t.endValue : 100,
                    f = t.byValue || u - l;
                t.onStart && t.onStart(),
                    function i(u) {
                        r = u || +new Date;
                        var d = r > o ? s : r - n;
                        return h() ? void(t.onComplete && t.onComplete()) : (a(c(d, l, f, s)), r > o ? void(t.onComplete && t.onComplete()) : void e(i))
                    }(n)
            })
        }

        function e() {
            return i.apply(fabric.window, arguments)
        }
        var i = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(t) {
            fabric.window.setTimeout(t, 1e3 / 60)
        };
        fabric.util.animate = t, fabric.util.requestAnimFrame = e
    }(),
    function() {
        function t(t, e, i, r) {
            return t < Math.abs(e) ? (t = e, r = i / 4) : r = 0 === e && 0 === t ? i / (2 * Math.PI) * Math.asin(1) : i / (2 * Math.PI) * Math.asin(e / t), {
                a: t,
                c: e,
                p: i,
                s: r
            }
        }

        function e(t, e, i) {
            return t.a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * i - t.s) * (2 * Math.PI) / t.p)
        }

        function i(t, e, i, r) {
            return i * ((t = t / r - 1) * t * t + 1) + e
        }

        function r(t, e, i, r) {
            return t /= r / 2, t < 1 ? i / 2 * t * t * t + e : i / 2 * ((t -= 2) * t * t + 2) + e
        }

        function n(t, e, i, r) {
            return i * (t /= r) * t * t * t + e
        }

        function s(t, e, i, r) {
            return -i * ((t = t / r - 1) * t * t * t - 1) + e
        }

        function o(t, e, i, r) {
            return t /= r / 2, t < 1 ? i / 2 * t * t * t * t + e : -i / 2 * ((t -= 2) * t * t * t - 2) + e
        }

        function a(t, e, i, r) {
            return i * (t /= r) * t * t * t * t + e
        }

        function h(t, e, i, r) {
            return i * ((t = t / r - 1) * t * t * t * t + 1) + e
        }

        function c(t, e, i, r) {
            return t /= r / 2, t < 1 ? i / 2 * t * t * t * t * t + e : i / 2 * ((t -= 2) * t * t * t * t + 2) + e
        }

        function l(t, e, i, r) {
            return -i * Math.cos(t / r * (Math.PI / 2)) + i + e
        }

        function u(t, e, i, r) {
            return i * Math.sin(t / r * (Math.PI / 2)) + e
        }

        function f(t, e, i, r) {
            return -i / 2 * (Math.cos(Math.PI * t / r) - 1) + e
        }

        function d(t, e, i, r) {
            return 0 === t ? e : i * Math.pow(2, 10 * (t / r - 1)) + e
        }

        function g(t, e, i, r) {
            return t === r ? e + i : i * (-Math.pow(2, -10 * t / r) + 1) + e
        }

        function p(t, e, i, r) {
            return 0 === t ? e : t === r ? e + i : (t /= r / 2, t < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + e : i / 2 * (-Math.pow(2, -10 * --t) + 2) + e)
        }

        function v(t, e, i, r) {
            return -i * (Math.sqrt(1 - (t /= r) * t) - 1) + e
        }

        function b(t, e, i, r) {
            return i * Math.sqrt(1 - (t = t / r - 1) * t) + e
        }

        function m(t, e, i, r) {
            return t /= r / 2, t < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + e : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
        }

        function y(i, r, n, s) {
            var o = 1.70158,
                a = 0,
                h = n;
            if (0 === i) return r;
            if (i /= s, 1 === i) return r + n;
            a || (a = .3 * s);
            var c = t(h, n, a, o);
            return -e(c, i, s) + r
        }

        function _(e, i, r, n) {
            var s = 1.70158,
                o = 0,
                a = r;
            if (0 === e) return i;
            if (e /= n, 1 === e) return i + r;
            o || (o = .3 * n);
            var h = t(a, r, o, s);
            return h.a * Math.pow(2, -10 * e) * Math.sin((e * n - h.s) * (2 * Math.PI) / h.p) + h.c + i
        }

        function x(i, r, n, s) {
            var o = 1.70158,
                a = 0,
                h = n;
            if (0 === i) return r;
            if (i /= s / 2, 2 === i) return r + n;
            a || (a = s * (.3 * 1.5));
            var c = t(h, n, a, o);
            return i < 1 ? -.5 * e(c, i, s) + r : c.a * Math.pow(2, -10 * (i -= 1)) * Math.sin((i * s - c.s) * (2 * Math.PI) / c.p) * .5 + c.c + r
        }

        function S(t, e, i, r, n) {
            return void 0 === n && (n = 1.70158), i * (t /= r) * t * ((n + 1) * t - n) + e
        }

        function C(t, e, i, r, n) {
            return void 0 === n && (n = 1.70158), i * ((t = t / r - 1) * t * ((n + 1) * t + n) + 1) + e
        }

        function w(t, e, i, r, n) {
            return void 0 === n && (n = 1.70158), t /= r / 2, t < 1 ? i / 2 * (t * t * (((n *= 1.525) + 1) * t - n)) + e : i / 2 * ((t -= 2) * t * (((n *= 1.525) + 1) * t + n) + 2) + e
        }

        function O(t, e, i, r) {
            return i - T(r - t, 0, i, r) + e
        }

        function T(t, e, i, r) {
            return (t /= r) < 1 / 2.75 ? i * (7.5625 * t * t) + e : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
        }

        function k(t, e, i, r) {
            return t < r / 2 ? .5 * O(2 * t, 0, i, r) + e : .5 * T(2 * t - r, 0, i, r) + .5 * i + e
        }
        fabric.util.ease = {
            easeInQuad: function(t, e, i, r) {
                return i * (t /= r) * t + e
            },
            easeOutQuad: function(t, e, i, r) {
                return -i * (t /= r) * (t - 2) + e
            },
            easeInOutQuad: function(t, e, i, r) {
                return t /= r / 2, t < 1 ? i / 2 * t * t + e : -i / 2 * (--t * (t - 2) - 1) + e
            },
            easeInCubic: function(t, e, i, r) {
                return i * (t /= r) * t * t + e
            },
            easeOutCubic: i,
            easeInOutCubic: r,
            easeInQuart: n,
            easeOutQuart: s,
            easeInOutQuart: o,
            easeInQuint: a,
            easeOutQuint: h,
            easeInOutQuint: c,
            easeInSine: l,
            easeOutSine: u,
            easeInOutSine: f,
            easeInExpo: d,
            easeOutExpo: g,
            easeInOutExpo: p,
            easeInCirc: v,
            easeOutCirc: b,
            easeInOutCirc: m,
            easeInElastic: y,
            easeOutElastic: _,
            easeInOutElastic: x,
            easeInBack: S,
            easeOutBack: C,
            easeInOutBack: w,
            easeInBounce: O,
            easeOutBounce: T,
            easeInOutBounce: k
        }
    }(),
    function(t) {
        "use strict";

        function e(t) {
            return t in k ? k[t] : t
        }

        function i(t, e, i, r) {
            var n, s = "[object Array]" === Object.prototype.toString.call(e);
            return "fill" !== t && "stroke" !== t || "none" !== e ? "strokeDashArray" === t ? e = e.replace(/,/g, " ").split(/\s+/).map(function(t) {
                return parseFloat(t)
            }) : "transformMatrix" === t ? e = i && i.transformMatrix ? S(i.transformMatrix, v.parseTransformAttribute(e)) : v.parseTransformAttribute(e) : "visible" === t ? (e = "none" !== e && "hidden" !== e, i && i.visible === !1 && (e = !1)) : "originX" === t ? e = "start" === e ? "left" : "end" === e ? "right" : "center" : n = s ? e.map(x) : x(e, r) : e = "", !s && isNaN(n) ? e : n
        }

        function r(t) {
            for (var e in j)
                if ("undefined" != typeof t[j[e]] && "" !== t[e]) {
                    if ("undefined" == typeof t[e]) {
                        if (!v.Object.prototype[e]) continue;
                        t[e] = v.Object.prototype[e]
                    }
                    if (0 !== t[e].indexOf("url(")) {
                        var i = new v.Color(t[e]);
                        t[e] = i.setAlpha(_(i.getAlpha() * t[j[e]], 2)).toRgba()
                    }
                }
            return t
        }

        function n(t, e) {
            for (var i, r, n = [], s = 0; s < e.length; s++) i = e[s], r = t.getElementsByTagName(i), n = n.concat(Array.prototype.slice.call(r));
            return n
        }

        function s(t, r) {
            var n, s;
            t.replace(/;\s*$/, "").split(";").forEach(function(t) {
                var o = t.split(":");
                n = e(o[0].trim().toLowerCase()), s = i(n, o[1].trim()), r[n] = s
            })
        }

        function o(t, r) {
            var n, s;
            for (var o in t) "undefined" != typeof t[o] && (n = e(o.toLowerCase()), s = i(n, t[o]), r[n] = s)
        }

        function a(t, e) {
            var i = {};
            for (var r in v.cssRules[e])
                if (h(t, r.split(" ")))
                    for (var n in v.cssRules[e][r]) i[n] = v.cssRules[e][r][n];
            return i
        }

        function h(t, e) {
            var i, r = !0;
            return i = l(t, e.pop()), i && e.length && (r = c(t, e)), i && r && 0 === e.length
        }

        function c(t, e) {
            for (var i, r = !0; t.parentNode && 1 === t.parentNode.nodeType && e.length;) r && (i = e.pop()), t = t.parentNode, r = l(t, i);
            return 0 === e.length
        }

        function l(t, e) {
            var i, r = t.nodeName,
                n = t.getAttribute("class"),
                s = t.getAttribute("id");
            if (i = new RegExp("^" + r, "i"), e = e.replace(i, ""), s && e.length && (i = new RegExp("#" + s + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")), n && e.length) {
                n = n.split(" ");
                for (var o = n.length; o--;) i = new RegExp("\\." + n[o] + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")
            }
            return 0 === e.length
        }

        function u(t, e) {
            var i;
            if (t.getElementById && (i = t.getElementById(e)), i) return i;
            var r, n, s = t.getElementsByTagName("*");
            for (n = 0; n < s.length; n++)
                if (r = s[n], e === r.getAttribute("id")) return r
        }

        function f(t) {
            for (var e = n(t, ["use", "svg:use"]), i = 0; e.length && i < e.length;) {
                var r, s, o, a, h, c = e[i],
                    l = c.getAttribute("xlink:href").substr(1),
                    f = c.getAttribute("x") || 0,
                    g = c.getAttribute("y") || 0,
                    p = u(t, l).cloneNode(!0),
                    v = (p.getAttribute("transform") || "") + " translate(" + f + ", " + g + ")",
                    b = e.length;
                if (d(p), /^svg$/i.test(p.nodeName)) {
                    var m = p.ownerDocument.createElement("g");
                    for (o = 0, a = p.attributes, h = a.length; o < h; o++) s = a.item(o), m.setAttribute(s.nodeName, s.nodeValue);
                    for (; null != p.firstChild;) m.appendChild(p.firstChild);
                    p = m
                }
                for (o = 0, a = c.attributes, h = a.length; o < h; o++) s = a.item(o), "x" !== s.nodeName && "y" !== s.nodeName && "xlink:href" !== s.nodeName && ("transform" === s.nodeName ? v = s.nodeValue + " " + v : p.setAttribute(s.nodeName, s.nodeValue));
                p.setAttribute("transform", v), p.setAttribute("instantiated_by_use", "1"), p.removeAttribute("id"), r = c.parentNode, r.replaceChild(p, c), e.length === b && i++
            }
        }

        function d(t) {
            var e, i, r, n, s = t.getAttribute("viewBox"),
                o = 1,
                a = 1,
                h = 0,
                c = 0,
                l = t.getAttribute("width"),
                u = t.getAttribute("height"),
                f = t.getAttribute("x") || 0,
                d = t.getAttribute("y") || 0,
                g = t.getAttribute("preserveAspectRatio") || "",
                p = !s || !w.test(t.nodeName) || !(s = s.match(A)),
                b = !l || !u || "100%" === l || "100%" === u,
                m = p && b,
                y = {},
                _ = "";
            if (y.width = 0, y.height = 0, y.toBeParsed = m, m) return y;
            if (p) return y.width = x(l), y.height = x(u), y;
            if (h = -parseFloat(s[1]), c = -parseFloat(s[2]), e = parseFloat(s[3]), i = parseFloat(s[4]), b ? (y.width = e, y.height = i) : (y.width = x(l), y.height = x(u), o = y.width / e, a = y.height / i), g = v.util.parsePreserveAspectRatioAttribute(g), "none" !== g.alignX && (a = o = o > a ? a : o), 1 === o && 1 === a && 0 === h && 0 === c && 0 === f && 0 === d) return y;
            if ((f || d) && (_ = " translate(" + x(f) + " " + x(d) + ") "), r = _ + " matrix(" + o + " 0 0 " + a + " " + h * o + " " + c * a + ") ", "svg" === t.nodeName) {
                for (n = t.ownerDocument.createElement("g"); null != t.firstChild;) n.appendChild(t.firstChild);
                t.appendChild(n)
            } else n = t, r = n.getAttribute("transform") + r;
            return n.setAttribute("transform", r), y
        }

        function g(t) {
            var e = t.objects,
                i = t.options;
            return e = e.map(function(t) {
                return v[m(t.type)].fromObject(t)
            }), {
                objects: e,
                options: i
            }
        }

        function p(t, e, i) {
            e[i] && e[i].toSVG && t.push('\t<pattern x="0" y="0" id="', i, 'Pattern" ', 'width="', e[i].source.width, '" height="', e[i].source.height, '" patternUnits="userSpaceOnUse">\n', '\t\t<image x="0" y="0" ', 'width="', e[i].source.width, '" height="', e[i].source.height, '" xlink:href="', e[i].source.src, '"></image>\n\t</pattern>\n')
        }
        var v = t.fabric || (t.fabric = {}),
            b = v.util.object.extend,
            m = v.util.string.capitalize,
            y = v.util.object.clone,
            _ = v.util.toFixed,
            x = v.util.parseUnit,
            S = v.util.multiplyTransformMatrices,
            C = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/i,
            w = /^(symbol|image|marker|pattern|view|svg)$/i,
            O = /^(?:pattern|defs|symbol|metadata)$/i,
            T = /^(symbol|g|a|svg)$/i,
            k = {
                cx: "left",
                x: "left",
                r: "radius",
                cy: "top",
                y: "top",
                display: "visible",
                visibility: "visible",
                transform: "transformMatrix",
                "fill-opacity": "fillOpacity",
                "fill-rule": "fillRule",
                "font-family": "fontFamily",
                "font-size": "fontSize",
                "font-style": "fontStyle",
                "font-weight": "fontWeight",
                "stroke-dasharray": "strokeDashArray",
                "stroke-linecap": "strokeLineCap",
                "stroke-linejoin": "strokeLineJoin",
                "stroke-miterlimit": "strokeMiterLimit",
                "stroke-opacity": "strokeOpacity",
                "stroke-width": "strokeWidth",
                "text-decoration": "textDecoration",
                "text-anchor": "originX"
            },
            j = {
                stroke: "strokeOpacity",
                fill: "fillOpacity"
            };
        v.cssRules = {}, v.gradientDefs = {}, v.parseTransformAttribute = function() {
            function t(t, e) {
                var i = e[0],
                    r = 3 === e.length ? e[1] : 0,
                    n = 3 === e.length ? e[2] : 0;
                t[0] = Math.cos(i), t[1] = Math.sin(i), t[2] = -Math.sin(i), t[3] = Math.cos(i), t[4] = r - (t[0] * r + t[2] * n), t[5] = n - (t[1] * r + t[3] * n)
            }

            function e(t, e) {
                var i = e[0],
                    r = 2 === e.length ? e[1] : e[0];
                t[0] = i, t[3] = r
            }

            function i(t, e) {
                t[2] = Math.tan(v.util.degreesToRadians(e[0]))
            }

            function r(t, e) {
                t[1] = Math.tan(v.util.degreesToRadians(e[0]))
            }

            function n(t, e) {
                t[4] = e[0], 2 === e.length && (t[5] = e[1])
            }
            var s = [1, 0, 0, 1, 0, 0],
                o = v.reNum,
                a = "(?:\\s+,?\\s*|,\\s*)",
                h = "(?:(skewX)\\s*\\(\\s*(" + o + ")\\s*\\))",
                c = "(?:(skewY)\\s*\\(\\s*(" + o + ")\\s*\\))",
                l = "(?:(rotate)\\s*\\(\\s*(" + o + ")(?:" + a + "(" + o + ")" + a + "(" + o + "))?\\s*\\))",
                u = "(?:(scale)\\s*\\(\\s*(" + o + ")(?:" + a + "(" + o + "))?\\s*\\))",
                f = "(?:(translate)\\s*\\(\\s*(" + o + ")(?:" + a + "(" + o + "))?\\s*\\))",
                d = "(?:(matrix)\\s*\\(\\s*(" + o + ")" + a + "(" + o + ")" + a + "(" + o + ")" + a + "(" + o + ")" + a + "(" + o + ")" + a + "(" + o + ")\\s*\\))",
                g = "(?:" + d + "|" + f + "|" + u + "|" + l + "|" + h + "|" + c + ")",
                p = "(?:" + g + "(?:" + a + "*" + g + ")*)",
                b = "^\\s*(?:" + p + "?)\\s*$",
                m = new RegExp(b),
                y = new RegExp(g, "g");
            return function(o) {
                var a = s.concat(),
                    h = [];
                if (!o || o && !m.test(o)) return a;
                o.replace(y, function(o) {
                    var c = new RegExp(g).exec(o).filter(function(t) {
                            return "" !== t && null != t
                        }),
                        l = c[1],
                        u = c.slice(2).map(parseFloat);
                    switch (l) {
                        case "translate":
                            n(a, u);
                            break;
                        case "rotate":
                            u[0] = v.util.degreesToRadians(u[0]), t(a, u);
                            break;
                        case "scale":
                            e(a, u);
                            break;
                        case "skewX":
                            i(a, u);
                            break;
                        case "skewY":
                            r(a, u);
                            break;
                        case "matrix":
                            a = u
                    }
                    h.push(a.concat()), a = s.concat()
                });
                for (var c = h[0]; h.length > 1;) h.shift(), c = v.util.multiplyTransformMatrices(c, h[0]);
                return c
            }
        }();
        var A = new RegExp("^\\s*(" + v.reNum + "+)\\s*,?\\s*(" + v.reNum + "+)\\s*,?\\s*(" + v.reNum + "+)\\s*,?\\s*(" + v.reNum + "+)\\s*$");
        v.parseSVGDocument = function() {
            function t(t, e) {
                for (; t && (t = t.parentNode);)
                    if (t.nodeName && e.test(t.nodeName.replace("svg:", "")) && !t.getAttribute("instantiated_by_use")) return !0;
                return !1
            }
            return function(e, i, r) {
                if (e) {
                    f(e);
                    var n = new Date,
                        s = v.Object.__uid++,
                        o = d(e),
                        a = v.util.toArray(e.getElementsByTagName("*"));
                    if (o.svgUid = s, 0 === a.length && v.isLikelyNode) {
                        a = e.selectNodes('//*[name(.)!="svg"]');
                        for (var h = [], c = 0, l = a.length; c < l; c++) h[c] = a[c];
                        a = h
                    }
                    var u = a.filter(function(e) {
                        return d(e), C.test(e.nodeName.replace("svg:", "")) && !t(e, O)
                    });
                    if (!u || u && !u.length) return void(i && i([], {}));
                    v.gradientDefs[s] = v.getGradientDefs(e), v.cssRules[s] = v.getCSSRules(e), v.parseElements(u, function(t) {
                        v.documentParsingTime = new Date - n, i && i(t, o)
                    }, y(o), r)
                }
            }
        }();
        var M = {
                has: function(t, e) {
                    e(!1)
                },
                get: function() {},
                set: function() {}
            },
            P = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + v.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + v.reNum + "))?\\s+(.*)");
        b(v, {
            parseFontDeclaration: function(t, e) {
                var i = t.match(P);
                if (i) {
                    var r = i[1],
                        n = i[3],
                        s = i[4],
                        o = i[5],
                        a = i[6];
                    r && (e.fontStyle = r), n && (e.fontWeight = isNaN(parseFloat(n)) ? n : parseFloat(n)), s && (e.fontSize = x(s)), a && (e.fontFamily = a), o && (e.lineHeight = "normal" === o ? 1 : o)
                }
            },
            getGradientDefs: function(t) {
                var e, i, r, s = ["linearGradient", "radialGradient", "svg:linearGradient", "svg:radialGradient"],
                    o = n(t, s),
                    a = 0,
                    h = {},
                    c = {};
                for (a = o.length; a--;) e = o[a], r = e.getAttribute("xlink:href"), i = e.getAttribute("id"), r && (c[i] = r.substr(1)), h[i] = e;
                for (i in c) {
                    var l = h[c[i]].cloneNode(!0);
                    for (e = h[i]; l.firstChild;) e.appendChild(l.firstChild)
                }
                return h
            },
            parseAttributes: function(t, n, s) {
                if (t) {
                    var o, h, c = {};
                    "undefined" == typeof s && (s = t.getAttribute("svgUid")), t.parentNode && T.test(t.parentNode.nodeName) && (c = v.parseAttributes(t.parentNode, n, s)), h = c && c.fontSize || t.getAttribute("font-size") || v.Text.DEFAULT_SVG_FONT_SIZE;
                    var l = n.reduce(function(r, n) {
                        return o = t.getAttribute(n), o && (n = e(n), o = i(n, o, c, h), r[n] = o), r
                    }, {});
                    return l = b(l, b(a(t, s), v.parseStyleAttribute(t))), l.font && v.parseFontDeclaration(l.font, l), r(b(c, l))
                }
            },
            parseElements: function(t, e, i, r) {
                new v.ElementsParser(t, e, i, r).parse()
            },
            parseStyleAttribute: function(t) {
                var e = {},
                    i = t.getAttribute("style");
                return i ? ("string" == typeof i ? s(i, e) : o(i, e), e) : e
            },
            parsePointsAttribute: function(t) {
                if (!t) return null;
                t = t.replace(/,/g, " ").trim(), t = t.split(/\s+/);
                var e, i, r = [];
                for (e = 0, i = t.length; e < i; e += 2) r.push({
                    x: parseFloat(t[e]),
                    y: parseFloat(t[e + 1])
                });
                return r
            },
            getCSSRules: function(t) {
                for (var r, n = t.getElementsByTagName("style"), s = {}, o = 0, a = n.length; o < a; o++) {
                    var h = n[o].textContent || n[o].text;
                    h = h.replace(/\/\*[\s\S]*?\*\//g, ""), "" !== h.trim() && (r = h.match(/[^{]*\{[\s\S]*?\}/g), r = r.map(function(t) {
                        return t.trim()
                    }), r.forEach(function(t) {
                        for (var r = t.match(/([\s\S]*?)\s*\{([^}]*)\}/), n = {}, o = r[2].trim(), a = o.replace(/;$/, "").split(/\s*;\s*/), h = 0, c = a.length; h < c; h++) {
                            var l = a[h].split(/\s*:\s*/),
                                u = e(l[0]),
                                f = i(u, l[1], l[0]);
                            n[u] = f
                        }
                        t = r[1], t.split(",").forEach(function(t) {
                            t = t.replace(/^svg/i, "").trim(), "" !== t && (s[t] ? v.util.object.extend(s[t], n) : s[t] = v.util.object.clone(n))
                        })
                    }))
                }
                return s
            },
            loadSVGFromURL: function(t, e, i) {
                function r(r) {
                    var n = r.responseXML;
                    n && !n.documentElement && v.window.ActiveXObject && r.responseText && (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(r.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))), n && n.documentElement || e && e(null), v.parseSVGDocument(n.documentElement, function(i, r) {
                        M.set(t, {
                            objects: v.util.array.invoke(i, "toObject"),
                            options: r
                        }), e && e(i, r)
                    }, i)
                }
                t = t.replace(/^\n\s*/, "").trim(), M.has(t, function(i) {
                    i ? M.get(t, function(t) {
                        var i = g(t);
                        e(i.objects, i.options)
                    }) : new v.util.request(t, {
                        method: "get",
                        onComplete: r
                    })
                })
            },
            loadSVGFromString: function(t, e, i) {
                t = t.trim();
                var r;
                if ("undefined" != typeof DOMParser) {
                    var n = new DOMParser;
                    n && n.parseFromString && (r = n.parseFromString(t, "text/xml"))
                } else v.window.ActiveXObject && (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(t.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                v.parseSVGDocument(r.documentElement, function(t, i) {
                    e(t, i)
                }, i)
            },
            createSVGFontFacesMarkup: function(t) {
                for (var e, i, r, n, s, o, a, h = "", c = {}, l = v.fontPaths, u = 0, f = t.length; u < f; u++)
                    if (e = t[u], i = e.fontFamily, e.type.indexOf("text") !== -1 && !c[i] && l[i] && (c[i] = !0, e.styles)) {
                        r = e.styles;
                        for (s in r) {
                            n = r[s];
                            for (a in n) o = n[a], i = o.fontFamily, !c[i] && l[i] && (c[i] = !0)
                        }
                    }
                for (var d in c) h += ["\t\t@font-face {\n", "\t\t\tfont-family: '", d, "';\n", "\t\t\tsrc: url('", l[d], "');\n", "\t\t}\n"].join("");
                return h && (h = ['\t<style type="text/css">', "<![CDATA[\n", h, "]]>", "</style>\n"].join("")), h
            },
            createSVGRefElementsMarkup: function(t) {
                var e = [];
                return p(e, t, "backgroundColor"), p(e, t, "overlayColor"), e.join("")
            }
        })
    }("undefined" != typeof exports ? exports : this), fabric.ElementsParser = function(t, e, i, r) {
        this.elements = t, this.callback = e, this.options = i, this.reviver = r, this.svgUid = i && i.svgUid || 0
    }, fabric.ElementsParser.prototype.parse = function() {
        this.instances = new Array(this.elements.length), this.numElements = this.elements.length, this.createObjects()
    }, fabric.ElementsParser.prototype.createObjects = function() {
        for (var t = 0, e = this.elements.length; t < e; t++) this.elements[t].setAttribute("svgUid", this.svgUid),
            function(t, e) {
                setTimeout(function() {
                    t.createObject(t.elements[e], e)
                }, 0)
            }(this, t)
    }, fabric.ElementsParser.prototype.createObject = function(t, e) {
        var i = fabric[fabric.util.string.capitalize(t.tagName.replace("svg:", ""))];
        if (i && i.fromElement) try {
            this._createObject(i, t, e)
        } catch (t) {
            fabric.log(t)
        } else this.checkIfDone()
    }, fabric.ElementsParser.prototype._createObject = function(t, e, i) {
        if (t.async) t.fromElement(e, this.createCallback(i, e), this.options);
        else {
            var r = t.fromElement(e, this.options);
            this.resolveGradient(r, "fill"), this.resolveGradient(r, "stroke"), this.reviver && this.reviver(e, r), this.instances[i] = r, this.checkIfDone()
        }
    }, fabric.ElementsParser.prototype.createCallback = function(t, e) {
        var i = this;
        return function(r) {
            i.resolveGradient(r, "fill"), i.resolveGradient(r, "stroke"), i.reviver && i.reviver(e, r), i.instances[t] = r, i.checkIfDone()
        }
    }, fabric.ElementsParser.prototype.resolveGradient = function(t, e) {
        var i = t.get(e);
        if (/^url\(/.test(i)) {
            var r = i.slice(5, i.length - 1);
            fabric.gradientDefs[this.svgUid][r] && t.set(e, fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][r], t))
        }
    }, fabric.ElementsParser.prototype.checkIfDone = function() {
        0 === --this.numElements && (this.instances = this.instances.filter(function(t) {
            return null != t
        }), this.callback(this.instances))
    },
    function(t) {
        "use strict";

        function e(t, e) {
            this.x = t, this.y = e
        }
        var i = t.fabric || (t.fabric = {});
        return i.Point ? void i.warn("fabric.Point is already defined") : (i.Point = e, void(e.prototype = {
            type: "point",
            constructor: e,
            add: function(t) {
                return new e(this.x + t.x, this.y + t.y)
            },
            addEquals: function(t) {
                return this.x += t.x, this.y += t.y, this
            },
            scalarAdd: function(t) {
                return new e(this.x + t, this.y + t)
            },
            scalarAddEquals: function(t) {
                return this.x += t, this.y += t, this
            },
            subtract: function(t) {
                return new e(this.x - t.x, this.y - t.y)
            },
            subtractEquals: function(t) {
                return this.x -= t.x, this.y -= t.y, this
            },
            scalarSubtract: function(t) {
                return new e(this.x - t, this.y - t)
            },
            scalarSubtractEquals: function(t) {
                return this.x -= t, this.y -= t, this
            },
            multiply: function(t) {
                return new e(this.x * t, this.y * t)
            },
            multiplyEquals: function(t) {
                return this.x *= t, this.y *= t, this
            },
            divide: function(t) {
                return new e(this.x / t, this.y / t)
            },
            divideEquals: function(t) {
                return this.x /= t, this.y /= t, this
            },
            eq: function(t) {
                return this.x === t.x && this.y === t.y
            },
            lt: function(t) {
                return this.x < t.x && this.y < t.y
            },
            lte: function(t) {
                return this.x <= t.x && this.y <= t.y
            },
            gt: function(t) {
                return this.x > t.x && this.y > t.y
            },
            gte: function(t) {
                return this.x >= t.x && this.y >= t.y
            },
            lerp: function(t, i) {
                return "undefined" == typeof i && (i = .5), i = Math.max(Math.min(1, i), 0), new e(this.x + (t.x - this.x) * i, this.y + (t.y - this.y) * i)
            },
            distanceFrom: function(t) {
                var e = this.x - t.x,
                    i = this.y - t.y;
                return Math.sqrt(e * e + i * i)
            },
            midPointFrom: function(t) {
                return this.lerp(t)
            },
            min: function(t) {
                return new e(Math.min(this.x, t.x), Math.min(this.y, t.y))
            },
            max: function(t) {
                return new e(Math.max(this.x, t.x), Math.max(this.y, t.y))
            },
            toString: function() {
                return this.x + "," + this.y
            },
            setXY: function(t, e) {
                return this.x = t, this.y = e, this
            },
            setX: function(t) {
                return this.x = t, this
            },
            setY: function(t) {
                return this.y = t, this
            },
            setFromPoint: function(t) {
                return this.x = t.x, this.y = t.y, this
            },
            swap: function(t) {
                var e = this.x,
                    i = this.y;
                this.x = t.x, this.y = t.y, t.x = e, t.y = i
            },
            clone: function() {
                return new e(this.x, this.y)
            }
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";

        function e(t) {
            this.status = t, this.points = []
        }
        var i = t.fabric || (t.fabric = {});
        return i.Intersection ? void i.warn("fabric.Intersection is already defined") : (i.Intersection = e, i.Intersection.prototype = {
            constructor: e,
            appendPoint: function(t) {
                return this.points.push(t), this
            },
            appendPoints: function(t) {
                return this.points = this.points.concat(t), this
            }
        }, i.Intersection.intersectLineLine = function(t, r, n, s) {
            var o, a = (s.x - n.x) * (t.y - n.y) - (s.y - n.y) * (t.x - n.x),
                h = (r.x - t.x) * (t.y - n.y) - (r.y - t.y) * (t.x - n.x),
                c = (s.y - n.y) * (r.x - t.x) - (s.x - n.x) * (r.y - t.y);
            if (0 !== c) {
                var l = a / c,
                    u = h / c;
                0 <= l && l <= 1 && 0 <= u && u <= 1 ? (o = new e("Intersection"), o.appendPoint(new i.Point(t.x + l * (r.x - t.x), t.y + l * (r.y - t.y)))) : o = new e
            } else o = new e(0 === a || 0 === h ? "Coincident" : "Parallel");
            return o
        }, i.Intersection.intersectLinePolygon = function(t, i, r) {
            for (var n, s, o, a = new e, h = r.length, c = 0; c < h; c++) n = r[c], s = r[(c + 1) % h], o = e.intersectLineLine(t, i, n, s), a.appendPoints(o.points);
            return a.points.length > 0 && (a.status = "Intersection"), a
        }, i.Intersection.intersectPolygonPolygon = function(t, i) {
            for (var r = new e, n = t.length, s = 0; s < n; s++) {
                var o = t[s],
                    a = t[(s + 1) % n],
                    h = e.intersectLinePolygon(o, a, i);
                r.appendPoints(h.points)
            }
            return r.points.length > 0 && (r.status = "Intersection"), r
        }, void(i.Intersection.intersectPolygonRectangle = function(t, r, n) {
            var s = r.min(n),
                o = r.max(n),
                a = new i.Point(o.x, s.y),
                h = new i.Point(s.x, o.y),
                c = e.intersectLinePolygon(s, a, t),
                l = e.intersectLinePolygon(a, o, t),
                u = e.intersectLinePolygon(o, h, t),
                f = e.intersectLinePolygon(h, s, t),
                d = new e;
            return d.appendPoints(c.points), d.appendPoints(l.points), d.appendPoints(u.points), d.appendPoints(f.points), d.points.length > 0 && (d.status = "Intersection"), d
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";

        function e(t) {
            t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
        }

        function i(t, e, i) {
            return i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6 ? t + 6 * (e - t) * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
        }
        var r = t.fabric || (t.fabric = {});
        return r.Color ? void r.warn("fabric.Color is already defined.") : (r.Color = e, r.Color.prototype = {
            _tryParsingColor: function(t) {
                var i;
                t in e.colorNameMap && (t = e.colorNameMap[t]), "transparent" === t && (i = [255, 255, 255, 0]), i || (i = e.sourceFromHex(t)), i || (i = e.sourceFromRgb(t)), i || (i = e.sourceFromHsl(t)), i || (i = [0, 0, 0, 1]), i && this.setSource(i)
            },
            _rgbToHsl: function(t, e, i) {
                t /= 255, e /= 255, i /= 255;
                var n, s, o, a = r.util.array.max([t, e, i]),
                    h = r.util.array.min([t, e, i]);
                if (o = (a + h) / 2, a === h) n = s = 0;
                else {
                    var c = a - h;
                    switch (s = o > .5 ? c / (2 - a - h) : c / (a + h), a) {
                        case t:
                            n = (e - i) / c + (e < i ? 6 : 0);
                            break;
                        case e:
                            n = (i - t) / c + 2;
                            break;
                        case i:
                            n = (t - e) / c + 4
                    }
                    n /= 6
                }
                return [Math.round(360 * n), Math.round(100 * s), Math.round(100 * o)]
            },
            getSource: function() {
                return this._source
            },
            setSource: function(t) {
                this._source = t
            },
            toRgb: function() {
                var t = this.getSource();
                return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
            },
            toRgba: function() {
                var t = this.getSource();
                return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")"
            },
            toHsl: function() {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
            },
            toHsla: function() {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + t[3] + ")"
            },
            toHex: function() {
                var t, e, i, r = this.getSource();
                return t = r[0].toString(16), t = 1 === t.length ? "0" + t : t, e = r[1].toString(16), e = 1 === e.length ? "0" + e : e, i = r[2].toString(16), i = 1 === i.length ? "0" + i : i, t.toUpperCase() + e.toUpperCase() + i.toUpperCase()
            },
            getAlpha: function() {
                return this.getSource()[3]
            },
            setAlpha: function(t) {
                var e = this.getSource();
                return e[3] = t, this.setSource(e), this
            },
            toGrayscale: function() {
                var t = this.getSource(),
                    e = parseInt((.3 * t[0] + .59 * t[1] + .11 * t[2]).toFixed(0), 10),
                    i = t[3];
                return this.setSource([e, e, e, i]), this
            },
            toBlackWhite: function(t) {
                var e = this.getSource(),
                    i = (.3 * e[0] + .59 * e[1] + .11 * e[2]).toFixed(0),
                    r = e[3];
                return t = t || 127, i = Number(i) < Number(t) ? 0 : 255, this.setSource([i, i, i, r]), this
            },
            overlayWith: function(t) {
                t instanceof e || (t = new e(t));
                for (var i = [], r = this.getAlpha(), n = .5, s = this.getSource(), o = t.getSource(), a = 0; a < 3; a++) i.push(Math.round(s[a] * (1 - n) + o[a] * n));
                return i[3] = r, this.setSource(i), this
            }
        }, r.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, r.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, r.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i, r.Color.colorNameMap = {
            aqua: "#00FFFF",
            black: "#000000",
            blue: "#0000FF",
            fuchsia: "#FF00FF",
            gray: "#808080",
            grey: "#808080",
            green: "#008000",
            lime: "#00FF00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            orange: "#FFA500",
            purple: "#800080",
            red: "#FF0000",
            silver: "#C0C0C0",
            teal: "#008080",
            white: "#FFFFFF",
            yellow: "#FFFF00"
        }, r.Color.fromRgb = function(t) {
            return e.fromSource(e.sourceFromRgb(t))
        }, r.Color.sourceFromRgb = function(t) {
            var i = t.match(e.reRGBa);
            if (i) {
                var r = parseInt(i[1], 10) / (/%$/.test(i[1]) ? 100 : 1) * (/%$/.test(i[1]) ? 255 : 1),
                    n = parseInt(i[2], 10) / (/%$/.test(i[2]) ? 100 : 1) * (/%$/.test(i[2]) ? 255 : 1),
                    s = parseInt(i[3], 10) / (/%$/.test(i[3]) ? 100 : 1) * (/%$/.test(i[3]) ? 255 : 1);
                return [parseInt(r, 10), parseInt(n, 10), parseInt(s, 10), i[4] ? parseFloat(i[4]) : 1]
            }
        }, r.Color.fromRgba = e.fromRgb, r.Color.fromHsl = function(t) {
            return e.fromSource(e.sourceFromHsl(t))
        }, r.Color.sourceFromHsl = function(t) {
            var r = t.match(e.reHSLa);
            if (r) {
                var n, s, o, a = (parseFloat(r[1]) % 360 + 360) % 360 / 360,
                    h = parseFloat(r[2]) / (/%$/.test(r[2]) ? 100 : 1),
                    c = parseFloat(r[3]) / (/%$/.test(r[3]) ? 100 : 1);
                if (0 === h) n = s = o = c;
                else {
                    var l = c <= .5 ? c * (h + 1) : c + h - c * h,
                        u = 2 * c - l;
                    n = i(u, l, a + 1 / 3), s = i(u, l, a), o = i(u, l, a - 1 / 3)
                }
                return [Math.round(255 * n), Math.round(255 * s), Math.round(255 * o), r[4] ? parseFloat(r[4]) : 1]
            }
        }, r.Color.fromHsla = e.fromHsl, r.Color.fromHex = function(t) {
            return e.fromSource(e.sourceFromHex(t))
        }, r.Color.sourceFromHex = function(t) {
            if (t.match(e.reHex)) {
                var i = t.slice(t.indexOf("#") + 1),
                    r = 3 === i.length || 4 === i.length,
                    n = 8 === i.length || 4 === i.length,
                    s = r ? i.charAt(0) + i.charAt(0) : i.substring(0, 2),
                    o = r ? i.charAt(1) + i.charAt(1) : i.substring(2, 4),
                    a = r ? i.charAt(2) + i.charAt(2) : i.substring(4, 6),
                    h = n ? r ? i.charAt(3) + i.charAt(3) : i.substring(6, 8) : "FF";
                return [parseInt(s, 16), parseInt(o, 16), parseInt(a, 16), parseFloat((parseInt(h, 16) / 255).toFixed(2))]
            }
        }, void(r.Color.fromSource = function(t) {
            var i = new e;
            return i.setSource(t), i
        }))
    }("undefined" != typeof exports ? exports : this),
    function() {
        function t(t) {
            var e, i, r, n = t.getAttribute("style"),
                s = t.getAttribute("offset") || 0;
            if (s = parseFloat(s) / (/%$/.test(s) ? 100 : 1), s = s < 0 ? 0 : s > 1 ? 1 : s, n) {
                var o = n.split(/\s*;\s*/);
                "" === o[o.length - 1] && o.pop();
                for (var a = o.length; a--;) {
                    var h = o[a].split(/\s*:\s*/),
                        c = h[0].trim(),
                        l = h[1].trim();
                    "stop-color" === c ? e = l : "stop-opacity" === c && (r = l)
                }
            }
            return e || (e = t.getAttribute("stop-color") || "rgb(0,0,0)"), r || (r = t.getAttribute("stop-opacity")), e = new fabric.Color(e), i = e.getAlpha(), r = isNaN(parseFloat(r)) ? 1 : parseFloat(r), r *= i, {
                offset: s,
                color: e.toRgb(),
                opacity: r
            }
        }

        function e(t) {
            return {
                x1: t.getAttribute("x1") || 0,
                y1: t.getAttribute("y1") || 0,
                x2: t.getAttribute("x2") || "100%",
                y2: t.getAttribute("y2") || 0
            }
        }

        function i(t) {
            return {
                x1: t.getAttribute("fx") || t.getAttribute("cx") || "50%",
                y1: t.getAttribute("fy") || t.getAttribute("cy") || "50%",
                r1: 0,
                x2: t.getAttribute("cx") || "50%",
                y2: t.getAttribute("cy") || "50%",
                r2: t.getAttribute("r") || "50%"
            }
        }

        function r(t, e, i) {
            var r, n = 0,
                s = 1,
                o = "";
            for (var a in e) "Infinity" === e[a] ? e[a] = 1 : "-Infinity" === e[a] && (e[a] = 0), r = parseFloat(e[a], 10), s = "string" == typeof e[a] && /^\d+%$/.test(e[a]) ? .01 : 1, "x1" === a || "x2" === a || "r2" === a ? (s *= "objectBoundingBox" === i ? t.width : 1, n = "objectBoundingBox" === i ? t.left || 0 : 0) : "y1" !== a && "y2" !== a || (s *= "objectBoundingBox" === i ? t.height : 1, n = "objectBoundingBox" === i ? t.top || 0 : 0), e[a] = r * s + n;
            if ("ellipse" === t.type && null !== e.r2 && "objectBoundingBox" === i && t.rx !== t.ry) {
                var h = t.ry / t.rx;
                o = " scale(1, " + h + ")", e.y1 && (e.y1 /= h), e.y2 && (e.y2 /= h)
            }
            return o
        }
        fabric.Gradient = fabric.util.createClass({
            offsetX: 0,
            offsetY: 0,
            initialize: function(t) {
                t || (t = {});
                var e = {};
                this.id = fabric.Object.__uid++, this.type = t.type || "linear", e = {
                    x1: t.coords.x1 || 0,
                    y1: t.coords.y1 || 0,
                    x2: t.coords.x2 || 0,
                    y2: t.coords.y2 || 0
                }, "radial" === this.type && (e.r1 = t.coords.r1 || 0, e.r2 = t.coords.r2 || 0), this.coords = e, this.colorStops = t.colorStops.slice(), t.gradientTransform && (this.gradientTransform = t.gradientTransform), this.offsetX = t.offsetX || this.offsetX, this.offsetY = t.offsetY || this.offsetY
            },
            addColorStop: function(t) {
                for (var e in t) {
                    var i = new fabric.Color(t[e]);
                    this.colorStops.push({
                        offset: e,
                        color: i.toRgb(),
                        opacity: i.getAlpha()
                    })
                }
                return this
            },
            toObject: function() {
                return {
                    type: this.type,
                    coords: this.coords,
                    colorStops: this.colorStops,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
                }
            },
            toSVG: function(t) {
                var e, i, r = fabric.util.object.clone(this.coords);
                if (this.colorStops.sort(function(t, e) {
                        return t.offset - e.offset
                    }), !t.group || "path-group" !== t.group.type)
                    for (var n in r) "x1" === n || "x2" === n || "r2" === n ? r[n] += this.offsetX - t.width / 2 : "y1" !== n && "y2" !== n || (r[n] += this.offsetY - t.height / 2);
                i = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"', this.gradientTransform && (i += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" '), "linear" === this.type ? e = ["<linearGradient ", i, ' x1="', r.x1, '" y1="', r.y1, '" x2="', r.x2, '" y2="', r.y2, '">\n'] : "radial" === this.type && (e = ["<radialGradient ", i, ' cx="', r.x2, '" cy="', r.y2, '" r="', r.r2, '" fx="', r.x1, '" fy="', r.y1, '">\n']);
                for (var s = 0; s < this.colorStops.length; s++) e.push("<stop ", 'offset="', 100 * this.colorStops[s].offset + "%", '" style="stop-color:', this.colorStops[s].color, null != this.colorStops[s].opacity ? ";stop-opacity: " + this.colorStops[s].opacity : ";", '"/>\n');
                return e.push("linear" === this.type ? "</linearGradient>\n" : "</radialGradient>\n"), e.join("")
            },
            toLive: function(t, e) {
                var i, r, n = fabric.util.object.clone(this.coords);
                if (this.type) {
                    if (e.group && "path-group" === e.group.type)
                        for (r in n) "x1" === r || "x2" === r ? n[r] += -this.offsetX + e.width / 2 : "y1" !== r && "y2" !== r || (n[r] += -this.offsetY + e.height / 2);
                    "linear" === this.type ? i = t.createLinearGradient(n.x1, n.y1, n.x2, n.y2) : "radial" === this.type && (i = t.createRadialGradient(n.x1, n.y1, n.r1, n.x2, n.y2, n.r2));
                    for (var s = 0, o = this.colorStops.length; s < o; s++) {
                        var a = this.colorStops[s].color,
                            h = this.colorStops[s].opacity,
                            c = this.colorStops[s].offset;
                        "undefined" != typeof h && (a = new fabric.Color(a).setAlpha(h).toRgba()), i.addColorStop(parseFloat(c), a)
                    }
                    return i
                }
            }
        }), fabric.util.object.extend(fabric.Gradient, {
            fromElement: function(n, s) {
                var o, a, h, c = n.getElementsByTagName("stop"),
                    l = n.getAttribute("gradientUnits") || "objectBoundingBox",
                    u = n.getAttribute("gradientTransform"),
                    f = [];
                o = "linearGradient" === n.nodeName || "LINEARGRADIENT" === n.nodeName ? "linear" : "radial", "linear" === o ? a = e(n) : "radial" === o && (a = i(n));
                for (var d = c.length; d--;) f.push(t(c[d]));
                h = r(s, a, l);
                var g = new fabric.Gradient({
                    type: o,
                    coords: a,
                    colorStops: f,
                    offsetX: -s.left,
                    offsetY: -s.top
                });
                return (u || "" !== h) && (g.gradientTransform = fabric.parseTransformAttribute((u || "") + h)), g
            },
            forObject: function(t, e) {
                return e || (e = {}), r(t, e.coords, "userSpaceOnUse"), new fabric.Gradient(e)
            }
        })
    }(), fabric.Pattern = fabric.util.createClass({
        repeat: "repeat",
        offsetX: 0,
        offsetY: 0,
        initialize: function(t) {
            if (t || (t = {}), this.id = fabric.Object.__uid++, t.source)
                if ("string" == typeof t.source)
                    if ("undefined" != typeof fabric.util.getFunctionBody(t.source)) this.source = new Function(fabric.util.getFunctionBody(t.source));
                    else {
                        var e = this;
                        this.source = fabric.util.createImage(), fabric.util.loadImage(t.source, function(t) {
                            e.source = t
                        })
                    } else this.source = t.source;
            t.repeat && (this.repeat = t.repeat), t.offsetX && (this.offsetX = t.offsetX), t.offsetY && (this.offsetY = t.offsetY)
        },
        toObject: function() {
            var t;
            return "function" == typeof this.source ? t = String(this.source) : "string" == typeof this.source.src ? t = this.source.src : "object" == typeof this.source && this.source.toDataURL && (t = this.source.toDataURL()), {
                source: t,
                repeat: this.repeat,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            }
        },
        toSVG: function(t) {
            var e = "function" == typeof this.source ? this.source() : this.source,
                i = e.width / t.getWidth(),
                r = e.height / t.getHeight(),
                n = this.offsetX / t.getWidth(),
                s = this.offsetY / t.getHeight(),
                o = "";
            return "repeat-x" !== this.repeat && "no-repeat" !== this.repeat || (r = 1), "repeat-y" !== this.repeat && "no-repeat" !== this.repeat || (i = 1), e.src ? o = e.src : e.toDataURL && (o = e.toDataURL()), '<pattern id="SVGID_' + this.id + '" x="' + n + '" y="' + s + '" width="' + i + '" height="' + r + '">\n<image x="0" y="0" width="' + e.width + '" height="' + e.height + '" xlink:href="' + o + '"></image>\n</pattern>\n'
        },
        toLive: function(t) {
            var e = "function" == typeof this.source ? this.source() : this.source;
            if (!e) return "";
            if ("undefined" != typeof e.src) {
                if (!e.complete) return "";
                if (0 === e.naturalWidth || 0 === e.naturalHeight) return ""
            }
            return t.createPattern(e, this.repeat)
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.toFixed;
        return e.Shadow ? void e.warn("fabric.Shadow is already defined.") : (e.Shadow = e.util.createClass({
            color: "rgb(0,0,0)",
            blur: 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: !1,
            includeDefaultValues: !0,
            initialize: function(t) {
                "string" == typeof t && (t = this._parseShadow(t));
                for (var i in t) this[i] = t[i];
                this.id = e.Object.__uid++
            },
            _parseShadow: function(t) {
                var i = t.trim(),
                    r = e.Shadow.reOffsetsAndBlur.exec(i) || [],
                    n = i.replace(e.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)";
                return {
                    color: n.trim(),
                    offsetX: parseInt(r[1], 10) || 0,
                    offsetY: parseInt(r[2], 10) || 0,
                    blur: parseInt(r[3], 10) || 0
                }
            },
            toString: function() {
                return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
            },
            toSVG: function(t) {
                var r = 40,
                    n = 40,
                    s = e.Object.NUM_FRACTION_DIGITS,
                    o = e.util.rotateVector({
                        x: this.offsetX,
                        y: this.offsetY
                    }, e.util.degreesToRadians(-t.angle)),
                    a = 20;
                return t.width && t.height && (r = 100 * i((Math.abs(o.x) + this.blur) / t.width, s) + a, n = 100 * i((Math.abs(o.y) + this.blur) / t.height, s) + a), t.flipX && (o.x *= -1), t.flipY && (o.y *= -1), '<filter id="SVGID_' + this.id + '" y="-' + n + '%" height="' + (100 + 2 * n) + '%" x="-' + r + '%" width="' + (100 + 2 * r) + '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' + i(this.blur ? this.blur / 2 : 0, s) + '"></feGaussianBlur>\n\t<feOffset dx="' + i(o.x, s) + '" dy="' + i(o.y, s) + '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' + this.color + '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n'
            },
            toObject: function() {
                if (this.includeDefaultValues) return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    affectStroke: this.affectStroke
                };
                var t = {},
                    i = e.Shadow.prototype;
                return ["color", "blur", "offsetX", "offsetY", "affectStroke"].forEach(function(e) {
                    this[e] !== i[e] && (t[e] = this[e])
                }, this), t
            }
        }), void(e.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/))
    }("undefined" != typeof exports ? exports : this),
    function() {
        "use strict";
        if (fabric.StaticCanvas) return void fabric.warn("fabric.StaticCanvas is already defined.");
        var t = fabric.util.object.extend,
            e = fabric.util.getElementOffset,
            i = fabric.util.removeFromArray,
            r = fabric.util.toFixed,
            n = new Error("Could not initialize `canvas` element");
        fabric.StaticCanvas = fabric.util.createClass({
            initialize: function(t, e) {
                e || (e = {}), this._initStatic(t, e)
            },
            backgroundColor: "",
            backgroundImage: null,
            overlayColor: "",
            overlayImage: null,
            includeDefaultValues: !0,
            stateful: !0,
            renderOnAddRemove: !0,
            clipTo: null,
            controlsAboveOverlay: !1,
            allowTouchScrolling: !1,
            imageSmoothingEnabled: !0,
            viewportTransform: [1, 0, 0, 1, 0, 0],
            backgroundVpt: !0,
            overlayVpt: !0,
            onBeforeScaleRotate: function() {},
            enableRetinaScaling: !0,
            _initStatic: function(t, e) {
                var i = fabric.StaticCanvas.prototype.renderAll.bind(this);
                this._objects = [], this._createLowerCanvas(t), this._initOptions(e), this._setImageSmoothing(), this.interactive || this._initRetinaScaling(), e.overlayImage && this.setOverlayImage(e.overlayImage, i), e.backgroundImage && this.setBackgroundImage(e.backgroundImage, i), e.backgroundColor && this.setBackgroundColor(e.backgroundColor, i), e.overlayColor && this.setOverlayColor(e.overlayColor, i), this.calcOffset()
            },
            _isRetinaScaling: function() {
                return 1 !== fabric.devicePixelRatio && this.enableRetinaScaling
            },
            getRetinaScaling: function() {
                return this._isRetinaScaling() ? fabric.devicePixelRatio : 1
            },
            _initRetinaScaling: function() {
                this._isRetinaScaling() && (this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio), this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio), this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio))
            },
            calcOffset: function() {
                return this._offset = e(this.lowerCanvasEl), this
            },
            setOverlayImage: function(t, e, i) {
                return this.__setBgOverlayImage("overlayImage", t, e, i)
            },
            setBackgroundImage: function(t, e, i) {
                return this.__setBgOverlayImage("backgroundImage", t, e, i)
            },
            setOverlayColor: function(t, e) {
                return this.__setBgOverlayColor("overlayColor", t, e)
            },
            setBackgroundColor: function(t, e) {
                return this.__setBgOverlayColor("backgroundColor", t, e)
            },
            _setImageSmoothing: function() {
                var t = this.getContext();
                t.imageSmoothingEnabled = t.imageSmoothingEnabled || t.webkitImageSmoothingEnabled || t.mozImageSmoothingEnabled || t.msImageSmoothingEnabled || t.oImageSmoothingEnabled, t.imageSmoothingEnabled = this.imageSmoothingEnabled
            },
            __setBgOverlayImage: function(t, e, i, r) {
                return "string" == typeof e ? fabric.util.loadImage(e, function(e) {
                    e && (this[t] = new fabric.Image(e, r)), i && i(e)
                }, this, r && r.crossOrigin) : (r && e.setOptions(r), this[t] = e, i && i(e)), this
            },
            __setBgOverlayColor: function(t, e, i) {
                if (e && e.source) {
                    var r = this;
                    fabric.util.loadImage(e.source, function(n) {
                        r[t] = new fabric.Pattern({
                            source: n,
                            repeat: e.repeat,
                            offsetX: e.offsetX,
                            offsetY: e.offsetY
                        }), i && i()
                    })
                } else this[t] = e, i && i();
                return this
            },
            _createCanvasElement: function() {
                var t = fabric.document.createElement("canvas");
                if (t.style || (t.style = {}), !t) throw n;
                return this._initCanvasElement(t), t
            },
            _initCanvasElement: function(t) {
                if (fabric.util.createCanvasElement(t), "undefined" == typeof t.getContext) throw n
            },
            _initOptions: function(t) {
                for (var e in t) this[e] = t[e];
                this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0, this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0, this.lowerCanvasEl.style && (this.lowerCanvasEl.width = this.width, this.lowerCanvasEl.height = this.height, this.lowerCanvasEl.style.width = this.width + "px", this.lowerCanvasEl.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
            },
            _createLowerCanvas: function(t) {
                this.lowerCanvasEl = fabric.util.getById(t) || this._createCanvasElement(), this._initCanvasElement(this.lowerCanvasEl), fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext("2d")
            },
            getWidth: function() {
                return this.width
            },
            getHeight: function() {
                return this.height
            },
            setWidth: function(t, e) {
                return this.setDimensions({
                    width: t
                }, e)
            },
            setHeight: function(t, e) {
                return this.setDimensions({
                    height: t
                }, e)
            },
            setDimensions: function(t, e) {
                var i;
                e = e || {};
                for (var r in t) i = t[r], e.cssOnly || (this._setBackstoreDimension(r, t[r]), i += "px"), e.backstoreOnly || this._setCssDimension(r, i);
                return this._initRetinaScaling(), this._setImageSmoothing(), this.calcOffset(), e.cssOnly || this.renderAll(), this
            },
            _setBackstoreDimension: function(t, e) {
                return this.lowerCanvasEl[t] = e, this.upperCanvasEl && (this.upperCanvasEl[t] = e), this.cacheCanvasEl && (this.cacheCanvasEl[t] = e), this[t] = e, this
            },
            _setCssDimension: function(t, e) {
                return this.lowerCanvasEl.style[t] = e, this.upperCanvasEl && (this.upperCanvasEl.style[t] = e), this.wrapperEl && (this.wrapperEl.style[t] = e), this
            },
            getZoom: function() {
                return Math.sqrt(this.viewportTransform[0] * this.viewportTransform[3])
            },
            setViewportTransform: function(t) {
                var e = this.getActiveGroup();
                this.viewportTransform = t;
                for (var i = 0, r = this._objects.length; i < r; i++) this._objects[i].setCoords();
                return e && e.setCoords(), this.renderAll(), this
            },
            zoomToPoint: function(t, e) {
                var i = t,
                    r = this.viewportTransform.slice(0);
                t = fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform)), r[0] = e, r[3] = e;
                var n = fabric.util.transformPoint(t, r);
                return r[4] += i.x - n.x, r[5] += i.y - n.y, this.setViewportTransform(r)
            },
            setZoom: function(t) {
                return this.zoomToPoint(new fabric.Point(0, 0), t), this
            },
            absolutePan: function(t) {
                var e = this.viewportTransform.slice(0);
                return e[4] = -t.x, e[5] = -t.y, this.setViewportTransform(e)
            },
            relativePan: function(t) {
                return this.absolutePan(new fabric.Point(-t.x - this.viewportTransform[4], -t.y - this.viewportTransform[5]))
            },
            getElement: function() {
                return this.lowerCanvasEl
            },
            getActiveObject: function() {
                return null
            },
            getActiveGroup: function() {
                return null
            },
            _onObjectAdded: function(t) {
                this.stateful && t.setupState(), t._set("canvas", this), t.setCoords(), this.fire("object:added", {
                    target: t
                }), t.fire("added")
            },
            _onObjectRemoved: function(t) {
                this.fire("object:removed", {
                    target: t
                }), t.fire("removed")
            },
            clearContext: function(t) {
                return t.clearRect(0, 0, this.width, this.height), this
            },
            getContext: function() {
                return this.contextContainer
            },
            clear: function() {
                return this._objects.length = 0, this.clearContext(this.contextContainer), this.fire("canvas:cleared"), this.renderAll(), this
            },
            renderAll: function() {
                var t = this.contextContainer;
                return this.renderCanvas(t, this._objects), this
            },
            renderCanvas: function(t, e) {
                this.clearContext(t), this.fire("before:render"), this.clipTo && fabric.util.clipContext(this, t), this._renderBackground(t), t.save(), t.transform.apply(t, this.viewportTransform), this._renderObjects(t, e), t.restore(), !this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.clipTo && t.restore(), this._renderOverlay(t), this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.fire("after:render")
            },
            drawControls: function() {},
            _renderObjects: function(t, e) {
                for (var i = 0, r = e.length; i < r; ++i) e[i] && e[i].render(t)
            },
            _renderBackgroundOrOverlay: function(t, e) {
                var i = this[e + "Color"];
                i && (t.fillStyle = i.toLive ? i.toLive(t) : i, t.fillRect(i.offsetX || 0, i.offsetY || 0, this.width, this.height)), i = this[e + "Image"], i && (this[e + "Vpt"] && (t.save(), t.transform.apply(t, this.viewportTransform)), i.render(t), this[e + "Vpt"] && t.restore())
            },
            _renderBackground: function(t) {
                this._renderBackgroundOrOverlay(t, "background")
            },
            _renderOverlay: function(t) {
                this._renderBackgroundOrOverlay(t, "overlay")
            },
            getCenter: function() {
                return {
                    top: this.getHeight() / 2,
                    left: this.getWidth() / 2
                }
            },
            centerObjectH: function(t) {
                return this._centerObject(t, new fabric.Point(this.getCenter().left, t.getCenterPoint().y))
            },
            centerObjectV: function(t) {
                return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, this.getCenter().top))
            },
            centerObject: function(t) {
                var e = this.getCenter();
                return this._centerObject(t, new fabric.Point(e.left, e.top))
            },
            viewportCenterObject: function(t) {
                var e = this.getVpCenter();
                return this._centerObject(t, e)
            },
            viewportCenterObjectH: function(t) {
                var e = this.getVpCenter();
                return this._centerObject(t, new fabric.Point(e.x, t.getCenterPoint().y)), this
            },
            viewportCenterObjectV: function(t) {
                var e = this.getVpCenter();
                return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, e.y))
            },
            getVpCenter: function() {
                var t = this.getCenter(),
                    e = fabric.util.invertTransform(this.viewportTransform);
                return fabric.util.transformPoint({
                    x: t.left,
                    y: t.top
                }, e)
            },
            _centerObject: function(t, e) {
                return t.setPositionByOrigin(e, "center", "center"), this.renderAll(), this
            },
            toDatalessJSON: function(t) {
                return this.toDatalessObject(t)
            },
            toObject: function(t) {
                return this._toObjectMethod("toObject", t)
            },
            toDatalessObject: function(t) {
                return this._toObjectMethod("toDatalessObject", t)
            },
            _toObjectMethod: function(e, i) {
                var r = {
                    objects: this._toObjects(e, i)
                };
                return t(r, this.__serializeBgOverlay()), fabric.util.populateWithProperties(this, r, i),
                    r
            },
            _toObjects: function(t, e) {
                return this.getObjects().filter(function(t) {
                    return !t.excludeFromExport
                }).map(function(i) {
                    return this._toObject(i, t, e)
                }, this)
            },
            _toObject: function(t, e, i) {
                var r;
                this.includeDefaultValues || (r = t.includeDefaultValues, t.includeDefaultValues = !1);
                var n = this._realizeGroupTransformOnObject(t),
                    s = t[e](i);
                return this.includeDefaultValues || (t.includeDefaultValues = r), this._unwindGroupTransformOnObject(t, n), s
            },
            _realizeGroupTransformOnObject: function(t) {
                var e = ["angle", "flipX", "flipY", "height", "left", "scaleX", "scaleY", "top", "width"];
                if (t.group && t.group === this.getActiveGroup()) {
                    var i = {};
                    return e.forEach(function(e) {
                        i[e] = t[e]
                    }), this.getActiveGroup().realizeTransform(t), i
                }
                return null
            },
            _unwindGroupTransformOnObject: function(t, e) {
                e && t.set(e)
            },
            __serializeBgOverlay: function() {
                var t = {
                    background: this.backgroundColor && this.backgroundColor.toObject ? this.backgroundColor.toObject() : this.backgroundColor
                };
                return this.overlayColor && (t.overlay = this.overlayColor.toObject ? this.overlayColor.toObject() : this.overlayColor), this.backgroundImage && (t.backgroundImage = this.backgroundImage.toObject()), this.overlayImage && (t.overlayImage = this.overlayImage.toObject()), t
            },
            svgViewportTransformation: !0,
            toSVG: function(t, e) {
                t || (t = {});
                var i = [];
                return this._setSVGPreamble(i, t), this._setSVGHeader(i, t), this._setSVGBgOverlayColor(i, "backgroundColor"), this._setSVGBgOverlayImage(i, "backgroundImage", e), this._setSVGObjects(i, e), this._setSVGBgOverlayColor(i, "overlayColor"), this._setSVGBgOverlayImage(i, "overlayImage", e), i.push("</svg>"), i.join("")
            },
            _setSVGPreamble: function(t, e) {
                e.suppressPreamble || t.push('<?xml version="1.0" encoding="', e.encoding || "UTF-8", '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
            },
            _setSVGHeader: function(t, e) {
                var i, n = e.width || this.width,
                    s = e.height || this.height,
                    o = 'viewBox="0 0 ' + this.width + " " + this.height + '" ',
                    a = fabric.Object.NUM_FRACTION_DIGITS;
                e.viewBox ? o = 'viewBox="' + e.viewBox.x + " " + e.viewBox.y + " " + e.viewBox.width + " " + e.viewBox.height + '" ' : this.svgViewportTransformation && (i = this.viewportTransform, o = 'viewBox="' + r(-i[4] / i[0], a) + " " + r(-i[5] / i[3], a) + " " + r(this.width / i[0], a) + " " + r(this.height / i[3], a) + '" '), t.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', n, '" ', 'height="', s, '" ', this.backgroundColor && !this.backgroundColor.toLive ? 'style="background-color: ' + this.backgroundColor + '" ' : null, o, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>", fabric.createSVGFontFacesMarkup(this.getObjects()), fabric.createSVGRefElementsMarkup(this), "</defs>\n")
            },
            _setSVGObjects: function(t, e) {
                for (var i, r, n = 0, s = this.getObjects(), o = s.length; n < o; n++) i = s[n], i.excludeFromExport || (r = this._realizeGroupTransformOnObject(i), t.push(i.toSVG(e)), this._unwindGroupTransformOnObject(i, r))
            },
            _setSVGBgOverlayImage: function(t, e, i) {
                this[e] && this[e].toSVG && t.push(this[e].toSVG(i))
            },
            _setSVGBgOverlayColor: function(t, e) {
                this[e] && this[e].source ? t.push('<rect x="', this[e].offsetX, '" y="', this[e].offsetY, '" ', 'width="', "repeat-y" === this[e].repeat || "no-repeat" === this[e].repeat ? this[e].source.width : this.width, '" height="', "repeat-x" === this[e].repeat || "no-repeat" === this[e].repeat ? this[e].source.height : this.height, '" fill="url(#' + e + 'Pattern)"', "></rect>\n") : this[e] && "overlayColor" === e && t.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[e], '"', "></rect>\n")
            },
            sendToBack: function(t) {
                if (!t) return this;
                var e, r, n, s = this.getActiveGroup ? this.getActiveGroup() : null;
                if (t === s)
                    for (n = s._objects, e = n.length; e--;) r = n[e], i(this._objects, r), this._objects.unshift(r);
                else i(this._objects, t), this._objects.unshift(t);
                return this.renderAll && this.renderAll()
            },
            bringToFront: function(t) {
                if (!t) return this;
                var e, r, n, s = this.getActiveGroup ? this.getActiveGroup() : null;
                if (t === s)
                    for (n = s._objects, e = 0; e < n.length; e++) r = n[e], i(this._objects, r), this._objects.push(r);
                else i(this._objects, t), this._objects.push(t);
                return this.renderAll && this.renderAll()
            },
            sendBackwards: function(t, e) {
                if (!t) return this;
                var r, n, s, o, a, h = this.getActiveGroup ? this.getActiveGroup() : null;
                if (t === h)
                    for (a = h._objects, r = 0; r < a.length; r++) n = a[r], s = this._objects.indexOf(n), 0 !== s && (o = s - 1, i(this._objects, n), this._objects.splice(o, 0, n));
                else s = this._objects.indexOf(t), 0 !== s && (o = this._findNewLowerIndex(t, s, e), i(this._objects, t), this._objects.splice(o, 0, t));
                return this.renderAll && this.renderAll(), this
            },
            _findNewLowerIndex: function(t, e, i) {
                var r;
                if (i) {
                    r = e;
                    for (var n = e - 1; n >= 0; --n) {
                        var s = t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t);
                        if (s) {
                            r = n;
                            break
                        }
                    }
                } else r = e - 1;
                return r
            },
            bringForward: function(t, e) {
                if (!t) return this;
                var r, n, s, o, a, h = this.getActiveGroup ? this.getActiveGroup() : null;
                if (t === h)
                    for (a = h._objects, r = a.length; r--;) n = a[r], s = this._objects.indexOf(n), s !== this._objects.length - 1 && (o = s + 1, i(this._objects, n), this._objects.splice(o, 0, n));
                else s = this._objects.indexOf(t), s !== this._objects.length - 1 && (o = this._findNewUpperIndex(t, s, e), i(this._objects, t), this._objects.splice(o, 0, t));
                return this.renderAll && this.renderAll(), this
            },
            _findNewUpperIndex: function(t, e, i) {
                var r;
                if (i) {
                    r = e;
                    for (var n = e + 1; n < this._objects.length; ++n) {
                        var s = t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t);
                        if (s) {
                            r = n;
                            break
                        }
                    }
                } else r = e + 1;
                return r
            },
            moveTo: function(t, e) {
                return i(this._objects, t), this._objects.splice(e, 0, t), this.renderAll && this.renderAll()
            },
            dispose: function() {
                return this.clear(), this
            },
            toString: function() {
                return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this.getObjects().length + " }>"
            }
        }), t(fabric.StaticCanvas.prototype, fabric.Observable), t(fabric.StaticCanvas.prototype, fabric.Collection), t(fabric.StaticCanvas.prototype, fabric.DataURLExporter), t(fabric.StaticCanvas, {
            EMPTY_JSON: '{"objects": [], "background": "white"}',
            supports: function(t) {
                var e = fabric.util.createCanvasElement();
                if (!e || !e.getContext) return null;
                var i = e.getContext("2d");
                if (!i) return null;
                switch (t) {
                    case "getImageData":
                        return "undefined" != typeof i.getImageData;
                    case "setLineDash":
                        return "undefined" != typeof i.setLineDash;
                    case "toDataURL":
                        return "undefined" != typeof e.toDataURL;
                    case "toDataURLWithQuality":
                        try {
                            return e.toDataURL("image/jpeg", 0), !0
                        } catch (t) {}
                        return !1;
                    default:
                        return null
                }
            }
        }), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject
    }(), fabric.BaseBrush = fabric.util.createClass({
        color: "rgb(0, 0, 0)",
        width: 1,
        shadow: null,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        strokeDashArray: null,
        setShadow: function(t) {
            return this.shadow = new fabric.Shadow(t), this
        },
        _setBrushStyles: function() {
            var t = this.canvas.contextTop;
            t.strokeStyle = this.color, t.lineWidth = this.width, t.lineCap = this.strokeLineCap, t.lineJoin = this.strokeLineJoin, this.strokeDashArray && fabric.StaticCanvas.supports("setLineDash") && t.setLineDash(this.strokeDashArray)
        },
        _setShadow: function() {
            if (this.shadow) {
                var t = this.canvas.contextTop;
                t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur, t.shadowOffsetX = this.shadow.offsetX, t.shadowOffsetY = this.shadow.offsetY
            }
        },
        _resetShadow: function() {
            var t = this.canvas.contextTop;
            t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0
        }
    }),
    function() {
        fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
            initialize: function(t) {
                this.canvas = t, this._points = []
            },
            onMouseDown: function(t) {
                this._prepareForDrawing(t), this._captureDrawingPath(t), this._render()
            },
            onMouseMove: function(t) {
                this._captureDrawingPath(t), this.canvas.clearContext(this.canvas.contextTop), this._render()
            },
            onMouseUp: function() {
                this._finalizeAndAddPath()
            },
            _prepareForDrawing: function(t) {
                var e = new fabric.Point(t.x, t.y);
                this._reset(), this._addPoint(e), this.canvas.contextTop.moveTo(e.x, e.y)
            },
            _addPoint: function(t) {
                this._points.push(t)
            },
            _reset: function() {
                this._points.length = 0, this._setBrushStyles(), this._setShadow()
            },
            _captureDrawingPath: function(t) {
                var e = new fabric.Point(t.x, t.y);
                this._addPoint(e)
            },
            _render: function() {
                var t = this.canvas.contextTop,
                    e = this.canvas.viewportTransform,
                    i = this._points[0],
                    r = this._points[1];
                t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]), t.beginPath(), 2 === this._points.length && i.x === r.x && i.y === r.y && (i.x -= .5, r.x += .5), t.moveTo(i.x, i.y);
                for (var n = 1, s = this._points.length; n < s; n++) {
                    var o = i.midPointFrom(r);
                    t.quadraticCurveTo(i.x, i.y, o.x, o.y), i = this._points[n], r = this._points[n + 1]
                }
                t.lineTo(i.x, i.y), t.stroke(), t.restore()
            },
            convertPointsToSVGPath: function(t) {
                var e = [],
                    i = new fabric.Point(t[0].x, t[0].y),
                    r = new fabric.Point(t[1].x, t[1].y);
                e.push("M ", t[0].x, " ", t[0].y, " ");
                for (var n = 1, s = t.length; n < s; n++) {
                    var o = i.midPointFrom(r);
                    e.push("Q ", i.x, " ", i.y, " ", o.x, " ", o.y, " "), i = new fabric.Point(t[n].x, t[n].y), n + 1 < t.length && (r = new fabric.Point(t[n + 1].x, t[n + 1].y))
                }
                return e.push("L ", i.x, " ", i.y, " "), e
            },
            createPath: function(t) {
                var e = new fabric.Path(t, {
                    fill: null,
                    stroke: this.color,
                    strokeWidth: this.width,
                    strokeLineCap: this.strokeLineCap,
                    strokeLineJoin: this.strokeLineJoin,
                    strokeDashArray: this.strokeDashArray,
                    originX: "center",
                    originY: "center"
                });
                return this.shadow && (this.shadow.affectStroke = !0, e.setShadow(this.shadow)), e
            },
            _finalizeAndAddPath: function() {
                var t = this.canvas.contextTop;
                t.closePath();
                var e = this.convertPointsToSVGPath(this._points).join("");
                if ("M 0 0 Q 0 0 0 0 L 0 0" === e) return void this.canvas.renderAll();
                var i = this.createPath(e);
                this.canvas.add(i), i.setCoords(), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderAll(), this.canvas.fire("path:created", {
                    path: i
                })
            }
        })
    }(), fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        initialize: function(t) {
            this.canvas = t, this.points = []
        },
        drawDot: function(t) {
            var e = this.addPoint(t),
                i = this.canvas.contextTop,
                r = this.canvas.viewportTransform;
            i.save(), i.transform(r[0], r[1], r[2], r[3], r[4], r[5]), i.fillStyle = e.fill, i.beginPath(), i.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1), i.closePath(), i.fill(), i.restore()
        },
        onMouseDown: function(t) {
            this.points.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(t)
        },
        onMouseMove: function(t) {
            this.drawDot(t)
        },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for (var e = [], i = 0, r = this.points.length; i < r; i++) {
                var n = this.points[i],
                    s = new fabric.Circle({
                        radius: n.radius,
                        left: n.x,
                        top: n.y,
                        originX: "center",
                        originY: "center",
                        fill: n.fill
                    });
                this.shadow && s.setShadow(this.shadow), e.push(s)
            }
            var o = new fabric.Group(e, {
                originX: "center",
                originY: "center"
            });
            o.canvas = this.canvas, this.canvas.add(o), this.canvas.fire("path:created", {
                path: o
            }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.renderAll()
        },
        addPoint: function(t) {
            var e = new fabric.Point(t.x, t.y),
                i = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
                r = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
            return e.radius = i, e.fill = r, this.points.push(e), e
        }
    }), fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        density: 20,
        dotWidth: 1,
        dotWidthVariance: 1,
        randomOpacity: !1,
        optimizeOverlapping: !0,
        initialize: function(t) {
            this.canvas = t, this.sprayChunks = []
        },
        onMouseDown: function(t) {
            this.sprayChunks.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(t), this.render()
        },
        onMouseMove: function(t) {
            this.addSprayChunk(t), this.render()
        },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for (var e = [], i = 0, r = this.sprayChunks.length; i < r; i++)
                for (var n = this.sprayChunks[i], s = 0, o = n.length; s < o; s++) {
                    var a = new fabric.Rect({
                        width: n[s].width,
                        height: n[s].width,
                        left: n[s].x + 1,
                        top: n[s].y + 1,
                        originX: "center",
                        originY: "center",
                        fill: this.color
                    });
                    this.shadow && a.setShadow(this.shadow), e.push(a)
                }
            this.optimizeOverlapping && (e = this._getOptimizedRects(e));
            var h = new fabric.Group(e, {
                originX: "center",
                originY: "center"
            });
            h.canvas = this.canvas, this.canvas.add(h), this.canvas.fire("path:created", {
                path: h
            }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.renderAll()
        },
        _getOptimizedRects: function(t) {
            for (var e, i = {}, r = 0, n = t.length; r < n; r++) e = t[r].left + "" + t[r].top, i[e] || (i[e] = t[r]);
            var s = [];
            for (e in i) s.push(i[e]);
            return s
        },
        render: function() {
            var t = this.canvas.contextTop;
            t.fillStyle = this.color;
            var e = this.canvas.viewportTransform;
            t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
            for (var i = 0, r = this.sprayChunkPoints.length; i < r; i++) {
                var n = this.sprayChunkPoints[i];
                "undefined" != typeof n.opacity && (t.globalAlpha = n.opacity), t.fillRect(n.x, n.y, n.width, n.width)
            }
            t.restore()
        },
        addSprayChunk: function(t) {
            this.sprayChunkPoints = [];
            for (var e, i, r, n = this.width / 2, s = 0; s < this.density; s++) {
                e = fabric.util.getRandomInt(t.x - n, t.x + n), i = fabric.util.getRandomInt(t.y - n, t.y + n), r = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth;
                var o = new fabric.Point(e, i);
                o.width = r, this.randomOpacity && (o.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(o)
            }
            this.sprayChunks.push(this.sprayChunkPoints)
        }
    }), fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
        getPatternSrc: function() {
            var t = 20,
                e = 5,
                i = fabric.document.createElement("canvas"),
                r = i.getContext("2d");
            return i.width = i.height = t + e, r.fillStyle = this.color, r.beginPath(), r.arc(t / 2, t / 2, t / 2, 0, 2 * Math.PI, !1), r.closePath(), r.fill(), i
        },
        getPatternSrcFunction: function() {
            return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
        },
        getPattern: function() {
            return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
        },
        _setBrushStyles: function() {
            this.callSuper("_setBrushStyles"), this.canvas.contextTop.strokeStyle = this.getPattern()
        },
        createPath: function(t) {
            var e = this.callSuper("createPath", t),
                i = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2);
            return e.stroke = new fabric.Pattern({
                source: this.source || this.getPatternSrcFunction(),
                offsetX: -i.x,
                offsetY: -i.y
            }), e
        }
    }),
    function() {
        var t = fabric.util.getPointer,
            e = fabric.util.degreesToRadians,
            i = fabric.util.radiansToDegrees,
            r = Math.atan2,
            n = Math.abs,
            s = .5;
        fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
            initialize: function(t, e) {
                e || (e = {}), this._initStatic(t, e), this._initInteractive(), this._createCacheCanvas()
            },
            uniScaleTransform: !1,
            uniScaleKey: "shiftKey",
            centeredScaling: !1,
            centeredRotation: !1,
            centeredKey: "altKey",
            altActionKey: "shiftKey",
            interactive: !0,
            selection: !0,
            selectionKey: "shiftKey",
            selectionColor: "rgba(100, 100, 255, 0.3)",
            selectionDashArray: [],
            selectionBorderColor: "rgba(255, 255, 255, 0.3)",
            selectionLineWidth: 1,
            hoverCursor: "move",
            moveCursor: "move",
            defaultCursor: "default",
            freeDrawingCursor: "crosshair",
            rotationCursor: "crosshair",
            containerClass: "canvas-container",
            perPixelTargetFind: !1,
            targetFindTolerance: 0,
            skipTargetFind: !1,
            isDrawingMode: !1,
            preserveObjectStacking: !1,
            _initInteractive: function() {
                this._currentTransform = null, this._groupSelector = null, this._initWrapperElement(), this._createUpperCanvas(), this._initEventListeners(), this._initRetinaScaling(), this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this), this.calcOffset()
            },
            _chooseObjectsToRender: function() {
                var t, e = this.getActiveGroup(),
                    i = this.getActiveObject(),
                    r = [],
                    n = [];
                if (!e && !i || this.preserveObjectStacking) r = this._objects;
                else {
                    for (var s = 0, o = this._objects.length; s < o; s++) t = this._objects[s], e && e.contains(t) || t === i ? n.push(t) : r.push(t);
                    e && (e._set("_objects", n), r.push(e)), i && r.push(i)
                }
                return r
            },
            renderAll: function() {
                !this.selection || this._groupSelector || this.isDrawingMode || this.clearContext(this.contextTop);
                var t = this.contextContainer;
                return this.renderCanvas(t, this._chooseObjectsToRender()), this
            },
            renderTop: function() {
                var t = this.contextTop;
                return this.clearContext(t), this.selection && this._groupSelector && this._drawSelection(t), this.fire("after:render"), this
            },
            _resetCurrentTransform: function() {
                var t = this._currentTransform;
                t.target.set({
                    scaleX: t.original.scaleX,
                    scaleY: t.original.scaleY,
                    skewX: t.original.skewX,
                    skewY: t.original.skewY,
                    left: t.original.left,
                    top: t.original.top
                }), this._shouldCenterTransform(t.target) ? "rotate" === t.action ? this._setOriginToCenter(t.target) : ("center" !== t.originX && ("right" === t.originX ? t.mouseXSign = -1 : t.mouseXSign = 1), "center" !== t.originY && ("bottom" === t.originY ? t.mouseYSign = -1 : t.mouseYSign = 1), t.originX = "center", t.originY = "center") : (t.originX = t.original.originX, t.originY = t.original.originY)
            },
            containsPoint: function(t, e, i) {
                var r, n = !0,
                    s = i || this.getPointer(t, n);
                return r = e.group && e.group === this.getActiveGroup() ? this._normalizePointer(e.group, s) : {
                    x: s.x,
                    y: s.y
                }, e.containsPoint(r) || e._findTargetCorner(s)
            },
            _normalizePointer: function(t, e) {
                var i = t.calcTransformMatrix(),
                    r = fabric.util.invertTransform(i),
                    n = this.viewportTransform,
                    s = this.restorePointerVpt(e),
                    o = fabric.util.transformPoint(s, r);
                return fabric.util.transformPoint(o, n)
            },
            isTargetTransparent: function(t, e, i) {
                var r = t.hasBorders,
                    n = t.transparentCorners,
                    s = this.contextCache,
                    o = t.selectionBackgroundColor;
                t.hasBorders = t.transparentCorners = !1, t.selectionBackgroundColor = "", s.save(), s.transform.apply(s, this.viewportTransform), t.render(s), s.restore(), t.active && t._renderControls(s), t.hasBorders = r, t.transparentCorners = n, t.selectionBackgroundColor = o;
                var a = fabric.util.isTransparent(s, e, i, this.targetFindTolerance);
                return this.clearContext(s), a
            },
            _shouldClearSelection: function(t, e) {
                var i = this.getActiveGroup(),
                    r = this.getActiveObject();
                return !e || e && i && !i.contains(e) && i !== e && !t[this.selectionKey] || e && !e.evented || e && !e.selectable && r && r !== e
            },
            _shouldCenterTransform: function(t) {
                if (t) {
                    var e, i = this._currentTransform;
                    return "scale" === i.action || "scaleX" === i.action || "scaleY" === i.action ? e = this.centeredScaling || t.centeredScaling : "rotate" === i.action && (e = this.centeredRotation || t.centeredRotation), e ? !i.altKey : i.altKey
                }
            },
            _getOriginFromCorner: function(t, e) {
                var i = {
                    x: t.originX,
                    y: t.originY
                };
                return "ml" === e || "tl" === e || "bl" === e ? i.x = "right" : "mr" !== e && "tr" !== e && "br" !== e || (i.x = "left"), "tl" === e || "mt" === e || "tr" === e ? i.y = "bottom" : "bl" !== e && "mb" !== e && "br" !== e || (i.y = "top"), i
            },
            _getActionFromCorner: function(t, e, i) {
                if (!e) return "drag";
                switch (e) {
                    case "mtr":
                        return "rotate";
                    case "ml":
                    case "mr":
                        return i[this.altActionKey] ? "skewY" : "scaleX";
                    case "mt":
                    case "mb":
                        return i[this.altActionKey] ? "skewX" : "scaleY";
                    default:
                        return "scale"
                }
            },
            _setupCurrentTransform: function(t, i) {
                if (i) {
                    var r = this.getPointer(t),
                        n = i._findTargetCorner(this.getPointer(t, !0)),
                        s = this._getActionFromCorner(i, n, t),
                        o = this._getOriginFromCorner(i, n);
                    this._currentTransform = {
                        target: i,
                        action: s,
                        corner: n,
                        scaleX: i.scaleX,
                        scaleY: i.scaleY,
                        skewX: i.skewX,
                        skewY: i.skewY,
                        offsetX: r.x - i.left,
                        offsetY: r.y - i.top,
                        originX: o.x,
                        originY: o.y,
                        ex: r.x,
                        ey: r.y,
                        lastX: r.x,
                        lastY: r.y,
                        left: i.left,
                        top: i.top,
                        theta: e(i.angle),
                        width: i.width * i.scaleX,
                        mouseXSign: 1,
                        mouseYSign: 1,
                        shiftKey: t.shiftKey,
                        altKey: t[this.centeredKey]
                    }, this._currentTransform.original = {
                        left: i.left,
                        top: i.top,
                        scaleX: i.scaleX,
                        scaleY: i.scaleY,
                        skewX: i.skewX,
                        skewY: i.skewY,
                        originX: o.x,
                        originY: o.y
                    }, this._resetCurrentTransform()
                }
            },
            _translateObject: function(t, e) {
                var i = this._currentTransform,
                    r = i.target,
                    n = t - i.offsetX,
                    s = e - i.offsetY,
                    o = !r.get("lockMovementX") && r.left !== n,
                    a = !r.get("lockMovementY") && r.top !== s;
                return o && r.set("left", n), a && r.set("top", s), o || a
            },
            _changeSkewTransformOrigin: function(t, e, i) {
                var r = "originX",
                    n = {
                        0: "center"
                    },
                    s = e.target.skewX,
                    o = "left",
                    a = "right",
                    h = "mt" === e.corner || "ml" === e.corner ? 1 : -1,
                    c = 1;
                t = t > 0 ? 1 : -1, "y" === i && (s = e.target.skewY, o = "top", a = "bottom", r = "originY"), n[-1] = o, n[1] = a, e.target.flipX && (c *= -1), e.target.flipY && (c *= -1), 0 === s ? (e.skewSign = -h * t * c, e[r] = n[-t]) : (s = s > 0 ? 1 : -1, e.skewSign = s, e[r] = n[s * h * c])
            },
            _skewObject: function(t, e, i) {
                var r = this._currentTransform,
                    n = r.target,
                    s = !1,
                    o = n.get("lockSkewingX"),
                    a = n.get("lockSkewingY");
                if (o && "x" === i || a && "y" === i) return !1;
                var h, c, l = n.getCenterPoint(),
                    u = n.toLocalPoint(new fabric.Point(t, e), "center", "center")[i],
                    f = n.toLocalPoint(new fabric.Point(r.lastX, r.lastY), "center", "center")[i],
                    d = n._getTransformedDimensions();
                return this._changeSkewTransformOrigin(u - f, r, i), h = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY)[i], c = n.translateToOriginPoint(l, r.originX, r.originY), s = this._setObjectSkew(h, r, i, d), r.lastX = t, r.lastY = e, n.setPositionByOrigin(c, r.originX, r.originY), s
            },
            _setObjectSkew: function(t, e, i, r) {
                var n, s, o, a, h, c, l, u, f, d = e.target,
                    g = !1,
                    p = e.skewSign;
                return "x" === i ? (a = "y", h = "Y", c = "X", u = 0, f = d.skewY) : (a = "x", h = "X", c = "Y", u = d.skewX, f = 0), o = d._getTransformedDimensions(u, f), l = 2 * Math.abs(t) - o[i], l <= 2 ? n = 0 : (n = p * Math.atan(l / d["scale" + c] / (o[a] / d["scale" + h])), n = fabric.util.radiansToDegrees(n)), g = d["skew" + c] !== n, d.set("skew" + c, n), 0 !== d["skew" + h] && (s = d._getTransformedDimensions(), n = r[a] / s[a] * d["scale" + h], d.set("scale" + h, n)), g
            },
            _scaleObject: function(t, e, i) {
                var r = this._currentTransform,
                    n = r.target,
                    s = n.get("lockScalingX"),
                    o = n.get("lockScalingY"),
                    a = n.get("lockScalingFlip");
                if (s && o) return !1;
                var h = n.translateToOriginPoint(n.getCenterPoint(), r.originX, r.originY),
                    c = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY),
                    l = n._getTransformedDimensions(),
                    u = !1;
                return this._setLocalMouse(c, r), u = this._setObjectScale(c, r, s, o, i, a, l), n.setPositionByOrigin(h, r.originX, r.originY), u
            },
            _setObjectScale: function(t, e, i, r, n, s, o) {
                var a, h, c, l, u = e.target,
                    f = !1,
                    d = !1,
                    g = !1;
                return c = t.x * u.scaleX / o.x, l = t.y * u.scaleY / o.y, a = u.scaleX !== c, h = u.scaleY !== l, s && c <= 0 && c < u.scaleX && (f = !0), s && l <= 0 && l < u.scaleY && (d = !0), "equally" !== n || i || r ? n ? "x" !== n || u.get("lockUniScaling") ? "y" !== n || u.get("lockUniScaling") || d || r || u.set("scaleY", l) && (g = g || h) : f || i || u.set("scaleX", c) && (g = g || a) : (f || i || u.set("scaleX", c) && (g = g || a), d || r || u.set("scaleY", l) && (g = g || h)) : f || d || (g = this._scaleObjectEqually(t, u, e, o)), e.newScaleX = c, e.newScaleY = l, f || d || this._flipObject(e, n), g
            },
            _scaleObjectEqually: function(t, e, i, r) {
                var n, s = t.y + t.x,
                    o = r.y * i.original.scaleY / e.scaleY + r.x * i.original.scaleX / e.scaleX;
                return i.newScaleX = i.original.scaleX * s / o, i.newScaleY = i.original.scaleY * s / o, n = i.newScaleX !== e.scaleX || i.newScaleY !== e.scaleY, e.set("scaleX", i.newScaleX), e.set("scaleY", i.newScaleY), n
            },
            _flipObject: function(t, e) {
                t.newScaleX < 0 && "y" !== e && ("left" === t.originX ? t.originX = "right" : "right" === t.originX && (t.originX = "left")), t.newScaleY < 0 && "x" !== e && ("top" === t.originY ? t.originY = "bottom" : "bottom" === t.originY && (t.originY = "top"))
            },
            _setLocalMouse: function(t, e) {
                var i = e.target;
                "right" === e.originX ? t.x *= -1 : "center" === e.originX && (t.x *= 2 * e.mouseXSign, t.x < 0 && (e.mouseXSign = -e.mouseXSign)), "bottom" === e.originY ? t.y *= -1 : "center" === e.originY && (t.y *= 2 * e.mouseYSign, t.y < 0 && (e.mouseYSign = -e.mouseYSign)), n(t.x) > i.padding ? t.x < 0 ? t.x += i.padding : t.x -= i.padding : t.x = 0, n(t.y) > i.padding ? t.y < 0 ? t.y += i.padding : t.y -= i.padding : t.y = 0
            },
            _rotateObject: function(t, e) {
                var n = this._currentTransform;
                if (n.target.get("lockRotation")) return !1;
                var s = r(n.ey - n.top, n.ex - n.left),
                    o = r(e - n.top, t - n.left),
                    a = i(o - s + n.theta);
                return a < 0 && (a = 360 + a), n.target.angle = a % 360, !0
            },
            setCursor: function(t) {
                this.upperCanvasEl.style.cursor = t
            },
            _resetObjectTransform: function(t) {
                t.scaleX = 1, t.scaleY = 1, t.skewX = 0, t.skewY = 0, t.setAngle(0)
            },
            _drawSelection: function(t) {
                var e = this._groupSelector,
                    i = e.left,
                    r = e.top,
                    o = n(i),
                    a = n(r);
                if (t.fillStyle = this.selectionColor, t.fillRect(e.ex - (i > 0 ? 0 : -i), e.ey - (r > 0 ? 0 : -r), o, a), t.lineWidth = this.selectionLineWidth, t.strokeStyle = this.selectionBorderColor, this.selectionDashArray.length > 1) {
                    var h = e.ex + s - (i > 0 ? 0 : o),
                        c = e.ey + s - (r > 0 ? 0 : a);
                    t.beginPath(), fabric.util.drawDashedLine(t, h, c, h + o, c, this.selectionDashArray), fabric.util.drawDashedLine(t, h, c + a - 1, h + o, c + a - 1, this.selectionDashArray), fabric.util.drawDashedLine(t, h, c, h, c + a, this.selectionDashArray), fabric.util.drawDashedLine(t, h + o - 1, c, h + o - 1, c + a, this.selectionDashArray), t.closePath(), t.stroke()
                } else t.strokeRect(e.ex + s - (i > 0 ? 0 : o), e.ey + s - (r > 0 ? 0 : a), o, a)
            },
            findTarget: function(t, e) {
                if (!this.skipTargetFind) {
                    var i = !0,
                        r = this.getPointer(t, i),
                        n = this.getActiveGroup(),
                        s = this.getActiveObject();
                    if (n && !e && this._checkTarget(r, n)) return n;
                    if (s && this._checkTarget(r, s)) return s;
                    this.targets = [];
                    var o = this._searchPossibleTargets(this._objects, r);
                    return this._fireOverOutEvents(o, t), o
                }
            },
            _fireOverOutEvents: function(t, e) {
                t ? this._hoveredTarget !== t && (this._hoveredTarget && (this.fire("mouse:out", {
                    target: this._hoveredTarget,
                    e: e
                }), this._hoveredTarget.fire("mouseout")), this.fire("mouse:over", {
                    target: t,
                    e: e
                }), t.fire("mouseover"), this._hoveredTarget = t) : this._hoveredTarget && (this.fire("mouse:out", {
                    target: this._hoveredTarget,
                    e: e
                }), this._hoveredTarget.fire("mouseout"), this._hoveredTarget = null)
            },
            _checkTarget: function(t, e) {
                if (e && e.visible && e.evented && this.containsPoint(null, e, t)) {
                    if (!this.perPixelTargetFind && !e.perPixelTargetFind || e.isEditing) return !0;
                    var i = this.isTargetTransparent(e, t.x, t.y);
                    if (!i) return !0
                }
            },
            _searchPossibleTargets: function(t, e) {
                for (var i, r, n, s = t.length; s--;)
                    if (this._checkTarget(e, t[s])) {
                        i = t[s], "group" === i.type && i.subTargetCheck && (r = this._normalizePointer(i, e), n = this._searchPossibleTargets(i._objects, r), n && this.targets.push(n));
                        break
                    }
                return i
            },
            restorePointerVpt: function(t) {
                return fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform))
            },
            getPointer: function(e, i, r) {
                r || (r = this.upperCanvasEl);
                var n, s = t(e),
                    o = r.getBoundingClientRect(),
                    a = o.width || 0,
                    h = o.height || 0;
                return a && h || ("top" in o && "bottom" in o && (h = Math.abs(o.top - o.bottom)), "right" in o && "left" in o && (a = Math.abs(o.right - o.left))), this.calcOffset(), s.x = s.x - this._offset.left, s.y = s.y - this._offset.top, i || (s = this.restorePointerVpt(s)), n = 0 === a || 0 === h ? {
                    width: 1,
                    height: 1
                } : {
                    width: r.width / a,
                    height: r.height / h
                }, {
                    x: s.x * n.width,
                    y: s.y * n.height
                }
            },
            _createUpperCanvas: function() {
                var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
                this.upperCanvasEl = this._createCanvasElement(), fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + t), this.wrapperEl.appendChild(this.upperCanvasEl), this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl), this._applyCanvasStyle(this.upperCanvasEl), this.contextTop = this.upperCanvasEl.getContext("2d")
            },
            _createCacheCanvas: function() {
                this.cacheCanvasEl = this._createCanvasElement(), this.cacheCanvasEl.setAttribute("width", this.width), this.cacheCanvasEl.setAttribute("height", this.height), this.contextCache = this.cacheCanvasEl.getContext("2d")
            },
            _initWrapperElement: function() {
                this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                    class: this.containerClass
                }), fabric.util.setStyle(this.wrapperEl, {
                    width: this.getWidth() + "px",
                    height: this.getHeight() + "px",
                    position: "relative"
                }), fabric.util.makeElementUnselectable(this.wrapperEl)
            },
            _applyCanvasStyle: function(t) {
                var e = this.getWidth() || t.width,
                    i = this.getHeight() || t.height;
                fabric.util.setStyle(t, {
                    position: "absolute",
                    width: e + "px",
                    height: i + "px",
                    left: 0,
                    top: 0
                }), t.width = e, t.height = i, fabric.util.makeElementUnselectable(t)
            },
            _copyCanvasStyle: function(t, e) {
                e.style.cssText = t.style.cssText
            },
            getSelectionContext: function() {
                return this.contextTop
            },
            getSelectionElement: function() {
                return this.upperCanvasEl
            },
            _setActiveObject: function(t) {
                this._activeObject && this._activeObject.set("active", !1), this._activeObject = t, t.set("active", !1)
            },
            setActiveObject: function(t, e) {
                console.log('silver');
                if(t.get('layerName') == 'Gola Normal' ){
                    t.set("opacity", 1)
                    for ( var alvo = this.getObjects(), el = 0, i = alvo.length; el < i; el++ ) {
                        if(alvo[el].get('layerName') == 'Gola V' ){
                            alvo[el].set("opacity", 0);
                        }
                    }
                }
                if(t.get('layerName') == 'Gola V' ){
                    t.set("opacity", 1);
                    for ( var alvo = this.getObjects(), el = 0, i = alvo.length; el < i; el++ ) {
                        if(alvo[el].get('layerName') == 'Gola Normal' ){
                            alvo[el].set("opacity", 0);
                        }
                    }
                }
                return this._setActiveObject(t), this.fire("object:selected", {
                    target: t,
                    e: e
                }), t.fire("selected", {
                    e: e
                }),  this.deactivateAll(), t.set("active", 1), this
            },
            getActiveObject: function() {
                return this._activeObject
            },
            _onObjectRemoved: function(t) {
                this.getActiveObject() === t && (this.fire("before:selection:cleared", {
                    target: t
                }), this._discardActiveObject(), this.fire("selection:cleared", {
                    target: t
                }), t.fire("deselected")), this.callSuper("_onObjectRemoved", t)
            },
            _discardActiveObject: function() {
                this._activeObject && this._activeObject.set("active", !1), this._activeObject = null
            },
            discardActiveObject: function(t) {
                var e = this._activeObject;
                return this.fire("before:selection:cleared", {
                    target: e,
                    e: t
                }), this._discardActiveObject(), this.fire("selection:cleared", {
                    e: t
                }), e && e.fire("deselected", {
                    e: t
                }), this
            },
            _setActiveGroup: function(t) {
                this._activeGroup = t, t && t.set("active", !0)
            },
            setActiveGroup: function(t, e) {
                return this._setActiveGroup(t), t && (this.fire("object:selected", {
                    target: t,
                    e: e
                }), t.fire("selected", {
                    e: e
                })), this
            },
            getActiveGroup: function() {
                return this._activeGroup
            },
            _discardActiveGroup: function() {
                var t = this.getActiveGroup();
                t && t.destroy(), this.setActiveGroup(null)
            },
            discardActiveGroup: function(t) {
                var e = this.getActiveGroup();
                return this.fire("before:selection:cleared", {
                    e: t,
                    target: e
                }), this._discardActiveGroup(), this.fire("selection:cleared", {
                    e: t
                }), this
            },
            deactivateAll: function() {
                for (var t = this.getObjects(), e = 0, i = t.length; e < i; e++) t[e].set("active", !1);
                return this._discardActiveGroup(), this._discardActiveObject(), this
            },
            deactivateAllWithDispatch: function(t) {
                var e = this.getActiveGroup(),
                    i = this.getActiveObject();
                return (i || e) && this.fire("before:selection:cleared", {
                    target: i || e,
                    e: t
                }), this.deactivateAll(), (i || e) && (this.fire("selection:cleared", {
                    e: t,
                    target: i
                }), i && i.fire("deselected")), this
            },
            dispose: function() {
                this.callSuper("dispose");
                var t = this.wrapperEl;
                return this.removeListeners(), t.removeChild(this.upperCanvasEl), t.removeChild(this.lowerCanvasEl), delete this.upperCanvasEl, t.parentNode && t.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl), delete this.wrapperEl, this
            },
            clear: function() {
                return this.discardActiveGroup(), this.discardActiveObject(), this.clearContext(this.contextTop), this.callSuper("clear")
            },
            drawControls: function(t) {
                var e = this.getActiveGroup();
                e ? e._renderControls(t) : this._drawObjectsControls(t)
            },
            _drawObjectsControls: function(t) {
                for (var e = 0, i = this._objects.length; e < i; ++e) this._objects[e] && this._objects[e].active && this._objects[e]._renderControls(t)
            }
        });
        for (var o in fabric.StaticCanvas) "prototype" !== o && (fabric.Canvas[o] = fabric.StaticCanvas[o]);
        fabric.isTouchSupported && (fabric.Canvas.prototype._setCursorFromEvent = function() {}), fabric.Element = fabric.Canvas
    }(),
    function() {
        var t = {
                mt: 0,
                tr: 1,
                mr: 2,
                br: 3,
                mb: 4,
                bl: 5,
                ml: 6,
                tl: 7
            },
            e = fabric.util.addListener,
            i = fabric.util.removeListener;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            cursorMap: ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"],
            _initEventListeners: function() {
                this._bindEvents(), e(fabric.window, "resize", this._onResize), e(this.upperCanvasEl, "mousedown", this._onMouseDown), e(this.upperCanvasEl, "mousemove", this._onMouseMove), e(this.upperCanvasEl, "mouseout", this._onMouseOut), e(this.upperCanvasEl, "wheel", this._onMouseWheel), e(this.upperCanvasEl, "touchstart", this._onMouseDown), e(this.upperCanvasEl, "touchmove", this._onMouseMove), "undefined" != typeof eventjs && "add" in eventjs && (eventjs.add(this.upperCanvasEl, "gesture", this._onGesture), eventjs.add(this.upperCanvasEl, "drag", this._onDrag), eventjs.add(this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs.add(this.upperCanvasEl, "shake", this._onShake), eventjs.add(this.upperCanvasEl, "longpress", this._onLongPress))
            },
            _bindEvents: function() {
                this._onMouseDown = this._onMouseDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onResize = this._onResize.bind(this), this._onGesture = this._onGesture.bind(this), this._onDrag = this._onDrag.bind(this), this._onShake = this._onShake.bind(this), this._onLongPress = this._onLongPress.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onMouseWheel = this._onMouseWheel.bind(this), this._onMouseOut = this._onMouseOut.bind(this)
            },
            removeListeners: function() {
                i(fabric.window, "resize", this._onResize), i(this.upperCanvasEl, "mousedown", this._onMouseDown), i(this.upperCanvasEl, "mousemove", this._onMouseMove), i(this.upperCanvasEl, "mouseout", this._onMouseOut), i(this.upperCanvasEl, "wheel", this._onMouseWheel), i(this.upperCanvasEl, "touchstart", this._onMouseDown), i(this.upperCanvasEl, "touchmove", this._onMouseMove), "undefined" != typeof eventjs && "remove" in eventjs && (eventjs.remove(this.upperCanvasEl, "gesture", this._onGesture), eventjs.remove(this.upperCanvasEl, "drag", this._onDrag), eventjs.remove(this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs.remove(this.upperCanvasEl, "shake", this._onShake), eventjs.remove(this.upperCanvasEl, "longpress", this._onLongPress))
            },
            _onGesture: function(t, e) {
                this.__onTransformGesture && this.__onTransformGesture(t, e)
            },
            _onDrag: function(t, e) {
                this.__onDrag && this.__onDrag(t, e)
            },
            _onMouseWheel: function(t) {
                this.__onMouseWheel(t)
            },
            _onMouseOut: function(t) {
                var e = this._hoveredTarget;
                this.fire("mouse:out", {
                    target: e,
                    e: t
                }), this._hoveredTarget = null, e && e.fire("mouseout", {
                    e: t
                })
            },
            _onOrientationChange: function(t, e) {
                this.__onOrientationChange && this.__onOrientationChange(t, e)
            },
            _onShake: function(t, e) {
                this.__onShake && this.__onShake(t, e)
            },
            _onLongPress: function(t, e) {
                this.__onLongPress && this.__onLongPress(t, e)
            },
            _onMouseDown: function(t) {
                this.__onMouseDown(t), e(fabric.document, "touchend", this._onMouseUp), e(fabric.document, "touchmove", this._onMouseMove), i(this.upperCanvasEl, "mousemove", this._onMouseMove), i(this.upperCanvasEl, "touchmove", this._onMouseMove), "touchstart" === t.type ? i(this.upperCanvasEl, "mousedown", this._onMouseDown) : (e(fabric.document, "mouseup", this._onMouseUp), e(fabric.document, "mousemove", this._onMouseMove))
            },
            _onMouseUp: function(t) {
                if (this.__onMouseUp(t), i(fabric.document, "mouseup", this._onMouseUp), i(fabric.document, "touchend", this._onMouseUp), i(fabric.document, "mousemove", this._onMouseMove), i(fabric.document, "touchmove", this._onMouseMove), e(this.upperCanvasEl, "mousemove", this._onMouseMove), e(this.upperCanvasEl, "touchmove", this._onMouseMove), "touchend" === t.type) {
                    var r = this;
                    setTimeout(function() {
                        e(r.upperCanvasEl, "mousedown", r._onMouseDown)
                    }, 400)
                }
            },
            _onMouseMove: function(t) {
                !this.allowTouchScrolling && t.preventDefault && t.preventDefault(), this.__onMouseMove(t)
            },
            _onResize: function() {
                this.calcOffset()
            },
            _shouldRender: function(t, e) {
                var i = this.getActiveGroup() || this.getActiveObject();
                return !!(t && (t.isMoving || t !== i) || !t && i || !t && !i && !this._groupSelector || e && this._previousPointer && this.selection && (e.x !== this._previousPointer.x || e.y !== this._previousPointer.y))
            },
            __onMouseUp: function(t) {
                var e, i = !0,
                    r = this._currentTransform,
                    n = this._groupSelector,
                    s = !n || 0 === n.left && 0 === n.top;
                if (this.isDrawingMode && this._isCurrentlyDrawing) return void this._onMouseUpInDrawingMode(t);
                r && (this._finalizeCurrentTransform(), i = !r.actionPerformed), e = i ? this.findTarget(t, !0) : r.target;
                var o = this._shouldRender(e, this.getPointer(t));
                e || !s ? this._maybeGroupObjects(t) : (this._groupSelector = null, this._currentTransform = null), e && (e.isMoving = !1), this._handleCursorAndEvent(t, e, "up"), e && (e.__corner = 0), o && this.renderAll()
            },
            _handleCursorAndEvent: function(t, e, i) {
                this._setCursorFromEvent(t, e), this._handleEvent(t, i, e ? e : null)
            },
            _handleEvent: function(t, e, i) {
                var r = void 0 === typeof i ? this.findTarget(t) : i,
                    n = this.targets || [],
                    s = {
                        e: t,
                        target: r,
                        subTargets: n
                    };
                this.fire("mouse:" + e, s), r && r.fire("mouse" + e, s);
                for (var o = 0; o < n.length; o++) n[o].fire("mouse" + e, s)
            },
            _finalizeCurrentTransform: function() {
                var t = this._currentTransform,
                    e = t.target;
                e._scaling && (e._scaling = !1), e.setCoords(), this._restoreOriginXY(e), (t.actionPerformed || this.stateful && e.hasStateChanged()) && (this.fire("object:modified", {
                    target: e
                }), e.fire("modified"))
            },
            _restoreOriginXY: function(t) {
                if (this._previousOriginX && this._previousOriginY) {
                    var e = t.translateToOriginPoint(t.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                    t.originX = this._previousOriginX, t.originY = this._previousOriginY, t.left = e.x, t.top = e.y, this._previousOriginX = null, this._previousOriginY = null
                }
            },
            _onMouseDownInDrawingMode: function(t) {
                this._isCurrentlyDrawing = !0, this.discardActiveObject(t).renderAll(), this.clipTo && fabric.util.clipContext(this, this.contextTop);
                var e = this.getPointer(t);
                this.freeDrawingBrush.onMouseDown(e), this._handleEvent(t, "down")
            },
            _onMouseMoveInDrawingMode: function(t) {
                if (this._isCurrentlyDrawing) {
                    var e = this.getPointer(t);
                    this.freeDrawingBrush.onMouseMove(e)
                }
                this.setCursor(this.freeDrawingCursor), this._handleEvent(t, "move")
            },
            _onMouseUpInDrawingMode: function(t) {
                this._isCurrentlyDrawing = !1, this.clipTo && this.contextTop.restore(), this.freeDrawingBrush.onMouseUp(), this._handleEvent(t, "up")
            },
            __onMouseDown: function(t) {
                var e = "which" in t ? 1 === t.which : 0 === t.button;
                if (e || fabric.isTouchSupported) {
                    if (this.isDrawingMode) return void this._onMouseDownInDrawingMode(t);
                    if (!this._currentTransform) {
                        var i = this.findTarget(t),
                            r = this.getPointer(t, !0);
                        this._previousPointer = r;
                        var n = this._shouldRender(i, r),
                            s = this._shouldGroup(t, i);
                        this._shouldClearSelection(t, i) ? this._clearSelection(t, i, r) : s && (this._handleGrouping(t, i), i = this.getActiveGroup()), i && (!i.selectable || !i.__corner && s || (this._beforeTransform(t, i), this._setupCurrentTransform(t, i)), i !== this.getActiveGroup() && i !== this.getActiveObject() && (this.deactivateAll(), i.selectable && this.setActiveObject(i, t))), this._handleEvent(t, "down", i ? i : null), n && this.renderAll()
                    }
                }
            },
            _beforeTransform: function(t, e) {
                this.stateful && e.saveState(), e._findTargetCorner(this.getPointer(t)) && this.onBeforeScaleRotate(e)
            },
            _clearSelection: function(t, e, i) {
                this.deactivateAllWithDispatch(t), e && e.selectable ? this.setActiveObject(e, t) : this.selection && (this._groupSelector = {
                    ex: i.x,
                    ey: i.y,
                    top: 0,
                    left: 0
                })
            },
            _setOriginToCenter: function(t) {
                this._previousOriginX = this._currentTransform.target.originX, this._previousOriginY = this._currentTransform.target.originY;
                var e = t.getCenterPoint();
                t.originX = "center", t.originY = "center", t.left = e.x, t.top = e.y, this._currentTransform.left = t.left, this._currentTransform.top = t.top
            },
            _setCenterToOrigin: function(t) {
                var e = t.translateToOriginPoint(t.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                t.originX = this._previousOriginX, t.originY = this._previousOriginY, t.left = e.x, t.top = e.y, this._previousOriginX = null, this._previousOriginY = null
            },
            __onMouseMove: function(t) {
                var e, i;
                if (this.isDrawingMode) return void this._onMouseMoveInDrawingMode(t);
                if (!("undefined" != typeof t.touches && t.touches.length > 1)) {
                    var r = this._groupSelector;
                    r ? (i = this.getPointer(t, !0), r.left = i.x - r.ex, r.top = i.y - r.ey, this.renderTop()) : this._currentTransform ? this._transformObject(t) : (e = this.findTarget(t), this._setCursorFromEvent(t, e)), this._handleEvent(t, "move", e ? e : null)
                }
            },
            __onMouseWheel: function(t) {
                this.fire("mouse:wheel", {
                    e: t
                })
            },
            _transformObject: function(t) {
                var e = this.getPointer(t),
                    i = this._currentTransform;
                i.reset = !1, i.target.isMoving = !0, this._beforeScaleTransform(t, i), this._performTransformAction(t, i, e), i.actionPerformed && this.renderAll()
            },
            _performTransformAction: function(t, e, i) {
                var r = i.x,
                    n = i.y,
                    s = e.target,
                    o = e.action,
                    a = !1;
                "rotate" === o ? (a = this._rotateObject(r, n)) && this._fire("rotating", s, t) : "scale" === o ? (a = this._onScale(t, e, r, n)) && this._fire("scaling", s, t) : "scaleX" === o ? (a = this._scaleObject(r, n, "x")) && this._fire("scaling", s, t) : "scaleY" === o ? (a = this._scaleObject(r, n, "y")) && this._fire("scaling", s, t) : "skewX" === o ? (a = this._skewObject(r, n, "x")) && this._fire("skewing", s, t) : "skewY" === o ? (a = this._skewObject(r, n, "y")) && this._fire("skewing", s, t) : (a = this._translateObject(r, n), a && (this._fire("moving", s, t), this.setCursor(s.moveCursor || this.moveCursor))), e.actionPerformed = a
            },
            _fire: function(t, e, i) {
                this.fire("object:" + t, {
                    target: e,
                    e: i
                }), e.fire(t, {
                    e: i
                })
            },
            _beforeScaleTransform: function(t, e) {
                if ("scale" === e.action || "scaleX" === e.action || "scaleY" === e.action) {
                    var i = this._shouldCenterTransform(e.target);
                    (i && ("center" !== e.originX || "center" !== e.originY) || !i && "center" === e.originX && "center" === e.originY) && (this._resetCurrentTransform(), e.reset = !0)
                }
            },
            _onScale: function(t, e, i, r) {
                return !t[this.uniScaleKey] && !this.uniScaleTransform || e.target.get("lockUniScaling") ? (e.reset || "scale" !== e.currentAction || this._resetCurrentTransform(), e.currentAction = "scaleEqually", this._scaleObject(i, r, "equally")) : (e.currentAction = "scale", this._scaleObject(i, r))
            },
            _setCursorFromEvent: function(t, e) {
                if (!e) return this.setCursor(this.defaultCursor), !1;
                var i = e.hoverCursor || this.hoverCursor;
                if (e.selectable) {
                    var r = this.getActiveGroup(),
                        n = e._findTargetCorner && (!r || !r.contains(e)) && e._findTargetCorner(this.getPointer(t, !0));
                    n ? this._setCornerCursor(n, e, t) : this.setCursor(i)
                } else this.setCursor(i);
                return !0
            },
            _setCornerCursor: function(e, i, r) {
                if (e in t) this.setCursor(this._getRotatedCornerCursor(e, i, r));
                else {
                    if ("mtr" !== e || !i.hasRotatingPoint) return this.setCursor(this.defaultCursor), !1;
                    this.setCursor(this.rotationCursor)
                }
            },
            _getRotatedCornerCursor: function(e, i, r) {
                var n = Math.round(i.getAngle() % 360 / 45);
                return n < 0 && (n += 8), n += t[e], r[this.altActionKey] && t[e] % 2 === 0 && (n += 2), n %= 8, this.cursorMap[n]
            }
        })
    }(),
    function() {
        var t = Math.min,
            e = Math.max;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            _shouldGroup: function(t, e) {
                var i = this.getActiveObject();
                return t[this.selectionKey] && e && e.selectable && (this.getActiveGroup() || i && i !== e)
            },
            _handleGrouping: function(t, e) {
                var i = this.getActiveGroup();
                (e !== i || (e = this.findTarget(t, !0))) && (i ? this._updateActiveGroup(e, t) : this._createActiveGroup(e, t), this._activeGroup && this._activeGroup.saveCoords())
            },
            _updateActiveGroup: function(t, e) {
                var i = this.getActiveGroup();
                if (i.contains(t)) {
                    if (i.removeWithUpdate(t), t.set("active", !1), 1 === i.size()) return this.discardActiveGroup(e), void this.setActiveObject(i.item(0))
                } else i.addWithUpdate(t);
                this.fire("selection:created", {
                    target: i,
                    e: e
                }), i.set("active", !0)
            },
            _createActiveGroup: function(t, e) {
                if (this._activeObject && t !== this._activeObject) {
                    var i = this._createGroup(t);
                    i.addWithUpdate(), this.setActiveGroup(i), this._activeObject = null, this.fire("selection:created", {
                        target: i,
                        e: e
                    })
                }
                t.set("active", !0)
            },
            _createGroup: function(t) {
                var e = this.getObjects(),
                    i = e.indexOf(this._activeObject) < e.indexOf(t),
                    r = i ? [this._activeObject, t] : [t, this._activeObject];
                return this._activeObject.isEditing && this._activeObject.exitEditing(), new fabric.Group(r, {
                    canvas: this
                })
            },
            _groupSelectedObjects: function(t) {
                var e = this._collectObjects();
                1 === e.length ? this.setActiveObject(e[0], t) : e.length > 1 && (e = new fabric.Group(e.reverse(), {
                    canvas: this
                }), e.addWithUpdate(), this.setActiveGroup(e, t), e.saveCoords(), this.fire("selection:created", {
                    target: e
                }), this.renderAll())
            },
            _collectObjects: function() {
                for (var i, r = [], n = this._groupSelector.ex, s = this._groupSelector.ey, o = n + this._groupSelector.left, a = s + this._groupSelector.top, h = new fabric.Point(t(n, o), t(s, a)), c = new fabric.Point(e(n, o), e(s, a)), l = n === o && s === a, u = this._objects.length; u-- && (i = this._objects[u], !(i && i.selectable && i.visible && (i.intersectsWithRect(h, c) || i.isContainedWithinRect(h, c) || i.containsPoint(h) || i.containsPoint(c)) && (i.set("active", !0), r.push(i), l))););
                return r
            },
            _maybeGroupObjects: function(t) {
                this.selection && this._groupSelector && this._groupSelectedObjects(t);
                var e = this.getActiveGroup();
                e && (e.setObjectsCoords().setCoords(), e.isMoving = !1, this.setCursor(this.defaultCursor)), this._groupSelector = null, this._currentTransform = null
            }
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(t) {
            t || (t = {});
            var e = t.format || "png",
                i = t.quality || 1,
                r = t.multiplier || 1,
                n = {
                    left: t.left,
                    top: t.top,
                    width: t.width,
                    height: t.height
                };
            return this._isRetinaScaling() && (r *= fabric.devicePixelRatio), 1 !== r ? this.__toDataURLWithMultiplier(e, i, n, r) : this.__toDataURL(e, i, n)
        },
        __toDataURL: function(t, e, i) {
            this.renderAll();
            var r = this.contextContainer.canvas,
                n = this.__getCroppedCanvas(r, i);
            "jpg" === t && (t = "jpeg");
            var s = fabric.StaticCanvas.supports("toDataURLWithQuality") ? (n || r).toDataURL("image/" + t, e) : (n || r).toDataURL("image/" + t);
            return n && (n = null), s
        },
        __getCroppedCanvas: function(t, e) {
            var i, r, n = "left" in e || "top" in e || "width" in e || "height" in e;
            return n && (i = fabric.util.createCanvasElement(), r = i.getContext("2d"), i.width = e.width || this.width, i.height = e.height || this.height, r.drawImage(t, -e.left || 0, -e.top || 0)), i
        },
        __toDataURLWithMultiplier: function(t, e, i, r) {
            var n = this.getWidth(),
                s = this.getHeight(),
                o = n * r,
                a = s * r,
                h = this.getActiveObject(),
                c = this.getActiveGroup(),
                l = this.getZoom(),
                u = l * r / fabric.devicePixelRatio;
            r > 1 && this.setDimensions({
                width: o,
                height: a
            }), this.setZoom(u), i.left && (i.left *= r), i.top && (i.top *= r), i.width ? i.width *= r : r < 1 && (i.width = o), i.height ? i.height *= r : r < 1 && (i.height = a), c ? this._tempRemoveBordersControlsFromGroup(c) : h && this.deactivateAll && this.deactivateAll();
            var f = this.__toDataURL(t, e, i);
            return c ? this._restoreBordersControlsOnGroup(c) : h && this.setActiveObject && this.setActiveObject(h), this.setZoom(l), this.setDimensions({
                width: n,
                height: s
            }), f
        },
        toDataURLWithMultiplier: function(t, e, i) {
            return this.toDataURL({
                format: t,
                multiplier: e,
                quality: i
            })
        },
        _tempRemoveBordersControlsFromGroup: function(t) {
            t.origHasControls = t.hasControls, t.origBorderColor = t.borderColor, t.hasControls = !0, t.borderColor = "rgba(0,0,0,0)", t.forEachObject(function(t) {
                t.origBorderColor = t.borderColor, t.borderColor = "rgba(0,0,0,0)"
            })
        },
        _restoreBordersControlsOnGroup: function(t) {
            t.hideControls = t.origHideControls, t.borderColor = t.origBorderColor, t.forEachObject(function(t) {
                t.borderColor = t.origBorderColor, delete t.origBorderColor
            })
        }
    }), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        loadFromDatalessJSON: function(t, e, i) {
            return this.loadFromJSON(t, e, i)
        },
        loadFromJSON: function(t, e, i) {
            if (t) {
                var r = "string" == typeof t ? JSON.parse(t) : fabric.util.object.clone(t);
                this.clear();
                var n = this;
                return this._enlivenObjects(r.objects, function() {
                    n._setBgOverlay(r, function() {
                        delete r.objects, delete r.backgroundImage, delete r.overlayImage, delete r.background, delete r.overlay;
                        for (var t in r) n[t] = r[t];
                        e && e()
                    })
                }, i), this
            }
        },
        _setBgOverlay: function(t, e) {
            var i = this,
                r = {
                    backgroundColor: !1,
                    overlayColor: !1,
                    backgroundImage: !1,
                    overlayImage: !1
                };
            if (!(t.backgroundImage || t.overlayImage || t.background || t.overlay)) return void(e && e());
            var n = function() {
                r.backgroundImage && r.overlayImage && r.backgroundColor && r.overlayColor && (i.renderAll(), e && e())
            };
            this.__setBgOverlay("backgroundImage", t.backgroundImage, r, n), this.__setBgOverlay("overlayImage", t.overlayImage, r, n), this.__setBgOverlay("backgroundColor", t.background, r, n), this.__setBgOverlay("overlayColor", t.overlay, r, n), n()
        },
        __setBgOverlay: function(t, e, i, r) {
            var n = this;
            return e ? void("backgroundImage" === t || "overlayImage" === t ? fabric.Image.fromObject(e, function(e) {
                n[t] = e, i[t] = !0, r && r()
            }) : this["set" + fabric.util.string.capitalize(t, !0)](e, function() {
                i[t] = !0, r && r()
            })) : void(i[t] = !0)
        },
        _enlivenObjects: function(t, e, i) {
            var r = this;
            if (!t || 0 === t.length) return void(e && e());
            var n = this.renderOnAddRemove;
            this.renderOnAddRemove = !1, fabric.util.enlivenObjects(t, function(t) {
                t.forEach(function(t, e) {
                    r.insertAt(t, e)
                }), r.renderOnAddRemove = n, e && e()
            }, null, i)
        },
        _toDataURL: function(t, e) {
            this.clone(function(i) {
                e(i.toDataURL(t))
            })
        },
        _toDataURLWithMultiplier: function(t, e, i) {
            this.clone(function(r) {
                i(r.toDataURLWithMultiplier(t, e))
            })
        },
        clone: function(t, e) {
            var i = JSON.stringify(this.toJSON(e));
            this.cloneWithoutData(function(e) {
                e.loadFromJSON(i, function() {
                    t && t(e)
                })
            })
        },
        cloneWithoutData: function(t) {
            var e = fabric.document.createElement("canvas");
            e.width = this.getWidth(), e.height = this.getHeight();
            var i = new fabric.Canvas(e);
            i.clipTo = this.clipTo, this.backgroundImage ? (i.setBackgroundImage(this.backgroundImage.src, function() {
                i.renderAll(), t && t(i)
            }), i.backgroundImageOpacity = this.backgroundImageOpacity, i.backgroundImageStretch = this.backgroundImageStretch) : t && t(i)
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.toFixed,
            n = e.util.string.capitalize,
            s = e.util.degreesToRadians,
            o = e.StaticCanvas.supports("setLineDash");
        e.Object || (e.Object = e.util.createClass({
            type: "object",
            originX: "left",
            originY: "top",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            scaleX: 1,
            scaleY: 1,
            flipX: !1,
            flipY: !1,
            opacity: 1,
            angle: 0,
            skewX: 0,
            skewY: 0,
            cornerSize: 13,
            transparentCorners: !0,
            hoverCursor: null,
            moveCursor: null,
            padding: 0,
            borderColor: "rgba(102,153,255,0.75)",
            borderDashArray: null,
            cornerColor: "rgba(102,153,255,0.5)",
            cornerStrokeColor: null,
            cornerStyle: "rect",
            cornerDashArray: null,
            centeredScaling: !1,
            centeredRotation: !0,
            fill: "rgb(0,0,0)",
            fillRule: "nonzero",
            globalCompositeOperation: "source-over",
            backgroundColor: "",
            selectionBackgroundColor: "",
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeLineJoin: "miter",
            strokeMiterLimit: 10,
            shadow: null,
            borderOpacityWhenMoving: .4,
            borderScaleFactor: 1,
            transformMatrix: null,
            minScaleLimit: .01,
            selectable: !0,
            evented: !0,
            visible: !0,
            hasControls: !0,
            hasBorders: !0,
            hasRotatingPoint: !0,
            rotatingPointOffset: 40,
            perPixelTargetFind: !1,
            includeDefaultValues: !0,
            clipTo: null,
            lockMovementX: !1,
            lockMovementY: !1,
            lockRotation: !1,
            lockScalingX: !1,
            lockScalingY: !1,
            lockUniScaling: !1,
            lockSkewingX: !1,
            lockSkewingY: !1,
            lockScalingFlip: !1,
            excludeFromExport: !1,
            stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule globalCompositeOperation shadow clipTo visible backgroundColor alignX alignY meetOrSlice skewX skewY".split(" "),
            initialize: function(t) {
                t && this.setOptions(t)
            },
            _initGradient: function(t) {
                !t.fill || !t.fill.colorStops || t.fill instanceof e.Gradient || this.set("fill", new e.Gradient(t.fill)), !t.stroke || !t.stroke.colorStops || t.stroke instanceof e.Gradient || this.set("stroke", new e.Gradient(t.stroke))
            },
            _initPattern: function(t) {
                !t.fill || !t.fill.source || t.fill instanceof e.Pattern || this.set("fill", new e.Pattern(t.fill)), !t.stroke || !t.stroke.source || t.stroke instanceof e.Pattern || this.set("stroke", new e.Pattern(t.stroke))
            },
            _initClipping: function(t) {
                if (t.clipTo && "string" == typeof t.clipTo) {
                    var i = e.util.getFunctionBody(t.clipTo);
                    "undefined" != typeof i && (this.clipTo = new Function("ctx", i))
                }
            },
            setOptions: function(t) {
                for (var e in t) this.set(e, t[e]);
                this._initGradient(t), this._initPattern(t), this._initClipping(t)
            },
            transform: function(t, e) {
                this.group && !this.group._transformDone && this.group === this.canvas._activeGroup && this.group.transform(t);
                var i = e ? this._getLeftTopCoords() : this.getCenterPoint();
                t.translate(i.x, i.y), t.rotate(s(this.angle)), t.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1)), t.transform(1, 0, Math.tan(s(this.skewX)), 1, 0, 0), t.transform(1, Math.tan(s(this.skewY)), 0, 1, 0, 0)
            },
            toObject: function(t) {
                var i = e.Object.NUM_FRACTION_DIGITS,
                    n = {
                        type: this.type,
                        originX: this.originX,
                        originY: this.originY,
                        left: r(this.left, i),
                        top: r(this.top, i),
                        width: r(this.width, i),
                        height: r(this.height, i),
                        fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                        stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                        strokeWidth: r(this.strokeWidth, i),
                        strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                        strokeLineCap: this.strokeLineCap,
                        strokeLineJoin: this.strokeLineJoin,
                        strokeMiterLimit: r(this.strokeMiterLimit, i),
                        scaleX: r(this.scaleX, i),
                        scaleY: r(this.scaleY, i),
                        angle: r(this.getAngle(), i),
                        flipX: this.flipX,
                        flipY: this.flipY,
                        opacity: r(this.opacity, i),
                        shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                        visible: this.visible,
                        clipTo: this.clipTo && String(this.clipTo),
                        backgroundColor: this.backgroundColor,
                        fillRule: this.fillRule,
                        globalCompositeOperation: this.globalCompositeOperation,
                        transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : this.transformMatrix,
                        skewX: r(this.skewX, i),
                        skewY: r(this.skewY, i)
                    };
                return this.includeDefaultValues || (n = this._removeDefaultValues(n)), e.util.populateWithProperties(this, n, t), n
            },
            toDatalessObject: function(t) {
                return this.toObject(t)
            },
            _removeDefaultValues: function(t) {
                var i = e.util.getKlass(t.type).prototype,
                    r = i.stateProperties;
                return r.forEach(function(e) {
                    t[e] === i[e] && delete t[e];
                    var r = "[object Array]" === Object.prototype.toString.call(t[e]) && "[object Array]" === Object.prototype.toString.call(i[e]);
                    r && 0 === t[e].length && 0 === i[e].length && delete t[e]
                }), t
            },
            toString: function() {
                return "#<fabric." + n(this.type) + ">"
            },
            get: function(t) {
                return this[t]
            },
            getObjectScaling: function() {
                var t = this.scaleX,
                    e = this.scaleY;
                if (this.group) {
                    var i = this.group.getObjectScaling();
                    t *= i.scaleX, e *= i.scaleY
                }
                return {
                    scaleX: t,
                    scaleY: e
                }
            },
            _setObject: function(t) {
                for (var e in t) this._set(e, t[e])
            },
            set: function(t, e) {
                return "object" == typeof t ? this._setObject(t) : "function" == typeof e && "clipTo" !== t ? this._set(t, e(this.get(t))) : this._set(t, e), this
            },
            _set: function(t, i) {
                var r = "scaleX" === t || "scaleY" === t;
                return r && (i = this._constrainScale(i)), "scaleX" === t && i < 0 ? (this.flipX = !this.flipX, i *= -1) : "scaleY" === t && i < 0 ? (this.flipY = !this.flipY, i *= -1) : "shadow" !== t || !i || i instanceof e.Shadow || (i = new e.Shadow(i)), this[t] = i, "width" !== t && "height" !== t || (this.minScaleLimit = Math.min(.1, 1 / Math.max(this.width, this.height))), this
            },
            setOnGroup: function() {},
            toggle: function(t) {
                var e = this.get(t);
                return "boolean" == typeof e && this.set(t, !e), this
            },
            setSourcePath: function(t) {
                return this.sourcePath = t, this
            },
            getViewportTransform: function() {
                return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform : [1, 0, 0, 1, 0, 0]
            },
            render: function(t, i) {
                0 === this.width && 0 === this.height || !this.visible || (t.save(), this._setupCompositeOperation(t), this.drawSelectionBackground(t), i || this.transform(t), this._setStrokeStyles(t), this._setFillStyles(t), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this._setOpacity(t), this._setShadow(t), this.clipTo && e.util.clipContext(this, t), this._render(t, i), this.clipTo && t.restore(), t.restore())
            },
            _setOpacity: function(t) {
                this.group && this.group._setOpacity(t), t.globalAlpha *= this.opacity
            },
            _setStrokeStyles: function(t) {
                this.stroke && (t.lineWidth = this.strokeWidth, t.lineCap = this.strokeLineCap, t.lineJoin = this.strokeLineJoin, t.miterLimit = this.strokeMiterLimit, t.strokeStyle = this.stroke.toLive ? this.stroke.toLive(t, this) : this.stroke)
            },
            _setFillStyles: function(t) {
                this.fill && (t.fillStyle = this.fill.toLive ? this.fill.toLive(t, this) : this.fill)
            },
            _setLineDash: function(t, e, i) {
                e && (1 & e.length && e.push.apply(e, e), o ? t.setLineDash(e) : i && i(t))
            },
            _renderControls: function(t, i) {
                if (!(!this.active || i || this.group && this.group !== this.canvas.getActiveGroup())) {
                    var r, n = this.getViewportTransform(),
                        o = this.calcTransformMatrix();
                    o = e.util.multiplyTransformMatrices(n, o), r = e.util.qrDecompose(o), t.save(), t.translate(r.translateX, r.translateY), t.lineWidth = 1 * this.borderScaleFactor, t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, this.group && this.group === this.canvas.getActiveGroup() ? (t.rotate(s(r.angle)), this.drawBordersInGroup(t, r)) : (t.rotate(s(this.angle)), this.drawBorders(t)), this.drawControls(t), t.restore()
                }
            },
            _setShadow: function(t) {
                if (this.shadow) {
                    var i = this.canvas && this.canvas.viewportTransform[0] || 1,
                        r = this.canvas && this.canvas.viewportTransform[3] || 1,
                        n = this.getObjectScaling();
                    this.canvas && this.canvas._isRetinaScaling() && (i *= e.devicePixelRatio, r *= e.devicePixelRatio), t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * (i + r) * (n.scaleX + n.scaleY) / 4, t.shadowOffsetX = this.shadow.offsetX * i * n.scaleX, t.shadowOffsetY = this.shadow.offsetY * r * n.scaleY
                }
            },
            _removeShadow: function(t) {
                this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
            },
            _renderFill: function(t) {
                if (this.fill) {
                    if (t.save(), this.fill.gradientTransform) {
                        var e = this.fill.gradientTransform;
                        t.transform.apply(t, e)
                    }
                    this.fill.toLive && t.translate(-this.width / 2 + this.fill.offsetX || 0, -this.height / 2 + this.fill.offsetY || 0), "evenodd" === this.fillRule ? t.fill("evenodd") : t.fill(), t.restore()
                }
            },
            _renderStroke: function(t) {
                if (this.stroke && 0 !== this.strokeWidth) {
                    if (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray, this._renderDashedStroke), this.stroke.gradientTransform) {
                        var e = this.stroke.gradientTransform;
                        t.transform.apply(t, e)
                    }
                    this.stroke.toLive && t.translate(-this.width / 2 + this.stroke.offsetX || 0, -this.height / 2 + this.stroke.offsetY || 0), t.stroke(), t.restore()
                }
            },
            clone: function(t, i) {
                return this.constructor.fromObject ? this.constructor.fromObject(this.toObject(i), t) : new e.Object(this.toObject(i))
            },
            cloneAsImage: function(t, i) {
                var r = this.toDataURL(i);
                return e.util.loadImage(r, function(i) {
                    t && t(new e.Image(i))
                }), this
            },
            toDataURL: function(t) {
                t || (t = {});
                var i = e.util.createCanvasElement(),
                    r = this.getBoundingRect();
                i.width = r.width, i.height = r.height, e.util.wrapElement(i, "div");
                var n = new e.StaticCanvas(i, {
                    enableRetinaScaling: t.enableRetinaScaling
                });
                "jpg" === t.format && (t.format = "jpeg"), "jpeg" === t.format && (n.backgroundColor = "#fff");
                var s = {
                    active: this.get("active"),
                    left: this.getLeft(),
                    top: this.getTop()
                };
                this.set("active", !1), this.setPositionByOrigin(new e.Point(n.getWidth() / 2, n.getHeight() / 2), "center", "center");
                var o = this.canvas;
                n.add(this);
                var a = n.toDataURL(t);
                return this.set(s).setCoords(), this.canvas = o, n.dispose(), n = null, a
            },
            isType: function(t) {
                return this.type === t
            },
            complexity: function() {
                return 0
            },
            toJSON: function(t) {
                return this.toObject(t)
            },
            setGradient: function(t, i) {
                i || (i = {});
                var r = {
                    colorStops: []
                };
                r.type = i.type || (i.r1 || i.r2 ? "radial" : "linear"), r.coords = {
                    x1: i.x1,
                    y1: i.y1,
                    x2: i.x2,
                    y2: i.y2
                }, (i.r1 || i.r2) && (r.coords.r1 = i.r1, r.coords.r2 = i.r2), i.gradientTransform && (r.gradientTransform = i.gradientTransform);
                for (var n in i.colorStops) {
                    var s = new e.Color(i.colorStops[n]);
                    r.colorStops.push({
                        offset: n,
                        color: s.toRgb(),
                        opacity: s.getAlpha()
                    })
                }
                return this.set(t, e.Gradient.forObject(this, r))
            },
            setPatternFill: function(t) {
                return this.set("fill", new e.Pattern(t))
            },
            setShadow: function(t) {
                return this.set("shadow", t ? new e.Shadow(t) : null)
            },
            setColor: function(t) {
                return this.set("fill", t), this
            },
            setAngle: function(t) {
                var e = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation;
                return e && this._setOriginToCenter(), this.set("angle", t), e && this._resetOrigin(), this
            },
            centerH: function() {
                return this.canvas && this.canvas.centerObjectH(this), this
            },
            viewportCenterH: function() {
                return this.canvas && this.canvas.viewportCenterObjectH(this), this
            },
            centerV: function() {
                return this.canvas && this.canvas.centerObjectV(this), this
            },
            viewportCenterV: function() {
                return this.canvas && this.canvas.viewportCenterObjectV(this), this
            },
            center: function() {
                return this.canvas && this.canvas.centerObject(this), this
            },
            viewportCenter: function() {
                return this.canvas && this.canvas.viewportCenterObject(this), this
            },
            remove: function() {
                return this.canvas && this.canvas.remove(this), this
            },
            getLocalPointer: function(t, i) {
                i = i || this.canvas.getPointer(t);
                var r = new e.Point(i.x, i.y),
                    n = this._getLeftTopCoords();
                return this.angle && (r = e.util.rotatePoint(r, n, e.util.degreesToRadians(-this.angle))), {
                    x: r.x - n.x,
                    y: r.y - n.y
                }
            },
            _setupCompositeOperation: function(t) {
                this.globalCompositeOperation && (t.globalCompositeOperation = this.globalCompositeOperation)
            }
        }), e.util.createAccessors(e.Object), e.Object.prototype.rotate = e.Object.prototype.setAngle, i(e.Object.prototype, e.Observable), e.Object.NUM_FRACTION_DIGITS = 2, e.Object.__uid = 0)
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.util.degreesToRadians,
            e = {
                left: -.5,
                center: 0,
                right: .5
            },
            i = {
                top: -.5,
                center: 0,
                bottom: .5
            };
        fabric.util.object.extend(fabric.Object.prototype, {
            translateToGivenOrigin: function(t, r, n, s, o) {
                var a, h, c, l = t.x,
                    u = t.y;
                return "string" == typeof r ? r = e[r] : r -= .5, "string" == typeof s ? s = e[s] : s -= .5, a = s - r, "string" == typeof n ? n = i[n] : n -= .5, "string" == typeof o ? o = i[o] : o -= .5, h = o - n, (a || h) && (c = this._getTransformedDimensions(), l = t.x + a * c.x, u = t.y + h * c.y), new fabric.Point(l, u)
            },
            translateToCenterPoint: function(e, i, r) {
                var n = this.translateToGivenOrigin(e, i, r, "center", "center");
                return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n
            },
            translateToOriginPoint: function(e, i, r) {
                var n = this.translateToGivenOrigin(e, "center", "center", i, r);
                return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n
            },
            getCenterPoint: function() {
                var t = new fabric.Point(this.left, this.top);
                return this.translateToCenterPoint(t, this.originX, this.originY)
            },
            getPointByOrigin: function(t, e) {
                var i = this.getCenterPoint();
                return this.translateToOriginPoint(i, t, e)
            },
            toLocalPoint: function(e, i, r) {
                var n, s, o = this.getCenterPoint();
                return n = "undefined" != typeof i && "undefined" != typeof r ? this.translateToGivenOrigin(o, "center", "center", i, r) : new fabric.Point(this.left, this.top), s = new fabric.Point(e.x, e.y), this.angle && (s = fabric.util.rotatePoint(s, o, -t(this.angle))), s.subtractEquals(n)
            },
            setPositionByOrigin: function(t, e, i) {
                var r = this.translateToCenterPoint(t, e, i),
                    n = this.translateToOriginPoint(r, this.originX, this.originY);
                this.set("left", n.x), this.set("top", n.y)
            },
            adjustPosition: function(i) {
                var r, n, s = t(this.angle),
                    o = this.getWidth(),
                    a = Math.cos(s) * o,
                    h = Math.sin(s) * o;
                r = "string" == typeof this.originX ? e[this.originX] : this.originX - .5, n = "string" == typeof i ? e[i] : i - .5, this.left += a * (n - r), this.top += h * (n - r), this.setCoords(), this.originX = i
            },
            _setOriginToCenter: function() {
                this._originalOriginX = this.originX, this._originalOriginY = this.originY;
                var t = this.getCenterPoint();
                this.originX = "center", this.originY = "center", this.left = t.x, this.top = t.y
            },
            _resetOrigin: function() {
                var t = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
                this.originX = this._originalOriginX, this.originY = this._originalOriginY, this.left = t.x, this.top = t.y, this._originalOriginX = null, this._originalOriginY = null
            },
            _getLeftTopCoords: function() {
                return this.translateToOriginPoint(this.getCenterPoint(), "left", "top")
            }
        })
    }(),
    function() {
        function t(t) {
            return [new fabric.Point(t.tl.x, t.tl.y), new fabric.Point(t.tr.x, t.tr.y), new fabric.Point(t.br.x, t.br.y), new fabric.Point(t.bl.x, t.bl.y)]
        }
        var e = fabric.util.degreesToRadians,
            i = fabric.util.multiplyTransformMatrices;
        fabric.util.object.extend(fabric.Object.prototype, {
            oCoords: null,
            intersectsWithRect: function(e, i) {
                var r = t(this.oCoords),
                    n = fabric.Intersection.intersectPolygonRectangle(r, e, i);
                return "Intersection" === n.status
            },
            intersectsWithObject: function(e) {
                var i = fabric.Intersection.intersectPolygonPolygon(t(this.oCoords), t(e.oCoords));
                return "Intersection" === i.status
            },
            isContainedWithinObject: function(t) {
                var e = t.getBoundingRect(),
                    i = new fabric.Point(e.left, e.top),
                    r = new fabric.Point(e.left + e.width, e.top + e.height);
                return this.isContainedWithinRect(i, r)
            },
            isContainedWithinRect: function(t, e) {
                var i = this.getBoundingRect();
                return i.left >= t.x && i.left + i.width <= e.x && i.top >= t.y && i.top + i.height <= e.y
            },
            containsPoint: function(t) {
                this.oCoords || this.setCoords();
                var e = this._getImageLines(this.oCoords),
                    i = this._findCrossPoints(t, e);
                return 0 !== i && i % 2 === 1
            },
            _getImageLines: function(t) {
                return {
                    topline: {
                        o: t.tl,
                        d: t.tr
                    },
                    rightline: {
                        o: t.tr,
                        d: t.br
                    },
                    bottomline: {
                        o: t.br,
                        d: t.bl
                    },
                    leftline: {
                        o: t.bl,
                        d: t.tl
                    }
                }
            },
            _findCrossPoints: function(t, e) {
                var i, r, n, s, o, a, h, c = 0;
                for (var l in e)
                    if (h = e[l], !(h.o.y < t.y && h.d.y < t.y || h.o.y >= t.y && h.d.y >= t.y || (h.o.x === h.d.x && h.o.x >= t.x ? (o = h.o.x, a = t.y) : (i = 0, r = (h.d.y - h.o.y) / (h.d.x - h.o.x), n = t.y - i * t.x, s = h.o.y - r * h.o.x, o = -(n - s) / (i - r), a = n + i * o), o >= t.x && (c += 1), 2 !== c))) break;
                return c
            },
            getBoundingRectWidth: function() {
                return this.getBoundingRect().width
            },
            getBoundingRectHeight: function() {
                return this.getBoundingRect().height
            },
            getBoundingRect: function() {
                return this.oCoords || this.setCoords(), fabric.util.makeBoundingBoxFromPoints([this.oCoords.tl, this.oCoords.tr, this.oCoords.br, this.oCoords.bl])
            },
            getWidth: function() {
                return this._getTransformedDimensions().x
            },
            getHeight: function() {
                return this._getTransformedDimensions().y
            },
            _constrainScale: function(t) {
                return Math.abs(t) < this.minScaleLimit ? t < 0 ? -this.minScaleLimit : this.minScaleLimit : t
            },
            scale: function(t) {
                return t = this._constrainScale(t), t < 0 && (this.flipX = !this.flipX, this.flipY = !this.flipY, t *= -1), this.scaleX = t, this.scaleY = t, this.setCoords(), this
            },
            scaleToWidth: function(t) {
                var e = this.getBoundingRect().width / this.getWidth();
                return this.scale(t / this.width / e)
            },
            scaleToHeight: function(t) {
                var e = this.getBoundingRect().height / this.getHeight();
                return this.scale(t / this.height / e)
            },
            setCoords: function() {
                var t = e(this.angle),
                    i = this.getViewportTransform(),
                    r = this._calculateCurrentDimensions(),
                    n = r.x,
                    s = r.y;
                n < 0 && (n = Math.abs(n));
                var o = Math.sin(t),
                    a = Math.cos(t),
                    h = n > 0 ? Math.atan(s / n) : 0,
                    c = n / Math.cos(h) / 2,
                    l = Math.cos(h + t) * c,
                    u = Math.sin(h + t) * c,
                    f = fabric.util.transformPoint(this.getCenterPoint(), i),
                    d = new fabric.Point(f.x - l, f.y - u),
                    g = new fabric.Point(d.x + n * a, d.y + n * o),
                    p = new fabric.Point(d.x - s * o, d.y + s * a),
                    v = new fabric.Point(f.x + l, f.y + u),
                    b = new fabric.Point((d.x + p.x) / 2, (d.y + p.y) / 2),
                    m = new fabric.Point((g.x + d.x) / 2, (g.y + d.y) / 2),
                    y = new fabric.Point((v.x + g.x) / 2, (v.y + g.y) / 2),
                    _ = new fabric.Point((v.x + p.x) / 2, (v.y + p.y) / 2),
                    x = new fabric.Point(m.x + o * this.rotatingPointOffset, m.y - a * this.rotatingPointOffset);
                return this.oCoords = {
                    tl: d,
                    tr: g,
                    br: v,
                    bl: p,
                    ml: b,
                    mt: m,
                    mr: y,
                    mb: _,
                    mtr: x
                }, this._setCornerCoords && this._setCornerCoords(), this
            },
            _calcRotateMatrix: function() {
                if (this.angle) {
                    var t = e(this.angle),
                        i = Math.cos(t),
                        r = Math.sin(t);
                    return [i, r, -r, i, 0, 0]
                }
                return [1, 0, 0, 1, 0, 0]
            },
            calcTransformMatrix: function() {
                var t = this.getCenterPoint(),
                    e = [1, 0, 0, 1, t.x, t.y],
                    r = this._calcRotateMatrix(),
                    n = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, !0),
                    s = this.group ? this.group.calcTransformMatrix() : [1, 0, 0, 1, 0, 0];
                return s = i(s, e), s = i(s, r), s = i(s, n)
            },
            _calcDimensionsTransformMatrix: function(t, r, n) {
                var s = [1, 0, Math.tan(e(t)), 1],
                    o = [1, Math.tan(e(r)), 0, 1],
                    a = this.scaleX * (n && this.flipX ? -1 : 1),
                    h = this.scaleY * (n && this.flipY ? -1 : 1),
                    c = [a, 0, 0, h],
                    l = i(c, s, !0);
                return i(l, o, !0)
            }
        })
    }(), fabric.util.object.extend(fabric.Object.prototype, {
        sendToBack: function() {
            return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this), this
        },
        bringToFront: function() {
            return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this),
                this
        },
        sendBackwards: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t) : this.canvas.sendBackwards(this, t), this
        },
        bringForward: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t) : this.canvas.bringForward(this, t), this
        },
        moveTo: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t) : this.canvas.moveTo(this, t), this
        }
    }),
    function() {
        function t(t, e) {
            if (e) {
                if (e.toLive) return t + ": url(#SVGID_" + e.id + "); ";
                var i = new fabric.Color(e),
                    r = t + ": " + i.toRgb() + "; ",
                    n = i.getAlpha();
                return 1 !== n && (r += t + "-opacity: " + n.toString() + "; "), r
            }
            return t + ": none; "
        }
        fabric.util.object.extend(fabric.Object.prototype, {
            getSvgStyles: function(e) {
                var i = this.fillRule,
                    r = this.strokeWidth ? this.strokeWidth : "0",
                    n = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none",
                    s = this.strokeLineCap ? this.strokeLineCap : "butt",
                    o = this.strokeLineJoin ? this.strokeLineJoin : "miter",
                    a = this.strokeMiterLimit ? this.strokeMiterLimit : "4",
                    h = "undefined" != typeof this.opacity ? this.opacity : "1",
                    c = this.visible ? "" : " visibility: hidden;",
                    l = e ? "" : this.getSvgFilter(),
                    u = t("fill", this.fill),
                    f = t("stroke", this.stroke);
                return [f, "stroke-width: ", r, "; ", "stroke-dasharray: ", n, "; ", "stroke-linecap: ", s, "; ", "stroke-linejoin: ", o, "; ", "stroke-miterlimit: ", a, "; ", u, "fill-rule: ", i, "; ", "opacity: ", h, ";", l, c].join("")
            },
            getSvgFilter: function() {
                return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : ""
            },
            getSvgId: function() {
                return this.id ? 'id="' + this.id + '" ' : ""
            },
            getSvgTransform: function() {
                if (this.group && "path-group" === this.group.type) return "";
                var t = fabric.util.toFixed,
                    e = this.getAngle(),
                    i = this.getSkewX() % 360,
                    r = this.getSkewY() % 360,
                    n = this.getCenterPoint(),
                    s = fabric.Object.NUM_FRACTION_DIGITS,
                    o = "path-group" === this.type ? "" : "translate(" + t(n.x, s) + " " + t(n.y, s) + ")",
                    a = 0 !== e ? " rotate(" + t(e, s) + ")" : "",
                    h = 1 === this.scaleX && 1 === this.scaleY ? "" : " scale(" + t(this.scaleX, s) + " " + t(this.scaleY, s) + ")",
                    c = 0 !== i ? " skewX(" + t(i, s) + ")" : "",
                    l = 0 !== r ? " skewY(" + t(r, s) + ")" : "",
                    u = "path-group" === this.type ? this.width : 0,
                    f = this.flipX ? " matrix(-1 0 0 1 " + u + " 0) " : "",
                    d = "path-group" === this.type ? this.height : 0,
                    g = this.flipY ? " matrix(1 0 0 -1 0 " + d + ")" : "";
                return [o, a, h, f, g, c, l].join("")
            },
            getSvgTransformMatrix: function() {
                return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ") " : ""
            },
            _createBaseSVGMarkup: function() {
                var t = [];
                return this.fill && this.fill.toLive && t.push(this.fill.toSVG(this, !1)), this.stroke && this.stroke.toLive && t.push(this.stroke.toSVG(this, !1)), this.shadow && t.push(this.shadow.toSVG(this)), t
            }
        })
    }(), fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function() {
            return this.stateProperties.some(function(t) {
                return this.get(t) !== this.originalState[t]
            }, this)
        },
        saveState: function(t) {
            return this.stateProperties.forEach(function(t) {
                this.originalState[t] = this.get(t)
            }, this), t && t.stateProperties && t.stateProperties.forEach(function(t) {
                this.originalState[t] = this.get(t)
            }, this), this
        },
        setupState: function() {
            return this.originalState = {}, this.saveState(), this
        }
    }),
    function() {
        var t = fabric.util.degreesToRadians,
            e = function() {
                return "undefined" != typeof G_vmlCanvasManager
            };
        fabric.util.object.extend(fabric.Object.prototype, {
            _controlsVisibility: null,
            _findTargetCorner: function(t) {
                if (!this.hasControls || !this.active) return !1;
                var e, i, r = t.x,
                    n = t.y;
                this.__corner = 0;
                for (var s in this.oCoords)
                    if (this.isControlVisible(s) && ("mtr" !== s || this.hasRotatingPoint) && (!this.get("lockUniScaling") || "mt" !== s && "mr" !== s && "mb" !== s && "ml" !== s) && (i = this._getImageLines(this.oCoords[s].corner), e = this._findCrossPoints({
                            x: r,
                            y: n
                        }, i), 0 !== e && e % 2 === 1)) return this.__corner = s, s;
                return !1
            },
            _setCornerCoords: function() {
                var e, i, r = this.oCoords,
                    n = t(45 - this.angle),
                    s = .707106 * this.cornerSize,
                    o = s * Math.cos(n),
                    a = s * Math.sin(n);
                for (var h in r) e = r[h].x, i = r[h].y, r[h].corner = {
                    tl: {
                        x: e - a,
                        y: i - o
                    },
                    tr: {
                        x: e + o,
                        y: i - a
                    },
                    bl: {
                        x: e - o,
                        y: i + a
                    },
                    br: {
                        x: e + a,
                        y: i + o
                    }
                }
            },
            _getNonTransformedDimensions: function() {
                var t = this.strokeWidth,
                    e = this.width,
                    i = this.height,
                    r = !0,
                    n = !0;
                return "line" === this.type && "butt" === this.strokeLineCap && (n = e, r = i), n && (i += i < 0 ? -t : t), r && (e += e < 0 ? -t : t), {
                    x: e,
                    y: i
                }
            },
            _getTransformedDimensions: function(t, e) {
                "undefined" == typeof t && (t = this.skewX), "undefined" == typeof e && (e = this.skewY);
                var i, r, n = this._getNonTransformedDimensions(),
                    s = n.x / 2,
                    o = n.y / 2,
                    a = [{
                        x: -s,
                        y: -o
                    }, {
                        x: s,
                        y: -o
                    }, {
                        x: -s,
                        y: o
                    }, {
                        x: s,
                        y: o
                    }],
                    h = this._calcDimensionsTransformMatrix(t, e, !1);
                for (i = 0; i < a.length; i++) a[i] = fabric.util.transformPoint(a[i], h);
                return r = fabric.util.makeBoundingBoxFromPoints(a), {
                    x: r.width,
                    y: r.height
                }
            },
            _calculateCurrentDimensions: function() {
                var t = this.getViewportTransform(),
                    e = this._getTransformedDimensions(),
                    i = e.x,
                    r = e.y,
                    n = fabric.util.transformPoint(new fabric.Point(i, r), t, !0);
                return n.scalarAdd(2 * this.padding)
            },
            drawSelectionBackground: function(e) {
                if (!this.selectionBackgroundColor || this.group || this !== this.canvas.getActiveObject()) return this;
                e.save();
                var i = this.getCenterPoint(),
                    r = this._calculateCurrentDimensions(),
                    n = this.canvas.viewportTransform;
                return e.translate(i.x, i.y), e.scale(1 / n[0], 1 / n[3]), e.rotate(t(this.angle)), e.fillStyle = this.selectionBackgroundColor, e.fillRect(-r.x / 2, -r.y / 2, r.x, r.y), e.restore(), this
            },
            drawBorders: function(t) {
                if (!this.hasBorders) return this;
                var e = this._calculateCurrentDimensions(),
                    i = 1 / this.borderScaleFactor,
                    r = e.x + i,
                    n = e.y + i;
                if (t.save(), t.strokeStyle = this.borderColor, this._setLineDash(t, this.borderDashArray, null), t.strokeRect(-r / 2, -n / 2, r, n), this.hasRotatingPoint && this.isControlVisible("mtr") && !this.get("lockRotation") && this.hasControls) {
                    var s = -n / 2;
                    t.beginPath(), t.moveTo(0, s), t.lineTo(0, s - this.rotatingPointOffset), t.closePath(), t.stroke()
                }
                return t.restore(), this
            },
            drawBordersInGroup: function(t, e) {
                if (!this.hasBorders) return this;
                var i = this._getNonTransformedDimensions(),
                    r = fabric.util.customTransformMatrix(e.scaleX, e.scaleY, e.skewX),
                    n = fabric.util.transformPoint(i, r),
                    s = 1 / this.borderScaleFactor,
                    o = n.x + s + 2 * this.padding,
                    a = n.y + s + 2 * this.padding;
                return t.save(), this._setLineDash(t, this.borderDashArray, null), t.strokeStyle = this.borderColor, t.strokeRect(-o / 2, -a / 2, o, a), t.restore(), this
            },
            drawControls: function(t) {
                if (!this.hasControls) return this;
                var e = this._calculateCurrentDimensions(),
                    i = e.x,
                    r = e.y,
                    n = this.cornerSize,
                    s = -(i + n) / 2,
                    o = -(r + n) / 2,
                    a = this.transparentCorners ? "stroke" : "fill";
                return t.save(), t.strokeStyle = t.fillStyle = this.cornerColor, this.transparentCorners || (t.strokeStyle = this.cornerStrokeColor), this._setLineDash(t, this.cornerDashArray, null), this._drawControl("tl", t, a, s, o), this._drawControl("tr", t, a, s + i, o), this._drawControl("bl", t, a, s, o + r), this._drawControl("br", t, a, s + i, o + r), this.get("lockUniScaling") || (this._drawControl("mt", t, a, s + i / 2, o), this._drawControl("mb", t, a, s + i / 2, o + r), this._drawControl("mr", t, a, s + i, o + r / 2), this._drawControl("ml", t, a, s, o + r / 2)), this.hasRotatingPoint && this._drawControl("mtr", t, a, s + i / 2, o - this.rotatingPointOffset), t.restore(), this
            },
            _drawControl: function(t, i, r, n, s) {
                if (this.isControlVisible(t)) {
                    var o = this.cornerSize,
                        a = !this.transparentCorners && this.cornerStrokeColor;
                    switch (this.cornerStyle) {
                        case "circle":
                            i.beginPath(), i.arc(n + o / 2, s + o / 2, o / 2, 0, 2 * Math.PI, !1), i[r](), a && i.stroke();
                            break;
                        default:
                            e() || this.transparentCorners || i.clearRect(n, s, o, o), i[r + "Rect"](n, s, o, o), a && i.strokeRect(n, s, o, o)
                    }
                }
            },
            isControlVisible: function(t) {
                return this._getControlsVisibility()[t]
            },
            setControlVisible: function(t, e) {
                return this._getControlsVisibility()[t] = e, this
            },
            setControlsVisibility: function(t) {
                t || (t = {});
                for (var e in t) this.setControlVisible(e, t[e]);
                return this
            },
            _getControlsVisibility: function() {
                return this._controlsVisibility || (this._controlsVisibility = {
                    tl: !0,
                    tr: !0,
                    br: !0,
                    bl: !0,
                    ml: !0,
                    mt: !0,
                    mr: !0,
                    mb: !0,
                    mtr: !0
                }), this._controlsVisibility
            }
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        FX_DURATION: 500,
        fxCenterObjectH: function(t, e) {
            e = e || {};
            var i = function() {},
                r = e.onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("left"),
                endValue: this.getCenter().left,
                duration: this.FX_DURATION,
                onChange: function(e) {
                    t.set("left", e), s.renderAll(), n()
                },
                onComplete: function() {
                    t.setCoords(), r()
                }
            }), this
        },
        fxCenterObjectV: function(t, e) {
            e = e || {};
            var i = function() {},
                r = e.onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("top"),
                endValue: this.getCenter().top,
                duration: this.FX_DURATION,
                onChange: function(e) {
                    t.set("top", e), s.renderAll(), n()
                },
                onComplete: function() {
                    t.setCoords(), r()
                }
            }), this
        },
        fxRemove: function(t, e) {
            e = e || {};
            var i = function() {},
                r = e.onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("opacity"),
                endValue: 0,
                duration: this.FX_DURATION,
                onStart: function() {
                    t.set("active", !1)
                },
                onChange: function(e) {
                    t.set("opacity", e), s.renderAll(), n()
                },
                onComplete: function() {
                    s.remove(t), r()
                }
            }), this
        }
    }), fabric.util.object.extend(fabric.Object.prototype, {
        animate: function() {
            if (arguments[0] && "object" == typeof arguments[0]) {
                var t, e, i = [];
                for (t in arguments[0]) i.push(t);
                for (var r = 0, n = i.length; r < n; r++) t = i[r], e = r !== n - 1, this._animate(t, arguments[0][t], arguments[1], e)
            } else this._animate.apply(this, arguments);
            return this
        },
        _animate: function(t, e, i, r) {
            var n, s = this;
            e = e.toString(), i = i ? fabric.util.object.clone(i) : {}, ~t.indexOf(".") && (n = t.split("."));
            var o = n ? this.get(n[0])[n[1]] : this.get(t);
            "from" in i || (i.from = o), e = ~e.indexOf("=") ? o + parseFloat(e.replace("=", "")) : parseFloat(e), fabric.util.animate({
                startValue: i.from,
                endValue: e,
                byValue: i.by,
                easing: i.easing,
                duration: i.duration,
                abort: i.abort && function() {
                    return i.abort.call(s)
                },
                onChange: function(e) {
                    n ? s[n[0]][n[1]] = e : s.set(t, e), r || i.onChange && i.onChange()
                },
                onComplete: function() {
                    r || (s.setCoords(), i.onComplete && i.onComplete())
                }
            })
        }
    }),
    function(t) {
        "use strict";

        function e(t, e) {
            var i = t.origin,
                r = t.axis1,
                n = t.axis2,
                s = t.dimension,
                o = e.nearest,
                a = e.center,
                h = e.farthest;
            return function() {
                switch (this.get(i)) {
                    case o:
                        return Math.min(this.get(r), this.get(n));
                    case a:
                        return Math.min(this.get(r), this.get(n)) + .5 * this.get(s);
                    case h:
                        return Math.max(this.get(r), this.get(n))
                }
            }
        }
        var i = t.fabric || (t.fabric = {}),
            r = i.util.object.extend,
            n = {
                x1: 1,
                x2: 1,
                y1: 1,
                y2: 1
            },
            s = i.StaticCanvas.supports("setLineDash");
        return i.Line ? void i.warn("fabric.Line is already defined") : (i.Line = i.util.createClass(i.Object, {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            initialize: function(t, e) {
                e = e || {}, t || (t = [0, 0, 0, 0]), this.callSuper("initialize", e), this.set("x1", t[0]), this.set("y1", t[1]), this.set("x2", t[2]), this.set("y2", t[3]), this._setWidthHeight(e)
            },
            _setWidthHeight: function(t) {
                t || (t = {}), this.width = Math.abs(this.x2 - this.x1), this.height = Math.abs(this.y2 - this.y1), this.left = "left" in t ? t.left : this._getLeftToOriginX(), this.top = "top" in t ? t.top : this._getTopToOriginY()
            },
            _set: function(t, e) {
                return this.callSuper("_set", t, e), "undefined" != typeof n[t] && this._setWidthHeight(), this
            },
            _getLeftToOriginX: e({
                origin: "originX",
                axis1: "x1",
                axis2: "x2",
                dimension: "width"
            }, {
                nearest: "left",
                center: "center",
                farthest: "right"
            }),
            _getTopToOriginY: e({
                origin: "originY",
                axis1: "y1",
                axis2: "y2",
                dimension: "height"
            }, {
                nearest: "top",
                center: "center",
                farthest: "bottom"
            }),
            _render: function(t, e) {
                if (t.beginPath(), e) {
                    var i = this.getCenterPoint();
                    t.translate(i.x - this.strokeWidth / 2, i.y - this.strokeWidth / 2)
                }
                if (!this.strokeDashArray || this.strokeDashArray && s) {
                    var r = this.calcLinePoints();
                    t.moveTo(r.x1, r.y1), t.lineTo(r.x2, r.y2)
                }
                t.lineWidth = this.strokeWidth;
                var n = t.strokeStyle;
                t.strokeStyle = this.stroke || t.fillStyle, this.stroke && this._renderStroke(t), t.strokeStyle = n
            },
            _renderDashedStroke: function(t) {
                var e = this.calcLinePoints();
                t.beginPath(), i.util.drawDashedLine(t, e.x1, e.y1, e.x2, e.y2, this.strokeDashArray), t.closePath()
            },
            toObject: function(t) {
                return r(this.callSuper("toObject", t), this.calcLinePoints())
            },
            calcLinePoints: function() {
                var t = this.x1 <= this.x2 ? -1 : 1,
                    e = this.y1 <= this.y2 ? -1 : 1,
                    i = t * this.width * .5,
                    r = e * this.height * .5,
                    n = t * this.width * -.5,
                    s = e * this.height * -.5;
                return {
                    x1: i,
                    x2: n,
                    y1: r,
                    y2: s
                }
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = {
                        x1: this.x1,
                        x2: this.x2,
                        y1: this.y1,
                        y2: this.y2
                    };
                return this.group && "path-group" === this.group.type || (i = this.calcLinePoints()), e.push("<line ", this.getSvgId(), 'x1="', i.x1, '" y1="', i.y1, '" x2="', i.x2, '" y2="', i.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            },
            complexity: function() {
                return 1
            }
        }), i.Line.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")), i.Line.fromElement = function(t, e) {
            var n = i.parseAttributes(t, i.Line.ATTRIBUTE_NAMES),
                s = [n.x1 || 0, n.y1 || 0, n.x2 || 0, n.y2 || 0];
            return new i.Line(s, r(n, e))
        }, void(i.Line.fromObject = function(t) {
            var e = [t.x1, t.y1, t.x2, t.y2];
            return new i.Line(e, t)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";

        function e(t) {
            return "radius" in t && t.radius >= 0
        }
        var i = t.fabric || (t.fabric = {}),
            r = Math.PI,
            n = i.util.object.extend;
        return i.Circle ? void i.warn("fabric.Circle is already defined.") : (i.Circle = i.util.createClass(i.Object, {
            type: "circle",
            radius: 0,
            startAngle: 0,
            endAngle: 2 * r,
            initialize: function(t) {
                t = t || {}, this.callSuper("initialize", t), this.set("radius", t.radius || 0), this.startAngle = t.startAngle || this.startAngle, this.endAngle = t.endAngle || this.endAngle
            },
            _set: function(t, e) {
                return this.callSuper("_set", t, e), "radius" === t && this.setRadius(e), this
            },
            toObject: function(t) {
                return n(this.callSuper("toObject", t), {
                    radius: this.get("radius"),
                    startAngle: this.startAngle,
                    endAngle: this.endAngle
                })
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = 0,
                    n = 0,
                    s = (this.endAngle - this.startAngle) % (2 * r);
                if (0 === s) this.group && "path-group" === this.group.type && (i = this.left + this.radius, n = this.top + this.radius), e.push("<circle ", this.getSvgId(), 'cx="' + i + '" cy="' + n + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
                else {
                    var o = Math.cos(this.startAngle) * this.radius,
                        a = Math.sin(this.startAngle) * this.radius,
                        h = Math.cos(this.endAngle) * this.radius,
                        c = Math.sin(this.endAngle) * this.radius,
                        l = s > r ? "1" : "0";
                    e.push('<path d="M ' + o + " " + a, " A " + this.radius + " " + this.radius, " 0 ", +l + " 1", " " + h + " " + c, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n')
                }
                return t ? t(e.join("")) : e.join("")
            },
            _render: function(t, e) {
                t.beginPath(), t.arc(e ? this.left + this.radius : 0, e ? this.top + this.radius : 0, this.radius, this.startAngle, this.endAngle, !1), this._renderFill(t), this._renderStroke(t)
            },
            getRadiusX: function() {
                return this.get("radius") * this.get("scaleX")
            },
            getRadiusY: function() {
                return this.get("radius") * this.get("scaleY")
            },
            setRadius: function(t) {
                return this.radius = t, this.set("width", 2 * t).set("height", 2 * t)
            },
            complexity: function() {
                return 1
            }
        }), i.Circle.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")), i.Circle.fromElement = function(t, r) {
            r || (r = {});
            var s = i.parseAttributes(t, i.Circle.ATTRIBUTE_NAMES);
            if (!e(s)) throw new Error("value of `r` attribute is required and can not be negative");
            s.left = s.left || 0, s.top = s.top || 0;
            var o = new i.Circle(n(s, r));
            return o.left -= o.radius, o.top -= o.radius, o
        }, void(i.Circle.fromObject = function(t) {
            return new i.Circle(t)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        return e.Triangle ? void e.warn("fabric.Triangle is already defined") : (e.Triangle = e.util.createClass(e.Object, {
            type: "triangle",
            initialize: function(t) {
                t = t || {}, this.callSuper("initialize", t), this.set("width", t.width || 100).set("height", t.height || 100)
            },
            _render: function(t) {
                var e = this.width / 2,
                    i = this.height / 2;
                t.beginPath(), t.moveTo(-e, i), t.lineTo(0, -i), t.lineTo(e, i), t.closePath(), this._renderFill(t), this._renderStroke(t)
            },
            _renderDashedStroke: function(t) {
                var i = this.width / 2,
                    r = this.height / 2;
                t.beginPath(), e.util.drawDashedLine(t, -i, r, 0, -r, this.strokeDashArray), e.util.drawDashedLine(t, 0, -r, i, r, this.strokeDashArray), e.util.drawDashedLine(t, i, r, -i, r, this.strokeDashArray), t.closePath()
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = this.width / 2,
                    r = this.height / 2,
                    n = [-i + " " + r, "0 " + -r, i + " " + r].join(",");
                return e.push("<polygon ", this.getSvgId(), 'points="', n, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>'), t ? t(e.join("")) : e.join("")
            },
            complexity: function() {
                return 1
            }
        }), void(e.Triangle.fromObject = function(t) {
            return new e.Triangle(t)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = 2 * Math.PI,
            r = e.util.object.extend;
        return e.Ellipse ? void e.warn("fabric.Ellipse is already defined.") : (e.Ellipse = e.util.createClass(e.Object, {
            type: "ellipse",
            rx: 0,
            ry: 0,
            initialize: function(t) {
                t = t || {}, this.callSuper("initialize", t), this.set("rx", t.rx || 0), this.set("ry", t.ry || 0)
            },
            _set: function(t, e) {
                switch (this.callSuper("_set", t, e), t) {
                    case "rx":
                        this.rx = e, this.set("width", 2 * e);
                        break;
                    case "ry":
                        this.ry = e, this.set("height", 2 * e)
                }
                return this
            },
            getRx: function() {
                return this.get("rx") * this.get("scaleX")
            },
            getRy: function() {
                return this.get("ry") * this.get("scaleY")
            },
            toObject: function(t) {
                return r(this.callSuper("toObject", t), {
                    rx: this.get("rx"),
                    ry: this.get("ry")
                })
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = 0,
                    r = 0;
                return this.group && "path-group" === this.group.type && (i = this.left + this.rx, r = this.top + this.ry), e.push("<ellipse ", this.getSvgId(), 'cx="', i, '" cy="', r, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            },
            _render: function(t, e) {
                t.beginPath(), t.save(), t.transform(1, 0, 0, this.ry / this.rx, 0, 0), t.arc(e ? this.left + this.rx : 0, e ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, i, !1), t.restore(), this._renderFill(t), this._renderStroke(t)
            },
            complexity: function() {
                return 1
            }
        }), e.Ellipse.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")), e.Ellipse.fromElement = function(t, i) {
            i || (i = {});
            var n = e.parseAttributes(t, e.Ellipse.ATTRIBUTE_NAMES);
            n.left = n.left || 0, n.top = n.top || 0;
            var s = new e.Ellipse(r(n, i));
            return s.top -= s.ry, s.left -= s.rx, s
        }, void(e.Ellipse.fromObject = function(t) {
            return new e.Ellipse(t)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        if (e.Rect) return void e.warn("fabric.Rect is already defined");
        var r = e.Object.prototype.stateProperties.concat();
        r.push("rx", "ry", "x", "y"), e.Rect = e.util.createClass(e.Object, {
            stateProperties: r,
            type: "rect",
            rx: 0,
            ry: 0,
            strokeDashArray: null,
            initialize: function(t) {
                t = t || {}, this.callSuper("initialize", t), this._initRxRy()
            },
            _initRxRy: function() {
                this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry)
            },
            _render: function(t, e) {
                if (1 === this.width && 1 === this.height) return void t.fillRect(-.5, -.5, 1, 1);
                var i = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                    r = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                    n = this.width,
                    s = this.height,
                    o = e ? this.left : -this.width / 2,
                    a = e ? this.top : -this.height / 2,
                    h = 0 !== i || 0 !== r,
                    c = .4477152502;
                t.beginPath(), t.moveTo(o + i, a), t.lineTo(o + n - i, a), h && t.bezierCurveTo(o + n - c * i, a, o + n, a + c * r, o + n, a + r), t.lineTo(o + n, a + s - r), h && t.bezierCurveTo(o + n, a + s - c * r, o + n - c * i, a + s, o + n - i, a + s), t.lineTo(o + i, a + s), h && t.bezierCurveTo(o + c * i, a + s, o, a + s - c * r, o, a + s - r), t.lineTo(o, a + r), h && t.bezierCurveTo(o, a + c * r, o + c * i, a, o + i, a), t.closePath(), this._renderFill(t), this._renderStroke(t)
            },
            _renderDashedStroke: function(t) {
                var i = -this.width / 2,
                    r = -this.height / 2,
                    n = this.width,
                    s = this.height;
                t.beginPath(), e.util.drawDashedLine(t, i, r, i + n, r, this.strokeDashArray), e.util.drawDashedLine(t, i + n, r, i + n, r + s, this.strokeDashArray), e.util.drawDashedLine(t, i + n, r + s, i, r + s, this.strokeDashArray), e.util.drawDashedLine(t, i, r + s, i, r, this.strokeDashArray), t.closePath()
            },
            toObject: function(t) {
                var e = i(this.callSuper("toObject", t), {
                    rx: this.get("rx") || 0,
                    ry: this.get("ry") || 0
                });
                return this.includeDefaultValues || this._removeDefaultValues(e), e
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = this.left,
                    r = this.top;
                return this.group && "path-group" === this.group.type || (i = -this.width / 2, r = -this.height / 2), e.push("<rect ", this.getSvgId(), 'x="', i, '" y="', r, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            },
            complexity: function() {
                return 1
            }
        }), e.Rect.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")), e.Rect.fromElement = function(t, r) {
            if (!t) return null;
            r = r || {};
            var n = e.parseAttributes(t, e.Rect.ATTRIBUTE_NAMES);
            n.left = n.left || 0, n.top = n.top || 0;
            var s = new e.Rect(i(r ? e.util.object.clone(r) : {}, n));
            return s.visible = s.visible && s.width > 0 && s.height > 0, s
        }, e.Rect.fromObject = function(t) {
            return new e.Rect(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        return e.Polyline ? void e.warn("fabric.Polyline is already defined") : (e.Polyline = e.util.createClass(e.Object, {
            type: "polyline",
            points: null,
            minX: 0,
            minY: 0,
            initialize: function(t, i) {
                return e.Polygon.prototype.initialize.call(this, t, i)
            },
            _calcDimensions: function() {
                return e.Polygon.prototype._calcDimensions.call(this)
            },
            toObject: function(t) {
                return e.Polygon.prototype.toObject.call(this, t)
            },
            toSVG: function(t) {
                return e.Polygon.prototype.toSVG.call(this, t)
            },
            _render: function(t, i) {
                e.Polygon.prototype.commonRender.call(this, t, i) && (this._renderFill(t), this._renderStroke(t))
            },
            _renderDashedStroke: function(t) {
                var i, r;
                t.beginPath();
                for (var n = 0, s = this.points.length; n < s; n++) i = this.points[n], r = this.points[n + 1] || i, e.util.drawDashedLine(t, i.x, i.y, r.x, r.y, this.strokeDashArray)
            },
            complexity: function() {
                return this.get("points").length
            }
        }), e.Polyline.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polyline.fromElement = function(t, i) {
            if (!t) return null;
            i || (i = {});
            var r = e.parsePointsAttribute(t.getAttribute("points")),
                n = e.parseAttributes(t, e.Polyline.ATTRIBUTE_NAMES);
            return new e.Polyline(r, e.util.object.extend(n, i))
        }, void(e.Polyline.fromObject = function(t) {
            var i = t.points;
            return new e.Polyline(i, t, !0)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.array.min,
            n = e.util.array.max,
            s = e.util.toFixed;
        return e.Polygon ? void e.warn("fabric.Polygon is already defined") : (e.Polygon = e.util.createClass(e.Object, {
            type: "polygon",
            points: null,
            minX: 0,
            minY: 0,
            initialize: function(t, e) {
                e = e || {}, this.points = t || [], this.callSuper("initialize", e), this._calcDimensions(), "top" in e || (this.top = this.minY), "left" in e || (this.left = this.minX), this.pathOffset = {
                    x: this.minX + this.width / 2,
                    y: this.minY + this.height / 2
                }
            },
            _calcDimensions: function() {
                var t = this.points,
                    e = r(t, "x"),
                    i = r(t, "y"),
                    s = n(t, "x"),
                    o = n(t, "y");
                this.width = s - e || 0, this.height = o - i || 0, this.minX = e || 0, this.minY = i || 0
            },
            toObject: function(t) {
                return i(this.callSuper("toObject", t), {
                    points: this.points.concat()
                })
            },
            toSVG: function(t) {
                for (var e, i = [], r = this._createBaseSVGMarkup(), n = 0, o = this.points.length; n < o; n++) i.push(s(this.points[n].x, 2), ",", s(this.points[n].y, 2), " ");
                return this.group && "path-group" === this.group.type || (e = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") "), r.push("<", this.type, " ", this.getSvgId(), 'points="', i.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), e, " ", this.getSvgTransformMatrix(), '"/>\n'), t ? t(r.join("")) : r.join("")
            },
            _render: function(t, e) {
                this.commonRender(t, e) && (this._renderFill(t), (this.stroke || this.strokeDashArray) && (t.closePath(), this._renderStroke(t)))
            },
            commonRender: function(t, e) {
                var i, r = this.points.length;
                if (!r || isNaN(this.points[r - 1].y)) return !1;
                e || t.translate(-this.pathOffset.x, -this.pathOffset.y), t.beginPath(), t.moveTo(this.points[0].x, this.points[0].y);
                for (var n = 0; n < r; n++) i = this.points[n], t.lineTo(i.x, i.y);
                return !0
            },
            _renderDashedStroke: function(t) {
                e.Polyline.prototype._renderDashedStroke.call(this, t), t.closePath()
            },
            complexity: function() {
                return this.points.length
            }
        }), e.Polygon.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polygon.fromElement = function(t, r) {
            if (!t) return null;
            r || (r = {});
            var n = e.parsePointsAttribute(t.getAttribute("points")),
                s = e.parseAttributes(t, e.Polygon.ATTRIBUTE_NAMES);
            return new e.Polygon(n, i(s, r))
        }, void(e.Polygon.fromObject = function(t) {
            return new e.Polygon(t.points, t, !0)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.array.min,
            r = e.util.array.max,
            n = e.util.object.extend,
            s = Object.prototype.toString,
            o = e.util.drawArc,
            a = {
                m: 2,
                l: 2,
                h: 1,
                v: 1,
                c: 6,
                s: 4,
                q: 4,
                t: 2,
                a: 7
            },
            h = {
                m: "l",
                M: "L"
            };
        return e.Path ? void e.warn("fabric.Path is already defined") : (e.Path = e.util.createClass(e.Object, {
            type: "path",
            path: null,
            minX: 0,
            minY: 0,
            initialize: function(t, e) {
                e = e || {}, this.setOptions(e), t || (t = []);
                var i = "[object Array]" === s.call(t);
                this.path = i ? t : t.match && t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi), this.path && (i || (this.path = this._parsePath()), this._setPositionDimensions(e), e.sourcePath && this.setSourcePath(e.sourcePath))
            },
            _setPositionDimensions: function(t) {
                var e = this._parseDimensions();
                this.minX = e.left, this.minY = e.top, this.width = e.width, this.height = e.height, "undefined" == typeof t.left && (this.left = e.left + ("center" === this.originX ? this.width / 2 : "right" === this.originX ? this.width : 0)), "undefined" == typeof t.top && (this.top = e.top + ("center" === this.originY ? this.height / 2 : "bottom" === this.originY ? this.height : 0)), this.pathOffset = this.pathOffset || {
                    x: this.minX + this.width / 2,
                    y: this.minY + this.height / 2
                }
            },
            _renderPathCommands: function(t) {
                var e, i, r, n = null,
                    s = 0,
                    a = 0,
                    h = 0,
                    c = 0,
                    l = 0,
                    u = 0,
                    f = -this.pathOffset.x,
                    d = -this.pathOffset.y;
                this.group && "path-group" === this.group.type && (f = 0, d = 0), t.beginPath();
                for (var g = 0, p = this.path.length; g < p; ++g) {
                    switch (e = this.path[g], e[0]) {
                        case "l":
                            h += e[1], c += e[2], t.lineTo(h + f, c + d);
                            break;
                        case "L":
                            h = e[1], c = e[2], t.lineTo(h + f, c + d);
                            break;
                        case "h":
                            h += e[1], t.lineTo(h + f, c + d);
                            break;
                        case "H":
                            h = e[1], t.lineTo(h + f, c + d);
                            break;
                        case "v":
                            c += e[1], t.lineTo(h + f, c + d);
                            break;
                        case "V":
                            c = e[1], t.lineTo(h + f, c + d);
                            break;
                        case "m":
                            h += e[1], c += e[2], s = h, a = c, t.moveTo(h + f, c + d);
                            break;
                        case "M":
                            h = e[1], c = e[2], s = h, a = c, t.moveTo(h + f, c + d);
                            break;
                        case "c":
                            i = h + e[5], r = c + e[6], l = h + e[3], u = c + e[4], t.bezierCurveTo(h + e[1] + f, c + e[2] + d, l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "C":
                            h = e[5], c = e[6], l = e[3], u = e[4], t.bezierCurveTo(e[1] + f, e[2] + d, l + f, u + d, h + f, c + d);
                            break;
                        case "s":
                            i = h + e[3], r = c + e[4], null === n[0].match(/[CcSs]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.bezierCurveTo(l + f, u + d, h + e[1] + f, c + e[2] + d, i + f, r + d), l = h + e[1], u = c + e[2], h = i, c = r;
                            break;
                        case "S":
                            i = e[3], r = e[4], null === n[0].match(/[CcSs]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.bezierCurveTo(l + f, u + d, e[1] + f, e[2] + d, i + f, r + d), h = i, c = r, l = e[1], u = e[2];
                            break;
                        case "q":
                            i = h + e[3], r = c + e[4], l = h + e[1], u = c + e[2], t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "Q":
                            i = e[3], r = e[4], t.quadraticCurveTo(e[1] + f, e[2] + d, i + f, r + d), h = i, c = r, l = e[1], u = e[2];
                            break;
                        case "t":
                            i = h + e[1], r = c + e[2], null === n[0].match(/[QqTt]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "T":
                            i = e[1], r = e[2], null === n[0].match(/[QqTt]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "a":
                            o(t, h + f, c + d, [e[1], e[2], e[3], e[4], e[5], e[6] + h + f, e[7] + c + d]), h += e[6], c += e[7];
                            break;
                        case "A":
                            o(t, h + f, c + d, [e[1], e[2], e[3], e[4], e[5], e[6] + f, e[7] + d]), h = e[6], c = e[7];
                            break;
                        case "z":
                        case "Z":
                            h = s, c = a, t.closePath()
                    }
                    n = e
                }
            },
            _render: function(t) {
                this._renderPathCommands(t), this._renderFill(t), this._renderStroke(t)
            },
            toString: function() {
                return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
            },
            toObject: function(t) {
                var e = n(this.callSuper("toObject", t), {
                    path: this.path.map(function(t) {
                        return t.slice()
                    }),
                    pathOffset: this.pathOffset
                });
                return this.sourcePath && (e.sourcePath = this.sourcePath), this.transformMatrix && (e.transformMatrix = this.transformMatrix), e
            },
            toDatalessObject: function(t) {
                var e = this.toObject(t);
                return this.sourcePath && (e.path = this.sourcePath), delete e.sourcePath, e
            },
            toSVG: function(t) {
                for (var e = [], i = this._createBaseSVGMarkup(), r = "", n = 0, s = this.path.length; n < s; n++) e.push(this.path[n].join(" "));
                var o = e.join(" ");
                return this.group && "path-group" === this.group.type || (r = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") "), i.push("<path ", this.getSvgId(), 'd="', o, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), r, this.getSvgTransformMatrix(), '" stroke-linecap="round" ', "/>\n"), t ? t(i.join("")) : i.join("")
            },
            complexity: function() {
                return this.path.length
            },
            _parsePath: function() {
                for (var t, e, i, r, n, s = [], o = [], c = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, l = 0, u = this.path.length; l < u; l++) {
                    for (t = this.path[l], r = t.slice(1).trim(), o.length = 0; i = c.exec(r);) o.push(i[0]);
                    n = [t.charAt(0)];
                    for (var f = 0, d = o.length; f < d; f++) e = parseFloat(o[f]), isNaN(e) || n.push(e);
                    var g = n[0],
                        p = a[g.toLowerCase()],
                        v = h[g] || g;
                    if (n.length - 1 > p)
                        for (var b = 1, m = n.length; b < m; b += p) s.push([g].concat(n.slice(b, b + p))), g = v;
                    else s.push(n)
                }
                return s
            },
            _parseDimensions: function() {
                for (var t, n, s, o, a = [], h = [], c = null, l = 0, u = 0, f = 0, d = 0, g = 0, p = 0, v = 0, b = this.path.length; v < b; ++v) {
                    switch (t = this.path[v], t[0]) {
                        case "l":
                            f += t[1], d += t[2], o = [];
                            break;
                        case "L":
                            f = t[1], d = t[2], o = [];
                            break;
                        case "h":
                            f += t[1], o = [];
                            break;
                        case "H":
                            f = t[1], o = [];
                            break;
                        case "v":
                            d += t[1], o = [];
                            break;
                        case "V":
                            d = t[1], o = [];
                            break;
                        case "m":
                            f += t[1], d += t[2], l = f, u = d, o = [];
                            break;
                        case "M":
                            f = t[1], d = t[2], l = f, u = d, o = [];
                            break;
                        case "c":
                            n = f + t[5], s = d + t[6], g = f + t[3], p = d + t[4], o = e.util.getBoundsOfCurve(f, d, f + t[1], d + t[2], g, p, n, s), f = n, d = s;
                            break;
                        case "C":
                            f = t[5], d = t[6], g = t[3], p = t[4], o = e.util.getBoundsOfCurve(f, d, t[1], t[2], g, p, f, d);
                            break;
                        case "s":
                            n = f + t[3], s = d + t[4], null === c[0].match(/[CcSs]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, f + t[1], d + t[2], n, s), g = f + t[1], p = d + t[2], f = n, d = s;
                            break;
                        case "S":
                            n = t[3], s = t[4], null === c[0].match(/[CcSs]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, t[1], t[2], n, s), f = n, d = s, g = t[1], p = t[2];
                            break;
                        case "q":
                            n = f + t[3], s = d + t[4], g = f + t[1], p = d + t[2], o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "Q":
                            g = t[1], p = t[2], o = e.util.getBoundsOfCurve(f, d, g, p, g, p, t[3], t[4]), f = t[3], d = t[4];
                            break;
                        case "t":
                            n = f + t[1], s = d + t[2], null === c[0].match(/[QqTt]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "T":
                            n = t[1], s = t[2], null === c[0].match(/[QqTt]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "a":
                            o = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6] + f, t[7] + d), f += t[6], d += t[7];
                            break;
                        case "A":
                            o = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6], t[7]), f = t[6], d = t[7];
                            break;
                        case "z":
                        case "Z":
                            f = l, d = u
                    }
                    c = t, o.forEach(function(t) {
                        a.push(t.x), h.push(t.y)
                    }), a.push(f), h.push(d)
                }
                var m = i(a) || 0,
                    y = i(h) || 0,
                    _ = r(a) || 0,
                    x = r(h) || 0,
                    S = _ - m,
                    C = x - y,
                    w = {
                        left: m,
                        top: y,
                        width: S,
                        height: C
                    };
                return w
            }
        }), e.Path.fromObject = function(t, i) {
            "string" == typeof t.path ? e.loadSVGFromURL(t.path, function(r) {
                var n = r[0],
                    s = t.path;
                delete t.path, e.util.object.extend(n, t), n.setSourcePath(s), i(n)
            }) : i(new e.Path(t.path, t))
        }, e.Path.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(["d"]), e.Path.fromElement = function(t, i, r) {
            var s = e.parseAttributes(t, e.Path.ATTRIBUTE_NAMES);
            i && i(new e.Path(s.d, n(s, r)))
        }, void(e.Path.async = !0))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.array.invoke,
            n = e.Object.prototype.toObject;
        return e.PathGroup ? void e.warn("fabric.PathGroup is already defined") : (e.PathGroup = e.util.createClass(e.Path, {
            type: "path-group",
            fill: "",
            initialize: function(t, e) {
                e = e || {}, this.paths = t || [];
                for (var i = this.paths.length; i--;) this.paths[i].group = this;
                e.toBeParsed && (this.parseDimensionsFromPaths(e), delete e.toBeParsed), this.setOptions(e), this.setCoords(), e.sourcePath && this.setSourcePath(e.sourcePath)
            },
            parseDimensionsFromPaths: function(t) {
                for (var i, r, n, s, o, a, h = [], c = [], l = this.paths.length; l--;) {
                    n = this.paths[l], s = n.height + n.strokeWidth, o = n.width + n.strokeWidth, i = [{
                        x: n.left,
                        y: n.top
                    }, {
                        x: n.left + o,
                        y: n.top
                    }, {
                        x: n.left,
                        y: n.top + s
                    }, {
                        x: n.left + o,
                        y: n.top + s
                    }], a = this.paths[l].transformMatrix;
                    for (var u = 0; u < i.length; u++) r = i[u], a && (r = e.util.transformPoint(r, a, !1)), h.push(r.x), c.push(r.y)
                }
                t.width = Math.max.apply(null, h), t.height = Math.max.apply(null, c)
            },
            render: function(t) {
                if (this.visible) {
                    t.save(), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.transform(t), this._setShadow(t), this.clipTo && e.util.clipContext(this, t), t.translate(-this.width / 2, -this.height / 2);
                    for (var i = 0, r = this.paths.length; i < r; ++i) this.paths[i].render(t, !0);
                    this.clipTo && t.restore(), t.restore()
                }
            },
            _set: function(t, e) {
                if ("fill" === t && e && this.isSameColor())
                    for (var i = this.paths.length; i--;) this.paths[i]._set(t, e);
                return this.callSuper("_set", t, e)
            },
            toObject: function(t) {
                var e = i(n.call(this, t), {
                    paths: r(this.getObjects(), "toObject", t)
                });
                return this.sourcePath && (e.sourcePath = this.sourcePath), e
            },
            toDatalessObject: function(t) {
                var e = this.toObject(t);
                return this.sourcePath && (e.paths = this.sourcePath), e
            },
            toSVG: function(t) {
                var e = this.getObjects(),
                    i = this.getPointByOrigin("left", "top"),
                    r = "translate(" + i.x + " " + i.y + ")",
                    n = this._createBaseSVGMarkup();
                n.push("<g ", this.getSvgId(), 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransformMatrix(), r, this.getSvgTransform(), '" ', ">\n");
                for (var s = 0, o = e.length; s < o; s++) n.push("\t", e[s].toSVG(t));
                return n.push("</g>\n"), t ? t(n.join("")) : n.join("")
            },
            toString: function() {
                return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>"
            },
            isSameColor: function() {
                var t = this.getObjects()[0].get("fill") || "";
                return "string" == typeof t && (t = t.toLowerCase(), this.getObjects().every(function(e) {
                    var i = e.get("fill") || "";
                    return "string" == typeof i && i.toLowerCase() === t
                }))
            },
            complexity: function() {
                return this.paths.reduce(function(t, e) {
                    return t + (e && e.complexity ? e.complexity() : 0)
                }, 0)
            },
            getObjects: function() {
                return this.paths
            }
        }), e.PathGroup.fromObject = function(t, i) {
            "string" == typeof t.paths ? e.loadSVGFromURL(t.paths, function(r) {
                var n = t.paths;
                delete t.paths;
                var s = e.util.groupSVGElements(r, t, n);
                i(s)
            }) : e.util.enlivenObjects(t.paths, function(r) {
                delete t.paths, i(new e.PathGroup(r, t))
            })
        }, void(e.PathGroup.async = !0))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.array.min,
            n = e.util.array.max,
            s = e.util.array.invoke;
        if (!e.Group) {
            var o = {
                lockMovementX: !0,
                lockMovementY: !0,
                lockRotation: !0,
                lockScalingX: !0,
                lockScalingY: !0,
                lockUniScaling: !0
            };
            e.Group = e.util.createClass(e.Object, e.Collection, {
                type: "group",
                strokeWidth: 0,
                subTargetCheck: !1,
                initialize: function(t, e, i) {
                    e = e || {}, this._objects = [], i && this.callSuper("initialize", e), this._objects = t || [];
                    for (var r = this._objects.length; r--;) this._objects[r].group = this;
                    this.originalState = {}, e.originX && (this.originX = e.originX), e.originY && (this.originY = e.originY), i ? this._updateObjectsCoords(!0) : (this._calcBounds(), this._updateObjectsCoords(), this.callSuper("initialize", e)), this.setCoords(), this.saveCoords()
                },
                _updateObjectsCoords: function(t) {
                    for (var e = this._objects.length; e--;) this._updateObjectCoords(this._objects[e], t)
                },
                _updateObjectCoords: function(t, e) {
                    if (t.__origHasControls = t.hasControls, t.hasControls = !1, !e) {
                        var i = t.getLeft(),
                            r = t.getTop(),
                            n = this.getCenterPoint();
                        t.set({
                            originalLeft: i,
                            originalTop: r,
                            left: i - n.x,
                            top: r - n.y
                        }), t.setCoords()
                    }
                },
                toString: function() {
                    return "#<fabric.Group: (" + this.complexity() + ")>"
                },
                addWithUpdate: function(t) {
                    return this._restoreObjectsState(), e.util.resetObjectTransform(this), t && (this._objects.push(t), t.group = this, t._set("canvas", this.canvas)), this.forEachObject(this._setObjectActive, this), this._calcBounds(), this._updateObjectsCoords(), this
                },
                _setObjectActive: function(t) {
                    t.set("active", !0), t.group = this
                },
                removeWithUpdate: function(t) {
                    return this._restoreObjectsState(), e.util.resetObjectTransform(this), this.forEachObject(this._setObjectActive, this), this.remove(t), this._calcBounds(), this._updateObjectsCoords(), this
                },
                _onObjectAdded: function(t) {
                    t.group = this, t._set("canvas", this.canvas)
                },
                _onObjectRemoved: function(t) {
                    delete t.group, t.set("active", !1)
                },
                delegatedProperties: {
                    fill: !0,
                    stroke: !0,
                    strokeWidth: !0,
                    fontFamily: !0,
                    fontWeight: !0,
                    fontSize: !0,
                    fontStyle: !0,
                    lineHeight: !0,
                    textDecoration: !0,
                    textAlign: !0,
                    backgroundColor: !0
                },
                _set: function(t, e) {
                    var i = this._objects.length;
                    if (this.delegatedProperties[t] || "canvas" === t)
                        for (; i--;) this._objects[i].set(t, e);
                    else
                        for (; i--;) this._objects[i].setOnGroup(t, e);
                    this.callSuper("_set", t, e)
                },
                toObject: function(t) {
                    return i(this.callSuper("toObject", t), {
                        objects: s(this._objects, "toObject", t)
                    })
                },
                render: function(t) {
                    if (this.visible) {
                        t.save(), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.transform(t), this._setShadow(t), this.clipTo && e.util.clipContext(this, t), this._transformDone = !0;
                        for (var i = 0, r = this._objects.length; i < r; i++) this._renderObject(this._objects[i], t);
                        this.clipTo && t.restore(), t.restore(), this._transformDone = !1
                    }
                },
                _renderControls: function(t, e) {
                    this.callSuper("_renderControls", t, e);
                    for (var i = 0, r = this._objects.length; i < r; i++) this._objects[i]._renderControls(t)
                },
                _renderObject: function(t, e) {
                    if (t.visible) {
                        var i = t.hasRotatingPoint;
                        t.hasRotatingPoint = !1, t.render(e), t.hasRotatingPoint = i
                    }
                },
                _restoreObjectsState: function() {
                    return this._objects.forEach(this._restoreObjectState, this), this
                },
                realizeTransform: function(t) {
                    var i = t.calcTransformMatrix(),
                        r = e.util.qrDecompose(i),
                        n = new e.Point(r.translateX, r.translateY);
                    return t.scaleX = r.scaleX, t.scaleY = r.scaleY, t.skewX = r.skewX, t.skewY = r.skewY, t.angle = r.angle, t.flipX = !1, t.flipY = !1, t.setPositionByOrigin(n, "center", "center"), t
                },
                _restoreObjectState: function(t) {
                    return this.realizeTransform(t), t.setCoords(), t.hasControls = t.__origHasControls, delete t.__origHasControls, t.set("active", !1), delete t.group, this
                },
                destroy: function() {
                    return this._restoreObjectsState()
                },
                saveCoords: function() {
                    return this._originalLeft = this.get("left"), this._originalTop = this.get("top"), this
                },
                hasMoved: function() {
                    return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top")
                },
                setObjectsCoords: function() {
                    return this.forEachObject(function(t) {
                        t.setCoords()
                    }), this
                },
                _calcBounds: function(t) {
                    for (var e, i, r, n = [], s = [], o = ["tr", "br", "bl", "tl"], a = 0, h = this._objects.length, c = o.length; a < h; ++a)
                        for (e = this._objects[a], e.setCoords(), r = 0; r < c; r++) i = o[r], n.push(e.oCoords[i].x), s.push(e.oCoords[i].y);
                    this.set(this._getBounds(n, s, t))
                },
                _getBounds: function(t, i, s) {
                    var o = e.util.invertTransform(this.getViewportTransform()),
                        a = e.util.transformPoint(new e.Point(r(t), r(i)), o),
                        h = e.util.transformPoint(new e.Point(n(t), n(i)), o),
                        c = {
                            width: h.x - a.x || 0,
                            height: h.y - a.y || 0
                        };
                    return s || (c.left = a.x || 0, c.top = a.y || 0, "center" === this.originX && (c.left += c.width / 2), "right" === this.originX && (c.left += c.width), "center" === this.originY && (c.top += c.height / 2), "bottom" === this.originY && (c.top += c.height)), c
                },
                toSVG: function(t) {
                    var e = this._createBaseSVGMarkup();
                    e.push("<g ", this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '" style="', this.getSvgFilter(), '">\n');
                    for (var i = 0, r = this._objects.length; i < r; i++) e.push("\t", this._objects[i].toSVG(t));
                    return e.push("</g>\n"), t ? t(e.join("")) : e.join("")
                },
                get: function(t) {
                    if (t in o) {
                        if (this[t]) return this[t];
                        for (var e = 0, i = this._objects.length; e < i; e++)
                            if (this._objects[e][t]) return !0;
                        return !1
                    }
                    return t in this.delegatedProperties ? this._objects[0] && this._objects[0].get(t) : this[t]
                }
            }), e.Group.fromObject = function(t, i) {
                e.util.enlivenObjects(t.objects, function(r) {
                    delete t.objects, i && i(new e.Group(r, t, !0))
                })
            }, e.Group.async = !0
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = fabric.util.object.extend;
        return t.fabric || (t.fabric = {}), t.fabric.Image ? void fabric.warn("fabric.Image is already defined.") : (fabric.Image = fabric.util.createClass(fabric.Object, {
            type: "image",
            crossOrigin: "",
            alignX: "none",
            alignY: "none",
            meetOrSlice: "meet",
            strokeWidth: 0,
            _lastScaleX: 1,
            _lastScaleY: 1,
            minimumScaleTrigger: .5,
            initialize: function(t, e, i) {
                e || (e = {}), this.filters = [], this.resizeFilters = [], this.callSuper("initialize", e), this._initElement(t, e, i)
            },
            getElement: function() {
                return this._element
            },
            setElement: function(t, e, i) {
                var r, n;
                return this._element = t, this._originalElement = t, this._initConfig(i), 0 === this.resizeFilters.length ? r = e : (n = this, r = function() {
                    n.applyFilters(e, n.resizeFilters, n._filteredEl || n._originalElement, !0)
                }), 0 !== this.filters.length ? this.applyFilters(r) : r && r(this), this
            },
            setCrossOrigin: function(t) {
                return this.crossOrigin = t, this._element.crossOrigin = t, this
            },
            getOriginalSize: function() {
                var t = this.getElement();
                return {
                    width: t.width,
                    height: t.height
                }
            },
            _stroke: function(t) {
                if (this.stroke && 0 !== this.strokeWidth) {
                    var e = this.width / 2,
                        i = this.height / 2;
                    t.beginPath(), t.moveTo(-e, -i), t.lineTo(e, -i), t.lineTo(e, i), t.lineTo(-e, i), t.lineTo(-e, -i), t.closePath()
                }
            },
            _renderDashedStroke: function(t) {
                var e = -this.width / 2,
                    i = -this.height / 2,
                    r = this.width,
                    n = this.height;
                t.save(), this._setStrokeStyles(t), t.beginPath(), fabric.util.drawDashedLine(t, e, i, e + r, i, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i, e + r, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i + n, e, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e, i + n, e, i, this.strokeDashArray), t.closePath(), t.restore()
            },
            toObject: function(t) {
                var i = [],
                    r = [],
                    n = 1,
                    s = 1;
                this.filters.forEach(function(t) {
                    t && ("Resize" === t.type && (n *= t.scaleX, s *= t.scaleY), i.push(t.toObject()))
                }), this.resizeFilters.forEach(function(t) {
                    t && r.push(t.toObject())
                });
                var o = e(this.callSuper("toObject", t), {
                    src: this.getSrc(),
                    filters: i,
                    resizeFilters: r,
                    crossOrigin: this.crossOrigin,
                    alignX: this.alignX,
                    alignY: this.alignY,
                    meetOrSlice: this.meetOrSlice
                });
                return o.width /= n, o.height /= s, this.includeDefaultValues || this._removeDefaultValues(o), o
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = -this.width / 2,
                    r = -this.height / 2,
                    n = "none";
                if (this.group && "path-group" === this.group.type && (i = this.left, r = this.top), "none" !== this.alignX && "none" !== this.alignY && (n = "x" + this.alignX + "Y" + this.alignY + " " + this.meetOrSlice), e.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', "<image ", this.getSvgId(), 'xlink:href="', this.getSvgSrc(), '" x="', i, '" y="', r, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="', n, '"', "></image>\n"), this.stroke || this.strokeDashArray) {
                    var s = this.fill;
                    this.fill = null, e.push("<rect ", 'x="', i, '" y="', r, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'), this.fill = s
                }
                return e.push("</g>\n"), t ? t(e.join("")) : e.join("")
            },
            getSrc: function() {
                var t = this._originalElement;
                return t ? fabric.isLikelyNode ? t._src : t.src : this.src || ""
            },
            setSrc: function(t, e, i) {
                fabric.util.loadImage(t, function(t) {
                    return this.setElement(t, e, i)
                }, this, i && i.crossOrigin)
            },
            toString: function() {
                return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
            },
            clone: function(t, e) {
                this.constructor.fromObject(this.toObject(e), t)
            },
            applyFilters: function(t, e, i, r) {
                if (e = e || this.filters, i = i || this._originalElement) {
                    var n, s, o = fabric.util.createImage(),
                        a = this.canvas ? this.canvas.getRetinaScaling() : fabric.devicePixelRatio,
                        h = this.minimumScaleTrigger / a,
                        c = this;
                    if (0 === e.length) return this._element = i, t && t(this), i;
                    var l = fabric.util.createCanvasElement();
                    return l.width = i.width, l.height = i.height, l.getContext("2d").drawImage(i, 0, 0, i.width, i.height), e.forEach(function(t) {
                        t && (r ? (n = c.scaleX < h ? c.scaleX : 1, s = c.scaleY < h ? c.scaleY : 1, n * a < 1 && (n *= a), s * a < 1 && (s *= a)) : (n = t.scaleX, s = t.scaleY), t.applyTo(l, n, s), r || "Resize" !== t.type || (c.width *= t.scaleX, c.height *= t.scaleY))
                    }), o.width = l.width, o.height = l.height, fabric.isLikelyNode ? (o.src = l.toBuffer(void 0, fabric.Image.pngCompression), c._element = o, !r && (c._filteredEl = o), t && t(c)) : (o.onload = function() {
                        c._element = o, !r && (c._filteredEl = o), t && t(c), o.onload = l = null
                    }, o.src = l.toDataURL("image/png")), l
                }
            },
            _render: function(t, e) {
                var i, r, n, s = this._findMargins();
                i = e ? this.left : -this.width / 2, r = e ? this.top : -this.height / 2, "slice" === this.meetOrSlice && (t.beginPath(), t.rect(i, r, this.width, this.height), t.clip()), this.isMoving === !1 && this.resizeFilters.length && this._needsResize() ? (this._lastScaleX = this.scaleX, this._lastScaleY = this.scaleY, n = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, !0)) : n = this._element, n && t.drawImage(n, i + s.marginX, r + s.marginY, s.width, s.height), this._stroke(t), this._renderStroke(t)
            },
            _needsResize: function() {
                return this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY
            },
            _findMargins: function() {
                var t, e, i = this.width,
                    r = this.height,
                    n = 0,
                    s = 0;
                return "none" === this.alignX && "none" === this.alignY || (t = [this.width / this._element.width, this.height / this._element.height], e = "meet" === this.meetOrSlice ? Math.min.apply(null, t) : Math.max.apply(null, t), i = this._element.width * e, r = this._element.height * e, "Mid" === this.alignX && (n = (this.width - i) / 2), "Max" === this.alignX && (n = this.width - i), "Mid" === this.alignY && (s = (this.height - r) / 2), "Max" === this.alignY && (s = this.height - r)), {
                    width: i,
                    height: r,
                    marginX: n,
                    marginY: s
                }
            },
            _resetWidthHeight: function() {
                var t = this.getElement();
                this.set("width", t.width), this.set("height", t.height)
            },
            _initElement: function(t, e, i) {
                this.setElement(fabric.util.getById(t), i, e), fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
            },
            _initConfig: function(t) {
                t || (t = {}), this.setOptions(t), this._setWidthHeight(t), this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin)
            },
            _initFilters: function(t, e) {
                t && t.length ? fabric.util.enlivenObjects(t, function(t) {
                    e && e(t)
                }, "fabric.Image.filters") : e && e()
            },
            _setWidthHeight: function(t) {
                this.width = "width" in t ? t.width : this.getElement() ? this.getElement().width || 0 : 0, this.height = "height" in t ? t.height : this.getElement() ? this.getElement().height || 0 : 0
            },
            complexity: function() {
                return 1
            }
        }), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function(t, e) {
            fabric.util.loadImage(t.src, function(i) {
                fabric.Image.prototype._initFilters.call(t, t.filters, function(r) {
                    t.filters = r || [], fabric.Image.prototype._initFilters.call(t, t.resizeFilters, function(r) {
                        return t.resizeFilters = r || [], new fabric.Image(i, t, e)
                    })
                })
            }, null, t.crossOrigin)
        }, fabric.Image.fromURL = function(t, e, i) {
            fabric.util.loadImage(t, function(t) {
                e && e(new fabric.Image(t, i))
            }, null, i && i.crossOrigin)
        }, fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href".split(" ")), fabric.Image.fromElement = function(t, i, r) {
            var n, s = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES);
            s.preserveAspectRatio && (n = fabric.util.parsePreserveAspectRatioAttribute(s.preserveAspectRatio), e(s, n)), fabric.Image.fromURL(s["xlink:href"], i, e(r ? fabric.util.object.clone(r) : {}, s))
        }, fabric.Image.async = !0, void(fabric.Image.pngCompression = 1))
    }("undefined" != typeof exports ? exports : this), fabric.util.object.extend(fabric.Object.prototype, {
        _getAngleValueForStraighten: function() {
            var t = this.getAngle() % 360;
            return t > 0 ? 90 * Math.round((t - 1) / 90) : 90 * Math.round(t / 90)
        },
        straighten: function() {
            return this.setAngle(this._getAngleValueForStraighten()), this
        },
        fxStraighten: function(t) {
            t = t || {};
            var e = function() {},
                i = t.onComplete || e,
                r = t.onChange || e,
                n = this;
            return fabric.util.animate({
                startValue: this.get("angle"),
                endValue: this._getAngleValueForStraighten(),
                duration: this.FX_DURATION,
                onChange: function(t) {
                    n.setAngle(t), r()
                },
                onComplete: function() {
                    n.setCoords(), i()
                },
                onStart: function() {
                    n.set("active", !1)
                }
            }), this
        }
    }), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        straightenObject: function(t) {
            return t.straighten(), this.renderAll(), this
        },
        fxStraightenObject: function(t) {
            return t.fxStraighten({
                onChange: this.renderAll.bind(this)
            }), this
        }
    }), fabric.Image.filters = fabric.Image.filters || {}, fabric.Image.filters.BaseFilter = fabric.util.createClass({
        type: "BaseFilter",
        initialize: function(t) {
            t && this.setOptions(t)
        },
        setOptions: function(t) {
            for (var e in t) this[e] = t[e]
        },
        toObject: function() {
            return {
                type: this.type
            }
        },
        toJSON: function() {
            return this.toObject()
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Brightness = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Brightness",
            initialize: function(t) {
                t = t || {}, this.brightness = t.brightness || 0
            },
            applyTo: function(t) {
                for (var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = this.brightness, s = 0, o = r.length; s < o; s += 4) r[s] += n, r[s + 1] += n, r[s + 2] += n;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    brightness: this.brightness
                })
            }
        }), e.Image.filters.Brightness.fromObject = function(t) {
            return new e.Image.filters.Brightness(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Convolute = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Convolute",
            initialize: function(t) {
                t = t || {}, this.opaque = t.opaque, this.matrix = t.matrix || [0, 0, 0, 0, 1, 0, 0, 0, 0]
            },
            applyTo: function(t) {
                for (var e, i, r, n, s, o, a, h, c, l = this.matrix, u = t.getContext("2d"), f = u.getImageData(0, 0, t.width, t.height), d = Math.round(Math.sqrt(l.length)), g = Math.floor(d / 2), p = f.data, v = f.width, b = f.height, m = u.createImageData(v, b), y = m.data, _ = this.opaque ? 1 : 0, x = 0; x < b; x++)
                    for (var S = 0; S < v; S++) {
                        s = 4 * (x * v + S), e = 0, i = 0, r = 0, n = 0;
                        for (var C = 0; C < d; C++)
                            for (var w = 0; w < d; w++) a = x + C - g, o = S + w - g, a < 0 || a > b || o < 0 || o > v || (h = 4 * (a * v + o), c = l[C * d + w], e += p[h] * c, i += p[h + 1] * c, r += p[h + 2] * c, n += p[h + 3] * c);
                        y[s] = e, y[s + 1] = i, y[s + 2] = r, y[s + 3] = n + _ * (255 - n)
                    }
                u.putImageData(m, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    opaque: this.opaque,
                    matrix: this.matrix
                })
            }
        }), e.Image.filters.Convolute.fromObject = function(t) {
            return new e.Image.filters.Convolute(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.GradientTransparency = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "GradientTransparency",
            initialize: function(t) {
                t = t || {}, this.threshold = t.threshold || 100
            },
            applyTo: function(t) {
                for (var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = this.threshold, s = r.length, o = 0, a = r.length; o < a; o += 4) r[o + 3] = n + 255 * (s - o) / s;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    threshold: this.threshold
                })
            }
        }), e.Image.filters.GradientTransparency.fromObject = function(t) {
            return new e.Image.filters.GradientTransparency(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Grayscale = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Grayscale",
            applyTo: function(t) {
                for (var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, s = r.width * r.height * 4, o = 0; o < s;) e = (n[o] + n[o + 1] + n[o + 2]) / 3, n[o] = e, n[o + 1] = e, n[o + 2] = e, o += 4;
                i.putImageData(r, 0, 0)
            }
        }), e.Image.filters.Grayscale.fromObject = function() {
            return new e.Image.filters.Grayscale
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Invert = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Invert",
            applyTo: function(t) {
                var e, i = t.getContext("2d"),
                    r = i.getImageData(0, 0, t.width, t.height),
                    n = r.data,
                    s = n.length;
                for (e = 0; e < s; e += 4) n[e] = 255 - n[e], n[e + 1] = 255 - n[e + 1], n[e + 2] = 255 - n[e + 2];
                i.putImageData(r, 0, 0)
            }
        }), e.Image.filters.Invert.fromObject = function() {
            return new e.Image.filters.Invert
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Mask = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Mask",
            initialize: function(t) {
                t = t || {}, this.mask = t.mask, this.channel = [0, 1, 2, 3].indexOf(t.channel) > -1 ? t.channel : 0
            },
            applyTo: function(t) {
                if (this.mask) {
                    var i, r = t.getContext("2d"),
                        n = r.getImageData(0, 0, t.width, t.height),
                        s = n.data,
                        o = this.mask.getElement(),
                        a = e.util.createCanvasElement(),
                        h = this.channel,
                        c = n.width * n.height * 4;
                    a.width = t.width, a.height = t.height, a.getContext("2d").drawImage(o, 0, 0, t.width, t.height);
                    var l = a.getContext("2d").getImageData(0, 0, t.width, t.height),
                        u = l.data;
                    for (i = 0; i < c; i += 4) s[i + 3] = u[i + h];
                    r.putImageData(n, 0, 0)
                }
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    mask: this.mask.toObject(),
                    channel: this.channel
                })
            }
        }), e.Image.filters.Mask.fromObject = function(t, i) {
            e.util.loadImage(t.mask.src, function(r) {
                t.mask = new e.Image(r, t.mask), i && i(new e.Image.filters.Mask(t))
            })
        }, e.Image.filters.Mask.async = !0
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Noise = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Noise",
            initialize: function(t) {
                t = t || {}, this.noise = t.noise || 0
            },
            applyTo: function(t) {
                for (var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, s = this.noise, o = 0, a = n.length; o < a; o += 4) e = (.5 - Math.random()) * s, n[o] += e, n[o + 1] += e, n[o + 2] += e;
                i.putImageData(r, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    noise: this.noise
                })
            }
        }), e.Image.filters.Noise.fromObject = function(t) {
            return new e.Image.filters.Noise(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Pixelate = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Pixelate",
            initialize: function(t) {
                t = t || {}, this.blocksize = t.blocksize || 4
            },
            applyTo: function(t) {
                var e, i, r, n, s, o, a, h = t.getContext("2d"),
                    c = h.getImageData(0, 0, t.width, t.height),
                    l = c.data,
                    u = c.height,
                    f = c.width;
                for (i = 0; i < u; i += this.blocksize)
                    for (r = 0; r < f; r += this.blocksize) {
                        e = 4 * i * f + 4 * r, n = l[e], s = l[e + 1], o = l[e + 2], a = l[e + 3];
                        for (var d = i, g = i + this.blocksize; d < g; d++)
                            for (var p = r, v = r + this.blocksize; p < v; p++) e = 4 * d * f + 4 * p, l[e] = n, l[e + 1] = s, l[e + 2] = o, l[e + 3] = a
                    }
                h.putImageData(c, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    blocksize: this.blocksize
                })
            }
        }), e.Image.filters.Pixelate.fromObject = function(t) {
            return new e.Image.filters.Pixelate(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.RemoveWhite = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "RemoveWhite",
            initialize: function(t) {
                t = t || {}, this.threshold = t.threshold || 30, this.distance = t.distance || 20
            },
            applyTo: function(t) {
                for (var e, i, r, n = t.getContext("2d"), s = n.getImageData(0, 0, t.width, t.height), o = s.data, a = this.threshold, h = this.distance, c = 255 - a, l = Math.abs, u = 0, f = o.length; u < f; u += 4) e = o[u], i = o[u + 1], r = o[u + 2], e > c && i > c && r > c && l(e - i) < h && l(e - r) < h && l(i - r) < h && (o[u + 3] = 0);
                n.putImageData(s, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    threshold: this.threshold,
                    distance: this.distance
                })
            }
        }), e.Image.filters.RemoveWhite.fromObject = function(t) {
            return new e.Image.filters.RemoveWhite(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Sepia = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Sepia",
            applyTo: function(t) {
                var e, i, r = t.getContext("2d"),
                    n = r.getImageData(0, 0, t.width, t.height),
                    s = n.data,
                    o = s.length;
                for (e = 0; e < o; e += 4) i = .3 * s[e] + .59 * s[e + 1] + .11 * s[e + 2], s[e] = i + 100, s[e + 1] = i + 50, s[e + 2] = i + 255;
                r.putImageData(n, 0, 0)
            }
        }), e.Image.filters.Sepia.fromObject = function() {
            return new e.Image.filters.Sepia
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Sepia2 = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Sepia2",
            applyTo: function(t) {
                var e, i, r, n, s = t.getContext("2d"),
                    o = s.getImageData(0, 0, t.width, t.height),
                    a = o.data,
                    h = a.length;
                for (e = 0; e < h; e += 4) i = a[e], r = a[e + 1], n = a[e + 2], a[e] = (.393 * i + .769 * r + .189 * n) / 1.351, a[e + 1] = (.349 * i + .686 * r + .168 * n) / 1.203, a[e + 2] = (.272 * i + .534 * r + .131 * n) / 2.14;
                s.putImageData(o, 0, 0)
            }
        }), e.Image.filters.Sepia2.fromObject = function() {
            return new e.Image.filters.Sepia2
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Tint = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Tint",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000000", this.opacity = "undefined" != typeof t.opacity ? t.opacity : new e.Color(this.color).getAlpha()
            },
            applyTo: function(t) {
                var i, r, n, s, o, a, h, c, l, u = t.getContext("2d"),
                    f = u.getImageData(0, 0, t.width, t.height),
                    d = f.data,
                    g = d.length;
                for (l = new e.Color(this.color).getSource(), r = l[0] * this.opacity, n = l[1] * this.opacity, s = l[2] * this.opacity, c = 1 - this.opacity, i = 0; i < g; i += 4) o = d[i], a = d[i + 1], h = d[i + 2], d[i] = r + o * c, d[i + 1] = n + a * c, d[i + 2] = s + h * c;
                u.putImageData(f, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    color: this.color,
                    opacity: this.opacity
                })
            }
        }), e.Image.filters.Tint.fromObject = function(t) {
            return new e.Image.filters.Tint(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Multiply = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Multiply",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000000"
            },
            applyTo: function(t) {
                var i, r, n = t.getContext("2d"),
                    s = n.getImageData(0, 0, t.width, t.height),
                    o = s.data,
                    a = o.length;
                for (r = new e.Color(this.color).getSource(), i = 0; i < a; i += 4) o[i] *= r[0] / 255, o[i + 1] *= r[1] / 255, o[i + 2] *= r[2] / 255;
                n.putImageData(s, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    color: this.color
                })
            }
        }), e.Image.filters.Multiply.fromObject = function(t) {
            return new e.Image.filters.Multiply(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric;
        e.Image.filters.Blend = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Blend",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000", this.image = t.image || !1, this.mode = t.mode || "multiply", this.alpha = t.alpha || 1
            },
            applyTo: function(t) {
                var i, r, n, s, o, a, h, c, l, u, f = t.getContext("2d"),
                    d = f.getImageData(0, 0, t.width, t.height),
                    g = d.data,
                    p = !1;
                if (this.image) {
                    p = !0;
                    var v = e.util.createCanvasElement();
                    v.width = this.image.width, v.height = this.image.height;
                    var b = new e.StaticCanvas(v);
                    b.add(this.image);
                    var m = b.getContext("2d");
                    u = m.getImageData(0, 0, b.width, b.height).data
                } else u = new e.Color(this.color).getSource(), i = u[0] * this.alpha, r = u[1] * this.alpha, n = u[2] * this.alpha;
                for (var y = 0, _ = g.length; y < _; y += 4) switch (s = g[y], o = g[y + 1], a = g[y + 2], p && (i = u[y] * this.alpha, r = u[y + 1] * this.alpha, n = u[y + 2] * this.alpha), this.mode) {
                    case "multiply":
                        g[y] = s * i / 255, g[y + 1] = o * r / 255, g[y + 2] = a * n / 255;
                        break;
                    case "screen":
                        g[y] = 1 - (1 - s) * (1 - i), g[y + 1] = 1 - (1 - o) * (1 - r), g[y + 2] = 1 - (1 - a) * (1 - n);
                        break;
                    case "add":
                        g[y] = Math.min(255, s + i), g[y + 1] = Math.min(255, o + r), g[y + 2] = Math.min(255, a + n);
                        break;
                    case "diff":
                    case "difference":
                        g[y] = Math.abs(s - i), g[y + 1] = Math.abs(o - r), g[y + 2] = Math.abs(a - n);
                        break;
                    case "subtract":
                        h = s - i, c = o - r, l = a - n, g[y] = h < 0 ? 0 : h, g[y + 1] = c < 0 ? 0 : c, g[y + 2] = l < 0 ? 0 : l;
                        break;
                    case "darken":
                        g[y] = Math.min(s, i), g[y + 1] = Math.min(o, r), g[y + 2] = Math.min(a, n);
                        break;
                    case "lighten":
                        g[y] = Math.max(s, i), g[y + 1] = Math.max(o, r), g[y + 2] = Math.max(a, n)
                }
                f.putImageData(d, 0, 0)
            },
            toObject: function() {
                return {
                    type: this.type,
                    color: this.color,
                    image: this.image,
                    mode: this.mode,
                    alpha: this.alpha
                }
            }
        }), e.Image.filters.Blend.fromObject = function(t) {
            return new e.Image.filters.Blend(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = Math.pow,
            r = Math.floor,
            n = Math.sqrt,
            s = Math.abs,
            o = Math.max,
            a = Math.round,
            h = Math.sin,
            c = Math.ceil;
        e.Image.filters.Resize = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Resize",
            resizeType: "hermite",
            scaleX: 0,
            scaleY: 0,
            lanczosLobes: 3,
            applyTo: function(t, e, i) {
                if (1 !== e || 1 !== i) {
                    this.rcpScaleX = 1 / e, this.rcpScaleY = 1 / i;
                    var r, n = t.width,
                        s = t.height,
                        o = a(n * e),
                        h = a(s * i);
                    "sliceHack" === this.resizeType && (r = this.sliceByTwo(t, n, s, o, h)), "hermite" === this.resizeType && (r = this.hermiteFastResize(t, n, s, o, h)), "bilinear" === this.resizeType && (r = this.bilinearFiltering(t, n, s, o, h)), "lanczos" === this.resizeType && (r = this.lanczosResize(t, n, s, o, h)), t.width = o, t.height = h, t.getContext("2d").putImageData(r, 0, 0)
                }
            },
            sliceByTwo: function(t, i, n, s, a) {
                var h, c = t.getContext("2d"),
                    l = .5,
                    u = .5,
                    f = 1,
                    d = 1,
                    g = !1,
                    p = !1,
                    v = i,
                    b = n,
                    m = e.util.createCanvasElement(),
                    y = m.getContext("2d");
                for (s = r(s), a = r(a), m.width = o(s, i), m.height = o(a, n), s > i && (l = 2, f = -1), a > n && (u = 2, d = -1), h = c.getImageData(0, 0, i, n), t.width = o(s, i), t.height = o(a, n), c.putImageData(h, 0, 0); !g || !p;) i = v, n = b, s * f < r(v * l * f) ? v = r(v * l) : (v = s, g = !0), a * d < r(b * u * d) ? b = r(b * u) : (b = a, p = !0), h = c.getImageData(0, 0, i, n), y.putImageData(h, 0, 0), c.clearRect(0, 0, v, b), c.drawImage(m, 0, 0, i, n, 0, 0, v, b);
                return c.getImageData(0, 0, s, a)
            },
            lanczosResize: function(t, e, o, a, l) {
                function u(t) {
                    return function(e) {
                        if (e > t) return 0;
                        if (e *= Math.PI, s(e) < 1e-16) return 1;
                        var i = e / t;
                        return h(e) * h(i) / e / i
                    }
                }

                function f(t) {
                    var h, c, u, d, g, j, A, M, P, I, L;
                    for (T.x = (t + .5) * y, k.x = r(T.x), h = 0; h < l; h++) {
                        for (T.y = (h + .5) * _, k.y = r(T.y), g = 0, j = 0, A = 0, M = 0, P = 0, c = k.x - C; c <= k.x + C; c++)
                            if (!(c < 0 || c >= e)) {
                                I = r(1e3 * s(c - T.x)), O[I] || (O[I] = {});
                                for (var E = k.y - w; E <= k.y + w; E++) E < 0 || E >= o || (L = r(1e3 * s(E - T.y)), O[I][L] || (O[I][L] = m(n(i(I * x, 2) + i(L * S, 2)) / 1e3)), u = O[I][L], u > 0 && (d = 4 * (E * e + c), g += u, j += u * v[d], A += u * v[d + 1], M += u * v[d + 2], P += u * v[d + 3]))
                            }
                        d = 4 * (h * a + t), b[d] = j / g, b[d + 1] = A / g, b[d + 2] = M / g, b[d + 3] = P / g
                    }
                    return ++t < a ? f(t) : p
                }
                var d = t.getContext("2d"),
                    g = d.getImageData(0, 0, e, o),
                    p = d.getImageData(0, 0, a, l),
                    v = g.data,
                    b = p.data,
                    m = u(this.lanczosLobes),
                    y = this.rcpScaleX,
                    _ = this.rcpScaleY,
                    x = 2 / this.rcpScaleX,
                    S = 2 / this.rcpScaleY,
                    C = c(y * this.lanczosLobes / 2),
                    w = c(_ * this.lanczosLobes / 2),
                    O = {},
                    T = {},
                    k = {};
                return f(0)
            },
            bilinearFiltering: function(t, e, i, n, s) {
                var o, a, h, c, l, u, f, d, g, p, v, b, m, y = 0,
                    _ = this.rcpScaleX,
                    x = this.rcpScaleY,
                    S = t.getContext("2d"),
                    C = 4 * (e - 1),
                    w = S.getImageData(0, 0, e, i),
                    O = w.data,
                    T = S.getImageData(0, 0, n, s),
                    k = T.data;
                for (f = 0; f < s; f++)
                    for (d = 0; d < n; d++)
                        for (l = r(_ * d), u = r(x * f), g = _ * d - l, p = x * f - u, m = 4 * (u * e + l), v = 0; v < 4; v++) o = O[m + v], a = O[m + 4 + v], h = O[m + C + v], c = O[m + C + 4 + v], b = o * (1 - g) * (1 - p) + a * g * (1 - p) + h * p * (1 - g) + c * g * p, k[y++] = b;
                return T
            },
            hermiteFastResize: function(t, e, i, o, a) {
                for (var h = this.rcpScaleX, l = this.rcpScaleY, u = c(h / 2), f = c(l / 2), d = t.getContext("2d"), g = d.getImageData(0, 0, e, i), p = g.data, v = d.getImageData(0, 0, o, a), b = v.data, m = 0; m < a; m++)
                    for (var y = 0; y < o; y++) {
                        for (var _ = 4 * (y + m * o), x = 0, S = 0, C = 0, w = 0, O = 0, T = 0, k = 0, j = (m + .5) * l, A = r(m * l); A < (m + 1) * l; A++)
                            for (var M = s(j - (A + .5)) / f, P = (y + .5) * h, I = M * M, L = r(y * h); L < (y + 1) * h; L++) {
                                var E = s(P - (L + .5)) / u,
                                    D = n(I + E * E);
                                D > 1 && D < -1 || (x = 2 * D * D * D - 3 * D * D + 1, x > 0 && (E = 4 * (L + A * e), k += x * p[E + 3], C += x, p[E + 3] < 255 && (x = x * p[E + 3] / 250), w += x * p[E], O += x * p[E + 1], T += x * p[E + 2], S += x))
                            }
                        b[_] = w / S, b[_ + 1] = O / S, b[_ + 2] = T / S, b[_ + 3] = k / C
                    }
                return v
            },
            toObject: function() {
                return {
                    type: this.type,
                    scaleX: this.scaleX,
                    scaleY: this.scaleY,
                    resizeType: this.resizeType,
                    lanczosLobes: this.lanczosLobes
                }
            }
        }), e.Image.filters.Resize.fromObject = function(t) {
            return new e.Image.filters.Resize(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.ColorMatrix = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "ColorMatrix",
            initialize: function(t) {
                t || (t = {}), this.matrix = t.matrix || [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
            },
            applyTo: function(t) {
                var e, i, r, n, s, o = t.getContext("2d"),
                    a = o.getImageData(0, 0, t.width, t.height),
                    h = a.data,
                    c = h.length,
                    l = this.matrix;
                for (e = 0; e < c; e += 4) i = h[e], r = h[e + 1], n = h[e + 2], s = h[e + 3], h[e] = i * l[0] + r * l[1] + n * l[2] + s * l[3] + l[4], h[e + 1] = i * l[5] + r * l[6] + n * l[7] + s * l[8] + l[9], h[e + 2] = i * l[10] + r * l[11] + n * l[12] + s * l[13] + l[14], h[e + 3] = i * l[15] + r * l[16] + n * l[17] + s * l[18] + l[19];
                o.putImageData(a, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    type: this.type,
                    matrix: this.matrix
                })
            }
        }), e.Image.filters.ColorMatrix.fromObject = function(t) {
            return new e.Image.filters.ColorMatrix(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.object.clone,
            n = e.util.toFixed,
            s = e.Object.NUM_FRACTION_DIGITS;
        if (e.Text) return void e.warn("fabric.Text is already defined");
        var o = e.Object.prototype.stateProperties.concat();
        o.push("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor"), e.Text = e.util.createClass(e.Object, {
            _dimensionAffectingProps: {
                fontSize: !0,
                fontWeight: !0,
                fontFamily: !0,
                fontStyle: !0,
                lineHeight: !0,
                text: !0,
                charSpacing: !0,
                textAlign: !0,
                stroke: !1,
                strokeWidth: !1
            },
            _reNewline: /\r?\n/,
            _reSpacesAndTabs: /[ \t\r]+/g,
            type: "text",
            fontSize: 40,
            fontWeight: "normal",
            fontFamily: "Times New Roman",
            textDecoration: "",
            textAlign: "left",
            fontStyle: "",
            lineHeight: 1.16,
            textBackgroundColor: "",
            stateProperties: o,
            stroke: null,
            shadow: null,
            _fontSizeFraction: .25,
            _fontSizeMult: 1.13,
            charSpacing: 0,
            initialize: function(t, e) {
                e = e || {}, this.text = t, this.__skipDimension = !0, this.setOptions(e), this.__skipDimension = !1, this._initDimensions()
            },
            _initDimensions: function(t) {
                this.__skipDimension || (t || (t = e.util.createCanvasElement().getContext("2d"), this._setTextStyles(t)), this._textLines = this._splitTextIntoLines(), this._clearCache(), this.width = this._getTextWidth(t), this.height = this._getTextHeight(t))
            },
            toString: function() {
                return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
            },
            _render: function(t) {
                this.clipTo && e.util.clipContext(this, t), this._setOpacity(t), this._setShadow(t), this._setupCompositeOperation(t), this._renderTextBackground(t), this._setStrokeStyles(t), this._setFillStyles(t), this._renderText(t), this._renderTextDecoration(t), this.clipTo && t.restore()
            },
            _renderText: function(t) {
                this._renderTextFill(t), this._renderTextStroke(t)
            },
            _setTextStyles: function(t) {
                t.textBaseline = "alphabetic", t.font = this._getFontDeclaration()
            },
            _getTextHeight: function() {
                return this._getHeightOfSingleLine() + (this._textLines.length - 1) * this._getHeightOfLine()
            },
            _getTextWidth: function(t) {
                for (var e = this._getLineWidth(t, 0), i = 1, r = this._textLines.length; i < r; i++) {
                    var n = this._getLineWidth(t, i);
                    n > e && (e = n)
                }
                return e
            },
            _getNonTransformedDimensions: function() {
                return {
                    x: this.width,
                    y: this.height
                }
            },
            _renderChars: function(t, e, i, r, n) {
                var s, o, a = t.slice(0, -4);
                if (this[a].toLive) {
                    var h = -this.width / 2 + this[a].offsetX || 0,
                        c = -this.height / 2 + this[a].offsetY || 0;
                    e.save(), e.translate(h, c), r -= h, n -= c
                }
                if (0 !== this.charSpacing) {
                    var l = this._getWidthOfCharSpacing();
                    i = i.split("");
                    for (var u = 0, f = i.length; u < f; u++) s = i[u], o = e.measureText(s).width + l, e[t](s, r, n), r += o > 0 ? o : 0
                } else e[t](i, r, n);
                this[a].toLive && e.restore()
            },
            _renderTextLine: function(t, e, i, r, n, s) {
                n -= this.fontSize * this._fontSizeFraction;
                var o = this._getLineWidth(e, s);
                if ("justify" !== this.textAlign || this.width < o) return void this._renderChars(t, e, i, r, n, s);
                for (var a, h = i.split(/\s+/), c = 0, l = this._getWidthOfWords(e, h.join(""), s, 0), u = this.width - l, f = h.length - 1, d = f > 0 ? u / f : 0, g = 0, p = 0, v = h.length; p < v; p++) {
                    for (;
                        " " === i[c] && c < i.length;) c++;
                    a = h[p], this._renderChars(t, e, a, r + g, n, s, c), g += this._getWidthOfWords(e, a, s, c) + d, c += a.length
                }
            },
            _getWidthOfWords: function(t, e) {
                var i, r, n = t.measureText(e).width;
                return 0 !== this.charSpacing && (i = e.split("").length, r = i * this._getWidthOfCharSpacing(), n += r), n > 0 ? n : 0
            },
            _getLeftOffset: function() {
                return -this.width / 2
            },
            _getTopOffset: function() {
                return -this.height / 2
            },
            isEmptyStyles: function() {
                return !0
            },
            _renderTextCommon: function(t, e) {
                for (var i = 0, r = this._getLeftOffset(), n = this._getTopOffset(), s = 0, o = this._textLines.length; s < o; s++) {
                    var a = this._getHeightOfLine(t, s),
                        h = a / this.lineHeight,
                        c = this._getLineWidth(t, s),
                        l = this._getLineLeftOffset(c);
                    this._renderTextLine(e, t, this._textLines[s], r + l, n + i + h, s), i += a
                }
            },
            _renderTextFill: function(t) {
                !this.fill && this.isEmptyStyles() || this._renderTextCommon(t, "fillText")
            },
            _renderTextStroke: function(t) {
                (this.stroke && 0 !== this.strokeWidth || !this.isEmptyStyles()) && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokedashArray), t.beginPath(), this._renderTextCommon(t, "strokeText"), t.closePath(), t.restore())
            },
            _getHeightOfLine: function() {
                return this._getHeightOfSingleLine() * this.lineHeight
            },
            _getHeightOfSingleLine: function() {
                return this.fontSize * this._fontSizeMult
            },
            _renderTextBackground: function(t) {
                this._renderTextBoxBackground(t), this._renderTextLinesBackground(t)
            },
            _renderTextBoxBackground: function(t) {
                this.backgroundColor && (t.fillStyle = this.backgroundColor, t.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height), this._removeShadow(t))
            },
            _renderTextLinesBackground: function(t) {
                if (this.textBackgroundColor) {
                    var e, i, r, n = 0;
                    t.fillStyle = this.textBackgroundColor;
                    for (var s = 0, o = this._textLines.length; s < o; s++) e = this._getHeightOfLine(t, s), i = this._getLineWidth(t, s), i > 0 && (r = this._getLineLeftOffset(i), t.fillRect(this._getLeftOffset() + r, this._getTopOffset() + n, i, e / this.lineHeight)), n += e;
                    this._removeShadow(t)
                }
            },
            _getLineLeftOffset: function(t) {
                return "center" === this.textAlign ? (this.width - t) / 2 : "right" === this.textAlign ? this.width - t : 0
            },
            _clearCache: function() {
                this.__lineWidths = [], this.__lineHeights = []
            },
            _shouldClearCache: function() {
                var t = !1;
                if (this._forceClearCache) return this._forceClearCache = !1, !0;
                for (var e in this._dimensionAffectingProps) this["__" + e] !== this[e] && (this["__" + e] = this[e], t = !0);
                return t
            },
            _getLineWidth: function(t, e) {
                if (this.__lineWidths[e]) return this.__lineWidths[e] === -1 ? this.width : this.__lineWidths[e];
                var i, r, n = this._textLines[e];
                return i = "" === n ? 0 : this._measureLine(t, e), this.__lineWidths[e] = i, i && "justify" === this.textAlign && (r = n.split(/\s+/), r.length > 1 && (this.__lineWidths[e] = -1)), i
            },
            _getWidthOfCharSpacing: function() {
                return 0 !== this.charSpacing ? this.fontSize * this.charSpacing / 1e3 : 0
            },
            _measureLine: function(t, e) {
                var i, r, n = this._textLines[e],
                    s = t.measureText(n).width,
                    o = 0;
                return 0 !== this.charSpacing && (i = n.split("").length, o = (i - 1) * this._getWidthOfCharSpacing()), r = s + o, r > 0 ? r : 0
            },
            _renderTextDecoration: function(t) {
                function e(e) {
                    var n, s, o, a, h, c, l, u = 0;
                    for (n = 0, s = r._textLines.length; n < s; n++) {
                        for (h = r._getLineWidth(t, n), c = r._getLineLeftOffset(h), l = r._getHeightOfLine(t, n), o = 0, a = e.length; o < a; o++) t.fillRect(r._getLeftOffset() + c, u + (r._fontSizeMult - 1 + e[o]) * r.fontSize - i, h, r.fontSize / 15);
                        u += l
                    }
                }
                if (this.textDecoration) {
                    var i = this.height / 2,
                        r = this,
                        n = [];
                    this.textDecoration.indexOf("underline") > -1 && n.push(.85), this.textDecoration.indexOf("line-through") > -1 && n.push(.43), this.textDecoration.indexOf("overline") > -1 && n.push(-.12), n.length > 0 && e(n)
                }
            },
            _getFontDeclaration: function() {
                return [e.isLikelyNode ? this.fontWeight : this.fontStyle, e.isLikelyNode ? this.fontStyle : this.fontWeight, this.fontSize + "px", '"' + this.fontFamily + '"'].join(" ")
            },
            render: function(t, e) {
                this.visible && (t.save(), this._setTextStyles(t), this._shouldClearCache() && this._initDimensions(t), this.drawSelectionBackground(t), e || this.transform(t), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.group && "path-group" === this.group.type && t.translate(this.left, this.top), this._render(t), t.restore())
            },
            _splitTextIntoLines: function() {
                return this.text.split(this._reNewline)
            },
            toObject: function(t) {
                var e = i(this.callSuper("toObject", t), {
                    text: this.text,
                    fontSize: this.fontSize,
                    fontWeight: this.fontWeight,
                    fontFamily: this.fontFamily,
                    fontStyle: this.fontStyle,
                    lineHeight: this.lineHeight,
                    textDecoration: this.textDecoration,
                    textAlign: this.textAlign,
                    textBackgroundColor: this.textBackgroundColor,
                    charSpacing: this.charSpacing
                });
                return this.includeDefaultValues || this._removeDefaultValues(e), e
            },
            toSVG: function(t) {
                this.ctx || (this.ctx = e.util.createCanvasElement().getContext("2d"));
                var i = this._createBaseSVGMarkup(),
                    r = this._getSVGLeftTopOffsets(this.ctx),
                    n = this._getSVGTextAndBg(r.textTop, r.textLeft);
                return this._wrapSVGTextAndBg(i, n), t ? t(i.join("")) : i.join("")
            },
            _getSVGLeftTopOffsets: function(t) {
                var e = this._getHeightOfLine(t, 0),
                    i = -this.width / 2,
                    r = 0;
                return {
                    textLeft: i + (this.group && "path-group" === this.group.type ? this.left : 0),
                    textTop: r + (this.group && "path-group" === this.group.type ? -this.top : 0),
                    lineTop: e
                }
            },
            _wrapSVGTextAndBg: function(t, e) {
                var i = !0,
                    r = this.getSvgFilter(),
                    n = "" === r ? "" : ' style="' + r + '"';
                t.push("\t<g ", this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"', n, ">\n", e.textBgRects.join(""), "\t\t<text ", this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : "", 'style="', this.getSvgStyles(i), '" >\n', e.textSpans.join(""), "\t\t</text>\n", "\t</g>\n")
            },
            _getSVGTextAndBg: function(t, e) {
                var i = [],
                    r = [],
                    n = 0;
                this._setSVGBg(r);
                for (var s = 0, o = this._textLines.length; s < o; s++) this.textBackgroundColor && this._setSVGTextLineBg(r, s, e, t, n), this._setSVGTextLineText(s, i, n, e, t, r), n += this._getHeightOfLine(this.ctx, s);
                return {
                    textSpans: i,
                    textBgRects: r
                }
            },
            _setSVGTextLineText: function(t, i, r, o, a) {
                var h = this.fontSize * (this._fontSizeMult - this._fontSizeFraction) - a + r - this.height / 2;
                return "justify" === this.textAlign ? void this._setSVGTextLineJustifed(t, i, h, o) : void i.push('\t\t\t<tspan x="', n(o + this._getLineLeftOffset(this._getLineWidth(this.ctx, t)), s), '" ', 'y="', n(h, s), '" ', this._getFillAttributes(this.fill), ">", e.util.string.escapeXml(this._textLines[t]), "</tspan>\n")
            },
            _setSVGTextLineJustifed: function(t, i, r, o) {
                var a = e.util.createCanvasElement().getContext("2d");
                this._setTextStyles(a);
                var h, c, l = this._textLines[t],
                    u = l.split(/\s+/),
                    f = this._getWidthOfWords(a, u.join("")),
                    d = this.width - f,
                    g = u.length - 1,
                    p = g > 0 ? d / g : 0,
                    v = this._getFillAttributes(this.fill);
                for (o += this._getLineLeftOffset(this._getLineWidth(a, t)), t = 0, c = u.length; t < c; t++) h = u[t], i.push('\t\t\t<tspan x="', n(o, s), '" ', 'y="', n(r, s), '" ', v, ">", e.util.string.escapeXml(h), "</tspan>\n"), o += this._getWidthOfWords(a, h) + p
            },
            _setSVGTextLineBg: function(t, e, i, r, o) {
                t.push("\t\t<rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', n(i + this._getLineLeftOffset(this._getLineWidth(this.ctx, e)), s), '" y="', n(o - this.height / 2, s), '" width="', n(this._getLineWidth(this.ctx, e), s), '" height="', n(this._getHeightOfLine(this.ctx, e) / this.lineHeight, s), '"></rect>\n')
            },
            _setSVGBg: function(t) {
                this.backgroundColor && t.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', n(-this.width / 2, s), '" y="', n(-this.height / 2, s), '" width="', n(this.width, s), '" height="', n(this.height, s), '"></rect>\n')
            },
            _getFillAttributes: function(t) {
                var i = t && "string" == typeof t ? new e.Color(t) : "";
                return i && i.getSource() && 1 !== i.getAlpha() ? 'opacity="' + i.getAlpha() + '" fill="' + i.setAlpha(1).toRgb() + '"' : 'fill="' + t + '"'
            },
            _set: function(t, e) {
                this.callSuper("_set", t, e), t in this._dimensionAffectingProps && (this._initDimensions(), this.setCoords())
            },
            complexity: function() {
                return 1
            }
        }), e.Text.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" ")), e.Text.DEFAULT_SVG_FONT_SIZE = 16, e.Text.fromElement = function(t, i) {
            if (!t) return null;
            var r = e.parseAttributes(t, e.Text.ATTRIBUTE_NAMES);
            i = e.util.object.extend(i ? e.util.object.clone(i) : {}, r), i.top = i.top || 0, i.left = i.left || 0, "dx" in r && (i.left += r.dx), "dy" in r && (i.top += r.dy), "fontSize" in i || (i.fontSize = e.Text.DEFAULT_SVG_FONT_SIZE), i.originX || (i.originX = "left");
            var n = "";
            "textContent" in t ? n = t.textContent : "firstChild" in t && null !== t.firstChild && "data" in t.firstChild && null !== t.firstChild.data && (n = t.firstChild.data), n = n.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " ");
            var s = new e.Text(n, i),
                o = s.getHeight() / s.height,
                a = (s.height + s.strokeWidth) * s.lineHeight - s.height,
                h = a * o,
                c = s.getHeight() + h,
                l = 0;
            return "left" === s.originX && (l = s.getWidth() / 2), "right" === s.originX && (l = -s.getWidth() / 2), s.set({
                left: s.getLeft() + l,
                top: s.getTop() - c / 2 + s.fontSize * (.18 + s._fontSizeFraction) / s.lineHeight
            }), s
        }, e.Text.fromObject = function(t) {
            return new e.Text(t.text, r(t))
        }, e.util.createAccessors(e.Text)
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.util.object.clone;
        fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
            type: "i-text",
            selectionStart: 0,
            selectionEnd: 0,
            selectionColor: "rgba(17,119,255,0.3)",
            isEditing: !1,
            editable: !0,
            editingBorderColor: "rgba(102,153,255,0.25)",
            cursorWidth: 2,
            cursorColor: "#333",
            cursorDelay: 1e3,
            cursorDuration: 600,
            styles: null,
            caching: !0,
            _reSpace: /\s|\n/,
            _currentCursorOpacity: 0,
            _selectionDirection: null,
            _abortCursorAnimation: !1,
            __widthOfSpace: [],
            initialize: function(t, e) {
                this.styles = e ? e.styles || {} : {}, this.callSuper("initialize", t, e), this.initBehavior()
            },
            _clearCache: function() {
                this.callSuper("_clearCache"), this.__widthOfSpace = []
            },
            isEmptyStyles: function() {
                if (!this.styles) return !0;
                var t = this.styles;
                for (var e in t)
                    for (var i in t[e])
                        for (var r in t[e][i]) return !1;
                return !0
            },
            setSelectionStart: function(t) {
                t = Math.max(t, 0), this._updateAndFire("selectionStart", t)
            },
            setSelectionEnd: function(t) {
                t = Math.min(t, this.text.length), this._updateAndFire("selectionEnd", t)
            },
            _updateAndFire: function(t, e) {
                this[t] !== e && (this._fireSelectionChanged(), this[t] = e), this._updateTextarea()
            },
            _fireSelectionChanged: function() {
                this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", {
                    target: this
                })
            },
            getSelectionStyles: function(t, e) {
                if (2 === arguments.length) {
                    for (var i = [], r = t; r < e; r++) i.push(this.getSelectionStyles(r));
                    return i
                }
                var n = this.get2DCursorLocation(t),
                    s = this._getStyleDeclaration(n.lineIndex, n.charIndex);
                return s || {}
            },
            setSelectionStyles: function(t) {
                if (this.selectionStart === this.selectionEnd) this._extendStyles(this.selectionStart, t);
                else
                    for (var e = this.selectionStart; e < this.selectionEnd; e++) this._extendStyles(e, t);
                return this._forceClearCache = !0, this
            },
            _extendStyles: function(t, e) {
                var i = this.get2DCursorLocation(t);
                this._getLineStyle(i.lineIndex) || this._setLineStyle(i.lineIndex, {}), this._getStyleDeclaration(i.lineIndex, i.charIndex) || this._setStyleDeclaration(i.lineIndex, i.charIndex, {}), fabric.util.object.extend(this._getStyleDeclaration(i.lineIndex, i.charIndex), e)
            },
            _render: function(t) {
                this.oldWidth = this.width, this.oldHeight = this.height, this.callSuper("_render", t), this.ctx = t, this.cursorOffsetCache = {}, this.renderCursorOrSelection()
            },
            renderCursorOrSelection: function() {
                if (this.active && this.isEditing) {
                    var t, e, i = this.text.split("");
                    this.canvas.contextTop ? (e = this.canvas.contextTop, e.save(), e.transform.apply(e, this.canvas.viewportTransform), this.transform(e), this.transformMatrix && e.transform.apply(e, this.transformMatrix), this._clearTextArea(e)) : (e = this.ctx, e.save()), this.selectionStart === this.selectionEnd ? (t = this._getCursorBoundaries(i, "cursor"), this.renderCursor(t, e)) : (t = this._getCursorBoundaries(i, "selection"), this.renderSelection(i, t, e)), e.restore()
                }
            },
            _clearTextArea: function(t) {
                var e = this.oldWidth + 4,
                    i = this.oldHeight + 4;
                t.clearRect(-e / 2, -i / 2, e, i)
            },
            get2DCursorLocation: function(t) {
                "undefined" == typeof t && (t = this.selectionStart);
                for (var e = this._textLines.length, i = 0; i < e; i++) {
                    if (t <= this._textLines[i].length) return {
                        lineIndex: i,
                        charIndex: t
                    };
                    t -= this._textLines[i].length + 1
                }
                return {
                    lineIndex: i - 1,
                    charIndex: this._textLines[i - 1].length < t ? this._textLines[i - 1].length : t
                }
            },
            getCurrentCharStyle: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return {
                    fontSize: i && i.fontSize || this.fontSize,
                    fill: i && i.fill || this.fill,
                    textBackgroundColor: i && i.textBackgroundColor || this.textBackgroundColor,
                    textDecoration: i && i.textDecoration || this.textDecoration,
                    fontFamily: i && i.fontFamily || this.fontFamily,
                    fontWeight: i && i.fontWeight || this.fontWeight,
                    fontStyle: i && i.fontStyle || this.fontStyle,
                    stroke: i && i.stroke || this.stroke,
                    strokeWidth: i && i.strokeWidth || this.strokeWidth
                }
            },
            getCurrentCharFontSize: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return i && i.fontSize ? i.fontSize : this.fontSize
            },
            getCurrentCharColor: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return i && i.fill ? i.fill : this.cursorColor
            },
            _getCursorBoundaries: function(t, e) {
                var i = Math.round(this._getLeftOffset()),
                    r = this._getTopOffset(),
                    n = this._getCursorBoundariesOffsets(t, e);
                return {
                    left: i,
                    top: r,
                    leftOffset: n.left + n.lineLeft,
                    topOffset: n.top
                }
            },
            _getCursorBoundariesOffsets: function(t, e) {
                if (this.cursorOffsetCache && "top" in this.cursorOffsetCache) return this.cursorOffsetCache;
                for (var i, r = 0, n = 0, s = 0, o = 0, a = 0, h = 0; h < this.selectionStart; h++) "\n" === t[h] ? (a = 0, o += this._getHeightOfLine(this.ctx, n), n++, s = 0) : (a += this._getWidthOfChar(this.ctx, t[h], n, s), s++), r = this._getLineLeftOffset(this._getLineWidth(this.ctx, n));
                return "cursor" === e && (o += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, n) / this.lineHeight - this.getCurrentCharFontSize(n, s) * (1 - this._fontSizeFraction)), 0 !== this.charSpacing && s === this._textLines[n].length && (a -= this._getWidthOfCharSpacing()), i = {
                    top: o,
                    left: a > 0 ? a : 0,
                    lineLeft: r
                }, this.cursorOffsetCache = i, this.cursorOffsetCache
            },
            renderCursor: function(t, e) {
                var i = this.get2DCursorLocation(),
                    r = i.lineIndex,
                    n = i.charIndex,
                    s = this.getCurrentCharFontSize(r, n),
                    o = 0 === r && 0 === n ? this._getLineLeftOffset(this._getLineWidth(e, r)) : t.leftOffset,
                    a = this.scaleX * this.canvas.getZoom(),
                    h = this.cursorWidth / a;
                e.fillStyle = this.getCurrentCharColor(r, n), e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity, e.fillRect(t.left + o - h / 2, t.top + t.topOffset, h, s)
            },
            renderSelection: function(t, e, i) {
                i.fillStyle = this.selectionColor;
                for (var r = this.get2DCursorLocation(this.selectionStart), n = this.get2DCursorLocation(this.selectionEnd), s = r.lineIndex, o = n.lineIndex, a = s; a <= o; a++) {
                    var h = this._getLineLeftOffset(this._getLineWidth(i, a)) || 0,
                        c = this._getHeightOfLine(this.ctx, a),
                        l = 0,
                        u = 0,
                        f = this._textLines[a];
                    if (a === s) {
                        for (var d = 0, g = f.length; d < g; d++) d >= r.charIndex && (a !== o || d < n.charIndex) && (u += this._getWidthOfChar(i, f[d], a, d)), d < r.charIndex && (h += this._getWidthOfChar(i, f[d], a, d));
                        d === f.length && (u -= this._getWidthOfCharSpacing())
                    } else if (a > s && a < o) u += this._getLineWidth(i, a) || 5;
                    else if (a === o) {
                        for (var p = 0, v = n.charIndex; p < v; p++) u += this._getWidthOfChar(i, f[p], a, p);
                        n.charIndex === f.length && (u -= this._getWidthOfCharSpacing())
                    }
                    l = c, (this.lineHeight < 1 || a === o && this.lineHeight > 1) && (c /= this.lineHeight), i.fillRect(e.left + h, e.top + e.topOffset, u > 0 ? u : 0, c), e.topOffset += l
                }
            },
            _renderChars: function(t, e, i, r, n, s, o) {
                if (this.isEmptyStyles()) return this._renderCharsFast(t, e, i, r, n);
                o = o || 0;
                var a, h, c = this._getHeightOfLine(e, s),
                    l = "";
                e.save(), n -= c / this.lineHeight * this._fontSizeFraction;
                for (var u = o, f = i.length + o; u <= f; u++) a = a || this.getCurrentCharStyle(s, u), h = this.getCurrentCharStyle(s, u + 1), (this._hasStyleChanged(a, h) || u === f) && (this._renderChar(t, e, s, u - 1, l, r, n, c), l = "", a = h), l += i[u - o];
                e.restore()
            },
            _renderCharsFast: function(t, e, i, r, n) {
                "fillText" === t && this.fill && this.callSuper("_renderChars", t, e, i, r, n), "strokeText" === t && (this.stroke && this.strokeWidth > 0 || this.skipFillStrokeCheck) && this.callSuper("_renderChars", t, e, i, r, n)
            },
            _renderChar: function(t, e, i, r, n, s, o, a) {
                var h, c, l, u, f, d, g, p, v, b = this._getStyleDeclaration(i, r);
                if (b ? (c = this._getHeightOfChar(e, n, i, r), u = b.stroke, l = b.fill, d = b.textDecoration) : c = this.fontSize, u = (u || this.stroke) && "strokeText" === t, l = (l || this.fill) && "fillText" === t, b && e.save(), h = this._applyCharStylesGetWidth(e, n, i, r, b || null), d = d || this.textDecoration, b && b.textBackgroundColor && this._removeShadow(e), 0 !== this.charSpacing) {
                    p = this._getWidthOfCharSpacing(), g = n.split(""), h = 0;
                    for (var m, y = 0, _ = g.length; y < _; y++) m = g[y], l && e.fillText(m, s + h, o), u && e.strokeText(m, s + h, o), v = e.measureText(m).width + p, h += v > 0 ? v : 0
                } else l && e.fillText(n, s, o), u && e.strokeText(n, s, o);
                (d || "" !== d) && (f = this._fontSizeFraction * a / this.lineHeight, this._renderCharDecoration(e, d, s, o, f, h, c)), b && e.restore(), e.translate(h, 0)
            },
            _hasStyleChanged: function(t, e) {
                return t.fill !== e.fill || t.fontSize !== e.fontSize || t.textBackgroundColor !== e.textBackgroundColor || t.textDecoration !== e.textDecoration || t.fontFamily !== e.fontFamily || t.fontWeight !== e.fontWeight || t.fontStyle !== e.fontStyle || t.stroke !== e.stroke || t.strokeWidth !== e.strokeWidth
            },
            _renderCharDecoration: function(t, e, i, r, n, s, o) {
                if (e) {
                    var a, h, c = o / 15,
                        l = {
                            underline: r + o / 10,
                            "line-through": r - o * (this._fontSizeFraction + this._fontSizeMult - 1) + c,
                            overline: r - (this._fontSizeMult - this._fontSizeFraction) * o
                        },
                        u = ["underline", "line-through", "overline"];
                    for (a = 0; a < u.length; a++) h = u[a], e.indexOf(h) > -1 && t.fillRect(i, l[h], s, c)
                }
            },
            _renderTextLine: function(t, e, i, r, n, s) {
                this.isEmptyStyles() || (n += this.fontSize * (this._fontSizeFraction + .03)), this.callSuper("_renderTextLine", t, e, i, r, n, s)
            },
            _renderTextDecoration: function(t) {
                if (this.isEmptyStyles()) return this.callSuper("_renderTextDecoration", t)
            },
            _renderTextLinesBackground: function(t) {
                this.callSuper("_renderTextLinesBackground", t);
                for (var e, i, r, n, s, o, a = 0, h = this._getLeftOffset(), c = this._getTopOffset(), l = 0, u = this._textLines.length; l < u; l++)
                    if (e = this._getHeightOfLine(t, l), n = this._textLines[l], "" !== n && this.styles && this._getLineStyle(l)) {
                        i = this._getLineWidth(t, l), r = this._getLineLeftOffset(i);
                        for (var f = 0, d = n.length; f < d; f++) o = this._getStyleDeclaration(l, f), o && o.textBackgroundColor && (s = n[f], t.fillStyle = o.textBackgroundColor, t.fillRect(h + r + this._getWidthOfCharsAt(t, l, f), c + a, this._getWidthOfChar(t, s, l, f) + 1, e / this.lineHeight));
                        a += e
                    } else a += e
            },
            _getCacheProp: function(t, e) {
                return t + e.fontSize + e.fontWeight + e.fontStyle
            },
            _getFontCache: function(t) {
                return fabric.charWidthsCache[t] || (fabric.charWidthsCache[t] = {}), fabric.charWidthsCache[t]
            },
            _applyCharStylesGetWidth: function(e, i, r, n, s) {
                var o, a, h, c = s || this._getStyleDeclaration(r, n),
                    l = t(c);
                if (this._applyFontStyles(l), h = this._getFontCache(l.fontFamily), a = this._getCacheProp(i, l), !c && h[a] && this.caching) return h[a];
                "string" == typeof l.shadow && (l.shadow = new fabric.Shadow(l.shadow));
                var u = l.fill || this.fill;
                return e.fillStyle = u.toLive ? u.toLive(e, this) : u, l.stroke && (e.strokeStyle = l.stroke && l.stroke.toLive ? l.stroke.toLive(e, this) : l.stroke), e.lineWidth = l.strokeWidth || this.strokeWidth, e.font = this._getFontDeclaration.call(l), l.shadow && (l.scaleX = this.scaleX, l.scaleY = this.scaleY, l.canvas = this.canvas, this._setShadow.call(l, e)), this.caching && h[a] ? h[a] : (o = e.measureText(i).width, this.caching && (h[a] = o), o)
            },
            _applyFontStyles: function(t) {
                t.fontFamily || (t.fontFamily = this.fontFamily), t.fontSize || (t.fontSize = this.fontSize), t.fontWeight || (t.fontWeight = this.fontWeight), t.fontStyle || (t.fontStyle = this.fontStyle)
            },
            _getStyleDeclaration: function(e, i, r) {
                return r ? this.styles[e] && this.styles[e][i] ? t(this.styles[e][i]) : {} : this.styles[e] && this.styles[e][i] ? this.styles[e][i] : null
            },
            _setStyleDeclaration: function(t, e, i) {
                this.styles[t][e] = i
            },
            _deleteStyleDeclaration: function(t, e) {
                delete this.styles[t][e]
            },
            _getLineStyle: function(t) {
                return this.styles[t]
            },
            _setLineStyle: function(t, e) {
                this.styles[t] = e
            },
            _deleteLineStyle: function(t) {
                delete this.styles[t]
            },
            _getWidthOfChar: function(t, e, i, r) {
                if (!this._isMeasuring && "justify" === this.textAlign && this._reSpacesAndTabs.test(e)) return this._getWidthOfSpace(t, i);
                t.save();
                var n = this._applyCharStylesGetWidth(t, e, i, r);
                return 0 !== this.charSpacing && (n += this._getWidthOfCharSpacing()), t.restore(), n > 0 ? n : 0
            },
            _getHeightOfChar: function(t, e, i) {
                var r = this._getStyleDeclaration(e, i);
                return r && r.fontSize ? r.fontSize : this.fontSize
            },
            _getWidthOfCharsAt: function(t, e, i) {
                var r, n, s = 0;
                for (r = 0; r < i; r++) n = this._textLines[e][r], s += this._getWidthOfChar(t, n, e, r);
                return s
            },
            _measureLine: function(t, e) {
                this._isMeasuring = !0;
                var i = this._getWidthOfCharsAt(t, e, this._textLines[e].length);
                return 0 !== this.charSpacing && (i -= this._getWidthOfCharSpacing()), this._isMeasuring = !1, i > 0 ? i : 0
            },
            _getWidthOfSpace: function(t, e) {
                if (this.__widthOfSpace[e]) return this.__widthOfSpace[e];
                var i = this._textLines[e],
                    r = this._getWidthOfWords(t, i, e, 0),
                    n = this.width - r,
                    s = i.length - i.replace(this._reSpacesAndTabs, "").length,
                    o = Math.max(n / s, t.measureText(" ").width);
                return this.__widthOfSpace[e] = o, o
            },
            _getWidthOfWords: function(t, e, i, r) {
                for (var n = 0, s = 0; s < e.length; s++) {
                    var o = e[s];
                    o.match(/\s/) || (n += this._getWidthOfChar(t, o, i, s + r))
                }
                return n
            },
            _getHeightOfLine: function(t, e) {
                if (this.__lineHeights[e]) return this.__lineHeights[e];
                for (var i = this._textLines[e], r = this._getHeightOfChar(t, e, 0), n = 1, s = i.length; n < s; n++) {
                    var o = this._getHeightOfChar(t, e, n);
                    o > r && (r = o)
                }
                return this.__lineHeights[e] = r * this.lineHeight * this._fontSizeMult, this.__lineHeights[e]
            },
            _getTextHeight: function(t) {
                for (var e, i = 0, r = 0, n = this._textLines.length; r < n; r++) e = this._getHeightOfLine(t, r), i += r === n - 1 ? e / this.lineHeight : e;
                return i
            },
            toObject: function(e) {
                var i, r, n, s = {};
                for (i in this.styles) {
                    n = this.styles[i], s[i] = {};
                    for (r in n) s[i][r] = t(n[r])
                }
                return fabric.util.object.extend(this.callSuper("toObject", e), {
                    styles: s
                })
            }
        }), fabric.IText.fromObject = function(e) {
            return new fabric.IText(e.text, t(e))
        }
    }(),
    function() {
        var t = fabric.util.object.clone;
        fabric.util.object.extend(fabric.IText.prototype, {
            initBehavior: function() {
                this.initAddedHandler(), this.initRemovedHandler(), this.initCursorSelectionHandlers(), this.initDoubleClickSimulation()
            },
            initSelectedHandler: function() {
                this.on("selected", function() {
                    var t = this;
                    setTimeout(function() {
                        t.selected = !0
                    }, 100)
                })
            },
            initAddedHandler: function() {
                var t = this;
                this.on("added", function() {
                    this.canvas && !this.canvas._hasITextHandlers && (this.canvas._hasITextHandlers = !0, this._initCanvasHandlers()), t.canvas && (t.canvas._iTextInstances = t.canvas._iTextInstances || [], t.canvas._iTextInstances.push(t))
                })
            },
            initRemovedHandler: function() {
                var t = this;
                this.on("removed", function() {
                    t.canvas && (t.canvas._iTextInstances = t.canvas._iTextInstances || [], fabric.util.removeFromArray(t.canvas._iTextInstances, t))
                })
            },
            _initCanvasHandlers: function() {
                var t = this;
                this.canvas.on("selection:cleared", function() {
                    fabric.IText.prototype.exitEditingOnOthers(t.canvas)
                }), this.canvas.on("mouse:up", function() {
                    t.canvas._iTextInstances && t.canvas._iTextInstances.forEach(function(t) {
                        t.__isMousedown = !1
                    })
                }), this.canvas.on("object:selected", function() {
                    fabric.IText.prototype.exitEditingOnOthers(t.canvas)
                })
            },
            _tick: function() {
                this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete")
            },
            _animateCursor: function(t, e, i, r) {
                var n;
                return n = {
                    isAborted: !1,
                    abort: function() {
                        this.isAborted = !0
                    }
                }, t.animate("_currentCursorOpacity", e, {
                    duration: i,
                    onComplete: function() {
                        n.isAborted || t[r]()
                    },
                    onChange: function() {
                        t.canvas && t.selectionStart === t.selectionEnd && t.renderCursorOrSelection()
                    },
                    abort: function() {
                        return n.isAborted
                    }
                }), n
            },
            _onTickComplete: function() {
                var t = this;
                this._cursorTimeout1 && clearTimeout(this._cursorTimeout1), this._cursorTimeout1 = setTimeout(function() {
                    t._currentTickCompleteState = t._animateCursor(t, 0, this.cursorDuration / 2, "_tick")
                }, 100)
            },
            initDelayedCursor: function(t) {
                var e = this,
                    i = t ? 0 : this.cursorDelay;
                this.abortCursorAnimation(), this._currentCursorOpacity = 1, this._cursorTimeout2 = setTimeout(function() {
                    e._tick()
                }, i)
            },
            abortCursorAnimation: function() {
                var t = this._currentTickState || this._currentTickCompleteState;
                this._currentTickState && this._currentTickState.abort(), this._currentTickCompleteState && this._currentTickCompleteState.abort(), clearTimeout(this._cursorTimeout1), clearTimeout(this._cursorTimeout2), this._currentCursorOpacity = 0, t && this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx)
            },
            selectAll: function() {
                this.selectionStart = 0, this.selectionEnd = this.text.length, this._fireSelectionChanged(), this._updateTextarea()
            },
            getSelectedText: function() {
                return this.text.slice(this.selectionStart, this.selectionEnd)
            },
            findWordBoundaryLeft: function(t) {
                var e = 0,
                    i = t - 1;
                if (this._reSpace.test(this.text.charAt(i)))
                    for (; this._reSpace.test(this.text.charAt(i));) e++, i--;
                for (;
                    /\S/.test(this.text.charAt(i)) && i > -1;) e++, i--;
                return t - e
            },
            findWordBoundaryRight: function(t) {
                var e = 0,
                    i = t;
                if (this._reSpace.test(this.text.charAt(i)))
                    for (; this._reSpace.test(this.text.charAt(i));) e++, i++;
                for (;
                    /\S/.test(this.text.charAt(i)) && i < this.text.length;) e++, i++;
                return t + e
            },
            findLineBoundaryLeft: function(t) {
                for (var e = 0, i = t - 1; !/\n/.test(this.text.charAt(i)) && i > -1;) e++, i--;
                return t - e
            },
            findLineBoundaryRight: function(t) {
                for (var e = 0, i = t; !/\n/.test(this.text.charAt(i)) && i < this.text.length;) e++, i++;
                return t + e
            },
            getNumNewLinesInSelectedText: function() {
                for (var t = this.getSelectedText(), e = 0, i = 0, r = t.length; i < r; i++) "\n" === t[i] && e++;
                return e
            },
            searchWordBoundary: function(t, e) {
                for (var i = this._reSpace.test(this.text.charAt(t)) ? t - 1 : t, r = this.text.charAt(i), n = /[ \n\.,;!\?\-]/; !n.test(r) && i > 0 && i < this.text.length;) i += e, r = this.text.charAt(i);
                return n.test(r) && "\n" !== r && (i += 1 === e ? 0 : 1), i
            },
            selectWord: function(t) {
                t = t || this.selectionStart;
                var e = this.searchWordBoundary(t, -1),
                    i = this.searchWordBoundary(t, 1);
                this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()
            },
            selectLine: function(t) {
                t = t || this.selectionStart;
                var e = this.findLineBoundaryLeft(t),
                    i = this.findLineBoundaryRight(t);
                this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea()
            },
            enterEditing: function(t) {
                if (!this.isEditing && this.editable) return this.canvas && this.exitEditingOnOthers(this.canvas), this.isEditing = !0, this.initHiddenTextarea(t), this.hiddenTextarea.focus(), this._updateTextarea(), this._saveEditingProps(), this._setEditingProps(), this._textBeforeEdit = this.text, this._tick(), this.fire("editing:entered"), this.canvas ? (this.canvas.fire("text:editing:entered", {
                    target: this
                }), this.canvas.renderAll(), this.initMouseMoveHandler(), this) : this
            },
            exitEditingOnOthers: function(t) {
                t._iTextInstances && t._iTextInstances.forEach(function(t) {
                    t.selected = !1, t.isEditing && t.exitEditing()
                })
            },
            initMouseMoveHandler: function() {
                this.canvas.on("mouse:move", this.mouseMoveHandler.bind(this))
            },
            mouseMoveHandler: function(t) {
                if (this.__isMousedown && this.isEditing) {
                    var e = this.getSelectionStartFromPointer(t.e),
                        i = this.selectionStart,
                        r = this.selectionEnd;
                    e !== this.__selectionStartOnMouseDown && (e > this.__selectionStartOnMouseDown ? (this.selectionStart = this.__selectionStartOnMouseDown, this.selectionEnd = e) : (this.selectionStart = e, this.selectionEnd = this.__selectionStartOnMouseDown), this.selectionStart === i && this.selectionEnd === r || (this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()))
                }
            },
            _setEditingProps: function() {
                this.hoverCursor = "text", this.canvas && (this.canvas.defaultCursor = this.canvas.moveCursor = "text"), this.borderColor = this.editingBorderColor, this.hasControls = this.selectable = !1, this.lockMovementX = this.lockMovementY = !0
            },
            _updateTextarea: function() {
                if (this.hiddenTextarea && !this.inCompositionMode && (this.cursorOffsetCache = {}, this.hiddenTextarea.value = this.text, this.hiddenTextarea.selectionStart = this.selectionStart, this.hiddenTextarea.selectionEnd = this.selectionEnd, this.selectionStart === this.selectionEnd)) {
                    var t = this._calcTextareaPosition();
                    this.hiddenTextarea.style.left = t.left, this.hiddenTextarea.style.top = t.top, this.hiddenTextarea.style.fontSize = t.fontSize
                }
            },
            _calcTextareaPosition: function() {
                if (!this.canvas) return {
                    x: 1,
                    y: 1
                };
                var t = this.text.split(""),
                    e = this._getCursorBoundaries(t, "cursor"),
                    i = this.get2DCursorLocation(),
                    r = i.lineIndex,
                    n = i.charIndex,
                    s = this.getCurrentCharFontSize(r, n),
                    o = 0 === r && 0 === n ? this._getLineLeftOffset(this._getLineWidth(this.ctx, r)) : e.leftOffset,
                    a = this.calcTransformMatrix(),
                    h = {
                        x: e.left + o,
                        y: e.top + e.topOffset + s
                    },
                    c = this.canvas.upperCanvasEl,
                    l = c.width - s,
                    u = c.height - s;
                return h = fabric.util.transformPoint(h, a), h = fabric.util.transformPoint(h, this.canvas.viewportTransform), h.x < 0 && (h.x = 0), h.x > l && (h.x = l), h.y < 0 && (h.y = 0), h.y > u && (h.y = u), {
                    left: h.x + "px",
                    top: h.y + "px",
                    fontSize: s
                }
            },
            _saveEditingProps: function() {
                this._savedProps = {
                    hasControls: this.hasControls,
                    borderColor: this.borderColor,
                    lockMovementX: this.lockMovementX,
                    lockMovementY: this.lockMovementY,
                    hoverCursor: this.hoverCursor,
                    defaultCursor: this.canvas && this.canvas.defaultCursor,
                    moveCursor: this.canvas && this.canvas.moveCursor
                }
            },
            _restoreEditingProps: function() {
                this._savedProps && (this.hoverCursor = this._savedProps.overCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor, this.canvas.moveCursor = this._savedProps.moveCursor))
            },
            exitEditing: function() {
                var t = this._textBeforeEdit !== this.text;
                return this.selected = !1, this.isEditing = !1, this.selectable = !0, this.selectionEnd = this.selectionStart, this.hiddenTextarea && this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea), this.hiddenTextarea = null, this.abortCursorAnimation(), this._restoreEditingProps(), this._currentCursorOpacity = 0, this.fire("editing:exited"), t && this.fire("modified"), this.canvas && (this.canvas.off("mouse:move", this.mouseMoveHandler), this.canvas.fire("text:editing:exited", {
                    target: this
                }), t && this.canvas.fire("object:modified", {
                    target: this
                })), this
            },
            _removeExtraneousStyles: function() {
                for (var t in this.styles) this._textLines[t] || delete this.styles[t]
            },
            _removeCharsFromTo: function(t, e) {
                for (; e !== t;) this._removeSingleCharAndStyle(t + 1), e--;
                this.selectionStart = t, this.selectionEnd = t
            },
            _removeSingleCharAndStyle: function(t) {
                var e = "\n" === this.text[t - 1],
                    i = e ? t : t - 1;
                this.removeStyleObject(e, i), this.text = this.text.slice(0, t - 1) + this.text.slice(t), this._textLines = this._splitTextIntoLines()
            },
            insertChars: function(t, e) {
                var i;
                if (this.selectionEnd - this.selectionStart > 1 && this._removeCharsFromTo(this.selectionStart, this.selectionEnd), !e && this.isEmptyStyles()) return void this.insertChar(t, !1);
                for (var r = 0, n = t.length; r < n; r++) e && (i = fabric.copiedTextStyle[r]), this.insertChar(t[r], r < n - 1, i)
            },
            insertChar: function(t, e, i) {
                var r = "\n" === this.text[this.selectionStart];
                this.text = this.text.slice(0, this.selectionStart) + t + this.text.slice(this.selectionEnd), this._textLines = this._splitTextIntoLines(), this.insertStyleObjects(t, r, i), this.selectionStart += t.length, this.selectionEnd = this.selectionStart, e || (this._updateTextarea(), this.setCoords(), this._fireSelectionChanged(), this.fire("changed"), this.canvas && this.canvas.fire("text:changed", {
                    target: this
                }), this.canvas && this.canvas.renderAll())
            },
            insertNewlineStyleObject: function(e, i, r) {
                this.shiftLineStyles(e, 1), this.styles[e + 1] || (this.styles[e + 1] = {});
                var n = {},
                    s = {};
                if (this.styles[e] && this.styles[e][i - 1] && (n = this.styles[e][i - 1]), r) s[0] = t(n), this.styles[e + 1] = s;
                else {
                    for (var o in this.styles[e]) parseInt(o, 10) >= i && (s[parseInt(o, 10) - i] = this.styles[e][o], delete this.styles[e][o]);
                    this.styles[e + 1] = s
                }
                this._forceClearCache = !0
            },
            insertCharStyleObject: function(e, i, r) {
                var n = this.styles[e],
                    s = t(n);
                0 !== i || r || (i = 1);
                for (var o in s) {
                    var a = parseInt(o, 10);
                    a >= i && (n[a + 1] = s[a], s[a - 1] || delete n[a])
                }
                this.styles[e][i] = r || t(n[i - 1]), this._forceClearCache = !0
            },
            insertStyleObjects: function(t, e, i) {
                var r = this.get2DCursorLocation(),
                    n = r.lineIndex,
                    s = r.charIndex;
                this._getLineStyle(n) || this._setLineStyle(n, {}), "\n" === t ? this.insertNewlineStyleObject(n, s, e) : this.insertCharStyleObject(n, s, i)
            },
            shiftLineStyles: function(e, i) {
                var r = t(this.styles);
                for (var n in this.styles) {
                    var s = parseInt(n, 10);
                    s > e && (this.styles[s + i] = r[s], r[s - i] || delete this.styles[s])
                }
            },
            removeStyleObject: function(t, e) {
                var i = this.get2DCursorLocation(e),
                    r = i.lineIndex,
                    n = i.charIndex;
                this._removeStyleObject(t, i, r, n)
            },
            _getTextOnPreviousLine: function(t) {
                return this._textLines[t - 1]
            },
            _removeStyleObject: function(e, i, r, n) {
                if (e) {
                    var s = this._getTextOnPreviousLine(i.lineIndex),
                        o = s ? s.length : 0;
                    this.styles[r - 1] || (this.styles[r - 1] = {});
                    for (n in this.styles[r]) this.styles[r - 1][parseInt(n, 10) + o] = this.styles[r][n];
                    this.shiftLineStyles(i.lineIndex, -1)
                } else {
                    var a = this.styles[r];
                    a && delete a[n];
                    var h = t(a);
                    for (var c in h) {
                        var l = parseInt(c, 10);
                        l >= n && 0 !== l && (a[l - 1] = h[l], delete a[l])
                    }
                }
            },
            insertNewline: function() {
                this.insertChars("\n")
            }
        })
    }(), fabric.util.object.extend(fabric.IText.prototype, {
        initDoubleClickSimulation: function() {
            this.__lastClickTime = +new Date, this.__lastLastClickTime = +new Date, this.__lastPointer = {}, this.on("mousedown", this.onMouseDown.bind(this))
        },
        onMouseDown: function(t) {
            this.__newClickTime = +new Date;
            var e = this.canvas.getPointer(t.e);
            this.isTripleClick(e) ? (this.fire("tripleclick", t), this._stopEvent(t.e)) : this.isDoubleClick(e) && (this.fire("dblclick", t), this._stopEvent(t.e)), this.__lastLastClickTime = this.__lastClickTime, this.__lastClickTime = this.__newClickTime, this.__lastPointer = e, this.__lastIsEditing = this.isEditing, this.__lastSelected = this.selected
        },
        isDoubleClick: function(t) {
            return this.__newClickTime - this.__lastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y && this.__lastIsEditing
        },
        isTripleClick: function(t) {
            return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y
        },
        _stopEvent: function(t) {
            t.preventDefault && t.preventDefault(), t.stopPropagation && t.stopPropagation()
        },
        initCursorSelectionHandlers: function() {
            this.initSelectedHandler(), this.initMousedownHandler(), this.initMouseupHandler(), this.initClicks()
        },
        initClicks: function() {
            this.on("dblclick", function(t) {
                this.selectWord(this.getSelectionStartFromPointer(t.e))
            }), this.on("tripleclick", function(t) {
                this.selectLine(this.getSelectionStartFromPointer(t.e))
            })
        },
        initMousedownHandler: function() {
            this.on("mousedown", function(t) {
                if (this.editable) {
                    var e = this.canvas.getPointer(t.e);
                    this.__mousedownX = e.x, this.__mousedownY = e.y, this.__isMousedown = !0, this.selected && this.setCursorByClick(t.e), this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.selectionStart === this.selectionEnd && this.abortCursorAnimation(), this.renderCursorOrSelection())
                }
            })
        },
        _isObjectMoved: function(t) {
            var e = this.canvas.getPointer(t);
            return this.__mousedownX !== e.x || this.__mousedownY !== e.y
        },
        initMouseupHandler: function() {
            this.on("mouseup", function(t) {
                this.__isMousedown = !1, this.editable && !this._isObjectMoved(t.e) && (this.__lastSelected && !this.__corner && (this.enterEditing(t.e), this.selectionStart === this.selectionEnd ? this.initDelayedCursor(!0) : this.renderCursorOrSelection()), this.selected = !0)
            })
        },
        setCursorByClick: function(t) {
            var e = this.getSelectionStartFromPointer(t);
            t.shiftKey ? e < this.selectionStart ? (this.selectionEnd = this.selectionStart, this.selectionStart = e) : this.selectionEnd = e : (this.selectionStart = e, this.selectionEnd = e), this._fireSelectionChanged(), this._updateTextarea()
        },
        getSelectionStartFromPointer: function(t) {
            for (var e, i, r = this.getLocalPointer(t), n = 0, s = 0, o = 0, a = 0, h = 0, c = this._textLines.length; h < c; h++) {
                i = this._textLines[h], o += this._getHeightOfLine(this.ctx, h) * this.scaleY;
                var l = this._getLineWidth(this.ctx, h),
                    u = this._getLineLeftOffset(l);
                s = u * this.scaleX;
                for (var f = 0, d = i.length; f < d; f++) {
                    if (n = s, s += this._getWidthOfChar(this.ctx, i[f], h, this.flipX ? d - f : f) * this.scaleX, !(o <= r.y || s <= r.x)) return this._getNewSelectionStartFromOffset(r, n, s, a + h, d);
                    a++
                }
                if (r.y < o) return this._getNewSelectionStartFromOffset(r, n, s, a + h - 1, d)
            }
            if ("undefined" == typeof e) return this.text.length
        },
        _getNewSelectionStartFromOffset: function(t, e, i, r, n) {
            var s = t.x - e,
                o = i - t.x,
                a = o > s ? 0 : 1,
                h = r + a;
            return this.flipX && (h = n - h), h > this.text.length && (h = this.text.length), h
        }
    }), fabric.util.object.extend(fabric.IText.prototype, {
        initHiddenTextarea: function() {
            this.hiddenTextarea = fabric.document.createElement("textarea"), this.hiddenTextarea.setAttribute("autocapitalize", "off");
            var t = this._calcTextareaPosition();
            this.hiddenTextarea.style.cssText = "position: absolute; top: " + t.top + "; left: " + t.left + "; opacity: 0; width: 0px; height: 0px; z-index: -999;", fabric.document.body.appendChild(this.hiddenTextarea), fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this)), fabric.util.addListener(this.hiddenTextarea, "keyup", this.onKeyUp.bind(this)), fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this)), fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "cut", this.cut.bind(this)), fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionstart", this.onCompositionStart.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionupdate", this.onCompositionUpdate.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionend", this.onCompositionEnd.bind(this)), !this._clickHandlerInitialized && this.canvas && (fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this)), this._clickHandlerInitialized = !0)
        },
        _keysMap: {
            8: "removeChars",
            9: "exitEditing",
            27: "exitEditing",
            13: "insertNewline",
            33: "moveCursorUp",
            34: "moveCursorDown",
            35: "moveCursorRight",
            36: "moveCursorLeft",
            37: "moveCursorLeft",
            38: "moveCursorUp",
            39: "moveCursorRight",
            40: "moveCursorDown",
            46: "forwardDelete"
        },
        _ctrlKeysMapUp: {
            67: "copy",
            88: "cut"
        },
        _ctrlKeysMapDown: {
            65: "selectAll"
        },
        onClick: function() {
            this.hiddenTextarea && this.hiddenTextarea.focus()
        },
        onKeyDown: function(t) {
            if (this.isEditing) {
                if (t.keyCode in this._keysMap) this[this._keysMap[t.keyCode]](t);
                else {
                    if (!(t.keyCode in this._ctrlKeysMapDown && (t.ctrlKey || t.metaKey))) return;
                    this[this._ctrlKeysMapDown[t.keyCode]](t)
                }
                t.stopImmediatePropagation(), t.preventDefault(), this.canvas && this.canvas.renderAll()
            }
        },
        onKeyUp: function(t) {
            return !this.isEditing || this._copyDone ? void(this._copyDone = !1) : void(t.keyCode in this._ctrlKeysMapUp && (t.ctrlKey || t.metaKey) && (this[this._ctrlKeysMapUp[t.keyCode]](t), t.stopImmediatePropagation(), t.preventDefault(), this.canvas && this.canvas.renderAll()))
        },
        onInput: function(t) {
            if (this.isEditing && !this.inCompositionMode) {
                var e, i, r, n = this.selectionStart || 0,
                    s = this.selectionEnd || 0,
                    o = this.text.length,
                    a = this.hiddenTextarea.value.length;
                a > o ? (r = "left" === this._selectionDirection ? s : n, e = a - o, i = this.hiddenTextarea.value.slice(r, r + e)) : (e = a - o + s - n, i = this.hiddenTextarea.value.slice(n, n + e)), this.insertChars(i), t.stopPropagation()
            }
        },
        onCompositionStart: function() {
            this.inCompositionMode = !0, this.prevCompositionLength = 0, this.compositionStart = this.selectionStart
        },
        onCompositionEnd: function() {
            this.inCompositionMode = !1
        },
        onCompositionUpdate: function(t) {
            var e = t.data;
            this.selectionStart = this.compositionStart, this.selectionEnd = this.selectionEnd === this.selectionStart ? this.compositionStart + this.prevCompositionLength : this.selectionEnd, this.insertChars(e, !1), this.prevCompositionLength = e.length
        },
        forwardDelete: function(t) {
            if (this.selectionStart === this.selectionEnd) {
                if (this.selectionStart === this.text.length) return;
                this.moveCursorRight(t)
            }
            this.removeChars(t)
        },
        copy: function(t) {
            if (this.selectionStart !== this.selectionEnd) {
                var e = this.getSelectedText(),
                    i = this._getClipboardData(t);
                i && i.setData("text", e), fabric.copiedText = e, fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd), t.stopImmediatePropagation(), t.preventDefault(), this._copyDone = !0
            }
        },
        paste: function(t) {
            var e = null,
                i = this._getClipboardData(t),
                r = !0;
            i ? (e = i.getData("text").replace(/\r/g, ""), fabric.copiedTextStyle && fabric.copiedText === e || (r = !1)) : e = fabric.copiedText, e && this.insertChars(e, r), t.stopImmediatePropagation(), t.preventDefault()
        },
        cut: function(t) {
            this.selectionStart !== this.selectionEnd && (this.copy(t), this.removeChars(t))
        },
        _getClipboardData: function(t) {
            return t && t.clipboardData || fabric.window.clipboardData
        },
        getDownCursorOffset: function(t, e) {
            var i, r, n = e ? this.selectionEnd : this.selectionStart,
                s = this.get2DCursorLocation(n),
                o = s.lineIndex,
                a = this._textLines[o].slice(0, s.charIndex),
                h = this._textLines[o].slice(s.charIndex),
                c = this._textLines[o + 1] || "";
            if (o === this._textLines.length - 1 || t.metaKey || 34 === t.keyCode) return this.text.length - n;
            var l = this._getLineWidth(this.ctx, o);
            r = this._getLineLeftOffset(l);
            for (var u = r, f = 0, d = a.length; f < d; f++) i = a[f], u += this._getWidthOfChar(this.ctx, i, o, f);
            var g = this._getIndexOnNextLine(s, c, u);
            return h.length + 1 + g
        },
        _getIndexOnNextLine: function(t, e, i) {
            for (var r, n = t.lineIndex + 1, s = this._getLineWidth(this.ctx, n), o = this._getLineLeftOffset(s), a = o, h = 0, c = 0, l = e.length; c < l; c++) {
                var u = e[c],
                    f = this._getWidthOfChar(this.ctx, u, n, c);
                if (a += f, a > i) {
                    r = !0;
                    var d = a - f,
                        g = a,
                        p = Math.abs(d - i),
                        v = Math.abs(g - i);
                    h = v < p ? c + 1 : c;
                    break
                }
            }
            return r || (h = e.length), h
        },
        moveCursorDown: function(t) {
            this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length || this._moveCursorUpOrDown("Down", t)
        },
        moveCursorDownWithoutShift: function(t) {
            return this._selectionDirection = "right", this.selectionEnd = this.selectionEnd + t, this.selectionStart = this.selectionEnd, 0 !== t
        },
        swapSelectionPoints: function() {
            var t = this.selectionEnd;
            this.selectionEnd = this.selectionStart, this.selectionStart = t
        },
        moveCursorDownWithShift: function(t) {
            return this.selectionEnd === this.selectionStart && (this._selectionDirection = "right"), "right" === this._selectionDirection ? this.selectionEnd += t : this.selectionStart += t, this.selectionEnd < this.selectionStart && "left" === this._selectionDirection && (this.swapSelectionPoints(), this._selectionDirection = "right"), this.selectionEnd > this.text.length && (this.selectionEnd = this.text.length), 0 !== t
        },
        getUpCursorOffset: function(t, e) {
            var i = e ? this.selectionEnd : this.selectionStart,
                r = this.get2DCursorLocation(i),
                n = r.lineIndex;
            if (0 === n || t.metaKey || 33 === t.keyCode) return i;
            for (var s, o = this._textLines[n].slice(0, r.charIndex), a = this._textLines[n - 1] || "", h = this._getLineWidth(this.ctx, r.lineIndex), c = this._getLineLeftOffset(h), l = c, u = 0, f = o.length; u < f; u++) s = o[u], l += this._getWidthOfChar(this.ctx, s, n, u);
            var d = this._getIndexOnPrevLine(r, a, l);
            return a.length - d + o.length
        },
        _getIndexOnPrevLine: function(t, e, i) {
            for (var r, n = t.lineIndex - 1, s = this._getLineWidth(this.ctx, n), o = this._getLineLeftOffset(s), a = o, h = 0, c = 0, l = e.length; c < l; c++) {
                var u = e[c],
                    f = this._getWidthOfChar(this.ctx, u, n, c);
                if (a += f, a > i) {
                    r = !0;
                    var d = a - f,
                        g = a,
                        p = Math.abs(d - i),
                        v = Math.abs(g - i);
                    h = v < p ? c : c - 1;
                    break
                }
            }
            return r || (h = e.length - 1), h
        },
        moveCursorUp: function(t) {
            0 === this.selectionStart && 0 === this.selectionEnd || this._moveCursorUpOrDown("Up", t)
        },
        _moveCursorUpOrDown: function(t, e) {
            var i = "get" + t + "CursorOffset",
                r = "moveCursor" + t,
                n = this[i](e, "right" === this._selectionDirection);
            r += e.shiftKey ? "WithShift" : "WithoutShift", this[r](n) && (this.abortCursorAnimation(), this._currentCursorOpacity = 1, this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
        },
        moveCursorUpWithShift: function(t) {
            return this.selectionEnd === this.selectionStart && (this._selectionDirection = "left"), "right" === this._selectionDirection ? this.selectionEnd -= t : this.selectionStart -= t, this.selectionEnd < this.selectionStart && "right" === this._selectionDirection && (this.swapSelectionPoints(), this._selectionDirection = "left"), 0 !== t
        },
        moveCursorUpWithoutShift: function(t) {
            return this._selectionDirection = "left", this.selectionStart -= t, this.selectionEnd = this.selectionStart, 0 !== t
        },
        moveCursorLeft: function(t) {
            0 === this.selectionStart && 0 === this.selectionEnd || this._moveCursorLeftOrRight("Left", t)
        },
        _move: function(t, e, i) {
            var r;
            if (t.altKey) r = this["findWordBoundary" + i](this[e]);
            else {
                if (!t.metaKey && 35 !== t.keyCode && 36 !== t.keyCode) return this[e] += "Left" === i ? -1 : 1, !0;
                r = this["findLineBoundary" + i](this[e])
            }
            if (void 0 !== typeof r && this[e] !== r) return this[e] = r, !0
        },
        _moveLeft: function(t, e) {
            return this._move(t, e, "Left")
        },
        _moveRight: function(t, e) {
            return this._move(t, e, "Right")
        },
        moveCursorLeftWithoutShift: function(t) {
            var e = !0;
            return this._selectionDirection = "left", this.selectionEnd === this.selectionStart && 0 !== this.selectionStart && (e = this._moveLeft(t, "selectionStart")), this.selectionEnd = this.selectionStart, e
        },
        moveCursorLeftWithShift: function(t) {
            return "right" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveLeft(t, "selectionEnd") : 0 !== this.selectionStart ? (this._selectionDirection = "left", this._moveLeft(t, "selectionStart")) : void 0
        },
        moveCursorRight: function(t) {
            this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length || this._moveCursorLeftOrRight("Right", t)
        },
        _moveCursorLeftOrRight: function(t, e) {
            var i = "moveCursor" + t + "With";
            this._currentCursorOpacity = 1, i += e.shiftKey ? "Shift" : "outShift", this[i](e) && (this.abortCursorAnimation(), this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
        },
        moveCursorRightWithShift: function(t) {
            return "left" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveRight(t, "selectionStart") : this.selectionEnd !== this.text.length ? (this._selectionDirection = "right", this._moveRight(t, "selectionEnd")) : void 0
        },
        moveCursorRightWithoutShift: function(t) {
            var e = !0;
            return this._selectionDirection = "right", this.selectionStart === this.selectionEnd ? (e = this._moveRight(t, "selectionStart"), this.selectionEnd = this.selectionStart) : this.selectionStart = this.selectionEnd, e
        },
        removeChars: function(t) {
            this.selectionStart === this.selectionEnd ? this._removeCharsNearCursor(t) : this._removeCharsFromTo(this.selectionStart, this.selectionEnd), this.setSelectionEnd(this.selectionStart), this._removeExtraneousStyles(), this.canvas && this.canvas.renderAll(), this.setCoords(), this.fire("changed"), this.canvas && this.canvas.fire("text:changed", {
                target: this
            })
        },
        _removeCharsNearCursor: function(t) {
            if (0 !== this.selectionStart)
                if (t.metaKey) {
                    var e = this.findLineBoundaryLeft(this.selectionStart);
                    this._removeCharsFromTo(e, this.selectionStart), this.setSelectionStart(e)
                } else if (t.altKey) {
                var i = this.findWordBoundaryLeft(this.selectionStart);
                this._removeCharsFromTo(i, this.selectionStart), this.setSelectionStart(i)
            } else this._removeSingleCharAndStyle(this.selectionStart), this.setSelectionStart(this.selectionStart - 1)
        }
    }),
    function() {
        var t = fabric.util.toFixed,
            e = fabric.Object.NUM_FRACTION_DIGITS;
        fabric.util.object.extend(fabric.IText.prototype, {
            _setSVGTextLineText: function(t, e, i, r, n, s) {
                this._getLineStyle(t) ? this._setSVGTextLineChars(t, e, i, r, s) : fabric.Text.prototype._setSVGTextLineText.call(this, t, e, i, r, n)
            },
            _setSVGTextLineChars: function(t, e, i, r, n) {
                for (var s = this._textLines[t], o = 0, a = this._getLineLeftOffset(this._getLineWidth(this.ctx, t)) - this.width / 2, h = this._getSVGLineTopOffset(t), c = this._getHeightOfLine(this.ctx, t), l = 0, u = s.length; l < u; l++) {
                    var f = this._getStyleDeclaration(t, l) || {};
                    e.push(this._createTextCharSpan(s[l], f, a, h.lineTop + h.offset, o));
                    var d = this._getWidthOfChar(this.ctx, s[l], t, l);
                    f.textBackgroundColor && n.push(this._createTextCharBg(f, a, h.lineTop, c, d, o)), o += d
                }
            },
            _getSVGLineTopOffset: function(t) {
                for (var e = 0, i = 0, r = 0; r < t; r++) e += this._getHeightOfLine(this.ctx, r);
                return i = this._getHeightOfLine(this.ctx, r), {
                    lineTop: e,
                    offset: (this._fontSizeMult - this._fontSizeFraction) * i / (this.lineHeight * this._fontSizeMult)
                }
            },
            _createTextCharBg: function(i, r, n, s, o, a) {
                return ['\t\t<rect fill="', i.textBackgroundColor, '" x="', t(r + a, e), '" y="', t(n - this.height / 2, e), '" width="', t(o, e), '" height="', t(s / this.lineHeight, e), '"></rect>\n'].join("")
            },
            _createTextCharSpan: function(i, r, n, s, o) {
                var a = this.getSvgStyles.call(fabric.util.object.extend({
                    visible: !0,
                    fill: this.fill,
                    stroke: this.stroke,
                    type: "text",
                    getSvgFilter: fabric.Object.prototype.getSvgFilter
                }, r));
                return ['\t\t\t<tspan x="', t(n + o, e), '" y="', t(s - this.height / 2, e), '" ', r.fontFamily ? 'font-family="' + r.fontFamily.replace(/"/g, "'") + '" ' : "", r.fontSize ? 'font-size="' + r.fontSize + '" ' : "", r.fontStyle ? 'font-style="' + r.fontStyle + '" ' : "", r.fontWeight ? 'font-weight="' + r.fontWeight + '" ' : "", r.textDecoration ? 'text-decoration="' + r.textDecoration + '" ' : "", 'style="', a, '">', fabric.util.string.escapeXml(i), "</tspan>\n"].join("")
            }
        })
    }(),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.clone;
        e.Textbox = e.util.createClass(e.IText, e.Observable, {
            type: "textbox",
            minWidth: 20,
            dynamicMinWidth: 0,
            __cachedLines: null,
            lockScalingY: !0,
            lockScalingFlip: !0,
            initialize: function(t, i) {
                this.ctx = e.util.createCanvasElement().getContext("2d"), this.callSuper("initialize", t, i), this.setControlsVisibility(e.Textbox.getTextboxControlVisibility()), this._dimensionAffectingProps.width = !0
            },
            _initDimensions: function(t) {
                this.__skipDimension || (t || (t = e.util.createCanvasElement().getContext("2d"), this._setTextStyles(t)), this.dynamicMinWidth = 0, this._textLines = this._splitTextIntoLines(), this.dynamicMinWidth > this.width && this._set("width", this.dynamicMinWidth), this._clearCache(), this.height = this._getTextHeight(t))
            },
            _generateStyleMap: function() {
                for (var t = 0, e = 0, i = 0, r = {}, n = 0; n < this._textLines.length; n++) "\n" === this.text[i] ? (e = 0, i++, t++) : " " === this.text[i] && (e++, i++), r[n] = {
                    line: t,
                    offset: e
                }, i += this._textLines[n].length, e += this._textLines[n].length;
                return r
            },
            _getStyleDeclaration: function(t, e, i) {
                if (this._styleMap) {
                    var r = this._styleMap[t];
                    if (!r) return i ? {} : null;
                    t = r.line, e = r.offset + e
                }
                return this.callSuper("_getStyleDeclaration", t, e, i)
            },
            _setStyleDeclaration: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, this.styles[t][e] = i
            },
            _deleteStyleDeclaration: function(t, e) {
                var i = this._styleMap[t];
                t = i.line, e = i.offset + e, delete this.styles[t][e]
            },
            _getLineStyle: function(t) {
                var e = this._styleMap[t];
                return this.styles[e.line]
            },
            _setLineStyle: function(t, e) {
                var i = this._styleMap[t];
                this.styles[i.line] = e
            },
            _deleteLineStyle: function(t) {
                var e = this._styleMap[t];
                delete this.styles[e.line]
            },
            _wrapText: function(t, e) {
                var i, r = e.split(this._reNewline),
                    n = [];
                for (i = 0; i < r.length; i++) n = n.concat(this._wrapLine(t, r[i], i));
                return n
            },
            _measureText: function(t, e, i, r) {
                var n = 0;
                r = r || 0;
                for (var s = 0, o = e.length; s < o; s++) n += this._getWidthOfChar(t, e[s], i, s + r);
                return n
            },
            _wrapLine: function(t, e, i) {
                for (var r = 0, n = [], s = "", o = e.split(" "), a = "", h = 0, c = " ", l = 0, u = 0, f = 0, d = !0, g = this._getWidthOfCharSpacing(), p = 0; p < o.length; p++) a = o[p], l = this._measureText(t, a, i, h), h += a.length, r += u + l - g, r >= this.width && !d ? (n.push(s), s = "", r = l, d = !0) : r += g, d || (s += c), s += a, u = this._measureText(t, c, i, h), h++, d = !1, l > f && (f = l);
                return p && n.push(s), f > this.dynamicMinWidth && (this.dynamicMinWidth = f - g), n
            },
            _splitTextIntoLines: function() {
                var t = this.textAlign;
                this.ctx.save(), this._setTextStyles(this.ctx), this.textAlign = "left";
                var e = this._wrapText(this.ctx, this.text);
                return this.textAlign = t, this.ctx.restore(), this._textLines = e, this._styleMap = this._generateStyleMap(), e
            },
            setOnGroup: function(t, e) {
                "scaleX" === t && (this.set("scaleX", Math.abs(1 / e)), this.set("width", this.get("width") * e / ("undefined" == typeof this.__oldScaleX ? 1 : this.__oldScaleX)), this.__oldScaleX = e)
            },
            get2DCursorLocation: function(t) {
                "undefined" == typeof t && (t = this.selectionStart);
                for (var e = this._textLines.length, i = 0, r = 0; r < e; r++) {
                    var n = this._textLines[r],
                        s = n.length;
                    if (t <= i + s) return {
                        lineIndex: r,
                        charIndex: t - i
                    };
                    i += s, "\n" !== this.text[i] && " " !== this.text[i] || i++
                }
                return {
                    lineIndex: e - 1,
                    charIndex: this._textLines[e - 1].length
                }
            },
            _getCursorBoundariesOffsets: function(t, e) {
                for (var i = 0, r = 0, n = this.get2DCursorLocation(), s = this._textLines[n.lineIndex].split(""), o = this._getLineLeftOffset(this._getLineWidth(this.ctx, n.lineIndex)), a = 0; a < n.charIndex; a++) r += this._getWidthOfChar(this.ctx, s[a], n.lineIndex, a);
                for (a = 0; a < n.lineIndex; a++) i += this._getHeightOfLine(this.ctx, a);
                return "cursor" === e && (i += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, n.lineIndex) / this.lineHeight - this.getCurrentCharFontSize(n.lineIndex, n.charIndex) * (1 - this._fontSizeFraction)), {
                    top: i,
                    left: r,
                    lineLeft: o
                }
            },
            getMinWidth: function() {
                return Math.max(this.minWidth, this.dynamicMinWidth)
            },
            toObject: function(t) {
                return e.util.object.extend(this.callSuper("toObject", t), {
                    minWidth: this.minWidth
                })
            }
        }), e.Textbox.fromObject = function(t) {
            return new e.Textbox(t.text, i(t))
        }, e.Textbox.getTextboxControlVisibility = function() {
            return {
                tl: !1,
                tr: !1,
                br: !1,
                bl: !1,
                ml: !0,
                mt: !1,
                mr: !0,
                mb: !1,
                mtr: !0
            }
        }
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.Canvas.prototype._setObjectScale;
        fabric.Canvas.prototype._setObjectScale = function(e, i, r, n, s, o, a) {
            var h = i.target;
            if (!(h instanceof fabric.Textbox)) return t.call(fabric.Canvas.prototype, e, i, r, n, s, o, a);
            var c = h.width * (e.x / i.scaleX / (h.width + h.strokeWidth));
            return c >= h.getMinWidth() ? (h.set("width", c), !0) : void 0
        }, fabric.Group.prototype._refreshControlsVisibility = function() {
            if ("undefined" != typeof fabric.Textbox)
                for (var t = this._objects.length; t--;)
                    if (this._objects[t] instanceof fabric.Textbox) return void this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility())
        };
        var e = fabric.util.object.clone;
        fabric.util.object.extend(fabric.Textbox.prototype, {
            _removeExtraneousStyles: function() {
                for (var t in this._styleMap) this._textLines[t] || delete this.styles[this._styleMap[t].line]
            },
            insertCharStyleObject: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, fabric.IText.prototype.insertCharStyleObject.apply(this, [t, e, i])
            },
            insertNewlineStyleObject: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, fabric.IText.prototype.insertNewlineStyleObject.apply(this, [t, e, i])
            },
            shiftLineStyles: function(t, i) {
                var r = e(this.styles),
                    n = this._styleMap[t];
                t = n.line;
                for (var s in this.styles) {
                    var o = parseInt(s, 10);
                    o > t && (this.styles[o + i] = r[o], r[o - i] || delete this.styles[o])
                }
            },
            _getTextOnPreviousLine: function(t) {
                for (var e = this._textLines[t - 1]; this._styleMap[t - 2] && this._styleMap[t - 2].line === this._styleMap[t - 1].line;) e = this._textLines[t - 2] + e, t--;
                return e
            },
            removeStyleObject: function(t, e) {
                var i = this.get2DCursorLocation(e),
                    r = this._styleMap[i.lineIndex],
                    n = r.line,
                    s = r.offset + i.charIndex;
                this._removeStyleObject(t, i, n, s)
            }
        })
    }(),
    function() {
        var t = fabric.IText.prototype._getNewSelectionStartFromOffset;
        fabric.IText.prototype._getNewSelectionStartFromOffset = function(e, i, r, n, s) {
            n = t.call(this, e, i, r, n, s);
            for (var o = 0, a = 0, h = 0; h < this._textLines.length && (o += this._textLines[h].length, !(o + a >= n)); h++) "\n" !== this.text[o + a] && " " !== this.text[o + a] || a++;
            return n - h + a
        }
    }(),
    function() {
        function request(t, e, i) {
            var r = URL.parse(t);
            r.port || (r.port = 0 === r.protocol.indexOf("https:") ? 443 : 80);
            var n = 0 === r.protocol.indexOf("https:") ? HTTPS : HTTP,
                s = n.request({
                    hostname: r.hostname,
                    port: r.port,
                    path: r.path,
                    method: "GET"
                }, function(t) {
                    var r = "";
                    e && t.setEncoding(e), t.on("end", function() {
                        i(r)
                    }), t.on("data", function(e) {
                        200 === t.statusCode && (r += e)
                    })
                });
            s.on("error", function(t) {
                t.errno === process.ECONNREFUSED ? fabric.log("ECONNREFUSED: connection refused to " + r.hostname + ":" + r.port) : fabric.log(t.message), i(null)
            }), s.end()
        }

        function requestFs(t, e) {
            var i = require("fs");
            i.readFile(t, function(t, i) {
                if (t) throw fabric.log(t), t;
                e(i)
            })
        }
        if ("undefined" == typeof document || "undefined" == typeof window) {
            var DOMParser = require("xmldom").DOMParser,
                URL = require("url"),
                HTTP = require("http"),
                HTTPS = require("https"),
                Canvas = require("canvas"),
                Image = require("canvas").Image;
            fabric.util.loadImage = function(t, e, i) {
                function r(r) {
                    r ? (n.src = new Buffer(r, "binary"), n._src = t, e && e.call(i, n)) : (n = null, e && e.call(i, null, !0))
                }
                var n = new Image;
                t && (t instanceof Buffer || 0 === t.indexOf("data")) ? (n.src = n._src = t, e && e.call(i, n)) : t && 0 !== t.indexOf("http") ? requestFs(t, r) : t ? request(t, "binary", r) : e && e.call(i, t)
            }, fabric.loadSVGFromURL = function(t, e, i) {
                t = t.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim(), 0 !== t.indexOf("http") ? requestFs(t, function(t) {
                    fabric.loadSVGFromString(t.toString(), e, i)
                }) : request(t, "", function(t) {
                    fabric.loadSVGFromString(t, e, i)
                })
            }, fabric.loadSVGFromString = function(t, e, i) {
                var r = (new DOMParser).parseFromString(t);
                fabric.parseSVGDocument(r.documentElement, function(t, i) {
                    e && e(t, i)
                }, i)
            }, fabric.util.getScript = function(url, callback) {
                request(url, "", function(body) {
                    eval(body), callback && callback()
                })
            }, fabric.createCanvasForNode = function(t, e, i, r) {
                r = r || i;
                var n = fabric.document.createElement("canvas"),
                    s = new Canvas(t || 600, e || 600, r),
                    o = new Canvas(t || 600, e || 600, r);
                n.style = {}, n.width = s.width, n.height = s.height;
                var a = fabric.Canvas || fabric.StaticCanvas,
                    h = new a(n, i);
                return h.contextContainer = s.getContext("2d"), h.nodeCanvas = s, h.contextCache = o.getContext("2d"), h.nodeCacheCanvas = o, h.Font = Canvas.Font, h
            }, fabric.StaticCanvas.prototype.createPNGStream = function() {
                return this.nodeCanvas.createPNGStream()
            }, fabric.StaticCanvas.prototype.createJPEGStream = function(t) {
                return this.nodeCanvas.createJPEGStream(t)
            };
            var origSetWidth = fabric.StaticCanvas.prototype.setWidth;
            fabric.StaticCanvas.prototype.setWidth = function(t, e) {
                return origSetWidth.call(this, t, e), this.nodeCanvas.width = t, this
            }, fabric.Canvas && (fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth);
            var origSetHeight = fabric.StaticCanvas.prototype.setHeight;
            fabric.StaticCanvas.prototype.setHeight = function(t, e) {
                return origSetHeight.call(this, t, e), this.nodeCanvas.height = t, this
            }, fabric.Canvas && (fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight)
        }
    }(),
    function() {
        var t = function() {
                try {
                    var t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    if (t) return !0
                } catch (e) {
                    if (void 0 != navigator.mimeTypes["application/x-shockwave-flash"]) return !0
                }
                return !1
            },
            e = function(t, e) {
                window.XMLHttpRequest.prototype[t] = e(window.XMLHttpRequest.prototype[t])
            };
        if (window.XMLHttpRequest) {
            if (!window.FormData || window.FileAPI && FileAPI.forceLoad) {
                var i = function(t) {
                    if (!t.__listeners) {
                        t.upload || (t.upload = {}), t.__listeners = [];
                        var e = t.upload.addEventListener;
                        t.upload.addEventListener = function(i, n) {
                            t.__listeners[i] = n, e && e.apply(this, arguments)
                        }
                    }
                };
                e("open", function(t) {
                    return function(e, n, r) {
                        i(this), this.__url = n;
                        try {
                            t.apply(this, [e, n, r])
                        } catch (o) {
                            o.message.indexOf("Access is denied") > -1 && t.apply(this, [e, "_fix_for_ie_crossdomain__", r])
                        }
                    }
                }), e("getResponseHeader", function(t) {
                    return function(e) {
                        return this.__fileApiXHR && this.__fileApiXHR.getResponseHeader ? this.__fileApiXHR.getResponseHeader(e) : null == t ? null : t.apply(this, [e])
                    }
                }), e("getAllResponseHeaders", function(t) {
                    return function() {
                        return this.__fileApiXHR && this.__fileApiXHR.getAllResponseHeaders ? this.__fileApiXHR.getAllResponseHeaders() : null == t ? null : t.apply(this)
                    }
                }), e("abort", function(t) {
                    return function() {
                        return this.__fileApiXHR && this.__fileApiXHR.abort ? this.__fileApiXHR.abort() : null == t ? null : t.apply(this)
                    }
                }), e("setRequestHeader", function(t) {
                    return function(e, n) {
                        if ("__setXHR_" === e) {
                            i(this);
                            var r = n(this);
                            r instanceof Function && r(this)
                        } else this.__requestHeaders = this.__requestHeaders || {}, this.__requestHeaders[e] = n, t.apply(this, arguments)
                    }
                }), e("send", function(e) {
                    return function() {
                        var i = this;
                        if (arguments[0] && arguments[0].__isShim) {
                            var n = arguments[0],
                                r = {
                                    url: i.__url,
                                    jsonp: !1,
                                    cache: !0,
                                    complete: function(t, e) {
                                        i.__completed = !0, !t && i.__listeners.load && i.__listeners.load({
                                            type: "load",
                                            loaded: i.__loaded,
                                            total: i.__total,
                                            target: i,
                                            lengthComputable: !0
                                        }), !t && i.__listeners.loadend && i.__listeners.loadend({
                                            type: "loadend",
                                            loaded: i.__loaded,
                                            total: i.__total,
                                            target: i,
                                            lengthComputable: !0
                                        }), "abort" === t && i.__listeners.abort && i.__listeners.abort({
                                            type: "abort",
                                            loaded: i.__loaded,
                                            total: i.__total,
                                            target: i,
                                            lengthComputable: !0
                                        }), void 0 !== e.status && Object.defineProperty(i, "status", {
                                            get: function() {
                                                return 0 == e.status && t && "abort" !== t ? 500 : e.status
                                            }
                                        }), void 0 !== e.statusText && Object.defineProperty(i, "statusText", {
                                            get: function() {
                                                return e.statusText
                                            }
                                        }), Object.defineProperty(i, "readyState", {
                                            get: function() {
                                                return 4
                                            }
                                        }), void 0 !== e.response && Object.defineProperty(i, "response", {
                                            get: function() {
                                                return e.response
                                            }
                                        });
                                        var n = e.responseText || (t && 0 == e.status && "abort" !== t ? t : void 0);
                                        Object.defineProperty(i, "responseText", {
                                            get: function() {
                                                return n
                                            }
                                        }), Object.defineProperty(i, "response", {
                                            get: function() {
                                                return n
                                            }
                                        }), t && Object.defineProperty(i, "err", {
                                            get: function() {
                                                return t
                                            }
                                        }), i.__fileApiXHR = e, i.onreadystatechange && i.onreadystatechange()
                                    },
                                    fileprogress: function(t) {
                                        if (t.target = i, i.__listeners.progress && i.__listeners.progress(t), i.__total = t.total, i.__loaded = t.loaded, t.total === t.loaded) {
                                            var e = this;
                                            setTimeout(function() {
                                                i.__completed || (i.getAllResponseHeaders = function() {}, e.complete(null, {
                                                    status: 204,
                                                    statusText: "No Content"
                                                }))
                                            }, 1e4)
                                        }
                                    },
                                    headers: i.__requestHeaders
                                };
                            r.data = {}, r.files = {};
                            for (var o = 0; o < n.data.length; o++) {
                                var a = n.data[o];
                                null != a.val && null != a.val.name && null != a.val.size && null != a.val.type ? r.files[a.key] = a.val : r.data[a.key] = a.val
                            }
                            setTimeout(function() {
                                if (!t()) throw 'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';
                                i.__fileApiXHR = FileAPI.upload(r)
                            }, 1)
                        } else e.apply(i, arguments)
                    }
                })
            } else e("setRequestHeader", function(t) {
                return function(e, i) {
                    if ("__setXHR_" === e) {
                        var n = i(this);
                        n instanceof Function && n(this)
                    } else t.apply(this, arguments)
                }
            });
            window.XMLHttpRequest.__isShim = !0
        }
        if (!window.FormData || window.FileAPI && FileAPI.forceLoad) {
            var n = function(e) {
                    if (!t()) throw 'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';
                    var i = angular.element(e);
                    if (!(i.attr("disabled") || i.hasClass("js-fileapi-wrapper") || null == e.getAttribute("ng-file-select") && null == e.getAttribute("data-ng-file-select")))
                        if (FileAPI.wrapInsideDiv) {
                            var n = document.createElement("div");
                            n.innerHTML = '<div class="js-fileapi-wrapper" style="position:relative; overflow:hidden"></div>', n = n.firstChild;
                            var r = e.parentNode;
                            r.insertBefore(n, e), r.removeChild(e), n.appendChild(e)
                        } else i.addClass("js-fileapi-wrapper"), i.parent()[0].__file_click_fn_delegate_ && (("" === i.parent().css("position") || "static" === i.parent().css("position")) && i.parent().css("position", "relative"), i.css("top", 0).css("bottom", 0).css("left", 0).css("right", 0).css("width", "100%").css("height", "100%").css("padding", 0).css("margin", 0), i.parent().unbind("click", i.parent()[0].__file_click_fn_delegate_))
                },
                r = function(t) {
                    return function(e) {
                        for (var i = FileAPI.getFiles(e), n = 0; n < i.length; n++) void 0 === i[n].size && (i[n].size = 0), void 0 === i[n].name && (i[n].name = "file"), void 0 === i[n].type && (i[n].type = "undefined");
                        e.target || (e.target = {}), e.target.files = i, e.target.files != i && (e.__files_ = i), (e.__files_ || e.target.files).item = function(t) {
                            return (e.__files_ || e.target.files)[t] || null
                        }, t && t.apply(this, [e])
                    }
                },
                o = function(t, e) {
                    return ("change" === e.toLowerCase() || "onchange" === e.toLowerCase()) && "file" == t.getAttribute("type")
                };
            HTMLInputElement.prototype.addEventListener && (HTMLInputElement.prototype.addEventListener = function(t) {
                    return function(e, i, a, s) {
                        o(this, e) ? (n(this), t.apply(this, [e, r(i), a, s])) : t.apply(this, [e, i, a, s])
                    }
                }(HTMLInputElement.prototype.addEventListener)), HTMLInputElement.prototype.attachEvent && (HTMLInputElement.prototype.attachEvent = function(t) {
                    return function(e, i) {
                        o(this, e) ? (n(this), window.jQuery ? angular.element(this).bind("change", r(null)) : t.apply(this, [e, r(i)])) : t.apply(this, [e, i])
                    }
                }(HTMLInputElement.prototype.attachEvent)), window.FormData = FormData = function() {
                    return {
                        append: function(t, e, i) {
                            this.data.push({
                                key: t,
                                val: e,
                                name: i
                            })
                        },
                        data: [],
                        __isShim: !0
                    }
                },
                function() {
                    if (window.FileAPI || (window.FileAPI = {}), FileAPI.forceLoad && (FileAPI.html5 = !1), !FileAPI.upload) {
                        var e, i, n, r, o, a = document.createElement("script"),
                            s = document.getElementsByTagName("script");
                        if (window.FileAPI.jsUrl) e = window.FileAPI.jsUrl;
                        else if (window.FileAPI.jsPath) i = window.FileAPI.jsPath;
                        else
                            for (n = 0; n < s.length; n++)
                                if (o = s[n].src, r = o.indexOf("angular-file-upload-shim.js"), -1 == r && (r = o.indexOf("angular-file-upload-shim.min.js")), r > -1) {
                                    i = o.substring(0, r);
                                    break
                                }
                        null == FileAPI.staticPath && (FileAPI.staticPath = i), a.setAttribute("src", e || i + "FileAPI.min.js"), document.getElementsByTagName("head")[0].appendChild(a), FileAPI.hasFlash = t()
                    }
                }(), FileAPI.disableFileInput = function(t, e) {
                    e ? t.removeClass("js-fileapi-wrapper") : t.addClass("js-fileapi-wrapper")
                }
        }
        window.FileReader || (window.FileReader = function() {
            var t = this,
                e = !1;
            this.listeners = {}, this.addEventListener = function(e, i) {
                t.listeners[e] = t.listeners[e] || [], t.listeners[e].push(i)
            }, this.removeEventListener = function(e, i) {
                t.listeners[e] && t.listeners[e].splice(t.listeners[e].indexOf(i), 1)
            }, this.dispatchEvent = function(e) {
                var i = t.listeners[e.type];
                if (i)
                    for (var n = 0; n < i.length; n++) i[n].call(t, e)
            }, this.onabort = this.onerror = this.onload = this.onloadstart = this.onloadend = this.onprogress = null;
            var i = function(e, i) {
                    var n = {
                        type: e,
                        target: t,
                        loaded: i.loaded,
                        total: i.total,
                        error: i.error
                    };
                    return null != i.result && (n.target.result = i.result), n
                },
                n = function(n) {
                    if (e || (e = !0, t.onloadstart && this.onloadstart(i("loadstart", n))), "load" === n.type) {
                        t.onloadend && t.onloadend(i("loadend", n));
                        var r = i("load", n);
                        t.onload && t.onload(r), t.dispatchEvent(r)
                    } else if ("progress" === n.type) {
                        var r = i("progress", n);
                        t.onprogress && t.onprogress(r), t.dispatchEvent(r)
                    } else {
                        var r = i("error", n);
                        t.onerror && t.onerror(r), t.dispatchEvent(r)
                    }
                };
            this.readAsArrayBuffer = function(t) {
                FileAPI.readAsBinaryString(t, n)
            }, this.readAsBinaryString = function(t) {
                FileAPI.readAsBinaryString(t, n)
            }, this.readAsDataURL = function(t) {
                FileAPI.readAsDataURL(t, n)
            }, this.readAsText = function(t) {
                FileAPI.readAsText(t, n)
            }
        })
    }(),
    function(t, e) {
        "use strict";

        function i(t) {
            return /^-?\d+\.?\d*$/.test(t.replace(/["']/g, ""))
        }
        var n = e.isDefined,
            r = e.isUndefined,
            o = e.isNumber,
            a = e.isObject,
            s = e.isArray,
            l = e.extend,
            c = e.toJson,
            h = e.fromJson,
            u = e.module("LocalStorageModule", []);
        u.provider("localStorageService", function() {
            this.prefix = "ls", this.storageType = "localStorage", this.cookie = {
                expiry: 30,
                path: "/"
            }, this.notify = {
                setItem: !0,
                removeItem: !1
            }, this.setPrefix = function(t) {
                this.prefix = t
            }, this.setStorageType = function(t) {
                this.storageType = t
            }, this.setStorageCookie = function(t, e) {
                this.cookie = {
                    expiry: t,
                    path: e
                }
            }, this.setStorageCookieDomain = function(t) {
                this.cookie.domain = t
            }, this.setNotify = function(t, e) {
                this.notify = {
                    setItem: t,
                    removeItem: e
                }
            }, this.$get = ["$rootScope", "$window", "$document", "$parse", function(t, e, u, f) {
                var d, p = this,
                    g = p.prefix,
                    v = p.cookie,
                    m = p.notify,
                    b = p.storageType;
                u ? u[0] && (u = u[0]) : u = document, "." !== g.substr(-1) && (g = g ? g + "." : "");
                var y = function(t) {
                        return g + t
                    },
                    x = function() {
                        try {
                            var i = b in e && null !== e[b],
                                n = y("__" + Math.round(1e7 * Math.random()));
                            return i && (d = e[b], d.setItem(n, ""), d.removeItem(n)), i
                        } catch (r) {
                            return b = "cookie", t.$broadcast("LocalStorageModule.notification.error", r.message), !1
                        }
                    }(),
                    w = function(e, i) {
                        if (r(i) ? i = null : (a(i) || s(i) || o(+i || i)) && (i = c(i)), !x || "cookie" === p.storageType) return x || t.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), m.setItem && t.$broadcast("LocalStorageModule.notification.setitem", {
                            key: e,
                            newvalue: i,
                            storageType: "cookie"
                        }), T(e, i);
                        try {
                            (a(i) || s(i)) && (i = c(i)), d && d.setItem(y(e), i), m.setItem && t.$broadcast("LocalStorageModule.notification.setitem", {
                                key: e,
                                newvalue: i,
                                storageType: p.storageType
                            })
                        } catch (n) {
                            return t.$broadcast("LocalStorageModule.notification.error", n.message), T(e, i)
                        }
                        return !0
                    },
                    _ = function(e) {
                        if (!x || "cookie" === p.storageType) return x || t.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), O(e);
                        var n = d ? d.getItem(y(e)) : null;
                        return n && "null" !== n ? "{" === n.charAt(0) || "[" === n.charAt(0) || i(n) ? h(n) : n : null
                    },
                    C = function(e) {
                        if (!x || "cookie" === p.storageType) return x || t.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), m.removeItem && t.$broadcast("LocalStorageModule.notification.removeitem", {
                            key: e,
                            storageType: "cookie"
                        }), $(e);
                        try {
                            d.removeItem(y(e)), m.removeItem && t.$broadcast("LocalStorageModule.notification.removeitem", {
                                key: e,
                                storageType: p.storageType
                            })
                        } catch (i) {
                            return t.$broadcast("LocalStorageModule.notification.error", i.message), $(e)
                        }
                        return !0
                    },
                    S = function() {
                        if (!x) return t.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), !1;
                        var e = g.length,
                            i = [];
                        for (var n in d)
                            if (n.substr(0, e) === g) try {
                                i.push(n.substr(e))
                            } catch (r) {
                                return t.$broadcast("LocalStorageModule.notification.error", r.Description), []
                            }
                            return i
                    },
                    A = function(e) {
                        e = e || "";
                        var i = g.slice(0, -1),
                            n = new RegExp(i + "." + e);
                        if (!x || "cookie" === p.storageType) return x || t.$broadcast("LocalStorageModule.notification.warning", "LOCAL_STORAGE_NOT_SUPPORTED"), D();
                        var r = g.length;
                        for (var o in d)
                            if (n.test(o)) try {
                                C(o.substr(r))
                            } catch (a) {
                                return t.$broadcast("LocalStorageModule.notification.error", a.message), D()
                            }
                            return !0
                    },
                    k = function() {
                        try {
                            return navigator.cookieEnabled || "cookie" in u && (u.cookie.length > 0 || (u.cookie = "test").indexOf.call(u.cookie, "test") > -1)
                        } catch (e) {
                            return t.$broadcast("LocalStorageModule.notification.error", e.message), !1
                        }
                    },
                    T = function(e, i) {
                        if (r(i)) return !1;
                        if ((s(i) || a(i)) && (i = c(i)), !k()) return t.$broadcast("LocalStorageModule.notification.error", "COOKIES_NOT_SUPPORTED"), !1;
                        try {
                            var n = "",
                                o = new Date,
                                l = "";
                            if (null === i ? (o.setTime(o.getTime() + -864e5), n = "; expires=" + o.toGMTString(), i = "") : 0 !== v.expiry && (o.setTime(o.getTime() + 24 * v.expiry * 60 * 60 * 1e3), n = "; expires=" + o.toGMTString()), e) {
                                var h = "; path=" + v.path;
                                v.domain && (l = "; domain=" + v.domain), u.cookie = y(e) + "=" + encodeURIComponent(i) + n + h + l
                            }
                        } catch (f) {
                            return t.$broadcast("LocalStorageModule.notification.error", f.message), !1
                        }
                        return !0
                    },
                    O = function(e) {
                        if (!k()) return t.$broadcast("LocalStorageModule.notification.error", "COOKIES_NOT_SUPPORTED"), !1;
                        for (var i = u.cookie && u.cookie.split(";") || [], n = 0; n < i.length; n++) {
                            for (var r = i[n];
                                " " === r.charAt(0);) r = r.substring(1, r.length);
                            if (0 === r.indexOf(y(e) + "=")) {
                                var o = decodeURIComponent(r.substring(g.length + e.length + 1, r.length));
                                try {
                                    var a = JSON.parse(o);
                                    return h(a)
                                } catch (s) {
                                    return o
                                }
                            }
                        }
                        return null
                    },
                    $ = function(t) {
                        T(t, null)
                    },
                    D = function() {
                        for (var t = null, e = g.length, i = u.cookie.split(";"), n = 0; n < i.length; n++) {
                            for (t = i[n];
                                " " === t.charAt(0);) t = t.substring(1, t.length);
                            var r = t.substring(e, t.indexOf("="));
                            $(r)
                        }
                    },
                    M = function() {
                        return b
                    },
                    E = function(t, e, i, r) {
                        r = r || e;
                        var o = _(r);
                        return null === o && n(i) ? o = i : a(o) && a(i) && (o = l(i, o)), f(e).assign(t, o), t.$watch(e, function(t) {
                            w(r, t)
                        }, a(t[e]))
                    },
                    P = function() {
                        for (var t = 0, i = e[b], n = 0; n < i.length; n++) 0 === i.key(n).indexOf(g) && t++;
                        return t
                    };
                return {
                    isSupported: x,
                    getStorageType: M,
                    set: w,
                    add: w,
                    get: _,
                    keys: S,
                    remove: C,
                    clearAll: A,
                    bind: E,
                    deriveKey: y,
                    length: P,
                    cookie: {
                        set: T,
                        add: T,
                        get: O,
                        remove: $,
                        clearAll: D
                    }
                }
            }]
        })
    }(window, window.angular),
    function() {
        var t = angular.module("angularFileUpload", []);
        t.service("$upload", ["$http", "$q", "$timeout", function(t, e, i) {
            function n(n) {
                n.method = n.method || "POST", n.headers = n.headers || {}, n.transformRequest = n.transformRequest || function(e, i) {
                    return window.ArrayBuffer && e instanceof window.ArrayBuffer ? e : t.defaults.transformRequest[0](e, i)
                };
                var r = e.defer();
                window.XMLHttpRequest.__isShim && (n.headers.__setXHR_ = function() {
                    return function(t) {
                        t && (n.__XHR = t, n.xhrFn && n.xhrFn(t), t.upload.addEventListener("progress", function(t) {
                            r.notify(t)
                        }, !1), t.upload.addEventListener("load", function(t) {
                            t.lengthComputable && r.notify(t)
                        }, !1))
                    }
                }), t(n).then(function(t) {
                    r.resolve(t)
                }, function(t) {
                    r.reject(t)
                }, function(t) {
                    r.notify(t)
                });
                var o = r.promise;
                return o.success = function(t) {
                    return o.then(function(e) {
                        t(e.data, e.status, e.headers, n)
                    }), o
                }, o.error = function(t) {
                    return o.then(null, function(e) {
                        t(e.data, e.status, e.headers, n)
                    }), o
                }, o.progress = function(t) {
                    return o.then(null, null, function(e) {
                        t(e)
                    }), o
                }, o.abort = function() {
                    return n.__XHR && i(function() {
                        n.__XHR.abort()
                    }), o
                }, o.xhr = function(t) {
                    return n.xhrFn = function(e) {
                        return function() {
                            e && e.apply(o, arguments), t.apply(o, arguments)
                        }
                    }(n.xhrFn), o
                }, o
            }
            this.upload = function(e) {
                e.headers = e.headers || {}, e.headers["Content-Type"] = void 0, e.transformRequest = e.transformRequest || t.defaults.transformRequest;
                var i = new FormData,
                    r = e.transformRequest,
                    o = e.data;
                return e.transformRequest = function(t, i) {
                    if (o)
                        if (e.formDataAppender)
                            for (var n in o) {
                                var a = o[n];
                                e.formDataAppender(t, n, a)
                            } else
                                for (var n in o) {
                                    var a = o[n];
                                    if ("function" == typeof r) a = r(a, i);
                                    else
                                        for (var s = 0; s < r.length; s++) {
                                            var l = r[s];
                                            "function" == typeof l && (a = l(a, i))
                                        }
                                    t.append(n, a)
                                }
                        if (null != e.file) {
                            var c = e.fileFormDataName || "file";
                            if ("[object Array]" === Object.prototype.toString.call(e.file))
                                for (var h = "[object String]" === Object.prototype.toString.call(c), s = 0; s < e.file.length; s++) t.append(h ? c : c[s], e.file[s], e.fileName && e.fileName[s] || e.file[s].name);
                            else t.append(c, e.file, e.fileName || e.file.name)
                        }
                    return t
                }, e.data = i, n(e)
            }, this.http = function(t) {
                return n(t)
            }
        }]), t.directive("ngFileSelect", ["$parse", "$timeout", function(t, e) {
            return function(i, n, r) {
                var o = t(r.ngFileSelect);
                if ("input" !== n[0].tagName.toLowerCase() || "file" !== (n.attr("type") && n.attr("type").toLowerCase())) {
                    for (var a = angular.element('<input type="file">'), s = n[0].attributes, l = 0; l < s.length; l++) "type" !== s[l].name.toLowerCase() && a.attr(s[l].name, s[l].value);
                    r.multiple && a.attr("multiple", "true"), a.css("width", "1px").css("height", "1px").css("opacity", 0).css("position", "absolute").css("filter", "alpha(opacity=0)").css("padding", 0).css("margin", 0).css("overflow", "hidden"), a.attr("__wrapper_for_parent_", !0), n.append(a), n[0].__file_click_fn_delegate_ = function() {
                        a[0].click()
                    }, n.bind("click", n[0].__file_click_fn_delegate_), n.css("overflow", "hidden"), n = a
                }
                n.bind("change", function(t) {
                    var n, r, a = [];
                    if (n = t.__files_ || t.target.files, null != n)
                        for (r = 0; r < n.length; r++) a.push(n.item(r));
                    e(function() {
                        o(i, {
                            $files: a,
                            $event: t
                        })
                    })
                })
            }
        }]), t.directive("ngFileDropAvailable", ["$parse", "$timeout", function(t, e) {
            return function(i, n, r) {
                if ("draggable" in document.createElement("span")) {
                    var o = t(r.ngFileDropAvailable);
                    e(function() {
                        o(i)
                    })
                }
            }
        }]), t.directive("ngFileDrop", ["$parse", "$timeout", "$location", function(t, e, i) {
            return function(n, r, o) {
                function a(t) {
                    return /^[\000-\177]*$/.test(t)
                }

                function s(t, n) {
                    var r = [],
                        o = t.dataTransfer.items;
                    if (o && o.length > 0 && o[0].webkitGetAsEntry && "file" != i.protocol() && o[0].webkitGetAsEntry().isDirectory)
                        for (var s = 0; s < o.length; s++) {
                            var c = o[s].webkitGetAsEntry();
                            null != c && (a(c.name) ? l(r, c) : o[s].webkitGetAsEntry().isDirectory || r.push(o[s].getAsFile()))
                        } else {
                            var h = t.dataTransfer.files;
                            if (null != h)
                                for (var s = 0; s < h.length; s++) r.push(h.item(s))
                        }! function f(t) {
                            e(function() {
                                u ? f(10) : n(r)
                            }, t || 0)
                        }()
                }

                function l(t, e, i) {
                    if (null != e)
                        if (e.isDirectory) {
                            var n = e.createReader();
                            u++, n.readEntries(function(n) {
                                for (var r = 0; r < n.length; r++) l(t, n[r], (i ? i : "") + e.name + "/");
                                u--
                            })
                        } else u++, e.file(function(e) {
                            u--, e._relativePath = (i ? i : "") + e.name, t.push(e)
                        })
                }
                if ("draggable" in document.createElement("span")) {
                    var c = null;
                    r[0].addEventListener("dragover", function(i) {
                        if (i.preventDefault(), e.cancel(c), !r[0].__drag_over_class_)
                            if (o.ngFileDragOverClass && o.ngFileDragOverClass.search(/\) *$/) > -1) {
                                var a = t(o.ngFileDragOverClass)(n, {
                                    $event: i
                                });
                                r[0].__drag_over_class_ = a
                            } else r[0].__drag_over_class_ = o.ngFileDragOverClass || "dragover";
                        r.addClass(r[0].__drag_over_class_)
                    }, !1), r[0].addEventListener("dragenter", function(t) {
                        t.preventDefault()
                    }, !1), r[0].addEventListener("dragleave", function() {
                        c = e(function() {
                            r.removeClass(r[0].__drag_over_class_), r[0].__drag_over_class_ = null
                        }, o.ngFileDragOverDelay || 1)
                    }, !1);
                    var h = t(o.ngFileDrop);
                    r[0].addEventListener("drop", function(t) {
                        t.preventDefault(), r.removeClass(r[0].__drag_over_class_), r[0].__drag_over_class_ = null, s(t, function(e) {
                            h(n, {
                                $files: e,
                                $event: t
                            })
                        })
                    }, !1);
                    var u = 0
                }
            }
        }])
    }(),
    function(t) {
        function e() {
            this.fontFamily = "fjs" + (999999 * Math.random() | 0)
        }
        if (!Object.defineProperty) throw "Font.js requires Object.defineProperty, which this browser does not support.";
        if (!document.createElement("canvas").getContext) throw "Font.js requires <canvas> and the Canvas2D API, which this browser does not support.";
        ! function(t) {
            function e(t, e) {
                return this.slice(t, e)
            }

            function i(t, e) {
                var i, n = t.length;
                for (arguments.length < 2 && (e = 0), i = 0; n > i; ++i, ++e) this[e] = 255 & t[i]
            }

            function n(t) {
                var n, r;
                if ("number" == typeof t)
                    for (n = new Array(t), r = 0; t > r; ++r) n[r] = 0;
                else n = t.slice(0);
                return n.subarray = e, n.buffer = n, n.byteLength = n.length, n.set = i, "object" == typeof t && t.buffer && (n.buffer = t.buffer), n
            }
            try {
                {
                    new Uint8Array(1)
                }
                return
            } catch (r) {}
            t.Uint8Array = n, t.Uint32Array = n, t.Int32Array = n
        }(t),
        function(t) {
            if (!t.opera && !("response" in XMLHttpRequest.prototype || "mozResponseArrayBuffer" in XMLHttpRequest.prototype || "mozResponse" in XMLHttpRequest.prototype || "responseArrayBuffer" in XMLHttpRequest.prototype)) {
                var e;
                e = t.VBArray ? function() {
                    return new Uint8Array(new VBArray(this.responseBody).toArray())
                } : function() {
                    this.responseBody
                }, Object.defineProperty(XMLHttpRequest.prototype, "response", {
                    get: e
                })
            }
        }(t), t.btoa || (t.btoa = function(t) {
            var e, i, n, r, o, a, s, l, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                h = 0,
                u = 0,
                f = "",
                d = [];
            if (!t) return t;
            do e = t.charCodeAt(h++), i = t.charCodeAt(h++), n = t.charCodeAt(h++), l = e << 16 | i << 8 | n, r = l >> 18 & 63, o = l >> 12 & 63, a = l >> 6 & 63, s = 63 & l, d[u++] = c.charAt(r) + c.charAt(o) + c.charAt(a) + c.charAt(s); while (h < t.length);
            f = d.join("");
            var p = t.length % 3;
            return (p ? f.slice(0, p - 3) : f) + "===".slice(p || 3)
        }), e.prototype.url = "", e.prototype.format = "", e.prototype.data = "", e.prototype.base64 = "AAEAAAAKAIAAAwAgT1MvMgAAAAAAAACsAAAAWGNtYXAAAAAAAAABBAAAACxnbHlmAAAAAAAAATAAAAAQaGVhZAAAAAAAAAFAAAAAOGhoZWEAAAAAAAABeAAAACRobXR4AAAAAAAAAZwAAAAIbG9jYQAAAAAAAAGkAAAACG1heHAAAAAAAAABrAAAACBuYW1lAAAAAAAAAcwAAAAgcG9zdAAAAAAAAAHsAAAAEAAEAAEAZAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAABAAMAAQAAAAwABAAgAAAABAAEAAEAAABB//8AAABB////wAABAAAAAAABAAAAAAAAAAAAAAAAMQAAAQAAAAAAAAAAAABfDzz1AAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAEAAgAAAAAAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAIAAAAAQAAAAIAAQABAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAIAHgADAAEECQABAAAAAAADAAEECQACAAIAAAAAAAEAAAAAAAAAAAAAAAAAAA==", e.prototype.metrics = {
            quadsize: 0,
            leading: 0,
            ascent: 0,
            descent: 0,
            weightclass: 400
        }, e.prototype.systemfont = !1, e.prototype.loaded = !1, e.prototype.onload = function() {}, e.prototype.onerror = function() {}, e.prototype.canvas = !1, e.prototype.context = !1, e.prototype.validate = function(t, e, i, n, r) {
            if (r !== !1 && 0 > r) return void this.onerror("Requested system font '" + this.fontFamily + "' could not be loaded (it may not be installed).");
            var o = getComputedStyle(t, null).getPropertyValue("width").replace("px", "");
            o > 0 ? (document.head.removeChild(e), document.body.removeChild(t), this.loaded = !0, this.onload()) : (console.log("timing out"), setTimeout(function() {
                n.validate(t, e, i, n, r === !1 ? !1 : r - 50)
            }, 1e3))
        }, e.prototype.ondownloaded = function() {
            var t = this,
                e = function(t) {
                    return String.fromCharCode(t)
                },
                i = function(t) {
                    if (256 > t) return e(0) + e(t);
                    var i = t >> 8,
                        n = 255 & t;
                    return e(i) + e(n)
                },
                n = function(t, e) {
                    return 256 * t + e
                },
                r = function(t, e) {
                    var i, n = t >> 7 === 1;
                    return t = 127 & t, i = 256 * t + e, n ? i - 32768 : i
                },
                o = function(t, e, i, n) {
                    return 16777216 * t + 65536 * e + 256 * i + n
                },
                a = function(e) {
                    t.onerror(e)
                },
                s = e(0) + e(1) + e(0) + e(0),
                l = "OTTO",
                c = this.data,
                h = e(c[0]) + e(c[1]) + e(c[2]) + e(c[3]),
                u = h === s,
                f = u ? !1 : h === l;
            if (u) this.format = "truetype";
            else {
                if (!f) return void a("Error: file at " + this.url + " cannot be interpreted as OpenType font.");
                this.format = "opentype"
            }
            var d, p, g = n(c[4], c[5]),
                v = 12,
                m = v + 16 * g,
                b = {};
            for (d = v; m > d; d += 16) p = e(c[d]) + e(c[d + 1]) + e(c[d + 2]) + e(c[d + 3]), b[p] = {
                name: p,
                checksum: o(c[d + 4], c[d + 5], c[d + 6], c[d + 7]),
                offset: o(c[d + 8], c[d + 9], c[d + 10], c[d + 11]),
                length: o(c[d + 12], c[d + 13], c[d + 14], c[d + 15])
            };
            var y = function(t) {
                return b[t] ? t : (a("Error: font is missing the required OpenType '" + t + "' table."), !1)
            };
            if (p = y("head"), p !== !1) {
                d = b[p].offset, b[p].version = "" + c[d] + c[d + 1] + c[d + 2] + c[d + 3];
                var x = n(c[d + 18], c[d + 19]);
                if (this.metrics.quadsize = x, p = y("hhea"), p !== !1 && (d = b[p].offset, b[p].version = "" + c[d] + c[d + 1] + c[d + 2] + c[d + 3], this.metrics.ascent = r(c[d + 4], c[d + 5]) / x, this.metrics.descent = r(c[d + 6], c[d + 7]) / x, this.metrics.leading = r(c[d + 8], c[d + 9]) / x, p = y("OS/2"), p !== !1 && (d = b[p].offset, b[p].version = "" + c[d] + c[d + 1], this.metrics.weightclass = n(c[d + 4], c[d + 5]), p = y("cmap"), p !== !1))) {
                    d = b[p].offset, b[p].version = "" + c[d] + c[d + 1], g = n(c[d + 2], c[d + 3]);
                    for (var w, _, C, S, A, k = !1, w = 0; g > w; w++) _ = d + 4 + 8 * w, C = n(c[_], c[_ + 1]), S = n(c[_ + 2], c[_ + 3]), A = o(c[_ + 4], c[_ + 5], c[_ + 6], c[_ + 7]), 3 === C && 1 === S && (k = A);
                    var T = "A";
                    if (k !== !1 && (d += k, h = n(c[d], c[d + 1]), 4 === h)) {
                        for (var O = n(c[d + 6], c[d + 7]) / 2, $ = function(t) {
                                return -1 === [9, 10, 11, 12, 13, 32, 133, 160, 5760, 6158, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288].indexOf(t)
                            }, D = d + 14, M = d + 14 + 2 * O, E = !1; M > D && (E = n(c[D], c[D + 1]), !$(E)); D += 2) E = !1;
                        if (0 != E) {
                            T = String.fromCharCode(E);
                            var P = (-(E - 1) + 65536) % 65536,
                                j = e(0) + i(E) + i(65535) + i(0) + i(E) + i(65535) + i(P) + i(1),
                                L = btoa(j);
                            this.base64 = this.base64.substring(0, 380) + L + this.base64.substring(380 + L.length)
                        }
                    }
                    this.bootstrapValidation(T, !1)
                }
            }
        }, e.prototype.bootstrapValidation = function(t, e) {
            var i = this.fontFamily + " testfont",
                n = document.createElement("style");
            n.setAttribute("type", "text/css"), n.innerHTML = "@font-face {\n  font-family: '" + i + "';\n  src: url('data:application/x-font-ttf;base64," + this.base64 + "')\n       format('truetype');}", document.head.appendChild(n);
            var r = !1;
            this.systemfont || (r = this.toStyleNode(), document.head.appendChild(r));
            var o = document.createElement("p");
            if (o.style.cssText = "position: absolute; top: 0; left: 0; opacity: 0;", o.style.fontFamily = "'" + this.fontFamily + "', '" + i + "'", o.innerHTML = t + t + t + t + t + t + t + t + t + t, document.body.appendChild(o), "undefined" == typeof getComputedStyle) this.onload(), error("Error: getComputedStyle is not supported by this browser.\nConsequently, Font.onload() cannot be trusted.");
            else {
                var a = this.systemfont ? 1e3 : this.metrics.quadsize,
                    s = document.createElement("canvas");
                s.width = a, s.height = a, this.canvas = s;
                var l = s.getContext("2d");
                l.font = "1em '" + this.fontFamily + "'", l.fillStyle = "white", l.fillRect(-1, -1, a + 2, a + 2), l.fillStyle = "black", l.fillText("test text", 50, a / 2), this.context = l;
                var c = this,
                    h = function() {
                        c.validate(o, n, r, c, e)
                    };
                setTimeout(h, 50)
            }
        }, e.prototype.processSystemFont = function() {
            this.systemfont = !0, this.metrics = !1, this.bootstrapValidation("A", 1e3)
        }, e.prototype.loadFont = function() {
            var t = this;
            if (-1 === this.url.indexOf(".")) return void setTimeout(function() {
                t.processSystemFont()
            }, 10);
            var e = new XMLHttpRequest;
            e.open("GET", t.url, !0), e.responseType = "arraybuffer", e.onload = function() {
                var i = e.response;
                i ? (t.data = new Uint8Array(i), t.ondownloaded()) : t.onerror("Error downloading font resource from " + t.url)
            }, e.onerror = function() {
                t.onerror("Error downloading font resource from " + t.url)
            }, e.send(null)
        }, e.prototype.styleNode = !1, e.prototype.toStyleNode = function() {
            if (this.styleNode) return this.styleNode;
            this.styleNode = document.createElement("style"), this.styleNode.type = "text/css";
            var t = "@font-face {\n";
            return t += "  font-family: '" + this.fontFamily + "';\n", t += "  src: url('" + this.url + "') format('" + this.format + "');\n", t += "}", this.styleNode.innerHTML = t, this.styleNode
        }, e.prototype.measureText = function(t, e) {
            if (!this.loaded) return this.onerror("measureText() was called while the font was not yet loaded"), !1;
            this.context.font = e + "px '" + this.fontFamily + "'";
            var i = this.context.measureText(t);
            i.fontsize = e, i.ascent = 0, i.descent = 0, i.bounds = {
                minx: 0,
                maxx: i.width,
                miny: 0,
                maxy: 0
            }, i.height = 0;
            var n = [],
                r = i.width / this.metrics.quadsize;
            n.push(1 >= r ? t : t);
            var o, a = n.length;
            for (o = 0; a > o; o++) this.measureSegment(n[o], e, i);
            return i
        }, e.prototype.measureSegment = function(t, e, i) {
            var n, r = function(t, e) {
                    return document.defaultView.getComputedStyle(t, null).getPropertyValue(e)
                },
                o = document.createElement("div");
            o.style.position = "absolute", o.style.opacity = 0, o.style.font = e + "px '" + this.fontFamily + "'";
            var a = 10;
            for (o.innerHTML = t, n = 1; a > n; n++) o.innerHTML += "<br/>" + t;
            document.body.appendChild(o), i.leading = 1.2 * e;
            var s = r(o, "height");
            if (s = s.replace("px", ""), s >= e * a && (i.leading = s / a | 0), document.body.removeChild(o), /^\s*$/.test(t)) return i;
            var l = (this.canvas, this.context),
                c = this.systemfont ? 1e3 : this.metrics.quadsize,
                h = c,
                u = c,
                f = c / 2,
                d = 50,
                p = (c - i.width) / 2;
            p !== (0 | p) && (p = 0 | p), l.fillStyle = "white", l.fillRect(-d, -d, h + 2 * d, u + 2 * d), l.fillStyle = "black", l.fillText(t, p, f);
            for (var g = i.width + d | 0, v = 4 * e, m = p - d / 2, b = f - v / 2, y = l.getImageData(m, b, g, v).data, n = 0, x = 0, w = 4 * g, _ = y.length, C = v / 2; ++n < _ && 255 === y[n];);
            var S = n / w | 0;
            for (n = _ - 1; --n > 0 && 255 === y[n];);
            var A = n / w | 0;
            for (n = 0, x = 0; g > x && 255 === y[n];) n += w, n >= _ && (x++, n = n - _ + 4);
            var k = x,
                T = 1;
            for (n = _ - 3, x = 0; g > x && 255 === y[n];) n -= w, 0 > n && (x++, n = _ - 3 - 4 * T++);
            var O = g - x;
            return i.ascent = C - S, i.descent = A - C, i.bounds = {
                minx: k - d / 2,
                maxx: O - d / 2,
                miny: -i.descent,
                maxy: i.ascent
            }, i.height = 1 + (A - S), i
        }, Object.defineProperty(e.prototype, "src", {
            set: function(t) {
                this.url = t, this.loadFont()
            }
        }), "undefined" != typeof define ? define(function() {
            return e
        }) : t.Font = e
    }(window), angular.module("ui.slider", []).value("uiSliderConfig", {}).directive("uiSlider", ["uiSliderConfig", "$timeout", function(t, e) {
        return t = t || {}, {
            require: "ngModel",
            compile: function() {
                return function(i, n, r, o) {
                    function a(t, e) {
                        return e ? parseFloat(t) : parseInt(t)
                    }

                    function s() {
                        n.slider("destroy")
                    }
                    var l = angular.extend(i.$eval(r.uiSlider) || {}, t),
                        c = {
                            min: null,
                            max: null
                        },
                        h = ["min", "max", "step"],
                        u = angular.isUndefined(r.useDecimals) ? !1 : !0,
                        f = function() {
                            angular.isArray(o.$viewValue) && l.range !== !0 && (console.warn("Change your range option of ui-slider. When assigning ngModel an array of values then the range option should be set to true."), l.range = !0), angular.forEach(h, function(t) {
                                angular.isDefined(r[t]) && (l[t] = a(r[t], u))
                            }), n.slider(l), f = angular.noop
                        };
                    angular.forEach(h, function(t) {
                        r.$observe(t, function(e) {
                            e && (f(), n.slider("option", t, a(e, u)), o.$render())
                        })
                    }), r.$observe("disabled", function(t) {
                        f(), n.slider("option", "disabled", !!t)
                    }), i.$watch(r.uiSlider, function(t) {
                        f(), void 0 != t && n.slider("option", t)
                    }, !0), e(f, 0, !0), n.bind("slide", function(t, e) {
                        o.$setViewValue(e.values || e.value), i.$apply()
                    }), o.$render = function() {
                        f();
                        var t = l.range === !0 ? "values" : "value";
                        l.range || !isNaN(o.$viewValue) || o.$viewValue instanceof Array ? l.range && !angular.isDefined(o.$viewValue) && (o.$viewValue = [0, 0]) : o.$viewValue = 0, l.range === !0 && (angular.isDefined(l.min) && l.min > o.$viewValue[0] && (o.$viewValue[0] = l.min), angular.isDefined(l.max) && l.max < o.$viewValue[1] && (o.$viewValue[1] = l.max), o.$viewValue[0] > o.$viewValue[1] && (c.min >= o.$viewValue[1] && (o.$viewValue[0] = c.min), c.max <= o.$viewValue[0] && (o.$viewValue[1] = c.max)), c.min = o.$viewValue[0], c.max = o.$viewValue[1]), n.slider(t, o.$viewValue)
                    }, i.$watch(r.ngModel, function() {
                        l.range === !0 && o.$render()
                    }, !0), n.bind("$destroy", s)
                }
            }
        }
    }]), angular.module("rzModule", []).value("throttle", function(t, e, i) {
        var n, r, o, a = Date.now || function() {
                return (new Date).getTime()
            },
            s = null,
            l = 0;
        i || (i = {});
        var c = function() {
            l = i.leading === !1 ? 0 : a(), s = null, o = t.apply(n, r), n = r = null
        };
        return function() {
            var h = a();
            l || i.leading !== !1 || (l = h);
            var u = e - (h - l);
            return n = this, r = arguments, 0 >= u ? (clearTimeout(s), s = null, l = h, o = t.apply(n, r), n = r = null) : s || i.trailing === !1 || (s = setTimeout(c, u)), o
        }
    }).factory("Slider", ["$timeout", "$document", "throttle", function(t, e, i) {
        var n = function(t, e, i) {
            this.scope = t, this.attributes = i, this.sliderElem = e, this.range = void 0 !== i.rzSliderHigh && void 0 !== i.rzSliderModel, this.handleHalfWidth = 0, this.maxLeft = 0, this.precision = 0, this.step = 0, this.tracking = "", this.minValue = 0, this.maxValue = 0, this.valueRange = 0, this.initRun = !1, this.customTrFn = null, this.fullBar = null, this.selBar = null, this.minH = null, this.maxH = null, this.flrLab = null, this.ceilLab = null, this.minLab = null, this.maxLab = null, this.cmbLab = null, this.init()
        };
        return n.prototype = {
            init: function() {
                var e = this;
                this.scope.rzSliderTranslate && (this.customTrFn = this.scope.rzSliderTranslate()), this.initElemHandles(), this.calcViewDimensions(), this.setMinAndMax(), this.precision = void 0 === this.scope.rzSliderPrecision ? 0 : +this.scope.rzSliderPrecision, this.step = void 0 === this.scope.rzSliderStep ? 1 : +this.scope.rzSliderStep, t(function() {
                    e.updateCeilLab(), e.updateFloorLab(), e.initHandles(), e.bindEvents()
                }), this.scope.$on("reCalcViewDimensions", angular.bind(this, this.calcViewDimensions)), angular.element(window).on("resize", angular.bind(this, this.calcViewDimensions)), this.initRun = !0;
                var n = i(function() {
                        e.setMinAndMax(), e.updateLowHandle(e.valueToOffset(e.scope.rzSliderModel)), e.range && (e.updateSelectionBar(), e.updateCmbLabel())
                    }, 350, {
                        leading: !1
                    }),
                    r = i(function() {
                        e.setMinAndMax(), e.updateHighHandle(e.valueToOffset(e.scope.rzSliderHigh)), e.updateSelectionBar(), e.updateCmbLabel()
                    }, 350, {
                        leading: !1
                    });
                this.scope.$on("rzSliderForceRender", function() {
                    e.resetLabelsValue(), n(), r(), e.resetSlider()
                }), this.scope.$watch("rzSliderModel", function(t, e) {
                    t !== e && n()
                }), this.scope.$watch("rzSliderHigh", function(t, e) {
                    t !== e && r()
                }), this.scope.$watch("rzSliderFloor", function(t, i) {
                    t !== i && e.resetSlider()
                }), this.scope.$watch("rzSliderCeil", function(t, i) {
                    t !== i && e.resetSlider()
                })
            },
            resetSlider: function() {
                this.setMinAndMax(), this.calcViewDimensions(), this.updateCeilLab(), this.updateFloorLab()
            },
            resetLabelsValue: function() {
                this.minLab.rzsv = void 0, this.maxLab.rzsv = void 0
            },
            initHandles: function() {
                this.updateLowHandle(this.valueToOffset(this.scope.rzSliderModel)), this.range && (this.updateHighHandle(this.valueToOffset(this.scope.rzSliderHigh)), this.updateSelectionBar(), this.updateCmbLabel())
            },
            translateFn: function(t, e, i) {
                i = void 0 === i ? !0 : i;
                var n = this.customTrFn && i ? "" + this.customTrFn(t) : "" + t,
                    r = !1;
                (void 0 === e.rzsv || e.rzsv.length != n.length || e.rzsv.length > 0 && 0 == e.rzsw) && (r = !0, e.rzsv = n), e.text(n), r && this.getWidth(e)
            },
            setMinAndMax: function() {
                this.minValue = this.scope.rzSliderFloor ? +this.scope.rzSliderFloor : this.scope.rzSliderFloor = 0, this.scope.rzSliderCeil ? this.maxValue = +this.scope.rzSliderCeil : this.scope.rzSliderCeil = this.maxValue = this.range ? this.scope.rzSliderHigh : this.scope.rzSliderModel, this.valueRange = this.maxValue - this.minValue
            },
            initElemHandles: function() {
                angular.forEach(this.sliderElem.children(), function(t, e) {
                    var i = angular.element(t);
                    switch (e) {
                        case 0:
                            this.fullBar = i;
                            break;
                        case 1:
                            this.selBar = i;
                            break;
                        case 2:
                            this.minH = i;
                            break;
                        case 3:
                            this.maxH = i;
                            break;
                        case 4:
                            this.flrLab = i;
                            break;
                        case 5:
                            this.ceilLab = i;
                            break;
                        case 6:
                            this.minLab = i;
                            break;
                        case 7:
                            this.maxLab = i;
                            break;
                        case 8:
                            this.cmbLab = i
                    }
                }, this), this.fullBar.rzsl = 0, this.selBar.rzsl = 0, this.minH.rzsl = 0, this.maxH.rzsl = 0, this.flrLab.rzsl = 0, this.ceilLab.rzsl = 0, this.minLab.rzsl = 0, this.maxLab.rzsl = 0, this.cmbLab.rzsl = 0, this.range || (this.cmbLab.remove(), this.maxLab.remove(), this.maxH.remove(), this.selBar.remove())
            },
            calcViewDimensions: function() {
                var t = this.getWidth(this.minH);
                this.handleHalfWidth = t / 2, this.barWidth = this.getWidth(this.fullBar), this.maxLeft = this.barWidth - t, this.getWidth(this.sliderElem), this.sliderElem.rzsl = this.sliderElem[0].getBoundingClientRect().left, this.initRun && (this.updateCeilLab(), this.initHandles())
            },
            updateCeilLab: function() {
                this.translateFn(this.scope.rzSliderCeil, this.ceilLab), this.setLeft(this.ceilLab, this.barWidth - this.ceilLab.rzsw), this.getWidth(this.ceilLab)
            },
            updateFloorLab: function() {
                this.translateFn(this.scope.rzSliderFloor, this.flrLab), this.getWidth(this.flrLab)
            },
            updateHandles: function(t, e) {
                return "rzSliderModel" === t ? (this.updateLowHandle(e), void(this.range && (this.updateSelectionBar(), this.updateCmbLabel()))) : "rzSliderHigh" === t ? (this.updateHighHandle(e), void(this.range && (this.updateSelectionBar(), this.updateCmbLabel()))) : (this.updateLowHandle(e), this.updateHighHandle(e), this.updateSelectionBar(), void this.updateCmbLabel())
            },
            updateLowHandle: function(t) {
                this.setLeft(this.minH, t), this.translateFn(this.scope.rzSliderModel, this.minLab), this.setLeft(this.minLab, t - this.minLab.rzsw / 2 + this.handleHalfWidth), this.shFloorCeil()
            },
            updateHighHandle: function(t) {
                this.setLeft(this.maxH, t), this.translateFn(this.scope.rzSliderHigh, this.maxLab), this.setLeft(this.maxLab, t - this.maxLab.rzsw / 2 + this.handleHalfWidth), this.shFloorCeil()
            },
            shFloorCeil: function() {
                var t = !1,
                    e = !1;
                this.minLab.rzsl <= this.flrLab.rzsl + this.flrLab.rzsw + 5 ? (t = !0, this.hideEl(this.flrLab)) : (t = !1, this.showEl(this.flrLab)), this.minLab.rzsl + this.minLab.rzsw >= this.ceilLab.rzsl - this.handleHalfWidth - 10 ? (e = !0, this.hideEl(this.ceilLab)) : (e = !1, this.showEl(this.ceilLab)), this.range && (this.maxLab.rzsl + this.maxLab.rzsw >= this.ceilLab.rzsl - 10 ? this.hideEl(this.ceilLab) : e || this.showEl(this.ceilLab), this.maxLab.rzsl <= this.flrLab.rzsl + this.flrLab.rzsw + this.handleHalfWidth ? this.hideEl(this.flrLab) : t || this.showEl(this.flrLab))
            },
            updateSelectionBar: function() {
                this.setWidth(this.selBar, this.maxH.rzsl - this.minH.rzsl), this.setLeft(this.selBar, this.minH.rzsl + this.handleHalfWidth)
            },
            updateCmbLabel: function() {
                var t, e;
                this.minLab.rzsl + this.minLab.rzsw + 10 >= this.maxLab.rzsl ? (this.customTrFn ? (t = this.customTrFn(this.scope.rzSliderModel), e = this.customTrFn(this.scope.rzSliderHigh)) : (t = this.scope.rzSliderModel, e = this.scope.rzSliderHigh), this.translateFn(t + " - " + e, this.cmbLab, !1), this.setLeft(this.cmbLab, this.selBar.rzsl + this.selBar.rzsw / 2 - this.cmbLab.rzsw / 2), this.hideEl(this.minLab), this.hideEl(this.maxLab), this.showEl(this.cmbLab)) : (this.showEl(this.maxLab), this.showEl(this.minLab), this.hideEl(this.cmbLab))
            },
            roundStep: function(t) {
                var e = this.step,
                    i = (t - this.minValue) % e,
                    n = i > e / 2 ? t + e - i : t - i;
                return +n.toFixed(this.precision)
            },
            hideEl: function(t) {
                return t.css({
                    opacity: 0
                })
            },
            showEl: function(t) {
                return t.css({
                    opacity: 1
                })
            },
            setLeft: function(t, e) {
                return t.rzsl = e, t.css({
                    left: e + "px"
                }), e
            },
            getWidth: function(t) {
                var e = t[0].getBoundingClientRect();
                return t.rzsw = e.right - e.left, t.rzsw
            },
            setWidth: function(t, e) {
                return t.rzsw = e, t.css({
                    width: e + "px"
                }), e
            },
            valueToOffset: function(t) {
                return (t - this.minValue) * this.maxLeft / this.valueRange
            },
            offsetToValue: function(t) {
                return t / this.maxLeft * this.valueRange + this.minValue
            },
            bindEvents: function() {
                this.minH.on("mousedown", angular.bind(this, this.onStart, this.minH, "rzSliderModel")), this.range && this.maxH.on("mousedown", angular.bind(this, this.onStart, this.maxH, "rzSliderHigh")), this.minH.on("touchstart", angular.bind(this, this.onStart, this.minH, "rzSliderModel")), this.range && this.maxH.on("touchstart", angular.bind(this, this.onStart, this.maxH, "rzSliderHigh"))
            },
            onStart: function(t, i, n) {
                n.stopPropagation(), n.preventDefault(), "" === this.tracking && (this.calcViewDimensions(), this.tracking = i, t.addClass("active"), n.touches || "undefined" != typeof n.originalEvent && n.originalEvent.touches ? (e.on("touchmove.rzslider", angular.bind(this, this.onMove, t)), e.on("touchend.rzslider", angular.bind(this, this.onEnd))) : (e.on("mousemove.rzslider", angular.bind(this, this.onMove, t)), e.on("mouseup.rzslider", angular.bind(this, this.onEnd))))
            },
            onMove: function(t, e) {
                var i, n = e.clientX || ("undefined" != typeof e.originalEvent ? e.originalEvent.touches[0].clientX : e.touches[0].clientX),
                    r = this.sliderElem.rzsl,
                    o = n - r - this.handleHalfWidth;
                return 0 >= o ? void(0 !== t.rzsl && (this.scope[this.tracking] = this.minValue, this.updateHandles(this.tracking, 0), this.scope.$apply())) : o >= this.maxLeft ? void(t.rzsl !== this.maxLeft && (this.scope[this.tracking] = this.maxValue, this.updateHandles(this.tracking, this.maxLeft), this.scope.$apply())) : (i = this.offsetToValue(o), i = this.roundStep(i), this.range && ("rzSliderModel" === this.tracking && i >= this.scope.rzSliderHigh ? (this.scope[this.tracking] = this.scope.rzSliderHigh, this.updateHandles(this.tracking, this.maxH.rzsl), this.tracking = "rzSliderHigh", this.minH.removeClass("active"), this.maxH.addClass("active")) : "rzSliderHigh" === this.tracking && i <= this.scope.rzSliderModel && (this.scope[this.tracking] = this.scope.rzSliderModel, this.updateHandles(this.tracking, this.minH.rzsl), this.tracking = "rzSliderModel", this.maxH.removeClass("active"), this.minH.addClass("active"))), void(this.scope[this.tracking] !== i && (this.scope[this.tracking] = i, this.updateHandles(this.tracking, o), this.scope.$apply())))
            },
            onEnd: function(t) {
                this.minH.removeClass("active"), this.maxH.removeClass("active"), t.touches || "undefined" != typeof t.originalEvent && t.originalEvent.touches ? (e.unbind("touchmove.rzslider"), e.unbind("touchend.rzslider")) : (e.unbind("mousemove.rzslider"), e.unbind("mouseup.rzslider")), this.scope.$emit("slideEnded"), this.tracking = ""
            }
        }, n
    }]).directive("rzslider", ["Slider", function(t) {
        return {
            restrict: "EA",
            scope: {
                rzSliderFloor: "=?",
                rzSliderCeil: "=?",
                rzSliderStep: "@",
                rzSliderPrecision: "@",
                rzSliderModel: "=?",
                rzSliderHigh: "=?",
                rzSliderTranslate: "&"
            },
            template: '<span class="bar"></span><span class="bar selection"></span><span class="pointer"></span><span class="pointer"></span><span class="bubble limit"></span><span class="bubble limit"></span><span class="bubble"></span><span class="bubble"></span><span class="bubble"></span>',
            link: function(e, i, n) {
                return new t(e, i, n)
            }
        }
    }]),
    function(t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports ? module.exports = t : t(jQuery)
    }(function(t) {
        function e(e) {
            var a = e || window.event,
                s = l.call(arguments, 1),
                c = 0,
                h = 0,
                u = 0,
                f = 0;
            if (e = t.event.fix(a), e.type = "mousewheel", "detail" in a && (u = -1 * a.detail), "wheelDelta" in a && (u = a.wheelDelta), "wheelDeltaY" in a && (u = a.wheelDeltaY), "wheelDeltaX" in a && (h = -1 * a.wheelDeltaX), "axis" in a && a.axis === a.HORIZONTAL_AXIS && (h = -1 * u, u = 0), c = 0 === u ? h : u, "deltaY" in a && (u = -1 * a.deltaY, c = u), "deltaX" in a && (h = a.deltaX, 0 === u && (c = -1 * h)), 0 !== u || 0 !== h) {
                if (1 === a.deltaMode) {
                    var d = t.data(this, "mousewheel-line-height");
                    c *= d, u *= d, h *= d
                } else if (2 === a.deltaMode) {
                    var p = t.data(this, "mousewheel-page-height");
                    c *= p, u *= p, h *= p
                }
                return f = Math.max(Math.abs(u), Math.abs(h)), (!o || o > f) && (o = f, n(a, f) && (o /= 40)), n(a, f) && (c /= 40, h /= 40, u /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / o), h = Math[h >= 1 ? "floor" : "ceil"](h / o), u = Math[u >= 1 ? "floor" : "ceil"](u / o), e.deltaX = h, e.deltaY = u, e.deltaFactor = o, e.deltaMode = 0, s.unshift(e, c, h, u), r && clearTimeout(r), r = setTimeout(i, 200), (t.event.dispatch || t.event.handle).apply(this, s)
            }
        }

        function i() {
            o = null
        }

        function n(t, e) {
            return h.settings.adjustOldDeltas && "mousewheel" === t.type && e % 120 === 0
        }
        var r, o, a = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
            s = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
            l = Array.prototype.slice;
        if (t.event.fixHooks)
            for (var c = a.length; c;) t.event.fixHooks[a[--c]] = t.event.mouseHooks;
        var h = t.event.special.mousewheel = {
            version: "3.1.9",
            setup: function() {
                if (this.addEventListener)
                    for (var i = s.length; i;) this.addEventListener(s[--i], e, !1);
                else this.onmousewheel = e;
                t.data(this, "mousewheel-line-height", h.getLineHeight(this)), t.data(this, "mousewheel-page-height", h.getPageHeight(this))
            },
            teardown: function() {
                if (this.removeEventListener)
                    for (var t = s.length; t;) this.removeEventListener(s[--t], e, !1);
                else this.onmousewheel = null
            },
            getLineHeight: function(e) {
                return parseInt(t(e)["offsetParent" in t.fn ? "offsetParent" : "parent"]().css("fontSize"), 10)
            },
            getPageHeight: function(e) {
                return t(e).height()
            },
            settings: {
                adjustOldDeltas: !0
            }
        };
        t.fn.extend({
            mousewheel: function(t) {
                return t ? this.bind("mousewheel", t) : this.trigger("mousewheel")
            },
            unmousewheel: function(t) {
                return this.unbind("mousewheel", t)
            }
        })
    }),
    function(t) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : jQuery)
    }(function(t) {
        "use strict";
        var e = {
                wheelSpeed: 10,
                wheelPropagation: !1,
                minScrollbarLength: null,
                maxScrollbarLength: null,
                useBothWheelAxes: !1,
                useKeyboard: !0,
                suppressScrollX: !1,
                suppressScrollY: !1,
                scrollXMarginOffset: 0,
                scrollYMarginOffset: 0,
                includePadding: !1
            },
            i = function() {
                var t = 0;
                return function() {
                    var e = t;
                    return t += 1, ".perfect-scrollbar-" + e
                }
            }();
        t.fn.perfectScrollbar = function(n, r) {
            return this.each(function() {
                var o = t.extend(!0, {}, e),
                    a = t(this);
                if ("object" == typeof n ? t.extend(!0, o, n) : r = n, "update" === r) return a.data("perfect-scrollbar-update") && a.data("perfect-scrollbar-update")(), a;
                if ("destroy" === r) return a.data("perfect-scrollbar-destroy") && a.data("perfect-scrollbar-destroy")(), a;
                if (a.data("perfect-scrollbar")) return a.data("perfect-scrollbar");
                a.addClass("ps-container");
                var s, l, c, h, u, f, d, p, g, v, m = t("<div class='ps-scrollbar-x-rail'></div>").appendTo(a),
                    b = t("<div class='ps-scrollbar-y-rail'></div>").appendTo(a),
                    y = t("<div class='ps-scrollbar-x'></div>").appendTo(m),
                    x = t("<div class='ps-scrollbar-y'></div>").appendTo(b),
                    w = parseInt(m.css("bottom"), 10),
                    _ = w === w,
                    C = _ ? null : parseInt(m.css("top"), 10),
                    S = parseInt(b.css("right"), 10),
                    A = S === S,
                    k = A ? null : parseInt(b.css("left"), 10),
                    T = "rtl" === a.css("direction"),
                    O = i(),
                    $ = parseInt(m.css("borderLeftWidth"), 10) + parseInt(m.css("borderRightWidth"), 10),
                    D = parseInt(m.css("borderTopWidth"), 10) + parseInt(m.css("borderBottomWidth"), 10),
                    M = function(t, e) {
                        var i = t + e,
                            n = h - g;
                        v = 0 > i ? 0 : i > n ? n : i;
                        var r = parseInt(v * (f - h) / (h - g), 10);
                        a.scrollTop(r), m.css(_ ? {
                            bottom: w - r
                        } : {
                            top: C + r
                        })
                    },
                    E = function(t, e) {
                        var i = t + e,
                            n = c - d;
                        p = 0 > i ? 0 : i > n ? n : i;
                        var r = parseInt(p * (u - c) / (c - d), 10);
                        a.scrollLeft(r), b.css(A ? {
                            right: S - r
                        } : {
                            left: k + r
                        })
                    },
                    P = function(t) {
                        return o.minScrollbarLength && (t = Math.max(t, o.minScrollbarLength)), o.maxScrollbarLength && (t = Math.min(t, o.maxScrollbarLength)), t
                    },
                    j = function() {
                        var t = {
                            width: c,
                            display: s ? "inherit" : "none"
                        };
                        t.left = T ? a.scrollLeft() + c - u : a.scrollLeft(), _ ? t.bottom = w - a.scrollTop() : t.top = C + a.scrollTop(), m.css(t);
                        var e = {
                            top: a.scrollTop(),
                            height: h,
                            display: l ? "inherit" : "none"
                        };
                        A ? e.right = T ? u - a.scrollLeft() - S - x.outerWidth() : S - a.scrollLeft() : e.left = T ? a.scrollLeft() + 2 * c - u - k - x.outerWidth() : k + a.scrollLeft(), b.css(e), y.css({
                            left: p,
                            width: d - $
                        }), x.css({
                            top: v,
                            height: g - D
                        }), s ? a.addClass("ps-active-x") : a.removeClass("ps-active-x"), l ? a.addClass("ps-active-y") : a.removeClass("ps-active-y")
                    },
                    L = function() {
                        c = o.includePadding ? a.innerWidth() : a.width(), h = o.includePadding ? a.innerHeight() : a.height(), u = a.prop("scrollWidth"), f = a.prop("scrollHeight"), !o.suppressScrollX && c + o.scrollXMarginOffset < u ? (s = !0, d = P(parseInt(c * c / u, 10)), p = parseInt(a.scrollLeft() * (c - d) / (u - c), 10)) : (s = !1, d = 0, p = 0, a.scrollLeft(0)), !o.suppressScrollY && h + o.scrollYMarginOffset < f ? (l = !0, g = P(parseInt(h * h / f, 10)), v = parseInt(a.scrollTop() * (h - g) / (f - h), 10)) : (l = !1, g = 0, v = 0, a.scrollTop(0)), v >= h - g && (v = h - g), p >= c - d && (p = c - d), j()
                    },
                    I = function() {
                        var e, i;
                        y.bind("mousedown" + O, function(t) {
                            i = t.pageX, e = y.position().left, m.addClass("in-scrolling"), t.stopPropagation(), t.preventDefault()
                        }), t(document).bind("mousemove" + O, function(t) {
                            m.hasClass("in-scrolling") && (E(e, t.pageX - i), t.stopPropagation(), t.preventDefault())
                        }), t(document).bind("mouseup" + O, function() {
                            m.hasClass("in-scrolling") && m.removeClass("in-scrolling")
                        }), e = i = null
                    },
                    F = function() {
                        var e, i;
                        x.bind("mousedown" + O, function(t) {
                            i = t.pageY, e = x.position().top, b.addClass("in-scrolling"), t.stopPropagation(), t.preventDefault()
                        }), t(document).bind("mousemove" + O, function(t) {
                            b.hasClass("in-scrolling") && (M(e, t.pageY - i), t.stopPropagation(), t.preventDefault())
                        }), t(document).bind("mouseup" + O, function() {
                            b.hasClass("in-scrolling") && b.removeClass("in-scrolling")
                        }), e = i = null
                    },
                    H = function(t, e) {
                        var i = a.scrollTop();
                        if (0 === t) {
                            if (!l) return !1;
                            if (0 === i && e > 0 || i >= f - h && 0 > e) return !o.wheelPropagation
                        }
                        var n = a.scrollLeft();
                        if (0 === e) {
                            if (!s) return !1;
                            if (0 === n && 0 > t || n >= u - c && t > 0) return !o.wheelPropagation
                        }
                        return !0
                    },
                    R = function() {
                        o.wheelSpeed /= 10;
                        var t = !1;
                        a.bind("mousewheel" + O, function(e, i, n, r) {
                            var c = e.deltaX * e.deltaFactor || n,
                                h = e.deltaY * e.deltaFactor || r;
                            t = !1, o.useBothWheelAxes ? l && !s ? (a.scrollTop(h ? a.scrollTop() - h * o.wheelSpeed : a.scrollTop() + c * o.wheelSpeed), t = !0) : s && !l && (a.scrollLeft(c ? a.scrollLeft() + c * o.wheelSpeed : a.scrollLeft() - h * o.wheelSpeed), t = !0) : (a.scrollTop(a.scrollTop() - h * o.wheelSpeed), a.scrollLeft(a.scrollLeft() + c * o.wheelSpeed)), L(), t = t || H(c, h), t && (e.stopPropagation(), e.preventDefault())
                        }), a.bind("MozMousePixelScroll" + O, function(e) {
                            t && e.preventDefault()
                        })
                    },
                    B = function() {
                        var e = !1;
                        a.bind("mouseenter" + O, function() {
                            e = !0
                        }), a.bind("mouseleave" + O, function() {
                            e = !1
                        });
                        var i = !1;
                        t(document).bind("keydown" + O, function(n) {
                            if (!(n.isDefaultPrevented && n.isDefaultPrevented() || !e || t(document.activeElement).is(":input,[contenteditable]"))) {
                                var r = 0,
                                    o = 0;
                                switch (n.which) {
                                    case 37:
                                        r = -30;
                                        break;
                                    case 38:
                                        o = 30;
                                        break;
                                    case 39:
                                        r = 30;
                                        break;
                                    case 40:
                                        o = -30;
                                        break;
                                    case 33:
                                        o = 90;
                                        break;
                                    case 32:
                                    case 34:
                                        o = -90;
                                        break;
                                    case 35:
                                        o = -h;
                                        break;
                                    case 36:
                                        o = h;
                                        break;
                                    default:
                                        return
                                }
                                a.scrollTop(a.scrollTop() - o), a.scrollLeft(a.scrollLeft() + r), i = H(r, o), i && n.preventDefault()
                            }
                        })
                    },
                    V = function() {
                        var t = function(t) {
                            t.stopPropagation()
                        };
                        x.bind("click" + O, t), b.bind("click" + O, function(t) {
                            var e = parseInt(g / 2, 10),
                                i = t.pageY - b.offset().top - e,
                                n = h - g,
                                r = i / n;
                            0 > r ? r = 0 : r > 1 && (r = 1), a.scrollTop((f - h) * r)
                        }), y.bind("click" + O, t), m.bind("click" + O, function(t) {
                            var e = parseInt(d / 2, 10),
                                i = t.pageX - m.offset().left - e,
                                n = c - d,
                                r = i / n;
                            0 > r ? r = 0 : r > 1 && (r = 1), a.scrollLeft((u - c) * r)
                        })
                    },
                    z = function() {
                        var e = function(t, e) {
                                a.scrollTop(a.scrollTop() - e), a.scrollLeft(a.scrollLeft() - t), L()
                            },
                            i = {},
                            n = 0,
                            r = {},
                            o = null,
                            s = !1;
                        t(window).bind("touchstart" + O, function() {
                            s = !0
                        }), t(window).bind("touchend" + O, function() {
                            s = !1
                        }), a.bind("touchstart" + O, function(t) {
                            var e = t.originalEvent.targetTouches[0];
                            i.pageX = e.pageX, i.pageY = e.pageY, n = (new Date).getTime(), null !== o && clearInterval(o), t.stopPropagation()
                        }), a.bind("touchmove" + O, function(t) {
                            if (!s && 1 === t.originalEvent.targetTouches.length) {
                                var o = t.originalEvent.targetTouches[0],
                                    a = {};
                                a.pageX = o.pageX, a.pageY = o.pageY;
                                var l = a.pageX - i.pageX,
                                    c = a.pageY - i.pageY;
                                e(l, c), i = a;
                                var h = (new Date).getTime(),
                                    u = h - n;
                                u > 0 && (r.x = l / u, r.y = c / u, n = h), t.preventDefault()
                            }
                        }), a.bind("touchend" + O, function() {
                            clearInterval(o), o = setInterval(function() {
                                return Math.abs(r.x) < .01 && Math.abs(r.y) < .01 ? void clearInterval(o) : (e(30 * r.x, 30 * r.y), r.x *= .8, void(r.y *= .8))
                            }, 10)
                        })
                    },
                    W = function() {
                        a.bind("scroll" + O, function() {
                            L()
                        })
                    },
                    N = function() {
                        a.unbind(O), t(window).unbind(O), t(document).unbind(O), a.data("perfect-scrollbar", null), a.data("perfect-scrollbar-update", null), a.data("perfect-scrollbar-destroy", null), y.remove(), x.remove(), m.remove(), b.remove(), m = b = y = x = s = l = c = h = u = f = d = p = w = _ = C = g = v = S = A = k = T = O = null
                    },
                    X = function(e) {
                        a.addClass("ie").addClass("ie" + e);
                        var i = function() {
                                var e = function() {
                                        t(this).addClass("hover")
                                    },
                                    i = function() {
                                        t(this).removeClass("hover")
                                    };
                                a.bind("mouseenter" + O, e).bind("mouseleave" + O, i), m.bind("mouseenter" + O, e).bind("mouseleave" + O, i), b.bind("mouseenter" + O, e).bind("mouseleave" + O, i), y.bind("mouseenter" + O, e).bind("mouseleave" + O, i), x.bind("mouseenter" + O, e).bind("mouseleave" + O, i)
                            },
                            n = function() {
                                j = function() {
                                    var t = {
                                        left: p + a.scrollLeft(),
                                        width: d
                                    };
                                    _ ? t.bottom = w : t.top = C, y.css(t);
                                    var e = {
                                        top: v + a.scrollTop(),
                                        height: g
                                    };
                                    A ? e.right = S : e.left = k, x.css(e), y.hide().show(), x.hide().show()
                                }
                            };
                        6 === e && (i(), n())
                    },
                    Y = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch,
                    G = function() {
                        var t = navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);
                        t && "msie" === t[1] && X(parseInt(t[2], 10)), L(), W(), I(), F(), V(), Y && z(), a.mousewheel && R(), o.useKeyboard && B(), a.data("perfect-scrollbar", a), a.data("perfect-scrollbar-update", L), a.data("perfect-scrollbar-destroy", N)
                    };
                return G(), a
            })
        }
    }), angular.module("perfect_scrollbar", []).directive("perfectScrollbar", ["$parse", "$window", function(t, e) {
        var i = ["wheelSpeed", "wheelPropagation", "minScrollbarLength", "useBothWheelAxes", "useKeyboard", "suppressScrollX", "suppressScrollY", "scrollXMarginOffset", "scrollYMarginOffset", "includePadding"];
        return {
            restrict: "EA",
            transclude: !0,
            template: "<div><div ng-transclude></div></div>",
            replace: !0,
            link: function(n, r, o) {
                function a() {
                    n.$evalAsync(function() {
                        r.perfectScrollbar("update")
                    }), n.$$phase || n.$apply()
                }
                for (var s = angular.element(e), l = {}, c = 0, h = i.length; h > c; c++) {
                    var u = i[c];
                    void 0 !== o[u] && (l[u] = t(o[u])())
                }
                n.$evalAsync(function() {
                    r.perfectScrollbar(l)
                }), r.bind("mouseenter", a), o.refreshOnChange && n.$watchCollection(o.refreshOnChange, function() {
                    a()
                }), o.refreshOnResize && s.on("resize", a), r.bind("$destroy", function() {
                    s.off("resize", a), r.perfectScrollbar("destroy")
                })
            }
        }
    }]), angular.module("ui.bootstrap", ["ui.bootstrap.transition", "ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.bindHtml", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.dropdown", "ui.bootstrap.modal", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.transition", []).factory("$transition", ["$q", "$timeout", "$rootScope", function(t, e, i) {
        function n(t) {
            for (var e in t)
                if (void 0 !== o.style[e]) return t[e]
        }
        var r = function(n, o, a) {
                a = a || {};
                var s = t.defer(),
                    l = r[a.animation ? "animationEndEventName" : "transitionEndEventName"],
                    c = function() {
                        i.$apply(function() {
                            n.unbind(l, c), s.resolve(n)
                        })
                    };
                return l && n.bind(l, c), e(function() {
                    angular.isString(o) ? n.addClass(o) : angular.isFunction(o) ? o(n) : angular.isObject(o) && n.css(o), l || s.resolve(n)
                }), s.promise.cancel = function() {
                    l && n.unbind(l, c), s.reject("Transition cancelled")
                }, s.promise
            },
            o = document.createElement("trans"),
            a = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                transition: "transitionend"
            },
            s = {
                WebkitTransition: "webkitAnimationEnd",
                MozTransition: "animationend",
                OTransition: "oAnimationEnd",
                transition: "animationend"
            };
        return r.transitionEndEventName = n(a), r.animationEndEventName = n(s), r
    }]), angular.module("ui.bootstrap.collapse", ["ui.bootstrap.transition"]).directive("collapse", ["$transition", function(t) {
        return {
            link: function(e, i, n) {
                function r(e) {
                    function n() {
                        c === r && (c = void 0)
                    }
                    var r = t(i, e);
                    return c && c.cancel(), c = r, r.then(n, n), r
                }

                function o() {
                    h ? (h = !1, a()) : (i.removeClass("collapse").addClass("collapsing"), r({
                        height: i[0].scrollHeight + "px"
                    }).then(a))
                }

                function a() {
                    i.removeClass("collapsing"), i.addClass("collapse in"), i.css({
                        height: "auto"
                    })
                }

                function s() {
                    if (h) h = !1, l(), i.css({
                        height: 0
                    });
                    else {
                        i.css({
                            height: i[0].scrollHeight + "px"
                        }); {
                            i[0].offsetWidth
                        }
                        i.removeClass("collapse in").addClass("collapsing"), r({
                            height: 0
                        }).then(l)
                    }
                }

                function l() {
                    i.removeClass("collapsing"), i.addClass("collapse")
                }
                var c, h = !0;
                e.$watch(n.collapse, function(t) {
                    t ? s() : o()
                })
            }
        }
    }]), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse"]).constant("accordionConfig", {
        closeOthers: !0
    }).controller("AccordionController", ["$scope", "$attrs", "accordionConfig", function(t, e, i) {
        this.groups = [], this.closeOthers = function(n) {
            var r = angular.isDefined(e.closeOthers) ? t.$eval(e.closeOthers) : i.closeOthers;
            r && angular.forEach(this.groups, function(t) {
                t !== n && (t.isOpen = !1)
            })
        }, this.addGroup = function(t) {
            var e = this;
            this.groups.push(t), t.$on("$destroy", function() {
                e.removeGroup(t)
            })
        }, this.removeGroup = function(t) {
            var e = this.groups.indexOf(t); - 1 !== e && this.groups.splice(e, 1)
        }
    }]).directive("accordion", function() {
        return {
            restrict: "EA",
            controller: "AccordionController",
            transclude: !0,
            replace: !1,
            templateUrl: "template/accordion/accordion.html"
        }
    }).directive("accordionGroup", function() {
        return {
            require: "^accordion",
            restrict: "EA",
            transclude: !0,
            replace: !0,
            templateUrl: "template/accordion/accordion-group.html",
            scope: {
                heading: "@",
                isOpen: "=?",
                isDisabled: "=?"
            },
            controller: function() {
                this.setHeading = function(t) {
                    this.heading = t
                }
            },
            link: function(t, e, i, n) {
                n.addGroup(t), t.$watch("isOpen", function(e) {
                    e && n.closeOthers(t)
                }), t.toggleOpen = function() {
                    t.isDisabled || (t.isOpen = !t.isOpen)
                }
            }
        }
    }).directive("accordionHeading", function() {
        return {
            restrict: "EA",
            transclude: !0,
            template: "",
            replace: !0,
            require: "^accordionGroup",
            link: function(t, e, i, n, r) {
                n.setHeading(r(t, function() {}))
            }
        }
    }).directive("accordionTransclude", function() {
        return {
            require: "^accordionGroup",
            link: function(t, e, i, n) {
                t.$watch(function() {
                    return n[i.accordionTransclude]
                }, function(t) {
                    t && (e.html(""), e.append(t))
                })
            }
        }
    }), angular.module("ui.bootstrap.alert", []).controller("AlertController", ["$scope", "$attrs", function(t, e) {
        t.closeable = "close" in e
    }]).directive("alert", function() {
        return {
            restrict: "EA",
            controller: "AlertController",
            templateUrl: "template/alert/alert.html",
            transclude: !0,
            replace: !0,
            scope: {
                type: "@",
                close: "&"
            }
        }
    }), angular.module("ui.bootstrap.bindHtml", []).directive("bindHtmlUnsafe", function() {
        return function(t, e, i) {
            e.addClass("ng-binding").data("$binding", i.bindHtmlUnsafe), t.$watch(i.bindHtmlUnsafe, function(t) {
                e.html(t || "")
            })
        }
    }), angular.module("ui.bootstrap.buttons", []).constant("buttonConfig", {
        activeClass: "active",
        toggleEvent: "click"
    }).controller("ButtonsController", ["buttonConfig", function(t) {
        this.activeClass = t.activeClass || "active", this.toggleEvent = t.toggleEvent || "click"
    }]).directive("btnRadio", function() {
        return {
            require: ["btnRadio", "ngModel"],
            controller: "ButtonsController",
            link: function(t, e, i, n) {
                var r = n[0],
                    o = n[1];
                o.$render = function() {
                    e.toggleClass(r.activeClass, angular.equals(o.$modelValue, t.$eval(i.btnRadio)))
                }, e.bind(r.toggleEvent, function() {
                    var n = e.hasClass(r.activeClass);
                    (!n || angular.isDefined(i.uncheckable)) && t.$apply(function() {
                        o.$setViewValue(n ? null : t.$eval(i.btnRadio)), o.$render()
                    })
                })
            }
        }
    }).directive("btnCheckbox", function() {
        return {
            require: ["btnCheckbox", "ngModel"],
            controller: "ButtonsController",
            link: function(t, e, i, n) {
                function r() {
                    return a(i.btnCheckboxTrue, !0)
                }

                function o() {
                    return a(i.btnCheckboxFalse, !1)
                }

                function a(e, i) {
                    var n = t.$eval(e);
                    return angular.isDefined(n) ? n : i
                }
                var s = n[0],
                    l = n[1];
                l.$render = function() {
                    e.toggleClass(s.activeClass, angular.equals(l.$modelValue, r()))
                }, e.bind(s.toggleEvent, function() {
                    t.$apply(function() {
                        l.$setViewValue(e.hasClass(s.activeClass) ? o() : r()), l.$render()
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.carousel", ["ui.bootstrap.transition"]).controller("CarouselController", ["$scope", "$timeout", "$transition", function(t, e, i) {
        function n() {
            r();
            var i = +t.interval;
            !isNaN(i) && i >= 0 && (a = e(o, i))
        }

        function r() {
            a && (e.cancel(a), a = null)
        }

        function o() {
            s ? (t.next(), n()) : t.pause()
        }
        var a, s, l = this,
            c = l.slides = t.slides = [],
            h = -1;
        l.currentSlide = null;
        var u = !1;
        l.select = t.select = function(r, o) {
            function a() {
                if (!u) {
                    if (l.currentSlide && angular.isString(o) && !t.noTransition && r.$element) {
                        r.$element.addClass(o); {
                            r.$element[0].offsetWidth
                        }
                        angular.forEach(c, function(t) {
                                angular.extend(t, {
                                    direction: "",
                                    entering: !1,
                                    leaving: !1,
                                    active: !1
                                })
                            }), angular.extend(r, {
                                direction: o,
                                active: !0,
                                entering: !0
                            }), angular.extend(l.currentSlide || {}, {
                                direction: o,
                                leaving: !0
                            }), t.$currentTransition = i(r.$element, {}),
                            function(e, i) {
                                t.$currentTransition.then(function() {
                                    s(e, i)
                                }, function() {
                                    s(e, i)
                                })
                            }(r, l.currentSlide)
                    } else s(r, l.currentSlide);
                    l.currentSlide = r, h = f, n()
                }
            }

            function s(e, i) {
                angular.extend(e, {
                    direction: "",
                    active: !0,
                    leaving: !1,
                    entering: !1
                }), angular.extend(i || {}, {
                    direction: "",
                    active: !1,
                    leaving: !1,
                    entering: !1
                }), t.$currentTransition = null
            }
            var f = c.indexOf(r);
            void 0 === o && (o = f > h ? "next" : "prev"), r && r !== l.currentSlide && (t.$currentTransition ? (t.$currentTransition.cancel(), e(a)) : a())
        }, t.$on("$destroy", function() {
            u = !0
        }), l.indexOfSlide = function(t) {
            return c.indexOf(t)
        }, t.next = function() {
            var e = (h + 1) % c.length;
            return t.$currentTransition ? void 0 : l.select(c[e], "next")
        }, t.prev = function() {
            var e = 0 > h - 1 ? c.length - 1 : h - 1;
            return t.$currentTransition ? void 0 : l.select(c[e], "prev")
        }, t.isActive = function(t) {
            return l.currentSlide === t
        }, t.$watch("interval", n), t.$on("$destroy", r), t.play = function() {
            s || (s = !0, n())
        }, t.pause = function() {
            t.noPause || (s = !1, r())
        }, l.addSlide = function(e, i) {
            e.$element = i, c.push(e), 1 === c.length || e.active ? (l.select(c[c.length - 1]), 1 == c.length && t.play()) : e.active = !1
        }, l.removeSlide = function(t) {
            var e = c.indexOf(t);
            c.splice(e, 1), c.length > 0 && t.active ? l.select(e >= c.length ? c[e - 1] : c[e]) : h > e && h--
        }
    }]).directive("carousel", [function() {
        return {
            restrict: "EA",
            transclude: !0,
            replace: !0,
            controller: "CarouselController",
            require: "carousel",
            templateUrl: "template/carousel/carousel.html",
            scope: {
                interval: "=",
                noTransition: "=",
                noPause: "="
            }
        }
    }]).directive("slide", function() {
        return {
            require: "^carousel",
            restrict: "EA",
            transclude: !0,
            replace: !0,
            templateUrl: "template/carousel/slide.html",
            scope: {
                active: "=?"
            },
            link: function(t, e, i, n) {
                n.addSlide(t, e), t.$on("$destroy", function() {
                    n.removeSlide(t)
                }), t.$watch("active", function(e) {
                    e && n.select(t)
                })
            }
        }
    }), angular.module("ui.bootstrap.dateparser", []).service("dateParser", ["$locale", "orderByFilter", function(t, e) {
        function i(t) {
            var i = [],
                n = t.split("");
            return angular.forEach(r, function(e, r) {
                var o = t.indexOf(r);
                if (o > -1) {
                    t = t.split(""), n[o] = "(" + e.regex + ")", t[o] = "$";
                    for (var a = o + 1, s = o + r.length; s > a; a++) n[a] = "", t[a] = "$";
                    t = t.join(""), i.push({
                        index: o,
                        apply: e.apply
                    })
                }
            }), {
                regex: new RegExp("^" + n.join("") + "$"),
                map: e(i, "index")
            }
        }

        function n(t, e, i) {
            return 1 === e && i > 28 ? 29 === i && (t % 4 === 0 && t % 100 !== 0 || t % 400 === 0) : 3 === e || 5 === e || 8 === e || 10 === e ? 31 > i : !0
        }
        this.parsers = {};
        var r = {
            yyyy: {
                regex: "\\d{4}",
                apply: function(t) {
                    this.year = +t
                }
            },
            yy: {
                regex: "\\d{2}",
                apply: function(t) {
                    this.year = +t + 2e3
                }
            },
            y: {
                regex: "\\d{1,4}",
                apply: function(t) {
                    this.year = +t
                }
            },
            MMMM: {
                regex: t.DATETIME_FORMATS.MONTH.join("|"),
                apply: function(e) {
                    this.month = t.DATETIME_FORMATS.MONTH.indexOf(e)
                }
            },
            MMM: {
                regex: t.DATETIME_FORMATS.SHORTMONTH.join("|"),
                apply: function(e) {
                    this.month = t.DATETIME_FORMATS.SHORTMONTH.indexOf(e)
                }
            },
            MM: {
                regex: "0[1-9]|1[0-2]",
                apply: function(t) {
                    this.month = t - 1
                }
            },
            M: {
                regex: "[1-9]|1[0-2]",
                apply: function(t) {
                    this.month = t - 1
                }
            },
            dd: {
                regex: "[0-2][0-9]{1}|3[0-1]{1}",
                apply: function(t) {
                    this.date = +t
                }
            },
            d: {
                regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(t) {
                    this.date = +t
                }
            },
            EEEE: {
                regex: t.DATETIME_FORMATS.DAY.join("|")
            },
            EEE: {
                regex: t.DATETIME_FORMATS.SHORTDAY.join("|")
            }
        };
        this.parse = function(e, r) {
            if (!angular.isString(e) || !r) return e;
            r = t.DATETIME_FORMATS[r] || r, this.parsers[r] || (this.parsers[r] = i(r));
            var o = this.parsers[r],
                a = o.regex,
                s = o.map,
                l = e.match(a);
            if (l && l.length) {
                for (var c, h = {
                        year: 1900,
                        month: 0,
                        date: 1,
                        hours: 0
                    }, u = 1, f = l.length; f > u; u++) {
                    var d = s[u - 1];
                    d.apply && d.apply.call(h, l[u])
                }
                return n(h.year, h.month, h.date) && (c = new Date(h.year, h.month, h.date, h.hours)), c
            }
        }
    }]), angular.module("ui.bootstrap.position", []).factory("$position", ["$document", "$window", function(t, e) {
        function i(t, i) {
            return t.currentStyle ? t.currentStyle[i] : e.getComputedStyle ? e.getComputedStyle(t)[i] : t.style[i]
        }

        function n(t) {
            return "static" === (i(t, "position") || "static")
        }
        var r = function(e) {
            for (var i = t[0], r = e.offsetParent || i; r && r !== i && n(r);) r = r.offsetParent;
            return r || i
        };
        return {
            position: function(e) {
                var i = this.offset(e),
                    n = {
                        top: 0,
                        left: 0
                    },
                    o = r(e[0]);
                o != t[0] && (n = this.offset(angular.element(o)), n.top += o.clientTop - o.scrollTop, n.left += o.clientLeft - o.scrollLeft);
                var a = e[0].getBoundingClientRect();
                return {
                    width: a.width || e.prop("offsetWidth"),
                    height: a.height || e.prop("offsetHeight"),
                    top: i.top - n.top,
                    left: i.left - n.left
                }
            },
            offset: function(i) {
                var n = i[0].getBoundingClientRect();
                return {
                    width: n.width || i.prop("offsetWidth"),
                    height: n.height || i.prop("offsetHeight"),
                    top: n.top + (e.pageYOffset || t[0].documentElement.scrollTop),
                    left: n.left + (e.pageXOffset || t[0].documentElement.scrollLeft)
                }
            },
            positionElements: function(t, e, i, n) {
                var r, o, a, s, l = i.split("-"),
                    c = l[0],
                    h = l[1] || "center";
                r = n ? this.offset(t) : this.position(t), o = e.prop("offsetWidth"), a = e.prop("offsetHeight");
                var u = {
                        center: function() {
                            return r.left + r.width / 2 - o / 2
                        },
                        left: function() {
                            return r.left
                        },
                        right: function() {
                            return r.left + r.width
                        }
                    },
                    f = {
                        center: function() {
                            return r.top + r.height / 2 - a / 2
                        },
                        top: function() {
                            return r.top
                        },
                        bottom: function() {
                            return r.top + r.height
                        }
                    };
                switch (c) {
                    case "right":
                        s = {
                            top: f[h](),
                            left: u[c]()
                        };
                        break;
                    case "left":
                        s = {
                            top: f[h](),
                            left: r.left - o
                        };
                        break;
                    case "bottom":
                        s = {
                            top: f[c](),
                            left: u[h]()
                        };
                        break;
                    default:
                        s = {
                            top: r.top - a,
                            left: u[h]()
                        }
                }
                return s
            }
        }
    }]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.position"]).constant("datepickerConfig", {
        formatDay: "dd",
        formatMonth: "MMMM",
        formatYear: "yyyy",
        formatDayHeader: "EEE",
        formatDayTitle: "MMMM yyyy",
        formatMonthTitle: "yyyy",
        datepickerMode: "day",
        minMode: "day",
        maxMode: "year",
        showWeeks: !0,
        startingDay: 0,
        yearRange: 20,
        minDate: null,
        maxDate: null
    }).controller("DatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$timeout", "$log", "dateFilter", "datepickerConfig", function(t, e, i, n, r, o, a, s) {
        var l = this,
            c = {
                $setViewValue: angular.noop
            };
        this.modes = ["day", "month", "year"], angular.forEach(["formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "minMode", "maxMode", "showWeeks", "startingDay", "yearRange"], function(i, r) {
            l[i] = angular.isDefined(e[i]) ? 8 > r ? n(e[i])(t.$parent) : t.$parent.$eval(e[i]) : s[i]
        }), angular.forEach(["minDate", "maxDate"], function(n) {
            e[n] ? t.$parent.$watch(i(e[n]), function(t) {
                l[n] = t ? new Date(t) : null, l.refreshView()
            }) : l[n] = s[n] ? new Date(s[n]) : null
        }), t.datepickerMode = t.datepickerMode || s.datepickerMode, t.uniqueId = "datepicker-" + t.$id + "-" + Math.floor(1e4 * Math.random()), this.activeDate = angular.isDefined(e.initDate) ? t.$parent.$eval(e.initDate) : new Date, t.isActive = function(e) {
            return 0 === l.compare(e.date, l.activeDate) ? (t.activeDateId = e.uid, !0) : !1
        }, this.init = function(t) {
            c = t, c.$render = function() {
                l.render()
            }
        }, this.render = function() {
            if (c.$modelValue) {
                var t = new Date(c.$modelValue),
                    e = !isNaN(t);
                e ? this.activeDate = t : o.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'), c.$setValidity("date", e)
            }
            this.refreshView()
        }, this.refreshView = function() {
            if (this.element) {
                this._refreshView();
                var t = c.$modelValue ? new Date(c.$modelValue) : null;
                c.$setValidity("date-disabled", !t || this.element && !this.isDisabled(t))
            }
        }, this.createDateObject = function(t, e) {
            var i = c.$modelValue ? new Date(c.$modelValue) : null;
            return {
                date: t,
                label: a(t, e),
                selected: i && 0 === this.compare(t, i),
                disabled: this.isDisabled(t),
                current: 0 === this.compare(t, new Date)
            }
        }, this.isDisabled = function(i) {
            return this.minDate && this.compare(i, this.minDate) < 0 || this.maxDate && this.compare(i, this.maxDate) > 0 || e.dateDisabled && t.dateDisabled({
                date: i,
                mode: t.datepickerMode
            })
        }, this.split = function(t, e) {
            for (var i = []; t.length > 0;) i.push(t.splice(0, e));
            return i
        }, t.select = function(e) {
            if (t.datepickerMode === l.minMode) {
                var i = c.$modelValue ? new Date(c.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
                i.setFullYear(e.getFullYear(), e.getMonth(), e.getDate()), c.$setViewValue(i), c.$render()
            } else l.activeDate = e, t.datepickerMode = l.modes[l.modes.indexOf(t.datepickerMode) - 1]
        }, t.move = function(t) {
            var e = l.activeDate.getFullYear() + t * (l.step.years || 0),
                i = l.activeDate.getMonth() + t * (l.step.months || 0);
            l.activeDate.setFullYear(e, i, 1), l.refreshView()
        }, t.toggleMode = function(e) {
            e = e || 1, t.datepickerMode === l.maxMode && 1 === e || t.datepickerMode === l.minMode && -1 === e || (t.datepickerMode = l.modes[l.modes.indexOf(t.datepickerMode) + e])
        }, t.keys = {
            13: "enter",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };
        var h = function() {
            r(function() {
                l.element[0].focus()
            }, 0, !1)
        };
        t.$on("datepicker.focus", h), t.keydown = function(e) {
            var i = t.keys[e.which];
            if (i && !e.shiftKey && !e.altKey)
                if (e.preventDefault(), e.stopPropagation(), "enter" === i || "space" === i) {
                    if (l.isDisabled(l.activeDate)) return;
                    t.select(l.activeDate), h()
                } else !e.ctrlKey || "up" !== i && "down" !== i ? (l.handleKeyDown(i, e), l.refreshView()) : (t.toggleMode("up" === i ? 1 : -1), h())
        }
    }]).directive("datepicker", function() {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/datepicker.html",
            scope: {
                datepickerMode: "=?",
                dateDisabled: "&"
            },
            require: ["datepicker", "?^ngModel"],
            controller: "DatepickerController",
            link: function(t, e, i, n) {
                var r = n[0],
                    o = n[1];
                o && r.init(o)
            }
        }
    }).directive("daypicker", ["dateFilter", function(t) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/day.html",
            require: "^datepicker",
            link: function(e, i, n, r) {
                function o(t, e) {
                    return 1 !== e || t % 4 !== 0 || t % 100 === 0 && t % 400 !== 0 ? l[e] : 29
                }

                function a(t, e) {
                    var i = new Array(e),
                        n = new Date(t),
                        r = 0;
                    for (n.setHours(12); e > r;) i[r++] = new Date(n), n.setDate(n.getDate() + 1);
                    return i
                }

                function s(t) {
                    var e = new Date(t);
                    e.setDate(e.getDate() + 4 - (e.getDay() || 7));
                    var i = e.getTime();
                    return e.setMonth(0), e.setDate(1), Math.floor(Math.round((i - e) / 864e5) / 7) + 1
                }
                e.showWeeks = r.showWeeks, r.step = {
                    months: 1
                }, r.element = i;
                var l = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                r._refreshView = function() {
                    var i = r.activeDate.getFullYear(),
                        n = r.activeDate.getMonth(),
                        o = new Date(i, n, 1),
                        l = r.startingDay - o.getDay(),
                        c = l > 0 ? 7 - l : -l,
                        h = new Date(o);
                    c > 0 && h.setDate(-c + 1);
                    for (var u = a(h, 42), f = 0; 42 > f; f++) u[f] = angular.extend(r.createDateObject(u[f], r.formatDay), {
                        secondary: u[f].getMonth() !== n,
                        uid: e.uniqueId + "-" + f
                    });
                    e.labels = new Array(7);
                    for (var d = 0; 7 > d; d++) e.labels[d] = {
                        abbr: t(u[d].date, r.formatDayHeader),
                        full: t(u[d].date, "EEEE")
                    };
                    if (e.title = t(r.activeDate, r.formatDayTitle), e.rows = r.split(u, 7), e.showWeeks) {
                        e.weekNumbers = [];
                        for (var p = s(e.rows[0][0].date), g = e.rows.length; e.weekNumbers.push(p++) < g;);
                    }
                }, r.compare = function(t, e) {
                    return new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(e.getFullYear(), e.getMonth(), e.getDate())
                }, r.handleKeyDown = function(t) {
                    var e = r.activeDate.getDate();
                    if ("left" === t) e -= 1;
                    else if ("up" === t) e -= 7;
                    else if ("right" === t) e += 1;
                    else if ("down" === t) e += 7;
                    else if ("pageup" === t || "pagedown" === t) {
                        var i = r.activeDate.getMonth() + ("pageup" === t ? -1 : 1);
                        r.activeDate.setMonth(i, 1), e = Math.min(o(r.activeDate.getFullYear(), r.activeDate.getMonth()), e)
                    } else "home" === t ? e = 1 : "end" === t && (e = o(r.activeDate.getFullYear(), r.activeDate.getMonth()));
                    r.activeDate.setDate(e)
                }, r.refreshView()
            }
        }
    }]).directive("monthpicker", ["dateFilter", function(t) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/month.html",
            require: "^datepicker",
            link: function(e, i, n, r) {
                r.step = {
                    years: 1
                }, r.element = i, r._refreshView = function() {
                    for (var i = new Array(12), n = r.activeDate.getFullYear(), o = 0; 12 > o; o++) i[o] = angular.extend(r.createDateObject(new Date(n, o, 1), r.formatMonth), {
                        uid: e.uniqueId + "-" + o
                    });
                    e.title = t(r.activeDate, r.formatMonthTitle), e.rows = r.split(i, 3)
                }, r.compare = function(t, e) {
                    return new Date(t.getFullYear(), t.getMonth()) - new Date(e.getFullYear(), e.getMonth())
                }, r.handleKeyDown = function(t) {
                    var e = r.activeDate.getMonth();
                    if ("left" === t) e -= 1;
                    else if ("up" === t) e -= 3;
                    else if ("right" === t) e += 1;
                    else if ("down" === t) e += 3;
                    else if ("pageup" === t || "pagedown" === t) {
                        var i = r.activeDate.getFullYear() + ("pageup" === t ? -1 : 1);
                        r.activeDate.setFullYear(i)
                    } else "home" === t ? e = 0 : "end" === t && (e = 11);
                    r.activeDate.setMonth(e)
                }, r.refreshView()
            }
        }
    }]).directive("yearpicker", ["dateFilter", function() {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/year.html",
            require: "^datepicker",
            link: function(t, e, i, n) {
                function r(t) {
                    return parseInt((t - 1) / o, 10) * o + 1
                }
                var o = n.yearRange;
                n.step = {
                    years: o
                }, n.element = e, n._refreshView = function() {
                    for (var e = new Array(o), i = 0, a = r(n.activeDate.getFullYear()); o > i; i++) e[i] = angular.extend(n.createDateObject(new Date(a + i, 0, 1), n.formatYear), {
                        uid: t.uniqueId + "-" + i
                    });
                    t.title = [e[0].label, e[o - 1].label].join(" - "), t.rows = n.split(e, 5)
                }, n.compare = function(t, e) {
                    return t.getFullYear() - e.getFullYear()
                }, n.handleKeyDown = function(t) {
                    var e = n.activeDate.getFullYear();
                    "left" === t ? e -= 1 : "up" === t ? e -= 5 : "right" === t ? e += 1 : "down" === t ? e += 5 : "pageup" === t || "pagedown" === t ? e += ("pageup" === t ? -1 : 1) * n.step.years : "home" === t ? e = r(n.activeDate.getFullYear()) : "end" === t && (e = r(n.activeDate.getFullYear()) + o - 1), n.activeDate.setFullYear(e)
                }, n.refreshView()
            }
        }
    }]).constant("datepickerPopupConfig", {
        datepickerPopup: "yyyy-MM-dd",
        currentText: "Today",
        clearText: "Clear",
        closeText: "Done",
        closeOnDateSelection: !0,
        appendToBody: !1,
        showButtonBar: !0
    }).directive("datepickerPopup", ["$compile", "$parse", "$document", "$position", "dateFilter", "dateParser", "datepickerPopupConfig", function(t, e, i, n, r, o, a) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                isOpen: "=?",
                currentText: "@",
                clearText: "@",
                closeText: "@",
                dateDisabled: "&"
            },
            link: function(s, l, c, h) {
                function u(t) {
                    return t.replace(/([A-Z])/g, function(t) {
                        return "-" + t.toLowerCase()
                    })
                }

                function f(t) {
                    if (t) {
                        if (angular.isDate(t) && !isNaN(t)) return h.$setValidity("date", !0), t;
                        if (angular.isString(t)) {
                            var e = o.parse(t, d) || new Date(t);
                            return isNaN(e) ? void h.$setValidity("date", !1) : (h.$setValidity("date", !0), e)
                        }
                        return void h.$setValidity("date", !1)
                    }
                    return h.$setValidity("date", !0), null
                }
                var d, p = angular.isDefined(c.closeOnDateSelection) ? s.$parent.$eval(c.closeOnDateSelection) : a.closeOnDateSelection,
                    g = angular.isDefined(c.datepickerAppendToBody) ? s.$parent.$eval(c.datepickerAppendToBody) : a.appendToBody;
                s.showButtonBar = angular.isDefined(c.showButtonBar) ? s.$parent.$eval(c.showButtonBar) : a.showButtonBar, s.getText = function(t) {
                    return s[t + "Text"] || a[t + "Text"]
                }, c.$observe("datepickerPopup", function(t) {
                    d = t || a.datepickerPopup, h.$render()
                });
                var v = angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");
                v.attr({
                    "ng-model": "date",
                    "ng-change": "dateSelection()"
                });
                var m = angular.element(v.children()[0]);
                c.datepickerOptions && angular.forEach(s.$parent.$eval(c.datepickerOptions), function(t, e) {
                    m.attr(u(e), t)
                }), s.watchData = {}, angular.forEach(["minDate", "maxDate", "datepickerMode"], function(t) {
                    if (c[t]) {
                        var i = e(c[t]);
                        if (s.$parent.$watch(i, function(e) {
                                s.watchData[t] = e
                            }), m.attr(u(t), "watchData." + t), "datepickerMode" === t) {
                            var n = i.assign;
                            s.$watch("watchData." + t, function(t, e) {
                                t !== e && n(s.$parent, t)
                            })
                        }
                    }
                }), c.dateDisabled && m.attr("date-disabled", "dateDisabled({ date: date, mode: mode })"), h.$parsers.unshift(f), s.dateSelection = function(t) {
                    angular.isDefined(t) && (s.date = t), h.$setViewValue(s.date), h.$render(), p && (s.isOpen = !1, l[0].focus())
                }, l.bind("input change keyup", function() {
                    s.$apply(function() {
                        s.date = h.$modelValue
                    })
                }), h.$render = function() {
                    var t = h.$viewValue ? r(h.$viewValue, d) : "";
                    l.val(t), s.date = f(h.$modelValue)
                };
                var b = function(t) {
                        s.isOpen && t.target !== l[0] && s.$apply(function() {
                            s.isOpen = !1
                        })
                    },
                    y = function(t) {
                        s.keydown(t)
                    };
                l.bind("keydown", y), s.keydown = function(t) {
                    27 === t.which ? (t.preventDefault(), t.stopPropagation(), s.close()) : 40 !== t.which || s.isOpen || (s.isOpen = !0)
                }, s.$watch("isOpen", function(t) {
                    t ? (s.$broadcast("datepicker.focus"), s.position = g ? n.offset(l) : n.position(l), s.position.top = s.position.top + l.prop("offsetHeight"), i.bind("click", b)) : i.unbind("click", b)
                }), s.select = function(t) {
                    if ("today" === t) {
                        var e = new Date;
                        angular.isDate(h.$modelValue) ? (t = new Date(h.$modelValue), t.setFullYear(e.getFullYear(), e.getMonth(), e.getDate())) : t = new Date(e.setHours(0, 0, 0, 0))
                    }
                    s.dateSelection(t)
                }, s.close = function() {
                    s.isOpen = !1, l[0].focus()
                };
                var x = t(v)(s);
                v.remove(), g ? i.find("body").append(x) : l.after(x), s.$on("$destroy", function() {
                    x.remove(), l.unbind("keydown", y), i.unbind("click", b)
                })
            }
        }
    }]).directive("datepickerPopupWrap", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            templateUrl: "template/datepicker/popup.html",
            link: function(t, e) {
                e.bind("click", function(t) {
                    t.preventDefault(), t.stopPropagation()
                })
            }
        }
    }), angular.module("ui.bootstrap.dropdown", []).constant("dropdownConfig", {
        openClass: "open"
    }).service("dropdownService", ["$document", function(t) {
        var e = null;
        this.open = function(r) {
            e || (t.bind("click", i), t.bind("keydown", n)), e && e !== r && (e.isOpen = !1), e = r
        }, this.close = function(r) {
            e === r && (e = null, t.unbind("click", i), t.unbind("keydown", n))
        };
        var i = function(t) {
                var i = e.getToggleElement();
                t && i && i[0].contains(t.target) || e.$apply(function() {
                    e.isOpen = !1
                })
            },
            n = function(t) {
                27 === t.which && (e.focusToggleElement(), i())
            }
    }]).controller("DropdownController", ["$scope", "$attrs", "$parse", "dropdownConfig", "dropdownService", "$animate", function(t, e, i, n, r, o) {
        var a, s = this,
            l = t.$new(),
            c = n.openClass,
            h = angular.noop,
            u = e.onToggle ? i(e.onToggle) : angular.noop;
        this.init = function(n) {
            s.$element = n, e.isOpen && (a = i(e.isOpen), h = a.assign, t.$watch(a, function(t) {
                l.isOpen = !!t
            }))
        }, this.toggle = function(t) {
            return l.isOpen = arguments.length ? !!t : !l.isOpen
        }, this.isOpen = function() {
            return l.isOpen
        }, l.getToggleElement = function() {
            return s.toggleElement
        }, l.focusToggleElement = function() {
            s.toggleElement && s.toggleElement[0].focus()
        }, l.$watch("isOpen", function(e, i) {
            o[e ? "addClass" : "removeClass"](s.$element, c), e ? (l.focusToggleElement(), r.open(l)) : r.close(l), h(t, e), angular.isDefined(e) && e !== i && u(t, {
                open: !!e
            })
        }), t.$on("$locationChangeSuccess", function() {
            l.isOpen = !1
        }), t.$on("$destroy", function() {
            l.$destroy()
        })
    }]).directive("dropdown", function() {
        return {
            controller: "DropdownController",
            link: function(t, e, i, n) {
                n.init(e)
            }
        }
    }).directive("dropdownToggle", function() {
        return {
            require: "?^dropdown",
            link: function(t, e, i, n) {
                if (n) {
                    n.toggleElement = e;
                    var r = function(r) {
                        r.preventDefault(), e.hasClass("disabled") || i.disabled || t.$apply(function() {
                            n.toggle()
                        })
                    };
                    e.bind("click", r), e.attr({
                        "aria-haspopup": !0,
                        "aria-expanded": !1
                    }), t.$watch(n.isOpen, function(t) {
                        e.attr("aria-expanded", !!t)
                    }), t.$on("$destroy", function() {
                        e.unbind("click", r)
                    })
                }
            }
        }
    }), angular.module("ui.bootstrap.modal", ["ui.bootstrap.transition"]).factory("$$stackedMap", function() {
        return {
            createNew: function() {
                var t = [];
                return {
                    add: function(e, i) {
                        t.push({
                            key: e,
                            value: i
                        })
                    },
                    get: function(e) {
                        for (var i = 0; i < t.length; i++)
                            if (e == t[i].key) return t[i]
                    },
                    keys: function() {
                        for (var e = [], i = 0; i < t.length; i++) e.push(t[i].key);
                        return e
                    },
                    top: function() {
                        return t[t.length - 1]
                    },
                    remove: function(e) {
                        for (var i = -1, n = 0; n < t.length; n++)
                            if (e == t[n].key) {
                                i = n;
                                break
                            }
                        return t.splice(i, 1)[0]
                    },
                    removeTop: function() {
                        return t.splice(t.length - 1, 1)[0]
                    },
                    length: function() {
                        return t.length
                    }
                }
            }
        }
    }).directive("modalBackdrop", ["$timeout", function(t) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/modal/backdrop.html",
            link: function(e, i, n) {
                e.backdropClass = n.backdropClass || "", e.animate = !1, t(function() {
                    e.animate = !0
                })
            }
        }
    }]).directive("modalWindow", ["$modalStack", "$timeout", function(t, e) {
        return {
            restrict: "EA",
            scope: {
                index: "@",
                animate: "="
            },
            replace: !0,
            transclude: !0,
            templateUrl: function(t, e) {
                return e.templateUrl || "template/modal/window.html"
            },
            link: function(i, n, r) {
                n.addClass(r.windowClass || ""), i.size = r.size, e(function() {
                    i.animate = !0, n[0].querySelectorAll("[autofocus]").length || n[0].focus()
                }), i.close = function(e) {
                    var i = t.getTop();
                    i && i.value.backdrop && "static" != i.value.backdrop && e.target === e.currentTarget && (e.preventDefault(), e.stopPropagation(), t.dismiss(i.key, "backdrop click"))
                }
            }
        }
    }]).directive("modalTransclude", function() {
        return {
            link: function(t, e, i, n, r) {
                r(t.$parent, function(t) {
                    e.empty(), e.append(t)
                })
            }
        }
    }).factory("$modalStack", ["$transition", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap", function(t, e, i, n, r, o) {
        function a() {
            for (var t = -1, e = d.keys(), i = 0; i < e.length; i++) d.get(e[i]).value.backdrop && (t = i);
            return t
        }

        function s(t) {
            var e = i.find("body").eq(0),
                n = d.get(t).value;
            d.remove(t), c(n.modalDomEl, n.modalScope, 300, function() {
                n.modalScope.$destroy(), e.toggleClass(f, d.length() > 0), l()
            })
        }

        function l() {
            if (h && -1 == a()) {
                var t = u;
                c(h, u, 150, function() {
                    t.$destroy(), t = null
                }), h = void 0, u = void 0
            }
        }

        function c(i, n, r, o) {
            function a() {
                a.done || (a.done = !0, i.remove(), o && o())
            }
            n.animate = !1;
            var s = t.transitionEndEventName;
            if (s) {
                var l = e(a, r);
                i.bind(s, function() {
                    e.cancel(l), a(), n.$apply()
                })
            } else e(a)
        }
        var h, u, f = "modal-open",
            d = o.createNew(),
            p = {};
        return r.$watch(a, function(t) {
            u && (u.index = t)
        }), i.bind("keydown", function(t) {
            var e;
            27 === t.which && (e = d.top(), e && e.value.keyboard && (t.preventDefault(), r.$apply(function() {
                p.dismiss(e.key, "escape key press")
            })))
        }), p.open = function(t, e) {
            d.add(t, {
                deferred: e.deferred,
                modalScope: e.scope,
                backdrop: e.backdrop,
                keyboard: e.keyboard
            });
            var o = i.find("body").eq(0),
                s = a();
            if (s >= 0 && !h) {
                u = r.$new(!0), u.index = s;
                var l = angular.element("<div modal-backdrop></div>");
                l.attr("backdrop-class", e.backdropClass), h = n(l)(u), o.append(h)
            }
            var c = angular.element("<div modal-window></div>");
            c.attr({
                "template-url": e.windowTemplateUrl,
                "window-class": e.windowClass,
                size: e.size,
                index: d.length() - 1,
                animate: "animate"
            }).html(e.content);
            var p = n(c)(e.scope);
            d.top().value.modalDomEl = p, o.append(p), o.addClass(f)
        }, p.close = function(t, e) {
            var i = d.get(t);
            i && (i.value.deferred.resolve(e), s(t))
        }, p.dismiss = function(t, e) {
            var i = d.get(t);
            i && (i.value.deferred.reject(e), s(t))
        }, p.dismissAll = function(t) {
            for (var e = this.getTop(); e;) this.dismiss(e.key, t), e = this.getTop()
        }, p.getTop = function() {
            return d.top()
        }, p
    }]).provider("$modal", function() {
        var t = {
            options: {
                backdrop: !0,
                keyboard: !0
            },
            $get: ["$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack", function(e, i, n, r, o, a, s) {
                function l(t) {
                    return t.template ? n.when(t.template) : r.get(angular.isFunction(t.templateUrl) ? t.templateUrl() : t.templateUrl, {
                        cache: o
                    }).then(function(t) {
                        return t.data
                    })
                }

                function c(t) {
                    var i = [];
                    return angular.forEach(t, function(t) {
                        (angular.isFunction(t) || angular.isArray(t)) && i.push(n.when(e.invoke(t)))
                    }), i
                }
                var h = {};
                return h.open = function(e) {
                    var r = n.defer(),
                        o = n.defer(),
                        h = {
                            result: r.promise,
                            opened: o.promise,
                            close: function(t) {
                                s.close(h, t)
                            },
                            dismiss: function(t) {
                                s.dismiss(h, t)
                            }
                        };
                    if (e = angular.extend({}, t.options, e), e.resolve = e.resolve || {}, !e.template && !e.templateUrl) throw new Error("One of template or templateUrl options is required.");
                    var u = n.all([l(e)].concat(c(e.resolve)));
                    return u.then(function(t) {
                        var n = (e.scope || i).$new();
                        n.$close = h.close, n.$dismiss = h.dismiss;
                        var o, l = {},
                            c = 1;
                        e.controller && (l.$scope = n, l.$modalInstance = h, angular.forEach(e.resolve, function(e, i) {
                            l[i] = t[c++]
                        }), o = a(e.controller, l), e.controllerAs && (n[e.controllerAs] = o)), s.open(h, {
                            scope: n,
                            deferred: r,
                            content: t[0],
                            backdrop: e.backdrop,
                            keyboard: e.keyboard,
                            backdropClass: e.backdropClass,
                            windowClass: e.windowClass,
                            windowTemplateUrl: e.windowTemplateUrl,
                            size: e.size
                        })
                    }, function(t) {
                        r.reject(t)
                    }), u.then(function() {
                        o.resolve(!0)
                    }, function() {
                        o.reject(!1)
                    }), h
                }, h
            }]
        };
        return t
    }), angular.module("ui.bootstrap.pagination", []).controller("PaginationController", ["$scope", "$attrs", "$parse", function(t, e, i) {
        var n = this,
            r = {
                $setViewValue: angular.noop
            },
            o = e.numPages ? i(e.numPages).assign : angular.noop;
        this.init = function(o, a) {
            r = o, this.config = a, r.$render = function() {
                n.render()
            }, e.itemsPerPage ? t.$parent.$watch(i(e.itemsPerPage), function(e) {
                n.itemsPerPage = parseInt(e, 10), t.totalPages = n.calculateTotalPages()
            }) : this.itemsPerPage = a.itemsPerPage
        }, this.calculateTotalPages = function() {
            var e = this.itemsPerPage < 1 ? 1 : Math.ceil(t.totalItems / this.itemsPerPage);
            return Math.max(e || 0, 1)
        }, this.render = function() {
            t.page = parseInt(r.$viewValue, 10) || 1
        }, t.selectPage = function(e) {
            t.page !== e && e > 0 && e <= t.totalPages && (r.$setViewValue(e), r.$render())
        }, t.getText = function(e) {
            return t[e + "Text"] || n.config[e + "Text"]
        }, t.noPrevious = function() {
            return 1 === t.page
        }, t.noNext = function() {
            return t.page === t.totalPages
        }, t.$watch("totalItems", function() {
            t.totalPages = n.calculateTotalPages()
        }), t.$watch("totalPages", function(e) {
            o(t.$parent, e), t.page > e ? t.selectPage(e) : r.$render()
        })
    }]).constant("paginationConfig", {
        itemsPerPage: 10,
        boundaryLinks: !1,
        directionLinks: !0,
        firstText: "First",
        previousText: "Previous",
        nextText: "Next",
        lastText: "Last",
        rotate: !0
    }).directive("pagination", ["$parse", "paginationConfig", function(t, e) {
        return {
            restrict: "EA",
            scope: {
                totalItems: "=",
                firstText: "@",
                previousText: "@",
                nextText: "@",
                lastText: "@"
            },
            require: ["pagination", "?ngModel"],
            controller: "PaginationController",
            templateUrl: "template/pagination/pagination.html",
            replace: !0,
            link: function(i, n, r, o) {
                function a(t, e, i) {
                    return {
                        number: t,
                        text: e,
                        active: i
                    }
                }

                function s(t, e) {
                    var i = [],
                        n = 1,
                        r = e,
                        o = angular.isDefined(h) && e > h;
                    o && (u ? (n = Math.max(t - Math.floor(h / 2), 1), r = n + h - 1, r > e && (r = e, n = r - h + 1)) : (n = (Math.ceil(t / h) - 1) * h + 1, r = Math.min(n + h - 1, e)));
                    for (var s = n; r >= s; s++) {
                        var l = a(s, s, s === t);
                        i.push(l)
                    }
                    if (o && !u) {
                        if (n > 1) {
                            var c = a(n - 1, "...", !1);
                            i.unshift(c)
                        }
                        if (e > r) {
                            var f = a(r + 1, "...", !1);
                            i.push(f)
                        }
                    }
                    return i
                }
                var l = o[0],
                    c = o[1];
                if (c) {
                    var h = angular.isDefined(r.maxSize) ? i.$parent.$eval(r.maxSize) : e.maxSize,
                        u = angular.isDefined(r.rotate) ? i.$parent.$eval(r.rotate) : e.rotate;
                    i.boundaryLinks = angular.isDefined(r.boundaryLinks) ? i.$parent.$eval(r.boundaryLinks) : e.boundaryLinks, i.directionLinks = angular.isDefined(r.directionLinks) ? i.$parent.$eval(r.directionLinks) : e.directionLinks, l.init(c, e), r.maxSize && i.$parent.$watch(t(r.maxSize), function(t) {
                        h = parseInt(t, 10), l.render()
                    });
                    var f = l.render;
                    l.render = function() {
                        f(), i.page > 0 && i.page <= i.totalPages && (i.pages = s(i.page, i.totalPages))
                    }
                }
            }
        }
    }]).constant("pagerConfig", {
        itemsPerPage: 10,
        previousText: "« Previous",
        nextText: "Next »",
        align: !0
    }).directive("pager", ["pagerConfig", function(t) {
        return {
            restrict: "EA",
            scope: {
                totalItems: "=",
                previousText: "@",
                nextText: "@"
            },
            require: ["pager", "?ngModel"],
            controller: "PaginationController",
            templateUrl: "template/pagination/pager.html",
            replace: !0,
            link: function(e, i, n, r) {
                var o = r[0],
                    a = r[1];
                a && (e.align = angular.isDefined(n.align) ? e.$parent.$eval(n.align) : t.align, o.init(a, t))
            }
        }
    }]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).provider("$tooltip", function() {
        function t(t) {
            var e = /[A-Z]/g,
                i = "-";
            return t.replace(e, function(t, e) {
                return (e ? i : "") + t.toLowerCase()
            })
        }
        var e = {
                placement: "top",
                animation: !0,
                popupDelay: 0
            },
            i = {
                mouseenter: "mouseleave",
                click: "click",
                focus: "blur"
            },
            n = {};
        this.options = function(t) {
            angular.extend(n, t)
        }, this.setTriggers = function(t) {
            angular.extend(i, t)
        }, this.$get = ["$window", "$compile", "$timeout", "$parse", "$document", "$position", "$interpolate", function(r, o, a, s, l, c, h) {
            return function(r, u, f) {
                function d(t) {
                    var e = t || p.trigger || f,
                        n = i[e] || e;
                    return {
                        show: e,
                        hide: n
                    }
                }
                var p = angular.extend({}, e, n),
                    g = t(r),
                    v = h.startSymbol(),
                    m = h.endSymbol(),
                    b = "<div " + g + '-popup title="' + v + "tt_title" + m + '" content="' + v + "tt_content" + m + '" placement="' + v + "tt_placement" + m + '" animation="tt_animation" is-open="tt_isOpen"></div>';
                return {
                    restrict: "EA",
                    scope: !0,
                    compile: function() {
                        var t = o(b);
                        return function(e, i, n) {
                            function o() {
                                e.tt_isOpen ? f() : h()
                            }

                            function h() {
                                (!S || e.$eval(n[u + "Enable"])) && (e.tt_popupDelay ? w || (w = a(g, e.tt_popupDelay, !1), w.then(function(t) {
                                    t()
                                })) : g()())
                            }

                            function f() {
                                e.$apply(function() {
                                    v()
                                })
                            }

                            function g() {
                                return w = null, x && (a.cancel(x), x = null), e.tt_content ? (m(), y.css({
                                    top: 0,
                                    left: 0,
                                    display: "block"
                                }), _ ? l.find("body").append(y) : i.after(y), A(), e.tt_isOpen = !0, e.$digest(), A) : angular.noop
                            }

                            function v() {
                                e.tt_isOpen = !1, a.cancel(w), w = null, e.tt_animation ? x || (x = a(b, 500)) : b()
                            }

                            function m() {
                                y && b(), y = t(e, function() {}), e.$digest()
                            }

                            function b() {
                                x = null, y && (y.remove(), y = null)
                            }
                            var y, x, w, _ = angular.isDefined(p.appendToBody) ? p.appendToBody : !1,
                                C = d(void 0),
                                S = angular.isDefined(n[u + "Enable"]),
                                A = function() {
                                    var t = c.positionElements(i, y, e.tt_placement, _);
                                    t.top += "px", t.left += "px", y.css(t)
                                };
                            e.tt_isOpen = !1, n.$observe(r, function(t) {
                                e.tt_content = t, !t && e.tt_isOpen && v()
                            }), n.$observe(u + "Title", function(t) {
                                e.tt_title = t
                            }), n.$observe(u + "Placement", function(t) {
                                e.tt_placement = angular.isDefined(t) ? t : p.placement
                            }), n.$observe(u + "PopupDelay", function(t) {
                                var i = parseInt(t, 10);
                                e.tt_popupDelay = isNaN(i) ? p.popupDelay : i
                            });
                            var k = function() {
                                i.unbind(C.show, h), i.unbind(C.hide, f)
                            };
                            n.$observe(u + "Trigger", function(t) {
                                k(), C = d(t), C.show === C.hide ? i.bind(C.show, o) : (i.bind(C.show, h), i.bind(C.hide, f))
                            });
                            var T = e.$eval(n[u + "Animation"]);
                            e.tt_animation = angular.isDefined(T) ? !!T : p.animation, n.$observe(u + "AppendToBody", function(t) {
                                _ = angular.isDefined(t) ? s(t)(e) : _
                            }), _ && e.$on("$locationChangeSuccess", function() {
                                e.tt_isOpen && v()
                            }), e.$on("$destroy", function() {
                                a.cancel(x), a.cancel(w), k(), b()
                            })
                        }
                    }
                }
            }
        }]
    }).directive("tooltipPopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/tooltip/tooltip-popup.html"
        }
    }).directive("tooltip", ["$tooltip", function(t) {
        return t("tooltip", "tooltip", "mouseenter")
    }]).directive("tooltipHtmlUnsafePopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/tooltip/tooltip-html-unsafe-popup.html"
        }
    }).directive("tooltipHtmlUnsafe", ["$tooltip", function(t) {
        return t("tooltipHtmlUnsafe", "tooltip", "mouseenter")
    }]), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("popoverPopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                title: "@",
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/popover/popover.html"
        }
    }).directive("popover", ["$tooltip", function(t) {
        return t("popover", "popover", "click")
    }]), angular.module("ui.bootstrap.progressbar", []).constant("progressConfig", {
        animate: !0,
        max: 100
    }).controller("ProgressController", ["$scope", "$attrs", "progressConfig", function(t, e, i) {
        var n = this,
            r = angular.isDefined(e.animate) ? t.$parent.$eval(e.animate) : i.animate;
        this.bars = [], t.max = angular.isDefined(e.max) ? t.$parent.$eval(e.max) : i.max, this.addBar = function(e, i) {
            r || i.css({
                transition: "none"
            }), this.bars.push(e), e.$watch("value", function(i) {
                e.percent = +(100 * i / t.max).toFixed(2)
            }), e.$on("$destroy", function() {
                i = null, n.removeBar(e)
            })
        }, this.removeBar = function(t) {
            this.bars.splice(this.bars.indexOf(t), 1)
        }
    }]).directive("progress", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            controller: "ProgressController",
            require: "progress",
            scope: {},
            templateUrl: "template/progressbar/progress.html"
        }
    }).directive("bar", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            require: "^progress",
            scope: {
                value: "=",
                type: "@"
            },
            templateUrl: "template/progressbar/bar.html",
            link: function(t, e, i, n) {
                n.addBar(t, e)
            }
        }
    }).directive("progressbar", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            controller: "ProgressController",
            scope: {
                value: "=",
                type: "@"
            },
            templateUrl: "template/progressbar/progressbar.html",
            link: function(t, e, i, n) {
                n.addBar(t, angular.element(e.children()[0]))
            }
        }
    }), angular.module("ui.bootstrap.rating", []).constant("ratingConfig", {
        max: 5,
        stateOn: null,
        stateOff: null
    }).controller("RatingController", ["$scope", "$attrs", "ratingConfig", function(t, e, i) {
        var n = {
            $setViewValue: angular.noop
        };
        this.init = function(r) {
            n = r, n.$render = this.render, this.stateOn = angular.isDefined(e.stateOn) ? t.$parent.$eval(e.stateOn) : i.stateOn, this.stateOff = angular.isDefined(e.stateOff) ? t.$parent.$eval(e.stateOff) : i.stateOff;
            var o = angular.isDefined(e.ratingStates) ? t.$parent.$eval(e.ratingStates) : new Array(angular.isDefined(e.max) ? t.$parent.$eval(e.max) : i.max);
            t.range = this.buildTemplateObjects(o)
        }, this.buildTemplateObjects = function(t) {
            for (var e = 0, i = t.length; i > e; e++) t[e] = angular.extend({
                index: e
            }, {
                stateOn: this.stateOn,
                stateOff: this.stateOff
            }, t[e]);
            return t
        }, t.rate = function(e) {
            !t.readonly && e >= 0 && e <= t.range.length && (n.$setViewValue(e), n.$render())
        }, t.enter = function(e) {
            t.readonly || (t.value = e), t.onHover({
                value: e
            })
        }, t.reset = function() {
            t.value = n.$viewValue, t.onLeave()
        }, t.onKeydown = function(e) {
            /(37|38|39|40)/.test(e.which) && (e.preventDefault(), e.stopPropagation(), t.rate(t.value + (38 === e.which || 39 === e.which ? 1 : -1)))
        }, this.render = function() {
            t.value = n.$viewValue
        }
    }]).directive("rating", function() {
        return {
            restrict: "EA",
            require: ["rating", "ngModel"],
            scope: {
                readonly: "=?",
                onHover: "&",
                onLeave: "&"
            },
            controller: "RatingController",
            templateUrl: "template/rating/rating.html",
            replace: !0,
            link: function(t, e, i, n) {
                var r = n[0],
                    o = n[1];
                o && r.init(o)
            }
        }
    }), angular.module("ui.bootstrap.tabs", []).controller("TabsetController", ["$scope", function(t) {
        var e = this,
            i = e.tabs = t.tabs = [];
        e.select = function(t) {
            angular.forEach(i, function(e) {
                e.active && e !== t && (e.active = !1, e.onDeselect())
            }), t.active = !0, t.onSelect()
        }, e.addTab = function(t) {
            i.push(t), 1 === i.length ? t.active = !0 : t.active && e.select(t)
        }, e.removeTab = function(t) {
            var n = i.indexOf(t);
            if (t.active && i.length > 1) {
                var r = n == i.length - 1 ? n - 1 : n + 1;
                e.select(i[r])
            }
            i.splice(n, 1)
        }
    }]).directive("tabset", function() {
        return {
            restrict: "EA",
            transclude: !0,
            replace: !0,
            scope: {
                type: "@"
            },
            controller: "TabsetController",
            templateUrl: "template/tabs/tabset.html",
            link: function(t, e, i) {
                t.vertical = angular.isDefined(i.vertical) ? t.$parent.$eval(i.vertical) : !1, t.justified = angular.isDefined(i.justified) ? t.$parent.$eval(i.justified) : !1
            }
        }
    }).directive("tab", ["$parse", function(t) {
        return {
            require: "^tabset",
            restrict: "EA",
            replace: !0,
            templateUrl: "template/tabs/tab.html",
            transclude: !0,
            scope: {
                active: "=?",
                heading: "@",
                onSelect: "&select",
                onDeselect: "&deselect"
            },
            controller: function() {},
            compile: function(e, i, n) {
                return function(e, i, r, o) {
                    e.$watch("active", function(t) {
                        t && o.select(e)
                    }), e.disabled = !1, r.disabled && e.$parent.$watch(t(r.disabled), function(t) {
                        e.disabled = !!t
                    }), e.select = function() {
                        e.disabled || (e.active = !0)
                    }, o.addTab(e), e.$on("$destroy", function() {
                        o.removeTab(e)
                    }), e.$transcludeFn = n
                }
            }
        }
    }]).directive("tabHeadingTransclude", [function() {
        return {
            restrict: "A",
            require: "^tab",
            link: function(t, e) {
                t.$watch("headingElement", function(t) {
                    t && (e.html(""), e.append(t))
                })
            }
        }
    }]).directive("tabContentTransclude", function() {
        function t(t) {
            return t.tagName && (t.hasAttribute("tab-heading") || t.hasAttribute("data-tab-heading") || "tab-heading" === t.tagName.toLowerCase() || "data-tab-heading" === t.tagName.toLowerCase())
        }
        return {
            restrict: "A",
            require: "^tabset",
            link: function(e, i, n) {
                var r = e.$eval(n.tabContentTransclude);
                r.$transcludeFn(r.$parent, function(e) {
                    angular.forEach(e, function(e) {
                        t(e) ? r.headingElement = e : i.append(e)
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.timepicker", []).constant("timepickerConfig", {
        hourStep: 1,
        minuteStep: 1,
        showMeridian: !0,
        meridians: null,
        readonlyInput: !1,
        mousewheel: !0
    }).controller("TimepickerController", ["$scope", "$attrs", "$parse", "$log", "$locale", "timepickerConfig", function(t, e, i, n, r, o) {
        function a() {
            var e = parseInt(t.hours, 10),
                i = t.showMeridian ? e > 0 && 13 > e : e >= 0 && 24 > e;
            return i ? (t.showMeridian && (12 === e && (e = 0), t.meridian === g[1] && (e += 12)), e) : void 0
        }

        function s() {
            var e = parseInt(t.minutes, 10);
            return e >= 0 && 60 > e ? e : void 0
        }

        function l(t) {
            return angular.isDefined(t) && t.toString().length < 2 ? "0" + t : t
        }

        function c(t) {
            h(), p.$setViewValue(new Date(d)), u(t)
        }

        function h() {
            p.$setValidity("time", !0), t.invalidHours = !1, t.invalidMinutes = !1
        }

        function u(e) {
            var i = d.getHours(),
                n = d.getMinutes();
            t.showMeridian && (i = 0 === i || 12 === i ? 12 : i % 12), t.hours = "h" === e ? i : l(i), t.minutes = "m" === e ? n : l(n), t.meridian = d.getHours() < 12 ? g[0] : g[1]
        }

        function f(t) {
            var e = new Date(d.getTime() + 6e4 * t);
            d.setHours(e.getHours(), e.getMinutes()), c()
        }
        var d = new Date,
            p = {
                $setViewValue: angular.noop
            },
            g = angular.isDefined(e.meridians) ? t.$parent.$eval(e.meridians) : o.meridians || r.DATETIME_FORMATS.AMPMS;
        this.init = function(i, n) {
            p = i, p.$render = this.render;
            var r = n.eq(0),
                a = n.eq(1),
                s = angular.isDefined(e.mousewheel) ? t.$parent.$eval(e.mousewheel) : o.mousewheel;
            s && this.setupMousewheelEvents(r, a), t.readonlyInput = angular.isDefined(e.readonlyInput) ? t.$parent.$eval(e.readonlyInput) : o.readonlyInput, this.setupInputEvents(r, a)
        };
        var v = o.hourStep;
        e.hourStep && t.$parent.$watch(i(e.hourStep), function(t) {
            v = parseInt(t, 10)
        });
        var m = o.minuteStep;
        e.minuteStep && t.$parent.$watch(i(e.minuteStep), function(t) {
            m = parseInt(t, 10)
        }), t.showMeridian = o.showMeridian, e.showMeridian && t.$parent.$watch(i(e.showMeridian), function(e) {
            if (t.showMeridian = !!e, p.$error.time) {
                var i = a(),
                    n = s();
                angular.isDefined(i) && angular.isDefined(n) && (d.setHours(i), c())
            } else u()
        }), this.setupMousewheelEvents = function(e, i) {
            var n = function(t) {
                t.originalEvent && (t = t.originalEvent);
                var e = t.wheelDelta ? t.wheelDelta : -t.deltaY;
                return t.detail || e > 0
            };
            e.bind("mousewheel wheel", function(e) {
                t.$apply(n(e) ? t.incrementHours() : t.decrementHours()), e.preventDefault()
            }), i.bind("mousewheel wheel", function(e) {
                t.$apply(n(e) ? t.incrementMinutes() : t.decrementMinutes()), e.preventDefault()
            })
        }, this.setupInputEvents = function(e, i) {
            if (t.readonlyInput) return t.updateHours = angular.noop, void(t.updateMinutes = angular.noop);
            var n = function(e, i) {
                p.$setViewValue(null), p.$setValidity("time", !1), angular.isDefined(e) && (t.invalidHours = e), angular.isDefined(i) && (t.invalidMinutes = i)
            };
            t.updateHours = function() {
                var t = a();
                angular.isDefined(t) ? (d.setHours(t), c("h")) : n(!0)
            }, e.bind("blur", function() {
                !t.invalidHours && t.hours < 10 && t.$apply(function() {
                    t.hours = l(t.hours)
                })
            }), t.updateMinutes = function() {
                var t = s();
                angular.isDefined(t) ? (d.setMinutes(t), c("m")) : n(void 0, !0)
            }, i.bind("blur", function() {
                !t.invalidMinutes && t.minutes < 10 && t.$apply(function() {
                    t.minutes = l(t.minutes)
                })
            })
        }, this.render = function() {
            var t = p.$modelValue ? new Date(p.$modelValue) : null;
            isNaN(t) ? (p.$setValidity("time", !1), n.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (t && (d = t), h(), u())
        }, t.incrementHours = function() {
            f(60 * v)
        }, t.decrementHours = function() {
            f(60 * -v)
        }, t.incrementMinutes = function() {
            f(m)
        }, t.decrementMinutes = function() {
            f(-m)
        }, t.toggleMeridian = function() {
            f(720 * (d.getHours() < 12 ? 1 : -1))
        }
    }]).directive("timepicker", function() {
        return {
            restrict: "EA",
            require: ["timepicker", "?^ngModel"],
            controller: "TimepickerController",
            replace: !0,
            scope: {},
            templateUrl: "template/timepicker/timepicker.html",
            link: function(t, e, i, n) {
                var r = n[0],
                    o = n[1];
                o && r.init(o, e.find("input"))
            }
        }
    }), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).factory("typeaheadParser", ["$parse", function(t) {
        var e = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
        return {
            parse: function(i) {
                var n = i.match(e);
                if (!n) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + i + '".');
                return {
                    itemName: n[3],
                    source: t(n[4]),
                    viewMapper: t(n[2] || n[1]),
                    modelMapper: t(n[1])
                }
            }
        }
    }]).directive("typeahead", ["$compile", "$parse", "$q", "$timeout", "$document", "$position", "typeaheadParser", function(t, e, i, n, r, o, a) {
        var s = [9, 13, 27, 38, 40];
        return {
            require: "ngModel",
            link: function(l, c, h, u) {
                var f, d = l.$eval(h.typeaheadMinLength) || 1,
                    p = l.$eval(h.typeaheadWaitMs) || 0,
                    g = l.$eval(h.typeaheadEditable) !== !1,
                    v = e(h.typeaheadLoading).assign || angular.noop,
                    m = e(h.typeaheadOnSelect),
                    b = h.typeaheadInputFormatter ? e(h.typeaheadInputFormatter) : void 0,
                    y = h.typeaheadAppendToBody ? l.$eval(h.typeaheadAppendToBody) : !1,
                    x = e(h.ngModel).assign,
                    w = a.parse(h.typeahead),
                    _ = l.$new();
                l.$on("$destroy", function() {
                    _.$destroy()
                });
                var C = "typeahead-" + _.$id + "-" + Math.floor(1e4 * Math.random());
                c.attr({
                    "aria-autocomplete": "list",
                    "aria-expanded": !1,
                    "aria-owns": C
                });
                var S = angular.element("<div typeahead-popup></div>");
                S.attr({
                    id: C,
                    matches: "matches",
                    active: "activeIdx",
                    select: "select(activeIdx)",
                    query: "query",
                    position: "position"
                }), angular.isDefined(h.typeaheadTemplateUrl) && S.attr("template-url", h.typeaheadTemplateUrl);
                var A = function() {
                        _.matches = [], _.activeIdx = -1, c.attr("aria-expanded", !1)
                    },
                    k = function(t) {
                        return C + "-option-" + t
                    };
                _.$watch("activeIdx", function(t) {
                    0 > t ? c.removeAttr("aria-activedescendant") : c.attr("aria-activedescendant", k(t))
                });
                var T = function(t) {
                    var e = {
                        $viewValue: t
                    };
                    v(l, !0), i.when(w.source(l, e)).then(function(i) {
                        var n = t === u.$viewValue;
                        if (n && f)
                            if (i.length > 0) {
                                _.activeIdx = 0, _.matches.length = 0;
                                for (var r = 0; r < i.length; r++) e[w.itemName] = i[r], _.matches.push({
                                    id: k(r),
                                    label: w.viewMapper(_, e),
                                    model: i[r]
                                });
                                _.query = t, _.position = y ? o.offset(c) : o.position(c), _.position.top = _.position.top + c.prop("offsetHeight"), c.attr("aria-expanded", !0)
                            } else A();
                        n && v(l, !1)
                    }, function() {
                        A(), v(l, !1)
                    })
                };
                A(), _.query = void 0;
                var O, $ = function(t) {
                        O = n(function() {
                            T(t)
                        }, p)
                    },
                    D = function() {
                        O && n.cancel(O)
                    };
                u.$parsers.unshift(function(t) {
                    return f = !0, t && t.length >= d ? p > 0 ? (D(), $(t)) : T(t) : (v(l, !1), D(), A()), g ? t : t ? void u.$setValidity("editable", !1) : (u.$setValidity("editable", !0), t)
                }), u.$formatters.push(function(t) {
                    var e, i, n = {};
                    return b ? (n.$model = t, b(l, n)) : (n[w.itemName] = t, e = w.viewMapper(l, n), n[w.itemName] = void 0, i = w.viewMapper(l, n), e !== i ? e : t)
                }), _.select = function(t) {
                    var e, i, r = {};
                    r[w.itemName] = i = _.matches[t].model, e = w.modelMapper(l, r), x(l, e), u.$setValidity("editable", !0), m(l, {
                        $item: i,
                        $model: e,
                        $label: w.viewMapper(l, r)
                    }), A(), n(function() {
                        c[0].focus()
                    }, 0, !1)
                }, c.bind("keydown", function(t) {
                    0 !== _.matches.length && -1 !== s.indexOf(t.which) && (t.preventDefault(), 40 === t.which ? (_.activeIdx = (_.activeIdx + 1) % _.matches.length, _.$digest()) : 38 === t.which ? (_.activeIdx = (_.activeIdx ? _.activeIdx : _.matches.length) - 1, _.$digest()) : 13 === t.which || 9 === t.which ? _.$apply(function() {
                        _.select(_.activeIdx)
                    }) : 27 === t.which && (t.stopPropagation(), A(), _.$digest()))
                }), c.bind("blur", function() {
                    f = !1
                });
                var M = function(t) {
                    c[0] !== t.target && (A(), _.$digest())
                };
                r.bind("click", M), l.$on("$destroy", function() {
                    r.unbind("click", M)
                });
                var E = t(S)(_);
                y ? r.find("body").append(E) : c.after(E)
            }
        }
    }]).directive("typeaheadPopup", function() {
        return {
            restrict: "EA",
            scope: {
                matches: "=",
                query: "=",
                active: "=",
                position: "=",
                select: "&"
            },
            replace: !0,
            templateUrl: "template/typeahead/typeahead-popup.html",
            link: function(t, e, i) {
                t.templateUrl = i.templateUrl, t.isOpen = function() {
                    return t.matches.length > 0
                }, t.isActive = function(e) {
                    return t.active == e
                }, t.selectActive = function(e) {
                    t.active = e
                }, t.selectMatch = function(e) {
                    t.select({
                        activeIdx: e
                    })
                }
            }
        }
    }).directive("typeaheadMatch", ["$http", "$templateCache", "$compile", "$parse", function(t, e, i, n) {
        return {
            restrict: "EA",
            scope: {
                index: "=",
                match: "=",
                query: "="
            },
            link: function(r, o, a) {
                var s = n(a.templateUrl)(r.$parent) || "template/typeahead/typeahead-match.html";
                t.get(s, {
                    cache: e
                }).success(function(t) {
                    o.replaceWith(i(t.trim())(r))
                })
            }
        }
    }]).filter("typeaheadHighlight", function() {
        function t(t) {
            return t.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
        }
        return function(e, i) {
            return i ? ("" + e).replace(new RegExp(t(i), "gi"), "<strong>$&</strong>") : e
        }
    }), angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition", "ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.bindHtml", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.dropdown", "ui.bootstrap.modal", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html", "template/accordion/accordion.html", "template/alert/alert.html", "template/carousel/carousel.html", "template/carousel/slide.html", "template/datepicker/datepicker.html", "template/datepicker/day.html", "template/datepicker/month.html", "template/datepicker/popup.html", "template/datepicker/year.html", "template/modal/backdrop.html", "template/modal/window.html", "template/pagination/pager.html", "template/pagination/pagination.html", "template/tooltip/tooltip-html-unsafe-popup.html", "template/tooltip/tooltip-popup.html", "template/popover/popover.html", "template/progressbar/bar.html", "template/progressbar/progress.html", "template/progressbar/progressbar.html", "template/rating/rating.html", "template/tabs/tab.html", "template/tabs/tabset.html", "template/timepicker/timepicker.html", "template/typeahead/typeahead-match.html", "template/typeahead/typeahead-popup.html"]), angular.module("ui.bootstrap.transition", []).factory("$transition", ["$q", "$timeout", "$rootScope", function(t, e, i) {
        function n(t) {
            for (var e in t)
                if (void 0 !== o.style[e]) return t[e]
        }
        var r = function(n, o, a) {
                a = a || {};
                var s = t.defer(),
                    l = r[a.animation ? "animationEndEventName" : "transitionEndEventName"],
                    c = function() {
                        i.$apply(function() {
                            n.unbind(l, c), s.resolve(n)
                        })
                    };
                return l && n.bind(l, c), e(function() {
                    angular.isString(o) ? n.addClass(o) : angular.isFunction(o) ? o(n) : angular.isObject(o) && n.css(o), l || s.resolve(n)
                }), s.promise.cancel = function() {
                    l && n.unbind(l, c), s.reject("Transition cancelled")
                }, s.promise
            },
            o = document.createElement("trans"),
            a = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                transition: "transitionend"
            },
            s = {
                WebkitTransition: "webkitAnimationEnd",
                MozTransition: "animationend",
                OTransition: "oAnimationEnd",
                transition: "animationend"
            };
        return r.transitionEndEventName = n(a), r.animationEndEventName = n(s), r
    }]), angular.module("ui.bootstrap.collapse", ["ui.bootstrap.transition"]).directive("collapse", ["$transition", function(t) {
        return {
            link: function(e, i, n) {
                function r(e) {
                    function n() {
                        c === r && (c = void 0)
                    }
                    var r = t(i, e);
                    return c && c.cancel(), c = r, r.then(n, n), r
                }

                function o() {
                    h ? (h = !1, a()) : (i.removeClass("collapse").addClass("collapsing"), r({
                        height: i[0].scrollHeight + "px"
                    }).then(a))
                }

                function a() {
                    i.removeClass("collapsing"), i.addClass("collapse in"), i.css({
                        height: "auto"
                    })
                }

                function s() {
                    if (h) h = !1, l(), i.css({
                        height: 0
                    });
                    else {
                        i.css({
                            height: i[0].scrollHeight + "px"
                        }); {
                            i[0].offsetWidth
                        }
                        i.removeClass("collapse in").addClass("collapsing"), r({
                            height: 0
                        }).then(l)
                    }
                }

                function l() {
                    i.removeClass("collapsing"), i.addClass("collapse")
                }
                var c, h = !0;
                e.$watch(n.collapse, function(t) {
                    t ? s() : o()
                })
            }
        }
    }]), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse"]).constant("accordionConfig", {
        closeOthers: !0
    }).controller("AccordionController", ["$scope", "$attrs", "accordionConfig", function(t, e, i) {
        this.groups = [], this.closeOthers = function(n) {
            var r = angular.isDefined(e.closeOthers) ? t.$eval(e.closeOthers) : i.closeOthers;
            r && angular.forEach(this.groups, function(t) {
                t !== n && (t.isOpen = !1)
            })
        }, this.addGroup = function(t) {
            var e = this;
            this.groups.push(t), t.$on("$destroy", function() {
                e.removeGroup(t)
            })
        }, this.removeGroup = function(t) {
            var e = this.groups.indexOf(t); - 1 !== e && this.groups.splice(e, 1)
        }
    }]).directive("accordion", function() {
        return {
            restrict: "EA",
            controller: "AccordionController",
            transclude: !0,
            replace: !1,
            templateUrl: "template/accordion/accordion.html"
        }
    }).directive("accordionGroup", function() {
        return {
            require: "^accordion",
            restrict: "EA",
            transclude: !0,
            replace: !0,
            templateUrl: "template/accordion/accordion-group.html",
            scope: {
                heading: "@",
                isOpen: "=?",
                isDisabled: "=?"
            },
            controller: function() {
                this.setHeading = function(t) {
                    this.heading = t
                }
            },
            link: function(t, e, i, n) {
                n.addGroup(t), t.$watch("isOpen", function(e) {
                    e && n.closeOthers(t)
                }), t.toggleOpen = function() {
                    t.isDisabled || (t.isOpen = !t.isOpen)
                }
            }
        }
    }).directive("accordionHeading", function() {
        return {
            restrict: "EA",
            transclude: !0,
            template: "",
            replace: !0,
            require: "^accordionGroup",
            link: function(t, e, i, n, r) {
                n.setHeading(r(t, function() {}))
            }
        }
    }).directive("accordionTransclude", function() {
        return {
            require: "^accordionGroup",
            link: function(t, e, i, n) {
                t.$watch(function() {
                    return n[i.accordionTransclude]
                }, function(t) {
                    t && (e.html(""), e.append(t))
                })
            }
        }
    }), angular.module("ui.bootstrap.alert", []).controller("AlertController", ["$scope", "$attrs", function(t, e) {
        t.closeable = "close" in e
    }]).directive("alert", function() {
        return {
            restrict: "EA",
            controller: "AlertController",
            templateUrl: "template/alert/alert.html",
            transclude: !0,
            replace: !0,
            scope: {
                type: "@",
                close: "&"
            }
        }
    }), angular.module("ui.bootstrap.bindHtml", []).directive("bindHtmlUnsafe", function() {
        return function(t, e, i) {
            e.addClass("ng-binding").data("$binding", i.bindHtmlUnsafe), t.$watch(i.bindHtmlUnsafe, function(t) {
                e.html(t || "")
            })
        }
    }), angular.module("ui.bootstrap.buttons", []).constant("buttonConfig", {
        activeClass: "active",
        toggleEvent: "click"
    }).controller("ButtonsController", ["buttonConfig", function(t) {
        this.activeClass = t.activeClass || "active", this.toggleEvent = t.toggleEvent || "click"
    }]).directive("btnRadio", function() {
        return {
            require: ["btnRadio", "ngModel"],
            controller: "ButtonsController",
            link: function(t, e, i, n) {
                var r = n[0],
                    o = n[1];
                o.$render = function() {
                    e.toggleClass(r.activeClass, angular.equals(o.$modelValue, t.$eval(i.btnRadio)))
                }, e.bind(r.toggleEvent, function() {
                    var n = e.hasClass(r.activeClass);
                    (!n || angular.isDefined(i.uncheckable)) && t.$apply(function() {
                        o.$setViewValue(n ? null : t.$eval(i.btnRadio)), o.$render()
                    })
                })
            }
        }
    }).directive("btnCheckbox", function() {
        return {
            require: ["btnCheckbox", "ngModel"],
            controller: "ButtonsController",
            link: function(t, e, i, n) {
                function r() {
                    return a(i.btnCheckboxTrue, !0)
                }

                function o() {
                    return a(i.btnCheckboxFalse, !1)
                }

                function a(e, i) {
                    var n = t.$eval(e);
                    return angular.isDefined(n) ? n : i
                }
                var s = n[0],
                    l = n[1];
                l.$render = function() {
                    e.toggleClass(s.activeClass, angular.equals(l.$modelValue, r()))
                }, e.bind(s.toggleEvent, function() {
                    t.$apply(function() {
                        l.$setViewValue(e.hasClass(s.activeClass) ? o() : r()), l.$render()
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.carousel", ["ui.bootstrap.transition"]).controller("CarouselController", ["$scope", "$timeout", "$transition", function(t, e, i) {
        function n() {
            r();
            var i = +t.interval;
            !isNaN(i) && i >= 0 && (a = e(o, i))
        }

        function r() {
            a && (e.cancel(a), a = null)
        }

        function o() {
            s ? (t.next(), n()) : t.pause()
        }
        var a, s, l = this,
            c = l.slides = t.slides = [],
            h = -1;
        l.currentSlide = null;
        var u = !1;
        l.select = t.select = function(r, o) {
            function a() {
                if (!u) {
                    if (l.currentSlide && angular.isString(o) && !t.noTransition && r.$element) {
                        r.$element.addClass(o); {
                            r.$element[0].offsetWidth
                        }
                        angular.forEach(c, function(t) {
                                angular.extend(t, {
                                    direction: "",
                                    entering: !1,
                                    leaving: !1,
                                    active: !1
                                })
                            }), angular.extend(r, {
                                direction: o,
                                active: !0,
                                entering: !0
                            }), angular.extend(l.currentSlide || {}, {
                                direction: o,
                                leaving: !0
                            }), t.$currentTransition = i(r.$element, {}),
                            function(e, i) {
                                t.$currentTransition.then(function() {
                                    s(e, i)
                                }, function() {
                                    s(e, i)
                                })
                            }(r, l.currentSlide)
                    } else s(r, l.currentSlide);
                    l.currentSlide = r, h = f, n()
                }
            }

            function s(e, i) {
                angular.extend(e, {
                    direction: "",
                    active: !0,
                    leaving: !1,
                    entering: !1
                }), angular.extend(i || {}, {
                    direction: "",
                    active: !1,
                    leaving: !1,
                    entering: !1
                }), t.$currentTransition = null
            }
            var f = c.indexOf(r);
            void 0 === o && (o = f > h ? "next" : "prev"), r && r !== l.currentSlide && (t.$currentTransition ? (t.$currentTransition.cancel(), e(a)) : a())
        }, t.$on("$destroy", function() {
            u = !0
        }), l.indexOfSlide = function(t) {
            return c.indexOf(t)
        }, t.next = function() {
            var e = (h + 1) % c.length;
            return t.$currentTransition ? void 0 : l.select(c[e], "next")
        }, t.prev = function() {
            var e = 0 > h - 1 ? c.length - 1 : h - 1;
            return t.$currentTransition ? void 0 : l.select(c[e], "prev")
        }, t.isActive = function(t) {
            return l.currentSlide === t
        }, t.$watch("interval", n), t.$on("$destroy", r), t.play = function() {
            s || (s = !0, n())
        }, t.pause = function() {
            t.noPause || (s = !1, r())
        }, l.addSlide = function(e, i) {
            e.$element = i, c.push(e), 1 === c.length || e.active ? (l.select(c[c.length - 1]), 1 == c.length && t.play()) : e.active = !1
        }, l.removeSlide = function(t) {
            var e = c.indexOf(t);
            c.splice(e, 1), c.length > 0 && t.active ? l.select(e >= c.length ? c[e - 1] : c[e]) : h > e && h--
        }
    }]).directive("carousel", [function() {
        return {
            restrict: "EA",
            transclude: !0,
            replace: !0,
            controller: "CarouselController",
            require: "carousel",
            templateUrl: "template/carousel/carousel.html",
            scope: {
                interval: "=",
                noTransition: "=",
                noPause: "="
            }
        }
    }]).directive("slide", function() {
        return {
            require: "^carousel",
            restrict: "EA",
            transclude: !0,
            replace: !0,
            templateUrl: "template/carousel/slide.html",
            scope: {
                active: "=?"
            },
            link: function(t, e, i, n) {
                n.addSlide(t, e), t.$on("$destroy", function() {
                    n.removeSlide(t)
                }), t.$watch("active", function(e) {
                    e && n.select(t)
                })
            }
        }
    }), angular.module("ui.bootstrap.dateparser", []).service("dateParser", ["$locale", "orderByFilter", function(t, e) {
        function i(t) {
            var i = [],
                n = t.split("");
            return angular.forEach(r, function(e, r) {
                var o = t.indexOf(r);
                if (o > -1) {
                    t = t.split(""), n[o] = "(" + e.regex + ")", t[o] = "$";
                    for (var a = o + 1, s = o + r.length; s > a; a++) n[a] = "", t[a] = "$";
                    t = t.join(""), i.push({
                        index: o,
                        apply: e.apply
                    })
                }
            }), {
                regex: new RegExp("^" + n.join("") + "$"),
                map: e(i, "index")
            }
        }

        function n(t, e, i) {
            return 1 === e && i > 28 ? 29 === i && (t % 4 === 0 && t % 100 !== 0 || t % 400 === 0) : 3 === e || 5 === e || 8 === e || 10 === e ? 31 > i : !0
        }
        this.parsers = {};
        var r = {
            yyyy: {
                regex: "\\d{4}",
                apply: function(t) {
                    this.year = +t
                }
            },
            yy: {
                regex: "\\d{2}",
                apply: function(t) {
                    this.year = +t + 2e3
                }
            },
            y: {
                regex: "\\d{1,4}",
                apply: function(t) {
                    this.year = +t
                }
            },
            MMMM: {
                regex: t.DATETIME_FORMATS.MONTH.join("|"),
                apply: function(e) {
                    this.month = t.DATETIME_FORMATS.MONTH.indexOf(e)
                }
            },
            MMM: {
                regex: t.DATETIME_FORMATS.SHORTMONTH.join("|"),
                apply: function(e) {
                    this.month = t.DATETIME_FORMATS.SHORTMONTH.indexOf(e)
                }
            },
            MM: {
                regex: "0[1-9]|1[0-2]",
                apply: function(t) {
                    this.month = t - 1
                }
            },
            M: {
                regex: "[1-9]|1[0-2]",
                apply: function(t) {
                    this.month = t - 1
                }
            },
            dd: {
                regex: "[0-2][0-9]{1}|3[0-1]{1}",
                apply: function(t) {
                    this.date = +t
                }
            },
            d: {
                regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(t) {
                    this.date = +t
                }
            },
            EEEE: {
                regex: t.DATETIME_FORMATS.DAY.join("|")
            },
            EEE: {
                regex: t.DATETIME_FORMATS.SHORTDAY.join("|")
            }
        };
        this.parse = function(e, r) {
            if (!angular.isString(e) || !r) return e;
            r = t.DATETIME_FORMATS[r] || r, this.parsers[r] || (this.parsers[r] = i(r));
            var o = this.parsers[r],
                a = o.regex,
                s = o.map,
                l = e.match(a);
            if (l && l.length) {
                for (var c, h = {
                        year: 1900,
                        month: 0,
                        date: 1,
                        hours: 0
                    }, u = 1, f = l.length; f > u; u++) {
                    var d = s[u - 1];
                    d.apply && d.apply.call(h, l[u])
                }
                return n(h.year, h.month, h.date) && (c = new Date(h.year, h.month, h.date, h.hours)), c
            }
        }
    }]), angular.module("ui.bootstrap.position", []).factory("$position", ["$document", "$window", function(t, e) {
        function i(t, i) {
            return t.currentStyle ? t.currentStyle[i] : e.getComputedStyle ? e.getComputedStyle(t)[i] : t.style[i]
        }

        function n(t) {
            return "static" === (i(t, "position") || "static")
        }
        var r = function(e) {
            for (var i = t[0], r = e.offsetParent || i; r && r !== i && n(r);) r = r.offsetParent;
            return r || i
        };
        return {
            position: function(e) {
                var i = this.offset(e),
                    n = {
                        top: 0,
                        left: 0
                    },
                    o = r(e[0]);
                o != t[0] && (n = this.offset(angular.element(o)), n.top += o.clientTop - o.scrollTop, n.left += o.clientLeft - o.scrollLeft);
                var a = e[0].getBoundingClientRect();
                return {
                    width: a.width || e.prop("offsetWidth"),
                    height: a.height || e.prop("offsetHeight"),
                    top: i.top - n.top,
                    left: i.left - n.left
                }
            },
            offset: function(i) {
                var n = i[0].getBoundingClientRect();
                return {
                    width: n.width || i.prop("offsetWidth"),
                    height: n.height || i.prop("offsetHeight"),
                    top: n.top + (e.pageYOffset || t[0].documentElement.scrollTop),
                    left: n.left + (e.pageXOffset || t[0].documentElement.scrollLeft)
                }
            },
            positionElements: function(t, e, i, n) {
                var r, o, a, s, l = i.split("-"),
                    c = l[0],
                    h = l[1] || "center";
                r = n ? this.offset(t) : this.position(t), o = e.prop("offsetWidth"), a = e.prop("offsetHeight");
                var u = {
                        center: function() {
                            return r.left + r.width / 2 - o / 2
                        },
                        left: function() {
                            return r.left
                        },
                        right: function() {
                            return r.left + r.width
                        }
                    },
                    f = {
                        center: function() {
                            return r.top + r.height / 2 - a / 2
                        },
                        top: function() {
                            return r.top
                        },
                        bottom: function() {
                            return r.top + r.height
                        }
                    };
                switch (c) {
                    case "right":
                        s = {
                            top: f[h](),
                            left: u[c]()
                        };
                        break;
                    case "left":
                        s = {
                            top: f[h](),
                            left: r.left - o
                        };
                        break;
                    case "bottom":
                        s = {
                            top: f[c](),
                            left: u[h]()
                        };
                        break;
                    default:
                        s = {
                            top: r.top - a,
                            left: u[h]()
                        }
                }
                return s
            }
        }
    }]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.position"]).constant("datepickerConfig", {
        formatDay: "dd",
        formatMonth: "MMMM",
        formatYear: "yyyy",
        formatDayHeader: "EEE",
        formatDayTitle: "MMMM yyyy",
        formatMonthTitle: "yyyy",
        datepickerMode: "day",
        minMode: "day",
        maxMode: "year",
        showWeeks: !0,
        startingDay: 0,
        yearRange: 20,
        minDate: null,
        maxDate: null
    }).controller("DatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$timeout", "$log", "dateFilter", "datepickerConfig", function(t, e, i, n, r, o, a, s) {
        var l = this,
            c = {
                $setViewValue: angular.noop
            };
        this.modes = ["day", "month", "year"], angular.forEach(["formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "minMode", "maxMode", "showWeeks", "startingDay", "yearRange"], function(i, r) {
            l[i] = angular.isDefined(e[i]) ? 8 > r ? n(e[i])(t.$parent) : t.$parent.$eval(e[i]) : s[i]
        }), angular.forEach(["minDate", "maxDate"], function(n) {
            e[n] ? t.$parent.$watch(i(e[n]), function(t) {
                l[n] = t ? new Date(t) : null, l.refreshView()
            }) : l[n] = s[n] ? new Date(s[n]) : null
        }), t.datepickerMode = t.datepickerMode || s.datepickerMode, t.uniqueId = "datepicker-" + t.$id + "-" + Math.floor(1e4 * Math.random()), this.activeDate = angular.isDefined(e.initDate) ? t.$parent.$eval(e.initDate) : new Date, t.isActive = function(e) {
            return 0 === l.compare(e.date, l.activeDate) ? (t.activeDateId = e.uid, !0) : !1
        }, this.init = function(t) {
            c = t, c.$render = function() {
                l.render()
            }
        }, this.render = function() {
            if (c.$modelValue) {
                var t = new Date(c.$modelValue),
                    e = !isNaN(t);
                e ? this.activeDate = t : o.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'), c.$setValidity("date", e)
            }
            this.refreshView()
        }, this.refreshView = function() {
            if (this.element) {
                this._refreshView();
                var t = c.$modelValue ? new Date(c.$modelValue) : null;
                c.$setValidity("date-disabled", !t || this.element && !this.isDisabled(t))
            }
        }, this.createDateObject = function(t, e) {
            var i = c.$modelValue ? new Date(c.$modelValue) : null;
            return {
                date: t,
                label: a(t, e),
                selected: i && 0 === this.compare(t, i),
                disabled: this.isDisabled(t),
                current: 0 === this.compare(t, new Date)
            }
        }, this.isDisabled = function(i) {
            return this.minDate && this.compare(i, this.minDate) < 0 || this.maxDate && this.compare(i, this.maxDate) > 0 || e.dateDisabled && t.dateDisabled({
                date: i,
                mode: t.datepickerMode
            })
        }, this.split = function(t, e) {
            for (var i = []; t.length > 0;) i.push(t.splice(0, e));
            return i
        }, t.select = function(e) {
            if (t.datepickerMode === l.minMode) {
                var i = c.$modelValue ? new Date(c.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
                i.setFullYear(e.getFullYear(), e.getMonth(), e.getDate()), c.$setViewValue(i), c.$render()
            } else l.activeDate = e, t.datepickerMode = l.modes[l.modes.indexOf(t.datepickerMode) - 1]
        }, t.move = function(t) {
            var e = l.activeDate.getFullYear() + t * (l.step.years || 0),
                i = l.activeDate.getMonth() + t * (l.step.months || 0);
            l.activeDate.setFullYear(e, i, 1), l.refreshView()
        }, t.toggleMode = function(e) {
            e = e || 1, t.datepickerMode === l.maxMode && 1 === e || t.datepickerMode === l.minMode && -1 === e || (t.datepickerMode = l.modes[l.modes.indexOf(t.datepickerMode) + e])
        }, t.keys = {
            13: "enter",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };
        var h = function() {
            r(function() {
                l.element[0].focus()
            }, 0, !1)
        };
        t.$on("datepicker.focus", h), t.keydown = function(e) {
            var i = t.keys[e.which];
            if (i && !e.shiftKey && !e.altKey)
                if (e.preventDefault(), e.stopPropagation(), "enter" === i || "space" === i) {
                    if (l.isDisabled(l.activeDate)) return;
                    t.select(l.activeDate), h()
                } else !e.ctrlKey || "up" !== i && "down" !== i ? (l.handleKeyDown(i, e), l.refreshView()) : (t.toggleMode("up" === i ? 1 : -1), h())
        }
    }]).directive("datepicker", function() {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/datepicker.html",
            scope: {
                datepickerMode: "=?",
                dateDisabled: "&"
            },
            require: ["datepicker", "?^ngModel"],
            controller: "DatepickerController",
            link: function(t, e, i, n) {
                var r = n[0],
                    o = n[1];
                o && r.init(o)
            }
        }
    }).directive("daypicker", ["dateFilter", function(t) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/day.html",
            require: "^datepicker",
            link: function(e, i, n, r) {
                function o(t, e) {
                    return 1 !== e || t % 4 !== 0 || t % 100 === 0 && t % 400 !== 0 ? l[e] : 29
                }

                function a(t, e) {
                    var i = new Array(e),
                        n = new Date(t),
                        r = 0;
                    for (n.setHours(12); e > r;) i[r++] = new Date(n), n.setDate(n.getDate() + 1);
                    return i
                }

                function s(t) {
                    var e = new Date(t);
                    e.setDate(e.getDate() + 4 - (e.getDay() || 7));
                    var i = e.getTime();
                    return e.setMonth(0), e.setDate(1), Math.floor(Math.round((i - e) / 864e5) / 7) + 1
                }
                e.showWeeks = r.showWeeks, r.step = {
                    months: 1
                }, r.element = i;
                var l = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                r._refreshView = function() {
                    var i = r.activeDate.getFullYear(),
                        n = r.activeDate.getMonth(),
                        o = new Date(i, n, 1),
                        l = r.startingDay - o.getDay(),
                        c = l > 0 ? 7 - l : -l,
                        h = new Date(o);
                    c > 0 && h.setDate(-c + 1);
                    for (var u = a(h, 42), f = 0; 42 > f; f++) u[f] = angular.extend(r.createDateObject(u[f], r.formatDay), {
                        secondary: u[f].getMonth() !== n,
                        uid: e.uniqueId + "-" + f
                    });
                    e.labels = new Array(7);
                    for (var d = 0; 7 > d; d++) e.labels[d] = {
                        abbr: t(u[d].date, r.formatDayHeader),
                        full: t(u[d].date, "EEEE")
                    };
                    if (e.title = t(r.activeDate, r.formatDayTitle), e.rows = r.split(u, 7), e.showWeeks) {
                        e.weekNumbers = [];
                        for (var p = s(e.rows[0][0].date), g = e.rows.length; e.weekNumbers.push(p++) < g;);
                    }
                }, r.compare = function(t, e) {
                    return new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(e.getFullYear(), e.getMonth(), e.getDate())
                }, r.handleKeyDown = function(t) {
                    var e = r.activeDate.getDate();
                    if ("left" === t) e -= 1;
                    else if ("up" === t) e -= 7;
                    else if ("right" === t) e += 1;
                    else if ("down" === t) e += 7;
                    else if ("pageup" === t || "pagedown" === t) {
                        var i = r.activeDate.getMonth() + ("pageup" === t ? -1 : 1);
                        r.activeDate.setMonth(i, 1), e = Math.min(o(r.activeDate.getFullYear(), r.activeDate.getMonth()), e)
                    } else "home" === t ? e = 1 : "end" === t && (e = o(r.activeDate.getFullYear(), r.activeDate.getMonth()));
                    r.activeDate.setDate(e)
                }, r.refreshView()
            }
        }
    }]).directive("monthpicker", ["dateFilter", function(t) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/month.html",
            require: "^datepicker",
            link: function(e, i, n, r) {
                r.step = {
                    years: 1
                }, r.element = i, r._refreshView = function() {
                    for (var i = new Array(12), n = r.activeDate.getFullYear(), o = 0; 12 > o; o++) i[o] = angular.extend(r.createDateObject(new Date(n, o, 1), r.formatMonth), {
                        uid: e.uniqueId + "-" + o
                    });
                    e.title = t(r.activeDate, r.formatMonthTitle), e.rows = r.split(i, 3)
                }, r.compare = function(t, e) {
                    return new Date(t.getFullYear(), t.getMonth()) - new Date(e.getFullYear(), e.getMonth())
                }, r.handleKeyDown = function(t) {
                    var e = r.activeDate.getMonth();
                    if ("left" === t) e -= 1;
                    else if ("up" === t) e -= 3;
                    else if ("right" === t) e += 1;
                    else if ("down" === t) e += 3;
                    else if ("pageup" === t || "pagedown" === t) {
                        var i = r.activeDate.getFullYear() + ("pageup" === t ? -1 : 1);
                        r.activeDate.setFullYear(i)
                    } else "home" === t ? e = 0 : "end" === t && (e = 11);
                    r.activeDate.setMonth(e)
                }, r.refreshView()
            }
        }
    }]).directive("yearpicker", ["dateFilter", function() {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/year.html",
            require: "^datepicker",
            link: function(t, e, i, n) {
                function r(t) {
                    return parseInt((t - 1) / o, 10) * o + 1
                }
                var o = n.yearRange;
                n.step = {
                    years: o
                }, n.element = e, n._refreshView = function() {
                    for (var e = new Array(o), i = 0, a = r(n.activeDate.getFullYear()); o > i; i++) e[i] = angular.extend(n.createDateObject(new Date(a + i, 0, 1), n.formatYear), {
                        uid: t.uniqueId + "-" + i
                    });
                    t.title = [e[0].label, e[o - 1].label].join(" - "), t.rows = n.split(e, 5)
                }, n.compare = function(t, e) {
                    return t.getFullYear() - e.getFullYear()
                }, n.handleKeyDown = function(t) {
                    var e = n.activeDate.getFullYear();
                    "left" === t ? e -= 1 : "up" === t ? e -= 5 : "right" === t ? e += 1 : "down" === t ? e += 5 : "pageup" === t || "pagedown" === t ? e += ("pageup" === t ? -1 : 1) * n.step.years : "home" === t ? e = r(n.activeDate.getFullYear()) : "end" === t && (e = r(n.activeDate.getFullYear()) + o - 1), n.activeDate.setFullYear(e)
                }, n.refreshView()
            }
        }
    }]).constant("datepickerPopupConfig", {
        datepickerPopup: "yyyy-MM-dd",
        currentText: "Today",
        clearText: "Clear",
        closeText: "Done",
        closeOnDateSelection: !0,
        appendToBody: !1,
        showButtonBar: !0
    }).directive("datepickerPopup", ["$compile", "$parse", "$document", "$position", "dateFilter", "dateParser", "datepickerPopupConfig", function(t, e, i, n, r, o, a) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                isOpen: "=?",
                currentText: "@",
                clearText: "@",
                closeText: "@",
                dateDisabled: "&"
            },
            link: function(s, l, c, h) {
                function u(t) {
                    return t.replace(/([A-Z])/g, function(t) {
                        return "-" + t.toLowerCase()
                    })
                }

                function f(t) {
                    if (t) {
                        if (angular.isDate(t) && !isNaN(t)) return h.$setValidity("date", !0), t;
                        if (angular.isString(t)) {
                            var e = o.parse(t, d) || new Date(t);
                            return isNaN(e) ? void h.$setValidity("date", !1) : (h.$setValidity("date", !0), e)
                        }
                        return void h.$setValidity("date", !1)
                    }
                    return h.$setValidity("date", !0), null
                }
                var d, p = angular.isDefined(c.closeOnDateSelection) ? s.$parent.$eval(c.closeOnDateSelection) : a.closeOnDateSelection,
                    g = angular.isDefined(c.datepickerAppendToBody) ? s.$parent.$eval(c.datepickerAppendToBody) : a.appendToBody;
                s.showButtonBar = angular.isDefined(c.showButtonBar) ? s.$parent.$eval(c.showButtonBar) : a.showButtonBar, s.getText = function(t) {
                    return s[t + "Text"] || a[t + "Text"]
                }, c.$observe("datepickerPopup", function(t) {
                    d = t || a.datepickerPopup, h.$render()
                });
                var v = angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");
                v.attr({
                    "ng-model": "date",
                    "ng-change": "dateSelection()"
                });
                var m = angular.element(v.children()[0]);
                c.datepickerOptions && angular.forEach(s.$parent.$eval(c.datepickerOptions), function(t, e) {
                    m.attr(u(e), t)
                }), s.watchData = {}, angular.forEach(["minDate", "maxDate", "datepickerMode"], function(t) {
                    if (c[t]) {
                        var i = e(c[t]);
                        if (s.$parent.$watch(i, function(e) {
                                s.watchData[t] = e
                            }), m.attr(u(t), "watchData." + t), "datepickerMode" === t) {
                            var n = i.assign;
                            s.$watch("watchData." + t, function(t, e) {
                                t !== e && n(s.$parent, t)
                            })
                        }
                    }
                }), c.dateDisabled && m.attr("date-disabled", "dateDisabled({ date: date, mode: mode })"), h.$parsers.unshift(f), s.dateSelection = function(t) {
                    angular.isDefined(t) && (s.date = t), h.$setViewValue(s.date), h.$render(), p && (s.isOpen = !1, l[0].focus())
                }, l.bind("input change keyup", function() {
                    s.$apply(function() {
                        s.date = h.$modelValue
                    })
                }), h.$render = function() {
                    var t = h.$viewValue ? r(h.$viewValue, d) : "";
                    l.val(t), s.date = f(h.$modelValue)
                };
                var b = function(t) {
                        s.isOpen && t.target !== l[0] && s.$apply(function() {
                            s.isOpen = !1
                        })
                    },
                    y = function(t) {
                        s.keydown(t)
                    };
                l.bind("keydown", y), s.keydown = function(t) {
                    27 === t.which ? (t.preventDefault(), t.stopPropagation(), s.close()) : 40 !== t.which || s.isOpen || (s.isOpen = !0)
                }, s.$watch("isOpen", function(t) {
                    t ? (s.$broadcast("datepicker.focus"), s.position = g ? n.offset(l) : n.position(l), s.position.top = s.position.top + l.prop("offsetHeight"), i.bind("click", b)) : i.unbind("click", b)
                }), s.select = function(t) {
                    if ("today" === t) {
                        var e = new Date;
                        angular.isDate(h.$modelValue) ? (t = new Date(h.$modelValue), t.setFullYear(e.getFullYear(), e.getMonth(), e.getDate())) : t = new Date(e.setHours(0, 0, 0, 0))
                    }
                    s.dateSelection(t)
                }, s.close = function() {
                    s.isOpen = !1, l[0].focus()
                };
                var x = t(v)(s);
                v.remove(), g ? i.find("body").append(x) : l.after(x), s.$on("$destroy", function() {
                    x.remove(), l.unbind("keydown", y), i.unbind("click", b)
                })
            }
        }
    }]).directive("datepickerPopupWrap", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            templateUrl: "template/datepicker/popup.html",
            link: function(t, e) {
                e.bind("click", function(t) {
                    t.preventDefault(), t.stopPropagation()
                })
            }
        }
    }), angular.module("ui.bootstrap.dropdown", []).constant("dropdownConfig", {
        openClass: "open"
    }).service("dropdownService", ["$document", function(t) {
        var e = null;
        this.open = function(r) {
            e || (t.bind("click", i), t.bind("keydown", n)), e && e !== r && (e.isOpen = !1), e = r
        }, this.close = function(r) {
            e === r && (e = null, t.unbind("click", i), t.unbind("keydown", n))
        };
        var i = function(t) {
                var i = e.getToggleElement();
                t && i && i[0].contains(t.target) || e.$apply(function() {
                    e.isOpen = !1
                })
            },
            n = function(t) {
                27 === t.which && (e.focusToggleElement(), i())
            }
    }]).controller("DropdownController", ["$scope", "$attrs", "$parse", "dropdownConfig", "dropdownService", "$animate", function(t, e, i, n, r, o) {
        var a, s = this,
            l = t.$new(),
            c = n.openClass,
            h = angular.noop,
            u = e.onToggle ? i(e.onToggle) : angular.noop;
        this.init = function(n) {
            s.$element = n, e.isOpen && (a = i(e.isOpen), h = a.assign, t.$watch(a, function(t) {
                l.isOpen = !!t
            }))
        }, this.toggle = function(t) {
            return l.isOpen = arguments.length ? !!t : !l.isOpen
        }, this.isOpen = function() {
            return l.isOpen
        }, l.getToggleElement = function() {
            return s.toggleElement
        }, l.focusToggleElement = function() {
            s.toggleElement && s.toggleElement[0].focus()
        }, l.$watch("isOpen", function(e, i) {
            o[e ? "addClass" : "removeClass"](s.$element, c), e ? (l.focusToggleElement(), r.open(l)) : r.close(l), h(t, e), angular.isDefined(e) && e !== i && u(t, {
                open: !!e
            })
        }), t.$on("$locationChangeSuccess", function() {
            l.isOpen = !1
        }), t.$on("$destroy", function() {
            l.$destroy()
        })
    }]).directive("dropdown", function() {
        return {
            controller: "DropdownController",
            link: function(t, e, i, n) {
                n.init(e)
            }
        }
    }).directive("dropdownToggle", function() {
        return {
            require: "?^dropdown",
            link: function(t, e, i, n) {
                if (n) {
                    n.toggleElement = e;
                    var r = function(r) {
                        r.preventDefault(), e.hasClass("disabled") || i.disabled || t.$apply(function() {
                            n.toggle()
                        })
                    };
                    e.bind("click", r), e.attr({
                        "aria-haspopup": !0,
                        "aria-expanded": !1
                    }), t.$watch(n.isOpen, function(t) {
                        e.attr("aria-expanded", !!t)
                    }), t.$on("$destroy", function() {
                        e.unbind("click", r)
                    })
                }
            }
        }
    }), angular.module("ui.bootstrap.modal", ["ui.bootstrap.transition"]).factory("$$stackedMap", function() {
        return {
            createNew: function() {
                var t = [];
                return {
                    add: function(e, i) {
                        t.push({
                            key: e,
                            value: i
                        })
                    },
                    get: function(e) {
                        for (var i = 0; i < t.length; i++)
                            if (e == t[i].key) return t[i]
                    },
                    keys: function() {
                        for (var e = [], i = 0; i < t.length; i++) e.push(t[i].key);
                        return e
                    },
                    top: function() {
                        return t[t.length - 1]
                    },
                    remove: function(e) {
                        for (var i = -1, n = 0; n < t.length; n++)
                            if (e == t[n].key) {
                                i = n;
                                break
                            }
                        return t.splice(i, 1)[0]
                    },
                    removeTop: function() {
                        return t.splice(t.length - 1, 1)[0]
                    },
                    length: function() {
                        return t.length
                    }
                }
            }
        }
    }).directive("modalBackdrop", ["$timeout", function(t) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/modal/backdrop.html",
            link: function(e, i, n) {
                e.backdropClass = n.backdropClass || "", e.animate = !1, t(function() {
                    e.animate = !0
                })
            }
        }
    }]).directive("modalWindow", ["$modalStack", "$timeout", function(t, e) {
        return {
            restrict: "EA",
            scope: {
                index: "@",
                animate: "="
            },
            replace: !0,
            transclude: !0,
            templateUrl: function(t, e) {
                return e.templateUrl || "template/modal/window.html"
            },
            link: function(i, n, r) {
                n.addClass(r.windowClass || ""), i.size = r.size, e(function() {
                    i.animate = !0, n[0].querySelectorAll("[autofocus]").length || n[0].focus()
                }), i.close = function(e) {
                    var i = t.getTop();
                    i && i.value.backdrop && "static" != i.value.backdrop && e.target === e.currentTarget && (e.preventDefault(), e.stopPropagation(), t.dismiss(i.key, "backdrop click"))
                }
            }
        }
    }]).directive("modalTransclude", function() {
        return {
            link: function(t, e, i, n, r) {
                r(t.$parent, function(t) {
                    e.empty(), e.append(t)
                })
            }
        }
    }).factory("$modalStack", ["$transition", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap", function(t, e, i, n, r, o) {
        function a() {
            for (var t = -1, e = d.keys(), i = 0; i < e.length; i++) d.get(e[i]).value.backdrop && (t = i);
            return t
        }

        function s(t) {
            var e = i.find("body").eq(0),
                n = d.get(t).value;
            d.remove(t), c(n.modalDomEl, n.modalScope, 300, function() {
                n.modalScope.$destroy(), e.toggleClass(f, d.length() > 0), l()
            })
        }

        function l() {
            if (h && -1 == a()) {
                var t = u;
                c(h, u, 150, function() {
                    t.$destroy(), t = null
                }), h = void 0, u = void 0
            }
        }

        function c(i, n, r, o) {
            function a() {
                a.done || (a.done = !0, i.remove(), o && o())
            }
            n.animate = !1;
            var s = t.transitionEndEventName;
            if (s) {
                var l = e(a, r);
                i.bind(s, function() {
                    e.cancel(l), a(), n.$apply()
                })
            } else e(a)
        }
        var h, u, f = "modal-open",
            d = o.createNew(),
            p = {};
        return r.$watch(a, function(t) {
            u && (u.index = t)
        }), i.bind("keydown", function(t) {
            var e;
            27 === t.which && (e = d.top(), e && e.value.keyboard && (t.preventDefault(), r.$apply(function() {
                p.dismiss(e.key, "escape key press")
            })))
        }), p.open = function(t, e) {
            d.add(t, {
                deferred: e.deferred,
                modalScope: e.scope,
                backdrop: e.backdrop,
                keyboard: e.keyboard
            });
            var o = i.find("body").eq(0),
                s = a();
            if (s >= 0 && !h) {
                u = r.$new(!0), u.index = s;
                var l = angular.element("<div modal-backdrop></div>");
                l.attr("backdrop-class", e.backdropClass), h = n(l)(u), o.append(h)
            }
            var c = angular.element("<div modal-window></div>");
            c.attr({
                "template-url": e.windowTemplateUrl,
                "window-class": e.windowClass,
                size: e.size,
                index: d.length() - 1,
                animate: "animate"
            }).html(e.content);
            var p = n(c)(e.scope);
            d.top().value.modalDomEl = p, o.append(p), o.addClass(f)
        }, p.close = function(t, e) {
            var i = d.get(t);
            i && (i.value.deferred.resolve(e), s(t))
        }, p.dismiss = function(t, e) {
            var i = d.get(t);
            i && (i.value.deferred.reject(e), s(t))
        }, p.dismissAll = function(t) {
            for (var e = this.getTop(); e;) this.dismiss(e.key, t), e = this.getTop()
        }, p.getTop = function() {
            return d.top()
        }, p
    }]).provider("$modal", function() {
        var t = {
            options: {
                backdrop: !0,
                keyboard: !0
            },
            $get: ["$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack", function(e, i, n, r, o, a, s) {
                function l(t) {
                    return t.template ? n.when(t.template) : r.get(angular.isFunction(t.templateUrl) ? t.templateUrl() : t.templateUrl, {
                        cache: o
                    }).then(function(t) {
                        return t.data
                    })
                }

                function c(t) {
                    var i = [];
                    return angular.forEach(t, function(t) {
                        (angular.isFunction(t) || angular.isArray(t)) && i.push(n.when(e.invoke(t)))
                    }), i
                }
                var h = {};
                return h.open = function(e) {
                    var r = n.defer(),
                        o = n.defer(),
                        h = {
                            result: r.promise,
                            opened: o.promise,
                            close: function(t) {
                                s.close(h, t)
                            },
                            dismiss: function(t) {
                                s.dismiss(h, t)
                            }
                        };
                    if (e = angular.extend({}, t.options, e), e.resolve = e.resolve || {}, !e.template && !e.templateUrl) throw new Error("One of template or templateUrl options is required.");
                    var u = n.all([l(e)].concat(c(e.resolve)));
                    return u.then(function(t) {
                        var n = (e.scope || i).$new();
                        n.$close = h.close, n.$dismiss = h.dismiss;
                        var o, l = {},
                            c = 1;
                        e.controller && (l.$scope = n, l.$modalInstance = h, angular.forEach(e.resolve, function(e, i) {
                            l[i] = t[c++]
                        }), o = a(e.controller, l), e.controllerAs && (n[e.controllerAs] = o)), s.open(h, {
                            scope: n,
                            deferred: r,
                            content: t[0],
                            backdrop: e.backdrop,
                            keyboard: e.keyboard,
                            backdropClass: e.backdropClass,
                            windowClass: e.windowClass,
                            windowTemplateUrl: e.windowTemplateUrl,
                            size: e.size
                        })
                    }, function(t) {
                        r.reject(t)
                    }), u.then(function() {
                        o.resolve(!0)
                    }, function() {
                        o.reject(!1)
                    }), h
                }, h
            }]
        };
        return t
    }), angular.module("ui.bootstrap.pagination", []).controller("PaginationController", ["$scope", "$attrs", "$parse", function(t, e, i) {
        var n = this,
            r = {
                $setViewValue: angular.noop
            },
            o = e.numPages ? i(e.numPages).assign : angular.noop;
        this.init = function(o, a) {
            r = o, this.config = a, r.$render = function() {
                n.render()
            }, e.itemsPerPage ? t.$parent.$watch(i(e.itemsPerPage), function(e) {
                n.itemsPerPage = parseInt(e, 10), t.totalPages = n.calculateTotalPages()
            }) : this.itemsPerPage = a.itemsPerPage
        }, this.calculateTotalPages = function() {
            var e = this.itemsPerPage < 1 ? 1 : Math.ceil(t.totalItems / this.itemsPerPage);
            return Math.max(e || 0, 1)
        }, this.render = function() {
            t.page = parseInt(r.$viewValue, 10) || 1
        }, t.selectPage = function(e) {
            t.page !== e && e > 0 && e <= t.totalPages && (r.$setViewValue(e), r.$render())
        }, t.getText = function(e) {
            return t[e + "Text"] || n.config[e + "Text"]
        }, t.noPrevious = function() {
            return 1 === t.page
        }, t.noNext = function() {
            return t.page === t.totalPages
        }, t.$watch("totalItems", function() {
            t.totalPages = n.calculateTotalPages()
        }), t.$watch("totalPages", function(e) {
            o(t.$parent, e), t.page > e ? t.selectPage(e) : r.$render()
        })
    }]).constant("paginationConfig", {
        itemsPerPage: 10,
        boundaryLinks: !1,
        directionLinks: !0,
        firstText: "First",
        previousText: "Previous",
        nextText: "Next",
        lastText: "Last",
        rotate: !0
    }).directive("pagination", ["$parse", "paginationConfig", function(t, e) {
        return {
            restrict: "EA",
            scope: {
                totalItems: "=",
                firstText: "@",
                previousText: "@",
                nextText: "@",
                lastText: "@"
            },
            require: ["pagination", "?ngModel"],
            controller: "PaginationController",
            templateUrl: "template/pagination/pagination.html",
            replace: !0,
            link: function(i, n, r, o) {
                function a(t, e, i) {
                    return {
                        number: t,
                        text: e,
                        active: i
                    }
                }

                function s(t, e) {
                    var i = [],
                        n = 1,
                        r = e,
                        o = angular.isDefined(h) && e > h;
                    o && (u ? (n = Math.max(t - Math.floor(h / 2), 1), r = n + h - 1, r > e && (r = e, n = r - h + 1)) : (n = (Math.ceil(t / h) - 1) * h + 1, r = Math.min(n + h - 1, e)));
                    for (var s = n; r >= s; s++) {
                        var l = a(s, s, s === t);
                        i.push(l)
                    }
                    if (o && !u) {
                        if (n > 1) {
                            var c = a(n - 1, "...", !1);
                            i.unshift(c)
                        }
                        if (e > r) {
                            var f = a(r + 1, "...", !1);
                            i.push(f)
                        }
                    }
                    return i
                }
                var l = o[0],
                    c = o[1];
                if (c) {
                    var h = angular.isDefined(r.maxSize) ? i.$parent.$eval(r.maxSize) : e.maxSize,
                        u = angular.isDefined(r.rotate) ? i.$parent.$eval(r.rotate) : e.rotate;
                    i.boundaryLinks = angular.isDefined(r.boundaryLinks) ? i.$parent.$eval(r.boundaryLinks) : e.boundaryLinks, i.directionLinks = angular.isDefined(r.directionLinks) ? i.$parent.$eval(r.directionLinks) : e.directionLinks, l.init(c, e), r.maxSize && i.$parent.$watch(t(r.maxSize), function(t) {
                        h = parseInt(t, 10), l.render()
                    });
                    var f = l.render;
                    l.render = function() {
                        f(), i.page > 0 && i.page <= i.totalPages && (i.pages = s(i.page, i.totalPages))
                    }
                }
            }
        }
    }]).constant("pagerConfig", {
        itemsPerPage: 10,
        previousText: "« Previous",
        nextText: "Next »",
        align: !0
    }).directive("pager", ["pagerConfig", function(t) {
        return {
            restrict: "EA",
            scope: {
                totalItems: "=",
                previousText: "@",
                nextText: "@"
            },
            require: ["pager", "?ngModel"],
            controller: "PaginationController",
            templateUrl: "template/pagination/pager.html",
            replace: !0,
            link: function(e, i, n, r) {
                var o = r[0],
                    a = r[1];
                a && (e.align = angular.isDefined(n.align) ? e.$parent.$eval(n.align) : t.align, o.init(a, t))
            }
        }
    }]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).provider("$tooltip", function() {
        function t(t) {
            var e = /[A-Z]/g,
                i = "-";
            return t.replace(e, function(t, e) {
                return (e ? i : "") + t.toLowerCase()
            })
        }
        var e = {
                placement: "top",
                animation: !0,
                popupDelay: 0
            },
            i = {
                mouseenter: "mouseleave",
                click: "click",
                focus: "blur"
            },
            n = {};
        this.options = function(t) {
            angular.extend(n, t)
        }, this.setTriggers = function(t) {
            angular.extend(i, t)
        }, this.$get = ["$window", "$compile", "$timeout", "$parse", "$document", "$position", "$interpolate", function(r, o, a, s, l, c, h) {
            return function(r, u, f) {
                function d(t) {
                    var e = t || p.trigger || f,
                        n = i[e] || e;
                    return {
                        show: e,
                        hide: n
                    }
                }
                var p = angular.extend({}, e, n),
                    g = t(r),
                    v = h.startSymbol(),
                    m = h.endSymbol(),
                    b = "<div " + g + '-popup title="' + v + "tt_title" + m + '" content="' + v + "tt_content" + m + '" placement="' + v + "tt_placement" + m + '" animation="tt_animation" is-open="tt_isOpen"></div>';
                return {
                    restrict: "EA",
                    scope: !0,
                    compile: function() {
                        var t = o(b);
                        return function(e, i, n) {
                            function o() {
                                e.tt_isOpen ? f() : h()
                            }

                            function h() {
                                (!S || e.$eval(n[u + "Enable"])) && (e.tt_popupDelay ? w || (w = a(g, e.tt_popupDelay, !1), w.then(function(t) {
                                    t()
                                })) : g()())
                            }

                            function f() {
                                e.$apply(function() {
                                    v()
                                })
                            }

                            function g() {
                                return w = null, x && (a.cancel(x), x = null), e.tt_content ? (m(), y.css({
                                    top: 0,
                                    left: 0,
                                    display: "block"
                                }), _ ? l.find("body").append(y) : i.after(y), A(), e.tt_isOpen = !0, e.$digest(), A) : angular.noop
                            }

                            function v() {
                                e.tt_isOpen = !1, a.cancel(w), w = null, e.tt_animation ? x || (x = a(b, 500)) : b()
                            }

                            function m() {
                                y && b(), y = t(e, function() {}), e.$digest()
                            }

                            function b() {
                                x = null, y && (y.remove(), y = null)
                            }
                            var y, x, w, _ = angular.isDefined(p.appendToBody) ? p.appendToBody : !1,
                                C = d(void 0),
                                S = angular.isDefined(n[u + "Enable"]),
                                A = function() {
                                    var t = c.positionElements(i, y, e.tt_placement, _);
                                    t.top += "px", t.left += "px", y.css(t)
                                };
                            e.tt_isOpen = !1, n.$observe(r, function(t) {
                                e.tt_content = t, !t && e.tt_isOpen && v()
                            }), n.$observe(u + "Title", function(t) {
                                e.tt_title = t
                            }), n.$observe(u + "Placement", function(t) {
                                e.tt_placement = angular.isDefined(t) ? t : p.placement
                            }), n.$observe(u + "PopupDelay", function(t) {
                                var i = parseInt(t, 10);
                                e.tt_popupDelay = isNaN(i) ? p.popupDelay : i
                            });
                            var k = function() {
                                i.unbind(C.show, h), i.unbind(C.hide, f)
                            };
                            n.$observe(u + "Trigger", function(t) {
                                k(), C = d(t), C.show === C.hide ? i.bind(C.show, o) : (i.bind(C.show, h), i.bind(C.hide, f))
                            });
                            var T = e.$eval(n[u + "Animation"]);
                            e.tt_animation = angular.isDefined(T) ? !!T : p.animation, n.$observe(u + "AppendToBody", function(t) {
                                _ = angular.isDefined(t) ? s(t)(e) : _
                            }), _ && e.$on("$locationChangeSuccess", function() {
                                e.tt_isOpen && v()
                            }), e.$on("$destroy", function() {
                                a.cancel(x), a.cancel(w), k(), b()
                            })
                        }
                    }
                }
            }
        }]
    }).directive("tooltipPopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/tooltip/tooltip-popup.html"
        }
    }).directive("tooltip", ["$tooltip", function(t) {
        return t("tooltip", "tooltip", "mouseenter")
    }]).directive("tooltipHtmlUnsafePopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/tooltip/tooltip-html-unsafe-popup.html"
        }
    }).directive("tooltipHtmlUnsafe", ["$tooltip", function(t) {
        return t("tooltipHtmlUnsafe", "tooltip", "mouseenter")
    }]), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("popoverPopup", function() {
        return {
            restrict: "EA",
            replace: !0,
            scope: {
                title: "@",
                content: "@",
                placement: "@",
                animation: "&",
                isOpen: "&"
            },
            templateUrl: "template/popover/popover.html"
        }
    }).directive("popover", ["$tooltip", function(t) {
        return t("popover", "popover", "click")
    }]), angular.module("ui.bootstrap.progressbar", []).constant("progressConfig", {
        animate: !0,
        max: 100
    }).controller("ProgressController", ["$scope", "$attrs", "progressConfig", function(t, e, i) {
        var n = this,
            r = angular.isDefined(e.animate) ? t.$parent.$eval(e.animate) : i.animate;
        this.bars = [], t.max = angular.isDefined(e.max) ? t.$parent.$eval(e.max) : i.max, this.addBar = function(e, i) {
            r || i.css({
                transition: "none"
            }), this.bars.push(e), e.$watch("value", function(i) {
                e.percent = +(100 * i / t.max).toFixed(2)
            }), e.$on("$destroy", function() {
                i = null, n.removeBar(e)
            })
        }, this.removeBar = function(t) {
            this.bars.splice(this.bars.indexOf(t), 1)
        }
    }]).directive("progress", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            controller: "ProgressController",
            require: "progress",
            scope: {},
            templateUrl: "template/progressbar/progress.html"
        }
    }).directive("bar", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            require: "^progress",
            scope: {
                value: "=",
                type: "@"
            },
            templateUrl: "template/progressbar/bar.html",
            link: function(t, e, i, n) {
                n.addBar(t, e)
            }
        }
    }).directive("progressbar", function() {
        return {
            restrict: "EA",
            replace: !0,
            transclude: !0,
            controller: "ProgressController",
            scope: {
                value: "=",
                type: "@"
            },
            templateUrl: "template/progressbar/progressbar.html",
            link: function(t, e, i, n) {
                n.addBar(t, angular.element(e.children()[0]))
            }
        }
    }), angular.module("ui.bootstrap.rating", []).constant("ratingConfig", {
        max: 5,
        stateOn: null,
        stateOff: null
    }).controller("RatingController", ["$scope", "$attrs", "ratingConfig", function(t, e, i) {
        var n = {
            $setViewValue: angular.noop
        };
        this.init = function(r) {
            n = r, n.$render = this.render, this.stateOn = angular.isDefined(e.stateOn) ? t.$parent.$eval(e.stateOn) : i.stateOn, this.stateOff = angular.isDefined(e.stateOff) ? t.$parent.$eval(e.stateOff) : i.stateOff;
            var o = angular.isDefined(e.ratingStates) ? t.$parent.$eval(e.ratingStates) : new Array(angular.isDefined(e.max) ? t.$parent.$eval(e.max) : i.max);
            t.range = this.buildTemplateObjects(o)
        }, this.buildTemplateObjects = function(t) {
            for (var e = 0, i = t.length; i > e; e++) t[e] = angular.extend({
                index: e
            }, {
                stateOn: this.stateOn,
                stateOff: this.stateOff
            }, t[e]);
            return t
        }, t.rate = function(e) {
            !t.readonly && e >= 0 && e <= t.range.length && (n.$setViewValue(e), n.$render())
        }, t.enter = function(e) {
            t.readonly || (t.value = e), t.onHover({
                value: e
            })
        }, t.reset = function() {
            t.value = n.$viewValue, t.onLeave()
        }, t.onKeydown = function(e) {
            /(37|38|39|40)/.test(e.which) && (e.preventDefault(), e.stopPropagation(), t.rate(t.value + (38 === e.which || 39 === e.which ? 1 : -1)))
        }, this.render = function() {
            t.value = n.$viewValue
        }
    }]).directive("rating", function() {
        return {
            restrict: "EA",
            require: ["rating", "ngModel"],
            scope: {
                readonly: "=?",
                onHover: "&",
                onLeave: "&"
            },
            controller: "RatingController",
            templateUrl: "template/rating/rating.html",
            replace: !0,
            link: function(t, e, i, n) {
                var r = n[0],
                    o = n[1];
                o && r.init(o)
            }
        }
    }), angular.module("ui.bootstrap.tabs", []).controller("TabsetController", ["$scope", function(t) {
        var e = this,
            i = e.tabs = t.tabs = [];
        e.select = function(t) {
            angular.forEach(i, function(e) {
                e.active && e !== t && (e.active = !1, e.onDeselect())
            }), t.active = !0, t.onSelect()
        }, e.addTab = function(t) {
            i.push(t), 1 === i.length ? t.active = !0 : t.active && e.select(t)
        }, e.removeTab = function(t) {
            var n = i.indexOf(t);
            if (t.active && i.length > 1) {
                var r = n == i.length - 1 ? n - 1 : n + 1;
                e.select(i[r])
            }
            i.splice(n, 1)
        }
    }]).directive("tabset", function() {
        return {
            restrict: "EA",
            transclude: !0,
            replace: !0,
            scope: {
                type: "@"
            },
            controller: "TabsetController",
            templateUrl: "template/tabs/tabset.html",
            link: function(t, e, i) {
                t.vertical = angular.isDefined(i.vertical) ? t.$parent.$eval(i.vertical) : !1, t.justified = angular.isDefined(i.justified) ? t.$parent.$eval(i.justified) : !1
            }
        }
    }).directive("tab", ["$parse", function(t) {
        return {
            require: "^tabset",
            restrict: "EA",
            replace: !0,
            templateUrl: "template/tabs/tab.html",
            transclude: !0,
            scope: {
                active: "=?",
                heading: "@",
                onSelect: "&select",
                onDeselect: "&deselect"
            },
            controller: function() {},
            compile: function(e, i, n) {
                return function(e, i, r, o) {
                    e.$watch("active", function(t) {
                        t && o.select(e)
                    }), e.disabled = !1, r.disabled && e.$parent.$watch(t(r.disabled), function(t) {
                        e.disabled = !!t
                    }), e.select = function() {
                        e.disabled || (e.active = !0)
                    }, o.addTab(e), e.$on("$destroy", function() {
                        o.removeTab(e)
                    }), e.$transcludeFn = n
                }
            }
        }
    }]).directive("tabHeadingTransclude", [function() {
        return {
            restrict: "A",
            require: "^tab",
            link: function(t, e) {
                t.$watch("headingElement", function(t) {
                    t && (e.html(""), e.append(t))
                })
            }
        }
    }]).directive("tabContentTransclude", function() {
        function t(t) {
            return t.tagName && (t.hasAttribute("tab-heading") || t.hasAttribute("data-tab-heading") || "tab-heading" === t.tagName.toLowerCase() || "data-tab-heading" === t.tagName.toLowerCase())
        }
        return {
            restrict: "A",
            require: "^tabset",
            link: function(e, i, n) {
                var r = e.$eval(n.tabContentTransclude);
                r.$transcludeFn(r.$parent, function(e) {
                    angular.forEach(e, function(e) {
                        t(e) ? r.headingElement = e : i.append(e)
                    })
                })
            }
        }
    }), angular.module("ui.bootstrap.timepicker", []).constant("timepickerConfig", {
        hourStep: 1,
        minuteStep: 1,
        showMeridian: !0,
        meridians: null,
        readonlyInput: !1,
        mousewheel: !0
    }).controller("TimepickerController", ["$scope", "$attrs", "$parse", "$log", "$locale", "timepickerConfig", function(t, e, i, n, r, o) {
        function a() {
            var e = parseInt(t.hours, 10),
                i = t.showMeridian ? e > 0 && 13 > e : e >= 0 && 24 > e;
            return i ? (t.showMeridian && (12 === e && (e = 0), t.meridian === g[1] && (e += 12)), e) : void 0
        }

        function s() {
            var e = parseInt(t.minutes, 10);
            return e >= 0 && 60 > e ? e : void 0
        }

        function l(t) {
            return angular.isDefined(t) && t.toString().length < 2 ? "0" + t : t
        }

        function c(t) {
            h(), p.$setViewValue(new Date(d)), u(t)
        }

        function h() {
            p.$setValidity("time", !0), t.invalidHours = !1, t.invalidMinutes = !1
        }

        function u(e) {
            var i = d.getHours(),
                n = d.getMinutes();
            t.showMeridian && (i = 0 === i || 12 === i ? 12 : i % 12), t.hours = "h" === e ? i : l(i), t.minutes = "m" === e ? n : l(n), t.meridian = d.getHours() < 12 ? g[0] : g[1]
        }

        function f(t) {
            var e = new Date(d.getTime() + 6e4 * t);
            d.setHours(e.getHours(), e.getMinutes()), c()
        }
        var d = new Date,
            p = {
                $setViewValue: angular.noop
            },
            g = angular.isDefined(e.meridians) ? t.$parent.$eval(e.meridians) : o.meridians || r.DATETIME_FORMATS.AMPMS;
        this.init = function(i, n) {
            p = i, p.$render = this.render;
            var r = n.eq(0),
                a = n.eq(1),
                s = angular.isDefined(e.mousewheel) ? t.$parent.$eval(e.mousewheel) : o.mousewheel;
            s && this.setupMousewheelEvents(r, a), t.readonlyInput = angular.isDefined(e.readonlyInput) ? t.$parent.$eval(e.readonlyInput) : o.readonlyInput, this.setupInputEvents(r, a)
        };
        var v = o.hourStep;
        e.hourStep && t.$parent.$watch(i(e.hourStep), function(t) {
            v = parseInt(t, 10)
        });
        var m = o.minuteStep;
        e.minuteStep && t.$parent.$watch(i(e.minuteStep), function(t) {
            m = parseInt(t, 10)
        }), t.showMeridian = o.showMeridian, e.showMeridian && t.$parent.$watch(i(e.showMeridian), function(e) {
            if (t.showMeridian = !!e, p.$error.time) {
                var i = a(),
                    n = s();
                angular.isDefined(i) && angular.isDefined(n) && (d.setHours(i), c())
            } else u()
        }), this.setupMousewheelEvents = function(e, i) {
            var n = function(t) {
                t.originalEvent && (t = t.originalEvent);
                var e = t.wheelDelta ? t.wheelDelta : -t.deltaY;
                return t.detail || e > 0
            };
            e.bind("mousewheel wheel", function(e) {
                t.$apply(n(e) ? t.incrementHours() : t.decrementHours()), e.preventDefault()
            }), i.bind("mousewheel wheel", function(e) {
                t.$apply(n(e) ? t.incrementMinutes() : t.decrementMinutes()), e.preventDefault()
            })
        }, this.setupInputEvents = function(e, i) {
            if (t.readonlyInput) return t.updateHours = angular.noop, void(t.updateMinutes = angular.noop);
            var n = function(e, i) {
                p.$setViewValue(null), p.$setValidity("time", !1), angular.isDefined(e) && (t.invalidHours = e), angular.isDefined(i) && (t.invalidMinutes = i)
            };
            t.updateHours = function() {
                var t = a();
                angular.isDefined(t) ? (d.setHours(t), c("h")) : n(!0)
            }, e.bind("blur", function() {
                !t.invalidHours && t.hours < 10 && t.$apply(function() {
                    t.hours = l(t.hours)
                })
            }), t.updateMinutes = function() {
                var t = s();
                angular.isDefined(t) ? (d.setMinutes(t), c("m")) : n(void 0, !0)
            }, i.bind("blur", function() {
                !t.invalidMinutes && t.minutes < 10 && t.$apply(function() {
                    t.minutes = l(t.minutes)
                })
            })
        }, this.render = function() {
            var t = p.$modelValue ? new Date(p.$modelValue) : null;
            isNaN(t) ? (p.$setValidity("time", !1), n.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (t && (d = t), h(), u())
        }, t.incrementHours = function() {
            f(60 * v)
        }, t.decrementHours = function() {
            f(60 * -v)
        }, t.incrementMinutes = function() {
            f(m)
        }, t.decrementMinutes = function() {
            f(-m)
        }, t.toggleMeridian = function() {
            f(720 * (d.getHours() < 12 ? 1 : -1))
        }
    }]).directive("timepicker", function() {
        return {
            restrict: "EA",
            require: ["timepicker", "?^ngModel"],
            controller: "TimepickerController",
            replace: !0,
            scope: {},
            templateUrl: "template/timepicker/timepicker.html",
            link: function(t, e, i, n) {
                var r = n[0],
                    o = n[1];
                o && r.init(o, e.find("input"))
            }
        }
    }), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).factory("typeaheadParser", ["$parse", function(t) {
        var e = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
        return {
            parse: function(i) {
                var n = i.match(e);
                if (!n) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + i + '".');
                return {
                    itemName: n[3],
                    source: t(n[4]),
                    viewMapper: t(n[2] || n[1]),
                    modelMapper: t(n[1])
                }
            }
        }
    }]).directive("typeahead", ["$compile", "$parse", "$q", "$timeout", "$document", "$position", "typeaheadParser", function(t, e, i, n, r, o, a) {
        var s = [9, 13, 27, 38, 40];
        return {
            require: "ngModel",
            link: function(l, c, h, u) {
                var f, d = l.$eval(h.typeaheadMinLength) || 1,
                    p = l.$eval(h.typeaheadWaitMs) || 0,
                    g = l.$eval(h.typeaheadEditable) !== !1,
                    v = e(h.typeaheadLoading).assign || angular.noop,
                    m = e(h.typeaheadOnSelect),
                    b = h.typeaheadInputFormatter ? e(h.typeaheadInputFormatter) : void 0,
                    y = h.typeaheadAppendToBody ? l.$eval(h.typeaheadAppendToBody) : !1,
                    x = e(h.ngModel).assign,
                    w = a.parse(h.typeahead),
                    _ = l.$new();
                l.$on("$destroy", function() {
                    _.$destroy()
                });
                var C = "typeahead-" + _.$id + "-" + Math.floor(1e4 * Math.random());
                c.attr({
                    "aria-autocomplete": "list",
                    "aria-expanded": !1,
                    "aria-owns": C
                });
                var S = angular.element("<div typeahead-popup></div>");
                S.attr({
                    id: C,
                    matches: "matches",
                    active: "activeIdx",
                    select: "select(activeIdx)",
                    query: "query",
                    position: "position"
                }), angular.isDefined(h.typeaheadTemplateUrl) && S.attr("template-url", h.typeaheadTemplateUrl);
                var A = function() {
                        _.matches = [], _.activeIdx = -1, c.attr("aria-expanded", !1)
                    },
                    k = function(t) {
                        return C + "-option-" + t
                    };
                _.$watch("activeIdx", function(t) {
                    0 > t ? c.removeAttr("aria-activedescendant") : c.attr("aria-activedescendant", k(t))
                });
                var T = function(t) {
                    var e = {
                        $viewValue: t
                    };
                    v(l, !0), i.when(w.source(l, e)).then(function(i) {
                        var n = t === u.$viewValue;
                        if (n && f)
                            if (i.length > 0) {
                                _.activeIdx = 0, _.matches.length = 0;
                                for (var r = 0; r < i.length; r++) e[w.itemName] = i[r], _.matches.push({
                                    id: k(r),
                                    label: w.viewMapper(_, e),
                                    model: i[r]
                                });
                                _.query = t, _.position = y ? o.offset(c) : o.position(c), _.position.top = _.position.top + c.prop("offsetHeight"), c.attr("aria-expanded", !0)
                            } else A();
                        n && v(l, !1)
                    }, function() {
                        A(), v(l, !1)
                    })
                };
                A(), _.query = void 0;
                var O, $ = function(t) {
                        O = n(function() {
                            T(t)
                        }, p)
                    },
                    D = function() {
                        O && n.cancel(O)
                    };
                u.$parsers.unshift(function(t) {
                    return f = !0, t && t.length >= d ? p > 0 ? (D(), $(t)) : T(t) : (v(l, !1), D(), A()), g ? t : t ? void u.$setValidity("editable", !1) : (u.$setValidity("editable", !0), t)
                }), u.$formatters.push(function(t) {
                    var e, i, n = {};
                    return b ? (n.$model = t, b(l, n)) : (n[w.itemName] = t, e = w.viewMapper(l, n), n[w.itemName] = void 0, i = w.viewMapper(l, n), e !== i ? e : t)
                }), _.select = function(t) {
                    var e, i, r = {};
                    r[w.itemName] = i = _.matches[t].model, e = w.modelMapper(l, r), x(l, e), u.$setValidity("editable", !0), m(l, {
                        $item: i,
                        $model: e,
                        $label: w.viewMapper(l, r)
                    }), A(), n(function() {
                        c[0].focus()
                    }, 0, !1)
                }, c.bind("keydown", function(t) {
                    0 !== _.matches.length && -1 !== s.indexOf(t.which) && (t.preventDefault(), 40 === t.which ? (_.activeIdx = (_.activeIdx + 1) % _.matches.length, _.$digest()) : 38 === t.which ? (_.activeIdx = (_.activeIdx ? _.activeIdx : _.matches.length) - 1, _.$digest()) : 13 === t.which || 9 === t.which ? _.$apply(function() {
                        _.select(_.activeIdx)
                    }) : 27 === t.which && (t.stopPropagation(), A(), _.$digest()))
                }), c.bind("blur", function() {
                    f = !1
                });
                var M = function(t) {
                    c[0] !== t.target && (A(), _.$digest())
                };
                r.bind("click", M), l.$on("$destroy", function() {
                    r.unbind("click", M)
                });
                var E = t(S)(_);
                y ? r.find("body").append(E) : c.after(E)
            }
        }
    }]).directive("typeaheadPopup", function() {
        return {
            restrict: "EA",
            scope: {
                matches: "=",
                query: "=",
                active: "=",
                position: "=",
                select: "&"
            },
            replace: !0,
            templateUrl: "template/typeahead/typeahead-popup.html",
            link: function(t, e, i) {
                t.templateUrl = i.templateUrl, t.isOpen = function() {
                    return t.matches.length > 0
                }, t.isActive = function(e) {
                    return t.active == e
                }, t.selectActive = function(e) {
                    t.active = e
                }, t.selectMatch = function(e) {
                    t.select({
                        activeIdx: e
                    })
                }
            }
        }
    }).directive("typeaheadMatch", ["$http", "$templateCache", "$compile", "$parse", function(t, e, i, n) {
        return {
            restrict: "EA",
            scope: {
                index: "=",
                match: "=",
                query: "="
            },
            link: function(r, o, a) {
                var s = n(a.templateUrl)(r.$parent) || "template/typeahead/typeahead-match.html";
                t.get(s, {
                    cache: e
                }).success(function(t) {
                    o.replaceWith(i(t.trim())(r))
                })
            }
        }
    }]).filter("typeaheadHighlight", function() {
        function t(t) {
            return t.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
        }
        return function(e, i) {
            return i ? ("" + e).replace(new RegExp(t(i), "gi"), "<strong>$&</strong>") : e
        }
    }), angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function(t) {
        t.put("template/accordion/accordion-group.html", '<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>')
    }]), angular.module("template/accordion/accordion.html", []).run(["$templateCache", function(t) {
        t.put("template/accordion/accordion.html", '<div class="panel-group" ng-transclude></div>')
    }]), angular.module("template/alert/alert.html", []).run(["$templateCache", function(t) {
        t.put("template/alert/alert.html", '<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')
    }]), angular.module("template/carousel/carousel.html", []).run(["$templateCache", function(t) {
        t.put("template/carousel/carousel.html", '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n')
    }]), angular.module("template/carousel/slide.html", []).run(["$templateCache", function(t) {
        t.put("template/carousel/slide.html", "<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n")
    }]), angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function(t) {
        t.put("template/datepicker/datepicker.html", '<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>')
    }]), angular.module("template/datepicker/day.html", []).run(["$templateCache", function(t) {
        t.put("template/datepicker/day.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
    }]), angular.module("template/datepicker/month.html", []).run(["$templateCache", function(t) {
        t.put("template/datepicker/month.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
    }]), angular.module("template/datepicker/popup.html", []).run(["$templateCache", function(t) {
        t.put("template/datepicker/popup.html", '<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n')
    }]), angular.module("template/datepicker/year.html", []).run(["$templateCache", function(t) {
        t.put("template/datepicker/year.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
    }]), angular.module("template/modal/backdrop.html", []).run(["$templateCache", function(t) {
        t.put("template/modal/backdrop.html", '<div class="modal-backdrop fade {{ backdropClass }}"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')
    }]), angular.module("template/modal/window.html", []).run(["$templateCache", function(t) {
        t.put("template/modal/window.html", '<div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="{\'modal-sm\': size == \'sm\', \'modal-lg\': size == \'lg\'}"><div class="modal-content" modal-transclude></div></div>\n</div>')
    }]), angular.module("template/pagination/pager.html", []).run(["$templateCache", function(t) {
        t.put("template/pagination/pager.html", '<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n</ul>')
    }]), angular.module("template/pagination/pagination.html", []).run(["$templateCache", function(t) {
        t.put("template/pagination/pagination.html", '<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>\n</ul>')
    }]), angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function(t) {
        t.put("template/tooltip/tooltip-html-unsafe-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')
    }]), angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function(t) {
        t.put("template/tooltip/tooltip-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')
    }]), angular.module("template/popover/popover.html", []).run(["$templateCache", function(t) {
        t.put("template/popover/popover.html", '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')
    }]), angular.module("template/progressbar/bar.html", []).run(["$templateCache", function(t) {
        t.put("template/progressbar/bar.html", '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>')
    }]), angular.module("template/progressbar/progress.html", []).run(["$templateCache", function(t) {
        t.put("template/progressbar/progress.html", '<div class="progress" ng-transclude></div>')
    }]), angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function(t) {
        t.put("template/progressbar/progressbar.html", '<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>')
    }]), angular.module("template/rating/rating.html", []).run(["$templateCache", function(t) {
        t.put("template/rating/rating.html", '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')
    }]), angular.module("template/tabs/tab.html", []).run(["$templateCache", function(t) {
        t.put("template/tabs/tab.html", '<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')
    }]), angular.module("template/tabs/tabset.html", []).run(["$templateCache", function(t) {
        t.put("template/tabs/tabset.html", '<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')
    }]), angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function(t) {
        t.put("template/timepicker/timepicker.html", '<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n')
    }]), angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function(t) {
        t.put("template/typeahead/typeahead-match.html", '<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')
    }]), angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function(t) {
        t.put("template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu" ng-show="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')
    }]),
    function() {
        function t(t) {
            var i = {
                    r: 0,
                    g: 0,
                    b: 0
                },
                r = 1,
                a = !1,
                s = !1;
            return "string" == typeof t && (t = E(t)), "object" == typeof t && (t.hasOwnProperty("r") && t.hasOwnProperty("g") && t.hasOwnProperty("b") ? (i = e(t.r, t.g, t.b), a = !0, s = "%" === String(t.r).substr(-1) ? "prgb" : "rgb") : t.hasOwnProperty("h") && t.hasOwnProperty("s") && t.hasOwnProperty("v") ? (t.s = $(t.s), t.v = $(t.v), i = o(t.h, t.s, t.v), a = !0, s = "hsv") : t.hasOwnProperty("h") && t.hasOwnProperty("s") && t.hasOwnProperty("l") && (t.s = $(t.s), t.l = $(t.l), i = n(t.h, t.s, t.l), a = !0, s = "hsl"), t.hasOwnProperty("a") && (r = t.a)), r = _(r), {
                ok: a,
                format: t.format || s,
                r: H(255, R(i.r, 0)),
                g: H(255, R(i.g, 0)),
                b: H(255, R(i.b, 0)),
                a: r
            }
        }

        function e(t, e, i) {
            return {
                r: 255 * C(t, 255),
                g: 255 * C(e, 255),
                b: 255 * C(i, 255)
            }
        }

        function i(t, e, i) {
            t = C(t, 255), e = C(e, 255), i = C(i, 255);
            var n, r, o = R(t, e, i),
                a = H(t, e, i),
                s = (o + a) / 2;
            if (o == a) n = r = 0;
            else {
                var l = o - a;
                switch (r = s > .5 ? l / (2 - o - a) : l / (o + a), o) {
                    case t:
                        n = (e - i) / l + (i > e ? 6 : 0);
                        break;
                    case e:
                        n = (i - t) / l + 2;
                        break;
                    case i:
                        n = (t - e) / l + 4
                }
                n /= 6
            }
            return {
                h: n,
                s: r,
                l: s
            }
        }

        function n(t, e, i) {
            function n(t, e, i) {
                return 0 > i && (i += 1), i > 1 && (i -= 1), 1 / 6 > i ? t + 6 * (e - t) * i : .5 > i ? e : 2 / 3 > i ? t + (e - t) * (2 / 3 - i) * 6 : t
            }
            var r, o, a;
            if (t = C(t, 360), e = C(e, 100), i = C(i, 100), 0 === e) r = o = a = i;
            else {
                var s = .5 > i ? i * (1 + e) : i + e - i * e,
                    l = 2 * i - s;
                r = n(l, s, t + 1 / 3), o = n(l, s, t), a = n(l, s, t - 1 / 3)
            }
            return {
                r: 255 * r,
                g: 255 * o,
                b: 255 * a
            }
        }

        function r(t, e, i) {
            t = C(t, 255), e = C(e, 255), i = C(i, 255);
            var n, r, o = R(t, e, i),
                a = H(t, e, i),
                s = o,
                l = o - a;
            if (r = 0 === o ? 0 : l / o, o == a) n = 0;
            else {
                switch (o) {
                    case t:
                        n = (e - i) / l + (i > e ? 6 : 0);
                        break;
                    case e:
                        n = (i - t) / l + 2;
                        break;
                    case i:
                        n = (t - e) / l + 4
                }
                n /= 6
            }
            return {
                h: n,
                s: r,
                v: s
            }
        }

        function o(t, e, i) {
            t = 6 * C(t, 360), e = C(e, 100), i = C(i, 100);
            var n = I.floor(t),
                r = t - n,
                o = i * (1 - e),
                a = i * (1 - r * e),
                s = i * (1 - (1 - r) * e),
                l = n % 6,
                c = [i, a, o, o, s, i][l],
                h = [s, i, i, a, o, o][l],
                u = [o, o, s, i, i, a][l];
            return {
                r: 255 * c,
                g: 255 * h,
                b: 255 * u
            }
        }

        function a(t, e, i, n) {
            var r = [O(F(t).toString(16)), O(F(e).toString(16)), O(F(i).toString(16))];
            return n && r[0].charAt(0) == r[0].charAt(1) && r[1].charAt(0) == r[1].charAt(1) && r[2].charAt(0) == r[2].charAt(1) ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) : r.join("")
        }

        function s(t, e, i, n) {
            var r = [O(D(n)), O(F(t).toString(16)), O(F(e).toString(16)), O(F(i).toString(16))];
            return r.join("")
        }

        function l(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = V(t).toHsl();
            return i.s -= e / 100, i.s = S(i.s), V(i)
        }

        function c(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = V(t).toHsl();
            return i.s += e / 100, i.s = S(i.s), V(i)
        }

        function h(t) {
            return V(t).desaturate(100)
        }

        function u(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = V(t).toHsl();
            return i.l += e / 100, i.l = S(i.l), V(i)
        }

        function f(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = V(t).toRgb();
            return i.r = R(0, H(255, i.r - F(255 * -(e / 100)))), i.g = R(0, H(255, i.g - F(255 * -(e / 100)))), i.b = R(0, H(255, i.b - F(255 * -(e / 100)))), V(i)
        }

        function d(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = V(t).toHsl();
            return i.l -= e / 100, i.l = S(i.l), V(i)
        }

        function p(t, e) {
            var i = V(t).toHsl(),
                n = (F(i.h) + e) % 360;
            return i.h = 0 > n ? 360 + n : n, V(i)
        }

        function g(t) {
            var e = V(t).toHsl();
            return e.h = (e.h + 180) % 360, V(e)
        }

        function v(t) {
            var e = V(t).toHsl(),
                i = e.h;
            return [V(t), V({
                h: (i + 120) % 360,
                s: e.s,
                l: e.l
            }), V({
                h: (i + 240) % 360,
                s: e.s,
                l: e.l
            })]
        }

        function m(t) {
            var e = V(t).toHsl(),
                i = e.h;
            return [V(t), V({
                h: (i + 90) % 360,
                s: e.s,
                l: e.l
            }), V({
                h: (i + 180) % 360,
                s: e.s,
                l: e.l
            }), V({
                h: (i + 270) % 360,
                s: e.s,
                l: e.l
            })]
        }

        function b(t) {
            var e = V(t).toHsl(),
                i = e.h;
            return [V(t), V({
                h: (i + 72) % 360,
                s: e.s,
                l: e.l
            }), V({
                h: (i + 216) % 360,
                s: e.s,
                l: e.l
            })]
        }

        function y(t, e, i) {
            e = e || 6, i = i || 30;
            var n = V(t).toHsl(),
                r = 360 / i,
                o = [V(t)];
            for (n.h = (n.h - (r * e >> 1) + 720) % 360; --e;) n.h = (n.h + r) % 360, o.push(V(n));
            return o
        }

        function x(t, e) {
            e = e || 6;
            for (var i = V(t).toHsv(), n = i.h, r = i.s, o = i.v, a = [], s = 1 / e; e--;) a.push(V({
                h: n,
                s: r,
                v: o
            })), o = (o + s) % 1;
            return a
        }

        function w(t) {
            var e = {};
            for (var i in t) t.hasOwnProperty(i) && (e[t[i]] = i);
            return e
        }

        function _(t) {
            return t = parseFloat(t), (isNaN(t) || 0 > t || t > 1) && (t = 1), t
        }

        function C(t, e) {
            k(t) && (t = "100%");
            var i = T(t);
            return t = H(e, R(0, parseFloat(t))), i && (t = parseInt(t * e, 10) / 100), I.abs(t - e) < 1e-6 ? 1 : t % e / parseFloat(e)
        }

        function S(t) {
            return H(1, R(0, t))
        }

        function A(t) {
            return parseInt(t, 16)
        }

        function k(t) {
            return "string" == typeof t && -1 != t.indexOf(".") && 1 === parseFloat(t)
        }

        function T(t) {
            return "string" == typeof t && -1 != t.indexOf("%")
        }

        function O(t) {
            return 1 == t.length ? "0" + t : "" + t
        }

        function $(t) {
            return 1 >= t && (t = 100 * t + "%"), t
        }

        function D(t) {
            return Math.round(255 * parseFloat(t)).toString(16)
        }

        function M(t) {
            return A(t) / 255
        }

        function E(t) {
            t = t.replace(P, "").replace(j, "").toLowerCase();
            var e = !1;
            if (z[t]) t = z[t], e = !0;
            else if ("transparent" == t) return {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
                format: "name"
            };
            var i;
            return (i = N.rgb.exec(t)) ? {
                r: i[1],
                g: i[2],
                b: i[3]
            } : (i = N.rgba.exec(t)) ? {
                r: i[1],
                g: i[2],
                b: i[3],
                a: i[4]
            } : (i = N.hsl.exec(t)) ? {
                h: i[1],
                s: i[2],
                l: i[3]
            } : (i = N.hsla.exec(t)) ? {
                h: i[1],
                s: i[2],
                l: i[3],
                a: i[4]
            } : (i = N.hsv.exec(t)) ? {
                h: i[1],
                s: i[2],
                v: i[3]
            } : (i = N.hex8.exec(t)) ? {
                a: M(i[1]),
                r: A(i[2]),
                g: A(i[3]),
                b: A(i[4]),
                format: e ? "name" : "hex8"
            } : (i = N.hex6.exec(t)) ? {
                r: A(i[1]),
                g: A(i[2]),
                b: A(i[3]),
                format: e ? "name" : "hex"
            } : (i = N.hex3.exec(t)) ? {
                r: A(i[1] + "" + i[1]),
                g: A(i[2] + "" + i[2]),
                b: A(i[3] + "" + i[3]),
                format: e ? "name" : "hex"
            } : !1
        }
        var P = /^[\s,#]+/,
            j = /\s+$/,
            L = 0,
            I = Math,
            F = I.round,
            H = I.min,
            R = I.max,
            B = I.random,
            V = function X(e, i) {
                if (e = e ? e : "", i = i || {}, e instanceof X) return e;
                if (!(this instanceof X)) return new X(e, i);
                var n = t(e);
                this._r = n.r, this._g = n.g, this._b = n.b, this._a = n.a, this._roundA = F(100 * this._a) / 100, this._format = i.format || n.format, this._gradientType = i.gradientType, this._r < 1 && (this._r = F(this._r)), this._g < 1 && (this._g = F(this._g)), this._b < 1 && (this._b = F(this._b)), this._ok = n.ok, this._tc_id = L++
            };
        V.prototype = {
            isDark: function() {
                return this.getBrightness() < 128
            },
            isLight: function() {
                return !this.isDark()
            },
            isValid: function() {
                return this._ok
            },
            getFormat: function() {
                return this._format
            },
            getAlpha: function() {
                return this._a
            },
            getBrightness: function() {
                var t = this.toRgb();
                return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3
            },
            setAlpha: function(t) {
                return this._a = _(t), this._roundA = F(100 * this._a) / 100, this
            },
            toHsv: function() {
                var t = r(this._r, this._g, this._b);
                return {
                    h: 360 * t.h,
                    s: t.s,
                    v: t.v,
                    a: this._a
                }
            },
            toHsvString: function() {
                var t = r(this._r, this._g, this._b),
                    e = F(360 * t.h),
                    i = F(100 * t.s),
                    n = F(100 * t.v);
                return 1 == this._a ? "hsv(" + e + ", " + i + "%, " + n + "%)" : "hsva(" + e + ", " + i + "%, " + n + "%, " + this._roundA + ")"
            },
            toHsl: function() {
                var t = i(this._r, this._g, this._b);
                return {
                    h: 360 * t.h,
                    s: t.s,
                    l: t.l,
                    a: this._a
                }
            },
            toHslString: function() {
                var t = i(this._r, this._g, this._b),
                    e = F(360 * t.h),
                    n = F(100 * t.s),
                    r = F(100 * t.l);
                return 1 == this._a ? "hsl(" + e + ", " + n + "%, " + r + "%)" : "hsla(" + e + ", " + n + "%, " + r + "%, " + this._roundA + ")"
            },
            toHex: function(t) {
                return a(this._r, this._g, this._b, t)
            },
            toHexString: function(t) {
                return "#" + this.toHex(t)
            },
            toHex8: function() {
                return s(this._r, this._g, this._b, this._a)
            },
            toHex8String: function() {
                return "#" + this.toHex8()
            },
            toRgb: function() {
                return {
                    r: F(this._r),
                    g: F(this._g),
                    b: F(this._b),
                    a: this._a
                }
            },
            toRgbString: function() {
                return 1 == this._a ? "rgb(" + F(this._r) + ", " + F(this._g) + ", " + F(this._b) + ")" : "rgba(" + F(this._r) + ", " + F(this._g) + ", " + F(this._b) + ", " + this._roundA + ")"
            },
            toPercentageRgb: function() {
                return {
                    r: F(100 * C(this._r, 255)) + "%",
                    g: F(100 * C(this._g, 255)) + "%",
                    b: F(100 * C(this._b, 255)) + "%",
                    a: this._a
                }
            },
            toPercentageRgbString: function() {
                return 1 == this._a ? "rgb(" + F(100 * C(this._r, 255)) + "%, " + F(100 * C(this._g, 255)) + "%, " + F(100 * C(this._b, 255)) + "%)" : "rgba(" + F(100 * C(this._r, 255)) + "%, " + F(100 * C(this._g, 255)) + "%, " + F(100 * C(this._b, 255)) + "%, " + this._roundA + ")"
            },
            toName: function() {
                return 0 === this._a ? "transparent" : this._a < 1 ? !1 : W[a(this._r, this._g, this._b, !0)] || !1
            },
            toFilter: function(t) {
                var e = "#" + s(this._r, this._g, this._b, this._a),
                    i = e,
                    n = this._gradientType ? "GradientType = 1, " : "";
                if (t) {
                    var r = V(t);
                    i = r.toHex8String()
                }
                return "progid:DXImageTransform.Microsoft.gradient(" + n + "startColorstr=" + e + ",endColorstr=" + i + ")"
            },
            toString: function(t) {
                var e = !!t;
                t = t || this._format;
                var i = !1,
                    n = this._a < 1 && this._a >= 0,
                    r = !e && n && ("hex" === t || "hex6" === t || "hex3" === t || "name" === t);
                return r ? "name" === t && 0 === this._a ? this.toName() : this.toRgbString() : ("rgb" === t && (i = this.toRgbString()), "prgb" === t && (i = this.toPercentageRgbString()), ("hex" === t || "hex6" === t) && (i = this.toHexString()), "hex3" === t && (i = this.toHexString(!0)), "hex8" === t && (i = this.toHex8String()), "name" === t && (i = this.toName()), "hsl" === t && (i = this.toHslString()), "hsv" === t && (i = this.toHsvString()), i || this.toHexString())
            },
            _applyModification: function(t, e) {
                var i = t.apply(null, [this].concat([].slice.call(e)));
                return this._r = i._r, this._g = i._g, this._b = i._b, this.setAlpha(i._a), this
            },
            lighten: function() {
                return this._applyModification(u, arguments)
            },
            brighten: function() {
                return this._applyModification(f, arguments)
            },
            darken: function() {
                return this._applyModification(d, arguments)
            },
            desaturate: function() {
                return this._applyModification(l, arguments)
            },
            saturate: function() {
                return this._applyModification(c, arguments)
            },
            greyscale: function() {
                return this._applyModification(h, arguments)
            },
            spin: function() {
                return this._applyModification(p, arguments)
            },
            _applyCombination: function(t, e) {
                return t.apply(null, [this].concat([].slice.call(e)))
            },
            analogous: function() {
                return this._applyCombination(y, arguments)
            },
            complement: function() {
                return this._applyCombination(g, arguments)
            },
            monochromatic: function() {
                return this._applyCombination(x, arguments)
            },
            splitcomplement: function() {
                return this._applyCombination(b, arguments)
            },
            triad: function() {
                return this._applyCombination(v, arguments)
            },
            tetrad: function() {
                return this._applyCombination(m, arguments)
            }
        }, V.fromRatio = function(t, e) {
            if ("object" == typeof t) {
                var i = {};
                for (var n in t) t.hasOwnProperty(n) && (i[n] = "a" === n ? t[n] : $(t[n]));
                t = i
            }
            return V(t, e)
        }, V.equals = function(t, e) {
            return t && e ? V(t).toRgbString() == V(e).toRgbString() : !1
        }, V.random = function() {
            return V.fromRatio({
                r: B(),
                g: B(),
                b: B()
            })
        }, V.mix = function(t, e, i) {
            i = 0 === i ? 0 : i || 50;
            var n, r = V(t).toRgb(),
                o = V(e).toRgb(),
                a = i / 100,
                s = 2 * a - 1,
                l = o.a - r.a;
            n = s * l == -1 ? s : (s + l) / (1 + s * l), n = (n + 1) / 2;
            var c = 1 - n,
                h = {
                    r: o.r * n + r.r * c,
                    g: o.g * n + r.g * c,
                    b: o.b * n + r.b * c,
                    a: o.a * a + r.a * (1 - a)
                };
            return V(h)
        }, V.readability = function(t, e) {
            var i = V(t),
                n = V(e),
                r = i.toRgb(),
                o = n.toRgb(),
                a = i.getBrightness(),
                s = n.getBrightness(),
                l = Math.max(r.r, o.r) - Math.min(r.r, o.r) + Math.max(r.g, o.g) - Math.min(r.g, o.g) + Math.max(r.b, o.b) - Math.min(r.b, o.b);
            return {
                brightness: Math.abs(a - s),
                color: l
            }
        }, V.isReadable = function(t, e) {
            var i = V.readability(t, e);
            return i.brightness > 125 && i.color > 500
        }, V.mostReadable = function(t, e) {
            for (var i = null, n = 0, r = !1, o = 0; o < e.length; o++) {
                var a = V.readability(t, e[o]),
                    s = a.brightness > 125 && a.color > 500,
                    l = 3 * (a.brightness / 125) + a.color / 500;
                (s && !r || s && r && l > n || !s && !r && l > n) && (r = s, n = l, i = V(e[o]))
            }
            return i
        };
        var z = V.names = {
                aliceblue: "f0f8ff",
                antiquewhite: "faebd7",
                aqua: "0ff",
                aquamarine: "7fffd4",
                azure: "f0ffff",
                beige: "f5f5dc",
                bisque: "ffe4c4",
                black: "000",
                blanchedalmond: "ffebcd",
                blue: "00f",
                blueviolet: "8a2be2",
                brown: "a52a2a",
                burlywood: "deb887",
                burntsienna: "ea7e5d",
                cadetblue: "5f9ea0",
                chartreuse: "7fff00",
                chocolate: "d2691e",
                coral: "ff7f50",
                cornflowerblue: "6495ed",
                cornsilk: "fff8dc",
                crimson: "dc143c",
                cyan: "0ff",
                darkblue: "00008b",
                darkcyan: "008b8b",
                darkgoldenrod: "b8860b",
                darkgray: "a9a9a9",
                darkgreen: "006400",
                darkgrey: "a9a9a9",
                darkkhaki: "bdb76b",
                darkmagenta: "8b008b",
                darkolivegreen: "556b2f",
                darkorange: "ff8c00",
                darkorchid: "9932cc",
                darkred: "8b0000",
                darksalmon: "e9967a",
                darkseagreen: "8fbc8f",
                darkslateblue: "483d8b",
                darkslategray: "2f4f4f",
                darkslategrey: "2f4f4f",
                darkturquoise: "00ced1",
                darkviolet: "9400d3",
                deeppink: "ff1493",
                deepskyblue: "00bfff",
                dimgray: "696969",
                dimgrey: "696969",
                dodgerblue: "1e90ff",
                firebrick: "b22222",
                floralwhite: "fffaf0",
                forestgreen: "228b22",
                fuchsia: "f0f",
                gainsboro: "dcdcdc",
                ghostwhite: "f8f8ff",
                gold: "ffd700",
                goldenrod: "daa520",
                gray: "808080",
                green: "008000",
                greenyellow: "adff2f",
                grey: "808080",
                honeydew: "f0fff0",
                hotpink: "ff69b4",
                indianred: "cd5c5c",
                indigo: "4b0082",
                ivory: "fffff0",
                khaki: "f0e68c",
                lavender: "e6e6fa",
                lavenderblush: "fff0f5",
                lawngreen: "7cfc00",
                lemonchiffon: "fffacd",
                lightblue: "add8e6",
                lightcoral: "f08080",
                lightcyan: "e0ffff",
                lightgoldenrodyellow: "fafad2",
                lightgray: "d3d3d3",
                lightgreen: "90ee90",
                lightgrey: "d3d3d3",
                lightpink: "ffb6c1",
                lightsalmon: "ffa07a",
                lightseagreen: "20b2aa",
                lightskyblue: "87cefa",
                lightslategray: "789",
                lightslategrey: "789",
                lightsteelblue: "b0c4de",
                lightyellow: "ffffe0",
                lime: "0f0",
                limegreen: "32cd32",
                linen: "faf0e6",
                magenta: "f0f",
                maroon: "800000",
                mediumaquamarine: "66cdaa",
                mediumblue: "0000cd",
                mediumorchid: "ba55d3",
                mediumpurple: "9370db",
                mediumseagreen: "3cb371",
                mediumslateblue: "7b68ee",
                mediumspringgreen: "00fa9a",
                mediumturquoise: "48d1cc",
                mediumvioletred: "c71585",
                midnightblue: "191970",
                mintcream: "f5fffa",
                mistyrose: "ffe4e1",
                moccasin: "ffe4b5",
                navajowhite: "ffdead",
                navy: "000080",
                oldlace: "fdf5e6",
                olive: "808000",
                olivedrab: "6b8e23",
                orange: "ffa500",
                orangered: "ff4500",
                orchid: "da70d6",
                palegoldenrod: "eee8aa",
                palegreen: "98fb98",
                paleturquoise: "afeeee",
                palevioletred: "db7093",
                papayawhip: "ffefd5",
                peachpuff: "ffdab9",
                peru: "cd853f",
                pink: "ffc0cb",
                plum: "dda0dd",
                powderblue: "b0e0e6",
                purple: "800080",
                red: "f00",
                rosybrown: "bc8f8f",
                royalblue: "4169e1",
                saddlebrown: "8b4513",
                salmon: "fa8072",
                sandybrown: "f4a460",
                seagreen: "2e8b57",
                seashell: "fff5ee",
                sienna: "a0522d",
                silver: "c0c0c0",
                skyblue: "87ceeb",
                slateblue: "6a5acd",
                slategray: "708090",
                slategrey: "708090",
                snow: "fffafa",
                springgreen: "00ff7f",
                steelblue: "4682b4",
                tan: "d2b48c",
                teal: "008080",
                thistle: "d8bfd8",
                tomato: "ff6347",
                turquoise: "40e0d0",
                violet: "ee82ee",
                wheat: "f5deb3",
                white: "fff",
                whitesmoke: "f5f5f5",
                yellow: "ff0",
                yellowgreen: "9acd32"
            },
            W = V.hexNames = w(z),
            N = function() {
                var t = "[-\\+]?\\d+%?",
                    e = "[-\\+]?\\d*\\.\\d+%?",
                    i = "(?:" + e + ")|(?:" + t + ")",
                    n = "[\\s|\\(]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")\\s*\\)?",
                    r = "[\\s|\\(]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")\\s*\\)?";
                return {
                    rgb: new RegExp("rgb" + n),
                    rgba: new RegExp("rgba" + r),
                    hsl: new RegExp("hsl" + n),
                    hsla: new RegExp("hsla" + r),
                    hsv: new RegExp("hsv" + n),
                    hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                    hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                    hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
                }
            }();
        "undefined" != typeof module && module.exports ? module.exports = V : "function" == typeof define && define.amd ? define(function() {
            return V
        }) : window.tinycolor = V
    }(),
    function(t) {
        t.fn.confirm = function(e) {
            return "undefined" == typeof e && (e = {}), this.click(function(i) {
                i.preventDefault();
                var n = t.extend({
                    button: t(this)
                }, e);
                t.confirm(n, i)
            }), this
        }, t.confirm = function(e, i) {
            if (!(t(".confirmation-modal").length > 0)) {
                var n = {};
                if (e.button) {
                    var r = {
                        title: "title",
                        text: "text",
                        "confirm-button": "confirmButton",
                        "cancel-button": "cancelButton",
                        "confirm-button-class": "confirmButtonClass"
                    };
                    t.each(r, function(t, i) {
                        var r = e.button.data(t);
                        r && (n[i] = r)
                    })
                }
                var o = t.extend({}, t.confirm.options, {
                        confirm: function() {
                            var n = i && ("string" == typeof i && i || i.currentTarget && i.currentTarget.attributes.href.value);
                            if (n)
                                if (e.post) {
                                    var r = t('<form method="post" class="hide" action="' + n + '"></form>');
                                    t("body").append(r), r.submit()
                                } else window.location = n
                        },
                        cancel: function() {},
                        button: null
                    }, n, e),
                    a = "";
                "" !== o.title && (a = '<div class=modal-header><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + o.title + "</h4></div>");
                var s = '<div class="confirmation-modal modal fade" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content">' + a + '<div class="modal-body">' + o.text + '</div><div class="modal-footer"><button class="confirm btn ' + o.confirmButtonClass + '" type="button" data-dismiss="modal">' + o.confirmButton + '</button><button class="cancel btn btn-default" type="button" data-dismiss="modal">' + o.cancelButton + "</button></div></div></div></div>",
                    l = t(s);
                l.on("shown.bs.modal", function() {
                    l.find(".btn-primary:first").focus()
                }), l.on("hidden.bs.modal", function() {
                    l.remove()
                }), l.find(".confirm").click(function() {
                    o.confirm(o.button)
                }), l.find(".cancel").click(function() {
                    o.cancel(o.button)
                }), t("body").append(l), l.modal("show")
            }
        }, t.confirm.options = {
            text: "Are you sure?",
            title: "",
            confirmButton: "Yes",
            cancelButton: "Cancel",
            post: !1,
            confirmButtonClass: "btn-primary"
        }
    }(jQuery),
    function(t) {
        "use strict";
        var e = t.module("angularSpectrumColorpicker", []);
        ! function() {
            e.directive("spectrumColorpicker", function() {
                return {
                    restrict: "E",
                    require: "ngModel",
                    scope: {
                        fallbackValue: "=",
                        disabled: "=?",
                        format: "=?",
                        options: "=?",
                        triggerId: "@?",
                        onChange: "&?",
                        onShow: "&?",
                        onHide: "&?",
                        onMove: "&?",
                        onBeforeShow: "&?"
                    },
                    replace: !0,
                    templateUrl: "directive.html",
                    link: function(e, i, n, r) {
                        function o(t) {
                            var i = t;
                            return i && (i = t.toString(e.format)), i
                        }

                        function a(i) {
                            t.isFunction(e.onChange) && e.onChange({
                                color: i
                            })
                        }

                        function s(i) {
                            var n = e.fallbackValue;
                            i ? n = o(i) : t.isUndefined(e.fallbackValue) && (n = i), r.$setViewValue(n), a(n)
                        }
                        var l = i.find("input"),
                            c = function(t) {
                                e.$apply(function() {
                                    s(t)
                                })
                            },
                            h = function() {
                                return l.spectrum("toggle"), !1
                            },
                            u = {
                                color: r.$viewValue
                            },
                            f = {};
                        t.forEach({
                            change: "onChange",
                            move: "onMove",
                            hide: "onHide",
                            show: "onShow"
                        }, function(i, n) {
                            f[n] = function(n) {
                                return c(n), "change" !== i && t.isFunction(e[i]) ? e[i]({
                                    color: o(n)
                                }) : void 0
                            }
                        }), t.isFunction(e.onBeforeShow) && (f.beforeShow = function(t) {
                            return e.onBeforeShow({
                                color: o(t)
                            })
                        });
                        var d = t.extend({}, u, e.options, f);
                        e.triggerId && t.element(document.body).on("click", "#" + e.triggerId, h), r.$render = function() {
                            l.spectrum("set", r.$viewValue || ""), a(r.$viewValue)
                        }, d.color && (l.spectrum("set", d.color || ""), s(d.color)), l.spectrum(d), e.$on("$destroy", function() {
                            e.triggerId && t.element(document.body).off("click", "#" + e.triggerId, h), l.spectrum("destroy")
                        }), t.isDefined(d.disabled) && (e.disabled = !!d.disabled), e.$watch("disabled", function(t) {
                            l.spectrum(t ? "disable" : "enable")
                        })
                    }
                }
            })
        }(), t.module("angularSpectrumColorpicker").run(["$templateCache", function(t) {
            t.put("directive.html", "<span><input class=input-small></span>")
        }])
    }(window.angular),
    function() {
        "use strict";
        angular.module("rn-lazy", []).directive("rnLazyBackground", ["$document", "$parse", function(t, e) {
            return {
                restrict: "A",
                link: function(i, n, r) {
                    function o(t) {
                        a && (t.html(""), t.append(a), t.css({
                            "background-image": null
                        }))
                    }
                    var a = null;
                    angular.isDefined(r.rnLazyLoader) && (a = angular.element(t[0].querySelector(r.rnLazyLoader)).clone());
                    var s = e(r.rnLazyBackground);
                    i.$watch(s, function() {
                        o(n);
                        var e = s(i),
                            l = t[0].createElement("img");
                        l.onload = function() {
                            a && a.remove(), angular.isDefined(r.rnLazyLoadingClass) && n.removeClass(r.rnLazyLoadingClass), angular.isDefined(r.rnLazyLoadedClass) && n.addClass(r.rnLazyLoadedClass), n.css({
                                "background-image": "url(" + this.src + ")"
                            })
                        }, l.onerror = function() {}, l.src = e
                    })
                }
            }
        }])
    }(),
    function(t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
    }(function(t) {
        "use strict";
        var e = {},
            i = Math.max,
            n = Math.min;
        e.c = {}, e.c.d = t(document), e.c.t = function(t) {
            return t.originalEvent.touches.length - 1
        }, e.o = function() {
            var i = this;
            this.o = null, this.$ = null, this.i = null, this.g = null, this.v = null, this.cv = null, this.x = 0, this.y = 0, this.w = 0, this.h = 0, this.$c = null, this.c = null, this.t = 0, this.isInit = !1, this.fgColor = null, this.pColor = null, this.dH = null, this.cH = null, this.eH = null, this.rH = null, this.scale = 1, this.relative = !1, this.relativeWidth = !1, this.relativeHeight = !1, this.$div = null, this.run = function() {
                var e = function(t, e) {
                    var n;
                    for (n in e) i.o[n] = e[n];
                    i._carve().init(), i._configure()._draw()
                };
                if (!this.$.data("kontroled")) {
                    if (this.$.data("kontroled", !0), this.extend(), this.o = t.extend({
                            min: void 0 !== this.$.data("min") ? this.$.data("min") : 0,
                            max: void 0 !== this.$.data("max") ? this.$.data("max") : 100,
                            stopper: !0,
                            readOnly: this.$.data("readonly") || "readonly" === this.$.attr("readonly"),
                            cursor: this.$.data("cursor") === !0 && 30 || this.$.data("cursor") || 0,
                            thickness: this.$.data("thickness") && Math.max(Math.min(this.$.data("thickness"), 1), .01) || .35,
                            lineCap: this.$.data("linecap") || "butt",
                            width: this.$.data("width") || 200,
                            height: this.$.data("height") || 200,
                            displayInput: null == this.$.data("displayinput") || this.$.data("displayinput"),
                            displayPrevious: this.$.data("displayprevious"),
                            fgColor: this.$.data("fgcolor") || "#87CEEB",
                            inputColor: this.$.data("inputcolor"),
                            font: this.$.data("font") || "Arial",
                            fontWeight: this.$.data("font-weight") || "bold",
                            inline: !1,
                            step: this.$.data("step") || 1,
                            rotation: this.$.data("rotation"),
                            draw: null,
                            change: null,
                            cancel: null,
                            release: null,
                            format: function(t) {
                                return t
                            },
                            parse: function(t) {
                                return parseFloat(t)
                            }
                        }, this.o), this.o.flip = "anticlockwise" === this.o.rotation || "acw" === this.o.rotation, this.o.inputColor || (this.o.inputColor = this.o.fgColor), this.$.is("fieldset") ? (this.v = {}, this.i = this.$.find("input"), this.i.each(function(e) {
                            var n = t(this);
                            i.i[e] = n, i.v[e] = i.o.parse(n.val()), n.bind("change blur", function() {
                                var t = {};
                                t[e] = n.val(), i.val(i._validate(t))
                            })
                        }), this.$.find("legend").remove()) : (this.i = this.$, this.v = this.o.parse(this.$.val()), "" === this.v && (this.v = this.o.min), this.$.bind("change blur", function() {
                            i.val(i._validate(i.o.parse(i.$.val())))
                        })), !this.o.displayInput && this.$.hide(), this.$c = t(document.createElement("canvas")).attr({
                            width: this.o.width,
                            height: this.o.height
                        }), this.$div = t('<div style="' + (this.o.inline ? "display:inline;" : "") + "width:" + this.o.width + "px;height:" + this.o.height + 'px;"></div>'), this.$.wrap(this.$div).before(this.$c), this.$div = this.$.parent(), "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(this.$c[0]), this.c = this.$c[0].getContext ? this.$c[0].getContext("2d") : null, !this.c) throw {
                        name: "CanvasNotSupportedException",
                        message: "Canvas not supported. Please use excanvas on IE8.0.",
                        toString: function() {
                            return this.name + ": " + this.message
                        }
                    };
                    return this.scale = (window.devicePixelRatio || 1) / (this.c.webkitBackingStorePixelRatio || this.c.mozBackingStorePixelRatio || this.c.msBackingStorePixelRatio || this.c.oBackingStorePixelRatio || this.c.backingStorePixelRatio || 1), this.relativeWidth = this.o.width % 1 !== 0 && this.o.width.indexOf("%"), this.relativeHeight = this.o.height % 1 !== 0 && this.o.height.indexOf("%"), this.relative = this.relativeWidth || this.relativeHeight, this._carve(), this.v instanceof Object ? (this.cv = {}, this.copy(this.v, this.cv)) : this.cv = this.v, this.$.bind("configure", e).parent().bind("configure", e), this._listen()._configure()._xy().init(), this.isInit = !0, this.$.val(this.o.format(this.v)), this._draw(), this
                }
            }, this._carve = function() {
                if (this.relative) {
                    var t = this.relativeWidth ? this.$div.parent().width() * parseInt(this.o.width) / 100 : this.$div.parent().width(),
                        e = this.relativeHeight ? this.$div.parent().height() * parseInt(this.o.height) / 100 : this.$div.parent().height();
                    this.w = this.h = Math.min(t, e)
                } else this.w = this.o.width, this.h = this.o.height;
                return this.$div.css({
                    width: this.w + "px",
                    height: this.h + "px"
                }), this.$c.attr({
                    width: this.w,
                    height: this.h
                }), 1 !== this.scale && (this.$c[0].width = this.$c[0].width * this.scale, this.$c[0].height = this.$c[0].height * this.scale, this.$c.width(this.w), this.$c.height(this.h)), this
            }, this._draw = function() {
                var t = !0;
                i.g = i.c, i.clear(), i.dH && (t = i.dH()), t !== !1 && i.draw()
            }, this._touch = function(t) {
                var n = function(t) {
                    var e = i.xy2val(t.originalEvent.touches[i.t].pageX, t.originalEvent.touches[i.t].pageY);
                    e != i.cv && (i.cH && i.cH(e) === !1 || (i.change(i._validate(e)), i._draw()))
                };
                return this.t = e.c.t(t), n(t), e.c.d.bind("touchmove.k", n).bind("touchend.k", function() {
                    e.c.d.unbind("touchmove.k touchend.k"), i.val(i.cv)
                }), this
            }, this._mouse = function(t) {
                var n = function(t) {
                    var e = i.xy2val(t.pageX, t.pageY);
                    e != i.cv && (i.cH && i.cH(e) === !1 || (i.change(i._validate(e)), i._draw()))
                };
                return n(t), e.c.d.bind("mousemove.k", n).bind("keyup.k", function(t) {
                    if (27 === t.keyCode) {
                        if (e.c.d.unbind("mouseup.k mousemove.k keyup.k"), i.eH && i.eH() === !1) return;
                        i.cancel()
                    }
                }).bind("mouseup.k", function() {
                    e.c.d.unbind("mousemove.k mouseup.k keyup.k"), i.val(i.cv)
                }), this
            }, this._xy = function() {
                var t = this.$c.offset();
                return this.x = t.left, this.y = t.top, this
            }, this._listen = function() {
                return this.o.readOnly ? this.$.attr("readonly", "readonly") : (this.$c.bind("mousedown", function(t) {
                    t.preventDefault(), i._xy()._mouse(t)
                }).bind("touchstart", function(t) {
                    t.preventDefault(), i._xy()._touch(t)
                }), this.listen()), this.relative && t(window).resize(function() {
                    i._carve().init(), i._draw()
                }), this
            }, this._configure = function() {
                return this.o.draw && (this.dH = this.o.draw), this.o.change && (this.cH = this.o.change), this.o.cancel && (this.eH = this.o.cancel), this.o.release && (this.rH = this.o.release), this.o.displayPrevious ? (this.pColor = this.h2rgba(this.o.fgColor, "0.4"), this.fgColor = this.h2rgba(this.o.fgColor, "0.6")) : this.fgColor = this.o.fgColor, this
            }, this._clear = function() {
                this.$c[0].width = this.$c[0].width
            }, this._validate = function(t) {
                var e = ~~((0 > t ? -.5 : .5) + t / this.o.step) * this.o.step;
                return Math.round(100 * e) / 100
            }, this.listen = function() {}, this.extend = function() {}, this.init = function() {}, this.change = function() {}, this.val = function() {}, this.xy2val = function() {}, this.draw = function() {}, this.clear = function() {
                this._clear()
            }, this.h2rgba = function(t, e) {
                var i;
                return t = t.substring(1, 7), i = [parseInt(t.substring(0, 2), 16), parseInt(t.substring(2, 4), 16), parseInt(t.substring(4, 6), 16)], "rgba(" + i[0] + "," + i[1] + "," + i[2] + "," + e + ")"
            }, this.copy = function(t, e) {
                for (var i in t) e[i] = t[i]
            }
        }, e.Dial = function() {
            e.o.call(this), this.startAngle = null, this.xy = null, this.radius = null, this.lineWidth = null, this.cursorExt = null, this.w2 = null, this.PI2 = 2 * Math.PI, this.extend = function() {
                this.o = t.extend({
                    bgColor: this.$.data("bgcolor") || "#EEEEEE",
                    angleOffset: this.$.data("angleoffset") || 0,
                    angleArc: this.$.data("anglearc") || 360,
                    inline: !0
                }, this.o)
            }, this.val = function(t, e) {
                return null == t ? this.v : (t = this.o.parse(t), void(e !== !1 && t != this.v && this.rH && this.rH(t) === !1 || (this.cv = this.o.stopper ? i(n(t, this.o.max), this.o.min) : t, this.v = this.cv, this.$.val(this.o.format(this.v)), this._draw())))
            }, this.xy2val = function(t, e) {
                var r, o;
                return r = Math.atan2(t - (this.x + this.w2), -(e - this.y - this.w2)) - this.angleOffset, this.o.flip && (r = this.angleArc - r - this.PI2), this.angleArc != this.PI2 && 0 > r && r > -.5 ? r = 0 : 0 > r && (r += this.PI2), o = r * (this.o.max - this.o.min) / this.angleArc + this.o.min, this.o.stopper && (o = i(n(o, this.o.max), this.o.min)), o
            }, this.listen = function() {
                var e, r, o, a, s = this,
                    l = function(t) {
                        t.preventDefault();
                        var o = t.originalEvent,
                            a = o.detail || o.wheelDeltaX,
                            l = o.detail || o.wheelDeltaY,
                            c = s._validate(s.o.parse(s.$.val())) + (a > 0 || l > 0 ? s.o.step : 0 > a || 0 > l ? -s.o.step : 0);
                        c = i(n(c, s.o.max), s.o.min), s.val(c, !1), s.rH && (clearTimeout(e), e = setTimeout(function() {
                            s.rH(c), e = null
                        }, 100), r || (r = setTimeout(function() {
                            e && s.rH(c), r = null
                        }, 200)))
                    },
                    c = 1,
                    h = {
                        37: -s.o.step,
                        38: s.o.step,
                        39: s.o.step,
                        40: -s.o.step
                    };
                this.$.bind("keydown", function(e) {
                    var r = e.keyCode;
                    if (r >= 96 && 105 >= r && (r = e.keyCode = r - 48), o = parseInt(String.fromCharCode(r)), isNaN(o) && (13 !== r && 8 !== r && 9 !== r && 189 !== r && (190 !== r || s.$.val().match(/\./)) && e.preventDefault(), t.inArray(r, [37, 38, 39, 40]) > -1)) {
                        e.preventDefault();
                        var l = s.o.parse(s.$.val()) + h[r] * c;
                        s.o.stopper && (l = i(n(l, s.o.max), s.o.min)), s.change(s._validate(l)), s._draw(), a = window.setTimeout(function() {
                            c *= 2
                        }, 30)
                    }
                }).bind("keyup", function() {
                    isNaN(o) ? a && (window.clearTimeout(a), a = null, c = 1, s.val(s.$.val())) : s.$.val() > s.o.max && s.$.val(s.o.max) || s.$.val() < s.o.min && s.$.val(s.o.min)
                }), this.$c.bind("mousewheel DOMMouseScroll", l), this.$.bind("mousewheel DOMMouseScroll", l)
            }, this.init = function() {
                (this.v < this.o.min || this.v > this.o.max) && (this.v = this.o.min), this.$.val(this.v), this.w2 = this.w / 2, this.cursorExt = this.o.cursor / 100, this.xy = this.w2 * this.scale, this.lineWidth = this.xy * this.o.thickness, this.lineCap = this.o.lineCap, this.radius = this.xy - this.lineWidth / 2, this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset), this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc), this.angleOffset = this.o.angleOffset * Math.PI / 180, this.angleArc = this.o.angleArc * Math.PI / 180, this.startAngle = 1.5 * Math.PI + this.angleOffset, this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;
                var t = i(String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;
                this.o.displayInput && this.i.css({
                    width: (this.w / 2 + 4 >> 0) + "px",
                    height: (this.w / 3 >> 0) + "px",
                    position: "absolute",
                    "vertical-align": "middle",
                    "margin-top": (this.w / 3 >> 0) + "px",
                    "margin-left": "-" + (3 * this.w / 4 + 2 >> 0) + "px",
                    border: 0,
                    background: "none",
                    font: this.o.fontWeight + " " + (this.w / t >> 0) + "px " + this.o.font,
                    "text-align": "center",
                    color: this.o.inputColor || this.o.fgColor,
                    padding: "0px",
                    "-webkit-appearance": "none"
                }) || this.i.css({
                    width: "0px",
                    visibility: "hidden"
                })
            }, this.change = function(t) {
                this.cv = t, this.$.val(this.o.format(t))
            }, this.angle = function(t) {
                return (t - this.o.min) * this.angleArc / (this.o.max - this.o.min)
            }, this.arc = function(t) {
                var e, i;
                return t = this.angle(t), this.o.flip ? (e = this.endAngle + 1e-5, i = e - t - 1e-5) : (e = this.startAngle - 1e-5, i = e + t + 1e-5), this.o.cursor && (e = i - this.cursorExt) && (i += this.cursorExt), {
                    s: e,
                    e: i,
                    d: this.o.flip && !this.o.cursor
                }
            }, this.draw = function() {
                var t, e = this.g,
                    i = this.arc(this.cv),
                    n = 1;
                e.lineWidth = this.lineWidth, e.lineCap = this.lineCap, "none" !== this.o.bgColor && (e.beginPath(), e.strokeStyle = this.o.bgColor, e.arc(this.xy, this.xy, this.radius, this.endAngle - 1e-5, this.startAngle + 1e-5, !0), e.stroke()), this.o.displayPrevious && (t = this.arc(this.v), e.beginPath(), e.strokeStyle = this.pColor, e.arc(this.xy, this.xy, this.radius, t.s, t.e, t.d), e.stroke(), n = this.cv == this.v), e.beginPath(), e.strokeStyle = n ? this.o.fgColor : this.fgColor, e.arc(this.xy, this.xy, this.radius, i.s, i.e, i.d), e.stroke()
            }, this.cancel = function() {
                this.val(this.v)
            }
        }, t.fn.dial = t.fn.knob = function(i) {
            return this.each(function() {
                var n = new e.Dial;
                n.o = i, n.$ = t(this), n.run()
            }).parent()
        }
    }), angular.module("ui.knob", []).directive("knob", ["$timeout", function(t) {
        return {
            restrict: "EA",
            replace: !0,
            template: '<input value="{{ knobData }}"/>',
            reuire: "knobData",
            scope: {
                knobData: "=",
                knobOptions: "&"
            },
            link: function(e, i) {
                var n = e.knobOptions() || {};
                n.release = function(i) {
                    t(function() {
                        e.knobData = i, e.$apply()
                    })
                }, e.$watch("knobData", function(t, e) {
                    t != e && $(i).val(t).change()
                }), $(i).val(e.knobData).knob(n)
            }
        }
    }]), ! function(t) {
        var e = function(e, i) {
            this.options = i, this.$element = t(e).delegate('[data-dismiss="modal-popup"]', "click.dismiss.modal-popup", t.proxy(this.hide, this)), this.options.remote && this.$element.find(".popover-content").load(this.options.remote), this.$parent = i.$parent
        };
        e.prototype = t.extend({}, t.fn.modal.Constructor.prototype, {
            constructor: e,
            getPosition: function() {
                var e = this.$parent;
                return t.extend({}, e.offset(), {
                    width: e[0].offsetWidth,
                    height: e[0].offsetHeight
                })
            },
            show: function() {
                var e = this.$element;
                e.css({
                    top: 0,
                    left: 0,
                    display: "block",
                    "z-index": 1050
                });
                var i, n = "function" == typeof this.options.placement ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement,
                    r = this.getPosition(),
                    o = e[0].offsetWidth,
                    a = e[0].offsetHeight;
                switch (n) {
                    case "bottom":
                        i = {
                            top: r.top + r.height,
                            left: r.left + r.width / 2 - o / 2
                        };
                        break;
                    case "top":
                        i = {
                            top: r.top - a,
                            left: r.left + r.width / 2 - o / 2
                        };
                        break;
                    case "left":
                        i = {
                            top: r.top + r.height / 2 - a / 2,
                            left: r.left - o
                        };
                        break;
                    case "right":
                        i = {
                            top: r.top + r.height / 2 - a / 2,
                            left: r.left + r.width
                        }
                }
                e.css(i).addClass(n).addClass("in"), t.fn.modal.Constructor.prototype.show.call(this, arguments)
            },
            backdrop: function(e) {
                var i = this.$element.hasClass("fade") ? "fade" : "";
                if (this.isShown && this.options.backdrop) {
                    var n = t.support.transition && i;
                    this.$backdrop = t('<div class="modal-backdrop ' + i + '" style="background:none" />').appendTo(document.body), "static" != this.options.backdrop && this.$backdrop.click(t.proxy(this.hide, this)), n && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), n ? this.$backdrop.one(t.support.transition.end, e) : e()
                } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(t.support.transition.end, t.proxy(this.removeBackdrop, this)) : this.removeBackdrop()) : e && e()
            }
        }), t.fn.modalPopover = function(i) {
            return this.each(function() {
                var n = t(this),
                    r = n.data("modal-popover"),
                    o = t.extend({}, t.fn.modalPopover.defaults, n.data(), "object" == typeof i && i);
                o.$parent = r && r.$parent || i.$parent || t(o.target), r || n.data("modal-popover", r = new e(this, o)), "string" == typeof i && r[i]()
            })
        }, t.fn.modalPopover.Constructor = e, t.fn.modalPopover.defaults = t.extend({}, t.fn.modal.defaults, {
            placement: "right",
            keyboard: !0
        }), t(function() {
            t("body").on("click.modal-popover.data-api", '[data-toggle="modal-popover"]', function(e) {
                var i = t(this),
                    n = i.attr("href"),
                    r = t(i.attr("data-target") || n && n.replace(/.*(?=#[^\s]+$)/, "")),
                    o = r.data("modal-popover") ? "toggle" : t.extend({
                        remote: !/#/.test(n) && n
                    }, r.data(), i.data());
                o.$parent = i, e.preventDefault(), r.modalPopover(o).modalPopover("show").one("hide", function() {
                    i.focus()
                })
            })
        })
    }(window.jQuery), angular.module("gettext", []), angular.module("gettext").constant("gettext", function(t) {
        return t
    }), angular.module("gettext").factory("gettextCatalog", ["gettextPlurals", "$http", "$cacheFactory", "$interpolate", "$rootScope", function(t, e, i, n, r) {
        function o() {
            r.$broadcast("gettextLanguageChanged")
        }
        var a, s = "$$noContext",
            l = "<span>test</span>",
            c = angular.element("<span>" + l + "</span>").html() !== l,
            h = function(t) {
                return a.debug && a.currentLanguage !== a.baseLanguage ? a.debugPrefix + t : t
            },
            u = function(t) {
                return a.showTranslatedMarkers ? a.translatedMarkerPrefix + t + a.translatedMarkerSuffix : t
            };
        return a = {
            debug: !1,
            debugPrefix: "[MISSING]: ",
            showTranslatedMarkers: !1,
            translatedMarkerPrefix: "[",
            translatedMarkerSuffix: "]",
            strings: {},
            baseLanguage: "en",
            currentLanguage: "en",
            cache: i("strings"),
            setCurrentLanguage: function(t) {
                this.currentLanguage = t, o()
            },
            setStrings: function(t, e) {
                this.strings[t] || (this.strings[t] = {});
                for (var i in e) {
                    var n = e[i];
                    if (c && (i = angular.element("<span>" + i + "</span>").html()), angular.isString(n) || angular.isArray(n)) {
                        var r = {};
                        r[s] = n, n = r
                    }
                    for (var a in n) {
                        var l = n[a];
                        n[a] = angular.isArray(l) ? l : [l]
                    }
                    this.strings[t][i] = n
                }
                o()
            },
            getStringForm: function(t, e, i) {
                var n = this.strings[this.currentLanguage] || {},
                    r = n[t] || {},
                    o = r[i || s] || [];
                return o[e]
            },
            getString: function(t, e, i) {
                return t = this.getStringForm(t, 0, i) || h(t), t = e ? n(t)(e) : t, u(t)
            },
            getPlural: function(e, i, r, o, a) {
                var s = t(this.currentLanguage, e);
                return i = this.getStringForm(i, s, a) || h(1 === e ? i : r), o && (o.$count = e, i = n(i)(o)), u(i)
            },
            loadRemote: function(t) {
                return e({
                    method: "GET",
                    url: t,
                    cache: a.cache
                }).success(function(t) {
                    for (var e in t) a.setStrings(e, t[e])
                })
            }
        }
    }]), angular.module("gettext").directive("translate", ["gettextCatalog", "$parse", "$animate", "$compile", "$window", function(t, e, i, n, r) {
        function o(t, e, i) {
            if (!t) throw new Error("You should add a " + e + " attribute whenever you add a " + i + " attribute.")
        }
        var a = function() {
                return String.prototype.trim ? function(t) {
                    return "string" == typeof t ? t.trim() : t
                } : function(t) {
                    return "string" == typeof t ? t.replace(/^\s*/, "").replace(/\s*$/, "") : t
                }
            }(),
            s = parseInt((/msie (\d+)/.exec(angular.lowercase(r.navigator.userAgent)) || [])[1], 10);
        return {
            restrict: "AE",
            terminal: !0,
            compile: function(r, l) {
                o(!l.translatePlural || l.translateN, "translate-n", "translate-plural"), o(!l.translateN || l.translatePlural, "translate-plural", "translate-n");
                var c = a(r.html()),
                    h = l.translatePlural,
                    u = l.translateContext;
                return 8 >= s && "<!--IE fix-->" === c.slice(-13) && (c = c.slice(0, -13)), {
                    post: function(r, o, a) {
                        function s() {
                            var e;
                            h ? (r = f || (f = r.$new()), r.$count = l(r), e = t.getPlural(r.$count, c, h, null, u)) : e = t.getString(c, null, u);
                            var a = angular.element("<span>" + e + "</span>");
                            n(a.contents())(r);
                            var s = o.contents(),
                                d = a.contents();
                            i.enter(d, o), i.leave(s)
                        }
                        var l = e(a.translateN),
                            f = null;
                        a.translateN && r.$watch(a.translateN, s), r.$on("gettextLanguageChanged", s), s()
                    }
                }
            }
        }
    }]), angular.module("gettext").filter("translate", ["gettextCatalog", function(t) {
        function e(e, i) {
            return t.getString(e, null, i)
        }
        return e.$stateful = !0, e
    }]), angular.module("gettext").factory("gettextPlurals", function() {
        return function(t, e) {
            switch (t) {
                case "ay":
                case "bo":
                case "cgg":
                case "dz":
                case "fa":
                case "id":
                case "ja":
                case "jbo":
                case "ka":
                case "kk":
                case "km":
                case "ko":
                case "ky":
                case "lo":
                case "ms":
                case "my":
                case "sah":
                case "su":
                case "th":
                case "tt":
                case "ug":
                case "vi":
                case "wo":
                case "zh":
                    return 0;
                case "is":
                    return e % 10 != 1 || e % 100 == 11 ? 1 : 0;
                case "jv":
                    return 0 != e ? 1 : 0;
                case "mk":
                    return 1 == e || e % 10 == 1 ? 0 : 1;
                case "ach":
                case "ak":
                case "am":
                case "arn":
                case "br":
                case "fil":
                case "fr":
                case "gun":
                case "ln":
                case "mfe":
                case "mg":
                case "mi":
                case "oc":
                case "pt_BR":
                case "tg":
                case "ti":
                case "tr":
                case "uz":
                case "wa":
                case "zh":
                    return e > 1 ? 1 : 0;
                case "lv":
                    return e % 10 == 1 && e % 100 != 11 ? 0 : 0 != e ? 1 : 2;
                case "lt":
                    return e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && (10 > e % 100 || e % 100 >= 20) ? 1 : 2;
                case "be":
                case "bs":
                case "hr":
                case "ru":
                case "sr":
                case "uk":
                    return e % 10 == 1 && e % 100 != 11 ? 0 : e % 10 >= 2 && 4 >= e % 10 && (10 > e % 100 || e % 100 >= 20) ? 1 : 2;
                case "mnk":
                    return 0 == e ? 0 : 1 == e ? 1 : 2;
                case "ro":
                    return 1 == e ? 0 : 0 == e || e % 100 > 0 && 20 > e % 100 ? 1 : 2;
                case "pl":
                    return 1 == e ? 0 : e % 10 >= 2 && 4 >= e % 10 && (10 > e % 100 || e % 100 >= 20) ? 1 : 2;
                case "cs":
                case "sk":
                    return 1 == e ? 0 : e >= 2 && 4 >= e ? 1 : 2;
                case "sl":
                    return e % 100 == 1 ? 1 : e % 100 == 2 ? 2 : e % 100 == 3 || e % 100 == 4 ? 3 : 0;
                case "mt":
                    return 1 == e ? 0 : 0 == e || e % 100 > 1 && 11 > e % 100 ? 1 : e % 100 > 10 && 20 > e % 100 ? 2 : 3;
                case "gd":
                    return 1 == e || 11 == e ? 0 : 2 == e || 12 == e ? 1 : e > 2 && 20 > e ? 2 : 3;
                case "cy":
                    return 1 == e ? 0 : 2 == e ? 1 : 8 != e && 11 != e ? 2 : 3;
                case "kw":
                    return 1 == e ? 0 : 2 == e ? 1 : 3 == e ? 2 : 3;
                case "ga":
                    return 1 == e ? 0 : 2 == e ? 1 : 7 > e ? 2 : 11 > e ? 3 : 4;
                case "ar":
                    return 0 == e ? 0 : 1 == e ? 1 : 2 == e ? 2 : e % 100 >= 3 && 10 >= e % 100 ? 3 : e % 100 >= 11 ? 4 : 5;
                default:
                    return 1 != e ? 1 : 0
            }
        }
    });
/* WebcamJS v1.0.16 - http://github.com/jhuckaby/webcamjs - MIT Licensed */
(function(e) {
    var t;

    function a() {
        var e = Error.apply(this, arguments);
        e.name = this.name = "FlashError";
        this.stack = e.stack;
        this.message = e.message
    }

    function s() {
        var e = Error.apply(this, arguments);
        e.name = this.name = "WebcamError";
        this.stack = e.stack;
        this.message = e.message
    }
    IntermediateInheritor = function() {};
    IntermediateInheritor.prototype = Error.prototype;
    a.prototype = new IntermediateInheritor;
    s.prototype = new IntermediateInheritor;
    var Webcam = {
        version: "1.0.16",
        protocol: location.protocol.match(/https/i) ? "https" : "http",
        loaded: false,
        live: false,
        userMedia: true,
        params: {
            width: 0,
            height: 0,
            dest_width: 0,
            dest_height: 0,
            image_format: "jpeg",
            jpeg_quality: 90,
            enable_flash: true,
            force_flash: false,
            flip_horiz: false,
            fps: 30,
            upload_name: "webcam",
            constraints: null,
            swfURL: "",
            flashNotDetectedText: "ERROR: No Adobe Flash Player detected.  Webcam.js relies on Flash for browsers that do not support getUserMedia (like yours).",
            noInterfaceFoundText: "No supported webcam interface found.",
            unfreeze_snap: true
        },
        errors: {
            FlashError: a,
            WebcamError: s
        },
        hooks: {},
        init: function() {
            var t = this;
            this.mediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices : navigator.mozGetUserMedia || navigator.webkitGetUserMedia ? {
                getUserMedia: function(e) {
                    return new Promise(function(t, a) {
                        (navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, e, t, a)
                    })
                }
            } : null;
            e.URL = e.URL || e.webkitURL || e.mozURL || e.msURL;
            this.userMedia = this.userMedia && !!this.mediaDevices && !!e.URL;
            if (navigator.userAgent.match(/Firefox\D+(\d+)/)) {
                if (parseInt(RegExp.$1, 10) < 21) this.userMedia = null
            }
            if (this.userMedia) {
                e.addEventListener("beforeunload", function(e) {
                    t.reset()
                })
            }
        },
        attach: function(a) {
            if (typeof a == "string") {
                a = document.getElementById(a) || document.querySelector(a)
            }
            if (!a) {
                return this.dispatch("error", new s("Could not locate DOM element to attach to."))
            }
            this.container = a;
            a.innerHTML = "";
            var i = document.createElement("div");
            a.appendChild(i);
            this.peg = i;
            if (!this.params.width) this.params.width = a.offsetWidth;
            if (!this.params.height) this.params.height = a.offsetHeight;
            if (!this.params.width || !this.params.height) {
                return this.dispatch("error", new s("No width and/or height for webcam.  Please call set() first, or attach to a visible element."))
            }
            if (!this.params.dest_width) this.params.dest_width = this.params.width;
            if (!this.params.dest_height) this.params.dest_height = this.params.height;
            this.userMedia = t === undefined ? this.userMedia : t;
            if (this.params.force_flash) {
                t = this.userMedia;
                this.userMedia = null
            }
            if (typeof this.params.fps !== "number") this.params.fps = 30;
            var r = this.params.width / this.params.dest_width;
            var o = this.params.height / this.params.dest_height;
            if (this.userMedia) {
                var n = document.createElement("video");
                n.setAttribute("autoplay", "autoplay");
                n.style.width = "" + this.params.dest_width + "px";
                n.style.height = "" + this.params.dest_height + "px";
                if (r != 1 || o != 1) {
                    a.style.overflow = "hidden";
                    n.style.webkitTransformOrigin = "0px 0px";
                    n.style.mozTransformOrigin = "0px 0px";
                    n.style.msTransformOrigin = "0px 0px";
                    n.style.oTransformOrigin = "0px 0px";
                    n.style.transformOrigin = "0px 0px";
                    n.style.webkitTransform = "scaleX(" + r + ") scaleY(" + o + ")";
                    n.style.mozTransform = "scaleX(" + r + ") scaleY(" + o + ")";
                    n.style.msTransform = "scaleX(" + r + ") scaleY(" + o + ")";
                    n.style.oTransform = "scaleX(" + r + ") scaleY(" + o + ")";
                    n.style.transform = "scaleX(" + r + ") scaleY(" + o + ")"
                }
                a.appendChild(n);
                this.video = n;
                var h = this;
                this.mediaDevices.getUserMedia({
                    audio: false,
                    video: this.params.constraints || {
                        mandatory: {
                            minWidth: this.params.dest_width,
                            minHeight: this.params.dest_height
                        }
                    }
                }).then(function(t) {
                    n.onloadedmetadata = function(e) {
                        h.stream = t;
                        h.loaded = true;
                        h.live = true;
                        h.dispatch("load");
                        h.dispatch("live");
                        h.flip()
                    };
                    n.src = e.URL.createObjectURL(t) || t
                }).catch(function(e) {
                    if (h.params.enable_flash && h.detectFlash()) {
                        setTimeout(function() {
                            h.params.force_flash = 1;
                            h.attach(a)
                        }, 1)
                    } else {
                        h.dispatch("error", e)
                    }
                })
            } else if (this.params.enable_flash && this.detectFlash()) {
                e.Webcam = Webcam;
                var l = document.createElement("div");
                l.innerHTML = this.getSWFHTML();
                a.appendChild(l)
            } else {
                this.dispatch("error", new s(this.params.noInterfaceFoundText))
            }
            if (this.params.crop_width && this.params.crop_height) {
                var c = Math.floor(this.params.crop_width * r);
                var m = Math.floor(this.params.crop_height * o);
                a.style.width = "" + c + "px";
                a.style.height = "" + m + "px";
                a.style.overflow = "hidden";
                a.scrollLeft = Math.floor(this.params.width / 2 - c / 2);
                a.scrollTop = Math.floor(this.params.height / 2 - m / 2)
            } else {
                a.style.width = "" + this.params.width + "px";
                a.style.height = "" + this.params.height + "px"
            }
        },
        reset: function() {
            if (this.preview_active) this.unfreeze();
            this.unflip();
            if (this.userMedia) {
                if (this.stream) {
                    if (this.stream.getVideoTracks) {
                        var e = this.stream.getVideoTracks();
                        if (e && e[0] && e[0].stop) e[0].stop()
                    } else if (this.stream.stop) {
                        this.stream.stop()
                    }
                }
                delete this.stream;
                delete this.video
            }
            if (this.userMedia !== true) {
                var t = this.getMovie();
                if (t && t._releaseCamera) t._releaseCamera()
            }
            if (this.container) {
                this.container.innerHTML = "";
                delete this.container
            }
            this.loaded = false;
            this.live = false
        },
        set: function() {
            if (arguments.length == 1) {
                for (var e in arguments[0]) {
                    this.params[e] = arguments[0][e]
                }
            } else {
                this.params[arguments[0]] = arguments[1]
            }
        },
        on: function(e, t) {
            e = e.replace(/^on/i, "").toLowerCase();
            if (!this.hooks[e]) this.hooks[e] = [];
            this.hooks[e].push(t)
        },
        off: function(e, t) {
            e = e.replace(/^on/i, "").toLowerCase();
            if (this.hooks[e]) {
                if (t) {
                    var a = this.hooks[e].indexOf(t);
                    if (a > -1) this.hooks[e].splice(a, 1)
                } else {
                    this.hooks[e] = []
                }
            }
        },
        dispatch: function() {
            var t = arguments[0].replace(/^on/i, "").toLowerCase();
            var i = Array.prototype.slice.call(arguments, 1);
            if (this.hooks[t] && this.hooks[t].length) {
                for (var r = 0, o = this.hooks[t].length; r < o; r++) {
                    var n = this.hooks[t][r];
                    if (typeof n == "function") {
                        n.apply(this, i)
                    } else if (typeof n == "object" && n.length == 2) {
                        n[0][n[1]].apply(n[0], i)
                    } else if (e[n]) {
                        e[n].apply(e, i)
                    }
                }
                return true
            } else if (t == "error") {
                if (i[0] instanceof a || i[0] instanceof s) {
                    message = i[0].message
                } else {
                    message = "Could not access webcam: " + i[0].name + ": " + i[0].message + " " + i[0].toString()
                }
                alert("Webcam.js Error: " + message)
            }
            return false
        },
        setSWFLocation: function(e) {
            this.set("swfURL", e)
        },
        detectFlash: function() {
            var t = "Shockwave Flash",
                a = "ShockwaveFlash.ShockwaveFlash",
                s = "application/x-shockwave-flash",
                i = e,
                r = navigator,
                o = false;
            if (typeof r.plugins !== "undefined" && typeof r.plugins[t] === "object") {
                var n = r.plugins[t].description;
                if (n && (typeof r.mimeTypes !== "undefined" && r.mimeTypes[s] && r.mimeTypes[s].enabledPlugin)) {
                    o = true
                }
            } else if (typeof i.ActiveXObject !== "undefined") {
                try {
                    var h = new ActiveXObject(a);
                    if (h) {
                        var l = h.GetVariable("$version");
                        if (l) o = true
                    }
                } catch (c) {}
            }
            return o
        },
        getSWFHTML: function() {
            var t = "",
                s = this.params.swfURL;
            if (location.protocol.match(/file/)) {
                this.dispatch("error", new a("Flash does not work from local disk.  Please run from a web server."));
                return '<h3 style="color:red">ERROR: the Webcam.js Flash fallback does not work from local disk.  Please run it from a web server.</h3>'
            }
            if (!this.detectFlash()) {
                this.dispatch("error", new a("Adobe Flash Player not found.  Please install from get.adobe.com/flashplayer and try again."));
                return '<h3 style="color:red">' + this.params.flashNotDetectedText + "</h3>"
            }
            if (!s) {
                var i = "";
                var r = document.getElementsByTagName("script");
                for (var o = 0, n = r.length; o < n; o++) {
                    var h = r[o].getAttribute("src");
                    if (h && h.match(/\/webcam(\.min)?\.js/)) {
                        i = h.replace(/\/webcam(\.min)?\.js.*$/, "");
                        o = n
                    }
                }
                if (i) s = i + "/webcam.swf";
                else s = "webcam.swf"
            }
            if (e.localStorage && !localStorage.getItem("visited")) {
                this.params.new_user = 1;
                localStorage.setItem("visited", 1)
            }
            var l = "";
            for (var c in this.params) {
                if (l) l += "&";
                l += c + "=" + escape(this.params[c])
            }
            t += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" type="application/x-shockwave-flash" codebase="' + this.protocol + '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + this.params.width + '" height="' + this.params.height + '" id="webcam_movie_obj" align="middle"><param name="wmode" value="opaque" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + s + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + l + '"/><embed id="webcam_movie_embed" src="' + s + '" wmode="opaque" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + this.params.width + '" height="' + this.params.height + '" name="webcam_movie_embed" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + l + '"></embed></object>';
            return t
        },
        getMovie: function() {
            if (!this.loaded) return this.dispatch("error", new a("Flash Movie is not loaded yet"));
            var e = document.getElementById("webcam_movie_obj");
            if (!e || !e._snap) e = document.getElementById("webcam_movie_embed");
            if (!e) this.dispatch("error", new a("Cannot locate Flash movie in DOM"));
            return e
        },
        freeze: function() {
            var e = this;
            var t = this.params;
            if (this.preview_active) this.unfreeze();
            var a = this.params.width / this.params.dest_width;
            var s = this.params.height / this.params.dest_height;
            this.unflip();
            var i = t.crop_width || t.dest_width;
            var r = t.crop_height || t.dest_height;
            var o = document.createElement("canvas");
            o.width = i;
            o.height = r;
            var n = o.getContext("2d");
            this.preview_canvas = o;
            this.preview_context = n;
            if (a != 1 || s != 1) {
                o.style.webkitTransformOrigin = "0px 0px";
                o.style.mozTransformOrigin = "0px 0px";
                o.style.msTransformOrigin = "0px 0px";
                o.style.oTransformOrigin = "0px 0px";
                o.style.transformOrigin = "0px 0px";
                o.style.webkitTransform = "scaleX(" + a + ") scaleY(" + s + ")";
                o.style.mozTransform = "scaleX(" + a + ") scaleY(" + s + ")";
                o.style.msTransform = "scaleX(" + a + ") scaleY(" + s + ")";
                o.style.oTransform = "scaleX(" + a + ") scaleY(" + s + ")";
                o.style.transform = "scaleX(" + a + ") scaleY(" + s + ")"
            }
            this.snap(function() {
                o.style.position = "relative";
                o.style.left = "" + e.container.scrollLeft + "px";
                o.style.top = "" + e.container.scrollTop + "px";
                e.container.insertBefore(o, e.peg);
                e.container.style.overflow = "hidden";
                e.preview_active = true
            }, o)
        },
        unfreeze: function() {
            if (this.preview_active) {
                this.container.removeChild(this.preview_canvas);
                delete this.preview_context;
                delete this.preview_canvas;
                this.preview_active = false;
                this.flip()
            }
        },
        flip: function() {
            if (this.params.flip_horiz) {
                var e = this.container.style;
                e.webkitTransform = "scaleX(-1)";
                e.mozTransform = "scaleX(-1)";
                e.msTransform = "scaleX(-1)";
                e.oTransform = "scaleX(-1)";
                e.transform = "scaleX(-1)";
                e.filter = "FlipH";
                e.msFilter = "FlipH"
            }
        },
        unflip: function() {
            if (this.params.flip_horiz) {
                var e = this.container.style;
                e.webkitTransform = "scaleX(1)";
                e.mozTransform = "scaleX(1)";
                e.msTransform = "scaleX(1)";
                e.oTransform = "scaleX(1)";
                e.transform = "scaleX(1)";
                e.filter = "";
                e.msFilter = ""
            }
        },
        savePreview: function(e, t) {
            var a = this.params;
            var s = this.preview_canvas;
            var i = this.preview_context;
            if (t) {
                var r = t.getContext("2d");
                r.drawImage(s, 0, 0)
            }
            e(t ? null : s.toDataURL("image/" + a.image_format, a.jpeg_quality / 100), s, i);
            if (this.params.unfreeze_snap) this.unfreeze()
        },
        snap: function(e, t) {
            var a = this;
            var i = this.params;
            if (!this.loaded) return this.dispatch("error", new s("Webcam is not loaded yet"));
            if (!e) return this.dispatch("error", new s("Please provide a callback function or canvas to snap()"));
            if (this.preview_active) {
                this.savePreview(e, t);
                return null
            }
            var r = document.createElement("canvas");
            r.width = this.params.dest_width;
            r.height = this.params.dest_height;
            var o = r.getContext("2d");
            if (this.params.flip_horiz) {
                o.translate(i.dest_width, 0);
                o.scale(-1, 1)
            }
            var n = function() {
                if (this.src && this.width && this.height) {
                    o.drawImage(this, 0, 0, i.dest_width, i.dest_height)
                }
                if (i.crop_width && i.crop_height) {
                    var a = document.createElement("canvas");
                    a.width = i.crop_width;
                    a.height = i.crop_height;
                    var s = a.getContext("2d");
                    s.drawImage(r, Math.floor(i.dest_width / 2 - i.crop_width / 2), Math.floor(i.dest_height / 2 - i.crop_height / 2), i.crop_width, i.crop_height, 0, 0, i.crop_width, i.crop_height);
                    o = s;
                    r = a
                }
                if (t) {
                    var n = t.getContext("2d");
                    n.drawImage(r, 0, 0)
                }
                e(t ? null : r.toDataURL("image/" + i.image_format, i.jpeg_quality / 100), r, o)
            };
            if (this.userMedia) {
                o.drawImage(this.video, 0, 0, this.params.dest_width, this.params.dest_height);
                n()
            } else {
                var h = this.getMovie()._snap();
                var l = new Image;
                l.onload = n;
                l.src = "data:image/" + this.params.image_format + ";base64," + h
            }
            return null
        },
        configure: function(e) {
            if (!e) e = "camera";
            this.getMovie()._configure(e)
        },
        flashNotify: function(e, t) {
            switch (e) {
                case "flashLoadComplete":
                    this.loaded = true;
                    this.dispatch("load");
                    break;
                case "cameraLive":
                    this.live = true;
                    this.dispatch("live");
                    break;
                case "error":
                    this.dispatch("error", new a(t));
                    break;
                default:
                    break
            }
        },
        b64ToUint6: function(e) {
            return e > 64 && e < 91 ? e - 65 : e > 96 && e < 123 ? e - 71 : e > 47 && e < 58 ? e + 4 : e === 43 ? 62 : e === 47 ? 63 : 0
        },
        base64DecToArr: function(e, t) {
            var a = e.replace(/[^A-Za-z0-9\+\/]/g, ""),
                s = a.length,
                i = t ? Math.ceil((s * 3 + 1 >> 2) / t) * t : s * 3 + 1 >> 2,
                r = new Uint8Array(i);
            for (var o, n, h = 0, l = 0, c = 0; c < s; c++) {
                n = c & 3;
                h |= this.b64ToUint6(a.charCodeAt(c)) << 18 - 6 * n;
                if (n === 3 || s - c === 1) {
                    for (o = 0; o < 3 && l < i; o++, l++) {
                        r[l] = h >>> (16 >>> o & 24) & 255
                    }
                    h = 0
                }
            }
            return r
        },
        upload: function(e, t, a) {
            var s = this.params.upload_name || "webcam";
            var i = "";
            if (e.match(/^data\:image\/(\w+)/)) i = RegExp.$1;
            else throw "Cannot locate image format in Data URI";
            var r = e.replace(/^data\:image\/\w+\;base64\,/, "");
            var o = new XMLHttpRequest;
            o.open("POST", t, true);
            if (o.upload && o.upload.addEventListener) {
                o.upload.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        var t = e.loaded / e.total;
                        Webcam.dispatch("uploadProgress", t, e)
                    }
                }, false)
            }
            var n = this;
            o.onload = function() {
                if (a) a.apply(n, [o.status, o.responseText, o.statusText]);
                Webcam.dispatch("uploadComplete", o.status, o.responseText, o.statusText)
            };
            var h = new Blob([this.base64DecToArr(r)], {
                type: "image/" + i
            });
            var l = new FormData;
            l.append(s, h, s + "." + i.replace(/e/, ""));
            o.send(l)
        }
    };
    Webcam.init();
    if (typeof define === "function" && define.amd) {
        define(function() {
            return Webcam
        })
    } else if (typeof module === "object" && module.exports) {
        module.exports = Webcam
    } else {
        e.Webcam = Webcam
    }
})(window);
/*! tooltipster v4.1.6 */
! function(a, b) {
    "function" == typeof define && define.amd ? define(["jquery"], function(a) {
        return b(a)
    }) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(jQuery)
}(this, function(a) {
    function b(a) {
        this.$container, this.constraints = null, this.__$tooltip, this.__init(a)
    }

    function c(b, c) {
        var d = !0;
        return a.each(b, function(a, e) {
            return void 0 === c[a] || b[a] !== c[a] ? (d = !1, !1) : void 0
        }), d
    }

    function d(b) {
        var c = b.attr("id"),
            d = c ? h.window.document.getElementById(c) : null;
        return d ? d === b[0] : a.contains(h.window.document.body, b[0])
    }

    function e() {
        if (!g) return !1;
        var a = g.document.body || g.document.documentElement,
            b = a.style,
            c = "transition",
            d = ["Moz", "Webkit", "Khtml", "O", "ms"];
        if ("string" == typeof b[c]) return !0;
        c = c.charAt(0).toUpperCase() + c.substr(1);
        for (var e = 0; e < d.length; e++)
            if ("string" == typeof b[d[e] + c]) return !0;
        return !1
    }
    var f = {
            animation: "fade",
            animationDuration: 350,
            content: null,
            contentAsHTML: !1,
            contentCloning: !1,
            debug: !0,
            delay: 300,
            delayTouch: [300, 500],
            functionInit: null,
            functionBefore: null,
            functionReady: null,
            functionAfter: null,
            functionFormat: null,
            IEmin: 6,
            interactive: !1,
            multiple: !1,
            parent: "body",
            plugins: ["sideTip"],
            repositionOnScroll: !1,
            restoration: "none",
            selfDestruction: !0,
            theme: [],
            timer: 0,
            trackerInterval: 500,
            trackOrigin: !1,
            trackTooltip: !1,
            trigger: "hover",
            triggerClose: {
                click: !1,
                mouseleave: !1,
                originClick: !1,
                scroll: !1,
                tap: !1,
                touchleave: !1
            },
            triggerOpen: {
                click: !1,
                mouseenter: !1,
                tap: !1,
                touchstart: !1
            },
            updateAnimation: "rotate",
            zIndex: 9999999
        },
        g = "undefined" != typeof window ? window : null,
        h = {
            hasTouchCapability: !(!g || !("ontouchstart" in g || g.DocumentTouch && g.document instanceof g.DocumentTouch || g.navigator.maxTouchPoints)),
            hasTransitions: e(),
            IE: !1,
            semVer: "4.1.6",
            window: g
        },
        i = function() {
            this.__$emitterPrivate = a({}), this.__$emitterPublic = a({}), this.__instancesLatestArr = [], this.__plugins = {}, this._env = h
        };
    i.prototype = {
        __bridge: function(b, c, d) {
            if (!c[d]) {
                var e = function() {};
                e.prototype = b;
                var g = new e;
                g.__init && g.__init(c), a.each(b, function(a, b) {
                    0 != a.indexOf("__") && (c[a] ? f.debug && console.log("The " + a + " method of the " + d + " plugin conflicts with another plugin or native methods") : (c[a] = function() {
                        return g[a].apply(g, Array.prototype.slice.apply(arguments))
                    }, c[a].bridged = g))
                }), c[d] = g
            }
            return this
        },
        __setWindow: function(a) {
            return h.window = a, this
        },
        _getRuler: function(a) {
            return new b(a)
        },
        _off: function() {
            return this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        },
        _on: function() {
            return this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        },
        _one: function() {
            return this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        },
        _plugin: function(b) {
            var c = this;
            if ("string" == typeof b) {
                var d = b,
                    e = null;
                return d.indexOf(".") > 0 ? e = c.__plugins[d] : a.each(c.__plugins, function(a, b) {
                    return b.name.substring(b.name.length - d.length - 1) == "." + d ? (e = b, !1) : void 0
                }), e
            }
            if (b.name.indexOf(".") < 0) throw new Error("Plugins must be namespaced");
            return c.__plugins[b.name] = b, b.core && c.__bridge(b.core, c, b.name), this
        },
        _trigger: function() {
            var a = Array.prototype.slice.apply(arguments);
            return "string" == typeof a[0] && (a[0] = {
                type: a[0]
            }), this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, a), this.__$emitterPublic.trigger.apply(this.__$emitterPublic, a), this
        },
        instances: function(b) {
            var c = [],
                d = b || ".tooltipstered";
            return a(d).each(function() {
                var b = a(this),
                    d = b.data("tooltipster-ns");
                d && a.each(d, function(a, d) {
                    c.push(b.data(d))
                })
            }), c
        },
        instancesLatest: function() {
            return this.__instancesLatestArr
        },
        off: function() {
            return this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        },
        on: function() {
            return this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        },
        one: function() {
            return this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        },
        origins: function(b) {
            var c = b ? b + " " : "";
            return a(c + ".tooltipstered").toArray()
        },
        setDefaults: function(b) {
            return a.extend(f, b), this
        },
        triggerHandler: function() {
            return this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }
    }, a.tooltipster = new i, a.Tooltipster = function(b, c) {
        this.__callbacks = {
            close: [],
            open: []
        }, this.__closingTime, this.__Content, this.__contentBcr, this.__destroyed = !1, this.__destroying = !1, this.__$emitterPrivate = a({}), this.__$emitterPublic = a({}), this.__enabled = !0, this.__garbageCollector, this.__Geometry, this.__lastPosition, this.__namespace = "tooltipster-" + Math.round(1e6 * Math.random()), this.__options, this.__$originParents, this.__pointerIsOverOrigin = !1, this.__previousThemes = [], this.__state = "closed", this.__timeouts = {
            close: [],
            open: null
        }, this.__touchEvents = [], this.__tracker = null, this._$origin, this._$tooltip, this.__init(b, c)
    }, a.Tooltipster.prototype = {
        __init: function(b, c) {
            var d = this;
            if (d._$origin = a(b), d.__options = a.extend(!0, {}, f, c), d.__optionsFormat(), !h.IE || h.IE >= d.__options.IEmin) {
                var e = null;
                if (void 0 === d._$origin.data("tooltipster-initialTitle") && (e = d._$origin.attr("title"), void 0 === e && (e = null), d._$origin.data("tooltipster-initialTitle", e)), null !== d.__options.content) d.__contentSet(d.__options.content);
                else {
                    var g, i = d._$origin.attr("data-tooltip-content");
                    i && (g = a(i)), g && g[0] ? d.__contentSet(g.first()) : d.__contentSet(e)
                }
                d._$origin.removeAttr("title").addClass("tooltipstered"), d.__prepareOrigin(), d.__prepareGC(), a.each(d.__options.plugins, function(a, b) {
                    d._plug(b)
                }), h.hasTouchCapability && a("body").on("touchmove." + d.__namespace + "-triggerOpen", function(a) {
                    d._touchRecordEvent(a)
                }), d._on("created", function() {
                    d.__prepareTooltip()
                })._on("repositioned", function(a) {
                    d.__lastPosition = a.position
                })
            } else d.__options.disabled = !0
        },
        __contentInsert: function() {
            var a = this,
                b = a._$tooltip.find(".tooltipster-content"),
                c = a.__Content,
                d = function(a) {
                    c = a
                };
            return a._trigger({
                type: "format",
                content: a.__Content,
                format: d
            }), a.__options.functionFormat && (c = a.__options.functionFormat.call(a, a, {
                origin: a._$origin[0]
            }, a.__Content)), "string" != typeof c || a.__options.contentAsHTML ? b.empty().append(c) : b.text(c), a
        },
        __contentSet: function(b) {
            return b instanceof a && this.__options.contentCloning && (b = b.clone(!0)), this.__Content = b, this._trigger({
                type: "updated",
                content: b
            }), this
        },
        __destroyError: function() {
            throw new Error("This tooltip has been destroyed and cannot execute your method call.")
        },
        __geometry: function() {
            var b = this,
                c = b._$origin,
                d = b._$origin.is("area");
            if (d) {
                var e = b._$origin.parent().attr("name");
                c = a('img[usemap="#' + e + '"]')
            }
            var f = c[0].getBoundingClientRect(),
                g = a(h.window.document),
                i = a(h.window),
                j = c,
                k = {
                    available: {
                        document: null,
                        window: null
                    },
                    document: {
                        size: {
                            height: g.height(),
                            width: g.width()
                        }
                    },
                    window: {
                        scroll: {
                            left: h.window.scrollX || h.window.document.documentElement.scrollLeft,
                            top: h.window.scrollY || h.window.document.documentElement.scrollTop
                        },
                        size: {
                            height: i.height(),
                            width: i.width()
                        }
                    },
                    origin: {
                        fixedLineage: !1,
                        offset: {},
                        size: {
                            height: f.bottom - f.top,
                            width: f.right - f.left
                        },
                        usemapImage: d ? c[0] : null,
                        windowOffset: {
                            bottom: f.bottom,
                            left: f.left,
                            right: f.right,
                            top: f.top
                        }
                    }
                };
            if (d) {
                var l = b._$origin.attr("shape"),
                    m = b._$origin.attr("coords");
                if (m && (m = m.split(","), a.map(m, function(a, b) {
                        m[b] = parseInt(a)
                    })), "default" != l) switch (l) {
                    case "circle":
                        var n = m[0],
                            o = m[1],
                            p = m[2],
                            q = o - p,
                            r = n - p;
                        k.origin.size.height = 2 * p, k.origin.size.width = k.origin.size.height, k.origin.windowOffset.left += r, k.origin.windowOffset.top += q;
                        break;
                    case "rect":
                        var s = m[0],
                            t = m[1],
                            u = m[2],
                            v = m[3];
                        k.origin.size.height = v - t, k.origin.size.width = u - s, k.origin.windowOffset.left += s, k.origin.windowOffset.top += t;
                        break;
                    case "poly":
                        for (var w = 0, x = 0, y = 0, z = 0, A = "even", B = 0; B < m.length; B++) {
                            var C = m[B];
                            "even" == A ? (C > y && (y = C, 0 === B && (w = y)), w > C && (w = C), A = "odd") : (C > z && (z = C, 1 == B && (x = z)), x > C && (x = C), A = "even")
                        }
                        k.origin.size.height = z - x, k.origin.size.width = y - w, k.origin.windowOffset.left += w, k.origin.windowOffset.top += x
                }
            }
            var D = function(a) {
                k.origin.size.height = a.height, k.origin.windowOffset.left = a.left, k.origin.windowOffset.top = a.top, k.origin.size.width = a.width
            };
            for (b._trigger({
                    type: "geometry",
                    edit: D,
                    geometry: {
                        height: k.origin.size.height,
                        left: k.origin.windowOffset.left,
                        top: k.origin.windowOffset.top,
                        width: k.origin.size.width
                    }
                }), k.origin.windowOffset.right = k.origin.windowOffset.left + k.origin.size.width, k.origin.windowOffset.bottom = k.origin.windowOffset.top + k.origin.size.height, k.origin.offset.left = k.origin.windowOffset.left + k.window.scroll.left, k.origin.offset.top = k.origin.windowOffset.top + k.window.scroll.top, k.origin.offset.bottom = k.origin.offset.top + k.origin.size.height, k.origin.offset.right = k.origin.offset.left + k.origin.size.width, k.available.document = {
                    bottom: {
                        height: k.document.size.height - k.origin.offset.bottom,
                        width: k.document.size.width
                    },
                    left: {
                        height: k.document.size.height,
                        width: k.origin.offset.left
                    },
                    right: {
                        height: k.document.size.height,
                        width: k.document.size.width - k.origin.offset.right
                    },
                    top: {
                        height: k.origin.offset.top,
                        width: k.document.size.width
                    }
                }, k.available.window = {
                    bottom: {
                        height: Math.max(k.window.size.height - Math.max(k.origin.windowOffset.bottom, 0), 0),
                        width: k.window.size.width
                    },
                    left: {
                        height: k.window.size.height,
                        width: Math.max(k.origin.windowOffset.left, 0)
                    },
                    right: {
                        height: k.window.size.height,
                        width: Math.max(k.window.size.width - Math.max(k.origin.windowOffset.right, 0), 0)
                    },
                    top: {
                        height: Math.max(k.origin.windowOffset.top, 0),
                        width: k.window.size.width
                    }
                };
                "html" != j[0].tagName.toLowerCase();) {
                if ("fixed" == j.css("position")) {
                    k.origin.fixedLineage = !0;
                    break
                }
                j = j.parent()
            }
            return k
        },
        __optionsFormat: function() {
            return "number" == typeof this.__options.animationDuration && (this.__options.animationDuration = [this.__options.animationDuration, this.__options.animationDuration]), "number" == typeof this.__options.delay && (this.__options.delay = [this.__options.delay, this.__options.delay]), "number" == typeof this.__options.delayTouch && (this.__options.delayTouch = [this.__options.delayTouch, this.__options.delayTouch]), "string" == typeof this.__options.theme && (this.__options.theme = [this.__options.theme]), "string" == typeof this.__options.parent && (this.__options.parent = a(this.__options.parent)), "hover" == this.__options.trigger ? (this.__options.triggerOpen = {
                mouseenter: !0,
                touchstart: !0
            }, this.__options.triggerClose = {
                mouseleave: !0,
                originClick: !0,
                touchleave: !0
            }) : "click" == this.__options.trigger && (this.__options.triggerOpen = {
                click: !0,
                tap: !0
            }, this.__options.triggerClose = {
                click: !0,
                tap: !0
            }), this._trigger("options"), this
        },
        __prepareGC: function() {
            var b = this;
            return b.__options.selfDestruction ? b.__garbageCollector = setInterval(function() {
                var c = (new Date).getTime();
                b.__touchEvents = a.grep(b.__touchEvents, function(a, b) {
                    return c - a.time > 6e4
                }), d(b._$origin) || b.destroy()
            }, 2e4) : clearInterval(b.__garbageCollector), b
        },
        __prepareOrigin: function() {
            var a = this;
            if (a._$origin.off("." + a.__namespace + "-triggerOpen"), h.hasTouchCapability && a._$origin.on("touchstart." + a.__namespace + "-triggerOpen touchend." + a.__namespace + "-triggerOpen touchcancel." + a.__namespace + "-triggerOpen", function(b) {
                    a._touchRecordEvent(b)
                }), a.__options.triggerOpen.click || a.__options.triggerOpen.tap && h.hasTouchCapability) {
                var b = "";
                a.__options.triggerOpen.click && (b += "click." + a.__namespace + "-triggerOpen "), a.__options.triggerOpen.tap && h.hasTouchCapability && (b += "touchend." + a.__namespace + "-triggerOpen"), a._$origin.on(b, function(b) {
                    a._touchIsMeaningfulEvent(b) && a._open(b)
                })
            }
            if (a.__options.triggerOpen.mouseenter || a.__options.triggerOpen.touchstart && h.hasTouchCapability) {
                var b = "";
                a.__options.triggerOpen.mouseenter && (b += "mouseenter." + a.__namespace + "-triggerOpen "), a.__options.triggerOpen.touchstart && h.hasTouchCapability && (b += "touchstart." + a.__namespace + "-triggerOpen"), a._$origin.on(b, function(b) {
                    !a._touchIsTouchEvent(b) && a._touchIsEmulatedEvent(b) || (a.__pointerIsOverOrigin = !0, a._openShortly(b))
                })
            }
            if (a.__options.triggerClose.mouseleave || a.__options.triggerClose.touchleave && h.hasTouchCapability) {
                var b = "";
                a.__options.triggerClose.mouseleave && (b += "mouseleave." + a.__namespace + "-triggerOpen "), a.__options.triggerClose.touchleave && h.hasTouchCapability && (b += "touchend." + a.__namespace + "-triggerOpen touchcancel." + a.__namespace + "-triggerOpen"), a._$origin.on(b, function(b) {
                    a._touchIsMeaningfulEvent(b) && (a.__pointerIsOverOrigin = !1)
                })
            }
            return a
        },
        __prepareTooltip: function() {
            var b = this,
                c = b.__options.interactive ? "auto" : "";
            return b._$tooltip.attr("id", b.__namespace).css({
                "pointer-events": c,
                zIndex: b.__options.zIndex
            }), a.each(b.__previousThemes, function(a, c) {
                b._$tooltip.removeClass(c)
            }), a.each(b.__options.theme, function(a, c) {
                b._$tooltip.addClass(c)
            }), b.__previousThemes = a.merge([], b.__options.theme), b
        },
        __scrollHandler: function(b) {
            var c = this;
            if (c.__options.triggerClose.scroll) c._close(b);
            else {
                if (b.target === h.window.document) c.__Geometry.origin.fixedLineage || c.__options.repositionOnScroll && c.reposition(b);
                else {
                    var d = c.__geometry(),
                        e = !1;
                    if ("fixed" != c._$origin.css("position") && c.__$originParents.each(function(b, c) {
                            var f = a(c),
                                g = f.css("overflow-x"),
                                h = f.css("overflow-y");
                            if ("visible" != g || "visible" != h) {
                                var i = c.getBoundingClientRect();
                                if ("visible" != g && (d.origin.windowOffset.left < i.left || d.origin.windowOffset.right > i.right)) return e = !0, !1;
                                if ("visible" != h && (d.origin.windowOffset.top < i.top || d.origin.windowOffset.bottom > i.bottom)) return e = !0, !1
                            }
                            return "fixed" == f.css("position") ? !1 : void 0
                        }), e) c._$tooltip.css("visibility", "hidden");
                    else if (c._$tooltip.css("visibility", "visible"), c.__options.repositionOnScroll) c.reposition(b);
                    else {
                        var f = d.origin.offset.left - c.__Geometry.origin.offset.left,
                            g = d.origin.offset.top - c.__Geometry.origin.offset.top;
                        c._$tooltip.css({
                            left: c.__lastPosition.coord.left + f,
                            top: c.__lastPosition.coord.top + g
                        })
                    }
                }
                c._trigger({
                    type: "scroll",
                    event: b
                })
            }
            return c
        },
        __stateSet: function(a) {
            return this.__state = a, this._trigger({
                type: "state",
                state: a
            }), this
        },
        __timeoutsClear: function() {
            return clearTimeout(this.__timeouts.open), this.__timeouts.open = null, a.each(this.__timeouts.close, function(a, b) {
                clearTimeout(b)
            }), this.__timeouts.close = [], this
        },
        __trackerStart: function() {
            var a = this,
                b = a._$tooltip.find(".tooltipster-content");
            return a.__options.trackTooltip && (a.__contentBcr = b[0].getBoundingClientRect()), a.__tracker = setInterval(function() {
                if (d(a._$origin) && d(a._$tooltip)) {
                    if (a.__options.trackOrigin) {
                        var e = a.__geometry(),
                            f = !1;
                        c(e.origin.size, a.__Geometry.origin.size) && (a.__Geometry.origin.fixedLineage ? c(e.origin.windowOffset, a.__Geometry.origin.windowOffset) && (f = !0) : c(e.origin.offset, a.__Geometry.origin.offset) && (f = !0)), f || (a.__options.triggerClose.mouseleave ? a._close() : a.reposition())
                    }
                    if (a.__options.trackTooltip) {
                        var g = b[0].getBoundingClientRect();
                        g.height === a.__contentBcr.height && g.width === a.__contentBcr.width || (a.reposition(), a.__contentBcr = g)
                    }
                } else a._close()
            }, a.__options.trackerInterval), a
        },
        _close: function(b, c) {
            var d = this,
                e = !0;
            if (d._trigger({
                    type: "close",
                    event: b,
                    stop: function() {
                        e = !1
                    }
                }), e || d.__destroying) {
                c && d.__callbacks.close.push(c), d.__callbacks.open = [], d.__timeoutsClear();
                var f = function() {
                    a.each(d.__callbacks.close, function(a, c) {
                        c.call(d, d, {
                            event: b,
                            origin: d._$origin[0]
                        })
                    }), d.__callbacks.close = []
                };
                if ("closed" != d.__state) {
                    var g = !0,
                        i = new Date,
                        j = i.getTime(),
                        k = j + d.__options.animationDuration[1];
                    if ("disappearing" == d.__state && k > d.__closingTime && (g = !1), g) {
                        d.__closingTime = k, "disappearing" != d.__state && d.__stateSet("disappearing");
                        var l = function() {
                            clearInterval(d.__tracker), d._trigger({
                                type: "closing",
                                event: b
                            }), d._$tooltip.off("." + d.__namespace + "-triggerClose").removeClass("tooltipster-dying"), a(h.window).off("." + d.__namespace + "-triggerClose"), d.__$originParents.each(function(b, c) {
                                a(c).off("scroll." + d.__namespace + "-triggerClose")
                            }), d.__$originParents = null, a("body").off("." + d.__namespace + "-triggerClose"), d._$origin.off("." + d.__namespace + "-triggerClose"), d._off("dismissable"), d.__stateSet("closed"), d._trigger({
                                type: "after",
                                event: b
                            }), d.__options.functionAfter && d.__options.functionAfter.call(d, d, {
                                event: b,
                                origin: d._$origin[0]
                            }), f()
                        };
                        h.hasTransitions ? (d._$tooltip.css({
                            "-moz-animation-duration": d.__options.animationDuration[1] + "ms",
                            "-ms-animation-duration": d.__options.animationDuration[1] + "ms",
                            "-o-animation-duration": d.__options.animationDuration[1] + "ms",
                            "-webkit-animation-duration": d.__options.animationDuration[1] + "ms",
                            "animation-duration": d.__options.animationDuration[1] + "ms",
                            "transition-duration": d.__options.animationDuration[1] + "ms"
                        }), d._$tooltip.clearQueue().removeClass("tooltipster-show").addClass("tooltipster-dying"), d.__options.animationDuration[1] > 0 && d._$tooltip.delay(d.__options.animationDuration[1]), d._$tooltip.queue(l)) : d._$tooltip.stop().fadeOut(d.__options.animationDuration[1], l)
                    }
                } else f()
            }
            return d
        },
        _off: function() {
            return this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        },
        _on: function() {
            return this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        },
        _one: function() {
            return this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        },
        _open: function(b, c) {
            var e = this;
            if (!e.__destroying && d(e._$origin) && e.__enabled) {
                var f = !0;
                if ("closed" == e.__state && (e._trigger({
                        type: "before",
                        event: b,
                        stop: function() {
                            f = !1
                        }
                    }), f && e.__options.functionBefore && (f = e.__options.functionBefore.call(e, e, {
                        event: b,
                        origin: e._$origin[0]
                    }))), f !== !1 && null !== e.__Content) {
                    c && e.__callbacks.open.push(c), e.__callbacks.close = [], e.__timeoutsClear();
                    var g, i = function() {
                        "stable" != e.__state && e.__stateSet("stable"), a.each(e.__callbacks.open, function(a, b) {
                            b.call(e, e, {
                                origin: e._$origin[0],
                                tooltip: e._$tooltip[0]
                            })
                        }), e.__callbacks.open = []
                    };
                    if ("closed" !== e.__state) g = 0, "disappearing" === e.__state ? (e.__stateSet("appearing"), h.hasTransitions ? (e._$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-show"), e.__options.animationDuration[0] > 0 && e._$tooltip.delay(e.__options.animationDuration[0]), e._$tooltip.queue(i)) : e._$tooltip.stop().fadeIn(i)) : "stable" == e.__state && i();
                    else {
                        if (e.__stateSet("appearing"), g = e.__options.animationDuration[0], e.__contentInsert(), e.reposition(b, !0), h.hasTransitions ? (e._$tooltip.addClass("tooltipster-" + e.__options.animation).addClass("tooltipster-initial").css({
                                "-moz-animation-duration": e.__options.animationDuration[0] + "ms",
                                "-ms-animation-duration": e.__options.animationDuration[0] + "ms",
                                "-o-animation-duration": e.__options.animationDuration[0] + "ms",
                                "-webkit-animation-duration": e.__options.animationDuration[0] + "ms",
                                "animation-duration": e.__options.animationDuration[0] + "ms",
                                "transition-duration": e.__options.animationDuration[0] + "ms"
                            }), setTimeout(function() {
                                "closed" != e.__state && (e._$tooltip.addClass("tooltipster-show").removeClass("tooltipster-initial"), e.__options.animationDuration[0] > 0 && e._$tooltip.delay(e.__options.animationDuration[0]), e._$tooltip.queue(i))
                            }, 0)) : e._$tooltip.css("display", "none").fadeIn(e.__options.animationDuration[0], i), e.__trackerStart(), a(h.window).on("resize." + e.__namespace + "-triggerClose", function(b) {
                                var c = a(document.activeElement);
                                (c.is("input") || c.is("textarea")) && a.contains(e._$tooltip[0], c[0]) || e.reposition(b)
                            }).on("scroll." + e.__namespace + "-triggerClose", function(a) {
                                e.__scrollHandler(a)
                            }), e.__$originParents = e._$origin.parents(), e.__$originParents.each(function(b, c) {
                                a(c).on("scroll." + e.__namespace + "-triggerClose", function(a) {
                                    e.__scrollHandler(a)
                                })
                            }), e.__options.triggerClose.mouseleave || e.__options.triggerClose.touchleave && h.hasTouchCapability) {
                            e._on("dismissable", function(a) {
                                a.dismissable ? a.delay ? (m = setTimeout(function() {
                                    e._close(a.event)
                                }, a.delay), e.__timeouts.close.push(m)) : e._close(a) : clearTimeout(m)
                            });
                            var j = e._$origin,
                                k = "",
                                l = "",
                                m = null;
                            e.__options.interactive && (j = j.add(e._$tooltip)), e.__options.triggerClose.mouseleave && (k += "mouseenter." + e.__namespace + "-triggerClose ", l += "mouseleave." + e.__namespace + "-triggerClose "), e.__options.triggerClose.touchleave && h.hasTouchCapability && (k += "touchstart." + e.__namespace + "-triggerClose", l += "touchend." + e.__namespace + "-triggerClose touchcancel." + e.__namespace + "-triggerClose"), j.on(l, function(a) {
                                if (e._touchIsTouchEvent(a) || !e._touchIsEmulatedEvent(a)) {
                                    var b = "mouseleave" == a.type ? e.__options.delay : e.__options.delayTouch;
                                    e._trigger({
                                        delay: b[1],
                                        dismissable: !0,
                                        event: a,
                                        type: "dismissable"
                                    })
                                }
                            }).on(k, function(a) {
                                !e._touchIsTouchEvent(a) && e._touchIsEmulatedEvent(a) || e._trigger({
                                    dismissable: !1,
                                    event: a,
                                    type: "dismissable"
                                })
                            })
                        }
                        e.__options.triggerClose.originClick && e._$origin.on("click." + e.__namespace + "-triggerClose", function(a) {
                            e._touchIsTouchEvent(a) || e._touchIsEmulatedEvent(a) || e._close(a)
                        }), (e.__options.triggerClose.click || e.__options.triggerClose.tap && h.hasTouchCapability) && setTimeout(function() {
                            if ("closed" != e.__state) {
                                var b = "";
                                e.__options.triggerClose.click && (b += "click." + e.__namespace + "-triggerClose "), e.__options.triggerClose.tap && h.hasTouchCapability && (b += "touchend." + e.__namespace + "-triggerClose"), a("body").on(b, function(b) {
                                    e._touchIsMeaningfulEvent(b) && (e._touchRecordEvent(b), e.__options.interactive && a.contains(e._$tooltip[0], b.target) || e._close(b))
                                }), e.__options.triggerClose.tap && h.hasTouchCapability && a("body").on("touchstart." + e.__namespace + "-triggerClose", function(a) {
                                    e._touchRecordEvent(a)
                                })
                            }
                        }, 0), e._trigger("ready"), e.__options.functionReady && e.__options.functionReady.call(e, e, {
                            origin: e._$origin[0],
                            tooltip: e._$tooltip[0]
                        })
                    }
                    if (e.__options.timer > 0) {
                        var m = setTimeout(function() {
                            e._close()
                        }, e.__options.timer + g);
                        e.__timeouts.close.push(m)
                    }
                }
            }
            return e
        },
        _openShortly: function(a) {
            var b = this,
                c = !0;
            if ("stable" != b.__state && "appearing" != b.__state && !b.__timeouts.open && (b._trigger({
                    type: "start",
                    event: a,
                    stop: function() {
                        c = !1
                    }
                }), c)) {
                var d = 0 == a.type.indexOf("touch") ? b.__options.delayTouch : b.__options.delay;
                d[0] ? b.__timeouts.open = setTimeout(function() {
                    b.__timeouts.open = null, b.__pointerIsOverOrigin && b._touchIsMeaningfulEvent(a) ? (b._trigger("startend"), b._open(a)) : b._trigger("startcancel")
                }, d[0]) : (b._trigger("startend"), b._open(a))
            }
            return b
        },
        _optionsExtract: function(b, c) {
            var d = this,
                e = a.extend(!0, {}, c),
                f = d.__options[b];
            return f || (f = {}, a.each(c, function(a, b) {
                var c = d.__options[a];
                void 0 !== c && (f[a] = c)
            })), a.each(e, function(b, c) {
                void 0 !== f[b] && ("object" != typeof c || c instanceof Array || null == c || "object" != typeof f[b] || f[b] instanceof Array || null == f[b] ? e[b] = f[b] : a.extend(e[b], f[b]))
            }), e
        },
        _plug: function(b) {
            var c = a.tooltipster._plugin(b);
            if (!c) throw new Error('The "' + b + '" plugin is not defined');
            return c.instance && a.tooltipster.__bridge(c.instance, this, c.name), this
        },
        _touchIsEmulatedEvent: function(a) {
            for (var b = !1, c = (new Date).getTime(), d = this.__touchEvents.length - 1; d >= 0; d--) {
                var e = this.__touchEvents[d];
                if (!(c - e.time < 500)) break;
                e.target === a.target && (b = !0)
            }
            return b
        },
        _touchIsMeaningfulEvent: function(a) {
            return this._touchIsTouchEvent(a) && !this._touchSwiped(a.target) || !this._touchIsTouchEvent(a) && !this._touchIsEmulatedEvent(a)
        },
        _touchIsTouchEvent: function(a) {
            return 0 == a.type.indexOf("touch")
        },
        _touchRecordEvent: function(a) {
            return this._touchIsTouchEvent(a) && (a.time = (new Date).getTime(), this.__touchEvents.push(a)), this
        },
        _touchSwiped: function(a) {
            for (var b = !1, c = this.__touchEvents.length - 1; c >= 0; c--) {
                var d = this.__touchEvents[c];
                if ("touchmove" == d.type) {
                    b = !0;
                    break
                }
                if ("touchstart" == d.type && a === d.target) break
            }
            return b
        },
        _trigger: function() {
            var b = Array.prototype.slice.apply(arguments);
            return "string" == typeof b[0] && (b[0] = {
                type: b[0]
            }), b[0].instance = this, b[0].origin = this._$origin ? this._$origin[0] : null, b[0].tooltip = this._$tooltip ? this._$tooltip[0] : null, this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, b), a.tooltipster._trigger.apply(a.tooltipster, b), this.__$emitterPublic.trigger.apply(this.__$emitterPublic, b), this
        },
        _unplug: function(b) {
            var c = this;
            if (c[b]) {
                var d = a.tooltipster._plugin(b);
                d.instance && a.each(d.instance, function(a, d) {
                    c[a] && c[a].bridged === c[b] && delete c[a]
                }), c[b].__destroy && c[b].__destroy(), delete c[b]
            }
            return c
        },
        close: function(a) {
            return this.__destroyed ? this.__destroyError() : this._close(null, a), this
        },
        content: function(a) {
            var b = this;
            if (void 0 === a) return b.__Content;
            if (b.__destroyed) b.__destroyError();
            else if (b.__contentSet(a), null !== b.__Content) {
                if ("closed" !== b.__state && (b.__contentInsert(), b.reposition(), b.__options.updateAnimation))
                    if (h.hasTransitions) {
                        var c = b.__options.updateAnimation;
                        b._$tooltip.addClass("tooltipster-update-" + c), setTimeout(function() {
                            "closed" != b.__state && b._$tooltip.removeClass("tooltipster-update-" + c)
                        }, 1e3)
                    } else b._$tooltip.fadeTo(200, .5, function() {
                        "closed" != b.__state && b._$tooltip.fadeTo(200, 1)
                    })
            } else b._close();
            return b
        },
        destroy: function() {
            var b = this;
            return b.__destroyed ? b.__destroyError() : b.__destroying || (b.__destroying = !0, b._close(null, function() {
                b._trigger("destroy"), b.__destroying = !1, b.__destroyed = !0, b._$origin.removeData(b.__namespace).off("." + b.__namespace + "-triggerOpen"), a("body").off("." + b.__namespace + "-triggerOpen");
                var c = b._$origin.data("tooltipster-ns");
                if (c)
                    if (1 === c.length) {
                        var d = null;
                        "previous" == b.__options.restoration ? d = b._$origin.data("tooltipster-initialTitle") : "current" == b.__options.restoration && (d = "string" == typeof b.__Content ? b.__Content : a("<div></div>").append(b.__Content).html()), d && b._$origin.attr("title", d), b._$origin.removeClass("tooltipstered"), b._$origin.removeData("tooltipster-ns").removeData("tooltipster-initialTitle")
                    } else c = a.grep(c, function(a, c) {
                        return a !== b.__namespace
                    }), b._$origin.data("tooltipster-ns", c);
                b._trigger("destroyed"), b._off(), b.off(), b.__Content = null, b.__$emitterPrivate = null, b.__$emitterPublic = null, b.__options.parent = null, b._$origin = null, b._$tooltip = null, a.tooltipster.__instancesLatestArr = a.grep(a.tooltipster.__instancesLatestArr, function(a, c) {
                    return b !== a
                }), clearInterval(b.__garbageCollector)
            })), b
        },
        disable: function() {
            return this.__destroyed ? (this.__destroyError(), this) : (this._close(), this.__enabled = !1, this)
        },
        elementOrigin: function() {
            return this.__destroyed ? void this.__destroyError() : this._$origin[0]
        },
        elementTooltip: function() {
            return this._$tooltip ? this._$tooltip[0] : null
        },
        enable: function() {
            return this.__enabled = !0, this
        },
        hide: function(a) {
            return this.close(a)
        },
        instance: function() {
            return this
        },
        off: function() {
            return this.__destroyed || this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        },
        on: function() {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        },
        one: function() {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        },
        open: function(a) {
            return this.__destroyed || this.__destroying ? this.__destroyError() : this._open(null, a), this
        },
        option: function(b, c) {
            return void 0 === c ? this.__options[b] : (this.__destroyed ? this.__destroyError() : (this.__options[b] = c, this.__optionsFormat(), a.inArray(b, ["trigger", "triggerClose", "triggerOpen"]) >= 0 && this.__prepareOrigin(), "selfDestruction" === b && this.__prepareGC()), this)
        },
        reposition: function(a, b) {
            var c = this;
            return c.__destroyed ? c.__destroyError() : "closed" != c.__state && d(c._$origin) && (b || d(c._$tooltip)) && (b || c._$tooltip.detach(), c.__Geometry = c.__geometry(), c._trigger({
                type: "reposition",
                event: a,
                helper: {
                    geo: c.__Geometry
                }
            })), c
        },
        show: function(a) {
            return this.open(a)
        },
        status: function() {
            return {
                destroyed: this.__destroyed,
                destroying: this.__destroying,
                enabled: this.__enabled,
                open: "closed" !== this.__state,
                state: this.__state
            }
        },
        triggerHandler: function() {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }
    }, a.fn.tooltipster = function() {
        var b = Array.prototype.slice.apply(arguments),
            c = "You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.";
        if (0 === this.length) return this;
        if ("string" == typeof b[0]) {
            var d = "#*$~&";
            return this.each(function() {
                var e = a(this).data("tooltipster-ns"),
                    f = e ? a(this).data(e[0]) : null;
                if (!f) throw new Error("You called Tooltipster's \"" + b[0] + '" method on an uninitialized element');
                if ("function" != typeof f[b[0]]) throw new Error('Unknown method "' + b[0] + '"');
                this.length > 1 && "content" == b[0] && (b[1] instanceof a || "object" == typeof b[1] && null != b[1] && b[1].tagName) && !f.__options.contentCloning && f.__options.debug && console.log(c);
                var g = f[b[0]](b[1], b[2]);
                return g !== f || "instance" === b[0] ? (d = g, !1) : void 0
            }), "#*$~&" !== d ? d : this
        }
        a.tooltipster.__instancesLatestArr = [];
        var e = b[0] && void 0 !== b[0].multiple,
            g = e && b[0].multiple || !e && f.multiple,
            h = b[0] && void 0 !== b[0].content,
            i = h && b[0].content || !h && f.content,
            j = b[0] && void 0 !== b[0].contentCloning,
            k = j && b[0].contentCloning || !j && f.contentCloning,
            l = b[0] && void 0 !== b[0].debug,
            m = l && b[0].debug || !l && f.debug;
        return this.length > 1 && (i instanceof a || "object" == typeof i && null != i && i.tagName) && !k && m && console.log(c), this.each(function() {
            var c = !1,
                d = a(this),
                e = d.data("tooltipster-ns"),
                f = null;
            e ? g ? c = !0 : m && (console.log("Tooltipster: one or more tooltips are already attached to the element below. Ignoring."), console.log(this)) : c = !0, c && (f = new a.Tooltipster(this, b[0]), e || (e = []), e.push(f.__namespace), d.data("tooltipster-ns", e), d.data(f.__namespace, f), f.__options.functionInit && f.__options.functionInit.call(f, f, {
                origin: this
            }), f._trigger("init")), a.tooltipster.__instancesLatestArr.push(f)
        }), this
    }, b.prototype = {
        __init: function(b) {
            this.__$tooltip = b, this.__$tooltip.css({
                left: 0,
                overflow: "hidden",
                position: "absolute",
                top: 0
            }).find(".tooltipster-content").css("overflow", "auto"), this.$container = a('<div class="tooltipster-ruler"></div>').append(this.__$tooltip).appendTo("body")
        },
        __forceRedraw: function() {
            var a = this.__$tooltip.parent();
            this.__$tooltip.detach(), this.__$tooltip.appendTo(a)
        },
        constrain: function(a, b) {
            return this.constraints = {
                width: a,
                height: b
            }, this.__$tooltip.css({
                display: "block",
                height: "",
                overflow: "auto",
                width: a
            }), this
        },
        destroy: function() {
            this.__$tooltip.detach().find(".tooltipster-content").css({
                display: "",
                overflow: ""
            }), this.$container.remove()
        },
        free: function() {
            return this.constraints = null, this.__$tooltip.css({
                display: "",
                height: "",
                overflow: "visible",
                width: ""
            }), this
        },
        measure: function() {
            this.__forceRedraw();
            var a = this.__$tooltip[0].getBoundingClientRect(),
                b = {
                    size: {
                        height: a.height || a.bottom,
                        width: a.width || a.right
                    }
                };
            if (this.constraints) {
                var c = this.__$tooltip.find(".tooltipster-content"),
                    d = this.__$tooltip.outerHeight(),
                    e = c[0].getBoundingClientRect(),
                    f = {
                        height: d <= this.constraints.height,
                        width: a.width <= this.constraints.width && e.width >= c[0].scrollWidth - 1
                    };
                b.fits = f.height && f.width
            }
            return h.IE && h.IE <= 11 && b.size.width !== h.window.document.documentElement.clientWidth && (b.size.width = Math.ceil(b.size.width) + 1), b
        }
    };
    var j = navigator.userAgent.toLowerCase(); - 1 != j.indexOf("msie") ? h.IE = parseInt(j.split("msie")[1]) : -1 !== j.toLowerCase().indexOf("trident") && -1 !== j.indexOf(" rv:11") ? h.IE = 11 : -1 != j.toLowerCase().indexOf("edge/") && (h.IE = parseInt(j.toLowerCase().split("edge/")[1]));
    var k = "tooltipster.sideTip";
    return a.tooltipster._plugin({
        name: k,
        instance: {
            __defaults: function() {
                return {
                    arrow: !0,
                    distance: 6,
                    functionPosition: null,
                    maxWidth: null,
                    minIntersection: 16,
                    minWidth: 0,
                    position: null,
                    side: "top",
                    viewportAware: !0
                }
            },
            __init: function(a) {
                var b = this;
                b.__instance = a, b.__namespace = "tooltipster-sideTip-" + Math.round(1e6 * Math.random()), b.__previousState = "closed", b.__options, b.__optionsFormat(), b.__instance._on("state." + b.__namespace, function(a) {
                    "closed" == a.state ? b.__close() : "appearing" == a.state && "closed" == b.__previousState && b.__create(), b.__previousState = a.state
                }), b.__instance._on("options." + b.__namespace, function() {
                    b.__optionsFormat()
                }), b.__instance._on("reposition." + b.__namespace, function(a) {
                    b.__reposition(a.event, a.helper)
                })
            },
            __close: function() {
                this.__instance.content() instanceof a && this.__instance.content().detach(), this.__instance._$tooltip.remove(), this.__instance._$tooltip = null
            },
            __create: function() {
                var b = a('<div class="tooltipster-base tooltipster-sidetip"><div class="tooltipster-box"><div class="tooltipster-content"></div></div><div class="tooltipster-arrow"><div class="tooltipster-arrow-uncropped"><div class="tooltipster-arrow-border"></div><div class="tooltipster-arrow-background"></div></div></div></div>');
                this.__options.arrow || b.find(".tooltipster-box").css("margin", 0).end().find(".tooltipster-arrow").hide(), this.__options.minWidth && b.css("min-width", this.__options.minWidth + "px"), this.__options.maxWidth && b.css("max-width", this.__options.maxWidth + "px"), this.__instance._$tooltip = b, this.__instance._trigger("created")
            },
            __destroy: function() {
                this.__instance._off("." + self.__namespace)
            },
            __optionsFormat: function() {
                var b = this;
                if (b.__options = b.__instance._optionsExtract(k, b.__defaults()),
                    b.__options.position && (b.__options.side = b.__options.position), "object" != typeof b.__options.distance && (b.__options.distance = [b.__options.distance]), b.__options.distance.length < 4 && (void 0 === b.__options.distance[1] && (b.__options.distance[1] = b.__options.distance[0]), void 0 === b.__options.distance[2] && (b.__options.distance[2] = b.__options.distance[0]), void 0 === b.__options.distance[3] && (b.__options.distance[3] = b.__options.distance[1]), b.__options.distance = {
                        top: b.__options.distance[0],
                        right: b.__options.distance[1],
                        bottom: b.__options.distance[2],
                        left: b.__options.distance[3]
                    }), "string" == typeof b.__options.side) {
                    var c = {
                        top: "bottom",
                        right: "left",
                        bottom: "top",
                        left: "right"
                    };
                    b.__options.side = [b.__options.side, c[b.__options.side]], "left" == b.__options.side[0] || "right" == b.__options.side[0] ? b.__options.side.push("top", "bottom") : b.__options.side.push("right", "left")
                }
                6 === a.tooltipster._env.IE && b.__options.arrow !== !0 && (b.__options.arrow = !1)
            },
            __reposition: function(b, c) {
                var d, e = this,
                    f = e.__targetFind(c),
                    g = [];
                e.__instance._$tooltip.detach();
                var h = e.__instance._$tooltip.clone(),
                    i = a.tooltipster._getRuler(h),
                    j = !1,
                    k = e.__instance.option("animation");
                switch (k && h.removeClass("tooltipster-" + k), a.each(["window", "document"], function(d, k) {
                    var l = null;
                    if (e.__instance._trigger({
                            container: k,
                            helper: c,
                            satisfied: j,
                            takeTest: function(a) {
                                l = a
                            },
                            results: g,
                            type: "positionTest"
                        }), 1 == l || 0 != l && 0 == j && ("window" != k || e.__options.viewportAware))
                        for (var d = 0; d < e.__options.side.length; d++) {
                            var m = {
                                    horizontal: 0,
                                    vertical: 0
                                },
                                n = e.__options.side[d];
                            "top" == n || "bottom" == n ? m.vertical = e.__options.distance[n] : m.horizontal = e.__options.distance[n], e.__sideChange(h, n), a.each(["natural", "constrained"], function(a, d) {
                                if (l = null, e.__instance._trigger({
                                        container: k,
                                        event: b,
                                        helper: c,
                                        mode: d,
                                        results: g,
                                        satisfied: j,
                                        side: n,
                                        takeTest: function(a) {
                                            l = a
                                        },
                                        type: "positionTest"
                                    }), 1 == l || 0 != l && 0 == j) {
                                    var h = {
                                            container: k,
                                            distance: m,
                                            fits: null,
                                            mode: d,
                                            outerSize: null,
                                            side: n,
                                            size: null,
                                            target: f[n],
                                            whole: null
                                        },
                                        o = "natural" == d ? i.free() : i.constrain(c.geo.available[k][n].width - m.horizontal, c.geo.available[k][n].height - m.vertical),
                                        p = o.measure();
                                    if (h.size = p.size, h.outerSize = {
                                            height: p.size.height + m.vertical,
                                            width: p.size.width + m.horizontal
                                        }, "natural" == d ? c.geo.available[k][n].width >= h.outerSize.width && c.geo.available[k][n].height >= h.outerSize.height ? h.fits = !0 : h.fits = !1 : h.fits = p.fits, "window" == k && (h.fits ? "top" == n || "bottom" == n ? h.whole = c.geo.origin.windowOffset.right >= e.__options.minIntersection && c.geo.window.size.width - c.geo.origin.windowOffset.left >= e.__options.minIntersection : h.whole = c.geo.origin.windowOffset.bottom >= e.__options.minIntersection && c.geo.window.size.height - c.geo.origin.windowOffset.top >= e.__options.minIntersection : h.whole = !1), g.push(h), h.whole) j = !0;
                                    else if ("natural" == h.mode && (h.fits || h.size.width <= c.geo.available[k][n].width)) return !1
                                }
                            })
                        }
                }), e.__instance._trigger({
                    edit: function(a) {
                        g = a
                    },
                    event: b,
                    helper: c,
                    results: g,
                    type: "positionTested"
                }), g.sort(function(a, b) {
                    if (a.whole && !b.whole) return -1;
                    if (!a.whole && b.whole) return 1;
                    if (a.whole && b.whole) {
                        var c = e.__options.side.indexOf(a.side),
                            d = e.__options.side.indexOf(b.side);
                        return d > c ? -1 : c > d ? 1 : "natural" == a.mode ? -1 : 1
                    }
                    if (a.fits && !b.fits) return -1;
                    if (!a.fits && b.fits) return 1;
                    if (a.fits && b.fits) {
                        var c = e.__options.side.indexOf(a.side),
                            d = e.__options.side.indexOf(b.side);
                        return d > c ? -1 : c > d ? 1 : "natural" == a.mode ? -1 : 1
                    }
                    return "document" == a.container && "bottom" == a.side && "natural" == a.mode ? -1 : 1
                }), d = g[0], d.coord = {}, d.side) {
                    case "left":
                    case "right":
                        d.coord.top = Math.floor(d.target - d.size.height / 2);
                        break;
                    case "bottom":
                    case "top":
                        d.coord.left = Math.floor(d.target - d.size.width / 2)
                }
                switch (d.side) {
                    case "left":
                        d.coord.left = c.geo.origin.windowOffset.left - d.outerSize.width;
                        break;
                    case "right":
                        d.coord.left = c.geo.origin.windowOffset.right + d.distance.horizontal;
                        break;
                    case "top":
                        d.coord.top = c.geo.origin.windowOffset.top - d.outerSize.height;
                        break;
                    case "bottom":
                        d.coord.top = c.geo.origin.windowOffset.bottom + d.distance.vertical
                }
                "window" == d.container ? "top" == d.side || "bottom" == d.side ? d.coord.left < 0 ? c.geo.origin.windowOffset.right - this.__options.minIntersection >= 0 ? d.coord.left = 0 : d.coord.left = c.geo.origin.windowOffset.right - this.__options.minIntersection - 1 : d.coord.left > c.geo.window.size.width - d.size.width && (c.geo.origin.windowOffset.left + this.__options.minIntersection <= c.geo.window.size.width ? d.coord.left = c.geo.window.size.width - d.size.width : d.coord.left = c.geo.origin.windowOffset.left + this.__options.minIntersection + 1 - d.size.width) : d.coord.top < 0 ? c.geo.origin.windowOffset.bottom - this.__options.minIntersection >= 0 ? d.coord.top = 0 : d.coord.top = c.geo.origin.windowOffset.bottom - this.__options.minIntersection - 1 : d.coord.top > c.geo.window.size.height - d.size.height && (c.geo.origin.windowOffset.top + this.__options.minIntersection <= c.geo.window.size.height ? d.coord.top = c.geo.window.size.height - d.size.height : d.coord.top = c.geo.origin.windowOffset.top + this.__options.minIntersection + 1 - d.size.height) : (d.coord.left > c.geo.window.size.width - d.size.width && (d.coord.left = c.geo.window.size.width - d.size.width), d.coord.left < 0 && (d.coord.left = 0)), e.__sideChange(h, d.side), c.tooltipClone = h[0], c.tooltipParent = e.__instance.option("parent").parent[0], c.mode = d.mode, c.whole = d.whole, c.origin = e.__instance._$origin[0], c.tooltip = e.__instance._$tooltip[0], delete d.container, delete d.fits, delete d.mode, delete d.outerSize, delete d.whole, d.distance = d.distance.horizontal || d.distance.vertical;
                var l = a.extend(!0, {}, d);
                if (e.__instance._trigger({
                        edit: function(a) {
                            d = a
                        },
                        event: b,
                        helper: c,
                        position: l,
                        type: "position"
                    }), e.__options.functionPosition) {
                    var m = e.__options.functionPosition.call(e, e.__instance, c, l);
                    m && (d = m)
                }
                i.destroy();
                var n, o;
                "top" == d.side || "bottom" == d.side ? (n = {
                    prop: "left",
                    val: d.target - d.coord.left
                }, o = d.size.width - this.__options.minIntersection) : (n = {
                    prop: "top",
                    val: d.target - d.coord.top
                }, o = d.size.height - this.__options.minIntersection), n.val < this.__options.minIntersection ? n.val = this.__options.minIntersection : n.val > o && (n.val = o);
                var p;
                p = c.geo.origin.fixedLineage ? c.geo.origin.windowOffset : {
                    left: c.geo.origin.windowOffset.left + c.geo.window.scroll.left,
                    top: c.geo.origin.windowOffset.top + c.geo.window.scroll.top
                }, d.coord = {
                    left: p.left + (d.coord.left - c.geo.origin.windowOffset.left),
                    top: p.top + (d.coord.top - c.geo.origin.windowOffset.top)
                }, e.__sideChange(e.__instance._$tooltip, d.side), c.geo.origin.fixedLineage ? e.__instance._$tooltip.css("position", "fixed") : e.__instance._$tooltip.css("position", ""), e.__instance._$tooltip.css({
                    left: d.coord.left,
                    top: d.coord.top,
                    height: d.size.height,
                    width: d.size.width
                }).find(".tooltipster-arrow").css({
                    left: "",
                    top: ""
                }).css(n.prop, n.val), e.__instance._$tooltip.appendTo(e.__instance.option("parent")), e.__instance._trigger({
                    type: "repositioned",
                    event: b,
                    position: d
                })
            },
            __sideChange: function(a, b) {
                a.removeClass("tooltipster-bottom").removeClass("tooltipster-left").removeClass("tooltipster-right").removeClass("tooltipster-top").addClass("tooltipster-" + b)
            },
            __targetFind: function(a) {
                var b = {},
                    c = this.__instance._$origin[0].getClientRects();
                if (c.length > 1) {
                    var d = this.__instance._$origin.css("opacity");
                    1 == d && (this.__instance._$origin.css("opacity", .99), c = this.__instance._$origin[0].getClientRects(), this.__instance._$origin.css("opacity", 1))
                }
                if (c.length < 2) b.top = Math.floor(a.geo.origin.windowOffset.left + a.geo.origin.size.width / 2), b.bottom = b.top, b.left = Math.floor(a.geo.origin.windowOffset.top + a.geo.origin.size.height / 2), b.right = b.left;
                else {
                    var e = c[0];
                    b.top = Math.floor(e.left + (e.right - e.left) / 2), e = c.length > 2 ? c[Math.ceil(c.length / 2) - 1] : c[0], b.right = Math.floor(e.top + (e.bottom - e.top) / 2), e = c[c.length - 1], b.bottom = Math.floor(e.left + (e.right - e.left) / 2), e = c.length > 2 ? c[Math.ceil((c.length + 1) / 2) - 1] : c[c.length - 1], b.left = Math.floor(e.top + (e.bottom - e.top) / 2)
                }
                return b
            }
        }
    }), a
});
/**jscolor*/
"use strict";
window.jscolor || (window.jscolor = function() {
    var e = {
        register: function() {
            e.attachDOMReadyEvent(e.init), e.attachEvent(document, "mousedown", e.onDocumentMouseDown), e.attachEvent(document, "touchstart", e.onDocumentTouchStart), e.attachEvent(window, "resize", e.onWindowResize)
        },
        init: function() {
            e.jscolor.lookupClass && e.jscolor.installByClassName(e.jscolor.lookupClass)
        },
        tryInstallOnElements: function(t, n) {
            var r = new RegExp("(^|\\s)(" + n + ")(\\s*(\\{[^}]*\\})|\\s|$)", "i");
            for (var i = 0; i < t.length; i += 1) {
                if (t[i].type !== undefined && t[i].type.toLowerCase() == "color" && e.isColorAttrSupported) continue;
                var s;
                if (!t[i].jscolor && t[i].className && (s = t[i].className.match(r))) {
                    var o = t[i],
                        u = null,
                        a = e.getDataAttr(o, "jscolor");
                    a !== null ? u = a : s[4] && (u = s[4]);
                    var f = {};
                    if (u) try {
                        f = (new Function("return (" + u + ")"))()
                    } catch (l) {
                        e.warn("Error parsing jscolor options: " + l + ":\n" + u)
                    }
                    o.jscolor = new e.jscolor(o, f)
                }
            }
        },
        isColorAttrSupported: function() {
            var e = document.createElement("input");
            if (e.setAttribute) {
                e.setAttribute("type", "color");
                if (e.type.toLowerCase() == "color") return !0
            }
            return !1
        }(),
        isCanvasSupported: function() {
            var e = document.createElement("canvas");
            return !!e.getContext && !!e.getContext("2d")
        }(),
        fetchElement: function(e) {
            return typeof e == "string" ? document.getElementById(e) : e
        },
        isElementType: function(e, t) {
            return e.nodeName.toLowerCase() === t.toLowerCase()
        },
        getDataAttr: function(e, t) {
            var n = "data-" + t,
                r = e.getAttribute(n);
            return r !== null ? r : null
        },
        attachEvent: function(e, t, n) {
            e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent && e.attachEvent("on" + t, n)
        },
        detachEvent: function(e, t, n) {
            e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent && e.detachEvent("on" + t, n)
        },
        _attachedGroupEvents: {},
        attachGroupEvent: function(t, n, r, i) {
            e._attachedGroupEvents.hasOwnProperty(t) || (e._attachedGroupEvents[t] = []), e._attachedGroupEvents[t].push([n, r, i]), e.attachEvent(n, r, i)
        },
        detachGroupEvents: function(t) {
            if (e._attachedGroupEvents.hasOwnProperty(t)) {
                for (var n = 0; n < e._attachedGroupEvents[t].length; n += 1) {
                    var r = e._attachedGroupEvents[t][n];
                    e.detachEvent(r[0], r[1], r[2])
                }
                delete e._attachedGroupEvents[t]
            }
        },
        attachDOMReadyEvent: function(e) {
            var t = !1,
                n = function() {
                    t || (t = !0, e())
                };
            if (document.readyState === "complete") {
                setTimeout(n, 1);
                return
            }
            if (document.addEventListener) document.addEventListener("DOMContentLoaded", n, !1), window.addEventListener("load", n, !1);
            else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", function() {
                    document.readyState === "complete" && (document.detachEvent("onreadystatechange", arguments.callee), n())
                }), window.attachEvent("onload", n);
                if (document.documentElement.doScroll && window == window.top) {
                    var r = function() {
                        if (!document.body) return;
                        try {
                            document.documentElement.doScroll("left"), n()
                        } catch (e) {
                            setTimeout(r, 1)
                        }
                    };
                    r()
                }
            }
        },
        warn: function(e) {
            window.console && window.console.warn && window.console.warn(e)
        },
        preventDefault: function(e) {
            e.preventDefault && e.preventDefault(), e.returnValue = !1
        },
        captureTarget: function(t) {
            t.setCapture && (e._capturedTarget = t, e._capturedTarget.setCapture())
        },
        releaseTarget: function() {
            e._capturedTarget && (e._capturedTarget.releaseCapture(), e._capturedTarget = null)
        },
        fireEvent: function(e, t) {
            if (!e) return;
            if (document.createEvent) {
                var n = document.createEvent("HTMLEvents");
                n.initEvent(t, !0, !0), e.dispatchEvent(n)
            } else if (document.createEventObject) {
                var n = document.createEventObject();
                e.fireEvent("on" + t, n)
            } else e["on" + t] && e["on" + t]()
        },
        classNameToList: function(e) {
            return e.replace(/^\s+|\s+$/g, "").split(/\s+/)
        },
        hasClass: function(e, t) {
            return t ? -1 != (" " + e.className.replace(/\s+/g, " ") + " ").indexOf(" " + t + " ") : !1
        },
        setClass: function(t, n) {
            var r = e.classNameToList(n);
            for (var i = 0; i < r.length; i += 1) e.hasClass(t, r[i]) || (t.className += (t.className ? " " : "") + r[i])
        },
        unsetClass: function(t, n) {
            var r = e.classNameToList(n);
            for (var i = 0; i < r.length; i += 1) {
                var s = new RegExp("^\\s*" + r[i] + "\\s*|" + "\\s*" + r[i] + "\\s*$|" + "\\s+" + r[i] + "(\\s+)", "g");
                t.className = t.className.replace(s, "$1")
            }
        },
        getStyle: function(e) {
            return window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle
        },
        setStyle: function() {
            var e = document.createElement("div"),
                t = function(t) {
                    for (var n = 0; n < t.length; n += 1)
                        if (t[n] in e.style) return t[n]
                },
                n = {
                    borderRadius: t(["borderRadius", "MozBorderRadius", "webkitBorderRadius"]),
                    boxShadow: t(["boxShadow", "MozBoxShadow", "webkitBoxShadow"])
                };
            return function(e, t, r) {
                switch (t.toLowerCase()) {
                    case "opacity":
                        var i = Math.round(parseFloat(r) * 100);
                        e.style.opacity = r, e.style.filter = "alpha(opacity=" + i + ")";
                        break;
                    default:
                        e.style[n[t]] = r
                }
            }
        }(),
        setBorderRadius: function(t, n) {
            e.setStyle(t, "borderRadius", n || "0")
        },
        setBoxShadow: function(t, n) {
            e.setStyle(t, "boxShadow", n || "none")
        },
        getElementPos: function(t, n) {
            var r = 0,
                i = 0,
                s = t.getBoundingClientRect();
            r = s.left, i = s.top;
            if (!n) {
                var o = e.getViewPos();
                r += o[0], i += o[1]
            }
            return [r, i]
        },
        getElementSize: function(e) {
            return [e.offsetWidth, e.offsetHeight]
        },
        getAbsPointerPos: function(e) {
            e || (e = window.event);
            var t = 0,
                n = 0;
            return typeof e.changedTouches != "undefined" && e.changedTouches.length ? (t = e.changedTouches[0].clientX, n = e.changedTouches[0].clientY) : typeof e.clientX == "number" && (t = e.clientX, n = e.clientY), {
                x: t,
                y: n
            }
        },
        getRelPointerPos: function(e) {
            e || (e = window.event);
            var t = e.target || e.srcElement,
                n = t.getBoundingClientRect(),
                r = 0,
                i = 0,
                s = 0,
                o = 0;
            return typeof e.changedTouches != "undefined" && e.changedTouches.length ? (s = e.changedTouches[0].clientX, o = e.changedTouches[0].clientY) : typeof e.clientX == "number" && (s = e.clientX, o = e.clientY), r = s - n.left, i = o - n.top, {
                x: r,
                y: i
            }
        },
        getViewPos: function() {
            var e = document.documentElement;
            return [(window.pageXOffset || e.scrollLeft) - (e.clientLeft || 0), (window.pageYOffset || e.scrollTop) - (e.clientTop || 0)]
        },
        getViewSize: function() {
            var e = document.documentElement;
            return [window.innerWidth || e.clientWidth, window.innerHeight || e.clientHeight]
        },
        redrawPosition: function() {
            if (e.picker && e.picker.owner) {
                var t = e.picker.owner,
                    n, r;
                t.fixed ? (n = e.getElementPos(t.targetElement, !0), r = [0, 0]) : (n = e.getElementPos(t.targetElement), r = e.getViewPos());
                var i = e.getElementSize(t.targetElement),
                    s = e.getViewSize(),
                    o = e.getPickerOuterDims(t),
                    u, a, f;
                switch (t.position.toLowerCase()) {
                    case "left":
                        u = 1, a = 0, f = -1;
                        break;
                    case "right":
                        u = 1, a = 0, f = 1;
                        break;
                    case "top":
                        u = 0, a = 1, f = -1;
                        break;
                    default:
                        u = 0, a = 1, f = 1
                }
                var l = (i[a] + o[a]) / 2;
                if (!t.smartPosition) var c = [n[u], n[a] + i[a] - l + l * f];
                else var c = [-r[u] + n[u] + o[u] > s[u] ? -r[u] + n[u] + i[u] / 2 > s[u] / 2 && n[u] + i[u] - o[u] >= 0 ? n[u] + i[u] - o[u] : n[u] : n[u], -r[a] + n[a] + i[a] + o[a] - l + l * f > s[a] ? -r[a] + n[a] + i[a] / 2 > s[a] / 2 && n[a] + i[a] - l - l * f >= 0 ? n[a] + i[a] - l - l * f : n[a] + i[a] - l + l * f : n[a] + i[a] - l + l * f >= 0 ? n[a] + i[a] - l + l * f : n[a] + i[a] - l - l * f];
                var h = c[u],
                    p = c[a],
                    d = t.fixed ? "fixed" : "absolute",
                    v = (c[0] + o[0] > n[0] || c[0] < n[0] + i[0]) && c[1] + o[1] < n[1] + i[1];
                e._drawPosition(t, h, p, d, v)
            }
        },
        _drawPosition: function(t, n, r, i, s) {
            var o = s ? 0 : t.shadowBlur;
            e.picker.wrap.style.position = i, e.picker.wrap.style.left = n + "px", e.picker.wrap.style.top = r + "px", e.setBoxShadow(e.picker.boxS, t.shadow ? new e.BoxShadow(0, o, t.shadowBlur, 0, t.shadowColor) : null)
        },
        getPickerDims: function(t) {
            var n = !!e.getSliderComponent(t),
                r = [2 * t.insetWidth + 2 * t.padding + t.width + (n ? 2 * t.insetWidth + e.getPadToSliderPadding(t) + t.sliderSize : 0), 2 * t.insetWidth + 2 * t.padding + t.height + (t.closable ? 2 * t.insetWidth + t.padding + t.buttonHeight : 0)];
            return r
        },
        getPickerOuterDims: function(t) {
            var n = e.getPickerDims(t);
            return [n[0] + 2 * t.borderWidth, n[1] + 2 * t.borderWidth]
        },
        getPadToSliderPadding: function(e) {
            return Math.max(e.padding, 1.5 * (2 * e.pointerBorderWidth + e.pointerThickness))
        },
        getPadYComponent: function(e) {
            switch (e.mode.charAt(1).toLowerCase()) {
                case "v":
                    return "v"
            }
            return "s"
        },
        getSliderComponent: function(e) {
            if (e.mode.length > 2) switch (e.mode.charAt(2).toLowerCase()) {
                case "s":
                    return "s";
                case "v":
                    return "v"
            }
            return null
        },
        onDocumentMouseDown: function(t) {
            t || (t = window.event);
            var n = t.target || t.srcElement;
            n._jscLinkedInstance ? n._jscLinkedInstance.showOnClick && n._jscLinkedInstance.show() : n._jscControlName ? e.onControlPointerStart(t, n, n._jscControlName, "mouse") : e.picker && e.picker.owner && e.picker.owner.hide()
        },
        onDocumentTouchStart: function(t) {
            t || (t = window.event);
            var n = t.target || t.srcElement;
            n._jscLinkedInstance ? n._jscLinkedInstance.showOnClick && n._jscLinkedInstance.show() : n._jscControlName ? e.onControlPointerStart(t, n, n._jscControlName, "touch") : e.picker && e.picker.owner && e.picker.owner.hide()
        },
        onWindowResize: function(t) {
            e.redrawPosition()
        },
        onParentScroll: function(t) {
            e.picker && e.picker.owner && e.picker.owner.hide()
        },
        _pointerMoveEvent: {
            mouse: "mousemove",
            touch: "touchmove"
        },
        _pointerEndEvent: {
            mouse: "mouseup",
            touch: "touchend"
        },
        _pointerOrigin: null,
        _capturedTarget: null,
        onControlPointerStart: function(t, n, r, i) {
            var s = n._jscInstance;
            e.preventDefault(t), e.captureTarget(n);
            var o = function(s, o) {
                e.attachGroupEvent("drag", s, e._pointerMoveEvent[i], e.onDocumentPointerMove(t, n, r, i, o)), e.attachGroupEvent("drag", s, e._pointerEndEvent[i], e.onDocumentPointerEnd(t, n, r, i))
            };
            o(document, [0, 0]);
            if (window.parent && window.frameElement) {
                var u = window.frameElement.getBoundingClientRect(),
                    a = [-u.left, -u.top];
                o(window.parent.window.document, a)
            }
            var f = e.getAbsPointerPos(t),
                l = e.getRelPointerPos(t);
            e._pointerOrigin = {
                x: f.x - l.x,
                y: f.y - l.y
            };
            switch (r) {
                case "pad":
                    switch (e.getSliderComponent(s)) {
                        case "s":
                            s.hsv[1] === 0 && s.fromHSV(null, 100, null);
                            break;
                        case "v":
                            s.hsv[2] === 0 && s.fromHSV(null, null, 100)
                    }
                    e.setPad(s, t, 0, 0);
                    break;
                case "sld":
                    e.setSld(s, t, 0)
            }
            e.dispatchFineChange(s)
        },
        onDocumentPointerMove: function(t, n, r, i, s) {
            return function(t) {
                var i = n._jscInstance;
                switch (r) {
                    case "pad":
                        t || (t = window.event), e.setPad(i, t, s[0], s[1]), e.dispatchFineChange(i);
                        break;
                    case "sld":
                        t || (t = window.event), e.setSld(i, t, s[1]), e.dispatchFineChange(i)
                }
            }
        },
        onDocumentPointerEnd: function(t, n, r, i) {
            return function(t) {
                var r = n._jscInstance;
                e.detachGroupEvents("drag"), e.releaseTarget(), e.dispatchChange(r)
            }
        },
        dispatchChange: function(t) {
            t.valueElement && e.isElementType(t.valueElement, "input") && e.fireEvent(t.valueElement, "change")
        },
        dispatchFineChange: function(e) {
            if (e.onFineChange) {
                var t;
                typeof e.onFineChange == "string" ? t = new Function(e.onFineChange) : t = e.onFineChange, t.call(e)
            }
        },
        setPad: function(t, n, r, i) {
            var s = e.getAbsPointerPos(n),
                o = r + s.x - e._pointerOrigin.x - t.padding - t.insetWidth,
                u = i + s.y - e._pointerOrigin.y - t.padding - t.insetWidth,
                a = o * (360 / (t.width - 1)),
                f = 100 - u * (100 / (t.height - 1));
            switch (e.getPadYComponent(t)) {
                case "s":
                    t.fromHSV(a, f, null, e.leaveSld);
                    break;
                case "v":
                    t.fromHSV(a, null, f, e.leaveSld)
            }
        },
        setSld: function(t, n, r) {
            var i = e.getAbsPointerPos(n),
                s = r + i.y - e._pointerOrigin.y - t.padding - t.insetWidth,
                o = 100 - s * (100 / (t.height - 1));
            switch (e.getSliderComponent(t)) {
                case "s":
                    t.fromHSV(null, o, null, e.leavePad);
                    break;
                case "v":
                    t.fromHSV(null, null, o, e.leavePad)
            }
        },
        _vmlNS: "jsc_vml_",
        _vmlCSS: "jsc_vml_css_",
        _vmlReady: !1,
        initVML: function() {
            if (!e._vmlReady) {
                var t = document;
                t.namespaces[e._vmlNS] || t.namespaces.add(e._vmlNS, "urn:schemas-microsoft-com:vml");
                if (!t.styleSheets[e._vmlCSS]) {
                    var n = ["shape", "shapetype", "group", "background", "path", "formulas", "handles", "fill", "stroke", "shadow", "textbox", "textpath", "imagedata", "line", "polyline", "curve", "rect", "roundrect", "oval", "arc", "image"],
                        r = t.createStyleSheet();
                    r.owningElement.id = e._vmlCSS;
                    for (var i = 0; i < n.length; i += 1) r.addRule(e._vmlNS + "\\:" + n[i], "behavior:url(#default#VML);")
                }
                e._vmlReady = !0
            }
        },
        createPalette: function() {
            var t = {
                elm: null,
                draw: null
            };
            if (e.isCanvasSupported) {
                var n = document.createElement("canvas"),
                    r = n.getContext("2d"),
                    i = function(e, t, i) {
                        n.width = e, n.height = t, r.clearRect(0, 0, n.width, n.height);
                        var s = r.createLinearGradient(0, 0, n.width, 0);
                        s.addColorStop(0, "#F00"), s.addColorStop(1 / 6, "#FF0"), s.addColorStop(2 / 6, "#0F0"), s.addColorStop(.5, "#0FF"), s.addColorStop(4 / 6, "#00F"), s.addColorStop(5 / 6, "#F0F"), s.addColorStop(1, "#F00"), r.fillStyle = s, r.fillRect(0, 0, n.width, n.height);
                        var o = r.createLinearGradient(0, 0, 0, n.height);
                        switch (i.toLowerCase()) {
                            case "s":
                                o.addColorStop(0, "rgba(255,255,255,0)"), o.addColorStop(1, "rgba(255,255,255,1)");
                                break;
                            case "v":
                                o.addColorStop(0, "rgba(0,0,0,0)"), o.addColorStop(1, "rgba(0,0,0,1)")
                        }
                        r.fillStyle = o, r.fillRect(0, 0, n.width, n.height)
                    };
                t.elm = n, t.draw = i
            } else {
                e.initVML();
                var s = document.createElement("div");
                s.style.position = "relative", s.style.overflow = "hidden";
                var o = document.createElement(e._vmlNS + ":fill");
                o.type = "gradient", o.method = "linear", o.angle = "90", o.colors = "16.67% #F0F, 33.33% #00F, 50% #0FF, 66.67% #0F0, 83.33% #FF0";
                var u = document.createElement(e._vmlNS + ":rect");
                u.style.position = "absolute", u.style.left = "-1px", u.style.top = "-1px", u.stroked = !1, u.appendChild(o), s.appendChild(u);
                var a = document.createElement(e._vmlNS + ":fill");
                a.type = "gradient", a.method = "linear", a.angle = "180", a.opacity = "0";
                var f = document.createElement(e._vmlNS + ":rect");
                f.style.position = "absolute", f.style.left = "-1px", f.style.top = "-1px", f.stroked = !1, f.appendChild(a), s.appendChild(f);
                var i = function(e, t, n) {
                    s.style.width = e + "px", s.style.height = t + "px", u.style.width = f.style.width = e + 1 + "px", u.style.height = f.style.height = t + 1 + "px", o.color = "#F00", o.color2 = "#F00";
                    switch (n.toLowerCase()) {
                        case "s":
                            a.color = a.color2 = "#FFF";
                            break;
                        case "v":
                            a.color = a.color2 = "#000"
                    }
                };
                t.elm = s, t.draw = i
            }
            return t
        },
        createSliderGradient: function() {
            var t = {
                elm: null,
                draw: null
            };
            if (e.isCanvasSupported) {
                var n = document.createElement("canvas"),
                    r = n.getContext("2d"),
                    i = function(e, t, i, s) {
                        n.width = e, n.height = t, r.clearRect(0, 0, n.width, n.height);
                        var o = r.createLinearGradient(0, 0, 0, n.height);
                        o.addColorStop(0, i), o.addColorStop(1, s), r.fillStyle = o, r.fillRect(0, 0, n.width, n.height)
                    };
                t.elm = n, t.draw = i
            } else {
                e.initVML();
                var s = document.createElement("div");
                s.style.position = "relative", s.style.overflow = "hidden";
                var o = document.createElement(e._vmlNS + ":fill");
                o.type = "gradient", o.method = "linear", o.angle = "180";
                var u = document.createElement(e._vmlNS + ":rect");
                u.style.position = "absolute", u.style.left = "-1px", u.style.top = "-1px", u.stroked = !1, u.appendChild(o), s.appendChild(u);
                var i = function(e, t, n, r) {
                    s.style.width = e + "px", s.style.height = t + "px", u.style.width = e + 1 + "px", u.style.height = t + 1 + "px", o.color = n, o.color2 = r
                };
                t.elm = s, t.draw = i
            }
            return t
        },
        leaveValue: 1,
        leaveStyle: 2,
        leavePad: 4,
        leaveSld: 8,
        BoxShadow: function() {
            var e = function(e, t, n, r, i, s) {
                this.hShadow = e, this.vShadow = t, this.blur = n, this.spread = r, this.color = i, this.inset = !!s
            };
            return e.prototype.toString = function() {
                var e = [Math.round(this.hShadow) + "px", Math.round(this.vShadow) + "px", Math.round(this.blur) + "px", Math.round(this.spread) + "px", this.color];
                return this.inset && e.push("inset"), e.join(" ")
            }, e
        }(),
        jscolor: function(t, n) {
            function i(e, t, n) {
                e /= 255, t /= 255, n /= 255;
                var r = Math.min(Math.min(e, t), n),
                    i = Math.max(Math.max(e, t), n),
                    s = i - r;
                if (s === 0) return [null, 0, 100 * i];
                var o = e === r ? 3 + (n - t) / s : t === r ? 5 + (e - n) / s : 1 + (t - e) / s;
                return [60 * (o === 6 ? 0 : o), 100 * (s / i), 100 * i]
            }

            function s(e, t, n) {
                var r = 255 * (n / 100);
                if (e === null) return [r, r, r];
                e /= 60, t /= 100;
                var i = Math.floor(e),
                    s = i % 2 ? e - i : 1 - (e - i),
                    o = r * (1 - t),
                    u = r * (1 - t * s);
                switch (i) {
                    case 6:
                    case 0:
                        return [r, u, o];
                    case 1:
                        return [u, r, o];
                    case 2:
                        return [o, r, u];
                    case 3:
                        return [o, u, r];
                    case 4:
                        return [u, o, r];
                    case 5:
                        return [r, o, u]
                }
            }

            function o() {
                e.unsetClass(d.targetElement, d.activeClass), e.picker.wrap.parentNode.removeChild(e.picker.wrap), delete e.picker.owner
            }

            function u() {
                function l() {
                    var e = d.insetColor.split(/\s+/),
                        n = e.length < 2 ? e[0] : e[1] + " " + e[0] + " " + e[0] + " " + e[1];
                    t.btn.style.borderColor = n
                }
                d._processParentElementsInDOM(), e.picker || (e.picker = {
                    owner: null,
                    wrap: document.createElement("div"),
                    box: document.createElement("div"),
                    boxS: document.createElement("div"),
                    boxB: document.createElement("div"),
                    pad: document.createElement("div"),
                    padB: document.createElement("div"),
                    padM: document.createElement("div"),
                    padPal: e.createPalette(),
                    cross: document.createElement("div"),
                    crossBY: document.createElement("div"),
                    crossBX: document.createElement("div"),
                    crossLY: document.createElement("div"),
                    crossLX: document.createElement("div"),
                    sld: document.createElement("div"),
                    sldB: document.createElement("div"),
                    sldM: document.createElement("div"),
                    sldGrad: e.createSliderGradient(),
                    sldPtrS: document.createElement("div"),
                    sldPtrIB: document.createElement("div"),
                    sldPtrMB: document.createElement("div"),
                    sldPtrOB: document.createElement("div"),
                    btn: document.createElement("div"),
                    btnT: document.createElement("span")
                }, e.picker.pad.appendChild(e.picker.padPal.elm), e.picker.padB.appendChild(e.picker.pad), e.picker.cross.appendChild(e.picker.crossBY), e.picker.cross.appendChild(e.picker.crossBX), e.picker.cross.appendChild(e.picker.crossLY), e.picker.cross.appendChild(e.picker.crossLX), e.picker.padB.appendChild(e.picker.cross), e.picker.box.appendChild(e.picker.padB), e.picker.box.appendChild(e.picker.padM), e.picker.sld.appendChild(e.picker.sldGrad.elm), e.picker.sldB.appendChild(e.picker.sld), e.picker.sldB.appendChild(e.picker.sldPtrOB), e.picker.sldPtrOB.appendChild(e.picker.sldPtrMB), e.picker.sldPtrMB.appendChild(e.picker.sldPtrIB), e.picker.sldPtrIB.appendChild(e.picker.sldPtrS), e.picker.box.appendChild(e.picker.sldB), e.picker.box.appendChild(e.picker.sldM), e.picker.btn.appendChild(e.picker.btnT), e.picker.box.appendChild(e.picker.btn), e.picker.boxB.appendChild(e.picker.box), e.picker.wrap.appendChild(e.picker.boxS), e.picker.wrap.appendChild(e.picker.boxB));
                var t = e.picker,
                    n = !!e.getSliderComponent(d),
                    r = e.getPickerDims(d),
                    i = 2 * d.pointerBorderWidth + d.pointerThickness + 2 * d.crossSize,
                    s = e.getPadToSliderPadding(d),
                    o = Math.min(d.borderRadius, Math.round(d.padding * Math.PI)),
                    u = "crosshair";
                t.wrap.style.clear = "both", t.wrap.style.width = r[0] + 2 * d.borderWidth + "px", t.wrap.style.height = r[1] + 2 * d.borderWidth + "px", t.wrap.style.zIndex = d.zIndex, t.box.style.width = r[0] + "px", t.box.style.height = r[1] + "px", t.boxS.style.position = "absolute", t.boxS.style.left = "0", t.boxS.style.top = "0", t.boxS.style.width = "100%", t.boxS.style.height = "100%", e.setBorderRadius(t.boxS, o + "px"), t.boxB.style.position = "relative", t.boxB.style.border = d.borderWidth + "px solid", t.boxB.style.borderColor = d.borderColor, t.boxB.style.background = d.backgroundColor, e.setBorderRadius(t.boxB, o + "px"), t.padM.style.background = t.sldM.style.background = "#FFF", e.setStyle(t.padM, "opacity", "0"), e.setStyle(t.sldM, "opacity", "0"), t.pad.style.position = "relative", t.pad.style.width = d.width + "px", t.pad.style.height = d.height + "px", t.padPal.draw(d.width, d.height, e.getPadYComponent(d)), t.padB.style.position = "absolute", t.padB.style.left = d.padding + "px", t.padB.style.top = d.padding + "px", t.padB.style.border = d.insetWidth + "px solid", t.padB.style.borderColor = d.insetColor, t.padM._jscInstance = d, t.padM._jscControlName = "pad", t.padM.style.position = "absolute", t.padM.style.left = "0", t.padM.style.top = "0", t.padM.style.width = d.padding + 2 * d.insetWidth + d.width + s / 2 + "px", t.padM.style.height = r[1] + "px", t.padM.style.cursor = u, t.cross.style.position = "absolute", t.cross.style.left = t.cross.style.top = "0", t.cross.style.width = t.cross.style.height = i + "px", t.crossBY.style.position = t.crossBX.style.position = "absolute", t.crossBY.style.background = t.crossBX.style.background = d.pointerBorderColor, t.crossBY.style.width = t.crossBX.style.height = 2 * d.pointerBorderWidth + d.pointerThickness + "px", t.crossBY.style.height = t.crossBX.style.width = i + "px", t.crossBY.style.left = t.crossBX.style.top = Math.floor(i / 2) - Math.floor(d.pointerThickness / 2) - d.pointerBorderWidth + "px", t.crossBY.style.top = t.crossBX.style.left = "0", t.crossLY.style.position = t.crossLX.style.position = "absolute", t.crossLY.style.background = t.crossLX.style.background = d.pointerColor, t.crossLY.style.height = t.crossLX.style.width = i - 2 * d.pointerBorderWidth + "px", t.crossLY.style.width = t.crossLX.style.height = d.pointerThickness + "px", t.crossLY.style.left = t.crossLX.style.top = Math.floor(i / 2) - Math.floor(d.pointerThickness / 2) + "px", t.crossLY.style.top = t.crossLX.style.left = d.pointerBorderWidth + "px", t.sld.style.overflow = "hidden", t.sld.style.width = d.sliderSize + "px", t.sld.style.height = d.height + "px", t.sldGrad.draw(d.sliderSize, d.height, "#000", "#000"), t.sldB.style.display = n ? "block" : "none", t.sldB.style.position = "absolute", t.sldB.style.right = d.padding + "px", t.sldB.style.top = d.padding + "px", t.sldB.style.border = d.insetWidth + "px solid", t.sldB.style.borderColor = d.insetColor, t.sldM._jscInstance = d, t.sldM._jscControlName = "sld", t.sldM.style.display = n ? "block" : "none", t.sldM.style.position = "absolute", t.sldM.style.right = "0", t.sldM.style.top = "0", t.sldM.style.width = d.sliderSize + s / 2 + d.padding + 2 * d.insetWidth + "px", t.sldM.style.height = r[1] + "px", t.sldM.style.cursor = "default", t.sldPtrIB.style.border = t.sldPtrOB.style.border = d.pointerBorderWidth + "px solid " + d.pointerBorderColor, t.sldPtrOB.style.position = "absolute", t.sldPtrOB.style.left = -(2 * d.pointerBorderWidth + d.pointerThickness) + "px", t.sldPtrOB.style.top = "0", t.sldPtrMB.style.border = d.pointerThickness + "px solid " + d.pointerColor, t.sldPtrS.style.width = d.sliderSize + "px", t.sldPtrS.style.height = m + "px", t.btn.style.display = d.closable ? "block" : "none", t.btn.style.position = "absolute", t.btn.style.left = d.padding + "px", t.btn.style.bottom = d.padding + "px", t.btn.style.padding = "0 15px", t.btn.style.height = d.buttonHeight + "px", t.btn.style.border = d.insetWidth + "px solid", l(), t.btn.style.color = d.buttonColor, t.btn.style.font = "12px sans-serif", t.btn.style.textAlign = "center";
                try {
                    t.btn.style.cursor = "pointer"
                } catch (c) {
                    t.btn.style.cursor = "hand"
                }
                t.btn.onmousedown = function() {
                    d.hide()
                }, t.btnT.style.lineHeight = d.buttonHeight + "px", t.btnT.innerHTML = "", t.btnT.appendChild(document.createTextNode(d.closeText)), a(), f(), e.picker.owner && e.picker.owner !== d && e.unsetClass(e.picker.owner.targetElement, d.activeClass), e.picker.owner = d, e.isElementType(v, "body") ? e.redrawPosition() : e._drawPosition(d, 0, 0, "relative", !1), t.wrap.parentNode != v && v.appendChild(t.wrap), e.setClass(d.targetElement, d.activeClass)
            }

            function a() {
                switch (e.getPadYComponent(d)) {
                    case "s":
                        var t = 1;
                        break;
                    case "v":
                        var t = 2
                }
                var n = Math.round(d.hsv[0] / 360 * (d.width - 1)),
                    r = Math.round((1 - d.hsv[t] / 100) * (d.height - 1)),
                    i = 2 * d.pointerBorderWidth + d.pointerThickness + 2 * d.crossSize,
                    o = -Math.floor(i / 2);
                e.picker.cross.style.left = n + o + "px", e.picker.cross.style.top = r + o + "px";
                switch (e.getSliderComponent(d)) {
                    case "s":
                        var u = s(d.hsv[0], 100, d.hsv[2]),
                            a = s(d.hsv[0], 0, d.hsv[2]),
                            f = "rgb(" + Math.round(u[0]) + "," + Math.round(u[1]) + "," + Math.round(u[2]) + ")",
                            l = "rgb(" + Math.round(a[0]) + "," + Math.round(a[1]) + "," + Math.round(a[2]) + ")";
                        e.picker.sldGrad.draw(d.sliderSize, d.height, f, l);
                        break;
                    case "v":
                        var c = s(d.hsv[0], d.hsv[1], 100),
                            f = "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")",
                            l = "#000";
                        e.picker.sldGrad.draw(d.sliderSize, d.height, f, l)
                }
            }

            function f() {
                var t = e.getSliderComponent(d);
                if (t) {
                    switch (t) {
                        case "s":
                            var n = 1;
                            break;
                        case "v":
                            var n = 2
                    }
                    var r = Math.round((1 - d.hsv[n] / 100) * (d.height - 1));
                    e.picker.sldPtrOB.style.top = r - (2 * d.pointerBorderWidth + d.pointerThickness) - Math.floor(m / 2) + "px"
                }
            }

            function l() {
                return e.picker && e.picker.owner === d
            }

            function c() {
                d.importColor()
            }
            this.value = null, this.valueElement = t, this.styleElement = t, this.required = !0, this.refine = !0, this.hash = !1, this.uppercase = !0, this.onFineChange = null, this.activeClass = "jscolor-active", this.minS = 0, this.maxS = 100, this.minV = 0, this.maxV = 100, this.hsv = [0, 0, 100], this.rgb = [255, 255, 255], this.width = 181, this.height = 101, this.showOnClick = !0, this.mode = "HSV", this.position = "bottom", this.smartPosition = !0, this.sliderSize = 16, this.crossSize = 8, this.closable = !1, this.closeText = "Close", this.buttonColor = "#000000", this.buttonHeight = 18, this.padding = 3, this.backgroundColor = "#FFFFFF", this.borderWidth = 0, this.borderColor = "#BBBBBB", this.borderRadius = 0, this.insetWidth = 0, this.insetColor = "#BBBBBB", this.shadow = !0, this.shadowBlur = 15, this.shadowColor = "rgba(0,0,0,0.2)", this.pointerColor = "#4C4C4C", this.pointerBorderColor = "#FFFFFF", this.pointerBorderWidth = 1, this.pointerThickness = 2, this.zIndex = 1e3, this.container = null;
            for (var r in n) n.hasOwnProperty(r) && (this[r] = n[r]);
            this.hide = function() {
                l() && o()
            }, this.show = function() {
                u()
            }, this.redraw = function() {
                l() && u()
            }, this.importColor = function() {
                this.valueElement ? e.isElementType(this.valueElement, "input") ? this.refine ? !this.required && /^\s*$/.test(this.valueElement.value) ? (this.valueElement.value = "", this.styleElement && (this.styleElement.style.backgroundImage = this.styleElement._jscOrigStyle.backgroundImage, this.styleElement.style.backgroundColor = this.styleElement._jscOrigStyle.backgroundColor, this.styleElement.style.color = this.styleElement._jscOrigStyle.color), this.exportColor(e.leaveValue | e.leaveStyle)) : this.fromString(this.valueElement.value) || this.exportColor() : this.fromString(this.valueElement.value, e.leaveValue) || (this.styleElement && (this.styleElement.style.backgroundImage = this.styleElement._jscOrigStyle.backgroundImage, this.styleElement.style.backgroundColor = this.styleElement._jscOrigStyle.backgroundColor, this.styleElement.style.color = this.styleElement._jscOrigStyle.color), this.exportColor(e.leaveValue | e.leaveStyle)) : this.exportColor() : this.exportColor()
            }, this.exportColor = function(t) {
                if (!(t & e.leaveValue) && this.valueElement) {
                    var n = this.toString();
                    this.uppercase && (n = n.toUpperCase()), this.hash && (n = "#" + n), e.isElementType(this.valueElement, "input") ? this.valueElement.value = n : this.valueElement.innerHTML = n
                }
                t & e.leaveStyle || this.styleElement && (this.styleElement.style.backgroundImage = "none", this.styleElement.style.backgroundColor = "#" + this.toString(), this.styleElement.style.color = this.isLight() ? "#000" : "#FFF"), !(t & e.leavePad) && l() && a(), !(t & e.leaveSld) && l() && f()
            }, this.fromHSV = function(e, t, n, r) {
                if (e !== null) {
                    if (isNaN(e)) return !1;
                    e = Math.max(0, Math.min(360, e))
                }
                if (t !== null) {
                    if (isNaN(t)) return !1;
                    t = Math.max(0, Math.min(100, this.maxS, t), this.minS)
                }
                if (n !== null) {
                    if (isNaN(n)) return !1;
                    n = Math.max(0, Math.min(100, this.maxV, n), this.minV)
                }
                this.rgb = s(e === null ? this.hsv[0] : this.hsv[0] = e, t === null ? this.hsv[1] : this.hsv[1] = t, n === null ? this.hsv[2] : this.hsv[2] = n), this.exportColor(r)
            }, this.fromRGB = function(e, t, n, r) {
                if (e !== null) {
                    if (isNaN(e)) return !1;
                    e = Math.max(0, Math.min(255, e))
                }
                if (t !== null) {
                    if (isNaN(t)) return !1;
                    t = Math.max(0, Math.min(255, t))
                }
                if (n !== null) {
                    if (isNaN(n)) return !1;
                    n = Math.max(0, Math.min(255, n))
                }
                var o = i(e === null ? this.rgb[0] : e, t === null ? this.rgb[1] : t, n === null ? this.rgb[2] : n);
                o[0] !== null && (this.hsv[0] = Math.max(0, Math.min(360, o[0]))), o[2] !== 0 && (this.hsv[1] = o[1] === null ? null : Math.max(0, this.minS, Math.min(100, this.maxS, o[1]))), this.hsv[2] = o[2] === null ? null : Math.max(0, this.minV, Math.min(100, this.maxV, o[2]));
                var u = s(this.hsv[0], this.hsv[1], this.hsv[2]);
                this.rgb[0] = u[0], this.rgb[1] = u[1], this.rgb[2] = u[2], this.exportColor(r)
            }, this.fromString = function(e, t) {
                var n;
                if (n = e.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)) return n[1].length === 6 ? this.fromRGB(parseInt(n[1].substr(0, 2), 16), parseInt(n[1].substr(2, 2), 16), parseInt(n[1].substr(4, 2), 16), t) : this.fromRGB(parseInt(n[1].charAt(0) + n[1].charAt(0), 16), parseInt(n[1].charAt(1) + n[1].charAt(1), 16), parseInt(n[1].charAt(2) + n[1].charAt(2), 16), t), !0;
                if (n = e.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
                    var r = n[1].split(","),
                        i = /^\s*(\d*)(\.\d+)?\s*$/,
                        s, o, u;
                    if (r.length >= 3 && (s = r[0].match(i)) && (o = r[1].match(i)) && (u = r[2].match(i))) {
                        var a = parseFloat((s[1] || "0") + (s[2] || "")),
                            f = parseFloat((o[1] || "0") + (o[2] || "")),
                            l = parseFloat((u[1] || "0") + (u[2] || ""));
                        return this.fromRGB(a, f, l, t), !0
                    }
                }
                return !1
            }, this.toString = function() {
                return (256 | Math.round(this.rgb[0])).toString(16).substr(1) + (256 | Math.round(this.rgb[1])).toString(16).substr(1) + (256 | Math.round(this.rgb[2])).toString(16).substr(1)
            }, this.toHEXString = function() {
                return "#" + this.toString().toUpperCase()
            }, this.toRGBString = function() {
                return "rgb(" + Math.round(this.rgb[0]) + "," + Math.round(this.rgb[1]) + "," + Math.round(this.rgb[2]) + ")"
            }, this.isLight = function() {
                return .213 * this.rgb[0] + .715 * this.rgb[1] + .072 * this.rgb[2] > 127.5
            }, this._processParentElementsInDOM = function() {
                if (this._linkedElementsProcessed) return;
                this._linkedElementsProcessed = !0;
                var t = this.targetElement;
                do {
                    var n = e.getStyle(t);
                    n && n.position.toLowerCase() === "fixed" && (this.fixed = !0), t !== this.targetElement && (t._jscEventsAttached || (e.attachEvent(t, "scroll", e.onParentScroll), t._jscEventsAttached = !0))
                } while ((t = t.parentNode) && !e.isElementType(t, "body"))
            };
            if (typeof t == "string") {
                var h = t,
                    p = document.getElementById(h);
                p ? this.targetElement = p : e.warn("Could not find target element with ID '" + h + "'")
            } else t ? this.targetElement = t : e.warn("Invalid target element: '" + t + "'");
            if (this.targetElement._jscLinkedInstance) {
                e.warn("Cannot link jscolor twice to the same element. Skipping.");
                return
            }
            this.targetElement._jscLinkedInstance = this, this.valueElement = e.fetchElement(this.valueElement), this.styleElement = e.fetchElement(this.styleElement);
            var d = this,
                v = this.container ? e.fetchElement(this.container) : document.getElementsByTagName("body")[0],
                m = 3;
            if (e.isElementType(this.targetElement, "button"))
                if (this.targetElement.onclick) {
                    var g = this.targetElement.onclick;
                    this.targetElement.onclick = function(e) {
                        return g.call(this, e), !1
                    }
                } else this.targetElement.onclick = function() {
                    return !1
                };
            if (this.valueElement && e.isElementType(this.valueElement, "input")) {
                var y = function() {
                    d.fromString(d.valueElement.value, e.leaveValue), e.dispatchFineChange(d)
                };
                e.attachEvent(this.valueElement, "keyup", y), e.attachEvent(this.valueElement, "input", y), e.attachEvent(this.valueElement, "blur", c), this.valueElement.setAttribute("autocomplete", "off")
            }
            this.styleElement && (this.styleElement._jscOrigStyle = {
                backgroundImage: this.styleElement.style.backgroundImage,
                backgroundColor: this.styleElement.style.backgroundColor,
                color: this.styleElement.style.color
            }), this.value ? this.fromString(this.value) || this.exportColor() : this.importColor()
        }
    };
    return e.jscolor.lookupClass = "jscolor", e.jscolor.installByClassName = function(t) {
        var n = document.getElementsByTagName("input"),
            r = document.getElementsByTagName("button");
        e.tryInstallOnElements(n, t), e.tryInstallOnElements(r, t)
    }, e.register(), e.jscolor
}());
