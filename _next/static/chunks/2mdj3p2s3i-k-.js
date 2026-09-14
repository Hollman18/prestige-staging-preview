(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,55526,e=>{"use strict";let r=e=>Math.min(1,Math.max(0,e)),t=e=>{let t;return(t=r(e/.6))*t*(3-2*t)},o=(e,r,t,o)=>({x:r.x*o,y:(2*e-1)*t+r.y*o}),a=`#version 300 es
in vec2 a_position; out vec2 v_uv;
void main(){ v_uv = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0.0, 1.0); }`,i=`#version 300 es
precision highp float;
in vec2 v_uv; out vec4 outColor;
uniform sampler2D uImage; uniform sampler2D uDepth;
uniform sampler2D uPrevImage; uniform sampler2D uPrevDepth;
uniform vec2 uOffset; uniform float uMorph; uniform float uHasPrev;
uniform vec2 uAspect;
uniform vec2 uPrevAspect;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
}
vec2 cover(vec2 uv, vec2 aspect){ return (uv - 0.5) * aspect + 0.5; }
vec3 sampleParallax(sampler2D img, sampler2D dep, vec2 uv, vec2 aspect){
  vec2 c = cover(uv, aspect);
  float d = texture(dep, c).r;
  vec2 disp = uOffset * (d - 0.5);
  vec2 safe = clamp(c + disp, vec2(0.012), vec2(0.988));
  return texture(img, safe).rgb;
}
void main(){
  vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
  vec3 cur = sampleParallax(uImage, uDepth, uv, uAspect);
  if (uHasPrev < 0.5 || uMorph >= 1.0) { outColor = vec4(cur, 1.0); return; }
  vec3 prev = sampleParallax(uPrevImage, uPrevDepth, uv, uPrevAspect);
  float dCur = texture(uDepth, cover(uv, uAspect)).r;
  float n = noise(uv * 7.0);
  float threshold = 1.0 - dCur * 0.55 - n * 0.45;
  float edge = smoothstep(threshold - 0.12, threshold + 0.12, uMorph * 1.24 - 0.12);
  outColor = vec4(mix(prev, cur, edge), 1.0);
}`;function u(e){return new Promise((r,t)=>{let o=new Image;o.decoding="async",o.onload=()=>r(o),o.onerror=()=>t(Error(`image ${e}`)),o.src=e})}async function n(e,n,c){let s=e.getContext("webgl2",{alpha:!1,antialias:!1,powerPreference:"high-performance"});if(!s)return null;let[f,m,v,l]=await Promise.all([u(n.image),u(n.depth),n.prevImage?u(n.prevImage):null,n.prevDepth?u(n.prevDepth):null]),h=(e,r)=>{let t=s.createShader(e);if(s.shaderSource(t,r),s.compileShader(t),!s.getShaderParameter(t,s.COMPILE_STATUS))throw Error(s.getShaderInfoLog(t)??"shader");return t},p=s.createProgram();if(s.attachShader(p,h(s.VERTEX_SHADER,a)),s.attachShader(p,h(s.FRAGMENT_SHADER,i)),s.linkProgram(p),!s.getProgramParameter(p,s.LINK_STATUS))throw Error(s.getProgramInfoLog(p)??"link");s.useProgram(p);let g=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,g),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),s.STATIC_DRAW);let E=s.getAttribLocation(p,"a_position");s.enableVertexAttribArray(E),s.vertexAttribPointer(E,2,s.FLOAT,!1,0,0);let T=(e,r)=>{let t=s.createTexture();return s.activeTexture(s.TEXTURE0+r),s.bindTexture(s.TEXTURE_2D,t),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,e),t},d=[T(f,0),T(m,1)];v&&l&&d.push(T(v,2),T(l,3)),s.uniform1i(s.getUniformLocation(p,"uImage"),0),s.uniform1i(s.getUniformLocation(p,"uDepth"),1),s.uniform1i(s.getUniformLocation(p,"uPrevImage"),2),s.uniform1i(s.getUniformLocation(p,"uPrevDepth"),3),s.uniform1f(s.getUniformLocation(p,"uHasPrev"),+!!v);let P=s.getUniformLocation(p,"uOffset"),A=s.getUniformLocation(p,"uMorph"),_=s.getUniformLocation(p,"uAspect"),x=s.getUniformLocation(p,"uPrevAspect"),R=0,D=0,U=0,I=!0,L=!1,M=1,S=1,b=e=>{let r=e.width/e.height,t=M/S;return r>t?[t/r,1]:[1,r/t]};return{setProgress(e){let t=r(e);Math.abs(t-R)>1e-4&&(R=t,I=!0)},setPointer(e,r){(Math.abs(e-D)>1e-4||Math.abs(r-U)>1e-4)&&(D=e,U=r,I=!0)},resize(r,t,o){M=Math.max(1,r),S=Math.max(1,t),e.width=Math.round(M*o),e.height=Math.round(S*o),s.viewport(0,0,e.width,e.height),s.uniform2fv(_,b(f)),v&&s.uniform2fv(x,b(v)),I=!0},render(){if(!I||L)return;I=!1;let e=o(R,{x:D,y:U},c.strength,c.pointerStrength);s.uniform2f(P,e.x,e.y),s.uniform1f(A,v?t(R):1),s.drawArrays(s.TRIANGLE_STRIP,0,4)},dispose(){L=!0,d.forEach(e=>s.deleteTexture(e)),s.deleteBuffer(g),s.deleteProgram(p),s.getExtension("WEBGL_lose_context")?.loseContext()}}}e.s(["FRAG",0,i,"VERT",0,a,"createDepthPlane",0,n,"morphAt",0,t,"parallaxFrom",0,o])}]);