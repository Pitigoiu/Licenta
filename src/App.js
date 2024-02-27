import NavBar from "./NavBar";
import Carousel from "./Carousel";
import MainBody from "./MainBody";
import Add from "./Add";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Manga from "./Manga";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<MainBody />} />
          <Route path="/manga" element={<Manga />} />
        </Routes>
      </BrowserRouter>
      {/* //{" "}
      <BrowserRouter>
        //{" "}
        <Routes>

          <Route path="/" element={<NavBar />}>
            // <Route path="/" exact element={<MainBody />} />
            // <Route path="/about" element={<Carousel />} />
            // <Route path="/contact" element={<MainBody />} />
            // <Route path="/other" element={<MainBody />} />
  
          </Route>

        </Routes>
 */}
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
