const canvas = document.querySelector("#system-map");
const ctx = canvas?.getContext("2d");
const nodes = [];
const nodeCount = 48;

function resize() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * pixelRatio);
  canvas.height = Math.floor(window.innerHeight * pixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createNodes() {
  nodes.length = 0;

  for (let index = 0; index < nodeCount; index += 1) {
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 2.5 + 2.5,
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  nodes.forEach((node, index) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < -40) node.x = window.innerWidth + 40;
    if (node.x > window.innerWidth + 40) node.x = -40;
    if (node.y < -40) node.y = window.innerHeight + 40;
    if (node.y > window.innerHeight + 40) node.y = -40;

    for (let next = index + 1; next < nodes.length; next += 1) {
      const other = nodes[next];
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 200) {
        ctx.strokeStyle = `rgba(15, 118, 110, ${0.35 - distance / 600})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "rgba(11, 79, 73, 0.8)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

if (ctx) {
  window.addEventListener("resize", () => {
    resize();
    createNodes();
  });

  resize();
  createNodes();
  draw();
}

const sections = document.querySelectorAll("[data-animate]");
const navLinks = document.querySelectorAll("nav a");

if ("IntersectionObserver" in window) {
  document.body.classList.add("animations-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );

  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach((section) => section.classList.add("visible"));
}

function updateActiveNav() {
  let current = "";

  document.querySelectorAll("section[id]").forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();
