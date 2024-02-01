const express = require('express');
const app = express();
const port = 3000;
let expenses = [];

app.use(express.json());

app.use((req, res, next) => {
  res.locals.formatDate = (date) => new Date(date).toLocaleString();
  next();
});

app.post('/expenses', (req, res) => {
  const { name, cost } = req.body;

  if (!name || !cost) {
    return res.status(400).json({ error: 'Name and cost are required fields' });
  }

  const id = expenses.length + 1;
  const createdAt = new Date();

  const newExpense = { id, name, cost, createdAt };
  expenses.push(newExpense);

  res.status(201).json(newExpense);
});

app.get('/expenses', (req, res) => {
  res.json(expenses);
});

app.get('/expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);
  const expense = expenses.find(e => e.id === expenseId);

  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  res.json(expense);
});

app.put('/expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);
  const expenseIndex = expenses.findIndex(e => e.id === expenseId);

  if (expenseIndex === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  const { name, cost } = req.body;
  expenses[expenseIndex] = { ...expenses[expenseIndex], name, cost };

  res.json(expenses[expenseIndex]);
});

app.delete('/expenses/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);
  expenses = expenses.filter(e => e.id !== expenseId);

  res.json({ message: 'Expense deleted successfully' });
});

app.get('/expense-page/:id', (req, res) => {
  const expenseId = parseInt(req.params.id);
  const expense = expenses.find(e => e.id === expenseId);

  if (!expense) {
    return res.status(404).send('Expense not found');
  }

  res.send(`
    <html>
      <head>
        <title>Expense Details</title>
      </head>
      <body>
        <h1>Expense Details</h1>
        <p>ID: ${expense.id}</p>
        <p>Name: ${expense.name}</p>
        <p>Cost: ${expense.cost}</p>
        <p>Created At: ${res.locals.formatDate(expense.createdAt)}</p>
      </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
