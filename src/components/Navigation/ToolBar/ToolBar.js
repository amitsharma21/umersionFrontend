import React from "react";

import { AppBar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useDispatch } from "react-redux";

import useStyles from "./styles";
import Logo from "../../../images/memories-Text.png";

const ToolBar = () => {
  const classes = useStyles();

  return (
    <AppBar color="inherit" position="static" className={classes.AppBar}>
      <Link to="/dashboard">
        <img
          src={Logo}
          alt="LOGO"
          style={{ height: "45px", margin: "0 0 0 15px" }}
        />
      </Link>
      <Typography
        variant="p"
        style={{ margin: "0 15px 0 0" }}
        className={classes.Admin}
      >
        Admin
        <ArrowDropDownIcon fontSize="small" />
      </Typography>
    </AppBar>
  );
};

export default ToolBar;
