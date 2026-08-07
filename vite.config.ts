import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite Plugin for Mock API during Development when no live Express backend is running
function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/v1')) {
          res.setHeader('Content-Type', 'application/json');

          // POST /api/v1/auth/register
          if (req.url.startsWith('/api/v1/auth/register') && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
              let parsed: any = {};
              try { parsed = JSON.parse(body); } catch (e) {}
              const email = parsed.email || 'author@storyspark.ai';
              const username = parsed.username || 'storyteller';

              res.statusCode = 201;
              res.end(
                JSON.stringify({
                  success: true,
                  statusCode: 201,
                  message: 'User registered successfully',
                  data: {
                    user: {
                      id: 'usr_new_' + Date.now(),
                      email,
                      username,
                      displayName: username,
                      role: 'user',
                      tier: 'free',
                      isEmailVerified: true,
                      createdAt: new Date().toISOString(),
                    },
                    accessToken: 'mock_jwt_token_register_' + Date.now(),
                  },
                })
              );
            });
            return;
          }

          // POST /api/v1/auth/login
          if (req.url.startsWith('/api/v1/auth/login') && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
              let parsed: any = {};
              try { parsed = JSON.parse(body); } catch (e) {}
              const email = parsed.email || 'author@storyspark.ai';

              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  statusCode: 200,
                  message: 'Logged in successfully',
                  data: {
                    user: {
                      id: 'usr_mock_123',
                      email,
                      username: email.split('@')[0] || 'Alex Rivers',
                      displayName: 'Alex Rivers',
                      role: 'user',
                      tier: 'pro',
                      isEmailVerified: true,
                      createdAt: new Date().toISOString(),
                    },
                    accessToken: 'mock_jwt_token_login_' + Date.now(),
                  },
                })
              );
            });
            return;
          }

          // POST /api/v1/auth/logout
          if (req.url.startsWith('/api/v1/auth/logout') && req.method === 'POST') {
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, statusCode: 200, message: 'Logged out successfully', data: null }));
            return;
          }

          // GET /api/v1/auth/me
          if (req.url.startsWith('/api/v1/auth/me') && req.method === 'GET') {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: true,
                statusCode: 200,
                message: 'Current user profile fetched',
                data: {
                  id: 'usr_mock_123',
                  email: 'author@storyspark.ai',
                  username: 'alex_rivers',
                  displayName: 'Alex Rivers',
                  role: 'user',
                  tier: 'pro',
                  isEmailVerified: true,
                  createdAt: new Date().toISOString(),
                },
              })
            );
            return;
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
