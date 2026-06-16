'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedSecurePassword = await bcrypt.hash('SecurePassword123', salt);

    // 1. PURE ORM: Fetching Roles instead of SELECT query
    const roles = await queryInterface.select(null, { tableName: 'Roles', schema: 'dbo' });

    const adminRole = roles.find(r => r.RoleName === 'Admin');
    const managerRole = roles.find(r => r.RoleName === 'Manager');
    const employeeRole = roles.find(r => r.RoleName === 'Employee');

    if (!adminRole || !managerRole || !employeeRole) {
      throw new Error("Seeding Failed: Please populate your master Roles table before running this demo seeder.");
    }

    // 2. PURE ORM: Using bulkInsert with { returning: true } to get IDs back
    // (Note: replacing GETDATE() with standard JavaScript Dates)
    const insertedUsers = await queryInterface.bulkInsert(
      { tableName: 'Users', schema: 'dbo' },
      [
        { FullName: 'Dev Admin', Email: 'admin@company.com', PasswordHash: hashedSecurePassword, IsActive: true, CreatedAt: new Date(), UpdatedAt: new Date() },
        { FullName: 'Alice Manager', Email: 'manager@company.com', PasswordHash: hashedSecurePassword, IsActive: true, CreatedAt: new Date(), UpdatedAt: new Date() },
        { FullName: 'John Employee', Email: 'john@company.com', PasswordHash: hashedSecurePassword, IsActive: true, CreatedAt: new Date(), UpdatedAt: new Date() },
        { FullName: 'Sarah Employee', Email: 'sarah@company.com', PasswordHash: hashedSecurePassword, IsActive: true, CreatedAt: new Date(), UpdatedAt: new Date() }
      ],
      { returning: true } // This tells Sequelize to return the inserted records with IDs
    );

    // Supporting array variation (Sequelize returns different structures depending on dialect)
    const usersArray = Array.isArray(insertedUsers) ? insertedUsers : insertedUsers[0];

    const adminId = usersArray.find(u => u.Email === 'admin@company.com').UserID;
    const managerId = usersArray.find(u => u.Email === 'manager@company.com').UserID;
    const johnId = usersArray.find(u => u.Email === 'john@company.com').UserID;
    const sarahId = usersArray.find(u => u.Email === 'sarah@company.com').UserID;

    // 3. UserRoles and Tasks seeding stay exactly the same (they already used ORM syntax!)
    await queryInterface.bulkInsert({ tableName: 'UserRoles', schema: 'dbo' }, [
      { UserId: adminId, RoleId: adminRole.RoleID, AssignedAt: new Date() },
      { UserId: managerId, RoleId: managerRole.RoleID, AssignedAt: new Date() },
      { UserId: johnId, RoleId: employeeRole.RoleID, AssignedAt: new Date() },
      { UserId: sarahId, RoleId: employeeRole.RoleID, AssignedAt: new Date() }
    ]);

    await queryInterface.bulkInsert({ tableName: 'Tasks', schema: 'dbo' }, [
      {
        Title: 'Configure Production Firewalls',
        Description: 'Review whitelist IP arrays and set secure routing parameters.',
        Status: 'Pending',
        AssignedToUserId: johnId,     
        AssignedByUserId: adminId,    
        DueDate: new Date(new Date().setDate(new Date().getDate() + 5)), 
        CreatedDate: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    // 4. PURE ORM: Using bulkDelete instead of raw DELETE queries
    await queryInterface.bulkDelete({ tableName: 'Tasks', schema: 'dbo' }, null, {});
    await queryInterface.bulkDelete({ tableName: 'UserRoles', schema: 'dbo' }, null, {});
    await queryInterface.bulkDelete({ tableName: 'Users', schema: 'dbo' }, {
      Email: ['admin@company.com', 'manager@company.com', 'john@company.com', 'sarah@company.com']
    }, {});
  }
};