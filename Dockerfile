FROM public.ecr.aws/docker/library/node:20-alpine
WORKDIR /usr/src/app
COPY src/package*.json ./
RUN npm ci --omit=dev
COPY src/ ./
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "server.js"]
