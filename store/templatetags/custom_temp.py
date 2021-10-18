from django import template

register = template.Library()

@register.filter
def exists(queryset, productName):
    return queryset.filter(product=productName).exists()

@register.filter
def present(list_, productId):

    # print(type(list_[0]['product']['id']))
    # print(type(productId))
    # print(type(list_))
    # print(list_[0]['product']['id'])
    for item in list_:

        if(productId == item['product']['id']):
            return True

    return False    

@register.filter
def addstr(arg1, arg2):
    return str(arg1) + str(arg2)

