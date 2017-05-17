"use strict";
exports.__esModule = true;
var VideoGL = (function () {
    function VideoGL(canvas) {
        this.canvas = canvas;
        this.gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        this.program = null;
        this.vertex = null;
        this.vertexBuffer = this.gl.createBuffer();
        this.uv = null;
        this.uvBuffer = this.gl.createBuffer();
    }
    VideoGL.prototype.setupShaderFromSource = function (vertSrc, fragSrc, pjName, pjMatrix) {
        this.program = this._createProgram(this._createShaderFromSource('x-shader/x-vertex', vertSrc), this._createShaderFromSource('x-shader/x-fragment', fragSrc));
        this.useProgram();
        var pjLocation = this.gl.getUniformLocation(this.program, pjName);
        this.gl.uniformMatrix4fv(pjLocation, false, pjMatrix);
        this.setMvMatrix(VideoGL.createMat4Identity());
    };
    // texture自体をつくっておく。
    VideoGL.prototype.createTexture = function (textureId, id, data) {
        this.gl.activeTexture(textureId);
        var texture = id;
        if (id == null) {
            texture = this.gl.createTexture();
        }
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.pixelStorei(this.gl.PACK_ALIGNMENT, 1);
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        if (data instanceof HTMLVideoElement) {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        }
        else if (data instanceof HTMLCanvasElement) {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        }
        else if (data == null) {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        }
        else {
            this.gl.deleteTexture(texture);
            return 0;
        }
        return texture;
    };
    VideoGL.prototype.createArrayTexture = function (textureId, id, data, format, width, height) {
        this.gl.activeTexture(textureId);
        var texture = id;
        if (id == null) {
            texture = this.gl.createTexture();
        }
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.pixelStorei(this.gl.PACK_ALIGNMENT, 1);
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, format, width, height, 0, format, this.gl.UNSIGNED_BYTE, data);
        return texture;
    };
    VideoGL.prototype.bindTexture = function (textureId, texture) {
        this.gl.activeTexture(textureId);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    };
    VideoGL.prototype.drawArrays = function () {
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
    };
    // vertexやuvの構成要素は2に固定しておく。
    VideoGL.prototype.setVertex = function (vertex) {
        this.vertex = new Float32Array(vertex);
    };
    VideoGL.prototype.setUv = function (uv) {
        this.uv = new Float32Array(uv);
    };
    VideoGL.prototype.flush = function () {
        this.gl.flush();
    };
    VideoGL.prototype.uniform1i = function (location, val) {
        this.gl.uniform1i(location, val);
    };
    VideoGL.prototype.uniform1f = function (location, val) {
        this.gl.uniform1f(location, val);
    };
    // mvMatrixを更新する。
    VideoGL.prototype.setMvMatrix = function (mvMatrix) {
        this.mvMatrix = mvMatrix;
    };
    // 現在保持しているprogramを使うように設定する。
    VideoGL.prototype.useProgram = function () {
        this.gl.useProgram(this.program);
    };
    // vertexとuvの情報を保持しているもので更新する。
    VideoGL.prototype.updateVertexUv = function (posName, uvName) {
        var attrPosLocation = this.gl.getAttribLocation(this.program, posName);
        this.gl.enableVertexAttribArray(attrPosLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertex, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(attrPosLocation, 2, this.gl.FLOAT, false, 0, 0);
        var attrUVLocation = this.gl.getAttribLocation(this.program, uvName);
        this.gl.enableVertexAttribArray(attrUVLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.uv, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(attrUVLocation, 2, this.gl.FLOAT, false, 0, 0);
    };
    // 描画領域を今保持しているviewportにする。
    VideoGL.prototype.viewport = function () {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    };
    VideoGL.prototype.updateMvMatrix = function (mvName) {
        var mvLocation = this.gl.getUniformLocation(this.program, mvName);
        this.gl.uniformMatrix4fv(mvLocation, false, this.mvMatrix);
    };
    VideoGL.prototype.clear = function () {
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    };
    VideoGL.prototype.getUniformLocation = function (name) {
        return this.gl.getUniformLocation(this.program, name);
    };
    VideoGL.prototype.refProgram = function () {
        return this.program;
    };
    VideoGL.prototype.refGl = function () {
        return this.gl;
    };
    VideoGL.prototype._createShaderFromSource = function (type, src) {
        if (this.gl == null) {
            return null;
        }
        var shader;
        switch (type) {
            case 'x-shader/x-vertex':
                shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                break;
            case 'x-shader/x-fragment':
                shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                break;
            default:
                return null;
        }
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);
        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        }
        else {
            console.log(this.gl.getShaderInfoLog(shader));
            return null;
        }
    };
    VideoGL.prototype._createProgram = function (vs, fs) {
        if (this.gl == null) {
            return null;
        }
        var program = this.gl.createProgram();
        this.gl.attachShader(program, vs);
        this.gl.attachShader(program, fs);
        this.gl.linkProgram(program);
        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            return program;
        }
        else {
            console.log(this.gl.getProgramInfoLog(program));
            return null;
        }
    };
    VideoGL.createMat4Ortho = function (left, right, bottom, top, near, far) {
        var rl = right - left;
        var tb = top - bottom;
        var fn = far - near;
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(far + near) / (far - near);
        return new Float32Array([
            2.0 / rl, 0.0, 0.0, tx,
            0.0, 2.0 / tb, 0.0, ty,
            0.0, 0.0, 2.0 / fn, tz,
            0.0, 0.0, 0.0, 1.0
        ]);
    };
    VideoGL.createMat4Identity = function () {
        return new Float32Array([
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
    };
    return VideoGL;
}());
exports.VideoGL = VideoGL;
