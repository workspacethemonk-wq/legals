import os
import re
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document

PDF_PATH = "/Users/subhajit/Desktop/Workspace (SDE)/legals/indian constitution.pdf"
DB_DIR = "./chroma_db"

def contains_non_english_chars(text):
    # This regex matches any character that is NOT a basic Latin letter, number, or common punctuation.
    return bool(re.search(r'[^\x00-\x7f]', text))

def setup_rag():
    print(f"Loading PDF: {PDF_PATH}")
    if not os.path.exists(PDF_PATH):
        print(f"Error: PDF not found at {PDF_PATH}")
        return

    loader = PyPDFLoader(PDF_PATH)
    docs = loader.load()
    print(f"Number of pages loaded: {len(docs)}")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " "]
    )
    chunks = text_splitter.split_documents(docs)
    
    # --- Load SOPs ---
    SOP_DIR = "/Users/subhajit/Desktop/Workspace (SDE)/legals/data/sops"
    sop_chunks = []
    if os.path.exists(SOP_DIR):
        print(f"Loading SOPs from {SOP_DIR}")
        for filename in os.listdir(SOP_DIR):
            if filename.endswith(".md"):
                with open(os.path.join(SOP_DIR, filename), "r") as f:
                    content = f.read()
                    sop_chunks.extend(text_splitter.split_documents([Document(page_content=content, metadata={"source": filename, "type": "SOP"})]))
    
    print(f"Created {len(chunks)} legal chunks and {len(sop_chunks)} SOP chunks.")
    chunks.extend(sop_chunks)

    # Filter out chunks that contain non-English characters
    original_chunk_count = len(chunks)
    filtered_chunks = [chunk for chunk in chunks if not contains_non_english_chars(chunk.page_content)]
    chunks = filtered_chunks
    print(f"Original number of chunks: {original_chunk_count}")
    print(f"Number of chunks after filtering out non-English characters: {len(chunks)}")

    print("Initializing embeddings and creating vector database...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # If directory exists, remove it to start fresh
    if os.path.exists(DB_DIR):
        import shutil
        shutil.rmtree(DB_DIR)

    # Create the Vector Database
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=DB_DIR
    )

    print(f"Vector database created and stored locally in {DB_DIR}")

if __name__ == "__main__":
    setup_rag()
