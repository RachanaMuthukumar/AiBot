from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import requests
api_key = "" #TODO add the api key
genai.configure(api_key=api_key)
gemini_model = genai.GenerativeModel("gemini-2.0-flash")
app = FastAPI()
origins = [
    "http://localhost:5173"
]
@app.get("/")
def root():
    return {"message": "Gemini backend is running. Use POST /ask to interact with markdown content."}
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type", "Authorization"],
)
def load_markdown_from_repo(user, repo, branch="main"):
    api_url = f""# add the repository
    headers = {
    "Authorization": f"",  # Your GitHub token here
    "Accept": "application/vnd.github.v3+json"
}
    response = requests.get(api_url, headers=headers)
    markdown_contents = []

    if response.status_code == 200:
        files = response.json()
        for file in files:
            if file['name'].endswith('.md'):
                raw_url = file['download_url']
                md_response = requests.get(raw_url)
                if md_response.status_code == 200:
                    markdown_contents.append(md_response.text)
    else:
        print(f"Failed to fetch contents: {response.status_code}")
    return markdown_contents
markdowns = load_markdown_from_repo("#account name", "#Repo name")
@app.post("/ask")
async def ask_question(request: Request):
    body = await request.json()
    query = body.get("question", "")
    context = "\n".join(load_markdown_from_repo("#Account namer", "#Repo name")) or "No markdown content available."

    prompt = f"""
Use the following documentation to answer the user query.

Context:
{context[:6000]}

User Question:
{query}

Respond clearly, welcome the user only for the first reply not for every message, and concisely, using only relevant information from the context. If the answer is not available, say so politely. Respond in 1 line
"""

    response = gemini_model.generate_content(prompt)
    return {"response": response.text}
