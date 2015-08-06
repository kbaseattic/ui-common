PACKAGE  = ui-common
TOPDIR   = $(PWD)
DISTLIB  = $(TOPDIR)/build
DOCSLIB  = $(TOPDIR)/docs
TARGET   = prod
CONFIG   = source/config/$(TARGET).yml

all:
	test deploy docs

init:
	@bower install
	@npm install
	@mkdir -p $(DISTLIB)
	@cp -r $(CONFIG) $(DISTLIB)/config.yml

default: init
	@ git submodule init
	@ git submodule update
	@ grunt build
	
deploy:
	@ echo "This Makefile is deprecated for deployment, please see README.deploy."

test: init
	@ grunt test

clean:
	@ rm -rf $(DISTLIB)

dist-clean: clean
	@ rm -rf node_modules/
	@ rm -rf bower_components/

docs: init
	@echo docs!

.PHONY: all