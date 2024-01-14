import React, {JSX, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSocket} from "../provider/socketProvider.tsx";
import {useCookies} from "react-cookie";

interface Props {
    gameAccepted: boolean;
}

export function InGameSeparatorComponent({gameAccepted}: Props): JSX.Element {
    const {setGameId, socket, currentGame} = useSocket()
    const [cookie] = useCookies(["rockpaperscissor"]);
    const navigate = useNavigate()
    const [quiting, setQuiting] = useState(false)
    const handleQuitGame = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        socket?.emit("quit game", {
            player: cookie,
            gameId: currentGame?.gameId
        }, (response: string) => {
            console.log({response});
            setGameId(null);
        })
    }
    if (gameAccepted) {
        return (
            <div className="grow flex-col flex items-center justify-evenly h-48">
                <h3 className="font-bold text-2xl">Resultado</h3>
                <span className="text-xs bg-gray-300 rounded-full text-gray-800 font-medium px-2 py-0.5 me-2">Esperando jugador...</span>
                <button onClick={handleQuitGame} className="underline" disabled={quiting}>
                    Abandonar
                </button>
            </div>
        );
    }
    return (
        <div className="grow flex-col flex items-center justify-evenly h-48">
            <h4 className="font-bold text-2xl">Esperando a que ambos jugadores acepten</h4>
            <button onClick={handleQuitGame} className="underline" disabled={quiting}>
                Abandonar
            </button>
        </div>
    );
}