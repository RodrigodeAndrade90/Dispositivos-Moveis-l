import pool from './config';

const createTables = async (): Promise<void> => {
  try {
    console.log('🔄 Criacao de tabelas');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('admin', 'professor', 'aluno')),
        nome VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "usuarios" criado com sucesso');

    // Hash correto para senha "1234"
    const SENHA_CORRETA_HASH = '$2a$10$CbNDV9rPNyjk9NnyZBeZfer/BciSJWLzmvcFO6aYz7m3FJfQ0MzU.';
    
    const users = [
      {
        email: 'admin@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'admin',
        nome: 'Administrador Sistema'
      },
      {
        email: 'professor@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'professor',
        nome: 'Professor André Olimpio'
      },
      {
        email: 'aluno@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'aluno',
        nome: 'Aluno Breno Cardoso'
      }
    ];

    for (const user of users) {
      await pool.query(
        `INSERT INTO usuarios (email, senha_hash, perfil, nome) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (email) DO NOTHING`,
        [user.email, user.senha_hash, user.perfil, user.nome]
      );
    }

    console.log('✅ Usuários de teste colocado');
    console.log('🎉 Banco de dados iserido!');

  } catch (error) {
    console.error('❌ Erro em criação de tabelas:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  createTables();
}

export default createTables;