import {JSX} from "react";
import {InGameSidePage} from "../components/inGameSide.page.tsx";


export function MatchPage(): JSX.Element {
    const isMe = true;
    const handleClick = () => {

    }

    return (
        <div className="p-10 flex justify-evenly h-screen items-center">
            {isMe ? <InGameSidePage playerNick="P1 Name"/> : <InGameSidePage playerNick="P2 name"/>}
            <div className="grow flex-col flex items-center justify-evenly h-48">
                <h3 className="font-bold text-2xl">Resultado</h3>
                <span className="text-xs bg-gray-300 rounded-full text-gray-800 font-medium px-2 py-0.5 me-2">Esperando jugador...</span>
                <button className="underline" onClick={handleClick}>
                    Abandonar
                </button>
            </div>
            {isMe ? <InGameSidePage playerNick="P2 Name"/> : <InGameSidePage playerNick="P1 name"/>}
        </div>
    );
}