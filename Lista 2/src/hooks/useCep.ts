import { useContext } from "react";
import { CepContext } from "../contexts/cepContext";

export function useCep() {
  return useContext(CepContext);
}
