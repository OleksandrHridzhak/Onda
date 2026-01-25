I decided to replace idb with dexie to reduce code complexity and lines of code. It was needed to rewrite indexed/ files to typescript anyway.

I just realized that dexie has it's own reactivity so I can delete redux from this chain

redux -> indexed -> syncservice

and also it will help me to:

📈 Підсумок економії:
Метрика Економія
Код -40-50% (видалити ~700 рядків Redux)
Bundle -65KB
Складність -60% (layers, boilerplate)
Час розробки +30% швидше (простіша архітектура)
Продуктивність +15-20% (менше ре-рендерів)
