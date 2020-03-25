import React from "react";
import BlueNav from "../components/BlueNav";
import TopNav from "../components/TopNav";
import CssBaseline from "@material-ui/core/CssBaseline";
import CardModal from "../components/CreateCard/Modal";

const Navbar = () => {
  return (
    <CssBaseline>
      <TopNav />
      <BlueNav />
      <CardModal />
    </CssBaseline>
  );
};

export default Navbar;
