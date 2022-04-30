import React, { useRef, useState, useEffect } from "react";
import styles from "./Bell.module.css";

const Bell = (props) => {
  const { callback, id, position, src } = props;
  const [display, setDisplay] = useState(true);

  const BellStyles = useRef({
    position: "absolute",
    top: `${position.y}%`,
    left: `${position.x}%`,
    width: "200px",
  });

  useEffect(() => {
    setTimeout(() => {
        setDisplay(false);
        callback(id);
      }, 2500);
    }, [display]);


  return (
    <img
      src={src}
      style={{
        ...BellStyles.current,
        display: display ? "block" : "none",
      }}
      className={styles.imgSwinging}
      alt=""
    />
  );
};

export default Bell;
