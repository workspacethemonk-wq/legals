import time
import ollama
import json

MODELS = ["llama3.2", "phi4", "mistral", "mashriram/sarvam-1"]
PROMPT = "Explain the importance of open-source AI in three sentences."

def benchmark(model_name, prompt):
    print(f"Benchmarking {model_name}...", end=" ", flush=True)
    try:
        start_time = time.perf_counter()
        response = ollama.generate(model=model_name, prompt=prompt, stream=True)
        
        first_token_time = None
        tokens = 0
        
        for chunk in response:
            if first_token_time is None:
                first_token_time = time.perf_counter() - start_time
            tokens += 1
        
        total_time = time.perf_counter() - start_time
        generation_time = total_time - first_token_time
        tps = tokens / generation_time if generation_time > 0 else 0
        
        print(f"Done.")
        return {
            "model": model_name,
            "ttft": round(first_token_time, 3),
            "tps": round(tps, 2),
            "total_latency": round(total_time, 3),
            "tokens": tokens
        }
    except Exception as e:
        print(f"Error: {e}")
        return {"model": model_name, "error": str(e)}

def run_benchmarks():
    results = []
    for model in MODELS:
        res = benchmark(model, PROMPT)
        results.append(res)
    
    print("\nBenchmark Results:")
    print(f"{'Model':<15} | {'TTFT (s)':<10} | {'TPS':<10} | {'Latency (s)':<12}")
    print("-" * 55)
    for res in results:
        if "error" in res:
            print(f"{res['model']:<15} | ERROR: {res['error']}")
        else:
            print(f"{res['model']:<15} | {res['ttft']:<10} | {res['tps']:<10} | {res['total_latency']:<12}")
    
    with open("benchmarks/results.json", "w") as f:
        json.dump(results, f, indent=4)
    print("\nResults saved to benchmarks/results.json")

if __name__ == "__main__":
    run_benchmarks()
