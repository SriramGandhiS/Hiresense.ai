import { useState, useEffect } from 'react';

const LetterGlitch = ({ text = "", className = "" }) => {
    const [glitchedText, setGlitchedText] = useState(text);
    const chars = "!@#$%^&*()_+{}:<>?|abcdefghijklmnopqrstuvwxyz0123456789";

    useEffect(() => {
        let iteration = 0;
        let interval = null;

        const startGlitch = () => {
            clearInterval(interval);
            iteration = 0;

            interval = setInterval(() => {
                setGlitchedText(
                    text
                        .split("")
                        .map((char, index) => {
                            if (index < iteration) {
                                return text[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        };

        const timeout = setTimeout(startGlitch, 500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [text]);

    return (
        <span className={`${className} font-mono tracking-tighter`}>
            {glitchedText}
        </span>
    );
};

export default LetterGlitch;
