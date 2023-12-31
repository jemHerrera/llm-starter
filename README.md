# Aiverb

A Language model for language learning. Currently supports Japanese language for English speaking learners.

Typescript - Express - PostgreSQL - Nuxt

## Setup

1. Use node version: v18.16.0
2. Install [pnpm](https://pnpm.io/) locally.
3. Install [docker](https://www.docker.com/get-started/).
4. Run `pnpm i` on the root directory. Ths will install all dependencies across all sub-applications.

## Running servers locally

Run `pnpm dev`

- postgres - localhost:5432
- pgAdmin - localhost:5002
- api server - localhost:4000
- nuxt server - localhost:3000

This automatically creates the postgres db and pgAdmin docker containers

## Running app specific scripts

With pnpm, scripts from inside each sub-applications can be ran from the root directory:

- `pnpm api <script-name>` Example: `pnpm api dev`, `pnpm api build`
- `pnpm nuxt <script-name>` Example: `pnpm web dev`

## Creating a new database entity

1. Create a new `.ts` file in `apps/server/src/db/entities`, following the naming convention. This setup uses [MikroORM](https://mikro-orm.io/docs/next/defining-entities) as the postgresSQL driver.
2. Make sure to export the new entity in `apps/server/src/db/entities/index.ts`
3. Create new migration files by running `pnpm create-migration`
4. Migrate to the db by running `pnpm migrate`
5. Local database can be tested via pgAdmin at localhost:5002. All the dev credentials can be found at the docker-compose.yml and .env files

## Creating a new api endpoint

1. Create a new controller `.ts` file in `apps/server/src/controllers`, following the naming convention.
2. When creating a controller, include Request and Response validation and types.
3. This setup uses [zod](https://zod.dev/) to create typed validation schemas.
4. Export the request and response types in `apps/server/src/types`
5. Create a new route file in `apps/server/src/router`, or add to the existing routes. If a new route is created, add it to `apps/server/src/router/index.ts`

## Todo

1. Explore LLM
