import {RouterProvider} from "react-router-dom";
import {browserRoute} from "./router";


function App() {
    return (
        <RouterProvider router={browserRoute}/>
    )
}


export default App
