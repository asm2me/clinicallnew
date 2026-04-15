FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git curl zip unzip libzip-dev \
    postgresql-dev icu-dev oniguruma-dev \
    linux-headers $PHPIZE_DEPS \
    bash

# Install PHP extensions
RUN docker-php-ext-install \
    pdo pdo_pgsql \
    zip bcmath mbstring \
    intl opcache pcntl

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer globally
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy entrypoint (from build context = project root)
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
