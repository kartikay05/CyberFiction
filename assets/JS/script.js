function locomotive() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}
locomotive();


// ------------------ Canvas Animation ------------------ //
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
  ScrollTrigger.refresh(); // keep animations synced on resize
});

// Generate image file paths dynamically
function files(index) {
  let idx = String(index + 1).padStart(4, "0");
  return `/assets/Images/male${idx}.png`;
}

const frameCount = 300;
const images = [];
const imageSeq = { frame: 0 };

// Preload images
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = files(i);
  if (i === 0) {
    img.onload = render;  // show first frame ASAP
  }
  images.push(img);
}

// GSAP scroll animation for sequence
gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.15,
    trigger: "#page>canvas",
    start: "top top",
    end: "600% top",
    scroller: "#main",
  },
  onUpdate: render,
});

// Draw the image to canvas
function render() {
  if (images[imageSeq.frame]) {
    scaleImage(images[imageSeq.frame], context);
  }
}

function scaleImage(img, ctx) {
  const canvas = ctx.canvas;
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );
}

// Pin canvas
ScrollTrigger.create({
  trigger: "#page>canvas",
  pin: true,
  pinSpacing: true,  
  scroller: "#main",
  start: "top top",
  end: "600% top",
  scrub: true
});


// Pin text sections (Page1 → Page6)
["#page1", "#page2", "#page3", "#page4", "#page5", "#page6"].forEach((id) => {
  gsap.to(id, {
    scrollTrigger: {
      trigger: id,
      start: "top top",
      end: "bottom bottom",
      pin: true,
      scroller: "#main",
    },
  });
});

