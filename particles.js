//Phụ trách tạo các hạt sáng lung linh phía sau hoa.
const particles = Array.from({ length: 110 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() * 1.8 + 0.5,
    speed: Math.random() * 0.025 + 0.006,
    phase: Math.random() * Math.PI * 2
}));

function drawParticles(ctx, width, height, time) {

    particles.forEach(p => {

        const glow =
            (Math.sin(time * p.speed + p.phase) + 1) / 2;

        ctx.beginPath();

        ctx.arc(
            p.x * width,
            p.y * height,
            p.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(65, 225, 230, ${0.12 + glow * 0.48})`;

        ctx.shadowBlur = 12;
        ctx.shadowColor = "#24eaff";

        ctx.fill();
    });

    ctx.shadowBlur = 0;
}
