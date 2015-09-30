PACKAGE  	   = ui-common
TOPDIR   	   = $(PWD)
DISTLIB  	   = $(TOPDIR)/build
DOCSLIB  	   = $(TOPDIR)/docs
TARGET   	   = prod
KBASE_CONFIG   = config/$(TARGET).yml
UI_CONFIG	   = config/ui.yml

all: init test

init:
	@bower install
	@npm install
	@mkdir -p $(DISTLIB)
	@cp $(KBASE_CONFIG) $(DISTLIB)/config.yml
	@cp $(UI_CONFIG) $(DISTLIB)/ui.yml

default: init
	@ git submodule init
	@ git submodule update
	@ grunt build
	
deploy:
	@ grunt deploy

test: init
	@ grunt test

clean:
	@ rm -rf $(DISTLIB)
	@ rm -rf coverage/

dist-clean: clean
	@ rm -rf node_modules/
	@ rm -rf bower_components/

docs: init
	@echo docs!

.PHONY: all