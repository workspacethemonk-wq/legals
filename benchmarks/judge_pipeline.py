import time
import ollama
import json
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

GENERATOR_MODEL = "mashriram/sarvam-1"
JUDGE_MODEL = "llama3.2"
DB_DIR = "./chroma_db"
QUERIES = [
    "Under what Article can the President of India declare a Financial Emergency?",
    "What does Article 21 say about life and liberty?",
    "Explain the significance of Article 32 regarding constitutional remedies."
]

def judge_response(context, question, response_to_judge):
    print(f"  --> Judging response with {JUDGE_MODEL}...", end=" ", flush=True)
    judge_prompt = (
        f"You are a legal judge verifying the accuracy of a generated answer against a provided context.\n\n"
        f"CONTEXT:\n{context}\n\n"
        f"QUESTION:\n{question}\n\n"
        f"GENERATED ANSWER:\n{response_to_judge}\n\n"
        f"TASK: Determine if the GENERATED ANSWER is factually accurate based ONLY on the CONTEXT. "
        f"Specifically check if any Article numbers mentioned are correct. "
        f"Respond with 'VERIFIED' if accurate, or 'REJECTED: [Reason]' if there is a hallucination or error."
    )
    
    try:
        res = ollama.generate(model=JUDGE_MODEL, prompt=judge_prompt, options={"temperature": 0})
        print("Done.")
        return res['response'].strip()
    except Exception as e:
        print(f"Error: {e}")
        return f"JUDGING_ERROR: {e}"

def run_judge_pipeline():
    print("Loading vector database for Judge Pipeline...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embeddings)
    
    results = []
    
    for query in QUERIES:
        print(f"\nProcessing Query: {query}")
        
        # 1. Retrieval
        search_results = vector_db.similarity_search(query, k=2)
        context = "\n\n".join([res.page_content for res in search_results])
        
        # 2. Generation (Sarvam-1)
        print(f"  Generating with {GENERATOR_MODEL}...", end=" ", flush=True)
        gen_start = time.perf_counter()
        gen_res = ollama.generate(
            model=GENERATOR_MODEL, 
            prompt=f"Context:\n{context}\n\nAnswer the following query based ONLY on the context. Cite articles: {query}",
            options={"temperature": 0}
        )
        gen_time = time.perf_counter() - gen_start
        answer = gen_res['response']
        print(f"Done. ({gen_time:.2f}s)")
        
        # 3. Judging (Llama 3.2)
        verification = judge_response(context, query, answer)
        
        results.append({
            "query": query,
            "generator_model": GENERATOR_MODEL,
            "answer": answer,
            "verification": verification,
            "generation_time": round(gen_time, 3)
        })
    
    with open("benchmarks/judge_results.json", "w") as f:
        json.dump(results, f, indent=4)
    print("\nResults saved to benchmarks/judge_results.json")
    
    # Print summary
    print("\nPipeline Summary:")
    for res in results:
        status = "✅" if "VERIFIED" in res['verification'] else "❌"
        print(f"{status} Query: {res['query'][:50]}...")
        print(f"   Status: {res['verification']}")

if __name__ == "__main__":
    run_judge_pipeline()
