import{r as g,j as ie}from"./vendor-react-Be0lVw-i.js";import{R as ne,P as ue,T as le,M as ce}from"./vendor-graphics-atzCiUE6.js";const A=i=>{const l=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);return l?[parseInt(l[1],16)/255,parseInt(l[2],16)/255,parseInt(l[3],16)/255]:[1,1,1]},ee=i=>i==="low"?40:i==="high"?110:70,se=i=>i?`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`:`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,fe=i=>i?`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform float uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (abs(dist) >= MAX_DIST) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse > 0.5) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`:`
#ifdef GL_ES
precision highp float;
#endif
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform float uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (abs(dist) >= MAX_DIST) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse > 0.5) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  gl_FragColor = vec4(col * alpha, alpha);
}
`,G=new WeakMap,de=({horizonColor:i="#5227FF",waveColor:l="#FF9FFC",crestColor:E="#FFFFFF",speed:z=.4,amplitude:P=2.5,waveScale:q=.6,waveRatio:_=.9,swell:L=35,turbulence:H=20,tilt:I=1.11,zoom:B=1,height:D=5.5,fogDepth:k=15,detail:w="medium",brightness:O=1,opacity:X=1,mouseInteraction:y=!0,parallaxStrength:Z=.5,grain:V=!0,grainIntensity:j=.05,className:oe="",style:te={}})=>{const T=g.useRef(null),b=g.useRef(y);return g.useEffect(()=>{const r=T.current;if(!r)return;let n;const m=typeof window<"u"&&window.innerWidth<768;try{n=new ne({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:m?1:Math.min(window.devicePixelRatio||1,1.5)})}catch(a){console.warn("WebGL initialization failed:",a);return}const e=n.gl;if(!e)return;const c=n.isWebgl2;e.clearColor(0,0,0,0);const o=e.canvas;o.style.width="100%",o.style.height="100%",o.style.display="block",r.appendChild(o);const d=se(c),p=fe(c);let t;try{t=new ue(e,{vertex:d,fragment:p,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.4},uAmplitude:{value:2.5},uWaveScale:{value:.6},uWaveRatio:{value:.9},uSwell:{value:35},uTurbulence:{value:20},uTilt:{value:1.11},uZoom:{value:1},uHeight:{value:5.5},uFogDepth:{value:15},uSteps:{value:m?35:ee(w)},uBrightness:{value:1},uOpacity:{value:1},uGrain:{value:1},uGrainIntensity:{value:.05},uMouse:{value:new Float32Array([.5,.5])},uParallax:{value:.5},uEnableMouse:{value:1},uHorizonColor:{value:new Float32Array([1,1,1])},uWaveColor:{value:new Float32Array([1,1,1])},uCrestColor:{value:new Float32Array([1,1,1])}}})}catch(a){console.warn("GradientWaves Program creation failed:",a);return}if(!t.uniformLocations){console.warn("GradientWaves: Program shader failed to compile or link. Skipping render.");return}const h=new le(e),S=new ce(e,{geometry:h,program:t});G.set(r,{renderer:n,program:t,mesh:S});const $=()=>{if(!r||!t.uniformLocations)return;const a=r.getBoundingClientRect(),u=Math.max(1,Math.floor(a.width)),R=Math.max(1,Math.floor(a.height));n.setSize(u,R);const x=t.uniforms.iResolution.value;x[0]=e.drawingBufferWidth,x[1]=e.drawingBufferHeight;try{n.render({scene:S})}catch(re){console.warn("GradientWaves initial render error:",re)}},N=new ResizeObserver($);N.observe(r),$();const s=[.5,.5],f=[.5,.5],Y=a=>{const u=o.getBoundingClientRect();f[0]=(a.clientX-u.left)/u.width,f[1]=1-(a.clientY-u.top)/u.height},J=()=>{f[0]=.5,f[1]=.5};o.addEventListener("pointermove",Y),o.addEventListener("pointerleave",J);let v=0,C=!0,M=!document.hidden;const ae=performance.now(),K=a=>{if(!t.uniformLocations)return;t.uniforms.iTime.value=(a-ae)*.001;const u=b.current?f[0]:.5,R=b.current?f[1]:.5;s[0]+=.05*(u-s[0]),s[1]+=.05*(R-s[1]),t.uniforms.uMouse.value[0]=s[0],t.uniforms.uMouse.value[1]=s[1];try{n.render({scene:S}),v=requestAnimationFrame(K)}catch(x){console.warn("GradientWaves loop error:",x)}},F=()=>{C&&M&&v===0&&(v=requestAnimationFrame(K))},W=()=>{v!==0&&(cancelAnimationFrame(v),v=0)},Q=new IntersectionObserver(([a])=>{C=a.isIntersecting,C?F():W()},{threshold:0});Q.observe(r);const U=()=>{M=!document.hidden,M?F():W()};return document.addEventListener("visibilitychange",U),F(),()=>{W(),N.disconnect(),Q.disconnect(),document.removeEventListener("visibilitychange",U),o.removeEventListener("pointermove",Y),o.removeEventListener("pointerleave",J),G.delete(r);try{r.removeChild(o)}catch{}e.getExtension("WEBGL_lose_context")?.loseContext()}},[]),g.useEffect(()=>{const r=T.current;if(!r)return;const n=G.get(r);if(!n)return;const{program:m}=n;if(!m.uniformLocations)return;const e=m.uniforms;b.current=y,e.uSpeed.value=z,e.uAmplitude.value=P,e.uWaveScale.value=q,e.uWaveRatio.value=_,e.uSwell.value=L,e.uTurbulence.value=H,e.uTilt.value=I,e.uZoom.value=B,e.uHeight.value=D,e.uFogDepth.value=k,e.uSteps.value=ee(w),e.uBrightness.value=O,e.uOpacity.value=X,e.uGrain.value=V?1:0,e.uGrainIntensity.value=j,e.uParallax.value=Z,e.uEnableMouse.value=y?1:0;const c=e.uHorizonColor.value,o=e.uWaveColor.value,d=e.uCrestColor.value,p=A(i),t=A(l),h=A(E);c[0]=p[0],c[1]=p[1],c[2]=p[2],o[0]=t[0],o[1]=t[1],o[2]=t[2],d[0]=h[0],d[1]=h[1],d[2]=h[2]},[i,l,E,z,P,q,_,L,H,I,B,D,k,w,O,X,V,j,y,Z]),ie.jsx("div",{ref:T,className:`gradient-waves-container ${oe}`.trim(),style:te})};export{de as GradientWaves,de as default};
