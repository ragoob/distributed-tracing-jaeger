cd ../tracer-lib && npm run build
cd ../catalog-service && npm run build
cd ../bin && docker-compose up -d --build