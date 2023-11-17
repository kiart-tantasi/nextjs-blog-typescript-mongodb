# Project's README

## Development

### Environment Variables

Create `.env.local` file with these environment variables
```
# SECRET
DB_URL=<MONGODB-URL> example: mongodb://root:password@localhost:27017
PRIVATE_KEY=<YOUR-RANDOM-STRING>

# REQUIRED
NEXT_PUBLIC_DOMAIN=<DOMAIN>

# OPTIONAL
NEXT_PUBLIC_AUTHOR=<AUTHOR-NAME>
OVERRIDING_DB=<YOUR-CUSTOM-DATABASE-NAME> # only works with v2 APIs
BYPASS_AUTHEN # only for development

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

### API V2

- /api/articles
- /api/articles/[slug]
- /api/inc-view
- /api/presigned-url (not sure)
- /api/recover-article
