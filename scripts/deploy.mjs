import { execSync } from 'child_process';
import fs from 'fs';
import 'dotenv/config';

// Configuration
const SERVER_IP = process.env.DEPLOY_SERVER_IP;
const REMOTE_USER = process.env.DEPLOY_REMOTE_USER;
const REMOTE_PATH = process.env.DEPLOY_REMOTE_PATH;
const PROJECT_NAME = process.env.DEPLOY_PROJECT_NAME || 'fina';
const PORT = process.env.DEPLOY_PORT || '3000';
const TAR_FILE = `${PROJECT_NAME}.tar.gz`;

if (!SERVER_IP) {
    console.error('Error: DEPLOY_SERVER_IP is not defined in .env');
    process.exit(1);
}

function run(command) {
    console.log(`Executing: ${command}`);
    try {
        execSync(command, { stdio: 'inherit' });
    } catch {
        console.error(`Error executing command: ${command}`);
        process.exit(1);
    }
}

async function deploy() {
    console.log('Starting deployment...');

    // 1. Build the project (Optional, but usually needed for Next.js)
    console.log('Building project...');
    run('npm run build');

    // 2. Create a tarball of the project
    // We exclude node_modules, .git, and .next (if we are uploading source) 
    // or we include .next if we are uploading for production
    console.log('Creating tarball...');

    // For a typical Next.js deploy, we might need:
    // .next, public, package.json, next.config.js, node_modules (or install there)

    // Here we'll tar the whole project but exclude heavy/unnecessary dirs
    // Note: Windows 'tar' supports --exclude
    const excludes = [
        'node_modules',
        '.git',
        '.next/cache',
        TAR_FILE,
        'scripts'
    ].map(item => `--exclude="${item}"`).join(' ');

    run(`tar czf ${TAR_FILE} ${excludes} .`);

    // 3. Upload to server
    console.log(`Uploading ${TAR_FILE} to ${SERVER_IP}...`);
    run(`ssh ${REMOTE_USER}@${SERVER_IP} "mkdir -p ${REMOTE_PATH}"`);
    run(`scp ${TAR_FILE} ${REMOTE_USER}@${SERVER_IP}:${REMOTE_PATH}`);

    // 4. Extract on server
    // 4. Extract on server
    console.log('Extracting on server...');

    const remoteCommands = [
        `cd ${REMOTE_PATH}`,
        `tar xzf ${TAR_FILE}`,
        `rm ${TAR_FILE}`,
    ].join(' && ');

    run(`ssh ${REMOTE_USER}@${SERVER_IP} "${remoteCommands}"`);

    console.log('🖥️ pm2 启动指令：');
    console.log(`npm install --production && pm2 delete ${PROJECT_NAME} || true && pm2 start npm --name ${PROJECT_NAME} -- start -- -p ${PORT}`);

    // 5. Cleanup local tarball
    console.log('Cleaning up local files...');
    if (fs.existsSync(TAR_FILE)) {
        fs.unlinkSync(TAR_FILE);
    }

    console.log('Deployment complete!');
}

deploy().catch(err => {
    console.error('Deployment failed:', err);
    process.exit(1);
});
