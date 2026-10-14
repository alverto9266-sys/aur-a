import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const safePath = normalize(pathname).replace(/^([/\\]*\.\.[/\\])+/, '');
  const file = join(root, pathname === '/' ? 'index.html' : safePath);
  try {
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': `${types[extname(file)] || 'application/octet-stream'}; charset=utf-8` });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(5173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:5173'));
