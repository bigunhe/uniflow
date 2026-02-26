from fastapi import FastAPI

app = FastAPI()

# Bigun's AI Processing Microservice for UniFlow
@app.get("/")
def read_root():
    return {
        "status": "online", 
        "service": "UniFlow AI & File Processing Core",
        "developer": "Bigun"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Python backend is ready for Next.js requests."}