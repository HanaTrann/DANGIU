const canvas = document.getElementById("flower");
if (!canvas) {
    console.error("Không tìm thấy canvas có id flower!");
} else {
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let time = 0;
    let isStarted = false;
    let isSwaying = true;
    let stemProgress = 0;
    let bloomScale = 0;
    let jellyProgress = 0;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        if (typeof initSparklingBackground === "function") {
            initSparklingBackground(180, width, height);
        }
        if (typeof initWelcomeHearts === "function") {
            initWelcomeHearts(35, width, height);
        }
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function initEvents() {
        const welcomeScreen = document.getElementById("welcome-screen");
        const controlsMenu = document.getElementById("controls-menu");
        const btnStart = document.getElementById("btn-start");
        const btnReplay = document.getElementById("btn-replay");

        if (btnStart) {
            btnStart.addEventListener("click", () => {
                if (welcomeScreen) welcomeScreen.classList.add("fade-out");
                if (controlsMenu) controlsMenu.classList.remove("hidden");

                // Khởi tạo đàn sứa ban đầu
                if (typeof initJellyfish === "function") {
                    initJellyfish(null, width, height);
                }

                stemProgress = 0;
                bloomScale = 0;
                jellyProgress = 0;
                isStarted = true;
            });
        }

        if (btnReplay) {
            btnReplay.addEventListener("click", () => {
                // Reset tiến trình hoa và sứa
                stemProgress = 0;
                bloomScale = 0;
                jellyProgress = 0;

                // Tải lại đàn sứa bơi từ đầu
                if (typeof initJellyfish === "function") {
                    initJellyfish(null, width, height);
                }
            });
        }
    } // Đã thêm dấu đóng ngoặc nhọn bị thiếu ở đây!

    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", initEvents);
    } else {
        initEvents();
    }

    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#061116");
        gradient.addColorStop(1, "#01090c");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    function animate() {
        if (isSwaying) time++;

        ctx.clearRect(0, 0, width, height);
        drawBackground();

        // 1. MÀN HÌNH CHÀO BAN ĐẦU: Vẽ Trái tim bay lung linh
        if (!isStarted) {
            if (typeof drawWelcomeHearts === "function") {
                drawWelcomeHearts(ctx, width, height);
            }
        }
        // 2. KHI ĐÃ BẤM NÚT: Vẽ Bầu trời sao -> Sứa bay siêu tốc -> Hoa nở
        else {
            if (typeof drawSparklingBackground === "function") {
                drawSparklingBackground(ctx);
            }

            if (typeof drawJellyfishSquad === "function" && jellyProgress < 1) {
                jellyProgress = drawJellyfishSquad(ctx, width, height);
            }

            if (jellyProgress > 0.80) {
                if (stemProgress < 1) {
                    stemProgress += 0.016;
                    if (stemProgress > 1) stemProgress = 1;
                }

                if (stemProgress > 0.25 && bloomScale < 1) {
                    bloomScale += 0.022;
                    if (bloomScale > 1) bloomScale = 1;
                }

                if (typeof drawParticles === "function") {
                    drawParticles(ctx, width, height, time);
                }

                if (typeof drawGarden === "function") {
                    drawGarden(ctx, width, height, time, stemProgress, bloomScale);
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}
