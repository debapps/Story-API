# Story API

This application is a REST API for fictional stories. The application is created in **NODE JS** and the backend database is **MongoDB Atlas**. The **Prisma** ORM is used to connect the MongoDB from the application.

## Environment Variables

-   **DATABASE_URL**: MongoDB URL.
-   **PORT**: Application port.

## Test URL

> http://localhost:**PORT**/api/story

## Production URL

> https://story-api-y108.onrender.com/api/story

## API EndPoints

-   **/api/story**: Method **GET**. Fetch all stories from the DB.
-   **/api/story/[slug]**: Method **GET**. Fetch story specific to the slug.
-   **/api/story**: Method **POST**. Adds a new story into the DB.

## Story Attributes.

-   title
-   image
-   synopsis
-   category
-   author
-   content
