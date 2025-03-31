import React, { useState, useEffect } from 'react';

interface TimeoutProps {
    onFeed: (callback: () => void) => void;
    onPlay: (callback: () => void) => void;
    onSleep: (callback: () => void) => void;
}

const Timeout: React.FC<TimeoutProps> = ({ onFeed, onPlay, onSleep }) => {
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
        }, 1200); // 120000 ms = 2 minutes

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        onFeed(() => {
            setHunger(100);
            localStorage.setItem('hunger', JSON.stringify(100));
        });
        onPlay(() => {
            setHappiness(100);
            localStorage.setItem('happiness', JSON.stringify(100));
        });
        onSleep(() => {
            setEnergy(100);
            localStorage.setItem('energy', JSON.stringify(100));
        });
    }, [onFeed, onPlay, onSleep]);

    return (
        <div>
            <p>Hunger: {hunger}</p>
            <p>Happiness: {happiness}</p>
            <p>Energy: {energy}</p>
        </div>
    );
};

export default Timeout;
