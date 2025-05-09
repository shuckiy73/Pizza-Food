from django.db import models

ratingChoices = (
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
)

class ProductName(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name


class Sizes(models.Model):
    name = models.ForeignKey(ProductName, blank=True, on_delete=models.DO_NOTHING)
    size = models.PositiveSmallIntegerField(blank=True, null=True)
    grams = models.PositiveBigIntegerField(blank=True, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self) -> str:
        return f'{self.name} {self.size if self.size else "|| one size only"}'

class Types(models.Model):
    type = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.type


class Ingredients(models.Model):
    name = models.CharField(max_length=70, blank=True, null=True)
    img_url = models.URLField(blank=True, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self) -> str:
        return f'{self.name} | {self.price}'


class Product(models.Model):
    PIZZAS = 'Pizzas'
    SNACKS = 'Snacks'
    BEVERAGES = 'Beverages'
    COCKTAILS = 'Cocktails'
    COFE = 'Cofe'
    DESERTS = 'Desserts'
    SAUCES = 'Sauces'

    PRODUCT_TYPE_CHOICES = [
        (PIZZAS, 'Pizzas'),
        (SNACKS, 'Snacks'),
        (BEVERAGES, 'Beverages'),
        (COCKTAILS, 'Cocktails'),
        (COFE, 'Cofe'),
        (DESERTS, 'Desserts'),
        (SAUCES, 'Sauces'),
    ]

    name = models.ForeignKey(ProductName, blank=True, on_delete=models.DO_NOTHING)
    product_type = models.CharField(max_length=50, choices=PRODUCT_TYPE_CHOICES)
    sizes = models.ManyToManyField(Sizes)
    img_url = models.URLField()
    rating = models.PositiveSmallIntegerField(choices=ratingChoices, default=4)
    description = models.TextField(max_length=500, blank=True)
    ingredients = models.ManyToManyField(Ingredients, blank=True, related_name='ingredients')
    extra_info = models.CharField(max_length=50, blank=True)

    def __str__(self) -> str:
        return f'{self.product_type}'



