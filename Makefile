images=$(shell docker image ls -aq)

elk_net=$(shell docker network ls -qf name="elk_net")

volumes=$(shell docker volume ls -q)

all: build

create_net:
	if [ -n "$(elk_net)" ];\
		then echo "Network elk_net already exists";\
	else\
		docker network create elk_net;\
	fi

build: create_net
	docker-compose -f docker-compose.yml build

up: build
	docker-compose -f docker-compose.yml up

down:
	docker-compose -f docker-compose.yml down

ELK: create_net
	docker-compose -f ./ELK/docker-compose.yml up

ELK_down:
	docker-compose -f ./ELK/docker-compose.yml down

delete_images:
	if [ -n "$(images)" ];\
		then docker rmi -f $(images);\
	else\
		echo "No images to delete";\
	fi

delete_volumes:
	if [ -n "$(volumes)" ]; then\
		docker volume rm $(volumes);\
	fi

fclean: down ELK_down delete_images delete_volumes
	rm -rf ELK/postgres/logs/*; \
	docker system prune -a --force

.PHONY: all build up down delete_images fclean ELK ELK_down create_net

.SILENT: all build up down delete_images fclean create_net ELK ELK_down delete_volumes
