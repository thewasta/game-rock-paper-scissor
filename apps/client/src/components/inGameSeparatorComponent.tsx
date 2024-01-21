import React, {JSX} from "react";
import {useSocket} from "../provider/socketProvider.tsx";
import {useCookies} from "react-cookie";

interface Props {
    gameAccepted: boolean;
}

export function InGameSeparatorComponent({gameAccepted}: Props): JSX.Element {
    const {setGameId, socket, currentGame} = useSocket()
    const [cookie] = useCookies(["rockpaperscissor"]);
    const handleQuitGame = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        socket?.emit("quit game", {
            player: cookie,
            gameId: currentGame?.gameId
        }, () => {
            setGameId(null);
        })
    }
    if (gameAccepted) {
        return (
            <div className="grow flex-col flex items-center justify-evenly h-48">
                <h3 className="font-bold text-3xl">RONDA 1</h3>
                <h3 className="text-xl">Resultado</h3>
                <button onClick={handleQuitGame} className="underline">
                    Abandonar
                </button>
            </div>
        );
    }
    return (
        <div className="grow flex-col flex items-center justify-evenly h-48">
            <span className="text-xs bg-gray-300 rounded-full text-gray-800 font-medium px-2 py-0.5 me-2">Esperando jugador...</span>
            <button onClick={handleQuitGame} className="underline">
                Abandonar
            </button>
        </div>
    );
}