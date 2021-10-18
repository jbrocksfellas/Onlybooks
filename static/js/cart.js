// document.getElementById('query').submit();

var delBtn = document.querySelectorAll('.del-btn')

for (i = 0; i < delBtn.length; i++) {
	delBtn[i].addEventListener('click', function(){
		var productId = this.dataset.product
		var action = this.dataset.action

		console.log('productId:', productId, 'Action:', action)
		console.log('USER:', user)
		this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode);
		if (user == 'AnonymousUser'){
			removeCookieItem(productId, action)
		}else{
			updateUserBook(productId, action)
		}

	})
}

var updateBtns = document.querySelectorAll('.heart')

for (i = 0; i < updateBtns.length; i++) {
	updateBtns[i].addEventListener('click', function(){
		var productId = this.dataset.product	
		
		if(user == 'AnonymousUser'){

			if(this.style.cssText == "--background-color: #fc0303;"){
				this.style.cssText = "--background-color: grey"
				// this.style.cssText = "--heart : 10px;";
				var action = "remove"	
				
			}else{
				
				this.style.cssText = "--background-color: #fc0303;"
				// this.style.cssText = "--heart : 12px;";
				var action = "add"
			}
				
		
		}else{

			if(this.style.cssText == "--background-color: #fc0303;"){
				this.style.cssText = "--background-color: grey;"
				var action = "remove"
			}else{
				
				this.style.cssText = "--background-color: #fc0303;"
				var action = "add"
			}
			
		}

		console.log('productId:', productId, 'Action:', action)
		console.log('USER:', user)
		
		console.log('clicked')

		if (user == 'AnonymousUser'){
			addCookieItem(productId, action)
		}else{
			updateUserBook(productId, action)
		}
	})
}

function removeCookieItem(productId, action){
	console.log('User is not authenticated')
	delete cart[productId];
	console.log('CART:', cart)
	document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"
	console.log('Item should be deleted')
}

function updateUserBook(productId, action){
	console.log('User is authenticated, sending data...')

	

		var url = '/bagItem/'

		fetch(url, {
			method:'POST',
			headers:{
				'Content-Type':'application/json',
				'X-CSRFToken':csrftoken,
			}, 
			body:JSON.stringify({'productId':productId, 'action':action})
		})
		.then(response => response.json())
		.then(data => console.log(data));
}

function addCookieItem(productId, action){
	console.log('User is not authenticated')

	if (action == 'add'){
		if (cart[productId] == undefined){
		cart[productId] = {'quantity':1}

		}else{
			cart[productId]['quantity'] += 1
		}
	}

	if (action == 'remove'){
		delete cart[productId];
	}

	

	console.log('CART:', cart)
	document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"
	
	// location.reload()
}


// Buy

var updateBuyBtns = document.getElementsByClassName('update-buy-cart');
// console.log(updateBuyBtns)
for (i = 0; i < updateBuyBtns.length; i++) {
	
	updateBuyBtns[i].addEventListener('click', function(){
		var j = this.parentNode.parentNode.childNodes[1];
		var k = this.parentNode.parentNode.parentNode.childNodes[3].childNodes[1];
		console.log(k)
		var productId = this.dataset.product
		var action = this.dataset.action
		console.log('productId:', productId, 'Action:', action)
		console.log('USER:', user)

		if (user == 'AnonymousUser'){
			// addCookieItem2(productId, action)
			
		}else{
			
			updateUserOrder(productId, action, j, k)
		}
	})
}

var totalItems = document.querySelector('strong.totalItems');
var totalPrice = document.querySelector('strong.totalPrice');
var checkout = document.querySelector('.checkout-btn');

// console.log(totalItems)
// console.log(totalPrice.textContent)



function updateUserOrder(productId, action, j, k){

	
	if(j){
		
		
		if(action == "add"){
			
			j.textContent = Number(j.textContent) + 1;
			console.log(k.textContent.slice(3))
			 
			
			if(totalItems){
				
				totalItems.textContent = Number(totalItems.textContent) + 1;
				totalPrice.textContent = (parseFloat(totalPrice.textContent) + parseFloat(k.textContent)).toFixed(2);
				
				
			}
			
			
	
		}
		else{
			if(Number(totalItems.textContent) == 1){
				checkout.setAttribute("style", "visibility: hidden")
			}
			if(Number(j.textContent) == 1){
				j.parentNode.parentNode.parentNode.removeChild(j.parentNode.parentNode);
				if(totalItems){
					
					totalItems.textContent = Number(totalItems.textContent) - 1;
					totalPrice.textContent = (parseFloat(totalPrice.textContent) - parseFloat(k.textContent)).toFixed(2);
					
				}
			}
			else{
				j.textContent = Number(j.textContent) - 1;
				if(totalItems){
					totalItems.textContent = Number(totalItems.textContent) - 1;
					totalPrice.textContent = (parseFloat(totalPrice.textContent) - parseFloat(k.textContent)).toFixed(2);
				}
			}
			
		}

	}
	

	console.log('User is authenticated, sending data...')

		var url = '/update_item/'
		params = {
			method:'POST',
			headers:{
				'Content-Type':'application/json',
				'X-CSRFToken':csrftoken,
			}, 
			body:JSON.stringify({'productId':productId, 'action':action})
		}

		fetch(url, params)
		.then((response) => {
		   return response.json();
		})
		.then((data) => {
			// location.reload()
			console.log(data)
		});
}

function addCookieItem2(productId, action){
	console.log('User is not authenticated')

	if (action == 'add'){
		if (cart[productId] == undefined){
		cart[productId] = {'quantity':1}

		}else{
			cart[productId]['quantity'] += 1
		}
	}

	if (action == 'remove'){
		cart[productId]['quantity'] -= 1

		if (cart[productId]['quantity'] <= 0){
			console.log('Item should be deleted')
			delete cart[productId];
		}
	}
	console.log('CART:', cart)
	document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"
	
	location.reload()
}



const navSlide = () => {
	const burger = document.querySelector('.burger');
	const nav = document.querySelector('.nav-links');
	const navLinks = document.querySelectorAll('.nav-links li');
	const panelLinks = document.querySelectorAll('.panel-links div button');
	const dropdownDiv1 = document.querySelector('.dropdown-div1');
	const dropdownDiv2 = document.querySelector('.dropdown-div2');
	// const srchDiv = document.querySelector('.srchgen');
	const mainContainer = document.querySelector('.main-container');
	const wtrBtn = document.querySelectorAll('.wtr-btn > button');
	const belowNav = document.querySelector('.below-nav');

	// wtrBtn.forEach((btn, index) => {
	// 	btn.addEventListener('click', ()=>{
	// 		// btn.classList.toggle('active-wtr')
	// 		if(btn.style.backgroundColor == "red"){
	// 			btn.style.backgroundColor = "rgb(0, 100, 0)";
	// 		}else{
	// 			btn.style.backgroundColor = "red";
	// 		}
			
	// 		console.log('clicked')
	// 	})
	// });
	

	burger.addEventListener('click', ()=>{
		nav.classList.toggle('nav-active');
		nav.classList.toggle('changez-index');
		console.log(belowNav)
		
		if(belowNav){
			dropdownDiv2.classList.remove('dropdown-active')
			dropdownDiv1.classList.remove('dropdown-active')
		}
		
		

		navLinks.forEach((link, index) => {
			// link.style.animation = 'navLinkFade 0.5s ease forwards .5s'
			if (link.style.animation) {
				link.style.animation = '';

			} else {
				link.style.animation = `navLinkFade 0.5s ease forwards ${index / 50 + 0.1}s`;
			}
		
		});
		burger.classList.toggle('toggle');
		

	});
	
	
	
	panelLinks.forEach((panel, index) => {
		panel.addEventListener('click', ()=>{

			
			if(panel.classList.contains('panel-active')){

				if(panel.className == 'but2 panel-active'){
				
					dropdownDiv1.classList.toggle('dropdown-active')
					
					
				} else if(panel.className == 'but3 panel-active') {
					dropdownDiv2.classList.toggle('dropdown-active')
					
				}
				
			} else{
				for(i=0; i<panelLinks.length; i++){
					panelLinks[i].classList.remove('panel-active')
				}
				panel.classList.add('panel-active')
				
				if(panel.className == 'but2 panel-active'){
					
					dropdownDiv2.classList.remove('dropdown-active')
					dropdownDiv1.classList.toggle('dropdown-active')
					
					
				} else if(panel.className == 'but3 panel-active') {
					dropdownDiv1.classList.remove('dropdown-active')
					dropdownDiv2.classList.toggle('dropdown-active')
					
				}

				
			}
			// panel.classList.toggle('panel-active')
			
		});
		
	});
	// console.log(srchDiv)
	// if(srchDiv != "null"){
	// 	srchDiv.addEventListener('click', (event)=>{
	// 	panelLinks.forEach((panel, index) => {
	// 		panel.classList.remove('panel-active')
	// 	})
		
	// 	console.log(event.clientX, event.clientY)
	// })

	// }
	// console.log(belowNav)
	if(belowNav){
		belowNav.addEventListener('click', ()=>{
			if(dropdownDiv1.classList.contains('dropdown-active') || dropdownDiv2.classList.contains('dropdown-active')){
	
			}else {
				panelLinks.forEach((panel, index) => {
					panel.classList.remove('panel-active')
				})
			}
			
		})

	}
	

	

	

}

navSlide();

// $(function () {
// 	$('[data-toggle="popover"]').popover()
//   })

const input =  document.querySelectorAll('input.inputoptions');
const inputs = document.querySelectorAll('p.inputs');
const next = document.querySelector('.next')
const question = document.querySelector('.question');
const total = document.getElementById('total')

function instant(){
	const Questions = [
		{
			question:"Who is the author of the book 'On Fire' ?",
		
			options:{
				a:"Sachin Tendulkar",
				b:"Virat Kohli",
				c:"Ben Stokes",
				d:"Rohit Sharma"
			},
			correctAnswer:"c"
		},
		{
			question:"Who is the writer of the book '2 States' ?",
		
			options:{
				a:"Chetan Bhagat",
				b:"Amit singh",
				c:"Gulzaar",
				d:"Harsh Beniwal"
			},
			correctAnswer:"a"
		},
		{
			question:"How many chapaters are their in 'Think and Grow Rich' by Napolean hill ?",
		
			options:{
				a:"9",
				b:"13",
				c:"10",
				d:"15"
			},
			correctAnswer:"d"
		}
		
		
		]
		
		var i = 0;
		var score = 0;
		
		function Ques(question, options, correct) {
			this.question = question;
			this.options = options;
			this.a = this.options.a;
			this.b = this.options.b;
			this.c = this.options.c;
			this.d = this.options.d;
			this.correct = correct;
		} 
		
		render(i);
		
		function render(i){
			var current = new Ques(Questions[i].question, Questions[i].options, Questions[i].correctAnswer);
			question.innerHTML = 'Q' + '<sub>' + (i+1) + '</sub>' + " " + ':' + " " + current.question;
			inputs[0].textContent = " " + current.a
			inputs[1].textContent = " " + current.b
			inputs[2].textContent = " " + current.c
			inputs[3].textContent = " " + current.d
		}
		
		var handler = function(){
			let val = validation();
			if(val){
				changeNext(i)
				if(i<Questions.length - 1){
					addScore(i)
					i+=1
					render(i);
					removeCheck(i);
		
				}else{
					addScore(i);
					next.removeEventListener('click', handler);
				}
		
				changeName(i)
		
			}
		
			
			
			
		}
		next.addEventListener('click', handler)
		
		
		function removeCheck(i){
			input.forEach((current)=>{
				current.checked = "";
			})
		}
		
		function changeNext(i){
			// console.log(i)
			if(i==Questions.length-1){
				next.type = "submit";
				next.textContent = "Submit";
				
			}
		}
		function changeName(i){
			if(i==Questions.length-1){
				
				next.textContent = "Submit";
				total.value = score;
				removeCheck(i)
			}
		}
		
		function addScore(i){
			for(let j=0; j<input.length; j++){
				if(input[j].checked){
					if(input[j].value == Questions[i].correctAnswer){
						score+=1;
					}
		
					
					
				}
		
			}
			console.log(score)
		}
		
		function validation(){
			let formValid = false;
			input.forEach((current)=>{
				if(current.checked){
					formValid = true;
				}
				
			})
			console.log(formValid)
			if(!formValid){
				alert('Must check some option!')
			}
			return formValid
		}
	
}

if(question){
	instant();
}

