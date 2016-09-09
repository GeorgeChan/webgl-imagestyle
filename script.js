var gl;
var glCanvas;

var GL_TEXTURE = [];

var vertexShader, fragmentShader;
var program;

var effectIndex = 0;
var alphaValue = 0.5;

var attrPosition;
var attrCoord;

var inputImageTextureUniform;
var inputResImageTextureUniform = [];
var effectTypeUniform;
var alphaUniform;

var inputImageTextureId;
var inputResImageTextureIds = [];

var vertexPosition = [
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
     1.0,  1.0,
];

var texturePosition = [
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 0.0
];

var vertexPositionVBO;
var texturePositionVBO;

var loadLayer;

onload = function(){
    loadLayer = layer.load(1, {
        shade: [1.0,'#404040'] //0.1透明度的白色背景
    });
    initCanvas();
    createAllTextures(function () {
        console.log("all texture created");

        createVbo();

        if(!createShader()){
            return;
        }
        if(!createProgram()){
            return;
        }
        gl.useProgram(program);

        initFilter();

        drawCanvas();

        layer.close(loadLayer);
    });
};


function initCanvas(){
    console.log("init canvas");
    glCanvas = document.getElementById('canvas');
    glCanvas.width = glCanvas.offsetWidth;
    glCanvas.height = glCanvas.offsetHeight;
    gl = glCanvas.getContext('webgl') || glCanvas.getContext('experimental-webgl');
    GL_TEXTURE = [
        gl.TEXTURE0,
        gl.TEXTURE1,
        gl.TEXTURE2,
        gl.TEXTURE3,
        gl.TEXTURE4,
        gl.TEXTURE5,
        gl.TEXTURE6,
        gl.TEXTURE7,
        gl.TEXTURE8,
        gl.TEXTURE9
    ];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function createShader(){
    //console.log("compile vertexShader: " + vertexProgram);
    vertexShader   = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexProgram);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.log("vertextShader compile failed : " + vertexShader);
        return false;
    }
    //console.log("compile fragmentShader: " + fragmentShader);
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentProgram);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.log("fragmentShader compile failed : " + fragmentShader);
        return false;
    }

    return true;
}

function createProgram(){
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.log("program link failed : " + program);
        return false;
    }
    return true;
}

var loadIndex = 0;

function createAllTextures(callback) {
    loadIndex = 0;
    createBackgroundTextures(callback);
}

function createBackgroundTextures(callback){
    createTexture(inputImageSource, function (tex) {
        inputImageTextureId = tex;
        createResTextures(callback);
    });
}

function createResTextures(callback) {
    createTexture(inputResImageSourceList[loadIndex], function (tex) {
        inputResImageTextureIds[loadIndex] = tex;
        if(loadIndex==inputResImageSourceList.length-1){
            callback();
            return;
        }
        loadIndex ++ ;
        createResTextures(callback);
    });
}

function createTexture(source, callback){
    var img = new Image();
    img.onload = function(){
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.bindTexture(gl.TEXTURE_2D, null);
        console.log("texture create complete: "+source+" - "+tex);
        callback(tex);
    };
    img.src = source;
}




function initFilter(){

    attrPosition = gl.getAttribLocation(program, 'position');
    console.log("attrPosition: "+attrPosition);

    attrCoord = gl.getAttribLocation(program, 'inputTextureCoordinate');
    console.log("attrCoord: "+attrCoord);

    inputImageTextureUniform = gl.getUniformLocation(program, 'inputImageTextureUniform');
    console.log("inputImageTextureUniform: "+inputImageTextureUniform);

    effectTypeUniform = gl.getUniformLocation(program, 'styleType');
    console.log("inputImageTextureUniform: "+effectTypeUniform);

    alphaUniform = gl.getUniformLocation(program, 'alpha');
    console.log("inputImageTextureUniform: "+alphaUniform);

    inputResImageTextureUniform[0] = gl.getUniformLocation(program, 'inputImageTexture_1');
    console.log("inputResImageTextureUniform[0]: "+inputResImageTextureUniform[0]);
    inputResImageTextureUniform[1] = gl.getUniformLocation(program, 'inputImageTexture_2');
    console.log("inputResImageTextureUniform[1]: "+inputResImageTextureUniform[1]);
    inputResImageTextureUniform[2] = gl.getUniformLocation(program, 'inputImageTexture_3');
    console.log("inputResImageTextureUniform[2]: "+inputResImageTextureUniform[2]);
    inputResImageTextureUniform[3] = gl.getUniformLocation(program, 'inputImageTexture_4');
    console.log("inputResImageTextureUniform[3]: "+inputResImageTextureUniform[3]);
    inputResImageTextureUniform[4] = gl.getUniformLocation(program, 'inputImageTexture_5');
    console.log("inputResImageTextureUniform[4]: "+inputResImageTextureUniform[4]);
}

function createVbo(){
    vertexPositionVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    console.log("vertexPositionVBO: "+vertexPositionVBO);

    texturePositionVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texturePositionVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturePosition), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    console.log("texturePositionVBO: "+texturePositionVBO);
}

function drawCanvas(){

    gl.viewport(0, 0, glCanvas.width, glCanvas.height);

    console.log("background textureId:"+inputImageTextureId);
    gl.activeTexture(GL_TEXTURE[9]);
    gl.bindTexture(gl.TEXTURE_2D, inputImageTextureId);
    gl.uniform1i(inputImageTextureUniform, 9);


    for(var i=0; i<5; i++){
        var index = effectIndex*5+i;
        console.log("res image textureId index of "+i+":"+inputResImageTextureIds[index]);
        gl.activeTexture(GL_TEXTURE[i]);
        gl.bindTexture(gl.TEXTURE_2D, inputResImageTextureIds[index]);
        gl.uniform1i(inputResImageTextureUniform[i], i);
    }

    gl.uniform1f(effectTypeUniform, effectIndex+0.5);
    gl.uniform1f(alphaUniform, alphaValue);


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionVBO);
    gl.vertexAttribPointer(attrPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attrPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, texturePositionVBO);
    gl.vertexAttribPointer(attrCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attrCoord);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.finish();
}