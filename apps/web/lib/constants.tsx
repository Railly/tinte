/* eslint-disable @next/next/no-img-element */
import { IconSupabase, IconTailwind, IconVercel } from "@/components/ui/icons";
import { DarkLightPalette } from "./core/types";

export const LANGS = [
  "angular",
  "assembly",
  "astro",
  "bash",
  "c",
  "c#",
  "c++",
  "css",
  "dart",
  "go",
  "html",
  "java",
  "javascript",
  "json",
  "jsx",
  "kotlin",
  "latex",
  "lua",
  "markdown",
  "ocaml",
  "php",
  "python",
  "r",
  "ruby",
  "rust",
  "scala",
  "solidity",
  "sql",
  "svelte",
  "swift",
  "toml",
  "tsx",
  "typescript",
  "vue",
  "xml",
  "zig",
];

export const MONACO_SHIKI_LANGS = {
  angular: "typescript",
  assembly: "asm",
  astro: "astro",
  bash: "shell",
  c: "c",
  "c#": "csharp",
  "c++": "cpp",
  css: "css",
  dart: "dart",
  go: "go",
  html: "html",
  java: "java",
  javascript: "javascript",
  json: "json",
  jsx: "jsx",
  kotlin: "kotlin",
  latex: "latex",
  lua: "lua",
  markdown: "markdown",
  ocaml: "ocaml",
  php: "php",
  python: "python",
  r: "r",
  ruby: "ruby",
  rust: "rust",
  scala: "scala",
  solidity: "solidity",
  sql: "sql",
  svelte: "svelte",
  swift: "swift",
  toml: "toml",
  tsx: "tsx",
  typescript: "typescript",
  vue: "vue",
  xml: "xml",
  zig: "zig",
};

export const DEFAULT_LANGUAGE = "typescript";

export const CODE_SAMPLES: Record<string, string> = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Web Page</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 font-sans">
    <header class="bg-blue-600 text-white p-4">
        <nav class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold">My Website</h1>
            <ul class="flex space-x-4">
                <li><a href="#" class="hover:text-blue-200">Home</a></li>
                <li><a href="#" class="hover:text-blue-200">About</a></li>
                <li><a href="#" class="hover:text-blue-200">Services</a></li>
                <li><a href="#" class="hover:text-blue-200">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main class="container mx-auto mt-8 p-4">
        <section class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-3xl font-bold mb-4">Welcome to Our Site</h2>
            <p class="text-gray-700">This is a sample page showcasing modern HTML and CSS techniques using Tailwind CSS.</p>
        </section>
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2">Feature 1</h3>
                <p class="text-gray-600">Description of feature 1 goes here.</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2">Feature 2</h3>
                <p class="text-gray-600">Description of feature 2 goes here.</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2">Feature 3</h3>
                <p class="text-gray-600">Description of feature 3 goes here.</p>
            </div>
        </section>
    </main>
    <footer class="bg-gray-800 text-white mt-8 py-4">
        <div class="container mx-auto text-center">
            <p>&copy; 2024 My Website. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`,
  css: `/* Modern CSS with custom properties and responsive design */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --text-color: #333;
  --background-color: #f4f4f4;
  --font-family: 'Arial', sans-serif;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
  margin: 0;
  padding: 0;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
}

nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-around;
}

nav ul li a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

nav ul li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.hero {
  background-color: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 4rem 0;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    align-items: center;
  }
  
  nav ul li {
    margin-bottom: 0.5rem;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
}`,
  tsx: `import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, CREATE_USER } from './graphql/queries';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserFormData {
  name: string;
  email: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<UserFormData>({ name: '', email: '' });

  const { loading, error, data } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    if (data) {
      setUsers(data.users);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createUser({ variables: { input: formData } });
      setUsers(prevUsers => [...prevUsers, data.createUser]);
      setFormData({ name: '', email: '' });
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="border p-2 mr-2"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add User
        </button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id} className="mb-2">
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;`,

  jsx: `import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'your_api_key_here';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: location,
          appid: API_KEY,
          units: 'metric'
        }
      });
      setWeather(response.data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weather Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city name"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Get Weather
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {weather && (
        <div>
          <h2 className="text-2xl mb-2">{weather.name}, {weather.sys.country}</h2>
          <p className="text-4xl mb-4">{Math.round(weather.main.temp)}°C</p>
          <p>{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;`,

  vue: `<template>
  <div class="todo-app">
    <h1>{{ title }}</h1>
    <input
      v-model="newTodo"
      @keyup.enter="addTodo"
      placeholder="Add a new todo"
    >
    <ul>
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input
          type="checkbox"
          v-model="todo.completed"
        >
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo)">X</button>
      </li>
    </ul>
    <div class="filters">
      <button @click="filter = 'all'">All</button>
      <button @click="filter = 'active'">Active</button>
      <button @click="filter = 'completed'">Completed</button>
    </div>
    <p>{{ remainingTodos }} items left</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Vue.js Todo App',
      newTodo: '',
      filter: 'all',
      todos: [
        { id: 1, text: 'Learn Vue.js', completed: false },
        { id: 2, text: 'Build a Todo App', completed: true },
        { id: 3, text: 'Master Vue.js', completed: false },
      ]
    }
  },
  computed: {
    filteredTodos() {
      if (this.filter === 'active') {
        return this.todos.filter(todo => !todo.completed)
      }
      if (this.filter === 'completed') {
        return this.todos.filter(todo => todo.completed)
      }
      return this.todos
    },
    remainingTodos() {
      return this.todos.filter(todo => !todo.completed).length
    }
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim().length === 0) {
        return
      }
      this.todos.push({
        id: this.todos.length + 1,
        text: this.newTodo.trim(),
        completed: false
      })
      this.newTodo = ''
    },
    removeTodo(todo) {
      const index = this.todos.indexOf(todo)
      this.todos.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.todo-app {
  max-width: 400px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.completed span {
  text-decoration: line-through;
  color: #999;
}
.filters {
  margin-top: 20px;
}
button {
  margin-right: 10px;
}
</style>`,
  json: `{
  "company": {
    "name": "Tech Innovations Inc.",
    "founded": 2010,
    "headquarters": {
      "city": "San Francisco",
      "state": "California",
      "country": "USA"
    },
    "employees": 500,
    "publiclyTraded": true,
    "stock": {
      "symbol": "TCIN",
      "exchange": "NASDAQ"
    }
  },
  "products": [
    {
      "name": "SmartHome Hub",
      "category": "IoT",
      "price": 199.99,
      "features": [
        "Voice Control",
        "Energy Management",
        "Security Integration"
      ],
      "compatibility": [
        "Amazon Alexa",
        "Google Home",
        "Apple HomeKit"
      ]
    },
    {
      "name": "CloudSync Pro",
      "category": "Software",
      "price": 14.99,
      "subscription": "monthly",
      "features": [
        "Unlimited Storage",
        "Real-time Collaboration",
        "End-to-end Encryption"
      ],
      "platforms": [
        "Windows",
        "macOS",
        "Linux",
        "iOS",
        "Android"
      ]
    }
  ],
  "partnerships": [
    {
      "partner": "GlobalTech Solutions",
      "type": "Research & Development",
      "projects": [
        "AI-driven Analytics",
        "Quantum Computing Integration"
      ]
    },
    {
      "partner": "EcoSmart Innovations",
      "type": "Sustainability Initiative",
      "focus": [
        "Renewable Energy Solutions",
        "E-waste Reduction Programs"
      ]
    }
  ],
  "financials": {
      "revenue": {
        "2021": 50000000,
        "2022": 75000000,
        "2023": 100000000
      },
      "expenses": {
        "2021": 40000000,
        "2022": 55000000,
        "2023": 70000000
      },
      "netProfit": {
        "2021": 10000000,
        "2022": 20000000,
        "2023": 30000000
      },
      "marketCap": 2000000000,
      "quarterlyGrowth": 0.15
    },
  "futureProjects": [
    {
      "name": "Project Quantum",
      "description": "Next-gen quantum computing solutions",
      "estimatedLaunch": "2025-Q3",
      "budget": 50000000
    },
    {
      "name": "GreenTech Initiative",
      "description": "Sustainable technology innovations",
      "estimatedLaunch": "2024-Q2",
      "budget": 30000000
    }
  ]
}`,
  php: `<?php

namespace Blog;

use PDO;
use PDOException;

// Interface
interface Loggable {
    public function log($message);
}

// Trait
trait Timestampable {
    protected $createdAt;
    protected $updatedAt;

    public function setTimestamps() {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function updateTimestamp() {
        $this->updatedAt = new \DateTime();
    }
}

// Abstract class
abstract class BaseModel implements Loggable {
    protected $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function log($message) {
        echo "[" . date('Y-m-d H:i:s') . "] $message\n";
    }

    abstract public function save();
}

// Concrete class
class Post extends BaseModel {
    use Timestampable;

    private $id;
    private $title;
    private $content;
    private $authorId;

    public function __construct(PDO $db, $title, $content, $authorId) {
        parent::__construct($db);
        $this->title = $title;
        $this->content = $content;
        $this->authorId = $authorId;
        $this->setTimestamps();
    }

    public function save() {
        try {
            $stmt = $this->db->prepare("INSERT INTO posts (title, content, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$this->title, $this->content, $this->authorId, $this->createdAt->format('Y-m-d H:i:s'), $this->updatedAt->format('Y-m-d H:i:s')]);
            $this->id = $this->db->lastInsertId();
            $this->log("Post saved with ID: " . $this->id);
            return true;
        } catch (PDOException $e) {
            $this->log("Error saving post: " . $e->getMessage());
            return false;
        }
    }

    public static function findById(PDO $db, $id) {
        $stmt = $db->prepare("SELECT * FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

class BlogManager {
    private $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function createPost($title, $content, $authorId) {
        $post = new Post($this->db, $title, $content, $authorId);
        return $post->save();
    }

    public function getRecentPosts($limit = 5) {
        $stmt = $this->db->prepare("SELECT * FROM posts ORDER BY created_at DESC LIMIT ?");
        $stmt->execute([$limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

// Usage example
try {
    $db = new PDO('mysql:host=localhost;dbname=blog', 'username', 'password');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $blogManager = new BlogManager($db);

    // Create a new post
    $blogManager->createPost("My First Blog Post", "This is the content of my first blog post.", 1);

    // Retrieve recent posts
    $recentPosts = $blogManager->getRecentPosts();
    foreach ($recentPosts as $post) {
        echo "Title: " . $post['title'] . "\n";
        echo "Content: " . $post['content'] . "\n";
        echo "Created At: " . $post['created_at'] . "\n";
        echo "------------------------\n";
    }

    // Retrieve a specific post
    $specificPost = Post::findById($db, 1);
    if ($specificPost) {
        echo "Specific Post Title: " . $specificPost['title'] . "\n";
    } else {
        echo "Post not found.\n";
    }

} catch (PDOException $e) {
    echo "Database Error: " . $e->getMessage();
}
`,
  typescript: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: Date;
}

class UserManager {
  private users: User[] = [];

  constructor() {}

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  updateUser(id: number, updates: Partial<User>): void {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
  }

  getAdmins(): User[] {
    return this.users.filter(user => user.role === 'admin');
  }
}

const userManager = new UserManager();

userManager.addUser({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  lastLogin: new Date()
});

console.log(userManager.getUserById(1));
userManager.updateUser(1, { name: 'John Smith' });
console.log(userManager.getAdmins());`,

  javascript: `class TodoList {
  constructor() {
    this.todos = [];
  }

  addTodo(title) {
    const todo = {
      id: this.todos.length + 1,
      title,
      completed: false,
      createdAt: new Date()
    };
    this.todos.push(todo);
    return todo;
  }

  toggleTodo(id) {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return todo;
  }

  removeTodo(id) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      return this.todos.splice(index, 1)[0];
    }
    return null;
  }

  getTodos() {
    return this.todos;
  }

  getCompletedTodos() {
    return this.todos.filter(todo => todo.completed);
  }

  getPendingTodos() {
    return this.todos.filter(todo => !todo.completed);
  }
}

const todoList = new TodoList();

todoList.addTodo('Learn JavaScript');
todoList.addTodo('Build a todo app');
todoList.addTodo('Master async/await');

console.log(todoList.getTodos());
todoList.toggleTodo(2);
console.log(todoList.getCompletedTodos());
todoList.removeTodo(3);
console.log(todoList.getPendingTodos());`,

  sql: `-- Create tables
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert sample data
INSERT INTO customers (first_name, last_name, email) VALUES
('John', 'Doe', 'john@example.com'),
('Jane', 'Smith', 'jane@example.com'),
('Bob', 'Johnson', 'bob@example.com');

INSERT INTO products (name, description, price, stock_quantity) VALUES
('Laptop', 'High-performance laptop', 999.99, 50),
('Smartphone', 'Latest model smartphone', 699.99, 100),
('Headphones', 'Noise-cancelling headphones', 199.99, 75);

INSERT INTO orders (customer_id, total_amount) VALUES
(1, 1199.98),
(2, 699.99),
(3, 399.98);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 999.99),
(1, 3, 1, 199.99),
(2, 2, 1, 699.99),
(3, 3, 2, 199.99);

-- Sample queries
-- Get all customers with their order count
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    COUNT(o.order_id) AS order_count
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
GROUP BY 
    c.customer_id
ORDER BY 
    order_count DESC;

-- Get top 5 selling products
SELECT 
    p.product_id,
    p.name,
    SUM(oi.quantity) AS total_sold
FROM 
    products p
JOIN 
    order_items oi ON p.product_id = oi.product_id
GROUP BY 
    p.product_id
ORDER BY 
    total_sold DESC
LIMIT 5;

-- Calculate total revenue
SELECT 
    SUM(total_amount) AS total_revenue
FROM 
    orders;

-- Get customers who haven't placed any orders
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id
WHERE 
    o.order_id IS NULL;`,
  go: `package main

import (
	"fmt"
	"sync"
	"time"
)

type Task struct {
	ID        int
	Name      string
	Completed bool
}

type TaskManager struct {
	tasks []Task
	mu    sync.Mutex
}

func NewTaskManager() *TaskManager {
	return &TaskManager{tasks: make([]Task, 0)}
}

func (tm *TaskManager) AddTask(name string) {
	tm.mu.Lock()
	defer tm.mu.Unlock()
	task := Task{
		ID:        len(tm.tasks) + 1,
		Name:      name,
		Completed: false,
	}
	tm.tasks = append(tm.tasks, task)
}

func (tm *TaskManager) CompleteTask(id int) bool {
	tm.mu.Lock()
	defer tm.mu.Unlock()
	for i, task := range tm.tasks {
		if task.ID == id {
			tm.tasks[i].Completed = true
			return true
		}
	}
	return false
}

func (tm *TaskManager) ListTasks() []Task {
	tm.mu.Lock()
	defer tm.mu.Unlock()
	return tm.tasks
}

func worker(id int, jobs <-chan Task, results chan<- string) {
	for job := range jobs {
		fmt.Printf("Worker %d started job %d\n", id, job.ID)
		time.Sleep(time.Second) // Simulate work
		results <- fmt.Sprintf("Worker %d finished job %d", id, job.ID)
	}
}

func main() {
	tm := NewTaskManager()
	tm.AddTask("Learn Go")
	tm.AddTask("Build a web server")
	tm.AddTask("Master concurrency")

	fmt.Println("Initial tasks:", tm.ListTasks())

	tm.CompleteTask(1)
	fmt.Println("After completing task 1:", tm.ListTasks())

	jobs := make(chan Task, len(tm.tasks))
	results := make(chan string, len(tm.tasks))

	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}

	for _, task := range tm.tasks {
		jobs <- task
	}
	close(jobs)

	for range tm.tasks {
		fmt.Println(<-results)
	}
}`,

  rust: `use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;

#[derive(Debug, Clone)]
struct Book {
    id: u32,
    title: String,
    author: String,
    year: u32,
}

struct Library {
    books: HashMap<u32, Book>,
    last_id: u32,
}

impl Library {
    fn new() -> Self {
        Library {
            books: HashMap::new(),
            last_id: 0,
        }
    }

    fn add_book(&mut self, title: String, author: String, year: u32) -> u32 {
        self.last_id += 1;
        let book = Book {
            id: self.last_id,
            title,
            author,
            year,
        };
        self.books.insert(self.last_id, book);
        self.last_id
    }

    fn get_book(&self, id: u32) -> Option<&Book> {
        self.books.get(&id)
    }

    fn remove_book(&mut self, id: u32) -> Option<Book> {
        self.books.remove(&id)
    }

    fn list_books(&self) -> Vec<&Book> {
        self.books.values().collect()
    }
}

fn main() {
    let library = Arc::new(Mutex::new(Library::new()));

    let mut handles = vec![];

    for i in 0..5 {
        let library = Arc::clone(&library);
        let handle = thread::spawn(move || {
            let mut lib = library.lock().unwrap();
            let id = lib.add_book(
                format!("Book {}", i),
                format!("Author {}", i),
                2023,
            );
            println!("Added book with ID: {}", id);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let lib = library.lock().unwrap();
    println!("All books:");
    for book in lib.list_books() {
        println!("{:?}", book);
    }
}`,

  python: `import asyncio
import aiohttp
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Post:
    id: int
    title: str
    body: str
    user_id: int

class BlogService:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.session.close()

    async def get_posts(self) -> List[Post]:
        async with self.session.get(f"{self.base_url}/posts") as response:
            data = await response.json()
            return [Post(**post) for post in data]

    async def get_post(self, post_id: int) -> Optional[Post]:
        async with self.session.get(f"{self.base_url}/posts/{post_id}") as response:
            if response.status == 200:
                data = await response.json()
                return Post(**data)
            return None

    async def create_post(self, title: str, body: str, user_id: int) -> Post:
        data = {"title": title, "body": body, "userId": user_id}
        async with self.session.post(f"{self.base_url}/posts", json=data) as response:
            response_data = await response.json()
            return Post(**response_data)

async def main():
    async with BlogService("https://jsonplaceholder.typicode.com") as blog_service:
        # Get all posts
        posts = await blog_service.get_posts()
        print(f"Total posts: {len(posts)}")

        # Get a specific post
        post = await blog_service.get_post(1)
        if post:
            print(f"Post 1 title: {post.title}")

        # Create a new post
        new_post = await blog_service.create_post(
            "New Post", "This is a new post body", 1
        )
        print(f"Created new post with ID: {new_post.id}")

        # Fetch and print the titles of the first 5 posts
        tasks = [blog_service.get_post(i) for i in range(1, 6)]
        results = await asyncio.gather(*tasks)
        for post in results:
            if post:
                print(f"Post {post.id} title: {post.title}")

if __name__ == "__main__":
    asyncio.run(main())`,

  ruby: `require 'net/http'
require 'json'

class WeatherAPI
  BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'
  
  def initialize(api_key)
    @api_key = api_key
  end

  def get_weather(city)
    uri = URI("#{BASE_URL}?q=#{city}&appid=#{@api_key}&units=metric")
    response = Net::HTTP.get(uri)
    JSON.parse(response)
  end
end

class WeatherReport
  def initialize(api)
    @api = api
  end

  def generate_report(city)
    data = @api.get_weather(city)
    
    if data['cod'] == 200
      temp = data['main']['temp']
      humidity = data['main']['humidity']
      description = data['weather'][0]['description']
      
      <<~REPORT
        Weather Report for #{city}:
        Temperature: #{temp}°C
        Humidity: #{humidity}%
        Conditions: #{description.capitalize}
      REPORT
    else
      "Error: Unable to fetch weather data for #{city}"
    end
  end
end

# Usage
api_key = 'your_api_key_here'
weather_api = WeatherAPI.new(api_key)
report_generator = WeatherReport.new(weather_api)

cities = ['London', 'New York', 'Tokyo', 'Sydney']

cities.each do |city|
  puts report_generator.generate_report(city)
  puts "---"
end

# Metaprogramming example: Dynamic method creation
class WeatherDataAnalyzer
  def initialize(api)
    @api = api
  end

  %w[temperature humidity wind_speed].each do |attribute|
    define_method("average_#{attribute}") do |cities|
      total = cities.sum do |city|
        data = @api.get_weather(city)
        case attribute
        when 'temperature'
          data['main']['temp']
        when 'humidity'
          data['main']['humidity']
        when 'wind_speed'
          data['wind']['speed']
        end
      end
      (total / cities.size.to_f).round(2)
    end
  end
end

analyzer = WeatherDataAnalyzer.new(weather_api)
puts "Average temperature: #{analyzer.average_temperature(cities)}°C"
puts "Average humidity: #{analyzer.average_humidity(cities)}%"
puts "Average wind speed: #{analyzer.average_wind_speed(cities)} m/s"`,

  dart: `import 'dart:async';
import 'dart:math';

class Stock {
  final String symbol;
  double price;

  Stock(this.symbol, this.price);
}

class StockExchange {
  final List<Stock> stocks;
  final Random random = Random();

  StockExchange(this.stocks);

  Stream<Stock> priceUpdates() async* {
    while (true) {
      await Future.delayed(Duration(seconds: 1));
      final stock = stocks[random.nextInt(stocks.length)];
      stock.price += random.nextDouble() * 2 - 1; // Random price change between -1 and 1
      yield stock;
    }
  }
}

class StockPortfolio {
  final Map<String, int> holdings;

  StockPortfolio(this.holdings);

  double calculateValue(List<Stock> currentPrices) {
    return holdings.entries.fold(0, (total, holding) {
      final stock = currentPrices.firstWhere((s) => s.symbol == holding.key);
      return total + (stock.price * holding.value);
    });
  }
}

void main() async {
  final stocks = [
    Stock('AAPL', 150.0),
    Stock('GOOGL', 2800.0),
    Stock('MSFT', 300.0),
    Stock('AMZN', 3300.0),
  ];

  final exchange = StockExchange(stocks);
  final portfolio = StockPortfolio({
    'AAPL': 10,
    'GOOGL': 5,
    'MSFT': 15,
    'AMZN': 3,
  });

  double initialValue = portfolio.calculateValue(stocks);
  print('Initial portfolio value: $\${initialValue.toStringAsFixed(2)}');

  final streamSubscription = exchange.priceUpdates().listen((stock) {
    print('\${stock.symbol} price updated to $\${stock.price.toStringAsFixed(2)}');
    double currentValue = portfolio.calculateValue(stocks);
    print('Current portfolio value: $\${currentValue.toStringAsFixed(2)}');
    double change = currentValue - initialValue;
    String changeStr = change >= 0 ? '+' : '-';
    print('Change: \${changeStr}$\${change.abs().toStringAsFixed(2)}');
    print('---');
  });

  // Stop the simulation after 1 minute
  await Future.delayed(Duration(minutes: 1));
  await streamSubscription.cancel();
  print('Simulation ended');
}`,
  swift: `import Foundation

// MARK: - Protocols

protocol Vehicle {
    var name: String { get }
    var maxSpeed: Double { get }
    func start()
    func stop()
}

protocol Electric {
    var batteryLevel: Int { get set }
    func charge()
}

// MARK: - Structs and Classes

struct Car: Vehicle {
    let name: String
    let maxSpeed: Double
    
    func start() {
        print("\(name) is starting. Vroom!")
    }
    
    func stop() {
        print("\(name) is stopping.")
    }
}

class ElectricCar: Vehicle, Electric {
    let name: String
    let maxSpeed: Double
    var batteryLevel: Int
    
    init(name: String, maxSpeed: Double, batteryLevel: Int) {
        self.name = name
        self.maxSpeed = maxSpeed
        self.batteryLevel = batteryLevel
    }
    
    func start() {
        print("\(name) is starting silently.")
    }
    
    func stop() {
        print("\(name) is stopping.")
    }
    
    func charge() {
        print("Charging \(name). Battery level: \(batteryLevel)%")
    }
}

// MARK: - Extensions

extension Vehicle {
    func describe() {
        print("\(name) can reach a maximum speed of \(maxSpeed) km/h.")
    }
}

// MARK: - Error Handling

enum VehicleError: Error {
    case lowBattery
    case engineFailure(reason: String)
}

// MARK: - Generics

class Fleet<T: Vehicle> {
    private var vehicles: [T] = []
    
    func add(_ vehicle: T) {
        vehicles.append(vehicle)
    }
    
    func startAll() throws {
        for vehicle in vehicles {
            if let electricVehicle = vehicle as? Electric {
                guard electricVehicle.batteryLevel > 10 else {
                    throw VehicleError.lowBattery
                }
            }
            vehicle.start()
        }
    }
}

// MARK: - Usage

let sedan = Car(name: "Sedan", maxSpeed: 180)
let electricSedan = ElectricCar(name: "Tesla Model 3", maxSpeed: 225, batteryLevel: 80)

sedan.describe()
electricSedan.describe()

let fleet = Fleet<Vehicle>()
fleet.add(sedan)
fleet.add(electricSedan)

do {
    try fleet.startAll()
} catch VehicleError.lowBattery {
    print("Error: Cannot start all vehicles. Low battery detected.")
} catch VehicleError.engineFailure(let reason) {
    print("Error: Engine failure. Reason: \(reason)")
} catch {
    print("An unexpected error occurred: \(error)")
}

// MARK: - Closures and Higher-order functions

let vehicles: [Vehicle] = [sedan, electricSedan]
let fastVehicles = vehicles.filter { $0.maxSpeed > 200 }
                           .map { $0.name }

print("Fast vehicles: \(fastVehicles)")

// MARK: - Asynchronous Programming

func simulateCharging(_ car: ElectricCar) async {
    print("Starting to charge \(car.name)")
    for _ in 1...5 {
        try? await Task.sleep(nanoseconds: 1_000_000_000)  // Sleep for 1 second
        car.batteryLevel += 10
        print("\(car.name) battery level: \(car.batteryLevel)%")
    }
    print("Finished charging \(car.name)")
}

Task {
    await simulateCharging(electricSedan)
}

// Keep the program running to see async results
RunLoop.main.run(until: Date(timeIntervalSinceNow: 6))
`,
  kotlin: `import kotlinx.coroutines.*

data class Task(val id: Int, val description: String)

class TaskManager {
    private val tasks = mutableListOf<Task>()

    fun addTask(task: Task) {
        tasks.add(task)
    }

    fun getTasks() = tasks.toList()

    suspend fun processTasks() = coroutineScope {
        tasks.map { task ->
            async {
                delay(1000) // Simulate processing time
                "Processed: \${task.description}"
            }
        }.awaitAll()
    }
}

suspend fun main() {
    val manager = TaskManager()
    manager.addTask(Task(1, "Complete Kotlin example"))
    manager.addTask(Task(2, "Learn coroutines"))

    println("Tasks: \${manager.getTasks()}")

    val results = manager.processTasks()
    println("Results: $results")

    // Extension function example
    fun List<Task>.printSummary() {
        println("Total tasks: \${this.size}")
    }

    manager.getTasks().printSummary()
}`,
  java: `import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class JavaExample {
    public static void main(String[] args) {
        List<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");

        // Using streams and lambda expressions
        List<String> upperCaseFruits = fruits.stream()
                .map(String::toUpperCase)
                .collect(Collectors.toList());

        System.out.println("Upper case fruits: " + upperCaseFruits);

        // Using optional to avoid null checks
        String longestFruit = fruits.stream()
                .max((a, b) -> a.length() - b.length())
                .orElse("No fruits found");

        System.out.println("Longest fruit: " + longestFruit);
    }
}

// Generic class example
class Box<T> {
    private T content;

    public void put(T item) {
        this.content = item;
    }

    public T get() {
        return content;
    }
}`,

  "c#": `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpExample
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var numbers = new List<int> { 1, 2, 3, 4, 5 };

            // LINQ example
            var evenNumbers = numbers.Where(n => n % 2 == 0).ToList();
            Console.WriteLine($"Even numbers: {string.Join(", ", evenNumbers)}");

            // Async method call
            await PrintDelayedMessageAsync("Hello, C#!");

            // Pattern matching
            object obj = "Hello";
            if (obj is string message)
            {
                Console.WriteLine($"The object is a string: {message}");
            }
        }

        static async Task PrintDelayedMessageAsync(string message)
        {
            await Task.Delay(1000);
            Console.WriteLine(message);
        }
    }

    // Records for immutable data
    public record Person(string Name, int Age);
}`,
  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NAME_LENGTH 50

// Structure definition
typedef struct {
    char name[MAX_NAME_LENGTH];
    int age;
} Person;

// Function prototype
void print_person(const Person* p);

int main() {
    // Dynamic memory allocation
    int* numbers = (int*)malloc(5 * sizeof(int));
    if (numbers == NULL) {
        fprintf(stderr, "Memory allocation failed");
        return 1;
    }

    for (int i = 0; i < 5; i++) {
        numbers[i] = i * 10;
    }

    printf("Numbers: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", numbers[i]);
    }
    printf("");

    free(numbers);

    // Using structures
    Person person = {"John Doe", 30};
    print_person(&person);

    return 0;
}

void print_person(const Person* p) {
    printf("Name: %s, Age: %d\n", p->name, p->age);
}`,
  "c++": `#include <iostream>
#include <vector>
#include <algorithm>
#include <memory>

class Animal {
public:
    virtual void makeSound() const = 0;
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void makeSound() const override {
        std::cout << "Woof!" << std::endl;
    }
};

class Cat : public Animal {
public:
    void makeSound() const override {
        std::cout << "Meow!" << std::endl;
    }
};

int main() {
    std::vector<std::unique_ptr<Animal>> animals;
    animals.push_back(std::make_unique<Dog>());
    animals.push_back(std::make_unique<Cat>());

    // Range-based for loop and polymorphism
    for (const auto& animal : animals) {
        animal->makeSound();
    }

    // Lambda expression and algorithm
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::for_each(numbers.begin(), numbers.end(), [](int n) {
        std::cout << n * n << " ";
    });
    std::cout << std::endl;

    return 0;
}`,
  r: `# Data manipulation with dplyr
library(dplyr)

# Create a sample dataset
data <- data.frame(
  name = c("Alice", "Bob", "Charlie", "David"),
  age = c(25, 30, 35, 28),
  score = c(85, 92, 78, 88)
)

# Using pipe operator and dplyr functions
result <- data %>%
  filter(age > 27) %>%
  mutate(grade = case_when(
    score >= 90 ~ "A",
    score >= 80 ~ "B",
    TRUE ~ "C"
  )) %>%
  arrange(desc(score))

print(result)

# Creating a function
calculate_average <- function(numbers) {
  if (length(numbers) == 0) {
    return(NA)
  }
  return(mean(numbers))
}

# Using the function
scores <- c(85, 92, 78, 88)
avg_score <- calculate_average(scores)
print(paste("Average score:", avg_score))

# Basic plotting
plot(data$age, data$score, 
     main="Age vs Score", 
     xlab="Age", 
     ylab="Score", 
     pch=19, 
     col="blue")

# Error handling
tryCatch(
  {
    result <- 10 / 0
    print(result)
  },
  error = function(e) {
    print(paste("An error occurred:", e$message))
  },
  warning = function(w) {
    print(paste("A warning occurred:", w$message))
  },
  finally = {
    print("This is always executed")
  }
)`,
  zig: `const std = @import("std");

const Item = struct {
    name: []const u8,
    quantity: u32,
    value: f32,
};

const Inventory = struct {
    items: std.StringHashMap(Item),
    allocator: std.mem.Allocator,

    fn init(allocator: std.mem.Allocator) Inventory {
        return .{
            .items = std.StringHashMap(Item).init(allocator),
            .allocator = allocator,
        };
    }

    fn deinit(self: *Inventory) void {
        var it = self.items.iterator();
        while (it.next()) |entry| {
            self.allocator.free(entry.key_ptr.*);
        }
        self.items.deinit();
    }

    fn addItem(self: *Inventory, name: []const u8, quantity: u32, value: f32) !void {
        const key = try self.allocator.dupe(u8, name);
        errdefer self.allocator.free(key);

        try self.items.put(key, Item{ .name = key, .quantity = quantity, .value = value });
    }

    fn removeItem(self: *Inventory, name: []const u8) bool {
        if (self.items.getKey(name)) |key| {
            _ = self.items.remove(key);
            self.allocator.free(key);
            return true;
        }
        return false;
    }

    fn printInventory(self: *const Inventory) void {
        var it = self.items.iterator();
        std.debug.print("Inventory:\n", .{});
        while (it.next()) |entry| {
            const item = entry.value_ptr.*;
            std.debug.print("  {s}: Quantity: {}, Value: {d:.2}\n", .{ item.name, item.quantity, item.value });
        }
    }
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var inventory = Inventory.init(allocator);
    defer inventory.deinit();

    try inventory.addItem("Sword", 1, 100.50);
    try inventory.addItem("Health Potion", 5, 25.75);
    try inventory.addItem("Gold Coin", 100, 1.00);

    inventory.printInventory();

    _ = inventory.removeItem("Health Potion");

    std.debug.print("\nAfter removing Health Potion:\n", .{});
    inventory.printInventory();
}
`,
  angular: `import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  template: \`
    <ul>
      <li *ngFor="let user of users$ | async">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  \`
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.users$ = this.http.get<User[]>('https://api.example.com/users').pipe(
      map(users => users.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }
}`,
  assembly: `section .data
    msg db 'Enter a number: ', 0
    fmt db '%d', 0
    result db 'Factorial: %d', 10, 0

section .text
    global main
    extern printf
    extern scanf

main:
    push rbp
    mov rbp, rsp

    ; Print prompt
    mov rdi, msg
    xor rax, rax
    call printf

    ; Read number
    sub rsp, 8
    lea rsi, [rsp]
    mov rdi, fmt
    xor rax, rax
    call scanf

    ; Calculate factorial
    mov rcx, [rsp]
    mov rax, 1
factorial_loop:
    mul rcx
    loop factorial_loop

    ; Print result
    mov rdi, result
    mov rsi, rax
    xor rax, rax
    call printf

    add rsp, 8
    xor rax, rax
    leave
    ret`,
  astro: `---
import Layout from '../layouts/Layout.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const sortedPosts = posts.sort((a, b) => b.data.pubDate - a.data.pubDate);
---

<Layout title="My Blog">
  <main>
    <h1>Recent Blog Posts</h1>
    <ul>
      {sortedPosts.map((post) => (
        <li>
          <a href={\`/blog/\${post.slug}\`}>
            <h2>{post.data.title}</h2>
            <p>{post.data.description}</p>
            <time datetime={post.data.pubDate.toISOString()}>
              {post.data.pubDate.toLocaleDateString()}
            </time>
          </a>
        </li>
      ))}
    </ul>
  </main>
</Layout>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin-bottom: 2rem;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  time {
    color: #666;
  }
</style>
`,
  bash: `#!/bin/bash

# Function to check if a number is prime
is_prime() {
    num=$1
    if [ $num -lt 2 ]; then
        return 1
    fi
    for ((i=2; i*i<=num; i++)); do
        if [ $((num % i)) -eq 0 ]; then
            return 1
        fi
    done
    return 0
}

# Main script
echo "Enter a range (two numbers separated by space):"
read start end

echo "Prime numbers between $start and $end are:"
for ((n=start; n<=end; n++)); do
    if is_prime $n; then
        echo -n "$n "
    fi
done
echo
`,
  latex: `\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}

\title{Introduction to Complex Numbers}
\author{John Doe}
\date{}

\begin{document}

\maketitle

\section{Definition}

A complex number is a number of the form $a + bi$, where $a$ and $b$ are real numbers, and $i$ is the imaginary unit defined as $i^2 = -1$.

\section{Properties}

Some important properties of complex numbers include:

\begin{enumerate}
    \item Addition: $(a + bi) + (c + di) = (a + c) + (b + d)i$
    \item Multiplication: $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$
    \item Conjugate: The conjugate of $a + bi$ is $a - bi$
\end{enumerate}

\section{Euler's Formula}

One of the most beautiful equations in mathematics involving complex numbers is Euler's formula:

\begin{equation}
    e^{ix} = \cos x + i \sin x
\end{equation}

\section{Visualization}

Complex numbers can be visualized on an Argand diagram:

\begin{figure}[h]
    \centering
    \includegraphics[width=0.6\textwidth]{complex_plane.png}
    \caption{Representation of a complex number on the complex plane}
    \label{fig:complex_plane}
\end{figure}

\end{document}
`,
  lua: `-- Define a class for a simple 2D vector
Vector = {}
Vector.__index = Vector

function Vector.new(x, y)
    return setmetatable({x = x or 0, y = y or 0}, Vector)
end

function Vector:magnitude()
    return math.sqrt(self.x^2 + self.y^2)
end

function Vector:normalize()
    local mag = self:magnitude()
    if mag > 0 then
        self.x = self.x / mag
        self.y = self.y / mag
    end
    return self
end

function Vector:__add(other)
    return Vector.new(self.x + other.x, self.y + other.y)
end

function Vector:__tostring()
    return string.format("Vector(%f, %f)", self.x, self.y)
end

-- Usage
local v1 = Vector.new(3, 4)
local v2 = Vector.new(1, 2)
local v3 = v1 + v2

print("v1:", v1)
print("v2:", v2)
print("v3:", v3)
print("v1 magnitude:", v1:magnitude())
print("v1 normalized:", v1:normalize())
`,
  markdown: `# Advanced Markdown Example

## Table of Contents
1. [Introduction](#introduction)
2. [Code Blocks](#code-blocks)
3. [Tables](#tables)
4. [Task Lists](#task-lists)
5. [Footnotes](#footnotes)

## Introduction

This document demonstrates some advanced Markdown features[^1].

## Code Blocks

Here's a Python function with syntax highlighting:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

## Tables

A simple table with alignment:

| Name  | Age
|-------|-----
| Alice | 25
| Bob   | 30
`,
  ocaml: `(* Define a binary tree type *)
type 'a tree =
  | Leaf
  | Node of 'a * 'a tree * 'a tree

(* Function to insert a value into a binary search tree *)
let rec insert value = function
  | Leaf -> Node (value, Leaf, Leaf)
  | Node (v, left, right) as node ->
      if value < v then Node (v, insert value left, right)
      else if value > v then Node (v, left, insert value right)
      else node

(* Function to perform an in-order traversal *)
let rec inorder = function
  | Leaf -> []
  | Node (v, left, right) -> inorder left @ [v] @ inorder right

(* Create a sample tree *)
let tree =
  List.fold_left (fun acc x -> insert x acc) Leaf [5; 3; 7; 1; 9; 4; 6]

(* Print the in-order traversal *)
let () =
  Printf.printf "In-order traversal: ";
  List.iter (Printf.printf "%d ") (inorder tree);
  print_newline ()
`,

  powershell: `# Function to get system information
function Get-SystemInfo {
    $computerSystem = Get-CimInstance CIM_ComputerSystem
    $operatingSystem = Get-CimInstance CIM_OperatingSystem
    $processor = Get-CimInstance CIM_Processor
    $logicalDisk = Get-CimInstance CIM_LogicalDisk | Where-Object {$_.DriveType -eq 3}

    [PSCustomObject]@{
        ComputerName = $computerSystem.Name
        Manufacturer = $computerSystem.Manufacturer
        Model = $computerSystem.Model
        OperatingSystem = $operatingSystem.Caption
        OSVersion = $operatingSystem.Version
        Processor = $processor.Name
        RAM = [math]::Round($computerSystem.TotalPhysicalMemory / 1GB, 2)
        DiskSpace = [math]::Round(($logicalDisk | Measure-Object -Property Size -Sum).Sum / 1GB, 2)
        FreeSpace = [math]::Round(($logicalDisk | Measure-Object -Property FreeSpace -Sum).Sum / 1GB, 2)
    }
}

# Get system info and export to CSV
$systemInfo = Get-SystemInfo
$systemInfo | Export-Csv -Path "SystemInfo.csv" -NoTypeInformation

# Display results
$systemInfo | Format-Table -AutoSize
Write-Host "System information exported to SystemInfo.csv"
`,
  scala: `import scala.concurrent.{Future, ExecutionContext}
import scala.util.{Success, Failure}

case class User(id: Int, name: String, email: String)

class UserService(implicit ec: ExecutionContext) {
  private var users = Vector(
    User(1, "Alice", "alice@example.com"),
    User(2, "Bob", "bob@example.com"),
    User(3, "Charlie", "charlie@example.com")
  )

  def getUser(id: Int): Future[Option[User]] = Future {
    users.find(_.id == id)
  }

  def addUser(user: User): Future[User] = Future {
    if (users.exists(_.id == user.id)) {
      throw new IllegalArgumentException(s"User with id \${user.id} already exists")
    }
    users = users :+ user
    user
  }

  def updateUser(user: User): Future[Option[User]] = Future {
    val index = users.indexWhere(_.id == user.id)
    if (index >= 0) {
      users = users.updated(index, user)
      Some(user)
    } else {
      None
    }
  }

  def deleteUser(id: Int): Future[Boolean] = Future {
    val initialSize = users.size
    users = users.filterNot(_.id == id)
    users.size < initialSize
  }
}

object Main extends App {
  implicit val ec: ExecutionContext = ExecutionContext.global
  val userService = new UserService()

  val newUser = User(4, "Dave", "dave@example.com")

  for {
    _ <- userService.addUser(newUser)
    user <- userService.getUser(4)
    _ <- userService.updateUser(user.get.copy(name = "David"))
    updatedUser <- userService.getUser(4)
    _ <- userService.deleteUser(4)
    deletedUser <- userService.getUser(4)
  } yield {
    println(s"Added user: $user")
    println(s"Updated user: $updatedUser")
    println(s"Deleted user exists: \${deletedUser.isDefined}")
  }
}
`,
  solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    mapping(address => uint256) private _stakes;
    mapping(address => uint256) private _lastStakeTimestamp;
    uint256 private _rewardRate = 1e15; // 0.001 tokens per second

    constructor() ERC20("Reward Token", "RWT") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _updateReward(msg.sender);
        _stakes[msg.sender] += amount;
        _transfer(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Cannot withdraw 0 tokens");
        require(_stakes[msg.sender] >= amount, "Insufficient staked amount");

        _updateReward(msg.sender);
        _stakes[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
    }

    function claimReward() external {
        _updateReward(msg.sender);
    }

    function _updateReward(address account) private {
        uint256 timeElapsed = block.timestamp - _lastStakeTimestamp[account];
        uint256 reward = (_stakes[account] * timeElapsed * _rewardRate) / 1e18;
        
        if (reward > 0) {
            _mint(account, reward);
        }
        
        _lastStakeTimestamp[account] = block.timestamp;
    }

    function setRewardRate(uint256 newRate) external onlyOwner {
        _rewardRate = newRate;
    }

    function stakedBalance(address account) external view returns (uint256) {
        return _stakes[account];
    }
}
`,
  svelte: `<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  let todos = [];
  let newTodo = '';
  let filter = 'all';

  onMount(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    todos = await res.json();
  });

  function addTodo() {
    if (newTodo.trim()) {
      todos = [...todos, { id: Date.now(), title: newTodo, completed: false }];
      newTodo = '';
    }
  }

  function toggleTodo(id) {
    todos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  function removeTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
  }

  $: filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
</script>

<main>
  <h1>Todo App</h1>
  
  <form on:submit|preventDefault={addTodo}>
    <input bind:value={newTodo} placeholder="Add a new todo">
    <button type="submit">Add</button>
  </form>

  <div>
    <button class:active={filter === 'all'} on:click={() => filter = 'all'}>All</button>
    <button class:active={filter === 'active'} on:click={() => filter = 'active'}>Active</button>
    <button class:active={filter === 'completed'} on:click={() => filter = 'completed'}>Completed</button>
  </div>

  <ul>
    {#each filteredTodos as todo (todo.id)}
      <li in:fly="{{ y: 20, duration: 300 }}" out:fade="{{ duration: 300 }}">
        <input type="checkbox" checked={todo.completed} on:change={() => toggleTodo(todo.id)}>
        <span class:completed={todo.completed}>{todo.title}</span>
        <button on:click={() => removeTodo(todo.id)}>Remove</button>
      </li>
    {:else}
      <li>No todos found</li>
    {/each}
  </ul>
</main>

<style>
  main {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }

  form {
    display: flex;
    margin-bottom: 20px;
  }

  input[type="text"] {
    flex-grow: 1;
    padding: 5px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .completed {
    text-decoration: line-through;
    color: #888;
  }

  button {
    margin-left: 10px;
  }

  button.active {
    background-color: #007bff;
    color: white;
  }
</style>
`,
  toml: `# This is a TOML document describing a web application configuration

title = "My Web Application"

[server]
host = "localhost"
port = 8080
debug = true

[database]
url = "postgresql://user:password@localhost/myapp"
max_connections = 100
timeout = 30

[redis]
host = "127.0.0.1"
port = 6379

[logging]
level = "info"
file = "/var/log/myapp.log"

[security]
enable_ssl = true
ssl_cert = "/etc/ssl/certs/myapp.crt"
ssl_key = "/etc/ssl/private/myapp.key"

[features]
enable_user_registration = true
enable_social_login = false

[rate_limiting]
enabled = true
requests_per_minute = 60

[caching]
strategy = "lru"
max_size = 1000
ttl = 3600  # in seconds

[[allowed_origins]]
url = "https://example.com"
methods = ["GET", "POST"]

[[allowed_origins]]
url = "https://api.example.com"
methods = ["GET", "POST", "PUT", "DELETE"]

[dependencies]
python = "^3.9"
django = "3.2.4"
celery = "5.1.2"
`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price currency="USD">11.99</price>
    <isbn>978-0743273565</isbn>
  </book>
  <book category="non-fiction">
    <title lang="en">A Brief History of Time</title>
    <author>Stephen Hawking</author>
    <year>1988</year>
    <price currency="USD">14.99</price>
    <isbn>978-0553380163</isbn>
  </book>
  <magazine>
    <title lang="en">National Geographic</title>
    <issue>
      <month>June</month>
      <year>2023</year>
    </issue>
    <price currency="USD">9.99</price>
  </magazine>
  <inventory>
    <book-count>2</book-count>
    <magazine-count>1</magazine-count>
  </inventory>
  <special-offers>
    <offer>
      <description>Buy 2 books, get 1 free</description>
      <valid-until>2023-12-31</valid-until>
    </offer>
    <offer>
      <description>10% off on all magazines</description>
      <valid-until>2023-08-31</valid-until>
    </offer>
  </special-offers>
</bookstore>
`,
};

export const CODE_SAMPLES_SMALL: Record<string, string> = {
  angular: `@Component({
  selector: 'app-root',
  template: '<h1>{{title}}</h1>'
})
export class AppComponent {
  title = 'Hello Angular!';
}`,

  assembly: `section .text
global _start
_start:
    mov eax, 4
    mov ebx, 1
    mov ecx, message
    int 0x80`,

  astro: `---
const greeting = "Hello, Astro!";
---
<html>
  <body>{greeting}</body>
</html>`,

  bash: `#!/bin/bash
echo "Hello, Bash!"
for i in {1..3}; do
    echo "Count: $i"
done`,

  c: `#include <stdio.h>
int main() {
    for (int i = 0; i < 5; i++) {
        printf("Hello, C!");
    }
    return 0;
}`,

  "c#": `using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello, C#!");
    }
}`,

  "c++": `#include <iostream>
int main() {
    for (int i = 0; i < 5; i++) {
        std::cout << "Hello, C++!" << std::endl;
    }
    return 0;
}`,

  css: `.button {
  background-color: #0077be;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}`,

  dart: `void main() {
  var greeting = 'Hello, Dart!';
  var name = 'Alice';
  print('\$greeting Welcome, \$name!');
  print('Greeting length: \${greeting.length}');
}`,

  go: `package main
import "fmt"

func main() {
    var message = "Hello, Go!"
    fmt.Printf("Sum: %d\\n", x+y)
}`,

  html: `<!DOCTYPE html>
<html>
<head><title>Hello HTML</title></head>
<body>
    <h1>Hello, HTML!</h1>
</body>
</html>`,

  java: `import java.util.List;

public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}`,

  javascript: `function greet(name) {
  console.log(greet("TypeScript"));
  return \`Hello, \${name}!\`;
}
const x: = 10;
const y = 20;`,

  json: `{
  "greeting": "Hello, JSON!",
  "numbers": [1, 2, 3],
  "nested": {
    "key": "value"
  }
}`,

  jsx: `import React from 'react';

function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default Greeting;`,

  kotlin: `import kotlin.random.Random

  fun main() {
    val greeting = "Hello, Kotlin!"
    val number = Random.nextInt(1, 10)
    println("Random number: $number")
}`,

  latex: `\\documentclass{article}
\\begin{document}
Hello, \\LaTeX!
Would you like to learn more about \\TeX?
We can also write equations like \$E=mc^2\$.
\\end{document}`,

  lua: `local function greet(name)
  local age = 30
  print("Your age is: " .. age)
  print("Hello, " .. name .. "!")
end

greet("Lua")`,

  markdown: `# Hello, Markdown!
## Welcome to the world of Markdown.

This is a **bold** and *italic* text.
- Item 1
- Item 2
- Item 3`,

  ocaml: `let square x = x * x
let sum_of_squares a b = square a + square b
let result = sum_of_squares 3 4

let () = Printf.printf "Sum of squares: %d\\n" result
`,

  php: `<?php
$fruits = ["apple", "banana", "cherry"];
$fruits[] = "date";
foreach ($fruits as $index => $fruit) {
    echo "Fruit $index: $fruit<br>";
}
?>
`,

  python: `import random
names = ["Alice", "Bob", "Charlie", "David", "Eve"]
def greet(name): return f"Hello, {name}!"

random_names = random.sample(names, 3)
print("\\n".join(greet(name) for name in random_names))`,

  r: `fruits <- c("apple", "banana", "cherry", "date")
capitalize <- function(x) paste0(toupper(substr(x, 1, 1)))
fruit_info <- sapply(fruits, function(f) paste(capitalize(f))

names(fruit_info) <- fruits
print(fruit_info)`,

  ruby: `def factorial(n)
  (1..n).reduce(:*) || 1
end

(1..5).each do |i|
  puts "Factorial of #{i} is #{factorial(i)}"
end`,

  rust: `fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}`,

  scala: `def isPrime(n: Int): Boolean = 
  (2 to math.sqrt(n).toInt).forall(n % _ != 0)

val primes = (2 to 50).filter(isPrime)
println(s"Primes up to 50: \${primes.mkString(", ")}")
println(s"Number of primes: \${primes.length}")`,

  solidity: `pragma solidity ^0.8.0;
contract Greeter {
    string public greeting = "Hello, Solidity!";
    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}`,

  sql: `SELECT 'Hello, SQL!' AS greeting;

CREATE TABLE greetings (
  id INT PRIMARY KEY,
  message VARCHAR(50)
);`,

  svelte: `<script>
  let name = 'Svelte';
</script>

<h1>Hello, {name}!</h1>
<input bind:value={name}>`,

  swift: `import Swift

let names = ["Swift", "iOS", "macOS"]
for name in names {
    print("Hello, \\(name)!")
    print("Name length: \\(name.count)")
}`,

  toml: `title = "TOML Example"
[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00-08:00`,

  tsx: `import React from 'react';
interface GreetingProps { name: string; }
const Greeting: React.FC<GreetingProps> = ({ name }) => (
  <h1>Hello, {name}!</h1>
);
export default Greeting;`,

  typescript: `function greet(name: string): string {
  console.log(greet("TypeScript"));
  return \`Hello, \${name}!\`;
}
const x: number = 10;
const y: number = 20;`,

  vue: `<script setup>
import { ref } from 'vue'
const greeting = ref('Hello, Vue!')
</script>
<template>
  <h1>{{ greeting }}</h1>
</template>`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<greeting>
  <message>Hello, XML!</message>
  <message>XML is fun!</message>
  <message>Have a great day!</message>
</greeting>`,

  zig: `const std = @import("std");

pub fn main() !void {
    const message = "Hello, Zig!";
    std.debug.print("Message: {}\\n", .{message});
    return Ok;
}`,
};

export const BACKGROUND_LESS_PALETTE = {
  dark: {
    text: "#EDEDED",
    "text-2": "#A3A3A3",
    "text-3": "#8F8F8F",
    interface: "#171717",
    "interface-2": "#212121",
    "interface-3": "#2B2B2B",
    background: "#000000",
    "background-2": "#0D0D0D",
  },
  light: {
    text: "#1D2127",
    "text-2": "#808080",
    "text-3": "#b3b3b3",
    interface: "#e6e6e6",
    "interface-2": "#d9d9d9",
    "interface-3": "#cccccc",
    background: "#FFFFFF",
    "background-2": "#f2f2f2",
  },
};

export const PRESETS: Record<string, DarkLightPalette> = {
  "One Hunter": {
    dark: {
      text: "#E3E1E1",
      interface: "#35373A",
      "text-2": "#A3A3A3",
      "interface-2": "#3E4043",
      "text-3": "#8F8F8F",
      "interface-3": "#47494D",
      background: "#1D2127",
      accent: "#50C2F7",
      "background-2": "#2C2E31",
      "accent-2": "#66DFC4",
      primary: "#F06293",
      "accent-3": "#F7BC62",
      secondary: "#E3E1E2",
    },
    light: {
      text: "#1D2127",
      interface: "#dedede",
      "text-2": "#808080",
      "interface-2": "#d1d1d1",
      "text-3": "#b3b3b3",
      "interface-3": "#c4c4c4",
      background: "#F7F7F7",
      accent: "#0483c5",
      "background-2": "#ebebeb",
      "accent-2": "#178a78",
      primary: "#bb1b3f",
      "accent-3": "#e26d14",
      secondary: "#1D2128",
    },
  },
  Flexoki: {
    dark: {
      text: "#CECDC3",
      "text-2": "#87857F",
      "text-3": "#575653",
      interface: "#282726",
      "interface-2": "#343331",
      "interface-3": "#403E3C",
      background: "#100F0F",
      "background-2": "#1C1B1A",
      primary: "#889A39",
      secondary: "#CE5D97",
      accent: "#DA702C",
      "accent-2": "#39A99F",
      "accent-3": "#4485BE",
    },
    light: {
      text: "#100F0F",
      "text-2": "#6F6E68",
      "text-3": "#B7B5AC",
      interface: "#E6E4D9",
      "interface-2": "#DAD8CE",
      "interface-3": "#CECDC3",
      background: "#FEFCF0",
      "background-2": "#F2F0E5",
      primary: "#66800C",
      secondary: "#A02F6F",
      accent: "#BC5214",
      "accent-2": "#24837B",
      "accent-3": "#205EA6",
    },
  },
  Vercel: {
    dark: {
      text: "#EDEDED",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#171717",
      "interface-2": "#212121",
      "interface-3": "#2B2B2B",
      background: "#000000",
      "background-2": "#0D0D0D",
      primary: "#FF4C8D",
      secondary: "#47A8FF",
      accent: "#C372FC",
      "accent-2": "#00CA51",
      "accent-3": "#EDEDED",
    },
    light: {
      text: "#1D2127",
      "text-2": "#808080",
      "text-3": "#b3b3b3",
      interface: "#e6e6e6",
      "interface-2": "#d9d9d9",
      "interface-3": "#cccccc",
      background: "#FFFFFF",
      "background-2": "#f2f2f2",
      primary: "#C31562",
      secondary: "#0060F1",
      accent: "#7D00CC",
      "accent-2": "#0F7E32",
      "accent-3": "#000000",
    },
  },
  Supabase: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#262c29",
      "interface-2": "#343c38",
      "interface-3": "#4e5651",
      background: "#171717",
      "background-2": "#212121",
      primary: "#A0A0A0",
      secondary: "#3ECF8E",
      accent: "#3ECF8E",
      "accent-2": "#3ECF8E",
      "accent-3": "#EDEDED",
    },
    light: {
      text: "#171717",
      "text-2": "#595959",
      "text-3": "#8c8c8c",
      interface: "#e6e6e6",
      "interface-2": "#d9d9d9",
      "interface-3": "#cccccc",
      background: "#FFFFFF",
      "background-2": "#f2f2f2",
      primary: "#A0A0A0",
      secondary: "#019A55",
      accent: "#019A55",
      "accent-2": "#019A55",
      "accent-3": "#171717",
    },
  },
  Tailwind: {
    dark: {
      text: "#F9FAFB",
      "text-2": "#98aecd",
      "text-3": "#6486b4",
      interface: "#293e5b",
      "interface-2": "#32496c",
      "interface-3": "#38537a",
      background: "#1B293D",
      "background-2": "#21324a",
      primary: "#F471B5",
      secondary: "#98F6E4",
      accent: "#D1D5DB",
      "accent-2": "#7DD3FC",
      "accent-3": "#FDE68A",
    },
    light: {
      text: "#F9FAFB",
      "text-2": "#98aecd",
      "text-3": "#6486b4",
      interface: "#293e5b",
      "interface-2": "#32496c",
      "interface-3": "#38537a",
      background: "#1B293D",
      "background-2": "#21324a",
      primary: "#F471B5",
      secondary: "#98F6E4",
      accent: "#D1D5DB",
      "accent-2": "#7DD3FC",
      "accent-3": "#FDE68A",
    },
  },
  Bitmap: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#3c2020",
      "interface-2": "#512f2f",
      "interface-3": "#6f4444",
      background: "#190707",
      "background-2": "#280b0b",
      primary: "#EB6F6F",
      secondary: "#E42C37",
      accent: "#E42C37",
      "accent-2": "#EBB99D",
      "accent-3": "#E42C37",
    },
    light: {
      text: "#685B5B",
      "text-2": "#948484",
      "text-3": "#b8adad",
      interface: "#e0d2d2",
      "interface-2": "#d5c3c3",
      "interface-3": "#cab4b4",
      background: "#fff5f7",
      "background-2": "#ffebef",
      primary: "#D63937",
      secondary: "#C90028",
      accent: "#C90028",
      "accent-2": "#836250",
      "accent-3": "#D15510",
    },
  },
  Noir: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#2b2b2b",
      "interface-2": "#363636",
      "interface-3": "#454545",
      background: "#181818",
      "background-2": "#1f1f1f",
      primary: "#A7A7A7",
      secondary: "#A7A7A7",
      accent: "#FFFFFF",
      "accent-2": "#A7A7A7",
      "accent-3": "#FFFFFF",
    },
    light: {
      text: "#111111",
      "text-2": "#666666",
      "text-3": "#999999",
      interface: "#dedede",
      "interface-2": "#d1d1d1",
      "interface-3": "#c4c4c4",
      background: "#F7F7F7",
      "background-2": "#ebebeb",
      primary: "#666",
      secondary: "#666",
      accent: "#111111",
      "accent-2": "#666",
      "accent-3": "#111111",
    },
  },
  Ice: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#30353b",
      "interface-2": "#394047",
      "interface-3": "#515a61",
      background: "#1F2427",
      "background-2": "#272c30",
      primary: "#BFC4C8",
      secondary: "#92DEF6",
      accent: "#778CB7",
      "accent-2": "#89C3DC",
      "accent-3": "#00B0E9",
    },
    light: {
      text: "#1C1B29",
      "text-2": "#25778e",
      "text-3": "#49b3d0",
      interface: "#d6f7ff",
      "interface-2": "#c2f3ff",
      "interface-3": "#9ed7e6",
      background: "#fafeff",
      "background-2": "#ebfbff",
      primary: "#81909D",
      secondary: "#00B0E9",
      accent: "#1E3C78",
      "accent-2": "#7CBCD8",
      "accent-3": "#00B0E9",
    },
  },
  Sand: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#484037",
      "interface-2": "#584f46",
      "interface-3": "#66594d",
      background: "#2E2820",
      "background-2": "#393228",
      primary: "#D3B48C",
      secondary: "#C2B181",
      accent: "#F4A461",
      "accent-2": "#EED5B8",
      "accent-3": "#C2B181",
    },
    light: {
      text: "#262217",
      "text-2": "#706443",
      "text-3": "#a99a70",
      interface: "#e5d3bd",
      "interface-2": "#dec8ab",
      "interface-3": "#d7bc98",
      background: "#F3EAE0",
      "background-2": "#ecdfcf",
      primary: "#906937",
      secondary: "#A28C4E",
      accent: "#DA8744",
      "accent-2": "#C57416",
      "accent-3": "#A28C4E",
    },
  },
  Forest: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#2b312b",
      "interface-2": "#3c443d",
      "interface-3": "#4b534d",
      background: "#141815",
      "background-2": "#1e2420",
      primary: "#AAB4A2",
      secondary: "#6A8F71",
      accent: "#86B882",
      "accent-2": "#CBBE6D",
      "accent-3": "#AAB4A2",
    },
    light: {
      text: "#262217",
      "text-2": "#668f56",
      "text-3": "#aac69f",
      interface: "#e2ecdf",
      "interface-2": "#d7e4d2",
      "interface-3": "#ccddc5",
      background: "#f9fbf8",
      "background-2": "#eef4ec",
      primary: "#6A8458",
      secondary: "#6A8F71",
      accent: "#4A8042",
      "accent-2": "#9D891C",
      "accent-3": "#78876E",
    },
  },
  Breeze: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#3a2442",
      "interface-2": "#472f4c",
      "interface-3": "#5f4365",
      background: "#1e0d21",
      "background-2": "#2b132f",
      primary: "#6699FF",
      secondary: "#49E8F2",
      accent: "#F8528D",
      "accent-2": "#E9AEFE",
      "accent-3": "#55E7B1",
    },
    light: {
      text: "#1D2127",
      "text-2": "#bd3d74",
      "text-3": "#d77ea5",
      interface: "#ffe0ed",
      "interface-2": "#ffd1e4",
      "interface-3": "#ffbdd8",
      background: "#fffafc",
      "background-2": "#fff0f6",
      primary: "#4D6FB2",
      secondary: "#2C797B",
      accent: "#BE4578",
      "accent-2": "#666DA6",
      "accent-3": "#426B65",
    },
  },
  Candy: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#443856",
      "interface-2": "#4f4266",
      "interface-3": "#66597d",
      background: "#2B2536",
      "background-2": "#352d43",
      primary: "#FF659C",
      secondary: "#1CC8FF",
      accent: "#73DFA5",
      "accent-2": "#DFD473",
      "accent-3": "#7A7FFD",
    },
    light: {
      text: "#1D2127",
      "text-2": "#808080",
      "text-3": "#b3b3b3",
      interface: "#dedede",
      "interface-2": "#d1d1d1",
      "interface-3": "#c4c4c4",
      background: "#F7F7F7",
      "background-2": "#ebebeb",
      primary: "#DC145E",
      secondary: "#2386A6",
      accent: "#009032",
      "accent-2": "#B2762E",
      "accent-3": "#676DFF",
    },
  },
  Crimson: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#362626",
      "interface-2": "#533c3d",
      "interface-3": "#7e6363",
      background: "#211111",
      "background-2": "#2f1818",
      primary: "#EB6F6F",
      secondary: "#D15510",
      accent: "#C88E8E",
      "accent-2": "#EBB99D",
      "accent-3": "#FDA97A",
    },
    light: {
      text: "#685B5B",
      "text-2": "#a88b8a",
      "text-3": "#b79f9f",
      interface: "#e9dddd",
      "interface-2": "#d9cece",
      "interface-3": "#cec0c0",
      background: "#faf4f4",
      "background-2": "#f5eaea",
      primary: "#BD3B3B",
      secondary: "#C94F0A",
      accent: "#9E7070",
      "accent-2": "#836250",
      "accent-3": "#C94F0A",
    },
  },
  Falcon: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#272525",
      "interface-2": "#2c2a2a",
      "interface-3": "#454545",
      background: "#121212",
      "background-2": "1c1c1c",
      primary: "#99B6B2",
      secondary: "#799DB1",
      accent: "#6D88BB",
      "accent-2": "#789083",
      "accent-3": "#BD9C9C",
    },
    light: {
      text: "#464C65",
      "text-2": "#637b9c",
      "text-3": "#a2b0c3",
      interface: "#e0e4eb",
      "interface-2": "#d0d7e1",
      "interface-3": "#c4cdd9",
      background: "#f6f7f9",
      "background-2": "#edeff3",
      primary: "#464C65",
      secondary: "#839AA7",
      accent: "#6A7C9F",
      "accent-2": "#47615D",
      "accent-3": "#AF6A65",
    },
  },
  Meadow: {
    dark: {
      text: "#EDEDED",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#2a2b27",
      "interface-2": "#464b3a",
      "interface-3": "#6d725f",
      background: "#11130b",
      "background-2": "#1a1e10",
      primary: "#6DD79F",
      secondary: "#E4B164",
      accent: "#B3D767",
      "accent-2": "#E9EB9D",
      "accent-3": "#45B114",
    },
    light: {
      text: "#1D2127",
      "text-2": "#8caa55",
      "text-3": "#bacc99",
      interface: "#e3ead7",
      "interface-2": "#d7e1c6",
      "interface-3": "#cfdbb8",
      background: "#f7faf5",
      "background-2": "#ecf1e4",
      primary: "#009649",
      secondary: "#B6781B",
      accent: "#798B53",
      "accent-2": "#837E51",
      "accent-3": "#2D8801",
    },
  },
  Midnight: {
    dark: {
      text: "#FFFFFF",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#283234",
      "interface-2": "#364245",
      "interface-3": "#526366",
      background: "#121E20",
      "background-2": "#18282a",
      primary: "#7DA9AB",
      secondary: "#9681C2",
      accent: "#52D0F8",
      "accent-2": "#6D86A4",
      "accent-3": "#75D2B1",
    },
    light: {
      text: "#434447",
      "text-2": "#63859c",
      "text-3": "#a2b6c3",
      interface: "#dde4e9",
      "interface-2": "#ced8df",
      "interface-3": "#c1ced7",
      background: "#f6f8f9",
      "background-2": "#eaeef1",
      primary: "#587678",
      secondary: "#766599",
      accent: "#2F788F",
      "accent-2": "#5F758F",
      "accent-3": "#9EC2B9",
    },
  },
  Raindrop: {
    dark: {
      text: "#EDEDED",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#232934",
      "interface-2": "#363f4f",
      "interface-3": "#5b6576",
      background: "#070f1D",
      "background-2": "#0b172d",
      primary: "#2FD9FF",
      secondary: "#008BB7",
      accent: "#19D6B5",
      "accent-2": "#9CD8EB",
      "accent-3": "#9984EE",
    },
    light: {
      text: "#1D2127",
      "text-2": "#4868ad",
      "text-3": "#90abe4",
      interface: "#d6e0f5",
      "interface-2": "#c6d3f1",
      "interface-3": "#b5c7ed",
      background: "#f7f9fd",
      "background-2": "#e7edf9",
      primary: "#008DAC",
      secondary: "#027BA1",
      accent: "#4F9488",
      "accent-2": "#507683",
      "accent-3": "#7459E1",
    },
  },
  Sunset: {
    dark: {
      text: "#EDEDED",
      "text-2": "#A3A3A3",
      "text-3": "#8F8F8F",
      interface: "#2c2721",
      "interface-2": "#4a4036",
      "interface-3": "#7c6b5a",
      background: "#231c15",
      "background-2": "#2d241b",
      primary: "#FFAF64",
      secondary: "#E978A1",
      accent: "#E2D66B",
      "accent-2": "#F9D38C",
      "accent-3": "#E7CF55",
    },
    light: {
      text: "#737568",
      "text-2": "#a47141",
      "text-3": "#e5ac76",
      interface: "#ffe5cc",
      "interface-2": "#edd7c4",
      "interface-3": "#e7cab1",
      background: "#fff7f0",
      "background-2": "#ffefe0",
      primary: "#A1642C",
      secondary: "#AD5A78",
      accent: "#807411",
      "accent-2": "#8D703C",
      "accent-3": "#846F00",
    },
  },
};

export const FEATURED_THEME_LOGOS = {
  "One Hunter": (
    <img
      className="size-5 border rounded-full"
      src="one-hunter-logo.png"
      alt="One Hunter Logo"
    />
  ),
  Flexoki: (
    <img
      className="size-5 border rounded-full"
      src="flexoki-logo.png"
      alt="Flexoki Logo"
    />
  ),
  Vercel: <IconVercel className="mx-0.5" />,
  Supabase: <IconSupabase className="mx-0.5" />,
  Tailwind: <IconTailwind className="mx-0.5" />,
};

const PRESET_KEYS = Object.keys(PRESETS) as Array<keyof typeof PRESETS>;

export const FEATURED_THEMES = PRESET_KEYS.slice(0, 5) as Array<
  keyof typeof FEATURED_THEME_LOGOS
>;
export const RAY_SO_THEMES = PRESET_KEYS.slice(5);
