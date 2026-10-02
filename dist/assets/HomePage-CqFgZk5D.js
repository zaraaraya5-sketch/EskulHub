import{r as s,j as e,A as he,b as be,h as ye,S as ke,d as we,i as je,T as Ce,F as Fe}from"./vendor-react-Cnh4zzDp.js";import{d as Q,g as Se}from"./index-CYBvOGid.js";import{B as se}from"./Button-BW8YcsSX.js";import{B as Me}from"./Badge-C1CH6MjP.js";import{g as ee,S as ge,R as Ee,P as Te,T as Ne,M as Re}from"./vendor-graphics-atzCiUE6.js";import"./vendor-pdf-Db9-lBhZ.js";const ne="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",fe=[{image:"https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",label:"Futsal Garuda Nusantara",bio:"Wadah pembinaan fisik, sportivitas, dan strategi kompetisi futsal antar-sekolah.",link:"/ekskul/futsal"},{image:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",label:"Programming & Cyber Club",bio:"Eksplorasi pembuatan aplikasi web, kecerdasan buatan, algoritma kompetisi, dan keamanan siber.",link:"/ekskul/programming-club"},{image:"https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",label:"Fotografi & Sinematografi Citra",bio:"Mempelajari teknik komposisi visual, tata cahaya, editing digital, dan produksi video sekolah.",link:"/ekskul/fotografi"},{image:"https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",label:"Teater Citra Nusa",bio:"Pengasahan olah vokal, gestur tubuh, penulisan naskah drama, dan seni pertunjukan panggung.",link:"/ekskul/teater"},{image:"https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",label:"Basket Nusantara Club",bio:"Latihan intensif bola basket, pembentukan fisik atletis, dan persiapan kompetisi DBL.",link:"/ekskul/basket"}],Ae=({items:a=fe,defaultIndex:u=2,accentColor:v="#D15B40",overlayColor:w="#060010",textColor:R="#ffffff",height:E=460,gap:A=10,radius:B=16,expandRatio:C=.52,orientation:h="horizontal",duration:m=.6,ease:W="power3.out",parallax:V=.5,tilt:L=8,stagger:q=.06,trigger:z="hover",showLabels:g=!0,grayscale:H=!0,className:X="",onNavigate:I})=>{const Z=s.useRef(null),F=s.useRef([]),k=s.useRef([]),l=s.useRef([]),i=s.useRef([]),b=s.useRef([]),x=s.useRef([]),o=s.useRef(null),f=s.useRef(!0),S=s.useRef(320),T=a&&a.length>0?a:fe,n=h==="vertical",d=T.length,[y,$]=s.useState(()=>Math.min(Math.max(u,0),Math.max(0,d-1)));s.useEffect(()=>{(y<0||y>=d)&&$(Math.min(Math.max(u,0),Math.max(0,d-1)))},[d,u,y]);const U=typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1,D=s.useCallback(t=>{const r=F.current;if(!r.length)return;const j=Math.min(Math.max(C,.2),.9),G=d>1?j*(d-1)/(1-j):1,c=S.current;o.current?.kill();const M=t&&!U?m:0,N=ee.timeline();r.forEach((te,_)=>{if(!te)return;const p=_===y,P=k.current[_],J=l.current[_],Y=i.current[_],oe=b.current[_],ce=x.current[_],ue=p?0:_<y?L:-L,xe=n?{rotateX:-ue}:{rotateY:ue};if(N.to(te,{flexGrow:p?G:1,...xe,duration:M,ease:W},0),P){const me=Math.max(-1.5,Math.min(1.5,y-_))*V*c*.06,ve=H?p?0:1:0;N.to(P,{xPercent:-50,yPercent:-50,x:n||p?0:me,y:n?p?0:me:0,"--ag-gray":ve,"--ag-dim":p?.2:.45,duration:M,ease:W},0)}if(g){const K=[];J&&K.push(J),Y&&K.push(Y),oe&&K.push(oe),ce&&K.push(ce),p?N.to(K,{opacity:1,x:0,y:0,duration:M,ease:W,stagger:U?0:q},0):N.to(K,{opacity:0,x:-14,y:5,duration:M*.6,ease:W},0)}}),o.current=N},[y,d,C,m,W,n,L,V,H,g,q,U]);s.useEffect(()=>{const t=Z.current;if(!t)return;const r=()=>{const G=t.getBoundingClientRect(),c=n?G.height:G.width,M=Math.max(c-A*(d-1),120),N=Math.max(140,M*Math.min(Math.max(C,.2),.9)*1.22);S.current=N,t.style.setProperty("--ag-media-size",`${N}px`),D(!f.current)};r();const j=new ResizeObserver(r);return j.observe(t),()=>j.disconnect()},[D,A,d,C,n]),s.useEffect(()=>{D(!f.current),f.current=!1},[D]),s.useEffect(()=>()=>{o.current?.kill()},[]);const O=t=>{z==="hover"&&$(t)},ae=(t,r)=>{if(t!==y)r.preventDefault(),$(t);else{const j=T[t]?.link;j&&I&&(r.preventDefault(),I(j))}},re=(t,r)=>{r.key==="ArrowRight"||r.key==="ArrowDown"?(r.preventDefault(),$((t+1)%d)):(r.key==="ArrowLeft"||r.key==="ArrowUp")&&(r.preventDefault(),$((t-1+d)%d))};return e.jsx("div",{ref:Z,className:`accordion-gallery${n?" accordion-gallery--vertical":""}${X?` ${X}`:""}`,style:{"--ag-accent":v,"--ag-overlay":w,"--ag-text":R,"--ag-gap":`${A}px`,"--ag-radius":`${B}px`,height:n?`${Math.round(E*1.6)}px`:`${E}px`},role:"list","aria-label":"Image accordion gallery",children:T.map((t,r)=>{const j=r===y,G=t.link&&!I?"a":"div";return e.jsxs(G,{ref:c=>{F.current[r]=c},className:`ag-panel${j?" ag-panel--active":""}`,style:{borderRadius:`${B}px`},href:G==="a"&&t.link||void 0,onClick:c=>ae(r,c),onMouseEnter:()=>O(r),onFocus:()=>$(r),onKeyDown:c=>re(r,c),role:"listitem",tabIndex:0,"aria-current":j?"true":void 0,"aria-label":t.label,children:[e.jsxs("span",{className:"ag-panel__frame",children:[e.jsx("span",{className:"ag-panel__media",ref:c=>{k.current[r]=c},children:e.jsx("img",{src:t.image||ne,alt:t.alt||t.label||"",draggable:"false",loading:"eager",onError:c=>{const M=c.currentTarget;M.src!==ne&&(M.src=ne)}})}),e.jsx("span",{className:"ag-panel__overlay","aria-hidden":"true"})]}),g&&e.jsx("span",{className:"ag-panel__label","aria-hidden":"true",children:e.jsxs("div",{className:"ag-panel__label-container",children:[e.jsxs("div",{className:"ag-panel__header",children:[e.jsx("span",{className:"ag-panel__bar",ref:c=>{l.current[r]=c}}),e.jsx("div",{className:"ag-panel__title-wrapper",children:e.jsx("div",{className:"ag-panel__text",ref:c=>{i.current[r]=c},children:t.label})})]}),t.bio&&e.jsx("p",{className:"ag-panel__bio",ref:c=>{b.current[r]=c},children:t.bio}),t.link&&e.jsx("div",{className:"ag-panel__cta-wrapper",ref:c=>{x.current[r]=c},children:e.jsxs("button",{className:"ag-panel__cta",onClick:c=>{c.stopPropagation(),I&&I(t.link)},children:["Lihat Profil ",e.jsx(he,{className:"w-3 h-3 ml-1"})]})})]})})]},r)})})};ee.registerPlugin(ge);const de={top:{origin:"50% 0%",rotateX:-92,rotateY:0},bottom:{origin:"50% 100%",rotateX:92,rotateY:0},left:{origin:"0% 50%",rotateX:0,rotateY:92},right:{origin:"100% 50%",rotateX:0,rotateY:-92}},De=(a,u,v)=>Math.min(v,Math.max(u,a)),_e=(a,u)=>a.split(/(\n)/).map((v,w)=>v===`
`?e.jsx("br",{},`${u}-br-${w}`):v?e.jsx("span",{className:"fold-text-whitespace",children:v.replace(/ /g," ")},`${u}-space-${w}`):null),pe=({text:a="Design unfolds",splitBy:u="char",hinge:v="top",duration:w=.65,stagger:R=.045,ease:E="power3.out",perspective:A=700,creaseShading:B=.55,trigger:C="mount",fontSize:h=80,fontWeight:m=800,color:W="#f7f2e8",className:V="",style:L={}})=>{const q=s.useRef(null),z=s.useRef(null),g=de[v]||de.top,H=De(B,0,1),X=Math.max(120,A),I=s.useMemo(()=>{let F=0;const k=(l,i,b=u)=>(F+=1,e.jsx("span",{className:"fold-text-segment","data-fold-split":b,style:{"--fold-perspective":`${X}px`},children:e.jsx("span",{className:"fold-text-piece","data-fold-hinge":v,style:{transformOrigin:g.origin,"--fold-crease":0},children:l||" "})},i));return u==="line"?a.split(`
`).map((l,i)=>e.jsx("span",{className:"fold-text-line",children:k(l||" ",`segment-line-${i}`,"line")},`line-${i}`)):u==="word"?a.split(/(\s+)/).flatMap((l,i)=>l?/^\s+$/.test(l)?_e(l,`ws-${i}`):k(l,`segment-word-${F}`):[]):Array.from(a).map((l,i)=>l===`
`?e.jsx("br",{},`br-${i}`):k(l===" "?" ":l,`segment-char-${i}`))},[a,u,v,g.origin,X]);s.useEffect(()=>{if(typeof window>"u")return;const F=q.current;if(!F)return;const k=Array.from(F.querySelectorAll(".fold-text-piece"));if(!k.length)return;const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,i=l?Math.min(w,.22):w,b=l?Math.min(R,.02):R,x={opacity:0,rotateX:l?0:g.rotateX,rotateY:l?0:g.rotateY,"--fold-crease":l?0:H,transformOrigin:g.origin,force3D:!0},o={opacity:1,rotateX:0,rotateY:0,"--fold-crease":0,duration:i,ease:l?"power1.out":E,stagger:b,clearProps:"willChange"},f=()=>{z.current?.kill(),z.current=null,ee.killTweensOf(k)},S=d=>(f(),z.current=ee.timeline({repeat:d?-1:0,repeatDelay:d?.75:0}),z.current.fromTo(k,x,o),z.current);let T,n;return C==="hover"?(ee.set(k,{opacity:1,rotateX:0,rotateY:0,"--fold-crease":0,transformOrigin:g.origin}),n=()=>S(!1),F.addEventListener("mouseenter",n)):C==="scroll"?(ee.set(k,x),T=ge.create({trigger:F,start:"top 82%",once:!0,onEnter:()=>S(!1)})):S(C==="loop"),()=>{n&&F.removeEventListener("mouseenter",n),T?.kill(),f()}},[a,u,v,w,R,E,A,H,C,g.origin,g.rotateX,g.rotateY]);const Z={"--fold-text-font-size":typeof h=="number"?`${h}px`:h,"--fold-text-font-weight":m,"--fold-text-color":W,...L};return e.jsxs("span",{ref:q,className:`fold-text ${V}`.trim(),style:Z,children:[e.jsx("span",{className:"fold-text-sr-only",children:a}),e.jsx("span",{className:"fold-text-visual","aria-hidden":"true",children:I})]})},ie=a=>{const u=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);return u?[parseInt(u[1],16)/255,parseInt(u[2],16)/255,parseInt(u[3],16)/255]:[1,1,1]},Pe=a=>a==="low"?40:a==="high"?110:70,We=a=>a?`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`:`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ze=a=>a?`#version 300 es
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
`,le=new WeakMap,Ie=({horizonColor:a="#5227FF",waveColor:u="#FF9FFC",crestColor:v="#FFFFFF",speed:w=.4,amplitude:R=2.5,waveScale:E=.6,waveRatio:A=.9,swell:B=35,turbulence:C=20,tilt:h=1.11,zoom:m=1,height:W=5.5,fogDepth:V=15,detail:L="medium",brightness:q=1,opacity:z=1,mouseInteraction:g=!0,parallaxStrength:H=.5,grain:X=!0,grainIntensity:I=.05,className:Z="",style:F={}})=>{const k=s.useRef(null),l=s.useRef(g);return s.useEffect(()=>{const i=k.current;if(!i)return;let b;try{b=new Ee({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)})}catch(p){console.warn("WebGL initialization failed:",p);return}const x=b.gl;if(!x)return;const o=b.isWebgl2;x.clearColor(0,0,0,0);const f=x.canvas;f.style.width="100%",f.style.height="100%",f.style.display="block",i.appendChild(f);const S=We(o),T=ze(o);let n;try{n=new Te(x,{vertex:S,fragment:T,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:.4},uAmplitude:{value:2.5},uWaveScale:{value:.6},uWaveRatio:{value:.9},uSwell:{value:35},uTurbulence:{value:20},uTilt:{value:1.11},uZoom:{value:1},uHeight:{value:5.5},uFogDepth:{value:15},uSteps:{value:70},uBrightness:{value:1},uOpacity:{value:1},uGrain:{value:1},uGrainIntensity:{value:.05},uMouse:{value:new Float32Array([.5,.5])},uParallax:{value:.5},uEnableMouse:{value:1},uHorizonColor:{value:new Float32Array([1,1,1])},uWaveColor:{value:new Float32Array([1,1,1])},uCrestColor:{value:new Float32Array([1,1,1])}}})}catch(p){console.warn("GradientWaves Program creation failed:",p);return}if(!n.uniformLocations){console.warn("GradientWaves: Program shader failed to compile or link. Skipping render.");return}const d=new Ne(x),y=new Re(x,{geometry:d,program:n});le.set(i,{renderer:b,program:n,mesh:y});const $=()=>{if(!i||!n.uniformLocations)return;const p=i.getBoundingClientRect(),P=Math.max(1,Math.floor(p.width)),J=Math.max(1,Math.floor(p.height));b.setSize(P,J);const Y=n.uniforms.iResolution.value;Y[0]=x.drawingBufferWidth,Y[1]=x.drawingBufferHeight;try{b.render({scene:y})}catch(oe){console.warn("GradientWaves initial render error:",oe)}},U=new ResizeObserver($);U.observe(i),$();const D=[.5,.5],O=[.5,.5],ae=p=>{const P=f.getBoundingClientRect();O[0]=(p.clientX-P.left)/P.width,O[1]=1-(p.clientY-P.top)/P.height},re=()=>{O[0]=.5,O[1]=.5};f.addEventListener("pointermove",ae),f.addEventListener("pointerleave",re);let t=0,r=!0,j=!document.hidden;const G=performance.now(),c=p=>{if(!n.uniformLocations)return;n.uniforms.iTime.value=(p-G)*.001;const P=l.current?O[0]:.5,J=l.current?O[1]:.5;D[0]+=.05*(P-D[0]),D[1]+=.05*(J-D[1]),n.uniforms.uMouse.value[0]=D[0],n.uniforms.uMouse.value[1]=D[1];try{b.render({scene:y}),t=requestAnimationFrame(c)}catch(Y){console.warn("GradientWaves loop error:",Y)}},M=()=>{r&&j&&t===0&&(t=requestAnimationFrame(c))},N=()=>{t!==0&&(cancelAnimationFrame(t),t=0)},te=new IntersectionObserver(([p])=>{r=p.isIntersecting,r?M():N()},{threshold:0});te.observe(i);const _=()=>{j=!document.hidden,j?M():N()};return document.addEventListener("visibilitychange",_),M(),()=>{N(),U.disconnect(),te.disconnect(),document.removeEventListener("visibilitychange",_),f.removeEventListener("pointermove",ae),f.removeEventListener("pointerleave",re),le.delete(i);try{i.removeChild(f)}catch{}x.getExtension("WEBGL_lose_context")?.loseContext()}},[]),s.useEffect(()=>{const i=k.current;if(!i)return;const b=le.get(i);if(!b)return;const{program:x}=b;if(!x.uniformLocations)return;const o=x.uniforms;l.current=g,o.uSpeed.value=w,o.uAmplitude.value=R,o.uWaveScale.value=E,o.uWaveRatio.value=A,o.uSwell.value=B,o.uTurbulence.value=C,o.uTilt.value=h,o.uZoom.value=m,o.uHeight.value=W,o.uFogDepth.value=V,o.uSteps.value=Pe(L),o.uBrightness.value=q,o.uOpacity.value=z,o.uGrain.value=X?1:0,o.uGrainIntensity.value=I,o.uParallax.value=H,o.uEnableMouse.value=g?1:0;const f=o.uHorizonColor.value,S=o.uWaveColor.value,T=o.uCrestColor.value,n=ie(a),d=ie(u),y=ie(v);f[0]=n[0],f[1]=n[1],f[2]=n[2],S[0]=d[0],S[1]=d[1],S[2]=d[2],T[0]=y[0],T[1]=y[1],T[2]=y[2]},[a,u,v,w,R,E,A,B,C,h,m,W,V,L,q,z,X,I,g,H]),e.jsx("div",{ref:k,className:`gradient-waves-container ${Z}`.trim(),style:F})},Xe=({onNavigate:a})=>{const[u,v]=s.useState(()=>Q.getSettings()),[w,R]=s.useState(()=>Q.getExtracurriculars()),[E,A]=s.useState("");s.useEffect(()=>{const h=Q.subscribe(()=>{const m=Q.getExtracurriculars();m&&m.length>0&&R(m),v(Q.getSettings())});return Se().then(m=>{m&&m.length>0&&R(m)}).catch(()=>{}),()=>h()},[]);const B=h=>{h.preventDefault(),E.trim()?a(`/verify/${encodeURIComponent(E.trim())}`):a("/verify")},C=s.useMemo(()=>(w.length>0?w:Q.getExtracurriculars()).slice(0,5).map(m=>({id:m.id,image:m.profile_image,label:m.name,bio:m.short_description,link:`/ekskul/${m.slug}`})),[w]);return e.jsxs("div",{className:"bg-white min-h-screen font-sans",children:[e.jsxs("section",{className:"relative overflow-hidden bg-gradient-to-b from-[#F9F8F6] via-white to-white pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-[#EAE6DC]",children:[e.jsx("div",{className:"absolute inset-0 z-0 pointer-events-auto",children:e.jsx(Ie,{horizonColor:"#F9F8F6",waveColor:"#D15B40",crestColor:"#FFF5F2",speed:.28,amplitude:2,waveScale:.55,waveRatio:.85,swell:28,turbulence:16,tilt:1.15,zoom:1.05,height:5,fogDepth:18,detail:"medium",brightness:1.05,opacity:.35,mouseInteraction:!0,parallaxStrength:.4,grain:!0,grainIntensity:.03})}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-[#F9F8F6]/30 via-white/50 to-white pointer-events-none z-[1]"}),e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10",children:[e.jsxs(Me,{variant:"success",className:"mb-6 mx-auto inline-flex shadow-sm bg-[#FDEDE9] text-[#D15B40] border-[#F2C9C0]",children:["Tahun Ajaran ",u.academic_year]}),e.jsxs("h1",{className:"text-4xl md:text-6xl font-extrabold text-[#171717] tracking-tight mb-6 max-w-4xl mx-auto leading-tight",children:[e.jsx(pe,{text:"Sistem Informasi Terpadu Ekstrakurikuler",splitBy:"word",hinge:"top",trigger:"mount",duration:.7,stagger:.05,fontSize:"inherit",fontWeight:"inherit",color:"#171717",className:"inline"})," ",e.jsx("span",{className:"text-[#D15B40] inline-block",children:e.jsx(pe,{text:u.school_name,splitBy:"word",hinge:"top",trigger:"mount",duration:.7,stagger:.05,fontSize:"inherit",fontWeight:"inherit",color:"#D15B40",className:"inline"})})]}),e.jsx("p",{className:"text-lg md:text-xl text-[#68655F] mb-10 max-w-2xl mx-auto",children:"Kelola pendaftaran ekskul, presensi digital, pencatatan prestasi, hingga pencetakan portofolio non-akademik resmi dengan validasi publik."}),e.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-center gap-4",children:[e.jsx(se,{size:"lg",onClick:()=>a("/login"),icon:e.jsx(be,{className:"w-5 h-5"}),className:"w-full sm:w-auto shadow-md",children:"Masuk ke Portal"}),e.jsx(se,{variant:"outline",size:"lg",onClick:()=>a("/ekskul"),icon:e.jsx(ye,{className:"w-5 h-5"}),className:"w-full sm:w-auto bg-white",children:"Jelajahi Katalog Ekskul"})]})]})]}),e.jsx("section",{className:"py-0 relative z-10 max-w-4xl mx-auto px-4 -mt-12",children:e.jsxs("div",{className:"bg-white border border-[#EAE6DC] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("h3",{className:"font-bold text-lg text-[#171717] flex items-center gap-2 mb-1",children:[e.jsx(ke,{className:"w-5 h-5 text-[#D15B40]"})," Verifikasi Dokumen"]}),e.jsx("p",{className:"text-sm text-[#68655F]",children:"Masukkan kode sertifikat atau portofolio untuk mengecek validitas data institusional."})]}),e.jsxs("form",{onSubmit:B,className:"flex-1 flex w-full gap-3",children:[e.jsx("input",{type:"text",placeholder:"Masukkan nomor verifikasi dokumen (misal: EKH-...)",value:E,onChange:h=>A(h.target.value),className:"flex-1 px-4 py-3 bg-[#F9F8F6] border border-[#EAE6DC] rounded-xl text-sm font-medium focus:outline-none focus:border-[#D15B40] focus:ring-1 focus:ring-[#D15B40] transition-all"}),e.jsx(se,{type:"submit",size:"lg",className:"rounded-xl",children:"Cek Data"})]})]})}),e.jsx("section",{className:"py-24 bg-[#F9F8F6] border-b border-[#EAE6DC]",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"flex flex-col md:flex-row items-end justify-between mb-12 gap-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl font-bold text-[#171717] tracking-tight",children:"Eksplorasi Ekstrakurikuler"}),e.jsx("p",{className:"text-[#68655F] mt-3 text-lg max-w-2xl",children:"Temukan berbagai pilihan kegiatan ekstrakurikuler unggulan untuk mengembangkan potensi dan bakat siswa secara maksimal."})]}),e.jsx(se,{variant:"outline",onClick:()=>a("/ekskul"),icon:e.jsx(he,{className:"w-4 h-4"}),children:"Lihat Semua Katalog"})]}),e.jsx(Ae,{items:C,defaultIndex:2,expandRatio:.6,height:360,trigger:"hover",onNavigate:a,accentColor:"#D15B40"})]})}),e.jsx("section",{className:"py-24 bg-white",children:e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"text-center mb-16",children:[e.jsx("h2",{className:"text-3xl font-bold text-[#171717] tracking-tight",children:"Alur Digital Terpadu"}),e.jsx("p",{className:"text-[#68655F] mt-4 text-lg",children:"Platform end-to-end dari pemilihan ekskul hingga pelaporan akhir."})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-6",children:[{title:"Pendaftaran Online",desc:"Siswa dapat memilih dan mendaftar ekskul secara mandiri melalui katalog interaktif tanpa formulir kertas.",icon:we},{title:"Presensi Sesi Latihan",desc:"Pengurus mencatat kehadiran secara real-time yang akan dipantau langsung oleh guru pembina.",icon:je},{title:"Validasi Prestasi",desc:"Kesiswaan mengesahkan capaian juara, kepanitiaan, dan organisasi ke dalam rekam jejak siswa.",icon:Ce},{title:"Portofolio Terintegrasi",desc:"Cetak lembar portofolio digital bertanda-tangan dengan barcode resmi untuk syarat kelulusan.",icon:Fe}].map((h,m)=>e.jsxs("div",{className:"bg-[#F9F8F6] p-8 rounded-2xl border border-[#EAE6DC] hover:shadow-md transition-shadow hover:border-[#D8D4CC] group",children:[e.jsx("div",{className:"w-14 h-14 bg-white border border-[#EAE6DC] rounded-xl flex items-center justify-center text-[#D15B40] mb-6 group-hover:scale-110 transition-transform",children:e.jsx(h.icon,{className:"w-6 h-6"})}),e.jsx("h3",{className:"font-bold text-lg mb-3 text-[#171717]",children:h.title}),e.jsx("p",{className:"text-sm text-[#68655F] leading-relaxed",children:h.desc})]},m))})]})})]})};export{Xe as HomePage};
