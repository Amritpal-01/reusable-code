"use client";

import expressableTimeConverter from "@/functions/expressableTimeConverter";
import { Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SongType } from "@/types";

interface PlayerPropsType {
  song: SongType;
  className: string;
}

const Player: React.FC<PlayerPropsType> = ({ song, className }) => {
  const [volumeButtonState, setVolumeButtonState] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [track, setTrack] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);

  const play = () => {
    setIsPlaying(true);
    track?.play();
  };

  const pause = () => {
    setIsPlaying(false);
    track?.pause();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
      return;
    }

    play();
  };

  const seek = (seekDuration: number) => {
    if (!track) return;
    track.currentTime = seekDuration;
    setCurrentTime(seekDuration);
  };

  const volumeSeek = (seekValue: number) => {
    if (!track) return;
    track.volume = seekValue / 100;
    setVolume(seekValue);
  };

  const resetPlayer = async () => {
    if (!track) return;
    track.pause();
    track.currentTime = 0;
    setCurrentTime(0);
  };

  useEffect(() => {
    resetPlayer();

    const audio = new Audio(song.src);
    if(isPlaying){
      audio.play();
    }
    
    setTrack(audio);


    const onLoad = () => {
      setDuration(audio.duration);
      setVolume(audio.volume * 100);
    };

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoad);
    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoad);
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("ended", onEnd);

      track?.pause();
    };
  }, [song.src]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`${className} flex gap-2 relative`}>
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-white flex justify-center items-center relative"
      >
        {isPlaying ? (
          <Pause className="absolute text-black" />
        ) : (
          <Play className="absolute text-black" />
        )}
      </button>
      <div className="flex-1 flex flex-col justify-around">
        <h3 className="font-semibold">{song.title}</h3>
        <input
          className=" h-0.5 m cursor-pointer"
          type="range"
          id="player-duration-slider"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            if (isPlaying) {
              pause();
            }

            seek(Number(e.target.value));
          }}
          style={{
            background: `linear-gradient(
                  to right,
                  red ${progress}%,
                  #f2f2f2 ${progress}%
                )`,
          }}
        />
        <div className="w-full flex justify-between font-semibold *:text-[10px]">
          <h5>{expressableTimeConverter(currentTime)}</h5>
          <h5>{expressableTimeConverter(duration)}</h5>
        </div>
      </div>
      <div className="flex gap-px items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-0.75 rounded-full bg-[#f2f2f2] transition-all duration-500"
            style={{
              height: track ? `${Math.random() * 20 + 4}px` : "20px",
            }}
          />
        ))}
      </div>
      <div
        className={`flex justify-center items-center ${volumeButtonState ? "bg-white/10 " : "hover:bg-white/10 "} w-12 h-12 rounded-full`}
        onClick={() => {
          setVolumeButtonState((prev) => !prev);
        }}
      >
        <Volume2 className="w-6 h-6" />
      </div>
      <div
        className={`${volumeButtonState ? "h-8" : "h-0"} px-2 bg-[#333] absolute top-full right-6 rounded-b-lg overflow-hidden`}
      >
        <input
          min={0}
          max={100}
          value={volume}
          onChange={(e) => {
            volumeSeek(Number(e.target.value));
          }}
          className="h-0.5 w-20"
          style={{
            background: `linear-gradient(
                  to right,
                  red ${volume}%,
                  #f2f2f2 ${volume}%
                )`,
          }}
          type="range"
          id="player-duration-slider"
        />
      </div>
    </div>
  );
};

export default Player;
