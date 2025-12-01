import pool from './config';

async function migrateAlunos(): Promise<void> {
  try {
    console.log('🔄 Migrando alunos para novo esquema...');
    
    // 1. Verificar se a coluna curso_id existe
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'alunos' AND column_name = 'curso_id'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('✅ Coluna curso_id não existe, criando...');
      
      // Adicionar coluna curso_id
      await pool.query(`
        ALTER TABLE alunos 
        ADD COLUMN curso_id INTEGER REFERENCES cursos(id)
      `);
      
      console.log('✅ Coluna curso_id criada com sucesso');
    }
    
    // 2. Verificar se a coluna curso (antiga) existe
    const checkOldColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'alunos' AND column_name = 'curso'
    `);
    
    if (checkOldColumn.rows.length === 0) {
      console.log('⚠️ Coluna "curso" (antiga) não existe. Migração não necessária.');
      process.exit(0);
    }
    
    // 3. Verificar quais cursos existem
    const cursos = await pool.query('SELECT id, sigla FROM cursos');
    console.log(`📚 Cursos disponíveis: ${cursos.rows.map(c => c.sigla).join(', ')}`);
    
    if (cursos.rows.length === 0) {
      console.log('❌ Nenhum curso cadastrado. Cadastre cursos primeiro.');
      process.exit(1);
    }
    
    // 4. Buscar alunos com curso antigo
    const alunos = await pool.query('SELECT id, curso FROM alunos WHERE curso IS NOT NULL');
    
    if (alunos.rows.length === 0) {
      console.log('⚠️ Nenhum aluno com curso antigo encontrado.');
      
      // Remover coluna antiga
      await pool.query('ALTER TABLE alunos DROP COLUMN curso');
      console.log('✅ Coluna "curso" removida com sucesso');
      process.exit(0);
    }
    
    // 5. Atualizar alunos com base no curso atual
    let atualizados = 0;
    let naoEncontrados = 0;
    
    for (const aluno of alunos.rows) {
      const cursoSigla = aluno.curso;
      
      if (!cursoSigla) {
        console.log(`   ⚠️  Aluno ${aluno.id}: Curso vazio`);
        continue;
      }
      
      // Buscar curso correspondente
      const curso = cursos.rows.find(c => 
        c.sigla.toUpperCase() === cursoSigla.toUpperCase()
      );
      
      if (curso) {
        await pool.query(
          'UPDATE alunos SET curso_id = $1 WHERE id = $2',
          [curso.id, aluno.id]
        );
        atualizados++;
        console.log(`   ✅ Aluno ${aluno.id} (${cursoSigla}) → ${curso.sigla}`);
      } else {
        console.log(`   ❌ Aluno ${aluno.id}: Curso "${cursoSigla}" não encontrado`);
        naoEncontrados++;
      }
    }
    
    console.log(`\n📊 Relatório da Migração:`);
    console.log(`   ✅ Alunos atualizados: ${atualizados}`);
    console.log(`   ❌ Cursos não encontrados: ${naoEncontrados}`);
    console.log(`   📋 Total de alunos processados: ${alunos.rows.length}`);
    
    if (naoEncontrados === 0) {
      // Remover coluna antiga
      await pool.query('ALTER TABLE alunos DROP COLUMN curso');
      console.log('\n✅ Coluna "curso" removida com sucesso');
    } else {
      console.log('\n⚠️  Coluna "curso" mantida devido a cursos não encontrados.');
      console.log('   Execute manualmente após corrigir: ALTER TABLE alunos DROP COLUMN curso;');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  migrateAlunos();
}

export default migrateAlunos;

