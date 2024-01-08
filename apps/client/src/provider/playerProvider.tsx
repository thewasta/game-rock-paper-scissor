import React, {createContext, useEffect, useState} from "react";
import {getPlayerStats} from "../api/player.ts";

interface PlayerStats {
    total?: number;
    wins?: number;
}

export const playerContext = createContext<PlayerStats>({
    total: 0,
    wins: 0
});

interface Props {
    children: React.ReactNode
}

export const PlayerProvider: React.FC<Props> = ({children}) => {

    const [playerStats, setPlayerStats] = useState<PlayerStats>();

    useEffect(() => {
        getPlayerStats()
            .then(response => response.json())
            .then(response => setPlayerStats(response))
    }, []);
    return (
        <playerContext.Provider value={
            {
                total: playerStats?.total,
                wins: playerStats?.wins
            }
        }>
            {children}
        </playerContext.Provider>
    );
}