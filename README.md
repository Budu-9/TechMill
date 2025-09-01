# TechMill

A RESTful API built with Express.js and MySQL that provides user and product management functionality with role-based access control, authentication, and product approval workflows.

Project Overview
This project implements a user and product management system with the following core objectives:

Primary Objectives:
User Management System: Secure user registration, authentication, and role-based access control
Product Management System: Full CRUD operations for products with approval workflows
Security Implementation: JWT-based authentication with proper authorization mechanisms
Data Validation: Comprehensive input validation and sanitization
Admin Controls: Administrative functions for user management and product approval
Design Pattern that implements Separation of Concerns i.e distinct layers each responsible for a single, well-defined aspect of the application's functionality (Controllers, Services, Routes, Middleware, etc.)

Business Requirements
Users can register with minimal information (name, email, password)
Role-based access control with User and Admin roles
Admin capabilities to ban/unban users and manage all products
Product approval system where admin approval is required for public visibility
Secure authentication preventing banned users from system access
Users can only manage their own products
Public access to approved products without authentication

Prerequisites
Before setting up the project, ensure you have the following installed:
Required Software
Node.js (v18.0.0 or higher) 
npm (v9.0.0 or higher) 
MySQL (v8.0 or higher)

Verification command:
# Verify Node.js installation
node --version
# Verify npm installation
npm --version
# Verify MySQL installation
mysql --version

Local Development Setup
# Create new project directory
mkdir TechMill
cd TechMill
# Clone the repository
git clone <repo-url>

Initialize the Project
# Initialize npm project (if creating new)
npm init -y

# Install dependencies
npm install express mysql2 bcryptjs jsonwebtoken dotenv express-validator

# Run locally
run start
