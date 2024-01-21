import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useCookies} from "react-cookie";

export interface PlayerStats {
    total: number;
    wins: number;
}

export interface CurrentGameInterface {
    playerOne: string;
    playerTwo?: string;
    gameId: string;
}

export interface SocketContextInterface {
    socket?: Socket,
    unauthorized: boolean;
    currentGame: CurrentGameInterface | null,
    setGameId: (gameId: CurrentGameInterface | null) => void
}

export const SocketContext = createContext<SocketContextInterface>({
    currentGame: null,
    unauthorized: false,
    setGameId: () => {

    }
});

interface Props {
    children: React.ReactNode
}

export const useSocket = () => useContext(SocketContext);
export const SocketProvider: React.FC<Props> = ({children}) => {
    const today = new Date();

    const [serverErrorMessage, setServerErrorMessage] = useState<boolean>(false);
    const [cookie, setCookie] = useCookies(["rockpaperscissor"])
    const [socket, setSocket] = useState<Socket>()
    const [currentGameId, setCurrentGameId] = useState<CurrentGameInterface | null>(null);

    useEffect(() => {
        const expiresIn = today.setDate(today.getDate() + 30);
        const playerId = crypto.randomUUID()
        if (!cookie["rockpaperscissor"]) {
            setCookie("rockpaperscissor", playerId, {
                expires: new Date(expiresIn)
            });
        }
        const socketConnection = io(import.meta.env.VITE_SOCKET_URL, {
            transports: ["websocket"]
        });

        setSocket(socketConnection);
        return () => {
            socket?.disconnect();
        };
    }, []);

    useEffect(() => {
        socket?.on('unauthorized', () => {
            setServerErrorMessage(true);
            setTimeout(() => {
                setServerErrorMessage(false);
            },200);
        })
    }, [socket]);
    const setGameId = useCallback((currentGame: CurrentGameInterface | null) => {
        setCurrentGameId(currentGame);
    }, [])

    const value: SocketContextInterface = {
        socket,
        unauthorized: serverErrorMessage,
        currentGame: currentGameId,
        setGameId
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}