package cn.kikiw.likegirl.mapper;

import cn.kikiw.likegirl.entity.AuthUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface AuthUserMapper {

    @Select("""
            select id, username, display_name, password_hash, avatar_url, bio, mood, updated_at
            from auth_user
            where username = #{username}
            limit 1
            """)
    @Results(id = "authUserMap", value = {
            @Result(column = "display_name", property = "displayName"),
            @Result(column = "password_hash", property = "passwordHash"),
            @Result(column = "avatar_url", property = "avatarUrl"),
            @Result(column = "updated_at", property = "updatedAt")
    })
    AuthUser findByUsername(String username);

    @Select("""
            select id, username, display_name, password_hash, avatar_url, bio, mood, updated_at
            from auth_user
            where id = #{id}
            limit 1
            """)
    @Results(value = {
            @Result(column = "display_name", property = "displayName"),
            @Result(column = "password_hash", property = "passwordHash"),
            @Result(column = "avatar_url", property = "avatarUrl"),
            @Result(column = "updated_at", property = "updatedAt")
    })
    AuthUser findById(Long id);

    @Update("""
            update auth_user
            set display_name = #{displayName},
                bio = #{bio},
                mood = #{mood}
            where id = #{id}
            """)
    int updateProfile(Long id, String displayName, String bio, String mood);

    @Update("""
            update auth_user
            set avatar_url = #{avatarUrl}
            where id = #{id}
            """)
    int updateAvatar(Long id, String avatarUrl);
}
