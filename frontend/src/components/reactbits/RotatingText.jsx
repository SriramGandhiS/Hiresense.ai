import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RotatingText.css';

const RotatingText = ({
    texts,
    mainClassName = '',
    splitLevelClassName = '',
    staggerFrom = 'last',
    initial = { y: '100%' },
    animate = { y: 0 },
    exit = { y: '-120%' },
    staggerDuration = 0.025,
    transition = { type: 'spring', damping: 30, stiffness: 400 },
    rotationInterval = 2000,
}) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, rotationInterval);
        return () => clearInterval(interval);
    }, [texts, rotationInterval]);

    return (
        <div className={`text-rotate ${mainClassName}`}>
            <span className="text-rotate-sr-only">{texts[index]}</span>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    className="text-rotate-lines"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {texts[index].split('').map((char, i) => (
                        <motion.span
                            key={`${index}-${i}`}
                            className={`text-rotate-element ${splitLevelClassName}`}
                            variants={{
                                hidden: initial,
                                visible: animate,
                                exit: exit,
                            }}
                            transition={{
                                ...transition,
                                delay:
                                    staggerFrom === 'last'
                                        ? (texts[index].length - 1 - i) * staggerDuration
                                        : i * staggerDuration,
                            }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default RotatingText;
