from django.urls import path

from . import views

urlpatterns = [
	#Leave as empty string for base url
	path('', views.home, name="home"),
	path('json', views.dj, name="json"),
	path('store', views.store, name="store"),
	path('search', views.search, name="search"),
	path('bag', views.bag, name="bag"),
	path('store/<int:id>', views.detailView, name="detail"),
	path('store/<str:genre>', views.genreListView, name="genre-list"),
	path('cart/', views.cart, name="cart"),
	path('checkout/', views.checkout, name="checkout"),
	path('bagItem/', views.bagItem, name="bagItem"),
	path('update_item/', views.updateItem, name="update_item"),
	path('process_order/', views.processOrder, name="process_order"),
	path('quiz', views.quiz, name="quiz"),
	path('result', views.result, name="result"),

]