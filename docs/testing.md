# Testing KBase UI code

A recent result is the incorporation of Jasmine as our JavaScript testing framework.

Outline
1. Tests are good! A unit testing framework is now available. Integration testing is more challenging but will come later.

2. Our framework http://jasmine.github.io/2.3/introduction.html:
    a. Jasmine as a testing framework
        i. Mostly declarative syntax, but you're still writing JS code.
        ii. Load modules for testing using RequireJS
          - example define(['kb.config'], function(Config){...});
        iii. Test suites should focus on one module.
          - example describe('KBase Config tests')
        iv. Individual test specs are just calls to the global it() function
          - it([string], function())
          - expect(...) (return true or false. can have multiple, but stylistically only one expect() per test)
          - examples of expect().toBeXXX
    b. Karma as test suite runner
        i. Controls loading up browsers
            - currently just PhantomJS, can also include others
        ii. Controls test environment
        iii. Runs all tests
        iv. Reports test coverage
            - locally reports as HTML. Explore it with
            - ```python -m SimpleHTTPServer 8000```
            - point browser to http://localhost:8000/build/test-coverage/html
    c. Grunt as a task manager
        i. ```grunt test``` will do the testing
    d. Makefile
        i. make && make test
        ii. make deploy non-functional
    e. Integration with Travis-CI and Coveralls
        i. On PR, automatically test and report coverage

3. Adding new tests
    a. Add missing modules
    b. Add missing files (karma.conf.js)

4. Modifying framework
    a. Adding different browsers
    b. Adding new dependencies (bower, npm)

