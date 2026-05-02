import React from "react";

import {
  Routes,
  Route
} from "react-router-dom";

import Creative from "./components/Creative";
import Creativepanels from "./components/Creativepanels";


function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Creative />}
      />

      <Route
        path="/creativepanels"
        element={<Creativepanels />}
      />

    </Routes>

  );
}

export default App;