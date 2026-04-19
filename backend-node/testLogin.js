const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function testLogin() {
    const config = {
        host: 'localhost',
        user: 'employee1',
        password: 'employee1',
        database: 'employee_management'
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('✓ Database connected\n');

        // Get user
        const [users] = await connection.query(
            'SELECT id, email, password FROM users WHERE email = ?',
            ['john.doe@company.com']
        );

        if (users.length === 0) {
            console.log('✗ User not found');
            connection.end();
            return;
        }

        const user = users[0];
        console.log('Found user:', user.email);
        console.log('Stored hash:', user.password);

        // Test password
        const testPassword = 'emp123';
        const match = await bcrypt.compare(testPassword, user.password);

        console.log(`\nTesting password: "${testPassword}"`);
        console.log('Password match result:', match ? '✓ MATCH' : '✗ NO MATCH');

        connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLogin();
