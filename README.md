# R3F 이커머스 백엔드 API

3D 선글라스 커스터마이징 이커머스의 백엔드 API 서버입니다.  
Node.js + Express + MongoDB로 2주간 개발했습니다.

## 🚀 Live Demo

**Frontend**: https://r3f-shopping-website-fe.vercel.app/

## 주요 기능

### 사용자 인증

-   이메일 회원가입/로그인
-   Google OAuth 소셜 로그인 지원
-   JWT 토큰 기반 세션 관리
-   관리자/일반유저 권한 분리

### 상품 관리

-   상품 CRUD (생성, 조회, 수정, 삭제)
-   이름/카테고리별 검색 및 필터링
-   페이지네이션
-   SKU 중복 방지 및 재고 관리

### 장바구니 시스템

-   상품 추가/수정/삭제
-   색상별 상품 구분 관리
-   중복 상품 자동 수량 증가
-   실시간 장바구니 아이템 수 조회

### 주문 관리

-   주문 생성 및 내역 조회
-   주문 상태 업데이트 (preparing → shipping → delivered)
-   주문 완료 시 장바구니 자동 초기화
-   관리자용 전체 주문 관리

## 기술스택

-   **Node.js** 18+ - JavaScript 런타임
-   **Express.js** 4.19.2 - 웹 프레임워크
-   **MongoDB** - NoSQL 데이터베이스
-   **Mongoose** 8.0.0 - MongoDB ODM
-   **JWT** - 토큰 기반 인증
-   **bcryptjs** 2.4.3 - 패스워드 해싱
-   **google-auth-library** 9.6.3 - Google OAuth
-   **cors** 2.8.5 - CORS 정책 관리
-   **dotenv** 16.3.1 - 환경변수 관리

## API 엔드포인트

### 사용자

-   `POST /api/user` - 회원가입
-   `GET /api/user/me` - 내 정보 조회

### 인증

-   `POST /api/auth/login` - 이메일 로그인
-   `POST /api/auth/login/google` - Google 로그인

### 상품

-   `GET /api/product` - 상품 목록 (검색/필터링)
-   `POST /api/product` - 상품 생성 (관리자)
-   `PUT /api/product/:id` - 상품 수정 (관리자)
-   `DELETE /api/product/:id` - 상품 삭제 (관리자)

### 장바구니

-   `GET /api/cart` - 장바구니 조회
-   `POST /api/cart` - 장바구니 추가
-   `PUT /api/cart/:id` - 수량 변경
-   `DELETE /api/cart/:id` - 아이템 삭제
-   `GET /api/cart/qty` - 장바구니 아이템 수

### 주문

-   `GET /api/order/me` - 내 주문 내역
-   `POST /api/order` - 주문 생성
-   `GET /api/order` - 전체 주문 조회 (관리자)
-   `PUT /api/order/:id` - 주문 상태 변경 (관리자)

## 프로젝트 구조

```
├── controllers/        # API 비즈니스 로직
├── models/            # MongoDB 스키마 정의
├── routes/            # Express 라우터
├── utils/             # 유틸리티 함수
├── middlewares/       # 인증, 권한 체크
└── app.js             # Express 앱 설정
```

## 개발기간

2025.08.01 ~ 2025.08.17 (2주)
