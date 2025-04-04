import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Timeout from './Timeout.tsx';
import PetSelector from './PetSelector.tsx';

function App() {
    const [statusImg, setStatusImg] = useState('src/m_verstappen.png');
    const [pet, setPet] = useState<string | null>(null);
    const [action, setAction] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(false);
    const [stats, setStats] = useState({ feed: 0, play: 0, sleep: 0 });
    const [isDead, setIsDead] = useState(false);
    const feedRef = useRef<(seconds: number) => void>(() => { });
    const playRef = useRef<(seconds: number) => void>(() => { });
    const sleepRef = useRef<(seconds: number) => void>(() => { });
    const actionIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    let seconds = 0;

    useEffect(() => {
        const savedPet = localStorage.getItem('pet');
        if (savedPet) {
            setPet(savedPet);
            setStatusImg(`src/m_${savedPet}.png`);
        }
    }, []);

    useEffect(() => {
        if (pet) {
            localStorage.setItem('pet', pet);
            setStatusImg(`src/m_${pet}.png`);
            setStats({ feed: 100, play: 100, sleep: 100 });
            localStorage.setItem('hunger', JSON.stringify(100));
            localStorage.setItem('happiness', JSON.stringify(100));
            localStorage.setItem('energy', JSON.stringify(100));
        }
    }, [pet]);

    useEffect(() => {
        const sprite = document.getElementById('sprite');
        if (action === 'play') {
            sprite?.classList.add('play');
        } else {
            sprite?.classList.remove('play');
        }
    }, [action]);

    const startAction = (actionType: string, actionImg: string) => {
        if (cooldown) return;

        setAction(actionType);
        setStatusImg(actionImg);
        seconds = 0;

        actionIntervalRef.current = setInterval(() => {
            seconds += 1;
            console.log(`${actionType} action: ${seconds} seconds`);
            if (seconds >= 10) {
                stopAction(actionType);
            }
        }, 1000);

        actionTimeoutRef.current = setTimeout(() => {
            stopAction(actionType);
            setCooldown(true);
            setTimeout(() => {
                setCooldown(false);
            }, 60000);
        }, 10000);
    };

    const stopAction = (actionType: string) => {
        if (actionIntervalRef.current) {
            clearInterval(actionIntervalRef.current);
            actionIntervalRef.current = null;
        }
        if (actionTimeoutRef.current) {
            clearTimeout(actionTimeoutRef.current);
            actionTimeoutRef.current = null;
        }
        setStats((prevStats) => ({
            ...prevStats,
            [actionType]: Math.min(prevStats[actionType as keyof typeof prevStats] + seconds, 100),
        }));
        setStatusImg(`src/m_${pet}.png`);
        setAction(null);

        if (actionType === 'feed') {
            feedRef.current(seconds);
        } else if (actionType === 'play') {
            playRef.current(seconds);
        } else if (actionType === 'sleep') {
            sleepRef.current(seconds);
        }
    };

    const handleFeed = () => {
        startAction('feed', `src/eat.png`);
    };

    const handlePlay = () => {
        startAction('play', `src/play_${pet}.png`);
    };

    const handleSleep = () => {
        startAction('sleep', `src/sleep.png`);
    };

    const handleReset = () => {
        localStorage.removeItem('pet');
        localStorage.removeItem('statusImg');
        localStorage.removeItem('hunger');
        localStorage.removeItem('happiness');
        localStorage.removeItem('energy');
        setPet(null);
        setStatusImg('src/m_verstappen.png');
        setStats({ feed: 0, play: 0, sleep: 0 });
        setIsDead(false);
    };

    const handleDeath = () => {
        setIsDead(true);
        handleReset();
    };

    if (!pet) {
        return <PetSelector onSelect={setPet} />;
    }

    return (
        <>
            <header>
                <h1>Tamagotchi</h1>
            </header><br />
            <main>
                {isDead ? (
                    <div className="death-message">
                        <h2>Your pet has died sad and hungry</h2>
                    </div>
                ) : (
                    <>
                        <aside>
                            <Timeout
                                onFeed={(callback) => (feedRef.current = callback)}
                                onPlay={(callback) => (playRef.current = callback)}
                                onSleep={(callback) => (sleepRef.current = callback)}
                                onReset={handleDeath}
                            />
                        </aside>
                        <article>
                            <div className="pet-container">
                                <img src={statusImg} width='128' height='128' alt="pet" id='sprite' />
                                {action === 'play' && <img src="src/wind.png" className="wind" alt="wind" />}
                            </div>
                            <br />
                            <div className="buttons">
                                <button onClick={handleFeed} disabled={cooldown || action !== null}>Feed</button>
                                <button onClick={handlePlay} disabled={cooldown || action !== null}>Play</button>
                                <button onClick={handleSleep} disabled={cooldown || action !== null}>Sleep</button>
                                {action && <button onClick={() => stopAction(action)}>Stop {action}</button>}
                            </div>
                        </article>
                        <button className="reset-button" onClick={handleReset}>Reset</button>
                    </>
                )}
            </main>
        </>
    );
}

export default App;
