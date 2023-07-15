app.get('/:authorName', (req, res) => {
  db.query(`
    SELECT * FROM books WHERE authorName = ?
  `, [req.params.authorName], (err, books) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(books);
    }
  });
});