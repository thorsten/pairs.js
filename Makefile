submodules:
	git submodule update --init --recursive

install: submodules symlink_js
	npm bundle

symlink_js:
	ln -f -s ../../../vendor/backbone.js/backbone-min.js src/public/js/
	ln -f -s ../../../vendor/underscore.js/underscore-min.js src/public/js/
	ln -f -s ../../../vendor/Socket.IO/socket.io.js src/public/js/
	ln -f -s ../../../vendor/Socket.IO/lib/vendor/web-socket-js/WebSocketMain.swf src/public/js/
