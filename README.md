# Project's README

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
BYPASS_AUTHEN=<true/false> # only works in development environment
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

- /api/v1/articles/[slug]
- /api/v1/articles
- /api/v1/inc-view
- /api/v1/login-admin
- /api/v1/logout-admin
- /api/v1/recover-article
- /api/v1/validate-token

### API V2

API V2 is aimed to remodel article stored in MongoDB to decrease complexity

- /api/articles
- /api/inc-view
- /api/recover-article
- page-rendering
