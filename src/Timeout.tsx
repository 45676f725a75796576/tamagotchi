import React, { useState, useEffect } from 'react';

interface TimeoutProps {
    onFeed: (callback: (seconds: number) => void) => void;
    onPlay: (callback: (seconds: number) => void) => void;
    onSleep: (callback: (seconds: number) => void) => void;
    onReset: () => void;
}

const Timeout: React.FC<TimeoutProps> = ({ onFeed, onPlay, onSleep, onReset }) => {
    const [hunger, setHunger] = useState(() => {
        const saved = localStorage.getItem('hunger');
        return saved !== null ? JSON.parse(saved) : 100;
    });
    const [happiness, setHappiness] = useState(() => {
        const saved = localStorage.getItem('happiness');
        return saved !== null ? JSON.parse(saved) : 100;
    });
    const [energy, setEnergy] = useState(() => {
        const saved = localStorage.getItem('energy');
        return saved !== null ? JSON.parse(saved) : 100;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setHunger(prev => {
                const newHunger = Math.max(prev - 1, 0);
                localStorage.setItem('hunger', JSON.stringify(newHunger));
                return newHunger;
            });
            setHappiness(prev => {
                const newHappiness = Math.max(prev - 1, 0);
                localStorage.setItem('happiness', JSON.stringify(newHappiness));
                return newHappiness;
            });
            setEnergy(prev => {
                const newEnergy = Math.max(prev - 1, 0);
                localStorage.setItem('energy', JSON.stringify(newEnergy));
                return newEnergy;
            });
        }, 6000); // 120000 ms = 2 minutes

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (hunger === 0 || happiness === 0 || energy === 0) {
            onReset();
            alert('Your pet has died sad and hungry');
        }
    }, [hunger, happiness, energy, onReset]);

    useEffect(() => {
        onFeed((seconds) => {
            setHunger(prev => Math.min(prev + seconds, 100));
            localStorage.setItem('hunger', JSON.stringify(Math.min(hunger + seconds, 100)));
        });
        onPlay((seconds) => {
            setHappiness(prev => Math.min(prev + seconds, 100));
            localStorage.setItem('happiness', JSON.stringify(Math.min(happiness + seconds, 100)));
        });
        onSleep((seconds) => {
            setEnergy(prev => Math.min(prev + seconds, 100));
            localStorage.setItem('energy', JSON.stringify(Math.min(energy + seconds, 100)));
        });
    }, [onFeed, onPlay, onSleep, hunger, happiness, energy]);

    return (
        <div>
            <p>Hunger: {hunger}</p>
            <p>Happiness: {happiness}</p>
            <p>Energy: {energy}</p>
        </div>
    );
};

export default Timeout;

