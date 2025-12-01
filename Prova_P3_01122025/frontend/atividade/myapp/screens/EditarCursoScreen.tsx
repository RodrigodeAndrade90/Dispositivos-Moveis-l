import React from 'react';
import CadastroCursoScreen from './CadastroCursoScreen';

// Esta tela é apenas um wrapper para reutilizar o CadastroCursoScreen
export default function EditarCursoScreen(props: any) {
  return <CadastroCursoScreen {...props} />;
}