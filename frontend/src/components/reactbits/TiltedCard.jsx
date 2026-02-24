import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TiltedCard = ({ children, className = "" }) => {
    const ref = useRef(null);

    // Motion values for X and Y position
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for rotation
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        // Calculate relative mouse position from -0.5 to 0.5
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={className}
        >
            <div style={{ transform: "translateZ(50px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

export default TiltedCard;
