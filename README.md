# Project's README

## Development

### Environment Variables

Create `.env.local` file with these environment variables
```
# SECRET
DB_URL=<MONGODB-URL> example: mongodb://root:password@localhost:27017
PRIVATE_KEY=<YOUR-RANDOM-STRING>

# OPTIONAL
NEXT_PUBLIC_DOMAIN=<DOMAIN>
NEXT_PUBLIC_AUTHOR=<AUTHOR-NAME>
OVERRIDING_DB=<YOUR-CUSTOM-DATABASE-NAME> # only works with v2 APIs

# ROOT USER
ROOT_ENABLE=<true/false>
ROOT_USERNAME=<ROOT_USERNMAME>
ROOT_PASSWORD=<ROOT_PASSWORD>
```

### MongoDB

Run MongoDB in docker-compose
```
docker-compose up
```

### Running app

Installing packages
```
npm install
```

Start app
```
npm run dev
```

<br>

# Nextjs's README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
