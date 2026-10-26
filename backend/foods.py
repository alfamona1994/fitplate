# Starter food list. STATUS: proposed. Replace it with Nigerian food composition data
# (cite the edition you use) and have a dietitian validate the entries and portions.

FOODS = [
    { "slot": "Breakfast", "name": "Oatmeal with banana", "contains": ["Gluten"], "cost": 1, "note": "Slow-release carbohydrates for steady energy." },
    { "slot": "Breakfast", "name": "Akara (bean cakes) with pap", "contains": [], "cost": 1, "note": "Plant protein and carbohydrates to start the day." },
    { "slot": "Breakfast", "name": "Boiled eggs with whole-wheat bread", "contains": ["Eggs", "Gluten"], "cost": 2, "note": "High-quality protein keeps you full." },
    { "slot": "Breakfast", "name": "Yoghurt with fruit and nuts", "contains": ["Dairy", "Nuts"], "cost": 2, "note": "Protein and healthy fats." },
    { "slot": "Lunch", "name": "Brown rice, beans and vegetable stew", "contains": [], "cost": 1, "note": "Fibre and plant protein keep you full." },
    { "slot": "Lunch", "name": "Grilled chicken, yam and salad", "contains": ["Meat"], "cost": 2, "note": "Lean protein supports muscle." },
    { "slot": "Lunch", "name": "Grilled fish, plantain and vegetables", "contains": ["Seafood"], "cost": 2, "note": "Lean protein and healthy fats." },
    { "slot": "Lunch", "name": "Moi moi with vegetable salad", "contains": [], "cost": 1, "note": "Low-cost plant protein." },
    { "slot": "Dinner", "name": "Vegetable soup with a small portion of swallow", "contains": [], "cost": 1, "note": "Vitamins and minerals from leafy vegetables." },
    { "slot": "Dinner", "name": "Stir-fried beef with vegetables and rice", "contains": ["Meat"], "cost": 3, "note": "Protein and iron for recovery." },
    { "slot": "Dinner", "name": "Lentil and sweet potato stew", "contains": [], "cost": 1, "note": "Fibre-rich and filling." },
    { "slot": "Dinner", "name": "Baked fish with sweet potato", "contains": ["Seafood"], "cost": 2, "note": "Light, high-protein evening meal." },
    { "slot": "Snack", "name": "Banana or orange", "contains": [], "cost": 1, "note": "Quick natural energy." },
    { "slot": "Snack", "name": "Roasted groundnuts", "contains": ["Nuts"], "cost": 1, "note": "Healthy fats and protein." },
    { "slot": "Snack", "name": "Plain yoghurt", "contains": ["Dairy"], "cost": 2, "note": "Protein and calcium." },
]

DIET_BANS = {
    "Vegan": ["Meat", "Seafood", "Dairy", "Eggs"],
    "Vegetarian": ["Meat", "Seafood"],
}