import React, {JSX, useEffect} from "react";
import {useSocket} from "../provider/socketProvider.tsx";

interface Props {
    playerNick: string;
    enemyNick?: string;
    isMe: boolean;
}

type Actions = "ROCK" | "PAPER" | "SCISSOR";

export function InGameSidePage(props: Props): JSX.Element {
    const {socket} = useSocket();

    const disabledButtonClass: string = "disabled:bg-gray-300 text-white p-2 w-1/3 rounded hover:cursor-not-allowed";
    const enabledButtonClass: string = "bg-gray-800 hover:bg-gray-900 text-white p-2 w-1/3 rounded"
    useEffect(() => {
        socket?.on("game start", () => {

        });
        return () => {
            socket?.off("game start")
        }
    }, [socket]);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, action: Actions) => {
        event.preventDefault();
        socket?.emit('emitir algo', action)
    }
    return (
        <div className="w-1/3">
            <div className="border row-span-3 rounded p-5 shadow flex flex-col justify-evenly items-center h-72">
                <h3 className="font-bold text-xl">{props.playerNick}</h3>
                <button className={props.isMe ? enabledButtonClass : disabledButtonClass} disabled={!props.isMe}
                        onClick={(e) => handleClick(e, "ROCK")}>
                    Piedra
                </button>
                <button className={props.isMe ? enabledButtonClass : disabledButtonClass} disabled={!props.isMe}
                        onClick={e => handleClick(e, "PAPER")}>
                    Papel
                </button>
                <button className={props.isMe ? enabledButtonClass : disabledButtonClass} disabled={!props.isMe}
                        onClick={e => handleClick(e, "SCISSOR")}>
                    Tijeras
                </button>
            </div>
        </div>
    )
}