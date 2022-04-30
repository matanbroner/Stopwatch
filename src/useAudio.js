import React, { useEffect } from "react";
import useState from "./useState";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying, getPlaying] = useState(false);

  const toggle = (state) => {
    setPlaying(state);
    // only reset on manual toggle
    audio.currentTime = 0;
  }

  useEffect(() => {
    getPlaying() ? audio.play() : audio.pause();
  }, [getPlaying]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

export default useAudio;
