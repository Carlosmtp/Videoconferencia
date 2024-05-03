import UserProvider from "./context/UserContext";
import RoutesChatEISC from "./routes/RoutesChatEISC";

export default function App() {
    return (
        <UserProvider className="container">
            <RoutesChatEISC />
        </UserProvider>
    )
}
