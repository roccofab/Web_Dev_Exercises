FROM node:20

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy project
COPY . .

# change permissions to run script.bash
RUN chmod +x entrypoint.sh

# Create data directory for database
RUN mkdir -p models/data

EXPOSE 3000

CMD ["./entrypoint.sh"]