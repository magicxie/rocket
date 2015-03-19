(function($){
	


	var fsBox = $('.frames'),
		fs = fsBox.children('iframe'),
		tm = $('#titleMask'),
		cfs = $('#cancelFS');


	var socket = io();

	//events
	socket.on('page',function(data){
		var t = fs.eq(data.idx);
		close();
		setFocus(t);

		showMask(data.idx);


	});

	socket.on('fullscreen',function(data){
		open(data.idx);
		hideMask();
	});

	socket.on('closefullscreen',function(data){
		close(data.idx);
		showMask(data.idx);
	});

	//to ppt home
	socket.on('toppt',function(data){
		location = '/ppt';
	});

	////////////////////////////////////////////////////////

	fsBox.delegate('iframe', 'mouseenter',function(e){
		var t = $(this);
		setFocus(t);
		if(!t.is('.full-screen')){
			showMask(t.index());
			
		}
	});

	tm.on('click',function(e){
		var idx = $(this).data('idx');
		open(idx);
		hideMask();
	});

	cfs.on('click',function(e){
		e.preventDefault();
		close();
	});

	function setFocus(t){
		fs.removeClass('focus');//.removeClass('full-screen')
		t.addClass('focus');
	}

	function showMask(idx){
		var css = {};
		switch(idx){
			case 0: css = { left: 0, top: 0 }; break;
			case 1: css = { right: 0, top: 0 }; break;
			case 2: css = { left: 0, bottom: 0 }; break;
			case 3: css = { right: 0, bottom: 0 }; break;
		}
		tm.data('idx',idx).removeAttr('style').css(css).fadeIn(800);
	}

	function hideMask(){
		tm.fadeOut(100);
	}

	// function fullScreen(){
	// 	document.documentElement.webkitRequestFullScreen();
	// }

	// function cancelFullScreen(){
	// 	document.webkitCancelFullScreen();
	// }

	// $(document).on('click',fullScreen);

	function open(idx){
		fs.removeClass('full-screen');
		fs.eq(idx).addClass('full-screen');
		showExitBtn(idx);
	}

	function close(){
		$('.full-screen').removeClass('full-screen');
		cfs.hide();
	}

	function showExitBtn(idx){
		var css = {};
		switch(idx){
			case 0: css = { left: 50, top: 50 }; break;
			case 1: css = { right: 50, top: 50 }; break;
			case 2: css = { left: 50, bottom: 50 }; break;
			case 3: css = { right: 50, bottom: 50 }; break;
		}
		cfs.removeAttr('style').css(css).fadeIn();
	}


	// m_index 
	// 
	
	var gIdx = 0;
	$('.page').on('touchend',function(e){
		e.preventDefault();
		var t = $(this),
			idx = parseInt(t.text()) - 1;

		gIdx = idx;
		// showMask(idx);
		socket.emit('page',{idx: idx});
	});

	$('#fullscreenBtn').on('touchend',function(e){
		e.preventDefault();

		socket.emit('fullscreen',{idx: gIdx});
	});

	$('#closeFullscreenBtn').on('touchend',function(e){
		e.preventDefault();

		socket.emit('closefullscreen',{idx: gIdx});
	});

	$('#topptBtn').on('touchend',function(e){
		e.preventDefault();

		socket.emit('toppt',{});
	});
	
})(jQuery);