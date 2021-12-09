import React,{Suspense} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoadingSplash } from "./shared/components";
const GridView = React.lazy(() => import("./pages/GridView/GridView"));
const CreateGridPage = React.lazy(() => import("./pages/CreateGridPage/CreateGridPage"));

const App = () => {
  return <Suspense fallback={<LoadingSplash/>}>
    <Router>
      <Routes>
        <Route exact path="/" element={<CreateGridPage/>} />
        <Route path="/gridview/:gid" element={<GridView/>} />
      </Routes>
    </Router>
  </Suspense>
}

export default App;
