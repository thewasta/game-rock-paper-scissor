import {Navigate, Route, Routes} from "react-router-dom";
import {CurrentGameInterface, useSocket} from "./provider/socketProvider.tsx";
import React from "react";
import {MatchPage} from "./pages/matchPage.tsx";
import {HomePage} from "./pages/home.page.tsx";

interface Props {
    children: React.ReactNode
    currentGame: CurrentGameInterface | null
}

const Protected = React.memo(({ children, currentGame }: Props) => {
    return currentGame ? children : <Navigate to='/' replace={true}/>;
});

function App() {
    const {currentGame} = useSocket();
    return (
        <Routes>
            <Route path="/match" element={(
                <Protected currentGame={currentGame}>
                    {/*@ts-expect-error*/}
                    <MatchPage currentGame={currentGame}/>
                </Protected>
            )}>
            </Route>
            <Route path='/' element={(
                currentGame ? <MatchPage currentGame={currentGame}/> : <HomePage/>
            )}/>
        </Routes>
    )
}


export default App
