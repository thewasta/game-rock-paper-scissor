import {JSX} from "react";

interface Props {
    playerNick: any
}

export function InGameSidePage(props: Props): JSX.Element {
    return (

        <div className="w-1/3">
            <div className="border row-span-3 rounded p-5 shadow flex flex-col justify-evenly items-center h-72">
                <h3 className="font-bold text-xl">{props.playerNick}</h3>
                <button className="bg-gray-800 hover:bg-gray-900 text-white p-2 w-1/3 rounded">
                    Piedra
                </button>
                <button className="bg-gray-800 hover:bg-gray-900 text-white p-2 w-1/3 rounded">
                    Papel
                </button>
                <button className="bg-gray-800 hover:bg-gray-900 text-white p-2 w-1/3 rounded">
                    Tijeras
                </button>
            </div>
        </div>

    )
}