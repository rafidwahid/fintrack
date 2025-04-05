# Makefile for Fintrack Dashboard

# Variables
NODE_ENV ?= development
PORT ?= 3001
API_URL ?= http://localhost:3000

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install     - Install dependencies"
	@echo "  make dev        - Start development server"
	@echo "  make build      - Build for production"
	@echo "  make start      - Start production server"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make lint       - Run ESLint"
	@echo "  make format     - Format code with Prettier"
	@echo "  make analyze    - Analyze bundle size"
	@echo "  make test       - Run tests"
	@echo "  make test-watch - Run tests in watch mode"
	@echo "  make type-check - Run TypeScript type checking"

# Install dependencies
.PHONY: install
install:
	yarn install

# Start development server
.PHONY: dev
dev:
	yarn dev

# Build for production
.PHONY: build
build:
	yarn build

# Start production server
.PHONY: start
start:
	yarn start

# Clean build artifacts
.PHONY: clean
clean:
	rm -rf .next
	rm -rf node_modules
	rm -rf dist

# Run ESLint
.PHONY: lint
lint:
	yarn lint

# Format code with Prettier
.PHONY: format
format:
	yarn format

# Analyze bundle size
.PHONY: analyze
analyze:
	ANALYZE=true yarn build

# Run tests
.PHONY: test
test:
	yarn test

# Run tests in watch mode
.PHONY: test-watch
test-watch:
	yarn test:watch

# Run TypeScript type checking
.PHONY: type-check
type-check:
	yarn type-check

# Docker commands
.PHONY: docker-build
docker-build:
	docker build -t fintrack-dashboard .

.PHONY: docker-run
docker-run:
	docker run -p $(PORT):3001 fintrack-dashboard

.PHONY: docker-compose-up
docker-compose-up:
	docker-compose up -d

.PHONY: docker-compose-down
docker-compose-down:
	docker-compose down

# Development utilities
.PHONY: check-deps
check-deps:
	yarn check-deps

.PHONY: update-deps
update-deps:
	yarn upgrade-interactive --latest

# Environment setup
.PHONY: setup-env
setup-env:
	@echo "Setting up environment variables..."
	@echo "NODE_ENV=$(NODE_ENV)" > .env
	@echo "PORT=$(PORT)" >> .env
	@echo "API_URL=$(API_URL)" >> .env
	@echo "Environment setup complete!"

# Combined commands
.PHONY: setup
setup: install setup-env

.PHONY: reset
reset: clean install

.PHONY: full-build
full-build: clean install build 