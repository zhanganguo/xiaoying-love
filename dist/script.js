/* 楹你而心动 — a private, dependency-free interactive love letter.
 * Original photographs remain untouched. All particles and music are generated locally.
 */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 700px)");
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const random = (a, b) => Math.random() * (b - a) + a;

  // Header, chapter progress, small-screen navigation and entrance choreography.
  const header = $("#siteHeader");
  const progress = $("#scrollProgress");
  const nav = $("#mainNav");
  const navToggle = $("#navToggle");
  const navLinks = $$(".main-nav a");
  const sections = $$(".chapter-section");
  let currentScene = "night";

  function updateScroll() {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maximum > 0 ? (window.scrollY / maximum) * 100 : 0}%`;
    header.classList.toggle("scrolled", window.scrollY > 32);
    const focusLine = window.innerHeight * .43;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= focusLine) active = section;
    }
    currentScene = active.dataset.scene || "night";
    navLinks.forEach(a => a.classList.toggle("active", a.hash === `#${active.id}`));
  }
  let scrollScheduled = false;
  window.addEventListener("scroll", () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => { updateScroll(); scrollScheduled = false; });
  }, { passive: true });
  updateScroll();

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "收起导航" : "展开导航");
  });
  navLinks.forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));
  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: .08, rootMargin: "0px 0px -16px 0px" });
    $$(".reveal").forEach(el => observer.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("visible"));
  }

  $$(".reason-card").forEach(card => card.addEventListener("click", () => {
    const flipped = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", String(flipped));
  }));

  // Reusable notification, with no library or telemetry.
  const toastEl = $("#toast");
  let toastTimer = 0;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3400);
  }

  // Open an old-fashioned envelope before presenting the full readable letter.
  const envelopeScene = $("#envelopeScene");
  const openLetter = $("#openLetter");
  const letterPaper = $("#letterPaper");
  let letterOpened = false;
  openLetter.addEventListener("click", () => {
    if (letterOpened) {
      letterPaper.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      return;
    }
    letterOpened = true;
    envelopeScene.classList.add("opened");
    openLetter.setAttribute("aria-expanded", "true");
    $("#envelopePrompt").textContent = "信已经打开了，下面是小安想慢慢对你说的话 ♡";
    window.setTimeout(() => {
      letterPaper.hidden = false;
      window.setTimeout(() => letterPaper.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" }), 100);
    }, reducedMotion.matches ? 0 : 920);
  });

  $("#downloadLetter").addEventListener("click", () => {
    const title = "小安写给小楹的情书";
    const text = [title, "", ...$$('.letter-part').map(part => {
      const heading = $("h4", part)?.textContent || "";
      return [heading, ...$$('p', part).map(p => p.textContent.trim())].join("\n\n");
    }), "", "永远喜欢你的小安", "小安 ♡ 小楹"].join("\n\n");
    const blob = new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "小安写给小楹的情书.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2500);
    toast("这封信，已经为你装进小小的珍藏里 ♡");
  });

  // A gentle burst of rose petals around the click, then the wish appears.
  const roseWishes = [
    "愿小楹的每一天，都有值得微笑的理由。 ♡",
    "愿你永远自由、快乐，被生活温柔以待。 ♡",
    "小安送你的这朵玫瑰，会一直为你盛开。 ♡"
  ];
  let roseWishNumber = 0;
  $("#roseWish").addEventListener("click", event => {
    $("#roseResponse").textContent = roseWishes[roseWishNumber++ % roseWishes.length];
    spawnPetalBurst(event.clientX, event.clientY, mobile.matches ? 16 : 30);
  });

  // Five glowing interactive stars, linked by fine gold light as they are discovered.
  const notes = [
    ["遇见 · 好幸运是你", "在人来人往的世界里，能够认识你，已经是一份让我常常感到幸运的礼物。"],
    ["心动 · 喜欢你的笑", "有些光不在天上，而在你望向镜头、笑起来的那一瞬间。"],
    ["想念 · 一点点牵挂", "看到好看的天空、有趣的事情，我总会想到，如果能分享给你就好了。"],
    ["陪伴 · 慢慢走就好", "我想陪你走过明亮的日子，也尊重你需要安静和休息的时刻。"],
    ["未来 · 继续写故事", "希望我们的相册里，以后还有很多很多张，让我们看着就忍不住微笑的照片。"]
  ];
  const litStars = new Set();
  const starButtons = $$(".star-point");
  const starChart = $("#starChart");
  const starLines = $("#starLines");
  function redrawLines() {
    const chartRect = starChart.getBoundingClientRect();
    const width = chartRect.width, height = chartRect.height;
    starLines.setAttribute("viewBox", `0 0 ${width} ${height}`);
    starLines.replaceChildren();
    const activePoints = [...litStars].sort((a, b) => a - b).map(n => {
      const rect = starButtons[n].getBoundingClientRect();
      return { x: rect.left + rect.width / 2 - chartRect.left, y: rect.top + rect.height / 2 - chartRect.top };
    });
    for (let i = 1; i < activePoints.length; i++) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(activePoints[i - 1].x));
      line.setAttribute("y1", String(activePoints[i - 1].y));
      line.setAttribute("x2", String(activePoints[i].x));
      line.setAttribute("y2", String(activePoints[i].y));
      starLines.appendChild(line);
    }
    if (activePoints.length === 5) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(activePoints[4].x));
      line.setAttribute("y1", String(activePoints[4].y));
      line.setAttribute("x2", String(activePoints[0].x));
      line.setAttribute("y2", String(activePoints[0].y));
      starLines.appendChild(line);
    }
  }
  starButtons.forEach(button => button.addEventListener("click", () => {
    const index = Number(button.dataset.star);
    litStars.add(index);
    button.classList.add("lit");
    $("#starNoteTitle").textContent = notes[index][0];
    $("#starNote").textContent = notes[index][1];
    $("#starCount").textContent = `${litStars.size} / 5`;
    redrawLines();
    if (litStars.size === 5) {
      $("#starReveal").hidden = false;
      toast("五颗星星全部亮了，这片星空属于小安和小楹 ♡");
    }
  }));

  // Gallery: the uploaded files are real moments, shown in their original form.
  const photographs = [
    ["assets/photos/01-together-portrait.jpg", "小安和小楹 · 把此刻珍藏"],
    ["assets/photos/02-together-landscape.jpg", "同一片灯光下，身边恰好是你"],
    ["assets/photos/03-waterfall.jpg", "小楹 · 风景里最特别的那个人"],
    ["assets/photos/04-portrait-dress.jpg", "小楹 · 我的玫瑰女孩"],
    ["assets/photos/05-portrait-feather.jpg", "小楹 · 温柔如你"],
    ["assets/photos/06-call-01.jpg", "隔着屏幕的陪伴 · 01"],
    ["assets/photos/07-call-02.jpg", "隔着屏幕的陪伴 · 02"],
    ["assets/photos/08-call-03.jpg", "隔着屏幕的陪伴 · 03"],
    ["assets/photos/09-call-04.jpg", "隔着屏幕的陪伴 · 04"]
  ];
  const dialog = $("#photoLightbox");
  const lightboxImage = $("#lightboxImage");
  let currentPhoto = 0;
  function showPhoto(index) {
    currentPhoto = (index + photographs.length) % photographs.length;
    lightboxImage.src = photographs[currentPhoto][0];
    lightboxImage.alt = photographs[currentPhoto][1];
    $("#lightboxCaption").textContent = photographs[currentPhoto][1];
    $("#lightboxIndex").textContent = `${String(currentPhoto + 1).padStart(2,"0")} / 09`;
  }
  $$('[data-photo]').forEach(button => button.addEventListener("click", () => {
    showPhoto(Number(button.dataset.photo));
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("lightbox-open");
  }));
  function closeLightbox() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    document.body.classList.remove("lightbox-open");
  }
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => showPhoto(currentPhoto - 1));
  $("#lightboxNext").addEventListener("click", () => showPhoto(currentPhoto + 1));
  dialog.addEventListener("click", event => { if (event.target === dialog) closeLightbox(); });
  dialog.addEventListener("close", () => document.body.classList.remove("lightbox-open"));
  document.addEventListener("keydown", event => {
    if (!dialog.open) return;
    if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
    if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  });

  // Light, original Web Audio sketch; it starts only after the visitor's click.
  const musicToggle = $("#musicToggle");
  let audioContext = null, master = null, musicTimer = null, step = 0, nextTime = 0, playing = false;
  const chordNotes = [
    [261.63, 329.63, 392, 493.88],
    [220, 261.63, 329.63, 392],
    [174.61, 261.63, 329.63, 440],
    [196, 293.66, 392, 493.88]
  ];
  const melody = [523.25,659.25,783.99,659.25,587.33,523.25,440,523.25,
    493.88,523.25,659.25,587.33,523.25,440,392,440,
    440,523.25,659.25,698.46,659.25,523.25,440,392,
    392,493.88,587.33,659.25,587.33,493.88,392,523.25];
  function playTone(freq, when, seconds, volume = .07) {
    if (!audioContext || !master) return;
    const oscillator = audioContext.createOscillator();
    const overtone = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const lowpass = audioContext.createBiquadFilter();
    oscillator.type = "sine";
    overtone.type = "triangle";
    oscillator.frequency.setValueAtTime(freq, when);
    overtone.frequency.setValueAtTime(freq * 2, when);
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1700;
    gain.gain.setValueAtTime(.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + .025);
    gain.gain.exponentialRampToValueAtTime(Math.max(volume * .32, .0002), when + .28);
    gain.gain.exponentialRampToValueAtTime(.0001, when + seconds);
    oscillator.connect(gain);
    overtone.connect(gain);
    gain.connect(lowpass).connect(master);
    oscillator.start(when);
    overtone.start(when);
    oscillator.stop(when + seconds + .03);
    overtone.stop(when + seconds + .03);
    oscillator.onended = () => { oscillator.disconnect(); overtone.disconnect(); gain.disconnect(); lowpass.disconnect(); };
  }
  function scheduleMusic() {
    if (!audioContext || !playing) return;
    while (nextTime < audioContext.currentTime + .45) {
      const cycle = Math.floor(step / 8) % 4;
      const local = step % 8;
      if (local === 0) chordNotes[cycle].forEach((freq, i) => playTone(freq, nextTime + i * .06, 4, .024));
      if ([0, 2, 3, 5, 6].includes(local)) playTone(melody[step % melody.length], nextTime, 1.7, .048);
      step++;
      nextTime += .49;
    }
  }
  async function startMusic() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) { toast("当前浏览器暂不支持音乐播放"); return; }
      if (!audioContext) {
        audioContext = new Ctx();
        master = audioContext.createGain();
        master.gain.value = .35;
        master.connect(audioContext.destination);
      }
      await audioContext.resume();
      playing = true;
      nextTime = audioContext.currentTime + .1;
      scheduleMusic();
      musicTimer = window.setInterval(scheduleMusic, 220);
      musicToggle.setAttribute("aria-pressed", "true");
      musicToggle.setAttribute("aria-label", "关闭背景音乐");
      toast("轻轻的钢琴旋律已经响起 ♪");
    } catch (error) {
      toast("音乐暂时无法播放，请检查浏览器音频权限");
    }
  }
  async function stopMusic() {
    playing = false;
    clearInterval(musicTimer);
    musicTimer = null;
    if (audioContext?.state === "running") await audioContext.suspend();
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "开启背景音乐");
  }
  musicToggle.addEventListener("click", () => playing ? stopMusic() : startMusic());
  document.addEventListener("visibilitychange", () => {
    if (!audioContext || !playing) return;
    if (document.hidden) audioContext.suspend();
    else audioContext.resume().then(() => { nextTime = audioContext.currentTime + .1; });
  });

  // Star glitter, falling petals and a rare slow shooting star.
  const ambient = $("#ambientCanvas");
  const context = ambient.getContext("2d", { alpha: true });
  const petals = [];
  let stars = [], streak = null, width = 0, height = 0, lastTick = 0, lastMeteor = 0, ambientId = 0;
  let pixelRatio = 1;
  function setCanvasSize(canvas, ctx) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return ratio;
  }
  function prepareAmbient() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = setCanvasSize(ambient, context);
    const count = Math.min(mobile.matches ? 88 : 165, Math.round(width * height / 7900));
    stars = Array.from({ length: count }, () => ({ x: random(0,width), y:random(0,height), r:random(.5,2), a:random(.18,.72), speed:random(.3,1.4), phase:random(0,6.3) }));
    petals.length = 0;
    for (let i = 0; i < (mobile.matches ? 7 : 15); i++) petals.push(newPetal(random(0,width), random(0,height), false));
  }
  function newPetal(x, y, burst) {
    return {x,y, born:performance.now(), vx:burst?random(-2.7,2.7):random(-.45,.45), vy:burst?random(-3.5,-.3):random(.18,.7), rotation:random(0,6.28), vr:random(-.022,.022), r:random(3,burst?8:6), alpha:random(.2,.59), burst};
  }
  function spawnPetalBurst(x,y,count) {
    for (let i = 0; i < count; i++) petals.push(newPetal(x,y,true));
    if (petals.length > 150) petals.splice(0,petals.length - 150);
  }
  function drawPetal(p) {
    context.save();
    context.translate(p.x,p.y);
    context.rotate(p.rotation);
    context.globalAlpha = p.alpha;
    context.fillStyle = p.burst ? "#ffd2dd" : "#f0b1cc";
    context.beginPath();
    context.moveTo(0,-p.r * 1.45);
    context.bezierCurveTo(p.r * 1.3,-p.r * .6,p.r * .9,p.r * 1.05,0,p.r * 1.5);
    context.bezierCurveTo(-p.r * .9,p.r * 1.05,-p.r * 1.3,-p.r * .6,0,-p.r * 1.45);
    context.fill();
    context.restore();
  }
  function drawAmbient(now) {
    const delta = clamp((now - (lastTick || now)) / 16.67, .25, 2.3);
    lastTick = now;
    context.clearRect(0,0,width,height);
    const lowVisibility = ["letter","dawn"].includes(currentScene);
    const starAlpha = lowVisibility ? .23 : 1;
    for (const s of stars) {
      const twinkle = .72 + Math.sin(now * .001 * s.speed + s.phase) * .28;
      context.globalAlpha = s.a * twinkle * starAlpha;
      context.fillStyle = s.r > 1.35 ? "#ffe1d9" : "#eee2ff";
      context.beginPath(); context.arc(s.x,s.y,s.r,0,Math.PI * 2); context.fill();
    }
    context.globalAlpha = 1;
    if (now - lastMeteor > 8500 && ["night","moon","finale"].includes(currentScene)) {
      lastMeteor = now;
      streak = { x:random(width * .55,width * .97), y:random(0,height * .28), length:0, life:0 };
    }
    if (streak) {
      streak.life += delta;
      streak.length += 8 * delta;
      const gx = streak.x - streak.length;
      const gy = streak.y + streak.length * .48;
      const gradient = context.createLinearGradient(streak.x,streak.y,gx,gy);
      gradient.addColorStop(0,"rgba(255,252,240,0)"); gradient.addColorStop(.75,"rgba(255,224,220,.52)"); gradient.addColorStop(1,"rgba(255,250,225,.96)");
      context.strokeStyle = gradient; context.lineWidth = 1.6;
      context.beginPath(); context.moveTo(streak.x,streak.y); context.lineTo(gx,gy); context.stroke();
      if (streak.life > 50) streak = null;
    }
    const showPetals = ["rose","gallery","finale","letter"].includes(currentScene);
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.rotation += p.vr * delta;
      if (p.burst) {
        p.vy += .045 * delta;
        p.alpha -= .0033 * delta;
      }
      if (p.y > height + 25 || p.x < -45 || p.x > width + 45 || p.alpha <= 0) {
        if (p.burst) petals.splice(i,1);
        else petals[i] = newPetal(random(0,width),-22,false);
      } else if (showPetals || p.burst) drawPetal(p);
    }
    context.globalAlpha = 1;
    if (!reducedMotion.matches && !document.hidden) ambientId = requestAnimationFrame(drawAmbient);
  }
  prepareAmbient();
  ambientId = requestAnimationFrame(drawAmbient);

  // Last scene: soft golden particles first gather into a heart, then fade away.
  const fireworksCanvas = $("#fireworksCanvas");
  const fireworksCtx = fireworksCanvas.getContext("2d", { alpha: true });
  let heartParticles = [], fireworkId = 0, fireworkStart = 0;
  function prepareFireworks() { setCanvasSize(fireworksCanvas,fireworksCtx); }
  prepareFireworks();
  function heartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t),3);
    const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
    return {x,y};
  }
  function celebrate() {
    $("#finaleAfter").textContent = "小楹，今天的全部星光，都想送给你。 ♡";
    toast("这颗心，送给最特别的小楹 ♡");
    if (reducedMotion.matches) return;
    cancelAnimationFrame(fireworkId);
    prepareFireworks();
    const cx = window.innerWidth * .5, cy = window.innerHeight * .43;
    const scale = Math.min(window.innerWidth / 45, 14);
    heartParticles = [];
    for (let i = 0; i < (mobile.matches ? 180 : 300); i++) {
      const angle = i / (mobile.matches ? 180 : 300) * Math.PI * 2;
      const point = heartPoint(angle);
      heartParticles.push({
        x: cx + random(-80,80), y: window.innerHeight + random(0,100),
        tx:cx + point.x * scale + random(-5,5), ty:cy - point.y * scale + random(-5,5),
        dx:random(-1.5,1.5),dy:random(-2,1),r:random(1.2,3.1),hue:Math.random() < .45 ? 35 : 345,phase:random(0,6.28)
      });
    }
    fireworkStart = performance.now();
    function frame(now) {
      const elapsed = now - fireworkStart;
      const gather = clamp(elapsed / 1650,0,1);
      const ease = 1 - Math.pow(1-gather,3);
      fireworksCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
      for (const p of heartParticles) {
        let x = p.x + (p.tx-p.x)*ease;
        let y = p.y + (p.ty-p.y)*ease;
        let alpha = 1;
        if (elapsed > 2200) {
          const fade = (elapsed-2200)/2600;
          x = p.tx + p.dx * fade * 125;
          y = p.ty + p.dy * fade * 110 + fade * fade * 38;
          alpha = 1 - fade;
        }
        if (alpha <= 0) continue;
        fireworksCtx.globalAlpha = clamp(alpha * (.75 + Math.sin(now*.008+p.phase)*.25),0,1);
        fireworksCtx.fillStyle = p.hue === 35 ? "#ffe5b9" : "#ffc2d7";
        fireworksCtx.shadowColor = p.hue === 35 ? "#ffe2ab" : "#ff98c7";
        fireworksCtx.shadowBlur = 14;
        fireworksCtx.beginPath(); fireworksCtx.arc(x,y,p.r,0,Math.PI*2); fireworksCtx.fill();
      }
      fireworksCtx.shadowBlur = 0; fireworksCtx.globalAlpha = 1;
      if (elapsed < 4800) fireworkId = requestAnimationFrame(frame);
      else fireworksCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
    }
    fireworkId = requestAnimationFrame(frame);
  }
  $("#fireworksButton").addEventListener("click", celebrate);

  $("#secretHeart").addEventListener("click", () => {
    const note = $("#secretNote");
    note.hidden = !note.hidden;
    if (!note.hidden) spawnPetalBurst(window.innerWidth/2,window.innerHeight*.75,18);
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      prepareAmbient(); prepareFireworks(); redrawLines(); updateScroll();
      if (reducedMotion.matches) drawAmbient(performance.now());
    }, 130);
  });
  reducedMotion.addEventListener?.("change", () => {
    cancelAnimationFrame(ambientId);
    if (!reducedMotion.matches) ambientId = requestAnimationFrame(drawAmbient);
    else drawAmbient(performance.now());
  });
})();
