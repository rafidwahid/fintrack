# Makefile for Docker Compose management

# Variables
COMPOSE = docker-compose
SERVICE = app  # Replace with your main service name if different

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make up        - Start all services in background"
	@echo "  make down      - Stop and remove all services"
	@echo "  make build     - Build or rebuild services"
	@echo "  make logs      - View logs for all services"
	@echo "  make redis-cli - Connect to Redis CLI"
	@echo "  make restart   - Restart all services"
	@echo "  make clean     - Remove all containers, networks, and volumes"

# Start services
.PHONY: up
up:
	$(COMPOSE) up -d

# Stop and remove services
.PHONY: down
down:
	$(COMPOSE) down

# Build or rebuild services
.PHONY: build
build:
	$(COMPOSE) build

# View logs
.PHONY: logs
logs:
	$(COMPOSE) logs -f

# Connect to Redis CLI
.PHONY: redis-cli
redis-cli:
	docker exec -it redis-session redis-cli -a card_user_password

# Restart services
.PHONY: restart
restart:
	$(COMPOSE) restart

# Clean up everything
.PHONY: clean
clean:
	$(COMPOSE) down -v --rmi all --remove-orphans

dev:
	yarn start:dev