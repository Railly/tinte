import { VSCodeTheme } from '@/lib/providers/vscode';
import { providerRegistry } from '@/lib/providers';
import { shadcnToTinte } from '@/lib/shadcn-to-tinte';

export interface CodeTemplate {
  name: string;
  filename: string;
  language: string;
  code: string;
}

export const codeTemplates: CodeTemplate[] = [
  {
    name: 'Python',
    filename: 'user_service.py',
    language: 'python',
    code: `from typing import Optional, List
import asyncio
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
    is_active: bool = True

class UserService:
    def __init__(self, database_url: str):
        self.db_url = database_url
        self.users: List[User] = []
    
    async def get_user(self, user_id: int) -> Optional[User]:
        """Fetch a user by ID"""
        for user in self.users:
            if user.id == user_id:
                return user
        return None
    
    def create_user(self, name: str, email: str) -> User:
        user = User(
            id=len(self.users) + 1,
            name=name,
            email=email
        )
        self.users.append(user)
        return user`
  },
  {
    name: 'Rust',
    filename: 'main.rs',
    language: 'rust',
    code: `use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: u64,
    name: String,
    email: String,
    is_active: bool,
}

impl User {
    fn new(id: u64, name: String, email: String) -> Self {
        Self {
            id,
            name,
            email,
            is_active: true,
        }
    }
    
    fn deactivate(&mut self) {
        self.is_active = false;
    }
}

fn main() {
    let mut users: HashMap<u64, User> = HashMap::new();
    
    let user = User::new(1, "Alice".to_string(), "alice@example.com".to_string());
    users.insert(user.id, user);
    
    println!("Created {} users", users.len());
}`
  },
  {
    name: 'Go',
    filename: 'main.go',
    language: 'go',
    code: `package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type User struct {
	ID       int    \`json:"id"\`
	Name     string \`json:"name"\`
	Email    string \`json:"email"\`
	IsActive bool   \`json:"is_active"\`
}

type UserService struct {
	users map[int]*User
}

func NewUserService() *UserService {
	return &UserService{
		users: make(map[int]*User),
	}
}

func (s *UserService) CreateUser(name, email string) *User {
	user := &User{
		ID:       len(s.users) + 1,
		Name:     name,
		Email:    email,
		IsActive: true,
	}
	s.users[user.ID] = user
	return user
}

func main() {
	service := NewUserService()
	user := service.CreateUser("John Doe", "john@example.com")
	fmt.Printf("Created user: %+v\\n", user)
}`
  },
  {
    name: 'JavaScript',
    filename: 'main.js',
    language: 'javascript',
    code: `class User {
  constructor(name, email) {
    this.id = Math.floor(Math.random() * 1000);
    this.name = name;
    this.email = email;
    this.isActive = true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name, 
      email: this.email,
      isActive: this.isActive
    };
  }
}

class UserService {
  constructor() {
    this.users = new Map();
  }

  createUser(name, email) {
    const user = new User(name, email);
    this.users.set(user.id, user);
    return user;
  }

  getUser(id) {
    return this.users.get(id);
  }

  updateUser(id, updates) {
    const user = this.getUser(id);
    if (!user) return null;
    
    Object.assign(user, updates);
    return user;
  }

  deleteUser(id) {
    return this.users.delete(id);
  }
}

// Example usage
const userService = new UserService();

const user = userService.createUser('John Doe', 'john@example.com');
console.log('Created user:', user.toJSON());

const updated = userService.updateUser(user.id, { name: 'Jane Doe' });
console.log('Updated user:', updated.toJSON());

const deleted = userService.deleteUser(user.id);
console.log('User deleted:', deleted);`
  }
];

export function convertThemeToVSCode(activeTheme: any, fallbackTheme: { light: VSCodeTheme; dark: VSCodeTheme }) {
  if (!activeTheme?.rawTheme) return fallbackTheme;

  try {
    const themeData = activeTheme;

    if (themeData.author === "tweakcn" && themeData.rawTheme) {
      // TweakCN themes: ShadCN → Tinte → VSCode
      const shadcnTheme = {
        light: themeData.rawTheme.light || themeData.rawTheme,
        dark: themeData.rawTheme.dark || themeData.rawTheme
      };
      const tinteTheme = shadcnToTinte(shadcnTheme);
      const vscodeTheme = providerRegistry.convert('vscode', tinteTheme) as { dark: VSCodeTheme; light: VSCodeTheme };
      return vscodeTheme || fallbackTheme;
    } else {
      // Direct Tinte themes: Tinte → VSCode
      const tinteTheme = themeData.rawTheme;
      const vscodeTheme = providerRegistry.convert('vscode', tinteTheme) as { dark: VSCodeTheme; light: VSCodeTheme };
      return vscodeTheme || fallbackTheme;
    }
  } catch (error) {
    console.warn('Failed to convert theme:', error);
    return fallbackTheme;
  }
}