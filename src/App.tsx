import React, { useRef } from 'react';
import './App.css';
import Timeout from './Timeout.tsx';

function App() {
    const [statusImg, setStatusImg] = React.useState('src/m_verstappen.png');
    const feedRef = useRef<() => void>(() => { });
    const playRef = useRef<() => void>(() => { });
    const sleepRef = useRef<() => void>(() => { });

    let cooldown = false;

    const handleFeed = () => {
        if (cooldown) return;

        cooldown = true;
        setStatusImg('src/eat.png');
        feedRef.current();
        setTimeout(() => {
            setStatusImg('src/m_verstappen.png');
            cooldown = false;
        }, 12000);
    };

    const handlePlay = () => {
        if (cooldown) return;

        cooldown = true;
        setStatusImg('src/play_verstappen.png');
        playRef.current();
        setTimeout(() => {
            setStatusImg('src/m_verstappen.png');
            cooldown = false;
        }, 12000);
    };

    const handleSleep = () => {
        if (cooldown) return;

        cooldown = true;
        setStatusImg('src/sleep.png');
        sleepRef.current();
        setTimeout(() => {
            setStatusImg('src/m_verstappen.png');
            cooldown = false;
        }, 12000);
    };

    return (
        <>
            <main>
                <aside>
                    <Timeout
                        onFeed={(callback) => (feedRef.current = callback)}
                        onPlay={(callback) => (playRef.current = callback)}
                        onSleep={(callback) => (sleepRef.current = callback)}
                    />
                </aside>
                <article>
                    <img src={statusImg} width='128' height='128' alt="pet" /><br />
                    <button onClick={handleFeed}>Feed</button>
                    <button onClick={handlePlay}>Play</button>
                    <button onClick={handleSleep}>Sleep</button>
                </article>
            </main>
        </>
    );
}

export default App;
