FROM node:22-alpine AS development

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json tsconfig.json

RUN pnpm install

COPY apps/reservations apps/reservations
COPY libs libs

RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/reservations/main.js"]