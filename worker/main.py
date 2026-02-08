import os
import sys
import time
from dotenv import load_dotenv

# 내부 모듈 임포트
from analyzer.pose_processor import SwingAnalyzer
from generator.openrouter_util import generate_lesson_via_openrouter

load_dotenv()

def process_analysis_job(video_path, user_level="초보"):
    print(f"[*] Processing video: {video_path}")
    
    # 1. 스윙 분석 및 지표 추출
    analyzer = SwingAnalyzer()
    metrics = analyzer.process_video(video_path)
    
    if not metrics:
        print("[!] Error: Analysis failed.")
        return None
    
    print(f"[*] Metrics extracted: {metrics}")
    
    # 2. OpenRouter를 통한 AI 레슨 생성
    print("[*] Generating AI lesson via OpenRouter...")
    lesson = generate_lesson_via_openrouter(metrics, user_level=user_level)
    
    print("[+] Lesson generated successfully.")
    return {
        "metrics": metrics,
        "lesson": lesson
    }

if __name__ == "__main__":
    # 간단한 실행 예시 (CLI)
    if len(sys.argv) > 1:
        video_file = sys.argv[1]
        if os.path.exists(video_file):
            result = process_analysis_job(video_file)
            print("\n=== [ AI ANALYSIS RESULT ] ===")
            print(result['lesson'])
        else:
            print(f"File not found: {video_file}")
    else:
        print("Usage: python main.py <video_path>")
