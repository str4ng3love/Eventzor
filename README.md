# Eventzor

## Technologies

- Nextjs
- Tailwind
- MONGODB
- Prisma

---

## Instalation

- Clone this repository

```properties
git clone URL
```

- Install the deps

```properties
npm install
```

- Add environmental variables for MongoDB connection string and NextAuth.js secret

```
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
NEXTAUTH_SECRET=YOUR_SECRET
```

- Run developement server ...

```properties
npm run dev
```

... or build and serve the app

```properties
npm run build
```

```properties
npm run start
```

---

## Possible Improvements

- Event and Market Browser could display some kind of loading indicator while loading an already open route, with new search params.
- Image optimization.
- Better light mode color scheme.
- Rework Search component.
- Add "selected" state for buttons in /orders.
