var vertexProgram = " \
attribute vec4 position;\n \
attribute vec2 inputTextureCoordinate;\n \
varying vec2 textureCoordinate;\n \
void main()\n \
{\n \
    gl_Position = position;\n \
    textureCoordinate = inputTextureCoordinate;\n \
}\n \
";

var fragmentProgram = " \
varying highp vec2 textureCoordinate;\n \
uniform sampler2D inputImageTextureUniform;\n \
uniform sampler2D inputImageTexture_1;\n \
uniform sampler2D inputImageTexture_2;\n \
uniform sampler2D inputImageTexture_3;\n \
uniform sampler2D inputImageTexture_4;\n \
uniform sampler2D inputImageTexture_5;\n \
uniform highp float styleType;\n \
uniform highp float alpha;\n \
void main()\n \
{\n \
    lowp vec3 origin_texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
    // 0. none\n \
    if (styleType<1.0 && styleType>0.0) {\n \
        lowp vec3 texel = origin_texel;\n \
        // yingcai\n \
        highp float blueColor = texel.b * 63.0;\n \
        highp vec2 quad1;\n \
        quad1.y = floor(floor(blueColor) / 8.0);\n \
        quad1.x = floor(blueColor) - (quad1.y * 8.0);\n \
        highp vec2 quad2;\n \
        quad2.y = floor(ceil(blueColor) / 8.0);\n \
        quad2.x = ceil(blueColor) - (quad2.y * 8.0);\n \
        highp vec2 texPos1;\n \
        texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * texel.r);\n \
        texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * texel.g);\n \
        highp vec2 texPos2;\n \
        texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * texel.r);\n \
        texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * texel.g);\n \
        lowp vec4 newColor1 = texture2D(inputImageTexture_2, texPos1);\n \
        lowp vec4 newColor2 = texture2D(inputImageTexture_2, texPos2);\n \
        texel = mix(newColor1.rgb, newColor2.rgb, fract(blueColor));\n \
        gl_FragColor = vec4(texel, 1.0) * 0.7 + vec4(origin_texel, 1.0) * 0.3;\n \
    }\n \
    // 1. 1977\n \
    if (styleType<2.0 && styleType>1.0) {\n \
        lowp vec3 texel = vec3(texture2D(inputImageTexture_1, vec2(origin_texel.r, 0.1667)).r,\n \
                         texture2D(inputImageTexture_1, vec2(origin_texel.g, 0.5)).g,\n \
                         texture2D(inputImageTexture_1, vec2(origin_texel.b, 0.8333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 2. amaro\n \
    if (styleType<3.0 && styleType>2.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        lowp vec3 bbTexel = texture2D(inputImageTexture_1, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(bbTexel.r, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.g, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.b, texel.b)).b);\n \
        texel = vec3(texture2D(inputImageTexture_3, vec2(texel.r, 0.1667)).r,\n \
                     texture2D(inputImageTexture_3, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_3, vec2(texel.b, 0.8333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 3. brannan\n \
    if (styleType<4.0 && styleType>3.0) {\n \
        lowp mat3 saturateMatrix = mat3(1.10515, -0.04485, -0.04600,\n \
                                        -0.08805, 1.06195, -0.08920,\n \
                                        -0.01710, -0.01710, 1.13290);\n \
        lowp vec3 luma = vec3(0.3, 0.59, 0.11);\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.5)).r,\n \
                     texture2D(inputImageTexture_1, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_1, vec2(texel.b, 0.5)).b);\n \
        texel = saturateMatrix * texel;\n \
        lowp vec2 tc = (2.0 * textureCoordinate) - 1.0;\n \
        lowp float d = dot(tc, tc);\n \
        lowp vec3 sampled = vec3(texture2D(inputImageTexture_2, vec2(texel.r, 0.5)).r,\n \
                                 texture2D(inputImageTexture_2, vec2(texel.g, 0.5)).g,\n \
                                 texture2D(inputImageTexture_2, vec2(texel.b, 0.5)).b);\n \
        lowp float value = smoothstep(0.0, 1.0, d);\n \
        texel = mix(sampled, texel, value);\n \
        texel = vec3(texture2D(inputImageTexture_3, vec2(texel.r, 0.5)).r,\n \
                     texture2D(inputImageTexture_3, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_3, vec2(texel.b, 0.5)).b);\n \
        texel = mix(texture2D(inputImageTexture_4, vec2(dot(texel, luma), 0.5)).rgb, texel, 0.5);\n \
        texel = vec3(texture2D(inputImageTexture_5, vec2(texel.r, 0.5)).r,\n \
                     texture2D(inputImageTexture_5, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_5, vec2(texel.b, 0.5)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 4. earlybird\n \
    if (styleType<5.0 && styleType>4.0) {\n \
        lowp mat3 saturateMatrix = mat3(1.21030, -0.08970, -0.09100,\n \
                                        -0.17610, 1.12390, -0.17740,\n \
                                        -0.03420, -0.03420, 1.26580);\n \
        lowp vec3 rgbPrime = vec3(0.25098, 0.14641, 0.0);\n \
        lowp vec3 desaturate = vec3(0.3, 0.59, 0.11);\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.5)).r,\n \
                     texture2D(inputImageTexture_1, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_1, vec2(texel.b, 0.5)).b);\n \
        lowp float desaturatedColor = dot(desaturate, texel);\n \
        lowp vec3 result = vec3(texture2D(inputImageTexture_2, vec2(desaturatedColor, 0.5)).r,\n \
                                texture2D(inputImageTexture_2, vec2(desaturatedColor, 0.5)).g,\n \
                                texture2D(inputImageTexture_2, vec2(desaturatedColor, 0.5)).b);\n \
        texel = saturateMatrix * mix(texel, result, 0.5);\n \
        lowp vec2 tc = (2.0*textureCoordinate) - 1.0;\n \
        lowp float d = dot(tc, tc);\n \
        lowp vec3 sampled = vec3(texture2D(inputImageTexture_3, vec2(d, texel.r)).r,\n \
                                 texture2D(inputImageTexture_3, vec2(d, texel.g)).g,\n \
                                 texture2D(inputImageTexture_3, vec2(d, texel.b)).b);\n \
        lowp float value = smoothstep(0.0, 1.25, pow(d, 1.35)/1.65);\n \
        texel = mix(texel, sampled, value);\n \
        texel = vec3(texture2D(inputImageTexture_4, vec2(texel.r, 0.5)).r,\n \
                     texture2D(inputImageTexture_4, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_4, vec2(texel.b, 0.5)).b);\n \
        texel = mix(texel, sampled, value);\n \
        texel = vec3(texture2D(inputImageTexture_5, vec2(texel.r, 0.5)).r,\n \
                     texture2D(inputImageTexture_5, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_5, vec2(texel.b, 0.5)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 5. Hefe\n \
    if (styleType<6.0 && styleType>5.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        lowp vec3 edge = texture2D(inputImageTexture_1, textureCoordinate).rgb;\n \
        texel = texel * edge;\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_2, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_2, vec2(texel.b, 0.83333)).b);\n \
        lowp vec3 luma = vec3(0.30, 0.59, 0.11);\n \
        lowp vec3 gradSample = texture2D(inputImageTexture_3, vec2(dot(luma, texel), 0.5)).rgb;\n \
        lowp vec3 final = vec3(texture2D(inputImageTexture_4, vec2(gradSample.r, texel.r)).r,\n \
                               texture2D(inputImageTexture_4, vec2(gradSample.g, texel.g)).g,\n \
                               texture2D(inputImageTexture_4, vec2(gradSample.b, texel.b)).b);\n \
        lowp vec3 metal = texture2D(inputImageTexture_5, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_4, vec2(metal.r, texel.r)).r,\n \
                     texture2D(inputImageTexture_4, vec2(metal.g, texel.g)).g,\n \
                     texture2D(inputImageTexture_4, vec2(metal.b, texel.b)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 6. Hudson\n \
    if (styleType<7.0 && styleType>6.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        lowp vec3 bbTexel = texture2D(inputImageTexture_1, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(bbTexel.r, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.g, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.b, texel.b)).b);\n \
        texel = vec3(texture2D(inputImageTexture_3, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_3, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_3, vec2(texel.b, 0.83333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 7. inkwell\n \
    if (styleType<8.0 && styleType>7.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        texel = vec3(dot(vec3(0.3, 0.6, 0.1), texel));\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.16667)).r);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 8. lomo\n \
    if (styleType<9.0 && styleType>8.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_1, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_1, vec2(texel.b, 0.83333)).b);\n \
        lowp vec2 tc = (2.0 * textureCoordinate) - 1.0;\n \
        lowp float d = dot(tc, tc);\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(d, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(d, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(d, texel.b)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 9. lordKelvin\n \
    if (styleType<10.0 && styleType>9.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.5)).r,\n \
                     texture2D(inputImageTexture_1, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_1, vec2(texel.b, 0.5)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 10. nashville\n \
    if (styleType<11.0 && styleType>10.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_1, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_1, vec2(texel.b, 0.83333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 11. rise\n \
    if (styleType<12.0 && styleType>11.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        lowp vec3 bbTexel = texture2D(inputImageTexture_1, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(bbTexel.r, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.g, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.b, texel.b)).b);\n \
        texel = vec3(texture2D(inputImageTexture_3, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_3, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_3, vec2(texel.b, 0.83333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 12. sierra\n \
    if (styleType<13.0 && styleType>12.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        lowp vec3 bbTexel = texture2D(inputImageTexture_1, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(bbTexel.r, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.g, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.b, texel.b)).b);\n \
        texel = vec3(texture2D(inputImageTexture_3, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_3, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_3, vec2(texel.b, 0.83333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 13. sutro\n \
    if (styleType<14.0 && styleType>13.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        lowp vec2 tc = (2.0 * textureCoordinate) - 1.0;\n \
        lowp float d = dot(tc, tc);\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(d, texel.r)).r,\n \
                     texture2D(inputImageTexture_1, vec2(d, texel.g)).g,\n \
                     texture2D(inputImageTexture_1, vec2(d, texel.b)).b);\n \
        lowp vec3 rgbPrime = vec3(0.1019, 0.0, 0.0);\n \
        lowp float m = dot(vec3(0.3, 0.59, 0.11), texel.rgb) - 0.03058;\n \
        texel = mix(texel, rgbPrime + m, 0.32);\n \
        lowp vec3 metal = texture2D(inputImageTexture_2, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_3, vec2(metal.r, texel.r)).r,\n \
                     texture2D(inputImageTexture_3, vec2(metal.g, texel.g)).g,\n \
                     texture2D(inputImageTexture_3, vec2(metal.b, texel.b)).b);\n \
        texel = texel * texture2D(inputImageTexture_4, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_5, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_5, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_5, vec2(texel.b, 0.83333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 14. toaster\n \
    if (styleType<15.0 && styleType>14.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        lowp vec3 bbTexel = texture2D(inputImageTexture_1, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(bbTexel.r, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.g, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(bbTexel.b, texel.b)).b);\n \
        texel = vec3(texture2D(inputImageTexture_3, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_3, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_3, vec2(texel.b, 0.83333)).b);\n \
        lowp vec2 tc = (2.0 * textureCoordinate) - 1.0;\n \
        lowp float d = dot(tc, tc);\n \
        texel = vec3(texture2D(inputImageTexture_4, vec2(d, texel.r)).r,\n \
                     texture2D(inputImageTexture_4, vec2(d, texel.g)).g,\n \
                     texture2D(inputImageTexture_4, vec2(d, texel.b)).b);\n \
        texel = vec3(texture2D(inputImageTexture_5, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_5, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_5, vec2(texel.b, 0.83333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 15. valencia\n \
    if (styleType<16.0 && styleType>15.0) {\n \
        lowp mat3 saturateMatrix = mat3(1.14020, -0.05980, -0.06100,\n \
                                        -0.11740, 1.08260, -0.11860,\n \
                                        -0.02280, -0.02280, 1.17720);\n \
        lowp vec3 luma = vec3(0.3, 0.59, 0.11);\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_1, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_1, vec2(texel.b, 0.83333)).b);\n \
        texel = saturateMatrix * texel;\n \
        lowp float lumaValue = dot(luma, texel);\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(lumaValue, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(lumaValue, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(lumaValue, texel.b)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 16. walden\n \
    if (styleType<17.0 && styleType>16.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_1, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_1, vec2(texel.b, 0.83333)).b);\n \
        lowp vec2 tc = (2.0 * textureCoordinate) - 1.0;\n \
        lowp float d = dot(tc, tc);\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(d, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(d, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(d, texel.b)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
    // 17. xpro\n \
    if (styleType<18.0 && styleType>17.0) {\n \
        lowp vec3 texel = texture2D(inputImageTextureUniform, textureCoordinate).rgb;\n \
        lowp vec2 tc = (2.0 * textureCoordinate) - 1.0;\n \
        lowp float d = dot(tc, tc);\n \
        texel = vec3(texture2D(inputImageTexture_2, vec2(d, texel.r)).r,\n \
                     texture2D(inputImageTexture_2, vec2(d, texel.g)).g,\n \
                     texture2D(inputImageTexture_2, vec2(d, texel.b)).b);\n \
        texel = vec3(texture2D(inputImageTexture_1, vec2(texel.r, 0.16667)).r,\n \
                     texture2D(inputImageTexture_1, vec2(texel.g, 0.5)).g,\n \
                     texture2D(inputImageTexture_1, vec2(texel.b, 0.83333)).b);\n \
        gl_FragColor = vec4(texel, 1.0) * alpha + vec4(origin_texel, 1.0) * (1.0-alpha);\n \
    }\n \
}\n \
";

