DROP TABLE IF EXISTS notifications, comments, post_likes, posts, user_follows, users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    google_id TEXT UNIQUE,
    apple_id TEXT UNIQUE,
    profile_img TEXT DEFAULT '',
    cover_img TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    link TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_password_change TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_follows (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (from_user_id, to_user_id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    img TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (post_id, user_id)
);

CREATE TABLE post_bookmarks (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (post_id, user_id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    img TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('follow', 'like')),
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CHECK (
        (type = 'like' AND post_id IS NOT NULL)
        OR
        (type = 'follow' AND post_id IS NULL)
    )
);

/*
    참고용 - notifications 테이블 ALTER 쿼리 모음

    1. post_id 컬럼 추가
        ALTER TABLE notifications
        ADD COLUMN post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE;

    2. 데이터 수정
        UPDATE notifications
        SET post_id = 1
        WHERE type = 'like' AND post_id IS NULL;

    3. 조건 제약 추가 (type에 따라 post_id 유효성 제한)
        ALTER TABLE notifications
        ADD CONSTRAINT check_post_id_condition
        CHECK (
            (type = 'like' AND post_id IS NOT NULL)
            OR
            (type = 'follow' AND post_id IS NULL)
        );

    4. post_id 컬럼 삭제
        ALTER TABLE notifications
        DROP COLUMN post_id;

    5. 조건 제약 삭제
        ALTER TABLE notifications
        DROP CONSTRAINT check_post_id_condition;
*/
