# Build stage for Node.js assets
FROM node:20-alpine AS node-builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install Node dependencies
RUN npm ci

# Copy source files
COPY resources ./resources
COPY vite.config.ts tsconfig.json tailwind.config.* postcss.config.* ./
COPY public ./public

# Build assets avec les variables VITE directement dans la commande
RUN VITE_REVERB_APP_KEY=4z67llnrkamx9r4z6oy3 \
    VITE_REVERB_HOST=afrozamarketplace.app \
    VITE_REVERB_PORT=8080 \
    VITE_REVERB_SCHEME=https \
    npm run build

# PHP stage
FROM php:8.3-fpm-alpine AS php-base

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    libpq-dev \
    icu-dev \
    linux-headers \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache \
    sockets

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html


# Development stage
FROM php-base AS development

# Install development dependencies
RUN apk add --no-cache \
    nodejs \
    npm \
    supervisor

# Copy custom PHP configuration
RUN echo "upload_max_filesize = 50M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit = 512M" >> /usr/local/etc/php/conf.d/uploads.ini

# Create supervisord config
RUN mkdir -p /etc/supervisor.d
COPY docker/supervisord.conf /etc/supervisor.d/supervisord.ini

# Copy application
COPY --chown=www-data:www-data . .

# Install PHP dependencies
RUN composer install --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000 5173 8080

CMD ["supervisord", "-n", "-c", "/etc/supervisord.conf"]


# Production stage
FROM php-base AS production

# Configure OPcache for production
RUN echo "opcache.enable=1" > /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=64" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini

# Copy custom PHP configuration
RUN echo "upload_max_filesize = 50M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/uploads.ini

# Copy application (excluding node_modules, vendor, etc. via .dockerignore)
COPY --chown=www-data:www-data . .

# Copy built assets from node builder
COPY --from=node-builder --chown=www-data:www-data /app/public/build ./public/build

# Install PHP dependencies without dev
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Note: config:cache and route:cache are removed from build
# They should be run at container startup when env variables are available
# Only cache views since they don't depend on environment
RUN php artisan view:cache || true

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
