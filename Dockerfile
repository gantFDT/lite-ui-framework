FROM openresty/openresty:1.13.6.1-2-centos

WORKDIR "/opt/gant"

COPY .openresty/nginx/conf /usr/local/openresty/nginx/conf

COPY dist/ ./
