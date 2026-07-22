from typing import Any, Dict, List
from app.core.config import settings
from app.core.database import chroma_client, neo4j_driver
from app.core.logging import logger


class RAGService:
    """
    RAG & Document Intelligence Service using ChromaDB vector database.
    """

    async def generate_embeddings_and_index(self, doc_id: str, title: str, content: str) -> int:
        logger.info("Generating embeddings and indexing into ChromaDB", doc_id=doc_id)
        if chroma_client:
            try:
                collection = chroma_client.get_or_create_collection(settings.CHROMADB_COLLECTION_NAME)
                collection.add(
                    documents=[content],
                    metadatas=[{"title": title, "doc_id": doc_id}],
                    ids=[f"{doc_id}-chunk-0"]
                )
            except Exception as e:
                logger.error("ChromaDB Indexing error", error=str(e))
        return 1


class KnowledgeGraphService:
    """
    Knowledge Graph Service interfacing with Neo4j.
    """

    async def execute_cypher(self, query: str) -> List[Dict[str, Any]]:
        logger.info("Executing Cypher query", query=query)
        if neo4j_driver:
            async with neo4j_driver.session() as session:
                result = await session.run(query)
                records = await result.data()
                return records
        return []


class PredictiveMaintenanceService:
    """
    ML Failure Prediction and Remaining Useful Life (RUL) Service.
    """

    def predict_rul(self, temperature: float, vibration: float, oil_quality: float) -> Dict[str, Any]:
        # Risk score heuristic formula
        risk_score = min(100.0, (vibration * 10) + (temperature * 0.5) + (100 - oil_quality) * 0.4)
        rul_hours = max(10.0, 2000.0 - (risk_score * 18.0))
        status = "Optimal" if risk_score < 40 else "Warning" if risk_score < 75 else "Critical"

        return {
            "risk_score": round(risk_score, 2),
            "rul_hours": round(rul_hours, 1),
            "status": status,
            "failure_probability": round(risk_score / 100.0, 2)
        }


rag_service = RAGService()
kg_service = KnowledgeGraphService()
predictive_service = PredictiveMaintenanceService()
