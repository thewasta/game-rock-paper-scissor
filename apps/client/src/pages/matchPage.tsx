import {JSX, useEffect, useState} from "react";
import {InGameSidePage} from "../components/inGameSidePage.tsx";
import {useCookies} from "react-cookie";
import {InGameSeparatorComponent} from "../components/inGameSeparatorComponent.tsx";
import {CurrentGameInterface, useSocket} from "../provider/socketProvider.tsx";

interface Props {
    currentGame: CurrentGameInterface
}

export function MatchPage({currentGame}: Props): JSX.Element {
    const [cookie] = useCookies(["rockpaperscissor"]);
    const {socket, setGameId} = useSocket();
    const [playerAcceptedMatch, setPlayerAcceptedMatch] = useState<boolean>(false)
    useEffect(() => {
        socket?.on('start game', () => {
            setPlayerAcceptedMatch(true);
        });

        socket?.on('leave-room', () => {
            setGameId(null);
        })
        return () => {
            socket?.off('start game');
            socket?.off('leave-room');
        }
    }, []);
    return (
        <div className="p-10 flex justify-evenly h-screen items-center">
            <InGameSidePage playerNick={cookie["rockpaperscissor"]} isMe={true}/>
            <InGameSeparatorComponent gameAccepted={playerAcceptedMatch}/>
            <InGameSidePage playerNick="P2 Name" isMe={false}/>
        </div>
    );
}