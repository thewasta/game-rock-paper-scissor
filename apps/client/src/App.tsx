import {BrowserRouter, Route} from "react-router-dom";
import {CurrentGameInterface, SocketProvider, useSocket} from "./provider/socketProvider.tsx";
import React from "react";
import {MatchPage} from "./pages/matchPage.tsx";
import {HomePage} from "./pages/home.page.tsx";

interface Props {
    children: React.ReactNode
    currentGame: CurrentGameInterface | null
}

const Protected = ({children, currentGame}: Props) => {
    return currentGame ? children : <HomePage/>
}

function App() {
    const {currentGame} = useSocket();
    return (
        <BrowserRouter>
            <SocketProvider>
                <Route path="/" element={(
                    <Protected currentGame={currentGame}>
                        {/*@ts-expect-error*/}
                        <MatchPage currentGame={currentGame}/>
                    </Protected>
                )}>
                </Route>
            </SocketProvider>
        </BrowserRouter>
    )
}


export default App
