var fabric = fabric || {
    version: "3.6.1"
};
if ("undefined" != typeof exports ? exports.fabric = fabric : "function" == typeof define && define.amd && define([], function () {
        return fabric
    }), "undefined" != typeof document && "undefined" != typeof window) document instanceof("undefined" != typeof HTMLDocument ? HTMLDocument : Document) ? fabric.document = document : fabric.document = document.implementation.createHTMLDocument(""), fabric.window = window;
else {
    var jsdom = require("jsdom"),
        virtualWindow = new jsdom.JSDOM(decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E"), {
            features: {
                FetchExternalResources: ["img"]
            },
            resources: "usable"
        }).window;
    fabric.document = virtualWindow.document, fabric.jsdomImplForWrapper = require("jsdom/lib/jsdom/living/generated/utils").implForWrapper, fabric.nodeCanvas = require("jsdom/lib/jsdom/utils").Canvas, fabric.window = virtualWindow, DOMParser = fabric.window.DOMParser
}

function resizeCanvasIfNeeded(t) {
    var e = t.targetCanvas,
        i = e.width,
        r = e.height,
        n = t.destinationWidth,
        s = t.destinationHeight;
    i === n && r === s || (e.width = n, e.height = s)
}

function copyGLTo2DDrawImage(t, e) {
    var i = t.canvas,
        r = e.targetCanvas,
        n = r.getContext("2d");
    n.translate(0, r.height), n.scale(1, -1);
    var s = i.height - r.height;
    n.drawImage(i, 0, s, r.width, r.height, 0, 0, r.width, r.height)
}

function copyGLTo2DPutImageData(t, e) {
    var i = e.targetCanvas.getContext("2d"),
        r = e.destinationWidth,
        n = e.destinationHeight,
        s = r * n * 4,
        o = new Uint8Array(this.imageBuffer, 0, s),
        a = new Uint8ClampedArray(this.imageBuffer, 0, s);
    t.readPixels(0, 0, r, n, t.RGBA, t.UNSIGNED_BYTE, o);
    var h = new ImageData(a, r, n);
    i.putImageData(h, 0, 0)
}
fabric.isTouchSupported = "ontouchstart" in fabric.window || "ontouchstart" in fabric.document || fabric.window && fabric.window.navigator && 0 < fabric.window.navigator.maxTouchPoints, fabric.isLikelyNode = "undefined" != typeof Buffer && "undefined" == typeof window, fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-dashoffset", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id", "paint-order", "vector-effect", "instantiated_by_use", "clip-path"], fabric.DPI = 96, fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)", fabric.rePathCommand = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/gi, fabric.reNonWord = /[ \n\.,;!\?\-]/, fabric.fontPaths = {}, fabric.iMatrix = [1, 0, 0, 1, 0, 0], fabric.svgNS = "http://www.w3.org/2000/svg", fabric.perfLimitSizeTotal = 2097152, fabric.maxCacheSideLimit = 4096, fabric.minCacheSideLimit = 256, fabric.charWidthsCache = {}, fabric.textureSize = 2048, fabric.disableStyleCopyPaste = !1, fabric.enableGLFiltering = !0, fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1, fabric.browserShadowBlurConstant = 1, fabric.arcToSegmentsCache = {}, fabric.boundsOfCurveCache = {}, fabric.cachesBoundsOfCurve = !0, fabric.forceGLPutImageData = !1, fabric.initFilterBackend = function () {
        return fabric.enableGLFiltering && fabric.isWebglSupported && fabric.isWebglSupported(fabric.textureSize) ? (console.log("max texture size: " + fabric.maxTextureSize), new fabric.WebglFilterBackend({
            tileSize: fabric.textureSize
        })) : fabric.Canvas2dFilterBackend ? new fabric.Canvas2dFilterBackend : void 0
    }, "undefined" != typeof document && "undefined" != typeof window && (window.fabric = fabric),
    function () {
        function r(t, e) {
            if (this.__eventListeners[t]) {
                var i = this.__eventListeners[t];
                e ? i[i.indexOf(e)] = !1 : fabric.util.array.fill(i, !1)
            }
        }

        function t(t, e) {
            if (this.__eventListeners || (this.__eventListeners = {}), 1 === arguments.length)
                for (var i in t) this.on(i, t[i]);
            else this.__eventListeners[t] || (this.__eventListeners[t] = []), this.__eventListeners[t].push(e);
            return this
        }

        function e(t, e) {
            if (!this.__eventListeners) return this;
            if (0 === arguments.length)
                for (t in this.__eventListeners) r.call(this, t);
            else if (1 === arguments.length && "object" == typeof t)
                for (var i in t) r.call(this, i, t[i]);
            else r.call(this, t, e);
            return this
        }

        function i(t, e) {
            if (!this.__eventListeners) return this;
            var i = this.__eventListeners[t];
            if (!i) return this;
            for (var r = 0, n = i.length; r < n; r++) i[r] && i[r].call(this, e || {});
            return this.__eventListeners[t] = i.filter(function (t) {
                return !1 !== t
            }), this
        }
        fabric.Observable = {
            observe: t,
            stopObserving: e,
            fire: i,
            on: t,
            off: e,
            trigger: i
        }
    }(), fabric.Collection = {
        _objects: [],
        add: function () {
            if (this._objects.push.apply(this._objects, arguments), this._onObjectAdded)
                for (var t = 0, e = arguments.length; t < e; t++) this._onObjectAdded(arguments[t]);
            return this.renderOnAddRemove && this.requestRenderAll(), this
        },
        insertAt: function (t, e, i) {
            var r = this._objects;
            return i ? r[e] = t : r.splice(e, 0, t), this._onObjectAdded && this._onObjectAdded(t), this.renderOnAddRemove && this.requestRenderAll(), this
        },
        remove: function () {
            for (var t, e = this._objects, i = !1, r = 0, n = arguments.length; r < n; r++) - 1 !== (t = e.indexOf(arguments[r])) && (i = !0, e.splice(t, 1), this._onObjectRemoved && this._onObjectRemoved(arguments[r]));
            return this.renderOnAddRemove && i && this.requestRenderAll(), this
        },
        forEachObject: function (t, e) {
            for (var i = this.getObjects(), r = 0, n = i.length; r < n; r++) t.call(e, i[r], r, i);
            return this
        },
        getObjects: function (e) {
            return void 0 === e ? this._objects.concat() : this._objects.filter(function (t) {
                return t.type === e
            })
        },
        item: function (t) {
            return this._objects[t]
        },
        isEmpty: function () {
            return 0 === this._objects.length
        },
        size: function () {
            return this._objects.length
        },
        contains: function (t) {
            return -1 < this._objects.indexOf(t)
        },
        complexity: function () {
            return this._objects.reduce(function (t, e) {
                return t += e.complexity ? e.complexity() : 0
            }, 0)
        }
    }, fabric.CommonMethods = {
        _setOptions: function (t) {
            for (var e in t) this.set(e, t[e])
        },
        _initGradient: function (t, e) {
            !t || !t.colorStops || t instanceof fabric.Gradient || this.set(e, new fabric.Gradient(t))
        },
        _initPattern: function (t, e, i) {
            !t || !t.source || t instanceof fabric.Pattern ? i && i() : this.set(e, new fabric.Pattern(t, i))
        },
        _initClipping: function (t) {
            if (t.clipTo && "string" == typeof t.clipTo) {
                var e = fabric.util.getFunctionBody(t.clipTo);
                void 0 !== e && (this.clipTo = new Function("ctx", e))
            }
        },
        _setObject: function (t) {
            for (var e in t) this._set(e, t[e])
        },
        set: function (t, e) {
            return "object" == typeof t ? this._setObject(t) : "function" == typeof e && "clipTo" !== t ? this._set(t, e(this.get(t))) : this._set(t, e), this
        },
        _set: function (t, e) {
            this[t] = e
        },
        toggle: function (t) {
            var e = this.get(t);
            return "boolean" == typeof e && this.set(t, !e), this
        },
        get: function (t) {
            return this[t]
        }
    },
    function (s) {
        var d = Math.sqrt,
            g = Math.atan2,
            o = Math.pow,
            a = Math.PI / 180,
            i = Math.PI / 2;
        fabric.util = {
            cos: function (t) {
                if (0 === t) return 1;
                switch (t < 0 && (t = -t), t / i) {
                    case 1:
                    case 3:
                        return 0;
                    case 2:
                        return -1
                }
                return Math.cos(t)
            },
            sin: function (t) {
                if (0 === t) return 0;
                var e = 1;
                switch (t < 0 && (e = -1), t / i) {
                    case 1:
                        return e;
                    case 2:
                        return 0;
                    case 3:
                        return -e
                }
                return Math.sin(t)
            },
            removeFromArray: function (t, e) {
                var i = t.indexOf(e);
                return -1 !== i && t.splice(i, 1), t
            },
            getRandomInt: function (t, e) {
                return Math.floor(Math.random() * (e - t + 1)) + t
            },
            degreesToRadians: function (t) {
                return t * a
            },
            radiansToDegrees: function (t) {
                return t / a
            },
            rotatePoint: function (t, e, i) {
                t.subtractEquals(e);
                var r = fabric.util.rotateVector(t, i);
                return new fabric.Point(r.x, r.y).addEquals(e)
            },
            rotateVector: function (t, e) {
                var i = fabric.util.sin(e),
                    r = fabric.util.cos(e);
                return {
                    x: t.x * r - t.y * i,
                    y: t.x * i + t.y * r
                }
            },
            transformPoint: function (t, e, i) {
                return i ? new fabric.Point(e[0] * t.x + e[2] * t.y, e[1] * t.x + e[3] * t.y) : new fabric.Point(e[0] * t.x + e[2] * t.y + e[4], e[1] * t.x + e[3] * t.y + e[5])
            },
            makeBoundingBoxFromPoints: function (t, e) {
                if (e)
                    for (var i = 0; i < t.length; i++) t[i] = fabric.util.transformPoint(t[i], e);
                var r = [t[0].x, t[1].x, t[2].x, t[3].x],
                    n = fabric.util.array.min(r),
                    s = fabric.util.array.max(r) - n,
                    o = [t[0].y, t[1].y, t[2].y, t[3].y],
                    a = fabric.util.array.min(o);
                return {
                    left: n,
                    top: a,
                    width: s,
                    height: fabric.util.array.max(o) - a
                }
            },
            invertTransform: function (t) {
                var e = 1 / (t[0] * t[3] - t[1] * t[2]),
                    i = [e * t[3], -e * t[1], -e * t[2], e * t[0]],
                    r = fabric.util.transformPoint({
                        x: t[4],
                        y: t[5]
                    }, i, !0);
                return i[4] = -r.x, i[5] = -r.y, i
            },
            toFixed: function (t, e) {
                return parseFloat(Number(t).toFixed(e))
            },
            parseUnit: function (t, e) {
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
            falseFunction: function () {
                return !1
            },
            getKlass: function (t, e) {
                return t = fabric.util.string.camelize(t.charAt(0).toUpperCase() + t.slice(1)), fabric.util.resolveNamespace(e)[t]
            },
            getSvgAttributes: function (t) {
                var e = ["instantiated_by_use", "style", "id", "class"];
                switch (t) {
                    case "linearGradient":
                        e = e.concat(["x1", "y1", "x2", "y2", "gradientUnits", "gradientTransform"]);
                        break;
                    case "radialGradient":
                        e = e.concat(["gradientUnits", "gradientTransform", "cx", "cy", "r", "fx", "fy", "fr"]);
                        break;
                    case "stop":
                        e = e.concat(["offset", "stop-color", "stop-opacity"])
                }
                return e
            },
            resolveNamespace: function (t) {
                if (!t) return fabric;
                var e, i = t.split("."),
                    r = i.length,
                    n = s || fabric.window;
                for (e = 0; e < r; ++e) n = n[i[e]];
                return n
            },
            loadImage: function (t, e, i, r) {
                if (t) {
                    var n = fabric.util.createImage(),
                        s = function () {
                            e && e.call(i, n), n = n.onload = n.onerror = null
                        };
                    n.onload = s, n.onerror = function () {
                        fabric.log("Error loading " + n.src), e && e.call(i, null, !0), n = n.onload = n.onerror = null
                    }, 0 !== t.indexOf("data") && r && (n.crossOrigin = r), "data:image/svg" === t.substring(0, 14) && (n.onload = null, fabric.util.loadImageInDom(n, s)), n.src = t
                } else e && e.call(i, t)
            },
            loadImageInDom: function (t, e) {
                var i = fabric.document.createElement("div");
                i.style.width = i.style.height = "1px", i.style.left = i.style.top = "-100%", i.style.position = "absolute", i.appendChild(t), fabric.document.querySelector("body").appendChild(i), t.onload = function () {
                    e(), i.parentNode.removeChild(i), i = null
                }
            },
            enlivenObjects: function (t, e, n, s) {
                var o = [],
                    i = 0,
                    r = (t = t || []).length;

                function a() {
                    ++i === r && e && e(o.filter(function (t) {
                        return t
                    }))
                }
                r ? t.forEach(function (i, r) {
                    i && i.type ? fabric.util.getKlass(i.type, n).fromObject(i, function (t, e) {
                        e || (o[r] = t), s && s(i, t, e), a()
                    }) : a()
                }) : e && e(o)
            },
            enlivenPatterns: function (t, e) {
                function i() {
                    ++n === s && e && e(r)
                }
                var r = [],
                    n = 0,
                    s = (t = t || []).length;
                s ? t.forEach(function (t, e) {
                    t && t.source ? new fabric.Pattern(t, function (t) {
                        r[e] = t, i()
                    }) : (r[e] = t, i())
                }) : e && e(r)
            },
            groupSVGElements: function (t, e, i) {
                var r;
                return t && 1 === t.length ? t[0] : (e && (e.width && e.height ? e.centerPoint = {
                    x: e.width / 2,
                    y: e.height / 2
                } : (delete e.width, delete e.height)), r = new fabric.Group(t, e), void 0 !== i && (r.sourcePath = i), r)
            },
            populateWithProperties: function (t, e, i) {
                if (i && "[object Array]" === Object.prototype.toString.call(i))
                    for (var r = 0, n = i.length; r < n; r++) i[r] in t && (e[i[r]] = t[i[r]])
            },
            drawDashedLine: function (t, e, i, r, n, s) {
                var o = r - e,
                    a = n - i,
                    h = d(o * o + a * a),
                    c = g(a, o),
                    l = s.length,
                    u = 0,
                    f = !0;
                for (t.save(), t.translate(e, i), t.moveTo(0, 0), t.rotate(c), e = 0; e < h;) h < (e += s[u++ % l]) && (e = h), t[f ? "lineTo" : "moveTo"](e, 0), f = !f;
                t.restore()
            },
            createCanvasElement: function () {
                return fabric.document.createElement("canvas")
            },
            copyCanvasElement: function (t) {
                var e = fabric.util.createCanvasElement();
                return e.width = t.width, e.height = t.height, e.getContext("2d").drawImage(t, 0, 0), e
            },
            toDataURL: function (t, e, i) {
                return t.toDataURL("image/" + e, i)
            },
            createImage: function () {
                return fabric.document.createElement("img")
            },
            clipContext: function (t, e) {
                e.save(), e.beginPath(), t.clipTo(e), e.clip()
            },
            multiplyTransformMatrices: function (t, e, i) {
                return [t[0] * e[0] + t[2] * e[1], t[1] * e[0] + t[3] * e[1], t[0] * e[2] + t[2] * e[3], t[1] * e[2] + t[3] * e[3], i ? 0 : t[0] * e[4] + t[2] * e[5] + t[4], i ? 0 : t[1] * e[4] + t[3] * e[5] + t[5]]
            },
            qrDecompose: function (t) {
                var e = g(t[1], t[0]),
                    i = o(t[0], 2) + o(t[1], 2),
                    r = d(i),
                    n = (t[0] * t[3] - t[2] * t[1]) / r,
                    s = g(t[0] * t[2] + t[1] * t[3], i);
                return {
                    angle: e / a,
                    scaleX: r,
                    scaleY: n,
                    skewX: s / a,
                    skewY: 0,
                    translateX: t[4],
                    translateY: t[5]
                }
            },
            calcRotateMatrix: function (t) {
                if (!t.angle) return fabric.iMatrix.concat();
                var e = fabric.util.degreesToRadians(t.angle),
                    i = fabric.util.cos(e),
                    r = fabric.util.sin(e);
                return [i, r, -r, i, 0, 0]
            },
            calcDimensionsMatrix: function (t) {
                var e = void 0 === t.scaleX ? 1 : t.scaleX,
                    i = void 0 === t.scaleY ? 1 : t.scaleY,
                    r = [t.flipX ? -e : e, 0, 0, t.flipY ? -i : i, 0, 0],
                    n = fabric.util.multiplyTransformMatrices,
                    s = fabric.util.degreesToRadians;
                return t.skewX && (r = n(r, [1, 0, Math.tan(s(t.skewX)), 1], !0)), t.skewY && (r = n(r, [1, Math.tan(s(t.skewY)), 0, 1], !0)), r
            },
            composeMatrix: function (t) {
                var e = [1, 0, 0, 1, t.translateX || 0, t.translateY || 0],
                    i = fabric.util.multiplyTransformMatrices;
                return t.angle && (e = i(e, fabric.util.calcRotateMatrix(t))), (t.scaleX || t.scaleY || t.skewX || t.skewY || t.flipX || t.flipY) && (e = i(e, fabric.util.calcDimensionsMatrix(t))), e
            },
            customTransformMatrix: function (t, e, i) {
                return fabric.util.composeMatrix({
                    scaleX: t,
                    scaleY: e,
                    skewX: i
                })
            },
            resetObjectTransform: function (t) {
                t.scaleX = 1, t.scaleY = 1, t.skewX = 0, t.skewY = 0, t.flipX = !1, t.flipY = !1, t.rotate(0)
            },
            saveObjectTransform: function (t) {
                return {
                    scaleX: t.scaleX,
                    scaleY: t.scaleY,
                    skewX: t.skewX,
                    skewY: t.skewY,
                    angle: t.angle,
                    left: t.left,
                    flipX: t.flipX,
                    flipY: t.flipY,
                    top: t.top
                }
            },
            getFunctionBody: function (t) {
                return (String(t).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
            },
            isTransparent: function (t, e, i, r) {
                0 < r && (r < e ? e -= r : e = 0, r < i ? i -= r : i = 0);
                var n, s = !0,
                    o = t.getImageData(e, i, 2 * r || 1, 2 * r || 1),
                    a = o.data.length;
                for (n = 3; n < a && !1 !== (s = o.data[n] <= 0); n += 4);
                return o = null, s
            },
            parsePreserveAspectRatioAttribute: function (t) {
                var e, i = "meet",
                    r = t.split(" ");
                return r && r.length && ("meet" !== (i = r.pop()) && "slice" !== i ? (e = i, i = "meet") : r.length && (e = r.pop())), {
                    meetOrSlice: i,
                    alignX: "none" !== e ? e.slice(1, 4) : "none",
                    alignY: "none" !== e ? e.slice(5, 8) : "none"
                }
            },
            clearFabricFontCache: function (t) {
                (t = (t || "").toLowerCase()) ? fabric.charWidthsCache[t] && delete fabric.charWidthsCache[t]: fabric.charWidthsCache = {}
            },
            limitDimsByArea: function (t, e) {
                var i = Math.sqrt(e * t),
                    r = Math.floor(e / i);
                return {
                    x: Math.floor(i),
                    y: r
                }
            },
            capValue: function (t, e, i) {
                return Math.max(t, Math.min(e, i))
            },
            findScaleToFit: function (t, e) {
                return Math.min(e.width / t.width, e.height / t.height)
            },
            findScaleToCover: function (t, e) {
                return Math.max(e.width / t.width, e.height / t.height)
            },
            matrixToSVG: function (t) {
                return "matrix(" + t.map(function (t) {
                    return fabric.util.toFixed(t, fabric.Object.NUM_FRACTION_DIGITS)
                }).join(" ") + ")"
            }
        }
    }("undefined" != typeof exports ? exports : this),
    function () {
        var Z = Array.prototype.join;

        function v(t, e, i, r, n, s, o) {
            var a = Z.call(arguments);
            if (fabric.arcToSegmentsCache[a]) return fabric.arcToSegmentsCache[a];
            var h = Math.PI,
                c = o * h / 180,
                l = fabric.util.sin(c),
                u = fabric.util.cos(c),
                f = 0,
                d = 0,
                g = -u * t * .5 - l * e * .5,
                p = -u * e * .5 + l * t * .5,
                v = (i = Math.abs(i)) * i,
                m = (r = Math.abs(r)) * r,
                b = p * p,
                _ = g * g,
                y = v * m - v * b - m * _,
                x = 0;
            if (y < 0) {
                var C = Math.sqrt(1 - y / (v * m));
                i *= C, r *= C
            } else x = (n === s ? -1 : 1) * Math.sqrt(y / (v * b + m * _));
            var S = x * i * p / r,
                T = -x * r * g / i,
                w = u * S - l * T + .5 * t,
                O = l * S + u * T + .5 * e,
                k = Q(1, 0, (g - S) / i, (p - T) / r),
                P = Q((g - S) / i, (p - T) / r, (-g - S) / i, (-p - T) / r);
            0 === s && 0 < P ? P -= 2 * h : 1 === s && P < 0 && (P += 2 * h);
            for (var D, E, j, A, M, F, I, L, R, B, X, Y, W, G, z, U, N, V = Math.ceil(Math.abs(P / h * 2)), H = [], q = P / V, K = 8 / 3 * Math.sin(q / 4) * Math.sin(q / 4) / Math.sin(q / 2), J = k + q, $ = 0; $ < V; $++) H[$] = (D = k, E = J, j = u, A = l, M = i, F = r, I = w, L = O, R = K, B = f, X = d, void 0, Y = fabric.util.cos(D), W = fabric.util.sin(D), G = fabric.util.cos(E), z = fabric.util.sin(E), [B + R * (-j * M * W - A * F * Y), X + R * (-A * M * W + j * F * Y), (U = j * M * G - A * F * z + I) + R * (j * M * z + A * F * G), (N = A * M * G + j * F * z + L) + R * (A * M * z - j * F * G), U, N]), f = H[$][4], d = H[$][5], k = J, J += q;
            return fabric.arcToSegmentsCache[a] = H
        }

        function Q(t, e, i, r) {
            var n = Math.atan2(e, t),
                s = Math.atan2(r, i);
            return n <= s ? s - n : 2 * Math.PI - (n - s)
        }

        function m(t, e, i, r, n, s, o, a) {
            var h;
            if (fabric.cachesBoundsOfCurve && (h = Z.call(arguments), fabric.boundsOfCurveCache[h])) return fabric.boundsOfCurveCache[h];
            var c, l, u, f, d, g, p, v, m = Math.sqrt,
                b = Math.min,
                _ = Math.max,
                y = Math.abs,
                x = [],
                C = [
                    [],
                    []
                ];
            l = 6 * t - 12 * i + 6 * n, c = -3 * t + 9 * i - 9 * n + 3 * o, u = 3 * i - 3 * t;
            for (var S = 0; S < 2; ++S)
                if (0 < S && (l = 6 * e - 12 * r + 6 * s, c = -3 * e + 9 * r - 9 * s + 3 * a, u = 3 * r - 3 * e), y(c) < 1e-12) {
                    if (y(l) < 1e-12) continue;
                    0 < (f = -u / l) && f < 1 && x.push(f)
                } else(p = l * l - 4 * u * c) < 0 || (0 < (d = (-l + (v = m(p))) / (2 * c)) && d < 1 && x.push(d), 0 < (g = (-l - v) / (2 * c)) && g < 1 && x.push(g));
            for (var T, w, O, k = x.length, P = k; k--;) T = (O = 1 - (f = x[k])) * O * O * t + 3 * O * O * f * i + 3 * O * f * f * n + f * f * f * o, C[0][k] = T, w = O * O * O * e + 3 * O * O * f * r + 3 * O * f * f * s + f * f * f * a, C[1][k] = w;
            C[0][P] = t, C[1][P] = e, C[0][P + 1] = o, C[1][P + 1] = a;
            var D = [{
                x: b.apply(null, C[0]),
                y: b.apply(null, C[1])
            }, {
                x: _.apply(null, C[0]),
                y: _.apply(null, C[1])
            }];
            return fabric.cachesBoundsOfCurve && (fabric.boundsOfCurveCache[h] = D), D
        }
        fabric.util.drawArc = function (t, e, i, r) {
            for (var n = r[0], s = r[1], o = r[2], a = r[3], h = r[4], c = [
                    [],
                    [],
                    [],
                    []
                ], l = v(r[5] - e, r[6] - i, n, s, a, h, o), u = 0, f = l.length; u < f; u++) c[u][0] = l[u][0] + e, c[u][1] = l[u][1] + i, c[u][2] = l[u][2] + e, c[u][3] = l[u][3] + i, c[u][4] = l[u][4] + e, c[u][5] = l[u][5] + i, t.bezierCurveTo.apply(t, c[u])
        }, fabric.util.getBoundsOfArc = function (t, e, i, r, n, s, o, a, h) {
            for (var c, l = 0, u = 0, f = [], d = v(a - t, h - e, i, r, s, o, n), g = 0, p = d.length; g < p; g++) c = m(l, u, d[g][0], d[g][1], d[g][2], d[g][3], d[g][4], d[g][5]), f.push({
                x: c[0].x + t,
                y: c[0].y + e
            }), f.push({
                x: c[1].x + t,
                y: c[1].y + e
            }), l = d[g][4], u = d[g][5];
            return f
        }, fabric.util.getBoundsOfCurve = m
    }(),
    function () {
        var o = Array.prototype.slice;

        function i(t, e, i) {
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
        fabric.util.array = {
            fill: function (t, e) {
                for (var i = t.length; i--;) t[i] = e;
                return t
            },
            invoke: function (t, e) {
                for (var i = o.call(arguments, 2), r = [], n = 0, s = t.length; n < s; n++) r[n] = i.length ? t[n][e].apply(t[n], i) : t[n][e].call(t[n]);
                return r
            },
            min: function (t, e) {
                return i(t, e, function (t, e) {
                    return t < e
                })
            },
            max: function (t, e) {
                return i(t, e, function (t, e) {
                    return e <= t
                })
            }
        }
    }(),
    function () {
        function o(t, e, i) {
            if (i)
                if (!fabric.isLikelyNode && e instanceof Element) t = e;
                else if (e instanceof Array) {
                t = [];
                for (var r = 0, n = e.length; r < n; r++) t[r] = o({}, e[r], i)
            } else if (e && "object" == typeof e)
                for (var s in e) "canvas" === s ? t[s] = o({}, e[s]) : e.hasOwnProperty(s) && (t[s] = o({}, e[s], i));
            else t = e;
            else
                for (var s in e) t[s] = e[s];
            return t
        }
        fabric.util.object = {
            extend: o,
            clone: function (t, e) {
                return o({}, t, e)
            }
        }, fabric.util.object.extend(fabric.util, fabric.Observable)
    }(),
    function () {
        function n(t, e) {
            var i = t.charCodeAt(e);
            if (isNaN(i)) return "";
            if (i < 55296 || 57343 < i) return t.charAt(e);
            if (55296 <= i && i <= 56319) {
                if (t.length <= e + 1) throw "High surrogate without following low surrogate";
                var r = t.charCodeAt(e + 1);
                if (r < 56320 || 57343 < r) throw "High surrogate without following low surrogate";
                return t.charAt(e) + t.charAt(e + 1)
            }
            if (0 === e) throw "Low surrogate without preceding high surrogate";
            var n = t.charCodeAt(e - 1);
            if (n < 55296 || 56319 < n) throw "Low surrogate without preceding high surrogate";
            return !1
        }
        fabric.util.string = {
            camelize: function (t) {
                return t.replace(/-+(.)?/g, function (t, e) {
                    return e ? e.toUpperCase() : ""
                })
            },
            capitalize: function (t, e) {
                return t.charAt(0).toUpperCase() + (e ? t.slice(1) : t.slice(1).toLowerCase())
            },
            escapeXml: function (t) {
                return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            },
            graphemeSplit: function (t) {
                var e, i = 0,
                    r = [];
                for (i = 0; i < t.length; i++) !1 !== (e = n(t, i)) && r.push(e);
                return r
            }
        }
    }(),
    function () {
        var s = Array.prototype.slice,
            o = function () {},
            i = function () {
                for (var t in {
                        toString: 1
                    })
                    if ("toString" === t) return !1;
                return !0
            }(),
            a = function (t, r, n) {
                for (var e in r) e in t.prototype && "function" == typeof t.prototype[e] && -1 < (r[e] + "").indexOf("callSuper") ? t.prototype[e] = function (i) {
                    return function () {
                        var t = this.constructor.superclass;
                        this.constructor.superclass = n;
                        var e = r[i].apply(this, arguments);
                        if (this.constructor.superclass = t, "initialize" !== i) return e
                    }
                }(e) : t.prototype[e] = r[e], i && (r.toString !== Object.prototype.toString && (t.prototype.toString = r.toString), r.valueOf !== Object.prototype.valueOf && (t.prototype.valueOf = r.valueOf))
            };

        function h() {}

        function c(t) {
            for (var e = null, i = this; i.constructor.superclass;) {
                var r = i.constructor.superclass.prototype[t];
                if (i[t] !== r) {
                    e = r;
                    break
                }
                i = i.constructor.superclass.prototype
            }
            return e ? 1 < arguments.length ? e.apply(this, s.call(arguments, 1)) : e.call(this) : console.log("tried to callSuper " + t + ", method not found in prototype chain", this)
        }
        fabric.util.createClass = function () {
            var t = null,
                e = s.call(arguments, 0);

            function i() {
                this.initialize.apply(this, arguments)
            }
            "function" == typeof e[0] && (t = e.shift()), i.superclass = t, i.subclasses = [], t && (h.prototype = t.prototype, i.prototype = new h, t.subclasses.push(i));
            for (var r = 0, n = e.length; r < n; r++) a(i, e[r], t);
            return i.prototype.initialize || (i.prototype.initialize = o), (i.prototype.constructor = i).prototype.callSuper = c, i
        }
    }(),
    function () {
        var n = !!fabric.document.createElement("div").attachEvent;
        fabric.util.addListener = function (t, e, i, r) {
            t && t.addEventListener(e, i, !n && r)
        }, fabric.util.removeListener = function (t, e, i, r) {
            t && t.removeEventListener(e, i, !n && r)
        }, fabric.util.getPointer = function (t) {
            var e, i, r = t.target,
                n = fabric.util.getScrollLeftTop(r),
                s = (i = (e = t).changedTouches) && i[0] ? i[0] : e;
            return {
                x: s.clientX + n.left,
                y: s.clientY + n.top
            }
        }
    }(),
    function () {
        var t = fabric.document.createElement("div"),
            e = "string" == typeof t.style.opacity,
            i = "string" == typeof t.style.filter,
            r = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
            n = function (t) {
                return t
            };
        e ? n = function (t, e) {
            return t.style.opacity = e, t
        } : i && (n = function (t, e) {
            var i = t.style;
            return t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1), r.test(i.filter) ? (e = .9999 <= e ? "" : "alpha(opacity=" + 100 * e + ")", i.filter = i.filter.replace(r, e)) : i.filter += " alpha(opacity=" + 100 * e + ")", t
        }), fabric.util.setStyle = function (t, e) {
            var i = t.style;
            if (!i) return t;
            if ("string" == typeof e) return t.style.cssText += ";" + e, -1 < e.indexOf("opacity") ? n(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1]) : t;
            for (var r in e) "opacity" === r ? n(t, e[r]) : i["float" === r || "cssFloat" === r ? void 0 === i.styleFloat ? "cssFloat" : "styleFloat" : r] = e[r];
            return t
        }
    }(),
    function () {
        var e = Array.prototype.slice;
        var t, h, i, r, n = function (t) {
            return e.call(t, 0)
        };
        try {
            t = n(fabric.document.childNodes) instanceof Array
        } catch (t) {}

        function s(t, e) {
            var i = fabric.document.createElement(t);
            for (var r in e) "class" === r ? i.className = e[r] : "for" === r ? i.htmlFor = e[r] : i.setAttribute(r, e[r]);
            return i
        }

        function c(t) {
            for (var e = 0, i = 0, r = fabric.document.documentElement, n = fabric.document.body || {
                    scrollLeft: 0,
                    scrollTop: 0
                }; t && (t.parentNode || t.host) && ((t = t.parentNode || t.host) === fabric.document ? (e = n.scrollLeft || r.scrollLeft || 0, i = n.scrollTop || r.scrollTop || 0) : (e += t.scrollLeft || 0, i += t.scrollTop || 0), 1 !== t.nodeType || "fixed" !== t.style.position););
            return {
                left: e,
                top: i
            }
        }
        t || (n = function (t) {
            for (var e = new Array(t.length), i = t.length; i--;) e[i] = t[i];
            return e
        }), h = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? function (t, e) {
            var i = fabric.document.defaultView.getComputedStyle(t, null);
            return i ? i[e] : void 0
        } : function (t, e) {
            var i = t.style[e];
            return !i && t.currentStyle && (i = t.currentStyle[e]), i
        }, i = fabric.document.documentElement.style, r = "userSelect" in i ? "userSelect" : "MozUserSelect" in i ? "MozUserSelect" : "WebkitUserSelect" in i ? "WebkitUserSelect" : "KhtmlUserSelect" in i ? "KhtmlUserSelect" : "", fabric.util.makeElementUnselectable = function (t) {
            return void 0 !== t.onselectstart && (t.onselectstart = fabric.util.falseFunction), r ? t.style[r] = "none" : "string" == typeof t.unselectable && (t.unselectable = "on"), t
        }, fabric.util.makeElementSelectable = function (t) {
            return void 0 !== t.onselectstart && (t.onselectstart = null), r ? t.style[r] = "" : "string" == typeof t.unselectable && (t.unselectable = ""), t
        }, fabric.util.getScript = function (t, e) {
            var i = fabric.document.getElementsByTagName("head")[0],
                r = fabric.document.createElement("script"),
                n = !0;
            r.onload = r.onreadystatechange = function (t) {
                if (n) {
                    if ("string" == typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState) return;
                    n = !1, e(t || fabric.window.event), r = r.onload = r.onreadystatechange = null
                }
            }, r.src = t, i.appendChild(r)
        }, fabric.util.getById = function (t) {
            return "string" == typeof t ? fabric.document.getElementById(t) : t
        }, fabric.util.toArray = n, fabric.util.makeElement = s, fabric.util.addClass = function (t, e) {
            t && -1 === (" " + t.className + " ").indexOf(" " + e + " ") && (t.className += (t.className ? " " : "") + e)
        }, fabric.util.wrapElement = function (t, e, i) {
            return "string" == typeof e && (e = s(e, i)), t.parentNode && t.parentNode.replaceChild(e, t), e.appendChild(t), e
        }, fabric.util.getScrollLeftTop = c, fabric.util.getElementOffset = function (t) {
            var e, i, r = t && t.ownerDocument,
                n = {
                    left: 0,
                    top: 0
                },
                s = {
                    left: 0,
                    top: 0
                },
                o = {
                    borderLeftWidth: "left",
                    borderTopWidth: "top",
                    paddingLeft: "left",
                    paddingTop: "top"
                };
            if (!r) return s;
            for (var a in o) s[o[a]] += parseInt(h(t, a), 10) || 0;
            return e = r.documentElement, void 0 !== t.getBoundingClientRect && (n = t.getBoundingClientRect()), i = c(t), {
                left: n.left + i.left - (e.clientLeft || 0) + s.left,
                top: n.top + i.top - (e.clientTop || 0) + s.top
            }
        }, fabric.util.getElementStyle = h, fabric.util.getNodeCanvas = function (t) {
            var e = fabric.jsdomImplForWrapper(t);
            return e._canvas || e._image
        }, fabric.util.cleanUpJsdomNode = function (t) {
            if (fabric.isLikelyNode) {
                var e = fabric.jsdomImplForWrapper(t);
                e && (e._image = null, e._canvas = null, e._currentSrc = null, e._attributes = null, e._classList = null)
            }
        }
    }(),
    function () {
        function h() {}
        fabric.util.request = function (t, e) {
            e || (e = {});
            var i, r, n = e.method ? e.method.toUpperCase() : "GET",
                s = e.onComplete || function () {},
                o = new fabric.window.XMLHttpRequest,
                a = e.body || e.parameters;
            return o.onreadystatechange = function () {
                4 === o.readyState && (s(o), o.onreadystatechange = h)
            }, "GET" === n && (a = null, "string" == typeof e.parameters && (i = t, r = e.parameters, t = i + (/\?/.test(i) ? "&" : "?") + r)), o.open(n, t, !0), "POST" !== n && "PUT" !== n || o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), o.send(a), o
        }
    }(), fabric.log = console.log, fabric.warn = console.warn,
    function () {
        function i() {
            return !1
        }

        function r(t, e, i, r) {
            return -i * Math.cos(t / r * (Math.PI / 2)) + i + e
        }
        var t = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function (t) {
                return fabric.window.setTimeout(t, 1e3 / 60)
            },
            e = fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;

        function m() {
            return t.apply(fabric.window, arguments)
        }
        fabric.util.animate = function (e) {
            m(function (t) {
                e || (e = {});
                var o, a = t || +new Date,
                    h = e.duration || 500,
                    c = a + h,
                    l = e.onChange || i,
                    u = e.abort || i,
                    f = e.onComplete || i,
                    d = e.easing || r,
                    g = "startValue" in e ? e.startValue : 0,
                    p = "endValue" in e ? e.endValue : 100,
                    v = e.byValue || p - g;
                e.onStart && e.onStart(),
                    function t(e) {
                        o = e || +new Date;
                        var i = c < o ? h : o - a,
                            r = i / h,
                            n = d(i, g, v, h),
                            s = Math.abs((n - g) / v);
                        if (!u()) return c < o ? (l(p, 1, 1), void f(p, 1, 1)) : (l(n, s, r), void m(t));
                        f(p, 1, 1)
                    }(a)
            })
        }, fabric.util.requestAnimFrame = m, fabric.util.cancelAnimFrame = function () {
            return e.apply(fabric.window, arguments)
        }
    }(), fabric.util.animateColor = function (t, e, i, c) {
        var r = new fabric.Color(t).getSource(),
            n = new fabric.Color(e).getSource();
        c = c || {}, fabric.util.animate(fabric.util.object.extend(c, {
            duration: i || 500,
            startValue: r,
            endValue: n,
            byValue: n,
            easing: function (t, e, i, r) {
                var n, s, o, a, h = c.colorEasing ? c.colorEasing(t, r) : 1 - Math.cos(t / r * (Math.PI / 2));
                return n = e, s = i, o = h, a = "rgba(" + parseInt(n[0] + o * (s[0] - n[0]), 10) + "," + parseInt(n[1] + o * (s[1] - n[1]), 10) + "," + parseInt(n[2] + o * (s[2] - n[2]), 10), a += "," + (n && s ? parseFloat(n[3] + o * (s[3] - n[3])) : 1), a += ")"
            }
        }))
    },
    function () {
        function o(t, e, i, r) {
            return t < Math.abs(e) ? (t = e, r = i / 4) : r = 0 === e && 0 === t ? i / (2 * Math.PI) * Math.asin(1) : i / (2 * Math.PI) * Math.asin(e / t), {
                a: t,
                c: e,
                p: i,
                s: r
            }
        }

        function a(t, e, i) {
            return t.a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * i - t.s) * (2 * Math.PI) / t.p)
        }

        function n(t, e, i, r) {
            return i - s(r - t, 0, i, r) + e
        }

        function s(t, e, i, r) {
            return (t /= r) < 1 / 2.75 ? i * (7.5625 * t * t) + e : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
        }
        fabric.util.ease = {
            easeInQuad: function (t, e, i, r) {
                return i * (t /= r) * t + e
            },
            easeOutQuad: function (t, e, i, r) {
                return -i * (t /= r) * (t - 2) + e
            },
            easeInOutQuad: function (t, e, i, r) {
                return (t /= r / 2) < 1 ? i / 2 * t * t + e : -i / 2 * (--t * (t - 2) - 1) + e
            },
            easeInCubic: function (t, e, i, r) {
                return i * (t /= r) * t * t + e
            },
            easeOutCubic: function (t, e, i, r) {
                return i * ((t = t / r - 1) * t * t + 1) + e
            },
            easeInOutCubic: function (t, e, i, r) {
                return (t /= r / 2) < 1 ? i / 2 * t * t * t + e : i / 2 * ((t -= 2) * t * t + 2) + e
            },
            easeInQuart: function (t, e, i, r) {
                return i * (t /= r) * t * t * t + e
            },
            easeOutQuart: function (t, e, i, r) {
                return -i * ((t = t / r - 1) * t * t * t - 1) + e
            },
            easeInOutQuart: function (t, e, i, r) {
                return (t /= r / 2) < 1 ? i / 2 * t * t * t * t + e : -i / 2 * ((t -= 2) * t * t * t - 2) + e
            },
            easeInQuint: function (t, e, i, r) {
                return i * (t /= r) * t * t * t * t + e
            },
            easeOutQuint: function (t, e, i, r) {
                return i * ((t = t / r - 1) * t * t * t * t + 1) + e
            },
            easeInOutQuint: function (t, e, i, r) {
                return (t /= r / 2) < 1 ? i / 2 * t * t * t * t * t + e : i / 2 * ((t -= 2) * t * t * t * t + 2) + e
            },
            easeInSine: function (t, e, i, r) {
                return -i * Math.cos(t / r * (Math.PI / 2)) + i + e
            },
            easeOutSine: function (t, e, i, r) {
                return i * Math.sin(t / r * (Math.PI / 2)) + e
            },
            easeInOutSine: function (t, e, i, r) {
                return -i / 2 * (Math.cos(Math.PI * t / r) - 1) + e
            },
            easeInExpo: function (t, e, i, r) {
                return 0 === t ? e : i * Math.pow(2, 10 * (t / r - 1)) + e
            },
            easeOutExpo: function (t, e, i, r) {
                return t === r ? e + i : i * (1 - Math.pow(2, -10 * t / r)) + e
            },
            easeInOutExpo: function (t, e, i, r) {
                return 0 === t ? e : t === r ? e + i : (t /= r / 2) < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + e : i / 2 * (2 - Math.pow(2, -10 * --t)) + e
            },
            easeInCirc: function (t, e, i, r) {
                return -i * (Math.sqrt(1 - (t /= r) * t) - 1) + e
            },
            easeOutCirc: function (t, e, i, r) {
                return i * Math.sqrt(1 - (t = t / r - 1) * t) + e
            },
            easeInOutCirc: function (t, e, i, r) {
                return (t /= r / 2) < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + e : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
            },
            easeInElastic: function (t, e, i, r) {
                var n = 0;
                return 0 === t ? e : 1 == (t /= r) ? e + i : (n || (n = .3 * r), -a(o(i, i, n, 1.70158), t, r) + e)
            },
            easeOutElastic: function (t, e, i, r) {
                var n = 0;
                if (0 === t) return e;
                if (1 == (t /= r)) return e + i;
                n || (n = .3 * r);
                var s = o(i, i, n, 1.70158);
                return s.a * Math.pow(2, -10 * t) * Math.sin((t * r - s.s) * (2 * Math.PI) / s.p) + s.c + e
            },
            easeInOutElastic: function (t, e, i, r) {
                var n = 0;
                if (0 === t) return e;
                if (2 == (t /= r / 2)) return e + i;
                n || (n = r * (.3 * 1.5));
                var s = o(i, i, n, 1.70158);
                return t < 1 ? -.5 * a(s, t, r) + e : s.a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * r - s.s) * (2 * Math.PI) / s.p) * .5 + s.c + e
            },
            easeInBack: function (t, e, i, r, n) {
                return void 0 === n && (n = 1.70158), i * (t /= r) * t * ((n + 1) * t - n) + e
            },
            easeOutBack: function (t, e, i, r, n) {
                return void 0 === n && (n = 1.70158), i * ((t = t / r - 1) * t * ((n + 1) * t + n) + 1) + e
            },
            easeInOutBack: function (t, e, i, r, n) {
                return void 0 === n && (n = 1.70158), (t /= r / 2) < 1 ? i / 2 * (t * t * ((1 + (n *= 1.525)) * t - n)) + e : i / 2 * ((t -= 2) * t * ((1 + (n *= 1.525)) * t + n) + 2) + e
            },
            easeInBounce: n,
            easeOutBounce: s,
            easeInOutBounce: function (t, e, i, r) {
                return t < r / 2 ? .5 * n(2 * t, 0, i, r) + e : .5 * s(2 * t - r, 0, i, r) + .5 * i + e
            }
        }
    }(),
    function (t) {
        "use strict";
        var C = t.fabric || (t.fabric = {}),
            p = C.util.object.extend,
            f = C.util.object.clone,
            v = C.util.toFixed,
            S = C.util.parseUnit,
            h = C.util.multiplyTransformMatrices,
            m = {
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
                "letter-spacing": "charSpacing",
                "paint-order": "paintFirst",
                "stroke-dasharray": "strokeDashArray",
                "stroke-dashoffset": "strokeDashOffset",
                "stroke-linecap": "strokeLineCap",
                "stroke-linejoin": "strokeLineJoin",
                "stroke-miterlimit": "strokeMiterLimit",
                "stroke-opacity": "strokeOpacity",
                "stroke-width": "strokeWidth",
                "text-decoration": "textDecoration",
                "text-anchor": "textAnchor",
                opacity: "opacity",
                "clip-path": "clipPath",
                "clip-rule": "clipRule",
                "vector-effect": "strokeUniform"
            },
            b = {
                stroke: "strokeOpacity",
                fill: "fillOpacity"
            },
            _ = "font-size",
            y = "clip-path";

        function x(t, e, i, r) {
            var n, s = "[object Array]" === Object.prototype.toString.call(e);
            if ("fill" !== t && "stroke" !== t || "none" !== e)
                if ("vector-effect" === t) e = "non-scaling-stroke" === e;
                else if ("strokeDashArray" === t) e = "none" === e ? null : e.replace(/,/g, " ").split(/\s+/).map(parseFloat);
            else if ("transformMatrix" === t) e = i && i.transformMatrix ? h(i.transformMatrix, C.parseTransformAttribute(e)) : C.parseTransformAttribute(e);
            else if ("visible" === t) e = "none" !== e && "hidden" !== e, i && !1 === i.visible && (e = !1);
            else if ("opacity" === t) e = parseFloat(e), i && void 0 !== i.opacity && (e *= i.opacity);
            else if ("textAnchor" === t) e = "start" === e ? "left" : "end" === e ? "right" : "center";
            else if ("charSpacing" === t) n = S(e, r) / r * 1e3;
            else if ("paintFirst" === t) {
                var o = e.indexOf("fill"),
                    a = e.indexOf("stroke");
                e = "fill"; - 1 < o && -1 < a && a < o ? e = "stroke" : -1 === o && -1 < a && (e = "stroke")
            } else {
                if ("href" === t || "xlink:href" === t) return e;
                n = s ? e.map(S) : S(e, r)
            } else e = "";
            return !s && isNaN(n) ? e : n
        }

        function e(t) {
            return new RegExp("^(" + t.join("|") + ")\\b", "i")
        }

        function T(t, e) {
            var i, r, n, s, o = [];
            for (n = 0, s = e.length; n < s; n++) i = e[n], r = t.getElementsByTagName(i), o = o.concat(Array.prototype.slice.call(r));
            return o
        }

        function w(t, e) {
            var i, r = !0;
            return (i = n(t, e.pop())) && e.length && (r = function (t, e) {
                var i, r = !0;
                for (; t.parentNode && 1 === t.parentNode.nodeType && e.length;) r && (i = e.pop()), t = t.parentNode, r = n(t, i);
                return 0 === e.length
            }(t, e)), i && r && 0 === e.length
        }

        function n(t, e) {
            var i, r, n = t.nodeName,
                s = t.getAttribute("class"),
                o = t.getAttribute("id");
            if (i = new RegExp("^" + n, "i"), e = e.replace(i, ""), o && e.length && (i = new RegExp("#" + o + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")), s && e.length)
                for (r = (s = s.split(" ")).length; r--;) i = new RegExp("\\." + s[r] + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "");
            return 0 === e.length
        }

        function O(t, e) {
            var i;
            if (t.getElementById && (i = t.getElementById(e)), i) return i;
            var r, n, s, o = t.getElementsByTagName("*");
            for (n = 0, s = o.length; n < s; n++)
                if (e === (r = o[n]).getAttribute("id")) return r
        }
        C.svgValidTagNamesRegEx = e(["path", "circle", "polygon", "polyline", "ellipse", "rect", "line", "image", "text"]), C.svgViewBoxElementsRegEx = e(["symbol", "image", "marker", "pattern", "view", "svg"]), C.svgInvalidAncestorsRegEx = e(["pattern", "defs", "symbol", "metadata", "clipPath", "mask", "desc"]), C.svgValidParentsRegEx = e(["symbol", "g", "a", "svg", "clipPath", "defs"]), C.cssRules = {}, C.gradientDefs = {}, C.clipPaths = {}, C.parseTransformAttribute = function () {
            function b(t, e, i) {
                t[i] = Math.tan(C.util.degreesToRadians(e[0]))
            }
            var _ = C.iMatrix,
                t = C.reNum,
                e = "(?:\\s+,?\\s*|,\\s*)",
                y = "(?:" + ("(?:(matrix)\\s*\\(\\s*(" + t + ")" + e + "(" + t + ")" + e + "(" + t + ")" + e + "(" + t + ")" + e + "(" + t + ")" + e + "(" + t + ")\\s*\\))") + "|" + ("(?:(translate)\\s*\\(\\s*(" + t + ")(?:" + e + "(" + t + "))?\\s*\\))") + "|" + ("(?:(scale)\\s*\\(\\s*(" + t + ")(?:" + e + "(" + t + "))?\\s*\\))") + "|" + ("(?:(rotate)\\s*\\(\\s*(" + t + ")(?:" + e + "(" + t + ")" + e + "(" + t + "))?\\s*\\))") + "|" + ("(?:(skewX)\\s*\\(\\s*(" + t + ")\\s*\\))") + "|" + ("(?:(skewY)\\s*\\(\\s*(" + t + ")\\s*\\))") + ")",
                i = new RegExp("^\\s*(?:" + ("(?:" + y + "(?:" + e + "*" + y + ")*)") + "?)\\s*$"),
                r = new RegExp(y, "g");
            return function (t) {
                var v = _.concat(),
                    m = [];
                if (!t || t && !i.test(t)) return v;
                t.replace(r, function (t) {
                    var e, i, r, n, s, o, a, h, c, l, u, f, d = new RegExp(y).exec(t).filter(function (t) {
                            return !!t
                        }),
                        g = d[1],
                        p = d.slice(2).map(parseFloat);
                    switch (g) {
                        case "translate":
                            f = p, (u = v)[4] = f[0], 2 === f.length && (u[5] = f[1]);
                            break;
                        case "rotate":
                            p[0] = C.util.degreesToRadians(p[0]), s = v, o = p, a = C.util.cos(o[0]), h = C.util.sin(o[0]), l = c = 0, 3 === o.length && (c = o[1], l = o[2]), s[0] = a, s[1] = h, s[2] = -h, s[3] = a, s[4] = c - (a * c - h * l), s[5] = l - (h * c + a * l);
                            break;
                        case "scale":
                            e = v, r = (i = p)[0], n = 2 === i.length ? i[1] : i[0], e[0] = r, e[3] = n;
                            break;
                        case "skewX":
                            b(v, p, 2);
                            break;
                        case "skewY":
                            b(v, p, 1);
                            break;
                        case "matrix":
                            v = p
                    }
                    m.push(v.concat()), v = _.concat()
                });
                for (var e = m[0]; 1 < m.length;) m.shift(), e = C.util.multiplyTransformMatrices(e, m[0]);
                return e
            }
        }();
        var k = new RegExp("^\\s*(" + C.reNum + "+)\\s*,?\\s*(" + C.reNum + "+)\\s*,?\\s*(" + C.reNum + "+)\\s*,?\\s*(" + C.reNum + "+)\\s*$");

        function P(t) {
            var e, i, r, n, s, o, a = t.getAttribute("viewBox"),
                h = 1,
                c = 1,
                l = t.getAttribute("width"),
                u = t.getAttribute("height"),
                f = t.getAttribute("x") || 0,
                d = t.getAttribute("y") || 0,
                g = t.getAttribute("preserveAspectRatio") || "",
                p = !a || !C.svgViewBoxElementsRegEx.test(t.nodeName) || !(a = a.match(k)),
                v = !l || !u || "100%" === l || "100%" === u,
                m = p && v,
                b = {},
                _ = "",
                y = 0,
                x = 0;
            if (b.width = 0, b.height = 0, b.toBeParsed = m) return b;
            if (p) return b.width = S(l), b.height = S(u), b;
            if (e = -parseFloat(a[1]), i = -parseFloat(a[2]), r = parseFloat(a[3]), n = parseFloat(a[4]), b.minX = e, b.minY = i, b.viewBoxWidth = r, b.viewBoxHeight = n, v ? (b.width = r, b.height = n) : (b.width = S(l), b.height = S(u), h = b.width / r, c = b.height / n), "none" !== (g = C.util.parsePreserveAspectRatioAttribute(g)).alignX && ("meet" === g.meetOrSlice && (c = h = c < h ? c : h), "slice" === g.meetOrSlice && (c = h = c < h ? h : c), y = b.width - r * h, x = b.height - n * h, "Mid" === g.alignX && (y /= 2), "Mid" === g.alignY && (x /= 2), "Min" === g.alignX && (y = 0), "Min" === g.alignY && (x = 0)), 1 === h && 1 === c && 0 === e && 0 === i && 0 === f && 0 === d) return b;
            if ((f || d) && (_ = " translate(" + S(f) + " " + S(d) + ") "), s = _ + " matrix(" + h + " 0 0 " + c + " " + (e * h + y) + " " + (i * c + x) + ") ", b.viewboxTransform = C.parseTransformAttribute(s), "svg" === t.nodeName) {
                for (o = t.ownerDocument.createElementNS(C.svgNS, "g"); t.firstChild;) o.appendChild(t.firstChild);
                t.appendChild(o)
            } else s = (o = t).getAttribute("transform") + s;
            return o.setAttribute("transform", s), b
        }

        function s(t, e) {
            var i = "xlink:href",
                r = O(t, e.getAttribute(i).substr(1));
            if (r && r.getAttribute(i) && s(t, r), ["gradientTransform", "x1", "x2", "y1", "y2", "gradientUnits", "cx", "cy", "r", "fx", "fy"].forEach(function (t) {
                    r && !e.hasAttribute(t) && r.hasAttribute(t) && e.setAttribute(t, r.getAttribute(t))
                }), !e.children.length)
                for (var n = r.cloneNode(!0); n.firstChild;) e.appendChild(n.firstChild);
            e.removeAttribute(i)
        }
        C.parseSVGDocument = function (t, i, e, r) {
            if (t) {
                ! function (t) {
                    for (var e = T(t, ["use", "svg:use"]), i = 0; e.length && i < e.length;) {
                        var r, n, s, o, a = e[i],
                            h = (a.getAttribute("xlink:href") || a.getAttribute("href")).substr(1),
                            c = a.getAttribute("x") || 0,
                            l = a.getAttribute("y") || 0,
                            u = O(t, h).cloneNode(!0),
                            f = (u.getAttribute("transform") || "") + " translate(" + c + ", " + l + ")",
                            d = e.length,
                            g = C.svgNS;
                        if (P(u), /^svg$/i.test(u.nodeName)) {
                            var p = u.ownerDocument.createElementNS(g, "g");
                            for (n = 0, o = (s = u.attributes).length; n < o; n++) r = s.item(n), p.setAttributeNS(g, r.nodeName, r.nodeValue);
                            for (; u.firstChild;) p.appendChild(u.firstChild);
                            u = p
                        }
                        for (n = 0, o = (s = a.attributes).length; n < o; n++) "x" !== (r = s.item(n)).nodeName && "y" !== r.nodeName && "xlink:href" !== r.nodeName && "href" !== r.nodeName && ("transform" === r.nodeName ? f = r.nodeValue + " " + f : u.setAttribute(r.nodeName, r.nodeValue));
                        u.setAttribute("transform", f), u.setAttribute("instantiated_by_use", "1"), u.removeAttribute("id"), a.parentNode.replaceChild(u, a), e.length === d && i++
                    }
                }(t);
                var n, s, o = C.Object.__uid++,
                    a = P(t),
                    h = C.util.toArray(t.getElementsByTagName("*"));
                if (a.crossOrigin = r && r.crossOrigin, a.svgUid = o, 0 === h.length && C.isLikelyNode) {
                    var c = [];
                    for (n = 0, s = (h = t.selectNodes('//*[name(.)!="svg"]')).length; n < s; n++) c[n] = h[n];
                    h = c
                }
                var l = h.filter(function (t) {
                    return P(t), C.svgValidTagNamesRegEx.test(t.nodeName.replace("svg:", "")) && ! function (t, e) {
                        for (; t && (t = t.parentNode);)
                            if (t.nodeName && e.test(t.nodeName.replace("svg:", "")) && !t.getAttribute("instantiated_by_use")) return !0;
                        return !1
                    }(t, C.svgInvalidAncestorsRegEx)
                });
                if (!l || l && !l.length) i && i([], {});
                else {
                    var u = {};
                    h.filter(function (t) {
                        return "clipPath" === t.nodeName.replace("svg:", "")
                    }).forEach(function (t) {
                        var e = t.getAttribute("id");
                        u[e] = C.util.toArray(t.getElementsByTagName("*")).filter(function (t) {
                            return C.svgValidTagNamesRegEx.test(t.nodeName.replace("svg:", ""))
                        })
                    }), C.gradientDefs[o] = C.getGradientDefs(t), C.cssRules[o] = C.getCSSRules(t), C.clipPaths[o] = u, C.parseElements(l, function (t, e) {
                        i && (i(t, a, e, h), delete C.gradientDefs[o], delete C.cssRules[o], delete C.clipPaths[o])
                    }, f(a), e, r)
                }
            }
        };
        var c = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + C.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + C.reNum + "))?\\s+(.*)");
        p(C, {
            parseFontDeclaration: function (t, e) {
                var i = t.match(c);
                if (i) {
                    var r = i[1],
                        n = i[3],
                        s = i[4],
                        o = i[5],
                        a = i[6];
                    r && (e.fontStyle = r), n && (e.fontWeight = isNaN(parseFloat(n)) ? n : parseFloat(n)), s && (e.fontSize = S(s)), a && (e.fontFamily = a), o && (e.lineHeight = "normal" === o ? 1 : o)
                }
            },
            getGradientDefs: function (t) {
                var e, i = T(t, ["linearGradient", "radialGradient", "svg:linearGradient", "svg:radialGradient"]),
                    r = 0,
                    n = {};
                for (r = i.length; r--;)(e = i[r]).getAttribute("xlink:href") && s(t, e), n[e.getAttribute("id")] = e;
                return n
            },
            parseAttributes: function (i, t, e) {
                if (i) {
                    var r, n, s, o = {};
                    void 0 === e && (e = i.getAttribute("svgUid")), i.parentNode && C.svgValidParentsRegEx.test(i.parentNode.nodeName) && (o = C.parseAttributes(i.parentNode, t, e));
                    var a = t.reduce(function (t, e) {
                            return (r = i.getAttribute(e)) && (t[e] = r), t
                        }, {}),
                        h = p(function (t, e) {
                            var i = {};
                            for (var r in C.cssRules[e])
                                if (w(t, r.split(" ")))
                                    for (var n in C.cssRules[e][r]) i[n] = C.cssRules[e][r][n];
                            return i
                        }(i, e), C.parseStyleAttribute(i));
                    a = p(a, h), h[y] && i.setAttribute(y, h[y]), n = s = o.fontSize || C.Text.DEFAULT_SVG_FONT_SIZE, a[_] && (a[_] = n = S(a[_], s));
                    var c, l, u, f = {};
                    for (var d in a) l = x(c = (u = d) in m ? m[u] : u, a[d], o, n), f[c] = l;
                    f && f.font && C.parseFontDeclaration(f.font, f);
                    var g = p(o, f);
                    return C.svgValidParentsRegEx.test(i.nodeName) ? g : function (t) {
                        for (var e in b)
                            if (void 0 !== t[b[e]] && "" !== t[e]) {
                                if (void 0 === t[e]) {
                                    if (!C.Object.prototype[e]) continue;
                                    t[e] = C.Object.prototype[e]
                                }
                                if (0 !== t[e].indexOf("url(")) {
                                    var i = new C.Color(t[e]);
                                    t[e] = i.setAlpha(v(i.getAlpha() * t[b[e]], 2)).toRgba()
                                }
                            } return t
                    }(g)
                }
            },
            parseElements: function (t, e, i, r, n) {
                new C.ElementsParser(t, e, i, r, n).parse()
            },
            parseStyleAttribute: function (t) {
                var i, r, n, e = {},
                    s = t.getAttribute("style");
                return s && ("string" == typeof s ? (i = e, s.replace(/;\s*$/, "").split(";").forEach(function (t) {
                    var e = t.split(":");
                    r = e[0].trim().toLowerCase(), n = e[1].trim(), i[r] = n
                })) : function (t, e) {
                    var i, r;
                    for (var n in t) void 0 !== t[n] && (i = n.toLowerCase(), r = t[n], e[i] = r)
                }(s, e)), e
            },
            parsePointsAttribute: function (t) {
                if (!t) return null;
                var e, i, r = [];
                for (e = 0, i = (t = (t = t.replace(/,/g, " ").trim()).split(/\s+/)).length; e < i; e += 2) r.push({
                    x: parseFloat(t[e]),
                    y: parseFloat(t[e + 1])
                });
                return r
            },
            getCSSRules: function (t) {
                var a, h, e = t.getElementsByTagName("style"),
                    c = {};
                for (a = 0, h = e.length; a < h; a++) {
                    var i = e[a].textContent || e[a].text;
                    "" !== (i = i.replace(/\/\*[\s\S]*?\*\//g, "")).trim() && i.match(/[^{]*\{[\s\S]*?\}/g).map(function (t) {
                        return t.trim()
                    }).forEach(function (t) {
                        var e = t.match(/([\s\S]*?)\s*\{([^}]*)\}/),
                            i = {},
                            r = e[2].trim().replace(/;$/, "").split(/\s*;\s*/);
                        for (a = 0, h = r.length; a < h; a++) {
                            var n = r[a].split(/\s*:\s*/),
                                s = n[0],
                                o = n[1];
                            i[s] = o
                        }(t = e[1]).split(",").forEach(function (t) {
                            "" !== (t = t.replace(/^svg/i, "").trim()) && (c[t] ? C.util.object.extend(c[t], i) : c[t] = C.util.object.clone(i))
                        })
                    })
                }
                return c
            },
            loadSVGFromURL: function (t, n, i, r) {
                t = t.replace(/^\n\s*/, "").trim(), new C.util.request(t, {
                    method: "get",
                    onComplete: function (t) {
                        var e = t.responseXML;
                        e && !e.documentElement && C.window.ActiveXObject && t.responseText && ((e = new ActiveXObject("Microsoft.XMLDOM")).async = "false", e.loadXML(t.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                        if (!e || !e.documentElement) return n && n(null), !1;
                        C.parseSVGDocument(e.documentElement, function (t, e, i, r) {
                            n && n(t, e, i, r)
                        }, i, r)
                    }
                })
            },
            loadSVGFromString: function (t, n, e, i) {
                var r;
                if (t = t.trim(), void 0 !== C.window.DOMParser) {
                    var s = new C.window.DOMParser;
                    s && s.parseFromString && (r = s.parseFromString(t, "text/xml"))
                } else C.window.ActiveXObject && ((r = new ActiveXObject("Microsoft.XMLDOM")).async = "false", r.loadXML(t.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                C.parseSVGDocument(r.documentElement, function (t, e, i, r) {
                    n(t, e, i, r)
                }, e, i)
            }
        })
    }("undefined" != typeof exports ? exports : this), fabric.ElementsParser = function (t, e, i, r, n, s) {
        this.elements = t, this.callback = e, this.options = i, this.reviver = r, this.svgUid = i && i.svgUid || 0, this.parsingOptions = n, this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g, this.doc = s
    },
    function (t) {
        t.parse = function () {
            this.instances = new Array(this.elements.length), this.numElements = this.elements.length, this.createObjects()
        }, t.createObjects = function () {
            var i = this;
            this.elements.forEach(function (t, e) {
                t.setAttribute("svgUid", i.svgUid), i.createObject(t, e)
            })
        }, t.findTag = function (t) {
            return fabric[fabric.util.string.capitalize(t.tagName.replace("svg:", ""))]
        }, t.createObject = function (t, e) {
            var i = this.findTag(t);
            if (i && i.fromElement) try {
                i.fromElement(t, this.createCallback(e, t), this.options)
            } catch (t) {
                fabric.log(t)
            } else this.checkIfDone()
        }, t.createCallback = function (i, r) {
            var n = this;
            return function (t) {
                var e;
                n.resolveGradient(t, r, "fill"), n.resolveGradient(t, r, "stroke"), t instanceof fabric.Image && t._originalElement && (e = t.parsePreserveAspectRatioAttribute(r)), t._removeTransformMatrix(e), n.resolveClipPath(t, r), n.reviver && n.reviver(r, t), n.instances[i] = t, n.checkIfDone()
            }
        }, t.extractPropertyDefinition = function (t, e, i) {
            var r = t[e],
                n = this.regexUrl;
            if (n.test(r)) {
                n.lastIndex = 0;
                var s = n.exec(r)[1];
                return n.lastIndex = 0, fabric[i][this.svgUid][s]
            }
        }, t.resolveGradient = function (t, e, i) {
            var r = this.extractPropertyDefinition(t, i, "gradientDefs");
            if (r) {
                var n = e.getAttribute(i + "-opacity"),
                    s = fabric.Gradient.fromElement(r, t, n, this.options);
                t.set(i, s)
            }
        }, t.createClipPathCallback = function (t, e) {
            return function (t) {
                t._removeTransformMatrix(), t.fillRule = t.clipRule, e.push(t)
            }
        }, t.resolveClipPath = function (t, e) {
            var i, r, n, s, o = this.extractPropertyDefinition(t, "clipPath", "clipPaths");
            if (o) {
                n = [], r = fabric.util.invertTransform(t.calcTransformMatrix());
                for (var a = o[0].parentNode, h = e; h.parentNode && h.getAttribute("clip-path") !== t.clipPath;) h = h.parentNode;
                h.parentNode.appendChild(a);
                for (var c = 0; c < o.length; c++) i = o[c], this.findTag(i).fromElement(i, this.createClipPathCallback(t, n), this.options);
                o = 1 === n.length ? n[0] : new fabric.Group(n), s = fabric.util.multiplyTransformMatrices(r, o.calcTransformMatrix()), o.clipPath && this.resolveClipPath(o, h);
                var l = fabric.util.qrDecompose(s);
                o.flipX = !1, o.flipY = !1, o.set("scaleX", l.scaleX), o.set("scaleY", l.scaleY), o.angle = l.angle, o.skewX = l.skewX, o.skewY = 0, o.setPositionByOrigin({
                    x: l.translateX,
                    y: l.translateY
                }, "center", "center"), t.clipPath = o
            }
        }, t.checkIfDone = function () {
            0 == --this.numElements && (this.instances = this.instances.filter(function (t) {
                return null != t
            }), this.callback(this.instances, this.elements))
        }
    }(fabric.ElementsParser.prototype),
    function (t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});

        function i(t, e) {
            this.x = t, this.y = e
        }
        e.Point ? e.warn("fabric.Point is already defined") : (e.Point = i).prototype = {
            type: "point",
            constructor: i,
            add: function (t) {
                return new i(this.x + t.x, this.y + t.y)
            },
            addEquals: function (t) {
                return this.x += t.x, this.y += t.y, this
            },
            scalarAdd: function (t) {
                return new i(this.x + t, this.y + t)
            },
            scalarAddEquals: function (t) {
                return this.x += t, this.y += t, this
            },
            subtract: function (t) {
                return new i(this.x - t.x, this.y - t.y)
            },
            subtractEquals: function (t) {
                return this.x -= t.x, this.y -= t.y, this
            },
            scalarSubtract: function (t) {
                return new i(this.x - t, this.y - t)
            },
            scalarSubtractEquals: function (t) {
                return this.x -= t, this.y -= t, this
            },
            multiply: function (t) {
                return new i(this.x * t, this.y * t)
            },
            multiplyEquals: function (t) {
                return this.x *= t, this.y *= t, this
            },
            divide: function (t) {
                return new i(this.x / t, this.y / t)
            },
            divideEquals: function (t) {
                return this.x /= t, this.y /= t, this
            },
            eq: function (t) {
                return this.x === t.x && this.y === t.y
            },
            lt: function (t) {
                return this.x < t.x && this.y < t.y
            },
            lte: function (t) {
                return this.x <= t.x && this.y <= t.y
            },
            gt: function (t) {
                return this.x > t.x && this.y > t.y
            },
            gte: function (t) {
                return this.x >= t.x && this.y >= t.y
            },
            lerp: function (t, e) {
                return void 0 === e && (e = .5), e = Math.max(Math.min(1, e), 0), new i(this.x + (t.x - this.x) * e, this.y + (t.y - this.y) * e)
            },
            distanceFrom: function (t) {
                var e = this.x - t.x,
                    i = this.y - t.y;
                return Math.sqrt(e * e + i * i)
            },
            midPointFrom: function (t) {
                return this.lerp(t)
            },
            min: function (t) {
                return new i(Math.min(this.x, t.x), Math.min(this.y, t.y))
            },
            max: function (t) {
                return new i(Math.max(this.x, t.x), Math.max(this.y, t.y))
            },
            toString: function () {
                return this.x + "," + this.y
            },
            setXY: function (t, e) {
                return this.x = t, this.y = e, this
            },
            setX: function (t) {
                return this.x = t, this
            },
            setY: function (t) {
                return this.y = t, this
            },
            setFromPoint: function (t) {
                return this.x = t.x, this.y = t.y, this
            },
            swap: function (t) {
                var e = this.x,
                    i = this.y;
                this.x = t.x, this.y = t.y, t.x = e, t.y = i
            },
            clone: function () {
                return new i(this.x, this.y)
            }
        }
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var f = t.fabric || (t.fabric = {});

        function d(t) {
            this.status = t, this.points = []
        }
        f.Intersection ? f.warn("fabric.Intersection is already defined") : (f.Intersection = d, f.Intersection.prototype = {
            constructor: d,
            appendPoint: function (t) {
                return this.points.push(t), this
            },
            appendPoints: function (t) {
                return this.points = this.points.concat(t), this
            }
        }, f.Intersection.intersectLineLine = function (t, e, i, r) {
            var n, s = (r.x - i.x) * (t.y - i.y) - (r.y - i.y) * (t.x - i.x),
                o = (e.x - t.x) * (t.y - i.y) - (e.y - t.y) * (t.x - i.x),
                a = (r.y - i.y) * (e.x - t.x) - (r.x - i.x) * (e.y - t.y);
            if (0 !== a) {
                var h = s / a,
                    c = o / a;
                0 <= h && h <= 1 && 0 <= c && c <= 1 ? (n = new d("Intersection")).appendPoint(new f.Point(t.x + h * (e.x - t.x), t.y + h * (e.y - t.y))) : n = new d
            } else n = new d(0 === s || 0 === o ? "Coincident" : "Parallel");
            return n
        }, f.Intersection.intersectLinePolygon = function (t, e, i) {
            var r, n, s, o, a = new d,
                h = i.length;
            for (o = 0; o < h; o++) r = i[o], n = i[(o + 1) % h], s = d.intersectLineLine(t, e, r, n), a.appendPoints(s.points);
            return 0 < a.points.length && (a.status = "Intersection"), a
        }, f.Intersection.intersectPolygonPolygon = function (t, e) {
            var i, r = new d,
                n = t.length;
            for (i = 0; i < n; i++) {
                var s = t[i],
                    o = t[(i + 1) % n],
                    a = d.intersectLinePolygon(s, o, e);
                r.appendPoints(a.points)
            }
            return 0 < r.points.length && (r.status = "Intersection"), r
        }, f.Intersection.intersectPolygonRectangle = function (t, e, i) {
            var r = e.min(i),
                n = e.max(i),
                s = new f.Point(n.x, r.y),
                o = new f.Point(r.x, n.y),
                a = d.intersectLinePolygon(r, s, t),
                h = d.intersectLinePolygon(s, n, t),
                c = d.intersectLinePolygon(n, o, t),
                l = d.intersectLinePolygon(o, r, t),
                u = new d;
            return u.appendPoints(a.points), u.appendPoints(h.points), u.appendPoints(c.points), u.appendPoints(l.points), 0 < u.points.length && (u.status = "Intersection"), u
        })
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var c = t.fabric || (t.fabric = {});

        function l(t) {
            t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
        }

        function u(t, e, i) {
            return i < 0 && (i += 1), 1 < i && (i -= 1), i < 1 / 6 ? t + 6 * (e - t) * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
        }
        c.Color ? c.warn("fabric.Color is already defined.") : (c.Color = l, c.Color.prototype = {
            _tryParsingColor: function (t) {
                var e;
                t in l.colorNameMap && (t = l.colorNameMap[t]), "transparent" === t && (e = [255, 255, 255, 0]), e || (e = l.sourceFromHex(t)), e || (e = l.sourceFromRgb(t)), e || (e = l.sourceFromHsl(t)), e || (e = [0, 0, 0, 1]), e && this.setSource(e)
            },
            _rgbToHsl: function (t, e, i) {
                t /= 255, e /= 255, i /= 255;
                var r, n, s, o = c.util.array.max([t, e, i]),
                    a = c.util.array.min([t, e, i]);
                if (s = (o + a) / 2, o === a) r = n = 0;
                else {
                    var h = o - a;
                    switch (n = .5 < s ? h / (2 - o - a) : h / (o + a), o) {
                        case t:
                            r = (e - i) / h + (e < i ? 6 : 0);
                            break;
                        case e:
                            r = (i - t) / h + 2;
                            break;
                        case i:
                            r = (t - e) / h + 4
                    }
                    r /= 6
                }
                return [Math.round(360 * r), Math.round(100 * n), Math.round(100 * s)]
            },
            getSource: function () {
                return this._source
            },
            setSource: function (t) {
                this._source = t
            },
            toRgb: function () {
                var t = this.getSource();
                return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
            },
            toRgba: function () {
                var t = this.getSource();
                return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")"
            },
            toHsl: function () {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
            },
            toHsla: function () {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + t[3] + ")"
            },
            toHex: function () {
                var t, e, i, r = this.getSource();
                return t = 1 === (t = r[0].toString(16)).length ? "0" + t : t, e = 1 === (e = r[1].toString(16)).length ? "0" + e : e, i = 1 === (i = r[2].toString(16)).length ? "0" + i : i, t.toUpperCase() + e.toUpperCase() + i.toUpperCase()
            },
            toHexa: function () {
                var t, e = this.getSource();
                return t = 1 === (t = (t = Math.round(255 * e[3])).toString(16)).length ? "0" + t : t, this.toHex() + t.toUpperCase()
            },
            getAlpha: function () {
                return this.getSource()[3]
            },
            setAlpha: function (t) {
                var e = this.getSource();
                return e[3] = t, this.setSource(e), this
            },
            toGrayscale: function () {
                var t = this.getSource(),
                    e = parseInt((.3 * t[0] + .59 * t[1] + .11 * t[2]).toFixed(0), 10),
                    i = t[3];
                return this.setSource([e, e, e, i]), this
            },
            toBlackWhite: function (t) {
                var e = this.getSource(),
                    i = (.3 * e[0] + .59 * e[1] + .11 * e[2]).toFixed(0),
                    r = e[3];
                return t = t || 127, i = Number(i) < Number(t) ? 0 : 255, this.setSource([i, i, i, r]), this
            },
            overlayWith: function (t) {
                t instanceof l || (t = new l(t));
                var e, i = [],
                    r = this.getAlpha(),
                    n = this.getSource(),
                    s = t.getSource();
                for (e = 0; e < 3; e++) i.push(Math.round(.5 * n[e] + .5 * s[e]));
                return i[3] = r, this.setSource(i), this
            }
        }, c.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i, c.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i, c.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i, c.Color.colorNameMap = {
            aliceblue: "#F0F8FF",
            antiquewhite: "#FAEBD7",
            aqua: "#00FFFF",
            aquamarine: "#7FFFD4",
            azure: "#F0FFFF",
            beige: "#F5F5DC",
            bisque: "#FFE4C4",
            black: "#000000",
            blanchedalmond: "#FFEBCD",
            blue: "#0000FF",
            blueviolet: "#8A2BE2",
            brown: "#A52A2A",
            burlywood: "#DEB887",
            cadetblue: "#5F9EA0",
            chartreuse: "#7FFF00",
            chocolate: "#D2691E",
            coral: "#FF7F50",
            cornflowerblue: "#6495ED",
            cornsilk: "#FFF8DC",
            crimson: "#DC143C",
            cyan: "#00FFFF",
            darkblue: "#00008B",
            darkcyan: "#008B8B",
            darkgoldenrod: "#B8860B",
            darkgray: "#A9A9A9",
            darkgrey: "#A9A9A9",
            darkgreen: "#006400",
            darkkhaki: "#BDB76B",
            darkmagenta: "#8B008B",
            darkolivegreen: "#556B2F",
            darkorange: "#FF8C00",
            darkorchid: "#9932CC",
            darkred: "#8B0000",
            darksalmon: "#E9967A",
            darkseagreen: "#8FBC8F",
            darkslateblue: "#483D8B",
            darkslategray: "#2F4F4F",
            darkslategrey: "#2F4F4F",
            darkturquoise: "#00CED1",
            darkviolet: "#9400D3",
            deeppink: "#FF1493",
            deepskyblue: "#00BFFF",
            dimgray: "#696969",
            dimgrey: "#696969",
            dodgerblue: "#1E90FF",
            firebrick: "#B22222",
            floralwhite: "#FFFAF0",
            forestgreen: "#228B22",
            fuchsia: "#FF00FF",
            gainsboro: "#DCDCDC",
            ghostwhite: "#F8F8FF",
            gold: "#FFD700",
            goldenrod: "#DAA520",
            gray: "#808080",
            grey: "#808080",
            green: "#008000",
            greenyellow: "#ADFF2F",
            honeydew: "#F0FFF0",
            hotpink: "#FF69B4",
            indianred: "#CD5C5C",
            indigo: "#4B0082",
            ivory: "#FFFFF0",
            khaki: "#F0E68C",
            lavender: "#E6E6FA",
            lavenderblush: "#FFF0F5",
            lawngreen: "#7CFC00",
            lemonchiffon: "#FFFACD",
            lightblue: "#ADD8E6",
            lightcoral: "#F08080",
            lightcyan: "#E0FFFF",
            lightgoldenrodyellow: "#FAFAD2",
            lightgray: "#D3D3D3",
            lightgrey: "#D3D3D3",
            lightgreen: "#90EE90",
            lightpink: "#FFB6C1",
            lightsalmon: "#FFA07A",
            lightseagreen: "#20B2AA",
            lightskyblue: "#87CEFA",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            lightsteelblue: "#B0C4DE",
            lightyellow: "#FFFFE0",
            lime: "#00FF00",
            limegreen: "#32CD32",
            linen: "#FAF0E6",
            magenta: "#FF00FF",
            maroon: "#800000",
            mediumaquamarine: "#66CDAA",
            mediumblue: "#0000CD",
            mediumorchid: "#BA55D3",
            mediumpurple: "#9370DB",
            mediumseagreen: "#3CB371",
            mediumslateblue: "#7B68EE",
            mediumspringgreen: "#00FA9A",
            mediumturquoise: "#48D1CC",
            mediumvioletred: "#C71585",
            midnightblue: "#191970",
            mintcream: "#F5FFFA",
            mistyrose: "#FFE4E1",
            moccasin: "#FFE4B5",
            navajowhite: "#FFDEAD",
            navy: "#000080",
            oldlace: "#FDF5E6",
            olive: "#808000",
            olivedrab: "#6B8E23",
            orange: "#FFA500",
            orangered: "#FF4500",
            orchid: "#DA70D6",
            palegoldenrod: "#EEE8AA",
            palegreen: "#98FB98",
            paleturquoise: "#AFEEEE",
            palevioletred: "#DB7093",
            papayawhip: "#FFEFD5",
            peachpuff: "#FFDAB9",
            peru: "#CD853F",
            pink: "#FFC0CB",
            plum: "#DDA0DD",
            powderblue: "#B0E0E6",
            purple: "#800080",
            rebeccapurple: "#663399",
            red: "#FF0000",
            rosybrown: "#BC8F8F",
            royalblue: "#4169E1",
            saddlebrown: "#8B4513",
            salmon: "#FA8072",
            sandybrown: "#F4A460",
            seagreen: "#2E8B57",
            seashell: "#FFF5EE",
            sienna: "#A0522D",
            silver: "#C0C0C0",
            skyblue: "#87CEEB",
            slateblue: "#6A5ACD",
            slategray: "#708090",
            slategrey: "#708090",
            snow: "#FFFAFA",
            springgreen: "#00FF7F",
            steelblue: "#4682B4",
            tan: "#D2B48C",
            teal: "#008080",
            thistle: "#D8BFD8",
            tomato: "#FF6347",
            turquoise: "#40E0D0",
            violet: "#EE82EE",
            wheat: "#F5DEB3",
            white: "#FFFFFF",
            whitesmoke: "#F5F5F5",
            yellow: "#FFFF00",
            yellowgreen: "#9ACD32"
        }, c.Color.fromRgb = function (t) {
            return l.fromSource(l.sourceFromRgb(t))
        }, c.Color.sourceFromRgb = function (t) {
            var e = t.match(l.reRGBa);
            if (e) {
                var i = parseInt(e[1], 10) / (/%$/.test(e[1]) ? 100 : 1) * (/%$/.test(e[1]) ? 255 : 1),
                    r = parseInt(e[2], 10) / (/%$/.test(e[2]) ? 100 : 1) * (/%$/.test(e[2]) ? 255 : 1),
                    n = parseInt(e[3], 10) / (/%$/.test(e[3]) ? 100 : 1) * (/%$/.test(e[3]) ? 255 : 1);
                return [parseInt(i, 10), parseInt(r, 10), parseInt(n, 10), e[4] ? parseFloat(e[4]) : 1]
            }
        }, c.Color.fromRgba = l.fromRgb, c.Color.fromHsl = function (t) {
            return l.fromSource(l.sourceFromHsl(t))
        }, c.Color.sourceFromHsl = function (t) {
            var e = t.match(l.reHSLa);
            if (e) {
                var i, r, n, s = (parseFloat(e[1]) % 360 + 360) % 360 / 360,
                    o = parseFloat(e[2]) / (/%$/.test(e[2]) ? 100 : 1),
                    a = parseFloat(e[3]) / (/%$/.test(e[3]) ? 100 : 1);
                if (0 === o) i = r = n = a;
                else {
                    var h = a <= .5 ? a * (o + 1) : a + o - a * o,
                        c = 2 * a - h;
                    i = u(c, h, s + 1 / 3), r = u(c, h, s), n = u(c, h, s - 1 / 3)
                }
                return [Math.round(255 * i), Math.round(255 * r), Math.round(255 * n), e[4] ? parseFloat(e[4]) : 1]
            }
        }, c.Color.fromHsla = l.fromHsl, c.Color.fromHex = function (t) {
            return l.fromSource(l.sourceFromHex(t))
        }, c.Color.sourceFromHex = function (t) {
            if (t.match(l.reHex)) {
                var e = t.slice(t.indexOf("#") + 1),
                    i = 3 === e.length || 4 === e.length,
                    r = 8 === e.length || 4 === e.length,
                    n = i ? e.charAt(0) + e.charAt(0) : e.substring(0, 2),
                    s = i ? e.charAt(1) + e.charAt(1) : e.substring(2, 4),
                    o = i ? e.charAt(2) + e.charAt(2) : e.substring(4, 6),
                    a = r ? i ? e.charAt(3) + e.charAt(3) : e.substring(6, 8) : "FF";
                return [parseInt(n, 16), parseInt(s, 16), parseInt(o, 16), parseFloat((parseInt(a, 16) / 255).toFixed(2))]
            }
        }, c.Color.fromSource = function (t) {
            var e = new l;
            return e.setSource(t), e
        })
    }("undefined" != typeof exports ? exports : this),
    function () {
        function m(t, e) {
            var i, r, n, s, o = t.getAttribute("style"),
                a = t.getAttribute("offset") || 0;
            if (a = (a = parseFloat(a) / (/%$/.test(a) ? 100 : 1)) < 0 ? 0 : 1 < a ? 1 : a, o) {
                var h = o.split(/\s*;\s*/);
                for ("" === h[h.length - 1] && h.pop(), s = h.length; s--;) {
                    var c = h[s].split(/\s*:\s*/),
                        l = c[0].trim(),
                        u = c[1].trim();
                    "stop-color" === l ? i = u : "stop-opacity" === l && (n = u)
                }
            }
            return i || (i = t.getAttribute("stop-color") || "rgb(0,0,0)"), n || (n = t.getAttribute("stop-opacity")), r = (i = new fabric.Color(i)).getAlpha(), n = isNaN(parseFloat(n)) ? 1 : parseFloat(n), n *= r * e, {
                offset: a,
                color: i.toRgb(),
                opacity: n
            }
        }
        var b = fabric.util.object.clone;

        function _(t, e, i, r) {
            var n, s;
            Object.keys(e).forEach(function (t) {
                "Infinity" === (n = e[t]) ? s = 1: "-Infinity" === n ? s = 0 : (s = parseFloat(e[t], 10), "string" == typeof n && /^(\d+\.\d+)%|(\d+)%$/.test(n) && (s *= .01, "pixels" === r && ("x1" !== t && "x2" !== t && "r2" !== t || (s *= i.viewBoxWidth || i.width), "y1" !== t && "y2" !== t || (s *= i.viewBoxHeight || i.height)))), e[t] = s
            })
        }
        fabric.Gradient = fabric.util.createClass({
            offsetX: 0,
            offsetY: 0,
            gradientTransform: null,
            gradientUnits: "pixels",
            type: "linear",
            initialize: function (e) {
                e || (e = {}), e.coords || (e.coords = {});
                var t, i = this;
                Object.keys(e).forEach(function (t) {
                    i[t] = e[t]
                }), this.id ? this.id += "_" + fabric.Object.__uid++ : this.id = fabric.Object.__uid++, t = {
                    x1: e.coords.x1 || 0,
                    y1: e.coords.y1 || 0,
                    x2: e.coords.x2 || 0,
                    y2: e.coords.y2 || 0
                }, "radial" === this.type && (t.r1 = e.coords.r1 || 0, t.r2 = e.coords.r2 || 0), this.coords = t, this.colorStops = e.colorStops.slice()
            },
            addColorStop: function (t) {
                for (var e in t) {
                    var i = new fabric.Color(t[e]);
                    this.colorStops.push({
                        offset: parseFloat(e),
                        color: i.toRgb(),
                        opacity: i.getAlpha()
                    })
                }
                return this
            },
            toObject: function (t) {
                var e = {
                    type: this.type,
                    coords: this.coords,
                    colorStops: this.colorStops,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    gradientUnits: this.gradientUnits,
                    gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
                };
                return fabric.util.populateWithProperties(this, e, t), e
            },
            toSVG: function (t, e) {
                var i, r, n, s, o = b(this.coords, !0),
                    a = (e = e || {}, b(this.colorStops, !0)),
                    h = o.r1 > o.r2,
                    c = this.gradientTransform ? this.gradientTransform.concat() : fabric.iMatrix.concat(),
                    l = -this.offsetX,
                    u = -this.offsetY,
                    f = !!e.additionalTransform,
                    d = "pixels" === this.gradientUnits ? "userSpaceOnUse" : "objectBoundingBox";
                if (a.sort(function (t, e) {
                        return t.offset - e.offset
                    }), "objectBoundingBox" === d ? (l /= t.width, u /= t.height) : (l += t.width / 2, u += t.height / 2), "path" === t.type && (l -= t.pathOffset.x, u -= t.pathOffset.y), c[4] -= l, c[5] -= u, s = 'id="SVGID_' + this.id + '" gradientUnits="' + d + '"', s += ' gradientTransform="' + (f ? e.additionalTransform + " " : "") + fabric.util.matrixToSVG(c) + '" ', "linear" === this.type ? n = ["<linearGradient ", s, ' x1="', o.x1, '" y1="', o.y1, '" x2="', o.x2, '" y2="', o.y2, '">\n'] : "radial" === this.type && (n = ["<radialGradient ", s, ' cx="', h ? o.x1 : o.x2, '" cy="', h ? o.y1 : o.y2, '" r="', h ? o.r1 : o.r2, '" fx="', h ? o.x2 : o.x1, '" fy="', h ? o.y2 : o.y1, '">\n']), "radial" === this.type) {
                    if (h)
                        for ((a = a.concat()).reverse(), i = 0, r = a.length; i < r; i++) a[i].offset = 1 - a[i].offset;
                    var g = Math.min(o.r1, o.r2);
                    if (0 < g) {
                        var p = g / Math.max(o.r1, o.r2);
                        for (i = 0, r = a.length; i < r; i++) a[i].offset += p * (1 - a[i].offset)
                    }
                }
                for (i = 0, r = a.length; i < r; i++) {
                    var v = a[i];
                    n.push("<stop ", 'offset="', 100 * v.offset + "%", '" style="stop-color:', v.color, void 0 !== v.opacity ? ";stop-opacity: " + v.opacity : ";", '"/>\n')
                }
                return n.push("linear" === this.type ? "</linearGradient>\n" : "</radialGradient>\n"), n.join("")
            },
            toLive: function (t, e) {
                var i, r, n, s = fabric.util.object.clone(this.coords),
                    o = s.x1,
                    a = s.y1,
                    h = s.x2,
                    c = s.y2,
                    l = this.colorStops;
                if (this.type) {
                    for (e instanceof fabric.Text && "percentage" === this.gradientUnits && (o *= e.width, a *= e.height, h *= e.width, c *= e.height), "linear" === this.type ? i = t.createLinearGradient(o, a, h, c) : "radial" === this.type && (i = t.createRadialGradient(o, a, s.r1, h, c, s.r2)), r = 0, n = l.length; r < n; r++) {
                        var u = l[r].color,
                            f = l[r].opacity,
                            d = l[r].offset;
                        void 0 !== f && (u = new fabric.Color(u).setAlpha(f).toRgba()), i.addColorStop(d, u)
                    }
                    return i
                }
            }
        }), fabric.util.object.extend(fabric.Gradient, {
            fromElement: function (t, e, i, r) {
                var n = parseFloat(i) / (/%$/.test(i) ? 100 : 1);
                n = n < 0 ? 0 : 1 < n ? 1 : n, isNaN(n) && (n = 1);
                var s, o, a, h, c, l, u = t.getElementsByTagName("stop"),
                    f = "userSpaceOnUse" === t.getAttribute("gradientUnits") ? "pixels" : "percentage",
                    d = t.getAttribute("gradientTransform") || "",
                    g = [],
                    p = 0,
                    v = 0;
                for ("linearGradient" === t.nodeName || "LINEARGRADIENT" === t.nodeName ? (s = "linear", o = {
                        x1: (l = t).getAttribute("x1") || 0,
                        y1: l.getAttribute("y1") || 0,
                        x2: l.getAttribute("x2") || "100%",
                        y2: l.getAttribute("y2") || 0
                    }) : (s = "radial", o = {
                        x1: (c = t).getAttribute("fx") || c.getAttribute("cx") || "50%",
                        y1: c.getAttribute("fy") || c.getAttribute("cy") || "50%",
                        r1: 0,
                        x2: c.getAttribute("cx") || "50%",
                        y2: c.getAttribute("cy") || "50%",
                        r2: c.getAttribute("r") || "50%"
                    }), a = u.length; a--;) g.push(m(u[a], n));
                return h = fabric.parseTransformAttribute(d), _(e, o, r, f), "pixels" === f && (p = -e.left, v = -e.top), new fabric.Gradient({
                    id: t.getAttribute("id"),
                    type: s,
                    coords: o,
                    colorStops: g,
                    gradientUnits: f,
                    gradientTransform: h,
                    offsetX: p,
                    offsetY: v
                })
            },
            forObject: function (t, e) {
                return e || (e = {}), _(t, e.coords, e.gradientUnits, {
                    viewBoxWidth: 100,
                    viewBoxHeight: 100
                }), new fabric.Gradient(e)
            }
        })
    }(),
    function () {
        "use strict";
        var n = fabric.util.toFixed;
        fabric.Pattern = fabric.util.createClass({
            repeat: "repeat",
            offsetX: 0,
            offsetY: 0,
            crossOrigin: "",
            patternTransform: null,
            initialize: function (t, e) {
                if (t || (t = {}), this.id = fabric.Object.__uid++, this.setOptions(t), !t.source || t.source && "string" != typeof t.source) e && e(this);
                else if (void 0 !== fabric.util.getFunctionBody(t.source)) this.source = new Function(fabric.util.getFunctionBody(t.source)), e && e(this);
                else {
                    var i = this;
                    this.source = fabric.util.createImage(), fabric.util.loadImage(t.source, function (t) {
                        i.source = t, e && e(i)
                    }, null, this.crossOrigin)
                }
            },
            toObject: function (t) {
                var e, i, r = fabric.Object.NUM_FRACTION_DIGITS;
                return "function" == typeof this.source ? e = String(this.source) : "string" == typeof this.source.src ? e = this.source.src : "object" == typeof this.source && this.source.toDataURL && (e = this.source.toDataURL()), i = {
                    type: "pattern",
                    source: e,
                    repeat: this.repeat,
                    crossOrigin: this.crossOrigin,
                    offsetX: n(this.offsetX, r),
                    offsetY: n(this.offsetY, r),
                    patternTransform: this.patternTransform ? this.patternTransform.concat() : null
                }, fabric.util.populateWithProperties(this, i, t), i
            },
            toSVG: function (t) {
                var e = "function" == typeof this.source ? this.source() : this.source,
                    i = e.width / t.width,
                    r = e.height / t.height,
                    n = this.offsetX / t.width,
                    s = this.offsetY / t.height,
                    o = "";
                return "repeat-x" !== this.repeat && "no-repeat" !== this.repeat || (r = 1, s && (r += Math.abs(s))), "repeat-y" !== this.repeat && "no-repeat" !== this.repeat || (i = 1, n && (i += Math.abs(n))), e.src ? o = e.src : e.toDataURL && (o = e.toDataURL()), '<pattern id="SVGID_' + this.id + '" x="' + n + '" y="' + s + '" width="' + i + '" height="' + r + '">\n<image x="0" y="0" width="' + e.width + '" height="' + e.height + '" xlink:href="' + o + '"></image>\n</pattern>\n'
            },
            setOptions: function (t) {
                for (var e in t) this[e] = t[e]
            },
            toLive: function (t) {
                var e = "function" == typeof this.source ? this.source() : this.source;
                if (!e) return "";
                if (void 0 !== e.src) {
                    if (!e.complete) return "";
                    if (0 === e.naturalWidth || 0 === e.naturalHeight) return ""
                }
                return t.createPattern(e, this.repeat)
            }
        })
    }(),
    function (t) {
        "use strict";
        var o = t.fabric || (t.fabric = {}),
            a = o.util.toFixed;
        o.Shadow ? o.warn("fabric.Shadow is already defined.") : (o.Shadow = o.util.createClass({
            color: "rgb(0,0,0)",
            blur: 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: !1,
            includeDefaultValues: !0,
            nonScaling: !1,
            initialize: function (t) {
                for (var e in "string" == typeof t && (t = this._parseShadow(t)), t) this[e] = t[e];
                this.id = o.Object.__uid++
            },
            _parseShadow: function (t) {
                var e = t.trim(),
                    i = o.Shadow.reOffsetsAndBlur.exec(e) || [];
                return {
                    color: (e.replace(o.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)").trim(),
                    offsetX: parseInt(i[1], 10) || 0,
                    offsetY: parseInt(i[2], 10) || 0,
                    blur: parseInt(i[3], 10) || 0
                }
            },
            toString: function () {
                return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
            },
            toSVG: function (t) {
                var e = 40,
                    i = 40,
                    r = o.Object.NUM_FRACTION_DIGITS,
                    n = o.util.rotateVector({
                        x: this.offsetX,
                        y: this.offsetY
                    }, o.util.degreesToRadians(-t.angle)),
                    s = new o.Color(this.color);
                return t.width && t.height && (e = 100 * a((Math.abs(n.x) + this.blur) / t.width, r) + 20, i = 100 * a((Math.abs(n.y) + this.blur) / t.height, r) + 20), t.flipX && (n.x *= -1), t.flipY && (n.y *= -1), '<filter id="SVGID_' + this.id + '" y="-' + i + '%" height="' + (100 + 2 * i) + '%" x="-' + e + '%" width="' + (100 + 2 * e) + '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' + a(this.blur ? this.blur / 2 : 0, r) + '"></feGaussianBlur>\n\t<feOffset dx="' + a(n.x, r) + '" dy="' + a(n.y, r) + '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' + s.toRgb() + '" flood-opacity="' + s.getAlpha() + '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n'
            },
            toObject: function () {
                if (this.includeDefaultValues) return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    affectStroke: this.affectStroke,
                    nonScaling: this.nonScaling
                };
                var e = {},
                    i = o.Shadow.prototype;
                return ["color", "blur", "offsetX", "offsetY", "affectStroke", "nonScaling"].forEach(function (t) {
                    this[t] !== i[t] && (e[t] = this[t])
                }, this), e
            }
        }), o.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/)
    }("undefined" != typeof exports ? exports : this),
    function () {
        "use strict";
        if (fabric.StaticCanvas) fabric.warn("fabric.StaticCanvas is already defined.");
        else {
            var n = fabric.util.object.extend,
                t = fabric.util.getElementOffset,
                c = fabric.util.removeFromArray,
                a = fabric.util.toFixed,
                s = fabric.util.transformPoint,
                o = fabric.util.invertTransform,
                i = fabric.util.getNodeCanvas,
                r = fabric.util.createCanvasElement,
                e = new Error("Could not initialize `canvas` element");
            fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
                initialize: function (t, e) {
                    e || (e = {}), this.renderAndResetBound = this.renderAndReset.bind(this), this.requestRenderAllBound = this.requestRenderAll.bind(this), this._initStatic(t, e)
                },
                backgroundColor: "",
                backgroundImage: null,
                overlayColor: "",
                overlayImage: null,
                includeDefaultValues: !0,
                stateful: !1,
                renderOnAddRemove: !0,
                clipTo: null,
                controlsAboveOverlay: !1,
                allowTouchScrolling: !1,
                imageSmoothingEnabled: !0,
                viewportTransform: fabric.iMatrix.concat(),
                backgroundVpt: !0,
                overlayVpt: !0,
                onBeforeScaleRotate: function () {},
                enableRetinaScaling: !0,
                vptCoords: {},
                skipOffscreen: !0,
                clipPath: void 0,
                _initStatic: function (t, e) {
                    var i = this.requestRenderAllBound;
                    this._objects = [], this._createLowerCanvas(t), this._initOptions(e), this._setImageSmoothing(), this.interactive || this._initRetinaScaling(), e.overlayImage && this.setOverlayImage(e.overlayImage, i), e.backgroundImage && this.setBackgroundImage(e.backgroundImage, i), e.backgroundColor && this.setBackgroundColor(e.backgroundColor, i), e.overlayColor && this.setOverlayColor(e.overlayColor, i), this.calcOffset()
                },
                _isRetinaScaling: function () {
                    return 1 !== fabric.devicePixelRatio && this.enableRetinaScaling
                },
                getRetinaScaling: function () {
                    return this._isRetinaScaling() ? fabric.devicePixelRatio : 1
                },
                _initRetinaScaling: function () {
                    if (this._isRetinaScaling()) {
                        var t = fabric.devicePixelRatio;
                        this.__initRetinaScaling(t, this.lowerCanvasEl, this.contextContainer), this.upperCanvasEl && this.__initRetinaScaling(t, this.upperCanvasEl, this.contextTop)
                    }
                },
                __initRetinaScaling: function (t, e, i) {
                    e.setAttribute("width", this.width * t), e.setAttribute("height", this.height * t), i.scale(t, t)
                },
                calcOffset: function () {
                    return this._offset = t(this.lowerCanvasEl), this
                },
                setOverlayImage: function (t, e, i) {
                    return this.__setBgOverlayImage("overlayImage", t, e, i)
                },
                setBackgroundImage: function (t, e, i) {
                    return this.__setBgOverlayImage("backgroundImage", t, e, i)
                },
                setOverlayColor: function (t, e) {
                    return this.__setBgOverlayColor("overlayColor", t, e)
                },
                setBackgroundColor: function (t, e) {
                    return this.__setBgOverlayColor("backgroundColor", t, e)
                },
                _setImageSmoothing: function () {
                    var t = this.getContext();
                    t.imageSmoothingEnabled = t.imageSmoothingEnabled || t.webkitImageSmoothingEnabled || t.mozImageSmoothingEnabled || t.msImageSmoothingEnabled || t.oImageSmoothingEnabled, t.imageSmoothingEnabled = this.imageSmoothingEnabled
                },
                __setBgOverlayImage: function (i, t, r, n) {
                    return "string" == typeof t ? fabric.util.loadImage(t, function (t) {
                        if (t) {
                            var e = new fabric.Image(t, n);
                            (this[i] = e).canvas = this
                        }
                        r && r(t)
                    }, this, n && n.crossOrigin) : (n && t.setOptions(n), (this[i] = t) && (t.canvas = this), r && r(t)), this
                },
                __setBgOverlayColor: function (t, e, i) {
                    return this[t] = e, this._initGradient(e, t), this._initPattern(e, t, i), this
                },
                _createCanvasElement: function () {
                    var t = r();
                    if (!t) throw e;
                    if (t.style || (t.style = {}), void 0 === t.getContext) throw e;
                    return t
                },
                _initOptions: function (t) {
                    var e = this.lowerCanvasEl;
                    this._setOptions(t), this.width = this.width || parseInt(e.width, 10) || 0, this.height = this.height || parseInt(e.height, 10) || 0, this.lowerCanvasEl.style && (e.width = this.width, e.height = this.height, e.style.width = this.width + "px", e.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
                },
                _createLowerCanvas: function (t) {
                    t && t.getContext ? this.lowerCanvasEl = t : this.lowerCanvasEl = fabric.util.getById(t) || this._createCanvasElement(), fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext("2d")
                },
                getWidth: function () {
                    return this.width
                },
                getHeight: function () {
                    return this.height
                },
                setWidth: function (t, e) {
                    return this.setDimensions({
                        width: t
                    }, e)
                },
                setHeight: function (t, e) {
                    return this.setDimensions({
                        height: t
                    }, e)
                },
                setDimensions: function (t, e) {
                    var i;
                    for (var r in e = e || {}, t) i = t[r], e.cssOnly || (this._setBackstoreDimension(r, t[r]), i += "px", this.hasLostContext = !0), e.backstoreOnly || this._setCssDimension(r, i);
                    return this._isCurrentlyDrawing && this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles(), this._initRetinaScaling(), this._setImageSmoothing(), this.calcOffset(), e.cssOnly || this.requestRenderAll(), this
                },
                _setBackstoreDimension: function (t, e) {
                    return this.lowerCanvasEl[t] = e, this.upperCanvasEl && (this.upperCanvasEl[t] = e), this.cacheCanvasEl && (this.cacheCanvasEl[t] = e), this[t] = e, this
                },
                _setCssDimension: function (t, e) {
                    return this.lowerCanvasEl.style[t] = e, this.upperCanvasEl && (this.upperCanvasEl.style[t] = e), this.wrapperEl && (this.wrapperEl.style[t] = e), this
                },
                getZoom: function () {
                    return this.viewportTransform[0]
                },
                setViewportTransform: function (t) {
                    var e, i, r, n = this._activeObject;
                    for (this.viewportTransform = t, i = 0, r = this._objects.length; i < r; i++)(e = this._objects[i]).group || e.setCoords(!1, !0);
                    return n && "activeSelection" === n.type && n.setCoords(!1, !0), this.calcViewportBoundaries(), this.renderOnAddRemove && this.requestRenderAll(), this
                },
                zoomToPoint: function (t, e) {
                    var i = t,
                        r = this.viewportTransform.slice(0);
                    t = s(t, o(this.viewportTransform)), r[0] = e, r[3] = e;
                    var n = s(t, r);
                    return r[4] += i.x - n.x, r[5] += i.y - n.y, this.setViewportTransform(r)
                },
                setZoom: function (t) {
                    return this.zoomToPoint(new fabric.Point(0, 0), t), this
                },
                absolutePan: function (t) {
                    var e = this.viewportTransform.slice(0);
                    return e[4] = -t.x, e[5] = -t.y, this.setViewportTransform(e)
                },
                relativePan: function (t) {
                    return this.absolutePan(new fabric.Point(-t.x - this.viewportTransform[4], -t.y - this.viewportTransform[5]))
                },
                getElement: function () {
                    return this.lowerCanvasEl
                },
                _onObjectAdded: function (t) {
                    this.stateful && t.setupState(), t._set("canvas", this), t.setCoords(), this.fire("object:added", {
                        target: t
                    }), t.fire("added")
                },
                _onObjectRemoved: function (t) {
                    this.fire("object:removed", {
                        target: t
                    }), t.fire("removed"), delete t.canvas
                },
                clearContext: function (t) {
                    return t.clearRect(0, 0, this.width, this.height), this
                },
                getContext: function () {
                    return this.contextContainer
                },
                clear: function () {
                    return this._objects.length = 0, this.backgroundImage = null, this.overlayImage = null, this.backgroundColor = "", this.overlayColor = "", this._hasITextHandlers && (this.off("mouse:up", this._mouseUpITextHandler), this._iTextInstances = null, this._hasITextHandlers = !1), this.clearContext(this.contextContainer), this.fire("canvas:cleared"), this.renderOnAddRemove && this.requestRenderAll(), this
                },
                renderAll: function () {
                    var t = this.contextContainer;
                    return this.renderCanvas(t, this._objects), this
                },
                renderAndReset: function () {
                    this.isRendering = 0, this.renderAll()
                },
                requestRenderAll: function () {
                    return this.isRendering || (this.isRendering = fabric.util.requestAnimFrame(this.renderAndResetBound)), this
                },
                calcViewportBoundaries: function () {
                    var t = {},
                        e = this.width,
                        i = this.height,
                        r = o(this.viewportTransform);
                    return t.tl = s({
                        x: 0,
                        y: 0
                    }, r), t.br = s({
                        x: e,
                        y: i
                    }, r), t.tr = new fabric.Point(t.br.x, t.tl.y), t.bl = new fabric.Point(t.tl.x, t.br.y), this.vptCoords = t
                },
                cancelRequestedRender: function () {
                    this.isRendering && (fabric.util.cancelAnimFrame(this.isRendering), this.isRendering = 0)
                },
                renderCanvas: function (t, e) {
                    var i = this.viewportTransform,
                        r = this.clipPath;
                    this.cancelRequestedRender(), this.calcViewportBoundaries(), this.clearContext(t), this.fire("before:render", {
                        ctx: t
                    }), this.clipTo && fabric.util.clipContext(this, t), this._renderBackground(t), t.save(), t.transform(i[0], i[1], i[2], i[3], i[4], i[5]), this._renderObjects(t, e), t.restore(), !this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.clipTo && t.restore(), r && (r.canvas = this, r.shouldCache(), r._transformDone = !0, r.renderCache({
                        forClipping: !0
                    }), this.drawClipPathOnCanvas(t)), this._renderOverlay(t), this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.fire("after:render", {
                        ctx: t
                    })
                },
                drawClipPathOnCanvas: function (t) {
                    var e = this.viewportTransform,
                        i = this.clipPath;
                    t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]), t.globalCompositeOperation = "destination-in", i.transform(t), t.scale(1 / i.zoomX, 1 / i.zoomY), t.drawImage(i._cacheCanvas, -i.cacheTranslationX, -i.cacheTranslationY), t.restore()
                },
                _renderObjects: function (t, e) {
                    var i, r;
                    for (i = 0, r = e.length; i < r; ++i) e[i] && e[i].render(t)
                },
                _renderBackgroundOrOverlay: function (t, e) {
                    var i = this[e + "Color"],
                        r = this[e + "Image"],
                        n = this.viewportTransform,
                        s = this[e + "Vpt"];
                    if (i || r) {
                        if (i) {
                            t.save(), t.beginPath(), t.moveTo(0, 0), t.lineTo(this.width, 0), t.lineTo(this.width, this.height), t.lineTo(0, this.height), t.closePath(), t.fillStyle = i.toLive ? i.toLive(t, this) : i, s && t.transform(n[0], n[1], n[2], n[3], n[4], n[5]), t.transform(1, 0, 0, 1, i.offsetX || 0, i.offsetY || 0);
                            var o = i.gradientTransform || i.patternTransform;
                            o && t.transform(o[0], o[1], o[2], o[3], o[4], o[5]), t.fill(), t.restore()
                        }
                        r && (t.save(), s && t.transform(n[0], n[1], n[2], n[3], n[4], n[5]), r.render(t), t.restore())
                    }
                },
                _renderBackground: function (t) {
                    this._renderBackgroundOrOverlay(t, "background")
                },
                _renderOverlay: function (t) {
                    this._renderBackgroundOrOverlay(t, "overlay")
                },
                getCenter: function () {
                    return {
                        top: this.height / 2,
                        left: this.width / 2
                    }
                },
                centerObjectH: function (t) {
                    return this._centerObject(t, new fabric.Point(this.getCenter().left, t.getCenterPoint().y))
                },
                centerObjectV: function (t) {
                    return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, this.getCenter().top))
                },
                centerObject: function (t) {
                    var e = this.getCenter();
                    return this._centerObject(t, new fabric.Point(e.left, e.top))
                },
                viewportCenterObject: function (t) {
                    var e = this.getVpCenter();
                    return this._centerObject(t, e)
                },
                viewportCenterObjectH: function (t) {
                    var e = this.getVpCenter();
                    return this._centerObject(t, new fabric.Point(e.x, t.getCenterPoint().y)), this
                },
                viewportCenterObjectV: function (t) {
                    var e = this.getVpCenter();
                    return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, e.y))
                },
                getVpCenter: function () {
                    var t = this.getCenter(),
                        e = o(this.viewportTransform);
                    return s({
                        x: t.left,
                        y: t.top
                    }, e)
                },
                _centerObject: function (t, e) {
                    return t.setPositionByOrigin(e, "center", "center"), t.setCoords(), this.renderOnAddRemove && this.requestRenderAll(), this
                },
                toDatalessJSON: function (t) {
                    return this.toDatalessObject(t)
                },
                toObject: function (t) {
                    return this._toObjectMethod("toObject", t)
                },
                toDatalessObject: function (t) {
                    return this._toObjectMethod("toDatalessObject", t)
                },
                _toObjectMethod: function (t, e) {
                    var i = this.clipPath,
                        r = {
                            version: fabric.version,
                            objects: this._toObjects(t, e)
                        };
                    return i && (r.clipPath = this._toObject(this.clipPath, t, e)), n(r, this.__serializeBgOverlay(t, e)), fabric.util.populateWithProperties(this, r, e), r
                },
                _toObjects: function (e, i) {
                    return this._objects.filter(function (t) {
                        return !t.excludeFromExport
                    }).map(function (t) {
                        return this._toObject(t, e, i)
                    }, this)
                },
                _toObject: function (t, e, i) {
                    var r;
                    this.includeDefaultValues || (r = t.includeDefaultValues, t.includeDefaultValues = !1);
                    var n = t[e](i);
                    return this.includeDefaultValues || (t.includeDefaultValues = r), n
                },
                __serializeBgOverlay: function (t, e) {
                    var i = {},
                        r = this.backgroundImage,
                        n = this.overlayImage;
                    return this.backgroundColor && (i.background = this.backgroundColor.toObject ? this.backgroundColor.toObject(e) : this.backgroundColor), this.overlayColor && (i.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(e) : this.overlayColor), r && !r.excludeFromExport && (i.backgroundImage = this._toObject(r, t, e)), n && !n.excludeFromExport && (i.overlayImage = this._toObject(n, t, e)), i
                },
                svgViewportTransformation: !0,
                toSVG: function (t, e) {
                    t || (t = {}), t.reviver = e;
                    var i = [];
                    return this._setSVGPreamble(i, t), this._setSVGHeader(i, t), this.clipPath && i.push('<g clip-path="url(#' + this.clipPath.clipPathId + ')" >\n'), this._setSVGBgOverlayColor(i, "background"), this._setSVGBgOverlayImage(i, "backgroundImage", e), this._setSVGObjects(i, e), this.clipPath && i.push("</g>\n"), this._setSVGBgOverlayColor(i, "overlay"), this._setSVGBgOverlayImage(i, "overlayImage", e), i.push("</svg>"), i.join("")
                },
                _setSVGPreamble: function (t, e) {
                    e.suppressPreamble || t.push('<?xml version="1.0" encoding="', e.encoding || "UTF-8", '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
                },
                _setSVGHeader: function (t, e) {
                    var i, r = e.width || this.width,
                        n = e.height || this.height,
                        s = 'viewBox="0 0 ' + this.width + " " + this.height + '" ',
                        o = fabric.Object.NUM_FRACTION_DIGITS;
                    e.viewBox ? s = 'viewBox="' + e.viewBox.x + " " + e.viewBox.y + " " + e.viewBox.width + " " + e.viewBox.height + '" ' : this.svgViewportTransformation && (i = this.viewportTransform, s = 'viewBox="' + a(-i[4] / i[0], o) + " " + a(-i[5] / i[3], o) + " " + a(this.width / i[0], o) + " " + a(this.height / i[3], o) + '" '), t.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', r, '" ', 'height="', n, '" ', s, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>\n", this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), this.createSVGClipPathMarkup(e), "</defs>\n")
                },
                createSVGClipPathMarkup: function (t) {
                    var e = this.clipPath;
                    return e ? (e.clipPathId = "CLIPPATH_" + fabric.Object.__uid++, '<clipPath id="' + e.clipPathId + '" >\n' + this.clipPath.toClipPathSVG(t.reviver) + "</clipPath>\n") : ""
                },
                createSVGRefElementsMarkup: function () {
                    var s = this;
                    return ["background", "overlay"].map(function (t) {
                        var e = s[t + "Color"];
                        if (e && e.toLive) {
                            var i = s[t + "Vpt"],
                                r = s.viewportTransform,
                                n = {
                                    width: s.width / (i ? r[0] : 1),
                                    height: s.height / (i ? r[3] : 1)
                                };
                            return e.toSVG(n, {
                                additionalTransform: i ? fabric.util.matrixToSVG(r) : ""
                            })
                        }
                    }).join("")
                },
                createSVGFontFacesMarkup: function () {
                    var t, e, i, r, n, s, o, a, h = "",
                        c = {},
                        l = fabric.fontPaths,
                        u = this._objects;
                    for (o = 0, a = u.length; o < a; o++)
                        if (e = (t = u[o]).fontFamily, -1 !== t.type.indexOf("text") && !c[e] && l[e] && (c[e] = !0, t.styles))
                            for (n in i = t.styles)
                                for (s in r = i[n]) !c[e = r[s].fontFamily] && l[e] && (c[e] = !0);
                    for (var f in c) h += ["\t\t@font-face {\n", "\t\t\tfont-family: '", f, "';\n", "\t\t\tsrc: url('", l[f], "');\n", "\t\t}\n"].join("");
                    return h && (h = ['\t<style type="text/css">', "<![CDATA[\n", h, "]]>", "</style>\n"].join("")), h
                },
                _setSVGObjects: function (t, e) {
                    var i, r, n, s = this._objects;
                    for (r = 0, n = s.length; r < n; r++)(i = s[r]).excludeFromExport || this._setSVGObject(t, i, e)
                },
                _setSVGObject: function (t, e, i) {
                    t.push(e.toSVG(i))
                },
                _setSVGBgOverlayImage: function (t, e, i) {
                    this[e] && !this[e].excludeFromExport && this[e].toSVG && t.push(this[e].toSVG(i))
                },
                _setSVGBgOverlayColor: function (t, e) {
                    var i = this[e + "Color"],
                        r = this.viewportTransform,
                        n = this.width,
                        s = this.height;
                    if (i)
                        if (i.toLive) {
                            var o = i.repeat,
                                a = fabric.util.invertTransform(r),
                                h = this[e + "Vpt"] ? fabric.util.matrixToSVG(a) : "";
                            t.push('<rect transform="' + h + " translate(", n / 2, ",", s / 2, ')"', ' x="', i.offsetX - n / 2, '" y="', i.offsetY - s / 2, '" ', 'width="', "repeat-y" === o || "no-repeat" === o ? i.source.width : n, '" height="', "repeat-x" === o || "no-repeat" === o ? i.source.height : s, '" fill="url(#SVGID_' + i.id + ')"', "></rect>\n")
                        } else t.push('<rect x="0" y="0" width="100%" height="100%" ', 'fill="', i, '"', "></rect>\n")
                },
                sendToBack: function (t) {
                    if (!t) return this;
                    var e, i, r, n = this._activeObject;
                    if (t === n && "activeSelection" === t.type)
                        for (e = (r = n._objects).length; e--;) i = r[e], c(this._objects, i), this._objects.unshift(i);
                    else c(this._objects, t), this._objects.unshift(t);
                    return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                bringToFront: function (t) {
                    if (!t) return this;
                    var e, i, r, n = this._activeObject;
                    if (t === n && "activeSelection" === t.type)
                        for (r = n._objects, e = 0; e < r.length; e++) i = r[e], c(this._objects, i), this._objects.push(i);
                    else c(this._objects, t), this._objects.push(t);
                    return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                sendBackwards: function (t, e) {
                    if (!t) return this;
                    var i, r, n, s, o, a = this._activeObject,
                        h = 0;
                    if (t === a && "activeSelection" === t.type)
                        for (o = a._objects, i = 0; i < o.length; i++) r = o[i], 0 + h < (n = this._objects.indexOf(r)) && (s = n - 1, c(this._objects, r), this._objects.splice(s, 0, r)), h++;
                    else 0 !== (n = this._objects.indexOf(t)) && (s = this._findNewLowerIndex(t, n, e), c(this._objects, t), this._objects.splice(s, 0, t));
                    return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                _findNewLowerIndex: function (t, e, i) {
                    var r, n;
                    if (i)
                        for (n = (r = e) - 1; 0 <= n; --n) {
                            if (t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t)) {
                                r = n;
                                break
                            }
                        } else r = e - 1;
                    return r
                },
                bringForward: function (t, e) {
                    if (!t) return this;
                    var i, r, n, s, o, a = this._activeObject,
                        h = 0;
                    if (t === a && "activeSelection" === t.type)
                        for (i = (o = a._objects).length; i--;) r = o[i], (n = this._objects.indexOf(r)) < this._objects.length - 1 - h && (s = n + 1, c(this._objects, r), this._objects.splice(s, 0, r)), h++;
                    else(n = this._objects.indexOf(t)) !== this._objects.length - 1 && (s = this._findNewUpperIndex(t, n, e), c(this._objects, t), this._objects.splice(s, 0, t));
                    return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                _findNewUpperIndex: function (t, e, i) {
                    var r, n, s;
                    if (i)
                        for (n = (r = e) + 1, s = this._objects.length; n < s; ++n) {
                            if (t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t)) {
                                r = n;
                                break
                            }
                        } else r = e + 1;
                    return r
                },
                moveTo: function (t, e) {
                    return c(this._objects, t), this._objects.splice(e, 0, t), this.renderOnAddRemove && this.requestRenderAll()
                },
                dispose: function () {
                    return this.isRendering && (fabric.util.cancelAnimFrame(this.isRendering), this.isRendering = 0), this.forEachObject(function (t) {
                        t.dispose && t.dispose()
                    }), this._objects = [], this.backgroundImage && this.backgroundImage.dispose && this.backgroundImage.dispose(), this.backgroundImage = null, this.overlayImage && this.overlayImage.dispose && this.overlayImage.dispose(), this.overlayImage = null, this._iTextInstances = null, this.contextContainer = null, fabric.util.cleanUpJsdomNode(this.lowerCanvasEl), this.lowerCanvasEl = void 0, this
                },
                toString: function () {
                    return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this._objects.length + " }>"
                }
            }), n(fabric.StaticCanvas.prototype, fabric.Observable), n(fabric.StaticCanvas.prototype, fabric.Collection), n(fabric.StaticCanvas.prototype, fabric.DataURLExporter), n(fabric.StaticCanvas, {
                EMPTY_JSON: '{"objects": [], "background": "white"}',
                supports: function (t) {
                    var e = r();
                    if (!e || !e.getContext) return null;
                    var i = e.getContext("2d");
                    if (!i) return null;
                    switch (t) {
                        case "setLineDash":
                            return void 0 !== i.setLineDash;
                        default:
                            return null
                    }
                }
            }), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject, fabric.isLikelyNode && (fabric.StaticCanvas.prototype.createPNGStream = function () {
                var t = i(this.lowerCanvasEl);
                return t && t.createPNGStream()
            }, fabric.StaticCanvas.prototype.createJPEGStream = function (t) {
                var e = i(this.lowerCanvasEl);
                return e && e.createJPEGStream(t)
            })
        }
    }(), fabric.BaseBrush = fabric.util.createClass({
        color: "rgb(0, 0, 0)",
        width: 1,
        shadow: null,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        strokeMiterLimit: 10,
        strokeDashArray: null,
        setShadow: function (t) {
            return this.shadow = new fabric.Shadow(t), this
        },
        _setBrushStyles: function () {
            var t = this.canvas.contextTop;
            t.strokeStyle = this.color, t.lineWidth = this.width, t.lineCap = this.strokeLineCap, t.miterLimit = this.strokeMiterLimit, t.lineJoin = this.strokeLineJoin, fabric.StaticCanvas.supports("setLineDash") && t.setLineDash(this.strokeDashArray || [])
        },
        _saveAndTransform: function (t) {
            var e = this.canvas.viewportTransform;
            t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        _setShadow: function () {
            if (this.shadow) {
                var t = this.canvas,
                    e = this.shadow,
                    i = t.contextTop,
                    r = t.getZoom();
                t && t._isRetinaScaling() && (r *= fabric.devicePixelRatio), i.shadowColor = e.color, i.shadowBlur = e.blur * r, i.shadowOffsetX = e.offsetX * r, i.shadowOffsetY = e.offsetY * r
            }
        },
        needsFullRender: function () {
            return new fabric.Color(this.color).getAlpha() < 1 || !!this.shadow
        },
        _resetShadow: function () {
            var t = this.canvas.contextTop;
            t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0
        }
    }), fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
        decimate: .4,
        initialize: function (t) {
            this.canvas = t, this._points = []
        },
        _drawSegment: function (t, e, i) {
            var r = e.midPointFrom(i);
            return t.quadraticCurveTo(e.x, e.y, r.x, r.y), r
        },
        onMouseDown: function (t, e) {
            this.canvas._isMainEvent(e.e) && (this._prepareForDrawing(t), this._captureDrawingPath(t), this._render())
        },
        onMouseMove: function (t, e) {
            if (this.canvas._isMainEvent(e.e) && this._captureDrawingPath(t) && 1 < this._points.length)
                if (this.needsFullRender()) this.canvas.clearContext(this.canvas.contextTop), this._render();
                else {
                    var i = this._points,
                        r = i.length,
                        n = this.canvas.contextTop;
                    this._saveAndTransform(n), this.oldEnd && (n.beginPath(), n.moveTo(this.oldEnd.x, this.oldEnd.y)), this.oldEnd = this._drawSegment(n, i[r - 2], i[r - 1], !0), n.stroke(), n.restore()
                }
        },
        onMouseUp: function (t) {
            return !this.canvas._isMainEvent(t.e) || (this.oldEnd = void 0, this._finalizeAndAddPath(), !1)
        },
        _prepareForDrawing: function (t) {
            var e = new fabric.Point(t.x, t.y);
            this._reset(), this._addPoint(e), this.canvas.contextTop.moveTo(e.x, e.y)
        },
        _addPoint: function (t) {
            return !(1 < this._points.length && t.eq(this._points[this._points.length - 1]) || (this._points.push(t), 0))
        },
        _reset: function () {
            this._points = [], this._setBrushStyles(), this._setShadow()
        },
        _captureDrawingPath: function (t) {
            var e = new fabric.Point(t.x, t.y);
            return this._addPoint(e)
        },
        _render: function () {
            var t, e, i = this.canvas.contextTop,
                r = this._points[0],
                n = this._points[1];
            if (this._saveAndTransform(i), i.beginPath(), 2 === this._points.length && r.x === n.x && r.y === n.y) {
                var s = this.width / 1e3;
                r = new fabric.Point(r.x, r.y), n = new fabric.Point(n.x, n.y), r.x -= s, n.x += s
            }
            for (i.moveTo(r.x, r.y), t = 1, e = this._points.length; t < e; t++) this._drawSegment(i, r, n), r = this._points[t], n = this._points[t + 1];
            i.lineTo(r.x, r.y), i.stroke(), i.restore()
        },
        convertPointsToSVGPath: function (t) {
            var e, i = [],
                r = this.width / 1e3,
                n = new fabric.Point(t[0].x, t[0].y),
                s = new fabric.Point(t[1].x, t[1].y),
                o = t.length,
                a = 1,
                h = 0,
                c = 2 < o;
            for (c && (a = t[2].x < s.x ? -1 : t[2].x === s.x ? 0 : 1, h = t[2].y < s.y ? -1 : t[2].y === s.y ? 0 : 1), i.push("M ", n.x - a * r, " ", n.y - h * r, " "), e = 1; e < o; e++) {
                if (!n.eq(s)) {
                    var l = n.midPointFrom(s);
                    i.push("Q ", n.x, " ", n.y, " ", l.x, " ", l.y, " ")
                }
                n = t[e], e + 1 < t.length && (s = t[e + 1])
            }
            return c && (a = n.x > t[e - 2].x ? 1 : n.x === t[e - 2].x ? 0 : -1, h = n.y > t[e - 2].y ? 1 : n.y === t[e - 2].y ? 0 : -1), i.push("L ", n.x + a * r, " ", n.y + h * r), i
        },
        createPath: function (t) {
            var e = new fabric.Path(t, {
                fill: null,
                stroke: this.color,
                strokeWidth: this.width,
                strokeLineCap: this.strokeLineCap,
                strokeMiterLimit: this.strokeMiterLimit,
                strokeLineJoin: this.strokeLineJoin,
                strokeDashArray: this.strokeDashArray
            });
            return this.shadow && (this.shadow.affectStroke = !0, e.setShadow(this.shadow)), e
        },
        decimatePoints: function (t, e) {
            if (t.length <= 2) return t;
            var i, r = this.canvas.getZoom(),
                n = Math.pow(e / r, 2),
                s = t.length - 1,
                o = t[0],
                a = [o];
            for (i = 1; i < s; i++) n <= Math.pow(o.x - t[i].x, 2) + Math.pow(o.y - t[i].y, 2) && (o = t[i], a.push(o));
            return 1 === a.length && a.push(new fabric.Point(a[0].x, a[0].y)), a
        },
        _finalizeAndAddPath: function () {
            this.canvas.contextTop.closePath(), this.decimate && (this._points = this.decimatePoints(this._points, this.decimate));
            var t = this.convertPointsToSVGPath(this._points).join("");
            if ("M 0 0 Q 0 0 0 0 L 0 0" !== t) {
                var e = this.createPath(t);
                this.canvas.clearContext(this.canvas.contextTop), this.canvas.add(e), this.canvas.requestRenderAll(), e.setCoords(), this._resetShadow(), this.canvas.fire("path:created", {
                    path: e
                })
            } else this.canvas.requestRenderAll()
        }
    }), fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        initialize: function (t) {
            this.canvas = t, this.points = []
        },
        drawDot: function (t) {
            var e = this.addPoint(t),
                i = this.canvas.contextTop;
            this._saveAndTransform(i), this.dot(i, e), i.restore()
        },
        dot: function (t, e) {
            t.fillStyle = e.fill, t.beginPath(), t.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1), t.closePath(), t.fill()
        },
        onMouseDown: function (t) {
            this.points.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(t)
        },
        _render: function () {
            var t, e, i = this.canvas.contextTop,
                r = this.points;
            for (this._saveAndTransform(i), t = 0, e = r.length; t < e; t++) this.dot(i, r[t]);
            i.restore()
        },
        onMouseMove: function (t) {
            this.needsFullRender() ? (this.canvas.clearContext(this.canvas.contextTop), this.addPoint(t), this._render()) : this.drawDot(t)
        },
        onMouseUp: function () {
            var t, e, i = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            var r = [];
            for (t = 0, e = this.points.length; t < e; t++) {
                var n = this.points[t],
                    s = new fabric.Circle({
                        radius: n.radius,
                        left: n.x,
                        top: n.y,
                        originX: "center",
                        originY: "center",
                        fill: n.fill
                    });
                this.shadow && s.setShadow(this.shadow), r.push(s)
            }
            var o = new fabric.Group(r);
            o.canvas = this.canvas, this.canvas.add(o), this.canvas.fire("path:created", {
                path: o
            }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = i, this.canvas.requestRenderAll()
        },
        addPoint: function (t) {
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
        initialize: function (t) {
            this.canvas = t, this.sprayChunks = []
        },
        onMouseDown: function (t) {
            this.sprayChunks.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(t), this.render(this.sprayChunkPoints)
        },
        onMouseMove: function (t) {
            this.addSprayChunk(t), this.render(this.sprayChunkPoints)
        },
        onMouseUp: function () {
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
                    e.push(a)
                }
            this.optimizeOverlapping && (e = this._getOptimizedRects(e));
            var h = new fabric.Group(e);
            this.shadow && h.setShadow(this.shadow), this.canvas.add(h), this.canvas.fire("path:created", {
                path: h
            }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.requestRenderAll()
        },
        _getOptimizedRects: function (t) {
            var e, i, r, n = {};
            for (i = 0, r = t.length; i < r; i++) n[e = t[i].left + "" + t[i].top] || (n[e] = t[i]);
            var s = [];
            for (e in n) s.push(n[e]);
            return s
        },
        render: function (t) {
            var e, i, r = this.canvas.contextTop;
            for (r.fillStyle = this.color, this._saveAndTransform(r), e = 0, i = t.length; e < i; e++) {
                var n = t[e];
                void 0 !== n.opacity && (r.globalAlpha = n.opacity), r.fillRect(n.x, n.y, n.width, n.width)
            }
            r.restore()
        },
        _render: function () {
            var t, e, i = this.canvas.contextTop;
            for (i.fillStyle = this.color, this._saveAndTransform(i), t = 0, e = this.sprayChunks.length; t < e; t++) this.render(this.sprayChunks[t]);
            i.restore()
        },
        addSprayChunk: function (t) {
            this.sprayChunkPoints = [];
            var e, i, r, n, s = this.width / 2;
            for (n = 0; n < this.density; n++) {
                e = fabric.util.getRandomInt(t.x - s, t.x + s), i = fabric.util.getRandomInt(t.y - s, t.y + s), r = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth;
                var o = new fabric.Point(e, i);
                o.width = r, this.randomOpacity && (o.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(o)
            }
            this.sprayChunks.push(this.sprayChunkPoints)
        }
    }), fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
        getPatternSrc: function () {
            var t = fabric.util.createCanvasElement(),
                e = t.getContext("2d");
            return t.width = t.height = 25, e.fillStyle = this.color, e.beginPath(), e.arc(10, 10, 10, 0, 2 * Math.PI, !1), e.closePath(), e.fill(), t
        },
        getPatternSrcFunction: function () {
            return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
        },
        getPattern: function () {
            return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
        },
        _setBrushStyles: function () {
            this.callSuper("_setBrushStyles"), this.canvas.contextTop.strokeStyle = this.getPattern()
        },
        createPath: function (t) {
            var e = this.callSuper("createPath", t),
                i = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2);
            return e.stroke = new fabric.Pattern({
                source: this.source || this.getPatternSrcFunction(),
                offsetX: -i.x,
                offsetY: -i.y
            }), e
        }
    }),
    function () {
        var c = fabric.util.getPointer,
            a = fabric.util.degreesToRadians,
            d = fabric.util.radiansToDegrees,
            g = Math.atan2,
            h = Math.abs,
            l = fabric.StaticCanvas.supports("setLineDash");
        for (var t in fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
                initialize: function (t, e) {
                    e || (e = {}), this.renderAndResetBound = this.renderAndReset.bind(this), this.requestRenderAllBound = this.requestRenderAll.bind(this), this._initStatic(t, e), this._initInteractive(), this._createCacheCanvas()
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
                altSelectionKey: null,
                selectionColor: "rgba(100, 100, 255, 0.3)",
                selectionDashArray: [],
                selectionBorderColor: "rgba(255, 255, 255, 0.3)",
                selectionLineWidth: 1,
                selectionFullyContained: !1,
                hoverCursor: "move",
                moveCursor: "move",
                defaultCursor: "default",
                freeDrawingCursor: "crosshair",
                rotationCursor: "crosshair",
                notAllowedCursor: "not-allowed",
                containerClass: "canvas-container",
                perPixelTargetFind: !1,
                targetFindTolerance: 0,
                skipTargetFind: !1,
                isDrawingMode: !1,
                preserveObjectStacking: !1,
                snapAngle: 0,
                snapThreshold: null,
                stopContextMenu: !1,
                fireRightClick: !1,
                fireMiddleClick: !1,
                targets: [],
                _hoveredTarget: null,
                _hoveredTargets: [],
                _initInteractive: function () {
                    this._currentTransform = null, this._groupSelector = null, this._initWrapperElement(), this._createUpperCanvas(), this._initEventListeners(), this._initRetinaScaling(), this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this), this.calcOffset()
                },
                _chooseObjectsToRender: function () {
                    var t, e, i, r = this.getActiveObjects();
                    if (0 < r.length && !this.preserveObjectStacking) {
                        e = [], i = [];
                        for (var n = 0, s = this._objects.length; n < s; n++) t = this._objects[n], -1 === r.indexOf(t) ? e.push(t) : i.push(t);
                        1 < r.length && (this._activeObject._objects = i), e.push.apply(e, i)
                    } else e = this._objects;
                    return e
                },
                renderAll: function () {
                    !this.contextTopDirty || this._groupSelector || this.isDrawingMode || (this.clearContext(this.contextTop), this.contextTopDirty = !1), this.hasLostContext && this.renderTopLayer(this.contextTop);
                    var t = this.contextContainer;
                    return this.renderCanvas(t, this._chooseObjectsToRender()), this
                },
                renderTopLayer: function (t) {
                    t.save(), this.isDrawingMode && this._isCurrentlyDrawing && (this.freeDrawingBrush && this.freeDrawingBrush._render(), this.contextTopDirty = !0), this.selection && this._groupSelector && (this._drawSelection(t), this.contextTopDirty = !0), t.restore()
                },
                renderTop: function () {
                    var t = this.contextTop;
                    return this.clearContext(t), this.renderTopLayer(t), this.fire("after:render"), this
                },
                _resetCurrentTransform: function () {
                    var t = this._currentTransform;
                    t.target.set({
                        scaleX: t.original.scaleX,
                        scaleY: t.original.scaleY,
                        skewX: t.original.skewX,
                        skewY: t.original.skewY,
                        left: t.original.left,
                        top: t.original.top
                    }), this._shouldCenterTransform(t.target) ? ("center" !== t.originX && ("right" === t.originX ? t.mouseXSign = -1 : t.mouseXSign = 1), "center" !== t.originY && ("bottom" === t.originY ? t.mouseYSign = -1 : t.mouseYSign = 1), t.originX = "center", t.originY = "center") : (t.originX = t.original.originX, t.originY = t.original.originY)
                },
                containsPoint: function (t, e, i) {
                    var r, n = i || this.getPointer(t, !0);
                    return r = e.group && e.group === this._activeObject && "activeSelection" === e.group.type ? this._normalizePointer(e.group, n) : {
                        x: n.x,
                        y: n.y
                    }, e.containsPoint(r) || e._findTargetCorner(n)
                },
                _normalizePointer: function (t, e) {
                    var i = t.calcTransformMatrix(),
                        r = fabric.util.invertTransform(i),
                        n = this.restorePointerVpt(e);
                    return fabric.util.transformPoint(n, r)
                },
                isTargetTransparent: function (t, e, i) {
                    if (t.shouldCache() && t._cacheCanvas && t !== this._activeObject) {
                        var r = this._normalizePointer(t, {
                                x: e,
                                y: i
                            }),
                            n = Math.max(t.cacheTranslationX + r.x * t.zoomX, 0),
                            s = Math.max(t.cacheTranslationY + r.y * t.zoomY, 0);
                        return fabric.util.isTransparent(t._cacheContext, Math.round(n), Math.round(s), this.targetFindTolerance)
                    }
                    var o = this.contextCache,
                        a = t.selectionBackgroundColor,
                        h = this.viewportTransform;
                    return t.selectionBackgroundColor = "", this.clearContext(o), o.save(), o.transform(h[0], h[1], h[2], h[3], h[4], h[5]), t.render(o), o.restore(), t === this._activeObject && t._renderControls(o, {
                        hasBorders: !1,
                        transparentCorners: !1
                    }, {
                        hasBorders: !1
                    }), t.selectionBackgroundColor = a, fabric.util.isTransparent(o, e, i, this.targetFindTolerance)
                },
                _isSelectionKeyPressed: function (e) {
                    return "[object Array]" === Object.prototype.toString.call(this.selectionKey) ? !!this.selectionKey.find(function (t) {
                        return !0 === e[t]
                    }) : e[this.selectionKey]
                },
                _shouldClearSelection: function (t, e) {
                    var i = this.getActiveObjects(),
                        r = this._activeObject;
                    return !e || e && r && 1 < i.length && -1 === i.indexOf(e) && r !== e && !this._isSelectionKeyPressed(t) || e && !e.evented || e && !e.selectable && r && r !== e
                },
                _shouldCenterTransform: function (t) {
                    if (t) {
                        var e, i = this._currentTransform;
                        return "scale" === i.action || "scaleX" === i.action || "scaleY" === i.action ? e = this.centeredScaling || t.centeredScaling : "rotate" === i.action && (e = this.centeredRotation || t.centeredRotation), e ? !i.altKey : i.altKey
                    }
                },
                _getOriginFromCorner: function (t, e) {
                    var i = {
                        x: t.originX,
                        y: t.originY
                    };
                    return "ml" === e || "tl" === e || "bl" === e ? i.x = "right" : "mr" !== e && "tr" !== e && "br" !== e || (i.x = "left"), "tl" === e || "mt" === e || "tr" === e ? i.y = "bottom" : "bl" !== e && "mb" !== e && "br" !== e || (i.y = "top"), i
                },
                _getActionFromCorner: function (t, e, i) {
                    if (!e || !t) return "drag";
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
                _setupCurrentTransform: function (t, e, i) {
                    if (e) {
                        var r = this.getPointer(t),
                            n = e._findTargetCorner(this.getPointer(t, !0)),
                            s = this._getActionFromCorner(i, n, t, e),
                            o = this._getOriginFromCorner(e, n);
                        this._currentTransform = {
                            target: e,
                            action: s,
                            corner: n,
                            scaleX: e.scaleX,
                            scaleY: e.scaleY,
                            skewX: e.skewX,
                            skewY: e.skewY,
                            offsetX: r.x - e.left,
                            offsetY: r.y - e.top,
                            originX: o.x,
                            originY: o.y,
                            ex: r.x,
                            ey: r.y,
                            lastX: r.x,
                            lastY: r.y,
                            theta: a(e.angle),
                            width: e.width * e.scaleX,
                            mouseXSign: 1,
                            mouseYSign: 1,
                            shiftKey: t.shiftKey,
                            altKey: t[this.centeredKey],
                            original: fabric.util.saveObjectTransform(e)
                        }, this._currentTransform.original.originX = o.x, this._currentTransform.original.originY = o.y, this._resetCurrentTransform(), this._beforeTransform(t)
                    }
                },
                _translateObject: function (t, e) {
                    var i = this._currentTransform,
                        r = i.target,
                        n = t - i.offsetX,
                        s = e - i.offsetY,
                        o = !r.get("lockMovementX") && r.left !== n,
                        a = !r.get("lockMovementY") && r.top !== s;
                    return o && r.set("left", n), a && r.set("top", s), o || a
                },
                _changeSkewTransformOrigin: function (t, e, i) {
                    var r = "originX",
                        n = {
                            0: "center"
                        },
                        s = e.target.skewX,
                        o = "left",
                        a = "right",
                        h = "mt" === e.corner || "ml" === e.corner ? 1 : -1,
                        c = 1;
                    t = 0 < t ? 1 : -1, "y" === i && (s = e.target.skewY, o = "top", a = "bottom", r = "originY"), n[-1] = o, n[1] = a, e.target.flipX && (c *= -1), e.target.flipY && (c *= -1), 0 === s ? (e.skewSign = -h * t * c, e[r] = n[-t]) : (s = 0 < s ? 1 : -1, e.skewSign = s, e[r] = n[s * h * c])
                },
                _skewObject: function (t, e, i) {
                    var r, n = this._currentTransform,
                        s = n.target,
                        o = s.get("lockSkewingX"),
                        a = s.get("lockSkewingY");
                    if (o && "x" === i || a && "y" === i) return !1;
                    var h, c, l = s.getCenterPoint(),
                        u = s.toLocalPoint(new fabric.Point(t, e), "center", "center")[i],
                        f = s.toLocalPoint(new fabric.Point(n.lastX, n.lastY), "center", "center")[i],
                        d = s._getTransformedDimensions();
                    return this._changeSkewTransformOrigin(u - f, n, i), h = s.toLocalPoint(new fabric.Point(t, e), n.originX, n.originY)[i], c = s.translateToOriginPoint(l, n.originX, n.originY), r = this._setObjectSkew(h, n, i, d), n.lastX = t, n.lastY = e, s.setPositionByOrigin(c, n.originX, n.originY), r
                },
                _setObjectSkew: function (t, e, i, r) {
                    var n, s, o, a, h, c, l, u, f, d, g = e.target,
                        p = e.skewSign;
                    return "x" === i ? (h = "y", c = "Y", l = "X", f = 0, d = g.skewY) : (h = "x", c = "X", l = "Y", f = g.skewX, d = 0), a = g._getTransformedDimensions(f, d), (u = 2 * Math.abs(t) - a[i]) <= 2 ? n = 0 : (n = p * Math.atan(u / g["scale" + l] / (a[h] / g["scale" + c])), n = fabric.util.radiansToDegrees(n)), s = g["skew" + l] !== n, g.set("skew" + l, n), 0 !== g["skew" + c] && (o = g._getTransformedDimensions(), n = r[h] / o[h] * g["scale" + c], g.set("scale" + c, n)), s
                },
                _scaleObject: function (t, e, i) {
                    var r = this._currentTransform,
                        n = r.target,
                        s = n.lockScalingX,
                        o = n.lockScalingY,
                        a = n.lockScalingFlip;
                    if (s && o) return !1;
                    var h, c = n.translateToOriginPoint(n.getCenterPoint(), r.originX, r.originY),
                        l = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY),
                        u = n._getTransformedDimensions();
                    return this._setLocalMouse(l, r), h = this._setObjectScale(l, r, s, o, i, a, u), n.setPositionByOrigin(c, r.originX, r.originY), h
                },
                _setObjectScale: function (t, e, i, r, n, s, o) {
                    var a = e.target,
                        h = !1,
                        c = !1,
                        l = !1,
                        u = t.x * a.scaleX / o.x,
                        f = t.y * a.scaleY / o.y,
                        d = a.scaleX !== u,
                        g = a.scaleY !== f;
                    if (e.newScaleX = u, e.newScaleY = f, fabric.Textbox && "x" === n && a instanceof fabric.Textbox) {
                        var p = a.width * (t.x / o.x);
                        return p >= a.getMinWidth() && (l = p !== a.width, a.set("width", p), l)
                    }
                    return s && u <= 0 && u < a.scaleX && (h = !0, t.x = 0), s && f <= 0 && f < a.scaleY && (c = !0, t.y = 0), "equally" !== n || i || r ? n ? "x" !== n || a.get("lockUniScaling") ? "y" !== n || a.get("lockUniScaling") || c || r || a.set("scaleY", f) && (l = g) : h || i || a.set("scaleX", u) && (l = d) : (h || i || a.set("scaleX", u) && (l = l || d), c || r || a.set("scaleY", f) && (l = l || g)) : l = this._scaleObjectEqually(t, a, e, o), h || c || this._flipObject(e, n), l
                },
                _scaleObjectEqually: function (t, e, i, r) {
                    var n, s, o, a = t.y + t.x,
                        h = r.y * i.original.scaleY / e.scaleY + r.x * i.original.scaleX / e.scaleX,
                        c = t.x < 0 ? -1 : 1,
                        l = t.y < 0 ? -1 : 1;
                    return s = c * Math.abs(i.original.scaleX * a / h), o = l * Math.abs(i.original.scaleY * a / h), n = s !== e.scaleX || o !== e.scaleY, e.set("scaleX", s), e.set("scaleY", o), n
                },
                _flipObject: function (t, e) {
                    t.newScaleX < 0 && "y" !== e && ("left" === t.originX ? t.originX = "right" : "right" === t.originX && (t.originX = "left")), t.newScaleY < 0 && "x" !== e && ("top" === t.originY ? t.originY = "bottom" : "bottom" === t.originY && (t.originY = "top"))
                },
                _setLocalMouse: function (t, e) {
                    var i = e.target,
                        r = this.getZoom(),
                        n = i.padding / r;
                    "right" === e.originX ? t.x *= -1 : "center" === e.originX && (t.x *= 2 * e.mouseXSign, t.x < 0 && (e.mouseXSign = -e.mouseXSign)), "bottom" === e.originY ? t.y *= -1 : "center" === e.originY && (t.y *= 2 * e.mouseYSign, t.y < 0 && (e.mouseYSign = -e.mouseYSign)), h(t.x) > n ? t.x < 0 ? t.x += n : t.x -= n : t.x = 0, h(t.y) > n ? t.y < 0 ? t.y += n : t.y -= n : t.y = 0
                },
                _rotateObject: function (t, e) {
                    var i = this._currentTransform,
                        r = i.target,
                        n = r.translateToOriginPoint(r.getCenterPoint(), i.originX, i.originY);
                    if (r.lockRotation) return !1;
                    var s = g(i.ey - n.y, i.ex - n.x),
                        o = g(e - n.y, t - n.x),
                        a = d(o - s + i.theta),
                        h = !0;
                    if (0 < r.snapAngle) {
                        var c = r.snapAngle,
                            l = r.snapThreshold || c,
                            u = Math.ceil(a / c) * c,
                            f = Math.floor(a / c) * c;
                        Math.abs(a - f) < l ? a = f : Math.abs(a - u) < l && (a = u)
                    }
                    return a < 0 && (a = 360 + a), a %= 360, r.angle === a ? h = !1 : (r.angle = a, r.setPositionByOrigin(n, i.originX, i.originY)), h
                },
                setCursor: function (t) {
                    this.upperCanvasEl.style.cursor = t
                },
                _drawSelection: function (t) {
                    var e = this._groupSelector,
                        i = e.left,
                        r = e.top,
                        n = h(i),
                        s = h(r);
                    if (this.selectionColor && (t.fillStyle = this.selectionColor, t.fillRect(e.ex - (0 < i ? 0 : -i), e.ey - (0 < r ? 0 : -r), n, s)), this.selectionLineWidth && this.selectionBorderColor)
                        if (t.lineWidth = this.selectionLineWidth, t.strokeStyle = this.selectionBorderColor, 1 < this.selectionDashArray.length && !l) {
                            var o = e.ex + .5 - (0 < i ? 0 : n),
                                a = e.ey + .5 - (0 < r ? 0 : s);
                            t.beginPath(), fabric.util.drawDashedLine(t, o, a, o + n, a, this.selectionDashArray), fabric.util.drawDashedLine(t, o, a + s - 1, o + n, a + s - 1, this.selectionDashArray), fabric.util.drawDashedLine(t, o, a, o, a + s, this.selectionDashArray), fabric.util.drawDashedLine(t, o + n - 1, a, o + n - 1, a + s, this.selectionDashArray), t.closePath(), t.stroke()
                        } else fabric.Object.prototype._setLineDash.call(this, t, this.selectionDashArray), t.strokeRect(e.ex + .5 - (0 < i ? 0 : n), e.ey + .5 - (0 < r ? 0 : s), n, s)
                },
                findTarget: function (t, e) {
                    if (!this.skipTargetFind) {
                        var i, r, n = this.getPointer(t, !0),
                            s = this._activeObject,
                            o = this.getActiveObjects();
                        if (this.targets = [], 1 < o.length && !e && s === this._searchPossibleTargets([s], n)) return s;
                        if (1 === o.length && s._findTargetCorner(n)) return s;
                        if (1 === o.length && s === this._searchPossibleTargets([s], n)) {
                            if (!this.preserveObjectStacking) return s;
                            i = s, r = this.targets, this.targets = []
                        }
                        var a = this._searchPossibleTargets(this._objects, n);
                        return t[this.altSelectionKey] && a && i && a !== i && (a = i, this.targets = r), a
                    }
                },
                _checkTarget: function (t, e, i) {
                    if (e && e.visible && e.evented && this.containsPoint(null, e, t)) {
                        if (!this.perPixelTargetFind && !e.perPixelTargetFind || e.isEditing) return !0;
                        if (!this.isTargetTransparent(e, i.x, i.y)) return !0
                    }
                },
                _searchPossibleTargets: function (t, e) {
                    for (var i, r, n = t.length; n--;) {
                        var s = t[n],
                            o = s.group && "activeSelection" !== s.group.type ? this._normalizePointer(s.group, e) : e;
                        if (this._checkTarget(o, s, e)) {
                            (i = t[n]).subTargetCheck && i instanceof fabric.Group && (r = this._searchPossibleTargets(i._objects, e)) && this.targets.push(r);
                            break
                        }
                    }
                    return i
                },
                restorePointerVpt: function (t) {
                    return fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform))
                },
                getPointer: function (t, e) {
                    if (this._absolutePointer && !e) return this._absolutePointer;
                    if (this._pointer && e) return this._pointer;
                    var i, r = c(t),
                        n = this.upperCanvasEl,
                        s = n.getBoundingClientRect(),
                        o = s.width || 0,
                        a = s.height || 0;
                    o && a || ("top" in s && "bottom" in s && (a = Math.abs(s.top - s.bottom)), "right" in s && "left" in s && (o = Math.abs(s.right - s.left))), this.calcOffset(), r.x = r.x - this._offset.left, r.y = r.y - this._offset.top, e || (r = this.restorePointerVpt(r));
                    var h = this.getRetinaScaling();
                    return 1 !== h && (r.x /= h, r.y /= h), i = 0 === o || 0 === a ? {
                        width: 1,
                        height: 1
                    } : {
                        width: n.width / o,
                        height: n.height / a
                    }, {
                        x: r.x * i.width,
                        y: r.y * i.height
                    }
                },
                _createUpperCanvas: function () {
                    var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, ""),
                        e = this.lowerCanvasEl,
                        i = this.upperCanvasEl;
                    i ? i.className = "" : (i = this._createCanvasElement(), this.upperCanvasEl = i), fabric.util.addClass(i, "upper-canvas " + t), this.wrapperEl.appendChild(i), this._copyCanvasStyle(e, i), this._applyCanvasStyle(i), this.contextTop = i.getContext("2d")
                },
                _createCacheCanvas: function () {
                    this.cacheCanvasEl = this._createCanvasElement(), this.cacheCanvasEl.setAttribute("width", this.width), this.cacheCanvasEl.setAttribute("height", this.height), this.contextCache = this.cacheCanvasEl.getContext("2d")
                },
                _initWrapperElement: function () {
                    this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                        class: this.containerClass
                    }), fabric.util.setStyle(this.wrapperEl, {
                        width: this.width + "px",
                        height: this.height + "px",
                        position: "relative"
                    }), fabric.util.makeElementUnselectable(this.wrapperEl)
                },
                _applyCanvasStyle: function (t) {
                    var e = this.width || t.width,
                        i = this.height || t.height;
                    fabric.util.setStyle(t, {
                        position: "absolute",
                        width: e + "px",
                        height: i + "px",
                        left: 0,
                        top: 0,
                        "touch-action": this.allowTouchScrolling ? "manipulation" : "none",
                        "-ms-touch-action": this.allowTouchScrolling ? "manipulation" : "none"
                    }), t.width = e, t.height = i, fabric.util.makeElementUnselectable(t)
                },
                _copyCanvasStyle: function (t, e) {
                    e.style.cssText = t.style.cssText
                },
                getSelectionContext: function () {
                    return this.contextTop
                },
                getSelectionElement: function () {
                    return this.upperCanvasEl
                },
                getActiveObject: function () {
                    return this._activeObject
                },
                getActiveObjects: function () {
                    var t = this._activeObject;
                    return t ? "activeSelection" === t.type && t._objects ? t._objects.slice(0) : [t] : []
                },
                _onObjectRemoved: function (t) {
                    t === this._activeObject && (this.fire("before:selection:cleared", {
                        target: t
                    }), this._discardActiveObject(), this.fire("selection:cleared", {
                        target: t
                    }), t.fire("deselected")), t === this._hoveredTarget && (this._hoveredTarget = null, this._hoveredTargets = []), this.callSuper("_onObjectRemoved", t)
                },
                _fireSelectionEvents: function (e, t) {
                    var i = !1,
                        r = this.getActiveObjects(),
                        n = [],
                        s = [],
                        o = {
                            e: t
                        };
                    e.forEach(function (t) {
                        -1 === r.indexOf(t) && (i = !0, t.fire("deselected", o), s.push(t))
                    }), r.forEach(function (t) {
                        -1 === e.indexOf(t) && (i = !0, t.fire("selected", o), n.push(t))
                    }), 0 < e.length && 0 < r.length ? (o.selected = n, o.deselected = s, o.updated = n[0] || s[0], o.target = this._activeObject, i && this.fire("selection:updated", o)) : 0 < r.length ? (1 === r.length && (o.target = n[0], this.fire("object:selected", o)), o.selected = n, o.target = this._activeObject, this.fire("selection:created", o)) : 0 < e.length && (o.deselected = s, this.fire("selection:cleared", o))
                },
                setActiveObject: function (t, e) {
                    var i = this.getActiveObjects();
                    return this._setActiveObject(t, e), this._fireSelectionEvents(i, e), this
                },
                _setActiveObject: function (t, e) {
                    return this._activeObject !== t && (!!this._discardActiveObject(e, t) && (!t.onSelect({
                        e: e
                    }) && (this._activeObject = t, !0)))
                },
                _discardActiveObject: function (t, e) {
                    var i = this._activeObject;
                    if (i) {
                        if (i.onDeselect({
                                e: t,
                                object: e
                            })) return !1;
                        this._activeObject = null
                    }
                    return !0
                },
                discardActiveObject: function (t) {
                    var e = this.getActiveObjects(),
                        i = this.getActiveObject();
                    return e.length && this.fire("before:selection:cleared", {
                        target: i,
                        e: t
                    }), this._discardActiveObject(t), this._fireSelectionEvents(e, t), this
                },
                dispose: function () {
                    var t = this.wrapperEl;
                    return this.removeListeners(), t.removeChild(this.upperCanvasEl), t.removeChild(this.lowerCanvasEl), this.contextCache = null, this.contextTop = null, ["upperCanvasEl", "cacheCanvasEl"].forEach(function (t) {
                        fabric.util.cleanUpJsdomNode(this[t]), this[t] = void 0
                    }.bind(this)), t.parentNode && t.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl), delete this.wrapperEl, fabric.StaticCanvas.prototype.dispose.call(this), this
                },
                clear: function () {
                    return this.discardActiveObject(), this.clearContext(this.contextTop), this.callSuper("clear")
                },
                drawControls: function (t) {
                    var e = this._activeObject;
                    e && e._renderControls(t)
                },
                _toObject: function (t, e, i) {
                    var r = this._realizeGroupTransformOnObject(t),
                        n = this.callSuper("_toObject", t, e, i);
                    return this._unwindGroupTransformOnObject(t, r), n
                },
                _realizeGroupTransformOnObject: function (e) {
                    if (e.group && "activeSelection" === e.group.type && this._activeObject === e.group) {
                        var i = {};
                        return ["angle", "flipX", "flipY", "left", "scaleX", "scaleY", "skewX", "skewY", "top"].forEach(function (t) {
                            i[t] = e[t]
                        }), this._activeObject.realizeTransform(e), i
                    }
                    return null
                },
                _unwindGroupTransformOnObject: function (t, e) {
                    e && t.set(e)
                },
                _setSVGObject: function (t, e, i) {
                    var r = this._realizeGroupTransformOnObject(e);
                    this.callSuper("_setSVGObject", t, e, i), this._unwindGroupTransformOnObject(e, r)
                },
                setViewportTransform: function (t) {
                    this.renderOnAddRemove && this._activeObject && this._activeObject.isEditing && this._activeObject.clearContextTop(), fabric.StaticCanvas.prototype.setViewportTransform.call(this, t)
                }
            }), fabric.StaticCanvas) "prototype" !== t && (fabric.Canvas[t] = fabric.StaticCanvas[t])
    }(),
    function () {
        var n = {
                mt: 0,
                tr: 1,
                mr: 2,
                br: 3,
                mb: 4,
                bl: 5,
                ml: 6,
                tl: 7
            },
            r = fabric.util.addListener,
            s = fabric.util.removeListener,
            o = {
                passive: !1
            };

        function a(t, e) {
            return t.button && t.button === e - 1
        }
        fabric.util.object.extend(fabric.Canvas.prototype, {
            cursorMap: ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"],
            mainTouchId: null,
            _initEventListeners: function () {
                this.removeListeners(), this._bindEvents(), this.addOrRemove(r, "add")
            },
            _getEventPrefix: function () {
                return this.enablePointerEvents ? "pointer" : "mouse"
            },
            addOrRemove: function (t, e) {
                var i = this.upperCanvasEl,
                    r = this._getEventPrefix();
                t(fabric.window, "resize", this._onResize), t(i, r + "down", this._onMouseDown), t(i, r + "move", this._onMouseMove, o), t(i, r + "out", this._onMouseOut), t(i, r + "enter", this._onMouseEnter), t(i, "wheel", this._onMouseWheel), t(i, "contextmenu", this._onContextMenu), t(i, "dblclick", this._onDoubleClick), t(i, "dragover", this._onDragOver), t(i, "dragenter", this._onDragEnter), t(i, "dragleave", this._onDragLeave), t(i, "drop", this._onDrop), this.enablePointerEvents || t(i, "touchstart", this._onTouchStart, o), "undefined" != typeof eventjs && e in eventjs && (eventjs[e](i, "gesture", this._onGesture), eventjs[e](i, "drag", this._onDrag), eventjs[e](i, "orientation", this._onOrientationChange), eventjs[e](i, "shake", this._onShake), eventjs[e](i, "longpress", this._onLongPress))
            },
            removeListeners: function () {
                this.addOrRemove(s, "remove");
                var t = this._getEventPrefix();
                s(fabric.document, t + "up", this._onMouseUp), s(fabric.document, "touchend", this._onTouchEnd, o), s(fabric.document, t + "move", this._onMouseMove, o), s(fabric.document, "touchmove", this._onMouseMove, o)
            },
            _bindEvents: function () {
                this.eventsBound || (this._onMouseDown = this._onMouseDown.bind(this), this._onTouchStart = this._onTouchStart.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onTouchEnd = this._onTouchEnd.bind(this), this._onResize = this._onResize.bind(this), this._onGesture = this._onGesture.bind(this), this._onDrag = this._onDrag.bind(this), this._onShake = this._onShake.bind(this), this._onLongPress = this._onLongPress.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onMouseWheel = this._onMouseWheel.bind(this), this._onMouseOut = this._onMouseOut.bind(this), this._onMouseEnter = this._onMouseEnter.bind(this), this._onContextMenu = this._onContextMenu.bind(this), this._onDoubleClick = this._onDoubleClick.bind(this), this._onDragOver = this._onDragOver.bind(this), this._onDragEnter = this._simpleEventHandler.bind(this, "dragenter"), this._onDragLeave = this._simpleEventHandler.bind(this, "dragleave"), this._onDrop = this._simpleEventHandler.bind(this, "drop"), this.eventsBound = !0)
            },
            _onGesture: function (t, e) {
                this.__onTransformGesture && this.__onTransformGesture(t, e)
            },
            _onDrag: function (t, e) {
                this.__onDrag && this.__onDrag(t, e)
            },
            _onMouseWheel: function (t) {
                this.__onMouseWheel(t)
            },
            _onMouseOut: function (e) {
                var i = this._hoveredTarget;
                this.fire("mouse:out", {
                    target: i,
                    e: e
                }), this._hoveredTarget = null, i && i.fire("mouseout", {
                    e: e
                });
                var r = this;
                this._hoveredTargets.forEach(function (t) {
                    r.fire("mouse:out", {
                        target: i,
                        e: e
                    }), t && i.fire("mouseout", {
                        e: e
                    })
                }), this._hoveredTargets = [], this._iTextInstances && this._iTextInstances.forEach(function (t) {
                    t.isEditing && t.hiddenTextarea.focus()
                })
            },
            _onMouseEnter: function (t) {
                this.currentTransform || this.findTarget(t) || (this.fire("mouse:over", {
                    target: null,
                    e: t
                }), this._hoveredTarget = null, this._hoveredTargets = [])
            },
            _onOrientationChange: function (t, e) {
                this.__onOrientationChange && this.__onOrientationChange(t, e)
            },
            _onShake: function (t, e) {
                this.__onShake && this.__onShake(t, e)
            },
            _onLongPress: function (t, e) {
                this.__onLongPress && this.__onLongPress(t, e)
            },
            _onDragOver: function (t) {
                t.preventDefault();
                var e = this._simpleEventHandler("dragover", t);
                this._fireEnterLeaveEvents(e, t)
            },
            _onContextMenu: function (t) {
                return this.stopContextMenu && (t.stopPropagation(), t.preventDefault()), !1
            },
            _onDoubleClick: function (t) {
                this._cacheTransformEventData(t), this._handleEvent(t, "dblclick"), this._resetTransformEventData(t)
            },
            getPointerId: function (t) {
                var e = t.changedTouches;
                return e ? e[0] && e[0].identifier : this.enablePointerEvents ? t.pointerId : -1
            },
            _isMainEvent: function (t) {
                return !0 === t.isPrimary || !1 !== t.isPrimary && ("touchend" === t.type && 0 === t.touches.length || (!t.changedTouches || t.changedTouches[0].identifier === this.mainTouchId))
            },
            _onTouchStart: function (t) {
                t.preventDefault(), null === this.mainTouchId && (this.mainTouchId = this.getPointerId(t)), this.__onMouseDown(t), this._resetTransformEventData();
                var e = this.upperCanvasEl,
                    i = this._getEventPrefix();
                r(fabric.document, "touchend", this._onTouchEnd, o), r(fabric.document, "touchmove", this._onMouseMove, o), s(e, i + "down", this._onMouseDown)
            },
            _onMouseDown: function (t) {
                this.__onMouseDown(t), this._resetTransformEventData();
                var e = this.upperCanvasEl,
                    i = this._getEventPrefix();
                s(e, i + "move", this._onMouseMove, o), r(fabric.document, i + "up", this._onMouseUp), r(fabric.document, i + "move", this._onMouseMove, o)
            },
            _onTouchEnd: function (t) {
                if (!(0 < t.touches.length)) {
                    this.__onMouseUp(t), this._resetTransformEventData(), this.mainTouchId = null;
                    var e = this._getEventPrefix();
                    s(fabric.document, "touchend", this._onTouchEnd, o), s(fabric.document, "touchmove", this._onMouseMove, o);
                    var i = this;
                    this._willAddMouseDown && clearTimeout(this._willAddMouseDown), this._willAddMouseDown = setTimeout(function () {
                        r(i.upperCanvasEl, e + "down", i._onMouseDown), i._willAddMouseDown = 0
                    }, 400)
                }
            },
            _onMouseUp: function (t) {
                this.__onMouseUp(t), this._resetTransformEventData();
                var e = this.upperCanvasEl,
                    i = this._getEventPrefix();
                this._isMainEvent(t) && (s(fabric.document, i + "up", this._onMouseUp), s(fabric.document, i + "move", this._onMouseMove, o), r(e, i + "move", this._onMouseMove, o))
            },
            _onMouseMove: function (t) {
                !this.allowTouchScrolling && t.preventDefault && t.preventDefault(), this.__onMouseMove(t)
            },
            _onResize: function () {
                this.calcOffset()
            },
            _shouldRender: function (t) {
                var e = this._activeObject;
                return !!(!!e != !!t || e && t && e !== t) || (e && e.isEditing, !1)
            },
            __onMouseUp: function (t) {
                var e, i = this._currentTransform,
                    r = this._groupSelector,
                    n = !1,
                    s = !r || 0 === r.left && 0 === r.top;
                if (this._cacheTransformEventData(t), e = this._target, this._handleEvent(t, "up:before"), !a(t, 3)) return a(t, 2) ? (this.fireMiddleClick && this._handleEvent(t, "up", 2, s), void this._resetTransformEventData()) : void(this.isDrawingMode && this._isCurrentlyDrawing ? this._onMouseUpInDrawingMode(t) : this._isMainEvent(t) && (i && (this._finalizeCurrentTransform(t), n = i.actionPerformed), s || (this._maybeGroupObjects(t), n || (n = this._shouldRender(e))), e && (e.isMoving = !1), this._setCursorFromEvent(t, e), this._handleEvent(t, "up", 1, s), this._groupSelector = null, this._currentTransform = null, e && (e.__corner = 0), n ? this.requestRenderAll() : s || this.renderTop()));
                this.fireRightClick && this._handleEvent(t, "up", 3, s)
            },
            _simpleEventHandler: function (t, e) {
                var i = this.findTarget(e),
                    r = this.targets,
                    n = {
                        e: e,
                        target: i,
                        subTargets: r
                    };
                if (this.fire(t, n), i && i.fire(t, n), !r) return i;
                for (var s = 0; s < r.length; s++) r[s].fire(t, n);
                return i
            },
            _handleEvent: function (t, e, i, r) {
                var n = this._target,
                    s = this.targets || [],
                    o = {
                        e: t,
                        target: n,
                        subTargets: s,
                        button: i || 1,
                        isClick: r || !1,
                        pointer: this._pointer,
                        absolutePointer: this._absolutePointer,
                        transform: this._currentTransform
                    };
                this.fire("mouse:" + e, o), n && n.fire("mouse" + e, o);
                for (var a = 0; a < s.length; a++) s[a].fire("mouse" + e, o)
            },
            _finalizeCurrentTransform: function (t) {
                var e, i = this._currentTransform,
                    r = i.target,
                    n = {
                        e: t,
                        target: r,
                        transform: i
                    };
                r._scaling && (r._scaling = !1), r.setCoords(), (i.actionPerformed || this.stateful && r.hasStateChanged()) && (i.actionPerformed && (e = this._addEventOptions(n, i), this._fire(e, n)), this._fire("modified", n))
            },
            _addEventOptions: function (t, e) {
                var i, r;
                switch (e.action) {
                    case "scaleX":
                        i = "scaled", r = "x";
                        break;
                    case "scaleY":
                        i = "scaled", r = "y";
                        break;
                    case "skewX":
                        i = "skewed", r = "x";
                        break;
                    case "skewY":
                        i = "skewed", r = "y";
                        break;
                    case "scale":
                        i = "scaled", r = "equally";
                        break;
                    case "rotate":
                        i = "rotated";
                        break;
                    case "drag":
                        i = "moved"
                }
                return t.by = r, i
            },
            _onMouseDownInDrawingMode: function (t) {
                this._isCurrentlyDrawing = !0, this.getActiveObject() && this.discardActiveObject(t).requestRenderAll(), this.clipTo && fabric.util.clipContext(this, this.contextTop);
                var e = this.getPointer(t);
                this.freeDrawingBrush.onMouseDown(e, {
                    e: t,
                    pointer: e
                }), this._handleEvent(t, "down")
            },
            _onMouseMoveInDrawingMode: function (t) {
                if (this._isCurrentlyDrawing) {
                    var e = this.getPointer(t);
                    this.freeDrawingBrush.onMouseMove(e, {
                        e: t,
                        pointer: e
                    })
                }
                this.setCursor(this.freeDrawingCursor), this._handleEvent(t, "move")
            },
            _onMouseUpInDrawingMode: function (t) {
                this.clipTo && this.contextTop.restore();
                var e = this.getPointer(t);
                this._isCurrentlyDrawing = this.freeDrawingBrush.onMouseUp({
                    e: t,
                    pointer: e
                }), this._handleEvent(t, "up")
            },
            __onMouseDown: function (t) {
                this._cacheTransformEventData(t), this._handleEvent(t, "down:before");
                var e = this._target;
                if (a(t, 3)) this.fireRightClick && this._handleEvent(t, "down", 3);
                else if (a(t, 2)) this.fireMiddleClick && this._handleEvent(t, "down", 2);
                else if (this.isDrawingMode) this._onMouseDownInDrawingMode(t);
                else if (this._isMainEvent(t) && !this._currentTransform) {
                    var i = this._pointer;
                    this._previousPointer = i;
                    var r = this._shouldRender(e),
                        n = this._shouldGroup(t, e);
                    if (this._shouldClearSelection(t, e) ? this.discardActiveObject(t) : n && (this._handleGrouping(t, e), e = this._activeObject), !this.selection || e && (e.selectable || e.isEditing || e === this._activeObject) || (this._groupSelector = {
                            ex: i.x,
                            ey: i.y,
                            top: 0,
                            left: 0
                        }), e) {
                        var s = e === this._activeObject;
                        e.selectable && this.setActiveObject(e, t), e !== this._activeObject || !e.__corner && n || this._setupCurrentTransform(t, e, s)
                    }
                    this._handleEvent(t, "down"), (r || n) && this.requestRenderAll()
                }
            },
            _resetTransformEventData: function () {
                this._target = null, this._pointer = null, this._absolutePointer = null
            },
            _cacheTransformEventData: function (t) {
                this._resetTransformEventData(), this._pointer = this.getPointer(t, !0), this._absolutePointer = this.restorePointerVpt(this._pointer), this._target = this._currentTransform ? this._currentTransform.target : this.findTarget(t) || null
            },
            _beforeTransform: function (t) {
                var e = this._currentTransform;
                this.stateful && e.target.saveState(), this.fire("before:transform", {
                    e: t,
                    transform: e
                }), e.corner && this.onBeforeScaleRotate(e.target)
            },
            __onMouseMove: function (t) {
                var e, i;
                if (this._handleEvent(t, "move:before"), this._cacheTransformEventData(t), this.isDrawingMode) this._onMouseMoveInDrawingMode(t);
                else if (this._isMainEvent(t)) {
                    var r = this._groupSelector;
                    r ? (i = this._pointer, r.left = i.x - r.ex, r.top = i.y - r.ey, this.renderTop()) : this._currentTransform ? this._transformObject(t) : (e = this.findTarget(t) || null, this._setCursorFromEvent(t, e), this._fireOverOutEvents(e, t)), this._handleEvent(t, "move"), this._resetTransformEventData()
                }
            },
            _fireOverOutEvents: function (t, e) {
                var i = this._hoveredTarget,
                    r = this._hoveredTargets,
                    n = this.targets,
                    s = Math.max(r.length, n.length);
                this.fireSyntheticInOutEvents(t, e, {
                    oldTarget: i,
                    evtOut: "mouseout",
                    canvasEvtOut: "mouse:out",
                    evtIn: "mouseover",
                    canvasEvtIn: "mouse:over"
                });
                for (var o = 0; o < s; o++) this.fireSyntheticInOutEvents(n[o], e, {
                    oldTarget: r[o],
                    evtOut: "mouseout",
                    evtIn: "mouseover"
                });
                this._hoveredTarget = t, this._hoveredTargets = this.targets.concat()
            },
            _fireEnterLeaveEvents: function (t, e) {
                var i = this._draggedoverTarget,
                    r = this._hoveredTargets,
                    n = this.targets,
                    s = Math.max(r.length, n.length);
                this.fireSyntheticInOutEvents(t, e, {
                    oldTarget: i,
                    evtOut: "dragleave",
                    evtIn: "dragenter"
                });
                for (var o = 0; o < s; o++) this.fireSyntheticInOutEvents(n[o], e, {
                    oldTarget: r[o],
                    evtOut: "dragleave",
                    evtIn: "dragenter"
                });
                this._draggedoverTarget = t
            },
            fireSyntheticInOutEvents: function (t, e, i) {
                var r, n, s, o = i.oldTarget,
                    a = o !== t,
                    h = i.canvasEvtIn,
                    c = i.canvasEvtOut;
                a && (r = {
                    e: e,
                    target: t,
                    previousTarget: o
                }, n = {
                    e: e,
                    target: o,
                    nextTarget: t
                }), s = t && a, o && a && (c && this.fire(c, n), o.fire(i.evtOut, n)), s && (h && this.fire(h, r), t.fire(i.evtIn, r))
            },
            __onMouseWheel: function (t) {
                this._cacheTransformEventData(t), this._handleEvent(t, "wheel"), this._resetTransformEventData()
            },
            _transformObject: function (t) {
                var e = this.getPointer(t),
                    i = this._currentTransform;
                i.reset = !1, i.target.isMoving = !0, i.shiftKey = t.shiftKey, i.altKey = t[this.centeredKey], this._beforeScaleTransform(t, i), this._performTransformAction(t, i, e), i.actionPerformed && this.requestRenderAll()
            },
            _performTransformAction: function (t, e, i) {
                var r = i.x,
                    n = i.y,
                    s = e.action,
                    o = !1,
                    a = {
                        target: e.target,
                        e: t,
                        transform: e,
                        pointer: i
                    };
                "rotate" === s ? (o = this._rotateObject(r, n)) && this._fire("rotating", a) : "scale" === s ? (o = this._onScale(t, e, r, n)) && this._fire("scaling", a) : "scaleX" === s ? (o = this._scaleObject(r, n, "x")) && this._fire("scaling", a) : "scaleY" === s ? (o = this._scaleObject(r, n, "y")) && this._fire("scaling", a) : "skewX" === s ? (o = this._skewObject(r, n, "x")) && this._fire("skewing", a) : "skewY" === s ? (o = this._skewObject(r, n, "y")) && this._fire("skewing", a) : (o = this._translateObject(r, n)) && (this._fire("moving", a), this.setCursor(a.target.moveCursor || this.moveCursor)), e.actionPerformed = e.actionPerformed || o
            },
            _fire: function (t, e) {
                this.fire("object:" + t, e), e.target.fire(t, e)
            },
            _beforeScaleTransform: function (t, e) {
                if ("scale" === e.action || "scaleX" === e.action || "scaleY" === e.action) {
                    var i = this._shouldCenterTransform(e.target);
                    (i && ("center" !== e.originX || "center" !== e.originY) || !i && "center" === e.originX && "center" === e.originY) && (this._resetCurrentTransform(), e.reset = !0)
                }
            },
            _onScale: function (t, e, i, r) {
                return this._isUniscalePossible(t, e.target) ? (e.currentAction = "scale", this._scaleObject(i, r)) : (e.reset || "scale" !== e.currentAction || this._resetCurrentTransform(), e.currentAction = "scaleEqually", this._scaleObject(i, r, "equally"))
            },
            _isUniscalePossible: function (t, e) {
                return (t[this.uniScaleKey] || this.uniScaleTransform) && !e.get("lockUniScaling")
            },
            _setCursorFromEvent: function (t, e) {
                if (!e) return this.setCursor(this.defaultCursor), !1;
                var i = e.hoverCursor || this.hoverCursor,
                    r = this._activeObject && "activeSelection" === this._activeObject.type ? this._activeObject : null,
                    n = (!r || !r.contains(e)) && e._findTargetCorner(this.getPointer(t, !0));
                n ? this.setCursor(this.getCornerCursor(n, e, t)) : (e.subTargetCheck && this.targets.concat().reverse().map(function (t) {
                    i = t.hoverCursor || i
                }), this.setCursor(i))
            },
            getCornerCursor: function (t, e, i) {
                return this.actionIsDisabled(t, e, i) ? this.notAllowedCursor : t in n ? this._getRotatedCornerCursor(t, e, i) : "mtr" === t && e.hasRotatingPoint ? this.rotationCursor : this.defaultCursor
            },
            actionIsDisabled: function (t, e, i) {
                return "mt" === t || "mb" === t ? i[this.altActionKey] ? e.lockSkewingX : e.lockScalingY : "ml" === t || "mr" === t ? i[this.altActionKey] ? e.lockSkewingY : e.lockScalingX : "mtr" === t ? e.lockRotation : this._isUniscalePossible(i, e) ? e.lockScalingX && e.lockScalingY : e.lockScalingX || e.lockScalingY
            },
            _getRotatedCornerCursor: function (t, e, i) {
                var r = Math.round(e.angle % 360 / 45);
                return r < 0 && (r += 8), r += n[t], i[this.altActionKey] && n[t] % 2 == 0 && (r += 2), r %= 8, this.cursorMap[r]
            }
        })
    }(),
    function () {
        var f = Math.min,
            d = Math.max;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            _shouldGroup: function (t, e) {
                var i = this._activeObject;
                return i && this._isSelectionKeyPressed(t) && e && e.selectable && this.selection && (i !== e || "activeSelection" === i.type) && !e.onSelect({
                    e: t
                })
            },
            _handleGrouping: function (t, e) {
                var i = this._activeObject;
                i.__corner || (e !== i || (e = this.findTarget(t, !0)) && e.selectable) && (i && "activeSelection" === i.type ? this._updateActiveSelection(e, t) : this._createActiveSelection(e, t))
            },
            _updateActiveSelection: function (t, e) {
                var i = this._activeObject,
                    r = i._objects.slice(0);
                i.contains(t) ? (i.removeWithUpdate(t), this._hoveredTarget = t, this._hoveredTargets = this.targets.concat(), 1 === i.size() && this._setActiveObject(i.item(0), e)) : (i.addWithUpdate(t), this._hoveredTarget = i, this._hoveredTargets = this.targets.concat()), this._fireSelectionEvents(r, e)
            },
            _createActiveSelection: function (t, e) {
                var i = this.getActiveObjects(),
                    r = this._createGroup(t);
                this._hoveredTarget = r, this._setActiveObject(r, e), this._fireSelectionEvents(i, e)
            },
            _createGroup: function (t) {
                var e = this._objects,
                    i = e.indexOf(this._activeObject) < e.indexOf(t) ? [this._activeObject, t] : [t, this._activeObject];
                return this._activeObject.isEditing && this._activeObject.exitEditing(), new fabric.ActiveSelection(i, {
                    canvas: this
                })
            },
            _groupSelectedObjects: function (t) {
                var e, i = this._collectObjects(t);
                1 === i.length ? this.setActiveObject(i[0], t) : 1 < i.length && (e = new fabric.ActiveSelection(i.reverse(), {
                    canvas: this
                }), this.setActiveObject(e, t))
            },
            _collectObjects: function (e) {
                for (var t, i = [], r = this._groupSelector.ex, n = this._groupSelector.ey, s = r + this._groupSelector.left, o = n + this._groupSelector.top, a = new fabric.Point(f(r, s), f(n, o)), h = new fabric.Point(d(r, s), d(n, o)), c = !this.selectionFullyContained, l = r === s && n === o, u = this._objects.length; u-- && !((t = this._objects[u]) && t.selectable && t.visible && (c && t.intersectsWithRect(a, h) || t.isContainedWithinRect(a, h) || c && t.containsPoint(a) || c && t.containsPoint(h)) && (i.push(t), l)););
                return 1 < i.length && (i = i.filter(function (t) {
                    return !t.onSelect({
                        e: e
                    })
                })), i
            },
            _maybeGroupObjects: function (t) {
                this.selection && this._groupSelector && this._groupSelectedObjects(t), this.setCursor(this.defaultCursor), this._groupSelector = null
            }
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function (t) {
            t || (t = {});
            var e = t.format || "png",
                i = t.quality || 1,
                r = (t.multiplier || 1) * (t.enableRetinaScaling ? this.getRetinaScaling() : 1),
                n = this.toCanvasElement(r, t);
            return fabric.util.toDataURL(n, e, i)
        },
        toCanvasElement: function (t, e) {
            t = t || 1;
            var i = ((e = e || {}).width || this.width) * t,
                r = (e.height || this.height) * t,
                n = this.getZoom(),
                s = this.width,
                o = this.height,
                a = n * t,
                h = this.viewportTransform,
                c = (h[4] - (e.left || 0)) * t,
                l = (h[5] - (e.top || 0)) * t,
                u = this.interactive,
                f = [a, 0, 0, a, c, l],
                d = this.enableRetinaScaling,
                g = fabric.util.createCanvasElement(),
                p = this.contextTop;
            return g.width = i, g.height = r, this.contextTop = null, this.enableRetinaScaling = !1, this.interactive = !1, this.viewportTransform = f, this.width = i, this.height = r, this.calcViewportBoundaries(), this.renderCanvas(g.getContext("2d"), this._objects), this.viewportTransform = h, this.width = s, this.height = o, this.calcViewportBoundaries(), this.interactive = u, this.enableRetinaScaling = d, this.contextTop = p, g
        }
    }), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        loadFromDatalessJSON: function (t, e, i) {
            return this.loadFromJSON(t, e, i)
        },
        loadFromJSON: function (t, i, e) {
            if (t) {
                var r = "string" == typeof t ? JSON.parse(t) : fabric.util.object.clone(t),
                    n = this,
                    s = r.clipPath,
                    o = this.renderOnAddRemove;
                return this.renderOnAddRemove = !1, delete r.clipPath, this._enlivenObjects(r.objects, function (e) {
                    n.clear(), n._setBgOverlay(r, function () {
                        s ? n._enlivenObjects([s], function (t) {
                            n.clipPath = t[0], n.__setupCanvas.call(n, r, e, o, i)
                        }) : n.__setupCanvas.call(n, r, e, o, i)
                    })
                }, e), this
            }
        },
        __setupCanvas: function (t, e, i, r) {
            var n = this;
            e.forEach(function (t, e) {
                n.insertAt(t, e)
            }), this.renderOnAddRemove = i, delete t.objects, delete t.backgroundImage, delete t.overlayImage, delete t.background, delete t.overlay, this._setOptions(t), this.renderAll(), r && r()
        },
        _setBgOverlay: function (t, e) {
            var i = {
                backgroundColor: !1,
                overlayColor: !1,
                backgroundImage: !1,
                overlayImage: !1
            };
            if (t.backgroundImage || t.overlayImage || t.background || t.overlay) {
                var r = function () {
                    i.backgroundImage && i.overlayImage && i.backgroundColor && i.overlayColor && e && e()
                };
                this.__setBgOverlay("backgroundImage", t.backgroundImage, i, r), this.__setBgOverlay("overlayImage", t.overlayImage, i, r), this.__setBgOverlay("backgroundColor", t.background, i, r), this.__setBgOverlay("overlayColor", t.overlay, i, r)
            } else e && e()
        },
        __setBgOverlay: function (e, t, i, r) {
            var n = this;
            if (!t) return i[e] = !0, void(r && r());
            "backgroundImage" === e || "overlayImage" === e ? fabric.util.enlivenObjects([t], function (t) {
                n[e] = t[0], i[e] = !0, r && r()
            }) : this["set" + fabric.util.string.capitalize(e, !0)](t, function () {
                i[e] = !0, r && r()
            })
        },
        _enlivenObjects: function (t, e, i) {
            t && 0 !== t.length ? fabric.util.enlivenObjects(t, function (t) {
                e && e(t)
            }, null, i) : e && e([])
        },
        _toDataURL: function (e, i) {
            this.clone(function (t) {
                i(t.toDataURL(e))
            })
        },
        _toDataURLWithMultiplier: function (e, i, r) {
            this.clone(function (t) {
                r(t.toDataURLWithMultiplier(e, i))
            })
        },
        clone: function (e, t) {
            var i = JSON.stringify(this.toJSON(t));
            this.cloneWithoutData(function (t) {
                t.loadFromJSON(i, function () {
                    e && e(t)
                })
            })
        },
        cloneWithoutData: function (t) {
            var e = fabric.util.createCanvasElement();
            e.width = this.width, e.height = this.height;
            var i = new fabric.Canvas(e);
            i.clipTo = this.clipTo, this.backgroundImage ? (i.setBackgroundImage(this.backgroundImage.src, function () {
                i.renderAll(), t && t(i)
            }), i.backgroundImageOpacity = this.backgroundImageOpacity, i.backgroundImageStretch = this.backgroundImageStretch) : t && t(i)
        }
    }),
    function (t) {
        "use strict";
        var x = t.fabric || (t.fabric = {}),
            e = x.util.object.extend,
            o = x.util.object.clone,
            r = x.util.toFixed,
            i = x.util.string.capitalize,
            a = x.util.degreesToRadians,
            n = x.StaticCanvas.supports("setLineDash"),
            s = !x.isLikelyNode;
        x.Object || (x.Object = x.util.createClass(x.CommonMethods, {
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
            strokeDashOffset: 0,
            strokeLineCap: "butt",
            strokeLineJoin: "miter",
            strokeMiterLimit: 4,
            shadow: null,
            borderOpacityWhenMoving: .4,
            borderScaleFactor: 1,
            transformMatrix: null,
            minScaleLimit: 0,
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
            objectCaching: s,
            statefullCache: !1,
            noScaleCache: !0,
            strokeUniform: !1,
            dirty: !0,
            __corner: 0,
            paintFirst: "fill",
            stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow clipTo visible backgroundColor skewX skewY fillRule paintFirst clipPath strokeUniform".split(" "),
            cacheProperties: "fill stroke strokeWidth strokeDashArray width height paintFirst strokeUniform strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit backgroundColor clipPath".split(" "),
            clipPath: void 0,
            inverted: !1,
            absolutePositioned: !1,
            initialize: function (t) {
                t && this.setOptions(t)
            },
            _createCacheCanvas: function () {
                this._cacheProperties = {}, this._cacheCanvas = x.util.createCanvasElement(), this._cacheContext = this._cacheCanvas.getContext("2d"), this._updateCacheCanvas(), this.dirty = !0
            },
            _limitCacheSize: function (t) {
                var e = x.perfLimitSizeTotal,
                    i = t.width,
                    r = t.height,
                    n = x.maxCacheSideLimit,
                    s = x.minCacheSideLimit;
                if (i <= n && r <= n && i * r <= e) return i < s && (t.width = s), r < s && (t.height = s), t;
                var o = i / r,
                    a = x.util.limitDimsByArea(o, e),
                    h = x.util.capValue,
                    c = h(s, a.x, n),
                    l = h(s, a.y, n);
                return c < i && (t.zoomX /= i / c, t.width = c, t.capped = !0), l < r && (t.zoomY /= r / l, t.height = l, t.capped = !0), t
            },
            _getCacheCanvasDimensions: function () {
                var t = this.getTotalObjectScaling(),
                    e = this._getTransformedDimensions(0, 0),
                    i = e.x * t.scaleX / this.scaleX,
                    r = e.y * t.scaleY / this.scaleY;
                return {
                    width: i + 2,
                    height: r + 2,
                    zoomX: t.scaleX,
                    zoomY: t.scaleY,
                    x: i,
                    y: r
                }
            },
            _updateCacheCanvas: function () {
                var t = this.canvas;
                if (this.noScaleCache && t && t._currentTransform) {
                    var e = t._currentTransform.target,
                        i = t._currentTransform.action;
                    if (this === e && i.slice && "scale" === i.slice(0, 5)) return !1
                }
                var r, n, s = this._cacheCanvas,
                    o = this._limitCacheSize(this._getCacheCanvasDimensions()),
                    a = x.minCacheSideLimit,
                    h = o.width,
                    c = o.height,
                    l = o.zoomX,
                    u = o.zoomY,
                    f = h !== this.cacheWidth || c !== this.cacheHeight,
                    d = this.zoomX !== l || this.zoomY !== u,
                    g = f || d,
                    p = 0,
                    v = 0,
                    m = !1;
                if (f) {
                    var b = this._cacheCanvas.width,
                        _ = this._cacheCanvas.height,
                        y = b < h || _ < c;
                    m = y || (h < .9 * b || c < .9 * _) && a < b && a < _, y && !o.capped && (a < h || a < c) && (p = .1 * h, v = .1 * c)
                }
                return !!g && (m ? (s.width = Math.ceil(h + p), s.height = Math.ceil(c + v)) : (this._cacheContext.setTransform(1, 0, 0, 1, 0, 0), this._cacheContext.clearRect(0, 0, s.width, s.height)), r = o.x / 2, n = o.y / 2, this.cacheTranslationX = Math.round(s.width / 2 - r) + r, this.cacheTranslationY = Math.round(s.height / 2 - n) + n, this.cacheWidth = h, this.cacheHeight = c, this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY), this._cacheContext.scale(l, u), this.zoomX = l, this.zoomY = u, !0)
            },
            setOptions: function (t) {
                this._setOptions(t), this._initGradient(t.fill, "fill"), this._initGradient(t.stroke, "stroke"), this._initClipping(t), this._initPattern(t.fill, "fill"), this._initPattern(t.stroke, "stroke")
            },
            transform: function (t) {
                var e;
                e = this.group && !this.group._transformDone ? this.calcTransformMatrix() : this.calcOwnMatrix(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
            },
            toObject: function (t) {
                var e = x.Object.NUM_FRACTION_DIGITS,
                    i = {
                        type: this.type,
                        version: x.version,
                        originX: this.originX,
                        originY: this.originY,
                        left: r(this.left, e),
                        top: r(this.top, e),
                        width: r(this.width, e),
                        height: r(this.height, e),
                        fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                        stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                        strokeWidth: r(this.strokeWidth, e),
                        strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                        strokeLineCap: this.strokeLineCap,
                        strokeDashOffset: this.strokeDashOffset,
                        strokeLineJoin: this.strokeLineJoin,
                        strokeMiterLimit: r(this.strokeMiterLimit, e),
                        scaleX: r(this.scaleX, e),
                        scaleY: r(this.scaleY, e),
                        angle: r(this.angle, e),
                        flipX: this.flipX,
                        flipY: this.flipY,
                        opacity: r(this.opacity, e),
                        shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                        visible: this.visible,
                        clipTo: this.clipTo && String(this.clipTo),
                        backgroundColor: this.backgroundColor,
                        fillRule: this.fillRule,
                        paintFirst: this.paintFirst,
                        globalCompositeOperation: this.globalCompositeOperation,
                        transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : null,
                        skewX: r(this.skewX, e),
                        skewY: r(this.skewY, e)
                    };
                return this.clipPath && (i.clipPath = this.clipPath.toObject(t), i.clipPath.inverted = this.clipPath.inverted, i.clipPath.absolutePositioned = this.clipPath.absolutePositioned), x.util.populateWithProperties(this, i, t), this.includeDefaultValues || (i = this._removeDefaultValues(i)), i
            },
            toDatalessObject: function (t) {
                return this.toObject(t)
            },
            _removeDefaultValues: function (e) {
                var i = x.util.getKlass(e.type).prototype;
                return i.stateProperties.forEach(function (t) {
                    "left" !== t && "top" !== t && (e[t] === i[t] && delete e[t], "[object Array]" === Object.prototype.toString.call(e[t]) && "[object Array]" === Object.prototype.toString.call(i[t]) && 0 === e[t].length && 0 === i[t].length && delete e[t])
                }), e
            },
            toString: function () {
                return "#<fabric." + i(this.type) + ">"
            },
            getObjectScaling: function () {
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
            getTotalObjectScaling: function () {
                var t = this.getObjectScaling(),
                    e = t.scaleX,
                    i = t.scaleY;
                if (this.canvas) {
                    var r = this.canvas.getZoom(),
                        n = this.canvas.getRetinaScaling();
                    e *= r * n, i *= r * n
                }
                return {
                    scaleX: e,
                    scaleY: i
                }
            },
            getObjectOpacity: function () {
                var t = this.opacity;
                return this.group && (t *= this.group.getObjectOpacity()), t
            },
            _set: function (t, e) {
                var i = "scaleX" === t || "scaleY" === t,
                    r = this[t] !== e,
                    n = !1;
                return i && (e = this._constrainScale(e)), "scaleX" === t && e < 0 ? (this.flipX = !this.flipX, e *= -1) : "scaleY" === t && e < 0 ? (this.flipY = !this.flipY, e *= -1) : "shadow" !== t || !e || e instanceof x.Shadow ? "dirty" === t && this.group && this.group.set("dirty", e) : e = new x.Shadow(e), this[t] = e, r && (n = this.group && this.group.isOnACache(), -1 < this.cacheProperties.indexOf(t) ? (this.dirty = !0, n && this.group.set("dirty", !0)) : n && -1 < this.stateProperties.indexOf(t) && this.group.set("dirty", !0)), this
            },
            setOnGroup: function () {},
            getViewportTransform: function () {
                return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform : x.iMatrix.concat()
            },
            isNotVisible: function () {
                return 0 === this.opacity || 0 === this.width && 0 === this.height && 0 === this.strokeWidth || !this.visible
            },
            render: function (t) {
                this.isNotVisible() || this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (t.save(), this._setupCompositeOperation(t), this.drawSelectionBackground(t), this.transform(t), this._setOpacity(t), this._setShadow(t, this), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.clipTo && x.util.clipContext(this, t), this.shouldCache() ? (this.renderCache(), this.drawCacheOnCanvas(t)) : (this._removeCacheCanvas(), this.dirty = !1, this.drawObject(t), this.objectCaching && this.statefullCache && this.saveState({
                    propertySet: "cacheProperties"
                })), this.clipTo && t.restore(), t.restore())
            },
            renderCache: function (t) {
                t = t || {}, this._cacheCanvas || this._createCacheCanvas(), this.isCacheDirty() && (this.statefullCache && this.saveState({
                    propertySet: "cacheProperties"
                }), this.drawObject(this._cacheContext, t.forClipping), this.dirty = !1)
            },
            _removeCacheCanvas: function () {
                this._cacheCanvas = null, this.cacheWidth = 0, this.cacheHeight = 0
            },
            hasStroke: function () {
                return this.stroke && "transparent" !== this.stroke && 0 !== this.strokeWidth
            },
            hasFill: function () {
                return this.fill && "transparent" !== this.fill
            },
            needsItsOwnCache: function () {
                return !("stroke" !== this.paintFirst || !this.hasFill() || !this.hasStroke() || "object" != typeof this.shadow) || !!this.clipPath
            },
            shouldCache: function () {
                return this.ownCaching = this.needsItsOwnCache() || this.objectCaching && (!this.group || !this.group.isOnACache()), this.ownCaching
            },
            willDrawShadow: function () {
                return !!this.shadow && (0 !== this.shadow.offsetX || 0 !== this.shadow.offsetY)
            },
            drawClipPathOnCache: function (t) {
                var e = this.clipPath;
                if (t.save(), e.inverted ? t.globalCompositeOperation = "destination-out" : t.globalCompositeOperation = "destination-in", e.absolutePositioned) {
                    var i = x.util.invertTransform(this.calcTransformMatrix());
                    t.transform(i[0], i[1], i[2], i[3], i[4], i[5])
                }
                e.transform(t), t.scale(1 / e.zoomX, 1 / e.zoomY), t.drawImage(e._cacheCanvas, -e.cacheTranslationX, -e.cacheTranslationY), t.restore()
            },
            drawObject: function (t, e) {
                var i = this.fill,
                    r = this.stroke;
                e ? (this.fill = "black", this.stroke = "", this._setClippingProperties(t)) : (this._renderBackground(t), this._setStrokeStyles(t, this), this._setFillStyles(t, this)), this._render(t), this._drawClipPath(t), this.fill = i, this.stroke = r
            },
            _drawClipPath: function (t) {
                var e = this.clipPath;
                e && (e.canvas = this.canvas, e.shouldCache(), e._transformDone = !0, e.renderCache({
                    forClipping: !0
                }), this.drawClipPathOnCache(t))
            },
            drawCacheOnCanvas: function (t) {
                t.scale(1 / this.zoomX, 1 / this.zoomY), t.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY)
            },
            isCacheDirty: function (t) {
                if (this.isNotVisible()) return !1;
                if (this._cacheCanvas && !t && this._updateCacheCanvas()) return !0;
                if (this.dirty || this.clipPath && this.clipPath.absolutePositioned || this.statefullCache && this.hasStateChanged("cacheProperties")) {
                    if (this._cacheCanvas && !t) {
                        var e = this.cacheWidth / this.zoomX,
                            i = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-e / 2, -i / 2, e, i)
                    }
                    return !0
                }
                return !1
            },
            _renderBackground: function (t) {
                if (this.backgroundColor) {
                    var e = this._getNonTransformedDimensions();
                    t.fillStyle = this.backgroundColor, t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y), this._removeShadow(t)
                }
            },
            _setOpacity: function (t) {
                this.group && !this.group._transformDone ? t.globalAlpha = this.getObjectOpacity() : t.globalAlpha *= this.opacity
            },
            _setStrokeStyles: function (t, e) {
                e.stroke && (t.lineWidth = e.strokeWidth, t.lineCap = e.strokeLineCap, t.lineDashOffset = e.strokeDashOffset, t.lineJoin = e.strokeLineJoin, t.miterLimit = e.strokeMiterLimit, t.strokeStyle = e.stroke.toLive ? e.stroke.toLive(t, this) : e.stroke)
            },
            _setFillStyles: function (t, e) {
                e.fill && (t.fillStyle = e.fill.toLive ? e.fill.toLive(t, this) : e.fill)
            },
            _setClippingProperties: function (t) {
                t.globalAlpha = 1, t.strokeStyle = "transparent", t.fillStyle = "#000000"
            },
            _setLineDash: function (t, e, i) {
                e && 0 !== e.length && (1 & e.length && e.push.apply(e, e), n ? t.setLineDash(e) : i && i(t))
            },
            _renderControls: function (t, e) {
                var i, r, n, s = this.getViewportTransform(),
                    o = this.calcTransformMatrix();
                r = void 0 !== (e = e || {}).hasBorders ? e.hasBorders : this.hasBorders, n = void 0 !== e.hasControls ? e.hasControls : this.hasControls, o = x.util.multiplyTransformMatrices(s, o), i = x.util.qrDecompose(o), t.save(), t.translate(i.translateX, i.translateY), t.lineWidth = 1 * this.borderScaleFactor, this.group || (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1), e.forActiveSelection ? (t.rotate(a(i.angle)), r && this.drawBordersInGroup(t, i, e)) : (t.rotate(a(this.angle)), r && this.drawBorders(t, e)), n && this.drawControls(t, e), t.restore()
            },
            _setShadow: function (t) {
                if (this.shadow) {
                    var e, i = this.shadow,
                        r = this.canvas,
                        n = r && r.viewportTransform[0] || 1,
                        s = r && r.viewportTransform[3] || 1;
                    e = i.nonScaling ? {
                        scaleX: 1,
                        scaleY: 1
                    } : this.getObjectScaling(), r && r._isRetinaScaling() && (n *= x.devicePixelRatio, s *= x.devicePixelRatio), t.shadowColor = i.color, t.shadowBlur = i.blur * x.browserShadowBlurConstant * (n + s) * (e.scaleX + e.scaleY) / 4, t.shadowOffsetX = i.offsetX * n * e.scaleX, t.shadowOffsetY = i.offsetY * s * e.scaleY
                }
            },
            _removeShadow: function (t) {
                this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
            },
            _applyPatternGradientTransform: function (t, e) {
                if (!e || !e.toLive) return {
                    offsetX: 0,
                    offsetY: 0
                };
                var i = e.gradientTransform || e.patternTransform,
                    r = -this.width / 2 + e.offsetX || 0,
                    n = -this.height / 2 + e.offsetY || 0;
                return "percentage" === e.gradientUnits ? t.transform(this.width, 0, 0, this.height, r, n) : t.transform(1, 0, 0, 1, r, n), i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]), {
                    offsetX: r,
                    offsetY: n
                }
            },
            _renderPaintInOrder: function (t) {
                "stroke" === this.paintFirst ? (this._renderStroke(t), this._renderFill(t)) : (this._renderFill(t), this._renderStroke(t))
            },
            _render: function () {},
            _renderFill: function (t) {
                this.fill && (t.save(), this._applyPatternGradientTransform(t, this.fill), "evenodd" === this.fillRule ? t.fill("evenodd") : t.fill(), t.restore())
            },
            _renderStroke: function (t) {
                this.stroke && 0 !== this.strokeWidth && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this.strokeUniform && t.scale(1 / this.scaleX, 1 / this.scaleY), this._setLineDash(t, this.strokeDashArray, this._renderDashedStroke), this.stroke.toLive && "percentage" === this.stroke.gradientUnits ? this._applyPatternForTransformedGradient(t, this.stroke) : this._applyPatternGradientTransform(t, this.stroke), t.stroke(), t.restore())
            },
            _applyPatternForTransformedGradient: function (t, e) {
                var i, r = this._limitCacheSize(this._getCacheCanvasDimensions()),
                    n = x.util.createCanvasElement(),
                    s = this.canvas.getRetinaScaling(),
                    o = r.x / this.scaleX / s,
                    a = r.y / this.scaleY / s;
                n.width = o, n.height = a, (i = n.getContext("2d")).beginPath(), i.moveTo(0, 0), i.lineTo(o, 0), i.lineTo(o, a), i.lineTo(0, a), i.closePath(), i.translate(o / 2, a / 2), i.scale(r.zoomX / this.scaleX / s, r.zoomY / this.scaleY / s), this._applyPatternGradientTransform(i, e), i.fillStyle = e.toLive(t), i.fill(), t.translate(-this.width / 2 - this.strokeWidth / 2, -this.height / 2 - this.strokeWidth / 2), t.scale(s * this.scaleX / r.zoomX, s * this.scaleY / r.zoomY), t.strokeStyle = i.createPattern(n, "no-repeat")
            },
            _findCenterFromElement: function () {
                return {
                    x: this.left + this.width / 2,
                    y: this.top + this.height / 2
                }
            },
            _assignTransformMatrixProps: function () {
                if (this.transformMatrix) {
                    var t = x.util.qrDecompose(this.transformMatrix);
                    this.flipX = !1, this.flipY = !1, this.set("scaleX", t.scaleX), this.set("scaleY", t.scaleY), this.angle = t.angle, this.skewX = t.skewX, this.skewY = 0
                }
            },
            _removeTransformMatrix: function (t) {
                var e = this._findCenterFromElement();
                this.transformMatrix && (this._assignTransformMatrixProps(), e = x.util.transformPoint(e, this.transformMatrix)), this.transformMatrix = null, t && (this.scaleX *= t.scaleX, this.scaleY *= t.scaleY, this.cropX = t.cropX, this.cropY = t.cropY, e.x += t.offsetLeft, e.y += t.offsetTop, this.width = t.width, this.height = t.height), this.setPositionByOrigin(e, "center", "center")
            },
            clone: function (t, e) {
                var i = this.toObject(e);
                this.constructor.fromObject ? this.constructor.fromObject(i, t) : x.Object._fromObject("Object", i, t)
            },
            cloneAsImage: function (t, e) {
                var i = this.toCanvasElement(e);
                return t && t(new x.Image(i)), this
            },
            toCanvasElement: function (t) {
                t || (t = {});
                var e = x.util,
                    i = e.saveObjectTransform(this),
                    r = this.group,
                    n = this.shadow,
                    s = Math.abs,
                    o = (t.multiplier || 1) * (t.enableRetinaScaling ? x.devicePixelRatio : 1);
                delete this.group, t.withoutTransform && e.resetObjectTransform(this), t.withoutShadow && (this.shadow = null);
                var a, h, c = x.util.createCanvasElement(),
                    l = this.getBoundingRect(!0, !0),
                    u = this.shadow,
                    f = {
                        x: 0,
                        y: 0
                    };
                u && (h = u.blur, a = u.nonScaling ? {
                    scaleX: 1,
                    scaleY: 1
                } : this.getObjectScaling(), f.x = 2 * Math.round(s(u.offsetX) + h) * s(a.scaleX), f.y = 2 * Math.round(s(u.offsetY) + h) * s(a.scaleY)), c.width = l.width + f.x, c.height = l.height + f.y, c.width += c.width % 2 ? 2 - c.width % 2 : 0, c.height += c.height % 2 ? 2 - c.height % 2 : 0;
                var d = new x.StaticCanvas(c, {
                    enableRetinaScaling: !1,
                    renderOnAddRemove: !1,
                    skipOffscreen: !1
                });
                "jpeg" === t.format && (d.backgroundColor = "#fff"), this.setPositionByOrigin(new x.Point(d.width / 2, d.height / 2), "center", "center");
                var g = this.canvas;
                d.add(this);
                var p = d.toCanvasElement(o || 1, t);
                return this.shadow = n, this.canvas = g, r && (this.group = r), this.set(i).setCoords(), d._objects = [], d.dispose(), d = null, p
            },
            toDataURL: function (t) {
                return t || (t = {}), x.util.toDataURL(this.toCanvasElement(t), t.format || "png", t.quality || 1)
            },
            isType: function (t) {
                return this.type === t
            },
            complexity: function () {
                return 1
            },
            toJSON: function (t) {
                return this.toObject(t)
            },
            setGradient: function (t, e) {
                e || (e = {});
                var i = {
                    colorStops: []
                };
                return i.type = e.type || (e.r1 || e.r2 ? "radial" : "linear"), i.coords = {
                    x1: e.x1,
                    y1: e.y1,
                    x2: e.x2,
                    y2: e.y2
                }, i.gradientUnits = e.gradientUnits || "pixels", (e.r1 || e.r2) && (i.coords.r1 = e.r1, i.coords.r2 = e.r2), i.gradientTransform = e.gradientTransform, x.Gradient.prototype.addColorStop.call(i, e.colorStops), this.set(t, x.Gradient.forObject(this, i))
            },
            setPatternFill: function (t, e) {
                return this.set("fill", new x.Pattern(t, e))
            },
            setShadow: function (t) {
                return this.set("shadow", t ? new x.Shadow(t) : null)
            },
            setColor: function (t) {
                return this.set("fill", t), this
            },
            rotate: function (t) {
                var e = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation;
                return e && this._setOriginToCenter(), this.set("angle", t), e && this._resetOrigin(), this
            },
            centerH: function () {
                return this.canvas && this.canvas.centerObjectH(this), this
            },
            viewportCenterH: function () {
                return this.canvas && this.canvas.viewportCenterObjectH(this), this
            },
            centerV: function () {
                return this.canvas && this.canvas.centerObjectV(this), this
            },
            viewportCenterV: function () {
                return this.canvas && this.canvas.viewportCenterObjectV(this), this
            },
            center: function () {
                return this.canvas && this.canvas.centerObject(this), this
            },
            viewportCenter: function () {
                return this.canvas && this.canvas.viewportCenterObject(this), this
            },
            getLocalPointer: function (t, e) {
                e = e || this.canvas.getPointer(t);
                var i = new x.Point(e.x, e.y),
                    r = this._getLeftTopCoords();
                return this.angle && (i = x.util.rotatePoint(i, r, a(-this.angle))), {
                    x: i.x - r.x,
                    y: i.y - r.y
                }
            },
            _setupCompositeOperation: function (t) {
                this.globalCompositeOperation && (t.globalCompositeOperation = this.globalCompositeOperation)
            }
        }), x.util.createAccessors && x.util.createAccessors(x.Object), e(x.Object.prototype, x.Observable), x.Object.NUM_FRACTION_DIGITS = 2, x.Object._fromObject = function (t, i, r, n) {
            var s = x[t];
            i = o(i, !0), x.util.enlivenPatterns([i.fill, i.stroke], function (t) {
                void 0 !== t[0] && (i.fill = t[0]), void 0 !== t[1] && (i.stroke = t[1]), x.util.enlivenObjects([i.clipPath], function (t) {
                    i.clipPath = t[0];
                    var e = n ? new s(i[n], i) : new s(i);
                    r && r(e)
                })
            })
        }, x.Object.__uid = 0)
    }("undefined" != typeof exports ? exports : this),
    function () {
        var a = fabric.util.degreesToRadians,
            l = {
                left: -.5,
                center: 0,
                right: .5
            },
            u = {
                top: -.5,
                center: 0,
                bottom: .5
            };
        fabric.util.object.extend(fabric.Object.prototype, {
            translateToGivenOrigin: function (t, e, i, r, n) {
                var s, o, a, h = t.x,
                    c = t.y;
                return "string" == typeof e ? e = l[e] : e -= .5, "string" == typeof r ? r = l[r] : r -= .5, "string" == typeof i ? i = u[i] : i -= .5, "string" == typeof n ? n = u[n] : n -= .5, o = n - i, ((s = r - e) || o) && (a = this._getTransformedDimensions(), h = t.x + s * a.x, c = t.y + o * a.y), new fabric.Point(h, c)
            },
            translateToCenterPoint: function (t, e, i) {
                var r = this.translateToGivenOrigin(t, e, i, "center", "center");
                return this.angle ? fabric.util.rotatePoint(r, t, a(this.angle)) : r
            },
            translateToOriginPoint: function (t, e, i) {
                var r = this.translateToGivenOrigin(t, "center", "center", e, i);
                return this.angle ? fabric.util.rotatePoint(r, t, a(this.angle)) : r
            },
            getCenterPoint: function () {
                var t = new fabric.Point(this.left, this.top);
                return this.translateToCenterPoint(t, this.originX, this.originY)
            },
            getPointByOrigin: function (t, e) {
                var i = this.getCenterPoint();
                return this.translateToOriginPoint(i, t, e)
            },
            toLocalPoint: function (t, e, i) {
                var r, n, s = this.getCenterPoint();
                return r = void 0 !== e && void 0 !== i ? this.translateToGivenOrigin(s, "center", "center", e, i) : new fabric.Point(this.left, this.top), n = new fabric.Point(t.x, t.y), this.angle && (n = fabric.util.rotatePoint(n, s, -a(this.angle))), n.subtractEquals(r)
            },
            setPositionByOrigin: function (t, e, i) {
                var r = this.translateToCenterPoint(t, e, i),
                    n = this.translateToOriginPoint(r, this.originX, this.originY);
                this.set("left", n.x), this.set("top", n.y)
            },
            adjustPosition: function (t) {
                var e, i, r = a(this.angle),
                    n = this.getScaledWidth(),
                    s = fabric.util.cos(r) * n,
                    o = fabric.util.sin(r) * n;
                e = "string" == typeof this.originX ? l[this.originX] : this.originX - .5, i = "string" == typeof t ? l[t] : t - .5, this.left += s * (i - e), this.top += o * (i - e), this.setCoords(), this.originX = t
            },
            _setOriginToCenter: function () {
                this._originalOriginX = this.originX, this._originalOriginY = this.originY;
                var t = this.getCenterPoint();
                this.originX = "center", this.originY = "center", this.left = t.x, this.top = t.y
            },
            _resetOrigin: function () {
                var t = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
                this.originX = this._originalOriginX, this.originY = this._originalOriginY, this.left = t.x, this.top = t.y, this._originalOriginX = null, this._originalOriginY = null
            },
            _getLeftTopCoords: function () {
                return this.translateToOriginPoint(this.getCenterPoint(), "left", "top")
            }
        })
    }(),
    function () {
        var k = fabric.util.degreesToRadians,
            P = fabric.util.multiplyTransformMatrices,
            D = fabric.util.transformPoint;
        fabric.util.object.extend(fabric.Object.prototype, {
            oCoords: null,
            aCoords: null,
            ownMatrixCache: null,
            matrixCache: null,
            getCoords: function (t, e) {
                this.oCoords || this.setCoords();
                var i, r = t ? this.aCoords : this.oCoords;
                return i = e ? this.calcCoords(t) : r, [new fabric.Point(i.tl.x, i.tl.y), new fabric.Point(i.tr.x, i.tr.y), new fabric.Point(i.br.x, i.br.y), new fabric.Point(i.bl.x, i.bl.y)]
            },
            intersectsWithRect: function (t, e, i, r) {
                var n = this.getCoords(i, r);
                return "Intersection" === fabric.Intersection.intersectPolygonRectangle(n, t, e).status
            },
            intersectsWithObject: function (t, e, i) {
                return "Intersection" === fabric.Intersection.intersectPolygonPolygon(this.getCoords(e, i), t.getCoords(e, i)).status || t.isContainedWithinObject(this, e, i) || this.isContainedWithinObject(t, e, i)
            },
            isContainedWithinObject: function (t, e, i) {
                for (var r = this.getCoords(e, i), n = 0, s = t._getImageLines(i ? t.calcCoords(e) : e ? t.aCoords : t.oCoords); n < 4; n++)
                    if (!t.containsPoint(r[n], s)) return !1;
                return !0
            },
            isContainedWithinRect: function (t, e, i, r) {
                var n = this.getBoundingRect(i, r);
                return n.left >= t.x && n.left + n.width <= e.x && n.top >= t.y && n.top + n.height <= e.y
            },
            containsPoint: function (t, e, i, r) {
                e = e || this._getImageLines(r ? this.calcCoords(i) : i ? this.aCoords : this.oCoords);
                var n = this._findCrossPoints(t, e);
                return 0 !== n && n % 2 == 1
            },
            isOnScreen: function (t) {
                if (!this.canvas) return !1;
                for (var e, i = this.canvas.vptCoords.tl, r = this.canvas.vptCoords.br, n = this.getCoords(!0, t), s = 0; s < 4; s++)
                    if ((e = n[s]).x <= r.x && e.x >= i.x && e.y <= r.y && e.y >= i.y) return !0;
                return !!this.intersectsWithRect(i, r, !0, t) || this._containsCenterOfCanvas(i, r, t)
            },
            _containsCenterOfCanvas: function (t, e, i) {
                var r = {
                    x: (t.x + e.x) / 2,
                    y: (t.y + e.y) / 2
                };
                return !!this.containsPoint(r, null, !0, i)
            },
            isPartiallyOnScreen: function (t) {
                if (!this.canvas) return !1;
                var e = this.canvas.vptCoords.tl,
                    i = this.canvas.vptCoords.br;
                return !!this.intersectsWithRect(e, i, !0, t) || this._containsCenterOfCanvas(e, i, t)
            },
            _getImageLines: function (t) {
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
            _findCrossPoints: function (t, e) {
                var i, r, n, s = 0;
                for (var o in e)
                    if (!((n = e[o]).o.y < t.y && n.d.y < t.y || n.o.y >= t.y && n.d.y >= t.y || (n.o.x === n.d.x && n.o.x >= t.x ? r = n.o.x : (0, i = (n.d.y - n.o.y) / (n.d.x - n.o.x), r = -(t.y - 0 * t.x - (n.o.y - i * n.o.x)) / (0 - i)), r >= t.x && (s += 1), 2 !== s))) break;
                return s
            },
            getBoundingRect: function (t, e) {
                var i = this.getCoords(t, e);
                return fabric.util.makeBoundingBoxFromPoints(i)
            },
            getScaledWidth: function () {
                return this._getTransformedDimensions().x
            },
            getScaledHeight: function () {
                return this._getTransformedDimensions().y
            },
            _constrainScale: function (t) {
                return Math.abs(t) < this.minScaleLimit ? t < 0 ? -this.minScaleLimit : this.minScaleLimit : 0 === t ? 1e-4 : t
            },
            scale: function (t) {
                return this._set("scaleX", t), this._set("scaleY", t), this.setCoords()
            },
            scaleToWidth: function (t, e) {
                var i = this.getBoundingRect(e).width / this.getScaledWidth();
                return this.scale(t / this.width / i)
            },
            scaleToHeight: function (t, e) {
                var i = this.getBoundingRect(e).height / this.getScaledHeight();
                return this.scale(t / this.height / i)
            },
            calcCoords: function (t) {
                var e = this._calcRotateMatrix(),
                    i = this._calcTranslateMatrix(),
                    r = P(i, e),
                    n = this.getViewportTransform(),
                    s = t ? r : P(n, r),
                    o = this._getTransformedDimensions(),
                    a = o.x / 2,
                    h = o.y / 2,
                    c = D({
                        x: -a,
                        y: -h
                    }, s),
                    l = D({
                        x: a,
                        y: -h
                    }, s),
                    u = D({
                        x: -a,
                        y: h
                    }, s),
                    f = D({
                        x: a,
                        y: h
                    }, s);
                if (!t) {
                    var d = this.padding,
                        g = k(this.angle),
                        p = fabric.util.cos(g),
                        v = fabric.util.sin(g),
                        m = p * d,
                        b = v * d,
                        _ = m + b,
                        y = m - b;
                    d && (c.x -= y, c.y -= _, l.x += _, l.y -= y, u.x -= _, u.y += y, f.x += y, f.y += _);
                    var x = new fabric.Point((c.x + u.x) / 2, (c.y + u.y) / 2),
                        C = new fabric.Point((l.x + c.x) / 2, (l.y + c.y) / 2),
                        S = new fabric.Point((f.x + l.x) / 2, (f.y + l.y) / 2),
                        T = new fabric.Point((f.x + u.x) / 2, (f.y + u.y) / 2),
                        w = new fabric.Point(C.x + v * this.rotatingPointOffset, C.y - p * this.rotatingPointOffset)
                }
                var O = {
                    tl: c,
                    tr: l,
                    br: f,
                    bl: u
                };
                return t || (O.ml = x, O.mt = C, O.mr = S, O.mb = T, O.mtr = w), O
            },
            setCoords: function (t, e) {
                return this.oCoords = this.calcCoords(t), e || (this.aCoords = this.calcCoords(!0)), t || this._setCornerCoords && this._setCornerCoords(), this
            },
            _calcRotateMatrix: function () {
                return fabric.util.calcRotateMatrix(this)
            },
            _calcTranslateMatrix: function () {
                var t = this.getCenterPoint();
                return [1, 0, 0, 1, t.x, t.y]
            },
            transformMatrixKey: function (t) {
                var e = "_",
                    i = "";
                return !t && this.group && (i = this.group.transformMatrixKey(t) + e), i + this.top + e + this.left + e + this.scaleX + e + this.scaleY + e + this.skewX + e + this.skewY + e + this.angle + e + this.originX + e + this.originY + e + this.width + e + this.height + e + this.strokeWidth + this.flipX + this.flipY
            },
            calcTransformMatrix: function (t) {
                if (t) return this.calcOwnMatrix();
                var e = this.transformMatrixKey(),
                    i = this.matrixCache || (this.matrixCache = {});
                if (i.key === e) return i.value;
                var r = this.calcOwnMatrix();
                return this.group && (r = P(this.group.calcTransformMatrix(), r)), i.key = e, i.value = r
            },
            calcOwnMatrix: function () {
                var t = this.transformMatrixKey(!0),
                    e = this.ownMatrixCache || (this.ownMatrixCache = {});
                if (e.key === t) return e.value;
                var i = this._calcTranslateMatrix();
                return this.translateX = i[4], this.translateY = i[5], e.key = t, e.value = fabric.util.composeMatrix(this), e.value
            },
            _calcDimensionsTransformMatrix: function (t, e, i) {
                return fabric.util.calcDimensionsMatrix({
                    skewX: t,
                    skewY: e,
                    scaleX: this.scaleX * (i && this.flipX ? -1 : 1),
                    scaleY: this.scaleY * (i && this.flipY ? -1 : 1)
                })
            },
            _getNonTransformedDimensions: function () {
                var t = this.strokeWidth;
                return {
                    x: this.width + t,
                    y: this.height + t
                }
            },
            _getTransformedDimensions: function (t, e) {
                void 0 === t && (t = this.skewX), void 0 === e && (e = this.skewY);
                var i, r, n = this._getNonTransformedDimensions(),
                    s = 0 === t && 0 === e;
                if (this.strokeUniform ? (i = this.width, r = this.height) : (i = n.x, r = n.y), s) return this._finalizeDimensions(i * this.scaleX, r * this.scaleY);
                var o = [{
                        x: -(i /= 2),
                        y: -(r /= 2)
                    }, {
                        x: i,
                        y: -r
                    }, {
                        x: -i,
                        y: r
                    }, {
                        x: i,
                        y: r
                    }],
                    a = fabric.util.calcDimensionsMatrix({
                        scaleX: this.scaleX,
                        scaleY: this.scaleY,
                        skewX: t,
                        skewY: e
                    }),
                    h = fabric.util.makeBoundingBoxFromPoints(o, a);
                return this._finalizeDimensions(h.width, h.height)
            },
            _finalizeDimensions: function (t, e) {
                return this.strokeUniform ? {
                    x: t + this.strokeWidth,
                    y: e + this.strokeWidth
                } : {
                    x: t,
                    y: e
                }
            },
            _calculateCurrentDimensions: function () {
                var t = this.getViewportTransform(),
                    e = this._getTransformedDimensions();
                return fabric.util.transformPoint(e, t, !0).scalarAdd(2 * this.padding)
            }
        })
    }(), fabric.util.object.extend(fabric.Object.prototype, {
        sendToBack: function () {
            return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this), this
        },
        bringToFront: function () {
            return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this), this
        },
        sendBackwards: function (t) {
            return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t) : this.canvas.sendBackwards(this, t), this
        },
        bringForward: function (t) {
            return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t) : this.canvas.bringForward(this, t), this
        },
        moveTo: function (t) {
            return this.group && "activeSelection" !== this.group.type ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t) : this.canvas.moveTo(this, t), this
        }
    }),
    function () {
        function f(t, e) {
            if (e) {
                if (e.toLive) return t + ": url(#SVGID_" + e.id + "); ";
                var i = new fabric.Color(e),
                    r = t + ": " + i.toRgb() + "; ",
                    n = i.getAlpha();
                return 1 !== n && (r += t + "-opacity: " + n.toString() + "; "), r
            }
            return t + ": none; "
        }
        var i = fabric.util.toFixed;
        fabric.util.object.extend(fabric.Object.prototype, {
            getSvgStyles: function (t) {
                var e = this.fillRule ? this.fillRule : "nonzero",
                    i = this.strokeWidth ? this.strokeWidth : "0",
                    r = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none",
                    n = this.strokeDashOffset ? this.strokeDashOffset : "0",
                    s = this.strokeLineCap ? this.strokeLineCap : "butt",
                    o = this.strokeLineJoin ? this.strokeLineJoin : "miter",
                    a = this.strokeMiterLimit ? this.strokeMiterLimit : "4",
                    h = void 0 !== this.opacity ? this.opacity : "1",
                    c = this.visible ? "" : " visibility: hidden;",
                    l = t ? "" : this.getSvgFilter(),
                    u = f("fill", this.fill);
                return [f("stroke", this.stroke), "stroke-width: ", i, "; ", "stroke-dasharray: ", r, "; ", "stroke-linecap: ", s, "; ", "stroke-dashoffset: ", n, "; ", "stroke-linejoin: ", o, "; ", "stroke-miterlimit: ", a, "; ", u, "fill-rule: ", e, "; ", "opacity: ", h, ";", l, c].join("")
            },
            getSvgSpanStyles: function (t, e) {
                var i = "; ",
                    r = t.fontFamily ? "font-family: " + (-1 === t.fontFamily.indexOf("'") && -1 === t.fontFamily.indexOf('"') ? "'" + t.fontFamily + "'" : t.fontFamily) + i : "",
                    n = t.strokeWidth ? "stroke-width: " + t.strokeWidth + i : "",
                    s = (r = r, t.fontSize ? "font-size: " + t.fontSize + "px" + i : ""),
                    o = t.fontStyle ? "font-style: " + t.fontStyle + i : "",
                    a = t.fontWeight ? "font-weight: " + t.fontWeight + i : "",
                    h = t.fill ? f("fill", t.fill) : "",
                    c = t.stroke ? f("stroke", t.stroke) : "",
                    l = this.getSvgTextDecoration(t);
                return l && (l = "text-decoration: " + l + i), [c, n, r, s, o, a, l, h, t.deltaY ? "baseline-shift: " + -t.deltaY + "; " : "", e ? "white-space: pre; " : ""].join("")
            },
            getSvgTextDecoration: function (t) {
                return "overline" in t || "underline" in t || "linethrough" in t ? (t.overline ? "overline " : "") + (t.underline ? "underline " : "") + (t.linethrough ? "line-through " : "") : ""
            },
            getSvgFilter: function () {
                return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : ""
            },
            getSvgCommons: function () {
                return [this.id ? 'id="' + this.id + '" ' : "", this.clipPath ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" ' : ""].join("")
            },
            getSvgTransform: function (t, e) {
                var i = t ? this.calcTransformMatrix() : this.calcOwnMatrix();
                return 'transform="' + fabric.util.matrixToSVG(i) + (e || "") + this.getSvgTransformMatrix() + '" '
            },
            getSvgTransformMatrix: function () {
                return this.transformMatrix ? " " + fabric.util.matrixToSVG(this.transformMatrix) : ""
            },
            _setSVGBg: function (t) {
                if (this.backgroundColor) {
                    var e = fabric.Object.NUM_FRACTION_DIGITS;
                    t.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', i(-this.width / 2, e), '" y="', i(-this.height / 2, e), '" width="', i(this.width, e), '" height="', i(this.height, e), '"></rect>\n')
                }
            },
            toSVG: function (t) {
                return this._createBaseSVGMarkup(this._toSVG(t), {
                    reviver: t
                })
            },
            toClipPathSVG: function (t) {
                return "\t" + this._createBaseClipPathSVGMarkup(this._toSVG(t), {
                    reviver: t
                })
            },
            _createBaseClipPathSVGMarkup: function (t, e) {
                var i = (e = e || {}).reviver,
                    r = e.additionalTransform || "",
                    n = [this.getSvgTransform(!0, r), this.getSvgCommons()].join(""),
                    s = t.indexOf("COMMON_PARTS");
                return t[s] = n, i ? i(t.join("")) : t.join("")
            },
            _createBaseSVGMarkup: function (t, e) {
                var i, r, n = (e = e || {}).noStyle,
                    s = e.reviver,
                    o = n ? "" : 'style="' + this.getSvgStyles() + '" ',
                    a = e.withShadow ? 'style="' + this.getSvgFilter() + '" ' : "",
                    h = this.clipPath,
                    c = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : "",
                    l = h && h.absolutePositioned,
                    u = this.stroke,
                    f = this.fill,
                    d = this.shadow,
                    g = [],
                    p = t.indexOf("COMMON_PARTS"),
                    v = e.additionalTransform;
                return h && (h.clipPathId = "CLIPPATH_" + fabric.Object.__uid++, r = '<clipPath id="' + h.clipPathId + '" >\n' + h.toClipPathSVG(s) + "</clipPath>\n"), l && g.push("<g ", a, this.getSvgCommons(), " >\n"), g.push("<g ", this.getSvgTransform(!1), l ? "" : a + this.getSvgCommons(), " >\n"), i = [o, c, n ? "" : this.addPaintOrder(), " ", v ? 'transform="' + v + '" ' : ""].join(""), t[p] = i, f && f.toLive && g.push(f.toSVG(this)), u && u.toLive && g.push(u.toSVG(this)), d && g.push(d.toSVG(this)), h && g.push(r), g.push(t.join("")), g.push("</g>\n"), l && g.push("</g>\n"), s ? s(g.join("")) : g.join("")
            },
            addPaintOrder: function () {
                return "fill" !== this.paintFirst ? ' paint-order="' + this.paintFirst + '" ' : ""
            }
        })
    }(),
    function () {
        var n = fabric.util.object.extend,
            r = "stateProperties";

        function s(e, t, i) {
            var r = {};
            i.forEach(function (t) {
                r[t] = e[t]
            }), n(e[t], r, !0)
        }
        fabric.util.object.extend(fabric.Object.prototype, {
            hasStateChanged: function (t) {
                var e = "_" + (t = t || r);
                return Object.keys(this[e]).length < this[t].length || ! function t(e, i, r) {
                    if (e === i) return !0;
                    if (Array.isArray(e)) {
                        if (!Array.isArray(i) || e.length !== i.length) return !1;
                        for (var n = 0, s = e.length; n < s; n++)
                            if (!t(e[n], i[n])) return !1;
                        return !0
                    }
                    if (e && "object" == typeof e) {
                        var o, a = Object.keys(e);
                        if (!i || "object" != typeof i || !r && a.length !== Object.keys(i).length) return !1;
                        for (n = 0, s = a.length; n < s; n++)
                            if ("canvas" !== (o = a[n]) && !t(e[o], i[o])) return !1;
                        return !0
                    }
                }(this[e], this, !0)
            },
            saveState: function (t) {
                var e = t && t.propertySet || r,
                    i = "_" + e;
                return this[i] ? (s(this, i, this[e]), t && t.stateProperties && s(this, i, t.stateProperties), this) : this.setupState(t)
            },
            setupState: function (t) {
                var e = (t = t || {}).propertySet || r;
                return this["_" + (t.propertySet = e)] = {}, this.saveState(t), this
            }
        })
    }(),
    function () {
        var h = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            _controlsVisibility: null,
            _findTargetCorner: function (t) {
                if (!this.hasControls || this.group || !this.canvas || this.canvas._activeObject !== this) return !1;
                var e, i, r = t.x,
                    n = t.y;
                for (var s in this.__corner = 0, this.oCoords)
                    if (this.isControlVisible(s) && ("mtr" !== s || this.hasRotatingPoint) && (!this.get("lockUniScaling") || "mt" !== s && "mr" !== s && "mb" !== s && "ml" !== s) && (i = this._getImageLines(this.oCoords[s].corner), 0 !== (e = this._findCrossPoints({
                            x: r,
                            y: n
                        }, i)) && e % 2 == 1)) return this.__corner = s;
                return !1
            },
            _setCornerCoords: function () {
                var t, e, i = this.oCoords,
                    r = h(45 - this.angle),
                    n = .707106 * this.cornerSize,
                    s = n * fabric.util.cos(r),
                    o = n * fabric.util.sin(r);
                for (var a in i) t = i[a].x, e = i[a].y, i[a].corner = {
                    tl: {
                        x: t - o,
                        y: e - s
                    },
                    tr: {
                        x: t + s,
                        y: e - o
                    },
                    bl: {
                        x: t - s,
                        y: e + o
                    },
                    br: {
                        x: t + o,
                        y: e + s
                    }
                }
            },
            drawSelectionBackground: function (t) {
                if (!this.selectionBackgroundColor || this.canvas && !this.canvas.interactive || this.canvas && this.canvas._activeObject !== this) return this;
                t.save();
                var e = this.getCenterPoint(),
                    i = this._calculateCurrentDimensions(),
                    r = this.canvas.viewportTransform;
                return t.translate(e.x, e.y), t.scale(1 / r[0], 1 / r[3]), t.rotate(h(this.angle)), t.fillStyle = this.selectionBackgroundColor, t.fillRect(-i.x / 2, -i.y / 2, i.x, i.y), t.restore(), this
            },
            drawBorders: function (t, e) {
                e = e || {};
                var i = this._calculateCurrentDimensions(),
                    r = 1 / this.borderScaleFactor,
                    n = i.x + r,
                    s = i.y + r,
                    o = void 0 !== e.hasRotatingPoint ? e.hasRotatingPoint : this.hasRotatingPoint,
                    a = void 0 !== e.hasControls ? e.hasControls : this.hasControls,
                    h = void 0 !== e.rotatingPointOffset ? e.rotatingPointOffset : this.rotatingPointOffset;
                if (t.save(), t.strokeStyle = e.borderColor || this.borderColor, this._setLineDash(t, e.borderDashArray || this.borderDashArray, null), t.strokeRect(-n / 2, -s / 2, n, s), o && this.isControlVisible("mtr") && a) {
                    var c = -s / 2;
                    t.beginPath(), t.moveTo(0, c), t.lineTo(0, c - h), t.stroke()
                }
                return t.restore(), this
            },
            drawBordersInGroup: function (t, e, i) {
                i = i || {};
                var r = this._getNonTransformedDimensions(),
                    n = fabric.util.composeMatrix({
                        scaleX: e.scaleX,
                        scaleY: e.scaleY,
                        skewX: e.skewX
                    }),
                    s = fabric.util.transformPoint(r, n),
                    o = 1 / this.borderScaleFactor,
                    a = s.x + o,
                    h = s.y + o;
                return t.save(), this._setLineDash(t, i.borderDashArray || this.borderDashArray, null), t.strokeStyle = i.borderColor || this.borderColor, t.strokeRect(-a / 2, -h / 2, a, h), t.restore(), this
            },
            drawControls: function (t, e) {
                e = e || {};
                var i = this._calculateCurrentDimensions(),
                    r = i.x,
                    n = i.y,
                    s = e.cornerSize || this.cornerSize,
                    o = -(r + s) / 2,
                    a = -(n + s) / 2,
                    h = void 0 !== e.transparentCorners ? e.transparentCorners : this.transparentCorners,
                    c = void 0 !== e.hasRotatingPoint ? e.hasRotatingPoint : this.hasRotatingPoint,
                    l = h ? "stroke" : "fill";
                return t.save(), t.strokeStyle = t.fillStyle = e.cornerColor || this.cornerColor, this.transparentCorners || (t.strokeStyle = e.cornerStrokeColor || this.cornerStrokeColor), this._setLineDash(t, e.cornerDashArray || this.cornerDashArray, null), this._drawControl("tl", t, l, o, a, e), this._drawControl("tr", t, l, o + r, a, e), this._drawControl("bl", t, l, o, a + n, e), this._drawControl("br", t, l, o + r, a + n, e), this.get("lockUniScaling") || (this._drawControl("mt", t, l, o + r / 2, a, e), this._drawControl("mb", t, l, o + r / 2, a + n, e), this._drawControl("mr", t, l, o + r, a + n / 2, e), this._drawControl("ml", t, l, o, a + n / 2, e)), c && this._drawControl("mtr", t, l, o + r / 2, a - this.rotatingPointOffset, e), t.restore(), this
            },
            _drawControl: function (t, e, i, r, n, s) {
                if (s = s || {}, this.isControlVisible(t)) {
                    var o = this.cornerSize,
                        a = !this.transparentCorners && this.cornerStrokeColor;
                    switch (s.cornerStyle || this.cornerStyle) {
                        case "circle":
                            e.beginPath(), e.arc(r + o / 2, n + o / 2, o / 2, 0, 2 * Math.PI, !1), e[i](), a && e.stroke();
                            break;
                        default:
                            this.transparentCorners || e.clearRect(r, n, o, o), e[i + "Rect"](r, n, o, o), a && e.strokeRect(r, n, o, o)
                    }
                }
            },
            isControlVisible: function (t) {
                return this._getControlsVisibility()[t]
            },
            setControlVisible: function (t, e) {
                return this._getControlsVisibility()[t] = e, this
            },
            setControlsVisibility: function (t) {
                for (var e in t || (t = {}), t) this.setControlVisible(e, t[e]);
                return this
            },
            _getControlsVisibility: function () {
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
            },
            onDeselect: function () {},
            onSelect: function () {}
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        FX_DURATION: 500,
        fxCenterObjectH: function (e, t) {
            var i = function () {},
                r = (t = t || {}).onComplete || i,
                n = t.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: e.left,
                endValue: this.getCenter().left,
                duration: this.FX_DURATION,
                onChange: function (t) {
                    e.set("left", t), s.requestRenderAll(), n()
                },
                onComplete: function () {
                    e.setCoords(), r()
                }
            }), this
        },
        fxCenterObjectV: function (e, t) {
            var i = function () {},
                r = (t = t || {}).onComplete || i,
                n = t.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: e.top,
                endValue: this.getCenter().top,
                duration: this.FX_DURATION,
                onChange: function (t) {
                    e.set("top", t), s.requestRenderAll(), n()
                },
                onComplete: function () {
                    e.setCoords(), r()
                }
            }), this
        },
        fxRemove: function (e, t) {
            var i = function () {},
                r = (t = t || {}).onComplete || i,
                n = t.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: e.opacity,
                endValue: 0,
                duration: this.FX_DURATION,
                onChange: function (t) {
                    e.set("opacity", t), s.requestRenderAll(), n()
                },
                onComplete: function () {
                    s.remove(e), r()
                }
            }), this
        }
    }), fabric.util.object.extend(fabric.Object.prototype, {
        animate: function () {
            if (arguments[0] && "object" == typeof arguments[0]) {
                var t, e, i = [];
                for (t in arguments[0]) i.push(t);
                for (var r = 0, n = i.length; r < n; r++) t = i[r], e = r !== n - 1, this._animate(t, arguments[0][t], arguments[1], e)
            } else this._animate.apply(this, arguments);
            return this
        },
        _animate: function (r, t, n, s) {
            var o, a = this;
            t = t.toString(), n = n ? fabric.util.object.clone(n) : {}, ~r.indexOf(".") && (o = r.split("."));
            var e = o ? this.get(o[0])[o[1]] : this.get(r);
            "from" in n || (n.from = e), t = ~t.indexOf("=") ? e + parseFloat(t.replace("=", "")) : parseFloat(t), fabric.util.animate({
                startValue: n.from,
                endValue: t,
                byValue: n.by,
                easing: n.easing,
                duration: n.duration,
                abort: n.abort && function () {
                    return n.abort.call(a)
                },
                onChange: function (t, e, i) {
                    o ? a[o[0]][o[1]] = t : a.set(r, t), s || n.onChange && n.onChange(t, e, i)
                },
                onComplete: function (t, e, i) {
                    s || (a.setCoords(), n.onComplete && n.onComplete(t, e, i))
                }
            })
        }
    }),
    function (t) {
        "use strict";
        var s = t.fabric || (t.fabric = {}),
            o = s.util.object.extend,
            r = s.util.object.clone,
            i = {
                x1: 1,
                x2: 1,
                y1: 1,
                y2: 1
            },
            n = s.StaticCanvas.supports("setLineDash");

        function e(t, e) {
            var i = t.origin,
                r = t.axis1,
                n = t.axis2,
                s = t.dimension,
                o = e.nearest,
                a = e.center,
                h = e.farthest;
            return function () {
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
        s.Line ? s.warn("fabric.Line is already defined") : (s.Line = s.util.createClass(s.Object, {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            cacheProperties: s.Object.prototype.cacheProperties.concat("x1", "x2", "y1", "y2"),
            initialize: function (t, e) {
                t || (t = [0, 0, 0, 0]), this.callSuper("initialize", e), this.set("x1", t[0]), this.set("y1", t[1]), this.set("x2", t[2]), this.set("y2", t[3]), this._setWidthHeight(e)
            },
            _setWidthHeight: function (t) {
                t || (t = {}), this.width = Math.abs(this.x2 - this.x1), this.height = Math.abs(this.y2 - this.y1), this.left = "left" in t ? t.left : this._getLeftToOriginX(), this.top = "top" in t ? t.top : this._getTopToOriginY()
            },
            _set: function (t, e) {
                return this.callSuper("_set", t, e), void 0 !== i[t] && this._setWidthHeight(), this
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
            _render: function (t) {
                if (t.beginPath(), !this.strokeDashArray || this.strokeDashArray && n) {
                    var e = this.calcLinePoints();
                    t.moveTo(e.x1, e.y1), t.lineTo(e.x2, e.y2)
                }
                t.lineWidth = this.strokeWidth;
                var i = t.strokeStyle;
                t.strokeStyle = this.stroke || t.fillStyle, this.stroke && this._renderStroke(t), t.strokeStyle = i
            },
            _renderDashedStroke: function (t) {
                var e = this.calcLinePoints();
                t.beginPath(), s.util.drawDashedLine(t, e.x1, e.y1, e.x2, e.y2, this.strokeDashArray), t.closePath()
            },
            _findCenterFromElement: function () {
                return {
                    x: (this.x1 + this.x2) / 2,
                    y: (this.y1 + this.y2) / 2
                }
            },
            toObject: function (t) {
                return o(this.callSuper("toObject", t), this.calcLinePoints())
            },
            _getNonTransformedDimensions: function () {
                var t = this.callSuper("_getNonTransformedDimensions");
                return "butt" === this.strokeLineCap && (0 === this.width && (t.y -= this.strokeWidth), 0 === this.height && (t.x -= this.strokeWidth)), t
            },
            calcLinePoints: function () {
                var t = this.x1 <= this.x2 ? -1 : 1,
                    e = this.y1 <= this.y2 ? -1 : 1,
                    i = t * this.width * .5,
                    r = e * this.height * .5;
                return {
                    x1: i,
                    x2: t * this.width * -.5,
                    y1: r,
                    y2: e * this.height * -.5
                }
            },
            _toSVG: function () {
                var t = this.calcLinePoints();
                return ["<line ", "COMMON_PARTS", 'x1="', t.x1, '" y1="', t.y1, '" x2="', t.x2, '" y2="', t.y2, '" />\n']
            }
        }), s.Line.ATTRIBUTE_NAMES = s.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")), s.Line.fromElement = function (t, e, i) {
            i = i || {};
            var r = s.parseAttributes(t, s.Line.ATTRIBUTE_NAMES),
                n = [r.x1 || 0, r.y1 || 0, r.x2 || 0, r.y2 || 0];
            e(new s.Line(n, o(r, i)))
        }, s.Line.fromObject = function (t, e) {
            var i = r(t, !0);
            i.points = [t.x1, t.y1, t.x2, t.y2], s.Object._fromObject("Line", i, function (t) {
                delete t.points, e && e(t)
            }, "points")
        })
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var a = t.fabric || (t.fabric = {}),
            h = Math.PI;
        a.Circle ? a.warn("fabric.Circle is already defined.") : (a.Circle = a.util.createClass(a.Object, {
            type: "circle",
            radius: 0,
            startAngle: 0,
            endAngle: 2 * h,
            cacheProperties: a.Object.prototype.cacheProperties.concat("radius", "startAngle", "endAngle"),
            _set: function (t, e) {
                return this.callSuper("_set", t, e), "radius" === t && this.setRadius(e), this
            },
            toObject: function (t) {
                return this.callSuper("toObject", ["radius", "startAngle", "endAngle"].concat(t))
            },
            _toSVG: function () {
                var t, e = (this.endAngle - this.startAngle) % (2 * h);
                if (0 === e) t = ["<circle ", "COMMON_PARTS", 'cx="0" cy="0" ', 'r="', this.radius, '" />\n'];
                else {
                    var i = a.util.cos(this.startAngle) * this.radius,
                        r = a.util.sin(this.startAngle) * this.radius,
                        n = a.util.cos(this.endAngle) * this.radius,
                        s = a.util.sin(this.endAngle) * this.radius,
                        o = h < e ? "1" : "0";
                    t = ['<path d="M ' + i + " " + r, " A " + this.radius + " " + this.radius, " 0 ", +o + " 1", " " + n + " " + s, '" ', "COMMON_PARTS", " />\n"]
                }
                return t
            },
            _render: function (t) {
                t.beginPath(), t.arc(0, 0, this.radius, this.startAngle, this.endAngle, !1), this._renderPaintInOrder(t)
            },
            getRadiusX: function () {
                return this.get("radius") * this.get("scaleX")
            },
            getRadiusY: function () {
                return this.get("radius") * this.get("scaleY")
            },
            setRadius: function (t) {
                return this.radius = t, this.set("width", 2 * t).set("height", 2 * t)
            }
        }), a.Circle.ATTRIBUTE_NAMES = a.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")), a.Circle.fromElement = function (t, e) {
            var i, r = a.parseAttributes(t, a.Circle.ATTRIBUTE_NAMES);
            if (!("radius" in (i = r) && 0 <= i.radius)) throw new Error("value of `r` attribute is required and can not be negative");
            r.left = (r.left || 0) - r.radius, r.top = (r.top || 0) - r.radius, e(new a.Circle(r))
        }, a.Circle.fromObject = function (t, e) {
            return a.Object._fromObject("Circle", t, e)
        })
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var r = t.fabric || (t.fabric = {});
        r.Triangle ? r.warn("fabric.Triangle is already defined") : (r.Triangle = r.util.createClass(r.Object, {
            type: "triangle",
            width: 100,
            height: 100,
            _render: function (t) {
                var e = this.width / 2,
                    i = this.height / 2;
                t.beginPath(), t.moveTo(-e, i), t.lineTo(0, -i), t.lineTo(e, i), t.closePath(), this._renderPaintInOrder(t)
            },
            _renderDashedStroke: function (t) {
                var e = this.width / 2,
                    i = this.height / 2;
                t.beginPath(), r.util.drawDashedLine(t, -e, i, 0, -i, this.strokeDashArray), r.util.drawDashedLine(t, 0, -i, e, i, this.strokeDashArray), r.util.drawDashedLine(t, e, i, -e, i, this.strokeDashArray), t.closePath()
            },
            _toSVG: function () {
                var t = this.width / 2,
                    e = this.height / 2;
                return ["<polygon ", "COMMON_PARTS", 'points="', [-t + " " + e, "0 " + -e, t + " " + e].join(","), '" />']
            }
        }), r.Triangle.fromObject = function (t, e) {
            return r.Object._fromObject("Triangle", t, e)
        })
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var r = t.fabric || (t.fabric = {}),
            e = 2 * Math.PI;
        r.Ellipse ? r.warn("fabric.Ellipse is already defined.") : (r.Ellipse = r.util.createClass(r.Object, {
            type: "ellipse",
            rx: 0,
            ry: 0,
            cacheProperties: r.Object.prototype.cacheProperties.concat("rx", "ry"),
            initialize: function (t) {
                this.callSuper("initialize", t), this.set("rx", t && t.rx || 0), this.set("ry", t && t.ry || 0)
            },
            _set: function (t, e) {
                switch (this.callSuper("_set", t, e), t) {
                    case "rx":
                        this.rx = e, this.set("width", 2 * e);
                        break;
                    case "ry":
                        this.ry = e, this.set("height", 2 * e)
                }
                return this
            },
            getRx: function () {
                return this.get("rx") * this.get("scaleX")
            },
            getRy: function () {
                return this.get("ry") * this.get("scaleY")
            },
            toObject: function (t) {
                return this.callSuper("toObject", ["rx", "ry"].concat(t))
            },
            _toSVG: function () {
                return ["<ellipse ", "COMMON_PARTS", 'cx="0" cy="0" ', 'rx="', this.rx, '" ry="', this.ry, '" />\n']
            },
            _render: function (t) {
                t.beginPath(), t.save(), t.transform(1, 0, 0, this.ry / this.rx, 0, 0), t.arc(0, 0, this.rx, 0, e, !1), t.restore(), this._renderPaintInOrder(t)
            }
        }), r.Ellipse.ATTRIBUTE_NAMES = r.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")), r.Ellipse.fromElement = function (t, e) {
            var i = r.parseAttributes(t, r.Ellipse.ATTRIBUTE_NAMES);
            i.left = (i.left || 0) - i.rx, i.top = (i.top || 0) - i.ry, e(new r.Ellipse(i))
        }, r.Ellipse.fromObject = function (t, e) {
            return r.Object._fromObject("Ellipse", t, e)
        })
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var s = t.fabric || (t.fabric = {}),
            o = s.util.object.extend;
        s.Rect ? s.warn("fabric.Rect is already defined") : (s.Rect = s.util.createClass(s.Object, {
            stateProperties: s.Object.prototype.stateProperties.concat("rx", "ry"),
            type: "rect",
            rx: 0,
            ry: 0,
            cacheProperties: s.Object.prototype.cacheProperties.concat("rx", "ry"),
            initialize: function (t) {
                this.callSuper("initialize", t), this._initRxRy()
            },
            _initRxRy: function () {
                this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry)
            },
            _render: function (t) {
                var e = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                    i = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                    r = this.width,
                    n = this.height,
                    s = -this.width / 2,
                    o = -this.height / 2,
                    a = 0 !== e || 0 !== i,
                    h = .4477152502;
                t.beginPath(), t.moveTo(s + e, o), t.lineTo(s + r - e, o), a && t.bezierCurveTo(s + r - h * e, o, s + r, o + h * i, s + r, o + i), t.lineTo(s + r, o + n - i), a && t.bezierCurveTo(s + r, o + n - h * i, s + r - h * e, o + n, s + r - e, o + n), t.lineTo(s + e, o + n), a && t.bezierCurveTo(s + h * e, o + n, s, o + n - h * i, s, o + n - i), t.lineTo(s, o + i), a && t.bezierCurveTo(s, o + h * i, s + h * e, o, s + e, o), t.closePath(), this._renderPaintInOrder(t)
            },
            _renderDashedStroke: function (t) {
                var e = -this.width / 2,
                    i = -this.height / 2,
                    r = this.width,
                    n = this.height;
                t.beginPath(), s.util.drawDashedLine(t, e, i, e + r, i, this.strokeDashArray), s.util.drawDashedLine(t, e + r, i, e + r, i + n, this.strokeDashArray), s.util.drawDashedLine(t, e + r, i + n, e, i + n, this.strokeDashArray), s.util.drawDashedLine(t, e, i + n, e, i, this.strokeDashArray), t.closePath()
            },
            toObject: function (t) {
                return this.callSuper("toObject", ["rx", "ry"].concat(t))
            },
            _toSVG: function () {
                return ["<rect ", "COMMON_PARTS", 'x="', -this.width / 2, '" y="', -this.height / 2, '" rx="', this.rx, '" ry="', this.ry, '" width="', this.width, '" height="', this.height, '" />\n']
            }
        }), s.Rect.ATTRIBUTE_NAMES = s.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")), s.Rect.fromElement = function (t, e, i) {
            if (!t) return e(null);
            i = i || {};
            var r = s.parseAttributes(t, s.Rect.ATTRIBUTE_NAMES);
            r.left = r.left || 0, r.top = r.top || 0, r.height = r.height || 0, r.width = r.width || 0;
            var n = new s.Rect(o(i ? s.util.object.clone(i) : {}, r));
            n.visible = n.visible && 0 < n.width && 0 < n.height, e(n)
        }, s.Rect.fromObject = function (t, e) {
            return s.Object._fromObject("Rect", t, e)
        })
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var o = t.fabric || (t.fabric = {}),
            a = o.util.object.extend,
            r = o.util.array.min,
            n = o.util.array.max,
            h = o.util.toFixed;
        o.Polyline ? o.warn("fabric.Polyline is already defined") : (o.Polyline = o.util.createClass(o.Object, {
            type: "polyline",
            points: null,
            cacheProperties: o.Object.prototype.cacheProperties.concat("points"),
            initialize: function (t, e) {
                e = e || {}, this.points = t || [], this.callSuper("initialize", e), this._setPositionDimensions(e)
            },
            _setPositionDimensions: function (t) {
                var e, i = this._calcDimensions(t);
                this.width = i.width, this.height = i.height, t.fromSVG || (e = this.translateToGivenOrigin({
                    x: i.left - this.strokeWidth / 2,
                    y: i.top - this.strokeWidth / 2
                }, "left", "top", this.originX, this.originY)), void 0 === t.left && (this.left = t.fromSVG ? i.left : e.x), void 0 === t.top && (this.top = t.fromSVG ? i.top : e.y), this.pathOffset = {
                    x: i.left + this.width / 2,
                    y: i.top + this.height / 2
                }
            },
            _calcDimensions: function () {
                var t = this.points,
                    e = r(t, "x") || 0,
                    i = r(t, "y") || 0;
                return {
                    left: e,
                    top: i,
                    width: (n(t, "x") || 0) - e,
                    height: (n(t, "y") || 0) - i
                }
            },
            toObject: function (t) {
                return a(this.callSuper("toObject", t), {
                    points: this.points.concat()
                })
            },
            _toSVG: function () {
                for (var t = [], e = this.pathOffset.x, i = this.pathOffset.y, r = o.Object.NUM_FRACTION_DIGITS, n = 0, s = this.points.length; n < s; n++) t.push(h(this.points[n].x - e, r), ",", h(this.points[n].y - i, r), " ");
                return ["<" + this.type + " ", "COMMON_PARTS", 'points="', t.join(""), '" />\n']
            },
            commonRender: function (t) {
                var e, i = this.points.length,
                    r = this.pathOffset.x,
                    n = this.pathOffset.y;
                if (!i || isNaN(this.points[i - 1].y)) return !1;
                t.beginPath(), t.moveTo(this.points[0].x - r, this.points[0].y - n);
                for (var s = 0; s < i; s++) e = this.points[s], t.lineTo(e.x - r, e.y - n);
                return !0
            },
            _render: function (t) {
                this.commonRender(t) && this._renderPaintInOrder(t)
            },
            _renderDashedStroke: function (t) {
                var e, i;
                t.beginPath();
                for (var r = 0, n = this.points.length; r < n; r++) e = this.points[r], i = this.points[r + 1] || e, o.util.drawDashedLine(t, e.x, e.y, i.x, i.y, this.strokeDashArray)
            },
            complexity: function () {
                return this.get("points").length
            }
        }), o.Polyline.ATTRIBUTE_NAMES = o.SHARED_ATTRIBUTES.concat(), o.Polyline.fromElementGenerator = function (s) {
            return function (t, e, i) {
                if (!t) return e(null);
                i || (i = {});
                var r = o.parsePointsAttribute(t.getAttribute("points")),
                    n = o.parseAttributes(t, o[s].ATTRIBUTE_NAMES);
                n.fromSVG = !0, e(new o[s](r, a(n, i)))
            }
        }, o.Polyline.fromElement = o.Polyline.fromElementGenerator("Polyline"), o.Polyline.fromObject = function (t, e) {
            return o.Object._fromObject("Polyline", t, e, "points")
        })
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var i = t.fabric || (t.fabric = {});
        i.Polygon ? i.warn("fabric.Polygon is already defined") : (i.Polygon = i.util.createClass(i.Polyline, {
            type: "polygon",
            _render: function (t) {
                this.commonRender(t) && (t.closePath(), this._renderPaintInOrder(t))
            },
            _renderDashedStroke: function (t) {
                this.callSuper("_renderDashedStroke", t), t.closePath()
            }
        }), i.Polygon.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat(), i.Polygon.fromElement = i.Polyline.fromElementGenerator("Polygon"), i.Polygon.fromObject = function (t, e) {
            return i.Object._fromObject("Polygon", t, e, "points")
        })
    }("undefined" != typeof exports ? exports : this),
    function (t) {
        "use strict";
        var m = t.fabric || (t.fabric = {}),
            b = m.util.array.min,
            _ = m.util.array.max,
            n = m.util.object.extend,
            r = Object.prototype.toString,
            p = m.util.drawArc,
            e = m.util.toFixed,
            y = {
                m: 2,
                l: 2,
                h: 1,
                v: 1,
                c: 6,
                s: 4,}
    }