$PHONY: default build serve

default: build serve
build:
	npm run build
serve:
	python -m SimpleHTTPServer 8000

