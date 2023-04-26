import { useCallback, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";

const sources = {
  FIP: "https://direct.fipradio.fr/live/fip-midfi.mp3",
  BBC6Music:
    "https://stream.live.vc.bbcmedia.co.uk/bbc_6music?s=1652857795&e=1652872195&h=bfa9bd011a41708438ea46f3507b6191",
  KCRW: "https://kcrw.streamguys1.com/kcrw_192k_mp3_e24_internet_radio",
};

const roomsList = ["Bedroom", "Kitchen", "Lounge"];
const favoritesList = ["BBC 6 Music", "FIP", "KCRW"];

const PlayPause = ({ handlePlayPaused, paused }) => {
  let className = "playPause";
  const playIcon = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
  const pauseIcon =
    "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";

  let icon = playIcon;
  if (paused) {
    className += ` ${className}--active`;
    icon = pauseIcon;
  }

  return (
    <div className="playPause-wrapper">
      <div
        className={className}
        onClick={handlePlayPaused}
        // ref="playPause"
      >
        <svg width="100%" height="100%" viewBox="0 0 36 36">
          <path d={icon} />
        </svg>
      </div>
    </div>
  );
};
PlayPause.propTypes = {
  paused: PropTypes.boolean,
  handlePlayPaused: PropTypes.func,
};

const Audio = ({ favorite, playing }) => {
  let src = "";
  if (favorite === "BBC 6 Music") {
    src = sources.BBC6Music;
  } else {
    src = sources[favorite];
  }

  return <AudioPlayer source={src} isPlaying={playing} showControls={true} />;
};
Audio.propTypes = {
  favorite: PropTypes.string,
  playing: PropTypes.boolean,
};

// Adapted from https://gist.github.com/Polidoro/ce08a45261e6075eb82a016b6ee09673
const AudioPlayer = ({ showControls, isPlaying, source }) => {
  const updateIsPlaying = useCallback(() => {
    var node = audioRef.current;
    if (isPlaying) {
      node.play();
    } else {
      node.pause();
    }
  }, [isPlaying]);

  const updateSource = useCallback(() => {
    var node = audioRef.current;
    node.pause();
    node.load();
    if (isPlaying) {
      node.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    updateIsPlaying();
  }, [updateIsPlaying]);

  useEffect(() => {
    updateIsPlaying();
  }, [isPlaying, updateIsPlaying]);

  useEffect(() => {
    updateSource();
  }, [source, updateSource]);

  const audioRef = useRef(null);

  let controls = "";
  if (showControls) {
    controls = "controls";
  }
  return (
    <audio controls={controls} ref={audioRef}>
      <source src={source} type="audio/mpeg" />
    </audio>
  );
};

AudioPlayer.propTypes = {
  showControls: PropTypes.boolean,
  isPlaying: PropTypes.boolean,
  source: PropTypes.string,
};

const App = () => {
  const [room, setRoom] = useState("Bedroom");
  const [roomState, setRoomState] = useState({
    Bedroom: {
      favorite: "BBC 6 Music",
      paused: true,
    },
    Kitchen: {
      favorite: "FIP",
      paused: true,
    },
    Lounge: {
      favorite: "FRL",
      paused: true,
    },
  });

  // getInitialState() {
  //   return {
  //     favorites: ["BBC 6 Music", "FIP", "KCRW"],
  //     rooms: ["Bedroom", "Kitchen", "Lounge"],
  //     Bedroom: {
  //       favorite: "BBC 6 Music",
  //       paused: true,
  //     },
  //     Kitchen: {
  //       favorite: "FIP",
  //       paused: true,
  //     },
  //     Lounge: {
  //       favorite: "FRL",
  //       paused: true,
  //     },
  //     room: "Bedroom",
  //   };
  // },

  // handleRoomClick(room) {
  //   this.setState({
  //     room,
  //   });
  // },

  const handleFavClick = (favorite) => {
    // const newState = { ...this.state }; // deconstruct state.abc into a new object-- effectively making a copy
    // newState[this.state.room].favorite = favorite;
    // this.setState(newState);

    setRoomState((prevState) => {
      // const oldPaused = prevState[room].paused;

      const newState = { ...prevState };
      newState[room] = { ...newState[room], favorite };

      return newState;
    });
  };

  const handlePlayPaused = useCallback(() => {
    setRoomState((prevState) => {
      // const oldPaused = prevState[room].paused;

      const newState = { ...prevState };
      newState[room] = { ...newState[room], paused: !prevState[room].paused };

      return newState;
    });
  }, [room]);

  const favorites = favoritesList.map((favorite, i) => {
    var boundClick = () => handleFavClick(favorite);
    var extraClass =
      roomState[room].favorite === favorite ? "favorite--selected " : "";
    return (
      <div className={extraClass + "favorite"} onClick={boundClick} key={i}>
        {favorite}
      </div>
    );
  });

  const rooms = roomsList.map((theRoom, i) => {
    var boundClick = () => setRoom(theRoom);
    var extraClass = theRoom === room ? "room--selected " : "";
    return (
      <div className={extraClass + "room"} onClick={boundClick} key={i}>
        {theRoom}
      </div>
    );
  });

  return (
    <div className="sonos-prototype">
      {favorites.length > 0 && <div className="favorites">{favorites}</div>}

      {rooms.length > 0 && <div className="rooms">{rooms}</div>}
      <PlayPause
        paused={roomState[room].paused}
        handlePlayPaused={handlePlayPaused}
      />
      <Audio
        favorite={roomState[room].favorite}
        playing={!roomState[room].paused}
      />
    </div>
  );
};

export default App;
