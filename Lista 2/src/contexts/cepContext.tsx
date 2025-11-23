import React, { createContext, useState } from "react";
import { CepResponse } from "../types/cep";

type CepContextData = {
  data: CepResponse | null;
  setData: (data: CepResponse | null) => void;
  consultas: CepResponse[];
  adicionarConsulta: (cep: CepResponse) => void;
};

export const CepContext = createContext<CepContextData>({} as CepContextData);

type CepProviderProps = React.PropsWithChildren<{}>;

export const CepProvider = ({ children }: CepProviderProps) => {
  const [data, setData] = useState<CepResponse | null>(null);
  const [consultas, setConsultas] = useState<CepResponse[]>([]);

  function adicionarConsulta(novoCep: CepResponse) {
    setConsultas((prev) => [...prev, novoCep]);
  }

  return (
    <CepContext.Provider value={{ data, setData, consultas, adicionarConsulta }}>
      {children}
    </CepContext.Provider>
  );
};
