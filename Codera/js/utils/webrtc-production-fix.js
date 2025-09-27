// Enhanced WebRTC Configuration for Production Deployment
// This fixes common voice chat issues in deployed applications

class ProductionWebRTC {
    constructor() {
        this.iceServers = [
            // Google STUN servers (primary)
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            
            // Additional STUN servers for better reliability
            { urls: 'stun:stun.stunprotocol.org:3478' },
            { urls: 'stun:stun.nextcloud.com:443' },
            
            // Free TURN servers for production (if needed)
            // Uncomment these if STUN alone doesn't work
            {
                urls: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            },
            {
                urls: 'turn:192.158.29.39:3478?transport=udp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
            }
        ];
    }

    async checkBrowserSupport() {
        const issues = [];
        const fixes = [];

        // Check HTTPS
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            issues.push('❌ Not using HTTPS - WebRTC requires secure context');
            fixes.push('Deploy uses HTTPS ✅');
        } else {
            console.log('✅ Secure context (HTTPS) detected');
        }

        // Check WebRTC support
        if (!window.RTCPeerConnection) {
            issues.push('❌ WebRTC not supported in this browser');
            fixes.push('Use Chrome, Firefox, Safari, or Edge');
            return { issues, fixes, supported: false };
        }

        // Check getUserMedia support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            issues.push('❌ getUserMedia not supported');
            fixes.push('Update browser or use a different browser');
            return { issues, fixes, supported: false };
        }

        // Test microphone permissions
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            console.log('✅ Microphone access granted');
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            issues.push(`❌ Microphone access denied: ${error.message}`);
            fixes.push('Click the microphone icon in browser address bar and allow access');
            fixes.push('Check browser settings for microphone permissions');
            fixes.push('Try refreshing the page and clicking "Allow" when prompted');
        }

        return { 
            issues, 
            fixes, 
            supported: issues.length === 0,
            iceServers: this.iceServers
        };
    }

    createEnhancedPeerConnection(type = 'voice') {
        console.log(`🆕 Creating enhanced ${type} peer connection for production...`);

        const configuration = {
            iceServers: this.iceServers,
            iceCandidatePoolSize: 10,
            bundlePolicy: 'max-bundle',
            rtcpMuxPolicy: 'require',
            iceTransportPolicy: 'all' // Try both STUN and TURN
        };

        console.log('🌍 Using production ICE configuration:', configuration);

        const pc = new RTCPeerConnection(configuration);

        // Enhanced connection monitoring
        pc.onconnectionstatechange = () => {
            console.log(`${type.toUpperCase()} Connection State:`, pc.connectionState);
            console.log(`${type.toUpperCase()} ICE Connection State:`, pc.iceConnectionState);
            
            if (pc.connectionState === 'failed') {
                console.log(`❌ ${type} connection failed, attempting ICE restart...`);
                pc.restartIce();
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log(`${type.toUpperCase()} ICE State:`, pc.iceConnectionState);
            
            if (pc.iceConnectionState === 'disconnected') {
                console.log(`⚠️ ${type} ICE disconnected, will attempt reconnection...`);
            } else if (pc.iceConnectionState === 'failed') {
                console.log(`❌ ${type} ICE failed, restarting ICE...`);
                pc.restartIce();
            } else if (pc.iceConnectionState === 'connected') {
                console.log(`✅ ${type} ICE connected successfully!`);
            }
        };

        pc.onicegatheringstatechange = () => {
            console.log(`${type.toUpperCase()} ICE Gathering:`, pc.iceGatheringState);
        };

        return pc;
    }

    async requestMicrophoneAccess() {
        try {
            console.log('🎤 Requesting microphone access with enhanced settings...');
            
            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100,
                    channelCount: 2
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            console.log('✅ Microphone stream obtained:', {
                id: stream.id,
                active: stream.active,
                audioTracks: stream.getAudioTracks().length
            });

            // Log track details
            stream.getAudioTracks().forEach((track, index) => {
                console.log(`Audio Track ${index}:`, {
                    label: track.label,
                    enabled: track.enabled,
                    muted: track.muted,
                    readyState: track.readyState
                });
            });

            return stream;
        } catch (error) {
            console.error('❌ Failed to access microphone:', error);
            
            // Provide specific error handling
            if (error.name === 'NotAllowedError') {
                throw new Error('Microphone access denied. Please click the microphone icon in your browser address bar and select "Allow".');
            } else if (error.name === 'NotFoundError') {
                throw new Error('No microphone found. Please connect a microphone and try again.');
            } else if (error.name === 'NotReadableError') {
                throw new Error('Microphone is being used by another application. Please close other applications and try again.');
            } else {
                throw new Error(`Failed to access microphone: ${error.message}`);
            }
        }
    }

    showPermissionInstructions() {
        return `
🎤 VOICE CHAT SETUP INSTRUCTIONS:

1. 📱 BROWSER PERMISSIONS:
   - Look for the microphone icon in your browser's address bar
   - Click it and select "Always allow" for this site
   - Refresh the page after granting permission

2. 🔒 HTTPS REQUIREMENT:
   - Voice chat only works on HTTPS (secure) websites
   - Your deployed app should automatically use HTTPS ✅

3. 🌐 FIREWALL/NETWORK:
   - If you're on a corporate network, voice chat might be blocked
   - Try switching to a personal network or mobile hotspot

4. 🔊 AUDIO SETTINGS:
   - Make sure your microphone is not muted
   - Check system audio settings
   - Try using headphones to prevent echo

5. 🔧 TROUBLESHOOTING:
   - Try refreshing the page
   - Clear browser cache and cookies
   - Try a different browser (Chrome recommended)
   - Restart your browser

Need help? Check the browser console (F12) for detailed error messages.
        `;
    }
}

// Make available globally
window.ProductionWebRTC = ProductionWebRTC;