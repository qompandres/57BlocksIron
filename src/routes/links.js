const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, tipo, description } = req.body;
    const newLink = {
        title,
        tipo,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO pokemon set ?', [newLink]);
    req.flash('success', 'Pokemón guardado exitosamente');
    res.redirect('/dev/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM pokemon WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM pokemon WHERE ID = ?', [id]);
    req.flash('success', 'Pokemón removido exitosamente');
    res.redirect('/dev/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM pokemon WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, tipo } = req.body;
    const newLink = {
        title,
        description,
        tipo
    };
    await pool.query('UPDATE pokemon set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Pokémon actualizado exitosamente');
    res.redirect('/dev/links');
});

module.exports = router;
