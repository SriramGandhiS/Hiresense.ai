import { motion } from 'framer-motion';

const SplitText = ({
    text = "",
    className = "",
    delay = 0,
    stagger = 0.05,
    initialY = 20,
    animateY = 0
}) => {
    const letters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: delay * i
            },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: animateY,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: initialY,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.span
            style={{ display: "inline-block", overflow: "hidden" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{ display: "inline-block" }}
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default SplitText;
