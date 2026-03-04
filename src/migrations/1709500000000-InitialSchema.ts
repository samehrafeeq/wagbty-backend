import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitialSchema1709500000000 implements MigrationInterface {
  name = 'InitialSchema1709500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // إنشاء جدول المستخدمين
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: '(UUID())',
          },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'role', type: 'varchar', length: '255', default: "'user'" },
          { name: 'createdAt', type: 'datetime', length: '6', default: 'CURRENT_TIMESTAMP(6)' },
          { name: 'updatedAt', type: 'datetime', length: '6', default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' },
        ],
      }),
      true,
    );

    // إنشاء جدول المطاعم
    await queryRunner.createTable(
      new Table({
        name: 'restaurants',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: '(UUID())',
          },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'address', type: 'varchar', length: '255', isNullable: true },
          { name: 'category', type: 'varchar', length: '100', isNullable: true },
          { name: 'image', type: 'varchar', length: '500', isNullable: true },
          { name: 'rating', type: 'decimal', precision: 2, scale: 1, default: 0 },
          { name: 'role', type: 'varchar', length: '255', default: "'restaurant'" },
          { name: 'isActive', type: 'tinyint', default: 1 },
          { name: 'createdAt', type: 'datetime', length: '6', default: 'CURRENT_TIMESTAMP(6)' },
          { name: 'updatedAt', type: 'datetime', length: '6', default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('restaurants');
    await queryRunner.dropTable('users');
  }
}
