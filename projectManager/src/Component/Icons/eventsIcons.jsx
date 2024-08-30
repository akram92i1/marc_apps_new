import React from "react";
import { makeStyles } from "@mui/styles";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import InfoIcon from "@mui/icons-material/Info";
const useStyles = makeStyles({
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  icon: {
    animation: "$spin 2s infinite linear",
  },
  iconContainer: {
    position: "relative",
    display: "inline-block",
  },
  innerIcon: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "16px", // Adjust size of inner icon
  },
  outerIcon: {
    fontSize: "64px", // Adjust size of outer icon
  },
});
export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.iconContainer}>
      <DonutLargeIcon className={classes.icon} style={{ fontSize: "25px" }} />
      <InfoIcon className={classes.innerIcon} style={{ fontSize: "15px" }} />
    </div>
  );
}
