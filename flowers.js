//Đây là phần quan trọng nhất, phụ trách vẽ thân cây, lá, cánh hoa và nhụy hoa.
function drawStem(ctx, x, y, height, bend, sway) {
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Sửa các toán tử nhân * và trừ - bị thiếu trong bezierCurveTo
    ctx.bezierCurveTo(
        x + bend + sway, y - height * 0.4,
        x - bend + sway, y - height * 0.7,
        x + sway, y - height
    );

    ctx.strokeStyle = "#087b79";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00b9bb";

    ctx.stroke();
    ctx.shadowBlur = 0;

    // Trả về đúng vị trí ngọn cành để vẽ hoa bám vào
    return {
        x: x + sway,
        y: y - height
    };
}

function getLeafScale(stemProgress, appearanceThreshold) {
    if (stemProgress < appearanceThreshold) return 0;
    // Sau khi vượt ngưỡng appearanceThreshold, lá sẽ lớn dần trong khoảng 0.15 tiến trình
    const scale = (stemProgress - appearanceThreshold) / 0.15;
    return Math.min(1, Math.max(0, scale));
}
// Vẽ lá
function drawLeaf(ctx, x, y, angle, size, scale = 1) {
    if (scale <= 0) return;
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    const gradient = ctx.createLinearGradient(
        0, 0, size, -size
    );

    gradient.addColorStop(0, "#075b69");
    gradient.addColorStop(1, "#25c8d4");

    ctx.beginPath();

    ctx.moveTo(0, 0);

    ctx.quadraticCurveTo(
        size, -size * 1.2,
        size * 1.5, -size
    );

    ctx.quadraticCurveTo(
        size, size * 0.3,
        0, 0
    );

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#00c9dc";

    ctx.fill();

    ctx.restore();
    ctx.shadowBlur = 0;
}


// Vẽ cánh hoa
function drawPetal(ctx, size, angle) {

    ctx.save();
    ctx.rotate(angle);

    const gradient = ctx.createLinearGradient(
        0, -size, 0, size
    );

    gradient.addColorStop(0, "#c5ffff");
    gradient.addColorStop(0.48, "#65e1e2");
    gradient.addColorStop(1, "#078d9d");

    ctx.beginPath();

    ctx.ellipse(
        0, -size * 0.55,
        size * 0.38,
        size * 0.65,
        0, 0, Math.PI * 2
    );

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#36e8ed";

    ctx.fill();

    ctx.restore();
    ctx.shadowBlur = 0;
}


// Vẽ một bông hoa
function drawFlower(ctx, x, y, size, sway, bloomScale = 1) {
    if (bloomScale <= 0) return;
    const currentSize = size * bloomScale;
    ctx.save();
    ctx.translate(x, y);
    // ctx.translate(x + sway, y);

    for (let i = 0; i < 5; i++) {
        drawPetal(ctx, currentSize, (Math.PI * 2 / 5) * i);
    }

    // Nhụy hoa
    const center = ctx.createRadialGradient(0, 0, 1, 0, 0, currentSize * 0.3);
    center.addColorStop(0, "#fffbd0");
    center.addColorStop(0.6, "#e8f99a");
    center.addColorStop(1, "#69cdbb");

    ctx.beginPath();
    ctx.ellipse(0, 0, currentSize * 0.32, currentSize * 0.19, 0, 0, Math.PI * 2);
    ctx.fillStyle = center;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#e0ff8c";
    ctx.fill();

    ctx.restore();
    ctx.shadowBlur = 0;
}
function drawGrassBase(ctx, stemProgress) {
    ctx.save();

    // Tỉ lệ xuất hiện mượt theo tiến trình mọc
    const opacity = Math.min(1, stemProgress * 1.5);
    ctx.globalAlpha = opacity;

    // 1. Vẽ đường cong gò đất/thảm cỏ bo tròn mượt ở chân
    ctx.beginPath();
    ctx.moveTo(-250, 0);
    // Uốn đường cong mượt ôm lấy toàn bộ gốc cây
    ctx.bezierCurveTo(-150, -45, 150, -45, 250, 0);
    ctx.lineTo(250, 40);
    ctx.lineTo(-250, 40);
    ctx.closePath();

    // Gradient tạo màu cỏ mịn màng hợp tông nền
    const grassGradient = ctx.createLinearGradient(0, -45, 0, 40);
    grassGradient.addColorStop(0, "#0a5658");
    grassGradient.addColorStop(0.4, "#063d3e");
    grassGradient.addColorStop(1, "#021c1d");

    ctx.fillStyle = grassGradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00e5ff";
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2. Viền đường cong sáng phát sáng nhẹ ở mép trên gò cỏ
    ctx.beginPath();
    ctx.moveTo(-250, 0);
    ctx.bezierCurveTo(-150, -45, 150, -45, 250, 0);
    ctx.strokeStyle = "#16a8a0";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
}
// --- 1. LỚP TẠO NỀN LẤP LÁNH (SPARKLING BACKGROUND) ---
class StarSparkle {
    constructor(width, height) {
        this.reset(width, height);
    }

    reset(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 0.5 + Math.random() * 2;
        this.alpha = Math.random();
        this.speed = 0.01 + Math.random() * 0.03;
        this.color = Math.random() > 0.4 ? "#00f0ff" : (Math.random() > 0.5 ? "#ffffff" : "#e0ff8c");
    }

    update() {
        // Tăng giảm alpha tạo hiệu ứng nhấp nháy lấp lánh
        this.alpha += this.speed;
        if (this.alpha > 1 || this.alpha < 0) {
            this.speed = -this.speed;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let sparklingStars = [];

function initSparklingBackground(count = 100, width, height) {
    sparklingStars = [];
    for (let i = 0; i < count; i++) {
        sparklingStars.push(new StarSparkle(width, height));
    }
}

function drawSparklingBackground(ctx) {
    sparklingStars.forEach(star => {
        star.update();
        star.draw(ctx);
    });
}
class Jellyfish {
    constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight, true);
    }

    reset(width, height, isFirstTime = false) {
        this.x = Math.random() * width;
        // Bắt đầu từ dưới đáy màn hình với khoảng cách dải rộng hơn
        this.y = isFirstTime ? height + Math.random() * 600 : height + 100;
        this.size = 12 + Math.random() * 22;
        this.speed = 4.5 + Math.random() * 4.0; // Tốc độ bơi mượt
        this.pulse = Math.random() * Math.PI * 2;
        this.opacity = 0.3 + Math.random() * 0.6;
        this.color = Math.random() > 0.5 ? "#00f0ff" : "#8affff";
        this.isFinished = false; // Đánh dấu khi con sứa đã bay qua hẳn màn hình
    }

    update(width, height) {
        this.y -= this.speed;
        this.pulse += 0.05;

        // Nếu bay vượt khỏi đỉnh màn hình
        if (this.y < -120) {
            this.isFinished = true;
        }
    }

    draw(ctx) {
        if (this.isFinished) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;

        const pulseScale = 1 + Math.sin(this.pulse) * 0.15;
        const headWidth = this.size * pulseScale;
        const headHeight = (this.size * 0.8) / pulseScale;

        // Mũ sứa발광
        ctx.beginPath();
        ctx.ellipse(0, 0, headWidth, headHeight, 0, Math.PI, 0, false);

        const grad = ctx.createRadialGradient(0, -headHeight * 0.3, 2, 0, 0, headWidth);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.5, this.color);
        grad.addColorStop(1, "rgba(0, 185, 187, 0.05)");

        ctx.fillStyle = grad;
        ctx.shadowBlur = 18;
        ctx.shadowColor = this.color;
        ctx.fill();

        // Xúc giác sứa đung đưa
        const tentacleCount = 5;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;

        for (let i = 0; i < tentacleCount; i++) {
            const tx = -headWidth * 0.7 + (i * (headWidth * 1.4)) / (tentacleCount - 1);
            ctx.beginPath();
            ctx.moveTo(tx, 0);

            const wave = Math.sin(this.pulse + i * 0.8) * 7;
            ctx.quadraticCurveTo(
                tx + wave, headHeight * 1.3,
                tx - wave * 0.5, headHeight * 2.6
            );
            ctx.stroke();
        }

        ctx.restore();
    }
}

let jellyfishSquad = [];

// Khởi tạo đàn sứa đông đúc (38 con)
function initJellyfish(count = 38, width, height) {
    jellyfishSquad = [];
    for (let i = 0; i < count; i++) {
        jellyfishSquad.push(new Jellyfish(width, height));
    }
}

// Cập nhật và kiểm tra xem toàn bộ đàn sứa đã bay xong chưa
function drawJellyfishSquad(ctx, width, height) {
    if (jellyfishSquad.length === 0) return 1.0;

    let finishedCount = 0;

    jellyfishSquad.forEach(jelly => {
        jelly.update(width, height);
        jelly.draw(ctx);
        if (jelly.isFinished) {
            finishedCount++;
        }
    });

    // Trả về tiến trình bơi xong của cả đàn (Ví dụ: 0.85 tức là 85% sứa đã bay qua)
    return finishedCount / jellyfishSquad.length;
}
// --- LỚP TRÁI TIM BAY BAY Ở MÀN HÌNH CHÀO ---
class FloatingHeart {
    constructor(width, height) {
        this.reset(width, height, true);
    }

    reset(width, height, isFirstTime = false) {
        this.x = Math.random() * width;
        this.y = isFirstTime ? Math.random() * height : height + 20;
        this.size = 10 + Math.random() * 18; // Kích thước trái tim
        this.speed = 0.8 + Math.random() * 1.5; // Tốc độ bay lên dịu nhẹ
        this.opacity = 0.4 + Math.random() * 0.5;
        this.swing = Math.random() * Math.PI * 2; // Độ lắc ngang
        this.swingSpeed = 0.02 + Math.random() * 0.03;

        // Màu hồng / đỏ neon ngọt ngào
        const colors = ["#ff4d6d", "#ff758f", "#ff8fa3", "#ffb3c1", "#ff007f"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(width, height) {
        this.y -= this.speed;
        this.swing += this.swingSpeed;
        this.x += Math.sin(this.swing) * 0.8; // Đung đưa sang 2 bên

        // Trôi khỏi đỉnh màn hình thì xuất hiện lại dưới đáy
        if (this.y < -30) {
            this.reset(width, height);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;

        // Vẽ hình trái tim Bezier mượt mà
        const topCurveHeight = this.size * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
        ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
        ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

let welcomeHearts = [];

// Khởi tạo 35 trái tim lãng mạn ở màn hình chào
function initWelcomeHearts(count = 35, width, height) {
    welcomeHearts = [];
    for (let i = 0; i < count; i++) {
        welcomeHearts.push(new FloatingHeart(width, height));
    }
}

function drawWelcomeHearts(ctx, width, height) {
    if (welcomeHearts.length === 0) {
        initWelcomeHearts(35, width, height);
    }
    welcomeHearts.forEach(heart => {
        heart.update(width, height);
        heart.draw(ctx);
    });
}




// Vẽ toàn bộ khu vườn
function drawGarden(ctx, width, height, time, stemProgress = 1, bloomScale = 1) {

    const baseX = width * 0.5;
    const baseY = height * 0.95;

    const scale = Math.min(
        width / 850,
        height / 750,
        1.2
    );

    ctx.save();

    ctx.translate(baseX, baseY);
    ctx.scale(scale, scale * stemProgress);
    drawGrassBase(ctx, stemProgress);
    // Tạo 10 nhịp đung đưa khác nhau cho 10 cành hoa
    const s1 = Math.sin(time * 0.02 + 0.2) * 5;
    const s2 = Math.sin(time * 0.02 + 1.0) * 6;
    const s3 = Math.sin(time * 0.02 + 1.8) * 4;
    const s4 = Math.sin(time * 0.02 + 2.6) * 6;
    const s5 = Math.sin(time * 0.02 + 3.4) * 5;
    const s6 = Math.sin(time * 0.02 + 4.2) * 4;
    const s7 = Math.sin(time * 0.02 + 5.0) * 6;
    const s8 = Math.sin(time * 0.02 + 5.8) * 5;


    // --- 1. VẼ 8 THÂN CÂY (Tọa độ X gốc, Chiều cao, Độ nghiêng, Sway) ---
    drawStem(ctx, -130, 0, 240, -30, s1); // Cành 1 (Trái ngoài cùng)
    drawStem(ctx, -90, 0, 320, -18, s2); // Cành 2
    drawStem(ctx, -50, 0, 270, -15, s3); // Cành 3
    drawStem(ctx, -15, 0, 400, -5, s4); // Cành 4 (Vươn cao trung tâm)
    drawStem(ctx, 20, 0, 360, 12, s5); // Cành 5
    drawStem(ctx, 60, 0, 280, 20, s6); // Cành 6
    drawStem(ctx, 100, 0, 340, 32, s7); // Cành 7
    drawStem(ctx, 140, 0, 230, 30, s8); // Cành 8 (Phải ngoài cùng)


    // --- 2. VẼ LÁ (MỖI CÀNH 2 LÁ - KÍCH THƯỚC LỚN HƠN & XÒE ĐẸP) ---
    // Cành 1
    drawLeaf(ctx, -130 + s1, -60, -2.6, 50, getLeafScale(stemProgress, 0.15));
    drawLeaf(ctx, -130 + s1, -130, 2.5, 48, getLeafScale(stemProgress, 0.35));

    // Cành 2
    drawLeaf(ctx, -90 + s2, -90, -2.7, 56, getLeafScale(stemProgress, 0.20));
    drawLeaf(ctx, -90 + s2, -180, 0.6, 52, getLeafScale(stemProgress, 0.45));

    // Cành 3
    drawLeaf(ctx, -50 + s3, -75, 2.6, 50, getLeafScale(stemProgress, 0.18));
    drawLeaf(ctx, -50 + s3, -150, -2.5, 48, getLeafScale(stemProgress, 0.40));

    // Cành 4 (Cành chính giữa)
    drawLeaf(ctx, -15 + s4, -100, -2.7, 58, getLeafScale(stemProgress, 0.22));
    drawLeaf(ctx, -15 + s4, -220, 0.5, 54, getLeafScale(stemProgress, 0.55));

    // Cành 5
    drawLeaf(ctx, 20 + s5, -90, 0.6, 56, getLeafScale(stemProgress, 0.20));
    drawLeaf(ctx, 20 + s5, -190, -2.6, 52, getLeafScale(stemProgress, 0.50));

    // Cành 6
    drawLeaf(ctx, 60 + s6, -80, 0.7, 50, getLeafScale(stemProgress, 0.18));
    drawLeaf(ctx, 60 + s6, -160, 2.6, 48, getLeafScale(stemProgress, 0.42));

    // Cành 7
    drawLeaf(ctx, 100 + s7, -110, 2.6, 56, getLeafScale(stemProgress, 0.24));
    drawLeaf(ctx, 100 + s7, -200, -0.6, 52, getLeafScale(stemProgress, 0.52));

    // Cành 8
    drawLeaf(ctx, 140 + s8, -55, 2.5, 48, getLeafScale(stemProgress, 0.15));
    drawLeaf(ctx, 140 + s8, -125, -2.4, 45, getLeafScale(stemProgress, 0.38));




    // --- 3. VẼ 10 BÔNG HOA NỞ Ở ĐỈNH CÀNH ---
    drawFlower(ctx, -130 - 30 + s1, -240, 38, 0, bloomScale);
    drawFlower(ctx, -90 - 18 + s2, -320, 43, 0, bloomScale);
    drawFlower(ctx, -50 - 15 + s3, -270, 39, 0, bloomScale);
    drawFlower(ctx, -15 - 5 + s4, -400, 48, 0, bloomScale);
    drawFlower(ctx, 20 + 12 + s5, -360, 45, 0, bloomScale);
    drawFlower(ctx, 60 + 20 + s6, -280, 40, 0, bloomScale);
    drawFlower(ctx, 100 + 32 + s7, -340, 44, 0, bloomScale);
    drawFlower(ctx, 140 + 30 + s8, -230, 36, 0, bloomScale);


    ctx.restore();
}
