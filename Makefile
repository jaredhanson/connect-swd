NODE = node
TEST = vows
TESTS ?= test/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/connect-swd/*.js
	dox \
		--title connect-swd \
		--desc "Simple Web Discovery (SWD) middleware for Connect" \
		$(shell find lib/connect-swd/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
