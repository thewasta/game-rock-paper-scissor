import {
    createBrowserRouter, LoaderFunctionArgs,
    RouteObject
} from "react-router-dom";
import {HomePage} from "../pages/home.page.tsx";
import {MatchPage} from "../pages/matchPage.tsx";

const router: RouteObject[] = [
    {
        path: '/',
        loader() {
            return {user: "random"}
        },
        Component: HomePage
    },
    {
        path: 'match',
        loader: ({request}: LoaderFunctionArgs) => {
            request.url
            // if (true) {
            //     let params = new URLSearchParams();
            //     params.set("from", new URL(request.url).pathname);
            //     return redirect('/?' + params.toString())
            // }
            return null;
        },
        Component: MatchPage,
    }
];

export const browserRoute = createBrowserRouter(router)


