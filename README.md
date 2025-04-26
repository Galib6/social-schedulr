## Technology Used

- ExpressJS
- NestJS
- TypeORM
- PostgreSQL
- Redis
- Cron

## Running Application

Environment file is available in `environments` directory. Change database credentials then run

```shell
nvm use v22.12.0
yarn install
yarn start
```

## Migrations

For creating a migration file

```shell
yarn db:migration:create src/database/migrations/User
```

Before running migration run `yarn build` command

```shell
yarn build
yarn db:migration:run
yarn db:migration:revert
```

## Documentation

http://localhost:4002/docs
