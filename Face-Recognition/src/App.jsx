import { BrowserRouter, Routes, Route } from "react-router-dom";
import FaceRecognitionPage from "./pages/FaceRecognitionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FaceRecognitionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;