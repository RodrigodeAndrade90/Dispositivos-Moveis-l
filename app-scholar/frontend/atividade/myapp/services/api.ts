const API_BASE_URL = 'http://192.168.18.14:3000/api';

export interface LoginData {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  perfil: string;
  nome: string;
  message?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro no login');
    }

    return await response.json();
  }

  async validateToken(): Promise<any> {
    if (!this.token) {
      throw new Error('Token não disponível');
    }

    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Token inválido');
    }

    return await response.json();
  }

  async getProfile(): Promise<any> {
    if (!this.token) {
      throw new Error('Token não disponível');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar perfil');
    }

    return await response.json();
  }
}

export default new ApiService();