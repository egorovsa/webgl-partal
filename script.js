/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var canvas, gl, vertexPositionLocation;
var resolutionLocation;
var timeLocation, time, startTime;
var vertices = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0
];

function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function getShader(type, id) {
    var source = document.getElementById(id).innerHTML;
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}


function bootstrap() {
    canvas = document.getElementById('canvas');
    gl = canvas.getContext('experimental-webgl');
    resize();
    window.addEventListener('resize', resize);

    var vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');
    var fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);

    resolutionLocation = gl.getUniformLocation(shaderProgram, 'uResolution');
    timeLocation = gl.getUniformLocation(shaderProgram, 'uTime');

    vertexPositionLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(vertexPositionLocation);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0);
    startTime = Date.now();
    render();
}

function drawScene() {
    gl.uniform1f(timeLocation, time);
    gl.uniform2fv(resolutionLocation, [canvas.width, canvas.height]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render() {
    requestAnimationFrame(render);
    time = (Date.now() - startTime) / 1000;
    drawScene();
}