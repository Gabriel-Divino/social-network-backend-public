import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send('Lista de usuários');
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Detalhes do usuário ${userId}`);
});

router.get('/teste', (req, res) => {
  res.send(`testando !`);
});

export default router;
