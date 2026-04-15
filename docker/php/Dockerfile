FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git curl zip unzip libzip-dev \
    postgresql-dev icu-dev oniguruma-dev \
    linux-headers $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install \
    pdo pdo_pgsql \
    zip bcmath mbstring \
    intl opcache pcntl

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application
COPY . .

# Install dependencies (production)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
