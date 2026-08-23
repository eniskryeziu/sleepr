FROM node:22-alpine

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-workspace.yaml ./

RUN pnpm install

COPY . .

CMD ["pnpm", "test"]