import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddApprovalAndCategories1709500100000 implements MigrationInterface {
  name = 'AddApprovalAndCategories1709500100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // إضافة عمود isApproved لجدول المطاعم
    await queryRunner.addColumn(
      'restaurants',
      new TableColumn({
        name: 'isApproved',
        type: 'tinyint',
        default: 0,
      }),
    );

    // إنشاء جدول التصنيفات
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: '(UUID())',
          },
          { name: 'name', type: 'varchar', length: '100', isUnique: true },
          { name: 'image', type: 'varchar', length: '500', isNullable: true },
          { name: 'isActive', type: 'tinyint', default: 1 },
          { name: 'sortOrder', type: 'int', default: 0 },
          { name: 'createdAt', type: 'datetime', length: '6', default: 'CURRENT_TIMESTAMP(6)' },
          { name: 'updatedAt', type: 'datetime', length: '6', default: 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
    await queryRunner.dropColumn('restaurants', 'isApproved');
  }
}
