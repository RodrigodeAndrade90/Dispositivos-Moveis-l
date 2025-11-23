import axios from "axios";
import { CepResponse } from "../types/cep";

export async function getCep(cep: string): Promise<CepResponse> {
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  return response.data;
}
