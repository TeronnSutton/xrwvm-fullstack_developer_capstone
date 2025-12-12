import json
import logging
from datetime import datetime

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import get_request, analyze_review_sentiments, post_review

# Get an instance of a logger
logger = logging.getLogger(__name__)


def get_cars(request):
    if CarMake.objects.count() == 0:
        initiate()
    car_models = CarModel.objects.select_related("car_make")
    cars = [{"CarModel": cm.name, "CarMake": cm.car_make.name} for cm in car_models]
    return JsonResponse({"CarModels": cars})


@csrf_exempt
def login_user(request):
    """Handle user login."""
    data = json.loads(request.body)
    username = data["userName"]
    password = data["password"]

    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)


def logout_user(request):
    """Handle user logout."""
    logout(request)
    return JsonResponse({"username": ""})


@csrf_exempt
def registration(request):
    """Handle user registration."""
    data = json.loads(request.body)
    username = data["userName"]
    password = data["password"]
    first_name = data["firstName"]
    last_name = data["lastName"]
    email = data["email"]

    username_exist = False
    try:
        User.objects.get(username=username)
        username_exist = True
    except User.DoesNotExist:
        logger.debug("%s is a new user", username)

    if not username_exist:
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email,
        )
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})
    return JsonResponse({"userName": username, "error": "Already Registered"})


def get_dealerships(request, state="All"):
    """Return dealerships, optionally filtered by state."""
    endpoint = "/fetchDealers" if state == "All" else f"/fetchDealers/{state}"
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_reviews(request, dealer_id):
    """Return reviews for a dealer with sentiment analysis."""
    if dealer_id:
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        reviews = get_request(endpoint)

        for review_detail in reviews:
            try:
                response = analyze_review_sentiments(review_detail["review"])
                review_detail["sentiment"] = response.get("sentiment", "neutral")
            except Exception as e:
                logger.error("Sentiment analysis failed: %s", e)
                review_detail["sentiment"] = "neutral"

        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def get_dealer_details(request, dealer_id):
    """Return details for a single dealer."""
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"status": 400, "message": "Bad Request"})


@csrf_exempt
def add_review(request):
    """Add a new review."""
    try:
        data = json.loads(request.body)
        logger.debug("Received review data: %s", data)
        post_review(data)
        return JsonResponse({"status": 200})
    except Exception as e:
        logger.error("Error posting review: %s", e)
        return JsonResponse({"status": 401, "message": str(e)})
