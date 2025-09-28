// Simple WebSocket chat server for cross-browser communication
const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store active connections by room
const rooms = new Map();

wss.on('connection', function connection(ws) {
    console.log('New client connected');
    
    ws.on('message', function incoming(data) {
        try {
            const message = JSON.parse(data);
            console.log('Received:', message);
            
            switch (message.type) {
                case 'join':
                    // Add client to room
                    if (!rooms.has(message.roomId)) {
                        rooms.set(message.roomId, new Set());
                    }
                    rooms.get(message.roomId).add(ws);
                    ws.roomId = message.roomId;
                    console.log(`Client joined room: ${message.roomId}`);
                    break;
                    
                case 'chat':
                    // Broadcast message to all clients in the same room
                    if (ws.roomId && rooms.has(ws.roomId)) {
                        const roomClients = rooms.get(ws.roomId);
                        const broadcastMessage = {
                            type: 'chat',
                            id: message.id,
                            sender: message.sender,
                            text: message.text,
                            timestamp: message.timestamp,
                            roomId: ws.roomId
                        };
                        
                        roomClients.forEach(client => {
                            if (client !== ws && client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(broadcastMessage));
                            }
                        });
                        
                        console.log(`Broadcasted message in room ${ws.roomId}: ${message.text}`);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    ws.on('close', function() {
        // Remove client from room
        if (ws.roomId && rooms.has(ws.roomId)) {
            rooms.get(ws.roomId).delete(ws);
            if (rooms.get(ws.roomId).size === 0) {
                rooms.delete(ws.roomId);
            }
            console.log(`Client left room: ${ws.roomId}`);
        }
        console.log('Client disconnected');
    });
    
    ws.on('error', function(error) {
        console.error('WebSocket error:', error);
    });
});

const PORT = 8080;
server.listen(PORT, function() {
    console.log(`🚀 Chat server running on ws://localhost:${PORT}`);
    console.log('Ctrl+C to stop server');
});

// Graceful shutdown
process.on('SIGINT', function() {
    console.log('\n📴 Shutting down chat server...');
    wss.close(function() {
        server.close(function() {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
});