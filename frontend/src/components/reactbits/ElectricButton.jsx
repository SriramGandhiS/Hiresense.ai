import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ElectricButton = ({ children, onClick, className = "" }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group px-10 py-5 bg-brand-primary text-bg-light rounded-full font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-brand-primary/20 overflow-hidden ${className}`}
        >
            {/* Electric Border Effect */}
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[spin_3s_linear_infinite] transform origin-center"></div>
            </div>

            <span className="relative z-10 flex items-center justify-center">
                {children}
            </span>

            {/* Subtle Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
        </motion.button>
    );
};

export default ElectricButton;
