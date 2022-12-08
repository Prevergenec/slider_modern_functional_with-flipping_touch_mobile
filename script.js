'use strict';

window.addEventListener('DOMContentLoaded', () => {

  const slides = document.querySelectorAll('.offer__slide'),
		slider = document.querySelector('.offer__slider'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		total = document.querySelector('#total'),
		current = document.querySelector('#current'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slide-inner'),
		width = window.getComputedStyle(slidesWrapper).width;

  let slideIndex = 1,
	  offset = 0,
	  touchStartCoords =  {'x':-1, 'y':-1},
	  touchEndCoords = {'x':-1, 'y':-1},
	  direction = 'undefined',
	  minDistanceXAxis = 50,
	  maxDistanceYAxis = 150,
	  maxAllowedTime = 1000,
	  startTime = 0,
	  startTransition = 'all 0.5s ease 0s',
	  startPos = 0,
	  startOffset = 0,
	  currentPos = 0,
	  sliderOffset = 0,
	  elapsedTime = 0;

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';
  
  slidesWrapper.style.overflow = 'hidden';
  
  slides.forEach(slide => {
	slide.style.width = width;
  });
  
  slider.style.position = 'relative';
  
  const indicators = document.createElement('ol'),
		dots = [];
  indicators.classList.add('carousel-indicators');
  slider.append(indicators);
  
  for (let i = 0; i < slides.length; i++) {
	const dot = document.createElement('li');
	
	dot.setAttribute('data-slide-to', i + 1);
	dot.classList.add('dot');
	
	if (i == 0) {
		dot.style.opacity = 1;
	}
  
	indicators.append(dot);
	dots.push(dot);
  }
  
  if (slides.length < 10) {
	total.textContent = `0${slides.length}`;
	current.textContent = `0${slideIndex}`;
  } else {
	total.textContent = slides.length;
	current.textContent = slideIndex;
  }

  next.addEventListener('click', () => {
	if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
		offset = 0;
	} else {
		offset += +width.slice(0, width.length - 2);
	}
  
	slidesField.style.transform = `translateX(-${offset}px)`;
	
	if (slideIndex == slides.length) {
		slideIndex = 1;
	} else {
		slideIndex++;
	}
	
	if (slides.length < 10) {
		current.textContent = `0${slideIndex}`;
	} else {
		current.textContent = slideIndex;
	}
	
	dots.forEach(dot => dot.style.opacity = '.5');
	dots[slideIndex - 1].style.opacity = 1;
	if(!sliderover){
	  clearInterval(myTimer);
	  myTimer = setInterval(autoplay, timerSpeed);
	}
  });
  
  prev.addEventListener('click', () => {
	if (offset == 0) {
		offset = +width.slice(0, width.length - 2) * (slides.length - 1);
	} else {
		offset -= +width.slice(0, width.length - 2);
	}
  
	slidesField.style.transform = `translateX(-${offset}px)`;
	
	if (slideIndex == 1) {
		slideIndex = slides.length;
	} else {
		slideIndex--;
	}
	
	if (slides.length < 10) {
		current.textContent = `0${slideIndex}`;
	} else {
		current.textContent = slideIndex;
	}
	
	dots.forEach(dot => dot.style.opacity = '.5');
	dots[slideIndex - 1].style.opacity = 1;
	if(!sliderover){
	  clearInterval(myTimer);
	  myTimer = setInterval(autoplay, timerSpeed);
	}
  });
  
  dots.forEach(dot => {
	dot.addEventListener('click', (e) => {
		const slideTo = e.target.getAttribute('data-slide-to');
		
		slideIndex = slideTo;
		offset = +width.slice(0, width.length - 2) * (slideTo - 1);
		slidesField.style.transform = `translateX(-${offset}px)`;
		
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
		
		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
		if(!sliderover){
		  clearInterval(myTimer);
		  myTimer = setInterval(autoplay, timerSpeed);
		}
	});
  });
  
  
	function autoplay() {if(ap){next.click();}}

	var ap = true,
		timerSpeed = 2000,
		myTimer = setInterval(autoplay, timerSpeed),
		sliderover = false;

	addMultipleListeners(slidesWrapper, 'mouseenter mousemove', mEnter);
	function mEnter() {
	  sliderover = true;
	  clearInterval(myTimer);
	}
	slidesWrapper.addEventListener('mouseout', function(){
	  sliderover = false;
	  myTimer = setInterval(autoplay, timerSpeed);
	}) 



	function swipeStart(e) {
	  if(!e){
		e = window.event;
	  }
	  if('changedTouches' in e){
		e = e.changedTouches[0];
	  }
	  touchStartCoords = {'x':e.pageX, 'y':e.pageY};
	  startTime = new Date().getTime();
	  startPos = touchStartCoords['x'];
	  startOffset = new WebKitCSSMatrix(window.getComputedStyle(slidesField).transform)['e'];
	}
	
	function swipeMove(e) {
	  if (startTime !== 0){
		  if(!e){
			e = window.event;
		  }
		  if('changedTouches' in e){
			e = e.changedTouches[0];
		  }
		  currentPos = e.pageX;
		  sliderOffset = startOffset - ((startPos - currentPos)/1.5);
		  slidesField.style.transition = '';
		  slidesField.style.transform = 'translateX('+sliderOffset+'px)';
	  }
	}

	function swipeEnd(e) {
	  slidesField.style.transition = startTransition;
	  if(!e){
		e = window.event;
	  }
	  if('changedTouches' in e){
		e = e.changedTouches[0];
	  }
	  touchEndCoords = {'x':e.pageX - touchStartCoords.x, 'y':e.pageY - touchStartCoords.y};
	  elapsedTime = new Date().getTime() - startTime;
	  if (elapsedTime <= maxAllowedTime){
		if (Math.abs(touchEndCoords.x) >= minDistanceXAxis && Math.abs(touchEndCoords.y) <= maxDistanceYAxis){
		  direction = (touchEndCoords.x < 0)? 'left' : 'right';
		  switch(direction){
			case 'left':
			  next.click();
			  break;
			case 'right':
			  prev.click();
			  break;
		  }
		}else{
		  slidesField.style.transform = 'translateX('+startOffset+'px)';
		}
	  }else if(elapsedTime < 1000000){
			slidesField.style.transform = 'translateX('+startOffset+'px)';
	  }
	  startTime = 0;
	}

	function addMultipleListeners(el, s, fn) {
	  var evts = s.split(' ');
	  for (var i=0, iLen=evts.length; i<iLen; i++) {
		el.addEventListener(evts[i], fn, false);
	  }
	}

	addMultipleListeners(slidesWrapper, 'mousedown touchstart', swipeStart);
	addMultipleListeners(slidesWrapper, 'mousemove touchmove', swipeMove);
	addMultipleListeners(slidesWrapper, 'mouseup mouseout touchend', swipeEnd);
});
