import {JSX, useCallback, useEffect, useState} from "react";
import {InGameSidePage} from "../components/inGameSidePage.tsx";
import {useCookies} from "react-cookie";
import {InGameSeparatorComponent} from "../components/inGameSeparatorComponent.tsx";
import {CurrentGameInterface, useSocket} from "../provider/socketProvider.tsx";
import useCountdown from "../hooks/useCountdown.tsx";

interface Props {
    currentGame: CurrentGameInterface
}

type Actions = "ROCK" | "PAPER" | "SCISSOR";

export function MatchPage({currentGame}: Props): JSX.Element {
    const [cookie] = useCookies(["rockpaperscissor"]);
    const [playerTwo, setPlayerTwo] = useState<string>("Waiting...")
    const {socket, setGameId} = useSocket();
    const [enableButton, setEnableButton] = useState<boolean>(false);
    const {secondsLeft, countdown} = useCountdown()
    const [startGame, setStartGame] = useState<boolean>(false);
    const [playerAcceptedMatch, setPlayerAcceptedMatch] = useState<boolean>(false)
    useEffect(() => {
        window.addEventListener('beforeunload', () => {
            socket?.emit("quit game", {
                player: cookie,
                gameId: currentGame?.gameId
            }, () => {
                setGameId(null);
            })
        })
        socket?.on('you won', () => {
            alert('YOU WON');
            setGameId(null)
        });
        socket?.on('draw game', () => {
            alert('Has empatado');
            setGameId(null)
        });
        socket?.on('your turn', () => {
            setEnableButton(true);
        });
        socket?.on('start game', () => {
            countdown(3);
            setStartGame(true);
        });
        socket?.on('joined', (gameId: CurrentGameInterface) => {
            setGameId(gameId);
        });
        socket?.on('leave-room', () => {
            setGameId(null);
        });

        socket?.on('finished game', () => {
            setGameId(null);
            setEnableButton(false);
        });
        return () => {
            socket?.off('start game');
            socket?.off('leave-room');
            socket?.off('finished game');
        }
    }, []);

    useEffect(() => {
        if (currentGame.playerOne && currentGame.playerTwo) {
            const playerTwoNick = currentGame.playerOne === cookie["rockpaperscissor"] ? currentGame.playerTwo : currentGame.playerOne
            if (playerTwoNick) {
                setPlayerTwo(playerTwoNick);
            }
        }
    }, [currentGame]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            setEnableButton(true);
            setPlayerAcceptedMatch(true);
        }
    }, [secondsLeft]);

    const handleActions = useCallback((action: Actions) => {
        setEnableButton(false);
        socket?.emit('player action', {
            gameId: currentGame.gameId,
            player: cookie["rockpaperscissor"],
            action: action
        });
    }, [])

    return (
        <div>
            {startGame && secondsLeft > 0 && `Aceptar partida (${secondsLeft})...`}
            <div className="p-10 flex justify-evenly h-screen items-center">
                <InGameSidePage
                    enableButton={enableButton}
                    playerNick={cookie["rockpaperscissor"]} isMe={true}
                    handle={handleActions}
                />
                <InGameSeparatorComponent gameAccepted={playerAcceptedMatch}/>
                <InGameSidePage playerNick={playerTwo} isMe={false}
                                handle={() => null} enableButton={false}/>
            </div>
            {/*<h1 className={"float-right text-xs"}>{currentGame.gameId}</h1>*/}
        </div>
    );
}