import { Route, Routes } from "react-router-dom";
import ROUTES from "../../consts/Routes";
import Home from "../Home/home";
import Course from "../Course/course";
import Chapter from "../Chapter/chapter";

const Autentication = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.COURSE} element={<Course />} />
      <Route path="/chapter/:chapterId" element={<Chapter />} />
    </Routes>
  );
};
export default Autentication;
