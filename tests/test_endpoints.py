import base64
import httpx
import json

BASE_URL = "http://localhost:8050"

def test_hello():
    print("Testing /hello-world...")
    resp = httpx.get(f"{BASE_URL}/hello-world")
    print(resp.json())

def test_query():
    print("\nTesting /api/query...")
    payload = {
        "text": "What are my rights against workplace harassment in India?",
        "language": "en",
        "constituency": "700026"
    }
    resp = httpx.post(f"{BASE_URL}/api/query", json=payload)
    print(resp.json())

def test_constituency():
    print("\nTesting /api/query/constituency/700026...")
    resp = httpx.get(f"{BASE_URL}/api/query/constituency/700026")
    print(resp.json())

def test_voice():
    print("\nTesting /api/chat/voice (with dummy audio)...")
    # Small dummy WAV file base64 (not valid audio but for structure test)
    dummy_audio = base64.b64encode(b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00").decode()
    payload = {
        "audio_base64": dummy_audio,
        "session_id": "test_session_123"
    }
    resp = httpx.post(f"{BASE_URL}/api/chat/voice", json=payload)
    print(resp.json())

if __name__ == "__main__":
    try:
        test_hello()
        test_query()
        test_constituency()
        test_voice()
    except Exception as e:
        print(f"Test failed: {e}")
        print("Note: Ensure the server is running with 'uv run main.py' before testing.")
