import pool from './config';

const createTables = async (): Promise<void> => {
  try {
    console.log('🔄 Criando tabelas...');
    
    // Tabela usuarios (já existente)
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
    console.log('✅ Tabela "usuarios" criada');

    // NOVA TABELA: cursos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cursos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        sigla VARCHAR(10) UNIQUE NOT NULL,
        area VARCHAR(100) NOT NULL,
        duracao_meses INTEGER NOT NULL,
        coordenador_id INTEGER REFERENCES professores(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "cursos" criada');

    // Tabela alunos (ATUALIZADA com referência a cursos)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        curso_id INTEGER REFERENCES cursos(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "alunos" criada/atualizada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS professores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        titulacao VARCHAR(100) NOT NULL,
        tempo_docencia INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "professores" criada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS disciplinas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        carga_horaria INTEGER NOT NULL,
        professor_id INTEGER REFERENCES professores(id),
        curso_id INTEGER REFERENCES cursos(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "disciplinas" criada/atualizada');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notas (
        id SERIAL PRIMARY KEY,
        aluno_id INTEGER REFERENCES alunos(id),
        disciplina_id INTEGER REFERENCES disciplinas(id),
        nota1 DECIMAL(4,2) DEFAULT 0,
        nota2 DECIMAL(4,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(aluno_id, disciplina_id)
      );
    `);
    console.log('✅ Tabela "notas" criada');

    // Hash correto para senha "1234"
    const SENHA_CORRETA_HASH = '$2a$10$CbNDV9rPNyjk9NnyZBeZfer/BciSJWLzmvcFO6aYz7m3FJfQ0MzU.';
    
    // Inserir usuários de teste
    const users = [
      {
        email: 'admin@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'admin',
        nome: 'Administrador Sistema'
      },
      {
        email: 'prof@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'professor',
        nome: 'Professor André Olimpio'
      },
      {
        email: 'aluno@app.com',
        senha_hash: SENHA_CORRETA_HASH,
        perfil: 'aluno',
        nome: 'Aluno João Silva'
      }
    ];

    for (const user of users) {
      await pool.query(`
        INSERT INTO usuarios (email, senha_hash, perfil, nome) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `, [user.email, user.senha_hash, user.perfil, user.nome]);
    }

    // Inserir cursos de teste
    console.log('📚 Populando cursos de teste...');
    
    const cursosTeste = [
      {
        nome: 'Desenvolvimento de Software Multiplataforma',
        sigla: 'DSM',
        area: 'Tecnologia da Informação',
        duracao_meses: 24,
        coordenador_id: 1
      },
      {
        nome: 'Análise e Desenvolvimento de Sistemas',
        sigla: 'ADS',
        area: 'Tecnologia da Informação',
        duracao_meses: 24,
        coordenador_id: 2
      },
      {
        nome: 'Engenharia de Software',
        sigla: 'ES',
        area: 'Tecnologia da Informação',
        duracao_meses: 36,
        coordenador_id: 1
      },
      {
        nome: 'Sistemas de Informação',
        sigla: 'SI',
        area: 'Tecnologia da Informação',
        duracao_meses: 36,
        coordenador_id: 2
      }
    ];

    for (const curso of cursosTeste) {
      await pool.query(`
        INSERT INTO cursos (nome, sigla, area, duracao_meses, coordenador_id) 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (sigla) DO NOTHING
      `, [curso.nome, curso.sigla, curso.area, curso.duracao_meses, curso.coordenador_id]);
    }

    // Popular dados de teste
    console.log('📊 Populando dados de teste...');
    
    // Inserir professores de teste
    await pool.query(`
      INSERT INTO professores (id, nome, titulacao, tempo_docencia) 
      VALUES 
        (1, 'Dr. Carlos Oliveira', 'Doutor', 15),
        (2, 'Dra. Ana Santos', 'Mestre', 8)
      ON CONFLICT (id) DO UPDATE SET
        nome = EXCLUDED.nome,
        titulacao = EXCLUDED.titulacao,
        tempo_docencia = EXCLUDED.tempo_docencia;
    `);

    // Inserir alunos de teste (ATUALIZADO com curso_id)
    await pool.query(`
      INSERT INTO alunos (id, nome, matricula, curso_id) 
      VALUES 
        (1, 'João Silva', '20240001', 1),
        (2, 'Maria Souza', '20240002', 2),
        (3, 'Carlos Oliveira', '20240003', 1),
        (4, 'Ana Santos', '20240004', 2),
        (5, 'Pedro Costa', '20240005', 3),
        (6, 'Mariana Lima', '20240006', 1),
        (7, 'Ricardo Alves', '20240007', 2),
        (8, 'Fernanda Rocha', '20240008', 4)
      ON CONFLICT (id) DO UPDATE SET
        nome = EXCLUDED.nome,
        matricula = EXCLUDED.matricula,
        curso_id = EXCLUDED.curso_id;
    `);

    // Inserir disciplinas de teste (ATUALIZADO com curso_id)
    await pool.query(`
      INSERT INTO disciplinas (id, nome, carga_horaria, professor_id, curso_id) 
      VALUES 
        (1, 'Programação I', 80, 1, 1),
        (2, 'Banco de Dados', 60, 2, 1),
        (3, 'Estrutura de Dados', 80, 1, 1),
        (4, 'Programação Web', 60, 2, 2),
        (5, 'Mobile Development', 80, 1, 3)
      ON CONFLICT (id) DO UPDATE SET
        nome = EXCLUDED.nome,
        carga_horaria = EXCLUDED.carga_horaria,
        professor_id = EXCLUDED.professor_id,
        curso_id = EXCLUDED.curso_id;
    `);

    // Inserir notas de teste para vários alunos
    await pool.query(`
      INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2) 
      VALUES 
        (1, 1, 7.5, 8.0),
        (1, 2, 6.0, 7.5),
        (1, 3, 5.5, 6.0),
        (2, 1, 8.5, 9.0),
        (2, 4, 7.0, 8.0),
        (3, 1, 6.5, 7.0),
        (3, 2, 8.0, 8.5),
        (4, 1, 9.0, 8.5),
        (4, 4, 7.5, 8.0)
      ON CONFLICT (aluno_id, disciplina_id) DO UPDATE SET
        nota1 = EXCLUDED.nota1,
        nota2 = EXCLUDED.nota2;
    `);

    console.log('✅ Banco de dados inicializado com sucesso!');
    
    // Exibir informações
    const cursosCount = await pool.query('SELECT COUNT(*) FROM cursos');
    const alunosCount = await pool.query('SELECT COUNT(*) FROM alunos');
    
    console.log(`📊 Estatísticas:`);
    console.log(`   📚 Cursos: ${cursosCount.rows[0].count}`);
    console.log(`   👥 Alunos: ${alunosCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    throw error;
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  createTables().then(() => {
    console.log('🎉 Script de criação de tabelas finalizado!');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
}

export default createTables;