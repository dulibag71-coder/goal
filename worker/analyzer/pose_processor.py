import mediapipe as mp
import cv2
import numpy as np
import math

class SwingAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def calculate_angle(self, a, b, c):
        """세 점 사이의 각도를 계산합니다."""
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
        angle = np.abs(radians*180.0/np.pi)
        
        if angle > 180.0:
            angle = 360-angle
            
        return angle

    def process_video(self, video_path):
        cap = cv2.VideoCapture(video_path)
        frames_data = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break
            
            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(image_rgb)
            
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                # 필요한 관절 정보 추출
                frame_info = {
                    "l_shoulder": [landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER].x, landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER].y],
                    "r_shoulder": [landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER].x, landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER].y],
                    "l_hip": [landmarks[self.mp_pose.PoseLandmark.LEFT_HIP].x, landmarks[self.mp_pose.PoseLandmark.LEFT_HIP].y],
                    "r_hip": [landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP].x, landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP].y],
                    "l_wrist": [landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST].x, landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST].y],
                    "r_wrist": [landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST].x, landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST].y],
                }
                frames_data.append(frame_info)
        
        cap.release()
        return self.analyze_metrics(frames_data)

    def analyze_metrics(self, frames_data):
        if not frames_data:
            return None
            
        # 1. 스윙 구간 식별 (임클리멘트 예시)
        # Backswing Top: 손목(R)의 Y좌표가 가장 낮은(이미지상 높은) 프레임
        top_frame_idx = min(range(len(frames_data)), key=lambda i: frames_data[i]['r_wrist'][1])
        top_frame = frames_data[top_frame_idx]
        
        # 2. 어깨 회전 각도 (Top 기준)
        # 어깨 라인과 수평선 사이의 각도 계산
        shoulder_angle = math.degrees(math.atan2(
            top_frame['r_shoulder'][1] - top_frame['l_shoulder'][1],
            top_frame['r_shoulder'][0] - top_frame['l_shoulder'][0]
        ))
        
        # 3. 체중 이동 (Address vs Impact 비교 로직 필요 - 여기선 단순화)
        
        return {
            "shoulder_turn": round(abs(shoulder_angle), 1),
            "top_frame_index": top_frame_idx,
            "hand_path_type": "Neutral (Sample)", # 실제 궤적 분석 로직 추가 필요
            "total_frames": len(frames_data)
        }

if __name__ == "__main__":
    # analyzer = SwingAnalyzer()
    # metrics = analyzer.process_video("sample_swing.mp4")
    # print(metrics)
    pass
