const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

router.get('/', async (req, res) => {
	const categoryList = await Category.find();
	if (!categoryList) {
		res.status(500).json({ success: false });
	}
	res.status(200).send(categoryList);
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	const category = await Category.findById(id);
	if (!category) {
		res.status(500).json({
			message: 'The category with given ID was not found!',
		});
	} else {
		res.status(200).send(category);
	}
});

router.post('/', async (req, res) => {
	let category = new Category({
		name: req.body.name,
		color: req.body.color,
		icon: req.body.icon,
	});
	category = await category.save();
	if (!category) {
		return res.status(404).send('The category cannot be created');
	}

	res.send(category);
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const category = await Category.findByIdAndUpdate(
		id,
		{
			name: req.body.name,
			color: req.body.color,
			icon: req.body.icon,
		},
		{ new: true }
	);

	if (!category) {
		return res.status(404).send('The category cannot be created');
	}

	res.send(category);
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await Category.findByIdAndDelete(id)
		.then((category) => {
			if (category) {
				return res.status(200).json({
					success: true,
					message: 'The category is deleted!',
				});
			} else {
				return res
					.status(404)
					.json({ success: false, message: 'Category not found!' });
			}
		})
		.catch((err) => {
			return res.status(400).json({
				success: false,
				error: err,
			});
		});
});

module.exports = router;
