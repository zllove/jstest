/**
 * panel example
 * @date 2012/11/30
 */
$(function() {
	loadTheme();

	var tips = new Neter.Tips({
		container: Math.random() > 0.5 ? $('#container') : $(document.body),
		msg		 : 'loading...'
	}).render().show('aside', true);

	setTimeout(function(){
		tips.hide();
	}, 1000);

	var panel = new Neter.Panel({
		container  : $('#login'),
		bodies 	   : [{
			tag    : '邮箱账号登录',
			content: $('#account')
		}, {
			tag    : '手机号登录',
			content: 'mobile phone'
		}]
	}).render();

	panel.insert(1, {
		tag     : 'default',
		content : 'custom'
	});

	panel.update(1, {
		tag     : 'Google搜索',
		content : '搜索结果'
	});

	setTimeout(function(){
		tips.update('2 seconds then delete the second tab!').show('warning');
		panel.remove(1);
	}, 2000)

	// delegate events page
	$(document).delegate('#autoLoginOptions', 'click', function(){
		this.checked && tips.update('The last two weeks will be auto logged in').show('success');
	}).delegate('#loginBtn', 'click', function(){
		$(document.body).fadeOut('slow', function(){
			location.href = 'main.html';
		});
	}).delegate('#regBtn', 'click', function(){
		tips.update('System is in repair ,Try again later !').show('warning');
	});


});

/**
 * loadTheme background img
 * @return {undefined} undefined
 */
function loadTheme () {
	var theme = [
			'http://mimg.127.net/index/163/themes/121122_thanksgiving_cnt1.jpg',
			'http://mimg.127.net/index/163/themes/121122_thanksgiving_cnt2.jpg',
			'http://mimg.127.net/index/163/themes/121122_thanksgiving_cnt3.jpg',
			'http://mimg.127.net/index/163/themes/121122_thanksgiving_cnt4.jpg'
		],
		current = theme[Math.floor(Math.random() * 100 % theme.length)];

	$('#center').css('background', 'url(http://mimg.127.net/index/163/themes/121121_thanksgiving_bg.jpg) 0 0 repeat-x');
	// $('#container').css('background', 'url(resources/images/' + current + ' 0 0 no-repeat');
	$('#container').css('background', 'url(' + current + ') 0 0 no-repeat');
}