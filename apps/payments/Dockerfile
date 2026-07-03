FROM node:22-alpine AS development

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main.js"]