import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  senha_hash: string;
  perfil: 'admin' | 'professor' | 'aluno';
  nome: string;
  created_at: Date;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  perfil: string;
  nome: string;
  message?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    perfil: string;
    email: string;
  };
}

// NOVAS INTERFACES PARA CURSOS
export interface Curso {
  id: number;
  nome: string;
  sigla: string;
  area: string;
  duracao_meses: number;
  coordenador_id?: number;
  coordenador_nome?: string;
  created_at: Date;
}

export interface CreateCursoRequest {
  nome: string;
  sigla: string;
  area: string;
  duracao_meses: number;
  coordenador_id?: number;
}

export interface UpdateCursoRequest {
  nome?: string;
  sigla?: string;
  area?: string;
  duracao_meses?: number;
  coordenador_id?: number;
}