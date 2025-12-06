# -----------------------------
# Stage 1: Build
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

# -----------------------------
# Stage 2: Production
# -----------------------------
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.svelte-kit ./.svelte-kit
COPY --from=builder /app/static ./static
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/src ./src

# /uploads
COPY --from=builder /app/uploads ./uploads

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
