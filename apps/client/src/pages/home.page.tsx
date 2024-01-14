import {JSX, useCallback, useEffect, useState} from "react";
import {CurrentGameInterface, PlayerStats, useSocket} from "../provider/socketProvider.tsx";
import {useCookies} from "react-cookie";

export function HomePage(): JSX.Element {
    const {socket, setGameId} = useSocket()
    const [cookie] = useCookies(["rockpaperscissor"])
    const [totalPlayers, setTotalPlayers] = useState<number>(0)
    const [playerData, setPlayerData] = useState<PlayerStats>({
        total: 0,
        wins: 0
    })
    useEffect(() => {
        fetch(`api/player/${cookie["rockpaperscissor"]}`)
            .then(response => response.json())
            .then(json => {
                setPlayerData({
                    total: json.total,
                    wins: json.wins
                });
            })
    }, []);

    useEffect(() => {
        socket?.on('joined', (gameId: CurrentGameInterface) => {
            console.log("SE HA RECIBIDO JOINED");
            setGameId(gameId);
        });

        socket?.on('user count', (count: number) => {
            setTotalPlayers(count)
        });

        socket?.on('user count disconnect', (count: number) => {
            setTotalPlayers(count);
        });

        return () => {
            socket?.off('joined');
            socket?.off('user count');
            socket?.off('user count disconnect');
        }
    }, [socket]);
    const handleClick = useCallback(() => {
        console.log("CLICKEADO BUSCARD");
        const gameId = crypto.randomUUID();
        socket?.emit('find game', {
            playerId: cookie["rockpaperscissor"],
            gameId
        });
    }, [socket]);

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-100 p-4">
            <header className="flex flex-col items-center w-full md:w-1/2 lg:w-1/3">
                <h1 className="text-4xl font-bold mb-4">Piedra Papel y Tijeras</h1>
                <h2>Tu id: {"playerId"}</h2>
                <h3>Jugadores en línea {totalPlayers}</h3>
                <h4>Total wins: {playerData.total}</h4>
            </header>
            <main className="flex flex-col items-center w-full md:w-1/2 lg:w-1/3 mt-10">
                <div className="flex flex-col justify-center gap-4 mb-8 shadow-md border-2 p-5 w-full">
                    <h3 className="font-bold text-2xl ">Tu puntuación</h3>
                    <table className="table-auto text-center">
                        <thead>
                        <tr>
                            <th>Jug</th>
                            <th>Gan</th>
                            <th>Per</th>
                            <th>%</th>
                            <th>Punt</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{playerData.total}</td>
                            <td>{playerData.wins}</td>
                            <td>{playerData.total - playerData.wins}</td>
                            <td>{(((playerData.total - playerData.wins) * 100) / playerData.total) || 0}</td>
                            <td>{playerData.wins * 3}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mb-5">
                    <button
                        className="text-white bg-gray-700 hover:bg-gray-800 rounded-lg px-5 py-2.5 cursor-pointer"
                        onClick={handleClick}
                    >
                        Nueva partida
                    </button>
                </div>
                {(<div role="status">
                    <svg aria-hidden="true"
                         className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>)}
            </main>
        </div>
    );
}
