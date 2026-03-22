import time
import ollama
import json
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

MODELS = ["llama3.2", "mistral", "mashriram/sarvam-1"]
DB_DIR = "./chroma_db"
QUERIES = [
    "What does Article 21 say about life and liberty?",
    "Explain the significance of Article 32 regarding constitutional remedies."
]
flat_prompts=[
    "What are the specific grounds for reasonable restrictions on the Right to Freedom of Speech under Article 19(2)?",
    "Explain the 'Procedure Established by Law' vs. 'Due Process of Law' as interpreted by the Supreme Court of India.",
    "List the five types of writs that can be issued by the Supreme Court under Article 32.",
    "What is the significance of the 42nd Amendment in relation to the Preamble?",
    "Define 'State' as per Article 12 of the Indian Constitution.",
    "What does Article 44 say regarding the Uniform Civil Code?",
    "Explain the Doctrine of Basic Structure established in the Kesavananda Bharati case.",
    "Under what Article can the President of India declare a Financial Emergency?",
    "What is the composition of the Finance Commission under Article 280?",
    "Explain the difference between Article 352 and Article 356.",
    "A citizen is denied access to a public well based on their caste. Which Fundamental Right is violated?",
    "A person is arrested and not produced before a magistrate within 24 hours. Analyze the legality under Article 22.",
    "If a state law conflicts with a central law on a subject in the Concurrent List, which one prevails?",
    "A student is forced to attend religious instruction in a government-aided school. Is this a violation of Article 28?",
    "A journalist is arrested for criticizing a local politician's policy. Does this violate Article 19(1)(a)?",
    "An employee is fired from a government job without a fair hearing. Evaluate this against Article 311.",
    "Can the Governor of a state pardon a death sentence? Compare with the President's powers.",
    "A person's property is taken by the government without compensation. Analyze this under Article 300A.",
    "A minority community wants to establish an educational institution. Which Article protects this right?",
    "Is the 'Right to Privacy' a fundamental right? Cite the relevant article and case law.",
    "What is the procedure for the impeachment of the President of India?",
    "Explain the 'Doctrine of Pleasure' and its limitations in Indian Civil Services.",
    "How is a Judge of the Supreme Court removed from office?",
    "What is the 'Special Leave Petition' under Article 136?",
    "Explain the role of the Attorney General of India under Article 76.",
    "What are the qualifications required to be elected as the Vice-President of India?",
    "Explain the concept of 'Joint Sitting' of both houses of Parliament.",
]

def benchmark_rag(model_name, query, vector_db):
    print(f"Benchmarking RAG [{model_name}] for query: '{query}'...", end=" ", flush=True)
    
    # Retrieval
    search_results = vector_db.similarity_search(query, k=2)
    context = "\n\n".join([res.page_content for res in search_results])
    
    system_prompt = (
        "You are a strict Legal Assistant specializing in the Indian Constitution. "
        "Your task is to answer the query based ONLY on the provided context. "
        "Follow these rules strictly:\n"
        "1. If the answer is not in the context, say 'I do not have enough information in the provided context to answer this query.'\n"
        "2. Do not use outside knowledge or hallucinate Article numbers.\n"
        "3. You MUST cite the specific Article or Section number mentioned in the context for every factual claim.\n"
        "4. Be concise and precise."
    )
    
    prompt_content = f"Context:\n{context}\n\nQuery: {query}"
    
    try:
        start_time = time.perf_counter()
        # Use options for hyperparameter tuning
        response = ollama.generate(
            model=model_name, 
            prompt=f"System: {system_prompt}\n\nUser: {prompt_content}", 
            stream=True,
            options={
                "temperature": 0,
                "top_p": 0.1
            }
        )
        
        first_token_time = None
        tokens = 0
        full_response = ""
        
        for chunk in response:
            if first_token_time is None:
                first_token_time = time.perf_counter() - start_time
            tokens += 1
            full_response += chunk['response']
        
        total_time = time.perf_counter() - start_time
        generation_time = total_time - first_token_time
        tps = tokens / generation_time if generation_time > 0 else 0
        
        print("Done.")
        return {
            "model": model_name,
            "query": query,
            "ttft": round(first_token_time, 3),
            "tps": round(tps, 2),
            "total_latency": round(total_time, 3),
            "tokens": tokens,
            "response_preview": full_response[:100] + "..."
        }
    except Exception as e:
        print(f"Error: {e}")
        return {"model": model_name, "query": query, "error": str(e)}

def run_rag_benchmarks():
    print("Loading vector database...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    
    results = []
    for model in MODELS:
        # Check if model exists in ollama
        try:
            ollama.show(model)
        except Exception:
            print(f"Skipping {model} as it is not pulled yet.")
            continue
            
        for query in QUERIES:
            res = benchmark_rag(model, query, vector_db)
            results.append(res)
    
    print("\nRAG Benchmark Results:")
    print(f"{'Model':<20} | {'Query':<30} | {'TTFT (s)':<10} | {'TPS':<10}")
    print("-" * 80)
    for res in results:
        if "error" in res:
            print(f"{res['model']:<20} | {res['query'][:27]+'...':<30} | ERROR")
        else:
            print(f"{res['model']:<20} | {res['query'][:27]+'...':<30} | {res['ttft']:<10} | {res['tps']:<10}")
    
    with open("benchmarks/rag_results.json", "w") as f:
        json.dump(results, f, indent=4)
    print("\nResults saved to benchmarks/rag_results.json")

def run_flat_benchmarks():
    print("Loading vector database for flat prompts...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    
    results = []
    # Load existing results if they exist to append or just overwrite if that's preferred.
    # The user asked to get latency in rag_results.json, implying we should save there.
    
    for model in MODELS:
        try:
            ollama.show(model)
        except Exception:
            print(f"Skipping {model} as it is not pulled yet.")
            continue
            
        for query in flat_prompts:
            res = benchmark_rag(model, query, vector_db)
            results.append(res)
    
    print("\nFlat Prompt Benchmark Results:")
    print(f"{'Model':<20} | {'Query':<30} | {'TTFT (s)':<10} | {'TPS':<10} | {'Latency (s)':<12}")
    print("-" * 90)
    for res in results:
        if "error" in res:
            print(f"{res['model']:<20} | {res['query'][:27]+'...':<30} | ERROR")
        else:
            print(f"{res['model']:<20} | {res['query'][:27]+'...':<30} | {res['ttft']:<10} | {res['tps']:<10} | {res['total_latency']:<12}")
    
    # Save flat results specifically or append to existing? 
    # Usually better to save separately or merge. I'll save to rag_results_flat.json or overwrite if intended.
    # The user said "get the latency also in rag_results.json", so I'll save them there.
    with open("benchmarks/rag_results.json", "w") as f:
        json.dump(results, f, indent=4)
    print("\nFlat results saved to benchmarks/rag_results.json")

if __name__ == "__main__":
    # run_rag_benchmarks() # Standard ones
    run_flat_benchmarks() # New flat prompts
