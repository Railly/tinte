import type { CodeTemplate } from "@tinte/core";

export const codeTemplates: CodeTemplate[] = [
  {
    name: "Python",
    filename: "user_service.py",
    language: "python",
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
        return user`,
  },
  {
    name: "Go",
    filename: "main.go",
    language: "go",
    code: `package main

import (
\t"encoding/json"
\t"fmt"
\t"log"
\t"net/http"
)

type User struct {
\tID       int    \`json:"id"\`
\tName     string \`json:"name"\`
\tEmail    string \`json:"email"\`
\tIsActive bool   \`json:"is_active"\`
}

type UserService struct {
\tusers map[int]*User
}

func NewUserService() *UserService {
\treturn &UserService{
\t\tusers: make(map[int]*User),
\t}
}

func (s *UserService) CreateUser(name, email string) *User {
\tuser := &User{
\t\tID:       len(s.users) + 1,
\t\tName:     name,
\t\tEmail:    email,
\t\tIsActive: true,
\t}
\ts.users[user.ID] = user
\treturn user
}

func main() {
\tservice := NewUserService()
\tuser := service.CreateUser("John Doe", "john@example.com")
\tfmt.Printf("Created user: %+v\\\\n", user)
}`,
  },
  {
    name: "JavaScript",
    filename: "main.js",
    language: "javascript",
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
console.log('User deleted:', deleted);`,
  },
];
