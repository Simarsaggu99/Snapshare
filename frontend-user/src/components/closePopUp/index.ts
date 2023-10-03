import { useEffect } from "react";

interface popupInterface {
  menuPopUp: boolean;
  userCardRef: React.MutableRefObject<any>;
  userRef: React.MutableRefObject<any>;
  setMenuPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}
const ClosePopUp = (popUpProps: popupInterface) => {
  const { menuPopUp, userCardRef, userRef, setMenuPopUp } = popUpProps;
  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {

      if (
        menuPopUp &&
        userCardRef.current &&
        !userCardRef.current.contains(e.target) &&
        !userRef?.current?.contains(e.target)
      ) {
        setMenuPopUp(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [menuPopUp]);
};
export default ClosePopUp;
