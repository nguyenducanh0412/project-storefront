# Project Storefront Backend - Udacity

=> Using Swagger API for nodejs

## Create file env
- Create a file .env in root directory and update missing fields

```
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=storefront
POSTGRES_DB_TEST=storefront_test
POSTGRES_USER=`{here}`
POSTGRES_PASSWORD=`{here}`
BCRYPT_PASSWORD=`{here}`
SALT_ROUNDS=10
TOKEN_SECRET=`{here}`
ENV=dev
```



## Explain : 
POSTGRES_USER=`{here}` => user when create postgres
POSTGRES_PASSWORD=`{here}` => password when create postgres
BCRYPT_PASSWORD=`{here}` => password bcrypt
SALT_ROUNDS=10
TOKEN_SECRET=`{here}` => token secret, for example: udacity


## Download and setup Docker
- step1: download and install docker => https://docs.docker.com/desktop/install/windows-install/, install postgressql

# Run docker container
- step2: using cmd `docker-compose up` to start docker container or install docker extension for vscode to run docker
## Install all dependencies
- step3: `npm install or yarn install` to install all dependencies

## Setup database
- step4: create database dev with name : `storefront` and database test with name : `storefront_test`
- step5: in Project you use `npm run db-up` for DEV environment to generate files sql in folder migrations with format : 
        `...storefront-up.sql ` and `...storefront-down.sql `
- step6: in file `...storefront-up.sql` paste content : 
    `
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(250) NOT NULL,
            price INTEGER NOT NULL
        );

        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(250) NOT NULL,
            firstname VARCHAR(250) NOT NULL,
            lastname VARCHAR(250) NOT NULL,
            password_digest VARCHAR(250) NOT NULL
        );

        CREATE TABLE orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users (id),
            status BOOLEAN NOT NULL
        );

        CREATE TABLE order_products (
            order_id INTEGER NOT NULL REFERENCES orders (id),
            product_id INTEGER NOT NULL REFERENCES products (id),
            quantity INTEGER NOT NULL
        );
    `
    and in file `...storefront-down.sql` paste content : 

    `
    DROP TABLE order_products;

    DROP TABLE products;

    DROP TABLE orders;

    DROP TABLE users;
    `

## Setup migrations database
- step7: `npm run db-up` for database DEV environment with port `http://localhost:5432`

## start app
- step 8: `npm run start-dev` to start the app with port `http://localhost:3000` or `npm run start-test` to start the app with port `http://localhost:3001`


## Test the app
- `npm run test` to run test the app