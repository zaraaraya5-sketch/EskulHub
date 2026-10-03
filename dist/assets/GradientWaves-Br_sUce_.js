import{r as g,j as ae}from"./vendor-react-99K5UUgk.js";import{R as re,P as ie,T as ue,M as ne}from"./vendor-graphics-atzCiUE6.js";const W=u=>{const c=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(u);return c?[parseInt(c[1],16)/255,parseInt(c[2],16)/255,parseInt(c[3],16)/255]:[1,1,1]},le=u=>u==="low"?40:u==="high"?110:70,ce=u=>u?`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`:`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,se=u=>u?`#version 300 es
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
`,R=new WeakMap,me=({horizonColor:u="#5227FF",waveColor:c="#FF9FFC",crestColor:A="#FFFFFF",speed:G=.4,amplitude:E=2.5,waveScale:z=.6,waveRatio:P=.9,swell:q=35,turbulence:_=20,tilt:L=1.11,zoom:H=1,height:I=5.5,fogDepth:B=15,detail:D="medium",brightness:k=1,opacity:O=1,mouseInteraction:y=!0,parallaxStrength:X=.5,grain:Z=!0,grainIntensity:V=.05,className:U="",style:ee={}})=>{const T=g.useRef(null),w=g.useRef(y);return g.useEffect(()=>{const r=T.current;if(!r)return;let n;try{n=new re({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)})}catch(a){console.warn("WebGL initialization failed:",a);return}const i=n.gl;if(!i)return;const e=n.isWebgl2;i.clearColor(0,0,0,0);const o=i.canvas;o.style.width="100%",o.style.height="100%",o.style.display="block",r.appendChild(o);const d=ce(e),p=se(e);let t;try{t=new ie(i,{vertex:d,fragment:p,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.4},uAmplitude:{value:2.5},uWaveScale:{value:.6},uWaveRatio:{value:.9},uSwell:{value:35},uTurbulence:{value:20},uTilt:{value:1.11},uZoom:{value:1},uHeight:{value:5.5},uFogDepth:{value:15},uSteps:{value:70},uBrightness:{value:1},uOpacity:{value:1},uGrain:{value:1},uGrainIntensity:{value:.05},uMouse:{value:new Float32Array([.5,.5])},uParallax:{value:.5},uEnableMouse:{value:1},uHorizonColor:{value:new Float32Array([1,1,1])},uWaveColor:{value:new Float32Array([1,1,1])},uCrestColor:{value:new Float32Array([1,1,1])}}})}catch(a){console.warn("GradientWaves Program creation failed:",a);return}if(!t.uniformLocations){console.warn("GradientWaves: Program shader failed to compile or link. Skipping render.");return}const h=new ue(i),s=new ne(i,{geometry:h,program:t});R.set(r,{renderer:n,program:t,mesh:s});const j=()=>{if(!r||!t.uniformLocations)return;const a=r.getBoundingClientRect(),l=Math.max(1,Math.floor(a.width)),F=Math.max(1,Math.floor(a.height));n.setSize(l,F);const x=t.uniforms.iResolution.value;x[0]=i.drawingBufferWidth,x[1]=i.drawingBufferHeight;try{n.render({scene:s})}catch(te){console.warn("GradientWaves initial render error:",te)}},$=new ResizeObserver(j);$.observe(r),j();const f=[.5,.5],v=[.5,.5],N=a=>{const l=o.getBoundingClientRect();v[0]=(a.clientX-l.left)/l.width,v[1]=1-(a.clientY-l.top)/l.height},Y=()=>{v[0]=.5,v[1]=.5};o.addEventListener("pointermove",N),o.addEventListener("pointerleave",Y);let m=0,b=!0,S=!document.hidden;const oe=performance.now(),J=a=>{if(!t.uniformLocations)return;t.uniforms.iTime.value=(a-oe)*.001;const l=w.current?v[0]:.5,F=w.current?v[1]:.5;f[0]+=.05*(l-f[0]),f[1]+=.05*(F-f[1]),t.uniforms.uMouse.value[0]=f[0],t.uniforms.uMouse.value[1]=f[1];try{n.render({scene:s}),m=requestAnimationFrame(J)}catch(x){console.warn("GradientWaves loop error:",x)}},C=()=>{b&&S&&m===0&&(m=requestAnimationFrame(J))},M=()=>{m!==0&&(cancelAnimationFrame(m),m=0)},K=new IntersectionObserver(([a])=>{b=a.isIntersecting,b?C():M()},{threshold:0});K.observe(r);const Q=()=>{S=!document.hidden,S?C():M()};return document.addEventListener("visibilitychange",Q),C(),()=>{M(),$.disconnect(),K.disconnect(),document.removeEventListener("visibilitychange",Q),o.removeEventListener("pointermove",N),o.removeEventListener("pointerleave",Y),R.delete(r);try{r.removeChild(o)}catch{}i.getExtension("WEBGL_lose_context")?.loseContext()}},[]),g.useEffect(()=>{const r=T.current;if(!r)return;const n=R.get(r);if(!n)return;const{program:i}=n;if(!i.uniformLocations)return;const e=i.uniforms;w.current=y,e.uSpeed.value=G,e.uAmplitude.value=E,e.uWaveScale.value=z,e.uWaveRatio.value=P,e.uSwell.value=q,e.uTurbulence.value=_,e.uTilt.value=L,e.uZoom.value=H,e.uHeight.value=I,e.uFogDepth.value=B,e.uSteps.value=le(D),e.uBrightness.value=k,e.uOpacity.value=O,e.uGrain.value=Z?1:0,e.uGrainIntensity.value=V,e.uParallax.value=X,e.uEnableMouse.value=y?1:0;const o=e.uHorizonColor.value,d=e.uWaveColor.value,p=e.uCrestColor.value,t=W(u),h=W(c),s=W(A);o[0]=t[0],o[1]=t[1],o[2]=t[2],d[0]=h[0],d[1]=h[1],d[2]=h[2],p[0]=s[0],p[1]=s[1],p[2]=s[2]},[u,c,A,G,E,z,P,q,_,L,H,I,B,D,k,O,Z,V,y,X]),ae.jsx("div",{ref:T,className:`gradient-waves-container ${U}`.trim(),style:ee})};export{me as GradientWaves,me as default};
