async def search_products(query: str):
    query = query.lower()

    return [
        {
            "name": query.title(),
            "image": "https://via.placeholder.com/300",
            "availablePlatforms": [
                "Amazon",
                "Flipkart",
                "Blinkit"
            ],
            "recommended": {
                "platform": "Amazon",
                "link": f"https://www.amazon.in/s?k={query.replace(' ', '+')}",
                "reason": "High trust + coupon compatibility"
            }
        }
    ]
