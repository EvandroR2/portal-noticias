import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import NewsDetails from "./pages/NewsDetails/NewsDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/noticias/:id" element={<NewsDetails />} />
    </Routes>
  );
}

export default App;