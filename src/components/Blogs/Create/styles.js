import { makeStyles } from "@mui/styles";

export default makeStyles(() => ({
  Card: {
    padding: "10px",
    minWidth: "650px",
  },
  Header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  Body: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  Form: {
    minWidth: "600px",
  },
  Icon: {
    cursor: "pointer",
  },
  Input: {
    margin: "10px",
  },
}));
