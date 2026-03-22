import ollama

MODELS = ["llama3.2", "phi4", "mistral", "mashriram/sarvam-1"]

def pull_models():
    for model in MODELS:
        print(f"Pulling model: {model}...")
        try:
            ollama.pull(model)
            print(f"Model {model} pulled successfully.")
        except Exception as e:
            print(f"Error pulling {model}: {e}")

if __name__ == "__main__":
    pull_models()
