#!/bin/bash

echo "🚀 Starting FindMe Development Environment..."
echo ""

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   mongod"
    echo ""
fi

# Start AI Service
echo "🤖 Starting AI Service on port 5001..."
cd ai-service
python app.py &
AI_PID=$!
cd ..

# Wait a bit for AI service to start
sleep 3

# Start Backend
echo "🔧 Starting Backend on port 5000..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo "⚛️  Starting Frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   AI Service: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $AI_PID $BACKEND_PID $FRONTEND_PID; exit" INT
wait
