#!/bin/bash

echo "Testing shop page..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/shop

echo "Testing recipes page..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/recipes

echo "Done testing!" 