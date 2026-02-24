import React, { useEffect, useRef } from 'react';

const Threads = ({ className = "" }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Particle/Thread system logic
        const threads = [];
        const threadCount = 30;

        class Thread {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.points = [];
                this.maxPoints = 20;
                this.color = `rgba(198, 168, 94, ${Math.random() * 0.3})`; // Using soft gold
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Push current position to points
                this.points.unshift({ x: this.x, y: this.y });
                if (this.points.length > this.maxPoints) {
                    this.points.pop();
                }

                // Bounce
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                if (this.points.length < 2) return;
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (let i = 1; i < this.points.length; i++) {
                    ctx.lineTo(this.points[i].x, this.points[i].y);
                }
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        for (let i = 0; i < threadCount; i++) {
            threads.push(new Thread());
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            threads.forEach(t => {
                t.update();
                t.draw();
            });
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none z-0 ${className}`} />;
};

export default Threads;
