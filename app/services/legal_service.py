import os
import ollama
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

class LegalService:
    FEW_SHOT_EXAMPLE = """
### Example:
Context: Women cannot be arrested between sunset and sunrise except under exceptional circumstances with a Magistrate's order as per BNSS.
Question: Can police arrest a woman at 11 PM?
Answer:
**✅ DIRECT ANSWER**
No, a woman cannot be arrested at 11 PM (night) unless there is an emergency and a written order from a Magistrate.

**📖 LEGAL BASIS**
Section 43 of the Bharatiya Nagarik Suraksha Sanhita (BNSS).

**🛠️ ACTIONABLE STEPS**
1. Ask for the female officer's presence.
2. Ask to see the written permission from a Judicial Magistrate.
3. Call 112 if they try to take you by force.

**⚠️ YOUR RIGHTS & CAUTIONS**
A woman can only be arrested by a female officer.

**❓ NEXT STEP**
Would you like to know the procedure if an arrest is made without a warrant?
---
"""

    def __init__(self):
        self.db_path = "/Users/subhajit/Desktop/Workspace (SDE)/legals/chroma_db"
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vectorstore = Chroma(persist_directory=self.db_path, embedding_function=self.embeddings)
        
        self.generator_model = "mashriram/sarvam-1"
        self.judge_model = "llama3.2"
        
        self.system_prompt = """You are 'Nyaya-Mitra', a fast and expert Legal Aid Assistant for Indian citizens. Your goal is to empower users with actionable legal guidance, focusing on the new laws (BNS, BNSS, BSA).

### RESPONSE RULES:
1. NEVER give a simple "Yes/No" answer. Always explain the 'Why' and 'How'.
2. Use the following MANDATORY structure for every response:
**✅ DIRECT ANSWER**
**📖 LEGAL BASIS**
**🛠️ ACTIONABLE STEPS**
**⚠️ YOUR RIGHTS & CAUTIONS**
**❓ NEXT STEP**

### CONSTRAINTS:
- Keep language simple and jargon-free. 
- Use the provided context (RAG) as your primary source of truth.
- ALWAYS include a disclaimer: "I am an AI, not a lawyer. Use this as a guide and consult a qualified advocate for court matters." """

    def generate_legal_response(self, query, context):
        # We bake everything into one string for Sarvam-1
        full_prompt = f"""You are 'Nyaya-Mitra'. You MUST follow the structure below.
Respond in the SAME LANGUAGE as the question (English/Hindi/Bengali).

{self.FEW_SHOT_EXAMPLE}

### Your Task:
Context: {context}
Question: {query}
Answer:"""

        response = ollama.generate(
            model=self.generator_model,
            prompt=full_prompt,
            options={
                "temperature": 0.2, # Low temp for consistency
                "top_p": 0.9,
                "stop": ["---", "###"] # Stops it from generating a second example
            }
        )
        return response['response']

    def generate_with_guardrails(self, query: str):
        # 1. Retrieve Context
        results = self.vectorstore.similarity_search(query, k=3)
        context = "\n\n".join([doc.page_content for doc in results])
        
        # 2. Stage 1: Generate with Sarvam-1 using Few-Shot
        initial_answer = self.generate_legal_response(query, context)
        
        # 3. Stage 2: Judge with Llama 3.2
        judge_prompt = (
            f"You are a legal judge. Verify if the generated answer is accurate and follows the structure based ONLY on the provided context.\n\n"
            f"Context: {context}\n\n"
            f"User Question: {query}\n\n"
            f"Generated Answer: {initial_answer}\n\n"
            "If the answer is accurate and fully supported by the context, respond with 'VERIFIED'.\n"
            "If it contains hallucinations, incorrect Article numbers, or information NOT in the context, respond with 'REJECTED' followed by a brief reason."
        )
        
        verification_response = ollama.generate(
            model=self.judge_model,
            prompt=judge_prompt,
            options={"temperature": 0.1}
        )
        verification_text = verification_response['response']
        
        # 4. Fallback if rejected
        if "VERIFIED" in verification_text.upper():
            return {
                "answer": initial_answer,
                "model_used": self.generator_model,
                "verified": True,
                "judge_feedback": "Answer verified by Llama 3.2"
            }
        else:
            # Fallback to Llama 3.2 for final generation
            fallback_response = ollama.generate(
                model=self.judge_model,
                prompt=f"Context: {context}\n\nQuestion: {query}",
                system=self.system_prompt,
                options={"temperature": 0}
            )
            return {
                "answer": fallback_response['response'],
                "model_used": self.judge_model,
                "verified": True,
                "judge_feedback": f"Sarvam-1 response was rejected by Llama 3.2. Reason: {verification_text[:100]}..."
            }
