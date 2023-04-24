# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- getAllProducts `/products` [GET]
- createProduct `/products/create` [POST] [token required]
- detailProduct `/products/:id` [GET]
- updateProduct `/products/:id` [PUT] [token required]
- deleteProduct `/products/:id` [DELETE] [token required]

#### Users
- getAllUsers `/users` [GET] [token required]
- createUser `/users/create` [POST] 
- detailUser `/users/:id` [GET] [token required]
- updateUser `/users/:id` [PUT] [token required]
- deleteUser `/users/:id` [DELETE] [token required]
- login `/users/auth` [POST]

#### Orders
- getAllOrders `/orders` [GET] [token required]
- createOrder `/orders/create` [POST] [token required]
- detailOrder `/orders/:id` [GET] [token required]
- updateOrder `/orders/:id` [PUT] [token required]
- deleteOrder `/orders/:id` [DELETE] [token required]

## Data Shapes
#### Product
Table: *products*
- id `SERIAL PRIMARY KEY`
- name `VARCHAR`
- price `INTEGER`

#### User
Table: *users*
- id `SERIAL PRIMARY KEY`
- username `VARCHAR`
- firstname `VARCHAR`
- lastname `VARCHAR`
- password_digest `VARCHAR`

#### Orders
Table: *orders*
- id `SERIAL PRIMARY KEY`
- user_id `INTEGER` `REFERENCES users(id)`
- status `BOOLEAN`

Table: *order_products*
- order_id `INTEGER` `REFERENCES orders(id)` 
- product_id `INTEGER` `REFERENCES products(id)`
- quantity `INTEGER
