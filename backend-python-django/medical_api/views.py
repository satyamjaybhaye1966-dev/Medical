# backend-python-django/medical_api/views.py
# pyrefly: ignore [missing-import]
from rest_framework.decorators import api_view
from rest_framework.response import Response

STORE_INFO = {
    "storeName": "Mante Medical & Healthcare",
    "owner": "MR. Rushikesh Suresh Mante",
    "contact": "8237729148",
    "address": "Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana",
    "emergency_24x7": True
}

@api_view(['GET'])
def store_info_view(request):
    return Response(STORE_INFO)

@api_view(['GET', 'POST'])
def medicines_list_view(request):
    if request.method == 'GET':
        category = request.GET.get('category', None)
        # Sample response matching React frontend format
        return Response([
            {
                "id": "med-1",
                "name": "Paracetamol 650mg (Dolo 650)",
                "category": "Pain & Fever",
                "price": 30.50,
                "stock": 120,
                "owner": "MR. Rushikesh Suresh Mante (8237729148)"
            }
        ])
    elif request.method == 'POST':
        data = request.data
        return Response({"status": "Medicine added successfully", "data": data}, status=201)
