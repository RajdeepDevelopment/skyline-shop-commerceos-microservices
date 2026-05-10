#!/bin/bash
set -e

# Default values
CLEAN_VOLUMES=false

# Parse flags
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -v|--volumes) CLEAN_VOLUMES=true ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

echo "=========================================================="
echo "🚀 Setting up eCommerce Microservices Platform..."
echo "=========================================================="

if [ -f .setup_complete ] && [ "$CLEAN_VOLUMES" = false ]; then
    echo "⚠️ Setup has already been completed."
    read -p "Do you want to re-run the setup anyway? (y/n) " rerun
    if [ "$rerun" != "y" ]; then
        echo "Exiting setup."
        exit 0
    fi
fi

# 1. Check dependencies
echo "📦 Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker could not be found. Please install Docker."
    exit 1
fi
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm could not be found. Please install pnpm (npm install -g pnpm)."
    exit 1
fi

# 2. Environment Variables
echo "🔧 Configuring environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "⏭️ .env file already exists, skipping."
fi

# Load environment variables for the current session
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# 3. Volume Management
if [ "$CLEAN_VOLUMES" = true ]; then
    echo "🧹 Cleaning up existing Docker volumes..."
    docker-compose down -v
    echo "✅ Volumes cleaned."
fi

# 4. Install Dependencies
echo "📦 Installing Node dependencies..."
pnpm install

# 5. Start Infrastructure
echo "🐳 Starting Docker infrastructure (Postgres, Redis, NATS, etc.)..."
docker-compose up -d

echo "⏳ Waiting for databases to initialize (10 seconds)..."
sleep 10

# 6. Prisma Setup
echo "🗄️ Setting up database schema and running migrations..."
pnpm prisma generate

echo "📡 Pushing schema to Auth database..."
pnpm prisma db push

echo "📡 Pushing schema to Product database..."
DATABASE_URL=$PRODUCT_DATABASE_WRITE_URL pnpm prisma db push

# 7. Seed Data
echo "🌱 Seeding initial product data (TS)..."
pnpm dlx tsx scripts/seed-products.ts

# 8. Frontend Setup
echo "🔧 Setting up Frontend environment..."
if [ -d "apps/web-shop" ]; then
    cd apps/web-shop
    pnpm install
    # Create .env file for frontend if it doesn't exist
    if [ ! -f .env ]; then
        cp ../../.env.example .env
        echo "✅ Created .env file for frontend"
    fi
    cd ../..
else
    echo "⚠️ apps/web-shop not found, skipping frontend setup."
fi

# 9. Build the Application (Backend)
echo "🏗️ Building shared libraries and microservices..."
pnpm run build

# Cleanup function to kill existing processes on ports
cleanup_ports() {
    echo "🧹 Cleaning up existing processes on ports..."
    for port in 3000 50053; do
        pid=$(lsof -ti :$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            echo "Killing process $pid on port $port"
            kill -9 $pid 2>/dev/null || true
        fi
    done
}

# 10. Mark setup as complete
touch .setup_complete

echo "=========================================================="
echo "🎉 Setup Complete!"
echo "=========================================================="
echo ""
echo "🌐 Service URLs:"
echo "  📡 API Gateway:       http://localhost:3000"
echo "  🔐 Auth Service:      http://localhost:3001"
echo "  � Product Service:   http://localhost:3003"
echo "  📦 Inventory Service: http://localhost:3004"
echo "  📋 Order Service:     http://localhost:3006"
echo "  💳 Payment Service:   http://localhost:3007"
echo "  🛍 Frontend Dev:     http://localhost:5173"
echo ""
echo "To start the development servers, please choose an option:"
echo "1) Start API Gateway only"
echo "2) Start All Core Services (Gateway, Auth, Order, Inventory, Payment)"
echo "3) Start Frontend Development Server"
echo "4) Start All Services (Backend + Frontend)"
echo "5) Exit setup"

read -p "Select an option [1-5]: " choice

case $choice in
    1)
        echo "🚀 Starting API Gateway..."
        cleanup_ports
        pnpm run start:dev api-gateway
        ;;
    2)
        echo "🚀 Starting all core services..."
        cleanup_ports
        pnpm concurrently \
            "pnpm run start:dev api-gateway" \
            "pnpm run start:auth" \
            "pnpm run start:order" \
            "pnpm run start:inventory" \
            "pnpm run start:payment" \
            "pnpm run start:product"
        ;;
    3)
        echo "🛍 Starting Frontend Development Server..."
        if [ -d "apps/web-shop" ]; then
            cd apps/web-shop
            pnpm dev
        else
            echo "❌ apps/web-shop directory not found. Please run setup first."
        fi
        ;;
    4)
        echo "🚀 Starting All Services (Backend + Frontend)..."
        cleanup_ports
        pnpm concurrently \
            "pnpm run start:dev api-gateway" \
            "pnpm run start:auth" \
            "pnpm run start:order" \
            "pnpm run start:inventory" \
            "pnpm run start:payment" \
            "pnpm run start:product" \
            "cd apps/web-shop && pnpm dev"
        ;;
    5)
        echo "👋 Setup finished. You can start services later using 'pnpm run start:dev <service-name>'."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac
