TOP_DIR = ../..
DEPLOY_RUNTIME ?= /kb/runtime
TARGET ?= /kb/deployment

include $(TOP_DIR)/tools/Makefile.common
TESTS = $(wildcard tests/*.t)

WD = $(shell pwd)

JARFILE = $(WD)/dist/lib/kbapi_common.jar

all: jar

what:
	echo $(JAVA_SRC)
	echo $(JAVA_CLASS)
	echo $(JAVA_CLASS_ALL)

bin: 

jar: 
	ant -Djar_file=$(JARFILE) -Dkb_top=$(KB_TOP) dist

deploy: deploy-client
deploy-service: deploy-client
deploy-client: deploy-libs  deploy-java

deploy-java: jar
	cp $(JARFILE) $(TARGET)/lib

test:
	for t in $(TESTS) ; do \
		$(DEPLOY_RUNTIME)/bin/perl $$t ; \
		if [ $$? -ne 0 ] ; then \
			exit 1 ; \
		fi \
	done

clean:
	ant clean

include $(TOP_DIR)/tools/Makefile.common.rules
