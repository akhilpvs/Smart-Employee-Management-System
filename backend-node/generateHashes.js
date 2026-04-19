const bcrypt = require('bcryptjs');

async function generateHashes() {
    const testPasswords = [
        { email: 'admin@company.com', password: 'admin123' },
        { email: 'john.doe@company.com', password: 'emp123' },
        { email: 'jane.smith@company.com', password: 'emp123' }
    ];

    console.log('Generating bcrypt hashes for test credentials:\n');

    for (const cred of testPasswords) {
        const hash = await bcrypt.hash(cred.password, 10);
        console.log(`Email: ${cred.email}`);
        console.log(`Password: ${cred.password}`);
        console.log(`Hash: ${hash}\n`);
    }
}

generateHashes().catch(err => console.error('Error:', err));
