import { Role } from '@src/app/modules/acl/entities/role.entity';
import { GlobalConfig } from '@src/app/modules/globalConfig/entities/globalConfig.entity';
import { User } from '@src/app/modules/user/entities/user.entity';
import { UserRole } from '@src/app/modules/user/entities/userRole.entity';
import { ENV, ormConfig } from '@src/env';
import { DataSource } from 'typeorm';
import GlobalConfigSeeder from './seeder/globalConfig.seeder';
import RoleSeeder from './seeder/role.seeder';
import UserSeeder from './seeder/user.seeder';

const dataSource = new DataSource({
  type: 'postgres',
  host: ormConfig.host,
  port: ormConfig.port,
  username: ormConfig.username,
  password: ormConfig.password,
  database: ormConfig.database,
  ssl: ENV.isProduction ? { rejectUnauthorized: false } : false,
  synchronize: true,
  entities: [User, Role, UserRole, GlobalConfig],
});

(async () => {
  await dataSource.initialize();
  await dataSource.synchronize();

  const globalConfigSeeder = new GlobalConfigSeeder(dataSource);
  const roleSeeder = new RoleSeeder(dataSource);
  const userSeeder = new UserSeeder(dataSource);

  await roleSeeder.run();
  await userSeeder.run();
  await globalConfigSeeder.run();

  await dataSource.destroy();
})();
