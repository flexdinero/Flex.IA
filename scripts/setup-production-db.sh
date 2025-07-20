#!/bin/bash

# Production Database Setup Script for Flex.IA
# This script sets up PostgreSQL database for production deployment

set -e

echo "🚀 Setting up production database for Flex.IA..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is required"
    echo "Example: postgresql://username:password@localhost:5432/flexia_production"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ ERROR: JWT_SECRET environment variable is required"
    echo "Generate a secure secret: openssl rand -base64 32"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client for PostgreSQL
echo "🔧 Generating Prisma client..."
npx prisma generate --schema=prisma/schema.production.prisma

# Create database if it doesn't exist (for local development)
if [[ $DATABASE_URL == *"localhost"* ]] || [[ $DATABASE_URL == *"127.0.0.1"* ]]; then
    echo "🏠 Local database detected, ensuring database exists..."
    
    # Extract database name from URL
    DB_NAME=$(echo $DATABASE_URL | sed 's/.*\///')
    DB_URL_WITHOUT_NAME=$(echo $DATABASE_URL | sed 's/\/[^\/]*$//')
    
    # Try to create database (will fail silently if exists)
    psql "$DB_URL_WITHOUT_NAME/postgres" -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true
fi

# Run database migrations
echo "🗃️  Running database migrations..."
npx prisma migrate deploy --schema=prisma/schema.production.prisma

# Seed the database with initial data
echo "🌱 Seeding database with initial data..."
npx prisma db seed

# Create database indexes for performance
echo "⚡ Creating performance indexes..."
npx prisma db execute --file=scripts/create-indexes.sql --schema=prisma/schema.production.prisma

# Verify database setup
echo "🔍 Verifying database setup..."
npx prisma db pull --schema=prisma/schema.production.prisma --print

echo "✅ Production database setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your application to use the production schema"
echo "2. Deploy your application with the new DATABASE_URL"
echo "3. Run health checks to verify everything is working"
echo "4. Monitor database performance and optimize as needed"
echo ""
echo "🔗 Useful commands:"
echo "  - View database: npx prisma studio --schema=prisma/schema.production.prisma"
echo "  - Reset database: npx prisma migrate reset --schema=prisma/schema.production.prisma"
echo "  - Generate client: npx prisma generate --schema=prisma/schema.production.prisma"
