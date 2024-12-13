// Importando o módulo Express
import express from 'express';
import indexRouter from './routes/index.mjs';
import usersRouter from './routes/users.mjs';
import postsRouter from './routes/posts.mjs'
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

// Usando os roteadores
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts',postsRouter)


//export default app;  

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
})
