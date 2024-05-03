import NavBar from "./components/NavBar";
import "./index.css";
import MainBody from "./components/MainBody";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Manga from "./components/Manga";
import ShowAll from "./components/ShowAll";
import DeleteChapter from "./components/CRUD/DeleteChapters";
import AddChapters from "./components/CRUD/AddChapters";
import AddManga from "./components/CRUD/AddManga";
import Read from "./components/Read";
import Login from "./LogSign/Login";
import { useAuthContext } from "./components/Auth/useAuthContext";
import SignUp from "./LogSign/SingUp";
import ShowMoney from "./components/ShowMoney";
import UpdateElement from "./components/CRUD/UpdateElement";
import PasswordReset from "./LogSign/PasswordReset";
import Profile from "./components/Profile";
import AdminPanel from "./components/CRUD/AdminPanel";
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
          {/* <Route path="/manga" element={<ShowAll />} /> */}
          <Route path="/manga/:id" element={<Manga />} />
          <Route path="/manga/:id/:id" element={<Read />} />
          {userLoggedIn && <Route path="/showMoney" element={<ShowMoney />} />}
          <Route path="/reset" element={<PasswordReset />} />
          {userLoggedIn && <Route path="/profile" element={<Profile />} />}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
