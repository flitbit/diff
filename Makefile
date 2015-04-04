UGLIFY ?= uglifyjs
DIST ?= releases
NPM ?= npm
VSN ?= debug
OUTPUT ?= $(DIST)/deep-diff-$(VSN).min.js

all: deps min

min:
	$(UGLIFY)	index.js \
		-o $(OUTPUT) \
		-r '$,require,exports,module,window,global' -m \
		--comments '/^!/'

deps:
	$(NPM) install

.PHONY: deps all
