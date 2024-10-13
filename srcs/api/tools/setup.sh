#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Apply migrations
python3 manage.py makemigrations users authentication
python3 manage.py migrate


python3 manage.py shell < tools/create_superuser.py

python manage.py runserver 0.0.0.0:8000