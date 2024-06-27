import NavBar from "./components/NavBar";
import "./index.css";
import MainBody from "./components/MainBody";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Manga from "./components/Manga";

import Read from "./components/Read";
import Login from "./components/LogSign/Login";
import SignUp from "./components/LogSign/SingUp";
import PasswordReset from "./components/LogSign/PasswordReset";
import { useAuthContext } from "./components/Auth/useAuthContext";

import ShowMoney from "./components/ShowMoney";
import Profile from "./components/Profile";
import AdminPanel from "./components/CRUD/AdminPanel";
import SearchMore from "./components/SearchMore";
import Favourites from "./components/Favourites";
function App() {
  const { userLoggedIn } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/*" element={<MainBody />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/search" element={<SearchMore />} />
          <Route path="/manga/:id" element={<Manga />} />
          <Route path="/manga/:id/:id" element={<Read />} />
          <Route path="/reset" element={<PasswordReset />} />
          {userLoggedIn && <Route path="/showMoney" element={<ShowMoney />} />}
          {userLoggedIn && <Route path="/profile" element={<Profile />} />}
          {userLoggedIn && (
            <Route path="/favourites" element={<Favourites />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
