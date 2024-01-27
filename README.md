## Demo

<img src="/demos/demo-1.png" alt="App demo" height="800px" />

## Development

### Environment Variables

Create `.env.local` file with these environment variables

```
# REQUIRED (PUBLIC)
NEXT_PUBLIC_DOMAIN=<DOMAIN>

# REQUIRED (SECRET)
DB_URL=<MONGODB-URL> example: mongodb://root:password@localhost:27017
PRIVATE_KEY=<YOUR-RANDOM-STRING>

# OPTIONAL (PUBLIC)
NEXT_PUBLIC_AUTHOR=<AUTHOR-NAME>

# OPTIONAL (SECRET)
OVERRIDING_DB=<YOUR-CUSTOM-DATABASE-NAME> # only works with v2 APIs
BYPASS_AUTHEN=<true/false> # bypass api authentication, this only works in development environment
ROOT_ENABLE=<true/false> # enable root account for path /workspace
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

### Run production locally

build

```
npm run build
```

start

```
npm run start
```

### API V1

API V1 was implemented in early 2022

- /api/v1/articles/[slug]
- /api/v1/articles
- /api/v1/inc-view
- /api/v1/login-admin
- /api/v1/logout-admin
- /api/v1/recover-article
- /api/v1/validate-token

### API V2

API V2 is aimed to remodel article stored in MongoDB to decrease complexity

- /api/v2/articles
- /api/v2/inc-view
- /api/v2/recover-article
- page-rendering

### Images

Temporarily store images in public directory
