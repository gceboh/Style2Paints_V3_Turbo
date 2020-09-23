require = function i(r, d, l) {
    function c(o, e) {
        if (!d[o]) {
            if (!r[o]) {
                var n = "function" == typeof require && require;
                if (!e && n)
                    return n(o, !0);
                if (w)
                    return w(o, !0);
                var t = new Error("Cannot find module '" + o + "'");
                throw t.code = "MODULE_NOT_FOUND",
                t
            }
            var a = d[o] = {
                exports: {}
            };
            r[o][0].call(a.exports, function(e) {
                var n = r[o][1][e];
                return c(n || e)
            }, a, a.exports, i, r, d, l)
        }
        return d[o].exports
    }
    for (var w = "function" == typeof require && require, e = 0; e < l.length; e++)
        c(l[e]);
    return c
}({
    CreativeCanvas: [function(e, n, o) {
        "use strict";
        var t, pe;
        cc._RF.push(n, "c89e5LU6wtMhZl7lEzU0ob/", "CreativeCanvas"),
        n.exports = ((pe = Object()).spriteFrame = new cc.SpriteFrame,
        pe.texture2d = null,
        pe.gird_spriteFrame = new cc.SpriteFrame,
        pe.gird_texture2d = null,
        pe.canvas = document.createElement("canvas"),
        pe.canvas.id = "canvas_" + t,
        pe.gird_canvas = document.createElement("canvas"),
        pe.gird_canvas.id = "gird_canvas_" + t,
        pe.latent_canvas = document.createElement("canvas"),
        pe.latent_canvas.id = "latent_canvas_" + t,
        pe.current_index = 0,
        pe.points_XYRGBR = [],
        pe.cache = [],
        pe.in_drag = !1,
        pe.in_paint = !1,
        pe.in_erase = !1,
        pe.finalData = null,
        pe.add_log = function() {
            var e = []
              , n = !0
              , o = !1
              , t = void 0;
            try {
                for (var a, i = pe.points_XYRGBR[Symbol.iterator](); !(n = (a = i.next()).done); n = !0) {
                    var r = a.value
                      , d = []
                      , l = !0
                      , c = !1
                      , w = void 0;
                    try {
                        for (var s, u = r[Symbol.iterator](); !(l = (s = u.next()).done); l = !0) {
                            var g = s.value;
                            d.push(g)
                        }
                    } catch (e) {
                        c = !0,
                        w = e
                    } finally {
                        try {
                            !l && u.return && u.return()
                        } finally {
                            if (c)
                                throw w
                        }
                    }
                    e.push(d)
                }
            } catch (e) {
                o = !0,
                t = e
            } finally {
                try {
                    !n && i.return && i.return()
                } finally {
                    if (o)
                        throw t
                }
            }
            pe.cache.push(e)
        }
        ,
        pe.undo = function() {
            if (0 < pe.cache.length) {
                var e = pe.cache.pop();
                pe.points_XYRGBR = e,
                pe.finish()
            }
        }
        ,
        pe.clear_points = function() {
            pe.points_XYRGBR = []
        }
        ,
        pe.add_point = function(e, n, o, t, a, i) {
            pe.points_XYRGBR.push([e, n, o, t, a, i]),
            pe.current_index = pe.points_XYRGBR.length - 1
        }
        ,
        pe.refresh_current_point_index = function(e) {
            for (var n in pe.current_index = -1,
            pe.points_XYRGBR) {
                var o = (pe.points_XYRGBR[n][0] - window.mouseRelativeX) * window.sketchL2Node.width
                  , t = (pe.points_XYRGBR[n][1] - window.mouseRelativeY) * window.sketchL2Node.height
                  , a = 4 * (3 - pe.points_XYRGBR[n][5]) * e;
                o * o + t * t < a * a && (pe.current_index = n)
            }
        }
        ,
        pe.finish = function() {
            var e = pe.canvas.getContext("2d")
              , n = pe.gird_canvas.getContext("2d")
              , o = window.regulator.absRegulate([window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height], 512);
            pe.canvas.width = o[0],
            pe.canvas.height = o[1],
            e.drawImage(pe.latent_canvas, 0, 0, pe.latent_canvas.width, pe.latent_canvas.height, 0, 0, pe.canvas.width, pe.canvas.height),
            pe.finalData = e.getImageData(0, 0, pe.canvas.width, pe.canvas.height);
            var t = !0
              , a = !1
              , i = void 0;
            try {
                for (var r, d = pe.points_XYRGBR[Symbol.iterator](); !(t = (r = d.next()).done); t = !0) {
                    var l = r.value
                      , c = parseInt(l[0] * pe.finalData.width)
                      , w = parseInt((1 - l[1]) * pe.finalData.height)
                      , s = l[2]
                      , u = l[3]
                      , g = l[4];
                    if (2 == l[5])
                        for (var h = c - 24; h <= c + 24; h++)
                            if (0 <= h && h < pe.finalData.width)
                                for (var v = w - 24; v <= w + 24; v++)
                                    if (0 <= v && v < pe.finalData.height) {
                                        var p = parseInt(4 * (pe.finalData.width * v + h))
                                          , m = Math.sqrt((h - c) * (h - c) + (v - w) * (v - w)) / 24
                                          , _ = Math.pow(1 - m, 1.5);
                                        isNaN(_) && (_ = 0),
                                        pe.finalData.data[p] = s * _ + (1 - _) * pe.finalData.data[p],
                                        pe.finalData.data[p + 1] = u * _ + (1 - _) * pe.finalData.data[p + 1],
                                        pe.finalData.data[p + 2] = g * _ + (1 - _) * pe.finalData.data[p + 2],
                                        pe.finalData.data[p + 3] = 255
                                    }
                }
            } catch (e) {
                a = !0,
                i = e
            } finally {
                try {
                    !t && d.return && d.return()
                } finally {
                    if (a)
                        throw i
                }
            }
            e.putImageData(pe.finalData, 0, 0),
            pe.gird_canvas.width = parseInt(pe.canvas.width),
            pe.gird_canvas.height = parseInt(pe.canvas.height),
            n.fillStyle = "rgba(0,0,0,0)",
            n.fillRect(0, 0, pe.gird_canvas.width, pe.gird_canvas.height);
            for (var f = window.regulator.absRegulate([window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height], 7), C = parseInt(pe.gird_canvas.width / (2 * f[0])), N = C; N < pe.gird_canvas.width; N += 2 * C)
                n.putImageData(e.getImageData(N - 1, 0, 3, pe.canvas.height), N - 1, 0);
            for (var I = parseInt(pe.gird_canvas.height / (2 * f[1])), S = I; S < pe.gird_canvas.height; S += 2 * I)
                n.putImageData(e.getImageData(0, S - 1, pe.canvas.width, 3), 0, S - 1);
            var R, b, y, k, x, T, L, D, F = function(e, n, o, t, a, i, r, d) {
                e.beginPath(),
                e.strokeStyle = "rgba(" + a.toString() + "," + i.toString() + "," + r.toString() + ",1.0)",
                e.lineWidth = d,
                e.arc(n, o, t, 0, 2 * Math.PI),
                e.stroke(),
                e.closePath()
            }, O = function(e) {
                var n = [];
                for (var o in pe.points_XYRGBR)
                    0 == pe.points_XYRGBR[o][5] && n.push(o);
                for (var a = e[0], i = e[1], t = function(e) {
                    var n = pe.points_XYRGBR[e][0]
                      , o = pe.points_XYRGBR[e][1]
                      , t = (a - n) * (a - n) + (i - o) * (i - o);
                    return 0 == t && (t = 65535458),
                    t
                }, r = 0; r < n.length - 1; r++)
                    for (var d = 0; d < n.length - 1 - r; d++)
                        if (t(n[d]) > t(n[d + 1])) {
                            var l = n[d];
                            n[d] = n[d + 1],
                            n[d + 1] = l
                        }
                return n
            }, P = !0, Y = !1, X = void 0;
            try {
                for (var B, z = pe.points_XYRGBR[Symbol.iterator](); !(P = (B = z.next()).done); P = !0) {
                    var E = B.value;
                    if (c = parseInt(E[0] * pe.gird_canvas.width),
                    w = parseInt((1 - E[1]) * pe.gird_canvas.height),
                    s = E[2],
                    u = E[3],
                    g = E[4],
                    0 == E[5]) {
                        var j = 65535
                          , M = O(E);
                        for (var G in M) {
                            if (2 < G)
                                break;
                            var U = pe.points_XYRGBR[M[G]]
                              , q = parseInt(U[0] * pe.gird_canvas.width)
                              , A = parseInt((1 - U[1]) * pe.gird_canvas.height)
                              , H = U[2]
                              , W = U[3]
                              , K = U[4];
                            if (0 == U[5]) {
                                e.beginPath();
                                var Q = e.createLinearGradient(c, w, q, A);
                                Q.addColorStop(0, "rgba(" + (255 - s).toString() + "," + (255 - u).toString() + "," + (255 - g).toString() + ",1.0)"),
                                Q.addColorStop(1, "rgba(" + (255 - H).toString() + "," + (255 - W).toString() + "," + (255 - K).toString() + ",1.0)");
                                var Z = e.createLinearGradient(c, w, q, A);
                                Z.addColorStop(0, "rgba(" + s.toString() + "," + u.toString() + "," + g.toString() + ",1.0)"),
                                Z.addColorStop(1, "rgba(" + H.toString() + "," + W.toString() + "," + K.toString() + ",1.0)"),
                                e.strokeStyle = Z,
                                e.lineWidth = 5,
                                e.moveTo(c, w),
                                e.lineTo(q, A),
                                e.stroke(),
                                e.strokeStyle = Q,
                                e.lineWidth = 1,
                                e.moveTo(c, w),
                                e.lineTo(q, A),
                                e.stroke(),
                                e.closePath();
                                var J = Math.sqrt((c - q) * (c - q) + (w - A) * (w - A));
                                0 < J && J < j && (j = J)
                            }
                        }
                        65535 == j ? j = 256 : j /= 2,
                        b = c,
                        y = w,
                        k = j,
                        x = s,
                        T = u,
                        L = g,
                        D = 1,
                        (R = n).beginPath(),
                        R.strokeStyle = "rgba(" + x.toString() + "," + T.toString() + "," + L.toString() + ",1.0)",
                        R.lineWidth = D + 4,
                        R.moveTo(b - k, y),
                        R.lineTo(b + k, y),
                        R.moveTo(b, y - k),
                        R.lineTo(b, y + k),
                        R.stroke(),
                        R.strokeStyle = "rgba(" + (255 - x).toString() + "," + (255 - T).toString() + "," + (255 - L).toString() + ",1.0)",
                        R.lineWidth = D,
                        R.moveTo(b - k, y),
                        R.lineTo(b + k, y),
                        R.moveTo(b, y - k),
                        R.lineTo(b, y + k),
                        R.stroke(),
                        R.closePath(),
                        F(n, c, w, j, s, u, g, 5),
                        F(n, c, w, j, 255 - s, 255 - u, 255 - g, 1),
                        F(e, c, w, j, s, u, g, 5),
                        F(e, c, w, j, 255 - s, 255 - u, 255 - g, 1)
                    }
                }
            } catch (e) {
                Y = !0,
                X = e
            } finally {
                try {
                    !P && z.return && z.return()
                } finally {
                    if (Y)
                        throw X
                }
            }
            var V = !0
              , $ = !1
              , ee = void 0;
            try {
                for (var ne, oe = pe.points_XYRGBR[Symbol.iterator](); !(V = (ne = oe.next()).done); V = !0) {
                    var te = ne.value;
                    c = parseInt(te[0] * pe.gird_canvas.width),
                    w = parseInt((1 - te[1]) * pe.gird_canvas.height),
                    s = te[2],
                    u = te[3],
                    g = te[4],
                    0 == te[5] && (n.strokeStyle = "rgba(" + (255 - s).toString() + "," + (255 - u).toString() + "," + (255 - g).toString() + ",1.0)",
                    n.fillStyle = "rgba(" + s.toString() + "," + u.toString() + "," + g.toString() + ",1.0)",
                    n.beginPath(),
                    n.moveTo(c - 10, w),
                    n.lineTo(c, w - 10),
                    n.lineTo(c + 10, w),
                    n.lineTo(c, w + 10),
                    n.closePath(),
                    n.fill(),
                    n.stroke(),
                    e.strokeStyle = "rgba(" + (255 - s).toString() + "," + (255 - u).toString() + "," + (255 - g).toString() + ",1.0)",
                    e.fillStyle = "rgba(" + s.toString() + "," + u.toString() + "," + g.toString() + ",1.0)",
                    e.beginPath(),
                    e.moveTo(c - 10, w),
                    e.lineTo(c, w - 10),
                    e.lineTo(c + 10, w),
                    e.lineTo(c, w + 10),
                    e.closePath(),
                    e.fill(),
                    e.stroke())
                }
            } catch (e) {
                $ = !0,
                ee = e
            } finally {
                try {
                    !V && oe.return && oe.return()
                } finally {
                    if ($)
                        throw ee
                }
            }
            var ae = !0
              , ie = !1
              , re = void 0;
            try {
                for (var de, le = pe.points_XYRGBR[Symbol.iterator](); !(ae = (de = le.next()).done); ae = !0) {
                    var ce = de.value;
                    c = parseInt(ce[0] * pe.gird_canvas.width),
                    w = parseInt((1 - ce[1]) * pe.gird_canvas.height),
                    s = ce[2],
                    u = ce[3],
                    g = ce[4],
                    1 == ce[5] && (n.strokeStyle = "rgba(" + (255 - s).toString() + "," + (255 - u).toString() + "," + (255 - g).toString() + ",1.0)",
                    n.fillStyle = "rgba(" + s.toString() + "," + u.toString() + "," + g.toString() + ",1.0)",
                    n.beginPath(),
                    n.moveTo(c - 10, w),
                    n.lineTo(c, w - 10),
                    n.lineTo(c + 10, w),
                    n.lineTo(c, w + 10),
                    n.closePath(),
                    n.fill(),
                    n.stroke(),
                    e.strokeStyle = "rgba(" + (255 - s).toString() + "," + (255 - u).toString() + "," + (255 - g).toString() + ",1.0)",
                    e.fillStyle = "rgba(" + s.toString() + "," + u.toString() + "," + g.toString() + ",1.0)",
                    e.beginPath(),
                    e.moveTo(c - 10, w),
                    e.lineTo(c, w - 10),
                    e.lineTo(c + 10, w),
                    e.lineTo(c, w + 10),
                    e.closePath(),
                    e.fill(),
                    e.stroke())
                }
            } catch (e) {
                ie = !0,
                re = e
            } finally {
                try {
                    !ae && le.return && le.return()
                } finally {
                    if (ie)
                        throw re
                }
            }
            var we = !0
              , se = !1
              , ue = void 0;
            try {
                for (var ge, he = pe.points_XYRGBR[Symbol.iterator](); !(we = (ge = he.next()).done); we = !0) {
                    var ve = ge.value;
                    c = parseInt(ve[0] * pe.gird_canvas.width),
                    w = parseInt((1 - ve[1]) * pe.gird_canvas.height),
                    s = ve[2],
                    u = ve[3],
                    g = ve[4],
                    2 == ve[5] && (n.strokeStyle = "rgba(" + (255 - s).toString() + "," + (255 - u).toString() + "," + (255 - g).toString() + ",1.0)",
                    n.fillStyle = "rgba(" + s.toString() + "," + u.toString() + "," + g.toString() + ",1.0)",
                    n.beginPath(),
                    n.arc(c, w, 6, 0, 2 * Math.PI),
                    n.closePath(),
                    n.fill(),
                    n.stroke(),
                    e.strokeStyle = "rgba(" + (255 - s).toString() + "," + (255 - u).toString() + "," + (255 - g).toString() + ",1.0)",
                    e.fillStyle = "rgba(" + s.toString() + "," + u.toString() + "," + g.toString() + ",1.0)",
                    e.beginPath(),
                    e.arc(c, w, 6, 0, 2 * Math.PI),
                    e.closePath(),
                    e.fill(),
                    e.stroke())
                }
            } catch (e) {
                se = !0,
                ue = e
            } finally {
                try {
                    !we && he.return && he.return()
                } finally {
                    if (se)
                        throw ue
                }
            }
            pe.texture2d = new cc.Texture2D,
            pe.spriteFrame.setTexture(pe.texture2d),
            pe.texture2d.initWithElement(pe.canvas),
            pe.texture2d.handleLoadedTexture(!0),
            pe.gird_texture2d = new cc.Texture2D,
            pe.gird_spriteFrame.setTexture(pe.gird_texture2d),
            pe.gird_texture2d.initWithElement(pe.gird_canvas),
            pe.gird_texture2d.handleLoadedTexture(!0)
        }
        ,
        pe.get_color = function(e, n) {
            if (null == pe.finalData)
                return new cc.color(255,255,255);
            var o = 0;
            return o = parseInt((1 - n) * pe.finalData.height),
            o = parseInt(o * pe.finalData.width),
            o = parseInt(o + e * pe.finalData.width),
            o = parseInt(4 * o),
            new cc.color(pe.finalData.data[o],pe.finalData.data[o + 1],pe.finalData.data[o + 2])
        }
        ,
        pe.update_drag = function() {
            null != pe.finalData && pe.in_drag && (pe.points_XYRGBR[pe.current_index][0] = window.mouseRelativeX,
            pe.points_XYRGBR[pe.current_index][1] = window.mouseRelativeY,
            pe.finish())
        }
        ,
        pe.white_all = function() {
            pe.points_XYRGBR = [],
            pe.finish()
        }
        ,
        pe.load_latent_image = function(e, n, o) {
            pe.latent_canvas.width = parseInt(n),
            pe.latent_canvas.height = parseInt(o);
            var t = pe.latent_canvas.getContext("2d");
            t.drawImage(e, 0, 0, pe.latent_canvas.width, pe.latent_canvas.height),
            pe.latentData = t.getImageData(0, 0, pe.latent_canvas.width, pe.latent_canvas.height),
            pe.finish()
        }
        ,
        pe),
        cc._RF.pop()
    }
    , {}],
    FileInputs: [function(e, n, o) {//create an input element for upload images
        "use strict";
        var t;
        cc._RF.push(n, "c788f2OU/NKK6/I0R+XznYo", "FileInputs"),
        n.exports = ((t = Object()).html_obj = document.createElement("input"),
        t.html_obj.id = "FileSelector",
        t.html_obj.type = "file",
        t.html_obj.accept = "image/*",
        t.html_obj.style.height = "0px",
        t.html_obj.style.display = "block",
        t.html_obj.style.overflow = "hidden",
        document.body.insertBefore(t.html_obj, document.body.firstChild),
        t.actural_callback = null,
        t.url = "",
        t.fake_callback = function(e) {
            void 0 !== window.URL ? t.url = window.URL.createObjectURL(e.target.files[0]) : t.url = window.webkitURL.createObjectURL(e.target.files[0]),
            t.actural_callback(t.url),
            event.target.value = "" //fix bug (can't upload the same sketch)
        }
        ,
        t.html_obj.addEventListener("change", t.fake_callback, !1),
        t.activate = function(e) {
            t.actural_callback = e,
            t.html_obj.click()
        }
        ,
        t),
        cc._RF.pop()
    }
    , {}],
    ImageCanvas: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "b8bf6sez91D6oQuOAmgR3M6", "ImageCanvas"),
        n.exports = function(e) {
            var a = Object();
            return a.spriteFrame = new cc.SpriteFrame,
            a.texture2d = null,
            a.source = null,
            a.canvas = document.createElement("canvas"),
            a.canvas.id = "canvas_" + e,
            a.load_image = function(e, n, o) {
                a.canvas.width = parseInt(n),
                a.canvas.height = parseInt(o);
                var t = a.canvas.getContext("2d");
                return t.drawImage(e, 0, 0, a.canvas.width, a.canvas.height),
                a.source = t.getImageData(0, 0, a.canvas.width, a.canvas.height),
                a.texture2d = new cc.Texture2D,
                a.spriteFrame.setTexture(a.texture2d),
                a.texture2d.initWithElement(a.canvas),
                a.texture2d.handleLoadedTexture(!0),
                a.spriteFrame
            }
            ,
            a.get_color = function(e, n) {
                if (null == a.source)
                    return new cc.color(255,255,255);
                var o = 0;
                return o = parseInt((1 - n) * a.canvas.height),
                o = parseInt(o * a.canvas.width),
                o = parseInt(o + e * a.canvas.width),
                o = parseInt(4 * o),
                new cc.color(a.source.data[o],a.source.data[o + 1],a.source.data[o + 2])
            }
            ,
            a.get_color_adapted = function(e, n) {
                return a.get_color(e, n)
            }
            ,
            a
        }
        ,
        cc._RF.pop()
    }
    , {}],
    ImageLoader: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "5018dv9HLRHNo/vmtt+Vg9u", "ImageLoader"),
        n.exports = function(e) {
            var o = Object()
              , n = "tempDiv" + e
              , t = "imgHead" + e
              , a = document.createElement("div");
            return a.style.position = "absolute",
            a.id = n,
            a.innerHTML = "<img id=" + t + ">",
            a.style.display = "none",
            a.style.visibility = "hidden",
            document.body.appendChild(a),
            o.image = document.getElementById(t),
            o.load_url = function(e, n) {
                o.image.onload = function() {
                    this.complete && setTimeout(function() {
                        n(document.getElementById(t))
                    }, 100)
                }
                ,
                o.image.src = e
            }
            ,
            o
        }
        ,
        cc._RF.pop()
    }
    , {}],
    Interpolation: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "504faRpt0NMu4q5UgZgEYGF", "Interpolation"),
        n.exports = function(e, n, o) {
            var t, a, i, r = function() {
                return function(e, n, o) {
                    return t(n, t(e, o[0][0], o[1][0], o[2][0], o[3][0]), t(e, o[0][1], o[1][1], o[2][1], o[3][1]), t(e, o[0][2], o[1][2], o[2][2], o[3][2]), t(e, o[0][3], o[1][3], o[2][3], o[3][3]))
                }
                ;
                function t(e, n, o, t, a) {
                    return .5 * (t - n + (2 * n - 5 * o + 4 * t - a + (3 * (o - t) + a - n) * e) * e) * e + o
                }
            }(), d = void 0, l = void 0, c = void 0, w = void 0, s = void 0, u = void 0, g = void 0, h = void 0, v = void 0, p = void 0, m = void 0, _ = void 0, f = void 0, C = void 0, N = void 0, I = void 0, S = void 0, R = void 0;
            for (d = 0; d < n.height; ++d) {
                var b = d / o
                  , y = Math.floor(b);
                for (u = 0,
                y < 1 ? u = -1 : y > e.height - 3 && (u = y - (e.height - 3)),
                l = 0; l < n.width; ++l) {
                    var k = l / o
                      , x = Math.floor(k);
                    s = 0,
                    x < 1 ? s = -1 : x > e.width - 3 && (s = x - (e.width - 3)),
                    h = 4 * (y * e.width + x),
                    g = u < 0 ? h : 4 * ((y - 1) * e.width + x),
                    v = 1 < u ? h : 4 * ((y + 1) * e.width + x),
                    p = 0 < u ? v : 4 * ((y + 2) * e.width + x),
                    m = s < (_ = 0) ? _ : -4,
                    f = 1 < s ? _ : 4,
                    C = 0 < s ? f : 8,
                    N = [[e.data[g + m], e.data[h + m], e.data[v + m], e.data[p + m]], [e.data[g + _], e.data[h + _], e.data[v + _], e.data[p + _]], [e.data[g + f], e.data[h + f], e.data[v + f], e.data[p + f]], [e.data[g + C], e.data[h + C], e.data[v + C], e.data[p + C]]],
                    g++,
                    h++,
                    v++,
                    p++,
                    I = [[e.data[g + m], e.data[h + m], e.data[v + m], e.data[p + m]], [e.data[g + _], e.data[h + _], e.data[v + _], e.data[p + _]], [e.data[g + f], e.data[h + f], e.data[v + f], e.data[p + f]], [e.data[g + C], e.data[h + C], e.data[v + C], e.data[p + C]]],
                    g++,
                    h++,
                    v++,
                    p++,
                    S = [[e.data[g + m], e.data[h + m], e.data[v + m], e.data[p + m]], [e.data[g + _], e.data[h + _], e.data[v + _], e.data[p + _]], [e.data[g + f], e.data[h + f], e.data[v + f], e.data[p + f]], [e.data[g + C], e.data[h + C], e.data[v + C], e.data[p + C]]],
                    g++,
                    h++,
                    v++,
                    p++,
                    R = [[e.data[g + m], e.data[h + m], e.data[v + m], e.data[p + m]], [e.data[g + _], e.data[h + _], e.data[v + _], e.data[p + _]], [e.data[g + f], e.data[h + f], e.data[v + f], e.data[p + f]], [e.data[g + C], e.data[h + C], e.data[v + C], e.data[p + C]]],
                    c = k - x,
                    w = b - y;
                    var T = (t = l,
                    a = d,
                    i = n.width,
                    4 * (t + i * a));
                    n.data[T] = r(c, w, N),
                    n.data[T + 1] = r(c, w, I),
                    n.data[T + 2] = r(c, w, S),
                    n.data[T + 3] = r(c, w, R)
                }
            }
        }
        ,
        cc._RF.pop()
    }
    , {}],
    RandomCanvas: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "3bd2bDgImREVo62KWdfmHKP", "RandomCanvas"),
        n.exports = function(e) {
            var l = Object();
            return l.spriteFrame = new cc.SpriteFrame,
            l.texture2d = null,
            l.canvas = document.createElement("canvas"),
            l.canvas.id = "canvas_" + e,
            l.random_canvas = document.createElement("canvas"),
            l.random_canvas.id = "random_canvas_" + e,
            l.load_image = function(e, n, o) {
                return l.canvas.width = parseInt(n),
                l.canvas.height = parseInt(o),
                l.canvas.getContext("2d").drawImage(e, 0, 0, l.canvas.width, l.canvas.height),
                l.texture2d = new cc.Texture2D,
                l.spriteFrame.setTexture(l.texture2d),
                l.texture2d.initWithElement(l.canvas),
                l.texture2d.handleLoadedTexture(!0),
                l.spriteFrame
            }
            ,
            l.randomize = function(e, n) {
                var o = window.regulator.absRegulate([e, n], 12);
                l.random_canvas.width = parseInt(48 * o[0]),
                l.random_canvas.height = parseInt(48 * o[1]);
                var t = l.random_canvas.getContext("2d");
                t.fillStyle = "rgba(0,0,0,0)",
                t.fillRect(0, 0, l.random_canvas.width, l.random_canvas.height);
                for (var a = 0; a < l.random_canvas.width; a += 48)
                    t.drawImage(l.canvas, parseInt(Math.random() * (l.canvas.width - 48)), parseInt(Math.random() * (l.canvas.height - 48)), 48, 48, a, 0, 48, 48);
                for (var i = 0; i < l.random_canvas.width; i += 48)
                    t.drawImage(l.canvas, parseInt(Math.random() * (l.canvas.width - 48)), parseInt(Math.random() * (l.canvas.height - 48)), 48, 48, i, l.random_canvas.height - 48, 48, 48);
                for (var r = 0; r < l.random_canvas.height; r += 48)
                    t.drawImage(l.canvas, parseInt(Math.random() * (l.canvas.width - 48)), parseInt(Math.random() * (l.canvas.height - 48)), 48, 48, 0, r, 48, 48);
                for (var d = 0; d < l.random_canvas.height; d += 48)
                    t.drawImage(l.canvas, parseInt(Math.random() * (l.canvas.width - 48)), parseInt(Math.random() * (l.canvas.height - 48)), 48, 48, l.random_canvas.width - 48, d, 48, 48);
                l.texture2d = new cc.Texture2D,
                l.spriteFrame.setTexture(l.texture2d),
                l.texture2d.initWithElement(l.random_canvas),
                l.texture2d.handleLoadedTexture(!0)
            }
            ,
            l
        }
        ,
        cc._RF.pop()
    }
    , {}],
    SizeRegulator: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "1a798T9wd5BWajxegteCFuW", "SizeRegulator"),
        n.exports.maxRegulate = function(e, n) {
            var o = parseFloat(e[0])
              , t = parseFloat(e[1]);
            return o < t ? n < t && (o *= n / t,
            t = n) : n < o && (t *= n / o,
            o = n),
            [parseInt(o), parseInt(t)]
        }
        ,
        n.exports.absRegulate = function(e, n) {
            var o = parseFloat(e[0])
              , t = parseFloat(e[1]);
            return t < o ? (o *= n / t,
            t = n) : (t *= n / o,
            o = n),
            [parseInt(o), parseInt(t)]
        }
        ,
        n.exports.areaRegulate = function(e, n) {
            var o = parseFloat(e[0])
              , t = parseFloat(e[1])
              , a = parseFloat(n[0] - 64) / o
              , i = parseFloat(n[1]) / t
              , r = Math.min(a, i);
            return o *= r,
            t *= r,
            [parseInt(o), parseInt(t)]
        }
        ,
        cc._RF.pop()
    }
    , {}],
    controller: [function(t, e, n) {
        "use strict";
        cc._RF.push(e, "52382wkDQtAoKouYk9Q5vCo", "controller"),
        cc.Class({
            extends: cc.Component,
            properties: {
                referenceNode: {
                    default: null,
                    type: cc.Node
                },
                paletteNode: {
                    default: null,
                    type: cc.Node
                },
                colorPreviewNode: {
                    default: null,
                    type: cc.Node
                },
                colorSelectedNode: {
                    default: null,
                    type: cc.Node
                },
                sketchL1Node: {
                    default: null,
                    type: cc.Node
                },
                sketchL2Node: {
                    default: null,
                    type: cc.Node
                },
                hintL1Node: {
                    default: null,
                    type: cc.Node
                },
                hintL2Node: {
                    default: null,
                    type: cc.Node
                },
                hintL3Node: {
                    default: null,
                    type: cc.Node
                },
                resultNode: {
                    default: null,
                    type: cc.Node
                },
                sliderNode: {
                    default: null,
                    type: cc.Node
                },
                loadingNode: {
                    default: null,
                    type: cc.Node
                },
                tog1: {
                    default: null,
                    type: cc.Node
                },
                tog2: {
                    default: null,
                    type: cc.Node
                },
                tog3: {
                    default: null,
                    type: cc.Node
                },
                line_enabled: {
                    default: null,
                    type: cc.Toggle
                },
                line_color: {
                    default: null,
                    type: cc.Node
                },
                sample_container: {
                    default: null,
                    type: cc.Node
                },
                default_sample: {
                    default: null,
                    type: cc.Node
                },
                welcome_node: {
                    default: null,
                    type: cc.Node
                },
                logo_node: {
                    default: null,
                    type: cc.Node
                }
            },
            on_slider: function() {
                window.current_referenceAlpha = this.sliderNode.getComponent("cc.Slider").progress,
                window.hasReference || (window.current_referenceAlpha = 0,
                this.sliderNode.getComponent("cc.Slider").progress = 0),
                window.hintL3Node.opacity = parseInt(255 * window.current_referenceAlpha)
            },
            on_home: function() {
                //upload color hints
                var input = document.createElement("input");//create an input for upload json file
                input.type = "file";
                input.accept = "application/json";//accept .json file only
                input.onchange = function(){//when a file has been selected
                    var reader = new FileReader();
                    reader.readAsText(input.files[0], "UTF-8");//read the file
                    reader.onload = function (e) {
                        var json_obj = JSON.parse(e.target.result);//parse json string
                        window.creativeCanvas.points_XYRGBR = json_obj;//load hints array
                        window.creativeCanvas.finish();//update canvas
                    }
                }
                input.click();
                
                //original code for showing samples
                //window.uploading || (window.controller.logo_node.active || (window.controller.welcome_node.active = !window.controller.welcome_node.active),
                //window.controller.logo_node.active = !1)
            },
            on_start: function() {
                window.controller.logo_node.active = !1
            },
            onGithub: function() {
                window.open("https://github.com/lllyasviel/style2paints/tree/master/V3")
            },
            onCD: function() {
                window.open("https://github.com/lllyasviel/style2paints/tree/master/V3")
            },
            onAlter: function() {
				//Save color hints
				if (window.creativeCanvas.points_XYRGBR.length > 0) {
					var hintsFileName="ColorHints-"+ window.current_room +".json";
					generateFileForDownload(hintsFileName,JSON.stringify(window.creativeCanvas.points_XYRGBR));
					
					//Encode string into a text file for download
					function generateFileForDownload(filename, text) {
						var element = document.createElement('a');
						element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
						element.setAttribute('download', filename);
						
						element.style.display = 'none';
						document.body.appendChild(element);
						
						element.click();
						
						document.body.removeChild(element);
					}
                }else{
					alert("No color hint points found! Before saving hints, please add at least one color hint point.");
				}
				
				//original doc link button
                //window.cnzh ? this.onCD() : this.onGithub()
            },
            load_reference_url: function(e) {
                var a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
                window.referenceImageLoader.load_url(e, function(e) {
                    var n = [e.width, e.height]
                      , o = window.regulator.maxRegulate(n, 256)
                      , t = window.regulator.maxRegulate(n, 180);
                    window.referenceSprite.spriteFrame = window.referenceImageCanvas.load_image(e, o[0], o[1]),
                    window.referenceNode.width = t[0],
                    window.referenceNode.height = t[1],
                    window.hintL3Sprite.spriteFrame = window.referenceRandomCanvas.load_image(e, o[0], o[1]),
                    window.referenceRandomCanvas.randomize(window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height),
                    null != a && a()
                })
            },
            load_sketch_url: function(e) {
                var o = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
                window.sketchImageLoader.load_url(e, function(e) {
                    var n = window.regulator.maxRegulate([e.width, e.height], 1024);
                    window.sketchL1Sprite.spriteFrame = window.sketchImageCanvas.load_image(e, n[0], n[1]),
                    window.resultSprite.spriteFrame = window.resultImageCanvas.load_image(e, n[0], n[1]),
                    window.creativeCanvas.load_latent_image(e, n[0], n[1]),
                    window.hasReference && window.referenceRandomCanvas.randomize(window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height),
                    null != o && o()
                })
            },
            load_result_url: function(e) {
                var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
                window.resultImageLoader.load_url(e, function(e) {
                    window.resultSprite.spriteFrame = window.resultImageCanvas.load_image(e, e.width, e.height),
                    null != n && n()
                })
            },
            load_latent_url: function(e) {
                var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
                window.latentImageLoader.load_url(e, function(e) {
                    window.creativeCanvas.load_latent_image(e, e.width, e.height),
                    null != n && n()
                })
            },
            onUploadReferenceClicked: function() {
                window.uploading || null != window.sketchImageCanvas.source && window.fileSelector.activate(function(e) {
                    window.controller.load_reference_url(e, function() {
                        window.hasReference = !0
                    })
                })
            },
            onDownloadClicked: function() {
                "new" != window.current_room && "new" != window.result_id && window.open(window.server_url + "/rooms/" + window.current_room + "/result." + window.result_id + ".jpg")
            },
            requireResult: function() {
                if (!window.uploading && "new" != window.current_room) {
                    window.controller.loadingNode.active = !0,
                    window.controller.loadingNode.getComponent("fake_bar").change("uploading"),
                    window.uploading = !0;
                    var o = new XMLHttpRequest;
                    o.open("POST", window.server_url + "/request_result", !0),
                    o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"),
                    o.upload.onprogress = function(e) {
                        if (e.lengthComputable) {
                            var n = e.loaded / e.total;
                            window.controller.loadingNode.getComponent("fake_bar").change("uploading", n),
                            .8 < n && window.controller.loadingNode.getComponent("fake_bar").change("painting")
                        }
                    }
                    ,
                    o.onreadystatechange = function() {
                        if (4 == o.readyState && 200 == o.status) {
                            window.controller.loadingNode.getComponent("fake_bar").change("downloading");
                            var e = o.responseText.split("_");
                            window.current_room = e[0],
                            window.result_id = e[1],
                            window.current_step = e[1],
                            console.log("get result step id " + window.result_id),
                            window.resultImageCanvas.source = null,
                            window.creativeCanvas.finalData = null;
                            var n = function() {
                                window.controller.loadingNode.getComponent("fake_bar").change("downloading final result"),
                                null != window.resultImageCanvas.source && (window.controller.loadingNode.getComponent("fake_bar").change("downloading final result"),
                                null != window.creativeCanvas.finalData && (window.controller.loadingNode.getComponent("fake_bar").change("downloading final result"),
                                window.controller.loadingNode.active = !1,
                                window.uploading = !1))
                            };
                            window.controller.load_result_url(window.server_url + "/rooms/" + window.current_room + "/result." + window.result_id + ".jpg", n),
                            window.controller.load_latent_url(window.server_url + "/rooms/" + window.current_room + "/composition." + window.current_step + ".jpg", n)
                        } else
                            window.controller.loadingNode.getComponent("fake_bar").change("painting")
                    }
                    ,
                    o.send("room=" + window.current_room + "&step=" + window.current_step + "&reference=" + (window.hasReference ? encodeURIComponent(window.referenceImageCanvas.canvas.toDataURL("image/png")) : "none") + "&options=" + encodeURIComponent(JSON.stringify({
                        alpha: window.current_referenceAlpha,
                        points: window.creativeCanvas.points_XYRGBR,
                        method: window.current_method,
                        lineColor: [window.lcolor.r, window.lcolor.g, window.lcolor.b],
                        line: window.controller.line_enabled.isChecked,
                        hasReference: window.hasReference
                    }))),
                    console.log("request sended")
                }
            },
            onSaveSample: function() {
                var e = new XMLHttpRequest;
                e.open("POST", window.server_url + "/save_as_sample", !0),
                e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"),
                e.send("room=" + window.current_room + "&step=" + window.current_step),
                console.log("SaveSample Sended")
            },
            uploadSketch: function() {
                if (!window.uploading && null != window.sketchImageCanvas.source) {
                    window.controller.welcome_node.active = !1,
                    window.controller.loadingNode.active = !0,
                    window.controller.loadingNode.getComponent("fake_bar").change("uploading"),
                    window.uploading = !0,
                    window.controller.tog1.active = !1,
                    window.controller.tog2.active = !1,
                    window.controller.tog3.active = !1;
                    var n = new XMLHttpRequest;
                    n.open("POST", window.server_url + "/upload_sketch", !0),
                    n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"),
                    n.upload.onprogress = function(e) {
                        if (e.lengthComputable) {
                            var n = e.loaded / e.total;
                            window.controller.loadingNode.getComponent("fake_bar").change("uploading", n),
                            .8 < n && window.controller.loadingNode.getComponent("fake_bar").change("preparing")
                        }
                    }
                    ,
                    n.onreadystatechange = function() {
                        if (4 == n.readyState && 200 == n.status) {
                            window.controller.loadingNode.getComponent("fake_bar").change("downloading");
                            var e = n.responseText.split("_");
                            window.current_room = e[0],
                            window.result_id = e[1],
                            window.current_step = e[1],
                            console.log("get room id " + window.current_room),
                            window.sketchImageCanvas.source = null;
                            window.controller.load_sketch_url(window.server_url + "/rooms/" + window.current_room + "/sketch." + window.current_method + ".jpg", function() {
                                null != window.sketchImageCanvas.source && (window.creativeCanvas.finish(),
                                window.controller.loadingNode.active = !1,
                                window.uploading = !1,
                                window.controller.tog1.active = !0,
                                window.controller.tog2.active = !0,
                                window.controller.tog3.active = !0)
                            })
                        } else
                            window.controller.loadingNode.getComponent("fake_bar").change("preparing")
                    }
                    ,
                    n.send("room=" + window.current_room + "&step=" + window.current_step + "&sketch=" + ("new" == window.current_room ? encodeURIComponent(window.sketchImageCanvas.canvas.toDataURL("image/png")) : "none") + "&method=" + encodeURIComponent(window.current_method)),
                    console.log("sketch uploaded")
                }
            },
            onUploadSketchClicked: function() {
                window.uploading || window.fileSelector.activate(function(e) {
                    window.controller.onClearClicked();//clear canvas
                    window.creativeCanvas.cache = [],
                    window.current_room = "new",
                    window.current_step = "new",
                    window.result_id = "new",
                    window.controller.load_sketch_url(e, window.controller.uploadSketch)
                })
            },
            onLoad: function() {
                window.cnzh = !1,
                window.server_url = "http://127.0.0.1:8000",
                window.server_url = "",
                window.controller = this,
                window.regulator = t("./SizeRegulator"),
                window.fileSelector = t("./FileInputs"),
                window.referenceNode = this.referenceNode,
                window.referenceSprite = this.referenceNode.getComponent("cc.Sprite"),
                window.hasReference = !1,
                window.paletteNode = this.paletteNode,
                window.paletteSprite = this.paletteNode.getComponent("cc.Sprite"),
                window.sketchL1Node = this.sketchL1Node,
                window.sketchL1Sprite = this.sketchL1Node.getComponent("cc.Sprite"),
                window.sketchL2Node = this.sketchL2Node,
                window.sketchL2Sprite = this.sketchL2Node.getComponent("cc.Sprite"),
                window.hintL1Node = this.hintL1Node,
                window.hintL1Sprite = this.hintL1Node.getComponent("cc.Sprite"),
                window.hintL2Node = this.hintL2Node,
                window.hintL2Sprite = this.hintL2Node.getComponent("cc.Sprite"),
                window.hintL3Node = this.hintL3Node,
                window.hintL3Sprite = this.hintL3Node.getComponent("cc.Sprite"),
                window.resultNode = this.resultNode,
                window.resultSprite = this.resultNode.getComponent("cc.Sprite"),
                window.colorPreviewNode = this.colorPreviewNode,
                window.colorSelectedNode = this.colorSelectedNode,
                window.lineColorNode = this.line_color;
                var e = t("./ImageLoader")
                  , n = t("./ImageCanvas")
                  , o = t("./RandomCanvas");
                window.referenceImageLoader = e("referenceImage"),
                window.referenceImageCanvas = n("referenceImage"),
                window.referenceRandomCanvas = o("referenceRandom"),
                window.paletteImageLoader = e("paletteImage"),
                window.paletteImageCanvas = n("paletteImage"),
                window.sketchImageLoader = e("sketchImage"),
                window.sketchImageCanvas = n("sketchImage"),
                window.resultImageLoader = e("resultImage"),
                window.resultImageCanvas = n("resultImage"),
                window.latentImageLoader = e("latentImage"),
                window.creativeCanvas = t("./CreativeCanvas"),
                window.hintL1Sprite.spriteFrame = window.creativeCanvas.spriteFrame,
                window.sketchL2Sprite.spriteFrame = window.creativeCanvas.gird_spriteFrame,
                setTimeout(this.delayed_initialization, 1e3),
                window.sensitiveNodes = [],
                window.sensitiveNodes.push(window.referenceNode),
                window.sensitiveNodes.push(window.paletteNode),
                window.sensitiveNodes.push(window.hintL1Node),
                window.sensitiveNodes.push(window.sketchL2Node),
                window.sensitiveNodes.push(window.resultNode),
                this.node.on("mousemove", function(e) {
                    window.mousePosition = e.getLocation(),
                    window.currentSensitiveNode = null;
                    var n = !0
                      , o = !1
                      , t = void 0;
                    try {
                        for (var a, i = window.sensitiveNodes[Symbol.iterator](); !(n = (a = i.next()).done); n = !0) {
                            var r = a.value
                              , d = r.convertToWorldSpace(r.position)
                              , l = d.x
                              , c = d.y
                              , w = window.mousePosition.x - l
                              , s = window.mousePosition.y - c;
                            0 < w && 0 < s && w < r.width && s < r.height && (window.currentSensitiveNode = r,
                            window.mouseRelativeX = w / r.width,
                            window.mouseRelativeY = s / r.height)
                        }
                    } catch (e) {
                        o = !0,
                        t = e
                    } finally {
                        try {
                            !n && i.return && i.return()
                        } finally {
                            if (o)
                                throw t
                        }
                    }
                    window.controller.onMouseMove()
                }),
                this.node.on("mousedown", function(e) {
                    window.mouseIsDown = !0,
                    window.controller.onMouseDown()
                }),
                this.node.on("mouseup", function(e) {
                    window.mouseIsDown = !1,
                    window.controller.onMouseUp()
                }),
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(e) {
                    e.keyCode == cc.KEY.z && window.creativeCanvas.undo()
                }),
                window.color = new cc.Color,
                window.color.r = 0,
                window.color.g = 0,
                window.color.b = 0,
                window.lcolor = new cc.Color,
                window.lcolor.r = 0,
                window.lcolor.g = 0,
                window.lcolor.b = 0,
                window.CONDITION_ERASER = 0,
                window.CONDITION_POINT0 = 1,
                window.CONDITION_POINT1 = 3,
                window.CONDITION_POINT2 = 4,
                window.current_condition = window.CONDITION_POINT0,
                window.current_method = "colorization",
                window.current_room = "new",
                window.current_step = "new",
                window.result_id = "new",
                window.current_referenceAlpha = 0,
                window.uploading = !1
            },
            on_colorization: function() {
                "colorization" != window.current_method && (window.current_method = "colorization",
                this.uploadSketch())
            },
            on_rendering: function() {
                "rendering" != window.current_method && (window.current_method = "rendering",
                this.uploadSketch())
            },
            on_recolorization: function() {
                "recolorization" != window.current_method && (window.current_method = "recolorization",
                this.uploadSketch())
            },
            on_eraser: function() {
                window.current_condition = window.CONDITION_ERASER
            },
            on_point0: function() {
                window.current_condition = window.CONDITION_POINT0
            },
            on_point1: function() {
                window.current_condition = window.CONDITION_POINT1
            },
            on_point2: function() {
                window.current_condition = window.CONDITION_POINT2
            },
            delayed_initialization: function() {
                window.controller.load_reference_url("res\\raw-assets\\texture\\ring.png"),
                window.paletteImageLoader.load_url("res\\raw-assets\\texture\\palette.png", function(e) {
                    window.paletteSprite.spriteFrame = window.paletteImageCanvas.load_image(e, e.width, e.height),
                    window.paletteNode.width = 650,
                    window.paletteNode.height = 180
                });
                var d = new XMLHttpRequest;
                d.open("POST", window.server_url + "/get_sample_list", !0),
                d.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"),
                d.onreadystatechange = function() {
                    if (4 == d.readyState && 200 == d.status) {
                        var e = JSON.parse(d.responseText);
                        for (var n in e) {
                            var o = cc.instantiate(window.controller.default_sample);
                            o.name = e[n],
                            o.parent = window.controller.sample_container;
                            var t = parseInt(n % 13)
                              , a = parseInt(n / 13);
                            o.setPosition(28 + 165 * t, -28 - 150 * a);
                            var i = new cc.SpriteFrame
                              , r = cc.textureCache.addImage(window.server_url + "/samples/" + e[n] + "/icon.sample.jpg");
                            i.setTexture(r),
                            o.getChildByName("img").getComponent(cc.Sprite).spriteFrame = i
                        }
                    }
                }
                ,
                d.send()
            },
            onSample: function(e) {
                var n = e.currentTarget.name;
                console.log(n),
                window.current_room = n,
                window.current_step = "sample",
                window.controller.welcome_node.active = !1,
                window.controller.loadingNode.active = !0,
                window.controller.loadingNode.getComponent("fake_bar").change("downloading"),
                window.uploading = !0;
                var o = new XMLHttpRequest;
                o.open("GET", window.server_url + "/samples/" + window.current_room + "/options." + window.current_step + ".json", !0),
                o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;"),
                o.onreadystatechange = function() {
                    if (4 == o.readyState && 200 == o.status) {
                        var e = JSON.parse(o.responseText);
                        console.log(e),
                        window.current_method = e.method,
                        "colorization" == window.current_method && (window.controller.tog1.getComponent("cc.Toggle").isChecked = !0,
                        window.controller.tog2.getComponent("cc.Toggle").isChecked = !1,
                        window.controller.tog3.getComponent("cc.Toggle").isChecked = !1),
                        "rendering" == window.current_method && (window.controller.tog1.getComponent("cc.Toggle").isChecked = !1,
                        window.controller.tog2.getComponent("cc.Toggle").isChecked = !0,
                        window.controller.tog3.getComponent("cc.Toggle").isChecked = !1),
                        "recolorization" == window.current_method && (window.controller.tog1.getComponent("cc.Toggle").isChecked = !1,
                        window.controller.tog2.getComponent("cc.Toggle").isChecked = !1,
                        window.controller.tog3.getComponent("cc.Toggle").isChecked = !0),
                        window.controller.line_enabled.isChecked = e.line;
                        var n = new cc.Color;
                        n.r = e.lineColor[0],
                        n.g = e.lineColor[1],
                        n.b = e.lineColor[2],
                        window.lcolor = n,
                        window.controller.line_color.color = n,
                        window.hasReference = e.hasReference,
                        window.hasReference ? window.controller.load_reference_url(window.server_url + "/samples/" + window.current_room + "/reference." + window.current_step + ".jpg") : window.controller.load_reference_url("res\\raw-assets\\texture\\ring.png?t=" + Math.random()),
                        window.current_referenceAlpha = e.alpha,
                        window.controller.sliderNode.getComponent("cc.Slider").progress = window.current_referenceAlpha,
                        window.controller.on_slider(),
                        window.temp_points = e.points,
                        window.creativeCanvas.points_XYRGBR = window.temp_points,
                        window.creativeCanvas.finish(),
                        window.controller.loadingNode.getComponent("fake_bar").change("downloading sketch"),
                        window.controller.load_sketch_url(window.server_url + "/samples/" + window.current_room + "/sketch." + window.current_method + ".jpg", function() {
                            window.controller.loadingNode.getComponent("fake_bar").change("downloading results"),
                            window.controller.load_latent_url(window.server_url + "/samples/" + window.current_room + "/composition." + window.current_step + ".jpg", function() {
                                window.controller.loadingNode.getComponent("fake_bar").change("downloading final results"),
                                window.controller.load_result_url(window.server_url + "/samples/" + window.current_room + "/result." + window.current_step + ".jpg", function() {
                                    window.creativeCanvas.points_XYRGBR = window.temp_points,
                                    window.creativeCanvas.finish(),
                                    window.controller.loadingNode.active = !1,
                                    window.uploading = !1
                                })
                            })
                        })
                    }
                }
                ,
                o.send(),
                console.log("sample request sended")
            },
            onMouseDown: function() {
                null != window.currentSensitiveNode && window.currentSensitiveNode.name == window.sketchL2Node.name && (window.creativeCanvas.add_log(),
                window.creativeCanvas.refresh_current_point_index(1),
                -1 < window.creativeCanvas.current_index ? window.current_condition == window.CONDITION_ERASER ? (window.creativeCanvas.points_XYRGBR.splice(window.creativeCanvas.current_index, 1),
                window.creativeCanvas.finish()) : window.creativeCanvas.in_drag = !0 : (window.current_condition == window.CONDITION_SPRAY && (window.creativeCanvas.in_paint = !0),
                window.current_condition == window.CONDITION_ERASER && (window.creativeCanvas.in_erase = !0),
                window.current_condition == window.CONDITION_POINT0 && (window.creativeCanvas.add_point(window.mouseRelativeX, window.mouseRelativeY, window.color.r, window.color.g, window.color.b, 0),
                window.creativeCanvas.in_drag = !0),
                window.current_condition == window.CONDITION_POINT1 && (window.creativeCanvas.add_point(window.mouseRelativeX, window.mouseRelativeY, window.color.r, window.color.g, window.color.b, 1),
                window.creativeCanvas.in_drag = !0),
                window.current_condition == window.CONDITION_POINT2 && (window.creativeCanvas.add_point(window.mouseRelativeX, window.mouseRelativeY, window.color.r, window.color.g, window.color.b, 2),
                window.creativeCanvas.in_drag = !0)))
            },
            onLineColorChanged: function() {
                window.lcolor = window.colorSelectedNode.color,
                window.lineColorNode.color = window.lcolor
            },
            onMouseUp: function() {
                null != window.currentSensitiveNode && (window.currentSensitiveNode.name == window.referenceNode.name && (window.colorSelectedNode.color = window.colorPreviewNode.color,
                window.color = window.colorPreviewNode.color),
                window.currentSensitiveNode.name == window.paletteNode.name && (window.colorSelectedNode.color = window.colorPreviewNode.color,
                window.color = window.colorPreviewNode.color),
                window.currentSensitiveNode.name == window.hintL1Node.name && (window.colorSelectedNode.color = window.colorPreviewNode.color,
                window.color = window.colorPreviewNode.color),
                window.currentSensitiveNode.name == window.resultNode.name && (window.colorSelectedNode.color = window.colorPreviewNode.color,
                window.color = window.colorPreviewNode.color)),
                window.creativeCanvas.in_drag = !1,
                window.creativeCanvas.in_paint = !1,
                window.creativeCanvas.in_erase = !1
            },
            onMouseMove: function() {
                null != window.currentSensitiveNode ? (document.body.style.cursor = "crosshair",
                window.currentSensitiveNode.name == window.referenceNode.name && (window.colorPreviewNode.color = window.referenceImageCanvas.get_color(window.mouseRelativeX, window.mouseRelativeY)),
                window.currentSensitiveNode.name == window.paletteNode.name && (window.colorPreviewNode.color = window.paletteImageCanvas.get_color(window.mouseRelativeX, window.mouseRelativeY)),
                window.currentSensitiveNode.name == window.hintL1Node.name && (window.colorPreviewNode.color = window.creativeCanvas.get_color(window.mouseRelativeX, window.mouseRelativeY)),
                window.currentSensitiveNode.name == window.resultNode.name && (window.colorPreviewNode.color = window.resultImageCanvas.get_color_adapted(window.mouseRelativeX, window.mouseRelativeY)),
                window.currentSensitiveNode.name == window.sketchL2Node.name && 0 == window.creativeCanvas.in_drag && (window.creativeCanvas.in_erase ? window.creativeCanvas.refresh_current_point_index(4) : window.creativeCanvas.refresh_current_point_index(1),
                -1 < window.creativeCanvas.current_index && (window.creativeCanvas.in_erase ? (window.creativeCanvas.points_XYRGBR.splice(window.creativeCanvas.current_index, 1),
                window.creativeCanvas.finish()) : window.current_condition == window.CONDITION_ERASER ? document.body.style.cursor = "pointer" : document.body.style.cursor = "move"))) : (window.colorPreviewNode.color = window.colorSelectedNode.color,
                document.body.style.cursor = "default")
            },
            update: function(e) {
                var n = [window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height]
                  , o = [this.node.width / 3, this.node.height - 200]
                  , t = window.regulator.areaRegulate(n, o);
                window.sketchL1Node.width = t[0],
                window.sketchL1Node.height = t[1],
                window.sketchL2Node.width = t[0],
                window.sketchL2Node.height = t[1],
                window.hintL1Node.width = t[0],
                window.hintL1Node.height = t[1],
                window.hintL2Node.width = t[0],
                window.hintL2Node.height = t[1],
                window.hintL3Node.width = t[0],
                window.hintL3Node.height = t[1],
                window.resultNode.width = t[0],
                window.resultNode.height = t[1],
                window.creativeCanvas.update_drag()
            },
            onRandomizeClicked: function() {
                window.creativeCanvas.randomize()
            },
            onClearClicked: function() {
                window.creativeCanvas.add_log(),
                window.creativeCanvas.white_all(),
                window.controller.line_enabled.isChecked = !1;
                var e = new cc.Color;
                e.r = 0,
                e.g = 0,
                e.b = 0,
                window.lcolor = e,
                window.controller.line_color.color = e,
                window.hasReference = !1,
                window.controller.load_reference_url("res\\raw-assets\\texture\\ring.png?t=" + Math.random()),
                window.current_referenceAlpha = 0,
                window.controller.sliderNode.getComponent("cc.Slider").progress = 0,
                window.controller.on_slider(),
                window.temp_points = [],
                window.creativeCanvas.points_XYRGBR = [],
                window.creativeCanvas.finish()
            }
        }),
        cc._RF.pop()
    }
    , {
        "./CreativeCanvas": "CreativeCanvas",
        "./FileInputs": "FileInputs",
        "./ImageCanvas": "ImageCanvas",
        "./ImageLoader": "ImageLoader",
        "./RandomCanvas": "RandomCanvas",
        "./SizeRegulator": "SizeRegulator"
    }],
    fake_bar: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "7932fTiQlxGkofY2Uxv03Qv", "fake_bar"),
        cc.Class({
            extends: cc.Component,
            properties: {
                bar: {
                    default: null,
                    type: cc.ProgressBar
                },
                lab: {
                    default: null,
                    type: cc.Label
                }
            },
            change: function(e) {
                var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
                this.bar.progress = n,
                this.lab.string = e
            },
            update: function(e) {
                var n = this.bar.progress;
                1 < (n += .005) && (n = 1),
                this.bar.progress = n
            }
        }),
        cc._RF.pop()
    }
    , {}],
    interLabel: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "641edG9i3tO9rHQz9SjpENW", "interLabel"),
        cc.Class({
            extends: cc.Component,
            properties: {
                chinese: {
                    default: "",
                    type: cc.String,
                    multiline: !0
                },
                japanese: {
                    default: "",
                    type: cc.String,
                    multiline: !0
                },
                english: {
                    default: "",
                    type: cc.String,
                    multiline: !0
                }
            },
            chinese_shift: function() {
                this.getComponent("cc.Label").string = this.chinese
            },
            english_shift: function() {
                this.getComponent("cc.Label").string = this.english
            },
            japanese_shift: function() {
                this.getComponent("cc.Label").string = this.japanese
            }
        }),
        cc._RF.pop()
    }
    , {}],
    language: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "805e3jfnNROT7wZTM7YzUzN", "language"),
        cc.Class({
            extends: cc.Component,
            chinese: function() {
                window.cnzh = !0,
                console.log("chinese");
                for (var e = this.getComponentsInChildren("interLabel"), n = 0; n < e.length; n++)
                    e[n].chinese_shift()
            },
            japanese: function() {
                window.cnzh = !1,
                console.log("japanese");
                for (var e = this.getComponentsInChildren("interLabel"), n = 0; n < e.length; n++)
                    e[n].japanese_shift()
            },
            english: function() {
                window.cnzh = !1,
                console.log("english");
                for (var e = this.getComponentsInChildren("interLabel"), n = 0; n < e.length; n++)
                    e[n].english_shift()
            },
            onLoad: function() {
                this.english(),
                window.cnzh = !1,
                "zh" == navigator.language.substring(0, 2) && (this.chinese(),
                window.cnzh = !0),
                "ja" == navigator.language.substring(0, 2) && this.japanese()
            }
        }),
        cc._RF.pop()
    }
    , {}],
    toggleBTN: [function(e, n, o) {
        "use strict";
        cc._RF.push(n, "39d07eQ9ZJAZZkRmITNDE65", "toggleBTN"),
        cc.Class({
            extends: cc.Component,
            properties: {
                self: {
                    default: null,
                    type: cc.Button
                },
                other1: {
                    default: null,
                    type: cc.Button
                },
                other2: {
                    default: null,
                    type: cc.Button
                }
            },
            shifter: function() {
                this.self.interactable = !1,
                this.other1.interactable = !0,
                this.other2.interactable = !0
            }
        }),
        cc._RF.pop()
    }
    , {}]
}, {}, ["CreativeCanvas", "FileInputs", "ImageCanvas", "ImageLoader", "Interpolation", "RandomCanvas", "SizeRegulator", "controller", "fake_bar", "interLabel", "language", "toggleBTN"]);
