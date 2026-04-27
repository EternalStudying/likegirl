create table if not exists couple_profile (
    id bigint primary key auto_increment,
    person_a varchar(50) not null,
    person_b varchar(50) not null,
    start_date date not null,
    anniversary_date date not null,
    slogan varchar(200) not null
);

create table if not exists memories (
    id bigint primary key auto_increment,
    title varchar(120) not null,
    memory_date date not null,
    content text not null
);

create table if not exists memory_tags (
    id bigint primary key auto_increment,
    memory_id bigint not null,
    tag varchar(40) not null,
    constraint fk_memory_tags_memory foreign key (memory_id) references memories(id) on delete cascade
);

create table if not exists photos (
    id bigint primary key auto_increment,
    url varchar(500) not null,
    caption varchar(120) not null,
    photo_date date not null
);

create table if not exists wish_items (
    id bigint primary key auto_increment,
    title varchar(160) not null,
    done boolean not null default false
);

create table if not exists messages (
    id bigint primary key auto_increment,
    nickname varchar(80) not null,
    content text not null,
    created_at datetime not null
);

create table if not exists auth_user (
    id bigint primary key auto_increment,
    username varchar(60) not null unique,
    display_name varchar(80) not null,
    password_hash varchar(100) not null,
    avatar_url varchar(500) null,
    bio varchar(200) null,
    mood varchar(80) null,
    updated_at datetime not null default current_timestamp on update current_timestamp
);
