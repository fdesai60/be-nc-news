# Northcoders News API
**Hosted version**: https://news-lzt1.onrender.com

## Project Overview
This project is a **RESTful API** built to handle various endpoints for articles, topics, comments, and users. It allows you to interact with a **PostgreSQL** database to perform **CRUD** operations, through code which has been thoroughly **tested and error handled**.

**Read** lists of articles, topics, and users.  
**Post** comments on specific articles.  
**Update** votes on articles.  
**Delete** comments.  
**Query** parameters to filter and sort results.

**NOTE**: please check **endpoints.json** for a more detailed insight into what each endpoint entails. 

## Prerequisites
Please ensure you have the following installed on your machine, at their minimum verisons required:  
Node.js: v22.9.0
PostgreSQL: 14.13

## Using the API
1. Clone the Repository    
   'git clone https://github.com/fdesai60/be-nc-news.git'

2. Navigtate to the project directory and open the repository on your favourite code editor

3. Install all the required packages using npm:    
   'npm install'

4. Create two .env files in the root directory of the project, and set the PGDATABASE accordingly:  
.env.development: PGDATABASE=nc_news  
.env.test: PGDATABASE=nc_news_test

5. Use the following scripts to seed the development database:  
'npm run setup-dbs'  
'npm run seed'

6. Use the following scirpt to seed the test databases and ensure everything is working as expected:  
'npm test'

7. Finally, start the server (listening on port 9090):  
'npm start'
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/) -->

