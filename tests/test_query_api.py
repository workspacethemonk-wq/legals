import httpx
import asyncio

async def test_legal_query():
    url = "http://localhost:8000/api/query"
    
    # Test queries including SOP-specific ones
    queries = [
        "What should I do if a public servant asks for a bribe in Kolkata?",
        "I was pulled over by traffic police who isn't wearing a uniform. What are my rights?",
        "What is the procedure to file an FIR for a theft?"
    ]
    
    async with httpx.AsyncClient() as client:
        for query in queries:
            print(f"\nQuery: {query}")
            payload = {"text": query, "language": "en"}
            try:
                response = await client.post(url, json=payload, timeout=60.0)
                if response.status_code == 200:
                    data = response.json()
                    print(f"Reply: {data['reply']}")
                    print(f"Metadata: {data['metadata']}")
                else:
                    print(f"Error {response.status_code}: {response.text}")
            except Exception as e:
                print(f"Request failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_legal_query())
