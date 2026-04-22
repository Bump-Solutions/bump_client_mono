import { useContext } from "react";
import { TickContext } from "./context";

export const useNow = () => useContext(TickContext);
