FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

# Copy entrypoint (from build context = project root)
COPY docker/frontend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "dev"]
