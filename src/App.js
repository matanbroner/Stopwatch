import React, { useEffect } from "react";
import styles from "./App.module.css";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  Button,
  Navbar,
  Container,
  Form,
  FormControl,
  FormLabel,
  Row,
  Col,
} from "react-bootstrap";
import Bell from "./Bell";
import useState from "./useState";
import useAudio from "./useAudio";

const bellImg = require("./assets/bell.png");
const uuidV4 = require("uuid").v4;

const [MIN_SECS, MAX_SECS] = [1, 30];

function App() {
  const [totalSeconds, setTotalSeconds, getTotalSeconds] = useState(5);
  const [mute, setMute, getMute] = useState(false);
  const [active, setActive] = useState(false);
  const [seconds, setSeconds, getSeconds] = useState(0);
  const [interval, setLocalInterval, getInterval] = useState(null);
  const [bells, setBells, getBells] = useState({});
  const [bellsPlaying, toggleBellsPlaying] = useAudio(
    "https://drive.google.com/uc?export=download&id=1jNe2fx5_yzAZj51ZtmlXsy2rHCGElyXb"
  );
  const [musicPlaying, toggleMusicPlaying] = useAudio(
    "https://drive.google.com/uc?export=download&id=1InHW0gQrLBSCyT9nJFdzmjbU3fC8I2TY"
  );

  const floatSecondsToTimeFormat = (floatSeconds) => {
    const afterDecimal = floatSeconds % 1;
    const milliseconds = Math.floor(afterDecimal * 100);
    const beforeDecimal = Math.floor(floatSeconds);
    const seconds = beforeDecimal % 60;
    return `${seconds < 10 ? "0" : ""}${seconds}:${
      milliseconds < 10 ? "0" : ""
    }${milliseconds}`;
  };

  const randomBellPosition = () => {
    const minXPercent = 15;
    const maxXPercent = 85;
    const minYPercent = 15;
    const maxYPercent = 85;
    let x = -1;
    let y = -1;
    while (x < 0 || y < 10 || bellIsOverlapping(x, y)) {
      x =
        Math.floor(Math.random() * (maxXPercent - minXPercent + 1)) +
        minXPercent;
      y =
        Math.floor(Math.random() * (maxYPercent - minYPercent + 1)) +
        minYPercent;
    }
    return { x, y };
  };

  const bellIsOverlapping = (newX, newY) => {
    const bellPositions = Object.values(getBells()).map(
      (bell) => bell.position
    );
    for (let i = 0; i < bellPositions.length; i++) {
      const { x, y } = bellPositions[i];
      if (Math.abs(x - newX) < 5 || Math.abs(y - newY) < 5) {
        return true;
      }
    }
    return false;
  };

  const triggerBells = () => {
    stopTimer();
    toggleBellsPlaying(true);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const id = uuidV4();
        const position = randomBellPosition();
        setBells({
          ...getBells(),
          [id]: {
            component: (
              <Bell
                src={bellImg}
                key={id}
                position={position}
                callback={() => removeBell(id)}
              />
            ),
            position,
          },
        });
      }, i * 500);
    }
  };

  const removeBell = (id) => {
    let bells = getBells();
    delete bells[id];
    setBells({
      ...bells,
    });
  };

  const startTimer = () => {
    setActive(true);
    toggleMusicPlaying(true);
    const int = setInterval(() => {
      if (getSeconds() >= totalSeconds) {
        setSeconds(totalSeconds);
        triggerBells();
      } else {
        const newSeconds =
          getSeconds() + 0.1 > totalSeconds ? totalSeconds : getSeconds() + 0.1;
        setSeconds(newSeconds);
      }
    }, 100);
    setLocalInterval(int);
  };

  const stopTimer = () => {
    setActive(false);
    toggleMusicPlaying(false);
    clearInterval(getInterval());
  };

  const resetTimer = () => {
    if (active) {
      stopTimer();
    }
    setBells({});
    setSeconds(0);
  };

  const renderStopWatch = () => {
    return (
      <div className={styles.stopwatch}>
        <CircularProgressbar
          value={seconds}
          maxValue={totalSeconds}
          text={floatSecondsToTimeFormat(seconds)}
          styles={{
            path: {
              stroke: "#58BE3A",
            },
            text: {
              fill: "#58BE3A",
              fontSize: "16px",
            },
          }}
        />
      </div>
    );
  };

  const renderButtonBar = () => {
    return (
      <div className={styles.buttonBar}>
        <Button
          className={styles.button}
          variant="success"
          onClick={() => {
            startTimer();
          }}
          disabled={active || getSeconds() === totalSeconds}
        >
          Start
        </Button>
        <Button
          className={styles.button}
          variant="warning"
          onClick={() => {
            stopTimer();
          }}
          disabled={!active}
        >
          Pause
        </Button>
        <Button
          className={styles.button}
          variant="primary"
          onClick={() => {
            resetTimer();
          }}
        >
          Reset
        </Button>
      </div>
    );
  };

  const renderNavbar = () => {
    return (
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#home">Stopwatch</Navbar.Brand>
          <div id={styles.navForm}>
            <span id={styles.navFormLable}>Seconds:</span>
            <input
              type="number"
              value={totalSeconds}
              onChange={(e) => {
                resetTimer();
                if (e.target.value <= MAX_SECS && e.target.value >= MIN_SECS) {
                  setTotalSeconds(e.target.value);
                }
              }}
            />
          </div>
          {/* <Button
            variant="danger"
            onClick={() => {
              [...document.querySelectorAll('audio, video')].forEach(el => el.muted = true)
              setMute(!getMute());
            }}
          >
            Mute
          </Button> */}
        </Container>
      </Navbar>
    );
  };

  return (
    <React.Fragment>
      {renderNavbar()}
      <div className={styles.App}>
        {renderStopWatch()}
        {renderButtonBar()}
        {Object.values(getBells()).map((bell) => {
          return bell.component;
        })}
        <audio id="bell-audio"></audio>
      </div>
    </React.Fragment>
  );
}

export default App;
