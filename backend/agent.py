import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

CATEGORIES = [
    "Bathroom & Hygiene",
    "Anti-Ragging & Safety",
    "Mess & Food Quality",
    "Academic Issues",
    "Infrastructure/Maintenance",
    "Other",
]

SYSTEM_PROMPT = """You are a campus complaint classification agent.
Your job is to classify student complaints into exactly one of these categories:

1. Bathroom & Hygiene - issues with toilets, water, cleanliness in washrooms
2. Anti-Ragging & Safety - ragging, bullying, harassment, security concerns
3. Mess & Food Quality - food quality, mess timings, hygiene in dining hall
4. Academic Issues - exam, attendance, faculty, timetable, results
5. Infrastructure/Maintenance - electricity, fans, lights, furniture, building repairs
6. Other - anything that doesn't fit the above

You MUST respond with ONLY a valid JSON object, no extra text, no markdown, no backticks.
Format:
{{
  "category": "<one of the 6 categories exactly>",
  "confidence": <float between 0.0 and 1.0>,
  "reasoning": "<one short sentence explaining why>"
}}"""

HUMAN_PROMPT = "Classify this student complaint: {complaint}"

def classify_complaint(complaint: str) -> dict:
    """
    Classify a student complaint using Gemini.
    Returns dict with category, confidence, reasoning, and department.
    Falls back gracefully on errors.
    """

    # --- Fallback result for low confidence or errors ---
    fallback = {
        "category": "Other",
        "confidence": 0.0,
        "reasoning": "Could not classify automatically.",
        "routed_to": "General Administration",
        "fallback": True,
    }

    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-3.1-flash-lite-preview",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0,
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", HUMAN_PROMPT),
        ])

        chain = prompt | llm | StrOutputParser()
        raw_output = chain.invoke({"complaint": complaint})

        # Strip any accidental markdown fences
        clean = raw_output.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(clean)

        # Validate category is one of the 6
        if result.get("category") not in CATEGORIES:
            result["category"] = "Other"

        # Clamp confidence between 0 and 1
        result["confidence"] = max(0.0, min(1.0, float(result.get("confidence", 0.0))))

        # Low confidence fallback
        if result["confidence"] < 0.5:
            result["fallback"] = True
            result["routed_to"] = "General Administration"
        else:
            result["fallback"] = False
            from database import CATEGORY_DEPARTMENT_MAP
            result["routed_to"] = CATEGORY_DEPARTMENT_MAP.get(result["category"], "General Administration")

        return result

    except json.JSONDecodeError:
        return fallback
    except Exception as e:
        fallback["reasoning"] = str(e)
        return fallback


if __name__ == "__main__":
    # Quick test
    test_complaints = [
        "Bathroom on 3rd floor has no water since yesterday",
        "Senior students are forcing us to do their laundry and threatening us",
        "Food in mess has been stale and there are insects in the dal",
        "My attendance is showing wrong in the portal, I will lose my exam form",
        "The fan in room 204 is not working and it's very hot",
        "I lost my ID card near the library",
    ]

    for complaint in test_complaints:
        print(f"\nComplaint: {complaint}")
        result = classify_complaint(complaint)
        print(f"  Category   : {result['category']}")
        print(f"  Confidence : {result['confidence']:.0%}")
        print(f"  Routed to  : {result['routed_to']}")
        print(f"  Reasoning  : {result['reasoning']}")
        print(f"  Fallback?  : {result.get('fallback', False)}")