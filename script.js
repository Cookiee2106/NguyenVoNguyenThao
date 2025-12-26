// DOM Elements
const wrapper = document.querySelector(".wrapper");
const question = document.querySelector(".question");
const gif = document.querySelector(".gif");
const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");
const contentBox = document.querySelector(".content-box");
const attemptCount = document.getElementById("attempt-count");
const heartsContainer = document.querySelector(".hearts-container");

// Counter for "No" button attempts
let attempts = 0;

// Create floating hearts background
function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 6000);
    }, 800);
}

// Confetti effect
class ConfettiParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.color = this.randomColor();
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 10 - 5;
    }
    
    randomColor() {
        const colors = ['#ff6b9d', '#c44569', '#f8b500', '#3c40c6', '#05c46b', '#ffa801', '#ff5e57'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;
        
        if (this.y > this.canvas.height) {
            this.y = -10;
            this.x = Math.random() * this.canvas.width;
        }
    }
    
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate((this.angle * Math.PI) / 180);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        this.ctx.restore();
    }
}

class ConfettiEffect {
    constructor() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    start(duration = 5000) {
        // Create particles
        for (let i = 0; i < 150; i++) {
            this.particles.push(new ConfettiParticle(this.canvas));
        }
        
        this.animate();
        
        // Stop after duration
        setTimeout(() => {
            this.stop();
        }, duration);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    stop() {
        cancelAnimationFrame(this.animationId);
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const confetti = new ConfettiEffect();

// Yes button click event
yesBtn.addEventListener("click", () => {
    // Update text and gif
    question.innerHTML = "Yayyyy! Tài cũng yêu Thảo nhiều lắm 😘💕";
    gif.src = "https://media.giphy.com/media/gdspgdOIV1HxhnxQOH/giphy.gif";
    
    // Add success state
    contentBox.classList.add('success-state');
    
    // Hide No button
    noBtn.style.display = 'none';
    
    // Center Yes button
    yesBtn.style.position = 'relative';
    yesBtn.style.margin = '0 auto';
    
    // Update Yes button text
    yesBtn.innerHTML = '<span class="btn-text">Tài cũng yêu Thảo ❤️❤️❤️</span>';
    yesBtn.style.width = '250px';
    
    // Launch confetti
    confetti.start(6000);
    
    // Create extra hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '💕';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = Math.random() * 20 + 15 + 'px';
            heartsContainer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
});

// No button hover event - make it run away
noBtn.addEventListener("mouseover", () => {
    // Increment attempt counter
    attempts++;
    attemptCount.textContent = attempts;
    
    // Get button and window dimensions
    const noBtnRect = noBtn.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Calculate max positions (keep button within wrapper)
    const maxX = wrapperRect.width - noBtnRect.width - 40;
    const maxY = wrapperRect.height - noBtnRect.height - 40;
    
    // Generate random position
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    // Apply position
    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
    
    // Increase Yes button size as user tries to click No
    const newSize = 150 + attempts * 5;
    if (newSize <= 250) {
        yesBtn.style.width = newSize + 'px';
        yesBtn.style.height = (60 + attempts * 2) + 'px';
    }
    
    // Shake effect on question
    question.classList.add('shake');
    setTimeout(() => {
        question.classList.remove('shake');
    }, 500);
    
    // Change question text based on attempts
    if (attempts === 3) {
        question.innerHTML = "Thảo ơiii, đừng bấm Không nữa mà 🥺";
    } else if (attempts === 5) {
        question.innerHTML = "Tài buồn lắm rồi đó Thảo 😢";
    } else if (attempts === 8) {
        question.innerHTML = "Xin Thảo đấy, yêu Tài đi mà 🥺💕";
    } else if (attempts >= 10) {
        question.innerHTML = "Biết rồi, Thảo yêu Tài, chỉ đang chọc Tài thôi đúng không? 😊❤️";
        // Make No button tiny
        noBtn.style.width = '50px';
        noBtn.style.height = '30px';
        noBtn.style.fontSize = '0.7em';
    }
});

// No button click event (in case someone actually clicks it)
noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Nút này không bấm được đâu Thảo ơi! 😝");
});

// Touch events for mobile
noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    noBtn.dispatchEvent(new Event('mouseover'));
});

// Initialize floating hearts
createFloatingHearts();

// Add some fun messages to console
console.log("%c❤️ Made with love by Đại Tài ❤️", "color: #e94d58; font-size: 20px; font-weight: bold;");
console.log("%cDành tặng Thảo xinh đẹp của Tài 💕", "color: #667eea; font-size: 16px;");

