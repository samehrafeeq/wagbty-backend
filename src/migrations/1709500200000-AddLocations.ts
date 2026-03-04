import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocations1709500200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`countries\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`code\` varchar(10) NOT NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 0,
        \`sortOrder\` int NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_countries_name\` (\`name\`),
        UNIQUE INDEX \`IDX_countries_code\` (\`code\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`governorates\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(150) NOT NULL,
        \`countryId\` varchar(36) NOT NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`sortOrder\` int NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        INDEX \`IDX_governorates_countryId\` (\`countryId\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`cities\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(150) NOT NULL,
        \`governorateId\` varchar(36) NOT NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`sortOrder\` int NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        INDEX \`IDX_cities_governorateId\` (\`governorateId\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add location columns to users table
    await queryRunner.query(`ALTER TABLE \`users\` ADD COLUMN \`countryId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` ADD COLUMN \`governorateId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` ADD COLUMN \`cityId\` varchar(36) NULL`);

    // Add location columns to restaurants table
    await queryRunner.query(`ALTER TABLE \`restaurants\` ADD COLUMN \`countryId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`restaurants\` ADD COLUMN \`governorateId\` varchar(36) NULL`);
    await queryRunner.query(`ALTER TABLE \`restaurants\` ADD COLUMN \`cityId\` varchar(36) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`restaurants\` DROP COLUMN \`cityId\``);
    await queryRunner.query(`ALTER TABLE \`restaurants\` DROP COLUMN \`governorateId\``);
    await queryRunner.query(`ALTER TABLE \`restaurants\` DROP COLUMN \`countryId\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`cityId\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`governorateId\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`countryId\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`cities\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`governorates\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`countries\``);
  }
}
