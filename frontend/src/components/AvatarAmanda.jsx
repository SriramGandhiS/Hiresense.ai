import React, { useEffect, useState } from 'react';

const SIZE_MAP = {
    sm: { avatar: 80, ring1: 96, ring2: 112, ring3: 128 },
    md: { avatar: 120, ring1: 144, ring2: 164, ring3: 184 },
    lg: { avatar: 160, ring1: 192, ring2: 220, ring3: 248 },
};

const AvatarAmanda = ({ isSpeaking = false, isThinking = false, size = 'md' }) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const dims = SIZE_MAP[size] || SIZE_MAP.md;

    // Blink eyes every 3 seconds
    useEffect(() => {
        const blink = () => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200);
        };
        const interval = setInterval(blink, 3000);
        return () => clearInterval(interval);
    }, []);

    const scale = dims.avatar / 120; // normalized to md size

    const statusColor = isSpeaking
        ? '#3b82f6'   // blue
        : isThinking
        ? '#f59e0b'   // amber
        : '#22c55e';  // green

    const statusLabel = isSpeaking
        ? 'Speaking'
        : isThinking
        ? 'Thinking...'
        : 'Ready';

    return (
        <div className="flex flex-col items-center gap-3 select-none">
            {/* Pulsing ring container */}
            <div
                className="relative flex items-center justify-center"
                style={{ width: dims.ring3, height: dims.ring3 }}
            >
                {/* Outer rings — animate when speaking */}
                {isSpeaking && (
                    <>
                        <div
                            style={{
                                position: 'absolute',
                                width: dims.ring3,
                                height: dims.ring3,
                                borderRadius: '50%',
                                border: '2px solid rgba(99,102,241,0.25)',
                                animation: 'speakPulse 1.4s ease-in-out infinite',
                                animationDelay: '0s',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                width: dims.ring2,
                                height: dims.ring2,
                                borderRadius: '50%',
                                border: '2px solid rgba(99,102,241,0.35)',
                                animation: 'speakPulse 1.4s ease-in-out infinite',
                                animationDelay: '0.2s',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                width: dims.ring1,
                                height: dims.ring1,
                                borderRadius: '50%',
                                border: '2px solid rgba(99,102,241,0.5)',
                                animation: 'speakPulse 1.4s ease-in-out infinite',
                                animationDelay: '0.4s',
                            }}
                        />
                    </>
                )}

                {/* Thinking shimmer ring */}
                {isThinking && !isSpeaking && (
                    <div
                        style={{
                            position: 'absolute',
                            width: dims.ring1,
                            height: dims.ring1,
                            borderRadius: '50%',
                            border: '2px solid transparent',
                            borderTop: '2px solid #f59e0b',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                )}

                {/* Avatar circle */}
                <div
                    style={{
                        width: dims.avatar,
                        height: dims.avatar,
                        borderRadius: '50%',
                        background: 'linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 50%, #12122a 100%)',
                        border: '2px solid rgba(99,102,241,0.4)',
                        boxShadow: isSpeaking
                            ? '0 0 30px rgba(99,102,241,0.4), inset 0 1px 1px rgba(255,255,255,0.1)'
                            : '0 0 20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: isSpeaking ? 'bounce 1s ease-in-out infinite' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'box-shadow 0.4s ease',
                    }}
                >
                    {/* Hair (dark shape at top) */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: dims.avatar * 0.82,
                            height: dims.avatar * 0.52,
                            background: 'linear-gradient(180deg, #1c1008 0%, #2d1a0a 100%)',
                            borderRadius: `${dims.avatar * 0.42}px ${dims.avatar * 0.42}px ${dims.avatar * 0.22}px ${dims.avatar * 0.22}px`,
                            zIndex: 3,
                        }}
                    />

                    {/* Side hair strands */}
                    <div
                        style={{
                            position: 'absolute',
                            top: dims.avatar * 0.04,
                            left: dims.avatar * 0.04,
                            width: dims.avatar * 0.15,
                            height: dims.avatar * 0.42,
                            background: 'linear-gradient(180deg, #1c1008 0%, #2d1a0a 80%, transparent 100%)',
                            borderRadius: '50% 0 60% 50%',
                            zIndex: 2,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: dims.avatar * 0.04,
                            right: dims.avatar * 0.04,
                            width: dims.avatar * 0.15,
                            height: dims.avatar * 0.42,
                            background: 'linear-gradient(180deg, #1c1008 0%, #2d1a0a 80%, transparent 100%)',
                            borderRadius: '0 50% 50% 60%',
                            zIndex: 2,
                        }}
                    />

                    {/* Face (skin-tone oval) */}
                    <div
                        style={{
                            position: 'absolute',
                            top: dims.avatar * 0.24,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: dims.avatar * 0.56,
                            height: dims.avatar * 0.58,
                            background: 'linear-gradient(180deg, #c8956c 0%, #b5784a 60%, #a0623c 100%)',
                            borderRadius: '50% 50% 48% 48%',
                            zIndex: 4,
                            boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.2)',
                        }}
                    >
                        {/* Eyes */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '28%',
                                left: '18%',
                                width: '24%',
                                height: isBlinking ? '4%' : '14%',
                                background: '#1a0a02',
                                borderRadius: '50%',
                                transition: 'height 0.08s ease',
                                boxShadow: '0 0 3px rgba(0,0,0,0.6)',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '28%',
                                right: '18%',
                                width: '24%',
                                height: isBlinking ? '4%' : '14%',
                                background: '#1a0a02',
                                borderRadius: '50%',
                                transition: 'height 0.08s ease',
                                boxShadow: '0 0 3px rgba(0,0,0,0.6)',
                            }}
                        />

                        {/* Eye shine */}
                        {!isBlinking && (
                            <>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '26%',
                                        left: '20%',
                                        width: '7%',
                                        height: '7%',
                                        background: 'rgba(255,255,255,0.75)',
                                        borderRadius: '50%',
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '26%',
                                        right: '20%',
                                        width: '7%',
                                        height: '7%',
                                        background: 'rgba(255,255,255,0.75)',
                                        borderRadius: '50%',
                                    }}
                                />
                            </>
                        )}

                        {/* Nose (subtle) */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '12%',
                                height: '10%',
                                background: 'rgba(0,0,0,0.12)',
                                borderRadius: '0 0 50% 50%',
                            }}
                        />

                        {/* Mouth */}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '18%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: isSpeaking ? '46%' : '32%',
                                height: isSpeaking ? '14%' : '8%',
                                background: isSpeaking ? '#8b2222' : '#8b4a4a',
                                borderRadius: isSpeaking ? '50% 50% 50% 50% / 30% 30% 70% 70%' : '0 0 50% 50%',
                                transition: 'all 0.3s ease',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Teeth when speaking */}
                            {isSpeaking && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: '5%',
                                        width: '90%',
                                        height: '45%',
                                        background: '#f0ece8',
                                        borderRadius: '0 0 3px 3px',
                                    }}
                                />
                            )}
                        </div>

                        {/* Cheek blush */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '42%',
                                left: '5%',
                                width: '20%',
                                height: '12%',
                                background: 'rgba(220,120,100,0.25)',
                                borderRadius: '50%',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '42%',
                                right: '5%',
                                width: '20%',
                                height: '12%',
                                background: 'rgba(220,120,100,0.25)',
                                borderRadius: '50%',
                            }}
                        />
                    </div>

                    {/* Neck */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: dims.avatar * 0.06,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: dims.avatar * 0.2,
                            height: dims.avatar * 0.14,
                            background: 'linear-gradient(180deg, #b5784a 0%, #a0623c 100%)',
                            borderRadius: '4px 4px 0 0',
                            zIndex: 4,
                        }}
                    />

                    {/* Shoulder area / outfit */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: dims.avatar * 0.22,
                            background: 'linear-gradient(180deg, #1a1a3e 0%, #0d0d2a 100%)',
                            borderRadius: '0 0 50% 50%',
                            zIndex: 3,
                        }}
                    />
                </div>
            </div>

            {/* Name badge */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                    <div
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: statusColor,
                            boxShadow: `0 0 8px ${statusColor}`,
                            animation:
                                isSpeaking || isThinking
                                    ? 'speakPulse 1s ease-in-out infinite'
                                    : 'none',
                            flexShrink: 0,
                        }}
                    />
                    <span
                        className="font-bold tracking-wide text-white"
                        style={{ fontSize: size === 'sm' ? 13 : size === 'lg' ? 18 : 15 }}
                    >
                        Amanda
                    </span>
                </div>
                <span
                    className="text-indigo-400 font-medium tracking-wider uppercase"
                    style={{ fontSize: size === 'sm' ? 9 : size === 'lg' ? 11 : 10 }}
                >
                    HireSense AI Interviewer
                </span>
                <span
                    style={{
                        fontSize: size === 'sm' ? 9 : 10,
                        color: statusColor,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        transition: 'color 0.3s ease',
                    }}
                >
                    ● {statusLabel}
                </span>
            </div>
        </div>
    );
};

export default AvatarAmanda;
