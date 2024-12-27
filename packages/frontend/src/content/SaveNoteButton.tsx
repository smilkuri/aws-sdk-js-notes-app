import React, { useState, useTransition } from "react";
import { Button, Alert } from "react-bootstrap";
import { GATEWAY_URL } from "../config";
import { navigate } from "@reach/router";
import { ButtonSpinner } from "../components";

const SaveNoteButton = (props: { noteId: string; noteContent: string }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const { noteId, noteContent } = props;
      const updateNoteURL = `${GATEWAY_URL}notes/${noteId}`;

      try {
        await fetch(updateNoteURL, {
          method: "PUT",
          body: JSON.stringify({ content: noteContent }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        navigate("/");
      } catch (error) {
        console.error(error);
        setErrorMsg(`${error.toString()} - ${updateNoteURL} - ${noteContent}`);
      }
    });
  };

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Button disabled={isPending} onClick={handleSave} block>
        {isPending ? <ButtonSpinner /> : ""}
        {isPending ? "Saving..." : "Save"}
      </Button>
    </>
  );
};

export { SaveNoteButton };
