import requests
import json
import os

def generate_lesson_via_openrouter(metrics, user_level="초보", output_language="Korean"):
    """
    OpenRouter를 통해 골프 스윙 레슨을 생성합니다.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return "Error: OPENROUTER_API_KEY is not set."

    # 프롬프트 구성
    prompt = f"""
# Role
Expert AI Golf Coach specialized in biomechanics and visual analysis.

# Context
You are provided with numeric metrics from a user's golf swing pose estimation.

# Input Metrics
- Level: {user_level}
- Shoulder Turn at Top: {metrics.get('shoulder_turn', 'N/A')} degrees
- Weight Shift at Impact: {metrics.get('weight_shift', 'N/A')}% to lead foot
- Hand Path: {metrics.get('hand_path_type', 'N/A')}

# Instructions
1. Tone: Encouraging but authoritative.
2. Structure:
   - **Swing Overview**: Start with one positive thing.
   - **Critical Problem**: Identify the most impactful issue.
   - **The Cause**: Explain *why* it's happening based on the metrics.
   - **Correction Drill**: Provide a specific, "at-home" drill.
3. Language: {output_language}

# Output format
Markdown
"""

    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "https://golf-ai-coach.com", # Optional
            "X-Title": "Golf AI Coach", # Optional
            "Content-Type": "application/json"
        },
        data=json.dumps({
            "model": "google/gemini-2.0-flash-001", # 비용 효율적인 모델 추천
            "messages": [
                {"role": "system", "content": "You are a professional golf coach AI."},
                {"role": "user", "content": prompt}
            ]
        })
    )

    if response.status_code == 200:
        result = response.json()
        return result['choices'][0]['message']['content']
    else:
        return f"Error from OpenRouter: {response.status_code} - {response.text}"

# Test code (Optional)
if __name__ == "__main__":
    test_metrics = {
        "shoulder_turn": 75,
        "weight_shift": 40,
        "hand_path_type": "Out-to-In (Slice path)"
    }
    # print(generate_lesson_via_openrouter(test_metrics))
