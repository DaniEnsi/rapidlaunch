import React, { useState } from 'react';

const ExamTimer = () => {
    const [time, setTime] = useState(0); // Time in seconds
    const [timerOn, setTimerOn] = useState(false);

    const startTimer = () => {
        if (!timerOn) {
            setTimerOn(true);
            const interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    };

    const stopTimer = () => {
        setTimerOn(false);
    };

    const resetTimer = () => {
        setTimerOn(false);
        setTime(0);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="text-2xl font-bold">{new Date(time * 1000).toISOString().substr(11, 8)}</div>
            <div className="flex mt-4 space-x-2">
                {!timerOn && (
                    <button
                        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
                        onClick={startTimer}
                    >
                        Start
                    </button>
                )}
                {timerOn && (
                    <button
                        className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-700"
                        onClick={stopTimer}
                    >
                        Stop
                    </button>
                )}
                <button
                    className="px-4 py-2 font-semibold text-white bg-gray-500 rounded hover:bg-gray-700"
                    onClick={resetTimer}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default ExamTimer;
