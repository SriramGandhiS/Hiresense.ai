import React from 'react';
import { motion } from 'framer-motion';

const TrueFocus = ({ text, className = "" }) => {
    const words = text.split(" ");

    return (
        <div className={`flex flex-wrap gap-x-4 gap-y-2 ${className}`}>
            {words.map((word, idx) => (
                <motion.span
                    key={idx}
                    initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        delay: idx * 0.1,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    className="inline-block"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
};

export default TrueFocus;
