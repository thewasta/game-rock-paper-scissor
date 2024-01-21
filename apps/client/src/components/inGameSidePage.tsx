import {JSX} from "react";

type Actions = "ROCK" | "PAPER" | "SCISSOR";

interface Props {
    enableButton: boolean;
    playerNick: string;
    enemyNick?: string;
    isMe: boolean;
    handle: (action: Actions) => void
}


export function InGameSidePage(props: Props): JSX.Element {
    const disabledButtonClass: string = "disabled:bg-gray-300 text-white p-2 w-1/3 rounded hover:cursor-not-allowed";
    const enabledButtonClass: string = "bg-gray-800 hover:bg-gray-900 text-white p-2 w-1/3 rounded"
    return (
        <div className="w-1/3">
            <div className="border row-span-3 rounded p-5 shadow flex flex-col justify-evenly items-center h-72">
                <h3 className="font-bold text-xl">{props.playerNick}</h3>
                <button className={props.isMe && props.enableButton ? enabledButtonClass : disabledButtonClass} disabled={!props.isMe || !props.enableButton}
                        onClick={_ => props.handle("ROCK")}>
                    Piedra
                </button>
                <button className={props.isMe && props.enableButton ? enabledButtonClass : disabledButtonClass} disabled={!props.isMe || !props.enableButton}
                        onClick={_ => props.handle("PAPER")}>
                    Papel
                </button>
                <button className={props.isMe && props.enableButton ? enabledButtonClass : disabledButtonClass} disabled={!props.isMe || !props.enableButton}
                        onClick={_ => props.handle("SCISSOR")}>
                    Tijeras
                </button>
            </div>
        </div>
    )
}