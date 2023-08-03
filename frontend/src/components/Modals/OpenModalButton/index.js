import React from "react";
import { useModal } from "../../../context/Modal";

function OpenModalButton({
  modalComponent,
  buttonText, // text of the button that opens the modal
  onButtonClick, // cb fxn that will be called once the button that opens the modal is clicked
  onModalClose, //  cb fxn that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;