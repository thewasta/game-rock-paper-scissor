import {useEffect, useState} from "react";

export default function useCountdown() {
    const [secondsLeft, setSecondsLeft] = useState<number>(10)
    useEffect(() => {
        if (secondsLeft <= 0) return;

        const timeout = setTimeout(() => {
            setSecondsLeft(secondsLeft - 1);
        }, 1000)

        return () => clearTimeout(timeout);
    }, [secondsLeft]);

    function countdown(seconds: number) {
        setSecondsLeft(seconds);
    }

    return {secondsLeft, countdown}
}