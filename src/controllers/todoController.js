const { validationResult } = require('express-validator');
const Todo = require('../models/Todo');

const createTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { title, description, completed } = req.body;
    const userId = req.user.userId;

    const todo = new Todo({
      title,
      description,
      completed: completed || false,
      userId
    });

    await todo.save();

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt
      }
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create todo' 
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const { title, description, completed } = req.body;

    const todo = await Todo.findOne({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found or you do not have permission to update it'
      });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt
      }
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update todo' 
    });
  }
};

const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId };

    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }

    const [todos, total] = await Promise.all([
      Todo.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Todo.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        todos: todos.map(todo => ({
          id: todo._id,
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve todos' 
    });
  }
};

const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await Todo.findOne({ _id: id, userId }).select('-__v');

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found or you do not have permission to view it'
      });
    }

    res.json({
      success: true,
      data: {
        id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt
      }
    });
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve todo' 
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found or you do not have permission to delete it'
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete todo' 
    });
  }
};

module.exports = {
  createTodo,
  updateTodo,
  getTodos,
  getTodoById,
  deleteTodo
};
