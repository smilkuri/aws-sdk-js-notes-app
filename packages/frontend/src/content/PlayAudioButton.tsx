import React, { useRef, useState, useTransition } from "react";
import { Button, Alert } from "react-bootstrap";
import { PlayCircle, StopFill } from "react-bootstrap-icons";
import { getSynthesizedSpeechUrl } from "../libs/getSynthesizedSpeechUrl";

const PlayAudioButton = (props: {
  disabled: boolean;
  isPlaying: boolean;
  setIsPlaying: Function;
  noteContent: string;
}) => {
  const { disabled, isPlaying, setIsPlaying, noteContent } = props;
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioPlayer.current?.pause();
      audioPlayer.current?.load();
    } else {
      startTransition(async () => {
        setIsPlaying(true);
        try {
          const audioUrl = await getSynthesizedSpeechUrl(noteContent);
          setAudioUrl(audioUrl.toString());
          audioPlayer.current?.load();
          audioPlayer.current?.play();
          audioPlayer.current?.addEventListener("ended", () => {
            setIsPlaying(false);
          });
        } catch (error) {
          setIsPlaying(false);
          audioPlayer.current?.pause();
          audioPlayer.current?.load();
          console.log(error);
          setErrorMsg(`${error.toString()}`);
        }
      });
    }
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {audioUrl && <audio ref={audioPlayer} src={audioUrl}></audio>} {/* Render only when audioUrl exists */}
      <Button
        className="mx-2"
        variant={isPlaying ? "primary" : "outline-secondary"}
        size="sm"
        onClick={togglePlay}
        disabled={disabled || isPending} // Disable the button while the transition is pending
      >
        {isPlaying ? <StopFill /> : <PlayCircle />}
      </Button>
    </>
  );
};

export { PlayAudioButton };
