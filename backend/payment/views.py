from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
import stripe
from rest_framework.decorators import api_view
from accounts.models import AppUser
from products.models import Ingredients
from orders.models import Order
from products.serializers import IngredientsSerializer
from .models import PaymentHistory

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckoutView(APIView):
    def post(self, request):
        try:

            data = request.data['orderData']
            items = []

            for i in data['orderItems'].keys():
               i = data['orderItems'][i]
               desc = ', '.join([i.get('name') for i in i.get('extra').values()]) + i.get('extra_info')
               name = ', '.join(
                   filter(None, [
                        i.get('name'),
                        i.get('pizzaDough', ''),
                        f"{str(i.get('size', ''))} size" if i.get('size') else '',
                        f"{str(i.get('grams', ''))} grams" if i.get('grams') else '',
                   ])
               )

               items.append(
                    { 
                        "price_data": {
                            "currency": "usd",
                            "unit_amount": int(i['price']),
                            "product_data": {
                                "name": name,
                                "description": f"+ {desc}" if len(desc) > 0 else " ",
                                "images": [i['img_modify']],
                                "metadata": {
                                    "name": i.get('name', ''),
                                    "size": i.get('size', ''),
                                    "grams": i.get('grams', ''),
                                    "pizzaDough": i.get('pizzaDough'),
                                    "extra_info": i.get('extra_info', ''),
                                }
                            },
                        },
                        "quantity": i['quantity'],
                    }
                )

            orderData = {
                "email": data.get('email'),
                "first_name": data.get('first_name'),
                "second_name": data.get('second_name'),
                "phone": data.get('phone'),
                "address": data.get('address'),
                "comment": data.get('comment', ''),
            }

            checkout_session = stripe.checkout.Session.create(
                line_items=items,
                mode='payment',
                metadata=orderData,
                customer_email=data.get('email'),
                payment_intent_data={"metadata": orderData},
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
                automatic_tax={"enabled": True},
                #discounts=[{"coupon": "promo_1PnWnuGKlfpQfnx9vj6v7cw9"}],
                allow_promotion_codes=True,
                shipping_options=[
                    {
                    "shipping_rate_data": {
                        "type": 'fixed_amount',
                        "fixed_amount": {
                            "amount": 500,
                            "currency": 'usd',
                        },
                        "display_name": 'Food Shipping',
                        "delivery_estimate": {
                        "maximum": {
                            "unit": 'hour',
                            "value": 1,
                        },
                        },
                    },
                    },
                ],
            )


            return Response({"url": checkout_session.url})
        except:
            return Response(
                {'error': 'Something went wrong when creating stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@csrf_exempt
@api_view(['POST'])
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None


    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_SECRET_WEBHOOK
        )
    except ValueError as e:
        return HttpResponse({"error": 'Error parsing payload', 'payload': payload},status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse({"error":'Error verifying webhook signature', 'sign_header': sig_header},status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        data = stripe.checkout.Session.list_line_items(session['id'], expand=['data.price.product'])
        items = {}

        for i in range(len(data.get('data'))):
            item = data.get('data')[i]
            extra = {}
            try:
                ingredients = Ingredients.objects.filter(name__in=item['price']['product']['description'].replace('+ ', '').split(', '))
                serializedIngr = IngredientsSerializer(ingredients, many=True, remove_fields=['id'])

                for j in serializedIngr.data:
                    extra[j['name']] = j                
            except:
                pass


            items[i] = {
                "name": item['price']['product']['metadata'].get('name', ''),
                "price": item['amount_subtotal'] / 100,
                "taxe": item['amount_tax'] / 100,
                "total_price": item['amount_total'] / 100,
                "quantity": item['quantity'],
                "size": item['price']['product']['metadata'].get('size', ''),
                "grams": item['price']['product']['metadata'].get('grams', ''),
                "pizzaDough":item['price']['product']['metadata'].get('pizzaDough', ''),
                "img_modify": item['price']['product']['images'][0],
                "extra_info": item['price']['product']['metadata'].get('extra_info', ''),
                "extra": extra,
            }

        meta = session['metadata']
        order = Order.objects.create(
            email=meta['email'],
            first_name=meta['first_name'],
            second_name=meta['second_name'],
            phone=meta['phone'],
            address=meta['address'],
            comment=meta['comment'],
            orderPrice=session['amount_total'] / 100,
            paymentType='card',
            paid_status=True,
            orderItems=items
        )

        PaymentHistory.objects.create(
            order=order,
            session_id=session['id'],
        )

    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object # contains a stripe.PaymentIntent
    elif event.type == 'payment_method.attached':
        payment_method = event.data.object # contains a stripe.PaymentMethod
    else:
        print('Unhandled event type {}'.format(event.type))


    return HttpResponse(status=200)



@api_view(['POST',])
def payment_notification(request):
    payment = PaymentHistory.objects.filter(session_id=request.data).first()

    if payment:
        if payment.customer_was_notificeted:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        

        payment.customer_was_notificeted = True
        payment.save()
        return Response({'res': 'the order was created and the payment was successful, please wait, we will contact you soon!'}, status=status.HTTP_200_OK)

    
    return Response(status=status.HTTP_400_BAD_REQUEST)
