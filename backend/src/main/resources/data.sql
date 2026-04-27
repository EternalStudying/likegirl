insert ignore into couple_profile (id, person_a, person_b, start_date, anniversary_date, slogan)
values (1, '小栀', '阿然', '2022-05-20', '2022-05-20', '把普通日子过成喜欢的样子');

insert ignore into memories (id, title, memory_date, content)
values
    (1, '第一次看海', '2022-08-06', '傍晚的海风很温柔，我们走了很久。'),
    (2, '一起搬家', '2023-03-18', '把灯打开的那一刻，新家就有了意义。');

insert ignore into memory_tags (id, memory_id, tag)
values
    (1, 1, '旅行'),
    (2, 1, '海边'),
    (3, 2, '日常'),
    (4, 2, '新家');

insert ignore into photos (id, url, caption, photo_date)
values
    (1, 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80', '牵手散步', '2023-06-01'),
    (2, 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80', '周末约会', '2023-09-09');

insert ignore into wish_items (id, title, done)
values
    (1, '一起去看极光', false),
    (2, '养一盆不会忘记浇水的植物', true),
    (3, '每年拍一张合照', false);

insert ignore into messages (id, nickname, content, created_at)
values (1, '访客', '祝你们每天都开心。', '2026-04-26 12:00:00');
-- Initial password for both users: 123456
insert ignore into auth_user (id, username, display_name, password_hash)
values
    (1, 'xiaozhi', '小栀', '$2a$10$TpcuPT.ru2p8svo8xL3uvuOSzUS0hIFnJfswNnNfPr0gmFmnBqtMa'),
    (2, 'aran', '阿然', '$2a$10$TpcuPT.ru2p8svo8xL3uvuOSzUS0hIFnJfswNnNfPr0gmFmnBqtMa');
