
(function(){

	function Cursor(){
		var me = this;

		me.size = 14;
		me.timeout = 150;
		me.initTransition = 'all ' + me.timeout + 'ms ease-in-out';
		me.position = { x: 0, y: 0 };

		me.point = window.document.getElementById('mocha-mouse-pointer');

		if (!me.point) {
			var point = me.point = document.createElement('div');

			point.id = 'mocha-mouse-pointer';
			point.style.boxSizing =
				point.style.MozBoxSizing =
				point.style.MsBoxSizing =
				point.style.WebkitBoxSizing = 'border-box';

			point.style.top = me.position.y + 'px';
			point.style.left = me.position.x + 'px';
			point.style.width = me.size + 'px';
			point.style.zIndex = '90000';
			point.style.height = me.size + 'px';
			point.style.border = '2px solid #ffffff';
			point.style.opacity = '1';
			point.style.position = 'absolute';
			point.style.transform = '';
			point.style.transition = me.initTransition;
			point.style.borderRadius = '0 ' + me.size / 2 + 'px ' + me.size / 2 + 'px ' + me.size / 2 + 'px';
			point.style.backgroundColor = '#ee3300';

			window.document.body.appendChild(me.point);
			me.bindEvents();
		}
	}

	var proto = Cursor.prototype;

	proto.bindEvents = function(){
		var me = this;

		window.addEventListener('mousemove', function( event ){
			me.moveTo(event.clientX + 1, event.clientY + 1);
		});

		window.addEventListener('mousedown', function( event ){
			me.down(event.clientX + 1, event.clientY + 1, event.button);
		});

		window.addEventListener('mouseup', function( event ){
			me.up(event.clientX + 1, event.clientY + 1);
		});

		window.addEventListener('click', function( event ){
			console.log(event);
			me.click(event.clientX + 1, event.clientY + 1, event.button);
		});
		window.addEventListener('dblclick', function( event ){
			console.log(event);
			me.dblclick(event.clientX + 1, event.clientY + 1, event.button);
		});
	};

	proto.moveTo = function(x, y, callback){
		var me = this,
			point = me.point;

		point.style.top = y + 'px';
		point.style.left = x + 'px';
		setTimeout(function () {
			callback && callback(null);
		}, me.timeout);
	};

	proto.down = function(x, y, button, callback){
		var me = this,
			colors = ['#ee3300', '#00ee33', '#3300ee'],
			color = colors[button],
			point = me.point;

		me.moveTo(x, y, function(){
			point.style.transition = 'all 50ms ease-in-out';
			point.style.transform = 'scale(0.5)';
			point.style.backgroundColor = color;
			setTimeout(function () {
				point.style.transition = me.initTransition;
				callback && callback(null);
			}, 50);
		});
	};

	proto.up = function(x, y, callback){
		var me = this,
			point = me.point;
		point.style.transition = 'all 50ms ease-in-out';
		point.style.transform = 'scale(1)';
		point.style.backgroundColor = '#ee3300';
		setTimeout(function () {
			point.style.transition = me.initTransition;
			point.style.transform = '';
			callback && callback(null);
		}, 50);
	};

	proto.click = function(x, y, button){
		var me = this;
		me.down(x, y, button, function(){
			me.up(x, y);
		});
	};

	proto.dblclick = function(x, y, button){
		var me = this;
		me.down(x, y, button, function(){
			me.up(x, y, function(){
				me.down(x, y, button, function(){
					me.up(x, y);
				});
			});
		});
	};

	//console.log("Use MochaUI");



	window.MochaUI = window.MochaUI || {};
	if( !MochaUI.cursor ){
		MochaUI.cursor = new Cursor();
	};

})();