import { useState, useCallback, useEffect, useRef } from 'react';

export const useSpeech = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    
    // Use refs to store recognition instance to avoid re-renders
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech Recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Disable continuous to avoid duplex connection drops
        recognition.interimResults = false; // Disable interim updates to reduce massive network load
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error('[SpeechRecognition Error]', event.error);
            setError(event.error);
        };

        recognition.onresult = (event) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    currentTranscript += event.results[i][0].transcript;
                }
            }
            if (currentTranscript) {
                setTranscript(prev => (prev ? prev + ' ' + currentTranscript.trim() : currentTranscript.trim()));
            }
        };

        recognitionRef.current = recognition;
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            setError(null);
            recognitionRef.current.start();
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // Optional: Choose a premium voice if available
            const voices = window.speechSynthesis.getVoices();
            const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium'));
            if (premiumVoice) utterance.voice = premiumVoice;

            window.speechSynthesis.speak(utterance);
        } else {
            setError('Speech Synthesis is not supported in this browser.');
        }
    }, []);

    return {
        isListening,
        transcript,
        setTranscript,
        startListening,
        stopListening,
        speak,
        error
    };
};
