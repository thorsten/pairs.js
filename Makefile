submodules:
	git submodule update --init --recursive

install: submodules symlink_js
	npm install less
	npm install uglifyjs

symlink_js:
	ln -s vendor/backbone.js/backbone-min.js src/public/js/libs/backbone-min.js
	ln -s vendor/underscore.js/underscore-min.js src/public/js/libs/underscore-min.js
	ln -s vendor/Socket.IO/socket.io.js src/public/js/libs/socket.io.js
	ln -s vendor/Socket.IO/lib/vendor/web-socket-js/WebSocketMain.swf src/public/js/libs/WebSocketMain.swf

#
# BUILD SIMPLE BOOTSTRAP DIRECTORY
# lessc & uglifyjs are required
#

bootstrap:
	./node_modules/.bin/lessc ./src/public/less/style.less > src/public/css/style.css
	cat ./vendor/bootstrap/js/bootstrap-transition.js ./vendor/bootstrap/js/bootstrap-alert.js ./vendor/bootstrap/js/bootstrap-button.js ./vendor/bootstrap/js/bootstrap-carousel.js ./vendor/bootstrap/js/bootstrap-collapse.js ./vendor/bootstrap/js/bootstrap-dropdown.js ./vendor/bootstrap/js/bootstrap-modal.js ./vendor/bootstrap/js/bootstrap-tooltip.js ./vendor/bootstrap/js/bootstrap-popover.js ./vendor/bootstrap/js/bootstrap-scrollspy.js ./vendor/bootstrap/js/bootstrap-tab.js ./vendor/bootstrap/js/bootstrap-typeahead.js > ./src/public/js/libs/bootstrap.js
	./node_modules/.bin/uglifyjs -nc src/public/js/libs/bootstrap.js > src/public/js/libs/bootstrap.min.js
