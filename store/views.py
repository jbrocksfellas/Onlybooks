from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import json
import datetime
from .models import * 
from .utils import cookieCart, cartData, guestOrder, accountData
from .utils2 import cookieCart2, cartData2, guestOrder2
from django.core.paginator import Paginator
from django.db.models import Q

def dj(request):
	qs = Product.objects.all().values("id")

	lists = list(qs)
	data = json.dumps(lists)
	key = []
	for l in lists:
		key.append(l["id"])
	print(key)
	return HttpResponse(key)

def bagItem(request):
	user = request.user	
	data = json.loads(request.body)
	productId = data['productId']
	action = data['action']
	print('Action:', action)
	print('Product:', productId)

	product = Product.objects.get(id=productId)
	

	if action == 'add':		
		myAccount, created = MyAccount.objects.get_or_create(user=user, product=product)
		
	elif action == 'remove':		
		MyAccount.objects.get(user=user, product=product).delete()

	myAccount.save()

	return JsonResponse('Item was added', safe=False)


def bag(request):

	data = cartData(request)
	items = data['items']
	context = {'items':items}
	return render(request, 'store/bag.html', context)

def home(request):
	print("path", request.path)
	genres = Genre.objects.all()
	context = {'genres':genres}
	return render(request, 'store/home.html', context)

def store(request):
	print("path", request.path)
	# items = []
	data = cartData(request)
	items = data['items']

	color1 = "#fc0303"
	color2 = "grey"
	
	products = Product.objects.all()
	genres = Genre.objects.all()
	
	context = {'genres':genres, 'items':items, 'color1':color1, 'color2':color2}
	return render(request, 'store/store.html', context)

def search(request):
	print("path", request.path)
	# items = []
	data = cartData(request)
	bookedItems = data['items']
	color1 = "red"
	color2 = "grey"
	if 'query' in request.GET and request.GET['query']:
		page = request.GET.get('page', 1)
		query = request.GET['query']
		print(query.upper())
		items = Product.objects.filter(Q(name__icontains=query) | Q(writer__icontains=query) | Q(content__icontains=query))
		try:
			genresrch = Genre.objects.get(name=query.upper())
			genre = genresrch.product_set.all()
		except:
			genre = Genre.objects.none()
		
		
		items = items.union(genre)
		
		print(items)
		paginator = Paginator(items, 9)
		page_number = request.GET.get('page')
		page_obj = paginator.get_page(page_number)

		context = {'bookedItems':bookedItems,'query':query,'page_obj':page_obj, 'color1':color1, 'color2':color2}
		return render(request, 'store/search.html', context)
	else:
		return render(request, 'store/search.html')

def genreListView(request, genre):
	print("path", request.path)
	# items = []
	data = cartData(request)
	items = data['items']
	
	color1 = "red"
	color2 = "grey"
	genres = Genre.objects.all()
	products = Product.objects.all()

	genre = genre.upper()
	genre = Genre.objects.get(name=genre)
	id = genre.pk
	data = Product.objects.filter(genre=id)
	paginator = Paginator(data, 6)
	page_number = request.GET.get('page')
	page_obj = paginator.get_page(page_number)
	context = {'genres':genres,'page_obj':page_obj, 'genre': genre, 'items':items, 'color1':color1, 'color2':color2}
	return render(request, 'store/genre.html', context)

def detailView(request, id):

	data = cartData(request)
	items = data['items']
	context = {'items':items}
	# user = request.user
	color1 = "red"
	color2 = "grey"
	# bol = user.myaccount_set.all()
	product = Product.objects.get(id=id)
	genres = Genre.objects.all()

	# genre = genre.upper()
	# genre = Genre.objects.get(name=genre)
	# id = genre.pk
	# data = Product.objects.filter(genre=id)
	# paginator = Paginator(data, 1)
	# page_number = request.GET.get('page')
	# page_obj = paginator.get_page(page_number)
	# context = {'page_obj':page_obj, 'genre': genre, 'bol':bol, 'color1':color1, 'color2':color2}

	context = {'genres':genres, 'product':product}
	return render(request, 'store/detail.html', context)


def cart(request):
	data = cartData2(request)

	cartItems = data['cartItems']
	order = data['order']
	items = data['items']

	context = {'items':items, 'order':order, 'cartItems':cartItems}
	return render(request, 'store/cart.html', context)

def checkout(request):
	data = cartData2(request)
	
	cartItems = data['cartItems']
	order = data['order']
	items = data['items']

	context = {'items':items, 'order':order, 'cartItems':cartItems}
	return render(request, 'store/checkout.html', context)

def updateItem(request):
	data = json.loads(request.body)
	productId = data['productId']
	action = data['action']
	print('Action:', action)
	print('Product:', productId)

	customer = request.user.customer
	product = Product.objects.get(id=productId)
	order, created = Order.objects.get_or_create(customer=customer, complete=False)

	orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

	if action == 'add':
		orderItem.quantity = (orderItem.quantity + 1)
	elif action == 'remove':
		orderItem.quantity = (orderItem.quantity - 1)

	orderItem.save()

	if orderItem.quantity <= 0:
		orderItem.delete()

	return JsonResponse('Item was added', safe=False)

def processOrder(request):
	transaction_id = datetime.datetime.now().timestamp()
	data = json.loads(request.body)

	if request.user.is_authenticated:
		customer = request.user.customer
		order, created = Order.objects.get_or_create(customer=customer, complete=False)
	else:
		customer, order = guestOrder(request, data)

	total = float(data['form']['total'])
	order.transaction_id = transaction_id

	if total == order.get_cart_total:
		order.complete = True
	order.save()

	if order.shipping == True:
		ShippingAddress.objects.create(
		customer=customer,
		order=order,
		address=data['shipping']['address'],
		city=data['shipping']['city'],
		state=data['shipping']['state'],
		zipcode=data['shipping']['zipcode'],
		)

	return JsonResponse('Payment submitted..', safe=False)

def quiz(request):
	return render(request, 'store/quiz.html')

def result(request):
	return render(request, 'store/result.html')