from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator


class CarMake(models.Model):
    """Represents a car manufacturer."""

    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class CarModel(models.Model):
    """
    Represents a car model linked to a CarMake.
    Includes dealer_id reference, type, and year.
    """

    car_make = models.ForeignKey(
        CarMake,
        on_delete=models.CASCADE,
        help_text="Many-to-one relationship to CarMake",
    )
    dealer_id = models.IntegerField(
        help_text="Refers to a dealer created in Cloudant database"
    )
    name = models.CharField(max_length=100)

    CAR_TYPES = [
        ("SEDAN", "Sedan"),
        ("SUV", "SUV"),
        ("WAGON", "Wagon"),
        # Add more choices as required
    ]
    type = models.CharField(
        max_length=10,
        choices=CAR_TYPES,
        default="SUV",
    )

    year = models.IntegerField(
        default=now().year,
        validators=[
            MinValueValidator(2015),
            MaxValueValidator(now().year),
        ],
    )

    def __str__(self):
        return f"{self.car_make.name} {self.name}"
