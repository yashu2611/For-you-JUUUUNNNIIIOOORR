let highestZ = 1;

// disable context menu so right-click works for rotation on desktop
document.addEventListener("contextmenu", (e) => e.preventDefault());

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // ---------- DESKTOP MOUSE EVENTS ----------
    document.addEventListener("mousemove", (e) => {
      this.handleMove(e.clientX, e.clientY, paper);
    });

    paper.addEventListener("mousedown", (e) => {
      this.startDrag(e.clientX, e.clientY, e.button === 2, paper);
    });

    window.addEventListener("mouseup", () => {
      this.endDrag();
    });

    // ---------- MOBILE TOUCH EVENTS ----------
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.handleMove(touch.clientX, touch.clientY, paper);
      }
    });

    paper.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.startDrag(touch.clientX, touch.clientY, false, paper); // left-click equivalent
      }
    });

    window.addEventListener("touchend", () => {
      this.endDrag();
    });
  }

  handleMove(x, y, paper) {
    if (!this.rotating) {
      this.mouseX = x;
      this.mouseY = y;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    const dirX = x - this.mouseTouchX;
    const dirY = y - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (180 * angle) / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  startDrag(x, y, isRightClick, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    // ✅ Important: set mouse/touch positions at start
    this.mouseX = x;
    this.mouseY = y;

    this.mouseTouchX = this.mouseX;
    this.mouseTouchY = this.mouseY;
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;

    if (isRightClick) {
      this.rotating = true;
    }
  }

  endDrag() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
