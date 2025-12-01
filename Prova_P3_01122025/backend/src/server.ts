import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './database/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Middleware de Autenticação
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Token de autenticação não fornecido' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Token mal formatado' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'app_scholar_secret_2024') as any;
    (req as any).user = decoded;
    next();
    
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'App Scholar API - Sistema Completo',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API de Autenticação
app.post('/api/auth/login', async (req: express.Request, res: express.Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ message: 'Email e senha são obrigatórios' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    
    if (!senhaValida) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        perfil: usuario.perfil,
        email: usuario.email 
      },
      process.env.JWT_SECRET || 'app_scholar_secret_2024',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      perfil: usuario.perfil,
      nome: usuario.nome,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/register', async (req: express.Request, res: express.Response) => {
  try {
    const { email, senha, perfil, nome } = req.body;

    if (!email || !senha || !perfil || !nome) {
      res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      return;
    }

    if (!['admin', 'professor', 'aluno'].includes(perfil)) {
      res.status(400).json({ message: 'Perfil inválido. Use: admin, professor ou aluno' });
      return;
    }

    const emailExists = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (emailExists.rows.length > 0) {
      res.status(400).json({ message: 'Email já cadastrado' });
      return;
    }

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const result = await pool.query(
      `INSERT INTO usuarios (email, senha_hash, perfil, nome) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, perfil, nome, created_at`,
      [email.toLowerCase().trim(), senhaHash, perfil, nome]
    );

    const token = jwt.sign(
      { 
        id: result.rows[0].id, 
        perfil: result.rows[0].perfil,
        email: result.rows[0].email 
      },
      process.env.JWT_SECRET || 'app_scholar_secret_2024',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      perfil: result.rows[0].perfil,
      nome: result.rows[0].nome,
      message: 'Usuário cadastrado com sucesso'
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/api/usuarios', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const result = await pool.query(`
      SELECT id, email, perfil, nome, created_at 
      FROM usuarios 
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/api/auth/validate', authMiddleware, (req: express.Request, res: express.Response) => {
  res.json({ 
    valid: true, 
    user: (req as any).user 
  });
});

app.get('/api/auth/profile', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    
    const result = await pool.query(
      'SELECT id, email, perfil, nome, created_at FROM usuarios WHERE id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== CURSOS ====================

app.get('/api/cursos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.nome,
        c.sigla,
        c.area,
        c.duracao_meses,
        c.coordenador_id,
        p.nome as coordenador_nome,
        c.created_at,
        COUNT(a.id) as total_alunos
      FROM cursos c
      LEFT JOIN professores p ON c.coordenador_id = p.id
      LEFT JOIN alunos a ON c.id = a.curso_id
      GROUP BY c.id, c.nome, c.sigla, c.area, c.duracao_meses, c.coordenador_id, p.nome, c.created_at
      ORDER BY c.nome
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/api/cursos/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        c.*,
        p.nome as coordenador_nome,
        p.titulacao as coordenador_titulacao
      FROM cursos c
      LEFT JOIN professores p ON c.coordenador_id = p.id
      WHERE c.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Curso não encontrado' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/cursos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    
    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Apenas administradores podem criar cursos' });
      return;
    }
    
    const { nome, sigla, area, duracao_meses, coordenador_id } = req.body;
    
    if (!nome || !sigla || !area || !duracao_meses) {
      res.status(400).json({ message: 'Nome, sigla, área e duração são obrigatórios' });
      return;
    }
    
    if (coordenador_id) {
      const coordenadorExists = await pool.query(
        'SELECT id FROM professores WHERE id = $1',
        [coordenador_id]
      );
      
      if (coordenadorExists.rows.length === 0) {
        res.status(400).json({ message: 'Coordenador não encontrado' });
        return;
      }
    }
    
    const result = await pool.query(
      `INSERT INTO cursos (nome, sigla, area, duracao_meses, coordenador_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [nome, sigla, area, parseInt(duracao_meses), coordenador_id || null]
    );
    
    res.status(201).json({ 
      message: 'Curso criado com sucesso',
      curso: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('Erro ao criar curso:', error);
    
    if (error.code === '23505') {
      res.status(400).json({ message: 'Sigla de curso já existe' });
      return;
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.put('/api/cursos/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    
    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Apenas administradores podem atualizar cursos' });
      return;
    }
    
    const { nome, sigla, area, duracao_meses, coordenador_id } = req.body;
    
    const cursoExists = await pool.query('SELECT id FROM cursos WHERE id = $1', [id]);
    
    if (cursoExists.rows.length === 0) {
      res.status(404).json({ message: 'Curso não encontrado' });
      return;
    }
    
    if (coordenador_id) {
      const coordenadorExists = await pool.query(
        'SELECT id FROM professores WHERE id = $1',
        [coordenador_id]
      );
      
      if (coordenadorExists.rows.length === 0) {
        res.status(400).json({ message: 'Coordenador não encontrado' });
        return;
      }
    }
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (nome !== undefined) {
      updates.push(`nome = $${paramCount}`);
      values.push(nome);
      paramCount++;
    }
    
    if (sigla !== undefined) {
      updates.push(`sigla = $${paramCount}`);
      values.push(sigla);
      paramCount++;
    }
    
    if (area !== undefined) {
      updates.push(`area = $${paramCount}`);
      values.push(area);
      paramCount++;
    }
    
    if (duracao_meses !== undefined) {
      updates.push(`duracao_meses = $${paramCount}`);
      values.push(parseInt(duracao_meses));
      paramCount++;
    }
    
    if (coordenador_id !== undefined) {
      updates.push(`coordenador_id = $${paramCount}`);
      values.push(coordenador_id);
      paramCount++;
    }
    
    if (updates.length === 0) {
      res.status(400).json({ message: 'Nenhum campo para atualizar' });
      return;
    }
    
    values.push(id);
    
    const query = `
      UPDATE cursos 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    res.json({ 
      message: 'Curso atualizado com sucesso',
      curso: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('Erro ao atualizar curso:', error);
    
    if (error.code === '23505') {
      res.status(400).json({ message: 'Sigla de curso já existe' });
      return;
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.delete('/api/cursos/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    
    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Apenas administradores podem deletar cursos' });
      return;
    }
    
    const cursoExists = await pool.query('SELECT id FROM cursos WHERE id = $1', [id]);
    
    if (cursoExists.rows.length === 0) {
      res.status(404).json({ message: 'Curso não encontrado' });
      return;
    }
    
    const alunosVinculados = await pool.query(
      'SELECT COUNT(*) FROM alunos WHERE curso_id = $1',
      [id]
    );
    
    if (parseInt(alunosVinculados.rows[0].count) > 0) {
      res.status(400).json({ 
        message: 'Não é possível deletar o curso pois existem alunos vinculados a ele.' 
      });
      return;
    }
    
    const disciplinasVinculadas = await pool.query(
      'SELECT COUNT(*) FROM disciplinas WHERE curso_id = $1',
      [id]
    );
    
    if (parseInt(disciplinasVinculadas.rows[0].count) > 0) {
      res.status(400).json({ 
        message: 'Não é possível deletar o curso pois existem disciplinas vinculadas a ele.' 
      });
      return;
    }
    
    await pool.query('DELETE FROM cursos WHERE id = $1', [id]);
    
    res.json({ 
      message: 'Curso deletado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/api/cursos/area/:area', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { area } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM cursos 
       WHERE LOWER(area) LIKE LOWER($1)
       ORDER BY nome`,
      [`%${area}%`]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar cursos por área:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/cursos/:id/transferir-alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { novo_curso_id } = req.body;
    
    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Apenas administradores podem transferir alunos' });
      return;
    }
    
    if (!novo_curso_id) {
      res.status(400).json({ message: 'ID do novo curso é obrigatório' });
      return;
    }
    
    const [cursoOrigem, cursoDestino] = await Promise.all([
      pool.query('SELECT id FROM cursos WHERE id = $1', [id]),
      pool.query('SELECT id FROM cursos WHERE id = $1', [novo_curso_id])
    ]);
    
    if (cursoOrigem.rows.length === 0) {
      res.status(404).json({ message: 'Curso de origem não encontrado' });
      return;
    }
    
    if (cursoDestino.rows.length === 0) {
      res.status(404).json({ message: 'Curso de destino não encontrado' });
      return;
    }
    
    const result = await pool.query(
      `UPDATE alunos 
       SET curso_id = $1 
       WHERE curso_id = $2 
       RETURNING COUNT(*) as alunos_transferidos`,
      [novo_curso_id, id]
    );
    
    const alunosTransferidos = parseInt(result.rows[0].alunos_transferidos);
    
    res.json({ 
      message: `${alunosTransferidos} alunos transferidos com sucesso`,
      alunos_transferidos: alunosTransferidos
    });
    
  } catch (error) {
    console.error('Erro ao transferir alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== ALUNOS ====================

app.get('/api/alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.nome,
        a.matricula,
        a.curso_id,
        c.nome as curso_nome,
        c.sigla as curso_sigla,
        a.created_at 
      FROM alunos a
      LEFT JOIN cursos c ON a.curso_id = c.id
      ORDER BY a.nome
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { nome, matricula, curso_id } = req.body;

    if (!nome || !matricula || !curso_id) {
      res.status(400).json({ message: 'Nome, matrícula e curso são obrigatórios' });
      return;
    }

    const cursoExists = await pool.query('SELECT id FROM cursos WHERE id = $1', [curso_id]);
    if (cursoExists.rows.length === 0) {
      res.status(400).json({ message: 'Curso não encontrado' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO alunos (nome, matricula, curso_id) 
       VALUES ($1, $2, $3) 
       RETURNING id, nome, matricula, curso_id, created_at`,
      [nome, matricula, curso_id]
    );

    console.log(`✅ Novo aluno cadastrado: ${nome} (${matricula})`);

    res.status(201).json({ 
      message: 'Aluno cadastrado com sucesso',
      aluno: result.rows[0]
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar aluno:', error);
    
    if (error.code === '23505') {
      res.status(400).json({ message: 'Matrícula já cadastrada' });
      return;
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== PROFESSORES ====================

app.get('/api/professores', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query(`
      SELECT id, nome, titulacao, tempo_docencia, created_at 
      FROM professores 
      ORDER BY nome
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/professores', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { nome, titulacao, tempo_docencia } = req.body;

    if (!nome || !titulacao || !tempo_docencia) {
      res.status(400).json({ message: 'Nome, titulação e tempo de docência são obrigatórios' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO professores (nome, titulacao, tempo_docencia) 
       VALUES ($1, $2, $3) 
       RETURNING id, nome, titulacao, tempo_docencia, created_at`,
      [nome, titulacao, parseInt(tempo_docencia)]
    );

    res.status(201).json({ 
      message: 'Professor cadastrado com sucesso',
      professor: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cadastrar professor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== DISCIPLINAS ====================

app.get('/api/disciplinas', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.nome, d.carga_horaria, d.professor_id, d.curso_id,
             p.nome as professor_nome,
             c.nome as curso_nome,
             c.sigla as curso_sigla
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      LEFT JOIN cursos c ON d.curso_id = c.id
      ORDER BY d.nome
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/disciplinas', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { nome, carga_horaria, professor_id, curso_id } = req.body;

    if (!nome || !carga_horaria || !professor_id || !curso_id) {
      res.status(400).json({ message: 'Nome, carga horária, professor e curso são obrigatórios' });
      return;
    }

    const professorExists = await pool.query(
      'SELECT id FROM professores WHERE id = $1',
      [professor_id]
    );

    if (professorExists.rows.length === 0) {
      res.status(400).json({ message: 'Professor não encontrado' });
      return;
    }

    const cursoExists = await pool.query(
      'SELECT id FROM cursos WHERE id = $1',
      [curso_id]
    );

    if (cursoExists.rows.length === 0) {
      res.status(400).json({ message: 'Curso não encontrado' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nome, carga_horaria, professor_id, curso_id, created_at`,
      [nome, parseInt(carga_horaria), parseInt(professor_id), parseInt(curso_id)]
    );

    res.status(201).json({ 
      message: 'Disciplina cadastrada com sucesso',
      disciplina: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cadastrar disciplina:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== NOTAS ====================

app.get('/api/notas/:alunoId/:disciplinaId', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { alunoId, disciplinaId } = req.params;

    const result = await pool.query(
      `SELECT * FROM notas 
       WHERE aluno_id = $1 AND disciplina_id = $2`,
      [alunoId, disciplinaId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Notas não encontradas' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/notas', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { aluno_id, disciplina_id, nota1, nota2 } = req.body;
    const user = (req as any).user;

    if (user.perfil !== 'professor' && user.perfil !== 'admin') {
      res.status(403).json({ message: 'Apenas professores podem cadastrar notas' });
      return;
    }

    if (!aluno_id || !disciplina_id) {
      res.status(400).json({ message: 'Aluno e disciplina são obrigatórios' });
      return;
    }

    const alunoExists = await pool.query('SELECT id FROM alunos WHERE id = $1', [aluno_id]);
    const disciplinaExists = await pool.query('SELECT id FROM disciplinas WHERE id = $1', [disciplina_id]);

    if (alunoExists.rows.length === 0) {
      res.status(400).json({ message: 'Aluno não encontrado' });
      return;
    }

    if (disciplinaExists.rows.length === 0) {
      res.status(400).json({ message: 'Disciplina não encontrada' });
      return;
    }

    const validarNota = (nota: any) => {
      if (nota === undefined || nota === null) return 0;
      const n = parseFloat(nota);
      return isNaN(n) ? 0 : Math.max(0, Math.min(10, n));
    };

    const nota1Validada = validarNota(nota1);
    const nota2Validada = validarNota(nota2);

    const result = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (aluno_id, disciplina_id) 
       DO UPDATE SET nota1 = $3, nota2 = $4
       RETURNING *`,
      [aluno_id, disciplina_id, nota1Validada, nota2Validada]
    );

    res.status(201).json({ 
      message: 'Notas salvas com sucesso',
      notas: result.rows[0]
    });
  } catch (error: any) {
    console.error('Erro ao salvar notas:', error);
    
    if (error.code === '23503') {
      res.status(400).json({ message: 'Aluno ou disciplina não encontrado' });
      return;
    }
    
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== ALUNOS DO PROFESSOR ====================

app.get('/api/professor/alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    if (user.perfil !== 'professor' && user.perfil !== 'admin') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const result = await pool.query(`
      SELECT 
        a.id,
        a.nome,
        a.matricula,
        c.nome as curso_nome,
        c.sigla as curso_sigla,
        a.created_at
      FROM alunos a
      LEFT JOIN cursos c ON a.curso_id = c.id
      ORDER BY a.nome
    `);

    console.log(`📊 Retornando ${result.rows.length} alunos para ${user.perfil}`);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/api/professor/disciplinas', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    if (user.perfil !== 'professor' && user.perfil !== 'admin') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const result = await pool.query(
      `SELECT d.id, d.nome, d.carga_horaria, d.curso_id,
              c.nome as curso_nome,
              c.sigla as curso_sigla
       FROM disciplinas d
       LEFT JOIN cursos c ON d.curso_id = c.id
       WHERE d.professor_id = $1 OR $2 = 'admin'
       ORDER BY d.nome`,
      [user.id, user.perfil]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas do professor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== BOLETIM ====================

app.get('/api/boletim/nome/:alunoNome', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { alunoNome } = req.params;
    console.log(`🔍 Buscando boletim para aluno: ${alunoNome}`);

    const alunoResult = await pool.query(
      `SELECT a.id, a.nome, a.matricula, c.nome as curso_nome, c.sigla as curso_sigla
       FROM alunos a
       LEFT JOIN cursos c ON a.curso_id = c.id
       WHERE LOWER(a.nome) LIKE LOWER($1)
       ORDER BY a.nome
       LIMIT 1`,
      [`%${alunoNome}%`]
    );

    if (alunoResult.rows.length === 0) {
      console.log('❌ Aluno não encontrado');
      res.status(404).json({ message: 'Aluno não encontrado. Verifique o nome digitado.' });
      return;
    }

    const aluno = alunoResult.rows[0];
    console.log('✅ Aluno encontrado:', aluno.nome);

    const result = await pool.query(`
      SELECT 
        d.id as disciplina_id,
        d.nome as disciplina_nome,
        p.nome as professor_nome,
        d.carga_horaria,
        COALESCE(CAST(n.nota1 AS DECIMAL), 0) as nota1,
        COALESCE(CAST(n.nota2 AS DECIMAL), 0) as nota2,
        COALESCE(CAST((COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0)) / 2 AS DECIMAL), 0) as media,
        CASE 
          WHEN COALESCE(CAST((COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0)) / 2 AS DECIMAL), 0) >= 6 THEN 'Aprovado'
          ELSE 'Reprovado'
        END as situacao
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      LEFT JOIN notas n ON d.id = n.disciplina_id AND n.aluno_id = $1
      WHERE n.id IS NOT NULL
      ORDER BY d.nome
    `, [aluno.id]);

    const disciplinas = result.rows;
    const totalDisciplinas = disciplinas.length;
    const disciplinasAprovadas = disciplinas.filter(d => d.situacao === 'Aprovado').length;
    const disciplinasReprovadas = disciplinas.filter(d => d.situacao === 'Reprovado').length;
    
    let mediaGeral = 0;
    if (totalDisciplinas > 0) {
      const somaMedias = disciplinas.reduce((sum, disc) => {
        const media = parseFloat(disc.media) || 0;
        return sum + media;
      }, 0);
      mediaGeral = somaMedias / totalDisciplinas;
    }

    console.log(`✅ Boletim gerado: ${totalDisciplinas} disciplinas, Média Geral: ${mediaGeral.toFixed(2)}`);

    res.json({
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        curso: `${aluno.curso_nome} (${aluno.curso_sigla})`
      },
      boletim: disciplinas,
      estatisticas: {
        totalDisciplinas,
        disciplinasAprovadas,
        disciplinasReprovadas,
        mediaGeral: mediaGeral.toFixed(1),
        percentualAprovacao: totalDisciplinas > 0 ? ((disciplinasAprovadas / totalDisciplinas) * 100).toFixed(0) : '0'
      }
    });

  } catch (error) {
    console.error('💥 Erro ao buscar boletim por nome:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/api/boletim/:alunoId', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { alunoId } = req.params;
    console.log(`📊 Buscando boletim completo para aluno ID: ${alunoId}`);

    const alunoExists = await pool.query(
      `SELECT a.id, a.nome, a.matricula, c.nome as curso_nome, c.sigla as curso_sigla 
       FROM alunos a
       LEFT JOIN cursos c ON a.curso_id = c.id
       WHERE a.id = $1`,
      [alunoId]
    );

    if (alunoExists.rows.length === 0) {
      console.log('❌ Aluno não encontrado');
      res.status(404).json({ message: 'Aluno não encontrado' });
      return;
    }

    const aluno = alunoExists.rows[0];
    console.log('✅ Aluno encontrado:', aluno.nome);

    const result = await pool.query(`
      SELECT 
        d.id as disciplina_id,
        d.nome as disciplina_nome,
        p.nome as professor_nome,
        d.carga_horaria,
        COALESCE(CAST(n.nota1 AS DECIMAL), 0) as nota1,
        COALESCE(CAST(n.nota2 AS DECIMAL), 0) as nota2,
        COALESCE(CAST((COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0)) / 2 AS DECIMAL), 0) as media,
        CASE 
          WHEN COALESCE(CAST((COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0)) / 2 AS DECIMAL), 0) >= 6 THEN 'Aprovado'
          ELSE 'Reprovado'
        END as situacao
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      LEFT JOIN notas n ON d.id = n.disciplina_id AND n.aluno_id = $1
      WHERE n.id IS NOT NULL
      ORDER BY d.nome
    `, [alunoId]);

    const disciplinas = result.rows;
    const totalDisciplinas = disciplinas.length;
    const disciplinasAprovadas = disciplinas.filter(d => d.situacao === 'Aprovado').length;
    const disciplinasReprovadas = disciplinas.filter(d => d.situacao === 'Reprovado').length;
    
    let mediaGeral = 0;
    if (totalDisciplinas > 0) {
      const somaMedias = disciplinas.reduce((sum, disc) => {
        const media = parseFloat(disc.media) || 0;
        return sum + media;
      }, 0);
      mediaGeral = somaMedias / totalDisciplinas;
    }

    console.log(`✅ Boletim gerado: ${totalDisciplinas} disciplinas, Média Geral: ${mediaGeral.toFixed(2)}`);

    res.json({
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        curso: `${aluno.curso_nome} (${aluno.curso_sigla})`
      },
      boletim: disciplinas,
      estatisticas: {
        totalDisciplinas,
        disciplinasAprovadas,
        disciplinasReprovadas,
        mediaGeral: mediaGeral.toFixed(1),
        percentualAprovacao: totalDisciplinas > 0 ? ((disciplinasAprovadas / totalDisciplinas) * 100).toFixed(0) : '0'
      }
    });

  } catch (error) {
    console.error('💥 Erro ao buscar boletim:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== SUGESTÕES DE ALUNOS ====================

app.get('/api/alunos/busca/:termo', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { termo } = req.params;

    const result = await pool.query(
      `SELECT a.id, a.nome, a.matricula, c.nome as curso_nome, c.sigla as curso_sigla
       FROM alunos a
       LEFT JOIN cursos c ON a.curso_id = c.id
       WHERE LOWER(a.nome) LIKE LOWER($1)
       ORDER BY a.nome
       LIMIT 10`,
      [`%${termo}%`]
    );

    console.log(`🔍 Sugestões para "${termo}": ${result.rows.length} alunos encontrados`);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== DEBUG ====================

app.get('/api/debug/alunos', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as any).user;

    if (user.perfil !== 'admin') {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    const result = await pool.query(`
      SELECT 
        a.id,
        a.nome,
        a.matricula,
        c.nome as curso_nome,
        c.sigla as curso_sigla,
        a.created_at,
        COUNT(n.id) as total_notas,
        COUNT(DISTINCT n.disciplina_id) as disciplinas_com_notas
      FROM alunos a
      LEFT JOIN cursos c ON a.curso_id = c.id
      LEFT JOIN notas n ON a.id = n.aluno_id
      GROUP BY a.id, a.nome, a.matricula, c.nome, c.sigla, a.created_at
      ORDER BY a.nome
    `);

    console.log('📊 Debug - Alunos no sistema:');
    result.rows.forEach(aluno => {
      console.log(`   👤 ${aluno.nome} (${aluno.matricula}) - ${aluno.curso_nome} - Notas: ${aluno.total_notas}`);
    });

    res.json(result.rows);
  } catch (error) {
    console.error('Erro no debug de alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== INICIALIZAÇÃO DO BANCO ====================

const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Inicializando banco de dados...');
    
    // ORDEM CORRETA de criação das tabelas (respeitando dependências)
    
    // 1. Tabela usuarios (sem dependências)
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

    // 2. Tabela professores (sem dependências)
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

    // 3. Tabela cursos (depende de professores)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cursos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        sigla VARCHAR(10) UNIQUE NOT NULL,
        area VARCHAR(100) NOT NULL,
        duracao_meses INTEGER NOT NULL,
        coordenador_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_coordenador FOREIGN KEY (coordenador_id) REFERENCES professores(id)
      );
    `);
    console.log('✅ Tabela "cursos" criada');

    // 4. Tabela alunos (depende de cursos)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) UNIQUE NOT NULL,
        curso_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_curso FOREIGN KEY (curso_id) REFERENCES cursos(id)
      );
    `);
    console.log('✅ Tabela "alunos" criada');

    // 5. Tabela disciplinas (depende de professores e cursos)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS disciplinas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        carga_horaria INTEGER NOT NULL,
        professor_id INTEGER,
        curso_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_professor FOREIGN KEY (professor_id) REFERENCES professores(id),
        CONSTRAINT fk_curso_disciplina FOREIGN KEY (curso_id) REFERENCES cursos(id)
      );
    `);
    console.log('✅ Tabela "disciplinas" criada');

    // 6. Tabela notas (depende de alunos e disciplinas)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notas (
        id SERIAL PRIMARY KEY,
        aluno_id INTEGER,
        disciplina_id INTEGER,
        nota1 DECIMAL(4,2) DEFAULT 0,
        nota2 DECIMAL(4,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(aluno_id, disciplina_id),
        CONSTRAINT fk_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id),
        CONSTRAINT fk_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
      );
    `);
    console.log('✅ Tabela "notas" criada');

    console.log('✅ Todas as tabelas criadas com sucesso!');

    // Hash da senha "1234"
    const SENHA_CORRETA_HASH = '$2a$10$CbNDV9rPNyjk9NnyZBeZfer/BciSJWLzmvcFO6aYz7m3FJfQ0MzU.';
    
    // Inserir usuários de teste
    console.log('👥 Inserindo usuários de teste...');
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
    console.log('✅ Usuários de teste inseridos');

    // Inserir professores de teste
    console.log('👨‍🏫 Inserindo professores de teste...');
    const professoresTeste = [
      {
        nome: 'Dr. Carlos Oliveira',
        titulacao: 'Doutor',
        tempo_docencia: 15
      },
      {
        nome: 'Dra. Ana Santos',
        titulacao: 'Mestre',
        tempo_docencia: 8
      }
    ];

    for (const prof of professoresTeste) {
      await pool.query(`
        INSERT INTO professores (nome, titulacao, tempo_docencia) 
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
      `, [prof.nome, prof.titulacao, prof.tempo_docencia]);
    }
    console.log('✅ Professores de teste inseridos');

    // Inserir cursos de teste
    console.log('📚 Inserindo cursos de teste...');
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
    console.log('✅ Cursos de teste inseridos');

    // Inserir alunos de teste
    console.log('👥 Inserindo alunos de teste...');
    const alunosTeste = [
      { nome: 'João Silva', matricula: '20240001', curso_id: 1 },
      { nome: 'Maria Souza', matricula: '20240002', curso_id: 2 },
      { nome: 'Carlos Oliveira', matricula: '20240003', curso_id: 1 },
      { nome: 'Ana Santos', matricula: '20240004', curso_id: 2 },
      { nome: 'Pedro Costa', matricula: '20240005', curso_id: 3 },
      { nome: 'Mariana Lima', matricula: '20240006', curso_id: 1 },
      { nome: 'Ricardo Alves', matricula: '20240007', curso_id: 2 },
      { nome: 'Fernanda Rocha', matricula: '20240008', curso_id: 4 }
    ];

    for (const aluno of alunosTeste) {
      await pool.query(`
        INSERT INTO alunos (nome, matricula, curso_id) 
        VALUES ($1, $2, $3)
        ON CONFLICT (matricula) DO NOTHING
      `, [aluno.nome, aluno.matricula, aluno.curso_id]);
    }
    console.log('✅ Alunos de teste inseridos');

    // Inserir disciplinas de teste
    console.log('📖 Inserindo disciplinas de teste...');
    const disciplinasTeste = [
      { nome: 'Programação I', carga_horaria: 80, professor_id: 1, curso_id: 1 },
      { nome: 'Banco de Dados', carga_horaria: 60, professor_id: 2, curso_id: 1 },
      { nome: 'Estrutura de Dados', carga_horaria: 80, professor_id: 1, curso_id: 1 },
      { nome: 'Programação Web', carga_horaria: 60, professor_id: 2, curso_id: 2 },
      { nome: 'Mobile Development', carga_horaria: 80, professor_id: 1, curso_id: 3 }
    ];

    for (const disc of disciplinasTeste) {
      await pool.query(`
        INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso_id) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [disc.nome, disc.carga_horaria, disc.professor_id, disc.curso_id]);
    }
    console.log('✅ Disciplinas de teste inseridas');

    // Inserir notas de teste
    console.log('📊 Inserindo notas de teste...');
    const notasTeste = [
      { aluno_id: 1, disciplina_id: 1, nota1: 7.5, nota2: 8.0 },
      { aluno_id: 1, disciplina_id: 2, nota1: 6.0, nota2: 7.5 },
      { aluno_id: 1, disciplina_id: 3, nota1: 5.5, nota2: 6.0 },
      { aluno_id: 2, disciplina_id: 1, nota1: 8.5, nota2: 9.0 },
      { aluno_id: 2, disciplina_id: 4, nota1: 7.0, nota2: 8.0 },
      { aluno_id: 3, disciplina_id: 1, nota1: 6.5, nota2: 7.0 },
      { aluno_id: 3, disciplina_id: 2, nota1: 8.0, nota2: 8.5 },
      { aluno_id: 4, disciplina_id: 1, nota1: 9.0, nota2: 8.5 },
      { aluno_id: 4, disciplina_id: 4, nota1: 7.5, nota2: 8.0 }
    ];

    for (const nota of notasTeste) {
      await pool.query(`
        INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (aluno_id, disciplina_id) DO NOTHING
      `, [nota.aluno_id, nota.disciplina_id, nota.nota1, nota.nota2]);
    }
    console.log('✅ Notas de teste inseridas');

    console.log('\n✅ Banco de dados inicializado com sucesso!');
    
    // Exibir estatísticas
    const cursosCount = await pool.query('SELECT COUNT(*) FROM cursos');
    const alunosCount = await pool.query('SELECT COUNT(*) FROM alunos');
    const professoresCount = await pool.query('SELECT COUNT(*) FROM professores');
    const disciplinasCount = await pool.query('SELECT COUNT(*) FROM disciplinas');
    const usuariosCount = await pool.query('SELECT COUNT(*) FROM usuarios');
    const notasCount = await pool.query('SELECT COUNT(*) FROM notas');
    
    console.log(`\n📊 Estatísticas do Sistema:`);
    console.log(`   👤 Usuários: ${usuariosCount.rows[0].count}`);
    console.log(`   📚 Cursos: ${cursosCount.rows[0].count}`);
    console.log(`   👥 Alunos: ${alunosCount.rows[0].count}`);
    console.log(`   👨‍🏫 Professores: ${professoresCount.rows[0].count}`);
    console.log(`   📖 Disciplinas: ${disciplinasCount.rows[0].count}`);
    console.log(`   📊 Notas: ${notasCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    console.error('💡 Dica: Se o erro persistir, tente executar o script de inicialização manualmente.');
  }
};

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Inicializar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Acesso pela rede: http://192.168.1.16:${PORT}/api/health`);
  console.log(`📚 App Scholar - Sistema Completo com Módulo de Cursos`);
  console.log('');
  console.log('🔑 Credenciais para teste:');
  console.log('   👨‍💼 Admin:     admin@app.com / 1234');
  console.log('   👨‍🏫 Professor: prof@app.com  / 1234');
  console.log('   👨‍🎓 Aluno:     aluno@app.com / 1234');
  console.log('');
  console.log('🎯 MÓDULOS DISPONÍVEIS:');
  console.log('   📊 Gestão Acadêmica Completa');
  console.log('   📚 Gerenciamento de Cursos');
  console.log('   👥 Controle de Alunos');
  console.log('   👨‍🏫 Cadastro de Professores');
  console.log('   📖 Disciplinas e Notas');
  console.log('   📋 Boletins Acadêmicos');
  console.log('');
  console.log('💡 Dicas de uso:');
  console.log('   • Use o perfil admin para acesso completo');
  console.log('   • Professores podem cadastrar notas e disciplinas');
  console.log('   • Alunos podem visualizar seus boletins');
  console.log('');
  
  await initializeDatabase();
});

export default app;