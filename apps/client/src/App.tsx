import {Route, Routes} from "react-router-dom";
import {CurrentGameInterface, useSocket} from "./provider/socketProvider.tsx";
import React from "react";
import {MatchPage} from "./pages/matchPage.tsx";
import {HomePage} from "./pages/home.page.tsx";

interface Props {
    currentGame: CurrentGameInterface | null
}

const ProtectedHome = React.memo(({currentGame}: Props) => {
    return currentGame ? <MatchPage currentGame={currentGame}/> : <HomePage/>
})

function App() {
    const {currentGame} = useSocket();
    return (
        <Routes>
            <Route path='*' element={(
                <ProtectedHome currentGame={currentGame}/>
            )}/>
        </Routes>
    )
}


export default App
